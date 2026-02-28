-- ============================================================
-- Product Hunter: DB setup script (PostgreSQL)
-- Run this directly on your DB (psql, pgAdmin, DBeaver, etc.).
-- Idempotent: safe to run multiple times.
--
-- After running:
--   npx prisma generate
-- ============================================================

-- 1) Add PRODUCT_HUNTER to UserType enum (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'UserType' AND e.enumlabel = 'PRODUCT_HUNTER'
  ) THEN
    ALTER TYPE "UserType" ADD VALUE 'PRODUCT_HUNTER';
  END IF;
END $$;

-- 2) Users: Product Hunter columns
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "hunterReferralCode" TEXT,
  ADD COLUMN IF NOT EXISTS "referredByHunterId" TEXT;

-- Unique constraint on referral code (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_hunterReferralCode_key'
  ) THEN
    ALTER TABLE "users" ADD CONSTRAINT "users_hunterReferralCode_key" UNIQUE ("hunterReferralCode");
  END IF;
END $$;

-- FK: referredByHunterId -> users(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_referredByHunterId_fkey'
  ) THEN
    ALTER TABLE "users"
      ADD CONSTRAINT "users_referredByHunterId_fkey"
      FOREIGN KEY ("referredByHunterId") REFERENCES "users"("id");
  END IF;
END $$;

-- Index for referredByHunterId
CREATE INDEX IF NOT EXISTS "users_referredByHunterId_idx" ON "users"("referredByHunterId");

-- 3) HunterCommissionStatus enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'HunterCommissionStatus') THEN
    CREATE TYPE "HunterCommissionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');
  END IF;
END $$;

-- 4) hunter_commissions table
CREATE TABLE IF NOT EXISTS "hunter_commissions" (
  "id" TEXT NOT NULL,
  "hunterId" TEXT NOT NULL,
  "orderItemId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "commissionBase" DOUBLE PRECISION NOT NULL,
  "commissionRate" DOUBLE PRECISION NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "status" "HunterCommissionStatus" NOT NULL DEFAULT 'PENDING',
  "paidAt" TIMESTAMP(3),
  "payoutId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  UNIQUE ("orderItemId"),
  CONSTRAINT "hunter_commissions_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "hunter_commissions_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "payouts"("id")
);

CREATE INDEX IF NOT EXISTS "hunter_commissions_hunterId_idx" ON "hunter_commissions"("hunterId");
CREATE INDEX IF NOT EXISTS "hunter_commissions_orderId_idx" ON "hunter_commissions"("orderId");
CREATE INDEX IF NOT EXISTS "hunter_commissions_status_idx" ON "hunter_commissions"("status");
CREATE INDEX IF NOT EXISTS "hunter_commissions_payoutId_idx" ON "hunter_commissions"("payoutId");

-- 5) Payouts: hunter-related columns (if table exists)
ALTER TABLE "payouts"
  ADD COLUMN IF NOT EXISTS "recipientType" TEXT,
  ADD COLUMN IF NOT EXISTS "hunterCommissionIds" TEXT[] DEFAULT '{}';

-- 6) PlatformConfig: hunter commission % (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_config') THEN
    ALTER TABLE "platform_config"
      ADD COLUMN IF NOT EXISTS "hunterCommissionPercentage" DOUBLE PRECISION DEFAULT 5.0;
    UPDATE "platform_config" SET "hunterCommissionPercentage" = 5.0 WHERE "hunterCommissionPercentage" IS NULL;
  END IF;
END $$;
