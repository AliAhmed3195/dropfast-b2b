import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import { PayoutStatus } from '@prisma/client'

// GET /api/admin/payouts/[id] - Get payout by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payout = await prisma.payout.findUnique({
      where: { id: params.id },
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

    if (!payout) {
      return NextResponse.json(
        { error: 'Payout not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ payout })
  } catch (error) {
    console.error('Get payout error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payout' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/payouts/[id] - Update payout status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, processedAt } = body

    // Check if payout exists
    const existingPayout = await prisma.payout.findUnique({
      where: { id: params.id },
    })

    if (!existingPayout) {
      return NextResponse.json(
        { error: 'Payout not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (status) {
      updateData.status = status.toUpperCase() as PayoutStatus
    }
    if (processedAt) {
      updateData.processedAt = new Date(processedAt)
    } else if (status?.toUpperCase() === PayoutStatus.COMPLETED) {
      updateData.processedAt = new Date()
    }

    // Update payout
    const payout = await prisma.payout.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            businessName: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ payout })
  } catch (error) {
    console.error('Update payout error:', error)
    return NextResponse.json(
      { error: 'Failed to update payout' },
      { status: 500 }
    )
  }
}

