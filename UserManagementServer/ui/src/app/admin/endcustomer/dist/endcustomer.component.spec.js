"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var core_1 = require("@angular/core");
var testing_2 = require("@angular/router/testing");
var testing_3 = require("@angular/platform-browser-dynamic/testing");
var endcustomer_component_1 = require("./endcustomer.component");
var loader_component_1 = require("../../shared/loader/loader.component");
var confirmation_popup_component_1 = require("../../shared/confirmation-popup/confirmation-popup.component");
var forms_1 = require("@angular/forms");
var testing_4 = require("@angular/common/http/testing");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ng_bootstrap_2 = require("@ng-bootstrap/ng-bootstrap");
var admin_service_1 = require("../../services/admin/admin.service");
var rxjs_1 = require("rxjs");
var _ = require("lodash");
var global_1 = require("../endcustomer/global");
var sortable_directive_1 = require("../../shared/directives/sortable.directive");
describe('EndcustomerComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [forms_1.FormsModule, forms_1.ReactiveFormsModule, testing_4.HttpClientTestingModule, ng_bootstrap_1.NgbModule, testing_2.RouterTestingModule],
            providers: [ng_bootstrap_2.NgbModal],
            declarations: [endcustomer_component_1.EndcustomerComponent, loader_component_1.LoaderComponent, confirmation_popup_component_1.ConfirmationPopupComponent, sortable_directive_1.SortableDirective],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        })
            .overrideModule(testing_3.BrowserDynamicTestingModule, { set: { entryComponents: [confirmation_popup_component_1.ConfirmationPopupComponent] } })
            .compileComponents();
    }));
    beforeEach(function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        document.cookie = "mps='siemens:siemens:podui'";
        fixture = testing_1.TestBed.createComponent(endcustomer_component_1.EndcustomerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.endCustomerFilterData = [{ "columnName": "created_by", "columnTitle": "Created By", "data": [{ "name": "siemens@glassbeam.com", "selected": false }, { "name": "nishanth.prabhu@glassbeam.com", "selected": true }], "multiselect": true, "isDateType": false, "showSearch": false, "enabled": false }, { "columnName": "updated_on", "columnTitle": "Modified On", "data": [{ "name": "Last 24 Hrs", "value": "24hrs", "checked": false }, { "name": "Last Week", "value": "week", "checked": false }, { "name": "Last Month", "value": "month", "checked": false }, { "name": "Last 6 Months", "value": "6month", "checked": false }], "multiselect": false, "isDateType": true, "showSearch": false, "enabled": false }];
        component.endCustomerList = [{ "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Group A", "serial_number": ["CT64492", "CT60503", "CT65225", "CT64352"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-15T05:49:47Z" }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Nis", "serial_number": ["CT64694", "CT64863"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-11T10:34:23Z" }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Nishanth", "serial_number": ["CT64103", "CT95899", "CT59711"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-20T10:58:40Z" }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Sam", "serial_number": ["CT60503", "CT64103", "CT64694", "CT64863"], "created_by": "nishanth.prabhu@glassbeam.com", "updated_on": "2019-11-20T11:50:55Z" }];
        service.loggedInUserDetails = { "user": [{ 'email': "siemensqa@glassbeam.com" }] };
        component.selectedSysIds = [
            {
                "sysId": "CT54644",
                "rowIndex": 0,
                "selected": false,
                "systemName": "NA",
                "compName": "NA",
                "hospName": "NA",
                "city": "NA",
                "country": "NA",
                "disabled": true
            },
            {
                "sysId": "760806SCOC",
                "rowIndex": 1,
                "selected": false,
                "systemName": "NA",
                "compName": "NA",
                "hospName": "NA",
                "city": "NA",
                "country": "NA",
                "disabled": true
            }
        ];
        component.groupedData = {
            "siemens/siemens/podui": [
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "G_4",
                    "serial_number": [
                        "760806SCOC",
                        "CT74925_AutoReport.lo",
                        "CT54644"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-20T14:10:35Z",
                    "group_name": [],
                    "rowIndex": 0,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "end customer 1",
                    "serial_number": [
                        "CT122075",
                        "CT67106"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-07-16T13:19:51Z",
                    "group_name": [],
                    "rowIndex": 1,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "G_1",
                    "serial_number": [
                        "XA154459_AxSysUseData.da",
                        "XA154459_10144184_zipArchive_2020_1_14_16_2",
                        "XA154459_20200114_EnvironmentLog.xm",
                        "CT65316",
                        "CT54644",
                        "760806SCOC",
                        "CT67331",
                        "CT67205",
                        "CT95280"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-20T14:00:46Z",
                    "group_name": [],
                    "rowIndex": 2,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "g_1",
                    "serial_number": [
                        "XA154459_AxSysUseData.da",
                        "CT54644",
                        "XA154459_20200114_EnvironmentLog.xm",
                        "CT74925_AutoReport.lo"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-20T15:06:05Z",
                    "group_name": [],
                    "rowIndex": 4,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "G_2",
                    "serial_number": [
                        "760806SCOC",
                        "CT54644"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-20T14:05:04Z",
                    "group_name": [],
                    "rowIndex": 5,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "new_ext2",
                    "serial_number": [
                        "CT73127",
                        "CT73361",
                        "CT73514",
                        "CT96044"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-11T11:50:10Z",
                    "group_name": [],
                    "rowIndex": 6,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "new_ext1",
                    "serial_number": [
                        "CT95491",
                        "CT75824",
                        "CT73455",
                        "CT73008",
                        "CT67400"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-11T11:33:01Z",
                    "group_name": [],
                    "rowIndex": 7,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "g_2",
                    "serial_number": [
                        "CT74925_AutoReport.lo",
                        "XA154459_20200114_EnvironmentLog.xm",
                        "CT74925_TubeHistoryHeader_A.tx",
                        "XA154459_AxSysUseData.da",
                        "CT54644",
                        "CT60510_TubeHistoryHeader_A.tx"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-20T15:06:30Z",
                    "group_name": [],
                    "rowIndex": 8,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "G_3",
                    "serial_number": [
                        "CT54644",
                        "760806SCOC"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-20T14:08:42Z",
                    "group_name": [],
                    "rowIndex": 9,
                    "selected": false,
                    "disabled": false
                },
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podui",
                    "endcustomer_name": "new_ext4",
                    "serial_number": [
                        "CT67331",
                        "CT67205",
                        "CT95280",
                        "CT65316"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-11T12:05:19Z",
                    "group_name": [],
                    "rowIndex": 10,
                    "selected": false,
                    "disabled": false
                }
            ],
            "siemens/siemens/podv10": [
                {
                    "mfr": "siemens",
                    "prod": "siemens",
                    "sch": "podv10",
                    "endcustomer_name": "temp_1",
                    "serial_number": [
                        "XA154459_20200114_EnvironmentLog.xm",
                        "CT54644"
                    ],
                    "created_by": "siemensqa@glassbeam.com",
                    "updated_on": "2020-08-20T15:04:32Z",
                    "group_name": [],
                    "rowIndex": 3,
                    "selected": false,
                    "disabled": false
                }
            ]
        };
    });
    afterEach(function () {
        fixture.destroy();
    });
    it('Component created', function () {
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
        expect(component).toBeTruthy();
    });
    it('fetch end customer list ', function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        service.adminRole = { "name": "siemens_siemens_podui_admin", "realm_uidomain": { "qaui": "qaui.glassbeam.com", "autostage": "autostage.glassbeam.com" }, "mps_uidomain": { "siemens:siemens:podui": "qaui.glassbeam.com", "siemens:siemens:pod": "qaui.glassbeam.com", "siemens:siemens:prod": "qaui.glassbeam.com" }, "two_auth_support": [], "featureData": [{ "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin", "featuresDis": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "podui"], "name": "SIEMENS-POD", "selected": false }, { "features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator", "featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "pod"], "name": "Siemens prod60", "selected": false }, { "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "prod"], "name": "Siemens prodv10", "selected": false }], "featuresAssigned": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "prodAssigned": ["SIEMENS-POD", "Siemens prod60", "Siemens prodv10"], "selected": false, "colapsed": true, "DisName": "admin", "roleType": "Internal" };
        service.userList = [
            {
                "email": "clinsightintqa@glassbeam.com",
                "active": true,
                "first_name": "priyanka",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_clinsightint",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-04-27T08:52:53Z",
                "modified_on": null,
                "last_login": "2020-04-27T11:24:08Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "clinsightint",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "dash_admin1@glassbeam.com",
                "active": true,
                "first_name": "fname",
                "last_name": "lname",
                "wb_user_name": "dash_admin1@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": true,
                "phone": "1234567890",
                "city": "city",
                "state": "kar",
                "country": "Country",
                "department": "",
                "created_on": "2016-09-06T07:09:13Z",
                "modified_on": null,
                "last_login": "2020-06-25T07:19:59Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "dash_view1@glassbeam.com",
                "active": true,
                "first_name": "fname",
                "last_name": "lname",
                "wb_user_name": "generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "1234567890",
                "city": "city",
                "state": "kar",
                "country": "Country",
                "department": "",
                "created_on": "2016-09-06T07:09:13Z",
                "modified_on": null,
                "last_login": "2018-11-27T11:14:22Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "dobhal_ritesh@rediffmail.com",
                "active": false,
                "first_name": "Ritesh",
                "last_name": "Dobhal",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_testrole1",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podv10",
                "dashboard_admin": false,
                "phone": "+91-09611209534",
                "city": "Bangalore",
                "state": "Karnataka",
                "country": "",
                "department": "",
                "created_on": "2020-06-26T07:48:03Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "testrole1",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "exttest@glassbeam.com",
                "active": true,
                "first_name": "External",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_extrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "GroupA",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-10T12:03:54Z",
                "modified_on": null,
                "last_login": "2020-06-15T07:25:08Z",
                "is_external": true,
                "user_state": "ACTIVE",
                "roleName": "extrole",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "krishnadkul+0789@gmail.com",
                "active": false,
                "first_name": "Niitn",
                "last_name": "kul",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "dept",
                "created_on": "2020-05-04T06:27:11Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "krishnadkul+122@gmail.com",
                "active": false,
                "first_name": "test",
                "last_name": "last",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_testrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-22T10:49:33Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "testrole",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "krishnadkul+124@gmail.com",
                "active": true,
                "first_name": "Canon",
                "last_name": "qa",
                "wb_user_name": "krishnadkul+124@gmail.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_canonextrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "GroupA",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "stateaa",
                "country": "",
                "department": "dept",
                "created_on": "2020-06-15T07:54:44Z",
                "modified_on": "2020-06-26T07:47:08Z",
                "last_login": "2020-06-24T13:02:53Z",
                "is_external": true,
                "user_state": "ACTIVE",
                "roleName": "canonextrole",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "laref57835@nsabdev.com",
                "active": true,
                "first_name": "TestUser1",
                "last_name": "",
                "wb_user_name": "laref57835@nsabdev.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_admin",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-15T08:36:42Z",
                "modified_on": null,
                "last_login": "2020-06-15T08:44:59Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "admin",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "nodashboard@glassbeam.com",
                "active": true,
                "first_name": "fnamenodb",
                "last_name": "lname",
                "wb_user_name": "nodashboard@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_nodash",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "NA",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": null,
                "last_login": "2020-06-18T20:20:28Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "nodash",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "password@test.com",
                "active": false,
                "first_name": "password",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-18T08:26:46Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_changepassword@glassbeam.com",
                "active": true,
                "first_name": "fnamechpwd",
                "last_name": "lname",
                "wb_user_name": "siemens_changepassword@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_changepwd",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "NA",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": "2020-06-18T08:27:11Z",
                "last_login": "2020-06-18T19:33:58Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "changepwd",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_rc2@glassbeam.com",
                "active": true,
                "first_name": "fnamercTwo",
                "last_name": "lnamerc",
                "wb_user_name": "siemens_rc2@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_auto_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "NA",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": "2020-06-22T11:42:50Z",
                "last_login": "2020-06-18T18:19:34Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "auto_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_rc@glassbeam.com",
                "active": true,
                "first_name": "fnamerc",
                "last_name": "lnamerc",
                "wb_user_name": "siemens_rc@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_auto_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "NA",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": "2020-06-22T11:37:15Z",
                "last_login": "2020-06-24T10:32:59Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "auto_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_support@glassbeam.com",
                "active": true,
                "first_name": "Simens",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "X",
                "country": "",
                "department": "D",
                "created_on": "2020-01-29T06:06:30Z",
                "modified_on": "2020-06-04T18:48:02Z",
                "last_login": "2020-05-13T15:08:24Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_view@glassbeam.com",
                "active": true,
                "first_name": "fnameview",
                "last_name": "lnameview",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": "2020-06-17T08:15:01Z",
                "last_login": "2020-06-18T21:20:11Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemensqa@glassbeam.com",
                "active": true,
                "first_name": "fname",
                "last_name": "lname",
                "wb_user_name": "siemensqa@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_admin",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "1234567890",
                "city": "city",
                "state": "kar",
                "country": "Country",
                "department": "",
                "created_on": "2020-04-15T10:34:18Z",
                "modified_on": null,
                "last_login": "2020-06-29T03:44:02Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "admin",
                "adminUser": true,
                "selected": false
            },
            {
                "email": "sneha.ramnath@glassbeam.com",
                "active": true,
                "first_name": "Sneha",
                "last_name": "R",
                "wb_user_name": "sneha.ramnath@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_admin",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "+666-8999",
                "city": "fghjk",
                "state": "fghjk",
                "country": "ghjk",
                "department": "cvbnm",
                "created_on": "2020-06-24T08:37:11Z",
                "modified_on": null,
                "last_login": "2020-06-24T08:37:26Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "admin",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "sneha.ramnath@gmail.com",
                "active": false,
                "first_name": "Sneha",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_changepwd",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "Bangalore",
                "state": "Karnataka",
                "country": "",
                "department": "",
                "created_on": "2020-05-29T09:52:45Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "changepwd",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "tejoy23607@mailnd7.com",
                "active": true,
                "first_name": "ExtUser1",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_extrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "GroupA",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-09T10:32:21Z",
                "modified_on": null,
                "last_login": "2020-06-09T10:32:33Z",
                "is_external": true,
                "user_state": "ACTIVE",
                "roleName": "extrole",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "testadmin@testing.com",
                "active": true,
                "first_name": "fnamewb",
                "last_name": "lnamewb",
                "wb_user_name": "testadmin@testing.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_rc_wb",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-07T02:47:51Z",
                "modified_on": null,
                "last_login": "2020-06-24T07:36:58Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "rc_wb",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "testuser2@glassbeam.net",
                "active": false,
                "first_name": "testuser2",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_testrole1",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:pod",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-18T09:38:51Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "testrole1",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "testuser@glassbeam.net",
                "active": false,
                "first_name": "testUser",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_testrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podv10",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-18T09:36:08Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "testrole",
                "adminUser": false,
                "selected": false
            }
        ];
        var res = '{"Status":"Success","Msg":"List all information for a user","Data":[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["ct64724","ct60111","ct60279","ct66930","ct64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z"}]}';
        spyOn(service, 'getendCustomerList').and.returnValue(rxjs_1.of(JSON.parse(res)));
        component.getCustList();
        expect(service.getendCustomerList).toHaveBeenCalled();
        expect(component.endCustomerList.length).toEqual(1);
        expect(component.collectionSize).toEqual(1);
    });
    it('process Product list ', function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        service.adminRole = { "name": "siemens_siemens_podui_admin", "realm_uidomain": { "qaui": "qaui.glassbeam.com", "autostage": "autostage.glassbeam.com" }, "mps_uidomain": { "siemens:siemens:podui": "qaui.glassbeam.com", "siemens:siemens:pod": "qaui.glassbeam.com", "siemens:siemens:prod": "qaui.glassbeam.com" }, "two_auth_support": [], "featureData": [{ "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin", "featuresDis": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "podui"], "name": "SIEMENS-POD", "selected": false }, { "features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator", "featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "pod"], "name": "Siemens prod60", "selected": false }, { "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "prod"], "name": "Siemens prodv10", "selected": false }], "featuresAssigned": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "prodAssigned": ["SIEMENS-POD", "Siemens prod60", "Siemens prodv10"], "selected": false, "colapsed": true, "DisName": "admin", "roleType": "Internal" };
        var res = { "SIEMENS-POD": "siemens:siemens:podui", "Siemens prod60": "siemens:siemens:pod", "Siemens prodv10": "siemens:siemens:prod" };
        spyOn(component, 'processProductList').and.returnValue(res);
        component.processProductList();
        expect(component.processProductList).toHaveBeenCalled();
    });
    it('fetch empty end customer list ', function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        service.adminRole = { "name": "siemens_siemens_podui_admin", "realm_uidomain": { "qaui": "qaui.glassbeam.com", "autostage": "autostage.glassbeam.com" }, "mps_uidomain": { "siemens:siemens:podui": "qaui.glassbeam.com", "siemens:siemens:pod": "qaui.glassbeam.com", "siemens:siemens:prod": "qaui.glassbeam.com" }, "two_auth_support": [], "featureData": [{ "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin", "featuresDis": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "podui"], "name": "SIEMENS-POD", "selected": false }, { "features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator", "featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "pod"], "name": "Siemens prod60", "selected": false }, { "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "prod"], "name": "Siemens prodv10", "selected": false }], "featuresAssigned": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "prodAssigned": ["SIEMENS-POD", "Siemens prod60", "Siemens prodv10"], "selected": false, "colapsed": true, "DisName": "admin", "roleType": "Internal" };
        service.userList = [
            {
                "email": "clinsightintqa@glassbeam.com",
                "active": true,
                "first_name": "priyanka",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_clinsightint",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-04-27T08:52:53Z",
                "modified_on": null,
                "last_login": "2020-04-27T11:24:08Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "clinsightint",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "dash_admin1@glassbeam.com",
                "active": true,
                "first_name": "fname",
                "last_name": "lname",
                "wb_user_name": "dash_admin1@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": true,
                "phone": "1234567890",
                "city": "city",
                "state": "kar",
                "country": "Country",
                "department": "",
                "created_on": "2016-09-06T07:09:13Z",
                "modified_on": null,
                "last_login": "2020-06-25T07:19:59Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "dash_view1@glassbeam.com",
                "active": true,
                "first_name": "fname",
                "last_name": "lname",
                "wb_user_name": "generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "1234567890",
                "city": "city",
                "state": "kar",
                "country": "Country",
                "department": "",
                "created_on": "2016-09-06T07:09:13Z",
                "modified_on": null,
                "last_login": "2018-11-27T11:14:22Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "dobhal_ritesh@rediffmail.com",
                "active": false,
                "first_name": "Ritesh",
                "last_name": "Dobhal",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_testrole1",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podv10",
                "dashboard_admin": false,
                "phone": "+91-09611209534",
                "city": "Bangalore",
                "state": "Karnataka",
                "country": "",
                "department": "",
                "created_on": "2020-06-26T07:48:03Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "testrole1",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "exttest@glassbeam.com",
                "active": true,
                "first_name": "External",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_extrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "GroupA",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-10T12:03:54Z",
                "modified_on": null,
                "last_login": "2020-06-15T07:25:08Z",
                "is_external": true,
                "user_state": "ACTIVE",
                "roleName": "extrole",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "krishnadkul+0789@gmail.com",
                "active": false,
                "first_name": "Niitn",
                "last_name": "kul",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "dept",
                "created_on": "2020-05-04T06:27:11Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "krishnadkul+122@gmail.com",
                "active": false,
                "first_name": "test",
                "last_name": "last",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_testrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-22T10:49:33Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "testrole",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "krishnadkul+124@gmail.com",
                "active": true,
                "first_name": "Canon",
                "last_name": "qa",
                "wb_user_name": "krishnadkul+124@gmail.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_canonextrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "GroupA",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "stateaa",
                "country": "",
                "department": "dept",
                "created_on": "2020-06-15T07:54:44Z",
                "modified_on": "2020-06-26T07:47:08Z",
                "last_login": "2020-06-24T13:02:53Z",
                "is_external": true,
                "user_state": "ACTIVE",
                "roleName": "canonextrole",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "laref57835@nsabdev.com",
                "active": true,
                "first_name": "TestUser1",
                "last_name": "",
                "wb_user_name": "laref57835@nsabdev.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_admin",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-15T08:36:42Z",
                "modified_on": null,
                "last_login": "2020-06-15T08:44:59Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "admin",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "nodashboard@glassbeam.com",
                "active": true,
                "first_name": "fnamenodb",
                "last_name": "lname",
                "wb_user_name": "nodashboard@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_nodash",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "NA",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": null,
                "last_login": "2020-06-18T20:20:28Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "nodash",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "password@test.com",
                "active": false,
                "first_name": "password",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-18T08:26:46Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_changepassword@glassbeam.com",
                "active": true,
                "first_name": "fnamechpwd",
                "last_name": "lname",
                "wb_user_name": "siemens_changepassword@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_changepwd",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "NA",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": "2020-06-18T08:27:11Z",
                "last_login": "2020-06-18T19:33:58Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "changepwd",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_rc2@glassbeam.com",
                "active": true,
                "first_name": "fnamercTwo",
                "last_name": "lnamerc",
                "wb_user_name": "siemens_rc2@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_auto_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "NA",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": "2020-06-22T11:42:50Z",
                "last_login": "2020-06-18T18:19:34Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "auto_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_rc@glassbeam.com",
                "active": true,
                "first_name": "fnamerc",
                "last_name": "lnamerc",
                "wb_user_name": "siemens_rc@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_auto_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "NA",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": "2020-06-22T11:37:15Z",
                "last_login": "2020-06-24T10:32:59Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "auto_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_support@glassbeam.com",
                "active": true,
                "first_name": "Simens",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "X",
                "country": "",
                "department": "D",
                "created_on": "2020-01-29T06:06:30Z",
                "modified_on": "2020-06-04T18:48:02Z",
                "last_login": "2020-05-13T15:08:24Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemens_view@glassbeam.com",
                "active": true,
                "first_name": "fnameview",
                "last_name": "lnameview",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_non_rc",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "City",
                "state": "Kar",
                "country": "Country",
                "department": "Department",
                "created_on": "2020-04-30T08:30:13Z",
                "modified_on": "2020-06-17T08:15:01Z",
                "last_login": "2020-06-18T21:20:11Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "non_rc",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "siemensqa@glassbeam.com",
                "active": true,
                "first_name": "fname",
                "last_name": "lname",
                "wb_user_name": "siemensqa@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_admin",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "1234567890",
                "city": "city",
                "state": "kar",
                "country": "Country",
                "department": "",
                "created_on": "2020-04-15T10:34:18Z",
                "modified_on": null,
                "last_login": "2020-06-29T03:44:02Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "admin",
                "adminUser": true,
                "selected": false
            },
            {
                "email": "sneha.ramnath@glassbeam.com",
                "active": true,
                "first_name": "Sneha",
                "last_name": "R",
                "wb_user_name": "sneha.ramnath@glassbeam.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_admin",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "+666-8999",
                "city": "fghjk",
                "state": "fghjk",
                "country": "ghjk",
                "department": "cvbnm",
                "created_on": "2020-06-24T08:37:11Z",
                "modified_on": null,
                "last_login": "2020-06-24T08:37:26Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "admin",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "sneha.ramnath@gmail.com",
                "active": false,
                "first_name": "Sneha",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_changepwd",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "Bangalore",
                "state": "Karnataka",
                "country": "",
                "department": "",
                "created_on": "2020-05-29T09:52:45Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "changepwd",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "tejoy23607@mailnd7.com",
                "active": true,
                "first_name": "ExtUser1",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_extrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "GroupA",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-09T10:32:21Z",
                "modified_on": null,
                "last_login": "2020-06-09T10:32:33Z",
                "is_external": true,
                "user_state": "ACTIVE",
                "roleName": "extrole",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "testadmin@testing.com",
                "active": true,
                "first_name": "fnamewb",
                "last_name": "lnamewb",
                "wb_user_name": "testadmin@testing.com",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_rc_wb",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podui",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-07T02:47:51Z",
                "modified_on": null,
                "last_login": "2020-06-24T07:36:58Z",
                "is_external": false,
                "user_state": "ACTIVE",
                "roleName": "rc_wb",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "testuser2@glassbeam.net",
                "active": false,
                "first_name": "testuser2",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_testrole1",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:pod",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-18T09:38:51Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "testrole1",
                "adminUser": false,
                "selected": false
            },
            {
                "email": "testuser@glassbeam.net",
                "active": false,
                "first_name": "testUser",
                "last_name": "",
                "wb_user_name": "Generic",
                "sso": false,
                "org": "siemens",
                "role": "siemens_siemens_podui_testrole",
                "realm_def": "qaui.glassbeam.com",
                "end_customer": "",
                "mps_def": "siemens:siemens:podv10",
                "dashboard_admin": false,
                "phone": "",
                "city": "",
                "state": "",
                "country": "",
                "department": "",
                "created_on": "2020-06-18T09:36:08Z",
                "modified_on": null,
                "last_login": null,
                "is_external": false,
                "user_state": "INVITED",
                "roleName": "testrole",
                "adminUser": false,
                "selected": false
            }
        ];
        var res = '{"Status":"Success","Msg":"List all information for a user","Data":[]}';
        spyOn(service, 'getendCustomerList').and.returnValue(rxjs_1.of(JSON.parse(res)));
        component.getCustList();
        expect(service.getendCustomerList).toHaveBeenCalled();
        expect(component.endCustomerList.length).toEqual(0);
        expect(component.collectionSize).toEqual(0);
        expect(component.initialEmpty).toBeTruthy();
    });
    it('End customer not selected', function () {
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
        component.allEndCustSelected();
        expect(component.isSelectAll).toEqual(false);
    });
    it('More than one customer and all are selected', function () {
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
        component.allEndCustSelected();
        expect(component.isSelectAll).toEqual(true);
    });
    it('getActionButtonDisable | Delete Button To Be Enabled', function () {
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
        var res = component.getActionButtonDisable(global_1.globalObj.delMultipleButton);
        expect(res).toBeFalsy();
    });
    it('getActionButtonDisable | Delete Button To Be Disabled', function () {
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
        var res = component.getActionButtonDisable(global_1.globalObj.delMultipleButton);
        expect(res).toBeTruthy();
    });
    it('getActionButtonDisable | Delete Button To Be Enabled', function () {
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
        var res = component.getActionButtonDisable(global_1.globalObj.delMultipleButton);
        expect(res).toBeFalsy();
    });
    it('getActionButtonDisable | Delete Button To Be Disabled', function () {
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
        var res = component.getActionButtonDisable(global_1.globalObj.delMultipleButton);
        expect(res).toBeFalsy();
    });
    it('getActionButtonDisable | Add sysId  Button to be  Enabled', function () {
        component.tempAddSysIdList = [
            {
                "sysId": "CT54644",
                "rowIndex": 0,
                "selected": false,
                "systemName": "NA",
                "compName": "NA",
                "hospName": "NA",
                "city": "NA",
                "country": "NA",
                "disabled": true
            },
            {
                "sysId": "760806SCOC",
                "rowIndex": 1,
                "selected": false,
                "systemName": "NA",
                "compName": "NA",
                "hospName": "NA",
                "city": "NA",
                "country": "NA",
                "disabled": true
            }
        ];
        // component.addEditEndCustForm.patchValue({
        //   availableSelectedSysIdname: ["CT123", "CT321"]
        // });
        var res = component.getActionButtonDisable(global_1.globalObj.addSys);
        expect(res).toBeFalsy();
    });
    it('getActionButtonDisable | Add sysId Button To Be Disabled', function () {
        component.selectedSysIds = [];
        // component.addEditEndCustForm.patchValue({
        //   availableSelectedSysIdname: []
        // });
        var res = component.getActionButtonDisable(global_1.globalObj.addSys);
        expect(res).toBeUndefined();
    });
    it('getActionButtonDisable | Remove sysId  Button to be  Enabled', function () {
        component.selectedSysIds = [
            {
                "sysId": "CT54644",
                "rowIndex": 0,
                "selected": false,
                "systemName": "NA",
                "compName": "NA",
                "hospName": "NA",
                "city": "NA",
                "country": "NA",
                "disabled": true
            },
            {
                "sysId": "760806SCOC",
                "rowIndex": 1,
                "selected": false,
                "systemName": "NA",
                "compName": "NA",
                "hospName": "NA",
                "city": "NA",
                "country": "NA",
                "disabled": true
            }
        ];
        // component.addEditEndCustForm.patchValue({
        //   SelectedSysIdname: ["CT123", "CT321"]
        // });
        var res = component.getActionButtonDisable(global_1.globalObj.removeSys);
        expect(res).toBeFalsy();
    });
    it('getActionButtonDisable | Remove sysId Button To Be Disabled', function () {
        component.tempRemoveSysIdList = [];
        // component.addEditEndCustForm.patchValue({
        //   SelectedSysIdname: []
        // });
        var res = component.getActionButtonDisable(global_1.globalObj.removeSys);
        expect(res).toBeUndefined();
    });
    it('openModal | ADD ENDCUSTOMER', function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        service.adminRole = { "name": "siemens_siemens_podui_admin", "realm_uidomain": { "qaui": "qaui.glassbeam.com", "autostage": "autostage.glassbeam.com" }, "mps_uidomain": { "siemens:siemens:podui": "qaui.glassbeam.com", "siemens:siemens:pod": "qaui.glassbeam.com", "siemens:siemens:prod": "qaui.glassbeam.com" }, "two_auth_support": [], "featureData": [{ "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin", "featuresDis": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "podui"], "name": "SIEMENS-POD", "selected": false }, { "features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator", "featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "pod"], "name": "Siemens prod60", "selected": false }, { "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "prod"], "name": "Siemens prodv10", "selected": false }], "featuresAssigned": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "prodAssigned": ["SIEMENS-POD", "Siemens prod60", "Siemens prodv10"], "selected": false, "colapsed": true, "DisName": "admin", "roleType": "Internal" };
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
        component.openModal('addeditendcust', global_1.globalObj.addEndCustomerType, '');
        expect(component.modalHeader).toEqual(global_1.globalObj.addEndCustomerMsg);
        expect(component.showSysIdDiv).toEqual(false);
    });
    it('openModal | Edit ENDCUSTOMER', function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        service.adminRole = { "name": "siemens_siemens_podui_admin", "realm_uidomain": { "qaui": "qaui.glassbeam.com", "autostage": "autostage.glassbeam.com" }, "mps_uidomain": { "siemens:siemens:podui": "qaui.glassbeam.com", "siemens:siemens:pod": "qaui.glassbeam.com", "siemens:siemens:prod": "qaui.glassbeam.com" }, "two_auth_support": [], "featureData": [{ "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin", "featuresDis": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "podui"], "name": "SIEMENS-POD", "selected": false }, { "features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator", "featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "pod"], "name": "Siemens prod60", "selected": false }, { "features": "Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin", "featureKey": "dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin", "featuresDis": ["Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rules & Alerts", "Workbench"], "mps": ["siemens", "siemens", "prod"], "name": "Siemens prodv10", "selected": false }], "featuresAssigned": ["Admin", "Creator", "Dashboard Admin", "Dashboards", "Explorer", "File Upload", "Health Check", "Logvault", "Rule Creator", "Rules & Alerts", "Workbench"], "prodAssigned": ["SIEMENS-POD", "Siemens prod60", "Siemens prodv10"], "selected": false, "colapsed": true, "DisName": "admin", "roleType": "Internal" };
        var res = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":false},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":false},{"name":"CT66930","selected":false}]');
        var endCust = JSON.parse('{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false, "group_name": []}');
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false, "group_name": []},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false, "group_name": ["g1", "g2"]}]');
        spyOn(service, 'getSysList').and.returnValue(rxjs_1.of(res));
        component.openModal('addeditendcust', global_1.globalObj.editEndCustomerType, endCust);
        expect(component.modalHeader).toEqual(global_1.globalObj.editEndCustomerMsg);
        expect(component.editEndUserMode).toEqual(true);
        expect(component.sysidLoading).toEqual(false);
    });
    it('TEST PRODUCT CHANGE METHOD', function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        var res = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":false},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":false},{"name":"CT66930","selected":false}]');
        spyOn(service, 'getSysList').and.returnValue(rxjs_1.of(res));
        component.endCustomerProductList = {
            "Siemens": "siemens:siemens:podui",
            "Siemens POD": "siemens:siemens:pod"
        };
        component.addEditEndCustForm.patchValue({
            prodName: 'Siemens'
        });
        component.onProdChange();
        expect(component.showSysIdDiv).toEqual(true);
    });
    it('ADD SYSID METHOD ', function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        service.unavailableSysids = [];
        component.selectedSysIds = [];
        // component.unavailableSysids = [];
        component.sysIdList = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":false},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":false},{"name":"CT66930","selected":false}]');
        component.selectedSysIds = [
            {
                "sysId": "CT54644",
                "rowIndex": 0,
                "selected": false,
                "systemName": "NA",
                "compName": "NA",
                "hospName": "NA",
                "city": "NA",
                "country": "NA",
                "disabled": true
            },
            {
                "sysId": "760806SCOC",
                "rowIndex": 1,
                "selected": false,
                "systemName": "NA",
                "compName": "NA",
                "hospName": "NA",
                "city": "NA",
                "country": "NA",
                "disabled": true
            }
        ];
        component.addSysIds();
        expect(component.selectedSysIds.length).toBeGreaterThanOrEqual(1);
        // expect(component.unavailableSysids.length).toBeGreaterThanOrEqual(1);
    });
    it('REMOVE SYSID METHOD ', function () {
        component.addEditEndCustForm.patchValue({
            SelectedSysIdname: ["CT60503", "CT64103"]
        });
        component.sysIdList = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":false},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":false},{"name":"CT66930","selected":false}]');
        component.sysIdsToRemove = [];
        // component.unavailableSysids = ["CT60503", "CT64103"];
        component.removeSysIds();
        expect(component.tempAddSysIdList.length).toEqual(0);
    });
    it('REMOVE SYSID METHOD sub function ', function () {
        component.sysIdsToRemove = [{ "name": "CT60503" }, { "name": "CT64103" }];
        // component.unavailableSysids = ["CT60503", "CT64103"];
        component.sysIdsToRemove.map(function (item) {
            component.removeItemFromList(component.selectedSysIds, item);
        });
        component.selectedSysIds = [];
        expect(component.selectedSysIds.length).toEqual(0);
    });
    it('OpenConfirmation | Delete Multiple EndCustomer', function () {
        var modalservice = testing_1.TestBed.get(ng_bootstrap_2.NgbModal);
        component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
        component.openConfirmation(global_1.globalObj.deleteMultiple, '');
        expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.msg.length).toBeGreaterThan(0);
    });
    it('OpenConfirmation | Delete Single EndCustomer', function () {
        var modalservice = testing_1.TestBed.get(ng_bootstrap_2.NgbModal);
        var data = JSON.parse('{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true}');
        component.openConfirmation(global_1.globalObj.deleteSingle, data);
        expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.msg.length).toBeGreaterThan(1);
    });
    it('addEndCustSubmit | Add End Customer > No Name Field > Form Should Be invalid', function () {
        component.addEndCustSubmit();
        expect(component.addEditEndCustForm.controls['endCustomerName'].status).toEqual('INVALID');
        expect(component.addEditEndCustForm.controls['prodName'].status).toEqual('INVALID');
        // expect(component.addEditEndCustForm.controls['SelectedSysIdname'].status).toEqual('INVALID');
        expect(component.addEditEndCustForm.status).toEqual('INVALID');
        expect(component.submitted).toEqual(true);
    });
    it('addEndCustSubmit | Add End Customer > Name Field > No Product name > Form Should Be invalid', function () {
        component.addEditEndCustForm.patchValue({
            endCustomerName: "NIshanth"
        });
        component.addEndCustSubmit();
        expect(component.addEditEndCustForm.controls['prodName'].status).toEqual('INVALID');
        // expect(component.addEditEndCustForm.controls['SelectedSysIdname'].status).toEqual('INVALID');
        expect(component.addEditEndCustForm.status).toEqual('INVALID');
        expect(component.submitted).toEqual(true);
    });
    it('addEndCustSubmit | Add End Customer > Duplicate Name', function () {
        component.addEditEndCustForm.patchValue({
            endCustomerName: "Nishanth",
            prodName: "Siemens",
            SelectedSysIdname: ["CT123", "CT4567"]
        });
        component.editEndUserMode = false;
        component.endCustomerNameMap = ["Nishanth", "Anish"];
        component.addEndCustSubmit();
        expect(component.submitted).toEqual(true);
    });
    it('addEndCustSubmit | Add End Customer > Duplicate Name', function () {
        component.addEditEndCustForm.patchValue({
            endCustomerName: "Nishanth",
            prodName: "Siemens",
            SelectedSysIdname: ["CT123", "CT4567"]
        });
        component.editEndUserMode = false;
        component.endCustomerNameMap = ["Nishanth", "Anish"];
        component.addEndCustSubmit();
        expect(component.submitted).toEqual(true);
    });
    it('ADD  END CUSTOMER API CALL', function () {
        //let postData =  {"endcustomer_name":"Nishanth","serial_number":"CT65493,CT59054,CT59334","created_by":"siemensqa@glassbeam.com","updated_on":""};
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        service.loggedInUserDetails = { "user": [{ 'email': "siemensqa@glassbeam.com" }] };
        var res = "siemensqa@glassbeam.com";
        spyOn(service, 'getLoggedEmail').and.returnValue(rxjs_1.of(res));
        component.addEditEndCustForm.patchValue({
            endCustomerName: "John",
            prodName: "Siemens",
            SelectedSysIdname: ["CT123", "CT4567"]
        });
        var api_success = { "Status": "Success", "Msg": "End customer Nishanth added successfully", "Data": "" };
        spyOn(service, 'post').and.returnValue(rxjs_1.of(api_success));
        component.editEndUserMode = false;
        component.endCustomerNameMap = ["Nishanth", "Anish"];
        component.addEndCustSubmit();
        expect(service.post).toHaveBeenCalled();
    });
    it('Edit  END CUSTOMER API CALL', function () {
        //let postData =  {"endcustomer_name":"Nishanth","serial_number":"CT65493,CT59054,CT59334","created_by":"siemensqa@glassbeam.com","updated_on":""};
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        service.loggedInUserDetails = { "user": [{ 'email': "siemensqa@glassbeam.com" }] };
        var res = "siemensqa@glassbeam.com";
        component.editEndUserMode = true;
        ;
        spyOn(service, 'getLoggedEmail').and.returnValue(rxjs_1.of(res));
        component.addEditEndCustForm.patchValue({
            endCustomerName: "John",
            prodName: "Siemens",
            SelectedSysIdname: ["CT123"]
        });
        var api_success = { "endcustomer_name": "Nishanth", "serial_number": "CT59054,CT59334", "created_by": "siemensqa@glassbeam.com", "updated_on": "2019-11-08 11:48:09" };
        spyOn(service, 'post').and.returnValue(rxjs_1.of(api_success));
        component.endCustomerNameMap = ["Nishanth", "Anish"];
        component.addEndCustSubmit();
        expect(service.post).toHaveBeenCalled();
    });
    it('Delete  End Customer API', function () {
        var service = testing_1.TestBed.get(admin_service_1.AdminService);
        var param = { "endcustomer_name": ["Nishanth"], "mps": "siemens:siemens:podui" };
        var api_success = { "Status": "Success", "Msg": "End customer(s) Nishanth deleted successfully", "Data": "" };
        spyOn(service, 'post').and.returnValue(rxjs_1.of(api_success));
        component.deleteEndCustomer(param);
        expect(service.post).toHaveBeenCalled();
    });
    it('tooltip', function () {
        var text = "";
        var e = { 'target': { 'offsetWidth': 390, 'scrollWidth': 400, 'title': '' } };
        spyOn(component, 'enableTootip');
        component.enableTootip(e, text);
        expect(e.target.title.length).toEqual(0);
        // expect(component.enableTootip).toHaveBeenCalled();
    });
    it('callsys', function () {
        component.editEndUserMode = false;
        component.addEditEndCustForm.value.prodName = "prodname";
        spyOn(component, 'getSysId');
        component.clearSearchText();
        expect(component.getSysId).toHaveBeenCalled();
    });
    it('clearSearchText', function () {
        component.editEndUserMode = false;
        component.addEditEndCustForm.value.prodName = "prodname";
        spyOn(component, 'getSysId');
        component.callsysid();
        expect(component.getSysId).toHaveBeenCalled();
    });
    it('getSelectedValues | if any selected', function () {
        var list = [{ "name": "siemens@glassbeam.com", "selected": false }, { "name": "nishanth.prabhu@glassbeam.com", "selected": true }];
        var res = component.getSelectedValues(list);
        expect(res.length).toBeGreaterThan(0);
    });
    it('getSelectedValues | if any selected', function () {
        var list = [{ "name": "siemens@glassbeam.com", "selected": false }, { "name": "nishanth.prabhu@glassbeam.com", "selected": false }];
        var res = component.getSelectedValues(list);
        expect(res.length).toEqual(0);
    });
    it('updateDataFilter | filter user data for multiselect true', function () {
        var columnVal = 'nishanth.prabhu@glassbeam.com';
        var selected = true;
        var multiselect = true;
        var actualData = [{ "name": "siemens@glassbeam.com", "selected": false }, { "name": "nishanth.prabhu@glassbeam.com", "selected": true }];
        component.endCustomerListCopy = _.cloneDeep(component.endCustomerList);
        spyOn(component, 'setFilterData');
        component.updateDataFilter(columnVal, selected, multiselect, actualData);
        expect(component.setFilterData).toHaveBeenCalled();
    });
    it('updateDataFilter | filter user data for multiselect false', function () {
        var columnVal = 'Last Week';
        var selected = true;
        var multiselect = false;
        var actualData = [{ "name": "Last 24 Hrs", "value": "24hrs", "checked": false }, { "name": "Last Week", "value": "week", "checked": false, "selected": true }, { "name": "Last Month", "value": "month", "checked": false }, { "name": "Last 6 Months", "value": "6month", "checked": false }];
        component.endCustomerListCopy = _.cloneDeep(component.endCustomerList);
        spyOn(component, 'setFilterData');
        component.updateDataFilter(columnVal, selected, multiselect, actualData);
        expect(component.setFilterData).toHaveBeenCalled();
    });
    it('setFilterData | Created By email', function () {
        var columnData = component.endCustomerList[3];
        var columnName = 'created_by';
        var columnValList = ['siemensqa@glassbeam.com', 'nishanth.prabhu@glassbeam.com'];
        var res = component.setFilterData(columnData, columnName, columnValList);
        expect(res).toBe(true);
    });
    it('setFilterData | time based filter', function () {
        var columnData = component.endCustomerList[0];
        var columnName = 'updated_on';
        var columnValList = ['Last 6 Months'];
        spyOn(component, 'isInTimerange').and.returnValue(true);
        var res = component.setFilterData(columnData, columnName, columnValList);
        expect(res).toBe(true);
    });
    it('isInTimerange Last 24 Hrs ', function () {
        var timeRange = "Last 24 Hrs";
        var targetDateTime = "2019-11-15T05:49:47Z";
        var result = component.isInTimerange(timeRange, targetDateTime);
        expect(result).toEqual(false);
    });
    it('isInTimerange Last Week ', function () {
        var timeRange = "Last Week";
        var targetDateTime = "2019-11-15T05:49:47Z";
        var result = component.isInTimerange(timeRange, targetDateTime);
        expect(result).toEqual(false);
    });
    xit('isInTimerange Last Month ', function () {
        var timeRange = "Last Month";
        var targetDateTime = "2019-11-15T05:49:47Z";
        var result = component.isInTimerange(timeRange, targetDateTime);
        expect(result).toEqual(true);
    });
    it('isInTimerange Last 6 Month', function () {
        var timeRange = "Last 6 Months";
        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() - 179);
        var targetDateTime = tempDate.toJSON();
        var result = component.isInTimerange(timeRange, targetDateTime);
        expect(result).toEqual(true);
    });
    it('resetFilter', function () {
        component.endCustomerFilterData = [{ "columnName": "created_by", "columnTitle": "Created By", "data": [{ "name": "siemens@glassbeam.com", "selected": true }, { "name": "nishanth.prabhu@glassbeam.com", "selected": false }], "multiselect": false, "isDateType": false, "showSearch": false, "appliedFilterCount": 1 }, { "columnName": "updated_on", "columnTitle": "Modified On", "data": [{ "name": "Last 24 Hrs", "value": "24hrs", "checked": false, "selected": false }, { "name": "Last Week", "value": "week", "checked": false, "selected": true }, { "name": "Last Month", "value": "month", "checked": false, "selected": false }, { "name": "Last 6 Months", "value": "6month", "checked": false, "selected": false }], "multiselect": false, "isDateType": true, "showSearch": false, "appliedFilterCount": 1 }];
        component.resetFilter();
        expect(component.filterCount).toEqual(0);
    });
    it('Onsort direction empty direction', function () {
        var param = {
            column: "created_by",
            direction: ""
        };
        component.onSort(param);
        expect(component.endCustomerList).toEqual(component.endCustomerList);
    });
    it('Onsort direction asc', function () {
        component.endCustomerList = [{ "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Group A", "serial_number": ["CT64492", "CT60503", "CT65225", "CT64352"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-15T05:49:47Z", "selected": false }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Nis", "serial_number": ["CT64694", "CT64863"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-11T10:34:23Z", "selected": false }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Nishanth", "serial_number": ["CT64103", "CT95899", "CT59711"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-20T10:58:40Z", "selected": false }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Sam", "serial_number": ["CT60503", "CT64103", "CT64694", "CT64863"], "created_by": "nishanth.prabhu@glassbeam.com", "updated_on": "2019-11-20T11:50:55Z", "selected": false }];
        var param = {
            column: "created_by",
            direction: "asc"
        };
        component.onSort(param);
        var res = [{ "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Sam", "serial_number": ["CT60503", "CT64103", "CT64694", "CT64863"], "created_by": "nishanth.prabhu@glassbeam.com", "updated_on": "2019-11-20T11:50:55Z", "selected": false }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Group A", "serial_number": ["CT64492", "CT60503", "CT65225", "CT64352"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-15T05:49:47Z", "selected": false }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Nis", "serial_number": ["CT64694", "CT64863"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-11T10:34:23Z", "selected": false }, { "mfr": "siemens", "prod": "siemens", "sch": "podui", "endcustomer_name": "Nishanth", "serial_number": ["CT64103", "CT95899", "CT59711"], "created_by": "siemens@glassbeam.com", "updated_on": "2019-11-20T10:58:40Z", "selected": false }];
        expect(component.endCustomerList).toEqual(res);
    });
});
