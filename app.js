var bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    seedDB = require('./seeds');

var authRouters = require('./routes/auth'),
    campgroundsRouters = require('./routes/campgrounds'),
    commentsRouters = require('./routes/comments');

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

// requiring routes
app.use(authRouters);
app.use("/campgrounds", campgroundsRouters);
app.use("/campgrounds/:id/comments", commentsRouters);

app.get('/', (request, response) => {
    response.render('landing');

});

app.listen(3000, () => {
    console.log('YelpCamp was started!');
});