'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

type View =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'payouts'
  | 'invoice-templates'
  | 'stores'
  | 'store-creation'
  | 'customers'
  | 'analytics'
  | 'inventory'
  | 'inventory-products'
  | 'inventory-categories'
  | 'inventory-tags'
  | 'users'
  | 'vendors'
  | 'suppliers'
  | 'vendor-management'
  | 'supplier-management'
  | 'categories'
  | 'tags'
  | 'reports'
  | 'settings'
  | 'browse'
  | 'my-orders'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'store-view';

interface NavigationContextType {
  currentView: View;
  setView: (view: View) => void;
  viewParams: Record<string, any>;
  setViewParams: (params: Record<string, any>) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  const setView = (view: View) => {
    setCurrentView(view);
    setViewParams({});
  };

  return (
    <NavigationContext.Provider value={{ currentView, setView, viewParams, setViewParams }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}