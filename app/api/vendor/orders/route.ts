import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { OrderStatus } from '@prisma/client'

// GET /api/vendor/orders - List all orders for vendor's stores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')
    const status = searchParams.get('status') // Filter by order status

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 401 }
      )
    }

    // Verify vendor exists and get their stores
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDOR' },
      include: {
        storesAsVendor: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const storeIds = vendor.storesAsVendor.map(store => store.id)

    // If vendor has no stores, return empty orders
    if (storeIds.length === 0) {
      return NextResponse.json({ orders: [] })
    }

    const where: any = {
      storeId: { in: storeIds },
    }

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
            vendorPrice: true,
            supplierPrice: true,
            vendorProfit: true,
            stripeFeeVendor: true,
            platformFee: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
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
      date: order.createdAt.toISOString().split('T')[0],
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone || '',
        address: `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}`,
      },
      store: order.store.name,
      items: order.items.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.productImage || item.product?.images?.[0] || '',
        // Profit breakdown (USD)
        vendorPrice: item.vendorPrice,
        supplierPrice: item.supplierPrice,
        vendorProfit: item.vendorProfit,
        stripeFeeVendor: item.stripeFeeVendor,
        platformFee: item.platformFee,
        netProfit: item.vendorProfit ? (item.vendorProfit - (item.stripeFeeVendor || 0) - (item.platformFee || 0)) * item.quantity : 0,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      status: order.status.toLowerCase(),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus.toLowerCase(),
      shippingAddress: {
        fullName: order.shippingFullName,
        address: order.shippingAddress,
        city: order.shippingCity,
        state: order.shippingState,
        zipCode: order.shippingZipCode,
        country: order.shippingCountry,
        phone: order.shippingPhone,
      },
      trackingNumber: order.trackingNumber,
      shippedAt: order.shippedAt?.toISOString(),
      deliveredAt: order.deliveredAt?.toISOString(),
      createdAt: order.createdAt.toISOString(),
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error('Get vendor orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

