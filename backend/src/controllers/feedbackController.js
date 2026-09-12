
const Feedback = require("../models/Feedback");
const store=require("../config/store");
async function create(req,res){
  const {complaintId=null,rating=5,resolved=true,comment=""}=req.body;
  const r=Number(rating); if(!Number.isInteger(r)||r<1||r>5)return res.status(400).json({message:"Rating must be 1-5"});
  if(global.__campusfixMongo){const item=await Feedback.create({userId:req.user.id,complaintId,rating:r,resolved,comment});return res.status(201).json(item);}
  const db=store.load(); const item={_id:`f_${Date.now()}`,userId:req.user.id,complaintId,rating:r,resolved,comment,createdAt:new Date()}; db.feedback=db.feedback||[]; db.feedback.push(item); store.save(db); res.status(201).json(item);
}
module.exports={create};
