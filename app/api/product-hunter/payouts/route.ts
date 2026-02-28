import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/product-hunter/payouts - List hunter payouts
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

    const payouts = await prisma.payout.findMany({
      where: { userId: hunterId, payoutType: 'hunter' },
      orderBy: { createdAt: 'desc' },
    })

    const list = payouts.map((p) => ({
      id: p.id,
      netAmount: p.netAmount,
      baseAmount: p.baseAmount,
      status: p.status,
      method: p.method,
      processedAt: p.processedAt?.toISOString().split('T')[0] ?? null,
      createdAt: p.createdAt.toISOString().split('T')[0],
    }))

    return NextResponse.json({ payouts: list })
  } catch (error: any) {
    console.error('Product hunter payouts error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load payouts' },
      { status: 500 }
    )
  }
}
