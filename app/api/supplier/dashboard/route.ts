import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/supplier/dashboard - Get supplier dashboard data
export async function GET(request: NextRequest) {
  try {
    // TODO: Get supplier ID from session/auth token
    // For now, we'll get it from query params (should be from auth in production)
    const searchParams = request.nextUrl.searchParams
    const supplierId = searchParams.get('supplierId')
    
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

    // Get all products first for low stock calculation
    const allProducts = await prisma.product.findMany({
      where: { supplierId },
      select: { id: true, stock: true, stockAlertThreshold: true, status: true },
    })

    // Calculate low stock count
    const lowStockProducts = allProducts.filter(
      (p) => p.stock > 0 && p.stockAlertThreshold && p.stock <= p.stockAlertThreshold
    ).length

    // Get order items for this supplier
    const supplierOrderItems = await prisma.orderItem.findMany({
      where: { supplierId },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            total: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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

    // Get unique order IDs
    const orderIds = Array.from(new Set(supplierOrderItems.map(item => item.orderId)))

    // Get stats
    const totalProducts = allProducts.length
    const activeProducts = allProducts.filter((p) => p.status === 'ACTIVE').length
    const outOfStockProducts = allProducts.filter((p) => p.stock === 0).length

    // Order counts
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      select: { id: true, status: true },
    })

    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length
    const processingOrders = orders.filter((o) => o.status === 'PROCESSING').length
    const shippedOrders = orders.filter((o) => o.status === 'SHIPPED').length

    // Total revenue
    const totalRevenue = supplierOrderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // Recent orders (last 5)
    const recentOrderIds = Array.from(new Set(supplierOrderItems.map(item => item.orderId))).slice(0, 5)
    const recentOrdersData = await prisma.order.findMany({
      where: { id: { in: recentOrderIds } },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          where: { supplierId },
          select: {
            id: true,
            quantity: true,
            price: true,
            productName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Top products (with order counts)
    const productsWithOrders = await prisma.product.findMany({
      where: { supplierId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    // Calculate revenue trend (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentOrderItems = await prisma.orderItem.findMany({
      where: {
        supplierId,
        order: {
          createdAt: { gte: sixMonthsAgo },
        },
      },
      include: {
        order: {
          select: {
            createdAt: true,
          },
        },
      },
    })

    // Group by month
    const revenueByMonth: Record<string, number> = {}
    recentOrderItems.forEach((item) => {
      const month = item.order.createdAt.toISOString().substring(0, 7) // YYYY-MM
      const itemRevenue = item.price * item.quantity
      revenueByMonth[month] = (revenueByMonth[month] || 0) + itemRevenue
    })

    // Format for chart
    const revenueTrend = Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        revenue: parseFloat(revenue.toFixed(2)),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month + ' 1, 2024')
        const dateB = new Date(b.month + ' 1, 2024')
        return dateA.getTime() - dateB.getTime()
      })

    // Format products with order counts
    const formattedProducts = productsWithOrders.map((product) => {
      const productOrderItems = supplierOrderItems.filter(
        (item) => item.productId === product.id
      )
      const orderCount = Array.from(new Set(productOrderItems.map(item => item.orderId))).length
      const totalRevenue = productOrderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category?.name || '',
        stock: product.stock,
        price: product.sellingPrice,
        status: product.status.toLowerCase(),
        orders: orderCount,
        revenue: parseFloat(totalRevenue.toFixed(2)),
      }
    })

    // Format recent orders
    const formattedOrders = recentOrdersData.map((order) => ({
      id: order.id,
      date: order.createdAt.toISOString().split('T')[0],
      customer: order.customer?.name || 'Unknown',
      total: order.total,
      status: order.status.toLowerCase(),
      items: order.items.length,
    }))

    return NextResponse.json({
      stats: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      },
      revenueTrend,
      products: formattedProducts,
      recentOrders: formattedOrders,
    })
  } catch (error) {
    console.error('Get supplier dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
