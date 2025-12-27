import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Eye,
  Star,
  Power,
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
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// Mock invoice templates with unique layouts
const invoiceTemplates = [
  {
    id: '1',
    name: 'Modern Gradient',
    description: 'Contemporary design with vibrant gradients and clean layout',
    layout: 'gradient',
    isDefault: true,
    isActive: true,
    accentColor: 'from-purple-600 to-cyan-600',
    usedBy: 12,
  },
  {
    id: '2',
    name: 'Classic Professional',
    description: 'Traditional corporate design with left sidebar',
    layout: 'classic',
    isDefault: false,
    isActive: true,
    accentColor: 'from-blue-600 to-indigo-600',
    usedBy: 8,
  },
  {
    id: '3',
    name: 'Minimalist Clean',
    description: 'Simple elegant design with subtle borders',
    layout: 'minimal',
    isDefault: false,
    isActive: true,
    accentColor: 'from-slate-700 to-slate-900',
    usedBy: 5,
  },
  {
    id: '4',
    name: 'Bold Corporate',
    description: 'Professional design with top banner and sections',
    layout: 'corporate',
    isDefault: false,
    isActive: false,
    accentColor: 'from-green-600 to-teal-600',
    usedBy: 3,
  },
];

export function AdminInvoiceTemplates() {
  const [templates, setTemplates] = useState(invoiceTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleSetDefault = (templateId: string) => {
    setTemplates(prev =>
      prev.map(t => ({
        ...t,
        isDefault: t.id === templateId,
      }))
    );
    toast.success('Default template updated!');
  };

  const handleToggleActive = (templateId: string) => {
    setTemplates(prev =>
      prev.map(t =>
        t.id === templateId
          ? { ...t, isActive: !t.isActive, ...(t.isDefault && !t.isActive ? { isDefault: false } : {}) }
          : t
      )
    );
    const template = templates.find(t => t.id === templateId);
    toast.success(template?.isActive ? 'Template deactivated' : 'Template activated');
  };

  const stats = {
    total: templates.length,
    active: templates.filter(t => t.isActive).length,
    inactive: templates.filter(t => !t.isActive).length,
    totalUsage: templates.reduce((sum, t) => sum + t.usedBy, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Invoice Templates
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage invoice templates that vendors can use for customer invoices
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Templates</p>
              <p className="text-2xl font-bold">{stats.total}</p>
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
              <p className="text-sm text-muted-foreground font-medium">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500">
              <Power className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Inactive</p>
              <p className="text-2xl font-bold">{stats.inactive}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Usage</p>
              <p className="text-2xl font-bold">{stats.totalUsage} vendors</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "overflow-hidden transition-all hover:shadow-xl",
              template.isDefault && "ring-2 ring-purple-500"
            )}>
              {/* Template Preview */}
              <div className="relative h-80 bg-slate-50 dark:bg-slate-950 p-4">
                {template.isDefault && (
                  <Badge className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white z-10">
                    <Star className="w-3 h-3 mr-1 fill-white" />
                    Default
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
                    <Badge variant="outline" className="text-xs">
                      {template.usedBy} vendors
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={template.isActive}
                      onCheckedChange={() => handleToggleActive(template.id)}
                    />
                    <span className="text-sm font-medium">
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {!template.isDefault && template.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(template.id)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Set Default
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
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
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
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={selectedTemplate.isActive}
                        onCheckedChange={() => handleToggleActive(selectedTemplate.id)}
                      />
                      <span className="text-sm font-medium">
                        {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {selectedTemplate.isDefault && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Default Template
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {!selectedTemplate.isDefault && selectedTemplate.isActive && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleSetDefault(selectedTemplate.id);
                          setSelectedTemplate(null);
                        }}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Set as Default
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

// Mini preview for template cards
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

// Full invoice preview component
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
                <Calendar className={cn("w-5 h-5 bg-gradient-to-r bg-clip-text text-transparent", template.accentColor)} />
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
                <User className={cn("w-5 h-5 bg-gradient-to-r bg-clip-text text-transparent", template.accentColor)} />
                Bill To
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-base">{mockInvoice.customer.name}</p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {mockInvoice.customer.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {mockInvoice.customer.phone}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {mockInvoice.customer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
            <div className={cn("bg-gradient-to-r text-white p-4 grid grid-cols-12 gap-4 font-semibold", template.accentColor)}>
              <div className="col-span-6">Item Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {mockInvoice.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/30"
              >
                <div className="col-span-6 font-semibold">{item.name}</div>
                <div className="col-span-2 text-center text-muted-foreground">{item.quantity}</div>
                <div className="col-span-2 text-right text-muted-foreground">${item.price.toFixed(2)}</div>
                <div className="col-span-2 text-right font-bold">${item.total.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-96 space-y-4">
              <div className="flex justify-between text-base pb-3 border-b">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="font-semibold">${mockInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base pb-3 border-b">
                <span className="text-muted-foreground font-medium">Tax (10%)</span>
                <span className="font-semibold">${mockInvoice.tax.toFixed(2)}</span>
              </div>
              <div className={cn("flex justify-between p-5 rounded-xl bg-gradient-to-r text-white text-2xl font-bold", template.accentColor)}>
                <span>Total Amount</span>
                <span>${mockInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t-2 text-center">
            <p className="text-lg font-semibold mb-2">Thank you for your business!</p>
            <p className="text-sm text-muted-foreground">{mockInvoice.vendor.address}</p>
          </div>
        </div>
      </div>
    ),

    // Layout 2: Classic Professional - Left sidebar
    classic: (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto flex">
        {/* Left Sidebar */}
        <div className={cn("w-80 bg-gradient-to-b text-white p-8", template.accentColor)}>
          <div className="mb-8">
            <Building2 className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{mockInvoice.vendor.name}</h2>
            <div className="space-y-2 text-sm text-white/80">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {mockInvoice.vendor.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {mockInvoice.vendor.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {mockInvoice.vendor.address}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
            <h3 className="font-bold text-sm mb-3 text-white/90">INVOICE DETAILS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Number:</span>
                <span className="font-semibold">{mockInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Date:</span>
                <span className="font-semibold">{mockInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Due:</span>
                <span className="font-semibold">{mockInvoice.dueDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-bold text-sm mb-3 text-white/90">BILL TO</h3>
            <div className="space-y-1 text-sm">
              <p className="font-bold">{mockInvoice.customer.name}</p>
              <p className="text-white/80">{mockInvoice.customer.email}</p>
              <p className="text-white/80">{mockInvoice.customer.phone}</p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
            <p className="text-muted-foreground">Professional Payment Request</p>
          </div>

          {/* Items */}
          <div className="mb-8">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-t-lg p-3 grid grid-cols-12 gap-4 text-sm font-bold">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {mockInvoice.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-4 p-3 text-sm border-x border-b border-slate-200 dark:border-slate-700 last:rounded-b-lg"
              >
                <div className="col-span-6 font-medium">{item.name}</div>
                <div className="col-span-2 text-center text-muted-foreground">{item.quantity}</div>
                <div className="col-span-2 text-right text-muted-foreground">${item.price.toFixed(2)}</div>
                <div className="col-span-2 text-right font-semibold">${item.total.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="ml-auto w-80 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${mockInvoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span className="font-medium">${mockInvoice.tax.toFixed(2)}</span>
            </div>
            <div className={cn("flex justify-between p-4 rounded-lg bg-gradient-to-r text-white text-xl font-bold", template.accentColor)}>
              <span>TOTAL</span>
              <span>${mockInvoice.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p className="font-semibold">Thank you for your business!</p>
          </div>
        </div>
      </div>
    ),

    // Layout 3: Minimalist Clean - Subtle borders
    minimal: (
      <div className="bg-white dark:bg-slate-900 rounded-xl border-4 border-slate-900 dark:border-slate-100 overflow-hidden max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-10 border-b-4 border-slate-900 dark:border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-6xl font-bold tracking-tight mb-2">INVOICE</h1>
              <p className="text-lg font-mono">{mockInvoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl mb-1">{mockInvoice.vendor.name}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.vendor.email}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.vendor.phone}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-8">
          {/* Info */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Invoice Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-sm text-muted-foreground">Issue Date</span>
                  <span className="font-mono text-sm font-semibold">{mockInvoice.date}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="font-mono text-sm font-semibold">{mockInvoice.dueDate}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Billed To</h3>
              <div className="space-y-1">
                <p className="font-bold">{mockInvoice.customer.name}</p>
                <p className="text-sm text-muted-foreground">{mockInvoice.customer.email}</p>
                <p className="text-sm text-muted-foreground">{mockInvoice.customer.phone}</p>
                <p className="text-sm text-muted-foreground">{mockInvoice.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="border-2 border-slate-900 dark:border-slate-100 rounded-lg overflow-hidden">
              <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 p-3 grid grid-cols-12 gap-4 text-sm font-bold uppercase tracking-wider">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              {mockInvoice.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-4 p-3 border-b border-slate-300 dark:border-slate-700 last:border-b-0"
                >
                  <div className="col-span-6 font-semibold">{item.name}</div>
                  <div className="col-span-2 text-center font-mono">{item.quantity}</div>
                  <div className="col-span-2 text-right font-mono text-muted-foreground">${item.price.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-mono font-bold">${item.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-96 space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono font-semibold">${mockInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base border-b pb-3">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-mono font-semibold">${mockInvoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-4 border-4 border-slate-900 dark:border-slate-100 rounded-lg text-2xl font-bold">
                <span>TOTAL</span>
                <span className="font-mono">${mockInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t text-center">
            <p className="font-bold text-lg">Thank You!</p>
            <p className="text-sm text-muted-foreground mt-1">{mockInvoice.vendor.address}</p>
          </div>
        </div>
      </div>
    ),

    // Layout 4: Bold Corporate - Top banner with sections
    corporate: (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
        {/* Top Banner */}
        <div className={cn("h-24 bg-gradient-to-r", template.accentColor)} />

        {/* Content */}
        <div className="p-10 space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3">INVOICE</h1>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm font-mono">
                  {mockInvoice.invoiceNumber}
                </Badge>
                <span className="text-sm text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground">Issued: {mockInvoice.date}</span>
              </div>
            </div>
            <div className="text-right bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <Building2 className="w-8 h-8 ml-auto mb-2 text-purple-600" />
              <p className="font-bold text-lg">{mockInvoice.vendor.name}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.vendor.email}</p>
              <p className="text-sm text-muted-foreground">{mockInvoice.vendor.phone}</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase text-muted-foreground">Due Date</h3>
              </div>
              <p className="text-xl font-bold">{mockInvoice.dueDate}</p>
            </Card>
            <Card className="p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-cyan-600" />
                <h3 className="text-xs font-bold uppercase text-muted-foreground">Customer</h3>
              </div>
              <p className="text-lg font-bold truncate">{mockInvoice.customer.name}</p>
            </Card>
            <Card className="p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <h3 className="text-xs font-bold uppercase text-muted-foreground">Amount Due</h3>
              </div>
              <p className="text-xl font-bold">${mockInvoice.total.toFixed(2)}</p>
            </Card>
          </div>

          {/* Customer Details */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Billing Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold mb-1">{mockInvoice.customer.name}</p>
                <p className="text-muted-foreground">{mockInvoice.customer.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{mockInvoice.customer.phone}</p>
                <p className="text-muted-foreground">{mockInvoice.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wide">Items & Services</h3>
            <div className="rounded-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className={cn("bg-gradient-to-r text-white p-4 grid grid-cols-12 gap-4 font-bold", template.accentColor)}>
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              {mockInvoice.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 bg-white dark:bg-slate-900"
                >
                  <div className="col-span-6 font-semibold">{item.name}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right text-muted-foreground">${item.price.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold">${item.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-96 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${mockInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-semibold">${mockInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${mockInvoice.total.toFixed(2)}</span>
                </div>
              </div>
              <div className={cn("p-6 rounded-lg bg-gradient-to-r text-white text-center", template.accentColor)}>
                <p className="text-sm opacity-90 mb-1">Amount Due</p>
                <p className="text-3xl font-bold">${mockInvoice.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t text-center">
            <p className="text-lg font-semibold mb-2">Thank you for your business!</p>
            <p className="text-sm text-muted-foreground">{mockInvoice.vendor.address}</p>
          </div>
        </div>
      </div>
    ),
  };

  return layouts[template.layout] || layouts.gradient;
}
