const Plan = require("../models/Plan");
const Album = require("../models/Album");
const Project = require("../models/Project");
const { getActiveStorageProvider } = require("./storageSettings");
const { calculatePrefixSizeByProvider } = require("./storageUploader");

const DEFAULT_PRICING_PLANS = [
  {
    id: "250gb",
    name: "250 GB",
    subtitle: "Ideal for growing studios",
    monthly: 2999,
    sixMonth: 11994,
    yearly: 20388,
    isCustom: false,
    ctaLabel: "Get Started",
    badgeLabel: "",
    features: ["Digital invitation", "Digital album", "Photo selection"],
    active: true,
  },
  {
    id: "500gb",
    name: "500 GB",
    subtitle: "For high-volume delivery",
    monthly: 4999,
    sixMonth: 20994,
    yearly: 35988,
    isCustom: false,
    ctaLabel: "Get Started",
    badgeLabel: "",
    features: ["Digital invitation", "Digital album", "Photo selection"],
    active: true,
  },
  {
    id: "1tb",
    name: "1 TB",
    subtitle: "Best for large studios",
    monthly: 7499,
    sixMonth: 29994,
    yearly: 50388,
    isCustom: false,
    ctaLabel: "Get Started",
    badgeLabel: "Current Plan",
    features: ["Digital invitation", "Digital album", "Photo selection"],
    active: true,
  },
  {
    id: "custom",
    name: "Custom Plan",
    subtitle: "Over 1 TB storage and enterprise needs",
    monthly: 0,
    sixMonth: 0,
    yearly: 0,
    isCustom: true,
    ctaLabel: "Contact Sales",
    badgeLabel: "",
    features: ["Digital invitation", "Digital album", "Photo selection", "Dedicated support"],
    active: true,
  },
];

function toPositiveNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

function normalizePlan(plan, index) {
  const monthly = toPositiveNumber(plan?.monthly);
  const sixMonth = toPositiveNumber(plan?.sixMonth);
  const yearly = toPositiveNumber(plan?.yearly);
  if (monthly === null || sixMonth === null || yearly === null) return null;

  const id = String(plan?.id || "").trim() || `plan_${index + 1}`;
  const name = String(plan?.name || "").trim();
  if (!name) return null;

  const features = Array.isArray(plan?.features)
    ? plan.features.map((f) => String(f || "").trim()).filter(Boolean)
    : [];

  return {
    id,
    name,
    subtitle: String(plan?.subtitle || "").trim(),
    monthly,
    sixMonth,
    yearly,
    isCustom: Boolean(plan?.isCustom),
    ctaLabel: String(plan?.ctaLabel || (plan?.isCustom ? "Contact Sales" : "Get Started")).trim(),
    badgeLabel: String(plan?.badgeLabel || "").trim(),
    features,
    active: plan?.active !== false,
    sortOrder: index,
  };
}

function sanitizePricingPlans(input) {
  if (!Array.isArray(input)) return null;
  const next = input.map((plan, index) => normalizePlan(plan, index)).filter(Boolean);
  if (!next.length) return null;
  return next;
}

function serializePlans(docs) {
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    subtitle: doc.subtitle || "",
    monthly: doc.monthly,
    sixMonth: doc.sixMonth,
    yearly: doc.yearly,
    isCustom: Boolean(doc.isCustom),
    ctaLabel: doc.ctaLabel || "",
    badgeLabel: doc.badgeLabel || "",
    features: Array.isArray(doc.features) ? doc.features : [],
    active: doc.active !== false,
  }));
}

async function seedDefaultPlansIfEmpty(actorId = null) {
  const count = await Plan.countDocuments();
  if (count > 0) return;
  await Plan.insertMany(
    DEFAULT_PRICING_PLANS.map((plan, index) => ({
      ...plan,
      sortOrder: index,
      updatedBy: actorId || null,
    }))
  );
}

async function getPricingPlans() {
  await seedDefaultPlansIfEmpty();
  const docs = await Plan.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();
  return serializePlans(docs);
}

async function replacePricingPlans(plans, actorId) {
  const sanitized = sanitizePricingPlans(plans);
  if (!sanitized) return null;
  await Plan.deleteMany({});
  await Plan.insertMany(
    sanitized.map((plan, index) => ({
      ...plan,
      sortOrder: index,
      updatedBy: actorId || null,
    }))
  );
  return getPricingPlans();
}

async function getUsageForStudioUser(userId) {
  const [albums, projects, provider] = await Promise.all([
    Album.find({ studioUser: userId }, { _id: 1, title: 1 }).lean(),
    Project.find({ studioUser: userId }, { _id: 1, name: 1 }).lean(),
    getActiveStorageProvider(),
  ]);

  const ownerKey = String(userId);

  const albumUsageByProject = await Promise.all(
    albums.map(async (album) => {
      const albumId = String(album._id);
      const basePrefix = `albums/${ownerKey}/${albumId}/`;
      const rawPrefix = `studio/${ownerKey}/albums/${albumId}/raw/`;
      const bytes =
        (await calculatePrefixSizeByProvider({ prefix: basePrefix, provider })) +
        (await calculatePrefixSizeByProvider({ prefix: rawPrefix, provider }));
      return {
        id: albumId,
        name: album.title || `Album ${albumId.slice(-6)}`,
        bytes,
      };
    })
  );

  const photoSelectionUsageByProject = await Promise.all(
    projects.map(async (project) => {
      const projectId = String(project._id);
      const basePrefix = `photo-selection/${ownerKey}/${projectId}/`;
      const rawPrefix = `studio/${ownerKey}/photo-selection/${projectId}/raw/`;
      const bytes =
        (await calculatePrefixSizeByProvider({ prefix: basePrefix, provider })) +
        (await calculatePrefixSizeByProvider({ prefix: rawPrefix, provider }));
      return {
        id: projectId,
        name: project.name || `Project ${projectId.slice(-6)}`,
        bytes,
      };
    })
  );

  const albumsBytes = albumUsageByProject.reduce((sum, item) => sum + Number(item.bytes || 0), 0);
  const photoSelectionBytes = photoSelectionUsageByProject.reduce(
    (sum, item) => sum + Number(item.bytes || 0),
    0
  );
  const totalBytes = albumsBytes + photoSelectionBytes;
  return {
    usage: {
      totalBytes,
      albumsBytes,
      photoSelectionBytes,
      albumsCount: albums.length,
      photoSelectionProjectsCount: projects.length,
      provider,
      albumUsageByProject,
      photoSelectionUsageByProject,
    },
  };
}

module.exports = {
  DEFAULT_PRICING_PLANS,
  getPricingPlans,
  getUsageForStudioUser,
  replacePricingPlans,
  sanitizePricingPlans,
  seedDefaultPlansIfEmpty,
};
