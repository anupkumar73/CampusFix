
const Complaint = require("../models/Complaint");
const { analyze } = require("../services/aiService");
const { findDuplicate } = require("../services/duplicateService");
const { getSlaHours } = require("../services/severityService");
const generateTicketId = require("../utils/generateTicketId");
const { createNotification } = require("../services/notificationService");
const store = require("../config/store");

function demoData() { return store.load(); }
function saveDemo(data) {
  global.__campusfixComplaints = data.complaints;
  global.__campusfixNotifications = data.notifications;
  return store.save(data);
}
function allComplaints() {
  return global.__campusfixMongo ? [] : demoData().complaints;
}
function publicComplaint(c) { return c; }

async function analyzeComplaint(req, res) {
  const { title, description, location, latitude, longitude } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Title and description are required" });
  const ai = await analyze({ title, description, imagePath: req.file?.path });
  const candidate = { title, description, location, category: ai.category };
  const existing = await findDuplicate(allComplaints(), candidate);
  res.json({
    analysis: ai,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    duplicate: existing ? {
      found: true,
      score: Math.round(existing.score * 100),
      ticketId: existing.complaint.ticketId,
      description: existing.complaint.title,
      supportCount: existing.complaint.supportCount || 0,
      status: existing.complaint.status
    } : { found: false }
  });
}

async function createComplaint(req, res) {
  const { title, description, location, latitude, longitude, category, priority, severityScore, assignedDepartment, duplicateOf, imageUrl } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Title and description are required" });

  const ticketId = generateTicketId();
  const slaHours = getSlaHours(priority || "Medium");
  const due = new Date(Date.now() + slaHours * 3600 * 1000);
  const data = {
    ticketId, reporterId: req.user.id, reporterName: req.user.name || "Student",
    title, description, location: location || "Unknown", latitude, longitude,
    imageUrl: imageUrl || "", category: category || "Other", priority: priority || "Medium",
    severityScore: Number(severityScore) || 50,
    assignedDepartment: assignedDepartment || "General Maintenance",
    duplicateOf: duplicateOf || null, escalationDueAt: due,
    status: "Reported",
    timeline: [{ status: "Reported", note: "Complaint submitted", by: req.user.id, at: new Date() }]
  };

  if (global.__campusfixMongo) {
    const complaint = await Complaint.create(data);
    await createNotification({ userId: req.user.id, title: "Report submitted", message: `${ticketId} has been created.`, complaintId: ticketId });
    req.app.get("io").emit("complaint:created", complaint);
    return res.status(201).json(complaint);
  }

  const db = demoData();
  const complaint = { _id: `c_${Date.now()}`, createdAt: new Date(), updatedAt: new Date(), supportCount: 0, ...data };
  db.complaints.push(complaint);
  db.notifications.push({
    _id: `n_${Date.now()}_${Math.random().toString(16).slice(2)}`, userId: req.user.id,
    title: "Report submitted", message: `${ticketId} has been created and assigned to ${data.assignedDepartment}.`,
    complaintId: ticketId, read: false, createdAt: new Date()
  });
  saveDemo(db);
  req.app.get("io").emit("complaint:created", complaint);
  res.status(201).json(complaint);
}

async function mine(req, res) {
  if (global.__campusfixMongo) return res.json(await Complaint.find({ reporterId: req.user.id }).sort({ createdAt: -1 }));
  res.json(allComplaints().filter(c => c.reporterId === req.user.id).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)));
}

async function getOne(req, res) {
  const item = global.__campusfixMongo
    ? await Complaint.findOne({ ticketId: req.params.ticketId })
    : allComplaints().find(c => c.ticketId === req.params.ticketId);
  if (!item) return res.status(404).json({ message: "Complaint not found" });
  if (req.user.role !== "admin" && item.reporterId !== req.user.id) return res.status(403).json({ message: "Access denied" });
  res.json(publicComplaint(item));
}

async function updateStatus(req, res) {
  const { status, note = "" } = req.body;
  const allowed = ["Reported","Verified","Assigned","In Progress","Resolved","Reopened"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
  const item = global.__campusfixMongo
    ? await Complaint.findOne({ ticketId: req.params.ticketId })
    : allComplaints().find(c => c.ticketId === req.params.ticketId);
  if (!item) return res.status(404).json({ message: "Complaint not found" });
  item.status = status;
  item.timeline = item.timeline || [];
  item.timeline.push({ status, note, by: req.user.id, at: new Date() });
  if (global.__campusfixMongo) await item.save();
  else { const db = demoData(); const i = db.complaints.findIndex(c => c.ticketId === item.ticketId); db.complaints[i] = item; db.notifications.push({ _id:`n_${Date.now()}`,userId:item.reporterId,title:"Complaint updated",message:`${item.ticketId}: ${status}`,complaintId:item.ticketId,read:false,createdAt:new Date()}); saveDemo(db); }
  req.app.get("io").emit("complaint:updated", item);
  res.json(item);
}

async function assign(req, res) {
  const { department, assignedTo = "" } = req.body;
  const item = global.__campusfixMongo ? await Complaint.findOne({ ticketId: req.params.ticketId }) : allComplaints().find(c => c.ticketId === req.params.ticketId);
  if (!item) return res.status(404).json({ message: "Complaint not found" });
  item.assignedDepartment = department || item.assignedDepartment;
  item.assignedTo = assignedTo;
  item.status = "Assigned";
  item.timeline = item.timeline || [];
  item.timeline.push({ status: "Assigned", note: `Assigned to ${item.assignedDepartment}`, by: req.user.id, at: new Date() });
  if (global.__campusfixMongo) await item.save();
  else { const db=demoData(); const i=db.complaints.findIndex(c=>c.ticketId===item.ticketId); db.complaints[i]=item; db.notifications.push({_id:`n_${Date.now()}`,userId:item.reporterId,title:"Complaint assigned",message:`${item.ticketId} assigned to ${item.assignedDepartment}.`,complaintId:item.ticketId,read:false,createdAt:new Date()}); saveDemo(db); }
  req.app.get("io").emit("complaint:updated", item);
  res.json(item);
}

async function support(req, res) {
  const item = global.__campusfixMongo ? await Complaint.findOne({ ticketId: req.params.ticketId }) : allComplaints().find(c => c.ticketId === req.params.ticketId);
  if (!item) return res.status(404).json({ message: "Complaint not found" });
  item.supportCount = (item.supportCount || 0) + 1;
  if (global.__campusfixMongo) await item.save();
  else { const db=demoData(); const i=db.complaints.findIndex(c=>c.ticketId===item.ticketId); db.complaints[i]=item; saveDemo(db); }
  res.json({ ticketId: item.ticketId, supportCount: item.supportCount });
}

async function verify(req, res) {
  const item = global.__campusfixMongo ? await Complaint.findOne({ ticketId: req.params.ticketId }) : allComplaints().find(c => c.ticketId === req.params.ticketId);
  if (!item) return res.status(404).json({ message: "Complaint not found" });
  if (item.reporterId !== req.user.id) return res.status(403).json({ message: "Only the reporter can verify this complaint" });
  item.studentVerified = true;
  item.status = "Resolved";
  item.timeline = item.timeline || [];
  item.timeline.push({ status: "Resolved", note: "Student verified resolution", by: req.user.id, at: new Date() });
  if (global.__campusfixMongo) await item.save();
  else { const db=demoData(); const i=db.complaints.findIndex(c=>c.ticketId===item.ticketId); db.complaints[i]=item; db.notifications.push({_id:`n_${Date.now()}`,userId:item.reporterId,title:"Resolution verified",message:`${item.ticketId} has been verified as resolved.`,complaintId:item.ticketId,read:false,createdAt:new Date()}); saveDemo(db); }
  req.app.get("io").emit("complaint:updated", item);
  res.json(item);
}

module.exports = { analyzeComplaint, createComplaint, mine, getOne, updateStatus, assign, support, verify };
