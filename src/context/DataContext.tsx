import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Patient,
  ClinicalCase,
  DoctorResponse,
  Referral,
  Hospital,
  NotificationItem,
  ConnectionStatus,
  StateRegion
} from '../types';
import {
  INITIAL_CASES,
  INITIAL_PATIENTS,
  INITIAL_HOSPITALS,
  INITIAL_REFERRALS,
  INITIAL_NOTIFICATIONS,
  INDIAN_STATES
} from '../lib/mockData';
import { realtimeService, RealtimePayload } from '../services/realtimeService';
import { OfflineSyncService } from '../services/offlineSyncService';
import { LocationService, UserCoordinates } from '../services/locationService';
import { HospitalService } from '../services/hospitalService';

interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type: 'CASE_NEW' | 'CASE_UPDATE' | 'DOCTOR_RESPONSE' | 'EMERGENCY' | 'REFERRAL' | 'REFERRAL_APPROVED';
  createdAt: string;
}

interface DataContextType {
  selectedState: StateRegion;
  allStates: StateRegion[];
  patients: Patient[];
  cases: ClinicalCase[];
  referrals: Referral[];
  hospitals: Hospital[];
  notifications: NotificationItem[];
  connectionStatus: ConnectionStatus;
  pendingSyncCount: number;
  userLocation: UserCoordinates | null;
  activeToast: ToastAlert | null;
  audioAlertEnabled: boolean;
  selectState: (stateId: string) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Patient;
  createCase: (caseData: Omit<ClinicalCase, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<ClinicalCase>;
  submitDoctorResponse: (response: Omit<DoctorResponse, 'id' | 'createdAt'>, caseStatus?: ClinicalCase['status']) => Promise<void>;
  updateCaseStatus: (caseId: string, status: ClinicalCase['status']) => Promise<void>;
  createReferral: (referralData: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Referral>;
  approveReferral: (referralId: string, bedNumber?: string, erBay?: string) => Promise<void>;
  rejectReferral: (referralId: string, reason: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  triggerManualSync: () => Promise<void>;
  refreshLocation: () => Promise<UserCoordinates>;
  setAudioAlertEnabled: (enabled: boolean) => void;
  dismissToast: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedState, setSelectedState] = useState<StateRegion>(INDIAN_STATES[0]);
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('arogyaseva_saved_patients_v3');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch (e) {
      return INITIAL_PATIENTS;
    }
  });

  const [cases, setCases] = useState<ClinicalCase[]>(() => {
    try {
      const saved = localStorage.getItem('arogyaseva_saved_cases_v3');
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch (e) {
      return INITIAL_CASES;
    }
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    try {
      const saved = localStorage.getItem('arogyaseva_saved_referrals_v3');
      return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
    } catch (e) {
      return INITIAL_REFERRALS;
    }
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(
    INITIAL_HOSPITALS.filter((h) => h.stateId === INDIAN_STATES[0].id)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('arogyaseva_saved_notifications_v3');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('LIVE');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>({
    latitude: INDIAN_STATES[0].latitude,
    longitude: INDIAN_STATES[0].longitude,
    accuracy: 10,
    timestamp: Date.now(),
    isFallback: false
  });
  const [activeToast, setActiveToast] = useState<ToastAlert | null>(null);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState<boolean>(true);

  // Auto-persist state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('arogyaseva_saved_cases_v3', JSON.stringify(cases));
    } catch (e) {}
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem('arogyaseva_saved_patients_v3', JSON.stringify(patients));
    } catch (e) {}
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('arogyaseva_saved_referrals_v3', JSON.stringify(referrals));
    } catch (e) {}
  }, [referrals]);

  useEffect(() => {
    try {
      localStorage.setItem('arogyaseva_saved_notifications_v3', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);


  // Sound alert player
  const playAlertSound = useCallback((type: string) => {
    if (!audioAlertEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type === 'EMERGENCY' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(type === 'EMERGENCY' ? 880 : 587.33, ctx.currentTime);
      if (type === 'EMERGENCY') {
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      }

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Web Audio Playback failed:', e);
    }
  }, [audioAlertEnabled]);

  const showToast = useCallback((toast: Omit<ToastAlert, 'id' | 'createdAt'>) => {
    const newToast: ToastAlert = {
      ...toast,
      id: 'toast-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setActiveToast(newToast);
    playAlertSound(toast.type);
  }, [playAlertSound]);

  const dismissToast = () => setActiveToast(null);

  // Trigger live location fetch & recalculate distances to ALL hospitals
  const refreshLocation = async (): Promise<UserCoordinates> => {
    const loc = await LocationService.getCurrentPosition();
    setUserLocation(loc);

    // Recalculate distance to all hospitals
    setHospitals((prev) =>
      prev.map((h) => {
        const dist = LocationService.calculateDistanceKm(loc.latitude, loc.longitude, h.latitude, h.longitude);
        return {
          ...h,
          distanceKm: dist,
          travelTimeMin: Math.max(5, Math.round((dist / 40) * 60))
        };
      })
    );

    showToast({
      title: '📍 Patient Live Location Pinpointed',
      message: `GPS Lat: ${loc.latitude.toFixed(4)}, Long: ${loc.longitude.toFixed(4)}. Distance to all hospitals recalculated.`,
      type: 'CASE_UPDATE'
    });

    return loc;
  };

  // Switch State Region
  const selectState = async (stateId: string) => {
    const targetState = INDIAN_STATES.find((s) => s.id === stateId) || INDIAN_STATES[0];
    setSelectedState(targetState);

    setUserLocation({
      latitude: targetState.latitude,
      longitude: targetState.longitude,
      accuracy: 12,
      timestamp: Date.now(),
      isFallback: false
    });

    const fetchedHospitals = await HospitalService.fetchNearbyHospitals(
      targetState.latitude,
      targetState.longitude,
      35
    );

    const stateHospitals = INITIAL_HOSPITALS.filter((h) => h.stateId === targetState.id);
    const combined = [...stateHospitals];
    fetchedHospitals.forEach((h) => {
      if (!combined.some((item) => item.name.toLowerCase().includes(h.name.toLowerCase()))) {
        combined.push({ ...h, stateId: targetState.id });
      }
    });

    setHospitals(combined);

    showToast({
      title: `📍 Region Switched: ${targetState.name}`,
      message: `Jurisdiction updated to ${targetState.district}. Hospitals re-indexed.`,
      type: 'CASE_UPDATE'
    });
  };

  // Monitor browser online / offline state
  useEffect(() => {
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        setConnectionStatus('SYNCING');
        triggerManualSync().then(() => setConnectionStatus('LIVE'));
      } else {
        setConnectionStatus('OFFLINE');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Check pending offline items count
  useEffect(() => {
    OfflineSyncService.getPendingCount().then(setPendingSyncCount);
  }, [cases]);

  // Real-time network listener
  useEffect(() => {
    const unsubscribe = realtimeService.on('*', (payload: RealtimePayload) => {
      if (payload.type === 'CASE_CREATED') {
        const newCase: ClinicalCase = payload.data;
        setCases((prev) => {
          if (prev.some((c) => c.id === newCase.id)) return prev;
          return [newCase, ...prev];
        });

        const notif: NotificationItem = {
          id: 'notif-' + Date.now(),
          userId: 'doctor',
          title: newCase.urgency === 'CRITICAL' ? '🚨 EMERGENCY CASE CREATED' : '🔔 NEW CLINICAL CASE',
          message: `New case submitted by ${newCase.chwName} for patient ${newCase.patientName} (${newCase.urgency} Urgency)`,
          type: newCase.urgency === 'CRITICAL' ? 'EMERGENCY' : 'CASE_NEW',
          read: false,
          caseId: newCase.id,
          createdAt: new Date().toISOString()
        };
        setNotifications((prev) => [notif, ...prev]);
        showToast({
          title: notif.title,
          message: notif.message,
          type: notif.type
        });
      }

      if (payload.type === 'CASE_UPDATED') {
        const updatedCase: ClinicalCase = payload.data;
        setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? { ...c, ...updatedCase } : c)));
      }

      if (payload.type === 'REFERRAL_UPDATED') {
        const ref: Referral = payload.data;
        setReferrals((prev) => {
          const idx = prev.findIndex((r) => r.id === ref.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = ref;
            return copy;
          }
          return [ref, ...prev];
        });

        if (ref.status === 'ACCEPTED') {
          showToast({
            title: '✅ HOSPITAL APPROVED REFERRAL',
            message: `${ref.hospitalName} approved referral for ${ref.patientName}! ICU Bed #${ref.bedNumberAssigned || '04'} reserved.`,
            type: 'REFERRAL_APPROVED'
          });
        }
      }

      if (payload.type === 'DOCTOR_RESPONSE_CREATED') {
        const responseData = payload.data;
        setCases((prev) =>
          prev.map((c) => {
            if (c.id === responseData.caseId) {
              return {
                ...c,
                status: responseData.referralRequired ? 'REFERRAL_REQUIRED' : 'DOCTOR_RESPONDED',
                doctorResponse: responseData,
                updatedAt: new Date().toISOString()
              };
            }
            return c;
          })
        );

        const notif: NotificationItem = {
          id: 'notif-' + Date.now(),
          userId: 'chw',
          title: '👨‍⚕️ Doctor Response Received',
          message: `${responseData.doctorName} submitted clinical advice for Case #${responseData.caseId.slice(-4)}`,
          type: 'DOCTOR_RESPONSE',
          read: false,
          caseId: responseData.caseId,
          createdAt: new Date().toISOString()
        };
        setNotifications((prev) => [notif, ...prev]);
        showToast({
          title: notif.title,
          message: notif.message,
          type: 'DOCTOR_RESPONSE'
        });
      }
    });

    return () => unsubscribe();
  }, [showToast]);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: 'pat-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString()
    };
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  };

  const createCase = async (
    caseData: Omit<ClinicalCase, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<ClinicalCase> => {
    const newCase: ClinicalCase = {
      ...caseData,
      id: 'case-' + Date.now().toString().slice(-6),
      status: caseData.urgency === 'CRITICAL' ? 'EMERGENCY' : 'NEW',
      stateId: selectedState.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSynced: navigator.onLine
    };

    setCases((prev) => [newCase, ...prev]);

    if (!navigator.onLine) {
      await OfflineSyncService.queueCaseForSync(newCase);
      setPendingSyncCount((prev) => prev + 1);
    } else {
      realtimeService.publish('CASE_CREATED', newCase);
    }

    return newCase;
  };

  const submitDoctorResponse = async (
    responseData: Omit<DoctorResponse, 'id' | 'createdAt'>,
    caseStatus: ClinicalCase['status'] = 'DOCTOR_RESPONDED'
  ): Promise<void> => {
    const fullResponse: DoctorResponse = {
      ...responseData,
      id: 'resp-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString()
    };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === responseData.caseId) {
          return {
            ...c,
            status: responseData.referralRequired ? 'REFERRAL_REQUIRED' : caseStatus,
            doctorResponse: fullResponse,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );

    realtimeService.publish('DOCTOR_RESPONSE_CREATED', fullResponse);
  };

  const updateCaseStatus = async (caseId: string, status: ClinicalCase['status']): Promise<void> => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );

    const targetCase = cases.find((c) => c.id === caseId);
    if (targetCase) {
      realtimeService.publish('CASE_UPDATED', { ...targetCase, status, updatedAt: new Date().toISOString() });
    }
  };

  const createReferral = async (
    referralData: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<Referral> => {
    const newReferral: Referral = {
      ...referralData,
      id: 'ref-' + Date.now().toString().slice(-6),
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setReferrals((prev) => [newReferral, ...prev]);
    await updateCaseStatus(referralData.caseId, 'REFERRAL_REQUIRED');
    realtimeService.publish('REFERRAL_UPDATED', newReferral);

    showToast({
      title: '🚑 Hospital Referral Transmitted',
      message: `Referral submitted to ${referralData.hospitalName} for ${referralData.patientName}`,
      type: 'REFERRAL'
    });

    return newReferral;
  };

  // Hospital Portal Approval Action
  const approveReferral = async (
    referralId: string,
    bedNumber: string = 'ICU-04',
    erBay: string = 'Bay 02'
  ): Promise<void> => {
    const targetRef = referrals.find((r) => r.id === referralId);
    if (!targetRef) return;

    const updatedRef: Referral = {
      ...targetRef,
      status: 'ACCEPTED',
      acceptedByHospital: true,
      bedNumberAssigned: bedNumber,
      erBayNumber: erBay,
      hospitalApprovalTime: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setReferrals((prev) => prev.map((r) => (r.id === referralId ? updatedRef : r)));

    // Decrement available ICU beds on hospital by 1
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === targetRef.hospitalId
          ? { ...h, icuBedsAvailable: Math.max(0, h.icuBedsAvailable - 1) }
          : h
      )
    );

    // Update case status to IN_TRANSIT
    await updateCaseStatus(targetRef.caseId, 'IN_TRANSIT');

    // Broadcast across realtime WebSocket network
    realtimeService.publish('REFERRAL_UPDATED', updatedRef);

    showToast({
      title: '✅ HOSPITAL APPROVED REFERRAL',
      message: `${targetRef.hospitalName} approved referral for ${targetRef.patientName}! ${bedNumber} reserved.`,
      type: 'REFERRAL_APPROVED'
    });
  };

  const rejectReferral = async (referralId: string, reason: string): Promise<void> => {
    const targetRef = referrals.find((r) => r.id === referralId);
    if (!targetRef) return;

    const updatedRef: Referral = {
      ...targetRef,
      status: 'CANCELLED',
      acceptedByHospital: false,
      rejectionReason: reason,
      updatedAt: new Date().toISOString()
    };

    setReferrals((prev) => prev.map((r) => (r.id === referralId ? updatedRef : r)));
    realtimeService.publish('REFERRAL_UPDATED', updatedRef);

    showToast({
      title: '⚠️ Referral Redirected',
      message: `Referral updated: ${reason}`,
      type: 'REFERRAL'
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const triggerManualSync = async (): Promise<void> => {
    setConnectionStatus('SYNCING');
    const pendingCases = await OfflineSyncService.getPendingQueue();

    for (const c of pendingCases) {
      realtimeService.publish('CASE_CREATED', { ...c, isSynced: true });
      await OfflineSyncService.clearSyncedCase(c.id);
    }

    setPendingSyncCount(0);
    setConnectionStatus('LIVE');

    showToast({
      title: '✅ Sync Completed',
      message: `${pendingCases.length} offline records successfully synchronized to central server`,
      type: 'CASE_UPDATE'
    });
  };

  return (
    <DataContext.Provider
      value={{
        selectedState,
        allStates: INDIAN_STATES,
        patients,
        cases,
        referrals,
        hospitals,
        notifications,
        connectionStatus,
        pendingSyncCount,
        userLocation,
        activeToast,
        audioAlertEnabled,
        selectState,
        addPatient,
        createCase,
        submitDoctorResponse,
        updateCaseStatus,
        createReferral,
        approveReferral,
        rejectReferral,
        markNotificationRead,
        triggerManualSync,
        refreshLocation,
        setAudioAlertEnabled,
        dismissToast
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
