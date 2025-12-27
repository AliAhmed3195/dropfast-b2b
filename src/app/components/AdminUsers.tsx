import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  Mail,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  Building2,
  MapPin,
  Phone,
  Shield,
  Briefcase,
  X,
} from 'lucide-react';
import { SimpleUserForm } from './SimpleUserForm';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
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
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// Mock user data - Admin internal users
const adminUsers = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    email: 'admin@fastdrop.com',
    role: 'admin',
    userType: 'admin',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '2024-12-24',
    createdBy: 'System',
    organization: 'FastDrop Platform',
  },
  {
    id: 'admin-2',
    name: 'Finance Manager',
    email: 'finance@fastdrop.com',
    role: 'admin',
    userType: 'admin',
    status: 'active',
    joinedDate: '2024-02-01',
    lastActive: '2024-12-23',
    createdBy: 'Super Admin',
    organization: 'FastDrop Platform',
  },
  {
    id: 'admin-3',
    name: 'Support Manager',
    email: 'support@fastdrop.com',
    role: 'admin',
    userType: 'admin',
    status: 'active',
    joinedDate: '2024-02-15',
    lastActive: '2024-12-24',
    createdBy: 'Super Admin',
    organization: 'FastDrop Platform',
  },
];

// Mock supplier users - Created by suppliers to manage their systems
const supplierUsers = [
  {
    id: 'sup-user-1',
    name: 'Tech Supply Manager',
    email: 'manager@techsupply.com',
    role: 'supplier',
    userType: 'supplier',
    status: 'active',
    joinedDate: '2024-03-10',
    lastActive: '2024-12-24',
    createdBy: 'Tech Supply Co.',
    organization: 'Tech Supply Co.',
    permissions: ['product-management', 'inventory', 'analytics'],
  },
  {
    id: 'sup-user-2',
    name: 'Tech Supply Inventory Lead',
    email: 'inventory@techsupply.com',
    role: 'supplier',
    userType: 'supplier',
    status: 'active',
    joinedDate: '2024-03-15',
    lastActive: '2024-12-23',
    createdBy: 'Tech Supply Co.',
    organization: 'Tech Supply Co.',
    permissions: ['inventory', 'orders'],
  },
  {
    id: 'sup-user-3',
    name: 'Global Electronics Manager',
    email: 'ops@globalelec.com',
    role: 'supplier',
    userType: 'supplier',
    status: 'active',
    joinedDate: '2024-04-20',
    lastActive: '2024-12-24',
    createdBy: 'Global Electronics',
    organization: 'Global Electronics',
    permissions: ['product-management', 'orders', 'analytics'],
  },
  {
    id: 'sup-user-4',
    name: 'Global Electronics Support',
    email: 'support@globalelec.com',
    role: 'supplier',
    userType: 'supplier',
    status: 'active',
    joinedDate: '2024-05-01',
    lastActive: '2024-12-22',
    createdBy: 'Global Electronics',
    organization: 'Global Electronics',
    permissions: ['orders', 'customer-support'],
  },
];

// Mock vendor users - Created by vendors to manage their stores
const vendorUsers = [
  {
    id: 'ven-user-1',
    name: 'TechGear Store Manager',
    email: 'manager@techgear.com',
    role: 'vendor',
    userType: 'vendor',
    status: 'active',
    joinedDate: '2024-05-15',
    lastActive: '2024-12-24',
    createdBy: 'Tech Haven Store',
    organization: 'Tech Haven Store',
    permissions: ['store-management', 'products', 'orders'],
  },
  {
    id: 'ven-user-2',
    name: 'TechGear Sales Manager',
    email: 'sales@techgear.com',
    role: 'vendor',
    userType: 'vendor',
    status: 'active',
    joinedDate: '2024-05-20',
    lastActive: '2024-12-23',
    createdBy: 'Tech Haven Store',
    organization: 'Tech Haven Store',
    permissions: ['orders', 'customer-support', 'analytics'],
  },
  {
    id: 'ven-user-3',
    name: 'Fashion Hub Operations',
    email: 'ops@fashionhub.com',
    role: 'vendor',
    userType: 'vendor',
    status: 'active',
    joinedDate: '2024-06-10',
    lastActive: '2024-12-24',
    createdBy: 'Fashion Hub',
    organization: 'Fashion Hub',
    permissions: ['products', 'inventory', 'orders'],
  },
  {
    id: 'ven-user-4',
    name: 'Fashion Hub Customer Service',
    email: 'cs@fashionhub.com',
    role: 'vendor',
    userType: 'vendor',
    status: 'active',
    joinedDate: '2024-06-15',
    lastActive: '2024-12-23',
    createdBy: 'Fashion Hub',
    organization: 'Fashion Hub',
    permissions: ['orders', 'customer-support'],
  },
];

const allUsers = [...adminUsers, ...supplierUsers, ...vendorUsers];

export function AdminUsers() {
  const [users, setUsers] = useState(allUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'admin' | 'supplier' | 'vendor'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleFormSuccess = () => {
    setShowForm(false);
    toast.success('User created successfully!');
  };

  const handleSaveUser = (updatedUser: any) => {
    setUsers(prev =>
      prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
    setEditingUser(null);
    toast.success('User updated successfully!');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin':
        return Shield;
      case 'supplier':
        return Package;
      case 'vendor':
        return Store;
      default:
        return Users;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'supplier':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'vendor':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const stats = {
    total: allUsers.length,
    admin: adminUsers.length,
    supplier: supplierUsers.length,
    vendor: vendorUsers.length,
  };

  // If form is showing, render it instead of the list
  if (showForm) {
    return (
      <SimpleUserForm
        onCancel={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">User Management</h2>
          <p className="text-muted-foreground">
            Manage platform users, supplier teams, and vendor staff
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white" 
          onClick={() => setShowForm(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card 
          className={cn(
            'p-6 cursor-pointer transition-all border-2',
            userTypeFilter === 'admin' 
              ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
              : 'hover:border-purple-300'
          )}
          onClick={() => setUserTypeFilter(userTypeFilter === 'admin' ? 'all' : 'admin')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin Users</p>
              <p className="text-2xl font-bold">{stats.admin}</p>
            </div>
          </div>
        </Card>

        <Card 
          className={cn(
            'p-6 cursor-pointer transition-all border-2',
            userTypeFilter === 'supplier' 
              ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
              : 'hover:border-blue-300'
          )}
          onClick={() => setUserTypeFilter(userTypeFilter === 'supplier' ? 'all' : 'supplier')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supplier Users</p>
              <p className="text-2xl font-bold">{stats.supplier}</p>
            </div>
          </div>
        </Card>

        <Card 
          className={cn(
            'p-6 cursor-pointer transition-all border-2',
            userTypeFilter === 'vendor' 
              ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' 
              : 'hover:border-cyan-300'
          )}
          onClick={() => setUserTypeFilter(userTypeFilter === 'vendor' ? 'all' : 'vendor')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vendor Users</p>
              <p className="text-2xl font-bold">{stats.vendor}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Filter Info */}
      {userTypeFilter !== 'all' && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={getUserTypeColor(userTypeFilter)}>
                {userTypeFilter.charAt(0).toUpperCase() + userTypeFilter.slice(1)} Users Only
              </Badge>
              <p className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} {userTypeFilter} user{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setUserTypeFilter('all')}
            >
              Clear Filter
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or organization..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={userTypeFilter} onValueChange={(value: any) => setUserTypeFilter(value)}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All User Types</SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Admin Users
                </div>
              </SelectItem>
              <SelectItem value="supplier">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Supplier Users
                </div>
              </SelectItem>
              <SelectItem value="vendor">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-cyan-600" />
                  Vendor Users
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Organization</TableHead>
              <TableHead className="font-semibold">Created By</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Joined</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => {
              const UserTypeIcon = getUserTypeIcon(user.userType);

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUserTypeColor(user.userType)}>
                      <UserTypeIcon className="w-3 h-3 mr-1" />
                      {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{user.organization}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{user.createdBy}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }
                    >
                      {user.status === 'active' ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Ban className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.success('View user details')}>
                          <Users className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">No users found</p>
          </div>
        )}
      </Card>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveUser}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onSave, onToggleStatus }: any) {
  const [formData, setFormData] = useState(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Edit User</h2>
              <p className="text-sm text-muted-foreground">Update user information</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-name" className="block text-sm font-semibold mb-2">
                    Name
                  </label>
                  <Input
                    id="user-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="user-email" className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <Input
                    id="user-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-organization" className="block text-sm font-semibold mb-2">
                    Organization
                  </label>
                  <Input
                    id="user-organization"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="user-type" className="block text-sm font-semibold mb-2">
                    User Type
                  </label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => setFormData({ ...formData, userType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="font-semibold">Account Status</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.status === 'active' ? 'User is active' : 'User is suspended'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant={formData.status === 'active' ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => {
                    const newStatus = formData.status === 'active' ? 'inactive' : 'active';
                    setFormData({ ...formData, status: newStatus });
                    onToggleStatus(formData.id);
                  }}
                >
                  {formData.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </>
  );
}