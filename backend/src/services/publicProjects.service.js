const Album = require("../models/Album");
const Project = require("../models/Project");

function normalizeTemplate(template) {
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

function normalizeSlug(input) {
  if (!input || typeof input !== "string") return "";
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function mapAlbumResponse(album) {
  return {
    project: {
      id: album._id,
      name: album.title,
      templateId: album.templateId,
      shareToken: album.shareToken,
      slug: album.slug,
    },
    template: {
      templateId: album.templateId,
      title: "Classic album",
      subtitle: "A cherished collection",
      category: "wedding",
      previewVariant: 1,
      coverSrc: album.bannerImage?.url || "",
      coverAlt: "Digital album cover",
      thumbs: album.highlights.map((i) => i.url),
      footerText: "Crafted on Invyto",
    },
    images: [
      ...(album.bannerImage ? [{ id: album.bannerImage.id, url: album.bannerImage.url }] : []),
      ...album.highlights.map((img) => ({ id: img.id, url: img.url })),
      ...album.galleryTabs.flatMap((tab) => tab.images.map((img) => ({ id: img.id, url: img.url }))),
    ],
    albumContent: {
      bannerImage: album.bannerImage,
      highlights: album.highlights,
      galleryTabs: album.galleryTabs,
    },
  };
}

async function getPublicProjectByShareToken(shareToken) {
  if (!shareToken) return { error: { status: 400, message: "shareToken required" } };

  const album = await Album.findOne({ shareToken, isPublished: true });
  if (album) return mapAlbumResponse(album);

  const project = await Project.findOne({ shareToken, isPublished: true }).populate("template");
  if (!project) return { error: { status: 404, message: "Project not found" } };
  return {
    project: {
      id: project._id,
      name: project.name,
      templateId: project.templateId,
      shareToken: project.shareToken,
    },
    template: normalizeTemplate(project.template),
    images: (project.images || []).map((img) => ({ id: img.id, url: img.url })),
    photoSelection: project.photoSelection || null,
  };
}

async function getPublicProjectBySlug(rawSlug) {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return { error: { status: 400, message: "slug required" } };

  const album = await Album.findOne({ slug, isPublished: true });
  if (album) return mapAlbumResponse(album);

  const project = await Project.findOne({ slug, isPublished: true }).populate("template");
  if (!project) return { error: { status: 404, message: "Project not found" } };
  return {
    project: {
      id: project._id,
      name: project.name,
      templateId: project.templateId,
      slug: project.slug,
    },
    template: normalizeTemplate(project.template),
    images: (project.images || []).map((img) => ({ id: img.id, url: img.url })),
    photoSelection: project.photoSelection || null,
  };
}

module.exports = {
  getPublicProjectByShareToken,
  getPublicProjectBySlug,
};
