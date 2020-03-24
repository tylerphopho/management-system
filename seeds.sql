DROP DATABASE IF EXISTS management_system;

CREATE DATABASE management_system;

USE management_system;

-- Creates the Database's Tables
CREATE TABLE department(
    department_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    department_name VARCHAR(30) NOT NULL   
)ENGINE=INNODB;

CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,4) NOT NULL,
    department_id INT NOT NULL,
)ENGINE=INNODB;

CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
)ENGINE=INNODB;

CREATE TABLE manager (
    manager_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    manager_name VARCHAR(30) NOT NULL,
)ENGINE=INNODB;

-- Creates Departments
INSERT INTO department(department_name) 
VALUES ("Sales"),
("Finance"), 
("Engineering"),
("Legal");

-- Creates Roles
INSERT INTO role(title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), 
("Sales Person", 80000, 2),
("Lead Engineer", 150000, 3),
("Software Engineer", 120000, 4),
("Account Manager", 130000, 5),
("Accountant", 125000, 6),
("Legal Team Lead", 25000, 7);

-- Creates Managers
INSERT INTO manager(manager_name)
VALUES ("Mandy Kham"),
("Samme Rom"),
("Ashley Smith"),
("John Doe");

-- Creates Employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Tyler", "Pho", 1, 1),
("Eddie", "Pho", 2, 2),
("Alec", "Hanley", 3, 3),
("Michale", "Bo", 4, 2);