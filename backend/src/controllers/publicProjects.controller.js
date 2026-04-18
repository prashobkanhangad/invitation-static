const publicProjectsService = require("../services/publicProjects.service");

function sendResult(res, result) {
  if (result.error) {
    const body = { message: result.error.message };
    if (result.error.pinRequired) body.pinRequired = true;
    return res.status(result.error.status).json(body);
  }
  return res.json(result);
}

async function getProjectByShareToken(req, res) {
  try {
    const accessToken = publicProjectsService.bearerFromAuthorizationHeader(req.headers.authorization);
    const result = await publicProjectsService.getPublicProjectByShareToken(req.params.shareToken, accessToken);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getProjectBySlug(req, res) {
  try {
    const accessToken = publicProjectsService.bearerFromAuthorizationHeader(req.headers.authorization);
    const result = await publicProjectsService.getPublicProjectBySlug(req.params.slug, accessToken);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updatePhotoSelectionPhoto(req, res) {
  try {
    const accessToken = publicProjectsService.bearerFromAuthorizationHeader(req.headers.authorization);
    const result = await publicProjectsService.updatePublicPhotoSelectionPhoto(
      req.params.shareToken,
      req.params.photoId,
      req.body,
      accessToken
    );
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function downloadPhotoSelectionPhoto(req, res) {
  try {
    const accessToken = publicProjectsService.bearerFromAuthorizationHeader(req.headers.authorization);
    const variant = req.query?.variant === "original" ? "original" : "optimized";
    const resolved = await publicProjectsService.resolvePublicPhotoSelectionDownload(
      req.params.shareToken,
      req.params.photoId,
      variant,
      accessToken
    );
    if (resolved.error) {
      const body = { message: resolved.error.message };
      if (resolved.error.pinRequired) body.pinRequired = true;
      return res.status(resolved.error.status).json(body);
    }

    const upstream = await fetch(resolved.sourceUrl);
    if (!upstream.ok) return res.status(502).json({ message: "Failed to fetch source image" });
    const arrayBuffer = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ||
      (variant === "original" ? resolved.mimeType : "image/webp") ||
      "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${resolved.fileName}"`);
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function downloadAlbumImage(req, res) {
  try {
    const variant = req.query?.variant === "original" ? "original" : "optimized";
    const resolved = await publicProjectsService.resolvePublicAlbumImageDownload(
      req.params.shareToken,
      req.params.imageId,
      variant
    );
    if (resolved.error) return res.status(resolved.error.status).json({ message: resolved.error.message });

    const upstream = await fetch(resolved.sourceUrl);
    if (!upstream.ok) return res.status(502).json({ message: "Failed to fetch source image" });
    const arrayBuffer = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ||
      (variant === "original" ? resolved.mimeType : "image/webp") ||
      "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${resolved.fileName}"`);
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getPublicPhotoSelectionBySlug(req, res) {
  try {
    const accessToken = publicProjectsService.bearerFromAuthorizationHeader(req.headers.authorization);
    const result = await publicProjectsService.getPublicPhotoSelectionBySlug(req.params.slug, accessToken);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updatePhotoSelectionPhotoBySlug(req, res) {
  try {
    const accessToken = publicProjectsService.bearerFromAuthorizationHeader(req.headers.authorization);
    const result = await publicProjectsService.updatePublicPhotoSelectionPhotoBySlug(
      req.params.slug,
      req.params.photoId,
      req.body,
      accessToken
    );
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function downloadPhotoSelectionPhotoBySlug(req, res) {
  try {
    const accessToken = publicProjectsService.bearerFromAuthorizationHeader(req.headers.authorization);
    const variant = req.query?.variant === "original" ? "original" : "optimized";
    const resolved = await publicProjectsService.resolvePublicPhotoSelectionDownloadBySlug(
      req.params.slug,
      req.params.photoId,
      variant,
      accessToken
    );
    if (resolved.error) {
      const body = { message: resolved.error.message };
      if (resolved.error.pinRequired) body.pinRequired = true;
      return res.status(resolved.error.status).json(body);
    }

    const upstream = await fetch(resolved.sourceUrl);
    if (!upstream.ok) return res.status(502).json({ message: "Failed to fetch source image" });
    const arrayBuffer = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ||
      (variant === "original" ? resolved.mimeType : "image/webp") ||
      "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${resolved.fileName}"`);
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function downloadAlbumImageBySlug(req, res) {
  try {
    const variant = req.query?.variant === "original" ? "original" : "optimized";
    const resolved = await publicProjectsService.resolvePublicAlbumImageDownloadBySlug(
      req.params.slug,
      req.params.imageId,
      variant
    );
    if (resolved.error) return res.status(resolved.error.status).json({ message: resolved.error.message });

    const upstream = await fetch(resolved.sourceUrl);
    if (!upstream.ok) return res.status(502).json({ message: "Failed to fetch source image" });
    const arrayBuffer = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ||
      (variant === "original" ? resolved.mimeType : "image/webp") ||
      "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${resolved.fileName}"`);
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function verifyPhotoSelectionPinBySlug(req, res) {
  try {
    const result = await publicProjectsService.verifyPhotoSelectionPinBySlug(req.params.slug, req.body?.pin);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function verifyPhotoSelectionPinByShareToken(req, res) {
  try {
    const result = await publicProjectsService.verifyPhotoSelectionPinByShareToken(
      req.params.shareToken,
      req.body?.pin
    );
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getProjectByShareToken,
  getProjectBySlug,
  updatePhotoSelectionPhoto,
  downloadPhotoSelectionPhoto,
  downloadAlbumImage,
  getPublicPhotoSelectionBySlug,
  updatePhotoSelectionPhotoBySlug,
  downloadPhotoSelectionPhotoBySlug,
  downloadAlbumImageBySlug,
  verifyPhotoSelectionPinBySlug,
  verifyPhotoSelectionPinByShareToken,
};
