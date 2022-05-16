describe('explorer service : ', function() {
    
    var manufacturer, product, schema;
    
	beforeEach(module('ui.bootstrap', 'gbApp.services.explorer', 'gbApp.services', 'gbApp.services.workbench', 'gbApp.globals', 'ngCookies', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
	
	it('getData', inject(function(ExplorerService) {
		var start = 10;
		var rows = 10;
		var facets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : true
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var start_date = new Date();
		var end_date = new Date();
		var sort_order = 'asc';
		var cl_timezone = "-7000";
		var searchtext = "CompoundSearch=root";
		var evt_attributes = [{
			"key" : "evt_date_str",
			"dataType" : "STRING",
			"label" : "Date",
			"default" : true
		}, {
			"key" : "evt_text",
			"dataType" : "STRING",
			"label" : "Event Text",
			"default" : true
		}, {
			"key" : "unit_test",
			"dataType" : "STRING",
			"label" : "Unit Test",
			"default" : false
		}];
		var sectionevent = "SECTION";
		var quick_filter = "last10";
		var uploaded_by = "uitest";
		expect(ExplorerService).toBeDefined();
		ExplorerService.getData(start, rows, facets, start_date, end_date, sort_order, cl_timezone, searchtext, evt_attributes, sectionevent, quick_filter, uploaded_by).then(function(response) {
			data = response.data;
		}, function(response) {

		});
		start = 0;
		ExplorerService.getData(start, rows, facets, start_date, end_date, sort_order, cl_timezone, searchtext, evt_attributes, sectionevent, quick_filter, uploaded_by).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	it('getExportUrl', inject(function(ExplorerService, infoserverDomain) {
	    expect(ExplorerService).toBeDefined();
	    var startDate = "2010-4-16T13:14:32Z";
	    var endDate = "2016-4-26T13:14:32Z";
	    var startIndex = 0;
	    var pageSize = 1000;
	    var sectionevent = "EVENT";
		var urlPart = startDate + "/" + endDate + "/" + startIndex + "/" + pageSize + "/" + sectionevent;
		var params = {};
		expect(ExplorerService.getExportUrl(urlPart, params)).toEqual(infoserverDomain + "/explorer/export/" + manufacturer + "/" + product + "/" + schema + "/" + urlPart);
		var params = {
		    filter: 'filter1 AND filter2',
		    orderby : 'obs_date desc'
		};
		expect(ExplorerService.getExportUrl(urlPart, params)).toEqual(infoserverDomain + "/explorer/export/" + manufacturer + "/" + product + "/" + schema + "/" + urlPart + "?filter=filter1 AND filter2&orderby=obs_date desc");
	}));
	it('getSavedFilters', inject(function(ExplorerService) {
		var param = {
			"request_type" : "GET",
			"type" : "search"
		};
		expect(ExplorerService).toBeDefined();
		ExplorerService.getSavedFilters(param).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	it('deleteSavedFilter', inject(function(ExplorerService) {
		var param = {
			"request_type" : "CHANGE_VISIBILITY",
			"search_id" : 46,
			"is_public" : true
		};
		expect(ExplorerService).toBeDefined();
		ExplorerService.deleteSavedFilter(param).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	it('getDefaultFilterInfo', inject(function(ExplorerService) {
		var param = {
			"request_type" : "GET_DEFAULT_FILTER_INFO",
			"app_name" : "search"
		};
		expect(ExplorerService).toBeDefined();
		ExplorerService.getDefaultFilterInfo(param).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	
	it('getSectionViewerSections', inject(function(ExplorerService) {
		var param = {
			"search_id" : 46,
			"request_type" : "restore",
			"type" : "search"
		};
		expect(ExplorerService).toBeDefined();
		ExplorerService.getSectionViewerSections(param).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	
	it('saveFilter', inject(function(ExplorerService) {
		var param = {
			"search_string" : "root",
			"search_events" : true,
			"search_sections" : false,
			"type" : "search",
			"request_type" : "add",
			"last_n_log" : 0,
			"last_n_log_uploaded_by_me" : 0,
			"facet_string" : "abcdefgh",
			"start_time" : new Date(),
			"end_time" : new Date(),
			"search_name" : "unittest",
			"search_desc" : "A long description for this view",
			"is_public" : true
		};
		expect(ExplorerService).toBeDefined();
		ExplorerService.saveFilter(param).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	it('suggestFilter', inject(function(ExplorerService, $q) {
		var keyword = "root";
		expect(ExplorerService).toBeDefined();
		ExplorerService.suggestFilter(keyword, $q.defer()).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	it('suggestFilterSection', inject(function(ExplorerService, $q) {
		var keyword = "root";
		expect(ExplorerService).toBeDefined();
		ExplorerService.suggestFilterSection(keyword, $q.defer()).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	it('suggestFilterAttribute', inject(function(ExplorerService, $q) {
		var keyword = "root";
		expect(ExplorerService).toBeDefined();
		ExplorerService.suggestFilterAttribute(keyword, $q.defer()).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	it('getBundles', inject(function(ExplorerService, $q) {
		var keyword = "root";
		expect(ExplorerService).toBeDefined();
		ExplorerService.getBundles(keyword, $q.defer()).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	
	it('getLinkedAttributes', inject(function(ExplorerService) {
		expect(ExplorerService).toBeDefined();
		ExplorerService.getLinkedAttributes();
	}));
	
	it('getRuleText', inject(function(ExplorerService) {
		expect(ExplorerService).toBeDefined();
		ExplorerService.getRuleText();
	}));
	
	it('setRuleText', inject(function(ExplorerService) {
		expect(ExplorerService).toBeDefined();
		ExplorerService.setRuleText();
	}));
	
	it('getRuleSection', inject(function(ExplorerService) {
		expect(ExplorerService).toBeDefined();
		ExplorerService.getRuleSection();
	}));
	
	it('setRuleSection', inject(function(ExplorerService) {
		expect(ExplorerService).toBeDefined();
		ExplorerService.setRuleSection();
	}));
	it('getLinkedAttributesData', inject(function(ExplorerService) {
		var linked_attributes = {
			linked : ['abcd', 'efgh', 'ijkl']
		};
		expect(ExplorerService).toBeDefined();
		ExplorerService.getLinkedAttributesData(linked_attributes);
	}));
	it('processUrls', inject(function(ExplorerService) {
		var urls = [{
			attribute_name : 'uitest'
		}, {
			attribute_name : 'uitest1'
		}, {
			attribute_name : 'uitest2'
		}, {
			attribute_name : 'uitest'
		}, {
			attribute_name : 'uitest1'
		}, {
			attribute_name : 'uitest2'
		}];
		expect(ExplorerService).toBeDefined();
		expect(ExplorerService.processUrls(urls)).toEqual({
			uitest : [{
				attribute_name : 'uitest'
			}, {
				attribute_name : 'uitest'
			}],
			uitest1 : [{
				attribute_name : 'uitest1'
			}, {
				attribute_name : 'uitest1'
			}],
			uitest2 : [{
				attribute_name : 'uitest2'
			}, {
				attribute_name : 'uitest2'
			}]
		});
	}));
	it('getFileDiffSection', inject(function(ExplorerService) {
		var param = {
			test : 'unit'
		};
		expect(ExplorerService).toBeDefined();
		ExplorerService.getFileDiffSection(param).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	it('getDateRange', inject(function(ExplorerService) {
		var bundleName = "abcd";
		expect(ExplorerService).toBeDefined();
		ExplorerService.getDateRange(bundleName).then(function(response) {
			data = response.data;
		}, function(response) {

		});
	}));
	
}); 