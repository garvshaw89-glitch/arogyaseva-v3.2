import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CaseCard } from '../components/case/CaseCard';
import { CaseTimeline } from '../components/case/CaseTimeline';
import { DoctorAdviceModal } from '../components/case/DoctorAdviceModal';
import { PulseVitalsCanvas } from '../components/3d/PulseVitalsCanvas';
import { ClinicalCase, UrgencyLevel } from '../types';
import {
  Stethoscope,
  Activity,
  ShieldAlert,
  Clock,
  Heart,
  Wind,
  Thermometer,
  Pill,
  CheckCircle2,
  Building2,
  Search,
  Sparkles,
  Phone,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { cases, hospitals, updateCaseStatus } = useData();
  const { user, updateProfile } = useAuth();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'ALL'>('ALL');
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const isDoctorOnline = user?.availabilityStatus !== 'offline';

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || c.chwName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = urgencyFilter === 'ALL' ? true : c.urgency === urgencyFilter;
    return matchesSearch && matchesUrgency;
  });

  const criticalQueueCount = cases.filter((c) => c.urgency === 'CRITICAL' || c.status === 'EMERGENCY').length;
  const pendingReviewCount = cases.filter((c) => c.status === 'NEW' || c.status === 'UNDER_REVIEW').length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* 1. Doctor Header Banner */}
      <div className="card-medical p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'}
              alt={user?.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">{user?.name || 'Dr. Anand Sharma'}</h1>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  DOCTOR TRIAGE
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 font-medium">
                <span className="font-extrabold text-red-700">{user?.specialization || 'Senior Physician'}</span>
                <span>•</span>
                <span>{user?.hospitalName || 'District Civil Hospital'}</span>
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                updateProfile({
                  availabilityStatus: isDoctorOnline ? 'offline' : 'online'
                })
              }
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 border transition-all ${
                isDoctorOnline
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isDoctorOnline ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>On Duty & Receiving Cases</span>
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4 text-red-600" />
                  <span>Off Duty</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">LIVE CASE QUEUE</span>
            <span className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" /> {cases.length}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">AWAITING REVIEW</span>
            <span className="text-2xl font-black text-amber-700 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" /> {pendingReviewCount}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">CRITICAL TRIAGE</span>
            <span className="text-2xl font-black text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" /> {criticalQueueCount}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">HOSPITAL ICU BEDS</span>
            <span className="text-2xl font-black text-emerald-700 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" /> 14 Open
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Triage Queue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cases List Sidebar */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" /> Live Tele-Triage Queue
            </h2>

            {/* Urgency Filter Pills */}
            <div className="flex gap-1 text-[10px] font-extrabold">
              {(['ALL', 'CRITICAL', 'URGENT'] as const).map((urg) => (
                <button
                  key={urg}
                  onClick={() => setUrgencyFilter(urg)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    urgencyFilter === urg
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by patient name or CHW worker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-red-500 shadow-2xs font-medium"
            />
          </div>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredCases.map((c) => (
              <CaseCard
                key={c.id}
                clinicalCase={c}
                isSelected={c.id === selectedCase?.id}
                onSelect={() => {
                  setSelectedCaseId(c.id);
                  if (c.status === 'NEW') {
                    updateCaseStatus(c.id, 'UNDER_REVIEW');
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Doctor Case Inspector & EHR Workspace */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="card-medical p-6 space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                      EHR Case Record #{selectedCase.id.slice(-6)}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {selectedCase.status}
                    </span>
                  </div>

                  <h2 className="font-extrabold text-2xl text-slate-900 mt-1.5">{selectedCase.patientName}</h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {selectedCase.patientAge} years • {selectedCase.patientGender} • Village: <span className="font-bold text-slate-900">{selectedCase.patientVillage}</span>
                  </p>
                </div>

                <button
                  onClick={() => setShowAdviceModal(true)}
                  className="btn-primary-red px-5 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md"
                >
                  <Stethoscope className="w-4 h-4" /> Transmit Doctor Advice
                </button>
              </div>

              {/* Case Stage Timeline */}
              <CaseTimeline currentStatus={selectedCase.status} />

              {/* 3D Cardiac Vitals Pulse Canvas */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-red-600" /> Realtime Cardiac Monitor Waveform</span>
                  <span className="text-red-700 font-mono font-extrabold">{selectedCase.vitals.heartRate} BPM</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                  <PulseVitalsCanvas bpm={selectedCase.vitals.heartRate} isEmergency={selectedCase.urgency === 'CRITICAL'} />
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 block font-extrabold uppercase">BLOOD PRESSURE</span>
                  <span className="font-black text-slate-900 text-sm">{selectedCase.vitals.bloodPressureSys}/{selectedCase.vitals.bloodPressureDia}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-extrabold uppercase">HEART RATE</span>
                  <span className="font-black text-slate-900 text-sm">{selectedCase.vitals.heartRate} bpm</span>
                </div>
                <div className={`p-1.5 rounded-lg ${selectedCase.vitals.spO2 < 92 ? 'bg-red-100 text-red-700 border border-red-300' : 'text-emerald-700 font-extrabold'}`}>
                  <span className="block text-[9px] font-extrabold uppercase">SpO2 OXYGEN</span>
                  <span className="font-black text-sm">{selectedCase.vitals.spO2}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-extrabold uppercase">TEMPERATURE</span>
                  <span className="font-black text-amber-700 text-sm">{selectedCase.vitals.temperature}°F</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-extrabold uppercase">RESP RATE</span>
                  <span className="font-black text-slate-900 text-sm">{selectedCase.vitals.respiratoryRate}/m</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-extrabold uppercase">WEIGHT</span>
                  <span className="font-black text-slate-900 text-sm">{selectedCase.vitals.weight}kg</span>
                </div>
              </div>

              {/* AI Synthesis & Red Flags */}
              {selectedCase.aiSummary && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs space-y-2">
                  <span className="font-extrabold text-red-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-600" /> AI Clinical Triage Synthesis:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">{selectedCase.aiSummary}</p>
                </div>
              )}

              {/* Symptoms & Voice Notes */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-slate-700">Submitted Chief Complaint & Voice Note:</h4>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <p className="text-slate-900 font-medium">"{selectedCase.symptoms.chiefComplaint}"</p>
                  {selectedCase.voiceNoteTranscript && (
                    <p className="text-red-700 italic border-t border-slate-200 pt-2 font-medium">
                      🎙️ Spoken Note: "{selectedCase.voiceNoteTranscript}"
                    </p>
                  )}
                </div>
              </div>

              {/* Submitting CHW Info */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Submitting CHW Worker:</span>
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-600" /> {selectedCase.chwName} ({selectedCase.patientVillage})
                </span>
              </div>

              {/* Existing Doctor Advice Card if already responded */}
              {selectedCase.doctorResponse && (
                <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                  <span className="font-extrabold text-slate-900 block">Transmitted Doctor Advice:</span>
                  <p className="text-slate-800 font-medium">{selectedCase.doctorResponse.recommendedAction}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="card-medical p-12 text-center text-slate-500 text-xs font-medium">
              Select a case from the live queue to inspect patient record & vitals.
            </div>
          )}
        </div>

      </div>

      {/* Doctor Advice Modal */}
      {showAdviceModal && selectedCase && (
        <DoctorAdviceModal clinicalCase={selectedCase} onClose={() => setShowAdviceModal(false)} />
      )}

    </div>
  );
};
