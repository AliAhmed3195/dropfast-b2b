import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/product-hunter/commissions - List commissions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hunterId = searchParams.get('hunterId')
    const status = searchParams.get('status') // PENDING | PAID
    if (!hunterId) {
      return NextResponse.json({ error: 'Hunter ID is required' }, { status: 401 })
    }

    const hunter = await prisma.user.findUnique({
      where: { id: hunterId, role: 'PRODUCT_HUNTER' },
    })
    if (!hunter) {
      return NextResponse.json({ error: 'Hunter not found' }, { status: 404 })
    }

    const where: any = { hunterId }
    if (status && ['PENDING', 'PAID', 'CANCELLED'].includes(status)) {
      where.status = status
    }

    const commissions = await prisma.hunterCommission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    const supplierIds = [...new Set(commissions.map((c) => c.supplierId))]
    const suppliers = await prisma.user.findMany({
      where: { id: { in: supplierIds } },
      select: { id: true, name: true, email: true },
    })
    const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s]))

    const list = commissions.map((c) => ({
      id: c.id,
      orderItemId: c.orderItemId,
      orderId: c.orderId,
      supplierId: c.supplierId,
      supplierName: supplierMap[c.supplierId]?.name ?? '—',
      commissionBase: c.commissionBase,
      commissionRate: c.commissionRate,
      amount: c.amount,
      status: c.status,
      paidAt: c.paidAt?.toISOString().split('T')[0] ?? null,
      createdAt: c.createdAt.toISOString().split('T')[0],
    }))

    return NextResponse.json({ commissions: list })
  } catch (error: any) {
    console.error('Product hunter commissions error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load commissions' },
      { status: 500 }
    )
  }
}
