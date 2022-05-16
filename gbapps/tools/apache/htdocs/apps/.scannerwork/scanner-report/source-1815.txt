(function(){
'use strict';

angular.module('gbAdminApp', [
	'gbAdminApp.controllers',
	'gbAdminApp.services',
	'gbAdminApp.globalservices',
	//'ui.bootstrap',
	'ngCookies',
	'ngDraggable',
	'ngAnimate',
	'ngRoute',
	'ngTable',
	'gbAdminApp.filters',
	'gbAdminApp.directives'
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
