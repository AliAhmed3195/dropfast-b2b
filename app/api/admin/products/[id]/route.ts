import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import { ProductCondition } from '@prisma/client'

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

// GET /api/admin/products/[id] - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            businessName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      shippingCountries,
      shippingMethods,
      hasVariants,
      variants,
      productImages,
    } = body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Note: createdByUserId, createdByUserType, and supplierId are immutable
    // They represent who originally created the product and should not be changed on edit
    // These fields are explicitly ignored in the destructuring above (prefixed with _)

    // Check if SKU is being changed and if it already exists
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku },
      })

      if (skuExists) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Find or create category
    let categoryId = existingProduct.categoryId
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

    // Prepare update data
    const updateData: any = {}
    if (productName) updateData.name = productName
    if (description !== undefined) updateData.description = description || null
    if (brandName !== undefined) updateData.brand = brandName || null // Map brandName to brand field
    if (sku) updateData.sku = sku
    if (barcode !== undefined) updateData.barcode = barcode || null
    if (productStatus) updateData.status = productStatus.toUpperCase()
    if (baseCurrency) updateData.baseCurrency = baseCurrency
    if (baseCostPrice !== undefined) updateData.costPrice = parseFloat(baseCostPrice)
    if (baseSellingPrice !== undefined) updateData.sellingPrice = parseFloat(baseSellingPrice)
    if (stock !== undefined) updateData.stock = parseInt(stock)
    if (moq !== undefined) updateData.moq = parseInt(moq)
    if (stockAlertThreshold !== undefined) updateData.stockAlertThreshold = stockAlertThreshold ? parseInt(stockAlertThreshold) : null
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (subcategory !== undefined) updateData.subcategory = subcategory || null
    if (productCondition) updateData.condition = mapProductCondition(productCondition)
    if (warrantyPeriod !== undefined) updateData.warrantyPeriod = warrantyPeriod || null
    if (leadTime !== undefined) updateData.leadTime = leadTime || null
    if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : null
    if (weightUnit) updateData.weightUnit = weightUnit
    if (dimensions?.length !== undefined) updateData.length = dimensions.length ? parseFloat(dimensions.length) : null
    if (dimensions?.width !== undefined) updateData.width = dimensions.width ? parseFloat(dimensions.width) : null
    if (dimensions?.height !== undefined) updateData.height = dimensions.height ? parseFloat(dimensions.height) : null
    if (dimensions?.unit) updateData.dimensionUnit = dimensions.unit
    if (shippingCost !== undefined) updateData.shippingCost = shippingCost ? parseFloat(shippingCost) : 0
    if (shippingCountries !== undefined) updateData.shippingCountries = Array.isArray(shippingCountries) ? shippingCountries : []
    if (productImages !== undefined) updateData.images = Array.isArray(productImages) ? productImages : []
    if (hasVariants !== undefined) updateData.hasVariants = hasVariants
    if (variants !== undefined) updateData.variants = variants

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
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
    if (tags && Array.isArray(tags)) {
      // Remove existing tags
      await prisma.productTag.deleteMany({
        where: { productId: params.id },
      })

      // Add new tags
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
            productId: params.id,
            tagId: tag.id,
          },
        })
      }
    }

    return NextResponse.json({ product })
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}

