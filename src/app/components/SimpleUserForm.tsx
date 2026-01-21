'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Phone, Calendar, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from './ui/utils';
import { showToast } from '../../lib/toast';
import { validatePhoneNumber, cleanPhoneNumber, formatPhoneNumber, allowOnlyDigits } from '../../lib/phone-validation';

interface SimpleUserFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export function SimpleUserForm({ onCancel, onSuccess }: SimpleUserFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'admin',
    phoneNumber: '',
    dateOfBirth: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    // Phone number validation on input
    if (field === 'phoneNumber') {
      // Allow only digits
      const digitsOnly = allowOnlyDigits(value);
      
      // Format the phone number
      const formatted = formatPhoneNumber(digitsOnly);
      
      // Validate if there are digits
      if (digitsOnly) {
        const validation = validatePhoneNumber(digitsOnly);
        if (!validation.isValid && validation.error) {
          setErrors(prev => ({ ...prev, phoneNumber: validation.error }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.phoneNumber;
            return newErrors;
          });
        }
      } else {
        // Clear error if field is empty
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.phoneNumber;
          return newErrors;
        });
      }
      
      // Store formatted phone number for display
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    // Phone number validation
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneValidation = validatePhoneNumber(formData.phoneNumber);
      if (!phoneValidation.isValid && phoneValidation.error) {
        newErrors.phoneNumber = phoneValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Clean phone number before sending
      const cleanedPhone = formData.phoneNumber ? cleanPhoneNumber(formData.phoneNumber) : null;

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role.toUpperCase(),
          phone: cleanedPhone || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success('User created successfully!');
        onSuccess();
      } else {
        const errorMessage = data.error || 'Failed to create user';
        setErrors({ submit: errorMessage });
        showToast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Create user error:', error);
      const errorMessage = error.message || 'Failed to create user';
      setErrors({ submit: errorMessage });
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { value: 'admin', label: 'Admin', color: 'from-purple-500 to-purple-600' },
  ];

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
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Add New User
          </h1>
          <p className="text-muted-foreground mt-2">Create a new user account with basic information</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6"
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
                  placeholder="user@fastdrop.com"
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={cn(
                      "h-11 bg-slate-50 dark:bg-slate-800/50 border-2 pr-10",
                      errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                    )}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-purple-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                <div className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-lg flex items-center">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Admin</span>
                </div>
                <input
                  type="hidden"
                  value={formData.role}
                />
              </div>
            </div>

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
                  onKeyDown={(e) => {
                    // Allow: backspace, delete, tab, escape, enter, and numbers
                    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true) ||
                      // Allow: home, end, left, right
                      (e.keyCode >= 35 && e.keyCode <= 39)) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                      e.preventDefault();
                    }
                  }}
                  className={cn(
                    "h-11 bg-slate-50 dark:bg-slate-800/50 border-2",
                    errors.phoneNumber ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  )}
                  placeholder="12345678901"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phoneNumber}
                  </p>
                )}
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

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}

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
                  <CheckCircle2 className="w-4 h-4" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
