
function LogViewer(listEventLogObjects, columnWidth, divTableEventLogText, divButtonBar) {
	this.listEventLogObjects = listEventLogObjects;
	this.columnWidth = columnWidth;
	this.divTableEventLogText = document.getElementById(divTableEventLogText);
	this.divButtonBar = document.getElementById(divButtonBar);
	this.tableEventLogText = undefined;	// table element

	this.listEventLogObjects.mapIndexAbsoluteToPair = this.makeMapIndexAbsoluteToPair(listEventLogObjects);
	this.listEventLogObjects.mapIndexPairToAbsolute = this.makeMapIndexPairToAbsolute(listEventLogObjects);

	this.makeButtonBar();
	this.divButtonBar.style.visibility = 'hidden';
}

LogViewer.prototype.clear = function() {
	var buttonBar = this.divButtonBar;
	while (buttonBar.hasChildNodes()) {
		buttonBar.removeChild(buttonBar.childNodes[0]);
	}
	this.deleteTableLogText();
}

LogViewer.prototype.addButton = function(value, callback) {
	var button = document.createElement("input");
	button.type = "button";
	button.value = value;
	button.onclick = callback;
	button.logViewer = this;
	this.divButtonBar.appendChild(button);
}

LogViewer.prototype.makeButtonBar = function() {
	this.addButton("\u25c0 previous day", this.callbackButtonLogTextPreviousDay);
	this.addButton("first entry \u25b2", this.callbackButtonLogTextFirstEntry);
	this.addButton("1 hour \u25b2", this.callbackButtonLogTextUpOneHour);
	this.addButton("10 lines \u25b2", this.callbackButtonLogTextUp10);
	this.addButton("up \u25b2" , this.callbackButtonLogTextUp1);
	this.addButton("down \u25bc" , this.callbackButtonLogTextDown1);
	this.addButton("10 lines \u25bc", this.callbackButtonLogTextDown10);
	this.addButton("1 hour \u25bc", this.callbackButtonLogTextDownOneHour);
	this.addButton("last entry \u25bc", this.callbackButtonLogTextLastEntry);
	this.addButton("next day \u25ba", this.callbackButtonLogTextNextDay);
}

LogViewer.prototype.copyLogEntryToTableRow = function(row, listEventLogObjects, indexDay, indexLine, columnWidth) {
	var record = listEventLogObjects[indexDay].logdata[indexLine];
	var nFields = columnWidth.length;

	for (var k=0; k<nFields; k++) {
		var cell = row.insertCell(k);
		cell.style.width = String(columnWidth[k]) + 'px';
		cell.style.wordWrap = "break-word";
	}

	row.cells[0].innerHTML = record.severity;
	row.cells[1].innerHTML = record.datetime.toLocaleString();
	row.cells[2].innerHTML = record.event_source;
	row.cells[3].innerHTML = String(record.event_id);
	row.cells[4].innerHTML = record.event_text;

	row.indexDay = indexDay;
	row.indexLine = indexLine;

	return row;
}

LogViewer.prototype.insertRow = function(tbl, pos, listEventLogObjects, indexDay, indexLine, columnWidth, bgcolor) {
	var row = tbl.insertRow(pos);
	this.copyLogEntryToTableRow(row, listEventLogObjects, indexDay, indexLine, columnWidth);
	row.style.backgroundColor = bgcolor;
}

LogViewer.prototype.insertRowViaIndexAbsolute = function(tbl, pos, listEventLogObjects, indexAbsolute, columnWidth, bgcolor) {
	var mapIndexAbsoluteToPair = listEventLogObjects.mapIndexAbsoluteToPair;
	var mapIndexPairToAbsolute = listEventLogObjects.mapIndexPairToAbsolute;
	var p = mapIndexAbsoluteToPair[indexAbsolute];
	var indexDay = p[0];
	var indexLine = p[1];
	var row = tbl.insertRow(pos);
	this.copyLogEntryToTableRow(row, listEventLogObjects, indexDay, indexLine, columnWidth);
	row.style.backgroundColor = bgcolor;
}

LogViewer.prototype.deleteTableLogText = function() {
	var elementEventLogText = this.divTableEventLogText;
	if (elementEventLogText.hasChildNodes()) {
		elementEventLogText.removeChild(elementEventLogText.childNodes[0]);
	}
}

LogViewer.prototype.showEventLogText = function(indexDay, indexLineStart, indexLineEnd, indexLineHighlight) {
	this.divButtonBar.style.visibility = 'visible';
	var logdata = this.listEventLogObjects[indexDay].logdata;
	var nLines = logdata.length;

	if (indexLineStart < 0) indexLineStart = 0;

	if (indexLineEnd >= nLines) {
		indexLineEnd = nLines-1;
	}

	function getSum(total, num) { return total + num; }
	var tableWidth = this.columnWidth.reduce(getSum);

	var tbl = document.createElement('table');

	tbl.style.width = String(tableWidth) + 'px';
	tbl.style.tableLayout = 'fixed';
	tbl.setAttribute('border', '1');

	for (var i=indexLineStart; i<=indexLineEnd; i++) {
		var bgcolor = '#fff';
		if (i===indexLineHighlight) {
			bgcolor = '#dfd';
		}
		var pos = -1;
		this.insertRow(tbl, pos, listEventLogObjects, indexDay, i, this.columnWidth, bgcolor);
	}

	// overwrite existing table
	this.deleteTableLogText();

	// insert table
	this.divTableEventLogText.appendChild(tbl);

	this.tableEventLogText = tbl;
}

LogViewer.prototype.showEventLogTextSummaryTabViaIndexAbsolute = function(indexAbsoluteStart, indexAbsoluteEnd, indexAbsoluteHighlight) {
	this.divButtonBar.style.visibility = 'visible';
	var listEventLogObjects = this.listEventLogObjects;
	var mapIndexAbsoluteToPair = listEventLogObjects.mapIndexAbsoluteToPair;
	var mapIndexPairToAbsolute = listEventLogObjects.mapIndexPairToAbsolute;

	// number of rows wanted
	var nRows = indexAbsoluteEnd - indexAbsoluteStart + 1;

	// check bounds
	if (indexAbsoluteStart < 0) {
		indexAbsoluteStart = 0;
		indexAbsoluteEnd = nRows-1;
	}
	if (indexAbsoluteEnd >= mapIndexAbsoluteToPair.length) {
		indexAbsoluteEnd = mapIndexAbsoluteToPair.length-1;
		indexAbsoluteStart = indexAbsoluteEnd - nRows + 1;
	}

	// calculate table width
	function getSum(total, num) { return total + num; }
	var tableWidth = this.columnWidth.reduce(getSum);

	var tbl = document.createElement('table');

	tbl.style.width = String(tableWidth) + 'px';
	tbl.style.tableLayout = 'fixed';
	tbl.setAttribute('border', '1');

	for (var i=indexAbsoluteStart; i<=indexAbsoluteEnd; i++) {
		var bgcolor = '#fff';
		if (i===indexAbsoluteHighlight) {
			bgcolor = '#dfd';
		}
		var pos = -1;
		this.insertRowViaIndexAbsolute(tbl, pos, listEventLogObjects, i, this.columnWidth, bgcolor);
	}

	// overwrite existing table
	this.deleteTableLogText();

	// insert table
	this.divTableEventLogText.appendChild(tbl);

	this.tableEventLogText = tbl;
}

LogViewer.prototype.getLastRow = function(tableElement) {
	var rows = tableElement.rows;
	var nRows = rows.length;
	//console.log('nRows=' + nRows);
	var rowLast = rows[nRows-1];
	return rowLast;
}

LogViewer.prototype.callbackButtonLogTextUp1 = function() {
	//console.log('callbackButtonLogTextUp1');
	var nskip = 1;
	var delta = -1;
	this.logViewer.updateTableEventLogText(nskip, delta);
}

LogViewer.prototype.callbackButtonLogTextUp10 = function() {
	//console.log('callbackButtonLogTextUp10');
	var nskip = 10;
	var delta = -1;
	this.logViewer.updateTableEventLogText(nskip, delta);
}

LogViewer.prototype.callbackButtonLogTextDown1 = function() {
	//console.log('callbackButtonLogTextDown1');
	var nskip = 1;
	var delta = 1;
	this.logViewer.updateTableEventLogText(nskip, delta);
}

LogViewer.prototype.callbackButtonLogTextDown10 = function() {
	//console.log('callbackButtonLogTextDown10');
	var nskip = 10;
	var delta = 1;
	this.logViewer.updateTableEventLogText(nskip, delta);
}

LogViewer.prototype.callbackButtonLogTextLastEntry = function() {
	var logViewer = this.logViewer;
	var tableEventLogText = logViewer.tableEventLogText;
	var listEventLogObjects = logViewer.listEventLogObjects;

	// jump to first entry of current day w.r.t. current first line
	if (tableEventLogText === undefined) return;
	// get first row
	var rowRef = tableEventLogText.rows[0];
	var indexDay = rowRef.indexDay;
	var nLines = listEventLogObjects[indexDay].logdata.length;

	var nRows = tableEventLogText.rows.length;
	var indexLineEnd = nLines-1;
	var indexLineStart = indexLineEnd - nRows+1;
	var indexLineHighlight = -1;

	tableEventLogText = logViewer.showEventLogText(
		indexDay, indexLineStart, indexLineEnd, indexLineHighlight);
}

LogViewer.prototype.callbackButtonLogTextFirstEntry = function() {
	var logViewer = this.logViewer;
	var tableEventLogText = logViewer.tableEventLogText;
	var listEventLogObjects = logViewer.listEventLogObjects;

	// jump to first entry of current day w.r.t. current first line
	if (tableEventLogText === undefined) return;
	// get first row
	var rowRef = tableEventLogText.rows[0];
	var indexDay = rowRef.indexDay;

	var indexLineStart = 0;
	var nRows = tableEventLogText.rows.length;
	var indexLineEnd = indexLineStart + nRows - 1;
	var indexLineHighlight = -1;

	tableEventLogText = logViewer.showEventLogText(
		indexDay, indexLineStart, indexLineEnd, indexLineHighlight);
}

LogViewer.prototype.callbackButtonLogTextPreviousDay = function() {
	// this = button object
	// console.log(this);
	var logViewer = this.logViewer;
	var tableEventLogText = logViewer.tableEventLogText;
	// jump to first entry of previous day w.r.t. current first line
	if (tableEventLogText === undefined) return;
	// get first row
	var rowRef = tableEventLogText.rows[0];
	var indexDay = rowRef.indexDay - 1;

	if (indexDay < 0) return;

	var indexLineStart = 0;
	var nRows = tableEventLogText.rows.length;
	var indexLineEnd = indexLineStart + nRows - 1;
	var indexLineHighlight = -1;

	tableEventLogText = logViewer.showEventLogText(
		indexDay, indexLineStart, indexLineEnd, indexLineHighlight);
}

LogViewer.prototype.callbackButtonLogTextNextDay = function() {
	var logViewer = this.logViewer;
	var tableEventLogText = logViewer.tableEventLogText;
	// jump to first entry of next day w.r.t. current first line
	if (tableEventLogText === undefined) return;
	// get first row
	var rowRef = tableEventLogText.rows[0];
	var indexDay = rowRef.indexDay + 1;

	if (indexDay >= logViewer.listEventLogObjects.length) return;

	var idTable = 'tableEventLogText';
	var idEventLogText = 'divEventLogText';
	var indexLineStart = 0;
	var nRows = tableEventLogText.rows.length;
	var indexLineEnd = indexLineStart + nRows - 1;
	var indexLineHighlight = -1;

	tableEventLogText = logViewer.showEventLogText(
		indexDay, indexLineStart, indexLineEnd, indexLineHighlight);
}

LogViewer.prototype.callbackButtonLogTextDownOneHour = function() {
	var logViewer = this.logViewer;
	var tableEventLogText = logViewer.tableEventLogText;
	var listEventLogObjects = logViewer.listEventLogObjects;
	var mapIndexAbsoluteToPair = listEventLogObjects.mapIndexAbsoluteToPair;
	var mapIndexPairToAbsolute = listEventLogObjects.mapIndexPairToAbsolute;

	if (tableEventLogText === undefined) return;
	// get last row
	var nRows = tableEventLogText.rows.length;
	var rowRef = tableEventLogText.rows[nRows-1];
	var indexDayRef = rowRef.indexDay;
	var indexLineRef = rowRef.indexLine;
	var datetimeRef = listEventLogObjects[indexDayRef].logdata[indexLineRef].datetime;
	var indexAbsoluteRef = mapIndexPairToAbsolute[indexDayRef][indexLineRef];

	var nDays = listEventLogObjects.length;
	var nLinesLastDay = listEventLogObjects[nDays-1].logdata.length;
	var datetimeLast = listEventLogObjects[nDays-1].logdata[nLinesLastDay-1].datetime;

	// find end index
	var indexAbsoluteEnd = undefined;
	if (Math.abs(datetimeLast - datetimeRef) <= 3600000) {
		indexAbsoluteEnd = mapIndexAbsoluteToPair.length - 1;
	}
	else {
		for (var i=indexAbsoluteRef+1; i<mapIndexAbsoluteToPair.length; i++) {
			var indexDay = mapIndexAbsoluteToPair[i][0];
			var indexLine = mapIndexAbsoluteToPair[i][1];
			var dttm = listEventLogObjects[indexDay].logdata[indexLine].datetime;
			var delta = Math.abs(dttm - datetimeRef);
			if (delta > 3600000) {
				indexAbsoluteEnd = i-1;
				break;
			}
		}
	}

	var indexAbsoluteStart = indexAbsoluteEnd - nRows+1;
	var indexAbsoluteHighlight = -1;

	tableEventLogText = logViewer.showEventLogTextSummaryTabViaIndexAbsolute(
		indexAbsoluteStart, indexAbsoluteEnd, indexAbsoluteHighlight);
}

LogViewer.prototype.callbackButtonLogTextUpOneHour = function() {
	var logViewer = this.logViewer;
	var tableEventLogText = logViewer.tableEventLogText;
	var listEventLogObjects = logViewer.listEventLogObjects;
	var mapIndexAbsoluteToPair = listEventLogObjects.mapIndexAbsoluteToPair;
	var mapIndexPairToAbsolute = listEventLogObjects.mapIndexPairToAbsolute;

	if (tableEventLogText === undefined) return;
	// get first row
	var rowRef = tableEventLogText.rows[0];
	var indexDayRef = rowRef.indexDay;
	var indexLineRef = rowRef.indexLine;
	var datetimeRef = listEventLogObjects[indexDayRef].logdata[indexLineRef].datetime;
	var indexAbsoluteRef = mapIndexPairToAbsolute[indexDayRef][indexLineRef];

	var datetimeFirst = listEventLogObjects[0].logdata[0].datetime;

	// find start index
	var indexAbsoluteStart = undefined;
	if (Math.abs(datetimeFirst - datetimeRef) <= 3600000) {
		indexAbsoluteStart = 0;
	}
	else {
		for (var i=indexAbsoluteRef-1; i>=0; i--) {
			var indexDay = mapIndexAbsoluteToPair[i][0];
			var indexLine = mapIndexAbsoluteToPair[i][1];
			var dttm = listEventLogObjects[indexDay].logdata[indexLine].datetime;
			var delta = Math.abs(dttm - datetimeRef);
			if (delta > 3600000) {
				indexAbsoluteStart = i+1;
				break;
			}
		}
	}

	var nRows = tableEventLogText.rows.length;
	var indexAbsoluteEnd = indexAbsoluteStart + nRows-1;
	var indexAbsoluteHighlight = -1;

	tableEventLogText = logViewer.showEventLogTextSummaryTabViaIndexAbsolute(
		indexAbsoluteStart, indexAbsoluteEnd, indexAbsoluteHighlight);
}

LogViewer.prototype.updateTableEventLogText = function(nskip, delta) {
	var tableEventLogText = this.tableEventLogText;
	var listEventLogObjects = this.listEventLogObjects;

	if (tableEventLogText === undefined)
		return;
	if (delta !== 1 && delta !== -1)
		throw 'delta must be +1 or -1';

	// get last row
	var rowRef = this.getLastRow(tableEventLogText);
	if (delta === -1) {
		// get first row
		rowRef = tableEventLogText.rows[0];
	}
	var indexLineRef = rowRef.indexLine;

	var indexDay = rowRef.indexDay;
	var bgcolor = '#fff';

	// insert new rows at end
	var posInsert = -1;
	if (delta === -1) {
		// insert new rows at beginning
		posInsert = 0;
	}

	var countInserted = 0;
	var indexLine = indexLineRef;
	var nLines = listEventLogObjects[indexDay].logdata.length;
	var nDays = listEventLogObjects.length;

	for (var k=0; k<nskip; k++) {
		// update log entry
		indexLine += delta;

		if (indexLine < 0) {
			// update log day
			indexDay--;
			if (indexDay < 0) break;
			// update number of log lines
			nLines = listEventLogObjects[indexDay].logdata.length;
			indexLine = nLines-1;
		}

		if (indexLine >= nLines) {
			// update log day
			indexDay++;
			if (indexDay >= nDays) break;
			// update number of log lines
			nLines = listEventLogObjects[indexDay].logdata.length;
			indexLine = 0;
		}

		this.insertRow(tableEventLogText, posInsert, listEventLogObjects, indexDay, indexLine, this.columnWidth, bgcolor);
		countInserted++;
	}

	// delete rows at beginning
	var posDelete = 0;
	if (delta === -1) {
		// delete rows at end
		posDelete = -1;
	}

	// delete as many rows as were inserted
	for (var k=0; k<countInserted; k++) {
		tableEventLogText.deleteRow(posDelete);
	}
}


// map indexAbsolute --> [ indexDay, indexLine ]
LogViewer.prototype.makeMapIndexAbsoluteToPair = function(listEventLogObjects) {
	var output = [];
	var nDays = listEventLogObjects.length;
	for (var indexDay=0; indexDay<nDays; indexDay++) {
		var nLines = listEventLogObjects[indexDay].logdata.length;
		for (var indexLine=0; indexLine<nLines; indexLine++) {
			output.push( [indexDay, indexLine] );
		}
	}
	return output;
}

// map [indexDay][indexLine] --> indexAbsolute
LogViewer.prototype.makeMapIndexPairToAbsolute = function(listEventLogObjects) {
	var output = [];
	var nDays = listEventLogObjects.length;
	var indexAbsolute = 0;
	for (var indexDay=0; indexDay<nDays; indexDay++) {
		var nLines = listEventLogObjects[indexDay].logdata.length;
		var row = [];
		for (var indexLine=0; indexLine<nLines; indexLine++) {
			row.push(indexAbsolute);
			indexAbsolute++;
		}
		output.push(row);
	}
	return output;
}

/*
function TEST_makeMapIndexPairToAbsolute() {
	var indexAbsolute = mapIndexPairToAbsolute[2][524];
	console.log(indexAbsolute);
	console.log(mapIndexAbsoluteToPair[indexAbsolute]);
}
*/

