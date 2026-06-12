const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" },
    role: {
      type: String,
      enum: ["master_admin", "studio"],
      default: "studio",
      index: true,
    },
    studioName: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    currentPlanId: { type: String, default: "", trim: true },
    currentPlanName: { type: String, default: "", trim: true },
    currentPlanBillingCycle: {
      type: String,
      enum: ["monthly", "sixMonth", "yearly", ""],
      default: "",
    },
    currentPlanStartedAt: { type: Date, default: null },
    currentPlanExpiresAt: { type: Date, default: null },
    currentPlanStatus: {
      type: String,
      enum: ["active", "expired", "cancelled", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
