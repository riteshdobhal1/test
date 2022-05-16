/*
plot: 1=line, 2=indicator, 0=none
*/

function loadTubeHistoryFormat84() {
	var thFormat = {};
	thFormat.numCols = 84;
	thFormat.delim = "\t";
	thFormat.indexSystemSerial = 83;
	thFormat.indexTubeSerial = 82;
	thFormat.indexScanMode = 1;
	thFormat.indexTimestamp = 2;
	thFormat.indexAbort = 'cancel_reason';
	thFormat.indexAbortController = 'abort_controller';

	thFormat.columnDef = [];

thFormat.columnDef[0] = { id: 'Tube_scan_counter', plot: 0, min: 0, max: 0 };
thFormat.columnDef[1] = { id: 'kind', plot: 0, min: 0, max: 0 };
thFormat.columnDef[2] = { id: 'datetime', plot: 0, min: 0, max: 0 };
thFormat.columnDef[3] = { id: 'rot_time', plot: 1, min: 0, max: 0 };
thFormat.columnDef[4] = { id: 'scan_time_nom', plot: 1, min: 0, max: 0 };
thFormat.columnDef[5] = { id: 'scan_time_act', plot: 1, min: 0, max: 0 };
thFormat.columnDef[6] = { id: 'voltage_nom', plot: 1, min: 0, max: 0 };
thFormat.columnDef[7] = { id: 'voltage_act', plot: 1, min: 0, max: 0 };
thFormat.columnDef[8] = { id: 'current_UI', plot: 1, min: 0, max: 0 };
thFormat.columnDef[9] = { id: 'current_nom', plot: 1, min: 0, max: 0 };
thFormat.columnDef[10] = { id: 'current_min', plot: 1, min: 0, max: 0 };
thFormat.columnDef[11] = { id: 'current_max', plot: 1, min: 0, max: 0 };
thFormat.columnDef[12] = { id: 'current_mean', plot: 1, min: 0, max: 0 };
thFormat.columnDef[13] = { id: 'current_ctrl_beg', plot: 1, min: 0, max: 0 };
thFormat.columnDef[14] = { id: 'current_beg', plot: 1, min: 0, max: 0 };
thFormat.columnDef[15] = { id: 'current_end', plot: 1, min: 0, max: 0 };
thFormat.columnDef[16] = { id: 'focus', plot: 0, min: 0, max: 0 };
thFormat.columnDef[17] = { id: 'freq_stator_act', plot: 1, min: 0, max: 0 };
thFormat.columnDef[18] = { id: 'freq_anode_act', plot: 1, min: 0, max: 0 };
thFormat.columnDef[19] = { id: 'filament_current_nom', plot: 1, min: 0, max: 0 };
thFormat.columnDef[20] = { id: 'filament_current_beg_act', plot: 1, min: 0, max: 0 };
thFormat.columnDef[21] = { id: 'filament_current_ctrl_beg', plot: 1, min: 0, max: 0 };
thFormat.columnDef[22] = { id: 'filament_current_end', plot: 1, min: 0, max: 0 };
thFormat.columnDef[23] = { id: 'filament_current_push_calc', plot: 1, min: 0, max: 0 };
thFormat.columnDef[24] = { id: 'dose_nom', plot: 1, min: 0, max: 0 };
thFormat.columnDef[25] = { id: 'dose_min', plot: 1, min: 0, max: 0 };
thFormat.columnDef[26] = { id: 'dose_max', plot: 1, min: 0, max: 0 };
thFormat.columnDef[27] = { id: 'dose_end', plot: 1, min: 0, max: 0 };
thFormat.columnDef[28] = { id: 'FFS', plot: 0, min: 0, max: 0 };
thFormat.columnDef[29] = { id: 'path_sensor', plot: 1, min: 0, max: 0 };
thFormat.columnDef[30] = { id: 'oil_pressure', plot: 1, min: 0, max: 0 };
thFormat.columnDef[31] = { id: 'water_temp_inlet_beg', plot: 1, min: 0, max: 0 };
thFormat.columnDef[32] = { id: 'water_temp_inlet_end', plot: 1, min: 0, max: 0 };
thFormat.columnDef[33] = { id: 'water_temp_outlet_beg', plot: 1, min: 0, max: 0 };
thFormat.columnDef[34] = { id: 'water_temp_outlet_end', plot: 1, min: 0, max: 0 };
thFormat.columnDef[35] = { id: 'oil_temp_cathode_1_begin', plot: 1, min: 0, max: 0 };
thFormat.columnDef[36] = { id: 'oil_temp_cathode_1_end', plot: 1, min: 0, max: 0 };
thFormat.columnDef[37] = { id: 'oil_temp_cathode_2_begin', plot: 1, min: 0, max: 0 };
thFormat.columnDef[38] = { id: 'oil_temp_cathode_2_end', plot: 1, min: 0, max: 0 };
thFormat.columnDef[39] = { id: 'calculated_temperature_cool_liquid', plot: 1, min: 0, max: 0 };
thFormat.columnDef[40] = { id: 'calculated_temperature_E-catch', plot: 1, min: 0, max: 0 };
thFormat.columnDef[41] = { id: 'calculated_temperature_cooling_channel_', plot: 1, min: 0, max: 0 };
thFormat.columnDef[42] = { id: 'calculated_temperature_anode_body_1', plot: 1, min: 0, max: 0 };
thFormat.columnDef[43] = { id: 'calculated_temperature_anode_body_2', plot: 1, min: 0, max: 0 };
thFormat.columnDef[44] = { id: 'calculated_temperature_anode_body_3', plot: 1, min: 0, max: 0 };
thFormat.columnDef[45] = { id: 'calculated_temperature_anode_body_4', plot: 1, min: 0, max: 0 };
thFormat.columnDef[46] = { id: 'calculated_temperature_anode_body_5', plot: 1, min: 0, max: 0 };
thFormat.columnDef[47] = { id: 'calculated_temperature_anode_body_6', plot: 1, min: 0, max: 0 };
thFormat.columnDef[48] = { id: 'calculated_temperature_anode_body_7', plot: 1, min: 0, max: 0 };
thFormat.columnDef[49] = { id: 'calculated_temperature_anode_body_8', plot: 1, min: 0, max: 0 };
thFormat.columnDef[50] = { id: 'calculated_temperature_focal_track_1', plot: 1, min: 0, max: 0 };
thFormat.columnDef[51] = { id: 'calculated_temperature_focal_track_2', plot: 1, min: 0, max: 0 };
thFormat.columnDef[52] = { id: 'calculated_temperature_focal_track_3', plot: 1, min: 0, max: 0 };
thFormat.columnDef[53] = { id: 'calculated_temperature_focal_track_4', plot: 1, min: 0, max: 0 };
thFormat.columnDef[54] = { id: 'calculated_temperature_focal_track_5', plot: 1, min: 0, max: 0 };
thFormat.columnDef[55] = { id: 'calculated_temperature_focal_track_6', plot: 1, min: 0, max: 0 };
thFormat.columnDef[56] = { id: 'calculated_temperature_focal_track_7', plot: 1, min: 0, max: 0 };
thFormat.columnDef[57] = { id: 'calculated_temperature_focal_track_8', plot: 1, min: 0, max: 0 };
thFormat.columnDef[58] = { id: 'calculated_temperature_focal_track_9', plot: 1, min: 0, max: 0 };
thFormat.columnDef[59] = { id: 'calculated_temperature_anode_body_9', plot: 1, min: 0, max: 0 };
thFormat.columnDef[60] = { id: 'calculated_temperature_fs_max', plot: 1, min: 0, max: 0 };
thFormat.columnDef[61] = { id: 'gantry_temp', plot: 1, min: 0, max: 0 };
thFormat.columnDef[62] = { id: 'cooling_pump_freq', plot: 1, min: 0, max: 0 };
thFormat.columnDef[63] = { id: 'cooling_pump_curr', plot: 1, min: 0, max: 0 };
thFormat.columnDef[64] = { id: 'HV_block_temp', plot: 1, min: 0, max: 0 };
thFormat.columnDef[65] = { id: 'stator_current_end_act', plot: 1, min: 0, max: 0 };
thFormat.columnDef[66] = { id: 'stator_temperature_end', plot: 1, min: 0, max: 0 };
thFormat.columnDef[67] = { id: 'arcings_full_sum', plot: 1, min: 0, max: 0 };
thFormat.columnDef[68] = { id: 'arcings_half_sum', plot: 1, min: 0, max: 0 };
thFormat.columnDef[69] = { id: 'HV_drops', plot: 1, min: 0, max: 0 };
thFormat.columnDef[70] = { id: 'Xc_drops', plot: 1, min: 0, max: 0 };
thFormat.columnDef[71] = { id: 'start_angle', plot: 1, min: 0, max: 0 };
thFormat.columnDef[72] = { id: 'readings_total', plot: 1, min: 0, max: 0 };
thFormat.columnDef[73] = { id: 'readings_def_scans', plot: 1, min: 0, max: 0 };
thFormat.columnDef[74] = { id: 'readings_last_def', plot: 1, min: 0, max: 0 };
thFormat.columnDef[75] = { id: 'region', plot: 0, min: 0, max: 0 };
thFormat.columnDef[76] = { id: 'DOM_type', plot: 0, min: 0, max: 0 };
thFormat.columnDef[77] = { id: 'scan_mode', plot: 0, min: 0, max: 0 };
thFormat.columnDef[78] = { id: 'cancel_reason', plot: 0, min: 0, max: 0 };
thFormat.columnDef[79] = { id: 'abort_controller', plot: 0, min: 0, max: 0 };
thFormat.columnDef[80] = { id: 'ECO', plot: 0, min: 0, max: 0 };
thFormat.columnDef[81] = { id: 'diff_to_UTC', plot: 0, min: 0, max: 0 };
thFormat.columnDef[82] = { id: 'tube_serial', plot: 0, min: 0, max: 0 };
thFormat.columnDef[83] = { id: 'system_serial', plot: 0, min: 0, max: 0 };

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
