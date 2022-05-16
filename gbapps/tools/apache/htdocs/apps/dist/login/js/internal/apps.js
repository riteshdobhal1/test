(function(){
'use strict';

angular.module('gbLoginApp', [
	'gbLoginApp.controllers', 
	'gbLoginApp.services',
	'gbLoginApp.globalservices',
	//'ui.bootstrap',
	'ngCookies', 
	'ngDraggable',
	'ngAnimate',
	'ngRoute'
])
.config(function($routeProvider) {
		var urlpart = "";
		if(window.location.href.indexOf('/login') == -1){
			urlpart = "login/";
		}
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : urlpart + 'user.html',
                controller  : 'LoginCtrl'
            })


            // route for the forgot-password page
            .when('/forgot-password', {
                templateUrl : urlpart + 'forgot-password.html',
                controller  : 'ForgotPasswordCtrl'
            })
            // route for the change-password page
            .when('/change-password', {
                templateUrl : urlpart + 'change-password.html',
                controller  : 'ForgotPasswordCtrl'
            });
    })
//Changes as part of login migration
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
			/*var umsDomain = "umsDomain=" + uiConfig["infoserverInternalDomain"];
			GlobalService.setSessionCookies(umsDomain);
	        for(var key in uiConfig) {
	        	if(key == 'umsDomain') continue;
	        	var strValue = key + "=" +uiConfig[key];
	        	GlobalService.setSessionCookies(strValue);
	        }*/
	        var umsDomain = uiConfig["umsDomain"];
	        GlobalService.setVal("umsDomain", umsDomain);
            if(uiConfig["domainMps"]) {
		var domain = window.location.hostname;
                 var dom = domain.split(".",1);
                 var domain_mps = uiConfig["domainMps"][dom];
                GlobalService.setVal("domainMps", domain_mps);

            	//GlobalService.setVal("domainMps", uiConfig["domainMps"]);;
            }
            
	    }
	    if(umsDomain) {    	
			var tArray = umsDomain.split('/');
			var version = tArray.pop();
			var slaves = {};
			slaves[tArray.join("/")]= "/"+version+"/xproxy";
			xdomain.slaves(slaves);
	    }
	    var infoserverInternalDomain = uiConfig["infoserverInternalDomain"];
	    GlobalService.setVal("infoserverInternalDomain", infoserverInternalDomain);
	    if(infoserverInternalDomain) {    	
			var tArray = infoserverInternalDomain.split('/');
			var version = tArray.pop();
			var slaves = {};
			slaves[tArray.join("/")]= "/"+version+"/xproxy";
			xdomain.slaves(slaves);
	    }

	    defer.resolve('done');

	}).error(function (data, status, headers, config) {       
	    defer.reject();
	});
    //set page title
    document.title = GlobalService.getVal("mainTitle");
    return defer.promise;
} );


})();

window.getCookie = function(name) {
  match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}
window.load = function(){
	var umsDomain = getCookie('umsDomain');
	if(umsDomain){		  	
		var tArray = umsDomain.split('/');
		var version = tArray.pop();
		var slaves = {};
		slaves[tArray.join("/")]= "/"+version+"/xproxy";
		xdomain.slaves(slaves);
	}
}
