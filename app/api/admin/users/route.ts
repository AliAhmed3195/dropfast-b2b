import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserType } from '@prisma/client'

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role') // Filter by role: admin, supplier, vendor, customer
    const status = searchParams.get('status') // Filter by status (if needed)

    const where: any = {}
    
    if (role && role !== 'all') {
      // Convert lowercase role to uppercase enum
      const roleUpper = role.toUpperCase() as UserType
      where.role = roleUpper
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        businessName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response to match UI expectations
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      userType: user.role.toLowerCase(),
      status: user.isActive ? 'active' : 'inactive',
      isActive: user.isActive,
      joinedDate: user.createdAt.toISOString().split('T')[0],
      lastActive: user.updatedAt.toISOString().split('T')[0],
      createdBy: 'System', // Default (can be enhanced later)
      organization: user.businessName || 'N/A',
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      role,
      phone,
      businessName,
      businessType,
      streetAddress,
      city,
      stateProvince,
      zipCode,
      addressCountry,
      country,
      currency,
      // Supplier specific
      productCategories,
      shippingLocations,
      minimumOrderValue,
      // Vendor specific
      commissionRate,
    } = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Convert role to enum
    const roleUpper = role.toUpperCase() as UserType

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: roleUpper,
        phone: phone || null,
        businessName: businessName || null,
        businessType: businessType || null,
        streetAddress: streetAddress || null,
        city: city || null,
        stateProvince: stateProvince || null,
        zipCode: zipCode || null,
        addressCountry: addressCountry || null,
        country: country || null,
        currency: currency || null,
        // Supplier specific
        productCategories: productCategories || null,
        shippingLocations: shippingLocations || null,
        minimumOrderValue: minimumOrderValue ? parseFloat(minimumOrderValue) : null,
        // Vendor specific
        commissionRate: commissionRate ? parseFloat(commissionRate) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        businessName: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        userType: user.role.toLowerCase(),
        status: 'active',
        joinedDate: user.createdAt.toISOString().split('T')[0],
        organization: user.businessName || 'N/A',
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

