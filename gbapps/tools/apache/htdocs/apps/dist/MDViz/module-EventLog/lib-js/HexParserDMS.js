
'use strict';

(function () {

function HexParserDMS() {

	this.specification = [
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

	this.lookupSide = {
		'41' : 'A',
		'42' : 'B'
	};


	this.lookupModuleNumber = {
		"A" : {
			'1' : '43',
			'2' : '34',
			'3' : '25',
			'4' : '20',
			'5' : '11',
			'6' : '2',
		},
		"B" : {
			'1' : '29',
			'2' : '23',
			'3' : '17',
			'4' : '14',
			'5' : '8',
			'6' : '2',
		}
	};

}


// paramName = "DMS_A_Temp1_mod43"
HexParserDMS.prototype.makeParamName = function(side, id, moduleNumber) {
	var paramName = "DMS_" + side + "_Temp" + id + "_Mod" + moduleNumber;
	return paramName;
}

HexParserDMS.prototype.getNamesAll = function() {
	const LookupModuleNumber = this.lookupModuleNumber;
	var names = [];
	for (var side in LookupModuleNumber) {
		for (var id in LookupModuleNumber[side]) {
			var moduleNumber = LookupModuleNumber[side][id];
			var paramName = this.makeParamName(side, id, moduleNumber);
			names.push(spec[i].name);
		}
	}
	names.sort();
	return names;
}

HexParserDMS.prototype.getSpecs = function(eventId) {
	var specsAll = this.specification;
	var specsMatch = [];
	for (var i=0; i<specsAll.length; i++) {
		if (eventId===specsAll[i].id) specsMatch.push(specsAll[i]);
	}
	return specsMatch;
}

/*
ret = {
	"DMS_A_Temp1_mod43"	: 25
	unit				: 'degC'
	datetime			: Date(...)
}
*/
HexParserDMS.prototype.parse = function(record) {
	// (E A1 13 CF 00 41 00 22) DMS Temperature 1: current value
	var tokens = record.event_text.match(/\(E \w\w \w\w \w\w \w\w (\w\w) (\w\w) (\w\w)\) DMS Temperature (\d+)/);

	if (tokens == null) {
		console.log("event_text=", record.event_text)
		throw "bad event_text"
	}

	var p2 = tokens[1];
	var p3 = tokens[2];
	var p4 = tokens[3];
	var id = tokens[4];

	var side = this.lookupSide[p2];
	var moduleNumber = this.lookupModuleNumber[side][id];
	var paramName = this.makeParamName(side, id, moduleNumber);

	var valueHex = "0x" + p3 + p4;
	var value = Number(valueHex);

	var meas = {
		datetime	: record.datetime,
		// unit		: "degC"
	};

	meas[paramName] = value;

	return meas;
}

HexParserDMS.prototype.getName = function(meas) {
	var paramName = "unknown";
	for (var fieldName in meas) {
		if (fieldName != "datetime" && fieldName != "unit") {
			paramName = fieldName;
			break;
		}
	}
	return paramName;
}

HexParserDMS.prototype.parseAll = function(listEventLogObjects) {
	var measurements = [];
	var hashNames = {};


	for (var i=0; i<listEventLogObjects.length; i++) {
		var hexdata = listEventLogObjects[i].hexdata;

		for (var k=0; k<hexdata.length; k++) {
			var record = hexdata[k];

			if (
				record.event_source==='CT_DMS' && (
					record.event_id==207
					|| record.event_id==217
					|| record.event_id==227
					|| record.event_id==237
					|| record.event_id==251
					|| record.event_id==252
				)
			) {
				var meas = this.parse(record);
				measurements.push(meas);
				var paramName = this.getName(meas);
				hashNames[paramName] = 1;
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

HexParserDMS.prototype.getUnit = function(name) {
	return "degC";
}

window.HexParserDMS = HexParserDMS;

}())
