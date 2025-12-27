# 🔐 PostgreSQL Password Reset Guide

## **Method 1: pg_hba.conf File (Windows)**

1. **Find `pg_hba.conf` file:**
   - Usually located in: `C:\Program Files\PostgreSQL\[version]\data\pg_hba.conf`
   - Or search in: `C:\Program Files\PostgreSQL\`

2. **Edit `pg_hba.conf`:**
   - Open as Administrator (Right-click → Run as administrator)
   - Find this line (around line 90-95):
     ```
     # IPv4 local connections:
     host    all             all             127.0.0.1/32            scram-sha-256
     ```
   - Change `scram-sha-256` to `trust`:
     ```
     host    all             all             127.0.0.1/32            trust
     ```

3. **Restart PostgreSQL Service:**
   - Press `Win + R` → Type `services.msc` → Enter
   - Find `postgresql-x64-[version]` service
   - Right-click → Restart

4. **Connect without password:**
   ```bash
   psql -U postgres
   ```

5. **Reset password:**
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_new_password';
   ```

6. **Revert pg_hba.conf:**
   - Change `trust` back to `scram-sha-256`
   - Restart PostgreSQL service again

---

## **Method 2: Windows Service (Easier)**

1. **Stop PostgreSQL Service:**
   - `Win + R` → `services.msc` → Enter
   - Find `postgresql-x64-[version]`
   - Right-click → Stop

2. **Run PostgreSQL in single-user mode:**
   ```bash
   cd "C:\Program Files\PostgreSQL\[version]\bin"
   postgres.exe --single -D "C:\Program Files\PostgreSQL\[version]\data" postgres
   ```

3. **In the PostgreSQL prompt, run:**
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_new_password';
   ```

4. **Exit and restart service**

---

## **Method 3: Use Existing DBeaver Connection**

Agar DBeaver me already koi connection hai:
- Check karein connection properties me user kaunsa hai
- Usi user se SQL Editor me commands run karein

