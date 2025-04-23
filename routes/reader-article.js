const express = require('express');
const router = express.Router();


// CODE THAT I WROTE START
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
// CODE THAT I WROTE END

// Route to display a specific article based on article_id
router.get("/:id", (req, res) => {
    const articleId = req.params.id;

    // Update reads count in the database
    db.run('UPDATE articles SET reads = reads + 1 WHERE article_id = ?', [articleId], (err) => {
        if (err) {
            console.error(err.message);
        }

        // Fetch the article details from database
        db.get('SELECT * FROM articles WHERE article_id = ?', [articleId], (err, article) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Internal Server Error');
            }
            if (!article) {
                return res.status(404).send('Article Not Found');
            }

            // Fetch comments for the article from database
            db.all('SELECT * FROM comments WHERE article_id = ?', [articleId], (err, comments) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Internal Server Error');
                }
                // Render the reader-article page with details and comments
                res.render('reader-article', { article, comments });
            });
        });
    });
});

// Route to handle adding a comment to an article
router.post("/comment/:id", (req, res) => {
    const articleId = req.params.id;
    const { commenter_name, comment_text } = req.body;

    // Insert the comment into the comments table in database
    db.run('INSERT INTO comments (article_id, commenter_name, comment_text) VALUES (?, ?, ?)', [articleId, commenter_name, comment_text], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to add comment.');
        }
        // Redirect back to the article page after adding the comment
        res.redirect(`/reader-article/${articleId}`);
    });
});
// CODE THAT I WROTE START
// Route to handle liking an article
router.post("/like/:id", (req, res) => {
    const articleId = req.params.id;

    // Update the likes count in the database
    db.run('UPDATE articles SET likes = likes + 1 WHERE article_id = ?', [articleId], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to like the article.');
        }
        // Redirect back to the article page after liking
        res.redirect(`/reader-article/${articleId}`);
    });
});
// CODE THAT I WROTE END
module.exports = router;