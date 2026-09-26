import React, { useState } from 'react';
import {
  Activity,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Wifi,
  PhoneCall,
  Bed
} from 'lucide-react';

export const InteractiveSimulator: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [patientVitals, setPatientVitals] = useState({
    name: 'Ramesh Patel',
    age: 58,
    village: 'Wadhe Village (Satara)',
    spO2: 88,
    bpSys: 165,
    bpDia: 100,
    hr: 118,
    symptoms: 'Acute chest pain, severe breathlessness for 2 hours'
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(true);
    setStep(1);

    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 3200);
    setTimeout(() => {
      setStep(4);
      setIsSimulating(false);
    }, 4800);
  };

  const resetSimulation = () => {
    setStep(0);
    setIsSimulating(false);
  };

  return (
    <div className="card-medical p-6 lg:p-10 space-y-8 bg-gradient-to-br from-white via-slate-50/50 to-red-50/30 border-slate-200 shadow-xl relative overflow-hidden">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-extrabold tracking-wide mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-600" /> INTERACTIVE TELE-TRIAGE WORKFLOW SIMULATOR
          </div>
          <h3 className="text-2xl font-black text-slate-900">Experience Live Emergency Coordination</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Test how a rural ASHA worker's clinical intake triggers instant doctor advice and emergency ICU bed reservation in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {step === 0 ? (
            <button
              onClick={startSimulation}
              className="btn-primary-red px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
            >
              <Play className="w-4 h-4 fill-white" /> Run Live Intake Simulation
            </button>
          ) : (
            <button
              onClick={resetSimulation}
              disabled={isSimulating}
              className="btn-secondary-slate px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Simulation
            </button>
          )}
        </div>
      </div>

      {/* Workflow Steps Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Step 1: CHW Intake */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-300 relative ${
            step >= 1
              ? 'bg-white border-red-500 shadow-md ring-2 ring-red-100'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center">1</span>
            {step >= 1 && <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">INTAKE ACTIVE</span>}
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-600" /> ASHA Field Intake
          </h4>
          <div className="mt-3 space-y-1 text-xs text-slate-600 font-medium">
            <p><strong>Patient:</strong> {patientVitals.name} ({patientVitals.age}y)</p>
            <p><strong>SpO2:</strong> <span className="text-red-600 font-black">{patientVitals.spO2}%</span> | <strong>BP:</strong> {patientVitals.bpSys}/{patientVitals.bpDia}</p>
            <p className="text-[11px] text-slate-500 truncate">{patientVitals.symptoms}</p>
          </div>
        </div>

        {/* Step 2: AI Triage & WebSocket Relay */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-300 relative ${
            step >= 2
              ? 'bg-white border-red-500 shadow-md ring-2 ring-red-100'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">2</span>
            {step >= 2 && <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 animate-pulse">BROADCASTING</span>}
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-red-600 animate-pulse" /> AI Red Flag Triage
          </h4>
          <div className="mt-3 space-y-1 text-xs text-slate-600 font-medium">
            <p className="text-red-700 font-extrabold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL HYPOXIA DETECTED
            </p>
            <p className="text-[11px] text-slate-500">WebSocket broadcast transmitted to regional doctor queue in 32ms.</p>
          </div>
        </div>

        {/* Step 3: Doctor Response */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-300 relative ${
            step >= 3
              ? 'bg-white border-red-500 shadow-md ring-2 ring-red-100'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center">3</span>
            {step >= 3 && <span className="text-[10px] font-black uppercase text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">DOCTOR ADVICE</span>}
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-red-600" /> Doctor Tele-Triage
          </h4>
          <div className="mt-3 space-y-1 text-xs text-slate-600 font-medium">
            <p><strong>Dr. Anand (CMO):</strong> "Administer STAT Aspirin 325mg + O2 4L/min."</p>
            <p className="text-emerald-700 font-bold">Authorized Urgent Hospital Transfer</p>
          </div>
        </div>

        {/* Step 4: Hospital Bed Reserved */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-300 relative ${
            step >= 4
              ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-100'
              : 'bg-slate-50 border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">4</span>
            {step >= 4 && <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">BED RESERVED</span>}
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" /> Hospital ICU Bed Command
          </h4>
          <div className="mt-3 space-y-1 text-xs text-slate-700 font-medium">
            <p><strong>District Hospital ER:</strong> Referral Approved!</p>
            <p className="text-emerald-800 font-black">Reserved Bed # ICU-04 (Trauma Bay 02)</p>
            <p className="text-[11px] text-slate-500">Ambulance 108 dispatched (ETA 18 mins)</p>
          </div>
        </div>

      </div>

      {/* Live Status Message */}
      {step > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs font-bold shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {step === 1 && 'Step 1: ASHA worker Sunita records vitals & submits clinical intake...'}
              {step === 2 && 'Step 2: AI Triage detects severe hypoxia. Realtime WebSocket payload broadcasting...'}
              {step === 3 && 'Step 3: Dr. Anand reviews EHR, transmits STAT oxygen prescription & hospital referral...'}
              {step === 4 && 'Step 4 COMPLETE: District Hospital ER approved referral and reserved ICU Bed # ICU-04 live!'}
            </span>
          </div>

          {step === 4 && (
            <span className="text-emerald-400 font-black flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> End-to-End Coordination Complete
            </span>
          )}
        </div>
      )}

    </div>
  );
};
