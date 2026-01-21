'use client'

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

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

const STORAGE_KEY = 'fastdrop_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Load user from localStorage on mount
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
    return null;
  });

  // Ref to track if we're updating user internally (to prevent infinite loop)
  const isInternalUpdate = useRef(false);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInternalUpdate.current) {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        // Dispatch custom event for same-tab synchronization
        isInternalUpdate.current = true;
        window.dispatchEvent(new CustomEvent('fastdrop-storage-change', {
          detail: { key: STORAGE_KEY, value: JSON.stringify(user) }
        }));
        // Reset flag after a small delay
        setTimeout(() => {
          isInternalUpdate.current = false;
        }, 0);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        // Dispatch custom event for logout
        isInternalUpdate.current = true;
        window.dispatchEvent(new CustomEvent('fastdrop-storage-change', {
          detail: { key: STORAGE_KEY, value: null }
        }));
        // Reset flag after a small delay
        setTimeout(() => {
          isInternalUpdate.current = false;
        }, 0);
      }
    }
  }, [user]);

  // Listen for storage changes (cross-tab synchronization)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          try {
            const newUser = JSON.parse(e.newValue);
            setUser(newUser);
          } catch (error) {
            console.error('Error parsing user from storage event:', error);
            setUser(null);
          }
        } else {
          // User was removed (logout in another tab)
          setUser(null);
        }
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events for same-tab synchronization
    const handleCustomStorageChange = (e: CustomEvent) => {
      // Skip if this is our own update to prevent infinite loop
      if (isInternalUpdate.current) {
        return;
      }

      if (e.detail?.key === STORAGE_KEY) {
        if (e.detail.value) {
          try {
            const newUser = JSON.parse(e.detail.value);
            // Only update if user actually changed
            setUser(prevUser => {
              if (JSON.stringify(prevUser) === JSON.stringify(newUser)) {
                return prevUser; // No change, return previous value
              }
              return newUser;
            });
          } catch (error) {
            console.error('Error parsing user from custom event:', error);
            setUser(null);
          }
        } else {
          setUser(prevUser => {
            if (prevUser === null) {
              return prevUser; // Already null, no change
            }
            return null;
          });
        }
      }
    };

    window.addEventListener('fastdrop-storage-change', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fastdrop-storage-change', handleCustomStorageChange as EventListener);
    };
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
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
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
