const authService = require("../services/auth.service");

async function register(req, res) {
  try {
    const result = await authService.registerBootstrapUser(req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.status(201).json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const result = await authService.loginUser(req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  me,
};
