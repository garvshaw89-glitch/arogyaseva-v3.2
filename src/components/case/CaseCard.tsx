import React from 'react';
import { ClinicalCase, CaseStatus } from '../../types';
import { Activity, Stethoscope, Clock, MapPin, ChevronRight, ShieldAlert } from 'lucide-react';

interface CaseCardProps {
  clinicalCase: ClinicalCase;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const getStatusBadge = (status: CaseStatus) => {
  switch (status) {
    case 'NEW':
      return { label: 'NEW CASE', color: 'bg-red-50 text-red-700 border-red-200' };
    case 'UNDER_REVIEW':
      return { label: 'UNDER REVIEW', color: 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse' };
    case 'DOCTOR_RESPONDED':
      return { label: 'DOCTOR RESPONDED', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'REFERRAL_REQUIRED':
      return { label: 'REFERRAL REQUIRED', color: 'bg-red-100 text-red-800 border-red-300' };
    case 'EMERGENCY':
      return { label: 'EMERGENCY', color: 'bg-red-600 text-white border-red-700 animate-pulse' };
    case 'IN_TRANSIT':
      return { label: 'IN TRANSIT', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    case 'AT_HOSPITAL':
      return { label: 'AT HOSPITAL', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    case 'COMPLETED':
      return { label: 'COMPLETED', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-700' };
  }
};

export const CaseCard: React.FC<CaseCardProps> = ({ clinicalCase, isSelected = false, onSelect }) => {
  const badge = getStatusBadge(clinicalCase.status);
  const isEmergency = clinicalCase.urgency === 'CRITICAL' || clinicalCase.status === 'EMERGENCY';

  return (
    <div
      onClick={onSelect}
      className={`card-medical p-4 transition-all cursor-pointer border relative overflow-hidden ${
        isSelected
          ? 'bg-white border-red-600 shadow-md ring-2 ring-red-500/20'
          : isEmergency
          ? 'bg-red-50/40 border-red-300 hover:border-red-500'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Bar Badges */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${badge.color}`}>
          {badge.label}
        </span>

        <span
          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
            clinicalCase.urgency === 'CRITICAL'
              ? 'bg-red-600 text-white'
              : clinicalCase.urgency === 'URGENT'
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {clinicalCase.urgency} URGENCY
        </span>
      </div>

      {/* Patient Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5 leading-snug">
            {isEmergency && <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />}
            {clinicalCase.patientName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-medium">
            <span>{clinicalCase.patientAge}y, {clinicalCase.patientGender}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700 font-bold"><MapPin className="w-3 h-3 text-red-600" /> {clinicalCase.patientVillage}</span>
          </p>
        </div>

        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
          <Clock className="w-3 h-3 text-slate-400" /> {new Date(clinicalCase.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Chief Complaint */}
      <p className="text-xs text-slate-800 font-medium mt-2.5 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        "{clinicalCase.symptoms.chiefComplaint}"
      </p>

      {/* Vitals Summary Pill Bar */}
      <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2 border-t border-slate-100 text-[10px] font-extrabold text-center">
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-400 block text-[9px] uppercase">BP</span>
          <span className="text-slate-900">{clinicalCase.vitals.bloodPressureSys}/{clinicalCase.vitals.bloodPressureDia}</span>
        </div>
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-400 block text-[9px] uppercase">HR</span>
          <span className="text-slate-900">{clinicalCase.vitals.heartRate} bpm</span>
        </div>
        <div className={`p-1.5 rounded-lg border ${clinicalCase.vitals.spO2 < 92 ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-50 text-emerald-700 border-slate-200'}`}>
          <span className="block text-[9px] uppercase">SpO2</span>
          <span>{clinicalCase.vitals.spO2}%</span>
        </div>
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-400 block text-[9px] uppercase">TEMP</span>
          <span className="text-amber-700">{clinicalCase.vitals.temperature}°F</span>
        </div>
      </div>

      {/* Doctor Response Indicator */}
      {clinicalCase.doctorResponse && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-red-700 font-extrabold flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-red-600" /> Doctor Advice Transmitted
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      )}
    </div>
  );
};
