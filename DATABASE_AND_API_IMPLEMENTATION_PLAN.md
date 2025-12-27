# 🗄️ Database & API Implementation Plan

## 📋 Current Status

✅ **UI Converted to Next.js**  
✅ **Routing Completed**  
✅ **Mock Data Working**  
⏳ **Database & API - Next Step**

---

## 🎯 Recommendation: **Database + Prisma First** ✅

### **Why Database First?**

1. **Foundation First** - Database schema defines your data structure
2. **API Depends on Models** - API routes need Prisma models
3. **Better Planning** - Design database, then build APIs
4. **Type Safety** - Prisma generates TypeScript types
5. **Migration Path** - Easier to migrate from mock to real data

### **Order of Implementation:**

```
1. Database Schema Design ✅
2. Prisma Setup ✅
3. Database Migration ✅
4. Seed Data ✅
5. API Routes ✅
6. Replace Mock Data ✅
```

---

## 📊 Step 1: Database Schema Analysis

Based on your current code, here are the main entities:

### **Core Entities:**

1. **User** (Admin, Supplier, Vendor, Customer)
2. **Product** (Supplier products)
3. **Store** (Vendor stores)
4. **Order** (Customer orders)
5. **OrderItem** (Order line items)
6. **Category** (Product categories)
7. **Tag** (Product tags)
8. **Invoice** (Vendor invoices)
9. **Payout** (Supplier/Vendor payouts)
10. **Cart** (Customer cart - can be session-based)

### **Relationships:**

```
User (1) ──→ (Many) Products (Supplier)
User (1) ──→ (Many) Stores (Vendor)
Store (1) ──→ (Many) Products
Product (Many) ──→ (Many) Categories
Product (Many) ──→ (Many) Tags
Order (1) ──→ (Many) OrderItems
Order (1) ──→ (1) Customer (User)
Order (1) ──→ (1) Store
```

---

## 🛠️ Step 2: Prisma Setup

### **Install Prisma:**

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### **Initialize Prisma:**

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

---

## 📝 Step 3: Database Schema Design

### **Recommended Schema Structure:**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql" or "sqlite"
  url      = env("DATABASE_URL")
}

// User Model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed password
  name      String
  role      UserType
  avatar    String?
  company   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  productsAsSupplier Product[] @relation("SupplierProducts")
  storesAsVendor    Store[]   @relation("VendorStores")
  ordersAsCustomer  Order[]   @relation("CustomerOrders")
  invoices          Invoice[]
  payouts           Payout[]

  @@map("users")
}

enum UserType {
  ADMIN
  SUPPLIER
  VENDOR
  CUSTOMER
}

// Category Model
model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  image       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  products    Product[]

  @@map("categories")
}

// Tag Model
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  color     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products  Product[]

  @@map("tags")
}

// Product Model
model Product {
  id            String        @id @default(cuid())
  name          String
  description   String        @db.Text
  sku           String        @unique
  price         Float
  originalPrice Float?
  stock         Int           @default(0)
  images        String[]      @default([])
  rating        Float         @default(0)
  reviews       Int           @default(0)
  featured      Boolean       @default(false)
  status        ProductStatus @default(ACTIVE)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  supplierId    String
  supplier      User          @relation("SupplierProducts", fields: [supplierId], references: [id])
  categoryId    String?
  category      Category?     @relation(fields: [categoryId], references: [id])
  tags          Tag[]
  storeProducts StoreProduct[]
  orderItems    OrderItem[]

  @@map("products")
}

enum ProductStatus {
  ACTIVE
  INACTIVE
  OUT_OF_STOCK
}

// Store Model
model Store {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  description   String?  @db.Text
  logo          String?
  banner        String?
  template      StoreTemplate @default(MODERN)
  primaryColor  String   @default("#6366f1")
  secondaryColor String  @default("#06b6d4")
  fontFamily    String   @default("Inter")
  heroTitle     String?
  heroSubtitle  String?
  aboutText     String?  @db.Text
  contactEmail  String?
  facebook      String?
  twitter       String?
  instagram     String?
  status        StoreStatus @default(DRAFT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  vendorId      String
  vendor        User     @relation("VendorStores", fields: [vendorId], references: [id])
  storeProducts StoreProduct[]
  orders        Order[]

  @@map("stores")
}

enum StoreTemplate {
  MODERN
  CLASSIC
  MINIMAL
  BOLD
}

enum StoreStatus {
  ACTIVE
  DRAFT
  INACTIVE
}

// StoreProduct (Many-to-Many: Store ↔ Product)
model StoreProduct {
  id          String   @id @default(cuid())
  storeId     String
  productId   String
  markupPrice Float?   // Vendor's markup price
  metaTitle   String?
  metaDescription String? @db.Text
  metaKeywords String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([storeId, productId])
  @@map("store_products")
}

// Order Model
model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique
  subtotal        Float
  shipping        Float
  tax             Float
  total           Float
  status          OrderStatus   @default(PENDING)
  paymentMethod   String
  paymentStatus   PaymentStatus @default(PENDING)
  fullName        String
  address         String
  city            String
  state           String
  zipCode         String
  country         String
  phone           String
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  customerId      String
  customer        User          @relation("CustomerOrders", fields: [customerId], references: [id])
  storeId         String
  store           Store         @relation(fields: [storeId], references: [id])
  items           OrderItem[]

  @@map("orders")
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

// OrderItem Model
model OrderItem {
  id          String   @id @default(cuid())
  quantity    Int
  price       Float
  productName String
  productImage String?
  createdAt   DateTime @default(now())

  // Relations
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String?
  product     Product? @relation(fields: [productId], references: [id])

  @@map("order_items")
}

// Invoice Model
model Invoice {
  id            String        @id @default(cuid())
  invoiceNumber String        @unique
  amount        Float
  status        InvoiceStatus @default(PENDING)
  dueDate       DateTime?
  paidAt        DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  vendorId      String
  vendor        User          @relation(fields: [vendorId], references: [id])
  orderId       String?
  order         Order?         @relation(fields: [orderId], references: [id])

  @@map("invoices")
}

enum InvoiceStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

// Payout Model
model Payout {
  id            String        @id @default(cuid())
  amount        Float
  status        PayoutStatus  @default(PENDING)
  method        String        // "bank", "paypal", etc.
  accountDetails Json?         // Encrypted account details
  processedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  userId        String
  user          User          @relation(fields: [userId], references: [id])

  @@map("payouts")
}

enum PayoutStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## 🚀 Step 4: Implementation Steps

### **Phase 1: Database Setup** (Week 1)

1. **Install Prisma**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Choose Database**
   - **PostgreSQL** (Recommended for production)
   - **MySQL** (Alternative)
   - **SQLite** (For development/testing)

3. **Configure `.env`**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dropfast?schema=public"
   ```

4. **Create Schema**
   - Copy schema from above
   - Adjust based on your needs

5. **Run Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

7. **Seed Database**
   - Create `prisma/seed.ts`
   - Add initial data (users, categories, etc.)

---

### **Phase 2: API Routes** (Week 2)

Create Next.js API routes in `app/api/`:

```
app/api/
├── auth/
│   ├── login/
│   │   └── route.ts
│   └── logout/
│       └── route.ts
├── products/
│   ├── route.ts (GET, POST)
│   └── [id]/
│       └── route.ts (GET, PUT, DELETE)
├── stores/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── orders/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── categories/
│   └── route.ts
├── tags/
│   └── route.ts
└── ...
```

---

### **Phase 3: Replace Mock Data** (Week 3)

1. **Create API Client**
   - `src/lib/api.ts` - API helper functions

2. **Update Contexts**
   - Replace mock data with API calls
   - Add loading states
   - Add error handling

3. **Update Components**
   - Use API data instead of mock
   - Add loading/error states

---

## 📦 Step 5: Prisma Client Setup

### **Create Prisma Client Singleton:**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 🔐 Step 6: Authentication

### **Password Hashing:**

```bash
npm install bcryptjs
npm install @types/bcryptjs -D
```

### **JWT Tokens:**

```bash
npm install jsonwebtoken
npm install @types/jsonwebtoken -D
```

---

## 📋 Step 7: API Route Examples

### **Example: Products API**

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supplierId = searchParams.get('supplierId')
    
    const products = await prisma.product.findMany({
      where: supplierId ? { supplierId } : {},
      include: {
        supplier: true,
        category: true,
        tags: true,
      },
    })
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
        supplierId: body.supplierId,
        // ... other fields
      },
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
```

---

## ✅ Checklist

### **Database Setup:**
- [ ] Install Prisma
- [ ] Choose database (PostgreSQL/MySQL/SQLite)
- [ ] Create schema.prisma
- [ ] Run migrations
- [ ] Generate Prisma Client
- [ ] Create seed script
- [ ] Test database connection

### **API Routes:**
- [ ] Auth routes (login, logout)
- [ ] Products routes (CRUD)
- [ ] Stores routes (CRUD)
- [ ] Orders routes (CRUD)
- [ ] Categories routes
- [ ] Tags routes
- [ ] Invoices routes
- [ ] Payouts routes

### **Integration:**
- [ ] Create API client
- [ ] Update AuthContext
- [ ] Update AppContext
- [ ] Replace mock data
- [ ] Add error handling
- [ ] Add loading states

---

## 🎯 Timeline Estimate

- **Week 1:** Database + Prisma Setup
- **Week 2:** API Routes Development
- **Week 3:** Integration & Testing

**Total: ~3 weeks**

---

## 🚀 Next Steps

1. **Decide on Database** (PostgreSQL recommended)
2. **Install Prisma**
3. **Create Schema**
4. **Run Migrations**
5. **Start Building APIs**

---

**Ready to start? Let me know and I'll help you set up Prisma!** 🚀

