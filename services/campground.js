class CampgroundManager {
    mongoose = require('mongoose');
    campgroundsSchema;
    campgrounds;

    constructor() {
        this.mongoose.connect('mongodb://localhost/yelpcamp');

        this.campgroundsSchema = new mongoose.Schema({
            name: String,
            image: String
        });

        this.campgrounds = mongoose.model("campgrounds", campgroundsSchema);
    }

    getAll() {
        return this.campgrounds.find((err, response) => {
            if (err) {
                console.log('Error');
                console.log(err);
            } else {
                console.log('Responded all campgrounds');
                console.log(response);
            }
        });
    }
};

module.exports = CampgroundManager;