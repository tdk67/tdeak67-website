import React from 'react';

interface FlyRankBadgeProps {
  variant?: 'banner' | 'card' | 'chip';
  theme?: 'dark' | 'light';
  firstName?: string;
  fullName?: string;
  track?: string;
  cohort?: string;
  credentialId?: string;
  className?: string;
}

export const FlyRankBadge: React.FC<FlyRankBadgeProps> = ({
  variant = 'banner',
  theme = 'light',
  firstName = 'Tamas',
  fullName = 'Tamas Deak',
  track = 'General AI Fluency',
  cohort = '2026',
  credentialId,
  className = '',
}) => {
  // Construct verification URL
  const queryParams = new URLSearchParams();
  if (credentialId) queryParams.set('id', credentialId);
  if (firstName) queryParams.set('first_name', firstName);
  const verifyUrl = `https://internship.flyrank.ai/verify${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const GLYPH_PATH = "M28.2354 74.2202V67.9039C29.6419 68.4369 31.3724 68.7055 33.4311 68.7055C35.3235 68.7055 36.8153 68.2396 37.8979 67.3079C38.9805 66.3762 39.9566 64.8695 40.8218 62.792L42.6887 58.3139L29.8976 29.2879C35.0038 29.2879 39.6028 32.3307 41.5294 36.9893L47.0746 50.3985L56.0126 28.6038C57.9221 23.9452 62.5168 20.894 67.6187 20.894L50.0795 63.5936C48.4556 67.5933 46.5205 70.5102 44.2743 72.3484C42.0281 74.1867 39.1169 75.1058 35.5451 75.1058C32.6212 75.1058 30.1875 74.812 28.2354 74.2244V74.2202Z";
  const GLYPH_BOX = "26 18 44 60";

  const isDark = theme === 'dark';

  if (variant === 'chip') {
    return (
      <a
        href={verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Verify ${fullName}’s FlyRank AI Internship credential`}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-transform motion-safe:hover:scale-105 ${
          isDark 
            ? 'bg-slate-900 border border-emerald-500/30 text-white shadow-sm hover:border-emerald-400' 
            : 'bg-paper-hi border border-rule text-ink shadow-sm hover:border-emerald-600'
        } ${className}`}
      >
        <svg width="12" height="16" viewBox={GLYPH_BOX} fill="none" className="shrink-0">
          <path d={GLYPH_PATH} fill={isDark ? '#54E399' : '#047857'} />
        </svg>
        <span>FlyRank verified</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-emerald-500">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7.9 12.3l2.8 2.8 5.4-5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    );
  }

  if (variant === 'card') {
    return (
      <a
        href={verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Verify ${fullName}’s FlyRank AI Internship credential`}
        className={`flex flex-col p-5 rounded-2xl border transition-colors duration-200 hover:shadow-sheet ${
          isDark
            ? 'bg-slate-900 border-emerald-500/20 text-white'
            : 'bg-paper-hi border-rule text-ink shadow-sm'
        } ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-400 text-slate-900' : 'bg-slate-900 text-emerald-400'}`}>
              <svg width="20" height="20" viewBox="0 0 96 96" fill="none">
                <path d={GLYPH_PATH} fill="currentColor" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-emerald-600">
              FlyRank AI
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-emerald-500">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7.9 12.3l2.8 2.8 5.4-5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-rule/50">
          <p className="text-base font-bold text-ink tracking-tight">{fullName}</p>
          <p className="text-xs font-semibold text-emerald-600 mt-0.5">{track}</p>
          {cohort && <p className="text-[11px] text-muted mt-0.5">{cohort} Cohort</p>}
        </div>

        <div className="mt-4 pt-3 border-t border-rule/50 flex items-center justify-between text-xs text-muted">
          <span className="text-emerald-700 font-medium">Verify credential</span>
          <span>↗</span>
        </div>
      </a>
    );
  }

  // Default: Banner variant
  return (
    <a
      href={verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Verify ${fullName}’s FlyRank AI Internship credential`}
      className={`inline-flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-transform duration-200 motion-safe:hover:scale-[1.02] ${
        isDark
          ? 'bg-slate-800 border-emerald-500/25 text-white hover:border-emerald-400 shadow-sm'
          : 'bg-paper-hi border-rule text-ink hover:border-emerald-500 shadow-sm'
      } ${className}`}
    >
      <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${isDark ? 'bg-emerald-400 text-slate-900' : 'bg-slate-900 text-emerald-400'}`}>
        <svg width="24" height="24" viewBox="0 0 96 96" fill="none">
          <path d={GLYPH_PATH} fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span className={`text-[11px] font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
          FlyRank AI Internship
        </span>
        <span className={`text-sm font-bold tracking-tight leading-snug ${isDark ? 'text-white' : 'text-ink'}`}>
          Verified Credential
        </span>
        <span className={`text-[11px] leading-none mt-0.5 ${isDark ? 'text-slate-400' : 'text-muted'}`}>
          {track} • {cohort}
        </span>
      </div>

      <div className="ml-auto pl-2 shrink-0">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0 text-emerald-600">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7.9 12.3l2.8 2.8 5.4-5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Verify
        </span>
      </div>
    </a>
  );
};
