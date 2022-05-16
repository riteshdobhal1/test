
function SensationDmsTempParser() {
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
	this.numCols = 5;

	this.switchFahrenheit = false;

	if (!this.switchFahrenheit) {
		this.columnDef = this.columnDef.slice(0,5);
	}
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
SensationDmsTempParser.prototype.parse = function(fileAsString, filename) {
	var logdata = this.readLogdata(fileAsString);
	this.sortLogdata(logdata);

	var metadata = this.readMetadata(filename, logdata);

	var result = {
		metadata : metadata,
		logdata  : logdata
	};

	// console.log("SensationDmsTempParser: logdata=", logdata)

	return result;
}

SensationDmsTempParser.prototype.readMetadata = function(filename, logdata) {
	var ret = filename.match(/^CT(\d+)/);
	var serial = 'unknown';
	if (ret != null) {
		serial = ret[1];
	}

	var metadata = {
		filename	: filename,
		serial		: serial,
		dateStart	: logdata[0].datetime.toLocaleDateString(),
		dateEnd		: logdata[logdata.length-1].datetime.toLocaleDateString(),
		numMeas		: logdata.length
	};

	return metadata;
}

SensationDmsTempParser.prototype.parseTimestamp = function(s) {
	// 16.02.2016 19:53:41.093
	// 01234567890123456789012
	var yy = s.substr(6,4);
	var mm = s.substr(3,2);
	var dd = s.substr(0,2);
	var time = s.substr(11,12);
	var ts = yy + '-' + mm + '-' + dd + 'T' + time;
	var date = new Date(ts);
	if (date.toString() === 'Invalid Date') {
		throw 'SensationDmsTempParser: Timestamp has unknown format.';
	}

	return date;
}

SensationDmsTempParser.prototype.parseDataLine = function(strInput) {
	var tokens = strInput.split(this.delim);
	if (tokens.length != this.numCols) {
		throw 'SensationDmsTempParser: Input file must have ' + this.numCols + ' columns.';
	}

	var record = {
		datetime		: this.parseTimestamp(tokens[0]),
		DMS_Temp_1_degC	: Number(tokens[1]) * 0.25,
		DMS_Temp_2_degC	: Number(tokens[2]) * 0.25,
		DMS_Temp_3_degC	: Number(tokens[3]) * 0.25,
		DMS_Temp_4_degC	: Number(tokens[4]) * 0.25,
	};

	if (this.switchFahrenheit) {
		record['DMS_Temp_1_degF'] = record['DMS_Temp_1_degC'] * 1.8 + 32;
		record['DMS_Temp_2_degF'] = record['DMS_Temp_2_degC'] * 1.8 + 32;
		record['DMS_Temp_3_degF'] = record['DMS_Temp_3_degC'] * 1.8 + 32;
		record['DMS_Temp_4_degF'] = record['DMS_Temp_4_degC'] * 1.8 + 32;
	}

	return record;
}

SensationDmsTempParser.prototype.parseDataLine_XX = function(strInput) {
	var tokens = strInput.split(this.delim);
	if (tokens.length != this.numCols) {
		throw 'SensationDmsTempParser: Input file must have ' + this.numCols + ' columns.';
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
				// convert to number and to degrees Celsius
				record[colname] = Number(tokens[k]) * 0.25;
			}
			else {
				// keep as string
				record[colname] = tokens[k];
			}
		}
	}
	return record;
}

SensationDmsTempParser.prototype.readLogdata = function(fileAsString) {

	var self = this;

	// read entire file as string
	var n = fileAsString.length;

	var datalines = fileAsString.split("\n");
	var nLines = datalines.length;

	// no header in Sensation DmsTemp files
	var iFirst = 0;

	var logdata = [];

	// read each line
	for (var i=iFirst; i<nLines; i++) {
		if (datalines[i].length > 0) {
			var record = self.parseDataLine(datalines[i]);
			logdata.push(record);
		}
	}

	// console.log("346456456", self.parseDataLine(datalines[iFirst]))
	// console.log("346456456", self.parseTimestamp("26.02.2016 09:44:47.953").getMilliseconds())

	return logdata;
}

SensationDmsTempParser.prototype.sortLogdata = function(logdata) {
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	logdata.sort(sortFunc);
}

