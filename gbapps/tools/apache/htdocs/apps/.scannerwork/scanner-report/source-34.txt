'use strict';

/* jasmine specs for log vault controllers go here */

describe('LogVaultCtrl : ', function() {

	beforeEach(module('gbApp', 'gbApp.controllers.dashboards', 'gbApp.services.dashboards', 'gbApp.services.explorer', 'gbApp.services', 'ngCookies', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('manufacturer', undefined);
		$provide.value('product', undefined);
		$provide.value('schema', undefined);
		$provide.value('application', undefined);
		$provide.value('module', undefined);
		$provide.value('activity', undefined);
		$provide.value('details', undefined);
		$provide.value('adminEmail', 'support@glassbeam.com');
		$provide.value('logoutLink', 'support@glassbeam.com');
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);

        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
    }));

	it('Should have customDateFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('customDateFilter')).toBeTruthy();
		expect($scope.customDateFilter).toBeTruthy();
	}));

	it('Should have dateRangeFilterName', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('dateRangeFilterName')).toBeTruthy();
		expect($scope.dateRangeFilterName).toEqual('Custom Date Range');
	}));

	it('Should have selectedFacets', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('selectedFacets')).toBeTruthy();
		expect($scope.selectedFacets).toEqual(jasmine.any(Object));
	}));

	it('Should have selectedFacetsList', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('selectedFacetsList')).toBeTruthy();
		expect($scope.selectedFacetsList).toEqual(jasmine.any(Array));
	}));

	it('Should have bundleList', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('bundleList')).toBeTruthy();
		expect($scope.bundleList).toEqual(jasmine.any(Array));
	}));

	it('Should have appliedFacets', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('appliedFacets')).toBeTruthy();
		expect($scope.appliedFacets).toEqual(jasmine.any(Object));
	}));

	it('Should have info', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('info')).toBeTruthy();
		expect($scope.info).toEqual(jasmine.any(Object));
	}));

	it('Should have info.init', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('init')).toBeTruthy();
		expect($scope.info.init).toBeFalsy();
	}));

	it('Should have info.no_result', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('no_result')).toBeTruthy();
		expect($scope.info.no_result).toBeFalsy();
	}));

	it('Should have info.uploaded_by', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('uploaded_by')).toBeTruthy();
		expect($scope.info.uploaded_by).toBeNull();
	}));

	it('Should have info.fileLists', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('fileLists')).toBeTruthy();
		expect($scope.info.fileLists).toEqual(jasmine.any(Array));
	}));

	it('Should have info.pristine', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('pristine')).toBeTruthy();
		expect($scope.info.pristine).toBeTruthy();
	}));

	it('Should have info.defaultFilterInfo', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('defaultFilterInfo')).toBeTruthy();
		expect($scope.info.defaultFilterInfo).toEqual(jasmine.any(Object));
	}));

	it('Should have info.nsr_enabled', inject(function($rootScope, $controller, $cookies, metaDataService) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('nsr_enabled')).toBeTruthy();
		if($scope.info.nsr_enabled){
			expect($scope.info.nsr_enabled).toEqual(metaDataService.getDomain()["nsr_enabled"] == 1);
		}
	}));

	it('Should have info.facetLoading', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('facetLoading')).toBeTruthy();
		expect($scope.info.facetLoading).toBeTruthy();
	}));

	it('Should have info.resultLoading', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('resultLoading')).toBeTruthy();
		expect($scope.info.resultLoading).toBeTruthy();
	}));

	it('Should have info.quick', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('quick')).toBeTruthy();
		expect($scope.info.quick).toBeNull();
	}));

	it('Should have info.showOTime', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('showOTime')).toBeTruthy();
		expect($scope.info.showOTime).toBeFalsy();
	}));

	it('Should have info.fromDate', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('fromDate')).toBeTruthy();
		expect($scope.info.fromDate).toBeNull();
	}));

	it('Should have info.fromTime', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('fromTime')).toBeTruthy();
		expect($scope.info.fromTime).toEqual(jasmine.any(Object));
	}));

	it('Should have info.toDate', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('toDate')).toBeTruthy();
		expect($scope.info.toDate).toBeNull();
	}));

	it('Should have info.toTime', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('toTime')).toBeTruthy();
		expect($scope.info.toTime).toEqual(jasmine.any(Object));
	}));

	it('Should have info.fData', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('fData')).toBeTruthy();
		expect($scope.info.fData).toEqual(jasmine.any(Array));
	}));

	it('Should have info.allConfigLoading', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('allConfigLoading')).toBeTruthy();
		expect($scope.info.allConfigLoading).toBeTruthy();
	}));

	it('Should have info.default_days', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('default_days')).toBeTruthy();
		expect($scope.info.default_days).toEqual(0);
	}));

	it('Should have info.fields', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('fields')).toBeTruthy();
		expect($scope.info.fields).toEqual(jasmine.any(Array));
	}));

	it('Should have info.chartLevel', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('chartLevel')).toBeTruthy();
		expect($scope.info.chartLevel).toEqual('YEAR');
	}));

	it('Should have info.response', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('response')).toBeTruthy();
		expect($scope.info.response).toEqual(jasmine.any(Object));
		expect($scope.info.response).toEqual({
			docs : [],
			numFound : 0
		});
	}));

	it('Should have info.facetCharts', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('facetCharts')).toBeTruthy();
		expect($scope.info.facetCharts).toEqual(jasmine.any(Array));
	}));

	it('Should have info.sort_order', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.info.hasOwnProperty('sort_order')).toBeTruthy();
		expect($scope.info.sort_order).toEqual(jasmine.any(Object));
		expect($scope.info.sort_order).toEqual({
			"label" : "Latest",
			"val" : "desc"
		});
	}));
	it('Should have reloadGraph', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});

		var nodata = {"obs_date":{"start":"2015-06-24T00:00:00Z","end":"2015-06-25T00:00:00Z","gap":"+1H-OUR/HO-UR","counts":["2015-06-25T00:00:00Z",0,"2015-06-24T24:00:00Z",0,"2015-06-24T23:00:00Z",0,"2015-06-24T22:00:00Z",0,"2015-06-24T21:00:00Z",0,"2015-06-24T20:00:00Z",1,"2015-06-24T19:00:00Z",2,"2015-06-24T18:00:00Z",1,"2015-06-24T17:00:00Z",0,"2015-06-24T16:00:00Z",1,"2015-06-24T15:00:00Z",0,"2015-06-24T14:00:00Z",1,"2015-06-24T13:00:00Z",0,"2015-06-24T12:00:00Z",0,"2015-06-24T11:00:00Z",0,"2015-06-24T10:00:00Z",0,"2015-06-24T09:00:00Z",0,"2015-06-24T08:00:00Z",0,"2015-06-24T07:00:00Z",0,"2015-06-24T06:00:00Z",0,"2015-06-24T05:00:00Z",0,"2015-06-24T04:00:00Z",0,"2015-06-24T03:00:00Z",1,"2015-06-24T02:00:00Z",0,"2015-06-24T01:00:00Z",0,"2015-06-24T00:00:00Z",0]}};
		$scope.reloadGraph(nodata);

		var dataMinutes = {"obs_date":{"start":"2015-06-24T19:00:00Z","end":"2015-06-24T20:00:00Z","gap":"+1MINUTES/MINUTES","counts":["2015-06-24T20:00:00Z",0,"2015-06-24T19:59:00Z",0,"2015-06-24T19:58:00Z",0,"2015-06-24T19:57:00Z",0,"2015-06-24T19:56:00Z",0,"2015-06-24T19:55:00Z",0,"2015-06-24T19:54:00Z",0,"2015-06-24T19:53:00Z",0,"2015-06-24T19:52:00Z",0,"2015-06-24T19:51:00Z",0,"2015-06-24T19:50:00Z",0,"2015-06-24T19:49:00Z",0,"2015-06-24T19:48:00Z",0,"2015-06-24T19:47:00Z",0,"2015-06-24T19:46:00Z",0,"2015-06-24T19:45:00Z",0,"2015-06-24T19:44:00Z",0,"2015-06-24T19:43:00Z",0,"2015-06-24T19:42:00Z",0,"2015-06-24T19:41:00Z",0,"2015-06-24T19:40:00Z",0,"2015-06-24T19:39:00Z",0,"2015-06-24T19:38:00Z",0,"2015-06-24T19:37:00Z",0,"2015-06-24T19:36:00Z",0,"2015-06-24T19:35:00Z",0,"2015-06-24T19:34:00Z",0,"2015-06-24T19:33:00Z",0,"2015-06-24T19:32:00Z",0,"2015-06-24T19:31:00Z",0,"2015-06-24T19:30:00Z",0,"2015-06-24T19:29:00Z",0,"2015-06-24T19:28:00Z",0,"2015-06-24T19:27:00Z",0,"2015-06-24T19:26:00Z",0,"2015-06-24T19:25:00Z",0,"2015-06-24T19:24:00Z",0,"2015-06-24T19:23:00Z",0,"2015-06-24T19:22:00Z",0,"2015-06-24T19:21:00Z",0,"2015-06-24T19:20:00Z",0,"2015-06-24T19:19:00Z",0,"2015-06-24T19:18:00Z",0,"2015-06-24T19:17:00Z",0,"2015-06-24T19:16:00Z",0,"2015-06-24T19:15:00Z",0,"2015-06-24T19:14:00Z",1,"2015-06-24T19:13:00Z",0,"2015-06-24T19:12:00Z",0,"2015-06-24T19:11:00Z",0,"2015-06-24T19:10:00Z",0,"2015-06-24T19:09:00Z",0,"2015-06-24T19:08:00Z",0,"2015-06-24T19:07:00Z",0,"2015-06-24T19:06:00Z",0,"2015-06-24T19:05:00Z",0,"2015-06-24T19:04:00Z",1,"2015-06-24T19:03:00Z",0,"2015-06-24T19:02:00Z",0,"2015-06-24T19:01:00Z",0,"2015-06-24T19:00:00Z",0]}};
		$scope.reloadGraph(dataMinutes);
		var dataSeconds = {"obs_date":{"start":"2015-06-24T19:14:00Z","end":"2015-06-24T19:14:59Z","gap":"+1SECONDS/SECONDS","counts":["2015-06-24T19:14:59Z",0,"2015-06-24T19:14:58Z",0,"2015-06-24T19:14:57Z",0,"2015-06-24T19:14:56Z",0,"2015-06-24T19:14:55Z",0,"2015-06-24T19:14:54Z",0,"2015-06-24T19:14:53Z",0,"2015-06-24T19:14:52Z",0,"2015-06-24T19:14:51Z",0,"2015-06-24T19:14:50Z",0,"2015-06-24T19:14:49Z",0,"2015-06-24T19:14:48Z",0,"2015-06-24T19:14:47Z",0,"2015-06-24T19:14:46Z",0,"2015-06-24T19:14:45Z",0,"2015-06-24T19:14:44Z",0,"2015-06-24T19:14:43Z",0,"2015-06-24T19:14:42Z",0,"2015-06-24T19:14:41Z",0,"2015-06-24T19:14:40Z",0,"2015-06-24T19:14:39Z",0,"2015-06-24T19:14:38Z",0,"2015-06-24T19:14:37Z",1,"2015-06-24T19:14:36Z",0,"2015-06-24T19:14:35Z",0,"2015-06-24T19:14:34Z",0,"2015-06-24T19:14:33Z",0,"2015-06-24T19:14:32Z",0,"2015-06-24T19:14:31Z",0,"2015-06-24T19:14:30Z",0,"2015-06-24T19:14:29Z",0,"2015-06-24T19:14:28Z",0,"2015-06-24T19:14:27Z",0,"2015-06-24T19:14:26Z",0,"2015-06-24T19:14:25Z",0,"2015-06-24T19:14:24Z",0,"2015-06-24T19:14:23Z",0,"2015-06-24T19:14:22Z",0,"2015-06-24T19:14:21Z",0,"2015-06-24T19:14:20Z",0,"2015-06-24T19:14:19Z",0,"2015-06-24T19:14:18Z",0,"2015-06-24T19:14:17Z",0,"2015-06-24T19:14:16Z",0,"2015-06-24T19:14:15Z",0,"2015-06-24T19:14:14Z",0,"2015-06-24T19:14:13Z",0,"2015-06-24T19:14:12Z",0,"2015-06-24T19:14:11Z",0,"2015-06-24T19:14:10Z",0,"2015-06-24T19:14:09Z",0,"2015-06-24T19:14:08Z",0,"2015-06-24T19:14:07Z",0,"2015-06-24T19:14:06Z",0,"2015-06-24T19:14:05Z",0,"2015-06-24T19:14:04Z",0,"2015-06-24T19:14:03Z",0,"2015-06-24T19:14:02Z",0,"2015-06-24T19:14:01Z",0,"2015-06-24T19:14:00Z",0]}};
		$scope.reloadGraph(dataSeconds);

		var data = {"obs_date":{"start":"2008-07-14T09:36:53Z","end":"2017-01-01T00:00:00Z","gap":"+1YEAR/YEAR","counts":["2017-01-01T00:00:00Z",0,"2016-01-01T00:00:00Z",4,"2015-01-01T00:00:00Z",14,"2014-01-01T00:00:00Z",0,"2013-01-01T00:00:00Z",0,"2012-01-01T00:00:00Z",1,"2011-01-01T00:00:00Z",1,"2010-01-01T00:00:00Z",0,"2009-01-01T00:00:00Z",0,"2008-01-01T00:00:00Z",0]}};
		$scope.reloadGraph(data);
		data = {"obs_date":{"start":"2015-01-01T00:00:00Z","end":"2016-01-01T00:00:00Z","gap":"+1MONTH/MONTH","counts":["2016-01-01T00:00:00Z",0,"2015-12-01T00:00:00Z",0,"2015-11-01T00:00:00Z",0,"2015-10-01T00:00:00Z",0,"2015-09-01T00:00:00Z",0,"2015-08-01T00:00:00Z",0,"2015-07-01T00:00:00Z",0,"2015-06-01T00:00:00Z",14,"2015-05-01T00:00:00Z",0,"2015-04-01T00:00:00Z",0,"2015-03-01T00:00:00Z",0,"2015-02-01T00:00:00Z",0,"2015-01-01T00:00:00Z",0]}};
		$scope.reloadGraph(data);
		data = {"obs_date":{"start":"2015-06-01T00:00:00Z","end":"2015-07-01T00:00:00Z","gap":"+1DAY/DAY","counts":["2015-07-01T00:00:00Z",0,"2015-06-30T00:00:00Z",0,"2015-06-29T00:00:00Z",0,"2015-06-28T00:00:00Z",0,"2015-06-27T00:00:00Z",0,"2015-06-26T00:00:00Z",0,"2015-06-25T00:00:00Z",3,"2015-06-24T00:00:00Z",7,"2015-06-23T00:00:00Z",1,"2015-06-22T00:00:00Z",0,"2015-06-21T00:00:00Z",0,"2015-06-20T00:00:00Z",0,"2015-06-19T00:00:00Z",0,"2015-06-18T00:00:00Z",0,"2015-06-17T00:00:00Z",3,"2015-06-16T00:00:00Z",0,"2015-06-15T00:00:00Z",0,"2015-06-14T00:00:00Z",0,"2015-06-13T00:00:00Z",0,"2015-06-12T00:00:00Z",0,"2015-06-11T00:00:00Z",0,"2015-06-10T00:00:00Z",0,"2015-06-09T00:00:00Z",0,"2015-06-08T00:00:00Z",0,"2015-06-07T00:00:00Z",0,"2015-06-06T00:00:00Z",0,"2015-06-05T00:00:00Z",0,"2015-06-04T00:00:00Z",0,"2015-06-03T00:00:00Z",0,"2015-06-02T00:00:00Z",0,"2015-06-01T00:00:00Z",0]}};
		$scope.reloadGraph(data);
		
		data = {"obs_date":{"start":"2015-06-24T00:00:00Z","end":"2015-06-25T00:00:00Z","gap":"+1HOUR/HOUR","counts":["2015-06-25T00:00:00Z",0,"2015-06-24T24:00:00Z",0,"2015-06-24T23:00:00Z",0,"2015-06-24T22:00:00Z",0,"2015-06-24T21:00:00Z",0,"2015-06-24T20:00:00Z",1,"2015-06-24T19:00:00Z",2,"2015-06-24T18:00:00Z",1,"2015-06-24T17:00:00Z",0,"2015-06-24T16:00:00Z",1,"2015-06-24T15:00:00Z",0,"2015-06-24T14:00:00Z",1,"2015-06-24T13:00:00Z",0,"2015-06-24T12:00:00Z",0,"2015-06-24T11:00:00Z",0,"2015-06-24T10:00:00Z",0,"2015-06-24T09:00:00Z",0,"2015-06-24T08:00:00Z",0,"2015-06-24T07:00:00Z",0,"2015-06-24T06:00:00Z",0,"2015-06-24T05:00:00Z",0,"2015-06-24T04:00:00Z",0,"2015-06-24T03:00:00Z",1,"2015-06-24T02:00:00Z",0,"2015-06-24T01:00:00Z",0,"2015-06-24T00:00:00Z",0]}};
		//$scope.reloadGraph(data);

	}));

	it('Should have d3BarRender method', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});

        //spyOn($scope, "d3BarRender");
        //$scope.d3BarRender();
	}));
	
	
	it('Should have dashboards all details', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
	    $cookies.nsr_enabled = 1;
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope,
		});

        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
	
		$httpBackend.flush();
	}));
	
	it('Should have getData with data', inject(function($rootScope, $q, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
	    
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope,
		});

        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
		$scope.info.fromDate = true;
		$scope.info.toDate = true;
		spyOn($scope,'reloadGraph');
		spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        $scope.info.fromDate = true;
        $scope.info.toDate = true;
		$scope.info.nsr_enabled = true;
		$scope.facets = [{"key":"sysid","label":"Serial Number","data":[{"title":"Serial Number","label":"FC0004794","value":1,"selected":false},{"title":"Serial Number","label":"CP0004632","value":1,"selected":false},{"title":"Serial Number","label":"BC0001877","value":1,"selected":false},{"title":"Serial Number","label":"BC0001601","value":1,"selected":false},{"title":"Serial Number","label":"BC0001429","value":1,"selected":false},{"title":"Serial Number","label":"BB0002530","value":1,"selected":false},{"title":"Serial Number","label":"BB0001097","value":1,"selected":false},{"title":"Serial Number","label":"BA0007562","value":1,"selected":false},{"title":"Serial Number","label":"BA0001867","value":1,"selected":false},{"title":"Serial Number","label":"AR0017023","value":1,"selected":false},{"title":"Serial Number","label":"AK0027541","value":1,"selected":false},{"title":"Serial Number","label":"AK0022752","value":1,"selected":false},{"title":"Serial Number","label":"AK0018013","value":1,"selected":false},{"title":"Serial Number","label":"AK0005140","value":1,"selected":false}],"expanded":true,"f_data":[{"title":"Serial Number","label":"AK0005140","value":1,"selected":false},{"title":"Serial Number","label":"AK0018013","value":1,"selected":false},{"title":"Serial Number","label":"AK0022752","value":1,"selected":false},{"title":"Serial Number","label":"AK0027541","value":1,"selected":false},{"title":"Serial Number","label":"AR0017023","value":1,"selected":false},{"title":"Serial Number","label":"BA0001867","value":1,"selected":false},{"title":"Serial Number","label":"BA0007562","value":1,"selected":false},{"title":"Serial Number","label":"BB0001097","value":1,"selected":false},{"title":"Serial Number","label":"BB0002530","value":1,"selected":false},{"title":"Serial Number","label":"BC0001429","value":1,"selected":false},{"title":"Serial Number","label":"BC0001601","value":1,"selected":false},{"title":"Serial Number","label":"BC0001877","value":1,"selected":false},{"title":"Serial Number","label":"CP0004632","value":1,"selected":false},{"title":"Serial Number","label":"FC0004794","value":1,"selected":false}]},{"key":"ticket_num","label":"Ticket Number","data":[{"title":"Ticket Number","label":"1710906","value":1,"selected":false},{"title":"Ticket Number","label":"1710903","value":1,"selected":false},{"title":"Ticket Number","label":"1710800","value":1,"selected":false},{"title":"Ticket Number","label":"1707728","value":1,"selected":false},{"title":"Ticket Number","label":"1703338","value":1,"selected":false},{"title":"Ticket Number","label":"1699662","value":1,"selected":false},{"title":"Ticket Number","label":"1711086","value":2,"selected":false},{"title":"Ticket Number","label":"1498514","value":6,"selected":false},{"title":"Ticket Number","label":"100001","value":6,"selected":false}],"expanded":false,"f_data":[{"title":"Ticket Number","label":"100001","value":6,"selected":false},{"title":"Ticket Number","label":"1498514","value":6,"selected":false},{"title":"Ticket Number","label":"1699662","value":1,"selected":false},{"title":"Ticket Number","label":"1703338","value":1,"selected":false},{"title":"Ticket Number","label":"1707728","value":1,"selected":false},{"title":"Ticket Number","label":"1710800","value":1,"selected":false},{"title":"Ticket Number","label":"1710903","value":1,"selected":false},{"title":"Ticket Number","label":"1710906","value":1,"selected":false},{"title":"Ticket Number","label":"1711086","value":2,"selected":false}]},{"key":"cust_name","label":"Account Name","data":[{"title":"Account Name","label":"sra.com","value":1,"selected":false},{"title":"Account Name","label":"pfisd.net","value":1,"selected":false},{"title":"Account Name","label":"minnetonka.k12.mn.us","value":1,"selected":false},{"title":"Account Name","label":"University of Washington","value":1,"selected":false},{"title":"Account Name","label":"Transition Systems Asia Pte Ltd","value":1,"selected":false},{"title":"Account Name","label":"Terach B.V","value":1,"selected":false},{"title":"Account Name","label":"TechAccess","value":1,"selected":false},{"title":"Account Name","label":"Ingram Micro Inc","value":1,"selected":false},{"title":"Account Name","label":"AT&T Oxygen FZ LLC/ Oxygen - JLT ajg.com","value":1,"selected":false},{"title":"Account Name","label":"49ers.com","value":1,"selected":false},{"title":"Account Name","label":"uw.edu","value":2,"selected":false},{"title":"Account Name","label":"Catalyst Telecom","value":2,"selected":false},{"title":"Account Name","label":"Avnet Logistics, USLP","value":6,"selected":false}],"expanded":false,"f_data":[{"title":"Account Name","label":"49ers.com","value":1,"selected":false},{"title":"Account Name","label":"AT&T Oxygen FZ LLC/ Oxygen - JLT ajg.com","value":1,"selected":false},{"title":"Account Name","label":"Avnet Logistics, USLP","value":6,"selected":false},{"title":"Account Name","label":"Catalyst Telecom","value":2,"selected":false},{"title":"Account Name","label":"Ingram Micro Inc","value":1,"selected":false},{"title":"Account Name","label":"minnetonka.k12.mn.us","value":1,"selected":false},{"title":"Account Name","label":"pfisd.net","value":1,"selected":false},{"title":"Account Name","label":"sra.com","value":1,"selected":false},{"title":"Account Name","label":"TechAccess","value":1,"selected":false},{"title":"Account Name","label":"Terach B.V","value":1,"selected":false},{"title":"Account Name","label":"Transition Systems Asia Pte Ltd","value":1,"selected":false},{"title":"Account Name","label":"University of Washington","value":1,"selected":false},{"title":"Account Name","label":"uw.edu","value":2,"selected":false}]},{"key":"sys_version","label":"Version","data":[{"title":"Version","label":"6.4.3.2","value":1,"selected":false},{"title":"Version","label":"6.4.2.2","value":1,"selected":false},{"title":"Version","label":"6.4.2.1","value":1,"selected":false},{"title":"Version","label":"6.4.2.7","value":2,"selected":false},{"title":"Version","label":"6.4.2.5","value":2,"selected":false},{"title":"Version","label":"6.4.2.8","value":3,"selected":false},{"title":"Version","label":"6.4.2.6","value":4,"selected":false},{"title":"Version","label":"5.0.3.0","value":6,"selected":false}],"expanded":false,"f_data":[{"title":"Version","label":"5.0.3.0","value":6,"selected":false},{"title":"Version","label":"6.4.2.1","value":1,"selected":false},{"title":"Version","label":"6.4.2.2","value":1,"selected":false},{"title":"Version","label":"6.4.2.5","value":2,"selected":false},{"title":"Version","label":"6.4.2.6","value":4,"selected":false},{"title":"Version","label":"6.4.2.7","value":2,"selected":false},{"title":"Version","label":"6.4.2.8","value":3,"selected":false},{"title":"Version","label":"6.4.3.2","value":1,"selected":false}]},{"key":"sys_model","label":"System Model","data":[{"title":"System Model","label":"Aruba7240","value":1,"selected":false},{"title":"System Model","label":"Aruba7005","value":1,"selected":false},{"title":"System Model","label":"Aruba650","value":1,"selected":false},{"title":"System Model","label":"Aruba6000-US","value":1,"selected":false},{"title":"System Model","label":"Aruba7240-US","value":2,"selected":false},{"title":"System Model","label":"Aruba7220-US","value":2,"selected":false},{"title":"System Model","label":"Aruba7210-US","value":2,"selected":false},{"title":"System Model","label":"Aruba3600-US","value":2,"selected":false},{"title":"System Model","label":"Aruba3600","value":8,"selected":false}],"expanded":false,"f_data":[{"title":"System Model","label":"Aruba3600","value":8,"selected":false},{"title":"System Model","label":"Aruba3600-US","value":2,"selected":false},{"title":"System Model","label":"Aruba6000-US","value":1,"selected":false},{"title":"System Model","label":"Aruba650","value":1,"selected":false},{"title":"System Model","label":"Aruba7005","value":1,"selected":false},{"title":"System Model","label":"Aruba7210-US","value":2,"selected":false},{"title":"System Model","label":"Aruba7220-US","value":2,"selected":false},{"title":"System Model","label":"Aruba7240","value":1,"selected":false},{"title":"System Model","label":"Aruba7240-US","value":2,"selected":false}]},{"key":"obs_ts","label":"","data":[],"expanded":false,"f_data":[]},{"key":"obs_url","label":"Bundle URL","data":[],"expanded":false,"f_data":[]},{"key":"severity","label":"Event Severity","data":[],"expanded":false,"f_data":[]},{"key":"evt_type","label":"Event Type","data":[],"expanded":false,"f_data":[]},{"key":"evt_epoch","label":"","data":[],"expanded":false,"f_data":[]},{"key":"uploaded_by","label":"user","data":[{"title":"user","label":"","value":20,"selected":false}],"expanded":false,"f_data":[{"title":"user","label":"","value":20,"selected":false}]},{"key":"evt_date_str","label":"Event Date","data":[],"expanded":false,"f_data":[]},{"key":"obs_date_str","label":"System Time","data":[],"expanded":false,"f_data":[]}];
		$scope.selectedFacets = {"sysid":[{"title":"Serial Number","label":"AK0005140","value":1,"selected":true}],"ticket_num":[],"cust_name":[],"sys_version":[],"sys_model":[],"obs_ts":[],"obs_url":[],"severity":[],"evt_type":[],"evt_epoch":[],"uploaded_by":[],"evt_date_str":[],"obs_date_str":[]};
		var retDate = new Date(Date.UTC(2015, 2, 12, 22, 45, 23, 45));
		jasmine.clock().mockDate(retDate);
		$scope.tableParams.settings().$scope = $scope;
		$scope.info.paginate = true;
		$httpBackend.expectGET(infoserverDomain + '/uimeta/config/'+manufacturer+'/'+product+'/'+schema).respond(500);
		$httpBackend.expectGET(infoserverDomain + '/logvault/undefined/undefined/undefined/1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10?filter=sysid%3D%22AK0005140%22&sortby=obs_date+desc').respond(
			{
				"Status":"Success","Msg":"Response for the solr query","Data":{"response":{"numFound":"20","start":"0","docs":[{"sys_model":"Aruba3600","cust_name":"AT&T Oxygen FZ LLC/ Oxygen - JLT ajg.com","obs_url":"mahendru5.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"5.0.3.0","ticket_num":"1498514","sysid":"CP0004165","uploaded_by":"","obs_date_str":"Mon Jan 19 19:13:13 2016 +0800","bundle_id":"CP0004165___1453201993000","filename":"mahendru5.zip","obs_size":"441581","obs_date":"2016-01-19T11:13:13Z"},{"sys_model":"Aruba3600","cust_name":"Avnet Logistics, USLP","obs_url":"mahendru2diff.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"5.0.3.0","ticket_num":"1498514","sysid":"CP0004165","uploaded_by":"","obs_date_str":"Mon Jan 18 11:11:11 2016 +0800","bundle_id":"CP0004165___1453086671000","filename":"mahendru2diff.zip","obs_size":"444491","obs_date":"2016-01-18T03:11:11Z"},{"sys_model":"Aruba3600","cust_name":"Avnet Logistics, USLP","obs_url":"mahendru4.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"5.0.3.0","ticket_num":"1498514","sysid":"CP0004165","uploaded_by":"","obs_date_str":"Mon Jan 17 03:13:13 2016 +0800","bundle_id":"CP0004165___1452971593000","filename":"mahendru4.zip","obs_size":"441502","obs_date":"2016-01-16T19:13:13Z"},{"sys_model":"Aruba3600","cust_name":"Avnet Logistics, USLP","obs_url":"mahendru6.zip","evt_date":"2011-01-17T01:20:21Z","sys_version":"5.0.3.0","ticket_num":"1498514","sysid":"CP0004165","uploaded_by":"","obs_date_str":"Mon Jan 02 01:13:13 2016 +0800","bundle_id":"CP0004165___1451668393000","filename":"mahendru6.zip","obs_size":"441560","obs_date":"2016-01-01T17:13:13Z"},{"sys_model":"Aruba7240","cust_name":"49ers.com","obs_url":"20150624_49ers.com_Master_A_49ers.com_BC0001877_Hostname_is_49ers_Master_auto_2015-06-25_02_43_29_0000.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"6.4.2.7","ticket_num":"100001","sysid":"BC0001877","uploaded_by":"","obs_date_str":"Wed Jun 24 19:43:49 2015 -0800","bundle_id":"BC0001877___1435203829000","filename":"20150624_49ers.com_Master_A_49ers.com_BC0001877_Hostname_is_49ers_Master_auto_2015-06-25_02_43_29_0000.zip","obs_size":"136744","obs_date":"2015-06-25T03:43:49Z"},{"sys_model":"Aruba650","cust_name":"Transition Systems Asia Pte Ltd","obs_url":"20150624_Transition_Systems_Asia_Pte_Ltd_kushal.vinayakumar_timeinc.com_AR0017023_tasew5wlocal4_SFDC_2015-06-24_11_01_15_9270.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"6.4.2.2","ticket_num":"1703338","sysid":"AR0017023","uploaded_by":"","obs_date_str":"Thu Jun 25 06:31:13 2015 +0500","bundle_id":"AR0017023___1435195873000","filename":"20150624_Transition_Systems_Asia_Pte_Ltd_kushal.vinayakumar_timeinc.com_AR0017023_tasew5wlocal4_SFDC_2015-06-24_11_01_15_9270.zip","obs_size":"973835","obs_date":"2015-06-25T01:31:13Z"},{"sys_model":"Aruba6000-US","cust_name":"sra.com","obs_url":"20150624_sra.com_io_network_sra.com_FC0004794_Hostname_is_ADC1_01_WC6000_01_auto_2015-06-25_00_55_17_0000.zip","sys_version":"6.4.2.5","ticket_num":"100001","sysid":"FC0004794","uploaded_by":"","obs_date_str":"Thu Jun 25 00:53:15 2015 +0000","bundle_id":"FC0004794___1435193595000","filename":"20150624_sra.com_io_network_sra.com_FC0004794_Hostname_is_ADC1_01_WC6000_01_auto_2015-06-25_00_55_17_0000.zip","obs_size":"599869","obs_date":"2015-06-25T00:53:15Z"},{"sys_model":"Aruba3600-US","cust_name":"Avnet Logistics, USLP","obs_url":"20150624_Avnet_Logistics_USLP_croberts_corban.edu_AK0005140_Pegasus_SFDC_2015-06-24_14_10_15_9970.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"6.4.2.5","ticket_num":"1710906","sysid":"AK0005140","uploaded_by":"","obs_date_str":"Wed Jun 24 12:51:55 2015 -0800","bundle_id":"AK0005140___1435179115000","filename":"20150624_Avnet_Logistics_USLP_croberts_corban.edu_AK0005140_Pegasus_SFDC_2015-06-24_14_10_15_9970.zip","obs_size":"1209956","obs_date":"2015-06-24T20:51:55Z"},{"sys_model":"Aruba7005","cust_name":"Catalyst Telecom","obs_url":"20150624_Catalyst_Telecom_hoang.tran_pfizer.com_CP0004632_uaw_aruba_7005_SFDC_2015-06-24_12_34_17_5930.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"6.4.2.8","ticket_num":"1711086","sysid":"CP0004632","uploaded_by":"","obs_date_str":"Wed Jun 24 19:14:37 2015 +0000","bundle_id":"CP0004632___1435173277000","filename":"20150624_Catalyst_Telecom_hoang.tran_pfizer.com_CP0004632_uaw_aruba_7005_SFDC_2015-06-24_12_34_17_5930.zip","obs_size":"389015","obs_date":"2015-06-24T19:14:37Z"},{"sys_model":"Aruba7210-US","cust_name":"Ingram Micro Inc","obs_url":"20150624_Ingram_Micro_Inc_hoang.tran_pfizer.com_BA0007562_NDH_128_2_D_H006_ARU01_SFDC_2015-06-24_12_34_15_4770.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"6.4.2.8","ticket_num":"1711086","sysid":"BA0007562","uploaded_by":"","obs_date_str":"Wed Jun 24 19:04:16 2015 +0000","bundle_id":"BA0007562___1435172656000","filename":"20150624_Ingram_Micro_Inc_hoang.tran_pfizer.com_BA0007562_NDH_128_2_D_H006_ARU01_SFDC_2015-06-24_12_34_15_4770.zip","obs_size":"328874","obs_date":"2015-06-24T19:04:16Z"}]},"facet_counts":{"facet_fields":{"sys_model":["Aruba7240",1,"Aruba7005",1,"Aruba650",1,"Aruba6000-US",1,"Aruba7240-US",2,"Aruba7220-US",2,"Aruba7210-US",2,"Aruba3600-US",2,"Aruba3600",8],"cust_name":["sra.com",1,"pfisd.net",1,"minnetonka.k12.mn.us",1,"University of Washington",1,"Transition Systems Asia Pte Ltd",1,"Terach B.V",1,"TechAccess",1,"Ingram Micro Inc",1,"AT&T Oxygen FZ LLC/ Oxygen - JLT ajg.com",1,"49ers.com",1,"uw.edu",2,"Catalyst Telecom",2,"Avnet Logistics, USLP",6],"sys_version":["6.4.3.2",1,"6.4.2.2",1,"6.4.2.1",1,"6.4.2.7",2,"6.4.2.5",2,"6.4.2.8",3,"6.4.2.6",4,"5.0.3.0",6],"ticket_num":["1710906",1,"1710903",1,"1710800",1,"1707728",1,"1703338",1,"1699662",1,"1711086",2,"1498514",6,"100001",6],"sysid":["FC0004794",1,"CP0004632",1,"BC0001877",1,"BC0001601",1,"BC0001429",1,"BB0002530",1,"BB0001097",1,"BA0007562",1,"BA0001867",1,"AR0017023",1,"AK0027541",1,"AK0022752",1,"AK0018013",1,"AK0005140",1,"CP0004165",6],"uploaded_by":["",20],"severity":[],"evt_type":[]},"facet_ranges":{"obs_date":{"start":"2008-07-16T07:50:24Z","end":"2017-01-01T00:00:00Z","gap":"+1YEAR/YEAR","counts":["2017-01-01T00:00:00Z",0,"2016-01-01T00:00:00Z",4,"2015-01-01T00:00:00Z",14,"2014-01-01T00:00:00Z",0,"2013-01-01T00:00:00Z",0,"2012-01-01T00:00:00Z",1,"2011-01-01T00:00:00Z",1,"2010-01-01T00:00:00Z",0,"2009-01-01T00:00:00Z",0,"2008-01-01T00:00:00Z",0]}}},"solr_query":"http://10.172.93.122:2181/solr/aruba-aruba-podui/select?fq=obs_date%3A%5B2008-7-16T7%3A50%3A24Z+TO+2016-10-2T7%3A50%3A24Z%5D&fl=sysid%2Cticket_num%2Ccust_name%2Csys_version%2Csys_model%2Cobs_date%2Cobs_url%2Cseverity%2Cevt_type%2Cevt_date%2Cuploaded_by%2Cevt_date_str%2Cobs_date_str%2Cbundle_id%2Cfilename%2Cobs_size%2Cnamespace&facet=true&facet.limit=2000&facet.mincount=1&facet.field=sysid&facet.field=ticket_num&facet.field=cust_name&facet.field=sys_version&facet.field=sys_model&facet.field=severity&facet.field=evt_type&facet.field=uploaded_by&facet.range=obs_date&f.obs_date.facet.range.start=2008-07-16T07%3A50%3A24.000Z&f.obs_date.facet.range.end=2016-10-02T07%3A50%3A24.000Z&f.obs_date.facet.range.gap=%2B1YEAR%2FYEAR&start=0&rows=10&q=type%3A%28%22LOGVAULT%22%29&shard.tolerant=true&sort=obs_date+desc&_stateVer_=aruba-aruba-podui%3A29"}
			});

		$scope.refresh($q.defer());
		$httpBackend.flush();
	}));
	
	it('Should have getData with error block', inject(function($rootScope, $q, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
	    $cookies.nsr_enabled = 1;
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope,
		});
        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
		$scope.info.fromDate = true;
        $scope.info.toDate = true;
		spyOn($scope,'reloadGraph');
		spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
		spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
		$scope.info.fromDate = true;
		$scope.info.toDate = true;
		var retDate = new Date(Date.UTC(2015, 2, 12, 22, 45, 23, 45));
		jasmine.clock().mockDate(retDate);
		$scope.tableParams.settings().$scope = $scope;
		$httpBackend.expectGET(infoserverDomain + '/uimeta/config/'+manufacturer+'/'+product+'/'+schema).respond(500);
		$httpBackend.expectGET(infoserverDomain + '/logvault/undefined/undefined/undefined/1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10?sortby=obs_date+desc').respond(500);

		$scope.refresh($q.defer());
		$httpBackend.flush();
	}));
	
	it('Should have defaultfilterinfo with error block', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
	    $cookies.nsr_enabled = 1;
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope,
		});

        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
		var retDate = new Date(Date.UTC(2015, 2, 12, 22, 45, 23, 45));
		jasmine.clock().mockDate(retDate);
		spyOn($scope,'reloadGraph');
		$scope.tableParams.settings().$scope = $scope;
		$httpBackend.expectGET(infoserverDomain + '/dashboards/all/details/'+manufacturer+'/'+product+'/'+schema).respond({"Status":"Success","Msg":"","Data":[{"d_type": "NSR", "reports": [{"r_link": "test"}]}]});
		$httpBackend.expect("GET", infoserverDomain + '/search/uimeta/config/ui/' + manufacturer + '/' + product + '/' + schema).respond({Data: {"all_col_label":{"":{"dataType":"STRING","label":"sck_date_str"},"namespace":{"dataType":"STRING","label":"Section Name"},"type":{"dataType":"STRING","label":"type"}},"facet_label":{"site_login":"no","facet_label_map":[{"obs_url":"Bundle URL"},{"sys_display_name":"Host Name"},{"sys_hwaddr":"Mac Address"},{"namespace":"Section Name"},{"obs_date_str":"System Time"},{"sys_timezone":"System Time Zone"},{"apc_ipaddr":"Apache Access Log IP"},{"evt_date_str":"Event Date"}]},"namespace_column":{"procdskstatinfonm":["dskstat_key","dskstat_num_w_mrgd","evt_date_str","dskstat_num_rd_mrgd","dskstat_num_io_millisec_wgh","dskstat_type","dskstat_num_io_cur_prog","dskstat_dev_name","dskstat_num_sec_w","dskstat_num_w_cmplt","dskstat_num_sec_rd","dskstat_major_num","obs_size","dskstat_num_w_millisec","dskstat_date_str","dskstat_num_io_millisec","dskstat_num_rd_issued","dskstat_minor_num","dskstat_num_rd_millisec"],"lin.msr":["bufpg","obs_size","msr_type","frmpg","evt_date_str","evt_text","campg","msr_date_str","msr_loc_time"],"lin.swpag":["swp_pswpout","swp_date_str","obs_size","evt_date_str","swp_pswpin","swp_type","swp_time","evt_text"],"lin.cpuinfo":["obs_size","evt_text","stat_iowait","stat_steal","stat_sys","stat_cpu","stat_date_str","stat_nice","stat_user","stat_idle","evt_date_str"],"apacheerr":["apacheerr_type","apacheerr_apacheerr","apacheerr_err_time","evt_date_str","apacheerr_date_str","obs_size","apacheerr_err_infotype","apacheerr_err_msg","apacheerr_sev_idx","apacheerr_source","evt_text","apacheerr_severity","apacheerr_label"],"lin.intrp":["evt_text","intrp_date_str","obs_size","intrp_value","loc_tm","intrp_type","evt_date_str"],"lin.netfailrep":["obs_size","nfr_loc_time","nfr_rxdrop","nfr_txerr","evt_text","evt_date_str","nfr_coll","nfr_txdrop","nfr_rxfram","nfr_txfifo","nfr_rxerr","nfr_type","nfr_iface","nfr_date_str","nfr_txcarr","nfr_rxfifo"],"lin.df":["df_type","df_use","df_avail","obs_size","df_filesystem","evt_text","df_date_str","df_size","df_mounted_on","df_used","evt_date_str"],"lin.dwps":["dwp_bwt","dwp_date_str","dwp_wtps","dwp_tm","dwp_rtps","evt_date_str","dwp_tps","dwp_type","evt_text","obs_size","dwp_brd"],"lin.psr":["psr_fault","psr_majflt","psr_date_strtwo","psr_loc_time","obs_size","psr_type","psr_pgpgout","evt_text","evt_date_str","psr_pgpgis"],"cputop":["evt_date_str","obs_size","top_per_cpu","evt_date_str","top_res","top_uptime","top_shr","top_tot_task","evt_text","top_s","top_pid","top_zombie_task","top_lctm","top_per_mem","obs_size","top_loc_tm","top_stoped_task","tops_date_str","cptop_date_str","top_user","top_command","top_ni","evt_text","top_ld_three_min_avg","top_pr","top_running_task","tops_type","top_no_users","top_ld_one_min_avg","top_sleeping_task","top_vitr","top_ld_two_min_avg"],"psax":["psax_stat","evt_text","psax_tty","psax_command","psax_time","evt_date_str","obs_size","psax_pid","psax_date_str"],"lin.freecmd":["free_swp_total","free_swp_free","free_swp_used","free_bufcac_free","free_type","obs_size","free_mem_shared","evt_text","free_mem_buffers","evt_date_str","free_date_str","free_bufcac_used","free_mem_cached","free_mem_total","free_mem_free","free_mem_used"],"varlogmsg":["varlog_type","evt_date_str","varlog_time","varlog_host","varlog__msg_source","varlog_message","varlog_severity","varlog_label","varlog_source","varlog_varlog","obs_size","evt_text","varlog_date_str","varlog_sev_idx","varlog_text"],"lin.proc":["procs_local_time","procs_type","evt_text","procs_value","evt_date_str","obs_size","procs_date_str"],"lin.memutil":["memif_swpused","evt_text","memif_memused","memif_date_str","memif_kbbuffers","evt_date_str","memif_kbswpcad","memif_kbmemused","memif_kbmemfree","obs_size","memif_kbcached","memif_kbswpfree","memif_kbswpused"],"lsofnm":["lsofp_command","lsofp_typ","lsofp_pid","obs_size","lsofp_date_str","lsofp_fd","evt_date_str","lsofp_user","lsofp_size_off","lsofp_node","lsofp_device","lsofp_name","lsofp_type"],"lin.cswch":["cswch_value","evt_text","evt_date_str","cswchs_date_str","obs_size","loc_time","cswchs_type"],"lin.sck":["evt_date_str","sck_loc_time","sck_ip_rag","sck_totsk","sck_rowsk","evt_text","sck_type","sck_tcpsk","sck_udpsk","obs_size","sck_date_str"],"lin.prold":["evt_text","prold_loc_time","prold_plist_sz","prold_type","prold_date_str","evt_date_str","prold_ldavg_tre","prold_ruq_sz","prold_ldavg_one","prold_ldavg_two","obs_size"],"apcl":["apc_http_resno","apc_source","apc_sev_idx","evt_text","apc_http_ver","obs_size","apc_type","apc_restime","apc_byte_ret","apc_date_str","apc_req_type","apc_ipaddr","apc_severity","apc_label","apc_resource","apc_apc","apc_cust","evt_date_str"],"lin.inode":["isb_dq_sz","evt_date_str","isb_fz","isb_rtsig","obs_size","isb_time","isb_type","isb_per_dq_sz","isb_per_rtsig","isb_date_str","isb_per_sup_sz","isb_sup_sz","isb_den","isb_in_sz","evt_text"]},"event_columns":{"varlog_sev_idx":{"dataType":"INTEGER","label":"Var log Index"},"df_date_str":{"dataType":"STRING","label":"DF Obs Time"},"dskstat_num_sec_w":{"dataType":"REAL","label":"DiskStat num sector w"},"psax_date_str":{"dataType":"STRING","label":"ps ax Obs Date"},"free_swp_used":{"dataType":"INTEGER","label":"Swap memory used"},"dskstat_num_rd_issued":{"dataType":"REAL","label":"DiskStat num rd issued"},"memif_date_str":{"dataType":"STRING","label":"Memory Information"},"msr_type":{"dataType":"STRING","label":"Memory Statistics Type"},"nfr_loc_time":{"dataType":"STRING","label":"Time of network dev failures"},"dskstat_num_io_cur_prog":{"dataType":"REAL","label":"DiskStat num io cur_prog"},"apc_ipaddr":{"dataType":"STRING","label":"Apache Access Log IP"},"dskstat_num_w_cmplt":{"dataType":"REAL","label":"DiskStat num w cmplt"},"dwp_bwt":{"dataType":"REAL","label":"Dt write to dev in blks per sec"},"apacheerr_apacheerr":{"dataType":"INTEGER","label":"Apache Error Grouping"},"df_avail":{"dataType":"INTEGER","label":"Df  Avail"},"lsofp_command":{"dataType":"STRING","label":"LSOF COMMAND"},"top_stoped_task":{"dataType":"INTEGER","label":"System Stoped Tasks"},"apacheerr_label":{"dataType":"STRING","label":"Apache Error Label"},"varlog_varlog":{"dataType":"INTEGER","label":"Var log Grouping"},"swp_pswpout":{"dataType":"REAL","label":"Swap pages brought out per sec"},"prold_loc_time":{"dataType":"STRING","label":"Processes Obs Time"},"top_uptime":{"dataType":"REAL","label":"System uptime"},"apc_apc":{"dataType":"INTEGER","label":"Apache Access Grouping"},"top_lctm":{"dataType":"STRING","label":"Top Observation Time"},"nfr_rxdrop":{"dataType":"REAL","label":"Received pkts dropped per sec"},"apc_source":{"dataType":"STRING","label":"Apache Access Source"},"nfr_coll":{"dataType":"REAL","label":"Collisions per sec while trans"},"psax_pid":{"dataType":"INTEGER","label":"process ID "},"cswchs_date_str":{"dataType":"STRING","label":"Context Switch Time"},"df_filesystem":{"dataType":"STRING","label":"Df  Filesystem"},"prold_date_str":{"dataType":"STRING","label":"Queue Length & Load Avg"},"memif_memused":{"dataType":"REAL","label":"Percentage memused"},"nfr_txdrop":{"dataType":"REAL","label":"Transmitted pkts dropped per sec"},"memif_kbmemused":{"dataType":"INTEGER","label":"Used memory KB"},"free_mem_buffers":{"dataType":"INTEGER","label":"Memory used by buffers"},"apc_req_type":{"dataType":"STRING","label":"Apache Access Log Request type"},"isb_date_str":{"dataType":"STRING","label":"Inode File & Kernel Tables"},"psax_stat":{"dataType":"STRING","label":"Process state"},"free_mem_free":{"dataType":"INTEGER","label":"Memory not in use"},"dskstat_num_w_mrgd":{"dataType":"REAL","label":"DiskStat num w mrgd"},"intrp_type":{"dataType":"STRING","label":"Interrupt Type"},"dskstat_date_str":{"dataType":"STRING","label":"DSKSTAT Observation Time"},"top_res":{"dataType":"STRING","label":"TOP RESIDENT"},"apacheerr_type":{"dataType":"STRING","label":"Apache Error Type"},"df_used":{"dataType":"INTEGER","label":"Df  Used"},"procs_date_str":{"dataType":"STRING","label":"Proc per Sec Time Observation"},"dwp_rtps":{"dataType":"REAL","label":"Rd req per sec issued to phy dev"},"lsofp_date_str":{"dataType":"STRING","label":"LSOF Obs Time"},"apacheerr_date_str":{"dataType":"STRING","label":"Apache Error Obs Time"},"isb_den":{"dataType":"INTEGER","label":"Unused cache entries"},"memif_kbswpused":{"dataType":"INTEGER","label":"Used swap KB"},"dskstat_major_num":{"dataType":"INTEGER","label":"DiskStat major num"},"apc_restime":{"dataType":"INTEGER","label":"Time to Respond"},"dwp_tps":{"dataType":"REAL","label":"I/O req to physical dev per sec"},"psax_command":{"dataType":"STRING","label":"Cmd with all its args"},"evt_date_str":{"dataType":"DATE","label":"Date"},"isb_dq_sz":{"dataType":"INTEGER","label":"Num of alloc dsk quota entries"},"nfr_type":{"dataType":"STRING","label":"Network Failure Type"},"isb_in_sz":{"dataType":"INTEGER","label":"Num of used inode handlers"},"dwp_tm":{"dataType":"STRING","label":"IO Tran Obs Time"},"memif_kbcached":{"dataType":"INTEGER","label":"Kernel used cache KB"},"frmpg":{"dataType":"REAL","label":"mem pgs freed by sys per sec"},"top_s":{"dataType":"STRING","label":"TOP STATE"},"apacheerr_source":{"dataType":"STRING","label":"Apache Error Source"},"apacheerr_severity":{"dataType":"STRING","label":"Apache Error Severity"},"prold_ldavg_two":{"dataType":"REAL","label":"Sys load avg for past 5 mins"},"sck_rowsk":{"dataType":"INTEGER","label":"Num of RAW socks cur in use"},"apc_resource":{"dataType":"STRING","label":"Apache Access Log Resource req"},"varlog__msg_source":{"dataType":"STRING","label":"Syslog Message Source"},"lsofp_name":{"dataType":"STRING","label":"LSOF NAME"},"apc_cust":{"dataType":"STRING","label":"Apache Access Log Cust"},"nfr_date_str":{"dataType":"STRING","label":"Network Failure Report"},"dskstat_minor_num":{"dataType":"INTEGER","label":"DiskStat minor num"},"psr_pgpgis":{"dataType":"REAL","label":"sys pgd in from disk per sec KB"},"msr_loc_time":{"dataType":"STRING","label":"Local Time Report mem stats"},"varlog_severity":{"dataType":"STRING","label":"Var log Severity"},"free_date_str":{"dataType":"STRING","label":"Free Command Obs Time"},"memif_kbbuffers":{"dataType":"INTEGER","label":"Kernel used buffers KB"},"top_vitr":{"dataType":"STRING","label":"TOP VIRT"},"intrp_value":{"dataType":"REAL","label":"Interrupts per sec"},"memif_swpused":{"dataType":"REAL","label":"Percentage used swap KB"},"sck_ip_rag":{"dataType":"INTEGER","label":"Num of IP fragments cur in use"},"top_per_mem":{"dataType":"REAL","label":"TOP Perc MEMORY"},"top_tot_task":{"dataType":"INTEGER","label":"Total System Tasks"},"apc_http_ver":{"dataType":"STRING","label":"Apache Access Log HTTP version"},"memif_kbmemfree":{"dataType":"INTEGER","label":"Free memory KB"},"nfr_rxerr":{"dataType":"REAL","label":"Bad packets received per sec"},"dskstat_num_sec_rd":{"dataType":"REAL","label":"DiskStat num sectors rd"},"tops_type":{"dataType":"STRING","label":"Top System Type"},"apc_byte_ret":{"dataType":"REAL","label":"Apache Access Log Bytes returned"},"apc_date_str":{"dataType":"STRING","label":"Apache Access Log Time stamp"},"top_ld_three_min_avg":{"dataType":"REAL","label":"Load avg on sys at 15 min int"},"varlog_type":{"dataType":"STRING","label":"Var log Type"},"dskstat_num_rd_millisec":{"dataType":"REAL","label":"DiskStat num rd millisec"},"lsofp_fd":{"dataType":"STRING","label":"LSOF FD"},"free_swp_total":{"dataType":"INTEGER","label":"Total swap memory"},"stat_sys":{"dataType":"REAL","label":"Percentage system Utilization"},"cswch_value":{"dataType":"REAL","label":"context switches per sec"},"df_mounted_on":{"dataType":"STRING","label":"Df  Mounted On"},"nfr_rxfifo":{"dataType":"REAL","label":"FIFO errors per sec on rec pkt"},"lsofp_node":{"dataType":"INTEGER","label":"LSOF NODE"},"top_pid":{"dataType":"INTEGER","label":"TOP PID"},"psax_time":{"dataType":"STRING","label":"Cumulative CPU time"},"df_size":{"dataType":"INTEGER","label":"Df  Size"},"dskstat_num_w_millisec":{"dataType":"REAL","label":"DiskStat num w  millisec"},"bufpg":{"dataType":"REAL","label":"mem pgs used as buffers per sec"},"stat_nice":{"dataType":"REAL","label":"User with nice Priority"},"procs_value":{"dataType":"REAL","label":"Num of procs created per sec"},"top_ni":{"dataType":"STRING","label":"TOP NICE"},"free_mem_cached":{"dataType":"INTEGER","label":"Memory used by cache"},"nfr_iface":{"dataType":"STRING","label":"Network interface"},"tops_date_str":{"dataType":"STRING","label":"Top System Date"},"dwp_wtps":{"dataType":"REAL","label":"Wr req per sec issued to phy dev"},"intrp_date_str":{"dataType":"STRING","label":"Interrupt Obs Time"},"top_command":{"dataType":"STRING","label":"TOP COMMAND"},"obs_size":{"dataType":"STRING","label":"Bundle Size"},"top_per_cpu":{"dataType":"REAL","label":"TOP Perc CPU"},"dskstat_type":{"dataType":"STRING","label":"DSKSTAT Type"},"lsofp_type":{"dataType":"STRING","label":"LOSF Type"},"top_pr":{"dataType":"STRING","label":"TOP PRIORITY"},"dskstat_dev_name":{"dataType":"STRING","label":"DiskStat dev name"},"isb_fz":{"dataType":"INTEGER","label":"Num of used file handles"},"procs_type":{"dataType":"STRING","label":"Proc per Sec Type"},"apacheerr_err_infotype":{"dataType":"STRING","label":"Apache Error type"},"lsofp_pid":{"dataType":"INTEGER","label":"LSOF PID"},"evt_text":{"dataType":"STRING","label":"Event Text"},"free_mem_total":{"dataType":"INTEGER","label":"Total (physical) RAM"},"psax_tty":{"dataType":"STRING","label":"Terminal"},"isb_per_dq_sz":{"dataType":"REAL","label":"Perc alloc dsk quota entries"},"cptop_date_str":{"dataType":"STRING","label":"Top Obs Date"},"apacheerr_err_msg":{"dataType":"STRING","label":"Apache Error message"},"free_bufcac_free":{"dataType":"INTEGER","label":"Free mem inc buffers and cache"},"isb_time":{"dataType":"STRING","label":"Local time of observation"},"isb_rtsig":{"dataType":"INTEGER","label":"Number queued RT signals"},"stat_cpu":{"dataType":"STRING","label":"CPU Under Observation"},"top_no_users":{"dataType":"INTEGER","label":"Number of users"},"top_running_task":{"dataType":"INTEGER","label":"System Running Tasks"},"free_mem_shared":{"dataType":"INTEGER","label":"Mem usage for sp purposes"},"dskstat_num_io_millisec":{"dataType":"REAL","label":"DiskStat num io millisec"},"prold_ldavg_tre":{"dataType":"REAL","label":"Sys load avg for past 15 mins"},"loc_time":{"dataType":"STRING","label":"Local Cswcs Time"},"nfr_txfifo":{"dataType":"REAL","label":"FIFO errors per sec on trans pkt"},"sck_type":{"dataType":"STRING","label":"Sockets in use Type"},"dwp_brd":{"dataType":"REAL","label":"Data read fr dev in blks per sec"},"stat_iowait":{"dataType":"REAL","label":"Percentage of iowait"},"memif_kbswpfree":{"dataType":"INTEGER","label":"Free swap KB"},"dskstat_num_rd_mrgd":{"dataType":"REAL","label":"DiskStat num rd mrgd"},"swp_time":{"dataType":"STRING","label":"Obs time for swap pages"},"prold_ldavg_one":{"dataType":"REAL","label":"Sys load avg for last minute"},"sck_loc_time":{"dataType":"STRING","label":"Socket observation time"},"dskstat_num_io_millisec_wgh":{"dataType":"REAL","label":"DiskStat num io millisec weigh"},"prold_type":{"dataType":"STRING","label":"Q Length & Load Avg Type"},"swp_type":{"dataType":"STRING","label":"Swapping Type"},"isb_sup_sz":{"dataType":"INTEGER","label":"super blk handlers allocated"},"free_mem_used":{"dataType":"INTEGER","label":"Memory in use by the OS"},"apc_http_resno":{"dataType":"STRING","label":"Apache Access Log HTTP res num"},"memif_kbswpcad":{"dataType":"INTEGER","label":"Used swap cache KB"},"free_bufcac_used":{"dataType":"INTEGER","label":"Mem used by application-buffers"},"campg":{"dataType":"REAL","label":"mem pgs cached by sys per sec"},"varlog_host":{"dataType":"STRING","label":"Syslog Host"},"apc_type":{"dataType":"STRING","label":"Apache Access Type"},"sck_totsk":{"dataType":"INTEGER","label":"Total number of used sockets"},"prold_plist_sz":{"dataType":"INTEGER","label":"proc & threads in proc list"},"prold_ruq_sz":{"dataType":"INTEGER","label":"procs waiting for run time"},"swp_pswpin":{"dataType":"REAL","label":"Swap pages brought in per sec"},"varlog_label":{"dataType":"STRING","label":"Var log Label"},"dwp_type":{"dataType":"STRING","label":"I/O & Transfer Rate Type"},"psr_date_strtwo":{"dataType":"STRING","label":"Paging Reporti Date"},"free_swp_free":{"dataType":"INTEGER","label":"Swap memory free"},"psr_majflt":{"dataType":"REAL","label":"Maj faults by sys per sec"},"free_type":{"dataType":"STRING","label":"Free Type"},"apacheerr_sev_idx":{"dataType":"INTEGER","label":"Apache Error Index"},"sck_udpsk":{"dataType":"INTEGER","label":"Num of UDP socks cur in use"},"nfr_txerr":{"dataType":"REAL","label":"Errors per sec while trans pkts"},"apc_sev_idx":{"dataType":"INTEGER","label":"Apache Access Index"},"isb_per_rtsig":{"dataType":"REAL","label":"Perc of queued RT signals"},"nfr_rxfram":{"dataType":"REAL","label":"Frame alignment errors per sec"},"apacheerr_err_time":{"dataType":"STRING","label":"Apache Error time"},"top_ld_two_min_avg":{"dataType":"REAL","label":"Load avg on sys at 5 min int"},"stat_date_str":{"dataType":"STRING","label":"CPU Utilisation Date"},"swp_date_str":{"dataType":"STRING","label":"Swapping Statistics"},"varlog_date_str":{"dataType":"STRING","label":"Var log Obs Date"},"top_sleeping_task":{"dataType":"INTEGER","label":"System Sleeping Tasks"},"stat_steal":{"dataType":"REAL","label":"Percentage of steal"},"msr_date_str":{"dataType":"STRING","label":"Memory Statistics Report"},"top_loc_tm":{"dataType":"STRING","label":"TOP TIME"},"stat_idle":{"dataType":"REAL","label":"Percentage of idle"},"psr_fault":{"dataType":"REAL","label":"Page fault by sys per sec"},"procs_local_time":{"dataType":"STRING","label":"Local Proc Time"},"cswchs_type":{"dataType":"STRING","label":"Context Switch Type"},"dskstat_key":{"dataType":"STRING","label":"DiskStat Key"},"loc_tm":{"dataType":"STRING","label":"Local Time for INTR per sec"},"sck_tcpsk":{"dataType":"INTEGER","label":"Num of TCP socks cur in use"},"dwp_date_str":{"dataType":"STRING","label":"I/O & Transfer Rate Stats"},"lsofp_typ":{"dataType":"STRING","label":"LSOF TYPE"},"top_ld_one_min_avg":{"dataType":"REAL","label":"Load avg on sys at 1 min int"},"lsofp_user":{"dataType":"STRING","label":"LSOF USER"},"varlog_time":{"dataType":"STRING","label":"Syslog Local time"},"top_shr":{"dataType":"STRING","label":"TOP SHARED"},"lsofp_size_off":{"dataType":"STRING","label":"LSOF SIZE/OFF"},"stat_user":{"dataType":"REAL","label":"Percentage User Utilization"},"df_use":{"dataType":"INTEGER","label":"Df  Used perc"},"psr_pgpgout":{"dataType":"REAL","label":"sys pgd out to disk per sec KB"},"top_user":{"dataType":"STRING","label":"TOP USER"},"nfr_txcarr":{"dataType":"REAL","label":"Carrier-errors per sec"},"df_type":{"dataType":"STRING","label":"DF Type"},"top_zombie_task":{"dataType":"INTEGER","label":"System Zombie Tasks"},"isb_type":{"dataType":"STRING","label":"Inode File & Kernel Type"},"psr_loc_time":{"dataType":"STRING","label":"Local time of paging stats"},"lsofp_device":{"dataType":"STRING","label":"LSOF DEVICE"},"isb_per_sup_sz":{"dataType":"REAL","label":"perc super blk hndlrs alloc"},"varlog_source":{"dataType":"STRING","label":"Var log Source"},"apc_label":{"dataType":"STRING","label":"Apache Access Label"},"psr_type":{"dataType":"STRING","label":"Paging Report Type"},"varlog_text":{"dataType":"STRING","label":"Var log Text"},"apc_severity":{"dataType":"STRING","label":"Apache Access Severity"},"varlog_message":{"dataType":"STRING","label":"Syslog Message"},"sck_date_str":{"dataType":"STRING","label":"Sockets in use"}},"sections_content":{"procdskstatinfonm":{"nsType":"EVENT","name":"procdskstatinfonm","description":"Diskstat from Proc"},"lin.msr":{"nsType":"EVENT","name":"lin.msr","description":"Memory Status Report"},"unparsed":{"nsType":"UNPARSED","name":"unparsed","description":"Unpared Data"},"lin.swpag":{"nsType":"EVENT","name":"lin.swpag","description":"Num of swap pages taken in or out per sec"},"lin.cpuinfo":{"nsType":"EVENT","name":"lin.cpuinfo","description":"CPU Utilization"},"apacheerr":{"nsType":"EVENT","name":"apacheerr","description":"Apache Error Log"},"lin.intrp":{"nsType":"EVENT","name":"lin.intrp","description":"Interrupts Per Second"},"proccpuinfo":{"nsType":"REGULAR","name":"proccpuinfo","description":"CPU info from proc"},"lin.netfailrep":{"nsType":"EVENT","name":"lin.netfailrep","description":"Stats on failures from the N/W dev."},"lin.df":{"nsType":"EVENT","name":"lin.df","description":"FileSystem Disk Space Usage"},"unparsed_data":"Unparsed Data","lin.apcversion":{"nsType":"REGULAR","name":"lin.apcversion","description":"Apache Version"},"lin.dwps":{"nsType":"EVENT","name":"lin.dwps","description":"Num of Read and Write req and blocks per sec"},"lin.psr":{"nsType":"EVENT","name":"lin.psr","description":"Paging Statistics Report"},"cputop":{"nsType":"EVENT","name":"cputop","description":"Top Command Process Info"},"psax":{"nsType":"EVENT","name":"psax","description":"PROCESS(ps ax) DATA"},"lin.freecmd":{"nsType":"EVENT","name":"lin.freecmd","description":"Linux Free Command"},"lin.mount":{"nsType":"REGULAR","name":"lin.mount","description":"FileSystem Mount Information"},"varlogmsg":{"nsType":"EVENT","name":"varlogmsg","description":"Var Log Messages"},"lin.procmeminfo":{"nsType":"REGULAR","name":"lin.procmeminfo","description":"Mem info from proc"},"lin":{"nsType":"SYS","name":"lin","description":"Linux Logs"},"lin.proc":{"nsType":"EVENT","name":"lin.proc","description":"Processes Created per Second"},"lin.memutil":{"nsType":"EVENT","name":"lin.memutil","description":"Memory and swap space utilization statistics"},"lsofnm":{"nsType":"EVENT","name":"lsofnm","description":"Open Files Information"},"lin.cswch":{"nsType":"EVENT","name":"lin.cswch","description":"Context Switches per Second"},"lin.sck":{"nsType":"EVENT","name":"lin.sck","description":"Total number of sockets and its breakup"},"lin.mysqlver":{"nsType":"REGULAR","name":"lin.mysqlver","description":"Mysql Version"},"lin.prold":{"nsType":"EVENT","name":"lin.prold","description":"Processes-Q len,tot num,avg load in 15 mins"},"apcl":{"nsType":"EVENT","name":"apcl","description":"Apache Access log"},"slabinfonmversion":{"nsType":"REGULAR","name":"slabinfonmversion","description":"Slabinfo Version"},"lin.inode":{"nsType":"EVENT","name":"lin.inode","description":"Number of inode, file and super block used"}},"config":{"instance_display":{"sys_display_name":"Host Name"},"NGS_CUST":"1","main_file":"GB_linux.log","fields":{"sys_display_name":"Host Name"},"DEFAULT_DAYS":0,"DEFAULT_VIEW":"EVENT","file_diff_key":"sys_display_name"},"ec_sysid_map":{"sysid":"sys_hwaddr","ec":"glass"}}});
		$httpBackend.expect("POST", infoserverDomain + '/user_tracking/undefined/undefined/undefined/application/module/activity', {
			details : "details"
		}).respond({"Status":"Success","Msg":"","Data":""});
		
		//$httpBackend.whenGET('/gb/ui/prod/log_data.cgi?activity=activity&application=application&details=details&module=module').respond(1);
		//$httpBackend.whenGET('/gb/ui/prod/search/saved_filters.cgi?request_type=GET_ALL_USERS').respond([["1", "uitest", "Vinayaka", "Patil"], ["2", "ritesh", "Ritesh", "Dobhal"], ["3", "rekha", "Rekha", "QA"]]);
		$httpBackend.expect("POST", infoserverDomain + '/user_tracking/undefined/undefined/undefined/application/module/activity', {
			details : "details"
		}).respond({"Status":"Success","Msg":"","Data":""});
		// var date = new Date();
		// var fdate = new Date();
		// fdate.setFullYear(fdate.getFullYear() - 10);
		var fdatestr = "2005-3-12T22:45:23Z";
		var tdatestr = "2005-3-12T22:45:23Z";
		var params = '{"method":"landing","type":"data","start":0,"rows":10,"cl_timezone":0,"facets":{"obs_url":[],"sys_display_name":[],"sys_hwaddr":[],"obs_date_str":[],"sys_timezone":[],"apc_ipaddr":[],"evt_date_str":[]},"start_date":"' + fdatestr + '","end_date":"' + tdatestr + '","sort_order":"desc","quick_filter_name":""}';
		//$httpBackend.whenGET('/gb/ui/prod/search/api.cgi?' + params).respond(500);	
		// $httpBackend.expect("POST", infoserverDomain + '/user_tracking/undefined/undefined/undefined/application/module/activity', {
			// details : "details"
		// }).respond({"Status":"Success","Msg":"","Data":""});
		/*$httpBackend.whenGET('/gb/ui/prod/search/saved_filters.cgi?app_name=logvault&request_type=GET_DEFAULT_FILTER_INFO').respond(500, {
			"out_of_box_search" : "10",
			"default_filter_type" : "outofboxsearch",
			"default_filter_status" : "off"
		});
		$httpBackend.flush();*/
	}));

	it('Should have getAllConfig', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema, application, module, activity) {
		var $scope = $rootScope.$new();
        $controller('LogVaultCtrl', {
            '$scope' : $scope
        });
		var global = jasmine.getGlobal();
		global.reloadGraph = function(data) {
			
		};

        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
		spyOn(global,'reloadGraph');
		spyOn($scope, 'loadDefaultFilter');
		var retDate = new Date(Date.UTC(2015, 2, 12, 22, 45, 23, 45));
		spyOn($scope, "paginator");
		spyOn($scope, "setFromTo");
		jasmine.clock().mockDate(retDate);
		$scope.tableParams.settings().$scope = $scope;
		$httpBackend.expectGET(infoserverDomain + '/uimeta/config/undefined/undefined/undefined').respond(
			{"Status":"Success","Msg":"Config entries requested",
			"Data":{"facet_label_map":[{"namespace":"Section Name"},{"sysid":"Serial Number"},{"ticket_num":"Ticket Number"},{"cust_name":"Account Name"},{"sys_version":"Version"},{"sys_model":"System Model"},{"obs_ts":""},{"obs_url":"Bundle URL"},{"severity":"Event Severity"},{"evt_type":"Event Type"},{"evt_epoch":""},{"uploaded_by":"user"},{"evt_date_str":"Event Date"},{"obs_date_str":"System Time"}],"sections_content":{"mc.mldcnt":{"nsType":"SECTION","name":"mc.mldcnt","description":"Show ipv6 mld counters"},"mc.webstat":{"nsType":"SECTION","name":"mc.webstat","description":"Show web-cc stats"},"mc.dotxmacauth":{"nsType":"SECTION","name":"mc.dotxmacauth","description":"Show dot1x machine-auth-cache"},"mc.dpuseripv":{"nsType":"SECTION","name":"mc.dpuseripv","description":"Show datapath user ipv6"},"mc.apdblong":{"nsType":"SECTION","name":"mc.apdblong","description":"Show ap database long"},"mc.proferr":{"nsType":"SECTION","name":"mc.proferr","description":"Show profile-errors"},"mc.masterlocalstat":{"nsType":"SECTION","name":"mc.masterlocalstat","description":"Show master-local stats"},"mc.vpdnpptp":{"nsType":"SECTION","name":"mc.vpdnpptp","description":"Show vpdn pptp configuration"},"mc.muxstate":{"nsType":"SECTION","name":"mc.muxstate","description":"Show mux state"},"mc.cryptoisakmp":{"nsType":"SECTION","name":"mc.cryptoisakmp","description":"Show crypto isakmp stats"},"mc.uplnk":{"nsType":"SECTION","name":"mc.uplnk","description":"Show uplink"},"mc.tun12tp":{"nsType":"SECTION","name":"mc.tun12tp","description":"Show vpdn tunnel l2tp / L2TP Tunnel Information"},"mc.firewallcp":{"nsType":"SECTION","name":"mc.firewallcp","description":"Show firewall-cp"},"mc.portlinkevent":{"nsType":"SECTION","name":"mc.portlinkevent","description":"Show port link-event"},"mc.dpvlantableflag":{"nsType":"SECTION","name":"mc.dpvlantableflag","description":"Show datapath vlan table"},"mc.apimgver":{"nsType":"SECTION","name":"mc.apimgver","description":"Show ap image version"},"mc.ocspresp":{"nsType":"SECTION","name":"mc.ocspresp","description":"Show crypto-local pki OCSPResponderCert"},"mc.apvlanuse":{"nsType":"SECTION","name":"mc.apvlanuse","description":"Show ap vlan-usage"},"mc.snmp":{"nsType":"SECTION","name":"mc.snmp","description":"Show snmp inform stats"},"mc.iapdetail":{"nsType":"SECTION","name":"mc.iapdetail","description":"Show iap detailed-table"},"mc.wmssys":{"nsType":"SECTION","name":"mc.wmssys","description":"Show wms system"},"mc.airactdomain":{"nsType":"SECTION","name":"mc.airactdomain","description":"Show airgroup active-domains"},"mc.aircppmgrp":{"nsType":"SECTION","name":"mc.aircppmgrp","description":"Show airgroup cppm server-group"},"mc.syslocation":{"nsType":"SECTION","name":"mc.syslocation","description":"Show syslocation"},"mc.showconfdif":{"nsType":"SECTION","name":"mc.showconfdif","description":"Show configuration diff"},"mc.igmpproxi":{"nsType":"SECTION","name":"mc.igmpproxi","description":"Show ip igmp proxy-stats"},"mc.ucccli":{"nsType":"SECTION","name":"mc.ucccli","description":"Show ucc statistics counter call client"},"mc.dpipmcastdest":{"nsType":"SECTION","name":"mc.dpipmcastdest","description":"Show datapath ip-mcast destination"},"mc.dotxsuppinfoliall":{"nsType":"SECTION","name":"mc.dotxsuppinfoliall","description":"Show dot1x supplicant-info statistics"},"mc.wmscount":{"nsType":"SECTION","name":"mc.wmscount","description":"Show wms counters"},"mc.apptrafficlync":{"nsType":"SECTION","name":"mc.apptrafficlync","description":"show app lync traffic-control"},"mc.audit":{"nsType":"SECTION","name":"mc.audit","description":"Show audit-trail"},"mc.dpappctr":{"nsType":"SECTION","name":"mc.dpappctr","description":"Show datapath application counters"},"mc.muxcng":{"nsType":"SECTION","name":"mc.muxcng","description":"Show mux config"},"mc.dpiprectr":{"nsType":"SECTION","name":"mc.dpiprectr","description":"Show datapath ip-reassembly counters"},"mc.inventory":{"nsType":"SECTION","name":"mc.inventory","description":"Show inventory"},"mc.airblkqry":{"nsType":"SECTION","name":"mc.airblkqry","description":"Show airgroup blocked-queries"},"mc.licserverredn":{"nsType":"SECTION","name":"mc.licserverredn","description":"Show license server-redundancy"},"mc.memory":{"nsType":"SECTION","name":"mc.memory","description":"Show memory"},"mc.dpdbugeap":{"nsType":"SECTION","name":"mc.dpdbugeap","description":"Show datapath debug eap counters"},"mc.nwprintstatus":{"nsType":"SECTION","name":"mc.nwprintstatus","description":"Show network-printer status"},"mc.dtsesscount":{"nsType":"SECTION","name":"mc.dtsesscount","description":"Show datapath session counters"},"mc.whitedbcpseq":{"nsType":"SECTION","name":"mc.whitedbcpseq","description":"Show whitelist-db cpsec-seq"},"mc.dpipvmcastdest":{"nsType":"SECTION","name":"mc.dpipvmcastdest","description":"Show datapath ipv6-mcast destination"},"mc.appstatuslync":{"nsType":"SECTION","name":"mc.appstatuslync","description":"show app lync client-status"},"mc.dotxcert":{"nsType":"SECTION","name":"mc.dotxcert","description":"Show dot1x certificates details"},"mc.intervlan":{"nsType":"SECTION","name":"mc.intervlan","description":"Show interface vlan 1"},"mc.boot":{"nsType":"SECTION","name":"mc.boot","description":"Show boot"},"mc.dotxsupinfolist":{"nsType":"SECTION","name":"mc.dotxsupinfolist","description":"Show dot1x supplicant-info list-all"},"mc.airusers":{"nsType":"SECTION","name":"mc.airusers","description":"Show airgroup users"},"mc.dproutecacheipv":{"nsType":"SECTION","name":"mc.dproutecacheipv","description":"Show datapath route-cache ipv6"},"mc.boothistory":{"nsType":"SECTION","name":"mc.boothistory","description":"Show boot history "},"mc.airinter":{"nsType":"SECTION","name":"mc.airinter","description":"Show airgroup internal-state statistics"},"mc.ipigmccount":{"nsType":"SECTION","name":"mc.ipigmccount","description":"Show ip igmp counters"},"mc.errorlogall":{"nsType":"EVENT","name":"mc.errorlogall","description":"Show log errorlog all"},"mc.cryptipsa":{"nsType":"SECTION","name":"mc.cryptipsa","description":"Show crypto ipsec sa"},"mc.voisatcac":{"nsType":"SECTION","name":"mc.voisatcac","description":"Show voice statistics cac"},"mc.wmsgen":{"nsType":"SECTION","name":"mc.wmsgen","description":"Show wms general"},"mc.aaauthldap":{"nsType":"SECTION","name":"mc.aaauthldap","description":"Show aaa authentication-server ldap statistics"},"mc.apdbugcount":{"nsType":"SECTION","name":"mc.apdbugcount","description":"Show ap debug counters"},"mc.aaauthvpncap":{"nsType":"SECTION","name":"mc.aaauthvpncap","description":"Show aaa authentication vpn default-cap"},"mc.crypto":{"nsType":"SECTION","name":"mc.crypto","description":"Show crypto l2tp"},"mc.ipcstatucm":{"nsType":"SECTION","name":"mc.ipcstatucm","description":"Show ipc statistics app-name ucm"},"mc.poe":{"nsType":"SECTION","name":"mc.poe","description":"Show poe"},"mc.dprouteverb":{"nsType":"SECTION","name":"mc.dprouteverb","description":"Show datapath route verbose"},"mc.ipvneigh":{"nsType":"SECTION","name":"mc.ipvneigh","description":"Show ipv6 neighbors"},"mc.iproute":{"nsType":"SECTION","name":"mc.iproute","description":"Show ip route"},"mc.thlimnoa":{"nsType":"SECTION","name":"mc.thlimnoa","description":"Show threshold-limits no-of-aps"},"mc.swremote":{"nsType":"SECTION","name":"mc.swremote","description":"Show switches remote-node"},"mc.iaplong":{"nsType":"SECTION","name":"mc.iaplong","description":"Show iap table long"},"mc.memoryecc":{"nsType":"SECTION","name":"mc.memoryecc","description":"Show memory ecc"},"mc.vpdnltp":{"nsType":"SECTION","name":"mc.vpdnltp","description":"Show vpdn l2tp configuration"},"mc.usertable":{"nsType":"SECTION","name":"mc.usertable","description":"Show user-table"},"mc.iaptrustbranchdb":{"nsType":"SECTION","name":"mc.iaptrustbranchdb","description":"Show iap trusted-branch-db"},"mc.uccglobal":{"nsType":"SECTION","name":"mc.uccglobal","description":"Show ucc statistics counter call global"},"mc.usertablevere":{"nsType":"SECTION","name":"mc.usertablevere","description":"Show user-table verbose"},"mc.wmmflw":{"nsType":"SECTION","name":"mc.wmmflw","description":"Show ap wmm-flow"},"mc.cpuload":{"nsType":"SECTION","name":"mc.cpuload","description":"Show cpuload"},"mc.ipigmpproxygrp":{"nsType":"SECTION","name":"mc.ipigmpproxygrp","description":"Show ip igmp proxy-group"},"mc.macaddr":{"nsType":"SECTION","name":"mc.macaddr","description":"Show mac address-table"},"mc.tunnodecfg":{"nsType":"SECTION","name":"mc.tunnodecfg","description":"Show tunneled-node config"},"mc.tpmerror":{"nsType":"SECTION","name":"mc.tpmerror","description":"Show tpm errorlog"},"mc.liceaggregate":{"nsType":"SECTION","name":"mc.liceaggregate","description":"Show license aggregate"},"mc.ipospfnbr":{"nsType":"SECTION","name":"mc.ipospfnbr","description":"Show ip ospf neighbor"},"mc.nwstorstatus":{"nsType":"SECTION","name":"mc.nwstorstatus","description":"Show network-storage status"},"mc.dptunctr":{"nsType":"SECTION","name":"mc.dptunctr","description":"Show datapath tunnel counters"},"mc.aircontroller":{"nsType":"SECTION","name":"mc.aircontroller","description":"Show airgroup multi-controller-table"},"mc.ipmobhat":{"nsType":"SECTION","name":"mc.ipmobhat","description":"Show ip mobile hat"},"mc.loginsessions":{"nsType":"SECTION","name":"mc.loginsessions","description":"Show loginsessions"},"mc.licdebug":{"nsType":"SECTION","name":"mc.licdebug","description":"Show license debug"},"mc.gapdebug":{"nsType":"SECTION","name":"mc.gapdebug","description":"Show gap-debug"},"mc.lice":{"nsType":"SECTION","name":"mc.lice","description":"Show license verbose"},"mc.ipmobbind":{"nsType":"SECTION","name":"mc.ipmobbind","description":"Show ip mobile binding"},"mc.vrrpstatsall":{"nsType":"SECTION","name":"mc.vrrpstatsall","description":"Show vrrp stats all"},"mc.dprouteflag":{"nsType":"SECTION","name":"mc.dprouteflag","description":"Show datapath route-cache verbose"},"mc.lldpstat":{"nsType":"SECTION","name":"mc.lldpstat","description":"Show lldp statistics"},"mc.authtrace":{"nsType":"SECTION","name":"mc.authtrace","description":"Show auth-traceBuf"},"mc.dpvlanmcasttb":{"nsType":"SECTION","name":"mc.dpvlanmcasttb","description":"Show datapath vlan-mcast table"},"mc.ucctrafficlync":{"nsType":"SECTION","name":"mc.ucctrafficlync","description":"Show ucc configuration traffic-control lync"},"mc.ipaclistbr":{"nsType":"SECTION","name":"mc.ipaclistbr","description":"Show ip access-list brief"},"mc.vpndlr":{"nsType":"SECTION","name":"mc.vpndlr","description":"Show vpn-dialer"},"mc.aparmsclihistory":{"nsType":"SECTION","name":"mc.aparmsclihistory","description":"Show ap arm client-match history"},"mc.dpdbugdma":{"nsType":"SECTION","name":"mc.dpdbugdma","description":"Show datapath debug DMA Counters"},"mc.dpmainctr":{"nsType":"SECTION","name":"mc.dpmainctr","description":"Show datapath maintenance counters"},"mc.trunk":{"nsType":"SECTION","name":"mc.trunk","description":"Show trunk"},"mc.vlan":{"nsType":"SECTION","name":"mc.vlan","description":"Show vlan"},"mc.acl":{"nsType":"SECTION","name":"mc.acl","description":"Show acl hits"},"mc.ctrail":{"nsType":"SECTION","name":"mc.ctrail","description":"Show country-trail"},"mc.aircppmser":{"nsType":"SECTION","name":"mc.aircppmser","description":"Show airgroup cppm-server aaa"},"mc.liceusgclient":{"nsType":"SECTION","name":"mc.liceusgclient","description":"Show license-usage client"},"mc.vlanmappimg":{"nsType":"SECTION","name":"mc.vlanmappimg","description":"Show vlan mapping"},"mc.apessid":{"nsType":"SECTION","name":"mc.apessid","description":"Show ap essid"},"mc.igmccon":{"nsType":"SECTION","name":"mc.igmccon","description":"Show ip igmp config"},"mc.dpbridgetb":{"nsType":"SECTION","name":"mc.dpbridgetb","description":"Show datapath bridge table"},"mc.localuserdbap":{"nsType":"SECTION","name":"mc.localuserdbap","description":"Show local-userdb-ap"},"mc.apbsstb":{"nsType":"SECTION","name":"mc.apbsstb","description":"Show ap bss-table"},"mc.dbsync":{"nsType":"SECTION","name":"mc.dbsync","description":"Show database synchronize"},"unparsed":{"nsType":"UNPARSED","name":"unparsed","description":"Unparsed Data"},"mc.aparmstate":{"nsType":"SECTION","name":"mc.aparmstate","description":"Show ap arm state"},"mc.dphwctr":{"nsType":"SECTION","name":"mc.dphwctr","description":"Show datapath hardware counters"},"mc.image":{"nsType":"SECTION","name":"mc.image","description":"Show image Version"},"mc.ipmobglob":{"nsType":"SECTION","name":"mc.ipmobglob","description":"Show ip mobile global"},"mc.mldcon":{"nsType":"SECTION","name":"mc.mldcon","description":"Show ipv6 mld config"},"mc.ipcstatstmlopri":{"nsType":"SECTION","name":"mc.ipcstatstmlopri","description":"Show ipc statistics app-name stm-lopri"},"mc.thlimcpmem":{"nsType":"SECTION","name":"mc.thlimcpmem","description":"Show threshold-limits controlpath-memory"},"mc.dpipmcastrgrp":{"nsType":"SECTION","name":"mc.dpipmcastrgrp","description":"Show datapath ip-mcast group"},"mc.aaauthserall":{"nsType":"SECTION","name":"mc.aaauthserall","description":"Show aaa authentication-server all"},"mc.aaabandwidth":{"nsType":"SECTION","name":"mc.aaabandwidth","description":"Show aaa bandwidth-contracts"},"mc.ipmobdom":{"nsType":"SECTION","name":"mc.ipmobdom","description":"Show ip mobile domain"},"mc.dputil":{"nsType":"SECTION","name":"mc.dputil","description":"Show datapath utilization"},"mc.apdbsummary":{"nsType":"SECTION","name":"mc.apdbsummary","description":"Show ap database-summary"},"mc.ipmobtraffic":{"nsType":"SECTION","name":"mc.ipmobtraffic","description":"Show ip mobile traffic"},"mc.mldint":{"nsType":"SECTION","name":"mc.mldint","description":"Show ipv6 mld interface"},"mc.aparmscliunsupporetd":{"nsType":"SECTION","name":"mc.aparmscliunsupporetd","description":"Show ap arm client-match unsupported"},"mc.dprouteipv":{"nsType":"SECTION","name":"mc.dprouteipv","description":"Show datapath route ipv6"},"mc.dpcrycnt":{"nsType":"SECTION","name":"mc.dpcrycnt","description":"Show datapath Crypto Counters"},"mc.haheartbcount":{"nsType":"SECTION","name":"mc.haheartbcount","description":"Show ha heartbeat counters"},"mc.remoteconf":{"nsType":"SECTION","name":"mc.remoteconf","description":"Show remote-node running-config"},"mc.datasess":{"nsType":"SECTION","name":"mc.datasess","description":"Show datapath session ipv6"},"mc.voiprior":{"nsType":"SECTION","name":"mc.voiprior","description":"Show voice prioritization"},"mc.ipigmpproxymob":{"nsType":"SECTION","name":"mc.ipigmpproxymob","description":"Show ip igmp proxy-mobility-stats"},"mc.country":{"nsType":"SECTION","name":"mc.country","description":"Show country"},"mc.vocllcount":{"nsType":"SECTION","name":"mc.vocllcount","description":"Show voice call-counter"},"mc.vrrp":{"nsType":"SECTION","name":"mc.vrrp","description":"Show vrrp"},"mc.ipcstatstm":{"nsType":"SECTION","name":"mc.ipcstatstm","description":"Show ipc statistics app-name stm"},"mc.aircontrollerv":{"nsType":"SECTION","name":"mc.aircontrollerv","description":"Show airgroup multi-controller-table verbose"},"mc.airstatus":{"nsType":"SECTION","name":"mc.airstatus","description":"Show airgroup status"},"mc.dpnattb":{"nsType":"SECTION","name":"mc.dpnattb","description":"Show datapath nat table"},"mc.apactive":{"nsType":"SECTION","name":"mc.apactive","description":"Show ap active"},"mc.aaaauthvpn":{"nsType":"SECTION","name":"mc.aaaauthvpn","description":"Show aaa authentication vpn default-rap"},"mc.apspectmon":{"nsType":"SECTION","name":"mc.apspectmon","description":"Show ap spectrum monitors"},"mc.dpttable":{"nsType":"SECTION","name":"mc.dpttable","description":"Show datapath tunnel table"},"mc.netstattech":{"nsType":"SECTION","name":"mc.netstattech","description":"Show netstat"},"mc.vpdnpptplocal":{"nsType":"SECTION","name":"mc.vpdnpptplocal","description":"Show vpdn pptp local pool"},"mc.dpuserctr":{"nsType":"SECTION","name":"mc.dpuserctr","description":"Show datapath user counters"},"mc.aircache":{"nsType":"SECTION","name":"mc.aircache","description":"Show airgroup cache entries"},"mc.allkey":{"nsType":"SECTION","name":"mc.allkey","description":"Show keys all"},"mc.aaauthcaptive":{"nsType":"SECTION","name":"mc.aaauthcaptive","description":"Show aaa authentication captive-portal customization"},"mc.aaauthvpn":{"nsType":"SECTION","name":"mc.aaauthvpn","description":"Show aaa authentication vpn"},"mc.dproutectr":{"nsType":"SECTION","name":"mc.dproutectr","description":"Show datapath route counters"},"mc.shrun":{"nsType":"SECTION","name":"mc.shrun","description":"Show Running Config"},"mc.aaauthall":{"nsType":"SECTION","name":"mc.aaauthall","description":"Show aaa authentication all"},"mc.slots":{"nsType":"SECTION","name":"mc.slots","description":"Show slots"},"mc.hagpmembership":{"nsType":"SECTION","name":"mc.hagpmembership","description":"Show ha group-membership"},"mc.aaauthvpndef":{"nsType":"SECTION","name":"mc.aaauthvpndef","description":"Show aaa authentication vpn default"},"mc.dpport":{"nsType":"SECTION","name":"mc.dpport","description":"Show datapath port"},"mc.version":{"nsType":"SECTION","name":"mc.version","description":"Show Version"},"mc.clmatchsumadvanced":{"nsType":"SECTION","name":"mc.clmatchsumadvanced","description":"Show ap arm client-match summary advanced"},"mc.firewall":{"nsType":"SECTION","name":"mc.firewall","description":"Show firewall"},"mc.frwallcpinter":{"nsType":"SECTION","name":"mc.frwallcpinter","description":"Show firewall-cp internal"},"mc.airservers":{"nsType":"SECTION","name":"mc.airservers","description":"Show airgroup servers"},"mc.ipvmldgrp":{"nsType":"SECTION","name":"mc.ipvmldgrp","description":"Show ipv6 mld group"},"mc.dpusrtb":{"nsType":"SECTION","name":"mc.dpusrtb","description":"Show datapath user table"},"mc.intfacelp":{"nsType":"SECTION","name":"mc.intfacelp","description":"Show interface loopback"},"mc.nwstorusers":{"nsType":"SECTION","name":"mc.nwstorusers","description":"Show network-storage users"},"mc.interfacectr":{"nsType":"SECTION","name":"mc.interfacectr","description":"Show interface counters"},"mc.aplicense":{"nsType":"SECTION","name":"mc.aplicense","description":"Show ap license-usage"},"mc.ipsixfirewall":{"nsType":"SECTION","name":"mc.ipsixfirewall","description":"Show ipv6 firewall"},"memlogs.tb":{"nsType":"EVENT","name":"memlogs.tb","description":"Memory Logs"},"mc.tpminfo":{"nsType":"SECTION","name":"mc.tpminfo","description":"Show tpm cert-info"},"mc.liceseheart":{"nsType":"SECTION","name":"mc.liceseheart","description":"Show license heartbeat stats"},"mc.portstatus":{"nsType":"SECTION","name":"mc.portstatus","description":"Show port status"},"mc.iostat":{"nsType":"SECTION","name":"mc.iostat","description":"Show iostat"},"mc.arp":{"nsType":"SECTION","name":"mc.arp","description":"Show arp"},"mc.aaaderule":{"nsType":"SECTION","name":"mc.aaaderule","description":"Show aaa derivation-rules server-group"},"mc.ipvinter":{"nsType":"SECTION","name":"mc.ipvinter","description":"Show ipv6 interface"},"mc.proces":{"nsType":"SECTION","name":"mc.proces","description":"Show processes"},"mc.licesertb":{"nsType":"SECTION","name":"mc.licesertb","description":"Show license server table"},"mc.whitelslocal":{"nsType":"SECTION","name":"mc.whitelslocal","description":"Show whitelist-db cpsec-local-switch-list"},"mc.ocspclient":{"nsType":"SECTION","name":"mc.ocspclient","description":"Show crypto-local pki ocsp-client-stats"},"mc.webdatapth":{"nsType":"SECTION","name":"mc.webdatapth","description":"Show datapath web-cc"},"mc.aircppmqry":{"nsType":"SECTION","name":"mc.aircppmqry","description":"Show airgroup cppm-server query-interval"},"mc.cpuloadcur":{"nsType":"SECTION","name":"mc.cpuloadcur","description":"Show cpuload current"},"mc.audithistory":{"nsType":"SECTION","name":"mc.audithistory","description":"Show audit-trail history"},"mc.sttab":{"nsType":"SECTION","name":"mc.sttab","description":"Show station-table"},"mc.showlogsystem":{"nsType":"EVENT","name":"mc.showlogsystem","description":"Show log system"},"mc.nwprintconfig":{"nsType":"SECTION","name":"mc.nwprintconfig","description":"Show network-printer config"},"mc.cryisakmpkey":{"nsType":"SECTION","name":"mc.cryisakmpkey","description":"Show crypto isakmp key"},"mc.ipcforstat":{"nsType":"SECTION","name":"mc.ipcforstat","description":"Show ipc forwarding-statistics"},"mc.tacacstats":{"nsType":"SECTION","name":"mc.tacacstats","description":"Show aaa authentication-server tacacs statistics"},"mc.ipradiusinter":{"nsType":"SECTION","name":"mc.ipradiusinter","description":"Show ip radius source-interface"},"mc.apassocation":{"nsType":"SECTION","name":"mc.apassocation","description":"Show ap association"},"mc.ipospf":{"nsType":"SECTION","name":"mc.ipospf","description":"Show ip ospf"},"mc":{"nsType":"SECTION","name":"mc","description":"Controller Information"},"mc.spantree":{"nsType":"SECTION","name":"mc.spantree","description":"Show spantree"},"mc.aaastateconf":{"nsType":"SECTION","name":"mc.aaastateconf","description":"Show aaa state configuration"},"mc.switches":{"nsType":"SECTION","name":"mc.switches","description":"Show switches"},"mc.portstats":{"nsType":"SECTION","name":"mc.portstats","description":"Show port stats"},"mc.showlogall":{"nsType":"EVENT","name":"mc.showlogall","description":"Show log all"},"mc.voistatsp":{"nsType":"SECTION","name":"mc.voistatsp","description":"Show voice statistics tspec"},"mc.dpbwmflag":{"nsType":"SECTION","name":"mc.dpbwmflag","description":"Show datapath bwm table"},"mc.dpframe":{"nsType":"SECTION","name":"mc.dpframe","description":"Show datapath frame counters"},"mc.ipigmpgrp":{"nsType":"SECTION","name":"mc.ipigmpgrp","description":"Show ip igmp group"},"mc.whitecpsecsts":{"nsType":"SECTION","name":"mc.whitecpsecsts","description":"Show whitelist-db cpsec-status"},"mc.airusersverb":{"nsType":"SECTION","name":"mc.airusersverb","description":"Show airgroup users verbose"},"mc.ipospfdb":{"nsType":"SECTION","name":"mc.ipospfdb","description":"Show ip ospf database"},"mc.ucccac":{"nsType":"SECTION","name":"mc.ucccac","description":"Show ucc statistics counter cac"},"mc.aaaauthserrstat":{"nsType":"SECTION","name":"mc.aaaauthserrstat","description":"Show aaa authentication-server radius statistics"},"mc.processtat":{"nsType":"SECTION","name":"mc.processtat","description":"Show processes monitor stat"},"mc.ipinterface":{"nsType":"SECTION","name":"mc.ipinterface","description":"Show ip interface brief"},"mc.memdebug":{"nsType":"SECTION","name":"mc.memdebug","description":"Show memory debug"},"mc.airgrpvlan":{"nsType":"SECTION","name":"mc.airgrpvlan","description":"Show airgroup vlan"},"mc.rights":{"nsType":"SECTION","name":"mc.rights","description":"Show rights"},"mc.localuserdb":{"nsType":"SECTION","name":"mc.localuserdb","description":"Show local-userdb"},"mc.ipdhcpdb":{"nsType":"SECTION","name":"mc.ipdhcpdb","description":"Show ip dhcp database"},"mc.whitedbcpsec":{"nsType":"SECTION","name":"mc.whitedbcpsec","description":"Show whitelist-db cpsec"},"mc.dpsesstable":{"nsType":"SECTION","name":"mc.dpsesstable","description":"Show datapath session table/verbose"},"mc.apmeshtopolg":{"nsType":"SECTION","name":"mc.apmeshtopolg","description":"Show ap mesh topology long"},"mc.hagpprofile":{"nsType":"SECTION","name":"mc.hagpprofile","description":"Show ha group-profile"},"mc.dpacl":{"nsType":"SECTION","name":"mc.dpacl","description":"Show datapath acl"},"mc.vocist":{"nsType":"SECTION","name":"mc.vocist","description":"Show voice client-status"},"mc.liceclienttb":{"nsType":"SECTION","name":"mc.liceclienttb","description":"Show license client table"},"mc.whitelsmaster":{"nsType":"SECTION","name":"mc.whitelsmaster","description":"Show whitelist-db cpsec-master-switch-list"},"mc.airblk":{"nsType":"SECTION","name":"mc.airblk","description":"Show airgroup blocked-service-id"},"mc.aircredit":{"nsType":"SECTION","name":"mc.aircredit","description":"Show airgroup global-credits"},"mc.storage":{"nsType":"SECTION","name":"mc.storage","description":"Show Storage"},"mc.dpbridgectr":{"nsType":"SECTION","name":"mc.dpbridgectr","description":"Show datapath bridge counters"},"mc.apmeshactive":{"nsType":"SECTION","name":"mc.apmeshactive","description":"Show ap mesh active"},"mc.dphwstats":{"nsType":"SECTION","name":"mc.dphwstats","description":"Show datapath hardware statistics"},"mc.vpdnlocal":{"nsType":"SECTION","name":"mc.vpdnlocal","description":"Show vpdn l2tp local pool"},"mc.intfacemgmt":{"nsType":"SECTION","name":"mc.intfacemgmt","description":"Show interface mgmt"},"mc.dpdebugtrace":{"nsType":"SECTION","name":"mc.dpdebugtrace","description":"Show datapath debug trace-buffer"},"mc.liceprofile":{"nsType":"SECTION","name":"mc.liceprofile","description":"Show license profile"},"mc.cpsecurity":{"nsType":"SECTION","name":"mc.cpsecurity","description":"Show control-plane-security"},"seclog":{"nsType":"EVENT","name":"seclog","description":"Event Logs"},"mc.cryisakmpsa":{"nsType":"SECTION","name":"mc.cryisakmpsa","description":"Show crypto isakmp sa"},"mc.acltable":{"nsType":"SECTION","name":"mc.acltable","description":"Show acl acl Table"},"mc.dproute":{"nsType":"SECTION","name":"mc.dproute","description":"Show datapath route-cache counters"},"mc.servgrpsummary":{"nsType":"SECTION","name":"mc.servgrpsummary","description":"Show aaa server-group summary"},"mc.dplagtb":{"nsType":"SECTION","name":"mc.dplagtb","description":"Show datapath lag table"},"mc.ipcstatsapm":{"nsType":"SECTION","name":"mc.ipcstatsapm","description":"Show ipc statistics app-name sapm"},"mc.webstatus":{"nsType":"SECTION","name":"mc.webstatus","description":"Show web-cc status"},"mc.dot1xcount":{"nsType":"SECTION","name":"mc.dot1xcount","description":"Show dot1x counters"},"mc.roleinfo":{"nsType":"SECTION","name":"mc.roleinfo","description":"Show roleinfo"},"mc.aaaintstat":{"nsType":"SECTION","name":"mc.aaaintstat","description":"Show aaa authentication-server internal statistics"},"mc.dotxaptable":{"nsType":"SECTION","name":"mc.dotxaptable","description":"Show dot1x ap-table"},"mc.dpipvmcast":{"nsType":"SECTION","name":"mc.dpipvmcast","description":"Show datapath ipv6-mcast group"},"mc.ipdhcpstat":{"nsType":"SECTION","name":"mc.ipdhcpstat","description":"Show ip dhcp statistics"},"mc.dpstation":{"nsType":"SECTION","name":"mc.dpstation","description":"Show datapath station table"},"mc.ipigmpinter":{"nsType":"SECTION","name":"mc.ipigmpinter","description":"Show ip igmp interface"},"mc.ipmobactive":{"nsType":"SECTION","name":"mc.ipmobactive","description":"Show ip mobile active-domains"}},"linked":["ticket_num","cust_name","severity","sys_version","obs_url","obs_date_str"],"event_columns":{"sys_model":{"dataType":"STRING","label":"System Model"},"mem_free":{"dataType":"INTEGER","label":""},"cust_name":{"dataType":"STRING","label":"Account Name"},"mem_process":{"dataType":"STRING","label":""},"obs_date_str_three":{"dataType":"STRING","label":""},"mem_over":{"dataType":"INTEGER","label":""},"sys_version":{"dataType":"STRING","label":"Version"},"ticket_num":{"dataType":"STRING","label":"Ticket Number"},"sysid":{"dataType":"STRING","label":"Serial Number"},"obs_ts":{"dataType":"INTEGER","label":""},"temp124":{"dataType":"STRING","label":""},"evt_cat":{"dataType":"STRING","label":""},"temp_type":{"dataType":"STRING","label":""},"mem_total":{"dataType":"INTEGER","label":""},"sys_version_new":{"dataType":"INTEGER","label":"Version"},"obs_date_str_two":{"dataType":"STRING","label":""},"mem_filename":{"dataType":"STRING","label":""},"mem_date":{"dataType":"STRING","label":""},"evt_epoch":{"dataType":"INTEGER","label":""},"evt_source":{"dataType":"STRING","label":"Event Type"},"reboot_evt_text":{"dataType":"STRING","label":"Event Text"},"evt_label":{"dataType":"STRING","label":"Event Label"},"severity":{"dataType":"STRING","label":"Event Severity"},"evt_id":{"dataType":"STRING","label":"Event Id"},"evt_date_str":{"dataType":"STRING","label":"Event Date"},"evt_type":{"dataType":"STRING","label":"Event Type"},"obs_tsone":{"dataType":"INTEGER","label":""},"evt_month":{"dataType":"STRING","label":""},"evt_year":{"dataType":"STRING","label":""},"evt_num":{"dataType":"STRING","label":"Event Num"},"evt_text":{"dataType":"STRING","label":"Event Text"},"event_year":{"dataType":"STRING","label":""},"mem_overunit":{"dataType":"STRING","label":""}},"ec_sysid_map":{"sysid":"sysid","ec":"ec"},"config":{"MAX_DAY_RANGE_ALLOWED":3000,"DEFAULT_DAYS":3000,"lv_to_exp":true,"instance_display":{},"is_stage_domain":"https://infodemoqa.glassbeam.com/v1","is_stage_keyspace":"aruba_aruba_podui","fields":{"sysid":"Serial Number"},"DEFAULT_VIEW":"SECTION","facet_limit":2000},"file_upload_config":{"allowed_extension":"zip, tar.gz","json_form":"[{\"name\":\"cust_name\",\"label\":\"Customer Name\",\"data\":[], \"type\" : \"text\", \"required\":1}, {\"name\":\"ticket_number\",\"label\":\"Ticket Number\",\"data\":[], \"type\" : \"text\", \"required\": 1}]","max_upload_size":36700160},"default_config":{"MAX_DAY_RANGE_ALLOWED":3000,"DEFAULT_DAYS":2000,"lv_to_exp":true,"instance_display":{},"is_stage_domain":"NA","is_stage_keyspace":"NA","fields":{"sysid":"Serial Number"},"DEFAULT_VIEW":"SECTION","facet_limit":200},"default_file_upload_config":{"allowed_extension":"zip, tar.gz","json_form":"[{\"name\":\"cust_name\",\"label\":\"Customer Name\",\"data\":[], \"type\":\"text\", \"required\":1}, {\"name\":\"ticket_number\",\"label\":\"Ticket Number\",\"data\":[], \"type\":\"text\", \"required\": 1}]","max_upload_size":36700160}}}
			);
		//$httpBackend.expect('GET', infoserverDomain + '/logvault/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"No Data Found","Data":""});
		
		$httpBackend.flush();
		expect($scope.loadDefaultFilter).toHaveBeenCalled();
	}));
	
	it('Should have getAllConfig with error block', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema, application, module, activity) {
		$cookies.nsr_enabled = 1;
		var $scope = $rootScope.$new();

		var global = jasmine.getGlobal();
		global.reloadGraph = function(data) {
			
		};
		spyOn(global,'reloadGraph');

		$controller('LogVaultCtrl', {
			'$scope' : $scope,
		});
		var retDate = new Date(Date.UTC(2015, 2, 12, 22, 45, 23, 45));
		spyOn($scope, "paginator");
		spyOn($scope, "setFromTo");
		jasmine.clock().mockDate(retDate);
		$scope.tableParams.settings().$scope = $scope;
		
		$httpBackend.expectGET(infoserverDomain + '/uimeta/config/undefined/undefined/undefined').respond(500);
		
		$httpBackend.flush();
	}));

	it('Should have loadDefaultFilter else', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema ) {
        var $scope = $rootScope.$new();
        $controller('LogVaultCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/logvault/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: undefined});
        
        $httpBackend.flush();
        
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.loadView).not.toHaveBeenCalled();
    }));
    
    it('Should have loadDefaultFilter error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema ) {
        var $scope = $rootScope.$new();
        $controller('LogVaultCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/logvault/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        
        $httpBackend.flush();
        
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.loadView).not.toHaveBeenCalled();
    }));

    it('Should have loadDashboards block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema ) {
        var $scope = $rootScope.$new();
        $controller('LogVaultCtrl', {
            '$scope' : $scope
        });
                
        expect($scope.loadDashboards).toEqual(jasmine.any(Function));
        $scope.loadDashboards();

        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' +  product + '/' + schema).respond(
        	{"Status":"Success","Msg":"Detailed list of all dashboards","Data":[{"dname":"NSR","ddesc":"Dashboard","d_id":"d349875b-db90-4393-bacd-98f0a4898000","d_type":"NSR","d_link":"NA","reports":[{"rname":"NSR","rdesc":"NSR","r_id":"f6c9875b-db90-4893-bacd-98f0a4d98000","r_link":"https://gbreports.glassbeam.com/ArubaNetworks/rdPage.aspx?rdReport=NSR.NSRDashboard","height":600}]},{"dname":"Customer Index","ddesc":"Dashboard","d_id":"d349877b-db90-4393-bacd-99f0a4898006","d_type":"Summary","d_link":"NA","reports":[{"rname":"Customer Index","rdesc":"Customer Index","r_id":"f6c9877b-db90-4893-bacd-99f0a4d98006","r_link":"https://gbreports.glassbeam.com/Springpath_Prod/rdPage.aspx?rdReport=Customer_Index.Customer_Index","height":1200}]},{"dname":"Cluster details","ddesc":"Dashboard","d_id":"d349877b-db90-4393-bacd-99f0a4898007","d_type":"Internal","d_link":"NA","reports":[{"rname":"Cluster details","rdesc":"16desc@#","r_id":"f6c9877b-db90-4893-bacd-99f0a4d98007","r_link":"https://gbreports.glassbeam.com/Springpath_Prod/rdPage.aspx?rdReport=Cluster_Details.Cluster_Smart_Attribute","height":600}]}]}
        	);

        $httpBackend.flush();

    }));

    it('Should have loadDashboards block with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema ) {
        var $scope = $rootScope.$new();
        $controller('LogVaultCtrl', {
            '$scope' : $scope
        });
                
        expect($scope.loadDashboards).toEqual(jasmine.any(Function));
        $scope.loadDashboards();

        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/dashboards/all/details/' + manufacturer + '/' +  product + '/' + schema).respond(500);

        $httpBackend.flush();

    }));

	it('Should have getValue', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.getValue).toEqual(jasmine.any(Function));
		expect($scope.getValue('char_limit_msg')).toEqual(GlobalService.getVal('char_limit_msg'));
	}));

	it('Should have setFromTo', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.setFromTo).toEqual(jasmine.any(Function));
		var d = new Date();
		var d1 = new Date();
		spyOn($scope.tableParams, "reload");
		$scope.setFromTo(d, d1);
		expect($scope.info.fromDate).toEqual(d);
		expect($scope.info.fromTime.hr).toEqual(d.getHours());
		expect($scope.info.fromTime.min).toEqual(d.getMinutes());
		expect($scope.info.fromTime.sec).toEqual(d.getSeconds());
		expect($scope.info.toDate).toEqual(d1);
		expect($scope.info.toTime.hr).toEqual(d1.getHours());
		expect($scope.info.toTime.min).toEqual(d1.getMinutes());
		expect($scope.info.toTime.sec).toEqual(d1.getSeconds());
		expect($scope.tableParams.reload).toHaveBeenCalled();
	}));

	it('Should have changeQuickFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));

		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('lasthour');

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('today');
		var fromdate = $scope.info.toDate;
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('yesterday');
		//expect($scope.dateRangeFilterName).toEqual('Yesterday');
		fromdate = new Date();
		fromdate.setDate(fromdate.getDate() - 1);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);
		var todate = new Date();
		todate.setDate(todate.getDate() - 1);
		todate.setHours(23);
		todate.setMinutes(59);
		todate.setSeconds(59);

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('thisweek');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(fromdate.getDate() - fromdate.getDay() + 1);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('thismonth');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(1);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('last2days');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(fromdate.getDate() - 2);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('last7days');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(fromdate.getDate() - 7);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('last30days');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(fromdate.getDate() - 30);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		spyOn($scope, "refresh");
		$scope.info = {
			config: {
				DEFAULT_DAYS: 300
			},
			page: {
				current: 2
			},
			fromDate: new Date(),
			toDate: new Date(),
			fromTime: {},
			toTime: {}
		};
		$scope.changeQuickFilter('mostrecent');
		expect($scope.info.quick).toEqual(1);
		
		$scope.info.config.DEFAULT_DAYS = 0;
		$scope.changeQuickFilter('mostrecent');

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		spyOn($scope, "refresh");
		$scope.info = {
			config: {
				DEFAULT_DAYS: 300
			},
			page: {
				current: 2
			},
			fromDate: new Date(),
			toDate: new Date(),
			fromTime: {},
			toTime: {}
		};
		$scope.changeQuickFilter('last5');
		expect($scope.info.quick).toEqual(5);
		
		$scope.info.config.DEFAULT_DAYS = 0;
        $scope.changeQuickFilter('last5');

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		spyOn($scope, "refresh");
		$scope.info = {
			config: {
				DEFAULT_DAYS: 300
			},
			page: {
				current: 2
			},
			fromDate: new Date(),
			toDate: new Date(),
			fromTime: {},
			toTime: {}
		};
		$scope.changeQuickFilter('last10');
		expect($scope.info.quick).toEqual(10);
		
		$scope.info.config.DEFAULT_DAYS = 0;
        $scope.changeQuickFilter('last10');

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.changeQuickFilter('last50');

		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.changeQuickFilter('customdate');
		expect($scope.customDateFilter).toBeTruthy();
		expect($scope.info.quick).toEqual(0);
	}));

	it('Should have getNSRReportURl', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		GlobalService.setVal('nsrParams', {sysid: "selected_system", obs_date: "selected_date", bundle_id: "selected_bundle"});
		
		expect($scope.getNSRReportURl).toEqual(jasmine.any(Function));
		var param = {"sys_model":"Aruba3600","cust_name":"Avnet Logistics, USLP","obs_url":"mahendru2diff.zip","evt_date":"1970-01-01T00:00:00Z","sys_version":"5.0.3.0","ticket_num":"1498514","sysid":"CP0004165","uploaded_by":"","obs_date_str":"Mon Jan 18 11:11:11 2016 +0800","bundle_id":"CP0004165___1453086671000","filename":"mahendru2diff.zip","obs_size":"444491","obs_date":"2016-01-18T03:11:11Z"}
		var result = $scope.info.NSRReportUrl + '&' + 'selected_system=CP0004165&selected_date=2016-01-18 03:11:11&selected_bundle=CP0004165___1453086671000';
		expect($scope.getNSRReportURl(param)).toEqual(result);		
	}));
	
	it('Should have loadBundleData', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.loadBundleData).toEqual(jasmine.any(Function));
		$scope.$parent = {
			changeCurrentPage: function() {
				
			}
		};
		spyOn($scope.$parent, "changeCurrentPage");
		$scope.loadBundleData({});
		expect($scope.$parent.changeCurrentPage).toHaveBeenCalledWith('apps', {});
	}));
	
	it('Should have openNSRInstanceViewer', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.openNSRInstanceViewer).toEqual(jasmine.any(Function));
		spyOn($scope, "addInstance");
		$scope.openNSRInstanceViewer([1,2,3]);
		$scope.info.NSRReportUrl = "unit";
		$scope.openNSRInstanceViewer([1,2,3]);
	}));
	
	it('Should have addInstance', inject(function($rootScope, $controller, $httpBackend, $filter, infoserverDomain, GlobalService, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.addInstance).toEqual(jasmine.any(Function));
		var report = {"rname":"NSR","r_link":"https://gbreports.glassbeam.com/ArubaNetworks/rdPage.aspx?rdReport=NSR.NSRDashboard&selected_system=CP0004165&selected_date=2016-01-19 11:13:13&selected_bundle=CP0004165___1453201993000"};

		$scope.addInstance(report);
		
	}));	
	
	
	it('Should have done', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.done).toEqual(jasmine.any(Function));
		$scope.done();
	}));
	
	it('Should have cancel', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.cancel).toEqual(jasmine.any(Function));
		$scope.cancel();
	}));

	it('Should have paginator', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		
		spyOn($scope, "refresh");
		expect($scope.paginator).toEqual(jasmine.any(Function));
		var count = 50;
		$scope.paginator(count);
		expect($scope.info.page['total']).toEqual(count);
		expect($scope.info.page['pages']).toEqual(Math.ceil($scope.info.page['total'] / $scope.info.page['count']));
		
		$scope.info.page['count'] = 20;
		$scope.info.page['current'] = 12;
		
		$scope.paginator(200);
	}));

	it('Should have nextPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.nextPage).toEqual(jasmine.any(Function));

		$scope.info.page = {"total":"20","current":0,"pages":2,"count":10}
		$scope.nextPage();

	}));

	it('Should have prevPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.prevPage).toEqual(jasmine.any(Function));

		$scope.info.page = {"total":"20","current":1,"pages":2,"count":10}
		$scope.prevPage();
	}));

	it('Should have firstPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.firstPage).toEqual(jasmine.any(Function));

		$scope.info.page = {"total":"20","current":1,"pages":2,"count":10}
		$scope.firstPage();
	}));

	it('Should have lastPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.lastPage).toEqual(jasmine.any(Function));

		$scope.info.page = {"total":"20","current":0,"pages":2,"count":10}
		$scope.lastPage();
	}));
	

	it('Should have checkChange', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.checkChange).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : false
		};
		spyOn($scope, "addSelected");
		spyOn($scope, "removeSelected");
		$scope.checkChange(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : []
		});
		expect($scope.removeSelected).toHaveBeenCalledWith(facet, f_data);
		$scope.selectedFacets = {
			obs_url : [],
			sys_display_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : true
			}],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : true
		};
		$scope.checkChange(facet, f_data);
		expect($scope.selectedFacets).toEqual({ obs_url: [  ], sys_display_name: [ { title: 'Host Name', label: 'gbh-ui-01', value: 24454, selected: true } ], sys_hwaddr: [  ], namespace: [  ], obs_date_str: [  ], sys_timezone: [  ], apc_ipaddr: [  ], evt_date_str: [  ], events: [  ], test_name: [ { title: 'Host Name', label: 'gbh-ui-01', value: 24454, selected: false } ] });
		expect($scope.addSelected).toHaveBeenCalledWith(facet, f_data);
	}));

	it('Should have addSelected', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.addSelected).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : false
		};
		spyOn($scope.tableParams, "reload");
		$scope.addSelected(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : []
		});
		expect($scope.tableParams.reload).toHaveBeenCalled();
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var facet = {
			"key" : "test_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}]
		};
		$scope.addSelected(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		});
		expect($scope.tableParams.reload).toHaveBeenCalled();
	}));

	it('Should have removeSelected', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.removeSelected).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.selectedFacets = {
			obs_url : [],
			sys_display_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		};
		var facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : false
		};
		spyOn($scope.tableParams, "reload");
		$scope.removeSelected(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		});
		expect($scope.tableParams.reload).toHaveBeenCalled();
	}));

	it('Should have listSelectedFacets', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.listSelectedFacets).toEqual(jasmine.any(Function));
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		$scope.listSelectedFacets();
		expect($scope.selectedFacetsList).toEqual([{
			f_data : {
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 9992,
				selected : true,
				disabled : false
			},
			key : 'sys_display_name'
		}, {
			f_data : {
				title : 'Host Name',
				label : 'gbh-cass-dr',
				value : 4295,
				selected : true,
				disabled : false
			},
			key : 'sys_display_name'
		}]);
	}));

	it('Should have removeFacet', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.removeFacet).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : true,
				"disabled" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : true,
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		// var key = "sys_display_name";
		var facet = {
			"title" : "Host Name",
			"key" : "sys_display_name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : true,
			"disabled" : false,
			"f_data" : {}
		};
		spyOn($scope.tableParams, "reload");
		spyOn($scope, "refresh");
		$scope.removeFacet(facet);
		expect($scope.selectedFacets).toEqual({
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : true,
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		});
		expect($scope.tableParams.reload).toHaveBeenCalled();
		expect($scope.refresh).toHaveBeenCalled();
	}));

	it('Should have resetAll', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.resetAll).toEqual(jasmine.any(Function));
		$scope.facets = [{
			"key" : "obs_url",
			"label" : "Bundle URL",
			"data" : [],
			"expanded" : false,
			"f_data" : []
		}, {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}]
		}, {
			"key" : "sys_hwaddr",
			"label" : "Mac Address",
			"data" : [{
				"title" : "Mac Address",
				"label" : "00:0C:29:9E:F5:12",
				"value" : 9992,
				"selected" : false
			}, {
				"title" : "Mac Address",
				"label" : "00:0C:29:21:24:D2",
				"value" : 4295,
				"selected" : false
			}],
			"expanded" : false,
			"f_data" : [{
				"title" : "Mac Address",
				"label" : "00:0C:29:9E:F5:12",
				"value" : 9992,
				"selected" : false
			}, {
				"title" : "Mac Address",
				"label" : "00:0C:29:21:24:D2",
				"value" : 4295,
				"selected" : false
			}]
		}, {
			"key" : "namespace",
			"label" : "Section Name",
			"data" : [{
				"label" : "Unpared Data",
				"value" : 40,
				"key" : "unparsed",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "CPU info from proc",
				"value" : 24,
				"key" : "proccpuinfo",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Slabinfo Version",
				"value" : 4,
				"key" : "slabinfonmversion",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Linux Logs",
				"value" : 3,
				"key" : "lin",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "FileSystem Mount Information",
				"value" : 3,
				"key" : "lin.mount",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Apache Version",
				"value" : 2,
				"key" : "lin.apcversion",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Mysql Version",
				"value" : 2,
				"key" : "lin.mysqlver",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Mem info from proc",
				"value" : 2,
				"key" : "lin.procmeminfo",
				"selected" : false,
				"title" : "Section Name"
			}],
			"expanded" : false,
			"f_data" : [{
				"label" : "Unpared Data",
				"value" : 40,
				"key" : "unparsed",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "CPU info from proc",
				"value" : 24,
				"key" : "proccpuinfo",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Slabinfo Version",
				"value" : 4,
				"key" : "slabinfonmversion",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Linux Logs",
				"value" : 3,
				"key" : "lin",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "FileSystem Mount Information",
				"value" : 3,
				"key" : "lin.mount",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Apache Version",
				"value" : 2,
				"key" : "lin.apcversion",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Mysql Version",
				"value" : 2,
				"key" : "lin.mysqlver",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Mem info from proc",
				"value" : 2,
				"key" : "lin.procmeminfo",
				"selected" : false,
				"title" : "Section Name"
			}]
		}, {
			"key" : "obs_date_str",
			"label" : "System Time",
			"data" : [],
			"expanded" : false,
			"f_data" : []
		}, {
			"key" : "sys_timezone",
			"label" : "System Time Zone",
			"data" : [{
				"title" : "System Time Zone",
				"label" : "-0700",
				"value" : 14287,
				"selected" : false
			}],
			"expanded" : false,
			"f_data" : [{
				"title" : "System Time Zone",
				"label" : "-0700",
				"value" : 14287,
				"selected" : false
			}]
		}, {
			"key" : "apc_ipaddr",
			"label" : "Apache Access Log IP",
			"data" : [{
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.3",
				"value" : 2692,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.29",
				"value" : 56,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "127.0.0.1",
				"value" : 2,
				"selected" : false
			}],
			"expanded" : false,
			"f_data" : [{
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.3",
				"value" : 2692,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.29",
				"value" : 56,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "127.0.0.1",
				"value" : 2,
				"selected" : false
			}]
		}, {
			"key" : "evt_date_str",
			"label" : "Event Date",
			"data" : [],
			"expanded" : false,
			"f_data" : []
		}, {
			"key" : "events",
			"label" : "Event Source",
			"data" : [{
				"label" : "Open Files Information",
				"value" : 8999,
				"key" : "lsofnm",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Apache Access log",
				"value" : 2750,
				"key" : "apcl",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Top Command Process Info",
				"value" : 686,
				"key" : "cputop",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "PROCESS(ps ax) DATA",
				"value" : 676,
				"key" : "psax",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "CPU Utilization",
				"value" : 336,
				"key" : "lin.cpuinfo",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Diskstat from Proc",
				"value" : 130,
				"key" : "procdskstatinfonm",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Stats on failures from the N/W dev.",
				"value" : 96,
				"key" : "lin.netfailrep",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Context Switches per Second",
				"value" : 48,
				"key" : "lin.cswch",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Num of Read and Write req and blocks per sec",
				"value" : 48,
				"key" : "lin.dwps",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Number of inode, file and super block used",
				"value" : 48,
				"key" : "lin.inode",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Interrupts Per Second",
				"value" : 48,
				"key" : "lin.intrp",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Memory and swap space utilization statistics",
				"value" : 48,
				"key" : "lin.memutil",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Memory Status Report",
				"value" : 48,
				"key" : "lin.msr",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Processes Created per Second",
				"value" : 48,
				"key" : "lin.proc",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Processes-Q len,tot num,avg load in 15 mins",
				"value" : 48,
				"key" : "lin.prold",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Paging Statistics Report",
				"value" : 48,
				"key" : "lin.psr",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Total number of sockets and its breakup",
				"value" : 48,
				"key" : "lin.sck",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Num of swap pages taken in or out per sec",
				"value" : 48,
				"key" : "lin.swpag",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "FileSystem Disk Space Usage",
				"value" : 2,
				"key" : "lin.df",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Linux Free Command",
				"value" : 2,
				"key" : "lin.freecmd",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Var Log Messages",
				"value" : 2,
				"key" : "varlogmsg",
				"selected" : false,
				"title" : "Event Source"
			}],
			"expanded" : false,
			"f_data" : [{
				"label" : "Open Files Information",
				"value" : 8999,
				"key" : "lsofnm",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Apache Access log",
				"value" : 2750,
				"key" : "apcl",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Top Command Process Info",
				"value" : 686,
				"key" : "cputop",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "PROCESS(ps ax) DATA",
				"value" : 676,
				"key" : "psax",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "CPU Utilization",
				"value" : 336,
				"key" : "lin.cpuinfo",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Diskstat from Proc",
				"value" : 130,
				"key" : "procdskstatinfonm",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Stats on failures from the N/W dev.",
				"value" : 96,
				"key" : "lin.netfailrep",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Context Switches per Second",
				"value" : 48,
				"key" : "lin.cswch",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Num of Read and Write req and blocks per sec",
				"value" : 48,
				"key" : "lin.dwps",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Number of inode, file and super block used",
				"value" : 48,
				"key" : "lin.inode",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Interrupts Per Second",
				"value" : 48,
				"key" : "lin.intrp",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Memory and swap space utilization statistics",
				"value" : 48,
				"key" : "lin.memutil",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Memory Status Report",
				"value" : 48,
				"key" : "lin.msr",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Processes Created per Second",
				"value" : 48,
				"key" : "lin.proc",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Processes-Q len,tot num,avg load in 15 mins",
				"value" : 48,
				"key" : "lin.prold",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Paging Statistics Report",
				"value" : 48,
				"key" : "lin.psr",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Total number of sockets and its breakup",
				"value" : 48,
				"key" : "lin.sck",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Num of swap pages taken in or out per sec",
				"value" : 48,
				"key" : "lin.swpag",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "FileSystem Disk Space Usage",
				"value" : 2,
				"key" : "lin.df",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Linux Free Command",
				"value" : 2,
				"key" : "lin.freecmd",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Var Log Messages",
				"value" : 2,
				"key" : "varlogmsg",
				"selected" : false,
				"title" : "Event Source"
			}]
		}];
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : true
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		spyOn($scope, "setFromTo");
		$scope.resetAll();
		expect($scope.customDateFilter).toBeTruthy();
		expect($scope.dateRangeFilterName).toEqual('Custom Date Range');
		expect($scope.info.pristine).toBeTruthy();
		expect($scope.setFromTo).toHaveBeenCalled();
		$scope.info.default_days = 300;
		$scope.resetAll();
	}));

	it('Should have reset', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
        $controller('LogVaultCtrl', {
            '$scope' : $scope
        });
        expect($scope.reset).toEqual(jasmine.any(Function));
        
        spyOn($scope, "setFromTo");
        
        $scope.facets = [{
            data: [{
                disabled: true
            }, {
                disabled: false
            }]
        }];
        
        $scope.selectedFacets = {
            facet1: [{
                disabled: true
            }, {
                disabled: false
            }]
        };
        
        $scope.info.config = {
            DEFAULT_VIEW: 'SECTION'
        };
        
        $scope.reset();
	}));

	it('Should have zoomout', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.zoomout).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		spyOn($scope, "setFromTo");
		$scope.info.filterSuggest = {
		    startsWith: function() {
		        
		    }
		};
		spyOn($scope.info.filterSuggest, "startsWith");
		$scope.zoomout();
		expect($scope.info.fromDate).toEqual(new Date($scope.info.fromDate.setFullYear($scope.info.fromDate.getFullYear() - 10)));
		expect($scope.setFromTo).toHaveBeenCalled();
		$scope.info.default_days = 100;
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.filterSuggest = {
            startsWith: function() {
                
            }
        };
        spyOn($scope.info.filterSuggest, "startsWith");
		$scope.zoomout();
		expect($scope.info.fromDate).toEqual(new Date($scope.info.fromDate.setDate($scope.info.fromDate.getDate() - 100)));
		expect($scope.setFromTo).toHaveBeenCalled();
		$scope.defaultFacet = {};
		$scope.info.bundleToDate = new Date();
		$scope.zoomout();
	}));

	it('Should have resetFromUI', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.resetFromUI).toEqual(jasmine.any(Function));
		$scope.info.config = {
			DEFAULT_VIEW : 'BOTH'
		};
		$scope.info.defaultFilterInfo = {
			default_filter_type : 'savedsearch'
		};
		spyOn($scope, "reset");
		$scope.resetFromUI();
		expect($scope.info.page['current']).toEqual(0);
		expect($scope.info.selectedFilterName).toEqual("Select View");
		expect($scope.reset).toHaveBeenCalled();
		$scope.info.defaultFilterInfo.default_filter_status = 'on';
		$scope.resetFromUI();
		expect($scope.info.page['current']).toEqual(0);
		expect($scope.reset).toHaveBeenCalled();
	}));
	
	it('Should have loadView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.loadView).toEqual(jasmine.any(Function));
		spyOn($scope, "applyView");
		spyOn($scope, "parseView");
		
		var view = {"view_name":"automationpublicview","created_by":"praveen.yajurvedi@glassbeam.com","public":true,"default":false,"desc":"automationpublicview","start_ts":"2008-06-22T18:46:13Z","end_ts":"2016-09-08T18:46:13Z","facet_filters":["`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-08T13:16:40Z","search_type":"NA","currentUser":false};

		$scope.loadView(view);
		
		$scope.info.events = true;
		view = {
            search_type: 'OUTOFBOX'
        };
        $scope.loadView(view);
	}));

	
	it('Should have removeOutOfBox', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.removeOutOfBox).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		spyOn($scope.tableParams, "reload");
		spyOn($scope, "refresh");
		$scope.removeOutOfBox();
		expect($scope.info.pristine).toBeTruthy();
		expect($scope.info.defaultState).toBeFalsy();
		expect($scope.info.quick).toEqual(0);
		expect($scope.info.selectedFilterName).toEqual("Select View");
		expect($scope.info.uploaded_by).toBeNull();
		expect($scope.tableParams.reload).toHaveBeenCalled();
		expect($scope.refresh).toHaveBeenCalled();
	}));

	it('Should have parseView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.parseView).toEqual(jasmine.any(Function));
		var view = {"view_name":"automationpublicview","created_by":"praveen.yajurvedi@glassbeam.com","public":true,"default":false,"desc":"automationpublicview","start_ts":"2008-06-22T18:46:13Z","end_ts":"2016-09-08T18:46:13Z","facet_filters":["`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-08T13:16:40Z","search_type":"NA","currentUser":false}
		expect($scope.parseView(view)).toEqual({"facets":{"sysid":["CP0004165"],"sys_model":["Aruba3600"]},"facetKeys":{},"start_time":"2008-06-22T18:46:13Z","out_of_box":false,"end_time":"2016-09-08T18:46:13Z","lastn":0,"lastnbyme":0,"default":false});
	}));

	it('Should have applyView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.applyView).toEqual(jasmine.any(Function));
		
		var p_view = {"facets":{"sysid":["CP0004165"],"sys_model":["Aruba3600"]},"facetKeys":{},"start_time":"2008-06-22T18:46:13Z","out_of_box":false,"end_time":"2016-09-08T18:46:13Z","lastn":0,"lastnbyme":0,"default":false};
		spyOn($scope, "resetFacets");
		spyOn($scope, "listSelectedFacets");
		spyOn($scope, "setFromTo");
		$scope.facets = [{"key":"sysid","label":"Serial Number","data":[{"title":"Serial Number","label":"FC0004794","value":1,"selected":false},{"title":"Serial Number","label":"CP0004632","value":1,"selected":false},{"title":"Serial Number","label":"BC0001877","value":1,"selected":false},{"title":"Serial Number","label":"BC0001601","value":1,"selected":false},{"title":"Serial Number","label":"BC0001429","value":1,"selected":false},{"title":"Serial Number","label":"BB0002530","value":1,"selected":false},{"title":"Serial Number","label":"BB0001097","value":1,"selected":false},{"title":"Serial Number","label":"BA0007562","value":1,"selected":false},{"title":"Serial Number","label":"BA0001867","value":1,"selected":false},{"title":"Serial Number","label":"AR0017023","value":1,"selected":false},{"title":"Serial Number","label":"AK0027541","value":1,"selected":false},{"title":"Serial Number","label":"AK0022752","value":1,"selected":false},{"title":"Serial Number","label":"AK0018013","value":1,"selected":false},{"title":"Serial Number","label":"AK0005140","value":1,"selected":false},{"title":"Serial Number","label":"CP0004165","value":6,"selected":false}],"expanded":true,"f_data":[{"title":"Serial Number","label":"AK0005140","value":1,"selected":false},{"title":"Serial Number","label":"AK0018013","value":1,"selected":false},{"title":"Serial Number","label":"AK0022752","value":1,"selected":false},{"title":"Serial Number","label":"AK0027541","value":1,"selected":false},{"title":"Serial Number","label":"AR0017023","value":1,"selected":false},{"title":"Serial Number","label":"BA0001867","value":1,"selected":false},{"title":"Serial Number","label":"BA0007562","value":1,"selected":false},{"title":"Serial Number","label":"BB0001097","value":1,"selected":false},{"title":"Serial Number","label":"BB0002530","value":1,"selected":false},{"title":"Serial Number","label":"BC0001429","value":1,"selected":false},{"title":"Serial Number","label":"BC0001601","value":1,"selected":false},{"title":"Serial Number","label":"BC0001877","value":1,"selected":false},{"title":"Serial Number","label":"CP0004165","value":6,"selected":false},{"title":"Serial Number","label":"CP0004632","value":1,"selected":false},{"title":"Serial Number","label":"FC0004794","value":1,"selected":false}]},{"key":"ticket_num","label":"Ticket Number","data":[{"title":"Ticket Number","label":"1710906","value":1,"selected":false},{"title":"Ticket Number","label":"1710903","value":1,"selected":false},{"title":"Ticket Number","label":"1710800","value":1,"selected":false},{"title":"Ticket Number","label":"1707728","value":1,"selected":false},{"title":"Ticket Number","label":"1703338","value":1,"selected":false},{"title":"Ticket Number","label":"1699662","value":1,"selected":false},{"title":"Ticket Number","label":"1711086","value":2,"selected":false},{"title":"Ticket Number","label":"1498514","value":6,"selected":false},{"title":"Ticket Number","label":"100001","value":6,"selected":false}],"expanded":false,"f_data":[{"title":"Ticket Number","label":"100001","value":6,"selected":false},{"title":"Ticket Number","label":"1498514","value":6,"selected":false},{"title":"Ticket Number","label":"1699662","value":1,"selected":false},{"title":"Ticket Number","label":"1703338","value":1,"selected":false},{"title":"Ticket Number","label":"1707728","value":1,"selected":false},{"title":"Ticket Number","label":"1710800","value":1,"selected":false},{"title":"Ticket Number","label":"1710903","value":1,"selected":false},{"title":"Ticket Number","label":"1710906","value":1,"selected":false},{"title":"Ticket Number","label":"1711086","value":2,"selected":false}]},{"key":"cust_name","label":"Account Name","data":[{"title":"Account Name","label":"sra.com","value":1,"selected":false},{"title":"Account Name","label":"pfisd.net","value":1,"selected":false},{"title":"Account Name","label":"minnetonka.k12.mn.us","value":1,"selected":false},{"title":"Account Name","label":"University of Washington","value":1,"selected":false},{"title":"Account Name","label":"Transition Systems Asia Pte Ltd","value":1,"selected":false},{"title":"Account Name","label":"Terach B.V","value":1,"selected":false},{"title":"Account Name","label":"TechAccess","value":1,"selected":false},{"title":"Account Name","label":"Ingram Micro Inc","value":1,"selected":false},{"title":"Account Name","label":"AT&T Oxygen FZ LLC/ Oxygen - JLT ajg.com","value":1,"selected":false},{"title":"Account Name","label":"49ers.com","value":1,"selected":false},{"title":"Account Name","label":"uw.edu","value":2,"selected":false},{"title":"Account Name","label":"Catalyst Telecom","value":2,"selected":false},{"title":"Account Name","label":"Avnet Logistics, USLP","value":6,"selected":false}],"expanded":false,"f_data":[{"title":"Account Name","label":"49ers.com","value":1,"selected":false},{"title":"Account Name","label":"AT&T Oxygen FZ LLC/ Oxygen - JLT ajg.com","value":1,"selected":false},{"title":"Account Name","label":"Avnet Logistics, USLP","value":6,"selected":false},{"title":"Account Name","label":"Catalyst Telecom","value":2,"selected":false},{"title":"Account Name","label":"Ingram Micro Inc","value":1,"selected":false},{"title":"Account Name","label":"minnetonka.k12.mn.us","value":1,"selected":false},{"title":"Account Name","label":"pfisd.net","value":1,"selected":false},{"title":"Account Name","label":"sra.com","value":1,"selected":false},{"title":"Account Name","label":"TechAccess","value":1,"selected":false},{"title":"Account Name","label":"Terach B.V","value":1,"selected":false},{"title":"Account Name","label":"Transition Systems Asia Pte Ltd","value":1,"selected":false},{"title":"Account Name","label":"University of Washington","value":1,"selected":false},{"title":"Account Name","label":"uw.edu","value":2,"selected":false}]},{"key":"sys_version","label":"Version","data":[{"title":"Version","label":"6.4.3.2","value":1,"selected":false},{"title":"Version","label":"6.4.2.2","value":1,"selected":false},{"title":"Version","label":"6.4.2.1","value":1,"selected":false},{"title":"Version","label":"6.4.2.7","value":2,"selected":false},{"title":"Version","label":"6.4.2.5","value":2,"selected":false},{"title":"Version","label":"6.4.2.8","value":3,"selected":false},{"title":"Version","label":"6.4.2.6","value":4,"selected":false},{"title":"Version","label":"5.0.3.0","value":6,"selected":false}],"expanded":false,"f_data":[{"title":"Version","label":"5.0.3.0","value":6,"selected":false},{"title":"Version","label":"6.4.2.1","value":1,"selected":false},{"title":"Version","label":"6.4.2.2","value":1,"selected":false},{"title":"Version","label":"6.4.2.5","value":2,"selected":false},{"title":"Version","label":"6.4.2.6","value":4,"selected":false},{"title":"Version","label":"6.4.2.7","value":2,"selected":false},{"title":"Version","label":"6.4.2.8","value":3,"selected":false},{"title":"Version","label":"6.4.3.2","value":1,"selected":false}]},{"key":"sys_model","label":"System Model","data":[{"title":"System Model","label":"Aruba7240","value":1,"selected":false},{"title":"System Model","label":"Aruba7005","value":1,"selected":false},{"title":"System Model","label":"Aruba650","value":1,"selected":false},{"title":"System Model","label":"Aruba6000-US","value":1,"selected":false},{"title":"System Model","label":"Aruba7240-US","value":2,"selected":false},{"title":"System Model","label":"Aruba7220-US","value":2,"selected":false},{"title":"System Model","label":"Aruba7210-US","value":2,"selected":false},{"title":"System Model","label":"Aruba3600-US","value":2,"selected":false},{"title":"System Model","label":"Aruba3600","value":8,"selected":false}],"expanded":false,"f_data":[{"title":"System Model","label":"Aruba3600","value":8,"selected":false},{"title":"System Model","label":"Aruba3600-US","value":2,"selected":false},{"title":"System Model","label":"Aruba6000-US","value":1,"selected":false},{"title":"System Model","label":"Aruba650","value":1,"selected":false},{"title":"System Model","label":"Aruba7005","value":1,"selected":false},{"title":"System Model","label":"Aruba7210-US","value":2,"selected":false},{"title":"System Model","label":"Aruba7220-US","value":2,"selected":false},{"title":"System Model","label":"Aruba7240","value":1,"selected":false},{"title":"System Model","label":"Aruba7240-US","value":2,"selected":false}]},{"key":"obs_ts","label":"","data":[],"expanded":false,"f_data":[]},{"key":"obs_url","label":"Bundle URL","data":[],"expanded":false,"f_data":[]},{"key":"severity","label":"Event Severity","data":[],"expanded":false,"f_data":[]},{"key":"evt_type","label":"Event Type","data":[],"expanded":false,"f_data":[]},{"key":"evt_epoch","label":"","data":[],"expanded":false,"f_data":[]},{"key":"uploaded_by","label":"user","data":[{"title":"user","label":"","value":20,"selected":false}],"expanded":false,"f_data":[{"title":"user","label":"","value":20,"selected":false}]},{"key":"evt_date_str","label":"Event Date","data":[],"expanded":false,"f_data":[]},{"key":"obs_date_str","label":"System Time","data":[],"expanded":false,"f_data":[]}];

		$scope.applyView(p_view);
	}));

	it('Should have showSaveFilterModal', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.showSaveFilterModal).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.customDateFilter = false;
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		$scope.listSelectedFacets();
		$scope.showSaveFilterModal();
		
	}));
	
	it('Should have saveFilter', inject(function($rootScope, $controller, $cookies) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.saveFilter).toEqual(jasmine.any(Function));
		$scope.form = {
			saveViewModal: {
				$valid: false
			}
		};
		$scope.saveFilter();
		expect($scope.saveModal.saveStatus).toBeUndefined();
		$scope.form.saveViewModal.$valid = true;
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.saveFilter();
		expect($scope.saveModal.saveStatus).toEqual('progress');
	}));
	
	it('Should have hideModal', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hideModal).toEqual(jasmine.any(Function));
		$scope.modal = {
			close: function() {
				
			}
		};
		spyOn($scope.modal, "close");
		$scope.hideModal();
	}));
	
	it('Should have getSavedFilters', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.getSavedFilters).toEqual(jasmine.any(Function));
		$scope.getSavedFilters();

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('GET', infoserverDomain + '/logvault/view/list/all/' + manufacturer + '/' +  product + '/' + schema).respond(
			{"data":{"Status":"Success","Msg":"List of all saved views","Data":[{"view_name":"raja0Monthly","created_by":"mohammed.raja@glassbeam.com","public":true,"default":true,"desc":"test","start_ts":"2008-06-22T18:46:13Z","end_ts":"2016-09-08T18:46:13Z","facet_filters":["`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-30T12:04:43Z","search_type":"NA"},{"view_name":"changepwd","created_by":"praveen.ashok@glassbeam.com","public":false,"default":false,"desc":"undefined","start_ts":"2008-07-06T15:09:39Z","end_ts":"2016-09-22T15:09:39Z","facet_filters":["NA"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-22T15:10:12Z","search_type":"NA"},{"view_name":"last5","created_by":"priyanka.roy@glassbeam.com","public":false,"default":false,"desc":"undefined","start_ts":"2008-06-30T11:51:31Z","end_ts":"2016-09-16T11:51:31Z","facet_filters":["`relativetimefilter^Last 5 logs`"],"last_n_log":5,"last_n_log_by_user":0,"created_ts":"2016-09-16T11:51:43Z","search_type":"NA"},{"view_name":"automationprivateview","created_by":"praveen.yajurvedi@glassbeam.com","public":false,"default":false,"desc":"automationprivateview","start_ts":"2008-06-23T14:27:56Z","end_ts":"2016-09-09T14:27:56Z","facet_filters":["`relativetimefilter^Last 10 logs`,`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":10,"last_n_log_by_user":0,"created_ts":"2016-09-09T08:58:08Z","search_type":"NA"},{"view_name":"automationpublicview","created_by":"praveen.yajurvedi@glassbeam.com","public":true,"default":false,"desc":"automationpublicview","start_ts":"2008-06-22T18:46:13Z","end_ts":"2016-09-08T18:46:13Z","facet_filters":["`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-08T13:16:40Z","search_type":"NA"}]},"status":200,"config":{"method":"GET","transformRequest":[null],"transformResponse":[null],"url":"https://gbqisprod.glassbeam.com/v1/logvault/view/list/all/aruba/aruba/podui","headers":{"Accept":"application/json, text/plain, */*","If-Modified-Since":"Mon, 26 Jul 1997 05:00:00 GMT","Cache-Control":"no-cache","Pragma":"no-cache"}},"statusText":"OK"}
		);
	
		$httpBackend.flush();
	}));

	it('Should have getSavedFilters with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.getSavedFilters).toEqual(jasmine.any(Function));
		$scope.getSavedFilters();

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('GET', infoserverDomain + '/logvault/view/list/all/' + manufacturer + '/' +  product + '/' + schema).respond(500);
	
		$httpBackend.flush();
	}));

	it('Should have getLoggedInUserName', inject(function($rootScope, $controller, metaDataService) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.getLoggedInUserName).toEqual(jasmine.any(Function));
		
		var user = {'name': 'raja', 'email':'raja@gb.com'}
		metaDataService.setUser(user);
		expect($scope.getLoggedInUserName()).toEqual('raja@gb.com');
	}));

	it('Should have getFilterScope', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.getFilterScope).toEqual(jasmine.any(Function));
		$scope.info.filterBtn = 'all';
		var filter = {"view_name":"changepwd","created_by":"praveen.ashok@glassbeam.com","public":false,"default":false,"desc":"undefined","start_ts":"2008-07-06T15:09:39Z","end_ts":"2016-09-22T15:09:39Z","facet_filters":["NA"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-22T15:10:12Z","search_type":"NA","currentUser":false};
		expect($scope.getFilterScope(filter)).toBeFalsy();
		$scope.info.filterBtn = 'my';
		expect($scope.getFilterScope(filter)).toBeFalsy();
		$scope.info.filterBtn = 'others';
		filter.public = true;
		expect($scope.getFilterScope(filter)).toBeTruthy();
	}));

	it('Should have changeDefaultFilter', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		// spyOn($scope, "loadView");
		spyOn($scope, "reset");
		spyOn($scope, "getSavedFilters");
		expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
		var view = {"view_name":"raja0Monthly","created_by":"mohammed.raja@glassbeam.com","public":false,"default":false,"desc":"test","start_ts":"2008-06-22T18:46:13Z","end_ts":"2016-09-08T18:46:13Z","facet_filters":["`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-30T12:04:43Z","search_type":"NA","currentUser":true};

		$scope.changeDefaultFilter(view);

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/logvault/view/setdefault' + '/' + manufacturer + '/' + product + '/' + schema + '/' + view['view_name']).respond({});
		$httpBackend.expect('POST', infoserverDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Log Vault/Log Vault/Set Default View').respond(200);
		
		$httpBackend.flush();
		
		// expect($scope.loadView).toHaveBeenCalled();
		expect($scope.reset).not.toHaveBeenCalled();
		expect($scope.getSavedFilters).toHaveBeenCalled();
	}));
	
	it('Should have changeDefaultFilter with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
		var view = {"view_name":"raja0Monthly","created_by":"mohammed.raja@glassbeam.com","public":false,"default":false,"desc":"test","start_ts":"2008-06-22T18:46:13Z","end_ts":"2016-09-08T18:46:13Z","facet_filters":["`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-30T12:04:43Z","search_type":"NA","currentUser":true};

		$scope.changeDefaultFilter(view);

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/logvault/view/setdefault' + '/' + manufacturer + '/' + product + '/' + schema + '/' + view['view_name']).respond(500);		
		
		$httpBackend.flush();
	}));

	
	it('Should have changeFilterAccessibility', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		/*spyOn($scope, "getSavedFilters");
		spyOn($scope, "reset");*/
		spyOn($scope, "getSavedFilters");
		expect($scope.changeFilterAccessibility).toEqual(jasmine.any(Function));
		var view = {"view_name":"raja0Monthly","created_by":"mohammed.raja@glassbeam.com","public":false,"default":false,"desc":"test","start_ts":"2008-06-22T18:46:13Z","end_ts":"2016-09-08T18:46:13Z","facet_filters":["`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-30T12:04:43Z","search_type":"NA","currentUser":true};

		$scope.changeFilterAccessibility(view);

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/logvault/view/setpublic' + '/' + manufacturer + '/' + product + '/' + schema + '/' + !view['public'] + '/' + view['view_name']).respond({});
		$httpBackend.expect('POST', infoserverDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Log Vault/Log Vault/Set View Public').respond(200);
		
		$httpBackend.flush();
		
		expect($scope.getSavedFilters).toHaveBeenCalled();
	}));

	it('Should have changeFilterAccessibility with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});

		expect($scope.changeFilterAccessibility).toEqual(jasmine.any(Function));
		var view = {"view_name":"raja0Monthly","created_by":"mohammed.raja@glassbeam.com","public":false,"default":false,"desc":"test","start_ts":"2008-06-22T18:46:13Z","end_ts":"2016-09-08T18:46:13Z","facet_filters":["`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-30T12:04:43Z","search_type":"NA","currentUser":true};

		$scope.changeFilterAccessibility(view);

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/logvault/view/setpublic' + '/' + manufacturer + '/' + product + '/' + schema + '/' + !view['public'] + '/' + view['view_name']).respond(500);
				
		$httpBackend.flush();
	}));

	it('Should have hideFacets', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.hideFacets).toEqual(jasmine.any(Function));
		$scope.hideFacets(true);
		$scope.hideFacets(false);
	}));	

	it('Should have getFilterOtherScope', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.getFilterOtherScope).toEqual(jasmine.any(Function));
		var filter = {"view_name":"changepwd","created_by":"praveen.ashok@glassbeam.com","public":true,"default":false,"desc":"undefined","start_ts":"2008-07-06T15:09:39Z","end_ts":"2016-09-22T15:09:39Z","facet_filters":["NA"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-22T15:10:12Z","search_type":"NA","currentUser":false};
		
		expect($scope.getFilterOtherScope(filter)).toBeTruthy();
	}));

	it('Should have deleteSavedFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.deleteSavedFilter).toEqual(jasmine.any(Function));
		// var selectedFilter = ["65", "unit test", "NULL", "*", "2004-12-16 14:08:49", "2014-12-16 14:08:49", "sys_display_name^gbh-ui-01~~~gbh-cass-dr~~~|||", "2014-12-16 14:13:23", "0", "1"];
		var selectedFilter = {
		    view_name: 'unit test',
		    desc: 'NULL',
		    default: true
		};
		$scope.info.defaultFilterInfo = {
			"out_of_box_search" : "0",
			"default_filter_type" : "savedsearch",
			"default_filter_status" : "on",
			"search_id" : "65",
			"disabled" : false
		};
		$scope.deleteSavedFilter(selectedFilter);
		expect($scope.deleteModal).toEqual({
			filter : {
				name : 'unit test',
				desc : 'NULL',
				id : 'unit test',
				isDefault : true
			},
			status : 'initiated',
			deleteOperationMsg : ''
		});
		// $scope.info.defaultFilterInfo = {
			// "out_of_box_search" : "0",
			// "default_filter_type" : "savedsearch",
			// "default_filter_status" : "off",
			// "search_id" : "65"
		// };
		// $scope.deleteSavedFilter(selectedFilter);
		// expect($scope.deleteModal).toEqual({
			// filter : {
				// name : 'unit test',
				// desc : 'NULL',
				// id : 'unit test',
				// isDefault : false
			// },
			// status : 'initiated',
			// deleteOperationMsg : ''
		// });
	}));

	it('Should have callSaveViewAPI', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, 'getSavedFilters');
		expect($scope.callSaveViewAPI).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date("24 Jun 1997");
		$scope.info.toDate = new Date("24 Jun 1997");
		$scope.callSaveViewAPI();

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/logvault/view/add/' + manufacturer + '/' +  product + '/' + schema + '/' + 'false/undefined/true').respond({});
		$httpBackend.expect('POST', infoserverDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Log Vault/Log Vault/Save View').respond(200);

		$httpBackend.flush();
		expect($scope.getSavedFilters).toHaveBeenCalled();
	}));

	it('Should have callSaveViewAPI with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});		
		expect($scope.callSaveViewAPI).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date("24 Jun 1997");
		$scope.info.toDate = new Date("24 Jun 1997");
		$scope.callSaveViewAPI();

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/logvault/view/add/' + manufacturer + '/' +  product + '/' + schema + '/' + 'false/undefined/true').respond(500);		

		$httpBackend.flush();
	}));
	
	it('Should have deleteFilterRequest', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, 'resetFromUI');
		spyOn($scope, 'getSavedFilters');
		expect($scope.deleteFilterRequest).toEqual(jasmine.any(Function));
		$scope.deleteModal = {"filter":{"name":"raja0Monthly","desc":"test","id":"raja0Monthly","isDefault":true},"status":"progress","deleteOperationMsg":""};
		$scope.deleteFilterRequest('raja0Monthly');

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/logvault/view/delete/' + manufacturer + '/' +  product + '/' + schema + '/' + 'raja0Monthly').respond({data:''});
		$httpBackend.expect('POST', infoserverDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Log Vault/Log Vault/Delete View').respond(200);

		$httpBackend.flush();
		expect($scope.resetFromUI).toHaveBeenCalled();
		expect($scope.getSavedFilters).toHaveBeenCalled();
	}));

	it('Should have deleteFilterRequest with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.deleteFilterRequest).toEqual(jasmine.any(Function));
		$scope.deleteModal = {"filter":{"name":"raja0Monthly","desc":"test","id":"raja0Monthly","isDefault":true},"status":"progress","deleteOperationMsg":""};
		$scope.deleteFilterRequest('raja0Monthly');
		//expect($scope.deleteModal.status).toEqual('progress');

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/logvault/view/delete/' + manufacturer + '/' +  product + '/' + schema + '/' + 'raja0Monthly').respond(500, {data:''});		

		$httpBackend.flush();
	}));

	it('Should have openFacetChart', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		var retDate = new Date(Date.UTC(2015, 2, 12, 22, 45, 23, 45));
        jasmine.clock().mockDate(retDate);
		expect($scope.openFacetChart).toEqual(jasmine.any(Function));
		var facet = {};
		facet.f_data = [{
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : false
		}, {
			"title" : "Host Name",
			"label" : "gbh-cass-dr",
			"value" : 4250,
			"selected" : false
		}, {
			"title" : "Host Name",
			"label" : "gbh-solr-01",
			"value" : 904,
			"selected" : false
		}];
		$scope.openFacetChart(facet.f_data);
	}));

	it('Should have closeFacetChart', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.closeFacetChart).toEqual(jasmine.any(Function));
		$scope.info.facetCharts = [{
			"cData" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"cType" : "bar2d",
			"facetChartMax" : false,
			"exportImage" : 0,
			"exportPdf" : 0,
			"facetLabel" : "",
			"dateRange" : "Time Range: 26-Dec-2004 TO 26-Dec-2014"
		}, {
			"cData" : [{
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.3",
				"value" : 5751,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.29",
				"value" : 120,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "127.0.0.1",
				"value" : 4,
				"selected" : false
			}],
			"cType" : "bar2d",
			"facetChartMax" : false,
			"exportImage" : 0,
			"exportPdf" : 0,
			"facetLabel" : "",
			"dateRange" : "Time Range: 26-Dec-2004 TO 26-Dec-2014"
		}];
		var modal = {
			"cData" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"cType" : "bar2d",
			"facetChartMax" : false,
			"exportImage" : 0,
			"exportPdf" : 0,
			"facetLabel" : "",
			"dateRange" : "Time Range: 26-Dec-2004 TO 26-Dec-2014"
		};
		$scope.closeFacetChart(modal);
		expect($scope.info.facetCharts).toEqual([{
			cData : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}, {
				title : 'Host Name',
				label : 'gbh-cass-dr',
				value : 4250,
				selected : false
			}, {
				title : 'Host Name',
				label : 'gbh-solr-01',
				value : 904,
				selected : false
			}],
			cType : 'bar2d',
			facetChartMax : false,
			exportImage : 0,
			exportPdf : 0,
			facetLabel : '',
			dateRange : 'Time Range: 26-Dec-2004 TO 26-Dec-2014'
		}]);
	}));

	it('Should have exportAsImage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.exportAsImage).toEqual(jasmine.any(Function));
		var modal = {
			exportImage : 4
		};
		$scope.exportAsImage(modal);
		expect(modal.exportImage).toEqual(5);
	}));

	it('Should have exportAsPDF', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.exportAsPDF).toEqual(jasmine.any(Function));
		var modal = {
			exportPdf : 4
		};
		$scope.exportAsPDF(modal);
		expect(modal.exportPdf).toEqual(5);
	}));
	
	it('Should have listFiles', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.listFiles).toEqual(jasmine.any(Function));
		var bundle = {
			obs_url: '/abc/def/xyz'
		};
		$scope.info.fileLists = [{}, {}, {}];
		$scope.listFiles(bundle);
		var sysId = "121";
		var obsDate = "2015-10-20 18:11:00";

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('GET', infoserverDomain + '/bundles/files/named/' + manufacturer + '/' +  product + '/' + schema + '/undefined/undefined/undefined?obs_url=%2Fabc%2Fdef%2Fxyz').respond({'data': { 'Status' : 'Success'}});
	
		$httpBackend.flush();

	}));

	it('Should have listFiles with error', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.listFiles).toEqual(jasmine.any(Function));
		var bundle = {
			obs_url: '/abc/def/xyz'
		};
		$scope.info.fileLists = [{}, {}, {}];
		$scope.listFiles(bundle);
		var sysId = "121";
		var obsDate = "2015-10-20 18:11:00";

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('GET', infoserverDomain + '/bundles/files/named/' + manufacturer + '/' +  product + '/' + schema + '/undefined/undefined/undefined?obs_url=%2Fabc%2Fdef%2Fxyz').respond(500);
	
		$httpBackend.flush();
	}));

	it('Should have logToggleTimeline : show', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.logToggleTimeline).toEqual(jasmine.any(Function));
		
		$scope.logToggleTimeline(true);

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Log Vault/Log Vault/Toggle Timeline').respond(200);
	
		$httpBackend.flush();

	}));

	it('Should have logShowTime', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.logShowTime).toEqual(jasmine.any(Function));
		
		$scope.logShowTime();

		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Log Vault/Log Vault/Hide Original Time').respond(200);
	
		$httpBackend.flush();

	}));
	
	it('Should have checkViewName', inject(function($rootScope, $controller, $httpBackend, $cookies, infoserverDomain, manufacturer, product, schema) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.checkViewName).toEqual(jasmine.any(Function));
		$scope.saveModal = {"saveStatus":"initiated","message":"","filters":"CP0004165, Aruba3600","filtersString":"`sysid^CP0004165`,`sys_model^Aruba3600`","timeRange":"2008-6-23 0:16:13 To 2016-9-9 0:16:13 ","filterName":"raja0Monthly"};
		$scope.savedFiltersList = [{"view_name":"changepwd","created_by":"praveen.ashok@glassbeam.com","public":false,"default":false,"desc":"undefined","start_ts":"2008-07-06T15:09:39Z","end_ts":"2016-09-22T15:09:39Z","facet_filters":["NA"],"last_n_log":0,"last_n_log_by_user":0,"created_ts":"2016-09-22T15:10:12Z","search_type":"NA","currentUser":false},
		{"view_name":"last5","created_by":"priyanka.roy@glassbeam.com","public":false,"default":false,"desc":"undefined","start_ts":"2008-06-30T11:51:31Z","end_ts":"2016-09-16T11:51:31Z","facet_filters":["`relativetimefilter^Last 5 logs`"],"last_n_log":5,"last_n_log_by_user":0,"created_ts":"2016-09-16T11:51:43Z","search_type":"NA","currentUser":false},
		{"view_name":"automationprivateview","created_by":"praveen.yajurvedi@glassbeam.com","public":false,"default":false,"desc":"automationprivateview","start_ts":"2008-06-23T14:27:56Z","end_ts":"2016-09-09T14:27:56Z","facet_filters":["`relativetimefilter^Last 10 logs`,`sysid^CP0004165`,`sys_model^Aruba3600`"],"last_n_log":10,"last_n_log_by_user":0,"created_ts":"2016-09-09T08:58:08Z","search_type":"NA","currentUser":false},];
		
		$scope.form = {
			'message' :'',
			'visible' : true,
			'saveViewModal' : {
				'viewName' : {
					'$setValidity' : function(){

					}
				}
			}
		}
		$scope.checkViewName();

	}));

	it('Should have changePageSize', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('LogVaultCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "refresh");
        expect($scope.changePageSize).toEqual(jasmine.any(Function));
        $scope.changePageSize();
    }));
	
	it('Should have closeFileList', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.closeFileList).toEqual(jasmine.any(Function));
		$scope.info.fileLists = ['abc', 'def', 'ghi'];
		$scope.closeFileList('def');
		expect($scope.info.fileLists).toEqual(['abc', 'ghi']);
	}));

	it('Should have showDownloadList', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.showDownloadList).toEqual(jasmine.any(Function));
		$scope.showDownloadList();
		$scope.bundleList = ["abc", "def", "ghi"];
		$scope.showDownloadList();
	}));

	it('Should have getTotalSize', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.getTotalSize).toEqual(jasmine.any(Function));
		$scope.bundleList = [{
			obs_size : 14
		}, {
			obs_size : 16
		}, {
			obs_size : 20
		}];
		expect($scope.getTotalSize()).toEqual(50);
	}));

	it('Should have generateUrlForFile', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.generateUrlForFile).toEqual(jasmine.any(Function));
		var bundle = {
			bundle_name : 'unit test'
		};
		var file = "abc.txt";
		expect($scope.generateUrlForFile(bundle, file)).toEqual('{"bundles":[{"bundle_name":"unit test","files":["abc.txt"]}],"download_type":"files"}');
	}));
	it('Should have generateUrlForBundle', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.generateUrlForBundle).toEqual(jasmine.any(Function));
		$scope.bundleList = [{
			obs_url : "/unit_test/1.html"
		}, {
			obs_url : "/unit_test/2.html"
		}, {
			obs_url : "/unit_test/2.html"
		}];
		expect($scope.generateUrlForBundle()).toEqual('obs_url=/unit_test/1.html#-#undefined#-#NA#-#undefined&obs_url=/unit_test/2.html#-#undefined#-#NA#-#undefined&obs_url=/unit_test/2.html#-#undefined#-#NA#-#undefined');
		
		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.generateUrlForBundle).toEqual(jasmine.any(Function));
		GlobalService.setVal('download_max_limit', 100);
		spyOn($scope, "getTotalSize").and.returnValue(200);
		expect($scope.generateUrlForBundle()).toEqual('');
		
		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		$scope.generateUrlForBundle('abcd');
	}));
	
	it('Should have generateUrlForBundleGroup', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.generateUrlForBundleGroup).toEqual(jasmine.any(Function));
		$scope.bundleList = [{
			obs_url : "/unit_test/1.html"
		}, {
			obs_url : "/unit_test/2.html"
		}, {
			obs_url : "/unit_test/2.html"
		}];
		expect($scope.generateUrlForBundleGroup()).toEqual('obs_url=/unit_test/1.html#-#undefined#-#NA#-#undefined&obs_url=/unit_test/2.html#-#undefined#-#NA#-#undefined&obs_url=/unit_test/2.html#-#undefined#-#NA#-#undefined');
		
		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.generateUrlForBundleGroup).toEqual(jasmine.any(Function));
		GlobalService.setVal('download_max_limit', 100);
		spyOn($scope, "getTotalSize").and.returnValue(200);
		expect($scope.generateUrlForBundleGroup()).toBeUndefined();
		
		$scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		$scope.generateUrlForBundleGroup('abcd');
	}));

	it('Should have resetFacets', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.resetFacets).toEqual(jasmine.any(Function));
		$scope.facets = [{
			"key" : "obs_url",
			"label" : "Bundle URL",
			"data" : [],
			"expanded" : false,
			"f_data" : []
		}, {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}]
		}, {
			"key" : "sys_hwaddr",
			"label" : "Mac Address",
			"data" : [{
				"title" : "Mac Address",
				"label" : "00:0C:29:9E:F5:12",
				"value" : 9992,
				"selected" : false
			}, {
				"title" : "Mac Address",
				"label" : "00:0C:29:21:24:D2",
				"value" : 4295,
				"selected" : false
			}],
			"expanded" : false,
			"f_data" : [{
				"title" : "Mac Address",
				"label" : "00:0C:29:9E:F5:12",
				"value" : 9992,
				"selected" : false
			}, {
				"title" : "Mac Address",
				"label" : "00:0C:29:21:24:D2",
				"value" : 4295,
				"selected" : false
			}]
		}, {
			"key" : "namespace",
			"label" : "Section Name",
			"data" : [{
				"label" : "Unpared Data",
				"value" : 40,
				"key" : "unparsed",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "CPU info from proc",
				"value" : 24,
				"key" : "proccpuinfo",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Slabinfo Version",
				"value" : 4,
				"key" : "slabinfonmversion",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Linux Logs",
				"value" : 3,
				"key" : "lin",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "FileSystem Mount Information",
				"value" : 3,
				"key" : "lin.mount",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Apache Version",
				"value" : 2,
				"key" : "lin.apcversion",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Mysql Version",
				"value" : 2,
				"key" : "lin.mysqlver",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Mem info from proc",
				"value" : 2,
				"key" : "lin.procmeminfo",
				"selected" : false,
				"title" : "Section Name"
			}],
			"expanded" : false,
			"f_data" : [{
				"label" : "Unpared Data",
				"value" : 40,
				"key" : "unparsed",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "CPU info from proc",
				"value" : 24,
				"key" : "proccpuinfo",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Slabinfo Version",
				"value" : 4,
				"key" : "slabinfonmversion",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Linux Logs",
				"value" : 3,
				"key" : "lin",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "FileSystem Mount Information",
				"value" : 3,
				"key" : "lin.mount",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Apache Version",
				"value" : 2,
				"key" : "lin.apcversion",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Mysql Version",
				"value" : 2,
				"key" : "lin.mysqlver",
				"selected" : false,
				"title" : "Section Name"
			}, {
				"label" : "Mem info from proc",
				"value" : 2,
				"key" : "lin.procmeminfo",
				"selected" : false,
				"title" : "Section Name"
			}]
		}, {
			"key" : "obs_date_str",
			"label" : "System Time",
			"data" : [],
			"expanded" : false,
			"f_data" : []
		}, {
			"key" : "sys_timezone",
			"label" : "System Time Zone",
			"data" : [{
				"title" : "System Time Zone",
				"label" : "-0700",
				"value" : 14287,
				"selected" : false
			}],
			"expanded" : false,
			"f_data" : [{
				"title" : "System Time Zone",
				"label" : "-0700",
				"value" : 14287,
				"selected" : false
			}]
		}, {
			"key" : "apc_ipaddr",
			"label" : "Apache Access Log IP",
			"data" : [{
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.3",
				"value" : 2692,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.29",
				"value" : 56,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "127.0.0.1",
				"value" : 2,
				"selected" : false
			}],
			"expanded" : false,
			"f_data" : [{
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.3",
				"value" : 2692,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "172.31.42.29",
				"value" : 56,
				"selected" : false
			}, {
				"title" : "Apache Access Log IP",
				"label" : "127.0.0.1",
				"value" : 2,
				"selected" : false
			}]
		}, {
			"key" : "evt_date_str",
			"label" : "Event Date",
			"data" : [],
			"expanded" : false,
			"f_data" : []
		}, {
			"key" : "events",
			"label" : "Event Source",
			"data" : [{
				"label" : "Open Files Information",
				"value" : 8999,
				"key" : "lsofnm",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Apache Access log",
				"value" : 2750,
				"key" : "apcl",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Top Command Process Info",
				"value" : 686,
				"key" : "cputop",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "PROCESS(ps ax) DATA",
				"value" : 676,
				"key" : "psax",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "CPU Utilization",
				"value" : 336,
				"key" : "lin.cpuinfo",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Diskstat from Proc",
				"value" : 130,
				"key" : "procdskstatinfonm",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Stats on failures from the N/W dev.",
				"value" : 96,
				"key" : "lin.netfailrep",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Context Switches per Second",
				"value" : 48,
				"key" : "lin.cswch",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Num of Read and Write req and blocks per sec",
				"value" : 48,
				"key" : "lin.dwps",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Number of inode, file and super block used",
				"value" : 48,
				"key" : "lin.inode",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Interrupts Per Second",
				"value" : 48,
				"key" : "lin.intrp",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Memory and swap space utilization statistics",
				"value" : 48,
				"key" : "lin.memutil",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Memory Status Report",
				"value" : 48,
				"key" : "lin.msr",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Processes Created per Second",
				"value" : 48,
				"key" : "lin.proc",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Processes-Q len,tot num,avg load in 15 mins",
				"value" : 48,
				"key" : "lin.prold",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Paging Statistics Report",
				"value" : 48,
				"key" : "lin.psr",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Total number of sockets and its breakup",
				"value" : 48,
				"key" : "lin.sck",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Num of swap pages taken in or out per sec",
				"value" : 48,
				"key" : "lin.swpag",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "FileSystem Disk Space Usage",
				"value" : 2,
				"key" : "lin.df",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Linux Free Command",
				"value" : 2,
				"key" : "lin.freecmd",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Var Log Messages",
				"value" : 2,
				"key" : "varlogmsg",
				"selected" : false,
				"title" : "Event Source"
			}],
			"expanded" : false,
			"f_data" : [{
				"label" : "Open Files Information",
				"value" : 8999,
				"key" : "lsofnm",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Apache Access log",
				"value" : 2750,
				"key" : "apcl",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Top Command Process Info",
				"value" : 686,
				"key" : "cputop",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "PROCESS(ps ax) DATA",
				"value" : 676,
				"key" : "psax",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "CPU Utilization",
				"value" : 336,
				"key" : "lin.cpuinfo",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Diskstat from Proc",
				"value" : 130,
				"key" : "procdskstatinfonm",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Stats on failures from the N/W dev.",
				"value" : 96,
				"key" : "lin.netfailrep",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Context Switches per Second",
				"value" : 48,
				"key" : "lin.cswch",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Num of Read and Write req and blocks per sec",
				"value" : 48,
				"key" : "lin.dwps",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Number of inode, file and super block used",
				"value" : 48,
				"key" : "lin.inode",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Interrupts Per Second",
				"value" : 48,
				"key" : "lin.intrp",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Memory and swap space utilization statistics",
				"value" : 48,
				"key" : "lin.memutil",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Memory Status Report",
				"value" : 48,
				"key" : "lin.msr",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Processes Created per Second",
				"value" : 48,
				"key" : "lin.proc",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Processes-Q len,tot num,avg load in 15 mins",
				"value" : 48,
				"key" : "lin.prold",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Paging Statistics Report",
				"value" : 48,
				"key" : "lin.psr",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Total number of sockets and its breakup",
				"value" : 48,
				"key" : "lin.sck",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Num of swap pages taken in or out per sec",
				"value" : 48,
				"key" : "lin.swpag",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "FileSystem Disk Space Usage",
				"value" : 2,
				"key" : "lin.df",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Linux Free Command",
				"value" : 2,
				"key" : "lin.freecmd",
				"selected" : false,
				"title" : "Event Source"
			}, {
				"label" : "Var Log Messages",
				"value" : 2,
				"key" : "varlogmsg",
				"selected" : false,
				"title" : "Event Source"
			}]
		}];
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		$scope.resetFacets();
		expect($scope.selectedFacets).toEqual({
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		});
		expect($scope.facets).toEqual([{
			key : 'obs_url',
			label : 'Bundle URL',
			data : [],
			expanded : false,
			f_data : []
		}, {
			key : 'sys_display_name',
			label : 'Host Name',
			data : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 9992,
				selected : false
			}, {
				title : 'Host Name',
				label : 'gbh-cass-dr',
				value : 4295,
				selected : false
			}, {
				title : 'Host Name',
				label : 'gbh-solr-01',
				value : 924,
				selected : false
			}],
			expanded : true,
			f_data : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 9992,
				selected : true
			}, {
				title : 'Host Name',
				label : 'gbh-cass-dr',
				value : 4295,
				selected : true
			}, {
				title : 'Host Name',
				label : 'gbh-solr-01',
				value : 924,
				selected : false
			}]
		}, {
			key : 'sys_hwaddr',
			label : 'Mac Address',
			data : [{
				title : 'Mac Address',
				label : '00:0C:29:9E:F5:12',
				value : 9992,
				selected : false
			}, {
				title : 'Mac Address',
				label : '00:0C:29:21:24:D2',
				value : 4295,
				selected : false
			}],
			expanded : false,
			f_data : [{
				title : 'Mac Address',
				label : '00:0C:29:9E:F5:12',
				value : 9992,
				selected : false
			}, {
				title : 'Mac Address',
				label : '00:0C:29:21:24:D2',
				value : 4295,
				selected : false
			}]
		}, {
			key : 'namespace',
			label : 'Section Name',
			data : [{
				label : 'Unpared Data',
				value : 40,
				key : 'unparsed',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'CPU info from proc',
				value : 24,
				key : 'proccpuinfo',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Slabinfo Version',
				value : 4,
				key : 'slabinfonmversion',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Linux Logs',
				value : 3,
				key : 'lin',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'FileSystem Mount Information',
				value : 3,
				key : 'lin.mount',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Apache Version',
				value : 2,
				key : 'lin.apcversion',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Mysql Version',
				value : 2,
				key : 'lin.mysqlver',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Mem info from proc',
				value : 2,
				key : 'lin.procmeminfo',
				selected : false,
				title : 'Section Name'
			}],
			expanded : false,
			f_data : [{
				label : 'Unpared Data',
				value : 40,
				key : 'unparsed',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'CPU info from proc',
				value : 24,
				key : 'proccpuinfo',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Slabinfo Version',
				value : 4,
				key : 'slabinfonmversion',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Linux Logs',
				value : 3,
				key : 'lin',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'FileSystem Mount Information',
				value : 3,
				key : 'lin.mount',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Apache Version',
				value : 2,
				key : 'lin.apcversion',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Mysql Version',
				value : 2,
				key : 'lin.mysqlver',
				selected : false,
				title : 'Section Name'
			}, {
				label : 'Mem info from proc',
				value : 2,
				key : 'lin.procmeminfo',
				selected : false,
				title : 'Section Name'
			}]
		}, {
			key : 'obs_date_str',
			label : 'System Time',
			data : [],
			expanded : false,
			f_data : []
		}, {
			key : 'sys_timezone',
			label : 'System Time Zone',
			data : [{
				title : 'System Time Zone',
				label : '-0700',
				value : 14287,
				selected : false
			}],
			expanded : false,
			f_data : [{
				title : 'System Time Zone',
				label : '-0700',
				value : 14287,
				selected : false
			}]
		}, {
			key : 'apc_ipaddr',
			label : 'Apache Access Log IP',
			data : [{
				title : 'Apache Access Log IP',
				label : '172.31.42.3',
				value : 2692,
				selected : false
			}, {
				title : 'Apache Access Log IP',
				label : '172.31.42.29',
				value : 56,
				selected : false
			}, {
				title : 'Apache Access Log IP',
				label : '127.0.0.1',
				value : 2,
				selected : false
			}],
			expanded : false,
			f_data : [{
				title : 'Apache Access Log IP',
				label : '172.31.42.3',
				value : 2692,
				selected : false
			}, {
				title : 'Apache Access Log IP',
				label : '172.31.42.29',
				value : 56,
				selected : false
			}, {
				title : 'Apache Access Log IP',
				label : '127.0.0.1',
				value : 2,
				selected : false
			}]
		}, {
			key : 'evt_date_str',
			label : 'Event Date',
			data : [],
			expanded : false,
			f_data : []
		}, {
			key : 'events',
			label : 'Event Source',
			data : [{
				label : 'Open Files Information',
				value : 8999,
				key : 'lsofnm',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Apache Access log',
				value : 2750,
				key : 'apcl',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Top Command Process Info',
				value : 686,
				key : 'cputop',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'PROCESS(ps ax) DATA',
				value : 676,
				key : 'psax',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'CPU Utilization',
				value : 336,
				key : 'lin.cpuinfo',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Diskstat from Proc',
				value : 130,
				key : 'procdskstatinfonm',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Stats on failures from the N/W dev.',
				value : 96,
				key : 'lin.netfailrep',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Context Switches per Second',
				value : 48,
				key : 'lin.cswch',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Num of Read and Write req and blocks per sec',
				value : 48,
				key : 'lin.dwps',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Number of inode, file and super block used',
				value : 48,
				key : 'lin.inode',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Interrupts Per Second',
				value : 48,
				key : 'lin.intrp',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Memory and swap space utilization statistics',
				value : 48,
				key : 'lin.memutil',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Memory Status Report',
				value : 48,
				key : 'lin.msr',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Processes Created per Second',
				value : 48,
				key : 'lin.proc',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Processes-Q len,tot num,avg load in 15 mins',
				value : 48,
				key : 'lin.prold',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Paging Statistics Report',
				value : 48,
				key : 'lin.psr',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Total number of sockets and its breakup',
				value : 48,
				key : 'lin.sck',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Num of swap pages taken in or out per sec',
				value : 48,
				key : 'lin.swpag',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'FileSystem Disk Space Usage',
				value : 2,
				key : 'lin.df',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Linux Free Command',
				value : 2,
				key : 'lin.freecmd',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Var Log Messages',
				value : 2,
				key : 'varlogmsg',
				selected : false,
				title : 'Event Source'
			}],
			expanded : false,
			f_data : [{
				label : 'Open Files Information',
				value : 8999,
				key : 'lsofnm',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Apache Access log',
				value : 2750,
				key : 'apcl',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Top Command Process Info',
				value : 686,
				key : 'cputop',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'PROCESS(ps ax) DATA',
				value : 676,
				key : 'psax',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'CPU Utilization',
				value : 336,
				key : 'lin.cpuinfo',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Diskstat from Proc',
				value : 130,
				key : 'procdskstatinfonm',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Stats on failures from the N/W dev.',
				value : 96,
				key : 'lin.netfailrep',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Context Switches per Second',
				value : 48,
				key : 'lin.cswch',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Num of Read and Write req and blocks per sec',
				value : 48,
				key : 'lin.dwps',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Number of inode, file and super block used',
				value : 48,
				key : 'lin.inode',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Interrupts Per Second',
				value : 48,
				key : 'lin.intrp',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Memory and swap space utilization statistics',
				value : 48,
				key : 'lin.memutil',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Memory Status Report',
				value : 48,
				key : 'lin.msr',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Processes Created per Second',
				value : 48,
				key : 'lin.proc',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Processes-Q len,tot num,avg load in 15 mins',
				value : 48,
				key : 'lin.prold',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Paging Statistics Report',
				value : 48,
				key : 'lin.psr',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Total number of sockets and its breakup',
				value : 48,
				key : 'lin.sck',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Num of swap pages taken in or out per sec',
				value : 48,
				key : 'lin.swpag',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'FileSystem Disk Space Usage',
				value : 2,
				key : 'lin.df',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Linux Free Command',
				value : 2,
				key : 'lin.freecmd',
				selected : false,
				title : 'Event Source'
			}, {
				label : 'Var Log Messages',
				value : 2,
				key : 'varlogmsg',
				selected : false,
				title : 'Event Source'
			}]
		}]);
		$scope.selectedFacets = {
			"obs_url" : [{
				'title' : 'unit'
			}],
			"sys_display_name" : 'Unit test'
		};
		$scope.resetFacets();
		expect($scope.selectedFacets).toEqual({
			"obs_url" : [],
			"sys_display_name" : 'Unit test'
		});
	}));

	it('Should have checkDisabled', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogVaultCtrl', {
			'$scope' : $scope
		});
		expect($scope.checkDisabled).toEqual(jasmine.any(Function));
		var facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 9992,
			"selected" : true
		};
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var disabledValue = $scope.checkDisabled(facet, f_data);
		expect(disabledValue).toBeFalsy();
		facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}]
		};
		f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 9992,
			"selected" : true,
			"disabled" : true
		};
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : true
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		disabledValue = $scope.checkDisabled(facet, f_data);
		expect(disabledValue).toBeTruthy();
	}));
}); 