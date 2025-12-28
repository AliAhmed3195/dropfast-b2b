'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Plus, Edit, Trash2, Search, ChevronLeft, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const colorOptions = [
  { value: 'purple', label: 'Purple', bg: 'bg-purple-500' },
  { value: 'blue', label: 'Blue', bg: 'bg-blue-500' },
  { value: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
  { value: 'red', label: 'Red', bg: 'bg-red-500' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-500' },
  { value: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { value: 'green', label: 'Green', bg: 'bg-green-500' },
  { value: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
];

export function AdminInventoryTags() {
  const router = useRouter();
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState('purple');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tags');
      const data = await response.json();
      
      if (response.ok) {
        setTags(data.tags || []);
      } else {
        toast.error(data.error || 'Failed to fetch tags');
      }
    } catch (error) {
      console.error('Fetch tags error:', error);
      toast.error('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTags();
        toast.success('Tag deleted successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete tag');
      }
    } catch (error) {
      console.error('Delete tag error:', error);
      toast.error('Failed to delete tag');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('tagName') as string;

    try {
      if (editingTag) {
        // Update tag
        const response = await fetch(`/api/admin/tags/${editingTag.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, color: selectedColor }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success('Tag updated successfully!');
          await fetchTags();
          setShowAddForm(false);
          setEditingTag(null);
          setSelectedColor('purple');
        } else {
          toast.error(data.error || 'Failed to update tag');
        }
      } else {
        // Create tag
        const response = await fetch('/api/admin/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, color: selectedColor }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success('Tag created successfully!');
          await fetchTags();
          setShowAddForm(false);
          setSelectedColor('purple');
        } else {
          toast.error(data.error || 'Failed to create tag');
        }
      }
    } catch (error) {
      console.error('Save tag error:', error);
      toast.error('Failed to save tag');
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTagColor = (color: string) => {
    // Handle hex colors or color names
    if (color?.startsWith('#')) {
      // If it's a hex color, use inline style
      return '';
    }
    
    switch (color) {
      case 'purple':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'blue':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cyan':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400';
      case 'red':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'orange':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'green':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/admin/inventory')}
          className="mb-4 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Inventory
        </Button>
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Tags
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage product tags and labels for better organization
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Tags</p>
              <p className="text-2xl font-bold">{tags.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Tagged Products</p>
              <p className="text-2xl font-bold">{tags.reduce((sum, t) => sum + (t.productCount || 0), 0)}</p>
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
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading tags...</p>
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredTags.map((tag, idx) => (
          <motion.div
            key={tag.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-4 hover:shadow-lg transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    className={`${getTagColor(tag.color)} text-sm px-3 py-1`}
                    style={tag.color?.startsWith('#') ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
                  >
                    {tag.name}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => {
                        setEditingTag(tag);
                        setSelectedColor(tag.color || 'purple');
                        setShowAddForm(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleDelete(tag.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-2 border-t">
                  <p className="text-2xl font-bold text-purple-600">{tag.productCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || editingTag) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => { setShowAddForm(false); setEditingTag(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingTag ? 'Edit Tag' : 'Add New Tag'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowAddForm(false); setEditingTag(null); }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="tagName">
                      Tag Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="tagName"
                      name="tagName"
                      defaultValue={editingTag?.name}
                      placeholder="e.g., Featured"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Color <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color.value)}
                          className={`h-12 rounded-lg ${color.bg} hover:scale-110 transition-transform flex items-center justify-center text-white font-semibold text-xs ${
                            selectedColor === color.value ? 'ring-4 ring-offset-2 ring-purple-500' : ''
                          }`}
                        >
                          {color.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => { setShowAddForm(false); setEditingTag(null); }} 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                    >
                      {editingTag ? 'Update' : 'Add'} Tag
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
