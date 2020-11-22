-- PizzaDB, Testat 2
-- Leonard Schütz & Adrian Locher

INSERT INTO person VALUES       
        (1, 'Adrian', 'Locher', 'Bahnhofstrasse 45 Bad Ragaz'),
        (2, 'Leonard', 'Schütz', 'Zürcherstrasse 23 Zürich'),
        (3, 'Franz', 'Müller', 'Sarganserstrasse 18 Unterterzen'),
        (4, 'Herbert', 'Meier', 'Churerstrasse 83 Valens'),
        (5, 'Josef', 'Sauerer', 'Thalstrasse 33 Sargans'),
        (6, 'Anna', 'Kohler', 'Pfäferserstrasse 11 Vättis'),
        (7, 'Niklas', 'Heeb', 'Pizolstrasse 33 Bad Ragaz');

INSERT INTO customer VALUES
        (1,1),
        (2,2),
        (3,3),
        (4,4),
        (5,6),
        (6,7);

INSERT INTO delivery_driver VALUES
        (1,1, 5200.00, '2005-06-12'),
        (2,2, 5600.50, '2008-03-05'),
        (3,5, 4200.50, '2015-04-02');

INSERT INTO "order" VALUES
        (1, 1, 3, '2020-01-01', 'Sarganserstrasse 32 Unterterzen', false),
        (2, 2, 4, '2020-03-10', 'Kirchgasse 32 Marbach', false),
        (3, 3, 6, '2020-09-03', 'Rheinstrasse 55 Quinten', false),
        (4, 1, 2, '2020-05-10', 'Ragazerstrasse 15 Landquart', false),
        (5, 2, 3, '2020-03-03', 'Rheinstrasse 55 Quinten', false),
        (6, 3, 4, '2020-04-01', 'Thalstrasse 33 Sargans', false),
        (7, 2, 1, '2020-02-12', 'Zürcherstrasse 23 Zürich', true);

INSERT INTO pizza_type VALUES 
        (1, 'Margherita'),
        (2, 'Funghi'),
        (3, 'Salami'),
        (4, 'Speciale'),
        (5, 'Marinara'),
        (6, 'Prosciutto'),
        (7, 'Diavolo');

INSERT INTO order_item VALUES
        (1, 1, 1, 2),
        (2, 1, 2, 2),
        (3, 2, 3, 3),
        (4, 2, 4, 4),
        (5, 3, 5, 2),
        (6, 3, 6, 6),
        (7, 4, 7, 4),
        (8, 4, 1, 1),
        (9, 5, 2, 8),
        (10, 5, 3, 1),
        (11, 5, 4, 1),
        (12, 6, 5, 1),
        (13, 6, 6, 1),
        (14, 7, 7, 7);

INSERT INTO topping VALUES
        (1, 'Teig', 4.00, true),
        (2, 'Tomatensauce', 4.00, true),
        (3, 'Pilze', 3.00, true),
        (4, 'Mozarella', 2.00, true),
        (5, 'Schinken', 4.00, false),
        (6, 'Basilico', 3.00, true),
        (7, 'Ananas', 2.00, true),
        (8, 'Salami', 4.00, false),
        (9, 'Oliven', 5.00, true);

INSERT INTO ingredient VALUES
        (1, 1, 1, false),
        (2, 1, 2, false),
        (3, 1, 4, false),
        (4, 2, 1, false),
        (5, 2, 2, false),
        (6, 2, 4, false),
        (7, 3, 1, false),
        (8, 3, 2, false),
        (9, 3, 4, false),
        (10, 4, 1, false),
        (11, 4, 2, false),
        (12, 4, 4, false),
        (13, 5, 1, false),
        (14, 5, 2, false),
        (15, 5, 4, false),
        (16, 6, 1, false),
        (17, 6, 2, false),
        (18, 6, 4, false),
        (19, 7, 1, false),
        (20, 7, 2, false),
        (21, 7, 4, false),
        (22, 2, 3, false),
        (23, 3, 8, false),
        (24, 4, 7, true),
        (26, 5, 6, false),
        (27, 6, 5, false),
        (28, 7, 9, true);
