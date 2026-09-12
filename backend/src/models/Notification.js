const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  title: String,
  message: String,
  type: { type: String, default: "info" },
  read: { type: Boolean, default: false },
  complaintId: String
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
