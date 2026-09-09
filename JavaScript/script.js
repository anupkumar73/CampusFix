/* CampusFix - Single JavaScript file */

document.addEventListener("DOMContentLoaded", () => {
  // CampusFix chatbot (only on pages where it exists)
  const campusBot = document.getElementById("campusBot");
  const campusBotBtn = document.getElementById("campusBotBtn");
  const campusBotWindow = document.getElementById("campusBotWindow");
  const closeBot = document.getElementById("closeBot");
  if (campusBot && campusBotBtn && campusBotWindow && closeBot) {
    let isDragging = false,
      moved = false,
      offsetX = 0,
      offsetY = 0;
    campusBotBtn.addEventListener("pointerdown", (e) => {
      isDragging = true;
      moved = false;
      const rect = campusBot.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      campusBot.style.left = rect.left + "px";
      campusBot.style.top = rect.top + "px";
      campusBot.style.right = "auto";
      campusBot.style.bottom = "auto";
      campusBotBtn.setPointerCapture(e.pointerId);
    });
    campusBotBtn.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      moved = true;
      let x = e.clientX - offsetX,
        y = e.clientY - offsetY;
      x = Math.max(0, Math.min(x, window.innerWidth - campusBot.offsetWidth));
      y = Math.max(0, Math.min(y, window.innerHeight - campusBot.offsetHeight));
      campusBot.style.left = x + "px";
      campusBot.style.top = y + "px";
    });
    campusBotBtn.addEventListener("pointerup", () => (isDragging = false));
    campusBotBtn.addEventListener("click", () => {
      if (!moved) campusBotWindow.style.display = "block";
    });
    closeBot.addEventListener(
      "click",
      () => (campusBotWindow.style.display = "none"),
    );
  }

// Login (Testing Mode - Accepts any Username & Password)
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Please enter your login details.");
            return;
        }

        // Testing: Koi bhi ID/Password par direct redirect ho jayega
        alert("Login Successful! (Testing Mode)");
        window.location.href = "dashboard.html";
    });
}

// Sidebar Toggle (In / Out Logic)
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.querySelector(".sidebar");

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
}

const reportBtn = document.getElementById("reportBtn");

if (reportBtn) {
    reportBtn.addEventListener("click", () => {
        window.location.href = "./report-problem.html";
    });
}

// Profile and Notification Redirection Logic
document.addEventListener("DOMContentLoaded", () => {

  // Notification Icon Click Redirection
  const notifIcon = document.getElementById("notifIcon");
  if (notifIcon) {
    notifIcon.addEventListener("click", () => {
      window.location.href = "notifications.html";
    });
  }

  // Profile Click Redirection
  const profileLink = document.getElementById("profileLink");
  if (profileLink) {
    profileLink.addEventListener("click", (e) => {
      window.location.href = "profile.html";
    });
  }

});

  // Report form -> Smart Analysis
  const reportForm = document.querySelector(
    'form[action="smart-analysis.html"], #reportForm',
  );
  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "smart-analysis.html";
    });
  }

  // Smart Analysis -> Duplicate Detection
  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn)
    confirmBtn.addEventListener(
      "click",
      () => (window.location.href = "duplicat-detection.html"),
    );

  // Duplicate Detection -> Success
  const supportBtn = document.getElementById("supportBtn");
  const newIssueBtn = document.getElementById("newIssueBtn");
  if (supportBtn)
    supportBtn.addEventListener(
      "click",
      () => (window.location.href = "success.html"),
    );
  if (newIssueBtn)
    newIssueBtn.addEventListener(
      "click",
      () => (window.location.href = "success.html"),
    );

  // Success -> My Reports
  const trackBtn = document.getElementById("trackBtn");
  if (trackBtn)
    trackBtn.addEventListener(
      "click",
      () => (window.location.href = "my-reports.html"),
    );

  // My Reports tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    }),
  );

  // Notifications
  document.querySelectorAll(".notif-item").forEach((item) => {
    item.addEventListener("click", () =>
      alert("Opening notification details..."),
    );
  });

  // Feedback
  const stars = document.querySelectorAll(".star");
  stars.forEach((star, index) =>
    star.addEventListener("click", () => {
      stars.forEach(
        (s, i) => (s.style.color = i <= index ? "#fbbf24" : "#d1d5db"),
      );
    }),
  );
  const fixedBtn = document.getElementById("fixedBtn");
  const notFixedBtn = document.getElementById("notFixedBtn");
  if (fixedBtn)
    fixedBtn.addEventListener("click", () =>
      alert("Thank you for your feedback!"),
    );
  if (notFixedBtn)
    notFixedBtn.addEventListener("click", () =>
      alert("We will re-open the issue."),
    );

  // Profile
  const editProfileBtn = document.getElementById("editProfileBtn");
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  if (editProfileBtn)
    editProfileBtn.addEventListener("click", () =>
      alert("Opening Edit Profile screen..."),
    );
  if (changePasswordBtn)
    changePasswordBtn.addEventListener("click", () =>
      alert("Opening Change Password screen..."),
    );
});
