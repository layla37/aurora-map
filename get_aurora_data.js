/* This grabs the aurora info we want, creates an object with that data, then writes it to a file.
	Data we want:
	1) The URL of the main aurora image the user uploaded
	2) The name of the photographer (user)
	3) The location where the photo was taken
*/

var request = require( 'request' );
var async = require( 'async' );
var cheerio = require('cheerio');
var fs = require('fs');


var getAuroraData = function( bodyText ) {
	var auroraData = {};
	var allLocationData;
	var $ = cheerio.load( bodyText );

	// <span class="photoLocationText">Taken by <font color="#FF0000">Layla Mandella</font> on March 13, 2014 @ Fairbanks, AK </span>
	function getLocation( divContents ) {
		var reg = /@[\s\S]*<\/span>/;
		var divContentsString = divContents.toString();
		var location = divContentsString.match( reg );
		return location[0].replace(/\n/gm,'').substring( 2, location[0].length - 9 );
	}

	function getAuroraDate( divContents ) {
		var reg = /\w+\s\d+,\s\w+/g;
		var dateString = divContents.toString();
		var matchesDate = dateString.match( reg );
		return matchesDate[0];
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

var requestSeriesWrapper = function(url, callback) {
	var auroraData = {};

	request( url, function ( error, response, body ) {
		if ( !error && response.statusCode == 200 ) {
			setTimeout( function() {
				auroraData = getAuroraData( body );
				console.log('getting aurora data from: ' + url);
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
	var baseURL = 'http://spaceweathergallery.com/indiv_upload.php?upload_id=';
	var uploadUrls = [];
	var i;

	for ( i = 0; i < ids.length; i++ ) {
		uploadUrls.push( baseURL + ids[i] );
	}
	scrapeAuroraUploadPages( uploadUrls );
};

// testing with just 2 upload IDs for now
userDataUrls( [ 116814, 116756 ] );



