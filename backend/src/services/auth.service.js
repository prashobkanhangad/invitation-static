const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signUserToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role, kind: "user" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function serializeUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    studioName: user.studioName,
  };
}

async function registerBootstrapUser(payload) {
  const { email, password, name, role, studioName } = payload || {};
  if (!email || typeof email !== "string") {
    return { error: { status: 400, message: "Email is required" } };
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return { error: { status: 400, message: "Password is required (min 6 characters)" } };
  }

  const lowerEmail = email.toLowerCase();
  const existing = await User.findOne({ email: lowerEmail });
  if (existing) return { error: { status: 409, message: "Email already in use" } };

  const usersCount = await User.countDocuments();
  let nextRole = "studio";
  if (usersCount === 0) {
    nextRole = "master_admin";
  } else {
    return {
      error: {
        status: 403,
        message: "Self registration disabled. Master admin should create users via /api/admin/users.",
      },
    };
  }
  if (role === "master_admin" && usersCount > 0) nextRole = "studio";

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: lowerEmail,
    passwordHash,
    name: typeof name === "string" ? name : "",
    studioName: typeof studioName === "string" ? studioName : "",
    role: nextRole,
  });

  return { token: signUserToken(user), user: serializeUser(user) };
}

async function loginUser(payload) {
  const { email, password } = payload || {};
  if (!email || typeof email !== "string") return { error: { status: 400, message: "Email is required" } };
  if (!password || typeof password !== "string") {
    return { error: { status: 400, message: "Password is required" } };
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) return { error: { status: 401, message: "Invalid credentials" } };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: { status: 401, message: "Invalid credentials" } };

  return { token: signUserToken(user), user: serializeUser(user) };
}

module.exports = {
  registerBootstrapUser,
  loginUser,
};
