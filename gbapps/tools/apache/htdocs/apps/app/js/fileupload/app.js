'use strict';

window.getCookie = function(name) {
  var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}

var initialAPIs = true;

// Declare app level module which depends on filters, and services
var app = angular.module('gbFileuploadApp', [
	'gbApp.filters', 
	'gbApp.directives', 
	'gbApp.globals', 
	'gbApp.controllers.fileupload', 
	'gbApp.services',
	'ui.bootstrap', 
	'ngCookies', 
	'ngTable', 
	'ngDraggable',
	'angularFileUpload', 
	'ngAnimate', 
	'ui.slider', 
	'ui.unique',
	'sly'
]).value('manufacturer', "aruba")
.value('product',  "ap")
.value('schema',  "pod")

app.factory( 'session', function GetSession($http, $q,$cookies, $location, $rootScope, metaDataService, GlobalService, $window, AppService, $timeout, manufacturer, product, schema){
    //set page title
    document.title = GlobalService.getVal("mainTitle");
    var defer = $q.defer();
    var mps = manufacturer + "/" + product + "/" + schema;
    var infoserverUp = false;
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
        if(data) {
            uiConfig = data;
            metaDataService.setUiConfig(uiConfig);
            var umsDomain = "umsDomain=" +uiConfig["umsDomain"];
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
        GlobalService.setVal('umsDomain', uiConfig['umsDomain']);
        GlobalService.setVal('session_redirect_url', uiConfig['sessionRedirectUrl']);
        GlobalService.setGlobals(uiConfig['adminEmail']);
        /* var domain_details_str=$cookies.domain_details; 
        var domain_details_obj = JSON.parse(domain_details_str);
        
        var user_details_str = $cookies.user_details;
        var user_details_obj = JSON.parse(user_details_str);
        console.log(domain_details_obj["features"]);
        console.log(user_details_obj);
        metaDataService.setFeature(domain_details_obj["features"]);
        metaDataService.setFeature(user_details_obj); */

        //console.log(cookie_parse);debugger;       
        /*
        ** Call user details api - meta data
        */
        var config = {
            'method': "GET",
            'url' : umsDomain + "/admin/role/user/details/" + mps
        }
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
            
            if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_isdomain') && data.role_details.mps_isdomain.hasOwnProperty(mps.replace(/\//g, ":"))) {
                infoserverDomain = data.role_details.mps_isdomain[mps.replace(/\//g, ":")];
            } else {
                AppService.logOutUrl();
            }
            
            GlobalService.setVal('showStudio', data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_uidomain') && data.role_details.mps_uidomain.hasOwnProperty(GlobalService.getVal('gb_studio_realm')));
            // if(GlobalService.getVal('showStudio')) {
            //     GlobalService.setVal('studioURL', data.role_details.mps_uidomain[GlobalService.getVal('gb_studio_realm')]);
            // }

            var slaves = {};
            if(umsDomain) {      
                var tArray = umsDomain.split('/');
                var version = tArray.pop();
                slaves[tArray.join("/")]= "/"+version+"/xproxy";
            }
            if(infoserverDomain) {
                var tArray = infoserverDomain.split('/');
                var version = tArray.pop();
                slaves[tArray.join("/")]= "/"+version+"/xproxy";
            }
    
            xdomain.slaves(slaves);

            GlobalService.setVal('infoserverDomain', infoserverDomain);
            
            if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_uidomain')) {
                if(data.role_details.mps_uidomain[mps.replace(/\//g, ':')] != $location.host()) {
                    angular.forEach(data.role_details.mps_uidomain, function(value, key) {
                        if(value === $location.host()) {
                            var splitMPS = key.split(/:|\//g);
                            GlobalService.setVal('manufacturer', splitMPS[0]);
                            GlobalService.setVal('product', splitMPS[1]);
                            GlobalService.setVal('schema', splitMPS[2]);
                        }
                    });
                } else {
                    var splitMPS = mps.split(/:|\//g);
                    GlobalService.setVal('manufacturer', splitMPS[0]);
                    GlobalService.setVal('product', splitMPS[1]);
                    GlobalService.setVal('schema', splitMPS[2]);
                }
            }
            
            if(!GlobalService.getVal('manufacturer')) {
                AppService.logOutUrl();
            }

            $http.get(infoserverDomain+"/mpse/config/details/" + GlobalService.getVal('manufacturer') + "/" + GlobalService.getVal('product') + "/" + GlobalService.getVal('schema') + "/" + GlobalService.getVal('manufacturer')).success(function (data, status, headers, config) {
                infoserverUp = true;
                initialAPIs = false;
                if(data.Data){          
                    metaDataService.setDomain(data.Data);
                }else{
                    AppService.logOutUrl();
                }
                defer.resolve('done');

            }).error(function(data, status, headers, config) {
                AppService.logOutUrl();
                defer.reject();
            });

        }).error(function (data, status, headers, config) {
            AppService.logOutUrl();
            defer.reject();
        }); 
    }).error(function (data, status, headers, config) {       
        defer.reject();
    });

    return defer.promise;
} );