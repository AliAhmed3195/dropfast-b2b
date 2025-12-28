import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { UserType } from '@prisma/client'

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateRange = searchParams.get('dateRange') || '30'
    
    // Calculate date range
    const now = new Date()
    const daysAgo = parseInt(dateRange)
    const dateFrom = new Date(now)
    dateFrom.setDate(dateFrom.getDate() - daysAgo)

    // Get all required data in parallel
    const [
      totalUsers,
      totalVendors,
      totalSuppliers,
      totalOrders,
      totalRevenue,
      totalProducts,
      totalStores,
      orders,
      allVendors,
      allSuppliers,
      allProducts,
      allUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserType.VENDOR } }),
      prisma.user.count({ where: { role: UserType.SUPPLIER } }),
      prisma.order.count({
        where: {
          createdAt: { gte: dateFrom },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: dateFrom },
        },
        _sum: { total: true },
      }),
      prisma.product.count(),
      prisma.store.count(),
      prisma.order.findMany({
        where: {
          createdAt: { gte: dateFrom },
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          total: true,
          customerId: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.findMany({
        where: {
          role: UserType.VENDOR,
        },
        include: {
          ordersAsCustomer: {
            where: {
              createdAt: { gte: dateFrom },
            },
            select: {
              total: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        where: {
          role: UserType.SUPPLIER,
        },
        include: {
          productsAsSupplier: {
            include: {
              orderItems: {
                where: {
                  order: {
                    createdAt: { gte: dateFrom },
                  },
                },
                select: {
                  price: true,
                  quantity: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.findMany({
        include: {
          orderItems: {
            where: {
              order: {
                createdAt: { gte: dateFrom },
              },
            },
            select: {
              price: true,
              quantity: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        where: {
          createdAt: { gte: dateFrom },
        },
        select: {
          createdAt: true,
          role: true,
        },
      }),
    ])

    // Calculate revenue trend (last 30 days by default)
    const revenueByDate: Record<string, number> = {}
    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0]
      const date = new Date(dateKey)
      const formattedDate = `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
      revenueByDate[formattedDate] = (revenueByDate[formattedDate] || 0) + order.total
    })

    // Generate last 30 days dates for revenue trend
    const revenueTrend = []
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const formattedDate = `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
      revenueTrend.push({
        date: formattedDate,
        revenue: revenueByDate[formattedDate] || 0,
      })
    }

    // Calculate order status distribution
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status.toLowerCase()
      const statusMap: Record<string, string> = {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
      }
      const statusName = statusMap[status] || status
      if (!acc[statusName]) {
        acc[statusName] = { name: statusName, value: 0, color: getStatusColor(statusName) }
      }
      acc[statusName].value += 1
      return acc
    }, {} as Record<string, { name: string; value: number; color: string }>)

    const orderStatus = Object.values(statusCounts)

    // Calculate order volume trend
    const orderVolumeByDate: Record<string, number> = {}
    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0]
      const date = new Date(dateKey)
      const formattedDate = `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
      orderVolumeByDate[formattedDate] = (orderVolumeByDate[formattedDate] || 0) + 1
    })

    const orderVolumeTrend = []
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const formattedDate = `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
      orderVolumeTrend.push({
        date: formattedDate,
        orders: orderVolumeByDate[formattedDate] || 0,
      })
    }

    // Calculate top vendors by revenue
    const topVendors = allVendors
      .map(vendor => {
        const revenue = vendor.ordersAsCustomer.reduce((sum, order) => sum + order.total, 0)
        return {
          name: vendor.businessName || vendor.name,
          revenue: revenue,
        }
      })
      .filter(v => v.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Calculate top suppliers by orders
    const topSuppliers = allSuppliers
      .map(supplier => {
        const orderCount = supplier.productsAsSupplier.reduce((sum, product) => {
          return sum + product.orderItems.length
        }, 0)
        return {
          name: supplier.businessName || supplier.name,
          orders: orderCount,
        }
      })
      .filter(s => s.orders > 0)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)

    // Calculate top products
    const topProducts = allProducts
      .map(product => {
        const units = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
        const revenue = product.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        return {
          id: product.id,
          name: product.name,
          units: units,
          revenue: revenue,
        }
      })
      .filter(p => p.units > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Calculate user registration trend
    const userRegByDate: Record<string, number> = {}
    allUsers.forEach(user => {
      const dateKey = user.createdAt.toISOString().split('T')[0]
      const date = new Date(dateKey)
      const formattedDate = `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
      userRegByDate[formattedDate] = (userRegByDate[formattedDate] || 0) + 1
    })

    const userRegistration = []
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const formattedDate = `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
      userRegistration.push({
        date: formattedDate,
        users: userRegByDate[formattedDate] || 0,
      })
    }

    // Calculate user type distribution
    const totalCustomers = totalUsers - totalVendors - totalSuppliers
    const userType = [
      { name: 'Customers', value: totalCustomers, color: '#6366f1' },
      { name: 'Vendors', value: totalVendors, color: '#06b6d4' },
      { name: 'Suppliers', value: totalSuppliers, color: '#10b981' },
    ]

    // Calculate previous period for comparison
    const previousDateFrom = new Date(dateFrom)
    previousDateFrom.setDate(previousDateFrom.getDate() - daysAgo)
    
    const [previousOrders, previousRevenue] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: {
            gte: previousDateFrom,
            lt: dateFrom,
          },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: previousDateFrom,
            lt: dateFrom,
          },
        },
        _sum: { total: true },
      }),
    ])

    const previousRevenueTotal = previousRevenue._sum.total || 0
    const currentRevenueTotal = totalRevenue._sum.total || 0
    const revenueChange = previousRevenueTotal > 0
      ? ((currentRevenueTotal - previousRevenueTotal) / previousRevenueTotal) * 100
      : 0

    const ordersChange = previousOrders > 0
      ? ((totalOrders - previousOrders) / previousOrders) * 100
      : 0

    const avgOrderValue = totalOrders > 0 ? currentRevenueTotal / totalOrders : 0
    const previousAvgOrderValue = previousOrders > 0 ? previousRevenueTotal / previousOrders : 0
    const avgChange = previousAvgOrderValue > 0
      ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100
      : 0

    // Get new users this month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const newUsers = await prisma.user.count({
      where: {
        createdAt: { gte: monthStart },
      },
    })

    // Get active vendors (vendors with orders)
    const activeVendors = allVendors.filter(v => v.ordersAsCustomer.length > 0).length

    // Get active suppliers (suppliers with products that have orders)
    const activeSuppliers = allSuppliers.filter(s => 
      s.productsAsSupplier.some(p => p.orderItems.length > 0)
    ).length

    return NextResponse.json({
      stats: {
        totalRevenue: currentRevenueTotal,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        avgChange: parseFloat(avgChange.toFixed(1)),
        totalOrders,
        ordersChange: parseFloat(ordersChange.toFixed(1)),
        totalUsers,
        newUsers,
        activeVendors,
        activeSuppliers,
      },
      revenueTrend,
      orderStatus,
      orderVolumeTrend,
      topVendors,
      topSuppliers,
      topProducts,
      userRegistration,
      userType,
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'Delivered': '#10b981',
    'Shipped': '#6366f1',
    'Processing': '#06b6d4',
    'Pending': '#f59e0b',
    'Cancelled': '#ef4444',
  }
  return colorMap[status] || '#6b7280'
}

