import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { ProductCondition, UserType } from '@prisma/client'

// Map form condition values to Prisma enum values
function mapProductCondition(condition: string): ProductCondition {
  if (!condition) return ProductCondition.NEW
  
  const normalized = condition.toLowerCase().trim()
  
  // Map form values to Prisma enum values
  if (normalized === 'new') return ProductCondition.NEW
  if (normalized === 'refurbished') return ProductCondition.REFURBISHED
  if (normalized === 'used' || normalized === 'used-like-new') return ProductCondition.USED_LIKE_NEW
  if (normalized === 'used-good' || normalized === 'used_good') return ProductCondition.USED_GOOD
  
  // Fallback: try uppercase with underscore replacement
  const upperCondition = condition.toUpperCase().replace(/-/g, '_')
  if (upperCondition === 'NEW') return ProductCondition.NEW
  if (upperCondition === 'REFURBISHED') return ProductCondition.REFURBISHED
  if (upperCondition === 'USED_LIKE_NEW' || upperCondition === 'USED') return ProductCondition.USED_LIKE_NEW
  if (upperCondition === 'USED_GOOD' || upperCondition === 'USEDGOOD') return ProductCondition.USED_GOOD
  
  return ProductCondition.NEW
}

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const supplier = searchParams.get('supplier') // Supplier name (businessName or name)
    const vendor = searchParams.get('vendor') // Vendor name (businessName or name)
    const store = searchParams.get('store') // Store name

    const where: any = {}
    if (category && category !== 'all') {
      // Find category by name
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category },
      })
      if (categoryRecord) {
        where.categoryId = categoryRecord.id
      }
    }
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    if (supplier && supplier !== 'all') {
      // Find supplier by businessName or name
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
    if (vendor && vendor !== 'all') {
      // Find vendor and filter products by stores owned by that vendor
      const vendorRecord = await prisma.user.findFirst({
        where: {
          role: 'VENDOR',
          OR: [
            { businessName: vendor },
            { name: vendor },
          ],
        },
        include: {
          storesAsVendor: {
            select: { id: true },
          },
        },
      })
      if (vendorRecord && vendorRecord.storesAsVendor.length > 0) {
        const storeIds = vendorRecord.storesAsVendor.map(s => s.id)
        // Filter products that are in stores owned by this vendor
        where.storeProducts = {
          some: {
            storeId: { in: storeIds },
          },
        }
      } else {
        // If vendor not found or has no stores, return empty
        where.id = 'no-products'
      }
    }
    if (store && store !== 'all') {
      // Find store by name and filter products
      const storeRecord = await prisma.store.findFirst({
        where: { name: store },
      })
      if (storeRecord) {
        where.storeProducts = {
          some: {
            storeId: storeRecord.id,
          },
        }
      } else {
        // If store not found, return empty
        where.id = 'no-products'
      }
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
        storeProducts: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                vendor: {
                  select: {
                    id: true,
                    name: true,
                    businessName: true,
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

    // Format response
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category?.name || '',
      subcategory: product.subcategory || '',
      price: product.sellingPrice,
      moq: product.moq,
      stock: product.stock,
      status: product.status.toLowerCase(),
      addedBy: product.supplier.businessName || product.supplier.name,
      addedByType: 'supplier',
      image: product.images[0] || '',
      description: product.description || '',
      tags: product.tags.map(pt => pt.tag.name), // Extract tag names
      createdAt: product.createdAt.toISOString(),
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productName,
      description,
      brandName, // Will be mapped to 'brand' field
      sku,
      barcode,
      productStatus,
      baseCurrency,
      baseCostPrice,
      baseSellingPrice,
      stock,
      moq,
      stockAlertThreshold,
      category,
      categoryId: categoryIdFromBody, // Support both categoryId and category
      subcategory,
      tags,
      productCondition,
      warrantyPeriod,
      leadTime,
      weight,
      weightUnit,
      dimensions,
      shippingCost,
      hasVariants,
      variants,
      productImages,
      supplierId: supplierIdFromBody, // Optional: which supplier this product belongs to (if admin selects supplier)
      createdByUserId, // Required: who is creating this product (admin/supplier/vendor ID)
      createdByUserType, // Required: type of user creating (ADMIN, SUPPLIER, VENDOR)
    } = body

    let supplierId = supplierIdFromBody // Make it mutable for supplier case

    // Validation
    if (!productName || !sku || !baseSellingPrice) {
      return NextResponse.json(
        { error: 'Missing required fields: productName, sku, baseSellingPrice' },
        { status: 400 }
      )
    }

    // Validation: createdByUserId and createdByUserType are required
    if (!createdByUserId || !createdByUserType) {
      return NextResponse.json(
        { error: 'Created by user ID and user type are required' },
        { status: 400 }
      )
    }

    // Verify createdByUserType is valid (ADMIN, SUPPLIER, or VENDOR)
    const validUserTypes = ['ADMIN', 'SUPPLIER', 'VENDOR']
    const userTypeUpper = createdByUserType.toUpperCase()
    if (!validUserTypes.includes(userTypeUpper)) {
      return NextResponse.json(
        { error: 'Invalid user type. Must be ADMIN, SUPPLIER, or VENDOR' },
        { status: 400 }
      )
    }

    // If supplier is creating, ensure supplierId matches their ID or set it
    if (userTypeUpper === 'SUPPLIER') {
      if (supplierId && supplierId !== createdByUserId) {
        return NextResponse.json(
          { error: 'Supplier ID must match the creator ID for supplier-created products' },
          { status: 400 }
        )
      }
      // Set supplierId to supplier's own ID
      supplierId = createdByUserId
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      )
    }

    // Find or create category
    // Priority: Use categoryId if provided, otherwise find/create by category name
    let categoryId = categoryIdFromBody || null
    
    if (!categoryId && category) {
      const categoryRecord = await prisma.category.findFirst({
        where: { 
          OR: [
            { name: { equals: category, mode: 'insensitive' } },
            { slug: { equals: category.toLowerCase().replace(/\s+/g, '-'), mode: 'insensitive' } }
          ]
        },
      })

      if (categoryRecord) {
        categoryId = categoryRecord.id
      } else {
        // Create new category
        const newCategory = await prisma.category.create({
          data: {
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          },
        })
        categoryId = newCategory.id
      }
    }

    // Prepare product data
    const productData: any = {
      name: productName,
      description: description || null,
      brand: brandName || null, // Map brandName to brand field
      sku,
      barcode: barcode || null,
      status: productStatus ? productStatus.toUpperCase() : 'DRAFT',
      baseCurrency: baseCurrency || 'USD',
      costPrice: baseCostPrice ? parseFloat(baseCostPrice) : 0,
      sellingPrice: parseFloat(baseSellingPrice),
      stock: stock ? parseInt(stock) : 0,
      moq: moq ? parseInt(moq) : 1,
      stockAlertThreshold: stockAlertThreshold ? parseInt(stockAlertThreshold) : null,
      categoryId,
      subcategory: subcategory || null,
      condition: productCondition ? mapProductCondition(productCondition) : 'NEW',
      warrantyPeriod: warrantyPeriod || null,
      leadTime: leadTime || null,
      weight: weight ? parseFloat(weight) : null,
      weightUnit: weightUnit || 'kg',
      length: dimensions?.length ? parseFloat(dimensions.length) : null,
      width: dimensions?.width ? parseFloat(dimensions.width) : null,
      height: dimensions?.height ? parseFloat(dimensions.height) : null,
      dimensionUnit: dimensions?.unit || 'cm',
      shippingCost: shippingCost ? parseFloat(shippingCost) : 0,
      images: productImages && Array.isArray(productImages) ? productImages : [],
      hasVariants: hasVariants || false,
      variants: variants || null,
      supplierId: supplierId || null, // Optional: if admin selects a supplier or supplier creates
      createdByUserId,
      createdByUserType: userTypeUpper as UserType,
    }

    // Create product
    const product = await prisma.product.create({
      data: productData,
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
      },
    })

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        // Trim whitespace from tag name
        const trimmedTagName = tagName.trim()
        if (!trimmedTagName) continue // Skip empty tags
        
        // Find or create tag
        let tag = await prisma.tag.findFirst({
          where: {
            OR: [
              { name: { equals: trimmedTagName, mode: 'insensitive' } },
              { slug: { equals: trimmedTagName.toLowerCase().replace(/\s+/g, '-'), mode: 'insensitive' } }
            ]
          },
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: trimmedTagName,
              slug: trimmedTagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            },
          })
        }

        // Create ProductTag relation
        await prisma.productTag.create({
          data: {
            productId: product.id,
            tagId: tag.id,
          },
        })
      }
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

