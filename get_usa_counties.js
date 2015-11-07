// var fs = require('fs');
// var contents = fs.readFileSync("usa_aurora_data.json", "utf8");
// var states = fs.readFileSync("data/usaStates.json", "utf8");
// var auroraData = JSON.parse(contents);
// var stateList = JSON.parse(states);
// var abbreviatedState;
// var location;
// var state;

// var spelledOutState = /.*?(Alabama|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New\sHampshire|New\sJersey|New\sMexico|New\sYork|North\sCarolina|North\sDakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode\sIsland|South\sCarolina|South\sDakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West\sVirginia|Wisconsin|Wyoming).*/ig;


// for ( var i = 0; i < auroraData.length; i++ ) {
// 	location = auroraData[i].location.toUpperCase();

// 	// if state is spelled out, abbreviate it
// 	if ( spelledOutState.test( location ) ) {
// 		console.log('*** spelled out: *****');
// 		console.log(location);
// 		state = location;
// 		for ( var key in stateList ) {
// 			if ( stateList.hasOwnProperty(key) && stateList[key].toUpperCase() === state ) {
// 				// console.log( key );
// 				state = location.replace( spelledOutState, key );
// 				console.log( state );
// 			}
// 		}



// 		// fs.appendFile('usa_counties_aurora_data.json', JSON.stringify( auroraData[i] ) + ',\n', 'utf-8');
// 	}
// }



// 	// state is already abbreviated
// 	else {
// 		fs.appendFile('usa_counties_aurora_data.json', JSON.stringify( auroraData[i] ) + ',\n', 'utf-8');
// 	}

// }
// console.log('usa_counties_aurora_data.json is ready');



var geocoder = new google.maps.Geocoder();

geocoder.geocode({ "address": "Chelsea, New York, NY, USA" }, function (results, status) {

	if (status == google.maps.GeocoderStatus.OK) {
	    if (results.length == 1) {
	  		console.log(results);
	    }
	  	else{
	    	 console.log("**************** Geocode was not successful for the following reason: " + status);
	    }
	}
});

https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBkrylotjnTPSz5mRZT9hKL-pqgDHwV-zA



var request = require( 'request' );
var async = require( 'async' );
var fs = require('fs');



var requestSeriesWrapper = function(url, callback) {
	var auroraData = {};
	// randomize the setTimeout between 3000 - 6000
	var randomizeTimeout = Math.floor( Math.random() * 3000 + 3000 );
	var options = { url: url, headers: { 'User-Agent': 'https://github.com/layla37/aurora-map/blob/master/README.md' } };
	request( options, function ( error, response, body ) {
		if ( !error && response.statusCode == 200 ) {
			setTimeout( function() {
				auroraData = getAuroraData( body );
				callback( null, auroraData );
			}, randomizeTimeout );
		}
	} );
};


var scrapeAuroraUploadPages = function( urls ) {
	//make requests for a bunch of starting points
	var asyncCallbacks = [];
	var url;
	var i;

	for ( i = 0; i < urls.length; i++ ) {
		url = urls[i];
		// construct an async callback for this request url
		asyncCallbacks.push( async.apply(requestSeriesWrapper, url) );
	}

	async.series( asyncCallbacks, function ( err, results ) {
		fs.writeFileSync('aurora_data.json', JSON.stringify(results), 'utf-8');
			console.log('aurora_data.json is ready');
		} );
};

/**
 * @description get the URLs that contain the data we want (image URL, name, location, date)
 * @param ids {array} upload IDs
 * @returns array of URLS
*/
var userDataUrls = function( ids ) {
	var baseURL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=[put key here]';
	var uploadUrls = [];
	var i;

	for ( i = 0; i < ids.length; i++ ) {
		uploadUrls.push( baseURL + ids[i] );
	}
	scrapeAuroraUploadPages( uploadUrls );
};

var idsFromCsv = fs.readFileSync( 'upload_ids.csv', { 'encoding': 'utf-8'} );
var arrayOfIds = idsFromCsv.split('\n');


// userDataUrls( arrayOfIds );

// console.log('the function call is currently commented out, so is baseURL and options. You will need to update those with the correct info and uncomment them. ');


