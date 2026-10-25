export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  employmentType?: string;
  location?: string;
  details: string[];
}

export interface Education {
  degree: string;
  institution: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  issued: string;
  id?: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string;
  showOnSite: boolean;
}
