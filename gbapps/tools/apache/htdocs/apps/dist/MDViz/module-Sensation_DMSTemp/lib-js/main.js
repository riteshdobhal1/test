
var titleStringDefault = "Sensation DMS Temperature";

var temperatureDmsShutdown_degC = 55;
var indicatorValueMin = 0;
var indicatorValueMax = 5;
var switchAutoAdjustParameterLimits = true;

var dmsTempParser;
var dmsTempData;
var fileObj;
var fileReader;
var filename;
var progressElement;
var chart;
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
var colorGraph1 = "#ee0000";
var colorGraph2 = "#0000ff";
var colorGraph3 = "#ff9900";
var colorGraph4 = "#00cccc";
var colorIndicator1 = "#ffdd77";
var scrollbarHeight = 40;
var chartHeight = 400;
// indicators[name] = [...]  array of Date()
var indicators = {};
var guideIndicators = {};

var temperatureDmsShutdown_degF = temperatureDmsShutdown_degC * 1.8 + 32;
var labelShutdownTemperature = 'DMS Shutdown Temperature ' 
	+ String(temperatureDmsShutdown_degC) + ' C = '
	+ String(temperatureDmsShutdown_degF) + ' F';


function handleZoom(event) {
	zoomStartIndexLast = event.startIndex;
	zoomEndIndexLast = event.endIndex;
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
	chart.categoryAxis.minPeriod = "ss";
	chart.categoryAxis.parseDates = true;

    // value axes
	var valueAxis1 = makeValueAxis('DMS Temperature [deg C]', 'left', '#000');
	var valueAxis2 = makeValueAxis('DMS Temperature [deg C]', 'right', '#000');
    chart.addValueAxis(valueAxis1);
	chart.addValueAxis(valueAxis2);

    // graph 1
    var graph1 = new AmCharts.AmGraph();
	graph1.id = "g1";
	graph1.valueAxis = valueAxis1;
    graph1.valueField = "DMS_Temp_1_degC";
    graph1.balloonText = "[[value]]";
	graph1.lineColor = colorGraph1;
	graph1.bullet = "triangleDown";
	graph1.hideBulletsCount = 500;
	graph1.bulletBorderThickness = 1;
	graph1.hidden = false;
    chart.addGraph(graph1);

	// graph 2
	var graph2 = new AmCharts.AmGraph();
	graph2.id = "g2";
	graph2.valueAxis = valueAxis1;
	graph2.valueField = "DMS_Temp_2_degC";
	graph2.balloonText = "[[value]]";
	graph2.lineColor = colorGraph2;
	graph2.bullet = "round";
	graph2.hideBulletsCount = 500;
	graph2.bulletSize = 5;
	graph2.bulletBorderAlpha = 1;
	graph2.bulletColor = "#FFFFFF";
	graph2.useLineColorForBulletBorder = true;
	graph2.hidden = false;
	chart.addGraph(graph2);

	// graph 3
	var graph3 = new AmCharts.AmGraph();
	graph3.id = "g3";
	graph3.valueAxis = valueAxis1;
	graph3.valueField = "DMS_Temp_3_degC";
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

	// graph 4
	var graph4 = new AmCharts.AmGraph();
	graph4.id = "g3";
	graph4.valueAxis = valueAxis2;
	graph4.valueField = "DMS_Temp_3_degC";
	graph4.balloonText = "[[value]]";
	graph4.lineColor = colorGraph4;
	graph4.bullet = "round";
	graph4.hideBulletsCount = 500;
	graph4.bulletSize = 5;
	graph4.bulletBorderAlpha = 1;
	graph4.bulletColor = "#FFFFFF";
	graph4.useLineColorForBulletBorder = true;
	graph4.hidden = false;
	chart.addGraph(graph4);

	var chartCursor = new AmCharts.ChartCursor();
    chartCursor.categoryBalloonDateFormat = "MMM DD, JJ:NN:SS EEE";
    chartCursor.cursorPosition = "mouse";
	chart.chartCursor = chartCursor;

	var chartScrollbar = new AmCharts.ChartScrollbar();
	//chartScrollbar.graph = "g1";
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
		value: temperatureDmsShutdown_degC,
		color: "#ff0000",
		lineColor: "#ff0000",
		lineAlpha: 1,
		dashLength: 5,
		inside: true,
		labelRotation: 90,
		label: labelShutdownTemperature,
		fontSize: 12
	}];

	chart.titles = [{
		text: titleStringDefault,
		bold: true,
		color: "#000"
	}];

    chart.write("divChart1");
}

function showMetadataAll() {
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
		//chart.graphs[idxGraph].valueAxis.title = param;

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

function preselectTubeParameter() {
	if (dmsTempData !== undefined) {
		selectOption('tube_param1', 'DMS_Temp_1_degC');
		selectOption('tube_param2', 'DMS_Temp_2_degC');
		selectOption('tube_param3', 'DMS_Temp_3_degC');
		selectOption('tube_param4', 'DMS_Temp_4_degC');
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

function makeColumnDefinition() {
	columnDef = [];
	columnDef = columnDef.concat(dmsTempParser.columnDef);
}

function makeFullData() {
	var fullData = [];
	if (dmsTempData !== undefined) {
		fullData = dmsTempData.logdata;
	}
	return fullData;
}

function updateChart() {
	if (dmsTempData === undefined) return;

	document.getElementById('divSelectParameters').style.visibility = 'visible';
	document.getElementById('divPlotArea').style.visibility = 'visible';
	document.getElementById('divChart1').style.backgroundColor = '#ffffff';

	showMetadataAll();

	// fill select elements
	fillSelectElement('tube_param1', columnDef);
	fillSelectElement('tube_param2', columnDef);
	fillSelectElement('tube_param3', columnDef);
	fillSelectElement('tube_param4', columnDef);
	addEmptyOptionToSelectElement('tube_param1');
	addEmptyOptionToSelectElement('tube_param2');
	addEmptyOptionToSelectElement('tube_param3');
	addEmptyOptionToSelectElement('tube_param4');

	preselectTubeParameter();

	fullData = makeFullData();
	//console.log(fullData);

	chart.dataProvider = fullData;

	var doRefresh = false;
	selectParam('tube_param1', 0, chart, doRefresh);
	selectParam('tube_param2', 1, chart, doRefresh);
	selectParam('tube_param3', 2, chart, doRefresh);
	selectParam('tube_param4', 3, chart, doRefresh);

	chart.validateData();
	//console.log(chart);
}

function setCallbacksDropzone() {
	var dropzone = document.getElementById('dropzone');
	dropzone.ondragover = function () {
		this.className = 'hover';
		document.getElementById('meta').className = 'metaHover';
		document.getElementById('metaSeparator').className = 'metaSeparatorHover';
		showMessage('', '#afa');
		return false;
	};
	dropzone.ondragend = function () {
		this.className = 'inactive';
		document.getElementById('meta').className = 'meta';
		document.getElementById('metaSeparator').className = 'metaSeparator';
		showMessage('', '#fff');
		return false;
	};
	dropzone.ondragleave = dropzone.ondragend;
	dropzone.ondrop = callbackDmsOnDrop;
}

function callbackButtonConvert() {
	var buttonConvert = document.getElementById('buttonConvert');
	var axisTitle = '';

	if (buttonConvert.value === 'Convert to Fahrenheit') {
		selectOption('tube_param1', 'DMS_Temp_1_degF');
		selectOption('tube_param2', 'DMS_Temp_2_degF');
		selectOption('tube_param3', 'DMS_Temp_3_degF');
		selectOption('tube_param4', 'DMS_Temp_4_degF');
		buttonConvert.value = 'Convert to Celsius';
		axisTitle = 'DMS Temperature [deg F]';
		chart.guides[0].value = temperatureDmsShutdown_degF;
	}
	else {
		selectOption('tube_param1', 'DMS_Temp_1_degC');
		selectOption('tube_param2', 'DMS_Temp_2_degC');
		selectOption('tube_param3', 'DMS_Temp_3_degC');
		selectOption('tube_param4', 'DMS_Temp_4_degC');
		buttonConvert.value = 'Convert to Fahrenheit';
		axisTitle = 'DMS Temperature [deg C]';
		chart.guides[0].value = temperatureDmsShutdown_degC;
	}

	var doRefresh = false;
	selectParam('tube_param1', 0, chart, doRefresh);
	selectParam('tube_param2', 1, chart, doRefresh);
	selectParam('tube_param3', 2, chart, doRefresh);
	selectParam('tube_param4', 3, chart, doRefresh);
	for (var i=0; i<2; i++) chart.valueAxes[i].title = axisTitle;

	chart.validateData();
}


// ------------------------------------------------------------------------
// initialize
// ------------------------------------------------------------------------
function initializeMain() {
	// window height
	var height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

	//document.getElementById('divChart1').style.height = String(chartHeight) + 'px';
	document.getElementById('divChart1').style.height = String(height - 190) + 'px';

	document.getElementById('fileinputDMS').addEventListener(
		'change', callbackDmsFileinput, false);

	dmsTempParser = new SensationDmsTempParser();
	dmsTempData;

	document.getElementById('divPlotArea').style.visibility = 'visible';
	initializeChart();
	document.getElementById('divPlotArea').style.visibility = 'hidden';

	makeColumnDefinition();
	//console.log(columnDef);

	// show version info
	document.getElementById('divInfoVersion').innerHTML
		= 'Version info: MDViz ' + document.title + ', amCharts ' + chart.version;
	document.getElementById('divInfoVersion').style.fontSize = "10";

	setCallbacksDropzone();

	if (0) {
		//document.getElementById('metadataTable').style.display = 'table-cell';
		document.getElementById('divSelectParameters').style.visibility = 'visible';
	}

	// callback for button "Export PNG file"
	document.getElementById('buttonExportPNG').onclick = callbackButtonExportPNG;

	// reset zoom
	zoomStartIndexLast = undefined;
	zoomEndIndexLast = undefined;

	textinputSerial = document.getElementById('textinputSerial');
	textinputSerial.value = titleStringDefault;
	textinputSerial.addEventListener('change', callbackTextinputSerial, false);
	// textinputSerial.onkeyup = callbackTextinputSerial;

	// callback for "Apply title" button
	document.getElementById('buttonApplyTitle').addEventListener('change', callbackTextinputSerial, false);
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
	var dateDMSStart = undefined;
	var dateDMSEnd = undefined;
	if (dmsTempData !== undefined) {
		var m = dmsTempData.metadata;
		dateDMSStart = m.dateStart;
		dateDMSEnd = m.dateEnd;
	}

	var dateStart = dateDMSStart;
	var dateEnd = dateDMSEnd;

	if (chart !== undefined) {
		dateStart = chart.startDate;
		dateEnd = chart.endDate;
	}

	var titleString = "";
	if (dateStart !== undefined) {
		titleString = titleStringDefault
			// + " from " + dateStart.toLocaleDateString()
			// + " to " + dateEnd.toLocaleDateString();
			+ " from " + convertToDateStringISOLocalTimezone(dateStart)
			+ " to " + convertToDateStringISOLocalTimezone(dateEnd);
	}
	else {
		titleString = titleStringDefault;
	}

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

