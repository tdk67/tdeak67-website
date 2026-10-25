import React from 'react';
import { SKILLS } from '../constants';

const SkillsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-paper border-t border-rule relative overflow-hidden" id="skills" aria-label="Technical Expertise">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-accent-wash border border-accent/20 text-accent text-xs font-semibold mb-3">
              TECHNICAL MATRIX
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-ink tracking-tight">
              Technical Expertise
            </h2>
          </div>
          
          <span className="font-hand text-2xl sm:text-3xl text-accent font-bold transform rotate-1 select-none">
            production systems & deep architecture 🛠️
          </span>
        </div>

        {/* Categories Grid with Subtle Organic Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SKILLS.map((category, idx) => {
            const tilt = idx % 2 === 0 ? 'transform -rotate-1' : 'transform rotate-1';

            return (
              <div 
                key={category.category} 
                className={`bg-paper-hi rounded-3xl p-6 sm:p-8 shadow-sm border border-rule-2 hover:shadow-sheet transition-transform duration-300 ${tilt} motion-safe:hover:rotate-0`}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-display font-semibold text-ink">
                    {category.category}
                  </h3>
                  <span className="text-xs text-muted">
                    {category.skills.length} skills
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3.5 py-1.5 bg-paper-2 text-ink text-xs sm:text-sm font-medium rounded-lg border border-rule hover:border-accent hover:text-accent transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
