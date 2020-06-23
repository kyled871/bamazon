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

function optionChoices() {

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
                viewProducts();
                break;

            case 'View Low Inventory':
                lowInventory();
                break;

            case 'Add to Inventory':
                addInventory();
                break;

            case 'Add New Product':
                addProduct();
                break;
        
            default:
                break;
        }

    })
    
}

function startManagerView() {

    console.log(`\nWelcome Bamazon Manager!\n`)

    optionChoices()
};


// functions for each choice --------------------------------
function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log(`\nHere are the current products for sale: \n\n`);
        res.forEach(item => {
            console.log(`ID: ${item.item_id}\nItem: ${item.product_name}\nPrice: ${item.price}\nQty: ${item.stock_quantity}\n\n`);      
        });
        optionChoices();
    });

};

function lowInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log(`\nThese products need restocking: \n\n`);
        res.forEach(item => {
            if (item.stock_quantity < 20) {
                console.log(`ID: ${item.item_id}\nItem: ${item.product_name}\nPrice: ${item.price}\nQty: >>> ${item.stock_quantity} <<< --- LOW!\n\n`);
            }
        });

        optionChoices();
    });

};

function addInventory() {

};

function addProduct() {

};