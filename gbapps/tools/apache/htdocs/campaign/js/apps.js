(function(){
	'use strict';

	angular.module('gbCampaignApp', [
		'gbCampaignApp.controllers', 
		'gbCampaignApp.services',
		'gbCampaignApp.globalservices',
		'ngCookies', 
		'ngDraggable',
		'ngSanitize',
		'ngAnimate',
		'ngRoute'
	])	
	.factory( 'session', function GetSession( $q, $http, GlobalService, $cookies){	
	    var defer = $q.defer();	
	    //GET ui config information
	    var config = {
	        'method': "GET",
	        'url' : "/apps/config/uiconfig.json"
	    }

		$http(config).success(function (data, status, headers, config) {
		    var uiConfig = {};
		    if(data) {
		        uiConfig = data;
		        var umsDomain = uiConfig["umsDomain"];
		        GlobalService.setValue("UMSDOMAIN", umsDomain);
		        GlobalService.setValue("oldStackLoginUrl", uiConfig["oldStackLoginUrl"]);
		        GlobalService.setValue("oldStackCustomers", uiConfig["oldStackCustomers"]);
		        GlobalService.setValue("LOGIN_URL", uiConfig["sessionRedirectUrl"]);
		        GlobalService.setValue("adminEmail", uiConfig["adminEmail"]);
	            if(uiConfig["domainMps"]) {
	            	GlobalService.setValue("domainMps", uiConfig["domainMps"]);;
	            }
		    }
			umsDomain = uiConfig["umsDomain"];
		    if(umsDomain) {    	
				var tArray = umsDomain.split('/');
				var version = tArray.pop();
				var slaves = {};
				slaves[tArray.join("/")]= "/"+version+"/xproxy";
				xdomain.slaves(slaves);
		    }
		    defer.resolve('done');

		}).error(function (data, status, headers, config) {       
		    defer.reject();
		});
	    return defer.promise;
	} );
})();
