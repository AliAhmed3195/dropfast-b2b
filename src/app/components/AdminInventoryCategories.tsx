import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Plus, Edit, Trash2, Search, ChevronLeft, X, Package } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useNavigation } from '../contexts/NavigationContext';

const mockCategories = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets', productCount: 156, subcategories: ['Audio', 'Gaming', 'Wearables'] },
  { id: '2', name: 'Furniture', description: 'Home and office furniture', productCount: 45, subcategories: ['Office', 'Bedroom', 'Living Room'] },
  { id: '3', name: 'Accessories', description: 'Various accessories', productCount: 89, subcategories: ['Charging', 'Cables', 'Cases'] },
  { id: '4', name: 'Office', description: 'Office supplies', productCount: 67, subcategories: ['Stationery', 'Storage', 'Desk'] },
];

export function AdminInventoryCategories() {
  const { setView } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const filteredCategories = mockCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => setView('inventory')}
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
            Categories
          </h2>
          <p className="text-muted-foreground mt-1">
            Organize products into categories and subcategories
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Categories</p>
              <p className="text-2xl font-bold">{mockCategories.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Products</p>
              <p className="text-2xl font-bold">{mockCategories.reduce((sum, c) => sum + c.productCount, 0)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Subcategories</p>
              <p className="text-2xl font-bold">{mockCategories.reduce((sum, c) => sum + c.subcategories.length, 0)}</p>
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => setEditingCategory(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toast.success('Category deleted')}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{category.productCount}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{category.subcategories.length}</p>
                  <p className="text-xs text-muted-foreground">Subcategories</p>
                </div>
              </div>

              {category.subcategories.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.subcategories.map(sub => (
                    <Badge key={sub} variant="outline" className="text-xs">
                      {sub}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || editingCategory) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => { setShowAddForm(false); setEditingCategory(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowAddForm(false); setEditingCategory(null); }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  toast.success(editingCategory ? 'Category updated!' : 'Category added!');
                  setShowAddForm(false);
                  setEditingCategory(null);
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">
                      Category Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="categoryName"
                      defaultValue={editingCategory?.name}
                      placeholder="e.g., Electronics"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      defaultValue={editingCategory?.description}
                      placeholder="Describe this category..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategories">Subcategories (comma separated)</Label>
                    <Input
                      id="subcategories"
                      defaultValue={editingCategory?.subcategories.join(', ')}
                      placeholder="Audio, Gaming, Wearables"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingCategory(null); }} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                      {editingCategory ? 'Update' : 'Add'} Category
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
