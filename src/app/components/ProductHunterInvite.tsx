'use client'

import React from 'react'
import { Loader2, Copy } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { useAuth } from '../contexts/AuthContext'
import { useProductHunterApi } from '../../hooks/useProductHunterApi'
import { showToast } from '../../lib/toast'

export function ProductHunterInvite() {
  const { user } = useAuth()
  const url = user?.id && user?.role === 'product_hunter'
    ? `/api/product-hunter/referral-code?hunterId=${user.id}`
    : null
  const { data, loading } = useProductHunterApi<{ code: string; inviteLink: string }>(url, {
    enabled: !!user?.id && user?.role === 'product_hunter',
    extract: (d) => {
      let link = d?.inviteLink ?? ''
      if (link && !link.startsWith('http') && typeof window !== 'undefined') {
        link = window.location.origin + (link.startsWith('/') ? link : '/' + link)
      }
      return { code: d?.referralCode ?? d?.code ?? '', inviteLink: link }
    },
    onError: () => showToast.error('Failed to load referral code'),
  })
  const code = data?.code ?? ''
  const inviteLink = data?.inviteLink ?? ''

  const copy = (text: string, label: string) => {
    if (!text) return
    const toCopy = label === 'Link' && !text.startsWith('http') && typeof window !== 'undefined'
      ? window.location.origin + (text.startsWith('/') ? text : '/' + text)
      : text
    navigator.clipboard.writeText(toCopy).then(() => showToast.success(`${label} copied`))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invite Suppliers</h1>
        <p className="text-muted-foreground mt-1">Share your referral link so suppliers sign up under you.</p>
      </div>
      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Referral code</label>
          <div className="flex gap-2 mt-1">
            <input readOnly value={code} className="flex-1 px-3 py-2 rounded border bg-muted/50" />
            <Button variant="outline" size="icon" onClick={() => copy(code, 'Code')}><Copy className="w-4 h-4" /></Button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Invite link</label>
          <div className="flex gap-2 mt-1">
            <input readOnly value={inviteLink} className="flex-1 px-3 py-2 rounded border bg-muted/50 text-sm" />
            <Button variant="outline" size="icon" onClick={() => copy(inviteLink, 'Link')}><Copy className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
