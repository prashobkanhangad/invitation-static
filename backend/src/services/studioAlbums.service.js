const crypto = require("crypto");
const Album = require("../models/Album");
const { uploadImageVariantsByProvider } = require("./storageUploader");
const { getActiveStorageProvider } = require("./storageSettings");

function normalizeSlug(input) {
  if (!input || typeof input !== "string") return "";
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
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

async function updateAlbum(user, albumId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  const { title, galleryTabs } = payload || {};
  if (typeof title === "string" && title.trim()) album.title = title.trim();
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

async function publishAlbum(user, albumId, payload) {
  const album = await getStudioAlbum(user, albumId);
  if (!album) return { error: { status: 404, message: "Album not found" } };
  if (!album.bannerImage) return { error: { status: 400, message: "Banner image is required" } };
  if (!album.highlights.length) {
    return { error: { status: 400, message: "At least one highlight image is required" } };
  }
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
  uploadHighlights,
  createGalleryTab,
  updateGalleryTab,
  deleteGalleryTab,
  uploadTabImages,
  deleteImage,
  publishAlbum,
};
