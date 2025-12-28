'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Grid3x3,
  Hash,
  FileText,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { showToast } from '../../lib/toast';
import { cn } from './ui/utils';

export function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const fetchingCategoriesRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls - check before setting
    if (fetchingCategoriesRef.current) {
      return;
    }

    let isMounted = true;
    fetchingCategoriesRef.current = true;

    const loadCategories = async () => {
      if (!isMounted) return;

      try {
        setLoading(true);
        // Global interceptor handles duplicate prevention and AbortController
        const response = await fetch('/api/admin/categories');
        const data = await response.json();
        
        if (isMounted && response.ok) {
          setCategories(data.categories || []);
        } else if (isMounted && !response.ok) {
          showToast.error(data.error || 'Failed to fetch categories');
        }
      } catch (error: any) {
        // AbortError is expected from global interceptor's duplicate prevention
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Fetch categories error:', error);
          showToast.error('Failed to fetch categories');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          fetchingCategoriesRef.current = false;
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
      fetchingCategoriesRef.current = false;
    };
  }, []);

  const fetchCategories = async () => {
    // Prevent duplicate calls
    if (fetchingCategoriesRef.current) {
      return;
    }

    let isMounted = true;
    fetchingCategoriesRef.current = true;

    try {
      setLoading(true);
      // Global interceptor handles duplicate prevention and AbortController
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      
      if (isMounted && response.ok) {
        setCategories(data.categories || []);
      } else if (isMounted && !response.ok) {
        showToast.error(data.error || 'Failed to fetch categories');
      }
    } catch (error: any) {
      // AbortError is expected from global interceptor's duplicate prevention
      if (error.name !== 'AbortError' && isMounted) {
      console.error('Fetch categories error:', error);
        showToast.error('Failed to fetch categories');
      }
    } finally {
      if (isMounted) {
      setLoading(false);
        fetchingCategoriesRef.current = false;
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
        showToast.success('Category deleted successfully!');
      } else {
        const data = await response.json();
        showToast.error(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      showToast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Category Management</h2>
              <p className="text-muted-foreground">
                Manage product categories for the platform
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Grid3x3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">
                    {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Categories</p>
                  <p className="text-2xl font-bold">{categories.filter(c => c.isActive !== false).length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Categories Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Category Name</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Display Order</TableHead>
                  <TableHead className="font-semibold">Products</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                        />
                        <p className="text-muted-foreground">Loading categories...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                          <Layers className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">No categories found</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {searchQuery
                              ? 'Try adjusting your search'
                              : 'No categories have been created yet. Click "Add Category" to create your first category.'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                          <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {category.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        #{category.displayOrder}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-purple-600">
                        {category.productCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </>
      ) : (
        <CategoryForm
          category={editingCategory}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          onSuccess={async () => {
            setShowForm(false);
            setEditingCategory(null);
            await fetchCategories();
            // Success toast is already shown in CategoryForm
          }}
        />
      )}
    </div>
  );
}

interface CategoryFormProps {
  category?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

function CategoryForm({ category, onCancel, onSuccess }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    displayOrder: category?.displayOrder || 0,
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

    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (formData.displayOrder < 0) newErrors.displayOrder = 'Display order must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const url = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories';
      const method = category ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          displayOrder: formData.displayOrder || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success(category ? 'Category updated successfully!' : 'Category created successfully!');
        onSuccess();
      } else {
        const errorMessage = data.error || 'Failed to save category';
        showToast.error(errorMessage);
        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error('Save category error:', error);
      const errorMessage = 'Failed to save category';
      showToast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories List
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            {category ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {category ? 'Update category information' : 'Create a new product category'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={cn(
                  'h-11 bg-slate-50 dark:bg-slate-800/50 border-2',
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                )}
                placeholder="e.g., Electronics"
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder" className="text-sm font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-500" />
                Display Order
              </Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={e => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                className={cn(
                  'h-11 bg-slate-50 dark:bg-slate-800/50 border-2',
                  errors.displayOrder ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                )}
                placeholder="0"
              />
              {errors.displayOrder && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.displayOrder}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" />
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              className="min-h-[120px] bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
              placeholder="Brief description of the category..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg shadow-purple-500/30"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  {category ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {category ? 'Update Category' : 'Create Category'}
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}