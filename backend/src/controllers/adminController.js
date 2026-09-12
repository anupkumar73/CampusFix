const Complaint = require("../models/Complaint");

async function dashboard(req, res) {
  const items = global.__campusfixMongo ? await Complaint.find() : global.__campusfixComplaints;
  const byStatus = {};
  const byCategory = {};
  let critical = 0;
  for (const c of items) {
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    if (c.priority === "Critical") critical++;
  }
  res.json({ total: items.length, critical, byStatus, byCategory, complaints: items.slice(-50).reverse() });
}
module.exports = { dashboard };
