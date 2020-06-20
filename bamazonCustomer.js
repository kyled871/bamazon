var inquirer = require('inquirer');
var mysql = require('mysql2');

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


        // must end connection when done
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
                
            ]).then(function(answer) {



            })
        
        }
    });

}


