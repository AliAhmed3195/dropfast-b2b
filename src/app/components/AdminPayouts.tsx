'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign,
  Search,
  Filter,
  Building2,
  User,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  X,
  CreditCard,
  ArrowRight,
  Download,
  Eye,
  Send,
  AlertCircle,
  Wallet,
  Receipt,
  History,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// Mock pending payouts data
const mockPendingPayouts = [
  {
    id: '1',
    recipientName: 'Tech Supply Co.',
    recipientType: 'supplier',
    email: 'finance@techsupply.com',
    phone: '+1 (555) 123-4567',
    accountNumber: '****1234',
    dueAmount: 15750.50,
    ordersCount: 23,
    lastPayout: '2024-11-15',
    status: 'pending',
  },
  {
    id: '2',
    recipientName: 'Global Electronics',
    recipientType: 'supplier',
    email: 'payments@globalelec.com',
    phone: '+1 (555) 234-5678',
    accountNumber: '****5678',
    dueAmount: 28900.75,
    ordersCount: 45,
    lastPayout: '2024-11-20',
    status: 'pending',
  },
  {
    id: '3',
    recipientName: 'Tech Haven Store',
    recipientType: 'vendor',
    email: 'owner@techhaven.com',
    phone: '+1 (555) 345-6789',
    accountNumber: '****9012',
    dueAmount: 12340.25,
    ordersCount: 18,
    lastPayout: '2024-11-18',
    status: 'pending',
  },
  {
    id: '4',
    recipientName: 'Smart Gadgets Hub',
    recipientType: 'vendor',
    email: 'finance@smartgadgets.com',
    phone: '+1 (555) 456-7890',
    accountNumber: '****3456',
    dueAmount: 8560.00,
    ordersCount: 12,
    lastPayout: '2024-11-22',
    status: 'pending',
  },
];

// Mock transaction history
const mockTransactions = [
  {
    id: 'TXN-001',
    recipientName: 'Tech Supply Co.',
    recipientType: 'supplier',
    amount: 18500.00,
    status: 'completed',
    date: '2024-11-15',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'REF-2024-1115-001',
  },
  {
    id: 'TXN-002',
    recipientName: 'Global Electronics',
    recipientType: 'supplier',
    amount: 32000.00,
    status: 'completed',
    date: '2024-11-20',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'REF-2024-1120-002',
  },
  {
    id: 'TXN-003',
    recipientName: 'Tech Haven Store',
    recipientType: 'vendor',
    amount: 15600.00,
    status: 'completed',
    date: '2024-11-18',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'REF-2024-1118-003',
  },
  {
    id: 'TXN-004',
    recipientName: 'Smart Gadgets Hub',
    recipientType: 'vendor',
    amount: 9800.00,
    status: 'processing',
    date: '2024-12-22',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'REF-2024-1222-004',
  },
];

export function AdminPayouts() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const fetchingPayoutsRef = useRef(false);

  const fetchPayouts = async () => {
    if (fetchingPayoutsRef.current) return;
    fetchingPayoutsRef.current = true;
    
    try {
      setLoading(true);
      const status = activeTab === 'pending' ? 'pending' : activeTab === 'completed' ? 'completed' : '';
      const url = status ? `/api/admin/payouts?status=${status}` : '/api/admin/payouts';
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setPayouts(data.payouts || []);
      } else {
        toast.error(data.error || 'Failed to fetch payouts');
      }
    } catch (error) {
      console.error('Fetch payouts error:', error);
      toast.error('Failed to fetch payouts');
    } finally {
      setLoading(false);
      fetchingPayoutsRef.current = false;
    }
  };

  useEffect(() => {
    if (fetchingPayoutsRef.current) return;
    fetchPayouts();
  }, [typeFilter, activeTab]);

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch =
      payout.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || payout.recipientType === typeFilter;
    return matchesSearch && matchesType;
  });

  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const completedPayouts = payouts.filter(p => p.status === 'completed');

  const stats = {
    totalPending: pendingPayouts.reduce((sum, p) => sum + (p.dueAmount || p.amount || 0), 0),
    totalCompleted: completedPayouts.reduce((sum, p) => sum + (p.amount || 0), 0),
    pendingCount: pendingPayouts.length,
    completedCount: completedPayouts.length,
  };

  const handleProcessPayout = (payout: any) => {
    setSelectedPayout(payout);
    setShowPayoutModal(true);
  };

  const handleUpdatePayoutStatus = async (payoutId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/payouts/${payoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchPayouts();
        toast.success(`Payout status updated to ${status}`);
        setShowPayoutModal(false);
        setSelectedPayout(null);
      } else {
        toast.error(data.error || 'Failed to update payout status');
      }
    } catch (error) {
      console.error('Update payout error:', error);
      toast.error('Failed to update payout status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Payout Management</h2>
          <p className="text-muted-foreground">
            Manage and process payouts to suppliers and vendors
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Payouts</p>
              <p className="text-2xl font-bold">${stats.totalPending.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">${stats.totalCompleted.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Count</p>
              <p className="text-2xl font-bold">{stats.pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">{stats.completedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending Payouts
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            Transaction History
          </TabsTrigger>
        </TabsList>

        {/* Pending Payouts Tab */}
        <TabsContent value="pending" className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="supplier">Suppliers</SelectItem>
                  <SelectItem value="vendor">Vendors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Pending Payouts Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Recipient</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Account</TableHead>
                  <TableHead className="font-semibold">Due Amount</TableHead>
                  <TableHead className="font-semibold">Orders</TableHead>
                  <TableHead className="font-semibold">Last Payout</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
                      <p className="text-muted-foreground">Loading payouts...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Wallet className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-muted-foreground">No pending payouts found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredPayouts.map((payout, index) => (
                      <motion.tr
                        key={payout.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback
                                className={cn(
                                  'text-white',
                                  payout.recipientType === 'supplier'
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                                    : 'bg-gradient-to-br from-cyan-500 to-purple-500'
                                )}
                              >
                                {payout.recipientName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{payout.recipientName}</p>
                              <p className="text-xs text-muted-foreground">{payout.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              payout.recipientType === 'supplier'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400'
                            )}
                          >
                            {payout.recipientType === 'supplier' ? (
                              <Building2 className="w-3 h-3 mr-1" />
                            ) : (
                              <User className="w-3 h-3 mr-1" />
                            )}
                            {payout.recipientType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payout.phone}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{payout.accountNumber}</TableCell>
                        <TableCell>
                          <span className="text-lg font-bold text-purple-600">
                            ${(payout.dueAmount || payout.amount || 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payout.ordersCount || 0} orders</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payout.lastPayout ? new Date(payout.lastPayout).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleProcessPayout(payout)}
                            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Process
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Transaction ID</TableHead>
                  <TableHead className="font-semibold">Recipient</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Payment Method</TableHead>
                  <TableHead className="font-semibold">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
                      <p className="text-muted-foreground">Loading transactions...</p>
                    </TableCell>
                  </TableRow>
                ) : completedPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <History className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-muted-foreground">No transactions found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  completedPayouts.map((txn, index) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                          <Receipt className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-mono font-semibold text-sm">{txn.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={cn(
                              'text-white text-xs',
                              txn.recipientType === 'supplier'
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                                : 'bg-gradient-to-br from-cyan-500 to-purple-500'
                            )}
                          >
                            {txn.recipientName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{txn.recipientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {txn.recipientType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-purple-600">
                        ${(txn.amount || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          txn.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : txn.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        )}
                      >
                        {txn.status === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {txn.processedAt ? new Date(txn.processedAt).toLocaleDateString() : new Date(txn.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        {txn.method || 'Bank Transfer'}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {txn.id || 'N/A'}
                    </TableCell>
                  </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Process Payout Modal */}
      <AnimatePresence>
        {showPayoutModal && selectedPayout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowPayoutModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
            >
              <PayoutForm
                payout={selectedPayout}
                onCancel={() => {
                  setShowPayoutModal(false);
                  setSelectedPayout(null);
                }}
                onSuccess={async () => {
                  setShowPayoutModal(false);
                  setSelectedPayout(null);
                  await fetchPayouts();
                  toast.success('Payout processed successfully!');
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PayoutFormProps {
  payout: any;
  onCancel: () => void;
  onSuccess: () => void;
}

function PayoutForm({ payout, onCancel, onSuccess }: PayoutFormProps) {
  const [formData, setFormData] = useState({
    amount: payout.dueAmount,
    paymentMethod: 'bank_transfer',
    referenceNumber: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (formData.amount > payout.dueAmount)
      newErrors.amount = 'Amount cannot exceed due amount';
    if (!formData.referenceNumber.trim())
      newErrors.referenceNumber = 'Reference number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/payouts/${payout.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          processedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setErrors({ submit: data.error || 'Failed to process payout' });
      }
    } catch (error) {
      console.error('Process payout error:', error);
      setErrors({ submit: 'Failed to process payout' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full overflow-y-auto max-h-[90vh]">
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-6 flex items-center justify-between z-10">
        <div>
          <h2 className="text-2xl font-bold">Process Payout</h2>
          <p className="text-sm text-muted-foreground">Send payment to {payout.recipientName}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Recipient Info */}
        <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-3 block">Recipient Details</Label>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback
                className={cn(
                  'text-white text-xl font-bold',
                  payout.recipientType === 'supplier'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                    : 'bg-gradient-to-br from-cyan-500 to-purple-500'
                )}
              >
                {payout.recipientName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{payout.recipientName}</h3>
              <Badge
                variant="outline"
                className={cn(
                  payout.recipientType === 'supplier'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400'
                )}
              >
                {payout.recipientType === 'supplier' ? (
                  <Building2 className="w-3 h-3 mr-1" />
                ) : (
                  <User className="w-3 h-3 mr-1" />
                )}
                {payout.recipientType.charAt(0).toUpperCase() + payout.recipientType.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
              <Label className="text-xs text-muted-foreground mb-1 block">Email Address</Label>
              <p className="font-semibold text-sm">{payout.email}</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
              <Label className="text-xs text-muted-foreground mb-1 block">Phone Number</Label>
              <p className="font-semibold text-sm">{payout.phone}</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
              <Label className="text-xs text-muted-foreground mb-1 block">Account Number</Label>
              <p className="font-mono font-bold text-sm">{payout.accountNumber}</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
              <Label className="text-xs text-muted-foreground mb-1 block">Orders Completed</Label>
              <p className="font-bold text-sm">{payout.ordersCount} orders</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Total Due Amount</Label>
              <span className="text-2xl font-bold text-purple-600">${payout.dueAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="font-semibold flex items-center gap-2 text-base">
            <DollarSign className="w-5 h-5 text-purple-500" />
            Payout Amount <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={e => handleInputChange('amount', parseFloat(e.target.value))}
              className={cn(
                'h-14 pl-12 text-xl font-bold',
                errors.amount && 'border-red-500 focus:ring-red-500'
              )}
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Maximum: ${payout.dueAmount.toLocaleString()}</p>
            {errors.amount && (
              <p className="text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-4 h-4" />
                {errors.amount}
              </p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod" className="font-semibold flex items-center gap-2 text-base">
            <CreditCard className="w-5 h-5 text-purple-500" />
            Payment Method <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={value => handleInputChange('paymentMethod', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank_transfer">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Bank Transfer
                </div>
              </SelectItem>
              <SelectItem value="wire_transfer">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Wire Transfer
                </div>
              </SelectItem>
              <SelectItem value="paypal">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  PayPal
                </div>
              </SelectItem>
              <SelectItem value="stripe">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Stripe
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reference Number */}
        <div className="space-y-2">
          <Label htmlFor="referenceNumber" className="font-semibold flex items-center gap-2 text-base">
            <Receipt className="w-5 h-5 text-purple-500" />
            Reference/Transaction Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="referenceNumber"
            value={formData.referenceNumber}
            onChange={e => handleInputChange('referenceNumber', e.target.value)}
            className={cn(
              'h-12 font-mono',
              errors.referenceNumber && 'border-red-500 focus:ring-red-500'
            )}
            placeholder="e.g., REF-2024-1225-001"
          />
          {errors.referenceNumber && (
            <p className="text-sm text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-4 h-4" />
              {errors.referenceNumber}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="font-semibold text-base">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={e => handleInputChange('notes', e.target.value)}
            className="min-h-[120px] resize-none"
            placeholder="Add any additional notes or instructions for this payout..."
          />
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl p-5 space-y-3 border-2 border-purple-200 dark:border-purple-800">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide block">Payment Summary</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payout Amount</span>
              <span className="font-bold text-lg">${formData.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <span className="font-semibold capitalize">
                {formData.paymentMethod.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recipient</span>
              <span className="font-semibold">{payout.recipientName}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t-2 border-purple-200 dark:border-purple-700">
              <span className="font-bold text-lg">Total Payout</span>
              <span className="text-3xl font-bold text-purple-600">
                ${formData.amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="flex-1 h-12"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-bold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg shadow-purple-500/30"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Processing Payment...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Process Payout
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}