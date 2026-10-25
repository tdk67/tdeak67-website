<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tamas Deak - Personal Portfolio Website

This is the codebase for the personal portfolio website of **Tamas Deak**, Senior Solution Consultant & Agentic AI Engineer. The website showcases professional experiences, technical expertise, and featured projects, and includes an interactive AI assistant that can answer questions about Tamas's career.

---

## 🌟 Key Features

1. **Dynamic Portfolio**: Showcases professional timeline, technical expertise, and latest certifications.
2. **AI Chat Assistant**: An interactive chatbot representing Tamas, powered by Gemini 2.5 Flash using the `@google/genai` SDK.
3. **Projects Showcase**: A card-based grid displaying deployed projects, direct live links, and GitHub links (if public).
4. **Site Management CLI**: An offline tool to update the CV and manage/bookkeep the list of deployed projects.
5. **Intelligent Rate Limiter & CAPTCHA**: Client-side spam protection to protect API key costs, using:
   - Accessible "I am not a robot" checkbox challenge (keyboard navigable, WCAG 2.1).
   - Sliding-window rate limiting (Burst limit: 3 messages / 10s; Sustained limit: 10 messages / 3m).
6. **Accessibility (WCAG 2.1)**: Skip-to-content link, mobile navigation menu, ARIA labels/roles throughout, Escape-key and keyboard support.
7. **Verified Credential Badge**: A verifiable **FlyRank AI** credential badge in the Certifications section and footer, linking to `internship.flyrank.ai/verify`.
8. **Chat Hardening**: 1500-character message cap and sanitization of `javascript:` links in rendered markdown responses.

---

## ⚙️ How It Works

### Architecture
- **Frontend**: A React single-page application (SPA) styled with Tailwind CSS, built and bundled using Vite.
- **AI Integration**: The frontend communicates directly with the Gemini API. The system instructions and CV context are loaded dynamically from [constants.ts](constants.ts) to guide the model's persona.
- **Data Persistence**:
  - Verification tokens and chat timestamps are kept in the browser's `localStorage` to survive page reloads and prevent easy rate-limit bypasses.
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
- **@google/genai 1.30** - Official Google GenAI SDK
- **react-markdown 9.0** - Renders chatbot's markdown responses
- **remark-gfm 4.0** - Remark plugin for GitHub Flavored Markdown (tables, lists, bold)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- A Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/))

### Steps
1. **Clone the repository** and navigate into the folder:
   ```bash
   cd tdeak67_website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   API_KEY=your_actual_gemini_api_key_here
   ```
   *Alternatively, the app also checks for `GEMINI_API_KEY` in `.env.local`.*

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

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

### 2. Deploy to Hosting Providers

#### Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` from the root directory.
3. In the Vercel Dashboard, go to **Project Settings -> Environment Variables** and add:
   - Key: `API_KEY`
   - Value: `[Your Gemini API Key]`
4. Redeploy to apply environment variables.

#### Netlify
1. Log in to Netlify and select **New site from Git** (or drag-and-drop the `dist` folder).
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Go to **Site configuration -> Environment variables** and add `API_KEY`.
4. Trigger a new deploy.

#### Custom Web Server / Hostinger
Upload all files inside the `dist/` folder to your public directory (e.g., `public_html`) using FTP or the host's file manager.

> [!WARNING]
> **Security Warning on Static Site Keys:**
> In this client-side SPA architecture, `process.env.API_KEY` is compiled directly into the JavaScript files inside `dist/` during the Vite build process. This means your Gemini API key is visible to visitors inspecting network requests.
>
> **Production Best Practice**: To fully protect your API key from abuse in production:
> 1. Set up a simple serverless function (e.g., a Vercel Serverless Function or Netlify Function) to act as a proxy.
> 2. Move the Gemini API call (`@google/genai`) to this serverless function.
> 3. Point `geminiService.ts` to call your serverless function endpoint instead of calling Gemini directly.
