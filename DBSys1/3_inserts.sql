-- PizzaDB, Testat 2
-- Leonard Schütz & Adrian Locher

INSERT INTO person (name, surname, address) VALUES
        ('Adrian',  'Locher',  'Bahnhofstrasse 45 Bad Ragaz'),
        ('Leonard', 'Schütz',  'Zürcherstrasse 23 Zürich'),
        ('Franz',   'Müller',  'Sarganserstrasse 18 Unterterzen'),
        ('Herbert', 'Meier',   'Churerstrasse 83 Valens'),
        ('Josef',   'Sauerer', 'Thalstrasse 33 Sargans'),
        ('Anna',    'Kohler',  'Pfäferserstrasse 11 Vättis'),
        ('Niklas',  'Heeb',    'Pizolstrasse 33 Bad Ragaz');

INSERT INTO customer (person_id) VALUES
        (1),
        (2),
        (3),
        (4),
        (6),
        (7);

INSERT INTO delivery_driver (person_id, salary, employment_date) VALUES
        (1, 5200.00, '2005-06-12'),
        (2, 5600.50, '2008-03-05'),
        (5, 4200.50, '2015-04-02');

INSERT INTO "order" (delivery_driver, customer, date, delivery_address, payment_outstanding) VALUES
        (1, 3, '2020-01-01', 'Sarganserstrasse 32 Unterterzen', false),
        (2, 4, '2020-03-10', 'Kirchgasse 32 Marbach', false),
        (3, 6, '2020-09-03', 'Rheinstrasse 55 Quinten', false),
        (1, 2, '2020-05-10', 'Ragazerstrasse 15 Landquart', false),
        (2, 3, '2020-03-03', 'Rheinstrasse 55 Quinten', false),
        (3, 4, '2020-04-01', 'Thalstrasse 33 Sargans', false),
        (2, 1, '2020-02-12', 'Zürcherstrasse 23 Zürich', true);

INSERT INTO pizza_type (name) VALUES
        ('Margherita'),
        ('Funghi'),
        ('Salami'),
        ('Speciale'),
        ('Marinara'),
        ('Prosciutto'),
        ('Diavolo');

INSERT INTO order_item ("order", pizza_type, amount) VALUES
        (1, 1, 2),
        (1, 2, 2),
        (2, 3, 3),
        (2, 4, 4),
        (3, 5, 2),
        (3, 6, 6),
        (4, 7, 4),
        (4, 1, 1),
        (5, 2, 8),
        (5, 3, 1),
        (5, 4, 1),
        (6, 5, 1),
        (6, 6, 1),
        (7, 7, 7);

INSERT INTO topping (name, price, vegetarian) VALUES
        ('Teig', 4.00, true),
        ('Tomatensauce', 4.00, true),
        ('Pilze', 3.00, true),
        ('Mozarella', 2.00, true),
        ('Schinken', 4.00, false),
        ('Basilico', 3.00, true),
        ('Ananas', 2.00, true),
        ('Salami', 4.00, false),
        ('Oliven', 5.00, true);

INSERT INTO ingredient (pizza_type, topping, extra) VALUES
        (1, 1, false),
        (1, 2, false),
        (1, 4, false),
        (2, 1, false),
        (2, 2, false),
        (2, 4, false),
        (3, 1, false),
        (3, 2, false),
        (3, 4, false),
        (4, 1, false),
        (4, 2, false),
        (4, 4, false),
        (5, 1, false),
        (5, 2, false),
        (5, 4, false),
        (6, 1, false),
        (6, 2, false),
        (6, 4, false),
        (7, 1, false),
        (7, 2, false),
        (7, 4, false),
        (2, 3, false),
        (3, 8, false),
        (4, 7, true),
        (5, 6, false),
        (6, 5, false),
        (7, 9, true);
