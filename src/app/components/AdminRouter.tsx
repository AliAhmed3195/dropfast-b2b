'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsers } from './AdminUsers';
import { SupplierManagement } from './SupplierManagement';
import { VendorManagement } from './VendorManagement';
import { AdminInventoryRouter } from './AdminInventoryRouter';
import { AdminInventoryProducts } from './AdminInventoryProducts';
import { CategoryManagement } from './CategoryManagement';
import { TagManagement } from './TagManagement';
import { AdminOrders } from './AdminOrders';
import { AdminPayouts } from './AdminPayouts';
import { AdminInvoiceTemplates } from './AdminInvoiceTemplates';
import { Analytics } from './Analytics';
import { Reports } from './Reports';
import { Settings } from './Settings';

export function AdminRouter() {
  const pathname = usePathname();
  
  // Extract view from pathname
  const getViewFromPath = () => {
    if (pathname?.includes('/users')) return 'users';
    if (pathname?.includes('/vendors')) return 'vendor-management';
    if (pathname?.includes('/suppliers')) return 'supplier-management';
    if (pathname?.includes('/orders')) return 'orders';
    if (pathname?.includes('/payouts')) return 'payouts';
    if (pathname?.includes('/inventory')) return 'inventory';
    if (pathname?.includes('/categories')) return 'categories';
    if (pathname?.includes('/tags')) return 'tags';
    if (pathname?.includes('/invoices')) return 'invoice-templates';
    if (pathname?.includes('/analytics')) return 'analytics';
    if (pathname?.includes('/reports')) return 'reports';
    if (pathname?.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentView = getViewFromPath();

  switch (currentView) {
    case 'users':
      return <AdminUsers />;
    case 'supplier-management':
      return <SupplierManagement />;
    case 'vendor-management':
      return <VendorManagement />;
    case 'orders':
      return <AdminOrders />;
    case 'payouts':
      return <AdminPayouts />;
    case 'inventory':
      // Show inventory menu (AdminInventoryRouter)
      // Sub-routes (products, categories, tags) are handled by separate route pages
      return <AdminInventoryRouter />;
    case 'categories':
      return <CategoryManagement />;
    case 'tags':
      return <TagManagement />;
    case 'invoice-templates':
      return <AdminInvoiceTemplates />;
    case 'analytics':
      return <Analytics />;
    case 'reports':
      return <Reports />;
    case 'settings':
      return <Settings />;
    case 'dashboard':
    default:
      return <AdminDashboard />;
  }
}