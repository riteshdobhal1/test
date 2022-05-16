/*
plot: 1=line, 2=indicator, 0=none
*/

function loadTubeHistoryFormat32() {
	var thFormat = {};
	thFormat.numCols = 32;
	thFormat.delim = " ";
	thFormat.indexSystemSerial = -1;
	thFormat.indexTubeSerial = -1;
	thFormat.indexScanMode = 1;
	thFormat.indexTimestamp = 31;
	thFormat.indexAbort = 'cancel_reason';
	thFormat.columnDef = [];
	thFormat.columnDef[0] = { id: 'scan_count', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[1] = { id: 'kind', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[2] = { id: 'temp_Kelvin', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[3] = { id: 'rot_time_sec', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[4] = { id: 'scan_time_nom_sec', plot: 1, min: 0, max: 90 };
	thFormat.columnDef[5] = { id: 'scan_time_act_sec', plot: 1, min: 0, max: 90 };
	thFormat.columnDef[6] = { id: 'voltage_nom_kV', plot: 1, min: 70, max: 140 };
	thFormat.columnDef[7] = { id: 'voltage_act_kV', plot: 1, min: 70, max: 140 };
	thFormat.columnDef[8] = { id: 'UDC_Volt', plot: 1, min: 400, max: 600 };
	thFormat.columnDef[9]  = { id: 'current_nom_mA', plot: 1, min: 0, max: 400 };
	thFormat.columnDef[10] = { id: 'current_act_mA', plot: 1, min: 0, max: 400 };
	thFormat.columnDef[11] = { id: 'current_min_mA', plot: 1, min: 0, max: 400 };
	thFormat.columnDef[12] = { id: 'current_max_mA', plot: 1, min: 0, max: 400 };
	thFormat.columnDef[13] = { id: 'dose_reduc_percent', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[14] = { id: 'focus', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[15] = { id: 'anode_freq_Hz', plot: 1, min: 150, max: 190 };
	thFormat.columnDef[16] = { id: 'anode_act_Hz',  plot: 1, min: 150, max: 190 };
	thFormat.columnDef[17] = { id: 'anode_current_mA', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[18] = { id: 'filament_nom_mA',		plot: 1, min: 5000, max: 7500 };
	thFormat.columnDef[19] = { id: 'filament_begin_mA',	plot: 1, min: 5000, max: 7500 };
	thFormat.columnDef[20] = { id: 'filament_end_mA',		plot: 1, min: 5000, max: 7500 };
	thFormat.columnDef[21] = { id: 'dose_nom_mV', plot: 1, min: 0, max: 9000 };
	thFormat.columnDef[22] = { id: 'dose_act_mV', plot: 1, min: 0, max: 9000 };
	thFormat.columnDef[23] = { id: 'oil_temp_degC', plot: 1, min: 25, max: 100 };
	thFormat.columnDef[24] = { id: 'anode_amp_factor', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[25] = { id: 'arcings_both', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[26] = { id: 'arcings_one', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[27] = { id: 'HV_drops', plot: 1, min: NaN, max: NaN };
	thFormat.columnDef[28] = { id: 'within_eMode_range', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[29] = { id: 'service_scan', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[30] = { id: 'cancel_reason', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[31] = { id: 'datetime', plot: 0, min: 0, max: 0 };

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
