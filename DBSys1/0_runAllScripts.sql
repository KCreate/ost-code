-- PizzaDB, Testat 2
-- Leonard Schütz & Adrian Locher

DROP DATABASE IF EXISTS PizzaDB;
DROP USER IF EXISTS pizzauser;

CREATE USER pizzauser WITH PASSWORD '1234' LOGIN CREATEDB CONNECTION LIMIT -1;
CREATE DATABASE pizzaDB WITH OWNER = pizzauser;

\c pizzadb;
\i '2_schema.sql';
\i '4_constraints.sql';
BEGIN;
\i '3_inserts.sql';
COMMIT;
\i '5_queries.sql'
