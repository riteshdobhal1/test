(function(){
'use strict';

angular.module('gbLogStatusApp', [
	'gbLogStatusApp.controllers',
	'gbLogStatusApp.services',
	'gbLogStatusApp.globalservices',
	'gbLogStatusApp.directives',
	'gbLogStatusApp.filters',
	'ui.bootstrap',
	'ui.slider',
	'ngCookies',
	'ngDraggable',
	'ngAnimate',
	'ngRoute',
	'ngTable'
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
