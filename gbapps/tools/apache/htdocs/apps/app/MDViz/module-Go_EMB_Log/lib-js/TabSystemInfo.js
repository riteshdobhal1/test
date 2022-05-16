
function tabSystemInfo() {
}

tabSystemInfo.isInitialized = false;

tabSystemInfo.initialize = function() {
	console.log("tabSystemInfo.initialize start");
	// console.log([tabSystemInfo.isInitialized, tabLoad.isReadingAllDone]);
	if (tabLoad.isReadingAllDone) {
		if (!tabSystemInfo.isInitialized) {
			if (reportFirmwareVersionCheck.length === 0) {
				reportFirmwareVersionCheck = makeReportFirmwareVersionCheck(listEventLogObjects);
			}
			tabSystemInfo.isInitialized = true;
		}
	}
}

tabSystemInfo.reset = function() {
	console.log("tabSystemInfo.reset start");
	tabSystemInfo.isInitialized = false;
	resetFirmware();
	resetTableStatus();
}

function resetTableStatus() {
	// tableStatus
	var element = document.getElementById("fieldFirmwareVersionCheck");
	element.innerHTML = "No data loaded";
	element.style.color = "#000";
	element.style.backgroundColor = "#eee";

	reportFirmwareVersionCheck = [];

	document.getElementById('fieldFirmwareDetails').innerHTML = "";
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
		fieldFirmwareDetails.innerHTML = "<a onclick=\"showTab('tabFirmware');\">Click here for details</a>";
	}
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

function makeReportFirmwareVersionCheck(listEventLogObjects) {
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
