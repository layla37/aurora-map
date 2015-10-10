var fs = require('fs');
var contents = fs.readFileSync("aurora_data.json", "utf8");
var jsonContent = JSON.parse(contents);

var reg1 = /.*?(Alabama|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New\sHampshire|New\sJersey|New\sMexico|New\sYork|North\sCarolina|North\sDakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode\sIsland|South\sCarolina|South\sDakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West\sVirginia|Wisconsin|Wyoming).*/ig;

var reg2 = /.*?\s+(?:(A[LRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])).*/g;


for ( var i = 0; i < jsonContent.length; i++ ) {
	if( reg1.test(jsonContent[i].location) || reg2.test(jsonContent[i].location) ) {
		console.log(jsonContent[i].location);
		fs.appendFile('usa_aurora_data.json', JSON.stringify(jsonContent[i]) + ',\n', 'utf-8');

	}

}
console.log('usa_aurora_data.json is ready');

