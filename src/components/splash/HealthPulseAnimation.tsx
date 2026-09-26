import React from 'react';

interface HealthPulseAnimationProps {
  progress: number; // 0 to 1
  symbolRevealed: boolean;
}

export const HealthPulseAnimation: React.FC<HealthPulseAnimationProps> = ({ progress, symbolRevealed }) => {
  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
      
      {/* 1. Subtle Translucent Backdrop Ambient Light Ring */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/20 via-sky-500/10 to-transparent blur-xl transition-opacity duration-700 ${
          progress > 0.2 ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
        }`}
      />

      {/* 2. Precision Glass Circle Container */}
      <div className="relative w-full h-full rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60 shadow-2xl flex items-center justify-center overflow-hidden">
        
        {/* ECG Line Drawing (Frame 02) */}
        {!symbolRevealed && (
          <svg className="w-full h-16 px-3" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grid Line */}
            <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

            {/* Smooth ECG Waveform */}
            <path
              d="M 0 30 L 40 30 L 50 30 L 60 22 L 70 38 L 82 8 L 94 48 L 104 24 L 114 34 L 124 30 L 200 30"
              stroke="url(#ecgGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 300,
                strokeDashoffset: 300 - progress * 300,
                transition: 'stroke-dashoffset 0.05s linear',
              }}
            />

            <defs>
              <linearGradient id="ecgGradient" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Formed Brand Symbol (Frame 03: Heart + Medical Cross + Care Connection) */}
        {symbolRevealed && (
          <div className="relative flex items-center justify-center animate-fadeIn scale-100 transition-all duration-700">
            <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Soft Radial Glow */}
              <circle cx="40" cy="40" r="36" fill="url(#symbolGlow)" opacity="0.3" />

              {/* Heart Outline Path */}
              <path
                d="M 40 64 C 20 48, 12 36, 12 26 C 12 17, 19 10, 28 10 C 33.5 10, 37.5 13, 40 16.5 C 42.5 13, 46.5 10, 52 10 C 61 10, 68 17, 68 26 C 68 36, 60 48, 40 64 Z"
                fill="none"
                stroke="url(#heartGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Centered Precision Medical Cross Symbol */}
              <path
                d="M 40 24 V 44 M 30 34 H 50"
                stroke="#FFFFFF"
                strokeWidth="4.5"
                strokeLinecap="round"
              />

              {/* Care Connection Nodes */}
              <circle cx="28" cy="26" r="3" fill="#38BDF8" />
              <circle cx="52" cy="26" r="3" fill="#38BDF8" />

              <defs>
                <radialGradient id="symbolGlow" cx="40" cy="40" r="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <linearGradient id="heartGrad" x1="12" y1="10" x2="68" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

      </div>
    </div>
  );
};
