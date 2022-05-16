/* jasmine specs for apps services go here */

describe('apps service : ', function() {
    
    var manufacturer, product, schema, umsDomain;
    
	beforeEach(module('gbApp','gbApp.services.analytics', 'gbApp.services.dashboards', 'gbApp.services', 'gbApp.filters', 'ui.bootstrap', 'gbApp.globals', 'ngCookies', 'ngTable', function($provide) {
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
    }));

	describe('MenuService : ', function() {
		it('getConfig', inject(function(MenuService, $httpBackend) {
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', 'stat/menuconfig.json').respond([1, 2, 3]);
			expect(MenuService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			MenuService.getConfig().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
	});

	describe('DefaultFilterService : ', function() {
		it('getDefaultEndCust && setDefaultEndCust', inject(function(DefaultFilterService) {
			DefaultFilterService.setDefaultEndCust(1);
			expect(DefaultFilterService.getDefaultEndCust()).toEqual(1);
		}));
		it('getDefaultSysId && setDefaultSysId', inject(function(DefaultFilterService) {
			DefaultFilterService.setDefaultSysId(1);
			expect(DefaultFilterService.getDefaultSysId()).toEqual(1);
		}));
		it('getDefaultObservation && setDefaultObservation', inject(function(DefaultFilterService) {
			DefaultFilterService.setDefaultObservation(1);
			expect(DefaultFilterService.getDefaultObservation()).toEqual(1);
		}));
		it('getSelectedObservation && setSelectedObservation', inject(function(DefaultFilterService) {
			DefaultFilterService.setSelectedObservation(1);
			expect(DefaultFilterService.getSelectedObservation()).toEqual(1);
		}));
		it('getLoadPage && setLoadPage', inject(function(DefaultFilterService) {
			DefaultFilterService.setLoadPage(1);
			expect(DefaultFilterService.getLoadPage()).toEqual(1);
		}));
		it('getLoadSysId && setLoadSysId', inject(function(DefaultFilterService) {
			DefaultFilterService.setLoadSysId(1);
			expect(DefaultFilterService.getLoadSysId()).toEqual(1);
		}));
		it('getLoadObservation && setLoadObservation', inject(function(DefaultFilterService) {
			DefaultFilterService.setLoadObservation(1);
			expect(DefaultFilterService.getLoadObservation()).toEqual(1);
		}));
		it('getSelectedObsGrp && setSelectedObsGrp', inject(function(DefaultFilterService) {
			DefaultFilterService.setSelectedObsGrp('mostrecent');
			expect(DefaultFilterService.getSelectedObsGrp()).toEqual('mostrecent');
		}));
		it('getLogVaultRec && setLogVaultRec', inject(function(DefaultFilterService) {
			DefaultFilterService.setLogVaultRec(1);
			expect(DefaultFilterService.getLogVaultRec()).toEqual(1);
		}));
		it('getBundleDetailForSectionDiff && setBundleDetailForSectionDiff', inject(function(DefaultFilterService) {
			DefaultFilterService.setBundleDetailForSectionDiff(1);
			expect(DefaultFilterService.getBundleDetailForSectionDiff()).toEqual(1);
		}));
		it('getConfigDiffFields && setConfigDiffFields', inject(function(DefaultFilterService) {
			DefaultFilterService.setConfigDiffFields(1);
			expect(DefaultFilterService.getConfigDiffFields()).toEqual(1);
		}));
		it('getSysId2 && setSysId2', inject(function(DefaultFilterService) {
			DefaultFilterService.setSysId2(1);
			expect(DefaultFilterService.getSysId2()).toEqual('NA');
		}));
		it('getSubSys && setSubSys', inject(function(DefaultFilterService) {
			DefaultFilterService.setSubSys(1);
			expect(DefaultFilterService.getSubSys()).toEqual(1);
		}));
		it('getEC', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/analytics/standard/ecs/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			DefaultFilterService.getEC().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		it('getObservationsTimeRange', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			expect($httpBackend).toBeDefined();
			var data,ec={'ec_name':"abc"}, sid={'sys_id':'abc'}, fromTime, toTime;
			$httpBackend.expect('GET', infoserverDomain + '/bundles/time_range/' + manufacturer + '/' + product + '/' + schema+ '/' + ec['ec_name']+ '/' + sid['sys_id']+ '/' +fromTime+ '/' +toTime).respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			expect(data).toBeUndefined();
			DefaultFilterService.getObservationsTimeRange(ec, sid, fromTime, toTime).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
		}));
		it('getAllObservations', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			expect($httpBackend).toBeDefined();
			var data,ec="abc", sid={'sys_id':'abc'}, sid2, fromTime, toTime;
			$httpBackend.expect('GET', infoserverDomain + '/bundles/all/' + manufacturer + '/' + product + '/' + schema+ '/' + ec+ '/' + sid['sys_id']+ '/' +sid2).respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			expect(data).toBeUndefined();
			DefaultFilterService.getAllObservations(ec, sid, sid2).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
		}));
		it('getEcSys', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			expect($httpBackend).toBeDefined();
			var data,ec="abc", sid={'sys_id':'abc'}, sid2, fromTime, toTime;
			$httpBackend.expect('GET', infoserverDomain + '/analytics/ec/cluster/all/list/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			expect(data).toBeUndefined();
			DefaultFilterService.getEcSys(ec, sid, sid2).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
		}));
		it('getSerialNum', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			var data, ec;
			ec = {
				'ec_name' : "Glassbeam"
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/analytics/standard/systems/' + manufacturer + '/' + product + '/' + schema + '/' + ec['ec_name']).respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			expect(data).toBeUndefined();
			DefaultFilterService.getSerialNum(ec).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		/*it('getObservations', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			var data, ec, sid;
			ec = {
				'ec_name' : "Glassbeam"
			};
			sid = {
				'sys_id' : 's1'
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/bundles/all/' + manufacturer + '/' + product + '/' + schema + '/' + ec['ec_name'] + '/' + sid['sys_id'] +'?orderby=obs_ts DESC&limit=1').respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			expect(data).toBeUndefined();
			DefaultFilterService.getObservations(ec, sid).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));*/
		
		/*it('getAllObservations', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			var data, ec, sid;
			ec = {
				'ec_name' : "Glassbeam"
			};
			sid = {
				'sys_id' : 's1'
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/bundles/all/' + manufacturer + '/' + product + '/' + schema + '/' + ec['ec_name'] + '/' + sid['sys_id'] +'?orderby=obs_ts DESC').respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			expect(data).toBeUndefined();
			DefaultFilterService.getAllObservations(ec, sid).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));*/
		
		it('getEcSys', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/analytics/standard/ecs/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			DefaultFilterService.getEC().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('getDefaultFilterData', inject(function(DefaultFilterService, $httpBackend, infoserverDomain) {
			var data;
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/analytics/standard/default_filters/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			expect(data).toBeUndefined();
			DefaultFilterService.getDefaultFilterData().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		it('getObsGroups', inject(function(DefaultFilterService, $httpBackend, useLocal) {
			var data;
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', 'stat/obs_groups.json').respond([1, 2, 3]);
			expect(DefaultFilterService).not.toBeNull();
			expect(data).toBeUndefined();
			DefaultFilterService.getObsGroups().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
	});

	describe('SectionsMetaService : ', function() {

		it('getAppliedView && setAppliedView', inject(function(SectionsMetaService) {
			expect(SectionsMetaService).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			expect(SectionsMetaService.getAppliedView()).toBeFalsy();
			SectionsMetaService.setAppliedView(1);
			expect(SectionsMetaService.getAppliedView()).toBeTruthy();
			expect(SectionsMetaService.getAppliedView()).toEqual(1);
		}));
		
		it('setReady', inject(function(SectionsMetaService) {
			expect(SectionsMetaService).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			SectionsMetaService.setReady('r');
		}));

		it('getSections && setSections', inject(function(SectionsMetaService) {
			expect(SectionsMetaService.getSections()).toEqual(jasmine.any(Array));
			SectionsMetaService.setSections(1, 1);
			expect(SectionsMetaService.getSections(1)).toBeTruthy();
			expect(SectionsMetaService.getSections(1)).toEqual(1);
			SectionsMetaService.setSections({obs_time: '12 Jan 1989, 12:32:24'}, 1);
			SectionsMetaService.getSections({obs_time: '12 Jan 1989, 12:32:24'});
		}));

		it('getKbLink && setKbLink', inject(function(SectionsMetaService) {
			expect(SectionsMetaService.getKbLink()).toBeNull();
			SectionsMetaService.setKbLink('link');
			SectionsMetaService.setAppliedView('{}');
			expect(SectionsMetaService.getKbLink()).toBeTruthy();
			expect(SectionsMetaService.getKbLink()).toEqual('link');
		}));

		it('getLoadView && setLoadView', inject(function(SectionsMetaService) {
			SectionsMetaService.setLoadView('link');
			expect(SectionsMetaService.getLoadView()).toEqual('link');
		}));

		it('getLoadView && setLoadView', inject(function(SectionsMetaService) {
			SectionsMetaService.setLoadView('link');
			expect(SectionsMetaService.getLoadView()).toEqual('link');
		}));

		it('getSelectedView && setSelectedView', inject(function(SectionsMetaService) {
			SectionsMetaService.setSelectedView('link');
			expect(SectionsMetaService.getSelectedView()).toEqual('link');
		}));
		
		it('clearSectionView', inject(function(SectionsMetaService) {
			expect(SectionsMetaService).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			spyOn(SectionsMetaService, "getSections").and.returnValue([{}, {}]);
			SectionsMetaService.clearSectionView('scope');
		}));
		
		it('resetFilter', inject(function(SectionsMetaService) {
			expect(SectionsMetaService).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			var section = {
				columns: [{
						field: 'unittest1'
					}, {
						field: 'unittest2'
					}, {
						field: 'unittest3'
					}],
				filter: {
					unittest1: {},
					unittest2: {}
				},
				info: {
                    page: {
                        
                    }
                }
			};
			spyOn(SectionsMetaService, "populateSectionData");
			SectionsMetaService.resetFilter(section);
		}));
		
		it('exportXlsUrl', inject(function(SectionsMetaService, DefaultFilterService) {
			expect(SectionsMetaService).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			DefaultFilterService.setDefaultEndCust({
				ec_name: 'uitest'
			});
			DefaultFilterService.setDefaultSysId({
				sys_id: 23
			});
			DefaultFilterService.setDefaultObservation({
				obs_time: '19 January 2002, 19:23:54'
			});
			SectionsMetaService.exportXlsUrl({
				name: 'unit_test',
				table_name: 'unit_test',
				columns: [{
						field: 'unittest1'
					}, {
						field: 'unittest2'
					}, {
						field: 'unittest3'
					}],
				filter: {
					unittest1: {
						type: 'number',
						operator: 23
					},
					unittest2: {}
				}});
		}));

		it('getAll', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams) {
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('GET', infoserverDomain + '/meta/sections/type/' + manufacturer + '/' + product + '/' + schema + '/SECTION').respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.getAll().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		/*it('getSectionData', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, DefaultFilterService) {
			var table_name = 't1', ts = '2014-05-14T14:30:00.000', sr = 0, er = 10, sec_name = '';
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			DefaultFilterService.setDefaultEndCust({
				'ec_name' : 'Glassbeam'
			});
			DefaultFilterService.setDefaultSysId({
				"sys_id" : 1
			});
			DefaultFilterService.setDefaultObservation({
				'obs_time' : '2014-05-14T14:30:00.000'
			});
			$httpBackend.expect('GET', infoserverDomain + '/base/columns/system/ts/all/row_range/' + manufacturer + '/' + product + '/' + schema + '/' + DefaultFilterService.getDefaultEndCust()["ec_name"] + '/' + DefaultFilterService.getDefaultSysId()["sys_id"] + '/' + table_name + '/' + ts + '/' + sr + '/' + er).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.getSectionData(sec_name, table_name, sr, er).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('getSectionRawData', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, DefaultFilterService) {
			var table_name = 't1', sec_name = '';
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('GET', infoserverDomain + '/sectionview/content/' + manufacturer + '/' + product + '/' + schema + '?ns=&ts=2014-05-14T14:30:00.000').respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			DefaultFilterService.setDefaultObservation({
				'obs_time' : '2014-05-14T14:30:00.000'
			});
			SectionsMetaService.getSectionRawData(sec_name, table_name).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));*/

		it('saveSelectedView', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			var param, p_data = {};
			param = {
				'public' : true,
				'name' : 'Saved view',
				'default' : false
			};
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('POST', infoserverDomain + '/sectionview/add/' + manufacturer + '/' + product + '/' + schema + '/' + param['public'] + "/" + param.name + "/" + param['default']).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.saveSelectedView(param, p_data).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('getAllSavedViews', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('GET', infoserverDomain + '/sectionview/list/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.getAllSavedViews().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('deleteView', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			var param;
			param = {
				'view_name' : 'Saved view',
				'public' : false
			};
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('POST', infoserverDomain + '/sectionview/delete/' + manufacturer + '/' + product + '/' + schema + '/' + param.view_name).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.setViewName('Saved view');
			SectionsMetaService.deleteView(param).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('loadView', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			var param;
			param = {
				'view_name' : 'Saved view',
				'public' : false
			};
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('GET', infoserverDomain + '/sectionview/meta/' + manufacturer + '/' + product + '/' + schema + '/' + param.view_name).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.loadView(param).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('setDefault', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			var param;
			param = {
				'view_name' : 'Saved view',
				'public' : false
			};
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('POST', infoserverDomain + '/sectionview/setdefault/' + manufacturer + '/' + product + '/' + schema + '/' + param.view_name).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.setDefault(param).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		
		it('resetDefault', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			var param;
			param = {
				'view_name' : 'Saved view',
				'public' : false
			};
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('POST', infoserverDomain + '/sectionview/resetdefault/' + manufacturer + '/' + product + '/' + schema + '/' + param.view_name).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.resetDefault(param).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		
		it('setAccessibility', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			var param;
			param = {
				'view_name' : 'Saved view',
				'public' : false
			};
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('POST', infoserverDomain + '/sectionview/setpublic/' + manufacturer + '/' + product + '/' + schema + '/' + (param['public'] == false ? "true" : "false") + '/' + param.view_name).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.setAccessibility(param).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('getDefault', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			var param;
			param = {
				'view_name' : 'Saved view',
				'public' : false
			};
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('GET', infoserverDomain + '/sectionview/getdefault/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			SectionsMetaService.getDefault(param).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		/*it('loadData', inject(function(SectionsMetaService, $httpBackend, infoserverDomain, $q, DefaultFilterService, GlobalService) {
			var table_name = 't1', ts = '2014-05-14T14:30:00.000', sr = 0, er = GlobalService.getVal('rc_threshold'), sec_name = '';
			DefaultFilterService.setDefaultEndCust({
				'ec_name' : 'Glassbeam'
			});
			DefaultFilterService.setDefaultSysId({
				"sys_id" : 1
			});
			DefaultFilterService.setDefaultObservation({
				'obs_time' : '2014-05-14T14:30:00.000'
			});
			var section = {
				'name' : 'Section_name',
				'label' : 'Section_label',
				'table_name' : 't1',
				'ns' : 'Sections_ns',
				'filters': 'col1<4 AND col2>2 AND col3=5 AND col4~"abc"',
				'columns': [{'field': 'col1'}, {'field': 'col2'}, {'field': 'col3'}, {'field': 'col4'}]
			}, i = 1, deferred = $q.defer();
			expect(section.a_data).toBeUndefined();
			$httpBackend.expect('GET', infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/t1').respond({});
			$httpBackend.expect('GET', infoserverDomain + '/sectionview/content/' + manufacturer + '/' + product + '/' + schema + '?ns=' + section.name + '&ts=2014-05-14T14:30:00.000').respond({
				"Status" : "Success",
				"Msg" : "",
				"Data" : [{
					"section_name" : "\"ns2\"",
					"content" : "[\"show image version  \\n\\n----------------------------------\\nPartition       \\t: 0:0 (/dev/mtdblock9) **Default boot**\\nSoftware Version\\t: ArubaOS 6.3.1.5 (Digitally Signed - Production Build)\\nBuild number    \\t: 43118\\nLabel           \\t: 43118\\nBuilt on        \\t: Tue Apr 8 21:18:38 PDT 2014\\n----------------------------------\\nPartition       \\t: 0:1 (/dev/mtdblock10)\\nSoftware Version\\t: ArubaOS 6.3.1.3 (Digitally Signed - Production Build)\\nBuild number    \\t: 42233\\nLabel           \\t: 42233\\nBuilt on        \\t: Tue Feb 11 12:59:32 PST 2014\"]"
				}]
			});
			$httpBackend.expect('GET', infoserverDomain + '/base/columns/system/ts/all/row_range/' + manufacturer + '/' + product + '/' + schema + '/' + DefaultFilterService.getDefaultEndCust()["ec_name"] + '/' + DefaultFilterService.getDefaultSysId()["sys_id"] + '/' + table_name + '/' + ts + '/' + sr + '/' + er).respond({
				"Status" : "Success",
				"Msg" : "",
				"Data" : {
					"table" : "t1",
					"data" : [{
						"time" : "2014-05-14T14:30:00.000",
						"rows" : [{
							"row" : 1,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 2,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 3,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 4,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 5,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 6,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 7,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 8,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 9,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 10,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 11,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 12,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 13,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 14,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 15,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 16,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 17,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 18,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 19,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 20,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 21,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 22,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 23,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 24,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 25,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 26,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 27,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 28,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 29,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 1000.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 30,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 2000.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 31,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 10.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 32,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 20.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 33,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 10.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 34,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 20.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 35,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 10.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 36,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 20.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 37,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 10.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 38,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 20.0
							}, {
								"c12" : 20
							}]
						}, {
							"row" : 39,
							"columns" : [{
								"c11" : "c11.1"
							}, {
								"c13" : 10.0
							}, {
								"c12" : 10
							}]
						}, {
							"row" : 40,
							"columns" : [{
								"c11" : "c11.2"
							}, {
								"c13" : 20.0
							}, {
								"c12" : 20
							}]
						}]
					}]
				}
			});

			SectionsMetaService.loadData(section, {}, deferred, i);
			$httpBackend.flush();
			expect(section.a_data).toBeDefined();
			expect(section.columns).toBeDefined();
			expect(section.transpose).toBeFalsy();
			expect(section.meta).toEqual(jasmine.any(Object));
			expect(section.meta['shownAll']).toBeTruthy();
			//expect(section.tableParams).toEqual(jasmine.any(Object));
			expect(section.rawdata).toBeDefined();
		}));*/
		
		it('loadData with a_data', inject(function(SectionsMetaService) {
			var t_section = {
				a_data: true,
				info: {
				    page: {
				        
				    }
				},
				meta: {}
			}, i = 1;
			
			var defer = {
				resolve : function() {
					
				}
			};
			
			spyOn(defer, "resolve");
			spyOn(SectionsMetaService, "populateSectionData");
			SectionsMetaService.loadData(t_section, {}, defer, i);
		}));

		it('processData', inject(function(SectionsMetaService) {
			var data = {"table":"sys_proto","data":[{"time":"2016-03-16T10:31:03Z","rows":[{"row":1,"columns":[{"host_nametmp":"Hostname is OAW-4704"},{"host_name":"OAW-4704"},{"sys_time":"Wed Mar 16 18:31:03 IST 2016"},{"sys_crash_info":"Crash information available."},{"reboot_cause":"User reboot."},{"cust_name_alias":"Avnet Logistics USLP"},{"domain_temp":"NA"},{"obs_mail_id":"aklank.choudhary@glassbeam.com"},{"sys_custmail_id":"aklank.choudhary@glassbeam.com"},{"sys_domain_name":"NA"},{"obs_domain_temp":"glassbeam.com"},{"sys_timezone":"GMTGMT8"},{"sys_date":"NA"},{"cond_temp":"0"},{"sys_version_new":503},{"callhome_type":"SFDC"},{"obs_label":"SFDC"},{"obs_log_type":"SFDC"},{"sys_display_name":"CP0004165-OAW-4704"},{"obs_date_str":"Wed Mar 16 18:31:03 2016 +0800"},{"obs_url":"/ebs/work/anurag/gbnewplatform/target/universal/scalar/permanent/aruba/aruba/aruba/pod52/2017-Apr-17.06.-0400/aruba_2016.1492424435913/aruba_2016.zip"},{"sysid1":"CP0004165"},{"sys_model":"Aruba3600"},{"sys_version":"5.0.3.0"},{"cust_name":"Avnet Logistics, USLP"},{"ticket_num":"1498514"}]}]}],"row_count":1};
			var refCol = {"obs_mail_id":"","obs_url":"Bundle URL","sys_time":"System Time","sys_custmail_id":"Customer Email","sys_timezone":"System Time Zone","cond_temp":"","sys_model":"System Model","cust_name_alias":"Account Name Alias","sys_display_name":"System display name","callhome_type":"","sys_version":"Version","obs_ts":"","sys_domain_name":"Domain Name","host_name":"Host Name","sys_date":"System Time","obs_label":"","obs_domain_temp":"","obs_log_type":"","sys_version_new":"Version","host_nametmp":"","cust_name":"Account Name","obs_date_str":"System Time","ticket_num":"Ticket Number","sysid1":"Serial Number","sys_crash_info":"crash information","domain_temp":"","reboot_cause":"Reboot Cause"};
			var pData = [{"host_name":"OAW-4704","sys_time":"Wed Mar 16 18:31:03 IST 2016","sys_crash_info":"Crash information available.","reboot_cause":"User reboot.","cust_name_alias":"Avnet Logistics USLP","sys_custmail_id":"aklank.choudhary@glassbeam.com","sys_domain_name":"NA","sys_timezone":"GMTGMT8","sys_date":"NA","sys_version_new":503,"sys_display_name":"CP0004165-OAW-4704","sysid1":"CP0004165","sys_model":"Aruba3600","sys_version":"5.0.3.0","cust_name":"Avnet Logistics, USLP","ticket_num":"1498514"}];
			expect(SectionsMetaService.processData).toEqual(jasmine.any(Function));
			expect(SectionsMetaService.processData(data,refCol)).toEqual(pData);
		}));


		it('populateSectionData', inject(function(SectionsMetaService) {
			var sections = {
				"name": "mc",
				"label": "Controller Information",
				"namespace_type": "SECTION",
				"table_name": "sys_proto",
				"icon_type": "NVPAIR_BASIC",
				"namespace_ref": "",
				"namespace_desc": "Controller Information",
				"namespace_actual": "mc",
				"selected": true,
				"default": true,
				"visible": true,
				"no_cols": false,
				"d_loading": false,
				"r_loading": false,
				"showlog": false,
				"rawdata": "Host Name: Hostname i2",
				"rawdataArr": ["Host Name: Hostname is OAW-4704", "System Time:Wed Mar 16 18:31:03 IST 2016"],
				"columnsMap": {
					"obs_mail_id": "",
					"obs_url": "Bundle URL",
					"sys_time": "System Time",
					"sys_custmail_id": "Customer Email",
					"sys_timezone": "System Time Zone",
					"cond_temp": "",
					"obs_log_type": "",
					"sysid1": "Serial Number",
					"sys_crash_info": "crash information",
					"domain_temp": "",
					"reboot_cause": "Reboot Cause"
				},
				"columnType": {
					"obs_mail_id": "",
					"obs_url": "G",
					"callhome_type": "",
					"sys_version": "G",
					"obs_ts": "G",
					"sys_domain_name": "",
					"host_name": "",
					"sys_date": "",
					"sys_crash_info": "",
					"domain_temp": "",
					"reboot_cause": ""
				},
				"tot_count": 1,
				"a_data": [{
					"host_name": "OAW-4704",
					"sys_time": "Wed Mar 16 18:31:03 IST 2016",
					"sys_crash_info": "Crash information available.",
					"reboot_cause": "User reboot.",
					"sysid1": "CP0004165",
					"sys_model": "Aruba3600",
					"sys_version": "5.0.3.0",
					"cust_name": "Avnet Logistics, USLP",
					"ticket_num": "1498514"
				}],
				"columns": [{
					"title": "host_name",
					"field": "host_name",
					"visible": true,
					"selected": true,
					"type": "string",
					"operator": ">"
				}, {
					"title": "sys_time",
					"field": "sys_time",
					"visible": true,
					"selected": true,
					"type": "string",
					"operator": ">"
				}, {
					"title": "sys_crash_info",
					"field": "sys_crash_info",
					"visible": true,
					"selected": true,
					"type": "string",
					"operator": ">"
				}, {
					"title": "reboot_cause",
					"field": "reboot_cause",
					"visible": true,
					"selected": true,
					"type": "string",
					"operator": ">"
				}, {
					"title": "cust_name_alias",
					"field": "cust_name_alias",
					"visible": true,
					"selected": true,
					"type": "string",
					"operator": ">"
				}, {
					"title": "sys_version",
					"field": "sys_version",
					"visible": false,
					"selected": false,
					"type": "string",
					"operator": ">"
				}, {
					"title": "cust_name",
					"field": "cust_name",
					"visible": false,
					"selected": false,
					"type": "string",
					"operator": ">"
				}, {
					"title": "ticket_num",
					"field": "ticket_num",
					"visible": false,
					"selected": false,
					"type": "string",
					"operator": ">"
				}],
				"meta": {
					"shownAll": false
				},
				"filter": {},
				"count": 10,
				"info": {
					"page": {
						"total": 0,
						"current": 1,
						"pages": 0,
						"count": 10
					}
				}
			};
			expect(SectionsMetaService.populateSectionData).toEqual(jasmine.any(Function));
			SectionsMetaService.populateSectionData(sections);
		}));

		it('getColumnDefs', inject(function(SectionsMetaService) {
			var data = [{
				key1: 'string',
				key2: 1000,
				key3: true
			}];
			var cols = [ { title: 'key1', field: 'key1', visible: true, selected: true, type: 'string', operator: '>' }, { title: 'key2', field: 'key2', visible: true, selected: true, type: 'number', operator: '>' }, { title: 'key3', field: 'key3', visible: true, selected: true, type: 'boolean', operator: '>' } ];
			expect(SectionsMetaService.getColumnDefs(data)).toEqual(cols);
		}));
		it('parseSavedView', inject(function(SectionsMetaService) {
			var view = {
				"public" : false,
				"default" : false,
				"desc" : "sdfjkl;",
				"kbase" : "http://gsgd",
				"cols" : ["ns2:c11"],
				"filters" : [],
				"transpose" : ["ns2:true,"]
			};
			var p_view = {
				"ns2" : ["c11"]
			};
			expect(SectionsMetaService.parseSavedView(view));
		}));
/*
		it('getS2', inject(function(SectionsMetaService,infoserverDomain,$httpBackend) {
			expect(SectionsMetaService.getS2).toEqual(jasmine.any(Function));
			//$httpBackend.expect('GET', infoserverDomain + '/analytics/ec/cluster/sysid/all/list/' + manufacturer + '/' + product + '/' + GlobalService.getVal('schema') + '/' + ec + '/' + sid1).respond([1, 2, 3]);
			SectionsMetaService.getS2();
			//$httpBackend.flush();
		}));
		*/
		it('parseFilters', inject(function(SectionsMetaService) {
			var view = {
				"public" : false,
				"default" : false,
				"desc" : "sdfjkl;",
				"kbase" : "http://gsgd",
				"cols" : ["ns2:c11"],
				"filters" : ['sectionname:sys_uptime:~:5 minutes,sectionname:col2:=:4'],
				"transpose" : ["ns2:true,"]
			};
			expect(SectionsMetaService.parseFilters(view)).toEqual({ sectionname: 'sys_uptime~"5 minutes" AND col2=4' });
			view.filters = [];
			expect(SectionsMetaService.parseFilters(view)).toBeUndefined();
		}));

		it('applyView', inject(function(SectionsMetaService, $httpBackend, infoserverDomain) {
			var view = {
				"public" : false,
				"default" : false,
				"desc" : "sdfjkl;",
				"kbase" : "http://gsgd",
				"cols" : ["ns2:c11"],
				"filters" : [""],
				"transpose" : ["ns2:true,"]
			};
			expect(SectionsMetaService.getAppliedView()).toBeFalsy();
			expect(SectionsMetaService.getKbLink()).toBeFalsy();
			spyOn(SectionsMetaService, "getSections").and.returnValue([{name: 'ns2', columns: [{field: 'field1'}, {field: 'field2'}], filter: {field1: {value: 'field1'}, field2: {value: 'field2'}}}, {}]);
			spyOn(SectionsMetaService, "loadData");
			spyOn(SectionsMetaService, "parseFilters").and.returnValue({});
            SectionsMetaService.applyView(view);
			expect(SectionsMetaService.getAppliedView()).toBeTruthy();
			expect(SectionsMetaService.getKbLink()).toBeTruthy();
		}));
	});

	describe('Analytics : ', function() {

		it('standard_user_tracking', inject(function(Analytics, $httpBackend, infoserverDomain) {
			var module, activity, details;
			module = "Module";
			activity = "Activity";
			details = "Details";
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Analytics/' + module + '/' + activity).respond([1, 2, 3]);
			expect(Analytics).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			Analytics.standard_user_tracking(module, activity, details).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('custom_x_gby_y', inject(function(Analytics, $httpBackend, infoserverDomain) {
			var instance = {
				id : '123',
				dashboardId : '456'
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/analytics/x_gby_y/' + manufacturer + '/' + product + '/' + schema + '/all/model/system_count/' + instance.dashboardId + '/' + instance.id).respond([1, 2, 3]);
			expect(Analytics).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			Analytics.custom_x_gby_y(instance).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		it('custom_user_tracking', inject(function(Analytics, $httpBackend, infoserverDomain) {
			var d_id = 123, r_id = 456;
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/' + d_id + '/' + r_id).respond([1, 2, 3]);
			expect(Analytics).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			Analytics.custom_user_tracking(d_id, r_id).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
	});

	describe('NavigationService : ', function() {

		// it('setInfoServerUp && isInfoServerUp', inject(function(NavigationService) {
		// expect(NavigationService.isInfoServerUp()).toBeFalsy();
		// NavigationService.setInfoServerUp(true);
		// expect(NavigationService.isInfoServerUp()).toBeTruthy();
		// }));

		// it('setAuthorized && getAuthorized', inject(function(NavigationService) {
		// expect(NavigationService.getAuthorized()).toBeFalsy();
		// NavigationService.setAuthorized(true);
		// expect(NavigationService.getAuthorized()).toBeTruthy();
		// }));
		// it('getUrlByKey', inject(function(NavigationService) {
		// var route_map = {
		// 'dashboards' : '/apps/app/partials/dashboards.html',
		// 'sectionview' : '/apps/app/partials/sectionview.html',
		// 'trendsview' : '/apps/app/partials/trendsview.html',
		// 'configdiff' : '/apps/app/partials/configdiff.html'
		// };
		// expect(NavigationService.getUrlByKey('dashboards')).toEqual('/apps/app/partials/dashboards.html');
		// expect(NavigationService.getUrlByKey('sectionview')).toEqual('/apps/app/partials/sectionview.html');
		// expect(NavigationService.getUrlByKey('trendsview')).toEqual('/apps/app/partials/trendsview.html');
		// expect(NavigationService.getUrlByKey('configdiff')).toEqual('/apps/app/partials/configdiff.html');
		// }));
		// it('getUrl && setUrl', inject(function(NavigationService, GlobalService) {
		// var SharedGlobal = function() {
		// var info_srv_up = false, authorized = false;
		// return {
		// setInfoserverUp : function(bool) {
		// info_srv_up = bool;
		// },
		// getInfoserverUp : function() {
		// return info_srv_up;
		// },
		// setAuthorized : function(bool) {
		// authorized = bool;
		// },
		// getAuthorized : function() {
		// return authorized;
		// }
		// };
		// }();
		// var route_map = {
		// 'dashboards' : '/apps/app/partials/dashboards.html',
		// 'sectionview' : '/apps/app/partials/sectionview.html',
		// 'trendsview' : '/apps/app/partials/trendsview.html',
		// 'configdiff' : '/apps/app/partials/configdiff.html'
		// };
		// NavigationService.setInfoServerUp(true);
		// NavigationService.setAuthorized(true);
		// expect(NavigationService.getUrl()).toBeDefined();
		// expect(NavigationService.getUrl()).toEqual(route_map[GlobalService.getVal('default_landing_page')]);
		// NavigationService.setUrl('sectionview');
		// expect(NavigationService.getUrl()).toBeDefined();
		// expect(NavigationService.getUrl()).toEqual(route_map['sectionview']);
		// NavigationService.setUrl('trendsview');
		// expect(NavigationService.getUrl()).toBeDefined();
		// expect(NavigationService.getUrl()).toEqual(route_map['trendsview']);
		// NavigationService.setUrl('configdiff');
		// expect(NavigationService.getUrl()).toBeDefined();
		// expect(NavigationService.getUrl()).toEqual(route_map['configdiff']);
		// }));
	});

	describe('ConfigDiffService: ', function() {
		it('getAll', inject(function(ConfigDiffService, SectionsMetaService, infoserverDomain, $httpBackend) {
			expect($httpBackend).toBeDefined();
			expect(SectionsMetaService).not.toBeNull();
			$httpBackend.expect('GET', infoserverDomain + '/meta/sections/type/' + manufacturer + '/' + product + '/' + schema + '/SECTION').respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.getAll().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('getDefault', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, ngTableParams, $cookies) {
			var param;
			param = {
				'view_name' : 'Saved view',
				'public' : false
			};
			expect($httpBackend).toBeDefined();
			expect(ConfigDiffService).not.toBeNull();
			$httpBackend.expect('GET', infoserverDomain + '/configview/getdefault/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.getDefault(param).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		
	   it('resetFilter', inject(function(ConfigDiffService) {
	        expect(ConfigDiffService).toBeDefined();
            expect(ConfigDiffService).not.toBeNull();
            var section = {keys: [{}, {}]};
            ConfigDiffService.resetFilter(section);
	   }));

		it('getLoadView && setLoadView', inject(function(ConfigDiffService) {
			ConfigDiffService.setLoadView('link');
			expect(ConfigDiffService.getLoadView()).toEqual('link');
		}));

		it('getViewName && setViewName', inject(function(ConfigDiffService) {
			ConfigDiffService.setViewName('link');
			expect(ConfigDiffService.getViewName()).toEqual('link');
		}));

		it('getSysId2 && setSysId2', inject(function(ConfigDiffService) {
			ConfigDiffService.setSysId2('link');
			expect(ConfigDiffService.getSysId2()).toEqual('NA');
		}));

		it('getSelectedView && setSelectedView', inject(function(ConfigDiffService) {
			ConfigDiffService.setSelectedView('link');
			expect(ConfigDiffService.getSelectedView()).toEqual('link');
		}));
		
		it('applyView', inject(function(ConfigDiffService) {
			expect(ConfigDiffService).toBeDefined();
			expect(ConfigDiffService).not.toBeNull();
			var view = {
				obs_ct: ['abc, def, ghi', 'jkl, mno'],
				cols: ['uvw, xyz']
			};
			var sections = [{
				table_name: 'abc'
			}, {
				table_name: 'def'
			}, {
				table_name: 'xyz'
			}];
			ConfigDiffService.applyView(view, {}, sections, 1, 1, 1);
			expect(sections).toEqual([ { table_name: 'abc', default: true, selected: true, count: 2, no_cols: false, data: null, ref_data: null, shownAll: true, loading: true, visible: true}, { table_name: 'def', default: false, selected: false }, { table_name: 'xyz', default: false, selected: false } ]);
			spyOn(ConfigDiffService, "parseSavedView").and.returnValue({abc: {}, def: {}});
			sections = [{
                table_name: 'abc'
            }, {
                table_name: 'def'
            }, {
                table_name: 'xyz'
            }];
			ConfigDiffService.applyView(view, {}, sections, 1, 1, 1);
		}));
		
		it('parseSavedView', inject(function(ConfigDiffService) {
            expect(ConfigDiffService).toBeDefined();
            expect(ConfigDiffService).not.toBeNull();
            var view = {cols: ['abc:col0,abc:col1,def:col0'], obs_ct: ['abc:col0,abc:col1,def:col0']};
            expect(ConfigDiffService.parseSavedView(view)).toEqual({ abc: { cols: [ 'col0', 'col1' ], obs_cnt: 'col1' }, def: { cols: [ 'col0' ], obs_cnt: 'col0' } });
        }));
		
		it('parseData', inject(function(ConfigDiffService) {
			expect(ConfigDiffService).toBeDefined();
			expect(ConfigDiffService).not.toBeNull();
			var section = {
				columnsMap: {
					obs1: 'uvw',
					col2: 'xyz'
				}
			};
			var data = {
				data: [{
					rows: [{
						columns: [{
							obs1: 'abc'
						}, {
							col2: 'def'
						}]
					}]
				}]
			};
			ConfigDiffService.parseData(section, data);
			expect(section).toEqual({ columnsMap: { obs1: 'uvw', col2: 'xyz' }, keys: [ { key: 'col2', col_name: 'xyz', visible: true, changed: false } ], data: [ { obs: undefined, data: { col2: 'def' } } ], ref_data: { col2: 'def' } });
			section.keys = [{}, {}];
			ConfigDiffService.parseData(section, data);
			section.keys = [{key: 'xyz'}, {key: 'sde'}];
			ConfigDiffService.parseData(section, data);
		}));

		it('getAppliedView && setAppliedView', inject(function(ConfigDiffService) {
			expect(ConfigDiffService).toBeDefined();
			expect(ConfigDiffService).not.toBeNull();
			expect(ConfigDiffService.getAppliedView()).toBeFalsy();
			ConfigDiffService.setAppliedView(1);
			expect(ConfigDiffService.getAppliedView()).toBeTruthy();
			expect(ConfigDiffService.getAppliedView()).toEqual(1);
		}));

		it('getSections && setSections', inject(function(ConfigDiffService) {
			expect(ConfigDiffService.getSections()).toEqual(jasmine.any(Array));
			ConfigDiffService.setSections(1, 1);
			expect(ConfigDiffService.getSections(1)).toBeTruthy();
			expect(ConfigDiffService.getSections(1)).toEqual(1);
		}));

		it('getKbLink && setKbLink', inject(function(ConfigDiffService) {
			expect(ConfigDiffService.getKbLink()).toBeNull();
			ConfigDiffService.setKbLink('link');
			ConfigDiffService.setAppliedView('{}');
			expect(ConfigDiffService.getKbLink()).toBeTruthy();
			expect(ConfigDiffService.getKbLink()).toEqual('link');
		}));
		it('getViewsCount && setViewsCount', inject(function(ConfigDiffService) {
			ConfigDiffService.setViewsCount(4);
			expect(ConfigDiffService.getViewsCount()).toEqual(4);
		}));
		
		it('clearConfigDiff', inject(function(ConfigDiffService) {
			spyOn(ConfigDiffService, "getSections").and.returnValue([{}, {}]);
			ConfigDiffService.clearConfigDiff();
		}));
		/*
		it('loadData', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, $q, DefaultFilterService, GlobalService) {
			var obs = {
				'obs_time' : '2014-05-14T14:30:00'
			}, ec = {
				'ec_name' : 'glass'
			}, sysId = {
				'sys_id' : 'abc'
			};
			var section = {
				'name' : 'Section_name',
				'label' : 'Section_label',
				'table_name' : 't1',
				'ns' : 'Sections_ns',
				'count' : 2
			}, i = 1, deferred = $q.defer();
			expect(section.a_data).toBeUndefined();
			$httpBackend.expect('GET', infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/t1').respond({Data: [{sec1: {attribute_label: 'label1', attribute_facet: 'S'}}, {sec2: {attribute_label: 'label2', attribute_facet: ''}}]});
			$httpBackend.expect('GET', infoserverDomain + '/base/columns/system/ts/named/last_n/' + manufacturer + '/' + product + '/' + schema + '/' + ec['ec_name'] + '/' + sysId['sys_id'] + '/' + section.table_name + '/' + obs['obs_time'] + '/' + section.count).respond({
				'Data' : []
			});
			ConfigDiffService.loadData(section, {}, ec, sysId, obs);
			expect(section.a_data).toBeUndefined();
			expect(section.count).toEqual(2);
			expect(section.keys).toBeUndefined();
			expect(section.shownAll).toBeTruthy();
			expect(section.no_cols).toBeFalsy();
			expect(section.loading).toBeTruthy();
			expect(section.visible).toBeTruthy();
			expect(section.isTranspose).toBeFalsy();
			$httpBackend.flush();
			expect(section.data).toBeNull();
			expect(section.ref_data).toBeNull();
		}));
		
		it('loadData with section data', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, $q, DefaultFilterService, GlobalService) {
            var obs = {
                'obs_time' : '2014-05-14T14:30:00'
            }, ec = {
                'ec_name' : 'glass'
            }, sysId = {
                'sys_id' : 'abc'
            };
            var section = {
                'name' : 'Section_name',
                'label' : 'Section_label',
                'table_name' : 't1',
                'ns' : 'Sections_ns',
                'count' : 2,
                'keys': [{key: 'col1'}, {key: 'col2'}]
            }, i = 1, deferred = $q.defer();
            expect(section.a_data).toBeUndefined();
            spyOn(ConfigDiffService, "parseData");
            $httpBackend.expect('GET', infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/t1').respond({Data: [{col1: {column_name: 'col1', attribute_label: 'label1', attribute_facet: 'S'}}, {col2: {column_name: 'col2', attribute_label: 'label2', attribute_facet: ''}}]});
            section.keys = [{key: 'col1'}, {key: 'col2'}];
            $httpBackend.expect('GET', infoserverDomain + '/base/columns/system/ts/named/last_n/' + manufacturer + '/' + product + '/' + schema + '/' + ec['ec_name'] + '/' + sysId['sys_id'] + '/' + section.table_name + '/' + obs['obs_time'] + '/' + section.count).respond({
                'Data' : {data: [{}, {}]}
            });
            ConfigDiffService.loadData(section, {}, ec, sysId, obs, deferred);
            expect(section.a_data).toBeUndefined();
            expect(section.count).toEqual(2);
            expect(section.keys).toEqual([{key: 'col1'}, {key: 'col2'}]);
            expect(section.shownAll).toBeUndefined();
            expect(section.no_cols).toBeFalsy();
            expect(section.loading).toBeTruthy();
            expect(section.visible).toBeTruthy();
            expect(section.isTranspose).toBeFalsy();
            $httpBackend.flush();
        }));
        
        it('loadData with diff data error block', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, $q, DefaultFilterService, GlobalService) {
            var obs = {
                'obs_time' : '2014-05-14T14:30:00'
            }, ec = {
                'ec_name' : 'glass'
            }, sysId = {
                'sys_id' : 'abc'
            };
            var section = {
                'name' : 'Section_name',
                'label' : 'Section_label',
                'table_name' : 't1',
                'ns' : 'Sections_ns',
                'count' : 2,
                'keys': [{key: 'col1'}, {key: 'col2'}]
            }, i = 1, deferred = $q.defer();
            spyOn(ConfigDiffService, "parseData");
            $httpBackend.expect('GET', infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/t1').respond({Data: [{col1: {column_name: 'col1', attribute_label: 'label1', attribute_facet: 'S'}}, {col2: {column_name: 'col2', attribute_label: 'label2', attribute_facet: ''}}]});
            $httpBackend.expect('GET', infoserverDomain + '/base/columns/system/ts/named/last_n/' + manufacturer + '/' + product + '/' + schema + '/' + ec['ec_name'] + '/' + sysId['sys_id'] + '/' + section.table_name + '/' + obs['obs_time'] + '/' + section.count).respond(500);
            ConfigDiffService.loadData(section, {info: {}}, ec, sysId, obs);
            $httpBackend.flush();
        }));
        
        it('loadData with diff data error block session timeout', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, $q, DefaultFilterService, GlobalService, ModalService) {
            var obs = {
                'obs_time' : '2014-05-14T14:30:00'
            }, ec = {
                'ec_name' : 'glass'
            }, sysId = {
                'sys_id' : 'abc'
            };
            var section = {
                'name' : 'Section_name',
                'label' : 'Section_label',
                'table_name' : 't1',
                'ns' : 'Sections_ns',
                'count' : 2,
                'keys': [{key: 'col1'}, {key: 'col2'}]
            }, i = 1, deferred = $q.defer();
            spyOn(ConfigDiffService, "parseData");
            spyOn(ModalService, "sessionTimeout");
            $httpBackend.expect('GET', infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/t1').respond({Data: [{col1: {column_name: 'col1', attribute_label: 'label1', attribute_facet: 'S'}}, {col2: {column_name: 'col2', attribute_label: 'label2', attribute_facet: ''}}]});
            $httpBackend.expect('GET', infoserverDomain + '/base/columns/system/ts/named/last_n/' + manufacturer + '/' + product + '/' + schema + '/' + ec['ec_name'] + '/' + sysId['sys_id'] + '/' + section.table_name + '/' + obs['obs_time'] + '/' + section.count).respond(500, {Msg: 'timeout'});
            ConfigDiffService.loadData(section, {info: {}}, ec, sysId, obs);
            $httpBackend.flush();
        }));
        
        it('loadData with diff get columns error block', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, $q, DefaultFilterService, GlobalService, ModalService) {
            var obs = {
                'obs_time' : '2014-05-14T14:30:00'
            }, ec = {
                'ec_name' : 'glass'
            }, sysId = {
                'sys_id' : 'abc'
            };
            var section = {
                'name' : 'Section_name',
                'label' : 'Section_label',
                'table_name' : 't1',
                'ns' : 'Sections_ns',
                'count' : 2,
                'keys': [{key: 'col1'}, {key: 'col2'}]
            }, i = 1, deferred = $q.defer();
            spyOn(ConfigDiffService, "parseData");
            spyOn(ModalService, "sessionTimeout");
            $httpBackend.expect('GET', infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/t1').respond(500);
            ConfigDiffService.loadData(section, {info: {}}, ec, sysId, obs);
            $httpBackend.flush();
        }));
        
        it('loadData with diff get columns error block session timeout', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, $q, DefaultFilterService, GlobalService, ModalService) {
            var obs = {
                'obs_time' : '2014-05-14T14:30:00'
            }, ec = {
                'ec_name' : 'glass'
            }, sysId = {
                'sys_id' : 'abc'
            };
            var section = {
                'name' : 'Section_name',
                'label' : 'Section_label',
                'table_name' : 't1',
                'ns' : 'Sections_ns',
                'count' : 2,
                'keys': [{key: 'col1'}, {key: 'col2'}]
            }, i = 1, deferred = $q.defer();
            spyOn(ConfigDiffService, "parseData");
            spyOn(ModalService, "sessionTimeout");
            $httpBackend.expect('GET', infoserverDomain + '/meta/columns/table_name/' + manufacturer + '/' + product + '/' + schema + '/t1').respond(500, {Msg: 'timeout'});
            ConfigDiffService.loadData(section, {info: {}}, ec, sysId, obs);
            $httpBackend.flush();
        }));

		it('getDiffData', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, DefaultFilterService) {
			expect($httpBackend).toBeDefined();
			expect(ConfigDiffService).not.toBeNull();
			var section = {
				'name' : 'Section_name',
				'label' : 'Section_label',
				'table_name' : 't1',
				'ns' : 'Sections_ns'
			}, ec = 'Glass', system = 'sys1', ts = '2014-05-14T14:30:00', n = 2;
			$httpBackend.expect('GET', infoserverDomain + '/base/columns/system/ts/named/last_n/' + manufacturer + '/' + product + '/' + schema + '/' + ec + '/' + system + '/' + section.table_name + '/' + ts + '/' + n).respond([1, 2, 3]);
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.getDiffData(ec, system, section.ns, section.table_name, ts, n).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));*/

		it('saveSelectedView', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, DefaultFilterService) {
			expect($httpBackend).toBeDefined();
			expect(ConfigDiffService).not.toBeNull();
			var section = {
				'name' : 'Section_name',
				'label' : 'Section_label',
				'table_name' : 't1',
				'ns' : 'Sections_ns'
			}, ec = 'Glass', system = 'sys1', ts = '2014-05-14T14:30:00', n = 2, param = {
				'name' : 'MyView',
				'public' : true,
				'default' : true
			}, t_data = {
				'desc' : '',
				'kbase' : ''
			}, data;
			$httpBackend.expect('POST', infoserverDomain + '/configview/add/' + manufacturer + '/' + product + '/' + schema + '/' + param['public'] + "/" + param.name + "/" + param['default']).respond([1, 2, 3]);
			expect(data).toBeUndefined();
			ConfigDiffService.saveSelectedView(param, t_data).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('getSavedViews', inject(function(ConfigDiffService, $httpBackend, infoserverDomain) {
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/configview/list/' + manufacturer + '/' + product + '/' + schema).respond([1, 2, 3]);
			expect(ConfigDiffService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.getSavedViews().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('setDefault', inject(function(ConfigDiffService, $httpBackend, infoserverDomain) {
			var view = {
				'view_name' : 'MyView',
				'public' : true
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('POST', infoserverDomain + '/configview/setdefault/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond([1, 2, 3]);
			expect(ConfigDiffService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.setDefault(view).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('resetDefault', inject(function(ConfigDiffService, $httpBackend, infoserverDomain) {
			var view = {
				'view_name' : 'MyView',
				'public' : true
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('POST', infoserverDomain + '/configview/resetdefault/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond([1, 2, 3]);
			expect(ConfigDiffService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.resetDefault(view).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('deleteView', inject(function(ConfigDiffService, $httpBackend, infoserverDomain) {
			var view = {
				'view_name' : 'MyView',
				'public' : true
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('POST', infoserverDomain + '/configview/delete/' + manufacturer + '/' + product + '/' + schema + '/' + view.view_name).respond([1, 2, 3]);
			expect(ConfigDiffService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.deleteView(view).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('setAccessibility', inject(function(ConfigDiffService, $httpBackend, infoserverDomain) {
			var view = {
				'view_name' : 'MyView',
				'public' : true
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('POST', infoserverDomain + '/configview/setpublic/' + manufacturer + '/' + product + '/' + schema + '/' + view['public'] + '/' + view.view_name).respond([1, 2, 3]);
			expect(ConfigDiffService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.setAccessibility(view).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));

		it('loadView', inject(function(ConfigDiffService, $httpBackend, infoserverDomain) {
			var param = {
				'view_name' : 'MyView',
				'public' : true,
				'created_by' : 'uitest'
			};
			expect($httpBackend).toBeDefined();
			$httpBackend.expect('GET', infoserverDomain + '/configview/meta/' + manufacturer + '/' + product + '/' + schema + '/' + param.view_name + '?created_by=uitest').respond([1, 2, 3]);
			expect(ConfigDiffService).not.toBeNull();
			var data;
			expect(data).toBeUndefined();
			ConfigDiffService.loadView(param).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
			expect(data).toBeUndefined();
			$httpBackend.flush();
			expect(data).toBeDefined();
			expect(data).toEqual([1, 2, 3]);
		}));
		
		it('exportXlsUrl', inject(function(ConfigDiffService) {
			expect(ConfigDiffService).not.toBeNull();
			var param = {
				columns: [{
					field: 'abc'
				}, {
					field: 'xyz'
				}],
				name: 'unit',
				table_name: 'unit_table',
				count: 2,
				keys: [{
					key: 'key1'
				}, {
					key: 'key2'
				}]
			};
			ConfigDiffService.exportXlsUrl({ec_name: 'unit'}, {sys_id: 23}, {obs_time: '12 July 2004, 23:56:12'}, param);
		}));
		
		it('getAllFacets', inject(function(ConfigDiffService) {
			expect(ConfigDiffService).not.toBeNull();
			ConfigDiffService.getAllFacets().then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
		}));
		
		it('getGoldenConfigDiffData', inject(function(ConfigDiffService) {
			expect(ConfigDiffService).not.toBeNull();
			ConfigDiffService.getGoldenConfigDiffData(1, 1, 1, 1, 1, 1).then(function(response) {
				data = response.data;
			}, function(response) {
				data = response.data;
			});
		}));
		
		it('loadGoldenConfigDiffData', inject(function(ConfigDiffService) {
			ConfigDiffService.loadGoldenConfigDiffData({}, {}, {ec_name: 'ec_name'}, {sys_id: '63546TY'}, {obs_time: '2013-09-15T23:45:21Z'}, false );
		}));
		
		it('loadGoldenConfigDiffData with API call', inject(function(ConfigDiffService, $httpBackend, infoserverDomain) {
		    spyOn(ConfigDiffService, "parseData");
            ConfigDiffService.loadGoldenConfigDiffData({}, {}, {ec_name: 'ec_name'}, {sys_id: '63546TY'}, {obs_time: '2013-09-15T23:45:21Z'}, false );
            $httpBackend.expect('GET', infoserverDomain + '/base/gconf/tbl/' + manufacturer + '/' + product + '/' + schema + '/' + 'ec_name' + '/' + '63546TY' + '/' + undefined + '/' + '2013-09-15T23:45:21').respond({});
            $httpBackend.flush();
        }));
        
        it('loadGoldenConfigDiffData with API call and defer', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, $q) {
            spyOn(ConfigDiffService, "parseData");
            ConfigDiffService.loadGoldenConfigDiffData({}, {}, {ec_name: 'ec_name'}, {sys_id: '63546TY'}, {obs_time: '2013-09-15T23:45:21Z'}, $q.defer());
            $httpBackend.expect('GET', infoserverDomain + '/base/gconf/tbl/' + manufacturer + '/' + product + '/' + schema + '/' + 'ec_name' + '/' + '63546TY' + '/' + undefined + '/' + '2013-09-15T23:45:21').respond({Data: ""});
            $httpBackend.flush();
        }));
        
        it('loadGoldenConfigDiffData with API call error block', inject(function(ConfigDiffService, $httpBackend, infoserverDomain) {
            spyOn(ConfigDiffService, "parseData");
            ConfigDiffService.loadGoldenConfigDiffData({}, {info: {}}, {ec_name: 'ec_name'}, {sys_id: '63546TY'}, {obs_time: '2013-09-15T23:45:21Z'}, false );
            $httpBackend.expect('GET', infoserverDomain + '/base/gconf/tbl/' + manufacturer + '/' + product + '/' + schema + '/' + 'ec_name' + '/' + '63546TY' + '/' + undefined + '/' + '2013-09-15T23:45:21').respond(500);
            $httpBackend.flush();
        }));
        
        it('loadGoldenConfigDiffData with API call error block session timeout', inject(function(ConfigDiffService, $httpBackend, infoserverDomain, ModalService) {
            spyOn(ConfigDiffService, "parseData");
            spyOn(ModalService, "sessionTimeout");
            ConfigDiffService.loadGoldenConfigDiffData({}, {info: {}}, {ec_name: 'ec_name'}, {sys_id: '63546TY'}, {obs_time: '2013-09-15T23:45:21Z'}, false );
            $httpBackend.expect('GET', infoserverDomain + '/base/gconf/tbl/' + manufacturer + '/' + product + '/' + schema + '/' + 'ec_name' + '/' + '63546TY' + '/' + undefined + '/' + '2013-09-15T23:45:21').respond(500, {Msg: 'timeout'});
            $httpBackend.flush();
        }));
		
		/*it('formatFacets', inject(function(ConfigDiffService) {
			var rfacet = [{col1: {attribute_facet: 'S', attribute_label: 'label'}}, {}];
			expect(ConfigDiffService.formatFacets(rfacet)).toEqual([{label: 'all', name: 'All'}]);
		}));*/
	});

}); 
