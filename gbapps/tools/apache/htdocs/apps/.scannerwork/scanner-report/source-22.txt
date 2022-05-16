'use strict';

/* jasmine specs for apps controllers go here */

describe('MenuCtrl : ', function() {

	beforeEach(module('gbApp', 'gbApp.controllers.analytics', 'ngTable', 'ngCookies', function($provide) {
		$provide.value('useLocal', true);
		$provide.value('infoserverDomain', 'undefined');
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('Should have menu', inject(function($rootScope, $controller, $httpBackend) {
		var $scope = $rootScope.$new();
		$httpBackend.when('GET', 'stat/menuconfig.json').respond({
			Data : [1, 2, 3]
		});
		var ctrl = $controller('MenuCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.menu).not.toBeDefined();
		$httpBackend.flush();
		expect(ctrl.menu).toBeDefined();
		expect(ctrl.menu).toEqual([1, 2, 3]);
	}));

	it('Should have info', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('MenuCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.info).toEqual(jasmine.any(Object));
	}));
	
	it('Should have setUrl', inject(function($rootScope, $controller, AppService, ConfigDiffService, SectionsMetaService, NavigationService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('MenuCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.setUrl).toEqual(jasmine.any(Function));
		var key = '';
		var label = 'unit';
		var sections = [{selected: true}, {selected: false}, {selected: true}];
		ConfigDiffService.setSections(sections);
		SectionsMetaService.setSections(sections);
		AppService.setAuthorized(true);
		AppService.setInfoServerUp(true);
		ctrl.setUrl(key, label);
		
		key = 'configdiff';
		ctrl.setUrl(key, label);
		
		key = "#";
		ctrl.setUrl(key, label);
		
		spyOn(NavigationService, "getUrl").and.returnValue('url');
		spyOn(NavigationService, "getUrlByKey").and.returnValue('url');
		
		ctrl.setUrl(key, label);
	}));
	
	it('GetConfig', inject(function($rootScope, $controller, $httpBackend) {
		var $scope = $rootScope.$new();
		$httpBackend.when('GET', 'stat/menuconfig.json').respond({
			Data : [1, 2, 3]
		});
		var ctrl = $controller('MenuCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.menu).not.toBeDefined();
		$httpBackend.flush();
		expect(ctrl.menu).toBeDefined();
		expect(ctrl.menu).toEqual([1, 2, 3]);
	}));
	
	it('GetConfig error block', inject(function($rootScope, $controller, $httpBackend) {
        var $scope = $rootScope.$new();
        $httpBackend.when('GET', 'stat/menuconfig.json').respond(500, {
            Data : [1, 2, 3]
        });
        var ctrl = $controller('MenuCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.menu).not.toBeDefined();
        $httpBackend.flush();
        expect(ctrl.menu).toBeDefined();
        expect(ctrl.menu).toEqual([1, 2, 3]);
    }));
    
    it('GetConfig error block session timeout', inject(function($rootScope, $controller, $httpBackend, ModalService) {
        var $scope = $rootScope.$new();
        spyOn(ModalService, "sessionTimeout");
        $httpBackend.when('GET', 'stat/menuconfig.json').respond(500, {
            Data : [1, 2, 3], Msg: 'timeout'
        });
        var ctrl = $controller('MenuCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.menu).not.toBeDefined();
        $httpBackend.flush();
        expect(ctrl.menu).toBeDefined();
        expect(ctrl.menu).toEqual([1, 2, 3]);
    }));
    
    it('Should have getCurrentLabel', inject(function($rootScope, $controller, MenuService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('MenuCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getCurrentLabel).toEqual(jasmine.any(Function));
        expect(ctrl.getCurrentLabel()).toEqual(MenuService.getCurrentLabel());
    }));
});

describe('ChangeViewController : ', function() {

    var $modalInstance;

    beforeEach(module('gbApp', 'gbApp.controllers.analytics', 'ngTable', 'ngCookies', function($provide) {
        $provide.value('useLocal', true);
        $provide.value('infoserverDomain', 'undefined');
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));
    
    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
    
    it('Should have changeViewConfirm section view', inject(function($rootScope, $controller, ModalService, NavigationService, SectionsMetaService, ConfigDiffService) {
        var $scope = $rootScope.$new();
     
        var ctrl = $controller('ChangeViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            '$localStorage': {},
            'items': {key: 'sectionview', label: 'Section View', current: 'Section View'}
        });
        
        expect(ctrl.changeViewConfirm).toEqual(jasmine.any(Function));
        spyOn(NavigationService, "setUrl");
        spyOn(ConfigDiffService, "clearConfigDiff");

        ctrl.changeViewConfirm();
        
        expect(NavigationService.setUrl).toHaveBeenCalledWith('sectionview');
        expect(ConfigDiffService.clearConfigDiff).toHaveBeenCalled();
    }));
    
    it('Should have changeViewConfirm config diff', inject(function($rootScope, $controller, ModalService, NavigationService, SectionsMetaService, ConfigDiffService) {
        var $scope = $rootScope.$new();
     
        var ctrl = $controller('ChangeViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            '$localStorage': {},
            'items': {key: 'configdiff', label: 'Config Diff', current: 'Config Diff'}
        });
        
        expect(ctrl.changeViewConfirm).toEqual(jasmine.any(Function));
        spyOn(NavigationService, "setUrl");
        spyOn(SectionsMetaService, "clearSectionView");

        ctrl.changeViewConfirm();
        
        expect(NavigationService.setUrl).toHaveBeenCalledWith('configdiff');
        expect(SectionsMetaService.clearSectionView).toHaveBeenCalled();
    }));
    
    it('Should have hideChangeViewModal', inject(function($rootScope, $controller, ModalService) {
        var $scope = $rootScope.$new();
     
        var ctrl = $controller('ChangeViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            '$localStorage': {},
            'items': {key: 'sectionview', label: 'Section View', current: 'Section View'}
        });
        
        expect(ctrl.hideChangeViewModal).toEqual(jasmine.any(Function));
        ctrl.hideChangeViewModal();
    }));

    it('Should have openChangeViewModal Section View', inject(function($rootScope, $controller, GlobalService, DefaultFilterService, $window, $timeout) {
        var $scope = $rootScope.$new();
     
        var ctrl = $controller('ChangeViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            '$localStorage': {},
            'items': {key: 'sectionview', label: 'Section View', current: 'Section View'}
        });
     
        expect(ctrl.openChangeViewModal).toEqual(jasmine.any(Function));
        spyOn(DefaultFilterService, "getDefaultSysId").and.returnValue({"a":"b"});
        spyOn(DefaultFilterService, "getSelectedObservation").and.returnValue({"a":"b"});
        spyOn(DefaultFilterService, "getDefaultEndCust").and.returnValue({"a":"b"});
     
        spyOn($window,'open');
     
        spyOn(GlobalService,'getVal');
        ctrl.openChangeViewModal();
        $timeout.flush(250);
     
        expect(GlobalService.getVal).toHaveBeenCalledWith('redirect_new_window');
        expect($window.open).toHaveBeenCalledWith(GlobalService.getVal('redirect_new_window'), '_blank');
    }));
    
    it('Should have openChangeViewModal Config Diff', inject(function($rootScope, $controller, GlobalService, DefaultFilterService, $window, $timeout) {
        var $scope = $rootScope.$new();
     
        var ctrl = $controller('ChangeViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            '$localStorage': {},
            'items': {key: 'configdiff', label: 'Config Diff', current: 'Config Diff'}
        });
     
        expect(ctrl.openChangeViewModal).toEqual(jasmine.any(Function));
        spyOn(DefaultFilterService, "getDefaultSysId").and.returnValue({"a":"b"});
        spyOn(DefaultFilterService, "getSelectedObservation").and.returnValue({"a":"b"});
        spyOn(DefaultFilterService, "getDefaultEndCust").and.returnValue({"a":"b"});
     
        spyOn($window,'open');
     
        spyOn(GlobalService,'getVal');
        ctrl.openChangeViewModal();
        $timeout.flush(250);
     
        expect(GlobalService.getVal).toHaveBeenCalledWith('redirect_new_window');
        expect($window.open).toHaveBeenCalledWith(GlobalService.getVal('redirect_new_window'), '_blank');
    }));
});

describe('SectionsCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;

	beforeEach(module('gbApp', 'gbApp.services', 'gbApp.controllers.analytics', 'ngTable', 'ngCookies', function($provide) {
		$provide.value('useLocal', true);
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

	it('Should have select filter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.select).toBeDefined();
		expect(ctrl.select).toEqual({
			'selected' : true
		});
	}));

	it('Should have search filter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.search).toEqual(jasmine.any(Object));
	}));

	it('Should have info', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.info).toEqual(jasmine.any(Object));
	}));

	it('Should have isReady', inject(function($rootScope, $controller, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.isReady).toEqual(jasmine.any(Function));
		expect(ctrl.isReady()).toEqual(SectionsMetaService.isReady());
	}));

	it('Should have getSections', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getSections()).toBeTruthy();
	}));
	
	it('Should have getSectionsLoading', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getSectionsLoading).toEqual(jasmine.any(Function));
        expect(ctrl.getSectionsLoading()).toEqual(SectionsMetaService.getSectionLoading());
    }));
	
	it('Should have renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        expect(ctrl.renderHtml).toEqual(jasmine.any(Function));
        expect(ctrl.renderHtml('abcd')).toEqual($sce.trustAsHtml('abcd'));
    }));
	
	it('Should have getValue', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getValue).toEqual(jasmine.any(Function));
        expect(ctrl.getValue('abc')).toEqual(GlobalService.getVal('abc'));
    }));
	
	it('Should have removeSection', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        spyOn(SectionsMetaService, "getViewName").and.returnValue("test view");
        expect(ctrl.removeSection).toEqual(jasmine.any(Function));
        
        ctrl.removeSection();
    }));

	it('Should have doTranspose', inject(function($rootScope, $controller, $window, $httpBackend, UserTrackingService, GlobalService, infoserverDomain) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.doTranspose).toEqual(jasmine.any(Function));
		var section = {
			isTranspose: true
		};
		spyOn(UserTrackingService, "standard_user_tracking").and.callThrough();
		
		//$httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Section View/Transpose Section', {"details":"{'undefined'}", "solr_query": ""}).respond({"Status":"Success","Msg":"","Data":""});
		ctrl.doTranspose(section);
		//$httpBackend.flush();
		//expect(UserTrackingService.standard_user_tracking).toHaveBeenCalled();
		//expect(section.isTranspose).not.toBeTruthy();
	}));
	
	it('Should have hasFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.hasFilter).toEqual(jasmine.any(Function));
		expect(ctrl.hasFilter({})).toBeFalsy();
		var section = {
			filter: {
				unit1: {
					value: 12
				},
				unit2: {
					value: 0
				},
				unit3: {
				    
				}
			}
		};
		expect(ctrl.hasFilter(section)).toBeTruthy();
		section = {
            filter: {}
        };
        expect(ctrl.hasFilter(section)).toBeFalsy();
	}));
	
	it('Should have addSectionInstance', inject(function($rootScope, $controller, DefaultFilterService, InstanceHandler,ModalService) {
		
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		spyOn(DefaultFilterService, "getDefaultObservation").and.returnValue({'obs_time': "abcdbhdfjdhkdf", 'bundle_name': 'test_bundle', 'obs_url': "www.http://google.com"});
		spyOn(DefaultFilterService, "getLogVaultRec").and.returnValue({'key':'value'});
		spyOn(DefaultFilterService, "getDefaultSysId").and.returnValue({'sys_id':'abc'});
		spyOn(InstanceHandler, "addInstance");
		ctrl.addSectionInstance({});
	}));

	it('Should have hasColumnFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.hasColumnFilter).toEqual(jasmine.any(Function));
		expect(ctrl.hasColumnFilter({}, {})).toBeFalsy();
		expect(ctrl.hasColumnFilter({columns: {}, filter: {}}, {})).toBeFalsy();
		expect(ctrl.hasColumnFilter({columns: {}, filter: {unit: {value: 12}}}, {field: 'unit'})).toBeTruthy();
	}));

	it('Should have resetFilter', inject(function($rootScope, $controller, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.resetFilter).toEqual(jasmine.any(Function));
		spyOn(SectionsMetaService, "resetFilter");
		ctrl.resetFilter({});
		expect(SectionsMetaService.resetFilter).toHaveBeenCalledWith({});
	}));

	it('Should have toggleShowlog', inject(function($rootScope, $controller, $window, $httpBackend, UserTrackingService, GlobalService, infoserverDomain) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.toggleShowlog).toEqual(jasmine.any(Function));
		var section = {
			showlog: true
		};
		spyOn(UserTrackingService, "standard_user_tracking").and.callThrough();
		ctrl.toggleShowlog(section);
	}));

	it('Should have cancel', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.cancel).toEqual(jasmine.any(Function));
		spyOn(SectionsMetaService, "getSections").and.returnValue([{selected: true}, {selected: false}]);
		spyOn(DefaultFilterService, "getDefaultObservation");
		spyOn(SectionsMetaService, "setSections");
		ctrl.cancel();
		expect(ctrl.visible).toBeFalsy();
		expect(SectionsMetaService.getSections).toHaveBeenCalled();
		expect(DefaultFilterService.getDefaultObservation).toHaveBeenCalled();
		expect(SectionsMetaService.setSections).toHaveBeenCalled();
	}));

	it('Should have done', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.done).toEqual(jasmine.any(Function));
		spyOn(DefaultFilterService, "getDefaultObservation").and.returnValue(false);
		ctrl.done('');
	}));
	
	it('Shpould have done with error messages', inject(function($rootScope, $controller, DefaultFilterService, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		spyOn(DefaultFilterService, "getDefaultEndCust").and.returnValue(null);
		spyOn(DefaultFilterService, "getDefaultSysId").and.returnValue(null);
		spyOn(DefaultFilterService, "getDefaultObservation").and.returnValue('abc');
		spyOn(SectionsMetaService, "getSections").and.returnValue([{selected: false}, {selected:true}]);
		ctrl.done('');
	}));
	
	it('Should have done with no error messages', inject(function($rootScope, $controller, DefaultFilterService, SectionsMetaService, UserTrackingService, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		spyOn(ctrl, "removeSection");
		spyOn(UserTrackingService, "standard_user_tracking").and.callThrough();
		spyOn(DefaultFilterService, "getDefaultEndCust").and.returnValue('ec');
		spyOn(DefaultFilterService, "getDefaultSysId").and.returnValue('sysid');
		spyOn(DefaultFilterService, "getDefaultObservation").and.returnValue({obs_time: '2015-12-23T12:34:21Z'});
		spyOn(SectionsMetaService, "getSections").and.returnValue([{selected: false}, {selected: true, default: true, label: 'label1'}, {selected: false, default: true, label: 'label2'}, {selected: true}]);
		ctrl.done('');
	}));

	it('Should have toggleAll', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.toggleAll).toEqual(jasmine.any(Function));
		var i, section = {
			'columns' : [{
				'selected' : false
			}, {
				'selected' : false
			}],
			'meta' : {
				'shownAll' : false
			},
            columnsMap: {
                
            }
		};
		ctrl.toggleAll(section);
		for (i in section.columns) {
			expect(section.columns[i].selected).toBeFalsy();
		}
		section.meta['shownAll'] = true;
		ctrl.toggleAll(section);
		for (i in section.columns) {
			expect(section.columns[i].selected).toBeTruthy();
		}
	}));

	it('Should have changeShownAll', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.changeShownAll).toEqual(jasmine.any(Function));
		var i, section = {
			'columns' : [{
				'selected' : true
			}, {
				'selected' : true
			}],
			'meta' : {
				'shownAll' : false
			},
			columnsMap: {
			    
			}
		};
		ctrl.changeShownAll(section);
		expect(section.meta['shownAll']).toBeTruthy();
		section.columns[0].selected = false;
		ctrl.changeShownAll(section);
		expect(section.meta['shownAll']).toBeFalsy();
	}));

	it('Should have stopFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.stopFilter).toEqual(jasmine.any(Function));
		var ev = {
			stopPropagation: function() {
				
			}
		};
		spyOn(ev, "stopPropagation");
		ctrl.stopFilter(ev);
	}));

	it('Should have doneFilter', inject(function($rootScope, $controller, $compile, $window, $httpBackend, UserTrackingService, GlobalService, SectionsMetaService, infoserverDomain, ModalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		var retDate = new Date(128728378);
		spyOn(ModalService, "sessionTimeout");
		expect(ctrl.doneFilter).toEqual(jasmine.any(Function));
		var element1 = $compile('<div class="dropdown open"></div>')($scope);
		var column = {
			type: 'boolean',
			field: 'unit',
			'true': true,
			'false': false,
			value: true,
			operator: '&&',
			filter: 'text'
		};
		var section = {
			name: 'unit',
			filter: {},
			info: {
                page: {
                    
                }
            }
		};
		spyOn(SectionsMetaService, "populateSectionData");
		spyOn(UserTrackingService, "standard_user_tracking").and.callThrough();

		ctrl.doneFilter(event, section, column);
		ctrl.doneFilter(event, section, column);
		column.type='number';
		ctrl.doneFilter(event, section, column);
		column.type='string';
		ctrl.doneFilter(event, section, column);
		section.info.page.total = 0;
		section.info.page.count = 10;
		ctrl.doneFilter(event, section, column);
		
		section.info.page.total = 20;
        section.info.page.count = 10;
        section.info.page.current = 20;
        ctrl.doneFilter(event, section, column);
	}));
	
	it('Should have sortClicked', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        spyOn(ctrl, "changeSortField");
        expect(ctrl.sortClicked).toEqual(jasmine.any(Function));
        var section = {
            info: {
            }
        };
        var event = {
        	target : {
        		id : "columnHeader"
        	}
        }
        ctrl.sortClicked(event ,section);
    }));
	
	it('Should have generateRuleLogic', inject(function($rootScope, $controller, SectionsMetaService,ExplorerService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        spyOn(ExplorerService, "setRuleSection");
        spyOn(ExplorerService, "getRuleText");
        spyOn(ExplorerService, "setRuleText");
        expect(ctrl.generateRuleLogic).toEqual(jasmine.any(Function));
        var section = {
        	name: 'name',
            label: "label",
            columnsMap : {
            	title: 'abc'
            }
        };
        var column = {
        	type : 'string'
        };
        ctrl.generateRuleLogic(section, column);
        column = {
        	type : 'number'
        };
        ctrl.generateRuleLogic(section, column);
    }));
	
	it('Should have changeSortField', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        spyOn(SectionsMetaService, "populateSectionData");
        expect(ctrl.changeSortField).toEqual(jasmine.any(Function));
        var section = {
            info: {
            }
        };
        ctrl.changeSortField(section, 'field');
        ctrl.changeSortField(section, 'field');
        ctrl.changeSortField(section, 'field1');
    }));
	
	it('Should have getSectionColumns', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getSectionColumns).toEqual(jasmine.any(Function));
		expect(ctrl.getSectionColumns([])).toEqual([]);
		expect(ctrl.getSectionColumns([{visible: true}, {visible: false}, {visible: true}, {visible: false}])).toEqual([ { visible: true, firstVisible: true }, { visible: false, firstVisible: false }, { visible: true, firstVisible: false }, { visible: false, firstVisible: false } ]);
		expect(ctrl.getSectionColumns([{visible: false}, {visible: true}, {visible: true}, {visible: false}])).toEqual([ { visible: false, firstVisible: false }, { visible: true, firstVisible: true }, { visible: true, firstVisible: false }, { visible: false, firstVisible: false } ]);
		expect(ctrl.getSectionColumns([{visible: false}, {visible: false}, {visible: true}, {visible: false}])).toEqual([ { visible: false, firstVisible: false }, { visible: false, firstVisible: false }, { visible: true, firstVisible: false }, { visible: false, firstVisible: false } ]);
	}));
	
	it('Should have exportAllPDF', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.exportAllPDF).toEqual(jasmine.any(Function));
        ctrl.exportAllPDF();
        
        spyOn(ctrl, "getSelectedSections").and.returnValue([{}, {}]);
        ctrl.exportAllPDF();
        
        spyOn(SectionsMetaService, "getSections").and.returnValue([{a_data: false, selected: true}, {a_data: true, selected: true, columns: {key1: {visible: false}, key2: {visible: true}}}]);
        ctrl.exportAllPDF();
    }));
    
    it('Should have exportAllPDF with export data', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.exportAllPDF).toEqual(jasmine.any(Function));
        
        spyOn(ctrl, "getSelectedSections").and.returnValue([{a_data: false, display_data: false, selected: true}, {a_data: true, display_data: true, selected: true, columns: {key1: {visible: false}, key2: {visible: true}}}]);
        spyOn(SectionsMetaService, "getSections").and.returnValue([{a_data: false, display_data: false, selected: true}, {a_data: true, display_data: true, selected: true, columns: {key1: {visible: false}, key2: {visible: true}}}]);
        
        ctrl.exportAllPDF();
    }));

	it('Should have cancelFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.cancelFilter).toEqual(jasmine.any(Function));
		ctrl.cancelFilter('', '', '');
	}));

	it('Should have increasePageSize', inject(function($rootScope, $controller, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.increasePageSize).toEqual(jasmine.any(Function));
		var section = {
			'count' : 10,
			info: {
                page: {
                    
                }
            }
		};
		spyOn(SectionsMetaService, "populateSectionData");
		ctrl.increasePageSize(section);
		expect(section.count).toEqual(10);
		section.tot_count = 100;
		ctrl.increasePageSize(section);
		expect(section.count).toEqual(20);
	}));

	it('Should have decreasePageSize', inject(function($rootScope, $controller, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SectionsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.decreasePageSize).toEqual(jasmine.any(Function));
		var section = {
			'count' : 10,
			info: {
                page: {
                    
                }
            }
		};
		spyOn(SectionsMetaService, "populateSectionData");
		ctrl.decreasePageSize(section);
		expect(section.count).toEqual(10);
		section.count = 20;
		ctrl.decreasePageSize(section);
        expect(section.count).toEqual(10);
	}));
	
	it('Should have firstPage', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.firstPage).toEqual(jasmine.any(Function));
        var section = {
            'count' : 10,
            info: {
                page: {
                    current: 10
                }
            }
        };
        spyOn(SectionsMetaService, "populateSectionData");
        ctrl.firstPage(section);
        expect(section.info.page.current).toEqual(1);
        ctrl.firstPage(section);
        expect(section.info.page.current).toEqual(1);
    }));
    
    it('Should have prevPage', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.prevPage).toEqual(jasmine.any(Function));
        var section = {
            'count' : 10,
            info: {
                page: {
                    current: 2
                }
            }
        };
        spyOn(SectionsMetaService, "populateSectionData");
        ctrl.prevPage(section);
        expect(section.info.page.current).toEqual(1);
        ctrl.prevPage(section);
        expect(section.info.page.current).toEqual(1);
    }));
    
    it('Should have nextPage', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.nextPage).toEqual(jasmine.any(Function));
        var section = {
            'count' : 10,
            info: {
                page: {
                    current: 2,
                    pages: 3
                }
            }
        };
        spyOn(SectionsMetaService, "populateSectionData");
        ctrl.nextPage(section);
        expect(section.info.page.current).toEqual(3);
        ctrl.nextPage(section);
        expect(section.info.page.current).toEqual(3);
    }));
    
    it('Should have lastPage', inject(function($rootScope, $controller, SectionsMetaService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SectionsCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.lastPage).toEqual(jasmine.any(Function));
        var section = {
            'count' : 10,
            info: {
                page: {
                    current: 2,
                    pages: 30
                }
            }
        };
        spyOn(SectionsMetaService, "populateSectionData");
        ctrl.lastPage(section);
        expect(section.info.page.current).toEqual(30);
        ctrl.lastPage(section);
        expect(section.info.page.current).toEqual(30);
    }));  
});

describe('DefaultFilterCtrl : ', function() {
    
    var manufacturer, product, schema;
    
	beforeEach(module('gbApp', 'gbApp.controllers.analytics', 'ngTable', 'ngCookies', 'gbApp.filters', function($provide) {
		$provide.value('useLocal', true);
		$provide.value('infoserverDomain', 'undefined');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
        var retDate = new Date(Date.UTC(2015, 2, 12, 22, 45, 23, 45));
        jasmine.clock().mockDate(retDate);
    }));
	
	/*it('$watch ctrl.resultLoading', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.resultLoading = false;
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            'Msg' : 'Session timeout',
            'Data' : []
        });
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {"Status":"Success","Msg":"System timeout","Data":[{"ec_name":"glass","sys_ids":["00:0C:29:B3:01:F8","00:0C:29:9E:F5:12","00:0C:29:21:24:D2"]}]});
        $scope.$digest();
        
        ctrl.resultLoading = true;
        $scope.$digest();
    }));
    */
    it('receive AppLoadEvent-apps', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.resultLoading = false;
        $rootScope.$broadcast('AppLoadEvent-apps');
        ctrl.resultLoading = true;
        $rootScope.$broadcast('AppLoadEvent-apps');
    }));
	
	it('Should have init', inject(function($rootScope, $controller, DefaultFilterService, SectionsMetaService) {
		var $scope = $rootScope.$new();

		spyOn(DefaultFilterService, "getDefaultObservation").and.returnValue({});
		spyOn(DefaultFilterService, "getDefaultSysId").and.returnValue(true);
		spyOn(DefaultFilterService, "getLoadPage").and.returnValue('sectionview');
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect($scope.init).toEqual(jasmine.any(Function));
		//ctrl.init();
	}));
	
	it('Should have changeSubSysId', inject(function($rootScope, $controller, DefaultFilterService, SectionsMetaService) {
		var $scope = $rootScope.$new();

		spyOn(DefaultFilterService, "getSysId2").and.returnValue('abc');
		spyOn(DefaultFilterService, "getDefaultObservation").and.returnValue({});
		spyOn(DefaultFilterService, "setDefaultObservation");
		spyOn(DefaultFilterService, "setSelectedObservation");

		spyOn(SectionsMetaService, "getSections").and.returnValue([{'selected': true}]);
		spyOn(SectionsMetaService, "getLoadView").and.returnValue({});
		spyOn(SectionsMetaService, "getViewName").and.returnValue({});
		spyOn(SectionsMetaService, "getSelectedView").and.returnValue({});
		spyOn(SectionsMetaService, "setSectionLoading");
		spyOn(SectionsMetaService, "setSections");

		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		spyOn(ctrl, "loadDashboardView");
		ctrl.info = {
			'setObservationNull' : true
		}
		expect(ctrl.changeSubSysId).toEqual(jasmine.any(Function));
		ctrl.changeSubSysId('abc');
		ctrl.changeSubSysId('xyz');
	}));

	it('Should have getSysId2', inject(function($rootScope, $controller, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		//spyOn(DefaultFilterService, "getSysId2");
		expect(ctrl.getSysId2).toEqual(jasmine.any(Function));
		ctrl.getSysId2();
	}));

	it('Should have loadDashboardView', inject(function($rootScope, $controller, DefaultFilterService, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		spyOn(SectionsMetaService, "applyView");
		spyOn(SectionsMetaService, "setSelectedView");
		spyOn(SectionsMetaService, "setSectionLoading");
		spyOn(SectionsMetaService, "setLoadView");
		var dashboardView = {
			type : 'custom'
		};
		expect(ctrl.loadDashboardView).toEqual(jasmine.any(Function));
		//ctrl.loadDashboardView(dashboardView, {});
	}));

	it('Should have loadDefaultView', inject(function($rootScope, $controller, DefaultFilterService, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		spyOn(DefaultFilterService, "getDefaultObservation").and.returnValue({});
		spyOn(SectionsMetaService, "getSections").and.returnValue([{}]);
		spyOn(SectionsMetaService, "setSectionLoading");
		var dashboardView = {
			type : 'custom'
		};
		expect(ctrl.loadDefaultView).toEqual(jasmine.any(Function));
		ctrl.loadDefaultView({});
	}));

	it('Should have getSysId2List', inject(function($rootScope, $controller, DefaultFilterService, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		spyOn(DefaultFilterService, "getSubSys").and.returnValue([{},{}]);
		spyOn(DefaultFilterService, "getSysId2");
		spyOn(DefaultFilterService, "setSysId2");
		expect(ctrl.getSysId2List).toEqual(jasmine.any(Function));
		ctrl.getSysId2List();
	}));



	it('Should have defaultFilters', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.defaultFilters).toEqual(jasmine.any(Array));
	}));
	
	it('Should have selectObsGroup', inject(function($rootScope, $controller, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.selectObsGroup).toEqual(jasmine.any(Function));
		spyOn(DefaultFilterService, "setSelectedObsGrp");
		ctrl.selectObsGroup('mostrecent');
	}));

	it('Should have getKbLink', inject(function($rootScope, $controller, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getKbLink()).toBeFalsy();
		SectionsMetaService.setKbLink('link');
		expect(ctrl.getKbLink()).toBeFalsy();
		SectionsMetaService.setAppliedView(true);
		expect(ctrl.getKbLink()).toBeTruthy();
		expect(ctrl.getKbLink()).toEqual('link');
		expect(ctrl.getKbLink()).toEqual(SectionsMetaService.getKbLink());
	}));
	
	it('Should have moveThroughSysId', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		spyOn(ctrl, "resetMoveThroughSysId");
		spyOn(ctrl, "changeSysId");
		ctrl.info = {
			defaultEndCust: {
				sys_ids: [{}, {}]
			}
		};
		ctrl.info.sysIdIndex = -1;
		var ev = {keyCode: 38};
		ctrl.moveThroughSysId(ev);
		ctrl.info.sysIdIndex = 1;
		ctrl.moveThroughSysId(ev);
		ev.keyCode = 40;
		ctrl.moveThroughSysId(ev);
		ctrl.moveThroughSysId(ev);
		ev.keyCode = 14;
		ctrl.moveThroughSysId(ev);
		ctrl.sysfilter = {
			sys_id: "bc"
		};
		ctrl.moveThroughSysId(ev);
	}));
	
	it('Should have resetMoveThroughSysId', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		ctrl.info = {
			defaultEndCust: {
				sys_ids: [{}, {}]
			}
		};
		ctrl.resetMoveThroughSysId();
	}));	

	it('Should have changeEndCust', inject(function($rootScope, $controller, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.changeEndCust).toEqual(jasmine.any(Function));
		expect(DefaultFilterService.getDefaultSysId()).toBeUndefined();
		expect(DefaultFilterService.getDefaultObservation()).toBeUndefined();
		ctrl.changeEndCust();
		expect(DefaultFilterService.getDefaultSysId()).toBeNull();
		expect(DefaultFilterService.getDefaultObservation()).toBeNull();
		expect(ctrl.info['defaultObservation']).toBeNull();
		expect(ctrl.info['defaultSysId']).toBeNull();
	}));

	it('Should have getSysId2Tooltip', inject(function($rootScope, $controller, DefaultFilterService, SectionsMetaService, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getSysId2Tooltip).toEqual(jasmine.any(Function));
		ctrl.getSysId2Tooltip();
	}));

	it('Should have showSysid2DD', inject(function($rootScope, $controller, DefaultFilterService, metaDataService, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		spyOn(metaDataService, "isSysid2Enable").and.returnValue(true);
		/*spyOn(DefaultFilterService, "getSysId2");
		spyOn(DefaultFilterService, "setSysId2");*/
		expect(ctrl.showSysid2DD).toEqual(jasmine.any(Function));
		ctrl.showSysid2DD();
	}));

	it('Should have changeSysId', inject(function($rootScope, $controller, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.changeSysId).toEqual(jasmine.any(Function));
		expect(DefaultFilterService.getDefaultObservation()).toBeUndefined();
		ctrl.info['defaultEndCust'] = {};
		ctrl.info['defaultSysId'] = {};
		ctrl.changeSysId();
		expect(DefaultFilterService.getDefaultObservation()).toBeNull();
		expect(ctrl.info['defaultObservation']).toBeNull();
		ctrl.info['defaultSysId'].observations = [];
		ctrl.info['defaultSysId'].lastNObservations = [];
		ctrl.sysfilter = true;
		ctrl.changeSysId();
	}));
	
	it('Should have setDefaultObservation', inject(function($rootScope, $controller, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.setDefaultObservation).toEqual(jasmine.any(Function));
		spyOn(SectionsMetaService, "getAppliedView").and.returnValue(null);
		ctrl.setDefaultObservation({});
	}));
	
	it('Should have getObservations', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getObservations).toEqual(jasmine.any(Function));
		ctrl.getObservations('10');
		ctrl.getObservations(null);
	}));
	
	it('Should have getObservations getLastHourObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        spyOn(UtilService, "parseDate");
        expect(ctrl.getObservations('Last Hour')).toEqual([]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getLastHourObservations with date field', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('Last Hour');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        var today = new Date();
        var next_day = today.setFullYear(today.getFullYear() + 1);
        spyOn(UtilService, "parseDate").and.returnValue(next_day);
        expect(ctrl.getObservations('Last Hour')).toEqual([ { obs_time: 'July 21, 1983 01:15:00' }, { obs_time: 'September 23, 1973 03:45:00' }, { obs_time: 'January 11, 2003 05:25:00' } ]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getLast12HourObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        spyOn(UtilService, "parseDate");
        expect(ctrl.getObservations('Last 12 Hour')).toEqual([]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getLast12HourObservations with date field', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('Last 12 Hour');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        var today = new Date();
        var next_day = today.setFullYear(today.getFullYear() + 1);
        spyOn(UtilService, "parseDate").and.returnValue(next_day);
        expect(ctrl.getObservations('Last 12 Hour')).toEqual([ { obs_time: 'July 21, 1983 01:15:00' }, { obs_time: 'September 23, 1973 03:45:00' }, { obs_time: 'January 11, 2003 05:25:00' } ]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getYesterdayObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        spyOn(UtilService, "parseDate");
        expect(ctrl.getObservations('Yesterday')).toEqual([]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getYesterdayObservations with date field', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('Yesterday');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        var today = new Date();
        var next_day = today.setFullYear(today.getFullYear() + 1);
        spyOn(UtilService, "parseDate").and.returnValue(next_day);
        expect(ctrl.getObservations('Yesterday')).toEqual([ { obs_time: 'July 21, 1983 01:15:00' }, { obs_time: 'September 23, 1973 03:45:00' }, { obs_time: 'January 11, 2003 05:25:00' } ]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getLast2DaysObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        spyOn(UtilService, "parseDate");
        expect(ctrl.getObservations('Last 2 Days')).toEqual([]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getLast2DaysObservations with date field', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('Last 2 Days');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        var today = new Date();
        var next_day = today.setFullYear(today.getFullYear() + 1);
        spyOn(UtilService, "parseDate").and.returnValue(next_day);
        expect(ctrl.getObservations('Last 2 Days')).toEqual([ { obs_time: 'July 21, 1983 01:15:00' }, { obs_time: 'September 23, 1973 03:45:00' }, { obs_time: 'January 11, 2003 05:25:00' } ]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getThisWeekObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        spyOn(UtilService, "parseDate");
        expect(ctrl.getObservations('This Week')).toEqual([]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getThisWeekObservations with date field', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('This Week');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        var today = new Date();
        spyOn(UtilService, "parseDate").and.returnValue(today);
        expect(ctrl.getObservations('This Week')).toEqual([ { obs_time: '21-07-2001T01:15:00Z' }, { obs_time: '23-09-1973T03:45:00Z' }, { obs_time: '11-01-2001T05:25:00Z' } ]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
    
    it('Should have getObservations getMostRecentObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                lastNObservations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        expect(ctrl.getObservations('Most Recent')).toEqual([ { obs_time: '21-07-2001T01:15:00Z' } ]);
    }));
    
    it('Should have getObservations getMostRecentObservations no sysId', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                lastNObservations: null
            }
        };
        expect(ctrl.getObservations('Most Recent')).toBeUndefined();
    }));
	
	it('Should have getObservations getThisMonthObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        spyOn(UtilService, "parseDate");
        expect(ctrl.getObservations('This Month')).toEqual([]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getThisMonthObservations with date field', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('This Month');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        var today = new Date();
        spyOn(UtilService, "parseDate").and.returnValue(today);
        expect(ctrl.getObservations('This Month')).toEqual([ { obs_time: '21-07-2001T01:15:00Z' }, { obs_time: '23-09-1973T03:45:00Z' }, { obs_time: '11-01-2001T05:25:00Z' } ]);
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getObservations getLastNObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        ctrl.info = {
            defaultSysId: {
                lastNObservations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        expect(ctrl.getObservations('Last N')).toEqual([ { obs_time: '21-07-2001T01:15:00Z' }, { obs_time: '23-09-1973T03:45:00Z' }, { obs_time: '11-01-2001T05:25:00Z' } ]);
        ctrl.info = {
            defaultSysId: {
                lastNObservations: null
            }
        };
        ctrl.getObservations('Last N');
    }));
	
	it('Should have getSelectedSections', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getSelectedSections).toEqual(jasmine.any(Function));
		spyOn(SectionsMetaService, "getSections");
		spyOn(DefaultFilterService, "getDefaultObservation");
		expect(ctrl.getSelectedSections()).toBeUndefined();
		expect(DefaultFilterService.getDefaultObservation).toHaveBeenCalled();
		expect(SectionsMetaService.getSections).toHaveBeenCalledWith(DefaultFilterService.getDefaultObservation());
	}));
	
	it('Should have resetSections', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.resetSections).toEqual(jasmine.any(Function));
		ctrl.resetSections();
	}));
	
	it('showModal', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService, ModalService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.showModal).toBeDefined();
        expect(ctrl.showModal).toEqual(jasmine.any(Function));
        ctrl.showModal();
        spyOn(ctrl, "getSelectedSections").and.returnValue([{}]);
        spyOn(SectionsMetaService, "getSections").and.returnValue([{}]);
        ctrl.showModal();
        spyOn(SectionsMetaService, "getViewsCount").and.returnValue(4);
        GlobalService.setVal('max_views_limit', 4);
        ctrl.showModal();
    }));
    
    it('showModal section without data', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService, ModalService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        spyOn(SectionsMetaService, "getSections").and.returnValue([{
            selected: true
        }, {
            selected: true
        }]);
        spyOn(ctrl, "getSelectedSections").and.returnValue({length: 3});
        ctrl.showModal();
    }));
    
    it('showModal without error', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService, ModalService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        spyOn(SectionsMetaService, "getSections").and.returnValue([{
            display_data: false,
            selected: true
        }, {
            display_data: true,
            selected: true
        }]);
        spyOn(ctrl, "getSelectedSections").and.returnValue({length: 3});
        ctrl.showModal();
    }));
    
    it('showModal section with column data', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService, ModalService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        spyOn(SectionsMetaService, "getSections").and.returnValue([{
            selected: true,
            a_data: true,
            columns: [{
                visible: false
            }, {
                visible: true
            }]
        }, {
            selected: true
        }]);
        spyOn(ctrl, "getSelectedSections").and.returnValue({length: 3});
        ctrl.showModal();
    }));
	
	// it('Should have resetViewConfirm', inject(function($rootScope, $controller, ModalService) {
		// var $scope = $rootScope.$new();
		// var ctrl = $controller('DefaultFilterCtrl', {
			// '$scope' : $scope
		// });
		// expect($scope.resetViewConfirm).toEqual(jasmine.any(Function));
		// $scope.modal = ModalService.openModal('/apps/app/partials/alert_box.html', $scope, false, true);
		// spyOn($scope.modal, "close");
		// $scope.resetViewConfirm([{}, {}, {}]);
	// }));
	
	it('Should have hideNavigationModal', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('DefaultFilterCtrl', {
			'$scope' : $scope
		});
		expect($scope.hideNavigationModal).toEqual(jasmine.any(Function));
		$scope.modal =  {
		    close: function() {
		        
		    }
		};
		spyOn($scope.modal, "close");
		$scope.hideNavigationModal();
	}));
	
	it('Should have getValue', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DefaultFilterCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getValue).toEqual(jasmine.any(Function));
        expect(ctrl.getValue('abc')).toEqual(GlobalService.getVal('abc'));
    }));

});

describe('AnalyticsCtrl : ', function() {
	beforeEach(module('gbApp', 'gbApp.controllers.analytics', 'ngCookies', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('getUrl', inject(function($rootScope, $controller, NavigationService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('AnalyticsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getUrl).toEqual(jasmine.any(Function));
		expect(ctrl.getUrl('sectionview')).toEqual(NavigationService.getUrl('sectionview'));
	}));

	it('getError', inject(function($rootScope, $controller, ErrorService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('AnalyticsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getError).toEqual(jasmine.any(Function));
		expect(ctrl.getError()).toEqual(ErrorService.getErrors('analytics'));
	}));
	
	it('renderHtml', inject(function($rootScope, $controller, $sce) {
    	var $scope = $rootScope.$new();
    	var ctrl = $controller('AnalyticsCtrl', {
    	    '$scope' : $scope
    	});
    	spyOn($sce, "trustAsHtml");
    	expect(ctrl.renderHtml).toEqual(jasmine.any(Function));
    	expect(ctrl.renderHtml('abcd')).toEqual($sce.trustAsHtml('abcd'));
	}));
	
	it('isSectionTab', inject(function($rootScope, $controller, $sce, NavigationService) {
    	var $scope = $rootScope.$new();
    	var ctrl = $controller('AnalyticsCtrl', {
    	    '$scope' : $scope
    	});
    	spyOn(NavigationService, "getUrl").and.returnValues('partials/sectionview.html', 'partials/mm.html');
    	expect(ctrl.isSectionTab).toEqual(jasmine.any(Function));
    	ctrl.isSectionTab();
    	ctrl.isSectionTab();
	}));
});

describe('ShowSavedFilters : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp', 'gbApp.controllers.analytics', 'ngCookies', 'ngTable', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', undefined);
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	it('load variables', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ShowSavedFilters', {
			'$scope' : $scope
		});
		expect(ctrl.meta).toBeDefined();
        expect(ctrl.meta['visible']).toBeFalsy();
		expect(ctrl.filterBtn).toBeDefined();
        expect(ctrl.filterBtn).toEqual('all');
		expect(ctrl.inlineSearch).toBeDefined();
        expect(ctrl.inlineSearch).toEqual("");
		expect(ctrl.views).toBeDefined();
        expect(ctrl.views).toEqual([]);
		expect(ctrl.dataNotFound).toBeDefined();
		expect(ctrl.dataNotFound).toBeFalsy();
	}));
	
	it('getCurrentViewName', inject(function($rootScope, $controller, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ShowSavedFilters', {
			'$scope' : $scope
		});
		expect(ctrl.getCurrentViewName).toEqual(jasmine.any(Function));
		spyOn(SectionsMetaService, "getViewName");
		expect(ctrl.getCurrentViewName()).toEqual(SectionsMetaService.getViewName());
		expect(SectionsMetaService.getViewName).toHaveBeenCalled();
	}));

	it('loadSavedViews', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, GlobalService, $cookies) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ShowSavedFilters', {
			'$scope' : $scope
		});
		expect(ctrl.loadSavedViews).toBeDefined();
		expect(ctrl.loadSavedViews).toEqual(jasmine.any(Function));
		$httpBackend.expect('GET', infoserverDomain + '/sectionview/list/' + manufacturer + '/' + product + '/' + schema).respond({
			'Data' : []
		});
		ctrl.meta['visible'] = true;
		ctrl.loadSavedViews();
		$httpBackend.flush();
		expect(ctrl.dataNotFound).toBeTruthy();
		
		$httpBackend.expect('GET', infoserverDomain + '/sectionview/list/' + manufacturer + '/' + product + '/' + schema).respond({
			'Data' : [1, 2, 3]
		});
		ctrl.meta['visible'] = true;
		ctrl.loadSavedViews();
		$httpBackend.flush();
		expect(ctrl.dataNotFound).toBeFalsy();

		$httpBackend.expect('GET', infoserverDomain + '/sectionview/list/' + manufacturer + '/' + product + '/' + schema).respond(500,{});
		ctrl.meta['visible'] = true;
		ctrl.loadSavedViews();
		$httpBackend.flush();
		expect(ctrl.dataNotFound).toBeFalsy();
	}));

	it('loadView with no view', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, $cookies, SectionsMetaService, DefaultFilterService, ModalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ShowSavedFilters', {
            '$scope' : $scope
        });
        expect(ctrl.loadView).toBeDefined();
        expect(ctrl.loadView).toEqual(jasmine.any(Function));
        spyOn(SectionsMetaService, "parseFilters").and.returnValue({});
        spyOn(SectionsMetaService, "applyView");
        spyOn(SectionsMetaService, "setSelectedView");
        spyOn(ModalService, "alertBox");
        var response = {};
        response.Data = "";
        response.Msg = "No Data Found";
        response.Status = "Success";
        DefaultFilterService.setSelectedObservation("dfv");
        
        $httpBackend.expect('GET', infoserverDomain + '/sectionview/meta/' + manufacturer + '/' + product + '/' + schema + '/undefined').respond(response);
                
        ctrl.loadView({});
        $httpBackend.flush();
        
        DefaultFilterService.setSelectedObservation(null);
        ctrl.loadView({});
    }));

	it('deleteView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ShowSavedFilters', {
			'$scope' : $scope
		});
		var selectedView = {};
		expect(ctrl.deleteView).toBeDefined();
		expect(ctrl.deleteView).toEqual(jasmine.any(Function));
		ctrl.deleteView(selectedView);
	}));
	/*
	it('setDefaultView', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ShowSavedFilters', {
            '$scope' : $scope
        });
        spyOn(ctrl, "loadSavedViews");
        expect(ctrl.setDefaultView).toBeDefined();
        expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
        var selectedView = {
            created_by: "uir",
            default: false,
            desc: "sdfsf%20dfdfg%20%27ghghghh%27fghfg%20dfdferdfgdf",
            kbase: "NA",
            public: false,
            view_name: "raja1"};
        var param;
        param = {
            'view_name' : undefined,
            'public' : undefined
        };
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/setdefault/' + manufacturer + '/' + product + '/' + schema + '/raja1').respond([1, 2, 3]);
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Section View/Set Default View').respond({"Status":"Success","Msg":"","Data":""});
        ctrl.setDefaultView(selectedView);
        $httpBackend.flush();
    }));
    
    it('setDefaultView error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ShowSavedFilters', {
            '$scope' : $scope
        });
        spyOn(ctrl, "loadSavedViews");
        expect(ctrl.setDefaultView).toBeDefined();
        expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
        var selectedView = {
            created_by: "uir",
            default: false,
            desc: "sdfsf%20dfdfg%20%27ghghghh%27fghfg%20dfdferdfgdf",
            kbase: "NA",
            public: false,
            view_name: "raja1"};
        var param;
        param = {
            'view_name' : undefined,
            'public' : undefined
        };
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/setdefault/' + manufacturer + '/' + product + '/' + schema + '/raja1').respond(500, {});
        ctrl.setDefaultView(selectedView);
        $httpBackend.flush();
    }));

	it('resetDefaultView', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ShowSavedFilters', {
			'$scope' : $scope
		});
		spyOn(ctrl, "loadSavedViews");
		expect(ctrl.setDefaultView).toBeDefined();
		expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
		var selectedView = {
			created_by: "uir",
			default: true,
			desc: "sdfsf%20dfdfg%20%27ghghghh%27fghfg%20dfdferdfgdf",
			kbase: "NA",
			public: false,
			view_name: "raja1"};
		var param;
		param = {
			'view_name' : undefined,
			'public' : undefined
		};
		$httpBackend.expect('POST', infoserverDomain + '/sectionview/resetdefault/' + manufacturer + '/' + product + '/' + schema + '/raja1').respond([1, 2, 3]);
		$httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Section View/Reset Default View').respond({"Status":"Success","Msg":"","Data":""});
		ctrl.setDefaultView(selectedView);
		$httpBackend.flush();
	}));
	
	it('resetDefaultView error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ShowSavedFilters', {
            '$scope' : $scope
        });
        spyOn(ctrl, "loadSavedViews");
        expect(ctrl.setDefaultView).toBeDefined();
        expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
        var selectedView = {
            created_by: "uir",
            default: true,
            desc: "sdfsf%20dfdfg%20%27ghghghh%27fghfg%20dfdferdfgdf",
            kbase: "NA",
            public: false,
            view_name: "raja1"};
        var param;
        param = {
            'view_name' : undefined,
            'public' : undefined
        };
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/resetdefault/' + manufacturer + '/' + product + '/' + schema + '/raja1').respond(500, {});
        ctrl.setDefaultView(selectedView);
        $httpBackend.flush();
    }));

	it('setAccessibility', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ShowSavedFilters', {
			'$scope' : $scope
		});
		expect(ctrl.setAccessibility).toEqual(jasmine.any(Function));
		spyOn(ctrl, "loadSavedViews");
		var param = {};
		ctrl.setAccessibility(param);
		$httpBackend.expect('POST', infoserverDomain + '/sectionview/setpublic/' + manufacturer + '/' + product + '/' + schema + '/' + (param['public'] == false ? "true" : "false") + '/' + param.view_name).respond({});
		$httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Section View/Set View Public').respond(200);
		$httpBackend.flush();
	}));
	
	it('setAccessibility error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ShowSavedFilters', {
            '$scope' : $scope
        });
        expect(ctrl.setAccessibility).toEqual(jasmine.any(Function));
        spyOn(ctrl, "loadSavedViews");
        var param = {};
        ctrl.setAccessibility(param);
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/setpublic/' + manufacturer + '/' + product + '/' + schema + '/' + (param['public'] == false ? "true" : "false") + '/' + param.view_name).respond(500, {});
        $httpBackend.flush();
    }));
    
    it('setAccessibility error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ShowSavedFilters', {
            '$scope' : $scope
        });
        expect(ctrl.setAccessibility).toEqual(jasmine.any(Function));
        spyOn(ctrl, "loadSavedViews");
        spyOn(ModalService, "sessionTimeout");
        var param = {};
        ctrl.setAccessibility(param);
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/setpublic/' + manufacturer + '/' + product + '/' + schema + '/' + (param['public'] == false ? "true" : "false") + '/' + param.view_name).respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));
*/
	it('filterByScope', inject(function($rootScope, $controller, metaDataService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ShowSavedFilters', {
			'$scope' : $scope
		});
		var view = {
			'created_by' : 'uitest'
		};
		expect(ctrl.filterByScope).toBeDefined();
		expect(ctrl.filterByScope).toEqual(jasmine.any(Function));
		ctrl.filterBtn = 'all';
		expect(ctrl.filterByScope(view)).toBeTruthy();
		ctrl.filterBtn = 'others';
		expect(ctrl.filterByScope(view)).toBeTruthy();
		ctrl.filterBtn = 'my';
		expect(ctrl.filterByScope(view)).toBeFalsy();
		metaDataService.setUser({'email': 'uitest'});
		// $cookies.username = 'uitest';
		expect(ctrl.filterByScope(view)).toBeTruthy();
	}));

	it('getLoggedInUserName', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ShowSavedFilters', {
			'$scope' : $scope
		});
		expect(ctrl.getLoggedInUserName).toBeDefined();
		expect(ctrl.getLoggedInUserName).toEqual(jasmine.any(Function));
		expect(ctrl.getLoggedInUserName()).toBeUndefined();
	}));
});

describe('DeleteViewController : ', function() {
    
    var $modalInstance, manufacturer, product, schema, umsDomain;
    
    beforeEach(module('gbApp', 'gbApp.controllers.analytics', 'ngCookies', 'ngTable', 'gbApp.filters', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('manufacturer', undefined);
        $provide.value('useLocal', undefined);
        $provide.value('product', undefined);
        $provide.value('schema', undefined);
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));
    
    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
    
    it('Should have hideDeleteModal', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteModal': {}
        });
        expect(ctrl.hideDeleteModal).toEqual(jasmine.any(Function));
        ctrl.hideDeleteModal();
    }));
    
    /*it('Should have deleteViewRequest', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteModal': {}
        });
        expect(ctrl.hideDeleteModal).toEqual(jasmine.any(Function));
        ctrl.deleteViewRequest({});
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/delete/' + manufacturer + '/' + product + '/' + schema + '/' + undefined).respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Section View/Delete View').respond(200);
        $httpBackend.flush();
    }));*/
    
    it('Should have deleteViewRequest error block', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteModal': {}
        });
        expect(ctrl.hideDeleteModal).toEqual(jasmine.any(Function));
        ctrl.deleteViewRequest({});
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/delete/' + manufacturer + '/' + product + '/' + schema + '/' + undefined).respond(500, {});
        $httpBackend.flush();
    }));
    
    it('Should have deleteViewRequest error block session timeout', inject(function($rootScope, $controller, ModalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteModal': {}
        });
        spyOn(ModalService, "sessionTimeout");
        expect(ctrl.hideDeleteModal).toEqual(jasmine.any(Function));
        ctrl.deleteViewRequest({});
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/delete/' + manufacturer + '/' + product + '/' + schema + '/' + undefined).respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));
});

describe('SaveFilter : ', function() {
    
    var $modalInstance, manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp', 'gbApp.controllers.analytics', 'ngCookies', 'ngTable', 'gbApp.filters', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('manufacturer', undefined);
		$provide.value('useLocal', undefined);
		$provide.value('product', undefined);
		$provide.value('schema', undefined);
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
		
		$modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
	
	it('Should have getEmptySectionList', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
        expect(ctrl.getEmptySectionList).toEqual(jasmine.any(Function));
        expect(ctrl.getEmptySectionList()).toEqual([]);
    }));
    
    it('Should have updateColumnAttributes', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}, {columns: [{}, {}], name: 'test1'}]}
        });
        expect(ctrl.updateColumnAttributes).toEqual(jasmine.any(Function));
        ctrl.updateColumnAttributes('test1');
        ctrl.updateColumnAttributes('');
    }));
    
    it('Should have checkViewName', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
        spyOn(metaDataService, 'getUser').and.returnValue({email: 'ashwin'});
        ctrl.saveModal.name = 'test';
        $httpBackend.expect('GET', infoserverDomain + '/sectionview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{view_name: 'test', created_by: 'ashwin'}, {view_name: 'test1', created_by: 'other'}]});
        $httpBackend.flush();
        ctrl.form.saveViewModal = {
            viewName: {
                $setValidity: function() {
                    
                }
            }
        };
        spyOn(ctrl.form.saveViewModal.viewName, "$setValidity");
        expect(ctrl.checkViewName).toEqual(jasmine.any(Function));
        ctrl.checkViewName();
        ctrl.saveModal.name = 'test1';
        ctrl.checkViewName();
    }));
    
    it('Should have checkViewName with empty list', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
        spyOn(metaDataService, 'getUser').and.returnValue({email: 'ashwin'});
        ctrl.saveModal.name = 'test';
        $httpBackend.expect('GET', infoserverDomain + '/sectionview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.flush();
        ctrl.form.saveViewModal = {
            viewName: {
                $setValidity: function() {
                    
                }
            }
        };
        spyOn(ctrl.form.saveViewModal.viewName, "$setValidity");
        expect(ctrl.checkViewName).toEqual(jasmine.any(Function));
        ctrl.checkViewName();
        $httpBackend.expect('GET', infoserverDomain + '/sectionview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{view_name: 'test', created_by: 'ashwin'}, {view_name: 'test1', created_by: 'other'}]});
        $httpBackend.flush();
    }));
	
	it('Should have getValue', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
        expect(ctrl.getValue).toEqual(jasmine.any(Function));
        expect(ctrl.getValue('abc')).toEqual(GlobalService.getVal('abc'));
    }));
	
	it('Should have getSelectedSectionsNew', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
        expect(ctrl.getSelectedSectionsNew).toEqual(jasmine.any(Function));
        spyOn(SectionsMetaService, "getSections").and.returnValue([{selected: true, label: 'sec1', a_data: ['abc'], columns: [{visible: true}, {visible: false}]}, {selected: false}, {selected: true, label: 'sec2'}]);
        spyOn(DefaultFilterService, "getDefaultObservation");
        expect(ctrl.getSelectedSectionsNew()).toEqual([ { selected: true, label: 'sec1', a_data: [ 'abc' ], columns: [ { visible: true }, { visible: false } ] } ]);
        expect(DefaultFilterService.getDefaultObservation).toHaveBeenCalled();
        expect(SectionsMetaService.getSections).toHaveBeenCalledWith(DefaultFilterService.getDefaultObservation());
    }));

	it('hideModal', inject(function($rootScope, $controller, SectionsMetaService, ModalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
		expect(ctrl.hideModal).toBeDefined();
		expect(ctrl.hideModal).toEqual(jasmine.any(Function));
		ctrl.hideModal();
	}));

	it('saveFilter', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
		expect(ctrl.saveFilter).toBeDefined();
		expect(ctrl.saveFilter).toEqual(jasmine.any(Function));
		ctrl.form = {
			saveViewModal: {
				$valid: false
			}
		};
		expect(ctrl.saveFilter()).toBeUndefined();
		ctrl.form.saveViewModal.$valid = true;
		DefaultFilterService.setDefaultObservation({obs_time: '2005-12-23T12:32:41Z'});
		SectionsMetaService.setSections({obs_time: '2005-12-23T12:32:41Z'}, [{selected: true, a_data: true, name: 'section1', columns: [{visible: true, field: 'unit1', filter: {value: 'xyz'}}, {visible: true, field: 'unit2'}]}, {selected: true, a_data: true, name: 'section2', columns: [{visible: true, field: 'unit3', filter: {value: 'abc'}}, {visible: true, field: 'unit4'}]}]);
		ctrl.saveFilter();
	}));
	
	/*it('saveFilter with API call', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService, $httpBackend, infoserverDomain, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
        expect(ctrl.saveFilter).toBeDefined();
        expect(ctrl.saveFilter).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                $valid: false
            }
        };
        expect(ctrl.saveFilter()).toBeUndefined();
        ctrl.form.saveViewModal.$valid = true;
        DefaultFilterService.setDefaultObservation({obs_time: '2005-12-23T12:32:41Z'});
        SectionsMetaService.setSections({obs_time: '2005-12-23T12:32:41Z'}, [{selected: true, a_data: true, name: 'section1', columns: [{visible: true, field: 'unit1', filter: {value: 'xyz'}}, {visible: true, field: 'unit2'}]}, {selected: true, a_data: true, name: 'section2', columns: [{visible: true, field: 'unit3', filter: {value: 'abc'}}, {visible: true, field: 'unit4'}]}]);
        ctrl.saveFilter();
        var param = {
            public: false,
            default: false
        };
        $httpBackend.expect('GET', infoserverDomain + '/sectionview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/add/' + manufacturer + '/' + product + '/' + schema + '/' + param['public'] + "/" + param.name + "/" + param['default']).respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Section View/Save View').respond(200);
        $httpBackend.flush();
    }));*/
    
    it('saveFilter with API call error block', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService, $httpBackend, infoserverDomain, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
        expect(ctrl.saveFilter).toBeDefined();
        expect(ctrl.saveFilter).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                $valid: false
            }
        };
        expect(ctrl.saveFilter()).toBeUndefined();
        ctrl.form.saveViewModal.$valid = true;
        DefaultFilterService.setDefaultObservation({obs_time: '2005-12-23T12:32:41Z'});
        SectionsMetaService.setSections({obs_time: '2005-12-23T12:32:41Z'}, [{selected: true, a_data: true, name: 'section1', columns: [{visible: true, field: 'unit1', filter: {value: 'xyz'}}, {visible: true, field: 'unit2'}]}, {selected: true, a_data: true, name: 'section2', columns: [{visible: true, field: 'unit3', filter: {value: 'abc'}}, {visible: true, field: 'unit4'}]}]);
        ctrl.saveFilter();
        var param = {
            public: false,
            default: false
        };
        $httpBackend.expect('GET', infoserverDomain + '/sectionview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/add/' + manufacturer + '/' + product + '/' + schema + '/' + param['public'] + "/" + param.name + "/" + param['default']).respond(500);
        $httpBackend.flush();
    }));
    
    it('saveFilter with API call error block session timeout', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService, $httpBackend, infoserverDomain, metaDataService, ModalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
        expect(ctrl.saveFilter).toBeDefined();
        expect(ctrl.saveFilter).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                $valid: false
            }
        };
        expect(ctrl.saveFilter()).toBeUndefined();
        ctrl.form.saveViewModal.$valid = true;
        DefaultFilterService.setDefaultObservation({obs_time: '2005-12-23T12:32:41Z'});
        SectionsMetaService.setSections({obs_time: '2005-12-23T12:32:41Z'}, [{selected: true, a_data: true, name: 'section1', columns: [{visible: true, field: 'unit1', filter: {value: 'xyz'}}, {visible: true, field: 'unit2'}]}, {selected: true, a_data: true, name: 'section2', columns: [{visible: true, field: 'unit3', filter: {value: 'abc'}}, {visible: true, field: 'unit4'}]}]);
        ctrl.saveFilter();
        var param = {
            public: false,
            default: false
        };
        spyOn(ModalService, "sessionTimeout");
        $httpBackend.expect('GET', infoserverDomain + '/sectionview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.expect('POST', infoserverDomain + '/sectionview/add/' + manufacturer + '/' + product + '/' + schema + '/' + param['public'] + "/" + param.name + "/" + param['default']).respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));

	it('kbaseOnFocus', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SaveFilter', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
        });
		expect(ctrl.kbaseOnFocus).toBeDefined();
		expect(ctrl.kbaseOnFocus).toEqual(jasmine.any(Function));
		ctrl.saveModal.kbase = '';
		ctrl.kbaseOnFocus();
		expect(ctrl.saveModal.kbase).toEqual('http://');
		ctrl.saveModal.kbase = "http://glassbeam.com";
		ctrl.kbaseOnFocus();
		expect(ctrl.saveModal.kbase).toEqual('http://glassbeam.com');
	}));

	it('kbaseOnBlur', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('SaveFilter', {
			'$scope' : $scope,
			'$modalInstance': $modalInstance,
			'items': {allSectionsDetails: [{columns: [], name: 'test'}]}
		});
		expect(ctrl.kbaseOnFocus).toBeDefined();
		expect(ctrl.kbaseOnFocus).toEqual(jasmine.any(Function));
		ctrl.saveModal.kbase = 'http://';
		ctrl.kbaseOnBlur();
		expect(ctrl.saveModal.kbase).toEqual('');
		ctrl.saveModal.kbase = "http://glassbeam.com";
		ctrl.kbaseOnBlur();
		expect(ctrl.saveModal.kbase).toEqual('http://glassbeam.com');
	}));
});

describe('LogiCtrl : ', function() {
	beforeEach(module('gbApp', 'gbApp.controllers.analytics'));
	it('sceURL', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('LogiCtrl', {
			'$scope' : $scope
		});
		expect($scope.sceURL('xyz')).toEqual(jasmine.any(Object));
	}));
});

describe('ConfigCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp.services.explorer', 'gbApp.controllers.analytics', 'ngCookies', 'ngTable', 'angularFileUpload', 'gbApp.controllers.dashboards', 'gbApp.services.dashboards', 'gbApp.services.workbench', 'gbApp.filters', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
		umsDomain = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
        var retDate = new Date(Date.UTC(2015, 2, 12, 22, 45, 23, 45));
        jasmine.clock().mockDate(retDate);
    }));
	
	/*it('$watch ctrl.resultLoading', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        ctrl.resultLoading = false;
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond({
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        $scope.$digest();
        
        ctrl.resultLoading = true;
        $scope.$digest();
    }));*/
    
    it('receive AppLoadEvent-apps', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        ctrl.resultLoading = false;
        $rootScope.$broadcast('AppLoadEvent-apps');
    }));
    
    it('should have showSysid2DD', inject(function($rootScope, $controller, GlobalService, $httpBackend, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        spyOn(metaDataService, "isSysid2Enable");
        expect(ctrl.showSysid2DD).toEqual(jasmine.any(Function));
        ctrl.showSysid2DD();
    }));
    
    it('should have getCurrentViewName', inject(function($rootScope, $controller, GlobalService, $httpBackend, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        //spyOn(metaDataService, "isSysid2Enable");
        expect(ctrl.getCurrentViewName).toEqual(jasmine.any(Function));
        ctrl.getCurrentViewName();
    }));
    
    it('should have getSysId2Tooltip', inject(function($rootScope, $controller, GlobalService, $httpBackend, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        //spyOn(metaDataService, "isSysid2Enable");
        expect(ctrl.getSysId2Tooltip).toEqual(jasmine.any(Function));
        ctrl.getSysId2Tooltip();
    }));
    
    it('should have getSysId2', inject(function($rootScope, $controller, GlobalService, $httpBackend, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        //spyOn(metaDataService, "isSysid2Enable");
        expect(ctrl.getSysId2).toEqual(jasmine.any(Function));
        ctrl.getSysId2();
    }));
    
    it('should have getSysId2List', inject(function($rootScope, $controller, GlobalService, $httpBackend, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        //spyOn(metaDataService, "isSysid2Enable");
        expect(ctrl.getSysId2List).toEqual(jasmine.any(Function));
        ctrl.getSysId2List();
    }));
    
    it('should have changeSubSysId:selected', inject(function($rootScope, $controller, GlobalService, $httpBackend, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        spyOn(ConfigDiffService, "getSysId2").and.returnValue('abc');
        spyOn(ConfigDiffService, "getSections").and.returnValue([{'selected': true}]);
        spyOn(ConfigDiffService, "loadData");
        spyOn(ConfigDiffService, "setSections");
        expect(ctrl.changeSubSysId).toEqual(jasmine.any(Function));
        ctrl.changeSubSysId('abc');
        ctrl.changeSubSysId('xyz');
    }));
    
    it('should have changeSubSysId:unselected', inject(function($rootScope, $controller, GlobalService, $httpBackend, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        spyOn(ConfigDiffService, "getSysId2").and.returnValue('abc');
        spyOn(ConfigDiffService, "getSections").and.returnValue([{'default':true, 'selected': true, 'label': 'abc'}]);
        spyOn(ConfigDiffService, "loadData");
        spyOn(ConfigDiffService, "setSections");
        expect(ctrl.changeSubSysId).toEqual(jasmine.any(Function));
        ctrl.changeSubSysId('abc');
        ctrl.changeSubSysId('xyz');
    }));
    
    it('should have loadDefaultView', inject(function($rootScope, $controller, GlobalService, $httpBackend, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        //spyOn(metaDataService, "isSysid2Enable");
        expect(ctrl.loadDefaultView).toEqual(jasmine.any(Function));
        ctrl.loadDefaultView({},{});
    }));
    
    it('should have exportAllPDF', inject(function($rootScope, $controller, GlobalService, $httpBackend, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        //spyOn(metaDataService, "isSysid2Enable");
        ConfigDiffService.setSections([{'selected': true}, {'selected': true, 'data': [{}]}]);
        expect(ctrl.exportAllPDF).toEqual(jasmine.any(Function));
        ctrl.exportAllPDF();
    }));
    
    it('should have toggleGoldenConfigData', inject(function($rootScope, $controller, GlobalService, $httpBackend, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        //spyOn(metaDataService, "isSysid2Enable");
        //ConfigDiffService.setSections([{'selected': true}, {'selected': true, 'data': [{}]}]);
        expect(ctrl.toggleGoldenConfigData).toEqual(jasmine.any(Function));
        ctrl.toggleGoldenConfigData();
    })); 
    
    it('should have clearGoldenConfigData', inject(function($rootScope, $controller, GlobalService, $httpBackend, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        //spyOn(metaDataService, "isSysid2Enable");
        ConfigDiffService.setSections([{'selected': true, 'default' : true}, {'selected': true, 'data': [{}], 'default' : true}]);
        expect(ctrl.clearGoldenConfigData).toEqual(jasmine.any(Function));
        ctrl.clearGoldenConfigData();
    })); 
    
    it('should have generateRuleLogic', inject(function($rootScope, $controller, GlobalService, ExplorerService, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        spyOn(ExplorerService, "setRuleSection");
        spyOn(ExplorerService, "getRuleText");
        spyOn(ExplorerService, "setRuleText");
        ConfigDiffService.setSections([{'selected': true, 'default' : true}, {'selected': true, 'data': [{}], 'default' : true}]);
        expect(ctrl.generateRuleLogic).toEqual(jasmine.any(Function));
        ctrl.generateRuleLogic({'columnDesc':{'abc':'STRING'}},{'key':'abc'});
        ctrl.generateRuleLogic({'columnDesc':{'abc':'INTEGER'}},{'key':'abc'});
    })); 
    
    /*it('Should have ec sys session timeout', inject(function($rootScope, $controller, GlobalService, DefaultFilterService, UtilService, ModalService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        var retDate = new Date(2015, 2, 12, 22, 45, 23, 45);
        // jasmine.clock().mockDate(retDate);
        spyOn(UtilService, "parseDate");
        spyOn(ModalService, "sessionTimeout");
        DefaultFilterService.setDefaultSysId({sys_id: 'unit'});
        DefaultFilterService.setSelectedObsGrp('Most Recent');
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));*/
	
	it('getValue', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getValue('max_views_msg')).toEqual(GlobalService.getVal('max_views_msg'));
    }));
    
    it('hasFilter', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        ctrl.hasFilter({});
        var section = {
            filter: {
                unit: {
                    value: 'text'
                }
            }
        };
        ctrl.hasFilter(section);
    }));
    
    it('resetFilter', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        ctrl.resetFilter({});
        var section = {
            filter: {
                unit: {
                    value: 'text'
                }
            }
        };
        ctrl.resetFilter(section);
        ctrl.info.currentViewName = 'test';
        ctrl.resetFilter(section);
    }));
	
	it('Should have moveThroughSysId', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		spyOn(ctrl, "resetMoveThroughSysId");
		spyOn(ctrl, "changeSysId");
		ctrl.info = {
			defaultEndCust: {
				sys_ids: [{}, {}]
			}
		};
		ctrl.info.sysIdIndex = -1;
		var ev = {keyCode: 38};
		ctrl.moveThroughSysId(ev);
		ctrl.info.sysIdIndex = 1;
		ctrl.moveThroughSysId(ev);
		ev.keyCode = 40;
		ctrl.moveThroughSysId(ev);
		ctrl.moveThroughSysId(ev);
		ev.keyCode = 14;
		ctrl.moveThroughSysId(ev);
		ctrl.sysfilter = {
			sys_id: "bc"
		};
		ctrl.moveThroughSysId(ev);
	}));
	
	it('Should have resetMoveThroughSysId', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		ctrl.info = {
			defaultEndCust: {
				sys_ids: [{}, {}]
			}
		};
		ctrl.resetMoveThroughSysId();
	}));
	
	it('Should have getSectionsLoading', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getSectionsLoading()).toEqual(ConfigDiffService.getSectionLoading());
    }));
	
	it('Should have selectObsGroup', inject(function($rootScope, $controller, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.selectObsGroup).toEqual(jasmine.any(Function));
		spyOn(DefaultFilterService, "setSelectedObsGrp");
		ctrl.selectObsGroup('mostrecent');
	}));
	
	it('getSections', inject(function($rootScope, $controller, ConfigDiffService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getSections).toBeDefined();
		expect(ctrl.getSections).toEqual(jasmine.any(Function));
		expect(ctrl.getSections()).toEqual(jasmine.any(Array));
		ConfigDiffService.setSections([1, 2, 3]);
		expect(ctrl.getSections()).toEqual([1, 2, 3]);
	}));
	
	it('changeShownAll', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.changeShownAll).toBeDefined();
		expect(ctrl.changeShownAll).toEqual(jasmine.any(Function));
		var section = {
			unit_test1: {
				
			},
			unit_test2: {
				
			},
			keys: {
				unit_test1: {
					visible: true
				},
				unit_test2: {
					visible: false
				}
			}
		};
		ctrl.changeShownAll(section);
		expect(section).toEqual({ unit_test1: {  }, unit_test2: {  }, keys: { unit_test1: { visible: true }, unit_test2: { visible: false } }, shownAll: false, no_cols: false });
        ctrl.info.currentViewName = 'test';
        ctrl.changeShownAll(section);
	}));
	
	it('removeSection', inject(function($rootScope, $controller, UserTrackingService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.removeSection).toBeDefined();
		expect(ctrl.removeSection).toEqual(jasmine.any(Function));
		var section = {
			name: 'unitTest',
			unit_test1: {
				
			},
			unit_test2: {
				
			},
			keys: {
				unit_test1: {
					visible: true
				},
				unit_test2: {
					visible: false
				}
			}
		};
		ctrl.removeSection(section);
		ctrl.info.currentViewName = 'test';
		ctrl.removeSection(section);
	}));
	
	it('toggleAll', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.toggleAll).toBeDefined();
		expect(ctrl.toggleAll).toEqual(jasmine.any(Function));
		var section = {
			name: 'unitTest',
			unit_test1: {
				
			},
			unit_test2: {
				
			},
			keys: {
				unit_test1: {
					visible: true
				},
				unit_test2: {
					visible: false
				}
			}
		};
		ctrl.toggleAll(section);
		expect(section.no_cols).toBeTruthy();
		section.shownAll = true;
		ctrl.toggleAll(section);
		expect(section.no_cols).toBeFalsy();
		ctrl.info.currentViewName = 'test';
		ctrl.toggleAll(section);
	}));
	
	it('getKbLink', inject(function($rootScope, $controller, ConfigDiffService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getKbLink).toBeDefined();
		expect(ctrl.getKbLink).toEqual(jasmine.any(Function));
		expect(ctrl.getKbLink()).toEqual(ConfigDiffService.getKbLink());
	}));
	
	it('cancel', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.cancel).toBeDefined();
		expect(ctrl.cancel).toEqual(jasmine.any(Function));
		ctrl.cancel();
		expect(ctrl.visible).toBeFalsy();
	}));

	it('done', inject(function($rootScope, $controller, ConfigDiffService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.done).toBeDefined();
		expect(ctrl.done).toEqual(jasmine.any(Function));
		ctrl.info = {
			defaultEndCust: null,
			defaultSysId: null,
			defaultObservation: null
		};
		spyOn(ConfigDiffService, 'getSections').and.returnValue([{selected: false}, {selected: true, default: true, label: 'label1'}, {selected: true, default: true, label: 'label2'}, {selected: false, default: true, label: 'label3'}, {selected: true, default: false, label: 'label4'}]);
		ctrl.done('');
		expect(ctrl.visible).toBeFalsy();
		ctrl.info = {
			defaultEndCust: 'null',
			defaultSysId: 'null',
			defaultObservation: 'null'
		};
		ctrl.done('');
		expect(ConfigDiffService.getSections).toHaveBeenCalled();
		expect(ctrl.visible).toBeFalsy();
		ctrl.info = {
			defaultEndCust: null,
			defaultSysId: null,
			defaultObservation: 'null'
		};
		ConfigDiffService.setSections({section1: {selected: true}, section2: {selected: false}});
		ctrl.done('');
		ctrl.info['defaultObservation'] = null;
	}));
	
	it('incObsCount', inject(function($rootScope, $controller, ConfigDiffService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.incObsCount).toBeDefined();
		expect(ctrl.incObsCount).toEqual(jasmine.any(Function));
		var section = {
			name: 'unitTest',
			unit_test1: {
				
			},
			unit_test2: {
				
			},
			keys: {
				unit_test1: {
					visible: true
				},
				unit_test2: {
					visible: false
				}
			},
			count: 2
		};
		ctrl.info = {
			max_obs_limit: 10
		};
		spyOn(ConfigDiffService, "loadData");
		ctrl.incObsCount(section);
		expect(ConfigDiffService.loadData).toHaveBeenCalledWith(section, $scope, ctrl.info['defaultEndCust'], ctrl.info['defaultSysId'], ctrl.info['defaultObservation']);
	}));
	
	it('decObsCount', inject(function($rootScope, $controller, ConfigDiffService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.decObsCount).toBeDefined();
		expect(ctrl.decObsCount).toEqual(jasmine.any(Function));
		var section = {
			count: 10
		};
		ctrl.info = {
			min_obs_limit: 5
		};
		spyOn(ConfigDiffService, "loadData");
		ctrl.decObsCount(section);
		expect(ConfigDiffService.loadData).toHaveBeenCalledWith(section, $scope, ctrl.info['defaultEndCust'], ctrl.info['defaultSysId'], ctrl.info['defaultObservation']);
	}));
	
	it('Should have setRecentObservation', inject(function($rootScope, $controller, UtilService, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect($scope.showSectionDiff).toEqual(jasmine.any(Function));
		ctrl.info = {
			defaultSysId: {
				observations: [{
					obs_time: "July 21, 1983 01:15:00",
					bundle_name: 'bundle1'
				}, {
					obs_time: "September 23, 1973 03:45:00",
                    bundle_name: 'bundle2'
				}, {
					obs_time: "January 11, 2003 05:25:00",
                    bundle_name: 'bundle3'
				}]
			},
			defaultObservation: {
				obs_time: "September 23, 1953 03:45:00"
			}
		};
		$scope.showSectionDiff({name: 'unit'});
	}));

	it('changeEndCust', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.changeEndCust).toBeDefined();
		expect(ctrl.changeEndCust).toEqual(jasmine.any(Function));
		ctrl.changeEndCust();
		expect(ctrl.info['defaultSysId']).toBeNull();
		expect(ctrl.info['defaultObservation']).toBeNull();
	}));

	it('changeSysId', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.changeSysId).toBeDefined();
		expect(ctrl.changeSysId).toEqual(jasmine.any(Function));
		ctrl.info['defaultEndCust'] = {
			ec_name : 'aruba'
		};
		ctrl.info['defaultSysId'] = {
			observations : []
		};
		ctrl.changeSysId();
		expect(ctrl.info['defaultObservation']).toBeNull();
	}));
	
	/*it('changeSysId with get observations', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.changeSysId).toBeDefined();
        expect(ctrl.changeSysId).toEqual(jasmine.any(Function));
        ctrl.info['defaultEndCust'] = {
            ec_name : 'aruba'
        };
        ctrl.info['defaultSysId'] = {
            lastNObservations  : [],
        };
        ctrl.sysfilter = {};
        ctrl.changeSysId();
        var retDate = new Date(2015, 2, 12, 22, 45, 23, 45);
        // jasmine.clock().mockDate(retDate);
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('GET', infoserverDomain + '/bundles/all/' + manufacturer + '/' + product + '/' + schema + '/aruba/undefined?orderby=obs_ts DESC&limit=1').respond({Data: [{}, {}]});
        $httpBackend.expect('GET', infoserverDomain + '/bundles/time_range/' + manufacturer + '/' + product + '/' + schema + '/aruba/undefined/2015-3-1T0:0:0Z/2015-3-12T22:45:23Z').respond({Data: [{bundle_name: 'unit'}]});
        $httpBackend.expect('GET', infoserverDomain + '/bundles/time_range/' + manufacturer + '/' + product + '/' + schema + '/aruba/undefined/2015-3-9T0:0:0Z/2015-3-12T22:45:23Z').respond({Data: [{bundle_name: 'unit'}, {bundle_name: 'unit1'}]});
        $httpBackend.expect('GET', infoserverDomain + '/bundles/time_range/' + manufacturer + '/' + product + '/' + schema + '/aruba/undefined/2015-3-10T0:0:0Z/2015-3-12T22:45:23Z').respond({Data: []});
        $httpBackend.flush();
    }));
	
	it('changeSysId with last n observations', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.changeSysId).toBeDefined();
        expect(ctrl.changeSysId).toEqual(jasmine.any(Function));
        ctrl.info['defaultEndCust'] = {
            ec_name : 'aruba'
        };
        ctrl.info['defaultSysId'] = {
            observations : []
        };
        ctrl.changeSysId();
        var retDate = new Date(2015, 2, 12, 22, 45, 23, 45);
        // jasmine.clock().mockDate(retDate);
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('GET', infoserverDomain + '/bundles/last_n/' + manufacturer + '/' + product + '/' + schema + '/aruba/undefined/10').respond({Data: [{}, {}]});
        $httpBackend.flush();
    }));*/
	
	it('Should have setDefaultObservation', inject(function($rootScope, $controller, SectionsMetaService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.setDefaultObservation).toEqual(jasmine.any(Function));
		spyOn(SectionsMetaService, "getAppliedView").and.returnValue(null);
		ctrl.setDefaultObservation({});
	}));
	
	it('Should have getObservations', inject(function($rootScope, $controller, SectionsMetaService, DefaultFilterService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getObservations).toEqual(jasmine.any(Function));
		ctrl.getObservations('10');
		ctrl.getObservations();
	}));
	
	it('Should have getMostRecentObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getObservations).toEqual(jasmine.any(Function));
        ctrl.info = {
            defaultSysId: {
                lastNObservations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        ctrl.getObservations('Most Recent');
    }));
    
    it('Should have getLastHourObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getObservations).toEqual(jasmine.any(Function));
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('Last Hour');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        var today = new Date();
        var next_day = today.setFullYear(today.getFullYear() + 1);
        spyOn(UtilService, "parseDate").and.returnValue(next_day);
        ctrl.getObservations('Last Hour');
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
    
    it('Should have getLast12HourObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getObservations).toEqual(jasmine.any(Function));
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('Last 12 Hour');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        var today = new Date();
        var next_day = today.setFullYear(today.getFullYear() + 1);
        spyOn(UtilService, "parseDate").and.returnValue(next_day);
        ctrl.getObservations('Last 12 Hour');
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
    
    it('Should have getYesterdayObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getObservations).toEqual(jasmine.any(Function));
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('Yesterday');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        var today = new Date();
        var next_day = today.setFullYear(today.getFullYear() + 1);
        spyOn(UtilService, "parseDate").and.returnValue(next_day);
        ctrl.getObservations('Yesterday');
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
    
    it('Should have getLast2DaysObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getObservations).toEqual(jasmine.any(Function));
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('Last 2 Days');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "July 21, 1983 01:15:00"
                }, {
                    obs_time: "September 23, 1973 03:45:00"
                }, {
                    obs_time: "January 11, 2003 05:25:00"
                }]
            }
        };
        var today = new Date();
        var next_day = today.setFullYear(today.getFullYear() + 1);
        spyOn(UtilService, "parseDate").and.returnValue(next_day);
        ctrl.getObservations('Last 2 Days');
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
    
    it('Should have getThisWeekObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getObservations).toEqual(jasmine.any(Function));
        $scope.info = {
            defaultSysId: null
        };
        ctrl.getObservations('This Week');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        var today = new Date();
        spyOn(UtilService, "parseDate").and.returnValue(today);
        ctrl.getObservations('This Week');
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
	
	it('Should have getThisMonthObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getObservations).toEqual(jasmine.any(Function));
        ctrl.info = {
            defaultSysId: null
        };
        ctrl.getObservations('This Month');
        ctrl.info = {
            defaultSysId: {
                observations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        var today = new Date();
        spyOn(UtilService, "parseDate").and.returnValue(today);
        ctrl.getObservations('This Month');
        expect(UtilService.parseDate).toHaveBeenCalled();
    }));
    
    it('Should have getLastNObservations', inject(function($rootScope, $controller, UtilService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getObservations).toEqual(jasmine.any(Function));
        ctrl.info = {
            defaultSysId: {
                lastNObservations: [{
                    obs_time: "21-07-2001T01:15:00Z"
                }, {
                    obs_time: "23-09-1973T03:45:00Z"
                }, {
                    obs_time: "11-01-2001T05:25:00Z"
                }]
            }
        };
        ctrl.getObservations('Last N');
    }));
	
	it('showSaveViewModal', inject(function($rootScope, $controller, ConfigDiffService, GlobalService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.showSaveViewModal).toBeDefined();
		expect(ctrl.showSaveViewModal).toEqual(jasmine.any(Function));
		spyOn(ConfigDiffService, "getViewsCount").and.returnValue(3);
		GlobalService.setVal('max_views_limit', 4);
		ctrl.showSaveViewModal();
	}));
	
	it('showSaveViewModal with views count exceeded', inject(function($rootScope, $controller, ConfigDiffService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.showSaveViewModal).toBeDefined();
        expect(ctrl.showSaveViewModal).toEqual(jasmine.any(Function));
        spyOn(ConfigDiffService, "getViewsCount").and.returnValue(4);
        GlobalService.setVal('max_views_limit', 4);
        ctrl.showSaveViewModal();
    }));
    
    it('showSaveViewModal with no section column selected', inject(function($rootScope, $controller, ConfigDiffService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.showSaveViewModal).toBeDefined();
        expect(ctrl.showSaveViewModal).toEqual(jasmine.any(Function));
        spyOn(ConfigDiffService, "getViewsCount").and.returnValue(3);
        spyOn(ConfigDiffService, "getSections").and.returnValue([{'selected': true, 'data': {a: {visible: false}}}, {'selected': true, 'data': {a: {visible: false}}}]);
        GlobalService.setVal('max_views_limit', 4);
        ctrl.showSaveViewModal();
    }));
    
    it('showSaveViewModal with section column selected', inject(function($rootScope, $controller, ConfigDiffService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.showSaveViewModal).toBeDefined();
        expect(ctrl.showSaveViewModal).toEqual(jasmine.any(Function));
        spyOn(ConfigDiffService, "getViewsCount").and.returnValue(3);
        spyOn(ConfigDiffService, "getSections").and.returnValue([{'selected': true, 'data': { a: 'test'}, keys: [{visible: true}]}, {'selected': true}]);
        GlobalService.setVal('max_views_limit', 4);
        ctrl.showSaveViewModal();
    }));
    
    it('showSaveViewModal with sections having no data', inject(function($rootScope, $controller, ConfigDiffService, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.showSaveViewModal).toBeDefined();
        expect(ctrl.showSaveViewModal).toEqual(jasmine.any(Function));
        spyOn(ConfigDiffService, "getViewsCount").and.returnValue(3);
        spyOn(ConfigDiffService, "getSections").and.returnValue([{'selected': true}, {'selected': true}]);
        GlobalService.setVal('max_views_limit', 4);
        ctrl.showSaveViewModal();
    }));

	it('getSavedViews', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getSavedViews).toBeDefined();
		expect(ctrl.getSavedViews).toEqual(jasmine.any(Function));
		ctrl.getSavedViews();
		expect(ctrl.views).toBeDefined();
		expect(ctrl.v_loading).toBeTruthy();
	}));
	
	/*it('getSavedViews with API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getSavedViews).toBeDefined();
        expect(ctrl.getSavedViews).toEqual(jasmine.any(Function));
        ctrl.getSavedViews();
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond({Data: []});
        $httpBackend.flush();
    }));
    
    it('getSavedViews with API call error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.getSavedViews).toBeDefined();
        expect(ctrl.getSavedViews).toEqual(jasmine.any(Function));
        ctrl.getSavedViews();
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.flush();
    }));*/

	it('filterByScope', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		spyOn(ctrl, "getLoggedInUserName").and.returnValue('test');
		expect(ctrl.filterByScope).toBeDefined();
		expect(ctrl.filterByScope).toEqual(jasmine.any(Function));
		ctrl.info.filterBtn = 'all';
		expect(ctrl.filterByScope()).toBeTruthy();
		ctrl.info.filterBtn = 'my';
		expect(ctrl.filterByScope({created_by: 'test'})).toBeTruthy();
		ctrl.info.filterBtn = 'others';
		expect(ctrl.filterByScope({created_by: 'ashwin'})).toBeTruthy();
		ctrl.info.filterBtn = 'xyz';
        expect(ctrl.filterByScope({created_by: 'ashwin'})).toBeFalsy();
	}));

	it('getLoggedInUserName', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getLoggedInUserName).toBeDefined();
		expect(ctrl.getLoggedInUserName).toEqual(jasmine.any(Function));
		expect(ctrl.getLoggedInUserName()).toBeUndefined();
	}));

	it('setDefaultView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new(), view = {};
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.setDefaultView).toBeDefined();
		expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
		ctrl.setDefaultView(view);
		expect(view).toEqual({
			inProgress : true
		});
	}));
	
	/*it('setDefaultView with API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new(), view = {};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        ctrl.views = [{}, {}];
        expect(ctrl.setDefaultView).toBeDefined();
        expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
        ctrl.setDefaultView(view);
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('POST', infoserverDomain + '/configview/setdefault/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond({Status: 'Success'});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Config Diff/Set Default View').respond({Msg: ''});
        $httpBackend.flush();
    }));
    
    it('setDefaultView with API call error block', inject(function($rootScope, $controller, $httpBackend, ModalService, infoserverDomain) {
        var $scope = $rootScope.$new(), view = {};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        ctrl.views = [{}, {}];
        spyOn(ModalService, "alertBox");
        expect(ctrl.setDefaultView).toBeDefined();
        expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
        ctrl.setDefaultView(view);
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('POST', infoserverDomain + '/configview/setdefault/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond(500, {Msg: ''});
        $httpBackend.flush();
    }));*/
    
    /*it('resetDefaultView with API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new(), view = {default: true};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        ctrl.views = [{}, {}];
        expect(ctrl.setDefaultView).toBeDefined();
        expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
        ctrl.setDefaultView(view);
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('POST', infoserverDomain + '/configview/resetdefault/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond({Status: 'Success'});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Config Diff/Reset Default View').respond({Msg: ''});
        $httpBackend.flush();
    }));
    
    it('resetDefaultView with API call error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new(), view = {default: true};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        ctrl.views = [{}, {}];
        expect(ctrl.setDefaultView).toBeDefined();
        expect(ctrl.setDefaultView).toEqual(jasmine.any(Function));
        ctrl.setDefaultView(view);
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('POST', infoserverDomain + '/configview/resetdefault/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond(500, {Status: 'Success'});
        $httpBackend.flush();
    }));*/

	it('showDeleteView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new(), view = {};
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.showDeleteView).toBeDefined();
		expect(ctrl.showDeleteView).toEqual(jasmine.any(Function));
		ctrl.showDeleteView(view);
	}));

	it('setAccessibility', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new(), view = {};
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.setAccessibility).toBeDefined();
		expect(ctrl.setAccessibility).toEqual(jasmine.any(Function));
		ctrl.setAccessibility(view);
		expect(view.accessProgress).toBeTruthy();
		expect(view['public']).toBeTruthy();
		ctrl.setAccessibility(view);
		expect(view['public']).toBeFalsy();
	}));
	
	/*it('setAccessibility with API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new(), view = {};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.setAccessibility).toBeDefined();
        expect(ctrl.setAccessibility).toEqual(jasmine.any(Function));
        ctrl.setAccessibility(view);
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('POST', infoserverDomain + '/configview/setpublic/' + manufacturer + '/' + product + '/' + schema + '/' + view['public'] + '/' + view.view_name).respond({Status: 'Failure'});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Config Diff/Set View Private').respond({Msg: ''});
        $httpBackend.flush();
    }));
    
    it('setAccessibility with API call error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new(), view = {};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.setAccessibility).toBeDefined();
        expect(ctrl.setAccessibility).toEqual(jasmine.any(Function));
        ctrl.setAccessibility(view);
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('POST', infoserverDomain + '/configview/setpublic/' + manufacturer + '/' + product + '/' + schema + '/' + view['public'] + '/' + view.view_name).respond(500, {Status: 'Failure'});
        $httpBackend.flush();
    }));

	it('loadView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new(), view = {};
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.loadView).toBeDefined();
		expect(ctrl.loadView).toEqual(jasmine.any(Function));
		ctrl.loadView({});
	}));
	
	it('loadView with API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, DefaultFilterService, ConfigDiffService) {
        var $scope = $rootScope.$new(), view = {view_name: 'undefined'};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.loadView).toBeDefined();
        expect(ctrl.loadView).toEqual(jasmine.any(Function));
        spyOn(DefaultFilterService, "getSelectedObservation").and.returnValue(true);
        spyOn(ConfigDiffService, "applyView");
        ctrl.loadView({});
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('GET', infoserverDomain + '/configview/meta/' + manufacturer + '/' + product + '/' + schema + "/" + view.view_name).respond({Data: [view]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Config Diff/Apply View').respond({Msg: ''});
        $httpBackend.flush();
    }));
    
    it('loadView with API call with no data', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, DefaultFilterService, ModalService) {
        var $scope = $rootScope.$new(), view = {view_name: 'undefined'};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.loadView).toBeDefined();
        expect(ctrl.loadView).toEqual(jasmine.any(Function));
        spyOn(DefaultFilterService, "getSelectedObservation").and.returnValue(true);
        spyOn(ModalService, "alertBox");
        ctrl.loadView({});
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('GET', infoserverDomain + '/configview/meta/' + manufacturer + '/' + product + '/' + schema + "/" + view.view_name).respond({Data: []});
        $httpBackend.flush();
    }));
    
    it('loadView with API call error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, DefaultFilterService, ModalService) {
        var $scope = $rootScope.$new(), view = {view_name: 'undefined'};
        var ctrl = $controller('ConfigCtrl', {
            '$scope' : $scope
        });
        expect(ctrl.loadView).toBeDefined();
        expect(ctrl.loadView).toEqual(jasmine.any(Function));
        spyOn(DefaultFilterService, "getSelectedObservation").and.returnValue(true);
        spyOn(ModalService, "alertBox");
        ctrl.loadView({});
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: []});
        $httpBackend.expect('GET', infoserverDomain + '/analytics/system/all/list/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: [{sys_ids: ['sysid1']}]});
        $httpBackend.expect('GET', 'stat/obs_groups.json').respond(500, {
            "Status": "Success",
            "Msg": "Relavant Message",
            "Data": ["Last Hour", "Last 12 Hour", "Yesterday", "Last 2 Days", "This Week", "This Month"]
        });
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Data: {}});
        $httpBackend.expect('GET', infoserverDomain + '/configview/meta/' + manufacturer + '/' + product + '/' + schema + "/" + view.view_name).respond(500, {Data: []});
        $httpBackend.flush();
    }));
	*/
	it('getSelectedSections', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.getSelectedSections).toBeDefined();
		expect(ctrl.getSelectedSections).toEqual(jasmine.any(Function));
		expect(ctrl.getSelectedSections()).toEqual([]);
	}));
	
	it('resetSections', inject(function($rootScope, $controller, ConfigDiffService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.resetSections).toBeDefined();
		expect(ctrl.resetSections).toEqual(jasmine.any(Function));
		ctrl.resetSections();
	}));
	
	it('showGoldenConfig', inject(function($rootScope, $controller, metaDataService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.showGoldenConfig).toBeDefined();
		expect(ctrl.showGoldenConfig).toEqual(jasmine.any(Function));
		ctrl.showGoldenConfig();
		spyOn(metaDataService, "getUser").and.returnValue({role: 'admin'});
		ctrl.showGoldenConfig();
	}));
	
	it('loadGoldenConfigData', inject(function($rootScope, $controller, ConfigDiffService) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.loadGoldenConfigData).toBeDefined();
		expect(ctrl.loadGoldenConfigData).toEqual(jasmine.any(Function));
		ctrl.loadGoldenConfigData();
		ctrl.info = {};
		ctrl.info.loaded = true;
		ctrl.info.goldenconfig = {
			disabled: false
		};
		ctrl.loadGoldenConfigData();
		ctrl.info.goldenconfig.disabled = true;
		ctrl.loadGoldenConfigData();
		spyOn(ConfigDiffService, "getSections").and.returnValue([{selected: false}, {selected: true, default: true}, {selected: true, default: false}]);
		spyOn(ConfigDiffService, "loadGoldenConfigDiffData");
		ctrl.loadGoldenConfigData();
	}));
	
	/*it('showSectionDiff', inject(function($rootScope, $controller, $compile, DefaultFilterService, InstanceHandler) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ConfigCtrl', {
			'$scope' : $scope
		});
		var el = $('<div><input id="file_diff_key" value="unit test"/></div>');
		$(document.body).append(el);
		expect($scope.showSectionDiff).toBeDefined();
		expect($scope.showSectionDiff).toEqual(jasmine.any(Function));
		DefaultFilterService.setDefaultObservation({bundle_name: 'unit_test', obs_time: 'July 21, 1983 01:15:00'});
		ctrl.info = {
			defaultSysId: {
				sys_id: 23
			}
		};
		spyOn(InstanceHandler, "addInstance");
		$scope.showSectionDiff({});
		expect(InstanceHandler.addInstance).toHaveBeenCalled();
		DefaultFilterService.setDefaultObservation({bundle_name: 'unit_test/test.zip', obs_time: 'July 21, 1983 01:15:00'});
		$scope.showSectionDiff({});
	}));
	
	it('logActivity', inject(function($rootScope, $controller) {
		$rootScope.isFeatureEnable = function() {
		};
		var $scope = $rootScope.$new();
		var ctrl = $controller('DashboardsCtrl', {
			'$scope' : $scope
		});
		expect(ctrl.logActivity).toEqual(jasmine.any(Function));
	}));*/
});

describe('GoldenConfigController: ', function() {
    
    var $modalInstance, manufacturer, product, schema;
    
    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers.analytics', 'ngCookies', 'ngTable', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));
    
    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
    /*
    it('load with API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ConfigDiffService) {
        var $scope = $rootScope.$new();
        spyOn(ConfigDiffService, "getGoldenConfig").and.returnValue({loading: true});
        var ctrl = $controller('GoldenConfigController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        spyOn(ConfigDiffService, "formatFacets");
        $httpBackend.expect('GET', infoserverDomain + '/meta/columns/facet/' + manufacturer + '/' + product + '/' + schema).respond({});
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond({Data: {category: 'test', sub_category: 'test'}});
        $httpBackend.flush();
    }));
    
    it('load with API call golden config not disabled', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ConfigDiffService) {
        var $scope = $rootScope.$new();
        spyOn(ConfigDiffService, "getGoldenConfig").and.returnValue({loading: true});
        var ctrl = $controller('GoldenConfigController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        spyOn(ConfigDiffService, "formatFacets").and.returnValue([{}]);
        $httpBackend.expect('GET', infoserverDomain + '/meta/columns/facet/' + manufacturer + '/' + product + '/' + schema).respond({});
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond({Data: {category: 'NA', sub_category: 'test'}});
        $httpBackend.flush();
    }));
    
    it('load with categories error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ConfigDiffService, ModalService) {
        var $scope = $rootScope.$new();
        spyOn(ConfigDiffService, "getGoldenConfig").and.returnValue({loading: true});
        var ctrl = $controller('GoldenConfigController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        spyOn(ConfigDiffService, "formatFacets");
        spyOn(ModalService, "sessionTimeout");
        $httpBackend.expect('GET', infoserverDomain + '/meta/columns/facet/' + manufacturer + '/' + product + '/' + schema).respond({});
        $httpBackend.expect('GET', infoserverDomain + '/base/gconf/category/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));
    
    it('load with get facets error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ConfigDiffService, ModalService) {
        var $scope = $rootScope.$new();
        spyOn(ConfigDiffService, "getGoldenConfig").and.returnValue({loading: true});
        var ctrl = $controller('GoldenConfigController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        spyOn(ConfigDiffService, "formatFacets");
        spyOn(ModalService, "sessionTimeout");
        $httpBackend.expect('GET', infoserverDomain + '/meta/columns/facet/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.flush();
    }));*/
    
    it('beginUpload', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        spyOn(ConfigDiffService, "getGoldenConfig").and.returnValue({});
        var ctrl = $controller('GoldenConfigController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        expect(ctrl.beginUpload).toBeDefined();
        expect(ctrl.beginUpload).toEqual(jasmine.any(Function));
        
        ctrl.uploader = {
            uploadAll : function() {
                
            }
        };
        spyOn(ctrl.uploader, "uploadAll");
        ctrl.beginUpload();
    }));
    
    it('hideModal', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        spyOn(ConfigDiffService, "getGoldenConfig").and.returnValue({});
        var ctrl = $controller('GoldenConfigController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        expect(ctrl.hideModal).toBeDefined();
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
        
        ctrl.hideModal();
    }));
    
    
    it('uploader onErrorItem', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        spyOn(ConfigDiffService, "getGoldenConfig").and.returnValue({});
        var ctrl = $controller('GoldenConfigController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        
        ctrl.uploader.onErrorItem('', {}, {}, {}); 
        ctrl.uploader.onErrorItem('', {Msg: 'timeout'}, {}, {}); 
    }));    
});

describe('SaveConfigFilter : ', function() {
    
    var $modalInstance, manufacturer, product, schema, umsDomain;
    
    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers.analytics', 'ngCookies', 'ngTable', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
        
    }));
    
    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
    
    it('selectedSections', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}]}
        });
        expect(ctrl.selectedSections).toBeDefined();
        expect(ctrl.selectedSections).toEqual(jasmine.any(Function));
        ctrl.selectedSections();
        spyOn(ConfigDiffService, "getSections").and.returnValue([{data: {unit: 'test'}, label: 'label1', selected: true}, {label: 'label2', selected: true}, {data: 'abcd', label: 'label3', selected: true}]);
        ctrl.selectedSections();
    }));
    
    it('kbaseOnFocus', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}]}
        });
        expect(ctrl.kbaseOnFocus).toBeDefined();
        expect(ctrl.kbaseOnFocus).toEqual(jasmine.any(Function));
        ctrl.saveModal.kbase = '';
        ctrl.kbaseOnFocus();
        ctrl.kbaseOnFocus();
    }));
    
    it('kbaseOnBlur', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}]}
        });
        expect(ctrl.kbaseOnBlur).toBeDefined();
        expect(ctrl.kbaseOnBlur).toEqual(jasmine.any(Function));
        ctrl.saveModal.kbase = 'http://';
        ctrl.kbaseOnBlur();
        ctrl.kbaseOnBlur();
    }));
    
    it('getEmptySectionList', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}]}
        });
        expect(ctrl.getEmptySectionList).toBeDefined();
        expect(ctrl.getEmptySectionList).toEqual(jasmine.any(Function));
        ctrl.getEmptySectionList();
    }));
    
    it('updateColumnAttributes', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.updateColumnAttributes).toBeDefined();
        expect(ctrl.updateColumnAttributes).toEqual(jasmine.any(Function));
        ctrl.updateColumnAttributes('test1');
    }));
    
    it('hideModal', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.hideModal).toBeDefined();
        expect(ctrl.hideModal).toEqual(jasmine.any(Function));
        ctrl.hideModal();
    }));
    
    it('checkViewName duplicate true', inject(function($rootScope, $controller, ConfigDiffService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.checkViewName).toBeDefined();
        expect(ctrl.checkViewName).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                viewName: {
                    $setValidity: function() {
                
                    }
                }
            }
        };
        spyOn(ctrl.form.saveViewModal.viewName, "$setValidity");
        ctrl.checkViewName();
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{view_name: 'test', created_by: 'ashwin'}]});
        $httpBackend.flush();
    }));
    
    it('checkViewName duplicate false', inject(function($rootScope, $controller, ConfigDiffService, $httpBackend, infoserverDomain, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.checkViewName).toBeDefined();
        expect(ctrl.checkViewName).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                viewName: {
                    $setValidity: function() {
                
                    }
                }
            }
        };
        spyOn(ctrl.form.saveViewModal.viewName, "$setValidity");
        spyOn(metaDataService, "getUser").and.returnValue({email: 'ashwin'});
        ctrl.saveModal.name = 'test';
        ctrl.checkViewName();
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{view_name: 'test', created_by: 'ashwin'}, {view_name: 'test', created_by: 'ashwin1'}]});
        $httpBackend.flush();
    }));
    
    it('checkViewName with savedfilterslist duplicate true', inject(function($rootScope, $controller, ConfigDiffService, $httpBackend, infoserverDomain, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.checkViewName).toBeDefined();
        expect(ctrl.checkViewName).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                viewName: {
                    $setValidity: function() {
                
                    }
                }
            }
        };
        spyOn(ctrl.form.saveViewModal.viewName, "$setValidity");
        spyOn(metaDataService, "getUser").and.returnValue({email: 'ashwin'});
        ctrl.saveModal.name = 'unit';
        ctrl.checkViewName();
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{view_name: 'test', created_by: 'ashwin'}, {view_name: 'test', created_by: 'ashwin1'}]});
        $httpBackend.flush();
        ctrl.checkViewName();
    }));
    
    it('checkViewName with savedfilterslist duplicate false', inject(function($rootScope, $controller, ConfigDiffService, $httpBackend, infoserverDomain, metaDataService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.checkViewName).toBeDefined();
        expect(ctrl.checkViewName).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                viewName: {
                    $setValidity: function() {
                
                    }
                }
            }
        };
        spyOn(ctrl.form.saveViewModal.viewName, "$setValidity");
        spyOn(metaDataService, "getUser").and.returnValue({email: 'ashwin'});
        ctrl.saveModal.name = 'test';
        ctrl.checkViewName();
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/all/' + manufacturer + '/' + product + '/' + schema).respond({Data: [{view_name: 'test', created_by: 'ashwin'}, {view_name: 'test', created_by: 'ashwin1'}]});
        $httpBackend.flush();
        ctrl.checkViewName();
    }));
    
    it('checkViewName error block', inject(function($rootScope, $controller, ConfigDiffService, $httpBackend, infoserverDomain, ModalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.checkViewName).toBeDefined();
        expect(ctrl.checkViewName).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                viewName: {
                    $setValidity: function() {
                
                    }
                }
            }
        };
        spyOn(ctrl.form.saveViewModal.viewName, "$setValidity");
        spyOn(ModalService, "sessionTimeout");
        ctrl.checkViewName();
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));
    
    it('getValue', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.getValue).toBeDefined();
        expect(ctrl.getValue).toEqual(jasmine.any(Function));
        expect(ctrl.getValue('mainTitle')).toEqual(GlobalService.getVal('mainTitle'));
    }));
    
    it('saveFilter', inject(function($rootScope, $controller, GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.saveFilter).toBeDefined();
        expect(ctrl.saveFilter).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                $valid: false
            }
        };
        ctrl.saveFilter();
    }));
    
    it('saveFilter without error', inject(function($rootScope, $controller, ConfigDiffService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.saveFilter).toBeDefined();
        expect(ctrl.saveFilter).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                $valid: true
            }
        };
        ctrl.saveModal = {
            name: 'unit1',
            access: 'public',
            desc: 'description',
            kbase: 'http://unittest'
        };
        spyOn(ConfigDiffService, "getSections").and.returnValue([{selected: true, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}, {selected: false, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}, {selected: true, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}]);
        ctrl.saveFilter();
    }));
    
    /*it('saveFilter with API call', inject(function($rootScope, $controller, ConfigDiffService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.saveFilter).toBeDefined();
        expect(ctrl.saveFilter).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                $valid: true
            }
        };
        ctrl.saveModal = {
            name: 'unit1',
            access: 'public',
            desc: 'description',
            kbase: 'http://unittest'
        };
        spyOn(ConfigDiffService, "getSections").and.returnValue([{selected: true, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}, {selected: false, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}, {selected: true, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}]);
        ctrl.saveFilter();
        $httpBackend.expect('POST', infoserverDomain + '/configview/add/' + manufacturer + '/' + product + '/' + schema + '/' + true + "/" + 'unit1' + "/" + false).respond({});
        $httpBackend.expect('GET', infoserverDomain + '/configview/list/all/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Config Diff/Save View').respond({Msg: ''});
        $httpBackend.flush();
    }));*/
    
    it('saveFilter with API call error block', inject(function($rootScope, $controller, ConfigDiffService, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('SaveConfigFilter', {
            '$scope' : $scope,
            '$modalInstance' : $modalInstance,
            'items': {allSectionsDetails: [{name: 'test'}, {name: 'test1'}]}
        });
        expect(ctrl.saveFilter).toBeDefined();
        expect(ctrl.saveFilter).toEqual(jasmine.any(Function));
        ctrl.form = {
            saveViewModal: {
                $valid: true
            }
        };
        ctrl.saveModal = {
            name: 'unit1',
            access: 'public',
            desc: 'description',
            kbase: 'http://unittest'
        };
        spyOn(ConfigDiffService, "getSections").and.returnValue([{selected: true, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}, {selected: false, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}, {selected: true, data: 'data', table_name: 'table1', keys: [{visible: false, key: 'tab1key1'}, {visible: true, key: 'tab1key2'}]}]);
        ctrl.saveFilter();
        $httpBackend.expect('POST', infoserverDomain + '/configview/add/' + manufacturer + '/' + product + '/' + schema + '/' + true + "/" + 'unit1' + "/" + false).respond(500, {});
        $httpBackend.flush();
    }));
});

describe('ResetViewController : ', function() {
    
    var $modalInstance;
    
    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers.analytics', 'ngCookies', 'ngTable', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('manufacturer', undefined);
        $provide.value('useLocal', true);
        $provide.value('product', undefined);
        $provide.value('schema', undefined);
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));
    
    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
    
    it('resetViewConfirm', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ResetViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        expect(ctrl.resetViewConfirm).toBeDefined();
        expect(ctrl.resetViewConfirm).toEqual(jasmine.any(Function));
        ctrl.resetViewConfirm();
    }));
    
    it('hideNavigationModal', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ResetViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance
        });
        expect(ctrl.hideNavigationModal).toBeDefined();
        expect(ctrl.hideNavigationModal).toEqual(jasmine.any(Function));
        ctrl.hideNavigationModal();
    }));
});

describe('DeleteConfigViewController : ', function() {
    
    var $modalInstance, manufacturer, product, schema, umsDomain;
    
    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers.analytics', 'ngCookies', 'ngTable', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
        
        $modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));
    
    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
    
    it('hideDeleteView', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteConfigViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteConfigModal': {}
        });
        expect(ctrl.hideDeleteView).toBeDefined();
        expect(ctrl.hideDeleteView).toEqual(jasmine.any(Function));
        ctrl.hideDeleteView();
    }));
    
    it('deleteView', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteConfigViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteConfigModal': {}
        });
        expect(ctrl.deleteView).toBeDefined();
        expect(ctrl.deleteView).toEqual(jasmine.any(Function));
        var view = {};
        ctrl.deleteView(view);
    }));
    
   /* it('deleteView with API call', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteConfigViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteConfigModal': {}
        });
        expect(ctrl.deleteView).toBeDefined();
        expect(ctrl.deleteView).toEqual(jasmine.any(Function));
        var view = {};
        ctrl.deleteView(view);
        $httpBackend.expect('POST', infoserverDomain + '/configview/delete/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Apps/Config Diff/Delete View').respond({Msg: ''});
        $httpBackend.flush();
    }));*/
    
    it('deleteView with API call error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteConfigViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteConfigModal': {}
        });
        expect(ctrl.deleteView).toBeDefined();
        expect(ctrl.deleteView).toEqual(jasmine.any(Function));
        var view = {};
        ctrl.deleteView(view);
        $httpBackend.expect('POST', infoserverDomain + '/configview/delete/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond(500, {});
        $httpBackend.flush();
    }));
    
    it('deleteView with API call error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('DeleteConfigViewController', {
            '$scope' : $scope,
            '$modalInstance': $modalInstance,
            'deleteConfigModal': {}
        });
        expect(ctrl.deleteView).toBeDefined();
        expect(ctrl.deleteView).toEqual(jasmine.any(Function));
        var view = {};
        spyOn(ModalService, "sessionTimeout");
        ctrl.deleteView(view);
        $httpBackend.expect('POST', infoserverDomain + '/configview/delete/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond(500, {Msg: 'timeout'});
        $httpBackend.flush();
    }));
});
