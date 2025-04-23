const express = require('express');
const router = express.Router();

// Fetch blog settings
router.use((req, res, next) => {
    db.get('SELECT * FROM settings WHERE id = 1', (err, settings) => {
        if (err) {
            console.error(err.message);
            return next(err);
        }
        if (!settings) {
            console.error('Blog settings not found.');
            return next();
        }
        // Set local variables to be available in all templates
        res.locals.blogTitle = settings.blog_title;
        res.locals.authorName = settings.author_name;
        next();
    });
});
// CODE THAT I WROTE START

// Display settings page
router.get("/", (req, res) => {
    global.db.get('SELECT * FROM settings WHERE id = 1', (err, row) => {
        if (err){
            return console.error(err.message);
        }
        res.render('author-settings', { settings: row });
    });
});
// Handle settings update
router.post("/", (req, res) => {
    const { blog_title, author_name } = req.body;
    global.db.run(`UPDATE settings SET blog_title = ?, author_name = ? WHERE id = 1`, [blog_title, author_name], function(err){
        if (err){
            return console.error(err.message);
        } else {
        res.redirect('/author-home'); // Redirect to author's homepage after updateting settings
        }
    });
});
// CODE THAT I WROTE END

module.exports = router;