'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Mail, Phone, Building2, MapPin, CheckCircle2, XCircle, Store } from 'lucide-react';
import { UserForm } from './UserForm';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Vendor {
  id: string;
  fullName: string;
  email: string;
  businessName?: string;
  country?: string;
  phoneNumber?: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  totalStores: number;
  totalOrders: number;
  totalRevenue: number;
}

export function VendorManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Mock data
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      fullName: 'David Thompson',
      email: 'david@premiumstore.com',
      businessName: 'Premium Store Network',
      country: 'United States',
      phoneNumber: '+1 (555) 234-5678',
      status: 'active',
      joinedDate: '2024-01-10',
      totalStores: 3,
      totalOrders: 456,
      totalRevenue: 89500,
    },
    {
      id: '2',
      fullName: 'Lisa Rodriguez',
      email: 'lisa@fashionhub.com',
      businessName: 'Fashion Hub Ltd.',
      country: 'United Kingdom',
      phoneNumber: '+44 20 7234 5678',
      status: 'active',
      joinedDate: '2024-02-05',
      totalStores: 2,
      totalOrders: 312,
      totalRevenue: 67800,
    },
    {
      id: '3',
      fullName: 'Raj Patel',
      email: 'raj@techbazaar.in',
      businessName: 'Tech Bazaar India',
      country: 'India',
      phoneNumber: '+91 22 1234 5678',
      status: 'active',
      joinedDate: '2024-01-25',
      totalStores: 5,
      totalOrders: 789,
      totalRevenue: 125000,
    },
    {
      id: '4',
      fullName: 'Anna Schmidt',
      email: 'anna@euromarket.de',
      businessName: 'Euro Market GmbH',
      country: 'Germany',
      phoneNumber: '+49 30 23456789',
      status: 'inactive',
      joinedDate: '2024-03-15',
      totalStores: 1,
      totalOrders: 145,
      totalRevenue: 34200,
    },
    {
      id: '5',
      fullName: 'James Kim',
      email: 'james@asiaretail.kr',
      businessName: 'Asia Retail Co.',
      country: 'South Korea',
      phoneNumber: '+82 2 1234 5678',
      status: 'active',
      joinedDate: '2024-02-18',
      totalStores: 4,
      totalOrders: 523,
      totalRevenue: 98700,
    },
  ]);

  const handleFormSuccess = () => {
    setShowForm(false);
    // Refresh vendors list
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || vendor.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (showForm) {
    return (
      <UserForm
        preSelectedRole="vendor"
        onCancel={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Vendor Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage your vendor accounts</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: vendors.length, color: 'from-cyan-500 to-cyan-600', icon: Building2 },
          { label: 'Active', value: vendors.filter(v => v.status === 'active').length, color: 'from-green-500 to-green-600', icon: CheckCircle2 },
          { label: 'Inactive', value: vendors.filter(v => v.status === 'inactive').length, color: 'from-red-500 to-red-600', icon: XCircle },
          { label: 'Total Stores', value: vendors.reduce((sum, v) => sum + v.totalStores, 0), color: 'from-purple-500 to-purple-600', icon: Store },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-200 dark:border-slate-800"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search vendors by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status as any)}
                className={filterStatus === status ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Vendors Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredVendors.map((vendor, idx) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Header */}
              <div className={`h-2 bg-gradient-to-r ${vendor.status === 'active' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'}`} />
              
              <div className="p-6 space-y-4">
                {/* Name and Status */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{vendor.fullName}</h3>
                    {vendor.businessName && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Building2 className="w-3 h-3" />
                        {vendor.businessName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vendor.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {vendor.status}
                    </span>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-cyan-500" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                  {vendor.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 text-cyan-500" />
                      <span>{vendor.phoneNumber}</span>
                    </div>
                  )}
                  {vendor.country && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-cyan-500" />
                      <span>{vendor.country}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-xs text-muted-foreground">Stores</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      {vendor.totalStores}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {vendor.totalOrders}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${(vendor.totalRevenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-500 hover:text-red-600">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredVendors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-800"
        >
          <Store className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Vendor
          </Button>
        </motion.div>
      )}
    </div>
  );
}
