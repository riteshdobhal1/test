// Controller to handle the change of page
angular.module('gbLogStatusApp.controllers', ['ngDraggable'])
.controller('MainCtrl', ['$scope', '$location', 'LogStatusService', 'GlobalMessages', 'GlobalService', 'MessageService',
    function($scope, $location, LogStatusService, GlobalMessages, GlobalService, MessageService,) {
        angular.element(window.document)[0].title = GlobalMessages.getValue('PAGE_TITLE');
        $scope.logo = "";
        $scope.logo_url = "";
        $scope.logo_url = '/apps/app/login/images/logo.png';
        $scope.logo = '/apps/app/login/images/logo.png';
    }
])
.controller('LogStatusCtrl', ['$scope', '$location', 'LogStatusService', 'GlobalMessages', 'GlobalService', 'MessageService', 'ngTableParams', '$filter','$window', '$interval','$document','$timeout','$cookies',
    function($scope, $location, LogStatusService, GlobalMessages, GlobalService, MessageService, ngTableParams, $filter, $window, $interval, $document,$timeout,$cookies) {
        angular.element(window.document)[0].title = GlobalMessages.getValue('PAGE_TITLE');
        $scope.logo = "";
		    $scope.currentDomain = GlobalService.getVal('primaryDomain');
        //GlobalService.showLoading('Loading ...');
        $scope.logo_url = "";
        $scope.data_loading = false;
        $scope.logo_url = '/apps/app/login/images/logo.png';
        $scope.logo = '/apps/app/login/images/logo.png';
        $scope.logStatusColumn =  $filter('filter')(GlobalService.getVal('logStatusColumn'), {
      		enabled : true
      	});
        $scope.logStatusHistoryColumn =  $filter('filter')(GlobalService.getVal('logStatusHistoryColumn'), {
      		enabled : true
      	});
        $scope.timefilter = GlobalService.getVal('timefilter');
        $scope.noLogs = false;
        $scope.TotalBundleCount = 0;
        $scope.reverse = true;
        $scope.sessionTimeOutHeader = GlobalService.getVal('sessionTimeOutHeader');
        $scope.sessionTimeOutMessage = GlobalService.getVal('sessionTimeOutMessage');
        $scope.reverseHistory = true;
        $scope.totalQueuedLogs = 0;
        $scope.liveData = true;
        $scope.logHistoryTitle = GlobalService.getVal('logHistoryTitle');
        $scope.liveDataDisplayed = GlobalService.getVal('liveDataDisplayed');
        $scope.liveDataFailed = GlobalService.getVal('liveDataFailed');
        $scope.tabelRefreshRateTitle = GlobalService.getVal('tabelRefreshRateTitle');
        $scope.totalProcessingLogs = 0;
        $scope.totalParsingLogs = 0;
        $scope.totalFinishedLogs = 0;
        $scope.totalFailedLogs = 0;
        $scope.columnUser = "status";
        $scope.columnHistory = "received_time";
        $scope.homeTime = {};
        $scope.currentHomeTime = new Date();
        $scope.homeTime.st = new Date();
        $scope.homeTime.et = new Date();
        $scope.homeTime.st.setHours($scope.currentHomeTime.getHours() - 24);
        $scope.homeTime.et.setHours($scope.currentHomeTime.getHours());
        $scope.homeTime.st = $scope.homeTime.st.toISOString();
        $scope.homeTime.et = $scope.homeTime.et.toISOString();
        $scope.selectedHomeTimeRange = "24 Hrs";
        $scope.totalLogColumns = $scope.logStatusColumn.length;
        $scope.totalLogHistoryColumns = $scope.logStatusHistoryColumn.length;
        $scope.noLogsMsg = GlobalService.getVal('noLogsMsg');
        $scope.new_data = GlobalService.getVal('new_data');
        //show loader for history
        $scope.historyAPILoading = false;
        $scope.changeAlert = GlobalService.getVal('changeAlert');
        $scope.changeAlertTitle = GlobalService.getVal('changeAlertTitle');
        $scope.changeAlertMsg = GlobalService.getVal('changeAlertMsg');
        //lod data array
        $scope.originalLogData = [];
        $scope.enabledColumn = function(param) {
          for(i=0; i<$scope.logStatusColumn.length;i++) {
            if($scope.logStatusColumn[i].field == param) {
              return false;
            }
          }
          return true;
        };
        $scope.enabledHistoryColumn = function(param) {
          for(i=0; i<$scope.logStatusHistoryColumn.length;i++) {
            if($scope.logStatusHistoryColumn[i].field == param) {
              return false;
            }
          }
          return true;
        };
        $scope.sortColumn = function(col){
          $scope.columnHistory = col;
          if($scope.reverseHistory){
            $scope.reverseHistory = false;
            $scope.reverseclass = 'arrow-up';
          }else{
            $scope.reverseHistory = true;
            $scope.reverseclass = 'arrow-down';
          }
          $scope.bundleDataHistory = $filter('orderBy')($scope.bundleDataHistory, $scope.columnHistory, $scope.reverseHistory);
          $scope.tableParamsHistory = new ngTableParams({
              page: GlobalService.getVal('page'),
              //count: GlobalService.getVal('count'),
              reload: $scope.tableParamsHistory
            }, {
              getData: function ($defer, params) {
                var searchedHistoryData = $scope.searchHistoryData();
                params.total(searchedHistoryData.length);
                $scope.tableHistoryData = [];
                $scope.tableHistoryData = searchedHistoryData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                $defer.resolve($scope.tableHistoryData);
              }
            });
        };
        $scope.sortClass = function(col){
        if($scope.columnHistory == col){
            if($scope.reverseHistory){
              return 'arrow-down';
            }else{
              return 'arrow-up';
            }
          }else{
            return '';
          }
        };
        $scope.convertSecToHrsMinsSec = function(seconds) {
          var h = Math.floor(seconds / 3600);
          var x = seconds%3600;
          var m = Math.floor(x/60);
          var s = seconds%60;
          h = h < 10 ? '0' + h : h;
          m = m < 10 ? '0' + m : m;
          s = s < 10 ? '0' + s : s;
          return h + 'Hr ' + m +'Min '+ s +'Sec';
        };
        $scope.getLoginDetails = function(param){
          if($cookies.mps == undefined){
            $scope.intervalStop();
            $("#sessionModal").modal({backdrop: 'static', keyboard: false});
  				} else {
            LogStatusService.getLoginFields().then(function (response) {
              var data = response.data.Data;
              var i = 1;
              var temp= {id:"",label:"Select Default Product"};
              if(response.data.Data.user[0].first_name == ""){
                $scope.loggedInUsername = response.data.Data.user[0].email;
              } else {
                $scope.loggedInUsername = response.data.Data.user[0].first_name+" "+response.data.Data.user[0].last_name;
              }
            },function(error){
              $window.location.href = localStorage.getItem("logOutUrl");
            });
          }
        };
        //$scope.getLoginDetails();
        $scope.logoutUser = function(){
      		LogStatusService.logoutInfoserver().then(function (response){
      			var logouturl = $window.location.href = $cookies.logouturl;
      			var theCookies = document.cookie.split(';');
      			var cookiesList = [],
      		    	cookiesNameValue,
      		    	cookiesName;
      			for (var i=1 ; i <= theCookies.length ; i++) {
      				cookiesNameValue = theCookies[i-1];
      				cookiesName = cookiesNameValue.split("=")[0];
      				cookiesName = cookiesName.trim();
      				cookiesList.push(cookiesName);
      			}
      			for (var i=0 ; i < cookiesList.length ; i++) {
      				cookiesName = cookiesList[i];
      				document.cookie = cookiesName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + $scope.currentDomain + ";path=/";

      			}
      			$window.location.href = logouturl;
      		});
      	};
        $scope.getTimeRangeForEventContent = function(obs_date){
            var dateRange = {
                sDate: "",
                eDate: ""
            };
            if(!obs_date){
                obs_date = new Date();
            }
            var cTime = new Date(obs_date);
            var st = new Date(obs_date), et = new Date(obs_date);
            //set custom date n time filter
            //$scope.timefilter.customFilter.fromDate.gDate = cTime;
            //$scope.timefilter.customFilter.toDate.gDate = cTime;
            if($scope.timefilter.currentValue.indexOf("2 Week") != -1) {
                st.setHours(cTime.getHours() - 336);
                et.setHours(cTime.getHours() + 0);
            }else if($scope.timefilter.currentValue.indexOf("1 Week") != -1) {
                st.setHours(cTime.getHours() - 168);
                et.setHours(cTime.getHours() + 0);
            }else if($scope.timefilter.currentValue.indexOf('Custom') != -1) {
                $scope.timefilter.customFilter.fromDate.gDate.setDate($scope.timefilter.customFilter.fromDate.gDate.getDate() + 1)
                $scope.timefilter.customFilter.toDate.gDate.setDate($scope.timefilter.customFilter.toDate.gDate.getDate() + 1)
                st = $filter('date')($scope.timefilter.customFilter.fromDate.gDate, 'yyyy-MM-dd');
                et = $filter('date')($scope.timefilter.customFilter.toDate.gDate, 'yyyy-MM-dd');
                var hr = $scope.timefilter.customFilter.fromDate.hr;
                var min = $scope.timefilter.customFilter.fromDate.min;
                var sec = $scope.timefilter.customFilter.fromDate.sec;

                var sTime = (hr>10?hr:('0'+hr)) +  ":" + (min>10?min:('0'+min)) +":"+ (sec>10?sec:('0'+sec));
                var hr = $scope.timefilter.customFilter.toDate.hr;
                var min = $scope.timefilter.customFilter.toDate.min;
                var sec = $scope.timefilter.customFilter.toDate.sec;
                var eTime = (hr>10?hr:('0'+hr)) +  ":" + (min>10?min:('0'+min)) +":"+ (sec>10?sec:('0'+sec));
                st = new Date(st + " " + sTime);
                et = new Date(et + " " + eTime);
            }
            dateRange.sDate = st.toISOString();
            dateRange.eDate = et.toISOString();
            return dateRange;
        };
        $scope.userTracking = function (module,activity,details) {
          LogStatusService.standard_user_tracking("logstatus",module,activity,details);
        };
        $scope.eventContentApplyFilter = function(){
          if($scope.timefilter.currentValue.indexOf('Custom') != -1){
            var cTime = $scope.getTimeRangeForEventContent();
            var st = cTime.sDate;
            var et = cTime.eDate;
          }else{
            var cTime = $scope.getTimeRangeForEventContent();
            var st = cTime.sDate;
            var et = cTime.eDate;
            //reset custom time tilter
            //$scope.eventResetCustomFilter();
          }
          $scope.timefilter.applied = true;
           //show page gb-apps-body
			    angular.element(document.getElementById("gb-tab-cntr")).css('display', 'block');
          $scope.userTracking("Log History","Change Interval","Start Time "+st+" End Time "+et);
          $scope.getHistory(st,et);
        };
        $scope.getLogDetails = function(st,et) {
          $scope.data_loading = false;
          $scope.noLogs = false;
          if($cookies.mps == undefined){
            $scope.intervalStop();
            $("#sessionModal").modal({backdrop: 'static', keyboard: false});
  				} else {
            LogStatusService.getLogList(st,et).then(function (response){
              $scope.liveData = true;
              var logData = response.data.Data;
              if($scope.compareLogData(logData)){            
                //the load new data
                $scope.loadDataToLogGrid(logData);
              }
              $scope.data_loading = false;
            },function(error){
              $scope.liveData = false;
              $scope.data_loading = false;
            });
          }
        };
      $scope.compareLogData = function (logData) {
        // changes in data length
        if ($scope.originalLogData.length != logData.length) {
          return true;
        }
        for (var i = 0; i < $scope.originalLogData.length; i++) {
          for (var j = 0; j < logData.length; j++) {
            if ($scope.originalLogData[i].bundle_name === logData[j].bundle_name) {
              if ((!$scope.originalLogData[i].status === logData[j].status)) {
                //
                $scope.changeAlert = true;
                $timeout(function () {
                  $scope.changeAlert = false;
                }, 7000)
                return true;
              }
            }
          }
        }
        return false;
      }
        $scope.loadDataToLogGrid = function(logData){
          $scope.originalLogData = angular.copy(logData);
          $scope.totalQueuedLogs = 0;
          $scope.totalProcessingLogs = 0;
          $scope.totalParsingLogs = 0;
          $scope.totalFinishedLogs = 0;
          $scope.totalFailedLogs = 0;
          //Count of total bundles
          if(logData.length==0){
            $scope.noLogs = true;
          }
          $scope.TotalBundleCount = logData.length;
          for(i=0;i<logData.length;i++){                                
            if(logData[i].status == "PARTIAL"){
              logData[i].status = "COMPLETED";
            }
            if(logData[i].status == "COMPLETED" || logData[i].status == "FAILED"){
              logData[i].expected_time = "-"
            }
          }
          //Count Status Of Bundles
          var temprecievedTime = new Date(0);
          for(i=0;i<logData.length;i++){
            if(logData[i].expected_time != "-" && logData[i].expected_time > 0){
                logData[i].expected_time = $scope.convertSecToHrsMinsSec(logData[i].expected_time);
            } else if (logData[i].expected_time < 0){
                logData[i].expected_time = logData[i].expected_time * -1;
                logData[i].expected_time = $scope.convertSecToHrsMinsSec(logData[i].expected_time);
                logData[i].expected_time = "Delayed By"+" "+logData[i].expected_time;
            }
            temprecievedTime = new Date(0);
            temprecievedTime.setMilliseconds(logData[i].received_time);
            logData[i].received_timeDis = temprecievedTime.toLocaleTimeString()+" "+temprecievedTime.toDateString();
            switch(logData[i].status) {
                case "QUEUED":
                    $scope.totalQueuedLogs++;
                    break;
                case "PROCESSING":
                    $scope.totalProcessingLogs++;
                    break;
                case "COMPLETED":
                    $scope.totalFinishedLogs++;
                    break;
                case "FAILED":
                    $scope.totalFailedLogs++;
                    break;
            }
          }
          $scope.bundleData = logData;
          $scope.bundleData = $filter('orderBy')($scope.bundleData, $scope.columnUser, $scope.reverse);
          if(logData.length == 0){
            $scope.bundleData = [];
          }
          var currentPageNo = 0;
          if($scope.tableParams){
            currentPageNo = $scope.tableParams.page();
          }
          //$scope.tableParams.page= GlobalService.getVal('page');
          $scope.tableParams = new ngTableParams({
            page: GlobalService.getVal('page'),
            count: GlobalService.getVal('count'),
            reload: $scope.tableParams
          }, {
            getData: function ($defer, params) {
              var searchedData = $scope.searchData();
              /*if bundle type is null or blank then assign NA */
              searchedData.map(function(item){ if(!item.bundle_type) item.bundle_type = "NA"; return item });
              params.total(searchedData.length);
              if (params.settings().$scope == null) {
                params.settings().$scope = $scope;
              }
              $scope.tableData = [];
              $scope.tableData = searchedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
              $defer.resolve($scope.tableData);
            }
          });
          $scope.tableParams.reload();
          if(currentPageNo){
           $scope.tableParams.page(currentPageNo)
          }
        }
        $scope.$watch("searchLogKeyword", function () {
          if($scope.bundleData)
          {
            $scope.tableParams.$params.page = GlobalService.getVal('page');
            $scope.tableParams.reload();
          }
        });
        $scope.$watch("searchLogHistoryKeyword", function () {
          if($scope.bundleDataHistory)
          {
            $scope.tableParamsHistory.$params.page = GlobalService.getVal('page');
            $scope.tableParamsHistory.reload();
          }
        });
        $scope.$watch("selectedHomeTimeRange", function () {
          var currentTime = new Date();
          $scope.homeTime.st = new Date();
          $scope.homeTime.et = new Date();
          if($scope.selectedHomeTimeRange == '24 Hrs'){
            $scope.homeTime.st.setHours(currentTime.getHours() - 24);
            $scope.homeTime.et.setHours(currentTime.getHours());
          }else if($scope.selectedHomeTimeRange == '48 Hrs'){
            $scope.homeTime.st.setHours(currentTime.getHours() - 48);
            $scope.homeTime.et.setHours(currentTime.getHours());
          }
          $scope.homeTime.st = $scope.homeTime.st.toISOString();
          $scope.homeTime.et = $scope.homeTime.et.toISOString();
          $scope.userTracking("Change Log Interval","Change Interval","Start Time "+$scope.homeTime.st+" End Time "+$scope.homeTime.et);
          $scope.init();
        });
        $scope.searchData = function () {
          if($scope.searchLogKeyword)
             return $filter('filter')($scope.bundleData,$scope.customFilter,$scope.searchLogKeyword);
          return $scope.bundleData;
        };
        $scope.customFilter = function (item) {
          var val = $scope.searchLogKeyword;
          return item.bundle_name.toLowerCase().indexOf(val || '') !== -1 || item.bundle_type.toLowerCase().indexOf(val || '') !== -1 || item.received_timeDis.toLowerCase().indexOf(val || '') !== -1 || item.status.toLowerCase().toString().indexOf(val || '') !== -1 || item.expected_time.toString().toLowerCase().indexOf(val || '') !== -1 || item.ticket_number.toString().indexOf(val || '') !== -1 || item.customer_name.toLowerCase().indexOf(val || '') !== -1 || item.sysid.toLowerCase().indexOf(val || '') !== -1;
        };
        $document.bind('click', function() {
          if($cookies.mps == undefined){
            $scope.intervalStop();
            $("#sessionModal").modal({backdrop: 'static', keyboard: false});
  				} else {
            LogStatusService.updateAccessTime().then(function (response){
            },function(error){
              $("#sessionModal").modal({backdrop: 'static', keyboard: false});
            });
          }
        });
        $scope.intervalStart = function() {
          $scope.intervalObj = $interval($scope.init, GlobalService.getVal('pollingTime'));
        }
        $scope.intervalStop = function() {
          $interval.cancel($scope.intervalObj);
        }
        $scope.init = function() {
          if($cookies.mps == undefined){
            $scope.intervalStop();
            $("#sessionModal").modal({backdrop: 'static', keyboard: false});
  				} else {
            var currentTime = new Date();
          $scope.homeTime.st = new Date();
          $scope.homeTime.et = new Date();
          if($scope.selectedHomeTimeRange == '24 Hrs'){
            $scope.homeTime.st.setHours(currentTime.getHours() - 24);
            $scope.homeTime.et.setHours(currentTime.getHours());
          }else if($scope.selectedHomeTimeRange == '48 Hrs'){
            $scope.homeTime.st.setHours(currentTime.getHours() - 48);
            $scope.homeTime.et.setHours(currentTime.getHours());
          }
          $scope.homeTime.st = $scope.homeTime.st.toISOString();
          $scope.homeTime.et = $scope.homeTime.et.toISOString();
            var st = $scope.homeTime.st;
            var et = $scope.homeTime.et;
            $scope.getLoginDetails();
            LogStatusService.updateAccessTime();
            $scope.getLogDetails(st,et);
          }
        }
        $scope.getHistory = function(st,et) {
          
          $scope.noLogHistory = false;
          $scope.apiFail  = false;
          $scope.historyAPILoading = true;
          LogStatusService.getLogList(st,et).then(function (response){
            var logDataHistory = response.data.Data;
            $scope.userTracking("Log History","Load Log History","Start Time "+st+" End Time "+et+" |Found Logs "+JSON.stringify(logDataHistory));
            $scope.historyAPILoading = false;

            
            //Count of total bundles
            if(logDataHistory.length==0){
              $scope.noLogHistory = true;
            }
            for(i=0;i<logDataHistory.length;i++){
              if(logDataHistory[i].status == "COMPLETED" || logDataHistory[i].status == "FAILED"){
                logDataHistory[i].expected_time = "-"
              }                              
              if(logDataHistory[i].status == "PARTIAL"){
                logDataHistory[i].status = "COMPLETED";
              }
            }
            //Count Status Of Bundles
            var temprecievedTime = new Date(0);
            for(i=0;i<logDataHistory.length;i++){
              if(logDataHistory[i].expected_time != "-" && logDataHistory[i].expected_time > 0){
                  logDataHistory[i].expected_time = $scope.convertSecToHrsMinsSec(logDataHistory[i].expected_time);
              } else if (logDataHistory[i].expected_time < 0){
                  logDataHistory[i].expected_time = logDataHistory[i].expected_time * -1;
                  logDataHistory[i].expected_time = $scope.convertSecToHrsMinsSec(logDataHistory[i].expected_time);
                  logDataHistory[i].expected_time = "Delayed By"+logDataHistory[i].expected_time;
              }
              temprecievedTime = new Date(0);
              temprecievedTime.setMilliseconds(logDataHistory[i].received_time);
              logDataHistory[i].received_timeDis = temprecievedTime.toLocaleTimeString()+" "+temprecievedTime.toDateString();
            }
            $scope.bundleDataHistory = logDataHistory;
            if(logDataHistory.length == 0){
              $scope.bundleDataHistory = [];
            }
            $scope.tableParamsHistory = new ngTableParams({
              page: GlobalService.getVal('page'),
              count: GlobalService.getVal('count'),
              reload: $scope.tableParamsHistory
            }, {
              getData: function ($defer, params) {
                var searchedHistoryData = $scope.searchHistoryData();
                params.total(searchedHistoryData.length);
                if (params.settings().$scope == null) {
                  params.settings().$scope = $scope;
                }
                $scope.tableHistoryData = [];
                $scope.tableHistoryData = searchedHistoryData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                $defer.resolve($scope.tableHistoryData);
              }
            });
            $scope.tableParamsHistory.reload();
            $scope.fireHisoryModal();
          },function(error){
            $scope.data_not_available = GlobalService.getVal('data_not_available');
            //hide page gb-apps-body
			      angular.element(document.getElementById("gb-tab-cntr")).css('display', 'none');
            $scope.apiFail  = true;
            $scope.historyAPILoading = false;
            $scope.fireHisoryModal();
          });
        }
        $scope.fireHisoryModal = function() {
          $("#HistoryModal").modal({backdrop: 'static', keyboard: false});
        }
        $scope.openHistoryModal = function() {
          $scope.intervalStop();
          $scope.searchLogHistoryKeyword = "";
          var cTime = $scope.getTimeRangeForEventContent();
          var st = cTime.sDate;
          var et = cTime.eDate;
          $scope.noLogHistory = false;
          $scope.getHistory(st,et);
        }
        $scope.searchHistoryData = function () {
          if($scope.searchLogHistoryKeyword)
             return $filter('filter')($scope.bundleDataHistory,$scope.customFilterHistory,$scope.searchLogHistoryKeyword);
          return $scope.bundleDataHistory;
        };
        $scope.customFilterHistory = function (item) {
          var val = $scope.searchLogHistoryKeyword;
          return item.bundle_name.toLowerCase().indexOf(val || '') !== -1 || item.bundle_type.toLowerCase().indexOf(val || '') !== -1 || item.received_timeDis.toLowerCase().indexOf(val || '') !== -1 || item.status.toLowerCase().toString().indexOf(val || '') !== -1 || item.expected_time.toLowerCase().toString().indexOf(val || '') !== -1 || item.ticket_number.toString().indexOf(val || '') !== -1 || item.customer_name.toLowerCase().indexOf(val || '') !== -1 || item.sysid.indexOf(val || '') !== -1;
        };
        //Move Pager To proper Location
        angular.element(document).ready(function () {
          $("#logStatusHistoryTablePager").parent().parent().appendTo("#HistoryPagerLocation");
          $("#logStatusTablePager").parent().parent().appendTo("#logstatusListPagerLocation");
        });

        $scope.unique = function(list) {
            var uList = [];
            for(var i=0;i<list.length;i++) {
                if(uList.indexOf(list[i]) < 0){
                    uList.push(list[i])
                }
            }
            return uList;
        }

    }
])
.controller('MessageCtrl', ['$scope',
    function($scope) {

    }
])
