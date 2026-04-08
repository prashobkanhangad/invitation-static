const adminSettingsService = require("../services/adminSettings.service");

async function getSettings(_req, res) {
  const result = await adminSettingsService.getSettings();
  return res.json(result);
}

async function updateSettings(req, res) {
  try {
    const result = await adminSettingsService.updateSettings(req.body, req.user.id);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getSettings,
  updateSettings,
};
