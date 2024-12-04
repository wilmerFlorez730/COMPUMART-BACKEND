-- CREATE USER ADMINUSER
CREATE USER adminuser WITH PASSWORD 'tobiytaison12';

-- CREATE DB TIENDA
CREATE DATABASE compumart_db WITH ENCODING 'UTF8' TEMPLATE template0 OWNER adminuser;

-- GRANT ROLES TO USER ADMINUSER
GRANT ALL PRIVILEGES ON DATABASE compumart_db TO adminuser;

-- DELETE AND CREATE AGAIN ALL TABLES
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
