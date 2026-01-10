import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { PayoutStatus } from '@prisma/client'
import {
  getSupplierPendingPayout,
  getVendorPendingPayout,
  calculateSupplierPayout,
  calculateVendorPayout,
} from '../../../../src/lib/payout-calculator'
import { createTransfer } from '../../../../src/lib/stripe'

// GET /api/admin/payouts - List all payouts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const payoutType = searchParams.get('type') // 'supplier' or 'vendor'

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as PayoutStatus
    }
    if (payoutType) {
      where.payoutType = payoutType
    }

    const payouts = await prisma.payout.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            baseCurrency: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ payouts })
  } catch (error: any) {
    console.error('Get payouts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payouts', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/payouts - Create a new payout
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const body = await request.json()
    const { userId, payoutType, orderIds } = body

    if (!userId || !payoutType || !orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, payoutType, orderIds' },
        { status: 400 }
      )
    }

    if (!['supplier', 'vendor'].includes(payoutType)) {
      return NextResponse.json(
        { error: 'Invalid payoutType. Must be "supplier" or "vendor"' },
        { status: 400 }
      )
    }

    // Get user with Stripe account info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        baseCurrency: true,
        stripeAccountId: true,
        stripeKycStatus: true,
        stripePayoutsEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Validate Stripe account for payout
    if (!user.stripeAccountId) {
      return NextResponse.json(
        { error: 'User has not connected Stripe account' },
        { status: 400 }
      )
    }

    if (user.stripeKycStatus !== 'verified') {
      return NextResponse.json(
        { error: 'User KYC verification is not complete' },
        { status: 400 }
      )
    }

    if (!user.stripePayoutsEnabled) {
      return NextResponse.json(
        { error: 'Payouts are not enabled for this account' },
        { status: 400 }
      )
    }

    // Verify user role matches payout type
    if (payoutType === 'supplier' && user.role !== 'SUPPLIER') {
      return NextResponse.json(
        { error: 'User is not a supplier' },
        { status: 400 }
      )
    }

    if (payoutType === 'vendor' && user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'User is not a vendor' },
        { status: 400 }
      )
    }

    // Get order items for these orders
    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: { in: orderIds },
        order: {
          paymentStatus: 'PAID', // Only paid orders
        },
        ...(payoutType === 'supplier' ? { supplierId: userId } : {}),
      },
      include: {
        order: {
          select: {
            id: true,
            storeId: true,
          },
        },
      },
    })

    // Filter vendor items by store ownership
    let filteredItems = orderItems
    if (payoutType === 'vendor') {
      const vendorStores = await prisma.store.findMany({
        where: {
          vendorId: userId,
        },
        select: { id: true },
      })
      const storeIds = vendorStores.map((s) => s.id)
      filteredItems = orderItems.filter((item) =>
        storeIds.includes(item.order.storeId)
      )
    }

    if (filteredItems.length === 0) {
      return NextResponse.json(
        { error: 'No eligible order items found for payout' },
        { status: 400 }
      )
    }

    // Calculate payout amounts
    let payoutAmounts
    if (payoutType === 'supplier') {
      payoutAmounts = await calculateSupplierPayout(filteredItems)
    } else {
      payoutAmounts = await calculateVendorPayout(filteredItems)
    }

    // Create payout record
    const payout = await prisma.payout.create({
      data: {
        amount: payoutAmounts.netAmount,
        userId,
        payoutType,
        orderIds,
        baseAmount: payoutAmounts.baseAmount,
        stripeFee: payoutAmounts.stripeFee,
        platformFee: payoutAmounts.platformFee || 0,
        netAmount: payoutAmounts.netAmount,
        recipientCurrency: user.baseCurrency || 'USD',
        recipientName: user.name,
        recipientType: payoutType,
        status: PayoutStatus.PROCESSING,
        method: 'stripe',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create Stripe Transfer
    try {
      const transfer = await createTransfer(
        payoutAmounts.netAmount,
        user.stripeAccountId!,
        'usd',
        {
          payoutId: payout.id,
          userId: userId,
          payoutType: payoutType,
        }
      )

      // Update payout with transfer ID
      const updatedPayout = await prisma.payout.update({
        where: { id: payout.id },
        data: {
          transferId: transfer.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json({ payout: updatedPayout }, { status: 201 })
    } catch (transferError: any) {
      // If transfer fails, update payout status to FAILED
      await prisma.payout.update({
        where: { id: payout.id },
        data: {
          status: PayoutStatus.FAILED,
        },
      })

      console.error('Stripe transfer error:', transferError)
      return NextResponse.json(
        {
          error: 'Failed to process payout transfer',
          details: transferError.message,
          payout,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Create payout error:', error)
    return NextResponse.json(
      { error: 'Failed to create payout', details: error.message },
      { status: 500 }
    )
  }
}
