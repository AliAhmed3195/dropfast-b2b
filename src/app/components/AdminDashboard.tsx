'use client'

import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

// Mock data removed - using only API data with empty states

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('6m');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount and when timeRange changes - using cleanup to prevent duplicate calls
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/dashboard?timeRange=${timeRange}`);
        const data = await response.json();
        
        if (!isMounted) return; // Don't update state if component unmounted

        if (response.ok && data.success) {
          setAnalyticsData(data.data);
        } else {
          toast.error(data.error || 'Failed to fetch dashboard data');
          setAnalyticsData(null); // Set to null on error to show empty states
        }
      } catch (error) {
        if (!isMounted) return; // Don't update state if component unmounted
        console.error('Fetch dashboard error:', error);
        toast.error('Failed to fetch dashboard data');
        setAnalyticsData(null); // Set to null on error to show empty states
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  // Format revenue for display
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Calculate stats from API data
  const stats = analyticsData?.stats ? [
    {
      title: 'Total Revenue',
      value: formatRevenue(analyticsData.stats.totalRevenue || 0),
      change: `+${analyticsData.stats.revenueChange || 0}%`,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Active Users',
      value: formatNumber(analyticsData.stats.totalUsers || 0),
      change: `+${analyticsData.stats.usersChange || 0}%`,
      trend: 'up' as const,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Orders',
      value: formatNumber(analyticsData.stats.totalOrders || 0),
      change: `+${analyticsData.stats.ordersChange || 0}%`,
      trend: 'up' as const,
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Products Listed',
      value: formatNumber(analyticsData.stats.totalProducts || 0),
      change: `+${analyticsData.stats.productsChange || 0}%`,
      trend: 'up' as const,
      icon: Package,
      color: 'from-orange-500 to-red-500',
    },
  ] : [
    {
      title: 'Total Revenue',
      value: '$0',
      change: '0%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Active Users',
      value: '0',
      change: '0%',
      trend: 'up' as const,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Orders',
      value: '0',
      change: '0%',
      trend: 'up' as const,
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Products Listed',
      value: '0',
      change: '0%',
      trend: 'up' as const,
      icon: Package,
      color: 'from-orange-500 to-red-500',
    },
  ];

  // Use API data only - no mock data fallback, show empty states instead
  const revenueTrendData = analyticsData?.revenueTrend || [];
  const userDistributionData = analyticsData?.userDistribution || [];
  const topPerformersData = analyticsData?.topPerformers || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
              {revenueTrendData.length > 0 ? (
                <LineChart data={revenueTrendData}>
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground font-medium">No revenue data available</p>
                    <p className="text-sm text-muted-foreground mt-2">Revenue trends will appear here once orders are placed</p>
                  </div>
                </div>
              )}
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
              {userDistributionData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground font-medium">No user distribution data available</p>
                    <p className="text-sm text-muted-foreground mt-2">User data will appear here once users are registered</p>
                  </div>
                </div>
              )}
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
            {topPerformersData.length > 0 ? (
              topPerformersData.map((performer, index) => (
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
              ))
            ) : (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium">No top performers data available</p>
                <p className="text-sm text-muted-foreground mt-2">Revenue data will appear here once orders are placed</p>
              </div>
            )}
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