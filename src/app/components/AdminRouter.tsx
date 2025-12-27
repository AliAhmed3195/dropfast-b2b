import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
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
  const { currentView } = useNavigation();

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
      // Directly show product listing instead of intermediate page
      return <AdminInventoryProducts />;
    case 'inventory-products':
    case 'inventory-categories':
    case 'inventory-tags':
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