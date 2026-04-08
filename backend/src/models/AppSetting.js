const mongoose = require("mongoose");

const appSettingSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, unique: true, default: "global" },
    storageProvider: {
      type: String,
      enum: ["aws_s3", "gcp_storage"],
      default: "aws_s3",
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppSetting", appSettingSchema);
