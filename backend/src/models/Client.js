const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);

