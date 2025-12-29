import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { InvoiceStatus } from '@prisma/client'

// GET /api/vendor/invoices - List all invoices for vendor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')
    const status = searchParams.get('status')
    const store = searchParams.get('store')

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 401 }
      )
    }

    // Verify vendor exists
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDOR' },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const where: any = {
      vendorId,
    }

    // Filter by status
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as InvoiceStatus
    }

    // Get invoices
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        order: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
              },
            },
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: {
              select: {
                id: true,
                quantity: true,
                price: true,
                productName: true,
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

    // Filter by store if provided (after fetching since store is in order relation)
    let filteredInvoices = invoices
    if (store && store !== 'all') {
      filteredInvoices = invoices.filter(inv => inv.order?.store?.name === store)
    }

    // Format invoices
    const formattedInvoices = filteredInvoices.map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      orderNumber: invoice.order?.orderNumber || '',
      customer: invoice.order?.customer
        ? {
            name: invoice.order.customer.name,
            email: invoice.order.customer.email,
          }
        : null,
      store: invoice.order?.store?.name || 'Unknown',
      date: invoice.createdAt.toISOString().split('T')[0],
      dueDate: invoice.dueDate?.toISOString().split('T')[0] || null,
      amount: invoice.amount,
      status: invoice.status.toLowerCase(),
      emailStatus: invoice.emailStatus?.toLowerCase() || 'not_sent',
      sentDate: invoice.sentDate?.toISOString().split('T')[0] || null,
      template: invoice.template?.name || 'Default',
      items: invoice.order?.items.map(item => ({
        name: item.productName,
        qty: item.quantity,
        price: item.price,
      })) || [],
    }))

    return NextResponse.json({ invoices: formattedInvoices })
  } catch (error) {
    console.error('Get vendor invoices error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

