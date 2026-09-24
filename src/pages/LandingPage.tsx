import React from 'react';
import { Link } from 'react-router-dom';
import { HealthGlobe } from '../components/3d/HealthGlobe';
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
  Check
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section with 3D Globe Visualizer */}
      <section className="relative pt-8 lg:pt-16 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold tracking-wide">
              <Sparkles className="w-4 h-4 text-red-600" /> CONNECTED RURAL HEALTHCARE PLATFORM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Connecting Rural Healthcare to Doctors in <span className="text-red-600">Real Time</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
              Empowering Community Health Workers (CHWs) with voice intake, AI emergency triage, real-time GPS hospital discovery, and instant doctor tele-consultations across 8 Indian state jurisdictions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/chw"
                className="btn-primary-red px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2.5 shadow-md"
              >
                <Activity className="w-5 h-5" />
                Launch CHW Portal
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/doctor"
                className="btn-secondary-slate px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2.5"
              >
                <Stethoscope className="w-5 h-5 text-red-600" />
                Doctor Triage Portal
              </Link>

              <Link
                to="/hospital"
                className="btn-soft-red px-6 py-3.5 rounded-2xl text-sm font-extrabold flex items-center gap-2"
              >
                <Building2 className="w-5 h-5 text-red-600" />
                Hospital ER & ICU Bed Command
              </Link>
            </div>

            {/* Platform Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs font-extrabold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-600" /> Multi-Device Real-Time Sync
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-600" /> Live GPS & Address Search
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-600" /> ICU Bed Reservation
              </div>
            </div>
          </div>

          {/* 3D Globe Visualizer */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[420px] flex items-center justify-center">
            <div className="absolute inset-0 bg-red-100/50 rounded-full blur-3xl opacity-60"></div>
            <HealthGlobe className="w-full h-full relative z-10" />
          </div>

        </div>
      </section>

      {/* 2. CHW -> Shared WebSocket Backend -> Doctor -> ER Hospital Architecture */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="card-medical p-8 lg:p-12 space-y-8 relative overflow-hidden border-slate-200 shadow-sm">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest px-3.5 py-1 rounded-full bg-red-50 border border-red-200">
              Real-Time Platform Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">End-to-End Emergency Coordination</h2>
            <p className="text-slate-600 text-sm font-medium">
              Instant bidirectional WebSocket events (Port 4000) connect field health workers directly to hospital specialty teams without manual page refreshes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1: CHW */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 relative group hover:border-red-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-600" /> CHW Field Intake
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                ASHA worker collects patient vitals (BP, SpO2, HR), voice notes, and clinical symptoms in rural sub-center.
              </p>
              <div className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                ● Works Online & Offline
              </div>
            </div>

            {/* Step 2: Shared Backend & AI */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 relative group hover:border-red-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-red-600 animate-pulse" /> WebSocket & AI Triage
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                WebSocket Relay broadcasts case payload. AI Triage synthesizes red flags (hypoxia &lt;90%, severe hypertension).
              </p>
              <div className="text-[11px] font-extrabold text-red-700 bg-red-50 p-2 rounded-xl border border-red-200">
                ⚡ Instant &lt;50ms broadcast
              </div>
            </div>

            {/* Step 3: Doctor */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 relative group hover:border-red-400 transition-all">
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

            {/* Step 4: Hospital ER */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 relative group hover:border-red-400 transition-all">
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
        </div>
      </section>

      {/* 3. Core Capability Modules */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Production Feature Suite</h2>
          <p className="text-slate-600 text-sm font-medium">Built specifically for rural field health workers and hospital triage teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="card-medical p-6 space-y-3">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 w-fit border border-red-100">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Voice-to-Text Intake</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Browser Web Speech API converts spoken symptoms into structured medical EHR fields automatically.
            </p>
          </div>

          <div className="card-medical p-6 space-y-3">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 w-fit border border-red-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">AI Clinical Triage</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Rule-based AI triage highlights abnormal vital sign red flags (hypoxia &lt;90%, severe BP) for instant doctor awareness.
            </p>
          </div>

          <div className="card-medical p-6 space-y-3">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 w-fit border border-red-100">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Live GPS & OSM Maps</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Leaflet maps pinpoint live patient GPS, calculate OSRM driving routes, ETA mins, and distance (km) to hospitals.
            </p>
          </div>

          <div className="card-medical p-6 space-y-3">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 w-fit border border-red-100">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Emergency Mode</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              High-priority triage dashboard with 108 hotline integration, nearest ICU bed locator, and ambulance dispatch.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Portal Launcher Call to Action */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="card-medical-red p-8 lg:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Experience ArogyaSeva in Action</h2>
          <p className="text-slate-700 text-sm max-w-xl mx-auto font-medium">
            Open the CHW Portal, Doctor Triage, and Hospital ER Portal in separate browser tabs to test physical cross-device real-time synchronization.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/chw"
              className="btn-primary-red px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-md"
            >
              <Activity className="w-5 h-5" /> Open CHW Field Portal
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
              <Building2 className="w-5 h-5 text-red-600" /> Open Hospital ER Portal
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
