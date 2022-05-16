'use strict';

window.getCookie = function(name) {
  var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}

window.urlError = function() {
    var new_url = window.location.href.substring(0, window.location.href.indexOf('#'));
    window.location.replace(new_url);
}
var initialAPIs = true;
// Declare app level module which depends on views, and core components
var app = angular.module('gbApp', [
    'gbApp.filters',
	'gbApp.services',
	'gbApp.controllers',
	'gbApp.globals',
    'gbApp.directives',
	'ngCookies',
    'ngStorage',
])
.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    //var dashboardurlDomain = GlobalService.getVal('reportBaseUrl');
    var dashboardurlDomain = window.reportBaseUrl;
    //set report url, CROSS-ORIGIN error
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from outer templates domain.
      dashboardurlDomain
    ]); 

  }]);

//Changes as part of login migration
app.factory( 'session', function GetSession($http, $q,$cookies, $location, $rootScope, metaDataService, GlobalService, $window, AppService, $timeout){
    //set page title
    document.title = GlobalService.getVal("mainTitle");
    document.domain = GlobalService.getVal('primaryDomain');
    var defer = $q.defer();
    var mps = AppService.getMPS();
    var infoserverUp = false;
    //logout after waiting ...
    $timeout(function() {
        if(!infoserverUp) {
            $window.location.href = (getCookie("loginurl") ? getCookie("loginurl") : GlobalService.getVal('session_redirect_url')).replace(/\?.*/, '') + "?server_error=true";
        }
    }, GlobalService.getVal('infoserverTimeout'));


	var mfr = mps.split("/")[0];

    //GET ui config information
    var config = {
        'method': "GET",
        'url' : "/apps/config/uiconfig.json"
    }

    $http(config).success(function (data, status, headers, config) {
        var uiConfig = {};
        var umsDomain = "";
        if(data) {
            uiConfig = data;
            metaDataService.setUiConfig(uiConfig);
            umsDomain = "umsDomain=" +uiConfig["umsDomain"];
            GlobalService.setSessionCookies(umsDomain);
            for(var key in uiConfig) {
                var strValue = key + "=" +uiConfig[key];
                GlobalService.setSessionCookies(strValue);
            }
        }

        umsDomain = uiConfig["umsDomain"];
        var slaves = {};
        if(umsDomain) {
            var tArray = umsDomain.split('/');
            var version = tArray.pop();
            slaves[tArray.join("/")]= "/"+version+"/xproxy";
        }

        xdomain.slaves(slaves);

		GlobalService.setVal('feedbackButtonEnabled', uiConfig['feedbackButtonEnabled']);
		GlobalService.setVal('logstatusEnabled', uiConfig['logstatusEnabled']);
		GlobalService.setVal('umsDomain', uiConfig['umsDomain']);
		GlobalService.setVal('session_redirect_url', uiConfig['sessionRedirectUrl']);
        GlobalService.setGlobals(uiConfig['adminEmail']);

        var mpsFound = false;
        var projectNameFound = false;
        var roleMPS = mps;
        
        var query = $window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if (decodeURIComponent(pair[0]) == decodeURIComponent('mps')) {
            mpsFound = true;
          }
          if (decodeURIComponent(pair[0]) == decodeURIComponent('projectname')) {
            projectNameFound = true;
            GlobalService.setVal('projectname', decodeURIComponent(pair[1]));
          } 
        }
        if(!!mpsFound && !!projectNameFound) {
            roleMPS = metaDataService.getStudioMPS();
        }
        var config = {
            'method': "GET",
            'url' : umsDomain + "/admin/role/user/details/" + roleMPS
        }
        //Get yser details
        $http(config).success(function (data, status, headers, config) {
            data = data.Data;
            $rootScope.metaData = data;
            if(data){
                var len = data.length;
                var elemntsStr = "";
                for(var key in data){
                    if(key == 'role_details'){
                        metaDataService.setFeature(data[key]['features']);
                    }
                    if(key == 'user'){
                           metaDataService.setUser(data[key][0]);
                    }
                }

            }else{
                AppService.logOutUrl();
            }
            var infoserverDomain;

            GlobalService.setVal('role_details', data.role_details);
            GlobalService.setVal('events_export_limit', data.user[0].events_export_limit);
            
            if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_isdomain') && data.role_details.mps_isdomain.hasOwnProperty(mps.replace(/\//g, ":"))) {
                infoserverDomain = data.role_details.mps_isdomain[mps.replace(/\//g, ":")];
            }
            
            //Logotu user if there is no infoserver configure
            if(!infoserverDomain) {
                AppService.logOutUrl();
            }

            if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_uidomain')) {
                var splitMPS = AppService.getMPS().split(/:|\//g);
                GlobalService.setVal('manufacturer', splitMPS[0]);
                GlobalService.setVal('product', splitMPS[1]);
                GlobalService.setVal('schema', splitMPS[2]);
            }

            var slaves = {};
            if(umsDomain) {      
                var tArray = umsDomain.split('/');
                var version = tArray.pop();
                slaves[tArray.join("/")] = "/"+version+"/xproxy";
            }
            if(infoserverDomain) {
                var tArray = infoserverDomain.split('/');
                var version = tArray.pop();
                slaves[tArray.join("/")] = "/"+version+"/xproxy";
            }
    
            xdomain.slaves(slaves);
            
            GlobalService.setVal('infoserverDomain', infoserverDomain);
            
            if(!GlobalService.getVal('manufacturer')) {
                AppService.logOutUrl();
            }

            var apiMPS = null;
            var apiEC = null;

            apiMPS = GlobalService.getVal('manufacturer') + "/" + GlobalService.getVal('product') + "/" + GlobalService.getVal('schema');
            apiEC = GlobalService.getVal('manufacturer');

            $http.get(infoserverDomain+"/mpse/config/details/" + apiMPS + "/" + apiEC).success(function (data, status, headers, config) {
                infoserverUp = true;
    			initialAPIs = false;
    			if(data.Data){
    				metaDataService.setDomain(data.Data);
    			}else{
    				AppService.logOutUrl();
                }
                defer.resolve('done');
            }).error(function(data, status, headers, config) {
				AppService.logOutUrl(data.Msg);
                defer.reject();
			});
        }).error(function(data, status, headers, config){
            AppService.logOutUrl(data.Msg);
            defer.reject();
        });
    }).error(function (data, status, headers, config) {
        AppService.logOutUrl(data.Msg);
        defer.reject();
    });
    return defer.promise;
});

window.addEventListener('message', function(e) {
    var message = e.data;
    if(message === "gb_click_event_from_tableau"){
      //trigger event traker API
      tableauUserTracking();
    }
  });
