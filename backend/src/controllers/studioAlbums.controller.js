const studioAlbumsService = require("../services/studioAlbums.service");

function sendResult(res, result, successStatus = 200) {
  if (result.error) return res.status(result.error.status).json({ message: result.error.message });
  return res.status(successStatus).json(result);
}

async function createAlbum(req, res) {
  try {
    const result = await studioAlbumsService.createAlbum(req.user, req.body);
    return sendResult(res, result, 201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function listAlbums(req, res) {
  const result = await studioAlbumsService.listAlbums(req.user);
  return res.json(result);
}

async function getAlbum(req, res) {
  const result = await studioAlbumsService.getAlbum(req.user, req.params.albumId);
  return sendResult(res, result);
}

async function updateAlbum(req, res) {
  const result = await studioAlbumsService.updateAlbum(req.user, req.params.albumId, req.body);
  return sendResult(res, result);
}

async function prepareBannerDirectUpload(req, res) {
  try {
    const result = await studioAlbumsService.prepareBannerDirectUpload(req.user, req.params.albumId, req.body);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function commitBannerDirectUpload(req, res) {
  try {
    const result = await studioAlbumsService.commitBannerDirectUpload(req.user, req.params.albumId, req.body);
    return sendResult(res, result, 201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function uploadBanner(req, res) {
  const result = await studioAlbumsService.uploadBanner(req.user, req.params.albumId, req.file, req);
  return sendResult(res, result);
}

async function prepareHighlightsDirectUpload(req, res) {
  try {
    const result = await studioAlbumsService.prepareHighlightsDirectUploads(req.user, req.params.albumId, req.body);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function commitHighlightsDirectUpload(req, res) {
  try {
    const result = await studioAlbumsService.commitHighlightsDirectUploads(req.user, req.params.albumId, req.body);
    return sendResult(res, result, 201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function uploadHighlights(req, res) {
  const result = await studioAlbumsService.uploadHighlights(req.user, req.params.albumId, req.files || [], req);
  return sendResult(res, result, 201);
}

async function createGalleryTab(req, res) {
  const result = await studioAlbumsService.createGalleryTab(req.user, req.params.albumId, req.body);
  return sendResult(res, result, 201);
}

async function updateGalleryTab(req, res) {
  const result = await studioAlbumsService.updateGalleryTab(
    req.user,
    req.params.albumId,
    req.params.tabId,
    req.body
  );
  return sendResult(res, result);
}

async function deleteGalleryTab(req, res) {
  const result = await studioAlbumsService.deleteGalleryTab(req.user, req.params.albumId, req.params.tabId);
  return sendResult(res, result);
}

async function prepareGalleryTabDirectUpload(req, res) {
  try {
    const result = await studioAlbumsService.prepareGalleryTabDirectUploads(
      req.user,
      req.params.albumId,
      req.params.tabId,
      req.body
    );
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function commitGalleryTabDirectUpload(req, res) {
  try {
    const result = await studioAlbumsService.commitGalleryTabDirectUploads(
      req.user,
      req.params.albumId,
      req.params.tabId,
      req.body
    );
    return sendResult(res, result, 201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function uploadTabImages(req, res) {
  const result = await studioAlbumsService.uploadTabImages(
    req.user,
    req.params.albumId,
    req.params.tabId,
    req.files || [],
    req
  );
  return sendResult(res, result, 201);
}

async function deleteImage(req, res) {
  const result = await studioAlbumsService.deleteImage(req.user, req.params.albumId, req.params.imageId);
  return sendResult(res, result);
}

async function publishAlbum(req, res) {
  const result = await studioAlbumsService.publishAlbum(req.user, req.params.albumId, req.body);
  return sendResult(res, result);
}

async function deleteAlbum(req, res) {
  try {
    const result = await studioAlbumsService.deleteAlbum(req.user, req.params.albumId);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createAlbum,
  listAlbums,
  getAlbum,
  updateAlbum,
  prepareBannerDirectUpload,
  commitBannerDirectUpload,
  uploadBanner,
  prepareHighlightsDirectUpload,
  commitHighlightsDirectUpload,
  uploadHighlights,
  createGalleryTab,
  updateGalleryTab,
  deleteGalleryTab,
  prepareGalleryTabDirectUpload,
  commitGalleryTabDirectUpload,
  uploadTabImages,
  deleteImage,
  deleteAlbum,
  publishAlbum,
};
