-- Run this command in psql as superuser (postgres) or in DBeaver with superuser connection
-- Connect to postgres database first

-- Grant CREATEDB permission to dropfast user
ALTER USER dropfast CREATEDB;

-- Verify permissions
\du dropfast

