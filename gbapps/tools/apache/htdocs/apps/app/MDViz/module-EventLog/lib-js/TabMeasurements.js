
'use strict';

(function () {

// for callbacks
var self;

function TabMeasurements(mainObj) {
	// for callbacks
	self = this;

	this.mainObj = mainObj;
	this.isInitialized = false;
	this.limits = [];
	this.units = [];
}

var descriptionLegend = [
	[	'Computer ON',		'computer-on.png'	],
	[	'System ON &amp; gantry OK',		'system-on.png'	],
	[	'Checkup begin',	'checkup-begin.png'	],
	[	'Checkup end',		'checkup-end.png'	],
	[	'Patient begin',	'patient-begin.png'	],
	[	'Patient closed',		'patient-end.png'	],
	[	'Quality begin',	'quality-begin.png'	],
	[	'Quality end',		'quality-end.png'	],
	[	'Service scan begin',	'service-begin.png'	],
	[	'Service scan end',		'service-end.png'	],
];

var listEventLogObjects;

TabMeasurements.prototype.initialize = function(logdata) {
	console.log("tabMeasurements.initialize start");

	if (logdata == undefined) return;

	// var listEventLogObjects = main.listTabObjects["tabLoad"].listEventLogObjects;
	listEventLogObjects = logdata;
	// console.log("listEventLogObjects=", listEventLogObjects)
	// console.log("isInitialized=", this.isInitialized)
	// console.log(main)
	// console.log(main.listTabObjects["tabLoad"].isReadingAllDone)

	if (listEventLogObjects.length === 0) return;
	if (this.isInitialized) return;
	// if (!tabLoad.isReadingAllDone) return;
	// if (!main.isReadingAllDone) return;

	showBodyMeasurements();

	// var idTab = "tabMeasurements";
	// document.getElementById(idTab).style.display = "inline-block";

	// showPleaseWait();
	self.mainObj.showMenubarInfoText("Reading measurements. Please wait...", "#ff0");

	// pause for 1 msec
	// setTimeout(function(){}, 1);
	// setTimeout(function(){console.log("44767:pausing");}, 1);
	// setTimeout(showPleaseWait, 1);

	initializeTabMeasurements();

	// logViewerMeasurements = new LogViewer(listEventLogObjects, columnWidthMeasurements,
		// 'divTableEventLogTextMeasurements', 'divButtonBarEventLogTextMeasurements');

	if (basicEvents.length === 0) {
		makeReportBasicEvents(listEventLogObjects);
	}

	// console.log(7768568, "logdata=", logdata)

	// var measurements = extractMeasurements(listEventLogObjects);
	initializeChartsForMeasurements(logdata);
	showLegend();

	// zoom handlers
	chartBasicEvents.addListener("zoomed", handleZoomBasicEvents);
	chartMeasurements1.addListener("zoomed", handleZoom1);
	chartMeasurements2.addListener("zoomed", handleZoom2);

	// hidePleaseWait();
	self.mainObj.showMenubarInfoText("", "#fff");

	tabMeasurements.isInitialized = true;

	// debug
	// console.log(24646456)
	// var z1 = new Date("2015-12-25 00:00:00")
	// var z2 = new Date("2015-12-25 03:00:00")
	// console.log("z1, z2=", z1, z2)
	// chartBasicEvents.zoomToDates(z1, z2);

	console.log("tabMeasurements.initialize end");
}

TabMeasurements.prototype.update = function(logdata) {
	console.log("TabMeasurements: update begin");
	this.initialize(logdata);
}

function showLegend() {
	var pathSymbols = 'lib-js/symbols/';
	var height = '25';

	// var output = [];
	// output.push('<table>');
	// for (var i=0; i<descriptionLegend.length; i++) {
		// var description = descriptionLegend[i][0];
		// var imagefile = descriptionLegend[i][1];
		// output.push('<tr>');
		// output.push('<td>');
		// output.push('<img src="' + pathSymbols + '/' + imagefile + '"');
		// output.push(' height="' + height + '">');
		// output.push('<td>');
		// output.push(description);
		// output.push('</td>');
		// output.push('</tr>');
	// }
	// output.push('</table>');

	var output = [];
	output.push('Meaning of symbols: ');
	for (var i=0; i<descriptionLegend.length; i++) {
		var description = descriptionLegend[i][0];
		var imagefile = descriptionLegend[i][1];
		output.push('<img src="' + pathSymbols + '/' + imagefile + '"');
		output.push(' height="' + height + '" align="bottom">');
		output.push(description);
		if (i < descriptionLegend.length-1) output.push(' | ');
	}

	document.getElementById('divLegend').innerHTML = output.join('');
}

function hideLegend() {
	document.getElementById('divLegend').innerHTML = '';
}

TabMeasurements.prototype.reset = function() {
	tabMeasurements.isInitialized = false;
	basicEvents = [];
	// hide charts etc.
	hideBodyMeasurements();
}

function showBodyMeasurements() {
	var idDiv = "bodyMeasurements";
	document.getElementById(idDiv).style.display = "block";
}

function hideBodyMeasurements() {
	console.log("tabMeasurements.hideBodyMeasurements start");
	var idDiv = "bodyMeasurements";
	document.getElementById(idDiv).style.display = "none";
}

// global variables
var chartBasicEvents;
var chartMeasurements1;
var chartMeasurements2;
var indexDayCurrent = -1;
var deltaBefore = 5;
var deltaAfter = 50;
var basicEvents = [];
// var listMeasNames = [];
var listMeasNamesCCS = [];
var listMeasNamesDMS = [];
var zoomStartIndexLast;
var zoomEndIndexLast;
var zoomStartDateLast;
var zoomEndDateLast;
var logViewerMeasurements;
var columnWidthMeasurements = [ 13, 130, 70, 40, 900 ];
var switchLogViewer = false;

var ycoordSystemLevel = 7;		// startup, checkup, shutdown, patient

var settingsScanKind = {
	Foot	: { color:'#f0f',		ycoord: 6 },
	Spiral	: { color:'#FE6A1E',	ycoord: 5 },		// orange: 254 106 30
	Sequence: { color:'#0a0',		ycoord: 4 },
	Topo	: { color:'#00f',		ycoord: 3 },
	Rot		: { color:'#f00',		ycoord: 2 },
	STA		: { color:'#777',		ycoord: 1 }
};

var limitsMeas = {
	'Air inlet temperature'				: { min: 0, max: 40 },
	'Air outlet temperature'			: { min: 0, max: 40 },
	'DMS temperature'					: { min: 0, max: 100 },
	'External WCS Control Output'		: { min: 0, max: 40 },
	'External WCS glycol temperature'	: { min: 0, max: 40 },
	'Fanspeed'							: { min: 0, max: 4000 },
	'Room humidity'						: { min: 0, max: 100 },
	'Room temperature'					: { min: 0, max: 40 },
	'Tube temperature'					: { min: 0, max: 100 },
	'Water inlet temperature'			: { min: 0, max: 40 },
	'Water outlet temperature'			: { min: 0, max: 40 },
	'Waterflow'							: { min: 0, max: 4000 },
};

var limitsMeasDMS = { min: 0, max: 100 };

function initializeTabMeasurements() {
	// window width
	var width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	document.getElementById('chartScanIntervals').style.width = String(width-50) + 'px';
	document.getElementById('chartMeasurements1').style.width = String(width-50) + 'px';
	document.getElementById('chartMeasurements2').style.width = String(width-50) + 'px';

	document.getElementById('selection1').style.backgroundColor = '#ccf';
	document.getElementById('selection2').style.backgroundColor = '#fcc';
	document.getElementById('selection3').style.backgroundColor = '#cfc';
	document.getElementById('selection4').style.backgroundColor = '#fcf';

	clearChartsAll();
}

function labelFunctionBasicEvents(value, valueText, valueAxis) {
	if (value===1) return 'STA/other';
	if (value===2) return 'ROT';
	if (value===3) return 'TOP';
	if (value===4) return 'SEQ';
	if (value===5) return 'SPI';
	if (value===6) return 'FOOT';
	if (value===7) return '';
	return '';
}

function XX_getLastTimestamp() {
	var nDays = listEventLogObjects.length;
	var logdata = listEventLogObjects[nDays-1].logdata;
	var nEntries = logdata.length;
	var tpLastWithData = logdata[nEntries-1].datetime;
	var tpLast = new Date(tpLastWithData);
	tpLast.setHours(23);
	tpLast.setMinutes(59);
	tpLast.setSeconds(59);
	tpLast.setMilliseconds(1000);	// trick to get 0:00 of next day
	// console.log(tpLastWithData);
	// console.log(tpLast);
	return tpLast;
}

function XX_getFirstTimestamp() {
	var tpFirstWithData = listEventLogObjects[0].logdata[0].datetime;
	var tpFirst = new Date(tpFirstWithData);
	tpFirst.setHours(0);
	tpFirst.setMinutes(0);
	tpFirst.setSeconds(0);
	tpFirst.setMilliseconds(0);
	return tpFirst;
}

function mergeMeasNamesSingleType(listEventLogObjects, typeStr) {
	var hashNames = {};
	for (var i=0; i<listEventLogObjects.length; i++) {
		var measObj = listEventLogObjects[i].measurements[typeStr];
		if (measObj != undefined) {
			var listNames = measObj.listMeasNames;
			for (var k=0; k<listNames.length; k++) {
				hashNames[listNames[k]] = 1;
			}
		}
	}
	var listNamesMerged = [];
	for (var k in hashNames) {
		listNamesMerged.push(k)
	}
	listNamesMerged.sort();
	return listNamesMerged;
}

function extractMeasurements(listEventLogObjects) {
	console.log("extractMeasurements begin");
	console.log(834534, listEventLogObjects);
	var measurements = [];
	for (var i=0; i<listEventLogObjects.length; i++) {
		// console.log(2354, listEventLogObjects[i]);
		var measObj = listEventLogObjects[i].measurements;
		for (var measType in measObj) {
			measurements = measurements.concat(measObj[measType].data);
		}
	}
	console.log("measurements=", measurements);

	listMeasNamesCCS = mergeMeasNamesSingleType(listEventLogObjects, "CCS");
	listMeasNamesDMS = mergeMeasNamesSingleType(listEventLogObjects, "DMS");

	console.log("extractMeasurements end");
	return measurements;
}

function XX_extractMeasurements() {
	console.log('extractMeasurements start');

	// var hashMeasNames = {};

	// add empty point at beginning
	var tpFirstWithData = listEventLogObjects[0].logdata[0].datetime;
	var tpFirst = new Date(tpFirstWithData);
	tpFirst.setHours(0);
	tpFirst.setMinutes(0);
	tpFirst.setSeconds(0);
	tpFirst.setMilliseconds(0);
	// console.log(tpFirstWithData);
	// console.log(tpFirst);

	var measurements = [];
	measurements.push({ datetime:tpFirst });

	// get CCS measurements
	var measCCS = HexParserCCS.parseAll(listEventLogObjects);
	measurements = measurements.concat(measCCS.measurements);

	// get DMS measurements
	var measDMS = HexParserDMS.parseAll(listEventLogObjects);
	// console.log("measDMS=", measDMS)
	measurements = measurements.concat(measDMS.measurements);

	// add empty point at end
	var tpLast = getLastTimestamp();
	measurements.push({ datetime:tpLast });

	// console.log('measurements =', measurements);

	// listMeasNames = measCCS.namesFound;
	// listMeasNames = listMeasNames.concat(measDMS.namesFound);
	// console.log('listMeasNames =', listMeasNames);
	listMeasNamesCCS = measCCS.namesFound;
	listMeasNamesDMS = measDMS.namesFound;
	console.log('listMeasNamesCCS =', listMeasNamesCCS);
	console.log('listMeasNamesDMS =', listMeasNamesDMS);

	// console.log("measurements before merge:")
	// console.log('measurements =', measurements);
	// console.log('measurements[3] =', measurements[3]);

	// merge by timestamp
	var measurements = mergeByTimestamp(measurements);

	// console.log("measurements after merge:")
	// console.log('measurements =', measurements);
	// console.log('measurements[3] =', measurements[3]);

	console.log('extractMeasurements end');

	return measurements;
}

function mergeRecords(rec1, rec2) {
	var recMerged = {};
	for (var key in rec1) {
		recMerged[key] = rec1[key];
	}
	for (var key in rec2) {
		recMerged[key] = rec1[key];
	}
	return recMerged;
}

function mergeByTimestamp(measurements) {
	const n = measurements.length;

	var hashTimestamps = {};
	for (var i=0; i<n; i++) {
		var ts = measurements[i].datetime;
		var tskey = String(Number(measurements[i].datetime));
		hashTimestamps[tskey] = { datetime:ts };
	}

	for (var i=0; i<n; i++) {
		var record = measurements[i];
		for (var key in record) {
			if (key != "datetime") {
				var tskey = String(Number(record.datetime));
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
		return a.datetime - b.datetime;
	};
	merged.sort(sortFunc);

	return merged;
}

function clearChartsAll() {
	if (chartBasicEvents != undefined) chartBasicEvents.clear();
	if (chartMeasurements1 != undefined) chartMeasurements1.clear();
	if (chartMeasurements2 != undefined) chartMeasurements2.clear();
}


function getColorScanKind(kind) {
	if (settingsScanKind[kind] === undefined)
		return '#777';
	else
		return settingsScanKind[kind].color;
}

function getYcoordScanKind(kind) {
	if (settingsScanKind[kind] === undefined)
		return 1;
	else
		return settingsScanKind[kind].ycoord;
}

function getFirstTimestampFromMeas(listEventLogObjects) {
	// initialize as maximum timestamp
	var tsFirst = new Date(9999, 11, 31);
	for (var i=0; i<listEventLogObjects.length; i++) {
		var measurements = listEventLogObjects[i].measurements;
		if (measurements.length > 0) {
			tsFirst = Math.min(tsFirst, measurements[0].datetime);
		}
	}
	return tsFirst;
}

function getFirstTimestampFromBasicEvents(listEventLogObjects) {
	// initialize as maximum timestamp
	var tsFirst = new Date(9999, 11, 31);
	for (var i=0; i<listEventLogObjects.length; i++) {
		var basicEvents = listEventLogObjects[i].basicEvents;
		for (var fieldname in basicEvents) {
			var listTimestamps = basicEvents[fieldname];
			// console.log("t2, listTimestamps[0] =", t2, listTimestamps[0])
			if (listTimestamps[0] < tsFirst) {
				tsFirst = listTimestamps[0];
			}
		}
	}
	return tsFirst;
}

function getFirstTimestampFromFirmware(listEventLogObjects) {
	// initialize as maximum timestamp
	var tsFirst = new Date(9999, 11, 31);
	for (var i=0; i<listEventLogObjects.length; i++) {
		var firmwareInfo = listEventLogObjects[i].firmwareInfo;
		if (firmwareInfo.detailsDay.length > 0) {
			var ts = firmwareInfo.detailsDay[0].datetime;
			if (ts < tsFirst) {
				tsFirst = ts;
			}
		}
	}
	return tsFirst;
}

function getLastTimestampFromMeas(listEventLogObjects) {
	// initialize as minimum timestamp
	var tsLast = new Date(1900, 0, 1);
	for (var i=0; i<listEventLogObjects.length; i++) {
		var measurements = listEventLogObjects[i].measurements;
		var nEntries = measurements.length;
		if (nEntries > 0) {
			tsLast = Math.max(tsLast, measurements[nEntries-1].datetime);
		}
	}
	return tsLast;
}

function getLastTimestampFromBasicEvents(listEventLogObjects) {
	// initialize as minimum timestamp
	var tsLast = new Date(1900, 0, 1);
	for (var i=0; i<listEventLogObjects.length; i++) {
		var basicEvents = listEventLogObjects[i].basicEvents;
		for (var fieldname in basicEvents) {
			var listTimestamps = basicEvents[fieldname];
			var nn = listTimestamps.length;
			if (listTimestamps[nn-1] > tsLast) {
				tsLast = listTimestamps[nn-1];
			}
		}
	}
	return tsLast;
}

function getLastTimestampFromFirmware(listEventLogObjects) {
	// initialize as minimum timestamp
	var tsLast = new Date(1900, 0, 1);
	for (var i=0; i<listEventLogObjects.length; i++) {
		var firmwareInfo = listEventLogObjects[i].firmwareInfo;
		var nn = firmwareInfo.detailsDay.length;
		if (nn > 0) {
			var ts = firmwareInfo.detailsDay[nn-1].datetime;
			if (ts > tsLast) {
				tsLast = ts;
			}
		}
	}
	return tsLast;
}

function getFirstTimestamp(listEventLogObjects) {
	// initialize as maximum timestamp
	var tsFirstWithData = new Date(9999, 11, 31);
	for (var i=0; i<listEventLogObjects.length; i++) {
		var ts = listEventLogObjects[i].timestampFirst;
		if (ts != undefined) {
			tsFirstWithData = Math.min(tsFirstWithData, ts);
		}
	}
	var tsFirst = new Date(tsFirstWithData);
	tsFirst.setHours(0);
	tsFirst.setMinutes(0);
	tsFirst.setSeconds(0);
	tsFirst.setMilliseconds(0);
	return tsFirst;
}

function getLastTimestamp(listEventLogObjects) {
	// initialize as minimum timestamp
	var tpLastWithData = new Date(1900, 0, 1);
	for (var i=0; i<listEventLogObjects.length; i++) {
		var ts = listEventLogObjects[i].timestampLast;
		if (ts != undefined) {
			tpLastWithData = Math.max(tpLastWithData, ts);
		}
	}

	var tpLast = new Date(tpLastWithData);
	tpLast.setHours(23);
	tpLast.setMinutes(59);
	tpLast.setSeconds(59);
	tpLast.setMilliseconds(1000);	// trick to get 0:00 of next day
	// console.log(tpLastWithData);
	// console.log(tpLast);

	return tpLast;
}


function makeTimestampAtBeginning(timestampFirst) {
	var tpFirst = new Date(timestampFirst);
	tpFirst.setHours(0);
	tpFirst.setMinutes(0);
	tpFirst.setSeconds(0);
	tpFirst.setMilliseconds(0);
	return tpFirst;
}

function makeTimestampAtEnd(timestampLast) {
	var tpLast = new Date(timestampLast);
	tpLast.setHours(23);
	tpLast.setMinutes(59);
	tpLast.setSeconds(59);
	tpLast.setMilliseconds(1000);	// trick to get 0:00 of next day
	return tpLast;
}

function makeReportBasicEvents(logdata) {
	console.log('makeReportBasicEvents start');

	// console.log("makeReportBasicEvents: logdata=", logdata);

	basicEvents = [];
	var lastScanKind = 'unknown';
	var lastCheckupFunction = 'unknown';

	// add empty point at beginning
	var tpFirst = makeTimestampAtBeginning(logdata.timestampFirst);
	basicEvents.push({ color:'#000', datetime:tpFirst, value:-99, marker:'round', indexDay:0 });

	// used for indexDay
	var i=1;

	for (var fieldname in logdata.basicEvents) {
		var typeBasicEvent = fieldname;
		var typeMinor = "";
		var idx = fieldname.indexOf(":");
		if (idx >= 0) {
			typeBasicEvent = fieldname.substr(0, idx);
			typeMinor = fieldname.substr(idx+1, fieldname.length - idx-1);
		}
		// console.log("typeBasicEvent, typeMinor, count=", typeBasicEvent, typeMinor, logdata[fieldname].length)

		var listTimestamps = logdata.basicEvents[fieldname];

		for (var k=0; k<listTimestamps.length; k++) {
			var ts = listTimestamps[k];
			if (typeBasicEvent=="Computer ON") {
				const pathSymbolFile = 'lib-js/symbols/computer-on.png';
				const bulletSize = 20;
				basicEvents.push({ info:'Computer ON', color:'#f0f', marker:'triangleRight', datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
			else if (typeBasicEvent=="System ON") {
				var pathSymbolFile = 'lib-js/symbols/system-on.png';
				var bulletSize = 20;
				basicEvents.push({ info:'System ON\nGantry OK', color:'#f0f', marker:'triangleRight', datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
			else if (typeBasicEvent=="Checkup started") {
				var pathSymbolFile = 'lib-js/symbols/checkup-begin.png';
				var bulletSize = 20;
				basicEvents.push({ info:'Checkup\nstarted', color:'#f0f', marker:'triangleRight', datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
			else if (typeBasicEvent=="Checkup function started") {
				var checkupFunction = typeMinor;
				if (checkupFunction !== 'Checkup') {
					var pathSymbolFile = 'lib-js/symbols/service-begin.png';
					if (checkupFunction === 'Daily Quality Check') pathSymbolFile = 'lib-js/symbols/quality-begin.png';
					var bulletSize = 20;
					var info = checkupFunction + '\nstarted';
					basicEvents.push({ info:info, datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
				}
			}
			else if (typeBasicEvent=="Checkup function completed") {
				var checkupFunction = typeMinor;
				var pathSymbolFile = 'lib-js/symbols/service-end.png';
				if (checkupFunction === 'Checkup') pathSymbolFile = 'lib-js/symbols/checkup-end.png';
				if (checkupFunction === 'Daily Quality Check') pathSymbolFile = 'lib-js/symbols/quality-end.png';
				var bulletSize = 20;
				var info = checkupFunction + '\ncompleted';
				basicEvents.push({ info:info, datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
			else if (typeBasicEvent=="Shutdown begin") {
				basicEvents.push({ info:'Shutdown\nbegin', color:'#0ff', marker:'triangleRight', datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel });
			}
			else if (typeBasicEvent=="Shutdown end") {
				basicEvents.push({ info:'Shutdown\nend', color:'#0ff', marker:'triangleLeft', datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel });
			}
			else if (typeBasicEvent=="Scan begin") {
				var kind = typeMinor;
				var col = getColorScanKind(kind);
				var ycoord = getYcoordScanKind(kind);
				basicEvents.push({ info:kind+' scan\nbegin', color:col, marker:'triangleRight', datetime:ts, indexDay:i, indexLine:k, value:ycoord });
			}
			else if (typeBasicEvent=="Scan end") {
				var kind = typeMinor;
				var col = getColorScanKind(kind);
				var ycoord = getYcoordScanKind(kind);
				basicEvents.push({ info:kind+' scan\nend', color:col, marker:'triangleLeft', datetime:ts, indexDay:i, indexLine:k, value:ycoord });
			}
			else if (typeBasicEvent=="Patient begin") {
				var pathSymbolFile = 'lib-js/symbols/patient-begin.png';
				var bulletSize = 20;
				basicEvents.push({ info:'Patient\nbegin', color:'#0d0', marker:'triangleDown', datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
			else if (typeBasicEvent=="Patient closed") {
				var pathSymbolFile = 'lib-js/symbols/patient-end.png';
				var bulletSize = 20;
				basicEvents.push({ info:'Patient\nclosed', color:'#0d0', marker:'triangleDown', datetime:ts, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
		}
	}

	var tpLast = makeTimestampAtEnd(logdata.timestampLast);
	// console.log("tpLast=", tpLast)
	// var indexDay = listEventLogObjects.length-1;
	var indexDay = 99;
	basicEvents.push({ color:'#000', datetime:tpLast, value:-99, marker:'round', indexDay:indexDay });

	// sort chronologically
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	basicEvents.sort(sortFunc);

	// console.log("basicEvents=", basicEvents)


	var idTab = 'tabMeasurements';
	document.getElementById(idTab).style.display = 'inline-block';
	chartBasicEvents = initializeChartBasicEvents(basicEvents, 'chartScanIntervals');
	// chartBasicEvents.logViewer = logViewerMeasurements;
	document.getElementById(idTab).style.display = 'none';

	console.log('makeReportBasicEvents end');
}

function showEventLogText(indexDay, indexLineStart, indexLineEnd, indexLineHighlight) {
	var logdata = listEventLogObjects[indexDay].logdata;

	var tbl = document.createElement('table');
	tbl.style.width = '100%';
	tbl.setAttribute('border', '1');
	var tbdy = document.createElement('tbody');

	for (var i=indexLineStart; i<=indexLineEnd; i++) {
		var tr = document.createElement('tr');

		if (i===indexLineHighlight) {
			tr.style.backgroundColor = '#dfd';
		}

		var record = logdata[i];

		var fields = [
			record.severity,
			record.datetime.toLocaleString(),
			record.event_source,
			String(record.event_id),
			record.event_text
		];

		for (var k=0; k<fields.length; k++) {
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(fields[k]));
			tr.appendChild(td);
		}
		tbdy.appendChild(tr);
	}
	tbl.appendChild(tbdy);

	var eventLogText = document.getElementById('eventLogText');
	if (eventLogText.hasChildNodes()) {
		eventLogText.removeChild(eventLogText.childNodes[0]);
	}
	eventLogText.appendChild(tbl);

	//console.log(tbl.offsetHeight);

	// var sliderEventText = document.getElementById('sliderEventText');
	// sliderEventText.style.height = tbl.offsetHeight - 20;
	// sliderEventText.min = 0;
	// sliderEventText.max = logdata.length - 1;
	// sliderEventText.step = 1;
	// sliderEventText.value = logdata.length - indexLineHighlight;
}


function callbackSliderEventText() {
	var sliderEventText = document.getElementById('sliderEventText');

	var indexDay = indexDayCurrent;
	var nLines = listEventLogObjects[indexDay].logdata.length;

	var indexLineHighlight = nLines-1 - sliderEventText.value;

	var indexLineStart = indexLineHighlight - deltaBefore;
	var indexLineEnd = indexLineHighlight + deltaAfter;

	showEventLogText(indexDay, indexLineStart, indexLineEnd, indexLineHighlight);
}


function callbackClickGraphItem(event) {
	if (!switchLogViewer) return;

	// console.log(event.item.category + ": " + event.item.values.value);
	var basicEvents = event.chart.dataProvider;
	var recordSelected = basicEvents[event.index];
	//console.log(recordSelected);

	var indexDay = recordSelected.indexDay;
	var indexLine = recordSelected.indexLine;

	indexDayCurrent = indexDay;

	var indexLineStart = indexLine - deltaBefore;
	var indexLineEnd = indexLine + deltaAfter;

	// logViewerMeasurements.showEventLogText(indexDay, indexLineStart, indexLineEnd, indexLine);
	event.chart.logViewer.showEventLogText(indexDay, indexLineStart, indexLineEnd, indexLine);
}


function initializeChartBasicEvents(basicEvents, divChart) {
	//console.log('initializeChartBasicEvents start');

    var chart = new AmCharts.AmSerialChart();
    chart.dataProvider = basicEvents;
    chart.categoryField = "datetime";
    chart.sequencedAnimation = false;
	chart.categoryAxis.minPeriod = "ss";
	chart.categoryAxis.parseDates = true;

	chart.addListener("clickGraphItem", callbackClickGraphItem);

    // value axes
	var valueAxis1 = makeValueAxis2('', 'left', '#000');
	var valueAxis2 = makeValueAxis2('', 'right', '#000');
    chart.addValueAxis(valueAxis1);
	chart.addValueAxis(valueAxis2);

    // graph 1
    var graph1 = new AmCharts.AmGraph();
	graph1.id = "g1";
	graph1.type = "line";
    graph1.valueField = "value";
	graph1.valueAxis = valueAxis1;
    graph1.balloonText = "[[info]]";
    graph1.balloonColor = "#333";
	graph1.lineColorField = "color";
	graph1.lineAlpha = 0;
	graph1.bulletField = "marker";
	graph1.bulletSize = 10;
	graph1.bulletBorderAlpha = 1;
	graph1.bulletBorderThickness = 1;
	graph1.hideBulletsCount = 10000;
	graph1.customBulletField = "customBullet";
	graph1.bulletSizeField = "bulletSize";
	graph1.hidden = false;
    chart.addGraph(graph1);

    // graph 2: empty graph for axis labels on the right
    var graph2 = new AmCharts.AmGraph();
	graph2.id = "g2";
	graph2.valueAxis = valueAxis2;
	graph2.hidden = false;
    chart.addGraph(graph2);

	var chartCursor = new AmCharts.ChartCursor();
    chartCursor.categoryBalloonDateFormat = "YYYY MMM DD, JJ:NN:SS EEE";
    chartCursor.cursorPosition = "mouse";
	chartCursor.cursorColor = '#333';
	chart.chartCursor = chartCursor;

	var chartScrollbar = new AmCharts.ChartScrollbar();
	chartScrollbar.scrollbarHeight = 20;
	chartScrollbar.backgroundAlpha = 0;
	chartScrollbar.selectedBackgroundAlpha = 0.1;
	chartScrollbar.selectedBackgroundColor = "#888888";
	chartScrollbar.graphFillAlpha = 0;
	chartScrollbar.graphLineAlpha = 0.5;
	chartScrollbar.selectedGraphFillAlpha = 0;
	chartScrollbar.selectedGraphLineAlpha = 1;
	chartScrollbar.autoGridCount = true;
	chartScrollbar.color = "#AAAAAA";
	chart.chartScrollbar = chartScrollbar;

	chart.pathToImages = "lib-js/amcharts/images/";
	chart.autoMargins = false;
	chart.marginLeft  = 70;
	chart.marginRight = 70;
	chart.marginBottom = 20;

	//chart.addListener("zoomed", handleZoom);

	chart.guides = [];

	chart.write(divChart);

	return chart;
}


function initializeChartMeasurements(measurements, handleZoom, hasScrollbar) {
    var chart = new AmCharts.AmSerialChart();
    chart.dataProvider = measurements;
    chart.categoryField = "datetime";
    chart.sequencedAnimation = false;
	chart.categoryAxis.minPeriod = "ss";
	chart.categoryAxis.parseDates = true;
	// chart.addListener("zoomed", handleZoom);

    // value axes
	var listAxes = [
		makeValueAxis3(listMeasNamesCCS[0], 'left', '#000'),
		makeValueAxis3(listMeasNamesCCS[0], 'right', '#000')
	];
    chart.addValueAxis(listAxes[0]);
	chart.addValueAxis(listAxes[1]);

    // add two graphs
	for (var indexGraph=0; indexGraph<2; indexGraph++) {
		var graph1 = new AmCharts.AmGraph();
		graph1.id = "graph" + indexGraph;
		graph1.type = "line";
		graph1.valueField = listMeasNamesCCS[0];
		graph1.valueAxis = listAxes[indexGraph];
		graph1.balloonText = "[[value]]";
		graph1.lineColor = "#00f";
		graph1.lineAlpha = 1;
		graph1.bullet = "round";
		graph1.bulletSize = 5;
		graph1.bulletBorderAlpha = 1;
		graph1.bulletBorderThickness = 1;
		graph1.hideBulletsCount = 10000;
		graph1.hidden = false;
		chart.addGraph(graph1);
	}

	var chartCursor = new AmCharts.ChartCursor();
	chartCursor.categoryBalloonDateFormat = "YYYY MMM DD, JJ:NN:SS EEE";
	chartCursor.cursorPosition = "mouse";
	chartCursor.animationDuration = 0;
	chartCursor.valueLineBalloonEnabled = false;
	chartCursor.valueLineEnabled = true;
	chartCursor.cursorColor = '#333';
	chart.chartCursor = chartCursor;

	if (hasScrollbar) {
		var chartScrollbar = new AmCharts.ChartScrollbar();
		chartScrollbar.scrollbarHeight = 20;
		chartScrollbar.backgroundAlpha = 0;
		chartScrollbar.selectedBackgroundAlpha = 0.1;
		chartScrollbar.selectedBackgroundColor = "#888888";
		chartScrollbar.graphFillAlpha = 0;
		chartScrollbar.graphLineAlpha = 0.5;
		chartScrollbar.selectedGraphFillAlpha = 0;
		chartScrollbar.selectedGraphLineAlpha = 1;
		chartScrollbar.autoGridCount = true;
		chartScrollbar.color = "#AAAAAA";
		chart.chartScrollbar = chartScrollbar;
	}

	chart.pathToImages = "lib-js/amcharts/images/";
	chart.autoMargins = false;
	chart.marginLeft  = 70;
	chart.marginRight = 70;
	chart.marginBottom = 20;

	//chart.addListener("zoomed", handleZoom);

	chart.guides = [];

	//chart.write("chartMeasurements");

	return chart;
}


function makeReportScanIntervals(listEventLogObjects) {
	console.log('makeReportScanIntervals start');
	//var listEventLogObjects = zz_load_test_logdata();

	var scanBegin = [];
	var scanEnd = [];

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;
		// console.log([i, logdata.length]);

		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_source==='CT_IS') {
				if (record.event_id===493) {
					scanBegin.push(record);
				}
				if (record.event_id===494) {
					scanEnd.push(record);
				}
			}
		}
	}

	if (scanBegin.length !== scanEnd.length) {
		console.log('makeReportScanIntervals: scan begin and end do not match');
		console.log(scanBegin.length, scanEnd.length)
	}

	var timestampScanBegin = [];
	var timestampScanEnd = [];
	var chartData = [];

	for (var i=0; i<scanBegin.length; i++) {
		var t1 = new Date(scanBegin[i].date + 'T' + scanBegin[i].time);
		var t2 = new Date(scanEnd[i].date + 'T' + scanEnd[i].time);
		// console.log(t1,t2);
		timestampScanBegin.push(t1);
		timestampScanEnd.push(t2);

		// @Mode kind@=#MlRot#
		var ret = scanBegin[i].event_text.match(/@Mode kind@=#([^#]+)#/);
		var kind = ret[1].replace('Ml', '');

		var value = 0;
		if (kind==='Topo')		value = 1;
		if (kind==='Spiral')	value = 2;
		if (kind==='Sequence')	value = 3;
		if (kind==='Rot')		value = 4;

		chartData.push({ datetime: t1, scanBegin: value, kind: kind + '<br>start' });
		chartData.push({ datetime: t2, scanBegin: value, kind: kind + '<br>end' });
	}


	var timestampCheckupStart = [];
	var timestampCheckupEnd = [];

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;
		// console.log([i, logdata.length]);

		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_source==='CT_SRV') {
				if (record.event_id===152 && record.event_text.indexOf('Function "Checkup" started') > -1) {
					timestampCheckupStart.push(record.datetime);
				}
				if (record.event_id===153 && record.event_text.indexOf('Function "Checkup" completed') > -1) {
					timestampCheckupEnd.push(record.datetime);
				}
			}
		}
	}
// console.log(timestampCheckupStart);
// console.log(timestampCheckupEnd);

	var patientStart = [];

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;
		// console.log([i, logdata.length]);

		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_id===68 && record.event_source==='CT_CHR') {
				patientStart.push(record.datetime);
			}
		}
	}


	var report = {
		timestampScanBegin		: timestampScanBegin,
		timestampScanEnd		: timestampScanEnd,
		chartData				: chartData,
		timestampCheckupStart	: timestampCheckupStart,
		timestampCheckupEnd		: timestampCheckupEnd,
		patientStart			: patientStart,
	};

	initializeChart(report);


	return report;
}


function makeValueAxis(title, position, color) {
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = title;
	valueAxis2.axisAlpha = 0.15;
	valueAxis2.minimum = 0;
	valueAxis2.maximum = 5;
	valueAxis2.dashLength = 3;
	valueAxis2.position = position;
	valueAxis2.color = color;
	valueAxis2.gridColor = color;
	valueAxis2.titleColor = color;
    valueAxis2.labelFunction = formatValue;
	return valueAxis2;
}

function makeValueAxis2(title, position, color) {
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = title;
	valueAxis2.axisAlpha = 0.3;
	valueAxis2.minimum = 0;
	valueAxis2.maximum = ycoordSystemLevel + 2;
	valueAxis2.dashLength = 0;
	valueAxis2.position = position;
	valueAxis2.color = color;
	valueAxis2.titleColor = color;
	valueAxis2.gridColor = '#eee';
	valueAxis2.gridAlpha = 1;
	valueAxis2.gridCount = 10;
	valueAxis2.autoGridCount = false;
	valueAxis2.labelFunction = labelFunctionBasicEvents;
	return valueAxis2;
}

function makeValueAxis3(title, position, color) {
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = title;
	valueAxis2.axisAlpha = 0.15;
	// valueAxis2.minimum = 0;
	// valueAxis2.maximum = 2;
	valueAxis2.dashLength = 3;
	valueAxis2.position = position;
	valueAxis2.color = color;
	valueAxis2.gridColor = color;
	valueAxis2.titleColor = color;
	return valueAxis2;
}

function initializeChart(report) {
	//console.log('initializeChart start');

	var timestampScanBegin		= report.timestampScanBegin;
	var timestampScanEnd		= report.timestampScanEnd;
	var chartData				= report.chartData;
	var timestampCheckupStart	= report.timestampCheckupStart;
	var timestampCheckupEnd		= report.timestampCheckupEnd;
	var patientStart			= report.patientStart;

	// console.log(chartData);

    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "datetime";
    chart.sequencedAnimation = false;
	chart.categoryAxis.minPeriod = "ss";
	chart.categoryAxis.parseDates = true;

    // value axes
	var valueAxis1 = makeValueAxis('', 'left', '#000');
	var valueAxis2 = makeValueAxis('', 'right', '#000');
    chart.addValueAxis(valueAxis1);
	chart.addValueAxis(valueAxis2);

    // graph 1
    var graph1 = new AmCharts.AmGraph();
	graph1.id = "g1";
	graph1.valueAxis = valueAxis1;
    graph1.valueField = "scanBegin";
    // graph1.balloonText = "[[value]] [[kind]]";
    graph1.balloonText = "[[kind]]";
	graph1.lineColor = "#00aa00";
	graph1.bullet = "triangleDown";
	graph1.hideBulletsCount = 500;
	graph1.bulletBorderThickness = 1;
	graph1.hidden = false;
    chart.addGraph(graph1);

	var chartCursor = new AmCharts.ChartCursor();
    chartCursor.categoryBalloonDateFormat = "MMM DD, JJ:NN:SS EEE";
    chartCursor.cursorPosition = "mouse";
	chart.chartCursor = chartCursor;

	var chartScrollbar = new AmCharts.ChartScrollbar();
	//chartScrollbar.graph = "g1";
	chartScrollbar.scrollbarHeight = 40;
	chartScrollbar.backgroundAlpha = 0;
	chartScrollbar.selectedBackgroundAlpha = 0.1;
	chartScrollbar.selectedBackgroundColor = "#888888";
	chartScrollbar.graphFillAlpha = 0;
	chartScrollbar.graphLineAlpha = 0.5;
	chartScrollbar.selectedGraphFillAlpha = 0;
	chartScrollbar.selectedGraphLineAlpha = 1;
	chartScrollbar.autoGridCount = true;
	chartScrollbar.color = "#AAAAAA";
	chart.chartScrollbar = chartScrollbar;

	chart.pathToImages = "lib-js/amcharts/images/";
	chart.autoMargins = false;
	chart.marginLeft  = 70;
	chart.marginRight = 70;
	chart.marginBottom = 20;

	//chart.addListener("zoomed", handleZoom);

	chart.guides = [];


	for (var i=0; i<timestampCheckupStart.length; i++) {
		var guide = {
			date:	new Date(timestampCheckupStart[i]),
			toDate:	new Date(timestampCheckupEnd[i]),
			color: "#0000cc",
			lineColor: "#0000cc",
			lineAlpha: 0.4,
			fillAlpha: 0.1,
            fillColor: "#0000ff",
			dashLength: 5,
			inside: false,
			labelRotation: 90,
			label: 'Checkup',
			fontSize: 12,
			position: 'left'
		};
		chart.guides.push(guide);
	}


// console.log(timestampScanBegin, timestampScanEnd);

	// if (false) {
	for (var i=0; i<timestampScanBegin.length; i++) {
		var guide = {
			date:	new Date(timestampScanBegin[i]),
			toDate:	new Date(timestampScanEnd[i]),
			color: "#ff0000",
			lineColor: "#00aa00",
			lineAlpha: 0.7,
			fillAlpha: 0.2,
            fillColor: "#00cc00",
			dashLength: 5,
			inside: true,
			labelRotation: 90,
			label: '',
			fontSize: 12
		};
		chart.guides.push(guide);
	}


	for (var i=0; i<patientStart.length; i++) {
		var guide = {
			date:	new Date(patientStart[i]),
			color: "#cc00cc",
			lineColor: "#cc00cc",
			lineAlpha: 0.4,
			dashLength: 5,
			inside: false,
			labelRotation: 90,
			label: 'Patient',
			fontSize: 11,
			position: 'left'
		};
		chart.guides.push(guide);
	}

	chart.write("chartScanIntervals");
}

function formatValue(value, formattedValue, valueAxis){
	if (value===0) return 'unknown';
	if (value===1) return 'Topo';
	if (value===2) return 'Spiral';
	if (value===3) return 'Sequence';
	if (value===4) return 'Rot';
    return '';
}

function fillSelectElementWrapper(prefix, listMeasNames) {
	var nParams = 4;
	for (var i=0; i<nParams; i++) {
		var idList = prefix + String(i+1);
		var idLabel = 'selection' + String(i+1);
		fillSelectElement(idList, idLabel, listMeasNames);
	}
}

function addEmptyOptionToSelectElementsAll() {
	var nParams = 4;
	for (var i=0; i<nParams; i++) {
		var idLabel = 'selection' + String(i+1);
		addEmptyOptionToSelectElement(idLabel);
	}
}

function initializeChartsForMeasurements(logdata) {
	var measurements = logdata.measurements;
	// console.log("initializeChartsForMeasurements: measurements=", measurements)

	var idTab = 'tabMeasurements';
	document.getElementById(idTab).style.display = 'inline-block';

	var plotdata = measurements.plotdata;
	chartMeasurements1 = initializeChartMeasurements(plotdata, handleZoom1, true);
	chartMeasurements2 = initializeChartMeasurements(plotdata, handleZoom2, false);

	// chartBasicEvents.addListener("zoomed", handleZoomBasicEvents);

	var listColors = [
		'#0000ff',
		'#ff0000',
		'#00aa00',
		'#ff00ff',
	];

	chartMeasurements1.graphs[0].lineColor = listColors[0];
	chartMeasurements1.graphs[1].lineColor = listColors[1];
	chartMeasurements2.graphs[0].lineColor = listColors[2];
	chartMeasurements2.graphs[1].lineColor = listColors[3];

	var listAxisPropNames = [ 'color', 'gridColor', 'titleColor' ];
	for (var i=0; i<listAxisPropNames.length; i++) {
		var prop = listAxisPropNames[i];
		chartMeasurements1.valueAxes[0][prop] = listColors[0];
		chartMeasurements1.valueAxes[1][prop] = listColors[1];
		chartMeasurements2.valueAxes[0][prop] = listColors[2];
		chartMeasurements2.valueAxes[1][prop] = listColors[3];
	}

	// valueAxis1.color = colorGraph1;
	// valueAxis1.gridColor = colorGraph1;
	// valueAxis1.titleColor = colorGraph1;

	chartMeasurements1.write("chartMeasurements1");
	chartMeasurements2.write("chartMeasurements2");
	document.getElementById('chartMeasurements1').style.backgroundColor = '#fff';
	document.getElementById('chartMeasurements2').style.backgroundColor = '#fff';


	// fill selection elements
	// --fillSelectElementWrapper("ccs_param", listMeasNamesCCS);
	// --fillSelectElementWrapper("dms_param", listMeasNamesDMS);
	/*
		listMeasNames : [  ----------> fill selection box
			{ groupID: "CCS", groupLabel: "Temperature (CCS meas.)", names: [...] }
		]
	*/
	// clear all containers
	var nParams = 4;
	for (var i=0; i<nParams; i++) {
		// container "selection1_container" etc.
		var idSelectionBox = "selection" + String(i+1) + "_container";
		var selectionBox = document.getElementById(idSelectionBox);
		while (selectionBox.hasChildNodes()) {
			selectionBox.removeChild(selectionBox.childNodes[0]);
		}
	}
	// insert names for each meas.group
	var listMeasGroups = measurements.listMeasNames;
	for (var i=0; i<listMeasGroups.length; i++) {
		insertSelectionGroup(listMeasGroups[i]);
	}

	addEmptyOptionToSelectElementsAll();


	// console.log("measurements=", measurements)
	// console.log("measurements.limits=", measurements.limits)
	self.limits = measurements.limits;
	self.units = measurements.units;

	preselectPlotParameters(measurements);

	// zoomStartDateLast = measurements[0].datetime;
	// zoomEndDateLast = measurements[measurements.length-1].datetime;
	// zoomStartDateLast = logdata.timestampFirst;
	// zoomEndDateLast = logdata.timestampLast;

	// zoom out to full days
	zoomStartDateLast = makeTimestampAtBeginning(logdata.timestampFirst);
	zoomEndDateLast = makeTimestampAtEnd(logdata.timestampLast);

	// var doRefresh = false;
	// selectParam('selection1', 0, chartMeasurements1, doRefresh);
	// selectParam('selection2', 1, chartMeasurements1, doRefresh);
	// selectParam('selection3', 0, chartMeasurements2, doRefresh);
	// selectParam('selection4', 1, chartMeasurements2, doRefresh);
	chartMeasurements1.validateData();
	chartMeasurements2.validateData();

	document.getElementById(idTab).style.display = 'none';
}

// selectInfo = { groupID: "CCS", groupLabel: "Temperature (CCS meas.)", names: [...] }
function insertSelectionGroup(selectInfo) {
	// console.log("insertSelectionGroup: selectInfo=", selectInfo)

	if (selectInfo.names.length == 0) {
		// group has no measurements in the log files -> do not add
		return
	}

	var groupLabel = selectInfo.groupLabel;
	var names = selectInfo.names;
	// var id = "selection" + selectInfo.groupID;

	var nParams = 4;
	for (var i=0; i<nParams; i++) {
		// ID of container "selection1_container" etc.
		var idSelectionBox = "selection" + String(i+1) + "_container";

		// ID of LI-element which contains a single meas.name.list
		var idSelectionList ="selection" + String(i+1) + ":" + selectInfo.groupID;
		var LIselectionList = document.getElementById(idSelectionList);
		if (LIselectionList == undefined) {
			// create LI-element
			LIselectionList = document.createElement("li");
		}
		var idSelectionLabel = "selection" + String(i+1);
		updateSelectionList(LIselectionList, selectInfo, idSelectionLabel);

		// insert into container "selection1_container" etc.
		var selectionBox = document.getElementById(idSelectionBox);
		selectionBox.appendChild(LIselectionList);
	}
	// throw 43634645
}

function updateSelectionList(LIselectionList, selectInfo, idSelectionBox) {
	// delete all children
	while (LIselectionList.hasChildNodes()) {
		LIselectionList.removeChild(LIselectionList.childNodes[0]);
	}
	// insert A-element for group label
	var AgroupLabel = document.createElement("A");
	AgroupLabel.text = selectInfo.groupLabel + " >";
	LIselectionList.appendChild(AgroupLabel);
	// insert UL-element for list of names
	var ULmeasNameList = document.createElement("UL");
	// insert LI-element for each name
	var names = selectInfo.names;
	for (var i=0; i<names.length; i++) {
		var LImeasName = document.createElement("LI");
		var AmeasName = document.createElement("A");
		AmeasName.text = names[i];
		AmeasName.onclick = callbackSelectParam;
		AmeasName.idLabel = idSelectionBox;
		AmeasName.measName = names[i];
		LImeasName.appendChild(AmeasName);
		ULmeasNameList.appendChild(LImeasName);
	}
	LIselectionList.appendChild(ULmeasNameList);
}

function addGroupToSelectElement(idSelectionBox, names) {
	for (var i=0; i<names.length; i++) {
		console.log(i, "idSelectionBox=", idSelectionBox, "names[i]=", names[i])

		var measName = names[i];
		var c = document.createElement("li");
		var entry = document.createElement("a");
		entry.innerHTML = measName;
		entry.onclick = callbackSelectParam;
		entry.idLabel = idSelectionBox;
		entry.measName = measName;
		c.appendChild(entry);
		c.id = idSelectionBox + ":" + measName;

		var p = document.getElementById(idSelectionBox).parentElement;
		var siblings = p.children;
		var container = undefined;
		for (var i=0; i<siblings.length; i++) {
			if (siblings[i].localName == "ul") {
				container = siblings[i];
				break;
			}
		}
		if (container != undefined) {
			container.appendChild(c);
		}
		else {
			console.log("error: cannot find container for option '(none)'")
		}
	}
}

/*
function addEmptyOptionToSelectElement(idLabel) {
	// console.log("addEmptyOptionToSelectElement begin: idLabel=", idLabel)
	var measName = "(none)";
	var c = document.createElement('li');
	var entry = document.createElement("a");
	entry.innerHTML = measName;
	entry.onclick = callbackSelectParam;
	entry.idLabel = idLabel;
	entry.measName = measName;
	c.appendChild(entry);
	c.id = "empty" + idLabel;
	// var strOnclick = "callbackNew('" + idLabel + "', '" + measName + "');";
	// c.innerHTML = '<a onclick="' + strOnclick + '">' + measName + '</a>';
	// console.log("c=", c)

	// idLabel= selection1
	// console.log("idLabel=", idLabel)
	// container is ul-sibling of idLabel
	var p = document.getElementById(idLabel).parentElement;
	var siblings = p.children;
	var container = undefined;
	for (var i=0; i<siblings.length; i++) {
		if (siblings[i].localName == "ul") {
			container = siblings[i];
			break;
		}
	}
	if (container != undefined) {
		container.appendChild(c);
	}
	else {
		console.log("error: cannot find container for option '(none)'")
	}
}
*/


function resetSelectElement(id, idLabel) {
	// id = ccs_param1
	// console.log("id=", id)

	var x = document.getElementById(id);
	// remove all
	while (x.hasChildNodes()) {
		x.removeChild(x.childNodes[0]);
	}

	// remove empty option for a given selection
	// idLabel= selection1
	// console.log("idLabel=", idLabel)
	var idEmptyOption = "empty" + idLabel;
	var el = document.getElementById(idEmptyOption);
	if (el != null) {
		while (el.hasChildNodes()) {
			el.removeChild(el.childNodes[0]);
		}
	}
}

function callbackSelectParam(ev) {
	// console.log("ev=", ev)
	var entry = ev.target;
	// console.log("entry=", entry)
	var idLabel = entry.idLabel;
	var measName = entry.measName;
	selectParam(idLabel, measName, true);
}

function fillSelectElement(idList, idLabel, listMeasNames) {
	resetSelectElement(idList, idLabel);
	var x = document.getElementById(idList);
	for (var k=0; k<listMeasNames.length; k++) {
		var c = document.createElement("li");
		var entry = document.createElement("a");
		entry.innerHTML = listMeasNames[k];
		entry.onclick = callbackSelectParam;
		entry.idLabel = idLabel;
		entry.measName = listMeasNames[k];
		c.appendChild(entry);
		// var strOnclick = "selectParam('" + idLabel + "', '" + listMeasNames[k] + "', true);";
		// c.innerHTML = '<a onclick="' + strOnclick + '">' + listMeasNames[k] + '</a>';
		x.appendChild(c);
	}
}

function addEmptyOptionToSelectElement(idLabel) {
	// console.log("addEmptyOptionToSelectElement begin: idLabel=", idLabel)
	var measName = "(none)";
	var c = document.createElement('li');
	var entry = document.createElement("a");
	entry.innerHTML = measName;
	entry.onclick = callbackSelectParam;
	entry.idLabel = idLabel;
	entry.measName = measName;
	c.appendChild(entry);
	c.id = "empty" + idLabel;
	// var strOnclick = "callbackNew('" + idLabel + "', '" + measName + "');";
	// c.innerHTML = '<a onclick="' + strOnclick + '">' + measName + '</a>';
	// console.log("c=", c)

	// idLabel= selection1
	// console.log("idLabel=", idLabel)
	// container is ul-sibling of idLabel
	var p = document.getElementById(idLabel).parentElement;
	var siblings = p.children;
	var container = undefined;
	for (var i=0; i<siblings.length; i++) {
		if (siblings[i].localName == "ul") {
			container = siblings[i];
			break;
		}
	}
	if (container != undefined) {
		container.appendChild(c);
	}
	else {
		console.log("error: cannot find container for option '(none)'")
	}
}

function selectOption(id, name) {
	var e = document.getElementById(id);
	for (var i=0; i<e.options.length; i++) {
		if (e.options[i].text == name) {
			e.options.selectedIndex = i;
			break;
		}
	}
}

function getUnit(nameMeas) {
	var unit;
	if (nameMeas.match(/^DMS_[AB]/)) {
		// DMS temparature
		unit = "degC";
	}
	else {
		// unit = HexParserCCS.getUnit(nameMeas);
		var parserCCS = new HexParserCCS();
		unit = parserCCS.getUnit(nameMeas);
	}
	return unit;
}

function getRange(nameMeas) {
	var range;
	if (nameMeas.match(/^DMS_[AB]/)) {
		// DMS temparature
		range = limitsMeasDMS;
	}
	else {
		range = limitsMeas[nameMeas];
	}
	return range;
}

function selectParam(idSelection, nameMeas, doRefresh) {
	// console.log("selectParam: input=", idSelection, nameMeas, doRefresh);

	// idSelection = "selection2_container"
	// idSelection = "selection2"

	document.getElementById(idSelection).innerHTML = nameMeas;

	var idxGraph, chart;
	if (idSelection==='selection1') { idxGraph=0; chart=chartMeasurements1; }
	if (idSelection==='selection2') { idxGraph=1; chart=chartMeasurements1; }
	if (idSelection==='selection3') { idxGraph=0; chart=chartMeasurements2; }
	if (idSelection==='selection4') { idxGraph=1; chart=chartMeasurements2; }

	// console.log("selectParam:", "idSelection=", idSelection, "nameMeas=", nameMeas);

	// console.log("self.limits=", self.limits)
	// console.log("self.units=", self.units)

	if (nameMeas == "(none)") {
		chart.graphs[idxGraph].hidden = true;
	}
	else {
		var unitStr = self.units[nameMeas];
		var range = self.limits[nameMeas];

		chart.graphs[idxGraph].valueField = nameMeas;
		chart.graphs[idxGraph].hidden = false;
		chart.graphs[idxGraph].valueAxis.title = nameMeas + ' [' + unitStr + ']';
		if (range !== undefined) {
			chart.graphs[idxGraph].valueAxis.minimum = range.min;
			chart.graphs[idxGraph].valueAxis.maximum = range.max;
		}
		else {
			chart.graphs[idxGraph].valueAxis.minimum = NaN;
			chart.graphs[idxGraph].valueAxis.maximum = NaN;
		}
	}

	if (doRefresh) {
		// store zoom window because validateData() overwrites it
		// var x1 = zoomStartIndexLast;
		// var x2 = zoomEndIndexLast;
		var z1 = zoomStartDateLast;
		var z2 = zoomEndDateLast;

		chart.validateData();

		// restore zoom window
		// chart.zoomToIndexes(x1, x2);
		chart.zoomToDates(z1, z2);
	}
}

function handleZoom1(ev) {
	// console.log("zoom1")
	// console.log("ev=", ev)
	var z1 = ev.startDate;
	var z2 = ev.endDate;
	zoomStartIndexLast = ev.startIndex;
	zoomEndIndexLast = ev.endIndex;
	zoomStartDateLast = ev.startDate;
	zoomEndDateLast = ev.endDate;
	chartMeasurements2.zoomToDates(z1, z2);		// sync zoom with chart 2
	chartBasicEvents.zoomToDates(z1, z2);		// sync zoom with chart basic evs
}

function handleZoom2(ev) {
	// console.log("zoom2")
	// console.log("ev=", ev)
	var z1 = ev.startDate;
	var z2 = ev.endDate;
	zoomStartIndexLast = ev.startIndex;
	zoomEndIndexLast = ev.endIndex;
	zoomStartDateLast = ev.startDate;
	zoomEndDateLast = ev.endDate;
	chartMeasurements1.zoomToDates(z1, z2);		// sync zoom with chart 1
	chartBasicEvents.zoomToDates(z1, z2);		// sync zoom with chart basic evs
}

function handleZoomBasicEvents(ev) {
	// console.log("zoom3")
	// console.log("ev=", ev)
	// throw "436456"
	var z1 = ev.startDate;
	var z2 = ev.endDate;
	zoomStartIndexLast = ev.startIndex;
	zoomEndIndexLast = ev.endIndex;
	// console.log(235345, zoomStartDateLast, zoomEndDateLast)
	zoomStartDateLast = ev.startDate;
	zoomEndDateLast = ev.endDate;
	chartMeasurements1.zoomToDates(z1, z2);	
	chartMeasurements2.zoomToDates(z1, z2);	
}

function isContained(elementToFind, array) {
	var checkFunc = function(element) {
		return element===elementToFind;
	};
	return array.some(checkFunc);
}

function XX_preselectPlotParameters() {
	var preselection = {
		selection1 : 'Air inlet temperature',
		selection2 : 'Air outlet temperature',
		selection3 : 'Water inlet temperature',
		selection4 : 'Water outlet temperature',
	};
	var doRefresh = false;
	for (var idSelection in preselection) {
		var nameMeas = preselection[idSelection];
		if (isContained(nameMeas, listMeasNamesCCS)) {
			selectParam(idSelection, nameMeas, doRefresh);
		}
		else {
			selectParam(idSelection, '(none)', doRefresh);
		}
	}
}

function isMeasurementWithValues(nameMeas, measurements) {
	var listMeasNames = measurements.listMeasNames;
	var hasValues = false;
	for (var i=0; i<listMeasNames.length; i++) {
		var namesWithValues = listMeasNames[i].names;
		if (isContained(nameMeas, namesWithValues)) {
			hasValues = true;
			break;
		}
	}
	return hasValues;
}

function preselectPlotParameters(measurements) {
	var preselected = measurements.preselected;

	var preselection = {};
	preselection["selection1"] = preselected[0];
	preselection["selection2"] = preselected[1];
	preselection["selection3"] = preselected[2];
	preselection["selection4"] = preselected[3];

	var doRefresh = false;
	for (var idSelection in preselection) {
		var nameMeas = preselection[idSelection];
		if (isMeasurementWithValues(nameMeas, measurements)) {
			selectParam(idSelection, nameMeas, doRefresh);
		}
		else {
			console.log("preselectPlotParameters: measurement", nameMeas, "has no values")
			selectParam(idSelection, '(none)', doRefresh);
		}
	}
}


window.TabMeasurements = TabMeasurements;

}())
