const studioPhotoSelectionService = require("../services/studioPhotoSelection.service");

async function createProject(req, res) {
  try {
    const result = await studioPhotoSelectionService.createProject(req.user, req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.status(201).json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function listProjects(req, res) {
  const result = await studioPhotoSelectionService.listProjects(req.user);
  return res.json(result);
}

async function getProject(req, res) {
  const result = await studioPhotoSelectionService.getProject(req.user, req.params.projectId);
  if (result.error) return res.status(result.error.status).json({ message: result.error.message });
  return res.json(result);
}

async function updateProject(req, res) {
  const result = await studioPhotoSelectionService.updateProject(req.user, req.params.projectId, req.body);
  if (result.error) return res.status(result.error.status).json({ message: result.error.message });
  return res.json(result);
}

async function uploadPhotos(req, res) {
  try {
    const result = await studioPhotoSelectionService.uploadPhotos(
      req.user,
      req.params.projectId,
      req.files || [],
      req.body,
      req
    );
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.status(201).json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function preparePhotoDirectUpload(req, res) {
  try {
    const result = await studioPhotoSelectionService.preparePhotoDirectUploads(req.user, req.params.projectId, req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function commitPhotoDirectUpload(req, res) {
  try {
    const result = await studioPhotoSelectionService.commitPhotoDirectUploads(req.user, req.params.projectId, req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.status(201).json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function updatePhoto(req, res) {
  const result = await studioPhotoSelectionService.updatePhoto(
    req.user,
    req.params.projectId,
    req.params.photoId,
    req.body
  );
  if (result.error) return res.status(result.error.status).json({ message: result.error.message });
  return res.json(result);
}

async function publishProject(req, res) {
  const result = await studioPhotoSelectionService.publishProject(req.user, req.params.projectId);
  if (result.error) return res.status(result.error.status).json({ message: result.error.message });
  return res.json(result);
}

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  uploadPhotos,
  preparePhotoDirectUpload,
  commitPhotoDirectUpload,
  updatePhoto,
  publishProject,
};
