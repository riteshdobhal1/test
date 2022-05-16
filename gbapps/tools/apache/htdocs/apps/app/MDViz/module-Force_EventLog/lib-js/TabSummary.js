
function tabSummary() {
}

tabSummary.isInitialized = false;

tabSummary.initialize = function() {
	// console.log("tabSummary.initialize start");

	if (listEventLogObjects.length === 0) return;
	if (tabSummary.isInitialized) return;
	if (!tabLoad.isReadingAllDone) return;

	initializeTableStatistics();
	makeReportStatistics();
	logViewerSummary = new LogViewer(listEventLogObjects, columnWidthSummary,
		'divTableEventLogTextSummary', 'divButtonBarEventLogTextSummary');
	document.getElementById('chartPatient').style.display = 'none';

	if (basicEvents.length === 0) {
		makeReportBasicEvents(listEventLogObjects);
	}

	makeReportWorkflowEvents(basicEvents);

	tabSummary.isInitialized = true;
}

tabSummary.reset = function() {
	tabSummary.isInitialized = false;
	clearTabSummary();
	basicEvents = [];
}

// global variables
var chartWorkflow;
var chartPatient;
var workflowEvents = [];
var listDatesWorkflow;
var reportPatients;
var reportScanProtocols;
var reportCalibrations;
var reportTableErrors;
var reportResetsAuto;
var logViewerSummary;
var columnWidthSummary = [ 13, 80, 70, 30, 500 ];
var timeScaleFactorForPlot = 100/3600;
// var timeScaleFactorForPlot = 1;
var patientIntervals = [];
var systemEvents = [];

// [indexDay][vId] = interval
var mapIndexDayIntervalToPatientInterval = [];


function clearTabSummary() {
	// console.log('clearTabSummary begin');

	// clear div elements
	var listDivIDs = [
		'chartWorkflow',
		'chartPatient',
		'divButtonBarEventLogTextSummary',
		'divTableEventLogTextSummary',
		'divStatsDetails',
	];
	for (var i=0; i<listDivIDs.length; i++) {
		var id = listDivIDs[i];
		document.getElementById(id).innerHTML = '';
	}

	if (logViewerSummary !== undefined) logViewerSummary.clear();
}

function getPatientLOIDs(reportPatients) {
	var hashPatientLOID = {};
	for (var i=0; i<reportPatients.length; i++) {
		var records = reportPatients[i];
		for (var k=0; k<records.length; k++) {
			var record = records[k];
			var tokens = record.event_text.match(/@Patient LOID@\s*=\s*#([^#]+)#/);
			hashPatientLOID[tokens[1]] = 1;
		}
	}
	return hashPatientLOID;
}

function filterScanProtocolsByPatientLOID(reportScanProtocols, reportPatients) {
	var hashPatientLOID = getPatientLOIDs(reportPatients);
	var reportScanProtocolsFiltered = [];
	for (var i=0; i<reportScanProtocols.length; i++) {
		var records = reportScanProtocols[i];
		var recordsFiltered = [];
		for (var k=0; k<records.length; k++) {
			var record = records[k];
			var tokens = record.event_text.match(/@Patient LOID@\s*=\s*#([^#]+)#/);
// console.log(record.event_text.substr(0,88));
			var patientLOID = tokens[1];
			if (hashPatientLOID[patientLOID] === 1) {
				recordsFiltered.push(record);
			}
		}
		reportScanProtocolsFiltered.push(recordsFiltered);
	}
	return reportScanProtocolsFiltered;
}

function makeReportStatistics() {
	reportPatients = makeReportPatients();
	var reportScanProtocolsAll = makeReportScanProtocols();
	reportScanProtocols = filterScanProtocolsByPatientLOID(reportScanProtocolsAll, reportPatients);
	reportCalibrations = makeReportCalibrations();
	reportTableErrors = makeReportTableErrors();
	reportResetsAuto = makeReportResetsAuto();

	appendColumnTableStatistics('Patients', reportPatients, 'callbackShowDetailsPatients');
	appendColumnTableStatistics('Scan<br>protocols', reportScanProtocols, 'callbackShowDetailsScanProtocols');
	appendColumnTableStatistics('Calibrations', reportCalibrations, 'callbackShowDetailsCalibrations');
	appendColumnTableStatistics('Resets<br>auto', reportResetsAuto, 'callbackShowDetailsResetsAuto');
	appendColumnTableStatistics('Errors<br>table', reportTableErrors, 'callbackShowDetailsTableErrors');
}

function makeReportPatients() {
	var eventSource = 'CT_CHR';
	var eventId = 68;
	var result = findEventsPerDay(eventSource, eventId);
	return result;
}

function makeReportScanProtocols() {
	var eventSource = 'CT_IS';
	var eventId = 487;
	var result = findEventsPerDay(eventSource, eventId);
	return result;
}

function makeReportCalibrations() {
	var eventSource = 'CT_STA';
	var eventId = 22;
	var result = findEventsPerDay(eventSource, eventId);
	return result;
}

function makeReportResetsAuto() {
	var eventSource = 'CT_ISV';
	var eventId = 67;
	var result = findEventsPerDay(eventSource, eventId);
	return result;
}

function makeReportWorkflowEvents(basicEvents) {
	console.log('makeReportWorkflowEvents start');
	//var listEventLogObjects = zz_load_test_logdata();

	patientIntervals = [];

	var interval = undefined;

	for (var k=0; k<basicEvents.length; k++) {
		var record = basicEvents[k];

		if (record.info==='Patient\nbegin') {
			// store old interval
			if (interval !== undefined) {
				// console.log(interval);
				patientIntervals.push(interval);
			}
			// start new interval
			interval = {
				begin			: record.datetime,
				end				: undefined,
				indexRecordBegin: k,
				indexRecordEnd	: undefined
			};
			// console.log('start: ' + record.datetime.toLocaleString());
		}
		if (record.info==='Patient\nclosed') {
			var updateEndpoint = true;
			if (k > 0) {
				var dayCurr = basicEvents[k].datetime.getDate();
				var dayPrev = basicEvents[k-1].datetime.getDate();
				if (dayCurr !== dayPrev) {
					// ClosePatient comes twice on two different days
					// ignore the second
					updateEndpoint = false;
				}
			}
			// update end timepoint
			if (updateEndpoint) {
				if (interval !== undefined) {
					// take first end timepoint and ignore others
					// (sometimes "ClosePatient" messages for other patients appear)
					if (interval.end === undefined) {
						interval.end = record.datetime;
						interval.indexRecordEnd = k;
					}
					// console.log('end:   ' + record.datetime.toLocaleString());
				}
			}
			else {
				// console.log('end:   ' + record.datetime.toLocaleString() + ' --ignored');
			}
		}
	}
	// last interval
	if (interval !== undefined) {
		patientIntervals.push(interval);
	}

/*
	for (var i=0; i<patientIntervals.length; i++) {
		var ss = [ patientIntervals[i].begin.toLocaleString(), patientIntervals[i].end.toLocaleString() ];
		console.log(ss);
	}

I	2015-12-23	20:53:16	CT_CHR	108	&ClosePatient&, @Patient LOID@ = #4.0.1019597683#, @Study LOID@ = #4.0.1019597692, 4.0.1019597706#, @Task card name@ = #Examination#\n

I	23.12.2015	21:59:37	21	59	37	79177		CT_CHR	68	&Examination scan patient&, @Patient LOID@ = #4.0.1019597724#
I	23.12.2015	22:11:12	22	11	12	79872	695	CT_CHR	108	&ClosePatient&, @Patient LOID@ = #4.0.1019597724#, @Study LOID@ = #4.0.1019597733#, @Task card name@ = #Examination#\n
I	23.12.2015	22:20:14	22	20	14	80414	542	CT_CHR	68	&Examination scan patient&, @Patient LOID@ = #4.0.1019597751#
I	23.12.2015	22:26:51	22	26	51	80811	397	CT_CHR	108	&ClosePatient&, @Patient LOID@ = #4.0.1019597751#, @Study LOID@ = #4.0.1019597760#, @Task card name@ = #Examination#\n
I	23.12.2015	22:37:17	22	37	17	81437	626	CT_CHR	68	&Examination scan patient&, @Patient LOID@ = #4.0.1019597575#
I	23.12.2015	22:53:59	22	53	59	82439	1002	CT_CHR	108	&ClosePatient&, @Patient LOID@ = #4.0.1019597575#, @Study LOID@ = #4.0.1019597783#, @Task card name@ = #Examination#\n

*/

	listDatesWorkflow = extractListDates();

	mapIndexDayIntervalToPatientInterval = [];

	var chartDataIntervals = [];
	chartDataIntervals[0] = { category: "" };

	for (var i=0; i<listEventLogObjects.length; i++) {
		var label = listDatesWorkflow[i];
		var dateRef = listEventLogObjects[i].logdata[0].datetime;
		var ret = makeChartDataIntervalsEntry(label, dateRef, patientIntervals);
		chartDataIntervals[i+1] = ret.intervalSeries;
		mapIndexDayIntervalToPatientInterval[i] = ret.mapDay;
	}

	// add system events
	for (var k=0; k<basicEvents.length; k++) {
		var record = basicEvents[k];
		var valueFieldname = '';
		if (record.info==='Computer ON')		valueFieldname = 'startup';
		if (record.info==='Checkup\nstarted')	valueFieldname = 'checkup';
		if (valueFieldname !== '') {
			// get date --> used as category
			var d = record.datetime;
			var month = d.toLocaleDateString('en-us', { month: "short" });
			var day = d.getDate();
			var key = month + ' ' + day;
			// find corresponding day
			var idx = -1;
			for (var i=0; i<listEventLogObjects.length; i++) {
				if (chartDataIntervals[i+1].category === key) {
					idx = i+1;
					break;
				}
			}
			// get msec since midnight --> used as value
			var midnight = new Date(d);
			midnight.setHours(0);
			midnight.setMinutes(0);
			midnight.setSeconds(0);
			midnight.setMilliseconds(0);
			var value = d - midnight;
			chartDataIntervals[idx][valueFieldname] = value * timeScaleFactorForPlot;
		}
	}
	console.log(chartDataIntervals);

	var idTab = 'tabWorkflow';
	var element = document.getElementById(idTab);
	element.style.display = 'inline-block';
	initializeChartWorkflow(chartDataIntervals);
	element.style.display = 'none';

	console.log('makeReportWorkflowEvents end');
}

function makeChartDataIntervalsEntry(label, dateRef, patientIntervals) {
	// var intervalSeries = { category: "Apr 18" };
	var intervalSeries = { category: label };
	var mapDay = {};

	var idx = 0;
	for (var i=0; i<patientIntervals.length; i++) {
		var interval = patientIntervals[i];
		var isSameDay = (interval.begin.getMonth() == dateRef.getMonth());
		isSameDay = isSameDay && (interval.begin.getDate() == dateRef.getDate());
		if (isSameDay) {
			// gap
			var timestampPrev;
			if (idx === 0) {
				timestampPrev = new Date(interval.begin);
				timestampPrev.setHours(0);
				timestampPrev.setMinutes(0);
				timestampPrev.setSeconds(0);
				timestampPrev.setMilliseconds(0);
			}
			else {
				timestampPrev = patientIntervals[i-1].end;
			}
			var timespan = interval.begin - timestampPrev;
// console.log([i, timestampPrev, interval.begin, interval.end, timespan]);
			var id = "v" + String(2*idx);
			intervalSeries[id] = timespan * timeScaleFactorForPlot;	
// console.log([dateRef.toLocaleDateString(), id, timespan, intervalSeries[id]]);
			mapDay[id] = i;
			// actual interval
			timespan = interval.end - interval.begin;
			id = "v" + String(2*idx+1);
			intervalSeries[id] = timespan * timeScaleFactorForPlot;
// console.log([dateRef.toLocaleDateString(), id, timespan, intervalSeries[id], interval.begin.toLocaleTimeString(), interval.end.toLocaleTimeString()]);
			mapDay[id] = i;
			idx++;
		}
	}

	var ret = {
		intervalSeries : intervalSeries,
		mapDay : mapDay
	};

	return ret;
}

function showEventLogTextSummaryTab(idEventLogText, indexDay, indexLineStart, indexLineEnd, indexLineHighlight) {
	var elementEventLogText = document.getElementById(idEventLogText);

	var logdata = listEventLogObjects[indexDay].logdata;
	var nLines = logdata.length;

	if (indexLineStart < 0) indexLineStart = 0;
	if (indexLineEnd >= nLines) indexLineEnd = nLines-1;

	var columnWidth = [ 13, 80, 70, 30, 500 ];
	function getSum(total, num) { return total + num; }
	var tableWidth = columnWidth.reduce(getSum);

	var tbl = document.createElement('table');
	tbl.style.width = String(tableWidth) + 'px';
	tbl.style.tableLayout = 'fixed';
	tbl.setAttribute('border', '1');

	var tbdy = document.createElement('tbody');

	for (var i=indexLineStart; i<=indexLineEnd; i++) {
		var tr = document.createElement('tr');

		if (i===indexLineHighlight) {
			tr.style.backgroundColor = '#dfd';
		}

		var record = logdata[i];

		var fields = [
			record.severity,
			record.datetime.toLocaleString(),
			record.event_source,
			String(record.event_id),
			record.event_text
		];

		for (var k=0; k<fields.length; k++) {
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(fields[k]));
			td.style.width = String(columnWidth[k]) + 'px';
			td.style.wordWrap = "break-word";
			tr.appendChild(td);
		}
		tbdy.appendChild(tr);
	}
	tbl.appendChild(tbdy);

	if (elementEventLogText.hasChildNodes()) {
		elementEventLogText.removeChild(elementEventLogText.childNodes[0]);
	}
	elementEventLogText.appendChild(tbl);

	//console.log(tbl.offsetHeight);
}

function callbackClickGraphItemWorkflow(event) {
	// console.log(event);
	if (event.graph.valueField === 'startup') {
		return;
	}
	if (event.graph.valueField === 'checkup') {
		return;
	}

	var eventData = event.chart.dataProvider;
	var recordSelected = eventData[event.index];

	// console.log(recordSelected);
	// Object { category: "Dec 23", v0: 2199361.111111111, v1: 19305.555555555555, v2: 15055.555555555555, v3: 11027.777777777777, v4: 17388.888888888887, v5: 27833.333333333332 }


	// get indexDay
	var indexDay = -1;
	for (var i=0; i<listDatesWorkflow.length; i++) {
		if (listDatesWorkflow[i] === event.item.category) {
			indexDay = i;
			break;
		}
	}

	// get indexLine:
	// event.item.values.value --> v-index (e.g. "v5") --> interval --> indexLine
	var vIndex = '';
	for (var k in recordSelected) {
		if (recordSelected[k] === event.item.values.value) {
			vIndex = k;
			break;
		}
	}
	var vIndexNum = Number(vIndex.replace('v', ''));
	var idxInterval = Math.floor(vIndexNum/2);
	var interval = patientIntervals[idxInterval];
	var i1 = interval.indexRecordBegin;
	var i2 = interval.indexRecordEnd;

	idxInterval = mapIndexDayIntervalToPatientInterval[indexDay][vIndex];
	interval = patientIntervals[idxInterval];
	i1 = interval.indexRecordBegin;
	i2 = interval.indexRecordEnd;
	console.log(['callbackClickGraphItemWorkflow', indexDay, i1, i2]);

	var bb = basicEvents.slice(i1, i2+1);
	document.getElementById('chartPatient').style.display = 'inline-block';
	chartPatient = initializeChartBasicEvents(bb, 'chartPatient');
	chartPatient.logViewer = logViewerSummary;

	// var indexLineBegin = basicEvents[i1].indexLine;
	// var indexLineEnd = basicEvents[i2].indexLine;
}

function labelFunctionWorkflow(value, valueText, valueAxis) {
	var nDays = listDatesWorkflow.length;
	var idx = nDays - value;
	if (idx >= 0 && idx < nDays) {
		// check if idx is an integer
		if (idx === Math.floor(idx)) {
			return listDatesWorkflow[idx];
		}
	}
	return '';
}

function extractListDates() {
	var hash = {};
	var listDates = [];
	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;
		// take date of first record
		var d = logdata[0].datetime;
		var month = d.toLocaleDateString('en-us', { month: "short" });
		var day = d.getDate();
		var key = month + ' ' + day;
		if (hash[key] === undefined) {
			hash[key] = 1;
			listDates.push(key);
		}
	}
	return listDates;
}

function initializeChartWorkflow(chartDataIntervals) {
	var scrollbarHeight = 20;

	var nDays = listDatesWorkflow.length;

	var element = document.getElementById('chartWorkflow');
	element.style.backgroundColor = '#fff';
	element.style.height = 60 + nDays * 40 + scrollbarHeight;

    var chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartDataIntervals;
    chart.categoryField = "category";
    // chart.sequencedAnimation = false;
	chart.rotate = true; // if you want vertical bullet chart, set rotate to false
	chart.columnWidth = 1;
	chart.startDuration = 0;

	chart.addListener("clickGraphItem", callbackClickGraphItemWorkflow);

	chart.categoryAxis.gridAlpha = 0;
	chart.categoryAxis.autoGridCount = false;
	chart.categoryAxis.gridCount = chartDataIntervals.length;
	chart.categoryAxis.reversed = true;

	chart.guides = [];
	for (var i=0; i<nDays; i++) {
		var guide = {
			category	: listDatesWorkflow[i],
			color		: '#000',
			lineAlpha	: 0.3
		};
		chart.guides.push(guide);
	}

    // value axis 1
    var valueAxis = new AmCharts.ValueAxis();
	valueAxis.minimum = 0;		// in seconds
	valueAxis.maximum = 1000 * 3600 * 24 * timeScaleFactorForPlot;
	valueAxis.axisAlpha = 1;
	valueAxis.gridAlpha = 0.6;
	valueAxis.dashLength = 3;
	valueAxis.stackType = "regular"; // we use stacked graphs to make color fills
	valueAxis.labelFunction = labelFunction;
	valueAxis.autoGridCount = false;
	valueAxis.gridCount = 24;		// number of intervals??
	chart.addValueAxis(valueAxis);

	var nDays = chartDataIntervals.length - 1;
	console.log("nDays = " + nDays);

	// get maximum number of intervals
	var n = 0;
	for (var k=0; k<nDays; k++) {
		// -1 because first key is "category"
		var nk = Object.keys(chartDataIntervals[k+1]).length - 1;
		// console.log("nk", nk);
		if (nk > n) n=nk;
	}

	// create a graph for each interval
	for (var i=0; i<n; i++) {
		var id = "v" + i;
		var graph = new AmCharts.AmGraph();
		graph.valueField = id;
		graph.showBalloon = true;
		//graph.showBalloonAt = 
		graph.balloonFunction = balloonTextFunction;
		graph.type = "column";
		graph.columnWidth = 0.5;
		graph.lineColor = '#00d';
		if (isEven(i)) {
			graph.fillAlphas = 0.;
			graph.lineAlpha = 0.;
		}
		else {
			graph.fillAlphas = 0.3;
			graph.lineAlpha = 1;
		}
		chart.addGraph(graph);
	}

	// create graph for system events
	var graph = new AmCharts.AmGraph();
	graph.type = 'line';
	graph.valueField = 'startup';
	graph.balloonText = "Startup";
	graph.lineColor = '#f0f';
	graph.valueAxis = valueAxis;
	graph.bullet = "triangleRight";
	graph.bulletSize = 10;
	graph.lineAlpha = 0;
	chart.addGraph(graph);

	// appears stacked --why???
	// graph = new AmCharts.AmGraph();
	// graph.type = 'line';
	// graph.valueField = 'checkup';
	// graph.balloonText = "checkup";
	// graph.lineColor = '#000';
	// graph.valueAxis = valueAxis;
	// graph.bullet = "triangleRight";
	// graph.bulletSize = 10;
	// graph.lineAlpha = 0;
	// chart.addGraph(graph);


	// chart.chartCursor = {
		// "valueBalloonsEnabled": false,
		// "cursorAlpha": 1,
		// "valueLineBalloonEnabled": true,
		// "valueLineEnabled": true,
		// "valueZoomable":true,
		// "zoomable":false
	// };

	chart.valueScrollbar = {
		"autoGridCount":true,
		"color":"#000000",
		"scrollbarHeight":scrollbarHeight
	};

	// var chartScrollbar = new AmCharts.ChartScrollbar();
	// chartScrollbar.scrollbarHeight = scrollbarHeight;
	// chartScrollbar.backgroundAlpha = 0;
	// chartScrollbar.selectedBackgroundAlpha = 0.1;
	// chartScrollbar.selectedBackgroundColor = "#888888";
	// chartScrollbar.graphFillAlpha = 0;
	// chartScrollbar.graphLineAlpha = 0.5;
	// chartScrollbar.selectedGraphFillAlpha = 0;
	// chartScrollbar.selectedGraphLineAlpha = 1;
	// chartScrollbar.autoGridCount = true;
	// chartScrollbar.color = "#AAAAAA";
	// chart.chartScrollbar = chartScrollbar;

	chart.pathToImages = "lib-js/amcharts/images/";
	chart.creditsPosition = 'top-left';

	chart.autoMargins = false;
	chart.marginLeft  = 70;
	chart.marginRight = 70;
	chart.marginBottom = 30;
	chart.marginTop = 10;

	chart.write("chartWorkflow");

	chartWorkflow = chart;
}

function isEven(n) {
	if (Math.abs(Math.floor(n/2) * 2 - n) < 1e-6) return true;
	else return false;
}

function labelFunction(value, valueText, valueAxis) {
	// value is scaled milliseconds
	var msec = value / timeScaleFactorForPlot;
	var hours = Math.round(msec / 3600000);
	// console.log([value,hours]);
	if (Math.abs(hours * 3600000 - msec) < 1) {
		if (hours !== 25)
			if (isEven(hours))
				return hours + ':00';
	}
	return '';
}

function balloonTextFunction(graphDataItem) {
	//console.log(graphDataItem);
	// graphDataItem.category = "Apr 18"
	// graphDataItem.graph.valueField = "v11"
//console.log(graphDataItem.category);
//console.log(graphDataItem.graph.valueField);
	var chartData = graphDataItem.graph.chart.dataProvider;
//console.log(chartData);

	// find index (e.g. idx="v11")
	var idxDay = -1;
	var idx;
	for (var i=0; i<chartData.length; i++) {
		if (chartData[i].category === graphDataItem.category) {
			idx = graphDataItem.graph.valueField;
			idxDay = i;
			break;
		}
	}
	//console.log(idx);
	var idxNum = Number(idx.replace('v', ''));

	var value = 0;
	for (var i=0; i<=idxNum; i++) {
		var key = 'v' + String(i);
		value += chartData[idxDay][key];
	}

	var msec = value / timeScaleFactorForPlot;
	var seconds = Math.round(msec / 1000);
	var hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	var minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	var label = hours + ':';
	if (minutes < 10) label = label + '0';
	label = label + minutes + ':';
	if (seconds < 10) label = label + '0';
	label = label + seconds;
	return label;
}


function countEventsStats(eventSource, eventId) {
	var nDays = listEventLogObjects.length;
	var sumCount = 0;
	var minCount = 1e99;
	var maxCount = -1e99;
	for (var i=0; i<nDays; i++) {
		var logdata = listEventLogObjects[i].logdata;
		var count = 0;
		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_source===eventSource && record.event_id===eventId) {
				count++;
			}
		}
		sumCount += count;
		if (count < minCount) minCount = count;
		if (count > maxCount) maxCount = count;
	}
	var ret = {
		N		: nDays,
		min		: minCount,
		max		: maxCount,
		mean	: Math.round(sumCount/nDays)
	}
	return ret;
}

function countEventsPerDay(eventSource, eventId) {
	var listCounts = [];
	var nDays = listEventLogObjects.length;
	for (var i=0; i<nDays; i++) {
		var logdata = listEventLogObjects[i].logdata;
		var count = 0;
		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_source===eventSource && record.event_id===eventId) {
				count++;
			}
		}
		listCounts.push(count);
	}
	return listCounts;
}

function findEventsPerDay(eventSource, eventId) {
	var result = [];
	var nDays = listEventLogObjects.length;
	for (var i=0; i<nDays; i++) {
		var logdata = listEventLogObjects[i].logdata;
		var hits = [];
		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_source===eventSource && record.event_id===eventId) {
				record.indexDay = i;
				record.indexLine = k;
				hits.push(record);
			}
		}
		result.push(hits);
	}
	return result;
}

function clearTableIncludingHeader(tableElement) {
	var n = tableElement.rows.length;
	// console.log('n='+n);
	if (n > 1) {
		var iFirstRemove = 0;		// remove header
		for (var i=n-1; i>=iFirstRemove; i--) {
			tableElement.deleteRow(i);
		}
	}
}

function initializeTableStatistics() {
	var tableStats = document.getElementById('tableStatistics');

	clearTableIncludingHeader(tableStats);

	// header
	var cell = document.createElement("TH");
	cell.innerHTML = 'Date';
	var tableRow = document.createElement("TR");
	tableRow.appendChild(cell);
	tableStats.appendChild(tableRow);

	var nDays = listEventLogObjects.length;

	for (var i=0; i<nDays; i++) {
		// take date of first record
		var date = listEventLogObjects[i].logdata[0].datetime;

		var cell = document.createElement("TD");
		cell.innerHTML = date.toLocaleDateString('en-us');

		var tableRow = document.createElement("TR");
		tableRow.appendChild(cell);

		tableStats.appendChild(tableRow);
	}
}

function appendColumnTableStatistics(header, report, funcNameDetails) {
	var values = [];
	for (var i=0; i<report.length; i++) {
		values.push(report[i].length);
	}

	var tableStats = document.getElementById('tableStatistics');
	var rows = tableStats.childNodes;

	// header
	var cell = document.createElement("TH");
	cell.innerHTML = header;
	var tableRow = rows[0];
	tableRow.appendChild(cell);

	var nDays = values.length;

	for (var i=0; i<nDays; i++) {
		var s = String(values[i]);

		if (values[i] > 0) {
			// create link to details
			s = '<a onclick="' + funcNameDetails + '(\'' 
				+ i + '\');">' + s + '</a>';
		}

		var cell = document.createElement("TD");
		cell.innerHTML = s;

		var tableRow = rows[i+1];
		tableRow.appendChild(cell);
	}
}

function callbackShowDetailsPatients(indexDay) {
	document.getElementById('chartPatient').style.display = 'none';
	var header = '<h1 class="large">Details: Patients (CT_CHR_68)</h1>';
	var linesDetails = [];
	var hits = reportPatients[indexDay];
	for (var k=0; k<hits.length; k++) {
		var record = hits[k];
		var timestamp = record.datetime.toLocaleString('en-us');
		var indexLineStart = record.indexLine - 5;
		var indexLineEnd = record.indexLine + 20;
		var s = '[' + String(k+1) + '] <a onclick="logViewerSummary.showEventLogText('
			+ indexDay + ',' + indexLineStart + ',' + indexLineEnd + ','
			+ record.indexLine + ');">' + timestamp + '</a>';
		// console.log(s);
		linesDetails.push(s);
	}
	document.getElementById('divStatsDetails').innerHTML 
		= header + linesDetails.join('<br>');
}

// @Kind@=#MlSpiral#
function getValueScanProtocol(key, eventText) {
	var pattern = '@' + key + '@\s*=\s*#([^#]+)#';
	var ret = eventText.match(pattern);
	var value = 'unknown';
	if (ret.length > 1) value = ret[1];
	return value;
}

function callbackShowDetailsScanProtocols(indexDay) {
	document.getElementById('chartPatient').style.display = 'none';
	var header = '<h1 class="large">Details: Scan protocol (CT_IS_487)</h1>';
	var linesDetails = [];
	var hits = reportScanProtocols[indexDay];
	for (var k=0; k<hits.length; k++) {
		var record = hits[k];
// @Organ characteristics@=#MlOrgCharAbdomen#
// @Scan protocol name@=#AB1_ABD_PEL_W#
// @Kind@=#MlSpiral#
		// var ret = record.event_text.match(/@Organ characteristics@=#([^#]+)#/);
		// if (ret.length > 1) organCharacteristics = ret[1];
		var organCharacteristics = getValueScanProtocol('Organ characteristics', record.event_text);
		var kind = getValueScanProtocol('Kind', record.event_text);

		var timestamp = record.datetime.toLocaleString('en-us');
		var indexLineStart = record.indexLine - 2;
		var indexLineEnd = record.indexLine + 20;
		var s = '<a onclick="logViewerSummary.showEventLogText('
			+ indexDay + ',' + indexLineStart + ',' + indexLineEnd + ','
			+ record.indexLine + ');">' + timestamp 
			+ ' : ' + kind + ' : ' + organCharacteristics + '</a>';
		// console.log(s);
		linesDetails.push(s);
	}
	document.getElementById('divStatsDetails').innerHTML 
		= header + linesDetails.join('<br>');
}

function callbackShowDetailsCalibrations(indexDay) {
	document.getElementById('chartPatient').style.display = 'none';
	var header = '<h1 class="large">Details: Calibrations (CT_STA_22)</h1>';
	var linesDetails = [];
	var hits = reportCalibrations[indexDay];
	for (var k=0; k<hits.length; k++) {
		var record = hits[k];

		var timestamp = record.datetime.toLocaleString('en-us');
		var indexLineStart = record.indexLine - 2;
		var indexLineEnd = record.indexLine + 20;
		var s = '<a onclick="logViewerSummary.showEventLogText('
			+ indexDay + ',' + indexLineStart + ',' + indexLineEnd + ','
			+ record.indexLine + ');">' + timestamp 
			+ ' : ' + record.event_text + '</a>';
		// console.log(s);
		linesDetails.push(s);
	}
	document.getElementById('divStatsDetails').innerHTML 
		= header + linesDetails.join('<br>');
}

function callbackShowDetailsTableErrors(indexDay) {
	document.getElementById('chartPatient').style.display = 'none';
	var header = '<h1 class="large">Details: Table errors (CT_SUI_100 SriGantryTableError)</h1>';
	var linesDetails = [];
	var hits = reportTableErrors[indexDay];
	for (var k=0; k<hits.length; k++) {
		var record = hits[k];

		var timestamp = record.datetime.toLocaleString('en-us');
		var indexLineStart = record.indexLine - 2;
		var indexLineEnd = record.indexLine + 20;
		var s = '<a onclick="logViewerSummary.showEventLogText('
			+ indexDay + ',' + indexLineStart + ',' + indexLineEnd + ','
			+ record.indexLine + ');">' + timestamp 
			+ ' : ' + record.event_text + '</a>';
		// console.log(s);
		linesDetails.push(s);
	}
	document.getElementById('divStatsDetails').innerHTML 
		= header + linesDetails.join('<br>');
}

function makeReportTableErrors() {
	var eventSource = 'CT_SUI';
	var eventId = 100;
	// var pattern = /SriGantryTableError$/;

	var result = [];
	var nDays = listEventLogObjects.length;
	for (var i=0; i<nDays; i++) {
		var logdata = listEventLogObjects[i].logdata;
		var hits = [];
		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_source===eventSource && record.event_id===eventId) {
				//if (record.event_text.indexOf('SriGantryTableError') > 0) console.log('>>'+record.event_text+'<<');
				if (record.event_text.indexOf('SriGantryTableError') > 0) {
					record.indexDay = i;
					record.indexLine = k;
					hits.push(record);
				}
			}
		}
		result.push(hits);
	}
	return result;
}

function callbackShowDetailsResetsAuto(indexDay) {
	document.getElementById('chartPatient').style.display = 'none';
	var header = '<h1 class="large">Details: Resets auto (CT_ISV_67)</h1>';
	var linesDetails = [];
	var hits = reportResetsAuto[indexDay];
	for (var k=0; k<hits.length; k++) {
		var record = hits[k];

		var timestamp = record.datetime.toLocaleString('en-us');
		var indexLineStart = record.indexLine - 2;
		var indexLineEnd = record.indexLine + 20;
		var s = '<a onclick="logViewerSummary.showEventLogText('
			+ indexDay + ',' + indexLineStart + ',' + indexLineEnd + ','
			+ record.indexLine + ');">' + timestamp 
			+ ' : ' + record.event_text + '</a>';
		// console.log(s);
		linesDetails.push(s);
	}
	document.getElementById('divStatsDetails').innerHTML 
		= header + linesDetails.join('<br>');
}

