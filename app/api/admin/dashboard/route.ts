import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { UserType } from '@prisma/client'

// GET /api/admin/dashboard - Get complete dashboard overview data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeRange = searchParams.get('timeRange') || '6m' // 3m, 6m, 12m

    // Calculate date range
    const now = new Date()
    let dateFrom: Date
    switch (timeRange) {
      case '3m':
        dateFrom = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case '12m':
        dateFrom = new Date(now.getFullYear() - 1, now.getMonth(), 1)
        break
      case '6m':
      default:
        dateFrom = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        break
    }

    // Get all stats in parallel
    const [
      totalUsers,
      totalVendors,
      totalSuppliers,
      totalOrders,
      totalRevenue,
      totalProducts,
      totalStores,
      allOrders,
      allVendors,
      allSuppliers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserType.VENDOR } }),
      prisma.user.count({ where: { role: UserType.SUPPLIER } }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: dateFrom,
          },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: dateFrom,
          },
        },
        _sum: { total: true },
      }),
      prisma.product.count(),
      prisma.store.count(),
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: dateFrom,
          },
        },
        select: {
          id: true,
          total: true,
          createdAt: true,
          status: true,
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
              createdAt: {
                gte: dateFrom,
              },
            },
            select: {
              total: true,
            },
          },
          storesAsVendor: {
            select: {
              id: true,
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
                    createdAt: {
                      gte: dateFrom,
                    },
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
    ])

    // Calculate revenue trend by month
    const revenueByMonth: Record<string, { revenue: number; orders: number }> = {}
    
    allOrders.forEach(order => {
      const monthKey = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = { revenue: 0, orders: 0 }
      }
      revenueByMonth[monthKey].revenue += order.total
      revenueByMonth[monthKey].orders += 1
    })

    // Format revenue trend data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const revenueTrend = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-')
        return {
          month: monthNames[parseInt(month) - 1],
          revenue: data.revenue,
          orders: data.orders,
        }
      })

    // Calculate top performers (vendors and suppliers by revenue)
    const vendorPerformers = allVendors
      .map(vendor => {
        const revenue = vendor.ordersAsCustomer.reduce((sum, order) => sum + order.total, 0)
        const previousPeriodRevenue = 0 // TODO: Calculate from previous period for growth
        const growth = previousPeriodRevenue > 0 
          ? ((revenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
          : 0

        return {
          name: vendor.businessName || vendor.name,
          type: 'Vendor' as const,
          revenue: revenue,
          growth: parseFloat(growth.toFixed(1)),
        }
      })
      .filter(p => p.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)

    const supplierPerformers = allSuppliers
      .map(supplier => {
        // Calculate revenue from order items of supplier's products
        const revenue = supplier.productsAsSupplier.reduce((sum, product) => {
          const productRevenue = product.orderItems.reduce((itemSum, item) => {
            return itemSum + (item.price * item.quantity)
          }, 0)
          return sum + productRevenue
        }, 0)
        
        const previousPeriodRevenue = 0 // TODO: Calculate from previous period for growth
        const growth = previousPeriodRevenue > 0 
          ? ((revenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
          : 0

        return {
          name: supplier.businessName || supplier.name,
          type: 'Supplier' as const,
          revenue: revenue,
          growth: parseFloat(growth.toFixed(1)),
        }
      })
      .filter(p => p.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)

    // Combine and sort top performers
    const topPerformers = [...vendorPerformers, ...supplierPerformers]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)

    // User distribution
    const totalCustomers = totalUsers - totalVendors - totalSuppliers
    const userDistribution = [
      { name: 'Suppliers', value: totalSuppliers, color: '#8b5cf6' },
      { name: 'Vendors', value: totalVendors, color: '#06b6d4' },
      { name: 'Customers', value: totalCustomers, color: '#10b981' },
    ]

    // Calculate percentage changes (TODO: Compare with previous period)
    const stats = {
      totalRevenue: totalRevenue._sum.total || 0,
      totalUsers,
      totalOrders,
      totalProducts,
      totalVendors,
      totalSuppliers,
      totalStores,
      // Percentage changes (mock for now, can be calculated from previous period)
      revenueChange: 12.5,
      usersChange: 8.2,
      ordersChange: 15.3,
      productsChange: 6.7,
    }

    return NextResponse.json({
      success: true,
      data: {
        stats,
        revenueTrend,
        userDistribution,
        topPerformers,
      },
    })
  } catch (error) {
    console.error('Get dashboard data error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch dashboard data' 
      },
      { status: 500 }
    )
  }
}

