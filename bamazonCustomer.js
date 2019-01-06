const mysql = require("mysql");
const inquirer = require("inquirer");

var productList = [];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "passwordHere",
  database: "bamazon"
});


function showProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    //console.log(res);

    console.log("Our Products: ");
    console.log("------------------");
    for (var i = 0; i < res.length; i++) {
      console.log("ID - " + res[i].item_id + " Product - " + res[i].product_name + " Price - " + res[i].price);
      productList.push(res[i].product_name);
    }
    console.log("------------------------");
    promptPurchase();

  });
}

function promptPurchase() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What Would You Like to Buy?",
        choices: productList,
        name: "product"
      },
      {
        type: "input",
        message: "Enter How Many: ",
        name: "quantity"
      }
    ]).then(function (inquirerResponse) {
      var item = inquirerResponse.product;
      var theQuery = "SELECT * FROM products WHERE product_name='" + item + "' LIMIT 1";
      var amt = parseInt(inquirerResponse.quantity);

      // console.log(item);
      // console.log(theQuery);

      connection.query(theQuery, function (err, res) {
        if (err) throw err;

        var stock = res[0].stock_quantity;
        var price=res[0].price;
        var total=amt*price;
        var ctSales=res[0].product_sales;

        if (stock > amt) {
          updateProduct(item, stock, amt, total,ctSales);
        }
        else {
          console.log("Insufficient quantity to Fulfill Order! Try Purchasing Different Amount");
        }

      }); //Connection Query End
      
    }); //Inquirer THEN Function End
}

function updateProduct(name, x, y,z,s) {
  var newAmt=x-y;
  var nwSales=s+z;

  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newAmt,
        product_sales: nwSales
      },
      {
        product_name: name
      }
    ],
    function (err, res) {
      console.log("Thank you for Your Purchase! Total: $"+z);

      connection.end();
    }
  );

}


showProducts();