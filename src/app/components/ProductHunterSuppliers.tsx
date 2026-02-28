'use client'

import React from 'react'
import { Users, Loader2 } from 'lucide-react'
import { Card } from './ui/card'
import { useAuth } from '../contexts/AuthContext'
import { useProductHunterApi } from '../../hooks/useProductHunterApi'
import { showToast } from '../../lib/toast'

export function ProductHunterSuppliers() {
  const { user } = useAuth()
  const url = user?.id && user?.role === 'product_hunter'
    ? `/api/product-hunter/suppliers?hunterId=${user.id}`
    : null
  const { data: suppliers = [], loading } = useProductHunterApi<any[]>(url, {
    enabled: !!user?.id && user?.role === 'product_hunter',
    extract: (d) => d?.suppliers ?? [],
    onError: () => showToast.error('Failed to load suppliers'),
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
        <h1 className="text-2xl font-bold">Referred Suppliers</h1>
        <p className="text-muted-foreground mt-1">Suppliers you invited to the platform.</p>
      </div>
      {suppliers.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No referred suppliers yet. Use Invite Suppliers to share your referral link.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {suppliers.map((s) => (
            <Card key={s.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.email}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Joined {s.joinedAt}</p>
                <p className="font-medium">Commission: ${s.commissionEarned.toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
