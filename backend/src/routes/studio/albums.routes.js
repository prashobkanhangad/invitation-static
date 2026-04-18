const express = require("express");
const { authRequired, requireRole } = require("../../middleware/auth");
const { uploadMemory } = require("../../services/storageUploader");
const studioAlbumsController = require("../../controllers/studioAlbums.controller");

const router = express.Router();
router.use(authRequired, requireRole("master_admin", "studio"));
router.post("/", studioAlbumsController.createAlbum);
router.get("/", studioAlbumsController.listAlbums);
router.get("/:albumId", studioAlbumsController.getAlbum);
router.patch("/:albumId", studioAlbumsController.updateAlbum);
router.post("/:albumId/banner/direct-upload/prepare", studioAlbumsController.prepareBannerDirectUpload);
router.post("/:albumId/banner/direct-upload/commit", studioAlbumsController.commitBannerDirectUpload);
router.post("/:albumId/banner", uploadMemory.single("image"), studioAlbumsController.uploadBanner);
router.post("/:albumId/highlights/direct-upload/prepare", studioAlbumsController.prepareHighlightsDirectUpload);
router.post("/:albumId/highlights/direct-upload/commit", studioAlbumsController.commitHighlightsDirectUpload);
router.post("/:albumId/highlights", uploadMemory.array("images", 30), studioAlbumsController.uploadHighlights);
router.post("/:albumId/gallery-tabs", studioAlbumsController.createGalleryTab);
router.patch("/:albumId/gallery-tabs/:tabId", studioAlbumsController.updateGalleryTab);
router.delete("/:albumId/gallery-tabs/:tabId", studioAlbumsController.deleteGalleryTab);
router.post(
  "/:albumId/gallery-tabs/:tabId/images/direct-upload/prepare",
  studioAlbumsController.prepareGalleryTabDirectUpload
);
router.post(
  "/:albumId/gallery-tabs/:tabId/images/direct-upload/commit",
  studioAlbumsController.commitGalleryTabDirectUpload
);
router.post("/:albumId/gallery-tabs/:tabId/images", uploadMemory.array("images", 50), studioAlbumsController.uploadTabImages);
router.delete("/:albumId/images/:imageId", studioAlbumsController.deleteImage);
router.post("/:albumId/publish", studioAlbumsController.publishAlbum);

module.exports = router;
