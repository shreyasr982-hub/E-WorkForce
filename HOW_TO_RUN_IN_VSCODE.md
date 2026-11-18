# How to Run E-WorkForce in Visual Studio Code (VS Code)

This project consists of two core services:
1. **Backend API & WebSockets & SQLite**: `http://localhost:5000`
2. **Vite + React Admin Dashboard & Employee Portal**: `http://localhost:5173`

---

## ⚡ Method 1: 1-Click Run & Debug in VS Code (Recommended)

1. Open the project folder in VS Code.
2. Press **`F5`** on your keyboard (or click the **Run and Debug** icon in the left sidebar `Ctrl + Shift + D`).
3. Select **`🚀 Run Ework (Chrome - Full Stack)`** or **`🚀 Run Ework (Edge - Full Stack)`** from the dropdown at the top.
4. Click the **Green Play button**.
5. VS Code will automatically:
   - Launch the Backend API (`:5000`)
   - Launch the Vite Frontend Dashboard (`:5173`)
   - Open your browser to `http://localhost:5173`

---

## 💻 Method 2: Run via VS Code Terminal

1. In VS Code, open the terminal by pressing **`Ctrl + ` `** (backtick) or go to **Terminal > New Terminal**.
2. Type the following command and press Enter:
   ```bash
   npm start
   ```
   *(or run `node e_workfroce-main/Ework-clean/Ework/scripts/dev.js`)*
3. Once running, open your browser and visit:
   👉 **http://localhost:5173**

---

## 🖱️ Method 3: Run via Windows Batch File

In VS Code file explorer or Windows File Explorer, simply double-click **`start.bat`**.

---

## ⚠️ Why It Failed Previously & How It Was Fixed

1. **`index.html` opened directly (Blank Screen / CORS Error)**:
   - Previously `.vscode/launch.json` had a configuration trying to open `index.html` directly in Chrome.
   - Because this is a **React + Vite** app, the browser cannot run `/src/main.jsx` without the Vite development server compiling the JSX.
   - **Fix**: Updated `.vscode/launch.json` and `.vscode/tasks.json` so F5 starts Vite & Express and points Chrome/Edge to `http://localhost:5173`.

2. **PowerShell Script Policy Error in VS Code**:
   - If you see `File ...\npm.ps1 cannot be loaded because running scripts is disabled on this system`, this is Windows blocking PowerShell scripts.
   - **Fix**: We configured `.vscode/settings.json` to default to **Command Prompt (CMD)** in VS Code terminal, which never has script restrictions.

3. **Node.js Version Requirement**:
   - The backend uses native SQLite (`node:sqlite`), which requires **Node.js v22.5.0 or newer**.
   - Check your Node version in terminal:
     ```bash
     node -v
     ```
   - If your version is older (e.g. Node 18 or 20), download Node.js v22+ from **https://nodejs.org/**.

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@ework.com` | `Workforce@2026` |
| **Operations Manager** | `manager@ework.com` | `Workforce@2026` |
| **Field Technician** | `rahul@ework.com` | `Workforce@2026` |
| **Field Sales Exec** | `priya@ework.com` | `Workforce@2026` |
| **Quality Inspector** | `sneha@ework.com` | `Workforce@2026` |
