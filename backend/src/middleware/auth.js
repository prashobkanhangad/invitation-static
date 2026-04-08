const jwt = require("jsonwebtoken");
const Client = require("../models/Client");
const User = require("../models/User");

async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing Bearer token" });
    }

    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.kind === "user") {
      const user = await User.findById(payload.sub);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        kind: "user",
        studioName: user.studioName || "",
      };
      return next();
    }

    const client = await Client.findById(payload.sub);
    if (!client) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { id: client._id.toString(), email: client.email, kind: "client", role: "client" };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}

module.exports = { authRequired, requireRole };

