import React, { useState } from 'react';
import { ClinicalCase } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, CheckCircle2, Pill, X } from 'lucide-react';

interface DoctorAdviceModalProps {
  clinicalCase: ClinicalCase;
  onClose: () => void;
}

export const DoctorAdviceModal: React.FC<DoctorAdviceModalProps> = ({ clinicalCase, onClose }) => {
  const { submitDoctorResponse, createReferral, hospitals } = useData();
  const { user } = useAuth();

  const [diagnosisNotes, setDiagnosisNotes] = useState(
    'Clinical evaluation indicates acute exacerbation requiring structured medical intervention and oxygenation.'
  );
  const [recommendedAction, setRecommendedAction] = useState(
    'Administer prescribed initial stabilization medications, monitor SpO2 every 15 minutes, and prepare patient for transport to hospital.'
  );
  const [prescriptions, setPrescriptions] = useState<string>('Tab. Aspirin 325mg STAT, Tab. Clopidogrel 300mg STAT, O2 4L/min');
  const [referralRequired, setReferralRequired] = useState(true);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const prescriptionList = prescriptions
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    await submitDoctorResponse(
      {
        caseId: clinicalCase.id,
        doctorId: user?.id || 'doc-1',
        doctorName: user?.name || 'Dr. Anand Deshmukh, MD',
        doctorSpecialization: user?.specialization || 'Chief Medical Officer',
        hospitalName: user?.hospitalName || 'District Civil Hospital',
        diagnosisNotes,
        recommendedAction,
        prescriptions: prescriptionList,
        referralRequired,
        suggestedHospitalId: referralRequired ? selectedHospital.id : undefined,
        suggestedHospitalName: referralRequired ? selectedHospital.name : undefined
      },
      referralRequired ? 'REFERRAL_REQUIRED' : 'DOCTOR_RESPONDED'
    );

    if (referralRequired && selectedHospital) {
      await createReferral({
        caseId: clinicalCase.id,
        patientId: clinicalCase.patientId,
        patientName: clinicalCase.patientName,
        chwId: clinicalCase.chwId,
        chwName: clinicalCase.chwName,
        doctorId: user?.id || 'doc-1',
        doctorName: user?.name || 'Dr. Anand Deshmukh, MD',
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        urgency: clinicalCase.urgency,
        reason: diagnosisNotes,
        transitVehicleType: 'Emergency Cardiac Ambulance (108)',
        driverPhone: '+91 98221 10800'
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="card-medical rounded-2xl max-w-2xl w-full p-6 bg-white border border-slate-200 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-700 border border-red-200">
              <Stethoscope className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider">Doctor Clinical Review</span>
              <h3 className="font-extrabold text-base text-slate-900">Advice for Patient: {clinicalCase.patientName}</h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Diagnosis Notes */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-1">Doctor Diagnosis & Clinical Findings</label>
            <textarea
              rows={2}
              value={diagnosisNotes}
              onChange={(e) => setDiagnosisNotes(e.target.value)}
              required
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Recommended Action */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-1">Recommended Treatment Protocol for CHW</label>
            <textarea
              rows={2}
              value={recommendedAction}
              onChange={(e) => setRecommendedAction(e.target.value)}
              required
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Prescriptions */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-1 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" /> Prescribed Medications / First Aid (comma separated)
            </label>
            <input
              type="text"
              value={prescriptions}
              onChange={(e) => setPrescriptions(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Hospital Referral Checkbox & Selector */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={referralRequired}
                onChange={(e) => setReferralRequired(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-0"
              />
              <span>Authorize Hospital Referral & Emergency Bed Reservation</span>
            </label>

            {referralRequired && (
              <div>
                <label className="text-[11px] text-slate-600 font-extrabold block mb-1">Select Target Hospital Facility</label>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold outline-none focus:border-red-500"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.type}) — {h.icuBedsAvailable} ICU beds available
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-extrabold text-sm btn-primary-red text-white shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            {isSubmitting ? 'Transmitting Realtime Response...' : 'Transmit Doctor Response to CHW Device'}
          </button>
        </form>
      </div>
    </div>
  );
};
