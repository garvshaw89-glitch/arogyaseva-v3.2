import React from 'react';
import { useData } from '../../context/DataContext';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { MapPin, Globe, Activity, HeartPulse } from 'lucide-react';

export const CHWLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedState } = useData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Shared Red & White Header */}
      <Header />

      {/* Sub-Header ASHA Banner */}
      <div className="bg-red-50 border-b border-red-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-600" />
            <span className="font-extrabold text-slate-900">{selectedState.defaultChwName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-red-700 font-extrabold bg-red-100 px-2 py-0.5 rounded-md text-[10px]">
              ASHA Community Field Worker
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" /> {selectedState.defaultVillage} ({selectedState.subCenterName})
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-semibold">
            <Globe className="w-3.5 h-3.5 text-red-600" />
            <span>Jurisdiction: <strong className="text-slate-900 font-extrabold">{selectedState.name} ({selectedState.district})</strong></span>
          </div>
        </div>
      </div>

      {/* Main CHW Workspace */}
      <main className="flex-1">{children}</main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};
