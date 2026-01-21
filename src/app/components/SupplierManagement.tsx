'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useApiCall } from '../../hooks/useApiCall';
import { motion } from 'motion/react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Mail, Phone, Building2, MapPin, CheckCircle2, XCircle, Package } from 'lucide-react';
import { UserForm } from './UserForm';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { showToast } from '../../lib/toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from './ui/pagination';

interface Supplier {
  id: string;
  fullName: string;
  email: string;
  businessName?: string;
  country?: string;
  phoneNumber?: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  totalProducts: number;
  totalRevenue: number;
}

export function SupplierManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
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
  }, [filterStatus, debouncedSearchQuery]);

  // Abort controller ref for search
  const searchAbortControllerRef = useRef<AbortController | null>(null);

  // Fetch suppliers on mount and when filters/page change
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
        const status = filterStatus === 'all' ? '' : filterStatus;
        const searchParam = debouncedSearchQuery ? `&search=${encodeURIComponent(debouncedSearchQuery)}` : '';
        const url = `/api/admin/suppliers?status=${status || 'all'}&page=${currentPage}&limit=${pagination.limit}${searchParam}`;
        const response = await fetch(url, { signal: signal || abortController.signal });
        const data = await response.json();
        
        if (response.ok) {
          setSuppliers(data.suppliers || []);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        } else {
          showToast.error(data.error || 'Failed to fetch suppliers');
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Fetch suppliers error:', error);
          showToast.error('Failed to fetch suppliers');
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
  }, [filterStatus, currentPage, debouncedSearchQuery, callApi, pagination.limit]);


  const handleDeleteSupplier = async (supplierId: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const response = await fetch(`/api/admin/users/${supplierId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh suppliers list
        const status = filterStatus === 'all' ? '' : filterStatus;
        const searchParam = debouncedSearchQuery ? `&search=${encodeURIComponent(debouncedSearchQuery)}` : '';
        const url = `/api/admin/suppliers?status=${status || 'all'}&page=${currentPage}&limit=${pagination.limit}${searchParam}`;
        const refreshResponse = await fetch(url);
        const refreshData = await refreshResponse.json();
        
        if (refreshResponse.ok) {
          setSuppliers(refreshData.suppliers || []);
          if (refreshData.pagination) {
            setPagination(refreshData.pagination);
          }
        }
        
        showToast.success('Supplier deleted successfully!');
      } else {
        const data = await response.json();
        showToast.error(data.error || 'Failed to delete supplier');
      }
    } catch (error) {
      console.error('Delete supplier error:', error);
      showToast.error('Failed to delete supplier');
    }
  };

  if (showForm || editingSupplier) {
    return (
      <UserForm
        preSelectedRole="supplier"
        editUser={editingSupplier}
        onCancel={() => {
          setShowForm(false);
          setEditingSupplier(null);
        }}
        onSuccess={async () => {
          setShowForm(false);
          setEditingSupplier(null);
          // Refresh suppliers list
          const status = filterStatus === 'all' ? '' : filterStatus;
          const searchParam = debouncedSearchQuery ? `&search=${encodeURIComponent(debouncedSearchQuery)}` : '';
          const url = `/api/admin/suppliers?status=${status || 'all'}&page=${currentPage}&limit=${pagination.limit}${searchParam}`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (response.ok) {
            setSuppliers(data.suppliers || []);
            if (data.pagination) {
              setPagination(data.pagination);
            }
          }
          // Toast message is already shown in UserForm
        }}
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
            Supplier Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage your supplier accounts</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Suppliers', value: suppliers.length, color: 'from-blue-500 to-blue-600', icon: Building2 },
          { label: 'Active', value: suppliers.filter(s => s.status === 'active').length, color: 'from-green-500 to-green-600', icon: CheckCircle2 },
          { label: 'Inactive', value: suppliers.filter(s => s.status === 'inactive').length, color: 'from-red-500 to-red-600', icon: XCircle },
          { label: 'Total Products', value: suppliers.reduce((sum, s) => sum + s.totalProducts, 0), color: 'from-purple-500 to-purple-600', icon: Building2 },
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
              type="text"
              placeholder="Search suppliers by name, email, or company..."
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

      {/* Suppliers Table */}
      <Card>
        {loading ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50 animate-pulse" />
            <p className="text-lg text-muted-foreground">Loading suppliers...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Business</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
                <TableHead className="font-semibold">Revenue</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier, index) => (
                <motion.tr
                  key={supplier.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          {(supplier.fullName || 'S').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{supplier.fullName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {supplier.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{supplier.businessName || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {supplier.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{supplier.phoneNumber}</span>
                        </div>
                      )}
                      {supplier.country && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{supplier.country}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{supplier.totalProducts || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">${((supplier.totalRevenue || 0) / 1000).toFixed(1)}K</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        supplier.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }
                    >
                      {supplier.status === 'active' ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingSupplier(supplier);
                            setShowForm(false);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Supplier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && suppliers.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">No suppliers found</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add First Supplier
            </Button>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} suppliers
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

    </div>
  );
}
