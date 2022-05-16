
'use strict';

(function () {

// for callbacks
var self;

function TabSystemInfo(mainObj) {
	// for callbacks
	self = this;

	this.mainObj = mainObj;
	this.isInitialized = false;
}

TabSystemInfo.prototype.initialize = function() {
	console.log("tabSystemInfo.initialize start");
	// console.log([tabSystemInfo.isInitialized, tabLoad.isReadingAllDone]);
	if (tabLoad.isReadingAllDone) {
		if (!tabSystemInfo.isInitialized) {
			if (this.reportFirmwareVersionCheck.length === 0) {
				this.reportFirmwareVersionCheck = makeReportFirmwareVersionCheck(listEventLogObjects);
			}
			tabSystemInfo.isInitialized = true;
		}
	}
}

TabSystemInfo.prototype.update = function(logdata) {
}

TabSystemInfo.prototype.reset = function() {
	console.log("TabSystemInfo.prototype.reset start");
	this.isInitialized = false;
	// resetFirmware();
	resetTableStatus(this);
}

function resetTableStatus(obj) {
	// tableStatus
	var element = document.getElementById("fieldFirmwareVersionCheck");
	element.innerHTML = "No data loaded";
	element.style.color = "#000";
	element.style.backgroundColor = "#eee";

	obj.reportFirmwareVersionCheck = [];

	document.getElementById('fieldFirmwareDetails').innerHTML = "";
}

/*
report = {
	numErrorMismatchTotal:	Number
	numErrorMismatchByDay:	Array [ Number ]
	details:	Array [
		[ records ],	// day 1
		[ records ],	// day 2
		[ records ],	// day 3
	]
}
*/

function XX_makeReportFirmwareVersionCheck(listEventLogObjects) {
	if (listEventLogObjects.length === 0) return;

	var numErrorMismatchTotal = 0;
	var numErrorMismatchByDay = [];
	var details = [];
	var foundFirmwareInfo = false;

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;
		//console.log([i, logdata.length]);

		var detailsDay = [];
		var numErrorMismatchDay = 0;

		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
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
		numErrorMismatchTotal += numErrorMismatchDay;
		numErrorMismatchByDay.push(numErrorMismatchDay);
		details.push(detailsDay);
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

function makeReportFirmwareVersionCheck(listEventLogObjects) {
	if (listEventLogObjects.length === 0) return;

	var numErrorMismatchTotal = 0;
	var numErrorMismatchByDay = [];
	var details = [];
	var foundFirmwareInfo = false;

	for (var i=0; i<listEventLogObjects.length; i++) {
		var firmwareInfo = listEventLogObjects[i].firmwareInfo;
		console.log([346455, i, firmwareInfo]);

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

window.TabSystemInfo = TabSystemInfo;

}())
