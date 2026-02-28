import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/product-hunter/suppliers - List referred suppliers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hunterId = searchParams.get('hunterId')
    if (!hunterId) {
      return NextResponse.json({ error: 'Hunter ID is required' }, { status: 401 })
    }

    const hunter = await prisma.user.findUnique({
      where: { id: hunterId, role: 'PRODUCT_HUNTER' },
    })
    if (!hunter) {
      return NextResponse.json({ error: 'Hunter not found' }, { status: 404 })
    }

    const suppliers = await prisma.user.findMany({
      where: { referredByHunterId: hunterId, role: 'SUPPLIER' },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Optional: add commission earned per supplier
    const commissionsBySupplier = await prisma.hunterCommission.groupBy({
      by: ['supplierId'],
      where: { hunterId },
      _sum: { amount: true },
      _count: true,
    })
    const commissionMap = Object.fromEntries(
      commissionsBySupplier.map((c) => [c.supplierId, { total: c._sum.amount ?? 0, count: c._count }])
    )

    const list = suppliers.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      businessName: s.businessName,
      joinedAt: s.createdAt.toISOString().split('T')[0],
      commissionEarned: Math.round((commissionMap[s.id]?.total ?? 0) * 100) / 100,
      ordersCount: commissionMap[s.id]?.count ?? 0,
    }))

    return NextResponse.json({ suppliers: list })
  } catch (error: any) {
    console.error('Product hunter suppliers error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load suppliers' },
      { status: 500 }
    )
  }
}
