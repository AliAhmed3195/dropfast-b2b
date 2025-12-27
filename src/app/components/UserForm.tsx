'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Building2, FileText, Globe, DollarSign, MapPin, Phone, Calendar, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from './ui/utils';

interface UserFormProps {
  preSelectedRole?: 'supplier' | 'vendor' | 'customer';
  onCancel: () => void;
  onSuccess: () => void;
}

export function UserForm({ preSelectedRole, onCancel, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: preSelectedRole || 'customer',
    includeBusinessDetails: false,
    businessName: '',
    businessType: 'individual',
    registrationNumber: '',
    vatNumber: '',
    country: 'United States',
    currency: 'USD',
    streetAddress: '',
    city: '',
    stateProvince: '',
    addressCountry: 'United States',
    phoneNumber: '',
    dateOfBirth: '',
    // Supplier specific
    productCategories: '',
    shippingLocations: '',
    minimumOrderValue: '',
    // Vendor specific
    storeName: '',
    storeType: 'single',
    commissionRate: '15',
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

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.includeBusinessDetails) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.currency) newErrors.currency = 'Currency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onSuccess();
  };

  const businessTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'corporation', label: 'Corporation' },
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'China', 'Japan', 'Brazil'
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  ];

  const roles = [
    { value: 'supplier', label: 'Supplier', color: 'from-blue-500 to-blue-600' },
    { value: 'vendor', label: 'Vendor', color: 'from-cyan-500 to-cyan-600' },
    { value: 'customer', label: 'Customer', color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
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
            Back to {preSelectedRole ? `${preSelectedRole.charAt(0).toUpperCase()}${preSelectedRole.slice(1)}s` : 'Users'}
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            {preSelectedRole 
              ? `Add New ${preSelectedRole.charAt(0).toUpperCase()}${preSelectedRole.slice(1)}`
              : 'Add New User'
            }
          </h1>
          <p className="text-muted-foreground mt-2">
            {preSelectedRole 
              ? `Create a new ${preSelectedRole} account with business details`
              : 'Create a new user account'
            }
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-8"
        >
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={cn(
                    "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                    errors.fullName ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  )}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn(
                    "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                    errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  )}
                  placeholder="admin@fastdrop.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-500" />
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(
                    "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                    errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  )}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  Role <span className="text-red-500">*</span>
                </Label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={!!preSelectedRole}
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Business Information Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
              <input
                type="checkbox"
                id="includeBusinessDetails"
                checked={formData.includeBusinessDetails}
                onChange={(e) => handleInputChange('includeBusinessDetails', e.target.checked)}
                className="w-5 h-5 rounded border-2 border-blue-500 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <Label htmlFor="includeBusinessDetails" className="font-semibold text-sm cursor-pointer flex-1">
                Add Company Details (Optional)
              </Label>
            </div>

            {/* Business Information Section */}
            {formData.includeBusinessDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 pt-4"
              >
                <div className="flex items-center gap-2 pb-2 border-b-2 border-gradient-to-r from-purple-500 to-cyan-500">
                  <Building2 className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-lg">Business Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-semibold">
                      Business/Company Name {formData.includeBusinessDetails && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className={cn(
                        "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                        errors.businessName ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      )}
                      placeholder="Enter business name"
                    />
                    {errors.businessName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-sm font-semibold">
                      Business Type
                    </Label>
                    <select
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                    >
                      {businessTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-sm font-semibold">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vatNumber" className="text-sm font-semibold">
                      VAT/GST Number
                    </Label>
                    <Input
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      Country {formData.includeBusinessDetails && <span className="text-red-500">*</span>}
                    </Label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className={cn(
                        "w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-lg focus:ring-2 focus:ring-purple-500/20",
                        errors.country ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      Local Currency (UI Reference) {formData.includeBusinessDetails && <span className="text-red-500">*</span>}
                    </Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className={cn(
                        "w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-lg focus:ring-2 focus:ring-purple-500/20",
                        errors.currency ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      This currency will be used for UI display and profit calculator. All prices are stored in USD in the database.
                    </p>
                  </div>
                </div>

                {/* Business Address */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold">Business Address</h4>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streetAddress" className="text-sm font-semibold">
                      Street Address
                    </Label>
                    <Input
                      id="streetAddress"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                        placeholder="New York"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stateProvince" className="text-sm font-semibold">
                        State/Province
                      </Label>
                      <Input
                        id="stateProvince"
                        value={formData.stateProvince}
                        onChange={(e) => handleInputChange('stateProvince', e.target.value)}
                        className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressCountry" className="text-sm font-semibold">
                      Country
                    </Label>
                    <select
                      id="addressCountry"
                      value={formData.addressCountry}
                      onChange={(e) => handleInputChange('addressCountry', e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500/20"
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* KYC Verification */}
                <div className="space-y-4 pt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800/50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">KYC Verification</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Required for Stripe Connect and payout processing
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700"
                      >
                        Add KYC Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-500" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="h-11 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700"
                />
              </div>
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
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {preSelectedRole 
                    ? `Create ${preSelectedRole.charAt(0).toUpperCase()}${preSelectedRole.slice(1)}`
                    : 'Create User'
                  }
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}