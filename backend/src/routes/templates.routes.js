const express = require("express");
const templatesController = require("../controllers/templates.controller");

const router = express.Router();

router.get("/", templatesController.listTemplates);

router.get("/:templateId", templatesController.getTemplateByTemplateId);

module.exports = router;

