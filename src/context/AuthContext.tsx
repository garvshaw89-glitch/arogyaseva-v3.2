import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_PROFILES } from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  switchRole: (newRole: UserRole) => void;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default demo user is CHW
  const [user, setUser] = useState<UserProfile>(() => {
    const savedRole = (localStorage.getItem('arogyaseva_active_role') as UserRole) || 'chw';
    return DEMO_PROFILES[savedRole] || DEMO_PROFILES.chw;
  });

  const role = user.role;

  useEffect(() => {
    localStorage.setItem('arogyaseva_active_role', user.role);
  }, [user.role]);

  // Switch role seamlessly for multi-tab / side-by-side evaluation
  const switchRole = (newRole: UserRole) => {
    const targetProfile = DEMO_PROFILES[newRole] || DEMO_PROFILES.chw;
    setUser(targetProfile);
    localStorage.setItem('arogyaseva_active_role', newRole);
  };

  const login = async (email: string, password: string, targetRole: UserRole): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            role: targetRole,
            phone: '+91 98220 00000'
          });
          return true;
        }
      } catch (err) {
        console.warn('Supabase auth fallback to local demo auth:', err);
      }
    }

    // Local Demo Login Fallback
    const profile = DEMO_PROFILES[targetRole] || DEMO_PROFILES.chw;
    setUser({
      ...profile,
      email: email || profile.email
    });
    return true;
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    setUser(DEMO_PROFILES.chw);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: true,
        switchRole,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
