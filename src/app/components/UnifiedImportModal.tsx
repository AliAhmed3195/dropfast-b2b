'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  Store,
  X,
  DollarSign,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';
import { Button } from './ui/button';
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
import { toast } from 'sonner';
import { cn } from './ui/utils';

interface Product {
  id: number;
  name: string;
  sku: string;
  supplier: string;
  category: string;
  supplierPrice?: number;
  retailPrice?: number;
  moq?: number;
  stock: number;
  image: string;
  description: string;
  type: 'supplier' | 'own';
}

interface UnifiedImportModalProps {
  product: Product;
  onClose: () => void;
}

export function UnifiedImportModal({ product, onClose }: UnifiedImportModalProps) {
  const [importType, setImportType] = useState<'my-products' | 'my-products-store'>('my-products');
  
  const [importForm, setImportForm] = useState({
    storeId: '',
    sellingPrice: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  useEffect(() => {
    // Initialize form with product data
    setImportForm({
      storeId: '',
      sellingPrice: product.type === 'supplier' 
        ? (product.supplierPrice! * 1.5).toFixed(2) 
        : product.retailPrice!.toFixed(2),
      metaTitle: product.name,
      metaDescription: product.description,
      metaKeywords: product.category,
    });
  }, [product]);

  const handleSubmit = () => {
    // Validation
    if (importType === 'my-products-store') {
      if (!importForm.storeId) {
        toast.error('Please select a store');
        return;
      }
      if (!importForm.sellingPrice) {
        toast.error('Please enter a selling price');
        return;
      }

      if (product.type === 'supplier' && parseFloat(importForm.sellingPrice) <= product.supplierPrice!) {
        toast.error('Selling price must be higher than supplier price!');
        return;
      }

      toast.success('Product added successfully!', {
        description: 'Product has been added to My Products and your selected store.',
      });
    } else {
      toast.success('Product added to My Products!', {
        description: 'Product has been added to your catalog with SEO settings.',
      });
    }

    onClose();
  };

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
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {product.type === 'supplier' ? 'Import Product' : 'Add to Store'}
                </h3>
                <p className="text-purple-100">{product.name}</p>
                <p className="text-sm text-purple-200 mt-1">{product.sku}</p>
              </div>
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
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Product Info Summary */}
          <div className="grid grid-cols-3 gap-4">
            {product.type === 'supplier' && (
              <>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground mb-1">Supplier Price</p>
                  <p className="text-2xl font-bold text-blue-600">${product.supplierPrice}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-muted-foreground mb-1">Min Order Qty</p>
                  <p className="text-2xl font-bold text-orange-600">{product.moq}</p>
                </div>
              </>
            )}
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
              <p className="text-sm text-muted-foreground mb-1">Available Stock</p>
              <p className="text-2xl font-bold text-green-600">{product.stock}</p>
            </div>
          </div>

          {/* Product Description */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <h4 className="font-bold mb-2">Product Description</h4>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>

          {/* Import Type Selection */}
          <div className="space-y-4">
            <h4 className="font-bold">Choose Import Option:</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Option 1: Add to My Products */}
              <div
                onClick={() => setImportType('my-products')}
                className={cn(
                  "p-6 rounded-2xl border-2 cursor-pointer transition-all",
                  importType === 'my-products'
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg"
                    : "border-slate-300 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    importType === 'my-products'
                      ? "bg-gradient-to-br from-purple-500 to-pink-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  )}>
                    <Package className={cn(
                      "w-5 h-5",
                      importType === 'my-products' ? "text-white" : "text-slate-500"
                    )} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold">Add to My Products</h5>
                    {importType === 'my-products' && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600 absolute top-3 right-3" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Quick import to catalog
                </p>
              </div>

              {/* Option 2: Add to My Products + Store */}
              <div
                onClick={() => setImportType('my-products-store')}
                className={cn(
                  "p-6 rounded-2xl border-2 cursor-pointer transition-all relative",
                  importType === 'my-products-store'
                    ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 shadow-lg"
                    : "border-slate-300 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    importType === 'my-products-store'
                      ? "bg-gradient-to-br from-cyan-500 to-blue-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  )}>
                    <Store className={cn(
                      "w-5 h-5",
                      importType === 'my-products-store' ? "text-white" : "text-slate-500"
                    )} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold">Add to Products + Store</h5>
                    {importType === 'my-products-store' && (
                      <CheckCircle2 className="w-5 h-5 text-cyan-600 absolute top-3 right-3" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete setup with store
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Fields Based on Import Type */}
          <div className="space-y-4 border-t pt-6">
            {importType === 'my-products-store' && (
              <>
                {/* Select Store */}
                <div>
                  <Label className="text-base font-bold mb-2 block">
                    Select Store <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={importForm.storeId} 
                    onValueChange={(value) => setImportForm({ ...importForm, storeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a store" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store-1">TechHub Store</SelectItem>
                      <SelectItem value="store-2">ElectroMart</SelectItem>
                      <SelectItem value="store-3">GadgetZone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Selling Price */}
                <div>
                  <Label className="text-base font-bold mb-2 block">
                    Selling Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter selling price"
                      value={importForm.sellingPrice}
                      onChange={(e) => setImportForm({ ...importForm, sellingPrice: e.target.value })}
                      className="pl-10 text-lg font-semibold"
                    />
                  </div>
                  {product.type === 'supplier' && importForm.sellingPrice && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Profit Margin: <strong className="text-green-600">
                        {(((parseFloat(importForm.sellingPrice) - product.supplierPrice!) / parseFloat(importForm.sellingPrice)) * 100).toFixed(1)}%
                      </strong>
                    </p>
                  )}
                </div>
              </>
            )}

            {/* SEO Fields (Always Show) */}
            <div className="border-t pt-4">
              <h4 className="font-bold mb-4">SEO Optimization (Optional)</h4>
              
              <div className="space-y-4">
                <div>
                  <Label>Meta Title</Label>
                  <Input
                    placeholder="SEO optimized title"
                    value={importForm.metaTitle}
                    onChange={(e) => setImportForm({ ...importForm, metaTitle: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Meta Description</Label>
                  <Textarea
                    placeholder="SEO optimized description"
                    value={importForm.metaDescription}
                    onChange={(e) => setImportForm({ ...importForm, metaDescription: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Meta Keywords</Label>
                  <Input
                    placeholder="keyword1, keyword2, keyword3"
                    value={importForm.metaKeywords}
                    onChange={(e) => setImportForm({ ...importForm, metaKeywords: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {importType === 'my-products' ? 'Add to My Products' : 'Add to Products + Store'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
