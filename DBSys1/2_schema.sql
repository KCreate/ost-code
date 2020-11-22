-- PizzaDB, Testat 2
-- Leonard Schütz & Adrian Locher

CREATE TABLE person(
	id				Int				PRIMARY KEY,
	name			VARCHAR(80)		NOT NULL,
	surname			VARCHAR(80) 	NOT NULL,
	address			VARCHAR(80)		NOT NULL
);

CREATE TABLE customer(
	id				Int				PRIMARY KEY,
	person_id		Int 			NOT NULL		REFERENCES person DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE delivery_driver(
	id				Int				PRIMARY KEY,
	person_id		Int 			NOT NULL		REFERENCES person DEFERRABLE INITIALLY DEFERRED,
	salary			DECIMAL(10,2)	NOT NULL,
	employment_date	Date 			NOT NULL
);

CREATE TABLE "order"(
	id				Int				PRIMARY KEY,
	delivery_driver	Int				NOT NULL		REFERENCES delivery_driver DEFERRABLE INITIALLY DEFERRED,
	customer		Int				NOT NULL		REFERENCES customer DEFERRABLE INITIALLY DEFERRED,
	date			DATE			NOT NULL,
delivery_address	VARCHAR(80)		NOT NULL,
payment_outstanding	Boolean			NOT NULL
);

CREATE TABLE pizza_type(
	id				Int				PRIMARY KEY,
	name			VARCHAR(30)		NOT NULL 		UNIQUE
);

CREATE TABLE order_item(
	id				Int				PRIMARY KEY,
	"order"			Int				NOT NULL		REFERENCES "order" DEFERRABLE INITIALLY DEFERRED,
	pizza_type		Int				NOT NULL		REFERENCES pizza_type DEFERRABLE INITIALLY DEFERRED,
	amount			Int				NOT NULL
);

CREATE TABLE topping(
	id				Int				PRIMARY KEY,
	name			VARCHAR(30)		NOT NULL		UNIQUE,
	price			DECIMAL(4,2)	NOT NULL,
	vegetarian		Boolean			NOT NULL
);

CREATE TABLE ingredient(
	id				Int				PRIMARY KEY,
	pizza_type		Int				NOT NULL		REFERENCES pizza_type DEFERRABLE INITIALLY DEFERRED,
	topping			Int				NOT NULL		REFERENCES topping DEFERRABLE INITIALLY DEFERRED,
	extra			Boolean			NOT NULL
);


