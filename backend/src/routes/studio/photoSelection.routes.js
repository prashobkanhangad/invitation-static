const express = require("express");
const { authRequired, requireRole } = require("../../middleware/auth");
const { uploadMemory } = require("../../services/storageUploader");
const studioPhotoSelectionController = require("../../controllers/studioPhotoSelection.controller");

const router = express.Router();
router.use(authRequired, requireRole("master_admin", "studio"));
router.post("/projects", studioPhotoSelectionController.createProject);
router.get("/projects", studioPhotoSelectionController.listProjects);
router.get("/projects/:projectId", studioPhotoSelectionController.getProject);
router.patch("/projects/:projectId", studioPhotoSelectionController.updateProject);
router.post("/projects/:projectId/photos", uploadMemory.array("images", 300), studioPhotoSelectionController.uploadPhotos);
router.patch("/projects/:projectId/photos/:photoId", studioPhotoSelectionController.updatePhoto);
router.post("/projects/:projectId/publish", studioPhotoSelectionController.publishProject);

module.exports = router;
