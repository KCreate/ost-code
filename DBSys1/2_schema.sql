-- PizzaDB, Testat 2
-- Leonard Schütz & Adrian Locher

CREATE TABLE person (
    id      SERIAL        PRIMARY KEY,
    name    VARCHAR(80)   NOT NULL,
    surname VARCHAR(80)   NOT NULL,
    address VARCHAR(80)   NOT NULL
);

CREATE TABLE customer (
    id        SERIAL  PRIMARY KEY,
    person_id INT     NOT NULL REFERENCES person DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE delivery_driver (
    id              SERIAL          PRIMARY KEY,
    person_id       INT             NOT NULL REFERENCES person DEFERRABLE INITIALLY DEFERRED,
    salary          DECIMAL(10,2)   NOT NULL,
    employment_date DATE            NOT NULL
);

CREATE TABLE "order" (
    id                  SERIAL      PRIMARY KEY,
    delivery_driver     INT         NOT NULL REFERENCES delivery_driver DEFERRABLE INITIALLY DEFERRED,
    customer            INT         NOT NULL REFERENCES customer DEFERRABLE INITIALLY DEFERRED,
    date                DATE        NOT NULL,
    delivery_address    VARCHAR(80) NOT NULL,
    payment_outstanding BOOLEAN     NOT NULL
);

CREATE TABLE pizza_type (
    id   SERIAL      PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE order_item (
    id         SERIAL PRIMARY KEY,
    "order"    INT    NOT NULL REFERENCES "order" DEFERRABLE INITIALLY DEFERRED,
    pizza_type INT    NOT NULL REFERENCES pizza_type DEFERRABLE INITIALLY DEFERRED,
    amount     INT    NOT NULL
);

CREATE TABLE topping (
    id         SERIAL       PRIMARY KEY,
    name       VARCHAR(30)  NOT NULL UNIQUE,
    price      DECIMAL(4,2) NOT NULL,
    vegetarian BOOLEAN      NOT NULL
);

CREATE TABLE ingredient (
    id         SERIAL  PRIMARY KEY,
    pizza_type INT     NOT NULL REFERENCES pizza_type DEFERRABLE INITIALLY DEFERRED,
    topping    INT     NOT NULL REFERENCES topping DEFERRABLE INITIALLY DEFERRED,
    extra      BOOLEAN NOT NULL
);
