const campusBot = document.getElementById("campusBot");
const campusBotBtn = document.getElementById("campusBotBtn");

const campusBotWindow =
    document.getElementById("campusBotWindow");

const closeBot =
    document.getElementById("closeBot");

let isDragging = false;
let moved = false;

let offsetX = 0;
let offsetY = 0;


/* Start dragging */
campusBotBtn.addEventListener("pointerdown", (e) => {

    isDragging = true;
    moved = false;

    const rect = campusBot.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    campusBot.style.left = rect.left + "px";
    campusBot.style.top = rect.top + "px";

    campusBotBtn.setPointerCapture(e.pointerId);
});


/* Move */
campusBotBtn.addEventListener("pointermove", (e) => {

    if (!isDragging) return;

    moved = true;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    x = Math.max(
        0,
        Math.min(x, window.innerWidth - campusBot.offsetWidth)
    );

    y = Math.max(
        0,
        Math.min(y, window.innerHeight - campusBot.offsetHeight)
    );

    campusBot.style.left = x + "px";
    campusBot.style.top = y + "px";
});


/* Stop dragging */
campusBotBtn.addEventListener("pointerup", () => {

    isDragging = false;

});


campusBotBtn.addEventListener("click", () => {
    if (!moved) {
        campusBotWindow.style.display = "block";

        // Chatbot open state save karo
        localStorage.setItem("campusBotOpen", "true");
    }
});

closeBot.addEventListener("click", () => {
    campusBotWindow.style.display = "none";

    // Sirf close button dabane par state remove karo
    localStorage.setItem("campusBotOpen", "false");
});


// Page reload hone ke baad chatbot ki previous state maintain rahe
window.addEventListener("load", () => {
    if (localStorage.getItem("campusBotOpen") === "true") {
        campusBotWindow.style.display = "block";
    }
});
