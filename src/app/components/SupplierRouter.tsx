'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { SupplierDashboard } from './SupplierDashboard';
import { SupplierProducts } from './SupplierProducts';
import { SupplierOrders } from './SupplierOrders';
import { SupplierPayoutSetup } from './SupplierPayoutSetup';
import { SupplierAnalytics } from './SupplierAnalytics';
import { Settings } from './Settings';

export function SupplierRouter() {
  const pathname = usePathname();
  
  // Extract view from pathname
  const getViewFromPath = () => {
    if (pathname?.includes('/products')) return 'products';
    if (pathname?.includes('/orders')) return 'orders';
    if (pathname?.includes('/payouts')) return 'payouts';
    if (pathname?.includes('/analytics')) return 'analytics';
    if (pathname?.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentView = getViewFromPath();

  switch (currentView) {
    case 'products':
      return <SupplierProducts />;
    case 'orders':
      return <SupplierOrders />;
    case 'payouts':
      return <SupplierPayoutSetup />;
    case 'analytics':
      return <SupplierAnalytics />;
    case 'settings':
      return <Settings />;
    case 'dashboard':
    default:
      return <SupplierDashboard />;
  }
}