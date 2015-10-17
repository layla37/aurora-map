var fs = require('fs');
var contents = fs.readFileSync("usa_aurora_data.json", "utf8");
var states = fs.readFileSync("data/usaStates.json", "utf8");
var auroraData = JSON.parse(contents);
var stateList = JSON.parse(states);
var abbreviatedState;
var location;
var state;

var spelledOutState = /.*?(Alabama|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New\sHampshire|New\sJersey|New\sMexico|New\sYork|North\sCarolina|North\sDakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode\sIsland|South\sCarolina|South\sDakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West\sVirginia|Wisconsin|Wyoming).*/ig;


for ( var i = 0; i < auroraData.length; i++ ) {
	location = auroraData[i].location.toUpperCase();

	// if state is spelled out, abbreviate it
	if ( spelledOutState.test( location ) ) {
		console.log(location);
		state = location;
		for ( var key in stateList ) {
			if ( stateList.hasOwnProperty(key) && stateList[key].toUpperCase() === state ) {
				state = location.replace( spelledOutState, key );
				console.log( state );
			}
		}



		// fs.appendFile('usa_counties_aurora_data.json', JSON.stringify( auroraData[i] ) + ',\n', 'utf-8');
	}
}



// 	// state is already abbreviated
// 	else {
// 		fs.appendFile('usa_counties_aurora_data.json', JSON.stringify( auroraData[i] ) + ',\n', 'utf-8');
// 	}

// }
// console.log('usa_counties_aurora_data.json is ready');

