CREATE DATABASE employee_tracker_db

USE employee_tracker_db

CREATE TABLE department (id,name) {
    id INT NOT NULL AUTO_INCRAMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
};

CREATE TABLE role (id, title, salary, department_id) {
    id INT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary VARCHAR(30) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
    PRIMARY KEY (id)
};

CREATE TABLE employee (id, first_name, last_name, role_id, manager_id) {
    id INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30 NOT NULL),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    PRIMARY KEY (id)
};