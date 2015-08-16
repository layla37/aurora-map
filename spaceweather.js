var request = require( 'request' );
var async = require( 'async' );

// contains all the upload ids that we have retrieved
var uploadIds = [];
var counter = 0;

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
		uid = s.substring( 11, s.length );
		uploadIds.push( uid );
	}
	return uploadIds;
};


var requestSeriesWrapper = function(url, callback) {
	request( url, function ( error, response, body ) {
			if ( !error && response.statusCode == 200 ) {
				var uids = parseUploadIds( body );
				callback( null, uids );
			}
		} );
}

var scrapeIndexPages = function( startingPoint, maxStartingPoint ) {
	var baseMainPageURL = 'http://spaceweathergallery.com/index.php?&title=aurora&title2=lights&s=&starting_point=';
	//make requests for a bunch of starting points
	var requestURL;
	var asyncCallbacks = [];
	for ( var i = 0; i <= maxStartingPoint; i += 50 ) {
		requestURL = baseMainPageURL + i;

		// construct an async callback for this request url
		asyncCallbacks.push( async.apply(requestSeriesWrapper, requestURL) );
	}

	async.series( asyncCallbacks,
			function (err, results) {
				console.log("# of results: " + results.length);
				console.log("series results=" + results);
			} );

};

scrapeIndexPages( 0, 500 );
