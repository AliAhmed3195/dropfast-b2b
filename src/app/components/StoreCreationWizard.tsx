import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Package,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  TrendingUp,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { StoreType, storeTemplates } from '../data/storeTemplates';

interface StoreCreationWizardProps {
  onClose: () => void;
  onComplete: (storeData: any) => void;
}

export function StoreCreationWizard({ onClose, onComplete }: StoreCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [storeData, setStoreData] = useState({
    name: '',
    storeType: '' as StoreType | '',
    industry: '',
    templateId: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    // Validation
    if (currentStep === 1) {
      if (!storeData.name || !storeData.storeType || !storeData.industry) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    if (currentStep === 2) {
      if (!storeData.templateId) {
        toast.error('Please select a template');
        return;
      }
    }

    if (currentStep === totalSteps) {
      // Complete wizard
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    const selectedTemplate = storeTemplates.find(t => t.id === storeData.templateId);
    
    // Generate store URL from name
    const storeUrl = storeData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const completeStoreData = {
      ...storeData,
      url: `${storeUrl}.fastdrop.com`,
      template: selectedTemplate,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    toast.success('Store created successfully!', {
      description: 'Redirecting to store builder...',
    });

    setTimeout(() => {
      onComplete(completeStoreData);
    }, 1000);
  };

  const industries = [
    'Electronics',
    'Fashion & Apparel',
    'Home & Garden',
    'Beauty & Cosmetics',
    'Sports & Fitness',
    'Toys & Games',
    'Books & Media',
    'Jewelry & Accessories',
    'Food & Beverages',
    'Health & Wellness',
    'Other',
  ];

  const filteredTemplates = storeData.storeType
    ? storeTemplates.filter(t => t.storeType === storeData.storeType)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-indigo-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Create Your Store</h2>
              <p className="text-purple-100">
                Step {currentStep} of {totalSteps}: {
                  currentStep === 1 ? 'Store Information' :
                  currentStep === 2 ? 'Choose Template' :
                  'Review & Launch'
                }
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "flex-1 h-2 rounded-full transition-all",
                  currentStep >= step
                    ? "bg-white"
                    : "bg-white/20"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Store Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4">Basic Information</h3>
                  <p className="text-muted-foreground mb-6">
                    Let's start with some basic details about your store
                  </p>
                </div>

                {/* Store Name */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Store Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., TechHub Store"
                    value={storeData.name}
                    onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                    className="h-12 text-lg"
                  />
                  {storeData.name && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Your store will be available at:{' '}
                      <strong className="text-purple-600">
                        {storeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.fastdrop.com
                      </strong>
                    </p>
                  )}
                </div>

                {/* Store Type Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    What type of store do you want to create? <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Single Product */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStoreData({ ...storeData, storeType: 'single-product' })}
                      className={cn(
                        "p-6 rounded-2xl border-2 cursor-pointer transition-all",
                        storeData.storeType === 'single-product'
                          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg"
                          : "border-slate-300 dark:border-slate-700 hover:border-purple-300"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-3 rounded-xl",
                          storeData.storeType === 'single-product'
                            ? "bg-gradient-to-br from-purple-500 to-pink-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        )}>
                          <Package className={cn(
                            "w-6 h-6",
                            storeData.storeType === 'single-product' ? "text-white" : "text-slate-500"
                          )} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">Single Product Store</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Perfect for launching one hero product
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">Landing Page</Badge>
                            <Badge variant="outline" className="text-xs">High Conversion</Badge>
                          </div>
                          <div className="mt-3 text-sm text-muted-foreground">
                            Best for: Gadgets, Courses, SaaS, Crowdfunding
                          </div>
                        </div>
                        {storeData.storeType === 'single-product' && (
                          <Check className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                    </motion.div>

                    {/* Multi Product */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStoreData({ ...storeData, storeType: 'multi-product' })}
                      className={cn(
                        "p-6 rounded-2xl border-2 cursor-pointer transition-all",
                        storeData.storeType === 'multi-product'
                          ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 shadow-lg"
                          : "border-slate-300 dark:border-slate-700 hover:border-cyan-300"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-3 rounded-xl",
                          storeData.storeType === 'multi-product'
                            ? "bg-gradient-to-br from-cyan-500 to-blue-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        )}>
                          <ShoppingBag className={cn(
                            "w-6 h-6",
                            storeData.storeType === 'multi-product' ? "text-white" : "text-slate-500"
                          )} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">Multi-Product Store</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Traditional ecommerce with product catalog
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">Full Catalog</Badge>
                            <Badge variant="outline" className="text-xs">Categories</Badge>
                          </div>
                          <div className="mt-3 text-sm text-muted-foreground">
                            Best for: Dropshipping, Retail, General Store
                          </div>
                        </div>
                        {storeData.storeType === 'multi-product' && (
                          <Check className="w-6 h-6 text-cyan-600" />
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Industry Selection */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Industry <span className="text-red-500">*</span>
                  </Label>
                  <Select value={storeData.industry} onValueChange={(value) => setStoreData({ ...storeData, industry: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {/* Step 2: Template Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-2">Choose Your Template</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a professionally designed template for your{' '}
                    <strong>{storeData.storeType === 'single-product' ? 'single-product' : 'multi-product'}</strong> store
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStoreData({ ...storeData, templateId: template.id })}
                      className={cn(
                        "rounded-2xl border-2 cursor-pointer transition-all overflow-hidden",
                        storeData.templateId === template.id
                          ? "border-purple-500 ring-4 ring-purple-200 dark:ring-purple-900/50"
                          : "border-slate-300 dark:border-slate-700 hover:border-purple-300"
                      )}
                    >
                      {/* Template Preview */}
                      <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                        {storeData.templateId === template.id && (
                          <Badge className="absolute top-4 right-4 bg-purple-600 text-white z-10">
                            <Check className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                        
                        {/* Template Icon/Preview */}
                        <div className="text-center">
                          {template.id === 'tech-launch' && <Zap className="w-20 h-20 text-purple-600 mx-auto mb-3" />}
                          {template.id === 'premium-brand' && <Crown className="w-20 h-20 text-purple-600 mx-auto mb-3" />}
                          {template.id === 'modern-ecommerce' && <TrendingUp className="w-20 h-20 text-cyan-600 mx-auto mb-3" />}
                          {template.id === 'classic-retail' && <Store className="w-20 h-20 text-cyan-600 mx-auto mb-3" />}
                          <p className="text-sm text-muted-foreground">Template Preview</p>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="p-6">
                        <h4 className="font-bold text-xl mb-2">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {template.description}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">BEST FOR:</p>
                          <div className="flex flex-wrap gap-2">
                            {template.bestFor.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <strong>{template.sections.length}</strong> pre-built sections included
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Almost There!</h3>
                  <p className="text-muted-foreground">
                    Review your store details and launch
                  </p>
                </div>

                <Card className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between pb-4 border-b">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Store Name</p>
                        <p className="text-2xl font-bold">{storeData.name}</p>
                      </div>
                      <Badge className="bg-green-500 text-white">Ready to Launch</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Store URL</p>
                        <p className="font-semibold text-purple-600">
                          {storeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.fastdrop.com
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Industry</p>
                        <p className="font-semibold">{storeData.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Store Type</p>
                        <Badge variant="outline">
                          {storeData.storeType === 'single-product' ? 'Single Product' : 'Multi-Product'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Template</p>
                        <p className="font-semibold">
                          {storeTemplates.find(t => t.id === storeData.templateId)?.name}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-3">What happens next?</p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Store created in draft mode</p>
                            <p className="text-xs text-muted-foreground">Not visible to customers yet</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Redirected to Store Builder</p>
                            <p className="text-xs text-muted-foreground">Customize sections, colors, and content</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Add products and publish</p>
                            <p className="text-xs text-muted-foreground">When ready, make your store live</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t p-6 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm min-w-[150px]"
            >
              {currentStep === totalSteps ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Store
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}