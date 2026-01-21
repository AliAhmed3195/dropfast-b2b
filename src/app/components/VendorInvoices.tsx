import React, { useState, useRef } from 'react';
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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleSendEmail = (invoice: any) => {
    toast.success('Invoice Sent!', {
      description: `Invoice ${invoice.id} sent to ${invoice.customer.email}`,
    });
  };

  const handleDownloadInvoice = async (invoice: any) => {
    if (!invoiceRef.current) {
      toast.error('Invoice preview not found');
      console.error('Invoice ref not found');
      return;
    }

    console.log('Starting PDF generation for invoice:', invoice.id);
    const loadingToast = toast.loading('Generating PDF...');

    let wrapper: HTMLElement | null = null;
    const originalStylesheets: HTMLElement[] = [];

    try {
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      // STEP 1: Temporarily disable ALL document stylesheets
      console.log('Disabling all stylesheets...');
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((sheet) => {
        const htmlSheet = sheet as HTMLElement;
        if (htmlSheet.textContent?.includes('oklch') || 
            htmlSheet.textContent?.includes('oklab') || 
            htmlSheet.textContent?.includes('lch(') || 
            htmlSheet.textContent?.includes('lab(') || 
            htmlSheet.getAttribute('href')?.includes('tailwind')) {
          originalStylesheets.push(htmlSheet);
          htmlSheet.setAttribute('data-pdf-disabled', 'true');
          if (htmlSheet.tagName === 'LINK') {
            (htmlSheet as HTMLLinkElement).disabled = true;
          } else {
            htmlSheet.textContent = '';
          }
        }
      });

      // STEP 2: Create isolated wrapper
      wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.width = invoiceRef.current.offsetWidth + 'px';
      wrapper.style.backgroundColor = '#ffffff';
      wrapper.style.zIndex = '-1';
      document.body.appendChild(wrapper);
      console.log('Wrapper created');

      // STEP 3: Clone the invoice
      const clone = invoiceRef.current.cloneNode(true) as HTMLElement;
      wrapper.appendChild(clone);

      // STEP 4: Inject ONLY RGB/hex colors - comprehensive override
      const overrideStyle = document.createElement('style');
      overrideStyle.textContent = `
        * { 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Gradients */
        .bg-gradient-to-r, 
        [class*="gradient-to-r"],
        [class*="from-purple"] { 
          background: linear-gradient(to right, #9333ea, #4f46e5, #06b6d4) !important; 
        }
        
        /* Purple shades */
        [class*="purple-50"] { background-color: #faf5ff !important; }
        [class*="purple-100"] { background-color: #f3e8ff !important; color: #7c3aed !important; }
        [class*="purple-200"] { background-color: #e9d5ff !important; border-color: #e9d5ff !important; }
        [class*="purple-500"] { background-color: #a855f7 !important; }
        [class*="purple-600"], [class*="from-purple-600"], [class*="to-purple"] { 
          background-color: #9333ea !important; 
          color: #ffffff !important; 
        }
        [class*="purple-700"] { background-color: #7e22ce !important; }
        [class*="text-purple"] { color: #9333ea !important; }
        
        /* Indigo shades */
        [class*="indigo-50"] { background-color: #eef2ff !important; }
        [class*="indigo-100"] { background-color: #e0e7ff !important; }
        [class*="indigo-600"], [class*="via-indigo"], [class*="to-indigo"] { 
          background-color: #4f46e5 !important; 
          color: #ffffff !important; 
        }
        
        /* Cyan/Blue shades */
        [class*="cyan-50"] { background-color: #ecfeff !important; }
        [class*="cyan-100"] { background-color: #cffafe !important; }
        [class*="cyan-600"], [class*="to-cyan"] { 
          background-color: #06b6d4 !important; 
          color: #ffffff !important; 
        }
        [class*="blue-50"] { background-color: #eff6ff !important; }
        [class*="blue-100"] { background-color: #dbeafe !important; }
        [class*="blue-600"], [class*="from-blue"], [class*="to-blue"] { 
          background-color: #2563eb !important; 
          color: #ffffff !important; 
        }
        
        /* Slate shades */
        [class*="slate-50"] { background-color: #f8fafc !important; }
        [class*="slate-100"] { background-color: #f1f5f9 !important; }
        [class*="slate-200"] { 
          background-color: #e2e8f0 !important; 
          border-color: #e2e8f0 !important; 
        }
        [class*="slate-300"] { background-color: #cbd5e1 !important; }
        [class*="slate-400"] { background-color: #94a3b8 !important; }
        [class*="slate-500"] { background-color: #64748b !important; }
        [class*="slate-600"] { background-color: #475569 !important; }
        [class*="slate-700"] { 
          background-color: #334155 !important; 
          color: #ffffff !important;
          border-color: #334155 !important;
        }
        [class*="slate-800"] { 
          background-color: #1e293b !important; 
          color: #ffffff !important;
        }
        [class*="slate-900"] { 
          background-color: #0f172a !important; 
          color: #ffffff !important;
        }
        
        /* Other colors */
        [class*="green-50"] { background-color: #f0fdf4 !important; }
        [class*="green-600"], [class*="text-green"] { color: #16a34a !important; }
        [class*="yellow-50"] { background-color: #fefce8 !important; }
        [class*="yellow-400"] { background-color: #facc15 !important; }
        [class*="orange-50"] { background-color: #fff7ed !important; }
        [class*="orange-600"] { color: #ea580c !important; }
        [class*="red-50"] { background-color: #fef2f2 !important; }
        [class*="red-600"] { color: #dc2626 !important; }
        
        /* Base colors */
        [class*="bg-white"], [class*="white"] { 
          background-color: #ffffff !important; 
          color: #000000 !important; 
        }
        [class*="text-white"] { color: #ffffff !important; }
        [class*="bg-black"] { background-color: #000000 !important; }
        [class*="text-black"] { color: #000000 !important; }
        
        /* Borders */
        [class*="border-slate"] { border-color: #e2e8f0 !important; }
        [class*="border-purple"] { border-color: #e9d5ff !important; }
        
        /* Text colors */
        [class*="muted-foreground"] { color: #64748b !important; }
      `;
      wrapper.appendChild(overrideStyle);

      // STEP 5: Remove any remaining problematic styles from clone
      const cloneStyles = wrapper.querySelectorAll('style, link[rel="stylesheet"]');
      cloneStyles.forEach(style => {
        if (style !== overrideStyle) {
          style.remove();
        }
      });

      // STEP 6: Capture with html2canvas using MINIMAL CSS parsing
      console.log('Starting html2canvas capture...');
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
      });
      console.log('Canvas captured successfully');

      // STEP 7: Restore original stylesheets
      console.log('Restoring original stylesheets...');
      originalStylesheets.forEach((sheet) => {
        sheet.removeAttribute('data-pdf-disabled');
        if (sheet.tagName === 'LINK') {
          (sheet as HTMLLinkElement).disabled = false;
        }
      });

      // STEP 8: Cleanup wrapper
      if (wrapper && wrapper.parentNode) {
        document.body.removeChild(wrapper);
        console.log('Wrapper cleaned up');
      }

      if (!canvas) {
        throw new Error('Failed to capture invoice');
      }

      // Calculate PDF dimensions
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Convert to image
      const imgData = canvas.toDataURL('image/png', 1.0);

      if (!imgData || imgData === 'data:,') {
        throw new Error('Failed to convert invoice to image');
      }

      // Handle multi-page
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download
      const fileName = `${invoice.id.toLowerCase()}.pdf`;
      pdf.save(fileName);

      toast.dismiss(loadingToast);
      toast.success('Invoice downloaded successfully!');
      console.log('PDF generated and downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', error instanceof Error ? error.stack : error);
      
      // Restore stylesheets on error
      console.log('Restoring stylesheets after error...');
      originalStylesheets.forEach((sheet) => {
        try {
          sheet.removeAttribute('data-pdf-disabled');
          if (sheet.tagName === 'LINK') {
            (sheet as HTMLLinkElement).disabled = false;
          }
        } catch (restoreError) {
          console.error('Error restoring stylesheet:', restoreError);
        }
      });
      
      // Cleanup wrapper on error
      if (wrapper && wrapper.parentNode) {
        try {
          document.body.removeChild(wrapper);
          console.log('Wrapper cleaned up after error');
        } catch (cleanupError) {
          console.error('Error cleaning up wrapper:', cleanupError);
        }
      }
      
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to generate PDF: ${errorMessage}`);
    }
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
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setPreviewOpen(true);
                          setTimeout(() => handleDownloadInvoice(invoice), 500);
                        }}
                      >
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
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
              <div className="flex-1 overflow-y-auto p-8">
                <div ref={invoiceRef} className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden max-w-full">
                  {/* Invoice Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 md:p-8 text-white">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
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
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
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
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDownloadInvoice(selectedInvoice)}
                  >
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
