'use client'

import React from 'react'
import { Users, DollarSign, Wallet, TrendingUp, Loader2 } from 'lucide-react'
import { Card } from './ui/card'
import { useAuth } from '../contexts/AuthContext'
import { useProductHunterApi } from '../../hooks/useProductHunterApi'
import { showToast } from '../../lib/toast'

export function ProductHunterOverview() {
  const { user } = useAuth()
  const url = user?.id && user?.role === 'product_hunter'
    ? `/api/product-hunter/dashboard?hunterId=${user.id}`
    : null
  const { data, loading } = useProductHunterApi<{
    referredSuppliersCount: number
    commissionPending: number
    commissionPaid: number
    totalPayouts: number
    totalCommission: number
  }>(url, {
    enabled: !!user?.id && user?.role === 'product_hunter',
    onError: () => showToast.error('Failed to load dashboard'),
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Unable to load dashboard data.
      </div>
    )
  }

  const cards = [
    {
      title: 'Referred Suppliers',
      value: data.referredSuppliersCount,
      icon: Users,
      description: 'Suppliers you brought to the platform',
    },
    {
      title: 'Pending Commission',
      value: `$${data.commissionPending.toFixed(2)}`,
      icon: TrendingUp,
      description: 'Awaiting payout',
    },
    {
      title: 'Paid Commission',
      value: `$${data.commissionPaid.toFixed(2)}`,
      icon: DollarSign,
      description: 'Earned from sales',
    },
    {
      title: 'Total Payouts',
      value: `$${data.totalPayouts.toFixed(2)}`,
      icon: Wallet,
      description: 'Received to date',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Product Hunter Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track referred suppliers and commissions from their sales.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </div>
              <card.icon className="h-10 w-10 text-muted-foreground/50" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-2">How it works</h2>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Invite suppliers with your referral link or code.</li>
          <li>When their products sell on vendor stores, you earn a commission.</li>
          <li>Commission is paid out periodically by the platform.</li>
        </ul>
      </Card>
    </div>
  )
}
