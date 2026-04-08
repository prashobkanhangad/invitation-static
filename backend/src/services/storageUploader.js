const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { randomBytes } = require("crypto");
const sharp = require("sharp");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Storage } = require("@google-cloud/storage");

const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => cb(null, !!(file.mimetype && file.mimetype.startsWith("image/"))),
  limits: { fileSize: 100 * 1024 * 1024 },
});

function safeName(originalName = "image.jpg") {
  const ext = path.extname(originalName) || ".jpg";
  const base = path.basename(originalName, ext).replace(/[^a-z0-9_-]/gi, "").slice(0, 40);
  return `${base || "image"}_${Date.now()}_${randomBytes(3).toString("hex")}${ext}`.toLowerCase();
}

async function uploadToAws({ buffer, contentType, key }) {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) throw new Error("Missing AWS S3 config (AWS_S3_BUCKET/AWS_REGION)");

  const client = new S3Client({
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
    })
  );
  const publicBase = process.env.AWS_S3_PUBLIC_BASE_URL || `https://${bucket}.s3.${region}.amazonaws.com`;
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

async function uploadToGcp({ buffer, contentType, key }) {
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
      throw new Error("Invalid GCP_CREDENTIALS_JSON: must be valid JSON service account credentials");
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

  const bucket = storage.bucket(bucketName);
  await bucket.file(key).save(buffer, {
    resumable: false,
    contentType: contentType || "application/octet-stream",
    metadata: { cacheControl: "public, max-age=31536000" },
  });
  const publicBase = `https://storage.googleapis.com/${bucketName}`;
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

async function uploadBufferByProvider({ buffer, contentType, key, provider }) {
  if (provider === "gcp_storage") return uploadToGcp({ buffer, contentType, key });
  return uploadToAws({ buffer, contentType, key });
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
  uploadImageByProvider,
  uploadImageVariantsByProvider,
};
