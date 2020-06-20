var inquirer = require('inquirer');
var mysql = require('mysql2');
const { forEach } = require('mysql2/lib/constants/charset_encodings');

let connection = mysql.createConnection({

    host: "localhost",
    port: "3306",
    user: "root",
    password: "rootroot",
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
            console.log("*** Welcome to Bamazon! ***\n\n")
            response.forEach(items => {
                console.log(`ID: ${items.item_id}\nItem: ${items.product_name}\nDeptartment: ${items.department_name}\nPrice: ${items.price}\n\n`)
            });
        }
        showAllItems()
        itemChoose()


        // must end connection when done <<<<<<<<<<<<<<<<<<<<<<<<<<
        // connection.end();
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
                    let qty = parseInt(answers.quantity);

                    let chosenItem;
                    

                    let productQty = results.stock_quantity
                    if (err) throw err;
                    
                    for (i = 0; i < results.length; i++) {
                        if (itemID === results[i].item_id) {
                            chosenItem = results[i];
                        }

                    }
                    
                    // if itemID doesn't exist or qty is too high return message and start over
                    if (qty > chosenItem.stock_quantity) {
                        console.log(`Sorry! Your qty it too high. Only ${chosenItem.stock_quantity} left!`)
                        itemChoose();
                    }

                    if (itemID > results.length || itemID === 0) {
                        console.log(`Sorry! Item: ${itemID} does not exist. Please select another: \n`)
                        itemChoose();
                    }
                    
                });


            })
        
        }

    });

}


