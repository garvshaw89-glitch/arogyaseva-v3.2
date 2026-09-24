import React, { useEffect } from 'react';
import { AlertTriangle, Stethoscope, Activity, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Toast: React.FC = () => {
  const { activeToast, dismissToast } = useData();

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const isEmergency = activeToast.type === 'EMERGENCY';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4">
      <div
        className={`rounded-2xl p-4 shadow-2xl border flex items-start gap-3 relative transition-all ${
          isEmergency
            ? 'bg-red-600 border-red-700 text-white shadow-lg shadow-red-600/30'
            : 'bg-slate-900 border-red-500 text-white shadow-xl'
        }`}
      >
        <div
          className={`p-2 rounded-xl flex-shrink-0 ${
            isEmergency ? 'bg-white/20 text-white animate-pulse' : 'bg-red-600 text-white'
          }`}
        >
          {isEmergency ? (
            <AlertTriangle className="w-6 h-6 text-white" />
          ) : activeToast.type === 'DOCTOR_RESPONSE' ? (
            <Stethoscope className="w-6 h-6 text-white" />
          ) : (
            <Activity className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="flex-1 pr-6">
          <h4 className="font-extrabold text-sm text-white">
            {activeToast.title}
          </h4>
          <p className="text-xs text-white/90 mt-1 leading-relaxed font-semibold">{activeToast.message}</p>
          <span className="text-[10px] text-white/70 mt-1 block font-medium">Realtime Cross-Device Sync</span>
        </div>

        <button
          onClick={dismissToast}
          className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
