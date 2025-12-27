import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Activity,
  Award,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Card } from './ui/card';
import {
  LineChart,
  Line,
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
  Legend,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 234 },
  { month: 'Feb', revenue: 52000, orders: 289 },
  { month: 'Mar', revenue: 48000, orders: 267 },
  { month: 'Apr', revenue: 61000, orders: 334 },
  { month: 'May', revenue: 58000, orders: 312 },
  { month: 'Jun', revenue: 72000, orders: 401 },
];

const userDistribution = [
  { name: 'Suppliers', value: 145, color: '#8b5cf6' },
  { name: 'Vendors', value: 423, color: '#06b6d4' },
  { name: 'Customers', value: 2891, color: '#10b981' },
];

const topPerformers = [
  { name: 'Digital Marketplace', type: 'Vendor', revenue: 145200, growth: 23.5 },
  { name: 'TechSupply Co.', type: 'Supplier', revenue: 132400, growth: 18.2 },
  { name: 'Global Traders', type: 'Vendor', revenue: 98700, growth: 15.8 },
  { name: 'Prime Electronics', type: 'Supplier', revenue: 87300, growth: 12.3 },
];

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('6m');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$336K',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Active Users',
      value: '3,459',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Orders',
      value: '1,837',
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Products Listed',
      value: '12,458',
      change: '+6.7%',
      trend: 'up',
      icon: Package,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-8 p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Enhanced Header with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
          Platform Overview
        </h1>
        <p className="text-muted-foreground">Real-time analytics and system performance</p>
      </motion.div>

      {/* Enhanced Stats Grid with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Card className="relative p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div 
                    className="p-4 rounded-2xl bg-indigo-600 shadow-lg"
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <motion.div 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      stat.trend === 'up' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  >
                    {stat.trend === 'up' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                    {stat.change}
                  </motion.div>
                </div>
                <h3 className="text-sm text-muted-foreground mb-2 font-semibold uppercase tracking-wide">{stat.title}</h3>
                <motion.p 
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {stat.value}
                </motion.p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Charts with Glassmorphism */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Revenue Trend
                </h3>
                <p className="text-sm text-muted-foreground font-medium">Monthly revenue performance</p>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-slate-800/50 text-sm font-medium hover:border-purple-400 dark:hover:border-purple-600 transition-colors backdrop-blur-sm"
              >
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="12m">12 Months</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 600 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px',
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#revenueGradient)"
                  strokeWidth={4}
                  fill="url(#revenueGradient)"
                  dot={{ fill: '#8b5cf6', r: 6, strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-cyan-600" />
              <h3 className="text-xl font-bold">User Distribution</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 font-medium">Platform user breakdown</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px',
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '14px', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-white/50 dark:border-slate-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold">Top Performers</h3>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Highest revenue generators this month</p>
            </div>
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <motion.div
                key={performer.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.02, x: 8 }}
                className="relative flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 overflow-hidden group cursor-pointer"
              >
                {/* Rank badge with gradient */}
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold shadow-sm">
                    <span className="relative z-10 text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base mb-1">{performer.name}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{performer.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl mb-1">${(performer.revenue / 1000).toFixed(1)}K</p>
                  <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    +{performer.growth}%
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Enhanced System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Activity,
            title: 'System Status',
            value: 'Operational',
            subtitle: 'All systems running smoothly',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          },
          {
            icon: TrendingUp,
            title: 'API Uptime',
            value: '99.9%',
            subtitle: 'Last 30 days',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
          },
          {
            icon: AlertCircle,
            title: 'Active Alerts',
            value: '2',
            subtitle: 'Requires attention',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
          },
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1 + idx * 0.1, type: "spring" }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className={`p-6 bg-gradient-to-br ${item.bgColor} border-2 border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-bold text-base">{item.title}</h3>
              </div>
              <p className="text-3xl font-bold mb-2">{item.value}</p>
              <p className="text-sm text-muted-foreground font-medium">{item.subtitle}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}