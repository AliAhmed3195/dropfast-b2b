'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'supplier' | 'vendor' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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
  const router = useRouter();

  // ✅ Restore user from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
        }
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
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
        console.error('Login API error:', data.error || data.message);
        return false;
      }

      if (!data.user) {
        console.error('Login response missing user data');
        return false;
      }

      // Format user data
      const userData = data.user;
      const loggedInUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role?.toLowerCase() as UserRole || 'customer',
        avatar: userData.avatar,
        company: userData.company || userData.businessName,
      };

      setUser(loggedInUser);
      
      // ✅ Save user to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }
      
      // Redirect based on role
      if (loggedInUser.role === 'customer') {
        router.push('/dashboard/customer/browse');
      } else {
        router.push(`/dashboard/${loggedInUser.role}/overview`);
      }
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Clear any localStorage data if needed
    localStorage.removeItem('user');
    
    // Redirect to login page
    router.push('/');
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
