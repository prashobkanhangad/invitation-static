const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    monthly: { type: Number, required: true, min: 0 },
    sixMonth: { type: Number, required: true, min: 0 },
    yearly: { type: Number, required: true, min: 0 },
    isCustom: { type: Boolean, default: false },
    ctaLabel: { type: String, default: "Get Started", trim: true },
    badgeLabel: { type: String, default: "", trim: true },
    features: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, required: true, min: 0, default: 0 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
