import { prisma } from './prisma'

// Invoice templates data - defined at code level
export const INVOICE_TEMPLATES_DATA = [
  {
    name: 'Modern Gradient',
    description: 'Contemporary design with vibrant gradients and clean layout',
    layout: 'gradient',
    isDefault: true,
    isActive: true,
    accentColor: 'from-purple-600 to-cyan-600',
    template: JSON.stringify({ type: 'gradient', version: '1.0' }), // Placeholder template data
  },
  {
    name: 'Classic Professional',
    description: 'Traditional corporate design with left sidebar',
    layout: 'classic',
    isDefault: false,
    isActive: true,
    accentColor: 'from-blue-600 to-indigo-600',
    template: JSON.stringify({ type: 'classic', version: '1.0' }),
  },
  {
    name: 'Minimalist Clean',
    description: 'Simple elegant design with subtle borders',
    layout: 'minimal',
    isDefault: false,
    isActive: true,
    accentColor: 'from-slate-700 to-slate-900',
    template: JSON.stringify({ type: 'minimal', version: '1.0' }),
  },
  {
    name: 'Bold Corporate',
    description: 'Professional design with top banner and sections',
    layout: 'corporate',
    isDefault: false,
    isActive: false,
    accentColor: 'from-green-600 to-teal-600',
    template: JSON.stringify({ type: 'corporate', version: '1.0' }),
  },
]

/**
 * Seed invoice templates to database
 * This function ensures all templates from code are synced to the database
 * It uses upsert to avoid duplicates
 */
export async function seedInvoiceTemplates() {
  try {
    console.log('🌱 Seeding invoice templates...')

    for (const templateData of INVOICE_TEMPLATES_DATA) {
      // Check if template with this name already exists
      const existing = await prisma.invoiceTemplate.findFirst({
        where: { name: templateData.name },
      })

      if (existing) {
        // Update existing template to match code definition
        await prisma.invoiceTemplate.update({
          where: { id: existing.id },
          data: {
            description: templateData.description,
            layout: templateData.layout,
            accentColor: templateData.accentColor,
            template: templateData.template,
            // Only update isDefault if it's set to true in code
            // This prevents overwriting user changes
            ...(templateData.isDefault && { isDefault: true }),
          },
        })
        console.log(`✅ Updated template: ${templateData.name}`)
      } else {
        // Create new template
        await prisma.invoiceTemplate.create({
          data: templateData,
        })
        console.log(`✅ Created template: ${templateData.name}`)
      }
    }

    // Ensure only one default template exists
    const defaultTemplates = await prisma.invoiceTemplate.findMany({
      where: { isDefault: true },
    })

    if (defaultTemplates.length > 1) {
      // Keep the first one as default, set others to false
      const firstDefault = defaultTemplates[0]
      for (let i = 1; i < defaultTemplates.length; i++) {
        await prisma.invoiceTemplate.update({
          where: { id: defaultTemplates[i].id },
          data: { isDefault: false },
        })
      }
      console.log(`✅ Ensured single default template: ${firstDefault.name}`)
    }

    console.log('✅ Invoice templates seeded successfully!')
    return { success: true, message: 'Templates seeded successfully' }
  } catch (error) {
    console.error('❌ Error seeding invoice templates:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

