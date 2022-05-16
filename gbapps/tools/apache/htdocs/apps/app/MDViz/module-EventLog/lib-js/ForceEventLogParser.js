
'use strict';

(function () {

function ForceEventLogParser() {
	// plot: 1=line, 2=indicator, 0=none
	this.columnDef = [
		/* 0 */	{ id: 'datetime',			plot: 0, min: 0, max: 0 },
		/* 1 */	{ id: 'DMS_Temp_1_degC',	plot: 1, min: 10, max: 60 },
		/* 2 */	{ id: 'DMS_Temp_2_degC',	plot: 1, min: 10, max: 60 },
		/* 3 */	{ id: 'DMS_Temp_3_degC',	plot: 1, min: 10, max: 60 },
		/* 4 */	{ id: 'DMS_Temp_4_degC',	plot: 1, min: 10, max: 60 },
		/* 5 */	{ id: 'DMS_Temp_1_degF',	plot: 1, min: 50, max: 140 },
		/* 6 */	{ id: 'DMS_Temp_2_degF',	plot: 1, min: 50, max: 140 },
		/* 7 */	{ id: 'DMS_Temp_3_degF',	plot: 1, min: 50, max: 140 },
		/* 8 */	{ id: 'DMS_Temp_4_degF',	plot: 1, min: 50, max: 140 },
	];

	this.delim = "\t";
	this.indexTimestamp = 0;

	//this.numCols = this.columnDef.length;
	this.numCols = 6;
}

const TIMESTAMP_FIELD_NAME = "datetime";


ForceEventLogParser.prototype.extractBasicEvents = function(listRecords) {
	var extractor = new BasicEventExtractorType1();
	var basicEvents = extractor.extractBasicEvents(listRecords);
	return basicEvents;
}

ForceEventLogParser.prototype.extractFirmwareInfo = function(listRecords) {
	var firmwareInfo = undefined;
	return firmwareInfo;
}

ForceEventLogParser.prototype.extractMeasurements = function(listRecords) {
	const preselected = [
		"AirIn",
		"AirOut",
		"WaterIn",
		"WaterOut",
	];
	const listExtractors = [
		extractMeasurementsCCS,
		extractMeasurementsDMS,
		extractMeasurementsECG,
	];

	var measGroups = [];
	for (var i=0; i<listExtractors.length; i++) {
		var extractorFunction = listExtractors[i];
		var meas = extractorFunction(listRecords);
		measGroups.push(meas);
	}

	var measurements = {
		groups		: measGroups,
		preselected	: preselected
	};

	return measurements;
}

/*
parse DMS temperature values
*/
function extractMeasurementsDMS(listRecords) {
	const groupID = "DMS";
	const groupLabel = "Temperature (DMS modules)";
	const regexDMS = /^DMS Temperature (\d+): current value (\d+\.\d+) deg \(module (\d+)/;
	const limitsMeasDMS = { min: 0, max: 90 };

	var measValues = [];
	var hashNames = {};

	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		var side = undefined;
		if (record.event_source == "CT_DAA") {
			side = "A";
		}
		else if (record.event_source == "CT_DAB") {
			side = "B";
		}

		if (side != undefined && record.event_id>=306 && record.event_id<=311) {
			var tokens = record.event_text.match(regexDMS);
			if (tokens == null) {
				console.log("bad record=", record)
				throw "346456456 Force"
			}
			var idTemp = tokens[1];
			var value = Number(tokens[2]);
			var idModule = tokens[3];

			// DMS_A_Temp4_Mod26
			var measName = "DMS_" + side + "_Temp" + idTemp + "_Mod" + idModule;

			var meas = {};
			meas[TIMESTAMP_FIELD_NAME] = record[TIMESTAMP_FIELD_NAME];
			meas[measName] = value;

			measValues.push(meas);
			// console.log("record=", record)
			// console.log("meas=", meas)
			// break

			hashNames[measName] = 1;
		}
	}

	// console.log("measValues=", measValues)
	// throw 35865

	// generate limits and units
	var limits = {};
	var units = {};
	for (var name in hashNames) {
		limits[name] = limitsMeasDMS;
		units[name] = "degC";
	}

	var measurements = {
		groupID		: groupID,
		groupLabel	: groupLabel,
		data		: measValues,
		limits		: limits,
		units		: units
	}

	return measurements;
}

/*
parse sensor values CCS
*/
function extractMeasurementsCCS(listRecords) {
	const groupID = "CCS";
	const groupLabel = "Temperature (CCS meas.)";

	const specification = {
		AirIn:			{ scale:1e-3,	unit:'degC',	},
		AirOut:			{ scale:1e-3,	unit:'degC',	},
		BarometricPressure:	{ scale:1,	unit:'mbar',	},
		ChillerGlycol:	{ scale:1e-3,	unit:'degC',	},
		DCLink_A:		{ scale:1e-3,	unit:'degC',	},
		DCLink_B:		{ scale:1e-3,	unit:'degC',	},
		DMS_A:			{ scale:1e-3,	unit:'degC',	},
		DMS_B:			{ scale:1e-3,	unit:'degC',	},
		FanSpeed:		{ scale:1,	unit:'-',	},
		Humidity:		{ scale:1,	unit:'%',	},
		PDR_A:			{ scale:1e-3,	unit:'degC',	},
		PDR_B:			{ scale:1e-3,	unit:'degC',	},
		RAC_A:			{ scale:1e-3,	unit:'degC',	},
		RAC_B:			{ scale:1e-3,	unit:'degC',	},
		RoomIn:			{ scale:1e-3,	unit:'degC',	},
		TUBE_A:			{ scale:1e-3,	unit:'degC',	},
		TUBE_B:			{ scale:1e-3,	unit:'degC',	},
		ValvePos:		{ scale:1,	unit:'-',	},
		ValvePosSet:	{ scale:1,	unit:'-',	},
		WaterIn:		{ scale:1e-3,	unit:'degC',	},
		WaterOut:		{ scale:1e-3,	unit:'degC',	},
		WFlow:			{ scale:1,	unit:'-',	},
		XRS_A:			{ scale:1e-3,	unit:'degC',	},
		XRS_B:			{ scale:1e-3,	unit:'degC',	},
	};

	const regexCCS = /(\w+)=(\d+)/;

	var measValues = [];
	var hashNames = {};

	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source == "CT_CCS" && record.event_id == 2816) {
			// Measurement WaterOut=4707
			// ---via regex
			var tokens = record.event_text.match(regexCCS);
			var measName = tokens[1];
			var value = Number(tokens[2]);

			var spec = specification[measName];
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
				datetime : record.datetime
			};
			// meas[measName] = value * scale;
			var scaleInv = Math.round(1/scale);
			meas[measName] = value / scaleInv;

			measValues.push(meas);
			// console.log("record=", record)
			// console.log("listMeas=", listMeas)
			// break

			hashNames[measName] = 1;
		}
	}

	// console.log("measValues=", measValues)
	// throw 82774

	// limits
	const limits = {
		'AirIn'				: { min: 0, max: 60 },
		'AirOut'			: { min: 0, max: 60 },
		'BarometricPressure': { min: 900, max: 1100 },
		'ChillerGlycol'		: { min: 0, max: 60 },
		'DCLink_A'			: { min: 0, max: 60 },
		'DCLink_B'			: { min: 0, max: 60 },
		'DMS_A'				: { min: 0, max: 60 },
		'DMS_B'				: { min: 0, max: 60 },
		'FanSpeed'			: { min: 0, max: 4000 },
		'Humidity'			: { min: 0, max: 100 },
		'PDR_A'				: { min: 0, max: 60 },
		'PDR_B'				: { min: 0, max: 60 },
		'RAC_A'				: { min: 0, max: 60 },
		'RAC_B'				: { min: 0, max: 60 },
		'RoomIn'			: { min: 0, max: 60 },
		'TUBE_A'			: { min: 0, max: 60 },
		'TUBE_B'			: { min: 0, max: 60 },
		'ValvePos'			: { min: 0, max: 110 },
		'ValvePosSet'		: { min: 0, max: 110 },
		'WFlow'				: { min: 0, max: 3000 },
		'WaterIn'			: { min: 0, max: 60 },
		'WaterOut'			: { min: 0, max: 60 },
		'XRS_A'				: { min: 0, max: 60 },
		'XRS_B'				: { min: 0, max: 60 },
	};

	// units
	var units = {};
	for (var name in specification) {
		var spec = specification[name];
		units[name] = spec.unit;
	}

	var measurements = {
		groupID		: groupID,
		groupLabel	: groupLabel,
		data		: measValues,
		limits		: limits,
		units		: units
	}

	return measurements;
}

/*
parse ECG values
I  2020-02-14  15:28:34  CT_CPI  95  PMM impedance measurement finished (Dev: impRA: 31, impLA: 42, impLL: 135, impRL: 190)
*/
function extractMeasurementsECG(listRecords) {
	const groupID = "ECG";
	const groupLabel = "ECG impedance";
	const regexECG = /impRA:\s*(\d+), impLA:\s*(\d+), impLL:\s*(\d+), impRL:\s*(\d+)/;

	var measValues = [];

	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];

		if (record.event_source == 'CT_CPI' && record.event_id == 95) {
			var tokens = record.event_text.match(regexECG);
			if (tokens == null) {
				console.log("bad event_text=", record)
			}

			var impRA = Number( tokens[1] );
			var impLA = Number( tokens[2] );
			var impLL = Number( tokens[3] );
			var impRL = Number( tokens[4] );

			var meas = {};
			meas[TIMESTAMP_FIELD_NAME] = record.datetime;
			meas["Impedance RA"] = impRA;
			meas["Impedance LA"] = impLA;
			meas["Impedance LL"] = impLL;
			meas["Impedance RL"] = impRL;

			measValues.push(meas);
		}
	}

	// console.log("measValues=", measValues)
	// throw 82774

	// limits
	const limits = {
		"Impedance RA" : { min: 0, max: 200 },
		"Impedance LA" : { min: 0, max: 200 },
		"Impedance LL" : { min: 0, max: 200 },
		"Impedance RL" : { min: 0, max: 200 },
	};

	// generate units
	var units = {};
	for (var name in limits) {
		units[name] = "kOhm";
	}

	var measurements = {
		groupID		: groupID,
		groupLabel	: groupLabel,
		data		: measValues,
		limits		: limits,
		units		: units
	}

	return measurements;
}



ForceEventLogParser.prototype.parse = function(fileAsString) {
	var ret = this.readLogdata(fileAsString);
	var logdata = ret.logdata;

	//this.sortLogdata(logdata);
	logdata.reverse();		// assume that lines are sorted newest first

	var metadata = this.readMetadata(logdata);

	var result = {
		metadata : metadata,
		logdata  : logdata,
		hexdata  : ret.hexdata.reverse(),
		prfdata  : ret.prfdata.reverse(),
		ccsdata  : ret.ccsdata.reverse(),
		dmsdata_A  : ret.dmsdata_A.reverse(),
		dmsdata_B  : ret.dmsdata_B.reverse()
	};

	return result;
}

ForceEventLogParser.prototype.parseMetadataString = function(eventText) {
	var s = eventText.replace(/Current system configuration:\s*/, '');
	var tokens = s.split(/;\s*/);
	var metadata = {};
	for (var i=0; i<tokens.length; i++) {
		if (tokens[i].length > 0) {
			if (tokens[i].indexOf('=') >= 0) {
				var keyValue = tokens[i].split('=');
				var key = keyValue[0];
				var value = keyValue[1];
				// nicer format for list of software updates
				if (key==='SWUpgradePacks') value = value.replace(/,/g, ', ');
				metadata[key] = value;
			}
		}
	}
	return metadata;
}

ForceEventLogParser.prototype.readMetadata = function(logdata) {
	var metadata = undefined;

	for (var k=0; k<logdata.length; k++) {
		var record = logdata[k];
		if (record.event_source==='CT_SCF' && record.event_id===7) {
			metadata = this.parseMetadataString(record.event_text);
			break;
		}
	}

	return metadata;
}

ForceEventLogParser.prototype.parseTimestamp_XX = function(sDate, sTime) {
	// 2015-12-25
	// 01234567890123456789012
	// 00:01:01
	// 01234567890123456789012
	var yy = Number(sDate.substr(0,4));
	var mm = Number(sDate.substr(5,2))-1;
	var dd = Number(sDate.substr(8,2));
	var HH = Number(sTime.substr(0,2));
	var MM = Number(sTime.substr(3,2));
	var SS = Number(sTime.substr(6,2));
	var MS = 0;

	var date = new Date(yy,mm,dd,HH,MM,SS,MS);
	if (date.toString() === 'Invalid Date') {
		throw 'ForceEventLogParser: Timestamp has unknown format.';
	}

	return date;
}

ForceEventLogParser.prototype.parseTimestamp = function(sDate, sTime) {
	// 2015-12-25
	// 00:01:01
	var date = new Date(sDate + 'T' + sTime);
	if (date.toString() === 'Invalid Date') {
		throw 'ForceEventLogParser: Timestamp has unknown format.';
	}
	return date;
}

ForceEventLogParser.prototype.parseDataLine = function(strInput) {
	var tokens = strInput.split(this.delim);
	if (tokens.length != this.numCols) {
		throw 'ForceEventLogParser: Input file must have ' + this.numCols + ' columns.';
	}

	var record = {
		datetime		: this.parseTimestamp(tokens[1], tokens[2]),
		severity		: tokens[0],
		// date			: tokens[1],
		// time			: tokens[2],
		event_source	: tokens[3],
		event_id		: Number(tokens[4]),
		event_text		: tokens[5],
	};

	return record;
}

ForceEventLogParser.prototype.readLogdata = function(fileAsString) {

	var self = this;

	// read entire file as string
	var n = fileAsString.length;

	var datalines = fileAsString.split("\n");
	var nLines = datalines.length;

	// no header in event log files
	var iFirst = 0;

	var logdata = [];
	var hexdata = [];
	var prfdata = [];
	var regexHex = /^\s*\(E /;
	var ccsdata = [];
	var dmsdata_A = [];
	var dmsdata_B = [];

	// simplified: only CCS measurements and workflow
	var useSimplified = true;

	var isFoundBasicEvent = false;

	// read each line
	for (var i=iFirst; i<nLines; i++) {
		if (datalines[i].length > 0) {
			var record = self.parseDataLine(datalines[i]);
			if (useSimplified) {
				if (record.event_source === 'CT_CCS' && record.event_id === 2816) {
					// CT_CCS data
					ccsdata.push(record);
				}
				else if (record.event_source === 'CT_SCF' && record.event_id === 7) {
					// system config
					logdata.push(record);
				}
				else if (record.event_source=='CT_DAA' && record.event_id>=306 && record.event_id<=311) {
					// system config
					dmsdata_A.push(record);
				}
				else if (record.event_source=='CT_DAB' && record.event_id>=306 && record.event_id<=311) {
					// system config
					dmsdata_B.push(record);
				}
				else {
					var isBasicEvent = false;

					if (record.event_id===1531) isBasicEvent = true;
					else if (record.event_id===1532) isBasicEvent = true;
					else if (record.event_id===100 && record.event_source==='CT_SUI') isBasicEvent = true;
					else if (record.event_id===22 && record.event_source==='CT_STA') isBasicEvent = true;
					else if (record.event_id===152 && record.event_source==='CT_SRV') isBasicEvent = true;
					else if (record.event_id===153 && record.event_source==='CT_SRV') isBasicEvent = true;
					else if (record.event_id===269 && record.event_source==='CSA_OSC') isBasicEvent = true;
					else if (record.event_id===493 && record.event_source==='CT_IS') isBasicEvent = true;
					else if (record.event_id===494 && record.event_source==='CT_IS') isBasicEvent = true;
					else if (record.event_id===68 && record.event_source==='CT_CHR') isBasicEvent = true;
					else if (record.event_id===108 && record.event_source==='CT_CHR') isBasicEvent = true;

					if (isBasicEvent) {
						logdata.push(record);
						// if (!isFoundBasicEvent) console.log("record=", record)
						isFoundBasicEvent = true;
					}
				}
			}
			else {
				if (record.event_text.match(regexHex)
					&& record.severity.substr(0,1) === 'I' ) {
					// hex data messages with severity 'I' or 'Ir'
					hexdata.push(record);
				}
				else if (record.event_source === 'CT_PRF') {
					// CT_PRF data
					prfdata.push(record);
				}
				else if (record.event_source === 'CT_CCS' && record.event_id === 2816) {
					// CT_CCS data
					ccsdata.push(record);
				}
				else {
					logdata.push(record);
				}
			}
		}
	}

	var ret = {
		logdata: logdata,
		hexdata: hexdata,
		prfdata: prfdata,
		ccsdata: ccsdata,
		dmsdata_A: dmsdata_A,
		dmsdata_B: dmsdata_B,
	};

	return ret;
}

ForceEventLogParser.prototype.sortLogdata = function(logdata) {
	// console.log('sortLogdata start');
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	logdata.sort(sortFunc);
	// console.log(logdata[0].datetime.toLocaleString());
	// console.log(logdata[1].datetime.toLocaleString());
}

window.ForceEventLogParser = ForceEventLogParser;

}())
