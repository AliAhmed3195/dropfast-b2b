import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/vendor/inventory - Get all available products (supplier products + vendor's own)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')
    const category = searchParams.get('category')
    const supplier = searchParams.get('supplier')
    const search = searchParams.get('search')
    const productType = searchParams.get('productType') // 'all' | 'supplier' | 'own'

    // Get all supplier products (products with supplierId)
    const where: any = {}

    // Filter by product type
    if (productType === 'supplier') {
      // Only supplier products (products with supplierId)
      where.supplierId = { not: null }
    } else if (productType === 'own' && vendorId) {
      // Only vendor's own products (products in vendor's stores)
      const vendorStores = await prisma.store.findMany({
        where: { vendorId },
        select: { id: true },
      })
      const storeIds = vendorStores.map(s => s.id)
      
      if (storeIds.length === 0) {
        return NextResponse.json({ products: [] })
      }

      where.storeProducts = {
        some: {
          storeId: { in: storeIds },
        },
      }
    } else {
      // All products (both supplier products and vendor's own)
      // For 'all', fetch all products (with or without supplierId)
      // No filter needed
    }

    // Filter by category
    if (category && category !== 'all') {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category },
      })
      if (categoryRecord) {
        where.categoryId = categoryRecord.id
      }
    }

    // Filter by supplier name
    if (supplier && supplier !== 'all') {
      const supplierRecord = await prisma.user.findFirst({
        where: {
          role: 'SUPPLIER',
          OR: [
            { businessName: supplier },
            { name: supplier },
          ],
        },
      })
      if (supplierRecord) {
        where.supplierId = supplierRecord.id
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { sku: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format products
    const formattedProducts = products.map(product => {
      const hasSupplierId = product.supplierId !== null
      
      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        supplier: product.supplier?.businessName || product.supplier?.name || (hasSupplierId ? 'Unknown' : 'Self Created'),
        supplierId: product.supplierId,
        category: product.category?.name || 'Uncategorized',
        categoryId: product.categoryId,
        supplierPrice: product.costPrice, // Cost price from supplier
        moq: product.moq,
        stock: product.stock,
        image: product.images?.[0] || '',
        images: product.images || [],
        description: product.description || '',
        type: hasSupplierId ? 'supplier' : 'own', // Determine type based on supplierId
        tags: product.tags.map(pt => pt.tag.name),
      }
    })

    // Get unique suppliers for filter options
    const uniqueSuppliers = await prisma.user.findMany({
      where: {
        role: 'SUPPLIER',
        productsAsSupplier: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        businessName: true,
      },
    })

    // Get unique categories for filter options
    const uniqueCategories = await prisma.category.findMany({
      where: {
        products: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
      },
    })

    return NextResponse.json({
      products: formattedProducts,
      filters: {
        suppliers: uniqueSuppliers.map(s => s.businessName || s.name),
        categories: uniqueCategories.map(c => c.name),
      },
    })
  } catch (error) {
    console.error('Get vendor inventory error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

