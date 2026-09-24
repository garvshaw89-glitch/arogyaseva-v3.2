import React from 'react';
import { RouteResult } from '../../services/routingService';
import { Compass, ExternalLink, Clock, Route, CheckCircle2, X } from 'lucide-react';

interface RouteDetailsPaneProps {
  route: RouteResult;
  hospitalName: string;
  onClose?: () => void;
}

export const RouteDetailsPane: React.FC<RouteDetailsPaneProps> = ({ route, hospitalName, onClose }) => {
  return (
    <div className="card-medical rounded-2xl p-5 border border-slate-200 shadow-xl space-y-4 bg-white">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
            Navigation Route
          </span>
          <h3 className="font-extrabold text-base text-slate-900 mt-1">To: {hospitalName}</h3>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Metric Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-extrabold">TOTAL DISTANCE</span>
            <span className="font-extrabold text-base text-slate-900">{route.distanceKm} km</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-extrabold">ESTIMATED TIME</span>
            <span className="font-extrabold text-base text-emerald-700">{route.durationMin} mins</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Directions */}
      <div>
        <h4 className="font-extrabold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-red-600" /> Turn-by-Turn Directions
        </h4>

        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
          {route.steps.map((step, idx) => (
            <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-900 font-bold capitalize flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                {step.instruction}
              </span>
              <span className="text-[10px] text-slate-500 font-extrabold ml-2 flex-shrink-0">{step.distanceMeters} m</span>
            </div>
          ))}
        </div>
      </div>

      {/* External Map Navigation Handoff */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
        <a
          href={route.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-4 rounded-xl btn-primary-red font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs"
        >
          <ExternalLink className="w-4 h-4 text-white" /> Open in Google Maps
        </a>

        <a
          href={route.wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-4 rounded-xl btn-secondary-slate font-extrabold text-xs flex items-center justify-center gap-1.5"
        >
          Open in Waze
        </a>
      </div>
    </div>
  );
};
