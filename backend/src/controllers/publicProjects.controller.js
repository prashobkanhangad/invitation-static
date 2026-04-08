const publicProjectsService = require("../services/publicProjects.service");

function sendResult(res, result) {
  if (result.error) return res.status(result.error.status).json({ message: result.error.message });
  return res.json(result);
}

async function getProjectByShareToken(req, res) {
  try {
    const result = await publicProjectsService.getPublicProjectByShareToken(req.params.shareToken);
    return sendResult(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getProjectBySlug(req, res) {
  try {
    const result = await publicProjectsService.getPublicProjectBySlug(req.params.slug);
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
};
