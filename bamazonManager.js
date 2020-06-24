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


// starts managerView function upon connection ----------
connection.connect(function(err) {
    if (err) throw err;

    console.log(`Connected as id ${connection.threadId}. \n`);
    startManagerView();

});


// functions for each choice opens automatically with startManagerView function --------------------------------
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


// returns all products in mysql database ------------------------
function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log(`\nHere are the current products for sale: \n\n`);
        res.forEach(item => {
            console.log(`ID: ${item.item_id}\nItem: ${item.product_name}\nPrice: ${item.price}\nQty: ${item.stock_quantity}\n\n`);      
        });
        endBamazon();
    });

};


// returns all products in database with a stock_quantity lower than 20 ------------------
function lowInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log(`\nThese products need restocking: \n\n`);
        res.forEach(item => {
            if (item.stock_quantity < 20) {
                console.log(`ID: ${item.item_id}\nItem: ${item.product_name}\nPrice: ${item.price}\nQty: >>> ${item.stock_quantity} <<< --- LOW!\n\n`);
            }
        });

        endBamazon();
    });

};


// updates database stock_quantity value with user input ------------------
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

            });

        });

    })

};


// adds a new row with column data to database --------------
function addProduct() {

    console.log(`Please enter the new product: \n`);

    inquirer.prompt([

        {
            type: 'input',
            name: 'product_name',
            message: 'Product Name: '
        },

        {
            type: 'input',
            name: 'department_name',
            message: 'Dept Name: '
        },

        {
            type: 'input',
            name: 'price',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            },
            message: 'Price: '
        },

        {
            type: 'input',
            name: 'stock_quantity',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            },
            message: 'Set Initial Stock: '
        }

    ]).then(function(answers) {

        let productName = answers.product_name;
        let deptName = answers.department_name;
        let setPrice = parseInt(answers.price);
        let initStock = parseInt(answers.stock_quantity);

        console.log(productName)

        connection.query(
            "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
            [
                productName,
                deptName,
                setPrice,
                initStock,

            ],function(err) {
                if (err) throw err;
                console.log(`\nSuccess!\n${productName} has been added!`);
                endBamazon()
            }

        )

    })

};


// function is ran at the end of every tasks to ask user if the need to select another option or end connection --------------
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