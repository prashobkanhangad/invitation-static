const express = require("express");
const { authRequired, requireRole } = require("../../middleware/auth");
const studioPlansController = require("../../controllers/studioPlans.controller");

const router = express.Router();

router.use(authRequired, requireRole("master_admin", "studio"));

router.get("/", studioPlansController.getPlans);
router.get("/usage", studioPlansController.getUsage);

module.exports = router;
