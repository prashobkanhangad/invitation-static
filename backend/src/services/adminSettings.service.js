const { getOrCreateSettings, setActiveStorageProvider } = require("./storageSettings");
const {
  getPricingPlans,
  getUsageForStudioUser,
  replacePricingPlans,
  seedDefaultPlansIfEmpty,
} = require("./plans.service");

async function serializeSettings(settings) {
  const pricingPlans = await getPricingPlans();
  return {
    storageProvider: settings.storageProvider,
    pricingPlans,
    updatedAt: settings.updatedAt,
  };
}

async function getSettings() {
  const settings = await getOrCreateSettings();
  await seedDefaultPlansIfEmpty();
  return { settings: await serializeSettings(settings) };
}

async function updateSettings(payload, actorId) {
  const { storageProvider } = payload || {};
  const hasStorageProvider = typeof storageProvider !== "undefined";
  if (hasStorageProvider && storageProvider !== "aws_s3" && storageProvider !== "gcp_storage") {
    return { error: { status: 400, message: "storageProvider must be aws_s3 or gcp_storage" } };
  }

  const hasPricingPlans = Object.prototype.hasOwnProperty.call(payload || {}, "pricingPlans");
  if (hasPricingPlans && !Array.isArray(payload?.pricingPlans)) {
    return { error: { status: 400, message: "pricingPlans must be a non-empty valid array" } };
  }

  let settings = await getOrCreateSettings();
  if (hasStorageProvider) {
    settings = await setActiveStorageProvider(storageProvider, actorId);
  }
  if (hasPricingPlans) {
    const nextPlans = await replacePricingPlans(payload.pricingPlans, actorId);
    if (!nextPlans) {
      return { error: { status: 400, message: "pricingPlans must be a non-empty valid array" } };
    }
  }
  return { settings: await serializeSettings(settings) };
}

async function getStudioPricingPlans() {
  const plans = await getPricingPlans();
  return { plans };
}

async function getStudioUsage(userId) {
  return getUsageForStudioUser(userId);
}

module.exports = {
  getSettings,
  getStudioPricingPlans,
  getStudioUsage,
  updateSettings,
};
