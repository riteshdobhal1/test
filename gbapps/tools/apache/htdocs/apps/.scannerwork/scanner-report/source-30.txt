
/* jasmine specs for log vault controllers go here */

describe('LogStatusCtrl : ', function() {

    var manufacturer, product, schema, umsDomain;

	beforeEach(module('gbLogStatusApp.controllers', 'gbLogStatusApp.services', 'gbLogStatusApp.globalservices', 'gbLogStatusApp.directives', 'gbLogStatusApp.filters', 'ngCookies', 'ngDraggable',	'ngAnimate', 'ngRoute',	'ngTable', 'xml','ui.bootstrap', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
  beforeEach(function() {
    var fixture = '<div id="gb-first-time-loader" class="gb-first-time-loader gb-hide">'+'<div class="gb-loading">'+'<span id="gb-loader-msg" class="msg">Loading...</span>'+'<span class="bar"></span>'+'</div></div>';
    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);
  });

    it('Should Have init', inject(function($rootScope, $controller, LogStatusService) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      document.cookie = 'mps=springpath:springpath:pod52';
      var time = {"sDate":"2017-08-16T10:09:26.491Z","eDate":"2017-08-16T12:09:26.491Z"};
      spyOn($scope, 'getLogDetails');
      spyOn($scope, 'getLoginDetails');
      spyOn(LogStatusService, 'updateAccessTime');
      spyOn($scope, 'getTimeRangeForEventContent').and.returnValue(time);
      $scope.init();
    }));
    it('Should Have enabledColumn', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      var param = "bundle_name";
      $scope.logStatusHistoryColumn = [{"field":"bundle_name","title":"Bundle Name","enabled":true,"$$hashKey":"00A"},{"field":"bundle_type","title":"Bundle Type","enabled":true,"$$hashKey":"00B"},{"field":"received_time","title":"Recieved Time","enabled":true,"$$hashKey":"00C"},{"field":"status","title":"Status","enabled":true,"$$hashKey":"00D"},{"field":"expected_time","title":"Expected Time","enabled":true,"$$hashKey":"00E"},{"field":"ticket_number","title":"Ticket Number","enabled":true,"$$hashKey":"00F"},{"field":"customer_name","title":"Customer Name","enabled":true,"$$hashKey":"00G"},{"field":"sysid","title":"Sysid","enabled":true,"$$hashKey":"00H"}];
      $scope.enabledHistoryColumn(param);
    }));

    it('Should Have enabledColumn', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      var param = "ticket_number";
      $scope.logStatusColumn = [{"field":"bundle_name","title":"Bundle Name","enabled":true,"$$hashKey":"00A"},{"field":"bundle_type","title":"Bundle Type","enabled":true,"$$hashKey":"00B"},{"field":"received_time","title":"Recieved Time","enabled":true,"$$hashKey":"00C"},{"field":"status","title":"Status","enabled":true,"$$hashKey":"00D"},{"field":"expected_time","title":"Expected Time","enabled":true,"$$hashKey":"00E"},{"field":"ticket_number","title":"Ticket Number","enabled":true,"$$hashKey":"00F"},{"field":"customer_name","title":"Customer Name","enabled":true,"$$hashKey":"00G"},{"field":"sysid","title":"Sysid","enabled":true,"$$hashKey":"00H"}];
      $scope.enabledColumn(param);
    }));
    it('Should Have unique', inject(function($rootScope, $controller) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      var tempList = ["test","test","test1"];
      $scope.unique(tempList);
    }));
    it('Should Have customFilter', inject(function($rootScope, $controller) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      var tempItem ={"bundle_name":"a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip","bundle_type":"VmSupport","received_time":1502268440621,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"09/08/2017, 14:17:20"};
      $scope.customFilter(tempItem);
    }));
    it('Should Have eventContentApplyFilter', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.timefilter = {"currentValue":"Custom time","quickFilters":["1 Day","2 Days","1 Week","Custom time"],"customFilter":{"fromDate":{"gDate":"2017-08-16T11:24:46.011Z","hr":0,"min":0,"sec":0},"toDate":{"gDate":"2017-08-16T11:24:46.011Z","hr":0,"min":0,"sec":0}}};
      var time = {"sDate":"2017-08-15T18:30:00.000Z","eDate":"2017-08-15T18:30:00.000Z"};
      spyOn($scope, "getLogDetails");
      spyOn($scope, 'getTimeRangeForEventContent').and.returnValue(time);
      $scope.eventContentApplyFilter();
    }));
    it('Should Have eventContentApplyFilter else', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.timefilter = {"currentValue":"2 Weeks","quickFilters":["1 Day","2 Days","1 Week","Custom time"],"customFilter":{"fromDate":{"gDate":"2017-08-16T11:24:46.011Z","hr":0,"min":0,"sec":0},"toDate":{"gDate":"2017-08-16T11:24:46.011Z","hr":0,"min":0,"sec":0}}};
      var time = {"sDate":"2017-08-15T18:30:00.000Z","eDate":"2017-08-15T18:30:00.000Z"};
      spyOn($scope, "getLogDetails");
      spyOn($scope, 'getTimeRangeForEventContent').and.returnValue(time);
      $scope.eventContentApplyFilter();
    }));
    it('Should Have getHistory', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      var retData ={'data':{'Status':'Success','Msg':'List of bundles uploaded for mfr: vce, prod: vce, sch: pod between 2017-05-10T10:00:00Z and 2017-08-10T12:00:00Z','Data':[{'bundle_name':'a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip','bundle_type':'DEFAULT','received_time':1502271982905,'status':'FAILED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004NXBMA2~1~usa7061vs5041.na.xerox.net-vmsupport-2017-06-21@14-14-39.tgz.zip','bundle_type':'VmSupport','received_time':1501752974323,'status':'QUEUED','expected_time':14567,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip','bundle_type':'VmSupport','received_time':1502268440621,'status':'COMPLETED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004NlrMAE~1~mproral01-04.tceh.net-vmsupport-2017-06-22@18-45-18.tgz.zip','bundle_type':'VmSupport','received_time':1501751048961,'status':'COMPLETED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004OpfMAE~1~cscesxng2002.na.ngrid.net-vmsupport-2017-06-29%4010-43-51.tgz.zip','bundle_type':'VmSupport','received_time':1501770252560,'status':'COMPLETED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004OCOMA2~1~iwbvh009.mits.apmn.org-vmsupport-2017-05-19@14-22-52.tgz.zip','bundle_type':'DEFAULT','received_time':1501751564726,'status':'PROCESSING','expected_time':-456233,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004NZMMA2~1~e000049.cgcoreadm.com-vmsupport-2017-06-21@12-44-30.tgz.zip','bundle_type':'VmSupport','received_time':1501769829183,'status':'COMPLETED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'}]},'status':200,'config':{'transformRequest':[null],'transformResponse':[null],'cache':false,'method':'GET','url':'http://searchdev.glassbeam.com:9000/v1/bundles/uploaded/status/vce/vce/pod/2017-05-10T10:00:00Z/2017-08-10T12:00:00Z','headers':{'Accept':'application/json, text/plain, */*'}}};
      var searchData =[{"bundle_name":"a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip","bundle_type":"VmSupport","received_time":1502268440621,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"09/08/2017, 14:17:20"},{"bundle_name":"a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip","bundle_type":"DEFAULT","received_time":1502271982905,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"09/08/2017, 15:16:22"},{"bundle_name":"a5UA00000004NZMMA2~1~e000049.cgcoreadm.com-vmsupport-2017-06-21@12-44-30.tgz.zip","bundle_type":"VmSupport","received_time":1501769829183,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 19:47:09"},{"bundle_name":"a5UA00000004OpfMAE~1~cscesxng2002.na.ngrid.net-vmsupport-2017-06-29%4010-43-51.tgz.zip","bundle_type":"VmSupport","received_time":1501770252560,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 19:54:12"},{"bundle_name":"a5UA00000004NlrMAE~1~mproral01-04.tceh.net-vmsupport-2017-06-22@18-45-18.tgz.zip","bundle_type":"VmSupport","received_time":1501751048961,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 14:34:08"},{"bundle_name":"a5UA00000004OCOMA2~1~iwbvh009.mits.apmn.org-vmsupport-2017-05-19@14-22-52.tgz.zip","bundle_type":"DEFAULT","received_time":1501751564726,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 14:42:44"},{"bundle_name":"a5UA00000004NXBMA2~1~usa7061vs5041.na.xerox.net-vmsupport-2017-06-21@14-14-39.tgz.zip","bundle_type":"VmSupport","received_time":1501752974323,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 15:06:14"}];
      var deferred = $q.defer();
      deferred.resolve(retData);
      spyOn(LogStatusService, "getLogList").and.returnValue(deferred.promise);
      spyOn(LogStatusService, "updateAccessTime");
      spyOn($scope, "searchData").and.returnValue(searchData);
      spyOn($scope, "getLoginDetails");
      spyOn($scope, "fireHisoryModal");
      $scope.getHistory();
      $rootScope.$digest();
    }));
    it('Should Have openHistoryModal', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      spyOn($scope, "intervalStop");
      spyOn($scope, "getHistory");
      var time = {"sDate":"2017-08-16T10:09:26.491Z","eDate":"2017-08-16T12:09:26.491Z"};
      spyOn($scope, 'getTimeRangeForEventContent').and.returnValue(time);
      $scope.openHistoryModal();
    }));
    it('Should Have getTimeRangeForEventContent', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.timefilter = {"currentValue":"2 Week","quickFilters":["1 Day","2 Days","1 Week","Custom time"],"customFilter":{"fromDate":{"gDate":"2017-08-16T11:24:46.011Z","hr":0,"min":0,"sec":0},"toDate":{"gDate":"2017-08-16T11:24:46.011Z","hr":0,"min":0,"sec":0}}};
      $scope.getTimeRangeForEventContent();
    }));
    it('Should Have getTimeRangeForEventContent 2', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.timefilter = {"currentValue":"1 Week","quickFilters":["1 Day","2 Days","1 Week","Custom time"],"customFilter":{"fromDate":{"gDate":"2017-08-16T11:24:46.011Z","hr":0,"min":0,"sec":0},"toDate":{"gDate":"2017-08-16T11:24:46.011Z","hr":0,"min":0,"sec":0}}};
      $scope.getTimeRangeForEventContent();
    }));
    it('Should Have getTimeRangeForEventContent Custom', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.timefilter = {"currentValue":"Custom time","quickFilters":["1 Week","2 Week","Custom time"],"customFilter":{"fromDate":{"gDate":"2017-09-08T09:03:56.027Z","hr":0,"min":0,"sec":0},"toDate":{"gDate":"2017-09-08T09:03:56.027Z","hr":0,"min":0,"sec":0}}};
      $scope.getTimeRangeForEventContent();
    }));
    it('Should Have convertSecToHrsMinsSec', inject(function($rootScope, $controller) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.convertSecToHrsMinsSec("154826829");
    }));

    it('Should Have Sortclass', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.columnHistory = "test";
      $scope.sortClass("test");
    }));
    it('Should Have sortColumn', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.reverseHistory = true;
      $scope.sortColumn("bundle_name");
    }));
    it('Should Have getLoginDetails', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      var response = {"data":{"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"anish.kumar@glassbeam.com","first_name":"Anish","phone":"22131","org":"vce","role":"vce_vce_podui_admin","last_name":"Kumar","def_passwd":false,"department":"Enginnering","sso":false,"wb_user_name":"anish.kumar@glassbeam.com","report_usage":false,"created_on":"Tue Jun 13 00:00:00 EDT 2017","active":true,"city":"Karnataka","state":"bangalore","country":"India","is_external":false,"mps_def":"vce:vce:podui","org_type":10,"show_info":false}],"role_details":{"name":"vce_vce_podui_admin","is_super":false,"domains":{"product 3":"vce:vce:pod55","product1":"vce:vce:podui"},"features":{"vce:vce:pod55":"admin,dashboards,explorer,workbench,logvault","vce:vce:podui":"admin,explorer,rules_and_alerts,workbench,logvault"},"realm_isdomain":{"prod":"http://searchdev.glassbeam.com:9000/v1","poc":"http://uir.glassbeam.com:9000/v1"},"realm_uidomain":{"prod":"uianish.glassbeam.com","poc":"uir.glassbeam.com"},"mps_uidomain":{"vce:vce:pod55":"uianish.glassbeam.com","vce:vce:podui":"uianish.glassbeam.com"},"mps_isdomain":{"vce:vce:pod55":"http://searchdev.glassbeam.com:9000/v1","vce:vce:podui":"http://searchdev.glassbeam.com:9000/v1"},"realm_appsversion":{"vce:vce:pod55":"5.5","vce:vce:podui":"5.5"},"studio_proj_limit":0},"max_users":10,"max_licensed_users":5}},"status":200,"config":{"transformRequest":[null],"transformResponse":[null],"method":"GET","url":"http://searchdev.glassbeam.com:9191/v1/admin/role/user/details/vce/vce/podui","headers":{"Accept":"application/json, text/plain, */*"}}};
      document.cookie = 'mps=springpath:springpath:pod52';
      var deferred = $q.defer();
      deferred.resolve(response);
      spyOn(LogStatusService, "getLoginFields").and.returnValue(deferred.promise);
      spyOn(LogStatusService, "updateAccessTime");
      spyOn($scope, "getLogDetails");
      $scope.getLoginDetails();
      $rootScope.$digest();
    }));
    it('Should Have Sortclass 2', inject(function($rootScope, $controller, LogStatusService,$q, GlobalService) {
      var $scope = $rootScope.$new();
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      $scope.columnHistory = "test 1";
      $scope.sortClass("test");
      GlobalService.setGlobals();
      GlobalService.getUmsDomain();
      GlobalService.gethttpProtocol();
      GlobalService.setUmsDomain("TestDomain");
      GlobalService.showLoading("test");
      GlobalService.showLoading();
      GlobalService.hideLoading();
      GlobalService.setSessionCookies("test");
      GlobalService.setVal("testkey","testValue");
      GlobalService.logError("testError");
    }));

    it('Should Have getLogDetails', inject(function($rootScope, $controller, LogStatusService,$q) {
      var $scope = $rootScope.$new();
      document.cookie = 'mps=vce:vce:pod';
      var ctrl = $controller('LogStatusCtrl', {
          '$scope': $scope
      });
      var retData ={'data':{'Status':'Success','Msg':'List of bundles uploaded for mfr: vce, prod: vce, sch: pod between 2017-05-10T10:00:00Z and 2017-08-10T12:00:00Z','Data':[{'bundle_name':'a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip','bundle_type':'DEFAULT','received_time':1502271982905,'status':'FAILED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004NXBMA2~1~usa7061vs5041.na.xerox.net-vmsupport-2017-06-21@14-14-39.tgz.zip','bundle_type':'VmSupport','received_time':1501752974323,'status':'QUEUED','expected_time':14567,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip','bundle_type':'VmSupport','received_time':1502268440621,'status':'COMPLETED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004NlrMAE~1~mproral01-04.tceh.net-vmsupport-2017-06-22@18-45-18.tgz.zip','bundle_type':'VmSupport','received_time':1501751048961,'status':'COMPLETED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004OpfMAE~1~cscesxng2002.na.ngrid.net-vmsupport-2017-06-29%4010-43-51.tgz.zip','bundle_type':'VmSupport','received_time':1501770252560,'status':'COMPLETED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004OCOMA2~1~iwbvh009.mits.apmn.org-vmsupport-2017-05-19@14-22-52.tgz.zip','bundle_type':'DEFAULT','received_time':1501751564726,'status':'PROCESSING','expected_time':-456233,'ticket_number':'NA','customer_name':'NA','sysid':'NA'},{'bundle_name':'a5UA00000004NZMMA2~1~e000049.cgcoreadm.com-vmsupport-2017-06-21@12-44-30.tgz.zip','bundle_type':'VmSupport','received_time':1501769829183,'status':'COMPLETED','expected_time':0,'ticket_number':'NA','customer_name':'NA','sysid':'NA'}]},'status':200,'config':{'transformRequest':[null],'transformResponse':[null],'cache':false,'method':'GET','url':'http://searchdev.glassbeam.com:9000/v1/bundles/uploaded/status/vce/vce/pod/2017-05-10T10:00:00Z/2017-08-10T12:00:00Z','headers':{'Accept':'application/json, text/plain, */*'}}};
      var searchData =[{"bundle_name":"a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip","bundle_type":"VmSupport","received_time":1502268440621,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"09/08/2017, 14:17:20"},{"bundle_name":"a5UA00000004KgeMAE~1~cvgapesx106.td.afg-vmsupport-2017-06-03@03-56-10.tgz.zip","bundle_type":"DEFAULT","received_time":1502271982905,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"09/08/2017, 15:16:22"},{"bundle_name":"a5UA00000004NZMMA2~1~e000049.cgcoreadm.com-vmsupport-2017-06-21@12-44-30.tgz.zip","bundle_type":"VmSupport","received_time":1501769829183,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 19:47:09"},{"bundle_name":"a5UA00000004OpfMAE~1~cscesxng2002.na.ngrid.net-vmsupport-2017-06-29%4010-43-51.tgz.zip","bundle_type":"VmSupport","received_time":1501770252560,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 19:54:12"},{"bundle_name":"a5UA00000004NlrMAE~1~mproral01-04.tceh.net-vmsupport-2017-06-22@18-45-18.tgz.zip","bundle_type":"VmSupport","received_time":1501751048961,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 14:34:08"},{"bundle_name":"a5UA00000004OCOMA2~1~iwbvh009.mits.apmn.org-vmsupport-2017-05-19@14-22-52.tgz.zip","bundle_type":"DEFAULT","received_time":1501751564726,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 14:42:44"},{"bundle_name":"a5UA00000004NXBMA2~1~usa7061vs5041.na.xerox.net-vmsupport-2017-06-21@14-14-39.tgz.zip","bundle_type":"VmSupport","received_time":1501752974323,"status":"COMPLETED","expected_time":"-","ticket_number":"NA","customer_name":"NA","sysid":"NA","received_timeDis":"03/08/2017, 15:06:14"}];
      var deferred = $q.defer();
      deferred.resolve(retData);
      spyOn(LogStatusService, "getLogList").and.returnValue(deferred.promise);
      spyOn(LogStatusService, "updateAccessTime");
      spyOn($scope, "searchData").and.returnValue(searchData);
      spyOn($scope, "getLoginDetails");
      $scope.getLogDetails();
      $rootScope.$digest();
    }));
});
