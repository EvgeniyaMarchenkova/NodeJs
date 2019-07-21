const mongoose = require('mongoose');
const http = require('http');
const port = 3004;

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected');
});

const CitySchema = new mongoose.Schema({
    name: String,
    country: String,
    capital: String,
    location: String
});

const CityModel = mongoose.model('City', CitySchema);

const instance = new CityModel(
    {
        name: "Minsk",
        country: "Belarus",
        capital: true,
        location: "not far"
    }
);
instance.save(function (err) {
    if (err) return console.error(err);
});

http.createServer((req, res) => {
    CityModel.find(function (err, cities) {
        if (err) return console.error(err);
        console.log(cities);
    })
}).listen(port);