var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// register page
router.get('/register', (req, res) => {
    res.render('auth/register.ejs', { message: undefined });
})

// register new user
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('auth/register.ejs', { message: err.message });
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    })
});

// login page
router.get('/login', (req, res) => {
    res.render('auth/login.ejs', { message: undefined });
})

// login operation
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {});

// logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

module.exports = router;