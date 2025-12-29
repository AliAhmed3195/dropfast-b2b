import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

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

    // Verify vendor exists
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

    // Get all orders for vendor's stores
    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: storeIds },
      },
      include: {
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get store products count
    const storeProducts = await prisma.storeProduct.findMany({
      where: {
        storeId: { in: storeIds },
      },
      select: {
        id: true,
        status: true,
      },
    })

    // Calculate stats
    const totalStores = storeIds.length
    const activeStores = activeStoreIds.length
    const totalProducts = storeProducts.length
    const activeProducts = storeProducts.filter(sp => sp.status === 'active').length

    // Order stats
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length
    const processingOrders = orders.filter(o => o.status === 'PROCESSING').length
    const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length

    // Total revenue (sum of all order totals)
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      customer: order.customer?.name || 'Unknown',
      total: order.total,
      status: order.status.toLowerCase(),
      items: order.items.length,
    }))

    // Revenue trend (last 6 months by week)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentOrdersData = orders.filter(
      order => order.createdAt >= sixMonthsAgo
    )

    // Group by week
    const revenueByWeek: Record<string, { sales: number; orders: number; revenue: number }> = {}
    
    recentOrdersData.forEach(order => {
      const weekStart = new Date(order.createdAt)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!revenueByWeek[weekKey]) {
        revenueByWeek[weekKey] = { sales: 0, orders: 0, revenue: 0 }
      }
      
      revenueByWeek[weekKey].orders += 1
      revenueByWeek[weekKey].revenue += order.total
    })

    // Format for chart (last 7 weeks)
    const sortedWeeks = Object.entries(revenueByWeek)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)

    const salesData = sortedWeeks.map(([date, data]) => {
      const weekDate = new Date(date)
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return {
        date: dayNames[weekDate.getDay()],
        sales: data.orders,
        orders: data.orders,
        revenue: parseFloat(data.revenue.toFixed(2)),
      }
    })

    // If no sales data, create empty structure for last 7 days
    if (salesData.length === 0) {
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        salesData.push({
          date: dayNames[date.getDay()],
          sales: 0,
          orders: 0,
          revenue: 0,
        })
      }
    }

    // Category distribution (from store products)
    const storeProductsWithCategories = await prisma.storeProduct.findMany({
      where: {
        storeId: { in: storeIds },
      },
      include: {
        product: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    const categoryCounts: Record<string, number> = {}
    storeProductsWithCategories.forEach(sp => {
      const categoryName = sp.product.category?.name || 'Others'
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
    })

    const totalCategoryCount = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
    
    const categoryData = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        value: totalCategoryCount > 0 ? Math.round((count / totalCategoryCount) * 100) : 0,
        color: getCategoryColor(name),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Top products (best selling products from orders)
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {}
    
    orders.forEach(order => {
      order.items.forEach(item => {
        // We can get product info from order items, but for simplicity,
        // we'll get top products from store products
      })
    })

    // Get top products by store products with most orders
    const topStoreProducts = await prisma.storeProduct.findMany({
      where: {
        storeId: { in: storeIds },
      },
      include: {
        product: {
          include: {
            orderItems: {
              where: {
                order: {
                  storeId: { in: storeIds },
                },
              },
              select: {
                quantity: true,
                price: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const topProducts = topStoreProducts.map(sp => {
      const orderItems = sp.product.orderItems
      const sales = orderItems.reduce((sum, item) => sum + item.quantity, 0)
      const revenue = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        name: sp.product.name,
        sales,
        revenue: parseFloat(revenue.toFixed(2)),
        rating: sp.product.rating || 0,
        trend: 0, // Can be calculated from historical data if needed
      }
    }).filter(p => p.sales > 0).slice(0, 5)

    // If no top products, create empty array
    if (topProducts.length === 0) {
      // Leave empty for empty state
    }

    // Recent activity (from orders)
    const recentActivity = orders.slice(0, 4).map(order => {
      const minutesAgo = Math.floor((Date.now() - order.createdAt.getTime()) / (1000 * 60))
      const hoursAgo = Math.floor(minutesAgo / 60)
      
      let timeAgo: string
      if (minutesAgo < 60) {
        timeAgo = `${minutesAgo} min ago`
      } else if (hoursAgo < 24) {
        timeAgo = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`
      } else {
        const daysAgo = Math.floor(hoursAgo / 24)
        timeAgo = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`
      }

      return {
        type: 'order',
        message: `New order ${order.orderNumber} from ${order.customer?.name || 'Unknown'}`,
        time: timeAgo,
      }
    })

    return NextResponse.json({
      stats: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        activeProducts,
        activeStores,
        totalProducts,
        totalStores,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      },
      salesData,
      categoryData,
      topProducts,
      recentActivity,
      recentOrders,
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

