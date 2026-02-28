'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { User, Mail, Lock, Building2, Phone, Calendar, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '../../src/app/components/ui/button'
import { Input } from '../../src/app/components/ui/input'
import { Label } from '../../src/app/components/ui/label'
import { showToast } from '../../src/lib/toast'
import { cn } from '../../src/app/components/ui/utils'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref') ?? ''

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    includeBusinessDetails: false,
    businessName: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.fullName.trim()) next.fullName = 'Full name is required'
    if (!formData.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Invalid email'
    if (!formData.password || formData.password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: 'supplier',
          phoneNumber: formData.phoneNumber.trim() || null,
          dateOfBirth: formData.dateOfBirth.trim() || null,
          businessName: formData.includeBusinessDetails ? (formData.businessName.trim() || null) : null,
          referralCode: refCode || undefined,
          ref: refCode || undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrors({ submit: data.error || 'Sign up failed' })
        showToast.error(data.error || 'Sign up failed')
        setIsSubmitting(false)
        return
      }

      showToast.success('Account created! You can log in now.')
      router.push('/?signedup=1')
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' })
      showToast.error('Something went wrong')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] bg-indigo-500/5 rounded-full filter blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
            <h1 className="text-2xl font-bold mb-1 text-primary">Add New Supplier</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Create a new supplier account with business details
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                    className="mt-1"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@company.com"
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Min 6 characters"
                    className="mt-1"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Role *
                  </Label>
                  <Input
                    readOnly
                    value="Supplier"
                    className="mt-1 bg-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeBusinessDetails"
                  checked={formData.includeBusinessDetails}
                  onChange={(e) => handleChange('includeBusinessDetails', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="includeBusinessDetails" className="font-normal cursor-pointer">
                  Add Company Details (Optional)
                </Label>
              </div>

              {formData.includeBusinessDetails && (
                <div>
                  <Label htmlFor="businessName" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Business / Company name
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="Company name"
                    className="mt-1"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="mt-1"
                  />
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.submit}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => router.push('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-primary-foreground'
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Create Supplier
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link href="/" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
