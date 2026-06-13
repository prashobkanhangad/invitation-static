function sanitizeFilename(name) {
  return String(name || "")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .trim();
}

function extensionFromMime(mimeType) {
  if (!mimeType) return "jpg";
  if (mimeType.includes("jpeg") || mimeType === "image/jpg") return "jpg";
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("gif")) return "gif";
  return "jpg";
}

function originalFileNameFromSource(rawName, fallbackBase, ext) {
  const safe = sanitizeFilename(rawName || fallbackBase) || fallbackBase;
  return /\.[a-z0-9]{1,8}$/i.test(safe) ? safe : `${safe}.${ext}`;
}

/** Original = full file; optimized = thumbnail (small WebP). */
function resolvePhotoSelectionDownloadMeta(photo, variant = "original") {
  const rawBase =
    sanitizeFilename(photo?.originalName || photo?.id || "photo") || "photo";
  const base = rawBase.replace(/\.[^.]+$/, "") || "photo";

  if (variant === "original") {
    const sourceUrl = photo?.originalUrl || photo?.url;
    if (!sourceUrl) return null;
    const ext = extensionFromMime(photo?.mimeType);
    return {
      sourceUrl,
      fileName: originalFileNameFromSource(
        photo?.originalName || photo?.id || "photo",
        "photo",
        ext,
      ),
      mimeType: photo?.mimeType || "",
    };
  }

  const sourceUrl = photo?.thumbUrl || photo?.url || photo?.originalUrl;
  if (!sourceUrl) return null;
  return {
    sourceUrl,
    fileName: `${base}-optimized.webp`,
    mimeType: "image/webp",
  };
}

module.exports = {
  resolvePhotoSelectionDownloadMeta,
  sanitizeFilename,
};
