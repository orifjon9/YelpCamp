var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var UserScheme = new mongoose.Schema({
    username: String,
    passport: String
});
UserScheme.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', UserScheme);