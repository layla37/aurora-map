var Promise = require('es6-promise').Promise;
var geocoderProvider = 'google';
var httpAdapter = 'https';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);

var getCounty = function(location) {
	return new Promise(function(resolve, reject) {
		geocoder.geocode({ 'address': location }, function(err, res) {
			if (err) {
                console.log('Error:', err);
                reject(err);
            }
            console.log('Hey!');
			console.log(res[0]['administrativeLevels']['level2long']);
			resolve(res);
		});
	});
};

var writeCountiesToFile = function() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./data/usa_aurora_data.json', 'utf8').then(function(contents) {
			return JSON.parse(contents);
		})
		.then(function(contents) {
			var iterations = [];

			for (var i = 0; i < contents.length; i++) {
				iterations.push(getCounty(contents[i].location));
			}
			return Promise.all(iterations);
		})
		.then(function(results) {
			resolve(results);
		})
		.catch(function(reason) {
			reject('Rejected Promise when attempting to write counties to file: ' + reason);
		});
	});
};

writeCountiesToFile();
