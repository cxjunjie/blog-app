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

// Route to display reader's homepage with all published articles
router.get("/", (req, res) => {
    db.all('SELECT * FROM articles WHERE status = "published"', (err, articles) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.render('reader-home', { articles }); // Render reader-home view with fetched articles
    });
});

module.exports = router;