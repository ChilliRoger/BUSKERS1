'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'artist' | 'fan' | null;

interface RoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isRoleLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole && (savedRole === 'artist' || savedRole === 'common')) {
      setUserRoleState(savedRole);
    }
    setIsRoleLoading(false);
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  return (
    <RoleContext.Provider value={{ userRole, setUserRole, isRoleLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
