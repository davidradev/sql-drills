export const TOPICS = [
  {
    id: 'select-basics',
    title: 'SELECT Basics',
    description: 'SELECT, FROM, LIMIT, column aliases',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'SELECT retrieves data from a table. Every query starts with SELECT and FROM. Beyond that, you can transform, rename, deduplicate, and compute values on the fly.',
      concepts: [
        {
          title: 'SELECT all columns or specific columns',
          body: 'SELECT * returns every column in the table. Listing column names returns only those columns — more explicit and faster for large tables.',
          code: `SELECT * FROM employees
SELECT name, department, salary FROM employees`,
        },
        {
          title: 'LIMIT',
          body: 'LIMIT N restricts the output to at most N rows. Always useful when exploring a new table.',
          code: `SELECT * FROM employees LIMIT 5
SELECT id, name, department FROM employees LIMIT 3`,
        },
        {
          title: 'Aliases (AS)',
          body: 'AS renames a column in the output. The alias only affects the result set — it cannot be used in WHERE.',
          code: `SELECT name AS customer_name, salary AS annual_pay
FROM employees`,
        },
        {
          title: 'DISTINCT',
          body: 'DISTINCT removes duplicate rows. When you select multiple columns, DISTINCT applies to the whole row combination.',
          code: `SELECT DISTINCT status FROM orders
SELECT DISTINCT department FROM employees`,
        },
        {
          title: 'Arithmetic and ROUND',
          body: 'You can compute expressions directly in SELECT. ROUND(value, decimals) rounds a number to the given precision.',
          code: `SELECT id, quantity, unit_price,
       ROUND(quantity * unit_price, 2) AS line_total
FROM order_items`,
        },
        {
          title: 'String functions: LENGTH, UPPER, LOWER',
          body: 'LENGTH(str) returns the character count. UPPER() and LOWER() change the case of a text column. These work on any text value.',
          code: `SELECT department,
       LENGTH(department) AS dept_length,
       UPPER(department)  AS dept_up
FROM employees
LIMIT 5`,
        },
        {
          title: 'COALESCE — replace NULL with a default',
          body: 'COALESCE(value, fallback) returns the first argument that is not NULL. Use it when a column might be NULL and you need a safe default instead.',
          code: `SELECT id, name, department,
       COALESCE(manager_id, -1) AS reports_to
FROM employees
ORDER BY department`,
          note: 'NULL is not the same as 0 or empty string. Comparing NULL with = always returns false — use IS NULL to check for it.',
        },
      ],
    },
    exercises: [
      {
        id: 'sb-01',
        prompt: 'Select all columns from the customers table.',
        solution: 'SELECT * FROM customers',
        hint: 'Use * to select all columns.',
      },
      {
        id: 'sb-02',
        prompt: 'Select only the name and city columns from customers.',
        solution: 'SELECT name, city FROM customers',
        hint: 'List the column names separated by commas after SELECT.',
      },
      {
        id: 'sb-03',
        prompt: 'Select the first 5 rows from the products table.',
        solution: 'SELECT * FROM products LIMIT 5',
        hint: 'Use LIMIT to restrict the number of rows returned.',
      },
      {
        id: 'sb-04',
        prompt: 'Select name and price from products. Show only the first 10 rows.',
        solution: 'SELECT name, price FROM products LIMIT 10',
        hint: 'Combine column selection with LIMIT.',
      },
      {
        id: 'sb-05',
        prompt: 'Select the name column from employees. Alias it as "employee_name".',
        solution: 'SELECT name AS employee_name FROM employees',
        hint: 'Use AS to create an alias for a column.',
      },
      {
        id: 'sb-06',
        prompt: 'Select id, name, and salary from employees. Alias salary as "annual_salary".',
        solution: 'SELECT id, name, salary AS annual_salary FROM employees',
        hint: 'You can alias any column with AS.',
      },
      {
        id: 'sb-07',
        prompt: 'Select all columns from orders. Show only the first 3 rows.',
        solution: 'SELECT * FROM orders LIMIT 3',
        hint: 'Use LIMIT 3 at the end of the query.',
      },
      {
        id: 'sb-08',
        prompt: 'Select order_id, product_id, and quantity from order_items.',
        solution: 'SELECT order_id, product_id, quantity FROM order_items',
        hint: 'Check the table name: order_items.',
      },
      {
        id: 'sb-09',
        prompt: 'Select name and price from products. Alias price as "cost". Show the first 5 rows.',
        solution: 'SELECT name, price AS cost FROM products LIMIT 5',
        hint: 'Combine aliases and LIMIT together.',
      },
      {
        id: 'sb-10',
        prompt: 'Select name, department, and salary from employees. Alias department as "dept" and salary as "pay".',
        solution: 'SELECT name, department AS dept, salary AS pay FROM employees',
        hint: 'You can alias multiple columns in the same query.',
      },
      {
        id: 'sb-11',
        prompt: 'Select all distinct countries from the customers table.',
        solution: 'SELECT DISTINCT country FROM customers',
        hint: 'DISTINCT removes duplicate values from the result.',
      },
      {
        id: 'sb-12',
        prompt: 'Select product name and price. Add a column called price_with_vat that is price multiplied by 1.21, rounded to 2 decimals.',
        solution: 'SELECT name, price, ROUND(price * 1.21, 2) AS price_with_vat FROM products',
        hint: 'You can do arithmetic directly in SELECT. Wrap with ROUND(value, 2).',
      },
      {
        id: 'sb-13',
        prompt: 'Select customer name and the length of their name from the customers table. Label the length column name_length.',
        solution: 'SELECT name, LENGTH(name) AS name_length FROM customers',
        hint: 'LENGTH() returns the number of characters in a string.',
      },
      {
        id: 'sb-14',
        prompt: 'Select employee name and manager_id. Replace NULL manager_id with 0. Label the column manager_id.',
        solution: 'SELECT name, COALESCE(manager_id, 0) AS manager_id FROM employees',
        hint: 'COALESCE(value, fallback) returns the first non-null argument.',
      },
      {
        id: 'sb-15',
        prompt: 'Select name in uppercase and city in lowercase from customers. Label columns upper_name and lower_city.',
        solution: 'SELECT UPPER(name) AS upper_name, LOWER(city) AS lower_city FROM customers',
        hint: 'UPPER() and LOWER() convert text case.',
      },
    ],
  },
  {
    id: 'where',
    title: 'WHERE Clause',
    description: 'Filter rows with conditions: =, !=, >, <, BETWEEN, IN, LIKE, IS NULL',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'WHERE filters rows before they reach SELECT. Only rows where the condition is true appear in the result.',
      concepts: [
        {
          title: 'Comparison operators',
          body: 'Use =, != (or <>), <, >, <=, >= to compare values. String comparisons are case-sensitive in SQLite.',
          code: `SELECT name, stock FROM products WHERE stock < 20
SELECT name, hired_at FROM employees WHERE hired_at > '2023-01-01'
SELECT * FROM orders WHERE customer_id != 3`,
        },
        {
          title: 'AND and OR',
          body: 'AND requires both conditions to be true. OR requires either. AND has higher precedence than OR — use parentheses when mixing them.',
          code: `SELECT * FROM employees
WHERE department = 'Data' AND salary > 80000

SELECT * FROM orders
WHERE ordered_at > '2024-01-01' OR status = 'cancelled'`,
        },
        {
          title: 'IN and NOT IN',
          body: 'IN checks whether a value matches any item in a list. NOT IN excludes all listed values. Both are shorthand for multiple OR / AND conditions.',
          code: `SELECT name, country FROM customers
WHERE country IN ('UK', 'Germany', 'France')

SELECT id, status FROM orders
WHERE status NOT IN ('delivered', 'cancelled')`,
        },
        {
          title: 'BETWEEN',
          body: 'BETWEEN a AND b is inclusive on both ends. NOT BETWEEN excludes the entire range including the boundaries.',
          code: `SELECT name, price FROM products WHERE price BETWEEN 50 AND 300
SELECT * FROM employees WHERE hired_at BETWEEN '2022-01-01' AND '2023-12-31'`,
        },
        {
          title: 'LIKE — pattern matching',
          body: '% matches any sequence of characters (including none). _ matches exactly one character. LIKE is case-insensitive in SQLite by default.',
          code: `SELECT * FROM products WHERE name LIKE '%Pro%'
SELECT * FROM employees WHERE name LIKE '%son'
SELECT * FROM orders WHERE ordered_at LIKE '2024-06%'`,
        },
        {
          title: 'IS NULL and IS NOT NULL',
          body: 'NULL means unknown — it cannot be compared with =. Always use IS NULL or IS NOT NULL to check for missing values.',
          code: `SELECT name, department
FROM employees
WHERE manager_id IS NULL

SELECT name, department, manager_id
FROM employees
WHERE manager_id IS NOT NULL
ORDER BY department`,
          note: 'WHERE col = NULL will always return 0 rows even if NULLs exist. This is a common beginner mistake.',
        },
      ],
    },
    exercises: [
      {
        id: 'wh-01',
        prompt: 'Select all customers from the USA.',
        solution: "SELECT * FROM customers WHERE country = 'USA'",
        hint: "Use WHERE country = 'USA'.",
      },
      {
        id: 'wh-02',
        prompt: 'Select all products with a price greater than 100.',
        solution: 'SELECT * FROM products WHERE price > 100',
        hint: 'Use the > operator.',
      },
      {
        id: 'wh-03',
        prompt: "Select all orders with status 'delivered'.",
        solution: "SELECT * FROM orders WHERE status = 'delivered'",
        hint: "String values go in single quotes.",
      },
      {
        id: 'wh-04',
        prompt: 'Select employees with a salary between 70000 and 90000 (inclusive).',
        solution: 'SELECT * FROM employees WHERE salary BETWEEN 70000 AND 90000',
        hint: 'BETWEEN is inclusive on both ends.',
      },
      {
        id: 'wh-05',
        prompt: "Select all products in the 'Electronics' or 'Books' category.",
        solution: "SELECT * FROM products WHERE category IN ('Electronics', 'Books')",
        hint: 'Use IN with a list of values in parentheses.',
      },
      {
        id: 'wh-06',
        prompt: "Select all customers whose name starts with 'A'.",
        solution: "SELECT * FROM customers WHERE name LIKE 'A%'",
        hint: "LIKE with % matches any sequence of characters.",
      },
      {
        id: 'wh-07',
        prompt: 'Select all employees who do NOT have a manager (manager_id is null).',
        solution: 'SELECT * FROM employees WHERE manager_id IS NULL',
        hint: 'Use IS NULL for null checks, not = NULL.',
      },
      {
        id: 'wh-08',
        prompt: "Select all customers NOT from Japan.",
        solution: "SELECT * FROM customers WHERE country != 'Japan'",
        hint: "Use != or <> for not equal.",
      },
      {
        id: 'wh-09',
        prompt: 'Select products with stock less than 50 and price greater than 50.',
        solution: 'SELECT * FROM products WHERE stock < 50 AND price > 50',
        hint: 'Combine two conditions with AND.',
      },
      {
        id: 'wh-10',
        prompt: "Select all orders placed in 2024 that are either 'pending' or 'shipped'.",
        solution: "SELECT * FROM orders WHERE ordered_at LIKE '2024%' AND status IN ('pending', 'shipped')",
        hint: "Use LIKE '2024%' for the year filter and IN for multiple statuses.",
      },
      {
        id: 'wh-11',
        prompt: 'Select all employees who are in the Engineering department AND have a manager (manager_id is not null).',
        solution: "SELECT * FROM employees WHERE department = 'Engineering' AND manager_id IS NOT NULL",
        hint: 'Combine a string equality check with IS NOT NULL.',
      },
      {
        id: 'wh-12',
        prompt: "Select all customers whose city contains the letter 'o' (lowercase).",
        solution: "SELECT * FROM customers WHERE city LIKE '%o%'",
        hint: "% matches any number of characters on either side.",
      },
      {
        id: 'wh-13',
        prompt: "Select all orders placed before 2024-04-01 that were delivered.",
        solution: "SELECT * FROM orders WHERE ordered_at < '2024-04-01' AND status = 'delivered'",
        hint: "Date strings in ISO format (YYYY-MM-DD) compare correctly with < and >.",
      },
      {
        id: 'wh-14',
        prompt: 'Select all products that are either out of stock (stock = 0) or cost more than 400.',
        solution: 'SELECT * FROM products WHERE stock = 0 OR price > 400',
        hint: 'Use OR to match either condition.',
      },
      {
        id: 'wh-15',
        prompt: 'Select all employees whose salary is NOT between 65000 and 85000.',
        solution: 'SELECT * FROM employees WHERE salary NOT BETWEEN 65000 AND 85000',
        hint: 'NOT BETWEEN excludes the range, including the boundary values.',
      },
    ],
  },
  {
    id: 'order-by',
    title: 'ORDER BY',
    description: 'Sort results ascending and descending',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'ORDER BY sorts the result. Without it, row order is undefined and can change between queries.',
      concepts: [
        {
          title: 'ASC and DESC',
          body: 'ASC (ascending) is the default — smallest first, A-Z for text, oldest first for dates. DESC reverses this to largest first.',
          code: `SELECT name, hired_at FROM employees ORDER BY hired_at ASC
SELECT name, hired_at FROM employees ORDER BY hired_at DESC`,
        },
        {
          title: 'Multiple sort columns',
          body: 'Separate columns with commas. The second column only breaks ties left by the first.',
          code: `SELECT id, order_id, quantity, unit_price FROM order_items
ORDER BY order_id ASC, quantity DESC`,
        },
        {
          title: 'Combining WHERE and ORDER BY',
          body: 'WHERE filters rows before ORDER BY sorts them. The column you sort by does not need to appear in SELECT.',
          code: `SELECT name, salary FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC`,
        },
        {
          title: 'Top-N: ORDER BY + LIMIT',
          body: 'Pairing ORDER BY with LIMIT is the standard way to retrieve the highest or lowest N rows.',
          code: `SELECT id, ordered_at FROM orders ORDER BY ordered_at DESC LIMIT 5
SELECT name, registered_at FROM customers ORDER BY registered_at ASC LIMIT 3`,
        },
      ],
    },
    exercises: [
      {
        id: 'ob-01',
        prompt: 'Select all products ordered by price from cheapest to most expensive.',
        solution: 'SELECT * FROM products ORDER BY price ASC',
        hint: 'ASC is ascending (low to high). It is also the default.',
      },
      {
        id: 'ob-02',
        prompt: 'Select all products ordered by price from most expensive to cheapest.',
        solution: 'SELECT * FROM products ORDER BY price DESC',
        hint: 'DESC is descending (high to low).',
      },
      {
        id: 'ob-03',
        prompt: 'Select name and salary from employees, ordered by salary descending.',
        solution: 'SELECT name, salary FROM employees ORDER BY salary DESC',
        hint: 'You can order by a column even if you SELECT only specific columns.',
      },
      {
        id: 'ob-04',
        prompt: 'Select all customers ordered alphabetically by name.',
        solution: 'SELECT * FROM customers ORDER BY name ASC',
        hint: 'ORDER BY works on text columns too — alphabetical order.',
      },
      {
        id: 'ob-05',
        prompt: 'Select all employees ordered by department (A-Z), then by salary descending within each department.',
        solution: 'SELECT * FROM employees ORDER BY department ASC, salary DESC',
        hint: 'Separate multiple sort criteria with commas.',
      },
      {
        id: 'ob-06',
        prompt: 'Select the 3 most expensive products (name and price only).',
        solution: 'SELECT name, price FROM products ORDER BY price DESC LIMIT 3',
        hint: 'Combine ORDER BY DESC with LIMIT.',
      },
      {
        id: 'ob-07',
        prompt: 'Select all orders ordered by ordered_at from most recent to oldest.',
        solution: 'SELECT * FROM orders ORDER BY ordered_at DESC',
        hint: 'Dates sort lexicographically in ISO format, so ORDER BY works correctly.',
      },
      {
        id: 'ob-08',
        prompt: 'Select name, country, and city from customers. Order by country A-Z, then city A-Z.',
        solution: 'SELECT name, country, city FROM customers ORDER BY country ASC, city ASC',
        hint: 'Multi-column sort: first by country, then by city within each country.',
      },
      {
        id: 'ob-09',
        prompt: 'Select the 5 employees with the lowest salary (show name and salary).',
        solution: 'SELECT name, salary FROM employees ORDER BY salary ASC LIMIT 5',
        hint: 'ORDER BY ASC + LIMIT gives you the bottom N.',
      },
      {
        id: 'ob-10',
        prompt: 'Select all products in the Electronics category, ordered by stock ascending.',
        solution: "SELECT * FROM products WHERE category = 'Electronics' ORDER BY stock ASC",
        hint: 'You can combine WHERE and ORDER BY in the same query.',
      },
      {
        id: 'ob-11',
        prompt: 'Select name, category, and price from products. Order by category A-Z, then by name A-Z within each category.',
        solution: 'SELECT name, category, price FROM products ORDER BY category ASC, name ASC',
        hint: 'Two-column sort: first category, then name within each category.',
      },
      {
        id: 'ob-12',
        prompt: 'Select name and hired_at from employees. Show the 3 most recently hired employees.',
        solution: 'SELECT name, hired_at FROM employees ORDER BY hired_at DESC LIMIT 3',
        hint: 'Most recent = highest date = DESC.',
      },
      {
        id: 'ob-13',
        prompt: 'Select all columns from order_items. Order by quantity descending, then by unit_price descending.',
        solution: 'SELECT * FROM order_items ORDER BY quantity DESC, unit_price DESC',
        hint: 'Both columns use DESC in this case.',
      },
      {
        id: 'ob-14',
        prompt: 'Select name, country, and registered_at from customers. Order by country A-Z, then by most recently registered within each country.',
        solution: 'SELECT name, country, registered_at FROM customers ORDER BY country ASC, registered_at DESC',
        hint: 'Mix ASC and DESC across the two sort columns.',
      },
      {
        id: 'ob-15',
        prompt: 'Show the 3 products with the most stock. Select name and stock only.',
        solution: 'SELECT name, stock FROM products ORDER BY stock DESC LIMIT 3',
        hint: 'Most stock = highest value = DESC, then LIMIT 3.',
      },
    ],
  },
  {
    id: 'aggregations',
    title: 'Aggregations',
    description: 'COUNT, SUM, AVG, MIN, MAX',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'Aggregate functions collapse multiple rows into a single value. They operate on all rows by default, or per group when combined with GROUP BY.',
      concepts: [
        {
          title: 'COUNT(*) vs COUNT(column)',
          body: 'COUNT(*) counts all rows including NULLs. COUNT(column) counts only rows where that column is not NULL.',
          code: `SELECT COUNT(*) AS total_rows FROM orders
SELECT COUNT(manager_id) AS employees_with_manager FROM employees`,
          note: 'COUNT(*) and COUNT(id) usually give the same result because id is never NULL. The difference shows up for nullable columns.',
        },
        {
          title: 'SUM and AVG',
          body: 'SUM adds up all values in a column. AVG divides the sum by the count of non-NULL values. Both ignore NULLs.',
          code: `SELECT SUM(salary) AS total_payroll FROM employees
SELECT ROUND(AVG(price), 2) AS avg_price FROM products`,
        },
        {
          title: 'MIN and MAX',
          body: 'MIN and MAX work on numbers, text (alphabetical), and dates (chronological). Both ignore NULLs.',
          code: `SELECT MIN(registered_at) AS first_signup, MAX(registered_at) AS last_signup
FROM customers`,
        },
        {
          title: 'DISTINCT inside aggregates',
          body: 'Adding DISTINCT inside an aggregate counts or sums only unique values. Useful for counting distinct customers, categories, etc.',
          code: `SELECT COUNT(DISTINCT department) AS num_departments FROM employees
SELECT COUNT(DISTINCT product_id) AS distinct_products FROM order_items`,
        },
        {
          title: 'Expressions inside aggregates',
          body: 'You can compute a value inside the aggregate rather than just referencing a column.',
          code: `SELECT MAX(quantity * unit_price) AS largest_line_item,
       MIN(quantity * unit_price) AS smallest_line_item
FROM order_items`,
        },
      ],
    },
    exercises: [
      {
        id: 'ag-01',
        prompt: 'Count the total number of customers.',
        solution: 'SELECT COUNT(*) FROM customers',
        hint: 'COUNT(*) counts all rows.',
      },
      {
        id: 'ag-02',
        prompt: 'Find the total revenue across all order items (quantity * unit_price).',
        solution: 'SELECT SUM(quantity * unit_price) FROM order_items',
        hint: 'You can do arithmetic inside SUM().',
      },
      {
        id: 'ag-03',
        prompt: 'Find the average salary of all employees.',
        solution: 'SELECT AVG(salary) FROM employees',
        hint: 'AVG() computes the mean.',
      },
      {
        id: 'ag-04',
        prompt: 'Find the most expensive product price.',
        solution: 'SELECT MAX(price) FROM products',
        hint: 'MAX() returns the highest value.',
      },
      {
        id: 'ag-05',
        prompt: 'Find the cheapest product price.',
        solution: 'SELECT MIN(price) FROM products',
        hint: 'MIN() returns the lowest value.',
      },
      {
        id: 'ag-06',
        prompt: 'Count how many orders have status "delivered".',
        solution: "SELECT COUNT(*) FROM orders WHERE status = 'delivered'",
        hint: 'Combine COUNT with WHERE to count filtered rows.',
      },
      {
        id: 'ag-07',
        prompt: 'Find the total stock across all products.',
        solution: 'SELECT SUM(stock) FROM products',
        hint: 'SUM() adds up all values in a column.',
      },
      {
        id: 'ag-08',
        prompt: 'Find the highest and lowest salary in a single query. Label them max_salary and min_salary.',
        solution: 'SELECT MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM employees',
        hint: 'You can use multiple aggregate functions in one SELECT.',
      },
      {
        id: 'ag-09',
        prompt: 'Count the number of distinct countries in the customers table.',
        solution: 'SELECT COUNT(DISTINCT country) FROM customers',
        hint: 'Use COUNT(DISTINCT column) to count unique values.',
      },
      {
        id: 'ag-10',
        prompt: 'Find the average unit_price of items in order_items. Round it to 2 decimal places. Label it avg_price.',
        solution: 'SELECT ROUND(AVG(unit_price), 2) AS avg_price FROM order_items',
        hint: 'Wrap AVG() inside ROUND(value, decimals).',
      },
      {
        id: 'ag-11',
        prompt: 'Count the number of distinct cities in the customers table.',
        solution: 'SELECT COUNT(DISTINCT city) AS unique_cities FROM customers',
        hint: 'COUNT(DISTINCT column) counts unique values only.',
      },
      {
        id: 'ag-12',
        prompt: 'Find the total quantity sold across all order_items.',
        solution: 'SELECT SUM(quantity) AS total_quantity FROM order_items',
        hint: 'SUM the quantity column.',
      },
      {
        id: 'ag-13',
        prompt: 'Find the average stock across all products, rounded to 0 decimal places. Label it avg_stock.',
        solution: 'SELECT ROUND(AVG(stock), 0) AS avg_stock FROM products',
        hint: 'ROUND(value, 0) rounds to the nearest integer.',
      },
      {
        id: 'ag-14',
        prompt: 'Count how many products cost more than 50.',
        solution: 'SELECT COUNT(*) AS expensive_count FROM products WHERE price > 50',
        hint: 'Use WHERE to filter before counting.',
      },
      {
        id: 'ag-15',
        prompt: 'Find the date of the most recent order and the date of the earliest order. Label them latest_order and earliest_order.',
        solution: 'SELECT MAX(ordered_at) AS latest_order, MIN(ordered_at) AS earliest_order FROM orders',
        hint: 'MAX and MIN work on date strings in ISO format.',
      },
    ],
  },
  {
    id: 'group-by',
    title: 'GROUP BY',
    description: 'Aggregate data by groups',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'GROUP BY divides rows into groups and lets you apply aggregate functions to each group independently, producing one output row per group.',
      concepts: [
        {
          title: 'Basic GROUP BY',
          body: 'Every column in SELECT that is not inside an aggregate function must appear in GROUP BY. This is a hard SQL rule.',
          code: `SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department`,
        },
        {
          title: 'Multiple GROUP BY columns',
          body: 'Grouping by multiple columns creates one group per unique combination of those values.',
          code: `SELECT country, city, COUNT(*) AS customers
FROM customers
GROUP BY country, city`,
        },
        {
          title: 'Expressions inside aggregates',
          body: 'You can compute a value inside the aggregate function — not just reference a plain column.',
          code: `SELECT order_id,
       COUNT(*) AS line_items,
       SUM(quantity * unit_price) AS order_total
FROM order_items
GROUP BY order_id
LIMIT 5`,
        },
        {
          title: 'STRFTIME for date grouping',
          body: "STRFTIME(format, column) extracts a formatted string from a date. Common formats: '%Y' = 4-digit year, '%m' = month number, '%Y-%m' = year-month. The result is a string you can GROUP BY like any column.",
          code: `-- Group by year
SELECT STRFTIME('%Y', ordered_at) AS year,
       COUNT(*) AS order_count
FROM orders
GROUP BY year

-- Group by year-month
SELECT STRFTIME('%Y-%m', ordered_at) AS month,
       ROUND(SUM(quantity * unit_price), 2) AS revenue
FROM orders
JOIN order_items ON orders.id = order_items.order_id
GROUP BY month
ORDER BY month`,
          note: "The alias created by STRFTIME (e.g. year or month) can be used directly in GROUP BY and ORDER BY.",
        },
        {
          title: 'ORDER BY on aggregated results',
          body: 'You can ORDER BY an alias created in the same SELECT, or by the aggregate expression directly.',
          code: `SELECT department, ROUND(AVG(salary), 0) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC`,
        },
      ],
    },
    exercises: [
      {
        id: 'gb-01',
        prompt: 'Count the number of customers per country.',
        solution: 'SELECT country, COUNT(*) FROM customers GROUP BY country',
        hint: 'GROUP BY groups rows with the same value. Use COUNT(*) to count each group.',
      },
      {
        id: 'gb-02',
        prompt: 'Find the average salary per department.',
        solution: 'SELECT department, AVG(salary) FROM employees GROUP BY department',
        hint: 'Group by department, then apply AVG to salary.',
      },
      {
        id: 'gb-03',
        prompt: 'Find the total revenue per order (sum of quantity * unit_price). Show order_id and total.',
        solution: 'SELECT order_id, SUM(quantity * unit_price) AS total FROM order_items GROUP BY order_id',
        hint: 'Group by order_id and SUM the line totals.',
      },
      {
        id: 'gb-04',
        prompt: 'Count the number of products per category.',
        solution: 'SELECT category, COUNT(*) FROM products GROUP BY category',
        hint: 'GROUP BY category.',
      },
      {
        id: 'gb-05',
        prompt: 'Find the maximum salary per department.',
        solution: 'SELECT department, MAX(salary) AS max_salary FROM employees GROUP BY department',
        hint: 'MAX() per group.',
      },
      {
        id: 'gb-06',
        prompt: 'Count the number of orders per status.',
        solution: 'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status',
        hint: 'Group orders by their status value.',
      },
      {
        id: 'gb-07',
        prompt: 'Find the total stock value (price * stock) per category.',
        solution: 'SELECT category, SUM(price * stock) AS stock_value FROM products GROUP BY category',
        hint: 'Multiply price by stock inside SUM().',
      },
      {
        id: 'gb-08',
        prompt: 'Find the number of employees hired per year. Label the year column as hire_year.',
        solution: "SELECT STRFTIME('%Y', hired_at) AS hire_year, COUNT(*) AS employee_count FROM employees GROUP BY hire_year",
        hint: "Use STRFTIME('%Y', hired_at) to extract the year.",
      },
      {
        id: 'gb-09',
        prompt: 'Find the average price per product category. Round to 2 decimals. Order by average price descending.',
        solution: 'SELECT category, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category ORDER BY avg_price DESC',
        hint: 'You can ORDER BY an alias created in the same SELECT.',
      },
      {
        id: 'gb-10',
        prompt: 'For each product category, find the total number of products and the total stock. Label them product_count and total_stock.',
        solution: 'SELECT category, COUNT(*) AS product_count, SUM(stock) AS total_stock FROM products GROUP BY category',
        hint: 'Two aggregate functions in the same GROUP BY query.',
      },
      {
        id: 'gb-11',
        prompt: 'Count customers per city. Order by count descending.',
        solution: 'SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city ORDER BY customer_count DESC',
        hint: 'GROUP BY city, then ORDER BY the count alias.',
      },
      {
        id: 'gb-12',
        prompt: 'Find the total quantity sold per product_id. Order by total quantity descending.',
        solution: 'SELECT product_id, SUM(quantity) AS total_qty FROM order_items GROUP BY product_id ORDER BY total_qty DESC',
        hint: 'SUM quantity per product_id.',
      },
      {
        id: 'gb-13',
        prompt: 'Find the minimum and maximum salary per department. Label them min_salary and max_salary.',
        solution: 'SELECT department, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees GROUP BY department',
        hint: 'Use both MIN and MAX in the same SELECT.',
      },
      {
        id: 'gb-14',
        prompt: "Find the average salary per hiring year. Extract the year from hired_at using STRFTIME('%Y', hired_at) and label it hire_year. Round the average to 0 decimals using ROUND() and label it avg_salary. Order by year ascending.",
        solution: "SELECT STRFTIME('%Y', hired_at) AS hire_year, ROUND(AVG(salary), 0) AS avg_salary FROM employees GROUP BY hire_year ORDER BY hire_year ASC",
        hint: "STRFTIME('%Y', date_column) extracts the 4-digit year. ROUND(AVG(salary), 0) rounds to the nearest integer.",
      },
      {
        id: 'gb-15',
        prompt: 'For each order status, show the count of orders, the earliest order date, and the latest order date.',
        solution: 'SELECT status, COUNT(*) AS order_count, MIN(ordered_at) AS first_date, MAX(ordered_at) AS last_date FROM orders GROUP BY status',
        hint: 'GROUP BY status and apply COUNT, MIN, MAX together.',
      },
    ],
  },
  {
    id: 'having',
    title: 'HAVING',
    description: 'Filter groups after aggregation',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'HAVING filters groups after GROUP BY runs. Think of it as WHERE for aggregated results.',
      concepts: [
        {
          title: 'HAVING vs WHERE',
          body: 'WHERE filters individual rows before grouping. HAVING filters entire groups after aggregation. They run at different stages of the query.',
          code: `-- WHERE: filter rows first, then group
SELECT status, COUNT(*) FROM orders
WHERE ordered_at LIKE '2024%'
GROUP BY status

-- HAVING: group first, then filter groups
SELECT status, COUNT(*) FROM orders
GROUP BY status
HAVING COUNT(*) >= 5`,
        },
        {
          title: 'HAVING with aggregate conditions',
          body: 'You can use any aggregate function in HAVING — COUNT, SUM, AVG, MIN, MAX. You cannot use a plain column that is not in GROUP BY.',
          code: `SELECT product_id, COUNT(*) AS times_ordered
FROM order_items
GROUP BY product_id
HAVING COUNT(*) >= 4`,
        },
        {
          title: 'Multiple HAVING conditions',
          body: 'Combine conditions in HAVING with AND or OR, the same way as WHERE.',
          code: `SELECT category, COUNT(*) AS products, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING COUNT(*) > 2 AND AVG(price) > 50`,
        },
        {
          title: 'Arithmetic in HAVING',
          body: 'HAVING can contain expressions built from aggregate functions — not just direct comparisons.',
          code: `SELECT category, MAX(price) - MIN(price) AS price_spread
FROM products
GROUP BY category
HAVING MAX(price) - MIN(price) > 100`,
        },
      ],
    },
    exercises: [
      {
        id: 'hv-01',
        prompt: 'Find countries that have more than 2 customers.',
        solution: 'SELECT country, COUNT(*) AS customer_count FROM customers GROUP BY country HAVING COUNT(*) > 2',
        hint: 'HAVING filters groups, not individual rows.',
      },
      {
        id: 'hv-02',
        prompt: 'Find departments where the average salary is above 75000.',
        solution: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 75000',
        hint: 'Use HAVING AVG(salary) > 75000.',
      },
      {
        id: 'hv-03',
        prompt: 'Find product categories with total stock value (price * stock) over 10000.',
        solution: 'SELECT category, SUM(price * stock) AS stock_value FROM products GROUP BY category HAVING SUM(price * stock) > 10000',
        hint: 'Calculate stock value inside SUM, then filter with HAVING.',
      },
      {
        id: 'hv-04',
        prompt: 'Find orders that have more than 2 line items.',
        solution: 'SELECT order_id, COUNT(*) AS item_count FROM order_items GROUP BY order_id HAVING COUNT(*) > 2',
        hint: 'Count rows per order_id, then filter.',
      },
      {
        id: 'hv-05',
        prompt: 'Find product categories with average price below 100.',
        solution: 'SELECT category, AVG(price) AS avg_price FROM products GROUP BY category HAVING AVG(price) < 100',
        hint: 'HAVING AVG(price) < 100.',
      },
      {
        id: 'hv-06',
        prompt: 'Find statuses with fewer than 5 orders.',
        solution: 'SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status HAVING COUNT(*) < 5',
        hint: 'HAVING COUNT(*) < 5.',
      },
      {
        id: 'hv-07',
        prompt: 'Find departments with more than 3 employees AND average salary above 65000.',
        solution: 'SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING COUNT(*) > 3 AND AVG(salary) > 65000',
        hint: 'Combine two HAVING conditions with AND.',
      },
      {
        id: 'hv-08',
        prompt: 'Find orders whose total value (sum of quantity * unit_price) is greater than 500.',
        solution: 'SELECT order_id, SUM(quantity * unit_price) AS total FROM order_items GROUP BY order_id HAVING SUM(quantity * unit_price) > 500',
        hint: 'Aggregate per order_id then filter by total.',
      },
      {
        id: 'hv-09',
        prompt: 'Find countries with exactly 1 customer.',
        solution: 'SELECT country, COUNT(*) AS cnt FROM customers GROUP BY country HAVING COUNT(*) = 1',
        hint: 'HAVING COUNT(*) = 1.',
      },
      {
        id: 'hv-10',
        prompt: 'Find product categories where the maximum price is above 200 and the minimum price is below 50.',
        solution: 'SELECT category FROM products GROUP BY category HAVING MAX(price) > 200 AND MIN(price) < 50',
        hint: 'Use both MAX() and MIN() in the HAVING clause.',
      },
      {
        id: 'hv-11',
        prompt: 'Find departments that have exactly 1 employee.',
        solution: 'SELECT department, COUNT(*) AS cnt FROM employees GROUP BY department HAVING COUNT(*) = 1',
        hint: 'HAVING COUNT(*) = 1.',
      },
      {
        id: 'hv-12',
        prompt: 'Find product_ids that appear in order_items with a total quantity of 3 or more.',
        solution: 'SELECT product_id, SUM(quantity) AS total_qty FROM order_items GROUP BY product_id HAVING SUM(quantity) >= 3',
        hint: 'SUM quantity per product, then filter with HAVING.',
      },
      {
        id: 'hv-13',
        prompt: 'Find customers who placed more than 1 order. Show customer_id and order count.',
        solution: 'SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) > 1',
        hint: 'Group by customer_id and filter with HAVING.',
      },
      {
        id: 'hv-14',
        prompt: 'Find departments where the salary range (MAX minus MIN) is greater than 20000.',
        solution: 'SELECT department, MAX(salary) - MIN(salary) AS salary_range FROM employees GROUP BY department HAVING MAX(salary) - MIN(salary) > 20000',
        hint: 'You can use arithmetic on aggregate functions in HAVING.',
      },
      {
        id: 'hv-15',
        prompt: 'Find product categories where every product costs more than 10 (i.e., the minimum price in the category is above 10).',
        solution: 'SELECT category FROM products GROUP BY category HAVING MIN(price) > 10',
        hint: 'If MIN(price) > 10, all products in that category cost more than 10.',
      },
    ],
  },
  {
    id: 'joins',
    title: 'JOINs',
    description: 'INNER JOIN, LEFT JOIN, multiple joins',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'JOINs combine rows from two or more tables based on a matching condition. The ON clause defines which columns link the tables.',
      concepts: [
        {
          title: 'INNER JOIN',
          body: 'Returns only rows that have a match in both tables. Rows with no match on either side are excluded.',
          code: `SELECT c.name, c.country, o.status
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'pending'`,
        },
        {
          title: 'LEFT JOIN',
          body: 'Returns all rows from the left table, plus matching rows from the right. If there is no match, right-side columns are NULL.',
          code: `SELECT p.name, p.category, oi.order_id
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LIMIT 10`,
          note: 'Customers with no orders still appear — with order_id = NULL. Use LEFT JOIN when you need to keep all rows from the left side regardless of match.',
        },
        {
          title: 'Table aliases',
          body: 'Short aliases like c, o, oi make multi-table queries readable. You define them right after the table name.',
          code: `FROM customers c
JOIN orders o      ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id`,
        },
        {
          title: 'Chaining multiple JOINs',
          body: 'You can chain as many JOINs as needed. Each one adds another table to the result set.',
          code: `SELECT c.name, o.ordered_at, p.name AS product
FROM customers c
JOIN orders o      ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p    ON oi.product_id = p.id`,
        },
        {
          title: 'Self JOIN',
          body: 'A self JOIN links a table to itself. You must alias both copies. Common use case: employee and their manager, both in the same table.',
          code: `SELECT e.name, e.department, e.salary,
       m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.department`,
        },
        {
          title: 'COALESCE after LEFT JOIN',
          body: 'When a LEFT JOIN finds no match, aggregate functions return NULL. COALESCE(expr, 0) converts that NULL to 0 or any other default.',
          code: `SELECT c.name,
       COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total_spent
FROM customers c
LEFT JOIN orders o      ON c.id = o.customer_id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY c.id, c.name`,
          note: 'COUNT(oi.id) also returns 0 for unmatched LEFT JOIN rows without COALESCE, because it ignores NULLs.',
        },
      ],
    },
    exercises: [
      {
        id: 'jn-01',
        prompt: 'Show each order with the customer name. Include order id, customer name, and order date.',
        solution: 'SELECT o.id, c.name, o.ordered_at FROM orders o INNER JOIN customers c ON o.customer_id = c.id',
        hint: 'JOIN orders to customers on customer_id = id.',
      },
      {
        id: 'jn-02',
        prompt: 'Show each order item with the product name, quantity, and unit_price.',
        solution: 'SELECT p.name, oi.quantity, oi.unit_price FROM order_items oi INNER JOIN products p ON oi.product_id = p.id',
        hint: 'JOIN order_items to products on product_id.',
      },
      {
        id: 'jn-03',
        prompt: 'Show all customers and their orders. Include customers who have no orders. Show customer name and order id (null if none).',
        solution: 'SELECT c.name, o.id AS order_id FROM customers c LEFT JOIN orders o ON c.id = o.customer_id',
        hint: 'LEFT JOIN keeps all customers even if they have no matching orders.',
      },
      {
        id: 'jn-04',
        prompt: 'Show each employee and their manager name. Label columns as employee_name and manager_name.',
        solution: 'SELECT e.name AS employee_name, m.name AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id',
        hint: 'Self-join: join employees to itself. Use aliases for the two copies.',
      },
      {
        id: 'jn-05',
        prompt: 'Show order id, customer name, and order status for all delivered orders.',
        solution: "SELECT o.id, c.name, o.status FROM orders o INNER JOIN customers c ON o.customer_id = c.id WHERE o.status = 'delivered'",
        hint: 'JOIN first, then apply WHERE to filter by status.',
      },
      {
        id: 'jn-06',
        prompt: 'Show each order item with product name, category, quantity, and line total (quantity * unit_price).',
        solution: 'SELECT p.name, p.category, oi.quantity, oi.quantity * oi.unit_price AS line_total FROM order_items oi INNER JOIN products p ON oi.product_id = p.id',
        hint: 'Calculate line_total as quantity * unit_price in the SELECT.',
      },
      {
        id: 'jn-07',
        prompt: 'Show the total amount spent per customer. Include customer name and total. Order by total descending.',
        solution: 'SELECT c.name, SUM(oi.quantity * oi.unit_price) AS total FROM customers c INNER JOIN orders o ON c.id = o.customer_id INNER JOIN order_items oi ON o.id = oi.order_id GROUP BY c.id, c.name ORDER BY total DESC',
        hint: 'Chain two JOINs: customers → orders → order_items, then GROUP BY customer.',
      },
      {
        id: 'jn-08',
        prompt: 'Show all products and how many times they appear in order_items. Include products with zero orders.',
        solution: 'SELECT p.name, COUNT(oi.id) AS times_ordered FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.name',
        hint: 'LEFT JOIN keeps products with no orders. COUNT(oi.id) returns 0 for unmatched rows.',
      },
      {
        id: 'jn-09',
        prompt: 'Show customer name, order date, and product name for every item ordered. Order by order date.',
        solution: 'SELECT c.name, o.ordered_at, p.name AS product FROM customers c JOIN orders o ON c.id = o.customer_id JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id ORDER BY o.ordered_at',
        hint: 'Chain 4 tables: customers → orders → order_items → products.',
      },
      {
        id: 'jn-10',
        prompt: 'Show the total revenue per order status. Join orders to order_items to compute revenue. Show status and total_revenue. Order by total_revenue descending.',
        solution: 'SELECT o.status, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM orders o JOIN order_items oi ON o.id = oi.order_id GROUP BY o.status ORDER BY total_revenue DESC',
        hint: 'JOIN orders to order_items, GROUP BY status, SUM the line totals.',
      },
      {
        id: 'jn-11',
        prompt: 'Find customers who have never placed an order. Show their name and country.',
        solution: 'SELECT c.name, c.country FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL',
        hint: 'LEFT JOIN keeps all customers. Filter WHERE o.id IS NULL to keep only those with no match.',
      },
      {
        id: 'jn-12',
        prompt: 'Show each product name and the total quantity ever sold. Include products with no sales (show 0). Order by total_sold descending.',
        solution: 'SELECT p.name, COALESCE(SUM(oi.quantity), 0) AS total_sold FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.name ORDER BY total_sold DESC',
        hint: 'LEFT JOIN + COALESCE to turn NULL into 0 for products with no sales.',
      },
      {
        id: 'jn-13',
        prompt: 'Show each employee name and their manager name. Only show employees who have a manager.',
        solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e INNER JOIN employees m ON e.manager_id = m.id',
        hint: 'Self-join with INNER JOIN so only employees with a manager appear.',
      },
      {
        id: 'jn-14',
        prompt: "Show distinct product names and categories that appear in at least one 'delivered' order.",
        solution: "SELECT DISTINCT p.name, p.category FROM products p JOIN order_items oi ON p.id = oi.product_id JOIN orders o ON oi.order_id = o.id WHERE o.status = 'delivered'",
        hint: 'Chain products → order_items → orders, filter by status, use DISTINCT to avoid duplicates.',
      },
      {
        id: 'jn-15',
        prompt: 'Find products that have been ordered by at least 2 different customers. Show product name and the count of unique customers.',
        solution: 'SELECT p.name, COUNT(DISTINCT o.customer_id) AS unique_customers FROM products p JOIN order_items oi ON p.id = oi.product_id JOIN orders o ON oi.order_id = o.id GROUP BY p.id, p.name HAVING COUNT(DISTINCT o.customer_id) >= 2',
        hint: 'COUNT(DISTINCT o.customer_id) counts unique customers per product. Filter with HAVING.',
      },
    ],
  },
  {
    id: 'ctes',
    title: 'CTEs (WITH)',
    description: 'Common Table Expressions for readable multi-step queries',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'A CTE (Common Table Expression) is a named subquery defined before the main SELECT using WITH. It makes complex queries easier to read and debug one step at a time.',
      concepts: [
        {
          title: 'Basic WITH syntax',
          body: 'Define the CTE inside WITH name AS (...), then use it by name in the main query. The CTE exists only for that query.',
          code: `WITH pricey AS (
  SELECT * FROM products WHERE price > 300
)
SELECT name, category, price
FROM pricey
ORDER BY price DESC`,
        },
        {
          title: 'CTE with aggregation, filtered in the outer query',
          body: 'Put heavy work (JOINs, GROUP BY) inside the CTE. The outer query then filters or sorts the pre-aggregated result cleanly.',
          code: `WITH dept_stats AS (
  SELECT department,
         COUNT(*) AS headcount,
         ROUND(AVG(salary), 0) AS avg_salary
  FROM employees
  GROUP BY department
)
SELECT * FROM dept_stats
WHERE headcount > 2
ORDER BY avg_salary DESC`,
        },
        {
          title: 'Multiple CTEs',
          body: 'Separate multiple CTEs with a comma, all under a single WITH keyword. Later CTEs can reference earlier ones.',
          code: `WITH dept_count AS (
  SELECT department, COUNT(*) AS headcount
  FROM employees GROUP BY department
),
dept_salary AS (
  SELECT department, AVG(salary) AS avg_salary
  FROM employees GROUP BY department
)
SELECT dc.department, dc.headcount, ds.avg_salary
FROM dept_count dc
JOIN dept_salary ds ON dc.department = ds.department`,
        },
        {
          title: 'Chained CTEs',
          body: 'The second CTE can reference the first, building a step-by-step pipeline. This replaces deeply nested subqueries.',
          code: `WITH dept_totals AS (
  SELECT department, SUM(salary) AS payroll
  FROM employees GROUP BY department
),
big_depts AS (
  SELECT * FROM dept_totals WHERE payroll > 200000
)
SELECT * FROM big_depts ORDER BY payroll DESC`,
        },
        {
          title: 'Subquery inside a CTE',
          body: 'A CTE can contain a subquery in its WHERE clause — for example, to compare each row to a global aggregate.',
          code: `WITH above_avg AS (
  SELECT * FROM products
  WHERE price > (SELECT AVG(price) FROM products)
)
SELECT name, category, price
FROM above_avg
ORDER BY price`,
        },
      ],
    },
    exercises: [
      {
        id: 'ct-01',
        prompt: 'Using a CTE named high_earners, select employees with salary above 80000. Then select all from the CTE.',
        solution: 'WITH high_earners AS (SELECT * FROM employees WHERE salary > 80000) SELECT * FROM high_earners',
        hint: 'WITH cte_name AS (query) SELECT * FROM cte_name',
      },
      {
        id: 'ct-02',
        prompt: 'Using a CTE named order_totals, calculate total per order_id from order_items. Then select order_id and total where total > 400.',
        solution: 'WITH order_totals AS (SELECT order_id, SUM(quantity * unit_price) AS total FROM order_items GROUP BY order_id) SELECT order_id, total FROM order_totals WHERE total > 400',
        hint: 'Define the aggregation in the CTE, then filter in the outer query.',
      },
      {
        id: 'ct-03',
        prompt: 'Using a CTE named dept_avg, get the average salary per department. Then select departments where avg_salary > 75000.',
        solution: 'WITH dept_avg AS (SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department) SELECT department, avg_salary FROM dept_avg WHERE avg_salary > 75000',
        hint: 'Filter on the CTE alias avg_salary in the outer WHERE.',
      },
      {
        id: 'ct-04',
        prompt: 'Using a CTE named expensive_products, get products with price > 200. Then count how many there are.',
        solution: 'WITH expensive_products AS (SELECT * FROM products WHERE price > 200) SELECT COUNT(*) FROM expensive_products',
        hint: 'Apply COUNT(*) to the CTE in the outer query.',
      },
      {
        id: 'ct-05',
        prompt: 'Using a CTE named customer_orders, count orders per customer_id. Then join to customers to show customer name and order count. Order by order count descending.',
        solution: 'WITH customer_orders AS (SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id) SELECT c.name, co.order_count FROM customer_orders co JOIN customers c ON co.customer_id = c.id ORDER BY co.order_count DESC',
        hint: 'Define the count in the CTE, then JOIN to get the name in the outer query.',
      },
      {
        id: 'ct-06',
        prompt: 'Using a CTE named product_revenue, calculate total revenue per product_id (sum of quantity * unit_price). Then show the top 5 products by revenue, joined to the products table for the name.',
        solution: 'WITH product_revenue AS (SELECT product_id, SUM(quantity * unit_price) AS revenue FROM order_items GROUP BY product_id) SELECT p.name, pr.revenue FROM product_revenue pr JOIN products p ON pr.product_id = p.id ORDER BY pr.revenue DESC LIMIT 5',
        hint: 'CTE aggregates revenue, outer query joins for the name and limits to 5.',
      },
      {
        id: 'ct-07',
        prompt: 'Using two CTEs: dept_count (number of employees per department) and dept_salary (average salary per department). Then join them to show department, headcount, and avg_salary.',
        solution: 'WITH dept_count AS (SELECT department, COUNT(*) AS headcount FROM employees GROUP BY department), dept_salary AS (SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department) SELECT dc.department, dc.headcount, ds.avg_salary FROM dept_count dc JOIN dept_salary ds ON dc.department = ds.department',
        hint: 'Separate CTEs with a comma. JOIN them on department in the final query.',
      },
      {
        id: 'ct-08',
        prompt: 'Using a CTE named recent_orders, select orders placed in 2024. Then count how many recent orders each customer has. Show customer_id and order_count.',
        solution: "WITH recent_orders AS (SELECT * FROM orders WHERE ordered_at LIKE '2024%') SELECT customer_id, COUNT(*) AS order_count FROM recent_orders GROUP BY customer_id",
        hint: 'Filter in the CTE, aggregate in the outer query.',
      },
      {
        id: 'ct-09',
        prompt: 'Using a CTE named above_avg_salary, get employees whose salary is above the company average. Then count how many there are.',
        solution: 'WITH above_avg_salary AS (SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)) SELECT COUNT(*) FROM above_avg_salary',
        hint: 'You can use a subquery inside a CTE definition.',
      },
      {
        id: 'ct-10',
        prompt: 'Using a CTE named category_stats, get each category with its product count and average price. Then select only categories with more than 2 products.',
        solution: 'WITH category_stats AS (SELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price FROM products GROUP BY category) SELECT * FROM category_stats WHERE product_count > 2',
        hint: 'Filter on the CTE column product_count in the outer WHERE.',
      },
      {
        id: 'ct-11',
        prompt: 'Using a CTE named engineering_team, get all Engineering employees. Then select headcount and average salary from it.',
        solution: "WITH engineering_team AS (SELECT * FROM employees WHERE department = 'Engineering') SELECT COUNT(*) AS headcount, ROUND(AVG(salary), 0) AS avg_salary FROM engineering_team",
        hint: 'Define the filter in the CTE, apply aggregates in the outer SELECT.',
      },
      {
        id: 'ct-12',
        prompt: 'Using a CTE named customer_spend, calculate total spend per customer (join orders + order_items). Then show the name of the top-spending customer by joining to the customers table.',
        solution: 'WITH customer_spend AS (SELECT o.customer_id, SUM(oi.quantity * oi.unit_price) AS total FROM orders o JOIN order_items oi ON o.id = oi.order_id GROUP BY o.customer_id) SELECT c.name, cs.total FROM customer_spend cs JOIN customers c ON cs.customer_id = c.id ORDER BY cs.total DESC LIMIT 1',
        hint: 'Aggregate in the CTE, JOIN for the name, LIMIT 1 for the top result.',
      },
      {
        id: 'ct-13',
        prompt: 'Using a CTE named category_revenue, calculate total revenue per product category (join products to order_items). Then select only categories where revenue exceeds 500. Order by revenue descending.',
        solution: 'WITH category_revenue AS (SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category) SELECT category, revenue FROM category_revenue WHERE revenue > 500 ORDER BY revenue DESC',
        hint: 'The CTE handles the JOIN and GROUP BY. The outer query just filters and sorts.',
      },
      {
        id: 'ct-14',
        prompt: 'Using a CTE named last_order, get the most recent order date per customer. Then show customer name and last order date, ordered by most recent first.',
        solution: 'WITH last_order AS (SELECT customer_id, MAX(ordered_at) AS last_order_date FROM orders GROUP BY customer_id) SELECT c.name, lo.last_order_date FROM last_order lo JOIN customers c ON lo.customer_id = c.id ORDER BY lo.last_order_date DESC',
        hint: 'MAX(ordered_at) per customer_id in the CTE, then JOIN for the name.',
      },
      {
        id: 'ct-15',
        prompt: 'Using two CTEs: dept_avg (average salary per department) and above_avg (employees earning above their department average). Show how many above-average earners each department has.',
        solution: 'WITH dept_avg AS (SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department), above_avg AS (SELECT e.department FROM employees e JOIN dept_avg da ON e.department = da.department WHERE e.salary > da.avg_salary) SELECT department, COUNT(*) AS above_avg_count FROM above_avg GROUP BY department ORDER BY above_avg_count DESC',
        hint: 'Join employees to dept_avg in the second CTE to compare each salary to its department average.',
      },
    ],
  },
  {
    id: 'case-when',
    title: 'CASE WHEN',
    description: 'Conditional logic inside queries',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'CASE WHEN is conditional logic inside a SQL expression. It returns different values depending on which condition matches — like if/else, but producing a column.',
      concepts: [
        {
          title: 'Searched CASE WHEN',
          body: 'Conditions are evaluated top-down. The first WHEN that matches wins. ELSE is the fallback — without it, unmatched rows return NULL.',
          code: `SELECT id, status, ordered_at,
  CASE
    WHEN status = 'pending'   THEN 1
    WHEN status = 'shipped'   THEN 2
    WHEN status = 'delivered' THEN 3
    ELSE 0
  END AS status_rank
FROM orders`,
        },
        {
          title: 'NULL checks inside CASE',
          body: 'Use IS NULL or IS NOT NULL inside WHEN. You cannot use = NULL because NULL comparisons always return false.',
          code: `SELECT name, department,
  CASE WHEN manager_id IS NULL THEN 'Director'
       ELSE 'Team Member'
  END AS role_level
FROM employees`,
        },
        {
          title: 'Conditional aggregation: SUM(CASE WHEN ...)',
          body: 'Wrapping CASE WHEN inside SUM lets you pivot data — counting or summing rows that match a specific condition, as separate columns.',
          code: `SELECT
  SUM(CASE WHEN category = 'Electronics' THEN 1 ELSE 0 END) AS electronics,
  SUM(CASE WHEN category = 'Books'       THEN 1 ELSE 0 END) AS books,
  SUM(CASE WHEN price > 100              THEN 1 ELSE 0 END) AS over_100
FROM products`,
          note: 'This pattern produces multiple metrics in a single row — pivoting row values into columns. It is one of the most common patterns in analytics.',
        },
        {
          title: 'CASE inside GROUP BY',
          body: 'You can GROUP BY a CASE expression directly — this defines custom buckets for grouping without an extra CTE or subquery.',
          code: `SELECT
  CASE
    WHEN stock = 0  THEN 'out of stock'
    WHEN stock < 30 THEN 'low stock'
    ELSE 'in stock'
  END AS availability,
  COUNT(*) AS product_count
FROM products
GROUP BY availability`,
        },
        {
          title: 'Wrapping CASE with other functions',
          body: 'CASE WHEN is an expression — you can pass it to ROUND, UPPER, or any function that accepts a value.',
          code: `SELECT name, department, salary,
  ROUND(
    CASE WHEN department = 'Engineering' THEN salary * 1.10
         WHEN department = 'Data'        THEN salary * 1.05
         ELSE salary
    END, 0
  ) AS adjusted_salary
FROM employees`,
        },
      ],
    },
    exercises: [
      {
        id: 'cw-01',
        prompt: "Add a column 'price_tier' to products: 'cheap' if price < 30, 'mid' if price < 150, 'expensive' otherwise.",
        solution: "SELECT name, price, CASE WHEN price < 30 THEN 'cheap' WHEN price < 150 THEN 'mid' ELSE 'expensive' END AS price_tier FROM products",
        hint: 'CASE WHEN condition THEN value ... ELSE default END',
      },
      {
        id: 'cw-02',
        prompt: "Label each employee's salary as 'junior' (< 65000), 'mid' (65000-85000), or 'senior' (> 85000). Show name, salary, and level.",
        solution: "SELECT name, salary, CASE WHEN salary < 65000 THEN 'junior' WHEN salary <= 85000 THEN 'mid' ELSE 'senior' END AS level FROM employees",
        hint: 'Conditions are evaluated top-down — once a WHEN matches, the rest are skipped.',
      },
      {
        id: 'cw-03',
        prompt: "Add a column 'has_manager': 'yes' if manager_id is not null, 'no' otherwise. Show name and has_manager.",
        solution: "SELECT name, CASE WHEN manager_id IS NOT NULL THEN 'yes' ELSE 'no' END AS has_manager FROM employees",
        hint: 'Use IS NOT NULL inside the WHEN condition.',
      },
      {
        id: 'cw-04',
        prompt: "Count the number of 'delivered', 'shipped', 'pending', and 'cancelled' orders using CASE WHEN inside SUM. Show each status as a separate column.",
        solution: "SELECT SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered, SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) AS shipped, SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled FROM orders",
        hint: 'SUM(CASE WHEN ... THEN 1 ELSE 0 END) is the standard pivot pattern.',
      },
      {
        id: 'cw-05',
        prompt: "Show each product's name and a column 'in_stock': 'yes' if stock > 0, 'no' if stock = 0.",
        solution: "SELECT name, CASE WHEN stock > 0 THEN 'yes' ELSE 'no' END AS in_stock FROM products",
        hint: 'Simple two-branch CASE.',
      },
      {
        id: 'cw-06',
        prompt: "Show each order with a 'urgency' column: 'high' if status is 'pending', 'medium' if 'shipped', 'low' if 'delivered', 'none' if 'cancelled'.",
        solution: "SELECT id, status, CASE WHEN status = 'pending' THEN 'high' WHEN status = 'shipped' THEN 'medium' WHEN status = 'delivered' THEN 'low' ELSE 'none' END AS urgency FROM orders",
        hint: 'One WHEN branch per status value.',
      },
      {
        id: 'cw-07',
        prompt: "For each employee, show name, department, and a column 'dept_group': 'Technical' if department is 'Engineering' or 'Data', 'Business' otherwise.",
        solution: "SELECT name, department, CASE WHEN department IN ('Engineering', 'Data') THEN 'Technical' ELSE 'Business' END AS dept_group FROM employees",
        hint: 'Use IN inside a WHEN condition.',
      },
      {
        id: 'cw-08',
        prompt: "Show the total revenue split into two columns: 'electronics_revenue' for Electronics products and 'other_revenue' for everything else. Join order_items to products.",
        solution: "SELECT SUM(CASE WHEN p.category = 'Electronics' THEN oi.quantity * oi.unit_price ELSE 0 END) AS electronics_revenue, SUM(CASE WHEN p.category != 'Electronics' THEN oi.quantity * oi.unit_price ELSE 0 END) AS other_revenue FROM order_items oi JOIN products p ON oi.product_id = p.id",
        hint: 'Conditional SUM with a JOIN to get the category.',
      },
      {
        id: 'cw-09',
        prompt: "Show customer name and a 'region' column: 'Americas' for USA, Canada, Brazil, Mexico; 'Europe' for UK, Germany, Spain, Italy, Portugal; 'Asia' for Japan, South Korea, China, India; 'Other' for the rest.",
        solution: "SELECT name, country, CASE WHEN country IN ('USA','Canada','Brazil','Mexico') THEN 'Americas' WHEN country IN ('UK','Germany','Spain','Italy','Portugal') THEN 'Europe' WHEN country IN ('Japan','South Korea','China','India') THEN 'Asia' ELSE 'Other' END AS region FROM customers",
        hint: 'Each WHEN uses IN with a list of countries.',
      },
      {
        id: 'cw-10',
        prompt: "Count employees per salary band using GROUP BY on a CASE expression. Bands: 'under 60k', '60k-79k', '80k+'. Show band and count.",
        solution: "SELECT CASE WHEN salary < 60000 THEN 'under 60k' WHEN salary < 80000 THEN '60k-79k' ELSE '80k+' END AS band, COUNT(*) AS employee_count FROM employees GROUP BY band",
        hint: 'You can GROUP BY a CASE expression directly.',
      },
      {
        id: 'cw-11',
        prompt: "Add a stock_level column to products: 'High' if stock > 100, 'Medium' if stock > 30, 'Low' otherwise.",
        solution: "SELECT name, stock, CASE WHEN stock > 100 THEN 'High' WHEN stock > 30 THEN 'Medium' ELSE 'Low' END AS stock_level FROM products",
        hint: 'Conditions are evaluated top-down — the first match wins.',
      },
      {
        id: 'cw-12',
        prompt: "For each order, add a recency column: 'Recent' if ordered_at >= '2024-06-01', 'Old' otherwise.",
        solution: "SELECT id, ordered_at, CASE WHEN ordered_at >= '2024-06-01' THEN 'Recent' ELSE 'Old' END AS recency FROM orders",
        hint: 'ISO date strings compare lexicographically, so >= works correctly.',
      },
      {
        id: 'cw-13',
        prompt: "Count orders placed in 2024 vs 2023 in a single row. Label columns orders_2024 and orders_2023. Use STRFTIME('%Y', ordered_at) to get the year.",
        solution: "SELECT SUM(CASE WHEN STRFTIME('%Y', ordered_at) = '2024' THEN 1 ELSE 0 END) AS orders_2024, SUM(CASE WHEN STRFTIME('%Y', ordered_at) = '2023' THEN 1 ELSE 0 END) AS orders_2023 FROM orders",
        hint: "SUM(CASE WHEN year = '2024' THEN 1 ELSE 0 END) counts matching rows.",
      },
      {
        id: 'cw-14',
        prompt: 'Show each product name, category, and a discounted_price: 10% off if price < 30, 5% off if price < 100, otherwise full price. Round to 2 decimals.',
        solution: 'SELECT name, category, ROUND(CASE WHEN price < 30 THEN price * 0.90 WHEN price < 100 THEN price * 0.95 ELSE price END, 2) AS discounted_price FROM products',
        hint: 'Wrap the entire CASE expression in ROUND(..., 2).',
      },
      {
        id: 'cw-15',
        prompt: "For each product category, count how many products have low stock (stock < 30) and how many are OK (stock >= 30). Label columns low_stock and ok_stock.",
        solution: "SELECT category, SUM(CASE WHEN stock < 30 THEN 1 ELSE 0 END) AS low_stock, SUM(CASE WHEN stock >= 30 THEN 1 ELSE 0 END) AS ok_stock FROM products GROUP BY category",
        hint: 'Conditional SUM per category — two CASE expressions, one GROUP BY.',
      },
    ],
  },
  {
    id: 'window-functions',
    title: 'Window Functions',
    description: 'ROW_NUMBER, RANK, LAG, LEAD, SUM OVER, AVG OVER',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'Window functions compute a value across a set of related rows without collapsing them. Every row keeps its place, and a computed column is added based on its surrounding window.',
      concepts: [
        {
          title: 'OVER() — the window clause',
          body: 'Every window function requires OVER(). An empty OVER() means the entire table is the window. The result appears on every row.',
          code: `SELECT id, unit_price,
  COUNT(*) OVER () AS total_line_items,
  SUM(unit_price) OVER () AS total_unit_value
FROM order_items
LIMIT 5`,
        },
        {
          title: 'PARTITION BY — sub-windows',
          body: 'PARTITION BY divides rows into groups. The window function resets for each group — like GROUP BY but without collapsing rows.',
          code: `SELECT name, category, price,
  COUNT(*) OVER (PARTITION BY category) AS products_in_category
FROM products`,
        },
        {
          title: 'ORDER BY inside OVER — running calculations',
          body: 'Adding ORDER BY inside OVER makes the window grow row by row in that order. SUM OVER with ORDER BY gives a running total.',
          code: `SELECT id, ordered_at,
  ROW_NUMBER() OVER (ORDER BY ordered_at) AS order_sequence,
  COUNT(*) OVER (ORDER BY ordered_at) AS running_count
FROM orders`,
        },
        {
          title: 'ROW_NUMBER, RANK, DENSE_RANK',
          body: 'All three assign a position within the window. They differ on ties: ROW_NUMBER gives unique numbers always; RANK skips numbers after a tie; DENSE_RANK never skips.',
          code: `SELECT name, category, price,
  ROW_NUMBER() OVER (ORDER BY price DESC) AS row_num,
  RANK()       OVER (ORDER BY price DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY price DESC) AS d_rnk
FROM products
ORDER BY price DESC`,
          note: 'To get the top-1 per group: use ROW_NUMBER() OVER (PARTITION BY group ORDER BY value DESC) in a subquery, then filter WHERE rn = 1 in the outer query.',
        },
        {
          title: 'LAG and LEAD',
          body: 'LAG(col) returns the value from the previous row in the window. LEAD(col) returns the next row. Both return NULL at the boundary.',
          code: `SELECT id, ordered_at, customer_id,
  LAG(ordered_at)  OVER (ORDER BY ordered_at) AS prev_order_date,
  LEAD(ordered_at) OVER (ORDER BY ordered_at) AS next_order_date
FROM orders`,
        },
        {
          title: 'NTILE — buckets',
          body: 'NTILE(n) divides the window into n roughly equal groups and assigns each row a bucket number. Used for quartiles, deciles, and percentile bands.',
          code: `SELECT name, price,
  NTILE(4) OVER (ORDER BY price ASC) AS price_quartile
FROM products`,
        },
      ],
    },
    exercises: [
      {
        id: 'wf-01',
        prompt: 'Assign a row number to each employee ordered by salary descending. Show name, salary, and row_num.',
        solution: 'SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num FROM employees',
        hint: 'ROW_NUMBER() OVER (ORDER BY ...) assigns sequential numbers.',
      },
      {
        id: 'wf-02',
        prompt: 'Rank employees by salary within each department. Show name, department, salary, and rank. Ties should get the same rank (use RANK, not ROW_NUMBER).',
        solution: 'SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk FROM employees',
        hint: 'PARTITION BY splits the window per department. RANK() handles ties.',
      },
      {
        id: 'wf-03',
        prompt: 'For each employee, show their salary and the average salary of their department in the same row. Label it dept_avg_salary.',
        solution: 'SELECT name, department, salary, AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary FROM employees',
        hint: 'AVG() OVER (PARTITION BY department) computes average per department without collapsing rows.',
      },
      {
        id: 'wf-04',
        prompt: 'Show each order item with a running total of quantity * unit_price ordered by id. Label it running_total.',
        solution: 'SELECT id, order_id, quantity * unit_price AS line_total, SUM(quantity * unit_price) OVER (ORDER BY id) AS running_total FROM order_items',
        hint: 'SUM() OVER (ORDER BY id) accumulates row by row.',
      },
      {
        id: 'wf-05',
        prompt: 'For each employee, show name, salary, and the salary of the employee hired just before them (by hire date). Label it prev_salary.',
        solution: 'SELECT name, hired_at, salary, LAG(salary) OVER (ORDER BY hired_at) AS prev_salary FROM employees',
        hint: 'LAG(column) gets the value from the previous row in the window.',
      },
      {
        id: 'wf-06',
        prompt: 'For each employee, show name, salary, and the salary of the next employee (ordered by salary ascending). Label it next_salary.',
        solution: 'SELECT name, salary, LEAD(salary) OVER (ORDER BY salary ASC) AS next_salary FROM employees',
        hint: 'LEAD(column) gets the value from the next row.',
      },
      {
        id: 'wf-07',
        prompt: 'Show the top-earning employee per department. Use ROW_NUMBER to rank within each department by salary desc, then filter to rank = 1.',
        solution: 'SELECT name, department, salary FROM (SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn FROM employees) WHERE rn = 1',
        hint: 'Wrap the window function in a subquery, then filter on the rank column.',
      },
      {
        id: 'wf-08',
        prompt: "For each product, show name, category, price, and each product's price rank within its category (1 = most expensive). Use DENSE_RANK.",
        solution: 'SELECT name, category, price, DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank FROM products',
        hint: 'DENSE_RANK gives consecutive ranks with no gaps after ties.',
      },
      {
        id: 'wf-09',
        prompt: 'Show each order with the total number of orders by the same customer (in the same result row). Label it customer_order_count.',
        solution: 'SELECT id, customer_id, ordered_at, COUNT(*) OVER (PARTITION BY customer_id) AS customer_order_count FROM orders',
        hint: 'COUNT(*) OVER (PARTITION BY customer_id) counts per customer without collapsing rows.',
      },
      {
        id: 'wf-10',
        prompt: 'For each employee, show name, salary, department average salary, and the difference between their salary and the department average. Label it salary_diff.',
        solution: 'SELECT name, salary, ROUND(AVG(salary) OVER (PARTITION BY department), 2) AS dept_avg, ROUND(salary - AVG(salary) OVER (PARTITION BY department), 2) AS salary_diff FROM employees',
        hint: 'You can use the same window expression twice in one SELECT, or reference it via a subquery.',
      },
      {
        id: 'wf-11',
        prompt: 'Show each employee name, hire date, salary, and a running total of salary cost ordered by hire date (cumulative payroll). Label it cumulative_salary.',
        solution: 'SELECT name, hired_at, salary, SUM(salary) OVER (ORDER BY hired_at) AS cumulative_salary FROM employees ORDER BY hired_at',
        hint: 'SUM() OVER (ORDER BY hired_at) accumulates as rows are processed in hire-date order.',
      },
      {
        id: 'wf-12',
        prompt: 'For each product, show name, category, price, and the maximum price within its category (without collapsing rows). Label it category_max.',
        solution: 'SELECT name, category, price, MAX(price) OVER (PARTITION BY category) AS category_max FROM products',
        hint: 'MAX() OVER (PARTITION BY category) computes the max per category on every row.',
      },
      {
        id: 'wf-13',
        prompt: "Show each employee's name, salary, the company-wide average salary, and a column vs_avg: 'above' if their salary is higher, 'below' otherwise.",
        solution: "SELECT name, salary, ROUND(AVG(salary) OVER (), 0) AS company_avg, CASE WHEN salary > AVG(salary) OVER () THEN 'above' ELSE 'below' END AS vs_avg FROM employees",
        hint: 'AVG() OVER () with no PARTITION BY computes the global average. You can use it inside CASE WHEN.',
      },
      {
        id: 'wf-14',
        prompt: 'For each order item, show its line total (quantity * unit_price) and its percentage of the total value of that order. Round to 1 decimal. Label it pct_of_order.',
        solution: 'SELECT id, order_id, quantity * unit_price AS line_total, ROUND(quantity * unit_price * 100.0 / SUM(quantity * unit_price) OVER (PARTITION BY order_id), 1) AS pct_of_order FROM order_items',
        hint: 'Divide each line total by SUM() OVER (PARTITION BY order_id) and multiply by 100.',
      },
      {
        id: 'wf-15',
        prompt: 'Assign a price quartile (1=cheapest, 4=most expensive) to each product using NTILE(4). Show name, price, and price_quartile.',
        solution: 'SELECT name, price, NTILE(4) OVER (ORDER BY price ASC) AS price_quartile FROM products ORDER BY price',
        hint: 'NTILE(4) OVER (ORDER BY price) divides rows into 4 equal-sized buckets.',
      },
    ],
  },
  {
    id: 'real-world',
    title: 'Real-World Queries',
    description: 'Multi-concept exercises combining JOINs, CTEs, window functions, and CASE WHEN',
    tables: ['customers', 'products', 'employees', 'orders', 'order_items'],
    lesson: {
      intro: 'Real-world queries combine multiple tools: JOINs for related tables, CTEs for step-by-step logic, GROUP BY for metrics, and window functions for ranking and comparison. The skill is deciding which layer handles which problem.',
      concepts: [
        {
          title: 'JOIN + GROUP BY + HAVING',
          body: 'The most common analytics pattern: join tables to bring in context, group to aggregate, then HAVING to keep only groups that meet a threshold.',
          code: `SELECT c.name, COUNT(DISTINCT o.id) AS orders,
  SUM(oi.quantity * oi.unit_price) AS total_spent
FROM customers c
JOIN orders o      ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY c.id, c.name
HAVING total_spent > 500
ORDER BY total_spent DESC`,
        },
        {
          title: 'CTE → window rank → filter',
          body: 'You cannot filter on a window function in the same WHERE clause where it is defined. The solution is to put the window function in a CTE, then filter in the outer query.',
          code: `WITH ranked AS (
  SELECT name, department, salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT name, department, salary
FROM ranked WHERE rn = 1`,
        },
        {
          title: 'Multi-step CTE pipeline',
          body: 'Each CTE adds one transformation. The final SELECT reads from the last CTE. This is far more readable than nested subqueries for 3+ step logic.',
          code: `WITH revenue AS (
  SELECT p.id, p.name,
    SUM(oi.quantity * oi.unit_price) AS rev
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  GROUP BY p.id, p.name
),
ranked AS (
  SELECT *, RANK() OVER (ORDER BY rev DESC) AS rnk
  FROM revenue
)
SELECT name, rev FROM ranked WHERE rnk <= 3`,
        },
        {
          title: 'Subquery inside a CTE',
          body: 'A CTE can contain a scalar subquery in its WHERE clause — useful for comparing each row to a global metric like the category average.',
          code: `WITH expensive AS (
  SELECT name, category, price FROM products
  WHERE price > (SELECT AVG(price) FROM products)
)
SELECT category, COUNT(*) AS above_avg_count
FROM expensive
GROUP BY category`,
        },
      ],
    },
    exercises: [
      {
        id: 'rw-01',
        prompt: 'Show the top 3 customers by total spend. For each, show their name, number of orders, and total amount spent. (Hint: join customers → orders → order_items, group by customer, order by total desc, limit 3.)',
        solution: 'SELECT c.name, COUNT(DISTINCT o.id) AS order_count, SUM(oi.quantity * oi.unit_price) AS total_spent FROM customers c JOIN orders o ON c.id = o.customer_id JOIN order_items oi ON o.id = oi.order_id GROUP BY c.id, c.name ORDER BY total_spent DESC LIMIT 3',
        hint: 'Three-table join: customers → orders → order_items. GROUP BY customer, aggregate count of orders and sum of spend.',
      },
      {
        id: 'rw-02',
        prompt: "For each department, show the employee with the highest salary. Show department, employee name, and salary. Use a CTE with ROW_NUMBER to rank by salary within each department, then filter to rank 1.",
        solution: 'WITH ranked AS (SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn FROM employees) SELECT department, name, salary FROM ranked WHERE rn = 1 ORDER BY salary DESC',
        hint: 'ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) in a CTE. Filter WHERE rn = 1.',
      },
      {
        id: 'rw-03',
        prompt: "Classify each product as 'top seller' (revenue in top 25% of all products), 'mid seller' (top 50%), or 'low seller' (rest). Use a CTE to calculate revenue per product, then NTILE(4) to assign quartiles, then CASE to label them.",
        solution: "WITH product_revenue AS (SELECT p.name, p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.name, p.category), quartiled AS (SELECT *, NTILE(4) OVER (ORDER BY revenue DESC) AS quartile FROM product_revenue) SELECT name, category, revenue, CASE WHEN quartile = 1 THEN 'top seller' WHEN quartile = 2 THEN 'mid seller' ELSE 'low seller' END AS tier FROM quartiled ORDER BY revenue DESC",
        hint: 'Three steps: (1) CTE for revenue via JOIN+GROUP BY, (2) NTILE(4) window function, (3) CASE WHEN on the quartile number.',
      },
      {
        id: 'rw-04',
        prompt: "Show each employee's name, department, salary, and how much they earn above or below their department's average. Label the difference salary_vs_avg. Only show employees in the 'Engineering' or 'Data' departments.",
        solution: "SELECT name, department, salary, ROUND(salary - AVG(salary) OVER (PARTITION BY department), 0) AS salary_vs_avg FROM employees WHERE department IN ('Engineering', 'Data') ORDER BY department, salary DESC",
        hint: 'AVG() OVER (PARTITION BY department) gives the dept average without collapsing rows. Filter with WHERE before the window function sees the data.',
      },
      {
        id: 'rw-05',
        prompt: "Find the best-selling product (by total quantity sold) in each category. Show category, product name, and total quantity. Use a CTE with ROW_NUMBER.",
        solution: 'WITH sales AS (SELECT p.category, p.name, SUM(oi.quantity) AS total_qty FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.category, p.name), ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_qty DESC) AS rn FROM sales) SELECT category, name, total_qty FROM ranked WHERE rn = 1 ORDER BY total_qty DESC',
        hint: 'CTE 1: JOIN + GROUP BY to get quantity per product. CTE 2: ROW_NUMBER per category. Outer query filters rn = 1.',
      },
      {
        id: 'rw-06',
        prompt: "Show the revenue contribution of each product category as a percentage of total revenue. Label columns category, revenue, and pct_of_total (rounded to 1 decimal). Order by revenue descending.",
        solution: 'SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue, ROUND(SUM(oi.quantity * oi.unit_price) * 100.0 / SUM(SUM(oi.quantity * oi.unit_price)) OVER (), 1) AS pct_of_total FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category ORDER BY revenue DESC',
        hint: 'SUM(SUM(...)) OVER () — the outer SUM is a window function over the GROUP BY results. This computes the grand total across all categories.',
      },
      {
        id: 'rw-07',
        prompt: "Classify customers as 'active' (placed at least one order in 2024) or 'inactive' (no orders in 2024). Show customer name, total orders ever, and their status. Include customers with zero orders.",
        solution: "SELECT c.name, COUNT(o.id) AS total_orders, CASE WHEN SUM(CASE WHEN o.ordered_at >= '2024-01-01' THEN 1 ELSE 0 END) > 0 THEN 'active' ELSE 'inactive' END AS status FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY total_orders DESC",
        hint: 'LEFT JOIN to keep customers with no orders. Use a CASE inside SUM to count 2024 orders, then CASE on that to label active/inactive.',
      },
      {
        id: 'rw-08',
        prompt: 'Show each employee, their salary, and a running total of salary ordered by hire date. Also show what percentage of the total salary budget has been accounted for at each row (cumulative %). Round to 1 decimal.',
        solution: 'SELECT name, hired_at, salary, SUM(salary) OVER (ORDER BY hired_at) AS running_total, ROUND(SUM(salary) OVER (ORDER BY hired_at) * 100.0 / SUM(salary) OVER (), 1) AS cumulative_pct FROM employees ORDER BY hired_at',
        hint: 'Two window functions: SUM OVER (ORDER BY hired_at) for the running total, divided by SUM OVER () (grand total) for the percentage.',
      },
      {
        id: 'rw-09',
        prompt: "For each product, show its name, category, total revenue, rank within its category by revenue, and whether it is the category's top seller ('yes'/'no'). Use a CTE.",
        solution: "WITH rev AS (SELECT p.id, p.name, p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.name, p.category) SELECT name, category, revenue, RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS cat_rank, CASE WHEN RANK() OVER (PARTITION BY category ORDER BY revenue DESC) = 1 THEN 'yes' ELSE 'no' END AS top_seller FROM rev ORDER BY category, cat_rank",
        hint: 'CTE for revenue via JOIN+GROUP BY. In the outer SELECT, use RANK() twice — once for the rank column, once inside CASE. Both windows are identical.',
      },
      {
        id: 'rw-10',
        prompt: "Find all employees who earn more than their department's average salary AND belong to a department with more than 2 employees. Show name, department, salary, and department average (rounded to 0 decimals). Use CTEs.",
        solution: 'WITH dept_stats AS (SELECT department, AVG(salary) AS avg_salary, COUNT(*) AS headcount FROM employees GROUP BY department), qualifies AS (SELECT e.name, e.department, e.salary, ROUND(ds.avg_salary, 0) AS dept_avg FROM employees e JOIN dept_stats ds ON e.department = ds.department WHERE e.salary > ds.avg_salary AND ds.headcount > 2) SELECT * FROM qualifies ORDER BY department, salary DESC',
        hint: 'CTE 1: compute avg_salary and headcount per department. CTE 2: join employees to it and apply both filters. This is a common pattern to avoid correlated subqueries.',
      },
      {
        id: 'rw-11',
        prompt: "Calculate total revenue per month in 2024. Use STRFTIME('%Y-%m', ordered_at) as the month. Show month, revenue, previous month revenue (LAG), and growth percentage vs previous month (round to 1 decimal). Join orders to order_items. Use a CTE for the monthly totals.",
        solution: "WITH monthly AS (SELECT STRFTIME('%Y-%m', o.ordered_at) AS month, SUM(oi.quantity * oi.unit_price) AS revenue FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.ordered_at LIKE '2024%' GROUP BY month) SELECT month, ROUND(revenue, 2) AS revenue, ROUND(LAG(revenue) OVER (ORDER BY month), 2) AS prev_revenue, ROUND((revenue - LAG(revenue) OVER (ORDER BY month)) * 100.0 / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct FROM monthly ORDER BY month",
        hint: "CTE aggregates monthly revenue with JOIN+GROUP BY. Outer SELECT uses LAG(revenue) OVER (ORDER BY month) for the previous month. Growth = (current - prev) / prev * 100.",
      },
      {
        id: 'rw-12',
        prompt: "Classify each customer as 'Frequent' (3+ orders), 'Occasional' (2 orders), 'One-time' (1 order), or 'Inactive' (0 orders). Show name, country, order count, and segment. Include customers with no orders.",
        solution: "SELECT c.name, c.country, COUNT(o.id) AS order_count, CASE WHEN COUNT(o.id) >= 3 THEN 'Frequent' WHEN COUNT(o.id) = 2 THEN 'Occasional' WHEN COUNT(o.id) = 1 THEN 'One-time' ELSE 'Inactive' END AS segment FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name, c.country ORDER BY order_count DESC",
        hint: "LEFT JOIN keeps customers with 0 orders. COUNT(o.id) returns 0 for customers with no orders (NULLs are not counted). CASE WHEN runs on that count.",
      },
      {
        id: 'rw-13',
        prompt: "For each customer who placed at least 2 orders, show: name, order count, first order date, last order date, and the number of days between first and last order. Use JULIANDAY() for the date difference. Use a CTE.",
        solution: "WITH repeat_customers AS (SELECT customer_id, COUNT(*) AS order_count, MIN(ordered_at) AS first_order, MAX(ordered_at) AS last_order FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2) SELECT c.name, rc.order_count, rc.first_order, rc.last_order, CAST(JULIANDAY(rc.last_order) - JULIANDAY(rc.first_order) AS INTEGER) AS days_span FROM repeat_customers rc JOIN customers c ON rc.customer_id = c.id ORDER BY days_span DESC",
        hint: "JULIANDAY(date) converts a date to a decimal day number. Subtract two JULIANDAY values to get the difference in days. Cast to INTEGER to drop the decimal.",
      },
      {
        id: 'rw-14',
        prompt: "For each product that has been sold, show: name, category, total revenue, its global revenue rank, its revenue rank within its category, and the category's total revenue. Use a CTE for product revenue, then apply three window functions in the outer query.",
        solution: "WITH product_rev AS (SELECT p.id, p.name, p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.name, p.category) SELECT name, category, ROUND(revenue, 2) AS revenue, RANK() OVER (ORDER BY revenue DESC) AS global_rank, RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS category_rank, ROUND(SUM(revenue) OVER (PARTITION BY category), 2) AS category_total FROM product_rev ORDER BY category, category_rank",
        hint: "One CTE for the JOIN+GROUP BY. Three window functions in the outer SELECT: RANK() globally, RANK() partitioned by category, SUM() partitioned by category for the category total.",
      },
      {
        id: 'rw-15',
        prompt: "Build a complete order line report. For every order item show: order id, customer name, product name, quantity, line total, order total, what % of the order that line represents, and the customer's total lifetime spend. Round all amounts to 2 decimals and percentages to 1 decimal. Use CTEs for order totals and customer totals.",
        solution: "WITH order_totals AS (SELECT order_id, SUM(quantity * unit_price) AS order_total FROM order_items GROUP BY order_id), customer_totals AS (SELECT o.customer_id, SUM(oi.quantity * oi.unit_price) AS lifetime_value FROM orders o JOIN order_items oi ON o.id = oi.order_id GROUP BY o.customer_id) SELECT o.id AS order_id, c.name AS customer, p.name AS product, oi.quantity, ROUND(oi.quantity * oi.unit_price, 2) AS line_total, ROUND(ot.order_total, 2) AS order_total, ROUND(oi.quantity * oi.unit_price * 100.0 / ot.order_total, 1) AS pct_of_order, ROUND(ct.lifetime_value, 2) AS customer_ltv FROM order_items oi JOIN orders o ON oi.order_id = o.id JOIN customers c ON o.customer_id = c.id JOIN products p ON oi.product_id = p.id JOIN order_totals ot ON oi.order_id = ot.order_id JOIN customer_totals ct ON o.customer_id = ct.customer_id ORDER BY o.id, line_total DESC",
        hint: "Two CTEs isolate the two aggregations (per order, per customer). The main query joins 4 base tables + 2 CTEs. Each CTE solves one aggregation problem independently.",
      },
    ],
  },
  {
    id: 'hospitality',
    title: 'Hospitality Analytics',
    description: 'Short-term rentals, OTA channels, ADR, and revenue attribution — Guesty interview prep',
    tables: ['properties', 'channels', 'reservations'],
    lesson: {
      intro: 'Guesty is a property management platform for short-term rentals (Airbnb, Booking.com, VRBO). Their data model revolves around properties, booking channels, and reservations. The signature interview question: "Calculate revenue in 3 ways — by first night, by last night, and distributed per night."',
      concepts: [
        {
          title: 'Date arithmetic with JULIANDAY()',
          body: 'SQLite has no DATEDIFF(). Use JULIANDAY() to subtract dates. A check_out of Jan 8 and check_in of Jan 5 = 3 nights. Cast to INTEGER to drop the decimal.',
          code: `-- Number of nights for a booking
SELECT id,
       CAST(julianday(check_out) - julianday(check_in) AS INTEGER) AS nights
FROM reservations

-- Last night of a stay (the night before check_out)
SELECT DATE(check_out, '-1 day') AS last_night
FROM reservations`,
        },
        {
          title: 'Average Daily Rate (ADR)',
          body: "ADR = total revenue ÷ number of nights. It's the primary KPI for any short-term rental business. Use SUM(revenue) / SUM(nights) when aggregating across multiple properties (not AVG of ADRs).",
          code: `SELECT p.type,
       ROUND(SUM(r.total_revenue) / SUM(julianday(r.check_out) - julianday(r.check_in)), 2) AS adr
FROM reservations r
JOIN properties p ON r.property_id = p.id
WHERE r.status = 'confirmed'
GROUP BY p.type`,
        },
        {
          title: 'Revenue attribution: 3 methods',
          body: 'The same total revenue can be assigned to different dates depending on business rules. All three methods produce the same TOTAL, but a different date distribution — which matters for monthly P&L, forecasting, and occupancy analysis.',
          code: `-- Method 1: attribute to the first night (check_in date)
SELECT check_in AS date, SUM(total_revenue) AS revenue
FROM reservations WHERE status = 'confirmed' GROUP BY check_in

-- Method 2: attribute to the last night (day before check_out)
SELECT DATE(check_out, '-1 day') AS date, SUM(total_revenue) AS revenue
FROM reservations WHERE status = 'confirmed' GROUP BY DATE(check_out, '-1 day')

-- Method 3: distribute evenly across every night (requires recursive CTE)`,
        },
        {
          title: 'Recursive CTE — generate one row per night',
          body: 'To distribute revenue per night, you need one row per night per reservation. A recursive CTE starts with the check_in date and adds +1 day until it reaches check_out. This is the hospitality equivalent of a calendar table join.',
          code: `WITH RECURSIVE nights AS (
  -- Base: one row per reservation, starting at check_in
  SELECT id, check_in AS night, check_out,
         total_revenue / CAST(julianday(check_out) - julianday(check_in) AS REAL) AS nightly_rev
  FROM reservations WHERE status = 'confirmed'

  UNION ALL

  -- Recursive step: advance by one day while still before check_out
  SELECT n.id, DATE(n.night, '+1 day'), n.check_out, n.nightly_rev
  FROM nights n
  WHERE DATE(n.night, '+1 day') < n.check_out
)
SELECT night, ROUND(SUM(nightly_rev), 2) AS revenue
FROM nights
GROUP BY night
ORDER BY night`,
        },
        {
          title: 'Conditional aggregation for rates',
          body: 'Count rows meeting a condition inside a GROUP BY using SUM(CASE WHEN ... THEN 1 ELSE 0 END). This avoids a subquery when you need both the count and the total in the same row.',
          code: `SELECT c.name AS channel,
       COUNT(*) AS total_bookings,
       SUM(CASE WHEN r.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
       ROUND(100.0 * SUM(CASE WHEN r.status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 1) AS cancel_rate_pct
FROM reservations r
JOIN channels c ON r.channel_id = c.id
GROUP BY c.name`,
        },
      ],
    },
    exercises: [
      {
        id: 'ha-01',
        prompt: "Which booking channels are generating the most confirmed revenue? Show channel name, number of confirmed bookings (as bookings), and total revenue (as total_revenue), ordered from highest to lowest revenue.",
        solution: "SELECT c.name AS channel, COUNT(r.id) AS bookings, ROUND(SUM(r.total_revenue), 2) AS total_revenue FROM reservations r JOIN channels c ON r.channel_id = c.id WHERE r.status = 'confirmed' GROUP BY c.id, c.name ORDER BY total_revenue DESC",
        hint: "JOIN reservations with channels on channel_id. WHERE status = 'confirmed'. GROUP BY channel. SUM(total_revenue) and COUNT(id).",
      },
      {
        id: 'ha-02',
        prompt: "Show performance per property for confirmed bookings. Display property name (as property), type, city, number of stays, and total revenue. Order by total revenue descending.",
        solution: "SELECT p.name AS property, p.type, p.city, COUNT(r.id) AS stays, ROUND(SUM(r.total_revenue), 2) AS total_revenue FROM reservations r JOIN properties p ON r.property_id = p.id WHERE r.status = 'confirmed' GROUP BY p.id ORDER BY total_revenue DESC",
        hint: "JOIN reservations with properties. Filter confirmed. GROUP BY p.id to avoid duplicate names.",
      },
      {
        id: 'ha-03',
        prompt: "For each confirmed reservation, show: id, check_in, check_out, number of nights (as nights), and average nightly rate (as adr, rounded to 2 decimals). Order by adr descending, then by id ascending.",
        solution: "SELECT id, check_in, check_out, CAST(julianday(check_out) - julianday(check_in) AS INTEGER) AS nights, ROUND(total_revenue / (julianday(check_out) - julianday(check_in)), 2) AS adr FROM reservations WHERE status = 'confirmed' ORDER BY adr DESC, id",
        hint: "CAST(julianday(check_out) - julianday(check_in) AS INTEGER) gives nights. ADR = total_revenue / nights.",
      },
      {
        id: 'ha-04',
        prompt: "Show monthly revenue from confirmed bookings. Use check_in month, grouped as YYYY-MM (label it month). Show bookings count and total revenue. Order chronologically.",
        solution: "SELECT STRFTIME('%Y-%m', check_in) AS month, COUNT(*) AS bookings, ROUND(SUM(total_revenue), 2) AS revenue FROM reservations WHERE status = 'confirmed' GROUP BY month ORDER BY month",
        hint: "STRFTIME('%Y-%m', check_in) extracts the year-month. GROUP BY the alias. No JOIN needed.",
      },
      {
        id: 'ha-05',
        prompt: "Calculate the cancellation rate per channel. Show channel name, total bookings (all statuses), cancelled count, and cancel_rate_pct (as a percentage, rounded to 1 decimal). Order by cancellation rate descending, then channel name ascending.",
        solution: "SELECT c.name AS channel, COUNT(*) AS total_bookings, SUM(CASE WHEN r.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled, ROUND(100.0 * SUM(CASE WHEN r.status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 1) AS cancel_rate_pct FROM reservations r JOIN channels c ON r.channel_id = c.id GROUP BY c.id, c.name ORDER BY cancel_rate_pct DESC, c.name",
        hint: "No WHERE — include all statuses. SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) counts cancellations. Multiply by 100.0 (not 100) to avoid integer division.",
      },
      {
        id: 'ha-06',
        prompt: "Calculate the Average Daily Rate (ADR) by property type for confirmed bookings. ADR = total revenue ÷ total nights across all stays for that type. Show type, stays count, total_nights, and adr (rounded to 2 decimals). Order by adr descending.",
        solution: "SELECT p.type, COUNT(r.id) AS stays, SUM(CAST(julianday(r.check_out) - julianday(r.check_in) AS INTEGER)) AS total_nights, ROUND(SUM(r.total_revenue) / SUM(julianday(r.check_out) - julianday(r.check_in)), 2) AS adr FROM reservations r JOIN properties p ON r.property_id = p.id WHERE r.status = 'confirmed' GROUP BY p.type ORDER BY adr DESC",
        hint: "ADR for a group = SUM(revenue) / SUM(nights) — not AVG(adr per booking). SUM(julianday(out) - julianday(in)) gives total nights across all bookings.",
      },
      {
        id: 'ha-07',
        prompt: "Revenue attribution — Method 1 (First Night): Assign each confirmed booking's full revenue to its check_in date. Show revenue_date and revenue (rounded to 2 decimals), ordered chronologically.",
        solution: "SELECT check_in AS revenue_date, ROUND(SUM(total_revenue), 2) AS revenue FROM reservations WHERE status = 'confirmed' GROUP BY check_in ORDER BY revenue_date",
        hint: "The revenue_date is simply check_in. GROUP BY check_in. SUM total_revenue per date.",
      },
      {
        id: 'ha-08',
        prompt: "Revenue attribution — Method 2 (Last Night): Assign each confirmed booking's full revenue to its last night stayed (the day before check_out). Show revenue_date and revenue (rounded to 2 decimals), ordered chronologically.",
        solution: "SELECT DATE(check_out, '-1 day') AS revenue_date, ROUND(SUM(total_revenue), 2) AS revenue FROM reservations WHERE status = 'confirmed' GROUP BY DATE(check_out, '-1 day') ORDER BY revenue_date",
        hint: "Last night = DATE(check_out, '-1 day'). A check_out of Jan 8 means Jan 7 was the last night.",
      },
      {
        id: 'ha-09',
        prompt: "Revenue attribution — Method 3 (Per Night): Distribute each confirmed booking's revenue equally across all its nights using a recursive CTE. Show revenue_date and revenue (rounded to 2 decimals), ordered chronologically.",
        solution: "WITH RECURSIVE nights AS (SELECT id, check_in AS night, check_out, total_revenue / CAST(julianday(check_out) - julianday(check_in) AS REAL) AS nightly_rev FROM reservations WHERE status = 'confirmed' UNION ALL SELECT n.id, DATE(n.night, '+1 day'), n.check_out, n.nightly_rev FROM nights n WHERE DATE(n.night, '+1 day') < n.check_out) SELECT night AS revenue_date, ROUND(SUM(nightly_rev), 2) AS revenue FROM nights GROUP BY night ORDER BY revenue_date",
        hint: "Recursive CTE: base = one row per reservation at check_in. Recursive step: DATE(night, '+1 day') while that date < check_out. nightly_rev = total_revenue / CAST(julianday(out) - julianday(in) AS REAL).",
      },
      {
        id: 'ha-10',
        prompt: "The Guesty interview question: Calculate total confirmed revenue in 3 different ways — attributed to the first night, the last night, and distributed per night using a recursive CTE. Show method (as 'first_night', 'last_night', 'per_night') and total_revenue (rounded to 2 decimals). All three totals should be equal — that is the expected result.",
        solution: "WITH RECURSIVE nights AS (SELECT id, check_in AS night, check_out, total_revenue / CAST(julianday(check_out) - julianday(check_in) AS REAL) AS nightly_rev FROM reservations WHERE status = 'confirmed' UNION ALL SELECT n.id, DATE(n.night, '+1 day'), n.check_out, n.nightly_rev FROM nights n WHERE DATE(n.night, '+1 day') < n.check_out) SELECT 'first_night' AS method, ROUND(SUM(total_revenue), 2) AS total_revenue FROM reservations WHERE status = 'confirmed' UNION ALL SELECT 'last_night', ROUND(SUM(total_revenue), 2) FROM reservations WHERE status = 'confirmed' UNION ALL SELECT 'per_night', ROUND(SUM(nightly_rev), 2) FROM nights ORDER BY method",
        hint: "One WITH RECURSIVE CTE at the top for the per-night calculation. Three SELECT statements joined by UNION ALL: first_night and last_night both SUM from reservations directly; per_night SUMs from the nights CTE. ORDER BY method.",
      },
    ],
  },
  {
    id: 'glovo',
    title: 'Glovo Interview Prep',
    description: 'Food delivery analytics — the exact SQL skills tested in the Glovo Data/ML Engineer live interview',
    tables: ['glovo_restaurants', 'glovo_couriers', 'glovo_customers', 'glovo_orders'],
    lesson: {
      intro: 'The Glovo live interview tests data manipulation at pace: joins, aggregations, window functions, and time-based analysis. All exercises use a food-delivery dataset (glovo_orders, glovo_restaurants, glovo_couriers, glovo_customers) that mirrors the real domain.',
      concepts: [
        {
          title: 'Delivery time in SQLite',
          body: 'SQLite has no DATEDIFF(). Use julianday() to subtract two datetime strings. Multiply by 1440 to get minutes.',
          code: `SELECT id,
  ROUND((julianday(delivered_at) - julianday(ordered_at)) * 24 * 60) AS delivery_minutes
FROM glovo_orders
WHERE status = 'delivered'`,
        },
        {
          title: 'STRFTIME for time-of-day analysis',
          body: "Extract the hour from a datetime string with STRFTIME('%H', col). Returns a zero-padded string: '08', '13', '20'.",
          code: `SELECT STRFTIME('%H', ordered_at) AS hour, COUNT(*) AS orders
FROM glovo_orders
GROUP BY hour
ORDER BY orders DESC`,
        },
        {
          title: 'RANK() vs DENSE_RANK() within a partition',
          body: 'RANK() leaves gaps after ties (1,1,3). DENSE_RANK() does not (1,1,2). Use PARTITION BY city to rank within each city independently.',
          code: `SELECT name, city, deliveries,
  RANK()       OVER (PARTITION BY city ORDER BY deliveries DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY city ORDER BY deliveries DESC) AS dense_rnk
FROM courier_stats`,
        },
        {
          title: 'Conditional aggregation',
          body: 'Compute several metrics in one pass with SUM(CASE WHEN ...). Avoids expensive subqueries and extra GROUP BYs.',
          code: `SELECT city,
  COUNT(*) AS total_orders,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
  ROUND(100.0 * SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 1) AS cancel_pct
FROM glovo_orders
GROUP BY city`,
        },
        {
          title: 'CTE + window function pattern',
          body: 'Aggregate in a CTE, then apply the window function in the outer SELECT. Readable and lets you reference the aggregated column by its alias.',
          code: `WITH stats AS (
  SELECT courier_id, COUNT(*) AS deliveries
  FROM glovo_orders WHERE status = 'delivered'
  GROUP BY courier_id
)
SELECT courier_id, deliveries,
  RANK() OVER (ORDER BY deliveries DESC) AS overall_rank
FROM stats`,
        },
      ],
    },
    exercises: [
      {
        id: 'gl-01',
        prompt: "Order summary by city. Show city, total_orders (all statuses), delivered count, and revenue (SUM of total_amount for delivered orders only, rounded to 2 decimals). Order alphabetically by city.",
        solution: "SELECT city, COUNT(*) AS total_orders, SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered, ROUND(SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END), 2) AS revenue FROM glovo_orders GROUP BY city ORDER BY city",
        hint: "No JOIN needed — city is in glovo_orders. COUNT(*) for total. SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) for delivered count. SUM(CASE WHEN ... THEN total_amount ELSE 0 END) for revenue.",
      },
      {
        id: 'gl-02',
        prompt: "Average delivery time by city. For delivered orders only, compute the mean delivery time in minutes (use julianday, round to 1 decimal) as avg_minutes. Order by avg_minutes ascending.",
        solution: "SELECT city, ROUND(AVG((julianday(delivered_at) - julianday(ordered_at)) * 24 * 60), 1) AS avg_minutes FROM glovo_orders WHERE status = 'delivered' GROUP BY city ORDER BY avg_minutes",
        hint: "(julianday(delivered_at) - julianday(ordered_at)) * 24 * 60 gives minutes per row. Wrap in AVG() and ROUND to 1 decimal. Filter WHERE status = 'delivered' before GROUP BY.",
      },
      {
        id: 'gl-03',
        prompt: "Top 3 restaurants by delivered revenue. JOIN glovo_orders with glovo_restaurants. Show name, category, order count (as orders), and revenue (SUM of total_amount, rounded to 2 decimals). Return only the top 3.",
        solution: "SELECT r.name, r.category, COUNT(*) AS orders, ROUND(SUM(o.total_amount), 2) AS revenue FROM glovo_orders o JOIN glovo_restaurants r ON o.restaurant_id = r.id WHERE o.status = 'delivered' GROUP BY r.id, r.name, r.category ORDER BY revenue DESC LIMIT 3",
        hint: "JOIN glovo_restaurants r ON o.restaurant_id = r.id. WHERE status = 'delivered'. GROUP BY r.id. ORDER BY revenue DESC LIMIT 3.",
      },
      {
        id: 'gl-04',
        prompt: "Courier leaderboard. For delivered orders, JOIN with glovo_couriers and show courier name, city, vehicle, and deliveries count. Order by deliveries descending, then name ascending (to break ties deterministically).",
        solution: "SELECT c.name, c.city, c.vehicle, COUNT(*) AS deliveries FROM glovo_orders o JOIN glovo_couriers c ON o.courier_id = c.id WHERE o.status = 'delivered' GROUP BY c.id, c.name, c.city, c.vehicle ORDER BY deliveries DESC, c.name",
        hint: "JOIN glovo_couriers c ON o.courier_id = c.id. WHERE status = 'delivered'. GROUP BY c.id. The secondary ORDER BY c.name breaks ties between couriers with equal deliveries.",
      },
      {
        id: 'gl-05',
        prompt: "Cancellation rate by city. Show city, total_orders, cancelled count, and cancel_rate_pct (percentage, rounded to 1 decimal). Order by cancel_rate_pct descending.",
        solution: "SELECT city, COUNT(*) AS total_orders, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled, ROUND(100.0 * SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 1) AS cancel_rate_pct FROM glovo_orders GROUP BY city ORDER BY cancel_rate_pct DESC",
        hint: "No WHERE filter — include all statuses. Use 100.0 (not 100) to force floating-point division. SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) in both the numerator and as the cancelled column.",
      },
      {
        id: 'gl-06',
        prompt: "Rank couriers within their city by number of delivered orders. Use a CTE to compute per-courier delivery counts (joining glovo_couriers), then apply RANK() OVER (PARTITION BY city ORDER BY deliveries DESC). Show name, city, deliveries, city_rank. Order by city, city_rank, name.",
        solution: "WITH courier_stats AS (SELECT o.courier_id, c.name, c.city, COUNT(*) AS deliveries FROM glovo_orders o JOIN glovo_couriers c ON o.courier_id = c.id WHERE o.status = 'delivered' GROUP BY o.courier_id, c.name, c.city) SELECT name, city, deliveries, RANK() OVER (PARTITION BY city ORDER BY deliveries DESC) AS city_rank FROM courier_stats ORDER BY city, city_rank, name",
        hint: "CTE computes (courier_id, name, city, deliveries). Outer SELECT adds RANK() OVER (PARTITION BY city ORDER BY deliveries DESC). Note: RANK() creates gaps on ties — two couriers with rank 1 mean the next rank is 3.",
      },
      {
        id: 'gl-07',
        prompt: "Peak order hours. Extract the hour from ordered_at using STRFTIME('%H', ordered_at) as hour. Show each hour and its order_count. Order by order_count descending, then hour ascending.",
        solution: "SELECT STRFTIME('%H', ordered_at) AS hour, COUNT(*) AS order_count FROM glovo_orders GROUP BY hour ORDER BY order_count DESC, hour",
        hint: "STRFTIME('%H', ordered_at) extracts the 2-digit hour as a string. GROUP BY hour (the alias works in SQLite). Secondary ORDER BY hour keeps ties deterministic.",
      },
      {
        id: 'gl-08',
        prompt: "Premium customer lifetime value. JOIN glovo_orders with glovo_customers. For delivered orders where premium = 1, show customer_id, city, and lifetime_value (SUM of total_amount, rounded to 2 decimals). Order by lifetime_value descending.",
        solution: "SELECT o.customer_id, c.city, ROUND(SUM(o.total_amount), 2) AS lifetime_value FROM glovo_orders o JOIN glovo_customers c ON o.customer_id = c.id WHERE o.status = 'delivered' AND c.premium = 1 GROUP BY o.customer_id, c.city ORDER BY lifetime_value DESC",
        hint: "JOIN glovo_customers c ON o.customer_id = c.id. WHERE status = 'delivered' AND c.premium = 1. Customers whose only orders were cancelled will not appear in this result.",
      },
    ],
  },
];
