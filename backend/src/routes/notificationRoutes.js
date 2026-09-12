const router=require("express").Router();
const auth=require("../middleware/authMiddleware");
const c=require("../controllers/notificationController");
router.get("/",auth,c.list);
router.patch("/:id/read",auth,c.markRead);
module.exports=router;
