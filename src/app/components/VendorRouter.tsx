import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
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
  const { currentView, setView } = useNavigation();

  switch (currentView) {
    case 'stores':
      return <VendorStores />;
    case 'store-creation':
      return (
        <StoreCreationWizard
          onComplete={() => setView('stores')}
          onCancel={() => setView('stores')}
        />
      );
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