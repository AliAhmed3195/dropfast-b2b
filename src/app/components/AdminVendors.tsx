'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  TrendingUp,
  Package,
  DollarSign,
  Search,
  Filter,
  Edit,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  Building2,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// Mock vendor data
const mockVendors = [
  {
    id: '1',
    name: 'Tech Haven Store',
    email: 'owner@techhaven.com',
    phone: '+1 (555) 123-4567',
    storeName: 'Tech Haven',
    address: '123 Business St, New York, NY 10001',
    joinDate: '2024-01-15',
    status: 'active',
    totalProducts: 156,
    totalOrders: 342,
    revenue: 45678.90,
    rating: 4.8,
    stripeConnected: true,
  },
  {
    id: '2',
    name: 'Fashion Hub',
    email: 'contact@fashionhub.com',
    phone: '+1 (555) 234-5678',
    storeName: 'Fashion Hub',
    address: '456 Market Ave, Los Angeles, CA 90001',
    joinDate: '2024-02-20',
    status: 'active',
    totalProducts: 234,
    totalOrders: 567,
    revenue: 78900.50,
    rating: 4.9,
    stripeConnected: true,
  },
  {
    id: '3',
    name: 'Home Essentials',
    email: 'info@homeessentials.com',
    phone: '+1 (555) 345-6789',
    storeName: 'Home Essentials',
    address: '789 Oak St, Chicago, IL 60601',
    joinDate: '2024-03-10',
    status: 'inactive',
    totalProducts: 89,
    totalOrders: 123,
    revenue: 23456.75,
    rating: 4.5,
    stripeConnected: false,
  },
  {
    id: '4',
    name: 'Sports World',
    email: 'admin@sportsworld.com',
    phone: '+1 (555) 456-7890',
    storeName: 'Sports World',
    address: '321 Elm St, Houston, TX 77001',
    joinDate: '2024-04-05',
    status: 'active',
    totalProducts: 178,
    totalOrders: 445,
    revenue: 56789.30,
    rating: 4.7,
    stripeConnected: true,
  },
];

export function AdminVendors() {
  const [vendors, setVendors] = useState(mockVendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [viewingVendor, setViewingVendor] = useState<any>(null);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vendors.length,
    active: vendors.filter(v => v.status === 'active').length,
    totalProducts: vendors.reduce((sum, v) => sum + v.totalProducts, 0),
    totalRevenue: vendors.reduce((sum, v) => sum + v.revenue, 0),
  };

  const handleToggleStatus = (vendorId: string) => {
    setVendors(prev =>
      prev.map(v =>
        v.id === vendorId ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' } : v
      )
    );
    toast.success('Vendor status updated');
  };

  const handleSaveVendor = (updatedVendor: any) => {
    setVendors(prev =>
      prev.map(v => (v.id === updatedVendor.id ? updatedVendor : v))
    );
    setEditingVendor(null);
    toast.success('Vendor updated successfully!');
  };

  const handleDeleteVendor = (vendorId: string) => {
    setVendors(prev => prev.filter(v => v.id !== vendorId));
    toast.success('Vendor deleted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
          Vendor Management
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage all vendors and their stores on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Vendors</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Vendors</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vendors by name, email, or store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className={cn(statusFilter === 'all' && "bg-gradient-to-r from-purple-600 to-cyan-600")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('active')}
              className={cn(statusFilter === 'active' && "bg-gradient-to-r from-green-600 to-emerald-600")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('inactive')}
              className={cn(statusFilter === 'inactive' && "bg-gradient-to-r from-red-600 to-pink-600")}
            >
              Inactive
            </Button>
          </div>
        </div>
      </Card>

      {/* Vendors Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Vendor</th>
                <th className="text-left p-4 font-semibold">Store</th>
                <th className="text-left p-4 font-semibold">Contact</th>
                <th className="text-left p-4 font-semibold">Products</th>
                <th className="text-left p-4 font-semibold">Revenue</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor, index) => (
                <motion.tr
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{vendor.name}</p>
                      <p className="text-sm text-muted-foreground">{vendor.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{vendor.storeName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{vendor.phone}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{vendor.totalProducts} items</Badge>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">${vendor.revenue.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={vendor.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        vendor.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {vendor.status === 'active' ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {vendor.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingVendor(vendor)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingVendor(vendor)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVendor(vendor.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Vendor Modal */}
      <AnimatePresence>
        {editingVendor && (
          <EditVendorModal
            vendor={editingVendor}
            onClose={() => setEditingVendor(null)}
            onSave={handleSaveVendor}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </AnimatePresence>

      {/* View Vendor Modal */}
      <AnimatePresence>
        {viewingVendor && (
          <ViewVendorModal
            vendor={viewingVendor}
            onClose={() => setViewingVendor(null)}
            onEdit={() => {
              setEditingVendor(viewingVendor);
              setViewingVendor(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Edit Vendor Modal Component
function EditVendorModal({ vendor, onClose, onSave, onToggleStatus }: any) {
  const [formData, setFormData] = useState(vendor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Edit Vendor</h2>
              <p className="text-sm text-muted-foreground">Update vendor information</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor-name" className="block text-sm font-semibold mb-2">Vendor Name</Label>
                  <Input
                    id="vendor-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="store-name" className="block text-sm font-semibold mb-2">Store Name</Label>
                  <Input
                    id="store-name"
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor-email" className="block text-sm font-semibold mb-2">Email</Label>
                  <Input
                    id="vendor-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vendor-phone" className="block text-sm font-semibold mb-2">Phone</Label>
                  <Input
                    id="vendor-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vendor-address" className="block text-sm font-semibold mb-2">Address</Label>
                <Input
                  id="vendor-address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-semibold">Account Status</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.status === 'active' ? 'Vendor can access platform' : 'Vendor is suspended'}
                  </p>
                </div>
                <Switch
                  checked={formData.status === 'active'}
                  onCheckedChange={() => {
                    const newStatus = formData.status === 'active' ? 'inactive' : 'active';
                    setFormData({ ...formData, status: newStatus });
                    onToggleStatus(formData.id);
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </>
  );
}

// View Vendor Modal Component
function ViewVendorModal({ vendor, onClose, onEdit }: any) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50 max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{vendor.name}</h2>
              <p className="text-sm text-muted-foreground">Vendor Details</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Status Badge */}
            <div>
              <Badge
                variant={vendor.status === 'active' ? 'default' : 'secondary'}
                className={cn(
                  'text-base px-4 py-2',
                  vendor.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}
              >
                {vendor.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Products</p>
                <p className="text-2xl font-bold">{vendor.totalProducts}</p>
              </Card>
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Orders</p>
                <p className="text-2xl font-bold">{vendor.totalOrders}</p>
              </Card>
              <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Revenue</p>
                <p className="text-2xl font-bold">${vendor.revenue.toLocaleString()}</p>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-cyan-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{vendor.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Store Name</p>
                    <p className="font-medium">{vendor.storeName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-medium">{vendor.joinDate}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{vendor.address}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-bold mb-2">Payment Status</h3>
              <div className="flex items-center gap-2">
                {vendor.stripeConnected ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Stripe Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium">Stripe Not Connected</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}