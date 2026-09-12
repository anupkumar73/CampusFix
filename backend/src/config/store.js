
const fs = require("fs");
const path = require("path");
const dataDir = path.join(__dirname, "..", "..", "data");
const dataFile = path.join(dataDir, "store.json");
const now = Date.now();
const initial = {
  users: [
    { id:"demo-user-1", name:"Anup Kumar", email:"anup@college.edu", role:"student", password:"" },
    { id:"demo-admin-1", name:"CampusFix Admin", email:"admin@campusfix.com", role:"admin", password:"admin123" }
  ],
  complaints: [
    { _id:"seed109",ticketId:"CF109",reporterId:"demo-user-1",reporterName:"Anup Kumar",title:"Electrical Problem in CSE Lab 2",description:"Ceiling fan is not working and it is very hot in the lab.",category:"Electrical",location:"Academic Block, 2nd Floor, CSE Lab 2",priority:"Critical",severityScore:95,assignedDepartment:"Electrical Maintenance",status:"In Progress",supportCount:7,studentVerified:false,escalationLevel:0,createdAt:new Date(now-2*3600000).toISOString(),updatedAt:new Date(now-20*60000).toISOString(),timeline:[
      {status:"Reported",note:"Complaint submitted",by:"demo-user-1",at:new Date(now-2*3600000).toISOString()},
      {status:"Smart Analysis",note:"Electrical / Critical detected",by:"system",at:new Date(now-115*60000).toISOString()},
      {status:"Assigned",note:"Assigned to Electrical Maintenance",by:"demo-admin-1",at:new Date(now-100*60000).toISOString()},
      {status:"In Progress",note:"Technician assigned",by:"demo-admin-1",at:new Date(now-20*60000).toISOString()}
    ]},
    { _id:"seed102",ticketId:"CF102",reporterId:"demo-user-1",reporterName:"Anup Kumar",title:"Wi-Fi not working",description:"Wi-Fi connectivity is unavailable in CSE Lab 2.",category:"Wi-Fi / Network",location:"Academic Block, 2nd Floor, CSE Lab 2",priority:"High",severityScore:78,assignedDepartment:"IT & Network",status:"Resolved",supportCount:5,studentVerified:false,createdAt:new Date(now-5*3600000).toISOString(),updatedAt:new Date(now-2*3600000).toISOString(),timeline:[
      {status:"Reported",note:"Complaint submitted",by:"demo-user-1",at:new Date(now-5*3600000).toISOString()},
      {status:"Assigned",note:"Assigned to IT & Network",by:"demo-admin-1",at:new Date(now-4*3600000).toISOString()},
      {status:"Resolved",note:"Network restored",by:"demo-admin-1",at:new Date(now-2*3600000).toISOString()}
    ]},
    { _id:"seed098",ticketId:"CF098",reporterId:"demo-user-1",reporterName:"Anup Kumar",title:"Broken Classroom Fan",description:"Fan in Room 204 is not working.",category:"Electrical",location:"Room 204",priority:"Medium",severityScore:75,assignedDepartment:"Electrical Maintenance",status:"Resolved",supportCount:3,studentVerified:true,createdAt:new Date(now-86400000).toISOString(),updatedAt:new Date(now-12*3600000).toISOString(),timeline:[
      {status:"Reported",note:"Complaint submitted",by:"demo-user-1",at:new Date(now-86400000).toISOString()},
      {status:"Resolved",note:"Fan replaced",by:"demo-admin-1",at:new Date(now-12*3600000).toISOString()}
    ]}
    ,{ _id:"seed097",ticketId:"CF097",reporterId:"demo-user-1",reporterName:"Anup Kumar",title:"Water leakage near washroom",description:"Water is leaking near the washroom entrance.",category:"Water / Plumbing",location:"Academic Block, Ground Floor",priority:"High",severityScore:78,assignedDepartment:"Plumbing & Water",status:"Assigned",supportCount:2,studentVerified:false,createdAt:new Date(now-7*3600000).toISOString(),updatedAt:new Date(now-4*3600000).toISOString(),timeline:[{status:"Reported",note:"Complaint submitted",by:"demo-user-1",at:new Date(now-7*3600000).toISOString()},{status:"Assigned",note:"Assigned to Plumbing & Water",by:"demo-admin-1",at:new Date(now-4*3600000).toISOString()}]}
    ,{ _id:"seed095",ticketId:"CF095",reporterId:"demo-user-1",reporterName:"Anup Kumar",title:"Garbage bin overflowing",description:"The waste bin near the cafeteria is overflowing.",category:"Cleanliness",location:"Main Cafeteria",priority:"Medium",severityScore:48,assignedDepartment:"Housekeeping",status:"Reported",supportCount:1,studentVerified:false,createdAt:new Date(now-10*3600000).toISOString(),updatedAt:new Date(now-10*3600000).toISOString(),timeline:[{status:"Reported",note:"Complaint submitted",by:"demo-user-1",at:new Date(now-10*3600000).toISOString()}]}
  ],
  notifications:[
    {_id:"seedn1",userId:"demo-user-1",title:"Complaint assigned",message:"Your issue CF109 has been assigned to Electrical Maintenance.",complaintId:"CF109",read:false,createdAt:new Date(now-5*60000).toISOString()},
    {_id:"seedn2",userId:"demo-user-1",title:"Issue resolved",message:"Your issue CF102 has been resolved.",complaintId:"CF102",read:false,createdAt:new Date(now-2*3600000).toISOString()},
    {_id:"seedn3",userId:"demo-user-1",title:"Verify resolution",message:"Please verify the resolution for issue CF102.",complaintId:"CF102",read:false,createdAt:new Date(now-2*3600000).toISOString()}
  ],
  feedback:[]
};
function ensure(){if(!fs.existsSync(dataDir))fs.mkdirSync(dataDir,{recursive:true});if(!fs.existsSync(dataFile))fs.writeFileSync(dataFile,JSON.stringify(initial,null,2));}
function load(){ensure();try{return JSON.parse(fs.readFileSync(dataFile,"utf8"));}catch{fs.writeFileSync(dataFile,JSON.stringify(initial,null,2));return JSON.parse(JSON.stringify(initial));}}
function save(data){ensure();fs.writeFileSync(dataFile,JSON.stringify(data,null,2));return data;}
module.exports={load,save,dataFile};
