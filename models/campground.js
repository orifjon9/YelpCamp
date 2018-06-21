var mongoose = require('mongoose');
var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId, // reference to Object
        ref: 'comment'
    }]
});
module.exports = mongoose.model("campgrounds", campgroundsSchema);