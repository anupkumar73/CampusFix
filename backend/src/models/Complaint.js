const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, index: true },
  reporterId: { type: String, required: true, index: true },
  reporterName: { type: String, default: "Student" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "Other" },
  location: { type: String, default: "Unknown" },
  latitude: Number,
  longitude: Number,
  imageUrl: String,
  priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  severityScore: { type: Number, default: 50 },
  aiConfidence: { type: Number, default: 0.7 },
  assignedDepartment: { type: String, default: "General Maintenance" },
  assignedTo: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Reported", "Verified", "Assigned", "In Progress", "Resolved", "Reopened"],
    default: "Reported"
  },
  duplicateOf: { type: String, default: null },
  supportCount: { type: Number, default: 0 },
  escalationLevel: { type: Number, default: 0 },
  escalationDueAt: Date,
  resolutionNote: String,
  studentVerified: { type: Boolean, default: false },
  timeline: [{
    status: String,
    note: String,
    at: { type: Date, default: Date.now },
    by: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
