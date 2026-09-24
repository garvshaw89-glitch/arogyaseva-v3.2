import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import {
  Building2,
  Activity,
  Bed,
  PhoneCall,
  Globe,
  LogOut,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const HospitalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const { selectedState, allStates, selectState, referrals, hospitals } = useData();
  const navigate = useNavigate();

  const activeHospital = hospitals[0] || {
    name: selectedState.doctorHospitalName,
    icuBedsAvailable: 8,
    totalBeds: 120
  };

  const pendingApprovalsCount = referrals.filter(
    (r) => r.status === 'SUBMITTED' || !r.acceptedByHospital
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* 1. Shared App Header */}
      <Header />

      {/* 2. Sub-Header Hospital Status Banner */}
      <div className="bg-red-600 text-white py-3 px-4 shadow-sm border-b border-red-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
          
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-white" />
            <span className="font-extrabold text-white text-sm">{selectedState.doctorHospitalName}</span>
            <span className="text-red-200">•</span>
            <span className="flex items-center gap-1 text-red-100 font-medium">
              <MapPin className="w-3.5 h-3.5 text-white" /> {selectedState.name}, {selectedState.district} Emergency Command
            </span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* ICU Bed pill */}
            <div className="flex items-center gap-1.5 bg-red-700/80 px-3 py-1 rounded-xl border border-red-500 text-white">
              <Bed className="w-3.5 h-3.5 text-red-200" />
              <span>ICU Beds: <strong className="text-white">{activeHospital.icuBedsAvailable} Available</strong></span>
            </div>

            {/* Pending Referrals Pill */}
            <div className="flex items-center gap-1.5 bg-red-700/80 px-3 py-1 rounded-xl border border-red-500 text-white">
              <Activity className="w-3.5 h-3.5 text-amber-300" />
              <span>Pending Approvals: <strong className="text-white">{pendingApprovalsCount}</strong></span>
            </div>

            {/* Emergency 108 */}
            <a
              href="tel:108"
              className="bg-white text-red-700 hover:bg-red-50 font-extrabold px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all text-xs shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" /> Dial 108
            </a>
          </div>

        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
