const templatesService = require("../services/templates.service");

async function listTemplates(_req, res) {
  const templates = await templatesService.listTemplates();
  return res.json({ templates });
}

async function getTemplateByTemplateId(req, res) {
  const template = await templatesService.getTemplateByTemplateId(req.params.templateId);
  if (!template) return res.status(404).json({ message: "Template not found" });
  return res.json({ template });
}

module.exports = {
  listTemplates,
  getTemplateByTemplateId,
};
