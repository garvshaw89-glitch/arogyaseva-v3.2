import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Patient, Vitals, SymptomsData, ClinicalCase } from '../../types';
import { VoiceIntakeButton } from './VoiceIntakeButton';
import { AITriageService } from '../../services/aiTriageService';
import { GeocodingService, AddressSuggestion } from '../../services/geocodingService';
import {
  User,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Weight,
  AlertTriangle,
  Sparkles,
  PlusCircle,
  FileText,
  MapPin,
  Search,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface ClinicalIntakeFormProps {
  onCaseCreated?: (createdCase: ClinicalCase) => void;
}

export const ClinicalIntakeForm: React.FC<ClinicalIntakeFormProps> = ({ onCaseCreated }) => {
  const { patients, addPatient, createCase, selectedState, userLocation } = useData();
  const { user } = useAuth();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [isAddingNewPatient, setIsAddingNewPatient] = useState(false);

  // New Patient Registration State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState<number>(45);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientAddress, setNewPatientAddress] = useState('Chinar Park, Rajarhat, Kolkata');
  const [newPatientVillage, setNewPatientVillage] = useState(selectedState.defaultVillage);
  const [customLat, setCustomLat] = useState<number>(userLocation?.latitude || selectedState.latitude);
  const [customLng, setCustomLng] = useState<number>(userLocation?.longitude || selectedState.longitude);

  // Address Autocomplete State
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  // Symptoms State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [severity, setSeverity] = useState<SymptomsData['severity']>('Moderate');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fever', 'Breathlessness']);
  const [allergies, setAllergies] = useState('Penicillin');
  const [existingConditions, setExistingConditions] = useState('Hypertension');

  // Vitals State
  const [vitals, setVitals] = useState<Vitals>({
    temperature: 99.4,
    bloodPressureSys: 140,
    bloodPressureDia: 90,
    heartRate: 98,
    spO2: 92,
    respiratoryRate: 22,
    weight: 68
  });

  // Voice Transcript
  const [voiceNoteTranscript, setVoiceNoteTranscript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Address search autocomplete debouncer
  useEffect(() => {
    if (!addressSearchQuery || addressSearchQuery.trim().length < 2) {
      setAddressSuggestions([]);
      setIsSearchingAddress(false);
      return;
    }

    setIsSearchingAddress(true);
    const timer = setTimeout(async () => {
      const results = await GeocodingService.searchAddress(addressSearchQuery);
      setAddressSuggestions(results);
      setIsSearchingAddress(false);
      setShowAddressDropdown(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [addressSearchQuery]);

  // Handle address suggestion click
  const handleSelectAddressSuggestion = (suggestion: AddressSuggestion) => {
    setNewPatientAddress(suggestion.displayName);
    setNewPatientVillage(`${suggestion.village}, ${suggestion.district}`);
    setCustomLat(suggestion.latitude);
    setCustomLng(suggestion.longitude);
    setAddressSearchQuery(suggestion.displayName);
    setShowAddressDropdown(false);
  };

  // Available symptom pills
  const availableSymptoms = [
    'Fever',
    'Breathlessness',
    'Chest Pain',
    'Cough',
    'Vomiting',
    'Headache',
    'Diarrhea',
    'Dizziness',
    'Abdominal Pain',
    'Cold Sweating'
  ];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  // Voice transcription handler
  const handleVoiceTranscript = (transcriptText: string) => {
    setVoiceNoteTranscript((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
    if (!chiefComplaint) {
      setChiefComplaint(transcriptText);
    }

    const parsed = AITriageService.parseVoiceTranscript(transcriptText);
    if (parsed.symptoms && parsed.symptoms.length > 0) {
      setSelectedSymptoms((prev) => Array.from(new Set([...prev, ...parsed.symptoms!])));
    }
    if (parsed.vitals) {
      setVitals((prev) => ({ ...prev, ...parsed.vitals }));
    }
  };

  // AI Triage calculation preview
  const aiTriage = AITriageService.analyzeCase(
    vitals,
    {
      chiefComplaint: chiefComplaint || 'Clinical evaluation by CHW',
      symptoms: selectedSymptoms,
      durationDays,
      severity,
      existingConditions: [existingConditions],
      currentMedications: [],
      allergies: [allergies]
    },
    voiceNoteTranscript
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let targetPatient = activePatient;
    if (isAddingNewPatient && newPatientName) {
      targetPatient = addPatient({
        chwId: user?.id || 'chw-wb',
        chwName: selectedState.defaultChwName,
        name: newPatientName,
        age: newPatientAge,
        gender: newPatientGender,
        phone: newPatientPhone || '+91 98000 00000',
        address: newPatientAddress || `${newPatientVillage}, ${selectedState.name}`,
        village: newPatientVillage,
        emergencyContactName: 'Family Contact',
        emergencyContactPhone: '+91 98000 00001'
      });
      setSelectedPatientId(targetPatient.id);
    }

    const symptomsData: SymptomsData = {
      chiefComplaint: chiefComplaint || 'Patient presented with acute symptoms during CHW field visit',
      symptoms: selectedSymptoms,
      durationDays,
      severity,
      existingConditions: existingConditions ? [existingConditions] : [],
      currentMedications: [],
      allergies: allergies ? [allergies] : []
    };

    const newCase = await createCase({
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      patientAge: targetPatient.age,
      patientGender: targetPatient.gender,
      patientVillage: targetPatient.village,
      chwId: user?.id || 'chw-wb',
      chwName: selectedState.defaultChwName,
      urgency: aiTriage.urgency,
      symptoms: symptomsData,
      vitals,
      voiceNoteTranscript,
      aiSummary: aiTriage.summary,
      latitude: customLat,
      longitude: customLng
    });

    setIsSubmitting(false);
    if (onCaseCreated) onCaseCreated(newCase);
  };

  return (
    <form onSubmit={handleSubmit} className="card-medical p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
            CHW Clinical Workspace • {selectedState.name}
          </span>
          <h2 className="font-extrabold text-xl text-slate-900 mt-1">Patient Clinical Intake</h2>
        </div>

        <VoiceIntakeButton onTranscript={handleVoiceTranscript} />
      </div>

      {/* 1. Address Autocomplete & Location Search Box */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 relative">
        <label className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-red-600" /> Realtime Address Autocomplete & Map Locator
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Type area name e.g. "Chinar Park", "Rajarhat"</span>
        </label>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Type address or landmark (e.g. Chinar Park, Rajarhat, Kolkata)..."
            value={addressSearchQuery}
            onChange={(e) => setAddressSearchQuery(e.target.value)}
            onFocus={() => setShowAddressDropdown(true)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 font-medium"
          />
          {isSearchingAddress && (
            <Loader2 className="w-4 h-4 text-red-600 animate-spin absolute right-3.5 top-3" />
          )}

          {/* Autocomplete Dropdown */}
          {showAddressDropdown && addressSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-300 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {addressSuggestions.map((suggestion) => (
                <div
                  key={suggestion.placeId}
                  onClick={() => handleSelectAddressSuggestion(suggestion)}
                  className="p-3 hover:bg-red-50 cursor-pointer transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{suggestion.shortName}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 font-medium">{suggestion.displayName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Coordinates & Address Pill */}
        {newPatientAddress && (
          <div className="flex items-center justify-between text-[11px] bg-red-50/70 p-2.5 rounded-xl border border-red-200 text-slate-800">
            <span className="font-extrabold text-red-700 truncate max-w-[280px]">📍 {newPatientAddress}</span>
            <span className="font-mono text-slate-600 font-bold">Lat: {customLat.toFixed(4)}, Lng: {customLng.toFixed(4)}</span>
          </div>
        )}
      </div>

      {/* 2. Patient Selection / Quick Registration */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <User className="w-4 h-4 text-red-600" /> Patient Record Selection
          </label>
          <button
            type="button"
            onClick={() => setIsAddingNewPatient(!isAddingNewPatient)}
            className="text-xs text-red-600 hover:text-red-700 font-extrabold flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {isAddingNewPatient ? 'Select Existing Patient' : 'Register New Patient'}
          </button>
        </div>

        {!isAddingNewPatient ? (
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-red-500 outline-none font-bold"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.age}y, {p.gender}) — {p.village}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="text-[11px] text-slate-600 font-extrabold block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Patient Full Name"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-extrabold block mb-1">Age & Gender</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newPatientAge}
                  onChange={(e) => setNewPatientAge(Number(e.target.value))}
                  className="w-20 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:border-red-500 outline-none"
                />
                <select
                  value={newPatientGender}
                  onChange={(e) => setNewPatientGender(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-bold focus:border-red-500 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-600 font-extrabold block mb-1">Village / Sub-center Area</label>
              <input
                type="text"
                value={newPatientVillage}
                onChange={(e) => setNewPatientVillage(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:border-red-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Vitals Input Grid */}
      <div className="space-y-3">
        <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-red-600" /> Physiological Vital Signs
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* BP */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1">BLOOD PRESSURE</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={vitals.bloodPressureSys}
                onChange={(e) => setVitals({ ...vitals, bloodPressureSys: Number(e.target.value) })}
                className="w-12 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs text-slate-900 font-extrabold text-center focus:border-red-500 outline-none"
              />
              <span className="text-slate-400 font-bold text-xs">/</span>
              <input
                type="number"
                value={vitals.bloodPressureDia}
                onChange={(e) => setVitals({ ...vitals, bloodPressureDia: Number(e.target.value) })}
                className="w-12 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs text-slate-900 font-extrabold text-center focus:border-red-500 outline-none"
              />
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block font-bold">mmHg</span>
          </div>

          {/* Heart Rate */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-600" /> HEART RATE
            </span>
            <input
              type="number"
              value={vitals.heartRate}
              onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-extrabold focus:border-red-500 outline-none"
            />
            <span className="text-[9px] text-slate-400 mt-1 block font-bold">bpm</span>
          </div>

          {/* SpO2 */}
          <div className={`p-3 rounded-xl border ${vitals.spO2 < 92 ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1 flex items-center gap-1">
              <Wind className="w-3 h-3 text-red-600" /> SpO2 OXYGEN
            </span>
            <input
              type="number"
              value={vitals.spO2}
              onChange={(e) => setVitals({ ...vitals, spO2: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-extrabold focus:border-red-500 outline-none"
            />
            <span className="text-[9px] text-slate-400 mt-1 block font-bold">% sat</span>
          </div>

          {/* Temp */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-600" /> TEMP
            </span>
            <input
              type="number"
              step="0.1"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-extrabold focus:border-red-500 outline-none"
            />
            <span className="text-[9px] text-slate-400 mt-1 block font-bold">°F</span>
          </div>

          {/* Resp Rate */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1 uppercase">RESP RATE</span>
            <input
              type="number"
              value={vitals.respiratoryRate}
              onChange={(e) => setVitals({ ...vitals, respiratoryRate: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-extrabold focus:border-red-500 outline-none"
            />
            <span className="text-[9px] text-slate-400 mt-1 block font-bold">breaths/min</span>
          </div>

          {/* Weight */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1 uppercase">WEIGHT</span>
            <input
              type="number"
              value={vitals.weight}
              onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-extrabold focus:border-red-500 outline-none"
            />
            <span className="text-[9px] text-slate-400 mt-1 block font-bold">kg</span>
          </div>
        </div>
      </div>

      {/* 4. Symptoms & Chief Complaint */}
      <div className="space-y-3">
        <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-red-600" /> Chief Complaint & Symptoms
        </label>

        <textarea
          rows={2}
          placeholder="Describe chief complaint or speak into voice intake button above..."
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />

        {/* Symptom Pills */}
        <div className="flex flex-wrap gap-1.5">
          {availableSymptoms.map((sym) => {
            const isSelected = selectedSymptoms.includes(sym);
            return (
              <button
                type="button"
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {sym}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Voice Transcript Display */}
      {voiceNoteTranscript && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs">
          <span className="font-extrabold text-red-700 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-red-600" /> Spoken Voice Transcript:
          </span>
          <p className="text-slate-800 italic font-medium">{voiceNoteTranscript}</p>
        </div>
      )}

      {/* 6. AI Clinical Triage Synthesis Box */}
      <div
        className={`p-4 rounded-xl border ${
          aiTriage.urgency === 'CRITICAL'
            ? 'bg-red-50 border-red-300 text-red-900'
            : aiTriage.urgency === 'URGENT'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-extrabold text-xs flex items-center gap-1.5 text-slate-900">
            <Sparkles className="w-4 h-4 text-red-600" /> AI Clinical Triage Assistant
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${
              aiTriage.urgency === 'CRITICAL'
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : aiTriage.urgency === 'URGENT'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {aiTriage.urgency} URGENCY
          </span>
        </div>

        <p className="text-xs leading-relaxed font-medium">{aiTriage.summary}</p>

        {aiTriage.redFlags.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-200">
            <span className="text-[10px] font-extrabold text-red-700 block mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-600" /> Vital Sign Red Flags:
            </span>
            <ul className="list-disc list-inside text-xs space-y-0.5 text-red-800 font-bold">
              {aiTriage.redFlags.map((rf, idx) => (
                <li key={idx}>{rf}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all shadow-md flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5 text-white" />
        {isSubmitting ? 'Transmitting Realtime Case to Doctor Network...' : 'Submit Case to Doctor Network'}
      </button>
    </form>
  );
};
