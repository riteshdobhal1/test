
function tabISV59() {
}

tabISV59.isInitialized = false;

tabISV59.infos = [];

tabISV59.initialize = function() {
	console.log("tabISV59.initialize start");
	if (listEventLogObjects.length === 0) return;
	if (!tabLoad.isReadingAllDone) return;
	if (tabISV59.isInitialized) return;

	tabISV59.infos = getInfosISV59(listEventLogObjects);
	// console.log("tabISV59.infos=", tabISV59.infos);

	showISV59(tabISV59.infos);

	tabISV59.isInitialized = true;
}

tabISV59.reset = function() {
	tabISV59.isInitialized = false;
	tabISV59.isReadingAllDone = false;

	// delete table
	var el = document.getElementById("divTableISV59");
	el.removeChild(el.lastChild);
}


function getInfosISV59(listEventLogObjects) {
	console.log("getInfosISV59 start");
	var listEventsISV59 = extractEventTextISV59(listEventLogObjects);
	// console.log("listEventsISV59=", listEventsISV59);
	var listInfosISV59 = [];
	if (listEventsISV59.length > 0) {
		for (var i=0; i<listEventsISV59.length; i++) {
			var infoISV59 = parseISV59(listEventsISV59[i]);
			if (infoISV59 !== null) {
				// append infos to the array listInfosISV59
				for (var k=0; k<infoISV59.length; k++) {
					listInfosISV59.push(infoISV59[k]);
				}
			}
		}
	}
	return listInfosISV59;
}

function extractEventTextISV59(listEventLogObjects) {
	var listEvents = [];
	var nDays = listEventLogObjects.length;
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

function showISV59(listInfosISV59) {
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

