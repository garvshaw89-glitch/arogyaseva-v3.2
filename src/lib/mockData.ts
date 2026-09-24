import { Hospital, UserProfile, Patient, ClinicalCase, NotificationItem, StateRegion, Referral } from '../types';

export const INDIAN_STATES: StateRegion[] = [
  {
    id: 'wb-kolkata',
    name: 'West Bengal',
    district: 'Kolkata & South 24 Parganas',
    latitude: 22.5726,
    longitude: 88.3639,
    defaultChwName: 'Anjali Das (ASHA CHW)',
    defaultVillage: 'Bhangur Village, South 24 Parganas',
    subCenterName: 'Bhangur Rural Sub-Centre',
    doctorHospitalName: 'IPGMER & SSKM Hospital, Kolkata'
  },
  {
    id: 'mh-satara',
    name: 'Maharashtra',
    district: 'Satara & Pune Rural',
    latitude: 17.6805,
    longitude: 74.0183,
    defaultChwName: 'Sunita Patil (ASHA CHW)',
    defaultVillage: 'Wadhe Village, Satara',
    subCenterName: 'Wadhe Rural Sub-Centre',
    doctorHospitalName: 'Satara District Civil Hospital'
  },
  {
    id: 'up-varanasi',
    name: 'Uttar Pradesh',
    district: 'Varanasi & Purvanchal',
    latitude: 25.3176,
    longitude: 82.9739,
    defaultChwName: 'Pooja Sharma (ASHA CHW)',
    defaultVillage: 'Kashi Dehat Village, Varanasi',
    subCenterName: 'Pindra Sub-Centre',
    doctorHospitalName: 'BHU Sir Sunderlal Hospital, Varanasi'
  },
  {
    id: 'dl-ncr',
    name: 'Delhi NCR',
    district: 'Delhi & Najafgarh Rural',
    latitude: 28.6139,
    longitude: 77.2090,
    defaultChwName: 'Meena Kumari (ASHA CHW)',
    defaultVillage: 'Najafgarh Rural, Delhi',
    subCenterName: 'Najafgarh Health Sub-Center',
    doctorHospitalName: 'AIIMS New Delhi'
  },
  {
    id: 'ka-bengaluru',
    name: 'Karnataka',
    district: 'Bengaluru & Ramanagara',
    latitude: 12.9716,
    longitude: 77.5946,
    defaultChwName: 'Kavitha Gowda (ASHA CHW)',
    defaultVillage: 'Bidadi Village, Ramanagara',
    subCenterName: 'Bidadi Sub-Centre',
    doctorHospitalName: 'Victoria Hospital & BMCRI, Bengaluru'
  },
  {
    id: 'tn-chennai',
    name: 'Tamil Nadu',
    district: 'Chennai & Chengalpattu',
    latitude: 13.0827,
    longitude: 80.2707,
    defaultChwName: 'Lakshmi Selvam (ASHA CHW)',
    defaultVillage: 'Chengalpattu Village, TN',
    subCenterName: 'Chengalpattu Sub-Centre',
    doctorHospitalName: 'Rajiv Gandhi General Hospital (RGGGH), Chennai'
  },
  {
    id: 'br-patna',
    name: 'Bihar',
    district: 'Patna & Hajipur Rural',
    latitude: 25.5941,
    longitude: 85.1376,
    defaultChwName: 'Sita Devi (ASHA CHW)',
    defaultVillage: 'Hajipur Rural, Vaishali',
    subCenterName: 'Hajipur Health Sub-Centre',
    doctorHospitalName: 'Patna Medical College & Hospital (PMCH)'
  },
  {
    id: 'rj-jaipur',
    name: 'Rajasthan',
    district: 'Jaipur & Bassi Rural',
    latitude: 26.9124,
    longitude: 75.7873,
    defaultChwName: 'Pinky Kanwar (ASHA CHW)',
    defaultVillage: 'Bassi Village, Jaipur',
    subCenterName: 'Bassi Rural Sub-Centre',
    doctorHospitalName: 'SMS Medical College & Hospital, Jaipur'
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  // West Bengal Hospitals (Kolkata)
  {
    id: 'hosp-wb-1',
    stateId: 'wb-kolkata',
    name: 'IPGMER & SSKM Hospital',
    type: 'Medical College & Tertiary Care',
    latitude: 22.5393,
    longitude: 88.3444,
    address: '244 AJC Bose Road, Bhowanipore, Kolkata, West Bengal 700020',
    phone: '+91 33 2223 1589',
    totalBeds: 1800,
    icuBedsAvailable: 45,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['Cardiology', 'Neurosurgery', 'Advanced Trauma', 'Oncology', 'Neonatal ICU']
  },
  {
    id: 'hosp-wb-2',
    stateId: 'wb-kolkata',
    name: 'Calcutta Medical College & Hospital',
    type: 'Medical College & Tertiary Care',
    latitude: 22.5735,
    longitude: 88.3622,
    address: '88 College Street, Bowbazar, Kolkata, West Bengal 700073',
    phone: '+91 33 2241 4901',
    totalBeds: 1500,
    icuBedsAvailable: 38,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['General Medicine', 'Maternal & Child Health', 'Burn Unit', 'Pulmonology']
  },
  {
    id: 'hosp-wb-3',
    stateId: 'wb-kolkata',
    name: 'Nil Ratan Sircar (NRS) Medical College Hospital',
    type: 'District Hospital',
    latitude: 22.5638,
    longitude: 88.3712,
    address: '138 AJC Bose Road, Sealdah, Kolkata, West Bengal 700014',
    phone: '+91 33 2286 0033',
    totalBeds: 1200,
    icuBedsAvailable: 30,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['Orthopedics', 'Emergency Triage', 'Dialysis', 'Pediatrics']
  },
  {
    id: 'hosp-wb-4',
    stateId: 'wb-kolkata',
    name: 'Diamond Harbour Sub-District Hospital',
    type: 'Community Health Center',
    latitude: 22.1932,
    longitude: 88.1925,
    address: 'Hospital Road, Diamond Harbour, South 24 Parganas, West Bengal 743331',
    phone: '+91 3174 255220',
    totalBeds: 250,
    icuBedsAvailable: 10,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['Maternal Health', 'Snakebite Triage', 'Primary Care']
  },

  // Maharashtra Hospitals (Satara / Pune)
  {
    id: 'hosp-mh-1',
    stateId: 'mh-satara',
    name: 'Satara District Civil Hospital',
    type: 'District Hospital',
    latitude: 17.6805,
    longitude: 74.0183,
    address: 'Sadar Bazar Road, Near Powai Naka, Satara, Maharashtra 415001',
    phone: '+91 2162 234101',
    totalBeds: 450,
    icuBedsAvailable: 14,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['General Medicine', 'Cardiology', 'Trauma & Emergency', 'Obstetrics', 'Pediatrics']
  },
  {
    id: 'hosp-mh-2',
    stateId: 'mh-satara',
    name: 'Karad Community Health Centre (CHC)',
    type: 'Community Health Center',
    latitude: 17.2865,
    longitude: 74.1812,
    address: 'Hospital Road, Karad, Satara District, Maharashtra 415110',
    phone: '+91 2164 220556',
    totalBeds: 100,
    icuBedsAvailable: 4,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['General Surgery', 'Internal Medicine', 'Maternal Health']
  },
  {
    id: 'hosp-mh-3',
    stateId: 'mh-satara',
    name: 'Government Medical College & Super Specialty Hospital',
    type: 'Medical College & Tertiary Care',
    latitude: 17.6922,
    longitude: 74.0045,
    address: 'Shendre Bypass Highway, Satara, Maharashtra 415004',
    phone: '+91 2162 260190',
    totalBeds: 750,
    icuBedsAvailable: 32,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['Neurosurgery', 'Cardiothoracic Surgery', 'Advanced ICU', 'Dialysis']
  },

  // Uttar Pradesh Hospitals (Varanasi)
  {
    id: 'hosp-up-1',
    stateId: 'up-varanasi',
    name: 'BHU Sir Sunderlal Hospital',
    type: 'Medical College & Tertiary Care',
    latitude: 25.2754,
    longitude: 82.9995,
    address: 'Banaras Hindu University Campus, Varanasi, Uttar Pradesh 221005',
    phone: '+91 542 236 9291',
    totalBeds: 1500,
    icuBedsAvailable: 40,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency Triage', 'ICU']
  },
  {
    id: 'hosp-up-2',
    stateId: 'up-varanasi',
    name: 'Pandit Deen Dayal Upadhyay District Hospital',
    type: 'District Hospital',
    latitude: 25.3210,
    longitude: 82.9840,
    address: 'Pandeypur, Varanasi, Uttar Pradesh 221002',
    phone: '+91 542 250 2201',
    totalBeds: 450,
    icuBedsAvailable: 18,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['General Medicine', 'Surgery', 'Maternal Health', 'Pediatrics']
  },

  // Delhi NCR Hospitals
  {
    id: 'hosp-dl-1',
    stateId: 'dl-ncr',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'Medical College & Tertiary Care',
    latitude: 28.5672,
    longitude: 77.2100,
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    phone: '+91 11 2658 8500',
    totalBeds: 2500,
    icuBedsAvailable: 65,
    oxygenAvailable: true,
    emergency24x7: true,
    specialties: ['Trauma Center', 'Cardiothoracic', 'Transplant Unit', 'Neurosurgery']
  }
];

export const DEMO_PROFILES: Record<string, UserProfile> = {
  chw: {
    id: 'user-chw-wb',
    email: 'anjali.chw@arogyaseva.org',
    name: 'Anjali Das (ASHA CHW)',
    role: 'chw',
    phone: '+91 98301 44301',
    assignedVillage: 'Bhangur Village, South 24 Parganas',
    subCenterName: 'Bhangur Rural Sub-Centre',
    stateId: 'wb-kolkata',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  doctor: {
    id: 'user-doc-wb',
    email: 'dr.subir.roy@sskm.gov.in',
    name: 'Dr. Subir Roy, MD',
    role: 'doctor',
    phone: '+91 98310 11982',
    hospitalName: 'IPGMER & SSKM Hospital, Kolkata',
    specialization: 'Chief Triage Officer / Cardiology',
    availabilityStatus: 'online',
    stateId: 'wb-kolkata',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
  },
  hospital: {
    id: 'user-hosp-admin',
    email: 'er.admin@sskm.gov.in',
    name: 'ER Chief Coordinator (SSKM Kolkata)',
    role: 'hospital',
    phone: '+91 33 2223 9900',
    hospitalName: 'IPGMER & SSKM Hospital, Kolkata',
    specialization: 'Emergency Admissions & ICU Desk',
    stateId: 'wb-kolkata',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=200'
  },
  admin: {
    id: 'user-admin-1',
    email: 'admin@arogyaseva.org',
    name: 'National Rural Health Mission Admin',
    role: 'admin',
    phone: '+91 11 2306 0000',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  }
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    chwId: 'user-chw-wb',
    chwName: 'Anjali Das (ASHA CHW)',
    name: 'Rameshwar Vitthal Shinde',
    age: 52,
    gender: 'Male',
    phone: '+91 98301 23412',
    address: 'House #42, Near Gram Panchayat, Bhangur',
    village: 'Bhangur Village, WB',
    emergencyContactName: 'Sharda Shinde (Wife)',
    emergencyContactPhone: '+91 98301 23415',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'pat-102',
    chwId: 'user-chw-wb',
    chwName: 'Anjali Das (ASHA CHW)',
    name: 'Priyanka Ashok Kadam',
    age: 26,
    gender: 'Female',
    phone: '+91 97632 99182',
    address: 'Near Water Tank, Diamond Harbour Road',
    village: 'Bhangur Village, WB',
    emergencyContactName: 'Ashok Kadam (Husband)',
    emergencyContactPhone: '+91 97632 99183',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  }
];

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref-901',
    caseId: 'case-801',
    patientId: 'pat-101',
    patientName: 'Rameshwar Vitthal Shinde',
    chwId: 'user-chw-wb',
    chwName: 'Anjali Das (ASHA CHW)',
    doctorId: 'user-doc-wb',
    doctorName: 'Dr. Subir Roy, MD',
    hospitalId: 'hosp-wb-1',
    hospitalName: 'IPGMER & SSKM Hospital, Kolkata',
    urgency: 'URGENT',
    reason: 'High suspicion of Acute Myocardial Infarction. Immediate ICU admission and ECG required.',
    status: 'SUBMITTED',
    transitVehicleType: 'Emergency Cardiac Ambulance (108)',
    driverPhone: '+91 98301 10800',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  }
];

export const INITIAL_CASES: ClinicalCase[] = [
  {
    id: 'case-801',
    patientId: 'pat-101',
    patientName: 'Rameshwar Vitthal Shinde',
    patientAge: 52,
    patientGender: 'Male',
    patientVillage: 'Bhangur Village, WB',
    chwId: 'user-chw-wb',
    chwName: 'Anjali Das (ASHA CHW)',
    assignedDoctorId: 'user-doc-wb',
    assignedDoctorName: 'Dr. Subir Roy, MD',
    status: 'REFERRAL_REQUIRED',
    urgency: 'URGENT',
    stateId: 'wb-kolkata',
    symptoms: {
      chiefComplaint: 'Acute chest tightness, shortness of breath, radiating arm discomfort for 4 hours',
      symptoms: ['Chest Pain', 'Breathlessness', 'Cold Sweating', 'Dizziness'],
      durationDays: 1,
      severity: 'Severe',
      existingConditions: ['Hypertension', 'Type-2 Diabetes'],
      currentMedications: ['Amlodipine 5mg'],
      allergies: ['Penicillin']
    },
    vitals: {
      temperature: 98.8,
      bloodPressureSys: 162,
      bloodPressureDia: 98,
      heartRate: 104,
      spO2: 91,
      respiratoryRate: 24,
      weight: 72
    },
    voiceNoteTranscript: 'Patient complains of central chest tightness starting around 8 AM. Radiation to left arm.',
    aiSummary: '🔴 HIGH RISK CLINICAL TRIAGE: SpO2 91%, BP 162/98. Immediate referral to SSKM Hospital Kolkata ICU advised.',
    latitude: 22.5726,
    longitude: 88.3639,
    doctorResponse: {
      id: 'resp-801',
      caseId: 'case-801',
      doctorId: 'user-doc-wb',
      doctorName: 'Dr. Subir Roy, MD',
      doctorSpecialization: 'Internal Medicine / Cardiology Triage',
      hospitalName: 'IPGMER & SSKM Hospital, Kolkata',
      diagnosisNotes: 'High suspicion of Acute Myocardial Infarction. Immediate oxygenation and ECG required.',
      recommendedAction: 'Administer Aspirin 325mg stat, O2 therapy 4L/min, dispatch cardiac ambulance to SSKM Hospital Kolkata.',
      prescriptions: ['Tab. Aspirin 325mg STAT', 'Tab. Clopidogrel 300mg STAT'],
      referralRequired: true,
      suggestedHospitalId: 'hosp-wb-1',
      suggestedHospitalName: 'IPGMER & SSKM Hospital, Kolkata',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    referralId: 'ref-901',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    isSynced: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-chw-wb',
    title: 'Doctor Responded',
    message: 'Dr. Subir Roy provided emergency advice & referral to SSKM Hospital for Patient Rameshwar Shinde',
    type: 'DOCTOR_RESPONSE',
    read: false,
    caseId: 'case-801',
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];
