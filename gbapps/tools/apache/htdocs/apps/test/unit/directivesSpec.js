'use strict';

/* jasmine specs for directives go here */

describe('directives : ', function() {
    
    var manufacturer, product, schema;
    
    beforeEach(module('gbApp.directives', 'gbApp.services.workbench', 'gbApp.services', 'gbApp.globals', 'ui.bootstrap', 'gbApp.services.explorer', 'gbApp.services.logvault', 'gbApp.services.analytics', 'gbApp.controllers', 'ngTable', function($provide) {
        $provide.value('useLocal', true);
        $provide.value('infoserverDomain', 'undefined');
        
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
    }));
    
    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
	
	it('Should have gbInstanceViewer', inject(function($compile, $rootScope, InstanceHandler) {
		var $scope = $rootScope.$new();
		var parent = angular.element('<div ng-controller="InstanceCtrl"></div>');
		var element1 = $compile(parent.append(angular.element('<gb-instance-viewer class="gb-instance-viewer"></gb-instance-viewer>')))($scope);
		expect(parent.html()).toContain('<gb-instance-viewer class="gb-instance-viewer"></gb-instance-viewer>');
	}));
	
	it('Should have gbDraggable', inject(function($compile, $rootScope, $document) {
		var $scope = $rootScope.$new();
		var element1 = angular.element('<div></div>');
		var element2 = angular.element('<div gb-draggable id="head">Some text here</div>');
		element1.append(element2);
		var element = $compile(element1)($scope);
		element2.triggerHandler('mousedown');
		$document.triggerHandler('mousemove');
		$document.triggerHandler('mouseup');
	}));
	
	it('Should have scrolly', inject(function($compile, $rootScope, $document) {
		var $scope = $rootScope.$new();
		var element1 = angular.element('<div></div>');
		var element2 = angular.element('<div scrolly>Some text here</div>');
		element1.append(element2);
		var element = $compile(element1)($scope);
	}));
	
	it('Should have customTimeFilter', inject(function($compile, $rootScope, $document) {
		var $scope = $rootScope.$new();
		var element1 = angular.element('<div></div>');
		var element2 = angular.element('<custom-time-filter scrolly>Some text here</custom-time-filter>');
		element1.append(element2);
		var element = $compile(element1)($scope);
	}));
	
	it('Should have tooltip', inject(function($compile, $rootScope, $document) {
		var $scope = $rootScope.$new();
		var element1 = angular.element('<div></div>');
		var element2 = angular.element('<div tooltip>Some text here</div>');
		element1.append(element2);
		var element = $compile(element1)($scope);
		element2.triggerHandler('mousedown');
		$document.triggerHandler('mouseover');
	}));
	
	it('Should have gbResizable', inject(function($compile, $rootScope, $document) {
		var $scope = $rootScope.$new();
		var element = $compile(angular.element('<div gb-resizable class="resize-div"></div>'))($scope);
		var contents = element.children();
		for(var i = 0; i < contents.length; i++) {
			var elem = angular.element(contents[i]);
			elem.triggerHandler('mousedown');
			$document.triggerHandler('mousemove');
			$document.triggerHandler('mouseup');
		}
	}));
	
	it('Should have gbOutsideClick', inject(function($compile, $rootScope, $document) {
		var $scope = $rootScope.$new();
		var element1 = $compile(angular.element('<div gb-outside-click="unitTest = true"><a id="anchor-1" href="#">Anchor 1</a></div>'))($scope);
		$scope.unitTest = null;
		$document.triggerHandler('click');
		expect($scope.unitTest).toBeTruthy();
	}));
	
	it('SHould have fchart', inject(function($compile, $rootScope) {
		var $scope = $rootScope.$new();
		$scope.modal = {
			cType: "bar2d",
			cData: {},
			exportImage: 0,
			exportPdf: 0,
			facetLabel: '',
			dateRange: 'Time Range: abc TO def'
		};
		var element = $compile(angular.element('<div  class="gb-facet-chart"  fchart c_type="{{modal.cType}}" c_data = "{{modal.cData}}" export_image="{{modal.exportImage}}" export_pdf = "{{modal.exportPdf}}" f_label="{{modal.facetLabel}}" f_d_range="{{modal.dateRange}}" ></div>'))($scope);
	}));
	
	it('Should have ngEnter', inject(function($compile, $rootScope) {
		var $scope = $rootScope.$new(),
            form = $compile(angular.element('<form name="form"><input type="text" ng-enter="unitTest = true"></form>'))($scope),
            input = form.find('input');
    $scope.$apply();
		input.triggerHandler('keypress', {keyCode: 13});
	}));
	
	it('Should have exportXls', inject(function($compile, $rootScope, SectionsMetaService, ConfigDiffService) {
		var $scope = $rootScope.$new();
		$scope.section = {
		    columns: [{
		        selected: true
		    }, {
		        selected: false
		    }],
		    columnsMap: {
		        
		    }
		};
		var element = $compile(angular.element('<a href="#" export-xls>Download XL</a>'))($scope);
		element.triggerHandler('click');
		
		$scope = $rootScope.$new();
		$scope.section = {
            columns: [{
                selected: true
            }, {
                selected: true
            }, {
                selected: false
            }],
            columnsMap: {
                
            }
        };
        $scope.info = {
            application: "app"
        };
		element = $compile(angular.element('<a href="#" export-xls export-type="sectionview" export-section="section" export-info="info">Download XL</a>'))($scope);
		spyOn(SectionsMetaService, "exportXlsUrl");
		spyOn(ConfigDiffService, "exportXlsUrl");
		element.triggerHandler('click');
		expect(SectionsMetaService.exportXlsUrl).toHaveBeenCalled();
		
		$scope = $rootScope.$new();
		$scope.section = {
            keys: [{
                visible: true
            }, {
                visible: true
            }, {
                visible: false
            }]
        };
        $scope.info = {
            application: "app"
        };
		element = $compile(angular.element('<a href="#" export-xls export-type="configdiff" export-info="{defaultEndCust: \'uitest\'}" export-section="section" export-info="info">Download XL</a>'))($scope);
		element.triggerHandler('click');
		expect(ConfigDiffService.exportXlsUrl).toHaveBeenCalled();
	}));
	
	it('Should have gbDownloadBundle', inject(function($compile, $rootScope) {
		var $scope = $rootScope.$new();
		var parent = angular.element('<div></div>');
		var button = angular.element('<button type="button" gb-download-bundle download-file="unitTest()" close="true">Done</button>');
		var element = $compile(parent.append(button))($scope);
		//button.triggerHandler('click');
	}));
	
	it('Should have gbDownloadBundleGroup', inject(function($compile, $rootScope) {
		var $scope = $rootScope.$new();
		var parent = angular.element('<div></div>');
		var button = angular.element('<button type="button" gb-download-bundle-group download-file="unitTest()" close="true">Done</button>');
		var element = $compile(parent.append(button))($scope);
		//button.triggerHandler('click');
	}));
	
	it('Should have gbFrame', inject(function($compile, $rootScope) {
		var $scope = $rootScope.$new();
		var parent = angular.element('<div></div>');
		var element = $compile(parent.append(angular.element('<gb-frame iframe-src="/abc.jsp"></gb-frame>')))($scope);
		expect(parent.html()).toContain('<iframe height="100%" width="100%" frameborder="0" iframe-src="/abc.jsp" src="/abc.jsp"></iframe>');
	}));
	
	it('Should have refreshable', inject(function($compile, $rootScope) {
		var $scope = $rootScope.$new();
		var parent = angular.element('<div></div>');
		var element = $compile(parent.append(angular.element('<iframe refreshable="unitTest()"></iframe>')))($scope);
	}));
	
	/*xit('Should have tableauInstance', inject(function($compile, $rootScope, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		spyOn(tableau, "Viz");
		$scope.instance = {
			data: {
				view: {
					url: ''
				}
			}
		};
		var parent = angular.element('<div></div>');
		var element = $compile(parent.append(angular.element('<tableau-instance instance="instance" class="tableau-instance"></tableau-instance>')))($scope);
		$httpBackend.expect('GET', infoserverDomain + '/tableau/trusted/ticket/' + manufacturer + '/' + product + '/' + schema + '/' + undefined).respond(200, {Data: 'jashsw67nbxcjhxcjhxch'});
        $httpBackend.flush();
		expect(tableau.Viz).toHaveBeenCalled();
		expect(parent.html()).toContain('<div ng-attr-id="{{instance.md5}}" instance="instance" class="tableau-instance ng-isolate-scope"></div>');
	}));
	
	xit('Should have tableauTabbedInstance', inject(function($compile, $rootScope, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		spyOn(tableau, "Viz");
		$scope.instance = {
			data: {
				book: {
					name: 'book1',
					views: [{
						name: 'view1'
					}]
				}
			}
		};
		var parent = angular.element('<div></div>'); 
		var element = $compile(parent.append(angular.element('<tableau-tabbed-instance instance="instance" class="tableau-instance"></tableau-tabbed-instance>')))($scope);
		$httpBackend.expect('GET', infoserverDomain + '/tableau/trusted/ticket/' + manufacturer + '/' + product + '/' + schema + '/' + undefined).respond(200, {Data: 'jashsw67nbxcjhxcjhxch'});
        $httpBackend.flush();
		expect(tableau.Viz).toHaveBeenCalled();
		expect(parent.html()).toContain('<div ng-attr-id="{{instance.md5}}" instance="instance" class="tableau-instance ng-isolate-scope"></div>');
	}));
	
	xit('Should have tableauEditor', inject(function($compile, $rootScope, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		spyOn(tableau, "Viz");
		$scope.instance = {
			data: {
				book: {
					name: 'book1',
					views: [{
						name: 'view1'
					}]
				}
			}
		};
		var parent = angular.element('<div></div>'); 
		var element = $compile(parent.append(angular.element('<tableau-editor instance="instance" class="tableau-editor"></tableau-editor>')))($scope);
		$httpBackend.expect('GET', infoserverDomain + '/tableau/trusted/ticket/' + manufacturer + '/' + product + '/' + schema + '/' + undefined).respond(200, {Data: 'jashsw67nbxcjhxcjhxch'});
		$httpBackend.flush();
		expect(tableau.Viz).toHaveBeenCalled();
		expect(parent.html()).toContain('<div ng-attr-id="{{instance.md5}}" instance="instance" class="tableau-editor ng-isolate-scope"></div>');
		$scope = $rootScope.$new();
		$scope.instance = {
			data: {
				view: {
					url: ''
				}
			}
		};
		var parent1 = angular.element('<div></div>'); 
		var element1 = $compile(parent1.append(angular.element('<tableau-editor instance="instance" class="tableau-editor"></tableau-editor>')))($scope);
		$httpBackend.expect('GET', infoserverDomain + '/tableau/trusted/ticket/' + manufacturer + '/' + product + '/' + schema + '/' + undefined).respond(200, {Data: 'jashsw67nbxcjhxcjhxch'});
        $httpBackend.flush();
		expect(tableau.Viz).toHaveBeenCalled();
		expect(parent1.html()).toContain('<div ng-attr-id="{{instance.md5}}" instance="instance" class="tableau-editor ng-isolate-scope"></div>');
	}));
	
	xit('Should have tableauPermissions', inject(function($compile, $rootScope) {
		var $scope = $rootScope.$new();
		spyOn(tableauSoftware, "Viz");
		var parent = angular.element('<div></div>');
		var element = $compile(parent.append(angular.element('<tableau-permissions instance="instance" class="tableau-editor"></tableau-permissions>')))($scope);
		expect(tableauSoftware.Viz).toHaveBeenCalled();
		expect(parent.html()).toContain('<div ng-attr-id="{{instance.md5}}" instance="instance" class="tableau-editor ng-isolate-scope"></div>');
	}));*/
});
