# Database Setup Instructions - Local PostgreSQL

## Step 1: PostgreSQL Server Check

Pehle verify karein ki PostgreSQL server running hai:

```powershell
# Check PostgreSQL service status
Get-Service -Name postgresql*
```

Agar service running nahi hai, to start karein:
```powershell
# Start PostgreSQL service (service name apne system ke according change karein)
Start-Service postgresql-x64-14  # Ya apni PostgreSQL version ke according
```

## Step 2: Database Create Karein

PostgreSQL me database create karein. Aapke paas do options hain:

### Option A: PostgreSQL Command Line Se (agar psql PATH me hai)

```powershell
# Password set karein
$env:PGPASSWORD="1234"

# Database create karein
psql -U admin -h localhost -d postgres -c "CREATE DATABASE dropfast_b2b;"
```

### Option B: pgAdmin ya kisi GUI tool se

1. pgAdmin open karein
2. Server connect karein (admin user se)
3. Databases → Right Click → Create → Database
4. Database name: `dropfast_b2b`
5. Owner: `admin` (ya aapka user)
6. Create karein

### Option C: SQL Query Se

```sql
CREATE DATABASE dropfast_b2b
    WITH 
    OWNER = admin
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

## Step 3: Verify Connection

`.env` file me DATABASE_URL verify karein:

```env
DATABASE_URL="postgresql://admin:1234@localhost:5432/dropfast_b2b?schema=public"
```

**Important:** 
- Agar aapka PostgreSQL user `admin` nahi hai, to `.env` me correct username use karein
- Agar password different hai, to update karein
- Agar port different hai (default 5432), to port bhi update karein

## Step 4: Run Migrations

Database create hone ke baad migrations run karein:

```powershell
npx prisma migrate dev --name init
```

## Step 5: Seed Database

Migrations complete hone ke baad seed run karein:

```powershell
npx prisma db seed
```

Ya directly:

```powershell
npx tsx prisma/seed.ts
```

## Troubleshooting

### Error: Authentication failed

**Solution:** 
- Verify ki PostgreSQL server running hai
- Check karein ki username/password sahi hai
- Agar `admin` user nahi hai, to `postgres` user try karein:

```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/dropfast_b2b?schema=public"
```

### Error: Database does not exist

**Solution:**
- Pehle database manually create karein (Step 2 dekhein)

### Error: Connection refused

**Solution:**
- PostgreSQL service start karein
- Port verify karein (default 5432)
- Firewall check karein

## Default Users Created After Seeding

Seed script run hone ke baad yeh users create honge:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fastdrop.com | admin123 |
| Supplier | supplier@fastdrop.com | supplier123 |
| Vendor | vendor@fastdrop.com | vendor123 |
| Customer | customer@fastdrop.com | customer123 |

## Next Steps

1. ✅ Database create
2. ✅ Migrations run
3. ✅ Seed data
4. ✅ Start development server: `npm run dev`
5. ✅ Login karein with above credentials
