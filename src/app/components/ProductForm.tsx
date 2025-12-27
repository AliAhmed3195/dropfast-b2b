import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  DollarSign,
  Box,
  ImageIcon,
  Layers,
  Tag,
  Truck,
  Clock,
  Shield,
  AlertTriangle,
  Info,
  X,
  Plus,
  Trash2,
  Globe,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// Currency exchange rates (mock - in production, fetch from API)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CNY: 7.24,
  INR: 83.12,
  JPY: 149.50,
  AUD: 1.52,
  CAD: 1.36,
  PKR: 278.50,
};

interface ProductFormProps {
  onClose: () => void;
  product?: any;
}

// Stepper steps configuration
const STEPS = [
  { number: 1, title: 'Basic Info', icon: Package, description: 'Product information' },
  { number: 2, title: 'Pricing & Stock', icon: DollarSign, description: 'Pricing & inventory' },
  { number: 3, title: 'Classification', icon: Layers, description: 'Category & details' },
  { number: 4, title: 'Shipping', icon: Truck, description: 'Shipping info' },
  { number: 5, title: 'Media', icon: ImageIcon, description: 'Images & variants' },
];

export function ProductForm({ onClose, product }: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic Info
  const [productName, setProductName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [brandName, setBrandName] = useState(product?.brand || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [barcode, setBarcode] = useState(product?.barcode || '');
  const [productStatus, setProductStatus] = useState(product?.status || 'draft');
  
  // Pricing
  const [baseCurrency, setBaseCurrency] = useState(product?.baseCurrency || 'USD');
  const [baseCostPrice, setBaseCostPrice] = useState(product?.baseCostPrice || '');
  const [baseSellingPrice, setBaseSellingPrice] = useState(product?.baseSellingPrice || '');
  const [usdCostPrice, setUsdCostPrice] = useState(product?.costPrice || 0);
  const [usdSellingPrice, setUsdSellingPrice] = useState(product?.sellingPrice || 0);
  const [profitMargin, setProfitMargin] = useState(0);
  
  // Inventory
  const [stock, setStock] = useState(product?.stock || '');
  const [moq, setMoq] = useState(product?.moq || '');
  const [stockAlertThreshold, setStockAlertThreshold] = useState(product?.stockAlertThreshold || '');
  
  // Classification
  const [category, setCategory] = useState(product?.category || '');
  const [subcategory, setSubcategory] = useState(product?.subcategory || '');
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  // Product Details
  const [productCondition, setProductCondition] = useState(product?.condition || 'new');
  const [warrantyPeriod, setWarrantyPeriod] = useState(product?.warranty || '');
  const [leadTime, setLeadTime] = useState(product?.leadTime || '');
  
  // Shipping
  const [weight, setWeight] = useState(product?.weight || '');
  const [weightUnit, setWeightUnit] = useState(product?.weightUnit || 'kg');
  const [length, setLength] = useState(product?.length || '');
  const [width, setWidth] = useState(product?.width || '');
  const [height, setHeight] = useState(product?.height || '');
  const [dimensionUnit, setDimensionUnit] = useState(product?.dimensionUnit || 'cm');
  const [shippingCost, setShippingCost] = useState(product?.shippingCost || '');
  
  // Variants & Images
  const [hasVariants, setHasVariants] = useState(product?.hasVariants || false);
  const [variants, setVariants] = useState<any[]>(product?.variants || []);
  const [productImages, setProductImages] = useState<string[]>(product?.images || []);

  // Auto-convert to USD when base currency or prices change
  useEffect(() => {
    if (baseCostPrice && baseCurrency) {
      const rate = EXCHANGE_RATES[baseCurrency] || 1;
      const usdCost = parseFloat(baseCostPrice) / rate;
      setUsdCostPrice(usdCost);
    }
  }, [baseCostPrice, baseCurrency]);

  useEffect(() => {
    if (baseSellingPrice && baseCurrency) {
      const rate = EXCHANGE_RATES[baseCurrency] || 1;
      const usdSelling = parseFloat(baseSellingPrice) / rate;
      setUsdSellingPrice(usdSelling);
    }
  }, [baseSellingPrice, baseCurrency]);

  // Auto-calculate profit margin
  useEffect(() => {
    if (usdCostPrice > 0 && usdSellingPrice > 0) {
      const margin = ((usdSellingPrice - usdCostPrice) / usdSellingPrice) * 100;
      setProfitMargin(margin);
    }
  }, [usdCostPrice, usdSellingPrice]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { name: '', sku: '', price: '', stock: '' },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Validation for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        if (!productName.trim()) {
          toast.error('Product name is required');
          return false;
        }
        if (!brandName.trim()) {
          toast.error('Brand name is required');
          return false;
        }
        if (!sku.trim()) {
          toast.error('SKU is required');
          return false;
        }
        return true;

      case 2: // Pricing & Stock
        if (!baseCostPrice || parseFloat(baseCostPrice) <= 0) {
          toast.error('Valid cost price is required');
          return false;
        }
        if (!baseSellingPrice || parseFloat(baseSellingPrice) <= 0) {
          toast.error('Valid selling price is required');
          return false;
        }
        if (!stock || parseInt(stock) < 0) {
          toast.error('Valid stock quantity is required');
          return false;
        }
        if (!moq || parseInt(moq) <= 0) {
          toast.error('Valid MOQ is required');
          return false;
        }
        if (!stockAlertThreshold || parseInt(stockAlertThreshold) < 0) {
          toast.error('Valid stock alert threshold is required');
          return false;
        }
        return true;

      case 3: // Classification
        if (!category) {
          toast.error('Category is required');
          return false;
        }
        if (!warrantyPeriod) {
          toast.error('Warranty period is required');
          return false;
        }
        if (!leadTime) {
          toast.error('Lead time is required');
          return false;
        }
        return true;

      case 4: // Shipping
        if (!weight || parseFloat(weight) <= 0) {
          toast.error('Valid weight is required');
          return false;
        }
        if (!length || parseFloat(length) <= 0) {
          toast.error('Valid length is required');
          return false;
        }
        if (!width || parseFloat(width) <= 0) {
          toast.error('Valid width is required');
          return false;
        }
        if (!height || parseFloat(height) <= 0) {
          toast.error('Valid height is required');
          return false;
        }
        return true;

      case 5: // Media & Variants
        // Optional step - no validation required
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submission
    for (let i = 1; i <= 5; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const productData = {
      productName,
      description,
      brandName,
      sku,
      barcode,
      productStatus,
      baseCurrency,
      baseCostPrice: parseFloat(baseCostPrice),
      baseSellingPrice: parseFloat(baseSellingPrice),
      usdCostPrice,
      usdSellingPrice,
      profitMargin,
      stock: parseInt(stock),
      moq: parseInt(moq),
      stockAlertThreshold: parseInt(stockAlertThreshold),
      category,
      subcategory,
      tags,
      productCondition,
      warrantyPeriod,
      leadTime,
      weight: parseFloat(weight),
      weightUnit,
      dimensions: {
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        unit: dimensionUnit,
      },
      shippingCost: shippingCost ? parseFloat(shippingCost) : 0,
      hasVariants,
      variants,
      productImages,
    };
    
    console.log('Product Data:', productData);
    toast.success(product ? 'Product updated successfully!' : 'Product added successfully!');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={onClose}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {product 
            ? 'Update your product details below'
            : 'Complete all steps to create your product'
          }
        </p>
      </motion.div>

      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          {/* Desktop Stepper */}
          <div className="hidden md:flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300',
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                          : isActive
                          ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-sm font-semibold mb-1',
                        isActive
                          ? 'text-purple-600 dark:text-purple-400'
                          : isCompleted
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-slate-400'
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      {step.description}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-1 mx-4 mb-12">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          currentStep > step.number
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-800'
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Stepper */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">
                Step {currentStep} of {STEPS.length}
              </p>
              <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                {Math.round((currentStep / STEPS.length) * 100)}%
              </Badge>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600"
              />
            </div>
            <div className="mt-4">
              <p className="font-semibold text-purple-600 dark:text-purple-400">
                {STEPS[currentStep - 1].title}
              </p>
              <p className="text-sm text-muted-foreground">
                {STEPS[currentStep - 1].description}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8"
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 pb-3 border-b">
                <Package className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-bold">Basic Information</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product features, specifications, and benefits..."
                    className="min-h-[120px]"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">
                      Brand Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="brandName"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g., Sony"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">
                      SKU <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sku"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g., WBH-2024-001"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode / UPC</Label>
                    <Input
                      id="barcode"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="e.g., 123456789012"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productStatus">
                      Product Status <span className="text-red-500">*</span>
                    </Label>
                    <Select value={productStatus} onValueChange={setProductStatus}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Pricing & Stock */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 pb-3 border-b">
                <DollarSign className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold">Pricing & Inventory</h3>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                    Multi-Currency Support
                  </p>
                  <p className="text-blue-600 dark:text-blue-300">
                    Enter prices in your local currency. They will be automatically converted to USD for the platform.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="baseCurrency">
                    Base Currency <span className="text-red-500">*</span>
                  </Label>
                  <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                      <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                      <SelectItem value="CNY">🇨🇳 CNY - Chinese Yuan</SelectItem>
                      <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
                      <SelectItem value="JPY">🇯🇵 JPY - Japanese Yen</SelectItem>
                      <SelectItem value="AUD">🇦🇺 AUD - Australian Dollar</SelectItem>
                      <SelectItem value="CAD">🇨🇦 CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="PKR">🇵🇰 PKR - Pakistani Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseCostPrice">
                      Cost Price ({baseCurrency}) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="baseCostPrice"
                      type="number"
                      step="0.01"
                      value={baseCostPrice}
                      onChange={(e) => setBaseCostPrice(e.target.value)}
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseSellingPrice">
                      Selling Price ({baseCurrency}) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="baseSellingPrice"
                      type="number"
                      step="0.01"
                      value={baseSellingPrice}
                      onChange={(e) => setBaseSellingPrice(e.target.value)}
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>
                </div>

                {/* USD Conversion Display */}
                {baseCostPrice && baseSellingPrice && (
                  <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-purple-500" />
                      <h4 className="font-semibold">Converted to USD (Platform Currency)</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Cost Price (USD)</p>
                        <p className="text-xl font-bold text-purple-600">${usdCostPrice.toFixed(2)}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Selling Price (USD)</p>
                        <p className="text-xl font-bold text-cyan-600">${usdSellingPrice.toFixed(2)}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
                        <p className={cn(
                          "text-xl font-bold",
                          profitMargin > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {profitMargin.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Exchange Rate: 1 USD = {EXCHANGE_RATES[baseCurrency]?.toFixed(2)} {baseCurrency}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5 text-yellow-500" />
                    Stock Management
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">
                        Available Stock <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="100"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moq">
                        MOQ <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="moq"
                        type="number"
                        value={moq}
                        onChange={(e) => setMoq(e.target.value)}
                        placeholder="10"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stockAlert">
                        Alert Threshold <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="stockAlert"
                        type="number"
                        value={stockAlertThreshold}
                        onChange={(e) => setStockAlertThreshold(e.target.value)}
                        placeholder="20"
                        className="h-11"
                      />
                    </div>
                  </div>

                  {stockAlertThreshold && stock && parseInt(stock) <= parseInt(stockAlertThreshold) && (
                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                          Low Stock Warning
                        </p>
                        <p className="text-yellow-600 dark:text-yellow-300">
                          Current stock ({stock}) is at or below the alert threshold ({stockAlertThreshold})
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Classification & Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 pb-3 border-b">
                <Layers className="w-6 h-6 text-cyan-500" />
                <h3 className="text-xl font-bold">Classification & Details</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="home">Home & Kitchen</SelectItem>
                        <SelectItem value="sports">Sports & Fitness</SelectItem>
                        <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                        <SelectItem value="toys">Toys & Games</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="books">Books & Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={subcategory} onValueChange={setSubcategory}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="wearables">Wearables</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="chargers">Chargers & Cables</SelectItem>
                        <SelectItem value="storage">Storage Devices</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Product Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tags (e.g., wireless, bluetooth)"
                      className="h-11"
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-indigo-500" />
                    Product Details
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="condition">
                        Condition <span className="text-red-500">*</span>
                      </Label>
                      <Select value={productCondition} onValueChange={setProductCondition}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="refurbished">Refurbished</SelectItem>
                          <SelectItem value="used">Used - Like New</SelectItem>
                          <SelectItem value="used-good">Used - Good</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warranty">
                        Warranty Period <span className="text-red-500">*</span>
                      </Label>
                      <Select value={warrantyPeriod} onValueChange={setWarrantyPeriod}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select warranty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-warranty">No Warranty</SelectItem>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="2-years">2 Years</SelectItem>
                          <SelectItem value="3-years">3 Years</SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadTime">
                        Lead Time <span className="text-red-500">*</span>
                      </Label>
                      <Select value={leadTime} onValueChange={setLeadTime}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select lead time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3-days">1-3 Business Days</SelectItem>
                          <SelectItem value="3-5-days">3-5 Business Days</SelectItem>
                          <SelectItem value="5-7-days">5-7 Business Days</SelectItem>
                          <SelectItem value="7-14-days">7-14 Business Days</SelectItem>
                          <SelectItem value="14-30-days">14-30 Business Days</SelectItem>
                          <SelectItem value="30-plus-days">30+ Business Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Shipping Information */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 pb-3 border-b">
                <Truck className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold">Shipping Information</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">
                      Weight <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="0.00"
                        className="h-11 flex-1"
                      />
                      <Select value={weightUnit} onValueChange={setWeightUnit}>
                        <SelectTrigger className="h-11 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="lb">lb</SelectItem>
                          <SelectItem value="oz">oz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Dimension Unit</Label>
                    <Select value={dimensionUnit} onValueChange={setDimensionUnit}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="in">Inches (in)</SelectItem>
                        <SelectItem value="m">Meters (m)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">
                      Length ({dimensionUnit}) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.01"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">
                      Width ({dimensionUnit}) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.01"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">
                      Height ({dimensionUnit}) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCost">
                    Shipping Cost per Unit (USD) <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    placeholder="0.00"
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty if shipping cost varies by location or will be calculated separately
                  </p>
                </div>

                {/* Shipping Summary */}
                {weight && length && width && height && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Package Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Weight</p>
                        <p className="font-semibold">
                          {weight} {weightUnit}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dimensions (L×W×H)</p>
                        <p className="font-semibold">
                          {length} × {width} × {height} {dimensionUnit}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-semibold">
                          {(parseFloat(length) * parseFloat(width) * parseFloat(height)).toFixed(2)} {dimensionUnit}³
                        </p>
                      </div>
                      {shippingCost && (
                        <div>
                          <p className="text-muted-foreground">Shipping Cost</p>
                          <p className="font-semibold text-blue-600">
                            ${parseFloat(shippingCost).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Media & Variants */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 pb-3 border-b">
                <ImageIcon className="w-6 h-6 text-pink-500" />
                <h3 className="text-xl font-bold">Product Images & Variants</h3>
              </div>

              <div className="space-y-6">
                {/* Product Images */}
                <div className="space-y-3">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-semibold mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG up to 10MB (Maximum 5 images)
                    </p>
                  </div>
                  {productImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 mt-3">
                      {productImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Variants */}
                <div className="pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Product Variants</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Does this product have variants like size, color, etc.?
                      </p>
                    </div>
                    <Switch
                      checked={hasVariants}
                      onCheckedChange={setHasVariants}
                    />
                  </div>

                  {hasVariants && (
                    <div className="space-y-3">
                      <Button
                        type="button"
                        onClick={handleAddVariant}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variant
                      </Button>

                      {variants.map((variant, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-4 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs">Variant Name</Label>
                                <Input
                                  placeholder="e.g., Black/Large"
                                  className="h-9"
                                  value={variant.name}
                                  onChange={(e) => {
                                    const newVariants = [...variants];
                                    newVariants[index].name = e.target.value;
                                    setVariants(newVariants);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">SKU</Label>
                                <Input
                                  placeholder="Variant SKU"
                                  className="h-9"
                                  value={variant.sku}
                                  onChange={(e) => {
                                    const newVariants = [...variants];
                                    newVariants[index].sku = e.target.value;
                                    setVariants(newVariants);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Price</Label>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  className="h-9"
                                  value={variant.price}
                                  onChange={(e) => {
                                    const newVariants = [...variants];
                                    newVariants[index].price = e.target.value;
                                    setVariants(newVariants);
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Stock</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="h-9"
                                  value={variant.stock}
                                  onChange={(e) => {
                                    const newVariants = [...variants];
                                    newVariants[index].stock = e.target.value;
                                    setVariants(newVariants);
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveVariant(index)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-cyan-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-cyan-900/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-purple-600" />
                    Review & Submit
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Product Name</p>
                      <p className="font-semibold">{productName || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-semibold">{category || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold text-purple-600">
                        ${usdSellingPrice.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stock</p>
                      <p className="font-semibold">{stock || '0'} units</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="min-w-[120px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </div>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="min-w-[120px] bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {product ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          )}
        </div>
      </motion.form>
    </div>
  );
}