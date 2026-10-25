import React, { useState } from 'react';

interface CaptchaProps {
  onVerify: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleCheckboxClick = () => {
    if (isLoading || isVerified) return;

    setIsChecked(true);
    setIsLoading(true);

    // Simulate browser analysis delay
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      setTimeout(() => {
        onVerify();
      }, 500); // Small delay to let user see the green checkmark
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleCheckboxClick();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-paper-2 border border-rule rounded-xl max-w-sm mx-auto shadow-sm select-none">
      <div className="flex items-center space-x-3.5">
        {/* Accessible Checkbox button wrapper */}
        <div 
          role="checkbox"
          tabIndex={0}
          aria-checked={isVerified}
          aria-busy={isLoading}
          aria-label="I am not a robot verification checkbox"
          onClick={handleCheckboxClick}
          onKeyDown={handleKeyDown}
          className={`w-7 h-7 flex items-center justify-center rounded-md border-2 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
            isVerified 
              ? 'border-emerald-500 bg-emerald-50' 
              : isChecked 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
        >
          {isLoading && (
            <svg className="animate-spin h-4.5 w-4.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label="Verifying">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}

          {isVerified && (
            <svg className="h-5 w-5 text-emerald-600 animate-[scaleIn_0.2s_ease-out]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Verified">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
          )}

          {!isLoading && !isVerified && (
            <div className="w-3 h-3 rounded bg-transparent group-hover:bg-slate-100 transition-colors" />
          )}
        </div>

        <span className="text-sm font-semibold text-slate-700">
          I am not a robot
        </span>
      </div>

      {/* Turnstile/reCAPTCHA logo mockup */}
      <div className="flex flex-col items-center justify-center text-[10px] text-slate-400 pl-4 border-l border-slate-200" aria-hidden="true">
        <svg className="w-6 h-6 text-blue-500 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
        </svg>
        <span className="font-medium tracking-tight">Security</span>
      </div>
    </div>
  );
};

export default Captcha;
