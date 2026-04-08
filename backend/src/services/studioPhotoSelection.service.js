const Project = require("../models/Project");
const { uploadImageVariantsByProvider } = require("./storageUploader");
const { getActiveStorageProvider } = require("./storageSettings");

async function getStudioProject(user, projectId) {
  const q = { _id: projectId };
  if (user.role === "studio") q.studioUser = user.id;
  return Project.findOne(q);
}

async function createProject(user, payload) {
  const { name, goal = 0 } = payload || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return { error: { status: 400, message: "Project name is required" } };
  }
  const project = await Project.create({
    studioUser: user.id,
    client: null,
    name: name.trim(),
    template: null,
    templateId: null,
    images: [],
    photoSelection: {
      goal: Number(goal) || 0,
      clientTabs: [],
      photos: [],
      published: false,
      publishedAt: null,
    },
  });
  return { project };
}

async function listProjects(user) {
  const q = user.role === "studio" ? { studioUser: user.id } : {};
  const projects = await Project.find(q).sort({ updatedAt: -1 });
  return { projects };
}

async function getProject(user, projectId) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  return { project };
}

async function updateProject(user, projectId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const { name, goal, clientTabs } = payload || {};
  if (typeof name === "string" && name.trim()) project.name = name.trim();
  if (typeof goal === "number") project.photoSelection.goal = goal;
  if (Array.isArray(clientTabs)) {
    project.photoSelection.clientTabs = clientTabs
      .filter((t) => t && typeof t.id === "string")
      .map((t, i) => ({ id: t.id, label: String(t.label || ""), order: Number(t.order ?? i) }));
  }
  await project.save();
  return { project };
}

async function uploadPhotos(user, projectId, files, payload, req) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  if (!Array.isArray(files) || files.length === 0) {
    return { error: { status: 400, message: "No images uploaded" } };
  }
  const tabId = typeof payload?.tabId === "string" && payload.tabId ? payload.tabId : null;
  const provider = await getActiveStorageProvider();
  const ownerKey = String(user.id || "unknown-user");
  const projectKey = String(project._id || projectId);
  const folder = `photo-selection/${ownerKey}/${projectKey}`;
  const next = [];
  for (const f of files) {
    const { originalUrl, displayUrl, thumbUrl } = await uploadImageVariantsByProvider({
      file: f,
      folder,
      provider,
    });
    next.push({
      id: `ps_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      url: displayUrl,
      originalUrl,
      thumbUrl,
      originalName: f.originalname || "",
      mimeType: f.mimetype || "",
      tabId,
      picked: false,
      fav: false,
    });
  }
  project.photoSelection.photos = [...(project.photoSelection.photos || []), ...next];
  await project.save();
  return { photos: next };
}

async function updatePhoto(user, projectId, photoId, payload) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const photo = (project.photoSelection.photos || []).find((p) => p.id === photoId);
  if (!photo) return { error: { status: 404, message: "Photo not found" } };
  const { picked, fav, tabId } = payload || {};
  if (typeof picked === "boolean") photo.picked = picked;
  if (typeof fav === "boolean") photo.fav = fav;
  if (typeof tabId === "string" || tabId === null) photo.tabId = tabId;
  await project.save();
  return { photo };
}

async function publishProject(user, projectId) {
  const project = await getStudioProject(user, projectId);
  if (!project) return { error: { status: 404, message: "Project not found" } };
  const photos = project.photoSelection?.photos || [];
  if (photos.length === 0) return { error: { status: 400, message: "Add photos before publishing" } };
  project.photoSelection.published = true;
  project.photoSelection.publishedAt = new Date();
  await project.save();
  return { message: "Photo selection published", project };
}

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  uploadPhotos,
  updatePhoto,
  publishProject,
};
