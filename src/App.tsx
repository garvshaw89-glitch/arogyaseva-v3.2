import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Toast } from './components/common/Toast';
import { CHWLayout } from './components/layout/CHWLayout';
import { DoctorLayout } from './components/layout/DoctorLayout';
import { HospitalLayout } from './components/layout/HospitalLayout';
import { PortalRoleGuard } from './components/common/PortalRoleGuard';
import { LandingPage } from './pages/LandingPage';
import { CHWPortal } from './pages/CHWPortal';
import { DoctorPortal } from './pages/DoctorPortal';
import { HospitalPortal } from './pages/HospitalPortal';
import { EmergencyModeView } from './pages/EmergencyModeView';
import { AdminPortal } from './pages/AdminPortal';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-red-600 selection:text-white">
            <Routes>
              
              {/* Ecosystem Landing & Launcher Gateway */}
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <LandingPage />
                    <Footer />
                  </>
                }
              />

              {/* SEPARATE CHW PORTAL */}
              <Route
                path="/chw/*"
                element={
                  <PortalRoleGuard requiredRole="chw">
                    <CHWLayout>
                      <CHWPortal />
                    </CHWLayout>
                  </PortalRoleGuard>
                }
              />

              {/* SEPARATE DOCTOR PORTAL */}
              <Route
                path="/doctor/*"
                element={
                  <PortalRoleGuard requiredRole="doctor">
                    <DoctorLayout>
                      <DoctorPortal />
                    </DoctorLayout>
                  </PortalRoleGuard>
                }
              />

              {/* SEPARATE HOSPITAL PORTAL */}
              <Route
                path="/hospital/*"
                element={
                  <PortalRoleGuard requiredRole="hospital">
                    <HospitalLayout>
                      <HospitalPortal />
                    </HospitalLayout>
                  </PortalRoleGuard>
                }
              />

              {/* Emergency View */}
              <Route
                path="/emergency"
                element={
                  <>
                    <Header />
                    <EmergencyModeView />
                    <Footer />
                  </>
                }
              />

              {/* Admin Portal */}
              <Route
                path="/admin"
                element={
                  <PortalRoleGuard requiredRole="admin">
                    <>
                      <Header />
                      <AdminPortal />
                      <Footer />
                    </>
                  </PortalRoleGuard>
                }
              />

            </Routes>
            <Toast />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
