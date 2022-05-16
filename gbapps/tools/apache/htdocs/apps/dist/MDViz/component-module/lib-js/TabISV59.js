
function tabISV59() {
}

tabISV59.isInitialized = false;

// if a firmware column contains too few entries, then it is incomplete
tabISV59.countEntriesMin = 10;

tabISV59.infos = [];

tabISV59.initialize______OLD = function() {
	if (listEventLogObjects.length === 0) return;
	if (!tabLoad.isReadingAllDone) return;
	if (tabISV59.isInitialized) return;

	tabISV59.infos = getInfosISV59(listEventLogObjects);

	showISV59(tabISV59.infos);

	tabISV59.isInitialized = true;
}

tabISV59.initialize = function() {
	console.log("tabISV59.initialize start");
	if (listEventLogObjects.length === 0) return;
	if (!tabLoad.isReadingAllDone) return;
	if (tabISV59.isInitialized) return;

	tabISV59.infos = getInfosISV59(listEventLogObjects);
	// console.log("tabISV59.infos=", tabISV59.infos);
	// console.log("tabISV59.infos=", tabISV59.infos[0]);

	// free memory
	listEventLogObjects = [];
	console.log("listEventLogObjects=", listEventLogObjects);

	showISV59(tabISV59.infos);

	tabISV59.isInitialized = true;
}

tabISV59.reset = function() {
	tabISV59.isInitialized = false;
	tabISV59.isReadingAllDone = false;

	// delete table rows
	var tableFirmware = document.getElementById("tableFirmwareInfos");
	clearTable(tableFirmware);
}


function convertDataISV59(listEventsISV59) {
	// listEventsISV59
	//		datetime: Date, event_text: String
	// fwRecords
	//		timestamp: Number, data: String
	var fwRecords = [];
	for (var i=0; i<listEventsISV59.length; i++) {
		var record = {
			timestamp: Number(listEventsISV59[i].datetime),
			data: listEventsISV59[i].event_text
		};
		fwRecords.push(record);
	}
	return fwRecords;
}

function getInfosISV59(listEventLogObjects) {
	console.log("getInfosISV59 start");
	var listEventsISV59 = extractEventTextISV59(listEventLogObjects);
	// console.log("listEventsISV59=", listEventsISV59);

	if (listEventsISV59.length == 0) {
		return undefined;
	}

	var fwRecords = convertDataISV59(listEventsISV59);
	// console.log("fwRecords=", fwRecords);
	var fwIntervals = findIntervals(fwRecords);
	var listFirmwareInfo = makeListFirmwareInfo(fwIntervals);
	// console.log("listFirmwareInfo=", listFirmwareInfo);
	var listComponents = getComponentsAll(listFirmwareInfo);
	// console.log("listComponents=", listComponents);
	var Merged = mergeFirmwareIinfo(listFirmwareInfo, listComponents);
	// console.log("Merged=", Merged);
	var TableFirmwareData = convertToTable(Merged);
	// console.log("TableFirmwareData=", TableFirmwareData);

	var listSW = extractSoftwareVersion(listEventLogObjects);
	// console.log("listSW=", listSW);
	var listSWmatched = mapSWversionToIntervals(listSW, fwIntervals);
	// console.log("listSWmatched=", listSWmatched);

	var ret = { intervals:fwIntervals, data:TableFirmwareData,
					listSWmatched:listSWmatched };
	return ret;
}

function mapSWversionToIntervals(listSW, fwIntervals) {
	var listSWmatched = [];
	// console.log("fwIntervals=", fwIntervals);
	for (var i=0; i<fwIntervals.length; i++) {
		var tsBegin = fwIntervals[i].begin;
		var tsEnd = fwIntervals[i].end;
		if (tsBegin == tsEnd) {
			// single timestamp, not interval -> expand to day
			var t1 = new Date(tsBegin);
			var t2 = new Date(tsEnd);
			t1.setHours(0,0,0);
			t2.setHours(23,59,59);
			tsBegin = t1.valueOf();
			tsEnd = t2.valueOf();
		}
		// console.log("tsBegin, tsEnd=", tsBegin, tsEnd);
		// find SW version in interval
		var swVersion = "(not found)";
		for (var k=0; k<listSW.length; k++) {
			var ts = listSW[k].datetime.valueOf();
			// console.log("k, tsBegin, ts, tsEnd=", k, tsBegin, ts, tsEnd);
			if (tsBegin <= ts && ts <= tsEnd) {
				swVersion = listSW[k].swVersion;
				// console.log("tsBegin, ts, tsEnd", tsBegin, ts, tsEnd, swVersion);
				break;
			}
		}
		listSWmatched.push(swVersion);
	}
	return listSWmatched;
}

function getFieldsAll(rowMerged) {
	var hash = {};
	for (var k=0; k<rowMerged.length; k++) {
		var component = rowMerged[k];
		for (var fieldName in component) {
			if (fieldName != "COMPONENT") {
				hash[fieldName] = 1;
			}
		}
	}
	var listFields = [];
	for (var fieldName in hash) {
		listFields.push(fieldName);
	}
	return listFields;
}

function convertToTable(Merged) {
	var TableFirmwareData = [];
	for (var i=0; i<Merged.length; i++) {
		// console.log("Merged", i, Merged[i]);
		var nIntervals = Merged[i].length;
		var componentName = "unknown";
		for (var k=0; k<nIntervals; k++) {
			if (Merged[i][k] != undefined) {
				componentName = Merged[i][k]["COMPONENT"];
				break;
			}
		}
		// console.log("componentName=", componentName);
		var listFields = getFieldsAll(Merged[i]);
		// console.log("listFields=", listFields);
		var nFields = listFields.length;
		for (var j=0; j<nFields; j++) {
			var row = [componentName];
			var fieldName = listFields[j];
			row.push(fieldName);
			for (var k=0; k<nIntervals; k++) {
				var value = "";
				if (Merged[i][k] != undefined) {
					value = Merged[i][k][fieldName];
				}
				row.push(value);
			}
			TableFirmwareData.push(row);
		}
	}
	return TableFirmwareData;
}

function getComponent(firmwareInfo, component) {
	var data = undefined;
	for (var k=0; k<firmwareInfo.length; k++) {
		if (firmwareInfo[k]["COMPONENT"] == component) {
			data = firmwareInfo[k];
		}
	}
	return data;
}

function mergeFirmwareIinfo(listFirmwareInfo, listComponents) {
	// Merged[i][k] = i-th component, k-th interval
	var nComponents = listComponents.length;
	var nIntervals = listFirmwareInfo.length;
	var Merged = [];
	for (var i=0; i<nComponents; i++) {
		var row = [];
		for (var k=0; k<nIntervals; k++) {
			row.push(undefined);
		}
		Merged.push(row);
	}
	// console.log("Merged=", Merged);

	for (var k=0; k<nIntervals; k++) {
		var firmwareInfo = listFirmwareInfo[k];
		for (var i=0; i<nComponents; i++) {
			var component = listComponents[i];
			var data = getComponent(firmwareInfo, component);
			Merged[i][k] = data;
			if (data==undefined) {
				console.log("Merged", i,k,component);
			}
		}
	}

	return Merged;
}

function getComponentsAll(listFirmwareInfo) {
	var hash = {};
	for (var i=0; i<listFirmwareInfo.length; i++) {
		var firmwareInfo = listFirmwareInfo[i];
		// console.log("firmwareInfo=", firmwareInfo);
		for (var k=0; k<firmwareInfo.length; k++) {
			var component = firmwareInfo[k]["COMPONENT"];
			// console.log("component=", component);
			hash[component] = 1;
		}
	}
	// console.log("hash=", hash);
	var listComponents = [];
	for (var component in hash) {
		listComponents.push(component);
	}
	listComponents.sort();
	return listComponents;
}

function parseComponent(strComponent) {
	// console.log("strComponent=", strComponent);
	var s = strComponent.replace(/^\s*\[\s*/, "");
	s = s.replace(/\s*\]\s*$/, "");
	s = s.replace(/\s*=\s*/g, "=");
	// console.log("s=", s);

	// ETX_SerialNumber="LD MF"

	const regex = /(\S+)="([^"]+)"/g;
	const nFieldsMax = 100;

	var dataComponent = {};
	for (var i=0; i<nFieldsMax; i++) {
		var matches = regex.exec(s);
		if (matches != null) {
			var key = matches[1];
			var val = matches[2];
			dataComponent[key] = val;
		}
	}

	return dataComponent;
}

function parseFirmwareInfo(textFWinfos) {
	var s = textFWinfos.replace("<FW_VERSIONS>", "");
	s = s.replace("</FW_VERSIONS>", "");
	s = s.replace(/\s+$/, "");
	var tokens = s.split("\\n");
	// console.log(tokens[0]);

	var firmwareInfo = [];

	for (var i=0; i<tokens.length; i++) {
		if (tokens[i] != "") {
			// console.log("tokens", i, tokens[i]);
			var dataComponent = parseComponent(tokens[i]);
			firmwareInfo.push(dataComponent);
			// break;
		}
	}

	return firmwareInfo;
}

function makeListFirmwareInfo(fwIntervals) {
	var listFirmwareInfo = [];

	for (var i=0; i<fwIntervals.length; i++) {
		var textFWinfos = fwIntervals[i].data;
		var firmwareInfo = parseFirmwareInfo(textFWinfos);
		// console.log("firmwareInfo=", firmwareInfo);
		listFirmwareInfo.push(firmwareInfo);
	}
	// console.log("listFirmwareInfo=", listFirmwareInfo);

	return listFirmwareInfo;
}

function findIntervals(fwRecords) {
	var fwIntervals = [];

	if (fwRecords.length == 0) {
		return fwIntervals;
	}

	// first interval
	var record = fwRecords[0];
	var interval = {
		begin	: record.timestamp,
		end		: record.timestamp,
		data	: record.data
	};
	fwIntervals.push(interval);

	var indexIntervalCurrent = 0;

	if (fwRecords.length > 1) {
		for (var i=1; i<fwRecords.length; i++) {
			var record = fwRecords[i];
			// { timestamp: timestampFWinfos, data: textFWinfos };
			// console.log("record", i, record.timestamp, record.data.substr(0,80));
			var intervalCurrent = fwIntervals[indexIntervalCurrent];
			if (record.data == intervalCurrent.data) {
				// same data string -> update interval
				intervalCurrent.end = record.timestamp;
			}
			else {
				// new data string -> new interval
				var interval = {
					begin	: record.timestamp,
					end		: record.timestamp,
					data	: record.data
				};
				fwIntervals.push(interval);
				indexIntervalCurrent++;
			}
		}
	}

	return fwIntervals;
}


function parseSCF7(logEntry) {
	// console.log("eventText=", logEntry.event_text);
	var regex = /Version=([^;]+)/i;
	var matches = regex.exec(logEntry.event_text);
	var swVersion = "";
	if (matches !== null) {
		swVersion = matches[1];
	}
	var record = {
		datetime	: logEntry.datetime,
		swVersion	: swVersion
	};
	// console.log("record=", record);
	return record;
}

function parseSTA9(logEntry) {
	// console.log("eventText=", logEntry.event_text);
	var regex = /Start of Somaris\S+\s+(V\w\d\d\w)/i;
	var matches = regex.exec(logEntry.event_text);
	var swVersion = "";
	if (matches !== null) {
		swVersion = matches[1];
	}
	var record = {
		datetime	: logEntry.datetime,
		swVersion	: swVersion
	};
	// console.log("record=", record);
	return record;
}

function extractSoftwareVersion(listEventLogObjects) {
	var listSW = [];
	var nDays = listEventLogObjects.length;
	console.log("extractSoftwareVersion:", "nDays", nDays);
	for (var i=0; i<nDays; i++) {
		var logdata = listEventLogObjects[i].logdata;
		var nLogEntries = logdata.length;
		for (var k=0; k<nLogEntries; k++) {
			var logEntry = logdata[k];
			if (logEntry.event_source === "CT_SCF" && logEntry.event_id === 7) {
				var swVersion = parseSCF7(logEntry);
				// console.log("swVersion=", swVersion);
				listSW.push(swVersion);
			}
			if (logEntry.event_source === "CT_STA" && logEntry.event_id === 9) {
				var swVersion = parseSTA9(logEntry);
				// console.log("swVersion=", swVersion);
				listSW.push(swVersion);
			}
		}
	}
	return listSW;
}

function extractEventTextISV59(listEventLogObjects) {
	var listEvents = [];
	var nDays = listEventLogObjects.length;
	console.log("extractEventTextISV59:", "nDays", nDays);
	for (var i=0; i<nDays; i++) {
		var logdata = listEventLogObjects[i].logdata;
		var nLogEntries = logdata.length;
		// console.log("nDays, i, nLogEntries=", nDays, i, nLogEntries);
		for (var k=0; k<nLogEntries; k++) {
			var logEntry = logdata[k];
			if (logEntry.event_source === "CT_ISV" 
					&& logEntry.event_id === 59
					&& logEntry.event_text.substr(0,13) === "<FW_VERSIONS>")
			{
				var record = {
					datetime	: logEntry.datetime,
					event_text	: logEntry.event_text
				};
				listEvents.push(record);
			}
		}
	}
	return listEvents;
}

function parseISV59(recordISV59) {
	var nParts = tabISV59.specificationISV59.length;
	var infoISV59 = [];
	for (var i=0; i<nParts; i++) {
		var spec = tabISV59.specificationISV59[i];
		var infoSinglePart = parseSinglePartISV59(recordISV59, spec);
		// console.log("infoSinglePart=", infoSinglePart);
		infoISV59.push(infoSinglePart);
	}
	return infoISV59;
}

// Part	Part No.	Serial No.	Rev. No. 	HW_Version	FW_Version	SW_Version	Change Yes/No	First date
// UMAS	7740975	1834	6					
// Cooling	7740934		7		V1.08			
// ControlBox	7741049	6466		V005	VA00			
// UMAR	8096211	1756	7					

tabISV59.specificationISV59 = [
	{	name: "UMAS",	group: "MAS",		partnum: "UMAS_PartNumber",	
						serial: "UMAS_SerialNumber",	revision: "UMAS_Revision",
						versionHW: "",		versionFW: "",
						versionSW: ""	},
	{	name: "Cooling",	group: "MAS",	partnum: "Cooling_PartNumber",	
						serial: "",			revision: "",
						versionHW: "Cooling_HardwareVersion",
						versionFW: "Cooling_FirmwareVersion",
						versionSW: ""	},
	{	name: "ControlBox",	group: "GPC",	partnum: "ControlBox_Part_Number",	
						serial: "ControlBox_Serial_Number",	revision: "",
						versionHW: "ControlBox_Hardware_Version",
						versionFW: "ControlBox_Firmware_Version",
						versionSW: ""	},
	{	name: "UMAR",	group: "MAR",		partnum: "UMAR_PartNumber",	
						serial: "UMAR_SerialNumber",	revision: "UMAR_Revision",
						versionHW: "",
						versionFW: "",
						versionSW: ""	},
];

function parseSinglePartISV59(recordISV59, spec) {
	var eventText = recordISV59.event_text;

	// extract substring for a particular group "[COMPONENT=<group> ... ]"
	var idxStart = eventText.indexOf('[COMPONENT="' + spec.group);
	var idxEnd = eventText.indexOf("]", idxStart);
	var substring = eventText.substr(idxStart, idxEnd-idxStart+1);
	// console.log("substring=", substring);

	var infoSinglePart = {
		name		: spec.name,
		datetime	: recordISV59.datetime,
		partnum		: extractValueISV59(substring, spec.partnum),
		serial		: extractValueISV59(substring, spec.serial),
		revision	: extractValueISV59(substring, spec.revision),
		versionHW	: extractValueISV59(substring, spec.versionHW),
		versionFW	: extractValueISV59(substring, spec.versionFW),
		versionSW	: extractValueISV59(substring, spec.versionSW),
	};

	return infoSinglePart;
}

function extractValueISV59(eventText, keyword) {
	if (keyword === "") return "";
	var regex = new RegExp(keyword + '\s*=\s*"([^"]+)');
	var matches = regex.exec(eventText);
	var value = "";
	if (matches !== null) {
		value = matches[1];
	}
	return value;
}

function selectPartISV59(namePart, listInfosISV59) {
	var subset = [];
	for (var k=0; k<listInfosISV59.length; k++) {
		if (namePart === listInfosISV59[k].name) {
			subset.push(listInfosISV59[k]);
		}
	}

	// sort by datetime
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	subset.sort(sortFunc);

	return subset;
}

function isEqualISV59(a, b) {
	if (a.serial !== b.serial)			return false;
	if (a.revision !== b.revision)		return false;
	if (a.versionHW !== b.versionHW)	return false;
	if (a.versionFW !== b.versionFW)	return false;
	if (a.versionSW !== b.versionSW)	return false;
	return true;
}

function findChangesISV59(subset) {
	var statusPart = { changed: "no", timestamps: [] };
	var nRecords = subset.length;
	if (nRecords === 1) {
		statusPart.changed = "no";
	}
	else {
		for (var i=1; i<nRecords; i++) {
			if ( ! isEqualISV59(subset[i], subset[i-1]) ) {
				statusPart.changed = "yes";
				statusPart.timestamps.push(subset[i].datetime);
			}
		}
	}

	// case: original part was put back in
	if (statusPart.changed === "yes") {
		// compare first and last record
		if ( isEqualISV59(subset[0], subset[nRecords-1]) ) {
			// first and last record are identical
			statusPart.changed = "no (back to original)";
		}
		console.log("statusPart=", statusPart);
		console.log("subset=", subset);
	}

	return statusPart;
}

var columnDefISV59 = {
	name		: "Name",
	partnum		: "Part No.",
	serial		: "Serial No.",
	revision	: "Rev. No.",
	versionHW	: "HW Version",
	versionFW	: "FW Version",
	versionSW	: "SW Version",
	changed		: "Changed"
};

function showISV59______OLD(listInfosISV59) {
	// initialize table
	var table = document.createElement("table");
	table.id = "tableISV59";

	var header = document.createElement("thead");
	var tr = document.createElement("tr");
	for (var k in columnDefISV59) {
		var td = document.createElement("td");
		td.innerHTML = columnDefISV59[k];
		tr.appendChild(td);
	}
	header.appendChild(tr);
	table.appendChild(header);

	var tbody = document.createElement("tbody");

	var nParts = tabISV59.specificationISV59.length;
	for (var i=0; i<nParts; i++) {
		var namePart = tabISV59.specificationISV59[i].name;
		// select all info objects for this part
		var subset = selectPartISV59(namePart, listInfosISV59);

		var statusPart = findChangesISV59(subset);
		// if (i==1) statusPart.changed = "yes";

		// show last info object
		var lastRecord = subset[subset.length-1];

		var tr = document.createElement("tr");
		for (var k in columnDefISV59) {
			var td = document.createElement("td");
			if (k === "changed") {
				td.innerHTML = statusPart.changed;
				if (statusPart.changed === "no") {
					td.className = "";
				}
				else {
					td.className = "ISV59changedYes";
				}
			}
			else {
				td.innerHTML = lastRecord[k];
			}
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);

	// add table to <div>
	document.getElementById("divTableISV59").appendChild(table);
}

function clearTable(table) {
	while(table.hasChildNodes()) {
		table.removeChild(table.firstChild);
	}
}

function isSWversionChanged(listSWmatched, isComplete) {
	var n = listSWmatched.length;
	var isChanged = false;
	if (n > 1) {
		for (var i=1; i<n; i++) {
			if (listSWmatched[0] != listSWmatched[i]) {
				isChanged = true;
				break;
			}
		}
	}
	return isChanged;
}

function makeTableHeader(tableFirmware, TableFirmwareData, intervalsFirmware, isComplete, listSWmatched) {
	var switchShowAll = getCheckboxIgnoreIncomplete();
	var nIntervals = intervalsFirmware.length;
	// console.log("nIntervals=",nIntervals);

	// interval begin
	var row = tableFirmware.insertRow(0);
	insertCell(row, 0, "Time interval");
	insertCell(row, 1, "Begin");
	var idxColumn = 2;
	for (var k=0; k<nIntervals; k++) {
		// isComplete: elements 0-th and 1-st are for columns "Component" and "Parameter"
		if (switchShowAll || isComplete[k+2]) {
			var timestampString = (new Date(intervalsFirmware[k].begin)).toLocaleString();
			insertCell(row, idxColumn, timestampString);
			idxColumn++;
		}
	}
	// interval end
	row = tableFirmware.insertRow(1);
	insertCell(row, 0, "Time interval");
	insertCell(row, 1, "End");
	idxColumn = 2;
	for (var k=0; k<nIntervals; k++) {
		if (switchShowAll || isComplete[k+2]) {
			var timestampString = (new Date(intervalsFirmware[k].end)).toLocaleString();
			insertCell(row, idxColumn, timestampString);
			idxColumn++;
		}
	}
	// software version
	var row = tableFirmware.insertRow(2);
	insertCell(row, 0, "System");
	insertCell(row, 1, "Software version");
	var idxColumn = 2;
	for (var k=0; k<nIntervals; k++) {
		// isComplete: elements 0-th and 1-st are for columns "Component" and "Parameter"
		if (switchShowAll || isComplete[k+2]) {
			var swVersion = listSWmatched[k];
			if (swVersion == "") {
				swVersion = "SW version not found"
			}
			insertCell(row, idxColumn, swVersion);
			idxColumn++;
		}
	}
	if (isSWversionChanged(listSWmatched, isComplete)) {
		row.className = "highlighted";
	}

	var header = tableFirmware.createTHead();
	var row = header.insertRow(0);
	insertCell(row, 0, "Group");
	insertCell(row, 1, "Parameter");
	idxColumn = 2;
	for (var k=0; k<nIntervals; k++) {
		if (switchShowAll || isComplete[k+2]) {
			insertCell(row, idxColumn, "Value in time interval " + String(k+1));
			idxColumn++;
		}
	}
}

function insertCell(row, idx, htmlString) {
	var cell = row.insertCell(idx);
	cell.innerHTML = htmlString;
	cell.style.textAlign = "left";
}

function isValueChanged(rowData, isComplete) {
	var switchShowAll = getCheckboxIgnoreIncomplete();
	// skip first two columns (Component, Parameter)
	var valueFirst = rowData[2];
	var isChanged = false;
	if (rowData.length >= 3) {
		for (var k=3; k<rowData.length; k++) {
			if (rowData[k] != valueFirst) {
				if (switchShowAll || isComplete[k]) {
					isChanged = true;
					break;
				}
			}
		}
	}
	return isChanged;
}

function getCheckboxIgnoreIncomplete() {
	var switchShowAll = true;
	var chbox = document.getElementById("checkboxIgnoreIncomplete");
	if (chbox.checked) {
		switchShowAll = false;
	}
// switchShowAll = false; //////////////////////////
	return switchShowAll;
}

function makeRowFirmware(rowData, tableFirmware, idx, isComplete) {
	// console.log("idx=", idx);
	// console.log("rowData=", rowData);
	var switchShowAll = getCheckboxIgnoreIncomplete();
	var row = tableFirmware.insertRow(idx);
	var idxColumn = 0;
	for (var k=0; k<rowData.length; k++) {
		if (switchShowAll || isComplete[k]) {
			var value = rowData[k];
			insertCell(row, idxColumn, value);
			idxColumn++;
		}
	}
	if (isValueChanged(rowData, isComplete)) {
		row.className = "highlighted";
		// console.log("rowData=", rowData);
		// console.log("row=", row.style);
	}
	idx++;
	return idx;
}

function findIncompleteRecords(TableFirmwareData) {
	var nIntervals = TableFirmwareData[0].length;
	var countEntries = [];
	for (var k=0; k<nIntervals; k++) {
		countEntries.push(0);
	}

	for (var i=0; i<TableFirmwareData.length; i++) {
		var rowData = TableFirmwareData[i];
		for (var k=0; k<nIntervals; k++) {
			if (rowData[k] != "") {
				countEntries[k]++;
			}
		}
	}
	// console.log("countEntries=", countEntries);

	var isComplete = [];
	for (var k=0; k<nIntervals; k++) {
		if (countEntries[k] > tabISV59.countEntriesMin) {
			isComplete.push(true);
		}
		else {
			isComplete.push(false);
		}
	}
	return isComplete;
}

function showISV59(fwInfoStruct) {
	if (fwInfoStruct === undefined) {
		var tableFirmware = document.getElementById("tableFirmwareInfos");
		clearTable(tableFirmware);
		var row = tableFirmware.insertRow(0);
		insertCell(row, 0, "No firmware infos found.");
		return;
	}

	var TableFirmwareData = fwInfoStruct.data;
	var intervalsFirmware = fwInfoStruct.intervals;
	var listSWmatched = fwInfoStruct.listSWmatched;

	var isComplete = findIncompleteRecords(TableFirmwareData);
	// console.log("isComplete=", isComplete);

	var tableFirmware = document.getElementById("tableFirmwareInfos");
	clearTable(tableFirmware);

	var idx = 0;
	for (var i=0; i<TableFirmwareData.length; i++) {
		var rowData = TableFirmwareData[i];
		idx = makeRowFirmware(rowData, tableFirmware, idx, isComplete);
	}

	// create table header after table body
	// https://stackoverflow.com/questions/6481948/how-do-i-create-the-tbody-tag-in-a-table-with-pure-javascript
	makeTableHeader(tableFirmware, TableFirmwareData, intervalsFirmware, isComplete, listSWmatched);
}

function callbackCheckboxIgnoreIncomplete(evt) {
	if (tabISV59.infos === undefined) {
		return;
	}
	if (tabISV59.infos.data != undefined) {
		showISV59(tabISV59.infos);
	}
}

tabISV59.setCallbacks = function() {
	var chbox = document.getElementById("checkboxIgnoreIncomplete");
	chbox.onchange = callbackCheckboxIgnoreIncomplete;
}

