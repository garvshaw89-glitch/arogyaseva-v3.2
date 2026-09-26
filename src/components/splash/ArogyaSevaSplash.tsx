import React, { useEffect, useState } from 'react';
import { HealthPulseAnimation } from './HealthPulseAnimation';
import { MedicalNetwork3D } from './MedicalNetwork3D';

interface ArogyaSevaSplashProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export const ArogyaSevaSplash: React.FC<ArogyaSevaSplashProps> = ({ onComplete, forcePlay = false }) => {
  const [frame, setFrame] = useState<number>(1);
  const [ecgProgress, setEcgProgress] = useState<number>(0);
  const [symbolFormed, setSymbolFormed] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check Accessibility reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }

    // FRAME 01 -> 02: Initial Light point to ECG Waveform (0.4s)
    const t1 = setTimeout(() => {
      setFrame(2);
    }, 350);

    // Animate ECG Line drawing
    let startTime: number | null = null;
    let animId: number;

    const animateEcg = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 900, 1); // 0.9s duration
      setEcgProgress(progress);

      if (progress < 1) {
        animId = requestAnimationFrame(animateEcg);
      } else {
        // FRAME 03: Symbol Formation (1.2s)
        setSymbolFormed(true);
        setFrame(3);
      }
    };

    const t2 = setTimeout(() => {
      animId = requestAnimationFrame(animateEcg);
    }, 450);

    // FRAME 04: Brand Name Reveal AROGYASEVA (1.5s)
    const t3 = setTimeout(() => {
      setFrame(4);
    }, 1500);

    // FRAME 05: Tagline Reveal (2.1s)
    const t4 = setTimeout(() => {
      setFrame(5);
    }, 2100);

    // EXIT TRANSITION: Smooth Scale Down & Transition out (2.7s)
    const t5 = setTimeout(() => {
      setIsExiting(true);
    }, 2650);

    const t6 = setTimeout(() => {
      onComplete();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [onComplete]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center text-white p-4">
        <div className="text-center space-y-2 animate-fadeIn">
          <h1 className="text-3xl font-black tracking-wider text-white">AROGYA<span className="text-red-600">SEVA</span></h1>
          <p className="text-xs text-slate-400 font-medium">Connecting Care. Improving Lives.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#090D16] flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ease-out select-none ${
        isExiting ? 'opacity-0 scale-105 backdrop-blur-none pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 3D Background Medical Network Layer */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <MedicalNetwork3D className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px]" />
      </div>

      {/* Frame 01: Center Point of Light (Care Origin) */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        
        {frame === 1 && (
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shadow-lg shadow-red-600/80" />
        )}

        {/* Frame 02 & 03: ECG Waveform & Symbol Morphing */}
        {frame >= 2 && (
          <div className="transition-transform duration-500 transform hover:scale-105">
            <HealthPulseAnimation progress={ecgProgress} symbolRevealed={symbolFormed} />
          </div>
        )}

        {/* Frame 04: Brand Name Reveal AROGYASEVA */}
        {frame >= 4 && (
          <div className="text-center space-y-2 animate-fadeIn pt-2">
            <div className="flex items-center justify-center gap-1.5 tracking-wider">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">AROGYA</span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-600 tracking-tight">SEVA</span>
            </div>

            {/* Frame 05: Tagline Reveal */}
            {frame >= 5 && (
              <p className="text-xs sm:text-sm text-slate-400 font-extrabold tracking-widest uppercase animate-fadeIn pt-1">
                Connecting Care. Improving Lives.
              </p>
            )}
          </div>
        )}

        {/* Network Connection Nodes Bar */}
        {frame >= 4 && (
          <div className="flex items-center gap-2 pt-4 text-[10px] font-extrabold text-slate-400 tracking-wide uppercase opacity-80 animate-fadeIn">
            <span>Patient</span>
            <span className="text-red-500">➔</span>
            <span>CHW</span>
            <span className="text-red-500">➔</span>
            <span>Doctor</span>
            <span className="text-red-500">➔</span>
            <span>Hospital ER</span>
          </div>
        )}

      </div>
    </div>
  );
};
