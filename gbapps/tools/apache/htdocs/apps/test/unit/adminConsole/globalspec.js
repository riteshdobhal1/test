'use strict';

/* jasmine specs for log vault controllers go here */

describe('GlobalService : ', function() {

    var manufacturer, product, schema, umsDomain;

	beforeEach(module('gbAdminApp.controllers', 'gbAdminApp.services', 'gbAdminApp.globalservices', 'ngCookies', 'ngDraggable',	'ngAnimate', 'ngRoute',	'ngTable', 'xml','ui.bootstrap', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
  beforeEach(function() {
    var fixture = '<div id="gb-first-time-loader" class="gb-first-time-loader gb-hide">'+'<div class="gb-loading">'+'<span id="gb-loader-msg" class="msg">Loading...</span>'+'<span class="bar"></span>'+'</div></div>';

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);
  });
  it('Should Have setGlobals', inject(function(GlobalService) {
    GlobalService.setGlobals();
  }));
  it('Should Have getUmsDomain', inject(function(GlobalService) {
    GlobalService.getUmsDomain();
  }));
  it('Should Have gethttpProtocol', inject(function(GlobalService) {
    GlobalService.gethttpProtocol();
  }));
  it('Should Have setUmsDomain', inject(function(GlobalService) {
    GlobalService.setUmsDomain("TestDomain");
  }));
  it('Should Have showLoading', inject(function(GlobalService) {
    GlobalService.showLoading("test");
  }));
  it('Should Have showLoading else', inject(function(GlobalService) {
    GlobalService.showLoading();
  }));
  it('Should Have hideLoading', inject(function(GlobalService) {
    GlobalService.hideLoading();
  }));
  it('Should Have setSessionCookies', inject(function(GlobalService) {
    GlobalService.setSessionCookies("test");
  }));
  it('Should Have setVal', inject(function(GlobalService) {
    GlobalService.setVal("testkey","testValue");
  }));
  it('Should Have logError', inject(function(GlobalService) {
    GlobalService.logError("testError");
  }));
});
