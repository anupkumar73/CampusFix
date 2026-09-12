const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  responseHours: { type: Number, default: 24 },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model("Department", departmentSchema);
