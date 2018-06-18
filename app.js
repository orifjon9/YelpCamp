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
    image: String
});
var campgroundsService = mongoose.model("campgrounds", campgroundsSchema);

var campgrounds;
campgroundsService.find((err, response) => {
    if (err) {
        console.log('Error');
        console.log(err);
    } else {
        console.log('Responded all campgrounds');
        console.log(response);
        campgrounds = response;
    }
});

app.get('/', (request, response) => {
    response.render('landing');

});


app.get('/campgrounds', (request, response) => {
    response.render('campgrounds/list', { model: campgrounds });
});

app.get('/campgrounds/new', (request, response) => {
    response.render('campgrounds/new.ejs');
});

app.post('/compgrounds', (request, response) => {
    const name = request.body.name;
    const image = request.body.image;
    campgroundsService.create({ name: name, image: image }, (err, data) => {
        if (!err) {
            campgrounds.push({ name: name, image: image });
            response.redirect('/campgrounds');
        }
    });

});


app.listen(3000, () => {
    console.log('YelpCamp was started!');
});