# Quick Database Setup

## Step 1: Database Manually Create Karein

Aapko pehle PostgreSQL me database manually create karni hogi. Do options hain:

### Option A: pgAdmin Se (Easiest)

1. **pgAdmin open karein**
2. **Server connect karein:**
   - Right click on "Servers" → Register → Server
   - Name: Local PostgreSQL
   - Host: localhost
   - Port: 5432
   - Username: `admin` (ya jo bhi aapka user hai)
   - Password: `1234`
   - Save password: ✓
   - Click "Save"

3. **Database create karein:**
   - Servers → Local PostgreSQL → Databases → Right Click
   - Create → Database
   - Database: `dropfast_b2b`
   - Owner: `admin` (ya aapka user)
   - Click "Save"

### Option B: SQL Query Se

pgAdmin me Query Tool open karein aur yeh query run karein:

```sql
CREATE DATABASE dropfast_b2b
    WITH 
    OWNER = admin
    ENCODING = 'UTF8';
```

## Step 2: .env File Verify Karein

`.env` file me correct credentials honi chahiye:

```env
DATABASE_URL="postgresql://admin:1234@localhost:5432/dropfast_b2b?schema=public"
```

**Important:** 
- Agar aapka PostgreSQL user `admin` nahi hai, to correct username use karein
- Agar password different hai, to update karein
- Default PostgreSQL user usually `postgres` hota hai

## Step 3: Migrations Run Karein

Database create hone ke baad:

```powershell
npx prisma migrate dev --name init
```

## Step 4: Seed Database

```powershell
npx prisma db seed
```

Ya:

```powershell
npx tsx prisma/seed.ts
```

## Troubleshooting

### Agar "Authentication failed" error aaye:

1. **PostgreSQL service check karein:**
   ```powershell
   Get-Service -Name postgresql*
   ```

2. **Service start karein (agar running nahi hai):**
   ```powershell
   Start-Service postgresql-x64-14
   ```
   (Service name apne PostgreSQL version ke according change karein)

3. **Correct username/password verify karein:**
   - Default PostgreSQL user: `postgres`
   - Password: Aapka PostgreSQL installation password

4. **`.env` file me correct credentials set karein:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/dropfast_b2b?schema=public"
   ```

### Agar "Database does not exist" error aaye:

Pehle database manually create karein (Step 1 dekhein)

## After Setup

Seed complete hone ke baad yeh users available honge:

- **Admin:** admin@fastdrop.com / admin123
- **Supplier:** supplier@fastdrop.com / supplier123  
- **Vendor:** vendor@fastdrop.com / vendor123
- **Customer:** customer@fastdrop.com / customer123
