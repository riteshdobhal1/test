angular.module('gbApp.controllers.explorer', ['gbApp.services', 'gbApp.services.explorer', 'gbApp.globals']).controller('ExplorerCtrl', ['$scope', '$cookies', '$sce', '$filter', 'ErrorService', 'ModalService', 'ExplorerService', 'InstanceHandler', 'GlobalService', 'AppService', '$timeout', '$window', '$q', 'UserTrackingService', 'metaDataService', '$interval',
function($scope, $cookies, $sce, $filter, ErrorService, ModalService, ExplorerService, InstanceHandler, GlobalService, AppService, $timeout, $window, $q, UserTrackingService, metaDataService, $interval) {
    // Holder for all the app info
    //var htmconst_data = [];
    var htmconst_url = "../config/constants/explorer_constants.json";
    $.get(htmconst_url, function (response, status) {
        $scope.explorerconstants = response;
    });
    $scope.info = {};
    $scope.$parent.justforflag.stillloading = true;
    $scope.nographmarks = false;
    $scope.exportCsvTitle = GlobalService.getVal('exportCsvTitle');
    $scope.bottom10Title = GlobalService.getVal('bottom10Title');
    $scope.top10Title = GlobalService.getVal('top10Title');
    $scope.enableFacetStats = GlobalService.getVal('enableFacetStats');
    $scope.noOfRecordsLbl = GlobalService.getVal('noOfRecordsLbl');
    $scope.fromPageLbl = GlobalService.getVal('fromPageLbl');
    $scope.minNoOFRecords = GlobalService.getVal('minNoOFRecords');
    $scope.maxNoOFRecords = GlobalService.getVal('maxNoOFRecords');
    $scope.limitFacet = GlobalService.getVal('limitFacet');
    $scope.limitFacetTotal = GlobalService.getVal('limitFacetTotal');
    $scope.events_export_limit = GlobalService.getVal('events_export_limit');
    $scope.show_more_characters_limit = GlobalService.getVal('show_more_characters_limit');
    $scope.gbStore = {
        fromDate: "",
        toDate: ""
    };
    $scope.timelineGraphDrilDown = [];
    $scope.ctrlId = $scope.$parent.activeTab.id;
    $scope.todayDate = metaDataService.getTodayDate();
    $scope.csvpage = [];
    $scope.csvpage.pagevalue = "current";
    if($scope.events_export_limit == undefined || $scope.events_export_limit == 0) {
        $scope.csvpage.noOfRecordsCsv = 1;
    }else {
        $scope.csvpage.noOfRecordsCsv = $scope.events_export_limit;
    }
    $scope.csvdownloaderror = false;
    $scope.noOfRecordsCsv = "";

    // Defines the completion of initial load.
    // $scope.info.init = false;

    // Defines the uploaded_by field for out of the box filters.
    $scope.info.uploadedBy = null;

    // Defines whether the customer has events and sections or not.
    $scope.info.hasSections = false;
    $scope.info.hasEvents = false;
    // Holds the start date.
    $scope.info.fromDate = null;

    // Holds the end date.
    $scope.info.toDate = null;

    // Holds the start time.
    $scope.info.fromTime = {};
    $scope.info.refCount = 0;

    // Holds the end time.
    $scope.info.toTime = {};

    // Holds all the facets data.
    $scope.facets = [];

    // Holds the selected facets.
    $scope.selectedFacets = {};

    // Holds the current chart level
    $scope.info.chartLevel = "YEAR";

    // Holds the default level for the chart based on default days.
    $scope.info.defaultLevel = "YEAR";

    // Holds the event attributes
    $scope.info.selectedEvtAttribs = [];

    // Temporarily holds the event attributes
    $scope.info.tSelectedEvtAttribs = [];

    // Holds all the event attributes
    $scope.info.evtAttribs = [];

    // Holds the name of selected saved filter
    $scope.info.selectedFilterName = "Select View";

    //Defines whether search dropdown should be visible or not
    $scope.info.showDropdown = false;

    //Defines whether auto-open is on or off
    $scope.info.autoOpen = true;

    $scope.defaultFacet = null;

    $scope.d3Attr = {
        height: 180,
        width: 800
    };

    // Defines the sort order selection on the UI.
    $scope.info.sortOrder = {
        "label" : "Latest",
        "val" : "desc"
    };

    // Defines the page object for pagination.
    $scope.info.page = {
        "total" : 0,
        "current" : 0,
        "pages" : 0,
        "count" : 10
    };

    // Holds the url list for linked attributes
    $scope.info.urlList = {};

    //Defines which user's filter is on
    $scope.info.filterBtn = 'all';

    //Defines initial state of saved filters
    $scope.savedFiltersList = [];

    //Initially, flag for saved filter not found is set to false
    $scope.savedFiltersListNotFound = false;

    //Defines all users info
    $scope.allUsersInfo = [];

    //Inintializes current User ID
    $scope.currentUserId = null;

    //Intializes the export url to null
    $scope.exportUrl = null;

    // Holds all the facetCharts.
    $scope.info.facetCharts = [];

    // Defines whether explorer is in pristine state or not ??
    $scope.info.pristine = true;

    // Defines the text that is being displayed if customDateFilter is false.
    $scope.dateRangeFilterName = GlobalService.getVal('customdate');

    // Defines whether facets are being loaded ??
    $scope.info.facetLoading = true;

    // Defines whether the results are being loaded ??
    $scope.info.resultLoading = true;

    // Defines whether the data are being loaded ??
    $scope.info.dataLoading = true;

    // Defines whether explorer is in default state
    $scope.info.defaultState = true;

    // Specifies the ID of current View
    $scope.info.currentViewID = null;
    
    // Holds the default fields to be displayed in the results.
    $scope.info.fields = [];

    // Specifies whether event or section selection is in default state
    $scope.info.eventSectionSelection = true;

    // Specifies what is the default search text
    $scope.info.defaultSearchText = '*';

    $scope.info.facetLimit = GlobalService.getVal('facets_limit');
    
    $scope.info.allConfigLoading = true;

    $scope.toggleChartCnt = true;

    // Initial empty response object which will eventually be filled with results.
    $scope.info.response = {
        docs : [],
        numFound : 0
    };

    //Sets default filter operation fields
    $scope.info.setDefaultFilterOperation = {
        filterId : null,
        statusCode : 0
    };

    //Sets change filter accessibility operation fields
    $scope.info.changeFilterAccesibilityOperation = {
        filterId : null,
        statusCode : 0
    };

    $scope.saveModal = {};
    $scope.form = {};

    $scope.info.filterSuggest = '*';
    $scope.info.filterSuggestApply = false;
    $scope.info.filterSuggestLoading = false;
    $scope.info.filterSuggestions = [{
        error:{
            label : 'Start typing to get suggestions.',
            dataType : 'none'
        }
    }];
    $scope.info.filterSuggestionsSectionsList = [];
    $scope.info.filterSuggestionsAttriList = [];
    $scope.info.filterSuggestLatest = "";
    $scope.info.filterSuggestItem = "";
    $scope.info.filterSavedFilterRemote = [];
    $scope.info.filterSuggestType = 'sections';
    $scope.info.filterSuggestSelectedSection = null;
    $scope.savedFiltersListNotLoaded = true;

    $scope.facetLoadingGradually = false;

    $scope.facetGradualFillingCount = 0;
    
    $scope.facetDataLocally = [];

    // Stores whether session is timed out or not
    $scope.info.sessionTimedOut = false;

    $scope.info.eventGroupsLabel = GlobalService.getVal("event_group_tab_label");

    //Used fot statistics data
    $scope.info.statistics = {
        loading : false
    };
    
    $scope.d3Data = [];
    
    $scope.info.application = GlobalService.getVal('navExplorer');
    
    $scope.info.rnaEnabled = metaDataService.getFeatures()['rules_and_alerts'];

    $scope.info.dataRestrictionMsg = "";
    $scope.info.initialDatesSaved = false;
    $scope.info.callRefreshIfFromDateInRange = true;
    $scope.info.callRefreshIfToDateInRange = true;

    $scope.reloadGraph = function(data) {
        var fdata = [], chartLabel = "";
        if(!data || !data['obs_date'] || !data['obs_date'].counts || data['obs_date'].counts.length == 0) { 
            $scope.d3Data = [];
            data = {'obs_date':{'end': "2018-07-24T04:00:04Z",'gap': "+1YEAR/YEAR", 'start': "2013-01-31T04:00:04Z", counts:[]}};
            
            //return;
        }
        if (data['obs_date']['gap'].indexOf("YEAR") >= 0) {            
            chartLabel = "Year View (UTC)";
            for ( i = 0; i < data['obs_date'].counts.length / 2; ++i) {
                t_data = {};
                t_date = new Date(data['obs_date'].counts[(i * 2)].replace(/-/g, "/").replace('T', ' ').substring(0, 19));
                t_data['name'] = t_date.getFullYear().toString();
                t_data['actDate'] = t_date;
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
                t_data['actDate'] = t_date;
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
                t_data['actDate'] = t_date;
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
                t_data['name'] = (t_date.getHours() > 9 ? t_date.getHours() : "0" + t_date.getHours()) + ":" + (t_date.getMinutes() > 9 ? t_date.getMinutes() : "0" + t_date.getMinutes()) + " " + t_date.getMonthNameShort() + " " + t_date.getDate();
                t_data['actDate'] = t_date;
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
                t_data['actDate'] = t_date;
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
                var d_name = t_date.getMinutes()+":"+t_date.getSeconds();                
                t_data['name'] = d_name;
                t_data['actDate'] = t_date;
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
                t_data['actDate'] = t_date;
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
             var cntrHeight = d3.select("#explorerTab_"+$scope.$parent.activeTab.id+" .d3-chart-container-explorer").node().getBoundingClientRect().height;
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
            $scope.svg.selectAll("#explorerTab_"+$scope.$parent.activeTab.id+" rect").remove();
        }
        if($scope.svg === undefined){
            d3v4.selectAll("#explorerTab_"+$scope.$parent.activeTab.id+" .d3-chart-container-explorer svg").remove();
            $scope.d3margin = {top: 30, right: 30, bottom: 20, left: 80},
            $scope.d3width = d3v4.select("#explorerTab_"+$scope.$parent.activeTab.id+" .d3-chart-container-explorer").node().getBoundingClientRect().width - $scope.d3margin.left - $scope.d3margin.right,
            $scope.d3height = d3v4.select("#explorerTab_"+$scope.$parent.activeTab.id+" .d3-chart-container-explorer").node().getBoundingClientRect().height - $scope.d3margin.bottom - $scope.d3margin.top;
            $scope.svg = d3v4.select("#explorerTab_"+$scope.$parent.activeTab.id+" .d3-chart-container-explorer")
            
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
        if(data.length === 0 && !$scope.facetLoadingGradually) {
            d3v4.selectAll("#explorerTab_"+$scope.$parent.activeTab.id+" .d3-chart-container-explorer svg").remove();
            $scope.svg = undefined;
            d3v4.select("#explorerTab_"+$scope.$parent.activeTab.id+" .d3-chart-container-explorer")
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
        }else{
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
        $scope.svg.attr("class", "chartlevel-"+$scope.info.chartLevel);
        d3v4.selectAll("#explorerTab_"+$scope.ctrlId+" .chartTitle").remove();
        // Update the X axis
      $scope.x.domain(data.map(function(d) { return d.name; }));
      if($scope.x.domain().length <= 10) {
        $scope.xAxis.call(d3v4.axisBottom($scope.x)).selectAll("text").attr("x","0");
      }else if($scope.x.domain().length > 10 && $scope.x.domain().length < 50) {
        $scope.xAxis.call(d3v4.axisBottom($scope.x).tickValues($scope.x.domain().filter(function(d,i){ return !(i%4)}))).selectAll("text").attr("x","0");
      }else {
        $scope.xAxis.call(d3v4.axisBottom($scope.x).tickValues($scope.x.domain().filter(function(d,i){ return !(i%11)}))).selectAll("text").attr("x","0");   
      }
      $scope.svg.append("text")
        .attr("x", ($scope.d3width / 2))             
        .attr("y", 0 - ($scope.d3margin.top / 2)) 
        .style("font-size", "12px")
        .attr("class","chartTitle") 
        .text(data[0].title);
    
      // Update the Y axis
      $scope.y.domain([-(maxY * .02), d3v4.max(data, function(d) { return d.value }) ]);
      $scope.yAxis.transition().duration(1000).call(d3v4.axisLeft($scope.y).tickValues([0, d3v4.max(data, function(d) { return d.value }) - (d3v4.max(data, function(d) { return d.value })*0.6666), d3v4.max(data, function(d) { return d.value }) - (d3v4.max(data, function(d) { return d.value })*0.3333), d3v4.max(data, function(d) { return d.value })]));
      // Create the u variable
      var u = $scope.svg.selectAll("rect").data(data)
      u
        .enter()
        .append("rect").on("click", function(d) {
            if($scope.info.chartLevel != 'SECONDS'){
                $scope.graphtooltip.remove();
                $scope.graphtooltip = undefined;
                expDrillDown(d.link);
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
          .attr("height", function(d) { if(d.value === 0){return 0} else {return $scope.d3height - $scope.y(d.value)}; })
          .attr("fill", "#0079c1");
    
      // If less group in the new dataset, I delete the ones not in use anymore
      u
        .exit()
        .remove()
        $scope.svg.selectAll("rect").attr("class", "cursor-pointer");
        $scope.svg.selectAll("circle").attr("class", "cursor-pointer");
    }
    $scope.hideFacets = function() {
        d3v4.select("#explorerTab_"+$scope.$parent.activeTab.id+" .d3-chart-container-explorer").selectAll("*").remove();
        $timeout(function() {
            $scope.svg = undefined;
            $scope.d3BarRender();
        }, 500);
    }
    // Get the config data for explorer.
    ExplorerService.getAllConfig().then(function(response) {
        var fDate,
            tDate,
            bundleName,
            logBundle,
            key,
            responseData = response.data.Data;
        if(responseData && responseData.ec_sysid_map){
            if(responseData.ec_sysid_map.sysid1 == ""){
                responseData.ec_sysid_map.sysid1 ="sysid1";
            }
        }
        // Setting custom date range
        $scope.customDateFilter = true;
        $scope.customDateFilterApplied = true;

        $scope.info.linkedAttribute = responseData;
        metaDataService.setGbConfig(responseData['config']);
        $scope.info.sysId = responseData['ec_sysid_map']['sysid1'];
        if(AppService.isGbStudioApp()) {
            responseData['config'] = !!responseData['default_config'] ? responseData['default_config'] : responseData['config'];
        }
        // Copying config
        $scope.info.config = responseData.config;
        $scope.info.max_days_in_sec = responseData['config']['MAX_DAY_RANGE_ALLOWED'] * (24 * 60 * 60 );
        //$scope.info.default_days = !!responseData['config']['DEFAULT_PERIOD_IN_SEC'] && responseData['config']['DEFAULT_PERIOD_IN_SEC'] < $scope.info.max_days_in_sec ? responseData['config']['DEFAULT_PERIOD_IN_SEC'] : $scope.info.max_days_in_sec;
        $scope.info.default_days = responseData['config']['DEFAULT_PERIOD_IN_SEC'];
        $scope.info.explorerDataDuration = metaDataService.getExplorerDataDuration();
        //convert seconds to milliseconds
        if($scope.info.default_days) $scope.info.default_days = 1000 * $scope.info.default_days;
        $scope.info.max_days_allowed = responseData['config']['MAX_DAY_RANGE_ALLOWED'];
        $scope.info.MinDate = new Date(metaDataService.getTodayDate());
        $scope.info.MinDate.setDate(metaDataService.getTodayDate().getDate() - $scope.info.max_days_allowed) 

        // Copying section content
        $scope.info.sectionsContent = responseData.sections_content;
       
        $scope.info.evtAttribsDefault = [];

        // Copying event attributes.
        angular.forEach(responseData.event_columns, function(value, key) {
            if (key != "evt_date_str" && key != "evt_text") {
                value['key'] = key;
                $scope.info.evtAttribs.push(value);
                $scope.info.evtAttribsDefault.push(value);
            }
        });

        // Populating default selected event attributes
        $scope.info.tSelectedEvtAttribs.push({
            "key" : "evt_date_str",
            "dataType" : "STRING",
            "label" : "Date",
            "default" : true
        });
        $scope.info.tSelectedEvtAttribs.push({
            "key" : "evt_text",
            "dataType" : "STRING",
            "label" : "Event Text",
            "default" : true
        });
        $scope.info.selectedEvtAttribs.push({
            "key" : "evt_date_str",
            "dataType" : "STRING",
            "label" : "Date",
            "default" : true
        });
        $scope.info.selectedEvtAttribs.push({
            "key" : "evt_text",
            "dataType" : "STRING",
            "label" : "Event Text",
            "default" : true
        });

        // Populating facets map.
        angular.forEach(responseData.facet_label_map, function(facet) {
            angular.forEach(facet, function(label, key) {
                var f = {};
                f['key'] = key;
                f['label'] = label;
                f['data'] = [];
                f['expanded'] = false;
                $scope.facets.push(f);
                $scope.selectedFacets[key] = [];
            });
        });

        // Deciding whether events or sections is available or not.
        angular.forEach(responseData.sections_content, function(value) {
            if (value['nsType'] == 'EVENT' || value['nsType'] == 'SESSION') {
                $scope.info.hasEvents = true;
                // Adding event source to facets list.
            } else if (value['nsType'] == 'SECTION') {
                $scope.info.hasSections = true;
            }
        });
        
        $scope.sectionsContent = responseData.sections_content;

        if ($scope.info.hasEvents) {
            $scope.facets.push({
                key : 'events',
                label : 'Event Source',
                data : [],
                expanded : false
            });
            $scope.selectedFacets['events'] = [];
        }

        if ($scope.info.config['DEFAULT_VIEW'] == 'EVENT') {
            $scope.info.eventsection = "event";
            $scope.info.events = true;
            $scope.info.sections = false;
        } else {
            $scope.info.eventsection = "section";
            $scope.info.sections = true;
            $scope.info.events = false;
        }
        
        if(AppService.isGbStudioApp()) {
        	if($scope.info.config['DEFAULT_VIEW'] == 'EVENT') {
        		if(!$scope.info.hasEvents && !!$scope.info.hasSections) {
        			$scope.info.eventsection = "section";
		            $scope.info.sections = true;
		            $scope.info.events = false;
        		}
        	} else {
        		if(!$scope.info.hasSections && !!$scope.info.hasEvents) {
	        		$scope.info.eventsection = "event";
		            $scope.info.events = true;
		            $scope.info.sections = false;
	        	}
        	}
        }

        keys = Object.keys(responseData['config']['fields']);
        for (i in keys) {
            field = {};
            field['key'] = keys[i];
            field['label'] = responseData['config']['fields'][keys[i]];
            $scope.info.fields.push(field);
        }
        // Setting the initial view to list view
        $scope.info.listView = true;

        ExplorerService.getStats().then(function(response) {
            var utcCurrentTime =  metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
            if (response.data.Data) {
                $scope.info.statistics.obs_min = response.data.Data.obs_min;
                $scope.info.statistics.obs_max = response.data.Data.obs_max;
                var obsMin = $scope.info.statistics.obs_min.replace("T", " ");
                obsMin = obsMin.replace("Z","");
                var obsMax = $scope.info.statistics.obs_max.replace("T", " ");
                obsMax = obsMax.replace("Z","");
                $scope.info.solrEndDate = /^\s*\d{4}\-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}Z$/.test($scope.info.statistics.obs_max) && (metaDataService.getStringToDate(obsMax) < utcCurrentTime) ? metaDataService.getStringToDate(obsMax) : utcCurrentTime;
                $scope.info.display_obs_min = metaDataService.getStringToDate(obsMin);
                $scope.info.display_obs_max = metaDataService.getStringToDate(obsMax);
                // Checking for bundle name
                var bundleData = ExplorerService.getBundleData();
                $scope.info.allConfigLoading = false;
                if (!!bundleData) {
                    if(ExplorerService.getLoadView()) {
                        $scope.loadDefaultFilter();
                    } else {
                        //$scope.$parent.activeTab = $scope.$parent.tabList[0];
                        $scope.searchFromLogvault();
                    }
                } 
                else {
                    $scope.loadDefaultFilter();
                }
            }
        }, function(response) {
            $scope.info.statistics.obs_min = "";
            $scope.info.statistics.obs_max = "";
        });
    }, function(response) {
        ErrorService.setError('explorer', GlobalService.getVal('config_fail'));
        handleSessionTimeout(response);
    });

    $scope.updateBreadCrumb = function(fdate, tdate){ 
        $scope.customDateFilterApplied = false;
        $scope.dateRangeFilterName = GlobalService.getVal('customdate');
        $scope.customDateFilter = true;
        $scope.info.drillDown = true;
        $scope.info.quick = 0;
        var utcCurrentTime = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate()
        //check if there is no hisotry, store from and to date from custome date time - convert it to UTC
        if($scope.timelineGraphDrilDown.length == 0){
            var date = new Date($scope.info.fromDate.getFullYear(), $scope.info.fromDate.getMonth(), $scope.info.fromDate.getDate(), $scope.info.fromTime.hr, $scope.info.fromTime.min, $scope.info.fromTime.sec);
            fdate = moment(date);
            fdate = new Date(fdate.year(), fdate.month(), fdate.date(), fdate.hour(), fdate.minute(), fdate.second());
            var date = new Date($scope.info.toDate.getFullYear(), $scope.info.toDate.getMonth(), $scope.info.toDate.getDate(), $scope.info.toTime.hr, $scope.info.toTime.min, $scope.info.toTime.sec);
            tdate = moment(date);
            tdate = new Date(tdate.year(), tdate.month(), tdate.date(), tdate.hour(), tdate.minute(), tdate.second());
            $scope.timelineGraphDrilDown.push({ts:$scope.info.chartLevel,from: fdate, to: tdate, st:utcCurrentTime.getTime()});
        }else{
            $scope.timelineGraphDrilDown.push({ts:$scope.info.chartLevel,from: fdate, to: tdate, st:utcCurrentTime.getTime()});
        }
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
        $scope.customDateFilterApplied = false;
        $scope.dateRangeFilterName = GlobalService.getVal('customdate');
        $scope.drillDown = true;
        $scope.info.currentFacet = null;
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
        if (!$scope.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
            $scope.info.sessionTimedOut = true;
            ModalService.sessionTimeout();
        }
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
    var currentType = null;
    var previousType = null;

    $scope.refresh = function(noFacetLoading, drillDown) {
        if(drillDown){
            ExplorerService.setDrillDown(true);
        }else{
            ExplorerService.setDrillDown(false);
        }
		if(AppService.isGbStudioApp()) {
                if($scope.info.config['DEFAULT_VIEW'] == 'EVENT') {
                        if(!$scope.info.hasEvents && !!$scope.info.hasSections) {
                                $scope.info.eventsection = "section";
                            $scope.info.sections = true;
                            $scope.info.events = false;
                        }
                } else {
                        if(!$scope.info.hasSections && !!$scope.info.hasEvents) {
                                $scope.info.eventsection = "event";
                            $scope.info.events = true;
                            $scope.info.sections = false;
                        }
                }
        }
    	previousType = currentType;
        $scope.info.dataTabs = false;
    	currentType = $scope.info.eventsection;
        $scope.info.dataLoading = true;
        $scope.info.refCount++;
        var i,
            selectedFacets = {};
        angular.forEach($scope.selectedFacets, function(facets, key) {
            if (!Array.isArray(selectedFacets[key]) && key != 'events' && key != 'namespace') {
                selectedFacets[key] = [];
            }
            if (key == 'events' || key == 'namespace') {
                for (i in facets) {
                    if (!selectedFacets[key]) {
                        selectedFacets[key] = [];
                    }
                    selectedFacets[key].push(facets[i]['key']);
                }
            } else {
                for (i in facets) {
                    selectedFacets[key].push(facets[i].label);
                }
            }

        });
        // XHR to fetch the results based on the user selection of facets n other parameters on the UI.
        var pageSize = $scope.info.page['count'];
        var startIndex = $scope.info.page['current'] * $scope.info.page['count'];
        var startDate = $scope.getFrom(drillDown);
        var endDate = $scope.getTo(drillDown);
        var sortingOrder = $scope.info.sortOrder['val'];
        var facetStr = "";
        var quickFilter = $scope.info.quick;
        var uploadedBy = $scope.info.uploadedBy;
        var quickFilterName = $scope.dateRangeFilterName;
        var sectionevent = $scope.info.events ? "EVENT" : "SECTION";
        var urlPart = startDate + "/" + endDate + "/" + startIndex + "/" + pageSize + "/" + sectionevent;
        var params = {};
        var compoundSearch = false;
        //check if selected facets are there
        if (!!Object.keys(selectedFacets).length) {
            for (key in selectedFacets) {
                if (selectedFacets[key] && selectedFacets[key].length && selectedFacets[key].length > 0) {
                    if (facetStr != "") {
                        facetStr += " ~||~ ";
                    }
                    for (var fcount = 0; fcount < selectedFacets[key].length; fcount++) {
                        if (facetStr == "") {
                            facetStr = (key == 'events' ? 'namespace' : key) + "=" + "\"" + selectedFacets[key][fcount] + "\"";
                        } else if (fcount == 0) {
                            facetStr += (key == 'events' ? 'namespace' : key) + "=" + "\"" + selectedFacets[key][fcount] + "\"";
                        } else {
                            facetStr = facetStr.replace(/(\")$/g, "");
                            facetStr += ("~" + selectedFacets[key][fcount] + "\"");
                        }
                    }
                }
            }
        }
        if($scope.defaultFacet){
            if(facetStr) {
                facetStr = "obs_url=" + "\"" + $scope.defaultFacet["label"] + "\"" + ' ~||~ ' + facetStr;
            }else{
                facetStr = "obs_url=" + "\"" + $scope.defaultFacet["label"] + "\"";
            }
            
        }
        $scope.facetStr = null;
        if (facetStr) {
            params["filter"] = facetStr;
            $scope.facetStr = facetStr;
        }
        if (quickFilter) {
            params["quick_filter"] = quickFilter;
            if($scope.drillDown == true) {
                params["drill_down"] = true;
            }
        }
        if (sortingOrder) {
            params["sortby"] = "obs_date " + sortingOrder;
        }
        if(uploadedBy) {
            params["uploaded_by"] = uploadedBy;
        }
        
        if ($scope.info.filterSuggest.indexOf('CompoundSearch=') != -1) {
            compoundSearch = true;
            if($scope.info.page.current == 0) {
                params['compound_search'] = 'new';
            } else {
                params['compound_search'] = 'pagination';
            }
        }
        
        // Handling empty text search
        if ($scope.info.filterSuggest == "") {
            $scope.info.filterSuggest = "*";
        }
        //check if filter suggest is there or not
        // to show select all option for facet
        if($scope.info.filterSuggest === "" || $scope.info.filterSuggest === "*"){
            $scope.info.filterSuggestApply = false;
        }else{
            $scope.info.filterSuggestApply = true;
        }
        if(!!$scope.info.viewLoad) {
            $scope.info.viewLoad = false;
        } else {
            $scope.info.selectedFilterName = "Select View";
        }
        $scope.info.queryParam = params;
        ExplorerService.getData(urlPart, params, $scope.info.filterSuggest).then(function(response) {
            $scope.$parent.justforflag.stillloading = false;
            var i,
                j,
                k,
                responseData = response.data.Data;
            $scope.responseMessage = response.data.Msg;
            $scope.info.resultLoading = false;
            $scope.info.dataLoading = false;
           
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
                details['Time Range'] = $scope.getFrom() + ' - ' + $scope.getTo();
                details['Sort Order'] = $scope.info.sortOrder['val'] == 'desc' ? 'Descending' : 'Ascending';
                details['Search Text'] = encodeURIComponent($scope.info.filterSuggest.replace(/\'/g, '%27'));
                details['Search Type'] = sectionevent;
            } else if($scope.info.changePageSize) {
                details['Count'] = $scope.info.page['count'];
            }
            
            if($scope.drillDown == true) {
                activity = 'Drill Down';
                $scope.drillDown = false;
                
            } else if($scope.info.zoomout == true) {
                activity = 'Default Graph View';
                $scope.info.zoomout = false;
            } else if($scope.info.clearFilter == true) {
                activity = 'Clear Filter';
                $scope.info.clearFilter = false;
            } else if($scope.info.sorting == true) {
                activity = 'Sort ' + ($scope.info.sortOrder['val'] == 'desc' ? 'Descending' : 'Ascending');
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
                UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details), responseData.solr_query).then(userTrackingSuccess, handleSessionTimeout);
            }
            if(compoundSearch) {
                if(responseData.hasOwnProperty('gb_error')) {
                    $scope.reloadGraph(null);
                    $scope.d3BarRender();
                    if (responseData['gb_error'] == 'ERR_3' || responseData['gb_error'] == 'ERR_8' || responseData['gb_error'] == 'ERR_14') {
                        $scope.info.no_result = true;
                        $scope.response = null;
                        $scope.info.err_msg = 1;
                    } else if (responseData['gb_error'] == 'ERR_2') {
                        $scope.info.no_result = true;
                        $scope.response = null;
                        $scope.info.err_msg = 2;
                    } else if (responseData['gb_error'] == 'ERR_13') {
                        $scope.info.no_result = true;
                        $scope.response = null;
                        $scope.info.err_msg = 3;
                    }
                    if(currentType != previousType) {
                    	loadFacets(responseData);
                    }
                    return;
                } else {
                    loadFacets(responseData);    
                }
            }
            
            if (responseData['gb_error'] == 'ERR_3' || responseData['gb_error'] == 'ERR_8' || responseData['gb_error'] == 'ERR_14') {
                $scope.info.no_result = true;
                $scope.response = null;
                $scope.info.err_msg = 1;
            } else if (responseData['gb_error'] == 'ERR_2') {
                $scope.info.no_result = true;
                $scope.response = null;
                $scope.info.err_msg = 2;
            } else if (responseData['gb_error'] == 'ERR_13') {
                $scope.info.no_result = true;
                $scope.response = null;
                $scope.info.err_msg = 3;
            } else if (responseData['gb_error'] == 'ERR_0') {
                $window.location.href = GlobalService.getVal('redirect_login_url');
            } else {
                $scope.info.no_result = false;
                $scope.response = responseData.response;
                if(!noFacetLoading){
                    //$scope.paginator($scope.response.numFound);
                    $scope.loadFacetsGraduallyUpdatePagination(responseData);
                }
                // Copying content for docs.
                i = 0;
                angular.forEach(responseData.response.docs, function(value, key) {
                    var found = false;
                    angular.forEach(responseData.highlighting, function(value, key) {
                        if (key == $scope.response.docs[i]['namespace_id']) {
                            // Temporary fix
                            if (value['content'] && value['content'][0]) {
                                $scope.response.docs[i]['content'] = value['content'][0].replace(/>/g, '\&gt;').replace(/</g, '\&lt;').replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>').replace(/~~/g, '<br>');
                            }
                        }
                    });

                    i++;
                });
            }
            if(!$scope.response ||!$scope.response.docs || $scope.response.docs.length == 0){
                $scope.info.hideFacets = true;
            }
        }, function(response) {
            if(response.status === 400 && response.data.Status === "Failure"){
                ErrorService.setError('explorer', response.data.Msg);
                $scope.info.err_msg = 9;
		        $scope.info.badRequestMsg = response.data.Msg;
            }else{
                ErrorService.setError('explorer', GlobalService.getVal('data_fail'));
                $scope.info.err_msg = 1;
            }            
            $scope.info.resultLoading = false;
            $scope.info.dataLoading = false;
            $scope.drillDown = false;
            $scope.info.zoomout = false;
            $scope.info.clearFilter = false;
            $scope.info.sorting = false;
            $scope.info.changePageSize = false;
            $scope.info.paginate = false;
            $scope.info.no_result = true;
            $scope.response = null;
            handleSessionTimeout(response);
        });
        if(!noFacetLoading && !compoundSearch) {
            $scope.loadFacetsGradually(urlPart, params, $scope.info.filterSuggest, currentType);
         }
    };
    $scope.loadFacetsGradually = function(urlPart, params, filter, currentType){
        urlPart = urlPart+"?sortby=obs_date desc&facet_collection_head=";
        $scope.facetDataLocally = [];
        $scope.facetLoadingGradually = true;
        $scope.showGradualfillingProgressbar(0);
        if(!$scope.drillDown) {
            $scope.timelineGraphDrilDown = [];
        }
        //cancel prev request
        GlobalService.cancelAllAPIs('/explorer/search/facets/');
        if($scope.loadFacetsGraduallyTimmer)    $timeout.cancel($scope.loadFacetsGraduallyTimmer);

        $scope.info.facetsLoading = true;
        ExplorerService.getFacetsGrdually(urlPart, params, filter).then(function(response) {
            $scope.loadFacetsGraduallySuccessful(response, urlPart, params, filter, currentType);
        }, function(response) {
            if(response.status != -1){
                $scope.loadFacetsGraduallyFailure(response, urlPart, params, filter, currentType);
            }
        });
    }
    $scope.loadFacetsGraduallySuccessful = function(response, urlPart, params, filter, currentType){
        var responseData = response.data.Data;
        $scope.info.facetLoading = false;
        $scope.info.facetsLoading = false;
         if (responseData['gb_error'] == 'ERR_3' || responseData['gb_error'] == 'ERR_8' || responseData['gb_error'] == 'ERR_14') {
            $scope.reloadGraph(null);
            $scope.facetLoadingGradually = false;
            $scope.d3BarRender();
            if(currentType != previousType) {
                loadFacets(responseData);
            }
        } else if (responseData['gb_error'] == 'ERR_2') {
            $scope.facetLoadingGradually = false;
            $scope.reloadGraph(null);
            $scope.d3BarRender();
            if(currentType != previousType) {
                loadFacets(responseData);
            }
        } else if (responseData['gb_error'] == 'ERR_13') {
            $scope.facetLoadingGradually = false;
            $scope.reloadGraph(null);
            $scope.d3BarRender();
            if(currentType != previousType) {
                loadFacets(responseData);
            }
        } else if (responseData['gb_error'] == 'ERR_0') {
            $scope.facetLoadingGradually = false;
            $window.location.href = GlobalService.getVal('redirect_login_url');
        } else {
            loadFacets(responseData, true);
            $scope.facetDataLocally = responseData;
            if(!responseData.done){
                $scope.loadFacetsGraduallyUpdateFacets(responseData, true);
                $scope.loadFacetsGraduallyCallUntillGetCompleteData(urlPart, params, filter, currentType, responseData.next);
            }else{
                $scope.facetLoadingGradually = false;
                //update total
                $scope.loadFacetsGraduallyUpdatePagination(responseData);
            }
        }
    }
    $scope.loadFacetsGraduallyUpdatePagination = function (responseData) {
        if(responseData.facet_counts && responseData.facet_counts.facet_ranges && responseData.facet_counts.facet_ranges.obs_date && responseData.facet_counts.facet_ranges.obs_date.counts){
            var sum = 0;
            var facetsData = responseData.facet_counts.facet_ranges.obs_date.counts;
            for(var j=0;j<facetsData.length;j++){
                if(j%2 === 0){
                    sum = sum + facetsData[j + 1];
                }
            }
            $scope.paginator(sum);
        }else{
            //$scope.paginator(10);
        }
    }
    $scope.loadFacetsGraduallyFailure = function(response, urlPart, params, filter, currentType){
        if(response.status === 400 && response.data.Status === "Failure"){
            $scope.info.err_msg = 9;
            $scope.info.badRequestMsg = response.data.Msg;
        }else{
            $scope.info.err_msg = 1;
        }
        $scope.facetLoadingGradually = false;
        $scope.info.facetLoading = false;
        $scope.info.facetsLoading = false;
        $scope.info.resultLoading = false;
        $scope.info.dataLoading = false;
        $scope.info.no_result = true;
        $scope.reloadGraph(null);
        $scope.d3BarRender();
        handleSessionTimeout(response);
    }
    $scope.loadFacetsGraduallyCallUntillGetCompleteData = function(urlPart, params, filter, currentType, nextParam){
        $scope.loadFacetsGraduallyTimmer = $timeout(function() {
            ExplorerService.getFacetsGrdually(urlPart, params, filter, nextParam).then(function(response) {
                var responseData = response.data.Data;
                $scope.loadFacetsGraduallyUpdateFacets(responseData);
                // if it's not final then call it again
                if(!responseData.done ){
                    $scope.loadFacetsGraduallyCallUntillGetCompleteData(urlPart, params, filter, currentType , responseData.next);
                }else{
                    $scope.facetLoadingGradually = false;
                    //update total
                    //$scope.loadFacetsGraduallyUpdatePagination(responseData);
                }
             }, function(response) {
                handleSessionTimeout(response);
            });
        }, 500);
    };
    $scope.loadFacetsGraduallyUpdateFacets = function(responseData, onfirstTry){
        //update gradual loading in percentage
        if(responseData.percComplete){
            $scope.showGradualfillingProgressbar(responseData.percComplete);
        }
        if(responseData.facet_counts.facet_ranges && responseData.facet_counts.facet_ranges.obs_date && responseData.facet_counts.facet_ranges.obs_date.counts){
            //update facet graph
            if($scope.facetDataLocally['facet_counts'] && $scope.facetDataLocally['facet_counts']['facet_ranges'] && $scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date'] && $scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date']['counts']){
                if(!onfirstTry)
                $scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date']['counts'] = $scope.loadFacetsGraduallyUpdateFacetsGraph($scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date']['counts'], angular.copy(responseData.facet_counts.facet_ranges.obs_date.counts));
                else{
                    $scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date']['counts'] = $scope.loadFacetsGraduallyUpdateFacetsGraph([], angular.copy(responseData.facet_counts.facet_ranges.obs_date.counts));
                    loadFacets($scope.facetDataLocally);
                    return;
                }
            }else{
                if(!$scope.facetDataLocally['facet_counts']){
                    $scope.facetDataLocally['facet_counts'] = {};
                }
                if(!$scope.facetDataLocally['facet_counts']['facet_ranges']){
                    $scope.facetDataLocally['facet_counts']['facet_ranges'] = {};
                }
                if(!$scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date']){
                    $scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date'] = {};
                }
                if(!$scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date']['counts']){
                    $scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date']['counts'] = [];
                }

                $scope.loadFacetsGraduallyUpdateFacetsGraph($scope.facetDataLocally['facet_counts']['facet_ranges']['obs_date']['counts'], angular.copy(responseData.facet_counts.facet_ranges.obs_date.counts));
            
                $scope.facetDataLocally['facet_counts']['facet_ranges'] = angular.copy(responseData.facet_counts.facet_ranges);
            }
        }
        if(responseData.facet_counts && responseData.facet_counts.facet_fields){
            var CurrentFacetFields = $scope.facetDataLocally['facet_counts']['facet_fields'];
            var newFacetFields = angular.copy(responseData.facet_counts.facet_fields);
            for (var key in newFacetFields) {
                if(!CurrentFacetFields[key]) {
                    CurrentFacetFields[key] = newFacetFields[key];
                } else {
                    var tempListNew = newFacetFields[key];
                    var tempListCurrent = CurrentFacetFields[key];
                        for(var newIndex=0;newIndex < tempListNew.length;newIndex++){
                            var found = false;
                            for(var oldIndex=0;oldIndex < tempListCurrent.length;oldIndex++){
                                if(oldIndex % 2 === 0 && newIndex % 2 === 0){
                                    if(tempListCurrent[oldIndex] === tempListNew[newIndex]){
                                        tempListCurrent[oldIndex + 1] = tempListCurrent[oldIndex + 1] + tempListNew[newIndex+1];
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            if(!found && newIndex % 2 === 0){
                                tempListCurrent.push(tempListNew[newIndex]);
                                tempListCurrent.push(tempListNew[newIndex + 1]);
                            }
                    };
                }
            }
        }
        loadFacets($scope.facetDataLocally);
    };
    $scope.loadFacetsGraduallyUpdateFacetsGraph = function(oldData, newData){
        if(oldData.length == 0){
            //oldData = angular.copy(newData);
            var sum = 0;
            for(var i=0;i<newData.length;i++){
                if(i%2 === 0 ){
                    oldData[i] =  newData[i];
                    oldData[i + 1] =  newData[i + 1];
                    sum += oldData[i + 1];
                }
            }
            $scope.paginator(sum);
            return oldData;
        }
        for(var i=0;i<newData.length;i++){
            for(var j=0;j<oldData.length;j++){
                if(i%2 === 0 && j%2 === 0){
                    if(newData[i] === newData[j]){
                        oldData[j + 1] = oldData[j + 1] + newData[i + 1];
                    }
                }
            }
        }
        var sum = 0;
        for(var j=0;j<oldData.length;j++){
            if(j%2 === 0){
                sum = sum + oldData[j + 1];
            }
        }
        $scope.paginator(sum);
        //var percentageOfData = sum/$scope.info.page['total'] * 100;
       // $scope.showGradualfillingProgressbar(percentageOfData);
        return oldData;
    }
    $scope.showGradualfillingProgressbar = function(value) {
        // var bar1 = new ldBar("#gb-explorer-timeline-graph-loaded");
        // bar1.set(value);
        var bar2 = $("#gb-gradualfilling-page-loader .gb-page-loader-gradualfilling-bar");
        //var bar2 = $("#gb-gradualfilling-page-loader");
        bar2.css('width', value+"%");
        $scope.facetGradualFillingCount = value;
    }
    function loadFacets(responseData, firstCall) {
        //reset data for each facet
        $scope.facets.map(function(item){
            if(!($scope.info.currentFacet && $scope.info.currentFacet.label === item.label  && $scope.info.currentFacet.key === item.key)){
                item.data = [];
            }
        });
    	if(responseData.hasOwnProperty('gb_error')) {
    		$scope.info.hideFacets = true;
    		return;
    	} else {
    		$scope.info.hideFacets = false;
    	}
        var strict = false;
        if ($scope.info.notFacetSearch == true) {
            strict = true;
            $scope.info.notFacetSearch = false;
        }
        $scope.facetCounts = responseData.facet_counts; 
        var noSelection = true;
        for (var fctk in $scope.selectedFacets) {
            if ($scope.selectedFacets[fctk].length > 0) {
                noSelection = false;
                break;
            }
        }
        if (noSelection) {
            $scope.info.currentFacet = undefined;
        }
        angular.forEach(responseData.facet_counts.facet_fields, function(value, key) {
            var facet,
                i,
                j,
                k,
                e_facets,
                s_facets;
            if (key == 'namespace' && !($scope.info.currentFacet && ($scope.info.currentFacet.key == 'namespace' || $scope.info.currentFacet.key == 'events'))) {
                for (i in $scope.facets) {
                    if ($scope.facets[i].key == 'namespace') {
                        s_facets = i;
                    }
                    if ($scope.facets[i].key == 'events') {
                        e_facets = i;
                    }
                }
                if (s_facets) {
                    $scope.facets[s_facets].data = [];
                }
                if (e_facets) {
                    $scope.facets[e_facets].data = [];
                }

                for ( i = 0; i < value.length; i += 2) {
                    facet = {};

                    if (!$scope.info.sectionsContent[value[i]])
                        continue;
                    facet['label'] = $scope.info.sectionsContent[value[i]]['description'];
                    facet['value'] = value[i + 1];
                    facet['key'] = value[i];
                    facet['selected'] = false;
                    if (e_facets && ($scope.info.sectionsContent[value[i]]['nsType'] == 'EVENT' || $scope.info.sectionsContent[value[i]]['nsType'] == 'SESSION')) {
                        facet['title'] = 'Event Source';
                        $scope.facets[e_facets].data.push(facet);
                        if(firstCall){
                            $scope.facets[e_facets].expanded = false;
                        }
                    } else {
                        if (s_facets) {
                            facet['title'] = 'Section Name';
                            $scope.facets[s_facets].data.push(facet);
                            if(firstCall){
                                $scope.facets[s_facets].expanded = false;
                            }
                        }
                    }
                }
            } else {
                if($scope.info.currentFacet && $scope.info.currentFacet.data && $scope.info.currentFacet.data.length == 1 && !$scope.info.currentFacet.data[0].selected){
                    $scope.info.currentFacet = undefined;
                }
                
                for ( i = 0; i < $scope.facets.length; ++i) {
                    if ($scope.facets[i].key === key && key != 'namespace' && (strict || !($scope.info.currentFacet && $scope.info.currentFacet.key == key))) {
                        $scope.facets[i].data = [];
                        for ( j = 0; j < value.length; j += 2) {
                            facet = {};
                            facet['title'] = $scope.facets[i].label;
                            facet['label'] = value[j];
                            facet['value'] = value[j + 1];
                            facet['selected'] = false;
                            $scope.facets[i].data.push(facet);
                        }
                        if(firstCall){
                            $scope.facets[i].expanded = false;
                        }
                        break;
                    }
                }
            }
        });
        for (i in $scope.facets) {
            for (j in $scope.selectedFacets[$scope.facets[i].key]) {
                for ( k = 0; k < $scope.facets[i].data.length; ++k) {
                    if ($scope.selectedFacets[$scope.facets[i].key][j].key) {
                        if ($scope.selectedFacets[$scope.facets[i].key][j].key == $scope.facets[i].data[k].key) {
                            $scope.facets[i].data[k].selected = true;
                            $scope.facets[i].expanded = true;
                            break;
                        }
                    } else {
                        if ($scope.selectedFacets[$scope.facets[i].key][j].label == $scope.facets[i].data[k].label) {
                            $scope.facets[i].data[k].selected = true;
                            $scope.facets[i].expanded = true;
                            break;
                        }
                    }
                }
                if (k >= $scope.facets[i].data.length) {
                    $scope.selectedFacets[$scope.facets[i].key][j]['selected'] = true;
                    $scope.facets[i].data.push($scope.selectedFacets[$scope.facets[i].key][j]);                               
                }
            }
        }
        if (responseData.facet_counts.facet_ranges['obs_date']) {
            //set from and date time field with server data(obs_date->end=obs_date->start) 
            var fromDateFromResponse = responseData.facet_counts.facet_ranges.obs_date.start;
            var todateFromResponse = responseData.facet_counts.facet_ranges.obs_date.end;
            if(fromDateFromResponse){
                fromDateFromResponse = fromDateFromResponse.replace("T", " ");
                fromDateFromResponse = fromDateFromResponse.replace("Z","");
                var strLocalFromTime = metaDataService.getStringToDate(fromDateFromResponse);
                var strfromTime =  strLocalFromTime.getTime();
                var stroldTime =  new Date(""+$scope.gbStore.fromDate).getTime();
                if(strfromTime != stroldTime){
                    $scope.info.fromDate = strLocalFromTime;
                    $scope.gbStore.fromDate = strLocalFromTime;
                }
            }
            if(todateFromResponse){
                todateFromResponse = todateFromResponse.replace("T", " ");
                todateFromResponse = todateFromResponse.replace("Z","");
                var strLocalToTime = metaDataService.getStringToDate(todateFromResponse);
                var strtoTime =  strLocalToTime.getTime();
                var stroldTime =  new Date(""+$scope.gbStore.toDate).getTime();
                if(strtoTime != stroldTime){
                    $scope.info.toDate = strLocalToTime;
                    $scope.gbStore.toDate = strLocalToTime;
                }
            }
            $scope.info.fromTime.hr = $scope.info.fromDate.getHours();
            $scope.info.fromTime.min = $scope.info.fromDate.getMinutes();
            $scope.info.fromTime.sec = $scope.info.fromDate.getSeconds();
            $scope.info.toTime.hr = $scope.info.toDate.getHours();
            $scope.info.toTime.min = $scope.info.toDate.getMinutes();
            $scope.info.toTime.sec = $scope.info.toDate.getSeconds();
            $scope.info.chartLevel = responseData.facet_counts.facet_ranges['obs_date']['gap'].split('/')[1];
            $scope.reloadGraph(responseData.facet_counts.facet_ranges);
        }else{
            $scope.reloadGraph([]);
        }
    }

    //return the formatted content for list view
    $scope.showContent = function(text, option) {

        // var lines = text.content.split(/\r\n|\r|\n/);
        // Temporary fix
        if (!text.content) {
            return;
        }
        if (text.content.length <= 150) {
            text.showExpanded = false;
            if ($scope.info.filterSuggest === "*" || $scope.info.filterSuggest === "") {
                return $sce.trustAsHtml(unescape(escape(text.content)));
            } else {
                return $sce.trustAsHtml(text.content.replace(new RegExp($scope.info.filterSuggest.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'gi'), '<span class="highlight">$&</span>'));
            }
        }
        text.showExpanded = true;
        // var returnString = "";
        if (option == 1) {
            if ($scope.info.filterSuggest === "*" || $scope.info.filterSuggest === "") {
                return $sce.trustAsHtml(text.content.substring(0, 150));
            } else {
                return $sce.trustAsHtml(text.content.substring(0, 150).replace(new RegExp($scope.info.filterSuggest.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'gi'), '<span class="highlight">$&</span>'));
            }
        } else {
            if ($scope.info.filterSuggest === "*" || $scope.info.filterSuggest === "") {
                return $sce.trustAsHtml(text.content.substring(0, $scope.show_more_characters_limit));
            } else {
                return $sce.trustAsHtml(text.content.substring(0, $scope.show_more_characters_limit).replace(new RegExp($scope.info.filterSuggest.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'gi'), '<span class="highlight">$&</span>'));
            }
        }
    };

    // Reset from the UI
    $scope.resetFromUI = function() {
        // Reset pagination on clear
        $scope.info.selectedFilterName = "Select View";
        $scope.info.clearFilter = true;
        $scope.customDateFilter = true;
        $scope.customDateFilterApplied = true;
        $scope.info.drillDown = false;
        $scope.info.page['current'] = 0;
        $scope.info.initialDatesSaved = false;
        $scope.info.callRefreshIfFromDateInRange = true;
        $scope.info.callRefreshIfToDateInRange = true;
        $scope.reset(true);
    };

    // Triggered whenever a facet is selected/deselected.
    $scope.checkChange = function(facet, f_data) {
        $scope.info.defaultState = false;
        $scope.info.page['current'] = 0;
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
    $scope.showfacetSelectAllOption = function(facet){
        if(facet.filter) return true;
        else if($scope.info.filterSuggestApply){
             return true;
        }        
        return false;
    }
    $scope.facetSelectAll = function(facet) {
        if(facet.selectAll === undefined){
            facet.selectAll = false;
        }
        $scope.noRefresh = false;
        var limitFacetMsg = GlobalService.getVal('limitFacetMsg');
        var limitFacetMsg1 = GlobalService.getVal('limitFacetMsg1');
        var facetcount = 0;
        $scope.msg = "";
        var multimode = false;
        var f_data = facet.data;
        var filter = facet.filter;
        var unselectAll = facet.selectAll;        
        if(!filter){
            f_data.map(function(item){
                if(!item.label) return false;
                if(!unselectAll){
                    item.selected = true;
                }else{
                    item.selected = false; 
                }
            });
        }else{
            f_data.map(function(item){
                if(!item.label) return false;
                if(item.label.toLowerCase().indexOf(filter.toLowerCase()) != -1){                     
                    if(!unselectAll){
                        item.selected = true;
                    }else{
                        item.selected = false;
                    }
                }
                else { item.selected = false;}
            });
        }
        for(i=0;i<f_data.length;i++){
            if(f_data[i].selected){
                facetcount++;
            }
        }
        for(key in $scope.selectedFacets) {
            if($scope.selectedFacets[key].length > 0){
                if(key != facet.key) {
                    multimode = true;
                }
                facetcount = $scope.selectedFacets[key].length + facetcount;        
            }
        }
        if(multimode && facetcount > $scope.limitFacetTotal) {
            $scope.msg = GlobalService.getVal('limitFacetTotalMsg1')+$scope.limitFacetTotal;
            $scope.modal1 = ModalService.openModal('partials/alert_box_extra.html', $scope, false, true);
            f_data.map(function(item){
                if(!item.label) return false;
                if(!unselectAll){
                    item.selected = false;
                }else{
                    item.selected = true; 
                }
            });
        }else if(!multimode && facetcount > $scope.limitFacet) {
            $scope.msg = GlobalService.getVal('limitFacetMsg1')+$scope.limitFacet;
            $scope.modal1 = ModalService.openModal('partials/alert_box_extra.html', $scope, false, true);
            f_data.map(function(item){
                if(!item.label) return false;
                if(!unselectAll){
                    item.selected = false;
                }else{
                    item.selected = true; 
                }
            });
        }else {
            $scope.facetApplyMultiple(facet,unselectAll);
            facet.selectAll = !facet.selectAll;
        }
    };
    $scope.isAllFacetSelected = function(facet) {
        var f_data = facet.data, flag=true, item;
        for(var i=0;i<f_data.length;i++){
            item = f_data[i];
            if(!item.selected){
                flag = false;
                break;
            }
        }
        return flag;
    };
    $scope.selectAllFacetsLabel = function(facet) {
        facet.selectAll = $scope.isAllFacetSelected(facet);
        return (facet.selectAll?"Unselect all":"Select all");
    };
    $scope.getSelectedFacetData = function(index){
        return $scope.facets[index];
    }
    // Triggered whenever a facet is sseelct all option
    $scope.facetApplyMultiple = function(facet,unselectAll) {
        var filteredFacets = facet.data,f_data,selected_f_data,found;
        var selectedFacetcount = 0;
        if(unselectAll){
            var duplicateFacet_data_selected = filteredFacets.filter(function(f_data){
                if(!f_data.selected){
                    return true
                }
                return false;
            });
            for(var i=0;i<duplicateFacet_data_selected.length;i++){
                selected_f_data = duplicateFacet_data_selected[i];
                $scope.removeSelected(facet, selected_f_data, true);
            }; 
        }else{
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
        }
        $scope.info.defaultState = false;
        for(var key in $scope.selectedFacets){
            if($scope.selectedFacets[key].length != 0) {
                selectedFacetcount = $scope.selectedFacets[key].length + selectedFacetcount;
            }
        }
        $scope.info.page['current'] = 0;
        $scope.info.pristine = false;
        $scope.info.currentFacet = facet;
        $scope.refresh();
    };
    // Triggered whenever a facet is sseelct all option
    $scope.facetApplyFromMoreWindow = function(facetgroup, list,index) {

        //remove pre. selected facet
        if ($scope.selectedFacets[facetgroup.key]) {
            $scope.selectedFacets[facetgroup.key] = [];
        }
        //re-select original facet
        var tempList = $scope.facets[index].data;
        tempList.map(function(item){
            item.selected = false;
        });

        for(var i=0;i<list.length;i++){
            $scope.addSelected(facetgroup, list[i], true);
        };
        $scope.info.defaultState = false;
        $scope.info.page['current'] = 0;
        $scope.info.pristine = false;
        $scope.info.currentFacet = facetgroup;
        $scope.refresh();
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

    $scope.changeEventSection = function() {
        $scope.toggleChartCnt = true;
        if ($scope.info.eventsection == "section") {
            $scope.info.sections = true;
            $scope.info.events = false;
            $scope.info.selectedFilterName = "Select View";
        } else if ($scope.info.eventsection == "event") {
            $scope.info.sections = false;
            $scope.info.events = true;
            $scope.info.selectedFilterName = "Select View";
        } else {
            return;
        }

        if ($scope.info.filterSuggest.indexOf('CompoundSearch=') != -1 && $scope.info.eventsection == "section") {
            ModalService.alertBox({
                msgKey : 'events_only'
            });
            return;
        }
        //clear facel sections
        $scope.info.currentFacet = undefined;
        //clear facets filter
        $scope.selectedFacets = {};
        if(($scope.info.filterSuggest == '*' || $scope.info.filterSuggest == '') && $scope.dateRangeFilterName == GlobalService.getVal('customdate') && (new Date($scope.info.toDate).getTime()) === (new Date($scope.info.solrEndDate).getTime())) {
            $scope.info.pristine = true;
        }
        $scope.info.page['current'] = 0;
        $scope.refresh();
    };
    $scope.toggleTimelineGraph = function(){
        $scope.toggleChartCnt = !$scope.toggleChartCnt; 
        $scope.logToggleTimeline($scope.toggleChartCnt);
    };
    // $scope.dropDownFixPosition = function(key){
    //     var button = $("#"+key+"DropdownBtn");
    //     var dropdown = $("#"+key+"DropdownMenu")
    //     var dropDownTop = button.offset().top + button.outerHeight();
    //     dropdown.css('position', "fixed");
    //     dropdown.css('top', dropDownTop + "px");
    //     dropdown.css('left', button.offset().left + "px");
    // };
    $scope.isInEvent = function(){
        if($scope.info.eventsection == "event"){
            return true;
        }
        return false;
    }
    // Add the given facet to the selectedFacets list and also sets the same as currentFacet.
    $scope.addSelected = function(facet, f_data, notTorefresh) {
        $scope.info.defaultState = false;
        $scope.info.currentFacet = facet;
        if (!$scope.selectedFacets[facet.key]) {
            $scope.selectedFacets[facet.key] = [];
        }
        if(!$scope.isCheckSelectedFacetExist($scope.selectedFacets[facet.key], f_data)){
            f_data.groupName = f_data.title;
            f_data.groupCount = $scope.selectedFacets[facet.key].length + 1;
            $scope.selectedFacets[facet.key].push(f_data);
            // $scope.selectedFacets[facet.key].groupName = facet.label;
            // $scope.selectedFacets[facet.key].groupCount = $scope.selectedFacets[facet.key].length;
        }        
        $scope.info.pristine = false;
        if(!notTorefresh){
            $scope.refresh();
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
    $scope.removeSelected = function(facet, f_data, notTorefresh) {
        $scope.info.defaultState = false;
        var i;
        $scope.info.currentFacet = facet;
        for (i in $scope.selectedFacets[facet.key]) {
            if ($scope.selectedFacets[facet.key][i].label === f_data.label) {
                $scope.selectedFacets[facet.key].splice(i, 1);
                break;
            }
        }
        var flag = false;
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
        
        if(!notTorefresh){
            $scope.refresh();
        }
    };

    // Removes the facet from close icon
    $scope.removeFacet = function(key, facet) {
        $scope.info.defaultState = false;
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
        $scope.refresh();
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
        $scope.selectedFacets[key].count = $scope.selectedFacets[key].length;
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
        $scope.refresh();
    };
    $scope.removeDefaultFacet = function(){
        $scope.defaultFacet = null;
        var flag = false;
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
        if($scope.info.explorerDataDuration !== ''){
            $scope.reset();
        }else{
            $scope.refresh();
        }
    }
    // Returns the URL to download the selected data from the explorer.
    $scope.getExportUrl = function(eventStart) {

        var i,
            selectedFacets = {};
        angular.forEach($scope.selectedFacets, function(facets, key) {
            if (!Array.isArray(selectedFacets[key]) && key != 'events' && key != 'namespace') {
                selectedFacets[key] = [];
            }
            if (key == 'events' || key == 'namespace') {
                for (i in facets) {
                    if (!selectedFacets['namespace']) {
                        selectedFacets['namespace'] = [];
                    }
                    selectedFacets['namespace'].push(facets[i]['key']);
                }
            } else {
                for (i in facets) {
                    selectedFacets[key].push(facets[i].label);
                }
            }

        });
        // XHR to fetch the results based on the user selection of facets n other parameters on the UI.
        var pageSize = $scope.csvpage.noOfRecordsCsv;
        var startIndex = eventStart == 1 ? 0 : $scope.info.page['current'] * $scope.info.page['count'];
        var startDate = $scope.getFrom();
        var endDate = $scope.getTo();
        var sortingOrder = $scope.info.sortOrder['val'];
        var facetStr = "";
        var quickFilter = $scope.info.quick;
        var uploadedBy = $scope.info.uploadedBy;
        var quickFilterName = $scope.dateRangeFilterName;
        var sectionevent = $scope.info.events ? "EVENT" : "SECTION";

        var urlPart = startDate + "/" + endDate + "/" + startIndex + "/" + pageSize + "/" + sectionevent;
        var params = {};
        //check if selected facets are there
        if (!!Object.keys(selectedFacets).length) {
            for (key in selectedFacets) {
                if (selectedFacets[key] && selectedFacets[key].length && selectedFacets[key].length > 0) {
                    if (facetStr != "") {
                        facetStr += " ~||~ ";
                    }
                    for (var fcount = 0; fcount < selectedFacets[key].length; fcount++) {
                        if (facetStr == "") {
                            facetStr = key + "=" + "\"" + selectedFacets[key][fcount] + "\"";
                        } else if (fcount == 0) {
                            facetStr += key + "=" + "\"" + selectedFacets[key][fcount] + "\"";
                        } else {
                            facetStr = facetStr.replace(/(\")$/g, "");
                            facetStr += ("~" + selectedFacets[key][fcount] + "\"");
                        }
                    }
                }
            }
        }
        
        if($scope.defaultFacet){
            if(facetStr) {
                facetStr = "obs_url=" + "\"" + $scope.defaultFacet["label"] + "\"" + ' ~||~ ' + facetStr;
            }else{
                facetStr = "obs_url=" + "\"" + $scope.defaultFacet["label"] + "\"";
            }
            
        }

        if (facetStr) {
            params['filter'] = facetStr;
        }
        if (quickFilter) {
            params['quick_filter'] = quickFilter;
        }
        if (sortingOrder) {
            params['sortby'] = "obs_date " + sortingOrder;
        }
        if(uploadedBy) {
            params['uploaded_by'] = uploadedBy;
        }
        if($scope.info.filterSuggest.indexOf('CompoundSearch=') != -1){
            params["compound_search"] = "pagination"
        }
        var gform = document.getElementById("gb-download-bundle-hidden-form");
        gform.action = ExplorerService.getExportUrl(urlPart,params);
        document.getElementById("gb-download-bundle-hidden-form-searchtext").value = $scope.info.filterSuggest;
        gform.submit();
    };
    // Updates the from n to time from the given date objects
    $scope.setFromTo = function(fdate, tdate, drillDown, reload) {
        $scope.info.fromDate = fdate;
        $scope.info.fromTime.hr = fdate.getHours();
        $scope.info.fromTime.min = fdate.getMinutes();
        $scope.info.fromTime.sec = fdate.getSeconds();
        var utcCurrentTime = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        if (new Date(tdate) > utcCurrentTime) {
            if (!drillDown) {
                $scope.info.bundleToDate = tdate;
            }
        } else {
            $scope.info.bundleToDate = null;
        }
        $scope.info.toDate = tdate;
        $scope.info.toTime.hr = tdate.getHours();
        $scope.info.toTime.min = tdate.getMinutes();
        $scope.info.toTime.sec = tdate.getSeconds();       
        $scope.info.page['current'] = 0;
        if($scope.defaultFacet){
            var isfdateLesser = new Date(fdate).getTime() <= new Date($scope.info.fromDateOfLogVault).getTime();
            if(isfdateLesser){
                $scope.info.dateRestrictionMinDate = fdate;
            }else{
                $scope.info.dateRestrictionMinDate = $scope.info.fromDateOfLogVault;
            }
        }
        if($scope.info.callRefreshIfFromDateInRange || $scope.info.callRefreshIfToDateInRange){
            $scope.refresh(false, drillDown);
        }else{
            $scope.info.no_result = true;
            $scope.response = null;
            $scope.info.err_msg = 0;
            var dataRestrictionMsg = $scope.getValue('data_restriction_savedviews');
            $scope.info.dataRestrictionMsg = dataRestrictionMsg.replace("${val}", $scope.info.explorerDataDuration);
            $scope.info.hideFacets = true;
            $scope.d3Data = [];
            $scope.d3BarRender();
            $scope.info.resultLoading = false;
            $scope.info.dataLoading = false;
            $scope.info.viewLoad = false;
        }
    };

    // Returns the string required for the From time in the XHR query
    $scope.getFrom = function(local) {
        var date = new Date($scope.info.fromDate.getFullYear(), $scope.info.fromDate.getMonth(), $scope.info.fromDate.getDate(), $scope.info.fromTime.hr, $scope.info.fromTime.min, $scope.info.fromTime.sec);
        $scope.info.fromDate = date;
        return date.getFullYear() + "-" + $scope.makeT2DigitValue(parseInt(date.getMonth() + 1)) + "-" + $scope.makeT2DigitValue(date.getDate()) + "T" + $scope.makeT2DigitValue($scope.info.fromTime.hr) + ":" + $scope.makeT2DigitValue($scope.info.fromTime.min) + ":" + $scope.makeT2DigitValue($scope.info.fromTime.sec) + "Z";
       
    };
    $scope.makeT2DigitValue = function(value){
        if(parseInt(value) < 10) return "0"+value;
        return value;
    };;

    $scope.$watch('info.toDate', function() {
        var utcCurrentTime = metaDataService.getTodayDate();// moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        if (utcCurrentTime < $scope.info.toDate) {
            $scope.info.toDate = utcCurrentTime;
        }
    });
    $scope.$watch('info.resultLoading', function() {
        if(!$scope.info.resultLoading){
            AppService.hidePanelLoading();
        }
    })
    //Event to check when application is ready
     $scope.$on('AppLoadEvent-explorer', function (event, reload) {
        if(!$scope.info.resultLoading){ 
            AppService.hidePanelLoading();
        }
        if(reload){
            console.log($scope.tabContainId);
            if(ExplorerService.getLoadView() && !$scope.info.allConfigLoading) {
                $scope.loadDefaultFilter();
            } else {
                if($scope.tabContainId == $scope.$parent.activeTab.id){
                    $scope.searchFromLogvault();
                }
            }
        }
     });
    
    // Returns the string required for the To time in the XHR query
    $scope.getTo = function(local) {
        var utcCurrentTime = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        var today = utcCurrentTime;
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        if (!!$scope.defaultFacet && !!$scope.info.bundleToDate && $scope.info.toDate > today) {
            var date = new Date($scope.info.bundleToDate);
        } else {
            var date = new Date($scope.info.toDate.getFullYear(), $scope.info.toDate.getMonth(), $scope.info.toDate.getDate(), $scope.info.toTime.hr, $scope.info.toTime.min, $scope.info.toTime.sec);
        }
        $scope.info.toDate = date;
        // if ($scope.customDateFilter && $scope.customDateFilterApplied) {
            // date.setDate(date.getDate() + 1);
        // }        
        return date.getFullYear() + "-" + $scope.makeT2DigitValue(parseInt(date.getMonth() + 1)) + "-" + $scope.makeT2DigitValue(date.getDate()) + "T" + $scope.makeT2DigitValue($scope.info.toTime.hr) + ":" + $scope.makeT2DigitValue($scope.info.toTime.min) + ":" + $scope.makeT2DigitValue($scope.info.toTime.sec) + "Z";
        
    };

    // Returns the array containing all the explorer errors.
    $scope.getError = function() {
        return ErrorService.getErrors('explorer');
    };

    $scope.getSysErrors = function() {
        return ErrorService.getErrors('gbApp');
    };

    $scope.renderHtml = function(html) {
        return $sce.trustAsHtml(html);
    };

    // Adds the selected attribute to selected attributes
    $scope.addAttrib = function(attrib) {
        if ($scope.info.tSelectedEvtAttribs.length >= GlobalService.getVal('max_evt_attr')) {
            // alert(GlobalService.getVal('max_evt_attr_msg'));
            ModalService.alertBox({
                msgKey : 'max_evt_attr_msg'
            });
        } else {
            $scope.info.evtAttribs.splice($scope.info.evtAttribs.indexOf(attrib), 1);
            $scope.info.tSelectedEvtAttribs.push(attrib);
        }
    };

    // Removes the selected attribute from the selected attributes
    $scope.removeAttrib = function(attrib) {
        if (!attrib['default']) {
            $scope.info.evtAttribs.push(attrib);
            $scope.info.tSelectedEvtAttribs.splice($scope.info.tSelectedEvtAttribs.indexOf(attrib), 1);
        }
    };

    // Removes all the attributes from the selection.
    $scope.removeAllAttrib = function() {
        var i;
        for (i in $scope.info.tSelectedEvtAttribs) {
            if (!$scope.info.tSelectedEvtAttribs[i]['default']) {
                $scope.info.evtAttribs.push($scope.info.tSelectedEvtAttribs[i]);
            }
        }
        $scope.info.tSelectedEvtAttribs.length = 0;
        // Populating default selected event attributes
        $scope.info.tSelectedEvtAttribs.push({
            "key" : "evt_date_str",
            "dataType" : "STRING",
            "label" : "Date",
            "default" : true
        });
        $scope.info.tSelectedEvtAttribs.push({
            "key" : "evt_text",
            "dataType" : "STRING",
            "label" : "Event Text",
            "default" : true
        });
    };

    // Save the event attributes
    $scope.saveEvtAttrib = function() {
        var i;
        $scope.info.selectedEvtAttribs.length = 0;
        for (i in $scope.info.tSelectedEvtAttribs) {
            $scope.info.selectedEvtAttribs[i] = $scope.info.tSelectedEvtAttribs[i];
        }
        $scope.refresh();
    };

    $scope.cancelEvtAttrib = function() {
        $scope.info.evtAttribs = [];
        $scope.info.tSelectedEvtAttribs = [];
        $scope.info.tSelectedEvtAttribs.push({
            "key" : "evt_date_str",
            "dataType" : "STRING",
            "label" : "Date",
            "default" : true
        });
        $scope.info.tSelectedEvtAttribs.push({
            "key" : "evt_text",
            "dataType" : "STRING",
            "label" : "Event Text",
            "default" : true
        });
        var i;
        for (i in $scope.info.evtAttribsDefault) {
            if ($scope.info.selectedEvtAttribs.indexOf($scope.info.evtAttribsDefault[i]) == -1) {
                $scope.info.evtAttribs.push($scope.info.evtAttribsDefault[i]);
            } else {
                $scope.info.tSelectedEvtAttribs.push($scope.info.evtAttribsDefault[i]);
            }
        }
    };

    // Shows the aggreagate chart for the selected event attribute.
    $scope.showAggregate = function(attrib) {
        var i = 0,
            limit = 20,
            aggr,
            sum = 0,
            facetFields = $scope.facetCounts['facet_fields'];

        // Finding the total count for the given attribute.
        if (facetFields[attrib['key']]) {
            $scope.info.aggregateData = {};
            $scope.info.aggregateData['title'] = attrib['label'];
            $scope.info.aggregateData.data = [];

            for ( i = 0; i < facetFields[attrib['key']].length; i += 2) {
                sum += facetFields[attrib['key']][i + 1];
            }
            if (facetFields[attrib['key']].length < 20) {
                limit = facetFields[attrib['key']].length;
            }
            for ( i = 0; i < limit; i += 2) {
                aggr = {};
                aggr['label'] = facetFields[attrib['key']][i];
                aggr['count'] = facetFields[attrib['key']][i + 1];
                aggr['percentage'] = Math.round((facetFields[attrib['key']][i + 1] / sum) * 100);
                $scope.info.aggregateData.data.push(aggr);
            }
            $scope.info.isAggregate = true;
        } else {
            // alert('No Data Found!');
            ModalService.alertBox({
                msg : 'No Data Found!'
            });
            return;
        }

    };
    $scope.addAppsInstance = function(result){
         result.namespace = result['namespace'];//"random.namespace.by.apps";
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
                 "source": 'explorer',
                 "bundle": result.obs_url, // obs url must not be trimmed as we use it to fetch data in instance viewer
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
        }
        UserTrackingService.standard_user_tracking($scope.info.application, "Apps", 'Log View', JSON.stringify(result)).then(userTrackingSuccess, handleSessionTimeout);
        InstanceHandler.addInstance(instance);
    };
    $scope.getSeverityFilter = function() {
        return JSON.parse(JSON.stringify($scope.getFacet('severity').data)).map(function(e) { e.selected = true;return e});
    }
    $scope.addInstance = function(result, details){
        var instance,
            type = $scope.info.sectionsContent[result.namespace]['nsType'],
            title,
            filter;
        if (type == "EVENT" || type == "SESSION") {
            type = "event";
            title = "Event Viewer";
            filter = $scope.getSeverityFilter() || [];  
        } else {
            type = "section";
            title = "Section Viewer";
        }
        instance = {
            "type" : type,
            "title" : title,
            "app" : $scope.info.application,
            "module" : $scope.info.events ? "Event" : "Section",
            "data" : {
                "result" : result,
                "bundle" : $filter('bundleName')(result.obs_url),
                "sysId" : result[$scope.info.sysId],
                "file" : $filter('bundleName')(result.filename),
                "instanceDisplay" : $scope.info.fields,// GlobalService.getVal('instance_viewer_displayfield'),
                "fileDiffAttr" : $scope.info.config.file_diff_key,
                "eventSource" : details.description,
                "start_time" : $scope.getFrom(),
                "end_time" : $scope.getTo(),
                'observation' : result.obs_date,
                'observationStr' : result.obs_date_str,
                "facetStr": $scope.facetStr,
                "severityFilter" : filter
            }
        };

        var details = {
            "Serial Number" : result[$scope.info.sysId],
            "Bundle" : /*$filter('bundleName')*/(result.obs_url),
            "File" : $filter('bundleName')(result.filename),
            "Observation" : result.obs_date_str
        };
        InstanceHandler.addInstance(instance, $scope);
    };
    // Populates the page object with the latest data.
    $scope.paginator = function(count) {
        $scope.info.page['total'] = count;
        $scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
        if ($scope.info.page['current'] >= $scope.info.page['pages']) {
            $scope.info.page['current'] = $scope.info.page['pages'] - 1;
        }
    };

    //Change page size
    $scope.changePageSize = function() {
        $scope.info.page['count'] = parseInt($scope.info.page['count']);
        $scope.info.page['pages'] = Math.ceil($scope.info.page['total'] / $scope.info.page['count']);
        $scope.info.page['current'] = 0;
        $scope.info.changePageSize = true;
        $scope.refresh(true);
    };

    // Navigates to next page of results
    $scope.nextPage = function() {
        if ($scope.info.page['current'] < $scope.info.page['pages'] - 1) {
            $scope.info.page['current'] += 1;
            $scope.info.paginate = true;
            $scope.refresh(true);
        }
    };

    // Navigate to previous page of results
    $scope.prevPage = function() {
        if ($scope.info.page['current'] > 0) {
            $scope.info.page['current'] -= 1;
            $scope.info.paginate = true;
            $scope.refresh(true);
        }
    };

    // Navigate to first page of results
    $scope.firstPage = function() {
        if ($scope.info.page['current'] == 0)
            return;
        $scope.info.page['current'] = 0;
        $scope.info.paginate = true;
        $scope.refresh(true);
    };

    // Navigate to last page of results
    $scope.lastPage = function() {
        if ($scope.info.page['current'] == $scope.info.page['pages'] - 1)
            return;
        $scope.info.page['current'] = $scope.info.page['pages'] - 1;
        $scope.info.paginate = true;
        $scope.refresh(true);
    };

    // Sort results...
    $scope.sortResults = function(order) {
        if (order == 'desc') {
            $scope.info.sortOrder = {
                "label" : "Latest",
                "val" : "desc"
            };
        } else {
            $scope.info.sortOrder = {
                "label" : "Oldest",
                "val" : "asc"
            };
        }
        $scope.drillDown = false;
        $scope.refresh(true);
    };

    $scope.instanceDashboardFullscreen = false;
    $scope.instanceDashboardItems = [{
        name : '(1) Event Viewer'
    }];

    // Reset will remove all the user selection on the UI and brings the UI to default state. Keeps the defaulf filter intact.
    $scope.reset = function(noResetSectionEvent) {
        var d,
            d1,
            i,
            j,
            keys;
        // if ($scope.info.defaultFilterInfo == '' || !Object.keys($scope.info.defaultFilterInfo).length || ($scope.info.defaultFilterInfo['search_type'] == 'OUTOFBOX' && $scope.info.defaultFilterInfo['last_n_log_by_user'] != $scope.info.quick)) {
        $scope.info.quick = 0;
        $scope.info.uploadedBy = null;
        $scope.info.disable_time = false;
        //$scope.defaultFacet = null;
        $scope.info.selectedFilterName = "Select View";
        if(!noResetSectionEvent) {
            if($scope.info.config['DEFAULT_VIEW'] == 'SECTION') {
                $scope.info.eventsection = 'section';
                $scope.info.sections = true;
                $scope.info.events = false;
            } else {
                $scope.info.eventsection = 'event';
                $scope.info.sections = false;
                $scope.info.events = true;
            }
        }
        // }
        for (i in $scope.facets) {
            for (j in $scope.facets[i].data) {
                if ($scope.facets[i].data[j]['disabled'] == undefined || $scope.facets[i].data[j]['disabled'] == false) {
                    $scope.facets[i].data[j]['selected'] = false;
                }
            }
            if($scope.facets[i].filter){
                $scope.facets[i].filter = "";
            }
        }
        keys = Object.keys($scope.selectedFacets);
        for (i in keys) {
            var t_selectedFacets = [];
            for (j in $scope.selectedFacets[keys[i]]) {
                if ($scope.selectedFacets[keys[i]][j]['disabled'] != undefined && $scope.selectedFacets[keys[i]][j]['disabled'] == true) {
                    t_selectedFacets.push($scope.selectedFacets[keys[i]][j]);
                }
            }
            $scope.selectedFacets[keys[i]] = t_selectedFacets;
        }
        $scope.customDateFilter = true;
        $scope.dateRangeFilterName = GlobalService.getVal('customdate');
        d = new Date($scope.info.solrEndDate);
        d1 = new Date($scope.info.solrEndDate);
        if ($scope.info.default_days && ($scope.info.explorerDataDuration === '')) {
            d.setTime(d.getTime() - $scope.info.default_days);
            d.setSeconds(d.getSeconds());
        } else {
            d.setFullYear(d.getFullYear() - 10);
        }
        $scope.info.MinDate = new Date($scope.info.solrEndDate);
        $scope.info.MinDate.setDate($scope.info.solrEndDate.getDate() - $scope.info.max_days_allowed) 
        $scope.info.filterSuggest = $scope.info.defaultSearchText;
        if($scope.info.default_days && ($scope.info.explorerDataDuration !== '')){
            var date = $scope.setInitialDates();
            d = date.fromDate;
            d1 = date.toDate;
        }
        $scope.setFromTo(d, d1);
        $scope.info.pristine = true;
    };

    $scope.setInitialDates = function(){
        var obj = {}
        d = new Date($scope.info.solrEndDate);
        d1 = new Date($scope.info.solrEndDate);
        var DR = $scope.info.explorerDataDuration;
        var default_days_duration = moment.duration($scope.info.default_days, 'milliseconds');
        var default_days = default_days_duration.asDays();
        var currentDate = moment(new Date(), 'DD-MM-YYYY');
        var drRangeStartDate = moment(new Date()).subtract(DR, "days");
        var defaultDate = moment(new Date($scope.info.solrEndDate)).subtract(default_days, "days");
        if(moment(new Date($scope.info.solrEndDate)).isBetween(drRangeStartDate, currentDate, null, [])){
            d1 = new Date($scope.info.solrEndDate);
        }else{
            d1 = new Date(currentDate);
        }

        if(moment(new Date(defaultDate)).isBetween(drRangeStartDate, currentDate, null, [])){
            d = new Date(defaultDate);
        }else{
            d = new Date(drRangeStartDate);
        }
        $scope.info.dateRestrictionMinDate = new Date(drRangeStartDate);
        $scope.info.dateRestrictionMaxDate = new Date(currentDate);
        obj.fromDate = d;
        obj.toDate = d1;
        if(!$scope.info.initialDatesSaved){
            $scope.info.initialFromDate = new Date(drRangeStartDate);
            $scope.info.initialToDate = new Date(d1);
        }
        return obj;
    }

    // Loads a saved view.
    $scope.loadView = function(view) {
        $scope.info.defaultState = false;
        $scope.info.drillDown = false;
        $scope.info.selectedFilterName = view.search_type != "OUTOFBOX" ? view.view_name : $scope.getValue('last' + view.last_n_log_by_user + 'byme');
        $scope.applyView($scope.parseView(view));
        var details = {
            'View Name': $scope.info.selectedFilterName
        };
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", 'Apply View', JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };

    // Loads the logs uploaded by me.
    $scope.loadLogsByMe = function(n, def) {
        // if ($scope.info.defaultFilterInfo['search_type'] == 'OUTOFBOX' && $scope.info.defaultFilterInfo['last_n_log_by_user'] == n) {
            // $scope.info.defaultState = true;
        // } else {
            $scope.info.defaultState = false;
        // }
        $scope.info.quick = n;
        $scope.info.pristine = false;
        $scope.info.selectedFilterName = $scope.getValue('last' + $scope.info.quick + 'byme');
        $scope.info.uploadedBy = $scope.getLoggedInUserName();
        $scope.resetFacets();
        if(!def) {
            $scope.refresh();
        } else {
            var d = new Date($scope.info.solrEndDate);
            var d1 = new Date($scope.info.solrEndDate);
            if ($scope.info.default_days) {
                d.setTime(d.getTime() - $scope.info.default_days);
            } else {
                d.setFullYear(d.getFullYear() - 10);
            }
            $scope.info.filterSuggest = $scope.info.defaultSearchText;
            $scope.setFromTo(d, d1);
        }
        var details = {
            'View Name': $scope.getValue('last' + n + 'byme')
        };
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", 'Apply View', JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
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

    // Removes the out of box filters from the applied filters
    //check with Aswin
    $scope.removeOutOfBox = function() {
        $scope.info.defaultState = false;
        $scope.info.quick = 0;
        // if ($scope.info.config['DEFAULT_VIEW'] == 'BOTH') {
            // if ($scope.info.filterSuggest == "*" && $scope.info.events && $scope.info.sections) {
                // $scope.info.pristine = true;
            // }
        if ($scope.info.config['DEFAULT_VIEW'] == 'EVENT') {
            if ($scope.info.filterSuggest == "*" && $scope.info.events && !$scope.info.sections) {
                $scope.info.pristine = true;
            }
        } else {
            if ($scope.info.filterSuggest == "*" && !$scope.info.events && $scope.info.sections) {
                $scope.info.pristine = true;
            }
        }
        $scope.info.selectedFilterName = "Select View";
        $scope.info.uploadedBy = null;
        $scope.refresh();
    };

    //Checks if any facet is selected or not
    $scope.checkFacets = function() {
        for (var i in $scope.selectedFacets) {
            if ($scope.selectedFacets[i].length > 0) {
                return true;
            }
        }
        if($scope.defaultFacet) {
            return true;
        }
        return false;
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
        if(p_view['sections'] || p_view['events']) {
            if (!!p_view['facets']) {
                keys = Object.keys(p_view['facets']);
            }
            // if (p_view.default) {
                // $scope.info.defaultSearchText = p_view['search_text'];
            // } else {
                $scope.info.defaultSearchText = '*';
            // }
            $scope.info.filterSuggest = p_view['search_text'];
            $scope.info.sections = p_view['sections'];
            $scope.info.events = p_view['events'];
            if ($scope.info.sections == true) {
                $scope.info.eventsection = "section";
            } else {
                $scope.info.eventsection = "event";
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

                fromDateFromResponse, fromDate = metaDataService.getStringToDate(fromDateFromResponse);//moment(fromDateFromResponse, 'YYYY-MM-DD HH:mm:ss').toDate();
                toDateFromResponse,toDate =  metaDataService.getStringToDate(toDateFromResponse); //moment(toDateFromResponse, 'YYYY-MM-DD HH:mm:ss').toDate();             
                if($scope.info.explorerDataDuration !== ''){
                    $scope.setInitialDates();
                    var fromDate, toDate;
                    // var reloadData = false;
                    var formattedFromDateFromResponse = moment(fromDateFromResponse).format('YYYY-MM-DD');
                    var difference = moment(new Date(toDateFromResponse)).diff(new Date(fromDateFromResponse), 'days');
                    var formattedToDateFromResponse = moment(toDateFromResponse).format('YYYY-MM-DD');
                    var formattedInitialFromDate = moment($scope.info.initialFromDate).format('YYYY-MM-DD');
                    var formattedInitialToDate = moment($scope.info.initialToDate).format('YYYY-MM-DD');
                    if(moment(formattedToDateFromResponse).isBetween(formattedInitialFromDate, formattedInitialToDate, null, [])){
                        toDate = new Date(toDateFromResponse);
                        $scope.info.callRefreshIfFromDateInRange = true;
                    }else{
                        toDate = new Date($scope.info.initialToDate);
                        $scope.info.callRefreshIfFromDateInRange = false;
                    }
                    // var diff = moment(new Date(toDateFromResponse)).subtract(new Date(fromDateFromResponse), "days");
                    var diff = moment(formattedToDateFromResponse).subtract($scope.info.explorerDataDuration, "days");
                    var fromDate = difference < $scope.info.explorerDataDuration ? formattedFromDateFromResponse : diff;
                    if(moment(fromDate).isBetween(formattedInitialFromDate, formattedInitialToDate, null, [])){
                        fromDate = moment(fromDate).toDate();
                        $scope.info.callRefreshIfToDateInRange = true;
                    }else{
                        fromDate = new Date($scope.info.initialFromDate);
                        $scope.info.callRefreshIfToDateInRange = false;
                    }
                }
                $scope.info.MinDate = fromDate;
                $scope.todayDate = toDate;
                $scope.setFromTo(fromDate,toDate,'');
            }
        } else {
            $scope.loadLogsByMe(p_view['lastnbyme'], true);
        }
        
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
                    	if(facet == 'namespace' && ($scope.sectionsContent[value]["nsType"] == "EVENT" || $scope.sectionsContent[value]["nsType"] == "SESSION")) {
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
            			if(facet == 'namespace' && ($scope.sectionsContent[value]["nsType"] == "EVENT" || $scope.sectionsContent[value]["nsType"] == "SESSION")) {
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
        p_view['search_text'] = decodeURIComponent(view.search_text).replace(/%27/g, '\'');
        p_view['start_time'] = view.start_ts;
        p_view['end_time'] = view.end_ts;
        p_view['events'] = view.search_type == "EVENT";
        p_view['sections'] = view.search_type == "SECTION";
        p_view['lastn'] = view.last_n_log;
        p_view['lastnbyme'] = view.last_n_log_by_user;
        p_view['default'] = view.default;
        return p_view;
    };

    if (!$cookies.savedFilters) {
        $scope.info.savedFilters = [];
    } else {
        if ($cookies.savedFilters.split("#@#") && $cookies.savedFilters.split("#@#").length && $cookies.savedFilters.split("#@#").length > 0) {
            $scope.info.savedFilters = $cookies.savedFilters.split("#@#");
        }

    }

    //Save view related methods...
    $scope.showSaveFilterModal = function() {
        var currentLoggedUser = $scope.getLoggedInUserName();
        if ($scope.savedFiltersList) {
            var userView = $scope.savedFiltersList.filter(function (view) {
                return view.created_by == currentLoggedUser;
            });

            if (userView.length >= GlobalService.getVal('max_views_limit')) {
                ModalService.alertBox({
                    msgKey: 'max_views_msg'
                });
                return;
            }
        }
        $scope.saveModal = {};
        $scope.saveModal.saveStatus = "initiated";
        $scope.saveModal.message = "";
        $scope.saveModal.filters = "";
        $scope.saveModal.filtersString = "";
        $scope.saveModal.searchQuery = $scope.info.filterSuggest;
        $scope.saveModal.timeRange = $scope.getFrom(true).replace(/T|Z/g, ' ') + "To " + $scope.getTo(true).replace(/T|Z/g, ' ');
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
    
        $scope.modal = ModalService.openModal('partials/explorer-save-filter.html', $scope, false, true);
        $scope.form = {
            visible : true,
            message : ""
        };
    };
    $scope.allSavedFiltersList = [];
    $scope.saveModal.viewOverwrite = false;

    $scope.checkViewName = function() {
        $scope.saveModal.viewOverwrite = false;
        if ($scope.savedFiltersList && $scope.savedFiltersList.length && $scope.savedFiltersList.length > 0) {
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

            if (found) {
                // mark it as invalid
                $scope.form.saveViewModal.viewName.$setValidity('duplicate', false);
            } else {
                $scope.form.saveViewModal.viewName.$setValidity('duplicate', true);
            }

        } else {
            $scope.getSavedFilters();
        }
    };

    $scope.saveFilter = function() {
        if (!$scope.form.saveViewModal.$valid) {
            return;
        }
        $scope.callSaveViewAPI();

    };

    $scope.callSaveViewAPI = function() {
        var saveParam = {
            "search_string" : encodeURIComponent($scope.saveModal.searchQuery.replace(/\'/g, '%27')),
            "search_type" : $scope.info.sections ? "SECTION" : "EVENT",
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
        ExplorerService.saveFilter(saveParam).then(function(response) {
            var details = {
                "View Name" : $scope.saveModal.filterName,
                "Search Text" : encodeURIComponent($scope.saveModal.searchQuery.replace(/\'/g, '%27')),
                "Facet String" : $scope.saveModal.filtersString,
                "Time Range" : $scope.getFrom() + "--" + $scope.getTo(),
                "Search Type": saveParam.search_type
            };
            UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", 'Save View', "{\'" + JSON.stringify(details) + "\'}").then(userTrackingSuccess, handleSessionTimeout);

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

    $scope.hideModalPanel = function(type) {
        $scope.saveModal.saveStatus = "initiated";
    }
    $scope.savedFiltersListLoading = true;

    //Gets the saved filters
    $scope.getSavedFilters = function(track) {
        $scope.savedFiltersListNotFound = false;
        $scope.savedFiltersListLoading = true;
        ExplorerService.getSavedFilters().then(function(response) {
            populateSavedViewsList(response, track);
        }, function(response) {
            $scope.savedFiltersListLoading = false;
            $scope.savedFiltersListNotFound = true;
            handleSessionTimeout(response);
        });
    };

    function populateSavedViewsList(response, track) {
        // $scope.savedFiltersList = response.data.Data;
        $scope.savedFiltersList = [];
        $scope.allFilterList = response.data.Data;
        angular.forEach($scope.allFilterList, function(view) {
            if(view.search_type == "SECTION" || view.search_type == "EVENT") {
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
        
       
            var details = {
                'Name of views': viewsList
            };
            UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", 'List view', JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
        
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
    };

    //Opens dialog box to confirm the deletion of selected filter
    $scope.deleteSavedFilter = function(selectedFilter, event) {
        $scope.modal = ModalService.openModal('partials/explorer_delete_filter.html', $scope, false, true);
        $scope.deleteModal = {};
        $scope.deleteModal.filter = {};
        $scope.deleteModal.filter.name = selectedFilter.view_name;
        $scope.deleteModal.filter.desc = decodeURIComponent(selectedFilter.desc);
        $scope.deleteModal.filter.isDefault = selectedFilter.default;
        $scope.deleteModal.status = "initiated";
        $scope.deleteModal.deleteOperationMsg = "";
    };

    //Changes filter accessibility of selected filter
    $scope.changeFilterAccessibility = function(view) {
        $scope.savedFiltersListLoading = true;
        ExplorerService.changeFilterAccessibility(view).then(function(response) {
            $scope.info.changeFilterAccesibilityOperation.statusCode = 0;
            $scope.getSavedFilters();
            var activity = view.public ? 'Set View Private' : 'Set View Public';
            var details = {
                'View Name': view.view_name
            };
            UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
        }, function(response) {
            $scope.info.changeFilterAccesibilityOperation.statusCode = -1;
            $scope.savedFiltersListNotFound = true;
            $scope.savedFiltersListLoading = false;
            handleSessionTimeout(response);
        });
    };
    //Changes the default filter for a user
    $scope.changeDefaultFilter = function(view, outOfBox) {
        $scope.savedFiltersListLoading = true;
        if(!outOfBox) {
            ExplorerService.setResetDefaultFilter(view).then(function(response) {
                view.default = !view.default;
                var activity = "";
                if(view.default) {
                    //$scope.loadView(view);
                    activity = "Set Default View";
                } else {
                    if(view.view_name == $scope.info.selectedFilterName) {
                        //$scope.selectedFacets = {};
                        $scope.info.defaultFilterInfo = {};
                        //$scope.reset();
                    }
                    activity = "Reset Default View";
                }
                var details = {
                    'View Name': view.view_name
                };
                UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
                $scope.getSavedFilters();
                // $scope.getAllSavedFilter();
            }, function(response) {
                $scope.savedFiltersListLoading = false;
                handleSessionTimeout(response);
            });
        } else {
            var viewName = 'last_' + view + '_by_' + $scope.getLoggedInUserName();
            var saveParam = {
                "search_string" : "*",
                "search_type" : "OUTOFBOX",
                "last_n_log" : 0,
                "last_n_log_uploaded_by_me" : view,
                "facet_string" : "",
                "start_time" : $scope.getFrom(),
                "end_time" : $scope.getTo(),
                "search_name" : viewName,
                "search_desc" : "undefined",
                "is_public" : false,
                "is_default" : false
            };
            ExplorerService.saveFilter(saveParam).then(function(response) {
                var views = $filter('filter')($scope.allFilterList, {view_name: viewName}) || [];
                var activity = "";
                var details = {
                    'View Name': $scope.getValue('last' + view + 'byme')
                };
                if((views.length && !views[0].default) || !views.length) {
                    activity = "Set Default View";
                    var tempView = {
                        view_name: viewName,
                        default: false
                    };
                    $scope.info.defaultFilterInfo = {
                        search_type: 'OUTOFBOX',
                        last_n_log_by_user: view
                    };
                    $scope.loadLogsByMe(view, false);
                    ExplorerService.setResetDefaultFilter(tempView).then(function(response) {
                        $scope.getSavedFilters();
                        // $scope.getAllSavedFilter();
                    }, function(response) {
                        $scope.savedFiltersListLoading = false;
                        handleSessionTimeout(response);
                    });
                } else {
                    activity = "Reset Default View";
                    if($scope.getValue('last' + view + 'byme') == $scope.info.selectedFilterName) {
                        $scope.selectedFacets = {};
                        $scope.info.defaultFilterInfo = {};
                        $scope.reset();
                    }
                    $scope.getSavedFilters();
                }
                UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
            }, function(response) {
                $scope.savedFiltersListLoading = false;
                handleSessionTimeout(response);
            });
        }
    };

    $scope.dateRangeFilterName = GlobalService.getVal('customdate');
    // Applies the quick filter based on the user selection
    $scope.changeQuickFilter = function(item) {
        $scope.info.defaultState = false;
        $scope.info.pristine = false;
        $scope.info.quickFilter = true;
        var d,
            d1;        
        d =  metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        d1 =  metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
        $scope.info.page['current'] = 0;
        if (item != 'customdate') {
            $scope.customDateFilter = false;
            $scope.dateRangeFilterName = GlobalService.getVal(item);
            $scope.info.quick = 0;
            $scope.info.uploadedBy = null;
            switch(item) {
            case 'lasthour' :
            case GlobalService.getVal('lasthour') :
                d.setHours(d.getHours() - 1);
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('lasthour');
                break;
            case 'today' :
            case GlobalService.getVal('today') :
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
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
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('yesterday');
                break;
            case 'thisweek' :
            case GlobalService.getVal('thisweek') :
                d.setDate(d.getDate() - d.getDay() + 1);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('thisweek');
                break;
            case 'thismonth' :
            case GlobalService.getVal('thismonth') :
                d.setDate(1);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('thismonth');
                break;
            case 'last2days' :
            case GlobalService.getVal('last2days') :
                d.setDate(d.getDate() - 2);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('last2days');
                break;
            case 'last7days' :
            case GlobalService.getVal('last7days') :
                d.setDate(d.getDate() - 7);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('last7days');
                break;
            case 'last30days' :
            case GlobalService.getVal('last30days') :
                d.setDate(d.getDate() - 30);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                $scope.setFromTo(d, d1);
                $scope.dateRangeFilterName = GlobalService.getVal('last30days');
                break;
            case 'mostrecent' :
            case GlobalService.getVal('mostrecent') :
                $scope.info.quick = 1;
                var fDate = new Date($scope.info.solrEndDate);
                if ($scope.info.max_days_allowed) {
                    fDate.setDate(fDate.getDate() - $scope.info.max_days_allowed);
                } else {
                    fDate.setFullYear(fDate.getFullYear() - 10);
                }
                $scope.setFromTo(fDate, new Date($scope.info.solrEndDate));

                // $scope.refresh();
                $scope.dateRangeFilterName = GlobalService.getVal('mostrecent');
                break;
            case 'last5' :
            case GlobalService.getVal('last5') :
                $scope.info.quick = 5;
                var fDate = new Date($scope.info.solrEndDate);
                if ($scope.info.max_days_allowed) {
                    fDate.setDate(fDate.getDate() - $scope.info.max_days_allowed);
                } else {
                    fDate.setFullYear(fDate.getFullYear() - 10);
                }
                $scope.setFromTo(fDate, new Date($scope.info.solrEndDate));
                // $scope.refresh();
                $scope.dateRangeFilterName = GlobalService.getVal('last5');
                break;
            case 'last10' :
            case GlobalService.getVal('last10') :
                $scope.info.quick = 10;
                var fDate = new Date($scope.info.solrEndDate);
                if ($scope.info.max_days_allowed) {
                    fDate.setDate(fDate.getDate() - $scope.info.max_days_allowed);
                } else {
                    fDate.setFullYear(fDate.getFullYear() - 10);
                }
                $scope.setFromTo(fDate, new Date($scope.info.solrEndDate));
                // $scope.refresh();
                $scope.dateRangeFilterName = GlobalService.getVal('last10');
                break;
            default :
                // alert("Nothing");
                ModalService.alertBox({
                    msg : 'Nothing'
                });
                $scope.dateRangeFilterName = GlobalService.getVal('customdate');
                break;
            }
        } else {
            $scope.customDateFilter = true;
            $scope.customDateFilterApplied = true;
            $scope.info.quickFilter = false;
            $scope.info.quick = 0;
            $scope.info.uploadedBy = null;
            $scope.dateRangeFilterName = GlobalService.getVal(item);
        }
    };

    // Gets the values from the globals based on the given key.
    $scope.getValue = function(key) {
        return GlobalService.getVal(key);
    };

    // Closes the modal held by $scope.modal
    $scope.hideModal = function() {
        $scope.modal.close();
    };
    $scope.showEventGroup = function(){
        var flag = GlobalService.getVal('event_group_tab');
        if(!flag){
            return false;
        }
        if(!$scope.defaultFacet || !$scope.defaultFacet.selected || !$scope.response || !$scope.response.docs || !$scope.response.docs.length){
            $scope.info.dataTabs = false;
            return false;
        };
        if($scope.info.eventsection == 'event'){
            return true;
        }
        $scope.info.dataTabs = false;
        return false;
    }
    $scope.breadcrumbYearView=function(){
        var d, d1;
        d = new Date($scope.info.fromDate);
        d1 = new Date($scope.info.toDate);
        d.setFullYear(d.getFullYear() - 10);
        $scope.setFromTo(d, d1);
    }
    $scope.breadcrumbMonthView=function(){
        var d, d1;
        d = $scope.info.fromDate;
        d1 = $scope.info.toDate;
        $scope.setFromTo(d, d1);
    }
    $scope.breadcrumbDayView=function(){
        var d, d1;
        d = new Date($scope.info.solrEndDate);
        d1 = new Date($scope.info.solrEndDate);
        $scope.setFromTo(d, d1);
    }

    //Deletes the selected filter permanently
    $scope.deleteFilterRequest = function(filterName) {
        $scope.deleteModal.status = "progress";
        ExplorerService.deleteSavedFilter(filterName).then(function(response) {
            $scope.deleteModal.status = "success";
            if($scope.info.selectedFilterName == filterName) {
                $scope.info.selectedFilterName = "Select View";
            }
            $scope.deleteModal.deleteOperationMsg = "Deleted successfully";
            var details = {
                "View Name" : $scope.deleteModal.filter.name
            };
            UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", 'Delete View', "{\'" + JSON.stringify(details) + "\'}").then(userTrackingSuccess, handleSessionTimeout);

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
    
    var firstTimeLoaded = false;
    
    $scope.loadDefaultFilter = function() {
        var dashboardView = ExplorerService.getLoadView();
        if(!!dashboardView) {
            $scope.defaultFacet = null;
            if(dashboardView.type == "custom") {
            	if(dashboardView['view']['facet_filters'].hasOwnProperty("obs_url")) {
            		$scope.defaultFacet = {
			            label : dashboardView['view']['facet_filters']['obs_url'][0],
			            selected : true,
			            title : dashboardView['view']['facet_filters']['obs_url'][0],
			            value : ""
			        };
			        delete dashboardView['view']['facet_filters']['obs_url'];
            	}
                var view = dashboardView['view'];
                view.view_name = 'Select View';
                var facet_filters = "";
                angular.forEach(view.facet_filters, function(values, facet) {
                    angular.forEach(values, function(value) {
                        if(facet == 'namespace' && ($scope.sectionsContent[value]["nsType"] == "EVENT" || $scope.sectionsContent[value]["nsType"] == "SESSION")) {
                            facet = 'events';
                        }
                        var tmpString = "`" + facet + (facet == 'namespace' || facet == 'events' ? "^" + $scope.sectionsContent[value]['description'] : "") + "^" + value + "`";
                        facet_filters += (!!facet_filters.length ? ',' : '') + tmpString;
                    });
                });
                view.facet_filters = [facet_filters];
                firstTimeLoaded = true;
                $scope.loadView(view);
            } else if(dashboardView.type == "savedView") {
                $scope.info.dataLoading = true;
                $scope.info.facetsLoading = true;
                ExplorerService.getSavedFilters().then(function(response) {
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
                            ExplorerService.setLoadView(null);
                            $scope.loadDefaultFilter();
                        } else {
                            firstTimeLoaded = true;
                        }
                    }
                }, function(response) {
                    $scope.info.dataLoading = false;
                    $scope.info.facetsLoading = false;
                });
            }
            ExplorerService.setLoadView(null);
        }
        ExplorerService.getDefaultFilterInfo().then(function(response) {
            var d,
                d1,
                view_name;
            $scope.info.defaultFilterInfo = response.data.Data;
            if ($scope.info.defaultFilterInfo == '') {
                $scope.info.defaultFilterInfo = {};
                if(!dashboardView) {
                    firstTimeLoaded = true;
                    $scope.reset();
                }
            } else if ( typeof $scope.info.defaultFilterInfo === 'object') {
                if(!dashboardView) {
                    firstTimeLoaded = true;
                    $scope.loadView($scope.info.defaultFilterInfo);
                }
            }
        }, function(response) {
            console.error("Unable to fetch default filter.");
            handleSessionTimeout(response);
        });
        
    };

    //Gets the scope of filters
    $scope.getFilterScope = function(filter) {
        if ($scope.info.filterBtn == 'all') {
            return (filter.currentUser || (!filter.currentUser && filter.public));
        } else if ($scope.info.filterBtn == 'my') {
            return filter.currentUser;
        } else {
            return $scope.getFilterOtherScope(filter);
        }
    };

    $scope.getFilterOtherScope = function(filter) {
        return !filter.currentUser && filter.public;
    };

    //Get current user name i.e logged in user name
    $scope.getLoggedInUserName = function() {
        return metaDataService.getUser()['email'];
    };

    /*
     * Filter dropdown
     */
    $scope.getSearchKey = function(str){
        var gbOperators = [' and ', ' or ', ' not '];
        var lastIndex = 0;
        var currentIndex = 0;
        str = str.toLowerCase();
        for(var i=0; i < gbOperators.length; i++) {
            currentIndex = str.lastIndexOf(gbOperators[i]);
            if(currentIndex > lastIndex) {
                lastIndex = currentIndex;
                if(i == 0 && i == 2){
                    lastIndex = lastIndex + 6;
                }else{
                    lastIndex = lastIndex + 5;
                }
            }
        }
        return str.substr(lastIndex , str.length);        
    }

    $scope.getSearchKeyIndex = function(str){
        var gbOperators = [' and ', ' or ', ' not '];
        var lastIndex = -1;
        var currentIndex = 0;
        str = str.toLowerCase();
        for(var i=0; i < gbOperators.length; i++) {
            currentIndex = str.lastIndexOf(gbOperators[i]);
            if(currentIndex > lastIndex) {
                lastIndex = (currentIndex - 1) + gbOperators[i].length;
            }
        }
        return lastIndex;
    }
    $scope.showAutoSuggestDD = function() {
        $scope.info.showDropdown = true;
    }
    $scope.filterSuggest = function() {
        // if ($scope.info.filterSuggest && ($scope.info.filterSuggest.length > 0) && ($scope.info.filterSuggest.length < 2)){
        //     return false;
        // }
        $scope.showAutoSuggestDD();
        $scope.suggestionData = [];
        if ($scope.info.filterSuggest && ($scope.info.filterSuggest.length > 0)) {
            var str = $scope.info.filterSuggest;
            $scope.info.filterSuggestItem = str;

            $scope.info.filterSuggestLatest = str;
            var tmpStr = str;
            var indexOfSpace = tmpStr.lastIndexOf(" ");

            if (indexOfSpace != -1) {
                tmpStr = tmpStr.substr((indexOfSpace + 1), tmpStr.length);
            }

            var keyword = $scope.getSearchKey(str);

            var attributeStr = "";
            
            $scope.info.filterSuggestLoading = true;
            
            if($scope.info.suggestionsPending) {
                $scope.suggestionsDeferred.resolve();
            }
            
            $scope.suggestionsDeferred = $q.defer();
            $scope.info.suggestionsPending = true;
            //check for section: search for '.' at the end
            //if it does not have '.' then search for section
            var sectionSearch = false,  showAllAtr = false;
            if(keyword.indexOf('.') == -1){
                sectionSearch = true;
            }else{  
                //check the last character is '.' or not
                if(keyword.indexOf('.') == (keyword.length - 1)) {
                    showAllAtr = true;
                }else{
                    //read text after '.'
                    var sIndex = keyword.lastIndexOf('.') + 1;
                    var eIndex = keyword.length;
                    attributeStr = keyword.substring(sIndex, eIndex);
                }
                keyword = $scope.info.filterSuggestSelectedSection["table_name"];
            }
            //Load sectons name
            if(sectionSearch && $scope.info.filterSuggestionsSectionsList.length == 0){
                $scope.loadSectionsListForSuggestion(keyword,sectionSearch,attributeStr);
            }else if(!sectionSearch){
                $scope.loadSectionsListForSuggestion(keyword,sectionSearch,attributeStr);
            }else{
                $scope.loadSectionsListForSuggestionApplyFilter(keyword,sectionSearch,attributeStr);
                $scope.info.suggestionsPending = false;
                $scope.info.filterSuggestLoading = false;
            }
            
            //filter saved filter list and display is as suggested filter
            if($scope.savedFiltersListNotLoaded ){
                $scope.loadSavedFilterForSuggestionDD();
                $scope.savedFiltersListNotLoaded = false;
            }else{
                var localStr = $scope.info.filterSuggestItem.toLowerCase();
                $scope.info.filterSavedFilterRemote = $scope.savedFiltersList.filter(function(data) {
                    var localData = data["view_name"].toLowerCase();
                    if(localData.indexOf(localStr) != -1) {
                        return true;
                    }else{
                        return false;
                    }
                });
            }

        } else {
            
            if($scope.info.suggestionsPending) {
                $scope.suggestionsDeferred.resolve();
                $scope.info.filterSuggestLoading = false;
            }

            $scope.info.filterSuggestions = [{
                error:{
                    label : 'Start typing to get suggestions.',
                    dataType : 'none'
                }}];
        }

    };
    $scope.loadSavedFilterForSuggestionDD = function(){
        ExplorerService.getSavedFilters().then(function(response) {
            var responseData = response.data.Data;
            $scope.applySuggesstedFilterOnAllSavedView(responseData);

        }, handleSessionTimeout);
    }
    $scope.applySuggesstedFilterOnAllSavedView = function(responseData){
        var visibleFilters = [];
        for (var i in responseData) {
            if (responseData[i].created_by == $scope.getLoggedInUserName() || (responseData[i].created_by != $scope.getLoggedInUserName() && responseData[i].public == true)) {
                visibleFilters.push(responseData[i]);
            }
        }

        if (visibleFilters) {
            for (var i = 0; i < visibleFilters.length; i++) {
                var tmpData = visibleFilters[i];
                if (tmpData.desc) {
                    var rs = tmpData.desc;
                    var rt = rs.replace(/&#39;/g, '').replace(/\%20/g, ' ');
                    visibleFilters[i].desc = rt;
                }
            }
            $scope.savedFiltersList = visibleFilters;
            var localStr = $scope.info.filterSuggestItem.toLowerCase();
            $scope.info.filterSavedFilterRemote = visibleFilters.filter(function(data) {
                var localData = data["view_name"].toLowerCase();
                if(localData.indexOf(localStr) != -1) {
                    return true;
                }else{
                    return false;
                }
            });
        }
    }
    $scope.loadSectionsListForSuggestion = function(keyword,sectionSearch, attributeStr){        
        ExplorerService.suggestFilterSearch($scope.info.eventsection, keyword,  sectionSearch, $scope.suggestionsDeferred).then(function(response) {
            $scope.info.suggestionsPending = false;
            $scope.info.filterSuggestLoading = false;
            if (!response.data.Data.length || response.data.Data.hasOwnProperty('gb_error')) {
                $scope.info.filterSuggestions = [{
                    error: {
                        label : 'No matching suggestions.',
                        dataType : 'none'
                    }
                }];
            } else {
                if(response.data.Data.length == 0){
                    $scope.info.filterSuggestions = [{
                        error: {
                            label : 'No matching suggestions.',
                            dataType : 'none'
                        }
                    }];
                }
                if(sectionSearch){
                    $scope.info.filterSuggestionsSectionsList = response.data.Data;
                }else{
                    $scope.info.filterSuggestionsAttriList = response.data.Data;
                }                
                $scope.loadSectionsListForSuggestionApplyFilter(keyword,sectionSearch, attributeStr);
            }

        }, function(response) {
            if(response.status != -1) {
                $scope.info.filterSuggestLoading = false;
            }
            $scope.info.suggestionsPending = false;
            $scope.info.filterSuggestLoading = false;
            handleSessionTimeout(response);
        });
    }
    $scope.loadSectionsListForSuggestionApplyFilter = function(keyword,sectionSearch,attributeStr){
        var tempData;
        if(sectionSearch){
            $scope.info.filterSuggestType = 'sections';
            tempData = $scope.info.filterSuggestionsSectionsList.filter(function(data){
              
                if(!data["namespace_desc"]) {
                    return false;
                }
                var localData = data["namespace_desc"].toLowerCase();
                var localStringData = keyword.toLowerCase();
                if(localData.indexOf(localStringData) != -1){
                    return true;
                }else{
                    return false;
                }
            });
        }else{
            $scope.info.filterSuggestType = 'attributes';            
            tempData = $scope.info.filterSuggestionsAttriList.filter(function(data){
                for(var key in data){
                    var localData = data[key]["attribute_label"].toLowerCase();
                    var localStringData = attributeStr.toLowerCase();
                    if(localData.indexOf(localStringData) != -1){
                        return true;
                    }else{
                        return false;
                    }
                    break;
                }
            });
        }
        if($scope.info.filterSuggestions.length == 0) {
            $scope.info.filterSuggestions = [{
            error: {
                label : 'No matching suggestions.',
                dataType : 'none'
                }
            }];
        }else{
            $scope.suggestionData = tempData;
            if(tempData.length == 0){
                $scope.info.filterSuggestions = [{
                    error: {
                        label : 'No matching suggestions.',
                        dataType : 'none'
                    }
                }];
                $scope.suggestionPaginationReset();
                return;
            }
            $scope.suggestionPaginationReset();
            $scope.suggestionPaginationLoadData();
        }
    }
    $scope.suggestionPagination = {
        pageSize : 50,
        page : 0,
        msg : "",
        visible: false,
        next: function(){
            this.page++;
            if(this.page >= Math.ceil(parseInt($scope.suggestionData.length/this.pageSize))){
                this.page = Math.ceil(parseInt($scope.suggestionData.length/this.pageSize));
            }
            $scope.suggestionPaginationLoadData();
        },
        prev: function(){
            this.page--;
            if(this.page <=0){
                this.page = 0;
            }
            $scope.suggestionPaginationLoadData();
        },
        first: function(){
            this.page = 0;
            $scope.suggestionPaginationLoadData();
        },
        last: function(){
            this.page = Math.ceil(parseInt($scope.suggestionData.length/this.pageSize));
            $scope.suggestionPaginationLoadData();
        }
    };
    $scope.suggestionPaginationReset = function(){
        $scope.suggestionPagination.page = 0;
    }
    $scope.suggestionPaginationLoadData = function(){
        var endIndex = ($scope.suggestionPagination.page + 1) * $scope.suggestionPagination.pageSize;
        var startIndex = endIndex - $scope.suggestionPagination.pageSize;
        if( $scope.suggestionData.length <= endIndex){
            endIndex = $scope.suggestionData.length;
        }
        if($scope.suggestionData.length > $scope.suggestionPagination.pageSize){
            $scope.suggestionPagination.visible = true;
        }else{
            $scope.suggestionPagination.visible = false;
        }
        
        $scope.suggestionPagination.msg = (startIndex + 1) + " - " + endIndex + " of " + $scope.suggestionData.length;
        $scope.info.filterSuggestions = $scope.suggestionData.slice(startIndex, endIndex);
    }
    //filter locally saved filter - most resent saved filter-custom filter
    $scope.getMostRecentQueries = function(){
        var filteredResult = [];
        var localStr = $scope.info.filterSuggestItem.toLowerCase();
        filteredResult = $scope.info.savedFilters.filter(function(data){
            var localData = data.toLowerCase();
            if(localData.indexOf(localStr) != -1) {
                return true;
            }else{
                return false
            }
        });
        return filteredResult;
    }
    $scope.updateMatchingSection = function(suggest) {
        $scope.info.filterSuggestType = 'sections';
        $scope.info.filterSuggestSelectedSection = suggest;
        if (suggest.type == 'none')
            return;

        var tmpStr = $scope.info.filterSuggestLatest;
        var indexOfSpace = $scope.getSearchKeyIndex(tmpStr);// tmpStr.lastIndexOf(" ");
        
        $scope.logMatching('Matching sections', suggest.namespace_desc + "." + suggest.label);

        if (indexOfSpace != -1) {

            var patt = new RegExp(/[^'(.)+'$]/);
            var res = patt.test(tmpStr);
            var tmpStr2 = tmpStr.substr((indexOfSpace + 1), tmpStr.length);
            tmpStr = tmpStr.substr(0, (indexOfSpace + 1));

            if (res && tmpStr2.length > 0) {

                $scope.info.filterSuggest = tmpStr + '\'{' + suggest.namespace_desc + '}.';
            } else {

                $scope.info.filterSuggest = tmpStr;
            }

        } else {

            $scope.info.filterSuggest = '\'{' + suggest.namespace_desc + '}.';
        }
        $scope.filterSuggest();
    };

    $scope.updateMatchingAttr = function(suggest) {
        $scope.info.filterSuggestType = 'attributes';
        if (suggest.dataType == 'none')
            return;

        var tmpStr = $scope.info.filterSuggestLatest;
        var indexOfSpace = tmpStr.lastIndexOf("}");
        
        $scope.logMatching('Matching attributes', $scope.info.filterSuggestSelectedSection.namespace_desc + "." + suggest.attribute_label);

        if (indexOfSpace != -1) {

            var patt = new RegExp(/[^'(.)+'$]/);
            var res = patt.test(tmpStr);
            var tmpStr2 = tmpStr.substr((indexOfSpace + 1), tmpStr.length);
            tmpStr = tmpStr.substr(0, (indexOfSpace + 1));

            if (res && tmpStr2.length > 0) {

                $scope.info.filterSuggest = tmpStr + '.' +suggest.attribute_label + '\'';
            } else {

                $scope.info.filterSuggest = tmpStr;
            }

        } else {

            $scope.info.filterSuggest = '.' + suggest.attribute_label + '\'';
        }

    };

    $scope.$watch('info.filterSuggest', function() {
        $scope.info.filterSuggest = $scope.info.filterSuggest.replace(/&#39;/g, '');
    });

    $scope.checkDateRange = function() {
        //Handling compound search case
        if ($scope.info.filterSuggest.indexOf('CompoundSearch=') != -1 && $scope.info.sections) {
            // alert(GlobalService.getVal('events_only'));
            ModalService.alertBox({
                msgKey : 'events_only'
            });
            return;
        }
        var oneDay = 24 * 60 * 60 * 1000;
        if (Math.round(Math.abs(($scope.info.toDate.getTime() - $scope.info.fromDate.getTime()) / (oneDay))) > $scope.info.max_days_allowed && $scope.info.max_days_allowed > 0) {
            $scope.msg = "Your date range exceeds " + $scope.info.max_days_allowed + " days. Please restrict your queries to " + $scope.info.max_days_allowed + " days or lesser.<br>Click Ok to get data for " + $scope.info.max_days_allowed + " days or click Cancel and change the date range.";
            $scope.modal = ModalService.openModal("partials/date_range_exceeded.html", $scope, false, 'static');
        } else {
            //Check from current date
            var noOfDaysFromCurrentDate = Math.round(Math.abs($scope.info.solrEndDate.getTime() - $scope.info.fromDate.getTime()) / (oneDay));
            if (noOfDaysFromCurrentDate > $scope.info.max_days_allowed && $scope.info.max_days_allowed > 0) {
                $scope.msg = "You are querying data older than " + $scope.info.max_days_allowed + " days, your response will be slower. Are you sure to continue?.";
                $scope.modal = ModalService.openModal("partials/expensive_query.html", $scope, false, 'static');
            } else {
                $scope.setCookiesFrMostRecentSearch();
            }
        }

    };
    
    $scope.confirmDateRangeSelect = function() {
        var oneDay = 24 * 60 * 60 * 1000;
        $scope.info.fromDate = new Date($scope.info.toDate.getTime() - ($scope.info.max_days_allowed * oneDay));
        $scope.setCookiesFrMostRecentSearch();
    };

    $scope.setCookiesFrMostRecentSearch = function() {
        $scope.info.page['current'] = 0;
        if ($scope.customDateFilter) {
            $scope.customDateFilterApplied = true;
        }
        if (!$scope.info.filterSuggest || $scope.info.filterSuggest == "") {
            $scope.refresh();
            return;
        }
        if (!$scope.isDuplicateMostRecentSearch($scope.info.filterSuggest)) {
            if ($cookies.savedFilters) {
                $cookies.savedFilters += "#@#" + $scope.info.filterSuggest;
            } else {
                $cookies.savedFilters = $scope.info.filterSuggest;
            }
            $scope.info.savedFilters = $cookies.savedFilters.split("#@#");
        }
        $scope.info.notFacetSearch = true;
        $scope.refresh();
    };

    $scope.isDuplicateMostRecentSearch = function(val) {
        if (!$scope.info.savedFilters || !$scope.info.savedFilters.length)
            return false;
        var len = $scope.info.savedFilters.length;
        for (var i = 0; i < len; i++) {
            if (val == $scope.info.savedFilters[i]) {
                return true;
            }
        }

        return false;
    };
    
    $scope.createRule = function(namespace) {
    	ExplorerService.setRuleSection(namespace);
    	ExplorerService.setRuleText("");
    	$scope.$parent.createRuleFromExplorer();
    };

    $scope.openExportPopup = function() {
        $scope.info.exportPopupPage = $scope.info.page.current+1;
        $scope.modalInstance = ModalService.openModal('partials/explorer/exportcsv.html', $scope);
    };
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
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", "Open facet stats popup", JSON.stringify(facet)).then(userTrackingSuccess, handleSessionTimeout);
        $scope.modalInstance = ModalService.openModal('partials/explorer/facetstats.html', $scope);
    };
    $scope.downloadCsv = function() {
        $scope.info.dataLoading = true;
        if($scope.csvpage.noOfRecordsCsv == 0 || $scope.csvpage.noOfRecordsCsv < GlobalService.getVal("minNoOFRecords") || $scope.csvpage.noOfRecordsCsv > GlobalService.getVal("maxNoOFRecords")) {
            $scope.csvdownloaderror = true;
            $scope.info.dataLoading = false;
        }else {
            ExplorerService.updateLimit($scope.csvpage.noOfRecordsCsv).then(function(response) {
                if($scope.csvpage.pagevalue == "current"){
                    $scope.logExportEvents(false);
                    $scope.getExportUrl(0);
                }else {
                    $scope.logExportEvents(true);
                    $scope.getExportUrl(1);
                }
                UserTrackingService.standard_user_tracking($scope.info.application, "Events", "Download CSV", "Count:"+$scope.csvpage.noOfRecordsCsv);
                setTimeout(function(){$scope.info.dataLoading = false;}, 2000);
                $scope.csvdownloaderror = false;                
                GlobalService.setVal('events_export_limit', $scope.csvpage.noOfRecordsCsv);
                $scope.events_export_limit = GlobalService.getVal('events_export_limit');
                $scope.closeModal();
            });
        }
    };
    
    $scope.logShowTime = function() {
        var details = {};
        var activity = ($scope.info.showOTime ? 'Show' : 'Hide') + ' Original Time';
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };
    
    $scope.logExportEvents = function(firstPage) {
        var activity = firstPage ? 'Export CSV from 1st page' : 'Export CSV from current page';
        var details = {};
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };
    
    $scope.logStatistics = function() {
        var details = {"oldest data" :  moment($scope.$scope.info.display_obs_min).format("YYYY-MM-DD HH:mm:ss") ,
                        "Newest data": moment($scope.info.display_obs_max).format("YYYY-MM-DD HH:mm:ss")};
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", 'Show statistics', JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };
    
    $scope.logShowMoreLess = function(more) {
        var details = {};
        var activity = !!more ? 'Show More' : 'Show Less';
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };
    
    $scope.logToggleTimeline = function(showTimeline) {
        var details = {};
        details['Timeline'] = !!showTimeline ? 'Show Timeline' : 'Hide Timeline';
        var activity = 'Toggle Timeline';
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };
    
    $scope.logAutoOpen = function(autoOpen) {
        if(!autoOpen) {
            $scope.info.showDropdown = false;
        }
        var details = {};
        var activity = !!autoOpen ? 'Turn On Auto-Open' : 'Turn Off Auto-Open';
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };
    
    $scope.logMatching = function(activity, detail) {
        var details = {"Detail": detail};
        UserTrackingService.standard_user_tracking($scope.info.application, $scope.info.events ? "Event" : "Section", activity, JSON.stringify(details)).then(userTrackingSuccess, handleSessionTimeout);
    };
    
    function userTrackingSuccess(response) {
        
    };
    $scope.searchFromLogvault = function(){
        $scope.info.defaultFilterInfo = {};
        $scope.selectedFacets = {};
        //reset view
        $scope.info.pristine = true;        
        $scope.info.selectedFilterName = "Select View";
        $scope.info.clearFilter = true;
        $scope.customDateFilter = true;
        $scope.customDateFilterApplied = true;
        $scope.info.page['current'] = 0;

        //$scope.info.pristine = false;
        // Checking for bundle name
        var bundleData = ExplorerService.getBundleData();
        $scope.defaultFacet = {
            label : bundleData["bundlename"],
            selected : true,
            title : bundleData["bundlename"],
            value : ""
        };
        if(!$scope.info.hasSections){
            $scope.info.events = true;
        }
        //show selected facet                   
        bundleId = bundleData['bundle_id'];
        ExplorerService.getDateRange(bundleId).then(function(response) {
            var responseData = response.data.Data;            
            fDate =  metaDataService.getTodayDate();// moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
            fDate.setYear(responseData.obs_min.split('-')[0]);
            fDate.setMonth(responseData.obs_min.split('-')[1] - 1);
            fDate.setDate(responseData.obs_min.split('-')[2].substring(0, 2));
            fDate.setHours(responseData.obs_min.split('-')[2].substring(3, 5));
            fDate.setMinutes(responseData.obs_min.split('-')[2].substring(6, 8));
            fDate.setSeconds(responseData.obs_min.split('-')[2].substring(9, 11));
            // Setting minus one day.
            fDate.setDate(fDate.getDate() - 1);
            tDate = metaDataService.getTodayDate();//moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
            tDate.setYear(responseData.obs_max.split('-')[0]);
            tDate.setMonth(responseData.obs_max.split('-')[1] - 1);
            tDate.setDate(responseData.obs_max.split('-')[2].substring(0, 2));
            tDate.setHours(responseData.obs_max.split('-')[2].substring(3, 5));
            tDate.setMinutes(responseData.obs_max.split('-')[2].substring(6, 8));
            tDate.setSeconds(responseData.obs_max.split('-')[2].substring(9, 11));
            // Setting plus one day.
            tDate.setDate(tDate.getDate() + 2);
            $scope.info.logBundleSearch = true;
            if($scope.info.explorerDataDuration !== ''){
                $scope.info.fromDateOfLogVault = fDate;
                $scope.info.dateRestrictionMinDate = fDate;
                $scope.info.dateRestrictionMaxDate = $scope.todayDate;
            }
            $scope.setFromTo(fDate, tDate);
        }, function(response) {
            console.error(response);
        });
    }

    $scope.eventGroups = (function(){
        return{
            originalRecors : [],
            records: [],
            currentPageData: [],
            pageSize : [{
                value: 20,
                active: false,
                disabled: false
            },{
                value: 40,
                active: false,
                disabled: true
            },{
                value: 60,
                active: false,
                disabled: true
            },{
                value: 80,
                active: false,
                disabled: true
            },{
                value: 100,
                active: false,
                disabled: true
            }],
            inlineSearchValue : '',
            countColumnSort: '',
            urlPart : '',
            queryParam : '',
            filterSuggest : '',
            loading: false,
            noDataFound: false,
            pagination: {
                offset: 20,
                defaultOffset: 20,
                currentPage: 1,
                totalPages: 1,
                startIndex: 0,
                pages: [{
                    value : 1,
                    active: true
                }]
            },
            api: function(){
                var me = this, isDrillDown= ExplorerService.getDrillDown();
                var startDate = $scope.getFrom(isDrillDown);
                var endDate = $scope.getTo(isDrillDown);
                var totalRec = $scope.info.page['total'];
                var urlPart = startDate + '/' + endDate + '/' + totalRec;
                //if there no change in url param, do nothings
                if(!me.isChanged()){
                    return;
                }
                me.filterSuggest = $scope.info.filterSuggest;
                me.queryParam = $scope.info.queryParam;
                me.urlPart = urlPart;
                me.loading = true;
                ExplorerService.getEventGroups(urlPart, $scope.info.queryParam , $scope.info.filterSuggest).then(function(response) {
                var responseData = response.data.Data;
                    me.set(responseData);
                    me.loading = false;
                    if(!responseData || !responseData.length || responseData.length == 0){
                        me.noDataFound = true;
                    }else{
                        me.noDataFound = false;
                    }
                    me.resetPagination();
                }, function(){
                    me.set([]);
                    me.loading = false;
                    me.noDataFound = true;
                    me.resetPagination();
                });
            },
            isChanged : function(){
                var me = this;
                var startDate = $scope.getFrom();
                var endDate = $scope.getTo();
                var totalRec = $scope.info.page['total'];
                var urlPart = startDate + '/' + endDate + '/' + totalRec;
                //if there no change in url param, do nothings
                if(urlPart === me.urlPart && me.filterSuggest === $scope.info.filterSuggest && me.queryParam === $scope.info.queryParam){
                    return false;
                }
                return true;
            },
            set: function(data){
                var me = this;                
                me.originalRecors = data;
                me.records = data;
            },
            get: function(){
                return this.records;
            },
            applyInlineFilter: function(text){
                var me = this;
                if(text){
                    me.records = me.originalRecors.filter(function(item){
                        if(item['eventType'].toLowerCase().indexOf(text.toLowerCase()) != -1) return true;
                        return false;
                    });
                }else{
                    me.resetInlineFilter();
                }
                me.resetPagination();
            },
            resetInlineFilter: function(){
                var me = this;
                me.records = angular.copy(me.originalRecors);
            },
            resetPagination: function(size){
                var me = this, cPage;
                var totalRows = me.records.length;
                //enable/disabled page size button
                for(var i=0;i<me.pageSize.length;i++){
                    cPage = me.pageSize[i];
                    if(totalRows/cPage.value > 1){
                        cPage.disabled = false;
                    }else{
                        cPage.disabled = true;                        
                    }
                }
                //highlight pagesize button
                if(size){
                    me.pagination.offset = size;
                    for(var i=0;i<me.pageSize.length;i++){
                        if(me.pageSize[i]['value'] == size){
                            me.pageSize[i]['active'] = true;
                        }else{
                            me.pageSize[i]['active'] = false;
                        }
                    }
                }else{
                    //reset page size highlight
                    for(var i=0;i<me.pageSize.length;i++){
                        me.pageSize[i]['active'] = false;
                    }
                    me.pageSize[0].active = true;
                    me.pagination.offset = me.pagination.defaultOffset;
                }
                me.pagination.currentPage = 1;
                //load data
                me.updateDataToShow();
                //reset page numbers
                me.pagination.totalPages = Math.ceil(me.records.length/me.pagination.offset);
                me.pagination.pages = [];
                for(var i=0;i<me.pagination.totalPages;i++){
                    me.pagination.pages.push({value: (i+1), active: false});
                }
                if(me.pagination.pages.length){
                    me.pagination.pages[0]['active'] = true;
                }
            },
            updateDataToShow: function(){
                var me = this, sIndex, eIndex;
                sIndex = (me.pagination.currentPage - 1) * me.pagination.offset;
                eIndex = sIndex + me.pagination.offset;
                if(me.records.length > 0){
                    me.currentPageData = me.records.slice(sIndex,eIndex);
                }
            },
            changePageSize: function(cPage){
                if(cPage.disabled) return false;
                var me = this;
                me.resetPagination(cPage.value);
            },
            changePage: function(page){
                var me = this;
                me.pagination.currentPage = page.value;
                me.updateDataToShow();
                //hightlight page button                
                for(var i=0;i<me.pagination.pages.length;i++){
                    if(me.pagination.pages[i]['value'] == page.value){
                        me.pagination.pages[i]['active'] = true;
                    }else{
                        me.pagination.pages[i]['active'] = false;
                    }
                }

            },
            sortCountColumn: function(){
                var me = this, dir;     
                if(!me.countColumnSort){
                    me.countColumnSort = 'fa-sort-numeric-asc';
                    dir = 'asc';
                }else if(me.countColumnSort == 'fa-sort'){
                    me.countColumnSort = 'fa-sort-numeric-asc';
                    dir = 'asc';
                }else if (me.countColumnSort == 'fa-sort-numeric-desc'){
                    me.countColumnSort = 'fa-sort-numeric-asc';
                    dir = 'asc';
                }else if(me.countColumnSort == 'fa-sort-numeric-asc'){
                    me.countColumnSort = 'fa-sort-numeric-desc';
                    dir = 'desc';
                }
                me.sortData(dir);
            },
            sortData: function(dir){
                var me = this;
                if(!me.records.length) return false;
                me.records.sort(function(item1, item2){
                    if(dir == 'asc'){
                        return (parseInt(item1.count) - parseInt(item2.count));
                    }else{
                        return (parseInt(item2.count) - parseInt(item1.count));                     
                    }
                });
                me.updateDataToShow();
            },
            openInstanceViewer: function(params){
                var instance,title, type;
                type = 'EVENT_GROUP';
                title = GlobalService.getVal("event_group_tab_label");
                instance = {
                    "type" : type,
                    "title" : title,
                    "app" : $scope.info.application,
                    "module" : "Event",
                    "data" : {'result':params}
                };
                InstanceHandler.addInstance(instance, $scope);
            }
        }
    })();
    $scope.logreduceMinLimit= GlobalService.getVal('event_group_tab_confirm_limit_min');
    $scope.logreduceMaxLimit= GlobalService.getVal('event_group_tab_confirm_limit_max');
    $scope.logreduceMaxLimitMsg = GlobalService.getVal('event_group_tab_confirm_limit_min_msg');
    $scope.loadEventGroups= function(){
        if($scope.info.dataTabs) return;
        //check for the limit
        if($scope.info.page['total'] >= $scope.logreduceMinLimit && $scope.info.page['total'] <= $scope.logreduceMaxLimit){
            $scope.showEventGroupChangeConfirmMin();
        }else if($scope.info.page['total'] > $scope.logreduceMaxLimit){
            $scope.showEventGroupChangeConfirmMax();
        }else{
            $scope.initiateLogReduce();
        }
    };
    $scope.initiateLogReduce = function(){
        $scope.info.dataTabs = true;
        $scope.eventGroups.api();
        if($scope.modalInstance){
            $scope.modalInstance.close();
        }
    };
    $scope.showEventGroupChangeConfirmMin = function(){
        $scope.logreduceMaxLimitMsg = GlobalService.getVal('event_group_tab_confirm_limit_min_msg');
        $scope.modalInstance = ModalService.openModal('partials/explorer/event_group_confirmation.html', $scope);
    };
    $scope.showEventGroupChangeConfirmMax = function(){
        $scope.logreduceMaxLimitMsg = GlobalService.getVal('event_group_tab_confirm_limit_max_msg');
        $scope.modalInstance = ModalService.openModal('partials/explorer/event_group_confirmation.html', $scope);
    };
    $scope.closeModal = function(){
        $scope.modalInstance.close();
        if($scope.events_export_limit == undefined || $scope.events_export_limit == 0) {
            $scope.csvpage.noOfRecordsCsv = 1;
        }else {
            $scope.csvpage.noOfRecordsCsv = $scope.events_export_limit;
        }
        $scope.csvdownloaderror = false;
    };
    $scope.downloadFacetsData= function(facetsdata){
        var facets = angular.copy(facetsdata);
        var data = [], tmp = [], row = [];
        for(var i=0;i<facets.length;i++){
            if(facets[i]['data'] && facets[i]['data'].length > 0){
                tmp = facets[i]['data'];
                row = [];
                for(var j=0;j<tmp.length;j++){                    
                    if(tmp[j].key != 'obs_url' && (tmp[j].label!='Section Name' || $scope.info.eventsection=='section')){
                        row.push(tmp[j]);
                    }
                }
                if(row.length > 0){
                    data = data.concat(row);
                }
            }
        }
        data.forEach(function(a){ 
            delete a.selected;
            delete a.key;
            a['Facet Name'] = a.title;
            delete a.title;
            a['Facet Identifier'] = a.label;
            delete a.label;
            a['Number of results'] = a.value;
            delete a.value;
        });
        var graphdata = angular.copy($scope.d3Data);
        var graphdataTitle = graphdata[0]['title'];

        $timeout(function() {
            JSONToCSVConvertor(data, "Facet Report", graphdata, graphdataTitle);
        }, 0);

        UserTrackingService.standard_user_tracking($scope.info.application, 'Explorer', 'Export csv', JSON.stringify({"activity":"Export as csv"})).then(function (response) {

        }, handleSessionTimeout);

    };
    var JSONToCSVConvertor = function(JSONData, ReportTitle, graphdata, graphdataTitle) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        
        var CSV = '';
        var columnHeader = [];
        var row = "",tmp;
        //Set Report title in first row or line
        
        CSV += ReportTitle + '\r\n\n';
        ShowLabel = true;
        //This condition will generate the Label/Header
        if (ShowLabel) {
            
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                columnHeader.push(index);
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);
            
            //append Label row with line break
            CSV += row + '\r\n';
        }
        //undeline header
        row = "";
        for(var index =0; index<columnHeader.length;index++) {
            row += '"----------------------------------",';
        }
        CSV += row + '\r\n';
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index =0; index<columnHeader.length;index++) {
                row += '"' + arrData[i][columnHeader[index]] + '",';
            }

            row.slice(0, row.length - 1);
            
            //add a line break after each row
            CSV += row + '\r\n';
        }

        if(graphdataTitle && graphdata.length){
            CSV += '\r\n' + graphdataTitle + '\r\n';
            CSV += '"----------------------------------",'+ '\r\n';
            for(var i=0;i<graphdata.length;i++){
                row = '';
                tmp = graphdata[i];
                row += '"' + tmp.name + '",' + '"' + tmp.value + '",';
                CSV += row + '\r\n';
            }
        }

        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   
        
        //Generate a file name
        var fileName; //= "facets";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName = ReportTitle.replace(/ /g,"_");   
        
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    
        
        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");    
        link.href = uri;
        
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    $scope.showMoreOption = function(data){
        return data.length > $scope.info.facetLimit;
    };

    ExplorerService.getSavedFilters().then(function(response) {
        $scope.savedFiltersList = response.data.Data;
    }, function(response) {
        $scope.savedFiltersListLoading = false;
        $scope.savedFiltersListNotFound = true;
        handleSessionTimeout(response);
    });
}])
.controller('ExplorerTabCtrl', ['$scope', 'ModalService', 'GlobalService', 'AppService', 'ExplorerService', '$timeout',
function($scope, ModalService, GlobalService, AppService, ExplorerService, $timeout) {
    $scope.maxExplorerTabChar = GlobalService.getVal('maxExplorerTabChar');
    $scope.justforflag = {};
    $scope.justforflag.stillloading = false;
    $scope.tabList = [
        {
            id: "tab1",
            name: "Default",
            editMode: false
        }
    ];
    $scope.activeTab = $scope.tabList[0];
    $scope.getDisableTabStatus = function(tab) {
        if($scope.justforflag.stillloading) {
            return true;
        }else {
            if(tab != undefined && tab.id == $scope.activeTab.id){
                return false;    
            }
            for(i=0; i<$scope.tabList.length;i++){
                if($scope.tabList[i].editMode){
                    return true;
                }
            }
            return false;
        }
    }
    $scope.addNewTab = function(){
        if($scope.getDisableTabStatus()){
            return
        }else {
            for(i=0; i<$scope.tabList.length;i++){
                $scope.tabList[i].editMode = false;
            }
            var idList = [];
            for(i=0; i<$scope.tabList.length;i++){
                idList.push($scope.tabList[i].id);
            }
            do {
                var newId = "tab"+parseInt(Math.floor(Math.random() * 100));
            }
            while (idList.indexOf(newId) != -1);
            var obj = {
                id: newId,
                name: "Explorer Tab",
                editMode: false
            }
            ExplorerService.setBundleData(null)
            $scope.tabList.push(obj);
            $scope.activeTab = obj;
        }
    }
    $scope.enableEditMode = function(tab){
        for(i=0;i<$scope.tabList.length;i++){
            if($scope.tabList[i].id == tab.id){
                if(tab.id == "tab1" || tab.id != $scope.activeTab.id){
                    $scope.tabList[i].editMode = false;
                }else {
                    $scope.tabList[i].editMode = true;
                }
            }
        }
    }
    $scope.getDisableButtonStatus = function(tab) {
        if(tab.name == ""){
            return true;
        }else {
            return /^\s+$/.test(tab.name);
        }
    }
    $scope.changeTab = function(tab){
        if($scope.getDisableTabStatus()){
            return;
        }else {
            for(i=0; i<$scope.tabList.length;i++){
                if(tab.id != $scope.tabList[i].id){
                    $scope.tabList[i].editMode = false;
                }
            }
            $scope.activeTab = tab;
        }
    }
    $scope.getMaxTabs = function(){
        return GlobalService.getVal('maxExplorerTabs') > $scope.tabList.length;
    }
    $scope.closeTab = function(tab){
        var titleObj = {msg:"Close Tab"};
        var msgObj = {msg:"Do you want to close this tab?"};
        var modalInstance = ModalService.confirmationBox(titleObj, msgObj, "Yes", "No");
        modalInstance.result.then(function(response) {
            for(i=0; i<$scope.tabList.length;i++){
                if($scope.tabList[i].id == tab.id){
                    $scope.tabList.splice(i,1);
                    $scope.activeTab = $scope.tabList[i-1];
                    break;
                }
            }
        }, function(response) {
            
        });
    }
}])
.controller('MoreFacetCtrl', ['$scope', 'ModalService', 'GlobalService', 'AppService', 'ExplorerService', '$timeout',
function($scope, ModalService, GlobalService, AppService, ExplorerService, $timeout) {
    var ctrl = this;
    ctrl.facetList = [];
    ctrl.inlineSearch = "";
    ctrl.inlineSearchText = "";
    ctrl.tempList = [];
    ctrl.tempObject = null;
    ctrl.loading = true;
    ctrl.sortByAlpha = true;
    ctrl.facetGrouped = {
        '#':[],'A':[],'B':[],'C':[],'D':[],'E':[],'F':[],'G':[],'H':[],
        'I':[],'J':[],'K':[],'L':[],'M':[],'N':[],'O':[],'P':[],'Q':[],
        'R':[],'S':[],'T':[],'U':[],'V':[],'W':[],'X':[],'Y':[],'Z':[]
    };
    
    ctrl.resetfacetGroup = function(){
        var keys = Object.keys(ctrl.facetGrouped);
        keys.map(function(item){
            if(ctrl.facetGrouped[item].length > 0){
                ctrl.facetGrouped[item] = [];
            }
        })
    };
    ctrl.loadFacetGroup = function (reset) {
        if (!reset) {
            //load data localy
            ctrl.tempObject = $scope.$parent.getSelectedFacetData(ctrl.findex);
            if (ctrl.tempObject && ctrl.tempObject.data) {
                ctrl.tempList = angular.copy(ctrl.tempObject.data);
            };
            //sort
            ctrl.tempList.sort(function (item1, item2) {
                if (item1.label.toLowerCase() > item2.label.toLowerCase()) return 1;
                return -1;
            });
        }
        //This is executed on Initial load and cleat filter click
        if (ctrl.sortByAlpha == true) {
            //group data
            ctrl.tempList.map(function (item, index, originalData) {
                item.label = item.label.trim();
                if (!(/^[a-zA-Z]+$/.test(item.label.charAt(0)))) {
                    ctrl.facetGrouped['#'].push(item);
                } else {
                    ctrl.facetGrouped[item.label.charAt(0).toUpperCase()].push(item);
                }
            });
            //join groups into single list
            var keys = Object.keys(ctrl.facetGrouped);
            keys.map(function (item) {
                if (ctrl.facetGrouped[item].length > 0) {
                    ctrl.facetList = ctrl.facetList.concat([{ label: item, listTitle: true }]);
                    ctrl.facetList = ctrl.facetList.concat(ctrl.facetGrouped[item]);
                }
            });
        }
        //on clear filter if 9-0 is select then this is executed
        else {
            ctrl.makeFacetData();
            ctrl.sortFacetsByCount();

        }
        ctrl.loading = false;
    };
    ctrl.showMoreFacetWindow = function(selectedFacet){
        $scope.modal = ModalService.openModal('partials/explorer/load-more-facets.html', $scope, 'gb-facet-more-popup', false);
        ctrl.loading = true;
        var list = null,facetObj = null;
        ctrl.facetList = [];
        ctrl.inlineSearch = "";
        ctrl.inlineSearchText = "";
        ctrl.sortByAlpha = true;
         $timeout(function() {
            ctrl.resetfacetGroup();
            ctrl.loadFacetGroup();
        }, 1000);
    };

    ctrl.makeFacetData = function () {
        //group data
        ctrl.tempList.map(function (item, index, originalData) {
            item.label = item.label.trim();
            if (item.label.toLowerCase().indexOf(ctrl.inlineSearch.toLowerCase()) != -1) {
                if (!(/^[a-zA-Z]+$/.test(item.label.charAt(0)))) {
                    ctrl.facetGrouped['#'].push(item);
                } else {
                    ctrl.facetGrouped[item.label.charAt(0).toUpperCase()].push(item);
                }
            }
        });
        //join groups into single list
        var keys = Object.keys(ctrl.facetGrouped);
        keys.map(function (item) {
            if (ctrl.facetGrouped[item].length > 0) {
                ctrl.facetList = ctrl.facetList.concat([{ label: item, listTitle: true }]);
                ctrl.facetList = ctrl.facetList.concat(ctrl.facetGrouped[item]);
            }
        })
    };

    ctrl.inlineFilter = function () {

        ctrl.inlineSearch = ctrl.inlineSearchText;
        ctrl.loading = true;
        ctrl.facetList = [];
        ctrl.resetfacetGroup();
        if (ctrl.inlineSearch == "") {
            ctrl.loadFacetGroup(true);
            return;
        }
        //alphabet sort
        if (ctrl.sortByAlpha == true) {
            ctrl.makeFacetData();

        }
        //sort by count
        else {
            ctrl.makeFacetData();
            ctrl.sortFacetsByCount();

        }
        ctrl.loading = false;
    };

    ctrl.highlightItem = function(letter){
        if(ctrl.facetGrouped[letter].length == 0) return;
        if(letter == '#') letter = '0';
        var li = $(('#gb-facet-more-grouped-name-'+letter));
        var cntr = $('#gb-facet-more-popup-facet-list');       
        cntr.animate({
            scrollLeft: (cntr.scrollLeft() + Math.ceil(li.offset().left) - 550)
        }, 500);
    };
    ctrl.submit = function(){
        ctrl.loadFacetGroup(true);
        var facetcount = 0;
        var multimode = false;
        //get selected facets
        var list = [];
        ctrl.facetList.filter(function(item){
            if(item.selected){
                list.push(item);
            }
        });
        for(i=0;i<ctrl.tempList.length;i++){
            if(ctrl.tempList[i].selected){
                facetcount++;
            }
        }
        for(key in $scope.$parent.selectedFacets){
            if(key != ctrl.tempObject.key){
                if($scope.$parent.selectedFacets[key].length != 0){
                    multimode = true;
                    facetcount = $scope.$parent.selectedFacets[key].length + facetcount;
                }
            }
        }    
        if(multimode && facetcount > GlobalService.getVal('limitFacetTotal')) {
            ctrl.close();
            $scope.msg = GlobalService.getVal('limitFacetTotalMsg1')+GlobalService.getVal('limitFacetTotal');
            $scope.modal1 = ModalService.openModal('partials/alert_box_extra.html', $scope, false, true);
        }else if(!multimode && facetcount > GlobalService.getVal('limitFacet')) {
            ctrl.close();
            $scope.msg = GlobalService.getVal('limitFacetMsg1')+GlobalService.getVal('limitFacet');
            $scope.modal1 = ModalService.openModal('partials/alert_box_extra.html', $scope, false, true);
        }else {
            $scope.$parent.facetApplyFromMoreWindow(ctrl.tempObject,list,ctrl.findex);
            ctrl.close();
        }
    };
    ctrl.showBody = function(){
        if(ctrl.loading){
            return true;
        }else if(ctrl.facetList.length == 0) {
            return false;
        }   
        return true;     
    }
    ctrl.close = function(){
        $scope.modal.close();
    };
    ctrl.sortFacetsByCount = function(){
        ctrl.sortByAlpha = false
        //remove title
        ctrl.removeEmptyValue();
        //sort by count
        ctrl.facetList.sort(function(item1, item2){
            if(item1.value < item2.value){
                return 1;
            }else{
                return -1;
            }
        });
    };
    ctrl.removeEmptyValue = function(){
        for(var i=0;i<ctrl.facetList.length;i++){
            if(ctrl.facetList[i]['listTitle']){
                ctrl.deleteElementFromList(i);
                return;
            }
        }
    };
    ctrl.deleteElementFromList = function(index){
        ctrl.facetList.splice(index,1);
        ctrl.removeEmptyValue();
    };
    ctrl.sort = function (order) {
        ctrl.sortByAlpha = true;
        if (order == 'alpha') {
            if (ctrl.inlineSearch) {
                ctrl.inlineFilter();
                return;
            }
            ctrl.facetList = [];
            ctrl.resetfacetGroup();
            ctrl.loadFacetGroup();
        } else {
            ctrl.sortByAlpha = false;
            if (ctrl.inlineSearch) {
                ctrl.inlineFilter();
                ctrl.sortFacetsByCount();
                return;
            }
            ctrl.sortByAlpha = false;
            ctrl.sortFacetsByCount();
        }
    }
}]);
