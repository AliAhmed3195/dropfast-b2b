import React, { useState, useRef } from 'react';
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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  const invoiceRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !selectedTemplate) {
      toast.error('Invoice template not found');
      console.error('Invoice ref or template not found');
      return;
    }

    console.log('Starting PDF generation for template:', selectedTemplate.name);
    const loadingToast = toast.loading('Generating PDF...');

    let wrapper: HTMLElement | null = null;
    const originalStylesheets: HTMLElement[] = [];

    try {
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      // STEP 1: Temporarily disable ALL document stylesheets containing modern CSS
      console.log('Disabling all problematic stylesheets...');
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

      // STEP 3: Clone the template
      const clone = invoiceRef.current.cloneNode(true) as HTMLElement;
      wrapper.appendChild(clone);

      // STEP 4: Inject comprehensive RGB/hex color overrides
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

      // STEP 6: Capture with html2canvas
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
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      if (!imgData || imgData === 'data:,') {
        throw new Error('Failed to convert invoice to image');
      }

      // Handle multi-page if needed
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const fileName = `invoice-template-${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      
      // Save PDF
      pdf.save(fileName);

      toast.dismiss(loadingToast);
      toast.success('PDF downloaded successfully!');
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to generate PDF: ${errorMessage}`);
    }
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
                  <div ref={invoiceRef}>
                    <InvoicePreview template={selectedTemplate} />
                  </div>
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
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
                      onClick={handleDownloadPDF}
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
