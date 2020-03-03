const inquirer = require("inquirer");
const mysql = require("mysql");
const ctable = require("console.table");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "worksheet1",
    database: "management_system"
});

connection.connect(function(err){
    if(err) throw err;
    start();
});

function start() {
    inquirer.prompt({
        name: "initial",
        type: "list",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Manager",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles"
        ]
    }).then(function(choice){
        switch(choice.initial){
            case "View All Employees":
            viewEmployees();
            break;
        }
    })
}

function viewEmployees() {
    let query = "SELECT first_name, last_name, title, salary, department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id";
    connection.query(query, function(err, data){
        if (err) throw err;
        console.table(data);
        start();
    });
}