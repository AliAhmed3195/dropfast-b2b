'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useApiCall } from '../../hooks/useApiCall';
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
  AlertCircle,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { validatePhoneNumber, cleanPhoneNumber, formatPhoneNumber, allowOnlyDigits } from '../../lib/phone-validation';
import { showToast } from '../../lib/toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from './ui/pagination';

export function AdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [viewingVendor, setViewingVendor] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { callApi } = useApiCall();

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearchQuery]);

  // Abort controller ref for search
  const searchAbortControllerRef = useRef<AbortController | null>(null);

  // Fetch vendors on mount and when filters/page change
  useEffect(() => {
    // Abort previous request if any
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    searchAbortControllerRef.current = abortController;

    // Use debouncedSearchQuery instead of searchQuery
    const fetchWithDebouncedSearch = async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        const status = statusFilter === 'all' ? '' : statusFilter;
        const searchParam = debouncedSearchQuery ? `&search=${encodeURIComponent(debouncedSearchQuery)}` : '';
        const url = `/api/admin/vendors?status=${status || 'all'}&page=${currentPage}&limit=${pagination.limit}${searchParam}`;
        const response = await fetch(url, { signal: signal || abortController.signal });
        const data = await response.json();
        
        if (response.ok) {
          setVendors(data.vendors || []);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        } else {
          showToast.error(data.error || 'Failed to fetch vendors');
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Fetch vendors error:', error);
          showToast.error('Failed to fetch vendors');
        }
      } finally {
        setLoading(false);
      }
    };

    callApi(fetchWithDebouncedSearch);

    // Cleanup: abort request on unmount or dependency change
    return () => {
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
        searchAbortControllerRef.current = null;
      }
    };
  }, [statusFilter, currentPage, debouncedSearchQuery, callApi, pagination.limit]);

  const stats = {
    total: pagination.total || vendors.length,
    active: vendors.filter(v => v.status === 'active').length,
    totalProducts: vendors.reduce((sum, v) => sum + (v.totalProducts || 0), 0),
    totalRevenue: vendors.reduce((sum, v) => sum + (v.totalRevenue || 0), 0),
  };

  const handleToggleStatus = async (vendorId: string) => {
    try {
      const vendor = vendors.find(v => v.id === vendorId);
      if (!vendor) return;

      const newStatus = vendor.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`/api/admin/users/${vendorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus === 'active' }),
      });

      if (response.ok) {
        setVendors(prev =>
          prev.map(v =>
            v.id === vendorId ? { ...v, status: newStatus } : v
          )
        );
        showToast.success('Vendor status updated');
      } else {
        const data = await response.json();
        showToast.error(data.error || 'Failed to update vendor status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      showToast.error('Failed to update vendor status');
    }
  };

  const handleSaveVendor = async (updatedVendor: any) => {
    try {
      const response = await fetch(`/api/admin/users/${updatedVendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedVendor.name,
          email: updatedVendor.email,
          phone: updatedVendor.phone,
          businessName: updatedVendor.storeName || updatedVendor.businessName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh vendors list
        const status = statusFilter === 'all' ? '' : statusFilter;
        const searchParam = debouncedSearchQuery ? `&search=${encodeURIComponent(debouncedSearchQuery)}` : '';
        const url = `/api/admin/vendors?status=${status || 'all'}&page=${currentPage}&limit=${pagination.limit}${searchParam}`;
        const refreshResponse = await fetch(url);
        const refreshData = await refreshResponse.json();
        
        if (refreshResponse.ok) {
          setVendors(refreshData.vendors || []);
        }
        
        setEditingVendor(null);
        showToast.success('Vendor updated successfully!');
      } else {
        showToast.error(data.error || 'Failed to update vendor');
      }
    } catch (error) {
      console.error('Save vendor error:', error);
      showToast.error('Failed to update vendor');
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      const response = await fetch(`/api/admin/users/${vendorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh vendors list
        const status = statusFilter === 'all' ? '' : statusFilter;
        const searchParam = debouncedSearchQuery ? `&search=${encodeURIComponent(debouncedSearchQuery)}` : '';
        const url = `/api/admin/vendors?status=${status || 'all'}&page=${currentPage}&limit=${pagination.limit}${searchParam}`;
        const refreshResponse = await fetch(url);
        const refreshData = await refreshResponse.json();
        
        if (refreshResponse.ok) {
          setVendors(refreshData.vendors || []);
          if (refreshData.pagination) {
            setPagination(refreshData.pagination);
          }
        }
        
        showToast.success('Vendor deleted successfully!');
      } else {
        const data = await response.json();
        showToast.error(data.error || 'Failed to delete vendor');
      }
    } catch (error) {
      console.error('Delete vendor error:', error);
      showToast.error('Failed to delete vendor');
    }
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
            <Input
              type="text"
              placeholder="Search vendors by name, email, or store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.which === 13 || e.keyCode === 13) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              className="pl-10"
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

      {/* Vendors Grid */}
      {loading ? (
        <Card className="p-16">
          <div className="text-center">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50 animate-pulse" />
            <p className="text-lg text-muted-foreground">Loading vendors...</p>
          </div>
        </Card>
      ) : vendors.length === 0 ? (
        <Card className="p-16">
          <div className="text-center">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">No vendors found</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{vendor.name || vendor.fullName}</h3>
                      {(vendor.storeName || vendor.businessName) && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {vendor.storeName || vendor.businessName}
                        </p>
                      )}
                    </div>
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
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.address && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span className="line-clamp-2">{vendor.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Products</p>
                      <p className="font-bold">{vendor.totalProducts || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Orders</p>
                      <p className="font-bold">{vendor.totalOrders || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-bold">${((vendor.totalRevenue || vendor.revenue || 0) / 1000).toFixed(1)}K</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingVendor(vendor)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingVendor(vendor)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} vendors
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < pagination.totalPages) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        className={currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </Card>
          )}
        </>
      )}

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
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phone number validation
    if (formData.phone && formData.phone.trim()) {
      const phoneValidation = validatePhoneNumber(formData.phone);
      if (!phoneValidation.isValid && phoneValidation.error) {
        setPhoneError(phoneValidation.error);
        toast.error(phoneValidation.error);
        return;
      }
      setPhoneError(null);
      // Clean phone number before saving
      formData.phone = cleanPhoneNumber(formData.phone);
    }
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
                    value={formData.name || formData.fullName}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="store-name" className="block text-sm font-semibold mb-2">Store Name</Label>
                  <Input
                    id="store-name"
                    type="text"
                    value={formData.storeName || formData.businessName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value, businessName: e.target.value })}
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
                    value={formData.phone || formData.phoneNumber || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits
                      const digitsOnly = allowOnlyDigits(value);
                      // Format the phone number
                      const formatted = formatPhoneNumber(digitsOnly);
                      
                      setFormData({ ...formData, phone: formatted, phoneNumber: formatted });
                      // Real-time validation
                      if (digitsOnly && digitsOnly.trim()) {
                        const validation = validatePhoneNumber(digitsOnly);
                        if (!validation.isValid && validation.error) {
                          setPhoneError(validation.error);
                        } else {
                          setPhoneError(null);
                        }
                      } else {
                        setPhoneError(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Allow: backspace, delete, tab, escape, enter, and numbers
                      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true) ||
                        // Allow: home, end, left, right
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        return;
                      }
                      // Ensure that it is a number and stop the keypress
                      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                      }
                    }}
                    className={phoneError ? "border-red-500" : ""}
                    placeholder="12345678901"
                    required
                  />
                  {phoneError && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {phoneError}
                    </p>
                  )}
                </div>
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
              <h2 className="text-2xl font-bold">{vendor.name || vendor.fullName}</h2>
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
                <p className="text-2xl font-bold">{vendor.totalProducts || 0}</p>
              </Card>
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Orders</p>
                <p className="text-2xl font-bold">{vendor.totalOrders || 0}</p>
              </Card>
              <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-muted-foreground font-medium mb-1">Revenue</p>
                <p className="text-2xl font-bold">${((vendor.totalRevenue || vendor.revenue || 0) / 1000).toFixed(1)}K</p>
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
                {(vendor.phone || vendor.phoneNumber) && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-cyan-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{vendor.phone || vendor.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {(vendor.storeName || vendor.businessName) && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Store Name</p>
                      <p className="font-medium">{vendor.storeName || vendor.businessName}</p>
                    </div>
                  </div>
                )}
                {(vendor.joinDate || vendor.joinedDate) && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Join Date</p>
                      <p className="font-medium">{vendor.joinDate || vendor.joinedDate}</p>
                    </div>
                  </div>
                )}
              </div>
              {vendor.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{vendor.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
