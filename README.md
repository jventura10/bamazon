# bamazon

Bamazon is a NodeJS Command Line Mock Store with three parts in it: manager,supervisor,and customer. 

Each file or part has different functionality but affecting the same mySQL database that includes 
inventory, prices, top selling departments.

NodeJS allows for javascript code to dictate functionality and a connection to the database.

To run the code, clone the repository and move into the correct directory from the terminal.

Install all packages with: npm install or npm i

And then run: node FILENAME

the FILENAME will be any of the three bamazon files in the repository, depending on which is meant to be ran.

The database will have to created before running or no merchandise will be shown.

For the first time running customer file, there must be merchandise initialized in database table, see schema.sql 
or run manager to add inventory if database and tables exist.

From the packages installed mysql is used to establish a connection to the mySQL database I use. Inquirer is 
used to quickly prompt for user actions and table to output data in a table if appropriate.

Example of Customer File:

![Customer Example](/images/customer.gif)

Example of Supervisor File:

![Supervisor Example](/images/supervisor.gif)

Example of Manager File:

![Manager Example](/images/manager.gif)