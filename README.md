# Picolabs Apps
This is the repository where Picolabs acts as a 3rd party developer in the Manifold app development process. Our 3rd party server code will be written here.

# Setup
This section describes the one-time setup process that allows you to start the server.

Before you start the server, you MUST have an instance of a mariaDB database running. Follow the first section of https://github.com/zappala/cs260-examples/tree/master/node-sql for detailed instructions on how to install mariaDB.

After installing mariaDB you can start it with the following command: 'mysql.server start'. The command 'mysql.server stop' will stop the server. Turning off your computer will also stop the server.

Once mariaDB is installed, go ahead and setup the database password. Type 'mysql -u root -p' in the command line. This will prompt you for a password, but installing mariaDB sets the root password to the empty string. Just hit enter. This will open up the interactive command line prompt for the database. Then type 'USE mysql' to enter the administrative database. Enter the following commands separately (substituting your chosen password for "New-Password"):

'SET PASSWORD FOR 'root'@'127.0.0.1' = PASSWORD('New-Password');'

'SET PASSWORD FOR 'root'@'localhost' = PASSWORD('New-Password');'

Then type 'quit'.

Now, reenter the interactive command line prompt, but this time type 'mysql -u root -p'. You will be prompted for a password. Enter the newly set password from above. Now you are ready to create the "apps" database.

Our server makes a connection specifically to the "apps" database on our mariaDB instance. To create this database, type 'create database apps;' in the interactive prompt line. You can verify that your database was created by entering the command: 'use apps'. Once verified, enter 'quit;'.

Now that the database exists, we need to create all the tables that will be used by the server. Globally install the knex tool described here: https://knexjs.org/#Migrations.

Clone this repository and navigate to it in your terminal. npm install.

Run 'DATABASE_PASSWORD="your password" knex migrate:latest'.

This migration creates a new table in your apps database called SafeAndMine with two columns: tagID and DID.

Re-enter the interactive command line prompt by typing 'mysql -u root -p'. Type 'use apps' and then 'describe SafeAndMine;' to verify that the newly created table exists.

You are all set up and ready to start the server!

# Starting the server
Run 'node server.js' to start the server. Make sure you have node installed first. You will be prompted for the password to connect to a mariaDB database. This is the password described in the setup process above.

# Managing The Database
As we build more applications, or modify existing ones, we may want to add or modify tables in our database. This is done using knex migrations. See https://knexjs.org/#Migrations for more information on what a migration is. The knexfile.js already exists.

Adding a new table, column etc. to the database:

Create a new migration with the command 'knex migrate:make <your migration name>'. Make sure you have knex globally installed as per the instructions at the site linked to above. This creates a new migration file where you can add tables or modify existing ones. See the knex docs for more information on how to do this.

Finally, run 'DATABASE_PASSWORD="<your password>" knex migrate:latest' to run your new migration.

'DATABASE_PASSWORD="<your password>" knex migrate:rollback' will reverse the last migration by calling the .down function defined in your migration.

You can verify a tables existence in your database by logging into the interactive command line prompt, type 'use <your databasename>', then type 'DESCRIBE <tablename>;'.

# Safe and Mine App
POST '/safeandmine/api/tags'
This creates a new tag in the table, associating the owner with the tagID and also stores a DID to reach the owner's pico.


GET '/safeandmine/:tagID'
Navigating to this route will provide a lookup to see who owns the tag and what DID can be used to reach that particular pico. It will then redirect the browser to Manifold, passing along any needed information for Manifold's use
