import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { PayoutStatus } from '@prisma/client'

// GET /api/admin/payouts - List all payouts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // Filter by payout status

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as PayoutStatus
    }

    const payouts = await prisma.payout.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            businessName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response to match UI expectations
    const formattedPayouts = payouts.map(payout => ({
      id: payout.id,
      recipientName: payout.recipientName || payout.user.businessName || payout.user.name,
      recipientType: payout.recipientType || payout.user.role.toLowerCase(),
      email: payout.user.email,
      phone: payout.user.phone || '',
      accountNumber: '****1234', // Masked (from accountDetails JSON)
      dueAmount: payout.amount,
      ordersCount: 0, // Would need to calculate from orders
      lastPayout: payout.processedAt?.toISOString().split('T')[0] || null,
      status: payout.status.toLowerCase(),
      amount: payout.amount,
      method: payout.method,
      processedAt: payout.processedAt?.toISOString() || null,
      createdAt: payout.createdAt.toISOString(),
    }))

    return NextResponse.json({ payouts: formattedPayouts })
  } catch (error) {
    console.error('Get payouts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    )
  }
}

// POST /api/admin/payouts - Create new payout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, method, accountDetails, recipientName, recipientType } = body

    // Validate required fields
    if (!userId || !amount || !method) {
      return NextResponse.json(
        { error: 'User ID, amount, and method are required' },
        { status: 400 }
      )
    }

    // Get user to populate recipient info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create payout
    const payout = await prisma.payout.create({
      data: {
        userId,
        amount: parseFloat(amount),
        method,
        status: PayoutStatus.PENDING,
        accountDetails: accountDetails || null,
        recipientName: recipientName || user.businessName || user.name,
        recipientType: recipientType || user.role.toLowerCase(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            businessName: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ payout }, { status: 201 })
  } catch (error) {
    console.error('Create payout error:', error)
    return NextResponse.json(
      { error: 'Failed to create payout' },
      { status: 500 }
    )
  }
}

