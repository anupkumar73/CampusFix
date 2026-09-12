const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const c = require("../controllers/adminController");
router.get("/dashboard", auth, admin, c.dashboard);
module.exports = router;
