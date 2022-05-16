'use strict';

/* jasmine specs for log vault controllers go here */

describe('WorkbenchCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;

	beforeEach(module('gbApp.controllers.dashboards', 'gbApp.services.dashboards', 'gbApp.controllers.workbench', 'gbApp.services.workbench', 'gbApp.services.explorer', 'gbApp.services', 'gbApp.globals', 'xml', 'ngCookies', 'ngTable', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
        
        
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
	
	it('Should receive AppLoadEvent-workbench', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('WorkbenchCtrl', {
            '$scope' : $scope
        });
        $scope.info.pageLoading = false;
        $rootScope.$broadcast('AppLoadEvent-workbench');
    }));
	
	it('Should have appName', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('appName')).toBeTruthy();
		expect($scope.appName).toEqual('Workbench');
	}));
	
	it('Should have info.reverse', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('info')).toBeTruthy();
		expect($scope.info).toEqual(jasmine.any(Object));
		expect($scope.info.reverse).toBeFalsy();
	}));
	
	it('Should have sources', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('sources')).toBeTruthy();
		expect($scope.sources).toEqual(jasmine.any(Array));
	}));
	
	it('Should have info.page', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('page')).toBeTruthy();
		expect($scope.info.page).toEqual(jasmine.any(Object));
		expect($scope.info.page).toEqual({
			"total" : 0,
			"current" : 0,
			"pages" : 0,
			"count" : 20
		});
	}));
	
	it('Should have getValue', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('getValue')).toBeTruthy();
		expect($scope.getValue).toEqual(jasmine.any(Function));
		expect($scope.getValue('datasource_length')).toEqual(50);
	}));
	
	/*xit('Should have init', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, metaDataService, x2js) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope': $scope
		});
		$httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond({Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/datasources/list/' + manufacturer + '/' + product + '/' + schema + '/' + 'site_id' + '/' + metaDataService.getUser()['wb_user_name'] + '/' + 'user_id').respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="1" pageSize="100" pageNumber="1"/><datasources><datasource type="postgres" name="aaa_aaastate_mr (aruba_aruba_pod_dashboards.aaa_aaastate_mr) (glassbeam)" id="b3d282fe-9b27-4e9c-b5fb-fa0955cd4c32"><project name="Default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><tags></tags></datasource></datasources></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/schedules/list/' + manufacturer + '/' + product + '/' + schema).respond('<tsResponse><schedules/></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscriptions/list/' + manufacturer + '/' + product + '/' + schema + '/site_id/undefined/user_id').respond('<tsResponse><subscriptions/></tsResponse>');
        $httpBackend.flush();
	}));
	
	xit('Should have init with site and user id', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, metaDataService, x2js) {
        var $scope = $rootScope.$new();
        $controller('WorkbenchCtrl', {
            '$scope': $scope
        });
        $httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond({Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/datasources/list/' + manufacturer + '/' + product + '/' + schema + '/' + 'site_id' + '/' + metaDataService.getUser()['wb_user_name'] + '/' + 'user_id').respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="1" pageSize="100" pageNumber="1"/><datasources><datasource type="postgres" name="aaa_aaastate_mr (aruba_aruba_pod_dashboards.aaa_aaastate_mr) (glassbeam)" id="b3d282fe-9b27-4e9c-b5fb-fa0955cd4c32"><project name="Default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><tags></tags></datasource></datasources></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/schedules/list/' + manufacturer + '/' + product + '/' + schema).respond('<tsResponse><schedules/></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscriptions/list/' + manufacturer + '/' + product + '/' + schema + '/site_id/undefined/user_id').respond('<tsResponse><subscriptions/></tsResponse>');
        $httpBackend.flush();
        $scope.init();
    }));
	
	xit('Should have init multiple datasources', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, metaDataService, x2js) {
        var $scope = $rootScope.$new();
        $controller('WorkbenchCtrl', {
            '$scope': $scope
        });
        $httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond({Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/datasources/list/' + manufacturer + '/' + product + '/' + schema + '/' + 'site_id' + '/' + metaDataService.getUser()['wb_user_name'] + '/' + 'user_id').respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="1" pageSize="100" pageNumber="1"/><datasources><datasource type="postgres" name="aaa_aaastate_mr (aruba_aruba_pod_dashboards.aaa_aaastate_mr) (glassbeam)" id="b3d282fe-9b27-4e9c-b5fb-fa0955cd4c32"><project name="Default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><tags></tags></datasource><datasource type="postgres" name="aaa_aaastate_mr (aruba_aruba_pod_dashboards.aaa_aaastate_mr) (glassbeam)" id="b3d282fe-9b27-4e9c-b5fb-fa0955cd4c32"><project name="Default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><tags></tags></datasource></datasources></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/schedules/list/' + manufacturer + '/' + product + '/' + schema).respond('<tsResponse><schedules/></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscriptions/list/' + manufacturer + '/' + product + '/' + schema + '/site_id/undefined/user_id').respond('<tsResponse><subscriptions/></tsResponse>');
        $httpBackend.flush();
    }));*/
    
    it('Should have init error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService, metaDataService, x2js) {
        var $scope = $rootScope.$new();
        spyOn(ModalService, "sessionTimeout");
        $controller('WorkbenchCtrl', {
            '$scope': $scope
        });
        $httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));
	
	/*xit('Should have goToEditMode', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, metaDataService) {
	    
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('goToEditMode')).toBeTruthy();
		expect($scope.goToEditMode).toEqual(jasmine.any(Function));
		var datasource = 'Apache Version';
		$scope.viz = {
			dispose: function() {
				
			}
		};
		spyOn(tableau, "Viz");
		
		$httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond({Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/trusted/ticket/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name']).respond({Data: "abjbsjdhjsd"});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/datasources/list/' + manufacturer + '/' + product + '/' + schema + '/' + 'site_id' + '/' + metaDataService.getUser()['wb_user_name'] + '/' + 'user_id').respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="1" pageSize="100" pageNumber="1"/><datasources><datasource type="postgres" name="aaa_aaastate_mr (aruba_aruba_pod_dashboards.aaa_aaastate_mr) (glassbeam)" id="b3d282fe-9b27-4e9c-b5fb-fa0955cd4c32"><project name="Default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><tags></tags></datasource></datasources></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/schedules/list/' + manufacturer + '/' + product + '/' + schema).respond('<tsResponse><schedules/></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscriptions/list/' + manufacturer + '/' + product + '/' + schema + '/site_id/undefined/user_id').respond('<tsResponse><subscriptions/></tsResponse>');
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Workbench/Workbench/Create report').respond(200);
        
		$scope.goToEditMode(datasource);
		$httpBackend.flush();
	}));
	
	xit('Should have goToEditMode with non configured infoserver machine', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService, metaDataService) {
        var $scope = $rootScope.$new();
        $controller('WorkbenchCtrl', {
            '$scope' : $scope
        });
        expect($scope.hasOwnProperty('goToEditMode')).toBeTruthy();
        expect($scope.goToEditMode).toEqual(jasmine.any(Function));
        var datasource = 'Apache Version';
        $scope.viz = {
            dispose: function() {
                
            }
        };
        spyOn(tableau, "Viz");
        spyOn(ModalService, "alertBox");
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond({Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/trusted/ticket/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name']).respond({Data: "-1"});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/datasources/list/' + manufacturer + '/' + product + '/' + schema + '/' + 'site_id' + '/' + metaDataService.getUser()['wb_user_name'] + '/' + 'user_id').respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="1" pageSize="100" pageNumber="1"/><datasources><datasource type="postgres" name="aaa_aaastate_mr (aruba_aruba_pod_dashboards.aaa_aaastate_mr) (glassbeam)" id="b3d282fe-9b27-4e9c-b5fb-fa0955cd4c32"><project name="Default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><tags></tags></datasource></datasources></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/schedules/list/' + manufacturer + '/' + product + '/' + schema).respond('<tsResponse><schedules/></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscriptions/list/' + manufacturer + '/' + product + '/' + schema + '/site_id/undefined/user_id').respond('<tsResponse><subscriptions/></tsResponse>');
        
        $scope.goToEditMode(datasource);
        $httpBackend.flush();
    }));
    
    xit('Should have goToEditMode error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService, metaDataService) {
        var $scope = $rootScope.$new();
        $controller('WorkbenchCtrl', {
            '$scope' : $scope
        });
        expect($scope.hasOwnProperty('goToEditMode')).toBeTruthy();
        expect($scope.goToEditMode).toEqual(jasmine.any(Function));
        var datasource = 'Apache Version';
        $scope.viz = {
            dispose: function() {
                
            }
        };
        spyOn(tableau, "Viz");
        spyOn(ModalService, "alertBox");
        
        $httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond({Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/trusted/ticket/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name']).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/datasources/list/' + manufacturer + '/' + product + '/' + schema + '/' + 'site_id' + '/' + metaDataService.getUser()['wb_user_name'] + '/' + 'user_id').respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="1" pageSize="100" pageNumber="1"/><datasources><datasource type="postgres" name="aaa_aaastate_mr (aruba_aruba_pod_dashboards.aaa_aaastate_mr) (glassbeam)" id="b3d282fe-9b27-4e9c-b5fb-fa0955cd4c32"><project name="Default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="c3903d07-9999-4ad9-a509-1d7553438b8d"/><tags></tags></datasource></datasources></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/schedules/list/' + manufacturer + '/' + product + '/' + schema).respond('<tsResponse><schedules/></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscriptions/list/' + manufacturer + '/' + product + '/' + schema + '/site_id/undefined/user_id').respond('<tsResponse><subscriptions/></tsResponse>');
        
        $scope.goToEditMode(datasource);
        $httpBackend.flush();
    }));*/
    
	it('Should have showDatasources', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('showDatasources')).toBeTruthy();
		expect($scope.showDatasources).toEqual(jasmine.any(Function));
		$scope.showDatasources();
		expect($scope.datasourcesShown).toBeTruthy();
		expect($scope.backLink).toEqual("");
	}));
	
	it('Should have hideDatasources', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('hideDatasources')).toBeTruthy();
		expect($scope.hideDatasources).toEqual(jasmine.any(Function));
		$scope.hideDatasources();
		expect($scope.datasourcesShown).toBeFalsy();
	}));
	
	it('Should have toggleSort', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('toggleSort')).toBeTruthy();
		expect($scope.toggleSort).toEqual(jasmine.any(Function));
		$scope.info.reverse = true;
		$scope.toggleSort();
		expect($scope.info.reverse).toBeFalsy();
	}));
	
	it('Should have paginator', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('paginator')).toBeTruthy();
		expect($scope.paginator).toEqual(jasmine.any(Function));
		var count = new Number();
		$scope.paginator(count);
		expect($scope.info.page['total']).toEqual(count);
		expect($scope.info.page['pages']).toEqual(Math.ceil($scope.info.page['total'] / $scope.info.page['count']));
	}));
	
	it('Should have increaseCount', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('increaseCount')).toBeTruthy();
		expect($scope.increaseCount).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page = {
			count : 10,
			pages : 120,
			total : 1194,
			current : 78
		};
		spyOn($scope, "refresh");
		$scope.increaseCount();
		expect($scope.info.page).toEqual({
			count : 20,
			pages : 60,
			total : 1194,
			current : 59
		});
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.page.current = 6;
		$scope.increaseCount();
		expect($scope.info.page.current).toEqual(6);
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.page = {
			count : 100,
			pages : 11,
			total : 1194,
			current : 4
		};
		$scope.increaseCount();
		expect($scope.info.page).toEqual({
			count : 100,
			pages : 11,
			total : 1194,
			current : 4
		});
	}));
	
	it('Should have decreaseCount', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('decreaseCount')).toBeTruthy();
		expect($scope.decreaseCount).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page = {
			count : 30,
			pages : 60,
			total : 1194,
			current : 59
		};
		spyOn($scope, "refresh");
		$scope.decreaseCount();
		expect($scope.info.page).toEqual({
			count : 20,
			pages : 60,
			total : 1194,
			current : 0
		});
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.page = {
			count : 20,
			pages : 60,
			total : 1194,
			current : 0
		};
		$scope.decreaseCount();
		expect($scope.info.page).toEqual({
			count : 20,
			pages : 60,
			total : 1194,
			current : 0
		});
	}));
	
	it('Should have nextPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('nextPage')).toBeTruthy();
		expect($scope.nextPage).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page = {
			current : 2,
			pages : 20
		};
		spyOn($scope, "refresh");
		$scope.nextPage();
		expect($scope.info.page).toEqual({
			current : 3,
			pages : 20
		});
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.page = {
			current : 19,
			pages : 20
		};
		$scope.nextPage();
		expect($scope.info.page).toEqual({
			current : 19,
			pages : 20
		});
	}));
	
	it('Should have prevPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.prevPage).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page.current = 1;
		spyOn($scope, "refresh");
		$scope.prevPage();
		expect($scope.refresh).toHaveBeenCalled();
		expect($scope.info.page.current).toEqual(0);
		$scope.info.page.current = 0;
		$scope.prevPage();
		expect($scope.info.page.current).toEqual(0);
	}));
	
	it('Should have firstPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.firstPage).toEqual(jasmine.any(Function));
		$scope.info.page.current = 0;
		spyOn($scope, "refresh");
		$scope.firstPage();
		expect($scope.info.page.current).toEqual(0);
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page.current = 7;
		$scope.firstPage();
		expect($scope.info.page.current).toEqual(0);
		expect($scope.refresh).toHaveBeenCalled();
	}));

	it('Should have lastPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.lastPage).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page = {
			current : 3,
			pages : 30
		};
		spyOn($scope, "refresh");
		$scope.lastPage();
		expect($scope.info.page.current).toEqual(29);
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.page.current = 29;
		$scope.lastPage();
		expect($scope.info.page.current).toEqual(29);
	}));
	
	it('Should have refresh', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.refresh).toEqual(jasmine.any(Function));
		$scope.datasources = [];
		$scope.refresh();
		expect($scope.sources).toEqual([]);
		$scope.datasources = null;
		$scope.refresh();
		expect($scope.sources).toEqual([]);
	}));

	it('Should have refresh if block', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.datasources = [{selected : false},{selected : false}];
		$scope.info.unSelectAll = false;
		$scope.info.selectAll = true;
		$scope.refresh();
		var expcSource = [{selected : true},{selected : true}];
		expect($scope.sources).toEqual(expcSource);
	}));

	it('Should have refresh else block', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.datasources = [{selected : true},{selected : true}];
		$scope.info.unSelectAll = true;
		$scope.info.selectAll = false;
		$scope.refresh();
		var expcSource = [{selected : false},{selected : false}];
		expect($scope.sources).toEqual(expcSource);
	}));
	
	it('sceHTML', inject(function($rootScope, $controller, $sce) {
		$rootScope.isFeatureEnable = function() {
		};
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.sceHTML).toEqual(jasmine.any(Function));
		spyOn($sce, "trustAsHtml");
		$scope.sceHTML('<a href="#">Link</a>');
		expect($sce.trustAsHtml).toHaveBeenCalledWith('<a href="#">Link</a>');
	}));
	
	it('Should have toggleSelectAll called with all', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.toggleSelectAll).toEqual(jasmine.any(Function));
		$scope.info.selectAll = true;		
		$scope.toggleSelectAll("all");
		expect($scope.info.unSelectAll).toEqual(true);
		$scope.info.selectAll = false;		
		$scope.toggleSelectAll("all");
		expect($scope.info.unSelectAll).toEqual(false);
	}));
	it('Should have toggleSelectAll not called with all', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		expect($scope.toggleSelectAll).toEqual(jasmine.any(Function));
		$scope.toggleSelectAll("");
		expect($scope.info.unSelectAll).toEqual(false);
		expect($scope.info.selectAll).toEqual(false);
	}));
	it('Should have showAddTagsDd true', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var list = [{selected : true},{}];
		spyOn($scope, "refresh").and.returnValue(list);
		expect($scope.showAddTagsDd()).toEqual(true);
	}));
	it('Should have showAddTagsDd false', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var list = [{selected : false},{}];
		spyOn($scope, "refresh").and.returnValue(list);
		expect($scope.showAddTagsDd()).toEqual(false);
	}));
	it('Should have processMultipleTags', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.info.tags = "tag1, tag2,,    tag3";
		$scope.processMultipleTags();
		expect($scope.info.tags).toEqual("tag1,tag2,tag3");
	}));
	it('Should have unique', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var data = ["test", "test1", "test"];
		expect($scope.unique(data)).toEqual(["test", "test1"]);
	}));
	/*xit('Should have removeTagFromWorkbook', inject(function($rootScope, $controller, WorkbenchService, $httpBackend, $timeout, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var dsId = {_id : ""};
		var tag = "";
		$httpBackend.expectGET(infoserverDomain + '/tableau/datasource/tag/delete/' + manufacturer + '/' + product + '/' + schema + '/' + dsId._id + '/' + tag).respond({});
		$scope.removeTagFromWorkbook(dsId, tag);
		$httpBackend.flush();
	}));*/
	it('Should have showMsg', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.info.errMsg = "";
		expect($scope.showMsg()).toEqual(false);
	}));
	it('Should have showMsg else block', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.info.errMsg = "test";
		expect($scope.showMsg()).toEqual(true);
	}));
	it('Should have getAllTagsNameOfSelectedDashboards', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.datasources = [{selected:true, tags:"test,test1,test123"},{}];
		expect($scope.getAllTagsNameOfSelectedDashboards()).toEqual(["test", "test1", "test123"]);
	}));
	it('Should have addExistingTag', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var tag = "test";
		$scope.info.tags = "test,test1,test123";
		$scope.addExistingTag(tag);
	}));
	it('Should have addExistingTag second if Block', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var tag = "test";
		spyOn($scope, "isAlphaNumeric");
		$scope.info.tags = "";
		$scope.addExistingTag(tag);
		expect($scope.info.tags).toEqual("test");
	}));
	it('Should have addExistingTag second if Block else', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var tag = "test2";
		spyOn($scope, "isAlphaNumeric");
		$scope.info.tags = "test,test1,test123";
		$scope.addExistingTag(tag);
		expect($scope.info.tags).toEqual("test,test1,test123,test2");
	}));
	it('Should have isAlphaNumeric No tags', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.info.tags = "";
		$scope.isAlphaNumeric();
		expect($scope.info.errMsg).toEqual("");
	}));
	it('Should have isAlphaNumeric blank tag', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.info.tags = "test,test1,";
		var allTagsreturn = ["test","test1",""];
		spyOn($scope, "getAllTagsNameOfSelectedDashboards").and.returnValue(allTagsreturn);
		$scope.isAlphaNumeric();
		expect($scope.info.errMsg).toEqual("Duplicate tag name for : test, test1");
	}));
	it('Should have isAlphaNumeric max taglength', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.info.tags = "test,test1,test123";
		$scope.info.tag_max_characters = 3;
		var allTagsreturn = ["test","test1",""];
		spyOn($scope, "getAllTagsNameOfSelectedDashboards").and.returnValue(allTagsreturn);
		$scope.isAlphaNumeric();
		expect($scope.info.errMsg).toEqual("Tag name cannot have more than 50 characters");
	}));
	it('Should have isAlphaNumeric invalid Charecters', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.info.tags = "test,test1,#%";
		$scope.info.tag_max_characters = 20;
		var allTagsreturn = ["test","test1",""];
		spyOn($scope, "getAllTagsNameOfSelectedDashboards").and.returnValue(allTagsreturn);
		$scope.isAlphaNumeric();
		expect($scope.info.errMsg).toEqual("Tag name must have only alphanumeric characters.");
	}));
	it('Should have isAlphaNumeric No Duplicates', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.info.tags = "test2";
		var allTagsreturn = ["test","test1",""];
		spyOn($scope, "getAllTagsNameOfSelectedDashboards").and.returnValue(allTagsreturn);
		$scope.isAlphaNumeric();
		expect($scope.info.errMsg).toEqual("");
	}));
	it('Should have getAllTagsName', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.datasources = [{_id : "testId", tags: "tag1,tag2,tag3" },{}];
		var dsId = "testId";
		var tags = ["tag1","tag2","tag3"];
		spyOn($scope, "unique").and.returnValue(tags);
		expect($scope.getAllTagsName(dsId)).toEqual(tags);
	}));
	it('Should have getAllTagsName else block', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		$scope.datasources = [{_id : "testId", tags: "tag1,tag2,tag3" },{}];
		var tags = ["tag1","tag2","tag3"];
		spyOn($scope, "unique").and.returnValue(tags);
		expect($scope.getAllTagsName()).toEqual(tags);
	}));
	it('Should have addTagsMultiple with _id', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var list = [{_id : "testID",selected:true},{}];
		var tags = "tag1,tag2,tag3";
		spyOn($scope, "refresh").and.returnValue(list);
		spyOn($scope, "processMultipleTags").and.returnValue(tags);
		$scope.addTagsMultiple();
		var tempSelBooks = ["testID"]
		expect($scope.info.selectedBooks).toEqual(tempSelBooks);
	}));
	it('Should have addTagsMultiple with id', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('WorkbenchCtrl', {
			'$scope' : $scope
		});
		var list = [{id : "testID",selected:true},{}];
		var tags = "tag1,tag2,tag3";
		spyOn($scope, "refresh").and.returnValue(list);
		spyOn($scope, "processMultipleTags").and.returnValue(tags);
		$scope.info.tags = "testingTag";
		$scope.addTagsMultiple();
		var tempSelBooks = ["testID"]
		expect($scope.info.selectedBooks).toEqual(tempSelBooks);
	}));
});