const clientProjectsService = require("../services/clientProjects.service");

function sendResult(res, result, successStatus = 200) {
  if (result.error) return res.status(result.error.status).json({ message: result.error.message });
  return res.status(successStatus).json(result);
}

async function createProject(req, res) {
  try {
    const result = await clientProjectsService.createProject(req.user.id, req.body);
    return sendResult(res, result, 201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getProject(req, res) {
  try {
    const result = await clientProjectsService.getProject(req.user.id, req.params.projectId);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function listProjects(req, res) {
  try {
    const result = await clientProjectsService.listProjects(req.user.id);
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function selectTemplate(req, res) {
  try {
    const result = await clientProjectsService.selectTemplate(req.user.id, req.params.projectId, req.body);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function uploadImages(req, res) {
  try {
    const result = await clientProjectsService.uploadImages(req.user.id, req.params.projectId, req.files || [], req);
    return sendResult(res, result, 201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function publishProject(req, res) {
  try {
    const result = await clientProjectsService.publishProject(req.user.id, req.params.projectId, req.body);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createProject,
  getProject,
  listProjects,
  selectTemplate,
  uploadImages,
  publishProject,
};
