
describe('AdminService : ', function() {

    var manufacturer, product, schema, umsDomain;

	beforeEach(module('gbAdminApp.controllers', 'gbAdminApp.services', 'gbAdminApp.globalservices', 'ngCookies', 'ngDraggable',	'ngAnimate', 'ngRoute',	'ngTable', 'xml','ui.bootstrap', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
  it('deleteRole', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.deleteRole().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('logoutInfoserver', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.logoutInfoserver().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('deleteUser', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.deleteUser().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('addNewRole', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.addNewRole().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('addNewUser', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.addNewUser().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('getRoleList', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.getRoleList().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('getUserList', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.getUserList().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('getLoginFields', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.getLoginFields().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('updateAccessTime', inject(function(AdminService) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    AdminService.updateAccessTime().then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
  it('editUser', inject(function(AdminService,$cookies) {
    expect(AdminService).toBeDefined();
    document.cookie = 'mps=springpath:springpath:pod52';
    var params = {
      email:"test@test2.com"
    }
    AdminService.editUser(params).then(function(response) {
      data = response.data;
    }, function(response) {

    });
  }));
});
describe('GlobalMessages : ', function() {

    var manufacturer, product, schema, umsDomain;

	beforeEach(module('gbAdminApp.controllers', 'gbAdminApp.services', 'gbAdminApp.globalservices', 'ngCookies', 'ngDraggable',	'ngAnimate', 'ngRoute',	'ngTable', 'xml','ui.bootstrap', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
  it('Should Have GlobalMessages', inject(function(AdminService,$cookies,GlobalMessages) {
    expect(GlobalMessages).toBeDefined();
  }));
});
