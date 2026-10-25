import React from 'react';
import projectsData from '../projects.json';

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string;
  showOnSite: boolean;
}

const PROJECT_BADGES: Record<string, { label: string; highlight: boolean }> = {
  'robot-test-wizard': { label: 'Test Automation 🤖', highlight: true },
  'music-note-reader': { label: 'Neural OMR 🎼', highlight: true },
  'latch': { label: 'PII Guardrail 🛡️', highlight: true },
  'bedtime-stories': { label: 'AI Storytelling ✨', highlight: false },
  'cv-matcher': { label: 'NLP Matcher 🎯', highlight: false },
  'music-analyzer': { label: 'Audio AI 🎵', highlight: false },
};

const ProjectsSection: React.FC = () => {
  const projects: Project[] = (projectsData as Project[]).filter(p => p.showOnSite);

  return (
    <section className="py-20 sm:py-28 bg-paper relative overflow-hidden border-t border-rule" id="projects" aria-label="Featured Projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Handwritten Accent */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-accent-wash border border-accent/20 text-accent text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              LIVE PRODUCTION APPS
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-ink tracking-tight">
              Featured Projects & AI Systems
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-hand text-2xl sm:text-3xl text-accent font-bold transform rotate-2 select-none hidden sm:inline-block">
              live in production 🚀
            </span>
            <a 
              href="https://portfolio.taskmind-ai.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink hover:bg-ink-2 text-paper text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <span>Full Portfolio Hub</span>
              <svg className="w-4 h-4 text-accent-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Tilted Specimen Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
            const tiltClass = idx % 3 === 0 ? 'transform -rotate-1' : idx % 3 === 1 ? 'transform rotate-1' : 'transform -rotate-0.5';
            const badge = PROJECT_BADGES[project.id];

            return (
              <article 
                key={project.id}
                className={`group relative bg-paper-hi border border-rule-2 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-sheet transition-transform duration-300 ${tiltClass} motion-safe:hover:rotate-0 motion-safe:hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                {/* Top Corner Mark / Index */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted font-medium">
                    PRJ-{String(idx + 1).padStart(2, '0')}
                  </span>
                  {badge && (
                    <span className={`font-hand text-xl font-bold px-2.5 py-0.5 rounded-md border select-none ${
                      badge.highlight 
                        ? 'text-accent bg-accent-wash border-accent/25' 
                        : 'text-ink bg-paper-2 border-rule'
                    }`}>
                      {badge.label}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-xl font-display font-semibold text-ink group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-ink-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Actions: Live Demo / LinkedIn Article + GitHub */}
                <div className="pt-4 border-t border-rule flex items-center justify-between">
                  <a 
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-md bg-accent text-accent-ink hover:opacity-90 transition-opacity focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <span>{project.liveUrl.includes('linkedin.com') ? 'LinkedIn Post ↗' : (project.id === 'robot-test-wizard' ? 'Deep Dive ↗' : 'Launch Live ↗')}</span>
                  </a>

                  {project.githubUrl ? (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      <span>Repository</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-muted italic">Production Web Service</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;
