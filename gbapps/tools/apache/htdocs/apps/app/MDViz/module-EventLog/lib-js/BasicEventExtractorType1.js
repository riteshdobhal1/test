
'use strict';

(function () {

/*
Extractor for basic events
Type 1 = Definition, Force
*/
function BasicEventExtractorType1() {
}

const TIMESTAMP_FIELD_NAME = "datetime";

BasicEventExtractorType1.prototype.extractBasicEvents = function(listRecords) {
	var basicEvents = {};
	var lastScanKind = undefined;
	for (var i=0; i<listRecords.length; i++) {
		var record = listRecords[i];
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
	}

	return basicEvents;
}

window.BasicEventExtractorType1 = BasicEventExtractorType1;

}())
