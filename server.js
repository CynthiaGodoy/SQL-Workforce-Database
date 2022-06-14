// DEPENDENCIES (IMPORT AND REQUIRE)
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');
require("dotenv").config();

// MYSQL WORKBENCH, 3306 DEFAULT PORT, .env PASSWORD, DATABASE
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "employee_db"
});

connection.connect(err => {
    if (err) throw err;
    inquire();
});

//SIGNAL INQUIRER TO PROMPT QUESTIONS IN TERMINAL | BASED ON ANSWERS IT DIRECTS TO QUERIES
function inquire() {
    inquirer
        .prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            "View All Departments",
            "Add a Department",
            "Delete Department",
            "View All Roles",
            "Add a Role",
            "Delete Role",
            "View All Employees",
            "Add an Employee",
            "Delete Employee",
            "Update an Employee Role",
            ]
        })
        .then((answers) => {
            switch (answers.action) {
                case "View All Departments":
                    viewDepartments();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Delete Department":
                    deleteRow("department");
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Delete Role":
                    deleteRow("role");
                    break;
                case "View All Employees":
                    viewEmployees();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Delete Employee":
                    deleteRow("employee");
                    break;
                case "Update an Employee Role":
                    updateEmployee();
                    break;
            }
        });
}

//VIEW ALL DEPARTMENTS 
function viewDepartments() {
    connection.query("SELECT * FROM department;", function (err, res) {
        if (err) throw err;
        console.table("Departments", res);
        inquire();
    });
}

//ADD A DEPARTMENT
function addDepartment() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the new department?"
        })
        .then((answers) => {
            var query = "INSERT INTO department SET ?";
            connection.query(query, {
                name: answers.name
            }, function (err, res) {
                if (err) throw err;

                viewDepartments();
            });
        });
}

//VIEW ALL ROLES
function viewRoles() {
    connection.query("SELECT * from role;", function (err, res) {
        if (err) throw err;
        console.table("Roles", res);
        inquire();
    });
}

//ADD A ROLE
function addRole() {
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "What is the title of the new role?"
        }, {
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?"
        }, {
            name: "department_id",
            type: "input",
            message: "What is the Department ID of the new role?"
        }])
        .then((answers) => {
            var query = "INSERT INTO role SET ?";
            connection.query(query, {
                title: answers.title,
                salary: parseFloat(answers.salary),
                department_id: parseInt(answers.department_id)
            }, function (err, res) {
                if (err) throw err;

                viewRoles();
            });
        });
}

//VIEW ALL EMPLOYEES
function viewEmployees() {
    connection.query("SELECT * FROM employee;", function (err, res) {
        if (err) throw err;
        console.table("Employees", res);
        inquire();
    });
}

//ADD EMPLOYEES
function addEmployee() {
    inquirer
        .prompt([{
            name: "first_name",
            type: "input",
            message: "What is the first name of the new employee?"
        }, {
            name: "last_name",
            type: "input",
            message: "What is the last name of the new employee?"
        }, {
            name: "role_id",
            type: "input",
            message: "What is the role ID of the new employee?"
        }, {
            name: "manager_id",
            type: "input",
            message: "What is the employee ID of the new employee's manager (if any?)?"
        }])
        .then((answers) => {
            var query = "INSERT INTO employee SET ?";
            connection.query(query, {
                first_name: answers.first_name,
                last_name: answers.last_name,
                role_id: parseInt(answers.role_id),
                manager_id: parseInt(answers.manager_id)
            }, function (err, res) {
                if (err) throw err;

                viewEmployees();
            });
        });
    }

//DELETE ROLE, EMPLOYEE, OR DEPARTMENT
function deleteRow(table) {

    let query;
    console.log(table);
    switch (table) {
        case "department":
            query = "SELECT * FROM department;";
            break;
        case "role":
            query = "SELECT * from role;";
            break;
        case "employee":
            query = "SELECT * FROM employee;";
            break;
    }

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);

        inquirer
            .prompt([{
                name: "id",
                type: "input",
                message: "Enter the ID of a row to delete:",
            }]).then((answers) => {
                const Delete = "DELETE FROM " + table + " WHERE ID = " + answers.id;
                connection.query(Delete, function (err, res) {
                    if (err) throw err;
                });

                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log("ID " + answers.id + " deleted.");
                });

                inquire();
            });
    });
}

//UPDATE EMPLOYEE ROLE
function updateEmployee() {
    let queryEmployee = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;

    connection.query(queryEmployee, function (err, res) {
        if (err) throw err;
        console.table("Enter the ID of the employee that you would like to update:", res);
    });

    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Enter the ID of the employee that you would like to update:",
        }, {
            name: "column",
            type: "rawlist",
            message: "What would you like to change about this employee?",
            choices: [
                "role",
                "manager",
            ]
        }])
        .then((answers) => {
            const column = answers.column;
            const employeeID = answers.id;

            switch (column) {
                case "role":
                    connection.query("SELECT * from role;", function (err, res) {
                        if (err) throw err;
                        console.table("Select the ID of the role that you would like to assign the employee to:", res);
                    });
                    break;
                case "manager":
                    connection.query(queryEmployee, function (err, res) {
                        if (err) throw err;
                        console.table("Select the ID of the manager that you would like to assign the employee to:", res);
                    });
                    break;
            }

            inquirer
                .prompt([{
                    name: "id",
                    type: "input",
                    message: "Enter the ID of the " + column + " that you would like to assign the employee to:",
                }]).then((answers) => {
                    let Update;

                    if (answers.id === "") {
                        Update = "UPDATE employee SET " + column + "_id = null";
                    } else {
                        Update = "UPDATE employee SET " + column + "_id = " + parseInt(answers.id);
                    }

                    Update += " WHERE id = " + employeeID;

                    connection.query(Update, function (err, res) {
                        if (err) throw err;
                    });

                    connection.query(queryEmployee, function (err, res) {
                        if (err) throw err;
                        console.table("Employees", res);
                        inquire();
                    });
                });
        });
}
