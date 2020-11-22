-- PizzaDB, Testat 2
-- Leonard Schütz & Adrian Locher

ALTER TABLE delivery_driver
	ADD CONSTRAINT minimum_wage 
		CHECK (salary = NULL OR salary >= 4000.00);

ALTER TABLE topping
	ADD CONSTRAINT price 
		CHECK (price >= 2.00 AND price <= 10.00);

ALTER TABLE order_item
	ADD CONSTRAINT no_negative_amounts 
		CHECK (amount > 0 AND amount <=10);