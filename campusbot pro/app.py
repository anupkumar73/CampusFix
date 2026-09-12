import streamlit as ui
import sqlite3
import datetime
from difflib import get_close_matches

# Page configuration
ui.set_page_config(page_title="CampusBot Pro - BRCM CET", page_icon="🎓", layout="centered")

# Custom UI Styling (Modern Gradients, Glowing Headers & Sleek Bubbles)
ui.markdown("""
    <style>
    /* Main Background and Fonts */
    .main-header { 
        font-size: 2.5rem; 
        background: linear-gradient(90deg, #3B82F6, #1E40AF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800; 
        text-align: center; 
        margin-bottom: 2px; 
    }
    .sub-header { 
        font-size: 1.05rem; 
        color: #9CA3AF; 
        text-align: center; 
        margin-bottom: 20px; 
        font-weight: 400;
    }
    
    /* Sleek Chat Bubbles */
    .stChatMessage {
        border-radius: 15px;
        padding: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin-bottom: 10px;
    }
    </style>
""", unsafe_allow_html=True)

# Header Section
ui.markdown('<div class="main-header">🎓 CampusBot Pro</div>', unsafe_allow_html=True)
ui.markdown('<div class="sub-header">Official AI Assistant for BRCM College of Engineering & Technology</div>', unsafe_allow_html=True)

# ----------------------------------------------------
# SIDEBAR CONFIGURATION
# ----------------------------------------------------
with ui.sidebar:
    ui.markdown("### 🛠️ **Quick Navigation**")
    ui.write("Click any category below for instant answers:")
    
    if ui.button("🎓 Fee Structure", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Show fee structure"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_FEE__"})
        ui.rerun()
        
    if ui.button("🏢 Hostel & Wardens", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Hostel details"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_HOSTEL_OPTIONS__"})
        ui.rerun()

    if ui.button("🚌 Bus Routes & Timings", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Bus routes"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_BUS__"})
        ui.rerun()

    if ui.button("🍔 Canteen Menu", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Canteen menu"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_CANTEEN__"})
        ui.rerun()

    if ui.button("📋 Student Rules", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Student rules"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_RULES__"})
        ui.rerun()

    ui.markdown("---")
    ui.markdown("### 🚨 **Emergency Helpdesk**")
    ui.info("📞 **Admission Helpline:**\n+91-80599-00247")

# ----------------------------------------------------
# DATABASE SETUP (SQLite)
# ----------------------------------------------------
def init_db():
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            query TEXT,
            matched_intent TEXT
        )
    """)
    conn.commit()
    conn.close()

def log_inquiry(query, intent):
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("INSERT INTO inquiries (timestamp, query, matched_intent) VALUES (?, ?, ?)", (timestamp, query, intent))
    conn.commit()
    conn.close()

init_db()

# ----------------------------------------------------
# INDIVIDUAL SERVICE RENDER FUNCTIONS
# ----------------------------------------------------
def render_fee_structure():
    ui.markdown("### 🎓 **B.Tech / M.Tech Fee Structure**")
    col1, col2 = ui.columns(2)
    with col1:
        ui.metric(label="Total Academic Fee", value="₹94,450 / yr")
    with col2:
        ui.metric(label="Total Hostel Fee", value="₹75,000 / yr")

    ui.markdown("---")
    ui.markdown("#### 📚 **Academic Fee Breakdown**")
    ui.markdown("""
    | Particulars | Odd Sem | Even Sem | Total |
    | :--- | :---: | :---: | :---: |
    | **College Fee** | ₹50,235/- | ₹44,215/- | **₹94,450/-** |
    """)

    ui.info("""
    **One-Time Deposits (Academic):**
    * 🔒 **Caution Money:** ₹2,000/- (Refundable)
    * 💼 **Personal Money:** ₹2,000/- (Accountable)
    """)

    ui.markdown("---")
    ui.markdown("#### 🏠 **Hostel & Mess Fee Breakdown**")
    ui.markdown("""
    | Particulars | Odd Sem | Even Sem | Total |
    | :--- | :---: | :---: | :---: |
    | **Hostel Fee** | ₹37,500/- | ₹37,500/- | **₹75,000/-** |
    """)
    ui.warning("🔑 **Hostel & Mess Security Deposit:** ₹2,000/- (One time - Refundable)")

def render_hostel_details():
    ui.markdown("### 🏢 **Hostel Facilities & General Overview**")
    ui.write(
        "The College has **1 Girls** and **4 Boys** well-furnished, airy hostels separately. "
        "Each hostel features single rooms equipped with modern amenities and an internet facility."
    )

    ui.info("""
    ✨ **Key Room & Hostel Amenities:**
    * 🛜 **Internet Facility:** Available in each room
    * 💧 **Water Supply:** R.O. System for drinking water
    * ☀️ **Hot Water:** Solar Hot Water supply
    * 🛋️ **Common Area:** Dedicated Common Room for students
    """)

    ui.markdown("---")
    ui.markdown("#### 🛌 **Hostel Capacity Breakdown**")
    ui.markdown("""
    | Name of Hostel | Category | Capacity |
    | :--- | :---: | :---: |
    | **Kalpana Chawla** | Girls | 246 |
    | **Bhabha** | Boys | 230 |
    | **Abdul Kalam** | Boys | 212 |
    | **Raman** | Boys | 194 |
    | **Aryabhatt** | Boys | 237 |
    | **TOTAL** | **Combined** | **1,119** |
    """)

# --- Specific Hostel Render Functions ---
def render_bhabha_hostel():
    ui.markdown("### 🏛️ **Bhabha Hostel (Boys)**")
    ui.markdown("""
    * 📊 **Capacity:** 230 Students
    * 👨‍🏫 **Warden:** Amit Ranjan (Assistant Professor, CSE)
      * 📱 **Mobile:** `+91-7004542102`
    * 👨‍💼 **Supervisor:** Anand Singh Jherli
      * 📱 **Mobile:** `+91-9413040565`
    """)

def render_kalam_hostel():
    ui.markdown("### 🏛️ **Abdul Kalam Hostel (Boys)**")
    ui.markdown("""
    * 📊 **Capacity:** 212 Students
    * 👨‍🏫 **Warden:** Shakti Nandan
      * 📱 **Mobile:** `+91-8235380858`
    * 👨‍💼 **Supervisor:** Vinod Sharma
      * 📱 **Mobile:** `+91-8395914741`
    """)

def render_chawla_hostel():
    ui.markdown("### 🏛️ **Kalpana Chawla Hostel (Girls)**")
    ui.markdown("""
    * 📊 **Capacity:** 246 Students
    * 👩‍💼 **Category:** Dedicated Girls Hostel with secure boundary and modern facilities.
    """)

def render_raman_hostel():
    ui.markdown("### 🏛️ **Raman Hostel (Boys)**")
    ui.markdown("""
    * 📊 **Capacity:** 194 Students
    * 👨‍💼 **Category:** Boys Hostel equipped with single rooms and internet connectivity.
    """)

def render_aryabhatt_hostel():
    ui.markdown("### 🏛️ **Aryabhatt Hostel (Boys)**")
    ui.markdown("""
    * 📊 **Capacity:** 237 Students
    * 👨‍💼 **Category:** Boys Hostel with solar hot water and R.O. drinking water.
    """)

# --- Hostel Selection Options Function ---
def render_hostel_options():
    ui.markdown("### 🏢 **Hostel Directory**")
    ui.write("Aap kis hostel ke baare mein janna chahte hain? Neeche diye gaye options mein se select karein:")
    
    col1, col2 = ui.columns(2)
    with col1:
        if ui.button("🏛️ Bhabha Hostel", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "Bhabha hostel"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_BHABHA__"})
            ui.rerun()
        if ui.button("🏛️ Abdul Kalam Hostel", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "Abdul Kalam hostel"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_KALAM__"})
            ui.rerun()
        if ui.button("🏛️ Kalpana Chawla Hostel", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "Kalpana Chawla hostel"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_CHAWLA__"})
            ui.rerun()
    with col2:
        if ui.button("🏛️ Raman Hostel", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "Raman hostel"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_RAMAN__"})
            ui.rerun()
        if ui.button("🏛️ Aryabhatt Hostel", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "Aryabhatt hostel"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_ARYABHATT__"})
            ui.rerun()
        if ui.button("📋 General Overview", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "General hostel details"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_HOSTEL_GENERAL__"})
            ui.rerun()

def render_mess_details():
    ui.markdown("### 🍽️ **Anpurna Mess**")
    ui.markdown("""
    * 🌅 **Breakfast:** `07:30 AM - 08:30 AM`
    * ☀️ **Lunch:** `12:30 PM - 01:30 PM`
    * 🌙 **Dinner:** `07:30 PM - 08:30 PM`
    """)

def render_bus_routes():
    ui.markdown("### 🚌 **BRCM College Bus Routes & Timings**")
    ui.info("⏰ **Note:** Return buses leave from BRCM Campus at **04:00 PM** for all routes.")

    tab1, tab2, tab3, tab4, tab5 = ui.tabs(["Route 1 (Hisar)", "Route 2 (Hansi)", "Route 3 (Bhiwani Lohani)", "Route 4 (Bhiwani Tosham)", "Route 5 (Satnali)"])

    with tab1:
        ui.markdown("#### 🚌 **Hisar to BRCM (Route - 1)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | BUS STAND | 06:50 AM |
        | JINDAL CHOWK | 07:00 AM |
        | SECTOR 16-17 | 07:05 AM |
        | RAJGARH ROAD | 07:10 AM |
        | MANGALI | 07:25 AM |
        | PPIMT CHOWK | 07:40 AM |
        | SIWANI | 08:00 AM |
        | **BRCM BAHAL** | **08:40 AM** |
        """)

    with tab2:
        ui.markdown("#### 🚌 **Hansi via Tosham to BRCM (Route - 2)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | HANSI | 06:50 AM |
        | TOSHAM | 07:25 AM |
        | ISHARWAL | 08:00 AM |
        | **BRCM BAHAL** | **08:35 AM** |
        """)

    with tab3:
        ui.markdown("#### 🚌 **Bhiwani via Lohani to BRCM (Route - 3)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | ROHTAK GATE | 07:00 AM |
        | LOHANI | 07:20 AM |
        | KAIRU | 07:45 AM |
        | **BRCM BAHAL** | **08:30 AM** |
        """)

    with tab4:
        ui.markdown("#### 🚌 **Bhiwani via Tosham to BRCM (Route - 4)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | POLICE LINE, BHIWANI | 06:45 AM |
        | VAISH COLLEGE | 07:00 AM |
        | TOSHAM | 07:30 AM |
        | **BRCM CET, BAHAL** | **08:40 AM** |
        """)

    with tab5:
        ui.markdown("#### 🚌 **Satnali via Loharu to BRCM (Route - 5)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | SATNALI | 07:00 AM |
        | LOHARU | 07:25 AM |
        | BAHAL | 08:30 AM |
        | **BRCM CAMPUS** | **08:35 AM** |
        """)

def render_contact_details():
    ui.markdown("### 📞 **Contact Us & Alumni Office**")
    ui.info("📞 **Admission Helpline Number:** +91-80599-00247")
    ui.markdown("#### 🏛️ **BRCM CET Alumni Association**")
    ui.write("📍 **Office:** Computer Science Block, BRCM College, Bahal- Haryana (127028)")
    ui.write("📧 **Alumni Email:** alumni@brcm.edu.in")

def render_governance_details():
    ui.markdown("### 🏛️ **Governance & Leadership**")
    ui.markdown("""
    | Role | Name & Designation |
    | :--- | :--- |
    | **Patron in Chief** | Mr. H. K. Chaudhary (Chairman) |
    | **Director** | Dr. S. K. Sinha |
    | **Principal** | Dr. Anuj Kumar Sharma |
    """)

def render_barber_details():
    ui.markdown("### 💈 **Barber Shop**")
    ui.markdown("""
    * 👤 **In-Charge:** Hari Singh
    * 📱 **Contact Number:** `+91-9813883215`
    * ⏰ **Timings:** `05:00 PM - 07:00 PM` (All Days)
    """)

def render_laundry_details():
    ui.markdown("### 🧺 **Laundry Service**")
    ui.markdown("""
    * 📱 **Contact:** `+91-9817004220`, `+91-9996062173`
    * ⏰ **Timings:** `09:00 AM - 10:00 AM` & `04:00 PM - 07:00 PM`
    """)

def render_canteen_details():
    ui.markdown("### 🍔 **BRCM Canteen**")
    ui.markdown("""
    * 👤 **Proprietor:** Naresh Kumar
    * 📱 **Contact:** `+91-9812334037`, `+91-8801888388`
    * ⏰ **Opening Hours:** `08:00 AM - 09:00 PM`
    """)
    ui.markdown("---")
    ui.markdown("#### 📜 **Popular Menu & Rates**")
    ui.markdown("""
    | Item | Price | Item | Price |
    | :--- | :---: | :--- | :---: |
    | **Samosa** | ₹20 | **Chole Bhature** | ₹60 |
    | **Burger** | ₹40 | **Momos** | ₹70 |
    | **Veg Maggie** | ₹50 | **Pasta** | ₹150 |
    """)

def render_ee_hod_details():
    ui.markdown("### ⚡ **Electrical Engineering Department**")
    ui.markdown("""
    **Dr. Vivek Kumar** (HOD - EE)
    * 📧 **Email:** `hodee@brcm.edu.in` | 📱 **Phone:** `8059900249`
    """)

def render_ce_hod_details():
    ui.markdown("### 🏗️ **Civil Engineering Department**")
    ui.markdown("""
    **Mr. Suresh Kumar** (HOD - CE)
    * 📧 **Email:** `hodce@brcm.edu.in` | 📱 **Phone:** `8059900244`
    """)

def render_cse_hod_details():
    ui.markdown("### 💻 **Computer Science Engineering Department**")
    ui.markdown("""
    **Dr. Dinesh Kumar** (Professor & Head - CSE)
    * 📧 **Email:** `hodcse@brcm.edu.in` | 📱 **Phone:** `8059900250`
    """)

def render_rules_details():
    ui.markdown("### 📋 **BRCM Student Code of Conduct & Policies**")
    ui.markdown("""
    * **Attendance:** Minimum 75% attendance mandatory in all theory & practical classes.
    * **Identity Cards:** Valid institutional ID card must be worn visibly at all times.
    * **Ragging Prohibition:** Strict zero-tolerance anti-ragging guidelines across campus & hostels.
    * **Hostel Timings:** Late night entry without prior written permission is strictly banned.
    """)

def render_hod_options():
    ui.markdown("### 👨‍🏫 **Head of Department (HOD) Directory**")
    ui.write("Aap kis branch ke HOD ke baare mein janna chahte hain? Neeche diye gaye options par click karein:")
    
    col1, col2, col3 = ui.columns(3)
    with col1:
        if ui.button("💻 CSE HOD", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "CSE HOD"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_CSE_HOD__"})
            ui.rerun()
    with col2:
        if ui.button("🏗️ Civil HOD", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "Civil HOD"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_CE_HOD__"})
            ui.rerun()
    with col3:
        if ui.button("⚡ Electrical HOD", use_container_width=True):
            ui.session_state.messages.append({"role": "user", "content": "Electrical HOD"})
            ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_EE_HOD__"})
            ui.rerun()

# ----------------------------------------------------
# KNOWLEDGE BASE & KEYWORDS
# ----------------------------------------------------
KNOWLEDGE_BASE = {
    "college": """🏛️ **ABOUT BRCM CET**
Established in August 1999 under Ballaram Hanumandas Charitable Trust. Approved by AICTE, Govt. of Haryana, and affiliated to MDU Rohtak.""",
    "admission": """📝 **ADMISSION ELIGIBILITY**
* **B.Tech 1st Year:** 10+2 with Physics & Math + (Chemistry/Computer) with min 45% marks via JEE.
* **B.Tech LEET:** Diploma / B.Sc with Math with min 45% marks.""",
}

KEYWORDS_MAP = {
    "admission": ["admission", "apply", "btech", "mtech", "leet", "jee", "eligibility"],
    "fee": ["fee", "fees", "structure", "cost", "tuition", "scholarship"],
    "hostel": ["hostel", "room", "accommodation", "capacity"], # General hostel triggers options
    "bhabha": ["bhabha"],
    "kalam": ["kalam", "abdul kalam"],
    "chawla": ["kalpana", "chawla"],
    "raman": ["raman"],
    "aryabhatt": ["aryabhatt"],
    "warden": ["warden", "supervisor", "amit ranjan", "shakti nandan", "anand singh", "vinod sharma"],
    "contact": ["contact", "phone", "email", "alumni", "number", "vikas sharma"],
    "governance": ["governance", "management", "chairman", "director", "principal"],
    "bus": ["bus", "buses", "transport", "route", "hisar", "hansi", "bhiwani", "satnali"],
    "barber": ["barber", "haircut", "hari singh"],
    "laundry": ["laundry", "clothes", "washing"],
    "canteen": ["canteen", "food", "menu", "snack", "maggi", "samosa", "burger"],
    "mess": ["mess", "anpurna", "breakfast", "lunch", "dinner"],
    "electrical": ["electrical", "ee", "vivek"],
    "civil": ["civil", "ce", "suresh"],
    "cse": ["cse", "cs", "computer science", "dinesh"],
    "rules": ["rule", "rules", "policy", "conduct", "discipline", "attendance", "ragging"],
    "hod": ["hod", "head of department", "department head"]
}

college_keywords = ["college", "brcm", "about", "history", "university"]

def execute_intent_response(query, intent):
    log_inquiry(query, intent)
    render_map = {
        "fee": "__RENDER_FEE__",
        "hostel": "__RENDER_HOSTEL_OPTIONS__", # Triggers hostel buttons selection
        "bhabha": "__RENDER_BHABHA__",
        "kalam": "__RENDER_KALAM__",
        "chawla": "__RENDER_CHAWLA__",
        "raman": "__RENDER_RAMAN__",
        "aryabhatt": "__RENDER_ARYABHATT__",
        "warden": "__RENDER_WARDEN__",
        "contact": "__RENDER_CONTACT__",
        "governance": "__RENDER_GOVERNANCE__",
        "bus": "__RENDER_BUS__",
        "barber": "__RENDER_BARBER__",
        "laundry": "__RENDER_LAUNDRY__",
        "canteen": "__RENDER_CANTEEN__",
        "mess": "__RENDER_MESS__",
        "electrical": "__RENDER_EE_HOD__", 
        "civil": "__RENDER_CE_HOD__",
        "cse": "__RENDER_CSE_HOD__",
        "rules": "__RENDER_RULES__",
        "hod": "__RENDER_HOD_OPTIONS__"
    }
    if intent in render_map:
        return render_map[intent], intent
    return KNOWLEDGE_BASE.get(intent, "Information unavailable."), intent

def get_bot_response(user_query):
    query_clean = user_query.lower()
    query_words = query_clean.split()
    
    if any(word in query_clean for word in ["hello", "hi", "hey", "greetings"]):
        return "👋 Greetings! Welcome to BRCM-CET Assistant. Click options on the sidebar or ask me about fees, warden, bus routes, or canteen menu!", "greeting"
    
    if any(word in query_clean for word in college_keywords):
        return execute_intent_response(user_query, "college")

    for intent, mapped_words in KEYWORDS_MAP.items():
        if any(word in query_clean for word in mapped_words):
            return execute_intent_response(user_query, intent)

    for word in query_words:
        for intent, mapped_words in KEYWORDS_MAP.items():
            matches = get_close_matches(word, mapped_words, n=1, cutoff=0.8)
            if matches:
                return execute_intent_response(user_query, intent)

    log_inquiry(user_query, "unknown")
    return "🤖 I couldn't find an exact match. Try asking about 'warden', 'rules', 'mess', 'canteen', or check the sidebarbuttons!", "unknown"

# ----------------------------------------------------
# CHAT INTERFACE RENDERING
# ----------------------------------------------------
if "messages" not in ui.session_state:
    ui.session_state.messages = [{"role": "assistant", "content": "👋 Hello! I am your BRCM-CET Virtual Assistant. How can I help you today?"}]

for msg in ui.session_state.messages:
    with ui.chat_message(msg["role"]):
        content = msg["content"]
        if content == "__RENDER_FEE__":
            render_fee_structure()
        elif content == "__RENDER_HOSTEL_OPTIONS__":
            render_hostel_options()
        elif content == "__RENDER_HOSTEL_GENERAL__":
            render_hostel_details()
        elif content == "__RENDER_BHABHA__":
            render_bhabha_hostel()
        elif content == "__RENDER_KALAM__":
            render_kalam_hostel()
        elif content == "__RENDER_CHAWLA__":
            render_chawla_hostel()
        elif content == "__RENDER_RAMAN__":
            render_raman_hostel()
        elif content == "__RENDER_ARYABHATT__":
            render_aryabhatt_hostel()
        elif content == "__RENDER_WARDEN__":
            render_hostel_wardens() if 'render_hostel_wardens' in globals() else render_hostel_details()
        elif content == "__RENDER_MESS__":
            render_mess_details()
        elif content == "__RENDER_CONTACT__":
            render_contact_details()
        elif content == "__RENDER_GOVERNANCE__":
            render_governance_details()
        elif content == "__RENDER_BUS__":
            render_bus_routes()
        elif content == "__RENDER_BARBER__":
            render_barber_details()
        elif content == "__RENDER_LAUNDRY__":
            render_laundry_details()
        elif content == "__RENDER_CANTEEN__":
            render_canteen_details()
        elif content == "__RENDER_EE_HOD__":
            render_ee_hod_details()
        elif content == "__RENDER_CE_HOD__":
            render_ce_hod_details()
        elif content == "__RENDER_CSE_HOD__":
            render_cse_hod_details()
        elif content == "__RENDER_RULES__":
            render_rules_details()
        elif content == "__RENDER_HOD_OPTIONS__":
            render_hod_options()
        else:
            ui.write(content)

# Quick Suggestion Pill Buttons above Input
ui.markdown("⚡ **Quick Suggestions:**")
cols = ui.columns(4)
with cols[0]:
    if ui.button("🎓 Fees", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Fee structure"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_FEE__"})
        ui.rerun()
with cols[1]:
    if ui.button("🏢 Wardens", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Warden details"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_HOSTEL_OPTIONS__"})
        ui.rerun()
with cols[2]:
    if ui.button("🚌 Buses", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Bus routes"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_BUS__"})
        ui.rerun()
with cols[3]:
    if ui.button("🍔 Canteen", use_container_width=True):
        ui.session_state.messages.append({"role": "user", "content": "Canteen menu"})
        ui.session_state.messages.append({"role": "assistant", "content": "__RENDER_CANTEEN__"})
        ui.rerun()

# User Chat Input
user_input = ui.chat_input("Ask about Rules, Mess, Canteen, Warden, Bus routes, Hostels, HODs, etc.")

if user_input:
    ui.session_state.messages.append({"role": "user", "content": user_input})
    with ui.chat_message("user"):
        ui.write(user_input)

    bot_response, matched_intent = get_bot_response(user_input)
    ui.session_state.messages.append({"role": "assistant", "content": bot_response})
    ui.rerun()