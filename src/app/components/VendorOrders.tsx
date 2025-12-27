import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Eye,
  MoreVertical,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Download,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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
import { Separator } from './ui/separator';
import { toast } from 'sonner';

export function VendorOrders() {
  const { orders, getOrdersByVendor, updateOrder } = useApp();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const myOrders = user ? getOrdersByVendor(user.id) : [];

  const filteredOrders = myOrders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, newStatus: any) => {
    updateOrder(orderId, { status: newStatus });
    toast.success(`Order status updated to ${newStatus}`);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
          icon: Clock,
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
          icon: Package,
        };
      case 'shipped':
        return {
          color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
          icon: Truck,
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
          icon: CheckCircle2,
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
          icon: XCircle,
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
          icon: Package,
        };
    }
  };

  const stats = {
    total: myOrders.length,
    revenue: myOrders.reduce((sum, o) => sum + o.total, 0),
    pending: myOrders.filter(o => o.status === 'pending').length,
    processing: myOrders.filter(o => o.status === 'processing').length,
    shipped: myOrders.filter(o => o.status === 'shipped').length,
    delivered: myOrders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Order Management</h2>
        <p className="text-muted-foreground">
          Track and manage customer orders from your stores
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Transit</p>
              <p className="text-2xl font-bold">{stats.shipped}</p>
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
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
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
      {filteredOrders.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Items</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, index) => {
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
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Customer Information
                                </h4>
                                <div className="p-4 rounded-lg bg-muted space-y-2">
                                  <p className="font-medium">{order.customerName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.customerEmail}
                                  </p>
                                </div>
                              </div>

                              <Separator />

                              {/* Items */}
                              <div>
                                <h4 className="font-semibold mb-3">Order Items</h4>
                                <div className="space-y-3">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 p-3 rounded-lg bg-muted">
                                      <div className="w-16 h-16 rounded bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                                        {item.productImage ? (
                                          <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Package className="w-6 h-6 text-muted-foreground" />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                                        </p>
                                      </div>
                                      <p className="font-semibold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              {/* Shipping */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Shipping Address
                                </h4>
                                <div className="p-4 rounded-lg bg-muted">
                                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {order.shippingAddress.address}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    {order.shippingAddress.zipCode}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.shippingAddress.country}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Phone: {order.shippingAddress.phone}
                                  </p>
                                </div>
                              </div>

                              <Separator />

                              {/* Payment */}
                              <div>
                                <h4 className="font-semibold mb-3">Payment Details</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-lg">
                                      ${order.total.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm pt-2">
                                    <span className="text-muted-foreground">Payment Method</span>
                                    <Badge variant="outline">{order.paymentMethod}</Badge>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Payment Status</span>
                                    <Badge
                                      className={
                                        order.paymentStatus === 'paid'
                                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                      }
                                    >
                                      {order.paymentStatus}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'processing')}
                              disabled={order.status !== 'pending'}
                            >
                              <Package className="w-4 h-4 mr-2" />
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'shipped')}
                              disabled={order.status !== 'processing'}
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'delivered')}
                              disabled={order.status !== 'shipped'}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => toast.success('Invoice downloaded')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                              className="text-red-600"
                              disabled={order.status === 'delivered'}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Orders from your stores will appear here'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
