import React from 'react';
import { EXPERIENCES } from '../constants';

const ExperienceSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-paper-2 border-t border-rule" id="experience" aria-label="Professional Experience">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Handwritten Note */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-accent-wash border border-accent/20 text-accent text-xs font-semibold mb-3">
              CAREER & ARCHITECTURE LEDGER
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-ink tracking-tight">
              Engineering Experience
            </h2>
          </div>
          
          <span className="font-hand text-2xl sm:text-3xl text-accent font-bold transform -rotate-2 select-none">
            20+ years telecom & enterprise backend ⚡
          </span>
        </div>

        {/* Experience Ledger Cards */}
        <div className="space-y-8">
          {EXPERIENCES.map((exp, index) => {
            const tilt = index % 2 === 0 ? 'transform -rotate-0.5' : 'transform rotate-0.5';

            return (
              <div 
                key={index} 
                className={`relative bg-paper-hi border border-rule-2 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-sheet transition-transform duration-300 ${tilt} motion-safe:hover:rotate-0`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-semibold text-ink">
                      {exp.role}
                    </h3>
                    <div className="text-accent font-semibold text-base mt-0.5">
                      {exp.company} {exp.location && <span className="text-muted font-normal">({exp.location})</span>}
                    </div>
                  </div>

                  <span className="text-xs text-ink-2 bg-paper-2 px-3.5 py-1.5 rounded-md border border-rule inline-block w-fit self-start sm:self-auto font-mono font-medium">
                    {exp.period}
                  </span>
                </div>

                {/* Details List */}
                <ul className="mt-4 space-y-2.5 text-sm sm:text-base text-ink-2 leading-relaxed pl-5 list-disc marker:text-accent">
                  {exp.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>

                {/* Callout stamp for primary milestones */}
                {exp.company === 'FlyRank AI' && (
                  <div className="mt-5 pt-4 border-t border-rule flex items-center gap-2">
                    <span className="font-hand text-xl text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 select-none">
                      Active Role: AI Engineering & Agentic Workflows
                    </span>
                  </div>
                )}
                {exp.company === 'DERTOUR Group' && (
                  <div className="mt-5 pt-4 border-t border-rule flex items-center gap-2">
                    <span className="font-hand text-xl text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 select-none">
                      Travel & e-Commerce Backend (Kotlin, Spring Boot, REST)
                    </span>
                  </div>
                )}
                {exp.company === 'Ericsson' && (
                  <div className="mt-5 pt-4 border-t border-rule flex items-center gap-2">
                    <span className="font-hand text-xl text-accent font-bold bg-accent-wash px-3 py-1 rounded-md border border-accent/20 select-none">
                      24-Year Ericsson Tenure: Tech Lead, Billing & Automation
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
