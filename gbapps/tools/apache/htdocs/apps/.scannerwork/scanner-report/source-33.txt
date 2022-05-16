describe('logvault service : ', function() {
	beforeEach(module('gbApp.services.analytics', 'gbApp.services.dashboards', 'ui.bootstrap', 'gbApp.globals', 'ngCookies', 'ngTable', function($provide) {
		$provide.value('infoserverDomain', 'http://qasearch.glassbeam.com');
		$provide.value('manufacturer', undefined);
		$provide.value('product', undefined);
		$provide.value('schema', undefined);
		$provide.value('adminEmail', 'support@glassbeam.com');
		$provide.value('useLocal', true);
	}));

	describe('LogVaultService : ', function() {
		beforeEach(module('gbApp', 'gbApp.services', 'gbApp.services.logvault', 'ui.bootstrap', 'gbApp.globals', 'ngCookies', 'ngTable', function($provide) {
			$provide.value('infoserverDomain', 'http://qasearch.glassbeam.com');
			$provide.value('manufacturer', undefined);
			$provide.value('product', undefined);
			$provide.value('schema', undefined);
			$provide.value('adminEmail', 'support@glassbeam.com');
			$provide.value('useLocal', true);
		}));
		it('getData', inject(function(LogVaultService) {
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
			var quick_filter = "last10";
			var uploaded_by = "uitest";
			expect(LogVaultService).toBeDefined();
			LogVaultService.getData(start, rows, facets, start_date, end_date, sort_order, cl_timezone, quick_filter, uploaded_by).then(function(response) {
				data = response.data;
			}, function(response) {

			});
			start = 0;
			LogVaultService.getData(start, rows, facets, start_date, end_date, sort_order, cl_timezone, quick_filter, uploaded_by).then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('saveFilter', inject(function(LogVaultService) {
			var param = {
				"type" : "logavult",
				"request_type" : "add",
				"last_n_log" : 0,
				"last_n_log_uploaded_by_me" : 0,
				"facet_string" : "abcdefgh",
				"start_time" : new Date(),
				"end_time" : new Date(),
				"search_name" : "unittest",
				"search_desc" : "A long description for this view",
				"is_public" : 1
			};
			expect(LogVaultService).toBeDefined();
			LogVaultService.saveFilter(param).then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('getSavedFilters', inject(function(LogVaultService) {
			var param = {
				"request_type" : "GET",
				"type" : "logavult"
			};
			expect(LogVaultService).toBeDefined();
			LogVaultService.getSavedFilters(param).then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('deleteSavedFilter', inject(function(LogVaultService) {
			var param = {
				"request_type" : "CHANGE_VISIBILITY",
				"search_id" : 46,
				"is_public" : true
			};
			expect(LogVaultService).toBeDefined();
			LogVaultService.deleteSavedFilter(param).then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('getFileList', inject(function(LogVaultService) {
			var url = "obs_url=http://unittest.glassbeam.com/";
			expect(LogVaultService).toBeDefined();
			LogVaultService.getFileList(url).then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('getDownloadUrl', inject(function(LogVaultService) {
			var param = "{\"bundles\":[{\"bundle_name\":\"mahendru5.zip\"}],\"sys_id\":\"CP0004165\",\"obs_date\":\"2016-1-19T11:13:13Z\",\"download_type\":\"single\"}";
			expect(LogVaultService).toBeDefined();
			LogVaultService.getDownloadUrl(param).then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
	});
}); 