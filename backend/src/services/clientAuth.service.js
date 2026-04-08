const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Client = require("../models/Client");

function serializeClient(client) {
  return { id: client._id, email: client.email, name: client.name };
}

async function registerClient(payload) {
  const { email, password, name } = payload || {};
  if (!email || typeof email !== "string") return { error: { status: 400, message: "Email is required" } };
  if (!password || typeof password !== "string" || password.length < 6) {
    return { error: { status: 400, message: "Password is required (min 6 characters)" } };
  }

  const lowerEmail = email.toLowerCase();
  const existing = await Client.findOne({ email: lowerEmail });
  if (existing) return { error: { status: 409, message: "Email already in use" } };

  const passwordHash = await bcrypt.hash(password, 10);
  const client = await Client.create({
    email: lowerEmail,
    passwordHash,
    name: typeof name === "string" ? name : "",
  });

  return { client: serializeClient(client) };
}

async function loginClient(payload) {
  const { email, password } = payload || {};
  if (!email || typeof email !== "string") return { error: { status: 400, message: "Email is required" } };
  if (!password || typeof password !== "string") {
    return { error: { status: 400, message: "Password is required" } };
  }

  const client = await Client.findOne({ email: email.toLowerCase() });
  if (!client) return { error: { status: 401, message: "Invalid credentials" } };

  const ok = await bcrypt.compare(password, client.passwordHash);
  if (!ok) return { error: { status: 401, message: "Invalid credentials" } };

  const token = jwt.sign(
    { sub: client._id.toString(), email: client.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return { token, client: serializeClient(client) };
}

module.exports = {
  registerClient,
  loginClient,
};
