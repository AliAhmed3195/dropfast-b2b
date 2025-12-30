import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import { StoreStatus } from '@prisma/client'
import { getTemplateIdFromEnum, getTemplateById } from '../../../../../src/lib/store-helpers'

// GET /api/public/store/[slug] - Get public store by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    console.log('Fetching store with slug:', slug)
    
    const store = await prisma.store.findUnique({
      where: { slug },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!store) {
      console.log('Store not found for slug:', slug)
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    console.log('Store found:', {
      id: store.id,
      name: store.name,
      slug: store.slug,
      status: store.status,
      expectedStatus: StoreStatus.ACTIVE,
    })

    // Only return if store is ACTIVE
    if (store.status !== StoreStatus.ACTIVE) {
      console.log('Store is not ACTIVE. Current status:', store.status)
      return NextResponse.json(
        { 
          error: 'Store is not available. Please publish the store first.',
          status: store.status,
        },
        { status: 403 }
      )
    }

    // Parse sections JSON
    let sections = []
    if (store.sections) {
      try {
        sections = typeof store.sections === 'string' 
          ? JSON.parse(store.sections) 
          : store.sections
      } catch (e) {
        console.error('Error parsing sections:', e)
        sections = []
      }
    }

    // Get template ID and definition
    const templateId = getTemplateIdFromEnum(store.template, store.storeType)
    const template = getTemplateById(templateId)

    // Merge saved sections with template defaults if needed
    let finalSections = sections
    if (!sections || sections.length === 0) {
      if (template) {
        finalSections = template.sections.map((s, i) => ({
          id: `section-${Date.now()}-${i}`,
          type: s.type,
          order: s.order,
          enabled: s.enabled,
          props: { ...s.props },
        }))
      }
    }

    return NextResponse.json({
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        industry: store.industry,
        storeType: store.storeType.toLowerCase(),
        template: store.template.toLowerCase(),
        // Branding
        logo: store.logo || '',
        banner: store.banner || '',
        primaryColor: store.primaryColor,
        secondaryColor: store.secondaryColor,
        fontFamily: store.fontFamily,
        // Content
        heroTitle: store.heroTitle || '',
        heroSubtitle: store.heroSubtitle || '',
        aboutText: store.aboutText || '',
        contactEmail: store.contactEmail || '',
        facebook: store.facebook || '',
        twitter: store.twitter || '',
        instagram: store.instagram || '',
        // Sections
        sections: finalSections,
        // Theme
        theme: {
          primaryColor: store.primaryColor,
          secondaryColor: store.secondaryColor,
          fontFamily: store.fontFamily,
        },
      },
    })
  } catch (error) {
    console.error('Get public store error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    )
  }
}

