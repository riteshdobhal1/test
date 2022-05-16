
'use strict';

(function () {

function EventLogParser() {
	this.delim = "\t";
	this.indexTimestamp = 0;
	this.numCols = 6;
}

const TIMESTAMP_FIELD_NAME = "datetime";

EventLogParser.prototype.parse = function(fileAsString) {
	// convert string to list of records
	var listRecords = this.convertToRecords(fileAsString);

	// extract system infos -> only most recent one
	var systemInfo = this.extractSystemInfo(listRecords);

	// sort chronologically
	listRecords.reverse();

	// extract first and last timestamp
	var timestampFirst = listRecords[0].datetime
	var timestampLast = listRecords[listRecords.length-1].datetime

	// load specialized parser by system type
	var parserSpecial = this.loadSpecializedParser(systemInfo);

	if (parserSpecial == undefined) {
		throw "Cannot determine system family. Supported: Definition, Force, Perspective."
	}

	// extract infos by system type
	var basicEvents = parserSpecial.extractBasicEvents(listRecords);
	var firmwareInfo = parserSpecial.extractFirmwareInfo(listRecords);

	// parserSpecial extracts all measurement groups independently
	/*
	var measurements = [
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
	];
	*/
	var measurements = parserSpecial.extractMeasurements(listRecords);

	// prepare measurements for plot
	/*
	var measurementsForPlot = {
		plotdata : [...],  ------------> all measurements combined to a single list
		listMeasNames : [  ----------> fill selection box
			{ groupID: "CCS", groupLabel: "Temperature (CCS meas.)", names: [...] }
		],
		limits	: limits,
		units	: units
	};
	*/
	var measurementsForPlot = prepareForPlot(measurements);

	// collect results
	var logdata = {
		systemInfo		: systemInfo,
		basicEvents		: basicEvents,
		measurements	: measurementsForPlot,
		firmwareInfo	: firmwareInfo,
		timestampFirst	: timestampFirst,
		timestampLast	: timestampLast
	};

	// console.log("logdata=", logdata)
	// throw 453453

	return logdata;
}

EventLogParser.prototype.convertToRecords = function(fileAsString) {
	console.log("EventLogParser.convertToRecords start")

	var datalines = fileAsString.split("\n");
	var nLines = datalines.length;

	// no header in event log files
	var iFirst = 0;

	// convert raw strings to records
	var listRecords = [];
	for (var i=iFirst; i<nLines; i++) {
		var n = datalines[i].length;
		if (n > 0) {
			var record = this.parseDataLine(datalines[i]);
			listRecords.push(record);
		}
	}

	// free memory explicitly
	datalines = null;

	return listRecords;
}

// new version: select the longest event text to avoid getting a text with missing infos
EventLogParser.prototype.extractSystemInfo = function(listRecords) {
	var recordLongestText = undefined;
	var lengthMax = undefined;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==='CT_SCF' && record.event_id===7) {
			if (recordLongestText == undefined) {
				recordLongestText = record;
				lengthMax = record.event_text.length;
			}
			else {
				if (record.event_text.length > lengthMax) {
					recordLongestText = record;
					lengthMax = record.event_text.length;
				}
			}
		}
	}

	var systemInfo = undefined;
	if (recordLongestText != undefined) {
		systemInfo = this.parseMetadataString(recordLongestText.event_text);
		systemInfo.datetime = recordLongestText.datetime;
	}

	if (systemInfo == undefined) {
		// determine system type based on events
		systemInfo = this.getSystemTypeBasedOnEvents(listRecords);
	}

	return systemInfo;
}

// old version: select event text with the most recent timestamp
EventLogParser.prototype.extractSystemInfo_OLD = function(listRecords) {
	var systemInfo = undefined;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
		if (record.event_source==='CT_SCF' && record.event_id===7) {
			systemInfo = this.parseMetadataString(record.event_text);
			systemInfo.datetime = record.datetime;
			// console.log("record=", i, "systemInfo.datetime=", systemInfo.datetime)

			// first match has the most recent timestamp
			// because the app log is sorted newest first
			break
		}
	}

	if (systemInfo == undefined) {
		// determine system type based on events
		systemInfo = this.getSystemTypeBasedOnEvents(listRecords);
	}

	return systemInfo;
}

EventLogParser.prototype.getSystemTypeBasedOnEvents = function(listRecords) {
	var ret = { SystemType: "xxxx", lengthText: 0 }
	// throw "not implemented"
	throw "Cannot determine system family.<br>Supported are: Definition, Force, Perspective."
}

EventLogParser.prototype.loadSpecializedParser = function(systemInfo) {
	var parserSpecial = undefined;
	var systemType = systemInfo["SystemType"].toLowerCase();
	console.log("systemType=", systemType)
	if (systemType.indexOf("definition") != -1) {
		parserSpecial = new DefinitionEventLogParser();
	}
	else if (systemType.indexOf("force") != -1) {
		parserSpecial = new ForceEventLogParser();
	}
	else if (systemType.indexOf("perspective") != -1) {
		parserSpecial = new PerspectiveEventLogParser();
	}
	else {
		// treat all other types like Definition
		parserSpecial = new DefinitionEventLogParser();
	}
	return parserSpecial;
}


EventLogParser.prototype.parse_OLD = function(fileAsString) {
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

EventLogParser.prototype.parseMetadataString = function(eventText) {
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
	// for selecting the longest text
	metadata["lengthText"] = eventText.length;
	return metadata;
}

EventLogParser.prototype.readMetadata = function(logdata) {
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

EventLogParser.prototype.parseTimestamp = function(sDate, sTime) {
	// 2015-12-25
	// 00:01:01
	var date = new Date(sDate + 'T' + sTime);
	if (date.toString() === 'Invalid Date') {
		throw 'EventLogParser: Timestamp has unknown format.';
	}
	return date;
}

EventLogParser.prototype.parseDataLine = function(strInput) {
	var tokens = strInput.split(this.delim);
	if (tokens.length != this.numCols) {
		throw 'EventLogParser: Input file must have ' + this.numCols + ' columns.';
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

EventLogParser.prototype.readLogdata = function(fileAsString) {
	// console.log("EventLogParser.readLogdata start")

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

function XX_mergeByTimestamp(measurements) {
	const tsFieldname = "datetime";

	console.log("measurements=", measurements)

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

EventLogParser.prototype.sortLogdata = function(logdata) {
	// console.log('sortLogdata start');
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	logdata.sort(sortFunc);
	// console.log(logdata[0].datetime.toLocaleString());
	// console.log(logdata[1].datetime.toLocaleString());
}


// prepare measurements for plot:
// - merge all measurements by timestamp
// - add timestamps at both ends-------------------> this is done in TabLoad
// - make listMeasNames
function prepareForPlot(measurements) {
	// - merge all measurements by timestamp
	var plotdata = mergeByTimestamp(measurements.groups);

	// - make listMeasNames
	var listMeasNames = makeListMeasNames(measurements.groups);

	var limits = combineLimits(measurements.groups);
	var units = combineUnits(measurements.groups);

	/*
	var measurementsForPlot = {
		plotdata : [...],  ------------> all measurements combined to a single list
		listMeasNames : [  ----------> fill selection box
			{ groupID: "CCS", groupLabel: "Temperature (CCS meas.)", names: [...] }
		],
		limits	: limits,
		units	: units
	};
	*/
	var measurementsForPlot = {
		plotdata		: plotdata,
		listMeasNames	: listMeasNames,
		limits			: limits,
		units			: units,
		preselected		: measurements.preselected
	};

	return measurementsForPlot;
}


function mergeByTimestamp(measurements) {

	// console.log("measurements=", measurements)
	// console.log("measurements=", measurements[0].data[0])

	// hash measurements via timestamp
	var hashData = {};

	for (var i=0; i<measurements.length; i++) {
		var measurementGroup = measurements[i];
		/*
			data		: [
				{ datetime: xx, MEAS: value }, -----> single value
				{ datetime: xx, MEAS1: value1, MEAS2: value2, MEAS3: value3 } ---> multiple values
			]
		*/
		var data = measurementGroup.data;

		for (var k=0; k<data.length; k++) {
			var record = data[k];
			var ts = record[TIMESTAMP_FIELD_NAME];
			var tskey = String(Number(ts));

			if (hashData[tskey] == undefined) {
				// initialize with timestamp
				// hashData[tskey] = { datetime:ts };
				hashData[tskey] = {};
				hashData[tskey][TIMESTAMP_FIELD_NAME] = ts;
			}

			// copy measurement values
			for (var key in record) {
				if (key != TIMESTAMP_FIELD_NAME) {
					hashData[tskey][key] = record[key];
				}
			}
		}
	}

	var plotdata = [];
	for (var tskey in hashData) {
		var record = hashData[tskey];
		plotdata.push(record);
	}

	// sort plotdata chronologically
	var sortFunc = function(a, b) {
		return a[TIMESTAMP_FIELD_NAME] - b[TIMESTAMP_FIELD_NAME];
	};
	plotdata.sort(sortFunc);

	// console.log("plotdata[0:5]=", plotdata.splice(0,5))

	return plotdata;
}

function addTimestampAtBeginning(plotdata) {
	var tpFirstWithData = plotdata[0][TIMESTAMP_FIELD_NAME];
	var tpFirst = new Date(tpFirstWithData);
	tpFirst.setHours(0);
	tpFirst.setMinutes(0);
	tpFirst.setSeconds(0);
	tpFirst.setMilliseconds(0);
	var dummyRecord = {};
	dummyRecord[TIMESTAMP_FIELD_NAME] = tpFirst;
	const indexInsert = 0;
	const numDelete = 0;
	plotdata.splice(indexInsert, numDelete, dummyRecord);
}

function addTimestampAtEnd(plotdata) {
	var tpLastWithData = plotdata[plotdata.length-1][TIMESTAMP_FIELD_NAME];
	var tpLast = new Date(tpLastWithData);
	tpLast.setHours(23);
	tpLast.setMinutes(59);
	tpLast.setSeconds(59);
	tpLast.setMilliseconds(1000);	// trick to get 0:00 of next day
	var dummyRecord = {};
	dummyRecord[TIMESTAMP_FIELD_NAME] = tpLast;
	plotdata.push(dummyRecord);
}

/*
for selection box
listMeasNames : [
	{
		groupID: "CCS",
		groupLabel: "Temperature (CCS meas.)",
		names: [...]
	}
]
*/
function makeListMeasNames(measurements) {
	var listMeasNames = [];
	for (var i=0; i<measurements.length; i++) {
		var measurementGroup = measurements[i];
		/*
			data		: [
				{ datetime: xx, MEAS: value }, -----> single value
				{ datetime: xx, MEAS1: value1, MEAS2: value2, MEAS3: value3 } ---> multiple values
			]
		*/
		var data = measurementGroup.data;
		var hashNames = {};
		for (var k=0; k<data.length; k++) {
			var measRecord = data[k];
			for (var name in measRecord) {
				if (name != TIMESTAMP_FIELD_NAME) {
					hashNames[name] = 1;
				}
			}

		}
		var measNames = [];
		for (var name in hashNames) {
			measNames.push(name);
		}
		measNames.sort();
		// console.log("measNames=", measNames)

		var record = {
			groupID		: measurementGroup.groupID,
			groupLabel	: measurementGroup.groupLabel,
			names		: measNames
		}
		// console.log("record=", record)

		listMeasNames.push(record);
	}

	return listMeasNames;
}

/*
limits : {
	MEAS1 : { min: ##, max: ## },
	MEAS2 : { min: ##, max: ## },
}
units : {
	MEAS1 : "unit1",
	MEAS2 : "unit2",
}
*/
function combineLimits(measurements) {
	var limits = {};
	for (var i=0; i<measurements.length; i++) {
		var measurementGroup = measurements[i];
		for (var measName in measurementGroup.limits) {
			if (limits[measName] == undefined) {
				limits[measName] = measurementGroup.limits[measName];
			}
		}
	}
	return limits;
}

function combineUnits(measurements) {
	var units = {};
	for (var i=0; i<measurements.length; i++) {
		var measurementGroup = measurements[i];
		for (var measName in measurementGroup.units) {
			// overwrite repeatedly
			units[measName] = measurementGroup.units[measName];
		}
	}
	return units;
}

window.EventLogParser = EventLogParser;

}())
