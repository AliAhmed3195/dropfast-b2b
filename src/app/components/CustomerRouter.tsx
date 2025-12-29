'use client'

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CustomerDashboard } from './CustomerDashboard';
import { CustomerBrowse } from './CustomerBrowse';
import { ShoppingCartComponent } from './ShoppingCart';
import { Checkout } from './Checkout';
import { CustomerOrders } from './CustomerOrders';
import { Wishlist } from './Wishlist';
import { Settings } from './Settings';

export function CustomerRouter() {
  const pathname = usePathname();
  
  // Extract view from pathname
  const getViewFromPath = () => {
    if (pathname?.includes('/browse')) return 'browse';
    if (pathname?.includes('/orders')) return 'my-orders';
    if (pathname?.includes('/wishlist')) return 'wishlist';
    if (pathname?.includes('/cart')) return 'cart';
    if (pathname?.includes('/checkout')) return 'checkout';
    if (pathname?.includes('/settings')) return 'settings';
    return 'browse'; // Default
  };

  const currentView = getViewFromPath();

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
    default:
      return <CustomerBrowse />;
  }
}