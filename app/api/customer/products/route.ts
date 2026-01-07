import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';

// GET /api/customer/products - Get all active products for customer browsing
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {
      status: 'ACTIVE',
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      supplierId: product.supplierId,
      supplierName: product.supplier?.name || 'Unknown Supplier',
      name: product.name,
      description: product.description || '',
      price: Number(product.sellingPrice || product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      category: product.category?.name || product.categoryId || 'Uncategorized',
      images: product.images || [],
      stock: product.stock || 0,
      sku: product.sku || '',
      rating: 0, // TODO: Calculate from reviews
      reviews: 0, // TODO: Count reviews
      featured: false, // TODO: Add featured flag
      status: product.status.toLowerCase(),
      createdAt: product.createdAt.toISOString(),
      // Shipping info
      shippingCost: product.shippingCost || 0,
      shippingMethods: product.shippingMethods || null,
      shippingCountries: product.shippingCountries || [],
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error: any) {
    console.error('Get customer products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

