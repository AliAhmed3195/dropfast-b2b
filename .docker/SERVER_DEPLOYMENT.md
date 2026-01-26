# 🚀 Server-Side Deployment Guide

## 📥 Pull and Run Image

### Step 1: Pull Image
```bash
docker pull hashmicodebase/dropsified:stag
```

### Step 2: Run Container

**Basic Run:**
```bash
docker run -d \
  --name dropsified \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/database" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  -e NEXTAUTH_URL="http://your-domain.com" \
  hashmicodebase/dropsified:stag
```

**With Environment File:**
```bash
docker run -d \
  --name dropsified \
  -p 3000:3000 \
  --env-file .env.production \
  hashmicodebase/dropsified:stag
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Container Exits Immediately

**Check logs:**
```bash
docker logs dropsified
```

**Common causes:**
- Missing environment variables
- Database connection failed
- Port already in use

**Solution:**
```bash
# Check if port is in use
netstat -tulpn | grep 3000

# Run with logs to see error
docker run --rm hashmicodebase/dropsified:stag
```

---

### Issue 2: Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
1. Verify DATABASE_URL format:
   ```
   postgresql://username:password@host:5432/database_name
   ```

2. Check database is accessible:
   ```bash
   # From server, test connection
   psql -h database-host -U username -d database_name
   ```

3. If using Docker network:
   ```bash
   # Use service name instead of localhost
   DATABASE_URL="postgresql://user:pass@postgres:5432/db"
   ```

---

### Issue 3: Prisma Client Not Found

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
Prisma Client should be included in standalone output. If error persists:

```bash
# Check if Prisma schema exists in container
docker exec dropsified ls -la /app/prisma

# Regenerate if needed (shouldn't be required)
docker exec dropsified npx prisma generate
```

---

### Issue 4: Permission Denied

**Error:** `EACCES: permission denied`

**Solution:**
Container runs as non-root user. If you need to write files:

```bash
# Check container user
docker exec dropsified whoami

# If needed, run with different user (not recommended)
docker run --user root ...
```

---

### Issue 5: Port Already in Use

**Error:** `bind: address already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tulpn | grep 3000

# Kill process or use different port
docker run -p 3001:3000 hashmicodebase/dropsified:stag
```

---

### Issue 6: Environment Variables Missing

**Error:** Application crashes on startup

**Required Variables:**
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://your-domain.com
```

**Check variables:**
```bash
docker exec dropsified env | grep -E "DATABASE|NEXTAUTH"
```

---

## 🐳 Docker Compose Example

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  dropsified:
    image: hashmicodebase/dropsified:stag
    container_name: dropsified
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode < 500 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

**Run with compose:**
```bash
docker-compose up -d
```

---

## 🔍 Debugging Commands

### Check Container Status
```bash
docker ps -a | grep dropsified
```

### View Logs
```bash
# All logs
docker logs dropsified

# Follow logs
docker logs -f dropsified

# Last 100 lines
docker logs --tail 100 dropsified
```

### Enter Container
```bash
docker exec -it dropsified sh
```

### Check Environment
```bash
docker exec dropsified env
```

### Check File Structure
```bash
docker exec dropsified ls -la /app
docker exec dropsified ls -la /app/.next
```

### Test Health Check
```bash
docker exec dropsified node -e "require('http').get('http://localhost:3000/', (r) => console.log(r.statusCode))"
```

---

## 📋 Pre-Deployment Checklist

- [ ] Image pulled successfully
- [ ] Database is accessible
- [ ] Environment variables set
- [ ] Port 3000 available
- [ ] Firewall rules configured
- [ ] Domain/DNS configured (if using)

---

## 🚨 Quick Troubleshooting

**Container won't start:**
```bash
docker run --rm hashmicodebase/dropsified:stag
# Check output for errors
```

**Container starts but crashes:**
```bash
docker logs dropsified
# Look for error messages
```

**Can't connect to app:**
```bash
# Check if container is running
docker ps

# Check if port is exposed
docker port dropsified

# Test from inside container
docker exec dropsified wget -O- http://localhost:3000
```

---

## 📞 Need Help?

Share these details:
1. Error message (full output)
2. `docker logs dropsified` output
3. `docker ps -a` output
4. Environment variables (without sensitive data)
5. Server OS and Docker version

---

**Happy Deploying! 🚀**
