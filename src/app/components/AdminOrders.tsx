'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  X,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Box,
  AlertCircle,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { showToast } from '../../lib/toast';
import { cn } from './ui/utils';

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'approved', label: 'Approved', icon: CheckCircle2, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
];

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const fetchingOrdersRef = useRef(false);
  const currentAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Prevent duplicate calls
    if (fetchingOrdersRef.current) {
      return;
    }

    // Abort previous request if any
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
    }

    let isMounted = true;
    const abortController = new AbortController();
    currentAbortControllerRef.current = abortController;
    fetchingOrdersRef.current = true;

    const fetchOrders = async () => {
      if (!isMounted) return;

      try {
        setLoading(true);
        const status = statusFilter === 'all' ? '' : statusFilter;
        const url = status ? `/api/admin/orders?status=${status}` : '/api/admin/orders';
        const response = await fetch(url, {
          signal: abortController.signal,
        });
        const data = await response.json();
        
        if (isMounted && response.ok) {
          setOrders(data.orders || []);
        } else if (isMounted && !response.ok) {
          showToast.error(data.error || 'Failed to fetch orders');
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Fetch orders error:', error);
          showToast.error('Failed to fetch orders');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          fetchingOrdersRef.current = false;
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
      abortController.abort();
      currentAbortControllerRef.current = null;
      fetchingOrdersRef.current = false;
    };
  }, [statusFilter]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate current month orders
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    currentMonth: currentMonthOrders.length,
    currentMonthRevenue: currentMonthOrders.reduce((sum, o) => sum + o.total, 0),
  };

  const getStatusConfig = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const handleStatusUpdate = async (statusValue: string) => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusValue }), // Send status value (e.g., "pending", "approved")
      });

      const data = await response.json();

      if (response.ok) {
        // Refetch orders
        const refetchResponse = await fetch('/api/admin/orders');
        if (refetchResponse.ok) {
          const refetchData = await refetchResponse.json();
          setOrders(refetchData.orders || []);
        }
        const statusLabel = statusOptions.find(s => s.value === statusValue)?.label || statusValue;
        showToast.success(`Order status updated to ${statusLabel}`);
        setShowStatusUpdate(false);
        setSelectedOrder(null);
      } else {
        showToast.error(data.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Update order error:', error);
      showToast.error('Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Order Management</h2>
          <p className="text-muted-foreground">
            Manage and track all orders across the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pending Orders</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Requires attention</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">This Month</p>
              <p className="text-3xl font-bold">{stats.currentMonth}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ${stats.currentMonthRevenue.toFixed(2)} revenue
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number, customer name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Order</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                    />
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">No orders found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery || statusFilter !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'No orders have been placed yet'}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{order.vendor}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                            {order.customer.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{order.items.length} items</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-purple-600">${order.total.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusUpdate(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && !showStatusUpdate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] z-50"
            >
              <Card className="h-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-6 flex items-center justify-between z-10 flex-shrink-0">
                  <div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-sm text-muted-foreground">{selectedOrder.orderNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {/* Status */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Order Status</Label>
                    <Badge className={`${getStatusConfig(selectedOrder.status).color} text-base px-4 py-2`}>
                      {React.createElement(getStatusConfig(selectedOrder.status).icon, { className: 'w-4 h-4 mr-2' })}
                      {getStatusConfig(selectedOrder.status).label}
                    </Badge>
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                      <Label className="text-sm text-muted-foreground block mb-2">Order Number</Label>
                      <p className="font-bold text-lg">{selectedOrder.orderNumber}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                      <Label className="text-sm text-muted-foreground block mb-2">Order Date</Label>
                      <p className="font-bold text-lg">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Vendor Info */}
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">Vendor Information</Label>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-cyan-500" />
                        <span className="font-semibold text-lg">{selectedOrder.vendor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">Customer Information</Label>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">{selectedOrder.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">{selectedOrder.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">{selectedOrder.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">{selectedOrder.customer.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">Order Items</Label>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                              <Box className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-purple-600">${(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-purple-600">${selectedOrder.total.toFixed(2)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                      onClick={() => setShowStatusUpdate(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Status
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}

        {/* Status Update Modal */}
        {selectedOrder && showStatusUpdate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowStatusUpdate(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Update Order Status</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Only status can be changed. Other order details are read-only.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStatusUpdate(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-3 block">
                      Select New Status for {selectedOrder.orderNumber}
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {statusOptions.map(status => {
                        const StatusIcon = status.icon;
                        return (
                          <motion.button
                            key={status.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate(status.value)}
                            className={cn(
                              'p-4 rounded-xl border-2 transition-all text-left',
                              selectedOrder.status === status.value
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                            )}
                          >
                            <Badge className={`${status.color} mb-2`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                            {selectedOrder.status === status.value && (
                              <p className="text-xs text-muted-foreground">Current Status</p>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}