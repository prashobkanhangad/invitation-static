const adminUsersService = require("../services/adminUsers.service");

async function listUsers(_req, res) {
  const users = await adminUsersService.listUsers();
  return res.json({ users });
}

async function createUser(req, res) {
  try {
    const result = await adminUsersService.createUser(req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.status(201).json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateUser(req, res) {
  try {
    const result = await adminUsersService.updateUser(req.params.userId, req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function reactivateUserPlan(req, res) {
  try {
    const result = await adminUsersService.reactivateUserPlan(req.params.userId, req.body);
    if (result.error) return res.status(result.error.status).json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listUsers,
  createUser,
  reactivateUserPlan,
  updateUser,
};
