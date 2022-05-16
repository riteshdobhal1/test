
var titleStringDefault = "Sensation Temperature";

var indicatorValueMin = 0;
var indicatorValueMax = 5;
var switchAutoAdjustParameterLimits = true;

var gantryTempParser;
var waterTempParser;
var dmsTempParser;
var gantryTempData;
var waterTempData;
var dmsTempData;
var fileObj;
var fileReader;
var filename;
var progressElement;
var chart;
var chart2;
var columnDef;
var fullData = [];
var chartData = [];
var listDays = [];
var numScans = [];
var indexDayStart = [];
var indexDayEnd = [];
var stopwatchStartTimestamp;
var zoomStartIndexLast;
var zoomEndIndexLast;
var colorGraph1 = "#cc0000";
var colorGraph2 = "#0000ff";
var colorGraph3 = "#00aa00";
var colorGraph4 = "#ff00ff";
var colorIndicator1 = "#ffdd77";
var scrollbarHeight = 20;
var chartHeight = 400;
var hideBulletsCount = 200;
// indicators[name] = [...]  array of Date()
var indicators = {};
var guideIndicators = {};

function handleZoom(event) {
	var z1 = event.startDate;
	var z2 = event.endDate;
	zoomStartIndexLast = event.startIndex;
	zoomEndIndexLast = event.endIndex;
	chart2.zoomToDates(z1, z2);		// sync zoom with chart 2
	//showMessage(zoomStartIndexLast + '-' + zoomEndIndexLast);
	// console.log("handleZoom");
}

function handleZoom2(event) {
	var z1 = event.startDate;
	var z2 = event.endDate;
	zoomStartIndexLast = event.startIndex;
	zoomEndIndexLast = event.endIndex;
	chart.zoomToDates(z1, z2);		// sync zoom with chart 1
	//showMessage(zoomStartIndexLast + '-' + zoomEndIndexLast);
	// console.log("handleZoom2");
}

function makeValueAxis(title, position, color) {
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = title;
	valueAxis2.axisAlpha = 0.15;
	valueAxis2.minimum = 0;
	valueAxis2.dashLength = 3;
	valueAxis2.position = position;
	valueAxis2.color = color;
	valueAxis2.gridColor = color;
	valueAxis2.titleColor = color;
	return valueAxis2;
}

function initializeChart() {
	//console.log('initializeChart start');
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "datetime";
    chart.sequencedAnimation = false;
	chart.categoryAxis.minPeriod = "fff";
	chart.categoryAxis.parseDates = true;

    // value axes
	var valueAxis1 = makeValueAxis('v_ax_1', 'left', colorGraph1);
	var valueAxis2 = makeValueAxis('v_ax_2', 'right', colorGraph2);
	// var valueAxis3 = makeValueAxis('v_ax_3', 'right', colorGraph3);
	// valueAxis3.offset = 60;
    chart.addValueAxis(valueAxis1);
	chart.addValueAxis(valueAxis2);
	// chart.addValueAxis(valueAxis3);

    // graph 1
    var graph1 = new AmCharts.AmGraph();
	graph1.id = "g1";
	graph1.valueAxis = valueAxis1;
    graph1.valueField = "Gantry_Temp_degC";
    graph1.balloonText = "[[value]]";
	graph1.lineColor = colorGraph1;
	graph1.bullet = "triangleDown";
	graph1.hideBulletsCount = hideBulletsCount;
	graph1.bulletBorderThickness = 1;
	graph1.hidden = false;
    chart.addGraph(graph1);

	// graph 2
	var graph2 = new AmCharts.AmGraph();
	graph2.id = "g2";
	graph2.valueAxis = valueAxis2;
	graph2.valueField = "Primary_Water_Temp_degC";
	graph2.balloonText = "[[value]]";
	graph2.lineColor = colorGraph2;
	graph2.bullet = "round";
	graph2.hideBulletsCount = hideBulletsCount;
	graph2.bulletSize = 5;
	graph2.bulletBorderAlpha = 1;
	graph2.bulletColor = "#FFFFFF";
	graph2.useLineColorForBulletBorder = true;
	graph2.hidden = false;
	chart.addGraph(graph2);

	// graph 3
/*
	var graph3 = new AmCharts.AmGraph();
	graph3.id = "g3";
	graph3.valueAxis = valueAxis3;
	graph3.valueField = "Secondary_Water_Temp_degC";
	graph3.balloonText = "[[value]]";
	graph3.lineColor = colorGraph3;
	graph3.bullet = "round";
	graph3.hideBulletsCount = 500;
	graph3.bulletSize = 5;
	graph3.bulletBorderAlpha = 1;
	graph3.bulletColor = "#FFFFFF";
	graph3.useLineColorForBulletBorder = true;
	graph3.hidden = false;
	chart.addGraph(graph3);
*/

	var chartCursor = new AmCharts.ChartCursor();
    chartCursor.categoryBalloonDateFormat = "YYYY MMM DD, JJ:NN:SS.fff EEE";
    chartCursor.cursorPosition = "mouse";
	chartCursor.cursorColor = '#333';
	chart.chartCursor = chartCursor;

	var chartScrollbar = new AmCharts.ChartScrollbar();
	// chartScrollbar.graph = "g1";
	chartScrollbar.scrollbarHeight = scrollbarHeight;
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

	chart.addListener("zoomed", handleZoom);

	chart.guides = [{
		value: 35,
		lineColor: "#ff0000",
		lineAlpha: 1,
		dashLength: 5,
		inside: true,
		labelRotation: 90,
		label: "Gantry Shutdown Temperature 35 degC",
		fontSize: 12,
		// balloonText: "Gantry Shutdown Temperature 35 degC",
	}];

	chart.titles = [{
		text: titleStringDefault,
		bold: true,
		color: "#000"
	}];

    chart.write("divChart1");
}

function initializeChart2() {
	// console.log('initializeChart2 start');
    chart2 = new AmCharts.AmSerialChart();
    chart2.dataProvider = chartData;
    chart2.categoryField = "datetime";
    chart2.sequencedAnimation = false;
	chart2.categoryAxis.minPeriod = "fff";
	chart2.categoryAxis.parseDates = true;

    // value axes
	var valueAxis1 = makeValueAxis('v_ax_1', 'left', colorGraph3);
	var valueAxis2 = makeValueAxis('v_ax_2', 'right', colorGraph4);
    chart2.addValueAxis(valueAxis1);
	chart2.addValueAxis(valueAxis2);

    // graph 1
    var graph1 = new AmCharts.AmGraph();
	graph1.id = "g1";
	graph1.valueAxis = valueAxis1;
    graph1.valueField = "Gantry_Temp1_degC";
    graph1.balloonText = "[[value]]";
	graph1.lineColor = colorGraph3;
	graph1.bullet = "triangleDown";
	graph1.hideBulletsCount = hideBulletsCount;
	graph1.bulletBorderThickness = 1;
	graph1.hidden = false;
    chart2.addGraph(graph1);

	// graph 2
	var graph2 = new AmCharts.AmGraph();
	graph2.id = "g2";
	graph2.valueAxis = valueAxis2;
	graph2.valueField = "Primary_Water_Temp_degC";
	graph2.balloonText = "[[value]]";
	graph2.lineColor = colorGraph4;
	graph2.bullet = "round";
	graph2.hideBulletsCount = hideBulletsCount;
	graph2.bulletSize = 5;
	graph2.bulletBorderAlpha = 1;
	graph2.bulletColor = "#FFFFFF";
	graph2.useLineColorForBulletBorder = true;
	graph2.hidden = false;
	chart2.addGraph(graph2);

	// graph 3
/*
	var graph3 = new AmCharts.AmGraph();
	graph3.id = "g3";
	graph3.valueAxis = valueAxis2;
	graph3.valueField = "Secondary_Water_Temp_degC";
	graph3.balloonText = "[[value]]";
	graph3.lineColor = colorGraph3;
	graph3.bullet = "round";
	graph3.hideBulletsCount = hideBulletsCount;
	graph3.bulletSize = 5;
	graph3.bulletBorderAlpha = 1;
	graph3.bulletColor = "#FFFFFF";
	graph3.useLineColorForBulletBorder = true;
	graph3.hidden = false;
	chart2.addGraph(graph3);
*/

	var chartCursor = new AmCharts.ChartCursor();
    chartCursor.categoryBalloonDateFormat = "YYYY MMM DD, JJ:NN:SS.fff EEE";
    chartCursor.cursorPosition = "mouse";
	chartCursor.cursorColor = '#333';
	chart2.chartCursor = chartCursor;

	var chartScrollbar = new AmCharts.ChartScrollbar();
	// chartScrollbar.graph = "g1";
	chartScrollbar.scrollbarHeight = scrollbarHeight;
	chartScrollbar.backgroundAlpha = 0;
	chartScrollbar.selectedBackgroundAlpha = 0.1;
	chartScrollbar.selectedBackgroundColor = "#888888";
	chartScrollbar.graphFillAlpha = 0;
	chartScrollbar.graphLineAlpha = 0.5;
	chartScrollbar.selectedGraphFillAlpha = 0;
	chartScrollbar.selectedGraphLineAlpha = 1;
	chartScrollbar.autoGridCount = true;
	chartScrollbar.color = "#AAAAAA";
	chart2.chartScrollbar = chartScrollbar;

	chart2.pathToImages = "lib-js/amcharts/images/";
	chart2.autoMargins = false;
	chart2.marginLeft  = 70;
	chart2.marginRight = 70;
	chart2.marginBottom = 20;

	chart2.addListener("zoomed", handleZoom2);

	// chart2.guides = [{
		// value: 35,
		// lineColor: "#ff0000",
		// lineAlpha: 1,
		// dashLength: 5,
		// inside: true,
		// labelRotation: 90,
		// label: "Gantry Shutdown Temperature",
		// fontSize: 12
	// }];

/*
	chart2.titles = [{
		text: "Slim Line Temperature",
		bold: true,
		color: "#000"
	}];
*/
    chart2.write("divChart2");
}

function showMetadataAll() {
	if (gantryTempData !== undefined) {
		var m = gantryTempData.metadata;
		document.getElementById('gantryFilename').innerHTML = m.filename;
		document.getElementById('gantryDateStart').innerHTML = m.dateStart;
		document.getElementById('gantryDateEnd').innerHTML = m.dateEnd;
		document.getElementById('gantryNumMeas').innerHTML = m.numMeas;	
	}
	if (waterTempData !== undefined) {
		var m = waterTempData.metadata;
		document.getElementById('waterFilename').innerHTML = m.filename;
		document.getElementById('waterDateStart').innerHTML = m.dateStart;
		document.getElementById('waterDateEnd').innerHTML = m.dateEnd;
		document.getElementById('waterNumMeas').innerHTML = m.numMeas;	
	}
	if (dmsTempData !== undefined) {
		var m = dmsTempData.metadata;
		document.getElementById('dmsFilename').innerHTML = m.filename;
		document.getElementById('dmsDateStart').innerHTML = m.dateStart;
		document.getElementById('dmsDateEnd').innerHTML = m.dateEnd;
		document.getElementById('dmsNumMeas').innerHTML = m.numMeas;	
	}
}

function showMessage(text, bgcolor) {
	var x = document.getElementById('divMessage');
	x.innerHTML = text;
	x.style.backgroundColor = bgcolor;
} 

function resetSelectElement(id) {
	var x = document.getElementById(id);

	// remove all
	while (x.options.length) {
		x.remove(0);
	}
}

function resetMetadata() {
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
	for (var k=0; k<keys.length; k++) {
		document.getElementById(keys[k]).innerHTML = '';
	}

	var fieldScanSecs = document.getElementById('scanSecs');
	var labelScanSecs = document.getElementById('labelScanSecs');
	fieldScanSecs.style.backgroundColor = '#eeeeee';
	fieldScanSecs.style.color = 'black';
	labelScanSecs.style.backgroundColor = '#eeeeee';
	labelScanSecs.style.color = 'black';
}

function fillSelectElement(id, columnDef) {
	resetSelectElement(id);

	var x = document.getElementById(id);

	for (var k=0; k<columnDef.length; k++) {
		if (columnDef[k].plot==1) {
			var c = document.createElement("option");
			c.text = columnDef[k].id;
			x.options.add(c);
		}
	}
	x.disabled = false;
}

function addEmptyOptionToSelectElement(id) {
	var x = document.getElementById(id);
	var c = document.createElement("option");
	c.text = '(none)';
	c.selected = true;
	x.options.add(c, 0);
}

function getKeys(struct) {
	var keys = [];
	for (var k in struct) {
		keys.push(k);
	}
	return keys;
}

function getKeyValuePairs(struct) {
	var pairs = [];
	for (var k in struct) {
		pairs.push(k + '=' + struct[k]);
	}
	return pairs;
}

// update min/max values for parameters based on loaded data
function updateParameterLimits() {
	for (var i=0; i<fullData.length; i++) {
		var record = fullData[i];
		for (var k=0; k<thFormat.columnDef.length; k++) {
			if (thFormat.columnDef[k].plot==1) {
				var colName = thFormat.columnDef[k].id;
				var val = record[colName];
				// update min-value
				if (val < thFormat.columnDef[k].min) { thFormat.columnDef[k].min = val; }
				// update max-value
				if (val > thFormat.columnDef[k].max) { thFormat.columnDef[k].max = val; }
			}
		}
	}
}

function getColumnIndex(columnDef, id) {
	var idxColumn = -1;
	for (var k=0; k<columnDef.length; k++) {
		if (columnDef[k].id == id) {
			idxColumn = k;
			break;
		}
	}
	return idxColumn;
}

function selectParam(idSelectBox, idxGraph, chart, doRefresh) {
	var e = document.getElementById(idSelectBox);
	var param = e.options[e.selectedIndex].value;

	if (param == "(none)") {
		chart.graphs[idxGraph].hidden = true;
	}
	else {
		chart.graphs[idxGraph].valueField = param;
		chart.graphs[idxGraph].hidden = false;
		chart.graphs[idxGraph].valueAxis.title = param;

		var idxColumn = getColumnIndex(columnDef, param);
		//showMessage(param + "--" + idxColumn, "#ffff00");
		chart.graphs[idxGraph].valueAxis.minimum = columnDef[idxColumn].min;
		chart.graphs[idxGraph].valueAxis.maximum = columnDef[idxColumn].max;
	}

	if (doRefresh) {
		// store zoom window because validateData() overwrites it
		var z1 = zoomStartIndexLast;
		var z2 = zoomEndIndexLast;

		chart.validateData();

		// restore zoom window
		chart.zoomToIndexes(z1, z2);
	}
}

function stopwatchStart() {
	stopwatchStartTimestamp = Date.now();
}

function stopwatchEnd() {
	return Date.now() - stopwatchStartTimestamp;
}

function preselectPlotParameters() {
	if (gantryTempData !== undefined) {
		selectOption('tube_param1', 'Gantry_Temp_degC');
	}
	if (waterTempData !== undefined) {
		selectOption('tube_param2', 'Primary_Water_Temp_degC');
		// selectOption('tube_param3', 'Secondary_Water_Temp_degC');
	}
	if (dmsTempData !== undefined) {
		// selectOption('tube_param1', 'DMS_Temp_1_degC');
		// selectOption('tube_param2', 'DMS_Temp_2_degC');
		// selectOption('tube_param3', 'DMS_Temp_3_degC');
		// selectOption('tube_param4', 'DMS_Temp_4_degC');
		selectOption('tube_param3', 'DMS_Temp_1_degC');
	}
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

function convertToJointFormat(logdata) {
	var jointData = [];
	for (var i=0; i<logdata.length; i++) {
		var record = logdata[i];
		var recordNew = {
			datetime: NaN,
			Gantry_Temp_degC: NaN,
			Primary_Water_Temp_degC: NaN,
			Secondary_Water_Temp_degC: NaN
		};
		for (var k in record) {
			recordNew[k] = record[k];
		}
		jointData.push(recordNew);
	}
	return jointData;
}

function makeColumnDefinition() {
	columnDef = [];
	columnDef = columnDef.concat(gantryTempParser.columnDef);
	columnDef = columnDef.concat(waterTempParser.columnDef.slice(1,3));
	columnDef = columnDef.concat(dmsTempParser.columnDef.slice(1,9));
}

function makeFullData() {
	var fullData = [];
	if (gantryTempData !== undefined) {
		var temp = convertToJointFormat(gantryTempData.logdata);
		fullData = fullData.concat(temp);
	}
	if (waterTempData !== undefined) {
		var temp = convertToJointFormat(waterTempData.logdata);
		fullData = fullData.concat(temp);
	}
	if (dmsTempData !== undefined) {
		var temp = convertToJointFormat(dmsTempData.logdata);
		fullData = fullData.concat(temp);
	}

	// sort
	var sortFunc = function(a, b) {
		return a.datetime - b.datetime;
	};
	fullData.sort(sortFunc);
	return fullData;
}

function updateChart() {
	if (
		gantryTempData === undefined 
		&& waterTempData === undefined 
		&& dmsTempData === undefined
	) return;

	document.getElementById('divSelectParameters').style.visibility = 'visible';
	document.getElementById('divPlotArea').style.visibility = 'visible';
	document.getElementById('divChart1').style.backgroundColor = '#ffffff';
	document.getElementById('divChart2').style.backgroundColor = '#ffffff';

	showMetadataAll();

	// setTitleString();

	// fill select elements
	fillSelectElement('tube_param1', columnDef);
	fillSelectElement('tube_param2', columnDef);
	fillSelectElement('tube_param3', columnDef);
	fillSelectElement('tube_param4', columnDef);
	addEmptyOptionToSelectElement('tube_param1');
	addEmptyOptionToSelectElement('tube_param2');
	addEmptyOptionToSelectElement('tube_param3');
	addEmptyOptionToSelectElement('tube_param4');

	preselectPlotParameters();

	fullData = makeFullData();

	// merge duplicate timestamps
	fullData = mergeRecordsWithDuplicateTimestamps(fullData);

	//console.log(fullData);

	chart.dataProvider = fullData;
	chart2.dataProvider = fullData;

	// console.log("25346436", fullData[0])
	// console.log("25346436", fullData[0].datetime)
	// console.log("25346436", fullData[0].datetime.getMilliseconds())

	var doRefresh = false;
	selectParam('tube_param1', 0, chart, doRefresh);
	selectParam('tube_param2', 1, chart, doRefresh);
	selectParam('tube_param3', 0, chart2, doRefresh);
	selectParam('tube_param4', 1, chart2, doRefresh);

	chart.validateData();
	chart2.validateData();
	//console.log(chart);
}

function roundTimestampToSeconds(d) {
	return new Date(Math.round(Number(d) * 1e-3) * 1e3);
}

function TEST_roundTimestampToSeconds() {
	console.log('TEST_roundTimestampToSeconds begin');
	var d = new Date('2015-05-22T06:12:57.937');
	console.log(d);
	console.log(Number(d));
	console.log(roundTimestampToSeconds(d));
	console.log('TEST_roundTimestampToSeconds end');
}
//TEST_roundTimestampToSeconds();

function mergeNumbers(x, y) {
	if (isNaN(x)) {
		if (isNaN(y)) {
			// both x and y are NaN's
			return NaN;
		}
		else {
			return y;
		}
	}
	else {
		if (isNaN(y)) {
			return x;
		}
		else {
			// both x and y are numbers
			console.log('mergeNumbers: averaging ' + x + ' and ' + y);
			return (x+y)*0.5;
		}
	}
}

function mergeRecords(r1, r2) {
	var ret = {
		datetime					: r1.datetime,
		Gantry_Temp_degC			: mergeNumbers(r1.Gantry_Temp_degC,				r2.Gantry_Temp_degC),
		Primary_Water_Temp_degC		: mergeNumbers(r1.Primary_Water_Temp_degC,		r2.Primary_Water_Temp_degC),
		Secondary_Water_Temp_degC	: mergeNumbers(r1.Secondary_Water_Temp_degC,	r2.Secondary_Water_Temp_degC)
	};
	return ret;
}

function mergeRecordsWithDuplicateTimestamps(fullData) {
	// round timestamps to seconds
	/*
	for (var i=0; i<fullData.length; i++) {
		fullData[i].datetime = roundTimestampToSeconds(fullData[i].datetime);
	}
	*/

	var processed = [];
	for (var i=0; i<fullData.length; i++) processed.push(false);

	var merged = [];
	for (var i=0; i<fullData.length; i++) {
		if (!processed[i]) {
			if (i == fullData.length-1) {
				// last element
				merged.push(fullData[i]);
				processed[i] = true;
			}
			else {
				var ti = fullData[i].datetime;
				var tp = fullData[i+1].datetime;
				var diff = Number(ti) - Number(tp);
				//console.log(diff);
				if (diff != 0) {
					//console.log('timestamps differ');
					merged.push(fullData[i]);
					processed[i] = true;
				}
				else {
					// identical timestamp
					var m = mergeRecords(fullData[i], fullData[i+1]);
					//console.log('merged result:');
					//console.log(m);
					merged.push(m);
					processed[i] = true;
					processed[i+1] = true;
				}
			}
		}
	}

	return merged;
}

function TEST_mergeRecordsWithDuplicateTimestamps() {
	console.log('TEST_mergeRecordsWithDuplicateTimestamps begin');
	var fullDataOrig = [
		// regular merge
		{ datetime : new Date('2015-05-22T06:12:57.937'), Gantry_Temp_degC: 33, Primary_Water_Temp_degC: NaN, Secondary_Water_Temp_degC: NaN },
		{ datetime : new Date('2015-05-22T06:12:57.937'), Gantry_Temp_degC: NaN, Primary_Water_Temp_degC: 11, Secondary_Water_Temp_degC: 22 },
		// don't change
		{ datetime : new Date('2015-07-11T00:00:00.888'), Gantry_Temp_degC: -11, Primary_Water_Temp_degC: -22, Secondary_Water_Temp_degC: -33 },
		// merge with averaging
		{ datetime : new Date('2015-10-22T21:44:33.888'), Gantry_Temp_degC: 30, Primary_Water_Temp_degC: 10, Secondary_Water_Temp_degC: 20 },
		{ datetime : new Date('2015-10-22T21:44:33.888'), Gantry_Temp_degC: 40, Primary_Water_Temp_degC: 20, Secondary_Water_Temp_degC: 30 },
	];
	console.log(fullDataOrig.length);
	console.log(fullDataOrig);
	var fullDataCleaned = mergeRecordsWithDuplicateTimestamps(fullDataOrig);
	console.log(fullDataCleaned.length);
	console.log(fullDataCleaned);
	if (fullDataCleaned.length != 3) throw 'TEST_mergeRecordsWithDuplicateTimestamps FAILED';
	console.log('TEST_mergeRecordsWithDuplicateTimestamps end');
}
//TEST_mergeRecordsWithDuplicateTimestamps();


// ------------------------------------------------------------------------
// initialize
// ------------------------------------------------------------------------
function initializeMain() {
	// window height
	var height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

	//document.getElementById('divChart1').style.height = String(chartHeight) + 'px';
	const heightHeader = 240;
	var chartHeight = Math.floor((height - heightHeader)/ 2);
	const delta = 15;
	var chartHeight1 = chartHeight + delta;
	var chartHeight2 = chartHeight - delta;
	document.getElementById('divChart1').style.height = String(chartHeight1) + 'px';
	document.getElementById('divChart2').style.height = String(chartHeight2) + 'px';

	document.getElementById('fileinputWater').addEventListener(
		'change', callbackWaterFileinput, false);
	document.getElementById('fileinputGantry').addEventListener(
		'change', callbackGantryFileinput, false);
	document.getElementById('fileinputDMS').addEventListener(
		'change', callbackDmsFileinput, false);

	gantryTempParser = new SensationGantryTempParser();
	waterTempParser = new SensationWaterTempParser();
	dmsTempParser = new SensationDmsTempParser();

	document.getElementById('divPlotArea').style.visibility = 'visible';
	initializeChart();
	initializeChart2();
	document.getElementById('divPlotArea').style.visibility = 'hidden';

	makeColumnDefinition();
	//console.log(columnDef);

	// show version info
	document.getElementById('divInfoVersion').innerHTML
		= 'Version info: MDViz ' + document.title + ', amCharts ' + chart.version;
	document.getElementById('divInfoVersion').style.fontSize = "10";

	if (0) {
		//document.getElementById('metadataTable').style.display = 'table-cell';
		document.getElementById('divSelectParameters').style.visibility = 'visible';
	}

	// callback for button "Export PNG file"
	if (document.getElementById('buttonExportPNG')) {
		document.getElementById('buttonExportPNG').onclick = callbackButtonExportPNG;
	}

	// reset zoom
	zoomStartIndexLast = undefined;
	zoomEndIndexLast = undefined;

	textinputSerial = document.getElementById('textinputSerial');
	textinputSerial.value = titleStringDefault;
	textinputSerial.addEventListener('change', callbackTextinputSerial, false);
	// textinputSerial.onkeyup = callbackTextinputSerial;

	// callback for "Apply title" button
	document.getElementById('buttonApplyTitle').addEventListener('change', callbackTextinputSerial, false);


	document.getElementById('divSelectParameters').style.visibility = "hidden";
	// document.getElementById('divSelectParameters').style.visibility = 'visible';
}

function removeBuiltInExportButtons() {
	var listButtons = document.getElementsByClassName("amExportButton");
	// console.log("n_buttons_before=", listButtons.length);
	for (var i=listButtons.length-1; i>=0; i--) {
		var b = listButtons[i];
		b.remove();
	}
	// console.log("n_buttons_after =", listButtons.length);
}

function callbackButtonExportPNG() {
	var exp;
	if (chart.AmExport === undefined) {
		exp = new AmCharts.AmExport(chart);
		exp.init();
	}
	else {
		exp = chart.AmExport;
	}

	var nameOutput = chart.titles[0].text;
	exp.cfg.menuItemOutput.fileName = nameOutput;
	exp.output({
		format: 'png',
		output: 'save'
	});

	// built-in export button is shown automatically -> remove it
	removeBuiltInExportButtons();
}

function pad(num) {
	var size = 2;
	var s = "00" + num;
	return s.substr(s.length-size);
}

function callbackTextinputSerial(event) {
	setTitleString();
	var str = chart.titles[0].text;
	console.log("callbackTextinputSerial: str= >>" + str + "<<");
}

function setTitleStringSub() {
	// remove blanks
	titleUser = removeBlanksAtBeginningAndEnd(textinputSerial.value);
	// console.log("titleUser = >>" + titleUser + "<<");
	if (titleUser.length > 0) {
		titleString = titleUser;
	}
	else {
		titleString = titleStringDefault;
	}
	textinputSerial.value = titleString;

	chart.titles[0].text = titleString;
}

function setTitleString() {
	setTitleStringSub();
	chart.validateNow();

	// built-in export button is shown automatically -> remove it
	removeBuiltInExportButtons();

	showMessage("", "#ffffff");
}

function convertToDateStringISOLocalTimezone(d) {
	var s = d.getFullYear() 
		+ '-' + pad(d.getMonth()+1) 
		+ '-' + pad(d.getDate());
	return s;
}

function removeBlanksAtBeginningAndEnd(strInput) {
	var strOutput = strInput.replace(/^\s+/, "");
	// remove blanks at end
	strOutput = strOutput.replace(/\s+$/, "");
	return strOutput;
}

