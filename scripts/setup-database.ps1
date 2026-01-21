# Database Setup Script for DropFast B2B
# This script helps setup PostgreSQL database for local development

Write-Host "🚀 DropFast B2B - Database Setup" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    $dbUrl = Read-Host "Enter DATABASE_URL (or press Enter for default: postgresql://admin:1234@localhost:5432/dropfast_b2b?schema=public)"
    if ([string]::IsNullOrWhiteSpace($dbUrl)) {
        $dbUrl = "postgresql://admin:1234@localhost:5432/dropfast_b2b?schema=public"
    }
    
    Set-Content -Path .env -Value "DATABASE_URL=`"$dbUrl`""
    Write-Host "✅ .env file created" -ForegroundColor Green
}

# Read DATABASE_URL from .env
$envContent = Get-Content .env
$dbUrl = ($envContent | Select-String "DATABASE_URL=").ToString() -replace 'DATABASE_URL="', '' -replace '"', ''

Write-Host "📋 Database URL: $dbUrl" -ForegroundColor Yellow
Write-Host ""

# Parse database URL
if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)") {
    $username = $matches[1]
    $password = $matches[2]
    $host = $matches[3]
    $port = $matches[4]
    $database = $matches[5]
    
    Write-Host "Parsed Connection Details:" -ForegroundColor Cyan
    Write-Host "  Username: $username"
    Write-Host "  Host: $host"
    Write-Host "  Port: $port"
    Write-Host "  Database: $database"
    Write-Host ""
} else {
    Write-Host "❌ Invalid DATABASE_URL format!" -ForegroundColor Red
    Write-Host "Expected format: postgresql://username:password@host:port/database?schema=public"
    exit 1
}

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-Not $psqlPath) {
    Write-Host "⚠️  psql command not found in PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create database manually:" -ForegroundColor Yellow
    Write-Host "  1. Open pgAdmin or any PostgreSQL client" -ForegroundColor White
    Write-Host "  2. Connect to PostgreSQL server" -ForegroundColor White
    Write-Host "  3. Create database: $database" -ForegroundColor White
    Write-Host "  4. Owner: $username" -ForegroundColor White
    Write-Host ""
    Write-Host "Or run this SQL command:" -ForegroundColor Yellow
    Write-Host "  CREATE DATABASE $database WITH OWNER = $username;" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "Press Enter after creating database to continue..."
} else {
    Write-Host "✅ psql found, attempting to create database..." -ForegroundColor Green
    
    # Set password environment variable
    $env:PGPASSWORD = $password
    
    # Try to create database
    $createDbCmd = "CREATE DATABASE $database;"
    $result = psql -U $username -h $host -p $port -d postgres -c $createDbCmd 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database '$database' created successfully!" -ForegroundColor Green
    } else {
        if ($result -match "already exists") {
            Write-Host "ℹ️  Database '$database' already exists" -ForegroundColor Yellow
        } else {
            Write-Host "⚠️  Could not create database automatically" -ForegroundColor Yellow
            Write-Host "   Error: $result" -ForegroundColor Red
            Write-Host ""
            Write-Host "Please create database manually and press Enter to continue..."
            Read-Host
        }
    }
}

Write-Host ""
Write-Host "🔄 Running Prisma migrations..." -ForegroundColor Cyan
npx prisma migrate dev --name init

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
    npx prisma db seed
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Default Login Credentials:" -ForegroundColor Cyan
        Write-Host "  Admin:    admin@fastdrop.com / admin123" -ForegroundColor White
        Write-Host "  Supplier: supplier@fastdrop.com / supplier123" -ForegroundColor White
        Write-Host "  Vendor:   vendor@fastdrop.com / vendor123" -ForegroundColor White
        Write-Host "  Customer: customer@fastdrop.com / customer123" -ForegroundColor White
        Write-Host ""
        Write-Host "🚀 Start development server: npm run dev" -ForegroundColor Green
    } else {
        Write-Host "❌ Seeding failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Migrations failed!" -ForegroundColor Red
    exit 1
}
