import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

// POST /api/public/orders - Create order from public store
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      storeId,
      customerEmail,
      customerPhone,
      customerName,
      // Shipping
      shippingFullName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingCountry,
      shippingPhone,
      // Payment
      paymentMethod,
      // Items
      items, // Array of { productId, quantity, price, productName, productImage }
      // Totals
      subtotal,
      shipping,
      tax,
      total,
    } = body

    // Validation
    if (!storeId || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: storeId, customerEmail, items' },
        { status: 400 }
      )
    }

    // Verify store exists and is active
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, status: true },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    if (store.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Store is not available for orders' },
        { status: 403 }
      )
    }

    // Find or create customer (guest customer)
    let customer = await prisma.user.findUnique({
      where: { email: customerEmail },
    })

    if (!customer) {
      // Create guest customer with random password (they can reset later)
      const randomPassword = Math.random().toString(36).slice(-12) + Date.now().toString(36)
      const hashedPassword = await bcrypt.hash(randomPassword, 10)
      
      customer = await prisma.user.create({
        data: {
          email: customerEmail,
          name: customerName || 'Guest Customer',
          phone: customerPhone || null,
          role: 'CUSTOMER',
          password: hashedPassword,
        },
      })
    }

    // Generate order number
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase()
    const orderNumber = `ORD-${dateStr}-${randomStr}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        storeId,
        // Pricing
        subtotal: parseFloat(subtotal) || 0,
        shipping: parseFloat(shipping) || 0,
        tax: parseFloat(tax) || 0,
        total: parseFloat(total) || 0,
        // Status
        status: OrderStatus.PENDING,
        paymentMethod: paymentMethod || 'credit_card',
        paymentStatus: PaymentStatus.PENDING,
        // Shipping
        shippingFullName,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZipCode,
        shippingCountry,
        shippingPhone: shippingPhone || customerPhone || '',
        // Contact
        customerEmail,
        customerPhone: customerPhone || null,
        // Order items
        items: {
          create: items.map((item: any) => ({
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            productName: item.productName,
            productImage: item.productImage || null,
            productId: item.productId || null,
            supplierId: item.supplierId || null,
          })),
        },
      },
      include: {
        items: true,
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status.toLowerCase(),
          paymentStatus: order.paymentStatus.toLowerCase(),
          items: order.items,
          store: order.store,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create public order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}

