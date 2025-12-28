import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserType } from '@prisma/client'

// GET /api/admin/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        dateOfBirth: true,
        businessName: true,
        businessType: true,
        registrationNumber: true,
        vatNumber: true,
        taxId: true,
        country: true,
        currency: true,
        streetAddress: true,
        city: true,
        stateProvince: true,
        zipCode: true,
        addressCountry: true,
        productCategories: true,
        shippingLocations: true,
        minimumOrderValue: true,
        commissionRate: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        ...user,
        role: user.role.toLowerCase(),
        userType: user.role.toLowerCase(),
        status: user.isActive ? 'active' : 'inactive',
        isActive: user.isActive,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      productCategories,
      shippingLocations,
      minimumOrderValue,
      commissionRate,
      isActive,
      status, // Support both isActive and status for backward compatibility
    } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}

    if (name) updateData.name = name
    if (email) updateData.email = email.toLowerCase()
    if (phone !== undefined) updateData.phone = phone || null
    if (businessName !== undefined) updateData.businessName = businessName || null
    if (businessType !== undefined) updateData.businessType = businessType || null
    if (streetAddress !== undefined) updateData.streetAddress = streetAddress || null
    if (city !== undefined) updateData.city = city || null
    if (stateProvince !== undefined) updateData.stateProvince = stateProvince || null
    if (zipCode !== undefined) updateData.zipCode = zipCode || null
    if (addressCountry !== undefined) updateData.addressCountry = addressCountry || null
    if (country !== undefined) updateData.country = country || null
    if (currency !== undefined) updateData.currency = currency || null
    if (productCategories !== undefined) updateData.productCategories = productCategories || null
    if (shippingLocations !== undefined) updateData.shippingLocations = shippingLocations || null
    if (minimumOrderValue !== undefined) updateData.minimumOrderValue = minimumOrderValue ? parseFloat(minimumOrderValue) : null
    if (commissionRate !== undefined) updateData.commissionRate = commissionRate ? parseFloat(commissionRate) : null
    if (role) updateData.role = role.toUpperCase() as UserType
    
    // Handle status (support both isActive boolean and status string)
    if (isActive !== undefined) {
      updateData.isActive = isActive
    } else if (status !== undefined) {
      // Convert status string to boolean
      updateData.isActive = status === 'active'
    }

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        userType: user.role.toLowerCase(),
        status: user.isActive ? 'active' : 'inactive',
        isActive: user.isActive,
        joinedDate: user.createdAt.toISOString().split('T')[0],
        organization: user.businessName || 'N/A',
      },
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

