
function tabMeasurements() {
}

tabMeasurements.isInitialized = false;

tabMeasurements.initialize = function() {
	console.log("tabMeasurements.initialize start");

	if (listEventLogObjects.length === 0) return;
	if (tabMeasurements.isInitialized) return;
	if (!tabLoad.isReadingAllDone) return;

	tabMeasurements.showBodyMeasurements();

	// var idTab = "tabMeasurements";
	// document.getElementById(idTab).style.display = "inline-block";

	showPleaseWait();

	// pause for 1 msec
	// setTimeout(function(){}, 1);
	// setTimeout(function(){console.log("44767:pausing");}, 1);
	// setTimeout(showPleaseWait, 1);

	initializeTabMeasurements();

	logViewerMeasurements = new LogViewer(listEventLogObjects, columnWidthMeasurements,
		'divTableEventLogTextMeasurements', 'divButtonBarEventLogTextMeasurements');

	if (basicEvents.length === 0) {
		makeReportBasicEvents(listEventLogObjects);
	}

// throw 246346;
// setTimeout(function(){}, 1);
// setTimeout(extractMeasurements, 1);

	extractMeasurements();
	showLegend();

	hidePleaseWait();

	tabMeasurements.isInitialized = true;

	console.log("tabMeasurements.initialize end");
}

tabMeasurements.reset = function() {
	tabMeasurements.isInitialized = false;
	basicEvents = [];
	// hide charts etc.
	tabMeasurements.hideBodyMeasurements();
}

tabMeasurements.showBodyMeasurements = function() {
	var idDiv = "bodyMeasurements";
	document.getElementById(idDiv).style.display = "block";
}

tabMeasurements.hideBodyMeasurements = function() {
	console.log("tabMeasurements.hideBodyMeasurements start");
	var idDiv = "bodyMeasurements";
	document.getElementById(idDiv).style.display = "none";
}

// global variables
var chartBasicEvents;
var chartMeasurements1;
var chartMeasurements2;
var indexDayCurrent = -1;
var deltaBefore = 5;
var deltaAfter = 50;
var basicEvents = [];
var listMeasNames = [];
var zoomStartIndexLast;
var zoomEndIndexLast;
var zoomStartDateLast;
var zoomEndDateLast;
var logViewerMeasurements;
var columnWidthMeasurements = [ 13, 130, 70, 40, 900 ];
var switchLogViewer = false;

var ycoordSystemLevel = 7;		// startup, checkup, shutdown, patient

var settingsScanKind = {
	Foot	: { color:'#f0f',		ycoord: 6 },
	Spiral	: { color:'#FE6A1E',	ycoord: 5 },		// orange: 254 106 30
	Sequence: { color:'#0a0',		ycoord: 4 },
	Topo	: { color:'#00f',		ycoord: 3 },
	Rot		: { color:'#f00',		ycoord: 2 },
	STA		: { color:'#777',		ycoord: 1 }
};

var limitsMeas = {
	'Air inlet temperature'				: { min: 0, max: 40 },
	'Air outlet temperature'			: { min: 0, max: 40 },
	'DMS temperature'					: { min: 0, max: 100 },
	'External WCS Control Output'		: { min: 0, max: 40 },
	'External WCS glycol temperature'	: { min: 0, max: 40 },
	'Fanspeed'							: { min: 0, max: 4000 },
	'Room humidity'						: { min: 0, max: 100 },
	'Room temperature'					: { min: 0, max: 40 },
	'Tube temperature'					: { min: 0, max: 100 },
	'Water inlet temperature'			: { min: 0, max: 40 },
	'Water outlet temperature'			: { min: 0, max: 40 },
	'Waterflow'							: { min: 0, max: 8000 },
};

function initializeTabMeasurements() {
	// window width
	var width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	document.getElementById('chartScanIntervals').style.width = String(width-50) + 'px';
	document.getElementById('chartMeasurements1').style.width = String(width-50) + 'px';
	document.getElementById('chartMeasurements2').style.width = String(width-50) + 'px';

	document.getElementById('selection1').style.backgroundColor = '#ccf';
	document.getElementById('selection2').style.backgroundColor = '#fcc';
	document.getElementById('selection3').style.backgroundColor = '#cfc';
	document.getElementById('selection4').style.backgroundColor = '#fcf';
}

function labelFunctionBasicEvents(value, valueText, valueAxis) {
	if (value===1) return 'STA/other';
	if (value===2) return 'ROT';
	if (value===3) return 'TOP';
	if (value===4) return 'SEQ';
	if (value===5) return 'SPI';
	if (value===6) return 'FOOT';
	if (value===7) return '';
	return '';
}

function getLastTimestamp() {
	var nDays = listEventLogObjects.length;
	var logdata = listEventLogObjects[nDays-1].logdata;
	var nEntries = logdata.length;
	var tpLastWithData = logdata[nEntries-1].datetime;
	var tpLast = new Date(tpLastWithData);
	tpLast.setHours(23);
	tpLast.setMinutes(59);
	tpLast.setSeconds(59);
	tpLast.setMilliseconds(1000);	// trick to get 0:00 of next day
	// console.log(tpLastWithData);
	// console.log(tpLast);
	return tpLast;
}

function getFirstTimestamp() {
	var tpFirstWithData = listEventLogObjects[0].logdata[0].datetime;
	var tpFirst = new Date(tpFirstWithData);
	tpFirst.setHours(0);
	tpFirst.setMinutes(0);
	tpFirst.setSeconds(0);
	tpFirst.setMilliseconds(0);
	return tpFirst;
}

function extractMeasurements() {
	console.log('extractMeasurements start');

	var measurements = [];
	var hashMeasNames = {};

	// add empty point at beginning
	var tpFirstWithData = listEventLogObjects[0].logdata[0].datetime;
	var tpFirst = new Date(tpFirstWithData);
	tpFirst.setHours(0);
	tpFirst.setMinutes(0);
	tpFirst.setSeconds(0);
	tpFirst.setMilliseconds(0);
	// console.log(tpFirstWithData);
	// console.log(tpFirst);
	measurements.push({ datetime:tpFirst });

	// get CCS measurements
	var measCCS = HexParserCCS.parseAll(listEventLogObjects);
	measurements = measurements.concat(measCCS.measurements);

	// add empty point at end
	var tpLast = getLastTimestamp();
	measurements.push({ datetime:tpLast });

	listMeasNames = measCCS.namesFound;
	// console.log('listMeasNames =', listMeasNames);

	initializeChartsForMeasurements(measurements);

	console.log('extractMeasurements end');

	return measurements;
}

function getColorScanKind(kind) {
	if (settingsScanKind[kind] === undefined)
		return '#777';
	else
		return settingsScanKind[kind].color;
}

function getYcoordScanKind(kind) {
	if (settingsScanKind[kind] === undefined)
		return 1;
	else
		return settingsScanKind[kind].ycoord;
}

function makeReportBasicEvents(listEventLogObjects) {
	console.log('makeReportBasicEvents start');
	//var listEventLogObjects = zz_load_test_logdata();

	basicEvents = [];
	var lastScanKind = 'unknown';
	var lastCheckupFunction = 'unknown';

	// add empty point at beginning
	var tpFirst = getFirstTimestamp();
	basicEvents.push({ color:'#000', datetime:tpFirst, value:-99, marker:'round', indexDay:0 });

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;

		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];

			if (record.event_id===1531) {
				var pathSymbolFile = 'lib-js/symbols/computer-on.png';
				var bulletSize = 20;
				basicEvents.push({ info:'Computer ON', color:'#f0f', marker:'triangleRight', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
			// CT_SUI	100	Receiving the notification SriGantryOk
			else if (record.event_id===100 && record.event_source==='CT_SUI') {
				if (record.event_text.indexOf('Receiving the notification SriGantryOk') > -1) {
					var pathSymbolFile = 'lib-js/symbols/system-on.png';
					var bulletSize = 20;
					basicEvents.push({ info:'System ON\nGantry OK', color:'#f0f', marker:'triangleRight', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
				}
			}
			else if (record.event_id===22 && record.event_source==='CT_STA') {
				var pathSymbolFile = 'lib-js/symbols/checkup-begin.png';
				var bulletSize = 20;
				basicEvents.push({ info:'Checkup\nstarted', color:'#f0f', marker:'triangleRight', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
			else if (record.event_id===152 && record.event_source==='CT_SRV') {
				var ret = record.event_text.match(/^Function "([^"]+)"/);
				var checkupFunction = ret[1];
				if (checkupFunction !== 'Checkup') {
					var pathSymbolFile = 'lib-js/symbols/service-begin.png';
					if (checkupFunction === 'Daily Quality Check') pathSymbolFile = 'lib-js/symbols/quality-begin.png';
					var bulletSize = 20;
					var info = checkupFunction + '\nstarted';
					basicEvents.push({ info:info, datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
					lastCheckupFunction = checkupFunction;
				}
			}
			else if (record.event_id===153 && record.event_source==='CT_SRV') {
				var ret = record.event_text.match(/^Function "([^"]+)"/);
				var checkupFunction = ret[1];
				var pathSymbolFile = 'lib-js/symbols/service-end.png';
				if (checkupFunction === 'Checkup') pathSymbolFile = 'lib-js/symbols/checkup-end.png';
				if (checkupFunction === 'Daily Quality Check') pathSymbolFile = 'lib-js/symbols/quality-end.png';
				var bulletSize = 20;
				var info = checkupFunction + '\ncompleted';
				basicEvents.push({ info:info, datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
				lastCheckupFunction = checkupFunction;
			}
			else if (record.event_id===269 && record.event_source==='CSA_OSC') {
				basicEvents.push({ info:'Shutdown\nbegin', color:'#0ff', marker:'triangleRight', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel });
			}
			else if (record.event_id===1532) {
				basicEvents.push({ info:'Shutdown\nend', color:'#0ff', marker:'triangleLeft', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel });
			}
			else if (record.event_id===493 && record.event_source==='CT_IS') {
				var ret = record.event_text.match(/@Mode kind@=#([^#]+)#/);
				var kind = ret[1].replace('Ml', '');
				var col = getColorScanKind(kind);
				var ycoord = getYcoordScanKind(kind);
				basicEvents.push({ info:kind+' scan\nbegin', color:col, marker:'triangleRight', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoord });
				lastScanKind = kind;
			}
			else if (record.event_id===494 && record.event_source==='CT_IS') {
				var col = getColorScanKind(lastScanKind);
				var ycoord = getYcoordScanKind(lastScanKind);
				basicEvents.push({ info:lastScanKind+' scan\nend', color:col, marker:'triangleLeft', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoord });
			}
			else if (record.event_id===68 && record.event_source==='CT_CHR') {
				var pathSymbolFile = 'lib-js/symbols/patient-begin.png';
				var bulletSize = 20;
				basicEvents.push({ info:'Patient\nbegin', color:'#0d0', marker:'triangleDown', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
			else if (record.event_id===108 && record.event_source==='CT_CHR') {
				var pathSymbolFile = 'lib-js/symbols/patient-end.png';
				var bulletSize = 20;
				basicEvents.push({ info:'Patient\nclosed', color:'#0d0', marker:'triangleDown', datetime:record.datetime, indexDay:i, indexLine:k, value:ycoordSystemLevel, bulletSize:bulletSize, customBullet:pathSymbolFile });
			}
		}
	}

	var tpLast = getLastTimestamp();
	basicEvents.push({ color:'#000', datetime:tpLast, value:-99, marker:'round', indexDay:listEventLogObjects.length-1 });

	var idTab = 'tabMeasurements';
	document.getElementById(idTab).style.display = 'inline-block';
	chartBasicEvents = initializeChartBasicEvents(basicEvents, 'chartScanIntervals');
	chartBasicEvents.logViewer = logViewerMeasurements;
	document.getElementById(idTab).style.display = 'none';

	console.log('makeReportBasicEvents end');
}

function showEventLogText(indexDay, indexLineStart, indexLineEnd, indexLineHighlight) {
	var logdata = listEventLogObjects[indexDay].logdata;

	var tbl = document.createElement('table');
	tbl.style.width = '100%';
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
			tr.appendChild(td);
		}
		tbdy.appendChild(tr);
	}
	tbl.appendChild(tbdy);

	var eventLogText = document.getElementById('eventLogText');
	if (eventLogText.hasChildNodes()) {
		eventLogText.removeChild(eventLogText.childNodes[0]);
	}
	eventLogText.appendChild(tbl);

	//console.log(tbl.offsetHeight);

	// var sliderEventText = document.getElementById('sliderEventText');
	// sliderEventText.style.height = tbl.offsetHeight - 20;
	// sliderEventText.min = 0;
	// sliderEventText.max = logdata.length - 1;
	// sliderEventText.step = 1;
	// sliderEventText.value = logdata.length - indexLineHighlight;
}


function callbackSliderEventText() {
	var sliderEventText = document.getElementById('sliderEventText');

	var indexDay = indexDayCurrent;
	var nLines = listEventLogObjects[indexDay].logdata.length;

	var indexLineHighlight = nLines-1 - sliderEventText.value;

	var indexLineStart = indexLineHighlight - deltaBefore;
	var indexLineEnd = indexLineHighlight + deltaAfter;

	showEventLogText(indexDay, indexLineStart, indexLineEnd, indexLineHighlight);
}


function callbackClickGraphItem(event) {
	if (!switchLogViewer) return;

	// console.log(event.item.category + ": " + event.item.values.value);
	var basicEvents = event.chart.dataProvider;
	var recordSelected = basicEvents[event.index];
	//console.log(recordSelected);

	var indexDay = recordSelected.indexDay;
	var indexLine = recordSelected.indexLine;

	indexDayCurrent = indexDay;

	var indexLineStart = indexLine - deltaBefore;
	var indexLineEnd = indexLine + deltaAfter;

	// logViewerMeasurements.showEventLogText(indexDay, indexLineStart, indexLineEnd, indexLine);
	event.chart.logViewer.showEventLogText(indexDay, indexLineStart, indexLineEnd, indexLine);
}


function initializeChartBasicEvents(basicEvents, divChart) {
	//console.log('initializeChartBasicEvents start');

    var chart = new AmCharts.AmSerialChart();
    chart.dataProvider = basicEvents;
    chart.categoryField = "datetime";
    chart.sequencedAnimation = false;
	chart.categoryAxis.minPeriod = "ss";
	chart.categoryAxis.parseDates = true;

	chart.addListener("clickGraphItem", callbackClickGraphItem);

    // value axes
	var valueAxis1 = makeValueAxis2('', 'left', '#000');
	var valueAxis2 = makeValueAxis2('', 'right', '#000');
    chart.addValueAxis(valueAxis1);
	chart.addValueAxis(valueAxis2);

    // graph 1
    var graph1 = new AmCharts.AmGraph();
	graph1.id = "g1";
	graph1.type = "line";
    graph1.valueField = "value";
	graph1.valueAxis = valueAxis1;
    graph1.balloonText = "[[info]]";
    graph1.balloonColor = "#333";
	graph1.lineColorField = "color";
	graph1.lineAlpha = 0;
	graph1.bulletField = "marker";
	graph1.bulletSize = 10;
	graph1.bulletBorderAlpha = 1;
	graph1.bulletBorderThickness = 1;
	graph1.hideBulletsCount = 10000;
	graph1.customBulletField = "customBullet";
	graph1.bulletSizeField = "bulletSize";
	graph1.hidden = false;
    chart.addGraph(graph1);

    // graph 2: empty graph for axis labels on the right
    var graph2 = new AmCharts.AmGraph();
	graph2.id = "g2";
	graph2.valueAxis = valueAxis2;
	graph2.hidden = false;
    chart.addGraph(graph2);

	var chartCursor = new AmCharts.ChartCursor();
    chartCursor.categoryBalloonDateFormat = "YYYY MMM DD, JJ:NN:SS EEE";
    chartCursor.cursorPosition = "mouse";
	chartCursor.cursorColor = '#333';
	chart.chartCursor = chartCursor;

	var chartScrollbar = new AmCharts.ChartScrollbar();
	chartScrollbar.scrollbarHeight = 20;
	chartScrollbar.backgroundAlpha = 0;
	chartScrollbar.selectedBackgroundAlpha = 0.1;
	chartScrollbar.selectedBackgroundColor = "#888888";
	chartScrollbar.graphFillAlpha = 0;
	chartScrollbar.graphLineAlpha = 0.5;
	chartScrollbar.selectedGraphFillAlpha = 0;
	chartScrollbar.selectedGraphLineAlpha = 1;
	chartScrollbar.autoGridCount = true;
	chartScrollbar.color = "#AAAAAA";
	chart.chartScrollbar = chartScrollbar;

	chart.pathToImages = "lib-js/amcharts/images/";
	chart.autoMargins = false;
	chart.marginLeft  = 70;
	chart.marginRight = 70;
	chart.marginBottom = 20;

	//chart.addListener("zoomed", handleZoom);

	chart.guides = [];

	chart.write(divChart);

	return chart;
}


function initializeChartMeasurements(measurements, handleZoom, hasScrollbar) {
    var chart = new AmCharts.AmSerialChart();
    chart.dataProvider = measurements;
    chart.categoryField = "datetime";
    chart.sequencedAnimation = false;
	chart.categoryAxis.minPeriod = "ss";
	chart.categoryAxis.parseDates = true;
	chart.addListener("zoomed", handleZoom);

    // value axes
	var listAxes = [
		makeValueAxis3(listMeasNames[0], 'left', '#000'),
		makeValueAxis3(listMeasNames[0], 'right', '#000')
	];
    chart.addValueAxis(listAxes[0]);
	chart.addValueAxis(listAxes[1]);

    // add two graphs
	for (var indexGraph=0; indexGraph<2; indexGraph++) {
		var graph1 = new AmCharts.AmGraph();
		graph1.id = "graph" + indexGraph;
		graph1.type = "line";
		graph1.valueField = listMeasNames[0];
		graph1.valueAxis = listAxes[indexGraph];
		graph1.balloonText = "[[value]]";
		graph1.lineColor = "#00f";
		graph1.lineAlpha = 1;
		graph1.bullet = "round";
		graph1.bulletSize = 5;
		graph1.bulletBorderAlpha = 1;
		graph1.bulletBorderThickness = 1;
		graph1.hideBulletsCount = 10000;
		graph1.hidden = false;
		chart.addGraph(graph1);
	}

	var chartCursor = new AmCharts.ChartCursor();
	chartCursor.categoryBalloonDateFormat = "YYYY MMM DD, JJ:NN:SS EEE";
	chartCursor.cursorPosition = "mouse";
	chartCursor.animationDuration = 0;
	chartCursor.valueLineBalloonEnabled = false;
	chartCursor.valueLineEnabled = true;
	chartCursor.cursorColor = '#333';
	chart.chartCursor = chartCursor;

	if (hasScrollbar) {
		var chartScrollbar = new AmCharts.ChartScrollbar();
		chartScrollbar.scrollbarHeight = 20;
		chartScrollbar.backgroundAlpha = 0;
		chartScrollbar.selectedBackgroundAlpha = 0.1;
		chartScrollbar.selectedBackgroundColor = "#888888";
		chartScrollbar.graphFillAlpha = 0;
		chartScrollbar.graphLineAlpha = 0.5;
		chartScrollbar.selectedGraphFillAlpha = 0;
		chartScrollbar.selectedGraphLineAlpha = 1;
		chartScrollbar.autoGridCount = true;
		chartScrollbar.color = "#AAAAAA";
		chart.chartScrollbar = chartScrollbar;
	}

	chart.pathToImages = "lib-js/amcharts/images/";
	chart.autoMargins = false;
	chart.marginLeft  = 70;
	chart.marginRight = 70;
	chart.marginBottom = 20;

	//chart.addListener("zoomed", handleZoom);

	chart.guides = [];

	//chart.write("chartMeasurements");

	return chart;
}


function makeReportScanIntervals(listEventLogObjects) {
	console.log('makeReportScanIntervals start');
	//var listEventLogObjects = zz_load_test_logdata();

	var scanBegin = [];
	var scanEnd = [];

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;
		// console.log([i, logdata.length]);

		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_source==='CT_IS') {
				if (record.event_id===493) {
					scanBegin.push(record);
				}
				if (record.event_id===494) {
					scanEnd.push(record);
				}
			}
		}
	}

	if (scanBegin.length !== scanEnd.length) {
		console.log('makeReportScanIntervals: scan begin and end do not match');
		console.log(scanBegin.length, scanEnd.length)
	}

	var timestampScanBegin = [];
	var timestampScanEnd = [];
	var chartData = [];

	for (var i=0; i<scanBegin.length; i++) {
		var t1 = new Date(scanBegin[i].date + 'T' + scanBegin[i].time);
		var t2 = new Date(scanEnd[i].date + 'T' + scanEnd[i].time);
		// console.log(t1,t2);
		timestampScanBegin.push(t1);
		timestampScanEnd.push(t2);

		// @Mode kind@=#MlRot#
		var ret = scanBegin[i].event_text.match(/@Mode kind@=#([^#]+)#/);
		var kind = ret[1].replace('Ml', '');

		var value = 0;
		if (kind==='Topo')		value = 1;
		if (kind==='Spiral')	value = 2;
		if (kind==='Sequence')	value = 3;
		if (kind==='Rot')		value = 4;

		chartData.push({ datetime: t1, scanBegin: value, kind: kind + '<br>start' });
		chartData.push({ datetime: t2, scanBegin: value, kind: kind + '<br>end' });
	}


	var timestampCheckupStart = [];
	var timestampCheckupEnd = [];

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;
		// console.log([i, logdata.length]);

		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_source==='CT_SRV') {
				if (record.event_id===152 && record.event_text.indexOf('Function "Checkup" started') > -1) {
					timestampCheckupStart.push(record.datetime);
				}
				if (record.event_id===153 && record.event_text.indexOf('Function "Checkup" completed') > -1) {
					timestampCheckupEnd.push(record.datetime);
				}
			}
		}
	}
// console.log(timestampCheckupStart);
// console.log(timestampCheckupEnd);

	var patientStart = [];

	for (var i=0; i<listEventLogObjects.length; i++) {
		var logdata = listEventLogObjects[i].logdata;
		// console.log([i, logdata.length]);

		for (var k=0; k<logdata.length; k++) {
			var record = logdata[k];
			if (record.event_id===68 && record.event_source==='CT_CHR') {
				patientStart.push(record.datetime);
			}
		}
	}


	var report = {
		timestampScanBegin		: timestampScanBegin,
		timestampScanEnd		: timestampScanEnd,
		chartData				: chartData,
		timestampCheckupStart	: timestampCheckupStart,
		timestampCheckupEnd		: timestampCheckupEnd,
		patientStart			: patientStart,
	};

	initializeChart(report);


	return report;
}


function makeValueAxis(title, position, color) {
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = title;
	valueAxis2.axisAlpha = 0.15;
	valueAxis2.minimum = 0;
	valueAxis2.maximum = 5;
	valueAxis2.dashLength = 3;
	valueAxis2.position = position;
	valueAxis2.color = color;
	valueAxis2.gridColor = color;
	valueAxis2.titleColor = color;
    valueAxis2.labelFunction = formatValue;
	return valueAxis2;
}

function makeValueAxis2(title, position, color) {
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = title;
	valueAxis2.axisAlpha = 0.3;
	valueAxis2.minimum = 0;
	valueAxis2.maximum = ycoordSystemLevel + 2;
	valueAxis2.dashLength = 0;
	valueAxis2.position = position;
	valueAxis2.color = color;
	valueAxis2.titleColor = color;
	valueAxis2.gridColor = '#eee';
	valueAxis2.gridAlpha = 1;
	valueAxis2.gridCount = 10;
	valueAxis2.autoGridCount = false;
	valueAxis2.labelFunction = labelFunctionBasicEvents;
	return valueAxis2;
}

function makeValueAxis3(title, position, color) {
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = title;
	valueAxis2.axisAlpha = 0.15;
	// valueAxis2.minimum = 0;
	// valueAxis2.maximum = 2;
	valueAxis2.dashLength = 3;
	valueAxis2.position = position;
	valueAxis2.color = color;
	valueAxis2.gridColor = color;
	valueAxis2.titleColor = color;
	return valueAxis2;
}

function initializeChart(report) {
	//console.log('initializeChart start');

	var timestampScanBegin		= report.timestampScanBegin;
	var timestampScanEnd		= report.timestampScanEnd;
	var chartData				= report.chartData;
	var timestampCheckupStart	= report.timestampCheckupStart;
	var timestampCheckupEnd		= report.timestampCheckupEnd;
	var patientStart			= report.patientStart;

	// console.log(chartData);

    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "datetime";
    chart.sequencedAnimation = false;
	chart.categoryAxis.minPeriod = "ss";
	chart.categoryAxis.parseDates = true;

    // value axes
	var valueAxis1 = makeValueAxis('', 'left', '#000');
	var valueAxis2 = makeValueAxis('', 'right', '#000');
    chart.addValueAxis(valueAxis1);
	chart.addValueAxis(valueAxis2);

    // graph 1
    var graph1 = new AmCharts.AmGraph();
	graph1.id = "g1";
	graph1.valueAxis = valueAxis1;
    graph1.valueField = "scanBegin";
    // graph1.balloonText = "[[value]] [[kind]]";
    graph1.balloonText = "[[kind]]";
	graph1.lineColor = "#00aa00";
	graph1.bullet = "triangleDown";
	graph1.hideBulletsCount = 500;
	graph1.bulletBorderThickness = 1;
	graph1.hidden = false;
    chart.addGraph(graph1);

	var chartCursor = new AmCharts.ChartCursor();
    chartCursor.categoryBalloonDateFormat = "MMM DD, JJ:NN:SS EEE";
    chartCursor.cursorPosition = "mouse";
	chart.chartCursor = chartCursor;

	var chartScrollbar = new AmCharts.ChartScrollbar();
	//chartScrollbar.graph = "g1";
	chartScrollbar.scrollbarHeight = 40;
	chartScrollbar.backgroundAlpha = 0;
	chartScrollbar.selectedBackgroundAlpha = 0.1;
	chartScrollbar.selectedBackgroundColor = "#888888";
	chartScrollbar.graphFillAlpha = 0;
	chartScrollbar.graphLineAlpha = 0.5;
	chartScrollbar.selectedGraphFillAlpha = 0;
	chartScrollbar.selectedGraphLineAlpha = 1;
	chartScrollbar.autoGridCount = true;
	chartScrollbar.color = "#AAAAAA";
	chart.chartScrollbar = chartScrollbar;

	chart.pathToImages = "lib-js/amcharts/images/";
	chart.autoMargins = false;
	chart.marginLeft  = 70;
	chart.marginRight = 70;
	chart.marginBottom = 20;

	//chart.addListener("zoomed", handleZoom);

	chart.guides = [];


	for (var i=0; i<timestampCheckupStart.length; i++) {
		var guide = {
			date:	new Date(timestampCheckupStart[i]),
			toDate:	new Date(timestampCheckupEnd[i]),
			color: "#0000cc",
			lineColor: "#0000cc",
			lineAlpha: 0.4,
			fillAlpha: 0.1,
            fillColor: "#0000ff",
			dashLength: 5,
			inside: false,
			labelRotation: 90,
			label: 'Checkup',
			fontSize: 12,
			position: 'left'
		};
		chart.guides.push(guide);
	}


// console.log(timestampScanBegin, timestampScanEnd);

	// if (false) {
	for (var i=0; i<timestampScanBegin.length; i++) {
		var guide = {
			date:	new Date(timestampScanBegin[i]),
			toDate:	new Date(timestampScanEnd[i]),
			color: "#ff0000",
			lineColor: "#00aa00",
			lineAlpha: 0.7,
			fillAlpha: 0.2,
            fillColor: "#00cc00",
			dashLength: 5,
			inside: true,
			labelRotation: 90,
			label: '',
			fontSize: 12
		};
		chart.guides.push(guide);
	}


	for (var i=0; i<patientStart.length; i++) {
		var guide = {
			date:	new Date(patientStart[i]),
			color: "#cc00cc",
			lineColor: "#cc00cc",
			lineAlpha: 0.4,
			dashLength: 5,
			inside: false,
			labelRotation: 90,
			label: 'Patient',
			fontSize: 11,
			position: 'left'
		};
		chart.guides.push(guide);
	}

	chart.write("chartScanIntervals");
}

function formatValue(value, formattedValue, valueAxis){
	if (value===0) return 'unknown';
	if (value===1) return 'Topo';
	if (value===2) return 'Spiral';
	if (value===3) return 'Sequence';
	if (value===4) return 'Rot';
    return '';
}


function initializeChartsForMeasurements(measurements) {
	var idTab = 'tabMeasurements';
	document.getElementById(idTab).style.display = 'inline-block';

	chartMeasurements1 = initializeChartMeasurements(measurements, handleZoom1, true);
	chartMeasurements2 = initializeChartMeasurements(measurements, handleZoom2, false);

	chartBasicEvents.addListener("zoomed", handleZoomBasicEvents);

	var listColors = [
		'#00f',
		'#f00',
		'#0a0',
		'#f0f',
	];

	chartMeasurements1.graphs[0].lineColor = listColors[0];
	chartMeasurements1.graphs[1].lineColor = listColors[1];
	chartMeasurements2.graphs[0].lineColor = listColors[2];
	chartMeasurements2.graphs[1].lineColor = listColors[3];

	var listAxisPropNames = [ 'color', 'gridColor', 'titleColor' ];
	for (var i=0; i<listAxisPropNames.length; i++) {
		var prop = listAxisPropNames[i];
		chartMeasurements1.valueAxes[0][prop] = listColors[0];
		chartMeasurements1.valueAxes[1][prop] = listColors[1];
		chartMeasurements2.valueAxes[0][prop] = listColors[2];
		chartMeasurements2.valueAxes[1][prop] = listColors[3];
	}

	// valueAxis1.color = colorGraph1;
	// valueAxis1.gridColor = colorGraph1;
	// valueAxis1.titleColor = colorGraph1;

	chartMeasurements1.write("chartMeasurements1");
	chartMeasurements2.write("chartMeasurements2");
	document.getElementById('chartMeasurements1').style.backgroundColor = '#fff';
	document.getElementById('chartMeasurements2').style.backgroundColor = '#fff';

	var nParams = 4;
	for (var i=0; i<nParams; i++) {
		var idList = 'ccs_param' + String(i+1);
		var idLabel = 'selection' + String(i+1);
		fillSelectElement(idList, idLabel, listMeasNames);
		//addEmptyOptionToSelectElement(idList, idLabel);
	}

	preselectTubeParameter();

	// var doRefresh = false;
	// selectParam('selection1', 0, chartMeasurements1, doRefresh);
	// selectParam('selection2', 1, chartMeasurements1, doRefresh);
	// selectParam('selection3', 0, chartMeasurements2, doRefresh);
	// selectParam('selection4', 1, chartMeasurements2, doRefresh);
	chartMeasurements1.validateData();
	chartMeasurements2.validateData();

	document.getElementById(idTab).style.display = 'none';
}

function resetSelectElement(id) {
	var x = document.getElementById(id);
	// remove all
	while (x.hasChildNodes()) {
		x.removeChild(x.childNodes[0]);
	}
}

function fillSelectElement(idList, idLabel, listMeasNames) {
	resetSelectElement(idList);
	var x = document.getElementById(idList);
	for (var k=0; k<listMeasNames.length; k++) {
		var c = document.createElement('li');
		var strOnclick = "selectParam('" + idLabel + "', '" + listMeasNames[k] + "', true);";
		c.innerHTML = '<a onclick="' + strOnclick + '">' + listMeasNames[k] + '</a>';
		x.appendChild(c);
	}
}

function addEmptyOptionToSelectElement(idList, idLabel) {
	var measName = '(none)';
	var c = document.createElement('li');
	var strOnclick = "callbackNew('" + idLabel + "', '" + measName + "');";
	c.innerHTML = '<a onclick="' + strOnclick + '">' + measName + '</a>';
	document.getElementById(idList).appendChild(c);
}

function selectOption(id, name) {
	var e = document.getElementById(id);
	for (var i=0; i<e.options.length; i++) {
		if (e.options[i].text == name) {
			e.options.selectedIndex = i;
			break;
		}
	}
}

function selectParam(idSelection, nameMeas, doRefresh) {
	// console.log(nameMeas);
	document.getElementById(idSelection).innerHTML = nameMeas;
	var idxGraph, chart;
	if (idSelection==='selection1') { idxGraph=0; chart=chartMeasurements1; }
	if (idSelection==='selection2') { idxGraph=1; chart=chartMeasurements1; }
	if (idSelection==='selection3') { idxGraph=0; chart=chartMeasurements2; }
	if (idSelection==='selection4') { idxGraph=1; chart=chartMeasurements2; }

	// console.log("selectParam:", "idSelection=", idSelection, "nameMeas=", nameMeas);

	if (nameMeas == "(none)") {
		chart.graphs[idxGraph].hidden = true;
	}
	else {
		chart.graphs[idxGraph].valueField = nameMeas;
		chart.graphs[idxGraph].hidden = false;
		chart.graphs[idxGraph].valueAxis.title = nameMeas + ' [' + HexParserCCS.getUnit(nameMeas) + ']';

		var range = limitsMeas[nameMeas];
		if (range !== undefined) {
			chart.graphs[idxGraph].valueAxis.minimum = range.min;
			chart.graphs[idxGraph].valueAxis.maximum = range.max;
		}
		else {
			chart.graphs[idxGraph].valueAxis.minimum = NaN;
			chart.graphs[idxGraph].valueAxis.maximum = NaN;
		}
	}

	if (doRefresh) {
		// store zoom window because validateData() overwrites it
		var x1 = zoomStartIndexLast;
		var x2 = zoomEndIndexLast;
		var z1 = zoomStartDateLast;
		var z2 = zoomEndDateLast;

		chart.validateData();

		// restore zoom window
		// chart.zoomToIndexes(x1, x2);
		chart.zoomToDates(z1, z2);
	}
}

function handleZoom1(event) {
	var z1 = event.startDate;
	var z2 = event.endDate;
	zoomStartIndexLast = event.startIndex;
	zoomEndIndexLast = event.endIndex;
	zoomStartDateLast = event.startDate;
	zoomEndDateLast = event.endDate;
	chartMeasurements2.zoomToDates(z1, z2);		// sync zoom with chart 2
	chartBasicEvents.zoomToDates(z1, z2);		// sync zoom with chart basic events
	// console.log('z1');
}

function handleZoom2(event) {
	var z1 = event.startDate;
	var z2 = event.endDate;
	zoomStartIndexLast = event.startIndex;
	zoomEndIndexLast = event.endIndex;
	zoomStartDateLast = event.startDate;
	zoomEndDateLast = event.endDate;
	chartMeasurements1.zoomToDates(z1, z2);		// sync zoom with chart 1
	chartBasicEvents.zoomToDates(z1, z2);		// sync zoom with chart basic events
	// console.log('z2');
}

function handleZoomBasicEvents(event) {
	var z1 = event.startDate;
	var z2 = event.endDate;
	zoomStartIndexLast = event.startIndex;
	zoomEndIndexLast = event.endIndex;
	zoomStartDateLast = event.startDate;
	zoomEndDateLast = event.endDate;
	chartMeasurements1.zoomToDates(z1, z2);	
	chartMeasurements2.zoomToDates(z1, z2);	
	// console.log('z3');
}

function isContained(elementToFind, array) {
	var checkFunc = function(element) {
		return element===elementToFind;
	};
	return array.some(checkFunc);
}

function preselectTubeParameter() {
	var preselection = {
		selection1 : 'Air inlet temperature',
		selection2 : 'Air outlet temperature',
		selection3 : 'Water inlet temperature',
		selection4 : 'Water outlet temperature',
	};
	var doRefresh = false;
	for (var idSelection in preselection) {
		var nameMeas = preselection[idSelection];
		if (isContained(nameMeas, listMeasNames)) {
			selectParam(idSelection, nameMeas, doRefresh);
		}
		else {
			selectParam(idSelection, '(none)', doRefresh);
		}
	}
}

function showPleaseWait() {
	// var idDiv = "divPleaseWait";
	// document.getElementById(idDiv).style.display = "block";
	// document.getElementById(idDiv).innerHTML = "Reading measurements. Please wait...";
	showMenubarInfoText("Reading measurements. Please wait...", "#ff0");
}

function hidePleaseWait() {
	// var idDiv = "divPleaseWait";
	// document.getElementById(idDiv).style.display = "none";
	// document.getElementById(idDiv).innerHTML = "";
	showMenubarInfoText("", "#fff");
}

