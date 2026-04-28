const mongoose = require("mongoose");

const albumImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    originalUrl: { type: String, default: "" },
    thumbUrl: { type: String, default: "" },
    originalName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    byteSize: { type: Number, default: 0, min: 0 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const albumGalleryTabSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
    images: { type: [albumImageSchema], default: [] },
  },
  { _id: false }
);

const albumSchema = new mongoose.Schema(
  {
    studioUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null, index: true },
    title: { type: String, required: true, trim: true },
    templateId: { type: String, default: "album-default" },
    /** CSS background-position for full-screen banner (album public hero). */
    bannerHeroDesktopPosition: { type: String, default: "50% 50%" },
    bannerHeroMobilePosition: { type: String, default: "50% 50%" },
    bannerImage: { type: albumImageSchema, default: null },
    highlights: { type: [albumImageSchema], default: [] },
    galleryTabs: { type: [albumGalleryTabSchema], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null },
    slug: { type: String, default: undefined, unique: true, sparse: true, index: true },
    shareToken: { type: String, default: undefined, unique: true, sparse: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);
