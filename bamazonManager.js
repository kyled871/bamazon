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

        let managerAnswer = answers.options

        switch (managerAnswer) {
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
    connection.query("SELECT * FROM products", function(err, res) {

        inquirer.prompt([

            {
                name: "productID",
                type: "rawlist",
                choices: function() {
                    let choiceArr = [];
                    res.forEach(items => {
                        choiceArr.push(items.product_name)
                    })
                    return choiceArr;
                },
                message: "Add inventory to which item?: ",
            },

            {
                name: "addQty",
                type: 'input',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
                message: `Add qty amount: `
            }

        ]).then(function(answer) {
            connection.query("SELECT * FROM products", function(err, res) {
                let itemID = answer.productID;
                let userQty = parseInt(answer.addQty);
                let chosenItem;
                let currentQty;

                if (err) throw err;

                res.forEach(item => {
                    if (itemID === item.product_name) {
                        chosenItem = item;
                        currentQty = item.stock_quantity;
                    }
                })
                
                if (userQty > 0) {

                    connection.query(
                        "UPDATE products SET ? WHERE ?" ,
                        [

                            {
                                stock_quantity: currentQty + userQty
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function(err) {
                            if (err) throw err;
                            console.log(`\n${chosenItem.product_name} qty has been updated!`);
                            console.log(`Current Qty is now: ${currentQty + userQty}\n--------------------\n`);
                            endBamazon();
                        });

                } else {
                    console.log(`Qty is invalid. Please try again.`)
                    addInventory()
                }
            })



        })




    })

};

function addProduct() {

};


function endBamazon() {

    inquirer.prompt([

        {
            type: 'confirm',
            name: 'exit',
            message: 'Select another option?',
            default: true
        }

    ]).then(function(answers) {

        if (answers.exit) {
            startManagerView();
        } else {
            console.log(`\n--------------------------------------\n*** Bamazon Thanks You! ***\n--------------------------------------\n`);
            connection.end();
        }
    })
}