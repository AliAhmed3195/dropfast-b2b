import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/lib/prisma';
import { StoreStatus } from '@prisma/client';

// GET /api/customer/stores - Get all active stores for customer browsing
export async function GET(request: NextRequest) {
  try {
    const stores = await prisma.store.findMany({
      where: {
        status: StoreStatus.ACTIVE,
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            storeProducts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format response
    const formattedStores = stores.map((store) => ({
      id: store.id,
      vendorId: store.vendorId,
      name: store.name,
      slug: store.slug,
      description: store.description || '',
      logo: store.logo || '',
      banner: store.banner || '',
      template: store.template,
      theme: {
        primaryColor: store.primaryColor || '#6366f1',
        secondaryColor: store.secondaryColor || '#06b6d4',
        fontFamily: store.fontFamily || 'Inter',
      },
      products: [], // Will be populated separately if needed
      customContent: {
        heroTitle: store.heroTitle || '',
        heroSubtitle: store.heroSubtitle || '',
        aboutText: store.aboutText || '',
        contactEmail: store.contactEmail || '',
        socialLinks: {
          facebook: store.facebook || '',
          twitter: store.twitter || '',
          instagram: store.instagram || '',
        },
      },
      status: store.status.toLowerCase(),
      createdAt: store.createdAt.toISOString(),
      productCount: store._count.storeProducts,
    }));

    return NextResponse.json({ stores: formattedStores });
  } catch (error: any) {
    console.error('Get customer stores error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores', details: error.message },
      { status: 500 }
    );
  }
}

