import React from 'react';
import { Link } from 'react-router-dom';
import { HealthGlobe } from '../components/3d/HealthGlobe';
import { PulseVitalsCanvas } from '../components/3d/PulseVitalsCanvas';
import { InteractiveSimulator } from '../components/common/InteractiveSimulator';
import {
  Activity,
  Stethoscope,
  HeartPulse,
  ShieldAlert,
  Wifi,
  Navigation,
  Mic,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Zap,
  Globe,
  Bed,
  MapPin,
  Clock,
  Check,
  ShieldCheck,
  Cpu,
  Smartphone
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      
      {/* 1. CINEMATIC HERO SECTION WITH 3D INTERACTIVE TELEMETRY GLOBE */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>CONNECTED RURAL HEALTHCARE TELE-TRIAGE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Connecting Rural Healthcare to Doctors in <span className="text-red-600">Real Time</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
              Empowering Community Health Workers (CHWs) with voice clinical intake, rule-based AI triage, real-time GPS hospital discovery, and instant doctor tele-consultations across 8 Indian state jurisdictions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/chw"
                className="btn-primary-red px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2.5 shadow-md hover:scale-[1.02] transition-transform"
              >
                <Activity className="w-5 h-5" />
                Launch CHW Field Portal
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/doctor"
                className="btn-secondary-slate px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2.5"
              >
                <Stethoscope className="w-5 h-5 text-red-600" />
                Doctor Triage Desk
              </Link>

              <Link
                to="/hospital"
                className="btn-soft-red px-6 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2"
              >
                <Building2 className="w-5 h-5 text-red-600" />
                Hospital ER & ICU Bed Command
              </Link>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200 text-xs font-extrabold text-slate-700">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" /> Cross-Network Realtime Sync
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" /> Live GPS Hospital Routing
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" /> Instant ICU Bed Approval
              </div>
            </div>
          </div>

          {/* 3D Interactive Telemetry Visualizer */}
          <div className="lg:col-span-5 relative h-[360px] sm:h-[420px] lg:h-[480px] flex items-center justify-center">
            <div className="absolute inset-0 bg-red-100/40 rounded-full blur-3xl opacity-60"></div>
            <HealthGlobe className="w-full h-full relative z-10" />
          </div>

        </div>
      </section>

      {/* 2. THE RURAL TRIAGE GAP vs AROGYASEVA SOLUTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Problem Card */}
          <div className="lg:col-span-5 card-medical p-8 space-y-4 bg-slate-900 text-white border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider px-3 py-1 rounded-full bg-red-950 border border-red-800">
                THE RURAL HEALTHCARE GAP
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Delayed Medical Triage in Remote Villages</h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                In rural sub-centers, patients experiencing critical symptoms (hypoxia, acute cardiac pain, severe sepsis) often face 3+ hour delays before reaching a specialist doctor or district hospital.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium">
              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-base">✕</span>
                <span>Paper-based record delays & lack of real-time doctor connectivity</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-extrabold text-base">✕</span>
                <span>Uncertain hospital ICU bed availability leading to emergency room rejections</span>
              </div>
            </div>
          </div>

          {/* Solution Panel */}
          <div className="lg:col-span-7 card-medical-red p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-red-700 tracking-wider px-3 py-1 rounded-full bg-red-100 border border-red-200">
                AROGYASEVA DIGITAL BRIDGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Sub-50ms Bidirectional Tele-Triage Pipeline</h2>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                ArogyaSeva connects field health workers directly to tele-doctors and hospital ER command rooms over WebSockets and Supabase Realtime across any network, 4G, 5G, or Wi-Fi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-800">
              <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-2xs space-y-1">
                <span className="text-red-600 font-black text-lg block">🎤 Voice Intake</span>
                <p className="text-slate-600 text-[11px] font-medium">ASHA worker speaks symptoms; system auto-extracts structured EHR fields.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-2xs space-y-1">
                <span className="text-red-600 font-black text-lg block">🏥 ICU Bed Command</span>
                <p className="text-slate-600 text-[11px] font-medium">District hospital ER staff approves referral and reserves Bed # live before ambulance arrives.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. LIVE INTERACTIVE WORKFLOW SIMULATOR */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <InteractiveSimulator />
      </section>

      {/* 4. END-TO-END ARCHITECTURE PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest px-3.5 py-1 rounded-full bg-red-50 border border-red-200">
            PLATFORM ARCHITECTURE
          </span>
          <h2 className="text-3xl font-black text-slate-900">4-Stage Triage & Bed Reservation Pipeline</h2>
          <p className="text-slate-600 text-sm font-medium">
            Designed specifically for high-stress emergency coordination across rural health sub-centers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="card-medical p-6 space-y-3 relative group hover:border-red-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              1
            </div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" /> ASHA Field Intake
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              ASHA worker collects patient vitals (BP, SpO2, HR), voice notes, and clinical symptoms in rural sub-center.
            </p>
            <div className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              ● Works Online & Offline
            </div>
          </div>

          <div className="card-medical p-6 space-y-3 relative group hover:border-red-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              2
            </div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-red-600 animate-pulse" /> WebSocket & AI Triage
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Realtime Relay broadcasts case payload. AI Triage synthesizes red flags (hypoxia &lt;90%, severe hypertension).
            </p>
            <div className="text-[11px] font-extrabold text-red-700 bg-red-50 p-2 rounded-xl border border-red-200">
              ⚡ Sub-50ms Global Relay
            </div>
          </div>

          <div className="card-medical p-6 space-y-3 relative group hover:border-red-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              3
            </div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-red-600" /> Doctor Tele-Triage
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Physician receives audio alert toast, reviews EHR, inputs prescription, and triggers hospital referral.
            </p>
            <div className="text-[11px] font-extrabold text-slate-900 bg-slate-200 p-2 rounded-xl border border-slate-300">
              👨‍⚕️ Prescriptions & Referral
            </div>
          </div>

          <div className="card-medical p-6 space-y-3 relative group hover:border-red-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              4
            </div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-red-600" /> Hospital ER & ICU Bed
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              ER staff receives referral, clicks APPROVE & RESERVE ICU BED, assigns Bed # (e.g. ICU-04) & Trauma Bay.
            </p>
            <div className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              ✅ Bed Reserved Live
            </div>
          </div>

        </div>
      </section>

      {/* 5. 3D SPATIAL VITALS & CORE CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-black uppercase text-red-600 tracking-widest px-3 py-1 rounded-full bg-red-50 border border-red-200">
              SPATIAL CLINICAL TELEMETRY
            </span>
            <h2 className="text-3xl font-black text-slate-900">3D Cardiac Vitals Visualizer</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Doctors can inspect high-precision 3D pulse waveforms and vital signs (SpO2, Systolic/Diastolic BP, Heart Rate) transmitted from the field in real time.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <HeartPulse className="w-5 h-5 text-red-600 shrink-0" /> Dynamic Frequency Modulation
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <Activity className="w-5 h-5 text-red-600 shrink-0" /> Red-Flag Threshold Alarm (SpO2 &lt; 90%)
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 card-medical p-6 bg-slate-900 text-white border-slate-800 h-[320px] flex items-center justify-center relative overflow-hidden">
            <PulseVitalsCanvas className="w-full h-full" heartRate={118} spO2={88} isCritical={true} />
          </div>

        </div>
      </section>

      {/* 6. TRUST, SECURITY & OFFLINE FIRST */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="card-medical p-8 lg:p-12 space-y-8 bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-800 text-white border-slate-800 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <ShieldCheck className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="text-3xl font-black text-white">Enterprise Healthcare Security & Trust</h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Built to comply with NDHM/HIPAA healthcare privacy guidelines and offline field resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300 font-medium">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="text-red-400 font-extrabold text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Offline Queue Sync
              </div>
              <p>Intake entries created during zero internet connectivity auto-sync immediately when network restores.</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="text-red-400 font-extrabold text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 256-Bit Data Encryption
              </div>
              <p>End-to-end encrypted payload transmission across all WebSocket and Supabase Realtime channels.</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="text-red-400 font-extrabold text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Any Device & Size Ready
              </div>
              <p>100% responsive across low-cost field smartphones, tablets, doctor laptops, and ER command displays.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PORTAL LAUNCHER ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="card-medical-red p-8 lg:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Experience ArogyaSeva v3.2 Now</h2>
          <p className="text-slate-700 text-sm max-w-xl mx-auto font-medium">
            Open the CHW Portal, Doctor Triage, and Hospital ER Portal in separate browser tabs to test physical cross-device real-time synchronization.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/chw"
              className="btn-primary-red px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
            >
              <Activity className="w-5 h-5" /> Launch CHW Field Portal
            </Link>

            <Link
              to="/doctor"
              className="btn-secondary-slate px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-2"
            >
              <Stethoscope className="w-5 h-5 text-red-600" /> Open Doctor Triage
            </Link>

            <Link
              to="/hospital"
              className="btn-soft-red px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-2"
            >
              <Building2 className="w-5 h-5 text-red-600" /> Open Hospital ER Command
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
