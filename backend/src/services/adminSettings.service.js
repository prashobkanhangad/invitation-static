const { getOrCreateSettings, setActiveStorageProvider } = require("./storageSettings");

function serializeSettings(settings) {
  return {
    storageProvider: settings.storageProvider,
    updatedAt: settings.updatedAt,
  };
}

async function getSettings() {
  const settings = await getOrCreateSettings();
  return { settings: serializeSettings(settings) };
}

async function updateSettings(payload, actorId) {
  const { storageProvider } = payload || {};
  if (storageProvider !== "aws_s3" && storageProvider !== "gcp_storage") {
    return { error: { status: 400, message: "storageProvider must be aws_s3 or gcp_storage" } };
  }
  const settings = await setActiveStorageProvider(storageProvider, actorId);
  return { settings: serializeSettings(settings) };
}

module.exports = {
  getSettings,
  updateSettings,
};
