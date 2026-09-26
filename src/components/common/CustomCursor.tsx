import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices (phones/tablets)
    if (typeof window !== 'undefined') {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        setIsTouchDevice(true);
        return;
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], [data-cursor="pointer"]')
        );
        setIsHovered(isInteractive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  // Smooth lerp / spring lag for outer cursor ring
  useEffect(() => {
    if (isTouchDevice || !isVisible) return;
    let animationFrameId: number;

    const followCursor = () => {
      setRingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animationFrameId = requestAnimationFrame(followCursor);
    };

    animationFrameId = requestAnimationFrame(followCursor);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isVisible, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Precision Inner Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0) scale(${isClicking ? 0.6 : 1})`,
        }}
      >
        <div className="w-2 h-2 rounded-full bg-red-600 shadow-sm shadow-red-600/50" />
      </div>

      {/* Spring Interpolated Outer Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full border transition-all duration-200 ${
          isHovered
            ? 'w-10 h-10 border-red-500/80 bg-red-500/10 scale-125'
            : 'w-8 h-8 border-slate-400/50 bg-transparent'
        } ${isClicking ? 'scale-90 opacity-70' : ''}`}
        style={{
          transform: `translate3d(${ringPosition.x - (isHovered ? 20 : 16)}px, ${
            ringPosition.y - (isHovered ? 20 : 16)
          }px, 0)`,
        }}
      />
    </>
  );
};
