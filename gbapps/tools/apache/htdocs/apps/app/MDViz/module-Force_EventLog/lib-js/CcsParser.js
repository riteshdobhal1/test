
function CcsParser() {
}

CcsParser.specification = {
	AirIn:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	AirOut:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	BarometricPressure:	{ id:-1,pbyte:'n/a',	scale:1,	unit:'',	},
	ChillerGlycol:	{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	DCLink_A:		{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	DCLink_B:		{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	DMS_A:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	DMS_B:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	FanSpeed:		{ id:-1,	pbyte:'n/a',	scale:1,	unit:'',	},
	Humidity:		{ id:-1,	pbyte:'n/a',	scale:1,	unit:'%',	},
	PDR_A:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	PDR_B:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	RAC_A:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	RAC_B:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	RoomIn:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	TUBE_A:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	TUBE_B:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	ValvePos:		{ id:-1,	pbyte:'n/a',	scale:1,	unit:'',	},
	ValvePosSet:	{ id:-1,	pbyte:'n/a',	scale:1,	unit:'',	},
	WaterIn:		{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	WaterOut:		{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	WFlow:			{ id:-1,	pbyte:'n/a',	scale:1,	unit:'',	},
	XRS_A:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
	XRS_B:			{ id:-1,	pbyte:'n/a',	scale:1e-3,	unit:'degC',	},
};

CcsParser.lookupCoolingType = {
};

CcsParser.getNamesAll = function() {
	var spec = CcsParser.specification;
	var names = [];
	for (var i=0; i<spec.length; i++) {
		names.push(spec[i].name);
	}
	names.sort();
	return names;
}

CcsParser.getSpecs = function(eventId) {
	var specsAll = CcsParser.specification;
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
CcsParser.parse = function(record) {
	// Measurement WaterOut=4707
	// ---via regex
	var tokens = record.event_text.match(/(\w+)=(\d+)/);
	var measName = tokens[1];
	var value = Number(tokens[2]);
	// ---via substring
	// var event_text = record.event_text;
	// var idx = event_text.indexOf('=');
	// var measName = event_text.substr(12, idx-12);
	// var value = Number(event_text.substr(idx+1, event_text.length-idx));

	var spec = CcsParser.specification[measName];
	var scale, unit;
	if (spec !== undefined) {
		scale = spec.scale;
		unit = spec.unit;
	}
	else {
		scale = 1;
		unit = "";
	}

	var meas = {
		datetime	: record.datetime,
		unit		: unit
	};
	// meas[measName] = value * scale;
	var scaleInv = Math.round(1/scale);
	meas[measName] = value / scaleInv;

	var ret = { meas:meas, name:measName };

	return ret;
}


CcsParser.parseAll = function(listEventLogObjects) {
	var measurements = [];
	var hashNames = {};

	for (var i=0; i<listEventLogObjects.length; i++) {
		var ccsdata = listEventLogObjects[i].ccsdata;

		for (var k=0; k<ccsdata.length; k++) {
			var record = ccsdata[k];
			var ret = CcsParser.parse(record);
			measurements.push(ret.meas);
			hashNames[ret.name] = 1;
			// if (k==0) console.log("meas=", meas);
		}
	}

	var namesFound = [];
	for (var k in hashNames) {
		namesFound.push(k);
	}
	namesFound.sort();
	// console.log("namesFound=", namesFound);

	var ret = {
		measurements	: measurements,
		namesFound		: namesFound
	};

	return ret;
}

CcsParser.getUnit = function(name) {
	var unit = CcsParser.specification[name].unit;
	return unit;
}

