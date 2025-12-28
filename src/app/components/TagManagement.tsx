'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Tag as TagIcon,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Palette,
  Hash,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
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

// Predefined color options
const colorOptions = [
  { name: 'Purple', value: '#9333ea', bgClass: 'bg-purple-100 dark:bg-purple-900/20', textClass: 'text-purple-700 dark:text-purple-400' },
  { name: 'Blue', value: '#3b82f6', bgClass: 'bg-blue-100 dark:bg-blue-900/20', textClass: 'text-blue-700 dark:text-blue-400' },
  { name: 'Cyan', value: '#06b6d4', bgClass: 'bg-cyan-100 dark:bg-cyan-900/20', textClass: 'text-cyan-700 dark:text-cyan-400' },
  { name: 'Green', value: '#10b981', bgClass: 'bg-green-100 dark:bg-green-900/20', textClass: 'text-green-700 dark:text-green-400' },
  { name: 'Yellow', value: '#f59e0b', bgClass: 'bg-yellow-100 dark:bg-yellow-900/20', textClass: 'text-yellow-700 dark:text-yellow-400' },
  { name: 'Red', value: '#ef4444', bgClass: 'bg-red-100 dark:bg-red-900/20', textClass: 'text-red-700 dark:text-red-400' },
  { name: 'Pink', value: '#ec4899', bgClass: 'bg-pink-100 dark:bg-pink-900/20', textClass: 'text-pink-700 dark:text-pink-400' },
  { name: 'Indigo', value: '#6366f1', bgClass: 'bg-indigo-100 dark:bg-indigo-900/20', textClass: 'text-indigo-700 dark:text-indigo-400' },
];

export function TagManagement() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const fetchingTagsRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls - check before setting
    if (fetchingTagsRef.current) {
      return;
    }

    let isMounted = true;
    fetchingTagsRef.current = true;

    const loadTags = async () => {
      if (!isMounted) return;

      try {
        setLoading(true);
        // Global interceptor handles duplicate prevention and AbortController
        const response = await fetch('/api/admin/tags');
        const data = await response.json();
        
        if (isMounted && response.ok) {
          const tagsArray = data.tags || [];
          setTags(tagsArray);
          // Ensure loading is set to false after setting tags
          setLoading(false);
        } else if (isMounted && !response.ok) {
          showToast.error(data.error || 'Failed to fetch tags');
          setLoading(false);
        }
      } catch (error: any) {
        // AbortError is expected from global interceptor's duplicate prevention
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Fetch tags error:', error);
          showToast.error('Failed to fetch tags');
          setLoading(false);
        }
      } finally {
        if (isMounted) {
          fetchingTagsRef.current = false;
        }
      }
    };

    loadTags();

    return () => {
      isMounted = false;
      fetchingTagsRef.current = false;
    };
  }, []);

  const fetchTags = async () => {
    // Prevent duplicate calls
    if (fetchingTagsRef.current) {
      return;
    }

    let isMounted = true;
    fetchingTagsRef.current = true;

    try {
      setLoading(true);
      // Global interceptor handles duplicate prevention and AbortController
      const response = await fetch('/api/admin/tags');
      const data = await response.json();
      
      if (isMounted && response.ok) {
        setTags(data.tags || []);
      } else if (isMounted && !response.ok) {
        showToast.error(data.error || 'Failed to fetch tags');
      }
    } catch (error: any) {
      // AbortError is expected from global interceptor's duplicate prevention
      if (error.name !== 'AbortError' && isMounted) {
        console.error('Fetch tags error:', error);
        showToast.error('Failed to fetch tags');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
        fetchingTagsRef.current = false;
      }
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingTag(null);
    setShowForm(true);
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTags();
        showToast.success('Tag deleted successfully!');
      } else {
        const data = await response.json();
        showToast.error(data.error || 'Failed to delete tag');
      }
    } catch (error) {
      console.error('Delete tag error:', error);
      showToast.error('Failed to delete tag');
    }
  };

  const getColorClasses = (color: string) => {
    const colorOption = colorOptions.find(opt => opt.value === color);
    return colorOption || colorOptions[0];
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Tag Management</h2>
              <p className="text-muted-foreground">
                Manage product tags like "Best Seller", "Featured", "New Arrival"
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <TagIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tags</p>
                  <p className="text-2xl font-bold">{tags.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tagged Products</p>
                  <p className="text-2xl font-bold">
                    {tags.reduce((sum, tag) => sum + (tag.productCount || 0), 0)}
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
                  <p className="text-sm text-muted-foreground">Active Tags</p>
                  <p className="text-2xl font-bold">{tags.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Tags Grid */}
          {loading ? (
            <Card className="p-12">
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                />
                <p className="text-muted-foreground">Loading tags...</p>
              </div>
            </Card>
          ) : (
            <>
              {filteredTags.length === 0 ? (
                <Card className="p-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                      <TagIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-lg">No tags found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery
                          ? 'Try adjusting your search or filters.'
                          : 'No tags have been created yet. Click "Add Tag" to create your first tag.'}
                      </p>
                    </div>
                    {!searchQuery && (
                      <Button
                        onClick={handleAddNew}
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white mt-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tag
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTags.map((tag, index) => {
                const colorClasses = getColorClasses(tag.color);
                return (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className={`${colorClasses.bgClass} ${colorClasses.textClass} text-sm px-3 py-1`}>
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag.name}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(tag)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Tag
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(tag.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Tag
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Color</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="font-mono text-xs">{tag.color}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Products</span>
                          <span className="font-semibold text-purple-600">{tag.productCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Created</span>
                          <span className="text-xs">{new Date(tag.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
              )}
            </>
          )}
        </>
      ) : (
        <TagForm
          tag={editingTag}
          onCancel={() => {
            setShowForm(false);
            setEditingTag(null);
          }}
          onSuccess={async () => {
            setShowForm(false);
            setEditingTag(null);
            await fetchTags();
            // Success toast is already shown in TagForm
          }}
        />
      )}
    </div>
  );
}

interface TagFormProps {
  tag?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

function TagForm({ tag, onCancel, onSuccess }: TagFormProps) {
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    color: tag?.color || colorOptions[0].value,
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
    if (!formData.name.trim()) newErrors.name = 'Tag name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const url = tag ? `/api/admin/tags/${tag.id}` : '/api/admin/tags';
      const method = tag ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          color: formData.color,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success(tag ? 'Tag updated successfully!' : 'Tag created successfully!');
        onSuccess();
      } else {
        const errorMessage = data.error || 'Failed to save tag';
        showToast.error(errorMessage);
        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error('Save tag error:', error);
      const errorMessage = 'Failed to save tag';
      showToast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedColor = colorOptions.find(opt => opt.value === formData.color) || colorOptions[0];

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
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
            Back to Tags List
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            {tag ? 'Edit Tag' : 'Add New Tag'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {tag ? 'Update tag information' : 'Create a new product tag'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-purple-500" />
              Tag Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className={cn(
                'h-11 bg-slate-50 dark:bg-slate-800/50 border-2',
                errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
              )}
              placeholder="e.g., Best Seller, Featured, New Arrival"
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-500" />
              Tag Color <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map(color => (
                <motion.button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all',
                    formData.color === color.value
                      ? 'border-purple-500 ring-4 ring-purple-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  )}
                >
                  <div
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-xs font-medium">{color.name}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Preview</Label>
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <Badge className={`${selectedColor.bgClass} ${selectedColor.textClass} text-base px-4 py-2`}>
                <TagIcon className="w-4 h-4 mr-2" />
                {formData.name || 'Tag Name'}
              </Badge>
            </div>
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
                  {tag ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {tag ? 'Update Tag' : 'Create Tag'}
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
