/* jasmine specs for services go here */

describe('service : ', function() {
    
    var manufacturer, product, schema;
    
	beforeEach(module('gbApp.services', 'gbApp.services.explorer', 'gbApp.controllers.explorer', 'gbApp.filters', 'gbApp.services.workbench', 'gbApp.services.analytics', 'gbApp.services.dashboards', 'ui.bootstrap', 'gbApp.globals', 'ngCookies', 'ngTable', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
		
		manufacturer = 'undefined';
		product = 'undefined';
		schema = 'undefined';
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

	describe('Authenticate : ', function() {
		// it('authorize', inject(function(Authenticate, $httpBackend, infoserverDomain, $cookies, $location) {
		// expect($httpBackend).toBeDefined();
		// $httpBackend.expect('GET', infoserverDomain + '/authenticate/' + $cookies.CGISESSID + '/http/' + $location.host()).respond([1, 2, 3]);
		// expect(Authenticate).not.toBeNull();
		// var data;
		// expect(data).toBeUndefined();
		// Authenticate.authorize().then(function(response) {
		// data = response.data;
		// }, function(response) {
		// data = response.data;
		// });
		// expect(data).toBeUndefined();
		// $httpBackend.flush();
		// expect(data).toBeDefined();
		// expect(data).toEqual([1, 2, 3]);
		// }));
	});

	describe('ModalService : ', function() {
		// it('openModal', inject(function(ModalService, $modal) {
		// expect(ModalService).toBeDefined();
		// expect(ModalService.openModal('xyz', {})).toEqual(jasmine.any(Object));
		// }));
	});
	
	describe('UtilService : ', function() {
		
		it('Should have parseDate', inject(function(UtilService) {
			UtilService.parseDate('12-04-2001T12:34:21Z');
		}));
	});

	describe('AppService : ', function() {		
		it('Should have setInfoServerUp function', inject(function(AppService) {
			AppService.setInfoServerUp(true);
			expect(AppService.isInfoServerUp()).toBeTruthy();
		}));		
		it('Should have setAuthorized function', inject(function(AppService) {
			AppService.setAuthorized(true);
			expect(AppService.isAuthorized()).toBeTruthy();
		}));
		it('Should have getUploadData function', inject(function(AppService) {
			AppService.getUploadData().then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('Should have setFileUploadData function', inject(function(AppService,$window) {
			AppService.setFileUploadData();
		}));
		it('Should have getFileUploadData function', inject(function(AppService,$window) {
			AppService.getFileUploadData();
		}));
		it('Should have getGBStudioProjects function', inject(function(AppService) {
			AppService.getGBStudioProjects().then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('Should have setDefaultDomain function', inject(function(AppService) {
			AppService.setDefaultDomain().then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('Should have refreshMeta function', inject(function(AppService) {
			AppService.refreshMeta().then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));
		it('Should have disableStartupModal function', inject(function(AppService) {
			AppService.disableStartupModal().then(function(response) {
				data = response.data;
			}, function(response) {

			});
		}));

	});

	describe('GlobalService : ', function() {
		it('getVal', inject(function(GlobalService) {
			expect(GlobalService).toBeDefined();
			expect(GlobalService.getVal('char_limit_msg')).toEqual('You can type only 120 characters.');
			expect(GlobalService.getVal('invalid_old_passwd')).toEqual('Invalid old password.');
			expect(GlobalService.getVal('passwd_change_success')).toEqual('Password changed successfully.');
			expect(GlobalService.getVal('passwd_change_failure')).toEqual('Failed to change password.');
			expect(GlobalService.getVal('filter_fail')).toEqual('Your search doesn\'t match any dashboards. Kindly refine your search.');
			expect(GlobalService.getVal('no_dashboard')).toEqual('No dashboards available.');
			expect(GlobalService.getVal('filter_limit')).toEqual(100);
			expect(GlobalService.getVal('rc_threshold')).toEqual(500);
			expect(GlobalService.getVal('filter_fail', 34)).toEqual('Your search doesn\'t match any dashboards. Kindly refine your search.');
		}));
		
		it('setVal', inject(function(GlobalService) {
			expect(GlobalService).toBeDefined();
			GlobalService.setVal('unit_test', 'unit');
			expect(GlobalService.getVal('unit_test')).toEqual('unit');
		}));
	});
	
	describe('ErrorService : ', function() {
		
		it('Should have setError function', inject(function(ErrorService) {
			ErrorService.setError('logvault', 'Error');
			expect(ErrorService.getErrors('logvault')).toEqual(['Error']);
			ErrorService.setError('gbApp', 'gbapp error');
			expect(ErrorService.getErrors()).toEqual(['gbapp error']);
		}));
		
		it('Should have clearErrors function', inject(function(ErrorService) {
			ErrorService.setError('logvault', 'Error');
			ErrorService.clearErrors('logvault');
			expect(ErrorService.getErrors('logvault')).toEqual([]);
		}));
		
		it('Should have getFeatureErrors function', inject(function(ErrorService) {
			ErrorService.setError('logvault', 'Error');
			expect(ErrorService.getFeatureErrors('logvault')).toEqual(['Error']);
		}));
	});

	describe('InstanceHandler : ', function() {
		it('Should have isVisible function', inject(function($rootScope, InstanceHandler, $httpBackend, infoserverDomain) {
			/*var $scope = $rootScope.$new();
			 $controller('InstanceHandler', {
			 '$scope' : $scope
			 });
			 expect($scope.isVisible).toEqual(jasmine.any(Function));*/

		}));
		
		it('Should have setRefreshCount function', inject(function(InstanceHandler) {
			expect(InstanceHandler.setRefreshCount).toEqual(jasmine.any(Function));
			InstanceHandler.setRefreshCount(2);
		}));
		
		it('Should have getDefaultTab function', inject(function(InstanceHandler) {
			expect(InstanceHandler.getDefaultTab).toEqual(jasmine.any(Function));
			InstanceHandler.getDefaultTab();
		}));
		
		it('Should have updateInstanceByMD5 function', inject(function(InstanceHandler) {
			expect(InstanceHandler.updateInstanceByMD5).toEqual(jasmine.any(Function));
			InstanceHandler.updateInstanceByMD5('abc', [{}]);
		}));
		
		it('Should have addInstance function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', -1);
			instance = {
				"type" : type,
				"title" : title,
				"data" : {
					"result" : result,
					"bundle" : $filter('bundleName')(result.obs_url),
					"sysId" : result[$scope.info.sysId],
					"file" : $filter('bundleName')(result.filename),
					"instanceDisplay" : $scope.info.config.instance_display,
					"fileDiffAttr" : $scope.info.config.file_diff_key,
					"eventSource" : details.description,
					"start_time" : $scope.getFrom(),
					"end_time" : $scope.getTo(),
					'observation' : result.obs_date,
					'observationStr' : result.obs_date_str
				},
				"defaultTab": 'tab1',
				"md5": 'md5'
			};
			InstanceHandler.addInstance(instance, $scope);
			GlobalService.setVal('instance_limit', 3);
			InstanceHandler.addInstance(instance, $scope);
			InstanceHandler.getInstanceByMD5('3311cee55e792b6533c3ad15d5b2c3bb');
			var cur_instance = {
				"type" : type,
				"title" : title,
				"data" : {
					"result" : result,
					"bundle" : $filter('bundleName')(result.obs_url),
					"sysId" : result[$scope.info.sysId],
					"file" : $filter('bundleName')(result.filename),
					"instanceDisplay" : $scope.info.config.instance_display,
					"fileDiffAttr" : $scope.info.config.file_diff_key,
					"eventSource" : details.description,
					"start_time" : $scope.getFrom(),
					"end_time" : $scope.getTo(),
					'observation' : result.obs_date,
					'observationStr' : result.obs_date_str
				},
				"defaultTab": 'tab1',
				"md5": 'unit'
			};
			InstanceHandler.showInstance(cur_instance);
			//get install and cheks its internal methods

			GlobalService.setVal('instance_limit', 2);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			var localInstance = InstanceHandler.getInstances()[0];
			InstanceHandler.removeInstance(instance);
		}));

		it('Should have getInstances function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
		}));		

		it('Should have instance:sectionLoading function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"loading": false,
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.sectionLoading).toEqual(jasmine.any(Function));
			localInstance.sectionLoading();			
			localInstance.getMyConfig().data.loading = false;
			localInstance.sectionLoading();			
		}));

		it('Should have instance:logSectionData function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];		
			expect(localInstance.logSectionData).toEqual(jasmine.any(Function));
			localInstance.logSectionData([]);
		}));		

		it('Should have instance:getAllSectionsListForAFile function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.getAllSectionsListForAFile).toEqual(jasmine.any(Function));
			localInstance.getAllSectionsListForAFile({result:{obs_date: '', namespace:''}, bundle:''});
		}));
		it('Should have instance:handleSessionTimeout function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"sessionTimedOut": true,
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.handleSessionTimeout).toEqual(jasmine.any(Function));
			localInstance.getMyConfig().data.sessionTimedOut = false;
			localInstance.handleSessionTimeout({Msg:'helo', timeout:'yes'});
		}));
		
		it('Should have instance:getObservations function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.getObservations).toEqual(jasmine.any(Function));
			localInstance.getObservations(result);
		}));
		
		it('Should have instance:getFileDiffSection function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.getFileDiffSection).toEqual(jasmine.any(Function));
			localInstance.getMyConfig().data.observationList = [1];
			localInstance.getFileDiffSection(result);
			localInstance.getMyConfig().data.observationList = [];
			localInstance.getFileDiffSection(result);
		}));
		
		it('Should have instance:isContentLoading function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"isContentLoading": {
						"loading1": false
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.isContentLoading).toEqual(jasmine.any(Function));
			localInstance.isContentLoading();
			localInstance.getMyConfig().data.isContentLoading.loading1 = false;
			localInstance.isContentLoading();
		}));
		
		it('Should have instance:selectedSectionsChange function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.selectedSectionsChange).toEqual(jasmine.any(Function));
			localInstance.selectedSectionsChange('all');
			localInstance.getMyConfig().data.sectionFilterList['gb'] = 'gb';
			localInstance.selectedSectionsChange({selected: true, label: 'gb'}, 'gb');
			localInstance.selectedSectionsChange({selected: false, label: 'gb'}, 'gb');
		}));
		
		it('Should have instance:getAllSectionOnUI function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.getAllSectionOnUI).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			localInstance.getAllSectionOnUI(section, "");
			localInstance.getAllSectionOnUI(section, "gb");
		}));
		
		it('Should have instance:selectedAllSections function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.selectedAllSections).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			localInstance.selectedAllSections(section);
		}));
		
		it('Should have instance:unselectedAllSections function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.unselectedAllSections).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			localInstance.unselectedAllSections(section);
		}));
		
		it('Should have instance:getNumberofSelectedSection function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.getNumberofSelectedSection).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			localInstance.getMyConfig().data.sectionFilterList = [1,2,3];
			localInstance.getNumberofSelectedSection();
		}));
		
		it('Should have instance:unselectSection function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.unselectSection).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			localInstance.getMyConfig().data.sectionFilterList = [1,2,3];
			localInstance.unselectSection('gb', section, '');;
		}));
		
		it('Should have instance:applyFilter function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.applyFilter).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			localInstance.getMyConfig().data.sectionFilterList = {"0":"Controller Information","1":"Show aaa authentication all","2":"Show aaa authentication captive-portal customization","3":"Show aaa authentication vpn","4":"Show aaa authentication vpn default","5":"Show aaa authentication vpn default-cap","6":"Show aaa authentication vpn default-rap","7":"Show aaa authentication-server all","8":"Show aaa authentication-server internal statistics","9":"Show aaa authentication-server ldap statistics","10":"Show aaa authentication-server radius statistics"};
			localInstance.applyFilter('all');
		}));
		
		it('Should have instance:apiGetSectionsConten function', inject(function(InstanceHandler, $rootScope, $controller,$filter, GlobalService) {
			var $scope = $rootScope.$new();
			var ctrl = $controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.apiGetSectionsConten).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			localInstance.getMyConfig().data.sectionFilterList = {"0":"Controller Information","1":"Show aaa authentication all","2":"Show aaa authentication captive-portal customization","3":"Show aaa authentication vpn","4":"Show aaa authentication vpn default","5":"Show aaa authentication vpn default-cap","6":"Show aaa authentication vpn default-rap","7":"Show aaa authentication-server all","8":"Show aaa authentication-server internal statistics","9":"Show aaa authentication-server ldap statistics","10":"Show aaa authentication-server radius statistics"};
			localInstance.apiGetSectionsConten({"ts":"2016-03-16T10:31:03Z","bundle":"aruba_2016.zip","ns":["mc","mc.aaauthall","mc.aaauthcaptive","mc.aaauthvpn","mc.aaauthvpndef","mc.aaauthvpncap","mc.aaaauthvpn","mc.aaauthserall","mc.aaaintstat","mc.aaauthldap"]});
			/*spyOn(localInstance, "apiGetSectionsConten");
	        $httpBackend.expect('GET', 'undefined/uimeta/config/undefined/undefined/undefined').respond(200,{data:{Data:'gb'}});
	        $httpBackend.expect('GET', 'undefined/meta/sections/type/undefined/undefined/undefined/SECTION').respond(200,{data:{Data:'gb'}});
	        $httpBackend.expect('GET', 'undefined/explorer/nscontent/undefined/undefined/undefined?bundle=aruba_2016.zip&ns=mc.audit&ts=2016-03-16T10:31:03Z').respond(200,{data:{Data:'gb'}});
	        $httpBackend.expect('GET', 'undefined/explorer/nscontent/undefined/undefined/undefined?bundle=aruba_2016.zip&ns=mc&ns=mc.aaauthall&ns=mc.aaauthcaptive&ns=mc.aaauthvpn&ns=mc.aaauthvpndef&ns=mc.aaauthvpncap&ns=mc.aaaauthvpn&ns=mc.aaauthserall&ns=mc.aaaintstat&ns=mc.aaauthldap&ts=2016-03-16T10:31:03Z').respond(200,{data:{Data:'gb'}});
	        $httpBackend.flush();*/
		}));
		
		it('Should have instance:getNamespaceOfSelectedSection function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.getNamespaceOfSelectedSection).toEqual(jasmine.any(Function));
			var sections = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433","selected":true},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434","selected":true},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435","selected":true},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436","selected":true},{"name":"mc.aaauthvpncap","label":"Show aaa authentication vpn default-cap","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def_cap","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default-cap","namespace_actual":"mc.aaauthvpncap","$$hashKey":"object:437","selected":true},{"name":"mc.aaaauthvpn","label":"Show aaa authentication vpn default-rap","namespace_type":"SECTION","table_name":"sys_aaa_authvpn","icon_type":"NVPAIR_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default-rap","namespace_actual":"mc.aaaauthvpn","$$hashKey":"object:438","selected":true},{"name":"mc.aaauthserall","label":"Show aaa authentication-server all","namespace_type":"SECTION","table_name":"aaauthser_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication-server all","namespace_actual":"mc.aaauthserall","$$hashKey":"object:439","selected":true},{"name":"mc.aaaintstat","label":"Show aaa authentication-server internal statistics","namespace_type":"SECTION","table_name":"sys_aaa_stat","icon_type":"NVPAIR_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication-server internal statistics","namespace_actual":"mc.aaaintstat","$$hashKey":"object:440","selected":true},{"name":"mc.aaauthldap","label":"Show aaa authentication-server ldap statistics","namespace_type":"SECTION","table_name":"aaa_auth_ser_ldap_stat","icon_type":"LIST_BASIC","namespace_ref":"mc.aaauthldap","namespace_desc":"Show aaa authentication-server ldap statistics","namespace_actual":"mc.aaauthldap.one","$$hashKey":"object:441","selected":true},{"name":"mc.aaaauthserrstat","label":"Show aaa authentication-server radius statistics","namespace_type":"SECTION","table_name":"mc_aaaauthserrstat","icon_type":"LIST_BASIC","namespace_ref":"mc.aaaauthserrstat","namespace_desc":"Show aaa authentication-server radius statistics","namespace_actual":"mc.aaaauthserrstat.child","$$hashKey":"object:442","selected":true}];
			localInstance.getMyConfig().data.sections = sections;
			localInstance.getMyConfig().filterBatchTotalCount = 340;
			localInstance.getMyConfig().filterBatchPageSize = 10;
			localInstance.getMyConfig().filterBatchCurrentPageNo = 1;
			localInstance.getNamespaceOfSelectedSection({"0":"Controller Information","1":"Show aaa authentication all","2":"Show aaa authentication captive-portal customization","3":"Show aaa authentication vpn","4":"Show aaa authentication vpn default","5":"Show aaa authentication vpn default-cap","6":"Show aaa authentication vpn default-rap","7":"Show aaa authentication-server all","8":"Show aaa authentication-server internal statistics","9":"Show aaa authentication-server ldap statistics"});
		}));

		it('Should have instance:scrollInfinite function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.scrollInfinite).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			//localInstance.getMyConfig().filterBatchTotalCount = 340;
			localInstance.scrollInfinite();
		}));

		it('Should have instance:changeObservation function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.changeObservation).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			//localInstance.getMyConfig().filterBatchTotalCount = 340;
			localInstance.changeObservation();
		}));

		it('Should have instance:logEventData function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.logEventData).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			//localInstance.getMyConfig().filterBatchTotalCount = 340;
			localInstance.logEventData();
		}));

		it('Should have instance:clearFilter function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "section",
				"title": "Section Viewer",
				"app": "Explorer",
				"module": "Section",
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.clearFilter).toEqual(jasmine.any(Function));
			var section = [{"name":"mc.aaauthall","label":"Show aaa authentication all","namespace_type":"SECTION","table_name":"aaa_auth_all","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication all","namespace_actual":"mc.aaauthall","$$hashKey":"object:433"},{"name":"mc.aaauthcaptive","label":"Show aaa authentication captive-portal customization","namespace_type":"SECTION","table_name":"aaa_auth_cap_por_cust","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication captive-portal customization","namespace_actual":"mc.aaauthcaptive","$$hashKey":"object:434"},{"name":"mc.aaauthvpn","label":"Show aaa authentication vpn","namespace_type":"SECTION","table_name":"aaa_auth_vpn","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn","namespace_actual":"mc.aaauthvpn","$$hashKey":"object:435"},{"name":"mc.aaauthvpndef","label":"Show aaa authentication vpn default","namespace_type":"SECTION","table_name":"aaa_auth_vpn_def","icon_type":"LIST_BASIC","namespace_ref":"","namespace_desc":"Show aaa authentication vpn default","namespace_actual":"mc.aaauthvpndef","$$hashKey":"object:436"}];
			//localInstance.getMyConfig().filterBatchTotalCount = 340;
			localInstance.clearFilter(section);
		}));
		
		
		it('Should have instance:eventScrollUp function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "event",
				"title": "Event Viewer",
				"app": "Explorer",
				"module": "Section",
                'timefilter': {
                	'request': false,
                    'currentValue' : '30 minutes',
                    'totalRecords' : 0,
                    'startIndex' : 0,
                    'endIndex' : 0,
                    'scrolldirection' : 'default',
                    'baseIndex' : 0,
                    'offset' : 200,
                    'quickFilters': [
                        '15 minutes',
                        '30 minutes',
                        '1 hour',
                        '4 hours',
                        '8 hours',
                        'Custom time'
                    ],
                    'customFilter':{
                        'fromDate':{
                            'gDate' : new Date(),
                            'hr' : 00,
                            'min' : 00,
                            'sec' : 00
                        },
                        'toDate':{
                            'gDate' : new Date(),
                            'hr' : 00,
                            'min' : 00,
                            'sec' : 00
                        }
                    }
                },
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.eventScrollUp).toEqual(jasmine.any(Function));
			localInstance.timefilter.request = true;
			localInstance.eventScrollUp(result.obs_date);

			localInstance.timefilter.request = false;
			localInstance.timefilter.totalRecords = 1000;
			localInstance.timefilter.startIndex = 0
			localInstance.timefilter.endIndex = 0;
			localInstance.timefilter.baseIndex = 300;
			localInstance.timefilter.offset = 100;
			localInstance.eventScrollUp(result.obs_date);

			localInstance.timefilter.request = false;
			localInstance.timefilter.totalRecords = 1000;
			localInstance.timefilter.startIndex = 100
			localInstance.timefilter.endIndex = -10;
			localInstance.timefilter.baseIndex = 300;
			localInstance.timefilter.offset = 100;
			localInstance.eventScrollUp(result.obs_date);

			localInstance.timefilter.request = false;
			localInstance.timefilter.totalRecords = 1000;
			localInstance.timefilter.startIndex = 100
			localInstance.timefilter.endIndex = 200;
			localInstance.timefilter.baseIndex = 300;
			localInstance.timefilter.offset = 100;
			localInstance.eventScrollUp(result.obs_date);

			localInstance.timefilter.request = false;
			localInstance.timefilter.totalRecords = 10;
			localInstance.timefilter.startIndex = 100
			localInstance.timefilter.endIndex = 200;
			localInstance.timefilter.baseIndex = 300;
			localInstance.timefilter.offset = 100;
			localInstance.eventScrollUp(result.obs_date);
		}));		
		
		it('Should have instance:eventScrollDown function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "event",
				"title": "Event Viewer",
				"app": "Explorer",
				"module": "Section",
                'timefilter': {
                	'request': false,
                    'currentValue' : '30 minutes',
                    'totalRecords' : 0,
                    'startIndex' : 0,
                    'endIndex' : 0,
                    'scrolldirection' : 'default',
                    'baseIndex' : 0,
                    'offset' : 200,
                    'quickFilters': [
                        '15 minutes',
                        '30 minutes',
                        '1 hour',
                        '4 hours',
                        '8 hours',
                        'Custom time'
                    ],
                    'customFilter':{
                        'fromDate':{
                            'gDate' : new Date(),
                            'hr' : 00,
                            'min' : 00,
                            'sec' : 00
                        },
                        'toDate':{
                            'gDate' : new Date(),
                            'hr' : 00,
                            'min' : 00,
                            'sec' : 00
                        }
                    }
                },
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.eventScrollDown).toEqual(jasmine.any(Function));
			localInstance.timefilter.request = true;
			localInstance.eventScrollDown(result.obs_date);

			localInstance.timefilter.request = false;
			localInstance.timefilter.totalRecords = 1000;
			localInstance.timefilter.startIndex = 0
			localInstance.timefilter.endIndex = 0;
			localInstance.timefilter.baseIndex = 300;
			localInstance.timefilter.offset = 100;
			localInstance.eventScrollDown(result.obs_date);

			localInstance.timefilter.request = false;
			localInstance.timefilter.totalRecords = 1000;
			localInstance.timefilter.startIndex = 100
			localInstance.timefilter.endIndex = -10;
			localInstance.timefilter.baseIndex = 300;
			localInstance.timefilter.offset = 100;
			localInstance.eventScrollDown(result.obs_date);

			localInstance.timefilter.request = false;
			localInstance.timefilter.totalRecords = 1000;
			localInstance.timefilter.startIndex = 100
			localInstance.timefilter.endIndex = 200;
			localInstance.timefilter.baseIndex = 300;
			localInstance.timefilter.offset = 100;
			localInstance.eventScrollDown(result.obs_date);

			localInstance.timefilter.request = false;
			localInstance.timefilter.totalRecords = 10;
			localInstance.timefilter.startIndex = 100
			localInstance.timefilter.endIndex = 200;
			localInstance.timefilter.baseIndex = 300;
			localInstance.timefilter.offset = 100;
			localInstance.eventScrollDown(result.obs_date);
		}));
		it('Should have instance:eventContentApplyFilter function', inject(function(InstanceHandler, $rootScope, $controller, $filter, GlobalService) {
			var $scope = $rootScope.$new();
			$controller('ExplorerCtrl', {
				'$scope' : $scope
			});
			expect(InstanceHandler.addInstance).toEqual(jasmine.any(Function));
			var result = {
				"obs_size" : 112609,
				"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top-56",
				"evt_date" : "2014-12-05T21:00:01Z",
				"evt_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
				"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
				"namespace" : "cputop",
				"obs_date" : "2014-12-05T21:00:01Z",
				"sys_hwaddr" : "00:0C:29:9E:F5:12",
				"begin_offset" : 56,
				"evt_text" : ["Top Command System Info"],
				"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_top",
				"sys_display_name" : "gbh-ui-01",
				"type" : "EVENT",
				"sys_timezone" : "-0700",
				"content" : " 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ",
				"showExpanded" : false
			};
			var details = {
				"nsType" : "EVENT",
				"name" : "cputop",
				"description" : "Top Command Process Info"
			};
			$scope.info.sectionsContent = {};
			$scope.info.fromDate = new Date();
			$scope.info.toDate = new Date();
			$scope.info.sectionsContent[result.namespace] = {};
			$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
			$scope.info.config = {};
			$scope.info.config.instance_display = '';
			$scope.info.config.file_diff_key = '';
			var instance,
			    type = $scope.info.sectionsContent[result.namespace]['nsType'],
			    title;
			if (type == "EVENT") {
				type = "event";
				title = "Event Viewer";
			} else {
				type = "section";
				title = "Section Viewer";
			}
			GlobalService.setVal('instance_limit', 10);
			instance = {
				"type": "event",
				"title": "Event Viewer",
				"app": "Explorer",
				"module": "Section",
                'timefilter': {
                	'request': false,
                    'currentValue' : '30 minutes',
                    'totalRecords' : 0,
                    'startIndex' : 0,
                    'endIndex' : 0,
                    'scrolldirection' : 'default',
                    'baseIndex' : 0,
                    'offset' : 200,
                    'quickFilters': [
                        '15 minutes',
                        '30 minutes',
                        '1 hour',
                        '4 hours',
                        '8 hours',
                        'Custom time'
                    ],
                    'customFilter':{
                        'fromDate':{
                            'gDate' : new Date(),
                            'hr' : 00,
                            'min' : 00,
                            'sec' : 00
                        },
                        'toDate':{
                            'gDate' : new Date(),
                            'hr' : 00,
                            'min' : 00,
                            'sec' : 00
                        }
                    }
                },
				"data": {
					"result": {
						"sys_model": "Aruba3600",
						"cust_name": "Avnet Logistics, USLP",
						"obs_url": "aruba_2016.zip",
						"evt_date": "1970-01-01T00:00:00Z",
						"sys_version": "5.0.3.0",
						"ticket_num": "1498514",
						"sysid": "CP0004165",
						"uploaded_by": "",
						"begin_offset": 170,
						"obs_date_str": "Wed Mar 16 18:31:03 2016 +0800",
						"bundle_id": "aruba_2016.zip___360034___CP0004165___1458124263000",
						"filename": "extensibility.tech-support.log.log",
						"namespace_id": "aruba_2016.zip___360034___CP0004165___1458124263000-aruba_2016/Cbtalyst_Telecom_tbeach_wcupa.edu/CP0004165_ARU_7220_Local1/SFDC/2014-11-03_07_20_15_0100/CP0004165-2015-03-12_00_23_15_0000/var/log/oslog/extensibility.tech-support.log.log-170",
						"obs_date": "2016-03-16T10:31:03Z",
						"namespace": "mc.audit",
						"content": "show audit-trail  \n\nDec 14 11:58:55  cli[1330]: USER: admin has logged in from 10.7.3.169. \nDec 14 12:00:33  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;no paging &gt; -- command executed successfully \nDec 14 12:00:58  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:01:02  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"15\" &gt; -- command executed successfully \nDec 14 12:06:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:06:38  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"20\" &gt; -- command executed successfully \nDec 14 12:07:39  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" &gt; -- command executed successfully \nDec 14 12:07:45  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;ap-name \"D2\" exclude-virtual-ap \"CTC-SDBB2-DAS-vap\" &gt; -- command executed successfully \nDec 14 12:08:34  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" &gt; -- command executed successfully \nDec 14 12:11:06  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf dot11g-radio-profile \"test-ch11\" tx-power \"27.5\" &gt; -- command executed successfully \nDec 14 12:12:37  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-assign\" &gt; -- command executed successfully \nDec 14 12:12:41  cli[1330]: USER:admin@10.7.3.169 COMMAND:&lt;rf arm-profile \"no-scan-no-as",
						"showExpanded": true
					},
					"bundle": "aruba_2016.zip",
					"sysId": "CP0004165",
					"file": "extensibility.tech-support.log.log",
					"instanceDisplay": {
						"sysId": "Serial no"
					},
					"eventSource": "Show audit-trail",
					"start_time": "2010-9-24T16:1:4Z",
					"end_time": "2016-3-16T16:1:4Z",
					"observation": "2016-03-16T10:31:03Z",
					"observationStr": "Wed Mar 16 18:31:03 2016 +0800"
				}
			};
			InstanceHandler.addInstance(instance, $scope);
			expect(InstanceHandler.getInstances).toEqual(jasmine.any(Function));
			var localInstance = InstanceHandler.getInstances()[0];	
			expect(localInstance.eventContentApplyFilter).toEqual(jasmine.any(Function));
			localInstance.timefilter.request = true;
			localInstance.eventContentApplyFilter();
		}));

	});	
	describe('metaDataService : ', function() {		
		it('Should have getManufacturer function', inject(function(metaDataService) {
			metaDataService.getManufacturer();
		}));	
		it('Should have getProduct function', inject(function(metaDataService) {
			metaDataService.getProduct();
		}));	
		it('Should have getSchema function', inject(function(metaDataService) {
			metaDataService.getSchema();
		}));
		it('Should have getNsrEnabled function', inject(function(metaDataService) {
			metaDataService.getNsrEnabled();
		}));
		it('Should have getNsrType function', inject(function(metaDataService) {
			metaDataService.getNsrType();
		}));
		it('Should have getSsoIdpId function', inject(function(metaDataService) {
			metaDataService.getSchema();
		}));
		it('Should have getSsoLoginUrl function', inject(function(metaDataService) {
			metaDataService.getSsoLoginUrl();
		}));
		it('Should have getSsoLogoutUrl function', inject(function(metaDataService) {
			metaDataService.getSsoLogoutUrl();
		}));
		it('Should have getSsoParams function', inject(function(metaDataService) {
			metaDataService.getSsoParams();
		}));
		it('Should have getSsoParamsSfdc function', inject(function(metaDataService) {
			metaDataService.getSsoParamsSfdc();
		}));
		it('Should have getSsoRoles function', inject(function(metaDataService) {
			metaDataService.getSsoRoles();
		}));
		it('Should have getEndCustomer function', inject(function(metaDataService) {
			metaDataService.getEndCustomer();
		}));
		it('Should have getFeedbackApiKey function', inject(function(metaDataService) {
			metaDataService.getFeedbackApiKey();
		}));
		it('Should have getFeedbackBtn function', inject(function(metaDataService) {
			metaDataService.getFeedbackBtn();
		}));
		it('Should have getLogo function', inject(function(metaDataService) {
			metaDataService.getLogo();
		}));
		it('Should have getlogourl function', inject(function(metaDataService) {
			metaDataService.getlogourl();
		}));
		it('Should have getSsoIdpId function', inject(function(metaDataService) {
			metaDataService.getSsoIdpId();
		}));
		it('Should have getUserFirstName function', inject(function(metaDataService) {
			metaDataService.getUserFirstName();
		}));
		it('Should have getUserLastName function', inject(function(metaDataService) {
			metaDataService.getUserLastName();
		}));
		it('Should have getUserRole function', inject(function(metaDataService) {
			metaDataService.getUserRole();
		}));
		it('Should have getUiConfig function', inject(function(metaDataService) {
			metaDataService.getUiConfig();
		}));
		it('Should have getGbConfig function', inject(function(metaDataService) {
			metaDataService.getGbConfig();
		}));
		it('Should have getStudioMPS function', inject(function(metaDataService) {
			metaDataService.getStudioMPS();
		}));
	});
	describe('UserTrackingService : ', function() {		
		it('Should have custom_user_tracking function', inject(function(UserTrackingService) {
			UserTrackingService.custom_user_tracking('d_id', 'r_id');
		}));
	});
});
