// This grabs the upload IDs from each aurora gallery index page. Each index page contains 50 upload IDs.

var request = require( 'request' );
var async = require( 'async' );
var fs = require('fs');


// Gets the body text of a spaceweather page and returns all the upload ids on that page in an array.
var parseUploadIds = function( bodyText ) {
	// regex to find the upload ids on the webpage
	var reg = /upload_id=\d+/g;
	var matchesArray = bodyText.match( reg );
	// array of just the upload id numbers
	var uploadIds = [];
	var s;
	var uid;
	var i;
	// remove "upload_id="
	for ( i = 0; i < matchesArray.length; i++ ) {
		s = matchesArray[ i ];
		uid = s.substring( 10, s.length );
		uploadIds.push( uid );
	}
	return uploadIds;
};


var requestSeriesWrapper = function(url, callback) {
	var uids;
	// randomize the setTimeout between 3000 - 6000
	var randomizeTimeout = Math.floor( Math.random() * 3000 + 3000 );
	var options = { url: url, headers: { 'User-Agent': 'https://github.com/layla37/aurora-map/blob/master/README.md' } };
	request( options, function ( error, response, body ) {
		if ( !error && response.statusCode == 200 ) {
			setTimeout( function() {
				uids = parseUploadIds( body );
				console.log('page scraped for upload ids: ' + url);
				callback( null, uids );
			}, randomizeTimeout );
		}
	} );
};

var scrapeIndexPages = function( startingPoint, maxStartingPoint ) {
	//make requests for a bunch of starting points
	var asyncCallbacks = [];
	var baseMainPageURL = 'http://spaceweathergallery.com/index.php?&title=aurora&title2=lights&s=&starting_point=';
	var requestURL;
	var i;

	for ( i = startingPoint; i <= maxStartingPoint; i += 50 ) {
		requestURL = baseMainPageURL + i;
		// construct an async callback for this request url
		asyncCallbacks.push( async.apply(requestSeriesWrapper, requestURL) );
	}

	async.series( asyncCallbacks, function ( err, results ) {
			// flatten array
			var mergedIds = [].concat.apply( [], results );

			var stringOfUploadIds = '';
			for ( var i = 0; i < mergedIds.length; i++ ) {
				stringOfUploadIds += mergedIds[i] + '\n';
			}
			fs.writeFileSync('upload_ids.csv', stringOfUploadIds);
			console.log('upload_ids.csv is ready');
		} );
};

// scrapeIndexPages( 0, 2500 );

console.log('the function call is currently commented out');


