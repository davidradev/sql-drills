export const TABLES = [
  {
    name: 'customers',
    desc: 'People who place orders in the store.',
    columns: [
      { name: 'id',            type: 'INTEGER', pk: true,  desc: 'Unique customer identifier.' },
      { name: 'name',          type: 'TEXT',               desc: 'Full name of the customer.' },
      { name: 'city',          type: 'TEXT',               desc: 'City where the customer lives.' },
      { name: 'country',       type: 'TEXT',               desc: 'Country where the customer lives.' },
      { name: 'registered_at', type: 'DATE',               desc: 'Date the customer created their account.' },
    ],
  },
  {
    name: 'products',
    desc: 'Items available for sale in the store.',
    columns: [
      { name: 'id',       type: 'INTEGER', pk: true,  desc: 'Unique product identifier.' },
      { name: 'name',     type: 'TEXT',               desc: 'Product name.' },
      { name: 'category', type: 'TEXT',               desc: 'Category the product belongs to (e.g. Electronics, Clothing).' },
      { name: 'price',    type: 'REAL',               desc: 'Current sale price per unit.' },
      { name: 'stock',    type: 'INTEGER',            desc: 'Units currently available in inventory.' },
    ],
  },
  {
    name: 'employees',
    desc: 'Internal company staff across all departments.',
    columns: [
      { name: 'id',         type: 'INTEGER', pk: true,              desc: 'Unique employee identifier.' },
      { name: 'name',       type: 'TEXT',                           desc: 'Full name of the employee.' },
      { name: 'department', type: 'TEXT',                           desc: 'Department the employee belongs to (Engineering, Sales, Marketing, etc.).' },
      { name: 'salary',     type: 'REAL',                           desc: 'Annual salary in USD.' },
      { name: 'manager_id', type: 'INTEGER', fk: 'employees',       desc: 'ID of the direct manager. NULL means the employee has no manager (top-level).' },
      { name: 'hired_at',   type: 'DATE',                           desc: 'Date the employee was hired.' },
    ],
  },
  {
    name: 'orders',
    desc: 'A purchase transaction made by a customer. One order can contain multiple products via order_items.',
    columns: [
      { name: 'id',          type: 'INTEGER', pk: true,            desc: 'Unique order identifier.' },
      { name: 'customer_id', type: 'INTEGER', fk: 'customers',     desc: 'The customer who placed this order.' },
      { name: 'status',      type: 'TEXT',                         desc: "Current state of the order: 'pending', 'shipped', 'delivered', or 'cancelled'." },
      { name: 'ordered_at',  type: 'DATE',                         desc: 'Date the order was placed.' },
    ],
  },
  {
    name: 'order_items',
    desc: 'Each row is one product line inside an order. An order has at least one item; a product can appear in many orders.',
    columns: [
      { name: 'id',         type: 'INTEGER', pk: true,            desc: 'Unique line-item identifier.' },
      { name: 'order_id',   type: 'INTEGER', fk: 'orders',        desc: 'The order this line item belongs to.' },
      { name: 'product_id', type: 'INTEGER', fk: 'products',      desc: 'The product being purchased.' },
      { name: 'quantity',   type: 'INTEGER',                      desc: 'Number of units of this product in the order.' },
      { name: 'unit_price', type: 'REAL',                         desc: 'Price per unit at the time of purchase. May differ from the current products.price.' },
    ],
  },
];
