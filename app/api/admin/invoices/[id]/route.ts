import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'

// GET /api/admin/invoices/[id] - Get invoice by ID (using invoiceNumber)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to find by invoiceNumber first, then by id
    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [
          { invoiceNumber: params.id },
          { id: params.id },
        ],
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            businessName: true,
            phone: true,
          },
        },
        order: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            store: {
              select: {
                id: true,
                name: true,
              },
            },
            items: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            layout: true,
            accentColor: true,
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Get invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

