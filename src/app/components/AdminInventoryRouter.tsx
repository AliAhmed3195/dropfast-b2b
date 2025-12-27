import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Layers, Tag, ChevronRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { AdminInventoryProducts } from './AdminInventoryProducts';
import { AdminInventoryCategories } from './AdminInventoryCategories';
import { AdminInventoryTags } from './AdminInventoryTags';

export function AdminInventoryRouter() {
  const { currentView, setView } = useNavigation();

  // If we're on a sub-view, render that component
  if (currentView === 'inventory-products') {
    return <AdminInventoryProducts />;
  }
  if (currentView === 'inventory-categories') {
    return <AdminInventoryCategories />;
  }
  if (currentView === 'inventory-tags') {
    return <AdminInventoryTags />;
  }

  // Otherwise show the inventory menu
  const menuItems = [
    {
      id: 'inventory-products',
      title: 'Products',
      description: 'Manage all products in the system',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      stats: { total: '12,458', recent: '+234 this week' },
    },
    {
      id: 'inventory-categories',
      title: 'Categories',
      description: 'Organize products into categories',
      icon: Layers,
      color: 'from-purple-500 to-purple-600',
      stats: { total: '48', recent: '+3 this month' },
    },
    {
      id: 'inventory-tags',
      title: 'Tags',
      description: 'Manage product tags and labels',
      icon: Tag,
      color: 'from-cyan-500 to-cyan-600',
      stats: { total: '156', recent: '+12 this month' },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
          Inventory Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage products, categories, and tags across the platform
        </p>
      </motion.div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setView(item.id as any)}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border-2 border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all group text-left"
            >
              {/* Icon and Title */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Title and Description */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-2xl font-bold">{item.stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {item.stats.recent}
                  </p>
                  <p className="text-xs text-muted-foreground">Activity</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
