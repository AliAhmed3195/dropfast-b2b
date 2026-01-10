import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/vendor/account - Get vendor account details with Stripe info
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get vendor with Stripe account info
    const vendor = await prisma.user.findUnique({
      where: { id: userId, role: 'VENDOR' },
      select: {
        id: true,
        name: true,
        email: true,
        stripeAccountId: true,
        stripeKycStatus: true,
        stripeOnboardingComplete: true,
        stripeChargesEnabled: true,
        stripePayoutsEnabled: true,
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Calculate total payouts (from completed payouts)
    const completedPayouts = await prisma.payout.aggregate({
      where: {
        userId: userId,
        status: 'COMPLETED',
      },
      _sum: {
        netAmount: true,
      },
    })

    // Calculate pending balance (from pending/processing payouts)
    const pendingPayouts = await prisma.payout.aggregate({
      where: {
        userId: userId,
        status: { in: ['PENDING', 'PROCESSING'] },
      },
      _sum: {
        netAmount: true,
      },
    })

    return NextResponse.json({
      stripeAccountId: vendor.stripeAccountId,
      stripeKycStatus: vendor.stripeKycStatus || 'not_submitted',
      stripeOnboardingComplete: vendor.stripeOnboardingComplete || false,
      stripeChargesEnabled: vendor.stripeChargesEnabled || false,
      stripePayoutsEnabled: vendor.stripePayoutsEnabled || false,
      totalPayouts: completedPayouts._sum.netAmount || 0,
      pendingBalance: pendingPayouts._sum.netAmount || 0,
    })
  } catch (error: any) {
    console.error('Get vendor account error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor account', details: error.message },
      { status: 500 }
    )
  }
}

