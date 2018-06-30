var mongoose = require('mongoose');
var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId, // reference to Object
        ref: 'comment'
    }]
});
module.exports = mongoose.model("campgrounds", campgroundsSchema);