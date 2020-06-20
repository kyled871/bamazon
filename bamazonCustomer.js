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
    startBamazon()
    // start();

});

function startBamazon() {
    connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;


        let showAllItems = () => {
            console.log("\n*** Welcome to Bamazon! ***\n\n")
            response.forEach(items => {
                console.log(`ID: ${items.item_id}\nItem: ${items.product_name}\nDeptartment: ${items.department_name}\nPrice: ${items.price}\nQty: ${items.stock_quantity}\n\n`)
            });
        }
        showAllItems()
        itemChoose()


        function itemChoose() {
        
            inquirer.prompt([
                
                {
                    name: "productID",
                    type: "input",
                    message: "Please select the item ID you wish to purchase: ",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },

                {
                    name: "quantity",
                    type: "input",
                    message: "Please select QTY: ",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
                
            ]).then(function(answers) {
                connection.query("SELECT * FROM products", function(err , results) {


                    let itemID = parseInt(answers.productID);
                    let userQty = parseInt(answers.quantity);

                    let chosenItem;
                    let currentQty;

                    if (err) throw err;

                    for (i = 0; i < results.length; i++) {
                        if (itemID === results[i].item_id) {
                            chosenItem = results[i];
                            currentQty = results[i].stock_quantity
                            
                        }

                    }


                    if (userQty <= currentQty && userQty > 0) {

                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: currentQty - userQty
                                },
                                {
                                    item_id: chosenItem.item_id
                                }
                            ],
                            function(error) {
                                if (error) throw error;
                                console.log(`\n----------------------------------\nSuccessful Order!\nEnjoy your order of ${userQty} ${chosenItem.product_name}!\n----------------------------------\n`)
                                endBamazon()
                            }

                        )

                    } else {
                        console.log(`\nSo you're telling me you want ${userQty} ${chosenItem.product_name}?\nTry again hotshot....\n\n`)
                        itemChoose()
                    }

                    
                    // if itemID doesn't exist or qty is too high return message and start over
                    if (itemID > results.length || itemID === 0) {
                        console.log(`\nSorry! Item: ${itemID} does not exist. Please select another: \n`)
                        itemChoose();
                    } else if (userQty > chosenItem.stock_quantity) {
                        console.log(`\nSorry! Your qty it too high. Only ${chosenItem.stock_quantity} left!`)
                        itemChoose();
                    } 
                    
                });


            })
        
        }

    });

}

function endBamazon() {

    inquirer.prompt([

        {
            type: 'confirm',
            name: 'exit',
            message: 'Would you like to place another order?',
            default: true
        }

    ]).then(function(answers) {

        if (answers.exit) {
            startBamazon();
        } else {
            console.log(`\n--------------------------------------\n*** Bamazon Thanks You! ***\n--------------------------------------\n`);
            connection.end();
        }
    })
}