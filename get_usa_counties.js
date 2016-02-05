
var geocoderProvider = 'google';
var httpAdapter = 'https';


var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);

geocoder.geocode({ "address": " St. Mary, Montana " }, function(err, res) {
    console.log(res);
});

