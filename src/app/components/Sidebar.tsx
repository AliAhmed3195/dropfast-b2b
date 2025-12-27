'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  Boxes,
  FileText,
  TrendingUp,
  ShoppingBag,
  Heart,
  Sparkles,
  Zap,
  Layers,
  Tag,
  DollarSign,
  Wallet,
  Receipt,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth, UserType } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { getRoute } from '../../lib/routeMap';

interface NavItem {
  label: string;
  icon: React.ElementType;
  view: string;
}

const navigationByRole: Record<UserType, NavItem[]> = {
  admin: [
    { label: 'Overview', icon: LayoutDashboard, view: 'dashboard' },
    { label: 'Users', icon: Users, view: 'users' },
    { label: 'Vendors', icon: Store, view: 'vendor-management' },
    { label: 'Suppliers', icon: Boxes, view: 'supplier-management' },
    { label: 'Orders', icon: ShoppingCart, view: 'orders' },
    { label: 'Payouts', icon: DollarSign, view: 'payouts' },
    { label: 'Inventory', icon: Package, view: 'inventory' },
    { label: 'Categories', icon: Layers, view: 'categories' },
    { label: 'Tags', icon: Tag, view: 'tags' },
    { label: 'Invoices', icon: FileText, view: 'invoice-templates' },
    { label: 'Analytics', icon: BarChart3, view: 'analytics' },
    { label: 'Reports', icon: FileText, view: 'reports' },
    { label: 'Settings', icon: Settings, view: 'settings' },
  ],
  supplier: [
    { label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { label: 'Products', icon: Package, view: 'products' },
    { label: 'Orders', icon: ShoppingCart, view: 'orders' },
    { label: 'Payouts', icon: Wallet, view: 'payouts' },
    { label: 'Analytics', icon: TrendingUp, view: 'analytics' },
    { label: 'Settings', icon: Settings, view: 'settings' },
  ],
  vendor: [
    { label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { label: 'My Stores', icon: Store, view: 'stores' },
    { label: 'Inventory', icon: Boxes, view: 'inventory' },
    { label: 'Products', icon: Package, view: 'products' },
    { label: 'Orders', icon: ShoppingCart, view: 'orders' },
    { label: 'Invoices', icon: Receipt, view: 'invoices' },
    { label: 'Templates', icon: FileText, view: 'invoice-templates' },
    { label: 'Account Details', icon: CreditCard, view: 'account-details' },
    { label: 'Customers', icon: Users, view: 'customers' },
    { label: 'Settings', icon: Settings, view: 'settings' },
  ],
  customer: [
    { label: 'Browse Stores', icon: ShoppingBag, view: 'browse' },
    { label: 'My Orders', icon: ShoppingCart, view: 'my-orders' },
    { label: 'Wishlist', icon: Heart, view: 'wishlist' },
    { label: 'Settings', icon: Settings, view: 'settings' },
  ],
};

export function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const navigation = user?.role ? navigationByRole[user.role] : [];
  
  // Load collapsed state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  // Keyboard shortcut: Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isCollapsed ? '80px' : '288px',
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto custom-scrollbar"
    >
      {/* Toggle Button */}
      <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} p-4`}>
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          )}
        </motion.button>
      </div>

      <nav className={`${isCollapsed ? 'px-3' : 'px-6'} pb-6 space-y-1`}>
        {navigation.map((item, index) => {
          const route = user?.role ? getRoute(user.role, item.view) : '';
          // Check if current pathname matches the route or starts with it (for nested routes like inventory/products)
          const isActive = pathname === route || 
            (route && pathname?.startsWith(route + '/')) ||
            (item.view === 'dashboard' && pathname?.includes(`/dashboard/${user?.role}/overview`));
          return (
            <motion.button
              key={item.label}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              onClick={() => {
                if (route) {
                  router.push(route);
                }
              }}
              whileHover={{ 
                x: isCollapsed ? 0 : 2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-3' : 'px-4'} py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Icon */}
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
              
              {/* Label - Hidden when collapsed */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`font-medium text-sm whitespace-nowrap ${isActive ? 'text-white' : ''}`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Collapsed Icon for Help/Support - Shown when collapsed */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center px-3 mt-4"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-lg bg-indigo-600 cursor-pointer shadow-sm"
              title="Help & Support"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}