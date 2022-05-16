'use strict';

/* jasmine specs for controllers go here */

describe('AppCtrl : ', function() {
    
    var mps, manufacturer, product, schema, umsDomain;

	beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers', 'gbApp.controllers.gbtour', 'ui.bootstrap', 'ngCookies', 'angularFileUpload', function($provide) {
		$provide.value('infoserverDomain', 'undefined');
		$provide.value('useLocal', true);
		
		mps = 'null';
		manufacturer = 'springpath';
		product = 'springpath';
		schema = 'pod52';
		umsDomain = 'undefined';
		
		var element = document.createElement("div");
        element.id = "gb-full-page-loader";
        document.body.appendChild(element);
        
        element = document.createElement("div");
        element.id = "gb-apps-body";
        document.body.appendChild(element);
	}));
	
	beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

    it('Should load with user data', inject(function($rootScope, $controller, $httpBackend, GlobalService, $cookies, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope,
            '$cookies' : $cookies
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {Data: {domains: {key1: 'val1', key2: 'val2'}}});
        $httpBackend.flush();
    }));
    it('Should load with feedback button', inject(function($rootScope, $controller, $httpBackend, GlobalService, $cookies, infoserverDomain, $timeout, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope,
            '$cookies' : $cookies
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain,
            "feedbackButtonEnabled": true
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        $timeout.flush(200);
    }));
    it('Should load with rules and alerts', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, metaDataService, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        // $httpBackend.expect('POST', infoserverDomain + "/admin/role/user/details/" + manufacturer, undefined).respond({"Status":"Success","Msg":"List all information for a user","Data":{"domain":[{"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","default_feature_internal":"rules_and_alerts","nsr_enabled":false,"nsr_type":"NA"}],"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"role_details": {"realm_uidomain": {}, "features":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"rules_and_alerts","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Rules & Alerts/Rules list/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
    }));

    it('Should load with workbench null user', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, metaDataService, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });

        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"role_details": {"realm_uidomain": {}, "features":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"workbench","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Dashboards/Dashboards/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
    }));

    it('Should load with workbench null user default load not workbench', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, metaDataService, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });

        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"role_details": {"realm_uidomain": {}, "features":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"logvault","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', 'undefined/user_tracking/undefined/undefined/undefined/Log Vault/Log Vault/Default landing').respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
    }));

    it('Should load with explorer search log bundle', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $window = {location: {search: '?Log%20Bundle=*aruba_2016*&bundlename=aruba_2016.zip&bundle_id=aruba_2016.zip___360034___CP0004165___1458124263000'}};
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope,
            '$window': $window
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Log Vault/Log Vault/Switch to Explorer").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
    }));

    it('Should have login url in cookie', inject(function($rootScope, $controller, $httpBackend, GlobalService, $cookies, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        $cookies = {
            loginurl: '/login',
            globalLogin: 0
        };
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope,
            '$cookies' : $cookies
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
    }));

    it('Should be a generic tableau user', inject(function($rootScope, $controller, $httpBackend, GlobalService, metaDataService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
    }));

    it('Should be a generic tableau user with default feature workbench', inject(function($rootScope, $controller, $httpBackend, GlobalService, metaDataService, infoserverDomain, WorkbenchService, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        spyOn(WorkbenchService, "updateWorkbooks");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"workbench","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Dashboards/Dashboards/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
    }));

    it('Should have logoutUser', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.logoutUser).toEqual(jasmine.any(Function));
        ctrl.info = {
            logoutLink: "#"
        };
        ctrl.logoutUser();
    }));

    /*xit('Should have logoutUser for SSO User', inject(function($rootScope, $controller, $httpBackend, GlobalService, metaDataService, infoserverDomain, AppService) {
        GlobalService.setVal('session_redirect_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
                "infoserverDomain" : infoserverDomain,
                "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', umsDomain + "/admin/role/user/details/" + mps).respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":true,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.logoutUser).toEqual(jasmine.any(Function));
        ctrl.info = {
            logoutLink: "#"
        };
        ctrl.logoutUser();
    }));*/

    xit('Should have logoutUser for SSO User with logout url', inject(function($rootScope, $controller, $httpBackend, GlobalService, metaDataService, infoserverDomain, AppService) {
        GlobalService.setVal('session_redirect_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":true,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.logoutUser).toEqual(jasmine.any(Function));
        ctrl.info = {
            logoutLink: "#"
        };
        ctrl.logoutUser();
    }));

    xit('Should have logoutUser with API call', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.logoutUser).toEqual(jasmine.any(Function));
        ctrl.info = {
            logoutLink: "#"
        };
        ctrl.logoutUser();
        $httpBackend.expect('GET', infoserverDomain + '/aa/logout?mps=' + manufacturer + ':' + product + ':' + schema + '&feature=' + undefined).respond({});
        $httpBackend.flush();
    }));

    it('Should have renderHtml', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect($scope.renderHtml).toEqual(jasmine.any(Function));
        $scope.renderHtml('<div class="gb-explorer-big"></div>');
    }));

    it('Should have changeCurrentPage', inject(function($rootScope, $controller, WorkbenchService, $httpBackend, GlobalService, MenuService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.changeCurrentPage).toEqual(jasmine.any(Function));
        ctrl.changeCurrentPage('explorer');
        ctrl.changeCurrentPage('logvault');
        ctrl.changeCurrentPage('apps');
        ctrl.changeCurrentPage('apps', {});
        MenuService.setAppsLoaded(true);
        ctrl.changeCurrentPage('apps', {});
        ctrl.info.features = {
            workbench: 1
        };
        spyOn(WorkbenchService, "updateWorkbooks");
        spyOn($scope, "isFeatureEnable").and.returnValue(1);
        ctrl.changeCurrentPage('dashboards');
        expect(WorkbenchService.updateWorkbooks).toHaveBeenCalled();
    }));

    it('Should have getValue', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.getValue).toEqual(jasmine.any(Function));
        expect(ctrl.getValue('dashboards')).toEqual(GlobalService.getVal('dashboards'));
    }));

    it('Should have isFeatureEnable', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect($scope.isFeatureEnable).toEqual(jasmine.any(Function));
        ctrl.info.features = {
            workbench: true
        };
        $scope.isFeatureEnable('workbench');
    }));


    it('Should have getQueryLocalstorage', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect($scope.getQueryLocalstorage).toEqual(jasmine.any(Function));
        ctrl.info.features = {
            workbench: true
        };
        $scope.getQueryLocalstorage("",'a');
    }));


    it('Should have showMultipleDomainList', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.showMultipleDomainList).toEqual(jasmine.any(Function));
        ctrl.info = {
            logoutLink: "#"
        };
        ctrl.showMultipleDomainList();
    }));

    it('Should have changeProduct', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.changeProduct).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        ctrl.changeProduct("a:b:c",'yahoo.com');
    }));

    it('Should have changeProject', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.changeProject).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        ctrl.changeProject("a:b:c",'yahoo.com');
    }));

    it('Should have trackFeedback', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.trackFeedback).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        ctrl.trackFeedback();
    }));

    it('Should have setDefaultDomain', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.setDefaultDomain).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        ctrl.setDefaultDomain("a:b:c",'yahoo.com');
    }));

    it('Should have loadGBStudio', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.loadGBStudio).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        ctrl.loadGBStudio();
    }));

    it('Should have loadAdminConsole', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.loadAdminConsole).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        ctrl.loadAdminConsole();
    }));

    it('Should have loadLogStatusConsole', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.loadLogStatusConsole).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        ctrl.loadLogStatusConsole();
    }));

    it('Should have createRuleFromText', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.createRuleFromText).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        ctrl.createRuleFromText();
    }));

    it('Should have createRuleFromExplorer', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect($scope.createRuleFromExplorer).toEqual(jasmine.any(Function));
        ctrl.realm_mps= {'a:b:c':'yahoo.com'};
        $scope.createRuleFromExplorer();
    }));


    it('Should have showHelp', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.showHelp).toEqual(jasmine.any(Function));
        ctrl.info.current = 'explorer';
        expect(ctrl.showHelp()).toBeTruthy();
        ctrl.info.current = 'workbench';
        expect(ctrl.showHelp()).toBeFalsy();
    }));

    it('Should have getURL', inject(function($rootScope, $controller, GlobalService, $httpBackend, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.getURL).toEqual(jasmine.any(Function));
        ctrl.info.current = 'explorer';
        expect(ctrl.getURL('explorer')).toEqual(GlobalService.getVal('explorer'));
        expect(ctrl.getURL('logvault')).toBeUndefined();
    }));

    it('Should have showUpload', inject(function($rootScope, $controller, $modal, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', 'undefined/admin/role/user/details/springpath/springpath/pod52').respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.showUpload).toEqual(jasmine.any(Function));
        spyOn($modal, "open");
        ctrl.showUpload();
    }));

    it('Should have showUpload with upload form', inject(function($rootScope, $controller, $modal, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.showUpload).toEqual(jasmine.any(Function));
        spyOn($modal, "open");
        ctrl.showUpload();
        $httpBackend.expect('GET', 'undefined/uimeta/config/undefined/undefined/undefined').respond({Data: {}});
        $httpBackend.expect('POST', 'undefined/user_tracking/undefined/undefined/undefined/File Upload/File Upload/View?switched_feature=Explorer').respond(200);
        $httpBackend.flush();
    }));

    it('Should have showUpload with upload form user tracking error', inject(function($rootScope, $controller, $modal, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.showUpload).toEqual(jasmine.any(Function));
        spyOn($modal, "open");
        ctrl.showUpload();
        $httpBackend.expect('GET', 'undefined/uimeta/config/undefined/undefined/undefined').respond({Data: {}});
        $httpBackend.expect('POST', 'undefined/user_tracking/undefined/undefined/undefined/File Upload/File Upload/View?switched_feature=Explorer').respond(500, {Data: ""});
        $httpBackend.flush();
    }));

    it('Should have showUpload with upload form user tracking error session timeout', inject(function($rootScope, $controller, $modal, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.showUpload).toEqual(jasmine.any(Function));
        spyOn($modal, "open");
        ctrl.showUpload();
        $httpBackend.expect('GET', 'undefined/uimeta/config/undefined/undefined/undefined').respond({Data: {}});
        $httpBackend.expect('POST', 'undefined/user_tracking/undefined/undefined/undefined/File Upload/File Upload/View?switched_feature=Explorer').respond(500, {Msg: "timeout"});
        $httpBackend.flush();
    }));

    it('Should have instanceViewerFullscreen', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.instanceViewerFullscreen).toEqual(jasmine.any(Function));
        expect(ctrl.instanceViewerFullscreen()).toBeFalsy();
    }));

    it('Should have isThereInstanceViewer', inject(function($rootScope, $controller, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        expect(ctrl.isThereInstanceViewer).toEqual(jasmine.any(Function));
        expect(ctrl.isThereInstanceViewer()).toEqual(0);
    }));

    it('Should have changePassword', inject(function($rootScope, $controller, $modal, $httpBackend, GlobalService, infoserverDomain, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        spyOn(AppService, "logOutUrl");
        var $scope = $rootScope.$new();
        var ctrl = $controller('AppCtrl', {
            '$scope' : $scope
        });
        $httpBackend.expect('GET', '/apps/config/uiconfig.json').respond({
            "infoserverDomain" : infoserverDomain,
            "infoserverDomainStaging" : infoserverDomain
        });
        $httpBackend.expect('GET', "undefined/admin/role/user/details/springpath/springpath/pod52").respond({"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"ritesh.dobhal@glassbeam.com","first_name":"Ritesh","phone":"32432","org":"aruba","role":"admin","last_name":"Dobhal","def_passwd":false,"department":"adssd","sso":false,"wb_user_name":"ritesh.dobhal@glassbeam.com","report_usage":true,"created_on":"Wed Mar 23 04:32:06 EDT 2016","active":true,"city":"asda","state":"adas","country":"sadada"}],"feature":{"aruba/aruba/pod":"explorer, dashboards, apps, healthcheck, workbench, file_upload, rules_and_alerts, logvault"}}});
        $httpBackend.expect('GET', "undefined/mpse/config/details/undefined/undefined/undefined/undefined").respond(200, {Data: {"mfr":"aruba","prod":"aruba","sch":"pod","ec":"aruba","logo":"NA","logo_url":"NA","sso_login_url":"#","sso_logout_url":"#","sso_roles":"ARUN_Employees:Internal;ARUN_Customers:External;ARUN_Partners:External;test_roles:Internal;unknown:Internal","sso_idp_id":"a9a33b20-07db-491f-a05c-de8884419614","sso_params":"tokenid;agentid","sso_params_sfdc":"NA","feedback_button":false,"feedback_api_key":"NA","def_feature_internal":"explorer","nsr_enabled":false,"nsr_type":"NA"}});
        $httpBackend.expect('POST', "undefined/user_tracking/undefined/undefined/undefined/Explorer/Explorer/Default landing").respond(200);
        $httpBackend.expect('GET', "undefined/admin/role/domains/undefined/admin").respond(200, {});
        $httpBackend.flush();
        spyOn($modal, 'open');
        ctrl.changePassword();
    }));
});


describe('ChangePasswordCtrl : ', function() {

    var mps, manufacturer, product, schema, umsDomain,modalInstance;

    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers', 'gbApp.controllers.gbtour', 'ui.bootstrap', 'ngCookies', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);

        mps = 'null';
        manufacturer = 'springpath';
        product = 'springpath';
        schema = 'pod52';
        umsDomain = 'undefined';
        modalInstance = {                    // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        var element = document.createElement("div");
        element.id = "gb-full-page-loader";
        document.body.appendChild(element);

        element = document.createElement("div");
        element.id = "gb-apps-body";
        document.body.appendChild(element);
    }));

    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

    it('Should load have getValue', inject(function($rootScope, $controller,$cookies,$modalInstance, PasswordService, GlobalService, metaDataService, UserTrackingService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('ChangePasswordCtrl', {
            '$scope' : $scope,
            '$cookies' : $cookies
        });

        expect(ctrl.getValue).toEqual(jasmine.any(Function));
        expect(ctrl.getValue());
    }));

    it('Should load have matchPassword', inject(function($rootScope, $controller,$cookies,$modalInstance, PasswordService, GlobalService, metaDataService, UserTrackingService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('ChangePasswordCtrl', {
            '$scope' : $scope,
            '$cookies' : $cookies
        });

        expect(ctrl.matchPassword).toEqual(jasmine.any(Function));
        ctrl.changePswdCtrl={
            'form':{
                'new_passwd':'demo',
                'renew_passwd' : 'demo'
            }
        };
        expect(ctrl.matchPassword());
    }));

    it('Should load have maxLimit', inject(function($rootScope, $controller,$cookies,$modalInstance, PasswordService, GlobalService, metaDataService, UserTrackingService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('ChangePasswordCtrl', {
            '$scope' : $scope,
            '$cookies' : $cookies
        });

        expect(ctrl.maxLimit).toEqual(jasmine.any(Function));
        ctrl.changePswdCtrl={
            'form':{
                'new_passwd':'demo',
                'renew_passwd' : 'demo'
            }
        };
        expect(ctrl.maxLimit());
    }));


    it('Should load have ok', inject(function($rootScope, $controller,$cookies,$modalInstance, PasswordService, GlobalService, metaDataService, UserTrackingService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('ChangePasswordCtrl', {
            '$scope' : $scope,
            '$cookies' : $cookies,
            '$modalInstance': modalInstance
        });

        expect(ctrl.ok).toEqual(jasmine.any(Function));
        expect(ctrl.ok());
    }));


    it('Should load have cancel', inject(function($rootScope, $controller,$cookies,$modalInstance, PasswordService, GlobalService, metaDataService, UserTrackingService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('ChangePasswordCtrl', {
            '$scope' : $scope,
            '$cookies' : $cookies,
            '$modalInstance': modalInstance
        });

        expect(ctrl.cancel).toEqual(jasmine.any(Function));
        expect(ctrl.cancel());
    }));

});

describe('SessionController : ', function() {

    var mps, manufacturer, product, schema, umsDomain,modalInstance;

    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers', 'gbApp.controllers.gbtour', 'ui.bootstrap', 'ngCookies', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);

        mps = 'null';
        manufacturer = 'springpath';
        product = 'springpath';
        schema = 'pod52';
        umsDomain = 'undefined';
        modalInstance = {                    // Create a mock object using spies
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

    it('Should load have ok', inject(function($rootScope, $controller,$cookies,$modalInstance, GlobalService, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('SessionController', {
            '$scope' : $scope,
            '$cookies' : $cookies,
            '$modalInstance': modalInstance
        });

        expect(ctrl.ok).toEqual(jasmine.any(Function));
        expect(ctrl.ok());
    }));



});

describe('AbortUploadController : ', function() {

    var mps, manufacturer, product, schema, umsDomain,modalInstance;

    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers', 'gbApp.controllers.gbtour', 'ui.bootstrap', 'ngCookies', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);

        mps = 'null';
        manufacturer = 'springpath';
        product = 'springpath';
        schema = 'pod52';
        umsDomain = 'undefined';
        modalInstance = {                    // Create a mock object using spies
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

    it('Should load have hideAbortUpload', inject(function($rootScope, $controller,$cookies,$modalInstance, GlobalService, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('AbortUploadController', {
            '$scope' : $scope,
            '$cookies' : $cookies,
            '$modalInstance': modalInstance
        });

        expect(ctrl.hideAbortUpload).toEqual(jasmine.any(Function));
        expect(ctrl.hideAbortUpload());
    }));

    it('Should load have abortUpload', inject(function($rootScope, $controller,$cookies,$modalInstance, GlobalService, AppService) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('AbortUploadController', {
            '$scope' : $scope,
            '$cookies' : $cookies,
            '$modalInstance': modalInstance
        });

        expect(ctrl.abortUpload).toEqual(jasmine.any(Function));
        expect(ctrl.abortUpload());
    }));
});
describe('AlertController : ', function() {

    var mps, manufacturer, product, schema, umsDomain,modalInstance, items;

    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers', 'gbApp.controllers.gbtour', 'ui.bootstrap', 'ngCookies', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);

        mps = 'null';
        manufacturer = 'springpath';
        product = 'springpath';
        schema = 'pod52';
        umsDomain = 'undefined';
        modalInstance = {                    // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
        items={
            'msg':''
        }

    }));

    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

    it('Should load have ok', inject(function($rootScope, $controller,$cookies,$modalInstance, GlobalService, $sce) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('AlertController', {
            '$scope' : $scope,
            '$cookies' : $cookies,
            '$modalInstance': modalInstance,
            'items':items
        });

        expect(ctrl.ok).toEqual(jasmine.any(Function));
        expect(ctrl.ok());
    }));
});

describe('ConfirmationController : ', function() {

    var mps, manufacturer, product, schema, umsDomain,modalInstance, items,titleObj,msgObj,successText,cancelText;

    beforeEach(module('gbApp', 'gbApp.services.explorer', 'gbApp.controllers', 'gbApp.controllers.gbtour', 'ui.bootstrap', 'ngCookies', 'angularFileUpload', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);

        mps = 'null';
        manufacturer = 'springpath';
        product = 'springpath';
        schema = 'pod52';
        umsDomain = 'undefined';
        modalInstance = {                    // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
        items={
            'msg':''
        };
        titleObj={};
        msgObj={};
        successText={}
        cancelText={};

    }));

    beforeEach(inject(function(GlobalService) {
        var adminEmail = 'support@glassbeam.com';
        GlobalService.setGlobals(adminEmail);
    }));

    it('Should load have ok', inject(function($rootScope, $controller,$cookies,$modalInstance, GlobalService, $sce) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfirmationController', {
            '$scope' : $scope,
            '$cookies' : $cookies,
            '$modalInstance': modalInstance,
            'items':items,
            'titleObj':titleObj,
            'msgObj':msgObj,
            'successText':successText,
            'cancelText':cancelText
        });

        expect(ctrl.ok).toEqual(jasmine.any(Function));
        expect(ctrl.ok());
    }));

    it('Should load have cancel', inject(function($rootScope, $controller,$cookies,$modalInstance, GlobalService, $sce) {
        GlobalService.setVal('logout_url', '#');
        GlobalService.setVal('redirect_login_url', '#');
        var $scope = $rootScope.$new();
        var ctrl = $controller('ConfirmationController', {
            '$scope' : $scope,
            '$cookies' : $cookies,
            '$modalInstance': modalInstance,
            'items':items,
            'titleObj':titleObj,
            'msgObj':msgObj,
            'successText':successText,
            'cancelText':cancelText
        });

        expect(ctrl.cancel).toEqual(jasmine.any(Function));
        expect(ctrl.cancel());
    }));
});

