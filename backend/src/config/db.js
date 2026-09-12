const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) return false;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB unavailable; using the persistent demo store.");
    return false;
  }
}

module.exports = connectDB;
