'use client'

import React, { useState } from 'react'
import { DollarSign, Loader2 } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useProductHunterApi } from '../../hooks/useProductHunterApi'
import { showToast } from '../../lib/toast'

export function ProductHunterCommissions() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('')
  const url = user?.id && user?.role === 'product_hunter'
    ? filter
      ? `/api/product-hunter/commissions?hunterId=${user.id}&status=${filter}`
      : `/api/product-hunter/commissions?hunterId=${user.id}`
    : null
  const { data: commissions = [], loading } = useProductHunterApi<any[]>(url, {
    enabled: !!user?.id && user?.role === 'product_hunter',
    extract: (d) => d?.commissions ?? [],
    onError: () => showToast.error('Failed to load commissions'),
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Commissions</h1>
          <p className="text-muted-foreground mt-1">Earnings from referred suppliers sales.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('')} className={`px-3 py-1 rounded text-sm ${!filter ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>All</button>
          <button onClick={() => setFilter('PENDING')} className={`px-3 py-1 rounded text-sm ${filter === 'PENDING' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Pending</button>
          <button onClick={() => setFilter('PAID')} className={`px-3 py-1 rounded text-sm ${filter === 'PAID' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Paid</button>
        </div>
      </div>
      {commissions.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No commissions yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {commissions.map((c) => (
            <Card key={c.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">${c.amount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{c.supplierName} · {c.createdAt}</p>
              </div>
              <Badge variant={c.status === 'PAID' ? 'default' : 'secondary'}>{c.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
