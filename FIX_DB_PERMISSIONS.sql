-- Run this in DBeaver or PostgreSQL terminal as postgres user

-- Grant all privileges to dropfast user
GRANT ALL PRIVILEGES ON DATABASE dropfast TO dropfast;

-- Connect to the database
\c dropfast

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO dropfast;
GRANT CREATE ON SCHEMA public TO dropfast;

-- Grant table permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dropfast;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dropfast;

-- Grant default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dropfast;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dropfast;

-- Make dropfast the owner of the database
ALTER DATABASE dropfast OWNER TO dropfast;

-- Make dropfast the owner of the schema
ALTER SCHEMA public OWNER TO dropfast;

SELECT 'Permissions granted successfully!' as status;
