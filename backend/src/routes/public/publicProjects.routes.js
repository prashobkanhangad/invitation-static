const express = require("express");
const publicProjectsController = require("../../controllers/publicProjects.controller");

const router = express.Router();

router.get("/projects/:shareToken", publicProjectsController.getProjectByShareToken);
router.get("/projects/slug/:slug", publicProjectsController.getProjectBySlug);

module.exports = router;

