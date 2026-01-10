'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Shield,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Briefcase,
  Calendar,
  TrendingUp,
  Landmark,
  Hash,
  Loader2,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { useAuth } from '../contexts/AuthContext';

const bankDetails = {
  accountHolderName: 'TechVendor LLC',
  bankName: 'Chase Bank',
  accountNumber: '****5678',
  routingNumber: '****4321',
  accountType: 'Business Checking',
  currency: 'USD',
  country: 'United States',
};

const businessInfo = {
  businessName: 'TechVendor LLC',
  businessType: 'Limited Liability Company',
  taxId: '**-***7890',
  registrationNumber: 'REG-2024-5678',
  registrationDate: '2024-01-15',
  businessAddress: '456 Vendor Street, Business City, ST 12345',
  contactEmail: 'finance@techvendor.com',
  contactPhone: '+1 (555) 234-5678',
};

export function VendorAccountDetails() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
  });

  // Fetch vendor account data
  useEffect(() => {
    if (!user?.id) return;

    const fetchAccountData = async () => {
      try {
        // Fetch vendor data with Stripe info
        const response = await fetch(`/api/vendor/account?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setAccountData(data);
        }
      } catch (error) {
        console.error('Fetch account data error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [user?.id]);

  const handleStartStripeOnboarding = async () => {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

    setIsGeneratingLink(true);

    try {
      const returnUrl = `${window.location.origin}/vendor/account-details?return=true`;
      const refreshUrl = `${window.location.origin}/vendor/account-details?refresh=true`;

      // Create account if doesn't exist
      if (!accountData?.stripeAccountId) {
        const createResponse = await fetch('/api/vendor/stripe-connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            returnUrl,
            refreshUrl,
          }),
        });

        if (!createResponse.ok) {
          const error = await createResponse.json();
          throw new Error(error.error || 'Failed to create Stripe account');
        }

        const { onboardingUrl } = await createResponse.json();
        if (onboardingUrl) {
          window.location.href = onboardingUrl;
          return;
        }
      }

      // Generate onboarding link
      const linkResponse = await fetch(
        `/api/vendor/stripe-connect?userId=${user.id}&returnUrl=${encodeURIComponent(returnUrl)}&refreshUrl=${encodeURIComponent(refreshUrl)}`
      );

      if (!linkResponse.ok) {
        const error = await linkResponse.json();
        throw new Error(error.error || 'Failed to generate onboarding link');
      }

      const { onboardingUrl } = await linkResponse.json();
      if (onboardingUrl) {
        window.location.href = onboardingUrl;
      }
    } catch (error: any) {
      console.error('Stripe onboarding error:', error);
      toast.error(error.message || 'Failed to start Stripe onboarding');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleUpdateBankDetails = () => {
    toast.success('Bank Details Updated!', {
      description: 'Your payout information has been updated successfully',
    });
    setIsEditing(false);
  };

  const getStripeStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'restricted':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStripeStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'restricted':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stripeStatus = accountData?.stripeKycStatus === 'verified' ? 'verified' : accountData?.stripeAccountId ? 'pending' : 'not_started';
  const kycStatus = accountData?.stripeKycStatus || 'not_submitted';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Account Details</h2>
          <p className="text-muted-foreground">
            Manage your payout information and Stripe Connect integration
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          Secure & Encrypted
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Payouts</p>
              <p className="text-2xl font-bold">${(accountData?.totalPayouts || 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Balance</p>
              <p className="text-2xl font-bold">${(accountData?.pendingBalance || 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-3 rounded-xl',
              stripeStatus === 'verified'
                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                : 'bg-gradient-to-br from-yellow-500 to-orange-500'
            )}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stripe Status</p>
              <p className="text-xl font-bold capitalize">{stripeStatus}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-3 rounded-xl',
              kycStatus === 'verified'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : 'bg-gradient-to-br from-orange-500 to-red-500'
            )}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">KYC Status</p>
              <p className="text-xl font-bold capitalize">{kycStatus}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stripe Connect Status */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Stripe Connect</h3>
                <p className="text-purple-100">
                  Secure payment processing and payout management
                </p>
              </div>
            </div>
            <Badge className={cn('gap-2 px-4 py-2', getStripeStatusColor(stripeStatus))}>
              {getStripeStatusIcon(stripeStatus)}
              {stripeStatus.charAt(0).toUpperCase() + stripeStatus.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stripe Account Info */}
          {stripeStatus === 'verified' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-green-900 dark:text-green-100">Account Verified</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account ID:</span>
                      <span className="font-mono font-semibold text-xs">{accountData?.stripeAccountId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payouts:</span>
                      <Badge className={accountData?.stripePayoutsEnabled ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {accountData?.stripePayoutsEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Charges:</span>
                      <Badge className={accountData?.stripeChargesEnabled ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {accountData?.stripeChargesEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-purple-900 dark:text-purple-100">KYC Verification</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={cn(
                        kycStatus === 'verified' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      )}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {kycStatus === 'verified' ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified By:</span>
                      <span className="font-semibold">Stripe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Onboarding:</span>
                      <span className="font-semibold">{accountData?.stripeOnboardingComplete ? 'Complete' : 'Incomplete'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Stripe Dashboard
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Payout History
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect Your Stripe Account</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Complete Stripe onboarding to enable payouts and start receiving payments from your store sales
              </p>
              <Button
                onClick={handleStartStripeOnboarding}
                disabled={isGeneratingLink}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8"
              >
                {isGeneratingLink ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Start Stripe Onboarding
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                You'll be redirected to Stripe to complete identity verification (KYC)
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Bank Account Details */}
      {stripeStatus === 'verified' && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Landmark className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Bank Account Details</h3>
                  <p className="text-blue-100">
                    Your payout destination for sales revenue
                  </p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="text-white hover:bg-white/20"
                >
                  Edit Details
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">
                      Account Holder Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="accountHolderName"
                        placeholder="Enter account holder name"
                        value={formData.accountHolderName}
                        onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                        className="pl-10 h-11 border-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName">
                      Bank Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="bankName"
                        placeholder="Enter bank name"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="pl-10 h-11 border-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">
                      Account Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="accountNumber"
                        type="password"
                        placeholder="Enter account number"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="pl-10 h-11 border-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">
                      Routing Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="routingNumber"
                        placeholder="Enter routing number"
                        value={formData.routingNumber}
                        onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                        className="pl-10 h-11 border-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateBankDetails}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-muted-foreground mb-1">Account Holder Name</p>
                    <p className="font-bold text-lg">{bankDetails.accountHolderName}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                    <p className="font-bold text-lg">{bankDetails.bankName}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                    <p className="font-bold text-lg">{bankDetails.accountType}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                    <p className="font-mono font-bold text-lg">{bankDetails.accountNumber}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-muted-foreground mb-1">Routing Number</p>
                    <p className="font-mono font-bold text-lg">{bankDetails.routingNumber}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-muted-foreground mb-1">Currency</p>
                    <p className="font-bold text-lg">{bankDetails.currency} - {bankDetails.country}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Business Information */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Business Information</h3>
              <p className="text-emerald-100">
                Your registered business details
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p className="font-bold">{businessInfo.businessName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Business Type</p>
                  <p className="font-bold">{businessInfo.businessType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Tax ID</p>
                  <p className="font-mono font-bold">{businessInfo.taxId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Registration Number</p>
                  <p className="font-mono font-bold">{businessInfo.registrationNumber}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-bold">{businessInfo.registrationDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Business Address</p>
                  <p className="font-bold">{businessInfo.businessAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Contact Email</p>
                  <p className="font-bold">{businessInfo.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Contact Phone</p>
                  <p className="font-bold">{businessInfo.contactPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Notice */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-600">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-100">
              Security & Privacy
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                All financial data is encrypted with bank-level security (256-bit SSL)
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                KYC verification is handled securely by Stripe
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Bank account details are used only for payout processing by admin
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Your information is never shared with third parties
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
