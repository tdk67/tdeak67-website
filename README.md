<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tamas Deak - Personal Portfolio Website

This is the codebase for the personal portfolio website of **Tamas Deak**, Senior Solution Consultant & Agentic AI Engineer. The website showcases professional experiences, technical expertise, and featured projects, and includes an interactive AI assistant that can answer questions about Tamas's career.

---

## 🌟 Key Features

1. **Dynamic Portfolio**: Showcases professional timeline, technical expertise, and latest certifications.
2. **AI Chat Assistant**: An interactive chatbot representing Tamas, powered by Gemini 2.5 Flash — **securely proxied server-side** so the API key never reaches the browser.
3. **Projects Showcase**: A card-based grid displaying deployed projects, direct live links, and GitHub links (if public).
4. **Site Management CLI**: An offline tool to update the CV and manage/bookkeep the list of deployed projects.
5. **Server-Side Rate Limiting & Anti-Abuse**: Two independent per-IP defences protect API costs:
   - **nginx `limit_req`** zone (6 req/min, burst 3) as the first line of defence.
   - **App-level token bucket** in the proxy (burst 3/10s + sustained 10/3min), plus an **Origin allow-list** that rejects cross-site calls, an input length cap, and a bounded conversation window.
   - The in-page "I am not a robot" checkbox remains as a lightweight UX gate.
6. **Accessibility (WCAG 2.1)**: Skip-to-content link, mobile navigation menu, ARIA labels/roles throughout, Escape-key and keyboard support.
7. **Verified Credential Badge**: A verifiable **FlyRank AI** credential badge in the Certifications section and footer, linking to `internship.flyrank.ai/verify`.
8. **Chat Hardening**: 1500-character message cap and sanitization of `javascript:` links in rendered markdown responses.

---

## ⚙️ How It Works

### Architecture
- **Frontend**: A React single-page application (SPA) styled with Tailwind CSS, built and bundled using Vite.
- **AI Integration (secure proxy)**: The frontend **never** talks to Google directly. It POSTs to `/api/chat` → [nginx](nginx-docker.conf) (rate-limited) → [server/chat_proxy.py](server/chat_proxy.py) (FastAPI) which holds the Gemini API key in `server-side .env` and streams the model's response back. The system instruction & CV context live in [server/system_prompt.txt](server/system_prompt.txt).
- **Data Persistence**:
  - A small bounded conversation window is kept in the browser's `localStorage` (last 12 turns) purely for context; the key and limits live server-side.
  - Project bookkeeping logs are saved locally in [projects.json](projects.json).

### CLI Management Tool
The file [manage-site.js](scripts/manage-site.js) provides a developer interface:
- **CV Update**: Takes a raw text/markdown file, queries Gemini to parse it into structured TypeScript structures, and rewrites [constants.ts](constants.ts) automatically.
- **Project Bookkeeping**: Interacts with [projects.json](projects.json) to add, list, delete, or toggle website visibility of projects.

---

## 📚 Libraries Involved

### Core Frameworks
- **React 18.3** - UI render tree
- **TypeScript 5.9** - Static type checking
- **Vite 8.2** - Fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling framework

### AI & Markdown
- **react-markdown 9.0** - Renders chatbot's markdown responses
- **remark-gfm 4.0** - Remark plugin for GitHub Flavored Markdown (tables, lists, bold)

### Server (chat proxy)
- **FastAPI + Uvicorn** - Lightweight async proxy that hides the Gemini API key
- **httpx** - Async streaming client for Gemini's SSE endpoint

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- Python 3.12 (for the chat proxy)
- A Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/))

### Steps
1. **Clone the repository** and navigate into the folder:
   ```bash
   cd tdeak67_website
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (**never commit it** — see `.env.example`):
   ```env
   API_KEY=your_actual_gemini_api_key_here
   GEMINI_REFERER=https://tdeak67.com/
   PROXY_PORT=8020
   ```

4. **Set up the chat proxy** (this is what keeps the key off the client):
   ```bash
   cd server
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   python chat_proxy.py
   ```

5. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`. In dev, add a proxy for `/api/chat` -> `http://127.0.0.1:8020/v1/chat` in your Vite config if not using nginx.

6. **Keep the proxy alive** (VPS):
   ```bash
   sudo systemctl enable --now tdeak67-chat-proxy
   ```

---

## 🛠️ CLI Usage Guide

You can manage your website's projects list and CV content using the custom CLI script:

```bash
npm run manage <command> [arguments]
```

### 1. Ingest/Update your CV
Write or paste your new CV into a local text file (e.g., `my_cv.txt`) and run:
```bash
npm run manage cv my_cv.txt
```
This script reads the file, parses it into structured sections using Gemini, and updates `constants.ts` (both the text context and the React experience/skills/certifications lists).

### 2. List registered projects
Check the database of deployed projects (including hidden/visible status):
```bash
npm run manage project list
```

### 3. Add a new project to the log
Register a project to your bookkeeping log:
```bash
npm run manage project add --title "App Name" --desc "Description of app" --live "https://app.live" --github "https://github.com/..."
```
- `--github` is optional (omit it for projects with private repositories).
- Append `--hidden` if you want to save it in bookkeeping but hide it from the website.

### 4. Toggle project visibility
Show/hide a project on the portfolio page:
```bash
npm run manage project toggle <project-id>
```

### 5. Delete a project
Remove a project completely from bookkeeping:
```bash
npm run manage project remove <project-id>
```

---

## 🌐 Deployment Guidance

Building the project generates a production-ready static bundle in the `dist/` directory. The current production setup serves these files via a Dockerized nginx image (see [DEPLOYMENT.md](DEPLOYMENT.md) for the full rebuild/redeploy one-liner).

### 1. Build the application
Before deploying, compile and package the assets:
```bash
npm run build
```

### 2. Deploy the static site
```bash
# Build the Docker image and run the container (serves dist/ via nginx)
docker build -t tdeak67:latest .
docker rm -f tdeak67-website
docker run -d --name tdeak67-website --restart unless-stopped -p 127.0.0.1:8005:80 tdeak67:latest
```

### 3. Deploy the chat proxy
```bash
# systemd unit already provided in repo; on the VPS:
sudo cp deploy/tdeak67-chat-proxy.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now tdeak67-chat-proxy
```
The proxy listens on `127.0.0.1:8020` and should only ever be reached through nginx (never exposed publicly).

### 4. Nginx routing
- `GET /` → the static container at `127.0.0.1:8005`
- `POST /api/chat` → the proxy at `127.0.0.1:8020/v1/chat`, gated by a `limit_req` zone (per-IP, 6 req/min burst 3)

### 5. Hosting Providers (Vercel / Netlify)
If you host the static site on Vercel/Netlify instead of this VPS:
1. Build command: `npm run build`, publish directory: `dist`.
2. Do **not** put the API key in frontend env vars.
3. Deploy the proxy (e.g. Vercel Serverless Function or a small VM) and point `CHAT_ENDPOINT` in `services/geminiService.ts` to it.

> [!NOTE]
> **Security model**: The Gemini API key lives **only** in the server-side `.env`. The built `dist/` bundle contains no key — verified by scanning the deployed assets for the `AIza...` pattern. Abuse is throttled at two layers: nginx `limit_req` and the proxy's per-IP token bucket, both keyed on the caller's real IP.
