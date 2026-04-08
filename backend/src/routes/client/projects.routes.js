const express = require("express");
const multer = require("multer");
const { authRequired } = require("../../middleware/auth");
const clientProjectsController = require("../../controllers/clientProjects.controller");

const router = express.Router();

function imageFileFilter(_req, file, cb) {
  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"));
  }
  return cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // ~3MB each
});

router.post("/projects", authRequired, clientProjectsController.createProject);
router.get("/projects/:projectId", authRequired, clientProjectsController.getProject);
router.get("/projects", authRequired, clientProjectsController.listProjects);
router.post("/projects/:projectId/select-template", authRequired, clientProjectsController.selectTemplate);
router.post("/projects/:projectId/images", authRequired, upload.array("images", 6), clientProjectsController.uploadImages);
router.post("/projects/:projectId/publish", authRequired, clientProjectsController.publishProject);

module.exports = router;

