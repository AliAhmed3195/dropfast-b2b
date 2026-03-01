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
        referredByHunterId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Load hunter details for users that have referredByHunterId (separate query to avoid relation)
    const hunterIds = Array.from(new Set(users.map((u) => (u as any).referredByHunterId).filter(Boolean))) as string[]
    const hunters =
      hunterIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: hunterIds } },
            select: { id: true, name: true, email: true },
          })
        : []
    const hunterMap = Object.fromEntries(hunters.map((h) => [h.id, h]))

    // Format response to match UI expectations
    const formattedUsers = users.map((user) => {
      const hunterId = (user as any).referredByHunterId ?? null
      const hunter = hunterId ? hunterMap[hunterId] : null
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        userType: user.role.toLowerCase(),
        status: user.isActive ? 'active' : 'inactive',
        isActive: user.isActive,
        joinedDate: user.createdAt.toISOString().split('T')[0],
        lastActive: user.updatedAt.toISOString().split('T')[0],
        createdBy: 'System',
        organization: user.businessName || 'N/A',
        hunterId: hunter?.id ?? null,
        hunterName: hunter?.name ?? null,
        hunterEmail: hunter?.email ?? null,
      }
    })

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

    // Product Hunter: auto-generate unique referral code so they can invite suppliers
    if (user.role === 'PRODUCT_HUNTER') {
      const code = 'HUNTER-' + user.id.slice(-8).toUpperCase()
      await prisma.user.update({
        where: { id: user.id },
        data: { hunterReferralCode: code },
      })
    }

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

