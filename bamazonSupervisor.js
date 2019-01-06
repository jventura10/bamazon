//Packages Used
const mysql = require("mysql");
const inquirer = require("inquirer");
const {table} = require('table');

//Variables Needed
var deptList=[];
var sales=[];
var data=[];
var output;

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
                message: "Welcome Supervisor, What are you Doing?",
                choices: ["View Product Sales by Department", "Create new Department","Exit"],
                name: "menu"
            }
        ]).then(function (inquirerResponse) {
            //User Chose to View all Products in DB
            if (inquirerResponse.menu === "View Product Sales by Department") {
                viewSales();
            }
            //User Chose to see all Products That Have low Stock Counts
            else if (inquirerResponse.menu === "Create new Department") {
                addDept();
            }
            //User Chose to Exit Program
            else {
                console.log("Logging Out of Supervisor Portal....");   //Show Exit Message
                connection.end();       //Close Connection to DB
            }
        });
}

/* 
    ==================================================================
    Get Departments Function
    - Gets all Departments in Database to Know how Many Exist
    - Then Calls Get Sales Function
    ==================================================================
*/
function getDept(){
    deptList=[];


    connection.query("SELECT * FROM departments", function (err, res) {
        //If Error Occurs
        if (err) {
            throw err;
        }

        for (var i = 0; i < res.length; i++) {
            deptList.push(res[i]);
        }
        

        getSales();
    });

}

/* 
    ==================================================================
    Get Departments Function
    - Makes an Array Same Size as Department List
    - The Index in This Array Corresponds to Index in Other Array
    - Each Sales Amount is Total for the Department
    ==================================================================
*/
function getSales(){
    sales=[];

    connection.query("SELECT * FROM products", function (err, res) {
        //If Error Occurs
        if (err) {
            throw err;
        }

        for(var j=0;j<deptList.length;j++){
            sales[j]=0;
            for(var v=0;v<res.length;v++){
                if(res[v].department_name===deptList[j].department_name){
                    sales[j]+=res[v].product_sales;
                }
            }
        }


        mainMenu();
    });
}

/* 
    ==================================================================
    Set Data Function
    - Sets All Data Ready to be in Table
    - Starts With Headers 
    - Then Pushes Entries Into Required Data Array
    ==================================================================
*/
function setData(){
    data=[];

    var titleArr=["Department ID","Department Name","Overhead Costs","Product Sales","Profit"]

    data.push(titleArr);

    for(var i=0;i<deptList.length;i++){
        var someArr=[];

        someArr.push(deptList[i].department_id);
        someArr.push(deptList[i].department_name);
        someArr.push(deptList[i].over_head_costs);
        someArr.push(sales[i]);
        someArr.push(sales[i]-deptList[i].over_head_costs);

        data.push(someArr);
    }
}

/* 
    ==================================================================
    View Sales Function
    - User Chose to View Product Sales by Department 
    - Calls Set Data Function
    - Output Variable is Set
    - User is Returned to Main Menu
    ==================================================================
*/
function viewSales(){
    setData();

    output=table(data);
    
    console.log(output);

    mainMenu();
}

/* 
    ==================================================================
    Add Department Function
    - User Chose to Add a New Department in Store
    - User Enters Name and Overhead Costs for Department
    - Data is Pushed Into Table 
    ==================================================================
*/
function addDept(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter Department Name: ",
                name: "newDept"
            },
            {
                type: "input",
                message: "Enter Overhead Costs: ",
                name: "costs"
            }
        ]).then(function(inquirerResponse){
            var c=parseFloat(inquirerResponse.costs).toFixed(2);
            insertDept(inquirerResponse.newDept,c)
        });

    
}

/* 
    ==================================================================
    Insert Department Function
    - This is Where Insert Query Happens
    - Moved Here for Timing Reasons
    ==================================================================
*/
function insertDept(a,b){
    var someQuery="INSERT INTO departments(department_name, over_head_costs) VALUES('"+a+"',"+b+")";

    connection.query(someQuery, function (err, res) {
        //If Error Occurs
        if (err) {
            throw err;
        }

        getDept();
    });

}

getDept();