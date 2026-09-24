import React from 'react';
import { Hospital } from '../../types';
import { Building2, Navigation, Phone, ShieldCheck, Zap, ArrowUpRight, BedDouble } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  isSelected?: boolean;
  onSelect?: () => void;
  onNavigate?: () => void;
  onReferral?: () => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  isSelected = false,
  onSelect,
  onNavigate,
  onReferral
}) => {
  return (
    <div
      onClick={onSelect}
      className={`card-medical rounded-2xl p-4 transition-all cursor-pointer border ${
        isSelected
          ? 'bg-red-50/50 border-red-600 shadow-md'
          : 'bg-white border-slate-200 hover:border-red-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
              {hospital.type}
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">{hospital.name}</h4>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{hospital.address}</p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-sm font-extrabold text-red-600 block">{hospital.distanceKm ?? 0} km</span>
          <span className="text-[10px] text-slate-500 font-semibold">{hospital.travelTimeMin ?? 0} min drive</span>
        </div>
      </div>

      {/* Hospital Metrics Badges */}
      <div className="grid grid-cols-3 gap-2 my-3 pt-3 border-t border-slate-100 text-[11px]">
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 text-center">
          <span className="text-[9px] text-slate-500 block font-extrabold">ICU BEDS</span>
          <span className="font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
            <BedDouble className="w-3.5 h-3.5 text-emerald-600" /> {hospital.icuBedsAvailable} / {hospital.totalBeds}
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 text-center">
          <span className="text-[9px] text-slate-500 block font-extrabold">OXYGEN</span>
          <span className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> {hospital.oxygenAvailable ? 'Available' : 'Limited'}
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 text-center">
          <span className="text-[9px] text-slate-500 block font-extrabold">EMERGENCY</span>
          <span className="font-bold text-red-700 flex items-center justify-center gap-1 mt-0.5">
            <Zap className="w-3.5 h-3.5 text-red-600" /> 24x7
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onNavigate}
          className="flex-1 py-2 px-3 rounded-xl btn-primary-red text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5 text-white" /> Get Directions
        </button>

        {onReferral && (
          <button
            onClick={onReferral}
            className="py-2 px-3 rounded-xl btn-soft-red text-xs font-bold flex items-center justify-center gap-1"
          >
            Start Referral <ArrowUpRight className="w-3.5 h-3.5 text-red-600" />
          </button>
        )}

        <a
          href={`tel:${hospital.phone}`}
          className="p-2 rounded-xl btn-secondary-slate flex items-center justify-center"
          title="Call Hospital"
        >
          <Phone className="w-4 h-4 text-slate-700" />
        </a>
      </div>
    </div>
  );
};
