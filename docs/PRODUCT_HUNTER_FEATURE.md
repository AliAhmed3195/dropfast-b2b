# Product Hunter Feature – Design & Implementation Guide

## 1. Overview

**Product Hunter** = naya role jisse koi user platform pe onboard ho sakta hai, **multiple suppliers ko refer/invite** kar sakta hai, aur jab bhi **us supplier ki koi product** kisi **vendor ke store** pe **sell** hoti hai to hunter ko **% commission** milti hai.

- **Supplier / Vendor** jaisa hi ek **role** (login, dashboard, payouts).
- **Link:** Hunter → Suppliers (kaun hunter ne kaun‑se suppliers ko bring kiya).
- **Commission:** Order place hone pe, agar item ka supplier kisi hunter se linked hai to us order item pe hunter ko X% commission.

---

## 2. Core Flow (Short)

```
Product Hunter onboard
    → Suppliers ko refer karta hai (referral code / invite link)
    → Supplier signup pe hunter_id link ho jata hai
    → Vendor store pe supplier ka product sell hota hai (Order)
    → OrderItem me supplierId hai → Supplier se Product Hunter milta hai
    → Commission calculate (e.g. order item value ka Y%)
    → Hunter ko commission record create (pending → paid via Payout)
```

---

## 3. Database Changes

### 3.1 User & Role

- **UserType enum** me naya value: `PRODUCT_HUNTER`.
- **User** model me (optional): `hunterCommissionRate Float?` – agar per‑hunter rate rakhna ho; warna global config use karo.

### 3.2 Supplier ↔ Product Hunter Link

**Option A (recommended):** `User` table me **suppliers** side pe link  
(Supplier = User with role SUPPLIER; us User pe hunter ka reference.)

- **User** model me naya field: `referredByHunterId String?` (optional FK to User where role = PRODUCT_HUNTER).  
  Ya  
- **Naya table:** `SupplierHunter`  
  - `id`, `supplierId` (User id), `hunterId` (User id), `referredAt`, `referralCode` (optional).  
  - Unique `[supplierId]` – ek supplier sirf ek hunter se linked.

**Option B:** Sirf **referral code** se link (no direct FK).  
- Table: `HunterReferralCode` – `hunterId`, `code` (unique), `usedAt`, `supplierId`.  
- Supplier signup pe code enter karta hai → us code se hunter match karke supplier ko us hunter se link karte ho (e.g. `User.referredByHunterId` ya `SupplierHunter` row).

Recommendation: **User.referredByHunterId** (nullable) + optional **HunterReferralCode** table for invite flow. Simple and clear.

### 3.3 Commission Tracking

**Naya table: `HunterCommission`**

| Column           | Type     | Description |
|------------------|----------|-------------|
| id               | String   | PK (cuid)   |
| hunterId         | String   | FK → User   |
| orderItemId      | String   | FK → OrderItem |
| supplierId       | String   | Denormalized (order item ka supplier) |
| orderId          | String   | FK → Order (for grouping) |
| commissionBase   | Float    | Jis amount pe % lagaya (e.g. vendorPrice * qty) |
| commissionRate  | Float    | % at time of order (e.g. 5.0) |
| amount           | Float    | Actual commission (USD) |
| status           | Enum     | PENDING \| PAID \| CANCELLED |
| paidAt           | DateTime?| When included in a payout |
| payoutId         | String?  | FK → Payout (when we add hunter payouts) |
| createdAt        | DateTime | |

Index: `hunterId`, `orderItemId`, `status`, `createdAt`.

**Commission base** decide karna:  
- **Vendor selling price** (customer ne jo pay kiya) ka X% – simple.  
- Ya **supplier cost** pe fixed % – platform policy pe depend.

### 3.4 Payouts for Hunters

**Option A:** Existing **Payout** model extend karo:  
- `payoutType`: add value `'hunter'` (abhi `'supplier' \| 'vendor'`).  
- `userId` = hunter id.  
- `orderIds` / ya naya field `hunterCommissionIds String[]` – kaun‑se commission records is payout me include.

**Option B:** Alag table `HunterPayout` (id, hunterId, amount, status, method, processedAt, commissionIds[]).  

Recommendation: **Option A** – same Payout table, `payoutType = 'hunter'`, so admin/reports same flow use kar sake.

---

## 4. Commission Calculation – When & How

- **Trigger:** Order **payment success** / order status **PAID** ya **PROCESSING** (jis step pe tum order “confirmed” mante ho) pe.
- **Per OrderItem:**  
  - `OrderItem.supplierId` se Supplier (User) milta hai.  
  - Us User ka `referredByHunterId` (ya SupplierHunter table) se **Product Hunter** milta hai.  
  - Agar hunter hai:  
    - `commissionBase` = e.g. `vendorPrice * quantity` (ya jo policy ho).  
    - `commissionRate` = global config se (e.g. `PlatformConfig.hunterCommissionPercentage`) ya User.hunterCommissionRate.  
    - `amount = commissionBase * (commissionRate / 100)`.  
  - **HunterCommission** row create: status PENDING.

**Config:**  
- `PlatformConfig` me: `hunterCommissionPercentage Float?` (e.g. 5.0).  
- Optional: per-hunter override in User (e.g. `hunterCommissionRate` for role PRODUCT_HUNTER).

---

## 5. Functionality Checklist (Kya kya add karenge)

### 5.1 Auth & Role

- [ ] **UserType:** Add `PRODUCT_HUNTER`.
- [ ] **Login / Register:** Product Hunter bhi select ho sakta hai (ya admin invite-only).
- [ ] **Post-login redirect:** `role === 'product_hunter'` → `/dashboard/product-hunter/overview` (ya jo route map ho).

### 5.2 Product Hunter Dashboard (UI)

- [ ] **Overview:** Total referred suppliers, total commission (lifetime + pending + paid), recent activity.
- [ ] **Referred Suppliers:** List of suppliers (name, email, joined date, total sales from their products, commission earned from them).
- [ ] **Commissions:** List of commission rows (date, order, product, supplier, amount, status PENDING/PAID).
- [ ] **Payouts:** List of payouts (amount, status, date) – same Payout table with `payoutType = 'hunter'`.
- [ ] **Referral / Invite:**  
  - Unique **referral code** (e.g. `HUNTER-ABC123`) ya **invite link** (e.g. `/signup?ref=HUNTER-ABC123`).  
  - Supplier signup form pe “Referral code (optional)” field; submit pe `referredByHunterId` set.

### 5.3 Supplier Onboarding – Hunter Link

- [ ] **Supplier signup:** Optional field “Referred by (code)” – agar code match kare to `User.referredByHunterId = hunterId`.
- [ ] **Admin:** Admin panel me supplier edit pe “Product Hunter” dropdown (optional) – manually assign hunter.
- [ ] **Hunter invite link:** Hunter dashboard pe “Invite supplier” → link copy; supplier us link se signup kare to `ref` query se hunter set.

### 5.4 Order Flow – Commission Create

- [ ] **Order success path:** Jahan order place hone ke baad payment confirm hota hai (e.g. Stripe webhook / order status update), wahan **per OrderItem** check:  
  - `supplierId` → User (supplier) → `referredByHunterId` → if present, create **HunterCommission** (PENDING).
- [ ] **Idempotency:** Same orderItemId pe do baar commission na bane (unique constraint ya check).

### 5.5 Commission Rate Config

- [ ] **PlatformConfig:** Add `hunterCommissionPercentage` (default e.g. 5).
- [ ] **Admin:** Settings me “Product Hunter commission %” editable.

### 5.6 Hunter Payouts

- [ ] **Payout table:** `payoutType` me `'hunter'` support.
- [ ] **Admin / Cron:** “Hunter payouts” screen: select PENDING commissions, group by hunter, create Payout (method = bank_transfer / stripe etc.), mark commissions PAID, set `payoutId`.
- [ ] **Hunter dashboard:** “My payouts” list (read-only).

### 5.7 Admin

- [ ] **Admin – Product Hunters:** List hunters (name, email, referred suppliers count, total commission, status).
- [ ] **Admin – Users:** Create user with role Product Hunter; optionally edit hunter’s commission rate.
- [ ] **Admin – Suppliers:** List me “Referred by (Hunter)” column; edit pe hunter assign/change.

### 5.8 Routes & Navigation

- [ ] **routeMap:** Add `product_hunter: { dashboard, referred-suppliers, commissions, payouts, invite, settings }`.
- [ ] **Sidebar / Header:** Role product_hunter ke liye menu items.
- [ ] **Dashboard layout:** `product_hunter` role ke liye redirect to `/dashboard/product-hunter/overview`.

---

## 6. URL Structure (Suggested)

| Page              | Route |
|-------------------|--------|
| Hunter overview   | `/dashboard/product-hunter/overview` |
| Referred suppliers| `/dashboard/product-hunter/suppliers` |
| Commissions       | `/dashboard/product-hunter/commissions` |
| Payouts           | `/dashboard/product-hunter/payouts` |
| Invite / referral | `/dashboard/product-hunter/invite` |
| Settings          | `/dashboard/product-hunter/settings` |

---

## 7. API Endpoints (Suggested)

| Method | Path | Purpose |
|--------|------|--------|
| GET    | `/api/product-hunter/dashboard`     | Stats: referred count, commission totals |
| GET    | `/api/product-hunter/suppliers`     | List referred suppliers |
| GET    | `/api/product-hunter/commissions`   | List commissions (with filters) |
| GET    | `/api/product-hunter/payouts`       | List hunter’s payouts |
| GET    | `/api/product-hunter/referral-code` | Get hunter’s referral code / invite link |
| POST   | (signup)                             | Body me `referralCode` optional – set referredByHunterId |
| (Admin) GET  | `/api/admin/hunters`          | List all hunters |
| (Admin) POST | `/api/admin/payouts/hunter`  | Create hunter payout (select commissions) |

---

## 8. Implementation Order (Suggested)

1. **Schema:** UserType + `User.referredByHunterId`, `HunterCommission` table, `PlatformConfig.hunterCommissionPercentage`, Payout.payoutType hunter.
2. **Seed / migration:** Existing suppliers pe `referredByHunterId = null`; kuch test hunters create karo.
3. **Order flow:** Order success handler me commission creation (with supplier → hunter lookup).
4. **Auth & redirect:** Login me product_hunter role → hunter dashboard.
5. **Hunter dashboard UI:** Overview, referred suppliers, commissions, payouts, invite/referral.
6. **Supplier signup:** Referral code field + backend link.
7. **Admin:** Hunters list, hunter payouts, supplier–hunter assign.
8. **Hunter payouts:** Admin flow to create Payout for hunter and mark commissions PAID.

---

## 9. Summary

| Item | Detail |
|------|--------|
| **Role** | PRODUCT_HUNTER (UserType) |
| **Link** | Supplier → Hunter via `User.referredByHunterId` (or referral code at signup) |
| **Commission** | Per OrderItem: if supplier has hunter → % of (e.g. vendor price × qty) → HunterCommission row |
| **Payout** | Same Payout model, payoutType = 'hunter'; admin creates payout, marks commissions PAID |
| **Config** | PlatformConfig.hunterCommissionPercentage (and optional per-hunter rate) |

Is hisaab se implement karenge to **Product Hunter** feature complete hoga: onboard, multiple suppliers link, unki sales pe % commission, aur commission payouts.
