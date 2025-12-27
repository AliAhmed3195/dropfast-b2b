import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { SupplierDashboard } from './SupplierDashboard';
import { SupplierProducts } from './SupplierProducts';
import { SupplierOrders } from './SupplierOrders';
import { SupplierPayoutSetup } from './SupplierPayoutSetup';
import { SupplierAnalytics } from './SupplierAnalytics';
import { Settings } from './Settings';

export function SupplierRouter() {
  const { currentView } = useNavigation();

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