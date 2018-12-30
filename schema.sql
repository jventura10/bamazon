CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    product_name VARCHAR(70) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(7,2) NOT NULL,
    stock_quantity INTEGER(6),
    item_id INT AUTO_INCREMENT,
    PRIMARY KEY(item_id)
);

