const uploadJobsService = require("../services/uploadJobs.service");

async function getUploadJob(req, res) {
  try {
    const result = await uploadJobsService.getUploadJobForUser(req.user, req.params.jobId);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getUploadJob,
};

