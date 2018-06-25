var bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelpcamp');

//seedDB();

app.use(express.static('public/css'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'TEST TEST TEST TSET TSET TSET',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set loggined user
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get('/', (request, response) => {
    response.render('landing');

});

/// =================
/// Campgrounds
/// =================

app.get('/campgrounds', (request, response) => {
    Campground.find((err, campgrounds) => {
        if (!err) {
            response.render('campgrounds/list', { model: campgrounds });
        }
    });
});

app.get('/campgrounds/new', (request, response) => {
    response.render('campgrounds/new.ejs');
});

app.get('/campgrounds/:id', (request, response) => {
    Campground.findById(request.params.id).populate('comments').exec((error, compground) => {
        if (!error) {
            console.log(compground);
            response.render('campgrounds/details.ejs', { model: compground });
        }
    });
});

app.get('/campgrounds/:id/edit', (request, response) => {
    Campground.findById(request.params.id, (error, compground) => {
        if (!error) {
            response.render('campgrounds/edit.ejs', { model: compground });
        }
    });
});

app.post('/campgrounds', (request, response) => {
    const name = request.body.name;
    const image = request.body.image;
    const description = request.body.description;
    Campground.create({ name: name, image: image, description: description }, (err, data) => {
        if (!err) {
            response.redirect('/campgrounds');
        }
    });
});

app.put('/campgrounds/:id', (request, response) => {
    Campground.findByIdAndUpdate(request.params.id, request.body.campground, (error, compground) => {
        if (!error) {
            response.redirect('/campgrounds/' + request.params.id);
        }
    });
});

app.delete('/campgrounds/:id', (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, data) => {
        res.redirect('/campgrounds');
    });
});

/// ======================
/// COMMENTS ROUTES
/// ======================

// get(<link>, <middleware>, callback)
app.get('/campgrounds/:id/comments/new', isLoggedIn, (res, req) => {
    Campground.findById(res.params.id, (err, campground) => {
        if (!err) {
            req.render('comments/new.ejs', { model: campground });
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (!err) {
            var newComment = {
                text: req.body.comment.text,
                author: req.user.username
            };
            console.log(newComment);
            Comment.create(newComment, (err, comment) => {
                if (!err) {
                    campground.comments.push(comment);
                    campground.save((err, data) => {
                        if (!err) {
                            res.redirect('/campgrounds/' + req.params.id);
                        }
                    });
                }
            });
        }
    });
});


// ==============
// AUTH ROUTES
// =============
app.get('/register', (req, res) => {
    res.render('auth/register.ejs', { message: undefined });
})

app.post('/register', (req, res) => {
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

app.get('/login', (req, res) => {
    res.render('auth/login.ejs', { message: undefined });
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, () => {
    console.log('YelpCamp was started!');
});