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

// Route to display the author's homepage
router.get("/", (req, res) => {
    // Fetch draft articles
    db.all('SELECT * FROM articles WHERE status = "draft"', (err, draftArticles) => {
        if (err) {
            return console.error(err.message);
        }
        
        // Fetch published articles
        db.all('SELECT * FROM articles WHERE status = "published"', (err, publishedArticles) => {
            if (err) {
                return console.error(err.message);
            }
            
            // Render the author-home page with draft and published articles
            res.render('author-home', {
                draftArticles: draftArticles || [],
                publishedArticles: publishedArticles || []
            });
        });
    });
});

// Route to handle deleting a draft article
router.post("/delete/:id", (req, res) => {
    const articleId = req.params.id;

    // Delete article from database
    db.run('DELETE FROM articles WHERE article_id = ?', [articleId], (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Deleted article with ID ${articleId}`);
        res.redirect('/author-home'); // Redirect back to author homepage after deletion
    });
});

// Route to handle publishing a draft article
router.post("/publish/:id", (req, res) => {
    const articleId = req.params.id;

    // Update Article status to published in database
    db.run('UPDATE articles SET status = "published", published_at = CURRENT_TIMESTAMP WHERE article_id = ?', [articleId], (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Published article with ID ${articleId}`);
        res.redirect('/author-home'); // Redirect back to author homepage after publishing
    });
});

// Route to handle sharing a published article
router.post("/share-article/:id", (req, res) => {
    const articleId = req.params.id;

    // Redirect to reader-article page with the article ID
    res.redirect(`/reader-article/${articleId}`);
});

// Route to handle deleting a published article
router.post("/delete-article/:id", (req, res) => {
    const articleId = req.params.id;

    // Perform deletion from the database
    db.run('DELETE FROM articles WHERE article_id = ?', articleId, (err) => {
        if (err) {
            console.error(err.message);
            // Handle error if deletion fails
            res.status(500).send('Failed to delete article.');
        } else {
            // Redirect back to the author's homepage after deletion
            res.redirect('/author-home');
        }
    });
});

module.exports = router;