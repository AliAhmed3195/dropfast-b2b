import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { HunterCommissionStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const hunterId = request.nextUrl.searchParams.get('hunterId')
    if (!hunterId) {
      return NextResponse.json({ error: 'Hunter ID is required' }, { status: 401 })
    }

    const hunter = await prisma.user.findUnique({
      where: { id: hunterId, role: 'PRODUCT_HUNTER' },
    })
    if (!hunter) {
      return NextResponse.json({ error: 'Hunter not found' }, { status: 404 })
    }

    const [referredSuppliers, commissions, payouts] = await Promise.all([
      prisma.user.count({ where: { referredByHunterId: hunterId, role: 'SUPPLIER' } }),
      prisma.hunterCommission.findMany({
        where: { hunterId },
        select: { amount: true, status: true },
      }),
      prisma.payout.findMany({
        where: { userId: hunterId, payoutType: 'hunter' },
        select: { netAmount: true, status: true },
      }),
    ])

    const pendingCommission = commissions
      .filter((c) => c.status === HunterCommissionStatus.PENDING)
      .reduce((sum, c) => sum + c.amount, 0)
    const paidCommission = commissions
      .filter((c) => c.status === HunterCommissionStatus.PAID)
      .reduce((sum, c) => sum + c.amount, 0)
    const totalPayouts = payouts
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.netAmount, 0)

    return NextResponse.json({
      referredSuppliersCount: referredSuppliers,
      commissionPending: Math.round(pendingCommission * 100) / 100,
      commissionPaid: Math.round(paidCommission * 100) / 100,
      totalPayouts: Math.round(totalPayouts * 100) / 100,
      totalCommission: Math.round((pendingCommission + paidCommission) * 100) / 100,
    })
  } catch (error: any) {
    console.error('Product hunter dashboard error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load dashboard' },
      { status: 500 }
    )
  }
}
