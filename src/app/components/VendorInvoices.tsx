import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Mail,
  MailOpen,
  Calendar,
  Store,
  User,
  DollarSign,
  X,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
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

// Mock invoices data
const invoices = [
  {
    id: 'INV-2024-001',
    orderNumber: 'ORD-5678',
    customer: {
      name: 'John Doe',
      email: 'john.doe@email.com',
    },
    store: 'TechGear Store',
    date: '2024-12-20',
    dueDate: '2025-01-19',
    amount: 403.77,
    status: 'paid',
    emailStatus: 'sent',
    sentDate: '2024-12-20',
    template: 'Modern Professional',
    items: [
      { name: 'Wireless Bluetooth Headphones', qty: 2, price: 79.99 },
      { name: 'Smart Watch Pro', qty: 1, price: 199.99 },
    ],
  },
  {
    id: 'INV-2024-002',
    orderNumber: 'ORD-5679',
    customer: {
      name: 'Sarah Smith',
      email: 'sarah.smith@email.com',
    },
    store: 'Fashion Hub',
    date: '2024-12-21',
    dueDate: '2025-01-20',
    amount: 289.50,
    status: 'pending',
    emailStatus: 'sent',
    sentDate: '2024-12-21',
    template: 'Classic Business',
    items: [
      { name: 'Designer Handbag', qty: 1, price: 189.99 },
      { name: 'Leather Wallet', qty: 2, price: 49.99 },
    ],
  },
  {
    id: 'INV-2024-003',
    orderNumber: 'ORD-5680',
    customer: {
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
    },
    store: 'Home Essentials',
    date: '2024-12-22',
    dueDate: '2025-01-21',
    amount: 567.99,
    status: 'overdue',
    emailStatus: 'sent',
    sentDate: '2024-12-22',
    template: 'Minimalist Clean',
    items: [
      { name: 'Coffee Maker Deluxe', qty: 1, price: 299.99 },
      { name: 'Premium Cookware Set', qty: 1, price: 267.99 },
    ],
  },
  {
    id: 'INV-2024-004',
    orderNumber: 'ORD-5681',
    customer: {
      name: 'Emily Brown',
      email: 'emily.b@email.com',
    },
    store: 'TechGear Store',
    date: '2024-12-23',
    dueDate: '2025-01-22',
    amount: 149.99,
    status: 'pending',
    emailStatus: 'not_sent',
    sentDate: null,
    template: 'Modern Professional',
    items: [
      { name: 'USB-C Fast Charger', qty: 3, price: 29.99 },
      { name: 'Phone Case Premium', qty: 2, price: 19.99 },
    ],
  },
  {
    id: 'INV-2024-005',
    orderNumber: 'ORD-5682',
    customer: {
      name: 'David Wilson',
      email: 'david.w@email.com',
    },
    store: 'Fashion Hub',
    date: '2024-12-24',
    dueDate: '2025-01-23',
    amount: 799.99,
    status: 'paid',
    emailStatus: 'sent',
    sentDate: '2024-12-24',
    template: 'Classic Business',
    items: [
      { name: 'Designer Watch', qty: 1, price: 599.99 },
      { name: 'Sunglasses Premium', qty: 1, price: 199.99 },
    ],
  },
];

export function VendorInvoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStore, setFilterStore] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleSendEmail = (invoice: any) => {
    toast.success('Invoice Sent!', {
      description: `Invoice ${invoice.id} sent to ${invoice.customer.email}`,
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStore = filterStore === 'all' || invoice.store === filterStore;
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStore && matchesStatus;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Invoices</h2>
          <p className="text-muted-foreground">
            Manage and track all your store invoices
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2">
          <FileText className="w-4 h-4 mr-2" />
          {invoices.length} Total Invoices
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold">{stats.paid}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold">{stats.overdue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by invoice ID, customer, or order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStore} onValueChange={setFilterStore}>
            <SelectTrigger className="w-full md:w-64">
              <Store className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Stores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="TechGear Store">TechGear Store</SelectItem>
              <SelectItem value="Fashion Hub">Fashion Hub</SelectItem>
              <SelectItem value="Home Essentials">Home Essentials</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-64">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="font-mono font-semibold">{invoice.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{invoice.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Store className="w-3 h-3" />
                      {invoice.store}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{invoice.date}</TableCell>
                  <TableCell className="text-sm">{invoice.dueDate}</TableCell>
                  <TableCell className="font-bold text-green-600">${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={cn('gap-1', getStatusColor(invoice.status))}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invoice.emailStatus === 'sent' ? (
                      <div className="flex items-center gap-2">
                        <MailOpen className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs font-semibold text-green-600">Sent</p>
                          <p className="text-xs text-muted-foreground">{invoice.sentDate}</p>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        <Mail className="w-3 h-3 mr-1" />
                        Not Sent
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSendEmail(invoice)}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">No invoices found</p>
          </div>
        )}
      </Card>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {previewOpen && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Invoice Details</h3>
                    <p className="text-purple-100">Using template: {selectedInvoice.template}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Invoice Content */}
              <div className="p-8">
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                  {/* Invoice Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
                        <p className="text-white/90">Invoice #: {selectedInvoice.id}</p>
                        <p className="text-white/90">Order #: {selectedInvoice.orderNumber}</p>
                        <p className="text-white/90">Date: {selectedInvoice.date}</p>
                        <p className="text-white/90">Due Date: {selectedInvoice.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <h2 className="text-2xl font-bold mb-2">{selectedInvoice.store}</h2>
                        <p className="text-white/90">123 Business Street</p>
                        <p className="text-white/90">City, State 12345</p>
                        <p className="text-white/90">support@store.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Body */}
                  <div className="p-8 space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-purple-600 mb-2">BILL TO:</h3>
                        <p className="font-semibold">{selectedInvoice.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedInvoice.customer.email}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-purple-600 mb-2">STATUS:</h3>
                        <Badge className={cn('gap-1', getStatusColor(selectedInvoice.status))}>
                          {getStatusIcon(selectedInvoice.status)}
                          {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-purple-200">
                            <th className="text-left py-3 font-bold text-purple-600">ITEM</th>
                            <th className="text-center py-3 font-bold text-purple-600">QTY</th>
                            <th className="text-right py-3 font-bold text-purple-600">PRICE</th>
                            <th className="text-right py-3 font-bold text-purple-600">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-slate-200 dark:border-slate-700">
                              <td className="py-4">
                                <p className="font-semibold">{item.name}</p>
                              </td>
                              <td className="text-center">{item.qty}</td>
                              <td className="text-right">${item.price.toFixed(2)}</td>
                              <td className="text-right font-semibold">${(item.qty * item.price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                      <div className="w-80 space-y-2">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-semibold">${(selectedInvoice.amount / 1.08).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Tax (8%):</span>
                          <span className="font-semibold">${(selectedInvoice.amount * 0.08 / 1.08).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-4 text-xl font-bold border-t-2 border-purple-200">
                          <span>TOTAL:</span>
                          <span className="text-purple-600">${selectedInvoice.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Email Status */}
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3">
                        {selectedInvoice.emailStatus === 'sent' ? (
                          <>
                            <MailOpen className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-semibold text-green-600">Email Sent Successfully</p>
                              <p className="text-sm text-muted-foreground">
                                Sent to {selectedInvoice.customer.email} on {selectedInvoice.sentDate}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="font-semibold text-orange-600">Email Not Sent Yet</p>
                              <p className="text-sm text-muted-foreground">
                                Click "Send Email" to send this invoice to the customer
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Footer Note */}
                    <div className="p-4 rounded-lg border-2 border-purple-200 bg-slate-50 dark:bg-slate-800/50">
                      <p className="text-sm text-muted-foreground text-center">
                        Thank you for your business! Payment is due within 30 days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 p-6 bg-slate-50 dark:bg-slate-800 rounded-b-2xl border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setPreviewOpen(false)}>
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={() => {
                      handleSendEmail(selectedInvoice);
                      setPreviewOpen(false);
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
