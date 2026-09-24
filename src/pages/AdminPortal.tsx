import React from 'react';
import { useData } from '../context/DataContext';
import { Building2, Users, Activity, ShieldCheck, Server, Globe } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { cases, hospitals, patients, connectionStatus, selectedState, allStates, selectState } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      <div className="card-medical p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              STATE HEALTH ADMINISTRATION
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Ecosystem Infrastructure Dashboard</h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <Server className="w-4 h-4 text-emerald-600" /> WebSocket Server: Port 4000 Operational
          </div>
        </div>

        {/* State Jurisdiction Switcher Bar */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-700 flex items-center gap-1.5 uppercase">
              <Globe className="w-4 h-4 text-red-600" /> Active State Jurisdiction:
            </span>
            <span className="text-slate-500 font-medium">Currently Selected: <strong className="text-slate-900">{selectedState.name}</strong></span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allStates.map((st) => (
              <button
                key={st.id}
                onClick={() => selectState(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                  selectedState.id === st.id
                    ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                📍 {st.name} ({st.district})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">REGISTERED HOSPITALS</span>
            <span className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" /> {hospitals.length}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">COMMUNITY PATIENTS</span>
            <span className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600" /> {patients.length}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">TOTAL CASES TRIAGED</span>
            <span className="text-2xl font-black text-emerald-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" /> {cases.length}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">REALTIME SYNC ENGINE</span>
            <span className="text-2xl font-black text-red-600 flex items-center gap-2 capitalize">
              <ShieldCheck className="w-5 h-5 text-red-600" /> {connectionStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Hospital Capacity Audit Table */}
      <div className="card-medical p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">Hospital Capacity & Emergency Bed Directory ({selectedState.name})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 font-medium">
            <thead className="bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Hospital Name</th>
                <th className="p-3">Facility Type</th>
                <th className="p-3">ICU Beds</th>
                <th className="p-3">Total Beds</th>
                <th className="p-3">Oxygen Supply</th>
                <th className="p-3">Emergency 24x7</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hospitals.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-extrabold text-slate-900">{h.name}</td>
                  <td className="p-3 text-red-700 font-bold">{h.type}</td>
                  <td className="p-3 font-extrabold text-emerald-700">{h.icuBedsAvailable} available</td>
                  <td className="p-3 font-bold text-slate-900">{h.totalBeds}</td>
                  <td className="p-3 text-emerald-700 font-bold">{h.oxygenAvailable ? '✅ Ready' : '❌ Limited'}</td>
                  <td className="p-3 text-red-700 font-bold">{h.emergency24x7 ? '⚡ 24x7 Active' : 'Limited Hours'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
