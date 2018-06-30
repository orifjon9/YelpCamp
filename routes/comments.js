var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Comment = require('../models/comment'),
    Campground = require('../models/campground');

// get(<link>, <middleware>, callback)

// comments new page
router.get('/new', isLoggedIn, (res, req) => {
    Campground.findById(res.params.id, (err, campground) => {
        if (!err) {
            req.render('comments/new.ejs', { model: campground });
        }
    });
});

// create new comment
router.post('/', isLoggedIn, (req, res) => {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;