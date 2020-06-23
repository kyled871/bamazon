var inquirer = require('inquirer');
var mysql = require('mysql2');
require('dotenv').config();
let connection = mysql.createConnection({

    host: "localhost",
    port: "3306",
    user: "root",
    password: process.env.password,
    database: "bamazon_db",

});

connection.connect(function(err) {
    if (err) throw err;

    console.log(`Connected as id ${connection.threadId}. \n`);
    startManagerView();
    

});

function startManagerView() {

    function optionChoices() {
        console.log(`\nWelcome Bamazon Manager!\n`)
        inquirer.prompt([
            {
                name: 'options',
                type: 'list',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
                message: 'Please choose an option:'
            }
            
        ]).then(function(answers) {

            console.log(answers)


        })
        
    }
    optionChoices()



}