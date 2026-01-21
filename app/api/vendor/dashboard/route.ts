import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

export const dynamic = 'force-dynamic' // Ensure this route is always treated as dynamic

// GET /api/vendor/dashboard - Get vendor dashboard data
// GET /api/vendor/dashboard - Get vendor dashboard data
export async function GET(request: NextRequest) {
  try {
    // TODO: Get vendor ID from session/auth token
    // For now, we'll get it from query params (should be from auth in production)
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 401 }
      )
    }

    // Verify vendor exists and get active store IDs
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDOR' },
      include: {
        storesAsVendor: {
          select: {
            id: true,
            status: true,
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
    const activeStoreIds = vendor.storesAsVendor
      .filter(store => store.status === 'ACTIVE')
      .map(store => store.id)

    if (storeIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalRevenue: 0,
          totalOrders: 0,
          activeProducts: 0,
          activeStores: 0,
          totalProducts: 0,
          totalStores: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          avgOrderValue: 0,
        },
        salesData: [],
        categoryData: [],
        topProducts: [],
        recentActivity: [],
        recentOrders: [],
      })
    }

    // 1. Parallelize independent queries for better performance
    const [
      revenueAgg,
      ordersCountAgg,
      storeProductsAgg,
      recentOrders,
      chartDataRaw,
      topProductsRaw
    ] = await Promise.all([
      // Total Revenue
      prisma.order.aggregate({
        _sum: { total: true },
        where: { storeId: { in: storeIds } }
      }),

      // Order Status Counts
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
        where: { storeId: { in: storeIds } }
      }),

      // Store Products Stats
      prisma.storeProduct.groupBy({
        by: ['status'],
        _count: true,
        where: { storeId: { in: storeIds } }
      }),

      // Recent Orders (Table)
      prisma.order.findMany({
        where: { storeId: { in: storeIds } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          createdAt: true,
          total: true,
          status: true,
          customer: { select: { name: true } },
          _count: { select: { items: true } }
        }
      }),

      // Chart Data (Last 6 Months) - Optimized Select
      prisma.order.findMany({
        where: {
          storeId: { in: storeIds },
          createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        },
        select: {
          createdAt: true,
          total: true
        }
      }),

      // Top Products (Simplified approach for performance)
      prisma.storeProduct.findMany({
        where: { storeId: { in: storeIds } },
        take: 5,
        orderBy: { product: { orderItems: { _count: 'desc' } } }, // Order by popularity
        include: {
          product: {
            select: {
              name: true,
              rating: true,
              orderItems: {
                where: { order: { storeId: { in: storeIds } } },
                select: {
                  quantity: true,
                  price: true
                }
              }
            }
          }
        }
      })
    ])

    // Process Aggregated Data
    const totalRevenue = revenueAgg._sum.total || 0
    const totalOrders = ordersCountAgg.reduce((acc, curr) => acc + curr._count, 0)

    // Status Counts
    const getStatusCount = (status: string) =>
      ordersCountAgg.find(o => o.status === status)?._count || 0

    const pendingOrders = getStatusCount('PENDING')
    const processingOrders = getStatusCount('PROCESSING')
    const shippedOrders = getStatusCount('SHIPPED')
    const deliveredOrders = getStatusCount('DELIVERED')

    // Product Stats
    const totalProducts = storeProductsAgg.reduce((acc, curr) => acc + curr._count, 0)
    const activeProducts = storeProductsAgg.find(p => p.status === 'active')?._count || 0

    // Average Order Value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Process Chart Data
    const revenueByWeek: Record<string, { sales: number; orders: number; revenue: number }> = {}
    chartDataRaw.forEach(order => {
      const weekStart = new Date(order.createdAt)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]

      if (!revenueByWeek[weekKey]) {
        revenueByWeek[weekKey] = { sales: 0, orders: 0, revenue: 0 }
      }
      revenueByWeek[weekKey].orders += 1
      revenueByWeek[weekKey].revenue += order.total
    })

    const salesData = Object.entries(revenueByWeek)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sales: data.orders,
        orders: data.orders,
        revenue: parseFloat(data.revenue.toFixed(2)),
      }))

    // Fill empty data if needed (logic simplified for brevity, can be expanded if empty graphs are issue)
    if (salesData.length === 0) {
      // ... existing empty state logic if needed
    }

    // Process Top Products
    const topProducts = topProductsRaw.map(sp => {
      const sales = sp.product.orderItems.reduce((acc, item) => acc + item.quantity, 0)
      const revenue = sp.product.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
      return {
        name: sp.product.name,
        sales,
        revenue: parseFloat(revenue.toFixed(2)),
        rating: sp.product.rating || 0,
        trend: 0
      }
    }).filter(p => p.sales > 0)

    // Process Recent Orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      customer: order.customer?.name || 'Unknown',
      total: order.total,
      status: order.status.toLowerCase(),
      items: order._count.items,
    }))

    // Recent Activity (Stub or simplified query)
    const recentActivity = formattedRecentOrders.slice(0, 4).map(order => ({
      type: 'order',
      message: `New order ${order.orderNumber} from ${order.customer}`,
      time: 'Just now' // Simplified time calculation
    }))

    return NextResponse.json({
      stats: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        activeProducts,
        activeStores: activeStoreIds.length,
        totalProducts,
        totalStores: storeIds.length,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      },
      salesData,
      categoryData: [], // TODO: implementations for categories if needed, separate query recommended
      topProducts,
      recentActivity,
      recentOrders: formattedRecentOrders,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      }
    })

  } catch (error) {
    console.error('Get vendor dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
// Helper function to get category colors
function getCategoryColor(categoryName: string): string {
  const colors: Record<string, string> = {
    'Electronics': '#6366f1',
    'Fashion': '#8b5cf6',
    'Home': '#06b6d4',
    'Sports': '#10b981',
    'Books': '#f59e0b',
    'Others': '#ef4444',
  }
  return colors[categoryName] || colors['Others']
}

