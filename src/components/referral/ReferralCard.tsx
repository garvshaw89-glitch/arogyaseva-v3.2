import React from 'react';
import { Referral } from '../../types';
import { Building2, Navigation, Ambulance, Clock } from 'lucide-react';

interface ReferralCardProps {
  referral: Referral;
  onNavigate?: () => void;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ referral, onNavigate }) => {
  return (
    <div className="card-medical rounded-2xl p-4 border border-slate-200 hover:border-red-300 transition-all space-y-3 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            {referral.status}
          </span>
          <h4 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">Patient: {referral.patientName}</h4>
          <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1 font-medium">
            <Building2 className="w-3.5 h-3.5 text-red-600" /> {referral.hospitalName}
          </p>
        </div>

        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {new Date(referral.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <p className="text-xs text-slate-800 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        "{referral.reason}"
      </p>

      {referral.transitVehicleType && (
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-700">
          <span className="flex items-center gap-1.5 font-bold text-red-600">
            <Ambulance className="w-4 h-4 text-red-600" /> {referral.transitVehicleType}
          </span>

          {onNavigate && (
            <button
              onClick={onNavigate}
              className="py-1 px-3 rounded-lg btn-primary-red text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs"
            >
              <Navigation className="w-3 h-3 text-white" /> Navigate
            </button>
          )}
        </div>
      )}
    </div>
  );
};
