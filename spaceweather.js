var request = require( 'request' );
var async = require( 'async' );
var cheerio = require('cheerio');
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

	request( url, function ( error, response, body ) {
		if ( !error && response.statusCode == 200 ) {
			setTimeout( function() {
				uids = parseUploadIds( body );
				console.log('index page scraped for upload ids');
				callback( null, uids );
			}, 5000);
		}
	} );
};

var getAuroraData = function( bodyText ) {
	var auroraData = {};
	var allLocationData;
	var $ = cheerio.load( bodyText );

	// <span class="photoLocationText">Taken by <font color="#FF0000">Layla Mandella</font> on March 13, 2014 @ Fairbanks, AK </span>
	function getLocation( divContents ) {
		var reg = /@[\s\S]*<\/span>/;
		var location = divContents.match( reg );
		return location.substring( 2, location.length - 7 );
	}

	function getAuroraDate( divContents ) {
		var reg = /\w+\s\d+,\s\w+/g;
		var matchesDate = divContents.match( reg );
		return matchesDate;
	}
	
	// get aurora image URL
	auroraData.imgUrl = $('#main_pic').attr('src');
	// grab div contents with data we want
	allLocationData = $('.photoLocationText');
	auroraData.location = getLocation( allLocationData );
	auroraData.date = getAuroraDate( allLocationData );
	auroraData.name = $('.photoLocationText font').html();

	return auroraData;

};

var requestSeriesWrapper2 = function(url, callback) {
	var auroraData = {};

	request( url, function ( error, response, body ) {
		if ( !error && response.statusCode == 200 ) {
			setTimeout( function() {
				auroraData = getAuroraData( body );
				console.log('getting aurora data');
				callback( null, auroraData );
			}, 5000);
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
		asyncCallbacks.push( async.apply(requestSeriesWrapper2, url) );
	}

	async.series( asyncCallbacks, function ( err, results ) {
		console.log(results);
		
		} );
};

/**
 * @description get the URLs that contain the data we want (image URL, name, location, date)
 * @param ids {array} upload IDs
 * @returns array of URLS
*/
var userDataUrls = function( ids ) {
	var baseURL = 'http://spaceweathergallery.com/indiv_upload.php?upload_id=';
	var uploadUrls = [];
	var i;

	for ( i = 0; i < ids.length; i++ ) {
		uploadUrls.push( baseURL + ids[i] );
	}
	// scrapeAuroraUploadPages( uploadUrls );
};

var scrapeIndexPages = function( startingPoint, maxStartingPoint ) {
	//make requests for a bunch of starting points
	var asyncCallbacks = [];
	var baseMainPageURL = 'http://spaceweathergallery.com/index.php?&title=aurora&title2=lights&s=&starting_point=';
	var requestURL;
	var i;

	for ( i = 0; i <= maxStartingPoint; i += 50 ) {
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
			// userDataUrls( mergedIds );
		} );
};

// scrapeIndexPages( 0, 50 );



