const dotenv = require('dotenv');
dotenv.config();

const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/author-login');
    }
};

const checkPassword = (req, res, next) => {
    const { password } = req.body;
    if (password === process.env.AUTHOR_PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/author-home');
    } else {
        res.render('author-login', { error: 'Invalid password' });
    }
};

module.exports = { isAuthenticated, checkPassword };
