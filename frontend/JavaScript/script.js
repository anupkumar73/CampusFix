
/* CampusFix front-end: all screens use the real API. */
const API_BASE = "/api";

function getToken(){ return localStorage.getItem("campusfix_token") || ""; }
function getUserId(){ return localStorage.getItem("campusfix_user_id") || "demo-user-1"; }
function getUser(){ try{return JSON.parse(localStorage.getItem("campusfix_user")||"{}")}catch{return{}} }
function saveSession(data){
  localStorage.setItem("campusfix_token", data.token || "");
  localStorage.setItem("campusfix_user_id", data.user?.id || "demo-user-1");
  localStorage.setItem("campusfix_user", JSON.stringify(data.user || {}));
}
function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function timeAgo(value){
  const d=new Date(value), s=Math.max(0,(Date.now()-d.getTime())/1000);
  if(s<60)return "just now"; if(s<3600)return `${Math.floor(s/60)} min ago`;
  if(s<86400)return `${Math.floor(s/3600)} hours ago`; return `${Math.floor(s/86400)} days ago`;
}
async function apiFetch(path, options={}){
  const headers=new Headers(options.headers||{});
  const token=getToken();
  if(token) headers.set("Authorization",`Bearer ${token}`);
  headers.set("x-demo-user",getUserId());
  if(!headers.has("Content-Type") && !(options.body instanceof FormData)) headers.set("Content-Type","application/json");
  const res=await fetch(`${API_BASE}${path}`,{...options,headers});
  if(res.status===401){ localStorage.removeItem("campusfix_token"); }
  return res;
}
async function jsonOrThrow(res){
  let data={}; try{data=await res.json()}catch{}
  if(!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
function go(page){ window.location.href=`/${page}`; }

document.addEventListener("DOMContentLoaded",()=>{
  // Common navigation
  document.querySelectorAll('a[href$=".html"]').forEach(a=>{
    a.addEventListener("click",e=>{
      const href=a.getAttribute("href");
      if(href && !href.startsWith("http") && !href.startsWith("#")) { e.preventDefault(); go(href.replace(/^.*\//,"")); }
    });
  });
  const notif=document.querySelector(".notification-icon");
  if(notif) notif.addEventListener("click",()=>go("notifications.html"));
  const profile=document.querySelector(".profile-info");
  if(profile) profile.addEventListener("click",()=>go("profile.html"));
  const reportBtn=document.getElementById("reportBtn");
  if(reportBtn) reportBtn.addEventListener("click",()=>go("report-problem.html"));
  const toggle=document.getElementById("sidebarToggle"), sidebar=document.querySelector(".sidebar");
  if(toggle&&sidebar) toggle.addEventListener("click",()=>sidebar.classList.toggle("collapsed"));

  // Login
  const loginForm=document.getElementById("loginForm");
  if(loginForm) loginForm.addEventListener("submit",async e=>{
    e.preventDefault();
    const email=(document.getElementById("username")?.value||"").trim();
    const password=(document.getElementById("password")?.value||"").trim();
    if(!email||!password)return alert("Please enter your login details.");
    const btn=loginForm.querySelector("button[type=submit]");
    if(btn){btn.disabled=true;btn.textContent="Signing in...";}
    try{
      const data=await jsonOrThrow(await apiFetch("/auth/login",{method:"POST",body:JSON.stringify({email,password})}));
      saveSession(data); go(data.user?.role==="admin"?"admin-dashboard.html":"dashboard.html");
    }catch(err){alert(err.message); if(btn){btn.disabled=false;btn.textContent="Login";}}
  });

  // Logout
  document.querySelectorAll('a[href="index.html"],a[href="/index.html"]').forEach(a=>{
    if((a.textContent||"").toLowerCase().includes("logout")) a.addEventListener("click",()=>{localStorage.clear()});
  });

  // Report form
  const reportForm=document.getElementById("reportForm");
  if(reportForm) setupReportForm(reportForm);

  // Smart analysis
  if(document.getElementById("confirmBtn")) setupAnalysis();

  // Duplicate screen
  if(document.getElementById("supportBtn") && document.getElementById("newIssueBtn")) setupDuplicate();

  // Dynamic screens
  if(document.querySelector(".success-card")) setupSuccess();
  if(document.querySelector(".report-item") && document.title.includes("My Reports")) loadMyReports();
  if(document.querySelector(".notif-item") && document.title.includes("Notifications")) loadNotifications();
  if(document.querySelector(".profile-card")) loadProfile();
  if(document.querySelector(".rating-card")) setupFeedback();
  if(document.querySelector(".dashboard-container")) loadDashboard();
  if(document.getElementById("detailTicket")) loadComplaintDetails();
  if(document.getElementById("adminDashboard")) loadAdminDashboard();

  // chatbot remains compatible with the original UI
  const bot=document.getElementById("campusBot"), btn=document.getElementById("campusBotBtn"), win=document.getElementById("campusBotWindow"), close=document.getElementById("closeBot");
  if(bot&&btn&&win&&close){
    btn.addEventListener("click",()=>win.style.display="block");
    close.addEventListener("click",()=>win.style.display="none");
  }
});

async function setupReportForm(form){
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const title=document.getElementById("problem-title")?.value.trim();
    const description=document.getElementById("problem-description")?.value.trim();
    const location=document.getElementById("location")?.value.trim();
    const category=document.getElementById("Category")?.value||"";
    const image=document.getElementById("image-upload")?.files?.[0];
    if(!title||!description||!location)return alert("Please complete title, description and location.");
    const button=form.querySelector("button[type=submit]");
    if(button){button.disabled=true;button.textContent="Analyzing...";}
    let latitude=null,longitude=null;
    if(navigator.geolocation){
      try{const p=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{timeout:2500}));latitude=p.coords.latitude;longitude=p.coords.longitude;}catch{}
    }
    try{
      const fd=new FormData();
      fd.append("title",title);fd.append("description",description);fd.append("location",location);fd.append("category",category);
      if(latitude!=null)fd.append("latitude",latitude);if(longitude!=null)fd.append("longitude",longitude);if(image)fd.append("image",image);
      const result=await jsonOrThrow(await apiFetch("/complaints/analyze",{method:"POST",body:fd}));
      sessionStorage.setItem("campusfix_draft",JSON.stringify({title,description,location,latitude,longitude,imageUrl:result.imageUrl||"",category}));
      sessionStorage.setItem("campusfix_analysis",JSON.stringify(result));
      go("smart-analysis.html");
    }catch(err){alert(err.message);if(button){button.disabled=false;button.textContent="Submit Report";}}
  });
}

function getDraft(){try{return JSON.parse(sessionStorage.getItem("campusfix_draft")||"{}")}catch{return{}}}
function getAnalysis(){try{return JSON.parse(sessionStorage.getItem("campusfix_analysis")||"{}")}catch{return{}}}

async function createCurrentComplaint(){
  const d=getDraft(), x=getAnalysis(), a=x.analysis||{};
  const payload={...d,category:a.category||d.category||"Other",priority:a.priority||"Medium",severityScore:a.severityScore||50,assignedDepartment:a.assignedDepartment||"General Maintenance",duplicateOf:x.duplicate?.found?x.duplicate.ticketId:null,imageUrl:x.imageUrl||d.imageUrl||""};
  const created=await jsonOrThrow(await apiFetch("/complaints",{method:"POST",body:JSON.stringify(payload)}));
  sessionStorage.setItem("campusfix_created",JSON.stringify(created));
  sessionStorage.setItem("campusfix_final_ticket",created.ticketId);
  return created;
}

function setupAnalysis(){
  const x=getAnalysis(),d=getDraft(),a=x.analysis||{};
  const cat=document.getElementById("aiCategory"),loc=document.getElementById("aiLocation"),pri=document.getElementById("aiPriority"),dep=document.getElementById("aiDepartment");
  if(cat)cat.textContent=a.category||"Other";
  if(loc)loc.textContent=d.location||"Location not provided";
  if(pri)pri.innerHTML=`<span class="dot dot-red"></span> ${escapeHtml(a.priority||"Medium")} (${a.severityScore||50}/100)`;
  if(dep)dep.innerHTML=`<i class="fa-solid fa-gear" style="font-size:11px;color:#4b5563;"></i> ${escapeHtml(a.assignedDepartment||"General Maintenance")}`;
  const btn=document.getElementById("confirmBtn");
  btn.onclick=async()=>{
    btn.disabled=true;btn.textContent="Submitting...";
    try{
      if(x.duplicate?.found){ sessionStorage.setItem("campusfix_pending_new","true"); go("duplicat-detection.html"); }
      else { await createCurrentComplaint(); go("success.html"); }
    }catch(err){alert(err.message);btn.disabled=false;btn.textContent="Confirm & Submit";}
  };
}

function setupDuplicate(){
  const x=getAnalysis(), dup=x.duplicate||{};
  if(dup.ticketId){
    document.getElementById("dupTicket").textContent=`Existing Issue: ${dup.ticketId}`;
    document.getElementById("dupDescription").textContent=dup.description||"Similar issue";
    document.getElementById("dupCount").textContent=`${dup.supportCount||0} students`;
    document.getElementById("dupStatus").innerHTML=`<span class="dot dot-yellow"></span> ${escapeHtml(dup.status||"Reported")}`;
    const msg=document.getElementById("dupMessage"); if(msg)msg.textContent=`A similar problem has already been reported (${dup.score||0}% match).`;
  }
  document.getElementById("supportBtn").onclick=async()=>{
    const b=document.getElementById("supportBtn");b.disabled=true;b.textContent="Supporting...";
    try{
      await jsonOrThrow(await apiFetch(`/complaints/${encodeURIComponent(dup.ticketId)}/support`,{method:"POST"}));
      sessionStorage.setItem("campusfix_final_ticket",dup.ticketId);go("success.html");
    }catch(err){alert(err.message);b.disabled=false;b.textContent="Support Existing Issue";}
  };
  document.getElementById("newIssueBtn").onclick=async()=>{
    const b=document.getElementById("newIssueBtn");b.disabled=true;b.textContent="Creating...";
    try{const c=await createCurrentComplaint();go("success.html");}catch(err){alert(err.message);b.disabled=false;b.textContent="Submit as New Issue";}
  };
}

function setupSuccess(){
  const c=getCreated();
  const id=document.querySelector(".id-number"); if(id)id.textContent=c.ticketId||sessionStorage.getItem("campusfix_final_ticket")||"—";
  const department=document.querySelector(".success-card .field-value"); if(department)department.textContent=c.assignedDepartment||"General Maintenance";
  const p=document.querySelector(".success-card .subtitle strong"); if(p)p.textContent=c.priority||"Medium";
  const expected=document.querySelectorAll(".success-card .subtitle strong")[1]; if(expected){
    const due=c.escalationDueAt?new Date(c.escalationDueAt):null;
    expected.textContent=due?`Before ${due.toLocaleString()}`:"According to priority SLA";
  }
  const track=document.getElementById("trackBtn"); if(track)track.onclick=()=>{if(c.ticketId)go(`complaint-details.html?ticketId=${encodeURIComponent(c.ticketId)}`);else go("my-reports.html");};
}
function getCreated(){try{return JSON.parse(sessionStorage.getItem("campusfix_created")||"{}")}catch{return{}}}

async function loadDashboard(){
  const user=getUser();
  const name=document.querySelector(".welcome-text h1");if(name)name.textContent=`Good ${new Date().getHours()<12?"Morning":new Date().getHours()<17?"Afternoon":"Evening"}, ${user.name||"Student"} 👋`;
  const profileName=document.querySelector(".profile-name");if(profileName)profileName.textContent=user.name||"Student";
  try{
    const items=await jsonOrThrow(await apiFetch("/complaints/mine"));
    const counts={total:items.length,pending:0,progress:0,resolved:0};
    items.forEach(c=>{if(["Reported","Verified","Assigned"].includes(c.status))counts.pending++;if(c.status==="In Progress")counts.progress++;if(c.status==="Resolved")counts.resolved++;});
    const vals=document.querySelectorAll(".stats-cards .stat-value"); if(vals.length>=4){vals[0].textContent=String(counts.total).padStart(2,"0");vals[1].textContent=String(counts.pending).padStart(2,"0");vals[2].textContent=String(counts.progress).padStart(2,"0");vals[3].textContent=String(counts.resolved).padStart(2,"0");}
    const list=document.querySelector(".reports-list"); if(list){
      list.innerHTML=items.slice(0,3).map(c=>`<div class="report-item" data-ticket="${escapeHtml(c.ticketId)}"><div class="report-info"><div class="report-id">${escapeHtml(c.ticketId)}</div><div class="report-desc">${escapeHtml(c.title)}</div><div class="report-loc">${escapeHtml(c.location)}</div></div><div class="report-meta"><div class="meta-group"><span class="meta-label">Priority</span><span class="status-badge">${escapeHtml(c.priority)}</span></div><div class="meta-group"><span class="meta-label">Status</span><span class="status-badge">${escapeHtml(c.status)}</span></div></div></div>`).join("") || `<div class="report-item">No reports yet. Create your first report.</div>`;
      list.querySelectorAll("[data-ticket]").forEach(x=>x.onclick=()=>go(`complaint-details.html?ticketId=${encodeURIComponent(x.dataset.ticket)}`));
    }
    const update=document.querySelector(".update-text"); if(update)update.textContent=items[0]?`${items[0].ticketId} is ${items[0].status} and assigned to ${items[0].assignedDepartment}.`:"No active complaints yet.";
    const link=document.querySelector(".update-link");if(link&&items[0]){link.href=`complaint-details.html?ticketId=${encodeURIComponent(items[0].ticketId)}`;link.onclick=e=>{e.preventDefault();go(link.getAttribute("href"));}}
  }catch(err){console.error(err)}
}

async function loadMyReports(){
  try{
    const items=await jsonOrThrow(await apiFetch("/complaints/mine"));
    const card=document.querySelector(".card"), tabs=card?.querySelector(".tabs");
    if(!card)return;
    const render=(filter="All")=>{
      card.querySelectorAll(".report-item").forEach(e=>e.remove());
      const matches=items.filter(c=>filter==="All"||(filter==="Pending"?["Reported","Verified","Assigned"].includes(c.status):filter===c.status));
      const anchor=card.querySelector(".tabs");
      matches.forEach(c=>{
        const div=document.createElement("div");div.className="report-item dynamic-report";div.dataset.ticket=c.ticketId;
        div.innerHTML=`<div class="report-info"><h4>${escapeHtml(c.ticketId)}</h4><p>${escapeHtml(c.title)}</p><span>${escapeHtml(c.location)}</span></div><div class="report-tags"><span class="tag-status">${escapeHtml(c.priority)}</span><span class="tag-status">${escapeHtml(c.status)} <i class="fa-solid fa-chevron-right chevron"></i></span></div>`;
        anchor.after(div);div.onclick=()=>go(`complaint-details.html?ticketId=${encodeURIComponent(c.ticketId)}`);
      });
    };
    if(tabs){tabs.querySelectorAll(".tab").forEach((t,i)=>t.onclick=()=>{tabs.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");render(["All","Pending","In Progress","Resolved"][i]||"All");});}
    render();
  }catch(err){console.error(err)}
}

async function loadNotifications(){
  try{
    const items=await jsonOrThrow(await apiFetch("/notifications"));
    const card=document.querySelector(".card");
    if(!card)return;
    card.querySelectorAll(".notif-item").forEach(e=>e.remove());
    const anchor=card.querySelector(".view-all");
    items.forEach(n=>{
      const div=document.createElement("div");div.className="notif-item dynamic-notif";div.innerHTML=`<div class="notif-icon icon-green"><i class="fa-solid fa-bell"></i></div><div class="notif-text"><p><strong>${escapeHtml(n.title)}</strong><br>${escapeHtml(n.message)}</p><span>${timeAgo(n.createdAt)}</span></div><i class="fa-solid fa-chevron-right chevron"></i>`;
      anchor.before(div);
      div.onclick=async()=>{if(!n.read)try{await apiFetch(`/notifications/${n._id}/read`,{method:"PATCH"})}catch{}};
    });
  }catch(err){console.error(err)}
}

async function loadProfile(){
  const user=getUser();
  const name=document.querySelector(".user-main h3"),email=document.querySelector(".info-value:last-child"),id=document.querySelector(".user-id");
  if(name)name.textContent=user.name||"Student";if(email)email.textContent=user.email||"";
  if(id)id.textContent=user.id||"";
  try{
    const items=await jsonOrThrow(await apiFetch("/complaints/mine"));
    const stats=document.querySelectorAll(".stat-value");
    if(stats.length>=3){stats[0].textContent=items.length;stats[1].textContent=items.reduce((n,c)=>n+(c.supportCount||0),0);stats[2].textContent=items.filter(c=>c.status==="Resolved").length;}
  }catch{}
  const edit=document.getElementById("editProfileBtn");if(edit)edit.onclick=()=>alert("Profile editing is available in the next account settings release.");
  const pass=document.getElementById("changePasswordBtn");if(pass)pass.onclick=()=>alert("Password changes require a registered MongoDB account. Demo accounts use the demo login.");
}

function setupFeedback(){
  let rating=0;
  const stars=[...document.querySelectorAll(".star")];
  stars.forEach((s,i)=>s.onclick=()=>{rating=i+1;stars.forEach((x,j)=>x.style.opacity=j<=i?"1":"0.35");});
  document.getElementById("fixedBtn")?.addEventListener("click",()=>submitFeedback(true,rating));
  document.getElementById("notFixedBtn")?.addEventListener("click",()=>submitFeedback(false,rating));
}
async function submitFeedback(resolved,rating){
  if(!rating)return alert("Please select a rating first.");
  const ticket=sessionStorage.getItem("campusfix_final_ticket")||getCreated().ticketId||null;
  try{await jsonOrThrow(await apiFetch("/feedback",{method:"POST",body:JSON.stringify({complaintId:ticket,rating,resolved})}));alert("Thank you for your feedback!");go("my-reports.html");}catch(err){alert(err.message)}
}

async function loadComplaintDetails(){
  const ticket=new URLSearchParams(location.search).get("ticketId")||sessionStorage.getItem("campusfix_final_ticket");
  if(!ticket)return;
  try{
    const c=await jsonOrThrow(await apiFetch(`/complaints/${encodeURIComponent(ticket)}`));
    document.getElementById("detailTicket").textContent=c.ticketId;
    document.getElementById("detailTitle").textContent=c.title;
    document.getElementById("detailLocation").textContent=c.location;
    document.getElementById("detailDepartment").textContent=c.assignedDepartment;
    document.getElementById("detailPriority").textContent=c.priority;
    document.getElementById("detailStatus").textContent=c.status;
    const tl=document.getElementById("detailTimeline");
    if(tl)tl.innerHTML=(c.timeline||[]).map(x=>`<div class="timeline-row"><div class="timeline-dot"></div><div><strong>${escapeHtml(x.status)}</strong><div>${escapeHtml(x.note||"")}</div><small>${x.at?new Date(x.at).toLocaleString():""}</small></div></div>`).join("");
    const verify=document.getElementById("verifyBtn");if(verify){verify.disabled=c.status!=="Resolved"||c.studentVerified;verify.textContent=c.studentVerified?"Resolution Verified":c.status==="Resolved"?"Verify Resolution":"Waiting for Resolution";verify.onclick=async()=>{try{await jsonOrThrow(await apiFetch(`/complaints/${encodeURIComponent(ticket)}/verify`,{method:"POST"}));loadComplaintDetails()}catch(e){alert(e.message)}}}
  }catch(err){alert(err.message);go("my-reports.html")}
}

async function loadAdminDashboard(){
  try{
    const d=await jsonOrThrow(await apiFetch("/admin/dashboard"));
    const total=document.getElementById("adminTotal"),critical=document.getElementById("adminCritical");if(total)total.textContent=d.total;if(critical)critical.textContent=d.critical;
    const list=document.getElementById("adminComplaintList");if(!list)return;
    list.innerHTML=d.complaints.map(c=>`<tr><td>${escapeHtml(c.ticketId)}</td><td>${escapeHtml(c.title)}</td><td>${escapeHtml(c.assignedDepartment)}</td><td><select data-status="${escapeHtml(c.ticketId)}"><option ${c.status==="Reported"?"selected":""}>Reported</option><option ${c.status==="Assigned"?"selected":""}>Assigned</option><option ${c.status==="In Progress"?"selected":""}>In Progress</option><option ${c.status==="Resolved"?"selected":""}>Resolved</option><option ${c.status==="Reopened"?"selected":""}>Reopened</option></select></td><td><button data-save="${escapeHtml(c.ticketId)}">Update</button></td></tr>`).join("")||`<tr><td colspan="5">No complaints yet.</td></tr>`;
    list.querySelectorAll("[data-save]").forEach(b=>b.onclick=async()=>{const t=b.dataset.save,s=list.querySelector(`[data-status="${CSS.escape(t)}"]`);try{await jsonOrThrow(await apiFetch(`/complaints/${encodeURIComponent(t)}/status`,{method:"PATCH",body:JSON.stringify({status:s.value,note:"Updated by admin"})}));loadAdminDashboard()}catch(e){alert(e.message)}});
  }catch(err){alert("Admin access required. Login with admin@campusfix.com")}
}
