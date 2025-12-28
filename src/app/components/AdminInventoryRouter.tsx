'use client'

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminInventoryProducts } from './AdminInventoryProducts';
import { AdminInventoryCategories } from './AdminInventoryCategories';
import { AdminInventoryTags } from './AdminInventoryTags';

export function AdminInventoryRouter() {
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to Products page if on base inventory route
  useEffect(() => {
    if (pathname === '/dashboard/admin/inventory' || pathname === '/dashboard/admin/inventory/') {
      router.replace('/dashboard/admin/inventory/products');
    }
  }, [pathname, router]);

  // If we're on a sub-view, render that component
  if (pathname?.includes('/inventory/products')) {
    return <AdminInventoryProducts />;
  }
  if (pathname?.includes('/inventory/categories')) {
    return <AdminInventoryCategories />;
  }
  if (pathname?.includes('/inventory/tags')) {
    return <AdminInventoryTags />;
  }

  // If redirecting, show loading state
  if (pathname === '/dashboard/admin/inventory' || pathname === '/dashboard/admin/inventory/') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return null;
}
