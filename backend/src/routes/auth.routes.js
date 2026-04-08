const express = require("express");
const { authRequired, requireRole } = require("../middleware/auth");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authRequired, requireRole("master_admin", "studio"), authController.me);

module.exports = router;
