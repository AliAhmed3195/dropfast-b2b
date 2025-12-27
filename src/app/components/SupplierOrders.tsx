'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { AnimatePresence } from 'motion/react';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-12-20',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
    },
    vendor: 'Tech Haven Store',
    items: [
      { name: 'Wireless Headphones', quantity: 2, price: 79.99 },
      { name: 'Phone Case', quantity: 1, price: 19.99 },
    ],
    total: 179.97,
    status: 'pending',
  },
  {
    id: 'ORD-2024-002',
    date: '2024-12-21',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA 90001',
    },
    vendor: 'Smart Gadgets Hub',
    items: [
      { name: 'Smart Watch', quantity: 1, price: 199.99 },
      { name: 'USB-C Cable', quantity: 2, price: 12.99 },
    ],
    total: 225.97,
    status: 'processing',
  },
  {
    id: 'ORD-2024-003',
    date: '2024-12-22',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine Rd, Chicago, IL 60601',
    },
    vendor: 'Digital Store',
    items: [
      { name: 'Laptop Stand', quantity: 1, price: 45.99 },
    ],
    total: 45.99,
    status: 'shipped',
  },
  {
    id: 'ORD-2024-004',
    date: '2024-12-23',
    customer: {
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, Miami, FL 33101',
    },
    vendor: 'Tech Plaza',
    items: [
      { name: 'Portable SSD', quantity: 1, price: 129.99 },
      { name: 'Wireless Mouse', quantity: 1, price: 29.99 },
    ],
    total: 159.98,
    status: 'delivered',
  },
  {
    id: 'ORD-2024-005',
    date: '2024-12-24',
    customer: {
      name: 'Tom Brown',
      email: 'tom@example.com',
      phone: '+1 (555) 567-8901',
      address: '654 Maple Dr, Boston, MA 02101',
    },
    vendor: 'Gadget World',
    items: [
      { name: 'Keyboard', quantity: 1, price: 79.99 },
    ],
    total: 79.99,
    status: 'cancelled',
  },
];

export function SupplierOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
    processing: mockOrders.filter(o => o.status === 'processing').length,
    shipped: mockOrders.filter(o => o.status === 'shipped').length,
    delivered: mockOrders.filter(o => o.status === 'delivered').length,
    cancelled: mockOrders.filter(o => o.status === 'cancelled').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order);
    setShowUpdateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Orders</h2>
          <p className="text-muted-foreground">
            Manage and fulfill customer orders
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-4 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-muted-foreground mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
        </Card>
        <Card className="p-4 border-purple-200 dark:border-purple-800">
          <p className="text-sm text-muted-foreground mb-1">Shipped</p>
          <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
        </Card>
        <Card className="p-4 border-green-200 dark:border-green-800">
          <p className="text-sm text-muted-foreground mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </Card>
        <Card className="p-4 border-red-200 dark:border-red-800">
          <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer name..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Vendor</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order, index) => (
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
                    <span className="font-mono font-semibold text-sm">
                      {order.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">
                        {order.customer.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{order.vendor}</TableCell>
                <TableCell className="text-sm">{order.items.length} items</TableCell>
                <TableCell>
                  <span className="font-bold text-purple-600">
                    ${order.total.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={cn('capitalize', getStatusColor(order.status))}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(order)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showUpdateModal && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => {
                setShowUpdateModal(false);
                setSelectedOrder(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl z-50"
            >
              <OrderDetailModal
                order={selectedOrder}
                onClose={() => {
                  setShowUpdateModal(false);
                  setSelectedOrder(null);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Order Detail Modal Component
function OrderDetailModal({ order, onClose }: { order: any; onClose: () => void }) {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Order status updated successfully!');
    setIsUpdating(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card className="max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-6 flex items-center justify-between z-10">
        <div>
          <h2 className="text-2xl font-bold">Order Details</h2>
          <p className="text-sm text-muted-foreground font-mono">{order.id}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              Order Date
            </div>
            <p className="font-semibold">
              {new Date(order.date).toLocaleDateString()}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Package className="w-4 h-4" />
              Current Status
            </div>
            <Badge className={cn('capitalize', getStatusColor(order.status))}>
              {order.status}
            </Badge>
          </Card>
        </div>

        {/* Customer Info */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Customer Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-semibold">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Vendor</p>
              <p className="font-semibold">{order.vendor}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </p>
              <p className="font-medium">{order.customer.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </p>
              <p className="font-medium">{order.customer.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </p>
              <p className="font-medium">{order.customer.address}</p>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <div>
          <h3 className="font-bold mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Total */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">Order Total</span>
            <span className="text-3xl font-bold text-purple-600">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </Card>

        {/* Update Status */}
        <div className="space-y-4">
          <h3 className="font-bold">Update Order Status</h3>
          <div className="space-y-2">
            <Label htmlFor="status">Select New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            onClick={handleUpdateStatus}
            disabled={isUpdating || status === order.status}
            className="flex-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700"
          >
            {isUpdating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Update Status
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
