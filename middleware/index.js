var Comment = require('../models/comment'),
    Campground = require('../models/campground');

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('/login');
    },
    checkCampgroundOwnerShip: (req, res, next) => {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, campground) => {
                if (!err && campground.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash('error', 'You  dont have permission or campground not found');
                    res.redirect("back");
                }
            });
        }
    },
    checkCommentOwnerShip: (req, res, next) => {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (!err && foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash('error', 'You  dont have permission or comment not found');
                    res.redirect("back");
                }
            });
        }
    }
};