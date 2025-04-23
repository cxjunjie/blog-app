// Set up express, bodyparser and EJS
const express = require('express');
const app = express();

const session = require('express-session');
const { isAuthenticated } = require('./middleware/auth');

const port = 3000;

// Set up bodyparser for form submissions
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Set the app to use ejs for rendering
app.set('view engine', 'ejs');

// Set location of static files
app.use(express.static(__dirname + '/public'));

// Set up express-session for handling user sessions
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // Bail out if we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // Tell SQLite to pay attention to foreign key constraints
    }
});

// Handle requests to the home page 
app.get('/', (req, res) => {
    // Fetch blog title and author name from settings table
    db.get('SELECT blog_title, author_name FROM settings', (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Render the home page with blog title and author name
        res.render('home', { blogTitle: row.blog_title, authorName: row.author_name });
    });
});

// Import routes
const authorhome = require('./routes/author-home.js');
const readerhome = require('./routes/reader-home.js');
const editarticle = require('./routes/edit-article.js');
const authorsettings = require('./routes/author-settings.js');
const readerarticle = require('./routes/reader-article.js');
const authorlogin = require('./routes/author-login.js');

// Route handling
app.use('/reader-home', readerhome);
app.use('/edit-article', editarticle);
app.use('/author-settings', authorsettings);
app.use('/reader-article', readerarticle);
app.use('/author-login', authorlogin);

// Protected routes, need authentication
app.use('/author-home', isAuthenticated, authorhome);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

