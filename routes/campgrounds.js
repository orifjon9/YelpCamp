var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground');

// campground list page
router.get('/', (request, response) => {
    Campground.find((err, campgrounds) => {
        if (!err) {
            response.render('campgrounds/list', { model: campgrounds });
        }
    });
});

// create new campground
router.post('/', (request, response) => {
    const name = request.body.name;
    const image = request.body.image;
    const description = request.body.description;
    Campground.create({ name: name, image: image, description: description }, (err, data) => {
        if (!err) {
            response.redirect('/campgrounds');
        }
    });
});

// create new campground page
router.get('/new', (request, response) => {
    response.render('campgrounds/new.ejs');
});

// campground details page
router.get('/:id', (request, response) => {
    Campground.findById(request.params.id).populate('comments').exec((error, compground) => {
        if (!error) {
            console.log(compground);
            response.render('campgrounds/details.ejs', { model: compground });
        }
    });
});

// update campground
router.put('/:id', (request, response) => {
    Campground.findByIdAndUpdate(request.params.id, request.body.campground, (error, compground) => {
        if (!error) {
            response.redirect('/campgrounds/' + request.params.id);
        }
    });
});

// campground edit page
router.get('/:id/edit', (request, response) => {
    Campground.findById(request.params.id, (error, compground) => {
        if (!error) {
            response.render('campgrounds/edit.ejs', { model: compground });
        }
    });
});

// delete campground
router.delete('/:id', (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, data) => {
        res.redirect('/campgrounds');
    });
});

module.exports = router;