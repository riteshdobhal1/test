/*
plot: 1=line, 2=indicator, 0=none
*/

function loadTubeHistoryFormat43() {
	var thFormat = {};
	thFormat.numCols = 43;
	thFormat.delim = "\t";
	thFormat.indexSystemSerial = 41;
	thFormat.indexTubeSerial = 42;
	thFormat.indexScanMode = 1;
	thFormat.indexTimestamp = 2;
	thFormat.indexAbort = 'reason';
	thFormat.columnDef = [];
	thFormat.columnDef[0] = { id: 'Scan_count', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[1] = { id: 'kind', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[2] = { id: 'datetime', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[3] = { id: 'rot_time', plot: 1, min: 0, max: 1.5 };
	thFormat.columnDef[4] = { id: 'nom_scan_time', plot: 1, min: 0, max: 70 };
	thFormat.columnDef[5] = { id: 'act_scan_time', plot: 1, min: 0, max: 70 };
	thFormat.columnDef[6] = { id: 'nom_voltage', plot: 1, min: 0, max: 150 };
	thFormat.columnDef[7] = { id: 'act_voltage', plot: 1, min: 0, max: 150 };
	thFormat.columnDef[8] = { id: 'nom_current', plot: 1, min: 0, max: 1000 };
	thFormat.columnDef[9] = { id: 'min_current', plot: 1, min: 0, max: 1000 };
	thFormat.columnDef[10] = { id: 'max_current', plot: 1, min: 0, max: 1000 };
	thFormat.columnDef[11] = { id: 'mean_current', plot: 1, min: 0, max: 1000 };
	thFormat.columnDef[12] = { id: 'begin_current', plot: 1, min: 0, max: 1000 };
	thFormat.columnDef[13] = { id: 'end_current', plot: 1, min: 0, max: 1000 };
	thFormat.columnDef[14] = { id: 'focus', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[15] = { id: 'frequency', plot: 1, min: 120, max: 160 };
	thFormat.columnDef[16] = { id: 'nom_fil_curr', plot: 1, min: 0, max: 1600 };
	thFormat.columnDef[17] = { id: 'act_fil_curr_begin', plot: 1, min: 0, max: 1600 };
	thFormat.columnDef[18] = { id: 'act_fil_curr_end', plot: 1, min: 0, max: 1600 };
	thFormat.columnDef[19] = { id: 'nom_dose', plot: 1, min: 0, max: 50000 };
	thFormat.columnDef[20] = { id: 'min_dose', plot: 1, min: 0, max: 50000 };
	thFormat.columnDef[21] = { id: 'max_dose', plot: 1, min: 0, max: 50000 };
	thFormat.columnDef[22] = { id: 'end_dose', plot: 1, min: 0, max: 50000 };
	thFormat.columnDef[23] = { id: 'oil_temp_begin', plot: 1, min: 15, max: 120 };
	thFormat.columnDef[24] = { id: 'oil_temp_end', plot: 1, min: 15, max: 120 };
	thFormat.columnDef[25] = { id: 'calc_temp_anode', plot: 1, min: 20, max: 500 };
	thFormat.columnDef[26] = { id: 'calc_temp_anode_cooling_interface', plot: 1, min: 20, max: 300 };
	thFormat.columnDef[27] = { id: 'oil_pressure', plot: 1, min: 1300, max: 3000 };
	thFormat.columnDef[28] = { id: 'gantry_temp', plot: 1, min: 10, max: 40 };
	thFormat.columnDef[29] = { id: 'calc_temp_oil', plot: 1, min: 15, max: 120 };
	thFormat.columnDef[30] = { id: 'motor_temp', plot: 1, min: 15, max: 120 };
	thFormat.columnDef[31] = { id: 'nom_current_wo_sigma_corr', plot: 1, min: 0, max: 1000 };
	thFormat.columnDef[32] = { id: 'motor_curr', plot: 1, min: 0, max: 30000 };
	thFormat.columnDef[33] = { id: 'arcings_one', plot: 1, min: 0, max: NaN };
	thFormat.columnDef[34] = { id: 'xc_drops', plot: 1, min: 0, max: NaN };
	thFormat.columnDef[35] = { id: 'arcings_both', plot: 1, min: 0, max: NaN };
	thFormat.columnDef[36] = { id: 'region', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[37] = { id: 'DOM_type', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[38] = { id: 'mode', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[39] = { id: 'reason', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[40] = { id: 'TimeDiffToUTC_Time', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[41] = { id: 'system_ser_no', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[42] = { id: 'tube_ser_no', plot: 0, min: 0, max: 0 };

	thFormat.parseTimestamp = function(s) {
		// 2016-01-17 12:20:46.943991
		// 01234567890123456789012345
		var yy = Number(s.substr(0,4));
		var mm = Number(s.substr(5,2))-1;	// months start with 0
		var dd = Number(s.substr(8,2));
		var HH = Number(s.substr(11,2));
		var MM = Number(s.substr(14,2));
		var SS = Number(s.substr(17,9));
		return new Date(yy,mm,dd,HH,MM,SS);
	}

	thFormat.parseDataLine = function(strInput) {
		//document.getElementById('divDebugInfo').innerHTML = 'f43: parseDataLine start';
		var delim = "\t";
		var tokens = strInput.split(delim);
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

	thFormat.readMetadata = function(datalines) {
		//document.getElementById('divDebugInfo').innerHTML = 'f43: readMetadata start';
		var keysUndefined = [
			'thVersion',
			'swVersionPrev',
			'instSWprev',
			'instSW',
			'tubeRevision'
		];
		var keys = [
			'swVersion',
			'tubeSystem',
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
