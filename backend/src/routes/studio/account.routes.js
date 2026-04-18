const express = require("express");
const { authRequired, requireRole } = require("../../middleware/auth");
const studioAccountController = require("../../controllers/studioAccount.controller");

const router = express.Router();
router.use(authRequired, requireRole("master_admin", "studio"));

router.get("/", studioAccountController.getMe);
router.patch("/", studioAccountController.patchMe);

module.exports = router;
