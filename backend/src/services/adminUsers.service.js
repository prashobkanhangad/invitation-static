const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Plan = require("../models/Plan");
const { getUsageForStudioUser } = require("./plans.service");

const BILLING_CYCLES = new Set(["monthly", "sixMonth", "yearly"]);
const PLAN_STATUSES = new Set(["active", "expired", "cancelled", "none"]);

function addMonths(base, months) {
  const next = new Date(base);
  next.setMonth(next.getMonth() + months);
  return next;
}

function parseDateInput(value) {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function resolvePlanMeta(planId) {
  const id = String(planId || "").trim();
  if (!id) return null;
  const plan = await Plan.findOne({ id }).lean();
  if (!plan) return null;
  return { id: plan.id, name: plan.name };
}

function serializeUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    studioName: user.studioName,
    isActive: user.isActive,
    currentPlanId: user.currentPlanId || "",
    currentPlanName: user.currentPlanName || "",
    currentPlanBillingCycle: user.currentPlanBillingCycle || "",
    currentPlanStartedAt: user.currentPlanStartedAt || null,
    currentPlanExpiresAt: user.currentPlanExpiresAt || null,
    currentPlanStatus: user.currentPlanStatus || "none",
    usage: user.usage || null,
  };
}

async function listUsers() {
  const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
  const enriched = await Promise.all(
    users.map(async (user) => {
      try {
        const result = await getUsageForStudioUser(user._id);
        return { ...user, usage: result?.usage || null };
      } catch {
        return { ...user, usage: null };
      }
    })
  );
  return enriched;
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
    currentPlanStatus: "none",
  });
  return { user: serializeUser(user) };
}

async function updateUser(userId, payload) {
  const {
    name,
    studioName,
    role,
    isActive,
    password,
    currentPlanId,
    currentPlanName,
    currentPlanBillingCycle,
    currentPlanStartedAt,
    currentPlanExpiresAt,
    currentPlanStatus,
  } = payload || {};
  const user = await User.findById(userId);
  if (!user) return { error: { status: 404, message: "User not found" } };

  if (typeof name === "string") user.name = name;
  if (typeof studioName === "string") user.studioName = studioName;
  if (role === "master_admin" || role === "studio") user.role = role;
  if (typeof isActive === "boolean") user.isActive = isActive;
  if (typeof currentPlanStatus === "string" && PLAN_STATUSES.has(currentPlanStatus)) {
    user.currentPlanStatus = currentPlanStatus;
  }
  if (
    typeof currentPlanBillingCycle === "string" &&
    (currentPlanBillingCycle === "" || BILLING_CYCLES.has(currentPlanBillingCycle))
  ) {
    user.currentPlanBillingCycle = currentPlanBillingCycle;
  }

  if (typeof currentPlanId === "string") {
    const nextPlanId = currentPlanId.trim();
    if (!nextPlanId) {
      user.currentPlanId = "";
      user.currentPlanName = typeof currentPlanName === "string" ? currentPlanName.trim() : "";
    } else {
      const meta = await resolvePlanMeta(nextPlanId);
      if (!meta) return { error: { status: 400, message: "Invalid plan selected" } };
      user.currentPlanId = meta.id;
      user.currentPlanName = meta.name;
    }
  } else if (typeof currentPlanName === "string") {
    user.currentPlanName = currentPlanName.trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload || {}, "currentPlanStartedAt")) {
    const nextStartedAt = parseDateInput(currentPlanStartedAt);
    if (currentPlanStartedAt && !nextStartedAt) {
      return { error: { status: 400, message: "Invalid currentPlanStartedAt date" } };
    }
    user.currentPlanStartedAt = nextStartedAt;
  }
  if (Object.prototype.hasOwnProperty.call(payload || {}, "currentPlanExpiresAt")) {
    const nextExpiresAt = parseDateInput(currentPlanExpiresAt);
    if (currentPlanExpiresAt && !nextExpiresAt) {
      return { error: { status: 400, message: "Invalid currentPlanExpiresAt date" } };
    }
    user.currentPlanExpiresAt = nextExpiresAt;
  }

  if (password !== undefined && password !== null) {
    const p = typeof password === "string" ? password.trim() : "";
    if (p.length > 0) {
      if (p.length < 6) {
        return { error: { status: 400, message: "Password must be at least 6 characters" } };
      }
      user.passwordHash = await bcrypt.hash(p, 10);
    }
  }

  await user.save();
  return { user: serializeUser(user) };
}

async function reactivateUserPlan(userId, payload) {
  const user = await User.findById(userId);
  if (!user) return { error: { status: 404, message: "User not found" } };

  const nextBillingCycle = String(payload?.billingCycle || user.currentPlanBillingCycle || "monthly");
  if (!BILLING_CYCLES.has(nextBillingCycle)) {
    return { error: { status: 400, message: "Invalid billing cycle" } };
  }

  const nextPlanId = String(payload?.planId || user.currentPlanId || "").trim();
  if (!nextPlanId) return { error: { status: 400, message: "Plan is required to reactivate" } };
  const planMeta = await resolvePlanMeta(nextPlanId);
  if (!planMeta) return { error: { status: 400, message: "Invalid plan selected" } };

  const startedAt = new Date();
  const expiresAt =
    nextBillingCycle === "yearly"
      ? addMonths(startedAt, 12)
      : nextBillingCycle === "sixMonth"
        ? addMonths(startedAt, 6)
        : addMonths(startedAt, 1);

  user.currentPlanId = planMeta.id;
  user.currentPlanName = planMeta.name;
  user.currentPlanBillingCycle = nextBillingCycle;
  user.currentPlanStartedAt = startedAt;
  user.currentPlanExpiresAt = expiresAt;
  user.currentPlanStatus = "active";
  user.isActive = true;

  await user.save();
  return { user: serializeUser(user) };
}

module.exports = {
  listUsers,
  createUser,
  reactivateUserPlan,
  updateUser,
};
