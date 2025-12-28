'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../../lib/toast';

export function SupplierDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const fetchingRef = useRef(false);

  // Fetch dashboard data
  useEffect(() => {
    if (!user?.id || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    const fetchDashboard = async () => {
      try {
        const response = await fetch(`/api/supplier/dashboard?supplierId=${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setDashboardData(data);
        } else {
          showToast.error(data.error || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Fetch dashboard error:', error);
        showToast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchDashboard();
  }, [user?.id]);

  const stats = dashboardData?.stats ? [
    {
      title: 'Total Products',
      value: dashboardData.stats.totalProducts?.toString() || '0',
      change: '',
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Orders',
      value: dashboardData.stats.totalOrders?.toString() || '0',
      change: '',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Low Stock Items',
      value: dashboardData.stats.lowStockProducts?.toString() || '0',
      change: dashboardData.stats.lowStockProducts > 0 ? 'Urgent' : '',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Pending Orders',
      value: dashboardData.stats.pendingOrders?.toString() || '0',
      change: '',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'out-of-stock':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const products = dashboardData?.products || [];
  const performanceData = dashboardData?.revenueTrend || [];

  const filteredProducts = products.filter((product: any) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Supplier Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory efficiently
          </p>
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm">
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Stats Grid */}
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
                  {stat.change && (
                    <motion.span 
                      className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {stat.change}
                    </motion.span>
                  )}
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

      {/* Enhanced Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold">Performance Overview</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-8 font-medium">Orders and revenue trends</p>
          {performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
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
                <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <p>No revenue data available</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Enhanced Product Management */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-2 border-white/50 dark:border-slate-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-5 h-5 text-cyan-600" />
                <h3 className="text-xl font-bold">Product Catalog</h3>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Manage your inventory</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 w-72 h-11 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all rounded-xl"
                />
              </div>
              <Button 
                variant="outline" 
                className="h-11 px-5 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all rounded-xl font-medium"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border-2 border-slate-200 dark:border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
                  <th className="text-left py-4 px-6 font-bold text-sm">Product</th>
                  <th className="text-left py-4 px-6 font-bold text-sm">SKU</th>
                  <th className="text-left py-4 px-6 font-bold text-sm">Category</th>
                  <th className="text-left py-4 px-6 font-bold text-sm">Stock</th>
                  <th className="text-left py-4 px-6 font-bold text-sm">Price</th>
                  <th className="text-left py-4 px-6 font-bold text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-bold text-sm">Orders</th>
                  <th className="text-right py-4 px-6 font-bold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, type: "spring" }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200"
                  >
                    <td className="py-5 px-6">
                      <div className="font-semibold">{product.name}</div>
                    </td>
                    <td className="py-5 px-6 text-sm text-muted-foreground font-medium">
                      {product.sku}
                    </td>
                    <td className="py-5 px-6 text-sm font-medium">{product.category}</td>
                    <td className="py-5 px-6">
                      <span className={`font-bold text-sm px-3 py-1 rounded-full ${
                        product.stock === 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        product.stock < 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-5 px-6 font-bold text-base">${product.price}</td>
                    <td className="py-5 px-6">
                      <Badge className={`${getStatusColor(product.status)} font-semibold capitalize`}>
                        {product.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="py-5 px-6 text-sm font-semibold">{product.orders}</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="w-48 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-white/20 dark:border-slate-700/50 shadow-2xl rounded-xl"
                          >
                            <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium">
                              <Eye className="w-4 h-4 mr-3 text-blue-600" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/20 font-medium">
                              <Edit className="w-4 h-4 mr-3 text-cyan-600" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
                              <Trash2 className="w-4 h-4 mr-3" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              </motion.div>
              <p className="text-lg text-muted-foreground font-medium">No products found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search query</p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}