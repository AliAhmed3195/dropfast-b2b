'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Zap, TrendingUp, ShoppingBag, Package, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser && loggedInUser.role) {
        // Role-based redirect
        if (loggedInUser.role === 'customer') {
          router.push('/dashboard/customer/browse');
        } else {
          router.push(`/dashboard/${loggedInUser.role}/overview`);
        }
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: string) => {
    const credentials = {
      admin: { email: 'admin@fastdrop.com', password: 'admin123' },
      supplier: { email: 'supplier@fastdrop.com', password: 'supplier123' },
      vendor: { email: 'vendor@fastdrop.com', password: 'vendor123' },
      customer: { email: 'customer@fastdrop.com', password: 'customer123' },
    };

    const cred = credentials[role as keyof typeof credentials];
    setEmail(cred.email);
    setPassword(cred.password);
    setIsLoading(true);

    try {
      const loggedInUser = await login(cred.email, cred.password);
      if (loggedInUser && loggedInUser.role) {
        // Role-based redirect
        if (loggedInUser.role === 'customer') {
          router.push('/dashboard/customer/browse');
        } else {
          router.push(`/dashboard/${loggedInUser.role}/overview`);
        }
      } else {
        setError('Login failed');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Clean minimal background with subtle pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Subtle accent circles - static, not animated */}
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-indigo-500/5 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] bg-cyan-500/5 rounded-full filter blur-3xl" />
      </div>

      {/* Left side - Enhanced Branding */}
      <div className="hidden lg:flex lg:flex-1 relative items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-lg z-10"
        >
          <motion.div 
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">FastDrop</h1>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Enterprise Platform</span>
              </div>
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Enterprise Dropshipping
            <span className="block mt-3 text-indigo-600 dark:text-indigo-400">
              Powered by AI
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Connect suppliers, vendors, and customers in one intelligent platform.
            Scale your B2B commerce with cutting-edge technology.
          </motion.p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Package, label: 'Smart Inventory', color: 'bg-purple-600' },
              { icon: TrendingUp, label: 'Real-time Analytics', color: 'bg-cyan-600' },
              { icon: ShoppingBag, label: 'Multi-vendor', color: 'bg-indigo-600' },
              { icon: Zap, label: 'AI Insights', color: 'bg-pink-600' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.5 + idx * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="group relative overflow-hidden flex items-center gap-3 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${feature.color} shadow-sm`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Enhanced Login Form with Glassmorphism */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <motion.div 
            className="relative bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 dark:border-slate-700/50 overflow-hidden"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full filter blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full filter blur-3xl -z-10" />
            
            {/* Mobile logo */}
            <motion.div 
              className="lg:hidden flex items-center justify-center gap-3 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">FastDrop</h1>
                <span className="text-xs text-muted-foreground">Enterprise Platform</span>
              </div>
            </motion.div>

            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                Welcome Back
              </h3>
              <p className="text-muted-foreground">Sign in to your account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-14 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base rounded-xl shadow-sm transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/90 dark:bg-slate-900/80 text-muted-foreground font-medium">
                    Quick access for demo
                  </span>
                </div>
              </div>

              <motion.div 
                className="mt-6 grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {[
                  { role: 'admin', label: 'Admin', color: 'bg-purple-600 hover:bg-purple-700' },
                  { role: 'supplier', label: 'Supplier', color: 'bg-blue-600 hover:bg-blue-700' },
                  { role: 'vendor', label: 'Vendor', color: 'bg-cyan-600 hover:bg-cyan-700' },
                  { role: 'customer', label: 'Customer', color: 'bg-green-600 hover:bg-green-700' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.role}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      onClick={() => quickLogin(item.role)}
                      disabled={isLoading}
                      className={`w-full h-11 text-sm font-semibold ${item.color} text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.p 
              className="mt-8 text-center text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Demo accounts are pre-filled for testing purposes
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}