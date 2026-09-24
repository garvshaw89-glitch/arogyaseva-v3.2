import React from 'react';
import { CaseStatus } from '../../types';
import { CheckCircle2, Clock, Activity, Stethoscope, Ambulance, Building2, ShieldCheck } from 'lucide-react';

interface CaseTimelineProps {
  currentStatus: CaseStatus;
}

const STAGES: { status: CaseStatus; label: string; icon: any }[] = [
  { status: 'NEW', label: 'Case Created', icon: Activity },
  { status: 'UNDER_REVIEW', label: 'Doctor Reviewing', icon: Stethoscope },
  { status: 'DOCTOR_RESPONDED', label: 'Advice Received', icon: CheckCircle2 },
  { status: 'REFERRAL_REQUIRED', label: 'Referral Issued', icon: Building2 },
  { status: 'IN_TRANSIT', label: 'In Transit', icon: Ambulance },
  { status: 'AT_HOSPITAL', label: 'Bed Reserved', icon: ShieldCheck }
];

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ currentStatus }) => {
  const getStageIndex = (status: CaseStatus): number => {
    switch (status) {
      case 'NEW': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'DOCTOR_RESPONDED': return 2;
      case 'REFERRAL_REQUIRED': return 3;
      case 'EMERGENCY': return 3;
      case 'IN_TRANSIT': return 4;
      case 'AT_HOSPITAL': return 5;
      case 'COMPLETED': return 5;
      default: return 0;
    }
  };

  const currentIdx = getStageIndex(currentStatus);

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 my-4">
      <h4 className="text-xs font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-red-600" /> Realtime Case Lifecycle Tracker
      </h4>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 relative">
        {STAGES.map((stage, idx) => {
          const isPassed = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = stage.icon;

          return (
            <div key={stage.status} className="flex flex-col items-center text-center group">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-red-600 text-white font-extrabold shadow-md shadow-red-600/30 scale-110'
                    : isPassed
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={`text-[10px] font-extrabold mt-2 leading-tight ${
                  isCurrent ? 'text-red-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
