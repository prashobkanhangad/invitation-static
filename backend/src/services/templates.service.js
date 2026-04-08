const Template = require("../models/Template");

async function listTemplates() {
  return Template.find(
    {},
    {
      templateId: 1,
      title: 1,
      subtitle: 1,
      category: 1,
      previewVariant: 1,
      coverSrc: 1,
      coverAlt: 1,
      thumbs: 1,
      footerText: 1,
    }
  ).sort({ createdAt: -1 });
}

async function getTemplateByTemplateId(templateId) {
  return Template.findOne({ templateId });
}

module.exports = {
  listTemplates,
  getTemplateByTemplateId,
};
