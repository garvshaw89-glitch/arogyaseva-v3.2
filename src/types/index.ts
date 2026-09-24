export type UserRole = 'chw' | 'doctor' | 'admin' | 'hospital';

export type CaseStatus = 
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'DOCTOR_RESPONDED'
  | 'REFERRAL_REQUIRED'
  | 'EMERGENCY'
  | 'IN_TRANSIT'
  | 'AT_HOSPITAL'
  | 'COMPLETED'
  | 'CANCELLED';

export type UrgencyLevel = 'LOW' | 'MODERATE' | 'URGENT' | 'CRITICAL';

export type ConnectionStatus = 'LIVE' | 'SYNCING' | 'OFFLINE';

export interface StateRegion {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  defaultChwName: string;
  defaultVillage: string;
  subCenterName: string;
  doctorHospitalName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  assignedVillage?: string;
  subCenterName?: string;
  hospitalName?: string;
  specialization?: string;
  availabilityStatus?: 'online' | 'busy' | 'offline';
  stateId?: string;
}

export interface Patient {
  id: string;
  chwId: string;
  chwName: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  village: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
}

export interface Vitals {
  temperature: number; // °F
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  heartRate: number; // bpm
  spO2: number; // %
  respiratoryRate: number; // breaths/min
  weight: number; // kg
}

export interface SymptomsData {
  chiefComplaint: string;
  symptoms: string[];
  durationDays: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Extreme';
  existingConditions: string[];
  currentMedications: string[];
  allergies: string[];
}

export interface ClinicalCase {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientVillage: string;
  chwId: string;
  chwName: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  status: CaseStatus;
  urgency: UrgencyLevel;
  symptoms: SymptomsData;
  vitals: Vitals;
  voiceNoteTranscript?: string;
  aiSummary?: string;
  attachments?: string[];
  doctorResponse?: DoctorResponse;
  referralId?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  isSynced?: boolean;
  stateId?: string;
}

export interface DoctorResponse {
  id: string;
  caseId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
  diagnosisNotes: string;
  recommendedAction: string;
  prescriptions: string[];
  referralRequired: boolean;
  suggestedHospitalId?: string;
  suggestedHospitalName?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  caseId: string;
  patientId: string;
  patientName: string;
  chwId: string;
  chwName: string;
  doctorId?: string;
  doctorName?: string;
  hospitalId: string;
  hospitalName: string;
  urgency: UrgencyLevel;
  reason: string;
  status: 'SUBMITTED' | 'ACCEPTED' | 'IN_TRANSIT' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
  transitVehicleType?: string;
  driverPhone?: string;
  bedNumberAssigned?: string;
  erBayNumber?: string;
  acceptedByHospital?: boolean;
  hospitalApprovalTime?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  stateId: string;
  name: string;
  type: 'Primary Health Center' | 'Community Health Center' | 'District Hospital' | 'Medical College & Tertiary Care';
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  distanceKm?: number;
  travelTimeMin?: number;
  icuBedsAvailable: number;
  totalBeds: number;
  oxygenAvailable: boolean;
  emergency24x7: boolean;
  specialties: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'CASE_NEW' | 'CASE_UPDATE' | 'DOCTOR_RESPONSE' | 'EMERGENCY' | 'REFERRAL' | 'REFERRAL_APPROVED';
  read: boolean;
  caseId?: string;
  createdAt: string;
}
