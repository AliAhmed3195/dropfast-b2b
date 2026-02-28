import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { getHunterIdByReferralCode } from '../../../src/lib/hunter-commission';

// GET - Fetch users by role (vendors, suppliers, etc.)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const where: any = {};
    if (role) {
      where.role = role.toUpperCase();
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        storesAsVendor: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform based on role
    if (role?.toUpperCase() === 'VENDOR') {
      const vendors = users.map(user => {
        const store = user.storesAsVendor?.[0];
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          storeName: store?.name || user.businessName || '',
          address: user.streetAddress 
            ? `${user.streetAddress}, ${user.city || ''}, ${user.stateProvince || ''} ${user.zipCode || ''}`.trim()
            : '',
          joinDate: user.createdAt.toISOString().split('T')[0],
          status: user.isActive ? 'active' : 'inactive',
          totalProducts: 0, // Would need to count from products table
          totalOrders: 0, // Would need to count from orders table
          revenue: 0, // Would need to calculate from orders
          rating: 0,
          stripeConnected: !!user.stripeAccountId,
        };
      });
      return NextResponse.json({ vendors });
    } else if (role?.toUpperCase() === 'SUPPLIER') {
      const suppliers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        storeName: user.businessName || '',
        businessName: user.businessName || '',
        address: user.streetAddress 
          ? `${user.streetAddress}, ${user.city || ''}, ${user.stateProvince || ''} ${user.zipCode || ''}`.trim()
          : '',
        joinDate: user.createdAt.toISOString().split('T')[0],
        status: user.isActive ? 'active' : 'inactive',
        totalProducts: 0, // Would need to count from products table
        totalOrders: 0, // Would need to count from orders table
        revenue: 0, // Would need to calculate from orders
        rating: 0,
        verified: false,
        categories: [],
      }));
      return NextResponse.json({ vendors: suppliers }); // Using same key for consistency
    }

    // Default: return all users
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      password,
      role,
      phoneNumber,
      dateOfBirth,
      businessName,
      businessType,
      registrationNumber,
      vatNumber,
      taxId,
      country,
      currency,
      baseCurrency,
      streetAddress,
      city,
      stateProvince,
      zipCode,
      addressCountry,
      productCategories,
      shippingLocations,
      minimumOrderValue,
      storeName,
      storeType,
      commissionRate,
      referralCode,
      ref,
    } = body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Full name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert role to uppercase for database
    const userRole = role.toUpperCase();
    const refCode = referralCode ?? ref;
    const referredByHunterId =
      userRole === 'SUPPLIER' && refCode
        ? await getHunterIdByReferralCode(refCode)
        : null;

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole as any,
        phone: phoneNumber || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        businessName: businessName || null,
        businessType: businessType || null,
        registrationNumber: registrationNumber || null,
        vatNumber: vatNumber || null,
        taxId: taxId || null,
        country: country || null,
        currency: currency || null,
        baseCurrency: baseCurrency || null,
        streetAddress: streetAddress || null,
        city: city || null,
        stateProvince: stateProvince || null,
        zipCode: zipCode || null,
        addressCountry: addressCountry || null,
        productCategories: productCategories || null,
        shippingLocations: shippingLocations || null,
        minimumOrderValue: minimumOrderValue ? parseFloat(minimumOrderValue) : null,
        commissionRate: commissionRate ? parseFloat(commissionRate) : null,
        referredByHunterId: referredByHunterId ?? undefined,
      },
    });

    // If vendor, create a store
    if (userRole === 'VENDOR' && storeName) {
      // Generate slug from store name
      const slug = storeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + user.id.slice(0, 8);

      await prisma.store.create({
        data: {
          name: storeName,
          slug: slug,
          vendorId: user.id,
          storeType: storeType === 'single' ? 'SINGLE_PRODUCT' : 'MULTI_PRODUCT',
          status: 'ACTIVE',
        },
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}
