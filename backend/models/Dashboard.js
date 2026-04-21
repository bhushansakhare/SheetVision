const mongoose = require("mongoose");
const crypto = require("crypto");

const dashboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    sheetUrl: { type: String, required: true },
    columns: { type: [String], default: [] },
    shareId: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(8).toString("hex"),
    },
    layoutConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dashboard", dashboardSchema);
