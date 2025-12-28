import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

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
      brandName,
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
      supplierId, // Required: which supplier is creating this product
    } = body

    // Validation
    if (!productName || !sku || !baseSellingPrice) {
      return NextResponse.json(
        { error: 'Missing required fields: productName, sku, baseSellingPrice' },
        { status: 400 }
      )
    }

    // Validation: supplierId is required
    if (!supplierId) {
      return NextResponse.json(
        { error: 'Supplier ID is required. Please select a supplier.' },
        { status: 400 }
      )
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
    let categoryId = null
    if (category) {
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
      brandName: brandName || null,
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
      condition: productCondition ? productCondition.toUpperCase() : 'NEW',
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
      supplierId,
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
        // Find or create tag
        let tag = await prisma.tag.findFirst({
          where: {
            OR: [
              { name: { equals: tagName, mode: 'insensitive' } },
              { slug: { equals: tagName.toLowerCase().replace(/\s+/g, '-'), mode: 'insensitive' } }
            ]
          },
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
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

