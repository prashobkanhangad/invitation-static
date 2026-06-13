const Album = require("../models/Album");
const Project = require("../models/Project");
const photoSelectionPin = require("./photoSelectionPin");
const { resolvePhotoSelectionDownloadMeta } = require("./photoSelectionDownloadResolve");

const DEFAULT_PUBLIC_PHOTO_SELECTION_LIMIT = 30;
const MAX_PUBLIC_PHOTO_SELECTION_LIMIT = 120;

function normalizeTemplate(template) {
  if (!template) return null;
  return {
    templateId: template.templateId,
    title: template.title,
    subtitle: template.subtitle,
    category: template.category,
    previewVariant: template.previewVariant,
    coverSrc: template.coverSrc,
    coverAlt: template.coverAlt,
    thumbs: template.thumbs,
    footerText: template.footerText,
  };
}

function normalizeSlug(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function safePublicPhotoSelection(project) {
  const ps = project.photoSelection;
  if (!ps) return null;
  const raw =
    typeof ps.toObject === "function"
      ? ps.toObject({ flattenMaps: true })
      : { ...ps };
  if (raw && typeof raw === "object" && "pinHash" in raw) delete raw.pinHash;
  if (Array.isArray(raw.clientTabs)) {
    raw.clientTabs = [...raw.clientTabs].sort((a, b) => {
      const ao = Number.isFinite(Number(a?.order)) ? Number(a.order) : 0;
      const bo = Number.isFinite(Number(b?.order)) ? Number(b.order) : 0;
      return ao - bo;
    });
  }
  return raw;
}

function normalizePublicPhotoSelectionLimit(rawLimit) {
  const n = Number.parseInt(String(rawLimit ?? ""), 10);
  if (!Number.isFinite(n) || n <= 0)
    return DEFAULT_PUBLIC_PHOTO_SELECTION_LIMIT;
  return Math.min(MAX_PUBLIC_PHOTO_SELECTION_LIMIT, Math.max(1, n));
}

function normalizePublicPhotoSelectionOffset(rawCursor) {
  const n = Number.parseInt(String(rawCursor ?? ""), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function buildPublicPhotoSelectionPage(project, paginationInput) {
  const rawSelection = safePublicPhotoSelection(project);
  if (!rawSelection) {
    return { photoSelection: null, photoSelectionPage: null };
  }

  const rawPhotos = Array.isArray(rawSelection.photos)
    ? rawSelection.photos
    : [];
  const tabIdRaw =
    typeof paginationInput?.tabId === "string" &&
    paginationInput.tabId.trim() &&
    paginationInput.tabId !== "__all__"
      ? paginationInput.tabId.trim()
      : null;
  const allPhotos =
    tabIdRaw === "__selected__"
      ? rawPhotos.filter((photo) => Boolean(photo?.picked))
      : tabIdRaw
        ? rawPhotos.filter((photo) => String(photo?.tabId || "") === tabIdRaw)
        : rawPhotos;
  const limit = normalizePublicPhotoSelectionLimit(paginationInput?.limit);
  const requestedOffset = normalizePublicPhotoSelectionOffset(
    paginationInput?.cursor,
  );
  const offset = Math.min(Math.max(0, requestedOffset), allPhotos.length);
  const photos = allPhotos.slice(offset, offset + limit);
  const consumed = offset + photos.length;
  const hasMore = consumed < allPhotos.length;

  return {
    photoSelection: { ...rawSelection, photos },
    photoSelectionPage: {
      cursor: String(offset),
      nextCursor: hasMore ? String(consumed) : null,
      hasMore,
      limit,
      total: allPhotos.length,
    },
  };
}

function buildPublicPhotoSelectionStats(project) {
  const photos = Array.isArray(project?.photoSelection?.photos)
    ? project.photoSelection.photos
    : [];
  return {
    totalPhotos: photos.length,
    selectedPhotos: photos.filter((photo) => Boolean(photo?.picked)).length,
  };
}

function publicStudioDisplayName(project) {
  const u = project?.studioUser;
  if (!u || typeof u !== "object") return "";
  const studioName =
    typeof u.studioName === "string" ? u.studioName.trim() : "";
  const accountName = typeof u.name === "string" ? u.name.trim() : "";
  return studioName || accountName || "";
}

function mapAlbumResponse(album) {
  const desktopPos =
    typeof album.bannerHeroDesktopPosition === "string" &&
    album.bannerHeroDesktopPosition.trim()
      ? album.bannerHeroDesktopPosition.trim()
      : "50% 50%";
  const mobilePos =
    typeof album.bannerHeroMobilePosition === "string" &&
    album.bannerHeroMobilePosition.trim()
      ? album.bannerHeroMobilePosition.trim()
      : "50% 50%";

  return {
    project: {
      id: album._id,
      name: album.title,
      templateId: album.templateId,
      shareToken: album.shareToken,
      slug: album.slug,
      studioName: publicStudioDisplayName(album),
    },
    template: {
      templateId: album.templateId,
      title: "Classic album",
      subtitle: "A cherished collection",
      category: "wedding",
      previewVariant: 1,
      coverSrc: album.bannerImage?.url || "",
      coverAlt: "Digital album cover",
      thumbs: album.highlights.map((i) => i.url),
      footerText: "Crafted on Invyto",
    },
    images: [
      ...(album.bannerImage
        ? [
            {
              id: album.bannerImage.id,
              url: album.bannerImage.url,
              originalUrl: album.bannerImage.originalUrl || "",
            },
          ]
        : []),
      ...album.highlights.map((img) => ({
        id: img.id,
        url: img.url,
        originalUrl: img.originalUrl || "",
      })),
      ...album.galleryTabs.flatMap((tab) =>
        tab.images.map((img) => ({
          id: img.id,
          url: img.url,
          originalUrl: img.originalUrl || "",
        })),
      ),
    ],
    albumContent: {
      bannerImage: album.bannerImage,
      highlights: album.highlights,
      galleryTabs: album.galleryTabs,
    },
    bannerHero: {
      desktopPosition: desktopPos,
      mobilePosition: mobilePos,
    },
  };
}

async function getPublicProjectByShareToken(
  shareToken,
  accessToken,
  paginationInput,
) {
  if (!shareToken)
    return { error: { status: 400, message: "shareToken required" } };

  const album = await Album.findOne({ shareToken, isPublished: true }).populate(
    "studioUser",
    "studioName name",
  );
  if (album) return mapAlbumResponse(album);

  const project = await Project.findOne({ shareToken, isPublished: true })
    .populate("template")
    .populate("studioUser", "studioName name");
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;
  const { photoSelection, photoSelectionPage } = buildPublicPhotoSelectionPage(
    project,
    paginationInput,
  );
  return {
    project: {
      id: project._id,
      name: project.name,
      templateId: project.templateId,
      shareToken: project.shareToken,
      slug: project.slug,
      studioName: publicStudioDisplayName(project),
    },
    template: normalizeTemplate(project.template),
    images: (project.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      originalUrl: img.originalUrl || "",
    })),
    photoSelection,
    photoSelectionPage,
  };
}

async function getPublicProjectBySlug(rawSlug, accessToken, paginationInput) {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return { error: { status: 400, message: "slug required" } };

  const album = await Album.findOne({ slug, isPublished: true }).populate(
    "studioUser",
    "studioName name",
  );
  if (album) return mapAlbumResponse(album);

  const project = await Project.findOne({ slug, isPublished: true })
    .populate("template")
    .populate("studioUser", "studioName name");
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;
  const { photoSelection, photoSelectionPage } = buildPublicPhotoSelectionPage(
    project,
    paginationInput,
  );
  return {
    project: {
      id: project._id,
      name: project.name,
      templateId: project.templateId,
      slug: project.slug,
      studioName: publicStudioDisplayName(project),
    },
    template: normalizeTemplate(project.template),
    images: (project.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      originalUrl: img.originalUrl || "",
    })),
    photoSelection,
    photoSelectionPage,
  };
}

function applyPublicPhotoSelectionPatch(photo, payload) {
  const { picked, fav } = payload || {};
  if (typeof picked !== "boolean" && typeof fav !== "boolean") {
    return {
      error: { status: 400, message: "Provide picked and/or fav as boolean" },
    };
  }
  if (typeof picked === "boolean") photo.picked = picked;
  if (typeof fav === "boolean") photo.fav = fav;
  return null;
}

async function updatePublicPhotoSelectionPhoto(
  shareToken,
  photoId,
  payload,
  accessToken,
) {
  if (!shareToken)
    return { error: { status: 400, message: "shareToken required" } };
  if (!photoId) return { error: { status: 400, message: "photoId required" } };

  const project = await Project.findOne({ shareToken, isPublished: true });
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;

  const photo = (project.photoSelection?.photos || []).find(
    (p) => p.id === photoId,
  );
  if (!photo) return { error: { status: 404, message: "Photo not found" } };

  const patchErr = applyPublicPhotoSelectionPatch(photo, payload);
  if (patchErr) return patchErr;
  await project.save();
  return {
    photo: {
      id: photo.id,
      picked: photo.picked,
      fav: photo.fav,
      tabId: photo.tabId,
    },
  };
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

function albumImages(album) {
  return [
    ...(album?.bannerImage ? [album.bannerImage] : []),
    ...(album?.highlights || []),
    ...(album?.galleryTabs || []).flatMap((tab) => tab.images || []),
  ];
}

function resolveAlbumImageDownloadFromAlbum(
  album,
  imageId,
  variant = "optimized",
) {
  if (!imageId) return { error: { status: 400, message: "imageId required" } };
  const image = albumImages(album).find(
    (img) => String(img?.id || "") === String(imageId),
  );
  if (!image) return { error: { status: 404, message: "Image not found" } };

  const sourceUrl =
    variant === "original"
      ? image.originalUrl || image.url
      : image.url || image.originalUrl;
  if (!sourceUrl)
    return { error: { status: 404, message: "Image URL not found" } };

  const rawBase =
    sanitizeFilename(image.originalName || image.id || "image") || "image";
  const base = rawBase.replace(/\.[^.]+$/, "") || "image";
  const ext = extensionFromMime(image.mimeType);
  const originalFileName = originalFileNameFromSource(
    image.originalName || image.id || "image",
    "image",
    ext,
  );
  const fileName =
    variant === "original" ? originalFileName : `${base}-optimized.webp`;

  return {
    sourceUrl,
    fileName,
    mimeType: image.mimeType || "",
  };
}

async function getPublicPhotoSelectionBySlug(
  rawSlug,
  accessToken,
  paginationInput,
) {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return { error: { status: 400, message: "slug required" } };

  const project = await Project.findOne({ slug, isPublished: true })
    .populate("template")
    .populate("studioUser", "studioName name");
  if (!project?.photoSelection)
    return { error: { status: 404, message: "Project not found" } };

  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;
  const { photoSelection, photoSelectionPage } = buildPublicPhotoSelectionPage(
    project,
    paginationInput,
  );

  return {
    project: {
      id: project._id,
      name: project.name,
      templateId: project.templateId,
      slug: project.slug,
      studioName: publicStudioDisplayName(project),
    },
    template: normalizeTemplate(project.template),
    images: (project.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      originalUrl: img.originalUrl || "",
    })),
    photoSelection,
    photoSelectionPage,
  };
}

async function updatePublicPhotoSelectionPhotoBySlug(
  rawSlug,
  photoId,
  payload,
  accessToken,
) {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return { error: { status: 400, message: "slug required" } };
  if (!photoId) return { error: { status: 400, message: "photoId required" } };

  const project = await Project.findOne({ slug, isPublished: true });
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;

  const photo = (project.photoSelection?.photos || []).find(
    (p) => p.id === photoId,
  );
  if (!photo) return { error: { status: 404, message: "Photo not found" } };

  const patchErr = applyPublicPhotoSelectionPatch(photo, payload);
  if (patchErr) return patchErr;
  await project.save();
  return {
    photo: {
      id: photo.id,
      picked: photo.picked,
      fav: photo.fav,
      tabId: photo.tabId,
    },
  };
}

async function resolvePublicPhotoSelectionDownloadBySlug(
  rawSlug,
  photoId,
  variant = "original",
  accessToken,
) {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return { error: { status: 400, message: "slug required" } };
  if (!photoId) return { error: { status: 400, message: "photoId required" } };

  const project = await Project.findOne({ slug, isPublished: true });
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;

  const photo = (project.photoSelection?.photos || []).find(
    (p) => p.id === photoId,
  );
  if (!photo) return { error: { status: 404, message: "Photo not found" } };

  const resolved = resolvePhotoSelectionDownloadMeta(photo, variant);
  if (!resolved)
    return { error: { status: 404, message: "Photo URL not found" } };

  return resolved;
}

async function resolvePublicAlbumImageDownload(
  shareToken,
  imageId,
  variant = "optimized",
) {
  if (!shareToken)
    return { error: { status: 400, message: "shareToken required" } };
  const album = await Album.findOne({ shareToken, isPublished: true });
  if (!album) return { error: { status: 404, message: "Album not found" } };
  return resolveAlbumImageDownloadFromAlbum(album, imageId, variant);
}

async function resolvePublicAlbumImageDownloadBySlug(
  rawSlug,
  imageId,
  variant = "optimized",
) {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return { error: { status: 400, message: "slug required" } };
  const album = await Album.findOne({ slug, isPublished: true });
  if (!album) return { error: { status: 404, message: "Album not found" } };
  return resolveAlbumImageDownloadFromAlbum(album, imageId, variant);
}

async function resolvePublicPhotoSelectionDownload(
  shareToken,
  photoId,
  variant = "original",
  accessToken,
) {
  if (!shareToken)
    return { error: { status: 400, message: "shareToken required" } };
  if (!photoId) return { error: { status: 400, message: "photoId required" } };

  const project = await Project.findOne({ shareToken, isPublished: true });
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;

  const photo = (project.photoSelection?.photos || []).find(
    (p) => p.id === photoId,
  );
  if (!photo) return { error: { status: 404, message: "Photo not found" } };

  const resolved = resolvePhotoSelectionDownloadMeta(photo, variant);
  if (!resolved)
    return { error: { status: 404, message: "Photo URL not found" } };

  return resolved;
}

async function verifyPhotoSelectionPinBySlug(rawSlug, plainPin) {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return { error: { status: 400, message: "slug required" } };
  if (typeof plainPin !== "string" || !/^\d{4,8}$/.test(plainPin.trim())) {
    return { error: { status: 400, message: "PIN must be 4–8 digits" } };
  }

  const project = await Project.findOne({ slug, isPublished: true });
  if (!project?.photoSelection)
    return { error: { status: 404, message: "Project not found" } };
  if (!photoSelectionPin.photoSelectionPinActive(project)) {
    return {
      error: { status: 400, message: "This selection does not require a PIN" },
    };
  }
  if (
    !photoSelectionPin.verifyPhotoSelectionPin(
      plainPin.trim(),
      project.photoSelection.pinHash,
    )
  ) {
    return { error: { status: 401, message: "Incorrect PIN" } };
  }
  return {
    accessToken: photoSelectionPin.issuePhotoSelectionAccessToken(project._id),
  };
}

async function verifyPhotoSelectionPinByShareToken(shareToken, plainPin) {
  if (!shareToken)
    return { error: { status: 400, message: "shareToken required" } };
  if (typeof plainPin !== "string" || !/^\d{4,8}$/.test(plainPin.trim())) {
    return { error: { status: 400, message: "PIN must be 4–8 digits" } };
  }

  const project = await Project.findOne({ shareToken, isPublished: true });
  if (!project?.photoSelection)
    return { error: { status: 404, message: "Project not found" } };
  if (!photoSelectionPin.photoSelectionPinActive(project)) {
    return {
      error: { status: 400, message: "This selection does not require a PIN" },
    };
  }
  if (
    !photoSelectionPin.verifyPhotoSelectionPin(
      plainPin.trim(),
      project.photoSelection.pinHash,
    )
  ) {
    return { error: { status: 401, message: "Incorrect PIN" } };
  }
  return {
    accessToken: photoSelectionPin.issuePhotoSelectionAccessToken(project._id),
  };
}

async function getPublicPhotoSelectionStatsBySlug(rawSlug, accessToken) {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return { error: { status: 400, message: "slug required" } };
  const project = await Project.findOne({ slug, isPublished: true });
  if (!project?.photoSelection)
    return { error: { status: 404, message: "Project not found" } };
  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;
  return { photoSelectionStats: buildPublicPhotoSelectionStats(project) };
}

async function getPublicPhotoSelectionStatsByShareToken(
  shareToken,
  accessToken,
) {
  if (!shareToken)
    return { error: { status: 400, message: "shareToken required" } };
  const project = await Project.findOne({ shareToken, isPublished: true });
  if (!project?.photoSelection)
    return { error: { status: 404, message: "Project not found" } };
  const pinGate = photoSelectionPin.assertPhotoSelectionPinAccess(
    project,
    accessToken,
  );
  if (pinGate.error) return pinGate;
  return { photoSelectionStats: buildPublicPhotoSelectionStats(project) };
}

module.exports = {
  getPublicProjectByShareToken,
  getPublicProjectBySlug,
  getPublicPhotoSelectionBySlug,
  updatePublicPhotoSelectionPhoto,
  updatePublicPhotoSelectionPhotoBySlug,
  resolvePublicAlbumImageDownload,
  resolvePublicAlbumImageDownloadBySlug,
  resolvePublicPhotoSelectionDownload,
  resolvePublicPhotoSelectionDownloadBySlug,
  verifyPhotoSelectionPinBySlug,
  verifyPhotoSelectionPinByShareToken,
  getPublicPhotoSelectionStatsBySlug,
  getPublicPhotoSelectionStatsByShareToken,
  bearerFromAuthorizationHeader:
    photoSelectionPin.bearerFromAuthorizationHeader,
};
