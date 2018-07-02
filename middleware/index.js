var Comment = require('../models/comment'),
    Campground = require('../models/campground');

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },
    checkCampgroundOwnerShip: (req, res, next) => {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, campground) => {
                if (!err && campground.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    res.redirect("back");
                }
            })
        } else {
            res.redirect("/login");
        }
    },
    checkCommentOwnerShip: (req, res, next) => {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (!err && foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    res.redirect("back");
                }
            })
        } else {
            res.redirect("/login");
        }
    }
};