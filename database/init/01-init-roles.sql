
\set ON_ERROR_STOP on

-- Read the passwords passed to the PostgreSQL container.
\getenv migrator_password NEXORA_MIGRATOR_PASSWORD
\getenv app_password NEXORA_APP_PASSWORD

-- Create separate database users safely.
SELECT format(
    'CREATE ROLE nexora_migrator LOGIN CREATEDB PASSWORD %L',
    :'migrator_password'
)\gexec

SELECT format(
    'CREATE ROLE nexora_app LOGIN PASSWORD %L',
    :'app_password'
)\gexec

-- Give the migrator ownership of the main database.
ALTER DATABASE nexora_erp OWNER TO nexora_migrator;

-- Create a separate database for automated tests.
CREATE DATABASE nexora_erp_test OWNER nexora_migrator;

-- Configure access to both databases.
REVOKE ALL ON DATABASE nexora_erp FROM PUBLIC;
REVOKE ALL ON DATABASE nexora_erp_test FROM PUBLIC;

GRANT CONNECT ON DATABASE nexora_erp TO nexora_app;
GRANT CONNECT ON DATABASE nexora_erp_test TO nexora_app;

-- Configure the main database schema.
\connect nexora_erp

REVOKE ALL ON SCHEMA public FROM PUBLIC;
ALTER SCHEMA public OWNER TO nexora_migrator;
GRANT USAGE ON SCHEMA public TO nexora_app;

-- New tables created by the migrator grant read and insert access
-- to the application. UPDATE will be granted selectively later.
ALTER DEFAULT PRIVILEGES
FOR ROLE nexora_migrator
IN SCHEMA public
GRANT SELECT, INSERT ON TABLES TO nexora_app;

ALTER DEFAULT PRIVILEGES
FOR ROLE nexora_migrator
IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO nexora_app;

-- Configure the test database schema.
\connect nexora_erp_test

REVOKE ALL ON SCHEMA public FROM PUBLIC;
ALTER SCHEMA public OWNER TO nexora_migrator;
GRANT USAGE, CREATE ON SCHEMA public TO nexora_migrator;
GRANT USAGE ON SCHEMA public TO nexora_app;

ALTER DEFAULT PRIVILEGES
FOR ROLE nexora_migrator
IN SCHEMA public
GRANT SELECT, INSERT ON TABLES TO nexora_app;

ALTER DEFAULT PRIVILEGES
FOR ROLE nexora_migrator
IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO nexora_app;
