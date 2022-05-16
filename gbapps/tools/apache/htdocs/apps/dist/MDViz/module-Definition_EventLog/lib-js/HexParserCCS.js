
function HexParserCCS() {
}

HexParserCCS.specification = [
	{ id:34,	pbyte:'p12',	scale:0.1,	unit:'degC',	name:'Air outlet temperature' },
	{ id:35,	pbyte:'p12',	scale:0.1,	unit:'degC',	name:'Air inlet temperature' },
	{ id:36,	pbyte:'p12',	scale:0.1,	unit:'degC',	name:'Water outlet temperature' },
	{ id:37,	pbyte:'p12',	scale:0.1,	unit:'degC',	name:'Water inlet temperature' },
	{ id:39,	pbyte:'p12',	scale:0.1,	unit:'degC',	name:'External WCS glycol temperature' },
	{ id:40,	pbyte:'p12',	scale:0.1,	unit:'degC',	name:'DMS temperature' },
	{ id:41,	pbyte:'p12',	scale:0.1,	unit:'degC',	name:'Tube temperature' },
	{ id:43,	pbyte:'p12',	scale:1,	unit:'rpm',		name:'Fanspeed' },
	{ id:43,	pbyte:'p34',	scale:1,	unit:'-',		name:'Fanspeed control signal' },
	{ id:44,	pbyte:'p12',	scale:1,	unit:'Liter/h',	name:'Waterflow' },
	{ id:44,	pbyte:'p34',	scale:1,	unit:'-',		name:'Waterflow mixer valve control' },
	{ id:46,	pbyte:'p12',	scale:1,	unit:'rev/m^3',	name:'Fanspeed-Airflow ratio' },
];

// "(E 01 13 22 00 CD 00 05) Air outlet temperature monitoring"
HexParserCCS.lookupCoolingType = {
	'00' : 'unknown cooling type',
	'01' : 'AirCooling',
	'02' : 'WaterCooling P45',
	'03' : 'WaterCooling P46',
	'04' : 'WaterCooling P46S',
	'05' : 'WaterCooling P47',
	'06' : 'WaterCooling P45S',
	'07' : 'WaterCooling P46_2',
	'08' : 'WaterCooling P47_2',
	'09' : 'AirCooling P46_2'
};

HexParserCCS.getNamesAll = function() {
	var spec = HexParserCCS.specification;
	var names = [];
	for (var i=0; i<spec.length; i++) {
		names.push(spec[i].name);
	}
	names.sort();
	return names;
}

HexParserCCS.getSpecs = function(eventId) {
	var specsAll = HexParserCCS.specification;
	var specsMatch = [];
	for (var i=0; i<specsAll.length; i++) {
		if (eventId===specsAll[i].id) specsMatch.push(specsAll[i]);
	}
	return specsMatch;
}

/*
ret = {
	"Air inlet temperature"	: 25.6
	unit					: 'degC'
	datetime				: Date(...)
}
*/
HexParserCCS.parse = function(record, spec) {
	// tokens[1] = p1, tokens[2] = p2 etc.
	var tokens = record.event_text.match(/\(E \w\w \w\w \w\w (\w\w) (\w\w) (\w\w) (\w\w)/);

	var valueHex = '';
	if			(spec.pbyte === 'p12')	valueHex = '0x' + tokens[1] + tokens[2];
	else if	(spec.pbyte === 'p34')	valueHex = '0x' + tokens[3] + tokens[4];
	else								throw 'unknown pbyte flag';

	var value = Number(valueHex) * spec.scale;
	value = Math.round(value*10)/10;

	var meas = {
		datetime	: record.datetime,
		unit		: spec.unit
	};
	meas[spec.name] = value;

	return meas;
}


HexParserCCS.parseAll =function(listEventLogObjects) {
	var measurements = [];
	var hashNames = {};

	for (var i=0; i<listEventLogObjects.length; i++) {
		var hexdata = listEventLogObjects[i].hexdata;

		for (var k=0; k<hexdata.length; k++) {
			var record = hexdata[k];

			if (record.event_source==='CT_CCS') {
				// find specification for record
				var specs = HexParserCCS.getSpecs(record.event_id);

				for (var j=0; j<specs.length; j++) {
					var meas = HexParserCCS.parse(record, specs[j]);
					measurements.push(meas);
					hashNames[specs[j].name] = 1;
				}
			}
		}
	}

	var namesFound = [];
	for (var k in hashNames) {
		namesFound.push(k);
	}
	namesFound.sort();

	var ret = {
		measurements	: measurements,
		namesFound		: namesFound
	};

	return ret;
}

HexParserCCS.getUnit = function(name) {
	var specsAll = HexParserCCS.specification;
	for (var i=0; i<specsAll.length; i++) {
		if (name===specsAll[i].name) return specsAll[i].unit;
	}
	return 'unknown';
}

