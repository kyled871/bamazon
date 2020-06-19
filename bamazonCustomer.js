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
    start();

});


function start() {

    console.log('gh test.')

}
