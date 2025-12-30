import { StoreTemplate, StoreType } from '@prisma/client'
import { storeTemplates } from '../app/data/storeTemplates'

/**
 * Map template ID (from UI) to Prisma StoreTemplate enum
 */
export function getTemplateEnumFromId(templateId: string): StoreTemplate {
  const map: Record<string, StoreTemplate> = {
    'tech-launch': StoreTemplate.MODERN,
    'premium-brand': StoreTemplate.MODERN,
    'modern-ecommerce': StoreTemplate.MODERN,
    'classic-retail': StoreTemplate.CLASSIC,
  }
  return map[templateId] || StoreTemplate.MODERN
}

/**
 * Map Prisma StoreTemplate enum to template ID (for UI)
 */
export function getTemplateIdFromEnum(template: StoreTemplate, storeType: StoreType | string): string {
  const normalizedStoreType = typeof storeType === 'string' 
    ? (storeType === 'SINGLE_PRODUCT' || storeType === 'single-product' ? StoreType.SINGLE_PRODUCT : StoreType.MULTI_PRODUCT)
    : storeType
    
  if (normalizedStoreType === StoreType.SINGLE_PRODUCT) {
    return template === StoreTemplate.CLASSIC ? 'premium-brand' : 'tech-launch'
  } else {
    return template === StoreTemplate.CLASSIC ? 'classic-retail' : 'modern-ecommerce'
  }
}

/**
 * Initialize store sections from template
 */
export function initializeStoreSections(templateId: string): Array<{
  id: string
  type: string
  order: number
  enabled: boolean
  props: any
}> {
  const template = storeTemplates.find(t => t.id === templateId)
  if (!template) return []

  return template.sections.map((section, index) => ({
    id: `section-${Date.now()}-${index}`,
    type: section.type,
    order: section.order,
    enabled: section.enabled,
    props: { ...section.props }, // Deep copy default props
  }))
}

/**
 * Get template definition by ID
 */
export function getTemplateById(templateId: string) {
  return storeTemplates.find(t => t.id === templateId)
}

