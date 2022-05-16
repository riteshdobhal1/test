var reloadGraph = function(data) {
	var i, j, fdata = [], t_data, barChart, chartLabel = "", t_date;
	var chart_config = {
		"chart" : {
			"animation" : "1",
			"bgcolor" : "FFFFFF",
			"canvasbgColor" : "FAFAFA",
			"canvasbgAlpha" : "100",
			"bgAlpha" : "100",
			"canvasBorderColor" : "000000",
			"canvasBorderThickness" : "0.1",
			"paletteColors" : "#51BBFD",
			"plotGradientColor" : "4682B4",
			"plotFillAlpha" : "95,100",
			"plotFillRatio" : "20,80",
			"plotBorderColor" : "51BBFD",
			"plotSpacePercent" : "40",
			"caption" : "",
			"xaxisname" : "",
			"yaxisname" : "Log Count",
			"showvalues" : "0",
			"decimals" : "0",
			"formatnumberscale" : "0",
			"numDivLines" : "0",
			"toolTipSepChar" : " : ",
			"baseFontSize" : "9",
			"baseFontColor" : "286594",
			"chartLeftMargin" : "5",
			//"chartRightMargin" : "3",
			"chartBottomMargin" : "3",
			"chartTopMargin" : "5",
			"captionPadding" : "3",
			"labelDisplay" : "ROTATE",
			"labelPadding" : "10",
			"rotatelabels" : "1",
			"slantlabels" : "1"
		}
	};
	if (!!data) {
		if (data['obs_date']['gap'].indexOf("YEAR") >= 0) {
			chartLabel = "Year View (UTC)";
			chart_config.chart.caption = chartLabel;
			chart_config.chart.rotatelabels = 0;
			chart_config.chart.slantlabels = 0;
			chart_config.chart.labelDisplay = 'auto';
			for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
				t_data = {};
				t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
				t_data['label'] = t_date.getFullYear().toString();
				t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
				t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
				fdata.push(t_data);
			}

			if (FusionCharts('myOwnChart')) {
				FusionCharts('myOwnChart').setJSONData({
					"chart" : chart_config.chart,
					"data" : fdata
				});
				FusionCharts('myOwnChart').render("fchart");
			} else {
				barChart = new FusionCharts({
					type : "column2d",
					renderAt : "fchart",
					width : "100%",
					id : 'myOwnChart',
					height : "100%",
					dataFormat : "json",
					dataSource : {
						"chart" : chart_config.chart,
						"data" : fdata
					}
				});
				barChart.render("fchart");
			}
		} else if (data['obs_date']['gap'].indexOf("MONTH") >= 0) {
			chartLabel = "Month View (UTC)";
			chart_config.chart.caption = chartLabel;
			chart_config.chart.rotatelabels = 0;
			chart_config.chart.slantlabels = 0;
			chart_config.chart.labelDisplay = 'auto';
			for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
				t_data = {};
				t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
				t_data['label'] = t_date.getFullYear() + "-" + t_date.getMonthName().substring(0, 3);
				t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
				t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
				t_data['color'] = '0099FF';
				fdata.push(t_data);
			}
			if (FusionCharts('myOwnChart')) {
				FusionCharts('myOwnChart').setJSONData({
					"chart" : chart_config.chart,
					"data" : fdata
				});
				FusionCharts('myOwnChart').render("fchart");
			} else {
				barChart = new FusionCharts({
					type : "column2d",
					renderAt : "fchart",
					width : "100%",
					id : 'myOwnChart',
					height : "100%",
					dataFormat : "json",
					dataSource : {
						"chart" : chart_config.chart,
						"data" : fdata
					}
				});
				barChart.render("fchart");
			}
		} else if (data['obs_date']['gap'].indexOf("DAY") >= 0) {
			chartLabel = "Day of Month View (UTC)";
			chart_config.chart.caption = chartLabel;
			for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
				t_data = {};
				t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
				t_data['label'] = (t_date.getDate() > 9 ? t_date.getDate() : "0" + t_date.getDate()) + " " + t_date.getMonthName().substring(0, 3);
				t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
				t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
				t_data['color'] = '0099FF';
				fdata.push(t_data);
			}
			if (FusionCharts('myOwnChart')) {
				FusionCharts('myOwnChart').setJSONData({
					"chart" : chart_config.chart,
					"data" : fdata
				});
				FusionCharts('myOwnChart').render("fchart");
			} else {
				barChart = new FusionCharts({
					type : "column2d",
					renderAt : "fchart",
					width : "100%",
					id : 'myOwnChart',
					height : "100%",
					dataFormat : "json",
					dataSource : {
						"chart" : chart_config.chart,
						"data" : fdata
					}
				});
				barChart.render("fchart");
			}
		} else if (data['obs_date']['gap'].indexOf("HOUR") >= 0) {
			chartLabel = "Hours View (UTC) (HH:MM Month-Date)";
			chart_config.chart.caption = chartLabel;
			chart_config.chart.rotatelabels = 0;
			chart_config.chart.slantlabels = 0;
			chart_config.chart.labelDisplay = 'wrap';
			for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
				t_data = {};
				t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
				t_data['label'] = (t_date.getHours() > 9 ? t_date.getHours() : "0" + t_date.getHours()) + ":" + (t_date.getMinutes() > 9 ? t_date.getMinutes() : "0" + t_date.getMinutes()) + " " + t_date.getMonthName().substring(0, 3) + " " + t_date.getDate();
				t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
				t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
				t_data['color'] = '0099FF';
				fdata.push(t_data);
			}
			if (FusionCharts('myOwnChart')) {
				FusionCharts('myOwnChart').setJSONData({
					"chart" : chart_config.chart,
					"data" : fdata
				});
				FusionCharts('myOwnChart').render("fchart");
			} else {
				barChart = new FusionCharts({
					type : "column2d",
					renderAt : "fchart",
					width : "100%",
					id : 'myOwnChart',
					height : "100%",
					dataFormat : "json",
					dataSource : {
						"chart" : chart_config.chart,
						"data" : fdata
					}
				});
				barChart.render("fchart");
			}
		} else if (data['obs_date']['gap'].indexOf("MINUTES") >= 0) {
			chartLabel = "Minutes View (UTC) (HH:MM)";
			chart_config.chart.caption = chartLabel;
			for ( j = 0; j < 60; ++j) {
				for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
					t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
					if (t_date.getMinutes() == j) {
						break;
					}
				}
				t_data = {};
				if (i < data['obs_date'].counts.length / 2) {
					t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
				} else {
					t_data['value'] = 0;
				}
				t_data['label'] = (t_date.getHours() > 9 ? t_date.getHours() : "0" + t_date.getHours()) + ":" + (j > 9 ? j : "0" + j);
				t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
				t_data['color'] = '0099FF';
				fdata.push(t_data);
			}
			if (FusionCharts('myOwnChart')) {
				FusionCharts('myOwnChart').setJSONData({
					"chart" : chart_config.chart,
					"data" : fdata
				});
				FusionCharts('myOwnChart').render("fchart");
			} else {
				barChart = new FusionCharts({
					type : "column2d",
					renderAt : "fchart",
					width : "100%",
					id : 'myOwnChart',
					height : "100%",
					dataFormat : "json",
					dataSource : {
						"chart" : chart_config.chart,
						"data" : fdata
					}
				});
				barChart.render("fchart");
			}
		} else if (data['obs_date']['gap'].indexOf("SECONDS") >= 0) {
			chartLabel = "Seconds View (UTC) (MM:SS)";
			chart_config.chart.caption = chartLabel;
			for ( j = 0; j < 60; ++j) {
				for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
					t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
					if (t_date.getSeconds() == j) {
						break;
					}
				}
				t_data = {};
				if (i < data['obs_date'].counts.length / 2) {
					t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
				} else {
					t_data['value'] = 0;
				}
				t_data['label'] = (t_date.getSeconds() > 9 ? t_date.getSeconds() : "0" + t_date.getSeconds()) + ":" + (j > 9 ? j : "0" + j);
				//t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
				t_data['color'] = '0099FF';
				fdata.push(t_data);
			}
			if (FusionCharts('myOwnChart')) {
				FusionCharts('myOwnChart').setJSONData({
					"chart" : chart_config.chart,
					"data" : fdata
				});
				FusionCharts('myOwnChart').render("fchart");
			} else {
				barChart = new FusionCharts({
					type : "column2d",
					renderAt : "fchart",
					width : "100%",
					id : 'myOwnChart',
					height : "100%",
					dataFormat : "json",
					dataSource : {
						"chart" : chart_config.chart,
						"data" : fdata
					}
				});
				barChart.render("fchart");
			}
		} else {
			chartLabel = "Year View (UTC)";
			chart_config.chart.caption = chartLabel;
			for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
				t_data = {};
				t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
				t_data['label'] = t_date;
				t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
				t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
				t_data['color'] = '0099FF';
				fdata.push(t_data);
			}
			if (FusionCharts('myOwnChart')) {
				FusionCharts('myOwnChart').setJSONData({
					"chart" : chart_config.chart,
					"data" : fdata
				});
				FusionCharts('myOwnChart').render("fchart");
			} else {
				barChart = new FusionCharts({
					type : "column2d",
					renderAt : "fchart",
					width : "100%",
					id : 'myOwnChart',
					height : "100%",
					dataFormat : "json",
					dataSource : {
						"chart" : chart_config.chart,
						"data" : fdata
					}
				});
				barChart.render("fchart");
			}
		}
	} else {
		if (FusionCharts('myOwnChart')) {
			FusionCharts('myOwnChart').setJSONData({
				"chart" : {
					"caption" : chartLabel,
					"canvasBgColor" : "F6F6F6",
					"showBorder" : 1,
					"yAxisName" : "Log Count",
					"theme" : "zune"
				},
				"data" : []
			});
			FusionCharts('myOwnChart').render("fchart");
		} else {
			barChart = new FusionCharts({
				type : "column2d",
				renderAt : "fchart",
				width : "100%",
				id : 'myOwnChart',
				height : "100%",
				dataFormat : "json",
				dataSource : {
					"chart" : {
						"caption" : chartLabel,
						"canvasBgColor" : "F6F6F6",
						"showBorder" : 1,
						"yAxisName" : "Log Count",
						"theme" : "zune"
					},
					"data" : []
				}
			});
			barChart.render("fchart");
		}
	}
};

var drillDown = function(input) {
	
	var d, d1;
	d = new Date(input.replace('j-drillDown-', '').replace(/-/g, "/").replace('T', ' ').substring(0, 19));
	d1 = new Date(input.replace('j-drillDown-', '').replace(/-/g, "/").replace('T', ' ').substring(0, 19));
	
	angular.element('.gb-logvault').scope().customDateFilterApplied = false;
    angular.element('.gb-logvault').scope().getUTCTime = false;
    angular.element('.gb-logvault').scope().info.currentFacet = null;
    angular.element('.gb-logvault').scope().info.drillDown = true;

    //reset quick filter
	angular.element('.gb-logvault').scope().info.changedFilter = false;
	angular.element('.gb-logvault').scope().info.uploaded_by = null;

	switch(angular.element('.gb-logvault').scope().info.chartLevel) {
		case 'YEAR' :
			d.setMonth(0);
			d.setDate(1);
			// d.setHours(0);
			// d.setMinutes(0);
			// d.setSeconds(0);
			d1.setMonth(12);
			d1.setDate(0);
			d1.setHours(23);
			d1.setMinutes(59);
			d1.setSeconds(59);
			break;
		case 'MONTH' :
			d.setDate(1);
			// d.setHours(0);
			// d.setMinutes(0);
			// d.setSeconds(0);
			d1.setMonth(d1.getMonth() + 1);
			d1.setDate(0);
			d1.setHours(23);
			d1.setMinutes(59);
			d1.setSeconds(59);
			break;
		case 'DAY' :
			// d.setHours(0);
			// d.setMinutes(0);
			// d.setSeconds(0);
			d1.setHours(23);
			d1.setMinutes(59);
			d1.setSeconds(59);
			break;
		case 'HOUR' :
			// d.setMinutes(0);
			// d.setSeconds(0);
			d1.setMinutes(59);
			d1.setSeconds(59);
			break;
		case 'MINUTES' :
			// d.setSeconds(0);
			d1.setSeconds(59);
			break;
	}
	angular.element('.gb-logvault').scope().updateBreadCrumb(d, d1);
	angular.element('.gb-logvault').scope().setFromTo(d, d1);
};

var facetChart = function() {
	var f_div = $('<div class="gb-facet-chart-window"><div class="gb-facet-chart-window-title"><label class="radio-inline pull-left gb-modal-toolbar-radio-label"><input type="radio" name="facetChartType" value="bar"> Bar Chart </label><label class="radio-inline pull-left gb-modal-toolbar-radio-label"><input type="radio" name="facetChartType" value="line"> Line Chart</label><span class="icon-file-pdf gb-modal-toolbar-icon gb-modal-toolbar-icon-sendToPFD pull-left" title="Export As PDF"></span><span class="icon-image2 gb-modal-toolbar-icon pull-left" title="Export As Image"></span><span class="icon-close2 pull-right gb-modal-toolbar-controller gb-modal-toolbar-icon-close" title="close window"></span><span class="pull-right gb-modal-toolbar-controller" title="maximize window"></span>	</div><div class="gb-facet-chart-window-body"><div class="chart"></div>	</div></div>');
	$("body").append(f_div);
};
