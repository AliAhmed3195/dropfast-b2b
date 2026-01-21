-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'SUPPLIER', 'VENDOR', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'REFURBISHED', 'USED_LIKE_NEW', 'USED_GOOD');

-- CreateEnum
CREATE TYPE "StoreType" AS ENUM ('SINGLE_PRODUCT', 'MULTI_PRODUCT');

-- CreateEnum
CREATE TYPE "StoreTemplate" AS ENUM ('MODERN', 'CLASSIC', 'MINIMAL', 'BOLD');

-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('SALES', 'ORDERS', 'PAYOUTS', 'INVENTORY', 'USERS', 'PRODUCTS');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('PDF', 'EXCEL', 'CSV');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('GENERATING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserType" NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessName" TEXT,
    "businessType" TEXT,
    "registrationNumber" TEXT,
    "vatNumber" TEXT,
    "taxId" TEXT,
    "country" TEXT,
    "currency" TEXT,
    "baseCurrency" TEXT,
    "streetAddress" TEXT,
    "city" TEXT,
    "stateProvince" TEXT,
    "zipCode" TEXT,
    "addressCountry" TEXT,
    "productCategories" TEXT,
    "shippingLocations" TEXT,
    "minimumOrderValue" DOUBLE PRECISION,
    "commissionRate" DOUBLE PRECISION DEFAULT 15.0,
    "stripeAccountId" TEXT,
    "stripeKycStatus" TEXT,
    "stripeOnboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "stripeChargesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stripePayoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notificationPreferences" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
    "costPrice" DOUBLE PRECISION NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "moq" INTEGER NOT NULL DEFAULT 1,
    "stockAlertThreshold" INTEGER,
    "categoryId" TEXT,
    "subcategory" TEXT,
    "condition" "ProductCondition" NOT NULL DEFAULT 'NEW',
    "warrantyPeriod" TEXT,
    "leadTime" TEXT,
    "weight" DOUBLE PRECISION,
    "weightUnit" TEXT DEFAULT 'kg',
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "dimensionUnit" TEXT DEFAULT 'cm',
    "shippingCost" DOUBLE PRECISION DEFAULT 0,
    "shippingCountries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "shippingMethods" JSONB,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "hasVariants" BOOLEAN NOT NULL DEFAULT false,
    "variants" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" TEXT,
    "createdByUserType" "UserType",
    "supplierId" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "storeType" "StoreType" NOT NULL DEFAULT 'MULTI_PRODUCT',
    "logo" TEXT,
    "banner" TEXT,
    "template" "StoreTemplate" NOT NULL DEFAULT 'MODERN',
    "primaryColor" TEXT NOT NULL DEFAULT '#6366f1',
    "secondaryColor" TEXT NOT NULL DEFAULT '#06b6d4',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "aboutText" TEXT,
    "contactEmail" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "sections" JSONB,
    "status" "StoreStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorId" TEXT NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_products" (
    "id" TEXT NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "store_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "shippingMethod" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "shippingFullName" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingState" TEXT NOT NULL,
    "shippingZipCode" TEXT NOT NULL,
    "shippingCountry" TEXT NOT NULL,
    "shippingPhone" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerCurrency" TEXT,
    "paymentIntentId" TEXT,
    "trackingNumber" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "supplierId" TEXT,
    "storeProductId" TEXT,
    "supplierPrice" DOUBLE PRECISION,
    "vendorPrice" DOUBLE PRECISION,
    "vendorProfit" DOUBLE PRECISION,
    "stripeFeeSupplier" DOUBLE PRECISION,
    "stripeFeeVendor" DOUBLE PRECISION,
    "platformFee" DOUBLE PRECISION,
    "customerCurrency" TEXT,
    "exchangeRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "emailStatus" TEXT,
    "sentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorId" TEXT NOT NULL,
    "orderId" TEXT,
    "templateId" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT NOT NULL,
    "accountDetails" JSONB,
    "processedAt" TIMESTAMP(3),
    "transferId" TEXT,
    "orderIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "payoutType" TEXT NOT NULL,
    "baseAmount" DOUBLE PRECISION NOT NULL,
    "stripeFee" DOUBLE PRECISION,
    "platformFee" DOUBLE PRECISION,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "recipientCurrency" TEXT,
    "recipientName" TEXT,
    "recipientType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_config" (
    "id" TEXT NOT NULL,
    "platformFeePercentage" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "stripeFeePercentage" DOUBLE PRECISION NOT NULL DEFAULT 2.9,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storeId" TEXT,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reportNumber" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "dateFrom" TIMESTAMP(3) NOT NULL,
    "dateTo" TIMESTAMP(3) NOT NULL,
    "format" "ReportFormat" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'GENERATING',
    "fileUrl" TEXT,
    "fileSize" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT NOT NULL,
    "layout" TEXT,
    "accentColor" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usedBy" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_invoice_templates" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "store_invoice_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_supplierId_idx" ON "products"("supplierId");

-- CreateIndex
CREATE INDEX "products_createdByUserId_idx" ON "products"("createdByUserId");

-- CreateIndex
CREATE INDEX "products_createdByUserType_idx" ON "products"("createdByUserType");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_sku_idx" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_tags_productId_tagId_key" ON "product_tags"("productId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_vendorId_idx" ON "stores"("vendorId");

-- CreateIndex
CREATE INDEX "stores_slug_idx" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_status_idx" ON "stores"("status");

-- CreateIndex
CREATE INDEX "store_products_storeId_idx" ON "store_products"("storeId");

-- CreateIndex
CREATE INDEX "store_products_productId_idx" ON "store_products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "store_products_storeId_productId_key" ON "store_products"("storeId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId");

-- CreateIndex
CREATE INDEX "orders_storeId_idx" ON "orders"("storeId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "order_items_supplierId_idx" ON "order_items"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_vendorId_idx" ON "invoices"("vendorId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "payouts_userId_idx" ON "payouts"("userId");

-- CreateIndex
CREATE INDEX "payouts_status_idx" ON "payouts"("status");

-- CreateIndex
CREATE INDEX "wishlist_userId_idx" ON "wishlist"("userId");

-- CreateIndex
CREATE INDEX "wishlist_productId_idx" ON "wishlist"("productId");

-- CreateIndex
CREATE INDEX "wishlist_storeId_idx" ON "wishlist"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_userId_productId_key" ON "wishlist"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "reports_reportNumber_key" ON "reports"("reportNumber");

-- CreateIndex
CREATE INDEX "reports_userId_idx" ON "reports"("userId");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_type_idx" ON "reports"("type");

-- CreateIndex
CREATE UNIQUE INDEX "store_invoice_templates_storeId_key" ON "store_invoice_templates"("storeId");

-- CreateIndex
CREATE INDEX "store_invoice_templates_storeId_idx" ON "store_invoice_templates"("storeId");

-- CreateIndex
CREATE INDEX "store_invoice_templates_templateId_idx" ON "store_invoice_templates"("templateId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "invoice_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_invoice_templates" ADD CONSTRAINT "store_invoice_templates_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_invoice_templates" ADD CONSTRAINT "store_invoice_templates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "invoice_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
