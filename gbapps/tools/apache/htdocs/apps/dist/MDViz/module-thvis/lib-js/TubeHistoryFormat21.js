/*
plot: 1=line, 2=indicator, 0=none
*/

function loadTubeHistoryFormat21() {
	var thFormat = {};
	thFormat.numCols = 21;
	thFormat.delim = " ";
	thFormat.indexSystemSerial = -1;
	thFormat.indexTubeSerial = -1;
	thFormat.indexScanMode = 1;
	thFormat.indexTimestamp = 20;
	thFormat.indexAbort = 'cancel_reason';
	thFormat.columnDef = [];
	thFormat.columnDef[0] = { id: 'scan_count', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[1] = { id: 'kind', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[2] = { id: 'temp_Kelvin', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[3] = { id: 'rot_time', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[4] = { id: 'scan_time_nom', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[5] = { id: 'scan_time_act', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[6] = { id: 'voltage_nom', plot: 1, min: 70, max: 150 };
	thFormat.columnDef[7] = { id: 'voltage_act', plot: 1, min: 70, max: 150 };
	thFormat.columnDef[8] = { id: 'current_nom', plot: 1, min: 0, max: 700 };
	thFormat.columnDef[9] = { id: 'current_act', plot: 1, min: 0, max: 700 };
	thFormat.columnDef[10] = { id: 'dose_reduc_%', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[11] = { id: 'focus', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[12] = { id: 'freq', plot: 1, min: 115, max: 145 };
	thFormat.columnDef[13] = { id: 'filament_nom', plot: 1, min: 5000, max: 7500 };
	thFormat.columnDef[14] = { id: 'filament_act', plot: 1, min: 5000, max: 7500 };
	thFormat.columnDef[15] = { id: 'dose_nom', plot: 1, min: 0, max: 6000 };
	thFormat.columnDef[16] = { id: 'dose_act', plot: 1, min: 0, max: 6000 };
	thFormat.columnDef[17] = { id: 'oil_temp_degC', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[18] = { id: 'arcs', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[19] = { id: 'cancel_reason', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[20] = { id: 'datetime', plot: 0, min: 0, max: 0 };

	thFormat.parseTimestamp = function(s) {
		// 08-Feb-2016 08:06:03
		return new Date(s.replace('-', ' '));
	}

	thFormat.parseDataLine = function(strInput) {
		var delim = ' ';
		var s = strInput.replace(/ +/g, delim);
		s = s.replace(/^ +/, '');
		var tokens = s.split(delim);
		var record = {};
		for (k=0; k<this.numCols; k++) {
			var colname = this.columnDef[k].id;
			if (k == this.indexTimestamp) {
				// read timestamp
				var strTimestamp = tokens[k].replace(/-/g, ' ') + ' ' + tokens[k+1];
				//record[colname] = this.parseTimestamp(strTimestamp);
				record[colname] = new Date(strTimestamp);
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

	thFormat.readMetadata = function(datalines) {
		var keysUndefined = [
			'tubeSystem',
			'thVersion',
			'swVersionPrev',
			'instSWprev',
			'instSW',
			'tubeRevision'
		];
		var keys = [
			'swVersion',
			'customer',
			'installed',
			'deinstalled',
			'serial',
			'tubeSerial',
			'tubeType',
			'numScans',
			'tubeKWs',
			'scanSecs',
			'systemSecs'
		];

		var metadata = {};

		for (var k=0; k<keys.length; k++) {
			//var tokens = datalines[k].split(':');
			//var value = tokens[1].replace(/^\s+/, '');
			var tokens = datalines[k].split(/:\s+/);
			var value = tokens[1];
			metadata[keys[k]] = value;
		};
		for (var k=0; k<keysUndefined.length; k++) {
			metadata[keysUndefined[k]] = 'n.a.';
		};

		// keep date only
		metadata.installed = metadata.installed.split(' ').shift();
		metadata.deinstalled = metadata.deinstalled.split(' ').shift();

		//metadata.scanSecs = Number(metadata.scanSecs);

		return metadata;
	}

	return thFormat;
}
