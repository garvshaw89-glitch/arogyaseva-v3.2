import React from 'react';
import { HeartPulse } from 'lucide-react';

export const LoadingIndicator: React.FC<{ label?: string }> = ({ label = 'Connecting Realtime Medical Telemetry...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="relative w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shadow-md">
        <HeartPulse className="w-6 h-6 text-red-600 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-600 animate-ping" />
      </div>
      <p className="text-xs font-extrabold text-slate-700 tracking-wide">{label}</p>
    </div>
  );
};
