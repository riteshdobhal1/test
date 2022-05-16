
'use strict';

(function () {

function PerspectiveEventLogParser() {
}

PerspectiveEventLogParser.prototype.extractBasicEvents = function(listRecords) {
	var basicEvents = {};
	var lastScanKind = undefined;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		var typeBasicEvent = undefined;

		if (record.event_id===1531) {
			typeBasicEvent = "Computer ON";
			// console.log("record=", record)
		}
		// CT_SSQ_503 = Gantry and IRS are ready for scanning
		else if (record.event_id===503 && record.event_source==='CT_SSQ') {
			typeBasicEvent = "System ON";
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
		// CT_SSQ_137 = SsqMeas: &Scan begin&
		else if (record.event_id===137 && record.event_source==='CT_SSQ') {
			var ret = record.event_text.match(/@Mode kind@=#([^#]+)#/);
			var kind = ret[1].replace('Ml', '');
			typeBasicEvent = "Scan begin:" + kind;
			lastScanKind = kind;
		}
		// CT_SSQ_406 = SsqCtrl: Measurement done with success [&Scan end&
		else if (record.event_id===406 && record.event_source==='CT_SSQ') {
			typeBasicEvent = "Scan end:" + lastScanKind;
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

PerspectiveEventLogParser.prototype.extractFirmwareInfo = function(listRecords) {
	var firmwareInfo = undefined;
	return firmwareInfo;
}

/*
var measurements = {
	groups : [
			{
				groupID		: "CCS"
				groupLabel	: "Temperature (CCS meas.)" --------> for selection box
				data		: [
					{ datetime: xx, MEAS: value }, -----> single value
					{ datetime: xx, MEAS1: value1, MEAS2: value2, MEAS3: value3 } ---> multiple values
				]
				limits : {
					MEAS1 : { min: ##, max: ## },
					MEAS2 : { min: ##, max: ## },
				}
				units : {
					MEAS1 : "unit1",
					MEAS2 : "unit2",
				}
			}
		],
	preselected = [ "MEAS1", "MEAS2", "MEAS3", "MEAS4" ]
}
*/

PerspectiveEventLogParser.prototype.extractMeasurements = function(listRecords) {
	const preselected = [ "DMS_Temp1", "DMS_Temp2", "DMS_Temp3", "DMS_Temp4" ];
	const listExtractors = [
		extractMeasurementsDMS,
		// extractMeasurementsMAS,
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
I  17-Jan-2020 12:04:56  17  CT_ITF  0  DMSstat: Spiral tot Rdg:  41284 TInt 350 Temp: DMS Mechanics 33.0 31.8   FEE 39.3 38.9 38.9 38.1 37.3 37.3
*/
function extractMeasurementsDMS(listRecords) {
	const groupID = "DMS";
	const groupLabel = "Temperature (DMS modules)";
	const regexDMS = /FEE\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)/;
	var measDMS = [];
	var hashNames = {};
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_id===17 && record.event_source==="CT_ITF") {
			var matches = regexDMS.exec(record.event_text);
			if (matches != null) {
				if (matches.length == 7) {
					for (var k=1; k<=6; k++) {
						var measName = "DMS_Temp" + String(k);
						var meas = { datetime: record.datetime };
						meas[measName] = Number(matches[k]);
						measDMS.push(meas);
						hashNames[measName] = 1;
					}
				}
				else {
					console.log("found truncated DMS info:", record)
					// throw 34634643
				}
			}
		}
	}

	// console.log("measDMS=", measDMS)
	// throw 82774

	// generate limits
	var limits = {};
	for (var k=1; k<=6; k++) {
		var measName = "DMS_Temp" + String(k);
		limits[measName] = { min: 0, max: 100 };
	}

	// generate units
	var units = {};
	for (var k=1; k<=6; k++) {
		var measName = "DMS_Temp" + String(k);
		units[measName] = "degC";
	}

	var measurements = {
		groupID		: groupID,
		groupLabel	: groupLabel,
		data		: measDMS,
		limits		: limits,
		units		: units
	}

	return measurements;
}


/*
I	2020-02-12	06:33:19	CT_MAS	6107	temperature gantry room  (E 00 03 6b 03 e9 19 19)
I	2020-02-12	06:33:19	CT_MAS	6108	temperature inside gantry (E 00 03 6c 03 e9 15 15)
I	2020-02-12	06:33:19	CT_MAS	6109	temperature MAS board (E 00 03 6d 03 e9 2d 2d)
*/
function extractMeasurementsMAS(listRecords) {
	const groupID = "MAS";
	const groupLabel = "Temperature gantry & MAS";
	const Config = {
		6107 : { name:"Temp_gantry_room",	unit:"degC", limits:{ min: 0, max: 40 } },
		6108 : { name:"Temp_inside_gantry",	unit:"degC", limits:{ min: 0, max: 40 } },
		6109 : { name:"Temp_MAS_board",		unit:"degC", limits:{ min: 0, max: 90 } },
	};
	const regexMAS = /(\w+)\s+(\w+)\)\s*$/;
	var measMAS = [];
	var hashNames = {};
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==="CT_MAS"
				&& record.event_id >= 6107
				&& record.event_id <= 6109
		) {
			var matches = regexMAS.exec(record.event_text);
			if (matches != null) {
				if (matches.length == 3) {
					var p1 = matches[1];
					var p2 = matches[2];
					// var measName = LookupMeasName[record.event_id];
					var measName = Config[record.event_id].name;
					var meas = { datetime: record.datetime };
					meas[measName] = parseInt(p1, 16);
					measMAS.push(meas);
					hashNames[measName] = 1;
				}
				else {
					console.log("found truncated MAS info:", record)
					// throw 673464
				}
			}
		}
	}

	// console.log("measMAS=", measMAS)
	// console.log("measMAS[0:5]=", measMAS.slice(0,5))
	// throw 82774

	// limits
	var limits = {};
	for (var id in Config) {
		var measName = Config[id].name;
		limits[measName] = Config[id].limits;
	}

	// units
	var units = {};
	for (var id in Config) {
		var measName = Config[id].name;
		units[measName] = Config[id].unit;
	}

	var measurements = {
		groupID		: groupID,
		groupLabel	: groupLabel,
		data		: measMAS,
		limits		: limits,
		units		: units
	}

	return measurements;
}



PerspectiveEventLogParser.prototype.parse = function(fileAsString) {
	var result = this.readLogdata(fileAsString);
	return result;
}

PerspectiveEventLogParser.prototype.parse_OLD = function(fileAsString) {
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

PerspectiveEventLogParser.prototype.parseMetadataString = function(eventText) {
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

PerspectiveEventLogParser.prototype.readMetadata = function(logdata) {
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

PerspectiveEventLogParser.prototype.parseTimestamp = function(sDate, sTime) {
	// 2015-12-25
	// 00:01:01
	var date = new Date(sDate + 'T' + sTime);
	if (date.toString() === 'Invalid Date') {
		throw 'PerspectiveEventLogParser: Timestamp has unknown format.';
	}
	return date;
}

PerspectiveEventLogParser.prototype.parseDataLine = function(strInput) {
	var tokens = strInput.split(this.delim);
	if (tokens.length != this.numCols) {
		throw 'PerspectiveEventLogParser: Input file must have ' + this.numCols + ' columns.';
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

PerspectiveEventLogParser.prototype.readLogdata = function(fileAsString) {
	// console.log("PerspectiveEventLogParser.readLogdata start")

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

PerspectiveEventLogParser.prototype.sortLogdata = function(logdata) {
	// console.log('sortLogdata start');
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	logdata.sort(sortFunc);
	// console.log(logdata[0].datetime.toLocaleString());
	// console.log(logdata[1].datetime.toLocaleString());
}

window.PerspectiveEventLogParser = PerspectiveEventLogParser;

}())

