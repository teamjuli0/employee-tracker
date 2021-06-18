USE employee_tracker_db;

INSERT INTO department(name) VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role(title, salary, department_id) VALUES 
("Sales Lead", 50000, 1),
("Salesperson", 20000, 1),
("Lead Engineer", 100000, 2),
("Software Engineer", 70000, 2),
("Accountant", 50000, 3),
("Legal Team Lead", 140000, 4),
("Lawyer", 110000, 4)

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES 
("Tommy", "Franks", 1, NULL),
("Jackie", "Chan", 2, 1),
("Andrew", "Jamster", 3, NULL),
("Donald", "Duck", 4, 3),
("Will", "Smith", 5, NULL),
("Robert", "Kardashian", 6, NULL),
("Kim", "Kardashian", 6, 6)