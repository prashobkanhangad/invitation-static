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

async function uploadBanner(req, res) {
  const result = await studioAlbumsService.uploadBanner(req.user, req.params.albumId, req.file, req);
  return sendResult(res, result);
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
