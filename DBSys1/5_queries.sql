-- PizzaDB, Testat 3
-- Leonard Schütz & Adrian Locher


/*	A1.1
*Situation:
*Wir wollen alle Pizzatypen, welche toppings haben ausgeben.
*/

SELECT DISTINCT pizza_type from ingredient;

/* A1.2
*Situation:
*Wir wollen wissen, welche Kunden eine Margherita zwischen dem 1.5. und 30.5. 2020 bestellt haben.
*/

SELECT pers.name, pers.surname, pers.address, "order".date
	FROM person as pers
		JOIN customer as cust on cust.person_id = pers.id
		JOIN "order" on "order".customer = cust.id
		JOIN order_item as ordit on ordit."order" = "order".id
		JOIN pizza_type as piztyp on ordit.pizza_type = piztyp.id
	WHERE piztyp.name = 'Margherita'
		AND "order".date > '2020-05-01'
		AND "order".date < '2020-05-30';
		
/* A1.3
*Situation:
*Wir wollen wissen, welche Pizzatypen nur vegetarische Toppings haben.
*Ist Unkorreliert!
*/

SELECT DISTINCT piztyp.name
	FROM pizza_type as piztyp
	WHERE piztyp.id NOT IN (
			SELECT ing.pizza_type FROM ingredient as ing
				JOIN topping as top ON top.id = ing.topping
			WHERE top.vegetarian = FALSE
	);
		
/* A1.4
*Situation:
*Wir wollen wissen, welche Topping überdurchschnittlich viel kosten.
*/

SELECT top.name, top.price 
	FROM topping as top
	WHERE top.price > ANY (
		SELECT AVG(price) 
			FROM topping
	);
	
/* A2.1
*Situation: 
*Wir wollen wissen, welche Mitarbeiter (delivery-drivers) auch Kunden sind.
*/

SELECT pers.name, pers.surname
	FROM person as pers
		JOIN customer as cust on cust.person_id = pers.id
	WHERE cust.person_id IN (
		SELECT person_id from delivery_driver
	);
	
WITH deldri as (
	select person_id from delivery_driver
)
SELECT pers.name, pers.surname
	FROM person as pers
	JOIN customer as cust on cust.person_id = pers.id
	JOIN deldri on deldri.person_id = pers.id;
	
/* A2.2
*Situation: 
*Wir wollen Wissen, wie oft, welche Pizza schon bestellt wurde.
*/

SELECT piztyp.name, sum (item.amount) as amount
	FROM pizza_type as piztyp
		JOIN order_item as item ON item.pizza_type = piztyp.id
	GROUP BY piztyp.name;
/*Situation:
*Wir wollen ein Ranking haben, von der meist- bis zur wenigstbestellten Pizza.
*/
SELECT piztyp.name, rank() OVER(ORDER BY sum(item.amount) desc)
	FROM pizza_type as piztyp
		JOIN order_item as item ON item.pizza_type = piztyp.id
	GROUP BY piztyp.name;

/* A3.1
*Situation:
* Wir wollen wissen, wieviel Geld unsere Kunden für Bestellungen bei uns ausgegeben haben.
* Dafür haben wir 3 Views erstellt, welche voneinander abhängen:
*/


DROP VIEW IF EXISTS view_customer_total_spending;
DROP VIEW IF EXISTS view_order_totals;
DROP VIEW IF EXISTS view_pizza_prices;
DROP VIEW IF EXISTS view_vegi_toppings;


CREATE VIEW view_pizza_prices AS
  WITH ingredient_prices AS (
    SELECT
      I.pizza_type,
      SUM((T.price * (CASE WHEN I.extra = true THEN 2 ELSE 1 END))) AS price
    FROM ingredient AS I
    JOIN topping AS T ON I.topping = T.id
    GROUP BY I.pizza_type
  )
  SELECT
    P.id,
    P.name,
    I.price
  FROM pizza_type AS P
  JOIN ingredient_prices AS I ON I.pizza_type = P.id;

/*
 * Total cost of individual orders
 */
CREATE VIEW view_order_totals AS
  WITH item_totals AS (
    SELECT
      OI.order AS order_id,
      (OI.amount * P.price) AS price
    FROM order_item AS OI
    JOIN View_PizzaPrices AS P ON P.id = OI.pizza_type
  )
  SELECT
    O.id,
    O.customer,
    SUM(IT.price) AS total
  FROM "order" AS O
  JOIN item_totals AS IT ON IT.order_id = O.id
  GROUP BY O.id;

/*
 * How much money each customer has spent in total
 */
CREATE VIEW view_customer_total_spending AS
  WITH
    customer_data AS (
      SELECT
        P.id,
        P.name,
        P.surname,
        P.address
      FROM person AS P
      JOIN customer AS C ON C.person_id = P.id
    ),
    customer_order_totals AS (
      SELECT
        T.customer AS id,
        SUM(T.total) AS total
      FROM view_order_totals AS T
      GROUP BY T.customer
    )
  SELECT
    C.id,
    C.name,
    C.surname,
    C.address,
    T.total
  FROM customer_data AS C
  JOIN customer_order_totals AS T ON T.id = C.id;

SELECT id, name, surname, address, total FROM view_customer_total_spending;

/* A3.2
*Situation:
*
*/

CREATE VIEW view_vegi_toppings AS
  SELECT id, name, price, vegetarian
  FROM topping
  WHERE vegetarian = true;

 
SELECT * FROM view_vegi_toppings;
UPDATE view_vegi_toppings SET price = 5 WHERE name = 'Ananas';
SELECT * FROM view_vegi_toppings;
