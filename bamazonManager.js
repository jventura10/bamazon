//Packages Used
const mysql = require("mysql");
const inquirer = require("inquirer");

//Empty Array to Hold Product Names and Used as Choices in Inquirer Question
var productList = [];

//Create Connection to Database
var connection = mysql.createConnection({
    host: "localhost",

    //Port
    port: 3306,

    //Username
    user: "root",

    // Password
    password: "passwordHere",
    //Database Name
    database: "bamazon"
});

/* 
    ==================================================================
    Main Menu Function
    - Prompts User to Choose What They Want to do or Exit 
    - Calls Seperate Functions to Handle Requests Based on Response
    ==================================================================
*/
function mainMenu() {
    //Use Inquirer to ask User What They Would Like to do
    inquirer
        .prompt([
            {
                type: "list",
                message: "Welcome Manager, What are you Doing?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
                name: "menu"
            }
        ]).then(function (inquirerResponse) {
            //User Chose to View all Products in DB
            if (inquirerResponse.menu === "View Products for Sale") {
                showProducts();
            }
            //User Chose to see all Products That Have low Stock Counts
            else if (inquirerResponse.menu === "View Low Inventory") {
                lowInventory();
            }
            //User Chose to Order More of an Item
            else if (inquirerResponse.menu === "Add to Inventory") {
                fillList();
            }
            //User Chose to add a new Product to DB
            else if (inquirerResponse.menu === "Add New Product") {
                addProduct();       
            }
            //User Chose to Exit Program
            else {
                console.log("Logging Out of Manager Portal....");   //Show Exit Message
                connection.end();       //Close Connection to DB
            }
        });
}

/* 
    ==================================================================
    Show Products Function
    - User Chose to see All Products
    - Querys Products Table in DB 
    - Lists all Results to the User
    - Redirects Back to Main Menu
    ==================================================================
*/
function showProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        //If Error Occurs
        if (err) {
            throw err;
        }

        console.log("Our Products: ");
        console.log("-----------------");
        for (var i = 0; i < res.length; i++) {
            console.log("ID - " + res[i].item_id + " Product - " + res[i].product_name + " Price - " + res[i].price);
        }
        console.log("------------------------");

        mainMenu();
    });

}

/* 
    ==================================================================
    Low Inventory Function
    - User Chose to see Products With Low Inventory
    - Returns From Query all Products Where Stock is Less Than 25
    - Redirects to Main Menu Function
    ==================================================================
*/
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=25", function (err, res) {
        //If Error Occurs
        if (err) {
            throw err;
        }

        console.log("Products With low Inventory:");
        console.log("----------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("ID - " + res[i].item_id + " Product - " + res[i].product_name + " Price - " + res[i].price);
        }
        console.log("------------------------");

        mainMenu();
    });
}

/* 
    ==================================================================
    Fill List Function
    - User Chose to Resupply 
    - Fills Product List Array With Names of all Products
    - Must be Called Before Add Inventory Function
    ==================================================================
*/
function fillList() {
    productList = [];

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            productList.push(res[i].product_name);
        }

        addInventory();
    });
}


/* 
    ==================================================================
    Add Inventory Function
    - Uses Product List and User Picks What Product to Resupply
    - User Also Enters how Many to Add
    - Calls Update Product Function to Make Change in Database
    ==================================================================
*/
function addInventory() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Choose What Product to Order for: ",
                choices: productList,
                name: "product"
            },
            {
                type: "input",
                message: "How Many do you Want to Order: ",
                name: "quantity"
            }
        ]).then(function (inquirerResponse) {
            var item = inquirerResponse.product;
            var query = "SELECT * FROM products WHERE product_name='" + item + "'";
            var amt = parseInt(inquirerResponse.quantity);

            connection.query(query, function (err, res) {
                if (err) throw err;

                var stock = res[0].stock_quantity;

                updateProduct(item, stock, amt);
            }); //Connection Query End
        });
}

/* 
    ==================================================================
    Update Product Function
    - Takes in Name of Product, Amout in Datase, Amount to Add
    - Finds the Product in Database and Updates it With new Total
    - Redirects to Main Menu
    ==================================================================
*/
function updateProduct(name, x, y) {
    var newAmt = x +y;

    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newAmt
            },
            {
                product_name: name
            }
        ],
        function (err, res) {
            console.log(res.affectedRows + " product(s) updated!\n");
            console.log("Order Completed for "+y+" "+name+"(s)");

            mainMenu();
        }
    );

}

/* 
    ==================================================================
    Add Product Function
    - User Chose to add new Product
    - User Enters Product Name, Department, Price, Stock 
    - This is Added to Products Table in DB
    ==================================================================
*/
function addProduct() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter Product Name: ",
                name: "pName"
            },
            {
                type: "input",
                message: "Enter Department Name: ",
                name: "dName"
            },
            {
                type: "input",
                message: "Enter Price: ",
                name: "price"
            },
            {
                type: "input",
                message: "Enter Stock Quantity: ",
                name: "stock"
            }
        ]).then(function (inquirerResponse) {
            var p = parseFloat(inquirerResponse.price).toFixed(2);
            var s = parseInt(inquirerResponse.stock);
            var theQuery = "INSERT INTO products(product_name,department_name,price,stock_quantity) VALUES('" + inquirerResponse.pName + "','" + inquirerResponse.dName + "'," + p + "," + s + ")";

            connection.query(theQuery, function (err, res) {
                if (err) {
                    throw err;
                }

                console.log("Added Product!");
                mainMenu();
            });
        });
}

//Call Main Menu to Initiate Program
mainMenu();