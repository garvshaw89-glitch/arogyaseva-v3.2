import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { LiveMap } from '../components/map/LiveMap';
import { RouteDetailsPane } from '../components/map/RouteDetailsPane';
import { RoutingService, RouteResult } from '../services/routingService';
import { ShieldAlert, Phone, Navigation, MapPin, Building2, Zap, CheckCircle2 } from 'lucide-react';

export const EmergencyModeView: React.FC = () => {
  const { hospitals, userLocation, createCase } = useData();

  // Find nearest hospital with ICU beds open
  const nearestEmergencyHosp = hospitals.find((h) => h.emergency24x7 && h.icuBedsAvailable > 0) || hospitals[0];

  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [isEscalated, setIsEscalated] = useState(false);

  const handleStartEmergencyNavigation = async () => {
    if (!nearestEmergencyHosp) return;
    const originLat = userLocation?.latitude || 17.6805;
    const originLng = userLocation?.longitude || 74.0183;

    const route = await RoutingService.calculateRoute(originLat, originLng, nearestEmergencyHosp.latitude, nearestEmergencyHosp.longitude);
    setActiveRoute(route);
  };

  const handleBroadcastEmergency = async () => {
    setIsEscalated(true);
    await createCase({
      patientId: 'pat-103',
      patientName: 'CRITICAL EMERGENCY PATIENT',
      patientAge: 64,
      patientGender: 'Male',
      patientVillage: 'Wadhe Village',
      chwId: 'user-chw-1',
      chwName: 'Sunita Patil (ASHA CHW)',
      urgency: 'CRITICAL',
      symptoms: {
        chiefComplaint: 'ACUTE EMERGENCY ESCALATION: Severe hypoxia (SpO2 87%), respiratory distress, cardiac pain',
        symptoms: ['Chest Pain', 'Severe Hypoxia', 'Respiratory Distress'],
        durationDays: 1,
        severity: 'Extreme',
        existingConditions: ['Cardiovascular Risk'],
        currentMedications: [],
        allergies: []
      },
      vitals: {
        temperature: 102.5,
        bloodPressureSys: 170,
        bloodPressureDia: 105,
        heartRate: 122,
        spO2: 87,
        respiratoryRate: 28,
        weight: 65
      },
      aiSummary: '🚨 CRITICAL EMERGENCY ESCALATION: SpO2 87%, BP 170/105, HR 122 bpm. Emergency ambulance dispatched to nearest District ICU.',
      latitude: userLocation?.latitude || 17.6805,
      longitude: userLocation?.longitude || 74.0183
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* High-Contrast Red Emergency Header */}
      <div className="bg-red-600 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-red-700 relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-700 text-white">
                CRITICAL EMERGENCY RESPONSE MODE
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">Emergency Escalation Triage</h1>
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div className="flex items-center gap-3">
            <a
              href="tel:108"
              className="py-3.5 px-7 rounded-2xl bg-white text-red-600 font-extrabold text-sm flex items-center gap-2 shadow-xl hover:bg-red-50 transition-all shrink-0"
            >
              <Phone className="w-5 h-5 text-red-600" /> Call 108 Emergency Ambulance
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 space-y-4">
          <div className="card-medical p-4">
            <LiveMap
              userLocation={userLocation}
              hospitals={hospitals}
              selectedHospital={nearestEmergencyHosp}
              routePolyline={activeRoute?.coordinates || []}
              onStartDirections={handleStartEmergencyNavigation}
              className="w-full h-[450px]"
            />
          </div>

          {activeRoute && nearestEmergencyHosp && (
            <RouteDetailsPane
              route={activeRoute}
              hospitalName={nearestEmergencyHosp.name}
              onClose={() => setActiveRoute(null)}
            />
          )}
        </div>

        {/* Nearest Hospital & Escalation Box */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="card-medical p-6 space-y-4 border-red-200">
            <h3 className="font-extrabold text-sm text-red-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-red-600" /> Nearest Available ICU Facility
            </h3>

            {nearestEmergencyHosp && (
              <div className="space-y-2 text-xs font-medium">
                <h4 className="font-extrabold text-base text-slate-900">{nearestEmergencyHosp.name}</h4>
                <p className="text-slate-600">{nearestEmergencyHosp.address}</p>
                <div className="flex gap-2 text-emerald-700 font-extrabold pt-1">
                  <span>📍 {nearestEmergencyHosp.distanceKm} km away</span>
                  <span>•</span>
                  <span>🛏️ {nearestEmergencyHosp.icuBedsAvailable} ICU beds open</span>
                </div>
              </div>
            )}

            <button
              onClick={handleStartEmergencyNavigation}
              className="w-full py-3.5 rounded-xl btn-primary-red text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Navigation className="w-4 h-4" /> Compute Emergency Route & ETA
            </button>
          </div>

          {/* Broadcast Alert Box */}
          <div className="card-medical p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" /> Realtime Doctor Network Broadcast
            </h3>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Triggers instant high-priority audio alert across all active Doctor Portals with live GPS coordinates.
            </p>

            <button
              onClick={handleBroadcastEmergency}
              disabled={isEscalated}
              className={`w-full py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                isEscalated ? 'bg-emerald-600 text-white' : 'btn-primary-red'
              }`}
            >
              {isEscalated ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" /> Emergency Broadcast Active to Doctors
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 text-white" /> Broadcast Emergency to All Doctors
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* FOOTER */}
    </div>
  );
};
