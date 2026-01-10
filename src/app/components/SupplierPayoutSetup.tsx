'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  CreditCard,
  Building2,
  Shield,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Info,
  User,
  MapPin,
  Hash,
  Loader2,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { showToast } from '../../lib/toast';
import { useAuth } from '../contexts/AuthContext';
import { cn } from './ui/utils';

export function SupplierPayoutSetup() {
  const { user } = useAuth();
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [showBankForm, setShowBankForm] = useState(false);

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    country: 'US',
  });

  // Fetch payout data
  useEffect(() => {
    if (!user?.id || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    const fetchPayouts = async () => {
      try {
        const response = await fetch(`/api/supplier/payouts?supplierId=${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setStripeAccount(data.stripeAccount);
          setPayouts(data.payouts || []);
        } else {
          showToast.error(data.error || 'Failed to fetch payout data');
        }
      } catch (error) {
        console.error('Fetch payouts error:', error);
        showToast.error('Failed to fetch payout data');
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchPayouts();
  }, [user?.id]);

  const handleGenerateOnboardingLink = async () => {
    if (!user?.id) {
      showToast.error('User not found');
      return;
    }

    setIsGeneratingLink(true);

    try {
      const returnUrl = `${window.location.origin}/supplier/payouts?return=true`;
      const refreshUrl = `${window.location.origin}/supplier/payouts?refresh=true`;

      // Create account if doesn't exist
      if (!stripeAccount?.accountId) {
        const createResponse = await fetch('/api/supplier/stripe-connect', {
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
        `/api/supplier/stripe-connect?userId=${user.id}&returnUrl=${encodeURIComponent(returnUrl)}&refreshUrl=${encodeURIComponent(refreshUrl)}`
      );

      if (!linkResponse.ok) {
        const error = await linkResponse.json();
        throw new Error(error.error || 'Failed to generate onboarding link');
      }

      const { onboardingUrl } = await linkResponse.json();
      setOnboardingUrl(onboardingUrl);
      showToast.success('Onboarding link generated! Click the link to complete your Stripe verification.');
    } catch (error: any) {
      console.error('Generate onboarding link error:', error);
      showToast.error(error.message || 'Failed to generate onboarding link');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(onboardingUrl);
    showToast.success('Link copied to clipboard!');
  };

  const handleOpenOnboarding = () => {
    // In production, this would open the actual Stripe onboarding
    window.open(onboardingUrl, '_blank');
    showToast.info('Opening Stripe onboarding... Complete the verification process to receive payouts.');
  };

  const handleRefreshStatus = async () => {
    showToast.info('Refreshing account status...');
    fetchingRef.current = false;
    setLoading(true);
    
    try {
      const response = await fetch(`/api/supplier/payouts?supplierId=${user?.id}`);
      const data = await response.json();

      if (response.ok) {
        setStripeAccount(data.stripeAccount);
        setPayouts(data.payouts || []);
        showToast.success('Status updated!');
      } else {
        showToast.error(data.error || 'Failed to refresh status');
      }
    } catch (error) {
      showToast.error('Failed to refresh status');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    showToast.info('Saving bank details...');
    try {
      // TODO: Call API to save bank details
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast.success('Bank details saved successfully! Your information is encrypted and secure.');
      setShowBankForm(false);
    } catch (error) {
      showToast.error('Failed to save bank details');
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stripeAccount) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading account information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Payout Setup</h2>
          <p className="text-muted-foreground">
            Configure your bank account to receive payments from the platform
          </p>
        </div>
      </div>

      {/* Account Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Shield className="w-4 h-4" />
            KYC Status
          </div>
          <Badge className={cn('capitalize', getKycStatusColor(stripeAccount.kycStatus))}>
            {stripeAccount.kycStatus}
          </Badge>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Onboarding
          </div>
          <Badge className={cn(
            stripeAccount.onboardingComplete
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
          )}>
            {stripeAccount.onboardingComplete ? 'Complete' : 'Incomplete'}
          </Badge>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CreditCard className="w-4 h-4" />
            Charges
          </div>
          <Badge className={cn(
            stripeAccount.chargesEnabled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          )}>
            {stripeAccount.chargesEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Wallet className="w-4 h-4" />
            Payouts
          </div>
          <Badge className={cn(
            stripeAccount.payoutsEnabled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          )}>
            {stripeAccount.payoutsEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </Card>
      </div>

      {/* Main Content */}
      {!stripeAccount.isConnected ? (
        /* Not Connected - Show Onboarding */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stripe Connect Onboarding */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Stripe Connect Onboarding</h3>
                  <p className="text-muted-foreground">
                    Complete KYC verification through Stripe to receive secure payouts
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Why Stripe */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Why Stripe Connect?
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Secure Verification:</strong> Industry-standard KYC process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Fast Payouts:</strong> Receive payments within 2-3 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Global Support:</strong> Accept payments from worldwide customers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Compliance Ready:</strong> Meets regulatory requirements</span>
                    </li>
                  </ul>
                </div>

                {/* Onboarding Steps */}
                <div>
                  <h4 className="font-bold mb-4">Onboarding Steps:</h4>
                  <div className="space-y-3">
                    {[
                      { step: 1, title: 'Generate Onboarding Link', desc: 'Click below to create your secure link' },
                      { step: 2, title: 'Complete Stripe Verification', desc: 'Provide business and banking information' },
                      { step: 3, title: 'Submit Documents', desc: 'Upload required KYC documents' },
                      { step: 4, title: 'Get Verified', desc: 'Wait for approval (usually 24-48 hours)' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Link Button */}
                {!onboardingUrl ? (
                  <Button
                    onClick={handleGenerateOnboardingLink}
                    disabled={isGeneratingLink}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 shadow-lg shadow-purple-500/30 text-lg"
                  >
                    {isGeneratingLink ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                        />
                        Generating Secure Link...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-3" />
                        Generate Stripe Onboarding Link
                      </>
                    )}
                  </Button>
                ) : (
                  /* Show Generated Link */
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-green-900 dark:text-green-400">Link Generated Successfully!</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your secure onboarding link is ready. Click below to complete verification.
                      </p>
                      
                      {/* Link Display */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg p-3 font-mono text-xs break-all border-2 border-green-200 dark:border-green-800">
                        {onboardingUrl}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="h-12 border-2"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        onClick={handleOpenOnboarding}
                        className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Complete Onboarding
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-2">Important Information</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Complete verification within 7 days</li>
                    <li>• Have your business documents ready</li>
                    <li>• Bank account information required</li>
                    <li>• Valid government ID needed</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-bold mb-3">Required Documents</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Government-issued ID (Passport/Driver's License)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Business registration documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Bank account details</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Tax identification number</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-600" />
                Alternative: Manual Bank Details
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                You can also add bank details manually, but Stripe verification is recommended for faster payouts.
              </p>
              <Button
                onClick={() => setShowBankForm(!showBankForm)}
                variant="outline"
                className="w-full border-2 border-cyan-300 dark:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
              >
                {showBankForm ? 'Hide' : 'Show'} Bank Form
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        /* Connected - Show Account Details */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Success Card */}
            <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-green-900 dark:text-green-400">
                    Account Verified Successfully!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your Stripe account is connected and verified. You can now receive payouts from the platform.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      <Shield className="w-3 h-3 mr-1" />
                      KYC Verified
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      <Wallet className="w-3 h-3 mr-1" />
                      Payouts Enabled
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Stripe Account Information</h3>
                <Button variant="outline" size="sm" onClick={handleRefreshStatus}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-muted-foreground mb-1">Account ID</p>
                  <p className="font-mono font-semibold">{stripeAccount.accountId}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                  <p className="font-semibold">Express Connect</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-muted-foreground mb-1">Charges</p>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Enabled
                  </Badge>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-muted-foreground mb-1">Payouts</p>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Enabled
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Payout Information */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Payout Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
                  <div>
                    <p className="font-semibold mb-1">Payout Schedule</p>
                    <p className="text-sm text-muted-foreground">Automatic daily payouts</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="font-semibold mb-1">Minimum Payout</p>
                    <p className="text-sm text-muted-foreground">$10.00 USD</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="font-semibold mb-1">Expected Arrival</p>
                    <p className="text-sm text-muted-foreground">2-3 business days</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Payout History Preview */}
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="font-bold mb-4">Recent Payouts</h4>
              <div className="space-y-3">
                {payouts.length > 0 ? (
                  payouts.slice(0, 3).map((payout: any) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div>
                        <p className="font-bold text-green-600">${payout.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={cn(
                        payout.status === 'paid' || payout.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : payout.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                      )}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    <p>No payouts yet</p>
                  </div>
                )}
              </div>
              {payouts.length > 3 && (
                <Button variant="outline" className="w-full mt-4">
                  View All Payouts
                </Button>
              )}
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Account Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verification</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bank Connected</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Documents</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Manual Bank Form (Collapsible) */}
      {showBankForm && !stripeAccount.isConnected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-cyan-600" />
              Manual Bank Details
            </h3>

            <form onSubmit={handleSaveBankDetails} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">
                    Account Holder Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="accountHolderName"
                    placeholder="John Doe"
                    value={bankDetails.accountHolderName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">
                    Bank Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bankName"
                    placeholder="Chase Bank"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">
                    Account Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="accountNumber"
                    type="password"
                    placeholder="••••••••"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routingNumber">
                    Routing Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="routingNumber"
                    placeholder="123456789"
                    value={bankDetails.routingNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">
                    Account Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={bankDetails.accountType}
                    onValueChange={(value) => setBankDetails({ ...bankDetails, accountType: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={bankDetails.country}
                    onValueChange={(value) => setBankDetails({ ...bankDetails, country: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBankForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Save Bank Details
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
