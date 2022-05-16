
function tabLoad() {
}

tabLoad.isInitialized = false;
tabLoad.isReadingAllDone = false;

tabLoad.initialize = function() {
	tabLoad.isInitialized = true;
}

tabLoad.reset = function() {
	tabLoad.isInitialized = false;
	tabLoad.isReadingAllDone = false;
	document.getElementById("loadStatus3").innerHTML = "No files selected yet";
	document.getElementById("systemInfo").innerHTML = "No files loaded yet.";
	document.getElementById("systemSerial").innerHTML = "---";
	document.getElementById("systemInfoTabLoad").innerHTML = "No files loaded yet.";
}


// global variables
var listFileObjects;
var listEventLogObjects = [];
var loadStatus;
var isReadingDone;
var tableLoadStatus;
var foundSystemInfo = false;


function callbackReadingAllDone() {
	console.log('callbackReadingAllDone start');

	tabLoad.isReadingAllDone = true;

	checkMissingSystemInfo();
	// makeReportScanIntervals(listEventLogObjects);

	// initialize all tabs
	console.log("initializing all tabs...");
	showPleaseWait();
	for (var idTab in listTabObjects) {
		listTabObjects[idTab].initialize();
	}
	// extra update for system info which depends on other tabs
	// tabSystemInfo.initialize();
	hidePleaseWait();
	console.log("initializing all tabs...done");

	// automatically go to another tab
	// showTab("tabSystemInfo");
	showTab("tabMeasurements");

	console.log('callbackReadingAllDone end');
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

function callbackOnLoad(event) {
	//console.log('callbackOnLoad start');
	var fileAsString = event.target.result;
	//console.log(fileAsString);

	var idx = event.target.index;
	var row = tableLoadStatus.rows[idx];
	var cell = row.cells[1];

	try {
		listEventLogObjects[idx] = eventLogParser.parse(fileAsString);
		isReadingDone[idx] = true;
		// loadStatus.innerHTML = loadStatus.innerHTML + "\n" + event.target.filename + ' done';
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
		// cell.innerHTML = 'Error reading log file: ' + err;
		cell.innerHTML = 'Error: wrong format';
		cell.style.backgroundColor = '#faa';
		console.log(err);
		//showMessage('Error reading measurements: ' + err, '#ffff00');
	}

	// free memory
	fileAsString = "";

	// pause for 1 msec
	setTimeout(function(){}, 1);

	checkReadingDone();
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

function showFiles(listFiles) {
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

	// create load status table
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

// analog to callbackOnDrop
function callbackFileinput(event) {
	//console.log('callbackFileinput start');

	// clear infos from previous data
	resetTabsAll();

	showFiles(event.target.files);

	// switch to the Load tab
	callbackMenu('tabLoad');

	foundSystemInfo = false;
}

// analog to callbackFileinput
function callbackOnDrop(event) {
	console.log('callbackOnDrop start');

	// clear infos from previous data
	resetTabsAll();

	this.ondragend();
	event.preventDefault();
	showFiles(event.dataTransfer.files);

	// switch to the Load tab
	callbackMenu('tabLoad');

	foundSystemInfo = false;
}

function setCallbacksDropzone() {
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


function callbackLoadSelected(event) {
	console.log('callbackLoadSelected start');
}

function callbackLoadAll(event) {
	console.log('callbackLoadAll start');

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
		fileReader.onload = callbackOnLoad;
		fileReader.onerror = callbackOnError;
		fileReader.filename = fileObj.name;
		fileReader.index = i;
		fileReader.readAsText(fileObj);
	}
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
		tr = document.createElement('tr');
		// column 1: key
		td = document.createElement('td');
		td.appendChild(document.createTextNode(key));
		tr.appendChild(td);
		// column 2: value
		td = document.createElement('td');
		td.appendChild(document.createTextNode(metadata[key]));
		tr.appendChild(td);
		tbdy.appendChild(tr);
	}

	// additional row for date
	tr = document.createElement('tr');
	td = document.createElement('td');
	td.appendChild(document.createTextNode('Date'));
	tr.appendChild(td);
	td = document.createElement('td');
	td.appendChild(document.createTextNode(dateStr));
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

