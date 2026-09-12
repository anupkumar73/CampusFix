
const CAMPUSFIX_API="/api";
async function campusfixRequest(path, options={}){
  const headers=new Headers(options.headers||{});
  const token=localStorage.getItem("campusfix_token");
  if(token)headers.set("Authorization",`Bearer ${token}`);
  headers.set("x-demo-user",localStorage.getItem("campusfix_user_id")||"demo-user-1");
  if(!headers.has("Content-Type") && !(options.body instanceof FormData))headers.set("Content-Type","application/json");
  const res=await fetch(`${CAMPUSFIX_API}${path}`,{...options,headers});
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw new Error(data.message||"Request failed");
  return data;
}
async function analyzeReport(form){
  const fd=new FormData();
  Object.entries(form||{}).forEach(([k,v])=>{if(v!==undefined&&v!==null)fd.append(k,v)});
  return campusfixRequest("/complaints/analyze",{method:"POST",body:fd});
}
async function createReport(payload){return campusfixRequest("/complaints",{method:"POST",body:JSON.stringify(payload)})}
