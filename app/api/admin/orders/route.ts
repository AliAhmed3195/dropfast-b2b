import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { OrderStatus } from '@prisma/client'

// GET /api/admin/orders - List all orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // Filter by order status

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as OrderStatus
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            productName: true,
            productImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response to match UI expectations
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone || '',
        address: `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}`,
      },
      items: order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString().split('T')[0],
      vendor: order.store.name,
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

