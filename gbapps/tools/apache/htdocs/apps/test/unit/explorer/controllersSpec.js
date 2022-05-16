'use strict';

/* jasmine specs for controllers go here */

describe('ExplorerCtrl : ', function() {
    
    var manufacturer, product, schema, umsDomain, form, input;
    
	beforeEach(module('gbApp.controllers.explorer', 'gbApp.services', 'gbApp.services.explorer', 'ngCookies', 'ui.bootstrap', 'gbApp.services.workbench', 'gbApp.filters', 'gbApp.services.analytics', 'ngTable', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', 'true');
		
		manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
        
        form = document.createElement("form");
        form.id = "gb-download-bundle-hidden-form";
        spyOn(form, "submit");
        
        input = document.createElement("input");
        input.id = "gb-download-bundle-hidden-form-searchtext";
        
        form.appendChild(input);
        document.body.appendChild(form);
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));
    
    afterEach(inject(function() {
        document.body.removeChild(form);
    }));
	
	it('Should load with saved filter cookies', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var cookies = {
            savedFilters: 'view1#@#view2#@#'
        };
        $controller('ExplorerCtrl', {
            '$scope' : $scope,
            '$cookies': cookies
        });
    }));
    
    it('Should load with saved filter cookies invalid', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        
        var cookies = {
            savedFilters: {
                split: function() {
                    return false;
                }
            }
        };
        $controller('ExplorerCtrl', {
            '$scope' : $scope,
            '$cookies': cookies
        });
    }));

    it('Should have hideFacets', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, $timeout) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "d3BarRender");
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        
        $scope.hideFacets();
        
        expect($scope.d3BarRender).not.toHaveBeenCalled();
        
        $timeout.flush(200);
        
        expect($scope.d3BarRender).toHaveBeenCalled();
    }));
    
    it('Should have reloadGraph', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, $timeout) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "d3BarRender");
        
        $scope.reloadGraph(null);
        
        var nodata = {"obs_date":{"start":"2015-06-24T00:00:00Z","end":"2015-06-25T00:00:00Z","gap":"+1H-OUR/HO-UR","counts":["2015-06-25T00:00:00Z",0,"2015-06-24T24:00:00Z",0,"2015-06-24T23:00:00Z",0,"2015-06-24T22:00:00Z",0,"2015-06-24T21:00:00Z",0,"2015-06-24T20:00:00Z",1,"2015-06-24T19:00:00Z",2,"2015-06-24T18:00:00Z",1,"2015-06-24T17:00:00Z",0,"2015-06-24T16:00:00Z",1,"2015-06-24T15:00:00Z",0,"2015-06-24T14:00:00Z",1,"2015-06-24T13:00:00Z",0,"2015-06-24T12:00:00Z",0,"2015-06-24T11:00:00Z",0,"2015-06-24T10:00:00Z",0,"2015-06-24T09:00:00Z",0,"2015-06-24T08:00:00Z",0,"2015-06-24T07:00:00Z",0,"2015-06-24T06:00:00Z",0,"2015-06-24T05:00:00Z",0,"2015-06-24T04:00:00Z",0,"2015-06-24T03:00:00Z",1,"2015-06-24T02:00:00Z",0,"2015-06-24T01:00:00Z",0,"2015-06-24T00:00:00Z",0]}};
        $scope.reloadGraph(nodata);
        
        var dataHours = {"obs_date":{"start":"2015-06-24T00:00:00Z","end":"2015-06-25T00:00:00Z","gap":"+1HOUR/HOUR","counts":["2015-06-25T00:00:00Z",0,"2015-06-24T24:00:00Z",0,"2015-06-24T23:00:00Z",0,"2015-06-24T22:00:00Z",0,"2015-06-24T21:00:00Z",0,"2015-06-24T20:00:00Z",1,"2015-06-24T19:00:00Z",2,"2015-06-24T18:00:00Z",1,"2015-06-24T17:00:00Z",0,"2015-06-24T16:00:00Z",1,"2015-06-24T15:00:00Z",0,"2015-06-24T14:00:00Z",1,"2015-06-24T13:00:00Z",0,"2015-06-24T12:00:00Z",0,"2015-06-24T11:00:00Z",0,"2015-06-24T10:00:00Z",0,"2015-06-24T09:00:00Z",0,"2015-06-24T08:00:00Z",0,"2015-06-24T07:00:00Z",0,"2015-06-24T06:00:00Z",0,"2015-06-24T05:00:00Z",0,"2015-06-24T04:00:00Z",0,"2015-06-24T03:00:00Z",1,"2015-06-24T02:00:00Z",0,"2015-06-24T01:00:00Z",0,"2015-06-24T00:00:00Z",0]}};
        $scope.reloadGraph(dataHours);
        var dataMinutes = {"obs_date":{"start":"2015-06-24T19:00:00Z","end":"2015-06-24T20:00:00Z","gap":"+1MINUTES/MINUTES","counts":["2015-06-24T20:00:00Z",0,"2015-06-24T19:59:00Z",0,"2015-06-24T19:58:00Z",0,"2015-06-24T19:57:00Z",0,"2015-06-24T19:56:00Z",0,"2015-06-24T19:55:00Z",0,"2015-06-24T19:54:00Z",0,"2015-06-24T19:53:00Z",0,"2015-06-24T19:52:00Z",0,"2015-06-24T19:51:00Z",0,"2015-06-24T19:50:00Z",0,"2015-06-24T19:49:00Z",0,"2015-06-24T19:48:00Z",0,"2015-06-24T19:47:00Z",0,"2015-06-24T19:46:00Z",0,"2015-06-24T19:45:00Z",0,"2015-06-24T19:44:00Z",0,"2015-06-24T19:43:00Z",0,"2015-06-24T19:42:00Z",0,"2015-06-24T19:41:00Z",0,"2015-06-24T19:40:00Z",0,"2015-06-24T19:39:00Z",0,"2015-06-24T19:38:00Z",0,"2015-06-24T19:37:00Z",0,"2015-06-24T19:36:00Z",0,"2015-06-24T19:35:00Z",0,"2015-06-24T19:34:00Z",0,"2015-06-24T19:33:00Z",0,"2015-06-24T19:32:00Z",0,"2015-06-24T19:31:00Z",0,"2015-06-24T19:30:00Z",0,"2015-06-24T19:29:00Z",0,"2015-06-24T19:28:00Z",0,"2015-06-24T19:27:00Z",0,"2015-06-24T19:26:00Z",0,"2015-06-24T19:25:00Z",0,"2015-06-24T19:24:00Z",0,"2015-06-24T19:23:00Z",0,"2015-06-24T19:22:00Z",0,"2015-06-24T19:21:00Z",0,"2015-06-24T19:20:00Z",0,"2015-06-24T19:19:00Z",0,"2015-06-24T19:18:00Z",0,"2015-06-24T19:17:00Z",0,"2015-06-24T19:16:00Z",0,"2015-06-24T19:15:00Z",0,"2015-06-24T19:14:00Z",1,"2015-06-24T19:13:00Z",0,"2015-06-24T19:12:00Z",0,"2015-06-24T19:11:00Z",0,"2015-06-24T19:10:00Z",0,"2015-06-24T19:09:00Z",0,"2015-06-24T19:08:00Z",0,"2015-06-24T19:07:00Z",0,"2015-06-24T19:06:00Z",0,"2015-06-24T19:05:00Z",0,"2015-06-24T19:04:00Z",1,"2015-06-24T19:03:00Z",0,"2015-06-24T19:02:00Z",0,"2015-06-24T19:01:00Z",0,"2015-06-24T19:00:00Z",0]}};
        $scope.reloadGraph(dataMinutes);
        var dataSeconds = {"obs_date":{"start":"2015-06-24T19:14:00Z","end":"2015-06-24T19:14:59Z","gap":"+1SECONDS/SECONDS","counts":["2015-06-24T19:14:59Z",0,"2015-06-24T19:14:58Z",0,"2015-06-24T19:14:57Z",0,"2015-06-24T19:14:56Z",0,"2015-06-24T19:14:55Z",0,"2015-06-24T19:14:54Z",0,"2015-06-24T19:14:53Z",0,"2015-06-24T19:14:52Z",0,"2015-06-24T19:14:51Z",0,"2015-06-24T19:14:50Z",0,"2015-06-24T19:14:49Z",0,"2015-06-24T19:14:48Z",0,"2015-06-24T19:14:47Z",0,"2015-06-24T19:14:46Z",0,"2015-06-24T19:14:45Z",0,"2015-06-24T19:14:44Z",0,"2015-06-24T19:14:43Z",0,"2015-06-24T19:14:42Z",0,"2015-06-24T19:14:41Z",0,"2015-06-24T19:14:40Z",0,"2015-06-24T19:14:39Z",0,"2015-06-24T19:14:38Z",0,"2015-06-24T19:14:37Z",1,"2015-06-24T19:14:36Z",0,"2015-06-24T19:14:35Z",0,"2015-06-24T19:14:34Z",0,"2015-06-24T19:14:33Z",0,"2015-06-24T19:14:32Z",0,"2015-06-24T19:14:31Z",0,"2015-06-24T19:14:30Z",0,"2015-06-24T19:14:29Z",0,"2015-06-24T19:14:28Z",0,"2015-06-24T19:14:27Z",0,"2015-06-24T19:14:26Z",0,"2015-06-24T19:14:25Z",0,"2015-06-24T19:14:24Z",0,"2015-06-24T19:14:23Z",0,"2015-06-24T19:14:22Z",0,"2015-06-24T19:14:21Z",0,"2015-06-24T19:14:20Z",0,"2015-06-24T19:14:19Z",0,"2015-06-24T19:14:18Z",0,"2015-06-24T19:14:17Z",0,"2015-06-24T19:14:16Z",0,"2015-06-24T19:14:15Z",0,"2015-06-24T19:14:14Z",0,"2015-06-24T19:14:13Z",0,"2015-06-24T19:14:12Z",0,"2015-06-24T19:14:11Z",0,"2015-06-24T19:14:10Z",0,"2015-06-24T19:14:09Z",0,"2015-06-24T19:14:08Z",0,"2015-06-24T19:14:07Z",0,"2015-06-24T19:14:06Z",0,"2015-06-24T19:14:05Z",0,"2015-06-24T19:14:04Z",0,"2015-06-24T19:14:03Z",0,"2015-06-24T19:14:02Z",0,"2015-06-24T19:14:01Z",0,"2015-06-24T19:14:00Z",0]}};
        $scope.reloadGraph(dataSeconds);

        var data = {"obs_date":{"start":"2008-07-14T09:36:53Z","end":"2017-01-01T00:00:00Z","gap":"+1YEAR/YEAR","counts":["2017-01-01T00:00:00Z",0,"2016-01-01T00:00:00Z",4,"2015-01-01T00:00:00Z",14,"2014-01-01T00:00:00Z",0,"2013-01-01T00:00:00Z",0,"2012-01-01T00:00:00Z",1,"2011-01-01T00:00:00Z",1,"2010-01-01T00:00:00Z",0,"2009-01-01T00:00:00Z",0,"2008-01-01T00:00:00Z",0]}};
        $scope.reloadGraph(data);
        data = {"obs_date":{"start":"2015-01-01T00:00:00Z","end":"2016-01-01T00:00:00Z","gap":"+1MONTH/MONTH","counts":["2016-01-01T00:00:00Z",0,"2015-12-01T00:00:00Z",0,"2015-11-01T00:00:00Z",0,"2015-10-01T00:00:00Z",0,"2015-09-01T00:00:00Z",0,"2015-08-01T00:00:00Z",0,"2015-07-01T00:00:00Z",0,"2015-06-01T00:00:00Z",14,"2015-05-01T00:00:00Z",0,"2015-04-01T00:00:00Z",0,"2015-03-01T00:00:00Z",0,"2015-02-01T00:00:00Z",0,"2015-01-01T00:00:00Z",0]}};
        $scope.reloadGraph(data);
        data = {"obs_date":{"start":"2015-06-01T00:00:00Z","end":"2015-07-01T00:00:00Z","gap":"+1DAY/DAY","counts":["2015-07-01T00:00:00Z",0,"2015-06-30T00:00:00Z",0,"2015-06-29T00:00:00Z",0,"2015-06-28T00:00:00Z",0,"2015-06-27T00:00:00Z",0,"2015-06-26T00:00:00Z",0,"2015-06-25T00:00:00Z",3,"2015-06-24T00:00:00Z",7,"2015-06-23T00:00:00Z",1,"2015-06-22T00:00:00Z",0,"2015-06-21T00:00:00Z",0,"2015-06-20T00:00:00Z",0,"2015-06-19T00:00:00Z",0,"2015-06-18T00:00:00Z",0,"2015-06-17T00:00:00Z",3,"2015-06-16T00:00:00Z",0,"2015-06-15T00:00:00Z",0,"2015-06-14T00:00:00Z",0,"2015-06-13T00:00:00Z",0,"2015-06-12T00:00:00Z",0,"2015-06-11T00:00:00Z",0,"2015-06-10T00:00:00Z",0,"2015-06-09T00:00:00Z",0,"2015-06-08T00:00:00Z",0,"2015-06-07T00:00:00Z",0,"2015-06-06T00:00:00Z",0,"2015-06-05T00:00:00Z",0,"2015-06-04T00:00:00Z",0,"2015-06-03T00:00:00Z",0,"2015-06-02T00:00:00Z",0,"2015-06-01T00:00:00Z",0]}};
        $scope.reloadGraph(data);
    }));

    it('Should have getAllConfig Sections', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "loadDefaultFilter");
        
        var data = {
            ec_sysid_map: {
                sysid: 'sysid'
            },
            config: {
                DEFAULT_DAYS: 90,
                MAX_DAY_RANGE_ALLOWED: 30,
                DEFAULT_VIEW: 'SECTION',
                fields: {}
            },
            event_columns: {
                evt_text: 'val1',
                obs_date: 'val2'
            },
            facet_label_map: [{
                "sysid": "Serial Number"
            },
            {
                "ticket_num": "Ticket Number"
            }],
            sections_content: {
                "mc.mldcnt": {
                    "nsType": "SECTION",
                    "name": "mc.mldcnt",
                    "description": "Show ipv6 mld counters"
                },
                "mc.ipigmpinter": {
                    "nsType": "REGULAR",
                    "name": "mc.ipigmpinter",
                    "description": "Show ip igmp interface"
                }
            }
        };
        
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond({Data: data});
        $httpBackend.expect('GET', infoserverDomain + '/solr/stats/'+ manufacturer + '/' + product + '/' + schema).respond({Data: {obs_min: "2011-01-03T19:55:55Z", obs_max: "2016-03-16T10:31:03Z"}});
        
        $httpBackend.flush();
    }));
    
    it('Should have getAllConfig Events', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, AppService) {
        spyOn(AppService, "isGbStudioApp").and.returnValue(true);
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "loadDefaultFilter");
        
        var data = {
            ec_sysid_map: {
                sysid: 'sysid'
            },
            config: {
                DEFAULT_DAYS: 90,
                MAX_DAY_RANGE_ALLOWED: 30,
                DEFAULT_VIEW: 'EVENT',
                fields: {}
            },
            event_columns: {
                evt_text: 'val1',
                obs_date: 'val2'
            },
            facet_label_map: [{
                "sysid": "Serial Number"
            },
            {
                "ticket_num": "Ticket Number"
            }],
            sections_content: {
                "mc.mldcnt": {
                    "nsType": "SECTION",
                    "name": "mc.mldcnt",
                    "description": "Show ipv6 mld counters"
                },
                "mc.ipmobactive": {
                    "nsType": "EVENT",
                    "name": "mc.ipmobactive",
                    "description": "Show ip mobile active-domains"
                },
                "mc.ipigmpinter": {
                    "nsType": "REGULAR",
                    "name": "mc.ipigmpinter",
                    "description": "Show ip igmp interface"
                }
            }
        };
        
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond({Data: data});
        $httpBackend.expect('GET', infoserverDomain + '/solr/stats/'+ manufacturer + '/' + product + '/' + schema).respond({});
        
        $httpBackend.flush();
    }));
    
    it('Should have getAllConfig Bundle Select', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService, AppService) {
        spyOn(AppService, "isGbStudioApp").and.returnValue(true);
        ExplorerService.setBundleData({bundlename: 'bundle1', bundle_id: 'bundle'});
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setFromTo");
        
        var data = {
            ec_sysid_map: {
                sysid: 'sysid'
            },
            config: {
                DEFAULT_DAYS: 90,
                MAX_DAY_RANGE_ALLOWED: 30,
                DEFAULT_VIEW: 'SECTION',
                fields: {}
            },
            default_config: {
                DEFAULT_DAYS: 90,
                MAX_DAY_RANGE_ALLOWED: 30,
                DEFAULT_VIEW: 'SECTION',
                fields: {}
            },
            event_columns: {
                evt_text: 'val1',
                obs_date: 'val2'
            },
            facet_label_map: [{
                "sysid": "Serial Number"
            },
            {
                "ticket_num": "Ticket Number"
            }],
            sections_content: {
                "mc.mldcnt": {
                    "nsType": "SECTION",
                    "name": "mc.mldcnt",
                    "description": "Show ipv6 mld counters"
                },
                "mc.ipigmpinter": {
                    "nsType": "REGULAR",
                    "name": "mc.ipigmpinter",
                    "description": "Show ip igmp interface"
                }
            }
        };
        
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond({Data: data});
        $httpBackend.expect('GET', infoserverDomain + '/solr/stats/'+ manufacturer + '/' + product + '/' + schema).respond({Data: {obs_min: "2011-01-03T19:55:55Z", obs_max: "2016-03-16T10:31:03Z"}});
        $httpBackend.expect('GET', infoserverDomain + '/bundles/date_boundaries/' + manufacturer + '/' + product + '/' + schema + '/' + manufacturer + '/' + 'bundle').respond({Data: {obs_max: "2015-10-07T00:00:00Z", obs_min: "2014-10-05T00:00:00Z"}});
        
        $httpBackend.flush();
    }));
    
    it('Should have getAllConfig Bundle Select Dashboard View', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService, AppService) {
        spyOn(AppService, "isGbStudioApp").and.returnValue(true);
        spyOn(ExplorerService, "getLoadView").and.returnValue(true);
        ExplorerService.setBundleData({bundlename: 'bundle1', bundle_id: 'bundle'});
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setFromTo");
        spyOn($scope, "loadDefaultFilter");
        
        var data = {
            ec_sysid_map: {
                sysid: 'sysid'
            },
            config: {
                DEFAULT_DAYS: 90,
                MAX_DAY_RANGE_ALLOWED: 30,
                DEFAULT_VIEW: 'SECTION',
                fields: {}
            },
            default_config: {
                DEFAULT_DAYS: 90,
                MAX_DAY_RANGE_ALLOWED: 30,
                DEFAULT_VIEW: 'SECTION',
                fields: {}
            },
            event_columns: {
                evt_text: 'val1',
                obs_date: 'val2'
            },
            facet_label_map: [{
                "sysid": "Serial Number"
            },
            {
                "ticket_num": "Ticket Number"
            }],
            sections_content: {
                "mc.mldcnt": {
                    "nsType": "SECTION",
                    "name": "mc.mldcnt",
                    "description": "Show ipv6 mld counters"
                },
                "mc.ipigmpinter": {
                    "nsType": "REGULAR",
                    "name": "mc.ipigmpinter",
                    "description": "Show ip igmp interface"
                }
            }
        };
        
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond({Data: data});
        $httpBackend.expect('GET', infoserverDomain + '/solr/stats/'+ manufacturer + '/' + product + '/' + schema).respond({Data: {obs_min: "2011-01-03T19:55:55Z", obs_max: "2016-03-16T10:31:03Z"}});
        
        $httpBackend.flush();
    }));
    
    it('Should have getAllConfig Bundle Select error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService) {
        ExplorerService.setBundleData({bundlename: 'bundle1', bundle_id: 'bundle'});
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        var data = {
            ec_sysid_map: {
                sysid: 'sysid'
            },
            config: {
                DEFAULT_DAYS: 90,
                MAX_DAY_RANGE_ALLOWED: 30,
                DEFAULT_VIEW: 'SECTION',
                fields: {}
            },
            event_columns: {
                evt_text: 'val1',
                obs_date: 'val2'
            },
            facet_label_map: [{
                "sysid": "Serial Number"
            },
            {
                "ticket_num": "Ticket Number"
            }],
            sections_content: {
                "mc.mldcnt": {
                    "nsType": "SECTION",
                    "name": "mc.mldcnt",
                    "description": "Show ipv6 mld counters"
                },
                "mc.ipigmpinter": {
                    "nsType": "REGULAR",
                    "name": "mc.ipigmpinter",
                    "description": "Show ip igmp interface"
                }
            }
        };
        
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond({Data: data});
        $httpBackend.expect('GET', infoserverDomain + '/solr/stats/'+ manufacturer + '/' + product + '/' + schema).respond({Data: {obs_min: "2011-01-03T19:55:55Z", obs_max: "2016-03-16T10:31:03Z"}});
        $httpBackend.expect('GET', infoserverDomain + '/bundles/date_boundaries/' + manufacturer + '/' + product + '/' + schema + '/' + manufacturer + '/' + 'bundle').respond(500, {Data: {obs_max: "2015-10-07T00:00:00Z", obs_min: "2014-10-05T00:00:00Z"}});
        
        $httpBackend.flush();
    }));
    
    it('Should have getAllConfig solr stats error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        var data = {
            ec_sysid_map: {
                sysid: 'sysid'
            },
            config: {
                DEFAULT_DAYS: 90,
                MAX_DAY_RANGE_ALLOWED: 30,
                DEFAULT_VIEW: 'EVENT',
                fields: {}
            },
            event_columns: {
                evt_text: 'val1',
                obs_date: 'val2'
            },
            facet_label_map: [{
                "sysid": "Serial Number"
            },
            {
                "ticket_num": "Ticket Number"
            }],
            sections_content: {
                "mc.mldcnt": {
                    "nsType": "SECTION",
                    "name": "mc.mldcnt",
                    "description": "Show ipv6 mld counters"
                },
                "mc.ipmobactive": {
                    "nsType": "EVENT",
                    "name": "mc.ipmobactive",
                    "description": "Show ip mobile active-domains"
                },
                "mc.ipigmpinter": {
                    "nsType": "REGULAR",
                    "name": "mc.ipigmpinter",
                    "description": "Show ip igmp interface"
                }
            }
        };
        
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond({Data: data});
        $httpBackend.expect('GET', infoserverDomain + '/solr/stats/'+ manufacturer + '/' + product + '/' + schema).respond(500, {});
        
        $httpBackend.flush();
    }));
    
    it('Should have getAllConfig error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        
        $httpBackend.flush();
    }));
    
    it('Should have getAllConfig error block session timeout', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.info.sortOrder = {};
        
        $scope.info.notFacetSearch = true;
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION").respond({Data: {response: {}}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION").respond({Data: {facet_counts: {facet_fields: {}, facet_ranges: {gap: 'YEAR/YEAR'}}}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/filter').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh with facets', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.selectedFacets = {
            namespace: [{
                key: 'facet1'
            }, {
                key: 'facet2'
            }],
            obs_date: [{
                label: 'facet3'
            }],
            random: [],
            key1: [{label: 'label1'}],
            key2: [{key: 'random'}, {key: 'def'}]
        };
        
        $scope.defaultFacet = {
            label: 'bundle'
        };
        
        $scope.info.quick = 5;
        
        $scope.info.uploadedBy = "test";
        
        $scope.info.filterSuggest = "";
        
        $scope.info.events = true;
        
        $scope.drillDown = true;
        
        $scope.dateRangeFilterName = null;
        
        $scope.info.currentFacet = {
            key: 'events'
        };
        
        $scope.facets = [{
            key: 'key2',
            data: [{
                key: 'def'
            }]
        }, {
            key: 'key1',
            data: [{
                label: 'label1'
            }]
        }];
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/EVENT?drill_down=true&filter=obs_url%3D%22bundle%22+~%7C%7C~+namespace%3D%22facet1~facet2%22+~%7C%7C~+obs_date%3D%22facet3%22+~%7C%7C~+key1%3D%22label1%22+~%7C%7C~+key2%3D%22undefined~undefined%22&quick_filter=5&sortby=obs_date+desc&uploaded_by=test").respond({Data: {response: {docs: [{namespace_id: 'ns1'}, {namespace_id: 'ns2'}]}, highlighting: {ns1: {}, ns2: {content: ["content"]}}}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/EVENT?drill_down=true&filter=obs_url%3D%22bundle%22+~%7C%7C~+namespace%3D%22facet1~facet2%22+~%7C%7C~+obs_date%3D%22facet3%22+~%7C%7C~+key1%3D%22label1%22+~%7C%7C~+key2%3D%22undefined~undefined%22&quick_filter=5&sortby=obs_date+desc&uploaded_by=test").respond({Data: {facet_counts: {facet_fields: {namespace: ['val1', 23, 'val2', 34], key1: ['val3', 34, 'val4', 12]}, facet_ranges: {obs_date: {gap: 'YEAR/YEAR'}}}}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Event/Drill Down').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh with facet field namespace event', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.selectedFacets = {
            namespace: [{
                key: 'facet1'
            }, {
                key: 'facet2'
            }],
            obs_date: [{
                label: 'facet3'
            }],
            random: [],
            key1: [{label: 'label1'}]
        };
        
        $scope.info.zoomout = true;
        
        $scope.info.currentFacet = {
            key: 'key1'
        };
        
        $scope.info.sectionsContent = {
            val1: {
                nsType: 'EVENT'
            }
        };
        
        $scope.facets = [{
            key: 'key2',
            data: [{
                key: 'def'
            }]
        }, {
            key: 'key1',
            data: [{
                label: 'label1'
            }]
        }, {
            key: 'events'
        }];
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?filter=namespace%3D%22facet1~facet2%22+~%7C%7C~+obs_date%3D%22facet3%22+~%7C%7C~+key1%3D%22label1%22&sortby=obs_date+desc").respond({Data: {response: {docs: [{namespace_id: 'ns1'}, {namespace_id: 'ns2'}]}, highlighting: {ns1: {}, ns2: {content: ["content"]}}}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?filter=namespace%3D%22facet1~facet2%22+~%7C%7C~+obs_date%3D%22facet3%22+~%7C%7C~+key1%3D%22label1%22&sortby=obs_date+desc").respond({Data: {facet_counts: {facet_fields: {namespace: ['val1', 23, 'val2', 34], events: ['val3', 34, 'val4', 12]}, facet_ranges: {obs_date: {gap: 'YEAR/YEAR'}}}}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Default Graph View').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh with facet field namespace section', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.selectedFacets = {
            namespace: [{
                key: 'facet1'
            }, {
                key: 'facet2'
            }],
            obs_date: [{
                label: 'facet3'
            }],
            random: [],
            key1: [{label: 'label1'}]
        };
        
        $scope.info.clearFilter = true;
        
        $scope.info.currentFacet = {
            key: 'key1'
        };
        
        $scope.info.sectionsContent = {
            val1: {}
        };
        
        $scope.facets = [{
            key: 'key2',
            data: [{
                key: 'def'
            }]
        }, {
            key: 'key1',
            data: [{
                label: 'label1'
            }]
        }, {
            key: 'namespace'
        }];
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?filter=namespace%3D%22facet1~facet2%22+~%7C%7C~+obs_date%3D%22facet3%22+~%7C%7C~+key1%3D%22label1%22&sortby=obs_date+desc").respond({Data: {response: {docs: [{namespace_id: 'ns1'}, {namespace_id: 'ns2'}]}, highlighting: {ns1: {}, ns2: {content: ["content"]}}}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?filter=namespace%3D%22facet1~facet2%22+~%7C%7C~+obs_date%3D%22facet3%22+~%7C%7C~+key1%3D%22label1%22&sortby=obs_date+desc").respond({Data: {facet_counts: {facet_fields: {namespace: ['val1', 23, 'val2', 34], events: ['val3', 34, 'val4', 12]}, facet_ranges: {obs_date: {gap: 'YEAR/YEAR'}}}}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Clear Filter').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh with facet field namespace else', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.selectedFacets = {
            events: [{
                key: 'facet1'
            }, {
                key: 'facet2'
            }],
            obs_date: [{
                label: 'facet3'
            }],
            random: [],
            key1: [{label: 'label1'}]
        };
        
        $scope.info.sorting = true;
        
        $scope.info.currentFacet = {
            key: 'key1'
        };
        
        $scope.info.sectionsContent = {
            val1: {}
        };
        
        $scope.facets = [{
            key: 'key2',
            data: [{
                key: 'def'
            }]
        }, {
            key: 'key1',
            data: [{
                label: 'label1'
            }]
        }];
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?filter=namespace%3D%22facet1~facet2%22+~%7C%7C~+obs_date%3D%22facet3%22+~%7C%7C~+key1%3D%22label1%22&sortby=obs_date+desc").respond({Data: {response: {docs: [{namespace_id: 'ns1'}, {namespace_id: 'ns2'}]}, highlighting: {ns1: {}, ns2: {content: ["content"]}}}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?filter=namespace%3D%22facet1~facet2%22+~%7C%7C~+obs_date%3D%22facet3%22+~%7C%7C~+key1%3D%22label1%22&sortby=obs_date+desc").respond({Data: {facet_counts: {facet_fields: {namespace: ['val1', 23, 'val2', 34], events: ['val3', 34, 'val4', 12]}, facet_ranges: {obs_date: {gap: 'YEAR/YEAR'}}}}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Sort Descending').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh with facet no selection false', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.selectedFacets = {
            key1: []
        };
        
        $scope.info.sorting = true;
        $scope.info.sortOrder['val'] = 'asc';
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+asc").respond({Data: {response: {docs: [{namespace_id: 'ns1'}, {namespace_id: 'ns2'}]}, highlighting: {ns1: {}, ns2: {content: ["content"]}}}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+asc").respond({Data: {facet_counts: {facet_fields: {}, facet_ranges: {obs_date: {gap: 'YEAR/YEAR'}}}}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Sort Ascending').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh with only default facet', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.defaultFacet = {
            label: "bundle"
        };
        
        $scope.info.changePageSize = true;
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?filter=obs_url%3D%22bundle%22&sortby=obs_date+desc").respond({Data: {response: {docs: [{namespace_id: 'ns1'}, {namespace_id: 'ns2'}]}, highlighting: {ns1: {}, ns2: {content: ["content"]}}}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?filter=obs_url%3D%22bundle%22&sortby=obs_date+desc").respond({Data: {facet_counts: {facet_fields: {}, facet_ranges: {obs_date: {gap: 'YEAR/YEAR'}}}}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Change Page Count').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh ERR_3', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "d3BarRender");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.info.quickFilter = true;
        $scope.dateRangeFilterName = 'Most Recent Log'
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond({Data: {gb_error: 'ERR_3'}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond({Data: {gb_error: 'ERR_3'}});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/' + $scope.dateRangeFilterName).respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh ERR_2', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "d3BarRender");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.info.paginate = true;
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond({Data: {gb_error: 'ERR_2'}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond({Data: {gb_error: 'ERR_2'}});
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh ERR_13', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "d3BarRender");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.info.paginate = true;
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond({Data: {gb_error: 'ERR_13'}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond({Data: {gb_error: 'ERR_13'}});
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh ERR_0', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService, GlobalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        var html = '<div class="d3-chart-container-explorer"></div>';
        angular.element(document.body).append(html);
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        GlobalService.setVal('redirect_login_url', '#');
        
        $scope.info.paginate = true;
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond({Data: {gb_error: 'ERR_0'}});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond({Data: {gb_error: 'ERR_0'}});
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService, GlobalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });

        var html = '<div class="d3-chart-container-explorer"></div>';
        angular.element(document.body).append(html);
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "d3BarRender");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.info.paginate = true;
        
        $scope.refresh();
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/facets/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond(500, {});
        
        $httpBackend.flush();
    }));
    
    it('Should have refresh without facets loading', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ModalService, GlobalService) {
        spyOn(ModalService, "sessionTimeout");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });

        var html = '<div class="d3-chart-container-explorer"></div>';
        angular.element(document.body).append(html);
        spyOn($scope, "paginator");
        spyOn($scope, "reloadGraph");
        spyOn($scope, "getFrom").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        spyOn($scope, "getTo").and.returnValue("1970-1-1Tundefined:undefined:undefinedZ");
        
        $scope.info.paginate = true;
        
        $scope.refresh(true);
       
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {Msg: 'timeout'});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/search/" + manufacturer + '/' + product + '/' + schema + "/" + "1970-1-1Tundefined:undefined:undefinedZ/1970-1-1Tundefined:undefined:undefinedZ/0/10/SECTION?sortby=obs_date+desc").respond(500, {});

        $httpBackend.flush();
    }));

	it('Should have showContent', inject(function($rootScope, $controller, $sce) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
        var html = '<div class="d3-chart-container-explorer"></div>';
        angular.element(document.body).append(html);
		expect($scope.showContent).toEqual(jasmine.any(Function));
		$scope.showContent('');
		$scope.info.filterSuggest = "*";
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
		$scope.showContent(result, 1);
		expect(result.content).toEqual(' 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ');
		$scope.info.filterSuggest = "root";
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
		$scope.showContent(result, 1);
		expect(result.content).toEqual(' 16 root RT 0 0 0 0 S 0.0 0.0 0:00.00 migration/3 ');
		var result = {
			"obs_size" : 112609,
			"namespace_id" : "5-/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_slabinfo-5",
			"obs_date_str" : "Mon Dec 05 14:00:01 GMT-0700 2014",
			"obs_url" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.tar.gz",
			"namespace" : "slabinfonmversion",
			"obs_date" : "2014-12-05T21:00:01Z",
			"sys_hwaddr" : "00:0C:29:9E:F5:12",
			"begin_offset" : 5,
			"filename" : "/home/gbprod/gbsoft/gbnewplatform-package-4.4.0/permanent/glass/glass/linux_apache/gb_linux_apache_pod/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01.5/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/goldenconfig-GB-gbh-ui-01-2014_12_05_14_00_01/GB_linux_slabinfo",
			"sys_display_name" : "gbh-ui-01",
			"type" : "NA",
			"sys_timezone" : "-0700",
			"content" : "MOUNT POINTS\n-----------------\n/dev/mapper/vg_gbsolr01-lv_root on / type ext4 (rw)\nproc on /proc type proc (rw)\nsysfs on /sys type sysfs (rw)\ndevpts on /dev/pts type devpts (rw,gid=5,mode=620)\ntmpfs on /dev/shm type tmpfs (rw,rootcontext=\"system_u:object_r:tmpfs_t:s0\")\n/dev/sda1 on /boot type ext4 (rw)\n/dev/sdb on /ebs type ext4 (rw,noatime,nodiratime,data=writeback,nobh)\nnone on /proc/sys/fs/binfmt_misc type binfmt_misc (rw)",
			"showExpanded" : true
		};
		$scope.showContent(result, 1);
		expect(result.content).toEqual('MOUNT POINTS\n-----------------\n/dev/mapper/vg_gbsolr01-lv_root on / type ext4 (rw)\nproc on /proc type proc (rw)\nsysfs on /sys type sysfs (rw)\ndevpts on /dev/pts type devpts (rw,gid=5,mode=620)\ntmpfs on /dev/shm type tmpfs (rw,rootcontext="system_u:object_r:tmpfs_t:s0")\n/dev/sda1 on /boot type ext4 (rw)\n/dev/sdb on /ebs type ext4 (rw,noatime,nodiratime,data=writeback,nobh)\nnone on /proc/sys/fs/binfmt_misc type binfmt_misc (rw)');
		$scope.info.filterSuggest = "*";
		$scope.showContent(result, 1);
		expect(result.content).toEqual('MOUNT POINTS\n-----------------\n/dev/mapper/vg_gbsolr01-lv_root on / type ext4 (rw)\nproc on /proc type proc (rw)\nsysfs on /sys type sysfs (rw)\ndevpts on /dev/pts type devpts (rw,gid=5,mode=620)\ntmpfs on /dev/shm type tmpfs (rw,rootcontext="system_u:object_r:tmpfs_t:s0")\n/dev/sda1 on /boot type ext4 (rw)\n/dev/sdb on /ebs type ext4 (rw,noatime,nodiratime,data=writeback,nobh)\nnone on /proc/sys/fs/binfmt_misc type binfmt_misc (rw)');
		$scope.showContent(result, 2);
		expect(result.content).toEqual('MOUNT POINTS\n-----------------\n/dev/mapper/vg_gbsolr01-lv_root on / type ext4 (rw)\nproc on /proc type proc (rw)\nsysfs on /sys type sysfs (rw)\ndevpts on /dev/pts type devpts (rw,gid=5,mode=620)\ntmpfs on /dev/shm type tmpfs (rw,rootcontext="system_u:object_r:tmpfs_t:s0")\n/dev/sda1 on /boot type ext4 (rw)\n/dev/sdb on /ebs type ext4 (rw,noatime,nodiratime,data=writeback,nobh)\nnone on /proc/sys/fs/binfmt_misc type binfmt_misc (rw)');
		$scope.info.filterSuggest = "root";
		$scope.showContent(result, 2);
		expect(result.content).toEqual('MOUNT POINTS\n-----------------\n/dev/mapper/vg_gbsolr01-lv_root on / type ext4 (rw)\nproc on /proc type proc (rw)\nsysfs on /sys type sysfs (rw)\ndevpts on /dev/pts type devpts (rw,gid=5,mode=620)\ntmpfs on /dev/shm type tmpfs (rw,rootcontext="system_u:object_r:tmpfs_t:s0")\n/dev/sda1 on /boot type ext4 (rw)\n/dev/sdb on /ebs type ext4 (rw,noatime,nodiratime,data=writeback,nobh)\nnone on /proc/sys/fs/binfmt_misc type binfmt_misc (rw)');
	}));

	it('Should have resetFromUI', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.resetFromUI).toEqual(jasmine.any(Function));
		$scope.info.config = {
			DEFAULT_VIEW : 'BOTH'
		};
		$scope.info.defaultFilterInfo = {
			default_filter_type : 'savedsearch'
		};
		spyOn($scope, "reset");

        var html = '<div class="d3-chart-container-explorer"></div>';
        angular.element(document.body).append(html);
		$scope.resetFromUI();
		expect($scope.info.page['current']).toEqual(0);
		expect($scope.info.selectedFilterName).toEqual("Select View");
		expect($scope.reset).toHaveBeenCalled();
		$scope.info.defaultFilterInfo.default_filter_status = 'on';
		$scope.resetFromUI();
		expect($scope.info.page['current']).toEqual(0);
		expect($scope.reset).toHaveBeenCalled();
	}));

	it('Should have checkChange', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "refresh");
		expect($scope.checkChange).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : false
		};
		spyOn($scope, "removeSelected");
		$scope.checkChange(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : []
		});
		expect($scope.removeSelected).toHaveBeenCalledWith(facet, f_data);
		$scope.selectedFacets = {
			obs_url : [],
			sys_display_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : true
			}],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : true
		};
		$scope.checkChange(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : true
			}, {
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : true
			}],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		});
	}));

	it('Should have checkDisabled', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.checkDisabled).toEqual(jasmine.any(Function));
		var facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 9992,
			"selected" : true
		};
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var disabledValue = $scope.checkDisabled(facet, f_data);
		expect(disabledValue).toBeFalsy();
		facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4295,
				"selected" : true,
				"disabled" : true
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 924,
				"selected" : false
			}]
		};
		f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 9992,
			"selected" : true,
			"disabled" : true
		};
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 9992,
				"selected" : true,
				"disabled" : true
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
		disabledValue = $scope.checkDisabled(facet, f_data);
		expect(disabledValue).toBeTruthy();
	}));

	it('Should have changeEventSection', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeEventSection).toEqual(jasmine.any(Function));
		
		spyOn($scope, "refresh");
        
        $scope.info.config = {
            DEFAULT_VIEW: 'SECTION'
        };
		$scope.info.eventsection = "event";
		$scope.changeEventSection();

		$scope.info.eventsection = "section";
		$scope.info.filterSuggest = "CompoundSearch=shdfiu";
        $scope.changeEventSection();
        
        $scope.info.eventsection = "else";
        $scope.changeEventSection();
        
        $scope.info.eventsection = 'section';
        $scope.info.filterSuggest = '';
        $scope.dateRangeFilterName = GlobalService.getVal('customdate');
        $scope.info.toDate = new Date();
        $scope.info.solrEndDate = $scope.info.toDate;
        $scope.changeEventSection();
	}));

	it('Should have addSelected', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "refresh");
		expect($scope.addSelected).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.filterSuggest = "CompoundSearch=abc";
		$scope.info.sections = true;
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : false
		};
		//spyOn($scope, "refresh");
		$scope.addSelected(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : []
		});
		//expect($scope.refresh).toHaveBeenCalled();
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var facet = {
			"key" : "test_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}]
		};
		$scope.addSelected(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		});
	}));

	it('Should have removeSelected', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "refresh");
		expect($scope.removeSelected).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.selectedFacets = {
			obs_url : [],
			sys_display_name : [{
			    label: 'label1',
			    disabled: true
			}, {
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		};
		var facet = {
			"key" : "sys_display_name",
			"label" : "Host Name",
			"data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}],
			"expanded" : true,
			"f_data" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-solr-01",
				"value" : 904,
				"selected" : false
			}]
		};
		var f_data = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : false
		};
		$scope.info.filterSuggest = "";
		//spyOn($scope, "refresh");
		$scope.removeSelected(facet, f_data);
		expect($scope.selectedFacets).toEqual({
			obs_url : [],
			sys_display_name : [{ 
			    label: 'label1', 
			    disabled: true 
			}],
			sys_hwaddr : [],
			namespace : [],
			obs_date_str : [],
			sys_timezone : [],
			apc_ipaddr : [],
			evt_date_str : [],
			events : [],
			test_name : [{
				title : 'Host Name',
				label : 'gbh-ui-01',
				value : 24454,
				selected : false
			}]
		});
		
		$scope.selectedFacets = {};
		$scope.customDateFilter = true;
		$scope.removeSelected(facet, f_data);
		
		//expect($scope.refresh).toHaveBeenCalled();
	}));

	it('Should have removeFacet', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "refresh");
		expect($scope.removeFacet).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : true,
				"disabled" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : true,
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var key = "sys_display_name";
		var facet = {
			"title" : "Host Name",
			"label" : "gbh-ui-01",
			"value" : 24454,
			"selected" : true,
			"disabled" : false
		};
		$scope.info.events = true;
		$scope.info.sections = true;
		//spyOn($scope, "refresh");
		$scope.removeFacet(key, facet);
		expect($scope.selectedFacets).toEqual({
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : true,
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		});
		//expect($scope.refresh).toHaveBeenCalled();
		
		$scope.selectedFacets = {
            "obs_url" : [],
            "sys_display_name" : [{
                "title" : "Host Name",
                "label" : "gbh-ui-01",
                "value" : 24454,
                "selected" : true,
                "disabled" : true
            }, {
                "title" : "Host Name",
                "label" : "gbh-cass-dr",
                "value" : 4250,
                "selected" : true,
                "disabled" : false
            }],
            "sys_hwaddr" : [],
            "namespace" : [],
            "obs_date_str" : [],
            "sys_timezone" : [],
            "apc_ipaddr" : [],
            "evt_date_str" : [],
            "events" : []
        };
        
        $scope.removeFacet(key, facet);
        
        $scope.selectedFacets = {
            "obs_url" : [],
            "sys_display_name" : [],
            "sys_hwaddr" : [],
            "namespace" : [],
            "obs_date_str" : [],
            "sys_timezone" : [],
            "apc_ipaddr" : [],
            "evt_date_str" : [],
            "events" : []
        };
        
        $scope.customDateFilter = true;
        
        $scope.removeFacet(key, facet);
	}));
	
	it('Should have removeDefaultFacet', inject(function($rootScope, $controller, ExplorerService) {
	    var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "refresh");
        expect($scope.removeDefaultFacet).toEqual(jasmine.any(Function));
        
        $scope.customDateFilter = true;
        
        $scope.removeDefaultFacet();
        
        $scope.selectedFacets = {
            facet1: [{
                disabled: true
            }, {
                disabled: false
            }]
        };
        
        $scope.customDateFilter = false;
        
        $scope.removeDefaultFacet();
	}));

	it('Should have getExportUrl', inject(function($rootScope, $controller, ExplorerService) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.getExportUrl).toEqual(jasmine.any(Function));
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [{
				"title" : "Host Name",
				"label" : "gbh-ui-01",
				"value" : 24454,
				"selected" : true,
				"disabled" : false
			}, {
				"title" : "Host Name",
				"label" : "gbh-cass-dr",
				"value" : 4250,
				"selected" : true,
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		spyOn(ExplorerService, "getExportUrl").and.returnValue('#');
		spyOn($scope, "getTo");
		$scope.info.page = {
			current : 0,
			count : 1540
		};
		$scope.info.sortOrder = {
			val : 'desc'
		};
		$scope.info.filterSuggest = "*";
		$scope.info.selectedEvtAttribs = [{
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
		var i,
		    selectedFacets = {};
		angular.forEach($scope.selectedFacets, function(facets, key) {
			if (!Array.isArray(selectedFacets[key]) && key != 'events') {
				selectedFacets[key] = [];
			}
			if (key == 'events' || key == 'namespace') {
				for (i in facets) {
					selectedFacets['namespace'].push(facets[i].key);
				}
			} else {
				for (i in facets) {
					selectedFacets[key].push(facets[i].label);
				}
			}
		});
		$scope.info.events = true;
		$scope.getExportUrl(5);
		$scope.info.sections = false;
		$scope.getExportUrl(5);
		$scope.info.events = false;
		$scope.info.sections = true;
		$scope.getExportUrl(5);
		
		$scope.info.quick = 5;
		$scope.info.uploadedBy = "test";
		$scope.getExportUrl(1);
		
		$scope.selectedFacets = {
		    
		};
		
		$scope.info.sortOrder = {
		    val: false
		};
		
		$scope.getExportUrl(1);
		
		$scope.selectedFacets = {
		    namespace: [{
		        title: 'title1',
		        key: 'key1'
		    }, {
		        title: 'title2',
		        key: 'key2'
		    }],
		    key1: [{
		        title: 'title3',
		        label: 'label3'
		    }, {
		        title: 'title4',
		        label: 'label4'
		    }]
		};
		
		$scope.getExportUrl(1);
	}));

	it('Should have setFromTo', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.setFromTo).toEqual(jasmine.any(Function));
		var d = new Date();
		var d1 = new Date();
		spyOn($scope, "refresh");
		$scope.setFromTo(d, d1);
		expect($scope.info.fromDate).toEqual(d);
		expect($scope.info.fromTime.hr).toEqual(d.getHours());
		expect($scope.info.fromTime.min).toEqual(d.getMinutes());
		expect($scope.info.fromTime.sec).toEqual(d.getSeconds());
		expect($scope.info.toDate).toEqual(d1);
		expect($scope.info.toTime.hr).toEqual(d1.getHours());
		expect($scope.info.toTime.min).toEqual(d1.getMinutes());
		expect($scope.info.toTime.sec).toEqual(d1.getSeconds());
		expect($scope.refresh).toHaveBeenCalled();
		
		var tdate = new Date("25 Jun 2098");
		$scope.setFromTo(d, tdate);
		
		$scope.setFromTo(d, tdate, true);
		
	}));

	it('Should have getFrom', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.getFrom).toEqual(jasmine.any(Function));
		
		$scope.getUTCTime = true;
		$scope.info.fromDate = new Date("24 Jun 1997");
        var html = '<div class="d3-chart-container-explorer"></div>';
        angular.element(document.body).append(html);
		$scope.getFrom();
	}));
	
	it('$watch $scope.info.toDate', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        $scope.info.toDate = new Date("24 Jun 1997");
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $scope.$digest();
        
        $scope.info.toDate = new Date("24 Jun 2997");
        $scope.$digest();
    }));
	
	it('$watch $scope.info.resultLoading', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        $scope.info.resultLoading = false;
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        $scope.$digest();
        
        $scope.info.resultLoading = true;
        $scope.$digest();
    }));
	
	it('receive AppLoadEvent-explorer', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain, ExplorerService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadDefaultFilter");
        spyOn($scope, "searchFromLogvault");
        $scope.info.resultLoading = false;
        $rootScope.$broadcast('AppLoadEvent-explorer');
        $scope.info.resultLoading = true;
        $rootScope.$broadcast('AppLoadEvent-explorer');
        $rootScope.$broadcast('AppLoadEvent-explorer', true);
        
        spyOn(ExplorerService, "getLoadView").and.returnValue(true);
        $scope.info.allConfigLoading = false;
        $rootScope.$broadcast('AppLoadEvent-explorer', true);
    }));

	it('Should have getTo', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.getTo).toEqual(jasmine.any(Function));
		
		$scope.info.toDate = new Date("Jan 28 2075");
		$scope.getUTCTime = true;
		
		$scope.getTo();
		
		$scope.defaultFacet = true;
		$scope.info.bundleToDate = true;
		
		$scope.getTo();
	}));

	it('Should have getError', inject(function($rootScope, $controller, ErrorService) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.getError).toEqual(jasmine.any(Function));
		spyOn(ErrorService, "getErrors");
		var value = $scope.getError();
		expect(ErrorService.getErrors).toHaveBeenCalledWith('explorer');
		expect(value).toEqual(ErrorService.getErrors('explorer'));
	}));
	
	it('Should have getSysErrors', inject(function($rootScope, $controller, ErrorService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.getSysErrors).toEqual(jasmine.any(Function));
        spyOn(ErrorService, "getErrors");
        var value = $scope.getSysErrors();
        expect(ErrorService.getErrors).toHaveBeenCalledWith('gbApp');
        expect(value).toEqual(ErrorService.getErrors('gbApp'));
    }));
	
	it('Should have renderHtml', inject(function($rootScope, $controller, $sce) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($sce, "trustAsHtml");
        expect($scope.renderHtml).toEqual(jasmine.any(Function));
        expect($scope.renderHtml('abcd')).toEqual($sce.trustAsHtml('abcd'));
    }));

	it('Should have addAttrib', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.addAttrib).toEqual(jasmine.any(Function));
		$scope.info.evtAttribs = ['u1', 'u2'];
		$scope.info.tSelectedEvtAttribs = [];
		$scope.addAttrib('u1');
		expect($scope.info.evtAttribs).toEqual(['u2']);
		expect($scope.info.tSelectedEvtAttribs).toEqual(['u1']);
		$scope.info.tSelectedEvtAttribs = ['u1', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10', 'u11'];
		$scope.addAttrib('u2');
	}));

	it('Should have removeAttrib', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.removeAttrib).toEqual(jasmine.any(Function));
		$scope.info.evtAttribs = ['u1', 'u2'];
		$scope.info.tSelectedEvtAttribs = ['u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10', 'u11'];
		$scope.removeAttrib('u3');
		expect($scope.info.evtAttribs).toEqual(['u1', 'u2', 'u3']);
		expect($scope.info.tSelectedEvtAttribs).toEqual(['u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10', 'u11']);
		$scope.removeAttrib({default: true});
	}));

	it('Should have removeAllAttrib', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.removeAllAttrib).toEqual(jasmine.any(Function));
		$scope.info.tSelectedEvtAttribs = [{
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
		$scope.removeAllAttrib();
		expect($scope.info.tSelectedEvtAttribs).toEqual([{
			"key" : "evt_date_str",
			"dataType" : "STRING",
			"label" : "Date",
			"default" : true
		}, {
			"key" : "evt_text",
			"dataType" : "STRING",
			"label" : "Event Text",
			"default" : true
		}]);
	}));

	it('Should have saveEvtAttrib', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.saveEvtAttrib).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.tSelectedEvtAttribs = [{
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
		$scope.info.selectedEvtAttribs = [{
			"key" : "evt_date_str",
			"dataType" : "STRING",
			"label" : "Date",
			"default" : true
		}, {
			"key" : "evt_text",
			"dataType" : "STRING",
			"label" : "Event Text",
			"default" : true
		}];
		spyOn($scope, "refresh");
		$scope.saveEvtAttrib();
		expect($scope.info.selectedEvtAttribs).toEqual($scope.info.tSelectedEvtAttribs);
		expect($scope.refresh).toHaveBeenCalled();
	}));

	it('Should have cancelEvtAttrib', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.cancelEvtAttrib).toEqual(jasmine.any(Function));
		$scope.info.tSelectedEvtAttribs = [{
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
		$scope.info.selectedEvtAttribs = [{
			"key" : "evt_date_str",
			"dataType" : "STRING",
			"label" : "Date",
			"default" : true
		}, {
			"key" : "evt_text",
			"dataType" : "STRING",
			"label" : "Event Text",
			"default" : true
		}];
		$scope.cancelEvtAttrib();
		expect($scope.info.tSelectedEvtAttribs).toEqual($scope.info.selectedEvtAttribs);
		
		$scope.info.evtAttribsDefault = ['attr1', 'attr2', 'attr3'];
		$scope.info.selectedEvtAttribs = ['attr1', 'attr2', 'attr4'];
		$scope.cancelEvtAttrib();
		
	}));

	it('Should have showAggregate', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.showAggregate).toEqual(jasmine.any(Function));
		var attrib = {
			"dataType" : "INTEGER",
			"label" : "Var log Index",
			"key" : "varlog_sev_idx"
		};
		$scope.facetCounts = {};
		$scope.facetCounts['facet_fields'] = {
			"varlog_sev_idx" : ["1", 5],
			"dskstat_num_sec_w" : ["0.0", 201, "68.0", 5, "18008.0", 5, "60.0", 3, "2.0929592E7", 3, "7.5280344E7", 3, "7.5298352E7", 3, "7.529842E7", 3, "3092648.0", 2, "2.225768E7", 2, "5.6310552E7", 2, "5.94032E7", 2, "5.940326E7", 2, "6.4148232E7", 2, "7.8439232E7", 2, "7.845724E7", 2, "7.8457308E7", 2, "1.81885064E8", 2, "1.821196E8", 2, "3.64004568E8", 2, "3.64004648E8", 2, "6.4148292E7", 1, "1.21386256E8", 1, "1.21413056E8", 1, "2.42799216E8", 1, "2.42799296E8", 1],
			"namespace" : ["lsofnm", 19107, "apcl", 5875, "cputop", 1329, "psax", 1313, "lin.cpuinfo", 546, "procdskstatinfonm", 257, "lin.netfailrep", 180, "lin.cswch", 90, "lin.dwps", 90, "lin.inode", 90, "lin.intrp", 90, "lin.memutil", 90, "lin.msr", 90, "lin.proc", 90, "lin.prold", 90, "lin.psr", 90, "lin.sck", 90, "lin.swpag", 90, "varlogmsg", 5, "lin.df", 3, "lin.freecmd", 3],
			"sys_hwaddr" : ["00:0C:29:9E:F5:12", 24454, "00:0C:29:21:24:D2", 4250, "00:0C:29:B3:01:F8", 904],
			"sys_display_name" : ["gbh-ui-01", 24454, "gbh-cass-dr", 4250, "gbh-solr-01", 904],
			"sys_timezone" : ["-0700", 29608],
			"apc_ipaddr" : ["172.31.42.3", 5751, "172.31.42.29", 120, "127.0.0.1", 4]
		};
		$scope.showAggregate(attrib);
		expect($scope.info.aggregateData).toEqual({
			title : 'Var log Index',
			data : [{
				label : '1',
				count : 5,
				percentage : 100
			}]
		});
		expect($scope.info.isAggregate).toBeTruthy();
		$scope.facetCounts['facet_fields'] = {
			"dskstat_num_sec_w" : ["0.0", 201, "68.0", 5, "18008.0", 5, "60.0", 3, "2.0929592E7", 3, "7.5280344E7", 3, "7.5298352E7", 3, "7.529842E7", 3, "3092648.0", 2, "2.225768E7", 2, "5.6310552E7", 2, "5.94032E7", 2, "5.940326E7", 2, "6.4148232E7", 2, "7.8439232E7", 2, "7.845724E7", 2, "7.8457308E7", 2, "1.81885064E8", 2, "1.821196E8", 2, "3.64004568E8", 2, "3.64004648E8", 2, "6.4148292E7", 1, "1.21386256E8", 1, "1.21413056E8", 1, "2.42799216E8", 1, "2.42799296E8", 1],
			"namespace" : ["lsofnm", 19107, "apcl", 5875, "cputop", 1329, "psax", 1313, "lin.cpuinfo", 546, "procdskstatinfonm", 257, "lin.netfailrep", 180, "lin.cswch", 90, "lin.dwps", 90, "lin.inode", 90, "lin.intrp", 90, "lin.memutil", 90, "lin.msr", 90, "lin.proc", 90, "lin.prold", 90, "lin.psr", 90, "lin.sck", 90, "lin.swpag", 90, "varlogmsg", 5, "lin.df", 3, "lin.freecmd", 3],
			"sys_hwaddr" : ["00:0C:29:9E:F5:12", 24454, "00:0C:29:21:24:D2", 4250, "00:0C:29:B3:01:F8", 904],
			"sys_display_name" : ["gbh-ui-01", 24454, "gbh-cass-dr", 4250, "gbh-solr-01", 904],
			"sys_timezone" : ["-0700", 29608],
			"apc_ipaddr" : ["172.31.42.3", 5751, "172.31.42.29", 120, "127.0.0.1", 4]
		};
		$scope.showAggregate(attrib);
		
		$scope.facetCounts = {
		    facet_fields: {
		        'jagjdhgasjdgjashdgjasdgjasgdjasdashdg': 'jhagjhagsdhagsjdhgasdgc vgcjhc'
		    }
		};
		attrib['key'] = 'jagjdhgasjdgjashdgjasdgjasgdjasdashdg';
		$scope.showAggregate(attrib);
	}));

	it('Should have addInstance', inject(function($rootScope, $controller, InstanceHandler, $filter, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.addInstance).toEqual(jasmine.any(Function));
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
			
			"Serial Number": result[$scope.info.sysId],
			"bundle": $filter('bundleName')(result.obs_url),
			"file": $filter('bundleName')(result.filename),
			"observation" : result.obs_date_str
			
		};
		// var details = {
			// "nsType" : "EVENT",
			// "name" : "cputop",
			// "description" : "Top Command Process Info"
		// };
		$scope.info.sectionsContent = {};
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.sectionsContent[result.namespace] = {};
		$scope.info.sectionsContent[result.namespace]['nsType'] = "EVENT";
		$scope.info.config = {};
		$scope.info.config.instance_display = '';
		$scope.info.config.file_diff_key = '';
		$scope.addInstance(result, details);
		$scope.info.sectionsContent[result.namespace]['nsType'] = "SECTION";
		spyOn(InstanceHandler, "addInstance");
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

		instance = {
			"type" : type,
			"title" : title,
			"data" : {
				"result" : result,
				"bundle" : $filter('bundleName')(result.obs_url),
				"sysId" : result[$scope.info.sysId],
				"file" : $filter('bundleName')(result.filename),
				"instanceDisplay" : GlobalService.getVal('instance_viewer_displayfield'),
				"fileDiffAttr" : $scope.info.config.file_diff_key,
				"eventSource" : details.description,
				"start_time" : $scope.getFrom(),
				"end_time" : $scope.getTo(),
				'observation' : result.obs_date,
				'observationStr' : result.obs_date_str
			}
		};
		$scope.addInstance(result, details);
		// expect(InstanceHandler.addInstance).toHaveBeenCalledWith(instance, $scope);
		
		$scope.info.events = true;
		$scope.addInstance(result, details);
	}));

	it('Should have paginator', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		
		spyOn($scope, "refresh");
		expect($scope.paginator).toEqual(jasmine.any(Function));
		var count = 50;
		$scope.paginator(count);
		expect($scope.info.page['total']).toEqual(count);
		expect($scope.info.page['pages']).toEqual(Math.ceil($scope.info.page['total'] / $scope.info.page['count']));
		
		$scope.info.page['count'] = 20;
		$scope.info.page['current'] = 12;
		
		$scope.paginator(200);
	}));
	
	it('Should have changePageSize', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "refresh");
        expect($scope.changePageSize).toEqual(jasmine.any(Function));
        $scope.changePageSize();
    }));

	it('Should have nextPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.nextPage).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page = {
			current : 2,
			pages : 20
		};
		spyOn($scope, "refresh");
		$scope.nextPage();
		expect($scope.info.page).toEqual({
			current : 3,
			pages : 20
		});
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.page = {
			current : 19,
			pages : 20
		};
		$scope.nextPage();
		expect($scope.info.page).toEqual({
			current : 19,
			pages : 20
		});
	}));

	it('Should have prevPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.prevPage).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page.current = 1;
		spyOn($scope, "refresh");
		$scope.prevPage();
		expect($scope.refresh).toHaveBeenCalled();
		expect($scope.info.page.current).toEqual(0);
		$scope.info.page.current = 0;
		$scope.prevPage();
		expect($scope.info.page.current).toEqual(0);
	}));

	it('Should have firstPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.firstPage).toEqual(jasmine.any(Function));
		$scope.info.page.current = 0;
		spyOn($scope, "refresh");
		$scope.firstPage();
		expect($scope.info.page.current).toEqual(0);
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page.current = 7;
		$scope.firstPage();
		expect($scope.info.page.current).toEqual(0);
		expect($scope.refresh).toHaveBeenCalled();
	}));

	it('Should have lastPage', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.lastPage).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.page = {
			current : 3,
			pages : 30
		};
		spyOn($scope, "refresh");
		$scope.lastPage();
		expect($scope.info.page.current).toEqual(29);
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.page.current = 29;
		$scope.lastPage();
		expect($scope.info.page.current).toEqual(29);
	}));

	it('Should have sortResults', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.sortResults).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		spyOn($scope, "refresh");
		$scope.sortResults('desc');
		expect($scope.info.sortOrder).toEqual({
			label : 'Latest',
			val : 'desc'
		});
		expect($scope.refresh).toHaveBeenCalled();
		$scope.sortResults('asc');
		expect($scope.info.sortOrder).toEqual({
			label : 'Oldest',
			val : 'asc'
		});
		expect($scope.refresh).toHaveBeenCalled();
	}));

	it("Should have instanceDashboardFullscreen", inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('instanceDashboardFullscreen')).toBeTruthy();
		expect($scope.instanceDashboardFullscreen).toBeFalsy();
	}));

	it("Should have instanceDashboardItems", inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('instanceDashboardItems')).toBeTruthy();
		expect($scope.instanceDashboardItems).toEqual(jasmine.any(Array));
		expect($scope.instanceDashboardItems).toEqual([{
			name : '(1) Event Viewer'
		}]);
	}));

	it("Should have toggleChartCnt", inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.hasOwnProperty('toggleChartCnt')).toBeTruthy();
		expect($scope.toggleChartCnt).toBeTruthy();
	}));
	
	it("Should have reset", inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.reset).toEqual(jasmine.any(Function));
        
        spyOn($scope, "setFromTo");
        
        $scope.facets = [{
            data: [{
                disabled: true
            }, {
                disabled: false
            }]
        }];
        
        $scope.selectedFacets = {
            facet1: [{
                disabled: true
            }, {
                disabled: false
            }]
        };
        
        $scope.info.config = {
            DEFAULT_VIEW: 'SECTION'
        };
        
        $scope.reset();
        
        $scope.info.config = {
            DEFAULT_VIEW: 'EVENT'
        };
        
        $scope.info.default_days = 255;
        $scope.reset();
        
        $scope.reset(true);
    }));

	it('Should have loadView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.loadView).toEqual(jasmine.any(Function));
		spyOn($scope, "applyView");
		spyOn($scope, "parseView");
		
		var view = {
		    search_type: 'SECTION'
		};
		$scope.loadView(view);
		
		$scope.info.events = true;
		view = {
            search_type: 'OUTOFBOX'
        };
        $scope.loadView(view);
	}));

	it('Should have loadLogsByMe', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.loadLogsByMe).toEqual(jasmine.any(Function));
		spyOn($scope, "resetFacets");
		spyOn($scope, "refresh");
		spyOn($scope, "setFromTo");
		$scope.loadLogsByMe(5);
		expect($scope.info.defaultState).toBeFalsy();
		expect($scope.info.quick).toEqual(5);
		expect($scope.info.pristine).toBeFalsy();
		expect($scope.info.selectedFilterName).toEqual($scope.getValue('last' + 5 + 'byme'));
		expect($scope.resetFacets).toHaveBeenCalled();
		expect($scope.refresh).toHaveBeenCalled();
		
		$scope.loadLogsByMe(5);
		expect($scope.info.defaultState).toBeFalsy();
		expect($scope.info.quick).toEqual(5);
		expect($scope.info.pristine).toBeFalsy();
		expect($scope.info.selectedFilterName).toEqual($scope.getValue('last' + 5 + 'byme'));
		expect($scope.resetFacets).toHaveBeenCalled();
		expect($scope.refresh).toHaveBeenCalled();
		
		$scope.info.solrEndDate = new Date();
		$scope.info.default_days = 255;
		$scope.loadLogsByMe(5, true);
		
		$scope.info.default_days = 0;
        $scope.loadLogsByMe(5, true);
	}));
	
	it('Should have resetFacets', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.resetFacets).toEqual(jasmine.any(Function));
        
        $scope.facets = [{
            key: 'facet1',
            data: [{
                selected: true
            }, {
                selected: false
            }]
        }, {
            key: 'facet2'
        }];
        
        $scope.selectedFacets = {
            facet1: [{}, {}]
        };
        
        $scope.resetFacets();
        
        expect($scope.facets).toEqual([ { key: 'facet1', data: [ { selected: false }, { selected: false } ] }, { key: 'facet2' } ]);
        
    }));

	it('Should have removeOutOfBox', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.removeOutOfBox).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.config = {};
		$scope.info.filterSuggest = "*";
		$scope.info.config['DEFAULT_VIEW'] = 'BOTH';
		$scope.info.events = true;
		$scope.info.sections = true;
		spyOn($scope, "refresh");
		$scope.removeOutOfBox();
		expect($scope.info.pristine).toBeTruthy();
		expect($scope.info.defaultState).toBeFalsy();
		expect($scope.info.quick).toEqual(0);
		expect($scope.info.selectedFilterName).toEqual("Select View");
		expect($scope.info.uploadedBy).toBeNull();
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.config['DEFAULT_VIEW'] = 'EVENT';
		$scope.info.events = true;
		$scope.info.sections = false;
		$scope.removeOutOfBox();
		expect($scope.info.pristine).toBeTruthy();
		expect($scope.info.defaultState).toBeFalsy();
		expect($scope.info.quick).toEqual(0);
		expect($scope.info.selectedFilterName).toEqual("Select View");
		expect($scope.info.uploadedBy).toBeNull();
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.config['DEFAULT_VIEW'] = 'SECTION';
		$scope.info.events = false;
		$scope.info.sections = true;
		$scope.removeOutOfBox();
		expect($scope.info.pristine).toBeTruthy();
		expect($scope.info.defaultState).toBeFalsy();
		expect($scope.info.quick).toEqual(0);
		expect($scope.info.selectedFilterName).toEqual("Select View");
		expect($scope.info.uploadedBy).toBeNull();
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.config['DEFAULT_VIEW'] = 'EVENT';
		$scope.info.filterSuggest = "test";
		$scope.removeOutOfBox();
	}));

	it('Should have checkFacets', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.checkFacets).toEqual(jasmine.any(Function));
		$scope.selectedFacets = {
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
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		var facetCheck = $scope.checkFacets();
		expect(facetCheck).toBeTruthy();
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		facetCheck = $scope.checkFacets();
		expect(facetCheck).toBeFalsy();
		
		$scope.defaultFacet = true;
		facetCheck = $scope.checkFacets();
        expect(facetCheck).toBeTruthy();
	}));
	
	it('Should have applyView', inject(function($rootScope, $controller) {
	    var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.applyView).toEqual(jasmine.any(Function));
        
        spyOn($scope, "resetFacets");
        spyOn($scope, "changeQuickFilter");
        spyOn($scope, "setFromTo");
        spyOn($scope, "loadLogsByMe");
        
        var p_view = {
            facets : {
                sys_display_name : ['gbh-ui-01', 'gbh-cass-dr']
            },
            facetKeys: {},
            search_text : '*',
            start_time : '2004-12-16 14:08:49',
            end_time : '2014-12-16 14:08:49',
            events : true,
            sections : false,
            lastn : 0,
            lastnbyme : 0,
            default: false
        };
        
        $scope.facets = [{
            key: 'sys_display_name',
            data: [{
                label: 'gbh-ui-01'
            }, {
                label: 'random'
            }, {
                label: 'gbh-cass-dr'
            }]
        }];
        
        $scope.applyView(p_view);
        $scope.applyView(p_view);

        $scope.facets = [{
            key: 'sys_display_name',
            data: []
        }];
        $scope.selectedFacets = {};
        p_view.facetKeys['gbh-cass-dr'] = 'random';
        
        $scope.applyView(p_view);
        
        p_view = {
            facets : {
                relativetimefilter : ['last5']
            },
            facetKeys: {},
            search_text : '*',
            start_time : '2004-12-16 14:08:49',
            end_time : '2014-12-16 14:08:49',
            events : false,
            sections : true,
            lastn : 0,
            lastnbyme : 0,
            default: false
        };
        
        $scope.selectedFacets = {};
        
        $scope.applyView(p_view);
        
        p_view = {
            search_text : '*',
            start_time : '2004-12-16 14:08:49',
            end_time : '2014-12-16 14:08:49',
            events : false,
            sections : true,
            lastn : 0,
            lastnbyme : 0,
            default: false
        };
        
        $scope.selectedFacets = {};
        
        $scope.applyView(p_view);
        
        p_view = {
            search_text : '*',
            start_time : '2004-12-16 14:08:49',
            end_time : '2014-12-16 14:08:49',
            events : false,
            sections : false,
            lastn : 0,
            lastnbyme : 5,
            default: false
        };
        
        $scope.applyView(p_view);
	}));

	it('Should have parseView', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.parseView).toEqual(jasmine.any(Function));
		var view = {
		    facet_filters: ["`sys_display_name^gbh-ui-01`,`sys_display_name^gbh-cass-dr`"],
		    search_text: '*',
		    start_ts: '2004-12-16 14:08:49',
		    end_ts: '2014-12-16 14:08:49',
		    search_type: 'EVENT',
		    last_n_log: 0,
		    last_n_log_by_user: 0,
		    default: false
		};
		expect($scope.parseView(view)).toEqual({
			facets : {
				sys_display_name : ['gbh-ui-01', 'gbh-cass-dr']
			},
			facetKeys: {},
			search_text : '*',
			start_time : '2004-12-16 14:08:49',
			end_time : '2014-12-16 14:08:49',
			events : true,
			sections : false,
			lastn : 0,
			lastnbyme : 0,
            default: false
		});
		var view = {
            facet_filters: ["NA"],
            search_text: '*',
            start_ts: '2004-12-16 14:08:49',
            end_ts: '2014-12-16 14:08:49',
            search_type: 'EVENT',
            last_n_log: 0,
            last_n_log_by_user: 0,
            default: false
        };
		expect($scope.parseView(view)).toEqual({
			search_text : '*',
			start_time : '2004-12-16 14:08:49',
			end_time : '2014-12-16 14:08:49',
			events : true,
            sections : false,
            lastn : 0,
            lastnbyme : 0,
            default: false
		});
		var view = {
            facet_filters: ["`relativetimefilter^This week`"],
            search_text: '*',
            start_ts: '2004-12-16 14:08:49',
            end_ts: '2014-12-16 14:08:49',
            search_type: 'EVENT',
            last_n_log: 0,
            last_n_log_by_user: 0,
            default: false
        };
		expect($scope.parseView(view)).toEqual({
			facets : {
				relativetimefilter : ['This week']
			},
			facetKeys: {},
			search_text : '*',
			start_time : '2004-12-16 14:08:49',
			end_time : '2014-12-16 14:08:49',
			events : true,
            sections : false,
            lastn : 0,
            lastnbyme : 0,
            default: false
		});
		
		var view = {
            facet_filters: ["`events^gbh-ui-01^key`,`sys_display_name^gbh-cass-dr`"],
            search_text: '*',
            start_ts: '2004-12-16 14:08:49',
            end_ts: '2014-12-16 14:08:49',
            search_type: 'EVENT',
            last_n_log: 0,
            last_n_log_by_user: 0,
            default: false
        };
        expect($scope.parseView(view)).toEqual({
            facets : {
                sys_display_name : ['gbh-cass-dr'],
                events: ['gbh-ui-01']
            },
            facetKeys: {
                'gbh-ui-01': 'key'
            },
            search_text : '*',
            start_time : '2004-12-16 14:08:49',
            end_time : '2014-12-16 14:08:49',
            events : true,
            sections : false,
            lastn : 0,
            lastnbyme : 0,
            default: false
        });
	}));

	it('Should have showSaveFilterModal', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var ctrl = $controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.showSaveFilterModal).toEqual(jasmine.any(Function));
		$scope.savedFiltersList = {
			length: 50
		};
		$scope.showSaveFilterModal();
		var $scope = $rootScope.$new();
		var ctrl = $controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.showSaveFilterModal).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.customDateFilter = false;
		$scope.selectedFacets = {
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
				"disabled" : false
			}],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		$scope.showSaveFilterModal();
		expect($scope.saveModal.timeRange).toEqual($scope.dateRangeFilterName);
		expect($scope.saveModal.filtersString).toEqual('`relativetimefilter^' + $scope.dateRangeFilterName + '`,`sys_display_name^gbh-ui-01`,`sys_display_name^gbh-cass-dr`');
		$scope.customDateFilter = true;
		$scope.defaultFacet = {
		    label: 'def_facet'
		};
		$scope.showSaveFilterModal();
		expect($scope.saveModal.filtersString).toEqual('`sys_display_name^gbh-ui-01`,`sys_display_name^gbh-cass-dr`');
		$scope.selectedFacets = {
			"obs_url" : [],
			"sys_display_name" : [],
			"sys_hwaddr" : [],
			"namespace" : [],
			"obs_date_str" : [],
			"sys_timezone" : [],
			"apc_ipaddr" : [],
			"evt_date_str" : [],
			"events" : []
		};
		$scope.showSaveFilterModal();
		expect($scope.saveModal.filtersString).toEqual('');
	}));
	
	it('Should have deleteSavedFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.deleteSavedFilter).toEqual(jasmine.any(Function));
		var selectedFilter = {
		    view_name: 'unit test',
		    desc: 'NULL',
		    default: true
		};
		$scope.deleteSavedFilter(selectedFilter);
		expect($scope.deleteModal).toEqual({
			filter : {
				name : 'unit test',
				desc : 'NULL',
				isDefault : true
			},
			status : 'initiated',
			deleteOperationMsg : ''
		});
	}));
	
	it('Should have checkViewName', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getSavedFilters");
        expect($scope.checkViewName).toEqual(jasmine.any(Function));
        
        $scope.saveModal = {
            filterName: 'view1'
        };
        
        $scope.form = {
            saveViewModal: {
                viewName: {
                    $setValidity: function() {
                        
                    }
                }
            }
        };
        
        spyOn($scope.form.saveViewModal.viewName, "$setValidity");
        
        $scope.savedFiltersList = [{view_name: 'view1', currentUser: false}];
        
        $scope.checkViewName();
        
        expect($scope.getSavedFilters).not.toHaveBeenCalled();
        expect($scope.form.saveViewModal.viewName.$setValidity).toHaveBeenCalledWith('duplicate', false);
        
        $scope.savedFiltersList = [{}, {view_name: 'view1', currentUser: true}];
        
        $scope.checkViewName();
        
        expect($scope.getSavedFilters).not.toHaveBeenCalled();
        expect($scope.form.saveViewModal.viewName.$setValidity).toHaveBeenCalledWith('duplicate', false);
        
        $scope.savedFiltersList = [];
        
        $scope.checkViewName();
        
        expect($scope.getSavedFilters).toHaveBeenCalled();
    }));
	
	it('Should have saveFilter', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "callSaveViewAPI");
        expect($scope.saveFilter).toEqual(jasmine.any(Function));
        
        $scope.form = {
            saveViewModal: {
                $valid: false
            }
        };
        
        $scope.saveFilter();
        
        expect($scope.callSaveViewAPI).not.toHaveBeenCalled();
        
        $scope.form.saveViewModal.$valid = true;
        
        $scope.saveFilter();
        
        expect($scope.callSaveViewAPI).toHaveBeenCalled();
    }));
	
	it('Should have callSaveViewAPI section', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getFrom");
        spyOn($scope, "getTo");
        spyOn($scope, "getSavedFilters");
        
        expect($scope.callSaveViewAPI).toEqual(jasmine.any(Function));
        
        $scope.info.sections = true;
        
        $scope.info.quick = 5;
        
        $scope.saveModal = {
            searchQuery: '*',
            filtersString: '',
            filterName: 'view',
            desc: 'desc',
            access: 'public'
        };
        
        $scope.info.defaultFilterInfo = {};
        
        $scope.callSaveViewAPI();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/add/"+ manufacturer + '/' + product + '/' + schema + "/" + true + "/" + $scope.saveModal.filterName + "/" + false).respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Save View').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have callSaveViewAPI event', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getFrom");
        spyOn($scope, "getTo");
        spyOn($scope, "getSavedFilters");
        
        expect($scope.callSaveViewAPI).toEqual(jasmine.any(Function));
        
        $scope.info.events = true;
        
        $scope.info.quick = 1;
        
        $scope.saveModal = {
            searchQuery: '*',
            filtersString: '',
            filterName: 'view',
            desc: 'desc',
            access: 'private'
        };
        
        $scope.info.defaultFilterInfo = {view_name: 'view'};
        
        $scope.callSaveViewAPI();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/add/"+ manufacturer + '/' + product + '/' + schema + "/" + false + "/" + $scope.saveModal.filterName + "/" + true).respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Event/Save View').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have callSaveViewAPI error block', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getFrom");
        spyOn($scope, "getTo");
        spyOn($scope, "getSavedFilters");
        
        expect($scope.callSaveViewAPI).toEqual(jasmine.any(Function));
        
        $scope.saveModal = {
            searchQuery: '*',
            filtersString: '',
            filterName: 'view',
            desc: 'desc',
            access: 'public'
        };
        
        $scope.info.defaultFilterInfo = {};
        
        $scope.callSaveViewAPI();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/add/"+ manufacturer + '/' + product + '/' + schema + "/" + true + "/" + $scope.saveModal.filterName + "/" + false).respond(500, {});
        
        $httpBackend.flush();
    }));
	
	it('Should have hideModalPanel', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.hideModalPanel).toEqual(jasmine.any(Function));
        $scope.hideModalPanel();
    }));
	
	it('Should have getSavedFilters empty', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.getSavedFilters).toEqual(jasmine.any(Function));
        $scope.getSavedFilters();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + "/explorer/view/list/all/"+ manufacturer + '/' + product + '/' + schema).respond({Data: ''});
        
        $httpBackend.flush();
    }));
    
    it('Should have getSavedFilters error block', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.getSavedFilters).toEqual(jasmine.any(Function));
        $scope.getSavedFilters();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + "/explorer/view/list/all/"+ manufacturer + '/' + product + '/' + schema).respond(500, {});
        
        $httpBackend.flush();
    }));
	
	it('Should have getSavedFilters', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getLoggedInUserName").and.returnValue('user');
        expect($scope.getSavedFilters).toEqual(jasmine.any(Function));
        $scope.getSavedFilters(true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + "/explorer/view/list/all/"+ manufacturer + '/' + product + '/' + schema).respond({Data: [{search_type: 'SECTION', created_by: 'user'}, {search_type: 'EVENT', created_by: 'user1'}, {search_type: 'OUTOFBOX', created_by: 'user', default: true}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/List view').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have getSavedFilters track events', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getLoggedInUserName").and.returnValue('user');
        expect($scope.getSavedFilters).toEqual(jasmine.any(Function));
        
        $scope.info.events = true;
        
        $scope.getSavedFilters(true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + "/explorer/view/list/all/"+ manufacturer + '/' + product + '/' + schema).respond({Data: [{search_type: 'SECTION', created_by: 'user'}, {search_type: 'EVENT', created_by: 'user1'}, {search_type: 'OUTOFBOX', created_by: 'user', default: true}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Event/List view').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have getSavedFilters check view duplicate true', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getLoggedInUserName").and.returnValue('user');
        expect($scope.getSavedFilters).toEqual(jasmine.any(Function));
        
        $scope.saveModal = {
            filterName: 'view1'
        };
        
        $scope.form = {
            saveViewModal: {
                viewName: {
                    $setValidity: function() {
                        
                    }
                }
            }
        };
        
        spyOn($scope.form.saveViewModal.viewName, "$setValidity");
        
        $scope.getSavedFilters(true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + "/explorer/view/list/all/"+ manufacturer + '/' + product + '/' + schema).respond({Data: [{search_type: 'SECTION', view_name: 'view1', created_by: 'user'}, {search_type: 'EVENT', created_by: 'user1'}, {search_type: 'OUTOFBOX', created_by: 'user', default: true}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/List view').respond(200);
        
        $httpBackend.flush();
    }));
    
    it('Should have getSavedFilters check view duplicate false', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getLoggedInUserName").and.returnValue('user');
        expect($scope.getSavedFilters).toEqual(jasmine.any(Function));
        
        $scope.saveModal = {
            filterName: 'view1'
        };
        
        $scope.form = {
            saveViewModal: {
                viewName: {
                    $setValidity: function() {
                        
                    }
                }
            }
        };
        
        spyOn($scope.form.saveViewModal.viewName, "$setValidity");
        
        $scope.getSavedFilters(true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + "/explorer/view/list/all/"+ manufacturer + '/' + product + '/' + schema).respond({Data: [{search_type: 'SECTION', created_by: 'user'}, {search_type: 'EVENT', view_name: 'view1', created_by: 'user1'}, {search_type: 'OUTOFBOX', created_by: 'user', default: true}]});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/List view').respond(200);
        
        $httpBackend.flush();
    }));
	
	it('Should have changeFilterAccessibility set public', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getSavedFilters");
        expect($scope.changeFilterAccessibility).toEqual(jasmine.any(Function));
        $scope.changeFilterAccessibility({public: false, view_name: 'view1'});
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/setpublic/" + manufacturer + '/' + product + '/' + schema + '/' + true + '/' + 'view1').respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Set View Public').respond(200);
        
        $httpBackend.flush();

        expect($scope.getSavedFilters).toHaveBeenCalled();
    }));
    
    it('Should have changeFilterAccessibility set private', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getSavedFilters");
        expect($scope.changeFilterAccessibility).toEqual(jasmine.any(Function));
        
        $scope.info.events = true;
        
        $scope.changeFilterAccessibility({public: true, view_name: 'view1'});
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/setpublic/" + manufacturer + '/' + product + '/' + schema + '/' + false + '/' + 'view1').respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Event/Set View Private').respond(200);
        
        $httpBackend.flush();

        expect($scope.getSavedFilters).toHaveBeenCalled();
    }));
    
    it('Should have changeFilterAccessibility error block', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "getSavedFilters");
        expect($scope.changeFilterAccessibility).toEqual(jasmine.any(Function));
        $scope.changeFilterAccessibility({public: false, view_name: 'view1'});
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/setpublic/" + manufacturer + '/' + product + '/' + schema + '/' + true + '/' + 'view1').respond(500, {});
        
        $httpBackend.flush();

        expect($scope.getSavedFilters).not.toHaveBeenCalled();
    }));

	it('Should have changeDefaultFilter set default', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		// spyOn($scope, "loadView");
		spyOn($scope, "reset");
		spyOn($scope, "getSavedFilters");
		expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
		$scope.changeDefaultFilter({default: false, view_name: 'view1'});
		
		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + '/explorer/view/setdefault' + '/' + manufacturer + '/' + product + '/' + schema + '/' + 'view1').respond({});
		$httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Set Default View').respond(200);
		
		$httpBackend.flush();
		
		// expect($scope.loadView).toHaveBeenCalled();
		expect($scope.reset).not.toHaveBeenCalled();
		expect($scope.getSavedFilters).toHaveBeenCalled();
	}));
	
	it('Should have changeDefaultFilter reset default', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadView");
        spyOn($scope, "reset");
        spyOn($scope, "getSavedFilters");
        expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
        
        $scope.info.events = true;
        
        $scope.changeDefaultFilter({default: true, view_name: 'view1'});
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + '/explorer/view/resetdefault' + '/' + manufacturer + '/' + product + '/' + schema + '/' + 'view1').respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Event/Reset Default View').respond(200);
        
        $httpBackend.flush();
        
        expect($scope.loadView).not.toHaveBeenCalled();
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.getSavedFilters).toHaveBeenCalled();
    }));
    
    it('Should have changeDefaultFilter reset default applied view', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadView");
        // spyOn($scope, "reset");
        spyOn($scope, "getSavedFilters");
        expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
        
        $scope.info.events = true;
        $scope.info.selectedFilterName = 'view1';
        
        $scope.changeDefaultFilter({default: true, view_name: 'view1'});
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + '/explorer/view/resetdefault' + '/' + manufacturer + '/' + product + '/' + schema + '/' + 'view1').respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Event/Reset Default View').respond(200);
        
        $httpBackend.flush();
        
        expect($scope.loadView).not.toHaveBeenCalled();
        // expect($scope.reset).toHaveBeenCalled();
        expect($scope.getSavedFilters).toHaveBeenCalled();
    }));
    
    it('Should have changeDefaultFilter set default error block', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadView");
        spyOn($scope, "reset");
        spyOn($scope, "getSavedFilters");
        expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
        $scope.changeDefaultFilter({default: false, view_name: 'view1'});
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + '/explorer/view/setdefault' + '/' + manufacturer + '/' + product + '/' + schema + '/' + 'view1').respond(500, {});
        
        $httpBackend.flush();
        
        expect($scope.loadView).not.toHaveBeenCalled();
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.getSavedFilters).not.toHaveBeenCalled();
    }));
    
    it('Should have changeDefaultFilter set default out of box', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadLogsByMe");
        spyOn($scope, "reset");
        spyOn($scope, "getSavedFilters");
        expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
        $scope.info.fromDate = new Date("24 Jun 1997");
        $scope.info.toDate = new Date("24 Jun 1997");
        $scope.changeDefaultFilter(1, true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/add/"+ manufacturer + '/' + product + '/' + schema + "/" + false + "/" + "last_1_by_undefined" + "/" + false).respond({});
        $httpBackend.expect('POST', infoserverDomain + '/explorer/view/setdefault' + '/' + manufacturer + '/' + product + '/' + schema + '/' + 'last_1_by_undefined').respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Set Default View').respond(200);
        
        $httpBackend.flush();
        
        expect($scope.loadLogsByMe).toHaveBeenCalled();
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.getSavedFilters).toHaveBeenCalled();
    }));
    
    it('Should have changeDefaultFilter set default out of box error block', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadLogsByMe");
        spyOn($scope, "reset");
        spyOn($scope, "getSavedFilters");
        expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
        $scope.info.fromDate = new Date("24 Jun 1997");
        $scope.info.toDate = new Date("24 Jun 1997");
        $scope.changeDefaultFilter(1, true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/add/"+ manufacturer + '/' + product + '/' + schema + "/" + false + "/" + "last_1_by_undefined" + "/" + false).respond({});
        $httpBackend.expect('POST', infoserverDomain + '/explorer/view/setdefault' + '/' + manufacturer + '/' + product + '/' + schema + '/' + 'last_1_by_undefined').respond(500, {});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Set Default View').respond(200);
        
        $httpBackend.flush();
        
        expect($scope.loadLogsByMe).toHaveBeenCalled();
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.getSavedFilters).not.toHaveBeenCalled();
    }));
    
    it('Should have changeDefaultFilter reset default out of box', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadLogsByMe");
        spyOn($scope, "reset");
        spyOn($scope, "getSavedFilters");
        expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
        
        $scope.allFilterList = [{view_name: 'last_1_by_undefined', default: true}];
        $scope.info.fromDate = new Date("24 Jun 1997");
        $scope.info.toDate = new Date("24 Jun 1997");
        $scope.changeDefaultFilter(1, true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/add/"+ manufacturer + '/' + product + '/' + schema + "/" + false + "/" + "last_1_by_undefined" + "/" + false).respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Reset Default View').respond(200);
        
        $httpBackend.flush();
        
        expect($scope.loadLogsByMe).not.toHaveBeenCalled();
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.getSavedFilters).toHaveBeenCalled();
    }));
    
    it('Should have changeDefaultFilter reset default out of box applied view', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadLogsByMe");
        spyOn($scope, "reset");
        spyOn($scope, "getSavedFilters");
        expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
        
        $scope.allFilterList = [{view_name: 'last_1_by_undefined', default: true}];
        $scope.info.selectedFilterName = $scope.getValue('last' + 1 + 'byme');
        $scope.info.fromDate = new Date("24 Jun 1997");
        $scope.info.toDate = new Date("24 Jun 1997");
        $scope.changeDefaultFilter(1, true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/add/"+ manufacturer + '/' + product + '/' + schema + "/" + false + "/" + "last_1_by_undefined" + "/" + false).respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Reset Default View').respond(200);
        
        $httpBackend.flush();
        
        expect($scope.loadLogsByMe).not.toHaveBeenCalled();
        expect($scope.reset).toHaveBeenCalled();
        expect($scope.getSavedFilters).toHaveBeenCalled();
    }));
    
    it('Should have changeDefaultFilter reset default out of box error block', inject(function($rootScope, $controller, infoserverDomain, $httpBackend) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        spyOn($scope, "loadLogsByMe");
        spyOn($scope, "reset");
        spyOn($scope, "getSavedFilters");
        expect($scope.changeDefaultFilter).toEqual(jasmine.any(Function));
        
        $scope.allFilterList = [{view_name: 'last_1_by_undefined', default: true}];
        $scope.info.fromDate = new Date("24 Jun 1997");
        $scope.info.toDate = new Date("24 Jun 1997");
        $scope.changeDefaultFilter(1, true);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/add/"+ manufacturer + '/' + product + '/' + schema + "/" + false + "/" + "last_1_by_undefined" + "/" + false).respond(500, {});
        
        $httpBackend.flush();
        
        expect($scope.loadLogsByMe).not.toHaveBeenCalled();
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.getSavedFilters).not.toHaveBeenCalled();
    }));

	it('Should have changeQuickFilter', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));

		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('lasthour');
		expect($scope.dateRangeFilterName).toEqual('Last hour');
		// expect($scope.info.fromDate).toEqual(new Date($scope.info.toDate.setHours($scope.info.toDate.getHours() - 1)));
		// expect($scope.info.toDate).toEqual($scope.info.toDate);
		expect($scope.refresh).toHaveBeenCalled();

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('today');
		expect($scope.dateRangeFilterName).toEqual('Today');
		var fromdate = $scope.info.toDate;
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);
		// expect($scope.info.fromDate).toEqual(fromdate);
		// expect($scope.info.toDate).toEqual($scope.info.toDate);
		expect($scope.refresh).toHaveBeenCalled();

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('yesterday');
		expect($scope.dateRangeFilterName).toEqual('Yesterday');
		fromdate = new Date();
		fromdate.setDate(fromdate.getDate() - 1);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);
		var todate = new Date();
		todate.setDate(todate.getDate() - 1);
		todate.setHours(23);
		todate.setMinutes(59);
		todate.setSeconds(59);
		// expect($scope.info.fromDate).toEqual(fromdate);
		// expect($scope.info.toDate).toEqual(todate);
		expect($scope.refresh).toHaveBeenCalled();

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('thisweek');
		expect($scope.dateRangeFilterName).toEqual('This week');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(fromdate.getDate() - fromdate.getDay() + 1);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);
		// expect($scope.info.fromDate).toEqual(fromdate);
		// expect($scope.info.toDate).toEqual($scope.info.toDate);
		expect($scope.refresh).toHaveBeenCalled();

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('thismonth');
		expect($scope.dateRangeFilterName).toEqual('This month');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(1);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);
		// expect($scope.info.fromDate).toEqual(fromdate);
		// expect($scope.info.toDate).toEqual($scope.info.toDate);
		expect($scope.refresh).toHaveBeenCalled();

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('last2days');
		expect($scope.dateRangeFilterName).toEqual('Last 2 days');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(fromdate.getDate() - 2);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);
		// expect($scope.info.fromDate).toEqual(fromdate);
		// expect($scope.info.toDate).toEqual($scope.info.toDate);
		expect($scope.refresh).toHaveBeenCalled();

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('last7days');
		expect($scope.dateRangeFilterName).toEqual('Last 7 days');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(fromdate.getDate() - 7);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);
		// expect($scope.info.fromDate).toEqual(fromdate);
		// expect($scope.info.toDate).toEqual($scope.info.toDate);
		expect($scope.refresh).toHaveBeenCalled();

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = $scope.info.fromDate;
		spyOn($scope, "refresh");
		$scope.changeQuickFilter('last30days');
		expect($scope.dateRangeFilterName).toEqual('Last 30 days');
		fromdate = $scope.info.fromDate;
		fromdate.setDate(fromdate.getDate() - 30);
		fromdate.setHours(0);
		fromdate.setMinutes(0);
		fromdate.setSeconds(0);
		// expect($scope.info.fromDate).toEqual(fromdate);
		// expect($scope.info.toDate).toEqual($scope.info.toDate);
		expect($scope.refresh).toHaveBeenCalled();

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		spyOn($scope, "refresh");
		$scope.info = {
			config: {
				DEFAULT_DAYS: 300
			},
			page: {
				current: 2
			},
			fromDate: new Date(),
			toDate: new Date(),
			fromTime: {},
			toTime: {}
		};
		$scope.changeQuickFilter('mostrecent');
		expect($scope.dateRangeFilterName).toEqual('Most recent log');
		expect($scope.info.quick).toEqual(1);
		expect($scope.info.uploadedBy).toBeNull();
		expect($scope.refresh).toHaveBeenCalled();
		
		$scope.info.config.DEFAULT_DAYS = 0;
		$scope.changeQuickFilter('mostrecent');

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		spyOn($scope, "refresh");
		$scope.info = {
			config: {
				DEFAULT_DAYS: 300
			},
			page: {
				current: 2
			},
			fromDate: new Date(),
			toDate: new Date(),
			fromTime: {},
			toTime: {}
		};
		$scope.changeQuickFilter('last5');
		expect($scope.dateRangeFilterName).toEqual('Last 5 logs');
		expect($scope.info.quick).toEqual(5);
		expect($scope.info.uploadedBy).toBeNull();
		expect($scope.refresh).toHaveBeenCalled();
		
		$scope.info.config.DEFAULT_DAYS = 0;
        $scope.changeQuickFilter('last5');

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		spyOn($scope, "refresh");
		$scope.info = {
			config: {
				DEFAULT_DAYS: 300
			},
			page: {
				current: 2
			},
			fromDate: new Date(),
			toDate: new Date(),
			fromTime: {},
			toTime: {}
		};
		$scope.changeQuickFilter('last10');
		expect($scope.dateRangeFilterName).toEqual('Last 10 logs');
		expect($scope.info.quick).toEqual(10);
		expect($scope.info.uploadedBy).toBeNull();
		expect($scope.refresh).toHaveBeenCalled();
		
		$scope.info.config.DEFAULT_DAYS = 0;
        $scope.changeQuickFilter('last10');

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		$scope.changeQuickFilter('last50');
		expect($scope.dateRangeFilterName).toEqual('Custom Date Range');

		$scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.changeQuickFilter).toEqual(jasmine.any(Function));
		// spyOn($scope, "refresh");
		$scope.changeQuickFilter('customdate');
		expect($scope.customDateFilter).toBeTruthy();
		expect($scope.info.quick).toEqual(0);
		expect($scope.info.uploadedBy).toBeNull();
		// expect($scope.refresh).toHaveBeenCalled();
	}));

	it('Should have getValue', inject(function($rootScope, $controller, GlobalService) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.getValue).toEqual(jasmine.any(Function));
		expect($scope.getValue('char_limit_msg')).toEqual(GlobalService.getVal('char_limit_msg'));
	}));

	it('Should have hideModal', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.hideModal).toEqual(jasmine.any(Function));
		$scope.modal = {
			close: function() {
				
			}
		};
		spyOn($scope.modal, "close");
		$scope.hideModal();
	}));

	it('Should have zoomout', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.zoomout).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		spyOn($scope, "setFromTo");
		$scope.info.filterSuggest = {
		    startsWith: function() {
		        
		    }
		};
		spyOn($scope.info.filterSuggest, "startsWith");
		$scope.zoomout();
		expect($scope.info.fromDate).toEqual(new Date($scope.info.fromDate.setFullYear($scope.info.fromDate.getFullYear() - 10)));
		expect($scope.setFromTo).toHaveBeenCalled();
		$scope.info.default_days = 100;
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.filterSuggest = {
            startsWith: function() {
                
            }
        };
        spyOn($scope.info.filterSuggest, "startsWith");
		$scope.zoomout();
		expect($scope.info.fromDate).toEqual(new Date($scope.info.fromDate.setDate($scope.info.fromDate.getDate() - 100)));
		expect($scope.setFromTo).toHaveBeenCalled();
		$scope.defaultFacet = {};
		$scope.info.bundleToDate = new Date();
		$scope.zoomout();
	}));

	it('Should have deleteFilterRequest', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		
		spyOn($scope, "getSavedFilters");
		spyOn($scope, "resetFromUI");
		
		expect($scope.deleteFilterRequest).toEqual(jasmine.any(Function));
		$scope.deleteModal = {
		    filter: {
		        name: 'filter'
		    }
		};
		var filterName = 'filter';
		$scope.deleteFilterRequest(filterName);
		
		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('POST', infoserverDomain + "/explorer/view/delete/"+ manufacturer + '/' + product + '/' + schema + '/' + filterName).respond({});
		$httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Section/Delete View').respond(200);
		
		$httpBackend.flush();
		
		expect($scope.getSavedFilters).toHaveBeenCalled();
		expect($scope.resetFromUI).not.toHaveBeenCalled();
	}));
	
	it('Should have deleteFilterRequest if blocks', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getSavedFilters");
        spyOn($scope, "resetFromUI");
        
        expect($scope.deleteFilterRequest).toEqual(jasmine.any(Function));
        $scope.deleteModal = {
            filter: {
                name: 'filter',
                isDefault: true
            }
        };
        var filterName = 'filter';
        $scope.info.events = true
        $scope.info.selectedFilterName = filterName;
        $scope.deleteFilterRequest(filterName);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/delete/"+ manufacturer + '/' + product + '/' + schema + '/' + filterName).respond({});
        $httpBackend.expect('POST', umsDomain + '/user_tracking/' + manufacturer + '/' + product + '/' + schema + '/Explorer/Event/Delete View').respond(200);
        
        $httpBackend.flush();
        
        expect($scope.getSavedFilters).toHaveBeenCalled();
        expect($scope.resetFromUI).toHaveBeenCalled();
    }));
    
    it('Should have deleteFilterRequest error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "getSavedFilters");
        spyOn($scope, "resetFromUI");
        
        expect($scope.deleteFilterRequest).toEqual(jasmine.any(Function));
        $scope.deleteModal = {
            filter: {
                name: 'filter'
            }
        };
        var filterName = 'filter';
        $scope.deleteFilterRequest(filterName);
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('POST', infoserverDomain + "/explorer/view/delete/"+ manufacturer + '/' + product + '/' + schema + '/' + filterName).respond(500, {});
        
        $httpBackend.flush();
        
        expect($scope.getSavedFilters).not.toHaveBeenCalled();
        expect($scope.resetFromUI).not.toHaveBeenCalled();
    }));

	it('Should have loadDefaultFilter empty', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		
		spyOn($scope, "reset");
		
		expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
		$scope.loadDefaultFilter();
		
		$httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
		$httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: ''});
		
		$httpBackend.flush();
		
		expect($scope.reset).toHaveBeenCalled();
	}));
	
	it('Should have loadDefaultFilter object', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        
        $httpBackend.flush();
        expect($scope.loadView).toHaveBeenCalledWith({});
    }));
    
    it('Should have loadDefaultFilter else', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: undefined});
        
        $httpBackend.flush();
        
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.loadView).not.toHaveBeenCalled();
    }));
    
    it('Should have loadDefaultFilter dashboard custom view', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        $scope.sectionsContent = {
            seclog: {
                nsType: 'EVENT'
            }
        };
        
        spyOn(ExplorerService, "getLoadView").and.returnValue({
            type: 'custom',
            view: {
                facet_filters: {
                    namespace: ['seclog'],
                    facet1: ['val1', 'val2']
                }
            }
        });
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: ''});
        
        $httpBackend.flush();
    }));
    
    it('Should have loadDefaultFilter dashboard saved view found', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn(ExplorerService, "getLoadView").and.returnValue({
            type: 'savedView',
            view: 'view1'
        });
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/list/all/' + manufacturer + '/' +  product + '/' + schema).respond({Data: [{view_name: 'view1'}]});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        
        $httpBackend.flush();
    }));
    
    it('Should have loadDefaultFilter dashboard saved view not found', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService, ModalService) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn(ExplorerService, "getLoadView").and.returnValue({
            type: 'savedView',
            view: 'view1'
        });
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/list/all/' + manufacturer + '/' +  product + '/' + schema).respond({Data: undefined});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        
        spyOn($scope, "loadDefaultFilter");
        
        $httpBackend.flush();
    }));
    
    it('Should have loadDefaultFilter dashboard saved view not found else', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService, ModalService) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });    
        
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        
        $httpBackend.flush();
        
        spyOn(ExplorerService, "getLoadView").and.returnValue({
            type: 'savedView',
            view: 'view1'
        });
        
        $scope.loadDefaultFilter();

        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/list/all/' + manufacturer + '/' +  product + '/' + schema).respond({Data: undefined});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        
        spyOn($scope, "loadDefaultFilter");
        
        $httpBackend.flush();
    }));
    
    it('Should have loadDefaultFilter dashboard saved view error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService, ModalService) {
        spyOn(ModalService, "alertBox");
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn(ExplorerService, "getLoadView").and.returnValue({
            type: 'savedView',
            view: 'view1'
        });
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/list/all/' + manufacturer + '/' +  product + '/' + schema).respond(500);
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        
        $httpBackend.flush();
    }));
    
    it('Should have loadDefaultFilter dashboard view undefined', inject(function($rootScope, $controller, $httpBackend, infoserverDomain, ExplorerService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn(ExplorerService, "getLoadView").and.returnValue({
            type: 'undefined',
            view: 'view1'
        });
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond({Data: {}});
        
        $httpBackend.flush();
    }));
    
    it('Should have loadDefaultFilter error block', inject(function($rootScope, $controller, $httpBackend, infoserverDomain) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "reset");
        spyOn($scope, "loadView");
        
        expect($scope.loadDefaultFilter).toEqual(jasmine.any(Function));
        $scope.loadDefaultFilter();
        
        $httpBackend.expect('GET', infoserverDomain + '/uimeta/config/' + manufacturer + '/' +  product + '/' + schema).respond(500, {});
        $httpBackend.expect('GET', infoserverDomain + '/explorer/view/getdefault/' + manufacturer + '/' + product + '/' + schema).respond(500, {});
        
        $httpBackend.flush();
        
        expect($scope.reset).not.toHaveBeenCalled();
        expect($scope.loadView).not.toHaveBeenCalled();
    }));

	it('Should have getFilterScope', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.getFilterScope).toEqual(jasmine.any(Function));
		$scope.info.filterBtn = 'all';
		var filter = {
            currentUser: true,
            public: false
        };
        expect($scope.getFilterScope(filter)).toBeTruthy();
        filter = {
            currentUser: true,
            public: true
        };
        expect($scope.getFilterScope(filter)).toBeTruthy();
        filter = {
            currentUser: false,
            public: false
        };
        expect($scope.getFilterScope(filter)).toBeFalsy();
        filter = {
            currentUser: false,
            public: true
        };
        expect($scope.getFilterScope(filter)).toBeTruthy();
        
        $scope.info.filterBtn = 'my';
        filter = {
            currentUser: true,
            public: false
        };
        expect($scope.getFilterScope(filter)).toBeTruthy();
        filter = {
            currentUser: true,
            public: true
        };
        expect($scope.getFilterScope(filter)).toBeTruthy();
        filter = {
            currentUser: false,
            public: false
        };
        expect($scope.getFilterScope(filter)).toBeFalsy();
        filter = {
            currentUser: false,
            public: true
        };
        expect($scope.getFilterScope(filter)).toBeFalsy();
        
        $scope.info.filterBtn = 'other';
        expect($scope.getFilterScope(filter)).toEqual($scope.getFilterOtherScope(filter));
	}));

	it('Should have getFilterOtherScope', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.getFilterOtherScope).toEqual(jasmine.any(Function));
		var filter = {
		    currentUser: true,
		    public: false
		};
		expect($scope.getFilterOtherScope(filter)).toBeFalsy();
		filter = {
            currentUser: true,
            public: true
        };
        expect($scope.getFilterOtherScope(filter)).toBeFalsy();
        filter = {
            currentUser: false,
            public: false
        };
        expect($scope.getFilterOtherScope(filter)).toBeFalsy();
        filter = {
            currentUser: false,
            public: true
        };
        expect($scope.getFilterOtherScope(filter)).toBeTruthy();
	}));

	// it('Should have openFacetChart', inject(function($rootScope, $controller) {
		// var $scope = $rootScope.$new();
		// $controller('ExplorerCtrl', {
			// '$scope' : $scope
		// });
		// expect($scope.openFacetChart).toEqual(jasmine.any(Function));
		// var facet = {};
		// facet.f_data = [{
			// "title" : "Host Name",
			// "label" : "gbh-ui-01",
			// "value" : 24454,
			// "selected" : false
		// }, {
			// "title" : "Host Name",
			// "label" : "gbh-cass-dr",
			// "value" : 4250,
			// "selected" : false
		// }, {
			// "title" : "Host Name",
			// "label" : "gbh-solr-01",
			// "value" : 904,
			// "selected" : false
		// }];
		// $scope.openFacetChart(facet.f_data);
		// expect($scope.info.facetCharts).toEqual([{
			// cData : [{
				// title : 'Host Name',
				// label : 'gbh-ui-01',
				// value : 24454,
				// selected : false
			// }, {
				// title : 'Host Name',
				// label : 'gbh-cass-dr',
				// value : 4250,
				// selected : false
			// }, {
				// title : 'Host Name',
				// label : 'gbh-solr-01',
				// value : 904,
				// selected : false
			// }],
			// cType : 'bar2d',
			// facetChartMax : false,
			// exportImage : 0,
			// exportPdf : 0,
			// facetLabel : '',
			// dateRange : 'Time Range: 01-Jan-1970 TO 01-Jan-1970'
		// }]);
	// }));

	// it('Should have closeFacetChart', inject(function($rootScope, $controller) {
		// var $scope = $rootScope.$new();
		// $controller('ExplorerCtrl', {
			// '$scope' : $scope
		// });
		// expect($scope.closeFacetChart).toEqual(jasmine.any(Function));
		// $scope.info.facetCharts = [{
			// "cData" : [{
				// "title" : "Host Name",
				// "label" : "gbh-ui-01",
				// "value" : 24454,
				// "selected" : false
			// }, {
				// "title" : "Host Name",
				// "label" : "gbh-cass-dr",
				// "value" : 4250,
				// "selected" : false
			// }, {
				// "title" : "Host Name",
				// "label" : "gbh-solr-01",
				// "value" : 904,
				// "selected" : false
			// }],
			// "cType" : "bar2d",
			// "facetChartMax" : false,
			// "exportImage" : 0,
			// "exportPdf" : 0,
			// "facetLabel" : "",
			// "dateRange" : "Time Range: 26-Dec-2004 TO 26-Dec-2014"
		// }, {
			// "cData" : [{
				// "title" : "Apache Access Log IP",
				// "label" : "172.31.42.3",
				// "value" : 5751,
				// "selected" : false
			// }, {
				// "title" : "Apache Access Log IP",
				// "label" : "172.31.42.29",
				// "value" : 120,
				// "selected" : false
			// }, {
				// "title" : "Apache Access Log IP",
				// "label" : "127.0.0.1",
				// "value" : 4,
				// "selected" : false
			// }],
			// "cType" : "bar2d",
			// "facetChartMax" : false,
			// "exportImage" : 0,
			// "exportPdf" : 0,
			// "facetLabel" : "",
			// "dateRange" : "Time Range: 26-Dec-2004 TO 26-Dec-2014"
		// }];
		// var modal = {
			// "cData" : [{
				// "title" : "Host Name",
				// "label" : "gbh-ui-01",
				// "value" : 24454,
				// "selected" : false
			// }, {
				// "title" : "Host Name",
				// "label" : "gbh-cass-dr",
				// "value" : 4250,
				// "selected" : false
			// }, {
				// "title" : "Host Name",
				// "label" : "gbh-solr-01",
				// "value" : 904,
				// "selected" : false
			// }],
			// "cType" : "bar2d",
			// "facetChartMax" : false,
			// "exportImage" : 0,
			// "exportPdf" : 0,
			// "facetLabel" : "",
			// "dateRange" : "Time Range: 26-Dec-2004 TO 26-Dec-2014"
		// };
		// $scope.closeFacetChart(modal);
		// expect($scope.info.facetCharts).toEqual([{
			// cData : [{
				// title : 'Host Name',
				// label : 'gbh-ui-01',
				// value : 24454,
				// selected : false
			// }, {
				// title : 'Host Name',
				// label : 'gbh-cass-dr',
				// value : 4250,
				// selected : false
			// }, {
				// title : 'Host Name',
				// label : 'gbh-solr-01',
				// value : 904,
				// selected : false
			// }],
			// cType : 'bar2d',
			// facetChartMax : false,
			// exportImage : 0,
			// exportPdf : 0,
			// facetLabel : '',
			// dateRange : 'Time Range: 26-Dec-2004 TO 26-Dec-2014'
		// }]);
	// }));

	// it('Should have exportAsImage', inject(function($rootScope, $controller) {
		// var $scope = $rootScope.$new();
		// $controller('ExplorerCtrl', {
			// '$scope' : $scope
		// });
		// expect($scope.exportAsImage).toEqual(jasmine.any(Function));
		// var modal = {
			// exportImage : 4
		// };
		// $scope.exportAsImage(modal);
		// expect(modal.exportImage).toEqual(5);
	// }));
// 
	// it('Should have exportAsPDF', inject(function($rootScope, $controller) {
		// var $scope = $rootScope.$new();
		// $controller('ExplorerCtrl', {
			// '$scope' : $scope
		// });
		// expect($scope.exportAsPDF).toEqual(jasmine.any(Function));
		// var modal = {
			// exportPdf : 4
		// };
		// $scope.exportAsPDF(modal);
		// expect(modal.exportPdf).toEqual(5);
	// }));
// 
	// it('Should have facetSubCaptionDateFormat', inject(function($rootScope, $controller) {
		// var $scope = $rootScope.$new();
		// $controller('ExplorerCtrl', {
			// '$scope' : $scope
		// });
		// expect($scope.facetSubCaptionDateFormat).toEqual(jasmine.any(Function));
		// var value = "Fri Dec 19 2014 15:59:25 GMT+0530 (India Standard Time)";
		// expect($scope.facetSubCaptionDateFormat(value)).toEqual("19-Dec-2014");
		// var value = "Fri Dec 05 2014 15:59:25 GMT+0530 (India Standard Time)";
		// expect($scope.facetSubCaptionDateFormat(value)).toEqual("05-Dec-2014");
	// }));

	it('Should have getLoggedInUserName', inject(function($rootScope, $controller, metaDataService) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.getLoggedInUserName).toEqual(jasmine.any(Function));
		expect($scope.getLoggedInUserName()).toEqual(metaDataService.getUser['email']);
	}));
	
	it('Should have getSearchKey', inject(function($rootScope, $controller, metaDataService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.getSearchKey).toEqual(jasmine.any(Function));
        var str = 'abcd';
        expect($scope.getSearchKey(str)).toEqual('abcd');
        
        str = 'abcd and xyz';
        expect($scope.getSearchKey(str)).toEqual('xyz');
    }));
    
    it('Should have getSearchKeyIndex', inject(function($rootScope, $controller, metaDataService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.getSearchKeyIndex).toEqual(jasmine.any(Function));
        var str = 'abcd';
        expect($scope.getSearchKeyIndex(str)).toEqual(-1);
        
        str = 'abcd and xyz';
        expect($scope.getSearchKeyIndex(str)).toEqual(8);
    }));
    
    it('Should have showAutoSuggestDD', inject(function($rootScope, $controller, metaDataService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.showAutoSuggestDD).toEqual(jasmine.any(Function));
        $scope.showAutoSuggestDD();
    }));
    
    it('Should have getMostRecentQueries', inject(function($rootScope, $controller, metaDataService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.getMostRecentQueries).toEqual(jasmine.any(Function));
        
        $scope.info.filterSuggestItem = 'a';
        
        $scope.info.savedFilters = ['view1', 'view2', 'ashwin'];
        
        expect($scope.getMostRecentQueries()).toEqual(['ashwin']);
    }));

	it('Should have updateMatchingAttr', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		spyOn($scope, "logMatching");
		expect($scope.updateMatchingAttr).toEqual(jasmine.any(Function));
		$scope.info.filterSuggestSelectedSection = {
		    namespace_desc: 'desc'
		};
		var suggest = {
			namespace_desc : "FileSystem Disk Space Usage",
			namespace : "lin.df",
			dataType : "INTEGER",
			referenceNSName : null,
			attribute_label : "Df  Avail"
		};
		$scope.info.filterSuggestLatest = "d";
		$scope.updateMatchingAttr(suggest);
		expect($scope.info.filterSuggest).toEqual(".Df  Avail'");
		
		suggest.dataType = 'none';
		$scope.updateMatchingAttr(suggest);
		expect($scope.info.filterSuggest).toEqual(".Df  Avail'");
		
		var suggest = {
			namespace_desc : "Linux Free Command",
			namespace : "lin.freecmd",
			dataType : "INTEGER",
			referenceNSName : null,
			attribute_label : "Memory used by buffers"
		};
		$scope.info.filterSuggestLatest = "{Linux Free Command}";
		$scope.updateMatchingAttr(suggest);
		expect($scope.info.filterSuggest).toEqual("{Linux Free Command}");
		
		var suggest = {
            namespace_desc : "Linux Free Command",
            namespace : "lin.freecmd",
            dataType : "INTEGER",
            referenceNSName : null,
            attribute_label : "Memory used by buffers"
        };
        $scope.info.filterSuggestLatest = "{Linux Free Command}.memo";
        $scope.updateMatchingAttr(suggest);
        expect($scope.info.filterSuggest).toEqual("{Linux Free Command}.Memory used by buffers'");

	}));
	
	it('Should have checkDateRange', inject(function($rootScope, $controller, metaDataService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setCookiesFrMostRecentSearch");
        expect($scope.checkDateRange).toEqual(jasmine.any(Function));
        
        $scope.info.filterSuggest = "CompoundSearch=";
        $scope.info.sections = true;
        
        $scope.checkDateRange();
        
        $scope.info.filterSuggest = "*";
        $scope.info.fromDate = new Date();
        $scope.info.toDate = new Date();
        
        $scope.checkDateRange();
        
        var oneDay = 24 * 60 * 60 * 1000;
        
        $scope.info.fromDate = new Date($scope.info.fromDate.getTime() - (4*oneDay));
        $scope.info.max_days_allowed = 1;
        $scope.checkDateRange();
        
        $scope.info.toDate = new Date($scope.info.toDate.getTime() - (3*oneDay));
        $scope.checkDateRange();
    }));
	
	it('Should have confirmDateRangeSelect', inject(function($rootScope, $controller, metaDataService) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        
        spyOn($scope, "setCookiesFrMostRecentSearch");
        expect($scope.confirmDateRangeSelect).toEqual(jasmine.any(Function));
        
        $scope.info.toDate = new Date();
        $scope.confirmDateRangeSelect();
    }));

	it('Should have setCookiesFrMostRecentSearch', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		var $cookies = {};
		$controller('ExplorerCtrl', {
			'$scope' : $scope,
			'$cookies': $cookies
		});
		expect($scope.setCookiesFrMostRecentSearch).toEqual(jasmine.any(Function));
		$scope.info.fromDate = new Date();
		$scope.info.toDate = new Date();
		$scope.info.filterSuggest = "*";
		spyOn($scope, "refresh");
		$scope.setCookiesFrMostRecentSearch();
		expect($cookies.savedFilters).toEqual('*');
		expect($scope.refresh).toHaveBeenCalled();
		$cookies.savedFilters = "unittesting";
		$scope.setCookiesFrMostRecentSearch();
		expect($cookies.savedFilters).toEqual('unittesting');
		expect($scope.refresh).toHaveBeenCalled();
		$scope.info.filterSuggest = "";
		$scope.setCookiesFrMostRecentSearch();
		expect($scope.refresh).toHaveBeenCalled();
		$scope.customDateFilter = true;
		$scope.setCookiesFrMostRecentSearch();
		spyOn($scope, "isDuplicateMostRecentSearch").and.returnValue(false);
		$cookies.savedFilters = "unittesting";
		$scope.info.filterSuggest = "abcd";
		$scope.setCookiesFrMostRecentSearch();
	}));

	it('Should have isDuplicateMostRecentSearch', inject(function($rootScope, $controller) {
		var $scope = $rootScope.$new();
		$controller('ExplorerCtrl', {
			'$scope' : $scope
		});
		expect($scope.isDuplicateMostRecentSearch).toEqual(jasmine.any(Function));
		$scope.info.savedFilters = ['abc', 'def', 'xyz'];
		expect($scope.isDuplicateMostRecentSearch('pqr')).toBeFalsy();
	}));
	
	it('Should have logShowTime', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.logShowTime).toEqual(jasmine.any(Function));
        
        $scope.info.showOTime = true;
        
        $scope.logShowTime();
        
        $scope.info.events = true;
        $scope.info.showOTime = false;
        
        $scope.logShowTime();
    }));
    
    it('Should have logExportEvents', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.logExportEvents).toEqual(jasmine.any(Function));
        
        $scope.logExportEvents(true);
        
        $scope.info.events = true;
        $scope.logExportEvents(false);
    }));
    
    it('Should have logStatistics', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.logExportEvents).toEqual(jasmine.any(Function));
        
        $scope.logStatistics();
        
        $scope.info.events = true;
        $scope.logStatistics();
    }));
    
    it('Should have logShowMoreLess', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.logShowMoreLess).toEqual(jasmine.any(Function));
        
        $scope.logShowMoreLess(true);
        
        $scope.info.events = true;
        $scope.logShowMoreLess(false);
    }));
    
    it('Should have logToggleTimeline', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.logToggleTimeline).toEqual(jasmine.any(Function));
        
        $scope.logToggleTimeline(true);
        
        $scope.info.events = true;
        $scope.logToggleTimeline(false);
    }));
    
    it('Should have logAutoOpen', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.logAutoOpen).toEqual(jasmine.any(Function));
        
        $scope.logAutoOpen(true);
        
        $scope.info.events = true;
        $scope.logAutoOpen(false);
    }));
    
    it('Should have logMatching', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('ExplorerCtrl', {
            '$scope' : $scope
        });
        expect($scope.logMatching).toEqual(jasmine.any(Function));
        
        $scope.logMatching('activity', 'detail');
        
        $scope.info.events = true;
        $scope.logMatching('activity', 'detail');
    }));
});
