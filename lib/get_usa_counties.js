var fs = require('fs');
var Promise = require('es6-promise').Promise;
var geocoderProvider = 'google';
var httpAdapter = 'https';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);

var increasedSetTimeout = 200;
var i = 0;

var getCounty = function(location) {
	return new Promise(function(resolve, reject) {
		i+= 25;
		setTimeout(function() {
            geocoder.geocode({ 'address': location }, function(err, res) {
				if (err) {
	                console.log('Error:', err);
	                reject(err);
	            }
				console.log(res[0]['administrativeLevels']['level2long']);
				resolve(res);
			});
        }, increasedSetTimeout + i);

	});
};

var parseTheData = function( data ) {
	return new Promise(function(resolve, reject) {
		resolve(JSON.parse( data ));
	});
}

fs.readFile( './data/usa_aurora_data.json', { 'encoding': 'utf-8'}, function(err, data) {
	return new Promise(function(resolve, reject) {
		parseTheData(data).then( function ( contents ) {
			var iterations = [];

			for (var i = 0; i < contents.length; i++) {
				iterations.push(getCounty(contents[i].location));
			}
			return Promise.all(iterations);
		})
		.then(function(results) {
			resolve(console.log(results));
		})
		.catch(function(reason) {
			reject('Rejected Promise when attempting to write counties to file: ' + reason);
		});
	});
});
