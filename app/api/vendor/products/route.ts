import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

// GET /api/vendor/products - Get vendor's products (StoreProduct entries)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')
    const storeId = searchParams.get('storeId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 401 }
      )
    }

    // Verify vendor exists and get their stores
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDOR' },
      include: {
        storesAsVendor: {
          select: { id: true, name: true },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const vendorStoreIds = vendor.storesAsVendor.map(s => s.id)

    if (vendorStoreIds.length === 0) {
      return NextResponse.json({ products: [], stores: [], categories: [] })
    }

    // Build where clause
    const whereClause: any = {
      storeId: { in: vendorStoreIds },
    }

    if (storeId && storeId !== 'all') {
      whereClause.storeId = storeId
    }

    if (status && status !== 'all') {
      whereClause.status = status.toLowerCase()
    }

    // Fetch StoreProduct entries with related data
    const storeProducts = await prisma.storeProduct.findMany({
      where: whereClause,
      include: {
        product: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            supplier: {
              select: {
                id: true,
                name: true,
                businessName: true,
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
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Filter by search query and category
    let filteredProducts = storeProducts

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(sp =>
        sp.product.name.toLowerCase().includes(searchLower) ||
        sp.product.sku.toLowerCase().includes(searchLower)
      )
    }

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(
        sp => sp.product.category?.name === category
      )
    }

    // Format response
    const formattedProducts = filteredProducts.map(sp => {
      const supplierPrice = sp.product.supplierId ? sp.product.costPrice : 0
      const retailPrice = sp.sellingPrice
      const margin = supplierPrice > 0
        ? ((retailPrice - supplierPrice) / supplierPrice) * 100
        : 0

      // Determine status based on product stock
      let status = sp.status || 'active'
      if (sp.product.stock === 0) {
        status = 'out-of-stock'
      } else if (sp.product.stock < (sp.product.stockAlertThreshold || 10)) {
        status = 'low-stock'
      }

      return {
        id: sp.id,
        name: sp.product.name,
        sku: sp.product.sku,
        store: sp.store.name,
        storeId: sp.storeId,
        category: sp.product.category?.name || 'Uncategorized',
        supplier: sp.product.supplier?.businessName || sp.product.supplier?.name || 'Self Created',
        supplierPrice,
        retailPrice,
        margin: parseFloat(margin.toFixed(1)),
        stock: sp.product.stock,
        status,
        image: sp.product.images?.[0] || '/placeholder-image.jpg',
        images: sp.product.images || [],
        importedDate: sp.createdAt.toISOString().split('T')[0],
        description: sp.product.description || '',
        metaTitle: sp.metaTitle || '',
        metaDescription: sp.metaDescription || '',
        metaKeywords: sp.metaKeywords || [],
        productId: sp.productId,
      }
    })

    // Get unique stores and categories for filters
    const uniqueStores = vendor.storesAsVendor
    const uniqueCategories = Array.from(
      new Set(
        filteredProducts
          .map(sp => sp.product.category?.name)
          .filter(Boolean) as string[]
      )
    )

    return NextResponse.json({
      products: formattedProducts,
      stores: uniqueStores,
      categories: uniqueCategories,
    })
  } catch (error) {
    console.error('Get vendor products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// PUT /api/vendor/products/[id] - Update store product (price, SEO)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeProductId, sellingPrice, metaTitle, metaDescription, metaKeywords } = body

    if (!storeProductId) {
      return NextResponse.json(
        { error: 'Store Product ID is required' },
        { status: 400 }
      )
    }

    // Get the store product to verify it exists and get supplier price
    const storeProduct = await prisma.storeProduct.findUnique({
      where: { id: storeProductId },
      include: {
        product: {
          select: {
            costPrice: true,
            supplierId: true,
          },
        },
      },
    })

    if (!storeProduct) {
      return NextResponse.json(
        { error: 'Store product not found' },
        { status: 404 }
      )
    }

    // Validate selling price if it's a supplier product
    if (storeProduct.product.supplierId && sellingPrice) {
      if (parseFloat(sellingPrice) <= storeProduct.product.costPrice) {
        return NextResponse.json(
          { error: 'Selling price must be higher than supplier price' },
          { status: 400 }
        )
      }
    }

    // Update store product
    const updateData: any = {}
    if (sellingPrice) updateData.sellingPrice = parseFloat(sellingPrice)
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle || null
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription || null
    if (metaKeywords !== undefined) updateData.metaKeywords = metaKeywords || []

    const updatedStoreProduct = await prisma.storeProduct.update({
      where: { id: storeProductId },
      data: updateData,
    })

    return NextResponse.json({
      message: 'Product updated successfully',
      storeProduct: updatedStoreProduct,
    })
  } catch (error) {
    console.error('Update vendor product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

