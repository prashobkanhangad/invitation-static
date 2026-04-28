const adminSettingsService = require("../services/adminSettings.service");

async function getPlans(_req, res) {
  try {
    const result = await adminSettingsService.getStudioPricingPlans();
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getUsage(req, res) {
  try {
    const result = await adminSettingsService.getStudioUsage(req.user.id);
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getPlans,
  getUsage,
};
