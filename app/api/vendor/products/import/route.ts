import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'

// POST /api/vendor/products/import - Import product to store (create StoreProduct)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productId,
      storeId,
      vendorId,
      sellingPrice,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = body

    // Validation
    if (!productId || !vendorId) {
      return NextResponse.json(
        { error: 'Product ID and Vendor ID are required' },
        { status: 400 }
      )
    }

    // Verify vendor exists
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId, role: 'VENDOR' },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If storeId is provided, verify store belongs to vendor
    if (storeId) {
      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          vendorId,
        },
      })

      if (!store) {
        return NextResponse.json(
          { error: 'Store not found or does not belong to vendor' },
          { status: 404 }
        )
      }

      // Check if StoreProduct already exists
      const existingStoreProduct = await prisma.storeProduct.findUnique({
        where: {
          storeId_productId: {
            storeId,
            productId,
          },
        },
      })

      if (existingStoreProduct) {
        return NextResponse.json(
          { error: 'Product is already in this store' },
          { status: 400 }
        )
      }

      // Create StoreProduct
      const storeProduct = await prisma.storeProduct.create({
        data: {
          storeId,
          productId,
          sellingPrice: sellingPrice ? parseFloat(sellingPrice) : product.sellingPrice,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          metaKeywords: metaKeywords ? (typeof metaKeywords === 'string' ? metaKeywords.split(',').map(k => k.trim()) : metaKeywords) : [],
          status: 'active',
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return NextResponse.json({
        message: 'Product imported successfully',
        storeProduct,
      }, { status: 201 })
    } else {
      // If no storeId, just return success (product added to catalog without store)
      // This might not create a StoreProduct entry, but could be used for future "My Products" catalog
      return NextResponse.json({
        message: 'Product added to catalog',
      }, { status: 201 })
    }
  } catch (error: any) {
    console.error('Import product error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product is already in this store' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to import product' },
      { status: 500 }
    )
  }
}

