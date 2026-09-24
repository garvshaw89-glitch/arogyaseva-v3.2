import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface PortalRoleGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export const PortalRoleGuard: React.FC<PortalRoleGuardProps> = ({ requiredRole, children }) => {
  const { role, switchRole } = useAuth();

  useEffect(() => {
    if (role !== requiredRole) {
      switchRole(requiredRole);
    }
  }, [role, requiredRole, switchRole]);

  return <>{children}</>;
};
