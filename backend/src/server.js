
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

global.__campusfixMongo = false;
global.__campusfixDemo = process.env.DEMO_MODE !== "false";
global.__campusfixComplaints = [];
global.__campusfixNotifications = [];
global.__campusfixUsers = [];
global.__campusfixFeedback = [];

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const projectRoot = path.join(__dirname, "..", "..");
const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use("/uploads", express.static(uploadsDir));
app.use(express.static(projectRoot));

// The design stores pages inside HTML/, while navigation uses /page.html.
app.get("/:page.html", (req, res, next) => {
  const safePage = path.basename(req.params.page);
  const filePath = path.join(projectRoot, "HTML", `${safePage}.html`);
  if (!fs.existsSync(filePath)) return next();
  res.sendFile(filePath);
});

app.get("/api/health", (_, res) => res.json({
  ok: true,
  service: "CampusFix API",
  mode: global.__campusfixMongo ? "mongodb" : "demo-memory-persistent"
}));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));

app.get("/", (_, res) => res.sendFile(path.join(projectRoot, "HTML", "index.html")));

io.on("connection", socket => {
  console.log("Realtime client connected:", socket.id);
  socket.on("join:user", userId => socket.join(`user:${userId}`));
});

app.use((req, res) => res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

async function start() {
  global.__campusfixMongo = await connectDB();
  const port = Number(process.env.PORT || 5000);
  server.listen(port, () => console.log(`CampusFix running at http://localhost:${port}`));
}
start().catch(err => { console.error(err); process.exit(1); });
