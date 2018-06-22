var bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelpcamp');

//seedDB();

app.use(express.static('public/css'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');


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

app.get('/campgrounds/:id/comments/new', (res, req) => {
    Campground.findById(res.params.id, (err, campground) => {
        if (!err) {
            req.render('comments/new.ejs', { model: campground });
        }
    });
});

app.post('/campgrounds/:id/comments', (res, req) => {
    Campground.findById(res.params.id, (err, campground) => {
        if (!err) {
            Comment.create(res.body.comment, (err, comment) => {
                if (!err) {
                    campground.comments.push(comment);
                    campground.save((err, data) => {
                        if (!err) {
                            req.redirect('/campgrounds/' + res.params.id);
                        }
                    });
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log('YelpCamp was started!');
});