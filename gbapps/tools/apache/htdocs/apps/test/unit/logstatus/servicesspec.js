
/* jasmine specs for log vault controllers go here */

describe('LogStatusService : ', function() {

    var manufacturer, product, schema, umsDomain;

	beforeEach(module('gbLogStatusApp.controllers', 'gbLogStatusApp.services', 'gbLogStatusApp.globalservices', 'gbLogStatusApp.directives', 'gbLogStatusApp.filters', 'ngCookies', 'ngDraggable',	'ngAnimate', 'ngRoute',	'ngTable', 'xml','ui.bootstrap', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
    document.cookie = 'umsDomain=test';
    document.cookie = 'infoserverInternalDomain=test';
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
  it('logoutInfoserver', inject(function(LogStatusService) {
    expect(LogStatusService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    LogStatusService.logoutInfoserver().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('getLoginFields', inject(function(LogStatusService) {
    expect(LogStatusService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    LogStatusService.getLoginFields().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('updateAccessTime', inject(function(LogStatusService) {
    expect(LogStatusService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    LogStatusService.updateAccessTime().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('updateAccessTime', inject(function(GlobalMessages) {
    expect(GlobalMessages).toBeDefined();
    GlobalMessages.getValue("Test");
  }));
  it('getLogList', inject(function(LogStatusService) {
    expect(LogStatusService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    LogStatusService.getLogList().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('Multiple', inject(function(LogStatusService,MessageService) {
    expect(LogStatusService).toBeDefined();
    spyOn(MessageService,'setError');
    spyOn(MessageService,'setSuccess');
    spyOn(MessageService,'setWarning');
    LogStatusService.windowFailed("Test","Test");
    LogStatusService.windowSuccess("Test","Test");
    LogStatusService.windowWarning("Test","Test");
  }));
});
