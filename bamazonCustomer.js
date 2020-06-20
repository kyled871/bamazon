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
    showItems()
    // start();

});

function showItems() {
    connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;


        let allItems = () => {
            console.log("*** Welcome to Bamazon! ***")
            response.forEach(items => {
                console.log(`ID: ${items.item_id}\nItem: ${items.product_name}\nDept Name: ${items.department_name}\nPrice: ${items.price}\n\n`)
            });
        }
        allItems()

        connection.end();
      });

}


// function start() {

//     inquirer.prompt([
//         {



//         }
//     ])

// }
