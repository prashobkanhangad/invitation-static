const crypto = require("crypto");
const mongoose = require("mongoose");
const sharp = require("sharp");
const Album = require("../models/Album");
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

function stagingPrefixAlbum(userId, albumMongoId) {
  return `studio/${String(userId)}/albums/${String(albumMongoId)}/raw`;
}

function normalizeSlug(input) {
  if (!input || typeof input !== "string") return "";
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function toValidByteSize(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

async function getStudioAlbum(user, albumId) {
  const q = { _id: albumId };
  if (user.role === "studio") q.studioUser = user.id;
  return Album.findOne(q);
}

async function createAlbum(user, payload) {
  const { title, templateId = "album-default", projectId = null } = payload || {};
  if (!title || typeof title !== "string" || !title.trim()) {
    return { error: { status: 400, message: "Album title is required" } };
  }
  const album = await Album.create({
    studioUser: user.id,
    project: projectId || null,
    title: title.trim(),
    templateId,
    bannerImage: null,
    highlights: [],
    galleryTabs: [{ id: "tab-main", label: "Main", order: 0, images: [] }],
    status: "draft",
    isPublished: false,
  });
  return { album };
}

async function listAlbums(user) {
  const q = user.role === "studio" ? { studioUser: user.id } : {};
  const albums = await Album.find(q).sort({ updatedAt: -1 });
  return { albums };
}

async function getAlbum(user, albumId) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  return { album };
}

function clampBannerPositionString(v) {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  if (t.length > 48) return null;
  return t;
}

async function updateAlbum(user, albumId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const { title, galleryTabs, bannerHeroDesktopPosition, bannerHeroMobilePosition } = payload || {};
  let titleChanged = false;
  if (typeof title === "string" && title.trim()) {
    const nextTitle = title.trim();
    if (nextTitle !== album.title) titleChanged = true;
    album.title = nextTitle;
  }
  if (titleChanged) {
    let nextSlug = normalizeSlug(album.title);
    if (!nextSlug) nextSlug = `a_${crypto.randomBytes(3).toString("hex")}`;
    const slugTaken = await Album.findOne({ slug: nextSlug, _id: { $ne: album._id } });
    if (slugTaken) {
      return {
        error: {
          status: 409,
          message:
            "That title maps to a URL already used by another album. Change the name slightly (the public link uses this URL).",
        },
      };
    }
    album.slug = nextSlug;
  }
  const d = clampBannerPositionString(bannerHeroDesktopPosition);
  if (d !== null) album.bannerHeroDesktopPosition = d;
  const m = clampBannerPositionString(bannerHeroMobilePosition);
  if (m !== null) album.bannerHeroMobilePosition = m;
  if (Array.isArray(galleryTabs)) {
    album.galleryTabs = galleryTabs
      .filter((t) => t && typeof t.id === "string")
      .map((t, idx) => ({
        id: t.id,
        label: String(t.label || `Tab ${idx + 1}`),
        order: Number(t.order ?? idx),
        images: Array.isArray(t.images) ? t.images : [],
      }));
  }
  await album.save();
  return { album };
}

async function uploadBanner(user, albumId, file, req) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  if (!file) return { error: { status: 400, message: "No image uploaded" } };
  const provider = await getActiveStorageProvider();
  const folder = `albums/${String(user.id || "unknown-user")}/${String(album._id || albumId)}`;
  const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
    file,
    folder,
    provider,
  });
  album.bannerImage = {
    id: `bn_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    url: displayUrl,
    originalUrl,
    thumbUrl,
    originalName: file.originalname || "",
    mimeType: file.mimetype || "",
    byteSize: toValidByteSize(file.size || file.buffer?.length),
    order: 0,
  };
  await album.save();
  return { bannerImage: album.bannerImage };
}

async function uploadHighlights(user, albumId, files, req) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  if (!Array.isArray(files) || files.length === 0) {
    return { error: { status: 400, message: "No images uploaded" } };
  }
  const provider = await getActiveStorageProvider();
  const folder = `albums/${String(user.id || "unknown-user")}/${String(album._id || albumId)}`;
  const start = album.highlights.length;
  const added = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
      file,
      folder,
      provider,
    });
    added.push({
      id: `hl_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: displayUrl,
      originalUrl,
      thumbUrl,
      originalName: file.originalname || "",
      mimeType: file.mimetype || "",
      byteSize: toValidByteSize(file.size || file.buffer?.length),
      order: start + i,
    });
  }
  album.highlights = [...album.highlights, ...added];
  await album.save();
  return { highlights: added };
}

async function createGalleryTab(user, albumId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const { label = "" } = payload || {};
  const tab = {
    id: `tab_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    label: String(label || `Tab ${album.galleryTabs.length + 1}`),
    order: album.galleryTabs.length,
    images: [],
  };
  album.galleryTabs.push(tab);
  await album.save();
  return { tab };
}

async function updateGalleryTab(user, albumId, tabId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const tab = album.galleryTabs.find((t) => t.id === tabId);
  if (!tab) return { error: { status: 404, message: "Tab not found" } };
  const { label, order } = payload || {};
  if (typeof label === "string") tab.label = label;
  if (typeof order === "number") tab.order = order;
  await album.save();
  return { tab };
}

async function deleteGalleryTab(user, albumId, tabId) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  album.galleryTabs = album.galleryTabs.filter((t) => t.id !== tabId);
  if (album.galleryTabs.length === 0) {
    album.galleryTabs = [{ id: "tab-main", label: "Main", order: 0, images: [] }];
  }
  await album.save();
  return { ok: true, galleryTabs: album.galleryTabs };
}

async function uploadTabImages(user, albumId, tabId, files, req) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const tab = album.galleryTabs.find((t) => t.id === tabId);
  if (!tab) return { error: { status: 404, message: "Tab not found" } };
  if (!Array.isArray(files) || files.length === 0) {
    return { error: { status: 400, message: "No images uploaded" } };
  }
  const provider = await getActiveStorageProvider();
  const folder = `albums/${String(user.id || "unknown-user")}/${String(album._id || albumId)}`;
  const start = tab.images.length;
  const added = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
      file,
      folder,
      provider,
    });
    added.push({
      id: `gi_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: displayUrl,
      originalUrl,
      thumbUrl,
      originalName: file.originalname || "",
      mimeType: file.mimetype || "",
      byteSize: toValidByteSize(file.size || file.buffer?.length),
      order: start + i,
    });
  }
  tab.images = [...tab.images, ...added];
  await album.save();
  return { images: added };
}

async function deleteImage(user, albumId, imageId) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  if (album.bannerImage && album.bannerImage.id === imageId) {
    album.bannerImage = null;
    await album.save();
    return { ok: true };
  }
  album.highlights = album.highlights.filter((img) => img.id !== imageId);
  album.galleryTabs = album.galleryTabs.map((t) => ({
    ...t.toObject(),
    images: t.images.filter((img) => img.id !== imageId),
  }));
  await album.save();
  return { ok: true };
}

async function prepareBannerDirectUpload(user, albumId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const meta = payload?.file;
  const originalName = typeof meta?.originalName === "string" ? meta.originalName : "banner.jpg";
  const mimeType = typeof meta?.mimeType === "string" ? meta.mimeType : "image/jpeg";
  const byteSize = Number(meta?.byteSize);
  if (!mimeType.startsWith("image/")) return { error: { status: 400, message: "Banner must be an image" } };
  if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_DIRECT_FILE_BYTES) {
    return { error: { status: 400, message: "Invalid banner file size (max 100MB)" } };
  }
  const provider = await getActiveStorageProvider();
  const prefix = stagingPrefixAlbum(user.id, album._id);
  const key = `${prefix}/banner_${crypto.randomBytes(12).toString("hex")}_${safeName(originalName)}`;
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

async function commitBannerDirectUpload(user, albumId, payload, options = {}) {
  const onProgress = typeof options?.onProgress === "function" ? options.onProgress : null;
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const key = typeof payload?.key === "string" ? payload.key : "";
  const originalName = typeof payload?.originalName === "string" ? payload.originalName : "banner.jpg";
  const mimeType = typeof payload?.mimeType === "string" ? payload.mimeType : "image/jpeg";
  const expectedPrefix = stagingPrefixAlbum(user.id, album._id);
  if (!key || !key.startsWith(`${expectedPrefix}/`)) {
    return { error: { status: 400, message: "Invalid storage key" } };
  }
  const provider = await getActiveStorageProvider();
  const folder = `albums/${String(user.id || "unknown-user")}/${String(album._id)}`;
  if (onProgress) await onProgress({ total: 1, done: 0, message: "Processing banner" });
  let buffer;
  try {
    buffer = await downloadObjectBuffer({ key, provider });
  } catch {
    return { error: { status: 400, message: "Could not read uploaded banner" } };
  }
  try {
    await sharp(buffer).metadata();
  } catch {
    await deleteObjectAtKey({ key, provider }).catch(() => {});
    return { error: { status: 400, message: "Not a valid image" } };
  }
  const file = { buffer, originalname: originalName, mimetype: mimeType };
  const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
    file,
    folder,
    provider,
  });
  await deleteObjectAtKey({ key, provider }).catch(() => {});
  album.bannerImage = {
    id: `bn_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    url: displayUrl,
    originalUrl,
    thumbUrl,
    originalName,
    mimeType,
    byteSize: toValidByteSize(payload?.byteSize || payload?.file?.byteSize || buffer?.length),
    order: 0,
  };
  await album.save();
  if (onProgress) await onProgress({ total: 1, done: 1, message: "Banner committed" });
  return { bannerImage: album.bannerImage };
}

async function prepareHighlightsDirectUploads(user, albumId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const files = Array.isArray(payload?.files) ? payload.files : [];
  if (files.length === 0) return { error: { status: 400, message: "No files requested" } };
  if (files.length > MAX_DIRECT_FILES_PER_BATCH) {
    return { error: { status: 400, message: `Maximum ${MAX_DIRECT_FILES_PER_BATCH} files per batch` } };
  }
  const provider = await getActiveStorageProvider();
  const prefix = stagingPrefixAlbum(user.id, album._id);
  const uploads = [];
  for (const meta of files) {
    const originalName = typeof meta?.originalName === "string" ? meta.originalName : "image.jpg";
    const mimeType = typeof meta?.mimeType === "string" ? meta.mimeType : "application/octet-stream";
    const byteSize = Number(meta?.byteSize);
    if (!mimeType.startsWith("image/")) {
      return { error: { status: 400, message: `Not an image: ${originalName}` } };
    }
    if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_DIRECT_FILE_BYTES) {
      return { error: { status: 400, message: `Invalid size: ${originalName}` } };
    }
    const key = `${prefix}/hl_${crypto.randomBytes(10).toString("hex")}_${safeName(originalName)}`;
    const { uploadUrl, method, headers } = await createDirectUploadWriteUrl({
      key,
      contentType: mimeType,
      provider,
    });
    uploads.push({ key, originalName, mimeType, byteSize, uploadUrl, method, headers });
  }
  return { uploads, expiresInSeconds: 1200 };
}

async function commitHighlightsDirectUploads(user, albumId, payload, options = {}) {
  const onProgress = typeof options?.onProgress === "function" ? options.onProgress : null;
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (items.length === 0) return { error: { status: 400, message: "No items to commit" } };
  const provider = await getActiveStorageProvider();
  const folder = `albums/${String(user.id || "unknown-user")}/${String(album._id)}`;
  const expectedPrefix = stagingPrefixAlbum(user.id, album._id);
  const start = album.highlights.length;
  const added = [];
  if (onProgress) await onProgress({ total: items.length, done: 0, message: "Processing highlights" });
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const key = typeof item?.key === "string" ? item.key : "";
    const originalName = typeof item?.originalName === "string" ? item.originalName : "image.jpg";
    const mimeType = typeof item?.mimeType === "string" ? item.mimeType : "image/jpeg";
    if (!key || !key.startsWith(`${expectedPrefix}/`)) {
      return { error: { status: 400, message: "Invalid storage key" } };
    }
    let buffer;
    try {
      buffer = await downloadObjectBuffer({ key, provider });
    } catch {
      return { error: { status: 400, message: `Could not read: ${originalName}` } };
    }
    try {
      await sharp(buffer).metadata();
    } catch {
      await deleteObjectAtKey({ key, provider }).catch(() => {});
      return { error: { status: 400, message: `Invalid image: ${originalName}` } };
    }
    const file = { buffer, originalname: originalName, mimetype: mimeType };
    const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
      file,
      folder,
      provider,
    });
    await deleteObjectAtKey({ key, provider }).catch(() => {});
    added.push({
      id: `hl_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: displayUrl,
      originalUrl,
      thumbUrl,
      originalName,
      mimeType,
      byteSize: toValidByteSize(item?.byteSize || buffer?.length),
      order: start + i,
    });
    if (onProgress) await onProgress({ total: items.length, done: i + 1, message: `Processed ${i + 1}/${items.length}` });
  }
  album.highlights = [...album.highlights, ...added];
  await album.save();
  return { highlights: added };
}

async function prepareGalleryTabDirectUploads(user, albumId, tabId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const tab = album.galleryTabs.find((t) => t.id === tabId);
  if (!tab) return { error: { status: 404, message: "Tab not found" } };
  const files = Array.isArray(payload?.files) ? payload.files : [];
  if (files.length === 0) return { error: { status: 400, message: "No files requested" } };
  if (files.length > MAX_DIRECT_FILES_PER_BATCH) {
    return { error: { status: 400, message: `Maximum ${MAX_DIRECT_FILES_PER_BATCH} files per batch` } };
  }
  const provider = await getActiveStorageProvider();
  const prefix = stagingPrefixAlbum(user.id, album._id);
  const uploads = [];
  for (const meta of files) {
    const originalName = typeof meta?.originalName === "string" ? meta.originalName : "image.jpg";
    const mimeType = typeof meta?.mimeType === "string" ? meta.mimeType : "application/octet-stream";
    const byteSize = Number(meta?.byteSize);
    if (!mimeType.startsWith("image/")) {
      return { error: { status: 400, message: `Not an image: ${originalName}` } };
    }
    if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_DIRECT_FILE_BYTES) {
      return { error: { status: 400, message: `Invalid size: ${originalName}` } };
    }
    const key = `${prefix}/gt_${tabId}_${crypto.randomBytes(8).toString("hex")}_${safeName(originalName)}`;
    const { uploadUrl, method, headers } = await createDirectUploadWriteUrl({
      key,
      contentType: mimeType,
      provider,
    });
    uploads.push({ key, originalName, mimeType, byteSize, uploadUrl, method, headers });
  }
  return { uploads, expiresInSeconds: 1200 };
}

async function commitGalleryTabDirectUploads(user, albumId, tabId, payload, options = {}) {
  const onProgress = typeof options?.onProgress === "function" ? options.onProgress : null;
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const tab = album.galleryTabs.find((t) => t.id === tabId);
  if (!tab) return { error: { status: 404, message: "Tab not found" } };
  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (items.length === 0) return { error: { status: 400, message: "No items to commit" } };
  const provider = await getActiveStorageProvider();
  const folder = `albums/${String(user.id || "unknown-user")}/${String(album._id)}`;
  const expectedPrefix = stagingPrefixAlbum(user.id, album._id);
  const start = tab.images.length;
  const added = [];
  if (onProgress) await onProgress({ total: items.length, done: 0, message: "Processing gallery images" });
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const key = typeof item?.key === "string" ? item.key : "";
    const originalName = typeof item?.originalName === "string" ? item.originalName : "image.jpg";
    const mimeType = typeof item?.mimeType === "string" ? item.mimeType : "image/jpeg";
    if (!key || !key.startsWith(`${expectedPrefix}/`) || !key.includes(`gt_${tabId}_`)) {
      return { error: { status: 400, message: "Invalid storage key" } };
    }
    let buffer;
    try {
      buffer = await downloadObjectBuffer({ key, provider });
    } catch {
      return { error: { status: 400, message: `Could not read: ${originalName}` } };
    }
    try {
      await sharp(buffer).metadata();
    } catch {
      await deleteObjectAtKey({ key, provider }).catch(() => {});
      return { error: { status: 400, message: `Invalid image: ${originalName}` } };
    }
    const file = { buffer, originalname: originalName, mimetype: mimeType };
    const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
      file,
      folder,
      provider,
    });
    await deleteObjectAtKey({ key, provider }).catch(() => {});
    added.push({
      id: `gi_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: displayUrl,
      originalUrl,
      thumbUrl,
      originalName,
      mimeType,
      byteSize: toValidByteSize(item?.byteSize || buffer?.length),
      order: start + i,
    });
    if (onProgress) await onProgress({ total: items.length, done: i + 1, message: `Processed ${i + 1}/${items.length}` });
  }
  tab.images = [...tab.images, ...added];
  await album.save();
  return { images: added };
}

async function deleteAlbum(user, albumId) {
  if (!mongoose.Types.ObjectId.isValid(albumId)) {
    return { error: { status: 400, message: "Invalid album id" } };
  }
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  await Album.deleteOne({ _id: album._id });
  return { ok: true };
}

async function publishAlbum(user, albumId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  if (!album.bannerImage) return { error: { status: 400, message: "Banner image is required" } };
  if (!album.galleryTabs.some((t) => t.images.length > 0)) {
    return { error: { status: 400, message: "At least one gallery tab with images is required" } };
  }
  let slug = normalizeSlug(payload?.slug) || normalizeSlug(album.title);
  if (!slug) slug = `a_${crypto.randomBytes(3).toString("hex")}`;
  const existing = await Album.findOne({ slug, _id: { $ne: album._id } });
  if (existing) return { error: { status: 409, message: "Slug already taken" } };

  album.slug = slug;
  if (!album.shareToken) album.shareToken = crypto.randomBytes(24).toString("hex");
  album.isPublished = true;
  album.status = "published";
  album.publishedAt = new Date();
  await album.save();

  const base = (process.env.FRONTEND_BASE_URL || process.env.CORS_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
  return {
    message: "Album published",
    album,
    shareUrl: `${base}/${album.slug}`,
    shareTokenUrl: `${base}/share/${album.shareToken}`,
  };
}

module.exports = {
  createAlbum,
  listAlbums,
  getAlbum,
  updateAlbum,
  uploadBanner,
  prepareBannerDirectUpload,
  commitBannerDirectUpload,
  uploadHighlights,
  prepareHighlightsDirectUploads,
  commitHighlightsDirectUploads,
  createGalleryTab,
  updateGalleryTab,
  deleteGalleryTab,
  uploadTabImages,
  prepareGalleryTabDirectUploads,
  commitGalleryTabDirectUploads,
  deleteImage,
  deleteAlbum,
  publishAlbum,
};
