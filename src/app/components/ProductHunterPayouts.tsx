'use client'

import React from 'react'
import { Wallet, Loader2 } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useProductHunterApi } from '../../hooks/useProductHunterApi'
import { showToast } from '../../lib/toast'

export function ProductHunterPayouts() {
  const { user } = useAuth()
  const url = user?.id && user?.role === 'product_hunter'
    ? `/api/product-hunter/payouts?hunterId=${user.id}`
    : null
  const { data: payouts = [], loading } = useProductHunterApi<any[]>(url, {
    enabled: !!user?.id && user?.role === 'product_hunter',
    extract: (d) => d?.payouts ?? [],
    onError: () => showToast.error('Failed to load payouts'),
  })

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
        <h1 className="text-2xl font-bold">Payouts</h1>
        <p className="text-muted-foreground mt-1">Commission payouts sent to you.</p>
      </div>
      {payouts.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No payouts yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {payouts.map((p) => (
            <Card key={p.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">${p.netAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{p.createdAt} · {p.method}</p>
              </div>
              <Badge variant={p.status === 'COMPLETED' ? 'default' : 'secondary'}>{p.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
