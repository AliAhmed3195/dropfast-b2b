import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../src/lib/prisma'
import { StoreStatus } from '@prisma/client'
import { convertFromUSD, getExchangeRate } from '../../../../../../src/lib/currency'

// GET /api/public/store/[slug]/products - Get products for a public store
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Find store by slug
    const store = await prisma.store.findUnique({
      where: { slug: params.slug },
      select: { id: true, status: true },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Only return products if store is ACTIVE
    if (store.status !== StoreStatus.ACTIVE) {
      return NextResponse.json(
        { error: 'Store is not available' },
        { status: 403 }
      )
    }

    // Get currency from query param (default to USD)
    const currency = request.nextUrl.searchParams.get('currency') || 'USD'

    // Get store products
    const storeProducts = await prisma.storeProduct.findMany({
      where: {
        storeId: store.id,
        status: 'active', // Only active products
      },
      include: {
        product: {
          include: {
            supplier: {
              select: {
                id: true,
                name: true,
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get exchange rate
    const exchangeRate = getExchangeRate('USD', currency)

    // Format products for public view
    const formattedProducts = storeProducts.map((sp) => {
      const priceUSD = sp.sellingPrice // Vendor's selling price in USD
      const originalPriceUSD = sp.product.sellingPrice // Supplier's price in USD
      const price = convertFromUSD(priceUSD, currency)
      const originalPrice = convertFromUSD(originalPriceUSD, currency)

      return {
        id: sp.product.id,
        name: sp.product.name,
        description: sp.product.description || '',
        sku: sp.product.sku,
        price, // Converted to customer currency (for display)
        priceUSD, // Original USD price
        originalPrice, // Converted original price (for display)
        originalPriceUSD, // Original USD price
        images: sp.product.images || [],
        image: sp.product.images?.[0] || '/placeholder-image.jpg',
        category: sp.product.category?.name || 'Uncategorized',
        categoryId: sp.product.categoryId,
        tags: sp.product.tags.map((pt) => pt.tag.name),
        stock: sp.product.stock || 0,
        inStock: (sp.product.stock || 0) > 0 && sp.product.status === 'ACTIVE' && sp.status === 'active',
        status: sp.product.status.toLowerCase(),
        rating: sp.product.rating || 0,
        reviews: 0, // TODO: Calculate from reviews
        brand: sp.product.brand || '',
        condition: sp.product.condition.toLowerCase().replace(/_/g, '-'),
        // Store product specific
        storeProductId: sp.id,
        metaTitle: sp.metaTitle,
        metaDescription: sp.metaDescription,
        metaKeywords: sp.metaKeywords,
        // Supplier info
        supplierId: sp.product.supplierId,
        supplierName: sp.product.supplier?.name || null,
        // Currency info
        currency,
        exchangeRate,
      }
    })

    return NextResponse.json({
      products: formattedProducts,
      total: formattedProducts.length,
      currency,
      exchangeRate,
    })
  } catch (error) {
    console.error('Get public store products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

