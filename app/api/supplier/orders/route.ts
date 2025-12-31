import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/supplier/orders - Get supplier's orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supplierId = searchParams.get('supplierId')
    const status = searchParams.get('status')

    if (!supplierId) {
      return NextResponse.json(
        { error: 'Supplier ID is required' },
        { status: 401 }
      )
    }

    // Verify supplier exists
    const supplier = await prisma.user.findUnique({
      where: { id: supplierId, role: 'SUPPLIER' },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    // Get order items for this supplier
    const where: any = { supplierId }
    if (status && status !== 'all') {
      where.order = { status: status.toUpperCase() }
    }

    const orderItems = await prisma.orderItem.findMany({
      where,
      include: {
        order: {
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
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Group order items by order
    const ordersMap = new Map()
    orderItems.forEach((item) => {
      const orderId = item.orderId
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: item.order.id,
          orderNumber: item.order.orderNumber,
          date: item.order.createdAt.toISOString().split('T')[0],
          customer: item.order.customer
            ? {
                name: item.order.customer.name,
                email: item.order.customer.email,
                phone: item.order.customer.phone,
                address: `${item.order.shippingAddress}, ${item.order.shippingCity}, ${item.order.shippingState} ${item.order.shippingZipCode}`,
              }
            : null,
          vendor: item.order.store?.name || 'Unknown',
          items: [],
          total: 0,
          status: item.order.status.toLowerCase(),
          paymentStatus: item.order.paymentStatus.toLowerCase(),
          shippingAddress: `${item.order.shippingAddress}, ${item.order.shippingCity}, ${item.order.shippingState} ${item.order.shippingZipCode}`,
        })
      }
      const order = ordersMap.get(orderId)
      order.items.push({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        product: item.product,
        // Price breakdown (USD)
        supplierPrice: item.supplierPrice,
        stripeFeeSupplier: item.stripeFeeSupplier,
        netAmount: item.supplierPrice ? (item.supplierPrice - (item.stripeFeeSupplier || 0)) * item.quantity : item.price * item.quantity,
      })
      order.total += item.price * item.quantity
    })

    const formattedOrders = Array.from(ordersMap.values())

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error('Get supplier orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

