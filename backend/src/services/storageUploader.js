const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { randomBytes } = require("crypto");
const sharp = require("sharp");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Storage } = require("@google-cloud/storage");

const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) =>
    cb(null, !!(file.mimetype && file.mimetype.startsWith("image/"))),
  limits: { fileSize: 100 * 1024 * 1024 },
});

function safeName(originalName = "image.jpg") {
  const ext = path.extname(originalName) || ".jpg";
  const base = path
    .basename(originalName, ext)
    .replace(/[^a-z0-9_-]/gi, "")
    .slice(0, 40);
  return `${base || "image"}_${Date.now()}_${randomBytes(3).toString("hex")}${ext}`.toLowerCase();
}

function buildAwsClient() {
  const region = process.env.AWS_REGION;
  if (!region) throw new Error("Missing AWS_REGION");
  return new S3Client({
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });
}

function buildGcpBucket() {
  const bucketName = (process.env.GCP_STORAGE_BUCKET || "").trim();
  if (!bucketName) throw new Error("Missing GCP config (GCP_STORAGE_BUCKET)");

  const credentialsJsonRaw = (process.env.GCP_CREDENTIALS_JSON || "").trim();
  const keyFilenameRaw = (process.env.GCP_KEY_FILENAME || "").trim();
  let storage;
  if (credentialsJsonRaw) {
    try {
      const credentials = JSON.parse(credentialsJsonRaw);
      storage = new Storage({ credentials, projectId: credentials.project_id });
    } catch (_err) {
      throw new Error(
        "Invalid GCP_CREDENTIALS_JSON: must be valid JSON service account credentials",
      );
    }
  } else if (keyFilenameRaw) {
    const keyPath = path.isAbsolute(keyFilenameRaw)
      ? keyFilenameRaw
      : path.resolve(process.cwd(), keyFilenameRaw);
    if (!fs.existsSync(keyPath)) {
      throw new Error(`Invalid GCP_KEY_FILENAME path: ${keyPath}`);
    }
    storage = new Storage({ keyFilename: keyPath });
  } else {
    storage = new Storage();
  }

  return storage.bucket(bucketName);
}

async function uploadToAws({ buffer, contentType, key }) {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region)
    throw new Error("Missing AWS S3 config (AWS_S3_BUCKET/AWS_REGION)");

  const client = buildAwsClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
    }),
  );
  const publicBase =
    process.env.AWS_S3_PUBLIC_BASE_URL ||
    `https://${bucket}.s3.${region}.amazonaws.com`;
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

async function uploadToGcp({ buffer, contentType, key }) {
  const bucket = buildGcpBucket();
  const bucketName = (process.env.GCP_STORAGE_BUCKET || "").trim();
  await bucket.file(key).save(buffer, {
    resumable: false,
    contentType: contentType || "application/octet-stream",
    metadata: { cacheControl: "public, max-age=31536000" },
  });
  const publicBase = `https://storage.googleapis.com/${bucketName}`;
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

async function uploadBufferByProvider({ buffer, contentType, key, provider }) {
  if (provider === "gcp_storage")
    return uploadToGcp({ buffer, contentType, key });
  return uploadToAws({ buffer, contentType, key });
}

async function uploadLocalFileByProvider({
  filePath,
  contentType,
  key,
  provider,
}) {
  if (provider === "gcp_storage") {
    const bucket = buildGcpBucket();
    await bucket.upload(filePath, {
      destination: key,
      contentType: contentType || "application/octet-stream",
      metadata: { cacheControl: "private, max-age=0, no-store" },
    });
    const bucketName = (process.env.GCP_STORAGE_BUCKET || "").trim();
    const publicBase = `https://storage.googleapis.com/${bucketName}`;
    return `${publicBase.replace(/\/$/, "")}/${key}`;
  }

  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region)
    throw new Error("Missing AWS S3 config (AWS_S3_BUCKET/AWS_REGION)");
  const client = buildAwsClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fs.createReadStream(filePath),
      ContentType: contentType || "application/octet-stream",
    }),
  );
  const publicBase =
    process.env.AWS_S3_PUBLIC_BASE_URL ||
    `https://${bucket}.s3.${region}.amazonaws.com`;
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

/**
 * Signed URL for browser → storage PUT. Client must send Content-Type matching `contentType`.
 */
async function createDirectUploadWriteUrl({ key, contentType, provider }) {
  const ct = contentType || "application/octet-stream";
  if (provider === "gcp_storage") {
    const bucket = buildGcpBucket();
    const file = bucket.file(key);
    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 20 * 60 * 1000,
      contentType: ct,
    });
    return { uploadUrl, method: "PUT", headers: { "Content-Type": ct } };
  }

  const awsBucket = process.env.AWS_S3_BUCKET;
  if (!awsBucket) throw new Error("Missing AWS_S3_BUCKET");
  const client = buildAwsClient();
  const command = new PutObjectCommand({
    Bucket: awsBucket,
    Key: key,
    ContentType: ct,
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 20 * 60 });
  return { uploadUrl, method: "PUT", headers: { "Content-Type": ct } };
}

async function downloadObjectBuffer({ key, provider }) {
  if (provider === "gcp_storage") {
    const bucket = buildGcpBucket();
    const [buf] = await bucket.file(key).download();
    return buf;
  }
  const awsBucket = process.env.AWS_S3_BUCKET;
  if (!awsBucket) throw new Error("Missing AWS_S3_BUCKET");
  const client = buildAwsClient();
  const res = await client.send(
    new GetObjectCommand({ Bucket: awsBucket, Key: key }),
  );
  const chunks = [];
  for await (const chunk of res.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function deleteObjectAtKey({ key, provider }) {
  if (provider === "gcp_storage") {
    const bucket = buildGcpBucket();
    await bucket
      .file(key)
      .delete()
      .catch(() => {});
    return;
  }
  const awsBucket = process.env.AWS_S3_BUCKET;
  if (!awsBucket) throw new Error("Missing AWS_S3_BUCKET");
  const client = buildAwsClient();
  await client.send(new DeleteObjectCommand({ Bucket: awsBucket, Key: key }));
}

async function calculatePrefixSizeByProvider({ prefix, provider }) {
  const safePrefix = String(prefix || "").replace(/^\/+/, "");
  if (!safePrefix) return 0;

  if (provider === "gcp_storage") {
    const bucket = buildGcpBucket();
    let total = 0;
    let pageToken = undefined;
    do {
      const [files, nextQuery] = await bucket.getFiles({
        prefix: safePrefix,
        autoPaginate: false,
        maxResults: 1000,
        pageToken,
      });
      for (const file of files) {
        total += Number(file?.metadata?.size || 0);
      }
      pageToken = nextQuery?.pageToken;
    } while (pageToken);
    return total;
  }

  const awsBucket = process.env.AWS_S3_BUCKET;
  if (!awsBucket) throw new Error("Missing AWS_S3_BUCKET");
  const client = buildAwsClient();
  let continuationToken = undefined;
  let total = 0;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: awsBucket,
        Prefix: safePrefix,
        ContinuationToken: continuationToken,
      })
    );
    for (const item of res.Contents || []) total += Number(item?.Size || 0);
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);
  return total;
}

async function uploadImageByProvider({ req, file, folder, provider }) {
  const key = `${folder}/${safeName(file.originalname)}`;
  return uploadBufferByProvider({
    buffer: file.buffer,
    contentType: file.mimetype,
    key,
    provider,
  });
}

async function uploadImageVariantsByProvider({ file, folder, provider }) {
  const originalUrl = await uploadImageByProvider({ file, folder, provider });

  const displayBuffer = await sharp(file.buffer)
    .rotate()
    .resize({ width: 2200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 86 })
    .toBuffer();
  const thumbBuffer = await sharp(file.buffer)
    .rotate()
    .resize({ width: 480, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 76 })
    .toBuffer();

  const displayKey = `${folder}/display/${safeName((file.originalname || "image").replace(/\.[^.]+$/, ".webp"))}`;
  const thumbKey = `${folder}/thumb/${safeName((file.originalname || "image").replace(/\.[^.]+$/, ".webp"))}`;

  const [displayUrl, thumbUrl] = await Promise.all([
    uploadBufferByProvider({
      buffer: displayBuffer,
      contentType: "image/webp",
      key: displayKey,
      provider,
    }),
    uploadBufferByProvider({
      buffer: thumbBuffer,
      contentType: "image/webp",
      key: thumbKey,
      provider,
    }),
  ]);

  return { originalUrl, displayUrl, thumbUrl };
}

module.exports = {
  uploadMemory,
  safeName,
  uploadImageByProvider,
  uploadImageVariantsByProvider,
  createDirectUploadWriteUrl,
  downloadObjectBuffer,
  deleteObjectAtKey,
  calculatePrefixSizeByProvider,
  uploadLocalFileByProvider,
};
