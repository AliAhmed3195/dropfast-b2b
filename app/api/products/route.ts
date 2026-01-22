import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');

    const where: any = {};

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            businessName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      shippingMethodName,
      estimatedDeliveryDays,
      weight,
      weightUnit,
      length,
      width,
      height,
      dimensionUnit,
      shippingCost,
      productImages,
      hasVariants,
      variants,
      createdByUserId,
      createdByUserType,
      supplierId,
    } = body;

    // Validate required fields
    if (!productName || !sku) {
      return NextResponse.json(
        { error: 'Product name and SKU are required' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      );
    }

    // Prepare shipping methods JSON
    const shippingMethods = shippingMethodName && estimatedDeliveryDays
      ? [{
          name: shippingMethodName,
          estimatedDays: parseInt(estimatedDeliveryDays),
          cost: shippingCost ? parseFloat(shippingCost) : 0,
        }]
      : null;

    // Create product
    const product = await prisma.product.create({
      data: {
        name: productName,
        description: description || '',
        brand: brandName || '',
        sku,
        barcode: barcode || '',
        status: productStatus?.toUpperCase() || 'DRAFT',
        baseCurrency: baseCurrency || 'USD',
        costPrice: parseFloat(baseCostPrice) || 0,
        sellingPrice: parseFloat(baseSellingPrice) || 0,
        stock: parseInt(stock) || 0,
        moq: parseInt(moq) || 1,
        stockAlertThreshold: stockAlertThreshold ? parseInt(stockAlertThreshold) : null,
        subcategory: subcategory || '',
        condition: productCondition?.toUpperCase() || 'NEW',
        warrantyPeriod: warrantyPeriod || '',
        leadTime: leadTime || '',
        weight: weight ? parseFloat(weight) : null,
        weightUnit: weightUnit || 'kg',
        length: length ? parseFloat(length) : null,
        width: width ? parseFloat(width) : null,
        height: height ? parseFloat(height) : null,
        dimensionUnit: dimensionUnit || 'cm',
        shippingCost: shippingCost ? parseFloat(shippingCost) : 0,
        shippingMethods: shippingMethods,
        images: productImages || [],
        hasVariants: hasVariants || false,
        variants: variants || null,
        createdByUserId: createdByUserId || null,
        createdByUserType: createdByUserType || null,
        supplierId: supplierId || null,
        // Note: categoryId would need to be looked up from category name
        // For now, we'll leave it null if category is just a string
      },
      include: {
        category: true,
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            businessName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully',
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}
