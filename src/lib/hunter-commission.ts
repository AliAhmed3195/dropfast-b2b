/**
 * Product Hunter commission: create commissions when an order is paid
 * and order items are from suppliers referred by a hunter.
 */

import { prisma } from './prisma'
import { HunterCommissionStatus } from '@prisma/client'

/** Resolve hunter id from referral code (e.g. from signup ?ref=CODE). Returns null if not found or invalid. */
export async function getHunterIdByReferralCode(code: string | null | undefined): Promise<string | null> {
  if (!code || typeof code !== 'string') return null
  const trimmed = code.trim().toUpperCase()
  if (!trimmed) return null
  const hunter = await prisma.user.findFirst({
    where: {
      hunterReferralCode: { equals: trimmed, mode: 'insensitive' },
      role: 'PRODUCT_HUNTER',
    },
    select: { id: true },
  })
  return hunter?.id ?? null
}

export async function createHunterCommissionsForOrder(orderId: string): Promise<number> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  })
  if (!order || order.paymentStatus !== 'PAID') return 0

  const config = await prisma.platformConfig.findFirst()
  const hunterRate = config?.hunterCommissionPercentage ?? 5.0

  let created = 0
  for (const item of order.items) {
    if (!item.supplierId) continue
    const supplier = await prisma.user.findUnique({
      where: { id: item.supplierId },
      select: { referredByHunterId: true },
    })
    if (!supplier?.referredByHunterId) continue

    const commissionBase = (item.vendorPrice ?? item.price) * item.quantity
    const amount = (commissionBase * hunterRate) / 100
    if (amount <= 0) continue

    try {
      await prisma.hunterCommission.create({
        data: {
          hunterId: supplier.referredByHunterId,
          orderItemId: item.id,
          orderId: order.id,
          supplierId: item.supplierId,
          commissionBase,
          commissionRate: hunterRate,
          amount,
          status: HunterCommissionStatus.PENDING,
        },
      })
      created++
    } catch (e: any) {
      if (e?.code === 'P2002') {
        // Unique constraint on orderItemId - already created (idempotent)
        continue
      }
      throw e
    }
  }
  return created
}
