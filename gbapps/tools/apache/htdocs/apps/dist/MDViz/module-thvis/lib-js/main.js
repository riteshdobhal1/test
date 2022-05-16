
var colNameAbortsAll = 'Aborts';
var switchAutoAdjustParameterLimits = false;
var switchCustomBalloon = true;
var hideBulletsCount = 700;
var indicatorValueMin = 0;
var indicatorValueMax = 5;
var thFormat;
var fileObj;
var fileReader;
var progressElement;
var serial = "unknown serial";
var chart;
var fullData = [];
var chartData = [];
var listDays = [];
var numScans = [];
var indexDayStart = [];
var indexDayEnd = [];
var stopwatchStartTimestamp;
var zoomStartDate = [];
var zoomEndDate = [];
var zoomStartIndexLast;
var zoomEndIndexLast;
var colorGraph1 = "#ff0000";
var colorGraph2 = "#0000ff";
var colorGraph3 = "#00aa00";
var colorGraph4 = "#ff00ff";
var colorIndicator1 = "#ffdd77";
var scrollbarHeight = 40;
var chartHeight = 400;
// indicators[name] = [...]  array of Date()
var indicators = {};
var guideIndicators = {};
var reportAborts;

function balloonFunction(graphDataItem, graph) {
	var nPointsShown = zoomEndIndexLast - zoomStartIndexLast + 1;
	if (nPointsShown === undefined) return "";
	if (nPointsShown > hideBulletsCount) return "";

	// console.log(graphDataItem);
	var record = graphDataItem.dataContext;
	var indexAbort = thFormat.indexAbort;
	var abortReason = record[indexAbort];
	var kind = record['kind'];
	var value = graphDataItem.values.value;
	var str = '';
	if (isRelevantAbortReason(abortReason)) {
		if (thFormat.indexAbortController != undefined) {
			abortReason = record[thFormat.indexAbortController];
		}
		str = '<span style="background-color:yellow;">' + value + ' : ' 
			+ kind + ' : abort ' + abortReason + '</span>';
	}
	else {
		str = value + ' : ' + kind;
	}
	return str;
}

function initializeChart() {
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "datetime";
    chart.sequencedAnimation = false;
	chart.categoryAxis.minPeriod = "ss";
	chart.categoryAxis.parseDates = true;
	chart.addListener("zoomed", handleZoom);

    // value axis 1
    var valueAxis1 = new AmCharts.ValueAxis();
	valueAxis1.title = "v_ax_1";
    valueAxis1.axisAlpha = 0.15;
    valueAxis1.minimum = 0;
    valueAxis1.dashLength = 3;
	valueAxis1.color = colorGraph1;
	valueAxis1.gridColor = colorGraph1;
	valueAxis1.titleColor = colorGraph1;
    chart.addValueAxis(valueAxis1);
    // graph 1
    var graph1 = new AmCharts.AmGraph();
	graph1.id = "g1";
	graph1.valueAxis = valueAxis1;
    graph1.valueField = "oil_pressure";
    //graph1.fillAlphas = 0.5;
    graph1.balloonText = "[[value]] : [[kind]]";
	graph1.lineColor = colorGraph1;
	graph1.bulletSize = 5;
	graph1.bullet = "round";
	graph1.bulletBorderAlpha = 1;
	graph1.bulletColor = "#FFFFFF";
	graph1.hideBulletsCount = hideBulletsCount;
	graph1.useLineColorForBulletBorder = true;
	if (switchCustomBalloon) graph1.balloonFunction = balloonFunction;
    chart.addGraph(graph1);

	// value axis 2
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = "v_ax_2";
	valueAxis2.axisAlpha = 0.15;
	valueAxis2.minimum = 0;
	valueAxis2.dashLength = 3;
	valueAxis2.position = "right";
	valueAxis2.color = colorGraph2;
	valueAxis2.gridColor = colorGraph2;
	valueAxis2.titleColor = colorGraph2;
	chart.addValueAxis(valueAxis2);
	// graph 2
	var graph2 = new AmCharts.AmGraph();
	graph2.id = "g2";
	graph2.valueAxis = valueAxis2;
	graph2.valueField = "arcings_one";
	graph2.bullet = "triangleDown";
	graph2.balloonText = "[[value]]";
	graph2.hideBulletsCount = hideBulletsCount;
	graph2.bulletBorderThickness = 1;
	graph2.lineColor = colorGraph2;
	graph2.hidden = false;
	if (switchCustomBalloon) graph2.balloonFunction = balloonFunction;
	chart.addGraph(graph2);

	var chartCursor = new AmCharts.ChartCursor();
	chartCursor.categoryBalloonDateFormat = "YYYY MMM DD, JJ:NN:SS EEE";
	chartCursor.cursorPosition = "mouse";
	// chartCursor.valueLineEnabled = true;
	// chartCursor.valueLineBalloonEnabled = true;
	// chartCursor.cursorAlpha = 0.5;
	// chartCursor.zoomable = true;
	// chartCursor.valueZoomable = false;
	// chartCursor.valueLineAlpha = 0.5;
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
	// chartScrollbar.dragIconHeight = 35;
	// chartScrollbar.dragIconWidth = 20;
	chart.chartScrollbar = chartScrollbar;

	chart.pathToImages = "lib-js/amcharts/images/";

    chart.write("divChart1");

	// show version in log
	console.log("AmChart version:", chart.version);
}

function initializeChart2() {
    chart2 = new AmCharts.AmSerialChart();
    chart2.dataProvider = chartData;
    chart2.categoryField = "datetime";
    chart2.sequencedAnimation = false;
	chart2.categoryAxis.minPeriod = "ss";
	chart2.categoryAxis.parseDates = true;
	chart2.addListener("zoomed", handleZoom2);

    // value axis 1
    var valueAxis1 = new AmCharts.ValueAxis();
	valueAxis1.title = "v_ax_1";
    valueAxis1.axisAlpha = 0.15;
    valueAxis1.minimum = 0;
    valueAxis1.dashLength = 3;
	valueAxis1.color = colorGraph3;
	valueAxis1.gridColor = colorGraph3;
	valueAxis1.titleColor = colorGraph3;
    chart2.addValueAxis(valueAxis1);
    // graph 3
    var graph3 = new AmCharts.AmGraph();
	graph3.id = "g3";
	graph3.valueAxis = valueAxis1;
    graph3.valueField = "frequency";
    //graph3.fillAlphas = 0.5;
    graph3.balloonText = "[[value]] : [[kind]]";
	graph3.lineColor = "#00aa00";
	graph3.bulletSize = 5;
	graph3.bullet = "round";
	graph3.bulletBorderAlpha = 1;
	graph3.bulletColor = "#FFFFFF";
	graph3.hideBulletsCount = hideBulletsCount;
	graph3.useLineColorForBulletBorder = true;
	if (switchCustomBalloon) graph3.balloonFunction = balloonFunction;
    chart2.addGraph(graph3);

	// value axis 2
	var valueAxis2 = new AmCharts.ValueAxis();
	valueAxis2.title = "v_ax_1";
	valueAxis2.axisAlpha = 0.15;
	valueAxis2.minimum = 0;
	valueAxis2.dashLength = 3;
	valueAxis2.position = "right";
	valueAxis2.color = colorGraph4;
	valueAxis2.gridColor = colorGraph4;
	valueAxis2.titleColor = colorGraph4;
	chart2.addValueAxis(valueAxis2);
	// graph 4
	var graph4 = new AmCharts.AmGraph();
	graph4.id = "g4";
	graph4.valueAxis = valueAxis2;
	graph4.valueField = "arcings_both";
	graph4.bullet = "triangleDown";
	graph4.balloonText = "[[value]]";
	graph4.hideBulletsCount = hideBulletsCount;
	graph4.bulletBorderThickness = 1;
	graph4.lineColor = "#ff00ff";
	graph4.hidden = false;
	if (switchCustomBalloon) graph4.balloonFunction = balloonFunction;
	chart2.addGraph(graph4);

	var chartCursor = new AmCharts.ChartCursor();
	chartCursor.categoryBalloonDateFormat = "YYYY MMM DD, JJ:NN:SS EEE";
	chartCursor.cursorPosition = "mouse";
	// chartCursor.valueLineEnabled = true;
	// chartCursor.valueLineBalloonEnabled = true;
	// chartCursor.cursorAlpha = 0.5;
	// chartCursor.zoomable = true;
	// chartCursor.valueZoomable = false;
	// chartCursor.valueLineAlpha = 0.5;
	chartCursor.cursorColor = '#333';
	chart2.chartCursor = chartCursor;

	chart2.pathToImages = "lib-js/amcharts/images/";

    chart2.write("divChart2");
}

function initializeCharts() {
	initializeChart();
	initializeChart2();
	chart.autoMargins = false;
	chart.marginLeft  = 70;
	chart.marginRight = 70;
	chart.marginBottom = 20;
	chart2.autoMargins = false;
	chart2.marginLeft = chart.marginLeft;
	chart2.marginRight = chart.marginRight;
	chart2.marginBottom = chart.marginBottom;
	chart.balloon.animationDuration = 0;
	chart2.balloon.animationDuration = 0;
	chart.chartCursor.animationDuration = 0;
	chart2.chartCursor.animationDuration = 0;
}

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

function deepCopySimple(obj) {
	var ret = {};
	for (var k in obj) {
		ret[k] = obj[k];
	}
	return ret;
}

function createEndOfDayRecord(record) {
	var ret = deepCopySimple(record);
	var t = new Date(ret.datetime);
	t.setHours(23);
	t.setMinutes(59);
	t.setSeconds(59);
	t.setMilliseconds(1000);	// set to 0:00:00.000 on next day
	ret.datetime = t;

	for (var k in ret) {
		if (k !== "datetime") {
			if (typeof (ret[k]) === "string") ret[k] = "";
			if (typeof (ret[k]) === "number") ret[k] = NaN;
			if (typeof (ret[k]) === "boolean") ret[k] = NaN;
		}
	}
	return ret;
}

function loadFullData(datalines, iFirst, thFormat) {
	chartData = [];
	fullData = [];
	// reverse order to sort chronologically
	for (var i=datalines.length-1; i>=iFirst; i--) {
		if (datalines[i].length > 0) {
			var record = thFormat.parseDataLine(datalines[i]);
			fullData.push(record);
			//break; //####################################################
		}
	}

	// console.log("loadFullData");
	// console.log(fullData.length);
	// console.log("fullData=", fullData[0]);
	// console.log(fullData[fullData.length-1]);

	// for (var i=0; i<fullData.length; i++) {
		// var indexAbort = thFormat.indexAbort;
		// var abortReason = fullData[i][indexAbort];
		// if (abortReason != undefined) {
			// console.log("abortReason=", abortReason, i);
			// break;
		// }
	// }
}

function formatNumberThousands(x) {
	if (x < 1000) { return String(x); }
	var z = String(x);
	var nDigits = z.length;
	var suffix = '';
	var idx = z.indexOf('.');
	if (idx != -1) {
		suffix = z.substring(idx, nDigits);
		z = z.substring(0, idx);
		nDigits = z.length;
	}
	var nTriplets = Math.floor(nDigits / 3);
	var s = '';
	for (var k=0; k<nTriplets; k++) {
		if (k > 0) { s = ',' + s; }
		var i = nDigits - (k+1)*3;
		s = z.substr(i, 3) + s;
	}
	var nPrefix = nDigits - nTriplets*3;
	if (nPrefix > 0) {
		s = z.substr(0, nPrefix) + ',' + s;
	}
	s = s + suffix;
	return s;
}

function colorCodeTubeScanSeconds(scanSecs) {
	var fieldScanSecs = document.getElementById('scanSecs');
	var labelScanSecs = document.getElementById('labelScanSecs');
	fieldScanSecs.style.backgroundColor = '#aaffaa';
	fieldScanSecs.style.color = 'black';
	fieldScanSecs.style.fontWeight = 'normal';
	labelScanSecs.style.backgroundColor = '#aaffaa';
	labelScanSecs.style.color = 'black';
	labelScanSecs.style.fontWeight = 'normal';
	if (scanSecs > 350000) {
		fieldScanSecs.style.backgroundColor = 'yellow';
		fieldScanSecs.style.color = 'black';
		fieldScanSecs.style.fontWeight = 'normal';
		labelScanSecs.style.backgroundColor = 'yellow';
		labelScanSecs.style.color = 'black';
		labelScanSecs.style.fontWeight = 'normal';
	}
	if (scanSecs > 600000) {
		fieldScanSecs.style.backgroundColor = 'red';
		fieldScanSecs.style.color = 'white';
		fieldScanSecs.style.fontWeight = '900';
		labelScanSecs.style.backgroundColor = 'red';
		labelScanSecs.style.color = 'white';
		labelScanSecs.style.fontWeight = '900';
	}
}

function showMetadataAll(datalines, thFormat) {
	var metadata = thFormat.readMetadata(datalines);

	for (var k in metadata) {
		document.getElementById(k).innerHTML = metadata[k];
	}

	var scanSecs;

	if (thFormat.numCols == 32) {
		// Perspective tubes
		// Tube Scan Seconds      : 200000 (199999 within eMode range)
		// System Scan Seconds    : 200000 (199999 within eMode range)
		var tokens = metadata.scanSecs.split(/ /);
		scanSecs = Number(tokens[0]);
		var scanSecsEmode = Number(tokens[1].replace(/\(/, ''));
		tokens = metadata.systemSecs.split(/ /);
		var systemSecs = Number(tokens[0]);
		var systemSecsEmode = Number(tokens[1].replace(/\(/, ''));

		// color-code tube scan seconds
		colorCodeTubeScanSeconds(scanSecs);

		// format large numbers
		document.getElementById('scanSecs').innerHTML = formatNumberThousands(scanSecs) + ' (eMode: ' + formatNumberThousands(scanSecsEmode) + ')';
		document.getElementById('systemSecs').innerHTML = formatNumberThousands(systemSecs) + ' (eMode: ' + formatNumberThousands(systemSecsEmode) + ')';
	}
	else {
		// other tubes
		scanSecs = Number(metadata.scanSecs);
		var systemSecs = Number(metadata.systemSecs);

		// change format for large numbers (eg. 30000 -> 30,000)
		document.getElementById('scanSecs').innerHTML = formatNumberThousands(scanSecs);
		document.getElementById('systemSecs').innerHTML = formatNumberThousands(systemSecs);

		if (thFormat.numCols == 71) {
			// SW version for xCite tubes is contained in sensor data
			// use most recent value
			var recordNewest = fullData[fullData.length-1];
			// console.log("recordNewest=", recordNewest)
			var swVersion = recordNewest.SW_Version;
			// console.log("swVersion=", swVersion)
			var dateSwVersion = recordNewest.datetime.toLocaleDateString();
			// console.log("dateSwVersion=", dateSwVersion)
			document.getElementById("swVersion").innerHTML = "X.Cite " + swVersion + " (on " + dateSwVersion + ")";
		}
	}

	// color-code tube scan seconds
	colorCodeTubeScanSeconds(scanSecs);

	// independent of tube history file format
	document.getElementById('numScans').innerHTML = formatNumberThousands(Number(metadata.numScans));
	document.getElementById('tubeKWs').innerHTML = formatNumberThousands(Number(metadata.tubeKWs));
}

function showMessage(text, bgcolor) {
	var x = document.getElementById('divMessage');
	x.innerHTML = text;
	x.style.backgroundColor = bgcolor;
} 

function countScansPerDay(fullData) {
	listDays = [];
	numScans = [];
	indexDayStart = [];
	indexDayEnd = [];
	var dateLast = '';
	var n = 0;
	for (var i=0; i<fullData.length; i++) {
		var d = fullData[i].datetime.toLocaleDateString();
		if (i == 0) {
			listDays.push(d);
			n = 1;
			dateLast = d;
			indexDayStart.push(0);
		}
		else {
			if (d != dateLast) {
				listDays.push(d);
				numScans.push(n);
				n = 1;
				dateLast = d;
				indexDayStart.push(i);
				indexDayEnd.push(i-1);
			}
			else {
				n++;
			}
		}
	}
	numScans.push(n);
	indexDayEnd.push(fullData.length-1);

	// console.log("countScansPerDay");
	// console.log(indexDayStart);
	// console.log(indexDayEnd);
}

function setSliderInitialPosition() {
	var idxDayLast = listDays.length - 1;
	document.getElementById('slider1').max = idxDayLast;
	document.getElementById('slider2').max = idxDayLast;
	document.getElementById('slider2').value = idxDayLast;
	var idxDayFirst = 0;
	var maxScans = 10000;
	var sumScans = 0;
	for (var i=idxDayLast; i>=0; i--) {
		sumScans += numScans[i];
		if (sumScans >= maxScans) {
			idxDayFirst = i+1;
			if (idxDayFirst > idxDayLast) { idxDayFirst=idxDayLast; }
			break;
		}
	}
	document.getElementById('slider1').value = idxDayFirst;
}

function showSliderValue(idSlider, idTextfield) {
	var s = document.getElementById(idSlider);
	var t = document.getElementById(idTextfield);
	//t.innerHTML = s.value;
	t.innerHTML = listDays[Number(s.value)];

	var buttonPlot = document.getElementById('buttonPlot');

	var i1 = Number(document.getElementById('slider1').value);
	var i2 = Number(document.getElementById('slider2').value);
	if (i2 >= i1) {
		var numScansSelected = 0;
		for (var i=i1; i<=i2; i++) {
			numScansSelected += numScans[i];
		}
		buttonPlot.disabled = false;
		document.getElementById('slider1').disabled = false;
		document.getElementById('slider2').disabled = false;
		showMessage('', '#ffffff');
	}
	else {
		numScansSelected = 0;
		buttonPlot.disabled = true;
		showMessage('Please select an end date after the start date.', '#ffff00');
	}
	document.getElementById('numScansSelected').innerHTML = 'Number of scans selected: ' + String(numScansSelected);
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

function fillSelectElement(id, thFormat) {
	resetSelectElement(id);

	var x = document.getElementById(id);

	for (var k=0; k<thFormat.columnDef.length; k++) {
		if (thFormat.columnDef[k].plot==1) {
			var c = document.createElement("option");
			c.text = thFormat.columnDef[k].id;
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

function isRelevantAbortReason(abortReason) {
	if (abortReason === undefined) return false;
	if (abortReason === '') return false;
	if (abortReason === 'none') return false;

	if (abortReason === 'SuspendedByUser') return false;
	if (abortReason === 'Sus') return false;

	if (abortReason === 'StoppedByUser') return false;
	if (abortReason === 'Stop') return false;

	if (abortReason === 'Comp') return false;

	var pattern;

	// footswitch
	pattern = /foot/i;
	if (pattern.test(abortReason)) return false;
	// blanks only
	pattern = /^\s+$/;
	if (pattern.test(abortReason)) return false;

	return true;
}

function makeReportAborts(reportAborts) {
	// clear old table
	var divReportAborts = document.getElementById('divReportAborts');
	while (divReportAborts.hasChildNodes()) {
		divReportAborts.removeChild(divReportAborts.childNodes[0]);
	}

	if (reportAborts.length === 0) return;

	// sort newest first
	var sortFunc = function(a, b) {
		return b.timestamp - a.timestamp;
	};
	reportAborts.sort(sortFunc);

	var tbl = document.createElement('table');
	//tbl.style.tableLayout = 'fixed';
	tbl.setAttribute('id', 'tableAborts');
	tbl.setAttribute('border', '1');
	tbl.style.backgroundColor = '#fff';

	var header = tbl.createTHead();
	var row = header.insertRow(0);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Timestamp'));
	row.appendChild(td);
	td = document.createElement('td');
	td.appendChild(document.createTextNode('Scan type'));
	row.appendChild(td);
	td = document.createElement('td');
	td.appendChild(document.createTextNode('Abort reason'));
	row.appendChild(td);

	var tbdy = document.createElement('tbody');

	for (var i=0; i<reportAborts.length; i++) {
		var record = reportAborts[i];
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(record['timestamp'].toLocaleString()));
		tr.appendChild(td);
		td = document.createElement('td');
		td.appendChild(document.createTextNode(record['kind']));
		tr.appendChild(td);
		td = document.createElement('td');
		td.appendChild(document.createTextNode(record['abortReason']));
		tr.appendChild(td);
		tbdy.appendChild(tr);
	}
	tbl.appendChild(tbdy);

	var title = document.createElement('h2');
	title.appendChild(document.createTextNode('List of aborts'));

	divReportAborts.appendChild(title);
	divReportAborts.appendChild(tbl);
}

function addAbortsAll(thFormat) {
	var indexAbort = thFormat.indexAbort;
	reportAborts = [];

	// indicator for relevant abort
	for (var i=0; i<fullData.length; i++) {
		// initialize with 0=no abort
		fullData[i][colNameAbortsAll] = 0;
		// get scan type (e.g. SPI)
		var kind = fullData[i][thFormat.columnDef[thFormat.indexScanMode].id];

		if (thFormat.numCols === 81) {
			// Vectron tubes have two columns: cancel_reason and abort_controller
			// combinations like cancel_reason=StoppedByUser and abort_controller=PHS may occur
			if (
					fullData[i]['cancel_reason'] !== 'Comp'
				&&	fullData[i]['cancel_reason'] !== 'SuspendedByUser'
				&&	fullData[i]['cancel_reason'] !== 'StoppedByUser'
			) {
				fullData[i][colNameAbortsAll] = 1;
				var timestamp = fullData[i][thFormat.columnDef[thFormat.indexTimestamp].id];
				var abortController = fullData[i][indexAbort];
				if (abortController === '') abortController = '(empty)';
				var abortReason = fullData[i]['cancel_reason'] + ' : ' + abortController;
				reportAborts.push({ timestamp:timestamp, abortReason:abortReason, kind:kind });
			}
		}
		else if (thFormat.numCols === 84) {
			// Straton VB10A tubes have two columns: cancel_reason and abort_controller
			// combinations like cancel_reason=StoppedByUser and abort_controller=PHS may occur
			if (
					fullData[i]['cancel_reason'] !== 'Comp'
				&&	fullData[i]['cancel_reason'] !== 'SuspendedByUser'
				&&	fullData[i]['cancel_reason'] !== 'StoppedByUser'
			) {
				fullData[i][colNameAbortsAll] = 1;
				var timestamp = fullData[i][thFormat.columnDef[thFormat.indexTimestamp].id];
				// var abortController = fullData[i][indexAbort];
				var abortController = fullData[i]['abort_controller'];
				if (abortController === '') abortController = '(empty)';
				var abortReason = fullData[i]['cancel_reason'] + ' : ' + abortController;
				reportAborts.push({ timestamp:timestamp, abortReason:abortReason, kind:kind });
			}
		}
		else if (thFormat.numCols === 71) {
			// xCite tubes have two columns: cancel_reason and abort_controller
			// combinations like cancel_reason=StoppedByUser and abort_controller=PHS may occur
			if (
					fullData[i]['cancel_reason'] !== 'Comp'
				&&	fullData[i]['cancel_reason'] !== 'SuspendedByUser'
				&&	fullData[i]['cancel_reason'] !== 'StoppedByUser'
			) {
				fullData[i][colNameAbortsAll] = 1;
				var timestamp = fullData[i][thFormat.columnDef[thFormat.indexTimestamp].id];
				var abortController = fullData[i]['abort_controller'];
				if (abortController === '') abortController = '(empty)';
				var abortReason = fullData[i]['cancel_reason'] + ' : ' + abortController;
				reportAborts.push({ timestamp:timestamp, abortReason:abortReason, kind:kind });
			}
		}
		else {
			// non-Vectron tubes
			var abortReason = fullData[i][indexAbort];
			if (isRelevantAbortReason(abortReason)) {
				fullData[i][colNameAbortsAll] = 1;
				var timestamp = fullData[i][thFormat.columnDef[thFormat.indexTimestamp].id];
				reportAborts.push({ timestamp:timestamp, abortReason:abortReason, kind:kind });
			}
		}
	}

	// add aborts column to column definition
	if (false) {
		// add new column at the end
		thFormat.columnDef.push(
			{ id: colNameAbortsAll, plot: 1, min: 0, max: 1 }
		);
	}
	else {
		// add new column at the beginning 
		thFormat.columnDef.splice(
			0, 0,
			{ id: colNameAbortsAll, plot: 1, min: 0, max: 1 }
		);
	}

	// add table with aborts
	makeReportAborts(reportAborts);
}

function makeUsableAsKey(strInput) {
	var strCleaned = '';
	// replace any non-word character with an underscore
	strCleaned = strInput.replace(/\W/g, '_');
	return strCleaned;
}

function addIndicator(colName) {
	var hash = {};
	for (var i=0; i<fullData.length; i++) {
		var key = makeUsableAsKey(fullData[i][colName]);
		hash[key] = 1;
	}
	var listIndicatorNames = [];
	for (var k in hash) {
		listIndicatorNames.push(colName + '_' + k);
	}

	for (var i=0; i<fullData.length; i++) {
		// add columns for indicators
		for (var k=0; k<listIndicatorNames.length; k++) {
			fullData[i][listIndicatorNames[k]] = 0;
		}
		// set 1 for actual value
		var k0 = colName + '_' + makeUsableAsKey(fullData[i][colName]);
		fullData[i][k0] = 1;
	}

	// add indicators to column definition
	for (var k=0; k<listIndicatorNames.length; k++) {
		thFormat.columnDef.push(
			{ id: listIndicatorNames[k], plot: 1, min: indicatorValueMin, max: indicatorValueMax }
		);
	}
}

function loadIndicatorSingle(colName) {
	// first pass: get indicator levels
	var hash = {};
	for (var i=0; i<chartData.length; i++) {
		var key = makeUsableAsKey(chartData[i][colName]);
		hash[key] = 1;
	}
	var listIndicatorLevels = [];
	for (var k in hash) {
		listIndicatorLevels.push(colName + '_' + k);
	}

	// initialize
	for (var k=0; k<listIndicatorLevels.length; k++) {
		indicators[listIndicatorLevels[k]] = [];
	}

	// second pass: extract timestamps for each level
	var colNameTimestamp = thFormat.columnDef[thFormat.indexTimestamp].id;
	for (var i=0; i<chartData.length; i++) {
		var level = colName + '_' + makeUsableAsKey(chartData[i][colName]);
		var ts = chartData[i][colNameTimestamp];
		indicators[level].push(ts);
	}
}

function loadIndicatorsAll() {
	indicators = {};
	for (var k=0; k<thFormat.columnDef.length; k++) {
		if (thFormat.columnDef[k].plot==2) {
			loadIndicatorSingle(thFormat.columnDef[k].id);
		}
	}

	guideIndicators = {};
	for (var level in indicators) {
		var listTimestamps = indicators[level];
		var guides = [];
		for (var i=0; i<listTimestamps.length; i++) {
			guides.push({
				date: listTimestamps[i],
				lineColor: colorIndicator1,
				lineAlpha: 1,
				tickLength: 0
			});
		}
		guideIndicators[level] = guides;
	}
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

function fillSelectElementIndicator(id) {
	var x = document.getElementById(id);

	// remove all
	while (x.options.length) {
		x.remove(0);
	}

	for (var level in indicators) {
		var c = document.createElement("option");
		c.text = level;
		x.options.add(c);
	}
	x.disabled = false;
	addEmptyOptionToSelectElement(id);
}

function findFirstDataLine(datalines) {
	var regex = /^\s*\d/;
	var iFirst = -1;
	for (var i=0; i<datalines.length; i++) {
		if (datalines[i].match(regex)) {
			iFirst = i;
			break;
		}
	}
	return iFirst;
}

function parseData(strInput) {
	var n = strInput.length;
	// var datalines = strInput.split("\n");
	var datalines = strInput.split(/\r?\n/);
	var nLines = datalines.length;

	// find first line that starts with a digit
	var iFirst = findFirstDataLine(datalines);

	if (iFirst == -1) {
		showMessage('Cannot find a line with data in selected file.', '#ffff00');
		return 9001;
	}

	// load format definition based on first data line
	thFormat = loadTubeHistoryFormat(datalines[iFirst]);

	// load data
	loadFullData(datalines, iFirst, thFormat);

	// show metadata
	showMetadataAll(datalines, thFormat);

	if (switchAutoAdjustParameterLimits) {
		updateParameterLimits();
	}

	// add aborts
	addAbortsAll(thFormat);

	// workaround for: last record not plotted
	if (false) {
		// var x = fullData[fullData.length-1];
		// var y = createEndOfDayRecord(x);
		// fullData.push(y);
	}

	// add indicators
	var listIndicators = [];
	for (var k=0; k<thFormat.columnDef.length; k++) {
		if (thFormat.columnDef[k].plot==2) {
			listIndicators.push(thFormat.columnDef[k].id);
		}
	}
	for (var k=0; k<listIndicators.length; k++) {
		addIndicator(listIndicators[k]);
	}

	// fill select elements
	fillSelectElement('tube_param1', thFormat);
	fillSelectElement('tube_param2', thFormat);
	fillSelectElement('tube_param3', thFormat);
	fillSelectElement('tube_param4', thFormat);
	addEmptyOptionToSelectElement('tube_param1');
	addEmptyOptionToSelectElement('tube_param2');
	addEmptyOptionToSelectElement('tube_param3');
	addEmptyOptionToSelectElement('tube_param4');

	countScansPerDay(fullData);
	setSliderInitialPosition();
	showSliderValue('slider1','valueSlider1');
	showSliderValue('slider2','valueSlider2');

	return 0;
}

function getColumnIndex(thFormat, id) {
	var idxColumn = -1;
	for (var k=0; k<thFormat.columnDef.length; k++) {
		if (thFormat.columnDef[k].id == id) {
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

		var idxColumn = getColumnIndex(thFormat, param);
		//showMessage(param + "--" + idxColumn, "#ffff00");
		var ymin = thFormat.columnDef[idxColumn].min;
		var ymax = thFormat.columnDef[idxColumn].max;
		if (ymin == 0 && ymax == 0) {
			// limits are not set
			chart.graphs[idxGraph].valueAxis.minimum = undefined;
			chart.graphs[idxGraph].valueAxis.maximum = undefined;
		}
		else {
			chart.graphs[idxGraph].valueAxis.minimum = ymin;
			chart.graphs[idxGraph].valueAxis.maximum = ymax;
		}
	}

	// store zoom window because validateData() overwrites it
	var z1 = zoomStartIndexLast;
	var z2 = zoomEndIndexLast;

	if (doRefresh) chart.validateData();

	// restore zoom window
	//if (doRefresh) chart.zoomToIndexes(zoomStartIndexLast, zoomEndIndexLast);
	if (doRefresh) chart.zoomToIndexes(z1, z2);
}

function selectIndicator(idSelectBox, chart, doRefresh) {
	var e = document.getElementById(idSelectBox);
	var level = e.options[e.selectedIndex].value;

	// remove guides
	chart.categoryAxis.guides = [];
	chart.guides = [];

	var numScansText = '';
	if (level == "(none)") {
		//chart.guides = [];
		//chart.categoryAxis.guides = [];
	}
	else {
		chart.guides = guideIndicators[level];
		if (chart.guides.length == 1) {
			numScansText = '1 scan';
		}
		else {
			numScansText = chart.guides.length + ' scans';
		}
	}
//showMessage(level, '#ffff00');
//showMessage(level + ':' + chart.categoryAxis.guides.length, '#ffff00');
//showMessage(level + ':' + chart.guides.length, '#ffff00');
//showMessage(indicators[level], '#ffff00');

	document.getElementById('num_hits').innerHTML = numScansText;

	// store zoom window because validateData() overwrites it
	var z1 = zoomStartIndexLast;
	var z2 = zoomEndIndexLast;

	if (doRefresh) chart.validateData();

	// restore zoom window
	//if (doRefresh) chart.zoomToIndexes(zoomStartIndexLast, zoomEndIndexLast);
	if (doRefresh) chart.zoomToIndexes(z1, z2);
}

function stopwatchStart() {
	stopwatchStartTimestamp = Date.now();
}

function stopwatchEnd() {
	return Date.now() - stopwatchStartTimestamp;
}

function callbackOnLoad(e) {
	var ret = parseData(fileReader.result);
	document.getElementById('fileinput').disabled = false;
	if (ret != 0) {
		return;
	}

	var t = Number(stopwatchEnd())*1e-3;
	t = t.toFixed(1);
	var text = 'Finished reading file in ' + String(t) + ' sec.';
	text = text + '<br>Select a time range and tube parameters. Then click on the <i>Plot</i> button.';
	showMessage(text, '#ffffff');

	document.getElementById('metadataTable').style.display = 'table-cell';
	document.getElementById('selectTimeRange').style.display = 'table-cell';
	document.getElementById('divSelectParameters').style.visibility = 'visible';

	preselectTubeParameter(thFormat, colNameAbortsAll);
}

function callbackOnLoadStart(e) {
	document.getElementById('divPlotArea').style.visibility = 'hidden';
	document.getElementById('divSelectParameters').style.visibility = 'hidden';
	document.getElementById('metadataTable').style.display = 'none';
	document.getElementById('selectTimeRange').style.display = 'none';
	//document.getElementById('divProgress').style.visibility = 'visible';
	document.getElementById('fileinput').disabled = true;

	showMessage('Reading file ...', '#ffff00');
	stopwatchStart();
	// reset select menus
	resetSelectElement('tube_param1');
	resetSelectElement('tube_param2');
	resetSelectElement('tube_param3');
	resetSelectElement('tube_param4');
	// clear plots
	fullData = [];
	chartData = [];
	chart.dataProvider = [];
	chart2.dataProvider = [];
	chart.validateData();
	chart2.validateData();
	// disable GUI elements
	document.getElementById('buttonPlot').disabled = true;
	document.getElementById('slider1').disabled = true;
	document.getElementById('slider2').disabled = true;
	// reset metadata
	resetMetadata();

	//progressElement.max = 1;
	//progressElement.value = 0;
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

function callbackPlotButton() {
	document.getElementById('divPlotArea').style.visibility = 'visible';

	document.getElementById('divChart1').style.backgroundColor = '#ffffff';
	document.getElementById('divChart2').style.backgroundColor = '#ffffff';
	showMessage('', '#ffffff');

	// copy subset
	var k1 = Number(document.getElementById('slider1').value);
	var k2 = Number(document.getElementById('slider2').value);
	var i1 = indexDayStart[k1];
	var i2 = indexDayEnd[k2];
	chartData = fullData.slice(i1, i2+1);

	// console.log("callbackPlotButton");
	// console.log([i1,i2]);
	// console.log(fullData[i1]);
	// console.log(fullData[i2]);
	// console.log(chartData.shift());
	// console.log(chartData.pop());


	// add indicators
	//loadIndicatorsAll();
	//fillSelectElementIndicator('indicator1');

	chart.dataProvider = chartData;
	chart2.dataProvider = chartData;

	// default selected options
	/*
	selectOption('tube_param1', 'oil_pressure');
	selectOption('tube_param2', 'arcings_one');
	selectOption('tube_param3', 'frequency');
	selectOption('tube_param4', 'arcings_both');
	*/

	var doRefresh = false;
	selectParam('tube_param1', 0, chart, doRefresh);
	selectParam('tube_param2', 1, chart, doRefresh);
	selectParam('tube_param3', 0, chart2, doRefresh);
	selectParam('tube_param4', 1, chart2, doRefresh);
	//selectIndicator('indicator1', chart, doRefresh);

	// balloon text for primary graph
	// reason for +1: new column "Aborts" added
	var scanModeId = thFormat.columnDef[thFormat.indexScanMode+1].id;
	chart.graphs[0].balloonText = "[[value]] : [[" + scanModeId + "]]";
	chart2.graphs[0].balloonText = "[[value]] : [[" + scanModeId + "]]";

	chart.validateData();
	chart2.validateData();

	// chart.invalidateSize();
}

function callbackOnProgress(event) {
	if (event.lengthComputable) {
		progressElement.max = event.total;
		progressElement.value = event.loaded;
	}
}

function callbackOnLoadEnd(event) {
	var error = event.target.error;
	if (error != null) {
		showMessage('Error loading file.', '#ffff00');
	} else {
		// plot immediately
		callbackPlotButton();
	}
};

function readSingleFile(evt) {
	fileObj = evt.target.files[0];

	if (fileObj) {
		fileReader = new FileReader();
		fileReader.onload = callbackOnLoad;
		fileReader.onloadstart = callbackOnLoadStart;
		//fileReader.onprogress = callbackOnProgress;
		fileReader.onloadend = callbackOnLoadEnd;
		fileReader.readAsText(fileObj);
	} else {
		showMessage('Failed to load file', '#ffff00');
	}
}

