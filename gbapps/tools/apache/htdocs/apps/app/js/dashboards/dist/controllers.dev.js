"use strict";

/* Controllers for analytics - All the controllers related to analytics app */
angular.module('gbApp.controllers.dashboards', ['gbApp.services.analytics', 'gbApp.globals']) // DashboardsCtrl - Responsible for holding the model related to the dashboards.
.controller('DashboardsCtrl', ['$scope', '$sce', '$filter', '$interval', 'Dashboards', 'GlobalService', 'AppService', 'ErrorService', 'UserTrackingService', '$timeout', 'InstanceHandler', 'WorkbenchService', 'ModalService', '$window', '$cookies', 'metaDataService', '$modal', '$location', 'x2js', '$modalInstance', 'GBDashboardService', 'UtilService', function ($scope, $sce, $filter, $interval, Dashboards, GlobalService, AppService, ErrorService, UserTrackingService, $timeout, InstanceHandler, WorkbenchService, ModalService, $window, $cookies, metaDataService, $modal, $location, x2js, $modalInstance, GBDashboardService, UtilService) {
  var dashCtrl = this;
  dashCtrl.gbAlDashboards = [];
  dashCtrl.groupedData = [];
  $scope.showFilterPanel = false;
  dashCtrl.actionMessageFlag = false;
  $scope.filterCount = 0;
  dashCtrl.info = {};
  dashCtrl.info.query = '';
  dashCtrl.currentSelected = 0;
  dashCtrl.showSelectNotify = false; // Defines the completion of the request for dashboards.

  dashCtrl.info.complete = false;
  dashCtrl.info.loggedRole = metaDataService.getUserRole();
  dashCtrl.tabSummaryFlag = true;
  dashCtrl.filterLoading = false;
  dashCtrl.repeatCall = true;
  dashCtrl.BulkOwnerDropElement = GlobalService.getVal("BulkOwnerDropElement");
  dashCtrl.visDisableInfo = GlobalService.getVal("visDisableInfo");
  dashCtrl.BulkVisibilityDropElement = GlobalService.getVal("BulkVisibilityDropElement");
  dashCtrl.bulkOwnerEmail = GlobalService.getVal("BulkOwnerDropElement");
  ;
  dashCtrl.bulkVisibility = dashCtrl.BulkVisibilityDropElement[0].value;
  dashCtrl.bulkEditConfMessage = GlobalService.getVal("bulkEditConfMessage");
  dashCtrl.dataSourcesList = [];
  dashCtrl.dataSourcesListFlag = false;
  dashCtrl.NoUsersRoleFoundMsg = GlobalService.getVal("NoUsersRoleFoundMsg");
  dashCtrl.info.lastModifiedArray = GlobalService.getVal("lastModifiedArray");
  dashCtrl.scheduleFreq = {
    "enabled": false,
    "name": "hourly"
  };
  dashCtrl.days = GlobalService.getVal("days");
  dashCtrl.internalDashCount = 0;
  dashCtrl.userCreatedDashCount = 0;
  dashCtrl.dataSourceSelMsg = GlobalService.getVal("dataSourceSelMsg");
  dashCtrl.dtypeSelMsg = GlobalService.getVal("dtypeSelMsg");
  dashCtrl.roleAssignTitle = GlobalService.getVal("roleAssignTitle");
  dashCtrl.scheduleFreq.scheduler_timeZone = new Date().toTimeString().split("GMT")[1].substring(0, 5);
  dashCtrl.month = GlobalService.getVal("month");
  dashCtrl.schTimeHrs = GlobalService.getVal("schTimeHrs");
  dashCtrl.schTimeMin = GlobalService.getVal("schTimeMin");
  dashCtrl.changeOwnerErrorMsg = GlobalService.getVal("changeOwnerErrorMsg");
  dashCtrl.scheduleFreq.hrintvSele = "1";
  dashCtrl.scheduleFreq.weekDaySele = "1";
  dashCtrl.roles = [];
  dashCtrl.scheduleFreq.monthDay = "Sunday";
  dashCtrl.allTags = [];
  dashCtrl.scheduleFreq.YearDay = "Sunday";
  dashCtrl.scheduleFreq.YearMonth = "Jan";
  dashCtrl.info.assignRole = "Select Roles";
  dashCtrl.scheduleFreq.scheduler_recipients = "";
  dashCtrl.scheduleFreq.SelectedDays = [];
  dashCtrl.allDashCount = 0;
  dashCtrl.selectAllFlag = false;
  dashCtrl.scheduleFreq.weekDay = GlobalService.getVal('weekDay');
  dashCtrl.schReportrecp = GlobalService.getVal("schReportrecp");
  dashCtrl.schReportDays = GlobalService.getVal("schReportDays");
  dashCtrl.scheduleFreq.hrintv = GlobalService.getVal('hrintv');
  dashCtrl.schReportTitle = GlobalService.getVal('schReportTitle');
  dashCtrl.freqTitle = GlobalService.getVal("freqTitle");
  dashCtrl.schReportOptions = GlobalService.getVal("schReportOptions");
  dashCtrl.noScheduling = GlobalService.getVal("noScheduling");
  dashCtrl.info.loadCount = 0;
  dashCtrl.info.dashboardSortOrder = true;
  dashCtrl.scheduleFreq.error = false;
  dashCtrl.info.dashboardSortOrderCB = true;
  dashCtrl.info.dashboardSortOrderType = true;
  dashCtrl.info.dashboardSortOrderDOFM = true;
  dashCtrl.info.orderByField = 'name';
  dashCtrl.scheduleFreq.scheduler_time = {};
  dashCtrl.scheduleFreq.scheduler_time.hr = "HH";
  dashCtrl.scheduleFreq.scheduler_time.min = "MM";
  dashCtrl.logiOwnerSearch = "";
  dashCtrl.tableauOwnerSearch = "";
  dashCtrl.info.allDashboardsList = [];
  dashCtrl.dashboardType = GlobalService.getVal('defaultDashboard'); // Holds all the dashboards.

  dashCtrl.dashboards = []; // Holds all tableau dashboards return from infoserver API

  dashCtrl.tableauDashboards = [];
  dashCtrl.loaded = false;
  dashCtrl.defaultDashboard = [];
  dashCtrl.info.currentView = 'list';
  dashCtrl.info.currentBook = null;
  dashCtrl.info.dType = 'allDashboards'; //posible values : allDashboards, internalDashboards, internalDashboards

  dashCtrl.info.typeDisplay = 'All';
  dashCtrl.info.createdBy = 'All';
  dashCtrl.info.lastModified = 'All';
  dashCtrl.info.owner = 'All';
  dashCtrl.info.datasource = 'All';
  dashCtrl.info.dUserName = [];
  dashCtrl.info.bookOwnerList = [];
  dashCtrl.gAllDashboards = [];
  dashCtrl.info.selectAll = false;
  dashCtrl.info.unSelectAll = false;
  dashCtrl.info.tags = "";
  dashCtrl.info.tagsFilter = [];
  dashCtrl.info.loading = false;
  dashCtrl.info.selectedBooks = "";
  dashCtrl.info.workbenchApiRootDir = "";
  dashCtrl.info.tag_max_characters = GlobalService.getVal('tag_maxlimit');
  dashCtrl.info.tag_truncate_char_limit = GlobalService.getVal('tag_truncatelimit');
  dashCtrl.info.errMsg = "";
  dashCtrl.noDashboardFound = false; //dashCtrl.scheduleExportFileTypes = GlobalService.getVal("tableauExportFormat");

  dashCtrl.scheduleExportFileTypeDefault = GlobalService.getVal("scheduleExportFileTypeDefault"); //readit fromglobal

  dashCtrl.scheduleExportFileTypeCurrentVariable = ''; //tableau shecudling download type

  dashCtrl.tableauExportFormat = GlobalService.getVal("tableauExportFormat");
  dashCtrl.logiExportFormat = GlobalService.getVal("logiExportFormat");
  dashCtrl.info.selected = {};
  dashCtrl.info.filter = {};
  dashCtrl.info.pageSize = {
    "total": 0,
    "count": GlobalService.getVal("dashboardListPageCount")
  };
  dashCtrl.info.pagination = UtilService.localPagination();
  dashCtrl.info.pagination.pageSize = GlobalService.getVal("dashboardListPageCount");
  dashCtrl.info.isTableauConfigured = false;
  var htmconst_url = "../config/constants/dashboard_constants.json";
  $.get(htmconst_url, function (response, status) {
    $scope.htmconstdata = response;
  }); // //ng-change="dashCtrl.selectedExportType(type.name, $index)"
  // var selExpArr = [];
  // dashCtrl.selectedExportType = function(sel, index){
  //     if(selExpArr.length >= 1)
  //     {
  //         selExpArr.splice(0,selExpArr.length);
  //         selExpArr.push(sel);
  //     }
  //     else{
  // selExpArr.push(sel);
  // }
  //   }

  $scope.$watch(' dashCtrl.info.complete', function () {
    if (dashCtrl.info.complete) {
      AppService.hidePanelLoading();
    }
  }); //Event to check when application is ready

  $scope.$on('AppLoadEvent-dashboards', function (event, args) {
    if (dashCtrl.info.complete) {
      AppService.hidePanelLoading(); //realod fresh list of dashboards when user click main menu (Dashboard)

      if (dashCtrl.defaultDashboard.length == 0) {
        dashCtrl.setDashboard('summary');
        dashCtrl.info.loading = true;
      }

      $scope.showFilterPanel = false;
      $('#gbDashboard-filter-panel-body .panel-collapse').collapse('hide');
      $scope.clearAppliedFilters();
      dashCtrl.resetQuickFilter();
      dashCtrl.info.filterObj = [];
      dashCtrl.hardReload(true);
    }
  }); // Holds all the workbenchDashboards.

  var workbenchDashboards = {
    loading: true,
    books: []
  }; // Defines the page object for pagination.

  dashCtrl.info.page = {
    "current": 1,
    "pageSize": 10
  };
  dashCtrl.info.filterObj = [];
  dashCtrl.info.selectAllDashboard = false;
  dashCtrl.info.quickFilter = [{
    title: 'All',
    columnName: 'type_to_display',
    columnValue: "*",
    selected: true
  }, {
    title: 'Internal',
    columnName: 'type_to_display',
    columnValue: GlobalService.getVal('internalDashboards'),
    selected: false
  }, {
    title: 'User Created',
    columnName: 'type_to_display',
    columnValue: GlobalService.getVal('userCreatedDashboards'),
    selected: false
  }];
  dashCtrl.info.sortBy = null; // dashCtrl.info.pagination = {};

  dashCtrl.info.columns = [{
    title: "Name",
    sorted: false,
    columnName: "dname",
    class: "dnameNew"
  }, {
    title: "Type",
    sorted: false,
    columnName: "d_type",
    class: "dTypeNew"
  }, {
    title: "Owner",
    sorted: false,
    columnName: "gDOwner",
    class: "dOwnedNew"
  }, {
    title: "Last modified",
    sorted: false,
    columnName: "modified_ts",
    class: "dModifiedNew"
  }]; // Stores whether session is timed out or not

  dashCtrl.info.sessionTimedOut = false; // function to set dashboard type either summary or other dashboard

  dashCtrl.setDashboard = function (dtype) {
    dashCtrl.dashboardType = dtype;
    metaDataService.setDashboardType(dtype);
  };

  dashCtrl.chkAdminFeature = function () {
    if (metaDataService.getFeatures().admin) {
      return true;
    } else {
      return false;
    }
  };

  dashCtrl.info.complete = false;

  dashCtrl.info.pagination.sortByColumn = function (sortInfo, data) {
    data.sort(function (a, b) {
      var nameA = a[sortInfo['columnName']].toUpperCase(); // ignore upper and lowercase

      var nameB = b[sortInfo['columnName']].toUpperCase(); // ignore upper and lowercase

      if (sortInfo['sorted']) {
        if (nameA < nameB) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }
      } else {
        if (nameA > nameB) {
          return -1;
        }

        if (nameA < nameB) {
          return 1;
        }
      } // names must be equal


      return 0;
    });
    return data;
  }; //This will be executed only once when page loads first time
  //GBDashboardService.getAllDashboardsAndInitializeTableauServices(dashCtrl.info.pageSize["count"])
  //new api by shubam


  dashCtrl.hardReload = function (initialLoad) {
    dashCtrl.workbenchDown = false;
    dashCtrl.info.loading = true;
    dashCtrl.filterLoading = true;
    dashCtrl.info.selectAllDashboard = false;
    setTimeout(function () {
      dashCtrl.actionMessageFlag = false;
    }, 3000);
    $scope.NameFilter = {
      columnTitle: "Name"
    };
    dashCtrl.loaded = false;

    if (dashCtrl.defaultDashboard.length == 0 || dashCtrl.defaultDashboard == undefined) {
      dashCtrl.defaultDashboard = [];
    }

    WorkbenchService.checkIfTableauIsConfigured().then(function (response) {
      dashCtrl.info.isTableauConfigured = response.data.Data;

      if (dashCtrl.info.isTableauConfigured) {
        WorkbenchService.getTrustedAuthKey().then(function (response) {
          dashCtrl.info.securityToken = response.data.Data;
          GBDashboardService.getTableauInitialInfo().then(function () {
            if (dashCtrl.defaultDashboard.length == 0) {
              GBDashboardService.getSummaryDashObject(dashCtrl.info.securityToken != -1 ? true : false).then(function (data) {
                if (data.data.Data != "") {
                  dashCtrl.defaultDashboard.push(data.data.Data);

                  if (dashCtrl.defaultDashboard[0].typ == "Tableau") {
                    dashCtrl.defaultDashboard[0].dname = dashCtrl.defaultDashboard[0].name;
                    dashCtrl.defaultDashboard[0].thumbnailImgSrc = GlobalService.getVal('infoserverDomain') + "/" + dashCtrl.defaultDashboard[0].reports[0].thumbnailImgSrc;
                    dashCtrl.defaultDashboard[0]['type_to_display'] = GlobalService.getVal('userCreatedDashboards');

                    for (j = 0; j < dashCtrl.defaultDashboard[0].reports.length; j++) {
                      dashCtrl.defaultDashboard[0].reports[j].hilighted = false;
                      dashCtrl.defaultDashboard[0].reports[j].url = "/t/" + GBDashboardService.getSiteName() + "/views/" + dashCtrl.defaultDashboard[0].reports[j].url.replace('/sheets', '');
                      dashCtrl.defaultDashboard[0].reports[j].r_link = dashCtrl.defaultDashboard[0].reports[j].url;
                      dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc = GlobalService.getVal('infoserverDomain') + "/" + dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc;
                      dashCtrl.defaultDashboard[0].reports[j].rname = dashCtrl.defaultDashboard[0].reports[j].name;
                    }
                  } else {
                    dashCtrl.defaultDashboard[0].thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path') + "/" + dashCtrl.defaultDashboard[0].reports[0].thumbnailImgSrc;

                    if (dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner == "" || dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner == null) {
                      dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner = dashCtrl.defaultDashboard[0].created_by;
                    }

                    for (j = 0; j < dashCtrl.defaultDashboard[0].reports.length; j++) {
                      dashCtrl.defaultDashboard[0].reports[j].hilighted = false;
                      dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path') + "/" + dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc;
                    }

                    dashCtrl.defaultDashboard[0]['type_to_display'] = GlobalService.getVal('internalDashboards');
                  }

                  dashCtrl.defaultDashboard[0]['modified_ts_to_display'] = moment(dashCtrl.defaultDashboard[0]['modified_ts']).format("YYYY-MM-DD HH:MM:SS");
                  dashCtrl.defaultDashboard[0]['created_ts_to_display'] = moment(dashCtrl.defaultDashboard[0]['created_ts']).format("YYYY-MM-DD HH:MM:SS");
                  dashCtrl.defaultDashboard[0]['visibility'] = dashCtrl.getVisibility(dashCtrl.defaultDashboard[0]);
                  dashCtrl.defaultDashboard[0]['expand'] = false;
                  dashCtrl.defaultDashboard[0]['selected'] = false;
                  dashCtrl.defaultDashboard[0]['gDOwner'] = dashCtrl.getBookChangedOwnerName(dashCtrl.defaultDashboard[0]);
                  dashCtrl.defaultDashboard = GBDashboardService.setpermissionsandroles(dashCtrl.defaultDashboard, false);

                  if (dashCtrl.defaultDashboard.length == 0) {
                    dashCtrl.setDashboard('other');
                  } else {
                    dashCtrl.setUpSummaryDashboard();
                  }
                } else {
                  dashCtrl.setDashboard('other');
                }
              }, function (response) {});
            }

            if (dashCtrl.info.securityToken != -1) {
              GBDashboardService.newgetAllDashboards(true).then(function (data) {
                dashCtrl.processData(data, initialLoad, true);
              }, function (response) {
                dashCtrl.info.complete = true;
                dashCtrl.loaded = true;
                dashCtrl.gbAlDashboards = [];
                dashCtrl.noDashboardFound = true;
                dashCtrl.setDashboard('other');
              });
            } else {
              GBDashboardService.newgetAllDashboards(false).then(function (data) {
                dashCtrl.processData(data, initialLoad, false);
              }, function (response) {
                dashCtrl.info.complete = true;
                dashCtrl.loaded = true;
                dashCtrl.gbAlDashboards = [];
                dashCtrl.noDashboardFound = true;
                dashCtrl.setDashboard('other');
              });
            }
          });
        }, function (response) {
          dashCtrl.info.securityToken = "-1";

          if (dashCtrl.defaultDashboard.length == 0) {
            GBDashboardService.getSummaryDashObject(dashCtrl.info.securityToken != -1 ? true : false).then(function (data) {
              if (data.data.Data != "") {
                dashCtrl.defaultDashboard.push(data.data.Data);

                if (dashCtrl.defaultDashboard[0].typ == "Tableau") {
                  dashCtrl.defaultDashboard[0].dname = dashCtrl.defaultDashboard[0].name;
                  dashCtrl.defaultDashboard[0].thumbnailImgSrc = GlobalService.getVal('infoserverDomain') + "/" + dashCtrl.defaultDashboard[0].reports[0].thumbnailImgSrc;
                  dashCtrl.defaultDashboard[0]['type_to_display'] = GlobalService.getVal('userCreatedDashboards');

                  for (j = 0; j < dashCtrl.defaultDashboard[0].reports.length; j++) {
                    dashCtrl.defaultDashboard[0].reports[j].hilighted = false;
                    dashCtrl.defaultDashboard[0].reports[j].url = "/t/" + GBDashboardService.getSiteName() + "/views/" + dashCtrl.defaultDashboard[0].reports[j].url.replace('/sheets', '');
                    dashCtrl.defaultDashboard[0].reports[j].r_link = dashCtrl.defaultDashboard[0].reports[j].url;
                    dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc = GlobalService.getVal('infoserverDomain') + "/" + dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc;
                    dashCtrl.defaultDashboard[0].reports[j].rname = dashCtrl.defaultDashboard[0].reports[j].name;
                  }
                } else {
                  dashCtrl.defaultDashboard[0].thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path') + "/" + dashCtrl.defaultDashboard[0].reports[0].thumbnailImgSrc;

                  if (dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner == "" || dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner == null) {
                    dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner = dashCtrl.defaultDashboard[0].created_by;
                  }

                  for (j = 0; j < dashCtrl.defaultDashboard[0].reports.length; j++) {
                    dashCtrl.defaultDashboard[0].reports[j].hilighted = false;
                    dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path') + "/" + dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc;
                  }

                  dashCtrl.defaultDashboard[0]['type_to_display'] = GlobalService.getVal('internalDashboards');
                }

                dashCtrl.defaultDashboard[0]['modified_ts_to_display'] = moment(dashCtrl.defaultDashboard[0]['modified_ts']).format("YYYY-MM-DD HH:MM:SS");
                dashCtrl.defaultDashboard[0]['created_ts_to_display'] = moment(dashCtrl.defaultDashboard[0]['created_ts']).format("YYYY-MM-DD HH:MM:SS");
                dashCtrl.defaultDashboard[0]['visibility'] = dashCtrl.getVisibility(dashCtrl.defaultDashboard[0]);
                dashCtrl.defaultDashboard[0]['expand'] = false;
                dashCtrl.defaultDashboard[0]['selected'] = false;
                dashCtrl.defaultDashboard[0]['gDOwner'] = dashCtrl.getBookChangedOwnerName(dashCtrl.defaultDashboard[0]);
                dashCtrl.defaultDashboard = GBDashboardService.setpermissionsandroles(dashCtrl.defaultDashboard, false);

                if (dashCtrl.defaultDashboard.length == 0) {
                  dashCtrl.setDashboard('other');
                } else {
                  dashCtrl.setUpSummaryDashboard();
                }
              } else {
                dashCtrl.setDashboard('other');
              }
            }, function (response) {});
          }

          GBDashboardService.newgetAllDashboards(false).then(function (data) {
            dashCtrl.processData(data, initialLoad, false);
          }, function (response) {
            dashCtrl.info.complete = true;
            dashCtrl.loaded = true;
            dashCtrl.gbAlDashboards = [];
            dashCtrl.noDashboardFound = true;
            dashCtrl.setDashboard('other');
          });
        });
      } else {
        if (dashCtrl.defaultDashboard.length == 0) {
          GBDashboardService.getSummaryDashObject(false).then(function (data) {
            if (data.data.Data != "") {
              dashCtrl.defaultDashboard.push(data.data.Data);

              if (dashCtrl.defaultDashboard[0].typ == "Tableau") {
                dashCtrl.defaultDashboard[0].dname = dashCtrl.defaultDashboard[0].name;
                dashCtrl.defaultDashboard[0].thumbnailImgSrc = GlobalService.getVal('infoserverDomain') + "/" + dashCtrl.defaultDashboard[0].reports[0].thumbnailImgSrc;
                dashCtrl.defaultDashboard[0]['type_to_display'] = GlobalService.getVal('userCreatedDashboards');

                for (j = 0; j < dashCtrl.defaultDashboard[0].reports.length; j++) {
                  dashCtrl.defaultDashboard[0].reports[j].hilighted = false;
                  dashCtrl.defaultDashboard[0].reports[j].url = "/t/" + GBDashboardService.getSiteName() + "/views/" + dashCtrl.defaultDashboard[0].reports[j].url.replace('/sheets', '');
                  dashCtrl.defaultDashboard[0].reports[j].r_link = dashCtrl.defaultDashboard[0].reports[j].url;
                  dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc = GlobalService.getVal('infoserverDomain') + "/" + dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc;
                  dashCtrl.defaultDashboard[0].reports[j].rname = dashCtrl.defaultDashboard[0].reports[j].name;
                }
              } else {
                dashCtrl.defaultDashboard[0].thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path') + "/" + dashCtrl.defaultDashboard[0].reports[0].thumbnailImgSrc;

                if (dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner == "" || dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner == null) {
                  dashCtrl.defaultDashboard[0].dashboardSecurityInfo.owner = dashCtrl.defaultDashboard[0].created_by;
                }

                for (j = 0; j < dashCtrl.defaultDashboard[0].reports.length; j++) {
                  dashCtrl.defaultDashboard[0].reports[j].hilighted = false;
                  dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path') + "/" + dashCtrl.defaultDashboard[0].reports[j].thumbnailImgSrc;
                }

                dashCtrl.defaultDashboard[0]['type_to_display'] = GlobalService.getVal('internalDashboards');
              }

              dashCtrl.defaultDashboard[0]['modified_ts_to_display'] = moment(dashCtrl.defaultDashboard[0]['modified_ts']).format("YYYY-MM-DD HH:MM:SS");
              dashCtrl.defaultDashboard[0]['created_ts_to_display'] = moment(dashCtrl.defaultDashboard[0]['created_ts']).format("YYYY-MM-DD HH:MM:SS");
              dashCtrl.defaultDashboard[0]['visibility'] = dashCtrl.getVisibility(dashCtrl.defaultDashboard[0]);
              dashCtrl.defaultDashboard[0]['expand'] = false;
              dashCtrl.defaultDashboard[0]['selected'] = false;
              dashCtrl.defaultDashboard[0]['gDOwner'] = dashCtrl.getBookChangedOwnerName(dashCtrl.defaultDashboard[0]);
              dashCtrl.defaultDashboard = GBDashboardService.setpermissionsandroles(dashCtrl.defaultDashboard, false);

              if (dashCtrl.defaultDashboard.length == 0) {
                dashCtrl.setDashboard('other');
              } else {
                dashCtrl.setUpSummaryDashboard();
              }
            } else {
              dashCtrl.setDashboard('other');
            }
          }, function (response) {});
        }

        GBDashboardService.newgetAllDashboards(false).then(function (data) {
          dashCtrl.processData(data, initialLoad, false);
        }, function (response) {
          dashCtrl.info.complete = true;
          dashCtrl.loaded = true;
          dashCtrl.gbAlDashboards = [];
          dashCtrl.noDashboardFound = true;
          dashCtrl.setDashboard('other');
        });
      }
    }); //New code logic
  };

  dashCtrl.processData = function (data, initialLoad, isTableau) {
    dashCtrl.workbenchDown = false;
    dashCtrl.currentSelected = 0;
    dashCtrl.showSelectNotify = false;
    dashCtrl.dashgroup = [];
    dashCtrl.allTableauDash = $filter('filter')(data.data.Data.dashboards, {
      'typ': 'Tableau'
    }, false) || [];
    dashCtrl.allInternalDash = $filter('internalDashboards')(data.data.Data.dashboards);
    dashCtrl.allTableauAdmins = data.data.Data.tOwnerList;
    dashCtrl.allLogiAdmins = data.data.Data.lOwnerList;
    dashCtrl.gbAlDashboards = dashCtrl.allTableauDash.concat(dashCtrl.allInternalDash);

    for (i = 0; i < dashCtrl.gbAlDashboards.length; i++) {
      if (dashCtrl.gbAlDashboards[i].typ == "Tableau") {
        dashCtrl.gbAlDashboards[i].dname = dashCtrl.gbAlDashboards[i].name;
        dashCtrl.gbAlDashboards[i].thumbnailImgSrc = GlobalService.getVal('infoserverDomain') + "/" + dashCtrl.gbAlDashboards[i].reports[0].thumbnailImgSrc;
        dashCtrl.gbAlDashboards[i]['type_to_display'] = GlobalService.getVal('userCreatedDashboards');

        for (j = 0; j < dashCtrl.gbAlDashboards[i].reports.length; j++) {
          dashCtrl.gbAlDashboards[i].reports[j].hilighted = false;
          dashCtrl.gbAlDashboards[i].reports[j].url = "/t/" + GBDashboardService.getSiteName() + "/views/" + dashCtrl.gbAlDashboards[i].reports[j].url.replace('/sheets', '');
          dashCtrl.gbAlDashboards[i].reports[j].r_link = dashCtrl.gbAlDashboards[i].reports[j].url;
          dashCtrl.gbAlDashboards[i].reports[j].thumbnailImgSrc = GlobalService.getVal('infoserverDomain') + "/" + dashCtrl.gbAlDashboards[i].reports[j].thumbnailImgSrc;
          dashCtrl.gbAlDashboards[i].reports[j].rname = dashCtrl.gbAlDashboards[i].reports[j].name;
        }
      } else {
        dashCtrl.gbAlDashboards[i].thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path') + "/" + dashCtrl.gbAlDashboards[i].reports[0].thumbnailImgSrc;

        if (dashCtrl.gbAlDashboards[i].dashboardSecurityInfo.owner == "" || dashCtrl.gbAlDashboards[i].dashboardSecurityInfo.owner == null) {
          dashCtrl.gbAlDashboards[i].dashboardSecurityInfo.owner = dashCtrl.gbAlDashboards[i].created_by;
        }

        for (j = 0; j < dashCtrl.gbAlDashboards[i].reports.length; j++) {
          dashCtrl.gbAlDashboards[i].reports[j].hilighted = false;
          dashCtrl.gbAlDashboards[i].reports[j].thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path') + "/" + dashCtrl.gbAlDashboards[i].reports[j].thumbnailImgSrc;
        }

        dashCtrl.gbAlDashboards[i]['type_to_display'] = GlobalService.getVal('internalDashboards');
      }

      dashCtrl.gbAlDashboards[i]['modified_ts_to_display'] = moment(dashCtrl.gbAlDashboards[i]['modified_ts']).format("YYYY-MM-DD HH:MM:SS");
      dashCtrl.gbAlDashboards[i]['created_ts_to_display'] = moment(dashCtrl.gbAlDashboards[i]['created_ts']).format("YYYY-MM-DD HH:MM:SS");
      dashCtrl.gbAlDashboards[i]['visibility'] = dashCtrl.getVisibility(dashCtrl.gbAlDashboards[i]);
      dashCtrl.gbAlDashboards[i]['expand'] = false;
      dashCtrl.gbAlDashboards[i]['selected'] = false;
      dashCtrl.gbAlDashboards[i]['gDOwner'] = dashCtrl.getBookChangedOwnerName(dashCtrl.gbAlDashboards[i]); //Populate Dashboard Group Names

      if (dashCtrl.gbAlDashboards[i].group_type != "NA" && dashCtrl.gbAlDashboards[i].group_type) {
        dashCtrl.dashgroup.push(dashCtrl.gbAlDashboards[i].group_type);
        dashCtrl.dashgroup = dashCtrl.unique(dashCtrl.dashgroup);
      }
    }

    dashCtrl.gbAlDashboards = GBDashboardService.setpermissionsandroles(dashCtrl.gbAlDashboards, true);
    dashCtrl.dashboards = angular.copy(dashCtrl.gbAlDashboards); //using this for pagination

    dashCtrl.gbAlDashboards = dashCtrl.info.applyFilter(dashCtrl.gbAlDashboards, dashCtrl.info.filterObj);

    if (dashCtrl.dashboardType != 'summary' && dashCtrl.dashboardType != 'other') {
      dashCtrl.gbAlDashboards = dashCtrl.gbAlDashboards.filter(function (field) {
        return field.group_type == dashCtrl.dashboardType;
      });
    }

    if (!dashCtrl.gbAlDashboards || !dashCtrl.gbAlDashboards.length || dashCtrl.gbAlDashboards.length == 0) {
      //hide loading modal
      //dashCtrl.setUpSummaryDashboard();
      dashCtrl.info.complete = true;
      dashCtrl.info.loading = false;
      dashCtrl.loaded = true;
      dashCtrl.noDashboardFound = true;
      return;
    }

    dashCtrl.info.pageSize["total"] = dashCtrl.dashboards.length;
    var allDash = dashCtrl.dashboards;

    for (i = 0; i < allDash.length; i++) {
      if (allDash[i].typ == "Tableau") {
        dashCtrl.userCreatedDashCount++;
      } else {
        dashCtrl.internalDashCount++;
      }
    }

    dashCtrl.noDashboardFound = false; //update pagination object
    //dashCtrl.info.pagination = GBDashboardService.pagination;
    //hide loading modal

    dashCtrl.info.sortBy = {
      title: "Last modified",
      sorted: false,
      columnName: "modified_ts"
    };
    dashCtrl.gbAlDashboards = dashCtrl.info.pagination.sortByColumn(dashCtrl.info.sortBy, dashCtrl.gbAlDashboards);
    dashCtrl.gbAlDashboardsFiltered = dashCtrl.gbAlDashboards;
    dashCtrl.info.pagination.init(angular.copy(dashCtrl.gbAlDashboards));
    dashCtrl.gbAlDashboards = dashCtrl.info.pagination.currentRecordsSet;
    dashCtrl.info.loading = false;
    dashCtrl.loaded = true; //move to first page
    //dashCtrl.info.pagination.currentPage = 1;
    //get data soruces
    //set up summary dasboard
    // if(initialLoad){
    //     dashCtrl.setUpSummaryDashboard();
    // }else {
    //     dashCtrl.setUpSummaryDashboard(true);
    // }
    //load dashboard in instance viewer

    dashCtrl.openDashboardInstanceViewerByDefault();
    dashCtrl.groupedData = [];

    if (isTableau) {
      dashCtrl.appendDataSources(true);
    } else {
      dashCtrl.appendDataSources(false);
    }

    dashCtrl.info.complete = true;
  };

  dashCtrl.hardReload(true);

  dashCtrl.reloadData = function (flag) {
    dashCtrl.info.selectedBooks = [];

    if (flag != "fromSearch") {
      dashCtrl.currentSelected = 0;
      dashCtrl.showSelectNotify = false;
      dashCtrl.info.selectAllDashboard = false;
    }

    dashCtrl.userCreatedDashCount = 0;
    dashCtrl.internalDashCount = 0;
    dashCtrl.hideModal();

    for (i = 0; i < dashCtrl.dashboards.length; i++) {
      if (flag != "fromSearch") {
        dashCtrl.dashboards[i].selected = false;
      }

      dashCtrl.dashboards[i]['visibility'] = dashCtrl.getVisibility(dashCtrl.dashboards[i]);
      dashCtrl.dashboards[i]['gDOwner'] = dashCtrl.getBookChangedOwnerName(dashCtrl.dashboards[i]);
    }

    dashCtrl.groupedData = [];
    dashCtrl.dashboards = GBDashboardService.setpermissionsandroles(dashCtrl.dashboards, true);
    dashCtrl.gbAlDashboards = angular.copy(dashCtrl.dashboards);
    dashCtrl.groupedData = GBDashboardService.groupbyColumn(dashCtrl.dashboards);

    for (i = 0; i < dashCtrl.groupedData[0].data.length; i++) {
      for (j = 0; j < dashCtrl.info.quickFilter.length; j++) {
        if (dashCtrl.groupedData[0].data[i].name == dashCtrl.info.quickFilter[j].columnValue && dashCtrl.info.quickFilter[j].selected) {
          dashCtrl.groupedData[0].data[i].selected = true;
          dashCtrl.groupedData[0].appliedFilterFirstItem = dashCtrl.groupedData[0].data[i].name;
          dashCtrl.groupedData[0].appliedFilterCount = 1;
        }
      }
    }

    GBDashboardService.setGroupedData(dashCtrl.groupedData);
    dashCtrl.gbAlDashboards = GBDashboardService.setpermissionsandroles(dashCtrl.gbAlDashboards, true);
    dashCtrl.gbAlDashboards = dashCtrl.info.applyFilter(dashCtrl.gbAlDashboards, dashCtrl.info.filterObj);

    if (dashCtrl.dashboardType != 'summary' && dashCtrl.dashboardType != 'other') {
      dashCtrl.gbAlDashboards = dashCtrl.gbAlDashboards.filter(function (field) {
        return field.group_type == dashCtrl.dashboardType;
      });
    }

    var allDash = dashCtrl.dashboards;

    for (i = 0; i < allDash.length; i++) {
      if (allDash[i].typ == "Tableau") {
        dashCtrl.userCreatedDashCount++;
      } else {
        dashCtrl.internalDashCount++;
      }
    }

    dashCtrl.info.pageSize["total"] = dashCtrl.dashboards.length;
    dashCtrl.noDashboardFound = false;
    dashCtrl.info.sortBy = {
      title: "Last modified",
      sorted: false,
      columnName: "modified_ts"
    };
    dashCtrl.gbAlDashboards = dashCtrl.info.pagination.sortByColumn(dashCtrl.info.sortBy, dashCtrl.gbAlDashboards);
    dashCtrl.gbAlDashboardsFiltered = dashCtrl.gbAlDashboards;
    dashCtrl.info.pagination.init(angular.copy(dashCtrl.gbAlDashboards));
    dashCtrl.gbAlDashboards = dashCtrl.info.pagination.currentRecordsSet;
    dashCtrl.info.loading = false;
    dashCtrl.loaded = true;
    setTimeout(function () {
      dashCtrl.actionMessageFlag = false;
    }, 3000);
  };

  dashCtrl.appendDataSources = function (isTableau) {
    if (isTableau) {
      GBDashboardService.getDashboardDatasourcesList().then(function (response) {
        for (i = 0; i < dashCtrl.dashboards.length; i++) {
          for (j = 0; j < response.data.Data.length; j++) {
            if (dashCtrl.dashboards[i].d_id == response.data.Data[j].d_id) {
              dashCtrl.dashboards[i].datasource = response.data.Data[j].datasource;
            }
          }
        }

        dashCtrl.groupedData = GBDashboardService.groupbyColumn(dashCtrl.dashboards);
        GBDashboardService.setGroupedData(dashCtrl.groupedData);
        dashCtrl.filterLoading = false;
      });
    } else {
      dashCtrl.groupedData = GBDashboardService.groupbyColumn(dashCtrl.dashboards);
      GBDashboardService.setGroupedData(dashCtrl.groupedData);
      dashCtrl.filterLoading = false;
    }
  };

  dashCtrl.getGroupDashLength = function (grp) {
    return dashCtrl.dashboards.filter(function (field) {
      return field.group_type == grp;
    }).length;
  };

  dashCtrl.setUpSummaryDashboard = function (dontoReset) {
    var d_id, match;

    if (dashCtrl.defaultDashboard.length != 0) {
      var roleList = dashCtrl.defaultDashboard[0].role_access.join(",");
      var userInfo = metaDataService.getUser();

      if (!dashCtrl.ifGlassbeamUser() && roleList.indexOf(userInfo['role']) == -1) {
        if (!metaDataService.getFeatures().admin) {
          dashCtrl.defaultDashboard = [];
        }
      }
    }

    if (dashCtrl.defaultDashboard.length && !dontoReset) {
      dashCtrl.setDashboard('summary');
      instances = InstanceHandler.getInstances();
    } else {
      dashCtrl.setDashboard('other');
    } //if you have only summary dashboard and no other dashboards
    //  if (!dashCtrl.gbAlDashboards && dashCtrl.dashboardType == 'summary') {
    //     if (d_id && d_id != dashCtrl.defaultDashboard.reports[0].r_id) {
    //         //dashCtrl.info.complete = true;
    //         ErrorService.setError('dashboards', GlobalService.getVal('dashboard_not_found'));
    //         dashCtrl.r_link = "";
    //         dashCtrl.r_name = "";
    //     } else {
    //         dashCtrl.r_link = dashCtrl.defaultDashboard.reports[0].r_link;
    //         dashCtrl.r_name = dashCtrl.defaultDashboard.reports[0].rname;
    //         dashCtrl.height = dashCtrl.defaultDashboard.reports[0].height;
    //         dashCtrl.d_name = dashCtrl.defaultDashboard.dname;
    //         //dashCtrl.info.complete = true;
    //     }
    //     // Logging default loading of dashboards activity.
    //     dashCtrl.logActivity(dashCtrl.dashboardType == 'summary' ? 'Summary Dashboard' : 'Other Dashboards', 'Default Load', '{\'' + dashCtrl.r_name + '\'}');
    // } else {
    //     if (dashCtrl.dashboardType == 'summary' && dashCtrl.defaultDashboard.length == 1) {
    //         dashCtrl.logActivity('Summary Dashboard', 'Default Load', '{\'' + dashCtrl.defaultDashboard[0].reports[0].rname + '\'}');
    //     }
    //     if (d_id) {
    //         for (i in dashCtrl.gbAlDashboards) {
    //             for (j in dashCtrl.gbAlDashboards[i].reports) {
    //                 if (dashCtrl.gbAlDashboards[i].reports[j].r_id == d_id) {
    //                     match = dashCtrl.gbAlDashboards[i].reports[j];
    //                     break;
    //                 }
    //             }
    //         }
    //         if (match) {
    //             dashCtrl.addInstance(match);
    //         } else {
    //             ErrorService.setError('dashboards', GlobalService.getVal('dashboard_not_found'));
    //         }
    //     }
    //    //dashCtrl.info.complete = true;
    // }
    //if we have tableau dashboard as summary dashboard


    if (dashCtrl.defaultDashboard.length > 0) {
      var works = dashCtrl.dashboards;

      if (dashCtrl.defaultDashboard[0].typ == "Tableau") {
        dashCtrl.loadTableauSummary(dashCtrl.defaultDashboard[0], dashCtrl.defaultDashboard[0].reports[0].r_id);
      }
    }
  };

  dashCtrl.openDashboardInstanceViewerByDefault = function () {
    var d_id, match;
    var data = GBDashboardService.getAllDashboardsWithoutFilter();

    if (data.length != 0 && sessionStorage.getItem("dash_mode") == "true") {
      var foundFlag = false;
      var didList = localStorage.getItem("did").split(',');
      var ridList = localStorage.getItem("rid").split(',');

      for (i = 0; i < didList.length; i++) {
        var tempRid = ridList[i];
        var tempDid = didList[i];

        for (j = 0; j < didList.length; j++) {
          if (tempRid == ridList[j] && i != j && tempDid == didList[j]) {
            didList.splice(j, 1);
            j--;
          }
        }
      }

      var foundDid = [];
      var foundRid = [];
      var works = data;
      dashCtrl.setDashboard('other');

      for (i = 0; i < works.length; i++) {
        if (works[i]["dname"]) {
          for (k = 0; k < didList.length; k++) {
            if (didList[k] == works[i].d_id) {
              for (j = 0; j < works[i].reports.length; j++) {
                if (works[i].reports[j].r_id == ridList[k]) {
                  foundDid.push(didList[k]);
                  foundRid.push(ridList[k]);
                  didList.splice(k, 1);
                  ridList.splice(k, 1);

                  if (dashCtrl.showDashBoard(works[i], "dashLevel")) {
                    var DirRep = works[i].reports[j];

                    if (sessionStorage.getItem("rdreport")) {
                      var re = new RegExp("([?&])rdReport=.*?(&|$)", "i");
                      var separator = DirRep.r_link.indexOf('?') !== -1 ? "&" : "?";
                      DirRep.r_link = DirRep.r_link.replace(re, "$1rdReport=" + sessionStorage.getItem("rdreport") + '$2');
                    }

                    if (works[i]['d_type'] != "Tableau") {
                      dashCtrl.openDashboardIninstanceViewerOnloadOfPage(DirRep);
                    } else {
                      dashCtrl.addTabInstance(DirRep);
                    }

                    dashCtrl.logActivity(dashCtrl.dashboardType == 'summary' ? 'Summary Dashboard' : 'Other Dashboards', 'InstanceViewer', '{\'' + DirRep.rname + '\'}');

                    if (didList.length == 0) {
                      foundFlag = true;
                      sessionStorage.setItem("dash_mode", "false");
                    }

                    document.getElementById("gb-full-page-loader").style.display = 'none';
                    break;
                  } else {
                    if (didList.length == 0) {
                      foundFlag = true;
                    }

                    sessionStorage.setItem("dash_mode", "false");
                    dashCtrl.info.dashModeErrorMsg = GlobalService.getVal("dashModePermissionError");
                    ModalService.alertBox({
                      msg: dashCtrl.info.dashModeErrorMsg
                    });
                  }
                }
              }
            }
          }
        }
      }

      for (i = 0; i < didList.length; i++) {
        if (dashCtrl.defaultDashboard[0]) {
          if (didList[i] == dashCtrl.defaultDashboard[0].d_id && ridList[i] == dashCtrl.defaultDashboard[0].reports[0].r_id) {
            foundDid.push(didList[i]);
            foundRid.push(ridList[i]);
            didList.splice(i, 1);
            ridList.splice(i, 1);
            i--;
            var DirRep = dashCtrl.defaultDashboard[0].reports[0];
            dashCtrl.openDashboardIninstanceViewerOnloadOfPage(DirRep);
            dashCtrl.logActivity(dashCtrl.dashboardType == 'summary' ? 'Summary Dashboard' : 'Other Dashboards', 'InstanceViewer', '{\'' + DirRep.rname + '\'}');

            if (didList == 0) {
              sessionStorage.setItem("dash_mode", "false");
              foundFlag = true;
            }

            document.getElementById("gb-full-page-loader").style.display = 'none';
          }
        }
      }

      if (!foundFlag) {
        sessionStorage.setItem("dash_mode", "false");
        dashCtrl.info.dashModeErrorMsg = GlobalService.getVal("dashModeError");
        ModalService.alertBox({
          msg: dashCtrl.info.dashModeErrorMsg
        });
      }

      localStorage.setItem("did", foundDid.toString());
      localStorage.setItem("rid", foundRid.toString());
    }
  };

  dashCtrl.getQuickFilterDisable = function (data) {
    if (dashCtrl.filterLoading) {
      return true;
    }

    if (data.title == "Internal" && dashCtrl.internalDashCount == 0 || data.title == "User Created" && dashCtrl.userCreatedDashCount == 0) {
      return true;
    } else {
      return false;
    }
  };

  dashCtrl.reloadDashboards = function (reloadPagination) {
    dashCtrl.info.loading = true;
    GBDashboardService.reloadDashboard(dashCtrl.info.filterObj, dashCtrl.info.sortBy, dashCtrl.info.query, reloadPagination, dashCtrl.info.pageSize["count"]).then(function (data) {
      dashCtrl.gbAlDashboards = data;
      dashCtrl.dashboards = data;

      if (!data || !data.length || data.length == 0) {
        //hide loading modal
        dashCtrl.info.loading = false;
        dashCtrl.info.pagination = null;
        dashCtrl.noDashboardFound = true;
        return;
      }

      dashCtrl.noDashboardFound = false; // update group data

      var newGroupedData = GBDashboardService.getGroupedData();
      dashCtrl.updateColumnGroups(newGroupedData); //hide loading modal

      dashCtrl.info.loading = false; // get data soruces

      dashCtrl.info.datasource = GBDashboardService.getDataSources(); //reset selection, unchech all checkboxes

      dashCtrl.info.selectAllDashboard = false; // if its hard reload the update/rest pagination and default dashboard

      if (reloadPagination) {
        dashCtrl.info.pagination = GBDashboardService.pagination; // get summary dashboards

        dashCtrl.defaultDashboard = GBDashboardService.getSummaryDashboard(); //set up summary dasboard

        dashCtrl.setUpSummaryDashboard(true);
      }

      dashCtrl.info.loading = false;
    }, function (response) {
      dashCtrl.info.complete = true;
      dashCtrl.info.loading = false;
      dashCtrl.noDashboardFound = true;
      dashCtrl.gbAlDashboards = [];
      dashCtrl.setDashboard('other');
    });
  };

  dashCtrl.updateColumnGroups = function (newGroupedData) {
    newGroupedData.map(function (newFilterItem) {
      var newItem = true;

      for (var i = 0; i < dashCtrl.groupedData.length; i++) {
        if (newFilterItem.columnName == dashCtrl.groupedData[i]['columnName']) {
          newItem = false;
          var newData = newFilterItem.data;
          var oldData = dashCtrl.groupedData[i]['data'];

          if (Array.isArray(newData)) {
            newData.map(function (dItem) {
              for (var k = 0; k < oldData.length; k++) {
                if (oldData[k].name == dItem.name && oldData[k].selected) {
                  dItem.selected = oldData[k].selected;
                }
              }
            });
          } //update with count "0" which is not part of new data


          if (oldData.length > newData.length) {
            oldData.forEach(function (oldDataItem) {
              var found = false;
              newData.forEach(function (newDataItem) {
                if (oldDataItem.name === newDataItem.name) {
                  found = true;
                }
              });

              if (!found) {
                newData.push(oldDataItem);
              }
            });
          }

          dashCtrl.groupedData[i]['data'] = newData;
        }
      }

      if (newItem) {
        dashCtrl.groupedData.push(newFilterItem);
      }
    }); //
  };

  dashCtrl.getSortedFilteredPaginatedData = function () {
    dashCtrl.gbAlDashboards = dashCtrl.info.applyFilter(dashCtrl.dashboards, dashCtrl.info.filterObj);

    if (dashCtrl.dashboardType != 'summary' && dashCtrl.dashboardType != 'other') {
      dashCtrl.gbAlDashboards = dashCtrl.gbAlDashboards.filter(function (field) {
        return field.group_type == dashCtrl.dashboardType;
      });
    }

    dashCtrl.gbAlDashboards = dashCtrl.info.pagination.sortByColumn(dashCtrl.info.sortBy, dashCtrl.gbAlDashboards);
    dashCtrl.gbAlDashboardsFiltered = dashCtrl.gbAlDashboards;
    dashCtrl.info.pagination.init(angular.copy(dashCtrl.gbAlDashboards)); //dashCtrl.groupedData = GBDashboardService.getGroupedData();

    var tmpGroupedData = GBDashboardService.groupbyColumn(dashCtrl.gbAlDashboards);
    dashCtrl.gbAlDashboards = dashCtrl.info.pagination.currentRecordsSet;

    var updateData = function updateData(targetList, newList) {
      var found = false;
      targetList.forEach(function (item) {
        found = false;
        newList.forEach(function (newItem) {
          if (item.name === newItem.name) {
            found = true;
            item.count = newItem.count;
            item.disabled = false;
          }
        });

        if (!found) {
          item.disabled = true;
          item.count = 0; //item.selected = false;
        }
      });
    };

    dashCtrl.groupedData.forEach(function (item) {
      tmpGroupedData.forEach(function (newItem) {
        if (!item.lastUpdatedFilter) {
          if (item.columnName == newItem.columnName) {
            updateData(item.data, newItem.data);
          }
        }
      });
    });
  };

  dashCtrl.changePages = function () {
    dashCtrl.gbAlDashboards = dashCtrl.info.changePage(dashCtrl.info.filterObj, dashCtrl.info.sortBy, dashCtrl.info.query);
  };

  dashCtrl.changePageSize = function () {
    dashCtrl.gbAlDashboards = dashCtrl.info.changePageSize(dashCtrl.info.filterObj, dashCtrl.info.sortBy, dashCtrl.info.pagination.pageSize);
  };

  dashCtrl.updateDataFilter = function (actualColumn, columnValue, selected, multiselect, actualData, filterColumn) {
    dashCtrl.filterLoading = false;
    var filterList = []; // if user select "TYPE" as ""User created dashboards""
    // Delect all data from "datasource"
    // collapse data sources list

    if (actualColumn === 'type_to_display' && columnValue === "Internal dashboards") {
      dashCtrl.groupedData.map(function (item) {
        if (item.columnName === "datasource") {
          item.data.map(function (selectedItem) {
            selectedItem.selected = false;
          });
        }
      });
    }

    var getSelectedValues = function getSelectedValues(list) {
      var tmp = [],
          tmpKeys;

      if (Array.isArray(list)) {
        list.map(function (item) {
          if (item.selected) tmp.push(item.name);
        });
        return tmp;
      }

      return [];
    }; //for singl select


    if (!multiselect && selected) {
      if (Array.isArray(actualData)) {
        actualData.map(function (item) {
          if (columnValue === item.name) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
      }
    } //make filterObj


    dashCtrl.groupedData.map(function (item) {
      if (getSelectedValues(item.data).length) {
        filterList.push({
          'columnName': item.columnName,
          'columnValue': getSelectedValues(item.data)
        });
        item['appliedFilterCount'] = getSelectedValues(item.data).length;
        item['appliedFilterFirstItem'] = getSelectedValues(item.data)[0];
      } else {
        item['appliedFilterCount'] = 0;
        item['appliedFilterFirstItem'] = "";
      }
    });

    if (!filterList.length) {
      dashCtrl.clearLocalFilter();
      return;
    }

    dashCtrl.info.filterObj = filterList; //mark last selected filter

    dashCtrl.groupedData.map(function (item) {
      if (item.columnName === filterColumn.columnName) {
        item.lastUpdatedFilter = true;
      } else {
        item.lastUpdatedFilter = false;
      }
    });
    dashCtrl.logActivity('Other Dashboards', 'local filter', columnValue);
    dashCtrl.getSortedFilteredPaginatedData(); //update quick filter

    if (actualColumn === "type_to_display") {
      dashCtrl.info.quickFilter.map(function (item) {
        if (item.columnValue === columnValue) {
          item.selected = selected;
        } else {
          item.selected = false;
        }
      });

      if (!selected) {
        dashCtrl.info.quickFilter.map(function (item) {
          if (item.title == 'All') {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
      }
    }
  };

  dashCtrl.getClearFilterDisable = function () {
    if (dashCtrl.info.filterObj.length) {
      return false;
    }

    if (dashCtrl.info.query.length == 0) {
      return true;
    }

    return false;
  };

  dashCtrl.clearLocalFilter = function () {
    dashCtrl.info.query = "";
    dashCtrl.groupedData.map(function (item) {
      item['appliedFilterCount'] = 0;
      item['appliedFilterFirstItem'] = "";
      item['expand'] = false;
      item['lastUpdatedFilter'] = false;

      if (Array.isArray(item.data)) {
        item.data.map(function (item) {
          item.selected = false;
        });
      } else {
        for (var key in item.data) {
          item.data[key]['selected'] = false;
        }
      }
    });
    dashCtrl.info.filterObj = [];
    dashCtrl.resetQuickFilter();
    dashCtrl.getSortedFilteredPaginatedData();
  };

  dashCtrl.enableBulkEdit = function () {
    var dashList = dashCtrl.dashboards;
    var countInternal = 0;
    var countUserCreated = 0;

    for (i = 0; i < dashList.length; i++) {
      if (dashList[i].selected) {
        if (dashList[i].type_to_display == GlobalService.getVal("internalDashboards")) {
          countInternal++;
        } else {
          countUserCreated++;
        }
      }
    }

    for (i = 0; i < dashCtrl.info.quickFilter.length; i++) {
      if (dashCtrl.info.quickFilter[i].selected) {
        if (dashCtrl.info.quickFilter[i].columnValue == GlobalService.getVal("internalDashboards") && countInternal > 0) {
          return false;
        } else if (dashCtrl.info.quickFilter[i].columnValue == GlobalService.getVal("userCreatedDashboards") && countUserCreated > 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  };

  dashCtrl.getBulkVisDisablity = function () {
    var dashList = dashCtrl.gbAlDashboards;
    var count = 0;
    var flag = false;

    for (i = 0; i < dashList.length; i++) {
      if (dashList[i].selected) {
        if (dashList[i].d_type == "Summary") {
          flag = true;
        }
      }
    }

    return flag;
  };

  dashCtrl.getBulkEditTitle = function () {
    var dashList = dashCtrl.dashboards;
    var countInternal = 0;
    var countUserCreated = 0;

    for (i = 0; i < dashList.length; i++) {
      if (dashList[i].selected) {
        if (dashList[i].type_to_display == GlobalService.getVal("internalDashboards")) {
          countInternal++;
        } else {
          countUserCreated++;
        }
      }
    }

    for (i = 0; i < dashCtrl.info.quickFilter.length; i++) {
      if (dashCtrl.info.quickFilter[i].selected) {
        if (dashCtrl.info.quickFilter[i].columnValue == "*") {
          return GlobalService.getVal("quickDashFilterTitleBulkEdit");
        } else {
          if (dashCtrl.info.quickFilter[i].columnValue == GlobalService.getVal("internalDashboards") && countInternal > 0) {
            return "Edit " + countInternal + " dashboards";
          } else if (dashCtrl.info.quickFilter[i].columnValue == GlobalService.getVal("userCreatedDashboards") && countUserCreated > 0) {
            return "Edit " + countUserCreated + " dashboards";
          } else {
            return GlobalService.getVal("NoMultiSelectTitleBulkEdit");
          }
        }
      }
    }
  };

  dashCtrl.getBulkEditText = function () {
    var dashList = dashCtrl.gbAlDashboards;
    var count = 0;

    for (i = 0; i < dashList.length; i++) {
      if (dashList[i].selected) {
        count++;
      }
    }

    for (i = 0; i < dashCtrl.info.quickFilter.length; i++) {
      if (dashCtrl.info.quickFilter[i].selected) {
        if (dashCtrl.info.quickFilter[i].columnValue == "*") {
          return "Bulk Edit";
        } else {
          if (count >= 2) {
            return "Edit " + count + " dashboards";
          } else {
            return "Bulk Edit";
          }
        }
      }
    }
  };

  dashCtrl.bulkEditDash = function () {
    $scope.modalInstance = ModalService.openModal("partials/dashboards/bulk_edit_dash.html", $scope, "gb-dash-bulk-edit-modal", true, 'static');
    dashCtrl.bulkOwnerEmail = GlobalService.getVal("BulkOwnerDropElement");
    dashCtrl.bulkVisibility = dashCtrl.BulkVisibilityDropElement[0].name;
  };

  dashCtrl.getBulkOwnerList = function () {
    for (i = 0; i < dashCtrl.info.quickFilter.length; i++) {
      if (dashCtrl.info.quickFilter[i].selected) {
        var type = dashCtrl.info.quickFilter[i].columnValue;
      }
    }

    if (type == "*") {
      return;
    }

    if (type == GlobalService.getVal('internalDashboards')) {
      var owner = dashCtrl.allLogiAdmins;
    } else {
      var owner = dashCtrl.allTableauAdmins;
    }

    return owner;
  };

  dashCtrl.bulkEditApply = function () {
    dashCtrl.info.loading = true;

    for (i = 0; i < dashCtrl.info.quickFilter.length; i++) {
      if (dashCtrl.info.quickFilter[i].selected) {
        var type = dashCtrl.info.quickFilter[i].columnValue;
      }
    }

    var dashList = dashCtrl.dashboards;
    var dashListSelected = [];
    var tempObj = {};
    var tempArray = [];

    for (i = 0; i < dashList.length; i++) {
      if (type == GlobalService.getVal('internalDashboards')) {
        if (dashList[i].selected && dashList[i].type_to_display == GlobalService.getVal("internalDashboards")) {
          dashListSelected.push(dashList[i]);
        }
      } else {
        if (dashList[i].selected && dashList[i].type_to_display == GlobalService.getVal("userCreatedDashboards")) {
          dashListSelected.push(dashList[i]);
        }
      }
    }

    for (j = 0; j < dashListSelected.length; j++) {
      for (i = 0; i < dashListSelected[j].reports.length; i++) {
        tempObj = {};
        tempObj.did = dashListSelected[j].d_id;
        tempObj.rids = dashListSelected[j].reports[i].r_id;
        tempArray.push(tempObj);
      }
    }

    for (i = 0; i < dashCtrl.info.quickFilter.length; i++) {
      if (dashCtrl.info.quickFilter[i].selected) {
        var typ = dashCtrl.info.quickFilter[i].columnValue;
      }
    }

    if (dashCtrl.bulkOwnerEmail != GlobalService.getVal("BulkOwnerDropElement")) {
      if (typ == GlobalService.getVal('userCreatedDashboards')) {
        var newOwnerId = "";
        var userIdArray = [];
        var ownerJson = JSON.parse(dashCtrl.bulkOwnerEmail);
        var newOwner = ownerJson.email;
        var site_id = GBDashboardService.getSiteId();
        var un = metaDataService.getUserEmail();

        for (i = 0; i < dashListSelected.length; i++) {
          userIdArray.push(dashListSelected[i].ownerId);
        }

        GBDashboardService.getUsersAPI().then(function (response) {
          var users = x2js.xml_str2json(response.data)['tsResponse']['users']['user'];

          if (Array.isArray(users)) {
            for (var i in users) {
              if (users[i]['_name'] == newOwner) {
                newOwnerId = users[i]['_id'];
              }
            }
          } else {
            ModalService.alertBox({
              msg: dashCtrl.changeOwnerErrorMsg
            });
          }

          var param = {
            ownership: {
              drids: tempArray,
              owner: ownerJson.email,
              role: ownerJson.role,
              isTableau: true,
              siteId: site_id,
              userId: userIdArray,
              userName: un,
              newOwnerId: newOwnerId
            }
          };
          Dashboards.updateOwner(param).then(function (response) {
            dashCtrl.logActivity('Other Dashboards', 'Change Owner for multiple dashboard', '{\'' + tempArray + '\'}');
            var dateToUpdate = new Date();

            if (response.data.Msg.search("ERROR") >= 0) {
              ModalService.alertBox({
                msg: dashCtrl.changeOwnerErrorMsg
              });
            } else {
              dashCtrl.filterLoading = false;

              for (i = 0; i < dashCtrl.dashboards.length; i++) {
                for (j = 0; j < dashListSelected.length; j++) {
                  if (dashCtrl.dashboards[i].d_id == dashListSelected[j].d_id) {
                    dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
                    dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
                    dashCtrl.dashboards[i].dashboardSecurityInfo.owner = JSON.parse(dashCtrl.bulkOwnerEmail).email;

                    if (dashCtrl.dashboards[i].role_access.indexOf(JSON.parse(dashCtrl.bulkOwnerEmail).role) == -1) {
                      dashCtrl.dashboards[i].role_access.push(JSON.parse(dashCtrl.bulkOwnerEmail).role);
                    }
                  }
                }
              }

              $scope.modalInstance.close();
              dashCtrl.actionMessage = "Updated " + dashListSelected.length + " dashboards.";
              dashCtrl.actionMessageFlag = true;
              $scope.showFilterPanel = false;
              dashCtrl.reloadData();
            }
          }, function (error) {
            ModalService.alertBox({
              msg: dashCtrl.changeOwnerErrorMsg
            });
          });
        });
      } else {
        var ownerJson = JSON.parse(dashCtrl.bulkOwnerEmail);
        var param = {
          ownership: {
            drids: tempArray,
            owner: ownerJson.email,
            role: ownerJson.role,
            isTableau: false
          }
        };
        Dashboards.updateOwner(param).then(function (response) {
          dashCtrl.logActivity('Other Dashboards', 'Change Owner for multiple dashboard', '{\'' + tempArray + '\'}');
          var dateToUpdate = new Date();

          for (i = 0; i < dashCtrl.dashboards.length; i++) {
            for (j = 0; j < dashListSelected.length; j++) {
              if (dashCtrl.dashboards[i].d_id == dashListSelected[j].d_id) {
                dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
                dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
                dashCtrl.dashboards[i].dashboardSecurityInfo.owner = JSON.parse(dashCtrl.bulkOwnerEmail).email;

                if (dashCtrl.dashboards[i].role_access.indexOf(JSON.parse(dashCtrl.bulkOwnerEmail).role) == -1) {
                  dashCtrl.dashboards[i].role_access.push(JSON.parse(dashCtrl.bulkOwnerEmail).role);
                }
              }
            }
          }

          dashCtrl.filterLoading = false;
          $scope.modalInstance.close();
          dashCtrl.actionMessage = "Updated " + dashListSelected.length + " dashboards.";
          dashCtrl.actionMessageFlag = true;
          $scope.showFilterPanel = false;
          dashCtrl.reloadData();
        }, function (response) {});
      }
    }

    if (dashCtrl.bulkVisibility != dashCtrl.BulkVisibilityDropElement[0].name) {
      if (typ == GlobalService.getVal('userCreatedDashboards')) {
        var param = {
          visibility: {
            drids: tempArray,
            isPublic: JSON.parse(dashCtrl.bulkVisibility),
            isTableau: true,
            siteId: site_id,
            userId: "",
            userName: un
          }
        };
      } else {
        var param = {
          visibility: {
            drids: tempArray,
            isPublic: JSON.parse(dashCtrl.bulkVisibility),
            isTableau: false
          }
        };
      }

      Dashboards.changeVisibility(param).then(function (response) {
        dashCtrl.logActivity('Other Dashboards', 'Change Visibility multiple dashboard', '{\'' + tempArray + '\'}');
        var dateToUpdate = new Date();
        dashCtrl.filterLoading = false;

        for (i = 0; i < dashCtrl.dashboards.length; i++) {
          for (j = 0; j < dashListSelected.length; j++) {
            if (dashCtrl.dashboards[i].d_id == dashListSelected[j].d_id) {
              dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
              dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
              dashCtrl.dashboards[i].visibility = JSON.parse(dashCtrl.bulkVisibility);
              dashCtrl.dashboards[i].dashboardSecurityInfo.is_public = JSON.parse(dashCtrl.bulkVisibility);

              if (dashCtrl.bulkOwnerEmail != GlobalService.getVal("BulkOwnerDropElement")) {
                if (dashCtrl.dashboards[i].role_access.indexOf(JSON.parse(dashCtrl.bulkOwnerEmail).role) == -1) {
                  dashCtrl.dashboards[i].role_access.push(JSON.parse(dashCtrl.bulkOwnerEmail).role);
                }
              }
            }
          }
        }

        dashCtrl.actionMessage = "Updated " + dashListSelected.length + " dashboards.";
        dashCtrl.actionMessageFlag = true;
        $scope.modalInstance.close();
        $scope.showFilterPanel = false;
        dashCtrl.reloadData();
      }, function (response) {});
    } else {}
  };

  dashCtrl.applyQuickFilter = function (btn) {
    if (btn.selected) return;
    var multiselect, actualData;
    btn.selected = !btn.selected;
    multiselect = false;
    actualData = {
      "User created dashboards": {
        "count": 11,
        "selected": false
      },
      "Internal dashboards": {
        "count": 7,
        "selected": false
      }
    };
    dashCtrl.info.quickFilter.map(function (item) {
      if (btn.title != item.title) {
        item.selected = false;
      }
    }); //update filter group object

    var selectedFilterItem = null;
    dashCtrl.groupedData.map(function (item) {
      if (item.columnName === btn.columnName) {
        selectedFilterItem = item;

        for (var key in item.data) {
          if (item.data[key]['name'] === btn.columnValue) {
            item.data[key]['selected'] = true;
          } else {
            item.data[key]['selected'] = false;
          }
        }
      }
    });
    dashCtrl.updateDataFilter(btn.columnName, btn.columnValue, btn.selected, multiselect, actualData, selectedFilterItem);
  };

  dashCtrl.resetQuickFilter = function () {
    dashCtrl.info.quickFilter.map(function (item) {
      if (item.title == 'All') {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
  };

  dashCtrl.columnSorting = function (column) {
    for (var i = 0; i < dashCtrl.info.columns.length; i++) {
      if (dashCtrl.info.columns[i]['title'] != column['title']) {
        dashCtrl.info.columns[i]['sorted'] = false;
      }
    }

    column.sorted = !column.sorted;
    dashCtrl.info.sortBy = column;
    dashCtrl.changePages();
  };

  dashCtrl.serachDashboardsAndTags = function () {
    dashCtrl.reloadData("fromSearch");
  };

  dashCtrl.closeModal = function () {
    dashCtrl.resetModal();
    $scope.modalInstance.close();
  };

  dashCtrl.expandField = function (index, type, field) {
    if (type == "ext") {
      var id = "dashRowExt" + index;
    } else {
      var id = "dashRowInt" + index;
    }

    if (field == "role") {
      $(".gbDashboardTable #" + id + " td.dRolesNew").css("white-space", "inherit");
      $(".gbDashboardTable #" + id + " td.dRolesNew .shrinkAllLink").show();
      $(".gbDashboardTable #" + id + " td.dRolesNew .showAllLink").hide();
    } else {
      $(".gbDashboardTable #" + id + " td.dTagNew").css("white-space", "inherit");
      $(".gbDashboardTable #" + id + " td.dTagNew .shrinkAllLink").show();
      $(".gbDashboardTable #" + id + " td.dTagNew .showAllLink").hide();
    }
  };

  dashCtrl.shrinkField = function (index, type, field) {
    if (type == "ext") {
      var id = "dashRowExt" + index;
    } else {
      var id = "dashRowInt" + index;
    }

    if (field == "role") {
      $(".gbDashboardTable #" + id + " td.dRolesNew").css("white-space", "nowrap");
      $(".gbDashboardTable #" + id + " td.dRolesNew .shrinkAllLink").hide();
      $(".gbDashboardTable #" + id + " td.dRolesNew .showAllLink").show();
    } else {
      $(".gbDashboardTable #" + id + " td.dTagNew").css("white-space", "nowrap");
      $(".gbDashboardTable #" + id + " td.dTagNew .shrinkAllLink").hide();
      $(".gbDashboardTable #" + id + " td.dTagNew .showAllLink").show();
    }
  };

  dashCtrl.resetModal = function () {
    dashCtrl.scheduleFreq.enabled = false;
    dashCtrl.scheduleFreq.error = false;
    dashCtrl.scheduleFreq.name = "hourly";
    dashCtrl.scheduleFreq.scheduler_recipients = "";
    dashCtrl.scheduleFreq.hrintvSele = "1";
    dashCtrl.scheduleFreq.weekDaySele = "1";
    dashCtrl.scheduleFreq.monthDay = "Sunday";
    dashCtrl.scheduleFreq.yearDay = "Sunday";
    dashCtrl.scheduleFreq.YearMonth = "Jan";
    dashCtrl.scheduleFreq.scheduler_time.hr = "HH";
    dashCtrl.scheduleFreq.scheduler_time.min = "MM";
  };

  dashCtrl.setSummaryDashConf = function (book, index) {
    if (book.reports[index].d_type == "Summary") {
      return;
    }

    $scope.setSummaryDashData = book;
    $scope.setSummaryDashIndex = index;
    $scope.modal1 = ModalService.openModal('partials/dashboard_summary_conf.html', $scope, false, true);
  };

  dashCtrl.setSummaryDash = function () {
    var book = $scope.setSummaryDashData;
    var index = $scope.setSummaryDashIndex;
    dashCtrl.loaded = false;

    if (book.dname) {
      var d_id = book.d_id;
      var r_id = book.reports[index].r_id;
    }

    Dashboards.setSummaryDash(d_id, r_id).then(function (response) {
      dashCtrl.info.loading = true;
      dashCtrl.info.complete = false;
      dashCtrl.actionMessage = response.data.Msg;
      dashCtrl.actionMessageFlag = true;
      dashCtrl.defaultDashboard = [];
      document.getElementById('gb-summary-dashboard-iframe').setAttribute('src', 'about:blank');
      document.getElementById('tableauSummaryDash').setAttribute('src', 'about:blank');
      dashCtrl.hardReload(true);
    });
  };

  dashCtrl.openScheduling = function (book, index) {
    dashCtrl.scheduleFreq.SelectedDays = [];
    $scope.selectedIndex = index;
    dashCtrl.bookItem = book;

    if (dashCtrl.bookItem.typ != "Tableau") {
      dashCtrl.scheduleItem = dashCtrl.bookItem.reports[index];
      var d_id = dashCtrl.bookItem.d_id;
      var r_id = dashCtrl.scheduleItem.r_id;
    } else {
      dashCtrl.scheduleItem = dashCtrl.bookItem.reports[index];
      var d_id = dashCtrl.bookItem.d_id;
      var r_id = dashCtrl.scheduleItem.r_id;
    }

    if (!dashCtrl.scheduleItem.scheduler_enabled) {
      Dashboards.getSchedulingData(d_id, r_id).then(function (response) {
        dashCtrl.scheduleItem.export_format = response.data.Data.export_format;

        if (dashCtrl.bookItem.typ != "Tableau") {
          var supportedFileType = dashCtrl.bookItem.reports[index].supported_export_format;
          var defaultFileType = dashCtrl.scheduleItem.export_format;
        } else {
          if (dashCtrl.scheduleItem.export_format) {
            var defaultFileType = dashCtrl.scheduleItem.export_format;
          }
        }

        for (var k = 0; k < dashCtrl.logiExportFormat.length; k++) {
          dashCtrl.logiExportFormat[k].enabled = false;
        }

        dashCtrl.scheduleExportFileTypeCurrentVariable = '';
        dashCtrl.exporFormatCount = 0; // var supportedFileType = book['supported_export_format'];
        // var supportedFileType = 'pdf,csv';
        // var defaultFileType = book['export_format'];
        //var defaultFileType = 'csv';

        $scope.modalInstance = ModalService.openModal('partials/dashboards/schedulingpopup.html', $scope);

        if (dashCtrl.bookItem.typ != "Tableau") {
          //logi dashboards
          if (supportedFileType != 'NA' && supportedFileType != '' && supportedFileType != undefined && supportedFileType != null) {
            dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            supportedFileType = supportedFileType.split(",");

            for (var i = 0; i < supportedFileType.length; i++) {
              for (var k = 0; k < dashCtrl.logiExportFormat.length; k++) {
                if (supportedFileType[i] == dashCtrl.logiExportFormat[k].name) {
                  dashCtrl.logiExportFormat[k].enabled = true;
                }
              }
            } // find out count of true values


            dashCtrl.exporFormatCount = dashCtrl.logiExportFormat.filter(function (s) {
              return s.enabled;
            }).length; //Refined array sent to ui

            dashCtrl.scheduleExportFileTypes = dashCtrl.logiExportFormat; //for export format if undefined... then set pdf as default

            if (defaultFileType == 'NA' || defaultFileType == '' || defaultFileType == null || defaultFileType == undefined) {
              dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            } //export format is backend response
            else {
                if (supportedFileType.indexOf(defaultFileType) != -1) {
                  dashCtrl.scheduleExportFileTypeCurrentVariable = defaultFileType;
                } else {
                  dashCtrl.scheduleExportFileTypeCurrentVariable = '';
                }
              }
          } //If supported type is null or no response from backend then show  default array
          else {
              dashCtrl.scheduleExportFileTypes = dashCtrl.logiExportFormat;
              dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            }
        } else {
          //tableau dashboards
          dashCtrl.scheduleExportFileTypes = dashCtrl.tableauExportFormat; //for export format

          if (defaultFileType == 'NA' || defaultFileType == '' || defaultFileType == null || defaultFileType == undefined) {
            dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            dashCtrl.tableauCurrentVariable = '';
          } else {
            dashCtrl.scheduleExportFileTypeCurrentVariable = defaultFileType;
            dashCtrl.tableauCurrentVariable = defaultFileType;
          }
        }
      }, function (response) {
        if (dashCtrl.bookItem.typ != "Tableau") {
          var supportedFileType = dashCtrl.bookItem.reports[index].supported_export_format;
          var defaultFileType = dashCtrl.scheduleItem.export_format;
        } else {
          if (dashCtrl.scheduleItem.export_format) {
            var defaultFileType = dashCtrl.scheduleItem.export_format;
          }
        }

        for (var k = 0; k < dashCtrl.logiExportFormat.length; k++) {
          dashCtrl.logiExportFormat[k].enabled = false;
        }

        dashCtrl.scheduleExportFileTypeCurrentVariable = ''; // var supportedFileType = book['supported_export_format'];
        // var supportedFileType = 'pdf,csv';
        // var defaultFileType = book['export_format'];
        //var defaultFileType = 'csv';

        $scope.modalInstance = ModalService.openModal('partials/dashboards/schedulingpopup.html', $scope);

        if (dashCtrl.bookItem.typ != "Tableau") {
          //logi dashboards
          if (supportedFileType != 'NA' && supportedFileType != '' && supportedFileType != undefined && supportedFileType != null) {
            dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            supportedFileType = supportedFileType.split(",");

            for (var i = 0; i < supportedFileType.length; i++) {
              for (var k = 0; k < dashCtrl.logiExportFormat.length; k++) {
                if (supportedFileType[i] == dashCtrl.logiExportFormat[k].name) {
                  dashCtrl.logiExportFormat[k].enabled = true;
                }
              }
            } // find out count of true values


            dashCtrl.exporFormatCount = dashCtrl.logiExportFormat.filter(function (s) {
              return s.enabled;
            }).length; //Refined array sent to ui

            dashCtrl.scheduleExportFileTypes = dashCtrl.logiExportFormat; //for export format if undefined... then set pdf as default

            if (defaultFileType == 'NA' || defaultFileType == '' || defaultFileType == null || defaultFileType == undefined) {
              dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            } //export format is backend response
            else {
                if (supportedFileType.indexOf(defaultFileType) != -1) {
                  dashCtrl.scheduleExportFileTypeCurrentVariable = defaultFileType;
                } else {
                  dashCtrl.scheduleExportFileTypeCurrentVariable = '';
                }
              }
          } //If supported type is null or no response from backend then show  default array
          else {
              dashCtrl.scheduleExportFileTypes = dashCtrl.logiExportFormat;
              dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            }
        } else {
          //tableau dashboards
          dashCtrl.scheduleExportFileTypes = dashCtrl.tableauExportFormat; //for export format

          if (defaultFileType == 'NA' || defaultFileType == '' || defaultFileType == null || defaultFileType == undefined) {
            dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            dashCtrl.tableauCurrentVariable = '';
          } else {
            dashCtrl.scheduleExportFileTypeCurrentVariable = defaultFileType;
            dashCtrl.tableauCurrentVariable = defaultFileType;
          }
        }
      }); //if a dashboard is not scheduled then this part is executed
      //Array reset
    } else {
      //if a dashboard is already scheduled then this part is executed
      Dashboards.getSchedulingData(d_id, r_id).then(function (response) {
        //Export format logic 
        dashCtrl.scheduleItem.export_format = response.data.Data.export_format; //Array reset

        for (var k = 0; k < dashCtrl.logiExportFormat.length; k++) {
          dashCtrl.logiExportFormat[k].enabled = false;
        }

        dashCtrl.scheduleExportFileTypeCurrentVariable = ''; //Backend  response variables
        //var supportedFileType = book['supported_export_format'];
        //var supportedFileType = 'pdf,csv';
        //var defaultFileType = book['export_format'];
        //var defaultFileType = response.data.Data.export_format;
        //var defaultFileType = 'csv';
        //tableau dashboard

        if (dashCtrl.bookItem.typ != "Tableau") {
          var supportedFileType = dashCtrl.bookItem.reports[index].supported_export_format;
          var defaultFileType = dashCtrl.scheduleItem.export_format;
        } else {
          var defaultFileType = dashCtrl.scheduleItem.export_format;
        }

        if (response.data.Data.is_tableau_reprt) {
          dashCtrl.scheduleExportFileTypes = dashCtrl.tableauExportFormat; //for export format

          if (defaultFileType == 'NA' || defaultFileType == '' || defaultFileType == null || defaultFileType == undefined) {
            dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            dashCtrl.tableauCurrentVariable = '';
          } else {
            dashCtrl.scheduleExportFileTypeCurrentVariable = defaultFileType;
            dashCtrl.tableauCurrentVariable = defaultFileType;
          }
        } else {
          //logi dashboards
          if (supportedFileType != 'NA' && supportedFileType != '' && supportedFileType != undefined && supportedFileType != null) {
            dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            supportedFileType = supportedFileType.split(",");

            for (var i = 0; i < supportedFileType.length; i++) {
              for (var k = 0; k < dashCtrl.logiExportFormat.length; k++) {
                if (supportedFileType[i] == dashCtrl.logiExportFormat[k].name) {
                  dashCtrl.logiExportFormat[k].enabled = true;
                }
              }
            } // find out count of true values


            dashCtrl.exporFormatCount = dashCtrl.logiExportFormat.filter(function (s) {
              return s.enabled;
            }).length; //Refined array sent to ui

            dashCtrl.scheduleExportFileTypes = dashCtrl.logiExportFormat; //for export format if undefined... then set pdf as default

            if (defaultFileType == 'NA' || defaultFileType == '' || defaultFileType == null || defaultFileType == undefined) {
              dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            } //export format is backend response
            else {
                if (supportedFileType.indexOf(defaultFileType) != -1) {
                  dashCtrl.scheduleExportFileTypeCurrentVariable = defaultFileType;
                } else {
                  dashCtrl.scheduleExportFileTypeCurrentVariable = '';
                }
              }
          } //If supported type is null or no response from backend then show  default array
          else {
              dashCtrl.scheduleExportFileTypes = dashCtrl.logiExportFormat;
              dashCtrl.scheduleExportFileTypeCurrentVariable = '';
            }
        } // END Export format logic 


        dashCtrl.scheduleFreq.enabled = true;
        dashCtrl.scheduleFreq.frequency = response.data.Data.scheduler_freq;
        dashCtrl.scheduleFreq.scheduler_recipients = response.data.Data.scheduler_recipients;
        dashCtrl.scheduleFreq.name = dashCtrl.scheduleItem.scheduler_period;
        dashCtrl.scheduleFreq.scheduler_time.hr = dashCtrl.scheduleItem.scheduler_time.split(":")[0];
        dashCtrl.scheduleFreq.scheduler_time.min = dashCtrl.scheduleItem.scheduler_time.split(":")[1];

        if (dashCtrl.scheduleFreq.name == "weekly") {
          var tempDays = dashCtrl.scheduleItem.scheduler_freq.substring(5).split(",");

          for (i = 0; i < tempDays.length; i++) {
            tempDays[i] = tempDays[i].charAt(0).toUpperCase() + tempDays[i].slice(1);
            ;
          }

          dashCtrl.scheduleFreq.SelectedDays = tempDays;
        } else if (dashCtrl.scheduleFreq.name == "monthly") {
          for (k = 0; k < dashCtrl.scheduleFreq.weekDay.length; k++) {
            if (dashCtrl.scheduleFreq.weekDay[k].key == response.data.Data.scheduler_freq.split(":")[1].substring(4)) {
              dashCtrl.scheduleFreq.weekDaySele = dashCtrl.scheduleFreq.weekDay[k].key;
            }
          }

          dashCtrl.scheduleFreq.monthDay = response.data.Data.scheduler_freq.split(":")[0].substring(5).charAt(0).toUpperCase() + response.data.Data.scheduler_freq.split(":")[0].substring(5).slice(1);
          dashCtrl.scheduleFreq.yearDay = "Sunday";
        } else if (dashCtrl.scheduleFreq.name == "yearly") {
          for (k = 0; k < dashCtrl.scheduleFreq.weekDay.length; k++) {
            if (dashCtrl.scheduleFreq.weekDay[k].key == response.data.Data.scheduler_freq.split(":")[2].substring(4)) {
              dashCtrl.scheduleFreq.weekDaySele = dashCtrl.scheduleFreq.weekDay[k].key;
            }
          }

          dashCtrl.scheduleFreq.YearMonth = response.data.Data.scheduler_freq.split(":")[0].substring(6).charAt(0).toUpperCase() + response.data.Data.scheduler_freq.split(":")[0].substring(6).slice(1);
          dashCtrl.scheduleFreq.yearDay = response.data.Data.scheduler_freq.split(":")[1].substring(5).charAt(0).toUpperCase() + response.data.Data.scheduler_freq.split(":")[1].substring(5).slice(1);
        } else if (dashCtrl.scheduleFreq.name == "hourly") {
          dashCtrl.scheduleFreq.hrintvSele = dashCtrl.scheduleFreq.frequency.slice(5);
        }

        $scope.modalInstance = ModalService.openModal('partials/dashboards/schedulingpopup.html', $scope);
      });
    }
  };

  dashCtrl.doneScheduling = function (mode) {
    dashCtrl.info.loading = true;
    var param = {};
    var timeRegex = /^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$/g;
    var emailRegex = /^(?:[\w\d\.\-]+@[\w\d\.\-]+\s*,\s*)*(?:[\w\d\.\-]+@[\w\d\.\-]+)?$/g;

    if (mode) {
      if (dashCtrl.scheduleFreq.scheduler_recipients == "" || !emailRegex.test(dashCtrl.scheduleFreq.scheduler_recipients)) {
        dashCtrl.scheduleError = GlobalService.getVal("noEmailError");
        dashCtrl.scheduleFreq.error = true;
        dashCtrl.info.loading = false;
        return;
      } else if (dashCtrl.scheduleFreq.scheduler_time.hr == "HH" || dashCtrl.scheduleFreq.scheduler_time.min == "MM") {
        dashCtrl.scheduleError = GlobalService.getVal("timeSchError");
        dashCtrl.scheduleFreq.error = true;
        dashCtrl.info.loading = false;
        return;
      } else if (dashCtrl.bookItem.typ != "Tableau") {
        if (dashCtrl.scheduleExportFileTypeCurrentVariable == '' && dashCtrl.exporFormatCount > 0) {
          dashCtrl.scheduleError = GlobalService.getVal("noExportFormatError");
          dashCtrl.scheduleFreq.error = true;
          dashCtrl.info.loading = false;
          return;
        } else if (dashCtrl.scheduleExportFileTypeCurrentVariable == '' && dashCtrl.exporFormatCount == 0) {
          dashCtrl.scheduleError = GlobalService.getVal("reportNotConfigured");
          dashCtrl.scheduleFreq.error = true;
          dashCtrl.info.loading = false;
          return;
        }
      } else if (dashCtrl.scheduleExportFileTypeCurrentVariable == '') {
        dashCtrl.scheduleError = GlobalService.getVal("noExportFormatError");
        dashCtrl.scheduleFreq.error = true;
        dashCtrl.info.loading = false;
        return;
      }
    }

    var d_id = dashCtrl.bookItem.d_id;
    var r_id = dashCtrl.scheduleItem.r_id;

    if (dashCtrl.scheduleFreq.name == "hourly") {
      param = {
        "d_id": d_id,
        "r_id": r_id,
        "scheduler_period": dashCtrl.scheduleFreq.name,
        "scheduler_time": dashCtrl.scheduleFreq.scheduler_time.hr + ":" + dashCtrl.scheduleFreq.scheduler_time.min,
        "scheduler_recipients": dashCtrl.scheduleFreq.scheduler_recipients,
        "scheduler_enabled": mode,
        "scheduler_freq": "hour-" + dashCtrl.scheduleFreq.hrintvSele,
        "scheduler_timezone": dashCtrl.scheduleFreq.scheduler_timeZone,
        "tableau_wb_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.bookItem.name,
        "site_id": GBDashboardService.getSiteId(),
        "wb_sheet_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.name,
        "content_sheet_url": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.url,
        "is_tableau_reprt": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? false : true
      };
    } else if (dashCtrl.scheduleFreq.name == "daily") {
      param = {
        "d_id": d_id,
        "r_id": r_id,
        "scheduler_period": dashCtrl.scheduleFreq.name,
        "scheduler_time": dashCtrl.scheduleFreq.scheduler_time.hr + ":" + dashCtrl.scheduleFreq.scheduler_time.min,
        "scheduler_recipients": dashCtrl.scheduleFreq.scheduler_recipients,
        "scheduler_enabled": mode,
        "scheduler_freq": "days-monday,tuesday,wednesday,thursday,friday,saturday,sunday",
        "scheduler_timezone": dashCtrl.scheduleFreq.scheduler_timeZone,
        "tableau_wb_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.bookItem.name,
        "site_id": GBDashboardService.getSiteId(),
        "wb_sheet_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.name,
        "content_sheet_url": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.url,
        "is_tableau_reprt": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? false : true
      };
    } else if (dashCtrl.scheduleFreq.name == "weekly") {
      if (dashCtrl.scheduleFreq.SelectedDays.length == 0) {
        dashCtrl.scheduleError = GlobalService.getVal("weekError");
        dashCtrl.scheduleFreq.error = true;
        dashCtrl.info.loading = false;
        return;
      } else {
        param = {
          "d_id": d_id,
          "r_id": r_id,
          "scheduler_period": dashCtrl.scheduleFreq.name,
          "scheduler_time": dashCtrl.scheduleFreq.scheduler_time.hr + ":" + dashCtrl.scheduleFreq.scheduler_time.min,
          "scheduler_recipients": dashCtrl.scheduleFreq.scheduler_recipients,
          "scheduler_enabled": mode,
          "scheduler_freq": "days-" + dashCtrl.scheduleFreq.SelectedDays.toString().toLowerCase(),
          "scheduler_timezone": dashCtrl.scheduleFreq.scheduler_timeZone,
          "tableau_wb_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.bookItem.name,
          "site_id": GBDashboardService.getSiteId(),
          "wb_sheet_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.name,
          "content_sheet_url": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.url,
          "is_tableau_reprt": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? false : true
        };
      }
    } else if (dashCtrl.scheduleFreq.name == "monthly") {
      param = {
        "d_id": d_id,
        "r_id": r_id,
        "scheduler_period": dashCtrl.scheduleFreq.name,
        "scheduler_time": dashCtrl.scheduleFreq.scheduler_time.hr + ":" + dashCtrl.scheduleFreq.scheduler_time.min,
        "scheduler_recipients": dashCtrl.scheduleFreq.scheduler_recipients,
        "scheduler_enabled": mode,
        "scheduler_freq": "day-" + dashCtrl.scheduleFreq.weekDaySele + ":days-" + dashCtrl.scheduleFreq.monthDay.toLowerCase(),
        "scheduler_timezone": dashCtrl.scheduleFreq.scheduler_timeZone,
        "tableau_wb_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.bookItem.name,
        "site_id": GBDashboardService.getSiteId(),
        "wb_sheet_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.name,
        "content_sheet_url": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.url,
        "is_tableau_reprt": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? false : true
      };
    } else if (dashCtrl.scheduleFreq.name == "yearly") {
      param = {
        "d_id": d_id,
        "r_id": r_id,
        "scheduler_period": dashCtrl.scheduleFreq.name,
        "scheduler_time": dashCtrl.scheduleFreq.scheduler_time.hr + ":" + dashCtrl.scheduleFreq.scheduler_time.min,
        "scheduler_recipients": dashCtrl.scheduleFreq.scheduler_recipients,
        "scheduler_enabled": mode,
        "scheduler_freq": "day-" + dashCtrl.scheduleFreq.weekDaySele + ":days-" + dashCtrl.scheduleFreq.yearDay.toLowerCase() + ":month-" + dashCtrl.scheduleFreq.YearMonth.toLowerCase(),
        "scheduler_timezone": dashCtrl.scheduleFreq.scheduler_timeZone,
        "tableau_wb_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.bookItem.name,
        "site_id": GBDashboardService.getSiteId(),
        "wb_sheet_name": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.name,
        "content_sheet_url": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? "" : dashCtrl.scheduleItem.url,
        "is_tableau_reprt": dashCtrl.bookItem.typ == "Internal" || dashCtrl.bookItem.typ == "Summary" ? false : true
      };
    } //param...for type of download


    param.export_format = dashCtrl.scheduleExportFileTypeCurrentVariable;
    dashCtrl.apiUpdateScheduling(param);
  };

  dashCtrl.apiUpdateScheduling = function (param) {
    Dashboards.updateSceduling(param).then(function (response) {
      dashCtrl.info.loading = true;
      dashCtrl.bookItem.visibility = !dashCtrl.bookItem.visibility;
      dashCtrl.changeVisibility(dashCtrl.bookItem, true);
      dashCtrl.bookItem.visibility = !dashCtrl.bookItem.visibility;
      dashCtrl.info.loading = false;
      dashCtrl.closeModal();

      if (param.scheduler_enabled) {
        dashCtrl.actionMessage = response.data.Msg;
      } else {
        dashCtrl.actionMessage = "Dashboard Report unscheduled successfully";
      }

      dashCtrl.actionMessageFlag = true;
      dashCtrl.hardReload();
    }, function (response) {});
  };

  dashCtrl.changeVisibility = function (book, updateMessage) {
    if (book["typ"] == "Tableau") {
      var site_id = GBDashboardService.getSiteId();
      var un = metaDataService.getUserEmail();
      dashCtrl.info.loading = true;
      var tempArray = [];
      var tempObj = {};

      for (i = 0; i < book.reports.length; i++) {
        tempObj.did = book.d_id;
        tempObj.rids = book.reports[i].r_id;
        tempArray.push(tempObj);
      }

      book.visibility = !book.visibility;
      var param = {
        visibility: {
          drids: tempArray,
          isPublic: book.visibility,
          isTableau: true,
          siteId: site_id,
          userId: book.ownerId,
          userName: un
        }
      };
      Dashboards.changeVisibility(param).then(function (response) {
        dashCtrl.logActivity('Other Dashboards', 'Change Visibility', '{\'' + book["name"] + '\'}');
        dashCtrl.info.loading = false;
        var dateToUpdate = new Date();

        for (i = 0; i < dashCtrl.dashboards.length; i++) {
          if (dashCtrl.dashboards[i].d_id == book.d_id) {
            dashCtrl.dashboards[i].visibility = book.visibility;
            dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
            dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
            dashCtrl.dashboards[i].dashboardSecurityInfo.is_public = book.visibility;

            if (!updateMessage) {
              dashCtrl.actionMessage = response.data.Msg;
              dashCtrl.actionMessageFlag = true;
            }

            dashCtrl.reloadData();
          }
        }
      }, function (response) {});
    } else {
      dashCtrl.info.loading = true;
      var tempArray = [];
      var tempObj = {};

      for (i = 0; i < book.reports.length; i++) {
        tempObj.did = book.d_id;
        tempObj.rids = book.reports[i].r_id;
        tempArray.push(tempObj);
      }

      book.visibility = !book.visibility;
      var param = {
        visibility: {
          drids: tempArray,
          isPublic: book.visibility,
          isTableau: false
        }
      };
      Dashboards.changeVisibility(param).then(function (response) {
        dashCtrl.info.loading = false;
        dashCtrl.logActivity('Other Dashboards', 'Change Visibility', '{\'' + book["dname"] + '\'}');
        var dateToUpdate = new Date();

        for (i = 0; i < dashCtrl.dashboards.length; i++) {
          if (dashCtrl.dashboards[i].d_id == book.d_id) {
            dashCtrl.dashboards[i].visibility = book.visibility;
            dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
            dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
            dashCtrl.dashboards[i].dashboardSecurityInfo.is_public = book.visibility;

            if (!updateMessage) {
              dashCtrl.actionMessage = response.data.Msg;
              dashCtrl.actionMessageFlag = true;
            }

            dashCtrl.reloadData();
            break;
          }
        }
      }, function (response) {});
    }
  };

  dashCtrl.updateOwnerConf = function (user, book) {
    // $scope.ownerConfMsg = "Do you want to change ownership to "+user.email;
    $scope.ownerName = user.email;
    $scope.userUpdate = user;
    $scope.bookUpdate = book;
    $scope.modal1 = ModalService.openModal('partials/dashboard_owner_conf.html', $scope, false, true);
  };

  dashCtrl.addRoleConf = function () {
    var roleArray = [];

    for (i = 0; i < dashCtrl.roles.length; i++) {
      if (dashCtrl.roles[i].selected) {
        roleArray.push(dashCtrl.roles[i].name);
      }
    }

    $scope.roles = roleArray.length;
    ; // $scope.addRoleConfMsg = "Do you want to add "+roles+" roles to selected dashboards?";

    $scope.modal1 = ModalService.openModal('partials/dashboard_add_role_conf.html', $scope, false, true);
  };

  dashCtrl.removeRoleConf = function (book) {
    $scope.roleEditBook = book;
    var roleNameArray = []; // $scope.removeRoleConfMsg = "Do you want to remove '"+role.name+"' role?";

    for (i = 0; i < book.role_access_dis.length; i++) {
      if (book.role_access_dis[i].selected) {
        roleNameArray.push(book.role_access_dis[i].name);
      }
    }

    $scope.roleName = roleNameArray.length;
    $scope.modal1 = ModalService.openModal('partials/dashboard_remove_role_conf.html', $scope, false, true);
  };

  dashCtrl.copyLink = function (book, index) {
    var landingPage = getCookie("landingPageUrl");
    landingPage = landingPage.slice(0, landingPage.indexOf("#"));
    var linkToCopy = landingPage + "#?dash_mode=true&did=" + book.d_id + "&rid=" + book.reports[index].r_id;
    var copyElement = document.createElement("span");
    copyElement.appendChild(document.createTextNode(linkToCopy));
    copyElement.id = 'tempCopyToClipboard';
    $("body").append(copyElement);
    var range = document.createRange();
    range.selectNode(copyElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    copyElement.remove();
    dashCtrl.copiedLink = linkToCopy;
    $(".copyMsg").show();
    setTimeout(function () {
      $(".copyMsg").hide();
    }, 3000);
  };

  dashCtrl.emailLink = function (book, index) {
    var landingPage = getCookie("landingPageUrl");
    landingPage = landingPage.slice(0, landingPage.indexOf("#"));
    var linkToCopy = landingPage + "#?dash_mode=true%26did=" + book.d_id + "%26rid=" + book.reports[index].r_id;
    var subject = GlobalService.getVal("emailLinkSub") + book.reports[index].rname;
    var message = GlobalService.getVal("emailLinkMsg") + "<a href='" + linkToCopy + "'>" + book.reports[index].rname + "</a></b>" + GlobalService.getVal("emailLinkFooter");
    $window.open("mailto:?subject=" + subject + "&body=" + message, "_self");
  };

  dashCtrl.updateOwner = function (user, book) {
    dashCtrl.info.loading = true;

    if (book["typ"] === "Tableau") {
      var tempArray = [];
      var tempObj = {};
      var newOwnerId = "";
      var newOwner = user.email;
      var site_id = GBDashboardService.getSiteId();
      var un = metaDataService.getUserEmail();

      for (i = 0; i < book.reports.length; i++) {
        tempObj.did = book.d_id;
        tempObj.rids = book.reports[i].r_id;
        tempArray.push(tempObj);
      }

      GBDashboardService.getUsersAPI().then(function (response) {
        var users = x2js.xml_str2json(response.data)['tsResponse']['users']['user'];

        if (Array.isArray(users)) {
          for (var i in users) {
            if (users[i]['_name'] == newOwner) {
              newOwnerId = users[i]['_id'];
            }
          }
        } else {
          ModalService.alertBox({
            msg: dashCtrl.changeOwnerErrorMsg
          });
        }

        var param = {
          ownership: {
            drids: tempArray,
            owner: user.email,
            role: user.role,
            isTableau: true,
            siteId: site_id,
            userId: [book.ownerId],
            userName: un,
            newOwnerId: newOwnerId
          }
        };
        Dashboards.updateOwner(param).then(function (response) {
          dashCtrl.logActivity('Other Dashboards', 'Change Owner', '{\'' + book["name"] + '\'}');
          dashCtrl.actionMessage = response.data.Msg;
          dashCtrl.actionMessageFlag = true;
          var dateToUpdate = new Date();

          if (response.data.Msg.search("ERROR") >= 0) {
            ModalService.alertBox({
              msg: dashCtrl.changeOwnerErrorMsg
            });
            dashCtrl.info.loading = false;
          } else {
            for (i = 0; i < dashCtrl.dashboards.length; i++) {
              if (dashCtrl.dashboards[i].d_id == book.d_id) {
                dashCtrl.dashboards[i].dashboardSecurityInfo.owner = user.email;
                dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
                dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
                dashCtrl.dashboards[i].role_access_dis = [];

                if (dashCtrl.dashboards[i].role_access.indexOf(user.role) == -1) {
                  dashCtrl.dashboards[i].role_access.push(user.role);
                }
              }
            }

            dashCtrl.info.loading = false;
            dashCtrl.clearLocalFilter();
            $scope.showFilterPanel = false;
            dashCtrl.reloadData();
          }
        }, function (error) {
          ModalService.alertBox({
            msg: dashCtrl.changeOwnerErrorMsg
          });
        });
      });
    } else {
      var tempArray = [];
      var tempObj = {};

      for (i = 0; i < book.reports.length; i++) {
        tempObj.did = book.d_id;
        tempObj.rids = book.reports[i].r_id;
        tempArray.push(tempObj);
      }

      var param = {
        ownership: {
          drids: tempArray,
          owner: user.email,
          role: user.role,
          isTableau: false
        }
      };
      Dashboards.updateOwner(param).then(function (response) {
        dashCtrl.logActivity('Other Dashboards', 'Change Owner', '{\'' + book["dname"] + '\'}');
        var dateToUpdate = new Date();

        for (i = 0; i < dashCtrl.dashboards.length; i++) {
          if (dashCtrl.dashboards[i].d_id == book.d_id) {
            dashCtrl.dashboards[i].dashboardSecurityInfo.owner = user.email;
            dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
            dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
            dashCtrl.dashboards[i].role_access_dis = [];

            if (dashCtrl.dashboards[i].role_access.indexOf(user.role) == -1) {
              dashCtrl.dashboards[i].role_access.push(user.role);
            }
          }
        }

        dashCtrl.info.loading = false;
        dashCtrl.actionMessage = response.data.Msg;
        dashCtrl.actionMessageFlag = true;
        dashCtrl.clearLocalFilter();
        $scope.showFilterPanel = false;
        dashCtrl.reloadData();
      }, function (response) {});
    }
  };

  dashCtrl.toggleSelection = function (item) {
    var idx = dashCtrl.scheduleFreq.SelectedDays.indexOf(item);

    if (idx > -1) {
      dashCtrl.scheduleFreq.SelectedDays.splice(idx, 1);
    } else {
      dashCtrl.scheduleFreq.SelectedDays.push(item);
    }
  }; // In case of system error, it doesn't wait to show error messages


  if (ErrorService.getErrors('gbApp').length) {
    dashCtrl.info.complete = true;
  } // Check whether a given feature is enabled or not


  dashCtrl.isFeatureEnable = function (feature) {
    return GlobalService.getVal('features')[feature];
  };

  dashCtrl.ifGlassbeamUser = function () {
    var userOrg = metaDataService.getUserOrgType();
    var gbOrg = GlobalService.getVal('gbUserOrgType');

    if (userOrg == gbOrg) {
      return true;
    } else {
      return false;
    }
  }; // check whether the user is workbench user for demo/poc customer


  dashCtrl.ifWbDemoUser = function () {
    var userOrg = metaDataService.getUserOrgType();
    var wbOrg = GlobalService.getVal('wbUserOrgType');
    var demo_realms = GlobalService.getVal('gb_demo_apps_realms');

    for (var i = 0; i < demo_realms.length; i++) {
      if (GlobalService.getVal('role_details').mps_uidomain[demo_realms[i]] == $location.host()) {
        if (userOrg == wbOrg) {
          return true;
        }
      }
    }

    return false;
  };

  dashCtrl.isSubscribed = function (content) {
    var subscription = $filter('filter')(WorkbenchService.getSubscriptionsList(), {
      'content': {
        '_id': content.id
      }
    }) || [];
    return subscription.length >= 1;
  };

  dashCtrl.getWorkbenchApiRootDir = function (content) {
    if (dashCtrl.info.workbenchApiRootDir == "" || !dashCtrl.info.workbenchApiRootDir) {
      dashCtrl.info.workbenchApiRootDir = GBDashboardService.getWorkbenchApiRoot();
    }

    return dashCtrl.info.workbenchApiRootDir;
  };

  dashCtrl.getSheetThumbnailImage = function (workbook, sheet) {
    if (!workbook || workbook == "") return "";
    dashCtrl.getWorkbenchApiRootDir();
    var imgUrl = "";
    var workbookId = "";
    var sheetId = ""; //for internal dashboard

    if (workbook["d_type"] != "Tableau") {
      workbookId = workbook["d_id"];
      return GlobalService.getVal('dashboard_img_logi_path') + '/' + workbookId + '.png';
    } else if (workbook["id"]) {
      workbookId = workbook["id"];
    } //for user created dashboards


    if (sheet) {
      if (workbook["d_id"]) {
        sheetId = sheet["r_id"];
      } else if (workbook["id"]) {
        sheetId = sheet["id"];
      }

      imgUrl = dashCtrl.info.workbenchApiRootDir + '/' + workbookId + '/' + sheetId;
    } else {
      //For workbook
      //Get if is of the first sheet of a dashboard
      var list = [];

      if (workbook["d_id"] && workbook["reports"]) {
        list = workbook["reports"];
        sheetId = list[0]["r_id"];
      } // if(workbook["id"] && workbook["views"]) {
      //     list = workbook["views"];
      //     sheetId  = list[0]["id"];
      // }

    }

    imgUrl = dashCtrl.info.workbenchApiRootDir + '/' + workbookId + '/' + sheetId;
    return imgUrl;
  };

  function getSubscription(content) {
    return $filter('filter')(WorkbenchService.getSubscriptionsList(), {
      'content': {
        '_id': content.id
      }
    }) || [];
  } // XHR to get the dashboards.


  UserTrackingService.getAllConfig().then(function (response) {
    dashCtrl.info.tempSchFlag = response.data.Data.config.dashboard_scheduling;
  });
  Dashboards.getRoles().then(function (response) {
    var data = response.data.Data;

    for (i = 0; i < data.length; i++) {
      if (data[i] != "") {
        var tempObj = {};
        var testArray = data[i].split('_');

        if (testArray.length > 3) {
          tempObj.name = testArray.splice(3, 3).join('_');
        } else {
          tempObj.name = data[i];
        }

        tempObj.realName = data[i];
        tempObj.selected = false;
        dashCtrl.roles.push(tempObj);
      }
    }
  });

  dashCtrl.getSummaryFlag = function (book) {
    var flag = false;

    for (i = 0; i < book.reports.length; i++) {
      if (book.reports[i].d_type == "Summary") {
        flag = true;
      }
    }

    return flag;
  };

  dashCtrl.getExpandedRowId = function (book, parentIndex, index) {
    if (book.typ == "Tableau") {
      return "dashRowExt" + parentIndex + "_report" + index;
    } else {
      return "dashRowInt" + parentIndex + "_report" + index;
    }
  };

  dashCtrl.getRowId = function (book, index) {
    if (book.typ == "Tableau") {
      return "dashRowExt" + index;
    } else {
      return "dashRowInt" + index;
    }
  };

  dashCtrl.loadTableauSummary = function (dashboard, r_id) {
    console.log(dashboard);

    if (dashCtrl.info.isTableauConfigured) {
      GBDashboardService.getTrustedAuthKey().then(function (response) {
        var token = response.data.Data;
        var tempView = angular.copy(dashboard);
        var reportIndex;
        dashboard.reports.map(function (report, index) {
          if (report.r_id === r_id) {
            reportIndex = index;
          }
        });
        var placeholderDiv = document.getElementById("tableauSummaryDash");
        var options = {
          width: '100%',
          height: '100%',
          hideTabs: true,
          hideToolbar: true,
          toolbarPosition: 'top',
          onFirstInteractive: function onFirstInteractive() {}
        };
        dashCtrl.tableauSummaryName = tempView.name;
        var url = GBDashboardService.getTableauDomain() + '/trusted/' + token + tempView.reports[reportIndex]['url'];
        console.log(url);

        if ($scope.viz) {
          $scope.viz.dispose();
        }

        setTimeout(function () {
          $scope.viz = new tableau.Viz(placeholderDiv, url, options);
        }, 1500);
      });
    }
  }; //RAJA API - 2
  // Dashboards.getSecurityToken().then(function (response) {
  //     dashCtrl.info.securityToken = response.data.Data;
  //     //RAJA API - 3
  //     Dashboards.allDetails().then(function (response) {
  //         var request_page, i, j, d_id, epoch, serial, match = false;
  //         dashCtrl.dashboards = $filter('internalDashboards')(response.data.Data);
  //         dashCtrl.tableauDashboards = $filter('filter')(response.data.Data, { 'd_type': 'Tableau' }, false) || [];
  //         dashCtrl.defaultDashboard = $filter('filter')(response.data.Data, { 'd_type': 'Summary' }, true) || [];
  //         if (dashCtrl.defaultDashboard.length != 0) {
  //             var roleList = dashCtrl.defaultDashboard[0].role_access.join(",");
  //             var userInfo = metaDataService.getUser();
  //             if (roleList.indexOf(userInfo['role']) == -1 && !dashCtrl.ifGlassbeamUser()) {
  //                 dashCtrl.defaultDashboard = [];
  //             }
  //         }
  //         //dashCtrl.dashboards.push(dashCtrl.defaultDashboard[0]);
  //         if (dashCtrl.dashboardSecurity && dashCtrl.info.securityToken === "") {
  //             dashCtrl.defaultDashboard[0].reports[0].r_link = $location.protocol() + "://" + $location.host() + GlobalService.getVal('dashboardErrorPage');
  //         } else if (dashCtrl.dashboardSecurity && dashCtrl.info.securityToken !== "") {
  //             dashCtrl.defaultDashboard[0].reports[0].r_link = dashCtrl.defaultDashboard[0].reports[0].r_link + "&rdSecureKey=" + dashCtrl.info.securityToken;
  //         }
  //         dashCtrl.info.complete = true;
  //         if (dashCtrl.defaultDashboard.length) {
  //             dashCtrl.setDashboard('summary');
  //         } else {
  //             dashCtrl.setDashboard('other');
  //         }
  //         if (!Array.isArray(dashCtrl.dashboards)) {
  //             dashCtrl.dashboards = [];
  //         }
  //         if (dashCtrl.dashboards && dashCtrl.dashboards.length == 1 && dashCtrl.dashboards[0].reports.length == 1 && dashCtrl.dashboardType == 'summary') {
  //             if (d_id && d_id != dashCtrl.dashboards[0].reports[0].r_id) {
  //                 dashCtrl.info.complete = true;
  //                 ErrorService.setError('dashboards', GlobalService.getVal('dashboard_not_found'));
  //                 dashCtrl.r_link = "";
  //                 dashCtrl.r_name = "";
  //             } else {
  //                 dashCtrl.r_link = dashCtrl.dashboards[0].reports[0].r_link;
  //                 dashCtrl.r_name = dashCtrl.dashboards[0].reports[0].rname;
  //                 dashCtrl.height = dashCtrl.dashboards[0].reports[0].height;
  //                 dashCtrl.d_name = dashCtrl.dashboards[0].dname;
  //                 $timeout(function () {
  //                     dashCtrl.info.complete = true;
  //                 }, 5000);
  //             }
  //             // Logging default loading of dashboards activity.
  //             dashCtrl.logActivity(dashCtrl.dashboardType == 'summary' ? 'Summary Dashboard' : 'Other Dashboards', 'Default Load', '{\'' + dashCtrl.r_name + '\'}');
  //         } else {
  //             if (dashCtrl.dashboardType == 'summary' && dashCtrl.defaultDashboard.length == 1) {
  //                 dashCtrl.logActivity('Summary Dashboard', 'Default Load', '{\'' + dashCtrl.defaultDashboard[0].reports[0].rname + '\'}');
  //             }
  //             if (d_id) {
  //                 for (i in dashCtrl.dashboards) {
  //                     for (j in dashCtrl.dashboards[i].reports) {
  //                         if (dashCtrl.dashboards[i].reports[j].r_id == d_id) {
  //                             match = dashCtrl.dashboards[i].reports[j];
  //                             break;
  //                         }
  //                     }
  //                 }
  //                 if (match) {
  //                     dashCtrl.addInstance(match);
  //                 } else {
  //                     ErrorService.setError('dashboards', GlobalService.getVal('dashboard_not_found'));
  //                 }
  //             }
  //             dashCtrl.info.complete = true;
  //         }
  //     }, function (response) {
  //         dashCtrl.info.complete = true;
  //         dashCtrl.dashboards.length = 0;
  //         dashCtrl.setDashboard('other');
  //         dashCtrl.dashboards = [];
  //     });
  // });


  dashCtrl.getAllDeatils = function () {
    dashCtrl.info.loading = true;
    dashCtrl.reloadDashboards(true); //RAJA - > call service to update dashboard; getfresh copy
    // XHR to get the dashboards.
    // Dashboards.getSecurityToken().then(function (response) {
    //     dashCtrl.info.securityToken = response.data.Data;
    //     Dashboards.allDetails().then(function (response) {
    //         var request_page, i, j, d_id, epoch, serial, match = false;
    //         dashCtrl.dashboards = $filter('internalDashboards')(response.data.Data);
    //         dashCtrl.tableauDashboards = $filter('filter')(response.data.Data, { 'd_type': 'Tableau' }, false) || [];
    //         dashCtrl.defaultDashboard = $filter('filter')(response.data.Data, { 'd_type': 'Summary' }, true) || [];
    //         //dashCtrl.dashboards.push(dashCtrl.defaultDashboard[0]);
    //         dashCtrl.info.loading = false;
    //         if (dashCtrl.dashboardSecurity && dashCtrl.info.securityToken === "") {
    //             dashCtrl.defaultDashboard[0].reports[0].r_link = $location.protocol() + "://" + $location.host() + GlobalService.getVal('dashboardErrorPage');
    //         } else if (dashCtrl.dashboardSecurity && dashCtrl.info.securityToken !== "") {
    //             dashCtrl.defaultDashboard[0].reports[0].r_link = dashCtrl.defaultDashboard[0].reports[0].r_link + "&rdSecureKey=" + dashCtrl.info.securityToken;
    //         }
    //     }, function (response) {
    //         dashCtrl.dashboards.length = 0;
    //         dashCtrl.dashboards = [];
    //         dashCtrl.info.loading = false;
    //     });
    // }, function (response) {
    //     dashCtrl.dashboards.length = 0;
    //     dashCtrl.dashboards = [];
    //     dashCtrl.info.loading = false;
    // });
  };

  $window.loadingDone = function () {
    dashCtrl.info.loadCount++;
    $timeout(function () {
      dashCtrl.loaded = true;
      if (angular.element('#content-loader')) angular.element('#content-loader').addClass("gb-hide");
      if (angular.element('#dashboard-iframe-div')) angular.element('#dashboard-iframe-div').removeClass("gb-hide");
    }, 5000); //if(((dashCtrl.info.loadCount % 2 === 0) && (navigator.userAgent.match(/Chrome/) || navigator.userAgent.match(/Safari/))) || ((navigator.userAgent.match(/Firefox/) || navigator.userAgent.match(/Edge/)))) {

    /* if(dashCtrl.loaded){
         console.log("LOADING DONE....");
         if(angular.element('#content-loader'))      angular.element('#content-loader').addClass("gb-hide");
         if(angular.element('#dashboard-iframe-div'))    angular.element('#dashboard-iframe-div').removeClass("gb-hide");
     }*/
  }; // Gets the system errors


  dashCtrl.getSysErrors = function () {
    return ErrorService.getErrors('gbApp');
  }; // Adds the given instance to the instance viewer


  dashCtrl.addInstance = function (book, report, owner) {
    var instance;
    var report_link = "";

    if ((book.typ == "Internal" || book.d_type == "Summary") && book.typ != "Tableau") {
      // create instance viewer object
      var instanceConfig = {
        'type': 'dashboard',
        'name': report.rname,
        'data': {
          'report': report
        }
      };
      instance = JSON.parse(angular.toJson(instanceConfig));
      InstanceHandler.addInstance(instance, dashCtrl);
    } else if (book.typ == "Tableau") {
      dashCtrl.addTabInstance(report, owner); // var instanceConfig = {
      //     'type' : 'tableau',
      //     'name' : view['name'],
      //     'data' : {      
      //         'view': view,
      //         'mode' : 'viewer'
      //     },
      //     'owner' : owner
      // };
      // var instance = JSON.parse(angular.toJson(instanceConfig));
      // var domain = $location.host().split(/\.(.+)?/)[1];
      // document.cookie = 'gb_hide_options=' + 1 + ";domain=" + domain + ";path=/";
      // InstanceHandler.addInstance(instance, dashCtrl, owner);
    }
  };

  dashCtrl.openDashboardIninstanceViewerOnloadOfPage = function (report) {
    // create instance viewer object
    var report_link = "";
    var instanceConfig = {
      'type': 'dashboard',
      'name': report.rname,
      'data': {
        'report': report
      }
    };
    instance = JSON.parse(angular.toJson(instanceConfig));
    InstanceHandler.addInstance(instance, dashCtrl);
  };

  dashCtrl.isInstanceViewerVisible = function () {
    return !InstanceHandler.isVisible() && InstanceHandler.getNumberOfInstances() > 0;
  }; // Method to log the user activity from the UI template.


  dashCtrl.logActivity = function (module, activity, details) {
    UserTrackingService.standard_user_tracking(GlobalService.getVal('navDashboards'), module, activity, details).then(successHandler, sessionTimeOutHandler);
  }; // Returns the filter expression to filter the dashboards based the search term typed by the user.


  dashCtrl.search = function () {
    return {
      "rdesc": dashCtrl.info.query
    };
  }; // Toggles the visibilty of the dashboards.


  dashCtrl.toggleDashboard = function (dashboard) {
    // if (!!dashCtrl.info.query) {
    //     ModalService.alertBox({msgKey: 'dashboard_collapse'});
    // } else {
    dashboard.expand = !dashboard.expand; // }

    Dashboards.updateDashboards(dashCtrl.gAllDashboards);
  };

  dashCtrl.toggleRoleSelect = function (role) {
    //    // for(i=0;i<dashCtrl.roles.length;i++){
    //         if(role == dashCtrl.roles[i].name){
    //             dashCtrl.roles[i].selected = !dashCtrl.roles[i].selected;
    //         }
    //     }
    var tempArray = [];

    for (i = 0; i < dashCtrl.roles.length; i++) {
      if (dashCtrl.roles[i].selected) {
        tempArray.push(dashCtrl.roles[i].name);
      }
    }

    if (tempArray.length != 0) {
      dashCtrl.info.assignRole = tempArray.toString();
    } else {
      dashCtrl.info.assignRole = "Select Roles";
    }
  };

  dashCtrl.toggleRoleRemoveSelect = function (role) {
    if (dashCtrl.info.loggedRole != role.realName) {
      role.selected = !role.selected;
    }
  };

  dashCtrl.selectAllRole = function () {
    var tempArray = [];

    for (i = 0; i < dashCtrl.roles.length; i++) {
      dashCtrl.roles[i].selected = true;
      tempArray.push(dashCtrl.roles[i].name);
    }

    dashCtrl.info.assignRole = tempArray.toString();
  };

  dashCtrl.selectAllRoleRemove = function (book) {
    var tempArray = [];

    for (i = 0; i < book.role_access_dis.length; i++) {
      if (book.role_access_dis[i].realName != dashCtrl.info.loggedRole) {
        book.role_access_dis[i].selected = true;
      } else {
        book.role_access_dis[i].selected = false;
      }
    }
  };

  dashCtrl.clearAllRole = function () {
    for (i = 0; i < dashCtrl.roles.length; i++) {
      dashCtrl.roles[i].selected = false;
      dashCtrl.info.assignRole = "Select Roles";
    }
  };

  dashCtrl.clearAllRoleRemove = function (book) {
    for (i = 0; i < book.role_access_dis.length; i++) {
      book.role_access_dis[i].selected = false;
    }
  };

  dashCtrl.checkRoleSubmit = function () {
    var tempArray = [];

    for (i = 0; i < dashCtrl.roles.length; i++) {
      if (dashCtrl.roles[i].selected) {
        tempArray.push(dashCtrl.roles[i].name);
      }
    }

    if (tempArray.length != 0 && dashCtrl.showAddTagsDd()) {
      return false;
    } else {
      return true;
    }
  };

  dashCtrl.checkRoleRemoveSubmit = function (book) {
    var tempArray = [];

    for (i = 0; i < book.role_access_dis.length; i++) {
      if (book.role_access_dis[i].selected) {
        tempArray.push(book.role_access_dis.name);
      }
    }

    if (tempArray.length != 0) {
      return false;
    } else {
      return true;
    }
  };

  dashCtrl.addRoleSubmit = function () {
    var roleArray = [];

    for (i = 0; i < dashCtrl.roles.length; i++) {
      if (dashCtrl.roles[i].selected) {
        roleArray.push(dashCtrl.roles[i].realName);
      }
    }

    var roles = roleArray.toString();
    var list = dashCtrl.getAllDashboards();
    dashCtrl.info.selectedBooks = [];

    for (var i = 0; i < list.length; i++) {
      if (list[i]['selected'] && list[i]['d_id']) {
        dashCtrl.info.selectedBooks.push(list[i]);
      } else {
        if (list[i]['selected']) {
          //selectedWorkbenchs.push(list[i]["id"]);
          dashCtrl.info.selectedBooks.push(list[i]);
        }
      }
    }

    var tempObj = [];
    var tempArray = [];

    for (i = 0; i < dashCtrl.info.selectedBooks.length; i++) {
      if (dashCtrl.info.selectedBooks[i].d_id) {
        tempObj[i] = {};
        tempObj[i].did = dashCtrl.info.selectedBooks[i].d_id;
        tempObj[i].rids = [];

        for (j = 0; j < dashCtrl.info.selectedBooks[i].reports.length; j++) {
          tempArray.push(dashCtrl.info.selectedBooks[i].reports[j].r_id);
        }

        tempObj[i].rids = tempArray.join(",");
      }

      tempArray = [];
    }

    var param = {
      roleaccess: {
        drids: tempObj,
        roles: roles
      }
    };
    dashCtrl.info.loading = true;
    Dashboards.addRolesToDashboards(param).then(function (response) {
      var dateToUpdate = new Date();

      for (i = 0; i < dashCtrl.dashboards.length; i++) {
        for (j = 0; j < dashCtrl.info.selectedBooks.length; j++) {
          if (dashCtrl.dashboards[i].d_id == dashCtrl.info.selectedBooks[j].d_id) {
            dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
            dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");

            for (k = 0; k < roleArray.length; k++) {
              if (dashCtrl.dashboards[i].role_access.indexOf(roleArray[k]) == -1) {
                dashCtrl.dashboards[i].role_access.push(roleArray[k]);
              }
            }
          }
        }
      }

      dashCtrl.actionMessage = response.data.Msg;
      dashCtrl.actionMessageFlag = true;
      dashCtrl.reloadData();
      dashCtrl.info.selectedBooks = "";
      dashCtrl.info.tags = "";

      for (i = 0; i < dashCtrl.roles.length; i++) {
        dashCtrl.roles[i].selected = false;
      }

      dashCtrl.info.assignRole = "Select Roles";
    }, function (error) {
      dashCtrl.info.selectedBooks = "";
      dashCtrl.info.tags = "";
      dashCtrl.info.loading = false;
    });
  };

  dashCtrl.getCheckboxStatus = function (param) {
    for (i = 0; i < dashCtrl.gbAlDashboards.length; i++) {
      if (!dashCtrl.gbAlDashboards[i].selected) {
        return false;
      }
    }

    return true;
  };

  dashCtrl.getSelectAllChkDisable = function () {
    var count = 0;
    dashCtrl.gbAlDashboards.map(function (item) {
      for (i = 0; i < dashCtrl.dashboards.length; i++) {
        if (item.d_id == dashCtrl.dashboards[i].d_id) {
          if (dashCtrl.dashboards[i].permissionTags) {
            count++;
          }
        }
      }
    });

    if (count === 0) {
      return false;
    } else {
      return true;
    }
  };

  dashCtrl.toggleSelectAll = function (param) {
    dashCtrl.currentSelected = 0;

    if (dashCtrl.info.selectAllDashboard) {
      dashCtrl.gbAlDashboards.map(function (item) {
        item.selected = true;

        for (i = 0; i < dashCtrl.dashboards.length; i++) {
          if (item.d_id == dashCtrl.dashboards[i].d_id) {
            if (dashCtrl.dashboards[i].permissionTags) {
              dashCtrl.dashboards[i].selected = true;
            }
          }
        }
      });
    } else {
      dashCtrl.gbAlDashboards.map(function (item) {
        item.selected = false;

        for (i = 0; i < dashCtrl.dashboards.length; i++) {
          if (item.d_id == dashCtrl.dashboards[i].d_id) {
            if (dashCtrl.dashboards[i].permissionTags) {
              dashCtrl.dashboards[i].selected = false;
            }
          }
        }
      });
    }

    dashCtrl.dashboards.map(function (item) {
      if (item.selected) {
        dashCtrl.currentSelected++;
      }
    });

    if (dashCtrl.currentSelected == 0) {
      dashCtrl.showSelectNotify = false;
    } else {
      dashCtrl.showSelectNotify = true;
    }
  };

  dashCtrl.checkdash = function (book, flag) {
    dashCtrl.filterLoading = false;
    dashCtrl.currentSelected = 0;
    dashCtrl.gbAlDashboards.map(function (item) {
      if (book.d_id == item.d_id) {
        item.selected = flag;
      }
    });
    dashCtrl.dashboards.map(function (item) {
      if (book.d_id == item.d_id) {
        item.selected = flag;
      }
    });
    dashCtrl.dashboards.map(function (item) {
      if (item.selected) {
        dashCtrl.currentSelected++;
      }
    });

    if (dashCtrl.currentSelected == 0) {
      dashCtrl.showSelectNotify = false;
    } else {
      dashCtrl.showSelectNotify = true;
    }
  };

  dashCtrl.checkSelectAll = function () {
    dashCtrl.currentSelected = 0;

    for (i = 0; i < dashCtrl.gbAlDashboardsFiltered.length; i++) {
      for (j = 0; j < dashCtrl.dashboards.length; j++) {
        if (dashCtrl.dashboards[j].d_id == dashCtrl.gbAlDashboardsFiltered[i].d_id) {
          dashCtrl.dashboards[j].selected = true;
          dashCtrl.currentSelected++;
        }
      }
    }
  };

  dashCtrl.clearselected = function () {
    dashCtrl.currentSelected = 0;
    dashCtrl.gbAlDashboards.map(function (item) {
      item.selected = false;
    });
    dashCtrl.dashboards.map(function (item) {
      item.selected = false;
    });
    dashCtrl.showSelectNotify = false;
  }; // Returns whether dashboards are there after filtering or not so as to display the proper message on the UI when no dashboards are matched.


  dashCtrl.filterResult = function () {
    var i,
        bool = true;

    if (dashCtrl.info.complete && dashCtrl.getError() && !dashCtrl.getError().length) {
      for (i in dashCtrl.gbAlDashboards) {
        if (dashCtrl.gbAlDashboards[i].reports != null && dashCtrl.dashboards[i].reports.length) {
          bool = false;
        }
      }

      return bool;
    } else {
      return false;
    }
  }; // Returns the errors related to dashboards


  dashCtrl.getError = function () {
    return ErrorService.getFeatureErrors('dashboards');
  }; // Returns the no match found message for the given filter.


  dashCtrl.getMessage = function (key) {
    return GlobalService.getVal(key);
  }; // sets the given url as the secure url to load on the ui.


  dashCtrl.sceURL = function (url) {
    return $sce.trustAsResourceUrl(url);
  };

  dashCtrl.sceHTML = function (html) {
    return $sce.trustAsHtml(html);
  }; // Expand the views under a given workbook


  dashCtrl.expandBook = function (book) {
    book['expand'] = !book['expand'];
    Dashboards.updateDashboards(dashCtrl.gAllDashboards);
  }; // Filters the workbooks based on the given filter


  dashCtrl.filterTableau = function () {
    var i,
        wbs = dashCtrl.getAllDashboards();

    for (i in wbs) {
      if ($filter('filter')(wbs[i]['views'], {
        'tags': dashCtrl.info.query
      }).length) {
        return true;
      }
    }

    return false;
  };

  dashCtrl.userPermitted = function () {
    var userInfo = metaDataService.getUser();
    var featureInfo = metaDataService.getFeatures();

    if (featureInfo.workbench || userInfo['org_type'] == GlobalService.getVal('gbUserOrgType') || userInfo['org_type'] == GlobalService.getVal('studioUserOrgType') && AppService.isGbStudioApp() || dashCtrl.ifWbDemoUser()) {
      return true;
    } else if (userInfo['org_type'] == GlobalService.getVal('gbUserOrgType') && !dashCtrl.chkAdminFeature() && featureInfo.dashboard_admin) {
      return false;
    } else if (userInfo['org_type'] != GlobalService.getVal('gbUserOrgType') && !dashCtrl.chkAdminFeature() && featureInfo.dashboard_admin) {
      return true;
    } else if (userInfo['org_type'] != GlobalService.getVal('gbUserOrgType') && dashCtrl.chkAdminFeature() && featureInfo.dashboard_admin) {
      return true;
    }

    return false;
  };

  dashCtrl.checkCurrentRole = function (role, endPram) {
    var userInfo = metaDataService.getUser();

    if (userInfo['role'] == role.realName) {
      if (dashCtrl.chkAdminFeature()) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  };

  dashCtrl.isPowerUser = function () {
    return WorkbenchService.isPowerUser();
  };

  dashCtrl.subscribe = function (_content) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/tableau_subscribe.html',
      controller: 'SubscribeController as subscribeCtrl',
      resolve: {
        content: function content() {
          return _content;
        },
        schedules: function schedules() {
          return WorkbenchService.getSchedulesList();
        }
      }
    });
  };

  dashCtrl.showUsers = function () {
    dashCtrl.roleListLoading = true;
    dashCtrl.modalInstance = $modal.open({
      templateUrl: 'partials/dashboard_user_role_list.html',
      scope: $scope
    });
    Dashboards.showUsers().then(function (response) {
      var data = response.data.Data;
      var tempArray = [];
      var tempObj = {};
      dashCtrl.roleUserList = [];

      for (i = 0; i < data.length; i++) {
        tempObj.name = data[i].first_name + " " + data[i].last_name;
        tempObj.email = data[i].email;

        if (data[i].role.split('_').length > 3) {
          tempObj.role = data[i].role.split('_').splice(3, 3).join('_');
        } else {
          tempObj.role = data[i].role;
        }

        tempArray.push(tempObj);
        tempObj = {};
      }

      dashCtrl.roleUserList = tempArray;
      dashCtrl.roleListLoading = false;
    });
  };

  dashCtrl.updateSubscription = function (_content2) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/tableau_update_subscription.html',
      controller: 'UpdateSubscriptionController as subscribeCtrl',
      resolve: {
        content: function content() {
          return _content2;
        },
        schedules: function schedules() {
          return WorkbenchService.getSchedulesList();
        },
        subscription: function subscription() {
          return getSubscription(_content2);
        }
      }
    });
  };

  dashCtrl.unsubscribe = function (_content3) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/tableau_unsubscribe.html',
      controller: 'UnsubscribeController as unsubscribeCtrl',
      resolve: {
        content: function content() {
          return _content3;
        },
        subscription: function subscription() {
          return getSubscription(_content3);
        }
      }
    });
  }; //only power user can add/delete tag


  if (dashCtrl.userPermitted()) {
    dashCtrl.info.addDeleteTag = true;
  } else {
    dashCtrl.info.addDeleteTag = false;
  } // Adds tableau instance to the instance viewer.


  dashCtrl.addTabInstance = function (view, owner) {
    var instanceConfig = {
      'type': 'tableau',
      'name': view['name'],
      'data': {
        'view': view,
        'mode': 'viewer'
      },
      'owner': owner
    };
    var instance = JSON.parse(angular.toJson(instanceConfig));
    var domain = GlobalService.getVal('primaryDomain');
    document.cookie = 'gb_hide_options=' + 1 + ";domain=" + domain + ";path=/";
    InstanceHandler.addInstance(instance, dashCtrl, owner);
  };

  dashCtrl.addTagToWorkbook = function (book) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/dashboards_add_tag_workbook.html',
      controller: 'AddTagController as addTagCtrl',
      resolve: {
        workbook: function workbook() {
          return book;
        }
      }
    });
  };

  dashCtrl.removeTagFromWorkbook = function (book, tag) {
    dashCtrl.info.loading = true;
    var id = book["d_id"];
    Dashboards.removeTag(id, tag).then(function (response) {
      dashCtrl.logActivity('Other Dashboards', 'Remove Tag', '{\'' + tag + '\'}');
      var dateToUpdate = new Date();

      for (i = 0; i < dashCtrl.dashboards.length; i++) {
        if (dashCtrl.dashboards[i].d_id == book["d_id"]) {
          dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
          dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
          dashCtrl.dashboards[i].tag.splice(dashCtrl.dashboards[i].tag.indexOf(tag), 1);
        }
      }

      dashCtrl.actionMessage = response.data.Msg;
      dashCtrl.actionMessageFlag = true;
      dashCtrl.reloadData();
    }, function (response) {
      dashCtrl.reloadData();
      dashCtrl.info.loading = false;
    });
  };

  dashCtrl.removeRoleFromWorkbook = function (book, role) {
    dashCtrl.info.loading = true;
    var id = book["d_id"];
    var roleToRemove = [];
    var roleToRemoveDone = [];

    for (i = 0; i < book.role_access_dis.length; i++) {
      if (book.role_access_dis[i].selected) {
        roleToRemove.push(book.role_access_dis[i].realName);
      }
    }

    for (i = 0; i < roleToRemove.length; i++) {
      Dashboards.removeRole(id, roleToRemove[i]).then(function (response) {
        dashCtrl.logActivity('Other Dashboards', 'Remove Role', '{\'' + roleToRemove[i] + '\'}');
        roleToRemoveDone.push(roleToRemove[i]);
        var dateToUpdate = new Date();

        if (roleToRemoveDone.length == roleToRemove.length) {
          for (k = 0; k < dashCtrl.dashboards.length; k++) {
            if (dashCtrl.dashboards[k].d_id == id) {
              dashCtrl.dashboards[k].modified_ts = dateToUpdate.toISOString();
              dashCtrl.dashboards[k].modified_ts_to_display = moment(dashCtrl.dashboards[k].modified_ts).format("YYYY-MM-DD HH:MM:SS");

              for (j = 0; j < roleToRemove.length; j++) {
                dashCtrl.dashboards[k].role_access.splice(dashCtrl.dashboards[k].role_access.indexOf(roleToRemove[j]), 1);
              }
            }
          }

          dashCtrl.actionMessage = response.data.Msg;
          dashCtrl.actionMessageFlag = true;
          dashCtrl.reloadData();
        }
      });
    }
  };

  dashCtrl.updateWorkbook = function (book) {
    var modalInstance = $modal.open({
      templateUrl: 'partials/dashboards_update_workbook.html',
      controller: 'UpdateWorkbookController as updateWorkbookCtrl',
      resolve: {
        workbook: function workbook() {
          return book;
        }
      }
    });
  };

  dashCtrl.deleteWorkbookModal = function (book) {
    dashCtrl.selectedDashboard = book;
    dashCtrl.msg = "Are you sure you want to delete the report <b>" + dashCtrl.selectedDashboard.name + "</b>";
    dashCtrl.modalInstance = $modal.open({
      templateUrl: 'partials/dashboards_delete_workbook.html',
      scope: $scope
    });
  };

  dashCtrl.checkOwner = function (book) {
    if (book.owner == WorkbenchService.getUserId()) {
      return true;
    }

    return false;
  }; // Adds a tabbed tableau instance to the instance viewer.


  dashCtrl.addTabbedTabInstance = function (book) {
    var instanceConfig = {
      'type': 'tableau',
      'name': book['name'],
      'data': {
        'book': book,
        'mode': 'viewer'
      },
      'owner': book['owner']
    };
    var instance = JSON.parse(angular.toJson(instanceConfig));
    InstanceHandler.addInstance(instance, dashCtrl, book['owner']);
  }; // Adds the manage permissions instance to the instance viewer


  dashCtrl.addManageInstance = function () {
    var instance = {
      'type': 'permissions',
      'name': 'Manage Reports',
      'data': {}
    };
    instance = JSON.parse(angular.toJson(instance));
    InstanceHandler.addInstance(instance, dashCtrl);
  }; // To get the tableau workbooks


  dashCtrl.getWorkbooks = function () {
    var works = WorkbenchService.getWorkbooksLocal();
    workbenchDashboards['books'] = works['books'];
    workbenchDashboards['loading'] = works['loading'];
    workbenchDashboards['error'] = works['error'];
    workbenchDashboards['userUnauthorized'] = works['userUnauthorized'];
    return workbenchDashboards;
  };

  dashCtrl.isLoadingOtherDashboard = function () {
    return dashCtrl.info.loading;
  }; //search for d_id and return tags for tableau dashboard


  dashCtrl.getTagsForTableau = function (id) {
    var dboard = dashCtrl.tableauDashboards;

    if (dboard && dboard.length > 0) {
      for (var i = 0; i < dboard.length; i++) {
        if (dboard[i]['d_id'] === id) {
          return dboard[i]['tag'];
        }
      }
    }

    return [];
  };

  dashCtrl.getSchForTableau = function (id) {
    var dboard = dashCtrl.tableauDashboards;

    if (dboard && dboard.length > 0) {
      for (var i = 0; i < dboard.length; i++) {
        if (dboard[i]['d_id'] === id) {
          return dboard[i]['reports'];
        }
      }
    }

    return [];
  };

  dashCtrl.isNoDashboards = function () {
    var list = [];
    list = dashCtrl.gbAlDashboards;
    var internalDashboards = WorkbenchService.getWorkbooksLocal();

    if (internalDashboards && internalDashboards["books"] && internalDashboards["books"].length && internalDashboards["books"].length > 0) {
      list = list.concat(internalDashboards["books"]);
    }

    var result = list.length > 0 ? false : true;
    return result;
  }; //RAJA
  // dashCtrl.gAllDashboards = [];
  //$interval(function(){dashCtrl.gbAllDashboards();}, 1000, false);


  dashCtrl.getAllDashboards = function () {
    return dashCtrl.gbAlDashboards;
  }; // dashCtrl.gbAllDashboards = function(){                
  //         var internalDashboards = WorkbenchService.getWorkbooksLocal();
  //         if(dashCtrl.dashOwnerListLogi == undefined){
  //             //RAJA API - 4
  //             Dashboards.getLogiAdmin().then(function (responseLogi) {
  //                 dashCtrl.dashOwnerListLogi = responseLogi.data.Data;
  //             });
  //         }
  //         if(dashCtrl.dashOwnerListTableau == undefined){
  //             //RAJA API - 5
  //             Dashboards.getTableauAdmin().then(function (responseTab) {
  //                 dashCtrl.dashOwnerListTableau = responseTab.data.Data;
  //             });
  //         }
  //         if(dashCtrl.dataSourcesList.length==0 && !dashCtrl.dataSourcesListFlag && WorkbenchService.getSiteId()){
  //             //RAJA API - 6
  //             WorkbenchService.getDataSources().then(function (response){
  //                 dashCtrl.dataSourcesListFlag = true;
  //                 var jsonResponse = x2js.xml_str2json(response.data);
  //                 if(!jsonResponse['tsResponse'] || !jsonResponse['tsResponse']['datasources']) return;
  //                 var data = jsonResponse['tsResponse']['datasources']['datasource'];
  //                 if (Array.isArray(data)) {
  //                     dashCtrl.dataSourcesList = data;
  //                 } else {
  //                     dashCtrl.dataSourcesList = [];
  //                     if (data) {
  //                         dashCtrl.dataSourcesList.push(data);
  //                     }
  //                 }
  //             });
  //         }
  //         //RAJA API - 7
  //         dashCtrl.info.bookOwnerList = WorkbenchService.getAllUsersDeatils();
  //         if(internalDashboards && internalDashboards["books"] && internalDashboards["books"].length && internalDashboards["books"].length > 0){
  //            //dashCtrl.gAllDashboards = dashCtrl.gAllDashboards.concat(internalDashboards["books"]);
  //             Dashboards.setDashboard(dashCtrl.dashboards, internalDashboards["books"]);
  //         }else{
  //             Dashboards.setDashboard(dashCtrl.dashboards);
  //         }
  //         dashCtrl.gAllDashboards = Dashboards.getDashboards();
  // //console.log(dashCtrl.gAllDashboards);debugger;
  //         //update scheduled information for each dashboard
  //         for(l=0;l<dashCtrl.gAllDashboards.length;l++){
  //             if(dashCtrl.gAllDashboards[l].dname){
  //                 if(dashCtrl.gAllDashboards[l].f_reports && dashCtrl.gAllDashboards[l].f_reports.length){
  //                 for(i=0;i<dashCtrl.gAllDashboards[l].f_reports.length;i++){
  //                     if(dashCtrl.gAllDashboards[l].f_reports[i].scheduler_enabled) {
  //                         if(dashCtrl.gAllDashboards[l].f_reports[i].scheduler_period == "hourly"){
  //                             dashCtrl.gAllDashboards[l].f_reports[i].schDisplay = "Hourly";
  //                         }else if(dashCtrl.gAllDashboards[l].f_reports[i].scheduler_period == "daily"){
  //                             dashCtrl.gAllDashboards[l].f_reports[i].schDisplay = "Daily at "+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_time;
  //                         }else if(dashCtrl.gAllDashboards[l].f_reports[i].scheduler_period == "weekly"){
  //                             dashCtrl.gAllDashboards[l].f_reports[i].schDisplay = "Weekly on "+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_freq.substring(5)+" at "+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_time;
  //                         }else if(dashCtrl.gAllDashboards[l].f_reports[i].scheduler_period == "monthly"){
  //                             for(k=0;k<dashCtrl.scheduleFreq.weekDay.length;k++){
  //                                 if(dashCtrl.scheduleFreq.weekDay[k].key == dashCtrl.gAllDashboards[l].f_reports[i].scheduler_freq.split(":")[1].substring(4)){
  //                                     disDay = dashCtrl.scheduleFreq.weekDay[k].value;
  //                                 }
  //                             }
  //                             dashCtrl.gAllDashboards[l].f_reports[i].schDisplay = "Monthly on "+disDay+" "+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_freq.split(":")[0].substring(5).charAt(0).toUpperCase()+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_freq.split(":")[0].substring(5).slice(1)+" at "+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_time;
  //                         }else if(dashCtrl.gAllDashboards[l].f_reports[i].scheduler_period == "yearly"){
  //                             for(k=0;k<dashCtrl.scheduleFreq.weekDay.length;k++){
  //                                 if(dashCtrl.scheduleFreq.weekDay[k].key == dashCtrl.gAllDashboards[l].f_reports[i].scheduler_freq.split(":")[2].substring(4)){
  //                                     disDay = dashCtrl.scheduleFreq.weekDay[k].value;
  //                                 }
  //                             }
  //                             dashCtrl.gAllDashboards[l].f_reports[i].schDisplay = "Yearly every "+disDay+" "+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_freq.split(":")[1].substring(5).charAt(0).toUpperCase()+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_freq.split(":")[1].substring(5).slice(1)+" of "+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_freq.split(":")[0].substring(6)+" month at "+dashCtrl.gAllDashboards[l].f_reports[i].scheduler_time;
  //                         }
  //                     }
  //                 }}
  //             }
  //         }
  //         //updateUserName
  //         dashCtrl.gAllDashboards.map(function(item){
  //             //check for tableau dashboard and update tags from infoserver API
  //             if(item['id']){
  //                 var tags = dashCtrl.getTagsForTableau(item['id']);
  //                 item.visibility = dashCtrl.getVisibility(item);
  //                 item.role_access = dashCtrl.getRoleAccessField(item);
  //                 var schDetails = dashCtrl.getSchForTableau(item['id']);
  //                 var disDay;
  //                 if(tags.length > 0 || schDetails.length > 0){
  //                     item.tag = tags;
  //                     if(item.f_views && item.f_views.length){
  //                     for(i=0;i<item.f_views.length;i++){
  //                         for(j=0;j<schDetails.length;j++){
  //                             if(item.f_views[i].id == schDetails[j].r_id){
  //                                 item.f_views[i].scheduler_enabled = schDetails[j].scheduler_enabled;
  //                                 item.f_views[i].scheduler_freq = schDetails[j].scheduler_freq;
  //                                 item.f_views[i].scheduler_period = schDetails[j].scheduler_period;
  //                                 item.f_views[i].scheduler_time = schDetails[j].scheduler_time;
  //                                 item.f_views[i].schDisplay = "";
  //                                 if(item.f_views[i].scheduler_enabled) {
  //                                     if(item.f_views[i].scheduler_period == "hourly"){
  //                                         item.f_views[i].schDisplay = "Hourly at "+item.f_views[i].scheduler_time;
  //                                     }else if(item.f_views[i].scheduler_period == "daily"){
  //                                         item.f_views[i].schDisplay = "Daily at "+item.f_views[i].scheduler_time;
  //                                     }else if(item.f_views[i].scheduler_period == "weekly"){
  //                                         item.f_views[i].schDisplay = "Weekly on "+item.f_views[i].scheduler_freq.substring(5)+" at "+item.f_views[i].scheduler_time;
  //                                     }else if(item.f_views[i].scheduler_period == "monthly"){
  //                                         for(k=0;k<dashCtrl.scheduleFreq.weekDay.length;k++){
  //                                             if(dashCtrl.scheduleFreq.weekDay[k].key == item.f_views[i].scheduler_freq.split(":")[1].substring(4)){
  //                                                 disDay = dashCtrl.scheduleFreq.weekDay[k].value;
  //                                             }
  //                                         }
  //                                         item.f_views[i].schDisplay = "Monthly on "+disDay+" "+item.f_views[i].scheduler_freq.split(":")[0].substring(5).charAt(0).toUpperCase() + item.f_views[i].scheduler_freq.split(":")[0].substring(5).slice(1)+" at "+item.f_views[i].scheduler_time;
  //                                     }else if(item.f_views[i].scheduler_period == "yearly"){
  //                                         for(k=0;k<dashCtrl.scheduleFreq.weekDay.length;k++){
  //                                             if(dashCtrl.scheduleFreq.weekDay[k].key == item.f_views[i].scheduler_freq.split(":")[2].substring(4)){
  //                                                 disDay = dashCtrl.scheduleFreq.weekDay[k].value;
  //                                             }
  //                                         }
  //                                         item.f_views[i].schDisplay = "Yearly every "+disDay+" "+item.f_views[i].scheduler_freq.split(":")[1].substring(5).charAt(0).toUpperCase() +item.f_views[i].scheduler_freq.split(":")[1].substring(5).slice(1) +" of "+item.f_views[i].scheduler_freq.split(":")[0].substring(6)+" month at "+item.f_views[i].scheduler_time;
  //                                     }
  //                                 }
  //                             }
  //                         }    
  //                     }}
  //                 }else{
  //                     item.tag = [];
  //                 }
  //             }
  //             item.gDUser = dashCtrl.getBookOwnerName(item);
  //             if(item["dname"]) {
  //                 item.visibility = dashCtrl.getVisibility(item);
  //             }
  //             item.gDOwner = dashCtrl.getBookChangedOwnerName(item);
  //             item.gDTs = dashCtrl.changeDateFormate(item.modified_ts);
  //             item.gDType = item.dname ? dashCtrl.getValue('internalDashboards') : dashCtrl.getValue('userCreatedDashboards');
  //         });
  //         var works = dashCtrl.gAllDashboards;
  //         for(i=0;i<works.length;i++){
  //             if(!dashCtrl.showDashBoard(works[i],"dashLevel")){
  //                 works.splice(i,1);
  //                 i--;
  //             }
  //         }
  //         if(works.length != 0 && sessionStorage.getItem("dash_mode") == "true"){
  //             var foundFlag = false;
  //             var didList = localStorage.getItem("did").split(',');
  //             var ridList = localStorage.getItem("rid").split(',');
  //             for(i=0;i<didList.length;i++){
  //                 var tempRid = ridList[i];
  //                 var tempDid = didList[i];
  //                 for(j=0;j<didList.length;j++){
  //                     if(tempRid == ridList[j] && i!=j && tempDid == didList[j]){
  //                         didList.splice(j,1);
  //                         j--
  //                     }
  //                 }
  //             }
  //             var foundDid = [];
  //             var foundRid = [];
  //             dashCtrl.setDashboard('other');
  //             for(i=0;i<works.length;i++){
  //                 if(works[i]["dname"]){
  //                     for(k=0;k<didList.length;k++){
  //                         if(didList[k]==works[i].d_id){
  //                             for(j=0;j<works[i].reports.length;j++){
  //                                 if(works[i].reports[j].r_id == ridList[k]){
  //                                     foundDid.push(didList[k]);
  //                                     foundRid.push(ridList[k]);
  //                                     didList.splice(k,1);
  //                                     ridList.splice(k,1);
  //                                     if(dashCtrl.showDashBoard(works[i],"dashLevel")){
  //                                         var DirRep = works[i].reports[j];
  //                                         if(sessionStorage.getItem("rdreport")){
  //                                             var re = new RegExp("([?&])rdReport=.*?(&|$)", "i");
  //                                             var separator = DirRep.r_link.indexOf('?') !== -1 ? "&" : "?";
  //                                             DirRep.r_link = DirRep.r_link.replace(re, "$1rdReport=" + sessionStorage.getItem("rdreport") + '$2');
  //                                         }
  //                                         dashCtrl.addInstance(DirRep);
  //                                         dashCtrl.logActivity(dashCtrl.dashboardType == 'summary' ? 'Summary Dashboard' : 'Other Dashboards', 'InstanceViewer', '{\''+DirRep.rname+'\'}');
  //                                         if(didList.length==0){
  //                                             foundFlag = true;
  //                                             sessionStorage.setItem("dash_mode", "false");
  //                                         }
  //                                         document.getElementById("gb-full-page-loader").style.display = 'none';
  //                                         break;
  //                                     }else {
  //                                         if(didList.length==0){
  //                                             foundFlag = true;
  //                                         }
  //                                         sessionStorage.setItem("dash_mode", "false");
  //                                         dashCtrl.info.dashModeErrorMsg = GlobalService.getVal("dashModePermissionError")
  //                                         ModalService.alertBox({msg: dashCtrl.info.dashModeErrorMsg});
  //                                     }
  //                                 }
  //                             } 
  //                         }
  //                     }
  //                 }
  //             } 
  //             for(i=0;i<didList.length;i++){
  //                 if(dashCtrl.defaultDashboard[0]){
  //                     if(didList[i]==dashCtrl.defaultDashboard[0].d_id && ridList[i]==dashCtrl.defaultDashboard[0].reports[0].r_id){
  //                         foundDid.push(didList[i]);
  //                         foundRid.push(ridList[i]);
  //                         didList.splice(i,1);
  //                         ridList.splice(i,1);
  //                         i--;
  //                         var DirRep = dashCtrl.defaultDashboard[0].reports[0];
  //                         dashCtrl.addInstance(DirRep);
  //                         dashCtrl.logActivity(dashCtrl.dashboardType == 'summary' ? 'Summary Dashboard' : 'Other Dashboards', 'InstanceViewer', '{\''+DirRep.rname+'\'}');
  //                         if(didList==0){
  //                             sessionStorage.setItem("dash_mode", "false");
  //                             foundFlag = true;
  //                         }
  //                         document.getElementById("gb-full-page-loader").style.display = 'none';
  //                     }
  //                 }
  //             }                   
  //             if(!foundFlag){
  //                 sessionStorage.setItem("dash_mode", "false");
  //                 dashCtrl.info.dashModeErrorMsg = GlobalService.getVal("dashModeError")
  //                 ModalService.alertBox({msg: dashCtrl.info.dashModeErrorMsg});
  //             }
  //             localStorage.setItem("did", foundDid.toString());
  //             localStorage.setItem("rid", foundRid.toString());
  //         }
  //         for(l=0;l<works.length;l++){
  //             var tempRoleAccess = [];
  //             var tempRoleAccessObj = {};
  //             if(works[l].role_access){
  //                 for(m=0;m<works[l].role_access.length;m++){
  //                     tempRoleAccessObj = {};
  //                     tempRoleAccessObj.realName = works[l].role_access[m];
  //                     if(works[l].role_access[m].split('_').length>3){
  //                         tempRoleAccessObj.name = works[l].role_access[m].split('_').splice(3,3).join('_');
  //                     }else {
  //                         tempRoleAccessObj.name = works[l].role_access[m];
  //                     }
  //                     tempRoleAccess.push(tempRoleAccessObj);
  //                 }
  //                 works[l].role_access_dis = tempRoleAccess;
  //             }else {
  //                 works[l].role_access = [];
  //             }
  //         }
  //         if(dashCtrl.defaultDashboard.length>0){
  //             if(dashCtrl.defaultDashboard[0].typ == "Tableau" && dashCtrl.tabSummaryFlag){
  //                 for(k=0;k<works.length;k++){
  //                     if(dashCtrl.defaultDashboard[0].d_id == works[k].id){
  //                         for(m=0;m<works[k].views.length;m++){
  //                             if(dashCtrl.defaultDashboard[0].f_reports[0].r_id==works[k].views[m].id){
  //                                 dashCtrl.tabSummaryFlag = false;
  //                                 dashCtrl.loadTableauSummary(works[k]);
  //                             }
  //                         }
  //                     }
  //                 }       
  //             }
  //         }
  //         dashCtrl.info.allDashboardsList = works;
  //         if (dashCtrl.allDashCount != dashCtrl.gAllDashboards.length) {
  //             dashCtrl.internalDashCount = 0;
  //             for(i=0;i<dashCtrl.gAllDashboards.length;i++){
  //                 if (dashCtrl.gAllDashboards[i].dname) {
  //                     dashCtrl.internalDashCount++;
  //                 }
  //             }
  //             dashCtrl.userCreatedDashCount = 0;
  //             for(i=0;i<dashCtrl.gAllDashboards.length;i++){
  //                 if (dashCtrl.gAllDashboards[i].name) {
  //                     dashCtrl.userCreatedDashCount++;
  //                 }
  //             }
  //         }
  //         dashCtrl.allDashCount = dashCtrl.gAllDashboards.length;              
  //         //filter on query string
  //         works = $filter('filterBooks')(dashCtrl.gAllDashboards, dashCtrl.info.query);
  //         //filter all, internal or user created dashboard
  //         if(dashCtrl.info.dType != 'allDashboards'){
  //         works = dashCtrl.filterOnType(works);
  //      }
  //      //getUserList
  //     dashCtrl.updateCreatorName(works);
  //      dashCtrl.updateOwnerName(works);
  //         //filter on created by string
  //         if(dashCtrl.info.createdBy != 'All'){
  //             works = dashCtrl.filterOnCreator(works);
  //         }
  //         if(dashCtrl.info.owner != 'All'){
  //             works = dashCtrl.filterOnOwner(works);
  //         }
  //         if(dashCtrl.info.lastModified != 'All'){
  //             works = dashCtrl.filterOnLastModified(works);
  //         }
  //         if(dashCtrl.info.datasource != 'All'){
  //             works = dashCtrl.filterOnDatasource(works);
  //         }
  //         if(dashCtrl.info.tagsFilter.length != 0){
  //             works = dashCtrl.filterOnTags(works);
  //         }                
  //         //sort it on name of dashboard
  //         if(dashCtrl.info.orderByField){
  //             works = works.sort(function compare(a,b) {
  //                 if(dashCtrl.info.orderByField == 'name'){
  //                     if(dashCtrl.info.dashboardSortOrder){                            
  //                         if (dashCtrl.getNameOfDashboard(a) < dashCtrl.getNameOfDashboard(b)){return -1;}
  //                         if (dashCtrl.getNameOfDashboard(a) > dashCtrl.getNameOfDashboard(b)){return 1;}
  //                     }else{                     
  //                         if (dashCtrl.getNameOfDashboard(a) < dashCtrl.getNameOfDashboard(b)){return 1;}
  //                         if (dashCtrl.getNameOfDashboard(a) > dashCtrl.getNameOfDashboard(b)){return -1;}                            
  //                     }
  //                 }else if(dashCtrl.info.orderByField == 'creator'){
  //                     if(dashCtrl.info.dashboardSortOrderCB){                            
  //                         if (a.gDUser < b.gDUser){return -1;}
  //                         if (a.gDUser > b.gDUser){return 1;}
  //                     }else{                                         
  //                         if (a.gDUser < b.gDUser){return 1;}
  //                         if (a.gDUser > b.gDUser){return -1;}                          
  //                     }
  //                 }else if(dashCtrl.info.orderByField == 'owner'){
  //                     if(dashCtrl.info.dashboardSortOrderOB){                            
  //                         if (a.gDOwner < b.gDOwner){return -1;}
  //                         if (a.gDOwner > b.gDOwner){return 1;}
  //                     }else{                                         
  //                         if (a.gDOwner < b.gDOwner){return 1;}
  //                         if (a.gDOwner > b.gDOwner){return -1;}                          
  //                     }
  //                 }else if(dashCtrl.info.orderByField == 'type'){
  //                     if(dashCtrl.info.dashboardSortOrderType){ 
  //                         if (a.gDType < b.gDType){return -1;}
  //                         if (a.gDType > b.gDType){return 1;}
  //                     }else{                                         
  //                         if (a.gDType < b.gDType){return 1;}
  //                         if (a.gDType > b.gDType){return -1;}                          
  //                     }
  //                 }else if(dashCtrl.info.orderByField == 'DOFM'){
  //                     if(dashCtrl.info.dashboardSortOrderDOFM){ 
  //                         if (new Date(a.gDTs).getTime() < new Date(b.gDTs).getTime()){return -1;}
  //                         if (new Date(a.gDTs).getTime() > new Date(b.gDTs).getTime()){return 1;}
  //                     }else{                                         
  //                         if (new Date(a.gDTs).getTime() < new Date(b.gDTs).getTime()){return 1;}
  //                         if (new Date(a.gDTs).getTime() > new Date(b.gDTs).getTime()){return -1;}                          
  //                     }
  //                 }
  //             });
  //         }
  //         //fetch data on basis of pagination
  //         if (!!works.length) {
  //             var books = works;
  //             var count = books.length;
  //             paginator(count);
  //             var startIndex = dashCtrl.info.page['current'] * dashCtrl.info.page['count'];
  //             var endIndex = startIndex + dashCtrl.info.page['count'];
  //             if (count <= endIndex) {
  //                 endIndex = count;
  //             }
  //             var tmpArray = [];
  //             for (var key = startIndex; key < endIndex; key++) {
  //                 if(dashCtrl.info.page.selectAll[dashCtrl.info.page.current]){
  //                     if(dashCtrl.showDashBoard(works[key], "tags")){
  //                         works[key].selected = true;
  //                     }
  //                 }
  //                 if(dashCtrl.info.page.unSelectAll[dashCtrl.info.page.current]){
  //                     works[key].selected = false;
  //                 }
  //                 tmpArray.push(works[key]);
  //             }
  //             dashCtrl.gAllDashboards = tmpArray;
  //         }else{
  //             dashCtrl.info.page['pages'] = 0;
  //             dashCtrl.gAllDashboards = [];
  //             return [];
  //         }
  //         if(!dashCtrl.gAllDashboards.length || dashCtrl.gAllDashboards.length == 0) {                    
  //             dashCtrl.info.page['pages'] = 0;
  //         }
  //         //return list;
  //         return dashCtrl.gAllDashboards;
  //   };


  dashCtrl.updateCreatorName = function (works) {
    dashCtrl.info.dUserName = [];

    for (var i = 0; i < works.length; i++) {
      if (!dashCtrl.isDuplicateArrayObject(dashCtrl.info.dUserName, works[i].gDUser)) {
        dashCtrl.info.dUserName.push(works[i].gDUser);
      }
    }
  };

  dashCtrl.getDCreatorName = function () {
    return dashCtrl.info.dUserName;
  };

  dashCtrl.updateOwnerName = function (works) {
    dashCtrl.info.dOwnerName = [];

    for (var i = 0; i < works.length; i++) {
      if (!dashCtrl.isDuplicateArrayObject(dashCtrl.info.dOwnerName, works[i].gDOwner)) {
        dashCtrl.info.dOwnerName.push(works[i].gDOwner);
      }
    }
  };

  dashCtrl.getDOwnerName = function () {
    return dashCtrl.info.dOwnerName;
  };

  dashCtrl.getDlastModified = function () {
    return dashCtrl.info.lastModifiedArray;
  };

  dashCtrl.isDuplicateArrayObject = function (list, name) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] == name) {
        return true;
      }
    }

    return false;
  };

  dashCtrl.getAllTagsName = function () {
    //ashCtrl.info.allDashboardsList
    var tags = [],
        tmp = [];

    for (var i = 0; i < dashCtrl.info.allDashboardsList.length; i++) {
      tmp = [];

      if (dashCtrl.info.allDashboardsList[i]["tags"]) {
        tmp = dashCtrl.info.allDashboardsList[i]["tags"];
      }

      if (dashCtrl.info.allDashboardsList[i]["tag"]) {
        tmp = dashCtrl.info.allDashboardsList[i]["tag"];
      }

      for (var j = 0; j < tmp.length; j++) {
        tags.push(tmp[j]);
      }
    } //remove duplicate


    tags = dashCtrl.unique(tags);
    tags.sort();
    return tags;
  };

  dashCtrl.getAllTagsNameOfSelectedDashboards = function () {
    //ashCtrl.info.allDashboardsList
    var tags = [],
        tmp = [],
        list = [];
    allDash = dashCtrl.getAllDashboards();

    for (i = 0; i < allDash.length; i++) {
      if (allDash[i].selected) {
        list.push(allDash[i]);
      }
    }

    for (var i = 0; i < list.length; i++) {
      tmp = [];

      if (list[i]['selected'] && list[i]["tags"]) {
        tmp = list[i]["tags"];
      }

      if (list[i]['selected'] && list[i]["tag"]) {
        tmp = list[i]["tag"];
      }

      for (var j = 0; j < tmp.length; j++) {
        tags.push(tmp[j]);
      }
    } //remove duplicate


    tags = dashCtrl.unique(tags);
    return tags;
  };

  dashCtrl.unique = function (list) {
    var uList = [];

    for (var i = 0; i < list.length; i++) {
      if (uList.indexOf(list[i]) < 0) {
        uList.push(list[i]);
      }
    }

    return uList;
  };

  dashCtrl.addExistingTag = function (tag) {
    //clear and give proper format to the tag list
    dashCtrl.processMultipleTags();
    var tagList = dashCtrl.info.tags.split(',');

    if (tagList.indexOf(tag) != -1) {
      return;
    }

    if (dashCtrl.info.tags == "") {
      dashCtrl.info.tags = tag;
    } else {
      dashCtrl.info.tags = dashCtrl.info.tags + ',' + tag;
    }

    dashCtrl.isAlphaNumeric();
  };

  dashCtrl.getBookOwnerName = function (book) {
    if (book["name"]) {
      if (dashCtrl.info.bookOwnerList && dashCtrl.info.bookOwnerList.length > 0) {
        for (var i = 0; i < dashCtrl.info.bookOwnerList.length; i++) {
          if (dashCtrl.info.bookOwnerList[i]["_id"] == book["owner"]) {
            return dashCtrl.info.bookOwnerList[i]["_name"];
          }
        }
      }
    } else if (book["dname"]) {
      return book["created_by"];
    }

    return "";
  };

  dashCtrl.getVisibility = function (book) {
    return book.dashboardSecurityInfo.is_public;
  };

  dashCtrl.getRoleAccessField = function (book) {
    if (book["name"]) {
      var dboard = dashCtrl.tableauDashboards;
      var dboardRemote = WorkbenchService.getWorkbooksLocal();

      if (dboard && dboard.length > 0) {
        for (var i = 0; i < dboardRemote.books.length; i++) {
          if (dboardRemote.books[i]['id'] === book.id) {
            for (j = 0; j < dboard.length; j++) {
              if (dboard[j]['d_id'] === book.id) {
                return dboard[j].role_access;
              }
            }
          }
        }
      }
    } else if (book["dname"]) {
      return book.dashboardSecurityInfo.is_public;
    }
  };

  dashCtrl.checkOwnerButton = function (book, check) {
    var checkFlag = false;

    if (check == "glassBeam") {
      checkFlag = true;
    }

    if (book["name"]) {
      if (book.gDOwner != metaDataService.getUserEmail()) {
        if (checkFlag && (dashCtrl.ifGlassbeamUser() || dashCtrl.ifWbDemoUser())) {
          return false;
        } else {
          return true;
        }
      }
    } else if (book["dname"]) {
      if (book.dashboardSecurityInfo.owner == "NA" || book.dashboardSecurityInfo.owner == "") {
        if (!metaDataService.getDashAdmin()) {
          if (checkFlag && (dashCtrl.ifGlassbeamUser() || dashCtrl.ifWbDemoUser())) {
            return false;
          } else {
            return true;
          }
        }
      } else if (book.dashboardSecurityInfo.owner != metaDataService.getUserEmail()) {
        if (checkFlag && (dashCtrl.ifGlassbeamUser() || dashCtrl.ifWbDemoUser())) {
          return false;
        } else {
          return true;
        }
      } else {
        if (checkFlag && (dashCtrl.ifGlassbeamUser() || dashCtrl.ifWbDemoUser())) {
          return false;
        } else {
          return true;
        }
      }
    }
  };

  dashCtrl.showDashBoard = function (book, type) {
    // hide tabs and delete btn for Internal dashboards
    if (book.typ == "Internal" && type == "delete") {
      return false;
    } else if (type == "delete") {
      type = "tags";
    }

    if (book.typ == "Internal" && type == "tabs") {
      return false;
    } else if (type == "tabs") {
      type = "tags";
    }

    if (dashCtrl.chkAdminFeature()) {
      switch (type) {
        case 'dashLevel':
          return true;

        case 'tags':
          return true;

        case 'changeOwner':
          return true;

        case 'public':
          if (book.visibility) {
            return false;
          } else {
            return true;
          }

        case 'private':
          if (book.visibility) {
            return true;
          } else {
            return false;
          }

      }
    } else if (book.gDOwner != metaDataService.getUserEmail()) {
      if (dashCtrl.ifGlassbeamUser()) {
        if (dashCtrl.chkAdminFeature()) {
          switch (type) {
            case 'dashLevel':
              return true;

            case 'tags':
              return false;

            case 'changeOwner':
              return true;

            case 'public':
              return false;

            case 'private':
              return false;
          }
        } else {
          switch (type) {
            case 'dashLevel':
              if (book.visibility) {
                return true;
              } else {
                return false;
              }

            case 'tags':
              return false;

            case 'changeOwner':
              return false;

            case 'public':
              return false;

            case 'private':
              return false;
          }
        }
      } else if (dashCtrl.ifWbDemoUser()) {
        switch (type) {
          case 'dashLevel':
            return true;

          case 'tags':
            return true;

          case 'changeOwner':
            return true;

          case 'public':
            return true;

          case 'private':
            return true;
        }
      } else if (dashCtrl.isPowerUser()) {
        switch (type) {
          case 'dashLevel':
            return true;

          case 'tags':
            return false;

          case 'changeOwner':
            return false;

          case 'public':
            return false;

          case 'private':
            return false;
        }
      } else {
        switch (type) {
          case 'dashLevel':
            var userInfo = metaDataService.getUser();

            if (book.role_access) {
              if (book.visibility && book.role_access.indexOf(userInfo['role']) != -1) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }

          case 'tags':
            return false;

          case 'changeOwner':
            return false;

          case 'public':
            return false;

          case 'private':
            return false;
        }
      }
    } else if (book.gDOwner == metaDataService.getUserEmail()) {
      switch (type) {
        case 'dashLevel':
          var userInfo = metaDataService.getUser();

          if (book.role_access.indexOf(userInfo['role']) != -1) {
            return true;
          } else {
            return false;
          }

        case 'tags':
          return true;

        case 'changeOwner':
          return true;

        case 'public':
          if (book.visibility) {
            return false;
          } else {
            return true;
          }

        case 'private':
          if (book.visibility) {
            return true;
          } else {
            return false;
          }

      }
    }
  };

  dashCtrl.getTitle = function (book, type) {
    if (book["name"]) {
      switch (type) {
        case 'changeOwner':
          if (dashCtrl.showDashBoard(book, type)) {
            return "Change Owner";
          } else {
            return "Admin Feature";
          }

        case 'public':
          if (book.visibility) {
            if (book.gDOwner == metaDataService.getUserEmail() || dashCtrl.chkAdminFeature()) {
              return "Public";
            } else {
              return "Admin Feature";
            }
          } else {
            if (book.gDOwner == metaDataService.getUserEmail() || dashCtrl.chkAdminFeature()) {
              return "Public";
            } else {
              return "Admin Feature";
            }
          }

        case 'private':
          if (!book.visibility) {
            if (book.gDOwner == metaDataService.getUserEmail() || dashCtrl.chkAdminFeature()) {
              return "Private";
            } else {
              return "Admin Feature";
            }
          } else {
            if (book.gDOwner == metaDataService.getUserEmail() || dashCtrl.chkAdminFeature()) {
              return "Private";
            } else {
              return "Admin Feature";
            }
          }

      }
    }
  };

  dashCtrl.checkAvailableAdmins = function (book) {
    if (book["name"]) {
      if (dashCtrl.dashOwnerListTableau) {
        if (dashCtrl.dashOwnerListTableau.length == 1 && dashCtrl.dashOwnerListTableau[0] == book.gDOwner) {
          return true;
        } else {
          return false;
        }
      }
    } else if (book["dname"]) {
      if (dashCtrl.dashOwnerListLogi) {
        if (dashCtrl.dashOwnerListLogi.length == 1 && dashCtrl.dashOwnerListLogi[0] == book.gDOwner) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  dashCtrl.logout = function () {
    if (getCookie("dashModeLogin") == "1" && InstanceHandler.getInstances().length == 0) {
      AppService.logoutSessionTimeout();
    } else {
      dashCtrl.modalInstance.close();
      sessionStorage.setItem("dash_mode", "false");
      document.getElementById("gb-full-page-loader").style.display = 'none';
    }
  };

  dashCtrl.getBookChangedOwnerName = function (book) {
    return book.dashboardSecurityInfo.owner;
  };

  dashCtrl.chkDashSchedulingFeature = function () {
    if (dashCtrl.info.tempSchFlag) {
      return true;
    } else {
      return false;
    }
  };

  dashCtrl.filterOnType = function (list) {
    var items = [];

    for (var i = 0; i < list.length; i++) {
      if (dashCtrl.info.dType == 'internalDashboards') {
        if (list[i].dname) items.push(list[i]);
      } else if (dashCtrl.info.dType == 'userCreatedDashboards') {
        if (list[i].name) items.push(list[i]);
      }
    }

    return items;
  };

  dashCtrl.filterOnCreator = function (list) {
    var items = [];

    for (var i = 0; i < list.length; i++) {
      if (dashCtrl.info.createdBy != 'All' && dashCtrl.info.createdBy) {
        if (list[i].gDUser == dashCtrl.info.createdBy) items.push(list[i]);
      }
    }

    return items;
  };

  dashCtrl.filterOnOwner = function (list) {
    var items = [];

    for (j = 0; j < dashCtrl.info.ownerFilter.length; j++) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].gDOwner.indexOf(dashCtrl.info.ownerFilter[j]) != -1) {
          items.push(list[i]);
        }
      }
    }

    return items;
  };

  dashCtrl.filterOnLastModified = function (list) {
    var items = [];

    for (var i = 0; i < list.length; i++) {
      if (dashCtrl.info.lastModified != 'All' && dashCtrl.info.lastModified) {
        var d1 = new Date();
        var d2 = new Date(list[i].modified_ts);

        switch (dashCtrl.info.lastModified) {
          case "24hrs":
            if (dashCtrl.date_diff_indays(d2, d1) <= 1) {
              items.push(list[i]);
            }

            break;

          case "week":
            if (dashCtrl.date_diff_indays(d2, d1) <= 7) {
              items.push(list[i]);
            }

            break;

          case "month":
            if (dashCtrl.date_diff_indays(d2, d1) <= 30) {
              items.push(list[i]);
            }

            break;

          case "6month":
            if (dashCtrl.date_diff_indays(d2, d1) <= 180) {
              items.push(list[i]);
            }

            break;
        }
      }
    }

    return items;
  };

  dashCtrl.date_diff_indays = function (date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  };

  dashCtrl.filterOnDatasource = function (list) {
    var items = [];

    for (j = 0; j < dashCtrl.info.datasourceFilter.length; j++) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].datasource) {
          if (list[i].datasource[0].name.indexOf(dashCtrl.info.datasourceFilter[j]) != -1) {
            items.push(list[i]);
            break;
          }
        }
      }
    }

    return items;
  };

  dashCtrl.filterOnTags = function (list) {
    var items = [];

    for (j = 0; j < dashCtrl.info.tagsFilter.length; j++) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].tag.indexOf(dashCtrl.info.tagsFilter[j]) != -1) {
          items.push(list[i]);
          break;
        }
      }
    }

    items = dashCtrl.unique(items);
    return items;
  };

  dashCtrl.getNameOfDashboard = function (record, len) {
    var name = "";

    if (record.name) {
      if (len) {
        if (record.name.length > len) {
          name = record.name.substr(0, len) + "...";
        } else {
          name = record.name;
        }
      } else {
        name = record.name;
      }
    } else if (record.dname) {
      if (len) {
        if (record.dname.length > len) {
          name = record.dname.substr(0, len) + "...";
        } else {
          name = record.dname;
        }
      } else {
        name = record.dname;
      }
    }

    name = name.toLowerCase();
    return name;
  };

  dashCtrl.localFilter = function () {// if(dashCtrl.info.page['current'] > 0){
    //     dashCtrl.firstPage();
    // }
  };

  dashCtrl.changeView = function (view) {
    dashCtrl.info.currentView = view;
    dashCtrl.info.currentBook = null; // if(dashCtrl.info.currentView == 'list'){
    //     dashCtrl.info.page['count'] = 15;
    // }else if(dashCtrl.info.currentView == 'thumbnail'){
    //     dashCtrl.info.page['count'] = 50;
    // }
    // if(dashCtrl.info.page['current'] > 0){
    //     dashCtrl.firstPage();
    // }
  };

  dashCtrl.addTagInternalDashboards = function (book) {
    dashCtrl.info.selectedBooks = book["d_id"];
    dashCtrl.modalInstance = $modal.open({
      templateUrl: 'partials/dashboards_internal_add_tag_workbook.html',
      scope: $scope
    });
  };

  dashCtrl.hideModal = function () {
    dashCtrl.info.tags = "";

    if (dashCtrl.modalInstance) {
      dashCtrl.modalInstance.close('ok');
    }
  };

  dashCtrl.addTagSingle = function () {
    if (dashCtrl.info.tags && dashCtrl.info.selectedBooks) {
      var tempObj = [];
      var tempArray = [];

      for (i = 0; i < dashCtrl.info.selectedBooks.length; i++) {
        if (dashCtrl.info.selectedBooks[i].d_id) {
          tempObj[i].did = dashCtrl.info.selectedBooks[i].d_id;
          tempObj[i].rids = [];

          for (j = 0; j < dashCtrl.info.selectedBooks[i].reports.length; j++) {
            tempArray.push(dashCtrl.info.selectedBooks[i].reports[j].r_id);
          }

          tempObj[i].rids = tempArray.join(",");
        }

        tempArray = [];
      }

      var param = {
        tagging: {
          drids: tempObj,
          tags: dashCtrl.info.tags
        }
      };
      dashCtrl.info.loading = true; // for(i=0;i<dashCtrl.info.selectedBooks.length;i++){
      //     dashCtrl.info.selectedBooks[i].visibility = !dashCtrl.info.selectedBooks[i].visibility;
      //     dashCtrl.changeVisibility(dashCtrl.info.selectedBooks[i]);
      //     dashCtrl.info.selectedBooks[i].visibility = !dashCtrl.info.selectedBooks[i].visibility;
      // }

      Dashboards.addTagsToDashboards(param).then(function (response) {
        dashCtrl.getAllDeatils();
        dashCtrl.hideModal();
        dashCtrl.info.selectedBooks = "";
        dashCtrl.info.tags = "";
        dashCtrl.info.loading = false;
      }, function (error) {
        dashCtrl.hideModal();
        dashCtrl.info.selectedBooks = "";
        dashCtrl.info.tags = "";
        dashCtrl.info.loading = false;
      });
    }
  };

  dashCtrl.showAddTagsDd = function () {
    var list = dashCtrl.dashboards;

    for (var i = 0; i < list.length; i++) {
      if (list[i]['selected']) {
        return true;
      }
    }

    return false;
  };

  dashCtrl.showMsg = function () {
    if (dashCtrl.info.errMsg == "") {
      return false;
    } else {
      return true;
    }
  };

  dashCtrl.isAlphaNumeric = function () {
    var all_tags_name = dashCtrl.info.tags.split(/,|\s/),
        duplicateTagname = [],
        error = false;

    if (dashCtrl.info.tags == "") {
      dashCtrl.info.errMsg = "";
      return;
    }

    var allTags = dashCtrl.getAllTagsNameOfSelectedDashboards();

    for (var j = 0; j < all_tags_name.length; j++) {
      var tag_name = all_tags_name[j];

      if (tag_name == "") {
        continue;
      } else if (tag_name.length > dashCtrl.info.tag_max_characters) {
        error = true;
        dashCtrl.info.errMsg = GlobalService.getVal('dashboard_tagname_max_len');
        return;
      } else if (!tag_name.match(/^[0-9a-zA-Z]+$/)) {
        error = true;
        dashCtrl.info.errMsg = GlobalService.getVal('dashboard_tagname_special_char');
        return;
      } //check for duplicate


      for (var i = 0; i < allTags.length; i++) {
        if (allTags[i] == tag_name) {
          error = true;
          duplicateTagname.push(tag_name);
        }
      }
    }

    if (duplicateTagname.length > 0) {
      dashCtrl.info.errMsg = GlobalService.getVal('dashboard_tagbname_duplicate') + duplicateTagname.join(', ');
      return;
    } else if (!error) {
      dashCtrl.info.errMsg = "";
      return;
    }
  };

  dashCtrl.addTagsMultiple = function () {
    //fetch d_id of all selcted dashbaords
    var list = dashCtrl.getAllDashboards();
    dashCtrl.processMultipleTags();
    dashCtrl.info.selectedBooks = [];

    for (var i = 0; i < list.length; i++) {
      if (list[i]['selected'] && list[i]['d_id']) {
        dashCtrl.info.selectedBooks.push(list[i]);
      }
    }

    if (dashCtrl.info.tags && dashCtrl.info.selectedBooks.length > 0) {
      var tempObj = [];
      var tempArray = [];

      for (i = 0; i < dashCtrl.info.selectedBooks.length; i++) {
        if (dashCtrl.info.selectedBooks[i].d_id) {
          tempObj[i] = {};
          tempObj[i].did = dashCtrl.info.selectedBooks[i].d_id;
          tempObj[i].rids = [];

          for (j = 0; j < dashCtrl.info.selectedBooks[i].reports.length; j++) {
            tempArray.push(dashCtrl.info.selectedBooks[i].reports[j].r_id);
          }

          tempObj[i].rids = tempArray.join(",");
        }

        tempArray = [];
      }

      var param = {
        tagging: {
          drids: tempObj,
          tags: dashCtrl.info.tags
        }
      }; // dashCtrl.info.loadinaddTagsMultipleg = true;
      // for(i=0;i<dashCtrl.info.selectedBooks.length;i++){
      //     dashCtrl.info.selectedBooks[i].visibility = !dashCtrl.info.selectedBooks[i].visibility;
      //     dashCtrl.changeVisibility(dashCtrl.info.selectedBooks[i]);
      //     dashCtrl.info.selectedBooks[i].visibility = !dashCtrl.info.selectedBooks[i].visibility;
      // }

      dashCtrl.info.loading = true;
      Dashboards.addTagsToDashboards(param).then(function (response) {
        dashCtrl.logActivity('Other Dashboards', 'Add Tags', '{\'' + dashCtrl.info.tags + '\'}');
        var updateDone = false;
        var count = 0;
        var dateToUpdate = new Date();
        var tagArray = dashCtrl.info.tags.split(",");

        for (i = 0; i < dashCtrl.dashboards.length; i++) {
          for (j = 0; j < dashCtrl.info.selectedBooks.length; j++) {
            if (dashCtrl.dashboards[i].d_id == dashCtrl.info.selectedBooks[j].d_id) {
              dashCtrl.dashboards[i].modified_ts = dateToUpdate.toISOString();
              dashCtrl.dashboards[i].modified_ts_to_display = moment(dashCtrl.dashboards[i].modified_ts).format("YYYY-MM-DD HH:MM:SS");
              dashCtrl.dashboards[i].tag = dashCtrl.dashboards[i].tag.concat(tagArray);
              count++;
            }
          }

          if (count == dashCtrl.info.selectedBooks.length) {
            dashCtrl.actionMessage = response.data.Msg;
            dashCtrl.actionMessageFlag = true;
            dashCtrl.reloadData();
          }
        }
      }, function (error) {
        dashCtrl.hideModal();
        dashCtrl.info.selectedBooks = [];
        dashCtrl.info.tags = "";
        dashCtrl.info.loading = false;
      });
    }

    $('#gb-add-tag-dd-container .dropdown-toggle').dropdown('toggle');
  };

  dashCtrl.processMultipleTags = function () {
    //trim first and last space(s)
    dashCtrl.info.tags = dashCtrl.info.tags.trim(); //check if spaces are there within the strings

    dashCtrl.info.tags = dashCtrl.info.tags.replace(/ {1,}/g, " "); //if space found remove a space or multiple spaces with a comma

    dashCtrl.info.tags = dashCtrl.info.tags.replace(/ /g, ","); //replace continues mulitpl comma with a single comma

    dashCtrl.info.tags = dashCtrl.info.tags.replace(/,{1,}/g, ","); //remove comma if it happend on as first character

    dashCtrl.info.tags = dashCtrl.info.tags.replace(/^,/, ''); //remove comma if it happend on as last character

    dashCtrl.info.tags = dashCtrl.info.tags.replace(/,$/, '');
  };

  dashCtrl.showDashboardTileFrame = function (book) {
    if (!book.visibility && dashCtrl.checkOwnerButton(book)) {} else {
      dashCtrl.info.currentView = 'frames';
      dashCtrl.info.currentBook = book;
    }
  };

  dashCtrl.getReportList = function () {
    var book = dashCtrl.info.currentBook;

    if (book.reports) {
      list = book.reports;
    } // if(book.views) {
    //     list = book.views;
    // }                


    return list;
  };

  dashCtrl.internalDashboards = function () {
    book = dashCtrl.info.currentBook;

    if (book.reports) {
      return true;
    }

    return false;
  };

  dashCtrl.getReportName = function (report) {
    if (report.rname) {
      return report.rname;
    }

    if (report.name) {
      return report.name;
    }
  };

  dashCtrl.openSettingsMenu = function (event) {
    var menu = $(event.currentTarget);

    if (!menu.hasClass('open')) {
      menu.addClass('open');
    } else {
      menu.removeClass('open');
    }
  };

  dashCtrl.changeDateFormate = function (dDate) {
    if (!dDate) return "";
    var todayTime = new Date(dDate);
    if (!todayTime) return "";
    var month = dashCtrl.makeTwoDigit(todayTime.getMonth() + 1);
    var day = dashCtrl.makeTwoDigit(todayTime.getDate());
    var year = dashCtrl.makeTwoDigit(todayTime.getFullYear());
    var hours = dashCtrl.makeTwoDigit(todayTime.getHours());
    var minutes = dashCtrl.makeTwoDigit(todayTime.getMinutes());
    var seconds = dashCtrl.makeTwoDigit(todayTime.getSeconds());
    return month + "-" + day + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
  };

  dashCtrl.makeTwoDigit = function (item) {
    item = parseInt(item, 10);

    if (item < 10) {
      item = "0" + item;
    }

    return item;
  };
  /*
   * pagination
   *
   * */
  // Populates the page object with the latest data.


  function paginator(count) {
    dashCtrl.info.page['total'] = count;
    dashCtrl.info.page['pages'] = Math.ceil(dashCtrl.info.page['total'] / dashCtrl.info.page['count']);

    if (!dashCtrl.selectAllFlag) {
      for (i = 0; i < dashCtrl.info.page['pages']; i++) {
        dashCtrl.info.page.selectAll[i] = false;
        dashCtrl.info.page.unSelectAll[i] = false;
      }

      dashCtrl.selectAllFlag = true;
    }
  }

  $scope.$watch('dashCtrl.info.page["total"]', function (newValue, oldValue, scope) {
    if (newValue != oldValue) {
      dashCtrl.selectAllFlag = false;
    }
  });
  $scope.$watch('dashCtrl.info.page.current', function (newValue, oldValue, scope) {
    if (newValue != oldValue) {
      for (j = 0; j < dashCtrl.gAllDashboards.length; j++) {
        dashCtrl.gAllDashboards[j].selected = false;
      }
    }
  }); // Navigates to next page of results
  // dashCtrl.nextPage = function () {
  //     if (dashCtrl.info.page['current'] < dashCtrl.info.page['pages'] - 1) {
  //         dashCtrl.info.page['current'] += 1;
  //         dashCtrl.getAllDashboards();
  //     }
  // };
  // // Navigate to previous page of results
  // dashCtrl.prevPage = function () {
  //     if (dashCtrl.info.page['current'] > 0) {
  //         dashCtrl.info.page['current'] -= 1;
  //         dashCtrl.getAllDashboards();
  //     }
  // };

  dashCtrl.showCheckTag = function (tag) {
    for (i = 0; i < dashCtrl.info.tagsFilter.length; i++) {
      if (tag == dashCtrl.info.tagsFilter[i]) {
        return true;
      }
    }

    return false;
  };

  dashCtrl.showCheckOwner = function (owner) {
    for (i = 0; i < dashCtrl.info.ownerFilter.length; i++) {
      if (owner == dashCtrl.info.ownerFilter[i]) {
        return true;
      }
    }

    return false;
  };

  dashCtrl.showCheckDatasource = function (datasource) {
    for (i = 0; i < dashCtrl.info.datasourceFilter.length; i++) {
      if (datasource == dashCtrl.info.datasourceFilter[i]) {
        return true;
      }
    }

    return false;
  }; // // Navigate to first page of results
  // dashCtrl.firstPage = function () {
  //     if (dashCtrl.info.page['current'] == 0)
  //         return;
  //     dashCtrl.info.page['current'] = 0;
  //     dashCtrl.getAllDashboards();
  // };
  // // Navigate to last page of results
  // dashCtrl.lastPage = function () {
  //     if (dashCtrl.info.page['current'] == dashCtrl.info.page['pages'] - 1)
  //         return;
  //     dashCtrl.info.page['current'] = dashCtrl.info.page['pages'] - 1;
  //     dashCtrl.getAllDashboards();
  // };


  dashCtrl.getValue = function (key) {
    return GlobalService.getVal(key);
  };

  dashCtrl.deleteWorkbook = function () {
    dashCtrl.info.loading = true;
    GBDashboardService.deleteWorkbook(dashCtrl.selectedDashboard).then(function (response) {
      dashCtrl.logActivity('Other Dashboards', 'Delete Workbook', '{\'' + dashCtrl.selectedDashboard.dname + '\'}');

      for (i = 0; i < dashCtrl.dashboards.length; i++) {
        if (dashCtrl.selectedDashboard.d_id == dashCtrl.dashboards[i].d_id) {
          dashCtrl.dashboards.splice(i, 1);
          break;
        }
      }

      dashCtrl.actionMessage = response.data.Msg;
      dashCtrl.actionMessageFlag = true;
      dashCtrl.reloadData();
      dashCtrl.modalInstance.close();
      dashCtrl.modalInstance;
      dashCtrl.selectedDashboard = "";
    }, function (response) {
      dashCtrl.info.loading = false;
      dashCtrl.modalInstance.close();
      dashCtrl.selectedDashboard = "";
    });
  };

  dashCtrl.renderHtml = function (html) {
    return $sce.trustAsHtml(html);
  };

  function successHandler(response) {}

  function sessionTimeOutHandler(response) {
    if (!dashCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
      dashCtrl.info.sessionTimedOut = true;
      ModalService.sessionTimeout();
      return true;
    }
  }

  function setWorkbookLoadStatus(bool) {
    var workbook = WorkbenchService.getWorkbooksLocal();
    workbook['loading'] = bool;
    WorkbenchService.setWorkbooksLocal(workbook);
  }

  AppService.hidePanelLoading(); // Function to clear all messages

  $scope.clearMessage = function () {
    dashCtrl.workbenchDown = false;
  };

  $scope.showPanel = function () {
    $scope.showFilterPanel = !$scope.showFilterPanel;
    $('#gbDashboard-filter-panel-body .panel-collapse').collapse('hide'); // if(dashCtrl.info.filter && Object.keys(dashCtrl.info.filter).length > 0){
    //     $scope.filterApplied = true;
    //     $scope.showIndividualFilterCount = true;
    // }
    // resetFiltersExpanded();
  };

  var resetFiltersExpanded = function resetFiltersExpanded() {
    dashCtrl.info.filtersExpanded.type = false;
    dashCtrl.info.filtersExpanded.createdBy = false;
    dashCtrl.info.filtersExpanded.owner = false;
    dashCtrl.info.filtersExpanded.datasource = false;
    dashCtrl.info.filtersExpanded.lastModified = false;
    dashCtrl.info.filtersExpanded.tagsFilter = false;
  };

  $scope.updateFilter = function (params) {
    // dashCtrl.info.pagination.currentPage = 1;
    dashCtrl.logActivity(params.dashboardType, params.filterType, params.filterName); // dashCtrl.firstPage();
    // dashCtrl.getAllDashboards();
    // dashCtrl.logActivity(params.dashboardType, params.filterType, params.filterName);
    // if(params.type=="tagsFilter"){
    //     if(dashCtrl.info[params.type].indexOf(params.value) != -1){
    //         dashCtrl.info[params.type].splice(dashCtrl.info[params.type].indexOf(params.value),1);
    //     }else {
    //         dashCtrl.info[params.type].push(params.value);
    //     }
    //     dashCtrl.info[params.type] = dashCtrl.unique(dashCtrl.info[params.type]);
    // }else {
    //     dashCtrl.info[params.type] = params.value;    
    // }
    // if(dashCtrl.info[params.type] !== 'All' && dashCtrl.info[params.type] != 'allDashboards'){
    //     dashCtrl.info.filter[params.type] = [dashCtrl.info[params.type]];
    // }else if(dashCtrl.info[params.type] == 'allDashboards') {
    //     delete dashCtrl.info.filter[params.type] ;
    // }
    // $scope.filterCount = Object.keys(dashCtrl.info.filter).length;
  };

  $scope.showFilterCount = function () {
    $scope.filterCount = Object.keys(dashCtrl.info.filter).length;
  };

  $scope.checkAppliedFilters = function () {
    if (dashCtrl.info.filter) {
      if (Object.keys(dashCtrl.info.filter).length != 0) {
        return true;
      }

      return false;
    }
  };

  $scope.clearAppliedFilters = function () {
    dashCtrl.info.dType = 'allDashboards';
    dashCtrl.info.createdBy = 'All';
    dashCtrl.info.owner = 'All';
    dashCtrl.info.datasource = 'All';
    dashCtrl.info.lastModified = 'All';
    dashCtrl.info.tagsFilter = [];
    dashCtrl.info.filter = {};
    $scope.filterApplied = false;
  };

  dashCtrl.info.changePage = function (filterInfo, sortInfo) {
    var me = this;
    var filterredData = angular.copy(dashCtrl.dashboards); //filter data

    filterredData = dashCtrl.info.applyFilter(filterredData, filterInfo);
    if (!filterredData.length) return []; //group data by column

    groupedData = dashCtrl.info.groupbyColumn(filterredData); //sort data

    if (sortInfo) {
      filterredData = dashCtrl.info.pagination.sortByColumn(sortInfo, filterredData);
    }

    dashCtrl.info.pagination.data = filterredData; //dashCtrl.info.pagination.data = angular.copy(filterredData);

    dashCtrl.info.pagination.process();
    return dashCtrl.info.pagination.currentRecordsSet;
  }, dashCtrl.info.changePageSize = function (filterInfo, sortInfo, pageSize) {
    var me = this;
    var filterredData = angular.copy(dashCtrl.dashboards); //filter data

    if (filterInfo && filterInfo.length) {
      filterredData = dashCtrl.info.applyFilter(filterredData, filterInfo);
    }

    if (!filterredData.length) return []; //group data by column

    groupedData = dashCtrl.info.groupbyColumn(filterredData); //sort data

    if (sortInfo) {
      filterredData = dashCtrl.info.pagination.sortByColumn(sortInfo, filterredData);
    }

    if (pageSize > filterredData.length) {
      dashCtrl.info.pagination.endIndex = filterredData.length;
    } else {
      dashCtrl.info.pagination.endIndex = pageSize;
    }

    var msg = true;
    dashCtrl.info.pagination.init(angular.copy(filterredData));
    return dashCtrl.info.pagination.currentRecordsSet;
  };

  dashCtrl.info.applyFilter = function (list, filterList) {
    list = GBDashboardService.filterDashboardsNameTags(list, dashCtrl.info.query);

    var isInTimerange = function isInTimerange(timeRange, targetDateTime) {
      var ts = new Date().getTime();
      var oneDay = 24 * 60 * 60 * 1000;
      var st, et;

      switch (timeRange) {
        case 'Last 24 Hrs':
          var tsYesterday = ts - oneDay;
          st = new Date(tsYesterday);
          et = new Date();
          break;

        case 'Last Week':
          var lastweek = ts - 7 * oneDay;
          st = new Date(lastweek);
          et = new Date();
          break;

        case 'Last Month':
          var lastmonth = ts - 30 * oneDay;
          st = new Date(lastmonth);
          et = new Date();
          break;

        case 'Last 6 Month':
          var last6month = ts - 6 * 30 * oneDay;
          st = new Date(last6month);
          et = new Date();
          break;
      }

      var currentDataTimeStr = new Date(targetDateTime);
      var range = moment(currentDataTimeStr).isBetween(st, et);

      if (range) {
        return true;
      }

      return false;
    };

    return list.filter(function (item) {
      for (var i = 0; i < filterList.length; i++) {
        var innerFound = false;
        var columnName = filterList[i]['columnName'];
        var columnValueList = filterList[i]['columnValue']; //check if time filter is there then do time comparision

        if (columnName === 'modified_ts') {
          if (columnValueList && columnValueList[0]) {
            var targetDateTime = columnValueList[0];

            if (isInTimerange(targetDateTime, item[columnName])) {
              innerFound = true;
            }
          }
        } else if (columnName === 'datasource') {
          for (var j = 0; j < columnValueList.length; j++) {
            if (item[columnName] && item[columnName][0] && item[columnName][0]['name'] == columnValueList[j]) {
              innerFound = true;
            }
          }
        } else if (columnName === 'tag') {
          for (var j = 0; j < columnValueList.length; j++) {
            if (item[columnName] && item[columnName].length && item[columnName].indexOf(columnValueList[j]) != -1) {
              innerFound = true;
            }
          }
        } else {
          for (var j = 0; j < columnValueList.length; j++) {
            if (item[columnName] == columnValueList[j]) {
              innerFound = true;
            }
          }
        }

        if (!innerFound) {
          return false;
        }
      }

      return true;
    });
  };

  dashCtrl.info.groupbyColumn = function (dbData) {
    var columnFiltersName = [{
      columnName: 'type_to_display',
      columnTitle: "Type",
      customSelect: false,
      multiselect: false,
      data: []
    }, {
      columnName: 'modified_ts',
      columnTitle: "Last Modified",
      customSelect: true,
      multiselect: false,
      data: GlobalService.getVal("lastModifiedArray")
    }, {
      columnName: 'gDOwner',
      columnTitle: "Owner",
      customSelect: false,
      multiselect: true,
      data: []
    }, {
      columnName: 'datasource',
      columnTitle: "Data Sources",
      customSelect: false,
      multiselect: true,
      data: []
    }, {
      columnName: 'tag',
      columnTitle: "Tags",
      customSelect: false,
      multiselect: true,
      data: []
    }];

    var addItemToListWithCount = function addItemToListWithCount(list, item) {
      var found = false;

      if (list.length == 0) {
        list.push(item);
      } else {
        //increase count if it has match or add as a new item
        //check if it is new
        for (var i = 0; i < list.length; i++) {
          if (list[i]['name'] == item.name) {
            list[i]['count'] += 1;
            found = true;
            break;
          }
        }

        if (!found) {
          list.push(item);
        }
      }
    };

    var tmp = {};
    dbData.map(function (game) {
      if (game['type_to_display']) {
        tmp = {
          name: game['type_to_display'],
          count: 1,
          selected: false
        };
        addItemToListWithCount(columnFiltersName[0].data, tmp);
      }

      if (game['gDOwner']) {
        tmp = {
          name: game['gDOwner'],
          count: 1,
          selected: false
        };
        addItemToListWithCount(columnFiltersName[2].data, tmp);
      } // if (game['datasource']) {
      //     tmp = {
      //         name: game['datasource'][0]['name'],
      //         count: 1,
      //         selected : false
      //     }
      //     addItemToListWithCount(columnFiltersName[3].data, tmp);
      // }


      if (game['tag']) {
        var tagList = game['tag'];

        for (var i = 0; i < tagList.length; i++) {
          tmp = {
            name: tagList[i],
            count: 1,
            selected: false
          };
          addItemToListWithCount(columnFiltersName[4].data, tmp);
        }
      }
    });
    return columnFiltersName;
  };
}]).controller('SubscribeController', ['$scope', 'content', 'schedules', '$modalInstance', 'WorkbenchService', 'ModalService', 'x2js', function ($scope, content, schedules, $modalInstance, WorkbenchService, ModalService, x2js) {
  var subscribeCtrl = this;
  subscribeCtrl.schedules = schedules;
  subscribeCtrl.schedule = schedules[0];
  subscribeCtrl.content = content;
  subscribeCtrl.emailSubject = content.name;

  subscribeCtrl.hideModal = function () {
    $modalInstance.close('ok');
  };

  subscribeCtrl.subscribe = function () {
    var data = {
      subject: subscribeCtrl.emailSubject,
      content_type: !!content.hasOwnProperty('views') ? 'Workbook' : 'View',
      content_id: content.id,
      schedule_id: subscribeCtrl.schedule._id
    };
    setWorkbookLoadStatus(true);
    WorkbenchService.createSubscription(data).then(function (response) {
      setWorkbookLoadStatus(false);
      var result = x2js.xml_str2json(response.data)['tsResponse'];

      if (result.hasOwnProperty('subscription')) {
        var subscriptionsList = WorkbenchService.getSubscriptionsList();
        subscriptionsList.push(result['subscription']);
        WorkbenchService.setSubscriptionsList(subscriptionsList);
        ModalService.alertBox({
          msg: 'Subscribed successfully'
        });
      } else {
        ModalService.alertBox({
          msg: 'Unable to subscribe'
        });
      }
    }, function (response) {
      setWorkbookLoadStatus(false);
      ModalService.alertBox({
        msg: 'Unable to subscribe'
      });
    });
    subscribeCtrl.hideModal();
  };

  function setWorkbookLoadStatus(bool) {
    var workbook = WorkbenchService.getWorkbooksLocal();
    workbook['loading'] = bool;
    WorkbenchService.setWorkbooksLocal(workbook);
  }
}]).controller('UpdateSubscriptionController', ['$scope', 'content', 'schedules', 'subscription', '$modalInstance', 'WorkbenchService', 'ModalService', 'x2js', function ($scope, content, schedules, subscription, $modalInstance, WorkbenchService, ModalService, x2js) {
  var subscribeCtrl = this;

  subscribeCtrl.hideModal = function () {
    $modalInstance.close('ok');
  };

  if (!Array.isArray(subscription) || subscription.length != 1) {
    subscribeCtrl.hideModal();
    ModalService.alertBox({
      msg: 'Subscription not found'
    });
    return;
  }

  subscription = subscription[0];
  subscribeCtrl.schedules = schedules;
  subscribeCtrl.content = content;
  subscribeCtrl.emailSubject = subscription._subject;

  for (var i = 0; i < schedules.length; i++) {
    if (schedules[i]._id == subscription.schedule._id) {
      subscribeCtrl.schedule = schedules[i];
    }
  }

  subscribeCtrl.updateSubscription = function () {
    var data = {
      new_subject: subscribeCtrl.emailSubject,
      new_schedule_id: subscribeCtrl.schedule._id
    };
    setWorkbookLoadStatus(true);
    WorkbenchService.updateSubscription(subscription._id, data).then(function (response) {
      setWorkbookLoadStatus(false);
      var result = x2js.xml_str2json(response.data)['tsResponse'];

      if (result.hasOwnProperty('subscription')) {
        var subscriptionsList = WorkbenchService.getSubscriptionsList();

        for (var i = 0; i < subscriptionsList.length; i++) {
          if (subscriptionsList[i]._id == subscription._id) {
            subscriptionsList[i] = result['subscription'];
            break;
          }
        }

        WorkbenchService.setSubscriptionsList(subscriptionsList);
        ModalService.alertBox({
          msg: 'Updated subscription successfully'
        });
      } else {
        ModalService.alertBox({
          msg: 'Unable to update subscription'
        });
      }
    }, function (response) {
      setWorkbookLoadStatus(false);
      ModalService.alertBox({
        msg: 'Unable to update subscription'
      });
    });
    subscribeCtrl.hideModal();
  };

  function setWorkbookLoadStatus(bool) {
    var workbook = WorkbenchService.getWorkbooksLocal();
    workbook['loading'] = bool;
    WorkbenchService.setWorkbooksLocal(workbook);
  }
}]).controller('UnsubscribeController', ['$scope', 'content', 'subscription', '$modalInstance', 'WorkbenchService', 'ModalService', 'x2js', function ($scope, content, subscription, $modalInstance, WorkbenchService, ModalService, x2js) {
  var subscribeCtrl = this;

  subscribeCtrl.hideModal = function () {
    $modalInstance.close('ok');
  };

  if (!Array.isArray(subscription) || subscription.length != 1) {
    subscribeCtrl.hideModal();
    ModalService.alertBox({
      msg: 'Subscription not found'
    });
    return;
  }

  subscription = subscription[0];
  subscribeCtrl.content = content;

  subscribeCtrl.unsubscribe = function () {
    setWorkbookLoadStatus(true);
    WorkbenchService.deleteSubscription(subscription._id).then(function (response) {
      setWorkbookLoadStatus(false);

      if (!response.data) {
        var subscriptionsList = WorkbenchService.getSubscriptionsList();
        var subscriptionIndex = 0;

        for (var i = 0; i < subscriptionsList.length; i++) {
          if (subscriptionsList[i]._id == subscription._id) {
            subscriptionIndex = i;
            break;
          }
        }

        subscriptionsList.splice(subscriptionIndex, 1);
        WorkbenchService.setSubscriptionsList(subscriptionsList);
        ModalService.alertBox({
          msg: 'Unsubscribed successfully'
        });
      } else {
        ModalService.alertBox({
          msg: 'Unable to unsubscribe'
        });
      }
    }, function (response) {
      setWorkbookLoadStatus(false);
      ModalService.alertBox({
        msg: 'Unable to unsubscribe'
      });
    });
    subscribeCtrl.hideModal();
  };

  function setWorkbookLoadStatus(bool) {
    var workbook = WorkbenchService.getWorkbooksLocal();
    workbook['loading'] = bool;
    WorkbenchService.setWorkbooksLocal(workbook);
  }
}]).controller('AddTagController', ['$scope', 'workbook', '$modalInstance', 'WorkbenchService', 'ModalService', 'Dashboards', function ($scope, workbook, $modalInstance, WorkbenchService, ModalService, Dashboards) {
  var addTagCtrl = this;
  addTagCtrl.info = {};
  addTagCtrl.workbook = workbook;
  addTagCtrl.tagList = [{
    tagName: ""
  }];

  addTagCtrl.addTagRow = function () {
    addTagCtrl.tagList.push({
      tagName: ""
    });
  };

  addTagCtrl.hideModal = function () {
    $modalInstance.close('ok');
  };

  addTagCtrl.addTagToWorkbook = function () {
    var tagsToAdd = [];
    angular.forEach(addTagCtrl.tagList, function (tag) {
      if (!!tag.tagName.length) {
        tagsToAdd.push(tag.tagName);
      }
    });

    if (!!tagsToAdd.length) {
      setWorkbookLoadStatus(true);
      WorkbenchService.addTagsToWorkbook(addTagCtrl.workbook.id, tagsToAdd).then(function (response) {
        setWorkbookLoadStatus(false);
        WorkbenchService.updateWorkbooks();
      }, function (response) {
        setWorkbookLoadStatus(false);
        sessionTimeOutHandler(response);
      });
    }

    addTagCtrl.hideModal();
  };

  function setWorkbookLoadStatus(bool) {
    var workbook = WorkbenchService.getWorkbooksLocal();
    workbook['loading'] = bool;
    WorkbenchService.setWorkbooksLocal(workbook);
  }

  function sessionTimeOutHandler(response) {
    if (!addTagCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
      addTagCtrl.info.sessionTimedOut = true;
      addTagCtrl.hideModal();
      ModalService.sessionTimeout();
    }
  }
}]).controller('UpdateWorkbookController', ['$scope', 'workbook', '$modalInstance', 'WorkbenchService', 'metaDataService', 'x2js', 'ModalService', function ($scope, workbook, $modalInstance, WorkbenchService, metaDataService, x2js, ModalService) {
  var updateWorkbookCtrl = this;
  updateWorkbookCtrl.workbook = workbook;
  updateWorkbookCtrl.info = {};
  updateWorkbookCtrl.info.usersLoading = true;
  updateWorkbookCtrl.info.showTabs = updateWorkbookCtrl.workbook.tabs == true ? true : false;
  WorkbenchService.getUsers().then(function (response) {
    updateWorkbookCtrl.info.usersLoading = false;
    var users = x2js.xml_str2json(response.data)['tsResponse']['users']['user'];

    if (Array.isArray(users)) {
      updateWorkbookCtrl.info.supportedUsers = [];

      for (var i in users) {
        if (users[i]['_name'] != WorkbenchService.getTableauUser() && users[i]['_siteRole'] != "ServerAdministrator") {
          updateWorkbookCtrl.info.supportedUsers.push(users[i]);
        }
      }

      if (!!updateWorkbookCtrl.info.supportedUsers.length) {
        updateWorkbookCtrl.info.changeOwner = true;
        updateWorkbookCtrl.info.changedOwner = "";
      } else {
        updateWorkbookCtrl.info.changeOwner = false;
      }
    } else {
      updateWorkbookCtrl.info.changeOwner = false;
    }
  }, function (response) {
    updateWorkbookCtrl.info.usersLoading = false;
    sessionTimeOutHandler(response);
  });

  updateWorkbookCtrl.hideModal = function () {
    $modalInstance.close('ok');
  };

  updateWorkbookCtrl.updateWorkbook = function () {
    var data = {
      bookId: updateWorkbookCtrl.workbook.id,
      showTabs: updateWorkbookCtrl.info.showTabs
    };

    if (updateWorkbookCtrl.info.changeOwner && updateWorkbookCtrl.info.changedOwner) {
      data['newOwnerId'] = updateWorkbookCtrl.info.changedOwner['_id'];
    }

    setWorkbookLoadStatus(true);
    WorkbenchService.updateWorkbook(data).then(function (response) {
      setWorkbookLoadStatus(false);
      WorkbenchService.updateWorkbooks();
    }, function (response) {
      setWorkbookLoadStatus(false);
      sessionTimeOutHandler(response);
    });
    updateWorkbookCtrl.hideModal();
  };

  function setWorkbookLoadStatus(bool) {
    var workbook = WorkbenchService.getWorkbooksLocal();
    workbook['loading'] = bool;
    WorkbenchService.setWorkbooksLocal(workbook);
  }

  function sessionTimeOutHandler(response) {
    if (!updateWorkbookCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
      updateWorkbookCtrl.info.sessionTimedOut = true;
      updateWorkbookCtrl.hideModal();
      ModalService.sessionTimeout();
    }
  }
}]).controller('DeleteWorkbookController', ['$scope', 'workbook', '$modalInstance', 'WorkbenchService', '$sce', 'ModalService', 'UserTrackingService', function ($scope, workbook, $modalInstance, WorkbenchService, $sce, ModalService, UserTrackingService) {
  var deleteWorkbookCtrl = this;
  deleteWorkbookCtrl.info = {};
  deleteWorkbookCtrl.workbook = workbook;
  deleteWorkbookCtrl.msg = "Are you sure you want to delete the report <b>" + deleteWorkbookCtrl.workbook.name + "</b>";

  deleteWorkbookCtrl.hideModal = function () {
    $modalInstance.close('ok');
  };

  deleteWorkbookCtrl.logActivity = function (activity, details) {
    UserTrackingService.standard_user_tracking("Dashboard", "Other Dashboard", activity, details).then(successHandler, sessionTimeOutHandler);
  };

  function successHandler(response) {}

  function sessionTimeOutHandler(response) {
    if (!deleteWorkbookCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
      deleteWorkbookCtrl.info.sessionTimedOut = true;
      ModalService.sessionTimeout();
      return true;
    }
  }

  deleteWorkbookCtrl.deleteWorkbook = function () {
    setWorkbookLoadStatus(true);
    WorkbenchService.deleteWorkbook(deleteWorkbookCtrl.workbook).then(function (response) {
      setWorkbookLoadStatus(false);
      deleteWorkbookCtrl.logActivity('Delete Workbook', JSON.stringify(deleteWorkbookCtrl.workbook));
      WorkbenchService.updateWorkbooks();
    }, function (response) {
      setWorkbookLoadStatus(false);
      sessionTimeOutHandler(response);
    });
    deleteWorkbookCtrl.hideModal();
  };

  deleteWorkbookCtrl.renderHtml = function (html) {
    return $sce.trustAsHtml(html);
  };

  function setWorkbookLoadStatus(bool) {
    var workbook = WorkbenchService.getWorkbooksLocal();
    workbook['loading'] = bool;
    WorkbenchService.setWorkbooksLocal(workbook);
  }

  function sessionTimeOutHandler(response) {
    if (!deleteWorkbookCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
      deleteWorkbookCtrl.info.sessionTimedOut = true;
      deleteWorkbookCtrl.hideModal();
      ModalService.sessionTimeout();
    }
  }
}]) /// LogiCtrl - To load the external logi dashboards
.controller('LogiCtrl', ['$scope', '$sce', function ($scope, $sce) {
  // sets the given url as the secure url to load on the ui.
  $scope.sceURL = function (url) {
    return $sce.trustAsResourceUrl(url);
  };
}]) // Controller to open health check dashboards
.controller('HealthCheckDashboardsCtrl', ['$scope', '$sce', '$modal', '$filter', 'Dashboards', 'GlobalService', 'AppService', 'ErrorService', 'UserTrackingService', '$timeout', '$window', '$cookies', '$location', 'InstanceHandler', 'ModalService', 'metaDataService', 'UtilService', function ($scope, $sce, $modal, $filter, Dashboards, GlobalService, AppService, ErrorService, UserTrackingService, $timeout, $window, $cookies, $location, InstanceHandler, ModalService, metaDataService, UtilService) {
  var healthCtrl = this;
  healthCtrl.supportEmaill = GlobalService.getVal("supportEmail");
  healthCtrl.info = {};
  var key,
      value,
      tmpObj = {};
  healthCtrl.info.page = {
    "total": 0,
    "current": 0,
    "pages": 0,
    "count": 5,
    "selectAll": [],
    "unSelectAll": []
  };
  healthCtrl.dashboardType = 'summary';
  healthCtrl.summaryDash = [];
  healthCtrl.roleAssignTitle = GlobalService.getVal("roleAssignTitle");
  healthCtrl.info.currentView = 'list'; // Defines the completion of the request for dashboards.

  healthCtrl.info.complete = false;
  healthCtrl.info.listViewError = false;
  healthCtrl.info.currentView = 'list';
  healthCtrl.info.noSummary = false;
  healthCtrl.roles = [];
  healthCtrl.loaded = false;
  healthCtrl.info.loadCount = 0;
  healthCtrl.info.createdBy = 'All'; // Defines whether or not to show the dashboards category.

  healthCtrl.info.show_category = GlobalService.getVal('show_category'); // Stores whether session is timed out or not

  healthCtrl.info.sessionTimedOut = false; // Flag to check internal or external user

  healthCtrl.info.internalLogin = false; // Holds all the dashboards.

  healthCtrl.health_check_dashboards = [];
  healthCtrl.info.securityToken = ""; // Holds all the end customers for the customers

  healthCtrl.endcustomers = [];
  healthCtrl.info.application = GlobalService.getVal('navHealth');
  healthCtrl.endcustomerObjArray = [];
  healthcheck_dashboard_url = "";
  end_cust_label = "";
  end_cust_value = "";
  healthCtrl.info.dashboardSortOrder = true;
  healthCtrl.info.dashboardSortOrderCB = true;
  healthCtrl.info.dashboardSortOrderOB = true;
  healthCtrl.info.dashboardSortOrderDOFM = true;
  healthCtrl.info.tag_max_characters = GlobalService.getVal('tag_maxlimit');
  healthCtrl.healthcheckModules = GlobalService.getVal("healthcheckModules");
  $scope.orderProperty = 'dname';
  var htmconst_url = "../config/constants/healthcheck_constants.json";
  $.get(htmconst_url, function (response, status) {
    $scope.htmconstdata = response;
  });
  AppService.getClinsightUrl().then(function (response) {
    GlobalService.setVal('clinsightReportUrl', response.data.Data);
    GlobalService.setVal('clinsightFlag', response.data.Data.length > 0 ? true : false);
    healthCtrl.info.clinsightFlag = GlobalService.getVal('clinsightFlag') || false; //calling this to get unread count to show on icon

    Dashboards.getNotificationList(0, GlobalService.getVal('notification_page_size'), false).then(function (response) {
      var count = response.data.Count;
      healthCtrl.info.unreadCount = count > 999 ? "999+" : count;
      healthCtrl.info.unreadCount_actual = count > 999 ? count : healthCtrl.info.unreadCount;
    }, function (response) {
      console.error("Unable to load templates");

      if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
        GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
        $scope.info.addRuleMsg = {
          type: 'failure',
          msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
        };
      }
    });
  }, function (response) {
    if (sessionStorage.getItem("clin_mode") == "true") {
      sessionStorage.setItem("clin_mode", "false");
    }

    console.error("Unable to load templates");

    if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
      GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
      $scope.info.addRuleMsg = {
        type: 'failure',
        msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
      };
    }
  });

  healthCtrl.loadUnreadCountNotification = function () {
    //calling this to get unread count to show on icon
    Dashboards.getNotificationList(0, GlobalService.getVal('notification_page_size'), false).then(function (response) {
      var count = response.data.Count;
      healthCtrl.info.unreadCount = count > 999 ? "999+" : count;
      healthCtrl.info.unreadCount_actual = count > 999 ? count : healthCtrl.info.unreadCount;
    }, function (response) {
      console.error("Unable to load templates");

      if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
        GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
        $scope.info.addRuleMsg = {
          type: 'failure',
          msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
        };
      }
    });
  };

  healthCtrl.closeModal = function () {
    $scope.modalInstance.close();
  };

  Dashboards.getSecurityToken().then(function (response) {
    healthCtrl.info.securityToken = response.data.Data;
  });

  healthCtrl.logout = function () {
    AppService.logoutSessionTimeout();
  };

  healthCtrl.checkRoleSubmit = function () {
    var tempArray = [];

    for (i = 0; i < healthCtrl.roles.length; i++) {
      if (healthCtrl.roles[i].selected) {
        tempArray.push(healthCtrl.roles[i].name);
      }
    }

    if (tempArray.length != 0 && healthCtrl.showAddTagsDd()) {
      return false;
    } else {
      return true;
    }
  };

  healthCtrl.checkCurrentRole = function (role) {
    var userInfo = metaDataService.getUser();

    if (userInfo['role'] == role.realName) {
      if (healthCtrl.chkAdminFeature()) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  };

  healthCtrl.addRoleConf = function () {
    var roleArray = [];

    for (i = 0; i < healthCtrl.roles.length; i++) {
      if (healthCtrl.roles[i].selected) {
        roleArray.push(healthCtrl.roles[i].name);
      }
    }

    $scope.roles = roleArray.length;
    ; // $scope.addRoleConfMsg = "Do you want to add "+roles+" roles to selected dashboards?";

    $scope.modal1 = ModalService.openModal('partials/healthChk_add_role_conf.html', $scope, false, true);
  };

  healthCtrl.addRoleSubmit = function () {
    var roleArray = [];

    for (i = 0; i < healthCtrl.roles.length; i++) {
      if (healthCtrl.roles[i].selected) {
        roleArray.push(healthCtrl.roles[i].realName);
      }
    }

    var roles = roleArray.toString();
    var list = healthCtrl.getAllDashboards();
    healthCtrl.info.selectedBooks = [];
    var selectedWorkbenchs = [];

    for (var i = 0; i < list.length; i++) {
      if (list[i]['selected'] && list[i]['d_id']) {
        healthCtrl.info.selectedBooks.push(list[i]);
      } else {
        if (list[i]['selected']) {
          //selectedWorkbenchs.push(list[i]["id"]);
          healthCtrl.info.selectedBooks.push(list[i]);
        }
      }
    }

    var tempObj = [];
    var tempArray = [];

    for (i = 0; i < healthCtrl.info.selectedBooks.length; i++) {
      if (healthCtrl.info.selectedBooks[i].d_id) {
        tempObj[i] = {};
        tempObj[i].did = healthCtrl.info.selectedBooks[i].d_id;
        tempObj[i].rids = [];

        for (j = 0; j < healthCtrl.info.selectedBooks[i].f_reports.length; j++) {
          tempArray.push(healthCtrl.info.selectedBooks[i].f_reports[j].r_id);
        }

        tempObj[i].rids = tempArray.join(",");
      } else {
        tempObj[i] = {};
        tempObj[i].did = healthCtrl.info.selectedBooks[i].id;
        tempObj[i].rids = [];

        for (j = 0; j < healthCtrl.info.selectedBooks[i].f_views.length; j++) {
          tempArray.push(healthCtrl.info.selectedBooks[i].f_views[j].id);
        }

        tempObj[i].rids = tempArray.join(",");
      }

      tempArray = [];
    }

    var param = {
      roleaccess: {
        drids: tempObj,
        roles: roles
      }
    };
    Dashboards.addRolesToDashboards(param).then(function (response) {
      healthCtrl.getDetails();
      healthCtrl.info.selectedBooks = "";
      healthCtrl.info.tags = "";
      healthCtrl.info.loading = false;

      for (i = 0; i < healthCtrl.roles.length; i++) {
        healthCtrl.roles[i].selected = false;
      }

      healthCtrl.info.assignRole = "Select Roles";
    }, function (error) {
      healthCtrl.info.selectedBooks = "";
      healthCtrl.info.tags = "";
      healthCtrl.info.loading = false;
    });
  };

  healthCtrl.showUsers = function () {
    healthCtrl.roleListLoading = true;
    healthCtrl.modalInstance = $modal.open({
      templateUrl: 'partials/healtchk_user_role_list.html',
      scope: $scope
    });
    Dashboards.showUsers().then(function (response) {
      var data = response.data.Data;
      var tempArray = [];
      var tempObj = {};
      healthCtrl.roleUserList = [];

      for (i = 0; i < data.length; i++) {
        tempObj.name = data[i].first_name + " " + data[i].last_name;
        tempObj.email = data[i].email;

        if (data[i].role.split('_').length > 3) {
          tempObj.role = data[i].role.split('_').splice(3, 3).join('_');
        } else {
          tempObj.role = data[i].role;
        }

        tempArray.push(tempObj);
        tempObj = {};
      }

      var roleList = [];

      for (i = 0; i < healthCtrl.roles.length; i++) {
        roleList.push(healthCtrl.roles[i].name);
      }

      for (j = 0; j < tempArray.length; j++) {
        if (roleList.indexOf(tempArray[j].role) == -1) {
          tempArray.splice(j, 1);
          j--;
        }
      }

      healthCtrl.roleUserList = tempArray;
      healthCtrl.roleListLoading = false;
    });
  };

  healthCtrl.getNameOfDashboard = function (record, len) {
    var name = "";

    if (record.dname) {
      if (len) {
        if (record.dname.length > len) {
          name = record.dname.substr(0, len) + "...";
        } else {
          name = record.dname;
        }
      } else {
        name = record.dname;
      }
    }

    name = name.toLowerCase();
    return name;
  };

  healthCtrl.getAllTagsName = function () {
    //ashCtrl.info.allDashboardsList
    var tags = [],
        tmp = [];

    if (healthCtrl.health_check_dashboardsDuplicate != undefined) {
      for (var i = 0; i < healthCtrl.health_check_dashboardsDuplicate.length; i++) {
        tmp = [];

        if (healthCtrl.health_check_dashboardsDuplicate[i]["tags"]) {
          tmp = healthCtrl.health_check_dashboardsDuplicate[i]["tags"];
        }

        if (healthCtrl.health_check_dashboardsDuplicate[i]["tag"]) {
          tmp = healthCtrl.health_check_dashboardsDuplicate[i]["tag"];
        }

        for (var j = 0; j < tmp.length; j++) {
          tags.push(tmp[j]);
        }
      } //remove duplicate


      tags = healthCtrl.unique(tags);
      return tags;
    }
  };

  healthCtrl.unique = function (list) {
    var uList = [];

    for (var i = 0; i < list.length; i++) {
      if (uList.indexOf(list[i]) < 0) {
        uList.push(list[i]);
      }
    }

    return uList;
  };

  healthCtrl.getSheetThumbnailImage = function (workbook, sheet) {
    if (!workbook || workbook == "") return "";
    var imgUrl = "";
    var workbookId = "";
    var sheetId = ""; //for internal dashboard

    if (workbook["d_id"]) {
      workbookId = workbook["d_id"];
      return GlobalService.getVal('dashboard_img_logi_path') + '/' + workbookId + '.png';
    } else if (workbook["id"]) {
      workbookId = workbook["id"];
    }

    imgUrl = healthCtrl.info.workbenchApiRootDir + '/' + workbookId + '/' + sheetId;
    return imgUrl;
  };

  healthCtrl.removeTagFromWorkbook = function (book, tag) {
    healthCtrl.loaded = false;
    var id = book["d_id"] || book["id"];
    Dashboards.removeTag(id, tag).then(function (response) {
      healthCtrl.logActivity('Other Dashboards', 'Remove Tag', '{\'' + tag + '\'}');
      healthCtrl.getDetails();
      healthCtrl.loaded = true;
    }, function (response) {
      healthCtrl.getDetails();
      healthCtrl.loaded = true;
    });
  };

  healthCtrl.processMultipleTags = function () {
    //trim first and last space(s)
    healthCtrl.info.tags = healthCtrl.info.tags.trim(); //check if spaces are there within the strings

    healthCtrl.info.tags = healthCtrl.info.tags.replace(/ {1,}/g, " "); //if space found remove a space or multiple spaces with a comma

    healthCtrl.info.tags = healthCtrl.info.tags.replace(/ /g, ","); //replace continues mulitpl comma with a single comma

    healthCtrl.info.tags = healthCtrl.info.tags.replace(/,{1,}/g, ","); //remove comma if it happend on as first character

    healthCtrl.info.tags = healthCtrl.info.tags.replace(/^,/, ''); //remove comma if it happend on as last character

    healthCtrl.info.tags = healthCtrl.info.tags.replace(/,$/, '');
  };

  healthCtrl.addTagsMultiple = function () {
    var list = healthCtrl.getAllDashboards();
    healthCtrl.processMultipleTags();
    healthCtrl.info.selectedBooks = [];

    for (var i = 0; i < list.length; i++) {
      if (list[i].selected) {
        healthCtrl.info.selectedBooks.push(list[i]);
      }
    }

    if (healthCtrl.info.tags && healthCtrl.info.selectedBooks.length > 0) {
      var tempObj = [];
      var tempArray = [];

      for (i = 0; i < healthCtrl.info.selectedBooks.length; i++) {
        tempObj[i] = {};
        tempObj[i].did = healthCtrl.info.selectedBooks[i].d_id;
        tempObj[i].rids = [];

        for (j = 0; j < healthCtrl.info.selectedBooks[i].f_reports.length; j++) {
          tempArray.push(healthCtrl.info.selectedBooks[i].f_reports[j].r_id);
        }

        tempObj[i].rids = tempArray.join(",");
        tempArray = [];
      }
    }

    var param = {
      tagging: {
        drids: tempObj,
        tags: healthCtrl.info.tags
      }
    };
    healthCtrl.info.loadinaddTagsMultipleg = true;

    for (i = 0; i < healthCtrl.info.selectedBooks.length; i++) {
      healthCtrl.info.selectedBooks[i].visibility = !healthCtrl.info.selectedBooks[i].visibility;
      healthCtrl.changeVisibility(healthCtrl.info.selectedBooks[i]);
      healthCtrl.info.selectedBooks[i].visibility = !healthCtrl.info.selectedBooks[i].visibility;
    }

    Dashboards.addTagsToDashboards(param).then(function (response) {
      healthCtrl.logActivity('Other Healthcheck Dashboards', 'Add Tags', '{\'' + healthCtrl.info.tags + '\'}');
      healthCtrl.getDetails();
      healthCtrl.hideModal();
      healthCtrl.info.selectedBooks = [];
      healthCtrl.info.tags = "";
      healthCtrl.info.loading = false;
    }, function (error) {
      healthCtrl.hideModal();
      healthCtrl.info.selectedBooks = [];
      healthCtrl.info.tags = "";
      healthCtrl.info.loading = false;
    });
  };

  healthCtrl.changeVisibility = function (book) {
    healthCtrl.info.loading = true;
    var tempArray = [];
    var tempObj = {};
    book.visibility = !book.visibility;

    for (i = 0; i < book.f_reports.length; i++) {
      tempObj.did = book.d_id;
      tempObj.rids = book.f_reports[i].r_id;
      tempArray.push(tempObj);
    }

    var param = {
      visibility: {
        drids: tempArray,
        isPublic: book.visibility,
        isTableau: false
      }
    };
    book.visibility = !book.visibility;
    Dashboards.changeVisibility(param).then(function (response) {
      healthCtrl.info.loading = false;
      healthCtrl.logActivity('Other Dashboards', 'Change Visibility', '{\'' + book["dname"] + '\'}');
      healthCtrl.getDetails();
    }, function (response) {});
  };

  healthCtrl.addExistingTag = function (tag) {
    //clear and give proper format to the tag list
    healthCtrl.processMultipleTags();
    var tagList = healthCtrl.info.tags.split(',');

    if (tagList.indexOf(tag) != -1) {
      return;
    }

    if (healthCtrl.info.tags == "") {
      healthCtrl.info.tags = tag;
    } else {
      healthCtrl.info.tags = healthCtrl.info.tags + ',' + tag;
    }

    healthCtrl.isAlphaNumeric();
  };

  healthCtrl.toggleSelectAll = function (param) {
    if (param == 'all') {
      for (i = 0; i < healthCtrl.info.page.selectAll.length; i++) {
        if (i != healthCtrl.info.page.current) {
          healthCtrl.info.page.selectAll[i] = false;
          healthCtrl.info.page.unSelectAll[i] = false;
        }
      } //healthCtrl.info.page.selectAll[healthCtrl.info.page.current] = !healthCtrl.info.page.selectAll[healthCtrl.info.page.current];


      if (!healthCtrl.info.page.selectAll[healthCtrl.info.page.current]) {
        healthCtrl.info.page.unSelectAll[healthCtrl.info.page.current] = true;
      } else {
        healthCtrl.info.page.unSelectAll[healthCtrl.info.page.current] = false;
      }
    } else {
      //param.selected = !param.selected;
      healthCtrl.info.page.unSelectAll[healthCtrl.info.page.current] = false;
      healthCtrl.info.page.selectAll[healthCtrl.info.page.current] = false;
    }

    var list = healthCtrl.getAllDashboards();
    var tempList = [];

    for (i = 0; i < list.length; i++) {
      if (list[i].selected) {
        tempList.push(list[i]);
      }
    }

    healthCtrl.formatData();
  };

  healthCtrl.localFilter = function () {
    if (healthCtrl.info.page['current'] > 0) {
      healthCtrl.firstPage();
    }

    healthCtrl.formatData();
  };

  healthCtrl.showAddTagsDd = function () {
    var list = healthCtrl.getAllDashboards();

    for (var i = 0; i < list.length; i++) {
      if (list[i]['selected']) {
        return true;
      }
    }

    return false;
  };

  healthCtrl.changeView = function (view) {
    healthCtrl.info.currentView = view;
    healthCtrl.info.currentBook = null;

    if (healthCtrl.info.currentView == 'list') {
      healthCtrl.info.page['count'] = 15;
    } else if (healthCtrl.info.currentView == 'thumbnail') {
      healthCtrl.info.page['count'] = 50;
    }

    if (healthCtrl.info.page['current'] > 0) {
      healthCtrl.firstPage();
    }
  };

  healthCtrl.userPermitted = function () {
    var userInfo = metaDataService.getUser();
    var featureInfo = metaDataService.getFeatures();

    if (featureInfo.workbench || userInfo['org_type'] == 1000 || userInfo['org_type'] == 100 && AppService.isGbStudioApp()) {
      return true;
    }

    return false;
  };

  healthCtrl.chkAdminFeature = function () {
    if (metaDataService.getFeatures().admin) {
      return true;
    } else {
      return false;
    }
  };

  healthCtrl.ifGlassbeamUser = function () {
    var userOrg = metaDataService.getUserOrgType();
    var gbOrg = GlobalService.getVal('gbUserOrgType');

    if (userOrg == gbOrg) {
      return true;
    } else {
      return false;
    }
  };

  healthCtrl.getBookOwnerName = function (book) {
    return book["created_by"];
  };

  healthCtrl.changeDateFormate = function (dDate) {
    if (!dDate) return "";
    var todayTime = new Date(dDate);
    if (!todayTime) return "";
    var month = healthCtrl.makeTwoDigit(todayTime.getMonth() + 1);
    var day = healthCtrl.makeTwoDigit(todayTime.getDate());
    var year = healthCtrl.makeTwoDigit(todayTime.getFullYear());
    var hours = healthCtrl.makeTwoDigit(todayTime.getHours());
    var minutes = healthCtrl.makeTwoDigit(todayTime.getMinutes());
    var seconds = healthCtrl.makeTwoDigit(todayTime.getSeconds());
    return month + "-" + day + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
  };

  healthCtrl.makeTwoDigit = function (item) {
    item = parseInt(item, 10);

    if (item < 10) {
      item = "0" + item;
    }

    return item;
  };

  healthCtrl.getBookChangedOwnerName = function (book) {
    if (book.dashboardSecurityInfo.owner) {
      return book.dashboardSecurityInfo.owner;
    } else {
      return book.created_by;
    }
  };

  healthCtrl.showDashBoard = function (book, type) {
    if (book["dname"]) {
      if (healthCtrl.chkAdminFeature()) {
        switch (type) {
          case 'dashLevel':
            return true;

          case 'tags':
            return true;

          case 'changeOwner':
            return true;

          case 'public':
            if (book.visibility) {
              return false;
            } else {
              return true;
            }

          case 'private':
            if (book.visibility) {
              return true;
            } else {
              return false;
            }

        }
      } else if (book.gDOwner == metaDataService.getUserEmail()) {
        switch (type) {
          case 'dashLevel':
            var userInfo = metaDataService.getUser();

            if (book.role_access.indexOf(userInfo['role']) != -1) {
              return true;
            } else {
              return false;
            }

          case 'tags':
            return true;

          case 'changeOwner':
            return true;

          case 'public':
            if (book.visibility) {
              return false;
            } else {
              return true;
            }

          case 'private':
            if (book.visibility) {
              return true;
            } else {
              return false;
            }

        }
      } else if (healthCtrl.gDOwner != metaDataService.getUserEmail()) {
        if (healthCtrl.ifGlassbeamUser()) {
          if (healthCtrl.chkAdminFeature()) {
            switch (type) {
              case 'dashLevel':
                return true;

              case 'tags':
                return false;

              case 'changeOwner':
                return true;

              case 'public':
                return false;

              case 'private':
                return false;
            }
          } else {
            switch (type) {
              case 'dashLevel':
                if (book.visibility) {
                  return true;
                } else {
                  return false;
                }

              case 'tags':
                return false;

              case 'changeOwner':
                return false;

              case 'public':
                return false;

              case 'private':
                return false;
            }
          }
        } else if (book.visibility) {
          switch (type) {
            case 'dashLevel':
              if (book.admin_dashboard && metaDataService.getDashAdmin()) {
                return true;
              } else if (!book.admin_dashboard) {
                var userInfo = metaDataService.getUser();

                if (book.role_access.indexOf(userInfo['role']) != -1) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }

            case 'tags':
              return false;

            case 'changeOwner':
              return false;

            case 'public':
              return false;

            case 'private':
              return false;
          }
        } else {
          switch (type) {
            case 'dashLevel':
              return false;

            case 'tags':
              return false;

            case 'changeOwner':
              return false;

            case 'public':
              return false;

            case 'private':
              return false;
          }
        }
      } else if (healthCtrl.ifGlassbeamUser()) {
        switch (type) {
          case 'dashLevel':
            return true;

          case 'tags':
            return false;

          case 'changeOwner':
            return true;

          case 'public':
            return false;

          case 'private':
            return false;
        }
      } else {
        switch (type) {
          case 'dashLevel':
            return false;

          case 'tags':
            return false;

          case 'changeOwner':
            return false;

          case 'public':
            return false;

          case 'private':
            return false;
        }
      }
    }
  };

  if (healthCtrl.userPermitted()) {
    healthCtrl.info.addDeleteTag = true;
  } else {
    healthCtrl.info.addDeleteTag = false;
  }

  healthCtrl.getAllDashboards = function () {
    return healthCtrl.health_check_dashboards;
  };

  healthCtrl.updateOwnerConf = function (user, book) {
    // $scope.ownerConfMsg = "Do you want to change ownership to "+user.email;
    $scope.ownerName = user.email;
    $scope.userUpdate = user;
    $scope.bookUpdate = book;
    $scope.modal1 = ModalService.openModal('partials/healthcheck_owner_conf.html', $scope, false, true);
  };

  healthCtrl.updateOwner = function (user, book) {
    healthCtrl.loaded = false;
    var tempArray = [];
    var tempObj = {};

    for (i = 0; i < book.f_reports.length; i++) {
      tempObj.did = book.d_id;
      tempObj.rids = book.f_reports[i].r_id;
      tempArray.push(tempObj);
    }

    var userInfo = metaDataService.getUser();
    var param = {
      ownership: {
        drids: tempArray,
        owner: user.email,
        role: $scope.userUpdate.role,
        isTableau: false
      }
    };
    Dashboards.updateOwner(param).then(function (response) {
      healthCtrl.logActivity('Other Dashboards', 'Change Owner', '{\'' + book["dname"] + '\'}');
      healthCtrl.loaded = true;
      healthCtrl.getDetails();
    }, function (response) {});
  };

  healthCtrl.healthDashboardLoading = function () {
    healthCtrl.info.loadCount++;
    $timeout(function () {
      healthCtrl.hideLoadingMsg();
    });

    if (healthCtrl.info.loadCount % 2 === 0 && (navigator.userAgent.match(/Chrome/) || navigator.userAgent.match(/Safari/)) || navigator.userAgent.match(/Firefox/) || navigator.userAgent.match(/Edge/)) {
      if (angular.element('#content-loader-health-dboard')) {
        angular.element('#content-loader-health-dboard').addClass("gb-hide");
      }

      if (angular.element('#health-dashboard-iframe-div')) {
        angular.element('#health-dashboard-iframe-div').removeClass("gb-hide");
      }
    }
  }; // sets the given url as the secure url to load on the ui.


  healthCtrl.sceURL = function (url) {
    if (url != undefined && healthCtrl.endcustomers[0] != undefined) {
      healthCtrl.endcustomersobj = healthCtrl.endcustomers[0];
      healthCtrl.info.endcustlabel = healthCtrl.endcustomersobj;
      healthCtrl.info.endcustvalue = healthCtrl.endcustomersobj;

      if (healthCtrl.info.internalLogin) {
        healthCtrl.info.endcustlabel = "None";
        healthCtrl.info.endcustvalue = "None";
      } // url = url + '&' + GlobalService.getVal('dashboard_link_endcustomer_label')+'='+ healthCtrl.info.endcustlabel + '&' + GlobalService.getVal('dashboard_link_endcustomer_value')+'='+ healthCtrl.info.endcustvalue;


      return $sce.trustAsResourceUrl(url);
    }
  };

  healthCtrl.sceHTML = function (html) {
    return $sce.trustAsHtml(html);
  }; // In case of system error, it doesn't wait to show error messages


  $scope.$watch('healthCtrl.info.complete', function () {
    if (healthCtrl.info.complete) {
      AppService.hidePanelLoading();
    }
  }); //Event to check when application is ready

  $scope.$on('AppLoadEvent-healthcheck', function (event, args) {
    console.log("tab active");

    if (healthCtrl.info.complete) {
      AppService.hidePanelLoading();
      healthCtrl.showLoadingMsg();
      healthCtrl.setDashboard('summary');
      healthCtrl.info.createdBy = 'All';
      healthCtrl.getDetails();
      GlobalService.getVal('clinsightFlag') && healthCtrl.loadUnreadCountNotification();
    }
  });

  if (ErrorService.getErrors('gbApp')) {
    healthCtrl.info.complete = true;
  }

  healthCtrl.showEndCustomerList = function () {
    //don't show end customer list for external user
    if (healthCtrl.endcustomers.length > 1 && healthCtrl.health_check_dashboards.length > 0) {
      return true;
    }

    if (healthCtrl.health_check_dashboards.length > 1 || healthCtrl.info.internalLogin) {
      return true;
    }

    return false;
  };

  healthCtrl.showDashboardList = function () {
    if (healthCtrl.health_check_dashboards.length > 1) {
      return true;
    }

    if (healthCtrl.endcustomers.length > 1 && healthCtrl.health_check_dashboards.length > 0) {
      return true;
    }

    return false;
  };

  healthCtrl.showSingleDashboard = function () {
    if (healthCtrl.endcustomers.length >= 1 && healthCtrl.health_check_dashboards.length == 1) {
      return true;
    }

    return false;
  };

  healthCtrl.setDashboard = function (dtype) {
    healthCtrl.dashboardType = dtype;
  };

  healthCtrl.updateCreatorName = function (works) {
    healthCtrl.info.dUserName = [];

    for (var i = 0; i < works.length; i++) {
      if (!healthCtrl.isDuplicateArrayObject(healthCtrl.info.dUserName, works[i].created_by)) {
        healthCtrl.info.dUserName.push(works[i].created_by);
      }
    }
  };

  healthCtrl.getDCreatorName = function () {
    return healthCtrl.info.dUserName;
  };

  healthCtrl.isDuplicateArrayObject = function (list, name) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] == name) {
        return true;
      }
    }

    return false;
  }; // Adds the given dashboard to instance viewer


  healthCtrl.addInstance = function (report) {
    healthcheck_dashboard_url = report["r_link"];

    if (!healthCtrl.info.selectedItem || healthCtrl.info.selectedItem == "") {
      ModalService.alertBox({
        "msg": "Please select customer!"
      });
      return;
    }

    end_cust_label = healthCtrl.info.selectedItem.label;
    end_cust_value = healthCtrl.info.selectedItem.value; // create instance viewer object

    var instanceConfig = {
      'type': 'dashboard',
      'healthCheck': true,
      'name': report.rname,
      'data': {
        'report': report
      }
    };
    InstanceHandler.addInstance(instanceConfig, $scope);
  };

  function paginator(count) {
    healthCtrl.info.page['total'] = count;
    healthCtrl.info.page['pages'] = Math.ceil(healthCtrl.info.page['total'] / healthCtrl.info.page['count']);

    if (!healthCtrl.selectAllFlag) {
      for (i = 0; i < healthCtrl.info.page['pages']; i++) {
        healthCtrl.info.page.selectAll[i] = false;
        healthCtrl.info.page.unSelectAll[i] = false;
      }

      healthCtrl.selectAllFlag = true;
    }
  }

  healthCtrl.formatData = function () {
    var works = $filter('filterBooks')(healthCtrl.health_check_dashboardsDuplicate, healthCtrl.info.query);

    if (!!works.length) {
      var books = works;
      var count = books.length;
      paginator(count);
      var startIndex = healthCtrl.info.page['current'] * healthCtrl.info.page['count'];
      var endIndex = startIndex + healthCtrl.info.page['count'];

      if (count <= endIndex) {
        endIndex = count;
      }

      var tmpArray = [];

      for (var key = startIndex; key < endIndex; key++) {
        if (healthCtrl.info.page.selectAll[healthCtrl.info.page.current]) {
          if (healthCtrl.showDashBoard(works[key], "tags")) {
            works[key].selected = true;
          }
        }

        if (healthCtrl.info.page.unSelectAll[healthCtrl.info.page.current]) {
          works[key].selected = false;
        }

        tmpArray.push(works[key]);
      }

      healthCtrl.health_check_dashboards = tmpArray;
    } else {
      healthCtrl.info.page['pages'] = 0;
      healthCtrl.health_check_dashboards = [];
      return [];
    }

    if (!healthCtrl.health_check_dashboards.length || healthCtrl.health_check_dashboards.length == 0) {
      healthCtrl.info.page['pages'] = 0;
    }
  };

  healthCtrl.nextPage = function () {
    if (healthCtrl.info.page['current'] < healthCtrl.info.page['pages'] - 1) {
      healthCtrl.info.page['current'] += 1;
      healthCtrl.getDetails();
    }
  }; // Navigate to previous page of results


  healthCtrl.prevPage = function () {
    if (healthCtrl.info.page['current'] > 0) {
      healthCtrl.info.page['current'] -= 1;
      healthCtrl.getDetails();
    }
  }; // Navigate to first page of results


  healthCtrl.firstPage = function () {
    if (healthCtrl.info.page['current'] == 0) return;
    healthCtrl.info.page['current'] = 0;
    healthCtrl.getDetails();
  }; // Navigate to last page of results


  healthCtrl.lastPage = function () {
    if (healthCtrl.info.page['current'] == healthCtrl.info.page['pages'] - 1) return;
    healthCtrl.info.page['current'] = healthCtrl.info.page['pages'] - 1;
    healthCtrl.getDetails();
  }; // XHR to get the dashboards.


  healthCtrl.getDetails = function () {
    if (healthCtrl.dashOwnerListLogi == undefined) {
      Dashboards.getLogiAdmin().then(function (responseLogi) {
        healthCtrl.dashOwnerListLogi = responseLogi.data.Data;
      });
    }

    Dashboards.allDetails().then(function (response) {
      Dashboards.getRolesHealthChk().then(function (response) {
        var data = response.data.Data;
        healthCtrl.roles = [];

        for (i = 0; i < data.length; i++) {
          if (data[i] != "") {
            var tempObj = {};
            var testArray = data[i].split('_');

            if (testArray.length > 3) {
              tempObj.name = testArray.splice(3, 3).join('_');
            } else {
              tempObj.name = data[i];
            }

            tempObj.realName = data[i];
            tempObj.selected = false;
            healthCtrl.roles.push(tempObj);
          }
        }
      });
      var userInfo = metaDataService.getUser();
      healthCtrl.info.internalLogin = userInfo ? !userInfo["is_external"] : false; //check if landed from notification

      if (sessionStorage.getItem("clin_mode") == "true") {
        if (GlobalService.getVal('clinsightReportUrl').length) {
          var clin_url = new URL(GlobalService.getVal('clinsightReportUrl'));
          var urlParams = new URLSearchParams(clin_url.search); //replace rd report value and fill query search object

          var url_obj = {}; //loop over url params

          urlParams.forEach(function (value, key) {
            if (key == "rdReport") {
              url_obj[key] = GlobalService.getVal("healthcheck_rd_report");
            } else {
              url_obj[key] = value;
            }
          }); //loop over session object

          Object.keys(sessionStorage).forEach(function (key) {
            if (key != "clin_mode" || key != "mps" || key != "notificationId") {
              url_obj[key] = sessionStorage.getItem(key);
            }
          }); //create custom report url for clinsights

          var url_pad = Object.keys(url_obj).reduce(function (acc, key) {
            var value = url_obj[key];

            if (key == "rdReport") {
              acc = acc + key + "=" + value;
            } else {
              acc = acc + "&" + key + "=" + value;
            }

            return acc;
          }, "?"); //pad end the url

          clin_url.search = url_pad; //change the url of the summary dashboard as per the generated url

          healthCtrl.summaryDash = $filter('filter')(response.data.Data.dashboards, {
            'd_type': GlobalService.getVal('HealthCheckSummary')
          });

          if (healthCtrl.summaryDash.length > 0) {
            healthCtrl.summaryDash[0].reports[0].r_link = clin_url.href;
          } //intensional console


          console.log(clin_url.href);
          sessionStorage.setItem("clin_mode", "false"); //when clicked on a push notification if we have the notification id then mark it as read.

          if (sessionStorage.getItem("notificationId")) {
            var payload = {
              "notificationIds": [sessionStorage.getItem("notificationId")]
            }; //api call

            healthCtrl.markReadNotification(payload, true);
            healthCtrl.logActivity('Push Notification clicked', JSON.stringify(payload));
          }
        } else {
          sessionStorage.setItem("clin_mode", "false");
          healthCtrl.summaryDash = $filter('filter')(response.data.Data.dashboards, {
            'd_type': GlobalService.getVal('HealthCheckSummary')
          });
        }
      } else {
        healthCtrl.summaryDash = $filter('filter')(response.data.Data.dashboards, {
          'd_type': GlobalService.getVal('HealthCheckSummary')
        });
      }

      healthCtrl.health_check_dashboards = $filter('filter')(response.data.Data.dashboards, {
        'd_type': 'External'
      });

      if (healthCtrl.summaryDash.length) {
        healthCtrl.health_check_dashboards.push(healthCtrl.summaryDash[0]);
      }

      healthCtrl.health_check_dashboardsDuplicate = healthCtrl.health_check_dashboards;
      healthCtrl.updateCreatorName(healthCtrl.health_check_dashboards);
      healthCtrl.copyOfDashBoards = angular.copy(healthCtrl.health_check_dashboards);

      if (healthCtrl.summaryDash.length == 0 || healthCtrl.summaryDash == undefined) {
        healthCtrl.setDashboard('other');
        healthCtrl.info.noSummary = true;
      }

      for (i = 0; i < healthCtrl.health_check_dashboards.length; i++) {
        healthCtrl.health_check_dashboards[i].gDUser = healthCtrl.getBookOwnerName(healthCtrl.health_check_dashboards[i]);
        healthCtrl.health_check_dashboards[i].visibility = healthCtrl.health_check_dashboards[i].dashboardSecurityInfo.is_public;
        healthCtrl.health_check_dashboards[i].gDOwner = healthCtrl.getBookChangedOwnerName(healthCtrl.health_check_dashboards[i]);
        healthCtrl.health_check_dashboards[i].gDTs = healthCtrl.changeDateFormate(healthCtrl.health_check_dashboards[i].modified_ts);
        var tempRoleAccess = [];
        var tempRoleAccessObj = {};

        if (healthCtrl.health_check_dashboards[i].role_access) {
          for (m = 0; m < healthCtrl.health_check_dashboards[i].role_access.length; m++) {
            tempRoleAccessObj = {};
            tempRoleAccessObj.realName = healthCtrl.health_check_dashboards[i].role_access[m];

            if (healthCtrl.health_check_dashboards[i].role_access[m].split('_').length > 3) {
              tempRoleAccessObj.name = healthCtrl.health_check_dashboards[i].role_access[m].split('_').splice(3, 3).join('_');
            } else {
              tempRoleAccessObj.name = healthCtrl.health_check_dashboards[i].role_access[m];
            }

            tempRoleAccess.push(tempRoleAccessObj);
          }

          healthCtrl.health_check_dashboards[i].role_access_dis = tempRoleAccess;
        } else {
          healthCtrl.health_check_dashboards[i].role_access = [];
        }
      }

      Dashboards.getEndCustomers().then(function (response) {
        healthCtrl.endcustomers = response.data.Data;
        healthCtrl.endcustomersobj = metaDataService.getUserEndCustomer();

        if (healthCtrl.info.internalLogin) {
          if (!healthCtrl.endcustomers || !healthCtrl.endcustomers.length || healthCtrl.endcustomers.length < 1) {
            healthCtrl.hideLoadingMsg();
            ErrorService.setError(healthCtrl.info.application, GlobalService.getVal('no_end_customer'));
            healthCtrl.info.listViewError = true;
            healthCtrl.info.listViewErrorMsg = "End customer list is missing, please contact " + GlobalService.getVal('dashmodeadminemail');
            return false;
          } else {
            if (healthCtrl.endcustomersobj === "" || healthCtrl.endcustomersobj === "NA") {
              var endCustomerArray = ["All"];

              for (var i = 0; i < healthCtrl.endcustomers.length; i++) {
                endCustomerArray.push(healthCtrl.endcustomers[i].endcustomer_name);
              }

              endCustomerArray = endCustomerArray.filter(function (x, i, a) {
                return a.indexOf(x) == i;
              });
              healthCtrl.endcustomerObjArray = [];

              for (var i = 0; i < endCustomerArray.length; i++) {
                key = endCustomerArray[i];
                value = endCustomerArray[i];
                tempObj = {};
                tempObj.label = key;
                tempObj.value = value;
                healthCtrl.endcustomerObjArray.push(tempObj);
              } //healthCtrl.endcustomerObjArray.unshift({"label":"None", "value":"None"});


              healthCtrl.endcustomers = healthCtrl.endcustomerObjArray;
              healthCtrl.info.selectedItem = healthCtrl.endcustomerObjArray[0];
              healthCtrl.setCustomerName();
              healthCtrl.formatData();
            } else {
              healthCtrl.endcustomersobj = metaDataService.getUserEndCustomer();
              healthCtrl.info.endcustlabel = healthCtrl.endcustomersobj;
              healthCtrl.info.endcustvalue = healthCtrl.endcustomersobj;
              healthCtrl.info.selectedItem = {};
              var obj = {
                label: healthCtrl.info.endcustlabel,
                value: healthCtrl.info.endcustvalue
              };
              healthCtrl.endcustomerObjArray.push(obj);
              healthCtrl.info.selectedItem = healthCtrl.endcustomerObjArray[0];
              var test = healthCtrl.endcustomers.filter(function (item) {
                return item.endcustomer_name === healthCtrl.info.endcustlabel;
              });
              healthCtrl.info.ec_group_map = {};
              healthCtrl.endcustomers.map(function (item) {
                if (item.group_name.length) {
                  healthCtrl.info.ec_group_map[item.endcustomer_name] = item.group_name;
                }
              });
              flatten(test[0].group_name);
              healthCtrl.setCustomerName();
              healthCtrl.formatData();
              healthCtrl.hideLoadingMsg();
            }
          }
        } else {
          //for external user: get domain name associated with the user i.e current login
          // this API will return always single end customer as list
          // Fetch end customer list
          // healthCtrl.endcustomers = metaDataService.getUserEndCustomer();
          if (healthCtrl.endcustomers == "NA" || healthCtrl.endcustomers == null) {
            healthCtrl.hideLoadingMsg();
            healthCtrl.noUserEndCustomerError = GlobalService.getVal('noUserEndCustomerError');
            healthCtrl.supportEmail = GlobalService.getVal('supportEmail');
            $scope.modal1 = ModalService.openModal('partials/noUserEndcustomerPopup.html', $scope, false, true);
            return false;
          }

          healthCtrl.endcustomerObjArray = [];
          healthCtrl.endcustomersobj = metaDataService.getUserEndCustomer();
          healthCtrl.info.endcustlabel = healthCtrl.endcustomersobj;
          healthCtrl.info.endcustvalue = healthCtrl.endcustomersobj;
          healthCtrl.info.selectedItem = {};
          var obj = {
            label: healthCtrl.info.endcustlabel,
            value: healthCtrl.info.endcustvalue
          };
          healthCtrl.endcustomerObjArray.push(obj);
          healthCtrl.info.selectedItem = healthCtrl.endcustomerObjArray[0];
          var test = healthCtrl.endcustomers.filter(function (item) {
            return item.endcustomer_name === healthCtrl.info.endcustlabel;
          });
          healthCtrl.info.ec_group_map = {};
          healthCtrl.endcustomers.map(function (item) {
            if (item.group_name.length) {
              healthCtrl.info.ec_group_map[item.endcustomer_name] = item.group_name;
            }
          });
          flatten(test[0].group_name); // healthCtrl.info.selectedItem.label = healthCtrl.info.endcustlabel;
          // healthCtrl.info.selectedItem.value = healthCtrl.info.endcustvalue;

          healthCtrl.setCustomerName();
          healthCtrl.hideLoadingMsg();
        }

        healthCtrl.hideLoadingMsg();
      }, function (response) {
        healthCtrl.apiFailed(response);
      });
    }, function (response) {
      healthCtrl.apiFailed(response);
    });
  };

  function flatten(arr) {
    for (var i = 0; i < arr.length; i++) {
      var map = healthCtrl.endcustomerObjArray.map(function (item) {
        return item.label;
      });
      var obj = {};
      obj.label = arr[i];
      obj.value = arr[i];

      if (map.indexOf(arr[i]) == -1) {
        healthCtrl.endcustomerObjArray.push(obj);
      }

      if (healthCtrl.info.ec_group_map[arr[i]] && healthCtrl.info.ec_group_map[arr[i]].length) {
        flatten(healthCtrl.info.ec_group_map[arr[i]]);
      }
    }
  }

  healthCtrl.getDetails();

  healthCtrl.apiFailed = function (response) {
    healthCtrl.hideLoadingMsg();
    healthCtrl.health_check_dashboards.length = 0;

    if (!sessionTimeOutHandler(response)) {
      ErrorService.setError(healthCtrl.info.application, GlobalService.getVal('data_fail'));
    }
  };

  healthCtrl.loadSingleDashboard = function () {
    $timeout(function () {
      healthCtrl.loaded = true;
    }, 5000);
    healthCtrl.r_link = healthCtrl.health_check_dashboards[0].reports[0].r_link;
    healthCtrl.r_name = healthCtrl.health_check_dashboards[0].reports[0].rname;
    healthCtrl.d_name = healthCtrl.health_check_dashboards[0].dname; // User tracking for default loading of dashboard.

    healthCtrl.logActivity('Default Load', '{\'' + healthCtrl.r_name + '\'}');
  };

  healthCtrl.hideLoadingMsg = function () {
    healthCtrl.loaded = true;
  };

  healthCtrl.showLoadingMsg = function () {
    healthCtrl.loaded = false;
  }; // Method to log the user activity from the UI template.


  healthCtrl.logActivity = function (activity, details) {
    UserTrackingService.standard_user_tracking(healthCtrl.info.application, healthCtrl.info.application, activity, details).then(successHandler, sessionTimeOutHandler);
  };

  healthCtrl.logClinsightsActivity = function (module, activity, details) {
    UserTrackingService.standard_user_tracking("clinsights Web", module, activity, details).then(successHandler, sessionTimeOutHandler);
  }; // Returns the filter expression to filter the dashboards based the search term typed by the user.


  healthCtrl.search = function () {
    return {
      "rdesc": healthCtrl.info.query
    };
  };

  healthCtrl.setCustomerName = function () {
    var obs = healthCtrl.info.selectedItem;
    var openInstance = InstanceHandler.getInstances();
    end_cust_label = obs.label;
    end_cust_value = obs.value;
    var domain = GlobalService.getVal('primaryDomain');
    var new_url = "";

    if (healthCtrl.summaryDash.length) {
      new_url = healthCtrl.summaryDash[0].reports[0].r_link;
    }

    document.cookie = GlobalService.getVal('dashboard_link_endcustomer_label') + '=' + end_cust_label + ";domain=." + domain + ";path=/";
    document.cookie = GlobalService.getVal('dashboard_link_endcustomer_value') + '=' + end_cust_value + ";domain=." + domain + ";path=/";

    for (i = 0; i < openInstance.length; i++) {
      if (openInstance[i].healthCheck) {
        var iframe = document.getElementsByClassName("idashboard-" + openInstance[i].md5);
        iframe[0].src = iframe[0].src;
      }
    }

    if (new_url != "") {
      document.getElementById('health-dashboardiframe').contentWindow.location.replace(new_url);
    }
  }; // Toggles the visibilty of the dashboards.


  healthCtrl.toggleDashboard = function (dashboard) {
    // if (!!healthCtrl.info.query) {
    //     ModalService.alertBox({msgKey: 'dashboard_collapse'});
    // } else {
    dashboard.expand = !dashboard.expand; // }
  }; // Returns whether dashboards are there after filtering or not so as to display the proper message on the UI when no dashboards are matched.


  healthCtrl.filterResult = function () {
    var i,
        bool = true;

    if (healthCtrl.info.complete && healthCtrl.getError() && !healthCtrl.getError().length) {
      for (i in healthCtrl.health_check_dashboards) {
        if (healthCtrl.health_check_dashboards[i].f_reports != null && healthCtrl.health_check_dashboards[i].f_reports.length) {
          bool = false;
        }
      }

      return bool;
    } else {
      return false;
    }
  };

  healthCtrl.removeRoleConf = function (book, role) {
    $scope.roleToRemove = role;
    $scope.roleEditBook = book; // $scope.removeRoleConfMsg = "Do you want to remove '"+role.name+"' role?";

    $scope.roleName = role.name;
    $scope.modal1 = ModalService.openModal('partials/dashboard_remove_role_conf_healthChk.html', $scope, false, true);
  };

  healthCtrl.removeRoleFromWorkbook = function (book, role) {
    healthCtrl.showLoadingMsg();
    var id = book["d_id"] || book["id"];
    Dashboards.removeRole(id, role.realName).then(function (response) {
      healthCtrl.logActivity('Healthchk Dashboards', 'Remove Role', '{\'' + role + '\'}');
      healthCtrl.getDetails();
      healthCtrl.hideLoadingMsg();
    }, function (response) {
      healthCtrl.getDetails();
      healthCtrl.hideLoadingMsg();
    });
  };

  healthCtrl.getError = function () {
    return ErrorService.getErrors(healthCtrl.info.application);
  }; // Returns the no match found message for the given filter.


  healthCtrl.getMessage = function () {
    return GlobalService.getVal('filter_fail');
  };

  healthCtrl.renderHtml = function (html) {
    return $sce.trustAsHtml(html);
  };

  function successHandler(response) {}

  function sessionTimeOutHandler(response) {
    if (!healthCtrl.info.sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
      healthCtrl.info.sessionTimedOut = true;
      ModalService.sessionTimeout();
      return true;
    }
  }

  healthCtrl.sortItems = function (propertyName) {
    if ($scope.orderProperty === propertyName) {
      $scope.orderProperty = '-' + propertyName;
    } else if ($scope.orderProperty === '-' + propertyName) {
      $scope.orderProperty = propertyName;
    } else {
      $scope.orderProperty = propertyName;
    }
  };

  healthCtrl.filterByHealthCheckCreator = function (type, itemToFilter) {
    var array = angular.copy(healthCtrl.copyOfDashBoards);

    if (type === 'All') {
      healthCtrl.health_check_dashboards = array;
    } else {
      healthCtrl.health_check_dashboards = $filter('filterArrayItems')(array, type, itemToFilter);
    }

    for (i = 0; i < healthCtrl.health_check_dashboards.length; i++) {
      healthCtrl.health_check_dashboards[i].gDUser = healthCtrl.getBookOwnerName(healthCtrl.health_check_dashboards[i]);
      healthCtrl.health_check_dashboards[i].visibility = healthCtrl.health_check_dashboards[i].dashboardSecurityInfo.is_public;
      healthCtrl.health_check_dashboards[i].gDOwner = healthCtrl.getBookChangedOwnerName(healthCtrl.health_check_dashboards[i]);
      healthCtrl.health_check_dashboards[i].gDTs = healthCtrl.changeDateFormate(healthCtrl.health_check_dashboards[i].modified_ts);
    }
  };

  healthCtrl.hideModal = function () {
    healthCtrl.info.tags = "";

    if (healthCtrl.modalInstance) {
      healthCtrl.modalInstance.close('ok');
    }
  };

  healthCtrl.selectAllRole = function () {
    var tempArray = [];

    for (i = 0; i < healthCtrl.roles.length; i++) {
      healthCtrl.roles[i].selected = true;
      tempArray.push(healthCtrl.roles[i].name);
    }

    healthCtrl.info.assignRole = tempArray.toString();
  };

  healthCtrl.clearAllRole = function () {
    for (i = 0; i < healthCtrl.roles.length; i++) {
      healthCtrl.roles[i].selected = false;
      healthCtrl.info.assignRole = "Select Roles";
    }
  };

  healthCtrl.showMsg = function () {
    if (healthCtrl.info.errMsg == "") {
      return false;
    } else {
      return true;
    }
  };

  healthCtrl.getHealthDashLength = function () {
    var count = 0;

    for (var i = 0; i < healthCtrl.health_check_dashboards.length; i++) {
      if (healthCtrl.showDashBoard(healthCtrl.health_check_dashboards[i], 'dashLevel')) {
        count++;
      }
    }

    return count;
  };

  healthCtrl.getAllTagsNameOfSelectedDashboards = function () {
    var tags = [],
        tmp = [],
        list;
    list = healthCtrl.getAllDashboards();

    for (var i = 0; i < list.length; i++) {
      tmp = [];

      if (list[i]['selected'] && list[i]["tags"]) {
        tmp = list[i]["tags"];
      }

      if (list[i]['selected'] && list[i]["tag"]) {
        tmp = list[i]["tag"];
      }

      for (var j = 0; j < tmp.length; j++) {
        tags.push(tmp[j]);
      }
    } //remove duplicate


    tags = healthCtrl.unique(tags);
    return tags;
  };

  healthCtrl.isAlphaNumeric = function () {
    var all_tags_name = healthCtrl.info.tags.split(/,|\s/),
        duplicateTagname = [],
        error = false;

    if (healthCtrl.info.tags == "") {
      healthCtrl.info.errMsg = "";
      return;
    }

    var allTags = healthCtrl.getAllTagsNameOfSelectedDashboards();

    for (var j = 0; j < all_tags_name.length; j++) {
      var tag_name = all_tags_name[j];

      if (tag_name == "") {
        continue;
      } else if (tag_name.length > healthCtrl.info.tag_max_characters) {
        error = true;
        healthCtrl.info.errMsg = GlobalService.getVal('dashboard_tagname_max_len');
        return;
      } else if (!tag_name.match(/^[0-9a-zA-Z]+$/)) {
        error = true;
        healthCtrl.info.errMsg = GlobalService.getVal('dashboard_tagname_special_char');
        return;
      } //check for duplicate


      for (var i = 0; i < allTags.length; i++) {
        if (allTags[i] == tag_name) {
          error = true;
          duplicateTagname.push(tag_name);
        }
      }
    }

    if (duplicateTagname.length > 0) {
      healthCtrl.info.errMsg = GlobalService.getVal('dashboard_tagbname_duplicate') + duplicateTagname.join(', ');
      return;
    } else if (!error) {
      healthCtrl.info.errMsg = "";
      return;
    }
  };

  healthCtrl.openTagSubscription = function () {
    healthCtrl.info.tagLoading = true;
    healthCtrl.info.allTagaSelected = false;
    healthCtrl.info.tagUnsubscribeBtn = true;
    healthCtrl.info.tagSubscribeBtn = true; //getPredefinedTagList

    $scope.modalInstance = ModalService.openModal('partials/dashboards/tagSubscription.html', $scope, "gb-tag-subscription-modal", true, 'static');
    Dashboards.getPredefinedTagList().then(function (response) {
      healthCtrl.info.pretagList = _.sortBy(response.data.Data, 'tag_name').map(function (t, i) {
        t.selected = false;
        return t;
      });
      healthCtrl.info.tagLoading = false;
    }, function (response) {
      healthCtrl.info.pretagList = [];
      healthCtrl.info.tagLoading = false;
      console.error("Unable to load templates");

      if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
        GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
        $scope.info.addRuleMsg = {
          type: 'failure',
          msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
        };
      }
    });
  };

  healthCtrl.reloadTags = function () {
    Dashboards.getPredefinedTagList().then(function (response) {
      healthCtrl.info.pretagList = response.data.Data.map(function (t) {
        t.selected = false;
        return t;
      });
      healthCtrl.info.tagLoading = false;
    }, function (response) {
      healthCtrl.info.pretagList = [];
      healthCtrl.info.tagLoading = false;
      console.error("Unable to load templates");

      if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
        GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
        $scope.info.addRuleMsg = {
          type: 'failure',
          msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
        };
      }
    });
  }; //select/unselect all tags function


  healthCtrl.selectAllTags = function () {
    if (healthCtrl.info.allTagaSelected) {
      healthCtrl.info.pretagList.forEach(function (tag) {
        tag.selected = true;
      });
    } else {
      healthCtrl.info.pretagList.forEach(function (tag) {
        tag.selected = false;
      });
    }

    healthCtrl.updateBtnStatus();
  };

  healthCtrl.subscribeTag = function (tag, type, bulk) {
    healthCtrl.info.tagLoading = true;

    if (bulk) {
      var subscribePayload = {
        "tag_ids": healthCtrl.getBulkTagId(type),
        "emailId": metaDataService.getUserEmail()
      };
    } else {
      var subscribePayload = {
        "tag_ids": [tag.tag_id],
        "emailId": metaDataService.getUserEmail()
      };
    } // add tag subscription


    Dashboards.subscribeUnsubscribeTag(subscribePayload, type).then(function (response) {
      healthCtrl.info.addTemplateMsg = {
        type: 'success',
        msg: type ? "subscribed successfully" : "unsubscribed successfully"
      };
      setTimeout(function () {
        healthCtrl.clearMessage();
      }, 3000);
      healthCtrl.reloadTags();
      healthCtrl.logClinsightsActivity(healthCtrl.healthcheckModules.subscription, type ? "Subscribe Tag" : "Unsubscribe Tag", JSON.stringify(subscribePayload));
    }, function (response) {
      console.error("Unable to subscribe");
      healthCtrl.info.addTemplateMsg = {
        type: 'failure',
        msg: type ? "failed to subscribe" : "failed to Unsubscribe"
      };
      healthCtrl.info.tagLoading = false;
      setTimeout(function () {
        healthCtrl.clearMessage();
      }, 3000);

      if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
        GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
        $scope.info.addRuleMsg = {
          type: 'failure',
          msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
        };
      }
    });
  };

  healthCtrl.getBulkTagId = function (type) {
    if (type) {
      var selectedTagsIds = healthCtrl.info.pretagList.filter(function (i) {
        return (i.rules_subscribed === 0 && i.enabled_rules > 0 || i.enabled_rules > i.rules_subscribed && i.rules_subscribed != 0) && i.selected;
      }).map(function (tag) {
        return tag.tag_id;
      });
    } else {
      var selectedTagsIds = healthCtrl.info.pretagList.filter(function (i) {
        return (i.rules_subscribed === i.enabled_rules && i.enabled_rules != 0 || i.enabled_rules > i.rules_subscribed && i.rules_subscribed != 0) && i.selected;
      }).map(function (tag) {
        return tag.tag_id;
      });
    }

    return selectedTagsIds;
  }; //update button status


  healthCtrl.updateBtnStatus = function () {
    if (healthCtrl.info.pretagList.filter(function (i) {
      return (i.rules_subscribed === 0 && i.enabled_rules > 0 || i.enabled_rules > i.rules_subscribed && i.rules_subscribed != 0) && i.selected;
    }).length > 0) {
      healthCtrl.info.tagSubscribeBtn = false;
    } else {
      healthCtrl.info.tagSubscribeBtn = true;
    }

    if (healthCtrl.info.pretagList.filter(function (i) {
      return (i.rules_subscribed === i.enabled_rules && i.enabled_rules != 0 || i.enabled_rules > i.rules_subscribed && i.rules_subscribed != 0) && i.selected;
    }).length > 0) {
      healthCtrl.info.tagUnsubscribeBtn = false;
    } else {
      healthCtrl.info.tagUnsubscribeBtn = true;
    }
  }; //Start of Notification code
  //Initialize notification


  $scope.initNotification = function () {
    //create pagination object
    healthCtrl.info.noti_pagination = {};
    healthCtrl.info.noti_pagination.pageSize = GlobalService.getVal('notification_page_size');
    healthCtrl.info.noti_pagination.startIndex = 0;
    healthCtrl.info.noti_pagination.endIndex = healthCtrl.info.noti_pagination.pageSize;
    healthCtrl.info.noti_pagination.total = 0;
    healthCtrl.info.noti_pagination.paginationText = "showing " + (healthCtrl.info.noti_pagination.startIndex + 1) + " to " + healthCtrl.info.noti_pagination.endIndex + " of " + healthCtrl.info.noti_pagination.total;
    healthCtrl.info.noti_pagination.unreadFilter = true;
    healthCtrl.info.noti_pagination.readFilter = false;
    healthCtrl.info.noti_pagination.allFilter = false; //remember scroll position

    healthCtrl.info.scrollPosition = 0; //stores the unread notification actual cout to display in tooltip

    healthCtrl.info.unreadCount_actual = 0;
  }; //stores the unread notification count


  healthCtrl.info.unreadCount = 0; //filter

  healthCtrl.info.noti_filter = {
    unread: false,
    read: false,
    all: true
  }; //function to update the unread notification count

  healthCtrl.updateUnreadCount = function (res) {
    if (healthCtrl.info.noti_filter.unread) {
      var count = res.data.Count;
      healthCtrl.info.unreadCount = count > 999 ? "999+" : count;
      healthCtrl.info.unreadCount_actual = count > 999 ? count : healthCtrl.info.unreadCount;
    }

    if (healthCtrl.info.noti_filter.all || healthCtrl.info.noti_filter.read) {
      //calling this to get unread count to show on icon
      Dashboards.getNotificationList(0, GlobalService.getVal('notification_page_size'), false).then(function (response) {
        var count = response.data.Count;
        healthCtrl.info.unreadCount = count > 999 ? "999+" : count;
        healthCtrl.info.unreadCount_actual = count > 999 ? count : healthCtrl.info.unreadCount;
      }, function (response) {
        console.error("Unable to load templates");

        if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
          GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
          $scope.info.addRuleMsg = {
            type: 'failure',
            msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
          };
        }
      });
    }
  }; //set local time from UTC


  healthCtrl.setNotificationTime = function (time) {
    var local = new Date(time);

    if (new Date().getDate() == local.getDate() && new Date().getMonth() + 1 == local.getMonth() + 1) {
      return "Today at " + local.getHours() + ":" + local.getMinutes() + ":" + local.getSeconds();
    } else {
      return local.getDate() + "-" + (local.getMonth() + 1) + '-' + local.getFullYear() + " " + local.getHours() + ":" + local.getMinutes() + ":" + local.getSeconds();
    }
  };

  healthCtrl.fetchNotification = function (flag, callback) {
    !flag && $scope.initNotification();
    healthCtrl.info.notificationLoading = true;
    healthCtrl.info.deletebtnStatus = true;
    healthCtrl.info.readbtnStatus = true;
    healthCtrl.info.allNotificationSelected = false;
    healthCtrl.info.selectedTagsCount = 0;
    healthCtrl.info.notificationList = [];
    var st = healthCtrl.info.noti_pagination.startIndex;
    var et = healthCtrl.info.noti_pagination.endIndex;
    var ft = null;

    if (healthCtrl.info.noti_filter.unread) {
      ft = false;
    } else if (healthCtrl.info.noti_filter.read) {
      ft = true;
    }

    healthCtrl.notiMapFn = function (n) {
      n.selected = false;
      n.display_time = healthCtrl.setNotificationTime(n.sent_time);
      n.alert_filter = n.alert_filter.length ? JSON.parse(n.alert_filter) : {};
      n.readLessText = $sce.trustAsHtml(n.body.substring(0, 115) + "...");
      n.moreBtn = true;
      n.lessBtn = false;
      n.details = $sce.trustAsHtml(n.body + " <br />  " + n.details.replace(/\n/g, " <br />  "));
      return n;
    }; //getNotificationList


    Dashboards.getNotificationList(st, et, ft).then(function (response) {
      if (flag) {
        healthCtrl.info.notificationList = [];
        healthCtrl.info.notificationList = response.data.Data.map(healthCtrl.notiMapFn);
      } else {
        healthCtrl.info.notificationList = healthCtrl.info.notificationList.map(function (n) {
          n.selected = false;
          return n;
        }).concat(response.data.Data.map(healthCtrl.notiMapFn));
      }

      healthCtrl.info.noti_pagination.total = response.data.Count;
      healthCtrl.updatePageinationText();
      healthCtrl.updateUnreadCount(response);
      healthCtrl.showHideNotiLoading(false);
      callback && callback();
      setTimeout(function () {
        flag && healthCtrl.setScrollPosition();
      });
    }, function (response) {
      healthCtrl.showHideNotiLoading(false);
      healthCtrl.showFail();
      healthCtrl.info.notificationList = [];
      console.error("Unable to load templates");

      if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
        GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
        $scope.info.addRuleMsg = {
          type: 'failure',
          msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
        };
      }
    });
  };

  healthCtrl.getSelectedNotification = function () {
    return healthCtrl.info.notificationList.filter(function (i) {
      return i.selected;
    });
  }; //function to select all notification


  healthCtrl.selectallNotification = function () {
    if (healthCtrl.info.allNotificationSelected) {
      healthCtrl.info.notificationList.forEach(function (tag) {
        tag.selected = true;
      });
    } else {
      healthCtrl.info.notificationList.forEach(function (tag) {
        tag.selected = false;
      });
    }

    healthCtrl.updateNotificationSelectedCount();
  };

  healthCtrl.getMarkRadPayload = function () {
    return {
      "notificationIds": healthCtrl.info.notificationList.filter(function (t) {
        return t.selected && !t.read;
      }).map(function (item) {
        return item.notification_id;
      })
    };
  }; //single mark read


  healthCtrl.singleMarkRead = function (noti) {
    //noti.read = true;
    var payload = {
      "notificationIds": [noti.notification_id]
    }; //api call

    healthCtrl.info.notificationLoading = true;
    Dashboards.markReadNotification(payload, true).then(function (response) {
      healthCtrl.resetPagination();
      healthCtrl.fetchNotification(false, healthCtrl.showSuccess);
      healthCtrl.logClinsightsActivity(healthCtrl.healthcheckModules.notification, 'Mark read Notification', JSON.stringify(payload));
    }, function (response) {
      healthCtrl.showHideNotiLoading(false);
      healthCtrl.showFail();
      console.error("Unable to mark notification as read");

      if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
        GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
        $scope.info.addRuleMsg = {
          type: 'failure',
          msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
        };
      }
    });
  }; //mark read notification


  healthCtrl.markReadNotification = function (singlePayload, flag) {
    if (flag) {
      Dashboards.markReadNotification(singlePayload, true).then(function (response) {
        healthCtrl.logClinsightsActivity(healthCtrl.healthcheckModules.notification, 'Mark read Notification', JSON.stringify(singlePayload));
      }, function (response) {
        console.error("Unable to mark notification as read");

        if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
          GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
          $scope.info.addRuleMsg = {
            type: 'failure',
            msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
          };
        }
      });
    } else {
      healthCtrl.info.notificationLoading = true;
      var markedPayload = healthCtrl.getMarkRadPayload();
      Dashboards.markReadNotification(markedPayload, true).then(function (response) {
        healthCtrl.resetPagination();
        healthCtrl.fetchNotification(false, healthCtrl.showSuccess);
        healthCtrl.logClinsightsActivity(healthCtrl.healthcheckModules.notification, 'Mark read Notification', JSON.stringify(markedPayload));
      }, function (response) {
        healthCtrl.showHideNotiLoading(false);
        healthCtrl.showFail();
        console.error("Unable to mark notification as read");

        if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
          GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
          $scope.info.addRuleMsg = {
            type: 'failure',
            msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
          };
        }
      });
    }
  }; //delete single notification


  healthCtrl.singleDelete = function (noti) {
    var deletePayload = {
      "notificationIds": [noti.notification_id]
    };
    healthCtrl.deleteNotification(deletePayload);
  };

  healthCtrl.deleteNotification = function (single) {
    healthCtrl.info.notificationLoading = true;

    if (single) {
      var deletePayload = single;
    } else {
      var deletePayload = {
        "notificationIds": healthCtrl.getSelectedNotification().map(function (item) {
          return item.notification_id;
        })
      };
    }

    Dashboards.deleteNotification(deletePayload, true).then(function (response) {
      healthCtrl.resetPagination();
      healthCtrl.fetchNotification(false, healthCtrl.showSuccess);
      healthCtrl.logClinsightsActivity(healthCtrl.healthcheckModules.notification, 'Notification Deleted', JSON.stringify(deletePayload));
    }, function (response) {
      healthCtrl.showHideNotiLoading(false);
      healthCtrl.showFail();
      console.error("Unable to load templates");

      if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/Connection\srefused/)) {
        GlobalService.logError(Object.values(GlobalService.getVal('errorMsgs'))[1]);
        $scope.info.addRuleMsg = {
          type: 'failure',
          msg: GlobalService.getVal('rulesMsgs')['h2_down_msg']
        };
      }
    });
  }; //updte selection count


  healthCtrl.updateNotificationSelectedCount = function () {
    healthCtrl.info.selectedNotificationCount = healthCtrl.info.notificationList.filter(function (t) {
      return t.selected;
    }).length;

    if (healthCtrl.info.selectedNotificationCount > 0) {
      healthCtrl.info.deletebtnStatus = false;
      healthCtrl.info.readbtnStatus = healthCtrl.info.notificationList.filter(function (t) {
        return t.selected && !t.read;
      }).length > 0 ? false : true;
    } else {
      healthCtrl.info.deletebtnStatus = true;
      healthCtrl.info.readbtnStatus = true;
    }
  }; //function to clear noti message


  healthCtrl.clearMessage = function () {
    healthCtrl.info.successMsg = "";
    healthCtrl.info.errorMsg = "";
    healthCtrl.info.addTemplateMsg = {};
  }; //funcion to open log alert dashboarf on click of notification


  healthCtrl.notificationClick = function (notification) {
    if (!notification.read) {
      notification.read = true;
      var payload = {
        "notificationIds": [notification.notification_id]
      };
      healthCtrl.markReadNotification(payload, true);
      healthCtrl.loadUnreadCountNotification();
    }

    healthCtrl.saveScrollPosition();
    healthCtrl.info.notificationLoading = true;
    healthCtrl.showLoadingMsg(); // //intentional

    console.log(notification);
    var clin_url = new URL(GlobalService.getVal('clinsightReportUrl'));
    var urlParams = new URLSearchParams(clin_url.search); //replace rd report value and fill query search object

    var url_obj = {};
    urlParams.forEach(function (value, key) {
      if (key == "rdReport") {
        url_obj[key] = GlobalService.getVal("healthcheck_rd_report");
      } else {
        url_obj[key] = value;
      }
    });
    Object.keys(notification.alert_filter).forEach(function (key) {
      url_obj[key] = notification.alert_filter[key];
    }); //create custom report url for clinsights

    var url_pad = Object.keys(url_obj).reduce(function (acc, key) {
      var value = url_obj[key];

      if (key == "rdReport") {
        acc = acc + key + "=" + value;
      } else {
        acc = acc + "&" + key + "=" + value;
      }

      return acc;
    }, "?");
    clin_url.search = url_pad;

    if (healthCtrl.summaryDash.length > 0) {
      console.log(clin_url.href);
      healthCtrl.summaryDash[0].reports[0].r_link = clin_url.href;
      document.getElementById('health-dashboardiframe').contentWindow.location.replace(clin_url.href);
    } else {
      //intentional
      console.lg("error: no summary /clinsights dasboard available");
    }

    setTimeout(function () {
      healthCtrl.hideLoadingMsg();
    }, 3000);
    healthCtrl.info.notificationLoading = false;
    healthCtrl.logClinsightsActivity(healthCtrl.healthcheckModules.notification, 'Notification clicked', JSON.stringify(notification));
  }; //filter change function


  healthCtrl.notificationFilterChange = function (keyName, value) {
    for (var key in healthCtrl.info.noti_filter) {
      healthCtrl.info.noti_filter[key] = key === keyName ? value : false;
    }

    if (!Math.max.apply(null, Object.values(healthCtrl.info.noti_filter))) healthCtrl.info.noti_filter.unread = true;
    healthCtrl.resetPagination();
    healthCtrl.fetchNotification();
    healthCtrl.logClinsightsActivity(healthCtrl.healthcheckModules.notification, 'Notification filter changed', JSON.stringify(healthCtrl.info.noti_filter));
  }; //function to load more notification


  healthCtrl.showMore = function () {
    healthCtrl.saveScrollPosition();
    healthCtrl.info.noti_pagination.endIndex = healthCtrl.getPageEndIndex();
    healthCtrl.updatePageinationText();
    healthCtrl.fetchNotification(true);
  }; //reset pagination


  healthCtrl.resetPagination = function () {
    healthCtrl.info.noti_pagination.startIndex = 0;
    healthCtrl.info.noti_pagination.endIndex = GlobalService.getVal('notification_page_size');
  }; //function to get page end index


  healthCtrl.getPageEndIndex = function () {
    if (healthCtrl.info.noti_pagination.endIndex + healthCtrl.info.noti_pagination.pageSize > healthCtrl.info.noti_pagination.total) {
      return healthCtrl.info.noti_pagination.total;
    } else {
      return healthCtrl.info.noti_pagination.endIndex + healthCtrl.info.noti_pagination.pageSize;
    }
  }; //save scroll position


  healthCtrl.saveScrollPosition = function () {
    var el = document.getElementsByClassName("notification-main-container");
    healthCtrl.info.scrollPosition = el[0].scrollTop;
  }; //set scroll position


  healthCtrl.setScrollPosition = function () {
    var el = document.getElementsByClassName("notification-main-container");
    el[0].scrollTop = healthCtrl.info.scrollPosition;
  }; // reset scroll position


  healthCtrl.resetScrollPosition = function () {
    var el = document.getElementsByClassName("notification-main-container");
    el[0].scrollTop = 0;
  }; // update pagination text


  healthCtrl.updatePageinationText = function () {
    healthCtrl.info.noti_pagination.paginationText = "showing " + (healthCtrl.info.noti_pagination.startIndex + 1) + " to " + (healthCtrl.info.noti_pagination.endIndex < healthCtrl.info.notificationList.length ? healthCtrl.info.noti_pagination.endIndex : healthCtrl.info.notificationList.length) + " of " + healthCtrl.info.noti_pagination.total;
  };

  healthCtrl.backToTop = function () {
    healthCtrl.resetScrollPosition();
  }; //function to show hide notification loading


  healthCtrl.showHideNotiLoading = function (flag) {
    healthCtrl.info.notificationLoading = flag;
  }; //foreground notification broadcast to call unread api and update the count


  $scope.$on('updateUnreadCount', function () {
    healthCtrl.loadUnreadCountNotification();
  }); //function to show hide notification loading

  healthCtrl.showSuccess = function () {
    healthCtrl.info.notiSuccess = true;
    setTimeout(function () {
      healthCtrl.info.notiSuccess = false;
    }, 1900);
  }; //function to show hide notification loading


  healthCtrl.showFail = function () {
    healthCtrl.info.notifail = true;
    setTimeout(function () {
      healthCtrl.info.notifail = false;
    }, 1900);
  }; //log show details activity


  healthCtrl.logShowDetails = function (noti) {
    healthCtrl.logClinsightsActivity(healthCtrl.healthcheckModules.notification, 'Notification show details', JSON.stringify(noti));
  };
}]);