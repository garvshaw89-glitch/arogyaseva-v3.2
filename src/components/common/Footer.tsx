import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, ShieldCheck, Globe, Activity, Stethoscope, Building2, ShieldAlert } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { selectedState } = useData();

  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-4 lg:px-8 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">AROGYASEVA</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              National Connected Rural Healthcare, Emergency Referral Triage & Bed Coordination Network.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 w-fit">
              <ShieldCheck className="w-4 h-4" /> Production Grade Architecture
            </div>
          </div>

          {/* Quick Portals */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">System Portals</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/chw" className="hover:text-red-600 flex items-center gap-1.5 transition-colors">
                  <Activity className="w-3.5 h-3.5 text-red-600" /> ASHA CHW Field Portal
                </Link>
              </li>
              <li>
                <Link to="/doctor" className="hover:text-red-600 flex items-center gap-1.5 transition-colors">
                  <Stethoscope className="w-3.5 h-3.5 text-red-600" /> Doctor Tele-Triage
                </Link>
              </li>
              <li>
                <Link to="/hospital" className="hover:text-red-600 flex items-center gap-1.5 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-red-600" /> Hospital ER & ICU Bed Command
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-red-600 flex items-center gap-1.5 transition-colors">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Emergency Triage Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Jurisdiction */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Active State Jurisdiction</h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-red-600" /> {selectedState.name}
              </span>
              <p className="text-[11px] text-slate-500">{selectedState.district} Regional Command</p>
              <p className="text-[10px] text-slate-400 font-mono">Center: {selectedState.latitude}, {selectedState.longitude}</p>
            </div>
          </div>

          {/* Emergency Hotline */}
          <div className="space-y-3 text-xs md:col-span-1">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">National Emergency Dispatch</h4>
            <a
              href="tel:108"
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all text-sm"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" /> Call Ambulance 108
            </a>
            <p className="text-[11px] text-slate-400 text-center">24x7 Realtime Emergency Response active</p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 ArogyaSeva Connected Healthcare Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Privacy Standard</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>WebSocket Live Sync (Port 4000)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
