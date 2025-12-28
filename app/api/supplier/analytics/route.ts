import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/supplier/analytics - Get supplier analytics data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supplierId = searchParams.get('supplierId')
    const dateRange = searchParams.get('dateRange') || '30'

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

    // Calculate date range
    const now = new Date()
    const daysAgo = parseInt(dateRange)
    const dateFrom = new Date(now)
    dateFrom.setDate(dateFrom.getDate() - daysAgo)

    // Get order items for this supplier within date range
    const orderItems = await prisma.orderItem.findMany({
      where: {
        supplierId,
        order: {
          createdAt: { gte: dateFrom },
        },
      },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            total: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    })

    // Calculate stats
    const totalRevenue = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const totalOrders = Array.from(
      new Set(orderItems.map((item) => item.orderId))
    ).length

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Sales trend (by day)
    const salesByDay: Record<string, number> = {}
    orderItems.forEach((item) => {
      const day = item.order.createdAt.toISOString().split('T')[0]
      const dayRevenue = item.price * item.quantity
      salesByDay[day] = (salesByDay[day] || 0) + dayRevenue
    })

    const salesTrend = Object.entries(salesByDay)
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: parseFloat(revenue.toFixed(2)),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date + ', 2024')
        const dateB = new Date(b.date + ', 2024')
        return dateA.getTime() - dateB.getTime()
      })

    // Order volume trend
    const ordersByDay: Record<string, number> = {}
    orderItems.forEach((item) => {
      const day = item.order.createdAt.toISOString().split('T')[0]
      if (!ordersByDay[day]) {
        ordersByDay[day] = 0
      }
    })
    Array.from(new Set(orderItems.map((item) => item.orderId))).forEach((orderId) => {
      const item = orderItems.find((i) => i.orderId === orderId)
      if (item) {
        const day = item.order.createdAt.toISOString().split('T')[0]
        ordersByDay[day] = (ordersByDay[day] || 0) + 1
      }
    })

    const orderVolumeTrend = Object.entries(ordersByDay)
      .map(([date, orders]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date + ', 2024')
        const dateB = new Date(b.date + ', 2024')
        return dateA.getTime() - dateB.getTime()
      })

    // Top products
    const productRevenue: Record<string, { name: string; revenue: number; orders: number }> = {}
    orderItems.forEach((item) => {
      const productId = item.productId || 'unknown'
      if (!productRevenue[productId]) {
        productRevenue[productId] = {
          name: item.product?.name || 'Unknown',
          revenue: 0,
          orders: 0,
        }
      }
      productRevenue[productId].revenue += item.price * item.quantity
    })

    // Count unique orders per product
    const productOrders: Record<string, Set<string>> = {}
    orderItems.forEach((item) => {
      const productId = item.productId || 'unknown'
      if (!productOrders[productId]) {
        productOrders[productId] = new Set()
      }
      productOrders[productId].add(item.orderId)
    })

    Object.keys(productRevenue).forEach((productId) => {
      productRevenue[productId].orders = productOrders[productId]?.size || 0
    })

    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        revenue: parseFloat(p.revenue.toFixed(2)),
        orders: p.orders,
      }))

    // Order status distribution
    const orderStatusCounts: Record<string, number> = {}
    Array.from(new Set(orderItems.map((item) => item.orderId))).forEach((orderId) => {
      const item = orderItems.find((i) => i.orderId === orderId)
      if (item) {
        const status = item.order.status.toLowerCase()
        orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1
      }
    })

    const orderStatus = Object.entries(orderStatusCounts).map(([status, count]) => ({
      status,
      count,
    }))

    return NextResponse.json({
      stats: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      },
      salesTrend,
      orderVolumeTrend,
      topProducts,
      orderStatus,
    })
  } catch (error) {
    console.error('Get supplier analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

