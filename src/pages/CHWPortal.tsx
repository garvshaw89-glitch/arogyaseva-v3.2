import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ClinicalIntakeForm } from '../components/intake/ClinicalIntakeForm';
import { CaseCard } from '../components/case/CaseCard';
import { CaseTimeline } from '../components/case/CaseTimeline';
import { LiveMap } from '../components/map/LiveMap';
import { HospitalCard } from '../components/map/HospitalCard';
import { RouteDetailsPane } from '../components/map/RouteDetailsPane';
import { Hospital } from '../types';
import { RoutingService, RouteResult } from '../services/routingService';
import {
  Activity,
  Users,
  Clock,
  ShieldAlert,
  MapPin,
  Building2,
  PlusCircle,
  Navigation,
  RefreshCw,
  Search,
  Globe
} from 'lucide-react';

export const CHWPortal: React.FC = () => {
  const {
    cases,
    patients,
    hospitals,
    selectedState,
    allStates,
    selectState,
    userLocation,
    connectionStatus,
    pendingSyncCount,
    triggerManualSync
  } = useData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'intake' | 'cases' | 'map' | 'patients'>('intake');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Dashboard Metrics
  const totalPatients = patients.length;
  const activeCasesCount = cases.filter((c) => c.status !== 'COMPLETED' && c.status !== 'CANCELLED').length;
  const pendingDoctorResponseCount = cases.filter((c) => c.status === 'NEW' || c.status === 'UNDER_REVIEW').length;

  // Handle Directions Request
  const handleStartDirections = async (hosp: Hospital) => {
    setSelectedHospital(hosp);
    const originLat = userLocation?.latitude || selectedState.latitude;
    const originLng = userLocation?.longitude || selectedState.longitude;

    const route = await RoutingService.calculateRoute(originLat, originLng, hosp.latitude, hosp.longitude);
    setActiveRoute(route);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* 1. CHW Header & State Selector Banner */}
      <div className="card-medical p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'}
              alt={selectedState.defaultChwName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">{selectedState.defaultChwName}</h1>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  ASHA Field Worker
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-600" /> {selectedState.defaultVillage}</span>
                <span>•</span>
                <span>{selectedState.subCenterName}</span>
              </p>
            </div>
          </div>

          {/* Sync status card */}
          <div className="flex items-center gap-3">
            {connectionStatus === 'OFFLINE' ? (
              <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-right">
                <span className="text-[10px] text-red-700 font-extrabold block">OFFLINE QUEUE ACTIVE</span>
                <span className="text-xs text-slate-800 font-bold">{pendingSyncCount} case(s) pending</span>
              </div>
            ) : (
              <button
                onClick={triggerManualSync}
                className="btn-secondary-slate px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-red-600 ${connectionStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
                {connectionStatus === 'SYNCING' ? 'Syncing...' : 'Sync Database'}
              </button>
            )}
          </div>
        </div>

        {/* State / Region Selector Pill Bar */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-red-600" /> Select Regional Jurisdiction:
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              Active: <span className="text-slate-900 font-extrabold">{selectedState.name} ({selectedState.district})</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allStates.map((st) => {
              const isSelected = st.id === selectedState.id;
              return (
                <button
                  key={st.id}
                  onClick={() => selectState(st.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>📍 {st.name}</span>
                  <span className="text-[10px] opacity-80">({st.district.split('&')[0].trim()})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">TOTAL PATIENTS</span>
            <span className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600" /> {totalPatients}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">ACTIVE CASES</span>
            <span className="text-2xl font-black text-emerald-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" /> {activeCasesCount}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">PENDING DOCTOR</span>
            <span className="text-2xl font-black text-amber-700 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" /> {pendingDoctorResponseCount}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">NEARBY HOSPITALS</span>
            <span className="text-2xl font-black text-red-600 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" /> {hospitals.length} Facilities
            </span>
          </div>
        </div>
      </div>

      {/* 2. CHW Portal Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('intake')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border whitespace-nowrap ${
            activeTab === 'intake'
              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Clinical Intake & Voice ({selectedState.name})
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border whitespace-nowrap ${
            activeTab === 'cases'
              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          Active Cases & Doctor Feedback ({cases.length})
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border whitespace-nowrap ${
            activeTab === 'map'
              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-4 h-4" />
          Hospitals & Navigation ({selectedState.name})
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border whitespace-nowrap ${
            activeTab === 'patients'
              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Patient Registry ({patients.length})
        </button>
      </div>

      {/* TAB 1: Clinical Intake */}
      {activeTab === 'intake' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ClinicalIntakeForm
              onCaseCreated={(c) => {
                setSelectedCaseId(c.id);
                setActiveTab('cases');
              }}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="card-medical p-5 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" /> State Field Coordinates ({selectedState.name})
              </h3>
              <p className="text-xs text-slate-700 font-medium">
                Lat: <span className="font-bold text-slate-900">{userLocation?.latitude.toFixed(4) || selectedState.latitude}</span>, Long: <span className="font-bold text-slate-900">{userLocation?.longitude.toFixed(4) || selectedState.longitude}</span>
              </p>
              <span className="text-[10px] text-slate-500 block font-medium">GPS coordinates automatically attached to all clinical cases in {selectedState.name}.</span>
            </div>

            <div className="card-medical p-5 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-red-600" /> Nearest State Tertiary Hospital
              </h3>
              {hospitals[0] && (
                <div className="text-xs text-slate-700 space-y-1 font-medium">
                  <p className="font-extrabold text-slate-900">{hospitals[0].name}</p>
                  <p className="text-slate-500">{hospitals[0].distanceKm || 5} km away • {hospitals[0].icuBedsAvailable} ICU beds open</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Active Cases */}
      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search cases by patient name or village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-red-500 shadow-2xs font-medium"
              />
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {cases
                .filter((c) => c.patientName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((c) => (
                  <CaseCard
                    key={c.id}
                    clinicalCase={c}
                    isSelected={c.id === selectedCase?.id}
                    onSelect={() => setSelectedCaseId(c.id)}
                  />
                ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            {selectedCase ? (
              <div className="card-medical p-6 space-y-5">
                <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                      Case #{selectedCase.id.slice(-6)}
                    </span>
                    <h2 className="font-extrabold text-xl text-slate-900 mt-1">{selectedCase.patientName}</h2>
                    <p className="text-xs text-slate-500 font-medium">{selectedCase.patientAge}y, {selectedCase.patientGender} — {selectedCase.patientVillage}</p>
                  </div>

                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-900 border border-slate-200">
                    {selectedCase.status}
                  </span>
                </div>

                <CaseTimeline currentStatus={selectedCase.status} />

                {/* Vitals */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-extrabold uppercase">BP</span>
                    <span className="font-black text-slate-900">{selectedCase.vitals.bloodPressureSys}/{selectedCase.vitals.bloodPressureDia}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-extrabold uppercase">PULSE</span>
                    <span className="font-black text-slate-900">{selectedCase.vitals.heartRate} bpm</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-extrabold uppercase">SpO2</span>
                    <span className={`font-black ${selectedCase.vitals.spO2 < 92 ? 'text-red-600' : 'text-emerald-600'}`}>{selectedCase.vitals.spO2}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-extrabold uppercase">TEMP</span>
                    <span className="font-black text-amber-600">{selectedCase.vitals.temperature}°F</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-extrabold uppercase">RESP</span>
                    <span className="font-black text-slate-900">{selectedCase.vitals.respiratoryRate}/m</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-extrabold uppercase">WEIGHT</span>
                    <span className="font-black text-slate-900">{selectedCase.vitals.weight}kg</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-700 mb-1">Chief Complaint:</h4>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    "{selectedCase.symptoms.chiefComplaint}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="card-medical p-12 text-center text-slate-500 text-xs font-medium">
                Select a case from the list to view details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Map & Hospital Discovery */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <LiveMap
              userLocation={userLocation}
              hospitals={hospitals}
              selectedHospital={selectedHospital}
              routePolyline={activeRoute?.coordinates || []}
              onSelectHospital={(hosp) => setSelectedHospital(hosp)}
              onStartDirections={handleStartDirections}
              className="w-full h-[520px]"
            />

            {activeRoute && selectedHospital && (
              <RouteDetailsPane
                route={activeRoute}
                hospitalName={selectedHospital.name}
                onClose={() => setActiveRoute(null)}
              />
            )}
          </div>

          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-red-600" /> {selectedState.name} Hospitals ({hospitals.length})
            </h3>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {hospitals.map((hosp) => (
                <HospitalCard
                  key={hosp.id}
                  hospital={hosp}
                  isSelected={selectedHospital?.id === hosp.id}
                  onSelect={() => setSelectedHospital(hosp)}
                  onNavigate={() => handleStartDirections(hosp)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Patient Directory */}
      {activeTab === 'patients' && (
        <div className="card-medical p-6 space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900">Registered Patients in {selectedState.name}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patients.map((p) => (
              <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900">{p.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{p.age}y, {p.gender} • Phone: {p.phone}</p>
                <p className="text-xs text-slate-700 font-bold">📍 {p.address}</p>
                <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-200">Emergency Contact: {p.emergencyContactName} ({p.emergencyContactPhone})</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
