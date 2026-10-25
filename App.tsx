import React, { useState, useEffect } from 'react';
import ChatWidget from './components/ChatWidget';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import { FlyRankBadge } from './components/FlyRankBadge';
import { CERTIFICATIONS } from './constants';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink antialiased selection:bg-accent/15 selection:text-accent font-sans">
      
      {/* Skip to Main Content Link (WCAG 2.1) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-ink focus:rounded-md focus:shadow-lg focus:font-semibold focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Status Masthead */}
      <div className="bg-paper-2 border-b border-rule py-1.5 px-4 text-xs text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-ink">Open to Senior AI Consulting & Backend Architecture</span>
            <span className="text-rule-2">•</span>
            <span>Hessen, Germany & Remote Worldwide</span>
          </div>
          <div className="flex items-center gap-4 text-muted hidden sm:flex">
            <span>Enterprise Stability</span>
            <span>•</span>
            <span>Agentic Automation</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Identity Brand */}
            <div className="flex items-center gap-3.5">
              <div className="relative group transform -rotate-2 motion-safe:hover:rotate-0 transition-transform duration-200">
                <img 
                  src="/icon.svg" 
                  alt="TD Monogram Logo" 
                  className="w-10 h-10 rounded-xl shadow-sm border border-rule bg-paper-hi p-1" 
                  width="40" 
                  height="40" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-semibold text-ink tracking-tight leading-none">
                  Tamas Deak
                </span>
                <span className="text-xs text-muted font-normal mt-1">
                  Senior Solution Consultant & Agentic AI Engineer
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
              <a href="#about" className="text-ink-2 hover:text-accent font-medium text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-accent rounded-sm">About</a>
              <a href="#projects" className="text-ink-2 hover:text-accent font-medium text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-accent rounded-sm">Projects</a>
              <a href="#experience" className="text-ink-2 hover:text-accent font-medium text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-accent rounded-sm">Experience</a>
              <a href="#skills" className="text-ink-2 hover:text-accent font-medium text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-accent rounded-sm">Skills</a>
              <a href="#credentials" className="text-ink-2 hover:text-accent font-medium text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-accent rounded-sm">Credentials</a>
              
              <a 
                href="https://www.linkedin.com/in/tdeak67" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2.5 rounded-lg bg-accent hover:opacity-95 text-accent-ink font-semibold text-sm shadow-key-accent transition-transform duration-150 motion-safe:hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center gap-2"
              >
                <span>LinkedIn Profile</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
                className="text-ink hover:text-accent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav id="mobile-menu" aria-label="Mobile Navigation" className="md:hidden bg-paper-hi border-t border-rule px-4 pt-3 pb-5 space-y-2.5">
            <a href="#about" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-ink hover:text-accent">About</a>
            <a href="#projects" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-ink hover:text-accent">Projects</a>
            <a href="#experience" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-ink hover:text-accent">Experience</a>
            <a href="#skills" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-ink hover:text-accent">Skills</a>
            <a href="#credentials" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-ink hover:text-accent">Credentials</a>
            <a href="https://www.linkedin.com/in/tdeak67" onClick={closeMobileMenu} target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-base font-bold text-accent">LinkedIn Profile</a>
          </nav>
        )}
      </header>

      {/* Main Page Layout */}
      <main id="main-content" className="flex-grow">
        
        {/* Hero Section: Technical Feature Ledger & Tilted Workbench Card */}
        <section id="about" className="relative py-16 sm:py-24 lg:py-28 overflow-hidden bg-paper technical-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Title & Architectural Mission */}
              <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
                
                {/* Technical Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-accent-wash border border-accent/20 text-accent text-xs font-semibold tracking-wide">
                  <span>ENTERPRISE SYSTEMS ARCHITECT & AGENTIC AI</span>
                </div>

                {/* Primary Headline (Clean, No Underlines, Vibrant Cobalt Accent) */}
                <div className="relative">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-tight text-ink leading-[1.04]">
                    Senior Solution Consultant <br className="hidden sm:inline" />
                    <span className="text-accent font-semibold">
                      & Agentic AI Engineer
                    </span>
                  </h1>
                  
                  {/* Handwritten Callout Note */}
                  <span className="hidden sm:block absolute -top-8 right-6 font-hand text-2xl sm:text-3xl text-accent font-bold transform -rotate-3 select-none">
                    30+ years backend excellence! ⚡
                  </span>
                </div>

                {/* Lede Sentence */}
                <p className="text-lg sm:text-xl text-ink-2 font-normal leading-relaxed max-w-2xl">
                  With over 20 years of backend engineering at industry leaders like Ericsson, I bridge high-availability enterprise architecture with modern Agentic AI, RAG pipelines, and deterministic automation.
                </p>

                {/* Primary Actions */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start items-center">
                  <a 
                    href="#projects" 
                    className="px-8 py-3.5 rounded-lg bg-accent hover:opacity-95 text-accent-ink font-semibold text-base shadow-key-accent transition-transform duration-150 motion-safe:hover:-translate-y-0.5 text-center w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    Explore Featured Projects
                  </a>
                  <a 
                    href="#experience" 
                    className="px-8 py-3.5 rounded-lg bg-paper-hi hover:bg-paper-2 text-ink border border-rule-2 font-semibold text-base shadow-key transition-transform duration-150 motion-safe:hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    View Engineering Ledger
                  </a>
                </div>

              </div>

              {/* Right Column: Tilted Profile Specimen Workbench */}
              <div className="lg:col-span-5 flex justify-center relative">
                
                {/* Floating Handwritten Sticky Note */}
                <div className="absolute -top-7 -left-2 z-20 bg-sticky border border-sticky-border px-4 py-2 rounded-xl shadow-md transform -rotate-4 hidden sm:block select-none">
                  <p className="font-hand text-2xl text-ink font-bold leading-none">
                    yes, that’s me! 👋
                  </p>
                </div>

                {/* Tilted Profile Card with High-Resolution Image */}
                <div className="relative group w-full max-w-sm transform -rotate-2 motion-safe:hover:rotate-0 transition-transform duration-300">
                  <div className="bg-paper-hi p-6 rounded-3xl shadow-sheet border border-rule-2 space-y-4">
                    
                    {/* High-Resolution Headshot */}
                    <div className="aspect-square w-full rounded-2xl overflow-hidden bg-paper-2 border border-rule">
                      <img 
                        src="/me_2025.jpg"
                        srcSet="/me_2025.jpg 1x, /me_2025.jpg 2x"
                        alt="Tamas Deak - Senior Solution Consultant & Agentic AI Engineer" 
                        className="w-full h-full object-cover object-center"
                        width="480"
                        height="480"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    
                    {/* Card Meta & Domain */}
                    <div className="pt-2 border-t border-rule flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-display font-semibold text-ink tracking-tight">
                          Tamas Deak
                        </h3>
                        <p className="text-xs font-medium text-accent">
                          Senior Solution Consultant
                        </p>
                      </div>
                      
                      {/* Handwritten Domain Tag */}
                      <span className="font-hand text-2xl text-ink font-bold bg-accent-wash px-3.5 py-1 rounded-lg border border-accent/20 select-none">
                        tdeak67.com
                      </span>
                    </div>

                    {/* Quick Specs Strip */}
                    <div className="pt-3 border-t border-rule/60 text-xs text-muted space-y-1">
                      <p><span className="font-semibold text-ink">Core stack:</span> Kotlin, Python, Java, Spring Boot</p>
                      <p><span className="font-semibold text-ink">AI automation:</span> Agentic AI, RAG pipelines, Orchestration</p>
                    </div>

                  </div>
                </div>

              </div>

            </div>

            {/* Core Performance & Experience Ledger (4-column figures) */}
            <div className="mt-20 pt-8 border-t border-b border-rule grid grid-cols-2 md:grid-cols-4 gap-8 py-6 text-center sm:text-left">
              <div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-accent">30+</p>
                <p className="text-xs text-muted font-medium mt-1">Years engineering</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-ink">24</p>
                <p className="text-xs text-muted font-medium mt-1">Years at Ericsson</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-accent">2</p>
                <p className="text-xs text-muted font-medium mt-1">AI certifications</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-ink">6</p>
                <p className="text-xs text-muted font-medium mt-1">Live AI deployments</p>
              </div>
            </div>

          </div>
        </section>

        {/* Featured Projects with Interactive Tilted Specimen Cards */}
        <ProjectsSection />

        {/* Professional Experience Timeline & Ledger */}
        <ExperienceSection />
        
        {/* Technical Expertise */}
        <SkillsSection />
        
        {/* Certifications and Verified Credentials */}
        <section id="credentials" className="py-20 sm:py-28 bg-paper-2 border-t border-rule" aria-label="Certifications and Credentials">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <div className="relative inline-block mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-semibold text-ink tracking-tight">
                Certifications & Credentials
              </h2>
              <span className="font-hand text-2xl text-accent absolute -top-6 -right-12 transform rotate-6 hidden sm:block select-none">
                verified 📜
              </span>
            </div>

            {/* Tilted Certification Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
              {CERTIFICATIONS.map((cert, index) => {
                const tilt = index % 2 === 0 ? 'transform -rotate-1' : 'transform rotate-1';

                return (
                  <div 
                    key={cert.name} 
                    className={`bg-paper-hi p-6 sm:p-8 rounded-3xl shadow-sm border border-rule hover:shadow-sheet transition-transform duration-300 ${tilt} motion-safe:hover:rotate-0 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-accent-wash text-accent border border-accent/20">
                          {cert.issuer}
                        </span>
                        <span className="text-xs text-muted font-mono">{cert.issued}</span>
                      </div>
                      <p className="text-xl font-display font-semibold text-ink mt-2">{cert.name}</p>
                      {cert.id && <p className="text-xs text-accent mt-1 mb-2">Credential ID: <span className="font-mono">{cert.id}</span></p>}
                      <p className="text-ink-2 text-sm leading-relaxed mt-2">{cert.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FlyRank Verified Credential Highlight */}
            <div className="flex justify-center pt-2">
              <FlyRankBadge variant="banner" theme="light" firstName="Tamas" fullName="Tamas Deak" track="General AI Fluency" cohort="2026" />
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-ink text-paper py-14 border-t border-rule" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-xl text-paper tracking-tight">Tamas Deak</span>
              <span className="text-muted">•</span>
              <span className="text-xs text-accent-2 font-medium">tdeak67.com</span>
            </div>
            <p className="text-xs text-paper-3">Senior Solution Consultant & Agentic AI Engineer • Dietzenbach, Hessen, Germany</p>
            <p className="text-xs text-muted">© {new Date().getFullYear()} Tamas Deak.</p>
          </div>

          {/* FlyRank Graduate Verification Badge in Footer */}
          <div className="flex justify-center">
            <FlyRankBadge variant="banner" theme="dark" firstName="Tamas" fullName="Tamas Deak" track="General AI Fluency" cohort="2026" />
          </div>

          <div className="flex items-center space-x-6 text-sm font-medium">
            <a href="mailto:t_deak@hotmail.com" className="text-paper-2 hover:text-paper transition-colors">Email</a>
            <a href="https://www.linkedin.com/in/tdeak67" target="_blank" rel="noopener noreferrer" className="text-paper-2 hover:text-paper transition-colors">LinkedIn</a>
            <a href="https://github.com/tdeak67" target="_blank" rel="noopener noreferrer" className="text-paper-2 hover:text-paper transition-colors">GitHub</a>
          </div>

        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default App;
