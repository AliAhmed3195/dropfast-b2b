import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/vendor/customers - Get customers for vendor's stores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')
    const search = searchParams.get('search')

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
          select: { id: true },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const vendorStoreIds = vendor.storesAsVendor.map(s => s.id)

    if (vendorStoreIds.length === 0) {
      return NextResponse.json({ customers: [] })
    }

    // Get all orders for vendor's stores to find unique customers
    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: vendorStoreIds },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
      distinct: ['customerId'],
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Extract unique customers and aggregate order data
    const customerMap = new Map()
    
    for (const order of orders) {
      if (!order.customer) continue

      const customerId = order.customer.id
      
      if (!customerMap.has(customerId)) {
        // Get all orders for this customer from vendor's stores
        const customerOrders = await prisma.order.findMany({
          where: {
            customerId,
            storeId: { in: vendorStoreIds },
          },
          select: {
            id: true,
            total: true,
            createdAt: true,
            status: true,
          },
        })

        const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0)
        const orderCount = customerOrders.length
        const lastOrderDate = customerOrders.length > 0
          ? customerOrders[0].createdAt
          : order.customer.createdAt

        customerMap.set(customerId, {
          id: customerId,
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone || '',
          avatar: order.customer.avatar || '',
          totalSpent: parseFloat(totalSpent.toFixed(2)),
          orderCount,
          lastOrderDate: lastOrderDate.toISOString().split('T')[0],
          joinedDate: order.customer.createdAt.toISOString().split('T')[0],
        })
      }
    }

    let customers = Array.from(customerMap.values())

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        (c.phone && c.phone.includes(search))
      )
    }

    // Sort by last order date (most recent first)
    customers.sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime())

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Get vendor customers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
