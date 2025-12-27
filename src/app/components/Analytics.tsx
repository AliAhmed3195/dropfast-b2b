import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Store,
  Building2,
  ArrowUp,
  ArrowDown,
  Calendar,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from './ui/utils';

// Mock data for revenue trend (last 30 days)
const revenueTrendData = [
  { date: 'Dec 1', revenue: 1200 },
  { date: 'Dec 2', revenue: 1450 },
  { date: 'Dec 3', revenue: 1300 },
  { date: 'Dec 4', revenue: 1600 },
  { date: 'Dec 5', revenue: 1800 },
  { date: 'Dec 6', revenue: 1550 },
  { date: 'Dec 7', revenue: 1900 },
  { date: 'Dec 8', revenue: 1700 },
  { date: 'Dec 9', revenue: 2100 },
  { date: 'Dec 10', revenue: 1950 },
  { date: 'Dec 11', revenue: 2200 },
  { date: 'Dec 12', revenue: 2050 },
  { date: 'Dec 13', revenue: 2300 },
  { date: 'Dec 14', revenue: 2150 },
  { date: 'Dec 15', revenue: 2400 },
  { date: 'Dec 16', revenue: 2250 },
  { date: 'Dec 17', revenue: 2500 },
  { date: 'Dec 18', revenue: 2350 },
  { date: 'Dec 19', revenue: 2600 },
  { date: 'Dec 20', revenue: 2450 },
  { date: 'Dec 21', revenue: 2700 },
  { date: 'Dec 22', revenue: 2550 },
  { date: 'Dec 23', revenue: 2800 },
  { date: 'Dec 24', revenue: 2650 },
];

// Mock data for order status distribution
const orderStatusData = [
  { name: 'Delivered', value: 145, color: '#10b981' },
  { name: 'Shipped', value: 48, color: '#6366f1' },
  { name: 'Processing', value: 32, color: '#06b6d4' },
  { name: 'Pending', value: 25, color: '#f59e0b' },
  { name: 'Cancelled', value: 12, color: '#ef4444' },
];

// Mock data for order volume trend
const orderVolumeTrendData = [
  { date: 'Dec 1', orders: 8 },
  { date: 'Dec 2', orders: 10 },
  { date: 'Dec 3', orders: 9 },
  { date: 'Dec 4', orders: 12 },
  { date: 'Dec 5', orders: 14 },
  { date: 'Dec 6', orders: 11 },
  { date: 'Dec 7', orders: 15 },
  { date: 'Dec 8', orders: 13 },
  { date: 'Dec 9', orders: 16 },
  { date: 'Dec 10', orders: 14 },
  { date: 'Dec 11', orders: 17 },
  { date: 'Dec 12', orders: 15 },
  { date: 'Dec 13', orders: 18 },
  { date: 'Dec 14', orders: 16 },
  { date: 'Dec 15', orders: 19 },
  { date: 'Dec 16', orders: 17 },
  { date: 'Dec 17', orders: 20 },
  { date: 'Dec 18', orders: 18 },
  { date: 'Dec 19', orders: 21 },
  { date: 'Dec 20', orders: 19 },
  { date: 'Dec 21', orders: 22 },
  { date: 'Dec 22', orders: 20 },
  { date: 'Dec 23', orders: 23 },
  { date: 'Dec 24', orders: 21 },
];

// Mock data for top vendors
const topVendorsData = [
  { name: 'Tech Haven', revenue: 15750 },
  { name: 'Smart Gadgets', revenue: 12340 },
  { name: 'Digital Store', revenue: 9850 },
  { name: 'Gadget World', revenue: 7560 },
  { name: 'Tech Plaza', revenue: 6420 },
];

// Mock data for top suppliers
const topSuppliersData = [
  { name: 'Global Electronics', orders: 145 },
  { name: 'Tech Supply Co.', orders: 132 },
  { name: 'Digital Imports', orders: 98 },
  { name: 'Smart Tech Ltd.', orders: 76 },
  { name: 'Gadget Wholesale', orders: 54 },
];

// Mock data for top products
const topProductsData = [
  { id: 1, name: 'Wireless Headphones', units: 234, revenue: 18720 },
  { id: 2, name: 'Smart Watch', units: 189, revenue: 56700 },
  { id: 3, name: 'Phone Case', units: 456, revenue: 9120 },
  { id: 4, name: 'USB-C Cable', units: 678, revenue: 8814 },
  { id: 5, name: 'Power Bank', units: 321, revenue: 16050 },
];

// Mock data for user registration trend
const userRegistrationData = [
  { date: 'Dec 1', users: 5 },
  { date: 'Dec 2', users: 7 },
  { date: 'Dec 3', users: 6 },
  { date: 'Dec 4', users: 9 },
  { date: 'Dec 5', users: 11 },
  { date: 'Dec 6', users: 8 },
  { date: 'Dec 7', users: 12 },
  { date: 'Dec 8', users: 10 },
  { date: 'Dec 9', users: 14 },
  { date: 'Dec 10', users: 12 },
  { date: 'Dec 11', users: 15 },
  { date: 'Dec 12', users: 13 },
  { date: 'Dec 13', users: 16 },
  { date: 'Dec 14', users: 14 },
  { date: 'Dec 15', users: 18 },
  { date: 'Dec 16', users: 16 },
  { date: 'Dec 17', users: 19 },
  { date: 'Dec 18', users: 17 },
  { date: 'Dec 19', users: 21 },
  { date: 'Dec 20', users: 19 },
  { date: 'Dec 21', users: 22 },
  { date: 'Dec 22', users: 20 },
  { date: 'Dec 23', users: 24 },
  { date: 'Dec 24', users: 22 },
];

// Mock data for user type distribution
const userTypeData = [
  { name: 'Customers', value: 845, color: '#6366f1' },
  { name: 'Vendors', value: 28, color: '#06b6d4' },
  { name: 'Suppliers', value: 15, color: '#10b981' },
];

export function Analytics() {
  const [dateRange, setDateRange] = useState('30');

  const stats = {
    totalRevenue: 65230,
    revenueChange: 12.5,
    avgOrderValue: 234.5,
    avgChange: 5.2,
    totalOrders: 262,
    ordersChange: 8.3,
    totalUsers: 888,
    newUsers: 45,
    activeVendors: 23,
    activeSuppliers: 12,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your platform performance
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="365">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Revenue Overview */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-purple-500" />
          Revenue Overview
        </h3>
        
        {/* Revenue Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-bold mb-2">${stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-semibold">{stats.revenueChange}%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold mb-2">${stats.avgOrderValue.toFixed(2)}</p>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-semibold">{stats.avgChange}%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl font-bold mb-2">{stats.totalOrders}</p>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-semibold">{stats.ordersChange}%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Revenue Trend Chart */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Revenue Trend (Last 30 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueTrendData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="url(#gradient)"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Order Analytics */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-cyan-500" />
          Order Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Order Status Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Fulfillment Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((145 / 262) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cancellation Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {((12 / 262) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          {/* Order Volume Trend */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Order Volume Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderVolumeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Top Performers */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-500" />
          Top Performers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Vendors */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-500" />
              Top 5 Vendors by Revenue
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topVendorsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                  {topVendorsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#vendorGradient${index})`}
                    />
                  ))}
                </Bar>
                <defs>
                  {topVendorsData.map((_, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`vendorGradient${index}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Suppliers */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-500" />
              Top 5 Suppliers by Orders
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topSuppliersData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" radius={[0, 8, 8, 0]}>
                  {topSuppliersData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#supplierGradient${index})`}
                    />
                  ))}
                </Bar>
                <defs>
                  {topSuppliersData.map((_, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`supplierGradient${index}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Products */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-green-500" />
              Top 5 Products
            </h4>
            <div className="space-y-3">
              {topProductsData.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.units} units sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-purple-600">${product.revenue.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Platform Growth */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Platform Growth
        </h3>

        {/* Growth Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">New Users (This Month)</p>
            <p className="text-3xl font-bold text-green-600">+{stats.newUsers}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Vendors</p>
            <p className="text-3xl font-bold text-cyan-600">{stats.activeVendors}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Suppliers</p>
            <p className="text-3xl font-bold text-purple-600">{stats.activeSuppliers}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Registration Trend */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">User Registration Trend (Last 30 Days)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userRegistrationData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#userGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* User Type Distribution */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">User Type Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
