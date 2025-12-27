# 🗄️ Database Schema Design - DropFast Platform

## ✅ Overview

**Clean, Simple, Best Practice Database Design** based on all UI forms and requirements.

**Technology Stack:**
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Approach:** Normalized, Type-safe, Scalable

---

## 📊 Schema Summary

### **Core Entities (10 Models):**

1. **User** - All user types (Admin, Supplier, Vendor, Customer)
2. **Product** - Supplier products with full details
3. **Category** - Product categories
4. **Tag** - Product tags with colors
5. **ProductTag** - Many-to-Many relationship
6. **Store** - Vendor stores
7. **StoreProduct** - Vendor's product listings (with markup & SEO)
8. **Order** - Customer orders
9. **OrderItem** - Order line items
10. **Invoice** - Vendor invoices
11. **Payout** - Supplier/Vendor payouts
12. **InvoiceTemplate** - Invoice templates (optional)

---

## 🎯 Key Design Decisions

### **1. User Model - Unified Approach** ✅

**Why:** Single table for all roles (Admin, Supplier, Vendor, Customer)

**Benefits:**
- ✅ Simple authentication
- ✅ Easy role-based queries
- ✅ Optional business fields (only filled when needed)
- ✅ Role-specific fields (supplierCategories, commissionRate)

**Fields:**
- Basic: email, password, name, role, phone, dateOfBirth
- Business (Optional): businessName, businessType, registrationNumber, VAT
- Address: streetAddress, city, state, zipCode, country
- Supplier: productCategories, shippingLocations, minimumOrderValue
- Vendor: commissionRate
- Stripe: stripeAccountId, kycStatus, onboardingComplete

---

### **2. Product Model - Comprehensive** ✅

**Based on ProductForm.tsx (5 steps):**

**Step 1 - Basic Info:**
- name, description, brand, sku, barcode, status

**Step 2 - Pricing & Stock:**
- baseCurrency (for UI), costPrice (USD), sellingPrice (USD)
- stock, moq, stockAlertThreshold

**Step 3 - Classification:**
- categoryId, subcategory, condition, warrantyPeriod, leadTime
- tags (via ProductTag)

**Step 4 - Shipping:**
- weight, weightUnit, length, width, height, dimensionUnit, shippingCost

**Step 5 - Media:**
- images (array), hasVariants, variants (JSON)

**Key Features:**
- ✅ All prices stored in USD (baseCurrency for UI reference)
- ✅ Variants stored as JSON (flexible)
- ✅ Full shipping dimensions
- ✅ Stock management with alerts

---

### **3. Store Model - Flexible** ✅

**Based on StoreCreationWizard.tsx:**

**Fields:**
- name, slug, description, industry, storeType
- Branding: logo, banner, template, colors, fontFamily
- Custom Content: heroTitle, heroSubtitle, aboutText, social links
- Status: DRAFT, ACTIVE, INACTIVE

**Store Types:**
- SINGLE_PRODUCT - For one hero product
- MULTI_PRODUCT - Traditional ecommerce

**Templates:**
- MODERN, CLASSIC, MINIMAL, BOLD

---

### **4. StoreProduct - Vendor's Product Listings** ✅

**Based on UnifiedImportModal.tsx:**

**Purpose:** When vendor imports supplier product to their store

**Fields:**
- sellingPrice (vendor's markup price)
- metaTitle, metaDescription, metaKeywords (SEO)
- status (active/inactive)

**Key Feature:**
- ✅ Vendor can set their own price (markup)
- ✅ SEO settings per store-product
- ✅ Many-to-Many: Store ↔ Product

---

### **5. Order Model - Complete** ✅

**Based on Checkout.tsx:**

**Fields:**
- orderNumber (auto-generated)
- Pricing: subtotal, shipping, tax, total
- Status: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- Payment: paymentMethod, paymentStatus
- Shipping Address: full fields
- Contact: customerEmail, customerPhone

**Relations:**
- customerId → User (Customer)
- storeId → Store
- items → OrderItem[]

---

### **6. Category & Tag - Simple** ✅

**Category:**
- name, slug, description, image, displayOrder

**Tag:**
- name, slug, color (hex code)

**ProductTag:**
- Many-to-Many junction table

---

### **7. Invoice & Payout** ✅

**Invoice:**
- invoiceNumber, amount, status, dueDate, paidAt
- vendorId, orderId (optional)

**Payout:**
- amount, status, method, accountDetails (encrypted JSON)
- userId (Supplier or Vendor)

---

## 🔐 Security & Best Practices

### **1. Password Storage**
```typescript
// Hash passwords with bcrypt
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash(password, 10);
```

### **2. Sensitive Data**
- **accountDetails** in Payout: Store as encrypted JSON
- **Stripe Account IDs**: Store securely
- **VAT/Tax IDs**: Can be partially masked in UI

### **3. Indexes**
- ✅ All foreign keys indexed
- ✅ Email, SKU, slug unique
- ✅ Status fields indexed for filtering
- ✅ orderNumber indexed for lookups

### **4. Data Types**
- ✅ Prices: `Float` (use Decimal in production for precision)
- ✅ Dates: `DateTime`
- ✅ Arrays: `String[]` for images, keywords
- ✅ JSON: For variants, accountDetails

---

## 📋 Field Mapping from UI Forms

### **ProductForm.tsx → Product Model:**

| Form Field | Database Field | Notes |
|------------|---------------|-------|
| productName | name | ✅ |
| description | description | ✅ |
| brandName | brand | ✅ |
| sku | sku | ✅ Unique |
| barcode | barcode | ✅ |
| productStatus | status | ✅ Enum |
| baseCurrency | baseCurrency | ✅ UI reference |
| baseCostPrice | costPrice | ✅ Converted to USD |
| baseSellingPrice | sellingPrice | ✅ Converted to USD |
| stock | stock | ✅ |
| moq | moq | ✅ |
| stockAlertThreshold | stockAlertThreshold | ✅ |
| category | categoryId | ✅ Relation |
| subcategory | subcategory | ✅ |
| tags | ProductTag[] | ✅ Many-to-Many |
| productCondition | condition | ✅ Enum |
| warrantyPeriod | warrantyPeriod | ✅ |
| leadTime | leadTime | ✅ |
| weight | weight | ✅ |
| weightUnit | weightUnit | ✅ |
| length, width, height | length, width, height | ✅ |
| dimensionUnit | dimensionUnit | ✅ |
| shippingCost | shippingCost | ✅ |
| productImages | images | ✅ Array |
| variants | variants | ✅ JSON |

### **UserForm.tsx → User Model:**

| Form Field | Database Field | Notes |
|------------|---------------|-------|
| fullName | name | ✅ |
| email | email | ✅ Unique |
| password | password | ✅ Hashed |
| role | role | ✅ Enum |
| phoneNumber | phone | ✅ |
| dateOfBirth | dateOfBirth | ✅ |
| businessName | businessName | ✅ Optional |
| businessType | businessType | ✅ Optional |
| registrationNumber | registrationNumber | ✅ Optional |
| vatNumber | vatNumber | ✅ Optional |
| country | country | ✅ Optional |
| currency | currency | ✅ UI reference |
| streetAddress | streetAddress | ✅ Optional |
| city | city | ✅ Optional |
| stateProvince | stateProvince | ✅ Optional |
| addressCountry | addressCountry | ✅ Optional |
| productCategories | productCategories | ✅ Supplier only |
| shippingLocations | shippingLocations | ✅ Supplier only |
| minimumOrderValue | minimumOrderValue | ✅ Supplier only |
| commissionRate | commissionRate | ✅ Vendor only |

### **StoreCreationWizard.tsx → Store Model:**

| Form Field | Database Field | Notes |
|------------|---------------|-------|
| name | name | ✅ |
| storeType | storeType | ✅ Enum |
| industry | industry | ✅ |
| templateId | template | ✅ Enum |
| slug | slug | ✅ Auto-generated, unique |

### **Checkout.tsx → Order Model:**

| Form Field | Database Field | Notes |
|------------|---------------|-------|
| fullName | shippingFullName | ✅ |
| email | customerEmail | ✅ |
| phone | shippingPhone | ✅ |
| address | shippingAddress | ✅ |
| city | shippingCity | ✅ |
| state | shippingState | ✅ |
| zipCode | shippingZipCode | ✅ |
| country | shippingCountry | ✅ |
| paymentMethod | paymentMethod | ✅ |

### **UnifiedImportModal.tsx → StoreProduct Model:**

| Form Field | Database Field | Notes |
|------------|---------------|-------|
| storeId | storeId | ✅ |
| sellingPrice | sellingPrice | ✅ Vendor's price |
| metaTitle | metaTitle | ✅ SEO |
| metaDescription | metaDescription | ✅ SEO |
| metaKeywords | metaKeywords | ✅ SEO Array |

---

## 🚀 Setup Instructions

### **Step 1: Install Prisma**

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### **Step 2: Initialize Prisma**

```bash
npx prisma init
```

### **Step 3: Configure .env**

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/dropfast?schema=public"
```

### **Step 4: Copy Schema**

Copy `prisma/schema.prisma` to your project.

### **Step 5: Run Migration**

```bash
npx prisma migrate dev --name init
```

### **Step 6: Generate Prisma Client**

```bash
npx prisma generate
```

### **Step 7: Create Prisma Client Singleton**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 📝 Seed Data Example

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fastdrop.com',
      password: adminPassword,
      name: 'Sarah Chen',
      role: 'ADMIN',
      businessName: 'FastDrop Platform',
    },
  })

  // Create Supplier
  const supplierPassword = await bcrypt.hash('supplier123', 10)
  const supplier = await prisma.user.create({
    data: {
      email: 'supplier@fastdrop.com',
      password: supplierPassword,
      name: 'Michael Rodriguez',
      role: 'SUPPLIER',
      businessName: 'TechSupply Co.',
      productCategories: 'Electronics,Accessories',
      shippingLocations: 'US,CA,MX',
      minimumOrderValue: 100.0,
    },
  })

  // Create Category
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      displayOrder: 1,
    },
  })

  // Create Tag
  const featured = await prisma.tag.create({
    data: {
      name: 'Featured',
      slug: 'featured',
      color: '#9333ea',
    },
  })

  console.log('Seed data created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## ✅ Best Practices Implemented

1. **✅ Normalized Design** - No data duplication
2. **✅ Type Safety** - Prisma generates TypeScript types
3. **✅ Indexes** - All foreign keys and search fields indexed
4. **✅ Enums** - Status fields use enums (type-safe)
5. **✅ Timestamps** - createdAt, updatedAt on all models
6. **✅ Soft Deletes** - Can add `deletedAt` if needed
7. **✅ Scalable** - Ready for production
8. **✅ Clean** - Simple, readable schema
9. **✅ Flexible** - JSON for variants, accountDetails
10. **✅ Secure** - Passwords hashed, sensitive data encrypted

---

## 🔄 Next Steps

1. **Review Schema** - Check all fields match your requirements
2. **Run Migration** - Create database tables
3. **Seed Data** - Add initial data
4. **Create API Routes** - Use Prisma Client in API routes
5. **Replace Mock Data** - Update contexts to use API

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl-best-practices.html)

---

**Status: ✅ Complete & Ready for Implementation!**

