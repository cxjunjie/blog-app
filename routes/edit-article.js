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

// Display the edit article page
router.get("/:id?", (req, res) => {
    const articleId = req.params.id;
    
    if (articleId) {
        db.get('SELECT * FROM articles WHERE article_id = ?', [articleId], (err, article) => {
            if (err) {
                return console.error(err.message);
            }
            // Render edit-article.ejs with fetched article data or empty fields
            res.render('edit-article', {
                article: article || { article_id: '', title: '', content: '' }
            });
        });
    } else {
        // If no articleId, render edit-article.ejs with empty fields
        res.render('edit-article', {
            article: { article_id: '', title: '', content: '' }
        });
    }
});

// Handle form submission for creating or updating an article
router.post("/:id?", (req, res) => {
    const articleId = req.params.id;
    const { title, body } = req.body;

    if (articleId) {
        // Update existing article
        db.run('UPDATE articles SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE article_id = ?', 
            [title, body, articleId], (err) => {
                if (err) {
                    return console.error(err.message);
                }
                res.redirect('/author-home'); // Redirect to author's homepage after updating
            });
    } else {
        // Insert new article
        db.run('INSERT INTO articles (title, content, status) VALUES (?, ?, ?)', 
            [title, body, 'draft'], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                const newArticleId = this.lastID; // Retrieve ID of new article
                res.redirect('/author-home'); // Redirect to author's homepage after creating
            });
    }
});

module.exports = router;
