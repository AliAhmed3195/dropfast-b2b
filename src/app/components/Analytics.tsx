'use client'

import React, { useState, useEffect, useRef } from 'react';
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
import { showToast } from '../../lib/toast';
import { cn } from './ui/utils';

// All mock data removed - data now comes from API only

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const fetchingAnalyticsRef = useRef(false);

  useEffect(() => {
    if (fetchingAnalyticsRef.current) return;
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    if (fetchingAnalyticsRef.current) return;
    fetchingAnalyticsRef.current = true;
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?dateRange=${dateRange}`);
      const data = await response.json();
      
      if (response.ok) {
        setAnalyticsData(data);
      } else {
        showToast.error(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Fetch analytics error:', error);
      showToast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
      fetchingAnalyticsRef.current = false;
    }
  };

  // Use API data only - no fallback to mock data
  const revenueTrendData = analyticsData?.revenueTrend || [];
  const orderStatusData = analyticsData?.orderStatus || [];
  const orderVolumeTrendData = analyticsData?.orderVolumeTrend || [];
  const topVendorsData = analyticsData?.topVendors || [];
  const topSuppliersData = analyticsData?.topSuppliers || [];
  const topProductsData = analyticsData?.topProducts || [];
  const userRegistrationData = analyticsData?.userRegistration || [];
  const userTypeData = analyticsData?.userType || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = analyticsData?.stats || {
    totalRevenue: 0,
    revenueChange: 0,
    avgOrderValue: 0,
    avgChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalUsers: 0,
    newUsers: 0,
    activeVendors: 0,
    activeSuppliers: 0,
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
          <h4 className="font-semibold mb-4">Revenue Trend (Last {dateRange} Days)</h4>
          {revenueTrendData.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <p>No revenue data available</p>
            </div>
          )}
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
            {orderStatusData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No order data available</p>
              </div>
            )}
            {orderStatusData.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Fulfillment Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(() => {
                      const delivered = orderStatusData.find(s => s.name === 'Delivered')?.value || 0
                      const total = orderStatusData.reduce((sum, s) => sum + s.value, 0)
                      return total > 0 ? ((delivered / total) * 100).toFixed(1) : '0.0'
                    })()}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Cancellation Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {(() => {
                      const cancelled = orderStatusData.find(s => s.name === 'Cancelled')?.value || 0
                      const total = orderStatusData.reduce((sum, s) => sum + s.value, 0)
                      return total > 0 ? ((cancelled / total) * 100).toFixed(1) : '0.0'
                    })()}%
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Order Volume Trend */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Order Volume Trend</h4>
            {orderVolumeTrendData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No order volume data available</p>
              </div>
            )}
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
            {topVendorsData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No vendor data available</p>
              </div>
            )}
          </Card>

          {/* Top Suppliers */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-500" />
              Top 5 Suppliers by Orders
            </h4>
            {topSuppliersData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No supplier data available</p>
              </div>
            )}
          </Card>

          {/* Top Products */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-green-500" />
              Top 5 Products
            </h4>
            {topProductsData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No product data available</p>
              </div>
            )}
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
            <h4 className="font-semibold mb-4">User Registration Trend (Last {dateRange} Days)</h4>
            {userRegistrationData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No user registration data available</p>
              </div>
            )}
          </Card>

          {/* User Type Distribution */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">User Type Distribution</h4>
            {userTypeData.length > 0 && userTypeData.some(u => u.value > 0) ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No user type data available</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
