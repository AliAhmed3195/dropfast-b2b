import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { OrderStatus } from '@prisma/client'

// GET /api/admin/orders - List all orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // Filter by order status
    const search = searchParams.get('search') // Search query
    const dateFrom = searchParams.get('dateFrom') // Filter by date from
    const dateTo = searchParams.get('dateTo') // Filter by date to
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build base filters
    const baseFilters: any = {}
    if (status && status !== 'all') {
      baseFilters.status = status.toUpperCase() as OrderStatus
    }

    // Add date filters
    if (dateFrom || dateTo) {
      baseFilters.createdAt = {}
      if (dateFrom) {
        const fromDate = new Date(dateFrom)
        fromDate.setHours(0, 0, 0, 0)
        baseFilters.createdAt.gte = fromDate
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        baseFilters.createdAt.lte = toDate
      }
    }

    // Add search filter
    const where: any = {}
    if (search && search.trim()) {
      const searchTerm = search.trim()
      const searchConditions = [
        { orderNumber: { contains: searchTerm, mode: 'insensitive' } },
        { customer: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { customer: { email: { contains: searchTerm, mode: 'insensitive' } } },
      ]
      
      // Combine base filters with search using AND
      if (Object.keys(baseFilters).length > 0) {
        where.AND = [
          baseFilters,
          { OR: searchConditions }
        ]
      } else {
        where.OR = searchConditions
      }
    } else {
      // No search, just use base filters
      Object.assign(where, baseFilters)
    }

    // Get total count for pagination
    const total = await prisma.order.count({ where })

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
      skip,
      take: limit,
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

    return NextResponse.json({ 
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

