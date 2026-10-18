# UNCANNY TEST PROGRAM (UTP-EVAL-606)

An interactive psychological analog-horror surveillance evaluation simulation.

---

## 👁 Overview

Candidates are recruited by the mysterious **Uncanny Co.** to undergo cognitive and visual surveillance screening. Through 15 classified case files, subjects must observe eerie, liminal, and distorted imagery to determine whether each case depicts a standard occurrence (**NORMAL**) or an existential breach (**ANOMALY**).

The program tests perception under psychological pressure with unexpected disruptions, movement anomalies, and suspenseful standby delays. At the conclusion, an official **Certificate of Evaluation** is generated recording the exact metrics of anomalies found and missed, user name, evaluation clearance status (`PASS` / `FAIL`), and a unique cryptographically styled Test ID.

---

## 🚀 Features

- **Candidate Intake System**: Prompts and records the user's name at the entrance, preserving identity throughout the test sequence and displaying it on the final official certificate.
- **Dynamic Anomaly Scoring & State Persistence**:
  - Automatically records every user choice (`ANOMALY` vs `NORMAL`) across all 15 cases.
  - Compares against classified ground truth (7 anomalies, 8 normal cases).
  - Persists metrics through browser `localStorage` and `sessionStorage`.
- **Interactive Evaluation Certificate**:
  - Displays user's verified name.
  - Exact count of **Total Anomalies Found** (e.g., `7 / 7`).
  - Exact count of **Total Anomalies Missed** (e.g., `0 / 7`).
  - Overall accuracy and case verification rate.
  - Evaluation clearance status (`PASS` if all anomalies found with 0 mistakes, otherwise `FAIL`).
  - Random 7-character verification ID starting with `67` (e.g. `67-A94F2`).
  - Dynamic evaluation date.
- **High-Resolution Certificate Export**:
  - **Download as PDF**: Generates a vector/high-DPI PDF document directly to disk.
  - **Download as Image (PNG)**: Saves a high-resolution PNG image suitable for sharing.
  - **Print / Save**: Tailored `@media print` styles for clean paper or browser PDF printing.
  - **Retake Test**: Clears current session data and restarts the evaluation.
- **Hosting Ready**:
  - Cleaned all copy-pasted markdown fences (```` ``` ````) across every HTML file.
  - Root `index.html` and `codes/index.html` entry points for seamless deployment.
  - Zero-configuration deployment configs for GitHub Pages, Netlify, and Vercel.

---

## 🌐 How to Host

### Option 1: GitHub Pages (Free & 1-Click)
1. Push this repository to GitHub.
2. In your repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then click **Save**.
5. Your project will be live at `https://<your-username>.github.io/<repo-name>/`.

### Option 2: Netlify (Drag-and-Drop or Git)
1. Go to [Netlify](https://app.netlify.com/).
2. Drag and drop the project folder onto the Netlify dashboard, or connect your Git repo.
3. The included `netlify.toml` automatically handles routing.

### Option 3: Vercel
1. Install Vercel CLI (`npm i -g vercel`) or import the Git repo on [Vercel](https://vercel.com).
2. Deploy directly with `vercel` command. The included `vercel.json` ensures smooth delivery.

---

## 💻 Local Testing

You can run this project locally without any web server:
- Double click [index.html](file:///c:/Users/bless/OneDrive/Pictures/Uncanny%20test/index.html) or [codes/1Alpha.html](file:///c:/Users/bless/OneDrive/Pictures/Uncanny%20test/codes/1Alpha.html) in your browser.
- Or start a local dev server with Python or Node:
  ```bash
  # Node.js
  npx serve .

  # Python
  python -m http.server 8000
  ```
