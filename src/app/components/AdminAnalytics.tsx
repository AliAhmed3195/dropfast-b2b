import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { Card } from './ui/card';
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

// Analytics datasets – start empty, to be filled with real metrics later
const revenueData: Array<{ month: string; revenue: number; orders: number }> = [];

const categoryData: Array<{ name: string; value: number }> = [];

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Platform Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">$0</p>
              <p className="text-xs text-muted-foreground font-medium">No data yet</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground font-medium">No data yet</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground font-medium">No data yet</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Products Listed</p>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground font-medium">No data yet</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Volume */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Order Volume
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="orders" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Growth Metrics */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Growth Metrics</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Revenue Growth</span>
                <span className="text-sm font-bold text-green-600">+24.5%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">User Acquisition</span>
                <span className="text-sm font-bold text-blue-600">+18.3%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Product Listings</span>
                <span className="text-sm font-bold text-purple-600">+12.7%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: '50%' }}
                />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Conversion Rate</span>
                <span className="text-sm font-bold text-orange-600">+8.9%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  style={{ width: '45%' }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
