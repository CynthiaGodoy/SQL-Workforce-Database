USE employee_db;

-- TRUNCATE TABLE department;

INSERT INTO department (name)
VALUES 
('Executive'),
('Management'),
('Sales'),
('Design'),
('Technology'),
('Accounting'),
('Human Resources');

SELECT * FROM department;

-- TRUNCATE TABLE `role`;

INSERT INTO role (title,salary,department_id)
VALUES 
('CEO',20000000,1),
('Design Manager',145000,2),
('Sales Manager',165000,2),
('Salesperson',85000,3),
('Designer',95000,4),
('Tech Hiring Manager',165000,2),
('Software Engineer',105000,5),
('IT Support Analyst',85000,5),
('Accountant',55000,6),
('Human Resource Officer',65000,7);

SELECT * from `role`;

-- TRUNCATE TABLE employee;

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES 
('Princess','Leia',2,NULL),
('Yoda','The Child',4,3),
('Luke','Skywalker',7,6),
('Obiwan','Kenobi',5,2),
('Sheev','Palpatine',10,NULL);

SELECT * from employee;