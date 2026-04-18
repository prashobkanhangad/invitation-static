const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const SALT_LEN = 16;
const KEY_LEN = 64;

function hashPhotoSelectionPin(plainPin) {
  const salt = crypto.randomBytes(SALT_LEN).toString("hex");
  const hash = crypto.scryptSync(String(plainPin), salt, KEY_LEN).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPhotoSelectionPin(plainPin, stored) {
  const s = String(stored || "");
  const i = s.indexOf(":");
  if (i < 1) return false;
  const salt = s.slice(0, i);
  const hash = s.slice(i + 1);
  if (!salt || !hash) return false;
  try {
    const derived = crypto.scryptSync(String(plainPin), salt, KEY_LEN).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
  } catch {
    return false;
  }
}

function issuePhotoSelectionAccessToken(projectId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign({ typ: "photo_sel", pid: String(projectId) }, secret, { expiresIn: "7d" });
}

function verifyPhotoSelectionAccessToken(token, projectId) {
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return null;
  try {
    const p = jwt.verify(token, secret);
    if (p.typ !== "photo_sel" || String(p.pid) !== String(projectId)) return null;
    return p;
  } catch {
    return null;
  }
}

function bearerFromAuthorizationHeader(authorizationHeader) {
  const h = String(authorizationHeader || "");
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : "";
}

function photoSelectionPinActive(project) {
  return Boolean(project?.photoSelection?.pinEnabled && project?.photoSelection?.pinHash);
}

function assertPhotoSelectionPinAccess(project, accessToken) {
  if (!photoSelectionPinActive(project)) return { ok: true };
  if (verifyPhotoSelectionAccessToken(accessToken, project._id)) return { ok: true };
  return { error: { status: 401, message: "PIN required", pinRequired: true } };
}

module.exports = {
  hashPhotoSelectionPin,
  verifyPhotoSelectionPin,
  issuePhotoSelectionAccessToken,
  verifyPhotoSelectionAccessToken,
  bearerFromAuthorizationHeader,
  photoSelectionPinActive,
  assertPhotoSelectionPinAccess,
};
