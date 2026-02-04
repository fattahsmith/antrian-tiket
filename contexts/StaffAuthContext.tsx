'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface StaffAuthContextType {
  isStaffLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

const STAFF_USERNAME = 'petugas';
const STAFF_PASSWORD = '123456';
const STORAGE_KEY = 'isStaffLoggedIn';

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsStaffLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === STAFF_USERNAME && password === STAFF_PASSWORD) {
      setIsStaffLoggedIn(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsStaffLoggedIn(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <StaffAuthContext.Provider value={{ isStaffLoggedIn, login, logout, isLoading }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (context === undefined) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
}

