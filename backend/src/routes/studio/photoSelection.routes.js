const express = require("express");
const { authRequired, requireRole } = require("../../middleware/auth");
const { uploadMemory } = require("../../services/storageUploader");
const studioPhotoSelectionController = require("../../controllers/studioPhotoSelection.controller");

const router = express.Router();
router.use(authRequired, requireRole("master_admin", "studio"));
router.post("/projects", studioPhotoSelectionController.createProject);
router.get("/projects", studioPhotoSelectionController.listProjects);
router.get("/projects/:projectId", studioPhotoSelectionController.getProject);
router.patch(
  "/projects/:projectId",
  studioPhotoSelectionController.updateProject,
);
router.post(
  "/projects/:projectId/photos/direct-upload/prepare",
  studioPhotoSelectionController.preparePhotoDirectUpload,
);
router.post(
  "/projects/:projectId/photos/direct-upload/commit",
  studioPhotoSelectionController.commitPhotoDirectUpload,
);
router.post(
  "/projects/:projectId/photos",
  uploadMemory.array("images", 300),
  studioPhotoSelectionController.uploadPhotos,
);
router.post(
  "/projects/:projectId/og-image/direct-upload/prepare",
  studioPhotoSelectionController.prepareOgImageDirectUpload,
);
router.post(
  "/projects/:projectId/og-image/direct-upload/commit",
  studioPhotoSelectionController.commitOgImageDirectUpload,
);
router.post(
  "/projects/:projectId/og-image",
  uploadMemory.single("image"),
  studioPhotoSelectionController.uploadOgImage,
);
router.patch(
  "/projects/:projectId/photos/:photoId",
  studioPhotoSelectionController.updatePhoto,
);
router.get(
  "/projects/:projectId/photos/:photoId/download",
  studioPhotoSelectionController.downloadPhoto,
);
router.post(
  "/projects/:projectId/photos/download-selected",
  studioPhotoSelectionController.downloadSelectedPhotos,
);
router.delete(
  "/projects/:projectId/photos/:photoId",
  studioPhotoSelectionController.deletePhoto,
);
router.post(
  "/projects/:projectId/publish",
  studioPhotoSelectionController.publishProject,
);
router.delete(
  "/projects/:projectId",
  studioPhotoSelectionController.deletePhotoSelectionProject,
);

module.exports = router;
