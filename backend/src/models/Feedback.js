
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  userId: String, complaintId: String, rating: { type:Number, min:1, max:5 },
  resolved: Boolean, comment: String
}, { timestamps:true });
module.exports = mongoose.model("Feedback", schema);
