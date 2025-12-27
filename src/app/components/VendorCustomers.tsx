import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Eye,
  Calendar,
  Star,
  Package,
  X,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// Mock customer data - will come from Supabase in production
const mockCustomers = [
  {
    id: 'CUST-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    avatar: '',
    joinDate: '2024-10-15',
    lastOrder: '2024-12-24',
    totalOrders: 12,
    totalSpent: 1247.88,
    status: 'active',
    rating: 4.8,
    orders: [
      { id: 'ORD-001', date: '2024-12-24', total: 79.99, status: 'delivered', items: 2 },
      { id: 'ORD-002', date: '2024-12-20', total: 149.99, status: 'delivered', items: 1 },
      { id: 'ORD-003', date: '2024-12-15', total: 89.99, status: 'delivered', items: 3 },
    ],
  },
  {
    id: 'CUST-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, USA',
    avatar: '',
    joinDate: '2024-11-02',
    lastOrder: '2024-12-23',
    totalOrders: 8,
    totalSpent: 892.45,
    status: 'active',
    rating: 5.0,
    orders: [
      { id: 'ORD-004', date: '2024-12-23', total: 199.99, status: 'shipped', items: 1 },
      { id: 'ORD-005', date: '2024-12-18', total: 129.99, status: 'delivered', items: 2 },
    ],
  },
  {
    id: 'CUST-003',
    name: 'Mike Wilson',
    email: 'mike.wilson@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, USA',
    avatar: '',
    joinDate: '2024-09-20',
    lastOrder: '2024-12-22',
    totalOrders: 15,
    totalSpent: 2145.67,
    status: 'vip',
    rating: 4.9,
    orders: [
      { id: 'ORD-006', date: '2024-12-22', total: 299.99, status: 'processing', items: 4 },
      { id: 'ORD-007', date: '2024-12-19', total: 189.99, status: 'delivered', items: 2 },
      { id: 'ORD-008', date: '2024-12-16', total: 249.99, status: 'delivered', items: 3 },
    ],
  },
  {
    id: 'CUST-004',
    name: 'Emily Brown',
    email: 'emily.b@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Miami, USA',
    avatar: '',
    joinDate: '2024-12-01',
    lastOrder: '2024-12-21',
    totalOrders: 3,
    totalSpent: 267.97,
    status: 'active',
    rating: 4.5,
    orders: [
      { id: 'ORD-009', date: '2024-12-21', total: 45.99, status: 'delivered', items: 1 },
      { id: 'ORD-010', date: '2024-12-18', total: 99.99, status: 'delivered', items: 2 },
    ],
  },
  {
    id: 'CUST-005',
    name: 'David Lee',
    email: 'david.lee@email.com',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, USA',
    avatar: '',
    joinDate: '2024-08-10',
    lastOrder: '2024-12-20',
    totalOrders: 20,
    totalSpent: 3567.89,
    status: 'vip',
    rating: 5.0,
    orders: [
      { id: 'ORD-011', date: '2024-12-20', total: 399.99, status: 'delivered', items: 5 },
      { id: 'ORD-012', date: '2024-12-17', total: 279.99, status: 'delivered', items: 3 },
    ],
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  vip: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

const orderStatusColors = {
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function VendorCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || customer.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter((c) => c.status === 'active').length;
  const vipCustomers = mockCustomers.filter((c) => c.status === 'vip').length;
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Customer Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your registered customers and view their activity
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Customers',
            value: totalCustomers,
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
          },
          {
            label: 'Active Customers',
            value: activeCustomers,
            icon: TrendingUp,
            gradient: 'from-green-500 to-green-600',
          },
          {
            label: 'VIP Customers',
            value: vipCustomers,
            icon: Star,
            gradient: 'from-purple-500 to-purple-600',
          },
          {
            label: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            gradient: 'from-yellow-500 to-yellow-600',
          },
          {
            label: 'Avg Order Value',
            value: `$${avgOrderValue.toFixed(2)}`,
            icon: ShoppingBag,
            gradient: 'from-cyan-500 to-cyan-600',
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Customer List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Customer</th>
                <th className="text-left py-4 px-6 font-semibold">Contact</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Orders</th>
                <th className="text-left py-4 px-6 font-semibold">Total Spent</th>
                <th className="text-left py-4 px-6 font-semibold">Last Order</th>
                <th className="text-left py-4 px-6 font-semibold">Rating</th>
                <th className="text-center py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, idx) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={statusColors[customer.status as keyof typeof statusColors]}>
                      {customer.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{customer.totalOrders}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-green-600">
                      ${customer.totalSpent.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{customer.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No customers found</p>
          </div>
        )}
      </Card>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCustomer(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                    <p className="text-purple-100">{selectedCustomer.id}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {selectedCustomer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {selectedCustomer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {selectedCustomer.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-cyan-600" />
                    Purchase Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Orders:</span>
                      <span className="font-semibold">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Spent:</span>
                      <span className="font-semibold text-green-600">
                        ${selectedCustomer.totalSpent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Order Value:</span>
                      <span className="font-semibold">
                        ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Customer Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{selectedCustomer.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Order History */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Recent Order History
                </h3>
                <div className="space-y-3">
                  {selectedCustomer.orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                          <Package className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{order.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()} • {order.items} items
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={orderStatusColors[order.status as keyof typeof orderStatusColors]}>
                          {order.status}
                        </Badge>
                        <div className="font-semibold text-green-600">
                          ${order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
