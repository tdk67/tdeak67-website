import { Experience, SkillCategory, Certification } from './types';

// The Raw CV Text serves as the context for the LLM
export const CV_CONTEXT = `
Name: Tamas Deak
Title: Senior Solution Consultant / Agentic AI Engineer
Location: Dietzenbach, Germany
Email: t_deak@hotmail.com
LinkedIn: https://www.linkedin.com/in/tdeak67

SUMMARY:
Senior Solution Consultant with over 20 years of experience developing and optimizing complex backend systems for industry leaders like Ericsson. Proven expert in backend development (Kotlin, Java, Python), system integration, and performance tuning. Praised by management for a strong "initiative" and an "analytical" approach. Certified Agentic AI Engineer aiming to apply deep system engineering experience to build practical, AI-driven automation.

TECHNICAL SKILLS:
- Programming: Kotlin, Java, Python, C/C++, SQL
- AI & Automation: Agentic AI, Generative AI, Prompt Engineering, Robot Framework, Selenium
- Frameworks & Tools: Spring Boot, REST, SOAP, XML, Git
- Databases: PostgreSQL, Oracle DB
- Operating Systems: Linux, Unix, Windows

PROFESSIONAL EXPERIENCE:

1. AI Engineer / Intern at FlyRank AI, Remote (Jul 2026 – Present)
   - Backend AI Engineering internship, focusing on hands-on assignments in LLM applications, AI agents, and workflow automation.
   - Participate in technical webinars and mentoring sessions on AI engineering and software development.
   - Complete Anthropic certification courses.

2. Software Engineer - Backend at DERTOUR Group, Frankfurt Rhine-Main Metropolitan Area (Feb 2026 – Jul 2026)
   - Maintained and enhanced the backend of an e-commerce platform for travel products.
   - Improved code quality, stability, and performance.
   - Collaborated with product and frontend teams in an Agile/SCRUM environment.
   - Technologies include Kotlin, Spring Boot, REST APIs, PostgreSQL DB, AWS cloud (k8s).

3. Career Break - AI Upskilling (Apr 2025 – Feb 2026)
   - Focused on structured learning in applied AI and automation.
   - Built hands-on projects related to prompt design, RAG pipelines, multimodal AI, and agent-based workflows.

3. Senior Solution Consultant at Ericsson, Germany (Nov 2001 – Apr 2025)
   (Initial employment with LHS Telecommunications GmbH, acquired by Ericsson)
   
   - Project: Automated Testing / Tech Lead (Apr 2023 – Apr 2025 & Aug 2019 – Sep 2020)
     - Led a technical team to develop/migrate data-driven automated tests for core billing systems (CBEV, Ericsson Billing).
     - Designed/implemented test suites using Python, Robot Framework, and ESSVT.
     - Introduced prototype AI-assisted test-case ideas.

   - Project: ECA (Ericsson Customer Acceptance) / Blockchain Backend (Jul 2021 – Mar 2023)
     - Developed backend for ECA application using Kotlin, Spring Boot, PostgreSQL, and Corda R3.
     - Built acceptance automation and validation flows.

   - Project: Senior Consultant – BSCS Consultancy & Performance Tuning (Sep 2019 – Jul 2021)
     - Stabilized production environments and provided expert support for clients in Morocco, Saudi Arabia, Sudan.
     - Technical expert for remote clients resolving complex performance bottlenecks in Ericsson Billing.

   - Project: Senior Consultant – Customer & Production Support (Apr 2018 – Jul 2019)
     - Expert-level support during go-live events. Specialized in stabilizing Java-based solutions (customer care, finance modules).

   - Project: T-Mobile USA (On-site & Remote) (2014 – Mar 2018)
     - Technical support during major billing modernization. BSCS knowledge integration.

   - Project: R&D – Senior Developer (Jan 2011 – Dec 2013)
     - R&D projects including customer care server (BSSF) and Microsoft Dynamics CRM plug-in.
     - Technologies: Java, C#, Javascript, REST.
     - Tutored colleagues in Chennai, India.

   - Software Developer (LHS/Ericsson) (Nov 2001 – Jan 2011)
     - C/C++, Java, XML, CORBA, Oracle DB for BSCS billing systems.

4. Software Developer at SEMA Group Telecom, Germany (Jan 2000 – Oct 2001)
5. Software Developer at Lufthansa Systems Hungaria Ltd., Hungary (Feb 1996 – Dec 1999)

EDUCATION:
- B.Sc. in Computer Science, Eötvös University, Budapest
- M.Sc. in Chemical Engineering, Technical University, Budapest

LANGUAGES:
- Hungarian: Native
- English: Fluent
- German: Advanced

CERTIFICATIONS:
- AI Engineering Fellowship – Outskill (Issued: Mar 2026).
  6-month training, Prompt Engineering, RAGs, Multimodal AI, Agentic AI.
- Agentic AI Engineer – Edureka (Issued: Sep 2025). Certificate ID: PSCEX6LEQ.
  Focus: Agentic AI, Generative AI, intelligent automation using LLMs and orchestration frameworks.

LINKEDIN / INTERESTS:
Tamas is actively posting about Agentic AI, backend optimization, and the intersection of legacy system stability with modern AI automation. He is interested in roles that allow him to bridge the gap between traditional backend engineering and the new wave of AI agents.
`;

export const SYSTEM_INSTRUCTION = `
You are an AI Assistant representing Tamas Deak. Your goal is to professionally screen and engage with potential employers or recruiters.

**Knowledge Base:**
${CV_CONTEXT}

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
`;

// Structured Data for UI
export const EXPERIENCES: Experience[] = [
  {
    role: "AI Engineer",
    company: "FlyRank AI",
    period: "Jul 2026 – Present",
    employmentType: "Internship",
    location: "Remote",
    details: [
      "Backend AI Engineering internship, focusing on hands-on assignments in LLM applications, AI agents, and workflow automation.",
      "Participate in technical webinars and mentoring sessions on AI engineering and software development.",
      "Complete Anthropic certification courses."
    ]
  },
  {
    role: "Software Engineer Backend",
    company: "DERTOUR Group",
    period: "Feb 2026 – Jul 2026",
    employmentType: "Full-time",
    location: "Frankfurt Rhine-Main Metropolitan Area · Remote",
    details: [
      "Maintained and enhanced the backend of an e-commerce platform for travel products.",
      "Improved code quality, stability, and performance.",
      "Collaborated with product and frontend teams in an Agile/SCRUM environment.",
      "Technologies include Kotlin, Spring Boot, REST APIs, PostgreSQL DB, AWS cloud (k8s)."
    ]
  },
  {
    role: "Career Break - AI Upskilling",
    company: "Independent Learning",
    period: "Apr 2025 – Feb 2026",
    details: [
      "Focused on structured learning in applied AI and automation.",
      "Built hands-on projects related to prompt design, RAG pipelines, multimodal AI, and agent-based workflows."
    ]
  },
  {
    role: "Senior Solution Consultant",
    company: "Ericsson",
    period: "Nov 2001 – Apr 2025",
    location: "Germany",
    details: [
      "Led automated testing migration using Python & Robot Framework.",
      "Developed Blockchain Backend (Corda R3) and ECA application using Kotlin & Spring Boot.",
      "Stabilized production environments for international clients (Morocco, Saudi Arabia, Sudan).",
      "Provided on-site support for T-Mobile USA billing modernization."
    ]
  },
  {
    role: "Software Developer",
    company: "SEMA Group Telecom",
    period: "Jan 2000 – Oct 2001",
    details: ["Software development for telecom sector."]
  },
  {
    role: "Software Developer",
    company: "Lufthansa Systems Hungaria",
    period: "Feb 1996 – Dec 1999",
    details: ["Early career software development."]
  }
];

export const SKILLS: SkillCategory[] = [
  {
    category: "AI & Automation",
    skills: ["Agentic AI", "Generative AI", "Prompt Engineering", "Robot Framework", "Selenium", "LLM Orchestration"]
  },
  {
    category: "Programming",
    skills: ["Kotlin", "Java", "Python", "C/C++", "SQL"]
  },
  {
    category: "Frameworks & Tools",
    skills: ["Spring Boot", "REST", "SOAP", "XML", "Git", "Docker"]
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "Oracle DB"]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: "AI Engineering Fellowship",
    issuer: "Outskill",
    issued: "Mar 2026",
    description: "6-month training, Prompt Engineering, RAGs, Multimodal AI, Agentic AI"
  },
  {
    name: "Agentic AI Engineer",
    issuer: "Edureka",
    issued: "Sep 2025",
    id: "PSCEX6LEQ",
    description: "Focus: Agentic AI, Generative AI, and intelligent automation using LLMs and orchestration frameworks."
  }
];