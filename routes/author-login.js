const express = require('express');
const router = express.Router();

// CODE THAT I WROTE START
// Get request for author login form
router.get('/', (req, res) => {
    res.render('author-login'); // Render author-login.ejs 
});

// Post request to handle form submission for author login
router.post('/', (req, res) => {
    const { password } = req.body;

    // Check if password matches
    if (password === process.env.AUTHOR_PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/author-home'); // Redirect to author's homepage
    } else {
        res.render('author-login', { error: 'Invalid password' }); // Render login page again with invalid password
    }
});
// CODE THAT I WROTE END

module.exports = router;
