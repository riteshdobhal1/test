
'use strict';

(function () {

function DefinitionEventLogParser() {
	this.delim = "\t";
	this.indexTimestamp = 0;
	this.numCols = 6;
}

const TIMESTAMP_FIELD_NAME = "datetime";


DefinitionEventLogParser.prototype.extractBasicEvents = function(listRecords) {
	var basicEvents = {};
	var lastScanKind = undefined;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		var typeBasicEvent = undefined;

		if (record.event_id===1531) {
			typeBasicEvent = "Computer ON";
			// console.log("record=", record)
		}
		// CT_SUI	100	Receiving the notification SriGantryOk
		else if (record.event_id===100 && record.event_source==='CT_SUI') {
			if (record.event_text.indexOf('Receiving the notification SriGantryOk') > -1) {
				typeBasicEvent = "System ON";
			}
		}
		else if (record.event_id===22 && record.event_source==='CT_STA') {
			typeBasicEvent = "Checkup started";
		}
		else if (record.event_id===152 && record.event_source==='CT_SRV') {
			var ret = record.event_text.match(/^Function "([^"]+)"/);
			var checkupFunction = ret[1];
			if (checkupFunction !== 'Checkup') {
				typeBasicEvent = "Checkup function started:" + checkupFunction;
			}
		}
		else if (record.event_id===153 && record.event_source==='CT_SRV') {
			var ret = record.event_text.match(/^Function "([^"]+)"/);
			var checkupFunction = ret[1];
			typeBasicEvent = "Checkup function completed:" + checkupFunction;
		}
		else if (record.event_id===269 && record.event_source==='CSA_OSC') {
			typeBasicEvent = "Shutdown begin";
		}
		else if (record.event_id===1532) {
			typeBasicEvent = "Shutdown end";
		}
		else if (record.event_id===493 && record.event_source==='CT_IS') {
			var ret = record.event_text.match(/@Mode kind@=#([^#]+)#/);
			var kind = ret[1].replace('Ml', '');
			typeBasicEvent = "Scan begin:" + kind;
			lastScanKind = kind;
		}
		else if (record.event_id===494 && record.event_source==='CT_IS') {
			typeBasicEvent = "Scan end:" + lastScanKind;
			// console.log(2343, record.datetime, lastScanKind)
		}
		else if (record.event_id===68 && record.event_source==='CT_CHR') {
			typeBasicEvent = "Patient begin";
		}
		else if (record.event_id===108 && record.event_source==='CT_CHR') {
			typeBasicEvent = "Patient closed";
		}

		if (typeBasicEvent != undefined) {
			if (basicEvents[typeBasicEvent] == undefined) {
				basicEvents[typeBasicEvent] = [];
			}
			basicEvents[typeBasicEvent].push(record.datetime);
		}
	}

	return basicEvents;
}

DefinitionEventLogParser.prototype.extractFirmwareInfo = function(listRecords) {
	var foundFirmwareInfo = false;
	var detailsDay = [];
	var numErrorMismatchDay = 0;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==='CT_GSV') {
			if (record.event_id===214 || record.event_id===216) {
				detailsDay.push(record);
				foundFirmwareInfo = true;
			}
			if (record.event_id===216) {
				numErrorMismatchDay++;
			}
		}
	}

	var firmwareInfo = {
		foundFirmwareInfo	: foundFirmwareInfo,
		detailsDay			: detailsDay,
		numErrorMismatchDay	: numErrorMismatchDay,
	};

	return firmwareInfo;
}

DefinitionEventLogParser.prototype.extractMeasurements = function(listRecords) {
	const preselected = [
		"Air inlet temperature",
		"Air outlet temperature",
		"Water inlet temperature",
		"Water outlet temperature",
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
parse sensor values CCS
*/
function extractMeasurementsCCS(listRecords) {
	const groupID = "CCS";
	const groupLabel = "Temperature (CCS meas.)";

	var measValues = [];
	var parserCCS = new HexParserCCS();

	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==='CT_CCS') {
			// HexParserCCS
			var listMeas = parserCCS.parseSingle(record);
			measValues = measValues.concat(listMeas);
			// console.log("record=", record)
			// console.log("listMeas=", listMeas)
			// break
		}
	}

	// console.log("measValues=", measValues)
	// throw 82774

	// limits
	const limits = {
		"Air inlet temperature"				: { min: 0, max: 40 },
		"Air outlet temperature"			: { min: 0, max: 40 },
		"DMS temperature"					: { min: 0, max: 100 },
		"External WCS Control Output"		: { min: 0, max: 40 },
		"External WCS glycol temperature"	: { min: 0, max: 40 },
		"Fanspeed"							: { min: 0, max: 4000 },
		"Room humidity"						: { min: 0, max: 100 },
		"Room temperature"					: { min: 0, max: 40 },
		"Tube temperature"					: { min: 0, max: 100 },
		"Water inlet temperature"			: { min: 0, max: 40 },
		"Water outlet temperature"			: { min: 0, max: 40 },
		"Waterflow"							: { min: 0, max: 4000 },
		// added 2020-04-02
		"Air flow"							: { min: 0, max: 5000 },
	};


	// units
	const units = {
		"Air inlet temperature"				: "degC",
		"Air outlet temperature"			: "degC",
		"DMS temperature"					: "degC",
		"External WCS Control Output"		: "degC",
		"External WCS glycol temperature"	: "degC",
		"Fanspeed"							: "rpm",
		"Fanspeed control signal"			: "-",
		"Fanspeed-Airflow ratio"			: "rev/m^3",
		"Room humidity"						: "%",
		"Room temperature"					: "degC",
		"Tube temperature"					: "degC",
		"Water inlet temperature"			: "degC",
		"Water outlet temperature"			: "degC",
		"Waterflow"							: "Liter/h",
		"Waterflow mixer valve control"		: "-",
		// added 2020-04-02
		"Air flow"							: "m^3/h",
	};

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
parse DMS temperature values
*/
function extractMeasurementsDMS(listRecords) {
	const groupID = "DMS";
	const groupLabel = "Temperature (DMS modules)";
	const limitsMeasDMS = { min: 0, max: 100 };

	var measValues = [];
	var parserDMS = new HexParserDMS();
	const listIdDMS = [207,217,227,237,251,252];
	var hashNames = {};

	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];

		if (record.event_source==='CT_DMS') {
			if (listIdDMS.indexOf(record.event_id) != -1) {
				var meas = parserDMS.parse(record);
				measValues.push(meas);
				// console.log("record=", record)
				// console.log("meas=", meas)
				// break
				for (var name in meas) {
					if (name != TIMESTAMP_FIELD_NAME) {
						hashNames[name] = 1;
					}
				}
			}
		}
	}

	// console.log("measValues=", measValues)
	// throw 82774

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
parse ECG values
            P1 P2 P3 P4
(E D0 13 5C 0B 0B 0C FF)
*/
function transformValueECG(x) {
	var y = undefined;
	if (x < 50) {
		y = 3 * x;
	}
	else {
		y = x + 100;
	}
	return y;
}
function extractMeasurementsECG(listRecords) {
	const groupID = "ECG";
	const groupLabel = "ECG impedance";
	const regexECG = /\(E \w\w \w\w \w\w (\w\w) (\w\w) (\w\w) (\w\w)/;

	var measValues = [];

	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];

		if (record.event_source == 'CT_CPI' && record.event_id == 92) {
			var tokens = record.event_text.match(regexECG);
			if (tokens == null) {
				console.log("bad event_text=", record)
			}

			var p1 = tokens[1];
			var p2 = tokens[2];
			var p3 = tokens[3];
			var p4 = tokens[4];

			var valueRA = transformValueECG( parseInt(p1, 16) );
			var valueLA = transformValueECG( parseInt(p2, 16) );
			var valueLL = transformValueECG( parseInt(p3, 16) );
			var valueRL = transformValueECG( parseInt(p4, 16) );

			var meas = {};
			meas[TIMESTAMP_FIELD_NAME] = record.datetime;
			meas["Impedance RA"] = valueRA;
			meas["Impedance LA"] = valueLA;
			meas["Impedance LL"] = valueLL;
			meas["Impedance RL"] = valueRL;

			measValues.push(meas);
		}
	}

	// console.log("measValues=", measValues)
	// throw 82774

	// limits
	var limits = {
		"Impedance RA" : { min: 0, max: 200 },
		"Impedance LA" : { min: 0, max: 200 },
		"Impedance LL" : { min: 0, max: 200 },
		"Impedance RL" : { min: 0, max: 200 },
	};

	// adapt upper limit
/*
	for (var i=0; i<measValues.length; i++) {
		var meas = measValues[i];
		for (var name in limits) {
			if (limits[name].max < meas[name]) {
				limits[name].max = meas[name];
			}
		}
	}
*/
	// console.log("limits=", limits)
	// throw 4325349


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



DefinitionEventLogParser.prototype.parse = function(fileAsString) {
	var result = this.readLogdata(fileAsString);
	return result;
}

DefinitionEventLogParser.prototype.parse_OLD = function(fileAsString) {
	var ret = this.readLogdata(fileAsString);
	var logdata = ret.logdata;

	//this.sortLogdata(logdata);
	logdata.reverse();		// assume that lines are sorted newest first

	var metadata = this.readMetadata(logdata);

	var result = {
		metadata : metadata,
		logdata  : logdata,
		hexdata  : ret.hexdata.reverse(),
		prfdata  : ret.prfdata.reverse()
	};

	return result;
}

DefinitionEventLogParser.prototype.parseMetadataString = function(eventText) {
	var s = eventText.replace(/Current system configuration:\s*/, '');
	var tokens = s.split(/;\s*/);
	var metadata = {};
	for (var i=0; i<tokens.length; i++) {
		if (tokens[i].length > 0) {
			if (tokens[i].indexOf('=') >= 0) {
				var keyValue = tokens[i].split('=');
				var key = keyValue[0];
				var value = keyValue[1];
				metadata[key] = value;
			}
		}
	}
	return metadata;
}

DefinitionEventLogParser.prototype.readMetadata = function(logdata) {
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

DefinitionEventLogParser.prototype.parseTimestamp = function(sDate, sTime) {
	// 2015-12-25
	// 00:01:01
	var date = new Date(sDate + 'T' + sTime);
	if (date.toString() === 'Invalid Date') {
		throw 'DefinitionEventLogParser: Timestamp has unknown format.';
	}
	return date;
}

DefinitionEventLogParser.prototype.parseDataLine = function(strInput) {
	var tokens = strInput.split(this.delim);
	if (tokens.length != this.numCols) {
		throw 'DefinitionEventLogParser: Input file must have ' + this.numCols + ' columns.';
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

DefinitionEventLogParser.prototype.readLogdata = function(fileAsString) {
	// console.log("DefinitionEventLogParser.readLogdata start")

	// var _self = this;

	var datalines = fileAsString.split("\n");
	var nLines = datalines.length;

	// no header in event log files
	var iFirst = 0;

	var logdata = [];
	var hexdata = [];
	var prfdata = [];
	var regexHex = /^\s*\(E /;

	// convert raw strings to records
	var listRecords = [];
	for (var i=iFirst; i<nLines; i++) {
		var n = datalines[i].length;
		if (n > 0) {
			var record = this.parseDataLine(datalines[i]);
			listRecords.push(record);
		}
	}
	var nRecords = listRecords.length;
	// console.log("nRecords=", nRecords)


	// free memory
	datalines = null;


	// parse system infos
	var metadata = undefined;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==='CT_SCF' && record.event_id===7) {
			metadata = this.parseMetadataString(record.event_text);
			metadata.datetime = record.datetime;
			// console.log("record=", i, "metadata.datetime=", metadata.datetime)

			// first match has the most recent timestamp
			// because the app log is sorted newest first
			break
		}
	}

	// parse sensor values CCS
	var measCCS = [];
	var parserCCS = new HexParserCCS();
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==='CT_CCS') {
			// HexParserCCS
			var listMeas = parserCCS.parseSingle(record);
			measCCS = measCCS.concat(listMeas);
			// console.log("record=", record)
			// console.log("listMeas=", listMeas)
			// break
		}
	}

	// parse sensor values DMS
	var measDMS = [];
	var parserDMS = new HexParserDMS();
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==='CT_DMS') {
			const listIdDMS = [207,217,227,237,251,252];
			if (listIdDMS.indexOf(record.event_id) != -1) {
				// HexParserDMS
				var meas = parserDMS.parse(record);
				measDMS.push(meas);
				// console.log("record=", record)
				// console.log("meas=", meas)
				// break
			}
		}
	}


	// sort events chronologically -> necessary for basic events (e.g. scan begin/end)
	listRecords.reverse();


	// parse basic events
	var basicEvents = {};
	var lastScanKind = undefined;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		// ############################### basic events
		var typeBasicEvent = undefined;

		if (record.event_id===1531) {
			typeBasicEvent = "Computer ON";
			// console.log("record=", record)
		}
		// CT_SUI	100	Receiving the notification SriGantryOk
		else if (record.event_id===100 && record.event_source==='CT_SUI') {
			if (record.event_text.indexOf('Receiving the notification SriGantryOk') > -1) {
				typeBasicEvent = "System ON";
			}
		}
		else if (record.event_id===22 && record.event_source==='CT_STA') {
			typeBasicEvent = "Checkup started";
		}
		else if (record.event_id===152 && record.event_source==='CT_SRV') {
			var ret = record.event_text.match(/^Function "([^"]+)"/);
			var checkupFunction = ret[1];
			if (checkupFunction !== 'Checkup') {
				typeBasicEvent = "Checkup function started:" + checkupFunction;
			}
		}
		else if (record.event_id===153 && record.event_source==='CT_SRV') {
			var ret = record.event_text.match(/^Function "([^"]+)"/);
			var checkupFunction = ret[1];
			typeBasicEvent = "Checkup function completed:" + checkupFunction;
		}
		else if (record.event_id===269 && record.event_source==='CSA_OSC') {
			typeBasicEvent = "Shutdown begin";
		}
		else if (record.event_id===1532) {
			typeBasicEvent = "Shutdown end";
		}
		else if (record.event_id===493 && record.event_source==='CT_IS') {
			var ret = record.event_text.match(/@Mode kind@=#([^#]+)#/);
			var kind = ret[1].replace('Ml', '');
			typeBasicEvent = "Scan begin:" + kind;
			lastScanKind = kind;
		}
		else if (record.event_id===494 && record.event_source==='CT_IS') {
			typeBasicEvent = "Scan end:" + lastScanKind;
			// console.log(2343, record.datetime, lastScanKind)
		}
		else if (record.event_id===68 && record.event_source==='CT_CHR') {
			typeBasicEvent = "Patient begin";
		}
		else if (record.event_id===108 && record.event_source==='CT_CHR') {
			typeBasicEvent = "Patient closed";
		}

		if (typeBasicEvent != undefined) {
			if (basicEvents[typeBasicEvent] == undefined) {
				basicEvents[typeBasicEvent] = [];
			}
			basicEvents[typeBasicEvent].push(record.datetime);
		}
		// if (typeBasicEvent == "Computer ON") {
			// console.log("computer on=", i, datalines[i]);
		// }
	}

	/*
	if (record.event_text.match(regexHex)
		&& record.severity.substr(0,1) === 'I' ) {
		// hex data messages with severity 'I' or 'Ir'
		// hexdata.push(record);
	}
	else if (record.event_source === 'CT_PRF') {
		// CT_PRF data
		// prfdata.push(record);
	}
	else {
		// logdata.push(record);
	}
	*/

	var listMeasNamesCCS = extractMeasNames(measCCS);
	var listMeasNamesDMS = extractMeasNames(measDMS);
	// console.log("listMeasNamesCCS=", listMeasNamesCCS)
	// console.log("listMeasNamesDMS=", listMeasNamesDMS)

	var measurements = [];
	if (measCCS.length > 0 || measDMS.length >0) {
		measurements = combineAllMeasurements(measCCS, measDMS);
	}

	// firmware infos
	var foundFirmwareInfo = false;
	var detailsDay = [];
	var numErrorMismatchDay = 0;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==='CT_GSV') {
			if (record.event_id===214 || record.event_id===216) {
				detailsDay.push(record);
				foundFirmwareInfo = true;
			}
			if (record.event_id===216) {
				numErrorMismatchDay++;
			}
		}
	}

	var ret = {
		systemInfo		: metadata,
		basicEvents		: basicEvents,
		measurements	: measurements,
		listMeasNames	: {
			CCS : listMeasNamesCCS,
			DMS : listMeasNamesDMS
		},
		firmwareInfo : {
			foundFirmwareInfo	: foundFirmwareInfo,
			detailsDay			: detailsDay,
			numErrorMismatchDay	: numErrorMismatchDay,
		}
	};
	// console.log("ret=", ret)

	return ret;
}

function extractMeasNames(measCCS) {
	var hashNames = {};

	for (var i=0; i<measCCS.length; i++) {
		var record = measCCS[i];
		for (var key in record) {
			hashNames[key] = 1;
		}
	}

	var namesFound = [];
	for (var k in hashNames) {
		if (k != "datetime") {
			namesFound.push(k);
		}
	}
	namesFound.sort();

	return namesFound;
}


function makeTimestampFirst(measCCS, measDMS) {
	var t1 = measCCS[0].datetime;
	var t2 = measDMS[0].datetime;

	var tpFirstWithData = t1;
	if (t2 < t1) {
		tpFirstWithData = t2;
	}

	var tpFirst = new Date(tpFirstWithData);
	tpFirst.setHours(0);
	tpFirst.setMinutes(0);
	tpFirst.setSeconds(0);
	tpFirst.setMilliseconds(0);
	// console.log(tpFirstWithData);
	// console.log(tpFirst);
	return tpFirst;
}

function makeTimestampLast(measurements) {
	var tpLastWithData = measurements[measurements.length-1].datetime;
	var tpLast = new Date(tpLastWithData);
	tpLast.setHours(23);
	tpLast.setMinutes(59);
	tpLast.setSeconds(59);
	tpLast.setMilliseconds(1000);	// trick to get 0:00 of next day
	// console.log(tpLastWithData);
	// console.log(tpLast);
	return tpLast;
}

function combineAllMeasurements(measCCS, measDMS) {

	var measurements = [];

	// add empty point at beginning
	var tpFirst = makeTimestampFirst(measCCS, measDMS);
	measurements.push({ datetime:tpFirst });

	// merge measurements by timestamp
	var measCCSmerged = mergeByTimestamp(measCCS);
	var measDMSmerged = mergeByTimestamp(measDMS);

	measurements = measurements.concat(measCCSmerged);
	measurements = measurements.concat(measDMSmerged);

	// sort by timestamp
	const tsFieldname = "datetime";
	var sortFunc = function(a, b) {
		return a[tsFieldname] - b[tsFieldname];
	};
	measurements.sort(sortFunc);

	// add empty point at end
	var tpLast = makeTimestampLast(measurements);
	measurements.push({ datetime:tpLast });

	return measurements;
}

function mergeByTimestamp(measurements) {
	const tsFieldname = "datetime";
	const n = measurements.length;

	var hashTimestamps = {};
	for (var i=0; i<n; i++) {
		var ts = measurements[i][tsFieldname];
		var tskey = String(Number(measurements[i][tsFieldname]));
		// hashTimestamps[tskey] = { datetime:ts };
		hashTimestamps[tskey] = {};
		hashTimestamps[tskey][tsFieldname] = ts;
	}

	for (var i=0; i<n; i++) {
		var record = measurements[i];
		for (var key in record) {
			if (key != tsFieldname) {
				var tskey = String(Number(record[tsFieldname]));
				hashTimestamps[tskey][key] = record[key];
			}
		}
	}

	var merged = [];
	for (var tskey in hashTimestamps) {
		var record = hashTimestamps[tskey];
		merged.push(record);
	}
	var sortFunc = function(a, b) {
		return a[tsFieldname] - b[tsFieldname];
	};
	merged.sort(sortFunc);

	return merged;
}

DefinitionEventLogParser.prototype.sortLogdata = function(logdata) {
	// console.log('sortLogdata start');
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	logdata.sort(sortFunc);
	// console.log(logdata[0].datetime.toLocaleString());
	// console.log(logdata[1].datetime.toLocaleString());
}

window.DefinitionEventLogParser = DefinitionEventLogParser;

}())
