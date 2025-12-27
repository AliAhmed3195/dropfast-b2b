-- Run these commands in DBeaver SQL Editor
-- Make sure you're connected to PostgreSQL as a superuser (usually postgres user)

-- Step 1: Create the user (if it doesn't exist)
CREATE USER dropfast WITH PASSWORD 'admin123';

-- Step 2: Grant privileges on the database
GRANT ALL PRIVILEGES ON DATABASE dropfast TO dropfast;

-- Step 3: Connect to the dropfast database (do this in DBeaver by switching database context)
-- Then run this:
GRANT ALL ON SCHEMA public TO dropfast;

-- Step 4: Also grant privileges on all existing tables (run this in dropfast database)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dropfast;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dropfast;

