
function SlimLineDMSTempParser() {
	// plot: 1=line, 2=indicator, 0=none
	this.columnDef = [
		/* 0 */	{ id: 'datetime',		plot: 0, min: 0, max: 0 },
		/* 1 */	{ id: 'DMS_Temp1_degC',	plot: 1, min: 0, max: 80 },
		/* 2 */	{ id: 'DMS_Temp2_degC',	plot: 1, min: 0, max: 80 },
		/* 3 */	{ id: 'DMS_Temp3_degC',	plot: 1, min: 0, max: 80 }
	];

	this.delim = "\t";
	this.indexTimestamp = 0;

	this.numCols = this.columnDef.length;
}

/*
result = {
	metadata: {
		filename	: #,
		serial		: #
	},
	logdata: [
		{ datetime: #, DMS_Temp1_degC: #, DMS_Temp2_degC: #, DMS_Temp3_degC: # },
		{ datetime: #, DMS_Temp1_degC: #, DMS_Temp2_degC: #, DMS_Temp3_degC: # },
		...
		{ datetime: #, DMS_Temp1_degC: #, DMS_Temp2_degC: #, DMS_Temp3_degC: # }
	]
}
*/
SlimLineDMSTempParser.prototype.parse = function(fileAsString, filename) {
	var logdata = this.readLogdata(fileAsString);
	this.sortLogdata(logdata);

	var metadata = this.readMetadata(filename, logdata);

	//countScansPerDay(fullData);

	var result = {
		metadata : metadata,
		logdata  : logdata
	};

	return result;
}

SlimLineDMSTempParser.prototype.readMetadata = function(filename, logdata) {
	var ret = filename.match(/^CT(\d+)/);
	var serial = 'unknown';
	if (ret != null) {
		serial = ret[1];
	}

	var metadata = {
		filename	: filename,
		serial		: serial,
		dateStart	: logdata[0].datetime,
		dateEnd		: logdata[logdata.length-1].datetime,
		numMeas		: logdata.length
	};

	return metadata;
}

SlimLineDMSTempParser.prototype.parseTimestamp = function(s) {
	// 16.02.2016 19:53:41.093
	// 01234567890123456789012
	var yy = s.substr(6,4);
	var mm = s.substr(3,2);
	var dd = s.substr(0,2);
	var time = s.substr(11,12);
	var ts = yy + '-' + mm + '-' + dd + 'T' + time;
	var date = new Date(ts);
	if (date.toString() === 'Invalid Date') {
		throw 'SlimLineDMSTempParser: Timestamp has unknown format.';
	}

	return date;
}

SlimLineDMSTempParser.prototype.parseDataLine = function(strInput) {
	var tokens = strInput.split(this.delim);
	if (tokens.length != this.numCols) {
		throw 'SlimLineDMSTempParser: Input file must have ' + this.numCols + ' columns.';
	}

	var record = {};
	for (k=0; k<this.numCols; k++) {
		var colname = this.columnDef[k].id;
		if (k == this.indexTimestamp) {
			// read timestamp
			record[colname] = this.parseTimestamp(tokens[k]);
		}
		else {
			if (this.columnDef[k].plot==1) {
				// convert to number
				record[colname] = Number(tokens[k]);
			}
			else {
				// keep as string
				record[colname] = tokens[k];
			}
		}
	}
	return record;
}

SlimLineDMSTempParser.prototype.readLogdata = function(fileAsString) {

	var self = this;

	// read entire file as string
	var n = fileAsString.length;

	var datalines = fileAsString.split("\n");
	var nLines = datalines.length;

	// no header in SlimLine temperature files
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

SlimLineDMSTempParser.prototype.sortLogdata = function(logdata) {
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	logdata.sort(sortFunc);
}

