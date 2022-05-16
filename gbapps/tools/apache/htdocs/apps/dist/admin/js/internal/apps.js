(function(){
'use strict';

angular.module('internalAdminApp', [
	'internalAdminApp.controllers',
	'internalAdminApp.services',
	'internalAdminApp.globalservices',
	'ui.bootstrap',
	'ngCookies',
	'ngDraggable',
	'ngAnimate',
	'ngRoute',
	'ngTable',
	'angular-table'
])
.config(function($routeProvider) {
		var urlpart = "";
		if(window.location.href.indexOf('/admin') == -1){
			urlpart = "admin/";
		}
    })
})();
window.getCookie = function(name) {
  match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}
