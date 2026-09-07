# 🏛️ MUASHRA (معاشرہ)
### AI Civic Problem-Reporting & Resolution Platform
**Alibaba Cloud AI Hackathon 2026 — Open Innovation Category**

---

## 🌟 Overview
**MUASHRA** is an AI-powered platform for Pakistani citizens to report civic problems (broken roads, water supply bursts, overflowing garbage, dangerous hanging electric wires) using **Urdu/English Voice** or **Photos**. 

The AI automatically:
1. Translates & structures informal voice/text into **formal Urdu & English official petitions**.
2. **Auto-routes** the issue to the correct government department (e.g. WASA, Works & Services, Solid Waste Management, K-Electric/DISCO).
3. **Detects duplicate complaints** in the same neighborhood and merges them to prevent department backlog.
4. Tracks accountability on a **Public Dashboard** with an **Auto-Escalation countdown** and **Department Trust Scores**.

---

## 📂 Complete File Structure Explained (For Beginners)

```
muashra/
│
├── server/                          # 🖥️ BACKEND (Node.js + Express)
│   ├── package.json                 # Lists all Node.js libraries needed (express, cors, multer, etc.)
│   ├── index.js                     # The main backend file. Starts the server on port 5000.
│   ├── .env                         # Secret settings (e.g., Alibaba Qwen API Key)
│   │
│   ├── routes/                      # API Endpoints (URLs the frontend talks to)
│   │   ├── complaints.js            # Submit, read, upvote, and resolve complaints
│   │   └── analytics.js             # Calculates Trust Scores & dashboard overview stats
│   │
│   ├── services/                    # Smart Logic & AI
│   │   ├── qwenService.js           # Connects to Alibaba Qwen API + Built-in Urdu AI engine
│   │   └── duplicateService.js      # Checks GPS distance & text to detect duplicate complaints
│   │
│   ├── data/
│   │   └── complaints.json          # Simple file database storing all citizen complaints
│   └── uploads/                     # Folder where uploaded photos of civic issues are saved
│
└── client/                          # 📱 FRONTEND (React + Vite + Tailwind CSS)
    ├── package.json                 # Lists frontend libraries (react, tailwindcss, lucide-react)
    ├── vite.config.js               # Vite config that connects frontend to backend proxy
    ├── tailwind.config.js           # Tailwind CSS theme colors & layout setup
    ├── index.html                   # Base HTML file loading Noto Nastaliq Urdu font
    │
    └── src/
        ├── main.jsx                 # Entry point that mounts React into the webpage
        ├── App.jsx                  # Main page layout & navigation switcher
        ├── index.css                # Global styling & Urdu Nastaliq font rules
        │
        ├── services/
        │   └── api.js               # Helper functions to fetch data from backend easily
        │
        └── components/              # Reusable UI Blocks:
            ├── Header.jsx           # Top navbar with logo & Urdu/English language toggle
            ├── ReportModal.jsx      # Voice/Photo reporting popup dialog
            ├── VoiceRecorder.jsx    # Microphone recorder with Urdu/English Speech-to-Text
            ├── MapPicker.jsx        # City & GPS coordinates selector
            ├── ComplaintCard.jsx    # Card showing problem, official petition, & upvote button
            ├── PublicDashboard.jsx  # Live stats numbers, search bar & category filters
            └── DepartmentStats.jsx  # Department Trust Score leaderboard
```

---

## 🚀 How to Run in VS Code (Step-by-Step)

### 1. Open the Project Folder in VS Code
- In VS Code, go to **File $\to$ Open Folder** and select:
  `C:\Users\marzi\.gemini\antigravity\scratch\muashra`

### 2. Start the Backend (Terminal 1)
1. Open a new terminal in VS Code (`Ctrl + ~` or Terminal $\to$ New Terminal).
2. Type:
   ```bash
   cd server
   npm start
   ```
3. You will see:
   ```
   🚀 MUASHRA Backend Server is running!
   📡 URL: http://localhost:5000
   ```

### 3. Start the Frontend (Terminal 2)
1. Open a **second terminal tab** by clicking the `+` button in VS Code terminal.
2. Type:
   ```bash
   cd client
   npm run dev
   ```
3. Open your browser at:
   👉 **`http://localhost:5173`**

---

## 🤖 Alibaba Cloud Qwen AI Configuration (Optional)
The platform is built with an **intelligent built-in Urdu/English civic AI engine** that works immediately without any API key.

If you have an **Alibaba Cloud DashScope API Key**, you can add it to `server/.env`:
```env
DASHSCOPE_API_KEY=sk-your-alibaba-dashscope-key-here
```
When provided, the server will automatically make live calls to `qwen-plus` and `qwen-vl`!
