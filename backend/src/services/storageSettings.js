const AppSetting = require("../models/AppSetting");

async function getOrCreateSettings() {
  let doc = await AppSetting.findOne({ singletonKey: "global" });
  if (!doc) {
    doc = await AppSetting.create({
      singletonKey: "global",
      storageProvider: "aws_s3",
      updatedBy: null,
    });
  }
  return doc;
}

async function getActiveStorageProvider() {
  const doc = await getOrCreateSettings();
  return doc.storageProvider || "aws_s3";
}

async function setActiveStorageProvider(provider, userId) {
  const next = provider === "gcp_storage" ? "gcp_storage" : "aws_s3";
  const doc = await getOrCreateSettings();
  doc.storageProvider = next;
  doc.updatedBy = userId || null;
  await doc.save();
  return doc;
}

module.exports = {
  getOrCreateSettings,
  getActiveStorageProvider,
  setActiveStorageProvider,
};
