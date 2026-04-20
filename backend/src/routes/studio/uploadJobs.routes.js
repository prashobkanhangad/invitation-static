const express = require("express");
const { authRequired, requireRole } = require("../../middleware/auth");
const studioUploadJobsController = require("../../controllers/studioUploadJobs.controller");

const router = express.Router();
router.use(authRequired, requireRole("master_admin", "studio"));

router.get("/:jobId", studioUploadJobsController.getUploadJob);

module.exports = router;

