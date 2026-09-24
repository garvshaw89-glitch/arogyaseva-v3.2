import React, { useEffect, useRef } from 'react';

interface PulseVitalsCanvasProps {
  bpm?: number;
  isEmergency?: boolean;
  className?: string;
}

export const PulseVitalsCanvas: React.FC<PulseVitalsCanvasProps> = ({
  bpm = 78,
  isEmergency = false,
  className = 'w-full h-32'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const points: number[] = [];
    const maxPoints = 300;

    const lineColor = isEmergency ? '#EF4444' : '#00F2FE';
    const glowColor = isEmergency ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 242, 254, 0.35)';

    const render = () => {
      animId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Generate ECG P-Q-R-S-T wave pattern
      x += (bpm / 60) * 2;
      const cycle = x % 100;
      let y = centerY;

      if (cycle > 35 && cycle < 40) {
        y = centerY - 12; // P wave
      } else if (cycle >= 42 && cycle < 45) {
        y = centerY + 8; // Q wave
      } else if (cycle >= 45 && cycle < 52) {
        y = centerY - (isEmergency ? 48 : 36); // R wave peak
      } else if (cycle >= 52 && cycle < 56) {
        y = centerY + 18; // S wave dip
      } else if (cycle >= 65 && cycle < 75) {
        y = centerY - 14; // T wave
      }

      points.push(y);
      if (points.length > maxPoints) {
        points.shift();
      }

      // Draw ECG wave
      ctx.beginPath();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.5;

      const stepX = width / maxPoints;
      for (let i = 0; i < points.length; i++) {
        const px = i * stepX;
        const py = points[i];
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [bpm, isEmergency]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} width={600} height={160} className="w-full h-full rounded-xl bg-slate-950/80 border border-white/10" />
    </div>
  );
};
