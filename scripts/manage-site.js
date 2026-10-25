import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// Simple dotenv loading
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        // Strip quotes
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val.trim();
      }
    }
  }
}

loadEnv();

const PROJECTS_FILE = path.resolve(process.cwd(), 'projects.json');
const CONSTANTS_FILE = path.resolve(process.cwd(), 'constants.ts');

// Helper to read projects
function readProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) {
    return [];
  }
  const content = fs.readFileSync(PROJECTS_FILE, 'utf-8');
  return JSON.parse(content);
}

// Helper to write projects
function writeProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

// Main CLI logic
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'cv') {
    const cvFilePath = args[1];
    if (!cvFilePath) {
      console.error('❌ Error: Please specify a path to the CV file. E.g., npm run manage cv cv.txt');
      process.exit(1);
    }
    await handleCvUpdate(cvFilePath);
  } else if (command === 'project') {
    const subCommand = args[1];
    if (!subCommand) {
      console.error('❌ Error: Please specify a project subcommand (add, remove, list, toggle).');
      process.exit(1);
    }

    if (subCommand === 'list') {
      handleProjectList();
    } else if (subCommand === 'add') {
      await handleProjectAdd(args.slice(2));
    } else if (subCommand === 'remove') {
      const id = args[2];
      if (!id) {
        console.error('❌ Error: Please specify the project ID to remove.');
        process.exit(1);
      }
      handleProjectRemove(id);
    } else if (subCommand === 'toggle') {
      const id = args[2];
      if (!id) {
        console.error('❌ Error: Please specify the project ID to toggle visibility.');
        process.exit(1);
      }
      handleProjectToggle(id);
    } else {
      console.error(`❌ Error: Unknown project subcommand "${subCommand}".`);
      process.exit(1);
    }
  } else {
    console.error(`❌ Error: Unknown command "${command}".`);
    printHelp();
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
🚀 Website Management CLI Tool

Usage:
  npm run manage <command> [arguments]

Commands:
  cv <file-path>       Ingests a new CV text/markdown file, parses it using Gemini,
                       and automatically updates the constants.ts file.
  
  project list         Lists all registered projects (bookkeeping).
  
  project add          Adds a new project to projects.json.
                       Options:
                         --title "Project Name"
                         --desc "Project description"
                         --github "https://github.com/..." (optional)
                         --live "https://..."
                         --hidden (optional: hides from front page initially)

  project remove <id>  Removes a project by ID from projects.json.
  
  project toggle <id>  Toggles the visibility (showOnSite) of a project on the website.

Notes:
  - Make sure your .env file has a valid API_KEY set before running the CV updater.
`);
}

async function handleCvUpdate(cvFilePath) {
  const fullPath = path.resolve(cvFilePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: File not found at "${fullPath}"`);
    process.exit(1);
  }

  const cvText = fs.readFileSync(fullPath, 'utf-8');
  console.log(`📖 Read CV file (${cvText.length} characters)`);

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: Gemini API key is missing. Please set API_KEY in your .env file to update the CV.');
    process.exit(1);
  }

  console.log('🧠 Parsing CV with Gemini API (gemini-2.5-flash)...');

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a professional CV parser. Your job is to take the raw CV text provided below and convert it into a structured format. 

Return a JSON object matching this schema:
{
  "cvContext": "A clean, detailed, and professional plain-text representation of the full CV. Include sections for Name, Title, Contact Info, Summary, Technical Skills (categorized), Professional Experience (with details, dates, companies), Education, Languages, and Certifications. This string will be used as context for an AI assistant.",
  "experiences": [
    {
      "role": "string (e.g. Senior Solution Consultant)",
      "company": "string (e.g. Ericsson)",
      "period": "string (e.g. Nov 2001 - Apr 2025)",
      "location": "string (optional, e.g. Germany)",
      "details": ["bullet point 1", "bullet point 2", ...]
    }
  ],
  "skills": [
    {
      "category": "string (e.g. Programming, Databases, AI & Automation)",
      "skills": ["skill 1", "skill 2", ...]
    }
  ],
  "certifications": [
    {
      "name": "string (e.g. AI Engineering Fellowship)",
      "issuer": "string (e.g. Outskill)",
      "issued": "string (e.g. Mar 2026)",
      "id": "string (optional)",
      "description": "string (e.g. 6-month training, Prompt Engineering, RAGs, Multimodal AI, Agentic AI)"
    }
  ]
}

Make sure to extract all projects, roles, and certifications correctly. Preserve dates, IDs, and descriptions.

Raw CV Text:
=========================================
${cvText}
=========================================
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            cvContext: { type: 'STRING' },
            experiences: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  role: { type: 'STRING' },
                  company: { type: 'STRING' },
                  period: { type: 'STRING' },
                  location: { type: 'STRING' },
                  details: { type: 'ARRAY', items: { type: 'STRING' } }
                },
                required: ['role', 'company', 'period', 'details']
              }
            },
            skills: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  category: { type: 'STRING' },
                  skills: { type: 'ARRAY', items: { type: 'STRING' } }
                },
                required: ['category', 'skills']
              }
            },
            certifications: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' },
                  issuer: { type: 'STRING' },
                  issued: { type: 'STRING' },
                  id: { type: 'STRING' },
                  description: { type: 'STRING' }
                },
                required: ['name', 'issuer', 'issued', 'description']
              }
            }
          },
          required: ['cvContext', 'experiences', 'skills', 'certifications']
        }
      }
    });

    const resultText = response.text;
    const parsedData = JSON.parse(resultText);

    console.log('✅ CV parsed successfully. Generating constants.ts...');

    const newConstantsContent = `import { Experience, SkillCategory, Certification } from './types';

// The Raw CV Text serves as the context for the LLM
export const CV_CONTEXT = \`${parsedData.cvContext.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`;

export const SYSTEM_INSTRUCTION = \`
You are an AI Assistant representing Tamas Deak. Your goal is to professionally screen and engage with potential employers or recruiters.

**Knowledge Base:**
\\\${CV_CONTEXT}

**Instructions:**
1. Answer questions ONLY based on the provided Context.
2. Speak in the first person (representing Tamas) OR third person (representing his assistant), but be consistent. (Recommendation: Third person "Tamas has..." often sounds more professional for a bot, but First person "I have..." is warmer. Let's stick to a helpful Assistant persona: "Tamas has experience in...").
3. Highlight his certification as an "Agentic AI Engineer" and his deep background in backend systems (Ericsson).
4. If asked about his availability, state that he is open to new opportunities in AI and Backend Engineering.
5. **Format your responses using Markdown.** Use bold text for emphasis, bullet points for lists, and clear paragraph separation. Make the text easy to read in a small chat window.

**Guardrails:**
1. If the user asks a question UNRELATED to Tamas's professional life, skills, CV, or AI interests (e.g., "How do I bake a cake?", "Who is the president?"), politely refuse. Say something like: "I am designed to answer questions about Tamas Deak's professional background and skills. Please ask me about his experience with AI or Backend development."
2. Do not hallucinate job experiences not listed in the context.
3. Keep answers concise and professional.
\`;

// Structured Data for UI
export const EXPERIENCES: Experience[] = ${JSON.stringify(parsedData.experiences, null, 2)};

export const SKILLS: SkillCategory[] = ${JSON.stringify(parsedData.skills, null, 2)};

export const CERTIFICATIONS: Certification[] = ${JSON.stringify(parsedData.certifications, null, 2)};
`;

    fs.writeFileSync(CONSTANTS_FILE, newConstantsContent, 'utf-8');
    console.log('🎉 Successfully updated constants.ts with new CV details!');
  } catch (error) {
    console.error('❌ Error parsing CV or writing constants.ts:', error);
    process.exit(1);
  }
}

function handleProjectList() {
  const projects = readProjects();
  console.log(`\n📚 Deployed Projects Bookkeeping (${projects.length} total):`);
  console.log('='.repeat(80));
  if (projects.length === 0) {
    console.log('No projects registered.');
    return;
  }

  projects.forEach((proj, idx) => {
    console.log(`${idx + 1}. [${proj.showOnSite ? 'VISIBLE ON SITE' : 'HIDDEN FROM SITE'}] ${proj.title} (ID: ${proj.id})`);
    console.log(`   Description: ${proj.description}`);
    console.log(`   Live URL:    ${proj.liveUrl}`);
    console.log(`   GitHub URL:  ${proj.githubUrl || 'N/A (Private)'}`);
    console.log('-'.repeat(80));
  });
}

async function handleProjectAdd(options) {
  let title = '';
  let description = '';
  let githubUrl = null;
  let liveUrl = '';
  let showOnSite = true;

  // Simple arguments parsing
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    if (opt === '--title') {
      title = options[++i];
    } else if (opt === '--desc') {
      description = options[++i];
    } else if (opt === '--github') {
      const url = options[++i];
      githubUrl = url === 'null' || url === '' ? null : url;
    } else if (opt === '--live') {
      liveUrl = options[++i];
    } else if (opt === '--hidden') {
      showOnSite = false;
    }
  }

  if (!title || !description || !liveUrl) {
    console.error('❌ Error: Missing required options.');
    console.log('Required flags: --title "..." --desc "..." --live "..."');
    console.log('Optional flags: --github "..." --hidden');
    process.exit(1);
  }

  // Generate an ID from title
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const projects = readProjects();
  if (projects.some(p => p.id === id)) {
    console.error(`❌ Error: A project with ID "${id}" already exists.`);
    process.exit(1);
  }

  const newProject = {
    id,
    title,
    description,
    githubUrl,
    liveUrl,
    showOnSite
  };

  projects.push(newProject);
  writeProjects(projects);
  console.log(`🎉 Successfully added project: "${title}" (ID: ${id})`);
}

function handleProjectRemove(id) {
  const projects = readProjects();
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    console.error(`❌ Error: Project with ID "${id}" not found.`);
    process.exit(1);
  }

  const removed = projects.splice(index, 1);
  writeProjects(projects);
  console.log(`🎉 Successfully removed project: "${removed[0].title}" (ID: ${id})`);
}

function handleProjectToggle(id) {
  const projects = readProjects();
  const project = projects.find(p => p.id === id);

  if (!project) {
    console.error(`❌ Error: Project with ID "${id}" not found.`);
    process.exit(1);
  }

  project.showOnSite = !project.showOnSite;
  writeProjects(projects);
  console.log(`🎉 Project "${project.title}" visibility toggled to: ${project.showOnSite ? 'VISIBLE' : 'HIDDEN'}`);
}

main();
