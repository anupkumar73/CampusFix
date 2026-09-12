
const Notification = require("../models/Notification");
const store = require("../config/store");
async function list(req, res) {
  if (global.__campusfixMongo) return res.json(await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50));
  const db=store.load();
  res.json(db.notifications.filter(n=>n.userId===req.user.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
}
async function markRead(req,res){
  if(global.__campusfixMongo){const n=await Notification.findById(req.params.id); if(!n)return res.status(404).json({message:"Notification not found"}); n.read=true; await n.save(); return res.json(n);}
  const db=store.load(); const n=db.notifications.find(x=>x._id===req.params.id && x.userId===req.user.id); if(!n)return res.status(404).json({message:"Notification not found"}); n.read=true; store.save(db); res.json(n);
}
module.exports={list,markRead};
