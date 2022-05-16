'use strict';

window.getCookie = function(name) {
  var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}

var app = angular.module('gbApp', [
	'gbApp.controllers', 
	'gbApp.globalsMsg', 
	'ngCookies', 
	'ngDraggable',
	'ngAnimate'
])
.factory( 'session', function GetSession( $q, $http, GlobalServiceError, $cookies){	
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
			GlobalServiceError.setGlobals(uiConfig['adminEmail']);
	    }

	    defer.resolve('done');

	}).error(function (data, status, headers, config) {       
	    defer.reject();
	});
    return defer.promise;
} );