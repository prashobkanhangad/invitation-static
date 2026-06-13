const mongoose = require("mongoose");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const sharp = require("sharp");
const archiver = require("archiver");
const Project = require("../models/Project");
const { hashPhotoSelectionPin } = require("./photoSelectionPin");

function normalizeSlug(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function ensureUniqueProjectSlug(project) {
  let base = normalizeSlug(project.name);
  if (!base) base = "selection";
  let candidate = base;
  for (let n = 0; n < 100; n += 1) {
    const clash = await Project.findOne({
      slug: candidate,
      _id: { $ne: project._id },
    });
    if (!clash) return candidate;
    candidate = `${base}-${n + 1}`;
  }
  return `${base}-${crypto.randomBytes(4).toString("hex")}`;
}

/**
 * Published selections that predate `/photos/{slug}` may lack `slug`.
 * Uses `photoSelection.published` (studio “live” flag); aligns `isPublished` so public `/photos/...` works.
 */
async function ensureSlugForPublishedPhotoSelection(project) {
  const photos = project.photoSelection?.photos || [];
  if (
    !project.photoSelection?.published ||
    project.slug ||
    photos.length === 0
  ) {
    return;
  }
  project.slug = await ensureUniqueProjectSlug(project);
  if (!project.isPublished) project.isPublished = true;
  await project.save();
}
const {
  uploadImageVariantsByProvider,
  uploadPhotoSelectionAssetsByProvider,
  uploadPhotoSelectionAssetsFromDirectStaging,
  downloadObjectBuffer,
  deleteObjectAtKey,
  createDirectUploadWriteUrl,
  uploadLocalFileByProvider,
  safeName,
} = require("./storageUploader");
const { getActiveStorageProvider } = require("./storageSettings");
const {
  resolvePhotoSelectionDownloadMeta,
  sanitizeFilename: sanitizeDownloadFilename,
} = require("./photoSelectionDownloadResolve");

const MAX_DIRECT_FILE_BYTES = 100 * 1024 * 1024;
const MAX_DIRECT_FILES_PER_BATCH = 120;
const COMMIT_CONCURRENCY = Math.min(
  8,
  Math.max(1, Number(process.env.PHOTO_COMMIT_CONCURRENCY) || 4),
);

async function poolMap(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function run() {
    while (true) {
      const i = nextIndex;
      nextIndex += 1;
      if (i >= items.length) break;
      results[i] = await worker(items[i], i);
    }
  }
  const workers = Math.min(concurrency, Math.max(1, items.length));
  await Promise.all(Array.from({ length: workers }, () => run()));
  return results;
}

async function getStudioProject(user, projectId) {
  const q = studioProjectQuery(user, projectId);
  if (!q) return null;
  return Project.findOne(q);
}

function studioProjectQuery(user, projectId) {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return null;
  const q = { _id: projectId };
  if (user.role === "studio") q.studioUser = user.id;
  return q;
}

/** Atomically append photos — avoids VersionError when the project changes during long uploads. */
async function appendPhotoSelectionPhotos(user, projectId, newPhotos) {
  const q = studioProjectQuery(user, projectId);
  if (!q) return { error: { status: 404, message: "Project not found" } };
  if (!Array.isArray(newPhotos) || newPhotos.length === 0) {
    return { error: { status: 400, message: "No photos to append" } };
  }
  const updated = await Project.findOneAndUpdate(
    q,
    { $push: { "photoSelection.photos": { $each: newPhotos } } },
    { new: true },
  );
  if (!updated) return { error: { status: 404, message: "Project not found" } };
  return { project: updated };
}

function isTruthyPinEnabled(v) {
  return v === true || v === "true" || v === 1 || v === "1";
}

function validateSelectionPin(pin) {
  if (typeof pin !== "string" || !/^\d{4,8}$/.test(pin.trim())) {
    return { error: { status: 400, message: "PIN must be 4–8 digits" } };
  }
  return { pin: pin.trim() };
}

function extensionFromMime(mimeType) {
  if (!mimeType) return "jpg";
  if (mimeType.includes("jpeg") || mimeType === "image/jpg") return "jpg";
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("gif")) return "gif";
  return "jpg";
}

function sanitizeFilename(name) {
  return String(name || "")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .trim();
}

function originalFileNameFromSource(rawName, fallbackBase, ext) {
  const safe = sanitizeFilename(rawName || fallbackBase) || fallbackBase;
  return /\.[a-z0-9]{1,8}$/i.test(safe) ? safe : `${safe}.${ext}`;
}

function toValidByteSize(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

async function createProject(user, payload) {
  const { name, goal = 0, pinEnabled: pinEnabledRaw, pin } = payload || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return { error: { status: 400, message: "Project name is required" } };
  }
  const pinOn = isTruthyPinEnabled(pinEnabledRaw);
  let pinHash = "";
  if (pinOn) {
    const checked = validateSelectionPin(pin);
    if (checked.error) return checked;
    pinHash = hashPhotoSelectionPin(checked.pin);
  }

  const project = await Project.create({
    studioUser: user.id,
    client: null,
    name: name.trim(),
    template: null,
    templateId: null,
    images: [],
    photoSelection: {
      goal: Number(goal) || 0,
      clientTabs: [],
      photos: [],
      published: false,
      publishedAt: null,
      pinEnabled: pinOn,
      pinHash,
    },
  });
  return { project };
}

async function listProjects(user) {
  const q = user.role === "studio" ? { studioUser: user.id } : {};
  const projects = await Project.find(q).sort({ updatedAt: -1 });
  for (const project of projects) {
    await ensureSlugForPublishedPhotoSelection(project);
  }
  return { projects };
}

async function getProject(user, projectId) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  await ensureSlugForPublishedPhotoSelection(project);
  return { project };
}

async function updateProject(user, projectId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const { name, goal, clientTabs, pinEnabled, pin } = payload || {};
  if (typeof name === "string" && name.trim()) project.name = name.trim();
  if (typeof goal === "number") project.photoSelection.goal = goal;
  if (Array.isArray(clientTabs)) {
    project.photoSelection.clientTabs = clientTabs
      .filter((t) => t && typeof t.id === "string")
      .map((t, i) => ({
        id: t.id,
        label: String(t.label || ""),
        order: Number(t.order ?? i),
      }));
  }

  if (typeof pinEnabled === "boolean") {
    if (pinEnabled === false) {
      project.photoSelection.pinEnabled = false;
      project.photoSelection.pinHash = "";
    } else {
      project.photoSelection.pinEnabled = true;
      if (typeof pin === "string" && pin.trim()) {
        const checked = validateSelectionPin(pin);
        if (checked.error) return checked;
        project.photoSelection.pinHash = hashPhotoSelectionPin(checked.pin);
      } else if (!project.photoSelection.pinHash) {
        return {
          error: {
            status: 400,
            message: "Enter a PIN (4–8 digits) to enable protection",
          },
        };
      }
    }
  } else if (typeof pin === "string" && pin.trim()) {
    if (!project.photoSelection.pinEnabled) {
      return {
        error: {
          status: 400,
          message: "Turn on PIN protection before setting a PIN",
        },
      };
    }
    const checked = validateSelectionPin(pin);
    if (checked.error) return checked;
    project.photoSelection.pinHash = hashPhotoSelectionPin(checked.pin);
  }

  await project.save();
  return { project };
}

async function uploadPhotos(user, projectId, files, payload, req) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  if (!Array.isArray(files) || files.length === 0) {
    return { error: { status: 400, message: "No images uploaded" } };
  }
  const tabId =
    typeof payload?.tabId === "string" && payload.tabId ? payload.tabId : null;
  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id || projectId);
  const folder = `photo-selection/${ownerKey}/${projectKey}`;
  const next = [];
  for (const f of files) {
    const { originalUrl, thumbUrl } = await uploadPhotoSelectionAssetsByProvider({
      file: f,
      folder,
      provider,
    });
    next.push({
      id: `ps_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: originalUrl,
      originalUrl,
      thumbUrl,
      originalName: f.originalname || "",
      mimeType: f.mimetype || "",
      byteSize: toValidByteSize(f.size || f.buffer?.length),
      tabId,
      picked: false,
      fav: false,
    });
  }
  const appendResult = await appendPhotoSelectionPhotos(user, projectId, next);
  if (appendResult.error) return appendResult;
  return { photos: next };
}

function stagingPrefixPhotoSelection(userId, projectMongoId) {
  return `studio/${String(userId)}/photo-selection/${String(projectMongoId)}/raw`;
}

async function preparePhotoDirectUploads(user, projectId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const files = Array.isArray(payload?.files) ? payload.files : [];
  if (files.length === 0)
    return { error: { status: 400, message: "No files requested" } };
  if (files.length > MAX_DIRECT_FILES_PER_BATCH) {
    return {
      error: {
        status: 400,
        message: `Maximum ${MAX_DIRECT_FILES_PER_BATCH} files per batch`,
      },
    };
  }

  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id);
  const prefix = stagingPrefixPhotoSelection(ownerKey, projectKey);

  const uploads = [];
  for (const meta of files) {
    const originalName =
      typeof meta?.originalName === "string" ? meta.originalName : "image.jpg";
    const mimeType =
      typeof meta?.mimeType === "string"
        ? meta.mimeType
        : "application/octet-stream";
    const byteSize = Number(meta?.byteSize);
    if (!mimeType.startsWith("image/")) {
      return {
        error: { status: 400, message: `Not an image: ${originalName}` },
      };
    }
    if (
      !Number.isFinite(byteSize) ||
      byteSize <= 0 ||
      byteSize > MAX_DIRECT_FILE_BYTES
    ) {
      return {
        error: {
          status: 400,
          message: `Invalid or too large file: ${originalName} (max 100MB each)`,
        },
      };
    }
    const key = `${prefix}/${crypto.randomBytes(14).toString("hex")}_${safeName(originalName)}`;
    const { uploadUrl, method, headers } = await createDirectUploadWriteUrl({
      key,
      contentType: mimeType,
      provider,
    });
    uploads.push({
      key,
      originalName,
      mimeType,
      byteSize,
      uploadUrl,
      method,
      headers,
    });
  }
  return { uploads, expiresInSeconds: 1200 };
}

async function commitPhotoDirectUploads(
  user,
  projectId,
  payload,
  options = {},
) {
  const onProgress =
    typeof options?.onProgress === "function" ? options.onProgress : null;
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (items.length === 0)
    return { error: { status: 400, message: "No items to commit" } };
  if (items.length > MAX_DIRECT_FILES_PER_BATCH) {
    return {
      error: {
        status: 400,
        message: `Maximum ${MAX_DIRECT_FILES_PER_BATCH} items per commit`,
      },
    };
  }

  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id);
  const expectedPrefix = stagingPrefixPhotoSelection(ownerKey, projectKey);
  const folder = `photo-selection/${ownerKey}/${projectKey}`;
  const defaultTabId =
    typeof payload?.tabId === "string" && payload.tabId ? payload.tabId : null;

  const next = [];
  let progressDone = 0;
  if (onProgress)
    await onProgress({
      total: items.length,
      done: 0,
      message: "Processing photos",
    });

  const reportProgress = async () => {
    if (!onProgress) return;
    await onProgress({
      total: items.length,
      done: progressDone,
      message: `Processed ${progressDone}/${items.length}`,
    });
  };

  try {
    const processed = await poolMap(items, COMMIT_CONCURRENCY, async (item) => {
      const key = typeof item?.key === "string" ? item.key : "";
      const originalName =
        typeof item?.originalName === "string" ? item.originalName : "image.jpg";
      const mimeType =
        typeof item?.mimeType === "string" ? item.mimeType : "image/jpeg";
      const tabId =
        typeof item?.tabId === "string" && item.tabId ? item.tabId : defaultTabId;

      if (!key || !key.startsWith(`${expectedPrefix}/`)) {
        throw Object.assign(new Error("Invalid storage key"), {
          status: 400,
        });
      }

      let buffer;
      try {
        buffer = await downloadObjectBuffer({ key, provider });
      } catch {
        throw Object.assign(
          new Error(`Could not read uploaded file: ${originalName}`),
          { status: 400 },
        );
      }

      const file = { buffer, originalname: originalName, mimetype: mimeType };
      let originalUrl;
      let thumbUrl;
      try {
        ({ originalUrl, thumbUrl } =
          await uploadPhotoSelectionAssetsFromDirectStaging({
            buffer,
            stagingKey: key,
            file,
            folder,
            provider,
          }));
      } catch {
        await deleteObjectAtKey({ key, provider }).catch(() => {});
        throw Object.assign(new Error(`Not a valid image: ${originalName}`), {
          status: 400,
        });
      }

      await deleteObjectAtKey({ key, provider }).catch(() => {});

      progressDone += 1;
      await reportProgress();

      return {
        id: `ps_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        url: originalUrl,
        originalUrl,
        thumbUrl,
        originalName,
        mimeType,
        byteSize: toValidByteSize(item?.byteSize || buffer?.length),
        tabId,
        picked: false,
        fav: false,
      };
    });
    next.push(...processed);
  } catch (err) {
    return {
      error: {
        status: err.status || 500,
        message: err.message || "Photo processing failed",
      },
    };
  }

  const appendResult = await appendPhotoSelectionPhotos(user, projectId, next);
  if (appendResult.error) return appendResult;
  return { photos: next };
}

async function updatePhoto(user, projectId, photoId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const photo = (project.photoSelection.photos || []).find(
    (p) => p.id === photoId,
  );
  if (!photo) return { error: { status: 404, message: "Photo not found" } };
  const { picked, fav, tabId } = payload || {};
  if (typeof picked === "boolean") photo.picked = picked;
  if (typeof fav === "boolean") photo.fav = fav;
  if (typeof tabId === "string" || tabId === null) photo.tabId = tabId;
  await project.save();
  return { photo };
}

async function uploadPhotoSelectionOgImage(user, projectId, file) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  if (!file?.buffer)
    return { error: { status: 400, message: "Image file is required" } };

  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id || projectId);
  const folder = `photo-selection/${ownerKey}/${projectKey}/og`;
  const { originalUrl, displayUrl, thumbUrl } =
    await uploadImageVariantsByProvider({
      file,
      folder,
      provider,
    });

  const previousOg = project.photoSelection?.ogImage || null;
  project.photoSelection.ogImage = {
    id: `psog_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    url: displayUrl,
    originalUrl,
    thumbUrl,
    originalName: file.originalname || "",
    mimeType: file.mimetype || "",
    byteSize: toValidByteSize(file.size || file.buffer?.length),
  };
  await project.save();

  const oldUrls = [
    previousOg?.url,
    previousOg?.originalUrl,
    previousOg?.thumbUrl,
  ]
    .map((url) => objectKeyFromUrl(url))
    .filter(Boolean);
  if (oldUrls.length) {
    await Promise.all(
      oldUrls.map((key) =>
        deleteObjectAtKey({ key, provider }).catch(() => {}),
      ),
    );
  }

  return { ogImage: project.photoSelection.ogImage, project };
}

async function preparePhotoSelectionOgImageDirectUpload(user, projectId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };

  const meta = payload?.file;
  const originalName = typeof meta?.originalName === "string" ? meta.originalName : "og-image.jpg";
  const mimeType = typeof meta?.mimeType === "string" ? meta.mimeType : "image/jpeg";
  const byteSize = Number(meta?.byteSize);
  if (!mimeType.startsWith("image/")) return { error: { status: 400, message: "OG image must be an image" } };
  if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_DIRECT_FILE_BYTES) {
    return { error: { status: 400, message: "Invalid OG image file size (max 100MB)" } };
  }

  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id);
  const prefix = stagingPrefixPhotoSelection(ownerKey, projectKey);
  const key = `${prefix}/og_${crypto.randomBytes(14).toString("hex")}_${safeName(originalName)}`;
  const { uploadUrl, method, headers } = await createDirectUploadWriteUrl({
    key,
    contentType: mimeType,
    provider,
  });

  return {
    upload: {
      key,
      originalName,
      mimeType,
      byteSize,
      uploadUrl,
      method,
      headers,
    },
    expiresInSeconds: 1200,
  };
}

async function commitPhotoSelectionOgImageDirectUpload(user, projectId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };

  const key = typeof payload?.key === "string" ? payload.key : "";
  const originalName = typeof payload?.originalName === "string" ? payload.originalName : "og-image.jpg";
  const mimeType = typeof payload?.mimeType === "string" ? payload.mimeType : "image/jpeg";

  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id);
  const expectedPrefix = stagingPrefixPhotoSelection(ownerKey, projectKey);
  if (!key || !key.startsWith(`${expectedPrefix}/og_`)) {
    return { error: { status: 400, message: "Invalid storage key" } };
  }

  const provider = await getActiveStorageProvider();
  const folder = `photo-selection/${ownerKey}/${projectKey}/og`;

  let buffer;
  try {
    buffer = await downloadObjectBuffer({ key, provider });
  } catch {
    return { error: { status: 400, message: "Could not read uploaded OG image" } };
  }
  try {
    await sharp(buffer).metadata();
  } catch {
    await deleteObjectAtKey({ key, provider }).catch(() => {});
    return { error: { status: 400, message: "Not a valid image" } };
  }

  const file = { buffer, originalname: originalName, mimetype: mimeType };
  const uploaded = await uploadPhotoSelectionOgImage(user, projectId, file);
  await deleteObjectAtKey({ key, provider }).catch(() => {});
  return uploaded;
}

function objectKeyFromUrl(url) {
  if (!url || typeof url !== "string") return "";
  try {
    const parsed = new URL(url);
    const key = parsed.pathname.replace(/^\/+/, "");
    if (!key) return "";
    const bucketName = String(process.env.GCP_STORAGE_BUCKET || "").trim();
    if (bucketName && key.startsWith(`${bucketName}/`)) {
      return key.slice(bucketName.length + 1);
    }
    return key;
  } catch {
    return "";
  }
}

async function deletePhoto(user, projectId, photoId) {
  const q = studioProjectQuery(user, projectId);
  if (!q) return { error: { status: 404, message: "Project not found" } };

  const project = await Project.findOne(q, {
    "photoSelection.photos.id": 1,
    "photoSelection.photos.url": 1,
    "photoSelection.photos.originalUrl": 1,
    "photoSelection.photos.thumbUrl": 1,
  });
  if (!project) return { error: { status: 404, message: "Project not found" } };

  const photos = Array.isArray(project.photoSelection?.photos)
    ? project.photoSelection.photos
    : [];
  const photo = photos.find((p) => p.id === photoId);
  if (!photo) return { error: { status: 404, message: "Photo not found" } };

  await Project.updateOne(q, {
    $pull: { "photoSelection.photos": { id: photoId } },
  });

  const provider = await getActiveStorageProvider();
  const keys = [
    ...new Set(
      [photo?.url, photo?.originalUrl, photo?.thumbUrl]
        .map((url) => objectKeyFromUrl(url))
        .filter(Boolean),
    ),
  ];
  await Promise.all(
    keys.map((key) => deleteObjectAtKey({ key, provider }).catch(() => {})),
  );

  return { ok: true, photoId };
}

async function deletePhotoSelectionProject(user, projectId) {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return { error: { status: 400, message: "Invalid project id" } };
  }
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  await Project.deleteOne({ _id: project._id });
  return { ok: true };
}

async function resolvePhotoDownload(
  user,
  projectId,
  photoId,
  variant = "original",
) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  if (!photoId) return { error: { status: 400, message: "photoId required" } };

  const photo = (project.photoSelection?.photos || []).find(
    (p) => p.id === photoId,
  );
  if (!photo) return { error: { status: 404, message: "Photo not found" } };

  const resolved = resolvePhotoSelectionDownloadMeta(photo, variant);
  if (!resolved)
    return { error: { status: 404, message: "Photo URL not found" } };

  return resolved;
}

async function resolveSelectedPhotosDownload(
  user,
  projectId,
  variant = "original",
) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };

  const pickedPhotos = (project.photoSelection?.photos || []).filter((p) =>
    Boolean(p?.picked),
  );
  if (pickedPhotos.length === 0) {
    return {
      error: { status: 400, message: "No selected photos to download" },
    };
  }

  const nameCounts = new Map();
  const items = pickedPhotos
    .map((photo) => {
      const resolved = resolvePhotoSelectionDownloadMeta(photo, variant);
      if (!resolved) return null;

      const rawBase =
        sanitizeFilename(photo.originalName || photo.id || "photo") || "photo";
      const base = rawBase.replace(/\.[^.]+$/, "") || "photo";
      const ext = extensionFromMime(photo.mimeType);
      const key =
        variant === "original"
          ? `${resolved.fileName}|original|${ext}`
          : `${base}|optimized|webp`;
      const count = nameCounts.get(key) || 0;
      nameCounts.set(key, count + 1);
      const suffix = count > 0 ? `-${count + 1}` : "";
      const fileName =
        variant === "original"
          ? suffix
            ? resolved.fileName.replace(/(\.[a-z0-9]{1,8})$/i, `${suffix}$1`)
            : resolved.fileName
          : `${base}${suffix}-optimized.webp`;

      return {
        sourceUrl: resolved.sourceUrl,
        fileName,
      };
    })
    .filter(Boolean);

  if (items.length === 0) {
    return {
      error: { status: 404, message: "Selected photos are missing URLs" },
    };
  }

  const rawProjectName = sanitizeDownloadFilename(
    project.name || "selected-photos",
  );
  const safeProjectName =
    rawProjectName.replace(/\.[^.]+$/, "") || "selected-photos";
  const zipFileName =
    variant === "original"
      ? `${safeProjectName}-selected-original.zip`
      : `${safeProjectName}-selected-optimized.zip`;

  return {
    items,
    zipFileName,
  };
}

async function buildSelectedPhotosDownloadArtifact(
  user,
  projectId,
  variant = "original",
  onProgress,
) {
  const resolved = await resolveSelectedPhotosDownload(
    user,
    projectId,
    variant,
  );
  if (resolved.error) return resolved;

  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "psdl-"));
  const zipPath = path.join(tmpDir, resolved.zipFileName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  await new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
    archive.pipe(output);

    (async () => {
      if (onProgress) {
        await onProgress({
          total: resolved.items.length,
          done: 0,
          message: "Preparing selected photos...",
        });
      }
      let done = 0;
      for (const item of resolved.items) {
        try {
          const upstream = await fetch(item.sourceUrl);
          if (upstream.ok) {
            const arrayBuffer = await upstream.arrayBuffer();
            archive.append(Buffer.from(arrayBuffer), { name: item.fileName });
          }
        } finally {
          done += 1;
          if (onProgress) {
            await onProgress({
              total: resolved.items.length,
              done,
              message: `Bundling ${done}/${resolved.items.length}`,
            });
          }
        }
      }
      await archive.finalize();
    })().catch(reject);
  });

  try {
    const provider = await getActiveStorageProvider();
    const key = `studio/${String(user.id)}/photo-selection/${String(projectId)}/downloads/${safeName(resolved.zipFileName)}`;
    const downloadUrl = await uploadLocalFileByProvider({
      filePath: zipPath,
      contentType: "application/zip",
      key,
      provider,
    });

    return {
      downloadUrl,
      fileName: resolved.zipFileName,
      totalFiles: resolved.items.length,
      variant,
    };
  } finally {
    await fs.promises
      .rm(tmpDir, { recursive: true, force: true })
      .catch(() => {});
  }
}

async function publishProject(user, projectId) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const photos = project.photoSelection?.photos || [];
  if (photos.length === 0)
    return { error: { status: 400, message: "Add photos before publishing" } };
  if (!project.shareToken)
    project.shareToken = crypto.randomBytes(24).toString("hex");
  if (!project.slug) project.slug = await ensureUniqueProjectSlug(project);
  project.isPublished = true;
  project.photoSelection.published = true;
  project.photoSelection.publishedAt = new Date();
  await project.save();
  return { message: "Photo selection published", project };
}

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  uploadPhotos,
  preparePhotoDirectUploads,
  commitPhotoDirectUploads,
  updatePhoto,
  uploadPhotoSelectionOgImage,
  preparePhotoSelectionOgImageDirectUpload,
  commitPhotoSelectionOgImageDirectUpload,
  resolvePhotoDownload,
  resolveSelectedPhotosDownload,
  buildSelectedPhotosDownloadArtifact,
  deletePhoto,
  deletePhotoSelectionProject,
  publishProject,
};
