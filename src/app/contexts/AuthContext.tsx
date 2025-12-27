'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'admin' | 'supplier' | 'vendor' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserType;
  avatar?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@fastdrop.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@fastdrop.com',
      name: 'Sarah Chen',
      role: 'admin',
      company: 'FastDrop Platform',
    },
  },
  'supplier@fastdrop.com': {
    password: 'supplier123',
    user: {
      id: '2',
      email: 'supplier@fastdrop.com',
      name: 'Michael Rodriguez',
      role: 'supplier',
      company: 'TechSupply Co.',
    },
  },
  'vendor@fastdrop.com': {
    password: 'vendor123',
    user: {
      id: '3',
      email: 'vendor@fastdrop.com',
      name: 'Emma Thompson',
      role: 'vendor',
      company: 'Digital Marketplace',
    },
  },
  'customer@fastdrop.com': {
    password: 'customer123',
    user: {
      id: '4',
      email: 'customer@fastdrop.com',
      name: 'James Wilson',
      role: 'customer',
      company: 'Personal',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userRecord = MOCK_USERS[email.toLowerCase()];
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      return userRecord.user; // Return user object with role
    }
    return null; // Return null if login fails
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
