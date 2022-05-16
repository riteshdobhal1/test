
function GoEMBLogParser() {
	// plot: 1=line, 2=indicator, 0=none
	this.columnDef = [
		/* 0 */	{ id: 'datetime',			plot: 0, min: 0, max: 0 },
		/* 1 */	{ id: 'DMS_Temp_1_degC',	plot: 1, min: 10, max: 60 },
		/* 2 */	{ id: 'DMS_Temp_2_degC',	plot: 1, min: 10, max: 60 },
		/* 3 */	{ id: 'DMS_Temp_3_degC',	plot: 1, min: 10, max: 60 },
		/* 4 */	{ id: 'DMS_Temp_4_degC',	plot: 1, min: 10, max: 60 },
		/* 5 */	{ id: 'DMS_Temp_1_degF',	plot: 1, min: 50, max: 140 },
		/* 6 */	{ id: 'DMS_Temp_2_degF',	plot: 1, min: 50, max: 140 },
		/* 7 */	{ id: 'DMS_Temp_3_degF',	plot: 1, min: 50, max: 140 },
		/* 8 */	{ id: 'DMS_Temp_4_degF',	plot: 1, min: 50, max: 140 },
	];

	this.delim = "\t";
	this.indexTimestamp = 0;

	//this.numCols = this.columnDef.length;
	this.numCols = 6;
}

/*
logdata = [
	{ datetime: #, T: #, H: # },
	{ datetime: #, T: #, H: # },
	...
	{ datetime: #, T: #, H: # }
]
*/
GoEMBLogParser.prototype.parse = function(fileAsString) {
	// read all records
	var logdataRaw = this.readLogdata(fileAsString);
	// console.log("logdataRaw=", logdataRaw[0]);

	// merge records with identical timestamp
	var logdata = this.mergeTimestamps(logdataRaw);
	// console.log("logdata=", logdata[0]);

	// sort chronologically
	this.sortLogdata(logdata);

	var ret = { logdata: logdata };

	return ret;
}

GoEMBLogParser.prototype.parseMetadataString = function(eventText) {
	var s = eventText.replace(/Current system configuration:\s*/, '');
	var tokens = s.split(/;\s*/);
	var metadata = {};
	for (var i=0; i<tokens.length; i++) {
		if (tokens[i].length > 0) {
			if (tokens[i].indexOf('=') >= 0) {
				var keyValue = tokens[i].split('=');
				var key = keyValue[0];
				var value = keyValue[1];
				metadata[key] = value;
			}
		}
	}
	return metadata;
}

GoEMBLogParser.prototype.readMetadata = function(logdata) {
	var metadata = undefined;

	for (var k=0; k<logdata.length; k++) {
		var record = logdata[k];
		if (record.event_source==='CT_SCF' && record.event_id===7) {
			metadata = this.parseMetadataString(record.event_text);
			break;
		}
	}

	return metadata;
}

GoEMBLogParser.prototype.parseTimestamp_XX = function(sDate, sTime) {
	// 2015-12-25
	// 01234567890123456789012
	// 00:01:01
	// 01234567890123456789012
	var yy = Number(sDate.substr(0,4));
	var mm = Number(sDate.substr(5,2))-1;
	var dd = Number(sDate.substr(8,2));
	var HH = Number(sTime.substr(0,2));
	var MM = Number(sTime.substr(3,2));
	var SS = Number(sTime.substr(6,2));
	var MS = 0;

	var date = new Date(yy,mm,dd,HH,MM,SS,MS);
	if (date.toString() === 'Invalid Date') {
		throw 'GoEMBLogParser: Timestamp has unknown format.';
	}

	return date;
}

GoEMBLogParser.prototype.parseTimestamp = function(sDate, sTime) {
	// 2015-12-25
	// 00:01:01
	var date = new Date(sDate + 'T' + sTime);
	if (date.toString() === 'Invalid Date') {
		throw 'GoEMBLogParser: Timestamp has unknown format.';
	}
	return date;
}

GoEMBLogParser.prototype.parseDataLine = function(strInput) {
	// length of timestamp token
	const nts = 19;

	var n = strInput.length;

	if (n < nts) {
		return undefined;
	}

	// 2019-02-05 12:31:22 T:23 H:36%  
	var timestampStr = strInput.substr(0, nts);
	var valuesStr = strInput.substr(nts+1, n-nts-1);

	// console.log("timestampStr=>>" + timestampStr + "<<");

	var record = {
		// datetime		: this.parseTimestamp(tokens[1], tokens[2]),
		datetime : new Date(timestampStr)
	};
	// console.log(record.datetime);

	// remove spaces after colon
	valuesStr = valuesStr.replace(/:\s+/g, ":");

	// console.log("valuesStr=>>" + valuesStr + "<<");

	var delimValueTokens = " ";
	var values = valuesStr.split(delimValueTokens);
	// console.log("values=", values);

	var delimKeyValue = ":";
	for (var i=0; i<values.length; i++) {
		if (values[i].length > 0) {
			var pair = values[i].split(delimKeyValue);
			var key = pair[0];
			var value = pair[1];
			if (key == "H") {
				value = value.replace("%", "");
			}
			// console.log(key, value);
			record[key] = Number(value);
		}
	}
	// console.log("record=", record);

	return record;
}

GoEMBLogParser.prototype.readLogdata = function(fileAsString) {
	// console.log("readLogdata begin");

	var self = this;

	// read entire file as string
	var n = fileAsString.length;

	var datalines = fileAsString.split("\n");
	var nLines = datalines.length;

	// no header in EMB log files
	var iFirst = 0;

	var logdata = [];

	// read each line
	for (var i=iFirst; i<nLines; i++) {
		if (datalines[i].length > 0) {
			var record = self.parseDataLine(datalines[i]);
			logdata.push(record);
		}
	}

	return logdata;
}

GoEMBLogParser.prototype.sortLogdata = function(logdata) {
	// console.log('sortLogdata start');
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	logdata.sort(sortFunc);
	// console.log(logdata[0].datetime.toLocaleString());
	// console.log(logdata[1].datetime.toLocaleString());
}

GoEMBLogParser.prototype.mergeTimestamps = function(logdata) {
	var merged = {};
	for (var i=0; i<logdata.length; i++) {
		merged[logdata[i].datetime] = {};
	}
	// console.log("merged=", merged);

	for (var i=0; i<logdata.length; i++) {
		var record = logdata[i];
		for (var key in record) {
			if (key !== "datetime") {
				merged[record.datetime][key] = record[key];
			}
		}
	}
	// console.log("merged=", merged);

	var logdataMerged = [];
	for (var ts in merged) {
		var record = merged[ts];
		var recordMerged = { datetime: new Date(ts) };
		for (var key in record) {
			recordMerged[key] = record[key];
		}
		logdataMerged.push(recordMerged);
	}

	return logdataMerged;
}

