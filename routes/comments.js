var express = require('express'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware/index'),
    Comment = require('../models/comment'),
    Campground = require('../models/campground');

// get(<link>, <middleware>, callback)

// comments new page
router.get('/new', middleware.isLoggedIn, (res, req) => {
    Campground.findById(res.params.id, (err, campground) => {
        if (!err) {
            req.render('comments/new.ejs', { model: campground });
        }
    });
});

// create new comment
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (!err) {
            var newComment = {
                text: req.body.comment.text,
                author: {
                    id: req.user._id,
                    username: req.user.username
                },
                createdDate: new Date()
            };
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

// edit comment page
router.get('/:comment_id/edit', middleware.checkCommentOwnerShip, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit.ejs', { comment: foundComment, campgroundId: req.params.id });
        }
    });
});

// update exist comment
router.put('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// delete exist comment
router.delete('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;