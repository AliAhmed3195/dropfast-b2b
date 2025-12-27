'use client'

import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Package,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function AdminReports() {
  const reports = [
    {
      title: 'Monthly Sales Report',
      description: 'Comprehensive sales analysis for the current month',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      date: 'December 2024',
    },
    {
      title: 'User Activity Report',
      description: 'User engagement and activity metrics',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      date: 'December 2024',
    },
    {
      title: 'Product Performance',
      description: 'Top performing products and categories',
      icon: Package,
      color: 'from-purple-500 to-pink-500',
      date: 'December 2024',
    },
    {
      title: 'Financial Summary',
      description: 'Revenue, expenses, and profit analysis',
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      date: 'Q4 2024',
    },
    {
      title: 'Vendor Performance',
      description: 'Vendor sales and commission breakdown',
      icon: FileText,
      color: 'from-indigo-500 to-purple-500',
      date: 'December 2024',
    },
    {
      title: 'Customer Insights',
      description: 'Customer behavior and purchasing patterns',
      icon: Users,
      color: 'from-pink-500 to-red-500',
      date: 'December 2024',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate and download detailed reports</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold">
          <FileText className="w-4 h-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Downloaded</p>
              <p className="text-2xl font-bold">1.2K</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${report.color}`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{report.date}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-semibold"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Scheduled Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'Weekly Sales Summary', frequency: 'Every Monday at 9:00 AM', active: true },
            { name: 'Monthly Performance', frequency: 'First day of month at 8:00 AM', active: true },
            { name: 'Quarterly Review', frequency: 'Every 3 months', active: true },
            { name: 'Annual Report', frequency: 'January 1st at 12:00 PM', active: false },
          ].map((scheduled, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-muted"
            >
              <div>
                <p className="font-semibold">{scheduled.name}</p>
                <p className="text-sm text-muted-foreground">{scheduled.frequency}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium ${
                    scheduled.active ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {scheduled.active ? 'Active' : 'Inactive'}
                </span>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
