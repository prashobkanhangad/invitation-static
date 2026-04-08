const crypto = require("crypto");
const Template = require("../models/Template");
const Project = require("../models/Project");
const { uploadImageVariantsByProvider } = require("./storageUploader");
const { getActiveStorageProvider } = require("./storageSettings");

function normalizeSlug(input) {
  if (!input || typeof input !== "string") return "";
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function frontendBaseUrl() {
  return process.env.FRONTEND_BASE_URL || process.env.CORS_ORIGIN || "http://localhost:3000";
}

function serializeTemplate(template) {
  if (!template) return null;
  return {
    templateId: template.templateId,
    title: template.title,
    subtitle: template.subtitle,
    category: template.category,
    previewVariant: template.previewVariant,
    coverSrc: template.coverSrc,
    coverAlt: template.coverAlt,
    thumbs: template.thumbs,
    footerText: template.footerText,
  };
}

async function createProject(clientId, payload) {
  const { name } = payload || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return { error: { status: 400, message: "Project name is required" } };
  }
  const project = await Project.create({
    client: clientId,
    name: name.trim(),
    template: null,
    templateId: null,
    images: [],
  });
  return {
    project: { id: project._id, name: project.name, templateId: project.templateId, images: [] },
  };
}

async function getProject(clientId, projectId) {
  const project = await Project.findOne({ _id: projectId, client: clientId }).populate("template");
  if (!project) return { error: { status: 404, message: "Project not found" } };

  const base = frontendBaseUrl().replace(/\/$/, "");
  if (project.isPublished && !project.slug) {
    let candidate = normalizeSlug(project.name);
    if (!candidate) candidate = `p_${crypto.randomBytes(4).toString("hex")}`;
    const existing = await Project.findOne({ slug: candidate, _id: { $ne: project._id } });
    if (existing) candidate = `${candidate}-${crypto.randomBytes(2).toString("hex")}`;
    project.slug = candidate;
    await project.save();
  }
  const shareUrl = project.isPublished && project.slug
    ? `${base}/${project.slug}`
    : project.isPublished && project.shareToken
      ? `${base}/share/${project.shareToken}`
      : null;

  return {
    project: {
      id: project._id,
      name: project.name,
      templateId: project.templateId,
      shareToken: project.shareToken,
      slug: project.slug,
      isPublished: project.isPublished,
      shareUrl,
      template: serializeTemplate(project.template),
      images: project.images,
    },
  };
}

async function listProjects(clientId) {
  const projects = await Project.find({ client: clientId }).populate("template");
  return {
    projects: projects.map((p) => ({
      id: p._id,
      name: p.name,
      templateId: p.templateId,
      template: serializeTemplate(p.template),
      imagesCount: p.images.length,
    })),
  };
}

async function selectTemplate(clientId, projectId, payload) {
  const { templateId } = payload || {};
  if (!templateId || typeof templateId !== "string") {
    return { error: { status: 400, message: "templateId is required" } };
  }
  const template = await Template.findOne({ templateId });
  if (!template) return { error: { status: 404, message: "Template not found" } };

  const project = await Project.findOne({ _id: projectId, client: clientId });
  if (!project) return { error: { status: 404, message: "Project not found" } };
  project.template = template._id;
  project.templateId = template.templateId;
  await project.save();
  return { message: "Template selected", project: { id: project._id, templateId: project.templateId } };
}

async function uploadImages(clientId, projectId, files, req) {
  if (!Array.isArray(files) || files.length === 0) {
    return { error: { status: 400, message: "No images uploaded" } };
  }
  const project = await Project.findOne({ _id: projectId, client: clientId });
  if (!project) return { error: { status: 404, message: "Project not found" } };
  if (!project.templateId) {
    return { error: { status: 400, message: "Select a template before uploading images" } };
  }
  const provider = await getActiveStorageProvider();
  const uploadedImages = [];
  const ownerKey = String(clientId || "unknown-client");
  const projectKey = String(project._id || projectId);
  const folder = `client-projects/${ownerKey}/${projectKey}`;
  for (const file of files) {
    const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
      file,
      folder,
      provider,
    });
    uploadedImages.push({
      id: `img_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: displayUrl,
      originalUrl,
      thumbUrl,
      originalName: file.originalname || "",
      mimeType: file.mimetype || "",
    });
  }
  project.images = [...project.images, ...uploadedImages];
  await project.save();
  return { message: "Images uploaded", images: uploadedImages };
}

async function publishProject(clientId, projectId, payload) {
  const project = await Project.findOne({ _id: projectId, client: clientId }).populate("template");
  if (!project) return { error: { status: 404, message: "Project not found" } };
  if (!project.templateId || !project.template) {
    return { error: { status: 400, message: "Select a template before publishing" } };
  }
  if (!project.images || project.images.length === 0) {
    return { error: { status: 400, message: "Upload at least one image before publishing" } };
  }

  const normalizedFromUser = normalizeSlug(payload?.slug);
  const normalizedFromName = normalizeSlug(project.name);
  let finalSlug = normalizedFromUser || normalizedFromName;
  if (!finalSlug) finalSlug = `p_${crypto.randomBytes(4).toString("hex")}`;
  const existing = await Project.findOne({ slug: finalSlug, _id: { $ne: project._id } });
  if (existing) return { error: { status: 409, message: "This project slug is already taken" } };

  project.slug = finalSlug;
  if (!project.shareToken) project.shareToken = crypto.randomBytes(24).toString("hex");
  project.isPublished = true;
  await project.save();

  const frontendBase = frontendBaseUrl().replace(/\/$/, "");
  return {
    message: "Project published",
    shareToken: project.shareToken,
    slug: project.slug,
    shareUrl: `${frontendBase}/${finalSlug}`,
  };
}

module.exports = {
  createProject,
  getProject,
  listProjects,
  selectTemplate,
  uploadImages,
  publishProject,
};
