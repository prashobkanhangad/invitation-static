const bcrypt = require("bcryptjs");
const User = require("../models/User");

function serializeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name || "",
    studioName: user.studioName || "",
    role: user.role,
    currentPlanId: user.currentPlanId || "",
    currentPlanName: user.currentPlanName || "",
    currentPlanBillingCycle: user.currentPlanBillingCycle || "",
    currentPlanStartedAt: user.currentPlanStartedAt || null,
    currentPlanExpiresAt: user.currentPlanExpiresAt || null,
    currentPlanStatus: user.currentPlanStatus || "none",
  };
}

function clampStr(v, max) {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return "";
  return t.slice(0, max);
}

async function getMyAccount(userId) {
  const user = await User.findById(userId);
  if (!user || !user.isActive) return { error: { status: 404, message: "User not found" } };
  return { user: serializeUser(user) };
}

async function updateMyAccount(userId, payload) {
  const user = await User.findById(userId);
  if (!user || !user.isActive) return { error: { status: 404, message: "User not found" } };

  const { name, studioName, currentPassword, newPassword } = payload || {};
  let dirty = false;

  if (name !== undefined) {
    const next = clampStr(name, 120);
    if (next === null) return { error: { status: 400, message: "Invalid name" } };
    user.name = next;
    dirty = true;
  }
  if (studioName !== undefined) {
    const next = clampStr(studioName, 120);
    if (next === null) return { error: { status: 400, message: "Invalid studio name" } };
    user.studioName = next;
    dirty = true;
  }

  const hasPwdChange =
    typeof currentPassword === "string" &&
    currentPassword.length > 0 &&
    typeof newPassword === "string" &&
    newPassword.length > 0;

  if (hasPwdChange) {
    if (newPassword.length < 6) {
      return { error: { status: 400, message: "New password must be at least 6 characters" } };
    }
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return { error: { status: 401, message: "Current password is incorrect" } };
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    dirty = true;
  }

  if (!dirty) return { error: { status: 400, message: "No changes to save" } };

  await user.save();
  return { user: serializeUser(user) };
}

module.exports = {
  getMyAccount,
  updateMyAccount,
};
