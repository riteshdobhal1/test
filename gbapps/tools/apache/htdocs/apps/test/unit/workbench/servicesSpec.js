describe('WorkbenchService : ', function() {
    
    var manufacturer, product, schema;
    
	beforeEach(module('gbApp.services.analytics', 'gbApp.services.workbench', 'gbApp.services.dashboards', 'gbApp.services', 'ui.bootstrap', 'gbApp.globals', 'ngCookies', 'ngTable', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('adminEmail', 'support@glassbeam.com');
		$provide.value('useLocal', true);
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
	}));

	it('getUsers', inject(function(WorkbenchService) {
		expect(WorkbenchService).toBeDefined();
		WorkbenchService.getUsers().then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));

	it('getDataSources', inject(function(WorkbenchService) {
		expect(WorkbenchService).toBeDefined();
		WorkbenchService.getDataSources().then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));

	it('getWorkbooks', inject(function(WorkbenchService) {
		expect(WorkbenchService).toBeDefined();
		WorkbenchService.getWorkbooks().then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	
	it('addViews', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, $q) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "fetchWorkbooks");
        var wb = {id: 'workbook_id', name: 'Unit', owner: {_id: 'owner'}};
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbook/views/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + wb['id']).respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><views><view contentUrl="Ashwin2/sheets/Sheet1" name="Sheet 1" id="bd2425db-c1dc-4810-a019-00c8acf74529"/></views></tsResponse>');
        WorkbenchService.addViews([], wb, $q.defer());
        $httpBackend.flush();
    }));
    
    it('addViews multiple views', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, $q) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "fetchWorkbooks");
        var wb = {id: 'workbook_id', name: 'Unit', owner: {_id: 'owner'}};
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbook/views/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + wb['id']).respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><views><view contentUrl="Ashwin2/sheets/Sheet1" name="Sheet 1" id="bd2425db-c1dc-4810-a019-00c8acf74529"/><view contentUrl="Ashwin2/sheets/Sheet2" name="Sheet 2" id="bd2425db-c1dc-4810-a019-00c8acf74528"/></views></tsResponse>');
        WorkbenchService.addViews([], wb, $q.defer());
        $httpBackend.flush();
    }));
    
    it('addViews error block', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, $q, ModalService) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "fetchWorkbooks");
        spyOn(ModalService, "sessionTimeout");
        var wb = {id: 'workbook_id', name: 'Unit', owner: {_id: 'owner'}};
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbook/views/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId() + '/' + wb['id']).respond(500, {Msg: 'timeout'});
        WorkbenchService.addViews([], wb, $q.defer());
        $httpBackend.flush();
    }));
	
	/*xit('updateWorkbooks', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService) {
		expect(WorkbenchService).toBeDefined();
		spyOn(WorkbenchService, "fetchWorkbooks");
		$httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond({Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
		$httpBackend.expect('GET', infoserverDomain + '/tableau/schedules/list/' + manufacturer + '/' + product + '/' + schema).respond('<tsResponse><schedules/></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscriptions/list/' + manufacturer + '/' + product + '/' + schema + '/site_id/undefined/user_id').respond('<tsResponse><subscriptions/></tsResponse>');
        WorkbenchService.updateWorkbooks();
		$httpBackend.flush();
	}));*/
	
	it('updateWorkbooks error block', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "fetchWorkbooks");
        $httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond(500, {Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
        WorkbenchService.updateWorkbooks();
        $httpBackend.flush();
    }));
    
    /*xit('updateWorkbooks if block', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "fetchWorkbooks");
        $httpBackend.expect('GET', infoserverDomain + '/tableau/siteuser/info/' + manufacturer + '/' + product + '/' + schema + '/' + metaDataService.getUser()['wb_user_name'] + '?power=true').respond({Data: {tableau_domain: 'undefined', site_id: 'site_id', user_id: 'user_id'}});
        $httpBackend.expect('GET', infoserverDomain + '/tableau/schedules/list/' + manufacturer + '/' + product + '/' + schema).respond('<tsResponse><schedules/></tsResponse>');
        $httpBackend.expect('GET', infoserverDomain + '/tableau/subscriptions/list/' + manufacturer + '/' + product + '/' + schema + '/site_id/undefined/user_id').respond('<tsResponse><subscriptions/></tsResponse>');
        WorkbenchService.updateWorkbooks();
        $httpBackend.flush();
        WorkbenchService.updateWorkbooks();
    }));
    
    xit('fetchWorkbooks', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, x2js) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "tranformWorkbooks");
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbooks/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="13" pageSize="100" pageNumber="1"/><workbooks><workbook showTabs="true" contentUrl="Ashwin2" name="Ashwin2" id="043b7ee4-9f57-474b-b623-aa4d102053d9"><project name="default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="97e1bc6f-9140-4e78-b58a-63483cc71a73"/><tags></tags></workbook><workbook showTabs="true" contentUrl="Ashwin12" name="Ashwin12" id="bff6feed-2534-4712-a878-6d70732a134f"><project name="default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="befee25f-711f-4edc-91ad-9c4f954a3ce6"/><tags></tags></workbook></workbooks></tsResponse>');
        WorkbenchService.fetchWorkbooks();
        $httpBackend.flush();
    }));
	
	xit('fetchWorkbooks single workbook', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, x2js) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "tranformWorkbooks");
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbooks/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="13" pageSize="100" pageNumber="1"/><workbooks><workbook showTabs="true" contentUrl="Ashwin2" name="Ashwin2" id="043b7ee4-9f57-474b-b623-aa4d102053d9"><project name="default" id="2adc0ff0-80eb-4d1b-a272-04deaaf5b7f0"/><owner id="97e1bc6f-9140-4e78-b58a-63483cc71a73"/><tags></tags></workbook></workbooks></tsResponse>');
        WorkbenchService.fetchWorkbooks();
        $httpBackend.flush();
    }));
    
    xit('fetchWorkbooks no workbooks', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, x2js) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "tranformWorkbooks");
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbooks/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond('<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="13" pageSize="100" pageNumber="1"/><workbooks></workbooks></tsResponse>');
        WorkbenchService.fetchWorkbooks();
        $httpBackend.flush();
    }));
    
    xit('fetchWorkbooks error block', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, x2js) {
        expect(WorkbenchService).toBeDefined();
        spyOn(WorkbenchService, "tranformWorkbooks");
        $httpBackend.expect('GET', infoserverDomain + '/tableau/workbooks/list/' + manufacturer + '/' + product + '/' + schema + '/' + WorkbenchService.getSiteId() + '/' + metaDataService.getUser()['wb_user_name'] + '/' + WorkbenchService.getUserId()).respond(500, '<tsResponse xsi:schemaLocation="http://tableau.com/api http://tableau.com/api/ts-api-2.1.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tableau.com/api"><pagination totalAvailable="13" pageSize="100" pageNumber="1"/><workbooks></workbooks></tsResponse>');
        WorkbenchService.fetchWorkbooks();
        $httpBackend.flush();
    }));*/

	it('setSiteId && getSiteId', inject(function(WorkbenchService) {
		expect(WorkbenchService).toBeDefined();
		WorkbenchService.setSiteId(23);
		expect(WorkbenchService.getSiteId()).toEqual(23);
	}));

	it('setUserId && getUserId', inject(function(WorkbenchService) {
		expect(WorkbenchService).toBeDefined();
		WorkbenchService.setUserId('uitest');
		expect(WorkbenchService.getUserId()).toEqual('uitest');
	}));
	
	it('getWorkbooksLocal && setWorkbooksLocal', inject(function(WorkbenchService) {
        expect(WorkbenchService).toBeDefined();
        WorkbenchService.setWorkbooksLocal('uitest');
        expect(WorkbenchService.getWorkbooksLocal()).toEqual('uitest');
    }));

	it('tranformWorkbooks', inject(function(WorkbenchService) {
		expect(WorkbenchService).toBeDefined();
		var workbooks = {
			book1 : {
				name : 'book1',
				id : 26,
				tabs_allowed : 4,
				owner : {
					luid : 'uitest'
				},
				tags: {
				    tag: {
				        _label: 'tag1'
				    }
				}
			},
			book2 : {
				name : 'book2',
				id : 29,
				tabs_allowed : 4,
				owner : {
					luid : 'uitest'
				},
				tags: {
				    tag: [{
				        _label: 'tag1'
				    }, {
				        _label: 'tag2'
				    }]
				}
			},
			book3 : {
				name : 'book3',
				id : 34,
				tabs_allowed : 4,
				owner : {
					luid : 'uitest'
				}
			},
			book4 : {
				name : 'book4',
				id : 39,
				tabs_allowed : 4,
				owner : {
					luid : 'uitest'
				}
			}
		};
		expect(WorkbenchService.tranformWorkbooks(workbooks)).toEqual([]);
	}));
	it('getAllWorkbenchLocal', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, x2js) {
        expect(WorkbenchService).toBeDefined();
        $httpBackend.expectGET(infoserverDomain + '/tableau/datasources/all/list/' + manufacturer + '/' + product + '/' + schema).respond(200, []);
        WorkbenchService.getAllWorkbenchLocal();
        $httpBackend.flush();
    }));
   /* xit('addTagsToDatasources', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, x2js) {
        expect(WorkbenchService).toBeDefined();
        var param = {ds_ids : "testId", tags : "testtag"};
        $httpBackend.expect('POST', infoserverDomain + '/tableau/datasource/tag/add/' + manufacturer + '/' + product + '/' + schema, param).respond(200, []);
        WorkbenchService.addTagsToDatasources();
        $httpBackend.flush();
    }));*/
    it('removeTagsFromDatasources', inject(function(WorkbenchService, $httpBackend, infoserverDomain, metaDataService, x2js) {
        expect(WorkbenchService).toBeDefined();
        var dsId = "testId";
        var tag = "testTag";
        $httpBackend.expectGET(infoserverDomain + '/tableau/datasource/tag/delete/' + manufacturer + '/' + product + '/' + schema +'/'+ dsId +'/'+ tag).respond(200, []);
        WorkbenchService.removeTagsFromDatasources(dsId,tag);
        $httpBackend.flush();
    }));
}); 