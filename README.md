### CM2040 Database Networks and the Web ###

To get started:

* Run ```npm install``` from the project directory to install all the node packages.

* Run ```npm run build-db``` to create the database on Mac or Linux 
or run ```npm run build-db-win``` to create the database on Windows

* Run ```npm run start``` to start serving the web app (Access via http://localhost:3000)

Test the app by browsing to the following routes:

* http://localhost:3000
* http://localhost:3000/users/list-users
* http://localhost:3000/users/add-user

You can also run: 
```npm run clean-db``` to delete the database on Mac or Linux before rebuilding it for a fresh start
```npm run clean-db-win``` to delete the database on Windows before rebuilding it for a fresh start

#### Additional libraries used and IMPORTANT information ####

I have utilised Express-session and dotenv for managing user sessions in Express.
There is a folder called middleware and it contains the authentication file for author-login and also .env file for the password which is 'database' for the login.
I have also added default data into my settings table for the blog title and username.

Make a copy of your project folder.
In your copy, delete the following files and folders:
* node_modules
* .git (the hidden folder with your git repository)
* database.db (your database)


