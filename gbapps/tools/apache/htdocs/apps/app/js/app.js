'use strict';

window.getCookie = function(name) {
  var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}
window.urlError = function() {
    var new_url = window.location.href.substring(0, window.location.href.indexOf('#'));
    window.location.replace(new_url);
}
// Safari hack - Reload page if pressed back button
window.onpageshow = function(event) {
    if(event.persisted) {
        window.location.reload()
    }
}
window.dashboardTileImageLoad = function(me){
    if(!me || !me.parentNode || !me.parentNode.getElementsByClassName('gb-data-loading-center') || !me.parentNode.getElementsByClassName('gb-data-loading-center')[0]) return;
    me.className='gb-thumbnail-show'; 
    me.parentNode.getElementsByClassName('gb-data-loading-center')[0].className='gb-thumbnail-loading-hide';
}
var initialAPIs = true;

// Declare app level module which depends on filters, and services
var app = angular.module('gbApp', [
	'gbApp.filters',
	'gbApp.services',
	'gbApp.services.explorer',
	'gbApp.services.analytics',
	'gbApp.services.dashboards',
	'gbApp.services.logvault',
	'gbApp.services.workbench',
    'gbApp.services.rules',
	'gbApp.controllers',
	'gbApp.controllers.explorer',
	'gbApp.controllers.analytics',
	'gbApp.controllers.dashboards',
	'gbApp.controllers.logvault',
	'gbApp.controllers.workbench',
	'gbApp.controllers.rules',
    'gbApp.controllers.gbtour',
    'gbApp.directives',
    'gbApp.directives.rulesandalerts',
	'gbApp.globals',
	'ui.bootstrap',
	'ngCookies',
	'ngTable',
    'ngStorage',
	'ngDraggable',
	'angularFileUpload',
	'ngAnimate',
	'ui.slider',
	'ui.unique',
    'toggle-switch',
	'xml',
	'sly',
	'angular-send-feedback',
    'infinite-scroll',
    'moment-picker'
])
.value('useLocal',  getCookie('useLocal'))
.value('$modalInstance', null)
.value('fileUploadData', 'NA')

.config(['$httpProvider', 'momentPickerProvider', function($httpProvider, momentPickerProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    momentPickerProvider.options({
        /* Picker properties */
        locale:        'en',
        format:        'L LTS',
        minView:       'decade',
        maxView:       'minute',
        startView:     'month',
        autoclose:     true,
        today:         true,
        keyboard:      false,

        /* Extra: Views properties */
        leftArrow:     '&larr;',
        rightArrow:    '&rarr;',
        yearsFormat:   'YYYY',
        monthsFormat:  'MM',
        daysFormat:    'D',
        hoursFormat:   'HH:[00]',
        minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
        secondsFormat: 'ss',
        minutesStep:   1,
        secondsStep:   1
    });
}]);
//Changes as part of login migration
app.factory( 'session', function GetSession($http, $q,$cookies, $location, $rootScope, metaDataService, GlobalService, $window, AppService, ModalService, $timeout){
    //set page title
    document.title = GlobalService.getVal("mainTitle");
    document.domain = GlobalService.getVal("primaryDomain");
    var defer = $q.defer();
    var mps = AppService.getMPS();
    var infoserverUp = false;
    if($location.$$search.dash_mode) {
        sessionStorage.setItem("dash_mode", "true");
        if($location.$$search.rdreport){
            sessionStorage.setItem("rdreport", $location.$$search.rdreport)
        }
        if(!$location.$$search.did || !$location.$$search.rid){
            var modal = ModalService.openModal('partials/urlerrordashmode.html');
            return defer.promise;
        }
        if(localStorage.getItem("did")){
            var tempDidList = localStorage.getItem("did").split(",");
            tempDidList.push($location.$$search.did);
            localStorage.setItem("did", tempDidList.toString());
        }else {
            localStorage.setItem("did", $location.$$search.did);
        }
        if(localStorage.getItem("rid")){
            var tempRidList = localStorage.getItem("rid").split(",");
            tempRidList.push($location.$$search.rid);
            localStorage.setItem("rid", tempRidList.toString());
        }else {
            localStorage.setItem("rid", $location.$$search.rid);
        }
    }
    
    //check if clinsights mode, if loaded from notification click
    if($location.$$search.clin_mode) {
        sessionStorage.setItem("clin_mode", "true");
        if($location.$$search.serial_number &&  $location.$$search.rule_name  ){
            sessionStorage.setItem("serial_number", $location.$$search.serial_number);
            sessionStorage.setItem("rule_name", $location.$$search.rule_name);
            sessionStorage.setItem("mps", $location.$$search.mps)
            sessionStorage.setItem("notificationId", $location.$$search.notification_id)
        }
        if(!$location.$$search.serial_number || !$location.$$search.rule_name){
            var modal = ModalService.openModal('partials/urlerrordashmode.html');
            return defer.promise;
        }
      
    }
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
		GlobalService.setVal('logstatusEnabled', uiConfig['logstatusEnabled']);
		GlobalService.setVal('umsDomain', uiConfig['umsDomain']);
		GlobalService.setVal('session_redirect_url', uiConfig['sessionRedirectUrl']);
	
		GlobalService.setGlobals(uiConfig['adminEmail']);		
        /*
        ** Call user details api - meta data
        */
        
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
        $http(config).success(function (data, status, headers, config) {
            data = data.Data;
            $rootScope.metaData = data;
            // angular.forEach(GlobalService.getVal('gb_studio_spl_realms'), function(realm) {
            // 	if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_uidomain') && data.role_details.mps_uidomain.hasOwnProperty(realm)) {
            // 		GlobalService.setVal('gb_studio_spl_realm', realm);
            // 	}
            // });
            // angular.forEach(GlobalService.getVal('gb_studio_apps_realms'), function(realm) {
            // 	if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_uidomain') && data.role_details.mps_uidomain.hasOwnProperty(realm)) {
            // 		GlobalService.setVal('gb_studio_apps_realm', realm);
            // 	}
            // });
            //GlobalService.setVal('showStudio', data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_uidomain') && data.role_details.mps_uidomain.hasOwnProperty(GlobalService.getVal('gb_studio_spl_realm')) && data.role_details.mps_uidomain.hasOwnProperty(GlobalService.getVal('gb_studio_apps_realm')));
            if(data){
                var len = data.length;
                var elemntsStr = "";
                for(var key in data){
                    if(key == 'role_details'){
                        metaDataService.setFeature(data[key]['features']);
                        if(data[key]['explorer_date_range'] && data[key]['explorer_date_range'][mps]){
                            metaDataService.setExplorerDataDuration(data[key]['explorer_date_range'][mps]);
                        }
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
            var is_external = data.user[0].is_external;
	    if(is_external && $cookies.loginurl){
		var session_redirect_url = $cookies.loginurl.split("#");
		GlobalService.setVal('session_redirect_url',session_redirect_url[0]);	
	    }
            if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_isdomain')) {
                infoserverDomain = data.role_details.mps_isdomain[mps];
                var infoserverLocation= "infoserverDomain=" +infoserverDomain;
                GlobalService.setSessionCookies(infoserverLocation);
            }
            
            // if(GlobalService.getVal('showStudio')) {
            //     GlobalService.setVal('studioSPLURL', data.role_details.realm_uidomain[GlobalService.getVal('gb_studio_spl_realm')]);
            //     GlobalService.setVal('studioURL', data.role_details.realm_uidomain[GlobalService.getVal('gb_studio_apps_realm')]);
            //     if(data.role_details.realm_uidomain[GlobalService.getVal('gb_studio_apps_realm')] == $location.host()) {
            //         infoserverDomain = data.role_details.mps_isdomain[metaDataService.getStudioMPS()];
            //     }
            // }
            
            if(!infoserverDomain) {
                AppService.logOutUrl();
            }

            //multi mps support when opening dashboard from push notification
            //check if clinsights mode, if loaded from notification click
            if ($location.$$search.clin_mode && sessionStorage.getItem("mps")){
                if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_uidomain')) {
                    if((data.role_details.mps_uidomain[mps] != $location.host()) && !(AppService.isGbStudioApp() || GlobalService.getVal('userSso'))) {
                        angular.forEach(data.role_details.mps_uidomain, function(value, key) {
                            if(value === $location.host()) {
                                var splitMPS = key.split(/:|\//g);
                                GlobalService.setVal('manufacturer', splitMPS[0]);
                                GlobalService.setVal('product', splitMPS[1]);
                                GlobalService.setVal('schema', splitMPS[2]);
                                infoserverDomain = data.role_details.mps_isdomain[key];
                            }
                        });
                    } else {
                        if(Object.values(data.role_details.domains).includes(sessionStorage.getItem("mps"))){
                            var splitMPS = sessionStorage.getItem("mps").split('/');
                        }else{
                            var splitMPS = AppService.getMPS().split(/:|\//g);
                        }
                        document.cookie = "mps=" + splitMPS[0] + "/" + splitMPS[1] + "/" + splitMPS[2]  + ";path=/ ;domain=glassbeam.com" ;
                        GlobalService.setVal('manufacturer', splitMPS[0]);
                        GlobalService.setVal('product', splitMPS[1]);
                        GlobalService.setVal('schema', splitMPS[2]);
                    }
                }
            }else{
                if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('mps_uidomain')) {
                    if((data.role_details.mps_uidomain[mps] != $location.host()) && !(AppService.isGbStudioApp() || GlobalService.getVal('userSso'))) {
                        angular.forEach(data.role_details.mps_uidomain, function(value, key) {
                            if(value === $location.host()) {
                                var splitMPS = key.split(/:|\//g);
                                GlobalService.setVal('manufacturer', splitMPS[0]);
                                GlobalService.setVal('product', splitMPS[1]);
                                GlobalService.setVal('schema', splitMPS[2]);
                                infoserverDomain = data.role_details.mps_isdomain[key];
                            }
                        });
                    } else {
                        var splitMPS = AppService.getMPS().split(/:|\//g);
                        GlobalService.setVal('manufacturer', splitMPS[0]);
                        GlobalService.setVal('product', splitMPS[1]);
                        GlobalService.setVal('schema', splitMPS[2]);
                    }
                }
            }
          //  alert(infoserverDomain); 
            if(data.hasOwnProperty('role_details') && data.role_details.hasOwnProperty('realm_appsversion')) {
            	var key = !AppService.isGbStudioApp() ? GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') : GlobalService.getVal('gbstudio_manufacturer') + ':' + GlobalService.getVal('gbstudio_product') + ':' + GlobalService.getVal('gbstudio_schema');
            	GlobalService.setVal('appsVersion', data['role_details']['realm_appsversion'][key]);
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
            AppService.getClinsightUrl().then(function(response) {
                GlobalService.setVal('clinsightReportUrl', response.data.Data);
                GlobalService.setVal('clinsightFlag', response.data.Data.length > 0 ? true: false);
                
            })
            
            if(!GlobalService.getVal('manufacturer')) {
                AppService.logOutUrl();
            }

            var apiMPS = null;
            var apiEC = null;
            if(AppService.isGbStudioApp()) {
                apiMPS = metaDataService.getStudioMPS();
                apiEC = GlobalService.getVal('gbstudio_manufacturer');
            } else {
                apiMPS = GlobalService.getVal('manufacturer') + "/" + GlobalService.getVal('product') + "/" + GlobalService.getVal('schema');
                apiEC = GlobalService.getVal('manufacturer');
            }
            
            if(!!mpsFound && !!projectNameFound && !AppService.isGbStudioApp()) {
                AppService.logOutUrl();
            }

			$http.get(umsDomain+"/mpse/config/details/" + apiMPS + "/" + apiEC).success(function (data, status, headers, config) {
    			infoserverUp = true;
    			initialAPIs = false;
    			if(data.Data){			
    				metaDataService.setDomain(data.Data);
    			}else
			{
    				AppService.logOutUrl();
                }
                if(device.mobile()){
                $http.get(infoserverDomain+"/dashboards/all/details/merged/" + apiMPS + '/NA/' + metaDataService.getUser().email + '/NA?tableau=false' ).success(function (data, status, headers, config) {
                    var allDashboard = data.Data.dashboards;
                    if(!allDashboard){
                        defer.resolve('done');
                        return true;
                    }
                    var summaryDashboard = allDashboard.filter(function(item,index){
			if(is_external === false){
			
                        return item.d_type.toLowerCase() == 'summary';
			}else{
		        	
			return item.d_type.toLowerCase() == 'healthchecksummary';
			}

                    });
                    	if(summaryDashboard && summaryDashboard[0] && summaryDashboard[0]['reports'] && summaryDashboard[0]['reports'][0]){
			var summaryDashboardUrl = "";
			if(is_external === false){
				for (var idx=0 ; idx < summaryDashboard[0]['reports'].length ; idx++){
					
					if(summaryDashboard[0]['reports'][idx]['d_type'].toLowerCase() == 'summary'){
					  summaryDashboardUrl = summaryDashboard[0]['reports'][idx]['r_link'];
					}
				}
			}else{ 
				summaryDashboardUrl = summaryDashboard[0]['reports'][0]['r_link'];
			}
                        if(device.mobile()){

			   var pageload = "";
			   var url = window.location.href.split("/");
			   url.pop();
			   var error_url = url;
                           error_url.push('errorDashboard.html');
			   error_url = error_url.join("/");
			   if(is_external === true){					    
			   	if(!metaDataService.getFeatures().healthcheck){								
					pageload = "summaryDashboardUrl="+ error_url + "?err=NA";   /// NA = "Not authorized"
			   	}else if(summaryDashboardUrl == "" || summaryDashboardUrl == "NA"){
					pageload = "summaryDashboardUrl="+ error_url + "?err=DNF"; /// DNA = "Dashboard not found"
			   	}else{
                            		pageload = "summaryDashboardUrl="+summaryDashboardUrl;
		           	}
			   }else{
				pageload = "summaryDashboardUrl="+summaryDashboardUrl;
				if(summaryDashboardUrl == "" || summaryDashboardUrl == "NA"){
					pageload = "summaryDashboardUrl="+ error_url + "?err=DNF";
				}
			   }
			   		
                            GlobalService.setSessionCookies(pageload);
                            var url = window.location.href.split("/");
                            url.pop();
                            url.push('dashboard');
                            url.push('index.html');
                            url = url.join("/");
                            window.location.href = url;
                            return;
			   	
                        } 
                           
                       
                    }
                    if(GlobalService.getVal('showStudio')) {
                        AppService.getGBStudioProjects().then(function(response) {
                            if((response.data.hasOwnProperty("Status") && response.data.Status == "Failure") || !response.data.hasOwnProperty("Data")) {
                                GlobalService.setVal('projectsList', {});
                                GlobalService.setVal('studioDown', true);
                                defer.resolve('done');
                            } else {
                                GlobalService.setVal('studioDown', false);
                                GlobalService.setVal('projectsList', response.data.Data.projects);
                                if(AppService.isGbStudioApp()) {
                                    var splitMPS = null;
                                    splitMPS = AppService.getMPSfromQueryParam();
                                    splitMPS = splitMPS.split(/:|\//g);          
                                    GlobalService.setVal('manufacturer', splitMPS[0]);
                                    GlobalService.setVal('product', splitMPS[1]);
                                    GlobalService.setVal('schema', splitMPS[2]);
                                }
                                var projectsList = GlobalService.getVal('projectsList');
                                var found = false;
                                angular.forEach(projectsList, function(value, key) {
                                    if(AppService.isGbStudioApp() && key == GlobalService.getVal('projectname')) {
                                        if(value == GlobalService.getVal('manufacturer') + ":" + GlobalService.getVal('product') + ":" + GlobalService.getVal('schema')) {
                                            found = true;
                                        }
                                    }
                                });
                                if(AppService.isGbStudioApp()) {
                                    if(found) {
                                        AppService.refreshMeta().then(function(response) {
                                            defer.resolve('done');
                                        }, function(response) {
                                            AppService.logOutUrl();
                                            defer.reject();
                                        });
                                        
                                    } else {
                                        GlobalService.setVal('manufacturer', GlobalService.getVal('gbstudio_manufacturer'));
                                        GlobalService.setVal('product', GlobalService.getVal('gbstudio_product'));
                                        GlobalService.setVal('schema', GlobalService.getVal('gbstudio_schema'));
                                        GlobalService.setVal('invalidProjectLoaded', true);
                                        defer.resolve('done');
                                    }
                                } else {
                                    if(response.data.hasOwnProperty("Msg") && !/^\s*$/.test(response.data.Msg) && !found) {
                                        GlobalService.setVal('projectListMsg', response.data.Msg);
                                    }
                                    defer.resolve('done');
                                }
                            }
                        }, function(response) {
                            GlobalService.setVal('projectsList', {});
                            GlobalService.setVal('studioDown', true);
                            defer.resolve('done');
                        });
                        
                    } else {
                        defer.resolve('done');
                    }
                }).error(function(){

                    AppService.logOutUrl();
                    defer.reject();
                });
            }else {
                defer.resolve('done');
            }
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

    var firebaseConfig = {
        'method': "GET",
        'url' : "/apps/config/firebase-config.json"
    }
    $http(firebaseConfig).success(function (data, status, headers, fconfig) {
        var firebaseConfig = {};
        if(data) {
            firebaseConfig = data;
            metaDataService.setFirebaseConfig(firebaseConfig);
            
        }
    
    }).error(function (data, status, headers, config) {       
        defer.reject();
    });
    return defer.promise;
} );
 
//Monkey patching
// Adding getWeek method...
Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() - 1) / 7);
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// Adding Object.keys method to old browsers....
if ( typeof Object.keys !== "function") {
	(function() {
		Object.keys = Object_keys;
		function Object_keys(obj) {
			var keys = [], name;
			for (name in obj) {
				if (obj.hasOwnProperty(name)) {
					keys.push(name);
				}
			}
			return keys;
		}

	})();
}

var dateLocale = {
    en : {
        month_names : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        month_names_short : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};

// Adding getMonthName method...

Date.prototype.getMonthName = function(lang) {
	lang = lang && ( lang in dateLocale) ? lang : 'en';
	return dateLocale[lang].month_names[this.getMonth()];
};
Date.prototype.getMonthNameShort = function(lang) {
	lang = lang && ( lang in dateLocale) ? lang : 'en';
	return dateLocale[lang].month_names_short[this.getMonth()];
};

//polyfill String.prototype.endsWith
if (!String.prototype.endsWith) {
	Object.defineProperty(String.prototype, 'endsWith', {
		value : function(searchString, position) {
			var subjectString = this.toString();
			if (position === undefined || position > subjectString.length) {
				position = subjectString.length;
			}
			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		}
	});
}

// I provide a request-transformation method that is used to prepare the outgoing
// request as a FORM post instead of a JSON packet.
app.factory("transformRequestAsFormPost", function() {

	// I prepare the request data for the form post.
	function transformRequest(data, getHeaders) {

		var headers = getHeaders();

		headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";

		// return( serializeData( data ) );
		return (JSON.stringify(data));
	}

	// Return the factory value.
	return (transformRequest );

	// ---
	// PRVIATE METHODS.
	// ---

	// I serialize the given Object into a key-value pair string. This
	// method expects an object and will default to the toString() method.
	// --
	// NOTE: This is an atered version of the jQuery.param() method which
	// will serialize a data collection for Form posting.
	// --
	// https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
	function serializeData(data) {
		// If this is not an object, defer to native stringification.
		if (! angular.isObject(data)) {
			return ((data == null ) ? "" : data.toString() );
		}
		var buffer = [];
		// Serialize each key in the object.
		for (var name in data ) {

			if (! data.hasOwnProperty(name)) {
				continue;
			}

			var value = data[name];
			buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((value == null ) ? "" : value));
		}
		// Serialize the buffer and clean it up for transportation.
		var source = buffer.join("&").replace(/%20/g, "+");
		return (source );
	}
});
/*
 * Inspect each reuqest and cancel duplicate reuqest
 */
app.factory('httpInterceptor', function ($q, $rootScope, $log, $window, $cookies, GlobalService) {

    var loadingCount = 0;
	var requestBuffer = {};
    return {
        request: function (config) {
        	          
            if(config && config.url){
                var url = config.url;
                var canceler = $q.defer();
                config.timeout = canceler.promise;
                GlobalService.addAPICall(url,config,canceler);
            }
            
        	//inspect method ifside data to be sent
        	var method = "";
        	if(config.data && config.data.method){
        		method = config.data.method;
        		var tempProp = ""+url+method;
        		for(var key in requestBuffer){
        			if(key == tempProp){
        				//cancel the request
        				var cancelableReq = requestBuffer[tempProp];        				
        				cancelableReq.resolve();        				
        			}  
        		}
        		var deferred = $q.defer();
        		config.timeout = deferred.promise;
        		requestBuffer[tempProp]=(deferred);
        	}
            //if(++loadingCount === 1) $rootScope.$broadcast('loading:progress');
            return config || $q.when(config);
        },

        response: function (response) {
        	var config = response.config;            
            if(config && config.url){
                var url = config.url;
                GlobalService.removeAPICall(url,config);
            }
        	//inspect method ifside data to be sent
        	var method = "";
        	if(config.data && config.data.method){
        		method = config.data.method;
        		var tempProp = ""+url+method;
        		for(var key in requestBuffer){        		
        			delete (requestBuffer[tempProp]);
        		}
        		
        	}
        	
            //if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
            // if(url.indexOf('api.cgi') != -1){
            	// $rootScope.$broadcast('PageLoadingComplete');
            // }
            return response || $q.when(response);
        },

        responseError: function (response) {
            var config = response.config;
            if(config && config.url){
                var url = config.url;
                GlobalService.removeAPICall(url);
            }
            //if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
            if(response && response.status && response.status == 403){
                var umsDomain = GlobalService.getVal('umsDomain');
                var application = $cookies.prevApplication;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {

		    var theCookies = document.cookie.split(';');
                        var cookiesList = [],
                            cookiesNameValue,
                            cookiesName;
                        for (var i = 1; i <= theCookies.length; i++) {
                                cookiesNameValue = theCookies[i - 1];
                                cookiesName = cookiesNameValue.split("=")[0];
                                cookiesName = cookiesName.trim();
                                cookiesList.push(cookiesName);
                        }

                        //Set post date to expiry date fo all cookie
                        for (var i = 0; i < cookiesList.length; i++) {
                            cookiesName = cookiesList[i];
                         document.cookie = cookiesName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + GlobalService.getVal('primaryDomain') + ";path=/";
                        } 
			delete $cookies.prevApplication;
                    if(GlobalService.getVal('userSso')) {
                        if(GlobalService.getVal('ssoLogoutUrl'))    {
                            $window.open(GlobalService.getVal('ssoLogoutUrl') + (!initialAPIs ? "?timeout=true" : ""), '_self');
                        }else {
                            $window.open(GlobalService.getVal('session_redirect_url').replace(/\?.*/, '') + (!initialAPIs ? "?timeout=true" : "") , '_self');
                        }
        
                    }else{
                        $window.open((getCookie("loginurl") ? getCookie("loginurl") : GlobalService.getVal('session_redirect_url')).replace(/\?.*/, '') + (!initialAPIs ? "?timeout=true" : ""), '_self');
                    }
                };
                xmlhttp.open("GET", umsDomain + '/aa/logout?mps='+GlobalService.getVal('manufacturer')+':'+GlobalService.getVal('product')+':'+GlobalService.getVal('schema')+'&feature='+application, true);
                xmlhttp.send();
            }else{
                return $q.reject(response);    
            }
            
        }
    };

}).config(function ($httpProvider) {

    $httpProvider.interceptors.push('httpInterceptor');

});

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}
$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    // Do something    
    var leftNav = $('#gb-app-left-nav');
    if( 40 < scroll){
        leftNav.css({top: 0});
    }else{
        leftNav.css({top: '59px'});
    }
});


window.addEventListener('message', function(e) {
    //console.log(e)
  var message = e.data;
  if(message === "gb_click_event_from_tableau"){
    //trigger event traker API
    tableauUserTracking();
  }
  if(message === "push_notification_click"){
    //trigger event traker API
    notificationClick();
  }

});
window.addEventListener('message', function(e) {
  var message = e.data;
  if(message === "gb_click_event_from_scratchpad"){
        scratchpadUserTracking();
   }
   if(message.type === 'setHeight'){
    resizeIframeHeight(message.height);
   }
});
window.addEventListener('message', function(e) {
    var message = e.data;
    if(message === "gb_click_event_from_scratchpad_product_list"){
        $(window).scrollTop(0);
     }
  });
  var swListener = new BroadcastChannel('swListener');
 
