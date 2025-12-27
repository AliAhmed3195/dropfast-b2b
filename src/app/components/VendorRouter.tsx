'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { VendorDashboard } from './VendorDashboard';
import { VendorStores } from './VendorStores';
import { StoreCreationWizard } from './StoreCreationWizard';
import { VendorInventory } from './VendorInventory';
import { VendorProducts } from './VendorProducts';
import { VendorOrders } from './VendorOrders';
import { VendorInvoices } from './VendorInvoices';
import { VendorInvoiceTemplates } from './VendorInvoiceTemplates';
import { VendorAccountDetails } from './VendorAccountDetails';
import { VendorCustomers } from './VendorCustomers';
import { Settings } from './Settings';

export function VendorRouter() {
  const pathname = usePathname();

  // Extract view from pathname
  const getViewFromPath = () => {
    if (pathname?.includes('/stores')) return 'stores';
    if (pathname?.includes('/inventory')) return 'inventory';
    if (pathname?.includes('/products')) return 'products';
    if (pathname?.includes('/orders')) return 'orders';
    if (pathname?.includes('/invoices')) return 'invoices';
    if (pathname?.includes('/templates')) return 'invoice-templates';
    if (pathname?.includes('/account-details')) return 'account-details';
    if (pathname?.includes('/customers')) return 'customers';
    if (pathname?.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentView = getViewFromPath();

  switch (currentView) {
    case 'stores':
      return <VendorStores />;
    case 'inventory':
      return <VendorInventory />;
    case 'products':
      return <VendorProducts />;
    case 'orders':
      return <VendorOrders />;
    case 'customers':
      return <VendorCustomers />;
    case 'invoices':
      return <VendorInvoices />;
    case 'invoice-templates':
      return <VendorInvoiceTemplates />;
    case 'account-details':
      return <VendorAccountDetails />;
    case 'settings':
      return <Settings />;
    case 'dashboard':
    default:
      return <VendorDashboard />;
  }
}