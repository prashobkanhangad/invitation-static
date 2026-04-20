const mongoose = require("mongoose");

const uploadJobSchema = new mongoose.Schema(
  {
    studioUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
      index: true,
    },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    progress: {
      total: { type: Number, default: 0 },
      done: { type: Number, default: 0 },
      message: { type: String, default: "" },
    },
    result: { type: mongoose.Schema.Types.Mixed, default: null },
    errorMessage: { type: String, default: "" },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UploadJob", uploadJobSchema);

