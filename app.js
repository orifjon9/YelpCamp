var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var mongoose = require('mongoose');

app.use(express.static('public/css'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/yelpcamp');

var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var campgroundsService = mongoose.model("campgrounds", campgroundsSchema);


app.get('/', (request, response) => {
    response.render('landing');

});

app.get('/campgrounds', (request, response) => {
    campgroundsService.find((err, campgrounds) => {
        if (!err) {
            response.render('campgrounds/list', { model: campgrounds });
        }
    });
});

app.get('/campgrounds/new', (request, response) => {
    response.render('campgrounds/new.ejs');
});

app.get('/campgrounds/:id', (request, response) => {
    campgroundsService.findById(request.params.id, (error, compground) => {
        if (!error) {
            console.log(compground);
            response.render('campgrounds/details.ejs', { model: compground });
        }
    });
});

app.post('/compgrounds', (request, response) => {
    const name = request.body.name;
    const image = request.body.image;
    const description = request.body.description;
    campgroundsService.create({ name: name, image: image, description: description }, (err, data) => {
        if (!err) {
            response.redirect('/campgrounds');
        }
    });

});


app.listen(3000, () => {
    console.log('YelpCamp was started!');
});