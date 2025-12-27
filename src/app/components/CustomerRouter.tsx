import React, { useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { CustomerDashboard } from './CustomerDashboard';
import { CustomerBrowse } from './CustomerBrowse';
import { ShoppingCartComponent } from './ShoppingCart';
import { Checkout } from './Checkout';
import { CustomerOrders } from './CustomerOrders';
import { Wishlist } from './Wishlist';
import { Settings } from './Settings';

export function CustomerRouter() {
  const { currentView, setView } = useNavigation();

  // Default to browse for customers
  useEffect(() => {
    if (currentView === 'dashboard') {
      setView('browse');
    }
  }, []);

  switch (currentView) {
    case 'cart':
      return <ShoppingCartComponent />;
    case 'checkout':
      return <Checkout />;
    case 'my-orders':
      return <CustomerOrders />;
    case 'wishlist':
      return <Wishlist />;
    case 'settings':
      return <Settings />;
    case 'browse':
    case 'dashboard':
    default:
      return <CustomerBrowse />;
  }
}