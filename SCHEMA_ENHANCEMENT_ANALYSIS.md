# 🔍 Database Schema Enhancement Analysis

## ✅ Complete Menu-by-Menu Review

---

## 👑 ADMIN MENUS

### 1. **Overview (Dashboard)**
- ✅ Uses existing data (Orders, Products, Users, Revenue)
- ✅ No new fields needed

### 2. **Users**
- ✅ User model complete
- ✅ All form fields covered

### 3. **Vendors**
- ✅ User model with role=VENDOR
- ✅ All form fields covered

### 4. **Suppliers**
- ✅ User model with role=SUPPLIER
- ✅ All form fields covered

### 5. **Orders**
- ✅ Order model complete
- ⚠️ **MISSING:** `trackingNumber`, `shippedAt`, `deliveredAt` (for tracking)

### 6. **Payouts**
- ✅ Payout model exists
- ⚠️ **MISSING:** `recipientName`, `recipientType`, `email`, `phone` (for display - can derive from User)
- ⚠️ **MISSING:** `ordersCount` (calculated), `lastPayout` (calculated)

### 7. **Inventory** (Products, Categories, Tags)
- ✅ Product model complete
- ✅ Category model complete
- ✅ Tag model complete

### 8. **Categories**
- ✅ Category model complete

### 9. **Tags**
- ✅ Tag model complete

### 10. **Invoices (Invoice Templates)**
- ✅ InvoiceTemplate model exists
- ⚠️ **MISSING:** `description`, `layout`, `accentColor`, `isActive`, `usedBy`

### 11. **Analytics**
- ✅ Uses existing data (calculated)
- ✅ No new fields needed

### 12. **Reports**
- ⚠️ **MISSING:** Reports model (for generated reports)
- Fields needed: `type`, `dateRange`, `format`, `generatedAt`, `status`, `fileSize`, `fileUrl`

### 13. **Settings**
- ✅ User model has profile fields
- ⚠️ **MISSING:** Notification preferences (JSON field)

---

## 📦 SUPPLIER MENUS

### 1. **Dashboard**
- ✅ Uses existing data
- ✅ No new fields needed

### 2. **Products**
- ✅ Product model complete
- ✅ All form fields covered

### 3. **Orders**
- ✅ Order model complete
- ⚠️ **MISSING:** `trackingNumber`, `shippedAt`, `deliveredAt`

### 4. **Payouts**
- ✅ Payout model exists
- ✅ SupplierPayoutSetup form fields covered

### 5. **Analytics**
- ✅ Uses existing data
- ✅ No new fields needed

### 6. **Settings**
- ✅ User model has profile fields
- ⚠️ **MISSING:** Notification preferences

---

## 🏪 VENDOR MENUS

### 1. **Dashboard**
- ✅ Uses existing data
- ✅ No new fields needed

### 2. **My Stores**
- ✅ Store model complete
- ⚠️ **MISSING:** `sections` (JSON - for StoreBuilder drag & drop sections)

### 3. **Inventory**
- ✅ Uses Product model
- ✅ No new fields needed

### 4. **Products**
- ✅ StoreProduct model complete
- ✅ All form fields covered

### 5. **Orders**
- ✅ Order model complete
- ⚠️ **MISSING:** `trackingNumber`, `shippedAt`, `deliveredAt`

### 6. **Invoices**
- ✅ Invoice model exists
- ⚠️ **MISSING:** `emailStatus`, `sentDate`, `templateId`

### 7. **Templates (Invoice Templates)**
- ✅ InvoiceTemplate model exists
- ⚠️ **MISSING:** `description`, `layout`, `accentColor`
- ⚠️ **MISSING:** Store-Template relation (which template used by which store)

### 8. **Account Details**
- ✅ User model has Stripe fields
- ✅ All form fields covered

### 9. **Customers**
- ✅ Uses User model (role=CUSTOMER)
- ⚠️ **MISSING:** Customer status, rating (can be calculated from orders)

### 10. **Settings**
- ✅ User model has profile fields
- ⚠️ **MISSING:** Notification preferences

---

## 🛍️ CUSTOMER MENUS

### 1. **Browse Stores**
- ✅ Uses Store and Product models
- ✅ No new fields needed

### 2. **My Orders**
- ✅ Order model complete
- ⚠️ **MISSING:** `trackingNumber`, `shippedAt`, `deliveredAt`

### 3. **Wishlist**
- ⚠️ **MISSING:** Wishlist model (currently using localStorage)
- Fields needed: `userId`, `productId`, `storeId`, `createdAt`

### 4. **Settings**
- ✅ User model has profile fields
- ⚠️ **MISSING:** Notification preferences

---

## 📋 MISSING FIELDS & MODELS SUMMARY

### **1. Order Model - Missing Fields:**
```prisma
trackingNumber  String?
shippedAt       DateTime?
deliveredAt     DateTime?
```

### **2. Invoice Model - Missing Fields:**
```prisma
emailStatus     String?  // sent, not_sent
sentDate        DateTime?
templateId      String?
template        InvoiceTemplate? @relation(fields: [templateId], references: [id])
```

### **3. InvoiceTemplate Model - Missing Fields:**
```prisma
description     String?  @db.Text
layout          String?  // gradient, classic, minimal, corporate
accentColor     String?  // CSS gradient class
isActive        Boolean  @default(true)
usedBy          Int      @default(0) // Count of stores using this template
```

### **4. InvoiceTemplate - Missing Relation:**
```prisma
// Store-Template relation (which template each store uses)
model StoreInvoiceTemplate {
  id            String   @id @default(cuid())
  storeId       String
  templateId  String
  store         Store    @relation(fields: [storeId], references: [id])
  template      InvoiceTemplate @relation(fields: [templateId], references: [id])
  
  @@unique([storeId])
  @@map("store_invoice_templates")
}
```

### **5. Store Model - Missing Fields:**
```prisma
sections        Json?    // StoreBuilder sections (drag & drop)
```

### **6. User Model - Missing Fields:**
```prisma
notificationPreferences Json?  // { emailNotifications, orderUpdates, etc. }
```

### **7. NEW MODEL: Wishlist**
```prisma
model Wishlist {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  productId     String
  product       Product  @relation(fields: [productId], references: [id])
  storeId       String?
  store         Store?   @relation(fields: [storeId], references: [id])
  
  @@unique([userId, productId])
  @@index([userId])
  @@index([productId])
  @@map("wishlist")
}
```

### **8. NEW MODEL: Report**
```prisma
model Report {
  id            String   @id @default(cuid())
  reportNumber  String   @unique
  type          ReportType
  dateFrom      DateTime
  dateTo        DateTime
  format        ReportFormat
  status        ReportStatus @default(GENERATING)
  fileUrl       String?
  fileSize      String?  // e.g., "2.4 MB"
  generatedAt   DateTime?
  createdAt     DateTime @default(now())
  
  userId        String?  // Who generated it
  user          User?    @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([status])
  @@map("reports")
}

enum ReportType {
  SALES
  ORDERS
  PAYOUTS
  INVENTORY
  USERS
  PRODUCTS
}

enum ReportFormat {
  PDF
  EXCEL
  CSV
}

enum ReportStatus {
  GENERATING
  COMPLETED
  FAILED
}
```

### **9. Payout Model - Optional Display Fields:**
```prisma
// These can be calculated from User relation, but for performance:
recipientName   String?  // Denormalized for quick display
recipientType   String?  // supplier, vendor
```

---

## ✅ RECOMMENDED ENHANCEMENTS

### **Priority 1 (Critical):**
1. ✅ **Wishlist Model** - Currently using localStorage
2. ✅ **Order tracking fields** - trackingNumber, shippedAt, deliveredAt
3. ✅ **Invoice email tracking** - emailStatus, sentDate, templateId

### **Priority 2 (Important):**
4. ✅ **InvoiceTemplate enhancements** - description, layout, accentColor, isActive
5. ✅ **Store sections** - JSON field for StoreBuilder
6. ✅ **Store-Template relation** - Which template each store uses

### **Priority 3 (Nice to Have):**
7. ✅ **Notification preferences** - JSON in User model
8. ✅ **Reports model** - For generated reports
9. ✅ **Payout display fields** - Optional denormalization

---

## 🎯 FINAL RECOMMENDATION

**Add these enhancements to make schema complete:**

1. ✅ Order tracking fields
2. ✅ Invoice email tracking
3. ✅ InvoiceTemplate enhancements
4. ✅ Store sections (JSON)
5. ✅ Store-Template relation
6. ✅ Wishlist model
7. ✅ Notification preferences
8. ✅ Reports model (optional - can be file-based)

**Total: 7 enhancements needed**

