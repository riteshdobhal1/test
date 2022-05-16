angular.module("gbApp.directives.rulesandalerts", [])

  //Main Directive for analytics modal used in rule-list.html file

  .directive("analyticsDashboards", function () {
    return {
      restrict: "AE",
      templateUrl: "partials/rules-and-alerts/analytics-dashboards.html",
      link: function (scope, element, attrs) { }
    };
  })
  //----------------END Main Directive------------------------------------------//

  //=================================GB Piechart Directive===================================//
  .directive("pieChart", function () {
    return {
      restrict: "AE",
      transclude: "true",
      scope: {
        type: "@type",
        charttitle: "@charttitle"
      },
      templateUrl: "partials/rules-and-alerts/analytics-pie-chart.html",
      controller: function ($scope, $interval, $timeout, $element, $attrs, RulesService, UtilService) {
        RulesService.getRulesConstants().then(function(response) {
          $scope.rulesconstants = response.data;
        }, function(response) {});
        var graphData = RulesService.getAnalytics($scope.type);
        var localTimmer;
        var current_type = $scope.type, noDataFound = false;
        var chartTitle = angular.copy($scope.charttitle );
        $scope.loading = true;//loader control
        $scope.gridView = false; //hide drill down grid
        $scope.pagination = UtilService.localPagination();
        function convertHex(hex, opacity) {
          hex = hex.replace('#', '');
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
          return result;
        }
        function convertHexFontColor(hex, opacity) {
          hex = hex.replace('#', '');
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          var sum = (r + g + b);
          if (sum > 600) {
            return 'rgba(80,80,80,1)';
          }
          return 'rgba(255,255,255,1)';
        }

        $scope.isNoDataFound = function () {
          return noDataFound;
        }

        $scope.goBackToChart = function () {
          $scope.gridView = false;
          $scope.charttitle = chartTitle;
        };

        var renderchart = function () {
          var current_graph_type = current_type;
          $interval.cancel(localTimmer);
          var width = d3.select(".gb-rules-analytics-dashboards-tile").node().getBoundingClientRect().width;
          var height = d3.select(".gb-chart-pie-cntr").node().getBoundingClientRect().height;
          var div_w = width;
          var div_h = height;
          var center = [div_w / 2, div_h / 2];
          var innerRadius = (Math.min(div_w, div_h) / 2) - 60;
          var outerRadius = (Math.min(div_w, div_h) / 2) - 20;
          $scope.loading = false;
          if (!graphData || !graphData.length) {
            noDataFound = true;
            return;
          }
          noDataFound = false;

          var data = graphData;

          var color = d3.scale.ordinal()
            .range(RulesService.getAnalyticsColor(current_graph_type));
          var pie = d3.layout.pie()
            .value(function (d) {
              return d.count;
            })
            .padAngle(0.04)
            .sort(null);
          var tooltip = d3.select($element[0].getElementsByClassName("gb-chart-pie-cntr")[0])
            .append('div')
            .attr('class', 'gb-chart-tooltips-style-1 tooltip');

          tooltip.append('div')
            .attr('class', 'label');

          tooltip.append('div')
            .attr('class', 'count');


          var svg = d3
            .select($element[0].getElementsByClassName("gb-chart-pie-cntr")[0])
            .append("svg")
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + div_w + " " + div_h)
            .append("g")
            .attr(
              "transform",
              "translate(" + center[0] + ", " + center[1] + ")"
            );
          var arc = d3.svg
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

          $scope.detailsData = [];
          var path = svg
            .datum(data)
            .selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("fill", function (d, i) {
              return color(i);
            })
            .attr("d", arc)
            // set wedge opacity to 0 if it has mass on load (only the last wedge has mass to account for transition in
            //.style('opacity', function (d) { return d.data[0] === 0 ? 1 : 0; })
            .each(function (d) {
              this._current = d;
            })
            .on("mouseover", function (d, i) {
              tooltip.select('.label').html(d.data.name);
              tooltip.select('.count').html(d.data.count);
              tooltip.style('display', 'block');
              tooltip.style('opacity', 2);
              tooltip.style("background", '#faebd7')
              d3.select(this).style('cursor', 'pointer');
              d3
                .select(this)
                .transition()
                .duration(500)
                .ease("elastic")
                .attr("transform", function (d) {
                  var dist = 10;
                  d.midAngle = (d.endAngle - d.startAngle) / 2 + d.startAngle;
                  var x = Math.sin(d.midAngle) * dist;
                  var y = -Math.cos(d.midAngle) * dist;
                  return "translate(" + x + "," + y + ")";
                });
            })
            .on('mousemove', function (d) {
              tooltip.style('top', (d3.event.layerY + 20) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
            })
            .on("mouseout", function (d, i) {

              d3.select(this).style('cursor', 'auto');
              tooltip.style('display', 'none');
              tooltip.style('opacity', 0);
              d3.select(this)
                .transition()
                .duration(500)
                .ease("bounce")
                .attr("transform", "translate(0,0)");
            })
            .on("click", function (d, i) {
              var actualRecords = d.data.rules ? d.data.rules : [];
              if(actualRecords.length == 0){
                return;
              }
              $scope.pagination.init(actualRecords);
              $scope.gridView = true;
              if ($scope.type == "status") {
                $scope.statusShowFlag = false;
                $scope.priorityShowFlag = true;
                $scope.severityShowFlag = true;
                $scope.charttitle = d.data['name'] + " Rules";
              } else if ($scope.type == "priority") {
                $scope.statusShowFlag = true;
                $scope.priorityShowFlag = false;
                $scope.severityShowFlag = true;
                $scope.charttitle = d.data['name'] + " Priority Rules";
              } else if ($scope.type == "severity") {
                $scope.statusShowFlag = true;
                $scope.priorityShowFlag = true;
                $scope.severityShowFlag = false;
                $scope.charttitle = d.data['name'] + " Severity Rules";
              }

            });

          var g = svg
            .datum(data)
            .selectAll(".arc")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "arc");

          var piedata = pie(graphData);
          //add legend
          var legendCntr = $($element[0].getElementsByClassName("gb-chart-pie-legend-cntr")[0]);
          var str = "", bgColor = "", fontColor = "";
          for (var i = 0; i < piedata.length; i++) {
            bgColor = convertHex(color(i), 100);
            fontColor = convertHexFontColor(color(i), 100);
            str = str + '<div class="gb-legend" style="background: ' + bgColor + ';color: ' + fontColor + ' ">' + piedata[i].data.name + '(' + piedata[i].value + ')</div>';
          }
          legendCntr.append(str);
          $scope.loading = false;
        };

        //Local timer function to get the width od dov only after it is rendered on screen and then call renderchart()
        localTimmer = $interval(function () {
          //draw chart if width & height is greater than 0  && api data is available
          if (d3.select(".gb-rules-analytics-dashboards-tile").node() && d3.select(".gb-rules-analytics-dashboards-tile").node().getBoundingClientRect() && d3.select(".gb-rules-analytics-dashboards-tile").node().getBoundingClientRect().width > 0 && RulesService.getAnalyticsLoaderWait()) {
            graphData = RulesService.getAnalytics($scope.type);
            renderchart();
          }
        }, 100);
      }
    };
  })
  //=================================GB Piechart Directive with load data===================================//
  .directive("pieChartLoad", function () {

    return {
      restrict: "AE",
      transclude: "true",
      scope: {
        type: "@type",
        charttitle: "@charttitle"
      },
      templateUrl: "partials/rules-and-alerts/analytics-pie-chart.html",
      controller: function ($scope, $interval, $timeout, $element, $attrs, RulesService) {
        RulesService.getRulesConstants().then(function(response) {
          $scope.rulesconstants = response.data;
        }, function(response) {});
        var localTimmer;
        var current_type = $scope.type, st, et, selectedDate, noDataFound = false;
        $scope.loading = true;
        $scope.$on('analytics-timefilter-changes', function (event, args) {
          selectedDate = args;
          if (selectedDate) {
            st = moment(selectedDate.startTime).format('YYYY-MM-DD') + "T" + "00:00:00Z";
            et = moment(selectedDate.endTime).format('YYYY-MM-DD') + "T" + "23:59:59";
            callAPI(st, et);
          }
        });

        var callAPI = function (st, et) {
          $scope.loading = true;
          //ajax call for data to be rendered
          RulesService.getAlertsTriggerBySeverity(st, et).then(function (response) {
            $scope.loading = false;
            var response = response.data.Data;
            var chartData = processDate(response);
            renderchart(chartData);
          }, function (response) {
            $scope.loading = false;
            noDataFound = true;
            renderchart([]);
          });
        }
        $scope.isNoDataFound = function () {
          return noDataFound;
        }
        var processDate = function (data) {
          if (!data) { noDataFound = true; return []; }
          noDataFound = false;
          var flatData = {}, list = [], severityObj;
          data.forEach(function (item) {
            severityObj = item.severitiesObject;
            for (var key in severityObj) {
              if (!flatData[key]) {
                flatData[key] = severityObj[key];
              } else {
                flatData[key] = flatData[key] + severityObj[key];
              }
            }
          });
          if (flatData) {
            for (var key in flatData) {
              list.push({ name: key, count: flatData[key] });
            }
          }
          return list;
        };

        function convertHex(hex, opacity) {
          hex = hex.replace('#', '');
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
          return result;
        }

        function convertHexFontColor(hex, opacity) {
          hex = hex.replace('#', '');
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          var sum = (r + g + b);
          if (sum > 600) {
            return 'rgba(80,80,80,1)';
          }
          return 'rgba(255,255,255,1)';
        }

        var renderchart = function (graphData) {
          var current_graph_type = current_type;
          $interval.cancel(localTimmer);
          var width = d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverity").node().getBoundingClientRect().width;
          var height = $($element[0].getElementsByClassName('gb-chart-pie-cntr')).height();
          var div_w = width;
          var div_h = height;
          var center = [div_w / 2, div_h / 2];
          var innerRadius = (Math.min(div_w, div_h) / 2) - 60;
          var outerRadius = (Math.min(div_w, div_h) / 2) - 20;
          var data = graphData;

          var color = d3.scale.ordinal()
            .range(RulesService.getAnalyticsColor(current_graph_type));
          var pie = d3.layout.pie()
            .value(function (d) {
              return d.count;
            })
            .padAngle(0.04)
            .sort(null);
          var tooltip = d3.select($element[0].getElementsByClassName("gb-chart-pie-cntr")[0])
            .append('div')
            .attr('class', 'tooltip');

          tooltip.append('div')
            .attr('class', 'label');

          tooltip.append('div')
            .attr('class', 'count');

          var cntr = d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverity .gb-chart-pie-cntr svg")
          if (cntr) {
            cntr.remove();
          }

          var svg = d3
            .select($element[0].getElementsByClassName("gb-chart-pie-cntr")[0])
            .append("svg")
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + div_w + " " + div_h)
            .append("g")
            .attr(
              "transform",
              "translate(" + center[0] + ", " + center[1] + ")"
            );
          var arc = d3.svg
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

          var path = svg
            .datum(data)
            .selectAll("path")
            .data(pie)
            .enter()
            .append("path")
            .attr("fill", function (d, i) {
              return color(i);
            })
            .attr("d", arc)
            // set wedge opacity to 0 if it has mass on load (only the last wedge has mass to account for transition in
            //.style('opacity', function (d) { return d.data[0] === 0 ? 1 : 0; })
            .each(function (d) {
              this._current = d;
            })
            .on("mouseover", function (d, i) {
              tooltip.select('.label').html(d.data.name).style('color', 'black');
              tooltip.select('.count').html(d.data.count);
              tooltip.style('display', 'block');
              tooltip.style('opacity', 2);
              tooltip.style("background", '#ecf0f1');
              d3
                .select(this)
                .transition()
                .duration(500)
                .ease("elastic")
                .attr("transform", function (d) {
                  var dist = 10;
                  d.midAngle = (d.endAngle - d.startAngle) / 2 + d.startAngle;
                  var x = Math.sin(d.midAngle) * dist;
                  var y = -Math.cos(d.midAngle) * dist;
                  return "translate(" + x + "," + y + ")";
                });
            })
            .on('mousemove', function (d) {
              tooltip.style('top', (d3.event.layerY + 20) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
            })
            .on("mouseout", function (d, i) {
              tooltip.style('display', 'none');
              tooltip.style('opacity', 0);
              d3.select(this)
                .transition()
                .duration(500)
                .ease("bounce")
                .attr("transform", "translate(0,0)");
            });

          var g = svg
            .datum(data)
            .selectAll(".arc")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "arc");

          var piedata = pie(graphData);
          //add legend
          var legendCntr = $($element[0].getElementsByClassName("gb-chart-pie-legend-cntr")[0]);
          if (legendCntr) {
            legendCntr[0].innerHTML = "";
          }
          var str = "", bgColor = "", fontColor = "";
          for (var i = 0; i < piedata.length; i++) {
            bgColor = convertHex(color(i), 100);
            fontColor = convertHexFontColor(color(i), 100);
            str = str + '<div class="gb-legend" style="background: ' + bgColor + ';color: ' + fontColor + ' ">' + piedata[i].data.name + '(' + piedata[i].value + ')</div>';
          }
          legendCntr.append(str);
        };

        $scope.loading = true;
        selectedDate = RulesService.getSelectedTimeFilter();
        st = moment(selectedDate.startTime).format('YYYY-MM-DD') + "T" + "00:00:00Z";
        et = moment(selectedDate.endTime).format('YYYY-MM-DD') + "T" + "23:59:59";
        //ajax call for data to be rendered
        RulesService.getAlertsTriggerBySeverity(st, et).then(function (response) {
          $scope.loading = false;
          var response = response.data.Data;
          var chartData = processDate(response);
          //Local timer function to get the width od dov only after it is rendered on screen and then call renderchart()
          localTimmer = $interval(function () {
            if (d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverity").node() && d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverity").node().getBoundingClientRect() && d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverity").node().getBoundingClientRect().width > 0) {
              renderchart(chartData);
            }
          }, 100);
        }, function (response) {
          $scope.loading = false;
          noDataFound = true;
          renderchart([]);
        });

      }
    };
  })

  //=================================-----END ----GB PIECHART Directive----END===================================//

  //=================================GB HEATMAP Directive===================================//
  .directive("gbHeatmap", function () {
    return {
      restrict: "AE",
      transclude: "true",
      scope: {
        type: "@type",
        charttitle: "@charttitle"
      },
      templateUrl: "partials/rules-and-alerts/analytics-heat-map.html",
      controller: function ($scope, $interval, $timeout, $element, $attrs, RulesService, GlobalService) {
        RulesService.getRulesConstants().then(function(response) {
          $scope.rulesconstants = response.data;
        }, function(response) {});
        var graphData = RulesService.getAnalytics($scope.type);
        var localTimmer;
        var current_type = $scope.type, noDataFound = false, minValue=0, maxValue=0;
        $scope.loading = true;
        $scope.legend = [];

        $scope.isNoDataFound = function () {
          return noDataFound;
        }
        // Process data  
        var processData = function(records) {
          if(!records) return {"data": [], "RANGE":[], "COLORS":[]};
          var minValue = 0,maxValue = 0, legend = [], numRange = [], colorPatern = GlobalService.getVal('rulesAnalyticsHeadMapColorPattern');// ["rgba(7, 128, 228, 0.1)", "rgba(7, 128, 228, 0.3)", "rgba(7, 128, 228, 0.5)", "rgba(7, 128, 228, 0.7)", "rgba(7, 128, 228, 0.9)", "rgba(7, 128, 228, 1)"];
    
          var data = records.map(function (item) {
            var newItem = {};
            newItem.creator = item.x;
            newItem.category = item.y;
            newItem.value = item.value;
            //Calculate MAX and MIN value
            if(minValue == 0){
              minValue = item.value;
            }else if(item.value < minValue){
              minValue = item.value;
            }
            if(maxValue == 0){
              maxValue = item.value;
            }else if(item.value > maxValue){
              maxValue = item.value;
            }
            return newItem;
          });
          if(maxValue && maxValue >= 5){
            //divide into five equals
            var eachPart = Math.ceil(maxValue/5);
            numRange.push(0);
            numRange.push(1);
            numRange.push(eachPart * 1);
            numRange.push(eachPart * 2);
            if(!((eachPart * 3) > maxValue)){
              numRange.push(eachPart * 3);
            }else{
              numRange.push(maxValue);
            }
          }else{
            numRange.push(0);
            numRange.push(1);
            numRange.push(maxValue);
          }
          numRange.map(function(item, i){
            legend.push({label:item, color: colorPatern[i]});
          });
          return {"data": data,"RANGE":numRange, "COLORS":colorPatern, "LEGEND":legend};
        }

        //create container for tooltips
        var tooltip = d3.select($element[0].getElementsByClassName("gb-heat-map-cntr")[0])
          .append('div')
          .attr("class", "tooltip gb-heat-map-tooltip")			
          .style("opacity", 0);
        tooltip.append('div')
          .attr('class', 'gb-heat-map-tooltip-count');
        tooltip.append('div')
          .attr('class', 'gb-heat-map-tooltip-creator');          
        tooltip.append('div')
          .attr('class', 'gb-heat-map-tooltip-catagory');
        
        tooltip.select('div.gb-heat-map-tooltip-creator')
          .append('span')
          .attr('class', 'gb-heat-map-tooltip-icon glyphicon glyphicon-user');

        tooltip.select('div.gb-heat-map-tooltip-catagory')
        .append('span')
        .attr('class', 'gb-heat-map-tooltip-icon glyphicon glyphicon-list-alt');

        tooltip.select('div.gb-heat-map-tooltip-creator')
          .append('div')
          .attr('class', 'gb-heat-map-tooltip-label');

        tooltip.select('div.gb-heat-map-tooltip-catagory')
        .append('div')
        .attr('class', 'gb-heat-map-tooltip-label');

        var renderchart = function () {
          $interval.cancel(localTimmer);
          $scope.loading = false;
          if (!graphData || !graphData.length) {
            noDataFound = true;
            return;
          }
          noDataFound = false;
          var processedData = processData(graphData);
          var data = processedData.data;
          $scope.legend = processedData.LEGEND;

          var itemSize = 20, // default height and width of each cell
            cellWidth = itemSize - 1, cellHeight = itemSize - 1,
            margin = { top: 80, right: 20, bottom: 20, left: 80 };

          // Get parent container height and width  
          var parentCntrWidth = d3
            .select(".gb-rules-analytics-dashboards-heatmap-tile")
            .node()
            .getBoundingClientRect().width;
          var parentCntrHeight = d3
            .select(".gb-rules-analytics-dashboards-heatmap-tile .chartContainer")
            .node()
            .getBoundingClientRect().height;

          // Actual chart container height and width i.e SVG's height and width
          var svgWidth = parentCntrWidth - margin.right - margin.left,
            svgHeight = parentCntrHeight - margin.top - margin.bottom;

          //Get count of the value along with X-axis and Y-axis
          var x_elements = d3
          .set(
            data.map(function (item) {
              return item.category;
            })
          )
          .values(),
          y_elements = d3
            .set(
              data.map(function (item) {

                return item.creator;
              })
            )
            .values();

          cellHeight = Math.floor(svgHeight / y_elements.length);
          if(svgWidth < Math.floor(cellWidth * x_elements.length)){
            svgWidth =  Math.floor(cellWidth * x_elements.length)
          }else{
            cellWidth = Math.floor(svgWidth / x_elements.length);
            if (cellWidth < 20) {
              cellWidth = 20;
            }
          }
          svgWidth = Math.ceil(cellWidth * x_elements.length);

          var xScale = d3.scale
            .ordinal()
            .domain(x_elements)
            .rangeBands([0, (x_elements.length * cellWidth)]);

          var xAxis = d3.svg
            .axis()
            .scale(xScale)
            .tickFormat(function (d) {
              var str = d + "";
              if (str.length > 10) {
                str = str.substr(0, 10) + "..."; //Limiting the value to 6 digits & concatinating Elipses
              }
              return str;
            })
            .orient("top");

          var yScale = d3.scale
            .ordinal()
            .domain(y_elements)
            .rangeBands([0, y_elements.length * cellHeight]);

          var yAxis = d3.svg
            .axis()
            .scale(yScale)
            .tickFormat(function (d) {
              var str = d + "";
              if(str.indexOf('@') != -1){
                var str_trimmed = str.substring(0, str.indexOf('@')); //remove email domain from string
                if (str_trimmed.length > 8) {
                  str_trimmed = str_trimmed.substr(0, 8) + "..."; //Limiting the value to 6 digits & concatinating Elipses
                }
                return str_trimmed;
              }
              return str;
            })
            .orient("left");

          var colorScale = d3.scale
            .threshold()
            .domain(processedData.RANGE)
            .range(processedData.COLORS);

          var svg = d3
            .select($element[0].getElementsByClassName("gb-heat-map-cntr")[0])
            .append("svg")
            .classed("svg-content-responsive", false)
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", (svgWidth+ margin.left) +"px")
            .attr("height", (svgHeight + margin.top) +"px")
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .attr("preserveAspectRatio", "xMinYMin meet")
            //.attr("viewBox", "0 0 " + (svgWidth+ margin.left) + " " +  (svgHeight + margin.top))
            //.attr("preserveAspectRatio", "xMinYMin meet")
            //.attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)
            // .attr('viewBox','0 0 '+Math.min(parentCntrWidth) +' '+Math.min(parentCntrWidth) )

            .append("g")
            //.attr("transform", "translate(" + Math.min(parentCntrWidth) / 2 + "," + Math.min(parentCntrWidth) / 2 + ")");
            .attr(
              "transform",
              "translate(" + margin.left  + "," + margin.top + ")"
            );

          var cells = svg
            .selectAll("rect")
            .data(data)
            .enter()
            .append("g")
            .append("rect")
            .attr("class", "cell")
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .attr("y", function (d) {
              return yScale(d.creator);
            })
            .attr("x", function (d) {
              return xScale(d.category);
            })
            .attr("fill", function (d) {
              return colorScale(d.value);
            })
            .on("mouseover", function(d) {
              if(!d.value) return;
              if(!d.creator) d.creator = "";
              if(!d.category) d.category = "";
              //highlight the cell
              d3.select(this).style("stroke","#fff");
              d3.select(this).attr("stroke-width","1");
              //show tooltips
              tooltip.transition()
                  .duration(200)
                  .style("opacity", 1);
              //check if the box is on end of right
              var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 200;
              var maxWidth = Math.min((Math.max(d.creator.length,d.category.length) * 8), 220);
              if(d3.event.pageX >= w){
                tooltip.style("left", (d3.event.layerX - maxWidth) + "px")
                  .style("top", (d3.event.layerY + 10) + "px");
              }else{
                tooltip.style("left", (d3.event.layerX - 20) + "px")
                    .style("top", (d3.event.layerY + 10) + "px");
              }
              //update tooltip with data
              tooltip.select('div.gb-heat-map-tooltip-count').html(d.value);
              tooltip.select('div.gb-heat-map-tooltip-creator .gb-heat-map-tooltip-label').html(d.creator);
              tooltip.select('div.gb-heat-map-tooltip-catagory .gb-heat-map-tooltip-label').html(d.category);
              })	
          
          .on('mousemove', function (d) {
            if(!d.value) return;
            if(!d.creator) d.creator = "";
            if(!d.category) d.category = "";
            //check if the box is on end of right
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 200;
            var maxWidth = Math.min((Math.max(d.creator.length,d.category.length) * 8), 220);
            if(d3.event.pageX >= w){
              tooltip.style("left", (d3.event.layerX - maxWidth) + "px")
                .style("top", (d3.event.layerY + 10) + "px");
            }else{
              tooltip.style("left", (d3.event.layerX - 20) + "px")
                  .style("top", (d3.event.layerY + 10) + "px");
            }
          })				
          .on("mouseout", function(d) {		
            if(!d.value) return;
            //reset cell style
            d3.select(this).attr("stroke","");
            d3.select(this).attr("stroke-width","0");
            //hide tooltip
            tooltip.transition()		
                  .duration(500)		
                  .style("opacity", 0);	
          })

          svg
            .append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll("text")
            .attr("font-weight", "normal")
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            // .attr("transform", "rotate(-45)")
            .append('title')
            .text(function (d) {
              return d;
            });

          svg
            .append("g")
            .attr("class", "x axis")
            .call(xAxis)
            .selectAll("text")
            .attr("font-weight", "normal")
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .style("text-anchor", "start")
            .attr("dx", ".8em")
            .attr("dy", ".5em")
            .attr("transform", function (d) {
              return "rotate(-65)";
            })
            .append('title')
            .text(function (d) {
              return d;
            });

            // Make legend
            var legend = d3
            .select($element[0].getElementsByClassName("gb-heatmap-legend-container")[0])
            .append("svg")
            .classed("svg-content-responsive", false)
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", (parentCntrWidth - 80) +"px")
            .attr("height", "30px");

            legend.append("g")
              .selectAll('rect')
              .data($scope.legend)
              .enter()
              .append('rect')
              .attr('height', "10px")
              .attr('width', "40px")
              .attr('x', function(d, i){
                return (i* 40)+1;
              })
              .attr('y', "8px")
              .attr('fill', function(d){
                return d.color;
              });

            legend.append("g")
              .selectAll("text")
              .data($scope.legend)
              .enter()
              .append('text')
              .attr("font-weight", "normal")
              .attr("font-family", "sans-serif")
              .attr("font-size", "8px")
              .style("text-anchor", "start")
              .attr("fill", "#304b6c")
              .attr("dx", function(d, i){
                return (i* 40)+1 + 20;
              })
              .attr("dy", "27px")
              .text(function(d){
                return d.label;
              });



        };
        localTimmer = $interval(function () {
          //check if DOM is ready and data is available
          if (d3.select(".gb-rules-analytics-dashboards-heatmap-tile").node() && d3.select(".gb-rules-analytics-dashboards-heatmap-tile").node().getBoundingClientRect() && d3.select(".gb-rules-analytics-dashboards-heatmap-tile").node().getBoundingClientRect().width > 0 && RulesService.getAnalyticsLoaderWait()) {
            graphData = RulesService.getAnalytics($scope.type);
            renderchart();
          }
        }, 100);
      }
    };
  })
  //=================================END------GB HEATMAP Directive-----END===================================//

  //=================================Stacked chart directive===================================//
  .directive("gbStackedchart", function () {
    return {
      restrict: "AE",
      transclude: "true",
      scope: {
        type: "@type",
        charttitle: "@charttitle"
      },
      templateUrl: "partials/rules-and-alerts/analytics-stacked-chart.html",
      controller: function ($scope, $interval, $timeout, $element, $attrs, RulesService) {
        RulesService.getRulesConstants().then(function(response) {
          $scope.rulesconstants = response.data;
        }, function(response) {});
        var localTimmer;
        var current_type = $scope.type, st, et, selectedDate, noDataFound = false;
        $scope.loading = true;
        selectedDate = RulesService.getSelectedTimeFilter();
        st = moment(selectedDate.startTime).format('YYYY-MM-DD') + "T" + "00:00:00Z";
        et = moment(selectedDate.endTime).format('YYYY-MM-DD') + "T" + "23:59:59";

        $scope.loading = true;
        $scope.$on('analytics-timefilter-changes', function (event, args) {
          selectedDate = args;
          if (selectedDate) {
            st = moment(selectedDate.startTime).format('YYYY-MM-DD') + "T" + "00:00:00Z";
            et = moment(selectedDate.endTime).format('YYYY-MM-DD') + "T" + "23:59:59";
            callAPI(st, et);
          }
        });

        var callAPI = function (st, et) {
          $scope.loading = true;
          //ajax call for data to be rendered
          RulesService.getAlertsTriggerBySeverity(st, et).then(function (response) {
            $scope.loading = false;
            var response = response.data.Data;
            var chartData = processDate(response);
            renderchart(chartData);
          }, function (response) {
            $scope.loading = false;
            noDataFound = true;
            renderchart([]);
          });
        }
        $scope.isNoDataFound = function () {
          return noDataFound;
        }
        var processDate = function (data) {
          if (!data) { noDataFound = true; return [] };
          noDataFound = false;
          var flatData = {}, list = [], severityObj, tempObj = {};
          data.forEach(function (item) {
            severityObj = item.severitiesObject;
            for (var key in severityObj) {
              if (!flatData[key]) {
                flatData[key] = severityObj[key];
              } else {
                flatData[key] = flatData[key] + severityObj[key];
              }
            }
          });
          if (flatData) {
            data.forEach(function (item) {
              tempObj = {};
              tempObj["day"] = item.day;
              for (var key in flatData) {
                if (!item.severitiesObject[key]) {
                  tempObj[key] = 0;
                } else {
                  tempObj[key] = item.severitiesObject[key];
                }
              }
              list.push(angular.copy(tempObj));
            });
          }
          list = sortByDate(list);
          return list;
        };

        var minTwoDigitMonthDay = function (date1) {
          var day, month, year, value = "";
          year = date1[0];
          month = date1[1];
          day = date1[2];
          month = parseInt(month, 10) < 10 ? '0' + month : month;
          day = parseInt(day, 10) < 10 ? '0' + day : day;
          value = year + "-" + month + "-" + day;
          return value;
        }
        var sortByDate = function (list) {
          list.sort(function (item1, item2) {
            var fromDate, year, month, day, toDate;
            var date1 = angular.copy(item1.day.split("-"));
            var date2 = angular.copy(item2.day.split("-"));

            fromDate = minTwoDigitMonthDay(date1);

            toDate = minTwoDigitMonthDay(date2);

            var date1 = new Date(fromDate);
            var date2 = new Date(toDate);
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
          });
          return list;
        };
        function convertHex(hex, opacity) {
          hex = hex.replace('#', '');
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
          return result;
        }
        function convertHexFontColor(hex, opacity) {
          hex = hex.replace('#', '');
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          var sum = (r + g + b);
          if (sum > 600) {
            return 'rgba(80,80,80,1)';
          }
          return 'rgba(255,255,255,1)';
        }

        var renderchart = function (data) {
          var current_graph_type = current_type;
          $interval.cancel(localTimmer);
          var myWidth = d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverityByTime").node().getBoundingClientRect().width;
          var myHeight = $($element[0].getElementsByClassName('gb-chart-pie-cntr')).height();

          var margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 60
          },
            width = myWidth - margin.left - margin.right,
            height = myHeight - margin.top - margin.bottom,
            that = this;


          var x = d3.scale.ordinal().rangeRoundBands([0, width], .3);

          var y = d3.scale.linear().rangeRound([height, 0]);

          var color = d3.scale.category20();

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(function (d) {
              var formatedDate = moment(minTwoDigitMonthDay(d.split("-"))).format("MMM DD");
              return formatedDate;
            });

          var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".0%"));


          var cntr = d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverityByTime .gb-chart-pie-cntr svg")
          if (cntr) {
            cntr.remove();
          }


          var svg = d3.select($element[0].getElementsByClassName("gb-chart-pie-cntr")[0])
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "day";
          }));
          var tooltip = d3.select($element[0].getElementsByClassName("gb-chart-pie-cntr")[0])
            .append('div')
            .attr('class', 'tooltip');
          tooltip.append('div')
            .attr('class', 'label');


          data.forEach(function (d) {
            var y0 = 0;
            d.rates = color.domain().map(function (name) {
              return {
                name: name,
                y0: y0,
                y1: y0 += +d[name],
                amount: d[name]
              };
            });
            d.rates.forEach(function (d) {
              d.y0 /= y0;
              d.y1 /= y0;
            });
          });

          //  data.sort(function (a, b) {
          //    return b.rates[0].y1 - a.rates[0].y1;
          //  });

          x.domain(data.map(function (d) {
            return d.day;
          }));

          svg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-65),translate(-7,-13)")
            .style("text-anchor", "end");

          svg.append("g").attr("class", "y axis").call(yAxis);

          var interest_rate = svg.selectAll(".interest-rate").data(data).enter().append("g").attr("class", "interest-rate").attr("transform", function (d) {
            return "translate(" + x(d.day) + ",0)";
          });

          interest_rate.selectAll("rect").data(function (d) {
            return d.rates;
          }).enter().append("rect").attr("width", x.rangeBand()).attr("y", function (d) {
            return y(d.y1);
          }).attr("height", function (d) {
            return y(d.y0) - y(d.y1);
          }).style("fill", function (d) {
            return color(d.name);
          }).on('mouseover', function (d) {
            var total_amt;
            total_amt = d.amount.toFixed(2);
            //tooltip.select('.label').html('Alerts: <strong>' +total_amt.toFixed(2) + '</strong>').style('color','black');
            tooltip.select('.label').html(d.amount).style('color', 'black');
            tooltip.style('display', 'block');
            tooltip.style('opacity', 2);
            tooltip.style("background", '#ecf0f1')
          })
            .on('mousemove', function (d) {
              tooltip.style('top', (d3.event.layerY + 20) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
            })
            .on('mouseout', function () {
              tooltip.style('display', 'none');
              tooltip.style('opacity', 0);
            });
          // Prep the tooltip bits, initial display is hidden

          var legends = color.domain();
          //add legend
          var legendCntr = $($element[0].getElementsByClassName("gb-chart-pie-legend-cntr")[0]);
          if (legendCntr) {
            legendCntr[0].innerHTML = "";
          }
          var str = "", bgColor = "", fontColor = "";
          for (var i = 0; i < legends.length; i++) {
            bgColor = convertHex(color(legends[i]), 100);
            fontColor = convertHexFontColor(color(legends[i]), 100);
            str = str + '<div class="gb-legend" style="background: ' + bgColor + ';color: ' + fontColor + ' ">' + legends[i] + '</div>';
          }
          legendCntr.append(str);

        };

        //ajax call for data to be rendered
        RulesService.getAlertsTriggerBySeverity(st, et).then(function (response) {
          $scope.loading = false;
          var response = response.data.Data;
          var chartData = processDate(response);
          //Local timer function to get the width od dov only after it is rendered on screen and then call renderchart()
          localTimmer = $interval(function () {
            if (d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverityByTime").node() && d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverityByTime").node().getBoundingClientRect() && d3.select(".gb-rules-analytics-dashboards-tile.gb-rules-analytics-alertsTriggeredBySeverityByTime").node().getBoundingClientRect().width > 0) {
              renderchart(chartData);
            }
          }, 100);
        }, function (response) {
          $scope.loading = false;
          noDataFound = true;
          renderchart([]);
        });

      }
    };
  })
  //=================================---END-----Stacked chart directive----END----===================================//

  //=================================Top Ten Rules Table ===================================//
  .directive("gbToprules", function () {
    return {
      restrict: "AE",
      transclude: "true",
      scope: {
        type: "@type",
        charttitle: "@charttitle"
      },
      templateUrl: "partials/rules-and-alerts/analytics-top-10-rules.html",
      controller: function ($scope, $interval, $timeout, $element, $attrs, RulesService) {
        RulesService.getRulesConstants().then(function(response) {
          $scope.rulesconstants = response.data;
        }, function(response) {});
        $scope.tableData = [];
        var current_type = $scope.type, st, et, selectedDate;
        $scope.loading = true;
        selectedDate = RulesService.getSelectedTimeFilter();
        st = moment(selectedDate.startTime).format('YYYY-MM-DD') + "T" + "00:00:00Z";
        et = moment(selectedDate.endTime).format('YYYY-MM-DD') + "T" + "23:59:59";

        $scope.$on('analytics-timefilter-changes', function (event, args) {
          selectedDate = args;
          if (selectedDate) {
            st = moment(selectedDate.startTime).format('YYYY-MM-DD') + "T" + "00:00:00Z";
            et = moment(selectedDate.endTime).format('YYYY-MM-DD') + "T" + "23:59:59";
            callAPI(st, et);
          }
        });

        var callAPI = function (st, et) {
          $scope.loading = true;
          //ajax call for data to be rendered
          RulesService.getTopTenRulesByAlerts(st, et).then(function (response) {
            $scope.loading = false;
            var response = response.data.Data;
            $scope.tableData = response;
          }, function (response) {
            $scope.loading = false;
            $scope.tableData = [];
          });
        }
        callAPI(st, et);
      }
    };
  })
  //=================================---END----Top Ten Rules Table-----END ===================================//


  //==================================RULE Wise Anlytics   Directive========================================//

  .directive("ruleAnalyticsDashboard", function () {
    return {
      restrict: "AE",
      transclude: "true",
      scope: {
        type: "@type",
        charttitle: "@charttitle"
      },
      templateUrl: "partials/rules-and-alerts/rule-wise-analytics-dashboard.html",
      controller: function ($scope, $interval, $timeout, $element, $attrs, RulesService, GlobalService, UserTrackingService) {
        RulesService.getRulesConstants().then(function(response) {
          $scope.rulesconstants = response.data;
        }, function(response) {});
        var localTimmer, current_type = $scope.type, st, et, selectedDate, noDataFound = false, SELECTED_RULE, RULE_ID;
        $scope.info = {};
        // Stores application name which is used for user tracking
        $scope.info.application = GlobalService.getVal('navRules');
        $scope.timefilter = GlobalService.getVal('alertTimeFilter');
        $scope.selectedTimeFilter = $scope.timefilter[0];
        $scope.maxToDate = moment.utc().format();
        $scope.minFromDate = moment().subtract(30, 'day').utc().format();
        $scope.loading = true;
        $scope.completeAlertsCount = "0";
        $scope.ruleAlertCount = 0;
        $scope.totalRuleAlertCount = 0;
        $scope.customTimeMsg = GlobalService.getVal('analyticsCustomTimeMsg');
        st = moment($scope.selectedTimeFilter.startTime).format('YYYY-MM-DD') + "T" + "00:00:00Z";
        et = moment($scope.selectedTimeFilter.endTime).format('YYYY-MM-DD') + "T" + "23:59:59";

        SELECTED_RULE = RulesService.getSelectedRuleForAnalytics();
        if (SELECTED_RULE) {
          RULE_ID = SELECTED_RULE['rule_id'];
        }

        $scope.alertsGraphTimeFilterChange = function (item) {
          $scope.selectedTimeFilter = item;
          if (item.label != 'Custom filter') {
            $scope.applyTimeFilter();
          }
          $scope.trackUser(item);
        }

        $scope.applyTimeFilter = function () {
          if ($scope.selectedTimeFilter) {
            st = moment($scope.selectedTimeFilter.startTime).format('YYYY-MM-DD') + "T" + "00:00:00Z";
            et = moment($scope.selectedTimeFilter.endTime).format('YYYY-MM-DD') + "T" + "23:59:59";
            callAPI(st, et);
            $scope.trackUser($scope.selectedTimeFilter);
          }
        }

        var callAPI = function (st, et) {
          $scope.loading = true;
          noDataFound = false;
          //ajax call for data to be rendered
          RulesService.getAlertsOfARule(RULE_ID, st, et).then(function (response) {
            var response = response.data.Data;
            var chartData = processDate(response);
            renderchart(chartData);
            loadTotalAlerts(st, et);
          }, function (response) {
            $scope.loading = false;
            noDataFound = true;
            renderchart([]);
          });
        }
        var processDate = function (data) {
          return data;
        }

        var sortByDate = function (list) {
          list.sort(function (item1, item2) {
            var fromDate, year, month, day, toDate;
            var date1 = item1.day.split("-");
            var date2 = item2.day.split("-");
            year = date1[0];
            month = date1[1];
            day = date1[2];
            month = parseInt(month, 10) < 10 ? '0' + month : month;
            day = parseInt(day, 10) < 10 ? '0' + day : day;
            fromDate = year + "-" + month + "-" + day;

            year = date2[0];
            month = date2[1];
            day = date2[2];
            month = parseInt(month, 10) < 10 ? '0' + month : month;
            day = parseInt(day, 10) < 10 ? '0' + day : day;
            toDate = year + "-" + month + "-" + day;

            var date1 = new Date(fromDate);
            var date2 = new Date(toDate);
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
          });
          return list;
        };

        var renderchart = function (data) {
          var totalCounts = 0;
          var current_graph_type = current_type;
          $interval.cancel(localTimmer);
          if (!data) {
            noDataFound = true;
            return;
          }

          var parseDate = d3.time.format("%Y-%m-%d").parse;
          data = sortByDate(data);
          data.forEach(function (d) {
            d.day = parseDate(d.day);
            d.alerts_count = +d.alerts_count;
            totalCounts += d.alerts_count;
          });

          if (totalCounts == 0) {
            noDataFound = true;
            return;
          }
          $scope.ruleAlertCount = totalCounts;
          //clear svg if any
          var cntr = d3.select("#lineChartContainer svg")
          if (cntr) {
            cntr.remove();
          }


          var myWidth = d3.select(".gb-lineChartContainer").node().getBoundingClientRect().width;
          var myHeight = d3.select(".gb-lineChartContainer").node().getBoundingClientRect().height;

          var margin = { top: 30, right: 20, bottom: 30, left: 50 },
            width = myWidth - margin.left - margin.right,
            height = myHeight - margin.top - margin.bottom;


          var x = d3.time.scale().range([0, width]);
          var y = d3.scale.linear().range([height, 0]);

          var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5);

          var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

          var area = d3.svg.area()
            .x(function (d) { return x(d.day); })
            .y0(height)
            .y1(function (d) { return y(d.alerts_count); });

          var valueline = d3.svg.line()
            .x(function (d) { return x(d.day); })
            .y(function (d) { return y(d.alerts_count); });

          var svg = d3.select("#lineChartContainer")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // Scale the range of the data
          x.domain(d3.extent(data, function (d) { return d.day; }));
          y.domain([0, d3.max(data, function (d) { return d.alerts_count; })]);
          svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            .transition()
            .duration(2200)
            .attrTween('d', function () {
              var interpolator = d3.interpolateArray(data, data);
              return function (t) {
                return area(interpolator(t));
              }
            });

          svg.append("path")      // Add the valueline path.
            .attr("d", valueline(data));

          svg.append("g")         // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          svg.append("g")         // Add the Y Axis
            .attr("class", "y axis")
            .call(yAxis);
        };
        // //ajax call for data to be rendered
        RulesService.getAlertsOfARule(RULE_ID, st, et).then(function (response) {
          var response = response.data.Data;
          var chartData = processDate(response);

          //Local timer function to get the width od dov only after it is rendered on screen and then call renderchart()
          localTimmer = $interval(function () {
            if (d3.select("#lineChartContainer").node() && d3.select("#lineChartContainer").node().getBoundingClientRect() && d3.select("#lineChartContainer").node().getBoundingClientRect().width > 0) {
              renderchart(chartData);
            }
          }, 100);
          loadTotalAlerts(st, et);
        }, function (response) {
          $scope.loading = false;
          noDataFound = true;
          renderchart([]);
        });

        $scope.isNoDataFound = function () {
          return noDataFound;
        }
        var loadTotalAlerts = function (st, et) {
          // //ajax call for data to be rendered: get all alerts
          RulesService.getCompleteAlertsCount(st, et).then(function (response) {
            $scope.loading = false;
            var totalAlerts = response.data.Data;
            $scope.totalRuleAlertCount = totalAlerts;
            if ($scope.ruleAlertCount && $scope.totalRuleAlertCount) {
              $scope.totalRuleAlertCount = (($scope.ruleAlertCount / $scope.totalRuleAlertCount) * 100).toFixed(2);
            } else {
              $scope.totalRuleAlertCount = 0;
            }
            //var chartData = processDate(response);
          }, function (response) {
            $scope.loading = false;
            $scope.totalRuleAlertCount = 0;
          });
        }

        //usertracking function
        $scope.trackUser = function (item) {
          var details = JSON.stringify(item);
          UserTrackingService.standard_user_tracking($scope.info.application, 'Main_Analytics', 'time_filter_change', details).then(function (response) {

          }, handleSessionTimeout);
        }
      }
    };
  })
  //============================------END RULE Wise Anlytics   Directive------==================================//

  //=================================GB Barchart Directive===================================//
  .directive("gbBarchart", function () {
    return {
      restrict: "AE",
      transclude: "true",
      scope: {
        type: "@type",
        charttitle: "@charttitle"
      },
      templateUrl: "partials/rules-and-alerts/analytics-bar-chart.html",
      controller: function ($scope, $interval, $timeout, $element, $attrs, RulesService, UtilService) {
        RulesService.getRulesConstants().then(function(response) {
          $scope.rulesconstants = response.data;
        }, function(response) {});
        var data = [
          {
            count: 0,
            type: "7 Days"
          },
          {
            count: 0,
            type: "15 Days"
          },
          {
            count: 0,
            type: "1 Month"
          },
          {
            count: 0,
            type: "3 Months"
          }
        ];
        var localTimmer;
        var current_type = $scope.type, noDataFound = false;
        var chartTitle = angular.copy($scope.charttitle );
        $scope.loading = true;//loader control 
        $scope.gridView = false; //hide drill down grid
        $scope.pagination = UtilService.localPagination();

        $scope.isNoDataFound = function () {
          return noDataFound;
        }
        $scope.goBackToChart = function () {
          $scope.gridView = false;
          $scope.charttitle = chartTitle;
        };
        function redraw() {
          $scope.loading = false;
          var margin = { top: 35, right: 0, bottom: 30, left: 60 };
          var myWidth = d3.select(".gb-bar-chart-cntr").node().getBoundingClientRect().width - 100;
          var myHeight = d3.select(".gb-bar-chart-cntr").node().getBoundingClientRect().height;
          var chart = d3.select($element[0].getElementsByClassName("gb-bar-chart-cntr")[0]).append("svg")
            .attr("width", myWidth)
            .attr("height", myHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          var x = d3.scale.linear()
            .range([0, myWidth])
            .domain([0, d3.max(data, function (d) {
              return d.count;
            })]);
          var y = d3.scale.ordinal()
            .rangeRoundBands([myHeight, 0], .1)
            .domain(data.map(function (d) {
              return d.type;
            }));
          var xAxis = d3.svg.axis()
            .scale(x) 
            .tickFormat(function (d) {
              var str_trimmed = d + "";
              if (str_trimmed.length > 15) {
                str_trimmed = str_trimmed.substr(0, 15) + "..."; //Limiting the value to 6 digits & concatinating Elipses
              }
              return str_trimmed;

            })
            .orient("bottom");

          var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");
          
          chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + myHeight + ")")
            .call(xAxis);
          var gy = chart.append("g")
            .attr("class", "y axis")
            .call(yAxis);
          var bars = chart.selectAll(".bar")
            .data(data)
            .enter()
            .append("g");
          bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
              return y(d.type);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
              return x(d.count);
            });
          bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
              return y(d.type) + y.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
              return x(d.count) + 3;
            })
            .text(function (d) {
              return d.count;
            });
          bars.on("click", function (d) {
            var tableData = [];
            switch (d.type) {
              case "7 Days":
                tableData = $scope.data7Days;
                $scope.charttitle = "Rules not triggered in 7 Days";
                break;
              case "15 Days":
                tableData = $scope.data15Days;
                $scope.charttitle = "Rules not triggered in 15 Days";
                break;
              case "1 Month":
                tableData = $scope.data1M;
                $scope.charttitle = "Rules not triggered in 1 Month";
                break;
              case "3 Months":
                tableData = $scope.data3M;
                $scope.charttitle = "Rules not triggered in 3 Months";
                break;
            };


            var actualRecords = tableData ? tableData : [];
            if(actualRecords.length == 0){
              return;
            }
            $scope.pagination.init(actualRecords);
            $scope.gridView = true;
          });
        };


        var flag6M = false;
        var flag3M = false;
        var flag1M = false;
        var flag7D = false;
        var flag15D = false;
        var flag1Y = false;
        var flagNever = false;
        var endDate = moment.utc().format();
        var startDate = moment.utc().format();
        //Data For 7 Days
        $scope.loading = true;
        startDate = moment().subtract(7, 'day').utc().format();
        et = moment(endDate).format('YYYY-MM-DD') + "T" + "23:59:59";
        st = moment(startDate).format('YYYY-MM-DD') + "T" + "00:00:00";
        var api7Days = RulesService.getRulesNotTriggered(st, et);
        api7Days.then(
          function (response) {
            $scope.data7Days = response.data.Data;
            data[0].count = $scope.data7Days.length;
            flag7D = true;
          },
          function (error) {
            flag7D = true;
          });
        //Data For 15 Days
        $scope.loading = true;
        startDate = moment.utc().format();
        startDate = moment().subtract(15, 'day').utc().format();
        et = moment(endDate).format('YYYY-MM-DD') + "T" + "23:59:59";
        st = moment(startDate).format('YYYY-MM-DD') + "T" + "00:00:00";
        var api15Days = RulesService.getRulesNotTriggered(st, et);
        api15Days.then(
          function (response) {
            $scope.data15Days = response.data.Data;
            data[1].count = $scope.data15Days.length;
            flag15D = true;
          },
          function (error) {
            flag15D = true;
          });
        //Data 1 Month
        startDate = moment.utc().format();
        startDate = moment().subtract(30, 'day').utc().format();
        st = moment(startDate).format('YYYY-MM-DD') + "T" + "00:00:00";
        var api1M = RulesService.getRulesNotTriggered(st, et);
        api1M.then(
          function (response) {
            $scope.data1M = response.data.Data;
            data[2].count = $scope.data1M.length;
            flag1M = true;
          },
          function (error) {
            flag1M = true;
          });
        //Data 3 Month
        startDate = moment.utc().format();
        startDate = moment().subtract(90, 'day').utc().format();
        st = moment(startDate).format('YYYY-MM-DD') + "T" + "00:00:00";
        var api3M = RulesService.getRulesNotTriggered(st, et);
        api3M.then(
          function (response) {
            $scope.data3M = response.data.Data;
            data[3].count = $scope.data3M.length;
            flag3M = true;
          },
          function (error) {
            flag3M = true;
          });
        var loopCall = setInterval(function () {
          //if (flag1Y && flag6M && flag3M && flag1M && flag15D && flagNever && flag7D) {
          if (flag3M && flag1M && flag15D && flag7D) {
            redraw();
            clearInterval(loopCall);
          }
        }, 500);
      }
    };
  })
  //=================================END------GB Barchart Directive-----END===================================//

  //=================================GB Vertical Barchart Directive===================================//
  .directive("gbVBarchart", function () {
    return {
      restrict: "AE",
      transclude: "true",
      scope: {
        type: "@type",
        charttitle: "@charttitle"
      },
      templateUrl: "partials/rules-and-alerts/analytics-vertical-bar-chart.html",
      controller: function ($scope, $interval, $timeout, $element, $attrs, RulesService, UtilService) {
        RulesService.getRulesConstants().then(function(response) {
          $scope.rulesconstants = response.data;
        }, function(response) {});
        var graphData = RulesService.getAnalytics($scope.type);
        var localTimmer;
        var current_type = $scope.type, noDataFound = false;
        var chartTitle = angular.copy($scope.charttitle );
        $scope.loading = true;//loader control 
        $scope.gridView = false; //hide drill down grid
        $scope.pagination = UtilService.localPagination();

        $scope.isNoDataFound = function () {
          return noDataFound;
        }
        $scope.goBackToChart = function () {
          $scope.gridView = false;
          $scope.charttitle = chartTitle;
        };

        var renderchart = function () {          
          var current_graph_type = current_type;
          $interval.cancel(localTimmer);
          $scope.loading = false;
          var  margin = { top: 20, right: 20, bottom: 80, left: 80 };

          // Get parent container height and width  
          var parentCntrWidth = d3
            .select(".gb-rules-analytics-dashboards-category-bar-tile")
            .node()
            .getBoundingClientRect().width;
          var parentCntrHeight = d3
            .select(".gb-rules-analytics-dashboards-category-bar-tile .chartContainer")
            .node()
            .getBoundingClientRect().height;

          // Actual chart container height and width i.e SVG's height and width
          var svgWidth = parentCntrWidth - margin.right - margin.left,
            svgHeight = parentCntrHeight - margin.top - margin.bottom;


          if (!graphData || !graphData.length) {
            noDataFound = true;
            return;
          }
          noDataFound = false;

          var data = graphData;


          var x = d3.scale.ordinal()
          .rangeRoundBands([0, svgWidth], .1);

          var y = d3.scale.linear()
          .range([svgHeight, 0]);

          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.count; })]);

          var xAxis = d3.svg.axis()
            .scale(x) 
            .tickFormat(function (d) {
              var str_trimmed = d + "";
              if (str_trimmed.length > 15) {
                str_trimmed = str_trimmed.substr(0, 15) + "..."; //Limiting the value to 6 digits & concatinating Elipses
              }
              return str_trimmed;

            })
            .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

          var svg = d3.select($element[0].getElementsByClassName("gb-bar-map-cntr")[0])
            .append("svg")
            .classed("svg-content-responsive", true)
            .attr("width", svgWidth + margin.left + margin.right)
            .attr("height", svgHeight + margin.top + margin.bottom)
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .attr("preserveAspectRatio", "xMinYMin meet")
            //.attr("viewBox", "0 0 " + (svgWidth+ margin.left) + " " +  (svgHeight + margin.top))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + svgHeight + ")")
            .call(xAxis)            
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
              return "rotate(-65)" 
            })
            .append('title')
            .text(function (d) {
              return d;
            });

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("y", -15)
              .attr("dy", ".71em")
              .style("text-anchor", "end");

          var tooltip = d3.select($element[0].getElementsByClassName("gb-bar-map-cntr")[0])
            .append('div')
            .attr('class', 'gb-chart-tooltips-style-1 tooltip');

          tooltip.append('div')
            .attr('class', 'label');

          tooltip.append('div')
            .attr('class', 'count');

          svg.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.name); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.count); })
              .attr("height", function(d) { return svgHeight - y(d.count); })
              .on('mouseover', function(d){
                //tooltip.select('.label').html(d.name);
                tooltip.select('.count').html(d.count);
                tooltip.style('display', 'block');
                tooltip.style('opacity', 2);
                tooltip.style("background", '#ecf0f1')
              })
              .on('mousemove', function (d) {
                d3.select(this).style('cursor', 'pointer');
                tooltip.style('top', (d3.event.layerY + 20) + 'px')
                  .style('left', (d3.event.layerX - 25) + 'px');
              })
              .on('mouseout', function(d){                
                tooltip.style('display', 'none');
                tooltip.style('opacity', 0);
                d3.select(this).style('cursor', 'auto');
              })
              .on('click', function(d){
                var actualRecords = d.rules ? d.rules : [];
                if(actualRecords.length == 0){
                  return;
                }
                $scope.pagination.init(actualRecords);
                $scope.gridView = true;
                if(current_graph_type == 'owner'){
                  $scope.charttitle = "Rules owned by " + d['name'];
                }else if(current_graph_type == 'category'){
                  $scope.charttitle = "Rules of Category : " + d['name'];
                }
              })
        }


        //Local timer function to get the width od dov only after it is rendered on screen and then call renderchart()
        localTimmer = $interval(function () {
          //draw chart if width & height is greater than 0  && api data is available
          if (d3.select(".gb-rules-analytics-dashboards-tile").node() && d3.select(".gb-rules-analytics-dashboards-tile").node().getBoundingClientRect() && d3.select(".gb-rules-analytics-dashboards-tile").node().getBoundingClientRect().width > 0 && RulesService.getAnalyticsLoaderWait()) {
            graphData = RulesService.getAnalytics($scope.type);
            renderchart();
          }
        }, 100);



      }
    };
  });
  //=================================END------GB Vertical Barchart Directive-----END===================================//
