const mongoose = require("mongoose");

const clientProjectImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    originalUrl: { type: String, default: "" },
    thumbUrl: { type: String, default: "" },
    originalName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
  },
  { _id: false }
);

const photoSelectionTabSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const photoSelectionPhotoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    originalUrl: { type: String, default: "" },
    thumbUrl: { type: String, default: "" },
    originalName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    tabId: { type: String, default: null },
    picked: { type: Boolean, default: false },
    fav: { type: Boolean, default: false },
  },
  { _id: false }
);

const photoSelectionSchema = new mongoose.Schema(
  {
    goal: { type: Number, default: 0 },
    clientTabs: { type: [photoSelectionTabSchema], default: [] },
    photos: { type: [photoSelectionPhotoSchema], default: [] },
    ogImage: { type: clientProjectImageSchema, default: null },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    /** When true, public `/photos/{slug}` (and share link) require PIN + short-lived access token. */
    pinEnabled: { type: Boolean, default: false },
    pinHash: { type: String, default: "" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    studioUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null, index: true },
    name: { type: String, required: true, trim: true },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
    templateId: { type: String, default: null },
    images: { type: [clientProjectImageSchema], default: [] },
    photoSelection: { type: photoSelectionSchema, default: () => ({}) },
    isPublished: { type: Boolean, default: false, index: true },
    slug: { type: String, default: undefined, unique: true, sparse: true, index: true },
    shareToken: { type: String, default: undefined, unique: true, sparse: true, index: true },
  },
  { timestamps: true }
);

projectSchema.set("toJSON", {
  transform(_doc, ret) {
    if (ret.photoSelection && typeof ret.photoSelection === "object" && "pinHash" in ret.photoSelection) {
      delete ret.photoSelection.pinHash;
    }
    return ret;
  },
});

module.exports = mongoose.model("Project", projectSchema);

