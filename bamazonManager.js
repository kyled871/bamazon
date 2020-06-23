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

            let managersAnswer = answers.options

            switch (managersAnswer) {
                case 'View Products for Sale':
                console.log('here are the products')
                    break;

                case 'View Low Inventory':
                    console.log('here is the low inventory')
                    break;

                case 'Add to Inventory':
                    console.log('added to inventory')
                    break;

                case 'Add New Product':
                    console.log('add to products!')
                    break;
            
                default:
                    break;
            }

        })
        
    }
    optionChoices()



}