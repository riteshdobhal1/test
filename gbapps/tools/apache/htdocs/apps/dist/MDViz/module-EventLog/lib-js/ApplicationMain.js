
'use strict';

(function () {

function ApplicationMain() {
	this.listTabObjects = listTabObjects;
	this.logdata = {};
}

var listTabObjects = {
	// idDiv			tab object
	// tabLoad			:	new TabLoad(),
	// //tabWorkflow		:	tabSummary,
	// tabFirmware		:	tabFirmware,
	// tabMeasurements	:	tabMeasurements,
	// tabSystemInfo	:	tabSystemInfo,
};

var tabLoad;
var tabMeasurements;
var tabSystemInfo;
var tabFirmware;

var listTabs = {
	// idDiv			idMenuItem				label
	menubar			: ['menubar',				'menubar' ],
	tabMain			: ['menuItemMain',			'Main menu' ],
	tabLoad			: ['menuItemLoad',			'Load files' ],
	tabSystemInfo	: ['menuItemSystemInfo',	'System info &amp; status' ],
	// tabWorkflow		: ['menuItemWorkflow',		'Workflow' ],
	tabFirmware		: ['menuItemFirmware',		'Firmware' ],
	tabMeasurements	: ['menuItemMeasurements',	'Measurements' ]
};

// var eventLogParser = undefined;
var reportFirmwareVersionCheck = undefined;


var temperatureDmsShutdown_degC = 55;
var indicatorValueMin = 0;
var indicatorValueMax = 5;
var switchAutoAdjustParameterLimits = true;
var fileObj = undefined;
var fileReader = undefined;
var filename;
var progressElement;
var chart = undefined;
var columnDef;
var fullData = [];
var chartData = [];
var listDays = [];
var numScans = [];
var indexDayStart = [];
var indexDayEnd = [];
var stopwatchStartTimestamp;
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

function XX__resetSelectElement(id) {
	console.log("resetSelectElement: id=", id);
	var x = document.getElementById(id);
	console.log("resetSelectElement: x=", x);

	// remove all
	while (x.options.length) {
		x.remove(0);
	}
}

function XX__fillSelectElement(id, columnDef) {
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

function stopwatchStart() {
	stopwatchStartTimestamp = Date.now();
}

function stopwatchEnd() {
	return Date.now() - stopwatchStartTimestamp;
}

function XX__preselectPlotParameters() {
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

	preselectPlotParameters();

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

function resetTabsAll() {
	console.log("resetTabsAll start");
	// tabLoad.reset();
	// listTabObjects["tabLoad"].reset();

	// tabSummary.reset();
	// tabFirmware.reset();
	// tabMeasurements.reset();
	// tabSystemInfo.reset();

	for (var idTab in listTabObjects) {
		// initialize tab
		listTabObjects[idTab].reset();
	}

	// if (logViewerMeasurements !== undefined) logViewerMeasurements.clear();
}



// ------------------------------------------------------------------------
// callbacks
// ------------------------------------------------------------------------

function hideTab(idTab) {
	// document.getElementById(idTab).style.visibility = 'hidden';
	document.getElementById(idTab).style.display = 'none';
}

function showTab(idTab) {
	console.log("showTab: idTab=", idTab);
	hideTabsAll();
	// document.getElementById(idTab).style.visibility = 'visible';
	document.getElementById(idTab).style.display = 'inline-block';
	if (idTab !== "tabMain") {
		// show menubar
		var idMenubar = "menubar";
		document.getElementById(idMenubar).style.display = 'block';
		// set label
		var label = listTabs[idTab][1];
		document.getElementById("menubarTabName").innerHTML = label;
		// show tab
		document.getElementById(idTab).style.display = "inline-block";
		// initialize tab
		// listTabObjects[idTab].initialize();
		// show tab
		document.getElementById(idTab).style.display = "inline-block";
	}
}

function hideTabsAll() {
	for (var idTab in listTabs) {
		// console.log("idTab=",idTab);
		document.getElementById(idTab).style.display = 'none';
	}
}

function callbackMainMenuEntry(event) {
	// console.log("event=", event);
	var id = event.target.id;
	// console.log("id=", id);
	var idTab = id.replace("main", "tab");
	//~ console.log("idTab=", idTab);
	showTab(idTab);
}


var listItemsMainMenu = [
	"mainLoad",
	"mainSystemInfo",
	"mainFirmware",
	"mainMeasurements",
	// "mainWorkflow"
];

function menuActivate(idMenuItem) {
	for (var idTab in listTabs) {
		var id = listTabs[idTab];
		document.getElementById(id).style.backgroundColor = '#fff';
		document.getElementById(id).style.color = '#000';
	}
	document.getElementById(idMenuItem).style.backgroundColor = '#000';
	document.getElementById(idMenuItem).style.color = '#fff';
}

function callbackMenu(idTab) {
	// hideTabsAll();
	// menuActivate(listTabs[idTab]);
	// document.getElementById(idTab).style.display = 'inline-block';
	// console.log(idTab);
	showTab("tabLoad");
	//console.log(window.event.target.innerText);
}

function setCallbacksMainTab() {
	for (var i=0; i<listItemsMainMenu.length; i++) {
		var idMenuItem = listItemsMainMenu[i];
		//~ console.log("idMenuItem=", idMenuItem);
		document.getElementById(idMenuItem).onclick = callbackMainMenuEntry;
	}
	//~ console.log(this.mainObj.callbackMainMenuEntry)
	//~ console.log(this.mainObj)
}

function setCallbacksMenubar() {
	for (var i=0; i<listItemsMainMenu.length; i++) {
		var idMenuItem = listItemsMainMenu[i];
		// console.log("idMenuItem=", idMenuItem);
		var idMenubarItem = idMenuItem.replace("main", "menuItem");
		// console.log("idMenubarItem=", idMenubarItem);
		document.getElementById(idMenubarItem).onclick = callbackMenubarEntry;
	}
	document.getElementById("menuItemMain").onclick = callbackMenubarEntry;
}

function callbackMenubarEntry(event) {
	//~ console.log("event=", event);
	var id = event.target.id;
	console.log("id=", id);
	var idTab = id.replace("menuItem", "tab");
	// console.log("idTab=", idTab);
	showTab(idTab);
}

function showMenubarInfoText(text, bgcolor) {
	var id = "menubarInfoText";
	document.getElementById(id).innerHTML = text;
	document.getElementById(id).style.backgroundColor = bgcolor;
}

ApplicationMain.prototype.showMenubarInfoText = showMenubarInfoText;

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

ApplicationMain.prototype.update = function() {
	console.log("ApplicationMain: update begin");
	showPleaseWait();

	// console.log(85657, "logdata=", this.logdata)

	tabMeasurements.update(this.logdata);
	tabFirmware.update(this.logdata);
	tabSystemInfo.update(this.logdata);

	hidePleaseWait();

	// automatically go to another tab
	showTab("tabMeasurements");

	console.log("ApplicationMain: update end");
}

ApplicationMain.prototype.showTab = showTab;
ApplicationMain.prototype.resetTabsAll = resetTabsAll;

// ------------------------------------------------------------------------
// initialize
// ------------------------------------------------------------------------
ApplicationMain.prototype.run = function() {

	// eventLogParser = new DefinitionEventLogParser();
	// var dmsTempData;

	//document.getElementById('divPlotArea').style.visibility = 'visible';
	//initializeChart();
	//document.getElementById('divPlotArea').style.visibility = 'hidden';

	makeColumnDefinition();
	//console.log(columnDef);

	// loadStatus = document.getElementById('loadStatus');

	// callbackMenu('tabLoad');
	//callbackMenu('tabFirmware');
	//document.getElementById('fileinputDMS').addEventListener('change', callbackDmsFileinput, false);

	setCallbacksMainTab();
	setCallbacksMenubar();

	tabLoad = new TabLoad(this);
	tabMeasurements = new TabMeasurements(this);
	tabSystemInfo = new TabSystemInfo(this);
	tabFirmware = new TabFirmware(this);

	listTabObjects = {
		// idDiv			tab object
		tabLoad			:	tabLoad,
		tabFirmware		:	tabFirmware,
		tabMeasurements	:	tabMeasurements,
		tabSystemInfo	:	tabSystemInfo,
		//tabWorkflow	:	tabSummary,			// not used
	};


	for (var idTab in listTabObjects) {
		// initialize tab
		listTabObjects[idTab].initialize();
	}

	showTab("tabMain");
	// showTab("tabLoad");
	// showTab("tabWorkflow");
	// showTab("tabFirmware");
	// showTab("tabMeasurements");
}

window.ApplicationMain = ApplicationMain;

}())
