import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const supplierPassword = await bcrypt.hash('supplier123', 10)
  const vendorPassword = await bcrypt.hash('vendor123', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)

  // Create users (upsert to avoid duplicates)
  await prisma.user.upsert({
    where: { email: 'admin@fastdrop.com' },
    update: {},
    create: {
      email: 'admin@fastdrop.com',
      password: hashedPassword,
      name: 'Sarah Chen',
      role: 'ADMIN',
      businessName: 'FastDrop Platform',
      isActive: true,
    },
  })

  await prisma.user.upsert({
    where: { email: 'supplier@fastdrop.com' },
    update: {},
    create: {
      email: 'supplier@fastdrop.com',
      password: supplierPassword,
      name: 'Michael Rodriguez',
      role: 'SUPPLIER',
      businessName: 'TechSupply Co.',
      isActive: true,
    },
  })

  await prisma.user.upsert({
    where: { email: 'vendor@fastdrop.com' },
    update: {},
    create: {
      email: 'vendor@fastdrop.com',
      password: vendorPassword,
      name: 'Emma Thompson',
      role: 'VENDOR',
      businessName: 'Digital Marketplace',
      isActive: true,
    },
  })

  await prisma.user.upsert({
    where: { email: 'customer@fastdrop.com' },
    update: {},
    create: {
      email: 'customer@fastdrop.com',
      password: customerPassword,
      name: 'James Wilson',
      role: 'CUSTOMER',
      businessName: 'Personal',
      isActive: true,
    },
  })

  console.log('✅ Users created:')
  console.log('   - Admin: admin@fastdrop.com')
  console.log('   - Supplier: supplier@fastdrop.com')
  console.log('   - Vendor: vendor@fastdrop.com')
  console.log('   - Customer: customer@fastdrop.com')

  // Create invoice templates
  console.log('🌱 Seeding invoice templates...')

  const templates = [
    {
      name: 'Modern Gradient',
      description: 'Modern design with gradient accents',
      template: 'modern-gradient',
      layout: 'gradient',
      accentColor: 'from-purple-600 to-cyan-600',
      isDefault: true,
    },
    {
      name: 'Classic Professional',
      description: 'Traditional professional layout',
      template: 'classic-professional',
      layout: 'classic',
      accentColor: 'from-blue-600 to-indigo-600',
      isDefault: false,
    },
    {
      name: 'Minimalist Clean',
      description: 'Clean and minimal design',
      template: 'minimalist-clean',
      layout: 'minimal',
      accentColor: 'from-gray-600 to-slate-600',
      isDefault: false,
    },
    {
      name: 'Bold Corporate',
      description: 'Bold corporate style',
      template: 'bold-corporate',
      layout: 'corporate',
      accentColor: 'from-red-600 to-orange-600',
      isDefault: false,
    },
  ]

  for (const template of templates) {
    // Check if template already exists
    const existing = await prisma.invoiceTemplate.findFirst({
      where: { template: template.template }
    })
    
    if (!existing) {
      await prisma.invoiceTemplate.create({
        data: template,
      })
      console.log(`✅ Created template: ${template.name}`)
    } else {
      console.log(`⏭️  Skipped existing template: ${template.name}`)
    }
  }

  // Ensure only one default template
  const defaultTemplate = await prisma.invoiceTemplate.findFirst({
    where: { isDefault: true },
  })
  
  if (defaultTemplate) {
    await prisma.invoiceTemplate.updateMany({
      where: { 
        NOT: { id: defaultTemplate.id },
        isDefault: true 
      },
      data: { isDefault: false },
    })
    console.log(`✅ Ensured single default template: ${defaultTemplate.name}`)
  }

  console.log('✅ Invoice templates seeded successfully!')
  console.log('✅ Invoice templates seeded')

  console.log('\n🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
