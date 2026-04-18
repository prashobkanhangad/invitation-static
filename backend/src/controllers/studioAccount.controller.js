const studioAccountService = require("../services/studioAccount.service");

async function getMe(req, res) {
  try {
    const result = await studioAccountService.getMyAccount(req.user.id);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function patchMe(req, res) {
  try {
    const result = await studioAccountService.updateMyAccount(req.user.id, req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getMe, patchMe };
