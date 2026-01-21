import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return user (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        role: userWithoutPassword.role.toLowerCase(), // Convert ADMIN -> admin
        avatar: userWithoutPassword.avatar,
        company: userWithoutPassword.businessName,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    
    // More detailed error response for debugging
    const errorMessage = error?.message || 'An error occurred during login'
    
    // Check if it's a database connection error
    if (error?.code === 'P1001' || error?.message?.includes('connect')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed. Please check if PostgreSQL is running.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      )
    }
    
    // Check if it's a Prisma error
    if (error?.code?.startsWith('P')) {
      return NextResponse.json(
        { 
          error: 'Database error occurred',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}
