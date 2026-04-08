const express = require("express");
const clientAuthController = require("../../controllers/clientAuth.controller");

const router = express.Router();

router.post("/register", clientAuthController.register);
router.post("/login", clientAuthController.login);

module.exports = router;

