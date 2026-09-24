import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  Stethoscope,
  Bell,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  RefreshCw,
  ShieldAlert,
  UserCheck,
  Building2,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Header: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const {
    connectionStatus,
    pendingSyncCount,
    notifications,
    markNotificationRead,
    audioAlertEnabled,
    setAudioAlertEnabled,
    triggerManualSync
  } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 nav-medical shadow-xs px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo - Red & White Medical Theme */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 p-0.5 shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">AROGYA</span>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-red-600">SEVA</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold tracking-wide hidden sm:block">RURAL HEALTHCARE PLATFORM</p>
          </div>
        </Link>

        {/* Desktop Navigation Portal Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              location.pathname === '/'
                ? 'bg-white text-red-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Ecosystem
          </Link>
          <Link
            to="/chw"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              location.pathname.startsWith('/chw')
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            CHW Portal
          </Link>
          <Link
            to="/doctor"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              location.pathname.startsWith('/doctor')
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Doctor Portal
          </Link>
          <Link
            to="/hospital"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              location.pathname.startsWith('/hospital')
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Hospital ER
          </Link>
          <Link
            to="/emergency"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              location.pathname.startsWith('/emergency')
                ? 'bg-red-600 text-white shadow-xs animate-pulse'
                : 'text-red-600 hover:bg-red-50 font-extrabold'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Emergency
          </Link>
          <Link
            to="/admin"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              location.pathname.startsWith('/admin')
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Admin
          </Link>
        </nav>

        {/* Status, Audio & Role Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Realtime Connection Status Pill */}
          <div className="flex items-center gap-2">
            {connectionStatus === 'LIVE' && (
              <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <Wifi className="w-3 h-3" />
                <span className="hidden xs:inline">LIVE</span>
              </span>
            )}
            {connectionStatus === 'SYNCING' && (
              <button
                onClick={triggerManualSync}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse"
              >
                <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                <span>SYNCING ({pendingSyncCount})</span>
              </button>
            )}
            {connectionStatus === 'OFFLINE' && (
              <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                <WifiOff className="w-3 h-3 text-red-600" />
                <span className="hidden xs:inline">OFFLINE</span> ({pendingSyncCount})
              </span>
            )}
          </div>

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
            title={audioAlertEnabled ? 'Sound Alerts On' : 'Sound Alerts Muted'}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
          >
            {audioAlertEnabled ? <Volume2 className="w-4 h-4 text-red-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 relative"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center animate-bounce shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-96 card-medical rounded-2xl p-3 sm:p-4 shadow-xl z-50 border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-red-600" /> Realtime Notifications
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold">{notifications.length} total</span>
                </div>

                <div className="max-h-72 sm:max-h-80 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No active notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl transition-all cursor-pointer border ${
                          n.read
                            ? 'bg-slate-50 border-slate-100 opacity-60'
                            : 'bg-red-50/70 border-red-200 hover:border-red-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-extrabold text-red-700">{n.title}</h4>
                          <span className="text-[9px] text-slate-400 font-semibold">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & User Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:pr-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all min-h-[40px]"
            >
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'}
                alt={user?.name}
                className="w-7 h-7 rounded-xl object-cover border border-red-500"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-slate-900 leading-tight truncate max-w-[110px]">{user?.name}</p>
                <p className="text-[10px] text-red-600 font-bold uppercase">{role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 card-medical rounded-2xl p-2 shadow-xl z-50 border border-slate-200">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Switch Portal Role</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Test physical multi-role sync</p>
                </div>

                <button
                  onClick={() => {
                    switchRole('chw');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all mb-1 ${
                    role === 'chw' ? 'bg-red-50 text-red-700 border border-red-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-600" />
                    <span>CHW (Sunita)</span>
                  </div>
                  {role === 'chw' && <UserCheck className="w-3.5 h-3.5 text-red-600" />}
                </button>

                <button
                  onClick={() => {
                    switchRole('doctor');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all mb-1 ${
                    role === 'doctor' ? 'bg-red-50 text-red-700 border border-red-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-red-600" />
                    <span>Doctor (Dr. Anand)</span>
                  </div>
                  {role === 'doctor' && <UserCheck className="w-3.5 h-3.5 text-red-600" />}
                </button>

                <button
                  onClick={() => {
                    switchRole('hospital');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all mb-1 ${
                    role === 'hospital' ? 'bg-red-50 text-red-700 border border-red-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-600" />
                    <span>Hospital ER Staff</span>
                  </div>
                  {role === 'hospital' && <UserCheck className="w-3.5 h-3.5 text-red-600" />}
                </button>

                <button
                  onClick={() => {
                    switchRole('admin');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    role === 'admin' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>Admin</span>
                  </div>
                  {role === 'admin' && <UserCheck className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-slate-900/60 backdrop-blur-xs z-40 animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white border-b border-slate-200 p-4 shadow-2xl space-y-2.5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider px-2 pt-1">Navigation Portals</p>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname === '/'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Ecosystem Landing</span>
            </Link>

            <Link
              to="/chw"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname.startsWith('/chw')
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>CHW Triage Portal</span>
            </Link>

            <Link
              to="/doctor"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname.startsWith('/doctor')
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor Tele-Triage</span>
            </Link>

            <Link
              to="/hospital"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname.startsWith('/hospital')
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hospital ER Command</span>
            </Link>

            <Link
              to="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname.startsWith('/emergency')
                  ? 'bg-red-600 text-white shadow-md animate-pulse'
                  : 'bg-red-50 text-red-700 border border-red-200 font-extrabold'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Emergency SOS Mode</span>
            </Link>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Admin Infrastructure</span>
            </Link>

            {/* Role Indicator in Mobile Menu */}
            <div className="pt-3 border-t border-slate-100 mt-2 px-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Active Role:</span>
              <span className="font-extrabold uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">{role}</span>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

