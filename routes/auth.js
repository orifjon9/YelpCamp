var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// register page
router.get('/register', (req, res) => {
    res.render('auth/register.ejs');
})

// register new user
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.render('auth/register.ejs');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        });
    })
});

// login page
router.get('/login', (req, res) => {
    res.render('auth/login.ejs');
})

// login operation
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {});

// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
})

module.exports = router;