var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(express.static('public/css'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


var campgrounds = [
    { name: 'Salmon Greek', image: 'http://photosforclass.com/download/pixabay-1845906?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104497f9c37aa0ecbdb1_960.jpg&user=Pexels' },
    { name: 'Granite Hill', image: 'https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439cf2c27ea6e5bc_340.jpg' },
    { name: 'Mountain Goat\'s rest', image: 'https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104497f9c379aeeebcba_340.jpg' }
];

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
    campgrounds.push({ name: name, image: image });
    response.redirect('/campgrounds');
});


app.listen(3000, () => {
    console.log('YelpCamp was started!');
});