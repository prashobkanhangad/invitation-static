const bcrypt = require("bcryptjs");
const User = require("../models/User");

function serializeUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    studioName: user.studioName,
    isActive: user.isActive,
  };
}

async function listUsers() {
  return User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
}

async function createUser(payload) {
  const { email, password, name, role, studioName } = payload || {};
  if (!email || typeof email !== "string") return { error: { status: 400, message: "Email is required" } };
  if (!password || typeof password !== "string" || password.length < 6) {
    return { error: { status: 400, message: "Password is required (min 6 characters)" } };
  }
  const nextRole = role === "master_admin" ? "master_admin" : "studio";
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return { error: { status: 409, message: "Email already in use" } };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name: typeof name === "string" ? name : "",
    role: nextRole,
    studioName: typeof studioName === "string" ? studioName : "",
    isActive: true,
  });
  return { user: serializeUser(user) };
}

async function updateUser(userId, payload) {
  const { name, studioName, role, isActive } = payload || {};
  const user = await User.findById(userId);
  if (!user) return { error: { status: 404, message: "User not found" } };

  if (typeof name === "string") user.name = name;
  if (typeof studioName === "string") user.studioName = studioName;
  if (role === "master_admin" || role === "studio") user.role = role;
  if (typeof isActive === "boolean") user.isActive = isActive;
  await user.save();
  return { user: serializeUser(user) };
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
};
