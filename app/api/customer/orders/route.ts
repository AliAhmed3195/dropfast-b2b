import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';
import { OrderStatus } from '@prisma/client';

// GET /api/customer/orders - Get customer's orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status'); // Filter by order status

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 401 }
      );
    }

    // Verify customer exists
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const where: any = {
      customerId,
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase() as OrderStatus;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            productName: true,
            productImage: true,
            productId: true,
            supplierId: true,
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
    });

    // Format response to match UI expectations
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerEmail, // Use email as name if name not available
      customerEmail: order.customerEmail,
      storeId: order.storeId,
      storeName: order.store?.name || 'Unknown Store',
      items: order.items.map((item) => ({
        productId: item.productId || item.product?.id || '',
        productName: item.productName,
        productImage: item.productImage || item.product?.images?.[0] || '',
        quantity: item.quantity,
        price: item.price,
        supplierId: item.supplierId || '',
      })),
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      tax: Number(order.tax),
      total: Number(order.total),
      status: order.status.toLowerCase(),
      shippingAddress: {
        fullName: order.shippingFullName || '',
        address: order.shippingAddress || '',
        city: order.shippingCity || '',
        state: order.shippingState || '',
        zipCode: order.shippingZipCode || '',
        country: order.shippingCountry || '',
        phone: order.shippingPhone || '',
      },
      paymentMethod: order.paymentMethod || 'credit_card',
      paymentStatus: order.paymentStatus.toLowerCase(),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error: any) {
    console.error('Get customer orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

