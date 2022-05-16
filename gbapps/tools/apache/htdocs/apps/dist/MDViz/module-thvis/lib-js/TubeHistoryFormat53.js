/*
plot: 1=line, 2=indicator, 0=none
*/

function loadTubeHistoryFormat53() {   /*Somatom.go Bata 18Oct2017 Travis DePrey hack */
	var thFormat = {};
	thFormat.numCols = 53;
	thFormat.delim = "\t";
	thFormat.indexSystemSerial = 52;
	thFormat.indexTubeSerial = 51;
	thFormat.indexScanMode = 1;
	thFormat.indexTimestamp = 2;
	thFormat.indexAbort = 'abort_controller';
	thFormat.columnDef = [];
	thFormat.columnDef[0] = { id: 'Tube_scan_counter', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[1] = { id: 'kind', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[2] = { id: 'datetime', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[3] = { id: 'rot_time', plot: 1, min: 0, max: 1.5 };
	thFormat.columnDef[4] = { id: 'scan_time_nom', plot: 1, min: 0, max: 90 };
	thFormat.columnDef[5] = { id: 'scan_time_act', plot: 1, min: 0, max: 90 };
	thFormat.columnDef[6] = { id: 'voltage_nom', plot: 1, min: 0, max: 150 };
	thFormat.columnDef[7] = { id: 'voltage_act', plot: 1, min: 0, max: 150 };
	thFormat.columnDef[8] = { id: 'current_UI', plot: 1, min: 0, max: 2000 };
	thFormat.columnDef[9] = { id: 'current_nom', plot: 1, min: 0, max: 2000 };
	thFormat.columnDef[10] = { id: 'current_min', plot: 1, min: 0, max: 2000 };
	thFormat.columnDef[11] = { id: 'current_max', plot: 1, min: 0, max: 2000 };
	thFormat.columnDef[12] = { id: 'current_mean', plot: 1, min: 0, max: 2000 };
	thFormat.columnDef[13] = { id: 'current_ctrl_beg', plot: 1, min: 0, max: 2000 };
	thFormat.columnDef[14] = { id: 'current_beg', plot: 1, min: 0, max: 2000 };
	thFormat.columnDef[15] = { id: 'current_end', plot: 1, min: 0, max: 2000 };
	thFormat.columnDef[16] = { id: 'focus', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[17] = { id: 'freq_stator_act', plot: 1, min: 140, max: 250 };
	thFormat.columnDef[18] = { id: 'freq_anode_act', plot: 1, min: 140, max: 250 };
	thFormat.columnDef[19] = { id: 'filament_current_nom', plot: 1, min: 0, max: 4500 };
	thFormat.columnDef[20] = { id: 'filament_current_beg_act', plot: 1, min: 0, max: 4500 };
	thFormat.columnDef[21] = { id: 'filament_current_ctrl_beg', plot: 1, min: 0, max: 4500 };
	thFormat.columnDef[22] = { id: 'filament_current_end', plot: 1, min: 0, max: 4500 };
	thFormat.columnDef[23] = { id: 'filament_current_push_calc', plot: 1, min: 0, max: 4500 };
	thFormat.columnDef[24] = { id: 'dose_nom', plot: 1, min: 0, max: 66000 };
	thFormat.columnDef[25] = { id: 'dose_min', plot: 1, min: 0, max: 66000 };
	thFormat.columnDef[26] = { id: 'dose_max', plot: 1, min: 0, max: 66000 };
	thFormat.columnDef[27] = { id: 'dose_end', plot: 1, min: 0, max: 66000 };
	thFormat.columnDef[28] = { id: 'Tube_cooling_temp_inlet_begin', plot: 1, min: 0, max: 50};  /*Somatom.go New */
	thFormat.columnDef[29] = { id: 'Tube_cooling_temp_inlet_end', plot: 1, min: 0, max: 50 };  /*Somatom.go New */
	thFormat.columnDef[30] = { id: 'Tube_cooling_temp_outlet_begin', plot: 1, min: 0, max: 50 };  /*Somatom.go New */
	thFormat.columnDef[31] = { id: 'Tube_cooling_temp_outlet_end', plot: 1, min: 0, max: 50 };  /*Somatom.go New */
	thFormat.columnDef[32] = { id: 'Calcualated_temp_anode', plot: 1, min: 0, max: 1500 };  /*Somatom.go New */
	thFormat.columnDef[33] = { id: 'gantry_temp', plot: 1, min: 10, max: 60 };
	thFormat.columnDef[34] = { id: 'Stator_current_end_act', plot: 1, min: 0, max: 25000 };    /*Somatom.go New */
	thFormat.columnDef[35] = { id: 'arcing_sum', plot: 1, min: 0, max: NaN};    /*Somatom.go New */
	thFormat.columnDef[36] = { id: 'arcings_pos', plot: 1, min: 0, max: NaN};   /*Somatom.go New */
	thFormat.columnDef[37] = { id: 'arcings_neg', plot: 1, min: 0, max: NaN};   /*Somatom.go New */
	thFormat.columnDef[38] = { id: 'HV_drops', plot: 1, min: 0, max: NaN};
	thFormat.columnDef[39] = { id: 'Xc_drops', plot: 1, min: 0, max: NaN};
	thFormat.columnDef[40] = { id: 'start_angle', plot: 1, min: 0, max: 65435 };
	thFormat.columnDef[41] = { id: 'readings_total', plot: 1, min: 0, max: NaN};
	thFormat.columnDef[42] = { id: 'readings_def_scans', plot: 1, min: 0, max: NaN};
	thFormat.columnDef[43] = { id: 'readings_last_def', plot: 1, min: 0, max: NaN};
	thFormat.columnDef[44] = { id: 'region', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[45] = { id: 'DOM_type', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[46] = { id: 'scan_mode', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[47] = { id: 'cancel_reason', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[48] = { id: 'abort_controller', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[49] = { id: 'ECO', plot: 2, min: 0, max: 0 };
	thFormat.columnDef[50] = { id: 'diff_to_UTC', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[51] = { id: 'tube_serial', plot: 0, min: 0, max: 0 };
	thFormat.columnDef[52] = { id: 'system_serial', plot: 0, min: 0, max: 0 };

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
		//document.getElementById('divDebugInfo').innerHTML = 'f81: parseDataLine start';
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
		var keys = [
			'thVersion',
			'swVersionPrev',
			'instSWprev',
			'swVersion',
			'instSW',
			'tubeSystem',
			'customer',
			'installed',
			'deinstalled',
			'serial',
			'tubeSerial',
			'tubeRevision',
			'tubeType',
			'numScans',
			'tubeKWs',
			'scanSecs',
			'systemSecs'
		];

		var metadata = {};

		for (var k=0; k<keys.length; k++) {
			var tokens = datalines[k].split(':');
			var value = tokens[1].replace(/^\s+/, '');
			metadata[keys[k]] = value;
		};

		// keep date only
		metadata.installed = metadata.installed.split(' ').shift();
		metadata.deinstalled = metadata.deinstalled.split(' ').shift();
		metadata.instSW = metadata.instSW.split(' ').shift();

		//metadata.scanSecs = Number(metadata.scanSecs);

		return metadata;
	}

	return thFormat;
}
