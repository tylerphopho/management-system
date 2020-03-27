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
            "View ALl Managers",
            "View All Departments",
            "View All Roles",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
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

            case "View All Managers":
            allManagers();
            break;

            case "View All Departments":
            allDepartments();
            break;

            case "View All Roles":
            allRoles();
            break;

            case "Add Employee":
            addEmployee();
            break;

            case "Remove Employee":
            removeEmployee();
            break;

            case "Update Employee Role":
            updateRole();
            break;
            
            case "View All Roles":
            viewRoles();
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
            name: "EMManager",
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
            connection.query(query, [choices.EMManager], function(err,res){
                console.log(choices.EMManager);
                console.table(res);
                start();
            });
        });
    });
};
// Function to view all managers.
function allManagers() {
    let query = "SELECT Manager.manager_id, Manager.manager_name FROM Manager";
    connection.query(query, function(err,res){
        if(err) throw err;
        console.table(res);
        start();
    });
};

// Function to view all departments.
function allDepartments() {
    let query = "SELECT Department.department_id, Department.department_name FROM Department";
    connection.query(query, function(err,res){
        if(err) throw err;
        console.table(res);
        start();
    });
};

// Function to view all departments.
function allRoles() {
    let query = "SELECT Role.role_id, Role.title, Role.salary FROM Role";
    connection.query(query, function(err,res){
        if(err) throw err;
        console.table(res);
        start();
    });
};

function addEmployee() {
    let query = "SELECT * FROM Role ";
    let mgQuery = "SELECT * FROM Manager ";
    connection.query(query, function(err, res){
        if (err) throw err;
        connection.query(mgQuery, function(mgErr, mgRes){
            if (mgErr) throw err;
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is their first name?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is their last name?"
                },
                {
                    name: "roles",
                    type: "list",
                    message: "What is their role?",
                    choices: function() {
                        let roleArray = []
                        for(let i = 0; i < res.length; i++) {
                            roleArray.push(`${res[i].role_id}: ${res[i].title}`)
                        }
                        return roleArray;
                    }
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is their manager?",
                    choices: function() {
                        let managerArray = []
                        for(let i = 0; i < mgRes.length; i++) {
                            managerArray.push(`${mgRes[i].manager_id}: ${mgRes[i].manager_name}`)
                        }
                        return managerArray;
                    }
                }
                
            ])
            .then(function({first_name, last_name, roles, manager}){
                let roleArray = (roles.split(": "));
                let managerArray = (manager.split(": "));
                let query = "INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)"
                connection.query(query,[first_name, last_name, roleArray[0], managerArray[0]], function(err){
                    console.log(roles);
                    if(err) throw err;
                    console.log(first_name)
                    console.log(manager);
                    console.table(res);
                    start();
                });
            });
        });
    });
};

function removeEmployee() {
    let query = "SELECT employee_id, first_name, last_name from Employee ";
    connection.query(query, function(err, res){
        if (err) throw err;
        inquirer.prompt({
            name: "employee",
            type: "list",
            message: "Which Employee do you wish to remove?",
            choices: function() {
                let employeeArray = []
                for(let i = 0; i < res.length; i ++) {
                    employeeArray.push(`${res[i].employee_id}: ${res[i].first_name} ${res[i].last_name}`);
                }
                return employeeArray;
            }
        })
        .then(function(choice){
            let choiceArray = (choice.employee.split(": "));
            let deleteQuery = "DELETE FROM Employee WHERE employee.employee_id = ?";
            connection.query(deleteQuery, [choiceArray[0]], function(err){
                if (err) throw err;
                console.log("Employee removed.");
                start();
            });
        });
    });
};

function updateRole() {
    let employeeQuery = "SELECT * FROM Employee";
    let roleQuery = "SELECT * FROM Role";
    connection.query(employeeQuery, function(err, emRes){
        if (err) throw err;
        connection.query(roleQuery, function(err, rlRes){
            if (err) throw err;
            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    choices: function(){
                        let employeeArray = []
                        for(let i = 0; i < emRes.length; i++){
                            employeeArray.push(`${emRes[i].employee_id}: ${emRes[i].first_name} ${emRes[i].last_name}`);
                        }
                        return employeeArray;
                    }
                },
                {
                    name: "role",
                    type: "list",
                    message: "Choose their new role",
                    choices: function() {
                        let roleArray = []
                        for (let i = 0; i < rlRes.length; i++){
                            roleArray.push(`${rlRes[i].role_id}: ${rlRes[i].title}`);
                        }
                        return roleArray;
                    }
                }
            ])
            .then(function(choice){
                let employeeArray = (choice.employee.split(": "));
                let roleArray = (choice.role.split(": "));
                console.log(employeeArray);
                console.log(roleArray);
                let updateQuery = "UPDATE Employee SET Employee.role_id = ? WHERE Employee.employee_id = ? ";
                connection.query(updateQuery, [roleArray[0],employeeArray[0]],
                    function(err){
                        if (err) throw err;
                    }
                );
                start();
            });
        });
    });
};