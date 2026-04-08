const express = require("express");
const { authRequired, requireRole } = require("../../middleware/auth");
const adminSettingsController = require("../../controllers/adminSettings.controller");

const router = express.Router();

router.use(authRequired, requireRole("master_admin"));

router.get("/", adminSettingsController.getSettings);

router.patch("/", adminSettingsController.updateSettings);

module.exports = router;
