
/* jasmine specs for log vault controllers go here */

describe('ManageUserCtrl : ', function() {

    var manufacturer, product, schema, umsDomain;

    beforeEach(module('gbAdminApp.controllers', 'gbAdminApp.services', 'gbAdminApp.globalservices', 'ngCookies', 'ngDraggable',	'ngAnimate', 'ngRoute',	'ngTable', 'xml','ui.bootstrap', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);
        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
    }));
    beforeEach(function() {
        var fixture = '<div id="gb-first-time-loader" class="gb-first-time-loader gb-hide">'+'<div class="gb-loading">'+'<span id="gb-loader-msg" class="msg">Loading...</span>'+'<span class="bar"></span>'+'</div></div>';

        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);
    });

    it('Should Have init', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        spyOn($scope, 'getLoginDetails');
        spyOn($scope, 'getRoles');
        spyOn($scope, 'getUser');
        $scope.init();
    }));
    it('Should Have matchFeatures', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        features = "admin,dashboards,explorer,rules_and_alerts,workbench,logvault,file_upload,health_check,apps";
        $scope.matchFeatures(features);
    }));
    it('Should Have RevertFeaturesText', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        features = "Admin,Dashboards,Explorer,Rules & Alerts,Workbench,Apps,Health Check,File Upload,Logvault";
        $scope.RevertFeaturesText(features);
    }));
    it('Should Have defaultFeature', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.defaultFeatureCheck = "dashboards";
        var tempRow = {value:"dashboards"};
        $scope.defaultFeature(tempRow);
    }));
    it('Should Have defaultFeature else', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.defaultFeatureCheck = "dashboards";
        var tempRow = {value:"explorer"};
        $scope.defaultFeature(tempRow);
    }));
    it('Should Have addRole', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getRoles');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.addRoleName = "testRole5";
        $scope.allRoleNameList = ["testRole5"];
        spyOn($.fn, 'show');
        spyOn($.fn, 'hide');
        $scope.addRole();
    }));
    it('Should Have editRole', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getRoles');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editRoleName = "testRole5";
        $scope.users =[{"email":"anish.kumar@glassbeam.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.kumar@glassbeam.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uianish.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"NA","phone":"22131","city":"bangalore","state":"Karnataka","country":"India","department":"Enginnering","selected":false,"name":"Anish Kumar","deleted":"notDeleted","adminUserItem":true,"$$hashKey":"02N"},{"email":"anish.m1vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m1vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$MMzzaOaIYMHewUjcIBV/wudgtdnS/zDre36EyV1XXwc.s3/B91bdW","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02O"},{"email":"anish.m2vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m2vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$G.lwXCCkD78PkPmCr4x3DuHseGAxiHM7j/hQKCDcKXTVvkqLQgRVK","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02P"},{"email":"anish.mvj1111@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj1111@gmail.com","report_usage":false,"org":"springpath","role":"testRole5","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$iCc.N2CYc1C7R5UyvbBmyuctAGtoUybLArwn.ILHeF.AeO9.HSkMO","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02Q"},{"email":"anish.mvj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$/2mICcejLHdfHm5o/ne.dOmNfIGmkgX3ZZXGrV62ggZd66bytBFmS","phone":"+91810536866","city":"Karnataka","state":"Bangalore","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02R"}];
        $scope.editroleFeatures = [
            {'name' : 'Dashboards', 'value':'dashboards', 'checked':false},
            {'name' : 'Explorer', 'value':'explorer', 'checked':true},
            {'name' : 'Logvault', 'value':'logvault', 'checked':true},
            {'name' : 'File Upload', 'value':'file_upload', 'checked':false},
            {'name' : 'Workbench *', 'value':'workbench', 'checked':true},
            {'name' : 'Rules & Alerts *', 'value':'rules_and_alerts', 'checked':true}
        ]
        $scope.rdata = [
            {
                name:"testRole5",
                selected:true
            },
            {
                name:"testRole2",
                selected:false
            }
        ];
        $scope.workbenchFeatureAssigned = false;
        $scope.rdata[0].domains = [
            {
                name:"test",
                mps:["test","test","test2"]
            }
        ];
        $scope.editRoleProdDisplay = {
            id:"springpath:springpath:pod52",
            label:"test"
        }
        $scope.tableParams = {"data":[{"email":"anish.kumar@glassbeam.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.kumar@glassbeam.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uianish.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"NA","phone":"22131","city":"bangalore","state":"Karnataka","country":"India","department":"Enginnering","selected":false,"name":"Anish Kumar","deleted":"notDeleted","adminUserItem":true,"$$hashKey":"02N"},{"email":"anish.m1vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m1vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$MMzzaOaIYMHewUjcIBV/wudgtdnS/zDre36EyV1XXwc.s3/B91bdW","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02O"},{"email":"anish.m2vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m2vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$G.lwXCCkD78PkPmCr4x3DuHseGAxiHM7j/hQKCDcKXTVvkqLQgRVK","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02P"},{"email":"anish.mvj1111@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj1111@gmail.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$iCc.N2CYc1C7R5UyvbBmyuctAGtoUybLArwn.ILHeF.AeO9.HSkMO","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02Q"},{"email":"anish.mvj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$/2mICcejLHdfHm5o/ne.dOmNfIGmkgX3ZZXGrV62ggZd66bytBFmS","phone":"+91810536866","city":"Karnataka","state":"Bangalore","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02R"}],"$params":{"page":1,"count":5,"filter":{},"sorting":{},"group":{},"groupBy":null}};
        $scope.tableParams.reload = function(){
            return;
        }
        $.fn.modal = function(){
            return;
        };
        spyOn($.fn, 'modal');
        var retData = "test";
        var deferred = $q.defer();
        var deferred2 = $q.defer();
        deferred.resolve(retData);
        deferred2.resolve(retData);
        spyOn(AdminService, "addNewRole").and.returnValue(deferred.promise);
        spyOn(AdminService, "editUser").and.returnValue(deferred2.promise);
        $scope.editRole();
        $rootScope.$digest();
    }));
    it('Should Have addNewUser usersRemaining', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        $scope.usersRemaining = 0;
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser stateError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test1";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser success', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        $scope.roleList =[{"domains":[{"name":"Prodcut6","mps":["springpath","springpath","pod52"],"selected":false,"features":"Admin, Dashboards, Explorer, Rules & Alerts, Workbench"},{"name":"Prodcut9","mps":["springpath","springpath","pod53"],"selected":false,"features":"Admin, Dashboards, Explorer, Rules & Alerts, Logvault"}],"mps":[],"name":"springpath_springpath_pod52_admin","mps_uidomain":{"springpath:springpath:pod52":"uianish.glassbeam.com"},"realm_uidomain":{"prod":"uir.glassbeam.com","poc":"uianish.glassbeam.com"},"selected":false},{"domains":[{"name":"Prodcut6","mps":["springpath","springpath","pod52"],"selected":false,"features":"Dashboards, Explorer, Rules & Alerts, Workbench, Logvault, Health Check, File Upload, Apps"}],"mps":[],"name":"teste","mps_uidomain":{"springpath:springpath:pod52":"uianish.glassbeam.com"},"realm_uidomain":{"prod":"uir.glassbeam.com"},"selected":true}];
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser phoneError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "test";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser countryError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test1";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser firstNameLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest";
        $scope.newUserlast_name = "test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser LastNameLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser EmailLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "Test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser PhoneLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "Test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser DeptLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "Test";
        $scope.newUserDepartment = "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest";
        $scope.newUserState = "test";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser StateLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "Test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        $scope.newUserCity = "test";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser CityLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "Test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "Test";
        $scope.newUserCity = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        $scope.newUserCountry = "test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser CountryLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "Test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "Test";
        $scope.newUserCity = "Test";
        $scope.newUserCountry = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have addNewUser Useralreadyadded', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($scope, 'getLoginDetails');
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.newUserfirst_name = "Test";
        $scope.newUserlast_name = "Test";
        $scope.newUserDepartment = "Test";
        $scope.newUserState = "Test";
        $scope.newUserCity = "Test";
        $scope.newUserCountry = "Test";
        $scope.newUserreport_usage = true;
        $scope.newUserEmail = "test2@test.com";
        $scope.newUserPhone = "1234567890";
        $scope.newUserdashboard_admin = true;
        $scope.newUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.allUsersEmailList = ["test2@test.com"];
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.newUserRole = {
            id:"1",
            label:"testRole2"
        }
        $scope.addNewUser();
    }));
    it('Should Have editUser PhoneError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "test";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "test";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "test";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser StateError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "test1";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "test";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "1234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser countryError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "test";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "test1";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "1234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser firstNameError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "test";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "test";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "1234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser lastNameError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "test";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "test";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "1234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser PhoneLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "test";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "test";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser DeptLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest";
        $scope.editUserState = "test";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "test";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "1234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser StateLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "test";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "1234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser CityLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "test";
        $scope.editUserCity = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        $scope.editUserCountry = "test";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "1234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have editUser CountryLengthError', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        $scope.editUserRole = {
            id:"1",
            label:"testRole2"
        };
        spyOn($scope, 'getUser');
        $scope.editUserfirst_name = "Test";
        $scope.editUserlast_name = "test";
        $scope.editUserDepartment = "Test";
        $scope.editUserState = "test";
        $scope.editUserCity = "test";
        $scope.editUserCountry = "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
        $scope.editUserreport_usage = true;
        $scope.editUserEmail = "test@test.com";
        $scope.editUserPhone = "1234567890";
        $scope.editUserdashboard_admin = true;
        $scope.editUsermps_def = {
            id:"test",
            label:"test"
        };
        $scope.editUser();
    }));
    it('Should Have getUser', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=springpath:springpath:pod52';
        spyOn($scope, 'getRoles');
        var retData2 = {'data':{'Status':'Success','Msg':'List of users','Data':[{'email':'anish.kumar@glassbeam.com','first_name':'Anish','last_name':'Kumar','wb_user_name':'anish.kumar@glassbeam.com','report_usage':false,'org':'springpath','role':'springpath_springpath_pod52_admin','realm_def':'uianish.glassbeam.com','url_def':'apps/app/index.html','mps_def':'springpath:springpath:pod52','dashboard_admin':false,'active':true,'token_id':'NA','phone':'221312313123','city':'bangalore','state':'Karnataka','country':'India','department':'Enginnering'}]},'status':200,'config':{'transformRequest':[null],'transformResponse':[null],'method':'GET','url':'http://searchdev.glassbeam.com:9191/v1/customer/user/list/springpath','headers':{'Accept':'application/json, text/plain, */*'}}};

        var retData = {'data':{'Status':'Success','Msg':'List all information for a user','Data':{'user':[{'email':'anish.kumar@glassbeam.com','first_name':'fname','phone':'1234567890','org':'aruba','role':'aruba_aruba_adminpanel_admin','last_name':'lname','def_passwd':false,'department':'','sso':false,'wb_user_name':'generic','report_usage':false,'created_on':'Tue Sep 06 03:09:13 EDT 2016','active':true,'city':'city','state':'kar','country':'Country','is_external':false,'mps_def':'aruba:aruba:adminpanel','org_type':10,'show_info':false}],'role_details':{'name':'aruba_aruba_adminpanel_admin','is_super':false,'domains':{'Aruba-adminpanel':'aruba:aruba:adminpanel'},'features':{'aruba:aruba:adminpanel':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,apps'},'realm_isdomain':{'is01':'http://gbqis01.glassbeam.com:9000/v1','prod':'http://infoqa.glassbeam.com:9000/v1'},'realm_uidomain':{'is01':'gbqis01.glassbeam.com','prod':'appsqa.glassbeam.com'},'mps_uidomain':{'aruba:aruba:adminpanel':'gbqis01.glassbeam.com'},'mps_isdomain':{'aruba:aruba:adminpanel':'http://gbqis01.glassbeam.com:9000/v1'},'realm_appsversion':{'aruba:aruba:adminpanel':'5.5.0.0'}}}},'status':200,'config':{'transformRequest':[null],'transformResponse':[null],'method':'GET','url':'http://umsqa.glassbeam.com:9000/v1/admin/role/user/details/aruba/aruba/adminpanel','headers':{'Accept':'application/json, text/plain, */*'}}};
        var deferred = $q.defer();
        var deferred2 = $q.defer();
        deferred.resolve(retData);
        deferred2.resolve(retData2);
        spyOn(AdminService, "getLoginFields").and.returnValue(deferred.promise);
        spyOn(AdminService, "getUserList").and.returnValue(deferred2.promise);
        $scope.getUser();
        $rootScope.$digest();
    }));
    it('Should Have getRoles', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=vce:vce:pod55';
        spyOn($.fn, 'show');
        spyOn($.fn, 'hide');
        var retData = {'data':{'Status':'Success','Msg':'list of all Users','Data':[{'name':'testw','is_super':false,'domains':{'product 3':'ptc:ptc:pod52'},'features':{'ptc:ptc:pod52':'logvault'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{},'mps_isdomain':{},'realm_appsversion':{}},{'name':'vce_vce_pod55_role3','is_super':false,'domains':{'product 3':'vce:vce:pod55'},'features':{'vce:vce:pod55':'logvault,file_upload,workbench'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'vce_vce_pod55_vcetest','is_super':false,'domains':{'product 3':'vce:vce:pod55','product1':'vce:vce:pod53'},'features':{'vce:vce:pod53':'explorer,logvault','vce:vce:pod55':'logvault,workbench'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'springpath_springpath_pod52_admin','is_super':false,'domains':{'Prodcut6':'springpath:springpath:pod52','Prodcut9':'springpath:springpath:pod53'},'features':{'springpath:springpath:pod52':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,file_upload,apps','springpath:springpath:pod53':'dashboards,explorer,logvault,admin'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com'},'mps_uidomain':{'springpath:springpath:pod52':'uir.glassbeam.com'},'mps_isdomain':{'springpath:springpath:pod52':'http://uir.glassbeam.com:9000/v1'},'realm_appsversion':{'springpath:springpath:pod52':'5.5'}},{'name':'springpath_springpath_pod52_teste','is_super':false,'domains':{'Prodcut6':'springpath:springpath:pod52'},'features':{'springpath:springpath:pod52':'dashboards,explorer,logvault'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'springpath:springpath:pod52':'uir.glassbeam.com'},'mps_isdomain':{'springpath:springpath:pod52':'http://uir.glassbeam.com:9000/v1'},'realm_appsversion':{'springpath:springpath:pod52':'5.5'}},{'name':'role10','is_super':false,'domains':{'product 3':'ptc:ptc:pod52'},'features':{'ptc:ptc:pod52':'logvault,rules_and_alerts'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{},'mps_isdomain':{},'realm_appsversion':{}},{'name':'vce_vce_pod55_admin','is_super':false,'domains':{'product 3':'vce:vce:pod55','product1':'vce:vce:pod53'},'features':{'vce:vce:pod53':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,apps','vce:vce:pod55':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,file_upload,apps'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'vce_vce_pod55_test123','is_super':false,'domains':{'product 3':'vce:vce:pod55'},'features':{'vce:vce:pod55':'logvault,rules_and_alerts'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'testrolenew','is_super':false,'domains':{'Prodcut6':'springpath:springpath:pod52','Prodcut7':'ptc:ptc:pod52','Prodcut9':'springpath:springpath:pod53'},'features':{'ptc:ptc:pod52':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault','springpath:springpath:pod52':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault','springpath:springpath:pod53':'admin,dashboards,explorer,rules_and_alerts,logvault'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'springpath:springpath:pod52':'uir.glassbeam.com'},'mps_isdomain':{'springpath:springpath:pod52':'http://uir.glassbeam.com:9000/v1'},'realm_appsversion':{'springpath:springpath:pod52':'5.5'}},{'name':'aruba_aruba_podui_admin','is_super':false,'domains':{'Product 1':'aruba:aruba:podui','Product 2':'aruba:aruba:pod'},'features':{'aruba:aruba:pod':'dashboards,explorer,logvault,admin','aruba:aruba:podui':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,file_upload,apps'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com'},'mps_uidomain':{'aruba:aruba:podui':'uir.glassbeam.com'},'mps_isdomain':{'aruba:aruba:podui':'http://uir.glassbeam.com:9000/v1'},'realm_appsversion':{'aruba:aruba:podui':'5.5'}},{'name':'vce_vce_pod55_teste','is_super':false,'domains':{'product 3':'vce:vce:pod55'},'features':{'vce:vce:pod55':'explorer,logvault,workbench'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'test333333','is_super':false,'domains':{'product 3':'ptc:ptc:pod52'},'features':{'ptc:ptc:pod52':'logvault'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{},'mps_isdomain':{},'realm_appsversion':{}},{'name':'admin','is_super':false,'domains':{},'features':{},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1','studio':''},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com','studio':''},'mps_uidomain':{},'mps_isdomain':{},'realm_appsversion':{}},{'name':'vce_vce_pod_admin','is_super':false,'domains':{'product 3':'vce:vce:pod55','product1':'vce:vce:pod53'},'features':{'vce:vce:pod':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,apps','vce:vce:pod55':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,file_upload,apps'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'aruba_aruba_podui_role123','is_super':false,'domains':{'Product 1':'aruba:aruba:podui'},'features':{'aruba:aruba:podui':'dashboards,explorer,logvault,workbench'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'aruba:aruba:podui':'uir.glassbeam.com'},'mps_isdomain':{'aruba:aruba:podui':'http://uir.glassbeam.com:9000/v1'},'realm_appsversion':{'aruba:aruba:podui':'5.5'}},{'name':'testrol','is_super':false,'domains':{'Product 1':'aruba:aruba:podui','product1':'ptc:ptc:pod53','product3':'ptc:ptc:pod52'},'features':{'aruba:aruba:podui':'explorer,logvault','ptc:ptc:pod52':'dashboards,workbench,health_check','ptc:ptc:pod53':'dashboards,explorer,workbench,logvault,health_check'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com'},'mps_uidomain':{'aruba:aruba:podui':'uir.glassbeam.com','ptc:ptc:pod53':'uianish.glassbeam.com'},'mps_isdomain':{'aruba:aruba:podui':'http://uir.glassbeam.com:9000/v1','ptc:ptc:pod53':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'aruba:aruba:podui':'5.5','ptc:ptc:pod53':'5.5'}},{'name':'vce_vce_pod55_test234','is_super':false,'domains':{'product 3':'vce:vce:pod55'},'features':{'vce:vce:pod55':'logvault,workbench'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'vce_vce_pod55_testrole2','is_super':false,'domains':{'product 3':'vce:vce:pod55'},'features':{'vce:vce:pod55':'logvault'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'admin_vce','is_super':false,'domains':{'product 1':'vce:vce:pod53','product 3':'vce:vce:pod55'},'features':{'vce:vce:pod53':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,apps','vce:vce:pod55':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,file_upload,apps'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com'},'mps_uidomain':{'vce:vce:pod55':'uianish.glassbeam.com'},'mps_isdomain':{'vce:vce:pod55':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'vce:vce:pod55':'5.5'}},{'name':'admin_aruba','is_super':false,'domains':{'Product 1':'aruba:aruba:podui','Product 2':'aruba:aruba:pod'},'features':{'aruba:aruba:pod':'dashboards,explorer,logvault,admin','aruba:aruba:podui':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,file_upload,apps'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com'},'mps_uidomain':{'aruba:aruba:podui':'uir.glassbeam.com'},'mps_isdomain':{'aruba:aruba:podui':'http://uir.glassbeam.com:9000/v1'},'realm_appsversion':{'aruba:aruba:podui':'5.5'}},{'name':'ptc_ptc_pod53_admin','is_super':false,'domains':{'product 3':'ptc:ptc:pod52','product1':'ptc:ptc:pod53'},'features':{'ptc:ptc:pod52':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,file_upload,apps','ptc:ptc:pod53':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,apps'},'realm_isdomain':{'prod':'http://searchdev.glassbeam.com:9000/v1','poc':'http://uir.glassbeam.com:9000/v1'},'realm_uidomain':{'prod':'uianish.glassbeam.com','poc':'uir.glassbeam.com'},'mps_uidomain':{'ptc:ptc:pod53':'uianish.glassbeam.com'},'mps_isdomain':{'ptc:ptc:pod53':'http://searchdev.glassbeam.com:9000/v1'},'realm_appsversion':{'ptc:ptc:pod53':'5.5'}},{'name':'aruba_aruba_podui_testrole','is_super':false,'domains':{'Product 1':'aruba:aruba:podui','Product 2':'aruba:aruba:pod'},'features':{'aruba:aruba:pod':'dashboards,explorer,logvault','aruba:aruba:podui':'dashboards,explorer,logvault,workbench'},'realm_isdomain':{'poc':'http://uir.glassbeam.com:9000/v1','prod':'http://searchdev.glassbeam.com:9000/v1'},'realm_uidomain':{'poc':'uir.glassbeam.com','prod':'uianish.glassbeam.com'},'mps_uidomain':{'aruba:aruba:podui':'uir.glassbeam.com'},'mps_isdomain':{'aruba:aruba:podui':'http://uir.glassbeam.com:9000/v1'},'realm_appsversion':{'aruba:aruba:podui':'5.5'}}]}};
        $scope.loggedInUserrole = "vce_vce_pod55_role3";
        var deferred = $q.defer();
        deferred.resolve(retData);
        spyOn(AdminService, "getRoleList").and.returnValue(deferred.promise);
        $scope.getRoles();
        $rootScope.$digest();
    }));
    it('Should Have getLoginDetails', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        spyOn($.fn, 'show');
        spyOn($.fn, 'hide');
        spyOn($scope, 'getRoles');
        var retData = {'data':{'Status':'Success','Msg':'List all information for a user','Data':{'user':[{'email':'admin@aruba.com','first_name':'fname','phone':'1234567890','org':'aruba','role':'aruba_aruba_adminpanel_admin','last_name':'lname','def_passwd':false,'department':'','sso':false,'wb_user_name':'generic','report_usage':false,'created_on':'Tue Sep 06 03:09:13 EDT 2016','active':true,'city':'city','state':'kar','country':'Country','is_external':false,'mps_def':'aruba:aruba:adminpanel','org_type':10,'show_info':false}],'role_details':{'name':'aruba_aruba_adminpanel_admin','is_super':false,'domains':{'Aruba-adminpanel':'aruba:aruba:adminpanel'},'features':{'aruba:aruba:adminpanel':'admin,dashboards,explorer,rules_and_alerts,workbench,logvault,health_check,apps'},'realm_isdomain':{'is01':'http://gbqis01.glassbeam.com:9000/v1','prod':'http://infoqa.glassbeam.com:9000/v1'},'realm_uidomain':{'is01':'gbqis01.glassbeam.com','prod':'appsqa.glassbeam.com'},'mps_uidomain':{'aruba:aruba:adminpanel':'gbqis01.glassbeam.com'},'mps_isdomain':{'aruba:aruba:adminpanel':'http://gbqis01.glassbeam.com:9000/v1'},'realm_appsversion':{'aruba:aruba:adminpanel':'5.5.0.0'}}}},'status':200,'config':{'transformRequest':[null],'transformResponse':[null],'method':'GET','url':'http://umsqa.glassbeam.com:9000/v1/admin/role/user/details/aruba/aruba/adminpanel','headers':{'Accept':'application/json, text/plain, */*'}}};
        var deferred = $q.defer();
        deferred.resolve(retData);
        spyOn(AdminService, "getLoginFields").and.returnValue(deferred.promise);
        $scope.getLoginDetails();
        $rootScope.$digest();
    }));
    it('Should Have addProductSubmit else', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=test';
        spyOn($.fn, 'show');
        spyOn($scope, 'getRoles');
        spyOn($scope, 'unique').and.returnValue("test:test:test2");
        $scope.addProdRoleMfr = {label:"test"};
        $scope.addProdRoleProd= {label:"test"};
        $scope.addProdRoleSch= {label:"test2"};
        $scope.addProdRoleRealm = [
            {
                id:"0",
                label:"test"
            }
        ];
        $scope.rdata = [
            {
                name:"testRole5",
                selected:true
            },
            {
                name:"testRole2",
                selected:false
            }
        ];
        $scope.rdata[0].domains = [
            {
                name:"test",
                mps:["test","test","test2"]
            }
        ];
        var retData = {'data':{'Status':'Success','Msg':'Role deleted successfully','Data':''},'status':200,'config':{'transformRequest':[null],'transformResponse':[null],'method':'POST','url':'http://searchdev.glassbeam.com:9191/v1/admin/usermanagement/role/delete/testRole5/springpath','headers':{'Accept':'application/json, text/plain, */*'}}};
        var deferred = $q.defer();
        deferred.resolve(retData);
        spyOn(AdminService, "addNewRole").and.returnValue(deferred.promise);
        $scope.addProductSubmit();
        $rootScope.$digest();
    }));
    it('Should Have addProductSubmit', inject(function($rootScope, $controller,GlobalService,AdminService,$httpBackend,infoserverDomain,$q,$cookies) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        document.cookie = 'mps=test';
        spyOn($.fn, 'show');
        spyOn($scope, 'getRoles');
        spyOn($scope, 'unique').and.returnValue("test");
        $scope.addProdRoleMfr = {label:"test"};
        $scope.addProdRoleProd= {label:"test"};
        $scope.addProdRoleSch= {label:"test"};
        $scope.addProdRoleDomain = "test";
        $scope.rdata = [
            {
                name:"testRole5",
                selected:true
            },
            {
                name:"testRole2",
                selected:false
            }
        ];
        $scope.rdata[0].domains = [
            {
                name:"test",
                mps:["test","test","test2"]
            }
        ];
        var retData = {'data':{'Status':'Success','Msg':'Role deleted successfully','Data':''},'status':200,'config':{'transformRequest':[null],'transformResponse':[null],'method':'POST','url':'http://searchdev.glassbeam.com:9191/v1/admin/usermanagement/role/delete/testRole5/springpath','headers':{'Accept':'application/json, text/plain, */*'}}};
        var deferred = $q.defer();
        deferred.resolve(retData);
        spyOn(AdminService, "addNewRole").and.returnValue(deferred.promise);
        $scope.addProductSubmit();
        $rootScope.$digest();
    }));
    it('Should Have watch', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        ctrl.slectedRoleCount = 2;
        $scope.$digest();

        ctrl.currentSelection = 4;
        $scope.slectedRoleCount = 1;
        $scope.rdata = [{},{}];
        $scope.$digest();
    }));
    it('Should Have watch', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        ctrl.slectedRoleCount = 2;
        $scope.$digest();

        ctrl.currentSelection = 4;
        $scope.slectedRoleCount = 1;
        $scope.rdata = [{},{}];
        $scope.$digest();
    }));
    it('Should Have watch else', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        ctrl.slectedRoleCount = 2;
        $scope.$digest();

        ctrl.currentSelection = 4;
        $scope.slectedRoleCount = 1;
        $scope.rdata = [{},{domains:["test","test2"],selected:true}];
        $scope.$digest();
    }));
    it('Should Have unique', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var data = ["test1","test2","test1"];
        $scope.unique(data);
    }));
    it('Should Have toggleSelectAll', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.users =[{"email":"anish.kumar@glassbeam.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.kumar@glassbeam.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uianish.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"NA","phone":"22131","city":"bangalore","state":"Karnataka","country":"India","department":"Enginnering","selected":false,"name":"Anish Kumar","deleted":"notDeleted","adminUserItem":true,"$$hashKey":"02N"},{"email":"anish.m1vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m1vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$MMzzaOaIYMHewUjcIBV/wudgtdnS/zDre36EyV1XXwc.s3/B91bdW","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02O"},{"email":"anish.m2vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m2vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$G.lwXCCkD78PkPmCr4x3DuHseGAxiHM7j/hQKCDcKXTVvkqLQgRVK","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02P"},{"email":"anish.mvj1111@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj1111@gmail.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$iCc.N2CYc1C7R5UyvbBmyuctAGtoUybLArwn.ILHeF.AeO9.HSkMO","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02Q"},{"email":"anish.mvj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$/2mICcejLHdfHm5o/ne.dOmNfIGmkgX3ZZXGrV62ggZd66bytBFmS","phone":"+91810536866","city":"Karnataka","state":"Bangalore","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02R"}];
        $scope.selectAll = true;
        $scope.data = [{},{}];
        $scope.toggleSelectAll("all");
    }));
    it('Should Have toggleSelectAll else', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.users =[{"email":"anish.kumar@glassbeam.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.kumar@glassbeam.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uianish.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"NA","phone":"22131","city":"bangalore","state":"Karnataka","country":"India","department":"Enginnering","selected":false,"name":"Anish Kumar","deleted":"notDeleted","adminUserItem":true,"$$hashKey":"02N"},{"email":"anish.m1vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m1vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$MMzzaOaIYMHewUjcIBV/wudgtdnS/zDre36EyV1XXwc.s3/B91bdW","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02O"},{"email":"anish.m2vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m2vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$G.lwXCCkD78PkPmCr4x3DuHseGAxiHM7j/hQKCDcKXTVvkqLQgRVK","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02P"},{"email":"anish.mvj1111@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj1111@gmail.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$iCc.N2CYc1C7R5UyvbBmyuctAGtoUybLArwn.ILHeF.AeO9.HSkMO","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02Q"},{"email":"anish.mvj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$/2mICcejLHdfHm5o/ne.dOmNfIGmkgX3ZZXGrV62ggZd66bytBFmS","phone":"+91810536866","city":"Karnataka","state":"Bangalore","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02R"}];
        $scope.selectAll = false;
        $scope.data = [{},{}];
        $scope.toggleSelectAll("all");
    }));
    it('Should Have toggleSelectAll else 2', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.users =[{"email":"anish.kumar@glassbeam.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.kumar@glassbeam.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uianish.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"NA","phone":"22131","city":"bangalore","state":"Karnataka","country":"India","department":"Enginnering","selected":false,"name":"Anish Kumar","deleted":"notDeleted","adminUserItem":true,"$$hashKey":"02N"},{"email":"anish.m1vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m1vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$MMzzaOaIYMHewUjcIBV/wudgtdnS/zDre36EyV1XXwc.s3/B91bdW","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02O"},{"email":"anish.m2vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m2vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$G.lwXCCkD78PkPmCr4x3DuHseGAxiHM7j/hQKCDcKXTVvkqLQgRVK","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02P"},{"email":"anish.mvj1111@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj1111@gmail.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$iCc.N2CYc1C7R5UyvbBmyuctAGtoUybLArwn.ILHeF.AeO9.HSkMO","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02Q"},{"email":"anish.mvj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$/2mICcejLHdfHm5o/ne.dOmNfIGmkgX3ZZXGrV62ggZd66bytBFmS","phone":"+91810536866","city":"Karnataka","state":"Bangalore","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02R"}];
        $scope.selectAll = false;
        $scope.data = [{},{}];
        $scope.toggleSelectAll("name");
    }));
    it('Should Have requiredCheck', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var type = "newUserRole";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck if else', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.newUserRole = "test";
        var type = "newUserRole";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type newUserMps', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var type = "newUserMps";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type newUserRealm', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.newUserrealm_defOptions = [];
        var type = "newUserRealm";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type newUserRealm', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.newUserrealm_defOptions = [];
        var type = "newUserRealm";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type rProd', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.addRoleProdDisplayOptions = [];
        var type = "rProd";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type newUserwb_user_name', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.addRoleProdDisplayOptions = [];
        var type = "newUserwb_user_name";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type editUserRole', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.addRoleProdDisplayOptions = [];
        var type = "editUserRole";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type editUserRole if else', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.editUserRole = "test";
        var type = "editUserRole";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type editUserMps', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var type = "editUserMps";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type editUserRealm', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.editUserrealm_defOptions = [];
        var type = "editUserRealm";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have requiredCheck type editUserwb_user_name', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.newUserwb_user_nameOptions = [];
        var type = "editUserwb_user_name";
        var data = {"id":3,"label":"testRole2","productList":{"Prodcut6":"springpath:springpath:pod52","Prodcut9":"springpath:springpath:pod53"}};
        $scope.requiredCheck(type,data);
    }));
    it('Should Have sortClass', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.reverse = true;
        $scope.columnUser = "email";
        var col = "email";
        $scope.sortClass(col);
    }));
    it('Should Have sortClass if else', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.reverse = false;
        $scope.columnUser = "email";
        var col = "email";
        $scope.sortClass(col);
    }));
    it('Should Have sortClass else', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.columnUser = "email";
        var col = "name";
        $scope.sortClass(col);
    }));
    it('Should Have sortClass if 2', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.columnRole = "name";
        $scope.reverse = true;
        var col = "name";
        $scope.sortClass(col,"roleTable");
    }));
    it('Should Have sortClass if else 2', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.columnRole = "name";
        $scope.reverse = false;
        var col = "name";
        $scope.sortClass(col,"roleTable");
    }));
    it('Should Have sortClass if else 2', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.columnRole = "email";
        $scope.reverse = false;
        var col = "name";
        $scope.sortClass(col,"roleTable");
    }));
    it('Should Have sortColumn', inject(function($rootScope, $controller, ngTableParams) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            'ngTableParams': ngTableParams
        });
        $scope.reverse = true;
        $scope.sortColumn('name','roleTable');
    }));
    it('Should Have sortColumn', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.tableParams = {"data":[{"email":"anish.kumar@glassbeam.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.kumar@glassbeam.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uianish.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"NA","phone":"22131","city":"bangalore","state":"Karnataka","country":"India","department":"Enginnering","selected":false,"name":"Anish Kumar","deleted":"notDeleted","adminUserItem":true,"$$hashKey":"02N"},{"email":"anish.m1vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m1vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$MMzzaOaIYMHewUjcIBV/wudgtdnS/zDre36EyV1XXwc.s3/B91bdW","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02O"},{"email":"anish.m2vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m2vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$G.lwXCCkD78PkPmCr4x3DuHseGAxiHM7j/hQKCDcKXTVvkqLQgRVK","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02P"},{"email":"anish.mvj1111@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj1111@gmail.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$iCc.N2CYc1C7R5UyvbBmyuctAGtoUybLArwn.ILHeF.AeO9.HSkMO","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02Q"},{"email":"anish.mvj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$/2mICcejLHdfHm5o/ne.dOmNfIGmkgX3ZZXGrV62ggZd66bytBFmS","phone":"+91810536866","city":"Karnataka","state":"Bangalore","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02R"}],"$params":{"page":1,"count":5,"filter":{},"sorting":{},"group":{},"groupBy":null}};
        $scope.users =[{"email":"anish.kumar@glassbeam.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.kumar@glassbeam.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uianish.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"NA","phone":"22131","city":"bangalore","state":"Karnataka","country":"India","department":"Enginnering","selected":false,"name":"Anish Kumar","deleted":"notDeleted","adminUserItem":true,"$$hashKey":"02N"},{"email":"anish.m1vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m1vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$MMzzaOaIYMHewUjcIBV/wudgtdnS/zDre36EyV1XXwc.s3/B91bdW","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02O"},{"email":"anish.m2vj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.m2vj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$G.lwXCCkD78PkPmCr4x3DuHseGAxiHM7j/hQKCDcKXTVvkqLQgRVK","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02P"},{"email":"anish.mvj1111@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj1111@gmail.com","report_usage":false,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$iCc.N2CYc1C7R5UyvbBmyuctAGtoUybLArwn.ILHeF.AeO9.HSkMO","phone":"+918105368665","city":"Bangalore","state":"Karnataka","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02Q"},{"email":"anish.mvj@gmail.com","first_name":"Anish","last_name":"Kumar","wb_user_name":"anish.mvj@gmail.com","report_usage":true,"org":"springpath","role":"springpath_springpath_pod52_admin","realm_def":"uir.glassbeam.com","url_def":"apps/app/index.html","mps_def":"springpath:springpath:pod52","dashboard_admin":false,"active":true,"token_id":"$2a$10$/2mICcejLHdfHm5o/ne.dOmNfIGmkgX3ZZXGrV62ggZd66bytBFmS","phone":"+91810536866","city":"Karnataka","state":"Bangalore","country":"India","department":"aaaa","selected":false,"name":"Anish Kumar","deleted":"notDeleted","$$hashKey":"02R"}];
        $scope.sortColumn('name');
    }));
    it('Should Have addProduct', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.addRoleProdDisplayOptions = [{'id':1,'label':'Prodcut9'}];
        $scope.roleList =[{"domains":[{"name":"Prodcut6","mps":["springpath","springpath","pod52"],"selected":false,"features":"Admin, Dashboards, Explorer, Rules & Alerts, Workbench"},{"name":"Prodcut9","mps":["springpath","springpath","pod53"],"selected":false,"features":"Admin, Dashboards, Explorer, Rules & Alerts, Logvault"}],"mps":[],"name":"springpath_springpath_pod52_admin","mps_uidomain":{"springpath:springpath:pod52":"uianish.glassbeam.com"},"realm_uidomain":{"prod":"uir.glassbeam.com","poc":"uianish.glassbeam.com"},"selected":false},{"domains":[{"name":"Prodcut6","mps":["springpath","springpath","pod52"],"selected":false,"features":"Dashboards, Explorer, Rules & Alerts, Workbench, Logvault, Health Check, File Upload, Apps"}],"mps":[],"name":"teste","mps_uidomain":{"springpath:springpath:pod52":"uianish.glassbeam.com"},"realm_uidomain":{"prod":"uir.glassbeam.com"},"selected":true}];
        $scope.addProduct();
    }));
    it('Should Have selectAllUser', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.selectAll = true;
        $scope.data =[{},{}]
        $scope.selectAllUser();
    }));
    it('Should Have selectAllUser else', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        $scope.selectAll = false;
        $scope.data =[{},{}]
        $scope.selectAllUser();
    }));
    it('Should Have isRequiredRole', inject(function($rootScope, $controller,GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var data = "addRoleName";
        $scope.isRequiredRole(data);
    }));
    it('Should Have isRequiredRole else', inject(function($rootScope, $controller,GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var data = "test";
        $scope.isRequiredRole(data);
    }));
    it('Should Have isRequired', inject(function($rootScope, $controller,GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var data = "first_name";
        $scope.isRequired(data);
    }));
    it('Should Have isRequired else', inject(function($rootScope, $controller,GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var data = "test";
        $scope.isRequired(data);
    }));
    it('Should Have editRoleRow', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope
        });
        var data = {'domains':[{'name':'Prodcut6','mps':['springpath','springpath','pod52'],'selected':true,'features':'explorer,rules_and_alerts,workbench,logvault','$$hashKey':'02M'},{'name':'Prodcut9','mps':['springpath','springpath','pod53'],'selected':false,'features':'dashboards, explorer, workbench, logvault','$$hashKey':'02N'}],'mps':[],'name':'testRole2','mps_uidomain':{'springpath:springpath:pod52':'uianish.glassbeam.com'},'realm_uidomain':{'poc':'uianish.glassbeam.com','prod':'uir.glassbeam.com'},'selected':false,'$$hashKey':'02I'};
        var domData = {'name':'Prodcut6','mps':['springpath','springpath','pod52'],'selected':true,'features':'explorer,rules_and_alerts,workbench,logvault','$$hashKey':'02M'};
        $scope.editRoleRow(data,domData);
    }));
    it('Should Have editRow', inject(function($rootScope, $controller, AdminService, $httpBackend,infoserverDomain,$cookies,GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        $scope.editUserRole = [];
        $scope.newUserRoleOptions =[{"id":"","label":"Select Role","value":"Select Role"},{"id":1,"label":"role3","value":"vce_vce_pod55_role3","productList":{"product 3":"vce:vce:pod55"}},{"id":3,"label":"vcetest","value":"vce_vce_pod55_vcetest","productList":{"product 3":"vce:vce:pod55","product1":"vce:vce:pod53"}},{"id":5,"label":"admin","value":"vce_vce_pod55_admin","productList":{"product 3":"vce:vce:pod55","product1":"vce:vce:pod53"}},{"id":6,"label":"test123","value":"vce_vce_pod55_test123","productList":{"product 3":"vce:vce:pod55"}},{"id":7,"label":"teste","value":"vce_vce_pod55_teste","productList":{"product 3":"vce:vce:pod55"}},{"id":8,"label":"test234","value":"vce_vce_pod55_test234","productList":{"product 3":"vce:vce:pod55"}},{"id":9,"label":"testrole2","value":"vce_vce_pod55_testrole2","productList":{"product 3":"vce:vce:pod55"}}];
        var data = {
            active:true,
            city:"Bangalore",
            country:"India",
            dashboard_admin:false,
            deleted:"notDeleted",
            department:"XYZ",
            email:"anish.mvj1@gmail.com",
            first_name:"Anish",
            last_name:"Kumar",
            mps_def:"vce:vce:pod55",
            name:"Anish Kumar",
            org:"springpath",
            phone:"8105368665",
            realm_def:"uir.glassbeam.com",
            report_usage:false,
            role:"testrole5",
            selected:false,
            state:"Karnataka",
            token_id:"$2a$10$VTNNhuQdVFDZk0TNU2FVP.rIVU/VobyG.gEfoZO1DthQmyXTc6etO",
            url_def:"/apps/app/index.html",
            wb_user_name:"anish.mvj1@gmail.com"
        };
        $scope.editRow(data);
    }));
    it('Should Have editRow else', inject(function($rootScope, $controller, AdminService, $httpBackend,infoserverDomain,$cookies,GlobalService) {
        var $scope = $rootScope.$new();
        var ctrl = $controller('ManageUserCtrl', {
            '$scope': $scope,
            '$cookies':$cookies
        });
        $scope.editUserRole = [];
        $scope.newUserRoleOptions =[{"id":"","label":"Select Role","value":"Select Role"},{"id":1,"label":"role3","value":"vce_vce_pod55_role3","productList":{"product 3":"vce:vce:pod55"}},{"id":3,"label":"vcetest","value":"vce_vce_pod55_vcetest","productList":{"product 3":"vce:vce:pod55","product1":"vce:vce:pod53"}},{"id":5,"label":"admin","value":"vce_vce_pod55_admin","productList":{"product 3":"vce:vce:pod55","product1":"vce:vce:pod53"}},{"id":6,"label":"test123","value":"vce_vce_pod55_test123","productList":{"product 3":"vce:vce:pod55"}},{"id":7,"label":"teste","value":"vce_vce_pod55_teste","productList":{"product 3":"vce:vce:pod55"}},{"id":8,"label":"test234","value":"vce_vce_pod55_test234","productList":{"product 3":"vce:vce:pod55"}},{"id":9,"label":"testrole2","value":"vce_vce_pod55_testrole2","productList":{"product 3":"vce:vce:pod55"}}];
        var data = {
            active:true,
            city:"Bangalore",
            country:"India",
            dashboard_admin:false,
            deleted:"notDeleted",
            department:"XYZ",
            email:"anish.mvj1@gmail.com",
            first_name:"Anish",
            last_name:"Kumar",
            mps_def:"springpath:springpath:pod53",
            name:"Anish Kumar",
            org:"springpath",
            phone:"8105368665",
            realm_def:"uir.glassbeam.com",
            report_usage:false,
            role:"testrole5",
            selected:false,
            state:"Karnataka",
            token_id:"$2a$10$VTNNhuQdVFDZk0TNU2FVP.rIVU/VobyG.gEfoZO1DthQmyXTc6etO",
            url_def:"/apps/app/index.html",
            wb_user_name:"Generic"
        };
        $scope.editRow(data);
    }));
});
describe('MainCtrl : ', function() {

    var manufacturer, product, schema, umsDomain;

    beforeEach(module('gbAdminApp.controllers', 'gbAdminApp.services', 'gbAdminApp.globalservices', 'ngCookies', 'ngDraggable',	'ngAnimate', 'ngRoute',	'ngTable', function($provide) {
        $provide.value('infoserverDomain', 'undefined');
        $provide.value('useLocal', true);

        manufacturer = 'undefined';
        product = 'undefined';
        schema = 'undefined';
        umsDomain = 'undefined';
    }));

    it('Should Have MainCtrl', inject(function($rootScope, $controller) {
        var $scope = $rootScope.$new();
        $controller('MainCtrl', {
            '$scope' : $scope
        });
    }));
});