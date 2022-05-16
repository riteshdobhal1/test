
function SimpleEventLogParser() {
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
result = {
	metadata: {
		filename	: #,
		serial		: #
	},
	logdata: [
		{ datetime: #, DMS_Temp_1_degC: #, DMS_Temp_2_degC: #, ... },
		{ datetime: #, DMS_Temp_1_degC: #, DMS_Temp_2_degC: #, ... },
		...
		{ datetime: #, DMS_Temp_1_degC: #, DMS_Temp_2_degC: #, ... },
	]
}
*/
SimpleEventLogParser.prototype.parse = function(fileAsString) {
	var ret = this.readLogdata(fileAsString);
	var logdata = ret.logdata;

	//this.sortLogdata(logdata);
	logdata.reverse();		// assume that lines are sorted newest first

	var metadata = this.readMetadata(logdata);

	var result = {
		metadata : metadata,
		logdata  : logdata,
		// hexdata  : ret.hexdata.reverse(),
		// prfdata  : ret.prfdata.reverse()
		hexdata  : [],
		prfdata  : []
	};

	return result;
}

SimpleEventLogParser.prototype.parseMetadataString = function(eventText) {
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

SimpleEventLogParser.prototype.readMetadata = function(logdata) {
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

SimpleEventLogParser.prototype.parseTimestamp_XX = function(sDate, sTime) {
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
		throw 'SimpleEventLogParser: Timestamp has unknown format.';
	}

	return date;
}

SimpleEventLogParser.prototype.parseTimestamp = function(sDate, sTime) {
	// 2015-12-25
	// 00:01:01
	var date = new Date(sDate + 'T' + sTime);
	if (date.toString() === 'Invalid Date') {
		throw 'SimpleEventLogParser: Timestamp has unknown format.';
	}
	return date;
}

SimpleEventLogParser.prototype.parseDataLine = function(strInput) {
	var tokens = strInput.split(this.delim);
	if (tokens.length != this.numCols) {
		throw 'SimpleEventLogParser: Input file must have ' + this.numCols + ' columns.';
	}

	var record = {
		datetime		: this.parseTimestamp(tokens[1], tokens[2]),
		severity		: tokens[0],
		// date			: tokens[1],
		// time			: tokens[2],
		event_source	: tokens[3],
		event_id		: Number(tokens[4]),
		event_text		: tokens[5],
	};

	return record;
}

SimpleEventLogParser.prototype.readLogdata = function(fileAsString) {

	var self = this;

	// read entire file as string
	var n = fileAsString.length;

	var datalines = fileAsString.split("\n");
	var nLines = datalines.length;

	// no header in event log files
	var iFirst = 0;

	var logdata = [];
	var hexdata = [];
	var prfdata = [];
	var regexHex = /^\s*\(E /;

	// read each line
	for (var i=iFirst; i<nLines; i++) {
		if (datalines[i].length > 0) {
			var record = self.parseDataLine(datalines[i]);
			var isRelevant = false;
			if (record.event_source === 'CT_ISV' && record.event_id == 59) {
				isRelevant = true;
			}
			if (record.event_source === 'CT_SCF' && record.event_id == 7) {
				isRelevant = true;
			}
			if (record.event_source === 'CT_STA' && record.event_id == 9) {
				isRelevant = true;
			}
			if (isRelevant) {
				logdata.push(record);
			}
		}
	}

	var ret = {
		logdata: logdata,
		hexdata: hexdata,
		prfdata: prfdata
	};

	return ret;
}

SimpleEventLogParser.prototype.sortLogdata = function(logdata) {
	// console.log('sortLogdata start');
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	logdata.sort(sortFunc);
	// console.log(logdata[0].datetime.toLocaleString());
	// console.log(logdata[1].datetime.toLocaleString());
}

