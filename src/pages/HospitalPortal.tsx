import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Hospital, Referral } from '../types';
import { LiveMap } from '../components/map/LiveMap';
import { HospitalCard } from '../components/map/HospitalCard';
import { RoutingService, RouteResult } from '../services/routingService';
import {
  Building2,
  Bed,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Activity,
  Navigation,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  Sparkles,
  ArrowRight,
  XCircle,
  Check
} from 'lucide-react';

export const HospitalPortal: React.FC = () => {
  const {
    selectedState,
    allStates,
    selectState,
    hospitals,
    referrals,
    cases,
    patients,
    userLocation,
    refreshLocation,
    approveReferral,
    rejectReferral
  } = useData();

  const [activeTab, setActiveTab] = useState<'approvals' | 'directory' | 'map'>('approvals');
  const [selectedHospitalForRoute, setSelectedHospitalForRoute] = useState<Hospital | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Modal / Form state for Bed Reservation approval
  const [approvalModalRef, setApprovalModalRef] = useState<Referral | null>(null);
  const [inputBedNumber, setInputBedNumber] = useState('ICU-04');
  const [inputErBay, setInputErBay] = useState('Trauma Bay 02');
  const [isApproving, setIsApproving] = useState(false);

  // Filter Hospitals by search & type
  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterType === 'ALL') return matchesSearch;
    if (filterType === 'ICU') return matchesSearch && h.icuBedsAvailable > 0;
    if (filterType === 'TERTIARY') return matchesSearch && h.type.includes('Tertiary');
    return matchesSearch;
  });

  // Calculate live patient route to a hospital
  const handleCalculateDirections = async (hosp: Hospital) => {
    setSelectedHospitalForRoute(hosp);
    const originLat = userLocation?.latitude || selectedState.latitude;
    const originLng = userLocation?.longitude || selectedState.longitude;
    const route = await RoutingService.calculateRoute(originLat, originLng, hosp.latitude, hosp.longitude);
    setActiveRoute(route);
  };

  // Submit Referral Approval & ICU Bed Reservation
  const handleConfirmApproval = async () => {
    if (!approvalModalRef) return;
    setIsApproving(true);
    await approveReferral(approvalModalRef.id, inputBedNumber, inputErBay);
    setIsApproving(false);
    setApprovalModalRef(null);
  };

  const pendingReferrals = referrals.filter((r) => r.status === 'SUBMITTED' || !r.acceptedByHospital);
  const approvedReferrals = referrals.filter((r) => r.acceptedByHospital);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      
      {/* 1. HERO COMMAND BANNER WITH LIVE PATIENT GPS LOCATION FETCHING */}
      <div className="card-medical p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-extrabold uppercase text-red-700 tracking-wider">
                Emergency Hospital Approval Portal & Bed Command
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {selectedState.doctorHospitalName}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl font-medium">
              Real-time patient intake authorization, instant ICU bed reservation, live GPS distance calculations, and multi-hospital referral synchronization.
            </p>
          </div>

          {/* FETCH PATIENT LIVE GPS BUTTON */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshLocation}
              className="btn-primary-red px-5 py-3 rounded-2xl shadow-md flex items-center gap-2.5 transition-all text-xs shrink-0"
            >
              <Navigation className="w-5 h-5 text-white" />
              <div className="text-left">
                <span className="text-[10px] text-red-100 block uppercase font-bold leading-tight">Patient Live GPS</span>
                <span className="text-xs font-black">Fetch Live Location</span>
              </div>
            </button>

            {userLocation && (
              <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-medium">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold block">Current Patient Coordinates</span>
                <span className="text-slate-900 font-extrabold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* METRICS & QUICK SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-extrabold block uppercase">Total Nearby Hospitals</span>
            <span className="text-2xl font-black text-slate-900">{hospitals.length}</span>
            <span className="text-[10px] text-red-600 font-bold block mt-1">Indexed for {selectedState.name}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-extrabold block uppercase">Pending ER Approvals</span>
            <span className="text-2xl font-black text-amber-700">{pendingReferrals.length}</span>
            <span className="text-[10px] text-amber-600 font-bold block mt-1">Requires Bed Reservation</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-extrabold block uppercase">Approved & Reserved</span>
            <span className="text-2xl font-black text-emerald-700">{approvedReferrals.length}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">Bed Assigned in ER</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-extrabold block uppercase">ICU Beds Free</span>
            <span className="text-2xl font-black text-red-600">
              {hospitals[0]?.icuBedsAvailable || 8} <span className="text-xs font-bold text-slate-500">/ 120</span>
            </span>
            <span className="text-[10px] text-red-700 font-bold block mt-1">Ready for Emergencies</span>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all border ${
            activeTab === 'approvals'
              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Referral Approval Queue ({pendingReferrals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all border ${
            activeTab === 'directory'
              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Nearby Hospitals Directory ({hospitals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all border ${
            activeTab === 'map'
              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Live ER Map & Route Navigation</span>
        </button>
      </div>

      {/* 3. TAB 1: REFERRAL APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Hospital Intake & Referral Approval Console
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Review incoming referrals from CHWs and Field Doctors. Approve to reserve ICU beds and alert transport teams.
              </p>
            </div>
          </div>

          {referrals.length === 0 ? (
            <div className="card-medical p-12 text-center space-y-4">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-extrabold text-slate-800">No Referrals Registered Yet</h3>
              <p className="text-xs text-slate-500 font-medium">
                When CHWs or Doctors submit patient referrals, they will appear here live for hospital approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {referrals.map((ref) => {
                const linkedCase = cases.find((c) => c.id === ref.caseId);
                const isApproved = ref.acceptedByHospital;

                return (
                  <div
                    key={ref.id}
                    className={`card-medical p-6 transition-all space-y-6 ${
                      isApproved
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-red-200 bg-red-50/20'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black uppercase text-red-700 tracking-wider">
                            Referral ID: #{ref.id.slice(-6)}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                              ref.urgency === 'CRITICAL'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {ref.urgency} Urgency
                          </span>

                          {isApproved ? (
                            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ACCEPTED & BED RESERVED ({ref.bedNumberAssigned || 'ICU-04'})
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              PENDING HOSPITAL ER APPROVAL
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                          Patient: {ref.patientName}
                        </h3>
                        <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5 font-medium">
                          <span>Target Hospital: <strong className="text-slate-900">{ref.hospitalName}</strong></span>
                          <span>•</span>
                          <span>Referred by: <strong className="text-red-700">{ref.chwName} (ASHA)</strong></span>
                          {ref.doctorName && (
                            <>
                              <span>•</span>
                              <span>Doctor: <strong className="text-slate-900">{ref.doctorName}</strong></span>
                            </>
                          )}
                        </p>
                      </div>

                      {/* Action Button */}
                      {!isApproved ? (
                        <button
                          onClick={() => {
                            setApprovalModalRef(ref);
                            setInputBedNumber(`ICU-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}`);
                            setInputErBay(`Trauma Bay ${Math.floor(Math.random() * 4 + 1)}`);
                          }}
                          className="btn-primary-red px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 text-xs shrink-0"
                        >
                          <Check className="w-5 h-5" />
                          <span>APPROVE & RESERVE ICU BED</span>
                        </button>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-right shrink-0">
                          <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">Assigned ICU Bed</span>
                          <span className="text-base font-black text-slate-900">{ref.bedNumberAssigned}</span>
                          <span className="text-[10px] text-slate-600 block">{ref.erBayNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Patient Clinical Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Reason */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Referral Reason</span>
                        <p className="text-slate-800 font-medium leading-relaxed">{ref.reason}</p>
                      </div>

                      {/* Vitals summary if case linked */}
                      {linkedCase && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                          <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Live Patient Vitals</span>
                          <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                            <div>BP: <strong className="text-slate-900">{linkedCase.vitals.bloodPressureSys}/{linkedCase.vitals.bloodPressureDia}</strong></div>
                            <div>HR: <strong className="text-slate-900">{linkedCase.vitals.heartRate} bpm</strong></div>
                            <div>SpO2: <strong className={`${linkedCase.vitals.spO2 < 92 ? 'text-red-700 font-black' : 'text-emerald-700'}`}>{linkedCase.vitals.spO2}%</strong></div>
                            <div>Temp: <strong className="text-slate-900">{linkedCase.vitals.temperature}°F</strong></div>
                          </div>
                        </div>
                      )}

                      {/* Status / Timestamp */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Timestamps & Log</span>
                        <div className="text-slate-700 space-y-1 font-medium">
                          <div>Submitted: <span className="text-slate-500">{new Date(ref.createdAt).toLocaleTimeString()}</span></div>
                          {ref.hospitalApprovalTime && (
                            <div>Approved: <span className="text-emerald-700 font-bold">{new Date(ref.hospitalApprovalTime).toLocaleTimeString()}</span></div>
                          )}
                          <div>Status: <strong className="text-slate-900">{ref.status}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: NEARBY HOSPITALS DIRECTORY LIST */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="card-medical p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search nearby hospitals by name, specialty, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs font-medium pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-red-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <span className="text-xs text-slate-500 font-extrabold uppercase shrink-0">Filter:</span>
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'ALL'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Hospitals ({hospitals.length})
              </button>
              <button
                onClick={() => setFilterType('ICU')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'ICU'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ICU Available
              </button>
              <button
                onClick={() => setFilterType('TERTIARY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'TERTIARY'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tertiary Care
              </button>
            </div>
          </div>

          {/* Hospitals List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hosp) => (
              <HospitalCard
                key={hosp.id}
                hospital={hosp}
                onSelect={() => handleCalculateDirections(hosp)}
                isSelected={selectedHospitalForRoute?.id === hosp.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: LIVE ER MAP & ROUTE NAVIGATOR */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="card-medical p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Live Regional ER Map & Ambulance Routing Engine
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Interactive OpenStreetMap showing real-time patient location, nearby hospital nodes, travel distances, and emergency routes.
                </p>
              </div>

              <button
                onClick={refreshLocation}
                className="btn-primary-red px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xs"
              >
                <RefreshCw className="w-4 h-4" /> Refresh GPS Position
              </button>
            </div>

            <div className="h-[550px] rounded-2xl overflow-hidden border border-slate-200">
              <LiveMap
                userLocation={userLocation}
                hospitals={hospitals}
                selectedHospital={selectedHospitalForRoute}
                routePolyline={activeRoute?.coordinates}
                onSelectHospital={handleCalculateDirections}
                onStartDirections={handleCalculateDirections}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. APPROVAL & ICU BED RESERVATION MODAL */}
      {approvalModalRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="card-medical max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white shadow-2xl space-y-5 my-auto">

            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-50 text-red-600 border border-red-100">
                  <Bed className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Approve Patient Intake & Reserve ICU Bed</h3>
                  <p className="text-xs text-slate-500 font-medium">Target Hospital: {approvalModalRef.hospitalName}</p>
                </div>
              </div>

              <button
                onClick={() => setApprovalModalRef(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Details summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Patient Name:</span>
                <span className="text-slate-900 font-black">{approvalModalRef.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Referred By:</span>
                <span className="text-red-700 font-extrabold">{approvalModalRef.chwName} (ASHA)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Urgency Level:</span>
                <span className="text-red-600 font-extrabold uppercase">{approvalModalRef.urgency}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-slate-700">
                <strong className="text-slate-500 block mb-1">Reason:</strong>
                {approvalModalRef.reason}
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-extrabold uppercase tracking-wider block">
                  Assign ICU / Ward Bed Number:
                </label>
                <input
                  type="text"
                  value={inputBedNumber}
                  onChange={(e) => setInputBedNumber(e.target.value)}
                  placeholder="e.g. ICU-04 or WARD-12"
                  className="w-full bg-white text-slate-900 font-extrabold px-4 py-3 rounded-2xl border border-slate-200 focus:border-red-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-extrabold uppercase tracking-wider block">
                  Assign Emergency Trauma Bay / Room:
                </label>
                <input
                  type="text"
                  value={inputErBay}
                  onChange={(e) => setInputErBay(e.target.value)}
                  placeholder="e.g. Trauma Bay 02"
                  className="w-full bg-white text-slate-900 font-extrabold px-4 py-3 rounded-2xl border border-slate-200 focus:border-red-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setApprovalModalRef(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmApproval}
                disabled={isApproving}
                className="btn-primary-red px-6 py-3 rounded-2xl shadow-md text-xs font-black flex items-center gap-2"
              >
                {isApproving ? 'Reserving Bed...' : 'CONFIRM APPROVAL & BROADCAST LIVE'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
