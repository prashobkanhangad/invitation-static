const express = require("express");
const publicProjectsController = require("../../controllers/publicProjects.controller");

const router = express.Router();

router.post(
  "/photos/:slug/verify-pin",
  publicProjectsController.verifyPhotoSelectionPinBySlug,
);
router.post(
  "/projects/:shareToken/verify-pin",
  publicProjectsController.verifyPhotoSelectionPinByShareToken,
);

router.get(
  "/photos/:slug",
  publicProjectsController.getPublicPhotoSelectionBySlug,
);
router.get(
  "/photos/:slug/photo-selection/stats",
  publicProjectsController.getPublicPhotoSelectionStatsBySlug,
);
router.patch(
  "/photos/:slug/photo-selection/photos/:photoId",
  publicProjectsController.updatePhotoSelectionPhotoBySlug,
);
router.get(
  "/photos/:slug/photo-selection/photos/:photoId/download",
  publicProjectsController.downloadPhotoSelectionPhotoBySlug,
);

router.get(
  "/projects/:shareToken",
  publicProjectsController.getProjectByShareToken,
);
router.get("/projects/slug/:slug", publicProjectsController.getProjectBySlug);
router.get(
  "/projects/:shareToken/album-images/:imageId/download",
  publicProjectsController.downloadAlbumImage,
);
router.get(
  "/projects/slug/:slug/album-images/:imageId/download",
  publicProjectsController.downloadAlbumImageBySlug,
);
router.patch(
  "/projects/:shareToken/photo-selection/photos/:photoId",
  publicProjectsController.updatePhotoSelectionPhoto,
);
router.get(
  "/projects/:shareToken/photo-selection/stats",
  publicProjectsController.getPublicPhotoSelectionStatsByShareToken,
);
router.get(
  "/projects/:shareToken/photo-selection/photos/:photoId/download",
  publicProjectsController.downloadPhotoSelectionPhoto,
);

module.exports = router;
