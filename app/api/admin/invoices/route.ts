import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { InvoiceStatus } from '@prisma/client'

// GET /api/admin/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as InvoiceStatus
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            businessName: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
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
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response
    const formattedInvoices = invoices.map(invoice => ({
      id: invoice.invoiceNumber,
      invoiceNumber: invoice.invoiceNumber,
      orderNumber: invoice.order?.orderNumber || '',
      customer: {
        name: invoice.order?.customer.name || '',
        email: invoice.order?.customer.email || '',
      },
      store: invoice.order?.store.name || '',
      date: invoice.createdAt.toISOString().split('T')[0],
      dueDate: invoice.dueDate?.toISOString().split('T')[0] || null,
      amount: invoice.amount,
      status: invoice.status.toLowerCase(),
      emailStatus: invoice.emailStatus || 'not_sent',
      sentDate: invoice.sentDate?.toISOString().split('T')[0] || null,
      template: invoice.template?.name || '',
    }))

    return NextResponse.json({ invoices: formattedInvoices })
  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

