'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
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
  ResponsiveContainer,
} from 'recharts';

// Mock data for sales trend (last 30 days)
const salesTrendData = [
  { date: 'Dec 1', revenue: 850 },
  { date: 'Dec 2', revenue: 920 },
  { date: 'Dec 3', revenue: 780 },
  { date: 'Dec 4', revenue: 1100 },
  { date: 'Dec 5', revenue: 1250 },
  { date: 'Dec 6', revenue: 950 },
  { date: 'Dec 7', revenue: 1350 },
  { date: 'Dec 8', revenue: 1200 },
  { date: 'Dec 9', revenue: 1450 },
  { date: 'Dec 10', revenue: 1300 },
  { date: 'Dec 11', revenue: 1550 },
  { date: 'Dec 12', revenue: 1400 },
  { date: 'Dec 13', revenue: 1650 },
  { date: 'Dec 14', revenue: 1500 },
  { date: 'Dec 15', revenue: 1750 },
  { date: 'Dec 16', revenue: 1600 },
  { date: 'Dec 17', revenue: 1850 },
  { date: 'Dec 18', revenue: 1700 },
  { date: 'Dec 19', revenue: 1950 },
  { date: 'Dec 20', revenue: 1800 },
  { date: 'Dec 21', revenue: 2050 },
  { date: 'Dec 22', revenue: 1900 },
  { date: 'Dec 23', revenue: 2150 },
  { date: 'Dec 24', revenue: 2000 },
];

// Mock data for order volume trend
const orderVolumeTrendData = [
  { date: 'Dec 1', orders: 12 },
  { date: 'Dec 2', orders: 15 },
  { date: 'Dec 3', orders: 11 },
  { date: 'Dec 4', orders: 18 },
  { date: 'Dec 5', orders: 21 },
  { date: 'Dec 6', orders: 16 },
  { date: 'Dec 7', orders: 23 },
  { date: 'Dec 8', orders: 19 },
  { date: 'Dec 9', orders: 25 },
  { date: 'Dec 10', orders: 22 },
  { date: 'Dec 11', orders: 27 },
  { date: 'Dec 12', orders: 24 },
  { date: 'Dec 13', orders: 29 },
  { date: 'Dec 14', orders: 26 },
  { date: 'Dec 15', orders: 31 },
  { date: 'Dec 16', orders: 28 },
  { date: 'Dec 17', orders: 33 },
  { date: 'Dec 18', orders: 30 },
  { date: 'Dec 19', orders: 35 },
  { date: 'Dec 20', orders: 32 },
  { date: 'Dec 21', orders: 37 },
  { date: 'Dec 22', orders: 34 },
  { date: 'Dec 23', orders: 39 },
  { date: 'Dec 24', orders: 36 },
];

// Mock data for top 5 products
const topProductsData = [
  { id: 1, name: 'Wireless Headphones', orders: 156, revenue: 12480 },
  { id: 2, name: 'Smart Watch', orders: 98, revenue: 19600 },
  { id: 3, name: 'USB-C Cable', orders: 234, revenue: 3042 },
  { id: 4, name: 'Portable SSD', orders: 89, revenue: 11570 },
  { id: 5, name: 'Phone Case', orders: 187, revenue: 3740 },
];

// Mock data for product status distribution
const productStatusData = [
  { name: 'Active', value: 189, color: '#10b981' },
  { name: 'Low Stock', value: 34, color: '#f59e0b' },
  { name: 'Out of Stock', value: 24, color: '#ef4444' },
];

export function SupplierAnalytics() {
  const [dateRange, setDateRange] = useState('30');

  const stats = {
    totalRevenue: 42350,
    revenueChange: 15.3,
    avgOrderValue: 178.5,
    avgChange: 7.2,
    totalOrders: 764,
    ordersChange: 12.8,
    totalProducts: 247,
    activeProducts: 189,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Analytics</h2>
          <p className="text-muted-foreground">
            Track your sales performance and product insights
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

      {/* Sales Overview Stats */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Sales Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -mr-16 -mt-16" />
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full -mr-16 -mt-16" />
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
            <AreaChart data={salesTrendData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#revenueGradient)"
              />
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

        <Card className="p-6">
          <h4 className="font-semibold mb-4">Order Volume Trend (Last 30 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={orderVolumeTrendData}>
              <defs>
                <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
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
                dataKey="orders"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#orderGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product Performance */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-500" />
          Product Performance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top 5 Products */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-500" />
              Top 5 Best Selling Products
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
                      <p className="text-xs text-muted-foreground">{product.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">${product.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Product Status Distribution */}
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Product Status Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {productStatusData.map((status) => (
                <div key={status.name} className="text-center">
                  <p className="text-sm text-muted-foreground">{status.name}</p>
                  <p className="text-xl font-bold" style={{ color: status.color }}>
                    {status.value}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Summary */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold mb-3">Performance Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Active Products</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeProducts}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">${(stats.totalRevenue / 1000).toFixed(1)}K</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-cyan-600">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
