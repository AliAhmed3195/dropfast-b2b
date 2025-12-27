'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  FileType,
  AlertCircle,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// Mock recent reports data
const recentReports = [
  {
    id: 'RPT-001',
    type: 'Sales Report',
    dateRange: 'Dec 1-24, 2024',
    format: 'PDF',
    generatedAt: '2024-12-24 10:30 AM',
    status: 'completed',
    fileSize: '2.4 MB',
  },
  {
    id: 'RPT-002',
    type: 'Order Report',
    dateRange: 'Dec 1-24, 2024',
    format: 'Excel',
    generatedAt: '2024-12-23 03:15 PM',
    status: 'completed',
    fileSize: '1.8 MB',
  },
  {
    id: 'RPT-003',
    type: 'Payout Report',
    dateRange: 'Nov 1-30, 2024',
    format: 'PDF',
    generatedAt: '2024-12-22 09:45 AM',
    status: 'completed',
    fileSize: '3.1 MB',
  },
  {
    id: 'RPT-004',
    type: 'Inventory Report',
    dateRange: 'Dec 1-24, 2024',
    format: 'CSV',
    generatedAt: '2024-12-21 02:20 PM',
    status: 'completed',
    fileSize: '0.9 MB',
  },
  {
    id: 'RPT-005',
    type: 'User Report',
    dateRange: 'Dec 1-24, 2024',
    format: 'Excel',
    generatedAt: '2024-12-20 11:10 AM',
    status: 'completed',
    fileSize: '1.2 MB',
  },
];

export function Reports() {
  const [reportType, setReportType] = useState('sales');
  const [format, setFormat] = useState('pdf');
  const [dateFrom, setDateFrom] = useState('2024-12-01');
  const [dateTo, setDateTo] = useState('2024-12-24');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast.success('Report generated successfully!', {
      description: 'Your report is ready to download.',
    });
  };

  const handleDownload = (reportId: string) => {
    toast.success(`Downloading ${reportId}...`);
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
      case 'csv':
        return <FileType className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Reports</h2>
          <p className="text-muted-foreground">
            Generate and download detailed reports for your business
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Generate Report</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom reports with your preferred parameters
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Report Type */}
              <div className="space-y-2">
                <Label htmlFor="reportType" className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4 text-purple-500" />
                  Report Type <span className="text-red-500">*</span>
                </Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="orders">Order Report</SelectItem>
                    <SelectItem value="payouts">Payout Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="users">User Report</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the type of report you want to generate
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom" className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    From Date <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo" className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    To Date <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  Export Format <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setFormat('pdf')}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2',
                      format === 'pdf'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    )}
                  >
                    <FileText className={cn(
                      'w-6 h-6',
                      format === 'pdf' ? 'text-purple-500' : 'text-red-500'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      format === 'pdf' && 'text-purple-600 dark:text-purple-400'
                    )}>
                      PDF
                    </span>
                  </button>

                  <button
                    onClick={() => setFormat('excel')}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2',
                      format === 'excel'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    )}
                  >
                    <FileSpreadsheet className={cn(
                      'w-6 h-6',
                      format === 'excel' ? 'text-purple-500' : 'text-green-500'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      format === 'excel' && 'text-purple-600 dark:text-purple-400'
                    )}>
                      Excel
                    </span>
                  </button>

                  <button
                    onClick={() => setFormat('csv')}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2',
                      format === 'csv'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    )}
                  >
                    <FileType className={cn(
                      'w-6 h-6',
                      format === 'csv' ? 'text-purple-500' : 'text-blue-500'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      format === 'csv' && 'text-purple-600 dark:text-purple-400'
                    )}>
                      CSV
                    </span>
                  </button>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-2">Report Summary</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">Type:</span>{' '}
                        {reportType === 'sales' && 'Sales Report'}
                        {reportType === 'orders' && 'Order Report'}
                        {reportType === 'payouts' && 'Payout Report'}
                        {reportType === 'inventory' && 'Inventory Report'}
                        {reportType === 'users' && 'User Report'}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Date Range:</span>{' '}
                        {dateFrom} to {dateTo}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Format:</span>{' '}
                        {format.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg shadow-purple-500/30"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Generate & Download Report
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Report Statistics</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Reports</span>
                <span className="text-2xl font-bold">{recentReports.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-2xl font-bold text-green-600">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Size</span>
                <span className="text-lg font-semibold">9.4 MB</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Report Formats</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    PDF for formal documents
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Excel for data analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    CSV for raw data export
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Recent Reports
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your previously generated reports (Last 10)
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Report ID</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Date Range</TableHead>
              <TableHead className="font-semibold">Format</TableHead>
              <TableHead className="font-semibold">Generated At</TableHead>
              <TableHead className="font-semibold">Size</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReports.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFormatIcon(report.format)}
                    <span className="font-mono font-semibold text-sm">{report.id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{report.type}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {report.dateRange}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {report.format}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {report.generatedAt}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {report.fileSize}
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
