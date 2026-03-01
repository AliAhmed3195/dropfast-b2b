'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserType = 'admin' | 'supplier' | 'vendor' | 'customer' | 'product_hunter';

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
  'admin@dropsified.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@dropsified.com',
      name: 'Sarah Chen',
      role: 'admin',
      company: 'Dropsified Platform',
    },
  },
  'supplier@dropsified.com': {
    password: 'supplier123',
    user: {
      id: '2',
      email: 'supplier@dropsified.com',
      name: 'Michael Rodriguez',
      role: 'supplier',
      company: 'TechSupply Co.',
    },
  },
  'vendor@dropsified.com': {
    password: 'vendor123',
    user: {
      id: '3',
      email: 'vendor@dropsified.com',
      name: 'Emma Thompson',
      role: 'vendor',
      company: 'Digital Marketplace',
    },
  },
  'customer@dropsified.com': {
    password: 'customer123',
    user: {
      id: '4',
      email: 'customer@dropsified.com',
      name: 'James Wilson',
      role: 'customer',
      company: 'Personal',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Restore user from localStorage on first load
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined'
        ? window.localStorage.getItem('fastdrop-auth-user')
        : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.email && parsed.role) {
          setUser(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to restore auth user from storage:', error);
    } finally {
      setInitialized(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Format user data to match User interface
      const userData = data.user;
      const loggedInUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role.toLowerCase() as UserType,
        avatar: userData.avatar,
        company: userData.businessName,
      };

      setUser(loggedInUser);
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('fastdrop-auth-user', JSON.stringify(loggedInUser));
        }
      } catch (error) {
        console.error('Failed to persist auth user to storage:', error);
      }
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('fastdrop-auth-user');
      }
    } catch (error) {
      console.error('Failed to clear auth storage on logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: initialized ? user : null,
        login,
        logout,
        isAuthenticated: initialized && !!user,
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
