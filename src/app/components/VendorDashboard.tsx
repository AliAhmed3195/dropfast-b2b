import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Store,
  ShoppingCart,
  DollarSign,
  Users,
  Plus,
  TrendingUp,
  Package,
  Star,
  BarChart3,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  Activity,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Enhanced mock data
const salesData = [
  { date: 'Mon', sales: 2400, orders: 24, revenue: 2400 },
  { date: 'Tue', sales: 3200, orders: 32, revenue: 3200 },
  { date: 'Wed', sales: 2800, orders: 28, revenue: 2800 },
  { date: 'Thu', sales: 4100, orders: 41, revenue: 4100 },
  { date: 'Fri', sales: 3800, orders: 38, revenue: 3800 },
  { date: 'Sat', sales: 5200, orders: 52, revenue: 5200 },
  { date: 'Sun', sales: 4600, orders: 46, revenue: 4600 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#6366f1' },
  { name: 'Fashion', value: 25, color: '#8b5cf6' },
  { name: 'Home', value: 20, color: '#06b6d4' },
  { name: 'Sports', value: 12, color: '#10b981' },
  { name: 'Others', value: 8, color: '#f59e0b' },
];

const topProducts = [
  { name: 'Premium Headphones', sales: 234, revenue: 18720, rating: 4.8, trend: 12 },
  { name: 'Smart Watch Pro', sales: 189, revenue: 37800, rating: 4.9, trend: 8 },
  { name: 'Laptop Stand', sales: 156, revenue: 7176, rating: 4.6, trend: -3 },
  { name: 'Wireless Mouse', sales: 145, revenue: 4350, rating: 4.7, trend: 15 },
  { name: 'USB-C Hub', sales: 134, revenue: 4020, rating: 4.5, trend: 5 },
];

const recentActivity = [
  { type: 'order', message: 'New order #ORD-1234 from John Smith', time: '5 min ago', icon: ShoppingCart },
  { type: 'product', message: 'Low stock alert: Wireless Mouse', time: '12 min ago', icon: AlertCircle },
  { type: 'review', message: 'New 5-star review on Smart Watch Pro', time: '1 hour ago', icon: Star },
  { type: 'shipment', message: 'Order #ORD-1230 delivered', time: '2 hours ago', icon: CheckCircle },
];

export function VendorDashboard() {
  const { user } = useAuth();
  const { stores, getStoresByVendor, getOrdersByVendor } = useApp();
  const { setView } = useNavigation();
  const [timeRange, setTimeRange] = useState('7d');

  const myStores = user ? getStoresByVendor(user.id) : [];
  const myOrders = user ? getOrdersByVendor(user.id) : [];
  const totalProducts = myStores.reduce((sum, store) => sum + store.products.length, 0);

  // Calculate stats
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const avgOrderValue = totalSales / salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalRevenue = totalSales;
  const pendingOrders = Math.floor(myOrders.length * 0.3);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+24.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-500/10 to-emerald-500/10',
    },
    {
      title: 'Total Orders',
      value: salesData.reduce((sum, day) => sum + day.orders, 0).toString(),
      change: '+12.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      title: 'Active Products',
      value: totalProducts.toString(),
      change: `${myStores.length} stores`,
      trend: 'neutral',
      icon: Package,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-500/10 to-pink-500/10',
    },
    {
      title: 'Active Stores',
      value: myStores.filter(s => s.status === 'active').length.toString(),
      change: `${myStores.length} total`,
      trend: 'neutral',
      icon: Store,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-500/10 to-red-500/10',
    },
  ];

  const performanceMetrics = [
    { label: 'Conversion Rate', value: '3.8%', change: '+0.5%', trend: 'up' },
    { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, change: '+8.2%', trend: 'up' },
    { label: 'Customer Rating', value: '4.7', change: '+0.2', trend: 'up' },
    { label: 'Pending Orders', value: pendingOrders.toString(), change: '-5', trend: 'down' },
  ];

  if (myStores.length === 0) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
              >
                <Store className="w-12 h-12 text-indigo-600" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                Welcome to FastDrop!
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your first store to start selling products. Our wizard will guide you through the process in just a few minutes.
              </p>
              <Button
                onClick={() => setView('store-creation')}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Store
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setView('stores')}>
            <Store className="w-4 h-4 mr-2" />
            Manage Stores
          </Button>
          <Button 
            onClick={() => setView('products')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="relative p-6 overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700">
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-indigo-600 shadow-sm">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend !== 'neutral' && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  )}
                  {stat.trend === 'neutral' && (
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  )}
                </div>
                <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Revenue Analytics</h3>
              <p className="text-sm text-muted-foreground">Weekly performance overview</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-semibold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {metric.change}
                </div>
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top Selling Products</h3>
            <Button variant="ghost" size="sm" onClick={() => setView('products')}>
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{product.sales} sales</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${product.revenue.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${
                    product.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(product.trend)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="flex items-start gap-3 pb-4 border-b last:border-0"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'order' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  activity.type === 'product' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  activity.type === 'review' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-green-100 dark:bg-green-900/30'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.type === 'order' ? 'text-blue-600' :
                    activity.type === 'product' ? 'text-yellow-600' :
                    activity.type === 'review' ? 'text-purple-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{activity.message}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Product', icon: Package, view: 'products' },
            { label: 'View Orders', icon: ShoppingCart, view: 'orders' },
            { label: 'Manage Inventory', icon: Boxes, view: 'inventory' },
            { label: 'View Customers', icon: Users, view: 'customers' },
          ].map((action, idx) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              onClick={() => setView(action.view as any)}
              className="group relative p-6 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all"
            >
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-600 text-white">
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">{action.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  );
}