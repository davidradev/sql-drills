export const SCHEMA = `
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  registered_at DATE NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  salary REAL NOT NULL,
  manager_id INTEGER,
  hired_at DATE NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  ordered_at DATE NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
`;

export const SEED = `
INSERT INTO customers VALUES
(1,'Alice Johnson','New York','USA','2022-01-15'),
(2,'Bob Smith','London','UK','2022-03-22'),
(3,'Carlos Rivera','Madrid','Spain','2022-05-10'),
(4,'Diana Lee','Seoul','South Korea','2022-06-30'),
(5,'Eva Müller','Berlin','Germany','2022-08-14'),
(6,'Frank Tanaka','Tokyo','Japan','2022-09-01'),
(7,'Grace Patel','Mumbai','India','2022-10-20'),
(8,'Hiro Nakamura','Tokyo','Japan','2022-11-05'),
(9,'Isabel Santos','São Paulo','Brazil','2023-01-12'),
(10,'James Brown','Chicago','USA','2023-02-28'),
(11,'Karen White','Sydney','Australia','2023-03-15'),
(12,'Luca Ferrari','Milan','Italy','2023-04-22'),
(13,'Maria Garcia','Mexico City','Mexico','2023-05-18'),
(14,'Nathan Kim','Seoul','South Korea','2023-06-07'),
(15,'Olivia Chen','Shanghai','China','2023-07-14'),
(16,'Pedro Alves','Lisbon','Portugal','2023-08-30'),
(17,'Quinn Davis','Toronto','Canada','2023-09-12'),
(18,'Rachel Green','New York','USA','2023-10-01'),
(19,'Samuel Osei','Accra','Ghana','2023-11-20'),
(20,'Tanya Ivanova','Moscow','Russia','2023-12-05'),
(21,'Uma Patel','London','UK','2024-01-10'),
(22,'Victor Huang','Beijing','China','2024-02-14'),
(23,'Wendy Clark','Los Angeles','USA','2024-03-22'),
(24,'Xavi Torres','Barcelona','Spain','2024-04-05'),
(25,'Yuki Sato','Tokyo','Japan','2024-05-18');

INSERT INTO products VALUES
(1,'Laptop Pro 15','Electronics',1299.99,45),
(2,'Wireless Mouse','Electronics',29.99,200),
(3,'USB-C Hub','Electronics',49.99,150),
(4,'Mechanical Keyboard','Electronics',89.99,80),
(5,'Monitor 27"','Electronics',349.99,30),
(6,'Standing Desk','Furniture',499.99,20),
(7,'Ergonomic Chair','Furniture',399.99,25),
(8,'Desk Lamp','Furniture',59.99,100),
(9,'Notebook A5','Stationery',9.99,500),
(10,'Ballpoint Pens (12pk)','Stationery',7.99,800),
(11,'Sticky Notes','Stationery',4.99,1000),
(12,'Python Programming Book','Books',44.99,60),
(13,'SQL for Data Engineers','Books',39.99,75),
(14,'Clean Code','Books',34.99,55),
(15,'Headphones Pro','Electronics',199.99,40),
(16,'Webcam HD','Electronics',79.99,90),
(17,'Phone Stand','Electronics',19.99,300),
(18,'Cable Organizer','Accessories',14.99,250),
(19,'Water Bottle','Accessories',24.99,180),
(20,'Backpack','Accessories',79.99,60);

INSERT INTO employees VALUES
(1,'Sarah Connor','Engineering',95000,NULL,'2019-03-10'),
(2,'John Doe','Engineering',82000,1,'2020-06-15'),
(3,'Jane Smith','Engineering',78000,1,'2020-09-01'),
(4,'Mike Johnson','Data',88000,NULL,'2019-11-20'),
(5,'Emily Davis','Data',75000,4,'2021-02-14'),
(6,'Chris Wilson','Data',72000,4,'2021-05-30'),
(7,'Amanda Brown','Marketing',68000,NULL,'2020-01-08'),
(8,'David Lee','Marketing',61000,7,'2021-08-22'),
(9,'Lisa Taylor','Marketing',63000,7,'2022-03-15'),
(10,'Robert Moore','Sales',70000,NULL,'2019-07-12'),
(11,'Patricia Anderson','Sales',58000,10,'2021-10-05'),
(12,'James Thomas','Sales',62000,10,'2022-01-18'),
(13,'Barbara Jackson','HR',65000,NULL,'2020-04-25'),
(14,'Charles Harris','HR',55000,13,'2022-07-11'),
(15,'Susan Martin','Engineering',91000,1,'2021-12-01'),
(16,'Joseph Thompson','Data',80000,4,'2022-09-14'),
(17,'Jessica Garcia','Marketing',66000,7,'2023-02-28'),
(18,'Thomas Martinez','Sales',59000,10,'2023-05-10'),
(19,'Margaret Robinson','Engineering',76000,1,'2023-08-20'),
(20,'Christopher Clark','HR',57000,13,'2024-01-15');

INSERT INTO orders VALUES
(1,1,'delivered','2024-01-05'),
(2,1,'delivered','2024-03-12'),
(3,2,'delivered','2024-01-20'),
(4,3,'shipped','2024-02-08'),
(5,4,'delivered','2024-02-15'),
(6,5,'delivered','2024-03-01'),
(7,6,'cancelled','2024-03-10'),
(8,7,'delivered','2024-03-22'),
(9,8,'shipped','2024-04-01'),
(10,9,'delivered','2024-04-14'),
(11,10,'delivered','2024-04-20'),
(12,11,'pending','2024-05-01'),
(13,12,'delivered','2024-05-08'),
(14,13,'delivered','2024-05-15'),
(15,14,'shipped','2024-05-22'),
(16,15,'delivered','2024-06-01'),
(17,16,'delivered','2024-06-10'),
(18,17,'cancelled','2024-06-15'),
(19,18,'delivered','2024-06-20'),
(20,19,'pending','2024-07-01'),
(21,20,'delivered','2024-07-05'),
(22,21,'delivered','2024-07-12'),
(23,22,'shipped','2024-07-20'),
(24,23,'delivered','2024-08-01'),
(25,24,'delivered','2024-08-10'),
(26,25,'delivered','2024-08-15'),
(27,1,'pending','2024-08-20'),
(28,2,'delivered','2024-08-25'),
(29,3,'delivered','2024-09-01'),
(30,4,'shipped','2024-09-10');

INSERT INTO order_items VALUES
(1,1,1,1,1299.99),
(2,1,2,2,29.99),
(3,2,5,1,349.99),
(4,2,4,1,89.99),
(5,3,15,1,199.99),
(6,3,16,1,79.99),
(7,4,12,2,44.99),
(8,4,13,1,39.99),
(9,5,6,1,499.99),
(10,5,8,2,59.99),
(11,6,7,1,399.99),
(12,7,1,1,1299.99),
(13,8,3,3,49.99),
(14,8,2,1,29.99),
(15,9,4,2,89.99),
(16,10,9,5,9.99),
(17,10,10,3,7.99),
(18,11,11,10,4.99),
(19,12,19,2,24.99),
(20,13,20,1,79.99),
(21,14,5,2,349.99),
(22,15,1,1,1299.99),
(23,15,3,2,49.99),
(24,16,15,1,199.99),
(25,17,12,1,44.99),
(26,17,14,2,34.99),
(27,18,7,1,399.99),
(28,19,2,5,29.99),
(29,20,9,3,9.99),
(30,21,4,1,89.99),
(31,22,16,2,79.99),
(32,23,1,1,1299.99),
(33,24,6,1,499.99),
(34,24,8,1,59.99),
(35,25,13,3,39.99),
(36,26,15,2,199.99),
(37,27,2,1,29.99),
(38,28,5,1,349.99),
(39,29,11,20,4.99),
(40,30,1,1,1299.99);
`;
