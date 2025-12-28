import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/supplier/payouts - Get supplier payouts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supplierId = searchParams.get('supplierId')

    if (!supplierId) {
      return NextResponse.json(
        { error: 'Supplier ID is required' },
        { status: 401 }
      )
    }

    // Verify supplier exists
    const supplier = await prisma.user.findUnique({
      where: { id: supplierId, role: 'SUPPLIER' },
      select: {
        id: true,
        name: true,
        role: true,
        stripeAccountId: true,
        stripeKycStatus: true,
        stripeOnboardingComplete: true,
        stripeChargesEnabled: true,
        stripePayoutsEnabled: true,
      },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Get payouts for this supplier
    const payouts = await prisma.payout.findMany({
      where: {
        userId: supplierId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response
    const formattedPayouts = payouts.map((payout) => ({
      id: payout.id,
      payoutNumber: `PAY-${payout.id.slice(-8).toUpperCase()}`, // Generate payout number from ID
      amount: payout.amount,
      status: payout.status.toLowerCase(),
      paymentMethod: payout.method,
      createdAt: payout.createdAt.toISOString(),
      processedAt: payout.processedAt?.toISOString() || null,
      supplier: payout.user?.businessName || payout.user?.name || 'Unknown',
    }))

    // Get supplier's Stripe account status
    const stripeAccount = {
      isConnected: !!supplier.stripeAccountId,
      accountId: supplier.stripeAccountId,
      kycStatus: supplier.stripeKycStatus?.toLowerCase() || 'pending',
      onboardingComplete: supplier.stripeOnboardingComplete || false,
      detailsSubmitted: !!supplier.stripeAccountId,
      chargesEnabled: supplier.stripeChargesEnabled || false,
      payoutsEnabled: supplier.stripePayoutsEnabled || false,
    }

    return NextResponse.json({
      payouts: formattedPayouts,
      stripeAccount,
    })
  } catch (error) {
    console.error('Get supplier payouts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    )
  }
}

