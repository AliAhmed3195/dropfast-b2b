'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Search,
  Edit,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  Building2,
  Star,
  Box,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// Mock supplier data
const mockSuppliers = [
  {
    id: '1',
    name: 'Global Electronics Ltd',
    companyName: 'Global Electronics',
    email: 'contact@globalelectronics.com',
    phone: '+1 (555) 111-2222',
    address: '789 Industrial Park, Shenzhen, China',
    joinDate: '2024-01-10',
    status: 'active',
    totalProducts: 342,
    totalOrders: 1567,
    revenue: 234567.80,
    rating: 4.9,
    verified: true,
    categories: ['Electronics', 'Accessories'],
  },
  {
    id: '2',
    name: 'Fashion Wholesale Co',
    companyName: 'Fashion Wholesale',
    email: 'info@fashionwholesale.com',
    phone: '+1 (555) 222-3333',
    address: '456 Garment District, Mumbai, India',
    joinDate: '2024-02-15',
    status: 'active',
    totalProducts: 567,
    totalOrders: 2345,
    revenue: 456789.50,
    rating: 4.8,
    verified: true,
    categories: ['Clothing', 'Accessories'],
  },
  {
    id: '3',
    name: 'Home Goods Suppliers',
    companyName: 'Home Goods Inc',
    email: 'sales@homegoods.com',
    phone: '+1 (555) 333-4444',
    address: '123 Commerce Ave, Istanbul, Turkey',
    joinDate: '2024-03-20',
    status: 'inactive',
    totalProducts: 234,
    totalOrders: 789,
    revenue: 123456.75,
    rating: 4.5,
    verified: false,
    categories: ['Home & Kitchen'],
  },
  {
    id: '4',
    name: 'Sports Equipment Direct',
    companyName: 'Sports Direct',
    email: 'orders@sportsdirect.com',
    phone: '+1 (555) 444-5555',
    address: '321 Sports Complex, Bangkok, Thailand',
    joinDate: '2024-04-10',
    status: 'active',
    totalProducts: 445,
    totalOrders: 1890,
    revenue: 345678.90,
    rating: 4.7,
    verified: true,
    categories: ['Sports', 'Fitness'],
  },
];

export function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [viewingSupplier, setViewingSupplier] = useState<any>(null);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'active').length,
    totalProducts: suppliers.reduce((sum, s) => sum + s.totalProducts, 0),
    totalRevenue: suppliers.reduce((sum, s) => sum + s.revenue, 0),
  };

  const handleToggleStatus = (supplierId: string) => {
    setSuppliers(prev =>
      prev.map(s =>
        s.id === supplierId ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
      )
    );
    toast.success('Supplier status updated');
  };

  const handleSaveSupplier = (updatedSupplier: any) => {
    setSuppliers(prev =>
      prev.map(s => (s.id === updatedSupplier.id ? updatedSupplier : s))
    );
    setEditingSupplier(null);
    toast.success('Supplier updated successfully!');
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    toast.success('Supplier deleted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
          Supplier Management
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage all suppliers and their product catalog
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Suppliers</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Suppliers</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Products Listed</p>
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
              placeholder="Search suppliers by name, email, or company..."
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

      {/* Suppliers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Supplier</th>
                <th className="text-left p-4 font-semibold">Company</th>
                <th className="text-left p-4 font-semibold">Contact</th>
                <th className="text-left p-4 font-semibold">Products</th>
                <th className="text-left p-4 font-semibold">Revenue</th>
                <th className="text-left p-4 font-semibold">Rating</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <motion.tr
                  key={supplier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-semibold">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.email}</p>
                      </div>
                      {supplier.verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{supplier.companyName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{supplier.phone}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{supplier.totalProducts} items</Badge>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">${supplier.revenue.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={supplier.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        supplier.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {supplier.status === 'active' ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {supplier.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingSupplier(supplier)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSupplier(supplier)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSupplier(supplier.id)}
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

      {/* Edit Supplier Modal */}
      <AnimatePresence>
        {editingSupplier && (
          <EditSupplierModal
            supplier={editingSupplier}
            onClose={() => setEditingSupplier(null)}
            onSave={handleSaveSupplier}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </AnimatePresence>

      {/* View Supplier Modal */}
      <AnimatePresence>
        {viewingSupplier && (
          <ViewSupplierModal
            supplier={viewingSupplier}
            onClose={() => setViewingSupplier(null)}
            onEdit={() => {
              setEditingSupplier(viewingSupplier);
              setViewingSupplier(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Edit Supplier Modal Component
function EditSupplierModal({ supplier, onClose, onSave, onToggleStatus }: any) {
  const [formData, setFormData] = useState(supplier);

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
              <h2 className="text-2xl font-bold">Edit Supplier</h2>
              <p className="text-sm text-muted-foreground">Update supplier information</p>
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
                  <Label htmlFor="supplier-name" className="block text-sm font-semibold mb-2">Supplier Name</Label>
                  <Input
                    id="supplier-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company-name" className="block text-sm font-semibold mb-2">Company Name</Label>
                  <Input
                    id="company-name"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier-email" className="block text-sm font-semibold mb-2">Email</Label>
                  <Input
                    id="supplier-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-phone" className="block text-sm font-semibold mb-2">Phone</Label>
                  <Input
                    id="supplier-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supplier-address" className="block text-sm font-semibold mb-2">Address</Label>
                <Input
                  id="supplier-address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="font-semibold">Account Status</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.status === 'active' ? 'Supplier is active' : 'Supplier is suspended'}
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
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="font-semibold">Verified Supplier</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.verified ? 'Supplier is verified' : 'Not verified yet'}
                    </p>
                  </div>
                  <Switch
                    checked={formData.verified}
                    onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                  />
                </div>
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

// View Supplier Modal Component
function ViewSupplierModal({ supplier, onClose, onEdit }: any) {
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
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold">{supplier.name}</h2>
                <p className="text-sm text-muted-foreground">Supplier Details</p>
              </div>
              {supplier.verified && (
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
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
                variant={supplier.status === 'active' ? 'default' : 'secondary'}
                className={cn(
                  'text-base px-4 py-2',
                  supplier.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}
              >
                {supplier.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Products</p>
                <p className="text-2xl font-bold">{supplier.totalProducts}</p>
              </Card>
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Orders</p>
                <p className="text-2xl font-bold">{supplier.totalOrders}</p>
              </Card>
              <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Revenue</p>
                <p className="text-2xl font-bold">${supplier.revenue.toLocaleString()}</p>
              </Card>
              <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <p className="text-2xl font-bold">{supplier.rating}</p>
                </div>
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
                    <p className="font-medium">{supplier.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-cyan-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{supplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{supplier.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-medium">{supplier.joinDate}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{supplier.address}</p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-lg mb-3">Product Categories</h3>
              <div className="flex flex-wrap gap-2">
                {supplier.categories.map((category: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}