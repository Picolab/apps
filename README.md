# Picolabs Apps
This is the repository where Picolabs acts as a 3rd party developer in the Manifold app development process. Our 3rd party server code will be written here.

#Setup
This section describes the one-time setup process that allows you to start the server.

Before you start the server, you MUST have an instance of a mariaDB database running. Follow the first section of https://github.com/zappala/cs260-examples/tree/master/node-sql for detailed instructions on how to install mariaDB.

Once mariaDB is installed, go ahead and setup the database password. Type 'mysql' in the command line. This will open up the interactive command line prompt for the database. Then type 'USE mysql' to enter the administrative database. Enter the following commands separately (substituting your chosen password for "New-Password"):
'SET PASSWORD FOR 'root'@'127.0.0.1' = PASSWORD('New-Password');'
'SET PASSWORD FOR 'root'@'localhost' = PASSWORD('New-Password');'
Then type 'quit'.

Now, reenter the interactive command line prompt, but this time type 'mysql -u root -p'. You will be prompted for a password. Enter the newly set password from above. Now you are ready to create the "apps" database.

Our server makes a connection specifically to the "apps" database on our mariaDB instance. To create this database, type 'create database apps;' in the interactive prompt line. Then 'quit;'.

You are all set up and ready to start the server!

#Starting the server
Run 'node server.js' to start the server. Make sure you have node installed first. You will be prompted for the password to connect to a mariaDB database. This is the password described in the setup process above.

# Safe and Mine App
POST '/safeandmine/api/tags'
This creates a new tag in the table, associating the owner with the tagID and also stores a DID to reach the owner's pico.


GET '/safeandmine/:tagID'
Navigating to this route will provide a lookup to see who owns the tag and what DID can be used to reach that particular pico. It will then redirect the browser to Manifold, passing along any needed information for Manifold's use
