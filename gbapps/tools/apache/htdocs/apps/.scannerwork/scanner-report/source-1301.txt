'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('gbSupportApp', [
	'gbApp.filters', 
	'gbApp.directives', 
	'gbApp.globals', 
	'gbApp.controllers.rules', 
	'gbApp.services',
	'gbApp.services.rules', 
	'ui.bootstrap', 
	'ngCookies', 
	'ngTable', 
	'ngDraggable',
	'angularFileUpload', 
	'ngAnimate', 
	'ui.slider', 
	'ui.unique',
	'sly'
]).value('manufacturer', getCookie('manufacturer'))
.value('product', getCookie('product'))
.value('infoserverDomain', unescape(getCookie('infoserver_domain')))
.value('infoserverDomainStaging', unescape(getCookie('infoserver_domain_staging')))
.value('schema', getCookie('schema'))
.value('infoserverStagingSchema', getCookie('infoserver_staging_schema'))
.value('adminEmail', getCookie('adminEmail'));

app.factory( 'session', function GetSession($http, $q, $rootScope, $location,$cookies, infoserverDomain ){
    var defer = $q.defer();

    var protocol = $location.protocol();
	var internal_domain_url = $location.host();
	return $http({
		method : 'GET',
		url : infoserverDomain + '/authenticate/' + $cookies.CGISESSID + '/' + protocol + '/' + internal_domain_url
	}).success(function (data, status, headers, config) {
		defer.resolve('done');
	}).error(function (data, status, headers, config) {
        defer.reject();
    });
 
    return defer.promise;
} );



function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
