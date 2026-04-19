const mongoose = require("mongoose");
const crypto = require("crypto");
const sharp = require("sharp");
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
    const clash = await Project.findOne({ slug: candidate, _id: { $ne: project._id } });
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
  if (!project.photoSelection?.published || project.slug || photos.length === 0) {
    return;
  }
  project.slug = await ensureUniqueProjectSlug(project);
  if (!project.isPublished) project.isPublished = true;
  await project.save();
}
const {
  uploadImageVariantsByProvider,
  downloadObjectBuffer,
  deleteObjectAtKey,
  createDirectUploadWriteUrl,
  safeName,
} = require("./storageUploader");
const { getActiveStorageProvider } = require("./storageSettings");

const MAX_DIRECT_FILE_BYTES = 100 * 1024 * 1024;
const MAX_DIRECT_FILES_PER_BATCH = 120;

async function getStudioProject(user, projectId) {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return null;
  const q = { _id: projectId };
  if (user.role === "studio") q.studioUser = user.id;
  return Project.findOne(q);
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
      .map((t, i) => ({ id: t.id, label: String(t.label || ""), order: Number(t.order ?? i) }));
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
        return { error: { status: 400, message: "Enter a PIN (4–8 digits) to enable protection" } };
      }
    }
  } else if (typeof pin === "string" && pin.trim()) {
    if (!project.photoSelection.pinEnabled) {
      return { error: { status: 400, message: "Turn on PIN protection before setting a PIN" } };
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
  const tabId = typeof payload?.tabId === "string" && payload.tabId ? payload.tabId : null;
  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id || projectId);
  const folder = `photo-selection/${ownerKey}/${projectKey}`;
  const next = [];
  for (const f of files) {
    const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
      file: f,
      folder,
      provider,
    });
    next.push({
      id: `ps_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: displayUrl,
      originalUrl,
      thumbUrl,
      originalName: f.originalname || "",
      mimeType: f.mimetype || "",
      tabId,
      picked: false,
      fav: false,
    });
  }
  project.photoSelection.photos = [...(project.photoSelection.photos || []), ...next];
  await project.save();
  return { photos: next };
}

function stagingPrefixPhotoSelection(userId, projectMongoId) {
  return `studio/${String(userId)}/photo-selection/${String(projectMongoId)}/raw`;
}

async function preparePhotoDirectUploads(user, projectId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const files = Array.isArray(payload?.files) ? payload.files : [];
  if (files.length === 0) return { error: { status: 400, message: "No files requested" } };
  if (files.length > MAX_DIRECT_FILES_PER_BATCH) {
    return { error: { status: 400, message: `Maximum ${MAX_DIRECT_FILES_PER_BATCH} files per batch` } };
  }

  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id);
  const prefix = stagingPrefixPhotoSelection(ownerKey, projectKey);

  const uploads = [];
  for (const meta of files) {
    const originalName = typeof meta?.originalName === "string" ? meta.originalName : "image.jpg";
    const mimeType = typeof meta?.mimeType === "string" ? meta.mimeType : "application/octet-stream";
    const byteSize = Number(meta?.byteSize);
    if (!mimeType.startsWith("image/")) {
      return { error: { status: 400, message: `Not an image: ${originalName}` } };
    }
    if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_DIRECT_FILE_BYTES) {
      return { error: { status: 400, message: `Invalid or too large file: ${originalName} (max 100MB each)` } };
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

async function commitPhotoDirectUploads(user, projectId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (items.length === 0) return { error: { status: 400, message: "No items to commit" } };
  if (items.length > MAX_DIRECT_FILES_PER_BATCH) {
    return { error: { status: 400, message: `Maximum ${MAX_DIRECT_FILES_PER_BATCH} items per commit` } };
  }

  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id);
  const expectedPrefix = stagingPrefixPhotoSelection(ownerKey, projectKey);
  const folder = `photo-selection/${ownerKey}/${projectKey}`;
  const defaultTabId = typeof payload?.tabId === "string" && payload.tabId ? payload.tabId : null;

  const next = [];

  for (const item of items) {
    const key = typeof item?.key === "string" ? item.key : "";
    const originalName = typeof item?.originalName === "string" ? item.originalName : "image.jpg";
    const mimeType = typeof item?.mimeType === "string" ? item.mimeType : "image/jpeg";
    const tabId =
      typeof item?.tabId === "string" && item.tabId ? item.tabId : defaultTabId;

    if (!key || !key.startsWith(`${expectedPrefix}/`)) {
      return { error: { status: 400, message: "Invalid storage key" } };
    }

    let buffer;
    try {
      buffer = await downloadObjectBuffer({ key, provider });
    } catch (e) {
      return { error: { status: 400, message: `Could not read uploaded file: ${originalName}` } };
    }

    try {
      await sharp(buffer).metadata();
    } catch {
      await deleteObjectAtKey({ key, provider }).catch(() => {});
      return { error: { status: 400, message: `Not a valid image: ${originalName}` } };
    }

    const file = { buffer, originalname: originalName, mimetype: mimeType };
    const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
      file,
      folder,
      provider,
    });

    await deleteObjectAtKey({ key, provider }).catch(() => {});

    next.push({
      id: `ps_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: displayUrl,
      originalUrl,
      thumbUrl,
      originalName,
      mimeType,
      tabId,
      picked: false,
      fav: false,
    });
  }

  project.photoSelection.photos = [...(project.photoSelection.photos || []), ...next];
  await project.save();
  return { photos: next };
}

async function updatePhoto(user, projectId, photoId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const photo = (project.photoSelection.photos || []).find((p) => p.id === photoId);
  if (!photo) return { error: { status: 404, message: "Photo not found" } };
  const { picked, fav, tabId } = payload || {};
  if (typeof picked === "boolean") photo.picked = picked;
  if (typeof fav === "boolean") photo.fav = fav;
  if (typeof tabId === "string" || tabId === null) photo.tabId = tabId;
  await project.save();
  return { photo };
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

async function publishProject(user, projectId) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const photos = project.photoSelection?.photos || [];
  if (photos.length === 0) return { error: { status: 400, message: "Add photos before publishing" } };
  if (!project.shareToken) project.shareToken = crypto.randomBytes(24).toString("hex");
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
  deletePhotoSelectionProject,
  publishProject,
};
