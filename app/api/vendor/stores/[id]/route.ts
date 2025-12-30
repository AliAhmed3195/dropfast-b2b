import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import { StoreStatus, StoreTemplate } from '@prisma/client'
import { getTemplateIdFromEnum, getTemplateById } from '../../../../../src/lib/store-helpers'

// GET /api/vendor/stores/[id] - Get store details (for builder)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
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
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Parse sections JSON if it exists
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

    // Get template ID for UI
    const templateId = getTemplateIdFromEnum(store.template, store.storeType)
    
    // Get template definition
    const template = getTemplateById(templateId)

    // Merge saved sections with template defaults if needed
    let finalSections = sections
    if (!sections || sections.length === 0) {
      // If no sections saved, use template defaults
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
        url: `/store/${store.slug}`,
        description: store.description,
        industry: store.industry,
        storeType: store.storeType.toLowerCase(),
        template: store.template.toLowerCase(),
        templateId: templateId, // For UI
        status: store.status.toLowerCase(),
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
        // Theme (for builder)
        theme: {
          primaryColor: store.primaryColor,
          secondaryColor: store.secondaryColor,
          fontFamily: store.fontFamily,
        },
        // Template object for builder (full template definition)
        templateDefinition: template || null,
        createdAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Get store error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    )
  }
}

// PUT /api/vendor/stores/[id] - Update store (customization, theme, content, sections)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      industry,
      // Branding
      logo,
      banner,
      primaryColor,
      secondaryColor,
      fontFamily,
      template,
      // Content
      heroTitle,
      heroSubtitle,
      aboutText,
      contactEmail,
      facebook,
      twitter,
      instagram,
      // Sections
      sections,
    } = body

    // Check if store exists
    const existingStore = await prisma.store.findUnique({
      where: { id: params.id },
    })

    if (!existingStore) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description || null
    if (industry !== undefined) updateData.industry = industry || null

    // Branding
    if (logo !== undefined) updateData.logo = logo || null
    if (banner !== undefined) updateData.banner = banner || null
    if (primaryColor !== undefined) updateData.primaryColor = primaryColor
    if (secondaryColor !== undefined) updateData.secondaryColor = secondaryColor
    if (fontFamily !== undefined) updateData.fontFamily = fontFamily
    if (template !== undefined) {
      const templateUpper = template.toUpperCase()
      if (templateUpper === 'CLASSIC') updateData.template = StoreTemplate.CLASSIC
      else if (templateUpper === 'MINIMAL') updateData.template = StoreTemplate.MINIMAL
      else if (templateUpper === 'BOLD') updateData.template = StoreTemplate.BOLD
      else updateData.template = StoreTemplate.MODERN
    }

    // Content
    if (heroTitle !== undefined) updateData.heroTitle = heroTitle || null
    if (heroSubtitle !== undefined) updateData.heroSubtitle = heroSubtitle || null
    if (aboutText !== undefined) updateData.aboutText = aboutText || null
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail || null
    if (facebook !== undefined) updateData.facebook = facebook || null
    if (twitter !== undefined) updateData.twitter = twitter || null
    if (instagram !== undefined) updateData.instagram = instagram || null

    // Sections (store as JSON)
    if (sections !== undefined) {
      updateData.sections = Array.isArray(sections) ? sections : []
    }

    // Update store
    const updatedStore = await prisma.store.update({
      where: { id: params.id },
      data: updateData,
    })

    // Parse sections for response
    let parsedSections = []
    if (updatedStore.sections) {
      try {
        parsedSections = typeof updatedStore.sections === 'string'
          ? JSON.parse(updatedStore.sections)
          : updatedStore.sections
      } catch (e) {
        parsedSections = []
      }
    }

    return NextResponse.json({
      store: {
        id: updatedStore.id,
        name: updatedStore.name,
        slug: updatedStore.slug,
        url: `/store/${updatedStore.slug}`,
        storeType: updatedStore.storeType.toLowerCase(),
        template: updatedStore.template.toLowerCase(),
        status: updatedStore.status.toLowerCase(),
        primaryColor: updatedStore.primaryColor,
        secondaryColor: updatedStore.secondaryColor,
        fontFamily: updatedStore.fontFamily,
        sections: parsedSections,
        updatedAt: updatedStore.updatedAt.toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Update store error:', error)
    return NextResponse.json(
      { error: 'Failed to update store', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/vendor/stores/[id] - Delete store
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Delete store (cascade will delete storeProducts, orders, etc.)
    await prisma.store.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Store deleted successfully',
    })
  } catch (error) {
    console.error('Delete store error:', error)
    return NextResponse.json(
      { error: 'Failed to delete store' },
      { status: 500 }
    )
  }
}

