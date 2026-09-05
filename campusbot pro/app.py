import streamlit as ui
import sqlite3
import datetime
from difflib import get_close_matches

# Page configuration
ui.set_page_config(page_title="CampusBot Pro - BRCM CET", page_icon="🎓", layout="centered")

# Custom UI Styling
ui.markdown("""
    <style>
    .main-header { font-size: 2.2rem; color: #1E3A8A; font-weight: bold; text-align: center; margin-bottom: 5px; }
    .sub-header { font-size: 1.1rem; color: #4B5563; text-align: center; margin-bottom: 25px; }
    .bot-msg { background-color: #F3F4F6; padding: 15px; border-radius: 10px; margin: 10px 0; color: #1F2937; box-shadow: 1px 1px 3px rgba(0,0,0,0.05); white-space: pre-line; }
    .user-msg { background-color: #DBEAFE; padding: 12px; border-radius: 10px; margin: 5px 0; color: #1E3A8A; text-align: right; box-shadow: 1px 1px 3px rgba(0,0,0,0.05); }
    </style>
""", unsafe_allow_html=True)

ui.markdown('<div class="main-header">🎓 CampusBot Pro</div>', unsafe_allow_html=True)
ui.markdown('<div class="sub-header">Official Assistant for BRCM College of Engineering & Technology</div>', unsafe_allow_html=True)

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
# RENDER FUNCTIONS FOR UI DATA
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
    ui.markdown("### 🏢 **Hostel Facilities & Details**")
    ui.write(
        "The College has **1 Girls** and **4 Boys** well-furnished, airy hostels separately for Boys and Girls. "
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

    ui.markdown("---")
    ui.markdown("#### 🏛️ **Campus Amenities & Other Facilities**")
    col1, col2 = ui.columns(2)
    with col1:
        ui.markdown("""
        * 📚 **Library Facilities**
        * 🍽️ **Mess Facilities**
        * 🚌 **Transport Facilities**
        * 🏊 **Swimming Pool**
        * 📽️ **Media Centre**
        * 🛍️ **Tuck Shop**
        """)
    with col2:
        ui.markdown("""
        * 🌐 **Internet Infrastructure**
        * 🛠️ **Workshop Facilities**
        * 💡 **EDC Cell**
        * 💈 **Barber Shop**
        * 🧺 **Laundry Services**
        * 💅 **Beauty Parlor**
        """)

def render_bus_routes():
    ui.markdown("### 🚌 **BRCM College Bus Routes & Timings**")
    ui.info("⏰ **Note:** Return buses leave from BRCM Campus at **04:00 PM** for all routes.")

    tab1, tab2, tab3, tab4, tab5 = ui.tabs(["Route 1 (Hisar)", "Route 2 (Hansi)", "Route 3 (Bhiwani via Lohani)", "Route 4 (Bhiwani via Tosham)", "Route 5 (Satnali)"])

    with tab1:
        ui.markdown("#### 🚌 **Hisar to BRCM (Route - 1)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | BUS STAND | 06:50 AM |
        | JINDAL CHOWK | 07:00 AM |
        | SECTOR 16-17 | 07:05 AM |
        | RAJGARH ROAD (CANAL BRIDGE) | 07:10 AM |
        | ARYAN SCHOOL KAIMIRI ROAD | 07:15 AM |
        | MANGALI | 07:25 AM |
        | PPIMT CHOWK | 07:40 AM |
        | SIWANI | 08:00 AM |
        | JHUMPA | 08:15 AM |
        | **BRCM BAHAL** | **08:40 AM** |
        """)

    with tab2:
        ui.markdown("#### 🚌 **Hansi via Tosham to BRCM (Route - 2)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | HANSI | 06:50 AM |
        | JAMALPUR | 07:10 AM |
        | TOSHAM | 07:25 AM |
        | ALAMPUR | 07:35 AM |
        | KATWAR | 07:50 AM |
        | ISHARWAL | 08:00 AM |
        | MANDHOLI / GOPALWAS | 08:10 AM |
        | GOKALPURA | 08:20 AM |
        | **BRCM BAHAL** | **08:35 AM** |
        """)

    with tab3:
        ui.markdown("#### 🚌 **Bhiwani via Lohani to BRCM (Route - 3)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | ROHTAK GATE | 07:00 AM |
        | DADRI GATE | 07:03 AM |
        | OVER BRIDGE | 07:10 AM |
        | LOHANI | 07:20 AM |
        | KAIRU | 07:45 AM |
        | OBRA | 08:00 AM |
        | **BRCM BAHAL** | **08:30 AM** |
        """)

    with tab4:
        ui.markdown("#### 🚌 **Bhiwani via Tosham to BRCM (Route - 4)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | POLICE LINE, BHIWANI | 06:45 AM |
        | SEC-23 / BHAGAT SINGH CHOWK | 06:48 AM |
        | MRM HONDA | 06:50 AM |
        | PANCHAYAT BHAWAN | 06:53 AM |
        | REST HOUSE | 06:56 AM |
        | VAISH COLLEGE | 07:00 AM |
        | TIT COLLEGE TOSHAM BYPASS | 07:05 AM |
        | SANGWAN | 07:20 AM |
        | TOSHAM | 07:30 AM |
        | KHARKADI-JHANWARI | 07:36 AM |
        | PATODI | 07:45 AM |
        | BUSAN / KATWAR | 07:54 AM |
        | ISHARWAL | 08:00 AM |
        | MANDHOLI | 08:10 AM |
        | GOKALPURA | 08:20 AM |
        | **BRCM CET, BAHAL** | **08:40 AM** |
        """)

    with tab5:
        ui.markdown("#### 🚌 **Satnali via Loharu to BRCM (Route - 5)**")
        ui.markdown("""
        | Origin Stop | Time |
        | :--- | :---: |
        | SATNALI | 07:00 AM |
        | JAWAHAR NAGAR / PATHARWA | 07:10 AM |
        | SOHANSRA / FARTIA BHIMA | 07:15 AM |
        | FARTIA TAL | 07:20 AM |
        | LOHARU | 07:25 AM |
        | DHANI TODA | 07:30 AM |
        | GIGNOW | 07:40 AM |
        | SINGHANI | 07:45 AM |
        | JHANJRA | 07:50 AM |
        | BARALU | 07:55 AM |
        | DAMKORA | 08:00 AM |
        | DHANI BHAGHASARA / PAHARI | 08:10 AM |
        | BUDHERI | 08:15 AM |
        | PAJU | 08:20 AM |
        | SIRSI | 08:25 AM |
        | BAHAL | 08:30 AM |
        | **BRCM CAMPUS** | **08:35 AM** |
        """)

def render_contact_details():
    ui.markdown("### 📞 **Contact Us & Alumni Office**")
    ui.info("📞 **Admission Helpline Number:** +91-80599-00247")
    
    ui.markdown("#### 🏛️ **BRCM CET Alumni Association**")
    ui.write("📍 **Office:** Alumni Interaction Office, Ground Floor, Computer Science Block, BRCM College of Engineering & Technology, Bahal- Haryana (127028), India")
    ui.write("📧 **Alumni Email:** alumni@brcm.edu.in")
    
    ui.markdown("---")
    ui.markdown("#### 👤 **Key Contact Persons**")
    col1, col2 = ui.columns(2)
    with col1:
        ui.markdown("""
        **Mr. Vikas Sharma**
        * 📱 **Phone:** +91-8059900251
        * 📧 **Email:** placement@brcm.edu.in
        """)
    with col2:
        ui.markdown("""
        **Mr. Suresh Kumar**
        * 📱 **Phone:** +91-9812687879
        """)

def render_governance_details():
    ui.markdown("### 🏛️ **Governance & Leadership**")
    
    ui.markdown("#### 📜 **Constitution**")
    ui.markdown("""
    | Role | Name & Designation |
    | :--- | :--- |
    | **Patron in Chief** | Mr. H. K. Chaudhary (Chairman, BRCM Group of Institutions) |
    | **Patrons** | Dr. S. K. Sinha (Director, BRCM Group of Institutions) |
    | **Patrons** | Dr. Anuj Kumar Sharma (Principal, BRCM College of Engg. & Tech) |
    | **Office In Charge** | Mr. Vikas Sharma (TPO) |
    """)

    ui.markdown("---")
    ui.markdown("#### 👥 **Governing Council**")
    ui.markdown("""
    | Position | Member Name |
    | :--- | :--- |
    | **President** | Mr. Ravi Kant Yadav (Batch 2009) |
    | **Vice President** | Mr. Mohit Vijarniya (Batch 2011) |
    | **Executive Secretary** | Dr. Manju Khurana (Batch 2008) |
    | **Joint Secretary** | Mr. Naveen Sheoran (2012) |
    | **Advisor** | Dr. Pavel Somavat (2003) |
    """)
    
    ui.markdown("---")
    ui.markdown("#### 🤝 **Members of Alumni Association**")
    ui.markdown("""
    * **Mr. Vikas Sharma** - TPO
    * **Mr. Suresh Kumar** - AP (ME)
    """)

# ----------------------------------------------------
# KNOWLEDGE BASE 
# ----------------------------------------------------
KNOWLEDGE_BASE = {
    "college": """🏛️ **ABOUT BRCM CET**

Established under the aegis of Ballaram Hanumandas Charitable Trust, BRCM College of Engineering & Technology started its journey in August 1999. BRCM-CET represents the manifestation of modern concepts of teaching pedagogy related to higher technical education.

The College is duly approved by AICTE and the Government of Haryana and is affiliated to Maharshi Dayanand University, Rohtak for 4-year B.Tech and 2-year M.Tech programmes.""",

    "admission": """📝 **ADMISSION ELIGIBILITY CRITERIA**

📌 **B.Tech. 1st Year (JEE):**
Passed 10+2 Examination with Physics & Mathematics as compulsory subjects along with Chemistry/Computer with at least 45% marks (42.75% for SC). Admission via JEE ranking.

📌 **B.Tech. 2nd Year (LEET):**
Passed Diploma Exam with at least 45% marks (42.75% for SC) or B.Sc. Degree with Math. Admission via LEET ranking.

📌 **M.Tech.:**
Minimum 50% marks in 4-year B.Tech / B.E in relevant discipline with valid GATE score.""",

    "courses": "We offer structured undergraduate and graduate degrees in Computer Science (CSE), Electronics (ECE), Data Science, and Management streams.",
    "placements": "Our Training & Placement Cell records a strong 85%+ success rate with top corporate recruiters.",
}

# Synonyms matrix (Updated with Bus/Transport keywords)
KEYWORDS_MAP = {
    "admission": ["admission", "admissions", "addmission", "admisson", "apply", "btech", "mtech", "leet", "jee", "eligibility", "helpline"],
    "fee": ["fee", "fees", "feess", "structure", "cost", "price", "tuition", "payment", "scholarship"],
    "courses": ["courses", "course", "courss", "branch", "branches", "program", "major", "degree"],
    "placements": ["placements", "placement", "placment", "job", "jobs", "recruit", "salary", "company"],
    "hostel": ["hostel", "hostels", "hostle", "room", "rooms", "accommodation", "capacity", "bhabha", "kalam", "chawla"],
    "facilities": ["facilities", "facility", "facilties", "campus", "amenities", "pool", "mess", "tuck shop", "barber", "laundry"],
    "contact": ["contact", "contacts", "phone", "email", "alumni", "number", "call", "vikas sharma", "suresh kumar", "address"],
    "governance": ["governance", "management", "chairman", "director", "principal", "patron", "chaudhary", "sinha", "anuj sharma", "council"],
    "bus": ["bus", "buses", "transport", "route", "routes", "timing", "timings", "hisar", "hansi", "bhiwani", "satnali", "tosham", "loharu", "siwani"]
}

college_keywords = ["college", "brcm", "about", "history", "established", "university", "trust", "cet"]

# ----------------------------------------------------
# INTENT HANDLING LOGIC
# ----------------------------------------------------
def get_bot_response(user_query):
    query_clean = user_query.strip().lower()
    query_words = query_clean.split()
    
    if any(word in query_clean for word in ["hello", "hi", "hey", "greetings"]):
        return "Greetings! Welcome to our BRCM-CET Digital Desk. Ask me anything regarding admissions, fees, courses, hostels, bus routes, governance, or contacts.", "greeting"
    
    if any(word in query_clean for word in college_keywords):
        log_inquiry(user_query, "college")
        return KNOWLEDGE_BASE["college"], "college"

    for intent, mapped_words in KEYWORDS_MAP.items():
        if any(word in query_clean for word in mapped_words):
            log_inquiry(user_query, intent)
            if intent == "fee": return "__RENDER_FEE__", "fee"
            if intent == "hostel" or intent == "facilities": return "__RENDER_HOSTEL__", "hostel"
            if intent == "contact": return "__RENDER_CONTACT__", "contact"
            if intent == "governance": return "__RENDER_GOVERNANCE__", "governance"
            if intent == "bus": return "__RENDER_BUS__", "bus"
            return KNOWLEDGE_BASE[intent], intent
            
        for word in query_words:
            matches = get_close_matches(word, mapped_words, cutoff=0.7)
            if matches:
                log_inquiry(user_query, intent)
                if intent == "fee": return "__RENDER_FEE__", "fee"
                if intent == "hostel" or intent == "facilities": return "__RENDER_HOSTEL__", "hostel"
                if intent == "contact": return "__RENDER_CONTACT__", "contact"
                if intent == "governance": return "__RENDER_GOVERNANCE__", "governance"
                if intent == "bus": return "__RENDER_BUS__", "bus"
                return KNOWLEDGE_BASE[intent], intent
            
    log_inquiry(user_query, "unknown")
    return "I am unable to locate an exact match for that question. Try asking about 'admissions', 'fees', 'hostels', 'bus routes', 'governance', or 'contact info'.", "unknown"

# ----------------------------------------------------
# CHAT INTERFACE RENDERING
# ----------------------------------------------------
if "messages" not in ui.session_state:
    ui.session_state.messages = [{"role": "assistant", "content": "Hello! I am your BRCM-CET Virtual Assistant. How can I help you find campus information today?"}]

# Render previous chat messages
for msg in ui.session_state.messages:
    with ui.chat_message(msg["role"]):
        if msg["content"] == "__RENDER_FEE__":
            render_fee_structure()
        elif msg["content"] == "__RENDER_HOSTEL__":
            render_hostel_details()
        elif msg["content"] == "__RENDER_CONTACT__":
            render_contact_details()
        elif msg["content"] == "__RENDER_GOVERNANCE__":
            render_governance_details()
        elif msg["content"] == "__RENDER_BUS__":
            render_bus_routes()
        else:
            ui.write(msg["content"])

# User Chat Input
user_input = ui.chat_input("Ask about admissions, fees, bus routes, governance, contacts...")

if user_input:
    ui.session_state.messages.append({"role": "user", "content": user_input})
    bot_reply, intent = get_bot_response(user_input)
    ui.session_state.messages.append({"role": "assistant", "content": bot_reply})
    ui.rerun()