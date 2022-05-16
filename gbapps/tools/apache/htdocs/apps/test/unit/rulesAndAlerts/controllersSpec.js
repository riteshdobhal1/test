'use strict';

/* jasmine specs for controllers go here */

describe('RulesCtrl : ', function() {
	beforeEach(module('gbApp.controllers.rules', 'gbApp.services', 'gbApp.services.rules', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('infoserverDomainStaging', 'undefined');
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('Should have info', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('RulesCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('info')).toBeTruthy();
		expect($scope.info).toEqual(jasmine.any(Object));
	}));

	it('Should have getRulesUrl', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('RulesCtrl', {
			'$scope' : $scope
		});
		$scope.getRulesUrl('rules_list');
		$scope.getRulesUrl('rules_list1');
	}));
	
	it('Should have instanceViewerFullscreen', inject(function($rootScope, $controller, InstanceHandler) {
        var $scope = $rootScope.$new();
        $controller('RulesCtrl', {
            '$scope' : $scope
        });
        spyOn(InstanceHandler, "isVisible");
        $scope.instanceViewerFullscreen();
    }));
    
    it('Should have isThereInstanceViewer', inject(function($rootScope, $controller, InstanceHandler) {
        var $scope = $rootScope.$new();
        $controller('RulesCtrl', {
            '$scope' : $scope
        });
        spyOn(InstanceHandler, "getNumberOfInstances");
        $scope.isThereInstanceViewer();
    }));

	it('Should have changeCurrentPage', inject(function($rootScope, $controller, RulesService) {
		var $scope = $rootScope.$new();
		$controller('RulesCtrl', {
			'$scope' : $scope
		});
		// spyOn($scope, "deleteStagingRules");
		
		$scope.changeCurrentPage('add_template');
		expect($scope.info.current).toEqual('add_template');
		
		RulesService.setStagingRules(true);
		$scope.changeCurrentPage('add_template');
        expect($scope.info.current).toEqual('add_template');
        
        $scope.info.current = 'add_edit_template';
        RulesService.setTemplateSavedStatus(true);
        $scope.changeCurrentPage('add_rule');
        expect($scope.info.current).toEqual('add_edit_template');
        
        $scope.info.current = 'add_rule';
        RulesService.setRuleSavedStatus(true);
        $scope.changeCurrentPage('rules_list');
        expect($scope.info.current).toEqual('add_rule');
        
        $scope.info.current = "test_rule_history";
        RulesService.setLogMoving(true);
        $scope.changeCurrentPage('rules_list');
        expect($scope.info.current).toEqual('test_rule_history');
	}));
	
	it('Should have changeCurrentPageConfirm', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('RulesCtrl', {
            '$scope' : $scope
        });
        // spyOn($scope, "deleteStagingRules");
        
        $scope.info.targetPage = 'add_template';
        $scope.changeCurrentPageConfirm();
        expect($scope.info.current).toEqual('add_template');
        
        RulesService.setStagingRules(true);
        $scope.changeCurrentPageConfirm();
        expect($scope.info.current).toEqual('add_template');
        
        $scope.info.targetPage = 'rules_list';
        $scope.changeCurrentPageConfirm();
        expect($scope.info.current).toEqual('rules_list');
        
        RulesService.getStagingRules();
    }));
    
    // it('Should have deleteStagingRules', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        // var $scope = $rootScope.$new();
        // $controller('RulesCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(200);
//         
        // $scope.deleteStagingRules();
        // $httpBackend.flush();
//         
        // $scope = $rootScope.$new();
        // $controller('RulesCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(500, {});
//         
        // $scope.deleteStagingRules();
        // $httpBackend.flush();
//         
        // $scope = $rootScope.$new();
        // $controller('RulesCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(500, {Msg: 'timeout'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
//         
        // $scope.deleteStagingRules();
        // $httpBackend.flush();
    // }));
	
	it('Should have getError', inject(function($rootScope, $controller, ErrorService) {
        var $scope = $rootScope.$new();
        $controller('RulesCtrl', {
            '$scope' : $scope
        });
        spyOn(ErrorService, "getErrors");
        $scope.getError();
    }));
    
    it('Should have renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        $controller('RulesCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        $scope.renderHtml('html');
    }));
});

describe('ManageTemplateCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp.controllers.rules', 'gbApp.services', 'gbApp.services.rules', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		
		manufacturer = 'undefined';
		product = 'undefined';
		schema = 'undefined';
		umsDomain = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
        Object.values = function(key) {
        	return [];
        };
    }));

	it('Should have info', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ManageTemplateCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('info')).toBeTruthy();
		expect($scope.info).toEqual(jasmine.any(Object));
	}));
	
	it('Should have getTemplatesList', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
    }));
    
    it('Should have getTemplatesList else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":""});
        $httpBackend.flush();
    }));
    
    it('Should have getTemplatesList with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.flush();
    }));
    
    it('Should have getTemplatesList with error Connection refused block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.info.errorMsg = "error";
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have getTemplatesList with error else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn(ModalService, "sessionTimeout");
        $scope.info.errorMsg = "error";
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));
    
    it('Should have reloadTemplates', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.tableParams = {
            reload : function() {
                
            },
            page : function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $scope.reloadTemplates();
        $httpBackend.flush();
    }));
    
    it('Should have reloadTemplates else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.tableParams = {
            reload : function() {
                
            },
            page : function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":""});
        $scope.reloadTemplates();
        $httpBackend.flush();
    }));
    
    it('Should have reloadTemplates with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.tableParams = {
            reload : function() {
                
            },
            page : function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $scope.reloadTemplates();
        $httpBackend.flush();
    }));
    
    it('Should have reloadTemplates with connection refused block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.tableParams = {
            reload : function() {
                
            },
            page : function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        $scope.info.errorMsg = "error";
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.reloadTemplates();
        $httpBackend.flush();
    }));
    
    it('Should have reloadTemplates with error else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.tableParams = {
            reload : function() {
                
            },
            page : function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        $scope.info.errorMsg = "error";
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.reloadTemplates();
        $httpBackend.flush();
    }));
    
    it('Should have clearMessage', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.clearMessage();
        $scope.info.templatesLoading = false;
        $scope.clearMessage();
    }));
    
    it('Should have changePageSize', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
        $scope.changePageSize();
        $scope.info.page['current'] = 3;
        $scope.info.page['total'] = 100;
        $scope.info.page['count'] = 10;
        $scope.changePageSize();
    }));

	// it('Should have increaseCount', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		// var $scope = $rootScope.$new();
		// $controller('ManageTemplateCtrl', {
			// '$scope' : $scope
		// });
		// $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
		// $httpBackend.flush();
		// $scope.increaseCount();
		// // $scope.info.page['count'] = 2;
        // $scope.info.page['total'] = 340;
        // $scope.increaseCount();
        // $scope.info.page['current'] = 350;
		// $scope.info.page['pages'] = 340;
		// $scope.increaseCount();
		// $scope.info.page['count'] = 340;
		// $scope.increaseCount();
// 		
	// }));
// 
	// it('Should have decreaseCount', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		// var $scope = $rootScope.$new();
		// $controller('ManageTemplateCtrl', {
			// '$scope' : $scope
		// });
		// $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        // $httpBackend.flush();
		// $scope.decreaseCount();
		// $scope.info.page['count'] = 4;
		// $scope.decreaseCount();
	// }));

	it('Should have nextPage', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('ManageTemplateCtrl', {
			'$scope' : $scope
		});
		$httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
		$scope.nextPage();
		$scope.info.page['current'] = 1;
		$scope.info.page['pages'] = 2;
		$scope.nextPage();
	}));

	it('Should have prevPage', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('ManageTemplateCtrl', {
			'$scope' : $scope
		});
		$httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
		$scope.prevPage();
		$scope.info.page['current'] = 2;
		$scope.prevPage();
	}));

	it('Should have firstPage', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('ManageTemplateCtrl', {
			'$scope' : $scope
		});
		$httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
		$scope.firstPage();
		$scope.info.page['current'] = 2;
		$scope.firstPage();
	}));

	it('Should have lastPage', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('ManageTemplateCtrl', {
			'$scope' : $scope
		});
		$httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
		$scope.lastPage();
		$scope.info.page['current'] = $scope.info.page['pages'];
		$scope.lastPage();
	}));
	
	it('Should have checkTemplatesSelection', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.templatesList = [{}, {selected: true}];
        $scope.checkTemplatesSelection();
        $scope.templatesList = [{selected: true}, {selected: true}];
        $scope.checkTemplatesSelection();
    }));
	
	it('Should have checkSelectAll', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
        $scope.tableParams.data = [{template_id: 1000}, {template_id: 1001}];
        $scope.info.selectAll = true;
        $scope.checkSelectAll();
        $scope.info.selectAll = false;
        $scope.checkSelectAll();
    }));
    
    // it('Should have templateChecked', inject(function($rootScope, $controller) {
        // var $scope = $rootScope.$new();
        // $controller('ManageTemplateCtrl', {
            // '$scope' : $scope
        // });
        // $scope.templateChecked(1000);
        // $scope.info.template = {9999: true};
        // $scope.templateChecked(9999);
    // }));
    
    it('Should have checkTemplateSelected', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.checkTemplateSelected();
        
        $scope.tableParams = {
            data: []
        };
        $scope.checkTemplateSelected();
        
        $scope.tableParams = {
            data: [{selected: true}]
        };
        $scope.checkTemplateSelected();
    }));
    
    it('Should have addNewTemplate', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.$parent = {
            changeCurrentPage : function() {
                
            }
        };
        spyOn(RulesService, "setTemplateMode");
        spyOn($scope.$parent, "changeCurrentPage");
        $scope.addNewTemplate();
    }));
    
    it('Should have editTemplate', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.$parent = {
            changeCurrentPage : function() {
                
            }
        };
        spyOn(RulesService, "setTemplateMode");
        spyOn($scope.$parent, "changeCurrentPage");
        $scope.editTemplate({});
    }));
    
    it('Should have deleteTemplate', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.info.rulesList = [];
        $scope.deleteTemplate({template_name: 'temp1'});
        $scope.info.rulesList = [{}, {email_template_id: 1}, {email_template_id: 23}];
        $scope.deleteTemplate({template_id: 23, template_name: 'temp1'});
    }));
    
    it('Should have deleteTemplateConfirm', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1000).respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Manage Template/delete', {"details":"temp1","solr_query":""}).respond(200);
        $scope.delTemplate = {template_id: 1000, template_name: 'temp1'};
        $scope.deleteTemplateConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteTemplateConfirm else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1000).respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Manage Template/delete', {"details":"temp1","solr_query":""}).respond(500, {});
        $scope.info.successMsg = "Success";
        $scope.delTemplate = {template_id: 1000, template_name: 'temp1'};
        $scope.deleteTemplateConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteTemplateConfirm else block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1000).respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Manage Template/delete', {"details":"temp1","solr_query":""}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.info.successMsg = "Success";
        $scope.delTemplate = {template_id: 1000, template_name: 'temp1'};
        $scope.deleteTemplateConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteTemplateConfirm with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1000).respond(500, {});
        $scope.delTemplate = {template_id: 1000, template_name: 'temp1'};
        $scope.deleteTemplateConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteTemplateConfirm with error connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1000).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.delTemplate = {template_id: 1000, template_name: 'temp1'};
        $scope.info.errorMsg = "Error";
        $scope.deleteTemplateConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteTemplateConfirm with error else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1000).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.delTemplate = {template_id: 1000, template_name: 'temp1'};
        $scope.info.errorMsg = "Error";
        $scope.deleteTemplateConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteSelectedTemplates', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.tableParams = {
            data: [{template_name: 'temp1', selected: true}, {template_name: 'temp2', selected: true}]
        };
        $scope.deleteSelectedTemplates();
    }));
    
    it('Should have deleteSelectedTemplatesConfirm', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.tableParams = {
            data: []
        };
        $scope.deleteSelectedTemplatesConfirm();
        spyOn($scope, "callDeleteTemplate");
        spyOn($scope, "printErrorRuleAssociation");
        
        $scope.tableParams = {
            data: [{template_id: 1000, template_name: 'temp1', selected: true}, {template_id: 9999, template_name: 'temp2', selected: true}]
        };
        $scope.info.rulesList = [{email_template_id: 0}, {email_template_id: 1200}];
        $scope.deleteSelectedTemplatesConfirm();
        $scope.info.rulesList = [{email_template_id: 0}, {email_template_id: 1000}];
        $scope.deleteSelectedTemplatesConfirm();
        
    }));
    
    it('Should have printErrorRuleAssociation', inject(function($rootScope, $controller, $httpBackend, $timeout, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $scope.printErrorRuleAssociation();
        $timeout.flush(700);
        
    }));
    
    it('Should have printErrorRuleAssociation else block', inject(function($rootScope, $controller, $httpBackend, $timeout, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.info.errorMsg = "error";
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $scope.printErrorRuleAssociation();
        $timeout.flush(700);
        
    }));
    
    it('Should have callDeleteTemplate', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = [];
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond({"Status": "Success", "Msg": "", "Data": ""});
        $httpBackend.expect('POST', umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Rules & Alerts/Manage Template/multiple delete").respond(200);
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 1);
        $httpBackend.flush();
        
    }));
    
    it('Should have callDeleteTemplate user tracking failing', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = [];
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond({"Status": "Success", "Msg": "", "Data": ""});
        $httpBackend.expect('POST', umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Rules & Alerts/Manage Template/multiple delete").respond(500, {});
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 1);
        $httpBackend.flush();
        
    }));
    
    it('Should have callDeleteTemplate user tracking failing and session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = [];
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond({"Status": "Success", "Msg": "", "Data": ""});
        $httpBackend.expect('POST', umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Rules & Alerts/Manage Template/multiple delete").respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 1);
        $httpBackend.flush();
        
    }));
    
    it('Should have callDeleteTemplate else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = [];
        $scope.info.successMsg = "success";
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond({"Status": "Success", "Msg": "", "Data": ""});
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 2);
        $httpBackend.flush();
        
    }));
    
    it('Should have callDeleteTemplate error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = [];
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(500, {});
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 1);
        $httpBackend.flush();
        
    }));
    
    it('Should have callDeleteTemplate error block user tracking', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = ['temp2'];
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(500, {});
        $httpBackend.expect('POST', umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Rules & Alerts/Manage Template/multiple delete").respond(200);
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 1);
        $httpBackend.flush();
        
    }));
    
    it('Should have callDeleteTemplate error block user tracking failing', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = ['temp2'];
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(500, {});
        $httpBackend.expect('POST', umsDomain + "/user_tracking/" + manufacturer + "/" + product + "/" + schema + "/Rules & Alerts/Manage Template/multiple delete").respond(500, {});
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 1);
        $httpBackend.flush();
        
    }));
    
    it('Should have callDeleteTemplate error block connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = [];
        $scope.info.errorMsg = "error";
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 2);
        $httpBackend.flush();
        
    }));
    
    it('Should have callDeleteTemplate error block else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "reloadTemplates");
        $scope.info.doneDeletions = 0;
        $scope.info.deletedTemplates = [];
        $scope.info.errorMsg = "error";
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.callDeleteTemplate({template_id: 1, template_name: 'temp1'}, 2);
        $httpBackend.flush();
        
    }));

	it('Should have searchTemplate', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('ManageTemplateCtrl', {
			'$scope' : $scope
		});
		$httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
        
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
		$scope.info.template_name = "test";
		$scope.info.page['current'] = 5;
		$scope.info.page['pages'] = 0;
		$scope.searchTemplate('template_name');
		$scope.info.page['current'] = 5;
		$scope.info.page['pages'] = 1;
		$scope.info.template_name = "";
		$scope.searchTemplate('template_name');
		$scope.searchTemplate('template_name');
	}));

	it('Should have sortColumn', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
	    var element = document.createElement("input");
        element.type = "input";
        element.id = "testSortTemplate";
        element.value = "";
        document.body.appendChild(element);
		var $scope = $rootScope.$new();
		$controller('ManageTemplateCtrl', {
			'$scope' : $scope
		});
		$httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
		$scope.sortColumn('to');
		$scope.sortColumn('to');
		element.focus();
		$scope.sortColumn('to');
	}));

	it('Should have clearAppliedFilters', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('ManageTemplateCtrl', {
			'$scope' : $scope
		});
		$httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all templates","Data":[{"template_id":9999,"template_name":"template1","to":"","cc":"","bcc":"","subject":"Critical Failures","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1000,"template_name":"template2","to":"praveen.yajurvedi@glassbeam.com","cc":"","bcc":"","subject":"Testing Email generation for File/Bundle Parsing for {context.cust_name}","body":"This email is generated because the bundle is successfully parsed and loaded using Glassbeam Analytics. The details of the bundle are below. \r\n\r\nCustomer             : {context.customer}\r\nProduct              : {context.product}\r\nSchema               : {context.schema} \r\nBundle Location      : {context.obs_url} \r\nBundle path          : {context.obs_url}\r\nBundle Size          : {context.obs_size} \r\nCustomer Name        : {context.cust_name} \r\nBundle Serial Number : {context.serial_num} \r\nBundle ticket Number : {context.ticket_num} \r\nBundle System ID     : {context.sysid} \r\nBundle/File Name     : {context.fn}\r\nLink to refer        : <a href=\"http://searchdev.glassbeam.com/gb/ui/prod/dashboard/redirect.cgi?dashboard_id=f6c9987d-db89-6232-baad-98f1a4d98f59&Serial=<serial_number>&EpochValue=<epochvalue\"> for {context.customer} </a>","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1001,"template_name":"Temporary template 1","to":"","cc":"","bcc":"","subject":"Test template 1","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1002,"template_name":"Temporary template 2","to":"","cc":"","bcc":"","subject":"Test template 2","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1003,"template_name":"Temporary template 3","to":"","cc":"","bcc":"","subject":"Test template 3","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1004,"template_name":"Temporary template 4","to":"","cc":"","bcc":"","subject":"Test template 4","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1005,"template_name":"Temporary template 5","to":"","cc":"","bcc":"","subject":"Test template 5","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1006,"template_name":"Temporary template 6","to":"","cc":"","bcc":"","subject":"Test template 6","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1007,"template_name":"Temporary template 7","to":"","cc":"","bcc":"","subject":"Test template 7","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1008,"template_name":"Temporary template 8","to":"","cc":"","bcc":"","subject":"Test template 8","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1009,"template_name":"Temporary template 9","to":"","cc":"","bcc":"","subject":"Test template 9","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null},{"template_id":1010,"template_name":"Temporary template 10","to":"","cc":"","bcc":"","subject":"Test template 10","body":"","alertperrow":"TRUE","mps":"vce/vce/vce_janpod","creation_date":null}]});
        $httpBackend.flush();
		$scope.clearAppliedFilters();
		$scope.info.filter = {
			name : 'test'
		};
		$scope.info.page['sortField'] = 'template_namedesc';
		$scope.clearAppliedFilters();
	}));
	
	it('Should have checkAppliedFilters', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        expect($scope.checkAppliedFilters()).toBeFalsy();
        $scope.info.filter = {
            key1: 'value1'
        };
        expect($scope.checkAppliedFilters()).toBeTruthy();
    }));
    
    it('Should have renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        $controller('ManageTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        
        $scope.renderHtml('abcd<strong>df</strong>');
    }));
});

describe('AddEditTemplateCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
    beforeEach(module('gbApp.controllers.rules', 'gbApp.services', 'gbApp.services.rules', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
    }));
    
    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
    
    it('Should have info', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        expect($scope.hasOwnProperty('info')).toBeTruthy();
        expect($scope.info).toEqual(jasmine.any(Object));
    }));
    
    it('Should load with edit mode', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTemplateMode('edit', {template_id: 1, template_name: 'temp1', to: 'to', cc: 'cc', bcc: 'bcc', subject: 'sub', body: 'body', alertperrow: 1});
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
    }));
    
    it('Should have getTemplates', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setTemplatesLabelMap");
        
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.flush();
    }));
    
    it('Should have getTemplates error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.flush();
    }));
    
    it('Should have getTemplates error block connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });

        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');

        var html = '<div class="d3-chart-container-explorer"></div>';
        angular.element(document.body).append(html);
        $httpBackend.flush();
    }));
    
    it('Should have getTemplates error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have setUnsavedMode', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.setUnsavedMode();
    }));
    
    it('Should have clearMessage', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.clearMessage();
        $scope.info.pageLoading = false;
        $scope.clearMessage();
    }));
    
    it('Should have setTemplatesLabelMap', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        $scope.templatesList = [{template_name: 'temp1'}, {template_name: 'temp2'}];
        $scope.setTemplatesLabelMap();
    }));
    
    it('Should have addNewTemplate', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.addNewTemplate();
    }));
    
    it('Should have saveTemplate', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateTemplate").and.returnValue(false);
        
        $scope.saveTemplate();
    }));
    
    it('Should have saveTemplate with constants conversion', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $scope.info.subject = "this subject is {rule1} and {context1}";
        $scope.info.body = "this is body {rule1} and {context1}";
        
        $scope.info.commonConstants = [{
            key: "Context1",
            value: "{context1}",
            enabled: true
        }];
        
        $scope.info.customerConstants = [{
            key: "Rule1",
            value: "{rule1}",
            enabled: true
        }, {
            key: "Rule2",
            value: "{rule2}",
            enabled: true
        }];
        
        $scope.saveTemplate();
    }));
    
    it('Should have saveTemplate add operation', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/add/' + manufacturer + '/' + product + '/' + schema, {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond({Data: {template_id: 1}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Add_Edit template/add', {"details":"","solr_query":""}).respond(200);
        
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate add operation else block', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/add/' + manufacturer + '/' + product + '/' + schema, {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond({Data: {template_id: 1}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Add_Edit template/add', {"details":"","solr_query":""}).respond(500, {});
        
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate add operation else block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/add/' + manufacturer + '/' + product + '/' + schema, {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond({Data: {template_id: 1}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Add_Edit template/add', {"details":"","solr_query":""}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate add operation error block', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/add/' + manufacturer + '/' + product + '/' + schema, {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond(500, {});
        
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate add operation error block connection refused', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/add/' + manufacturer + '/' + product + '/' + schema, {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate add operation error block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/add/' + manufacturer + '/' + product + '/' + schema, {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate edit operation', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.templateID = 1;
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/update/' + manufacturer + '/' + product + '/' + schema + '/1', {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond({Data: {template_id: 1}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Add_Edit template/edit', {"details":"{\"old\":null,\"new\":\"\"}","solr_query":""}).respond(200);
        
        RulesService.setTemplateMode('edit', {});
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate edit operation else block', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.templateID = 1;
        $scope.info.initialTemplateName = "temp";
        $scope.info.templateName = "temp";
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/update/' + manufacturer + '/' + product + '/' + schema + '/1', {"template_name":"temp","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond({Data: {template_id: 1}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Add_Edit template/edit', {"details":"temp","solr_query":""}).respond(500, {});
        
        RulesService.setTemplateMode('edit', {});
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate edit operation else block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.templateID = 1;
        $scope.info.initialTemplateName = "temp";
        $scope.info.templateName = "temp";
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/update/' + manufacturer + '/' + product + '/' + schema + '/1', {"template_name":"temp","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond({Data: {template_id: 1}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Add_Edit template/edit', {"details":"temp","solr_query":""}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        RulesService.setTemplateMode('edit', {});
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate edit operation error block', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.templateID = 1;
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/update/' + manufacturer + '/' + product + '/' + schema + '/1', {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond(500, {});
        
        RulesService.setTemplateMode('edit', {});
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate edit operation error block connection refused', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.templateID = 1;
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/update/' + manufacturer + '/' + product + '/' + schema + '/1', {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        RulesService.setTemplateMode('edit', {});
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have saveTemplate edit operation error block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setTemplatesList([{template_name: 'temp1'}]);
        RulesService.setTemplatesLabelMap({})
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.templateID = 1;
        
        spyOn($scope, "validateTemplate").and.returnValue(true);
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/email_template/update/' + manufacturer + '/' + product + '/' + schema + '/1', {"template_name":"","to":"","cc":"","bcc":"","subject":"","body":"","alertperrow":"TRUE"}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        RulesService.setTemplateMode('edit', {});
        $scope.saveTemplate();
        $httpBackend.flush();
    }));
    
    it('Should have validateTemplate', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.templateConstants = [{
            key: "Customer",
            value: "{customer}",
            enabled: false
        }, {
            key: "Product",
            value: "{product}",
            enabled: false
        }, {
            key: "Schema",
            value: "{schema}",
            enabled: false
        }, {
            key: "Bundle Location",
            value: "{obs_url}",
            enabled: false
        }, {
            key: "Bundle path",
            value: "{obs_url}",
            enabled: false
        }, {
            key: "Bundle Size",
            value: "{obs_size}",
            enabled: true
        }, {
            key: "End Customer Name",
            value: "{cust_name}",
            enabled: true
        }, {
            key: "Bundle Serial Number",
            value: "{serial_num}",
            enabled: false
        }, {
            key: "Ticket Number",
            value: "{ticket_num}",
            enabled: true
        }, {
            key: "System ID",
            value: "{sysid}",
            enabled: true
        }, {
            key: "File Name",
            value: "{fn}",
            enabled: true
        }];
        
        $scope.validateTemplate();
        $scope.info.templateName = "temp1";
        RulesService.setTemplatesLabelMap({temp1: true});
        $scope.validateTemplate();
        RulesService.setTemplatesLabelMap({});
        $scope.validateTemplate();
        $scope.info.initialTemplateName = "temp";
        RulesService.setTemplatesLabelMap({temp1: true});
        $scope.validateTemplate();
        $scope.info.initialTemplateName = "temp1";
        $scope.validateTemplate();
        $scope.info.toAddress = "addr1";
        $scope.validateTemplate();
        $scope.info.toAddress = "addr1@unsupported.com,";
        $scope.validateTemplate();
        $scope.info.toAddress = "addr1@glassbeam.com,";
        $scope.validateTemplate();
        $scope.info.toAddress = "addr1@glassbeam.com, addr1@glassbeam.com";
        $scope.validateTemplate();
        $scope.info.toAddress = "addr1@glassbeam.com";
        $scope.info.cc = "addr1";
        $scope.validateTemplate();
        $scope.info.cc = "addr1@unsupported.com,";
        $scope.validateTemplate();
        $scope.info.cc = "addr1@glassbeam.com,";
        $scope.validateTemplate();
        $scope.info.cc = "addr2@glassbeam.com,";
        $scope.validateTemplate();
        $scope.info.cc = "";
        $scope.validateTemplate();
        $scope.info.subject = "sub {alert_msg}";
        $scope.validateTemplate();
        $scope.info.subject = "sub {df}";
        $scope.validateTemplate();
        $scope.info.subject = "sub {obs_size}";
        $scope.validateTemplate();
        $scope.info.subject = "sub";
        $scope.validateTemplate();
        $scope.info.body = "body {df}";
        $scope.validateTemplate();
        $scope.info.body = "body {obs_size}";
        $scope.validateTemplate();
        $scope.info.body = "body";
        $scope.validateTemplate();
    }));
    
    it('Should have renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        $controller('AddEditTemplateCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        
        $scope.renderHtml('abcd<strong>df</strong>');
    }));
});

describe('RulesListCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp.controllers.rules', 'gbApp.services', 'gbApp.services.rules', 'ngTable', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('Should have info', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('RulesListCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('info')).toBeTruthy();
		expect($scope.info).toEqual(jasmine.any(Object));
	}));
	
	it('Should have getAllRules', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
	    var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.flush();
	}));
	
	it('Should have getAllRules reload error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadRules");
        spyOn($scope, "setAllRulesMap");
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({});
        $httpBackend.flush();
    }));
    
    it('Should have getAllRules reload error no recursion', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.recursionDone = 2;
        $scope.info.recursionLimit = 3;
        
        spyOn($scope, "setAllRulesMap");
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({});
        $httpBackend.flush();
    }));
	
	it('Should have getAllRules with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.flush();
    }));
    
    it('Should have getAllRules with error connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have getAllRules with error session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have reloadRules', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.tableParams = {
            reload: function() {
                
            },
            page: function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        spyOn($scope, "clearAppliedFilters");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        
        $scope.reloadRules();
        $httpBackend.flush();
    }));
    
    it('Should have reloadRules error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.tableParams = {
            reload: function() {
                
            },
            page: function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        spyOn($scope, "clearAppliedFilters");
        spyOn($scope, "setRulesLabelMap");
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        
        $scope.reloadRules();
        $httpBackend.flush();
    }));
    
    it('Should have reloadRules error block connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.tableParams = {
            reload: function() {
                
            },
            page: function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        spyOn($scope, "clearAppliedFilters");
        spyOn($scope, "setRulesLabelMap");
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.reloadRules();
        $httpBackend.flush();
    }));
    
    it('Should have reloadRules error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.tableParams = {
            reload: function() {
                
            },
            page: function() {
                
            }
        }
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "populateTable");
        spyOn($scope, "clearAppliedFilters");
        spyOn($scope, "setRulesLabelMap");
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.reloadRules();
        $httpBackend.flush();
    }));
    
    it('Should have clearMessage', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        $scope.clearMessage();
        $scope.info.rulesLoading = false;
        $scope.clearMessage();
    }));
    
    // it('Should have openTestHistoryModal', inject(function($rootScope, $controller) {
        // var $scope = $rootScope.$new();
        // $controller('RulesListCtrl', {
            // '$scope' : $scope
        // });
        // $scope.openTestHistoryModal();
    // }));
    
    it('Should have setAllRulesMap', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setRulesLabelMap");
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/labels/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: ""});
        
        $scope.setAllRulesMap();
        $httpBackend.flush();
    }));
    
    it('Should have setAllRulesMap with data', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setRulesLabelMap");
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/labels/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: ['label1', 'label2']});
        
        $scope.setAllRulesMap();
        $httpBackend.flush();
    }));
    
    it('Should have setAllRulesMap error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setRulesLabelMap");
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/labels/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: ''});
        
        $scope.setAllRulesMap();
        $httpBackend.flush();
    }));
    
    it('Should have setAllRulesMap error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setRulesLabelMap");
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/labels/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');
        
        $scope.setAllRulesMap();
        $httpBackend.flush();
    }));
    
    it('Should have setRulesLabelMap', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.rulesList = [{label: 'rule 1'}, {label: 'rule 2'}];
        $scope.setRulesLabelMap();
    }));
    
    it('Should have addNewRule', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        $scope.$parent = {
            changeCurrentPage : function(str) {
                
            }
        };
        spyOn($scope.$parent, "changeCurrentPage");
        $scope.addNewRule();
        expect($scope.$parent.changeCurrentPage).toHaveBeenCalledWith('add_rule');
    }));
    
    it('Should have checkRulesSelection', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.rulesList = [{status: 'DRAFT'}, {status: 'ENABLED'}];
        $scope.checkRulesSelection();
        
        $scope.rulesList = [{status: 'DRAFT'}, {status: 'ENABLED', selected: true}];
        $scope.checkRulesSelection();
    }));
    
    it('Should have checkSelectAll', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.tableParams = {
            data: [{status: 'ENABLED'}, {status: 'DISABLED'}, {status: 'DRAFT'}]
        };
        
        $scope.rulesList = [{status: 'ENABLED'}, {status: 'DISABLED'}, {status: 'DRAFT'}, {status: 'DRAFT'}, {status: 'ENABLED'}];
        
        $scope.info.selectAll = true;
        $scope.checkSelectAll();
        
        $scope.tableParams = {
            data: [{status: 'DRAFT'}, {status: 'DISABLED'}, {status: 'DRAFT'}]
        };
        
        $scope.rulesList = [{status: 'DRAFT'}, {status: 'DISABLED'}, {status: 'DRAFT'}, {status: 'DRAFT'}, {status: 'DISABLED'}];
        $scope.checkSelectAll();
        
        $scope.info.selectAll = false;
        $scope.checkSelectAll();
    }));
    
    it('Should have checkSelectedRules', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.checkSelectedRules();
        
        $scope.rulesList = [{status: 'ENABLED', selected: true}, {status: 'DISABLED'}, {status: 'DRAFT'}];
        
        $scope.checkSelectedRules();
        
        $scope.rulesList = [{status: 'ENABLED'}, {status: 'DISABLED'}, {status: 'DRAFT'}];
        
        $scope.checkSelectedRules();
    }));
    
    it('Should have testRule', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.$parent = {
            changeCurrentPage: function() {
                
            }
        };
        
        spyOn($scope.$parent, "changeCurrentPage");
        spyOn($scope, "setPageListforTesting");
        
        $scope.testRule({});
    }));
    
    it('Should have goToTestRuleHistory', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.$parent = {
            changeCurrentPage: function() {
                
            }
        };
        
        spyOn($scope.$parent, "changeCurrentPage");
        spyOn($scope, "setPageListforTesting");
        
        $scope.goToTestRuleHistory();
    }));
    
    it('Should have goToTestRule', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.$parent = {
            changeCurrentPage: function() {
                
            }
        };
        
        $scope.rulesList = [{status: 'ENABLED', selected: true}, {status: 'DISABLED'}, {status: 'DRAFT'}];
        
        spyOn($scope.$parent, "changeCurrentPage");
        spyOn($scope, "setPageListforTesting");
        
        $scope.goToTestRule();
        
        $scope.rulesList = [{status: 'ENABLED'}, {status: 'DISABLED'}, {status: 'DRAFT'}];
        
        $scope.goToTestRule();
    }));
    
    it('Should have setPageListforTesting', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        $scope.setPageListforTesting();
    }));
    
    it('Should have enableDisableRule', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        $scope.enableDisableRule({}, 'status');
    }));
    
    it('Should have enableDisableRuleConfirm enable operation', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/enable', {"details":"label1","solr_query":""}).respond(200);
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm enable operation else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/enable', {"details":"label1","solr_query":""}).respond(500, {});
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm enable operation else block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/enable', {"details":"label1","solr_query":""}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm enable operation error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {});
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm enable operation error block connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm enable operation error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm disable operation', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'ENABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/disable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/disable', {"details":"label1","solr_query":""}).respond(200);
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm disable operation else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'ENABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/disable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/disable', {"details":"label1","solr_query":""}).respond(500, {});
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm disable operation else block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'ENABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/disable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/disable', {"details":"label1","solr_query":""}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm disable operation error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'ENABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/disable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {});
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm disable operation error block connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'ENABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/disable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have enableDisableRuleConfirm disable operation error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.selectedRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'ENABLED'};
        $scope.selectedField = 'status';
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/disable/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableDisableRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have editRule', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.$parent = {
            changeCurrentPage: function() {
                
            }
        };
        spyOn($scope.$parent, "changeCurrentPage");
        
        $scope.editRule({status: 'ENABLED'});
        $scope.editRule({status: 'DISABLED'});
    }));
    
    it('Should have deleteRule', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        $scope.deleteRule({});
    }));
    
    it('Should have deleteRuleConfirm', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        RulesService.setRulesLabelMap({});
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.delRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/delete/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/delete', {"details":"label1","solr_query":""}).respond(200);
        
        $scope.deleteRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteRuleConfirm else block', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        RulesService.setRulesLabelMap({});
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.delRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/delete/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/delete', {"details":"label1","solr_query":""}).respond(500, {});
        
        $scope.deleteRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteRuleConfirm else block session timeout', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        RulesService.setRulesLabelMap({});
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.delRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/delete/' + manufacturer + '/' + product + '/' + schema + '/1').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/delete', {"details":"label1","solr_query":""}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.deleteRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteRuleConfirm error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.delRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/delete/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {});
        
        $scope.deleteRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteRuleConfirm error block connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.delRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/delete/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.deleteRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have deleteRuleConfirm error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reloadRules");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        
        $scope.delRule = {rule_id: 1, rule_name: 'rule_243344', label: 'label1', status: 'DISABLED'};
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 1}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/delete/' + manufacturer + '/' + product + '/' + schema + '/1').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.deleteRuleConfirm();
        $httpBackend.flush();
    }));
    
    it('Should have changePageSize', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.flush();
        
        $scope.changePageSize();
        $scope.info.page['current'] = 3;
        $scope.info.page['total'] = 100;
        $scope.info.page['count'] = 10;
        $scope.changePageSize();
    }));

	// it('Should have increaseCount', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		// var $scope = $rootScope.$new();
		// $controller('RulesListCtrl', {
			// '$scope' : $scope
		// });
		// spyOn($scope, "setRulesLabelMap");
		// $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
		// $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        // $httpBackend.whenGET(infoserverDomain + '/rules/labels/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        // $httpBackend.flush();
        // $scope.info.page['total'] = 340;
		// $scope.increaseCount();
		// $scope.info.page['current'] = 350;
		// $scope.info.page['pages'] = 340;
		// $scope.increaseCount();
		// $scope.info.page['count'] = 340;
		// $scope.increaseCount();
	// }));
// 
	// it('Should have decreaseCount', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		// var $scope = $rootScope.$new();
		// $controller('RulesListCtrl', {
			// '$scope' : $scope
		// });
		// spyOn($scope, "setRulesLabelMap");
		// $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
		// $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        // $httpBackend.whenGET(infoserverDomain + '/rules/labels/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        // $httpBackend.flush();
		// $scope.decreaseCount();
		// $scope.info.page['count'] = 4;
		// $scope.decreaseCount();
	// }));

	it('Should have nextPage', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('RulesListCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "setRulesLabelMap");
		spyOn($scope, "setAllRulesMap");
		$httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
		$httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.flush();
		$scope.nextPage();
		$scope.info.page['current'] = 1;
		$scope.info.page['pages'] = 2;
		$scope.nextPage();
	}));

	it('Should have prevPage', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('RulesListCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "setRulesLabelMap");
		spyOn($scope, "setAllRulesMap");
		$httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
		$httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.flush();
		$scope.prevPage();
		$scope.info.page['current'] = 2;
		$scope.prevPage();
	}));

	it('Should have firstPage', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('RulesListCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "setRulesLabelMap");
		spyOn($scope, "setAllRulesMap");
		$httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
		$httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.flush();
		$scope.firstPage();
		$scope.info.page['current'] = 2;
		$scope.firstPage();
	}));

	it('Should have lastPage', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('RulesListCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "setRulesLabelMap");
		spyOn($scope, "setAllRulesMap");
		$httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
		$httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.flush();
		$scope.lastPage();
		$scope.info.page['current'] = $scope.info.page['pages'];
		$scope.lastPage();
	}));

	it('Should have searchRule', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('RulesListCtrl', {
			'$scope' : $scope
		});
		
		$scope.tableParams = {
		    reload: function() {
		        
		    },
		    page: function() {
		        
		    }
		};
		spyOn($scope.tableParams, "reload");
		spyOn($scope.tableParams, "page");

		$scope.info.category = "test";
		$scope.info.page['current'] = 5;
		$scope.info.page['pages'] = 0;
		$scope.searchRule('category');
		$scope.info.page['current'] = 5;
		$scope.info.page['pages'] = 1;
		$scope.searchRule('category');
		$scope.info.category = "";
		$scope.info.page['pages'] = 1;
		$scope.searchRule('category');
		$scope.searchRule('category');
	}));

	it('Should have sortColumn', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var element = document.createElement("select");
        element.id = "testSortTemplate";
        document.body.appendChild(element);
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.flush();
        $scope.sortColumn('category');
        element.focus();
        $scope.sortColumn('category');
        $scope.sortColumn('category');
    }));

	it('Should have changeFilter', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('RulesListCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "setRulesLabelMap");
		spyOn($scope, "setAllRulesMap");
		$httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
		$httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.flush();
		$scope.info['category']['category6'] = true;
		$scope.info.filter.category = ['category6'];
		$scope.changeFilter({
            field : "category",
            title : "Category",
            enabled: true
        }, 'category6');
        $scope.info['category']['category6'] = false;
        $scope.changeFilter({
            field : "category",
            title : "Category",
            enabled: true
        }, 'category6');
        $scope.info['severity']['DEBUG'] = true;
        $scope.changeFilter({
            field : "severity",
            title : "Severity",
            enabled: true
        }, 'DEBUG');
        $scope.info['status']['ENABLED'] = true;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'ENABLED');
        $scope.info['status']['DISABLED'] = true;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'DISABLED');
        $scope.info['status']['ENABLED'] = false;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'ENABLED');
        
        $scope.info.page['current'] = 5;
        $scope.info.page['pages'] = 2;
        $scope.info['status']['DISABLED'] = false;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'DISABLED');
        $scope.info['status']['DISABLED'] = true;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'DISABLED');
        
        $scope.info.page['current'] = 5;
        $scope.info.page['pages'] = 0;
        $scope.info['status']['ENABLED'] = true;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'ENABLED');
        $scope.info['status']['DISABLED'] = true;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'DISABLED');
        $scope.info['status']['DRAFT'] = true;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'DRAFT');
        $scope.info['status']['ENABLED'] = false;
        $scope.changeFilter({
            field : "status",
            title : "Status",
            enabled: true
        }, 'ENABLED');
        
	}));
	
	it('Should have changeFilter with user tracking', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.tableParams = {
            reload: function() {
                
            },
            page: function() {
                
            }
        };
        
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        spyOn($scope, "populateTable");
        spyOn($scope, "clearAppliedFilters");
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/filter').respond(200);
        
        $scope.info.page['current'] = 5;
        $scope.info.page['pages'] = 2;
        $scope.info['category']['category6'] = true;
        $scope.info.filter.category = ['category6'];
        $scope.changeFilter({
            field : "category",
            title : "Category",
            enabled: true
        }, 'category6');
        
        $httpBackend.flush();
    }));
    
    it('Should have changeFilter with user tracking error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.tableParams = {
            reload: function() {
                
            },
            page: function() {
                
            }
        };
        
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        spyOn($scope, "populateTable");
        spyOn($scope, "clearAppliedFilters");
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/filter').respond(500, {});
               
        $scope.info.page['current'] = 5;
        $scope.info.page['pages'] = 5;
        $scope.info['category']['category6'] = true;
        $scope.info.filter.category = ['category6'];
        $scope.changeFilter({
            field : "category",
            title : "Category",
            enabled: true
        }, 'category6');
        
        $httpBackend.flush();
    }));
    
    it('Should have changeFilter with user tracking session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        
        $scope.tableParams = {
            reload: function() {
                
            },
            page: function() {
                
            }
        };
        
        spyOn($scope.tableParams, "reload");
        spyOn($scope.tableParams, "page");
        spyOn($scope, "setRulesLabelMap");
        spyOn($scope, "setAllRulesMap");
        spyOn($scope, "populateTable");
        spyOn($scope, "clearAppliedFilters");
        
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rules List/filter').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.info.page['current'] = 5;
        $scope.info.page['pages'] = 5;
        $scope.info['category']['category6'] = true;
        $scope.info.filter.category = ['category6'];
        $scope.changeFilter({
            field : "category",
            title : "Category",
            enabled: true
        }, 'category6');
        
        $httpBackend.flush();
    }));

	it('Should have clearAppliedFilters', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('RulesListCtrl', {
			'$scope' : $scope
		});

        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
		spyOn($scope, "setRulesLabelMap");
		spyOn($scope, "setAllRulesMap");
		$httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {config: {}}});
		$httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all rules","Data":[{"rule_id":1,"key":"vce/vce/vce_janpod","notifier_id":1,"label":"Show datapath maintenance counters :: Buffer Alloc Failure is greater than 1000","description":"","author":"AppleByte W2:9-10 Mission W2:10","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Buffer Alloc Failure caused by a buffer leak, which causes a controller to become unresponsive. Check for crash file and proceed further based on the crash. Possible for an image upgrade","status":"TRUE"},{"rule_id":10,"key":"vce/vce/vce_janpod","notifier_id":10,"label":"High Card Temperature","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":11,"key":"vce/vce/vce_janpod","notifier_id":11,"label":"M3 slots not talking to each other","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":20,"key":"vce/vce/vce_janpod","notifier_id":20,"label":"Fan Tray failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":21,"key":"vce/vce/vce_janpod","notifier_id":21,"label":"Powersupply Failure for POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":22,"key":"vce/vce/vce_janpod","notifier_id":22,"label":"Power source Failure or missing","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":23,"key":"vce/vce/vce_janpod","notifier_id":23,"label":"Power Supply Failure","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":24,"key":"vce/vce/vce_janpod","notifier_id":24,"label":"Power Supply Failure - 200W PSU Disbales POE","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":27,"key":"vce/vce/vce_janpod","notifier_id":27,"label":"Show whitelist-db cpsec status :: CPSEC: APs are not coming up because of either Unapproved entries OR Certified hold entries OR Revoked entries have non Zero value","description":"","author":"Mission W4:18","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":28,"key":"vce/vce/vce_janpod","notifier_id":28,"label":"Show ap mesh topology :: Either RSSI AND/OR Rate Tx/Rx less than 20","description":"","author":"AppleByte W4:25-26","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"If the RSSI value is less than 20, then there might be problem with the distance between the Mesh portal and Mesh point. Try increasing the Tx power for both the AP or reduce the distance between the AP. Also check the Antenna gain and supported Antenna Model","status":"TRUE"},{"rule_id":29,"key":"vce/vce/vce_janpod","notifier_id":29,"label":"Show inventory :: Problem with the Inventory Item Fan Tray","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":30,"key":"vce/vce/vce_janpod","notifier_id":30,"label":"Show inventory :: Problem with the Inventory Item - Fan","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":32,"key":"vce/vce/vce_janpod","notifier_id":32,"label":"Show datapath frame counters :: Buffer leak issue","description":"","author":"Amodi","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":33,"key":"vce/vce/vce_janpod","notifier_id":33,"label":"Show ver::Reboot cause is user pushed reset","description":"","author":"Choh","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":34,"key":"vce/vce/vce_janpod","notifier_id":34,"label":"Show datapath tunnel table","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":35,"key":"vce/vce/vce_janpod","notifier_id":35,"label":"Show ap debug counters","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":36,"key":"vce/vce/vce_janpod","notifier_id":36,"label":"Show process monitor statistics::Processes restarted","description":"","author":"Nash","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":37,"key":"vce/vce/vce_janpod","notifier_id":37,"label":"Flash Memory more than 70%","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"When Flash Storage is more than 70%, performance of controller will degrade and also newer Firmware cannot be upgraded. Check for processes that consume the storage of the controller.","status":"TRUE"},{"rule_id":38,"key":"vce/vce/vce_janpod","notifier_id":38,"label":"Show datapath Utilization","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"<p class=\"MsoNormal\">Trigger generated bcoz datapath in the contoller is overloaded due to high number of packets<o:p></o:p><p class=\"MsoNormal\">in the corresponding CPU number, where the utilization is more than 60% above 64 secs  <p class=\"MsoNormal\">Recomendation: High datapath traffic related issues like - packet loss @ controller datapath<o:p></o:p>","status":"TRUE"},{"rule_id":39,"key":"vce/vce/vce_janpod","notifier_id":39,"label":"Show port stats ::Input Error bytes is > 10% of Input Bytes","description":"","author":"Bharath","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"There could be possible<span style=\"font-size: 8pt;\">throughput loss or packet loss at controller physical port level</span><p class=\"MsoNormal\"><o:p></o:p>  <p class=\"MsoNormal\"><span style=\"font-size: 8pt;\">Check for physical connectivity and related.</span><p class=\"MsoNormal\"><o:p></o:p>","status":"TRUE"},{"rule_id":42,"key":"vce/vce/vce_janpod","notifier_id":42,"label":"Show inventory :: Problem with the Inventory Item - Power Supply","description":"","author":"AppleByte W4:15","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"The power supply unit is either not connected to the power source or it is failing. If the power support is connected to the power source, please contact Aruba Support to further isolating the issue and proceed with RMA where approriate.","status":"TRUE"},{"rule_id":43,"key":"vce/vce/vce_janpod","notifier_id":43,"label":"Controller Information :: Crash Information is available for this controller","description":"","author":"Raptor-Satpal W3-8","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":51,"key":"vce/vce/vce_janpod","notifier_id":51,"label":"Show datapath bwm table :: Policed value is greater than 1000","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Policed value is greater than 1000. Check the contract ID and take action accordingly. Bandwidth contract 1 to contract 7 for CPU 0 are system built-in contracts: Contract 1: untrusted unicast Contract 2: untrusted multicast Contract 3: trusted unicast Contract 4: trusted &nbsp;lticast, that is, BPDU packets Contract 5: frames that need to be routed Contract 6: session mirror packets Contract 7: user miss frames&nbsp;","status":"TRUE"},{"rule_id":55,"key":"vce/vce/vce_janpod","notifier_id":55,"label":"Show cpuload :: CPU load greater than 80%","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" width=\"121\" style=\"height:12.75pt;width:91pt\">Check which module   is utilizing high CPU(Show cpuload current). Depends up on module we need to   check the configuration</td></tr></tbody></table>","status":"TRUE"},{"rule_id":56,"key":"vce/vce/vce_janpod","notifier_id":56,"label":"Show processes :: Process CPU utilization is more than 25% for a process","description":"","author":"NA","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"121\" style=\"border-collapse:  collapse;width:91pt\"><tbody><tr height=\"17\" style=\"height:12.75pt\">   <td height=\"17\" class=\"xl65\" width=\"121\" style=\"height:12.75pt;width:91pt\">Dependending   up on module, we need to check the configuration.</td></tr></tbody></table>","status":"TRUE"},{"rule_id":57,"key":"vce/vce/vce_janpod","notifier_id":57,"label":"Show port stats :: Cabling or GBIC failure","description":"","author":"Chang","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":60,"key":"vce/vce/vce_janpod","notifier_id":60,"label":"Show firewall :: Only allow local subnets in user table is Enabled","description":"","author":"Meggie Yao","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":61,"key":"vce/vce/vce_janpod","notifier_id":61,"label":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","description":"","author":"Ckok","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show running config :: The ip cp-redirect-address disable option is detected in the configuration.","status":"TRUE"},{"rule_id":62,"key":"vce/vce/vce_janpod","notifier_id":62,"label":"Show ap arm client-match history :: Found Sticky or Band-steer Clients","description":"","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category3","category_id":"25","severity":"DEBUG","priority":"HIGH","kb_link":"Show ap arm client-match history :: Found Sticky or Band-steer Clients.","status":"TRUE"},{"rule_id":64,"key":"vce/vce/vce_janpod","notifier_id":64,"label":"show dot1x supplicant info statistics","description":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects)","author":"Barath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"All clients have .1x supplicant, if they are not compatible, even if the controller sends an EAP pkt, supplicant will send eap NAK(client rejects). Uninstall/reinstall client supplicant, use same supplicant on a dif pc, reboot pc. And troubleshoot associated to this.","status":"TRUE"},{"rule_id":65,"key":"vce/vce/vce_janpod","notifier_id":65,"label":"Show ap arm state :: SNR value is lessthan 20","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"FALSE"},{"rule_id":66,"key":"vce/vce/vce_janpod","notifier_id":66,"label":"Show memory ecc :: Correctable and non correctable errors found","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":67,"key":"vce/vce/vce_janpod","notifier_id":67,"label":"Show aaa authentication all :: Failure is morethan 10% of Success","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Do the troubleshooting based on the failure shown","status":"TRUE"},{"rule_id":68,"key":"vce/vce/vce_janpod","notifier_id":68,"label":"Show aaa authentication-server radius statistics :: Avgerage Respective Time is morethan 100ms ","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Possible authentication server latency issues","status":"TRUE"},{"rule_id":69,"key":"vce/vce/vce_janpod","notifier_id":69,"label":"Show aaa authentication-server radius statistics :: Free Sequence is lessthan 50% of total","description":"","author":"Bharath","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"High rate of incoming auth request for the respective server","status":"TRUE"},{"rule_id":78,"key":"vce/vce/vce_janpod","notifier_id":78,"label":"Show datapath station table :: Bad Encrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad Encrypt   indicates, that due to some issue the controller is unable to encrypt the   data. Possiblity client side issue or issue with the AP. Check the AP   related information","status":"TRUE"},{"rule_id":82,"key":"vce/vce/vce_janpod","notifier_id":82,"label":"Show aaa authentication vpn default-rap :: Certificate based RAP do not support external AAA server authentication.","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":86,"key":"vce/vce/vce_janpod","notifier_id":86,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":87,"key":"vce/vce/vce_janpod","notifier_id":87,"label":"Show datapath tunnel table :: Decaps or Encaps more than 100 times the average","description":"","author":"AppleByte W3 11-12","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":88,"key":"vce/vce/vce_janpod","notifier_id":88,"label":"Show switches :: Two or more switches with different version","description":"","author":"AppleByte W2:20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":89,"key":"vce/vce/vce_janpod","notifier_id":89,"label":"Show ap debug counters :: APs on this controller bootstrapping frequently","description":"","author":"AppleByte W3:19-20","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":95,"key":"vce/vce/vce_janpod","notifier_id":95,"label":"NVRAM Failure","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category8","category_id":"13","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":96,"key":"vce/vce/vce_janpod","notifier_id":96,"label":"System Logs::Licenses Expiry","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"ERROR","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":97,"key":"vce/vce/vce_janpod","notifier_id":97,"label":"System Log :: MESHD process initialization failed","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":98,"key":"vce/vce/vce_janpod","notifier_id":98,"label":"Error Log:: When Fan Fails in the Controller","description":"","author":"Nash","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":99,"key":"vce/vce/vce_janpod","notifier_id":99,"label":"Show datapath session table AND Show datapath tunnel table AND Show ap active :: Potential issue caused by LLDP traffic coming on Controller from an AP","description":"","author":"Rdhiman","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"FALSE"},{"rule_id":101,"key":"vce/vce/vce_janpod","notifier_id":101,"label":"Show datapath user table AND Show datapath route-cache verbose :: Some users are not able to pass traffic.","description":"","author":"Mission W3:8","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category9","category_id":"10","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":110,"key":"vce/vce/vce_janpod","notifier_id":110,"label":"Show vpdn l2tp local pool :: vpdn l2tp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":111,"key":"vce/vce/vce_janpod","notifier_id":111,"label":"Show vpdn pptp local pool :: vpdn pptp local IP pool is exhausted","description":"","author":"David Nie","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":112,"key":"vce/vce/vce_janpod","notifier_id":112,"label":"Show license verbose :: Either the licenses had been expired or reload is rquired","description":"","author":"Shawn A","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":113,"key":"vce/vce/vce_janpod","notifier_id":113,"label":"Show memory :: Processes consuming more than the Typical memory allocated","description":"","author":"AppleByte","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":115,"key":"vce/vce/vce_janpod","notifier_id":115,"label":"Show processes :: Process state is z which stands for defunct or zoomie OR t which stands for traced or stopped","description":"","author":"Shawn A, Payal","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category4","category_id":"12","severity":"INFO","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":118,"key":"vce/vce/vce_janpod","notifier_id":118,"label":"Show datapath station table :: Bad Decrypts is more than 1000","description":"","author":"AppleByte","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"Bad decrypt indicates, that due to some issue the controller is unable to decrypt the data. Possiblity client side issue or issue with the AP. Check the AP releated information like AP bootstrap, reboot, timeout, tx and rx error/drops","status":"TRUE"},{"rule_id":119,"key":"vce/vce/vce_janpod","notifier_id":119,"label":"Show ap image version :: Running Image Version is different than the Flash Production version","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"Try to reboot the AP, so that AP can upgrade its image version. Or else manually push the image to the AP by using flash command.","status":"TRUE"},{"rule_id":120,"key":"vce/vce/vce_janpod","notifier_id":120,"label":"Show ip ospf neighbor :: State for the Neighbor ID is INIT","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":122,"key":"vce/vce/vce_janpod","notifier_id":122,"label":"Show ip ospf :: SPF count is greater than 100","description":"","author":"NA","created_ts":1433390400000,"modified_ts":1433390400000,"category":"category6","category_id":"11","severity":"INFO","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":127,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":128,"key":"vce/vce/vce_janpod","notifier_id":127,"label":"Show datapath Crypto Counters/Datapath Crypto Statistics :: Crypto HW Queues are exhausted","description":"","author":"AppleByte W1:32","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":129,"key":"vce/vce/vce_janpod","notifier_id":129,"label":"SYSTEM LOG :: BSSID is all 0s","description":"","author":"Nshi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"HIGH","kb_link":"","status":"TRUE"},{"rule_id":130,"key":"vce/vce/vce_janpod","notifier_id":130,"label":"SECURITY LOG / ERROR LOG :: Controller may experience high datapath CPU","description":"","author":"Amodi","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":131,"key":"vce/vce/vce_janpod","notifier_id":131,"label":"Show running config :: Setting the crypto MTU will cause severe performance impact.","description":"","author":"Myao/Mmoussa","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"","status":"TRUE"},{"rule_id":132,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: More than 100 UDR","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":133,"key":"vce/vce/vce_janpod","notifier_id":132,"label":"Show running config aaa derivation-rules user :: Number of UDR between 50 and 100","description":"","author":"Tgrover","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"LOW","kb_link":"Starting from 6.1.3.0 there is a limit for the number of supported UDR to 100. If any configuration have more than 100 UDR, controller will ignore them. Suggest the customer to upgrade the controller to latest image version, refer to bug 68304 for the bug and fix","status":"TRUE"},{"rule_id":134,"key":"vce/vce/vce_janpod","notifier_id":134,"label":"Show netstat :: Received Q greater than 10000","description":"","author":"Raptor-Satpal W1:14","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"},{"rule_id":135,"key":"vce/vce/vce_janpod","notifier_id":135,"label":"Show netstat :: Count is greater than 200","description":"","author":"Mission W2:6-7","created_ts":1411272000000,"modified_ts":1411272000000,"category":"category6","category_id":"11","severity":"DEBUG","priority":"MEDIUM","kb_link":"","status":"TRUE"}]});
        $httpBackend.flush();
		$scope.clearAppliedFilters();
		$scope.info.filter = {
			label : 'Label1'
		};
		$scope.info.page['sortField'] = 'categorydesc';
		$scope.clearAppliedFilters();
	}));
	
	it('Should have checkAppliedFilters', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        expect($scope.checkAppliedFilters()).toBeFalsy();
        $scope.info.filter = {
            key1: 'value1'
        };
        expect($scope.checkAppliedFilters()).toBeTruthy();
    }));
    
    it('Should have renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        $controller('RulesListCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        
        $scope.renderHtml('abcd<strong>df</strong>');
    }));
});

describe('AddCategoryCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp.controllers.rules', 'gbApp.services', 'gbApp.services.rules', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('Should have info', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddCategoryCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('info')).toBeTruthy();
		expect($scope.info).toEqual(jasmine.any(Object));
	}));
	
	it('Should have clearMessage', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.clearMessage();
        $scope.info.categoriesLoading = false;
        $scope.clearMessage();
    }));
	
	it('Should have loadCategories', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
	    var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.flush();
	}));
	
	it('Should have loadCategories with error', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.flush();
    }));
    
    it('Should have loadCategories with error connection refused', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.info.errorMsg = "Error";
        $httpBackend.flush();
    }));
    
    it('Should have loadCategories with error else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.info.errorMsg = "Error";
        $httpBackend.flush();
    }));

	it('Should have addCategory', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddCategoryCtrl', {
			'$scope' : $scope
		});
		$scope.addCategory();
	}));

	it('Should have editCategory', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddCategoryCtrl', {
			'$scope' : $scope
		});
		$scope.editCategory({
			category : 'category1',
			description : 'description1'
		});
	}));

	it('Should have undoCategory', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddCategoryCtrl', {
			'$scope' : $scope
		});
		var category = {
			category : 'category1',
			description : 'description1'
		};
		$scope.editCategory(category);
		$scope.undoCategory(category);
	}));

	it('Should have deleteCategory', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddCategoryCtrl', {
			'$scope' : $scope
		});
		$scope.info.rulesList = [{category_id: 12}];
		var category = {category_id: 12};
		$scope.deleteCategory(category);
		var category = {category_id: 14, edit: true};
		spyOn($scope, 'undoCategory');
        $scope.deleteCategory(category);
        expect($scope.undoCategory).toHaveBeenCalledWith(category);
        expect(category.deleted).toBeTruthy();
        var category = {category_id: 15};
        $scope.deleteCategory(category);
        expect(category.deleted).toBeTruthy();
	}));
	
	it('Should have undoDeleteCategory', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        var category = {deleted: true, key: 'value'};
        $scope.undoDeleteCategory(category);
        expect(category).toEqual({key: 'value'});
    }));
	
	it('Should have deleteNewCategory', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddCategoryCtrl', {
			'$scope' : $scope
		});
		$scope.addCategory();
		$scope.addCategory();
		$scope.addCategory();
		$scope.addCategory();
		$scope.deleteNewCategory(2);
	}));
	
	it('Should have validateCategories', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.categories = [{category: ''}];
        $scope.validateCategories();
        $scope.info.categories = [{category: 'abc'}, {category: 'def'}, {category: 'abc'}];
        $scope.validateCategories();
        $scope.info.categories = [{category: 'abc'}];
        $scope.info.newCategories = [{category: 'def'}, {category: 'abc'}];
        $scope.validateCategories();
        $scope.info.categories = [{category: 'xyz'}];
        $scope.info.newCategories = [{category: '', category_description: ''}, {category: '', category_description: 'abcd'}];
        $scope.validateCategories();
        $scope.info.newCategories = [{category: 'abc'}, {category: 'def'}, {category: 'abc'}];
        $scope.validateCategories();
        $scope.info.newCategories = [];
        $scope.validateCategories();
    }));
    
    it('Should have getOperationsCount', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.categories = [{deleted: true}, {edit: true, category: 'abc', initialCategory: 'abc', category_description: 'def', initialDescription: 'xyz'}, {}];
        $scope.info.newCategories = [{category: '', category_description: ''}, {category: 'cat1', category_description: 'des1'}];
        expect($scope.getOperationsCount()).toEqual(3);
    }));
	
	it('Should have saveCategories', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddCategoryCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, 'validateCategories').and.returnValue(false);
		$scope.saveCategories();
		
		$scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, 'validateCategories').and.returnValue(true);
        spyOn($scope, 'getOperationsCount').and.returnValue(0);
        $scope.saveCategories();
        
        $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.categories = [{}, {}];
        $scope.info.newCategories = [{category: ''}];
        spyOn($scope, 'validateCategories').and.returnValue(true);
        spyOn($scope, 'getOperationsCount').and.returnValue(3);
        $scope.info.categories = [{category_id: 1, category: 'cat1', category_description: 'des1', deleted: true}, {category_id: 2, category: 'cat2', category_description: 'des2', initialCategory: 'cat2', initialDescription: 'des23', edit: true}, {}];
        $scope.info.newCategories = [{category: 'cat3', category_description: 'des3'}, {category: '', description: ''}];
        $scope.saveCategories();
	}));
	
	it('Should have callDeleteCategory', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.doneOperations = 0;
        $scope.info.operationsCount = 2;
        spyOn($scope, "loadCategories");
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(200);
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 2).respond(200);
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 3).respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/delete').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/delete').respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/delete').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.callDeleteCategory({category_id: 1, category: 'cat1', category_description: 'des1', deleted: true});
        $scope.callDeleteCategory({category_id: 2, category: 'cat2', category_description: 'des2', deleted: true});
        $scope.callDeleteCategory({category_id: 3, category: 'cat3', category_description: 'des3', deleted: true});
        $httpBackend.flush();
    }));
    
    it('Should have callDeleteCategory error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.doneOperations = 0;
        $scope.info.operationsCount = 3;
        spyOn($scope, "loadCategories");
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 2).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/delete/' + manufacturer + '/' + product + '/' + schema + '/' + 3).respond(500, {Msg: 'Connection refused'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.callDeleteCategory({category_id: 1, category: 'cat1', category_description: 'des1', deleted: true});
        $scope.callDeleteCategory({category_id: 2, category: 'cat2', category_description: 'des2', deleted: true});
        $scope.callDeleteCategory({category_id: 3, category: 'cat3', category_description: 'des3', deleted: true});
        $httpBackend.flush();
    }));
    
    it('Should have callEditCategory', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.doneOperations = 0;
        $scope.info.operationsCount = 2;
        spyOn($scope, "loadCategories");
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(200);
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 2).respond(200);
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 3).respond(200);
        
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/edit').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/edit').respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/edit').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.callEditCategory({category_id: 1, category: 'cat1', category_description: 'des1', initialCategory: 'cat1', initialDescription: 'des2', edit: true});
        $scope.callEditCategory({category_id: 2, category: 'cat2', category_description: 'des2', initialCategory: 'cat23', initialDescription: 'des1', edit: true});
        $scope.callEditCategory({category_id: 3, category: 'cat3', category_description: 'des3', initialCategory: 'cat3', initialDescription: 'des4', edit: true});
        
        $httpBackend.flush();
    }));
    
    it('Should have callEditCategory else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.doneOperations = 0;
        $scope.info.operationsCount = 2;
        spyOn($scope, "loadCategories");
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 4).respond(200);
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 3).respond(200);
        
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/edit').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/edit').respond(500, {});
        
        $scope.callEditCategory({category_id: 4, category: 'cat4', category_description: 'des4', initialCategory: 'cat43', initialDescription: 'des43', edit: true});
        $scope.callEditCategory({category_id: 3, category: 'cat3', category_description: 'des3', initialCategory: 'cat3', initialDescription: 'des34', edit: true});
        $httpBackend.flush();
    }));
    
    it('Should have callEditCategory error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.doneOperations = 0;
        $scope.info.operationsCount = 3;
        spyOn($scope, "loadCategories");
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 1).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 2).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 3).respond(500, {Msg: 'Connection refused'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.callEditCategory({category_id: 1, category: 'cat1', category_description: 'des1', initialCategory: 'cat1', initialDescription: 'des2', edit: true});
        $scope.callEditCategory({category_id: 2, category: 'cat2', category_description: 'des2', initialCategory: 'cat23', initialDescription: 'des1', edit: true});
        $scope.callEditCategory({category_id: 3, category: 'cat3', category_description: 'des3', initialCategory: 'cat34', initialDescription: 'des4', edit: true});
        
        $httpBackend.flush();
    }));
    
    it('Should have callEditCategory error block else block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.doneOperations = 0;
        $scope.info.operationsCount = 2;
        spyOn($scope, "loadCategories");
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 4).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/update/' + manufacturer + '/' + product + '/' + schema + '/' + 3).respond(500, {});
        
        $scope.callEditCategory({category_id: 4, category: 'cat4', category_description: 'des4', initialCategory: 'cat43', initialDescription: 'des43', edit: true});
        $scope.callEditCategory({category_id: 3, category: 'cat3', category_description: 'des3', initialCategory: 'cat3', initialDescription: 'des34', edit: true});
        $httpBackend.flush();
    }));
    
    it('Should have callAddCategory', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.doneOperations = 0;
        $scope.info.operationsCount = 2;
        spyOn($scope, "loadCategories");
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/add/' + manufacturer + '/' + product + '/' + schema, {'category': 'cat1', 'category_description': 'des1'}).respond(200);
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/add/' + manufacturer + '/' + product + '/' + schema, {'category': 'cat2', 'category_description': 'des2'}).respond(200);
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/add/' + manufacturer + '/' + product + '/' + schema, {'category': 'cat3', 'category_description': 'des3'}).respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/add').respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/add').respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Category/add').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.callAddCategory({category: 'cat1', category_description: 'des1'});
        $scope.callAddCategory({category: 'cat2', category_description: 'des2'});
        $scope.callAddCategory({category: 'cat3', category_description: 'des3'});
        $httpBackend.flush();
    }));
    
    it('Should have callAddCategory error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.info.doneOperations = 0;
        $scope.info.operationsCount = 3;
        spyOn($scope, "loadCategories");
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({"Status":"Success","Msg":"List of all category","Data":[{"category_id":13,"category":"category8","category_description":"description8","creation_date":"2015-07-24 09:10:54.67","mps":"vce/vce/vce_janpod"},{"category_id":12,"category":"category4","category_description":"description4","creation_date":"2015-07-27 02:10:41.569","mps":"vce/vce/vce_janpod"},{"category_id":25,"category":"category3","category_description":"description3","creation_date":"2015-07-28 03:11:48.81","mps":"vce/vce/vce_janpod"},{"category_id":11,"category":"category6","category_description":"description6","creation_date":"2015-07-29 06:46:24.179","mps":"vce/vce/vce_janpod"},{"category_id":10,"category":"category9","category_description":"description9","creation_date":"2015-07-29 06:46:24.177","mps":"vce/vce/vce_janpod"},{"category_id":38,"category":"delete1","category_description":"delete1","creation_date":"2015-07-30 03:22:33.933","mps":"vce/vce/vce_janpod"}]});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/add/' + manufacturer + '/' + product + '/' + schema, {'category': 'cat1', 'category_description': 'des1'}).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/add/' + manufacturer + '/' + product + '/' + schema, {'category': 'cat2', 'category_description': 'des2'}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + '/rules/category/add/' + manufacturer + '/' + product + '/' + schema, {'category': 'cat3', 'category_description': 'des3'}).respond(500, {Msg: 'Connection refused'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        $scope.callAddCategory({category: 'cat1', category_description: 'des1'});
        $scope.callAddCategory({category: 'cat2', category_description: 'des2'});
        $scope.callAddCategory({category: 'cat3', category_description: 'des3'});
        $httpBackend.flush();
    }));
    
    it('Should have goToAddRule', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        $scope.$parent = {
            changeCurrentPage : function() {
                
            }
        };
        spyOn($scope.$parent, "changeCurrentPage");
        $scope.goToAddRule();
        expect($scope.$parent.changeCurrentPage).toHaveBeenCalledWith('add_rule');
    }));
    
    it('Should have renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        $controller('AddCategoryCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        
        $scope.renderHtml('abcd<strong>df</strong>');
    }));
});

describe('TestRuleCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp.controllers.rules', 'gbApp.services', 'gbApp.services.rules', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('infoserverDomainStaging', 'undefined');
		$provide.value('infoserverStagingSchema', 'undefined');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
	
	it('Should have clearMessage', inject(function($rootScope, $controller, RulesService) {
	    RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.testresultLoading = true;
        $scope.clearMessage();
        
        $scope.info.testresultLoading = false;
        $scope.clearMessage();
    }));
    
    it('Should have changePageSize', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "populateDataPathData");
        spyOn($scope, "populateRulesData");
        $scope.info.page = {
            "total" : 0,
            "current" : 1,
            "pages" : 0,
            "count" : 10
        };
        $scope.changePageSize();
        $scope.info.page['current'] = 3;
        $scope.info.page['total'] = 100;
        $scope.info.page['count'] = 10;
        $scope.changePageSize();
        $scope.changePageSize('rules');
    }));
	
	// it('Should have increaseCount', inject(function($rootScope, $controller, RulesService) {
	    // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
        // $scope.info.page = {
            // "total" : 0,
            // "current" : 1,
            // "pages" : 0,
            // "count" : 10
        // };
        // spyOn($scope, "populateDataPathData");
        // $scope.info.page['count'] = 10;
        // $scope.info.page['total'] = 340;
        // $scope.increaseCount();
        // $scope.info.page['current'] = 350;
        // $scope.info.page['pages'] = 340;
        // $scope.increaseCount();
        // $scope.info.page['count'] = 340;
        // $scope.increaseCount();
    // }));

    // it('Should have decreaseCount', inject(function($rootScope, $controller, RulesService) {
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
        // $scope.info.page = {
            // "total" : 0,
            // "current" : 1,
            // "pages" : 0,
            // "count" : 10
        // };
        // spyOn($scope, "populateDataPathData");
        // $scope.decreaseCount();
        // $scope.info.page['count'] = 4;
        // $scope.decreaseCount();
    // }));

    it('Should have nextPage', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.info.page = {
            "total" : 0,
            "current" : 1,
            "pages" : 0,
            "count" : 10
        };
        spyOn($scope, "populateDataPathData");
        spyOn($scope, "populateRulesData");
        $scope.nextPage();
        $scope.info.page['current'] = 1;
        $scope.info.page['pages'] = 2;
        $scope.nextPage();
        $scope.info.page['current'] = 1;
        $scope.info.page['pages'] = 2;
        $scope.nextPage('rules');
    }));

    it('Should have prevPage', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.info.page = {
            "total" : 0,
            "current" : 1,
            "pages" : 0,
            "count" : 10
        };
        spyOn($scope, "populateDataPathData");
        spyOn($scope, "populateRulesData");
        $scope.prevPage();
        $scope.info.page['current'] = 2;
        $scope.prevPage();
        $scope.info.page['current'] = 2;
        $scope.prevPage('rules');
    }));

    it('Should have firstPage', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.info.page = {
            "total" : 0,
            "current" : 1,
            "pages" : 0,
            "count" : 10
        };
        spyOn($scope, "populateDataPathData");
        spyOn($scope, "populateRulesData");
        $scope.firstPage();
        $scope.info.page['current'] = 2;
        $scope.firstPage();
        $scope.info.page['current'] = 2;
        $scope.firstPage('rules');
    }));

    it('Should have lastPage', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.info.page = {
            "total" : 0,
            "current" : 1,
            "pages" : 0,
            "count" : 10
        };
        spyOn($scope, "populateDataPathData");
        spyOn($scope, "populateRulesData");
        $scope.lastPage();
        $scope.info.page = {
            "total" : 0,
            "current" : 1,
            "pages" : 0,
            "count" : 10
        };
        $scope.lastPage('rules');
        $scope.info.page['current'] = $scope.info.page['pages'];
        $scope.lastPage();
    }));
    
    it('Should have checkfileUploadToLCPStatus', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "insertBundleRuleAssociation");
        
        $scope.info.checkUploadToLCPCount = 3;
        var fileEpoch = "93983983";
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/fileupload/stage/status/' + manufacturer + '/' + product + '/' + schema + '/' + fileEpoch).respond({Status: "Success"});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        
        $scope.checkfileUploadToLCPStatus(fileEpoch);
        $httpBackend.flush();
    }));
    
    it('Should have checkfileUploadToLCPStatus else block', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.checkUploadToLCPCount = 10;
        var fileEpoch = "93983983";
        
        $scope.checkfileUploadToLCPStatus(fileEpoch);
    }));
    
    it('Should have checkfileUploadToLCPStatus with fileupload failed', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "insertBundleRuleAssociation");
        
        $scope.info.checkUploadToLCPCount = 3;
        var fileEpoch = "93983983";
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/fileupload/stage/status/' + manufacturer + '/' + product + '/' + schema + '/' + fileEpoch).respond({Status: "Failure"});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        
        $scope.checkfileUploadToLCPStatus(fileEpoch);
        $httpBackend.flush();
        spyOn($scope, "checkfileUploadToLCPStatus");
        $timeout.flush(5000);
    }));
    
    it('Should have checkfileUploadToLCPStatus error block', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "insertBundleRuleAssociation");
        
        $scope.info.checkUploadToLCPCount = 3;
        var fileEpoch = "93983983";
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/fileupload/stage/status/' + manufacturer + '/' + product + '/' + schema + '/' + fileEpoch).respond(500, {Status: "Failure", Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        
        $scope.checkfileUploadToLCPStatus(fileEpoch);
        $httpBackend.flush();
    }));
    
    // it('Should have checkfileUploadToLCPStatus error block session timeout', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // spyOn($scope, "insertBundleRuleAssociation");
//         
        // $scope.info.checkUploadToLCPCount = 3;
        // var fileEpoch = "93983983";
//         
        // // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        // $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/fileupload/stage/status/' + manufacturer + '/' + product + '/' + schema + '/' + fileEpoch).respond(500, {Status: "Failure", Msg: "timeout"});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        // $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
//         
        // $scope.checkfileUploadToLCPStatus(fileEpoch);
        // $httpBackend.flush();
    // }));
    
    it('Should have insertBundleRuleAssociation', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "loadAllStageBundles");
        
        $scope.info.insertedStageRules = "12";
        $scope.info.bunldeSignatureCount = 3;
        $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        $scope.info.bundlesList = [{bundle_state: 2}];
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/bundle/insert/' + manufacturer + '/' + product + '/' + schema).respond({Data: 4});
        
        $scope.insertBundleRuleAssociation();
        $httpBackend.flush();
    }));
    
    it('Should have insertBundleRuleAssociation with processing bundle', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.insertedStageRules = "12";
        $scope.info.bunldeSignatureCount = 3;
        $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        $scope.info.bundlesList = [{bundle_state: 1}];
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/bundle/insert/' + manufacturer + '/' + product + '/' + schema).respond({Data: 4});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Failure", Data: [], Msg: ""});
        
        $scope.insertBundleRuleAssociation();
        $httpBackend.flush();
    }));
    
    it('Should have insertBundleRuleAssociation with count matching', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.insertedStageRules = "12";
        $scope.info.bunldeSignatureCount = 3;
        $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        // $scope.info.bundlesList = [{bundle_state: 1}];
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/bundle/insert/' + manufacturer + '/' + product + '/' + schema).respond({Data: '3'});
        
        $scope.insertBundleRuleAssociation();
        $httpBackend.flush();
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Failure", Data: [], Msg: ""});
        $timeout.flush(3000);
    }));
    
    it('Should have insertBundleRuleAssociation insert bundle error block', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.insertedStageRules = "12";
        $scope.info.bunldeSignatureCount = 3;
        $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        $scope.info.bundlesList = [{bundle_state: 1}];
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/bundle/insert/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        
        $scope.insertBundleRuleAssociation();
        $httpBackend.flush();
    }));
    
    // it('Should have insertBundleRuleAssociation insert bundle error block session timeout', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $scope.info.insertedStageRules = "12";
        // $scope.info.bunldeSignatureCount = 3;
        // $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        // $scope.info.bundlesList = [{bundle_state: 1}];
//         
        // // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        // $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        // // 
        // $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/bundle/insert/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        // $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
//         
        // $scope.insertBundleRuleAssociation();
        // $httpBackend.flush();
    // }));
    
    it('Should have insertBundleRuleAssociation insert bundle error block connection refused', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.insertedStageRules = "12";
        $scope.info.bunldeSignatureCount = 3;
        $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        $scope.info.bundlesList = [{bundle_state: 1}];
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}}); 
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/bundle/insert/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.insertBundleRuleAssociation();
        $httpBackend.flush();
    }));
    
    it('Should have insertBundleRuleAssociation lcp not running', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.insertedStageRules = "12";
        $scope.info.bunldeSignatureCount = 3;
        $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        $scope.info.bundlesList = [{bundle_state: 1}];
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Failure", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Failure", Data: [], Msg: ""});
        
        $scope.insertBundleRuleAssociation();
        $httpBackend.flush();
    }));
    
    it('Should have insertBundleRuleAssociation monitor lcp error block', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.insertedStageRules = "12";
        $scope.info.bunldeSignatureCount = 3;
        $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        $scope.info.bundlesList = [{bundle_state: 1}];
        
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond(500, {Status: "Failure", Data: [], Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond(500, {Status: "Failure", Data: [], Msg: ""});
        
        $scope.insertBundleRuleAssociation();
        $httpBackend.flush();
    }));
    
    // it('Should have insertBundleRuleAssociation monitor lcp error block session timeout', inject(function($rootScope, $controller, RulesService, $timeout, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $scope.info.insertedStageRules = "12";
        // $scope.info.bunldeSignatureCount = 3;
        // $scope.info.selectedRules = [{status: 'DRAFT', rule_id: '23'}];
        // $scope.info.bundlesList = [{bundle_state: 1}];
//         
        // // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        // $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond(500, {Status: "Failure", Data: [], Msg: "timeout"});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond(500, {Status: "Failure", Data: [], Msg: ""});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        // $scope.insertBundleRuleAssociation();
        // $httpBackend.flush();
    // }));
    
    it('Should have getInsertRuleData', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.selectedRules = [{
            rule_id: 1,
            notifier_id: 1,
            category_id: 3,
            email_template_id: 12
        }, {
            rule_id: 2,
            notifier_id: 2,
            category_id: 3,
            email_template_id: 12
        }, {
            rule_id: 3,
            notifier_id: 3,
            category_id: 4,
            email_template_id: 0
        }, {
            rule_id: 4,
            notifier_id: 4,
            category_id: 5,
            email_template_id: 13
        }];
        
        expect($scope.getInsertRuleData()).toEqual({ rule_id: '1,2,3,4', notifier_id: '1,2,3,4', category_id: '3,4,5', template_id: '12,13' });
        
        $scope.info.selectedRules = [{
            rule_id: 1,
            notifier_id: 1,
            category_id: 3,
            email_template_id: 0
        }, {
            rule_id: 2,
            notifier_id: 2,
            category_id: 3,
            email_template_id: 0
        }, {
            rule_id: 3,
            notifier_id: 3,
            category_id: 4,
            email_template_id: 0
        }, {
            rule_id: 4,
            notifier_id: 4,
            category_id: 5,
            email_template_id: 0
        }];
        
        expect($scope.getInsertRuleData()).toEqual({ rule_id: '1,2,3,4', notifier_id: '1,2,3,4', category_id: '3,4,5' });
    }));
    
    it('Should load with 1 selected rule', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([{}]);
        
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
    }));
    
    it('Should have loadAllStageBundles with loading bundle', inject(function($rootScope, $controller, $timeout, $httpBackend, RulesService, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{bundle_state: 1, supported: true}, {bundle_state: 2, supported: true}], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});

        $httpBackend.flush();
        spyOn($scope, "loadAllStageBundles");
        $timeout.flush(5000);
    }));
    
    it('Should have load APIs', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {allowed_extension: 'zip'}, Msg: ""}});

        $httpBackend.flush();
        
        for(var i = 0; i < $scope.info.uploader.filters.length; i++) {
            if($scope.info.uploader.filters[i].name == 'extensionFilter') {
                $scope.info.uploader.filters[i].fn({name: 'abc.zip'});
                break;
            }
        }
        
        for(var i = 0; i < $scope.info.uploader.filters.length; i++) {
            if($scope.info.uploader.filters[i].name == 'extensionFilter') {
                $scope.info.uploader.filters[i].fn({name: 'abc.tar.gz'});
                break;
            }
        }
    }));
    
    it('Should have load APIs with timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        GlobalService.setVal('logout_url', '#');
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: "Session timeout"});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: "Session timeout"});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');

        $httpBackend.flush();
    }));
    
    it('Should have load APIs monitor lcp with timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        GlobalService.setVal('logout_url', '#');
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond(500, {Status: "Failure", Data: [], Msg: "Session timeout"});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: "Session timeout"});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');

        $httpBackend.flush();
    }));
    
    it('Should have load APIs connection refused', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        GlobalService.setVal('logout_url', '#');
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: "Connection refused"});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.whenGET('partials/session_timeout.html').respond('');

        $httpBackend.flush();
    }));
    
    it('Should have load APIs with failure', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {file_upload_config: {}}, Msg: ""});

        $httpBackend.flush();
    }));
    
    it('Should have load APIs with failure and timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        GlobalService.setVal('logout_url', '#');
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: "Session timeout"});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {file_upload_config: {}}, Msg: "Session timeout"});
        $httpBackend.whenGET('partials/session_timeout.html').respond('text');
        
        $httpBackend.flush();
    }));
    
    // it('Should have load APIs for single bundle', inject(function($rootScope, $controller, $httpBackend, $timeout, RulesService, infoserverDomain) {
        // RulesService.setSingleBundleTesting(true);
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/lastseen/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        // $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
// 
        // $timeout.flush(200);
    // }));
    
    // it('Should have load APIs for single bundle with timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomain) {
        // RulesService.setSingleBundleTesting(true);
        // RulesService.setTestRuleData([]);
        // GlobalService.setVal('logout_url', '#');
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/lastseen/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: "Session timeout"});
        // $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: "Session timeout"});
// 
        // $httpBackend.flush();
    // }));
//     
    // it('Should have load APIs for single bundle with failure', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        // RulesService.setSingleBundleTesting(true);
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/lastseen/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: ""});
        // $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {file_upload_config: {}}, Msg: "timeout"});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
// 
        // $httpBackend.flush();
    // }));
//     
    // it('Should have load APIs for single bundle with failure and timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomain) {
        // RulesService.setSingleBundleTesting(true);
        // RulesService.setTestRuleData([]);
        // GlobalService.setVal('logout_url', '#');
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/lastseen/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: "Session timeout"});
        // $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {file_upload_config: {}}, Msg: "Session timeout"});
        // $httpBackend.whenGET('partials/session_timeout.html').respond('text');
//         
        // $httpBackend.flush();
    // }));
    
    it('Should have checkAllExpanded', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.checkAllExpanded();
        
        $scope.info.selectedRules = [{expanded: true}, {expanded: false}];
        $scope.checkAllExpanded();
    }));
    
    it('Should have ruleExpandCollapse', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.selectedRules = [{expanded: true}, {expanded: false}];
        $scope.info.allExpanded = true;
        $scope.ruleExpandCollapse();
        
        $scope.info.allExpanded = false;
        $scope.ruleExpandCollapse();
    }));
    
    it('Should have renderHtml', inject(function($rootScope, $controller, $sce, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        
        $scope.renderHtml('abcd<strong>df</strong>');
    }));
    
    it('Should have openUploadLogModal', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.openUploadLogModal();
    }));
    
    it('Should have openDatapathModal', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
        $scope.openDatapathModal();
    }));
    
    it('Should have showTestDetails', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "populateDataPathData");
        spyOn($scope, "openDatapathModal");
        
        var test = {label: 'label1', texts: ['ac', 'ab']};
        $scope.showTestDetails(test);
    }));
    
    it('Should have populateDataPathData', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.info.page = {};
        $scope.datapathModalData = [{}, {}];
        $scope.populateDataPathData();
    }));
    
    it('Should have populateRulesData', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.info.page = {};
        $scope.info.bundleRules = [{}, {}];
        $scope.populateRulesData();
    }));
    
    it('Should have openRulesDetails', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "populateRulesData");
        $scope.info.selectedRules = [{}];
        $scope.openRulesDetails();
    }));
    
    it('Should have openRulesDetails with arguments', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "populateRulesData");
        $scope.info.selectedRules = [{}];
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('GET', 'partials/rules-and-alerts/rules_details.html').respond('');
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: ""});
        
        $scope.openRulesDetails('12, 34');
        $httpBackend.flush();
    }));
    
    it('Should have openRulesDetails with arguments error block', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "populateRulesData");
        $scope.info.selectedRules = [{}];
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('GET', 'partials/rules-and-alerts/rules_details.html').respond('');
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: "", Msg: ""});
        
        $scope.openRulesDetails('12, 34');
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.modal, "close");
        $httpBackend.flush();
    }));
    
    it('Should have openRulesDetails with arguments error block session timeout', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "populateRulesData");
        $scope.info.selectedRules = [{}];
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('GET', 'partials/rules-and-alerts/rules_details.html').respond('');
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: "", Msg: "timeout"});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.openRulesDetails('12, 34');
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.modal, "close");
        $httpBackend.flush();
    }));
    
    it('Should have openRulesDetails with arguments error block connection refused', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "populateRulesData");
        $scope.info.selectedRules = [{}];
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('GET', 'partials/rules-and-alerts/rules_details.html').respond('');
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: "", Msg: "Connection refused"});
        
        $scope.openRulesDetails('12, 34');
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.modal, "close");
        $httpBackend.flush();
    }));
    
    it('Should have getBundleId', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.getBundleId({});
    }));
    
    it('Should have getBundleId with bundle data', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getStagingRulesforBundle");
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle_id/list/' + manufacturer + '/' + product + '/' + schema + '/' + 27).respond({Data: ""});
        
        $scope.getBundleId({rule_id: 23, load_id: 27});
        $httpBackend.flush();
    }));
    
    it('Should have getBundleId error block', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getStagingRulesforBundle");
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle_id/list/' + manufacturer + '/' + product + '/' + schema + '/' + 27).respond(500, {Data: "", Msg: ""});
        
        $scope.getBundleId({rule_id: 23, load_id: 27});
        $httpBackend.flush();
    }));
    
    it('Should have getBundleId error block session timeout', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getStagingRulesforBundle");
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle_id/list/' + manufacturer + '/' + product + '/' + schema + '/' + 27).respond(500, {Data: "", Msg: "timeout"});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.getBundleId({rule_id: 23, load_id: 27});
        $httpBackend.flush();
    }));
    
    it('Should have getBundleId error block connection refused', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getStagingRulesforBundle");
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('GET', infoserverDomain + '/rules/stage/bundle_id/list/' + manufacturer + '/' + product + '/' + schema + '/' + 27).respond(500, {Data: "", Msg: "Connection refused"});
        
        $scope.getBundleId({rule_id: 23, load_id: 27});
        $httpBackend.flush();
    }));
    
    it('Should have getStagingRulesforBundle', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "viewTestResults");
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: ""});
        
        $scope.getStagingRulesforBundle({rule_id: 23});
        $httpBackend.flush();
    }));
    
    it('Should have getStagingRulesforBundle error block', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "viewTestResults");
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: "", Msg: ""});
        
        $scope.getStagingRulesforBundle({rule_id: 23});
        $httpBackend.flush();
    }));
    
    it('Should have getStagingRulesforBundle error block session timeout', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "viewTestResults");
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: "", Msg: "timeout"});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.getStagingRulesforBundle({rule_id: 23});
        $httpBackend.flush();
    }));
    
    it('Should have getStagingRulesforBundle error block connection refused', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "viewTestResults");
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/stage/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: "", Msg: "Connection refused"});
        
        $scope.getStagingRulesforBundle({rule_id: 23});
        $httpBackend.flush();
    }));
    
    it('Should have viewTestResults', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        var bundle = {};
        $scope.viewTestResults(bundle);
    }));
    
    it('Should have viewTestResults with API call', inject(function($rootScope, $controller, $q, GlobalService, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging, infoserverStagingSchema) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        var bundle = {
            signature: 1234,
            rule_id: 23
        };
        
        $scope.deferred = $q.defer();
        
        $scope.info.testResultsPending = true;
        
        var bundleSignature = bundle.signature;
        var cols = "";
        for(var i = 0; i < $scope.info.testGridColumnsList.length; i++) {
            cols += $scope.info.testGridColumnsList[i].field + ", ";
        }
        cols += "display_msg";
        var keyspace = infoserverStagingSchema;
        var alertsTableName = GlobalService.getVal('alerts_by_bundle_table');
        var ruleIDs = bundle.rule_id;
        var selectQuery = "SELECT " + cols + " FROM " + keyspace + "_" + alertsTableName + " where mfr='" + manufacturer + "' AND prod='" + product + "' AND sch='" + schema + "' AND ec='" + manufacturer + "' AND bundle_id='" + bundleSignature + "' AND rule_id IN (" + ruleIDs + ")";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/analytics/' + manufacturer + '/' + selectQuery).respond({Data: [], Msg: ""});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Test Rule History/View Results').respond(200);
        
        $scope.viewTestResults(bundle, [{label: 'rule1'}]);
        $httpBackend.flush();
    }));
    
    it('Should have viewTestResults with API call and draft rule', inject(function($rootScope, $controller, $q, GlobalService, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging, infoserverStagingSchema) {
        RulesService.setTestRuleData([]);
        RulesService.setRulesList([{rule_id: 12}]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        var bundle = {
            signature: 1234,
            rule_id: 23,
            prod_rule_id: "12",
            rule_modified: false
        };
        
        var data = [{
            label: 'label1',
            display_msg: 'text1'
        }, {
            label: 'label1',
            display_msg: 'text2'
        }, {
            label: 'label1',
            display_msg: 'text3'
        }, {
            label: 'label2',
            display_msg: 'text4'
        }, {
            label: 'label2',
            display_msg: 'text5'
        }, {
            label: 'label2',
            display_msg: 'text6'
        }];
        
        $scope.deferred = $q.defer();
        
        $scope.info.testResultsPending = true;
        
        var bundleSignature = bundle.signature;
        var cols = "";
        for(var i = 0; i < $scope.info.testGridColumnsList.length; i++) {
            cols += $scope.info.testGridColumnsList[i].field + ", ";
        }
        cols += "display_msg";
        var keyspace = infoserverStagingSchema;
        var alertsTableName = GlobalService.getVal('alerts_by_bundle_table');
        var ruleIDs = bundle.rule_id;
        var selectQuery = "SELECT " + cols + " FROM " + keyspace + "_" + alertsTableName + " where mfr='" + manufacturer + "' AND prod='" + product + "' AND sch='" + schema + "' AND ec='" + manufacturer + "' AND bundle_id='" + bundleSignature + "' AND rule_id IN (" + ruleIDs + ")";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/analytics/' + manufacturer + '/' + selectQuery).respond(data);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Test Rule History/View Results').respond(500);
        
        $scope.viewTestResults(bundle, [{label: 'rule1'}]);
        $httpBackend.flush();
    }));
    
    it('Should have viewTestResults with API call and draft rule modified', inject(function($rootScope, $controller, $q, GlobalService, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging, infoserverStagingSchema) {
        RulesService.setTestRuleData([]);
        RulesService.setRulesList([{rule_id: 12}]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        var bundle = {
            signature: 1234,
            rule_id: 23,
            prod_rule_id: "12",
            rule_modified: true
        };
        
        var data = [{
            label: 'label1',
            display_msg: 'text1'
        }, {
            label: 'label1',
            display_msg: 'text2'
        }, {
            label: 'label1',
            display_msg: 'text3'
        }, {
            label: 'label2',
            display_msg: 'text4'
        }, {
            label: 'label2',
            display_msg: 'text5'
        }, {
            label: 'label2',
            display_msg: 'text6'
        }];
        
        $scope.deferred = $q.defer();
        
        $scope.info.testResultsPending = true;
        
        var bundleSignature = bundle.signature;
        var cols = "";
        for(var i = 0; i < $scope.info.testGridColumnsList.length; i++) {
            cols += $scope.info.testGridColumnsList[i].field + ", ";
        }
        cols += "display_msg";
        var keyspace = infoserverStagingSchema;
        var alertsTableName = GlobalService.getVal('alerts_by_bundle_table');
        var ruleIDs = bundle.rule_id;
        var selectQuery = "SELECT " + cols + " FROM " + keyspace + "_" + alertsTableName + " where mfr='" + manufacturer + "' AND prod='" + product + "' AND sch='" + schema + "' AND ec='" + manufacturer + "' AND bundle_id='" + bundleSignature + "' AND rule_id IN (" + ruleIDs + ")";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/analytics/' + manufacturer + '/' + selectQuery).respond(data);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Test Rule History/View Results').respond(500, {Msg: 'timeout'});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');
        
        $scope.viewTestResults(bundle, [{label: 'rule1'}]);
        $httpBackend.flush();
    }));
    
    it('Should have viewTestResults with API call and data', inject(function($rootScope, $controller, GlobalService, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging, infoserverStagingSchema) {
        RulesService.setTestRuleData([{status: 'DRAFT'}]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        var data = [{
            label: 'label1',
            display_msg: 'text1'
        }, {
            label: 'label1',
            display_msg: 'text2'
        }, {
            label: 'label1',
            display_msg: 'text3'
        }, {
            label: 'label2',
            display_msg: 'text4'
        }, {
            label: 'label2',
            display_msg: 'text5'
        }, {
            label: 'label2',
            display_msg: 'text6'
        }];
        
        var bundle = {
            signature: 1234,
            rule_id: 23
        };
        
        var bundleSignature = bundle.signature;
        var cols = "";
        for(var i = 0; i < $scope.info.testGridColumnsList.length; i++) {
            cols += $scope.info.testGridColumnsList[i].field + ", ";
        }
        cols += "display_msg";
        var keyspace = infoserverStagingSchema;
        var alertsTableName = GlobalService.getVal('alerts_by_bundle_table');
        var ruleIDs = bundle.rule_id;
        var selectQuery = "SELECT " + cols + " FROM " + keyspace + "_" + alertsTableName + " where mfr='" + manufacturer + "' AND prod='" + product + "' AND sch='" + schema + "' AND ec='" + manufacturer + "' AND bundle_id='" + bundleSignature + "' AND rule_id IN (" + ruleIDs + ")";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/analytics/' + manufacturer + '/' + selectQuery).respond(data);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Test Rule History/View Results').respond(200);
        
        $scope.viewTestResults(bundle, [{label: 'label1'}]);
        $httpBackend.flush();
    }));
    
    // it('Should have viewTestResults with API call authentication fail', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // // $httpBackend.expectGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond(500);
        // $httpBackend.expectGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // // $httpBackend.expectGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond(500);
        // // $httpBackend.expectGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
//         
//         
        // // $httpBackend.whenGET(infoserverDomainStaging + '/base/columns/alerts_by_bundle/named/' + manufacturer + '/' + product + '/' + schema + '/' + manufacturer + '/' + 1234 + '?col=label&col=sname&col=pname&col=recommendation&col=display_msg').respond(500, {Data: [], Msg: ""});
//         
        // var bundle = {
            // signature: 1234,
            // rule_id: 12
        // };
        // $scope.viewTestResults(bundle);
        // $httpBackend.flush();
    // }));
    
    it('Should have viewTestResults with API call error block', inject(function($rootScope, $controller, GlobalService, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging, infoserverStagingSchema) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        var bundle = {
            signature: 1234,
            rule_id: 23
        };
        
        var bundleSignature = bundle.signature;
        var cols = "";
        for(var i = 0; i < $scope.info.testGridColumnsList.length; i++) {
            cols += $scope.info.testGridColumnsList[i].field + ", ";
        }
        cols += "display_msg";
        var keyspace = infoserverStagingSchema;
        var alertsTableName = GlobalService.getVal('alerts_by_bundle_table');
        var ruleIDs = bundle.rule_id;
        var selectQuery = "SELECT " + cols + " FROM " + keyspace + "_" + alertsTableName + " where mfr='" + manufacturer + "' AND prod='" + product + "' AND sch='" + schema + "' AND ec='" + manufacturer + "' AND bundle_id='" + bundleSignature + "' AND rule_id IN (" + ruleIDs + ")";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/analytics/' + manufacturer + '/' + selectQuery).respond(500, {Data: [], Msg: ""});
        
        $scope.viewTestResults(bundle, [{label: 'label1'}]);
        $httpBackend.flush();
    }));
    
    it('Should have viewTestResults with API call error block session timeout', inject(function($rootScope, $controller, GlobalService, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging, infoserverStagingSchema) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        var bundle = {
            signature: 1234,
            rule_id: 23
        };
        
        var bundleSignature = bundle.signature;
        var cols = "";
        for(var i = 0; i < $scope.info.testGridColumnsList.length; i++) {
            cols += $scope.info.testGridColumnsList[i].field + ", ";
        }
        cols += "display_msg";
        var keyspace = infoserverStagingSchema;
        var alertsTableName = GlobalService.getVal('alerts_by_bundle_table');
        var ruleIDs = bundle.rule_id;
        var selectQuery = "SELECT " + cols + " FROM " + keyspace + "_" + alertsTableName + " where mfr='" + manufacturer + "' AND prod='" + product + "' AND sch='" + schema + "' AND ec='" + manufacturer + "' AND bundle_id='" + bundleSignature + "' AND rule_id IN (" + ruleIDs + ")";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/analytics/' + manufacturer + '/' + selectQuery).respond(500, {Data: [], Msg: "timeout"});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.viewTestResults(bundle, [{label: 'label1'}]);
        $httpBackend.flush();
    }));
    
    it('Should have enableRule', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.enableRule();
    }));
    
    it('Should have enableRule with rule data', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.prodEnableRuleId = 12;
        $scope.info.prodEnableRuleLabel = "label1";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Test Rule History/enable').respond(200);
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(200);
        
        $scope.enableRule();
        $httpBackend.flush();
    }));
    
    it('Should have enableRule with rule data user tracking error block', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.prodEnableRuleId = 12;
        $scope.info.prodEnableRuleLabel = "label1";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Test Rule History/enable').respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(200);
        
        $scope.enableRule();
        $httpBackend.flush();
    }));
    
    it('Should have enableRule with rule data user tracking error block session timeout', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.prodEnableRuleId = 12;
        $scope.info.prodEnableRuleLabel = "label1";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(200);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Test Rule History/enable').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(200);
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableRule();
        $httpBackend.flush();
    }));
    
    it('Should have enableRule with rule data error block', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.prodEnableRuleId = 12;
        $scope.info.prodEnableRuleLabel = "label1";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(500, {});
        
        $scope.enableRule();
        $httpBackend.flush();
    }));
    
    it('Should have enableRule with rule data error block session timeout', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([{rule_name: 'rule 1', rule_id: 12, status: 'DRAFT'}]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.prodEnableRuleId = 12;
        $scope.info.prodEnableRuleLabel = "label1";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableRule();
        $httpBackend.flush();
    }));
    
    it('Should have enableRule with rule data error block connection refused', inject(function($rootScope, $controller, RulesService, $httpBackend, infoserverDomain, infoserverDomainStaging) {
        RulesService.setTestRuleData([{rule_name: 'rule 1', rule_id: 12, status: 'DRAFT'}]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.prodEnableRuleId = 12;
        $scope.info.prodEnableRuleLabel = "label1";
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        $httpBackend.expect('POST', infoserverDomain + '/rules/enable/' + manufacturer + '/' + product + '/' + schema + '/' + 12, undefined).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.enableRule();
        $httpBackend.flush();
    }));
    
    it('Should have insertSelectedRules', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.uploader = {
            queue: []
        };
        
        $scope.insertSelectedRules();
    }));
    
    it('Should have insertSelectedRules with insert operation', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomainStaging, infoserverDomain) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "beginUpload");
        spyOn($scope, "getInsertRuleData").and.returnValue({});
        
        $scope.info.uploader = {
            queue: [{file: {name: 'abc'}}],
            filters: []
        };
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond(200);
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(200);
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/insert/' + manufacturer + '/' + product + '/' + schema, {}).respond(200, {Data: [{}]});
        
        $scope.insertSelectedRules();
        $httpBackend.flush();
    }));
    
    it('Should have insertSelectedRules with insert operation else block', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomainStaging, infoserverDomain) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "beginUpload");
        spyOn($scope, "getInsertRuleData").and.returnValue({});
        
        $scope.info.uploader = {
            queue: [{file: {name: 'abc'}}],
            filters: []
        };
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond(200);
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(200);
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/insert/' + manufacturer + '/' + product + '/' + schema, {}).respond(201);
        
        $scope.insertSelectedRules();
        $httpBackend.flush();
    }));
    
    it('Should have insertSelectedRules with insert operation error block', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomainStaging, infoserverDomain) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "beginUpload");
        spyOn($scope, "getInsertRuleData").and.returnValue({});
        // spyOn($scope, "deleteStagingRules");
        
        $scope.info.uploader = {
            queue: [{file: {name: 'abc'}}],
            filters: []
        };
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond(200);
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(200);
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/insert/' + manufacturer + '/' + product + '/' + schema, {}).respond(500, {});
        
        $scope.insertSelectedRules();
        $httpBackend.flush();
    }));
    
    it('Should have insertSelectedRules with insert operation error block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomainStaging, infoserverDomain) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope, "beginUpload");
        spyOn($scope, "getInsertRuleData").and.returnValue({});
        // spyOn($scope, "deleteStagingRules");
        spyOn($scope.modal, "close");
                
        $scope.info.uploader = {
            queue: [{file: {name: 'abc'}}],
            filters: []
        };
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond(200);
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(200);
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/insert/' + manufacturer + '/' + product + '/' + schema, {}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.insertSelectedRules();
        $httpBackend.flush();
    }));
    
    it('Should have insertSelectedRules with insert operation error block connection refused', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomainStaging, infoserverDomain) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope, "beginUpload");
        spyOn($scope, "getInsertRuleData").and.returnValue({});
        // spyOn($scope, "deleteStagingRules");
        spyOn($scope.modal, "close");
                
        $scope.info.uploader = {
            queue: [{file: {name: 'abc'}}],
            filters: []
        };
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond(200);
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(200);
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/insert/' + manufacturer + '/' + product + '/' + schema, {}).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.insertSelectedRules();
        $httpBackend.flush();
    }));
    
    // it('Should have insertSelectedRules with staging auth error block', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomainStaging, infoserverDomain) {
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
        // spyOn($scope, "beginUpload");
        // spyOn($scope, "getInsertRuleData").and.returnValue({});
        // // spyOn($scope, "deleteStagingRules");
//         
        // $scope.info.uploader = {
            // queue: [{file: {name: 'abc'}}],
            // filters: []
        // };
//         
        // // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        // $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        // $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        // $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond(500, {});
//         
        // $scope.insertSelectedRules();
        // $httpBackend.flush();
    // }));
    
    it('Should have insertSelectedRules with delete operation error block', inject(function($rootScope, $controller, $httpBackend, RulesService, GlobalService, infoserverDomainStaging, infoserverDomain) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "beginUpload");
        spyOn($scope, "getInsertRuleData").and.returnValue({});
        // spyOn($scope, "deleteStagingRules");
        
        $scope.info.uploader = {
            queue: [{file: {name: 'abc'}}],
            filters: []
        };
        
        // $httpBackend.whenGET(infoserverDomainStaging + '/authenticate/undefined/http/server').respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomainStaging + '/monitor/stage/lcp/' + manufacturer + '/' + product + '/' + schema).respond({Status: "Success", Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('GET', infoserverDomainStaging + '/authenticate/undefined/http/server').respond(200);
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(500,{});
        $httpBackend.expect('POST', infoserverDomainStaging + '/rules/stage/insert/' + manufacturer + '/' + product + '/' + schema, {}).respond(500, {});
        
        $scope.insertSelectedRules();
        $httpBackend.flush();
    }));
    
    // it('Should have deleteStagingRules', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        // RulesService.setTestRuleData([]);
        // var $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        // $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(200);
//         
        // $scope.deleteStagingRules();
        // $httpBackend.flush();
//         
        // $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        // $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(500, {});
//         
        // $scope.deleteStagingRules();
        // $httpBackend.flush();
//         
        // $scope = $rootScope.$new();
        // $controller('TestRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $scope.modal = {
            // close: function() {
//                 
            // }
        // };
//         
        // spyOn($scope.modal, "close");
//         
        // $httpBackend.whenGET(infoserverDomain + '/rules/stage/bundle/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [], Msg: ""});
        // $httpBackend.whenGET(infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond({Data: {file_upload_config: {}}, Msg: ""});
        // $httpBackend.expect('POST', infoserverDomain + '/rules/stage/delete/' + manufacturer + '/' + product + '/' + schema, undefined).respond(500, {Msg: 'timeout'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
//         
        // $scope.deleteStagingRules();
        // $httpBackend.flush();
    // }));
    
    it('Should have closeDataPathModal', inject(function($rootScope, $controller, RulesService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.modal, "close");
        
        $scope.closeDataPathModal();
    }));
    
    it('Should have getValue', inject(function($rootScope, $controller, RulesService, GlobalService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        expect($scope.getValue('char_limit_msg')).toEqual(GlobalService.getVal('char_limit_msg'));
    }));
    
    it('Should have getUploadErrors', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        expect($scope.getUploadErrors()).toEqual(ErrorService.getErrors('fileupload'));
    }));
    
    it('Should have uploader extension filter', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        for(var i = 0; i < $scope.info.uploader.filters.length; i++) {
            if($scope.info.uploader.filters[i].name == 'extensionFilter') {
                $scope.info.uploader.filters[i].fn({name: 'abc.tar.gz'});
                break;
            }
        }
        
        for(var i = 0; i < $scope.info.uploader.filters.length; i++) {
            if($scope.info.uploader.filters[i].name == 'extensionFilter') {
                $scope.info.uploader.filters[i].fn({name: 'abc.zip'});
                break;
            }
        }
        
    }));
    
    it('Should have uploader onAfterAddingFile', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "checkSizeLimit");
        $scope.info.uploader.onAfterAddingFile({});
    }));
    
    it('Should have uploader onWhenAddingFileFailed', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.uploader.onWhenAddingFileFailed({}, {name: 'queueLimit'}, {});
        $scope.info.uploader.onWhenAddingFileFailed({}, {name: 'other'}, {});
    }));
    
    it('Should have uploader onErrorItem', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.uploader.onErrorItem({}, {}, {}, {});
        $scope.info.uploader.onErrorItem({}, {Msg: ""}, {}, {});
        $scope.info.uploader.onErrorItem({}, {Msg: "timeout"}, {}, {});
    }));
    
    it('Should have uploader onErrorItem modal box', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.modal, "close");
        $scope.info.uploader.onErrorItem({}, {Msg: "timeout"}, {}, {});
    }));
    
    it('Should have uploader onSuccessItem', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkfileUploadToLCPStatus");
        $scope.info.uploader.queue = [{
            file: {
                name: 'file1.tar.gz'
            }
        }];
        $scope.info.uploader.onSuccessItem({}, {Data: "928734837483:jsdhghdsgf"}, {}, {});
    }));
    
    it('Should have uploader onBeforeUploadItem', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.uploadForm = {
            key1: 'value1',
            key2: 'value2'
        };
        $scope.info.uploader.onBeforeUploadItem({formData: []});
    }));
    
    it('Should have uploader onCompleteAll', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkSizeLimit");
        
        $scope.uploadForm = {
            key1: {},
            key2: {}
        };
        
        $scope.modal = {
            close: function() {
                
            }
        };
        
        $scope.info.uploader.clearQueue = function() {
            
        };
        
        spyOn($scope.modal, "close");
        spyOn($scope.info.uploader, "clearQueue");
        
        $scope.info.uploader.queue = [{
            isSuccess: true,
            file: {
                name: 'file1'
            }
        }, {
            isCancel: true,
            file: {
                name: 'file2'
            }
        }, {
            isFailure: true,
            file: {
                name: 'file3'
            }
        }];
        $scope.info.uploader.onCompleteAll();
        
        $scope.info.uploader.queue = [{
            isCancel: true,
            file: {
                name: 'file1'
            }
        }, {
            isCancel: true,
            file: {
                name: 'file2'
            }
        }, {
            isCancel: true,
            file: {
                name: 'file3'
            }
        }];
        $scope.info.uploader.onCompleteAll();
        
        $scope.info.uploader.queue = [{
            isSuccess: true,
            file: {
                name: 'file1'
            }
        }, {
            isSuccess: true,
            file: {
                name: 'file2'
            }
        }, {
            isSuccess: true,
            file: {
                name: 'file3'
            }
        }];
        $scope.info.uploader.onCompleteAll();
        
        $scope.info.uploader.queue = [{
            isSuccess: true,
            file: {
                name: 'file1'
            }
        }, {
            isSuccess: true,
            file: {
                name: 'file2'
            }
        }, {
            isFailure: true,
            file: {
                name: 'file3'
            }
        }];
        $scope.info.uploader.onCompleteAll();
    }));
    
    it('Should have checkSizeLimit', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.uploader.queue = [{
            file: {
                size: 120
            }
        }, {
            file: {
                size: 140
            }
        }];
        
        $scope.info.uploadDataMaxSize = 200;
        $scope.checkSizeLimit();
        
        $scope.info.uploadDataMaxSize = 300;
        $scope.checkSizeLimit();
    }));
    
    it('Should have beginUpload', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "checkSizeLimit");
        spyOn($scope.info.uploader, "uploadAll");
        
        $scope.info.uploadData = [{}, {}];
        ErrorService.setError('fileupload', 'Test error');
        
        $scope.beginUpload();
        
        ErrorService.clearErrors('fileupload');
        $scope.beginUpload();
        
        $scope.uploadForm = {
            data1: {
                nodeVal: 'test'
            },
            data2: {
                nodeVal: ''
            }
        };
        
        $scope.info.uploadData = [{name: 'data1', required: true}, {name: 'data2', required: true}];
        $scope.beginUpload();
    }));
    
    it('Should have removeAll', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.info.uploader, "clearQueue");
        spyOn($scope.modal, "close");
        spyOn($scope, "hideUploadModal");
        spyOn($scope, "openUploadLogModal");
        
        $scope.removeAll();
    }));
    
    it('Should have removeFile', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.info.uploader, "clearQueue");
        spyOn($scope.modal, "close");
        spyOn($scope, "checkSizeLimit");
        spyOn($scope, "hideUploadModal");
        spyOn($scope, "openUploadLogModal");
        
        var item = {
            remove : function() {
                
            }
        };
        spyOn(item, "remove");
        $scope.removeFile(item);
        
        $scope.info.uploader.queue = [{}];
        $scope.removeFile(item);
    }));
    
    it('Should have cancelAll', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope.info.uploader, "cancelAll");
        $scope.info.uploader.queue = [{
            cancel: function() {
                
            }
        }, {
            cancel: function() {
                
            }
        }];
        
        spyOn($scope.info.uploader.queue[0], "cancel");
        spyOn($scope.info.uploader.queue[1], "cancel");
        
        $scope.cancelAll();
    }));
    
    it('Should have hideUploadModal', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.modal, "close");
        
        $scope.hideUploadModal();
    }));
    
    it('Should have closeUploadModal', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.modal = {
            close: function() {
                
            }
        };
        spyOn($scope.modal, "close");
        
        $scope.uploadForm = {
            key1: {
                nodeVal: 'val1'
            },
            key2: {
                nodeVal: 'val2'
            }
        };
        
        $scope.info.uploader.queue = [{}];
        $scope.info.uploader.clearQueue = function() {
            
        };
        
        spyOn($scope.info.uploader, "clearQueue");
        
        $scope.closeUploadModal();
        
        $scope.uploadForm = {
            key1: {},
            key2: {}
        };
        
        $scope.info.uploader.queue = [];
        
        $scope.closeUploadModal();
        
        $scope.info.uploader.isUploading = true;
        
        $scope.closeUploadModal();
    }));
    
    it('Should have abortUpload', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.modal = {
            close: function() {
                
            }
        };
        $scope.modal1 = {
            close: function() {
                
            }
        };
        spyOn($scope.modal, "close");
        spyOn($scope.modal1, "close");
        spyOn($scope, "cancelAll");
        spyOn($scope.info.uploader, "clearQueue");
        
        $scope.info.uploader.isUploading = false;
        $scope.uploadForm = {
            key1: {},
            key2: {}
        };
        
        $scope.abortUpload();
        
        $scope.info.uploader.isUploading = true;
        $scope.uploadForm = {
            key1: {},
            key2: {}
        };
        
        $scope.abortUpload();
    }));
    
    it('Should have hideAbortUpload', inject(function($rootScope, $controller, RulesService, ErrorService) {
        RulesService.setTestRuleData([]);
        var $scope = $rootScope.$new();
        $controller('TestRuleCtrl', {
            '$scope' : $scope
        });
        $scope.modal1 = {
            close: function() {
                
            }
        };
        spyOn($scope.modal1, "close");
        
        $scope.hideAbortUpload();
    }));

});

describe('AddRuleCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp.controllers.rules', 'gbApp.services', 'gbApp.services.rules', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('Should have info', inject(function($rootScope, $controller) {
	    var element = document.createElement("input");
        element.type = "hidden";
        element.id = "inputRecommendation";
        element.value = "";
        document.body.appendChild(element);
		var $scope = $rootScope.$new();
		$controller('AddRuleCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('info')).toBeTruthy();
		expect($scope.info).toEqual(jasmine.any(Object));
	}));
	
	it('Should have load APIs', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
	    var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.flush();
	}));
	
	it('Should have load APIs with table data', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
	    RulesService.setRuleMode('edit', {colt: 'table1, table2'});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getSectionData");
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.flush();
    }));
	
	it('Should have load APIs error block', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.flush();
    }));
    
    it('Should have attributes API error block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have load APIs error block connection refused', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'Connection refused'});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'Connection refused'});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'Connection refused'});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'Connection refused'});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'Connection refused'});
        // $httpBackend.whenGET('partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have category API error block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have email_template API error block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have severity API error block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have priority API error block session timeout', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [], Msg: 'timeout'});
        $httpBackend.whenGET('partials/session_timeout.html').respond('');
        $httpBackend.flush();
    }));
    
    it('Should have load APIs else block', inject(function($rootScope, $controller, RulesService) {
        spyOn(RulesService, "getAttributesLoaded").and.returnValue(true);
        spyOn(RulesService, "getSeveritiesList").and.returnValue([]);
        spyOn(RulesService, "getPrioritiesList").and.returnValue([]);
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
    }));
    
    it('Should have category API else block', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.flush();
    }));
    
    it('Should have category API error block if block', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.flush();
    }));
    
    it('Should have category API error block if block with table data', inject(function($rootScope, $controller, $httpBackend, RulesService, infoserverDomain) {
        RulesService.setRuleMode('edit', {colt: 'table1, table2'});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getSectionData");
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.flush();
    }));
	
	it('Should have populateEditRule with modified data', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        var data = {};
        var modifiedData = {};
        RulesService.setRuleMode('edit', data);
        RulesService.modifyRuleData(modifiedData);
        
        $scope.populateEditRule();
    }));
	
	it('Should have populateAddRule with modified data', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        var modifiedData = {};
        RulesService.setRuleMode('new');
        RulesService.modifyRuleData(modifiedData);
        
        $scope.populateAddRule();
    }));
    
    it('Should have getSectionData', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getSectionColumns");
        
        var tables = "table1, table2, table3";
        
        $scope.info.attributes = [{
            table_name: 'table1',
            hasData: true
        }, {
            table_name: 'table2',
            hasData: true
        }, {
            table_name: 'table3',
            hasData: true
        }];
        
        $scope.getSectionData(tables);
        
        tables = "table1";
        
        $scope.info.attributes = [{
            table_name: 'table1',
            hasData: false
        }, {
            table_name: 'table2',
            hasData: true
        }, {
            table_name: 'table3',
            hasData: true
        }];
        
        $scope.getSectionData(tables);
    }));
    
    it('Should have getSectionColumns with API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.whenGET(infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/' + 'table1').respond({Data: [{abc: {}}, {def: {}}]});
        
        var section = {expanded: true, table_name: 'table1'};
        $scope.getSectionColumns(section);
        $httpBackend.flush();
    }));
    
    it('Should have getSectionColumns with API call stop loader', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.whenGET(infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/' + 'table1').respond({Data: [{abc: {}}, {def: {}}]});
        
        $scope.info.sectionsLoaded = 2;
        var section = {expanded: true, table_name: 'table1'};
        $scope.getSectionColumns(section, 3);
        $httpBackend.flush();
    }));
    
    it('Should have getSectionColumns with API call error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.whenGET(infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/' + 'table1').respond(500, {Msg: 'Connection refused'});
        $scope.info.sectionsLoaded = 2;
        var section = {expanded: true, table_name: 'table1'};
        $scope.getSectionColumns(section, 3);
        $httpBackend.flush();
    }));
    
    it('Should have getSectionColumns with API call error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.whenGET(infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/' + 'table1').respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        var section = {expanded: true, table_name: 'table1'};
        $scope.getSectionColumns(section);
        $httpBackend.flush();
    }));
    
    it('Should have setUnsavedMode', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.setUnsavedMode();
    }));
    
    it('Should have actionChanged', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.$parent = {
            changeCurrentPage: function() {
                
            }
        };
        spyOn($scope, "setUnsavedMode");
        $scope.actionChanged();
        
        $scope.info.action = 'mail';
        RulesService.setRuleSavedStatus(true);
        $scope.actionChanged();
        
    }));
	
	it('Should have goToAddCategory', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.$parent = {
            changeCurrentPage: function() {
                
            }
        };
        spyOn($scope, "modifyRuleData");
        spyOn($scope.$parent, "changeCurrentPage");
        $scope.goToAddCategory();
        
    }));
	
	it('Should have goToManageTemplates', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.$parent = {
            changeCurrentPage: function() {
                
            }
        };
        spyOn($scope, "modifyRuleData");
        spyOn($scope.$parent, "changeCurrentPage");
        $scope.goToManageTemplates();
        
    }));
	
	it('Should have modifyRuleData', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn(RulesService, "modifyRuleData");
        $scope.modifyRuleData();
        
    }));
	
	it('Should load with edit rule mode', inject(function($rootScope, $controller, RulesService) {
	    var data = {};
	    RulesService.setRuleMode('edit', data);
	    
	    var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
	}));
	
	it('Should have clearMessage', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.categoriesLoading = true;
        $scope.clearMessage();
        
        $scope.info.categoriesLoading = false;
        $scope.clearMessage();
    }));
    
    it('Should have testRule', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.$parent = {
            changeCurrentPage: function() {
                
            }
        };
        spyOn($scope.$parent, "changeCurrentPage");
        spyOn($scope, "modifyRuleData");
        $scope.testRule();
    }));
    
    it('Should have addEditRule add operation', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/add/' + manufacturer + '/' + product + '/' + schema, {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":0,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.max_limit":"100"}).respond({Data: {rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rule/add', {"details":"","solr_query":""}).respond(200);
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule add operation else block', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        
        $scope.info.action = 'mail';
        $scope.info.emailTemplate = 12; 
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/add/' + manufacturer + '/' + product + '/' + schema, {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":12,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.max_limit":"100"}).respond({Data: {rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rule/add', {"details":"","solr_query":""}).respond(500, {});
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule add operation else block session timeout 1', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        
        $scope.info.action = 'mail';
        $scope.info.emailTemplate = 12; 
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/add/' + manufacturer + '/' + product + '/' + schema, {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":12,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.max_limit":"100"}).respond({Data: {rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rule/add', {"details":"","solr_query":""}).respond(500, {});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule add operation else block session timeout 2', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        
        $scope.info.action = 'mail';
        $scope.info.emailTemplate = 12; 
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/add/' + manufacturer + '/' + product + '/' + schema, {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":12,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.max_limit":"100"}).respond({Data: {rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rule/add', {"details":"","solr_query":""}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule add operation error block', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/add/' + manufacturer + '/' + product + '/' + schema, {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":0,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.max_limit":"100"}).respond(500, {});
        
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule add operation error block connection refused', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/add/' + manufacturer + '/' + product + '/' + schema, {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":0,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.max_limit":"100"}).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule add operation error block session timeout', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/add/' + manufacturer + '/' + product + '/' + schema, {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":0,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.max_limit":"100"}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule edit operation', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.createdTs = "2017-05-03 22:19:16";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/update/' + manufacturer + '/' + product + '/' + schema + "/1", {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":0,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.set_as_draft":1,"update.draft":0,"update.max_limit":"100","update.modify":0,"update.created_ts":"2017-05-03T22:19:16Z"}).respond({Data: {rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rule/edit', {"details":"{\"old\":null,\"new\":\"\"}","solr_query":""}).respond(200);
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        RulesService.setRuleMode('edit', {rule_id: 1});
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule edit operation else block', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.initialLabel = "";
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        $scope.info.createdTs = "2017-05-03 22:19:16";
        
        $scope.info.action = 'mail';
        $scope.info.emailTemplate = 12; 
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/update/' + manufacturer + '/' + product + '/' + schema + "/1", {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":12,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.set_as_draft":1,"update.draft":0,"update.max_limit":"100","update.modify":0,"update.created_ts":"2017-05-03T22:19:16Z"}).respond({Data: {rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rule/edit', {"details":"","solr_query":""}).respond(500, {});
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        RulesService.setRuleMode('edit', {rule_id: 1});
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule edit operation else block session timeout 1', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.initialLabel = "";
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        $scope.info.createdTs = "2017-05-03 22:19:16";
        
        $scope.info.action = 'mail';
        $scope.info.emailTemplate = 12; 
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/update/' + manufacturer + '/' + product + '/' + schema + "/1", {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":12,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.set_as_draft":1,"update.draft":0,"update.max_limit":"100","update.modify":0,"update.created_ts":"2017-05-03T22:19:16Z"}).respond({Data: {rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rule/edit', {"details":"","solr_query":""}).respond(500, {});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        RulesService.setRuleMode('edit', {rule_id: 1});
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule edit operation else block session timeout 2', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.initialLabel = "";
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        $scope.info.createdTs = "2017-05-03 22:19:16";
        
        $scope.info.action = 'mail';
        $scope.info.emailTemplate = 12; 
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/update/' + manufacturer + '/' + product + '/' + schema + "/1", {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":12,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.set_as_draft":1,"update.draft":0,"update.max_limit":"100","update.modify":0,"update.created_ts":"2017-05-03T22:19:16Z"}).respond({Data: {rule_id: 34, notifier_id: 23, rule_name: 'rule_1'}});
        $httpBackend.whenGET(infoserverDomain + '/rules/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Rules & Alerts/Rule/edit', {"details":"","solr_query":""}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        RulesService.setRuleMode('edit', {rule_id: 1});
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule edit operation error block', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        $scope.info.createdTs = "2017-05-03 22:19:16";
        
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/update/' + manufacturer + '/' + product + '/' + schema + "/1", {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":0,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.set_as_draft":1,"update.draft":0,"update.max_limit":"100","update.modify":0,"update.created_ts":"2017-05-03T22:19:16Z"}).respond(500, {});
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        RulesService.setRuleMode('edit', {rule_id: 1});
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule edit operation error block connection refused', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        $scope.info.createdTs = "2017-05-03 22:19:16";
        
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/update/' + manufacturer + '/' + product + '/' + schema + "/1", {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":0,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.set_as_draft":1,"update.draft":0,"update.max_limit":"100","update.modify":0,"update.created_ts":"2017-05-03T22:19:16Z"}).respond(500, {Msg: 'Connection refused'});
        // $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        RulesService.setRuleMode('edit', {rule_id: 1});
        $scope.addEditRule();
        $httpBackend.flush();
    }));
    
    it('Should have addEditRule edit operation error block session timeout', inject(function($rootScope, $controller, $httpBackend, $filter, RulesService, infoserverDomain) {
        RulesService.setRulesLabelMap({});
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.hiddenLogic = "";
        $scope.info.convertedLogic = "";
        $scope.info.hiddenText = "";
        $scope.info.hiddenLabel = "";
        $scope.info.secColTypePairs = ['a', 'b'];
        $scope.info.tables = ['tab1', 'tab2'];
        $scope.info.createdTs = "2017-05-03 22:19:16";
        
        $scope.info.category = 1;
        $scope.info.severity = 0;
        $scope.info.priority = 0;
        
        $httpBackend.whenGET(infoserverDomain + '/meta/sections/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/category/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/email_template/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.whenGET(infoserverDomain + '/rules/severity/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{severity_id: 0, severity: 'severity1'}]});
        $httpBackend.whenGET(infoserverDomain + '/rules/priority/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{priority_id: 0, priority: 'priority0'}]});
        
        $httpBackend.expect('POST', infoserverDomain + '/rules/update/' + manufacturer + '/' + product + '/' + schema + "/1", {"label_actual":"","update.label_display":"","description":"","category_id":1,"severity":0,"priority":0,"kb_link":"","logic_actual":"","logic_display":"","logic_condition":"","email_template_id":0,"text_actual":"","text_display":"","recommendation":"","scope":"Table","column_type":"a,b","table_name":"tab1,tab2","author":"","update.set_as_draft":1,"update.draft":0,"update.max_limit":"100","update.modify":0,"update.created_ts":"2017-05-03T22:19:16Z"}).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'partials/session_timeout.html').respond('');
        
        $scope.info.categories = [{category_id: 1, category: 'cat1'}, {category_id: 2, category: 'cat2'}];
        $scope.info.severities = [{severity_id: 0, severity: 'severity1'}];
        $scope.info.priorities = [{priority_id: 0, priority: 'priority0'}];
        
        RulesService.setRuleMode('edit', {rule_id: 1});
        $scope.addEditRule();
        $httpBackend.flush();
    }));
	
	it('Should have insertEditLink', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var selection = {};
        spyOn($window, "getSelection").and.returnValue(selection);
        $scope.insertEditLink();
    }));
    
    it('Should have insertEditLink with anchorNode edit link', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var selection = {
            anchorNode: {
                wholeText: "Hi link",
                parentElement: {
                    tagName: "A",
                    innerHtml: "abcd"
                },
                parentNode: {
                    offsetParent: {
                        className: "gb-rules-recommendation"
                    }
                }
            },
            focusNode: {
                parentElement: {
                    tagName: "DIV"
                }
            },
            extentOffset: 17,
            baseOffset: 12
        };
        spyOn($window, "getSelection").and.returnValue(selection);
        $scope.insertEditLink();
    }));
    
    it('Should have insertEditLink with anchorNode add link', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var selection = {
            anchorNode: {
                wholeText: "Hi link",
                parentElement: {
                    tagName: "DIV",
                    innerHtml: "abcd"
                },
                parentNode: {
                    offsetParent: {
                        className: "gb-rules-recommendation"
                    }
                }
            },
            focusNode: {
                parentElement: {
                    tagName: "DIV"
                }
            },
            anchorOffset: 17,
            focusOffset: 12
        };
        spyOn($window, "getSelection").and.returnValue(selection);
        $scope.insertEditLink();
    }));
    
    it('Should have insertEditLink with anchorNode add link invalid recommendation text', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var selection = {
            anchorNode: {
                wholeText: "Hi link",
                parentElement: {
                    tagName: "DIV"
                },
                parentNode: {
                    offsetParent: {
                        className: "gb-rules-recommendation",
                        innerText: "abcd./"
                    }
                }
            },
            focusNode: {
                parentElement: {
                    tagName: "DIV"
                }
            },
            anchorOffset: 17,
            focusOffset: 12
        };
        spyOn($window, "getSelection").and.returnValue(selection);
        $scope.insertEditLink();
    }));
    
    it('Should have insertEditLink with anchorNode add link error', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var selection = {
            anchorNode: {
                wholeText: "Hi link",
                parentElement: {
                    tagName: "DIV"
                },
                parentNode: {
                    offsetParent: {
                        className: "gb-rules-recommendation"
                    }
                }
            },
            focusNode: {
                parentElement: {
                    tagName: "A"
                }
            },
            extentOffset: 12,
            baseOffset: 17
        };
        spyOn($window, "getSelection").and.returnValue(selection);
        $scope.insertEditLink();
    }));
    
    it('Should have insertEditLink with anchorNode text not selected', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var selection = {
            anchorNode: {
                parentNode: {
                    offsetParent: {
                        className: "gb-rules-recommendation"
                    }
                }
            },
            extentOffset: 12,
            baseOffset: 12
        };
        spyOn($window, "getSelection").and.returnValue(selection);
        $scope.insertEditLink();
    }));
    
    it('Should have insertEditLink with anchorNode edit link for firefox', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var selection = {
            anchorNode: {
                wholeText: "Hi link",
                parentElement: {
                    tagName: "A",
                    textContent: "abcd"
                },
                parentNode: {
                    offsetParent: {
                        className: "gb-rules-recommendation"
                    }
                },
                previousElementSibling : {
                    tagName: "A",
                    textContent: "abcd",
                    title: "title"
                }
            },
            focusNode: {
                parentElement: {
                    tagName: "DIV"
                }
            },
            focusOffset: 17,
            anchorOffset: 17
        };
        spyOn($window, "getSelection").and.returnValue(selection);
        /*$window.navigator = {
            userAgent: 'firefox'
        };*/
        $scope.insertEditLink();
    }));
    
    it('Should have insertEditLink with anchorNode else block', inject(function($rootScope, $controller, $window) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var selection = {
            anchorNode: {
                parentNode: {
                    offsetParent: {
                        className: "test"
                    }
                }
            }
        };
        spyOn($window, "getSelection").and.returnValue(selection);
        $scope.insertEditLink();
    }));
    
    it('Should have checkLink', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.modal = {
            close: function() {
                
            }
        };
        
        spyOn($scope, "insertLinkConfirm");
        spyOn($scope, "editLinkConfirm");
        spyOn($scope.modal, "close");
        
        $scope.info.pageLink = "http://www.glassbeam.com";
        $scope.checkLink('insert');
        
        $scope.info.pageLink = "http://www.glassbeam.com";
        $scope.checkLink('edit');
        
        $scope.info.pageLink = "glassbeam.com";
        $scope.checkLink('insert');
    }));
	
	it('Should have insertLinkConfirm', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setUnsavedMode");
        
        $scope.info.pageLink = "http://www.glassbeam.com";
        $scope.info.htmlElement = {};
        $scope.info.innerHtml = "Recommend this for link.";
        $scope.info.wholeText = "link";
        $scope.info.startPos = 19;
        $scope.info.endPos = 23;
        $scope.info.selectedText = "link";
        $scope.insertLinkConfirm();
    }));
	
	it('Should have editLinkConfirm', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setUnsavedMode");
        
        $scope.info.pageLink = "http://www.glassbeam.com";
        $scope.info.htmlElement = {};
        $scope.editLinkConfirm();
    }));
	
	it('Should have setSectionsColumnLabelMap', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.attributes = [{"name":"syst.version","label":"show version/Hardware","table_name":"", "hasData": true,"columns":[{"size":512,"type":"s","attribute_label":"Hardware Info","column_name":"hardware_info"},{"size":128,"type":"s","attribute_label":"Switch Model","column_name":"switch_model"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"triiage","label":"TRiiAGE Analysis Report","table_name":"array_dconf", "hasData": true,"columns":[{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":512,"type":"s","attribute_label":"Triiage Data","column_name":"triiage_data"}]},{"name":"eulanm","label":"Eula Log Data","table_name":"eula","columns":[{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"State","column_name":"evt_state"}]},{"name":"triiage.spboot_history","label":"SP BOOT HISTORY INFORMATION","table_name":"spboot","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"Reboots from Power Outage","column_name":"spboot_pwroutage"},{"size":64,"type":"i","attribute_label":"SW/User Initiate Reboot/Shutdown","column_name":"spboot_swuser"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"Reboots from Bugcheck","column_name":"spboot_bugcheck"},{"size":64,"type":"i","attribute_label":"Unexplained Reboots","column_name":"spboot_enexpected"},{"size":64,"type":"i","attribute_label":"Total Reboots","column_name":"spboot_total"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"}]},{"name":"syst.svsconnection","label":"SVS Connection","table_name":"svsconnection","columns":[{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":5120,"type":"s","attribute_label":"SVS Connection","column_name":"svsconnection"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"}]},{"name":"syst.zoneset","label":"show zoneset pending vsan","table_name":"zoneset","columns":[{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":256,"type":"s","attribute_label":"Setting","column_name":"zoneset_setting"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"}]},{"name":"syst.interfacebrief","label":"show interface brief","table_name":"interfacebrief","columns":[{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"s","attribute_label":"Type","column_name":"type"},{"size":64,"type":"s","attribute_label":"Port/Protocol","column_name":"prt"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"Mode","column_name":"mode"},{"size":128,"type":"s","attribute_label":"Interface","column_name":"interface"},{"size":64,"type":"s","attribute_label":"Speed","column_name":"speed"},{"size":64,"type":"s","attribute_label":"Reason","column_name":"reason"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"VLAN","column_name":"vlan"},{"size":64,"type":"s","attribute_label":"Status","column_name":"status"}]},{"name":"syst.vlan_compr_grp","label":"VLAN Compression groups","table_name":"vlan_compgrp","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"VLAN Compression groups","column_name":"vlan_compgrp_str"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"triiage.faultsummary","label":"Fault summary","table_name":"fault_summary","columns":[{"size":128,"type":"s","attribute_label":"FRU","column_name":"ft_summ_fru"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"SPA","column_name":"ft_summ_spa"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"SPB","column_name":"ft_summ_spb"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"vmkernel","label":"VMKernel Events","table_name":"vmkernel","columns":[{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"}]},{"name":"triiage.sg","label":"STORAGE GROUP and INITIATOR INFORMATION","table_name":"sg_table","columns":[{"size":128,"type":"s","attribute_label":"Failover Mode","column_name":"sgfail_mode"},{"size":102400,"type":"s","attribute_label":"Storage Group and Initiator data","column_name":"sgtable_data"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":512,"type":"s","attribute_label":"SG Name/Host Name","column_name":"sghost_name"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":512,"type":"s","attribute_label":"ALU","column_name":"sg_alu"},{"size":512,"type":"s","attribute_label":"HLU","column_name":"sg_hlu"},{"size":128,"type":"s","attribute_label":"Port","column_name":"sg_port"},{"size":256,"type":"s","attribute_label":"Log/Reg","column_name":"sglog_reg"},{"size":256,"type":"s","attribute_label":"Path Count","column_name":"sgpath_cnt"},{"size":128,"type":"s","attribute_label":"IP","column_name":"sg_ip"},{"size":102400,"type":"s","attribute_label":"","column_name":"sgtable_2data"},{"size":128,"type":"s","attribute_label":"Adapter","column_name":"sg_adapter"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":512,"type":"s","attribute_label":"Host Name","column_name":"sg_hostname"},{"size":64,"type":"s","attribute_label":"Severity","column_name":"sgwarning_sev"},{"size":512,"type":"s","attribute_label":"TR Count","column_name":"sg_trcount"}]},{"name":"triiage.issuessummay","label":"ARRAY ISSUES SUMMARY INFORMATION","table_name":"array_issues","columns":[{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"Result","column_name":"issues_result"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":512,"type":"s","attribute_label":"Action","column_name":"issues_action"},{"size":128,"type":"s","attribute_label":"Test","column_name":"issues_test"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"i","attribute_label":"Severity","column_name":"issues_sev"}]},{"name":"triagesp","label":"TRiiAGE SP","table_name":"triagesp","columns":[{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"}]},{"name":"localcli_software_vib_list","label":"Localcli Software Vib List","table_name":"localcli_software_vib_list_tb","columns":[{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":256,"type":"s","attribute_label":"Acceptance Level","column_name":"acceptance_lvl"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"s","attribute_label":"System Time","column_name":"obs_date_str"},{"size":128,"type":"s","attribute_label":"Vendor","column_name":"vendor"},{"size":128,"type":"s","attribute_label":"Install Date","column_name":"install_date"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Name","column_name":"name"},{"size":128,"type":"s","attribute_label":"Version","column_name":"version"}]},{"name":"syst.liceusage","label":"Show licence usage","table_name":"license_usage","columns":[{"size":64,"type":"s","attribute_label":"Lic Count","column_name":"lu_count"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"s","attribute_label":"Expiry Date","column_name":"lu_edate"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"s","attribute_label":"Ins","column_name":"lu_ins"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"Comments","column_name":"lu_comment"},{"size":64,"type":"s","attribute_label":"Status","column_name":"lu_status"},{"size":512,"type":"s","attribute_label":"Feature","column_name":"lu_feature"},{"size":64,"type":"i","attribute_label":"","column_name":"lu_epoch"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"syst.inter_pri_flow_ctrl","label":"Interface Priority-Flow-Control","table_name":"inter_pri_flow_ctrl_tb","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"i","attribute_label":"TxPPP","column_name":"txppp"},{"size":128,"type":"s","attribute_label":"VL bmap","column_name":"vl_bmap"},{"size":128,"type":"s","attribute_label":"Mode Oper","column_name":"mode_oper"},{"size":256,"type":"s","attribute_label":"Interface Name","column_name":"interface_nm"},{"size":64,"type":"i","attribute_label":"RxPPP","column_name":"rxppp"},{"size":64,"type":"s","attribute_label":"System Time","column_name":"obs_date_str"}]},{"name":"syst.spromall.powersupply_sprom","label":"DISPLAY power-supply sprom","table_name":"sprom_powersupply","columns":[{"size":128,"type":"s","attribute_label":"FRU Minor Type","column_name":"fru_minor_type"},{"size":128,"type":"s","attribute_label":"Block Checksum","column_name":"block_checksum"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Mfg Deviation","column_name":"mfg_deviation"},{"size":128,"type":"s","attribute_label":"Block Signature","column_name":"block_signature"},{"size":128,"type":"s","attribute_label":"FRU Major Type","column_name":"fru_major_type"},{"size":128,"type":"s","attribute_label":"Part Number","column_name":"part_number"},{"size":128,"type":"s","attribute_label":"snmpOID","column_name":"snmpoid"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"OEM String","column_name":"ome_string"},{"size":128,"type":"s","attribute_label":"Engineer Use","column_name":"engineer_use"},{"size":128,"type":"s","attribute_label":"EEPROM Size","column_name":"eeprom_size"},{"size":128,"type":"s","attribute_label":"CLEI Code","column_name":"clei_code"},{"size":128,"type":"s","attribute_label":"Part Revision","column_name":"part_revision"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"VID","column_name":"vid"},{"size":128,"type":"s","attribute_label":"Block Length","column_name":"block_lenth"},{"size":128,"type":"s","attribute_label":"Product Number","column_name":"product_number"},{"size":128,"type":"s","attribute_label":"RMA Code","column_name":"rma_code"},{"size":128,"type":"s","attribute_label":"H/W Version","column_name":"hw_version"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":64,"type":"s","attribute_label":"System Time","column_name":"obs_date_str"},{"size":128,"type":"s","attribute_label":"Mfg Bits","column_name":"mfg_bits"},{"size":128,"type":"s","attribute_label":"Block Count","column_name":"block_count"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Block Version","column_name":"block_version"},{"size":128,"type":"s","attribute_label":"Power Consump","column_name":"power_conump"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"serial_number"}]},{"name":"syst.chasinvexo.server","label":"Show chassis inventory expand Server Info","table_name":"chasinvexp_server","columns":[{"size":128,"type":"s","attribute_label":"Equipped PID","column_name":"equip_pid"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Acknowledged Serial (SN)","column_name":"ack_serial_sn"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":128,"type":"s","attribute_label":"Acknowledged Cores","column_name":"ack_cores"},{"size":128,"type":"s","attribute_label":"Acknowledged Effective Memory (MB)","column_name":"ack_eff_mem"},{"size":128,"type":"s","attribute_label":"Acknowledged PID","column_name":"ack_pid"},{"size":128,"type":"s","attribute_label":"Slot Status","column_name":"solt_status"},{"size":128,"type":"s","attribute_label":"Equipped VID","column_name":"equip_vid"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Equipped Serial (SN)","column_name":"equip_ser_num"},{"size":128,"type":"s","attribute_label":"Acknowledged Product Name","column_name":"ack_prod_name"},{"size":128,"type":"s","attribute_label":"Acknowledged Memory (MB)","column_name":"ack_mem_mb"},{"size":128,"type":"s","attribute_label":"Equipped Product Name","column_name":"equip_prod_name"},{"size":64,"type":"s","attribute_label":"System Time","column_name":"obs_date_str"},{"size":128,"type":"s","attribute_label":"Acknowledged Adapters","column_name":"ack_adap"}]},{"name":"triiage.array.spconf","label":"SP Configuration","table_name":"array_spconf","columns":[{"size":64,"type":"i","attribute_label":"","column_name":"spconf_sparcachesize"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spasysdiskfree"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spatime"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spauptime"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spaagentrevi"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbsysfault"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbwcavailable"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spaspsign"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spbdisk"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbipaddress"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spawcachestate"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spaepoch"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spawcavailable"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spaserialnum"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbswrevision"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbpromrevi"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spbmemory"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spbwcachesize"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbspsign"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spaipaddress"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spacpagesize"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spadisk"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spamemory"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spaswrevision"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spaenclosures"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spbrcachesize"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_sparcachestate"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbuptime"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbwcachestate"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spawcachesize"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spbcpagesize"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbrcachestate"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbserialnum"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbsysdiskfree"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spbepoch"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbtime"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spbagentrevi"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spasysfault"},{"size":64,"type":"s","attribute_label":"","column_name":"spconf_spapromrevi"},{"size":64,"type":"i","attribute_label":"","column_name":"spconf_spbenclosures"}]},{"name":"vemlog","label":"vemlog show all","table_name":"vemlog","columns":[{"size":64,"type":"i","attribute_label":"Mod","column_name":"evt_mod"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":64,"type":"i","attribute_label":"Entry","column_name":"evt_entry"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":64,"type":"i","attribute_label":"Lv","column_name":"evt_lv"},{"size":64,"type":"i","attribute_label":"CPU","column_name":"evt_cpu"},{"size":64,"type":"s","attribute_label":"VEM Version","column_name":"evt_vemversion"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"},{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"}]},{"name":"ciscovem.vemcmd_port","label":"vemcmd show port","table_name":"vemcmd_port","columns":[{"size":64,"type":"i","attribute_label":"PC-LTL","column_name":"vemcmd_pcltl"},{"size":64,"type":"s","attribute_label":"VSM Port","column_name":"vemcmd_vsm"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"i","attribute_label":"SGID","column_name":"vemcmd_sgid"},{"size":64,"type":"s","attribute_label":"Type","column_name":"vemcmd_type"},{"size":64,"type":"s","attribute_label":"State","column_name":"vemcmd_state"},{"size":64,"type":"s","attribute_label":"Vem Port","column_name":"vemcmd_vemport"},{"size":64,"type":"s","attribute_label":"Link","column_name":"vemcmd_link"},{"size":64,"type":"i","attribute_label":"LTL","column_name":"vemcmd_ltl"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"s","attribute_label":"Admin","column_name":"vemcmd_admin"}]},{"name":"syst.zonesetactive","label":"show zoneset active","table_name":"zonesetactive","columns":[{"size":256,"type":"s","attribute_label":"Active Zoneset","column_name":"active_zoneset"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"syst.logginglog","label":"show logging log","table_name":"logging_log","columns":[{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":128,"type":"s","attribute_label":"Module","column_name":"evt_module"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":128,"type":"s","attribute_label":"Label","column_name":"evt_label"},{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"},{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"}]},{"name":"syst.version","label":"show version","table_name":"syst_version","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":512,"type":"s","attribute_label":"Version Info","column_name":"version_info"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"cimc_sensors","label":"CIMC Sensors","table_name":"cimc_sen","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"s","attribute_label":"Lower Non Recoverable Threshold","column_name":"cimcsen_lnr"},{"size":64,"type":"s","attribute_label":"Lower Critical Threshold","column_name":"cimcsen_lc"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"s","attribute_label":"Reading","column_name":"cimcsen_read"},{"size":64,"type":"s","attribute_label":"Upper Non Recoverable Threshold","column_name":"cimcsen_unr"},{"size":64,"type":"s","attribute_label":"Upper Critical Threshold","column_name":"cimcsen_uc"},{"size":64,"type":"s","attribute_label":"Upper Non Critical Threshold","column_name":"cimcsen_unc"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"s","attribute_label":"Sensor Name","column_name":"cimcsen_name"},{"size":64,"type":"s","attribute_label":"Unit","column_name":"cimcsen_unit"},{"size":64,"type":"s","attribute_label":"Lower Non Critical Threshold","column_name":"cimcsen_lnc"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"Status","column_name":"cimcsen_stat"}]},{"name":"syst.version","label":"show version/Software","table_name":"syst_version_soft","columns":[{"size":128,"type":"s","attribute_label":"loader","column_name":"loader"},{"size":128,"type":"s","attribute_label":"kickstart compile time","column_name":"kickstart_compile_time"},{"size":128,"type":"s","attribute_label":"BIOS","column_name":"bios"},{"size":128,"type":"s","attribute_label":"BIOS compile time","column_name":"bios_compile_time"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"system image file is","column_name":"system_image_file_is"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"kickstart","column_name":"kickstart"},{"size":128,"type":"s","attribute_label":"system","column_name":"system_version"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"kickstart image file is","column_name":"kickstart_image_file_is"},{"size":128,"type":"s","attribute_label":"system compile time","column_name":"system_compile_time"}]},{"name":"triiage.array","label":"ARRAY CONFIGURATION INFORMATION","table_name":"array_conf","columns":[{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Key","column_name":"arrayconf_key"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Value","column_name":"arrayconf_value"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"unparsed","label":"Unparsed Data","table_name":"unparsed","columns":[{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_size"},{"size":20,"type":"s","attribute_label":"","column_name":"type"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"","column_name":"namespace"},{"size":128,"type":"s","attribute_label":"Component","column_name":"component"},{"size":128,"type":"s","attribute_label":"user","column_name":"uploaded_by"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"begin_offset"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"System Time","column_name":"obs_date_str"},{"size":1024,"type":"s","attribute_label":"","column_name":"filename"},{"size":1024,"type":"s","attribute_label":"","column_name":"namespace_id"},{"size":4096,"type":"s","attribute_label":"Unparsed","column_name":"content"}]},{"name":"vpxa","label":"VPXA Events","table_name":"vpxa","columns":[{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":256,"type":"s","attribute_label":"Event Source","column_name":"evt_source"},{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"}]},{"name":"cmc_rele","label":"IOCard Release Info","table_name":"cmc_version","columns":[{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"s","attribute_label":"CMC Kernel version","column_name":"kernel_version"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"CMC Version","column_name":"version"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"}]},{"name":"syst.shwhardware","label":"PowerSupply Slots","table_name":"powersupply","columns":[{"size":128,"type":"s","attribute_label":"Part Number","column_name":"ps_partnumber"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":2048,"type":"s","attribute_label":"","column_name":"ps_data"},{"size":128,"type":"s","attribute_label":"CLEI code","column_name":"ps_cleicode"},{"size":128,"type":"s","attribute_label":"Part Revision","column_name":"ps_partrevision"},{"size":128,"type":"s","attribute_label":"Serial number","column_name":"ps_sernum"},{"size":128,"type":"s","attribute_label":"H/W version","column_name":"ps_hwversion"},{"size":128,"type":"s","attribute_label":"Model number","column_name":"ps_modelnumber"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"PS Status","column_name":"ps_status"},{"size":128,"type":"s","attribute_label":"PS Slot","column_name":"ps_name"},{"size":128,"type":"s","attribute_label":"Manufacture Date","column_name":"ps_mfrdate"},{"size":128,"type":"s","attribute_label":"Power supply type","column_name":"ps_type"}]},{"name":"syst.moduleintern","label":"internal exceptionlog instance","table_name":"moduleintern","columns":[{"size":64,"type":"i","attribute_label":"Device Id","column_name":"device_idn"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Dev Type (HW/SW)","column_name":"dev_type"},{"size":128,"type":"s","attribute_label":"Error Description","column_name":"error_description"},{"size":64,"type":"i","attribute_label":"Module Slot Number","column_name":"mod_slot_num"},{"size":128,"type":"s","attribute_label":"Device Errorcode","column_name":"device_errorcode"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"DSAP","column_name":"dsap"},{"size":128,"type":"s","attribute_label":"Device ID","column_name":"device_id"},{"size":128,"type":"s","attribute_label":"Device Instance","column_name":"device_instance"},{"size":128,"type":"s","attribute_label":"Port(s) Affected","column_name":"port_ffected"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"PhyPortLayer","column_name":"phyportlayer"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"ErrNum (devInfo)","column_name":"errnum"},{"size":256,"type":"s","attribute_label":"Time","column_name":"time"},{"size":128,"type":"s","attribute_label":"System Errorcode","column_name":"system_errorcode"},{"size":128,"type":"s","attribute_label":"UUID","column_name":"uuid"},{"size":128,"type":"s","attribute_label":"exception instance","column_name":"exception_instance"},{"size":128,"type":"s","attribute_label":"Device Name","column_name":"device_name"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Error Type","column_name":"error_type"}]},{"name":"verlogmessages","label":"Var Log Messages","table_name":"verlogmessages","columns":[{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"sam_tech.fault.sev","label":"UCSM Show fault detail","table_name":"fault","columns":[{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"},{"size":128,"type":"s","attribute_label":"Affected Object","column_name":"fault_aobj"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Creation Time","column_name":"fault_date_str_tmp"},{"size":128,"type":"s","attribute_label":"Original Severity","column_name":"fault_osev"},{"size":128,"type":"s","attribute_label":"Cause","column_name":"fault_cause"},{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":128,"type":"s","attribute_label":"Type","column_name":"fault_type"},{"size":128,"type":"s","attribute_label":"Status","column_name":"fault_status"},{"size":128,"type":"s","attribute_label":"Creation Time","column_name":"fault_date_str"},{"size":128,"type":"s","attribute_label":"Occurrences","column_name":"fault_occu"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"},{"size":2048,"type":"s","attribute_label":"Description","column_name":"fault_desc"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Previous Severity","column_name":"fault_psev"},{"size":128,"type":"s","attribute_label":"Name","column_name":"fault_name"},{"size":128,"type":"s","attribute_label":"Last Transition Time","column_name":"fault_lst"},{"size":128,"type":"s","attribute_label":"Highest Severity","column_name":"fault_hsev"},{"size":128,"type":"s","attribute_label":"Acknowledged","column_name":"fault_ack"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":128,"type":"s","attribute_label":"Code","column_name":"fault_code"},{"size":128,"type":"s","attribute_label":"ID","column_name":"fault_id"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":128,"type":"s","attribute_label":"Severity","column_name":"fault_severity"}]},{"name":"iclog","label":"I2C Segment","table_name":"i2clog_tbl","columns":[{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"s","attribute_label":"Key","column_name":"i2clog_paramete"},{"size":64,"type":"s","attribute_label":"Segment","column_name":"i2clog_seg"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"Value","column_name":"i2clog_value"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"}]},{"name":"syst.inventory","label":"show inventory","table_name":"inventory","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Description","column_name":"inventory_desc"},{"size":128,"type":"s","attribute_label":"VID","column_name":"inventory_vid"},{"size":128,"type":"s","attribute_label":"PID","column_name":"inventory_pid"},{"size":128,"type":"s","attribute_label":"Module Number","column_name":"module_number"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"inventory_srn"},{"size":1024,"type":"s","attribute_label":"Name","column_name":"inventory_name"}]},{"name":"syst.lhostid","label":"how license host-id","table_name":"lhostid","columns":[{"size":128,"type":"s","attribute_label":"License hostid","column_name":"lic_host_id"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"}]},{"name":"vmware_version","label":"VMWare version","table_name":"vm_version","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"s","attribute_label":"VMware ESXi","column_name":"vmversion_esxi"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"Build","column_name":"vmversion_build"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"}]},{"name":"triiage.sg","label":"STORAGE GROUP and INITIATOR INFORMATION","table_name":"sg_warning","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"s","attribute_label":"*","column_name":"sgwarning_star"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"**","column_name":"sgwarning_dstar"},{"size":64,"type":"s","attribute_label":"Severity","column_name":"sgwarning_sev"},{"size":64,"type":"s","attribute_label":"L","column_name":"sgwarning_t"},{"size":64,"type":"s","attribute_label":"D","column_name":"sgwarning_d"}]},{"name":"triiage.iomodule","label":"I/O Module Status","table_name":"iomodule","columns":[{"size":64,"type":"s","attribute_label":"SPB SubStat","column_name":"iomod_spbsub"},{"size":64,"type":"s","attribute_label":"SPA Power","column_name":"iomod_spapwr"},{"size":64,"type":"s","attribute_label":"SPB Carrier","column_name":"iomod_spbcarri"},{"size":64,"type":"s","attribute_label":"SPB Type","column_name":"iomod_spbtype"},{"size":64,"type":"s","attribute_label":"Mod","column_name":"iomod_mod"},{"size":64,"type":"s","attribute_label":"SPB Power","column_name":"iomod_spbpwr"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"s","attribute_label":"SPA Carrier","column_name":"iomod_spacarri"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"s","attribute_label":"SPB State","column_name":"iomod_spbstate"},{"size":64,"type":"s","attribute_label":"SPA State","column_name":"iomod_spastate"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"s","attribute_label":"SPA SubStat","column_name":"iomod_spasub"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"s","attribute_label":"SPA Type","column_name":"iomod_spatype"}]},{"name":"localcli_vm_process_list","label":"Localcli VM Process List","table_name":"localcli_vm_process_list_tb","columns":[{"size":256,"type":"s","attribute_label":"UUID","column_name":"uuid"},{"size":64,"type":"s","attribute_label":"System Time","column_name":"obs_date_str"},{"size":64,"type":"i","attribute_label":"Process ID","column_name":"process_id"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Process Name","column_name":"process_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":256,"type":"s","attribute_label":"Config File","column_name":"config_file"},{"size":64,"type":"i","attribute_label":"World ID","column_name":"world_id"},{"size":64,"type":"i","attribute_label":"VMX Cartel ID","column_name":"vmx_cartel_id"},{"size":128,"type":"s","attribute_label":"Display Name","column_name":"display_name"}]},{"name":"syst.shstartupconf","label":"show startup-config","table_name":"shstartupconf","columns":[{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":256,"type":"s","attribute_label":"Svs Switch Edition Essential","column_name":"svs_switch"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"}]},{"name":"identity_info","label":"Identity Info","table_name":"identity_info","columns":[{"size":64,"type":"s","attribute_label":"Virtual HostName","column_name":"identity_vhost"},{"size":64,"type":"s","attribute_label":"CSN","column_name":"identity_csn"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"s","attribute_label":"TFTP Core Dir","column_name":"identity_tftp"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"}]},{"name":"syst.interface","label":"show interface","table_name":"show_interface","columns":[{"size":64,"type":"i","attribute_label":"Input Errors","column_name":"input_errors"},{"size":64,"type":"i","attribute_label":"Input too short","column_name":"input_tshort"},{"size":64,"type":"i","attribute_label":"Input too long","column_name":"input_tlong"},{"size":64,"type":"i","attribute_label":"Output CRC","column_name":"output_crc"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"i","attribute_label":"Input Frames","column_name":"input_frame"},{"size":512,"type":"s","attribute_label":"","column_name":"output_temp"},{"size":512,"type":"s","attribute_label":"","column_name":"input_temp"},{"size":64,"type":"i","attribute_label":"Input Bytes","column_name":"input_byte"},{"size":64,"type":"s","attribute_label":"Interface","column_name":"interface"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"","column_name":"interface_temp"},{"size":3024,"type":"s","attribute_label":"Temp interface","column_name":"temp_line"},{"size":64,"type":"i","attribute_label":"Output too short","column_name":"output_tshort"},{"size":64,"type":"i","attribute_label":"Output too long","column_name":"output_tlong"},{"size":64,"type":"i","attribute_label":"Input Unknown Class","column_name":"input_uclass"},{"size":128,"type":"s","attribute_label":"Status","column_name":"int_status"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"i","attribute_label":"Output Discards","column_name":"output_discards"},{"size":64,"type":"i","attribute_label":"Output Bytes","column_name":"output_byte"},{"size":64,"type":"i","attribute_label":"Output Frames","column_name":"output_frame"},{"size":64,"type":"i","attribute_label":"Input CRC","column_name":"input_crc"},{"size":64,"type":"i","attribute_label":"Output Errors","column_name":"output_errors"},{"size":64,"type":"i","attribute_label":"Input Discards","column_name":"input_discards"},{"size":64,"type":"i","attribute_label":"Output Unknown Class","column_name":"output_uclass"}]},{"name":"syst.switchnm","label":"show switchname","table_name":"syst_switch","columns":[{"size":128,"type":"s","attribute_label":"Switch Name","column_name":"switch_name"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"}]},{"name":"syst.sprombkone","label":"show sprom backplane 1","table_name":"syst_sprom","columns":[{"size":128,"type":"s","attribute_label":"Engineer Use","column_name":"sprom_eng_use"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"H/W Version","column_name":"sprom_hw_version"},{"size":128,"type":"s","attribute_label":"FRU Minor Type","column_name":"sprom_fru_minnor_type"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Part Revision","column_name":"sprom_part_revison"},{"size":128,"type":"s","attribute_label":"RMA Code","column_name":"sprom_rma_code"},{"size":128,"type":"s","attribute_label":"Block Checksum","column_name":"sprom_block_chksum"},{"size":128,"type":"s","attribute_label":"Block Signature","column_name":"sprom_block_sig"},{"size":128,"type":"s","attribute_label":"CLEI Code","column_name":"sprom_clei_code"},{"size":128,"type":"s","attribute_label":"VID","column_name":"sprom_vid"},{"size":128,"type":"s","attribute_label":"Switch Serial Number","column_name":"sprom_ser_number"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Block Count","column_name":"sprom_block_count"},{"size":128,"type":"s","attribute_label":"Block Version","column_name":"sprom_block_ver"},{"size":128,"type":"s","attribute_label":"Power Consump","column_name":"sprom_pwd_con"},{"size":128,"type":"s","attribute_label":"Part Number","column_name":"sprom_part_num"},{"size":128,"type":"s","attribute_label":"OEM String","column_name":"sprom_ome_string"},{"size":128,"type":"s","attribute_label":"Mfg Deviation","column_name":"sprom_mfr_ddev"},{"size":128,"type":"s","attribute_label":"Block Length","column_name":"sprom_block_len"},{"size":128,"type":"s","attribute_label":"snmpOID","column_name":"sprom_snmp_oid"},{"size":128,"type":"s","attribute_label":"EEPROM Size","column_name":"sprom_eeprom_size"},{"size":128,"type":"s","attribute_label":"FRU Major Type","column_name":"sprom_fru_maj_type"},{"size":128,"type":"s","attribute_label":"Product Number","column_name":"sprom_prd_num"},{"size":128,"type":"s","attribute_label":"Mfg Bits","column_name":"sprom_mfr_bits"}]},{"name":"uname_hostname","label":"VMWare Hostname","table_name":"vm_hostname","columns":[{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"s","attribute_label":"VMware ESXi","column_name":"vmware_hostname"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"}]},{"name":"syst.process_mem","label":"Show process memory","table_name":"process_mem","columns":[{"size":64,"type":"s","attribute_label":"System Time","column_name":"obs_date_str"},{"size":64,"type":"i","attribute_label":"StkSize","column_name":"stksize"},{"size":128,"type":"s","attribute_label":"StackBase/Ptr","column_name":"stackbase_ptr"},{"size":128,"type":"s","attribute_label":"Process","column_name":"pprocess"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"LibMem","column_name":"libmem"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"PID","column_name":"processs_pid"},{"size":64,"type":"i","attribute_label":"MemAlloc","column_name":"memalloc"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":64,"type":"i","attribute_label":"RSSMem","column_name":"rssmem"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"}]},{"name":"hostd","label":"Hostd Events","table_name":"hostd","columns":[{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":256,"type":"s","attribute_label":"Event Source","column_name":"evt_source"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"}]},{"name":"syst.module","label":"show module","table_name":"syst_module","columns":[{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"","column_name":"module_model"},{"size":128,"type":"s","attribute_label":"","column_name":"module_mtype"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"i","attribute_label":"","column_name":"module_ports"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"","column_name":"module_status"},{"size":64,"type":"i","attribute_label":"","column_name":"module_mod"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"}]},{"name":"iocard_top","label":"IOCard top","table_name":"iocard_top","columns":[{"size":64,"type":"s","attribute_label":"USER","column_name":"top_user"},{"size":256,"type":"s","attribute_label":"COMMAND","column_name":"top_comd"},{"size":64,"type":"s","attribute_label":"State","column_name":"top_stat"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":64,"type":"s","attribute_label":"VSZ","column_name":"top_vsz"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"PPID","column_name":"top_ppid"},{"size":64,"type":"i","attribute_label":"PID","column_name":"top_pid"},{"size":64,"type":"i","attribute_label":"CPU","column_name":"top_cpu"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":64,"type":"i","attribute_label":"Memory","column_name":"top_mem"}]},{"name":"syst.sys_redundancy","label":"This supervisor (sup-1)","table_name":"sys_sup_this","columns":[{"size":128,"type":"s","attribute_label":"Internal state","column_name":"sup_istate"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Redundancy state","column_name":"sup_rstate"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Supervisor state","column_name":"sup_sstate"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"}]},{"name":"cimc_var_log","label":"CIMC var logs","table_name":"cimc_varlog_event","columns":[{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"Source","column_name":"cmc_source"},{"size":64,"type":"i","attribute_label":"","column_name":"evt_epoch"},{"size":2048,"type":"s","attribute_label":"Event Text","column_name":"evt_text"},{"size":128,"type":"s","attribute_label":"Event Label","column_name":"evt_label"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":128,"type":"s","attribute_label":"Event Severity","column_name":"severity"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"State","column_name":"evt_state"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"},{"size":128,"type":"s","attribute_label":"Event Date","column_name":"evt_date_str"},{"size":64,"type":"i","attribute_label":"","column_name":"obs_epoch"}]},{"name":"syst.module","label":"show module","table_name":"syst_module_pwr","columns":[{"size":64,"type":"i","attribute_label":"","column_name":"obs_ts"},{"size":64,"type":"i","attribute_label":"","column_name":"modulepwr_mod"},{"size":1024,"type":"s","attribute_label":"Bundle URL","column_name":"obs_url"},{"size":128,"type":"s","attribute_label":"Customer Name","column_name":"cust_name"},{"size":128,"type":"s","attribute_label":"","column_name":"modulepwr_reason"},{"size":128,"type":"s","attribute_label":"","column_name":"modulepwr_status"},{"size":128,"type":"s","attribute_label":"Ticket Number","column_name":"ticket_number"},{"size":128,"type":"s","attribute_label":"Serial Number","column_name":"sysid"}]}];
        $scope.setSectionsColumnLabelMap();
    }));
	
	it('Should have submitRule', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateElements").and.returnValue(false);
        $scope.submitRule();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateElements").and.returnValue(true);
        spyOn($scope, "validateLogicMap").and.returnValue(false);
        $scope.submitRule();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateElements").and.returnValue(true);
        spyOn($scope, "validateLogicMap").and.returnValue([]);
        spyOn($scope, "validateTextMap").and.returnValue(false);
        $scope.submitRule();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateElements").and.returnValue(true);
        spyOn($scope, "validateLogicMap").and.returnValue([]);
        spyOn($scope, "validateTextMap").and.returnValue([]);
        spyOn($scope, "validateLogicGrammar").and.returnValue(false);
        $scope.submitRule();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.convertedAttributes = [{}, {}];
        spyOn($scope, "validateElements").and.returnValue(true);
        spyOn($scope, "validateLogicMap").and.returnValue([]);
        spyOn($scope, "validateTextMap").and.returnValue([]);
        spyOn($scope, "validateLogicGrammar").and.returnValue(false);
        spyOn($scope, "changeColumnType");
        $scope.submitRule();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "validateElements").and.returnValue(true);
        spyOn($scope, "validateLogicMap").and.returnValue([]);
        spyOn($scope, "validateTextMap").and.returnValue([]);
        spyOn($scope, "validateLogicGrammar").and.returnValue(true);
        spyOn($scope, "createColumnType");
        spyOn($scope, "checkMultipleTable").and.returnValue(false);
        $scope.submitRule();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.tables = [];
        
        spyOn($scope, "validateElements").and.returnValue(true);
        spyOn($scope, "validateLogicMap").and.returnValue([]);
        spyOn($scope, "validateTextMap").and.returnValue([]);
        spyOn($scope, "validateLogicGrammar").and.returnValue(true);
        spyOn($scope, "createColumnType");
        spyOn($scope, "checkMultipleTable").and.returnValue(true);
        spyOn($scope, "convertScalaCondition");
        spyOn($scope, "setHiddenLogic");
        spyOn($scope, "setHiddenText");
        spyOn($scope, "addEditRule");
        $scope.submitRule();
    }));
	
	it('Should have renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        
        $scope.renderHtml('abcd<strong>df</strong>');
    }));
	
	it('Should have addNewRule', inject(function($rootScope, $controller, RulesService) {
	    var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "populateAddRule");
        spyOn(RulesService, "setRuleMode");
        
        $scope.addNewRule();
	}));
	
	it('Should have checkMultipleTable', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.tables = ['asd'];
        $scope.checkMultipleTable();
        
        $scope.info.tables = ['asd', 'asac'];
        $scope.info.scope = 'Table';
        $scope.checkMultipleTable();
        
        $scope.info.tables = ['asd', 'asac'];
        $scope.info.scope = 'File';
        $scope.checkMultipleTable();
        
    }));
	
	it('Should have createColumnType', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddRuleCtrl', {
			'$scope' : $scope
		});
		
		$scope.sectionsColumnLabelMap = {
            "a.c": ['', '', 's', 'a-c', 'a'],
            "b.c": ['', '', 'i', 'b-c', 'b'],
            "d.c": ['', '', 's', 'd-c', 'd'],
            "e.c": ['', '', 's', 'e-c', 'e'],
            "f.c": ['', '', 'i', 'f-c', 'f']
        };
		
		var logicPairs = ['a.c', 'b.c', 'a.c'];
		var textPairs = ['a.c', 'e.c'];
		var labelPairs = ['a.c', 'e.c'];
		
		$scope.createColumnType(logicPairs, textPairs, labelPairs);
	}));
	
	it('Should have validateElements', inject(function($rootScope, $controller, RulesService) {
	    var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.validateElements();
        $scope.info.label = "label1";
        RulesService.setRulesLabelMap({label1: true});
        $scope.validateElements();
        RulesService.setRulesLabelMap({lab: true});
        $scope.validateElements();
        RulesService.setRulesLabelMap({label1: true});
        $scope.info.initialLabel = "label";
        $scope.validateElements();
        RulesService.setRulesLabelMap({lab: true});
        $scope.validateElements();
        $scope.info.category = 23;
        $scope.validateElements();
        $scope.info.author = "Unit";
        $scope.validateElements();
        $scope.info.severity = 2;
        $scope.validateElements();
        $scope.info.priority = 2;
        $scope.validateElements();
        $scope.info.scope = "Table";
        $scope.validateElements();
        $scope.info.action = 'mail';
        $scope.validateElements();
        $scope.info.emailTemplate = 12;
        $scope.info.logic = "logic";
        $scope.validateElements();
        $scope.info.text = "text";
        $scope.validateElements();
        $scope.info.scope = "select";
        $scope.validateElements();
	}));
	
	it('Should have convertScalaCondition', inject(function($rootScope, $controller) {
	    var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "parseLogicToScalaCondtion").and.returnValue('');
        
        $scope.sectionsColumnLabelMap = {
            "a vf.c cdf": ['a_name.c_column', '', 's', 'a-c', 'a'],
            "b dfc.cv dcv": ['b_name.c_column', '', 'i64', 'b-c', 'b'],
            "c xs.vfv xx": ['c_name.d_column', '', 'r32', 'c-c', 'c'],
            "d cvf.vf ccd": ['d_name.d_column', '', 'r64', 'd-c', 'd']
        };
        
        var logic = "{a vf.c cdf} > {b dfc.cv dcv} OR {c xs.vfv xx} > {d cvf.vf ccd}";
        $scope.convertScalaCondition(logic);
	}));
	
	it('Should have checkParentheses', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        var logic = "";
        $scope.checkParentheses(logic);
        
        logic = "((())";
        $scope.checkParentheses(logic);
    }));
	
	it('Should have validateLogicGrammar', inject(function($rootScope, $controller, RulesService) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "checkParentheses").and.returnValue(false);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(false);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(false);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets");
        $scope.info.logic = "";
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} ");
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} IS NULL");
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} NOT LIKE '%abcd%'");
        spyOn($scope, "checkInlineFunction").and.returnValue(false);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} NOT LIKE '%abcd%'");
        spyOn($scope, "checkInlineFunction").and.returnValue(true);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} NOTLIKE '%abcd%'");
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} NOLKE '%abcd%'");
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} = 'abcd'");
        spyOn($scope, "checkEqualComparisonOperators").and.returnValue(false);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} = 'abcd'");
        spyOn($scope, "checkEqualComparisonOperators").and.returnValue(true);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} = 'abcd' <> nvbg");
        spyOn($scope, "checkEqualComparisonOperators").and.returnValue(true);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} > {b.c}");
        spyOn($scope, "checkComparisonOperators").and.returnValue(false);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} > {b.c} < {d.c}");
        spyOn($scope, "checkComparisonOperators").and.returnValue(true);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} + {b.c} - {d.c}");
        spyOn($scope, "checkArithmeticOperators").and.returnValue(false);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} + {b.c} - {d.c}");
        spyOn($scope, "checkArithmeticOperators").and.returnValue(true);
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue('{a.c} = "abcd"');
        spyOn($scope, "checkEqualComparisonOperators").and.returnValue(true);
        spyOn($scope, "changeColumnType");
        $scope.info.convertedAttributes = [{value: 'attr1', type: 's'}, {value: 'attr2', type: 'i64'}];
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} + {c.d} IS NULL 'abcd'");
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} + {c.d} ='abcd'");
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} + {c.d} vf 'abcd'");
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        spyOn($scope, "removeBrackets").and.returnValue("{a.c} + {c.d} LIKEA '%abcd%'");
        $scope.validateLogicGrammar();
        
        $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "checkParentheses").and.returnValue(true);
        spyOn($scope, "checkRepeatedAttributes").and.returnValue(true);
        spyOn($scope, "checkFunctions").and.returnValue(true);
        $scope.info.logic = "{a.c} IS NULL OR nbh";
        //$scope.validateLogicGrammar();
    }));
    
    it('Should have checkRepeatedAttributes', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        var statement = '';
        $scope.checkRepeatedAttributes(statement);
        
        statement = '{a.c} = {a.c}';
        $scope.checkRepeatedAttributes(statement);
        
        statement = '{a.c} = {b.c}';
        $scope.checkRepeatedAttributes(statement);
    }));
    
    it('Should have checkFunctions', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });

        $scope.info.logic = '{a.c} > 4 AND {b.c} = "abcd" AND {abcd.xyz bgj(pqr) abc} = "abcd"';
        $scope.sectionsColumnLabelMap = {
            'a.c' : ['', '', 'LONG'],
            'b.c' : ['', '', 'STRING'],
            'abcd.xyz bgj(pqr) abc': ['', '', 'STRING']
        };
        
        spyOn($scope, "changeColumnType");
        $scope.validateLogicGrammar();
        $scope.sectionsColumnLabelMap = {};
        var statement = '';
        $scope.checkFunctions(statement);
        
        statement = 'UPPER()';
        $scope.checkFunctions(statement);
        
        statement = 'UPPER(abcd)';
        $scope.checkFunctions(statement);
        
        statement = 'UPPER(LOWER({attr_1}))';
        $scope.checkFunctions(statement);
        
        statement = 'UPPER({attr_1})';
        $scope.checkFunctions(statement);
        
        statement = 'UPP({attr_1})';
        $scope.checkFunctions(statement);
        
        $scope.sectionsColumnLabelMap = {
            'a.c' : ['', '', 'LONG'],
            'b.c' : ['', '', 'STRING'],
            'abcd.xyz bgj(pqr) abc': ['', '', 'STRING']
        };
        
        statement = '{attr_2} = "vffg abcd(cgfb) mncvh"';
        $scope.checkFunctions(statement);
        
        statement = 'UPPER({attr_3}) = "abcd"';
        $scope.checkFunctions(statement);
        
        statement = 'CONVERTTOINT({attr_1})';
        $scope.checkFunctions(statement);
        
        statement = 'CONVERTTOINT({attr_2})';
        $scope.checkFunctions(statement);
        
        statement = 'CONVERTTOSTRING({attr_1})';
        $scope.checkFunctions(statement);
        
        statement = 'CONVERTTOSTRING({attr_2})';
        $scope.checkFunctions(statement);
    }));
    
    it('Should have removeBrackets', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var statement = '';
        expect($scope.removeBrackets(statement)).toEqual('');
        
        statement = '({a.c}) + ({b.c}) > {d.c}';
        expect($scope.removeBrackets(statement)).toEqual('{a.c} + {b.c} > {d.c}');
    }));
    
    it('Should have changeColumnType', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.sectionsColumnLabelMap = {
            'a.c' : ['', '', 'i'],
            'b.c' : ['', '', 's']
        };
        
        $scope.changeColumnType('a.c');
        $scope.changeColumnType('a.c');
    }));
    
    it('Should have checkInlineFunction', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.sectionsColumnLabelMap = {
            'a.c' : ['', '', 'i'],
            'b.c' : ['', '', 's']
        };
        
        var statement = "{b.c} LIKE '%sdkjh%'";
        $scope.checkInlineFunction(statement, 'LIKE', 6);
        
        statement = "{b.c} LIKE 'sdkjh'";
        $scope.checkInlineFunction(statement, 'LIKE', 6);
        
        statement = "{b.c} LIKE ";
        $scope.checkInlineFunction(statement, 'LIKE', 6);
        
        statement = "{b.c} v LIKE ";
        $scope.checkInlineFunction(statement, 'LIKE', 8);
        
        statement = " LIKE '%sdkjh%'";
        $scope.checkInlineFunction(statement, 'LIKE', 1);
        
        statement = "{a.c} LIKE '%sdkjh%'";
        $scope.checkInlineFunction(statement, 'LIKE', 6);
    }));
    
    it('Should have checkArithmeticOperators', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.logic = '{a.c} > 4 AND {b.c} = "abcd" AND {d.c} = 5';
        $scope.sectionsColumnLabelMap = {
            'a.c' : ['', '', 'LONG'],
            'b.c' : ['', '', 'STRING'],
            'd.c' : ['', '', 'FLOAT']
        };
        
        spyOn($scope, "changeColumnType");
        $scope.validateLogicGrammar();
        
        var statement = '{attr_1} + {attr_2} = 2';
        $scope.checkArithmeticOperators(statement, '+', 9);
        
        statement = '{attr_1} = {attr_2} / 0';
        $scope.checkArithmeticOperators(statement, '/', 20);
        
        statement = '{attr_1} = {attr_2} / 2';
        $scope.checkArithmeticOperators(statement, '/', 20);
        
        statement = '{attr_1} = {attr_3} / 2';
        $scope.checkArithmeticOperators(statement, '/', 20);
        
        statement = '{attr_1} v + {attr_2} = 2';
        $scope.checkArithmeticOperators(statement, '+', 11);
        
        statement = '{attr_1} + v {attr_2} = 2';
        $scope.checkArithmeticOperators(statement, '+', 9);
        
        statement = '{attr_1} + {attr_2}';
        $scope.checkArithmeticOperators(statement, '+', 9);
        
        statement = '{attr_1} + {attr_2} =';
        $scope.checkArithmeticOperators(statement, '+', 9);
        
        statement = '{attr_1} + {attr_2} c';
        $scope.checkArithmeticOperators(statement, '+', 9);
        
        statement = ' + {attr_2} c';
        $scope.checkArithmeticOperators(statement, '+', 1);
        
        statement = '{attr_1} + ';
        $scope.checkArithmeticOperators(statement, '+', 9);
    }));
    
    it('Should have checkEqualComparisonOperators', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.logic = '{a.c} = "abcd" AND {b.c} > 4 AND {d.c} = 5';
        $scope.sectionsColumnLabelMap = {
            "a.c": ['', '', 'STRING'],
            "b.c": ['', '', 'LONG'],
            "d.c": ['', '', 'FLOAT']
        };
        
        spyOn($scope, "changeColumnType");
        $scope.validateLogicGrammar();
        
        var statement = '{attr_2} = 2';
        $scope.checkEqualComparisonOperators(statement, '=', 9);
        
        statement = '{attr_2} = df';
        $scope.checkEqualComparisonOperators(statement, '=', 9);
        
        statement = "{attr_1} = 'df'";
        $scope.checkEqualComparisonOperators(statement, '=', 9);
        
        statement = "{attr_1} = 23";
        $scope.checkEqualComparisonOperators(statement, '=', 9);
        
        statement = "{attr_3} = 23";
        $scope.checkEqualComparisonOperators(statement, '=', 9);
        
        statement = "{attr_3} + 67 = 23 + 67";
        $scope.checkEqualComparisonOperators(statement, '=', 14);
        
        statement = " = 23";
        $scope.checkEqualComparisonOperators(statement, '=', 1);
        
        statement = "v = 23";
        $scope.checkEqualComparisonOperators(statement, '=', 2);
        
        statement = "{attr_3} = ";
        $scope.checkEqualComparisonOperators(statement, '=', 9);
        
        statement = "{attr_3} = {attr_1}";
        $scope.checkEqualComparisonOperators(statement, '=', 9);
        
        statement = "{attr_1} = {attr_2}";
        $scope.checkEqualComparisonOperators(statement, '=', 9);
        
        statement = "{attr_3} + 67 = {attr_1}";
        $scope.checkEqualComparisonOperators(statement, '=', 14);
        
        statement = '{attr_3} + 67 = "a.c"';
        $scope.checkEqualComparisonOperators(statement, '=', 14);
    }));
    
    it('Should have checkComparisonOperators', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.info.logic = '{a.c} = "abcd" AND {b.c} > 4 AND {d.c} = 5';
        $scope.sectionsColumnLabelMap = {
            "a.c": ['', '', 'STRING'],
            "b.c": ['', '', 'LONG'],
            "d.c": ['', '', 'FLOAT']
        };
        
        spyOn($scope, "changeColumnType");
        $scope.validateLogicGrammar();
        
        var statement = '{attr_2} > 2';
        $scope.checkComparisonOperators(statement, '>', 9);
        
        statement = '{attr_2} > ';
        $scope.checkComparisonOperators(statement, '>', 9);
        
        statement = "{attr_2} > 'abc'";
        $scope.checkComparisonOperators(statement, '>', 9);
        
        statement = "{attr_1} > 2";
        $scope.checkComparisonOperators(statement, '>', 9);
        
        statement = "{attr_2} > {attr_1}";
        $scope.checkComparisonOperators(statement, '>', 9);
        
        statement = " > {attr_1}";
        $scope.checkComparisonOperators(statement, '>', 1);
        
        statement = " v > {attr_1}";
        $scope.checkComparisonOperators(statement, '>', 3);
        
        statement = "{attr_1} + 34 > 45 + 56";
        $scope.checkComparisonOperators(statement, '>', 14);
    }));
    
    // it('Should have checkLeftRightOperand', inject(function($rootScope, $controller) {
        // var $scope = $rootScope.$new();
        // $controller('AddRuleCtrl', {
            // '$scope' : $scope
        // });
        // $scope.sectionsColumnLabelMap = {
            // "a.c": ['', '', 's'],
            // "b.c": ['', '', 'i'],
            // "d.c": ['', '', 'u'],
            // "e.c": ['', '', 's'],
            // "f.c": ['', '', 'i']
        // };
        // var statement = '{b.c} > {f.c}';
        // $scope.checkLeftRightOperand(statement, 4, 9, 'comparison');
//         
        // statement = '{a.c} > {f.c}';
        // $scope.checkLeftRightOperand(statement, 4, 9, 'comparison');
//         
        // statement = '{b.c} > {a.c}';
        // $scope.checkLeftRightOperand(statement, 4, 9, 'comparison');
//         
        // statement = '{b.c} = {f.c}';
        // $scope.checkLeftRightOperand(statement, 4, 9, 'equal comparison');
//         
        // statement = '{b.c} = {a.c}';
        // $scope.checkLeftRightOperand(statement, 4, 9, 'equal comparison');
//         
        // statement = '{a.c} = {f.c}';
        // $scope.checkLeftRightOperand(statement, 4, 9, 'equal comparison');
//         
        // statement = '{a.c} = {e.c}';
        // $scope.checkLeftRightOperand(statement, 4, 9, 'equal comparison');
    // }));
    
    it('Should have validateLogicMap', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.sectionsColumnLabelMap = {
            "a.c": ['', '', 's'],
            "b.c": ['', '', 'i'],
            "d.c": ['', '', 'u'],
            "e.c": ['', '', 's'],
            "f.c": ['', '', 'i']
        };
        
        $scope.info.logic = "";
        $scope.validateLogicMap();
        
        $scope.info.logic = "{a.c} + {b.c}";
        $scope.validateLogicMap();
        
        $scope.info.logic = "{a.c} + {";
        $scope.validateLogicMap();
        
        $scope.info.logic = "{a.c} + {cdf}";
        $scope.validateLogicMap();
    }));
    
    it('Should have validateTextMap', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.sectionsColumnLabelMap = {
            "a.c": ['', '', 's'],
            "b.c": ['', '', 'i'],
            "d.c": ['', '', 'u'],
            "e.c": ['', '', 's'],
            "f.c": ['', '', 'i']
        };
        
        $scope.info.text = "";
        $scope.validateTextMap();
        
        $scope.info.text = "{a.c} + {b.c}";
        $scope.validateTextMap();
        
        $scope.info.text = "{a.c} + {";
        $scope.validateTextMap();
        
        $scope.info.text = "{a.c} + {cdf}";
        $scope.validateTextMap();
    }));
    
    it('Should have setHiddenLogic', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.sectionsColumnLabelMap = {
            "a.c": ['a1.c', '', 's'],
            "b.c": ['b1.c', '', 'i'],
            "d.c": ['d1.c', '', 'u'],
            "e.c": ['e1.c', '', 's'],
            "f.c": ['f1.c', '', 'i']
        };
        
        $scope.info.logic = "{a.c} = {e.c}";
        var logicPairs = $scope.validateLogicMap();
        $scope.setHiddenLogic(logicPairs);
    }));
    
    it('Should have setHiddenText', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.sectionsColumnLabelMap = {
            "a.c": ['a1.c', '', 's'],
            "b.c": ['b1.c', '', 'i'],
            "d.c": ['d1.c', '', 'u'],
            "e.c": ['e1.c', '', 's'],
            "f.c": ['f1.c', '', 'i']
        };
        
        $scope.info.text = "{a.c} = {e.c}";
        var textPairs = $scope.validateTextMap();
        $scope.setHiddenText(textPairs);
    }));
    
    it('Should have expandSection', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var section = {};
        $scope.expandSection(section);
    }));
    
    it('Should have expandSection with section data', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getSectionColumns");
        
        var section = {expanded: true, table_name: 'table1'};
        $scope.expandSection(section);
    }));
    
    // it('Should have attributeExpandCollapse', inject(function($rootScope, $controller) {
        // var $scope = $rootScope.$new();
        // $controller('AddRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $scope.info.attributes = [{}, {}];
        // $scope.attributeExpandCollapse();
        // $scope.attributeExpandCollapse();
    // }));
//     
    // it('Should have checkAllExpanded', inject(function($rootScope, $controller) {
        // var $scope = $rootScope.$new();
        // $controller('AddRuleCtrl', {
            // '$scope' : $scope
        // });
//         
        // $scope.info.attributes = [{}, {}];
        // $scope.checkAllExpanded();
        // $scope.attributeExpandCollapse();
        // $scope.checkAllExpanded();
    // }));
	
	it('Should have focusElement', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('AddRuleCtrl', {
			'$scope' : $scope
		});
		$scope.focusElement('other');
	}));
	
	it('Should have addLogicText', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        $scope.focusElement('other');
        $scope.addLogicText('');
        spyOn($scope, "onDropLogic");
        $scope.focusElement('logic');
        $scope.addLogicText('');
        spyOn($scope, "onDropText");
        $scope.focusElement('text');
        $scope.addLogicText('');
    }));
    
    it('Should have onDropLogic', inject(function($rootScope, $controller) {
        var element = document.createElement("input");
        element.type = "text";
        element.id = "inputLogic";
        element.value = "";
        document.body.appendChild(element);
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        var html = '<div class="d3-chart-container"></div>';
        angular.element(document.body).append(html);
        var data = [null, {
            type: 'function',
            text: 'LOWER()'
        }];
        $scope.onDropLogic(data);
        
        data = ["abcd", {
            type: 'i',
            label: 'abcd.defr'
        }];
        $scope.onDropLogic(data);
    }));
    
    it('Should have onDropText', inject(function($rootScope, $controller) {
        var element = document.createElement("input");
        element.type = "text";
        element.id = "inputText";
        element.value = "";
        document.body.appendChild(element);
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var data = [null, {
            type: 'function',
            text: 'LOWER()'
        }];
        $scope.onDropText(data);
        
        data = [null, {
            type: 'operator',
            text: 'AND'
        }];
        $scope.onDropText(data);
        
        data = ["abcd", {
            type: 'i',
            label: 'abcd.defr'
        }];
        $scope.onDropText(data);
    }));
	
	it('Should have getComparisionOperatorForScala', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.getComparisionOperatorForScala('>=');
    }));
    
    it('Should have getInlineFunctionForScala', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.getInlineFunctionForScala('LIKE');
        $scope.getInlineFunctionForScala('>=');
    }));
    
    it('Should have getEqualNullOperatorForScala', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.getEqualNullOperatorForScala('IS NULL');
        $scope.getEqualNullOperatorForScala('>=');
    }));
    
    it('Should have getFunctionForScala', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.getFunctionForScala('LOWER');
        $scope.getFunctionForScala('UPPER');
    }));
    
    it('Should have getConnectorForScala', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        $scope.getConnectorForScala('AND');
        $scope.getConnectorForScala('OR');
    }));
    
    it('Should have parseLogicToScalaCondtion', inject(function($rootScope, $controller, GlobalService) {
        var operators = GlobalService.getVal('rulesOperators');
        operators.push({
            label: 'test',
            text: ' test \'%%\' ',
            scalaOperator: 'test',
            enabled: true,
            positionInc: 8,
            type: 'operator',
            subtype: 'inline function'
        });
        GlobalService.setVal('rulesOperators', operators);
        
        var $scope = $rootScope.$new();
        $controller('AddRuleCtrl', {
            '$scope' : $scope
        });
        
        var stmt = "";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl1.col1 > 23";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl1.col1 IS NULL";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl1.col1 IS NOT NULL";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl2.col3 NOT LIKE '%asdf%'";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "CONVERTTOSTRING(tabl2.col3.toFloat) NOT LIKE '%asdf%'";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl1.col1 > 23 OR tabl2.col3 LIKE '%asdf%'";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl1.col1 > 23 OR tabl2.col3 LIKE '%asdf%' OR LOWER(tabl2.col2) = 'sdef'";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl1.col1 > 23 OR tabl2.col3 LIKE '%asdf%' OR LOWER(tabl2.col2) = 'sdef' OR UPPER(tabl1.col3) = 'kdjfhj'";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl1.col1 > 23 OR tabl2.col3 LIKE '%asdf%' OR LOWER(tabl2.col2) = 'sdef' OR UPPER(tabl1.col3) = 'kdjfhj' OR tabl4.col2 + tabl4.col2 + tabl4.col5 - tabl3.col6 > 4";
        $scope.parseLogicToScalaCondtion(stmt);
        
        stmt = "tabl1.col1 > 23 OR tabl2.col3 LIKE '%asdf%' OR LOWER(tabl2.col2) = 'sdef' OR UPPER(tabl1.col3) = 'kdjfhj' OR tabl4.col2 + tabl4.col2 + tabl4.col5 - tabl3.col6 > 4 OR tabl1.col5 > 7";
        $scope.parseLogicToScalaCondtion(stmt);
    }));
});
