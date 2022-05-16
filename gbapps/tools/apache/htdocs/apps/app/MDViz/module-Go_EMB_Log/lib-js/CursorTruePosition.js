
function CursorTruePosition(chart) {
	this.mapTimeIndexToMouseCoordinate = this.makeMapTimeIndexToMouseCoordinate(chart);
	this.textCursor = '';

	// chart is modified here
	chart.textCursor = '';
	chart.formatDate = this.formatDate;
}


CursorTruePosition.prototype.makeMapTimeIndexToMouseCoordinate = function(chart) {
	// console.log('makeMapTimeIndexToMouseCoordinate start');
	var chartData = chart.dataProvider;
	var axis = chart.categoryAxis;
	var fieldnameTimestamp = chart.categoryField;
	var mapTimeIndexToMouseCoordinate = [];
	for (var i=0; i<chartData.length; i++) {
		var d = chartData[i][fieldnameTimestamp];
		var x = axis.dateToCoordinate(d);
		mapTimeIndexToMouseCoordinate.push(x);
	}
	return mapTimeIndexToMouseCoordinate;
}

// event.target = chartCursor
CursorTruePosition.prototype.callbackMoveCursor = function(event) {
	// console.log(event);
	//console.log('callbackMoveCursor');
	var chart = event.chart;
	var chartData = chart.dataProvider;
	var x0 = event.x;

	// index of closest data point
    var idx = chart.categoryAxis.xToIndex(x0);

	// check whether cursor is between i1 and i2
	var i1 = idx;
	var i2 = idx + 1;
	var x1 = this.mapTimeIndexToMouseCoordinate[i1];
	var x2 = this.mapTimeIndexToMouseCoordinate[i2];

	if (x1 <= x0 && x0 <= x2) {
		// x0 is in interval [idx, idx+1]
	}
	else {
		// x0 is in interval [idx-1, idx]
		i1 = idx - 1;
		i2 = idx;
		x1 = this.mapTimeIndexToMouseCoordinate[i1];
		x2 = this.mapTimeIndexToMouseCoordinate[i2];
	}

	var fieldnameTimestamp = chart.categoryField;

	// cursor is in interval [t1, t2]
	var t1 = chartData[i1][fieldnameTimestamp];
	var t2 = chartData[i2][fieldnameTimestamp];
	var lam = (x0-x1) / (x2-x1);
	var t0 = (1-lam) * t1 + lam * t2;
	var d0 = new Date(Math.round(t0));
	// console.log([idx,i1,i2,fieldnameTimestamp,t1,t2,d0]);


	// this.textCursor = this.formatDate(d0);
	chart.textCursor = d0;
	chart.textCursor = chart.formatDate(d0);
}

CursorTruePosition.prototype.balloonFunction = function(date) {
	// this = CategoryAxis
	// console.log(this);
	// return this.textCursor;
	return this.chart.textCursor;
}


// example: "Apr 21, 15:42:28 Thu"
CursorTruePosition.prototype.formatDate = function(d) {
	var namesWeekdayShort = [ 'Sun','Mon','Tue','Wed','Thu','Fri','Sat' ];
	var namesMonthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var month = namesMonthShort[d.getMonth()];
	var weekday = namesWeekdayShort[d.getDay()];
	var output = month + ' ' + d.getDate() + ', ' + d.toLocaleTimeString() + ' ' + weekday;
	return output;
}
