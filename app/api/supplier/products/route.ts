import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/supplier/products - Get supplier's products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supplierId = searchParams.get('supplierId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

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

    const where: any = { supplierId }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (category && category !== 'all') {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category },
      })
      if (categoryRecord) {
        where.categoryId = categoryRecord.id
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        orderItems: {
          select: {
            quantity: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response
    const formattedProducts = products.map((product) => {
      const orderCount = Array.from(
        new Set(product.orderItems.map((item: any) => item.orderId))
      ).length
      const totalRevenue = product.orderItems.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      )

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category?.name || '',
        subcategory: product.subcategory || '',
        stock: product.stock,
        price: product.sellingPrice,
        status: product.status.toLowerCase(),
        orders: orderCount,
        revenue: parseFloat(totalRevenue.toFixed(2)),
        description: product.description || '',
        moq: product.moq,
        image: product.images[0] || '',
        images: product.images || [],
        tags: product.tags.map((pt) => pt.tag.name),
        createdAt: product.createdAt.toISOString(),
      }
    })

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error('Get supplier products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

