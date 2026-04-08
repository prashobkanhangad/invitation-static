const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    templateId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    category: {
      type: String,
      enum: ["wedding", "birthday", "baby", "corporate"],
      default: "wedding",
    },
    previewVariant: { type: Number, required: true, min: 1, max: 1 },
    coverSrc: { type: String, default: "" },
    coverAlt: { type: String, default: "" },
    thumbs: { type: [String], default: [] },
    footerText: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);

