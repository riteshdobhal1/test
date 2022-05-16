
'use strict';

(function () {

const TIMESTAMP_FIELD_NAME = "datetime";

// for callbacks
var self;

function TabLoad(mainObj) {
	// for callbacks
	self = this;

	this.mainObj = mainObj;
	this.isInitialized = false;
	this.listEventLogObjects = listEventLogObjects;
	this.isReadingAllDone = false;

	document.getElementById('fileinput').addEventListener('change', callbackFileinput, false);

	setCallbacksDropzone();
}

TabLoad.prototype.initialize = function() {
	this.isInitialized = true;
	document.getElementById('buttonLoadAll').addEventListener('click', callbackLoadAll, false);
}

TabLoad.prototype.reset = function() {
	this.isInitialized = false;
	this.isReadingAllDone = false;
	document.getElementById("loadStatus3").innerHTML = "No files selected yet";
	document.getElementById("systemInfo").innerHTML = "No files loaded yet.";
	document.getElementById("systemSerial").innerHTML = "---";
	document.getElementById("systemInfoTabLoad").innerHTML = "No files loaded yet.";
}


// global variables
var listFileObjects = [];
var loadStatus;
var isReadingDone;
var tableLoadStatus;
var foundSystemInfo = false;
var listEventLogObjects = [];
var indexFileReader = 0;

function callbackReadingAllDone() {
	console.log('callbackReadingAllDone start');

	// show system info on load tab
	checkMissingSystemInfo();

	// console.log(346546, "listEventLogObjects=", listEventLogObjects)

	// combine all listEventLogObjects
	var logdata = combineAllEventLogObjects(listEventLogObjects);
	// console.log(6482413444, "logdata=", logdata)
	// throw "2965999 TabLoad"


	// refresh system info with longest text
	// because the first text may be missing some fields
	var metadata = logdata.systemInfo;
	showSystemSerial(metadata);
	// var dateStr = getDateAsString(listEventLogObjects[idx]);
	var dateStr = metadata.datetime.toLocaleDateString();
	var divSystemInfo = document.getElementById("systemInfo");
	showSystemInfo(metadata, dateStr, divSystemInfo);
	divSystemInfo = document.getElementById("systemInfoTabLoad");
	showSystemInfo(metadata, dateStr, divSystemInfo);


	self.mainObj.logdata = logdata;

	// update all tabs
	self.mainObj.update();

	// this.isReadingAllDone = true;
	self.isReadingAllDone = true;

	// free memory
	listFileObjects = null;
	listEventLogObjects = null;

	console.log('callbackReadingAllDone end');
}

function combineAllEventLogObjects(listEventLogObjects) {
	var systemInfo = selectSystemInfo(listEventLogObjects);
	var timestampFirst = listEventLogObjects[0].timestampFirst;
	var timestampLast = listEventLogObjects[0].timestampLast;
	var firmwareInfo = [];

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdataSingle = listEventLogObjects[i];

		if (logdataSingle.timestampFirst < timestampFirst) {
			timestampFirst = logdataSingle.timestampFirst;
		}
		if (logdataSingle.timestampLast > timestampLast) {
			timestampLast = logdataSingle.timestampLast;
		}

		if (logdataSingle.firmwareInfo != undefined) {
			firmwareInfo = firmwareInfo.concat(logdataSingle.firmwareInfo);
		}
	}

	var measurements = combineMeasurements(listEventLogObjects, timestampFirst, timestampLast);
	// console.log("measurements.plotdata[0]=", measurements.plotdata[0])

	var basicEvents = combineBasicEvents(listEventLogObjects, timestampFirst, timestampLast);
	// console.log("basicEvents=", basicEvents)

	var logdata = {
		systemInfo		: systemInfo,
		basicEvents		: basicEvents,
		measurements	: measurements,
		firmwareInfo	: firmwareInfo,
		timestampFirst	: timestampFirst,
		timestampLast	: timestampLast
	};

	return logdata;
}

function selectSystemInfo(listEventLogObjects) {
	var idxLengthMax = undefined;
	var lengthMax = -1;
	for (var i=0; i<listEventLogObjects.length; i++) {
		var len = listEventLogObjects[i].systemInfo.length;
		if (len > lengthMax) {
			lengthMax = len;
			idxLengthMax = i;
		}
	}
	if (idxLengthMax == undefined) {
		idxLengthMax = 0;
	}
	var systemInfo = listEventLogObjects[idxLengthMax].systemInfo;
	return systemInfo;
}

function combineBasicEvents(listEventLogObjects, timestampFirst, timestampLast) {
	var basicEvents = {};
	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdataSingle = listEventLogObjects[i];
		var basicObj = logdataSingle.basicEvents;
		for (var key in basicObj) {
			if (basicEvents[key] == undefined) {
				basicEvents[key] = basicObj[key];
			}
			else {
				basicEvents[key] = basicEvents[key].concat(basicObj[key]);
			}
		}
	}
	// sort chronologically
	var sortFunc = function(a, b) {
		return a[TIMESTAMP_FIELD_NAME] - b[TIMESTAMP_FIELD_NAME];
	};
	for (var key in basicEvents) {
		basicEvents[key].sort(sortFunc);
	}
	return basicEvents;
}

/*
var measurements = {
	plotdata : [...],  ------------> all measurements combined to a single list
	listMeasNames : [  ----------> fill selection box
		{ groupID: "CCS", groupLabel: "Temperature (CCS meas.)", names: [...] }
	],
	limits	: limits,
	units	: units
};
*/
function combineMeasurements(listEventLogObjects, timestampFirst, timestampLast) {

	var plotdata = makePlotdata(listEventLogObjects, timestampFirst, timestampLast);
	var listMeasNames = mergeListMeasNames(listEventLogObjects);

	var limits = {};
	var units = {};
	var preselected = [];
	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdataSingle = listEventLogObjects[i];
		var measObj = logdataSingle.measurements;
		updateLimits(limits, measObj.limits);
		updateUnits(units, measObj.units);
		preselected = measObj.preselected;
	}

	updateLimitsBasedOnData(limits, plotdata);

	var measurements = {
		plotdata		: plotdata,
		listMeasNames	: listMeasNames,
		limits			: limits,
		units			: units,
		preselected		: preselected
	};

	return measurements;
}

function makePlotdata(listEventLogObjects, timestampFirst, timestampLast) {
	var plotdata = [];
	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdataSingle = listEventLogObjects[i];
		var measObj = logdataSingle.measurements;
		plotdata = plotdata.concat(measObj.plotdata);
	}

	addTimestampAtBeginning(plotdata, timestampFirst);
	addTimestampAtEnd(plotdata, timestampLast);

	// sort plotdata chronologically
	var sortFunc = function(a, b) {
		return a[TIMESTAMP_FIELD_NAME] - b[TIMESTAMP_FIELD_NAME];
	};
	plotdata.sort(sortFunc);

	return plotdata;
}

function addTimestampAtBeginning(plotdata, timestampFirst) {
	var tpFirst = new Date(timestampFirst);
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

function addTimestampAtEnd(plotdata, timestampLast) {
	var tpLast = new Date(timestampLast);
	tpLast.setHours(23);
	tpLast.setMinutes(59);
	tpLast.setSeconds(59);
	tpLast.setMilliseconds(1000);	// trick to get 0:00 of next day
	var dummyRecord = {};
	dummyRecord[TIMESTAMP_FIELD_NAME] = tpLast;
	plotdata.push(dummyRecord);
}

function mergeListMeasNames(listEventLogObjects) {
	var listMeasNames = [];
	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdataSingle = listEventLogObjects[i];
		var measObj = logdataSingle.measurements;
		updateListMeasNames(listMeasNames, measObj.listMeasNames);
	}

	// sort measurement names alphabetically
	for (var i=0; i<listMeasNames.length; i++) {
		listMeasNames[i].names.sort();
	}

	return listMeasNames;
}

/*
	listMeasNames : [  ----------> fill selection box
		{ groupID: "CCS", groupLabel: "Temperature (CCS meas.)", names: [...] }
	]
*/
function updateListMeasNames(listMeasNames, listMeasNamesNew) {
	if (listMeasNames.length == 0) {
		// no known meas names
		for (var i=0; i<listMeasNamesNew.length; i++) {
			listMeasNames.push(listMeasNamesNew[i]);
		}
		return
	}

	// known meas names exist -> merge
	for (var i=0; i<listMeasNamesNew.length; i++) {
		updateListMeasNamesSingle(listMeasNames, listMeasNamesNew[i]);
	}
}

function updateListMeasNamesSingle(listMeasNames, groupInfo) {
	// check if group already exists
	var idNew = groupInfo.groupID;
	var foundGroup = false;
	var groupKnown = undefined;
	for (var k=0; k<listMeasNames.length; k++) {
		var id = listMeasNames[k].groupID;
		if (id == idNew) {
			foundGroup = true;
			groupKnown = listMeasNames[k];
			break;
		}
	}
	if (foundGroup) {
		// group exists -> insert names without duplicates
		insertNames(groupKnown, groupInfo);
	}
	else {
		// group does not exist
		listMeasNames.push(groupInfo);
	}
}

function insertNames(groupKnown, groupInfo) {
	var namesKnown = groupKnown.names;
	var namesNew = groupInfo.names;
	for (var i=0; i<namesNew.length; i++) {
		var name = namesNew[i];
		if (!namesKnown.includes(name)) {
			namesKnown.push(name);
		}
	}
}

function updateLimits(limits, limitsNew) {
	// console.log("limitsNew=", limitsNew)
	for (var measName in limitsNew) {
		if (limits[measName] == undefined) {
			limits[measName] = limitsNew[measName];
		}
	}
}

function updateUnits(units, unitsNew) {
	// console.log("unitsNew=", unitsNew)
	for (var measName in unitsNew) {
		// overwrite repeatedly
		units[measName] = unitsNew[measName];
	}
}

function updateLimitsBasedOnData(limits, plotdata) {
	// console.log("before limits=", limits)
	const n = plotdata.length;
	var isChanged = {};
	for (var meas in limits) {
		for (var i=0; i<n; i++) {
			var y = plotdata[i][meas];
			if (y != undefined) {
				if (y < limits[meas].min) { limits[meas].min = y; isChanged[meas]=1 }
				if (y > limits[meas].max) { limits[meas].max = y; isChanged[meas]=1 }
			}
		}
	}
	for (var meas in isChanged) {
		console.log("updateLimitsBasedOnData: changed limits:", meas, limits[meas])
	}
	// throw 46346465
}


function checkReadingDone() {
	var isDone = true;
	for (var i=0; i<isReadingDone.length; i++) {
		if (!isReadingDone[i]) {
			isDone = false;
			break;
		}
	}

	if (isDone) {
		callbackReadingAllDone();
	}
}


function callbackOnLoadStart(event) {
	//console.log(event);
	//loadStatus.innerHTML = loadStatus.innerHTML + "\nReading " + event.target.filename + ' ...';

	var idx = event.target.index;
	var row = tableLoadStatus.rows[idx];
	var cell = row.cells[1];
	cell.innerHTML = 'loading';
	cell.style.backgroundColor = '#ff0';
}

function XX_finalizeFile(evt) {
	var fileAsString = evt.target.result;
	// console.log("fileAsString=", fileAsString.length, "bytes")

	var idx = evt.target.index;
	var row = tableLoadStatus.rows[idx];
	var cell = row.cells[1];

	try {
		listEventLogObjects[idx] = eventLogParser.parse(fileAsString);
		isReadingDone[idx] = true;
		// loadStatus.innerHTML = loadStatus.innerHTML + "\n" + evt.target.filename + ' done';
		cell.innerHTML = 'done';
		cell.style.backgroundColor = '#afa';

		if (!foundSystemInfo) {
			var metadata = listEventLogObjects[idx].metadata;
			if (metadata !== undefined) {
				foundSystemInfo = true;
				showSystemSerial(metadata);
				var dateStr = getDateAsString(listEventLogObjects[idx]);
				var divSystemInfo = document.getElementById("systemInfo");
				showSystemInfo(metadata, dateStr, divSystemInfo);
				divSystemInfo = document.getElementById("systemInfoTabLoad");
				showSystemInfo(metadata, dateStr, divSystemInfo);
			}
		}
	}
	catch(err) {
		if (err.indexOf("DefinitionEventLogParser") != -1) {
			// cell.innerHTML = 'Error reading log file: ' + err;
			cell.innerHTML = 'Error: wrong format';
		}
		else {
			cell.innerHTML = 'Error: ' + err;
		}
		cell.style.backgroundColor = '#ffaaaa';
		console.log(err);
		//showMessage('Error reading measurements: ' + err, '#ffff00');
	}
}

function XX_callbackOnLoad(evt) {
	console.log("processed indexFileReader=", indexFileReader, "of", listFileObjects.length)
	finalizeFile(evt);

	indexFileReader += 1;
	console.log("next indexFileReader=", indexFileReader)

	if (indexFileReader < listFileObjects.length) {
		readSingleFile();
	}
	else {
		// checkReadingDone();
		callbackReadingAllDone();
	}
}

function callbackOnError(event) {
	// loadStatus.innerHTML = loadStatus.innerHTML + "\nError loading file";

	var idx = event.target.index;
	var row = tableLoadStatus.rows[idx];
	var cell = row.cells[1];
	cell.innerHTML = 'error';
	cell.style.backgroundColor = '#faa';
}

function sortFileObjectsByName(f1, f2) {
	var string1 = f1.name;
	var string2 = f2.name;
	return (string1 > string2) - (string1 < string2);
}

function updateSelectBox() {
/*
	var selectBox = document.getElementById('selectFiles');

	// empty list
	while (selectBox.options.length) {
		selectBox.remove(0);
	}

	for (var i=0; i<listFileObjects.length; i++) {
		var fileObj = listFileObjects[i];
		var c = document.createElement("option");
		c.text = fileObj.name;
		selectBox.options.add(c);
	}

	document.getElementById('loadStatus').innerHTML = 'Nothing loaded yet';
*/
}

function updateLoadStatusTable(listFileObjects) {
	tableLoadStatus = document.createElement('table');
	tableLoadStatus.setAttribute('border', '0');
	var tbdy = document.createElement('tbody');
	for (var i=0; i<listFileObjects.length; i++) {
		var tr = document.createElement('tr');
		// column 1: file name
		var td = document.createElement('td');
		var fileObj = listFileObjects[i];
		td.appendChild(document.createTextNode(fileObj.name));
		tr.appendChild(td);
		// column 2: load status text
		var loadStatusText = 'ready to load';
		td = document.createElement('td');
		td.appendChild(document.createTextNode(loadStatusText));
		td.style.backgroundColor = '#eee';
		tr.appendChild(td);
		tbdy.appendChild(tr);
	}
	tableLoadStatus.appendChild(tbdy);
	var divLoadStatus3 = document.getElementById('loadStatus3');
	if (divLoadStatus3.hasChildNodes()) {
		divLoadStatus3.removeChild(divLoadStatus3.childNodes[0]);
	}
	divLoadStatus3.appendChild(tableLoadStatus);
}

TabLoad.prototype.showFiles = function(listFiles) {
	// store all readable files
	listFileObjects = [];
	isReadingDone = [];
	for (var i=0; i<listFiles.length; i++) {
		var fileObj = listFiles[i];
		if (fileObj) {
			listFileObjects.push(fileObj);
			isReadingDone.push(false);
		}
	}

	listFileObjects.sort(sortFileObjectsByName);

	// create load status table
	updateLoadStatusTable(listFileObjects);
}

function readSingleFile() {
	console.log("readSingleFile start")
	var fileObj = listFileObjects[indexFileReader];
	var fileReader = new FileReader();
	fileReader.onloadstart = callbackOnLoadStart;
	fileReader.onload = callbackOnLoad;
	fileReader.onerror = callbackOnError;
	fileReader.filename = fileObj.name;
	fileReader.index = indexFileReader;
	fileReader.readAsText(fileObj);
}

function callbackLoadSelected(evt) {
	console.log('callbackLoadSelected start');
}

function processFileContents(fileAsString, indexStatusTable) {
	// var fileAsString = evt.target.result;
	//console.log(fileAsString);
	// console.log("fileAsString=", fileAsString.length, "bytes")

	// var idx = evt.target.index;
	var idx = indexStatusTable;
	var row = tableLoadStatus.rows[idx];
	var cell = row.cells[1];

	try {
		var eventLogParser = new EventLogParser();

		// memory leak !!!
		listEventLogObjects[idx] = eventLogParser.parse(fileAsString);
		
		isReadingDone[idx] = true;
		// loadStatus.innerHTML = loadStatus.innerHTML + "\n" + evt.target.filename + ' done';
		cell.innerHTML = 'done';
		cell.style.backgroundColor = '#afa';

		if (!foundSystemInfo) {
			// console.log("listEventLogObjects[idx]=", listEventLogObjects[idx])
			var metadata = listEventLogObjects[idx].systemInfo;
			// console.log("metadata=", metadata)
			if (metadata !== undefined) {
				foundSystemInfo = true;
				showSystemSerial(metadata);
				// var dateStr = getDateAsString(listEventLogObjects[idx]);
				var dateStr = metadata.datetime.toLocaleDateString();
				var divSystemInfo = document.getElementById("systemInfo");
				showSystemInfo(metadata, dateStr, divSystemInfo);
				divSystemInfo = document.getElementById("systemInfoTabLoad");
				showSystemInfo(metadata, dateStr, divSystemInfo);
			}
		}
		eventLogParser = null;
	}
	catch(err) {
		console.log("err=", err);
		if (err.indexOf("DefinitionEventLogParser") != -1) {
			// cell.innerHTML = 'Error reading log file: ' + err;
			cell.innerHTML = 'Error: wrong format';
		}
		else {
			cell.innerHTML = 'Error: ' + err;
		}
		cell.style.backgroundColor = '#ffaaaa';
		//showMessage('Error reading measurements: ' + err, '#ffff00');
	}
	checkReadingDone();
}

function callbackLoadAll(evt) {
	console.log('callbackLoadAll start');

	indexFileReader = 0;

	console.log("listFileObjects.length=", listFileObjects.length)

	// clear event load data and initialize
	listEventLogObjects = [];
	for (var i=0; i<listFileObjects.length; i++) {
		listEventLogObjects[i] = {};
	}

	// loadStatus.innerHTML = String(new Date().toLocaleString()) + "\nLoading " + String(listFileObjects.length) + ' file(s)';

	for (var i=0; i<listFileObjects.length; i++) {
		var fileObj = listFileObjects[i];
		var fileReader = new FileReader();
		fileReader.onloadstart = callbackOnLoadStart;
		// fileReader.onload = callbackOnLoad;
		// source: https://www.html5rocks.com/en/tutorials/file/dndfiles/

		/*
		fileReader.onload = (function(theFile, idx) {
			return function(evt) {
				console.log("file=", theFile.name, "bytes = ", evt.target.result.length)
				// processFileContents(evt.target.result, idx)
				var s = evt.target.result.substr(0,evt.target.result.length);
				processFileContents(s, idx)
				evt = null;
			};
		})(fileObj, i);
		*/
		fileReader.onload = (function(idx) {
			return function(evt) {
				processFileContents(evt.target.result, idx)
			};
		})(i);

		fileReader.onerror = callbackOnError;
		// fileReader.filename = fileObj.name;
		fileReader.index = i;
		fileReader.readAsText(fileObj);
	}
	// readSingleFile();
}

function getDateAsString(eventLogObject) {
	var dateStr = "unknown date";
	if (eventLogObject.logdata.length > 0) {
		dateStr = eventLogObject.logdata[0].datetime.toLocaleDateString();
	}
	return dateStr;
}

function showSystemInfo(metadata, dateStr, divSystemInfo) {
	// console.log("showSystemInfo start");
	// create system info table
	var table = document.createElement('table');
	table.setAttribute('border', '0');
	var tbdy = document.createElement('tbody');
	var tr, td;
	for (var key in metadata) {
		if (key == "datetime") continue;
		if (key == "lengthText") continue;
		tr = document.createElement('tr');
		// column 1: key
		td = document.createElement('td');
		td.appendChild(document.createTextNode(key));
		td.className = "cellSysInfo";
		tr.appendChild(td);
		// column 2: value
		td = document.createElement('td');
		var textOrig = metadata[key];
		var textEdited = textOrig.replace(/,/g, ", ");
		// console.log(key, textEdited)
		td.appendChild(document.createTextNode(textEdited));
		td.className = "cellSysInfo";
		tr.appendChild(td);
		tbdy.appendChild(tr);
	}

	// additional row for date
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.appendChild(document.createTextNode('Date'));
	td.className = "cellSysInfo";
	tr.appendChild(td);
	td = document.createElement('td');
	td.appendChild(document.createTextNode(dateStr));
	td.className = "cellSysInfo";
	tr.appendChild(td);
	tbdy.appendChild(tr);

	table.appendChild(tbdy);

	if (divSystemInfo.hasChildNodes()) {
		divSystemInfo.removeChild(divSystemInfo.childNodes[0]);
	}
	divSystemInfo.appendChild(table);
}

function showSystemSerial(metadata) {
	if (metadata === undefined) {
		document.getElementById('systemSerial').innerHTML = 'unknown';
	}
	else {
		document.getElementById('systemSerial').innerHTML = metadata['SerialNumber'];
	}
}

function checkMissingSystemInfo() {
	console.log("checkMissingSystemInfo start");
	if (foundSystemInfo === false) {
		var divSystemInfo = document.getElementById("systemInfo");
		divSystemInfo.innerHTML = "No system info CT_SCF_7 found.";
		divSystemInfo = document.getElementById("systemInfoTabLoad");
		divSystemInfo.innerHTML = "No system info CT_SCF_7 found.";
	}
}

// ------------------------------------------------------------------------
// callbacks
// ------------------------------------------------------------------------
// analog to callbackOnDrop
function callbackFileinput(evt) {
	console.log('callbackFileinput start');

	// clear infos from previous data
	self.mainObj.resetTabsAll();

	self.showFiles(evt.target.files);

	// switch to the Load tab
	self.mainObj.showTab('tabLoad');

	foundSystemInfo = false;
}

// analog to callbackFileinput
function callbackOnDrop(evt) {
	console.log('callbackOnDrop start');

	// clear infos from previous data
	self.mainObj.resetTabsAll();

	this.ondragend();
	evt.preventDefault();
	self.showFiles(evt.dataTransfer.files);

	// switch to the Load tab
	self.mainObj.showTab('tabLoad');

	foundSystemInfo = false;
}

function setCallbacksDropzone() {
	console.log('setCallbacksDropzone start');

	// disable the default behavior at the window level
	window.addEventListener("drop", function(e) { e.preventDefault(); }, false);

	//var dropzone = document.getElementById('dropzone');
	var dropzone = window;
	dropzone.ondragover = function () {
		document.body.style.backgroundColor = '#afa';
		return false;
	};
	dropzone.ondragend = function () {
		document.body.style.backgroundColor = '#fff';
		return false;
	};
	dropzone.ondragleave = dropzone.ondragend;
	dropzone.ondrop = callbackOnDrop;
}


window.TabLoad = TabLoad;

}())
