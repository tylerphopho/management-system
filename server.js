const inquirer = require("inquirer");
const mysql = require("mysql");
const ctable = require("console.table");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
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

            case "View All Employees by Department":
            viewDepartments();
            break;

            case "View All Employees by Manager":
            viewManagers();
            break;
        }
    });
};

function viewEmployees() {
    let query = 
    "SELECT EM.employee_id, EM.first_name, EM.last_name, RL.title, DP.department_name, RL.salary, MG.manager_name ";
    query += 
        "FROM Employee as EM LEFT JOIN Role as RL ON EM.role_id = RL.role_id ";
    query += "LEFT JOIN Department as DP on RL.department_id = DP.department_id ";
    query += "LEFT JOIN Manager as MG on EM.manager_id = MG.manager_id";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        start();
    });
};

function viewDepartments() {
    let query = "SELECT * FROM Department";
    connection.query(query, function(err, res){
        if (err) throw err;
        // Displays the departments options
        inquirer.prompt({
            name: "Department",
            type: "list",
            message: "Listing All Departments",
            choices: function() {
                let departmentArray = [];
                for (let i = 0; i < res.length; i++) {
                    departmentArray.push(res[i].department_name);
                }
                return departmentArray;
            }
        })
        .then(function(choices){
            console.log(choices)
            // With the option chosen; displays the choice.
            let query = 
            "SELECT EM.employee_id, EM.first_name, EM.last_name, RL.title, DP.department_name, RL.salary, EM.manager_id ";
            query += 
            "FROM Employee as EM INNER JOIN Role as RL ON EM.role_id = RL.role_id ";
            query += 
            "INNER JOIN Department as DP on RL.department_id = DP.department_id ";
            query += "WHERE DP.department_name = ?";
            connection.query(query, [choices.Department], function(err, res){
                console.log(choices.Department);
                console.table(res);
                start();
            });
        });
    });
};

function viewManagers() {
    let query = "SELECT Manager.manager_id, Manager.manager_name FROM Manager";
    connection.query(query, function(err, res){
        if (err) throw err;
        inquirer.prompt({
            name: "Manager",
            type: "list",
            message: "Listing All Managers",
            choices: function() {
                let managerArray = [];
                for (let i = 0; i < res.length; i++) {
                    managerArray.push(res[i].manager_name);
                }
                return managerArray;
            }
        })
        .then(function(choices){
            console.log(choices)
            let query = 
            "SELECT EM.employee_id, EM.first_name, EM.last_name, RL.title, DP.department_name, RL.salary ";
            query +=
            "FROM Employee as EM INNER JOIN Role as RL ON EM.role_id = RL.role_id ";
            query +=
            "INNER JOIN Department as DP on RL.department_id = DP.department_id ";
            query +=
            "INNER JOIN Manager as MG on MG.manager_id = EM.manager_id ";
            query +=
            "WHERE MG.manager_name = ?";
            connection.query(query, [choices.Manager], function(err,res){
                console.log(choices.Manager);
                console.table(res);
                start();
            });
        });
    });
};