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

CREATE TABLE departments(
    department_id INT AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs INT NOT NULL
    PRIMARY KEY(department_id)
);