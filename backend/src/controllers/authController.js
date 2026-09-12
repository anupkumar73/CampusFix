
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const store = require("../config/store");

function signDemo(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );
}

async function register(req, res) {
  const { name, email, password, role = "student" } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

  if (!global.__campusfixMongo) {
    const data = store.load();
    if (data.users.some(u => u.email.toLowerCase() === email.toLowerCase()))
      return res.status(409).json({ message: "Email already registered" });
    const user = { id: `u_${Date.now()}`, name, email, role: role === "admin" ? "student" : role, password };
    data.users.push(user);
    store.save(data);
    const safe = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.status(201).json({ user: safe, token: signDemo(safe) });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role });
  const token = jwt.sign({ id: user._id.toString(), name, email, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.status(201).json({ user: { id: user._id, name, email, role: user.role }, token });
}

async function login(req, res) {
  const { email = "", password = "" } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  if (!global.__campusfixMongo) {
    const data = store.load();
    let user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    // Demo accounts make the supplied UI immediately usable.
    if (!user && email.toLowerCase() !== "admin@campusfix.com") {
      user = { id: "demo-user-1", name: email.split("@")[0] || "Student", email, role: "student", password };
      data.users.push(user);
      store.save(data);
    } else if (!user && email.toLowerCase() === "admin@campusfix.com") {
      user = { id: "demo-admin-1", name: "CampusFix Admin", email, role: "admin", password };
      data.users.push(user);
      store.save(data);
    }
    if (user.password && user.password !== password && user.id !== "demo-user-1" && user.id !== "demo-admin-1")
      return res.status(401).json({ message: "Invalid credentials" });
    const safe = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.json({ user: safe, token: signDemo(safe) });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id.toString(), name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
}
module.exports = { register, login };
