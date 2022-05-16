
function tabFirmware() {
}

tabFirmware.isInitialized = false;

tabFirmware.initialize = function() {
	console.log("tabFirmware.initialize start");
	if (tabFirmware.isInitialized) return;
	if (!tabLoad.isReadingAllDone) return;
	tabFirmware.isInitialized = true;
}

tabFirmware.reset = function() {
	tabFirmware.isInitialized = false;
	resetFirmware();
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
	fieldDetails.innerHTML = '<a onclick="callbackShowDetailsFirmwareVersionCheck(' + idx + ');">show details</a>';
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

function callbackShowDetailsFirmwareVersionCheck(idx) {
	var records = reportFirmwareVersionCheck.details[idx];
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

