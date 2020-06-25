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


// start function is ran on initial connection -------------
connection.connect(function(err) {
    if (err) throw err;

    console.log(`Connected as id ${connection.threadId}. \n`);
    startBamazon()
    // start();

});


// function runs a query to mysql returning all current items -------------
function startBamazon() {
    connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;

        console.log("\n*** Welcome to Bamazon! ***\n\n")

        // let showAllItems = () => {
        //     
        //     response.forEach(items => {
        //         console.log(`ID: ${items.item_id}\nItem: ${items.product_name}\nDeptartment: ${items.department_name}\nPrice: ${items.price}\nQty: ${items.stock_quantity}\n\n`)
        //     });
        // }
        // showAllItems()
        itemChoose()


        // inquirer returns a list of which item the user would like to buy ---------------
        function itemChoose() {
        
            inquirer.prompt([
                
                {
                    name: "productID",
                    type: "rawlist",
                    choices: function() {
                        let choiceArr = [];
                        response.forEach(items => {
                            choiceArr.push(items.product_name)
                        })
                        return choiceArr;
                    },
                    message: "Please select the item ID you wish to purchase: ",
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
                
                // for loop matches the selected items from the users input and matches with database item -----------
            ]).then(function(answers) {
                connection.query("SELECT * FROM products", function(err , results) {


                    let itemID = answers.productID;
                    let userQty = parseInt(answers.quantity);

                    let chosenItem;
                    let currentQty;

                    if (err) throw err;

                    for (i = 0; i < results.length; i++) {
                        if (itemID === results[i].product_name) {
                            chosenItem = results[i];
                            currentQty = results[i].stock_quantity
                            
                        }

                    }


                    // if input is valid product is "purchased" and stock quanitity of item is reflected --------------
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


// function ran at the end of the transaction to check if user would like to make another ---------------
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