'use strict';

/* jasmine specs for dashboards controllers go here */

describe('DashboardsCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;

	beforeEach(module('gbApp', 'gbApp.controllers.dashboards', 'gbApp.services.dashboards', 'gbApp.services.explorer', 'gbApp.services', 'ngCookies', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));

    beforeEach(inject(function ($rootScope, GlobalService) {
        $rootScope.isFeatureEnable = function() {
        };
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('Should have load variables', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.info).toEqual(jasmine.any(Object));
		expect(ctrl.info.complete).toBeTruthy();
		/*expect(ctrl.info.loadCount).toEqual(0);
		expect(ctrl.info.dashboardSortOrder).toBeFalsy();
		expect(ctrl.info.userDashboardSortOrder).toBeFalsy();
		expect(ctrl.dashboardType).toEqual(GlobalService.getVal('defaultDashboard'));
        expect(ctrl.info.show_category).toEqual(GlobalService.getVal('show_category'));
        expect(ctrl.dashboards).toEqual(jasmine.any(Array));
        expect(ctrl.defaultDashboard).toEqual(jasmine.any(Array));
        expect(ctrl.info.page).toEqual(jasmine.any(Object));
        expect(ctrl.info.page['total']).toEqual(0);
        expect(ctrl.info.page['current']).toEqual(0);
        expect(ctrl.info.page['pages']).toEqual(0);
        expect(ctrl.info.page['count']).toEqual(10);
        expect(ctrl.info.sessionTimedOut).toBeFalsy();*/
	}));
	
	it('should load without errors', inject(function($rootScope, $controller, Dashboards, ErrorService) {
        console.info(Dashboards);
        spyOn(ErrorService, "getErrors").and.returnValue(false);
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
    }));
	
	it('$watch ctrl.info.complete', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.info.complete = false;
        $httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond(500, {"Status":"Success","Msg":"System timeout","Data":[{"ec_name":"glass","sys_ids":["00:0C:29:B3:01:F8","00:0C:29:9E:F5:12","00:0C:29:21:24:D2"]}]});
        $scope.$digest();
        
        ctrl.info.complete = true;
        $scope.$digest();
    }));
	
	it('receive AppLoadEvent-dashboards', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.info.complete = false;
        $rootScope.$broadcast('AppLoadEvent-dashboards');
        ctrl.info.complete = true;
        $rootScope.$broadcast('AppLoadEvent-dashboards');
    }));
	
	it('Should load workbench dashboards', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
	    spyOn(GlobalService, "getVal").and.returnValue({'workbench': 1});
	    spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
    }));
    
    it('Should have isFeatureEnable', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        //spyOn(WorkbenchService, "getSubscriptionsList");
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.isFeatureEnable({});
    }));
    
    it('Should have isSubscribed', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        spyOn(WorkbenchService, "getSubscriptionsList");
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.isSubscribed({});
    }));
    
    it('Should have getWorkbenchApiRootDir', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        spyOn(WorkbenchService, "getWorkbenchApiRoot");
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.getWorkbenchApiRootDir({});
    }));
    
    it('Should have getSheetThumbnailImage LOGI', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        spyOn(ctrl, "getWorkbenchApiRootDir");
        var workbench = {
			"dname": "Dashboard321",
			"ddesc": "Dashboard",
			"d_id": "d349877b-db90-4393-bacd-98f0a4898007",
			"d_type": "Internal",
			"d_link": "http://gbdashboards.glassbeam.com/Springpath_Dev/rdPage.aspx?rdReport=Customer_Index.Customer_Index",
			"created_by": "nitin.dk@gmail.com",
			"created_ts": "2017-03-02T05:00:00Z",
			"modified_ts": "2017-03-02T05:00:00Z",
			"typ": null,
			"tag": [],
			"reports": [{}],
			"gDUser": "nitin.dk@gmail.com",
			"gDTs": "3-2-2017 10:30:0",
			"gDType": "Internal dashboards"
		}
        ctrl.getSheetThumbnailImage(workbench);
    }));
    it('Should have getSheetThumbnailImage TABLEAU', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        spyOn(ctrl, "getWorkbenchApiRootDir");
        var workbench = {
			"name": "Raja ka dashboard",
			"id": "0350992f-aef1-4f0a-a87f-d8132d5388a1",
			"tabs": false,
			"owner": "693a1c81-c8e7-4c3a-9a41-f304df26f30f",
			"modified_ts": "2017-05-05T12:32:53Z",
			"created_ts": "2017-05-05T12:32:21Z",
			"tags": [],
			"views": [{
				"id": "0c1767b3-83ed-424a-8480-1199dd838d59",
				"name": "Sheet 1",
				"url": "/t/springpathspringpathpod52/views/Rajakadashboard/Sheet1"
			}],
			"tag": [],
			"gDUser": "nitin.kulkarni@glassbeam.com",
			"gDTs": "5-5-2017 18:2:53",
			"gDType": "User created dashboards",
			"f_views": [{
				"id": "0c1767b3-83ed-424a-8480-1199dd838d59",
				"name": "Sheet 1",
				"url": "/t/springpathspringpathpod52/views/Rajakadashboard/Sheet1"
			}]
		}
        ctrl.getSheetThumbnailImage(workbench);
    }));
    it('Should have getSheetThumbnailImage TABLEAU with sheets', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        spyOn(ctrl, "getWorkbenchApiRootDir");
        var workbench = {
			"name": "Raja ka dashboard",
			"id": "0350992f-aef1-4f0a-a87f-d8132d5388a1",
			"tabs": false,
			"owner": "693a1c81-c8e7-4c3a-9a41-f304df26f30f",
			"modified_ts": "2017-05-05T12:32:53Z",
			"created_ts": "2017-05-05T12:32:21Z",
			"tags": [],
			"views": [{
				"id": "0c1767b3-83ed-424a-8480-1199dd838d59",
				"name": "Sheet 1",
				"url": "/t/springpathspringpathpod52/views/Rajakadashboard/Sheet1"
			}],
			"tag": [],
			"gDUser": "nitin.kulkarni@glassbeam.com",
			"gDTs": "5-5-2017 18:2:53",
			"gDType": "User created dashboards",
			"f_views": [{
				"id": "0c1767b3-83ed-424a-8480-1199dd838d59",
				"name": "Sheet 1",
				"url": "/t/springpathspringpathpod52/views/Rajakadashboard/Sheet1"
			}]
		}
        ctrl.getSheetThumbnailImage(workbench, {'id': undefined});
    }));

	it('should call allDetails', inject(function(infoserverDomain, $rootScope, $controller, Dashboards, $httpBackend, UserTrackingService, ErrorService, GlobalService) {

		$httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			"Status" : "Success",
			"Msg" : "Detailed list of all dashboards",
			"Data" : [{
				//"dname" : "New Violation",
				"ddesc" : "NEW name",
				"d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
				"d_type" : "Internal",
				//"d_link" : "NA",
				"reports" : [{
					//"rname" : "NEW Report",
					"rdesc" : "dashboard for checking NEW ",
					"r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
					//"r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
					"height" : 900
				}]
			}]
		});
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		spyOn(ctrl, "logActivity");
		expect(ctrl.r_link).toBeFalsy();
		expect(ctrl.r_name).toBeFalsy();
		expect(ctrl.d_name).toBeFalsy();

		$httpBackend.flush();
		$httpBackend.expect("POST", umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Dashboards/Dashboards/Default Load", {
			"details" : "{'New Violation.NEW Report'}",
			"solr_query": ""
		}).respond(500, {
			"Status" : "Success",
			"Msg" : "",
			"Data" : ""
		});
		expect(ctrl.dashboards.length).toEqual(1);
		expect(ctrl.r_link).toBeUndefined();
		expect(ctrl.r_name).toBeUndefined();
		expect(ctrl.d_name).toBeUndefined();
		$httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			"Status" : "Success",
			"Msg" : "Detailed list of all dashboards",
			"Data" : [{
				"dname" : "Summary Report",
				"ddesc" : "NA",
				"d_id" : "d349987b-db89-4393-bacd-98f0a4898f59",
				"d_type" : "External",
				"d_link" : "NA",
				"reports" : [{
					"rname" : "Summary Report",
					"rdesc" : "Summary Report",
					"r_id" : "f6c9987b-db89-4893-bacd-98f0a4d98f59",
					"r_link" : "https://dashboards.glassbeam.com/vce/rdPage.aspx?rdReport=Summary_Report.Summary_Report",
					"height" : 530
				}]
			}]
		});

		var $scope = $rootScope.$new();
		ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});

		spyOn(ErrorService, "setError");
		$httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			'Status' : 'Failure',
			'Msg' : 'Session Timeout',
			'Data' : []
		});

		var $scope = $rootScope.$new();
		ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});

	}));
	it('should call allDetails with error', inject(function(infoserverDomain, $rootScope, $controller, Dashboards, $httpBackend, UserTrackingService, ErrorService, GlobalService) {

		$httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond(500,{"Status" : "Failure"});
	}));	

    it('Should have getAllDeatils', inject(function(Dashboards, infoserverDomain,$rootScope, $httpBackend,$controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' +  product + '/' + schema).respond(200,{});
        ctrl.getAllDeatils();
    }));

  /*  it('Should have loadingDone', inject(function($rootScope, $controller, WorkbenchService, GlobalService, $timeout) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.loadingDone();
        $timeout.flush(10000);
    }));*/

    it('Should have isInstanceViewerVisible', inject(function(infoserverDomain,$rootScope, $httpBackend,$controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        
        ctrl.isInstanceViewerVisible();
    }));

    it('Should have toggleSelectAll', inject(function(infoserverDomain,$rootScope, $httpBackend,$controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        
        ctrl.toggleSelectAll('all');
    }));

    it('Should have toggleSelectAll None', inject(function(infoserverDomain,$rootScope, $httpBackend,$controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        
        ctrl.toggleSelectAll({});
    }));
    it('Should have getMessage', inject(function(infoserverDomain,$rootScope, $httpBackend,$controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        
        ctrl.getMessage();
    }));

    it('Should have filterTableau', inject(function(infoserverDomain,$rootScope, $httpBackend,$controller, WorkbenchService, GlobalService) {
        
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        spyOn(ctrl, "getAllDashboards");
        ctrl.filterTableau();
    }));

	/*
	it('should call allDetails with parameters', inject(function(infoserverDomain, $rootScope, $controller, Dashboards, $httpBackend, UserTrackingService, ErrorService, GlobalService, $timeout) {
		var element = document.createElement("input");
		element.type = "hidden";
		element.id = "request_page";
		element.value = "dashboard_id=38746374&Serial=83763&EpochValue=kjdhfjd";
		document.body.appendChild(element);
		$httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			"Status" : "Success",
			"Msg" : "Detailed list of all dashboards",
			"Data" : [{
				"dname" : "New Violation",
				"ddesc" : "NEW name",
				"d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
				"d_type" : "Internal",
				"d_link" : 'NA',
				"reports" : [{
					"rname" : "NEW Report",
					"rdesc" : "dashboard for checking NEW ",
					"r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
					"r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
					"height" : 900
				}]
			}]
		});

		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});

		expect(ctrl.r_link).toBeFalsy();
		expect(ctrl.r_name).toBeFalsy();
		expect(ctrl.d_name).toBeFalsy();

		$httpBackend.flush();
		$timeout.flush(5000);
		$httpBackend.expect("POST", umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Dashboards/Dashboards/Default Load", {
			"details" : "{'New Violation.'}",
			"solr_query": ""
		}).respond(500, {
			"Status" : "Success",
			"Msg" : "",
			"Data" : ""
		});
		expect(ctrl.dashboards.length).toEqual(1);
		expect(ctrl.r_link).toBeUndefined();
		expect(ctrl.r_name).toBeUndefined();
		expect(ctrl.d_name).toBeUndefined();

		$httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			"Status" : "Success",
			"Msg" : "Detailed list of all dashboards",
			"Data" : [{
				"dname" : "Summary Report",
				"ddesc" : "NA",
				"d_id" : "d349987b-db89-4393-bacd-98f0a4898f59",
				"d_type" : "External",
				"d_link" : "NA",
				"reports" : [{
					"rname" : "Summary Report",
					"rdesc" : "Summary Report",
					"r_id" : "f6c9987b-db89-4893-bacd-98f0a4d98f59",
					"r_link" : "https://dashboards.glassbeam.com/vce/rdPage.aspx?rdReport=Summary_Report.Summary_Report",
					"height" : 530
				}]
			}]
		});
		
		var $scope = $rootScope.$new();
		$controller('DashboardsCtrl', {
			'$scope' : $scope
		});

		spyOn(ErrorService, "setError");
		$timeout.flush(5000);
		$httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			'Status' : 'Failure',
			'Msg' : 'Session Timeout',
			'Data' : []
		});
		
		var $scope = $rootScope.$new();
		ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});

		$timeout.flush(5000);
		expect(ctrl.info.complete).toBe(true);
		expect(ctrl.dashboards.length).toEqual(1);
		document.body.removeChild(element);
	}));
	
	it('should call allDetails with error block', inject(function(infoserverDomain, WorkbenchService, $rootScope, $controller, Dashboards, $httpBackend, UserTrackingService, ErrorService, ModalService, GlobalService, $timeout) {
		spyOn(ModalService, "sessionTimeout");
		$httpBackend.expect("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond(500, {
			"Status" : "Failure",
			"Msg" : "Session timeout",
			"Data" : [{
				"dname" : "New Violation",
				"ddesc" : "NEW name",
				"d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
				"d_type" : "Internal",
				"d_link" : "NA",
				"reports" : [{
					"rname" : "NEW Report",
					"rdesc" : "dashboard for checking NEW ",
					"r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
					"r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
					"height" : 900
				}]
			}]
		});
		$httpBackend.whenGET('/apps/app/partials/session_timeout.html').respond('text');
		spyOn(WorkbenchService, "updateWorkbooks");

		$rootScope.isFeatureEnable = function() {
			return 1;
		};
		GlobalService.setVal('logout_url', '#');
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});

		$httpBackend.flush();
		
		$httpBackend.expect("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond(500, {
			"Status" : "Failure",
			"Msg" : "",
			"Data" : [{
				"dname" : "New Violation",
				"ddesc" : "NEW name",
				"d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
				"d_type" : "Internal",
				"d_link" : "NA",
				"reports" : [{
					"rname" : "NEW Report",
					"rdesc" : "dashboard for checking NEW ",
					"r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
					"r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
					"height" : 900
				}]
			}]
		});

		$rootScope.isFeatureEnable = function() {
			return 0;
		};
		GlobalService.setVal('logout_url', '#');
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});

		$httpBackend.flush();
	}));
	*/
	it('Should have isPowerUser', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.isPowerUser();
    }));
    
    it('Should have subscribe', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.subscribe({});
    }));
    
    it('Should have updateSubscription', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.updateSubscription({});
    }));
    
    it('Should have unsubscribe', inject(function($rootScope, $controller, WorkbenchService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.unsubscribe({});
    }));

	it('getSysErrors', inject(function($rootScope, $controller, ErrorService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getSysErrors).toEqual(jasmine.any(Function));
		expect(ctrl.getSysErrors()).toEqual(ErrorService.getErrors('gbApp'));
	}));

	it('addInstance', inject(function($rootScope, $controller, InstanceHandler) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.addInstance).toEqual(jasmine.any(Function));
		var report = {
			rname : 'unit'
		};
		spyOn(InstanceHandler, "addInstance");
		ctrl.addInstance(report);
		var instance;
		var instanceConfig = {
			'type' : 'dashboard',
			'name' : report.rname,
			'data' : {
				'report' : report,
			}
		};
		instance = JSON.parse(angular.toJson(instanceConfig));
		expect(InstanceHandler.addInstance).toHaveBeenCalledWith(instance, ctrl);
	}));

	/*it('logActivity', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.logActivity).toEqual(jasmine.any(Function));
		$httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			"Status" : "Success",
			"Msg" : "Detailed list of all dashboards",
			"Data" : [{
				"dname" : "New Violation",
				"ddesc" : "NEW name",
				"d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
				"d_type" : "Internal",
				"d_link" : "NA",
				"reports" : [{
					"rname" : "NEW Report",
					"rdesc" : "dashboard for checking NEW ",
					"r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
					"r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
					"height" : 900
				}]
			}]
		});
		$httpBackend.expect("POST", umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Dashboards/module/activity", {
			"details" : "details",
			"solr_query": ""
		}).respond({
			"Status" : "Success",
			"Msg" : "",
			"Data" : ""
		});
		ctrl.logActivity('module', 'activity', 'details');
		$httpBackend.flush();

		var $scope = $rootScope.$new();
		ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		$httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			"Status" : "Success",
			"Msg" : "Detailed list of all dashboards",
			"Data" : [{
				"dname" : "New Violation",
				"ddesc" : "NEW name",
				"d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
				"d_type" : "Internal",
				"d_link" : "NA",
				"reports" : [{
					"rname" : "NEW Report",
					"rdesc" : "dashboard for checking NEW ",
					"r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
					"r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
					"height" : 900
				}]
			}]
		});
		// var current_time = Math.floor((new Date).getTime() / 1000);
		$httpBackend.expect("POST", umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Dashboards/module/activity", {
			"details" : "details",
			"solr_query": ""
		}).respond({
			"Status" : "Success",
			"Msg" : "",
			"Data" : ""
		})
		$httpBackend.whenGET('/apps/app/partials/session_timeout.html').respond('text');
		ctrl.logActivity('module', 'activity', 'details');
		$httpBackend.flush();
	}));*/

	it('search', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.search).toEqual(jasmine.any(Function));
		expect(ctrl.search()).toEqual(jasmine.any(Object));
		ctrl.info.query = "Hello";
		expect(ctrl.search()).toEqual({
			"rdesc" : ctrl.info.query
		});
	}));

	it('toggleDashboard', inject(function($rootScope, $controller, ModalService) {
		var $scope = $rootScope.$new(),
		    dashboard = {

			expand : true
		};
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		spyOn(ModalService, "alertBox");
		expect(ctrl.toggleDashboard).toEqual(jasmine.any(Function));
		expect(dashboard.expand).toBeTruthy();
		ctrl.toggleDashboard(dashboard);
		expect(dashboard.expand).toBeFalsy();
		ctrl.toggleDashboard(dashboard);
		expect(dashboard.expand).toBeTruthy();
		ctrl.info.query = true;
		ctrl.toggleDashboard(dashboard);
		expect(ModalService.alertBox).toHaveBeenCalledWith({msgKey: 'dashboard_collapse'});
	}));

	it('filterResult', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.filterResult).toEqual(jasmine.any(Function));
		expect(ctrl.filterResult()).toBeTruthy();
		ctrl.dashboards = {
			unit1 : {
				f_reports : 'unit1'
			},
			unit2 : {
				f_reports : null
			}
		};
		expect(ctrl.filterResult()).toBeFalsy();
		ctrl.info.complete = false;
		expect(ctrl.filterResult()).toBeFalsy();
	}));

	it('getMessage', inject(function($rootScope, $controller, GlobalService, Dashboards, ErrorService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getMessage).toEqual(jasmine.any(Function));
		//expect(ctrl.getMessage()).toEqual(GlobalService.getVal('filter_fail'));
	}));

	it('sceURL', inject(function($rootScope, $controller, $sce) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.sceURL).toEqual(jasmine.any(Function));
		spyOn($sce, "trustAsResourceUrl");
		ctrl.sceURL('http://www.glassbeam.com/');
		expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('http://www.glassbeam.com/');
	}));

	it('sceHTML', inject(function($rootScope, $controller, $sce) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.sceHTML).toEqual(jasmine.any(Function));
		spyOn($sce, "trustAsHtml");
		ctrl.sceHTML('<a href="#">Link</a>');
		expect($sce.trustAsHtml).toHaveBeenCalledWith('<a href="#">Link</a>');
	}));

	it('getWorkbooks', inject(function($rootScope, $controller, WorkbenchService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getWorkbooks).toEqual(jasmine.any(Function));
		expect(ctrl.getWorkbooks()).toEqual({
			loading : true,
			books : [],
			error : undefined,
			userUnauthorized: undefined
		});
		ctrl.info.page['count'] = 2;
		spyOn(WorkbenchService, "getWorkbooksLocal").and.returnValue({
            loading : false,
            books : ['book1', 'book2', 'book3'],
            error : undefined,
			userUnauthorized: undefined
        });
        expect(ctrl.getWorkbooks()).toEqual({
            loading : false,
            books : ['book1', 'book2', 'book3'],
            error : undefined,
			userUnauthorized: undefined
        });
	}));
	
	it('getWorkbooks else block', inject(function($rootScope, $controller, WorkbenchService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getWorkbooks).toEqual(jasmine.any(Function));
        spyOn(WorkbenchService, "getWorkbooksLocal").and.returnValue({});
        expect(ctrl.getWorkbooks()).toEqual({
            loading : undefined,
            books : undefined,
            error : undefined,
			userUnauthorized: undefined
        });
    }));

	it('nextPage', inject(function($rootScope, $controller, WorkbenchService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.nextPage).toEqual(jasmine.any(Function));
		ctrl.info.page = {
			current : 2,
			pages : 20
		};
		spyOn(ctrl, "getAllDashboards");
		ctrl.nextPage();
		expect(ctrl.info.page).toEqual({
			current : 3,
			pages : 20
		});
		expect(ctrl.getAllDashboards).toHaveBeenCalled();
		ctrl.info.page = {
			current : 19,
			pages : 20
		};
		ctrl.nextPage();
		expect(ctrl.info.page).toEqual({
			current : 19,
			pages : 20
		});
	}));

	it('prevPage', inject(function($rootScope, $controller, WorkbenchService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.prevPage).toEqual(jasmine.any(Function));
		ctrl.info.page.current = 1;
		spyOn(ctrl, "getAllDashboards");
		ctrl.prevPage();
		expect(ctrl.getAllDashboards).toHaveBeenCalled();
		expect(ctrl.info.page.current).toEqual(0);
		ctrl.info.page.current = 0;
		ctrl.prevPage();
		expect(ctrl.info.page.current).toEqual(0);
	}));

	it('Should have firstPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.firstPage).toEqual(jasmine.any(Function));
		ctrl.info.page.current = 0;
		spyOn(ctrl, "getAllDashboards");
		ctrl.firstPage();
		expect(ctrl.info.page.current).toEqual(0);
		ctrl.info.page.current = 7;
		ctrl.firstPage();
		expect(ctrl.info.page.current).toEqual(0);
		expect(ctrl.getAllDashboards).toHaveBeenCalled();
	}));

	it('Should have lastPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.lastPage).toEqual(jasmine.any(Function));
		ctrl.info.page = {
			current : 3,
			pages : 30
		};
		spyOn(ctrl, "getAllDashboards");
		ctrl.lastPage();
		expect(ctrl.info.page.current).toEqual(29);
		expect(ctrl.getAllDashboards).toHaveBeenCalled();
		ctrl.info.page.current = 29;
		ctrl.lastPage();
		expect(ctrl.info.page.current).toEqual(29);
	}));
	
	it('Should have getValue', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        spyOn(GlobalService, "getVal");
        ctrl.getValue('key');
        expect(GlobalService.getVal).toHaveBeenCalledWith('key');
    }));

	// it('Should have sortResults', inject(function($rootScope, $controller) {
		// $rootScope.isFeatureEnable = function() {
		// };
		// var $scope = $rootScope.$new();
		// var ctrl = $controller('DashboardsCtrl', {
			// '$scope' : $scope
		// });
		// expect(ctrl.sortResults).toEqual(jasmine.any(Function));
		// var order = 'asc';
		// spyOn(ctrl, "getWorkbooks");
		// ctrl.sortResults(order);
		// expect(ctrl.info.sortOrder).toEqual({
			// "label" : "Oldest",
			// "val" : "asc"
		// });
		// expect(ctrl.getWorkbooks).toHaveBeenCalled();
		// order = 'desc';
		// ctrl.sortResults(order);
		// expect(ctrl.info.sortOrder).toEqual({
			// "label" : "Latest",
			// "val" : "desc"
		// });
		// expect(ctrl.getWorkbooks).toHaveBeenCalled();
	// }));

	it('expandBook', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.expandBook).toEqual(jasmine.any(Function));
		var book = {
			expand : true
		};
		ctrl.expandBook(book);
		expect(book.expand).toBeFalsy();
	}));

	/*it('filterTableau', inject(function($rootScope, $controller, WorkbenchService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.filterTableau).toEqual(jasmine.any(Function));
		expect(ctrl.filterTableau()).toBeFalsy();
		ctrl.info.query = 'b';
		var workbooks = {
			books : {
				book1 : {
					views : [{tags : 'abc, sdf, dfr'}]
				},
		        book2 : {
                    views : [{tags : 'nvf'}]
                }
			}
		};
		spyOn(ctrl, "getAllDashboards").and.returnValue(workbooks);
		ctrl.filterTableau();
		ctrl.info.query = 'x';
		ctrl.filterTableau();
	}));*/
	
	it('userPermitted', inject(function($rootScope, $controller, WorkbenchService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.userPermitted).toEqual(jasmine.any(Function));
        expect(ctrl.userPermitted()).toBeTruthy();
    }));
    
    it('userPermitted generic user role', inject(function($rootScope, $controller, metaDataService) {
        var $scope = $rootScope.$new();
        spyOn(metaDataService, "getUser").and.returnValue({'email': 'test', 'wb_user_name': 'test1', 'role': 'admin'});
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.userPermitted()).toBeFalsy();
    }));

	it('addTabInstance', inject(function($rootScope, $controller, InstanceHandler) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.addTabInstance).toEqual(jasmine.any(Function));
		var view = {
			name : 'unit'
		};
		spyOn(InstanceHandler, "addInstance");
		ctrl.addTabInstance(view, 'undefined');
		var instanceConfig = {
			'type' : 'tableau',
			'name' : view['name'],
			'data' : {
				'view' : view,
				'mode' : 'viewer'
			},
			'owner' : 'undefined'
		};
		var instance = JSON.parse(angular.toJson(instanceConfig));
		expect(InstanceHandler.addInstance).toHaveBeenCalledWith(instance, ctrl, 'undefined');
	}));
	
	it('addTagToWorkbook', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.addTagToWorkbook).toEqual(jasmine.any(Function));
        ctrl.addTagToWorkbook({});
    }));
    
    it('removeTagFromWorkbook', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, metaDataService, WorkbenchService, Dashboards) {
        var $scope = $rootScope.$new();
        spyOn(Dashboards, "removeTag").and.callThrough();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        spyOn(ctrl, "getAllDeatils");
        expect(ctrl.removeTagFromWorkbook).toEqual(jasmine.any(Function));
        ctrl.removeTagFromWorkbook({}, 'tag1');
        //$httpBackend.expect('GET', infoserverDomain + '/dashboards/remove/tag/' + manufacturer + '/' + product + '/' + schema+ '/123/tag').respond(500, {"Status":"Success","Msg":"","Data":[]});
        //$httpBackend.expect('GET', infoserverDomain + '/tableau/workbook/tag/delete/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined + '/' + 'tag1').respond({})

        //$httpBackend.flush();
    }));
    /*
    it('removeTagFromWorkbook error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, metaDataService, WorkbenchService) {
        var $scope = $rootScope.$new();
        spyOn(WorkbenchService, "updateWorkbooks");
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.removeTagFromWorkbook).toEqual(jasmine.any(Function));
        ctrl.removeTagFromWorkbook({}, 'tag1');
        $httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond(500, {"Status":"Success","Msg":"","Data":[{"ec_name":"glass","sys_ids":["00:0C:29:B3:01:F8","00:0C:29:9E:F5:12","00:0C:29:21:24:D2"]}]});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbook/tag/delete/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined + '/' + 'tag1').respond(500, {})

        $httpBackend.flush();
    }));*/
    
    it('updateWorkbook', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.updateWorkbook).toEqual(jasmine.any(Function));
        ctrl.updateWorkbook({});
    }));
    
    it('deleteWorkbook', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.deleteWorkbook).toEqual(jasmine.any(Function));
        ctrl.deleteWorkbook({});
    }));
    
    it('should have checkOwner', inject(function($rootScope, $controller, WorkbenchService) {
        spyOn(WorkbenchService, "getUserId").and.returnValue('user1');
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.checkOwner).toEqual(jasmine.any(Function));
        expect(ctrl.checkOwner({owner: 'user1'})).toBeTruthy();
        expect(ctrl.checkOwner({owner: 'user2'})).toBeFalsy();
    }));

	it('should have addTabbedTabInstance', inject(function($rootScope, $controller, InstanceHandler) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.addTabbedTabInstance).toEqual(jasmine.any(Function));
		var book = {
			name : 'unit',
			owner: 'undefined'
		};
		spyOn(InstanceHandler, "addInstance");
		ctrl.addTabbedTabInstance(book);
		var instanceConfig = {
			'type' : 'tableau',
			'name' : book['name'],
			'data' : {
				'book' : book,
				'mode' : 'viewer'
			},
			'owner' : 'undefined'
		};
		var instance = JSON.parse(angular.toJson(instanceConfig));
		expect(InstanceHandler.addInstance).toHaveBeenCalledWith(instance, ctrl, 'undefined');
	}));

	it('should have addManageInstance', inject(function($rootScope, $controller, InstanceHandler) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.addManageInstance).toEqual(jasmine.any(Function));
		spyOn(InstanceHandler, "addInstance");
		ctrl.addManageInstance();
		var instance = {
			'type' : 'permissions',
			'name' : 'Manage Reports',
			'data' : {}
		};
		instance = JSON.parse(angular.toJson(instance));
		expect(InstanceHandler.addInstance).toHaveBeenCalledWith(instance, ctrl);
	}));

    it('should get default dashboard type from GlobalService', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.dashboardType).toEqual(GlobalService.getVal('defaultDashboard'));
    }));

    it('should set default dashboard type', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.dashboardType).toEqual(GlobalService.getVal('defaultDashboard'));
        ctrl.setDashboard('other');
        expect(ctrl.dashboardType).toEqual('other');
    }));
	
	it('should have getTagsForTableau', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'tableauDashboards': [{'d_name': 123, 'tag':[]}]
        });
        expect(ctrl.getTagsForTableau).toEqual(jasmine.any(Function));
        ctrl.getTagsForTableau('123');
    }));
	
	it('should have isNoDashboards', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.isNoDashboards).toEqual(jasmine.any(Function));
        ctrl.isNoDashboards();
    }));
	
	it('shoud have isSingleDashboard', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.isSingleDashboard).toEqual(jasmine.any(Function));
        ctrl.isSingleDashboard();
    }));
	
	it('shoud have columnSorting', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.columnSorting).toEqual(jasmine.any(Function));
        ctrl.columnSorting();
    }));

	it('should have getAllDashboards', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{'id':123, 'tag':['abc']}],
            'info':{
            	'orderByField' : true,
            	'query': 'abc'
            }
        });
        expect(ctrl.getAllDashboards).toEqual(jasmine.any(Function));
        ctrl.getAllDashboards();
    }));
	
	it('shoud have getDCreatorName', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.getDCreatorName).toEqual(jasmine.any(Function));
        ctrl.getDCreatorName();
    }));
	
	it('shoud have isDuplicateArrayObject', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.isDuplicateArrayObject).toEqual(jasmine.any(Function));
        ctrl.isDuplicateArrayObject(['abc', 'def'], 'abc');
    }));
	
	it('shoud have getAllTagsName', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'allDashboardsList' : [{'id': '123', 'tags':['tag1']}]
        };
        expect(ctrl.getAllTagsName).toEqual(jasmine.any(Function));
        ctrl.getAllTagsName();
        ctrl.info = {
        	'allDashboardsList' : [{'id': '123', 'tag':['tag1']}]
        };
        ctrl.getAllTagsName();
    }));
	
	it('shoud have getAllTagsNameOfSelectedDashboards', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'allDashboardsList' : [{'id': '123', 'tags':['tag1'], 'selected': true}]
        };
        expect(ctrl.getAllTagsNameOfSelectedDashboards).toEqual(jasmine.any(Function));
        ctrl.getAllTagsNameOfSelectedDashboards();
    }));
	
	it('shoud have unique', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.unique).toEqual(jasmine.any(Function));
        ctrl.unique(['abc','def','ghi', 'abc']);
    }));
	
	it('shoud have addExistingTag', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'tags' : 'tag1,tag2,tag3'
        };
        spyOn(ctrl, "processMultipleTags");
        spyOn(ctrl, "isAlphaNumeric");
        expect(ctrl.addExistingTag).toEqual(jasmine.any(Function));
        ctrl.addExistingTag();
        ctrl.info = {
        	'tags' : ''
        };
        ctrl.addExistingTag();
        ctrl.info = {
        	'tags' : 'tag1,tag2,tag3'
        };
        ctrl.addExistingTag('tag1');
    }));
	
	it('shoud have getBookOwnerName', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'bookOwnerList' : [{'_id': '123'}]
        };
       // spyOn(ctrl, "processMultipleTags");
        expect(ctrl.getBookOwnerName).toEqual(jasmine.any(Function));
        ctrl.getBookOwnerName({'name':'abc'});
        ctrl.getBookOwnerName({'dname':'abc'});
        ctrl.getBookOwnerName({'name':'abc','owner':'123'});
    }));
	
	it('shoud have filterOnType', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'dType' :'internalDashboards'
        };
       // spyOn(ctrl, "processMultipleTags");
        expect(ctrl.filterOnType).toEqual(jasmine.any(Function));
        ctrl.filterOnType([{'dname':'abc'}]);
        ctrl.info = {
        	'dType' :'userCreatedDashboards'
        };
        ctrl.filterOnType([{'name':'abc'}]);
    }));
	
	it('shoud have filterOnCreator', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'createdBy' :'abc'
        };
       // spyOn(ctrl, "processMultipleTags");
        expect(ctrl.filterOnCreator).toEqual(jasmine.any(Function));
        ctrl.filterOnCreator([{'dname':'abc', 'gDUser': 'abc'}]);
    }));
	
	it('shoud have getNameOfDashboard', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        /*ctrl.info = {
        	'createdBy' :'abc'
        };*/
       // spyOn(ctrl, "processMultipleTags");
        expect(ctrl.getNameOfDashboard).toEqual(jasmine.any(Function));
        ctrl.getNameOfDashboard({'name':'abc', 'gDUser': 'abc'}, 2);
        ctrl.getNameOfDashboard({'name':'abc', 'gDUser': 'abc'}, 5);
        ctrl.getNameOfDashboard({'name':'abc', 'gDUser': 'abc'});
        ctrl.getNameOfDashboard({'dname':'abc', 'gDUser': 'abc'}, 2);
        ctrl.getNameOfDashboard({'dname':'abc', 'gDUser': 'abc'}, 5);
        ctrl.getNameOfDashboard({'dname':'abc', 'gDUser': 'abc'});
    }));
	
	it('shoud have localFilter', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'page': {
        		'current' : 5
        	}
        };
        spyOn(ctrl, "firstPage");
        expect(ctrl.localFilter).toEqual(jasmine.any(Function));
        ctrl.localFilter();
    }));
	
	it('shoud have changeView', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'page': {        		
        		'current':5
        	}
        };
        spyOn(ctrl, "firstPage");
        expect(ctrl.changeView).toEqual(jasmine.any(Function));
        ctrl.changeView('list');
        ctrl.changeView('thumbnail');
    }));
	
	it('shoud have addTagInternalDashboards', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.addTagInternalDashboards).toEqual(jasmine.any(Function));
        ctrl.addTagInternalDashboards({'d_id': 'abc'});
    }));
	
	it('shoud have hideModal', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
        ctrl.hideModal();
    }));
	
	it('shoud have addTagSingle', inject(function($httpBackend,$rootScope, $controller, Dashboards, infoserverDomain) {
        var $scope = $rootScope.$new();
        spyOn(Dashboards, "addTagsToDashboards").and.callThrough();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	'tags' : 'tag1',
        	'selectedBooks' : [{}]
        };
        spyOn(ctrl, "getAllDeatils");
        spyOn(ctrl, "hideModal");
        expect(ctrl.addTagSingle).toEqual(jasmine.any(Function));
        ctrl.addTagSingle();

        /*$httpBackend.expect('POST', infoserverDomain + '/dashboards/add/tag/' + manufacturer + '/' + product + '/' + schema).respond(200);
        ctrl.addTagSingle();
        $httpBackend.flush();*/
    }));
	
	it('shoud have showAddTagsDd', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        spyOn(ctrl, "getAllDashboards").and.returnValue([{}]);
        expect(ctrl.showAddTagsDd).toEqual(jasmine.any(Function));
        ctrl.showAddTagsDd();
    }));
	
	it('shoud have showMsg', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	"errMsg": "msg"
        };
        //spyOn(ctrl, "getAllDashboards").and.returnValue([{}]);
        expect(ctrl.showMsg).toEqual(jasmine.any(Function));
        ctrl.showMsg();
        ctrl.info = {
        	"errMsg": ''
        };
        ctrl.showMsg();
    }));
	
	it('shoud have isAlphaNumeric', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	"allDashboardsList": [{'name': 'abc', 'tag': [], 'selected': true}],
        	"tags": ''
        };
        expect(ctrl.isAlphaNumeric).toEqual(jasmine.any(Function));
        ctrl.isAlphaNumeric();
        ctrl.info = {
        	"allDashboardsList": [{'name': 'abc', 'tag': [], 'selected': true}],
        	"tags": 'tag1,tag2,tag3 tag4 tag5'
        };
        ctrl.isAlphaNumeric();
    }));
	/*
	it('shoud have addTagsMultiple', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        spyOn(ctrl, "getAllDashboards");
        spyOn(ctrl, "processMultipleTags");
        //spyOn(Dashboards, "addTagsToDashboards").and.returnValue([{}]);
        ctrl.info = {
        	"allDashboardsList": [{'name': 'abc', 'tag': [], 'selected': true}],
        	"tags": ''
        };
        expect(ctrl.addTagsMultiple).toEqual(jasmine.any(Function));
        ctrl.addTagsMultiple();
    }));*/

	it('shoud have processMultipleTags', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	"tags": 'tag1,tag2'
        };
        expect(ctrl.processMultipleTags).toEqual(jasmine.any(Function));
        ctrl.processMultipleTags();
    }));

	it('shoud have showDashboardTileFrame', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	"tags": 'tag1,tag2'
        };
        expect(ctrl.showDashboardTileFrame).toEqual(jasmine.any(Function));
        ctrl.showDashboardTileFrame({});
    }));

	it('shoud have getReportList', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	"currentBook": {
        		'reports': []
        	}
        };
        expect(ctrl.getReportList).toEqual(jasmine.any(Function));
        ctrl.getReportList();
        ctrl.info = {
        	"currentBook": {
        		'views': []
        	}
        };
        ctrl.getReportList();
    }));

	it('shoud have internalDashboards', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        ctrl.info = {
        	"currentBook": {
        		'reports': []
        	}
        };
        expect(ctrl.internalDashboards).toEqual(jasmine.any(Function));
        ctrl.internalDashboards({});
    }));

	it('shoud have getReportName', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.getReportName).toEqual(jasmine.any(Function));
        ctrl.getReportName({'rname': 'abc'});
        ctrl.getReportName({'name': 'abc'});
    }));

	it('shoud have openSettingsMenu', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.openSettingsMenu).toEqual(jasmine.any(Function));
        ctrl.openSettingsMenu(new Event('click'));
    }));

	it('shoud have changeDateFormate', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.changeDateFormate).toEqual(jasmine.any(Function));
        ctrl.changeDateFormate(new Date());
    }));
/*
	it('shoud have clearMessage', inject(function($rootScope, $controller, WorkbenchService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope,
            'dashboards': [{}]
        });
        expect(ctrl.$scope.clearMessage).toEqual(jasmine.any(Function));
        //$scope.clearMessage();
    }));*/


    it('should get summary dashboard with other dashboards', inject(function(infoserverDomain, $rootScope, $controller, Dashboards, $httpBackend) {
        $httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
            "Status" : "Success",
            "Msg" : "Detailed list of all dashboards",
            "Data" : [{
                "dname" : "New Violation",
                "ddesc" : "NEW name",
                "d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
                "d_type" : "Internal",
                "d_link" : "NA",
                "reports" : [{
                    "rname" : "NEW Report",
                    "rdesc" : "dashboard for checking NEW ",
                    "r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
                    "r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
                    "height" : 900
                }]
            },{
                "dname" : "New Violation",
                "ddesc" : "NEW name",
                "d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
                "d_type" : "Summary",
                "d_link" : "NA",
                "reports" : [{
                    "rname" : "NEW Report",
                    "rdesc" : "dashboard for checking NEW ",
                    "r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
                    "r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
                    "height" : 900
                }]
            }]
        });
        $httpBackend.expect("POST", infoserverDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Dashboards/Summary Dashboard/Default Load').respond(200);
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        $httpBackend.flush();
        expect(ctrl.dashboardType).toEqual('summary');
    }));

    it('should get summary dashboard only', inject(function(infoserverDomain, $rootScope, $controller, Dashboards, $httpBackend) {
        $httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
            "Status" : "Success",
            "Msg" : "Detailed list of all dashboards",
            "Data" : [{
                "dname" : "New Violation",
                "ddesc" : "NEW name",
                "d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
                "d_type" : "Summary",
                "d_link" : "NA",
                "reports" : [{
                    "rname" : "NEW Report",
                    "rdesc" : "dashboard for checking NEW ",
                    "r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
                    "r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
                    "height" : 900
                }]
            }]
        });
        $httpBackend.expect("POST", infoserverDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Dashboards/Summary Dashboard/Default Load').respond(200);
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        $httpBackend.flush();
        expect(ctrl.dashboardType).toEqual('summary');
    }));

    /*it('should get only other dashboard', inject(function(infoserverDomain, $rootScope, $controller, Dashboards, $httpBackend) {
        $httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
            "Status" : "Success",
            "Msg" : "Detailed list of all dashboards",
            "Data" : [{
                "dname" : "New Violation",
                "ddesc" : "NEW name",
                "d_id" : "d349987b-db39-4393-bacd-98f0a4898f59",
                "d_type" : "Internal",
                "d_link" : "NA",
                "reports" : [{
                    "rname" : "NEW Report",
                    "rdesc" : "dashboard for checking NEW ",
                    "r_id" : "f6c9987b-db89-4843-bacd-98f1a4d98f59",
                    "r_link" : "http://gbdashboards.glassbeam.com/IBMInternal_dev/rdPage.aspx?rdReport=License.License_Violation",
                    "height" : 900
                }]
            }]
        });
        var $scope = $rootScope.$new();
        var ctrl = $controller('DashboardsCtrl', {
            '$scope' : $scope
        });
        $httpBackend.flush();
        expect(ctrl.dashboardType).toEqual('other');
    }));*/

});

describe('SubscribeController : ', function() {
    
    var $modalInstance, manufacturer, product, schema;
    
    beforeEach(module('gbApp.controllers.dashboards', 'gbApp.services.workbench', 'gbApp.services', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('adminEmail', 'support@glassbeam.com');
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
              then: jasmine.createSpy('modalInstance.result.then')
            }
        };

    }));
    
    it('hideModal', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SubscribeController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'schedules': []
        });
        
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
        ctrl.hideModal();
    }));
    
    
    it('subscribe with no data', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        var ctrl = $controller('SubscribeController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'schedules': [{}]
        });
        
        expect(ctrl.subscribe).toEqual(jasmine.any(Function));
        ctrl.subscribe();
        
        $httpBackend.expect('POST', infoserverDomain + '/tableau/subscription/create/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId()).respond("<tsResponse></tsResponse>");
        
        $httpBackend.flush();
    }));
    
    it('subscribe with data', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        spyOn(WorkbenchService, "getSubscriptionsList").and.returnValue([]);
        var $scope = $rootScope.$new();
        var ctrl = $controller('SubscribeController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'schedules': [{}]
        });
        
        expect(ctrl.subscribe).toEqual(jasmine.any(Function));
        ctrl.subscribe();
        
        $httpBackend.expect('POST', infoserverDomain + '/tableau/subscription/create/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId()).respond("<tsResponse><subscription></subscription></tsResponse>");
        
        $httpBackend.flush();
    }));
    
    it('subscribe with error block', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        var ctrl = $controller('SubscribeController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {views: []},
            'schedules': [{}]
        });
        
        expect(ctrl.subscribe).toEqual(jasmine.any(Function));
        ctrl.subscribe();
        
        $httpBackend.expect('POST', infoserverDomain + '/tableau/subscription/create/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId()).respond(500);
        
        $httpBackend.flush();
    }));
    
});

describe('UpdateSubscriptionController : ', function() {
    
    var $modalInstance, manufacturer, product, schema;
    
    beforeEach(module('gbApp.controllers.dashboards', 'gbApp.services.workbench', 'gbApp.services', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('adminEmail', 'support@glassbeam.com');
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
              then: jasmine.createSpy('modalInstance.result.then')
            }
        };

    }));
    
    it('hideModal', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateSubscriptionController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'schedules': [],
            'subscription': {}
        });
        
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
    }));
    
    it('updateSubscription with no data', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateSubscriptionController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'schedules': [{_id: 1}, {_id: 'id'}],
            'subscription': [{
                _id: 'subId',
                schedule: {
                    _id: 'id'
                }
            }]
        });
        
        expect(ctrl.updateSubscription).toEqual(jasmine.any(Function));
        ctrl.updateSubscription();
        
        $httpBackend.expect('POST', infoserverDomain + '/tableau/subscription/update/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId() + '/' + 'subId').respond("<tsResponse></tsResponse>");
        
        $httpBackend.flush();
    }));
    
    it('updateSubscription with data', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        spyOn(WorkbenchService, "getSubscriptionsList").and.returnValue([{_id: 'unit'}, {_id: 'subId'}]);
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateSubscriptionController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'schedules': [{_id: 1}, {_id: 'id'}],
            'subscription': [{
                _id: 'subId',
                schedule: {
                    _id: 'id'
                }
            }]
        });
        
        expect(ctrl.updateSubscription).toEqual(jasmine.any(Function));
        ctrl.updateSubscription();
        
        $httpBackend.expect('POST', infoserverDomain + '/tableau/subscription/update/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId() + '/' + 'subId').respond("<tsResponse><subscription></subscription></tsResponse>");
        
        $httpBackend.flush();
    }));
    
    it('updateSubscription with error block', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateSubscriptionController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'schedules': [{_id: 1}, {_id: 'id'}],
            'subscription': [{
                _id: 'subId',
                schedule: {
                    _id: 'id'
                }
            }]
        });
        
        expect(ctrl.updateSubscription).toEqual(jasmine.any(Function));
        ctrl.updateSubscription();
        
        $httpBackend.expect('POST', infoserverDomain + '/tableau/subscription/update/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId() + '/' + 'subId').respond(500);
        
        $httpBackend.flush();
    }));
    
});

describe('UnsubscribeController : ', function() {
    
    var $modalInstance, manufacturer, product, schema;
    
    beforeEach(module('gbApp.controllers.dashboards', 'gbApp.services.workbench', 'gbApp.services', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('adminEmail', 'support@glassbeam.com');
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
              then: jasmine.createSpy('modalInstance.result.then')
            }
        };

    }));
    
    it('hideModal', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('UnsubscribeController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'subscription': {}
        });
        
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
    }));
    
    it('unsubsribe with no data', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        var ctrl = $controller('UnsubscribeController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'subscription': [{
                _id: 'subId'
            }]
        });
        
        expect(ctrl.unsubscribe).toEqual(jasmine.any(Function));
        ctrl.unsubscribe();
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscription/delete/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId() + '/' + 'subId').respond("<tsResponse></tsResponse>");
        
        $httpBackend.flush();
    }));
    
    it('unsubsribe with data', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        spyOn(WorkbenchService, "getSubscriptionsList").and.returnValue([{_id: 'unit'}, {_id: 'subId'}]);
        var $scope = $rootScope.$new();
        var ctrl = $controller('UnsubscribeController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'subscription': [{
                _id: 'subId'
            }]
        });
        
        expect(ctrl.unsubscribe).toEqual(jasmine.any(Function));
        ctrl.unsubscribe();
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscription/delete/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId() + '/' + 'subId').respond("");
        
        $httpBackend.flush();
    }));
    
    it('unsubsribe with error block', inject(function($rootScope, $controller, $httpBackend, ModalService, WorkbenchService, infoserverDomain) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        var ctrl = $controller('UnsubscribeController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'content': {},
            'subscription': [{
                _id: 'subId'
            }]
        });
        
        expect(ctrl.unsubscribe).toEqual(jasmine.any(Function));
        ctrl.unsubscribe();
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscription/delete/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + WorkbenchService.getTableauUser() + '/' + WorkbenchService.getUserId() + '/' + 'subId').respond(500);
        
        $httpBackend.flush();
    }));
    
});

describe('AddTagController : ', function() {
    
    var $modalInstance, manufacturer, product, schema;
    
    beforeEach(module('gbApp','gbApp.controllers.dashboards', 'gbApp.services.workbench', 'gbApp.services', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('adminEmail', 'support@glassbeam.com');
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
              then: jasmine.createSpy('modalInstance.result.then')
            }
        };

    }));

    it('addTagRow', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('AddTagController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.addTagRow).toEqual(jasmine.any(Function));
        expect(ctrl.tagList).toEqual([{tagName: ""}]);
        ctrl.addTagRow();
        expect(ctrl.tagList).toEqual([{tagName: ""}, {tagName: ""}]);
    }));
    
    it('hideModal', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('AddTagController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
        ctrl.hideModal();
    }));
    
    it('addTagToWorkbook', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AddTagController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.addTagToWorkbook).toEqual(jasmine.any(Function));
        
        ctrl.tagList = [{tagName: ''}, {tagName: ''}];
        
        ctrl.addTagToWorkbook();
    }));
    
    /*it('addTagToWorkbook API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AddTagController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.addTagToWorkbook).toEqual(jasmine.any(Function));
        
        ctrl.tagList = [{tagName: 'tag1'}, {tagName: ''}];
        
        ctrl.addTagToWorkbook();
        
        $httpBackend.expect('PUT', infoserverDomain + '/tableau/workbook/tags/add/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined + '?tag=tag1').respond({});
        
        $httpBackend.flush();
    }));
    
    it('addTagToWorkbook API call error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AddTagController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.addTagToWorkbook).toEqual(jasmine.any(Function));
        
        ctrl.tagList = [{tagName: 'tag1'}, {tagName: ''}];
        
        ctrl.addTagToWorkbook();
        
        $httpBackend.expect('PUT', infoserverDomain + '/tableau/workbook/tags/add/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined + '?tag=tag1').respond(500, {});
        
        $httpBackend.flush();
    }));
    
    it('addTagToWorkbook API call error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService, ModalService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AddTagController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.addTagToWorkbook).toEqual(jasmine.any(Function));
        
        ctrl.tagList = [{tagName: 'tag1'}, {tagName: ''}];
        
        ctrl.addTagToWorkbook();
        
        $httpBackend.expect('PUT', infoserverDomain + '/tableau/workbook/tags/add/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined + '?tag=tag1').respond(500, {Msg: 'timeout'});
        
        $httpBackend.flush();
    }));*/
});

describe('UpdateWorkbookController : ', function() {
    
    var $modalInstance, manufacturer, product, schema;
    
    beforeEach(module('gbApp','gbApp.controllers.dashboards', 'gbApp.services.workbench', 'gbApp.services', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('adminEmail', 'support@glassbeam.com');
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
              then: jasmine.createSpy('modalInstance.result.then')
            }
        };

    }));
    
    it('hideModal', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
        ctrl.hideModal();
    }));
    
    it('getUsers', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/users/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="4" pageSize="100" pageNumber="1"/><users></users></tsResponse>');
        
        $httpBackend.flush();
    }));
    
    it('getUsers with current user', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(metaDataService, "getUser").and.returnValue({wb_user_name: 'ritesh.dobhal@glassbeam.com'});
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/users/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="4" pageSize="100" pageNumber="1"/><users><user externalAuthUserId="" lastLogin="2016-06-27T07:34:27Z" siteRole="ServerAdministrator" name="administrator" id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><user externalAuthUserId="" lastLogin="2016-06-27T07:38:33Z" siteRole="SiteAdministrator" name="ritesh.dobhal@glassbeam.com" id="97e1bc6f-9140-4e78-b58a-63483cc71a73"/></users></tsResponse>');
        
        $httpBackend.flush();
    }));
    
    it('getUsers with multiple users', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(metaDataService, "getUser").and.returnValue({wb_user_name: 'ritesh.dobhal@glassbeam.com'});
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/users/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="4" pageSize="100" pageNumber="1"/><users><user externalAuthUserId="" lastLogin="2016-06-27T07:34:27Z" siteRole="ServerAdministrator" name="administrator" id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><user externalAuthUserId="" lastLogin="2016-06-27T07:38:33Z" siteRole="SiteAdministrator" name="ritesh.dobhal@glassbeam.com" id="97e1bc6f-9140-4e78-b58a-63483cc71a73"/><user externalAuthUserId="" siteRole="SiteAdministrator" name="ashwin.mridul@glassbeam.com" id="befee25f-711f-4edc-91ad-9c4f954a3ce6"/></users></tsResponse>');
        
        $httpBackend.flush();
    }));
    
    it('getUsers error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/users/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond(500, {});
        
        $httpBackend.flush();
    }));
    
    it('getUsers error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {tabs: 'true'}
        });
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/users/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond(500, {Msg: 'timeout'});
        
        $httpBackend.flush();
    }));
    
    it('updateWorkbook', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.updateWorkbook).toEqual(jasmine.any(Function));
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/users/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond(500, {});
        $httpBackend.flush();
        
        ctrl.info.changeOwner = true;
        ctrl.info.changedOwner = {
            _id: 'user1'
        };
        
        ctrl.updateWorkbook();
        $httpBackend.expect('PUT', infoserverDomain + '/tableau/workbook/update/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined + '/' + false + '?new_owner_id=user1').respond({});   
        $httpBackend.flush();
    }));
    
    it('updateWorkbook error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('UpdateWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.updateWorkbook).toEqual(jasmine.any(Function));
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/users/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond(500, {});
        $httpBackend.flush();
        
        ctrl.info.changeOwner = false;
        
        ctrl.updateWorkbook();
        $httpBackend.expect('PUT', infoserverDomain + '/tableau/workbook/update/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined + '/' + false).respond(500, {});   
        $httpBackend.flush();
    }));
    
});

describe('DeleteWorkbookController : ', function() {
    
    var $modalInstance, manufacturer, product, schema;
    
    beforeEach(module('gbApp','gbApp.controllers.dashboards', 'gbApp.services.workbench', 'gbApp.services', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('adminEmail', 'support@glassbeam.com');
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
              then: jasmine.createSpy('modalInstance.result.then')
            }
        };

    }));
    
    it('hideModal', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
        ctrl.hideModal();
    }));
    
    it('renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.renderHtml).toEqual(jasmine.any(Function));
        spyOn($sce, "trustAsHtml");
        ctrl.renderHtml('http://www.glassbeam.com/');
        expect($sce.trustAsHtml).toHaveBeenCalledWith('http://www.glassbeam.com/');
    }));
    
    it('deleteWorkbook', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.deleteWorkbook).toEqual(jasmine.any(Function));
        
        ctrl.deleteWorkbook();
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbook/delete/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined).respond({});   
        $httpBackend.flush();
    }));
    
    it('deleteWorkbook error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.deleteWorkbook).toEqual(jasmine.any(Function));
        
        ctrl.deleteWorkbook();
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbook/delete/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined).respond(500, {});   
        $httpBackend.flush();
    }));
    
    it('deleteWorkbook error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, WorkbenchService, metaDataService, ModalService) {
        spyOn(WorkbenchService, "updateWorkbooks");
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteWorkbookController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'workbook': {}
        });
        
        expect(ctrl.deleteWorkbook).toEqual(jasmine.any(Function));
        
        ctrl.deleteWorkbook();
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbook/delete/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + undefined).respond(500, {Msg: 'timeout'});   
        $httpBackend.flush();
    }));
    
});

describe('LogiCtrl : ', function() {
	beforeEach(module('gbApp','gbApp.controllers.dashboards', 'gbApp.services.dashboards', 'gbApp.services.explorer', 'gbApp.services', 'ngCookies', function($provide) {
		$provide.value('infoserverDomain', 'http://qasearch.glassbeam.com');
		$provide.value('manufacturer', undefined);
		$provide.value('product', undefined);
		$provide.value('schema', undefined);
		$provide.value('adminEmail', 'support@glassbeam.com');

	}));

	it('sceURL', inject(function($rootScope, $controller, $sce) {
		var $scope = $rootScope.$new();
		$controller('LogiCtrl', {

			'$scope' : $scope
		});
		expect($scope.sceURL).toEqual(jasmine.any(Function));
		spyOn($sce, "trustAsResourceUrl");
		$scope.sceURL('http://www.glassbeam.com/');
		expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('http://www.glassbeam.com/');
	}));
});

describe('HealthCheckDashboardsCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp','gbApp.controllers.dashboards', 'gbApp.services.dashboards', 'gbApp.services.explorer', 'gbApp.services', 'gbApp.services.workbench', 'ngCookies', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('scope variables should be defined ', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.info).toEqual(jasmine.any(Object));
		expect(ctrl.health_check_dashboards).toEqual(jasmine.any(Array));
		expect(ctrl.endcustomers).toEqual(jasmine.any(Array));
		expect(ctrl.info.complete).not.toBe(false);
	}));

	it('should have hideLoadingMsg', inject(function($rootScope, $controller,$timeout,$httpBackend) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.hideLoadingMsg).toEqual(jasmine.any(Function));
		ctrl.hideLoadingMsg();
	}));

	it('should have showLoadingMsg', inject(function($rootScope, $controller,$timeout,$httpBackend) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.showLoadingMsg).toEqual(jasmine.any(Function));
		ctrl.showLoadingMsg();
	}));

	it('should have setCustomerName', inject(function($rootScope, $controller,$timeout,$httpBackend) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.setCustomerName).toEqual(jasmine.any(Function));
		ctrl.setCustomerName();
	}));
	
	it('sceURL', inject(function($rootScope, $controller, $sce) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.sceURL).toEqual(jasmine.any(Function));
		spyOn($sce, "trustAsResourceUrl");
		ctrl.sceURL('http://www.glassbeam.com/');
		expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('http://www.glassbeam.com/');
	}));	

	it('sceHTML', inject(function($rootScope, $controller, $sce) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.sceHTML).toEqual(jasmine.any(Function));
		spyOn($sce, "trustAsHtml");
		ctrl.sceHTML('<a href="#">Link</a>');
		expect($sce.trustAsHtml).toHaveBeenCalledWith('<a href="#">Link</a>');
	}));	

	it('should have showEndCustomerList', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		ctrl.showEndCustomerList();
		ctrl.info.internalLogin = true;
		ctrl.endcustomers = [{},{}];
		ctrl.health_check_dashboards = [{}];
		expect(ctrl.showEndCustomerList).toEqual(jasmine.any(Function));
		ctrl.showEndCustomerList();
		ctrl.health_check_dashboards = [];
		ctrl.showEndCustomerList();
	}));

	it('should have showDashboardList', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		ctrl.health_check_dashboards = [{},{}];
		expect(ctrl.showDashboardList).toEqual(jasmine.any(Function));
		ctrl.showDashboardList();
		ctrl.health_check_dashboards = [{}];
		ctrl.endcustomers = [{},{}];
		ctrl.showDashboardList();
	}));

	it('should have showSingleDashboard', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		ctrl.endcustomers = [{}];
		ctrl.health_check_dashboards = [{}];
		expect(ctrl.showSingleDashboard).toEqual(jasmine.any(Function));
		ctrl.showSingleDashboard();
		ctrl.endcustomers = [];
		ctrl.health_check_dashboards = [];
		ctrl.showSingleDashboard();
	}));

	it('$watch ctrl.info.complete', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.info.complete = false;
        $httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond(500, {"Status":"Success","Msg":"System timeout","Data":[{"ec_name":"glass","sys_ids":["00:0C:29:B3:01:F8","00:0C:29:9E:F5:12","00:0C:29:21:24:D2"]}]});
        $scope.$digest();
        
        ctrl.info.complete = true;
        $scope.$digest();
    }));
    
    it('receive AppLoadEvent-healthcheck', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
        ctrl.info.complete = false;
        $rootScope.$broadcast('AppLoadEvent-healthcheck');
        ctrl.info.complete = true;
        $rootScope.$broadcast('AppLoadEvent-healthcheck');
    }));

	it('show category should be defined', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.info.show_category).toEqual(GlobalService.getVal('show_category'));

	}));

	it('should set the flag to true if authentication is passed', inject(function($rootScope, $controller, ErrorService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ErrorService.getErrors('gbApp')).toBeTruthy();
		expect(ctrl.info.complete).toBe(true);
	}));

	it('should be an external user', inject(function($rootScope, $controller, $cookies) {
		var $scope = $rootScope.$new();
		$controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect($cookies.internal_user).toBeFalsy();
	}));

	it('should load without errors', inject(function($rootScope, $controller, Dashboards, ErrorService) {
		console.info(Dashboards);
		spyOn(Dashboards, "getEndCustomers").and.callThrough();
		spyOn(ErrorService, "getErrors").and.returnValue(false);
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});

		expect(Dashboards.getEndCustomers).not.toHaveBeenCalled();
	}));
	
	it('should call getEndCustomer()', inject(function($rootScope, $controller, Dashboards) {
        console.info(Dashboards);
        spyOn(Dashboards, "getEndCustomers").and.callThrough();
        var $scope = $rootScope.$new();
        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });

        expect(Dashboards.getEndCustomers).not.toHaveBeenCalled();
    }));

	it('should call add Instance', inject(function($rootScope, $controller, $cookies, InstanceHandler, $httpBackend) {

		spyOn(InstanceHandler, "addInstance");
		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.addInstance).toEqual(jasmine.any(Function));
		expect(ctrl.info.selectedItem).toBeFalsy();
		expect($cookies.internal_login).toBeFalsy();
		$cookies.internal_login = true;
		var report = {
			'rname' : 'report',
			'r_link': ''
		};
		ctrl.addInstance(report);
		expect(InstanceHandler.addInstance).toHaveBeenCalledWith({
			'type' : 'dashboard',
			'healthCheck' : true,
			'name' : report.rname,
			'data' : {
				'report' : report
			}
		}, $scope);
		ctrl.info.selectedItem = false;
		$cookies.internal_login = false;
		ctrl.addInstance(report);
		
		ctrl.info.selectedItem = "test";
		report = {
		    'rname' : 'report',
            'r_link': 'abcd?ac=1&bc=2'
		};
		ctrl.addInstance(report);
	}));

	it('should call dashboard all details', inject(function(infoserverDomain, $rootScope, $timeout, $controller, Dashboards, $httpBackend, UserTrackingService, ErrorService, GlobalService, ModalService) {
		// to test for success response when data is found
		$httpBackend.expect("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			"Data" : [{
				"dname" : "Summary Report",
				"ddesc" : "NA",
				"d_id" : "d349987b-db89-4393-bacd-98f0a4898f59",
				"d_type" : "External",
				"d_link" : "NA",
				"reports" : [{
					"rname" : "Summary Report",
					"rdesc" : "Summary Report",
					"r_id" : "f6c9987b-db89-4893-bacd-98f0a4d98f59",
					"r_link" : "https://dashboards.glassbeam.com/vce/rdPage.aspx?rdReport=Summary_Report.Summary_Report",
					"height" : 530
				}]
			}]
		});
		$httpBackend.expect("GET", infoserverDomain + '/healthcheck/ec/details/' + manufacturer + '/' + product + '/' + schema).respond({Data: [1, 2, 3]});
		
		var $scope = $rootScope.$new();

		var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });

		spyOn(ctrl, "logActivity");
		
		expect(ctrl.r_link).toBeFalsy();
		expect(ctrl.r_name).toBeFalsy();
		expect(ctrl.d_name).toBeFalsy();
		$httpBackend.flush();
		$timeout.flush(5000);
		expect(ctrl.health_check_dashboards.length).toEqual(1);
		// expect(ctrl.r_link).not.toBeFalsy();
		// expect(ctrl.r_name).not.toBeFalsy();
		// expect(ctrl.d_name).not.toBeFalsy();
		// expect(ctrl.logActivity).toHaveBeenCalled();
	}));
	
	/*it('should call dashboard all details with no dashboards', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ErrorService, GlobalService) {
	    // to handle httpBackned for previous http calls
        $httpBackend.when("GET", "/gb/ui/prod/get_end_customer.cgi").respond([1]);
        
	    // to test for success response when data is not found
        $httpBackend.expect("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
            "Data" : [{
                "dname" : "Summary Report",
                "ddesc" : "NA",
                "d_id" : "d349987b-db89-4393-bacd-98f0a4898f59",
                "d_type" : "Internal",
                "d_link" : "NA",
                "reports" : [{
                    "rname" : "Summary Report",
                    "rdesc" : "Summary Report",
                    "r_id" : "f6c9987b-db89-4893-bacd-98f0a4d98f59",
                    "r_link" : "https://dashboards.glassbeam.com/vce/rdPage.aspx?rdReport=Summary_Report.Summary_Report",
                    "height" : 530
                }]
            }]
        });
        $httpBackend.expect("GET", infoserverDomain + '/healthcheck/ec/details/' + manufacturer + '/' + product + '/' + schema).respond({Data: [1, 2, 3]});
        var $scope = $rootScope.$new();
        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope

        });
        spyOn(ErrorService, "setError");
        
        $httpBackend.flush();
        expect(ctrl.health_check_dashboards.length).toEqual(0);
        expect(ctrl.info.complete).toBe(true);
        expect(ErrorService.setError).toHaveBeenCalledWith('health_check_dashboards', GlobalService.getVal('no_dashboard'));
	}));
	
	it('should call dashboard all details error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ErrorService, GlobalService) {
        var $scope = $rootScope.$new();

        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope

        });
        spyOn(ErrorService, "setError");
        // to test for success response when data is found
        $httpBackend.expect("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond(500, {
            "Status" : "Success",
            "Msg" : "",
            "Data" : ""
        });
        $httpBackend.flush();
        expect(ErrorService.setError).toHaveBeenCalledWith('health_check_dashboards', GlobalService.getVal('no_dashboard'));
    }));*/
    
    it('should call dashboard all details error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ErrorService, GlobalService, ModalService) {
        // to handle httpBackned for previous http calls
        $httpBackend.when("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond(500, {
            'Status' : 'Failure',
            'Msg' : 'Session timeout',
            'Data' : []
        });
        
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope

        });
        $httpBackend.flush();
        expect(ctrl.health_check_dashboards.length).toEqual(0);
        expect(ModalService.sessionTimeout).toHaveBeenCalled();
    }));

	/*it('Log activity', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {

		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
		expect(ctrl.logActivity).toEqual(jasmine.any(Function));
		$httpBackend.expect("GET", infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' + product + '/' + schema).respond({
			"Data" : [{
				"dname" : "Summary Report",
				"ddesc" : "NA",
				"d_id" : "d349987b-db89-4393-bacd-98f0a4898f59",
				"d_type" : "External",
				"d_link" : "NA",
				"reports" : [{
					"rname" : "Summary Report",
					"rdesc" : "Summary Report",
					"r_id" : "f6c9987b-db89-4893-bacd-98f0a4d98f59",
					"r_link" : "https://dashboards.glassbeam.com/vce/rdPage.aspx?rdReport=Summary_Report.Summary_Report",
					"height" : 530
				}]
			}]
		});
		
		$httpBackend.expect("POST", umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Health Check/module/activity", {
			"details" : "details",
			"solr_query": ""
		}).respond({
			"Status" : "Success",
			"Msg" : "",
			"Data" : ""
		});
		
		$httpBackend.expect("GET", infoserverDomain + '/healthcheck/ec/details/' + manufacturer + '/' + product + '/' + schema).respond({Data: [1, 2, 3]});
		ctrl.logActivity('module', 'activity', 'details');
		
		$httpBackend.flush();
	}));*/

	it('Search text', inject(function($rootScope, $controller, $httpBackend) {

		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
		expect(ctrl.search).toEqual(jasmine.any(Function));
		expect(ctrl.search()).toEqual(jasmine.any(Object));
		ctrl.info.query = "Hello";
		expect(ctrl.search()).toEqual({
			'rdesc' : ctrl.info.query
		});

	}));

	/*it('Set cookie', inject(function($rootScope, $controller, $httpBackend, InstanceHandler) {

		var $scope = $rootScope.$new();
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
		expect(ctrl.setCookie).toEqual(jasmine.any(Function));
		ctrl.setCookie();
		spyOn(InstanceHandler, "getInstances").and.returnValue([{healthCheck: true}, {}]);
		ctrl.setCookie();
		ctrl.info.selectedItem = "";
		ctrl.setCookie();
	}));
*/
	it('toggleDashboard', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new(),
		    dashboard = {

			expand : true
		};
		var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
		spyOn(GlobalService, "getVal");
		expect(ctrl.toggleDashboard).toEqual(jasmine.any(Function));
		expect(dashboard.expand).toBeTruthy();
		ctrl.toggleDashboard(dashboard);
		expect(dashboard.expand).toBeFalsy();
		ctrl.toggleDashboard(dashboard);
		expect(dashboard.expand).toBeTruthy();
		ctrl.info.query = true;
		ctrl.toggleDashboard(dashboard);
	}));

	it('filterResult', inject(function($rootScope, $controller, $httpBackend) {
		var $scope = $rootScope.$new();
        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
		expect(ctrl.filterResult).toEqual(jasmine.any(Function));
		expect(ctrl.filterResult()).toBeTruthy();
		ctrl.health_check_dashboards = {
			unit1 : {
				f_reports : 'unit1'
			},
			unit2 : {
				f_reports : null
			}
		};
		expect(ctrl.filterResult()).toBeFalsy();
		ctrl.info.complete = false;
		expect(ctrl.filterResult()).toBeFalsy();
	}));

	it('getMessage', inject(function($rootScope, $controller, GlobalService, Dashboards, ErrorService, $httpBackend) {
		var $scope = $rootScope.$new();
        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
		expect(ctrl.getMessage).toEqual(jasmine.any(Function));
		expect(ctrl.getMessage()).toEqual(GlobalService.getVal('filter_fail'));
	}));

	it('render html', inject(function($rootScope, $controller, $sce) {

		var $scope = $rootScope.$new();
        var ctrl = $controller('HealthCheckDashboardsCtrl', {
            '$scope' : $scope
        });
		expect(ctrl.renderHtml).toEqual(jasmine.any(Function));
		spyOn($sce, "trustAsHtml");
		ctrl.renderHtml('http://www.glassbeam.com/');
		expect($sce.trustAsHtml).toHaveBeenCalledWith('http://www.glassbeam.com/');
	}));

});
