import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../src/lib/prisma'
import { StoreStatus } from '@prisma/client'

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

    // Get store products
    const storeProducts = await prisma.storeProduct.findMany({
      where: {
        storeId: store.id,
        status: 'active', // Only active products
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

    // Format products for public view
    const formattedProducts = storeProducts.map((sp) => ({
      id: sp.product.id,
      name: sp.product.name,
      description: sp.product.description || '',
      sku: sp.product.sku,
      price: sp.sellingPrice, // Vendor's selling price
      originalPrice: sp.product.sellingPrice, // Original product price
      images: sp.product.images || [],
      image: sp.product.images?.[0] || '/placeholder-image.jpg',
      category: sp.product.category?.name || 'Uncategorized',
      categoryId: sp.product.categoryId,
      tags: sp.product.tags.map((pt) => pt.tag.name),
      stock: sp.product.stock,
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
    }))

    return NextResponse.json({
      products: formattedProducts,
      total: formattedProducts.length,
    })
  } catch (error) {
    console.error('Get public store products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

