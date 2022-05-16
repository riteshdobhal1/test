/* Controllers */

// Controller that holds the entire model for the logvault app.
angular.module('gbApp.controllers.logvault', ['gbApp.services.logvault', 'gbApp.services.analytics', 'gbApp.globals', 'ngTable'])
 .controller('LogVaultCtrl', ['$scope', 'metaDataService' , '$filter', 'InstanceHandler', 'UserTrackingService', 'LogVaultService', 'Dashboards', 'ngTableParams', 'GlobalService', 'AppService', 'ModalService', '$cookies', '$window', '$timeout', '$interval','ExplorerService', 'NavigationService', 'MenuService', 'DefaultFilterService', 'SectionsMetaService', 'ConfigDiffService', 'RulesService', 'RulesTestWithLogvault', '$sce',
 function($scope, metaDataService, $filter,  InstanceHandler, UserTrackingService, LogVaultService, Dashboards, ngTableParams, GlobalService, AppService, ModalService, $cookies, $window, $timeout, $interval, ExplorerService, NavigationService, MenuService, DefaultFilterService, SectionsMetaService, ConfigDiffService, RulesService, RulesTestWithLogvault, $sce) {
    $scope.d3Data = [];
    $scope.todayDate = metaDataService.getTodayDate();
    $scope.enableFacetStats = GlobalService.getVal('enableFacetStats');
    $scope.d3Attr = {
        height: 180,
        width: 800
    };
    var htmconst_url = "../config/constants/logvault_constants.json";
    $.get(htmconst_url, function (response, status) {
        $scope.htmconstdata = response;
    });
    $scope.reloadGraph = function(data) {
        var fdata = [], chartLabel = "";
        if(!data || !data['obs_date'] || !data['obs_date'].counts || data['obs_date'].counts.length == 0) { 
            $scope.d3Data = [];
            return;
        }
        if (data['obs_date']['gap'].indexOf("YEAR") >= 0) {            
            chartLabel = "Year View (UTC)";
            for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
                t_data = {};
                t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
                t_data['name'] = t_date.getFullYear().toString();
                t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
                t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
                t_data['title'] = chartLabel;
                fdata.push(t_data);
            }
        }else if (data['obs_date']['gap'].indexOf("MONTH") >= 0) {
            chartLabel = "Month View (UTC)";
            for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
                t_data = {};
                t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
                t_data['name'] = t_date.getFullYear() + "-" + t_date.getMonthName().substring(0, 3);
                t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
                t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
                t_data['title'] = chartLabel;
                fdata.push(t_data);
            }
        }else if (data['obs_date']['gap'].indexOf("DAY") >= 0) {
            chartLabel = "Day of Month View (UTC)";
            for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
                t_data = {};
                t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
                t_data['name'] = (t_date.getDate() > 9 ? t_date.getDate() : "0" + t_date.getDate()) + " " + t_date.getMonthName().substring(0, 3);
                t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
                t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
                t_data['title'] = chartLabel;
                fdata.push(t_data);
            }
        }else if (data['obs_date']['gap'].indexOf("HOUR") >= 0) {
            chartLabel = "Hours View (UTC) (HH:MM Month-Date)";
            for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
                t_data = {};
                var strDate = data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').replace('Z', '');
                t_date = new Date(strDate);
                t_data['name'] = (t_date.getHours() > 9 ? t_date.getHours() : "0" + t_date.getHours()) + ":" + (t_date.getMinutes() > 9 ? t_date.getMinutes() : "0" + t_date.getMinutes()) + " " + t_date.getMonthName().substring(0, 3) + " " + t_date.getDate();
                t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
                t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
                t_data['title'] = chartLabel;
                fdata.push(t_data);
            }
        }else if (data['obs_date']['gap'].indexOf("MINUTES") >= 0) {
            chartLabel = "Minutes View (UTC) (HH:MM)";
            for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
                t_data = {};
                var strDate = data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').replace('Z', '');
                t_date = new Date(strDate);                
                var d_name = (t_date.getHours() > 9 ? t_date.getHours() : "0" + t_date.getHours()) + ":" + (t_date.getMinutes() > 9 ? t_date.getMinutes() : "0" + t_date.getMinutes());                
                t_data['name'] = d_name;
                t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
                t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
                t_data['title'] = chartLabel;
                fdata.push(t_data);
            }
        } else if (data['obs_date']['gap'].indexOf("SECONDS") >= 0) {
            chartLabel = "Seconds View (UTC) (MM:SS)";
            for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
                t_data = {};
                var strDate = data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').replace('Z', '');
                t_date = new Date(strDate);                
                var d_name = (t_date.getSeconds() > 9 ? t_date.getSeconds() : "0" + t_date.getSeconds());                
                t_data['name'] = d_name;
                t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
                t_data['title'] = chartLabel;
                fdata.push(t_data);
            }
        }else {
             chartLabel = "Year View (UTC)";
            for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
                t_data = {};
                t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
                t_data['name'] = t_date;
                t_data['value'] = data['obs_date'].counts[(i * 2) + 1];
                t_data['link'] = "j-drillDown-" + data['obs_date'].counts[(i * 2)];
                t_data['title'] = chartLabel;
                fdata.push(t_data);
            }
        }        
        //reverse it for asceding oredr
        fdata.reverse();
         
        $scope.d3Data = fdata;
        var stop =  $interval(function(){
             var cntrHeight = d3.select(".d3-chart-container").node().getBoundingClientRect().height;
             if(cntrHeight){
                $interval.cancel(stop);
                $scope.d3BarRender();
             }
        }, 100); 
        $window.onresize = function() {
            $scope.svg.selectAll("rect").remove();
            return $scope.d3BarRender();
        };
    };
  
    $scope.d3BarRender = function() {
        var data = $scope.d3Data;
        if(ExplorerService.getDrillDown()){
            $scope.svg.selectAll("rect").remove();
        }
        if($scope.svg === undefined){
            d3v4.selectAll(".d3-chart-container svg").remove();
            $scope.d3margin = {top: 30, right: 30, bottom: 20, left: 80},
            $scope.d3width = d3v4.select(".d3-chart-container").node().getBoundingClientRect().width - $scope.d3margin.left - $scope.d3margin.right,
            $scope.d3height = d3v4.select(".d3-chart-container").node().getBoundingClientRect().height - $scope.d3margin.bottom - $scope.d3margin.top;
            $scope.svg = d3v4.select(".d3-chart-container")
            
            .append("svg")
                .attr("width", $scope.d3width + $scope.d3margin.left + $scope.d3margin.right)
                .attr("height", $scope.d3height + $scope.d3margin.top + $scope.d3margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + $scope.d3margin.left + "," + $scope.d3margin.top + ")");
            // Initialize the X axis
            $scope.x = d3v4.scaleBand()
                .range([ 0, $scope.d3width ])
                .padding(0.2);
            $scope.xAxis = $scope.svg.append("g")
                .attr("transform", "translate(0," + $scope.d3height + ")").attr("class", "myXaxis");
            $scope.svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -$scope.d3margin.left+15)
            .attr("x", -$scope.d3margin.top)
            .text("Count")
            .style("font-size", "10px")

            
            // Initialize the Y axis
            $scope.y = d3v4.scaleLinear()
                .range([ $scope.d3height, 0]);
            $scope.yAxis = $scope.svg.append("g")
                .attr("class", "myYaxis")
        }
        if(data.length == 0) {
            d3v4.selectAll(".d3-chart-container svg").remove();
            $scope.svg = undefined;
            d3v4.select(".d3-chart-container")
            .append("svg")
                .attr("width", $scope.d3width + $scope.d3margin.left + $scope.d3margin.right)
                .attr("height", $scope.d3height + $scope.d3margin.top + $scope.d3margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + $scope.d3margin.left + "," + $scope.d3margin.top + ")")
            .append("text")
                .attr("x", ($scope.d3width / 2))             
                .attr("y", ($scope.d3height / 2)) 
                .style("font-size", "12px") 
                .text("No Data Found");
        }else {
            $scope.updateGraphData(data);   
        }
                   
    };
    $scope.updateGraphData = function(data) {
        var maxY = d3v4.max(data, function(d) {
            return d.value;
        });
        if($scope.graphtooltip === undefined){
            $scope.graphtooltip = d3.select("body").append("div").attr("class", "graphtoolTip");
        }
        d3v4.selectAll(".chartTitleLog").remove();
        $scope.svg.attr("class", "chartlevel-"+$scope.info.chartLevel);
        // Update the X axis
      $scope.x.domain(data.map(function(d) { return d.name; }));
      if($scope.x.domain().length <= 10) {
        $scope.xAxis.call(d3v4.axisBottom($scope.x)).selectAll("text").attr("x","0");
      }else if($scope.x.domain().length > 10 && $scope.x.domain().length < 50) {
        $scope.xAxis.call(d3v4.axisBottom($scope.x).tickValues($scope.x.domain().filter(function(d,i){ return !(i%3)}))).selectAll("text").attr("x","0");
      }else {
        $scope.xAxis.call(d3v4.axisBottom($scope.x).tickValues($scope.x.domain().filter(function(d,i){ return !(i%10)}))).selectAll("text").attr("x","0");   
      }
    
      // Update the Y axis
      $scope.y.domain([-(maxY * .02), d3v4.max(data, function(d) { return d.value }) ]);
      $scope.yAxis.transition().duration(1000).call(d3v4.axisLeft($scope.y).tickValues([0, d3v4.max(data, function(d) { return d.value }) - (d3v4.max(data, function(d) { return d.value })*0.6666), d3v4.max(data, function(d) { return d.value }) - (d3v4.max(data, function(d) { return d.value })*0.3333), d3v4.max(data, function(d) { return d.value })]));
      $scope.svg.append("text")
      .attr("x", ($scope.d3width / 2))             
      .attr("y", 0 - ($scope.d3margin.top / 2)) 
      .attr("class", "chartTitleLog")
      .style("font-size", "12px") 
      .text(data[0].title);
      // Create the u variable
      var u = $scope.svg.selectAll("rect").data(data)
      u
        .enter()
        .append("rect").on("click", function(d) {
            if($scope.info.chartLevel != 'SECONDS'){
                $scope.graphtooltip.remove();
                $scope.graphtooltip = undefined;
                drillDown(d.link);
            }
        }) // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .on("mousemove", function(d){
            $scope.graphtooltip
              .style("left", d3v4.event.pageX - 50 + "px")
              .style("top", d3v4.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("<small>"+ (d.name) + "</small><br><b>" + (d.value) +"</b>");
            })
            .on("mouseout", function(d){ $scope.graphtooltip.style("display", "none");})
            .attr("x", function(d) { return ($scope.x.bandwidth() + $scope.x(d.name))*-1; })
            .attr("transform","rotate(180)")
            .attr("y", $scope.y(-(maxY * .02))*-1)
            .attr("title", function(d){ return d.value})
        .transition() // and apply changes to all of them
        .duration(1000)
          .attr("width", $scope.x.bandwidth())
          .attr("height", function(d) { if(d.value === 0) {return 0;} else {return $scope.d3height - $scope.y(d.value)}; })
          .attr("fill", "#0079c1");
    
      // If less group in the new dataset, I delete the ones not in use anymore
      u
        .exit()
        .remove()
        $scope.svg.selectAll("rect").attr("class", "cursor-pointer");
        $scope.svg.selectAll("circle").attr("class", "cursor-pointer");
    }
    $scope.timelineGraphDrilDown = [];
 // Defines whether the customDateFilter is being displayed on the UI or not.
    $scope.customDateFilter = true;
    
    $scope.customDateFilterApplied = true;

    // Defines the text that is being displayed if customDateFilter is false.
    $scope.dateRangeFilterName = GlobalService.getVal('customdate');

    // Holds all the facets selected by the user.
    $scope.selectedFacets = {};

    // Holds all the facets selected by the user in the flattened list format.
    $scope.selectedFacetsList = [];

    // Holds the selected file list for download.
    $scope.bundleList = [];

    // Applied facets from the applied view, which can't be removed from the UI.
    $scope.appliedFacets = {};

    // Holder for all the app info
    $scope.info = {};

    // Defines the completion of initial load.
    $scope.info.init = false;

    // Defines a boolean representing error in resultset.
    $scope.info.no_result = false;

    // Defines the uploaded_by field for out of the box filters.
    $scope.info.uploaded_by = null;

    // Defines the file lists for given bundles.
    $scope.info.fileLists = [];

    // Defines whether logvault is in pristine state or not ??
    $scope.info.pristine = true;

    //Defines whether change filter is triggered or not
    $scope.info.changedFilter = false;

    // Holds all the info about the default filter.
    $scope.info.defaultFilterInfo = {};

    // Defines whether NSR is enabled or not from the cookie set on the domain.

    //change this value
    $scope.info.nsr_enabled =  metaDataService.getDomain()["nsr_enabled"];
    
    // Defines whether default data is loaded or not
    $scope.info.resultLoading = true;

    // Defines whether facets are being loaded ??
    $scope.info.facetLoading = true;

    // Defines whether the results are being loaded ??
    $scope.info.dataLoading = true;

    // Defines whether the quick filter is being done or not ??
    $scope.info.quick = null;

    // Defines whether to display the original time or not ??
    $scope.info.showOTime = false;

    // Holds the current selection of from date for the query.
    $scope.info.fromDate = null;

    // Holds the current selection of from time for the query.
    $scope.info.fromTime = {};

    // Holds the current selection of to date for the query.
    $scope.info.toDate = null;

    // Holds the current selection of to time for the query.
    $scope.info.toTime = {};

    // Holds the data for the fushion chart
    $scope.info.fData = [];

    // Holds the boolean defining whether the all config call in completed or not.
    $scope.info.allConfigLoading = true;

    // Holds the default number of days for the range.
    $scope.info.default_days = 0;

    // Holds the default fields to be displayed in the results.
    $scope.info.fields = [];

    // Holds the current chart level
    $scope.info.chartLevel = "YEAR";

    // Holds the default level for the chart based on default days.
    $scope.info.defaultLevel = "YEAR";

    // Counts the number of times refresh is called.
    $scope.info.refCount = 0;
    
    $scope.info.dashboardsLoadCount = 0;

    //Defines whether any default saved filter is selected or not
    $scope.info.defaultFilterSelected = false;

    // Defines whether logvault is in default state
    $scope.info.defaultState = true;

    // Specifies the ID of current View
    $scope.info.currentViewID = null;

    $scope.info.facetLimit = GlobalService.getVal('facets_limit');

    $scope.info.initialLoading = false;
    
    $scope.info.dashboardsLoaded = false;
    
    $scope.info.firstDataLoaded = false;
    
    $scope.info.application = GlobalService.getVal('navLog');

    $scope.info.logvault_to_explorer = false;

    $scope.toggleChartCnt = true;
    
    $scope.info.toggleTimeline = true;

    $scope.fromRulesTestPage = RulesTestWithLogvault;

    $scope.testBundleMsg = "Select Bundles";

    $scope.showMessageToSelectBundleToUploadModal = null;

    $scope.selectBundleToUploadForTest = GlobalService.getVal('select_bundle_to_upload_for_test');

    $scope.showTestRuleIcon = false;

    $scope.selectBundleNotification = false;

    //$scope.info.graphData = null;

    // Initial empty response object which will eventually be filled with results.
    $scope.info.response = {
        docs : [],
        numFound : 0
    };

    // Holds the name of selected saved filter
    $scope.info.selectedFilterName = "Select View";

    // Defines the page object for pagination.
    $scope.info.page = {
        "total" : 0,
        "current" : 0,
        "pages" : 0,
        "count" : 10
    };

    // Holds all the facetCharts.
    $scope.info.facetCharts = [];

    // Defines the sort order selection on the UI.
    $scope.info.sort_order = {
        "label" : "Latest",
        "val" : "desc"
    };
    
    $scope.info.NSRReportUrl = "";
    
    // Stores whether session is timed out or not
    $scope.info.sessionTimedOut = false;

    $scope.openFacetStatsPopup = function(facet,index) {
        $scope.facetStats = facet.label;
        var data = [];
        var sumValue = 0;
        $scope.meanFacetValue = 0;
        var sumstdDev = 0;
        for(i=0;i<facet.data.length;i++){
            data.push(facet.data[i]);
            sumValue = sumValue+facet.data[i].value;
        }
        $scope.facetValueSum = sumValue;
        $scope.meanFacetValue = sumValue/facet.data.length;
        for(i=0;i<data.length;i++){
            data[i].perc = (data[i].value*100/sumValue).toFixed(2);
            data[i].stdDev = (data[i].value - $scope.meanFacetValue)*(data[i].value - $scope.meanFacetValue);
        }
        $scope.facetData = data;
        var top10 = data.sort(function(a, b) { return a.value < b.value ? 1 : -1; }).slice(0, 10); 
        var bottom10 = data.sort(function(a, b) { return a.value > b.value ? 1 : -1; }).slice(0, 10);
        for(i=0;i<data.length;i++){
            sumstdDev = Math.floor(sumstdDev + data[i].stdDev);
        }
        $scope.stdDevValue = Math.sqrt(sumstdDev/data.length); 
        $scope.top10facet = top10.sort(function (a, b) {
            return d3.descending(a.value, b.value);
        });
        $scope.bottom10facet = bottom10.sort(function (a, b) {
            return d3.descending(a.value, b.value);
        });
        $scope.maxFacetValue = $scope.top10facet[0].value;
        $scope.minFacetValue = $scope.bottom10facet[0].value;
        $scope.modalInstance = ModalService.openModal('partials/explorer/facetstats.html', $scope);
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", "Open facet stats popup", JSON.stringify(facet)).then(userTrackingSuccess, handleSessionTimeout);
    };
    $scope.updateBreadCrumb = function(fdate, tdate){
        $scope.customDateFilterApplied = false;
        $scope.customDateFilter = true;
        $scope.dateRangeFilterName = GlobalService.getVal('customdate');
        $scope.info.changedFilter = false;
        $scope.info.drillDown = true;
        $scope.info.uploaded_by = null;
        //check if there is no hisotry, store from and to date from custome date time - convert it to UTC
        if($scope.timelineGraphDrilDown.length == 0){
            var date = new Date($scope.info.fromDate.getFullYear(), $scope.info.fromDate.getMonth(), $scope.info.fromDate.getDate(), $scope.info.fromTime.hr, $scope.info.fromTime.min, $scope.info.fromTime.sec);
            fdate = moment(date);
            fdate = new Date(fdate.year(), fdate.month(), fdate.date(), fdate.hour(), fdate.minute(), fdate.second());
            var date = new Date($scope.info.toDate.getFullYear(), $scope.info.toDate.getMonth(), $scope.info.toDate.getDate(), $scope.info.toTime.hr, $scope.info.toTime.min, $scope.info.toTime.sec);
            tdate = moment(date); 
            tdate = new Date(tdate.year(), tdate.month(), tdate.date(), tdate.hour(), tdate.minute(), tdate.second());
            $scope.timelineGraphDrilDown.push({ts:$scope.info.chartLevel,from: fdate, to: tdate, st:new Date().getTime(), "isQuicktimeFilter": !!$scope.info.quick, "quicktimeFilter": $scope.info.quick, "quicktimeFilterName": $scope.dateRangeFilterName});
        }else{
            $scope.timelineGraphDrilDown.push({ts:$scope.info.chartLevel,from: fdate, to: tdate, st:new Date().getTime(), "isQuicktimeFilter": !!$scope.info.quick, "quicktimeFilter": $scope.info.quick, "quicktimeFilterName": $scope.dateRangeFilterName});
        }
        $scope.info.quick = 0;
    }
    $scope.isShowBreadCrumb = function(){
        return $scope.timelineGraphDrilDown.length;
    }
    $scope.changeBreadCrumb = function(){
        var currentData = $scope.timelineGraphDrilDown.pop();
        $scope.loadDataForBreadCrumb(currentData);
    };
    $scope.breadCrumbHistoryAction =  function(node, index){
        for(var i=0;i<$scope.timelineGraphDrilDown.length;i++){
            if($scope.timelineGraphDrilDown[i].ts == node.ts){
                index = i;
                break;
            }
        }
        $scope.timelineGraphDrilDown.splice(index,1);
        $scope.loadDataForBreadCrumb(node);
    }
    $scope.loadDataForBreadCrumb = function(node){
        var tliData, d, d1;
        $scope.info.currentFacet = null;
        $scope.info.drillDown = true;

        //reset quick filter
        $scope.customDateFilterApplied = false;
        $scope.customDateFilter = true;
        $scope.info.changedFilter = false;
        $scope.dateRangeFilterName = GlobalService.getVal('customdate');
        $scope.info.uploaded_by = null;
        $scope.info.quick = 0;
        if(node.isQuicktimeFilter && node.quicktimeFilter && (node.quicktimeFilter == 1 || node.quicktimeFilter == 5 || node.quicktimeFilter == 10) )
        {
            $scope.info.quick = node.quicktimeFilter;
            $scope.customDateFilter = false;
            $scope.info.drillDown = false;
            switch(node.quicktimeFilter){
                case 1 :
                    $scope.dateRangeFilterName = GlobalService.getVal('mostrecent');
                    break;
                case 5 :
                    $scope.dateRangeFilterName = GlobalService.getVal('last5');
                    break;
                case 10 :
                    $scope.dateRangeFilterName = GlobalService.getVal('last10');
                    break;
            }
        }
        
        var currentData = node;
        var chartLevel = currentData.ts;

        tliData = currentData;
        if($scope.timelineGraphDrilDown.length == 0){
            $scope.setFromTo(tliData.from, tliData.to);
            return;
        }

        d = new Date(tliData.from);
        d1 = new Date(tliData.to);
        switch(chartLevel) {
            case 'YEAR' :
                $scope.setFromTo(d, d1);
                break;
            case 'MONTH' :
                d.setMonth(0);
                d.setDate(1);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d1.setMonth(12);
                d1.setDate(0);
                d1.setHours(23);
                d1.setMinutes(59);
                d1.setSeconds(59);
                $scope.setFromTo(d, d1);
                break;
            case 'DAY' :
                d.setDate(1);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d1.setMonth(d1.getMonth() + 1);
                d1.setDate(0);
                d1.setHours(23);
                d1.setMinutes(59);
                d1.setSeconds(59);
                $scope.setFromTo(d, d1);
                break;
            case 'HOUR' :
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d1.setHours(23);
                d1.setMinutes(59);
                d1.setSeconds(59);
                $scope.setFromTo(d, d1);
                break;
            case 'MINUTES' :
                d.setMinutes(0);
                d.setSeconds(0);
                d1.setMinutes(59);
                d1.setSeconds(59);
                $scope.setFromTo(d, d1);
                break;
        }        
    }


    function handleSessionTimeout(response) {
        if(!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
            $scope.info.sessionTimedOut = true;
            ModalService.sessionTimeout();
        }
    };

    // Updates the from n to time from the given date objects
    $scope.setFromTo = function(fdate, tdate, noLoad) {
        if(!isDate(fdate)) {
            fdate = new Date(fdate);
        }
        if(!isDate(tdate)) {
            tdate = new Date(tdate);
        }
        $scope.info.fromDate = fdate;
        $scope.info.fromTime.hr = fdate.getHours();
        $scope.info.fromTime.min = fdate.getMinutes();
        $scope.info.fromTime.sec = fdate.getSeconds();
        $scope.info.toDate = tdate;
        $scope.info.toTime.hr = tdate.getHours();
        $scope.info.toTime.min = tdate.getMinutes();
        $scope.info.toTime.sec = tdate.getSeconds();
        if(!noLoad){
            $scope.tableParams.reload();
        }
    };
    
    //Fix related to bg-9472
    // $scope.loadDashboards = function() {
    //     Dashboards.allDetails().then(function(response) {
    //         $scope.info.dashboardsLoadCount++;
    //         $scope.dashboards = $filter('filter')(response.data.Data.dashboards, {
    //             'd_type' : 'NSR'
    //         });
    //         if (!Array.isArray($scope.dashboards)) {
    //             $scope.dashboards = [];
    //         }
    //         if ($scope.dashboards[0] && $scope.dashboards[0].reports && $scope.dashboards[0].reports[0] && $scope.dashboards[0].reports[0].r_link) {
    //             $scope.info.NSRReportUrl = $scope.dashboards[0].reports[0].r_link;
    //         } else {
    //             if($scope.info.dashboardsLoadCount < 4) {
    //                 $scope.loadDashboards();
    //                 return;
    //             } else {
    //                 $scope.info.nsr_enabled = false;
    //             }
    //         }
    //         $scope.info.dashboardsLoaded = true;
    //         if($scope.info.firstDataLoaded) {
    //             $scope.info.resultLoading = false;
    //         }
    //     }, function(response) {
    //         $scope.info.dashboardsLoaded = true;
    //         if($scope.info.firstDataLoaded) {
    //             $scope.info.resultLoading = false;
    //         }
    //         $scope.info.nsr_enabled = false;
    //         handleSessionTimeout(response);
    //     });
    // };
    //NSR report link
    //get NSR report URL by calling dashboard API

    // Bug fix related to BG-9472
    // if(!!$scope.info.nsr_enabled) {
    //     $scope.loadDashboards();
    // }
    
    
    $scope.getNSRReportURl = function(bundle) {
        var url = "";
        var paramObj = GlobalService.getVal('nsrParams');
        var i = 0;
        for (var key in paramObj) {
            if(key == 'obs_date') {
                var date = $filter('toTimeStr')(bundle[key]);
                if (i == 0) {
                    url = paramObj[key] + '=' + date;
                } else {
                    url += '&' + paramObj[key] + '=' + date;
                }
                i++;
                continue;
            }
            if (i == 0) {
                url = paramObj[key] + '=' + bundle[key];
            } else {
                url += '&' + paramObj[key] + '=' + bundle[key];
            }
            i++;
        }
        return $scope.info.NSRReportUrl + '&' + url;
    };
    
    $scope.loadBundleData = function(bundle) {
        // var parentScope = $rootScope.$new();
        // $controller('AppCtrl', {
            // '$scope': parentScope
        // });
        $scope.$parent.changeCurrentPage('apps', bundle);
    }

    $scope.openNSRInstanceViewer = function(bundle) {
        if ($scope.info.NSRReportUrl == "") {
            ModalService.alertBox({msgKey: 'nsr_alert_msg'});
            return;
        }
        var reportUrl = $scope.getNSRReportURl(bundle);
        $scope.addInstance({
            'rname' : 'NSR',
            'r_link' : reportUrl
        });
    };
    // Adds the given instance to the instance viewer
    $scope.addInstance = function(report) {
        var instance;
        // create instance viewer object
        var instanceConfig = {
            'type' : 'nsr',
            'name' : report.rname,
            'data' : {
                'report' : report
            }
        };

        instance = JSON.parse(angular.toJson(instanceConfig));
        InstanceHandler.addInstance(instance, $scope);
        dashboard_url = report.r_link;
        details = dashboard_url.split('?');
        dashboard_details = details[1].split('&');
        dashboard_str = dashboard_details[0];
        arr_dashboard_name = dashboard_str.split('=');
        dashboard_name = arr_dashboard_name.pop();
        pattern = /\./g;
        if(pattern.test(dashboard_name))
        {
            arr_dashboard_name = dashboard_name.split('.');
            dashboard_name = arr_dashboard_name.pop();
            dashboard_name = dashboard_name.replace(/\_/g,' ');
        }

        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, 'Open NSR', '{\''+dashboard_name+'\'}').then(function(response) {

        }, handleSessionTimeout);
    };

    // Gets the values from the globals based on the given key.
    $scope.getValue = function(key) {
        return GlobalService.getVal(key);
    };
    
    //Changes filter accessibility of selected filter
    $scope.changeFilterAccessibility = function(view) {
        $scope.savedFiltersListLoading = true;
        LogVaultService.changeFilterAccessibility(view).then(function(response) {
            $scope.getSavedFilters();
            var activity = view.public ? 'Set View Private' : 'Set View Public';
            var details = {
                'View Name': view.view_name
            };
            UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
        }, function(response) {
            $scope.savedFiltersListNotFound = true;
            $scope.savedFiltersListLoading = false;
            handleSessionTimeout(response);
        });
    };
    
    //Changes the default filter for a user
    $scope.changeDefaultFilter = function(view, outOfBox) {
        $scope.savedFiltersListLoading = true;
        if(!outOfBox) {
            LogVaultService.setResetDefaultFilter(view).then(function(response) {
                view.default = !view.default;
                var activity = "";
                if(view.default) {
                   // $scope.loadView(view);
                    activity = "Set Default View";
                } else {
                    if(view.view_name == $scope.info.selectedFilterName) {
                        $scope.selectedFacets = {};
                        $scope.info.defaultFilterInfo = {};
                        //$scope.reset();
                    }
                    activity = "Reset Default View";
                }
                var details = {
                    'View Name': view.view_name
                };
                UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
                $scope.getSavedFilters();
                // $scope.getAllSavedFilter();
            }, function(response) {
                $scope.savedFiltersListLoading = false;
                handleSessionTimeout(response);
            });
        } else {
        }
    };
    

    $scope.dateRangeFilterName = GlobalService.getVal('customdate');
    // Applies the quick filter based on the user selection
    $scope.changeQuickFilter = function(item) {
        $scope.info.defaultState = false;
        $scope.info.pristine = false;
        $scope.info.changedFilter = false;
        $scope.info.drillDown = false;
        //$scope.info.currentFacet = null;
        var d,d1;
        d = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        d1 = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        if (item != 'customdate') {
            $scope.customDateFilter = false;
            $scope.dateRangeFilterName = GlobalService.getVal(item);
            $scope.info.quick = 0;
            $scope.info.uploaded_by = null;
            $scope.info.quickFilter = true;
            switch(item) {
            case 'lasthour' :
            case GlobalService.getVal('lasthour') :
                d.setHours(d.getHours() - 1);
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('lasthour');
                break;
            case 'today' :
            case GlobalService.getVal('today') :
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('today');
                break;
            case 'yesterday' :
            case GlobalService.getVal('yesterday') :
                d.setDate(d.getDate() - 1);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d1.setDate(d1.getDate() - 1);
                d1.setHours(23);
                d1.setMinutes(59);
                d1.setSeconds(59);
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('yesterday');
                break;
            case 'thisweek' :
            case GlobalService.getVal('thisweek') :
                d.setDate(d.getDate() - d.getDay() + 1);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('thisweek');
                break;
            case 'thismonth' :
            case GlobalService.getVal('thismonth') :
                d.setDate(1);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('thismonth');
                break;
            case 'last2days' :
            case GlobalService.getVal('last2days') :
                d.setDate(d.getDate() - 2);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('last2days');
                break;
            case 'last7days' :
            case GlobalService.getVal('last7days') :
                d.setDate(d.getDate() - 7);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('last7days');
                break;
            case 'last30days' :
            case GlobalService.getVal('last30days') :
                d.setDate(d.getDate() - 30);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('last30days');
                break;
            case 'mostrecent' :
            case GlobalService.getVal('mostrecent') :
                $scope.info.quick = 1;
                if ($scope.info.max_days_allowed) {
                    d.setDate(d.getDate() - $scope.info.max_days_allowed);
                } else {
                    d.setFullYear(d.getFullYear() - 10);
                }
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                // $scope.tableParams.reload();
                $scope.dateRangeFilterName = GlobalService.getVal('mostrecent');
                break;
            case 'last5' :
            case GlobalService.getVal('last5') :
                $scope.info.quick = 5;
                if ($scope.info.max_days_allowed) {
                    d.setDate(d.getDate() - $scope.info.max_days_allowed);
                } else {
                    d.setFullYear(d.getFullYear() - 10);
                }
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                // $scope.tableParams.reload();
                $scope.dateRangeFilterName = GlobalService.getVal('last5');
                break;
            case 'last10' :
            case GlobalService.getVal('last10') :
                $scope.info.quick = 10;
                if ($scope.info.max_days_allowed) {
                    d.setDate(d.getDate() - $scope.info.max_days_allowed);
                } else {
                    d.setFullYear(d.getFullYear() - 10);
                }
                $scope.info.currentFacet = null;
                $scope.setFromTo(d, d1);
                // $scope.tableParams.reload();
                $scope.dateRangeFilterName = GlobalService.getVal('last10');
                break;
            default :
                // alert("Nothing");
                ModalService.alertBox({msg: 'Nothing'});
                $scope.dateRangeFilterName = GlobalService.getVal('customdate');
                break;
            }
        } else {
            $scope.customDateFilter = true;
            $scope.customDateFilterApplied = true;
            $scope.info.quick = 0;
            $scope.info.uploaded_by = null;         
            $scope.dateRangeFilterName = GlobalService.getVal(item);
            // $scope.tableParams.reload();
        }
    };
    
    // XHR to fetch all the meta info.
    LogVaultService.getAllConfig().then(function(response) {
        var i,
            keys,
            field;
        $scope.facets = [],
        responseData = response.data.Data;
        if(responseData && responseData.ec_sysid_map){
            if(responseData.ec_sysid_map.sysid1 == ""){
                responseData.ec_sysid_map.sysid1 ="sysid1";
            }
        }
        if(AppService.isGbStudioApp()) {
            responseData['config'] = !!responseData['default_config'] ? responseData['default_config'] : responseData['config'];
        }
        metaDataService.setGbConfig(responseData['config']);
        angular.forEach(responseData.facet_label_map, function(facet) {
            angular.forEach(facet, function(label, key) {
                if(key !== 'namespace') {
                    var f = {};
                    f['key'] = key;
                    f['label'] = label;
                    f['data'] = [];
                    f['expanded'] = false;
                    $scope.facets.push(f);
                    $scope.selectedFacets[key] = [];
                }
            });
        });
        // DEFAULT_PERIOD_IN_SEC needs to change as DEFAULT_PERIOD_IN_SEC
        $scope.info.default_days = responseData['config']['LOGVAULT_DEFAULT_PERIOD_IN_SEC'];
        $scope.info.max_days_allowed = responseData['config']['LOGVAULT_MAX_DAY_RANGE_ALLOWED'];
        $scope.info.MinDate = new Date(metaDataService.getTodayDate());
        $scope.info.MinDate.setDate(metaDataService.getTodayDate().getDate() - $scope.info.max_days_allowed) 
        //convert seconds to milliseconds
        if($scope.info.default_days) $scope.info.default_days = 1000 * $scope.info.default_days;

        if(!!metaDataService.getFeatures()['explorer']) {
            $scope.info.logvault_to_explorer = responseData['config']['lv_to_exp'];
        }
        
        $scope.info.appsFeatureEnabled = responseData['config']['lv_to_apps'];
        
        $scope.info.logvault_to_viewer = responseData['config']['lv_to_iviewer'];
        
        var sectionKeys = Object.keys(responseData.sections_content);
        sectionKeys.sort();
        for(var i = 0; i < sectionKeys.length; i++) {
            if(responseData.sections_content[sectionKeys[i]]['nsType'] == "SECTION") {
                $scope.info.ivSection = sectionKeys[i];
                break;
            }
        }
        
        // $scope.info.fields = response.data['config']['fields'];
        $scope.info.allConfigLoading = false;
        $scope.loadDefaultFilter();

        keys = Object.keys(responseData['config']['fields']);
        for (i in keys) {
            field = {};
            field['key'] = keys[i];
            field['label'] = responseData['config']['fields'][keys[i]];
            $scope.info.fields.push(field);
        }
        DefaultFilterService.setConfigDiffFields($scope.info.fields);
        $scope.info.sysId = responseData['ec_sysid_map']['sysid1'];
        //update breadcrumb deault value
        var d = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        var d1 = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        if ($scope.info.default_days) {
            d.setTime(d.getTime() - $scope.info.default_days);
        } else {
            d.setFullYear(d.getFullYear() - 10);
        }
    }, function(response) {
        handleSessionTimeout(response);
        console.error(response);
    });
    
    $scope.addAppsInstance = function(result) {
        result.namespace = "random.namespace.by.apps";
        result.currentNS = "random.namespace.by.apps";
        result.namespace_id = $filter('bundleName')(result.obs_url) + '-0';
        result.serial_num = result[$scope.info.sysId];        
        var instance = {
            "type": 'apps',
            "title": 'View section/config diff',
            "name": $filter('bundleName')(result.obs_url),
            "module" : $scope.info.application,
            "data": {
                "result": result,
                "bundle": $filter('bundleName')(result.obs_url),
                "sysId": result[$scope.info.sysId],
                "sysId2": null,
                "instanceDisplay": $scope.info.fields,
                "start_time": $scope.getFrom(),
                "end_time": $scope.getTo(),
                'observation': result.obs_date,
                'observationStr': result.obs_date_str
            }
        };
        if(result.sysid2){
            instance.data.sysId2 = result.sysid2;
        };
       InstanceHandler.addInstance(instance);
       UserTrackingService.standard_user_tracking($scope.info.application, "Apps", 'Table View', JSON.stringify(result)).then(userTrackingSuccess, handleSessionTimeout);
    };    
    $scope.toggleTimelineGraph = function(){
        $scope.toggleChartCnt = !$scope.toggleChartCnt; 
        $scope.logToggleTimeline($scope.toggleChartCnt);        
        $scope.info.toggleTimeline = !$scope.info.toggleTimeline;
    };
    $scope.setInitialViewSectionViewer = function(instance){
        DefaultFilterService.setDefaultSysId({sys_id: instance.data["sysId"]});
        var bundle_name = instance.data.result["filename"];
        var obs_time    = instance.data.result["obs_date"];
        var obs_url     = instance.data.result["obs_url"];
        DefaultFilterService.setSelectedObservation({'bundle_name':bundle_name,'obs_time':obs_time,'obs_url':obs_url});
        DefaultFilterService.setDefaultObservation({'bundle_name':bundle_name,'obs_time':obs_time,'obs_url':obs_url});
        $timeout(function(){
            NavigationService.setUrl('sectionview');
            MenuService.setCurrentLabel('Section View');
            InstanceHandler.addInstance(instance);
            $timeout(function(){
                SectionsMetaService.getS2().then(function(response){
                    DefaultFilterService.setSubSys(response.data.Data);
                    SectionsMetaService.getDefault().then(function(response){

                        var view = response.data.Data, haveDefault=false, me = this;
                        SectionsMetaService.getAll().then(function (response) {
                            var obs = DefaultFilterService.getDefaultObservation();
                            var sorted_data = $filter("filter")(response.data.Data, {
                            "namespace_type": "!EVENT"
                            });
                            sorted_data = $filter("filter")(sorted_data, {
                            "namespace_type": "!UNPARSED"
                            });
                            sorted_data = $filter("orderBy")(sorted_data, "label");
                            SectionsMetaService.setSections(DefaultFilterService.getDefaultObservation(), sorted_data);
                            
                            if(view){
                                 SectionsMetaService.applyViewFromLogVault(view);
                                 haveDefault = true;
                            }
                            //clear all selected section
                            if(!haveDefault){
                                SectionsMetaService.clearSectionView();
                            }
                            //call for config diff

                            $scope.setInitialViewConfigDiff(instance);
                        },function(response){}, me);                        
                    },function(response){});
                }, function(response){
                    DefaultFilterService.setSubSys([]);
                });
            }, 500, $scope);
        }, 100, $scope);
     };
     $scope.setInitialViewConfigDiff = function(instance){        
        var sysId = instance.data['sysId'];
        var ec = DefaultFilterService.getDefaultEndCust();
        ConfigDiffService.setClusterId(sysId);
        ConfigDiffService.getAll()
            .then(function (response) {
                sorted_data = $filter("filter")(response.data.Data, {
                    "namespace_type": "!UNPARSED"
                });
                sorted_data = $filter("filter")(sorted_data, {
                    "namespace_type": "!EVENT"
                });
                sorted_data = $filter("orderBy")(sorted_data, "label");
                sections = sorted_data;
                ConfigDiffService.setSections(sections);
                //get all saved view
                ConfigDiffService.getDefault().then(function(response){
                    var view = response.data.Data;
                    var me = this,haveDefault=false;
                    if(view){
                        ConfigDiffService.applyViewFromLogVault(view);
                        haveDefault = true;
                    }
                    //clear all selected section
                    if(!haveDefault){
                        ConfigDiffService.clearConfigDiff();
                    }
                    /*if(view){
                        ConfigDiffService.loadView(view)
                            .then(function (response) {
                                var appliedView;
                                appliedView = response.data.Data[0];
                                ConfigDiffService.setSectionLoading(false);
                                if (!!appliedView) {
                                    // XHR to fetch the view metadata.
                                    ConfigDiffService.applyView(appliedView, $scope, ConfigDiffService.getSections(), ec, sysId, DefaultFilterService.getDefaultObservation());
                                   // configCtrl.info.currentViewName = view.view_name;                    
                                    ConfigDiffService.getAppliedView(view);
                                    UserTrackingService.standard_user_tracking($scope.info.application, 'Config Diff', 'Apply View', "{\'" + view['view_name'] + "\'}")
                                        .then(function (response){}, function(response){});
                                }
                            }, function (response) {
                                ConfigDiffService.setSectionLoading(false);
                            }, me);
                    }else{
                        //clear selected section
                        var sections = ConfigDiffService.getSections();
                        for (var i in sections) {
                            sections[i]['selected'] = false;
                            sections[i]['default'] = false;
                            sections[i]['count'] = 2;
                            ConfigDiffService.resetFilter(sections[i]);
                        }
                        ConfigDiffService.setSections(sections);
                        ConfigDiffService.setAppliedView(null);
                        //configCtrl.info.currentViewName = 'Select view';
                        UserTrackingService.standard_user_tracking($scope.info.application, 'Config Diff', 'Clear Filter', "{}")
                                    .then(function(response){}, function(response){});
                    }*/
                },function(response){});
           },function(response){})       
     };
    // Returns the string required for the From time in the XHR query
    $scope.getFrom = function() {   
        var date = new Date($scope.info.fromDate.getFullYear(), $scope.info.fromDate.getMonth(), $scope.info.fromDate.getDate(), $scope.info.fromTime.hr, $scope.info.fromTime.min, $scope.info.fromTime.sec);
        $scope.info.fromDate = date;
        return date.getFullYear() + "-" + $scope.makeT2DigitValue(parseInt(date.getMonth() + 1)) + "-" + $scope.makeT2DigitValue(date.getDate()) + "T" + $scope.makeT2DigitValue($scope.info.fromTime.hr) + ":" + $scope.makeT2DigitValue($scope.info.fromTime.min) + ":" + $scope.makeT2DigitValue($scope.info.fromTime.sec) + "Z";
    };
    $scope.makeT2DigitValue = function(value){
        if(parseInt(value) < 10) return "0"+value;
        return value;
    };
    
    $scope.$watch('info.toDate', function() {
        var currentUTC = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        if(currentUTC < $scope.info.toDate){
            $scope.info.toDate = currentUTC;
            $scope.info.toTime.hr = $scope.info.toDate.getHours();
            $scope.info.toTime.min = $scope.info.toDate.getMinutes();
            $scope.info.toTime.sec = $scope.info.toDate.getSeconds();
        }
    });
    $scope.$watch('info.resultLoading', function() {
        if(!$scope.info.resultLoading){     
            AppService.hidePanelLoading();   
        }
    });
    //Event to check when application is ready
    $scope.$on('AppLoadEvent-logvault', function (event, reload) {
        if(!$scope.info.resultLoading){
            AppService.hidePanelLoading();
        }
        if(reload && !$scope.info.allConfigLoading) {
            $scope.loadDefaultFilter();
        }
        $scope.updateWhetherToShowUploadBundleToTest();
    });
    // Returns the string required for the To time in the XHR query    
    $scope.getTo = function() {
        var currentUTC = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        var date = new Date($scope.info.toDate.getFullYear(), $scope.info.toDate.getMonth(), $scope.info.toDate.getDate(), $scope.info.toTime.hr, $scope.info.toTime.min, $scope.info.toTime.sec);
        if(currentUTC < date){
            date = currentUTC;
            $scope.info.toTime.hr = date.getHours();
            $scope.info.toTime.min = date.getMinutes();
            $scope.info.toTime.sec = date.getSeconds();
        }
        $scope.info.toDate = date;
        return date.getFullYear() + "-" + $scope.makeT2DigitValue(parseInt(date.getMonth() + 1)) + "-" + $scope.makeT2DigitValue(date.getDate()) + "T" + $scope.makeT2DigitValue($scope.info.toTime.hr) + ":" + $scope.makeT2DigitValue($scope.info.toTime.min) + ":" + $scope.makeT2DigitValue($scope.info.toTime.sec) + "Z";
    };

    // Refreshes the data based on customDateFilter
    $scope.done = function() {
        $('.gb-datetime.open').removeClass('open');
        $scope.tableParams.reload();
    };

    // Closes the customDateFilter widget
    $scope.cancel = function() {
        $('.gb-datetime.open').removeClass('open');
    };

    // The ng-table reference that holds the results
    $scope.tableParams = new ngTableParams({
        page : 1, // show first page
        count : 10 // count per page
    }, {
        total : $scope.info.response.numFound, // length of data
        getData : function($defer, params) {
            if (!$scope.info.allConfigLoading) {
                $scope.refresh($defer);
            } else {
                $defer.resolve([]);
            }
        }
    });
    // $scope.tableParams.settings().$scope = $scope;
    // Populates the page object with the latest data.
    $scope.paginator = function(count) {
        $scope.info.page['total'] = count;
        $scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
        if($scope.info.page['current'] >= $scope.info.page['pages']) {
            $scope.info.page['current'] = $scope.info.page['pages'] - 1;
            if($scope.info.page['current'] < 0){
                $scope.info.page['current'] = 0;
            }
            $scope.tableParams.page($scope.info.page['current'] + 1);
            // $scope.tableParams.reload();
        }      
    };
    //Change page size
    $scope.changePageSize = function() {
        $scope.info.page['count'] = parseInt($scope.info.page['count']);
        $scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
        $scope.info.page['current'] = 0;        
        $scope.tableParams.count($scope.info.page['count']);
        $scope.info.changePageSize = true;
        $scope.tableParams.page($scope.info.page['current'] + 1);
        $scope.refresh();
        
    };

    // Navigates to next page of results
    $scope.nextPage = function() {
        if ($scope.info.page['current'] < $scope.info.page['pages'] - 1) {
            $scope.info.page['current'] += 1;
            $scope.info.paginate = true;
            $scope.tableParams.page($scope.info.page['current'] + 1);
        }
    };

    // Navigate to previous page of results
    $scope.prevPage = function() {
        if ($scope.info.page['current'] > 0) {
            $scope.info.page['current'] -= 1;
            $scope.info.paginate = true;
            $scope.tableParams.page($scope.info.page['current'] + 1);
        }
    };

    // Navigate to first page of results
    $scope.firstPage = function() {
        if ($scope.info.page['current'] == 0)
            return;
        $scope.info.page['current'] = 0;
        $scope.info.paginate = true;
        $scope.tableParams.page($scope.info.page['current'] + 1);
    };

    // Navigate to last page of results
    $scope.lastPage = function() {
        if ($scope.info.page['current'] == $scope.info.page['pages'] - 1)
            return;
        $scope.info.page['current'] = $scope.info.page['pages'] - 1;
        $scope.info.paginate = true;
        $scope.tableParams.page($scope.info.page['current'] + 1);
    };
    //fix BG-8787
    $scope.searchFromUI = function(){
        if(!$scope.customDateFilter){
            return;
        }
        $scope.info.drillDown = false;
        var date = new Date($scope.info.fromDate.getFullYear(), $scope.info.fromDate.getMonth(), $scope.info.fromDate.getDate(), $scope.info.fromTime.hr, $scope.info.fromTime.min, $scope.info.fromTime.sec);
        $scope.info.fromDate = date;
        var date = new Date($scope.info.toDate.getFullYear(), $scope.info.toDate.getMonth(), $scope.info.toDate.getDate(), $scope.info.toTime.hr, $scope.info.toTime.min, $scope.info.toTime.sec);
        $scope.info.toDate = date;
        $scope.tableParams.reload()
    };
    $scope.getFacetName= function(key){
        for(var i=0;i<$scope.facets.length;i++){
            if($scope.facets[i]['key'] == key){
                return $scope.facets[i]['label'];
            }
        }
    }
    $scope.getFacet= function(key){
        for(var i=0;i<$scope.facets.length;i++){
            if($scope.facets[i]['key'] == key){
                return $scope.facets[i];
            }
        }
    }
    $scope.sortRawData = function(){
        $scope.info.drillDown = false;
        $scope.tableParams.reload();
    }
    // Refresh all the client-side data.
    $scope.refresh = function(defer) {
        if(!$scope.info.fromDate || !$scope.info.toDate) {
            return;
        }
        $scope.info.refCount++;
        var i,
            j,
            selectedFacets = {},
            keys = Object.keys($scope.selectedFacets);
        $scope.listSelectedFacets();
        $scope.info.dataLoading = true;
        for (i in keys) {
            for (j in $scope.selectedFacets[keys[i]]) {
                if (Array.isArray(selectedFacets[keys[i]])) {
                    selectedFacets[keys[i]].push($scope.selectedFacets[keys[i]][j].label.replace(/\?/g, '%3F'));
                } else {
                    selectedFacets[keys[i]] = [];
                    selectedFacets[keys[i]].push($scope.selectedFacets[keys[i]][j].label.replace(/\?/g, '%3F'));
                }
            }
            if (!Array.isArray(selectedFacets[keys[i]])) {
                selectedFacets[keys[i]] = [];
            }
        }
        
        if(!$scope.info.toDate || !$scope.info.fromDate) {
            return;
        }
        
        if(!!$scope.info.viewLoad) {
            $scope.info.viewLoad = false;
        } else {
            $scope.info.selectedFilterName = "Select View";
        }       
        // XHR to fetch the results based on the user selection of facets n other parameters on the UI.
        LogVaultService.getData($scope.tableParams.page(), $scope.tableParams.count(), selectedFacets, $scope.getFrom($scope.info.drillDown), $scope.getTo($scope.info.drillDown), $scope.info.sort_order['val'], 0, $scope.info.quick, $scope.info.uploaded_by, $scope.dateRangeFilterName, $scope.info.drillDown).then(function(d_response) {
            var data = {};
            $scope.testBundleMsg = "Select Bundles";
            data.data = d_response.data.Data;
            data.Msg = d_response.data.Msg;
            d_response = data;
            $scope.info.firstDataLoaded = true;
            $scope.info.resultLoading = false;
            // if($scope.info.nsr_enabled) {
            //     if($scope.info.dashboardsLoaded) {
            //         $scope.info.resultLoading = false;
            //     }
            // } else {
            //     $scope.info.resultLoading = false;
            // }
            //reset bread-crumb
            if(!$scope.info.sorting && !$scope.info.drillDown) {
                $scope.timelineGraphDrilDown = [];
            }
            var details = {};
            var activity;
            
            if(!$scope.info.clearFilter && !$scope.info.sorting && !$scope.info.changePageSize) {
                var facetDetails = {};
                angular.forEach(selectedFacets, function(value, key) {
                    if(value.length) {
                        angular.forEach(value, function(facet) {
                            if(!facetDetails.hasOwnProperty(key)) {
                                facetDetails[key] = [];
                            }
                            facetDetails[key].push(facet);
                        });
                    }
                });
                
                if(!!Object.keys(facetDetails).length) {
                    details['Facets Selected'] = facetDetails;
                }
                if(!!$scope.dateRangeFilterName) {
                    details['Quick Filter'] = $scope.dateRangeFilterName;
                }
                details['Date Range'] = $scope.getFrom() + ' - ' + $scope.getTo();
                details['Sort Order'] = $scope.info.sort_order['val'] == 'desc' ? 'Descending' : 'Ascending';
            } else if($scope.info.changePageSize) {
                details['Count'] = $scope.tableParams.count();
            }
            
            if($scope.info.drillDown == true) {
                activity = 'Drill Down';
                $scope.info.drillDown = false;
            } else if($scope.info.clearFilter == true) {
                activity = 'Clear Filter';
                $scope.info.clearFilter = false;
            } else if($scope.info.sorting == true) {
                activity = 'Sort ' + ($scope.info.sort_order['val'] == 'desc' ? 'Descending' : 'Ascending');
                $scope.info.sorting = false;
            } else if($scope.info.changePageSize == true) {
                activity = 'Change Page Count';
                $scope.info.changePageSize = false;
            } else if($scope.info.quickFilter == true) {
                activity = $scope.dateRangeFilterName;
                $scope.info.quickFilter = false;
            } else {
                activity = 'filter';
            }
            
            if($scope.info.paginate == true) {
                $scope.info.paginate = false;
            } else {
                UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, activity, JSON.stringify(details), data.data.solr_query).then(function(response) {
                
                }, handleSessionTimeout);
            }
            
            // Passing data to the chart
            if (d_response.data && d_response.data.response && d_response.data.response.numFound == 0) {
                $scope.info.no_result = true;
                $scope.info.dataLoading = false;
                $scope.info.facetLoading = false;
                $scope.info.response = null;
                $scope.reloadGraph(null);
                $scope.tableParams.total(0);
                $scope.resetFacetsData();
                if(defer){
                    defer.resolve([]);
                }
            } else if(d_response.data && d_response.data.hasOwnProperty('gb_error')) {
                if (d_response.data['gb_error'] == 'ERR_0') {
                    $window.location.href = GlobalService.getVal('redirect_login_url');
                }else{                    
                    $scope.info.no_result = true;
                    $scope.info.dataLoading = false;
                    $scope.info.facetLoading = false;
                    $scope.info.response = null;
                    $scope.reloadGraph(null);
                    $scope.tableParams.total(0);
                    $scope.d3BarRender();
                    $scope.resetFacetsData();
                    if(defer){
                        defer.resolve([]);
                    }
                }
                
            } else {
                if(!d_response.data){
                    return;
                }
                $scope.info.response = d_response.data.response;
                $scope.info.no_result = false;
                $scope.info.dataLoading = false;
                $scope.info.facetLoading = false;
                    
                //set from and date time field with server data(obs_date->end=obs_date->start) 
                var fromDateFromResponse = d_response.data.facet_counts.facet_ranges.obs_date.start;
                var todateFromResponse = d_response.data.facet_counts.facet_ranges.obs_date.end;
                if(fromDateFromResponse){
                    fromDateFromResponse = fromDateFromResponse.replace("T", " ");
                    fromDateFromResponse = fromDateFromResponse.replace("Z","");                    
                    $scope.info.fromDate = metaDataService.getStringToDate(fromDateFromResponse);//moment(fromDateFromResponse, 'YYYY-MM-DD HH:mm:ss').toDate();
                }
                if(todateFromResponse){
                    todateFromResponse = todateFromResponse.replace("T", " ");
                    todateFromResponse = todateFromResponse.replace("Z","");
                    $scope.info.toDate = metaDataService.getStringToDate(todateFromResponse);//moment(todateFromResponse, 'YYYY-MM-DD HH:mm:ss').toDate();
                }
                $scope.info.fromTime.hr = $scope.info.fromDate.getHours();
                $scope.info.fromTime.min = $scope.info.fromDate.getMinutes();
                $scope.info.fromTime.sec = $scope.info.fromDate.getSeconds();
                $scope.info.toTime.hr = $scope.info.toDate.getHours();
                $scope.info.toTime.min = $scope.info.toDate.getMinutes();
                $scope.info.toTime.sec = $scope.info.toDate.getSeconds(); 

                $scope.reloadGraph(d_response.data.facet_counts.facet_ranges);
                $scope.tableParams.total($scope.info.response.numFound);
                $scope.paginator($scope.info.response.numFound);
                $scope.info.chartLevel = d_response.data.facet_counts.facet_ranges['obs_date']['gap'].split('/')[1];
                if(defer){
                    defer.resolve($scope.info.response.docs);
                }
                
                if (!!$scope.info.response.numFound) {
                    $scope.updateFacets(d_response);
                }
                $scope.info.init = true;
            }
            
            //Hide manage drop down list
            var ddElm = angular.element(document.getElementById('expandElement'));
            if(ddElm.hasClass('open')){
                ddElm.removeClass('open');
            }
        
        }, function(d_response) {
            $scope.info.no_result = true;
            $scope.info.dataLoading = false;
            $scope.info.resultLoading = false;
            $scope.info.facetLoading = false;
            $scope.info.response = null;
            $scope.info.drillDown = false;
            $scope.info.clearFilter = false;
            $scope.info.sorting = false;
            $scope.info.changePageSize = false;
            $scope.info.paginate = false;
            $scope.reloadGraph(null);
            $scope.tableParams.total(0);
            $scope.resetFacetsData();
            defer.resolve([]);
            handleSessionTimeout(d_response);
        });
    };
    $scope.resetFacetsData = function(){
        var i;
        for (i in $scope.facets) {
            $scope.facets[i]['data'] = [];
        }
    };
    $scope.closeModal = function(){
        $scope.modalInstance.close();
        if($scope.events_export_limit == undefined || $scope.events_export_limit == 0) {
            $scope.csvpage.noOfRecordsCsv = 1;
        }
    };
    $scope.isFacetsData = function(){        
        var i;
        for (i in $scope.facets) {
            if($scope.facets[i]['data'].length > 0){
                return true;
            }
        }
        return false;
    };
    $scope.updateFacets = function(d_response){  
        var i,
            j,
            k,
            facet_data,
            tempFacet;        
        for (i in $scope.facets) {
            if (!!$scope.info.currentFacet) {
                if ($scope.facets[i].key != $scope.info.currentFacet.key) {
                    $scope.facets[i]['data'] = [];
                    if (!!d_response.data.facet_counts.facet_fields[$scope.facets[i]['key']]) {
                        for ( j = 0; j < d_response.data.facet_counts.facet_fields[$scope.facets[i]['key']].length / 2; ++j) {
                            facet_data = {};
                            facet_data['title'] = $scope.facets[i].label;
                            facet_data['label'] = d_response.data.facet_counts.facet_fields[$scope.facets[i]['key']][j * 2];
                            facet_data['value'] = d_response.data.facet_counts.facet_fields[$scope.facets[i]['key']][parseInt(j * 2 + 1)];
                            if (!!$scope.selectedFacets[$scope.facets[i]['key']] && $scope.selectedFacets[$scope.facets[i]['key']].length) {
                                for (k in $scope.selectedFacets[$scope.facets[i]['key']]) {
                                    if ($scope.selectedFacets[$scope.facets[i]['key']][k].label == facet_data['label']) {
                                        $scope.selectedFacets[$scope.facets[i]['key']][k]['value'] = facet_data['value'];
                                        $scope.facets[i]['data'].push($scope.selectedFacets[$scope.facets[i]['key']][k]);
                                        break;
                                    }
                                }
                                if (k >= $scope.selectedFacets[$scope.facets[i]['key']].length) {
                                    facet_data['selected'] = false;
                                    $scope.facets[i]['data'].push(facet_data);
                                }
                            } else {
                                facet_data['selected'] = false;
                                $scope.facets[i]['data'].push(facet_data);
                            }
                        }
                    }
                    $scope.facets[i]['expanded'] = false;
                } else {
                    $scope.facets[i]['expanded'] = ($scope.facets[i]['expanded'] == undefined) ? false : $scope.facets[i]['expanded'];
                }
            } else {
                $scope.facets[i]['data'] = [];
                if (!!d_response.data.facet_counts.facet_fields[$scope.facets[i]['key']]) {
                    for ( j = 0; j < d_response.data.facet_counts.facet_fields[$scope.facets[i]['key']].length / 2; ++j) {
                        facet_data = {};
                        facet_data['title'] = $scope.facets[i].label;
                        facet_data['label'] = d_response.data.facet_counts.facet_fields[$scope.facets[i]['key']][j * 2];
                        facet_data['value'] = d_response.data.facet_counts.facet_fields[$scope.facets[i]['key']][parseInt(j * 2 + 1)];
                        if (!!$scope.selectedFacets[$scope.facets[i]['key']] && $scope.selectedFacets[$scope.facets[i]['key']].length) {
                            for (k in $scope.selectedFacets[$scope.facets[i]['key']]) {
                                if ($scope.selectedFacets[$scope.facets[i]['key']][k].label == facet_data['label']) {
                                    $scope.selectedFacets[$scope.facets[i]['key']][k]['value'] = facet_data['value'];
                                    $scope.facets[i]['data'].push($scope.selectedFacets[$scope.facets[i]['key']][k]);
                                    break;
                                }
                            }
                            if (k >= $scope.selectedFacets[$scope.facets[i]['key']].length) {
                                facet_data['selected'] = false;
                                $scope.facets[i]['data'].push(facet_data);
                            }
                        } else {
                            facet_data['selected'] = false;
                            $scope.facets[i]['data'].push(facet_data);
                        }
                    }
                }
                $scope.facets[i]['expanded'] = false;
            }
            if (!!($scope.selectedFacets[$scope.facets[i].key] && $scope.selectedFacets[$scope.facets[i].key].length)) {
                for (k in $scope.selectedFacets[$scope.facets[i].key]) {
                    for ( j = 0; j < $scope.facets[i].data.length; j++) {
                        if ($scope.selectedFacets[$scope.facets[i].key][k].label == $scope.facets[i].data[j].label) {
                            break;
                        }
                    }
                    if (j >= $scope.facets[i].data.length) {
                        $scope.facets[i]['data'].push($scope.selectedFacets[$scope.facets[i].key][k]);
                    }
                }
            }
        }
    };
    // Triggered whenever a facet is selected/deselected.
    $scope.checkChange = function(facet, f_data) {
        $scope.info.defaultState = false;
        $scope.info.changedFilter = false;
        $scope.info.pristine = false;
        $scope.info.drillDown = false;
        if (f_data.selected) {
            $scope.addSelected(facet, f_data);
        } else {
            $scope.removeSelected(facet, f_data);
        }
    };

    $scope.isNoFilteredFacetFound = function(facet){
        var filter = facet.filter;
        if(!filter) return false;
        var list = facet.data.filter(function(item){
            if(!item.label) return false;

            if((item.label.toLowerCase()).indexOf(filter.toLowerCase()) != -1) return true;
            return false;
        })
        return !(list.length > 0);
    }
    $scope.facetSelectAll = function(facet) {
        var f_data = facet.data;
        var filter = facet.filter;
        f_data.map(function(item){
            if(!item.label) return false;
            if(item.label.toLowerCase().indexOf(filter.toLowerCase()) != -1){ item.selected = true;}
            else { item.selected = false;}
        });
        $scope.facetApplyMultiple(facet);
    };
    $scope.getSelectedFacetData = function(index){
        return $scope.facets[index];
    }
    // Triggered whenever a facet is sseelct all option
    $scope.facetApplyMultiple = function(facet) {
        var filteredFacets = facet.data,f_data,selected_f_data,found;
        var duplicateFacet_data_selected = filteredFacets.filter(function(f_data){
            if(f_data.selected){
               return true
            }
            return false;
        });
        for(var i=0;i<duplicateFacet_data_selected.length;i++){
            selected_f_data = duplicateFacet_data_selected[i];
            $scope.addSelected(facet, selected_f_data, true);
        }; 
        $scope.info.defaultState = false;
        $scope.info.changedFilter = false;
        $scope.info.currentFacet = facet;
        $scope.info.pristine = false;
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };
    // Triggered whenever a facet is sseelct all option
    $scope.facetApplyFromMoreWindow = function(facetgroup, list, index) {
        //select original facet
        var tempList = $scope.facets[index].data;
        tempList.map(function(item){
            item.selected = false;
            for(var i=0;i<list.length;i++){
                if(list[i].label == item.label){
                    item.selected = true;
                    break;
                }
            };
        });
        //remove pre. selected facet
        if ($scope.selectedFacets[facetgroup.key]) {
            $scope.selectedFacets[facetgroup.key] = [];
        }
        for(var i=0;i<list.length;i++){
            $scope.addSelected(facetgroup, list[i], true);
        };
        $scope.info.defaultState = false;
        $scope.info.changedFilter = false;
        $scope.info.currentFacet = facetgroup;
        $scope.info.pristine = false;
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    // Add the given facet to the selectedFacets list and also sets the same as currentFacet.
    $scope.addSelected = function(facet, f_data, notToReload) {
        $scope.info.defaultState = false;
        $scope.info.changedFilter = false;
        $scope.info.currentFacet = facet;
        if (!$scope.selectedFacets[facet.key]) {
            $scope.selectedFacets[facet.key] = [];
        }
        if(!$scope.isCheckSelectedFacetExist($scope.selectedFacets[facet.key], f_data)){
            $scope.selectedFacets[facet.key].push(f_data);
        } 
        if(!notToReload){
            $scope.info.pristine = false;
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        }
    };
    $scope.isCheckSelectedFacetExist = function(data,f_data){
        for(var i=0;i<data.length;i++){
            if(data[i].label == f_data.label){
                return true;
            }
        }
        return false;
    };

    // Removes the given facet from the selectedFacets list and also sets the same as the currentFacet.
    $scope.removeSelected = function(facet, f_data) {
        $scope.info.defaultState = false;
        $scope.info.changedFilter = false;
        $scope.info.currentFacet = facet;
        $scope.info.drillDown = false;
        $scope.selectedFacets[facet.key].splice($scope.selectedFacets[facet.key].indexOf(f_data), 1);
        var flag = false;
        for (var i in $scope.selectedFacets) {
            for (var j = 0; j < $scope.selectedFacets[i].length; j++) {
                if (!$scope.selectedFacets[i][j].disabled) {
                    flag = true;
                    break;
                }
            }
        }
        if (flag || !$scope.customDateFilter){
            $scope.info.pristine = false;
        }
        else{
            $scope.info.pristine = true;
            $scope.info.currentFacet = null;
        }
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    // Updates the flattened list of selected facets with every change to selectedFacets.
    $scope.listSelectedFacets = function() {
        var i,
            j,
            keys = Object.keys($scope.selectedFacets),
            selectedFacet;
        $scope.selectedFacetsList.length = 0;
        for (i in keys) {
            for (j in $scope.selectedFacets[keys[i]]) {
                selectedFacet = {};
                selectedFacet['f_data'] = $scope.selectedFacets[keys[i]][j];
                selectedFacet['key'] = keys[i];
                $scope.selectedFacetsList.push(selectedFacet);
            }
        }
        //group by facet group name

    };

    // Removes the given facet from the selectedFacets from the click of remove icon.
    $scope.removeFacet = function(key, facet) {
        $scope.info.defaultState = false;
        $scope.info.changedFilter = false;
        $scope.info.page['current'] = 0;
        $scope.info.pristine = false;
        $scope.info.drillDown = false;
        facet.selected = false;
        $scope.info.currentFacet = $scope.getFacet(key);
        //update current facets data to unselect facet
        for(var index = 0;index < $scope.info.currentFacet.data.length;index++){
            if(facet.label === $scope.info.currentFacet.data[index]['label']){
                $scope.info.currentFacet.data[index]['selected'] = false;
            }
        }

        var flag = false;
        $scope.selectedFacets[key].splice($scope.selectedFacets[key].indexOf(facet), 1);
        //$scope.selectedFacets[key].count = $scope.selectedFacets[key].length;
        if($scope.selectedFacets[key].length == 0){
            $scope.selectedFacets[key] = [];
        }        
        for (var i in $scope.selectedFacets) {
            for (var j = 0; j < $scope.selectedFacets[i].length; j++) {
                if (!$scope.selectedFacets[i][j].disabled) {
                    flag = true;
                    break;
                }
            }
        }
        if (flag || !$scope.customDateFilter)
            $scope.info.pristine = false;
        else
            $scope.info.pristine = true;
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };
    $scope.removeFacetGroup = function(key,facet) {
        $scope.info.defaultState = false;
        $scope.info.currentFacet = null;
        $scope.info.pristine = false;
        facet.selected = false;
        var flag = false;
        var tempCount = $scope.selectedFacets[key].length;
        for(i=0;i<tempCount;i++){
            $scope.selectedFacets[key].splice($scope.selectedFacets[key].indexOf($scope.selectedFacets[key][i]), 1);
        }
        //$scope.selectedFacets[key].count = $scope.selectedFacets[key].length;
        if($scope.selectedFacets[key].length == 0){
            $scope.selectedFacets[key] = [];
        }        
        for (var i in $scope.selectedFacets) {
            for (var j = 0; j < $scope.selectedFacets[i].length; j++) {
                if (!$scope.selectedFacets[i][j].disabled) {
                    flag = true;
                    break;
                }
            }
        }
        if (flag || !$scope.customDateFilter)
            $scope.info.pristine = false;
        else
            $scope.info.pristine = true;
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };

    // Reset will remove all the user selection on the UI
    $scope.resetAll = function() {
        var i,
            j,
            d,
            d1;
        for (i in $scope.facets) {
            if (Array.isArray($scope.selectedFacets[$scope.facets[i].key])) {
                $scope.selectedFacets[$scope.facets[i].key].length = 0;
            }
            for (j in $scope.facets[i].data) {
                $scope.facets[i].data[j].selected = false;
            }
        }
        $scope.customDateFilter = true;
        $scope.dateRangeFilterName = GlobalService.getVal('customdate');
        d =  metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        d1 =  metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        if ($scope.info.default_days) {
            d.setTime(d.getTime() - $scope.info.default_days);
        } else {
            d.setFullYear(d.getFullYear() - 10);
        }
        $scope.setFromTo(d, d1);
        $scope.info.pristine = true;
    };

    // Reset will remove all the user selection on the UI and brings the UI to default state. Keeps the defaulf filter intact.
    $scope.reset = function() {
        var d,
            d1,
            i,
            j,
            keys;
       // if ($scope.info.defaultFilterInfo['default_filter_type'] != 'outofboxsearch' || ($scope.info.defaultFilterInfo['default_filter_type'] == 'outofboxsearch' && $scope.info.defaultFilterInfo['default_filter_status'] == 'off') || ($scope.info.defaultFilterInfo['default_filter_type'] == 'outofboxsearch' && $scope.info.defaultFilterInfo['default_filter_status'] == 'on' && $scope.info.defaultFilterInfo['out_of_box_search'] != $scope.info.quick)) {
            $scope.info.quick = 0;
            $scope.info.uploaded_by = null;
            $scope.info.disable_time = false;
            $scope.info.selectedFilterName = "Select View";

            //for (var member in $scope.info.defaultFilterInfo) delete $scope.info.defaultFilterInfo[member];
       //}
         for (i in $scope.facets) {
            if (Array.isArray($scope.selectedFacets[$scope.facets[i].key])) {
                $scope.selectedFacets[$scope.facets[i].key].length = 0;
            }
            for (j in $scope.facets[i].data) {
                $scope.facets[i].data[j].selected = false;
                $scope.facets[i].expanded = false;
            }
            if($scope.facets[i].filter){
                $scope.facets[i].filter = "";
            }
        }

        $scope.customDateFilter = true;
        $scope.dateRangeFilterName = GlobalService.getVal('customdate');
        d =  metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        d1 =  metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        if ($scope.info.max_days_allowed) {
            d.setTime(d.getTime() - $scope.info.default_days);
        } else {
            d.setFullYear(d.getFullYear() - 10);
        }
        $scope.setFromTo(d, d1);
        $scope.info.pristine = true;
    };    
    // Reset from the UI
    $scope.resetFromUI = function() {       
        $scope.info.selectedFilterName = "Select View";
        $scope.info.currentFacet = null;
        $scope.info.clearFilter = true;
        $scope.customDateFilter = true;
        $scope.info.uploaded_by = null;
        $scope.customDateFilterApplied = true;
        $scope.info.page['current'] = 0;
        $scope.reset();
    };

    // Loads a saved view.
    $scope.loadView = function(view) {
        $scope.info.defaultState = false;
        $scope.info.drillDown = false;
        $scope.info.selectedFilterName = view.search_type != "OUTOFBOX" ? view.view_name : $scope.getValue('last' + view.last_n_log_by_user + 'byme');
        $scope.applyView($scope.parseView(view));
        var details = {
            'View Name': $scope.info.selectedFilterName
        };
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, 'Apply View', JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };
    
    // Removes the out of box filters from the applied filters
    $scope.removeOutOfBox = function() {
        $scope.info.defaultState = false;
        $scope.info.changedFilter = false;
        $scope.info.quick = 0;
        $scope.info.disable_time = false;
        $scope.info.uploaded_by = null;
        $scope.info.defaultFilterSelected = false;
        $scope.info.pristine = true;
        $scope.info.selectedFilterName = "Select View";
        $scope.tableParams.reload();
        $scope.refresh();
    };
    
    $scope.trackLogBundle = function(bundle_name) {
        var details = {
            'Bundle Name': $filter('bundleName')(bundle_name)
        };
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, 'Search Log Bundle', JSON.stringify(details)).then(function(response) {
            
        }, handleSessionTimeout);
    };

    // Parses the given facets list into JSON.
    $scope.parseView = function(view) {
        var i,
            p_view = {},
            s_facets;
        if (view.facet_filters[0] != "NA") {
            p_view['facets'] = {};
            p_view['facetKeys'] = {};
            s_facets = view.facet_filters[0].match(/`([^`]+)`/g);
            for (i in s_facets) {
                s_facets[i] = s_facets[i].replace(/`/g, '');
                if (!p_view['facets'].hasOwnProperty(s_facets[i].split('^')[0])) {
                    p_view['facets'][s_facets[i].split('^')[0]] = [];
                }
                if (s_facets[i].split('^')[0] == 'namespace' || s_facets[i].split('^')[0] == 'events') {
                    p_view['facets'][s_facets[i].split('^')[0]].push(s_facets[i].split('^')[1]);
                    p_view['facetKeys'][s_facets[i].split('^')[1]] = s_facets[i].split('^')[2];
                } else {
                    p_view['facets'][s_facets[i].split('^')[0]].push(s_facets[i].split('^')[1]);
                }
            }
        }
        if(!!view.extraFacets) {
        	var extraFacetFound = false;
        	angular.forEach(view.extraFacets, function(values, facet) {
        		if(!!p_view['facets'][facet]) {
                    angular.forEach(values, function(value) {
                    	if(facet == 'namespace' && $scope.sectionsContent[value]["nsType"] == "EVENT") {
		                    facet = 'events';
		                }
                        if((facet == "namespace" || facet == "events") && p_view['facets'][facet].indexOf($scope.sectionsContent[value]['description']) == -1) {
                    		p_view['facets'][facet].push($scope.sectionsContent[value]['description']);
                    		p_view['facetKeys'][$scope.sectionsContent[value]['description']] = value;
                    		extraFacetFound = true;
                    	} else if(!(facet == "namespace" || facet == "events") && p_view['facets'][facet].indexOf(value) == -1) {
                    		p_view['facets'][facet].push(value);
                    		extraFacetFound = true;
                    	}
                    });	
                } else {
                	p_view['facets'][facet] = [];
            		angular.forEach(values, function(value) {
            			if(facet == 'namespace' && $scope.sectionsContent[value]["nsType"] == "EVENT") {
		                    facet = 'events';
		                }
		                if(facet == 'namespace' || facet == 'events') {
		                	p_view['facets'][facet].push($scope.sectionsContent[value]['description']);
		                	p_view['facetKeys'][$scope.sectionsContent[value]['description']] = value;
		                	extraFacetFound = true;
		                } else {
		                	p_view['facets'][facet].push(value);
		                	extraFacetFound = true;
		                }
                    });	
                }
            });
            if(!!extraFacetFound) {
            	$scope.info.selectedFilterName = "Select View";
            }
        }
        p_view['start_time'] = view.start_ts;
        p_view['out_of_box'] = view.search_type == 'OUTOFBOX';
        p_view['end_time'] = view.end_ts;
        p_view['lastn'] = view.last_n_log;
        p_view['lastnbyme'] = view.last_n_log_by_user;
        p_view['default'] = view.default;
        return p_view;
    };

    // Applies the given parsed view.
    $scope.applyView = function(p_view) {
        var i,
            j,
            k,
            l,
            m,
            keys = [],
            facet;
            
        $scope.info.viewLoad = true;
        if(!p_view['out_of_box']) {
            if (!!p_view['facets']) {
                keys = Object.keys(p_view['facets']);
            }
            $scope.resetFacets();
            $scope.info.disable_time = false;
            $scope.info.pristine = false;
            $scope.info.quick = 0;
            $scope.info.uploadedBy = null;
            for (i in keys) {
                for (j in $scope.facets) {
                    if (keys[i] != 'relativetimefilter' && keys[i] === $scope.facets[j].key) {
                        if (!Array.isArray($scope.selectedFacets[keys[i]])) {
                            $scope.selectedFacets[keys[i]] = [];
                        }
                        for ( k = 0; k < p_view['facets'][keys[i]].length; k++) {
                            for ( l = 0; l < $scope.facets[j].data.length; ++l) {
                                if (p_view['facets'][keys[i]][k] == $scope.facets[j].data[l].label) {
                                    if (!!$scope.selectedFacets[keys[i]] && !!$scope.selectedFacets[keys[i]].length) {
                                        for ( m = 0; m < $scope.selectedFacets[keys[i]].length; ++m) {
                                            if ($scope.facets[j].data[l].label == $scope.selectedFacets[keys[i]][m].label) {
                                                $scope.facets[j].data[l].disabled = true;
                                                $scope.selectedFacets[keys[i]][m].disabled = true;
                                                break;
                                            }
                                        }
                                        if (m >= $scope.selectedFacets[keys[i]].length) {
                                            // alert("Facet doesn't exist in selectedFacets, so adding " + $scope.facets[j].data[l].label);
                                            $scope.facets[j].data[l].selected = true;
                                            // if (p_view.default) {
                                                // $scope.facets[j].data[l].disabled = true;
                                            // } else {
                                                $scope.facets[j].data[l].disabled = false;
                                            // }
                                            $scope.selectedFacets[keys[i]].push($scope.facets[j].data[l]);
                                        }
                                    } else {
                                        // alert("No selected facets " + $scope.facets[j].data[l].label);
                                        $scope.facets[j].data[l].selected = true;
                                        // if (p_view.default) {
                                            // $scope.facets[j].data[l].disabled = true;
                                        // } else {
                                            $scope.facets[j].data[l].disabled = false;
                                        // }
                                        // if (!$scope.selectedFacets[keys[i]]) {
                                            // $scope.selectedFacets[keys[i]] = [];
                                        // }
                                        $scope.selectedFacets[keys[i]].push($scope.facets[j].data[l]);
                                    }
                                    break;
                                }
                            }
                            if (l >= $scope.facets[j].data.length) {
                                // alert("Facet doesn't exist in $scope.facets" + p_view['facets'][keys[i]][k]);
                                facet = {};
                                facet['label'] = p_view['facets'][keys[i]][k];
                                if (p_view['facetKeys'].hasOwnProperty(p_view['facets'][keys[i]][k])) {
                                    facet['key'] = p_view['facetKeys'][p_view['facets'][keys[i]][k]];
                                }
                                facet['value'] = 0;
                                facet['selected'] = true;
                                // if (p_view.default) {
                                    // facet['disabled'] = true;
                                // } else {
                                    facet['disabled'] = false;
                                // }
                                $scope.facets[j].data.push(facet);
                                $scope.selectedFacets[keys[i]].push(facet);
                            }
                        }
                    }
                }
            }
            if (keys.indexOf("relativetimefilter") != -1) {
                $scope.changeQuickFilter(p_view['facets']['relativetimefilter'][0]);
                // if (p_view.default) {
                    // $scope.info.defaultState = true;
                // }
            } else {
                $scope.customDateFilter = true;
                $scope.customDateFilterApplied = true;
                var fromDateFromResponse = p_view['start_time'].replace("T", " ");
                fromDateFromResponse = fromDateFromResponse.replace("Z","");
                var toDateFromResponse = p_view['end_time'].replace("T", " ");
                toDateFromResponse = toDateFromResponse.replace("Z","");
                fromDateFromResponse = metaDataService.getStringToDate(fromDateFromResponse); //moment(fromDateFromResponse, 'YYYY-MM-DD HH:mm:ss').toDate();
                toDateFromResponse = metaDataService.getStringToDate(toDateFromResponse); //moment(toDateFromResponse, 'YYYY-MM-DD HH:mm:ss').toDate();
                $scope.setFromTo(fromDateFromResponse,toDateFromResponse);
            }
        } else {
            $scope.loadLogsByMe(p_view['lastnbyme'], true);
        }
        
    };

    //Checks if facet should be disabled
    $scope.checkDisabled = function(facet, f_data) {
        for (var i in $scope.selectedFacets[facet.key]) {
            if ($scope.selectedFacets[facet.key][i].label === f_data.label && $scope.selectedFacets[facet.key][i].disabled) {
                f_data.disabled = true;
                return true;
            }
        }
        return false;
    };

    // Resets the facet selection
    $scope.resetFacets = function() {
        var i,
            j;
        for (i in $scope.facets) {
            if (Array.isArray($scope.selectedFacets[$scope.facets[i].key])) {
                $scope.selectedFacets[$scope.facets[i].key].length = 0;
            }
            for (j in $scope.facets[i].data) {
                if ($scope.facets[i].data[j].selected == true) {
                    $scope.facets[i].data[j].selected = false;
                }
            }
        }
    };

    //Save view related methods...

    $scope.saveModal = {};
    $scope.form = {};
    
    
    $scope.showSaveFilterModal = function() {
        if ($scope.savedFiltersList.length >= GlobalService.getVal('max_views_limit')) {
            ModalService.alertBox({
                msgKey : 'max_views_msg'
            });
            return;
        }
        $scope.saveModal = {};
        $scope.saveModal.saveStatus = "initiated";
        $scope.saveModal.message = "";
        $scope.saveModal.filters = "";
        $scope.saveModal.filtersString = "";
        $scope.saveModal.searchQuery = $scope.info.filterSuggest;
        $scope.saveModal.timeRange = $scope.getFrom(true).replace(/T|Z/g, " ") + "To " + $scope.getTo(true).replace(/T|Z/g, " ");
        var tmpKey = "";
        if ($scope.customDateFilter == false) {
            $scope.saveModal.timeRange = $scope.dateRangeFilterName;
            $scope.saveModal.filtersString += '`relativetimefilter' + '^' + $scope.dateRangeFilterName + '`';
        }
        var keys = Object.keys($scope.selectedFacets);
        for (var i in keys) {
            for (var j in $scope.selectedFacets[keys[i]]) {
                if ($scope.saveModal.filtersString) {
                    $scope.saveModal.filtersString += ',';
                }
                $scope.saveModal.filtersString += '`' + keys[i] + "^" + $scope.selectedFacets[keys[i]][j].label + ($scope.selectedFacets[keys[i]][j].hasOwnProperty('key') ? "^" + $scope.selectedFacets[keys[i]][j].key : '') + '`';

                if ($scope.saveModal.filters != "") {
                    $scope.saveModal.filters = $scope.saveModal.filters + ', ' + $scope.selectedFacets[keys[i]][j].label;
                } else {
                    $scope.saveModal.filters = $scope.selectedFacets[keys[i]][j].label;
                }
            }
        }
        $scope.modal = ModalService.openModal('partials/logvault-save-filter.html', $scope, false, true);

        $scope.form = {
            visible : true,
            message : ""
        };
    };
         
    $scope.saveModal.viewOverwrite = false;
    $scope.saveModal.viewOverwriteIsDefault = false;
    $scope.checkViewName = function(){  
    
        $scope.saveModal.viewOverwrite = false;
        $scope.saveModal.viewOverwriteIsDefault = false;
        if($scope.savedFiltersList && $scope.savedFiltersList.length && $scope.savedFiltersList.length > 0){
            var found = false;
            for(var i=0; i< $scope.savedFiltersList.length; i++) {
                if($scope.savedFiltersList[i].view_name == $scope.saveModal.filterName) {                   
                    if($scope.savedFiltersList[i].currentUser) {
                        $scope.saveModal.viewOverwrite = true;
                        if($scope.savedFiltersList[i].default){
                            $scope.saveModal.viewOverwriteIsDefault = true;
                        }
                        continue;
                    }else{                          
                        found = true;
                        break;
                    }
                }
            }   
            if(found) {
                // mark it as invalid
                $scope.form.saveViewModal.viewName.$setValidity('duplicate', false)
            }else{
                $scope.form.saveViewModal.viewName.$setValidity('duplicate', true)          
            }
            
        }else{
            $scope.getSavedFilters();
        }
    }
    $scope.saveFilter = function() {
        if (!$scope.form.saveViewModal.$valid) {
            return;
        }
        $scope.callSaveViewAPI();

    };
    
    $scope.callSaveViewAPI = function() {
        var saveParam = {
            "last_n_log" : $scope.info.quick > 1 ? $scope.info.quick : 0,
            "last_n_log_uploaded_by_me" : $scope.info.quick == 1 ? $scope.info.quick : 0,
            "facet_string" : $scope.saveModal.filtersString,
            "start_time" : $scope.getFrom(),
            "end_time" : $scope.getTo(),
            "search_name" : $scope.saveModal.filterName,
            "search_desc" : escape($scope.saveModal.desc),
            "is_public" : $scope.saveModal.access == 'public' ? true : false,
            "is_default" : $scope.info.defaultFilterInfo.view_name == $scope.saveModal.filterName ? true : false
        };
        $scope.saveModal.saveStatus = "progress";
        LogVaultService.saveFilter(saveParam).then(function(response) {
            var details = {
                "View Name" : $scope.saveModal.filterName,
                "Facet String" : $scope.saveModal.filtersString,
                "Time Range" : $scope.getFrom() + "--" + $scope.getTo()
            };
            UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, 'Save View', "{\'" + JSON.stringify(details) + "\'}").then(userTrackingSuccess, handleSessionTimeout);

            $scope.saveModal.saveStatus = "success";
            $scope.saveModal.message = "View saved successfully.";
            // if($scope.info.defaultFilterInfo.view_name == $scope.saveModal.filterName) {
                // $scope.loadDefaultFilter();
            // }
            $scope.getSavedFilters();
            // $scope.getAllSavedFilter();
        }, function(response) {
            $scope.saveModal.saveStatus = "error";
            $scope.saveModal.message = "Oops! Something went wrong!";
            handleSessionTimeout(response);
        });
    };

    // Closes the modal held by $scope.modal
    $scope.hideModal = function() {
        $scope.modal.close();
    };
    /*
     * Load and set filter list
     */
    $scope.savedFiltersList = [];
    $scope.savedFiltersListNotFound = false;
    $scope.allUsersInfo = [];
    $scope.currentUserId = null;
    $scope.savedFiltersListLoading = true;

    $scope.getSavedFilters = function(track) {
        $scope.savedFiltersListLoading = true;
        LogVaultService.getSavedFilters().then(function(response) {
            populateSavedViewsList(response, track);

        }, function(response) {
            handleSessionTimeout(response);
            $scope.savedFiltersListLoading = false;
            $scope.savedFiltersListNotFound = true;
        });
    };
    
    function populateSavedViewsList(response, track) {
        $scope.savedFiltersList = [];
        $scope.allFilterList = response.data.Data;
        angular.forEach($scope.allFilterList, function(view) {
            if(view.search_type != "OUTOFBOX") {
                $scope.savedFiltersList.push(view);
            }
        });
        var defaultFilterArr = $filter('filter')($scope.allFilterList, {created_by: $scope.getLoggedInUserName(), default: true}) || [];
        $scope.info.defaultFilterInfo = defaultFilterArr.length ? defaultFilterArr[0] : {};
        $scope.savedFiltersListLoading = false;
        if ($scope.savedFiltersList && $scope.savedFiltersList.length > 0) {
            $scope.savedFiltersListNotFound = false;
        } else {
            $scope.savedFiltersListNotFound = true;
        }
        
        var viewsList = [];
        //Process respone and insert field "currentUser" true/false
        for (var i = 0; i < $scope.savedFiltersList.length; i++) {
            $scope.savedFiltersList[i].currentUser = $scope.savedFiltersList[i].created_by == $scope.getLoggedInUserName() ? true : false;
            viewsList.push($scope.savedFiltersList[i].view_name);
        }
        
        if(track) {
            var details = {
                'Name of views': viewsList
            };
            UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, 'List view', JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
        }
        //check for duplicate name during add a new view
        if ($scope.saveModal.filterName && $scope.form.saveViewModal) {
            var found = false;
            for (var i = 0; i < $scope.savedFiltersList.length; i++) {
                if ($scope.savedFiltersList[i].view_name == $scope.saveModal.filterName) {
                    if ($scope.savedFiltersList[i].currentUser) {
                        $scope.saveModal.viewOverwrite = true;
                        continue;
                    } else {
                        found = true;
                        break;
                    }
                }
            }

            if (found && $scope.form.saveViewModal.viewName) {
                // mark it as invalid
                $scope.form.saveViewModal.viewName.$setValidity('duplicate', false);
            } else {
                $scope.form.saveViewModal.viewName.$setValidity('duplicate', true);
            }
        }
    }
    
    $scope.getViewCreaterName = function(id) {
        for (var i = 0; i < $scope.allUsersInfo.length; i++) {
            if($scope.allUsersInfo[i][0] == id){
                return $scope.allUsersInfo[i][2] + ' ' + $scope.allUsersInfo[i][3];
            }
        }
    };
    $scope.getViewCreatedByEmail = function(id) {
        for (var i = 0; i < $scope.allUsersInfo.length; i++) {
            if($scope.allUsersInfo[i][0] == id){
                return $scope.allUsersInfo[i][1] ;
            }
        }
    };
    /*
     * Get current user name i.e logged in user name
     */
    $scope.getLoggedInUserName = function() {   
        var user = metaDataService.getUser();       
        return user.email;
    };
    /*
     * Track user selection for filter list
     */
    $scope.info.filterBtn = 'all';
    $scope.getFilterScope = function(filter) {
        if ($scope.info.filterBtn == 'all') {
            return (filter.currentUser || (!filter.currentUser && filter.public));
        } else if ($scope.info.filterBtn == 'my') {
            return filter.currentUser;
        } else {
            return !filter.currentUser && filter.public;
        }       
    };
    $scope.getFilterOtherScope = function(filter) {
        return !filter.currentUser && filter.public;
    };

    $scope.info.setDefaultFilterOperation = {
        filterId : null,
        statusCode : 0
    };

    $scope.hideLeftMenu = false;
    $scope.hideFacets = function(isHide) {
        if (isHide) {
            $(".gb-data-contrainer").addClass('gb-fullscreen');
        } else {

            $(".gb-data-contrainer").removeClass('gb-fullscreen');
        }
        $timeout(function() {
            $scope.d3BarRender();
        }, 500);
        
    };

    $scope.deleteSavedFilter = function(selectedFilter, event) {
        //AppService.toggleProfileOption();
        $scope.modal = ModalService.openModal('partials/logvault_delete_filter.html', $scope, false, true);
        $scope.deleteModal = {};
        $scope.deleteModal.filter = {};
        $scope.deleteModal.filter.name = selectedFilter.view_name;
        $scope.deleteModal.filter.desc = decodeURIComponent(selectedFilter.desc);
        $scope.deleteModal.filter.id = selectedFilter.view_name;
        $scope.deleteModal.filter.isDefault = selectedFilter.default; 
        //$scope.info.defaultFilterInfo.search_id == selectedFilter[0] && $scope.info.defaultFilterInfo.default_filter_status === 'on' ? true : false;
        $scope.deleteModal.status = "initiated";
        $scope.deleteModal.deleteOperationMsg = "";
    };

    //Deletes the selected filter permanently
    $scope.deleteFilterRequest = function(filterName) {
        $scope.deleteModal.status = "progress";
        LogVaultService.deleteSavedFilter(filterName).then(function(response) {
            $scope.deleteModal.status = "success";
            if($scope.info.selectedFilterName == filterName) {
                $scope.info.selectedFilterName = "Select View";
            }
            $scope.deleteModal.deleteOperationMsg = "Deleted successfully";
            var details = {
                "View Name" : $scope.deleteModal.filter.name
            };
            UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, 'Delete View', "{\'" + JSON.stringify(details) + "\'}").then(userTrackingSuccess, handleSessionTimeout);

            if ($scope.deleteModal.filter.isDefault) {
                $scope.info.defaultFilterInfo = "";
                $scope.resetFromUI();
            }
            $scope.getSavedFilters();
        }, function(response) {
            $scope.deleteModal.status = "error";
            $scope.deleteModal.deleteOperationMsg = "Error : " + response.data.msg;
            $scope.savedFiltersListNotFound = true;
            handleSessionTimeout(response);
        });
    };

    // To open the facet chart.
    $scope.openFacetChart = function(f_data, facetLabel) {
        var dateRange = "Time Range: " + $scope.facetSubCaptionDateFormat($scope.info.fromDate) + " TO " + $scope.facetSubCaptionDateFormat($scope.info.toDate);
        var f_conf = {};
        f_conf['cData'] = f_data;
        f_conf['cType'] = "bar2d";
        f_conf['facetChartMax'] = false;
        f_conf['exportImage'] = 0;
        f_conf['exportPdf'] = 0;
        f_conf['facetLabel'] = facetLabel ? facetLabel : "";
        f_conf['dateRange'] = dateRange;
        $scope.info.facetCharts.push(f_conf);
    };

    // To close the current facet chart.
    $scope.closeFacetChart = function(modal) {
        $scope.info.facetCharts.splice($scope.info.facetCharts.indexOf(modal), 1);
    };

    // To initiate download of facet chart as image
    $scope.exportAsImage = function(modal) {
        modal.exportImage = parseInt(modal.exportImage + 1);
    };

    // To initiate download of facet chart as pdf
    $scope.exportAsPDF = function(modal) {
        modal.exportPdf = parseInt(modal.exportPdf + 1);
    };

    // To add or remove a given bundle from the list of bundles.
    $scope.addRemoveBundle = function(bundle) {
        var len  = $scope.tableParams.data.length, count=0;
        for(var i=0;i<len;i++){
            if($scope.tableParams.data[i].selected){
                count++;
            }
        }
        if(count > 0){
            $scope.testBundleMsg = "Upload "+count+ " Bundles";
        }else{
            $scope.testBundleMsg = "Select Bundles";
        }        
    };

    // To bring up the list of files for a given bundle.
    $scope.listFiles = function(bundle) {
        var index = $scope.info.fileLists.length,
            url = bundle.obs_url;
        var sysId = bundle[$scope.info.sysId];
        var obsDate = bundle['obs_date'];

        $scope.info.fileLists[index] = {
            'loading' : true
        };
        LogVaultService.getFileList(url, sysId, bundle['obs_date']).then(function(response) {
            if (response.data.Status == 'Success') {
                // hack code for temp. fix
                // var bundlesFiles = response.data.Data.bundles.files[0];
                // bundlesFiles = bundlesFiles.split(',');              
                // response.data.Data.bundles.files = bundlesFiles;
                // hack code ends
                
                response.data.Data.bundles['sys_id'] = sysId;
                response.data.Data.bundles['obs_date'] = obsDate;
                
                //response.data.Data.bundles[0] = tmp;
                $scope.info.fileLists[index] = response.data.Data.bundles;
            }
        }, function(response) {
            handleSessionTimeout(response);
            console.error(response);
        });
    };

    // Close list of files
    $scope.closeFileList = function(modal) {
        $scope.info.fileLists.splice($scope.info.fileLists.indexOf(modal), 1);
    };

    // Brings up the list of bundles selected for download.
    $scope.showDownloadList = function() {
        $scope.bundleList = [];
        for(var i in $scope.tableParams.data) {
            if(!!$scope.tableParams.data[i].selected) {
                $scope.bundleList.push($scope.tableParams.data[i]);
            }
        }
        if ($scope.bundleList.length) {
            $scope.modal = ModalService.openModal('custom/download_list', $scope, false, true);
        } else {
            ModalService.alertBox({msg: 'Please select one or more bundle to start the download.'});
        }
    };

    // Returns the total size of all the bundles selected...
    $scope.getTotalSize = function() {
        var i,
            sum = 0;
        for (i in $scope.bundleList) {
            sum += parseInt($scope.bundleList[i].obs_size);
        }
        return sum;
        // return 12312312;
    };

    // Returns the string for download of single file.
    $scope.generateUrlForFile = function(bundle, file) {
        var url = {},
            t_bundle = {};
        t_bundle['bundle_name'] = bundle.bundle_name;
        t_bundle['files'] = [];
        t_bundle['obs_date'] = bundle.obs_date;
        t_bundle['files'].push(file);
        url['bundles'] = [];
        url['bundles'].push(t_bundle);
        url['download_type'] = "files";
        return JSON.stringify(url);
    };

    $scope.generateUrlForBundle = function() {
                
        // var size = $scope.getTotalSize();
        // var download_max_limit = GlobalService.getVal('download_max_limit');
        // if (size > download_max_limit) {
            // // alert(GlobalService.getVal('download_message'));
            // ModalService.alertBox({msgKey: 'download_message'});
            // return;
        // }
        var i,
            url = "", sid2;
        if (arguments.length) {
            url += "obs_url=" + arguments[0].obs_url;
        } else {
            for (i in $scope.bundleList) {
                if (url != "") {
                    url += "&";
                }
				sid2 = $scope.bundleList[i]['sysid2'];
                if(!sid2){
                    sid2 = 'NA';
                }

                url += "obs_url=" + $scope.bundleList[i].obs_url + "#-#" + $scope.bundleList[i]['sysid1'] + "#-#" + sid2 + "#-#"  + $scope.bundleList[i]['obs_date'];
            }
        }
        return url;
    };

    $scope.generateUrlForBundleGroup = function() {

        var size = $scope.getTotalSize();
        var download_max_limit = GlobalService.getVal('download_max_limit');
        if (size > download_max_limit) {
            $scope.info.dataLoading = false;
            $scope.info.resultLoading = false;
            $scope.info.facetLoading = false;
            var modal = ModalService.alertBox({msgKey: 'download_message'}, false);
            $scope.info.fadeModal = true;
            modal.close = function(){
                $scope.info.fadeModal = false;
                this.dismiss();
            }
            return;
        }
        var i,
            url = "", sid2;
        if (arguments.length) {
            url += "obs_url=" + arguments[0].bundle_name;
        } else {
            for (i in $scope.bundleList) {
                if (url != "") {
                    url += "&";
                }
                sid2 = $scope.bundleList[i]['sysid2'];
                if(!sid2){
                    sid2 = 'NA';
                }
                url += "obs_url=" + $scope.bundleList[i].obs_url + "#-#" + $scope.bundleList[i]['sysid1'] + "#-#" + sid2 + "#-#"  + $scope.bundleList[i]['obs_date']+"#-#"+ $scope.bundleList[i]['bundle_id'] ;
            }
        }
        return url;
    };
    $scope.facetSubCaptionDateFormat = function(value) {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var d = new Date(value),
            month = months[d.getMonth()],
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    };

    /*
     * Load all user information and Default filter object
     *
     */
    
    var firstTimeLoaded = false;
    
    $scope.loadDefaultFilter = function() {
        var dashboardView = LogVaultService.getLoadView();
        if(!!dashboardView) {
            if(dashboardView.type == "custom") {
                var view = dashboardView['view'];
                view.view_name = 'Select View';
                var facet_filters = "";
                angular.forEach(view.facet_filters, function(values, facet) {
                    angular.forEach(values, function(value) {
                        var tmpString = "`" + facet + "^" + value + "`";
                        facet_filters += (!!facet_filters.length ? ',' : '') + tmpString;
                    });
                });
                view.facet_filters = [facet_filters];
                firstTimeLoaded = true;
                $scope.loadView(view);
            } else if(dashboardView.type == "savedView") {
                $scope.info.dataLoading = true;
                $scope.info.facetsLoading = true;
                LogVaultService.getSavedFilters().then(function(response) {
                    $scope.info.dataLoading = false;
                    $scope.info.facetsLoading = false;
                    var view = $filter('filter')(response.data.Data, {view_name: dashboardView.view}, true) || [];
                    if(view.length == 1) {
                    	if(!!dashboardView.facets) {
                    		view[0].extraFacets = dashboardView.facets;
                    	}
                        $scope.loadView(view[0]);
                    } else {
                        ModalService.alertBox({msg: "View not found"});
                        if(!firstTimeLoaded) {
                            LogVaultService.setLoadView(null);
                            $scope.loadDefaultFilter();
                        } else {
                            firstTimeLoaded = true;
                        }
                    }
                }, function(response) {
                    
                });
            }
            LogVaultService.setLoadView(null);
        }
        LogVaultService.getDefaultFilterInfo().then(function(response) {
            var d,
                d1,
                view_name;
            $scope.info.defaultFilterInfo = response.data.Data;
            if ($scope.info.defaultFilterInfo == '') {
                $scope.info.defaultFilterInfo = {};
                if(!dashboardView) {
                    firstTimeLoaded = true;
                    $scope.resetAll();
                }else if(dashboardView.source && dashboardView.source == 'test_rule'){
                    firstTimeLoaded = true;
                    $scope.resetAll();
                    $scope.updateWhetherToShowUploadBundleToTest();
                }
            } else if ( typeof $scope.info.defaultFilterInfo === 'object') {
                if(!dashboardView) {
                    firstTimeLoaded = true;
                    $scope.loadView($scope.info.defaultFilterInfo);
                }else if(dashboardView.source && dashboardView.source == 'test_rule'){
                    firstTimeLoaded = true;
                    $scope.loadView($scope.info.defaultFilterInfo);
                    $scope.updateWhetherToShowUploadBundleToTest();
                }
            }
        }, function(response) {
            console.error("Unable to fetch default filter.");
            handleSessionTimeout(response);
        });
        
    };
    
    $scope.logShowTime = function() {
        var details = {};
        var activity = ($scope.info.showOTime ? 'Show' : 'Hide') + ' Original Time';
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, activity, JSON.stringify(details)).then(function(response) {
            
        }, handleSessionTimeout);
    };
    
    $scope.logToggleTimeline = function(showTimeline) {
        var details = {};
        details['Timeline'] = !!showTimeline ? 'Show Timeline' : 'Hide Timeline';
        var activity = 'Toggle Timeline';
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.application, activity, JSON.stringify(details)).then(function(response) {
            
        }, handleSessionTimeout);
    };
    
    function userTrackingSuccess(response) {
        
    };
    $scope.redirectSearchPage = function(bundle){
        var logBundle=bundle.obs_url;
        var bundlename=bundle.obs_url;
        var bundle_id=bundle.bundle_id;
        var bundleData = {};
        bundleData['Log Bundle'] = logBundle;
        bundleData['bundlename'] = bundlename;
        bundleData['bundle_id'] = bundle_id;
        ExplorerService.setBundleData(bundleData);
        $scope.$emit('changePageEvent', 'explorer');
    }

    $scope.showMoreOption = function(data){
        return data.length > $scope.info.facetLimit;
    };
    $scope.openRulesTestPage = function(){
        $scope.bundleList = [];
        for(var i in $scope.tableParams.data) {
            if(!!$scope.tableParams.data[i].selected) {
                $scope.bundleList.push($scope.tableParams.data[i]);
            }
        }
        if ($scope.bundleList.length == 0) {
            ModalService.alertBox({msg: 'Please select one or more bundle to test.'});
            return;
        }
        var params = {
            app: 'rules_and_alerts'
        }
        RulesService.setLogBundle($scope.bundleList);
        $window.moveToApplication(params);
    };
    $scope.updateWhetherToShowUploadBundleToTest = function(){
        if($scope.fromRulesTestPage.page && ($scope.fromRulesTestPage.page == 'test_rule_history')){
            if($scope.fromRulesTestPage.rules && $scope.fromRulesTestPage.rules.length > 0){
                $scope.showTestRuleIcon= true;
                $scope.selectBundleNotification = true;
                return;
            }
        }
        $scope.showTestRuleIcon = false;
        $scope.selectBundleNotification = false;
    };

    $scope.renderHtml = function (html) {
        return $sce.trustAsHtml(html);
    };
}]);
