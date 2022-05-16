/*
Load a tube history file format based on a sample line
*/
function loadTubeHistoryFormat(sampleLine) {
	var formatCode = -1;

	if (sampleLine.match(/\t/)) {
		// tab-separated formats 43, 81 and 53
		var nColumns = sampleLine.split("\t").length;
		formatCode = nColumns;
	}
	else {
		// fixed-width formats 21 and 32
		var s = sampleLine.replace(/^\s+/, '');
		s = s.replace(/\s+$/, '');
		var tokens = s.split(/\s+/);
		if (tokens.length == 22) { formatCode = 21; }
		if (tokens.length == 33) { formatCode = 32; }
	}

	console.log("formatCode=", formatCode);

	if (formatCode == -1) {
		throw "Tube history file has unknown format.";
		// showMessage('Tube history file has unknown format.', '#ffff00');
	}

	// load format definition
	if (formatCode == 21) { return loadTubeHistoryFormat21(); }
	if (formatCode == 32) { return loadTubeHistoryFormat32(); }
	if (formatCode == 43) { return loadTubeHistoryFormat43(); }
	if (formatCode == 81) { return loadTubeHistoryFormat81(); }
	if (formatCode == 53) { return loadTubeHistoryFormat53(); }  /* Somatom.go */
	if (formatCode == 58) { return loadTubeHistoryFormat58(); }  /* Chronon VA20A, Athlon */
	if (formatCode == 84) { return loadTubeHistoryFormat84(); }  // Straton VB10A
	if (formatCode == 71) { return loadTubeHistoryFormat71(); }  // X.Cite
	}

/*
Define pre-selected parameters for each tube history file format

Definition Units
	Top section - Aborts and double sided arcing
	Bottom section - Oil pressure and single sided arcing
Force
	Top section - Aborts and HV drops
	Bottom section - Arcing full sum and Arcings half sum
Sensation 
	Top section - Aborts and arcs
	Bottom section - Act voltage and Rot time
Emotion
	Top section - Aborts and arcs
	Bottom section - Act Voltage and UDC
Somatom.go
	Top section - Aborts and HV drops
	Bottom section - Arcings positive and negative side
*/
function preselectTubeParameter(thFormat, colNameAbortsAll) {
	if (thFormat.numCols == 21) {
		selectOption('tube_param1', colNameAbortsAll);
		selectOption('tube_param2', 'arcs');
		selectOption('tube_param3', 'voltage_act');
		selectOption('tube_param4', 'rot_time');
	}
	if (thFormat.numCols == 32) {
		selectOption('tube_param1', colNameAbortsAll);
		selectOption('tube_param2', 'arcings_one');
		// selectOption('tube_param3', 'voltage_act_kV');
		selectOption('tube_param3', 'anode_act_Hz');
		selectOption('tube_param4', 'UDC_Volt');
	}
	if (thFormat.numCols == 43) {
		selectOption('tube_param1', colNameAbortsAll);
		selectOption('tube_param2', 'arcings_both');
		selectOption('tube_param3', 'oil_pressure');
		selectOption('tube_param4', 'arcings_one');
	}
	if (thFormat.numCols == 81) {
		selectOption('tube_param1', colNameAbortsAll);
		selectOption('tube_param2', 'HV_drops');
		selectOption('tube_param3', 'arcings_full_sum');
		selectOption('tube_param4', 'arcings_half_sum');
	}
	if (thFormat.numCols == 53) {  /* Somatom.go */
		selectOption('tube_param1', colNameAbortsAll);
		selectOption('tube_param2', 'HV_drops');
		selectOption('tube_param3', 'arcings_pos');
		selectOption('tube_param4', 'arcings_neg');
	}
	if (thFormat.numCols == 58) {  /* Chronon VA20A, Athlon */
		selectOption('tube_param1', colNameAbortsAll);
		selectOption('tube_param2', 'HV_drops');
		selectOption('tube_param3', 'arcings_pos');
		selectOption('tube_param4', 'arcings_neg');
	}
	if (thFormat.numCols == 84) {  /* Straton VB10A */
		selectOption('tube_param1', colNameAbortsAll);
		selectOption('tube_param2', 'HV_drops');
		selectOption('tube_param3', 'arcings_full_sum');
		selectOption('tube_param4', 'arcings_half_sum');
	}
	if (thFormat.numCols == 71) {  /* X.Cite */
		selectOption('tube_param1', colNameAbortsAll);
		selectOption('tube_param2', 'HV_drops');
		selectOption('tube_param3', 'arcings_pos');
		selectOption('tube_param4', 'arcings_neg');
	}	
}
