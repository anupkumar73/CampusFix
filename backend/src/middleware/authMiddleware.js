
const jwt = require("jsonwebtoken");
const store = require("../config/store");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const data = store.load();
    const id = req.headers["x-demo-user"] || "demo-user-1";
    const found = data.users.find(u => u.id === id);
    req.user = found
      ? { id: found.id, role: found.role, name: found.name, email: found.email }
      : { id, role: "student", name: "Anup Kumar", email: "anup@college.edu" };
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
module.exports = authMiddleware;
