
'use strict';

(function () {

// for callbacks
var self;

function TabFirmware(mainObj) {
	// for callbacks
	self = this;

	this.mainObj = mainObj;
	this.isInitialized = false;
	this.reportFirmwareVersionCheck = [];
}

TabFirmware.prototype.initialize = function() {
	console.log("TabFirmware.initialize start");
	if (this.isInitialized) return;
	if (!tabLoad.isReadingAllDone) return;
	tabFirmware.isInitialized = true;
}

TabFirmware.prototype.reset = function() {
	this.isInitialized = false;
	resetFirmware();
}

TabFirmware.prototype.update = function(logdata) {
	this.reportFirmwareVersionCheck = makeReportFirmwareVersionCheck(logdata);
}

function makeTableRowDetailsFirmwareVersionCheck(numErrorMismatch, details, idx) {
	var fieldDate = document.createElement("TD");
	fieldDate.innerHTML = details[0].datetime.toLocaleDateString();
	var fieldNumMismatch = document.createElement("TD");
	fieldNumMismatch.innerHTML = numErrorMismatch;
	if (numErrorMismatch === 0) {
		fieldNumMismatch.style.color = '#000';
		fieldNumMismatch.style.backgroundColor = '#fff';
	}
	else {
		fieldNumMismatch.style.color = '#fff';
		fieldNumMismatch.style.backgroundColor = '#e00';
	}
	var fieldDetails = document.createElement("TD");
	// fieldDetails.innerHTML = '<a onclick="callbackShowDetailsFirmwareVersionCheck(' + idx + ');">show details</a>';
	var linkCallback = document.createElement("A");
	linkCallback.onclick = callbackShowDetailsFirmwareVersionCheck;
	linkCallback.idx = idx;
	linkCallback.text = "show details";
	// console.log("linkCallback=",linkCallback)
	// fieldDetails.innerHTML = '<a onclick="callbackShowDetailsFirmwareVersionCheck(' + idx + ');">show details</a>';
	fieldDetails.appendChild(linkCallback);
	var tableRow = document.createElement("TR");
	tableRow.appendChild(fieldDate);
	tableRow.appendChild(fieldNumMismatch);
	tableRow.appendChild(fieldDetails);

	return tableRow;
}

function updateDetailsFirmwareVersionCheck(report) {
	var tableFirmwareVersionCheck = document.getElementById('tableFirmwareVersionCheck');

	for (var i=0; i<report.numErrorMismatchByDay.length; i++) {
		var numErrorMismatch = report.numErrorMismatchByDay[i];
		var details = report.details[i];
		if (details.length > 0) {
			var tableRow = makeTableRowDetailsFirmwareVersionCheck(numErrorMismatch, details, i);
			tableFirmwareVersionCheck.appendChild(tableRow);
		}
	}
}

function convertRecordToText(record) {
	var severity = record.severity;
	if (severity.length===1) severity += '&nbsp;';

	var fields = [
		severity,
		record.datetime.toLocaleString(),
		record.event_source,
		record.event_id,
		record.event_text
	];

	var s = fields.join('&nbsp;&nbsp;');

	return s;
}

function callbackShowDetailsFirmwareVersionCheck(evt) {
	// console.log("evt.target=", evt.target)
	var idx = evt.target.idx;
	var records = self.reportFirmwareVersionCheck.details[idx];
	var tt = [];
	for (var i=0; i<records.length; i++) {
		var record = records[i];
		var textline = convertRecordToText(record);
		var format = 'firmwareCheckOk';
		if (record.event_source === 'CT_GSV' && record.event_id === 216) {
			format = 'firmwareCheckError';
		}
		var si = '<span class="' + format + '">' + textline + '</span>';
		tt.push(si);
	}
	var s = tt.join("<br>");
	document.getElementById('detailsFirmwareVersionCheck').innerHTML = s;
}

// HTML DOM Table Object
// http://www.w3schools.com/jsref/dom_obj_table.asp
function clearTable(tableElement) {
	var n = tableElement.rows.length;
	// console.log('n='+n);
	if (n > 1) {
		var iFirstRemove = 1;		// don't remove header
		for (var i=n-1; i>=iFirstRemove; i--) {
			tableElement.deleteRow(i);
		}
	}
}

function resetFirmware() {
	//clearTable(document.getElementById('tableStatus'));

	var element = document.getElementById('fieldFirmwareVersionCheck');
	element.innerHTML = 'No data loaded';
	element.style.color = '#000';
	element.style.backgroundColor = '#fff';

	clearTable(document.getElementById('tableFirmwareVersionCheck'));
	document.getElementById('detailsFirmwareVersionCheck').innerHTML = '';
}

function makeReportFirmwareVersionCheck(logdata) {

	// console.log(57372, "makeReportFirmwareVersionCheck: logdata=", logdata)

	var listFirmwareInfo = logdata.firmwareInfo;

	if (listFirmwareInfo.length === 0) return;

	var numErrorMismatchTotal = 0;
	var numErrorMismatchByDay = [];
	var details = [];
	var foundFirmwareInfo = false;

	for (var i=0; i<listFirmwareInfo.length; i++) {
		var firmwareInfo = listFirmwareInfo[i];
		// console.log([346455, i, "firmwareInfo=", firmwareInfo]);

		if (firmwareInfo == undefined) {
			continue;
		}

		var detailsDay = firmwareInfo.detailsDay;
		var numErrorMismatchDay = firmwareInfo.numErrorMismatchDay;

		numErrorMismatchTotal += numErrorMismatchDay;
		numErrorMismatchByDay.push(numErrorMismatchDay);
		details.push(detailsDay);
		foundFirmwareInfo = foundFirmwareInfo || firmwareInfo.foundFirmwareInfo;
	}

	var report = {
		numErrorMismatchTotal	: numErrorMismatchTotal,
		numErrorMismatchByDay	: numErrorMismatchByDay,
		details					: details,
		foundFirmwareInfo		: foundFirmwareInfo
	};

	resetFirmware();
	updateStatusFirmwareVersionCheck(report);
	updateDetailsFirmwareVersionCheck(report);

	return report;
}

function updateStatusFirmwareVersionCheck(report) {
	// console.log("updateStatusFirmwareVersionCheck start");
	// console.log("report=", report);

	var element = document.getElementById('fieldFirmwareVersionCheck');

	if (report.numErrorMismatchTotal === 0) {
		element.innerHTML = 'OK';
		element.style.color = '#000';
		element.style.backgroundColor = '#0e0';
	}
	else {
		element.innerHTML = 'ERROR';
		element.style.color = '#fff';
		element.style.backgroundColor = '#e00';
	}

	var fieldFirmwareDetails = document.getElementById('fieldFirmwareDetails');

	if (report.foundFirmwareInfo === false) {
		element.innerHTML = 'No firmware info found<br>(CT_GSV 214 or 216)';
		element.style.color = '#000';
		element.style.backgroundColor = '#eee';
		fieldFirmwareDetails.innerHTML = "";
	}
	else {
		var linkCallback = document.createElement("A");
		linkCallback.onclick = callbackOnSysInfoTab;
		linkCallback.text = "Click here for details";
		// console.log("linkCallback=",linkCallback)
		// fieldFirmwareDetails.innerHTML = "<a onclick=\"showTab('tabFirmware');\">Click here for details</a>";
		fieldFirmwareDetails.appendChild(linkCallback);
	}
}

function callbackOnSysInfoTab(evt) {
	self.mainObj.showTab("tabFirmware");
}


window.TabFirmware = TabFirmware;

}())
