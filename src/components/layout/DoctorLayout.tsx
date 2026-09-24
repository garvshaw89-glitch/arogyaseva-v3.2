import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { Stethoscope, Building2, UserCheck, UserX, Globe } from 'lucide-react';

export const DoctorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const { selectedState } = useData();

  const isDoctorOnline = user?.availabilityStatus !== 'offline';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Shared App Header */}
      <Header />

      {/* Doctor Sub-Header Banner */}
      <div className="bg-red-50 border-b border-red-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-700">
          
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-red-600" />
            <span className="font-extrabold text-slate-900">{user?.name || 'Dr. Anand Sharma, MD'}</span>
            <span className="text-slate-400">•</span>
            <span className="text-red-700 font-extrabold bg-red-100 px-2 py-0.5 rounded-md text-[10px]">
              {user?.specialization || 'Senior Physician'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-red-600" /> {selectedState.doctorHospitalName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Duty Toggle */}
            <button
              onClick={() =>
                updateProfile({
                  availabilityStatus: isDoctorOnline ? 'offline' : 'online'
                })
              }
              className={`px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 border transition-all ${
                isDoctorOnline
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isDoctorOnline ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>ON TELE-TRIAGE DUTY</span>
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5" />
                  <span>OFF DUTY</span>
                </>
              )}
            </button>

            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-red-600" /> {selectedState.name} ({selectedState.district})
            </span>
          </div>

        </div>
      </div>

      {/* Main Doctor Workspace */}
      <main className="flex-1">{children}</main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};
