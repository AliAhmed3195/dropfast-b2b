import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Eye,
  Star,
  CheckCircle2,
  X,
  Download,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Package,
  Store,
  Check,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// Mock stores
const stores = [
  { id: 1, name: 'TechHub Store' },
  { id: 2, name: 'ElectroMart' },
  { id: 3, name: 'GadgetZone' },
];

// EXACT SAME TEMPLATES AS ADMIN
const invoiceTemplates = [
  {
    id: '1',
    name: 'Modern Gradient',
    description: 'Contemporary design with vibrant gradients and clean layout',
    layout: 'gradient',
    accentColor: 'from-purple-600 to-cyan-600',
  },
  {
    id: '2',
    name: 'Classic Professional',
    description: 'Traditional corporate design with left sidebar',
    layout: 'classic',
    accentColor: 'from-blue-600 to-indigo-600',
  },
  {
    id: '3',
    name: 'Minimalist Clean',
    description: 'Simple elegant design with subtle borders',
    layout: 'minimal',
    accentColor: 'from-slate-700 to-slate-900',
  },
  {
    id: '4',
    name: 'Bold Corporate',
    description: 'Professional design with top banner and sections',
    layout: 'corporate',
    accentColor: 'from-green-600 to-teal-600',
  },
];

export function VendorInvoiceTemplates() {
  const [selectedStore, setSelectedStore] = useState<number>(1);
  const [storeTemplates, setStoreTemplates] = useState<{ [key: number]: string }>({
    1: '1',
    2: '2',
    3: '3',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleSelectTemplate = (templateId: string) => {
    setStoreTemplates({ ...storeTemplates, [selectedStore]: templateId });
    const store = stores.find(s => s.id === selectedStore);
    const template = invoiceTemplates.find(t => t.id === templateId);
    toast.success('Template Selected!', {
      description: `${template?.name} is now active for ${store?.name}`,
    });
  };

  const currentTemplate = storeTemplates[selectedStore];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Invoice Templates
          </h2>
          <p className="text-muted-foreground mt-1">
            Choose and customize invoice templates for your stores
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2">
          <FileText className="w-4 h-4 mr-2" />
          {invoiceTemplates.length} Templates Available
        </Badge>
      </div>

      {/* Store Selection Card */}
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground mb-2 block">
              Select Store to Configure
            </Label>
            <Select
              value={selectedStore.toString()}
              onValueChange={(value) => setSelectedStore(parseInt(value))}
            >
              <SelectTrigger className="w-full md:w-80 h-12 border-2 bg-white dark:bg-slate-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stores.map(store => {
                  const template = invoiceTemplates.find(t => t.id === storeTemplates[store.id]);
                  return (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span className="font-semibold">{store.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {template?.name}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Active
          </Badge>
        </div>
      </Card>

      {/* Templates Grid - EXACT SAME AS ADMIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {invoiceTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "overflow-hidden transition-all hover:shadow-xl",
              currentTemplate === template.id && "ring-2 ring-purple-500"
            )}>
              {/* Template Preview */}
              <div className="relative h-80 bg-slate-50 dark:bg-slate-950 p-4">
                {currentTemplate === template.id && (
                  <Badge className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white z-10">
                    <Star className="w-3 h-3 mr-1 fill-white" />
                    Selected
                  </Badge>
                )}
                
                {/* Mini Invoice Preview with different layouts */}
                <TemplatePreviewMini template={template} />
              </div>

              {/* Template Info */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{template.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  {currentTemplate === template.id ? (
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      disabled
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Currently Selected
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Select Template
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal - EXACT SAME AS ADMIN */}
      <AnimatePresence>
        {selectedTemplate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedTemplate(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl z-50 max-h-[95vh] overflow-y-auto"
            >
              <Card className="h-full">
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-6 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                    <p className="text-sm text-muted-foreground">Invoice Template Preview</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-950">
                  <InvoicePreview template={selectedTemplate} />
                </div>
                <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {currentTemplate === selectedTemplate.id && (
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1 fill-white" />
                        Currently Selected
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {currentTemplate !== selectedTemplate.id && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleSelectTemplate(selectedTemplate.id);
                          setSelectedTemplate(null);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Select Template
                      </Button>
                    )}
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                      onClick={() => toast.success('Template downloaded!')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mini preview for template cards - EXACT SAME AS ADMIN
function TemplatePreviewMini({ template }: { template: any }) {
  const layouts: Record<string, JSX.Element> = {
    gradient: (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl h-full p-3 overflow-hidden scale-[0.85] origin-top-left">
        <div className={cn("h-16 bg-gradient-to-r rounded-lg mb-3 flex items-center px-4", template.accentColor)}>
          <div className="w-20 h-3 bg-white/80 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="space-y-1">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-1.5 mb-3">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className={cn("h-8 bg-gradient-to-r rounded ml-auto w-32", template.accentColor)} />
      </div>
    ),
    classic: (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl h-full overflow-hidden flex scale-[0.85] origin-top-left">
        <div className={cn("w-24 bg-gradient-to-b p-3", template.accentColor)}>
          <div className="space-y-2">
            <div className="h-10 bg-white/20 rounded" />
            <div className="h-2 bg-white/40 rounded" />
            <div className="h-2 bg-white/40 rounded" />
            <div className="h-2 bg-white/40 rounded" />
          </div>
        </div>
        <div className="flex-1 p-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
          <div className="space-y-1.5 mb-3">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className={cn("h-8 bg-gradient-to-r rounded w-full", template.accentColor)} />
        </div>
      </div>
    ),
    minimal: (
      <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 h-full p-3 overflow-hidden scale-[0.85] origin-top-left">
        <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-900 dark:border-slate-200">
          <div className="h-3 w-20 bg-slate-900 dark:bg-slate-200 rounded" />
          <div className="h-2 w-16 bg-slate-400 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="space-y-1">
            <div className="h-1.5 bg-slate-300 dark:bg-slate-700 rounded w-full" />
            <div className="h-1.5 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-slate-300 dark:bg-slate-700 rounded w-full" />
            <div className="h-1.5 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
          </div>
        </div>
        <div className="space-y-1 mb-3">
          <div className="h-5 border border-slate-300 dark:border-slate-700 rounded" />
          <div className="h-5 border border-slate-300 dark:border-slate-700 rounded" />
          <div className="h-5 border border-slate-300 dark:border-slate-700 rounded" />
        </div>
        <div className="h-6 border-2 border-slate-900 dark:border-slate-200 rounded ml-auto w-32" />
      </div>
    ),
    corporate: (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl h-full overflow-hidden scale-[0.85] origin-top-left">
        <div className={cn("h-12 bg-gradient-to-r", template.accentColor)} />
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded p-2">
              <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded mb-1" />
              <div className="h-1.5 bg-slate-300 dark:bg-slate-600 rounded w-3/4" />
            </div>
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded p-2">
              <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded mb-1" />
              <div className="h-1.5 bg-slate-300 dark:bg-slate-600 rounded w-3/4" />
            </div>
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded p-2">
              <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded mb-1" />
              <div className="h-1.5 bg-slate-300 dark:bg-slate-600 rounded w-3/4" />
            </div>
          </div>
          <div className="space-y-1.5 mb-3">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className={cn("h-10 bg-gradient-to-r rounded", template.accentColor)} />
        </div>
      </div>
    ),
  };

  return layouts[template.layout] || layouts.gradient;
}

// Full invoice preview component - EXACT SAME AS ADMIN
interface InvoicePreviewProps {
  template: any;
}

function InvoicePreview({ template }: InvoicePreviewProps) {
  const mockInvoice = {
    invoiceNumber: 'INV-2024-001',
    date: '2024-12-25',
    dueDate: '2025-01-25',
    vendor: {
      name: 'Tech Haven Store',
      email: 'owner@techhaven.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business St, New York, NY 10001',
    },
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 234-5678',
      address: '456 Customer Ave, Los Angeles, CA 90001',
    },
    items: [
      { name: 'Wireless Headphones', quantity: 2, price: 79.99, total: 159.98 },
      { name: 'Phone Case', quantity: 1, price: 19.99, total: 19.99 },
      { name: 'USB-C Cable', quantity: 3, price: 12.99, total: 38.97 },
    ],
    subtotal: 218.94,
    tax: 21.89,
    total: 240.83,
  };

  const layouts: Record<string, JSX.Element> = {
    // Layout 1: Modern Gradient - Full width header
    gradient: (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
        {/* Header */}
        <div className={cn("p-10 bg-gradient-to-r text-white", template.accentColor)}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3">INVOICE</h1>
              <p className="text-xl text-white/90">#{mockInvoice.invoiceNumber}</p>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 justify-end mb-2">
                <Building2 className="w-5 h-5" />
                <p className="font-bold text-lg">{mockInvoice.vendor.name}</p>
              </div>
              <p className="text-sm text-white/80">{mockInvoice.vendor.email}</p>
              <p className="text-sm text-white/80">{mockInvoice.vendor.phone}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-8">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Invoice Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-muted-foreground font-medium">Issue Date</span>
                  <span className="font-semibold">{mockInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Due Date</span>
                  <span className="font-semibold">{mockInvoice.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Bill To
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold">{mockInvoice.customer.name}</p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {mockInvoice.customer.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {mockInvoice.customer.phone}
                </p>
                <p className="text-muted-foreground flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  {mockInvoice.customer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="text-left p-4 font-bold">Item</th>
                  <th className="text-center p-4 font-bold">Qty</th>
                  <th className="text-right p-4 font-bold">Price</th>
                  <th className="text-right p-4 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoice.items.map((item, i) => (
                  <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 text-center">{item.quantity}</td>
                    <td className="p-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="p-4 text-right font-semibold">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${mockInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-semibold">${mockInvoice.tax.toFixed(2)}</span>
              </div>
              <div className={cn("flex justify-between p-4 rounded-xl bg-gradient-to-r text-white", template.accentColor)}>
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">${mockInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    // Layout 2: Classic - Sidebar
    classic: (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto flex">
        {/* Sidebar */}
        <div className={cn("w-64 p-8 bg-gradient-to-b text-white", template.accentColor)}>
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-lg mb-4 flex items-center justify-center">
              <Building2 className="w-10 h-10" />
            </div>
            <h2 className="font-bold text-xl mb-2">{mockInvoice.vendor.name}</h2>
            <p className="text-sm text-white/80 mb-1">{mockInvoice.vendor.email}</p>
            <p className="text-sm text-white/80 mb-1">{mockInvoice.vendor.phone}</p>
            <p className="text-xs text-white/70 mt-3">{mockInvoice.vendor.address}</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/70 mb-1">Invoice Number</p>
              <p className="font-bold">#{mockInvoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 mb-1">Issue Date</p>
              <p className="font-semibold">{mockInvoice.date}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 mb-1">Due Date</p>
              <p className="font-semibold">{mockInvoice.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10">
          <h1 className="text-4xl font-bold mb-8">INVOICE</h1>

          {/* Bill To */}
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-sm text-muted-foreground mb-3">BILL TO</h3>
            <p className="font-bold text-lg mb-2">{mockInvoice.customer.name}</p>
            <p className="text-sm text-muted-foreground mb-1">{mockInvoice.customer.email}</p>
            <p className="text-sm text-muted-foreground mb-1">{mockInvoice.customer.phone}</p>
            <p className="text-sm text-muted-foreground">{mockInvoice.customer.address}</p>
          </div>

          {/* Items */}
          <table className="w-full mb-6">
            <thead className="border-b-2 border-slate-900 dark:border-slate-200">
              <tr>
                <th className="text-left py-3 font-bold">Item</th>
                <th className="text-center py-3 font-bold">Qty</th>
                <th className="text-right py-3 font-bold">Price</th>
                <th className="text-right py-3 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoice.items.map((item, i) => (
                <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${mockInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${mockInvoice.tax.toFixed(2)}</span>
              </div>
              <div className={cn("flex justify-between p-3 rounded-lg bg-gradient-to-r text-white mt-3", template.accentColor)}>
                <span className="font-bold">TOTAL</span>
                <span className="text-xl font-bold">${mockInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    // Layout 3: Minimal
    minimal: (
      <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-900 dark:border-slate-200 overflow-hidden max-w-4xl mx-auto">
        <div className="p-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-10 pb-6 border-b-2 border-slate-900 dark:border-slate-200">
            <div>
              <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">INVOICE</h1>
              <p className="text-slate-600 dark:text-slate-400">#{mockInvoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg mb-1">{mockInvoice.vendor.name}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.vendor.email}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.vendor.phone}</p>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">INVOICE DATE</p>
              <p className="font-semibold">{mockInvoice.date}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">DUE DATE</p>
              <p className="font-semibold">{mockInvoice.dueDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">BILL TO</p>
              <p className="font-semibold">{mockInvoice.customer.name}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.customer.email}</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full mb-6">
            <thead>
              <tr className="border-y border-slate-300 dark:border-slate-700">
                <th className="text-left py-3 font-bold text-sm">ITEM</th>
                <th className="text-center py-3 font-bold text-sm">QTY</th>
                <th className="text-right py-3 font-bold text-sm">PRICE</th>
                <th className="text-right py-3 font-bold text-sm">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoice.items.map((item, i) => (
                <tr key={i} className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-4">{item.name}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-4 text-right font-semibold">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${mockInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Tax</span>
                <span>${mockInvoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4 mt-4 border-t-2 border-slate-900 dark:border-slate-200">
                <span className="text-xl font-bold">TOTAL</span>
                <span className="text-2xl font-bold">${mockInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    // Layout 4: Corporate
    corporate: (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
        {/* Top Banner */}
        <div className={cn("h-24 bg-gradient-to-r", template.accentColor)} />

        <div className="p-10">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6">
              <p className="text-xs text-muted-foreground mb-2">INVOICE NUMBER</p>
              <p className="font-bold text-lg">#{mockInvoice.invoiceNumber}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6">
              <p className="text-xs text-muted-foreground mb-2">ISSUE DATE</p>
              <p className="font-bold text-lg">{mockInvoice.date}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6">
              <p className="text-xs text-muted-foreground mb-2">DUE DATE</p>
              <p className="font-bold text-lg">{mockInvoice.dueDate}</p>
            </div>
          </div>

          {/* From/To */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-bold mb-4 text-sm text-muted-foreground">FROM</h3>
              <p className="font-bold text-lg mb-2">{mockInvoice.vendor.name}</p>
              <p className="text-sm text-muted-foreground mb-1">{mockInvoice.vendor.email}</p>
              <p className="text-sm text-muted-foreground mb-1">{mockInvoice.vendor.phone}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.vendor.address}</p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm text-muted-foreground">TO</h3>
              <p className="font-bold text-lg mb-2">{mockInvoice.customer.name}</p>
              <p className="text-sm text-muted-foreground mb-1">{mockInvoice.customer.email}</p>
              <p className="text-sm text-muted-foreground mb-1">{mockInvoice.customer.phone}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.customer.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-6">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left py-3 font-bold">Item Description</th>
                  <th className="text-center py-3 font-bold">Quantity</th>
                  <th className="text-right py-3 font-bold">Unit Price</th>
                  <th className="text-right py-3 font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-4 font-medium">{item.name}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-4 text-right font-semibold">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-96">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${mockInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-semibold">${mockInvoice.tax.toFixed(2)}</span>
                </div>
              </div>
              <div className={cn("p-6 rounded-xl bg-gradient-to-r text-white", template.accentColor)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80 mb-1">Total Amount Due</p>
                    <p className="text-3xl font-bold">${mockInvoice.total.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-white/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return layouts[template.layout] || layouts.gradient;
}
