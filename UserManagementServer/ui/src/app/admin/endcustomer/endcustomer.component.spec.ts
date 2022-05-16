import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { EndcustomerComponent } from './endcustomer.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { ConfirmationPopupComponent } from '../../shared/confirmation-popup/confirmation-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../services/admin/admin.service';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { globalObj, searchIdAttributes } from '../endcustomer/global'
import * as messages from '../../shared/message';
import { MessagePopupComponent } from '../../shared/message-popup/message-popup.component';
import { SortableDirective, SortEvent } from '../../shared/directives/sortable.directive';
import { componentFactoryName } from '@angular/compiler';
import { group } from '@angular/animations';
import {onscreen} from '../../shared/onscreen';

describe('EndcustomerComponent', () => {
  let component: EndcustomerComponent;
  let fixture: ComponentFixture<EndcustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, NgbModule,RouterTestingModule ],
      providers: [NgbModal, onscreen],
      declarations: [EndcustomerComponent, LoaderComponent, ConfirmationPopupComponent, SortableDirective, MessagePopupComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmationPopupComponent, MessagePopupComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    let service = TestBed.get(AdminService);
    document.cookie = "mps='siemens:siemens:podui'";
    fixture = TestBed.createComponent(EndcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
   component.endCustomerFilterData = [{"columnName":"created_by","columnTitle":"Created By","data":[{"name":"siemens@glassbeam.com","selected":false},{"name":"nishanth.prabhu@glassbeam.com","selected":true}],"multiselect":true,"isDateType":false,"showSearch":false, "enabled":false},{"columnName":"updated_on","columnTitle":"Modified On","data":[{"name":"Last 24 Hrs","value":"24hrs","checked":false},{"name":"Last Week","value":"week","checked":false},{"name":"Last Month","value":"month","checked":false},{"name":"Last 6 Months","value":"6month","checked":false}],"multiselect":false,"isDateType":true,"showSearch":false, "enabled":false}];
   component.endCustomerList = [{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64492","CT60503","CT65225","CT64352"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-15T05:49:47Z"},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Nis","serial_number":["CT64694","CT64863"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-11T10:34:23Z"},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Nishanth","serial_number":["CT64103","CT95899","CT59711"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-20T10:58:40Z"},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Sam","serial_number":["CT60503","CT64103","CT64694","CT64863"],"created_by":"nishanth.prabhu@glassbeam.com","updated_on":"2019-11-20T11:50:55Z"}];
   service.loggedInUserDetails = {"user":[{'email':"siemensqa@glassbeam.com"}]}
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
  ]
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
  }

  component.groupPages = [
    {
      "startIndex": 0,
      "endIndex": 4,
    },{
      "startIndex": 5,
      "endIndex": 9
    }
  ]

  component.pages = [
    {
      "startIndex": 0,
      "endIndex": 9
    },{
      "startIndex": 10,
      "endIndex": 20
    }
  ]

  component.pagination = {
    pageSiz: 10,
    startIndex: 0,
    endIndex: 10 - 1,
    noOfPages: 0,
    currentPage: 1,
    paginationText: ''
  }

  component.paginationGroup = {
    pageSiz: 5,
    startIndex: 0,
    endIndex: 5 - 1,
    noOfPages: 0,
    currentPage: 1,
    paginationText: ''
  }

  var date = new Date('2020-08-24T11:56:08Z');
  component.groupDataList = [
    {
      "mfr": "siemens",
      "prod": "siemens",
      "sch": "podui",
      "endcustomer_name": "GroupA",
      "serial_number": [],
      "created_by": "siemensqa@glassbeam.com",
      "updated_on": date,
      "group_name": [],
      "rowIndex": 0,
      "selected": false,
      "disabled": false,
      "product": "SIEMENS-POD"
    },
    {
      "mfr": "siemens",
      "prod": "siemens",
      "sch": "podui",
      "endcustomer_name": "test_f3",
      "serial_number": [
        "1589869711995",
        "1589869583226",
        "CT95758",
        "CT66510"
      ],
      "created_by": "siemensqa@glassbeam.com",
      "updated_on": date,
      "group_name": [
        "test_f2",
        "shubham_g3"
      ],
      "rowIndex": 1,
      "selected": false,
      "disabled": false,
      "product": "SIEMENS-POD"
    },
    {
      "mfr": "siemens",
      "prod": "siemens",
      "sch": "podui",
      "endcustomer_name": "shubhamG2",
      "serial_number": [
        "XA154459_AxSysUseData.da",
        "XA154459_20200114_EnvironmentLog.xm"
      ],
      "created_by": "siemensqa@glassbeam.com",
      "updated_on": date,
      "group_name": [
        "test_abc"
      ],
      "rowIndex": 2,
      "selected": false,
      "disabled": false,
      "product": "SIEMENS-POD"
    }
  ]
  });
  
  afterEach(() => {
    fixture.destroy();
  });

  it('Component created', () => {
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
    expect(component).toBeTruthy();
  });

  it('fetch end customer list ', () => {
    let service = TestBed.get(AdminService);
    service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
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
    // let router = {
    //   navigate: jasmine.createSpy('navigate')
    // }
    // spyOn(component.router, 'navigate').and.returnValue(true);
    let res = '{"Status":"Success","Msg":"List all information for a user","Data":[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["ct64724","ct60111","ct60279","ct66930","ct64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z"}]}';
    spyOn(service, 'getendCustomerList').and.returnValue(of(JSON.parse(res)));
    component.getCustList();
    // expect(router.navigate).toHaveBeenCalledWith(['/users']);
    expect(service.getendCustomerList).toHaveBeenCalled();
    expect(component.endCustomerList.length).toEqual(1);
    expect(component.collectionSize).toEqual(1);
  });

  it('process Product list ', () => {
    let service = TestBed.get(AdminService);
    service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
    let res = {"SIEMENS-POD":"siemens:siemens:podui","Siemens prod60":"siemens:siemens:pod","Siemens prodv10":"siemens:siemens:prod"};
    spyOn(component, 'processProductList').and.returnValue(res);
    component.processProductList();
    expect(component.processProductList).toHaveBeenCalled();
  });

  it('fetch empty end customer list ', () => {
    let service = TestBed.get(AdminService);
    service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
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
    let res = '{"Status":"Success","Msg":"List all information for a user","Data":[]}';
    spyOn(service, 'getendCustomerList').and.returnValue(of(JSON.parse(res)));
    component.getCustList();
    expect(service.getendCustomerList).toHaveBeenCalled();
    expect(component.endCustomerList.length).toEqual(0);
    expect(component.collectionSize).toEqual(0);
    expect(component.initialEmpty).toBeTruthy();
  });

  it('End customer not selected', () => {
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
    component.allEndCustSelected();
    expect(component.isSelectAll).toEqual(false);
  });

  it('More than one customer and all are selected', () => {
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
    component.allEndCustSelected();
    expect(component.isSelectAll).toEqual(true);
  });
  it('getActionButtonDisable | Delete Button To Be Enabled', () => {
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
    let res = component.getActionButtonDisable(globalObj.delMultipleButton);
    expect(res).toBeFalsy();
  });
  
  it('getActionButtonDisable | Delete Button To Be Disabled', () => {
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
    let res = component.getActionButtonDisable(globalObj.delMultipleButton);
    expect(res).toBeTruthy();
  });

  it('getActionButtonDisable | Delete Button To Be Enabled', () => {
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
    let res = component.getActionButtonDisable(globalObj.delMultipleButton);
    expect(res).toBeFalsy();
  });

  it('getActionButtonDisable | Delete Button To Be Disabled', () => {
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
    let res = component.getActionButtonDisable(globalObj.delMultipleButton);
    expect(res).toBeFalsy();
  });

  it('getActionButtonDisable | Add sysId  Button to be  Enabled', () => {
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
    ]
    // component.addEditEndCustForm.patchValue({
    //   availableSelectedSysIdname: ["CT123", "CT321"]
    // });
    let res = component.getActionButtonDisable(globalObj.addSys);
    expect(res).toBeFalsy();
  });

  it('getActionButtonDisable | Add sysId Button To Be Disabled', () => {
    component.selectedSysIds = [];
    // component.addEditEndCustForm.patchValue({
    //   availableSelectedSysIdname: []
    // });
    let res = component.getActionButtonDisable(globalObj.addSys);
    expect(res).toBeUndefined();
  });

  it('getActionButtonDisable | Remove sysId  Button to be  Enabled', () => {
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
    ]
    // component.addEditEndCustForm.patchValue({
    //   SelectedSysIdname: ["CT123", "CT321"]
    // });
    let res = component.getActionButtonDisable(globalObj.removeSys);
    expect(res).toBeFalsy();
  });
  
  it('getActionButtonDisable | Remove sysId Button To Be Disabled', () => {
    component.tempRemoveSysIdList = [];
    // component.addEditEndCustForm.patchValue({
    //   SelectedSysIdname: []
    // });
    let res = component.getActionButtonDisable(globalObj.removeSys);
    expect(res).toBeUndefined();
  });

  it('openModal | ADD ENDCUSTOMER', () => {
    let service = TestBed.get(AdminService)
    service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
    component.openModal('addeditendcust', globalObj.addEndCustomerType, '' as any);
    expect(component.modalHeader).toEqual(globalObj.addEndCustomerMsg);
    expect(component.showSysIdDiv).toEqual(false);
  });

  it('openModal | Edit ENDCUSTOMER', () => {
    let service = TestBed.get(AdminService)
    service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
    let res = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":false},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":false},{"name":"CT66930","selected":false}]');
    let endCust = JSON.parse('{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false, "group_name": []}')
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false, "group_name": []},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false, "group_name": ["g1", "g2"]}]');
    spyOn(service, 'getSysList').and.returnValue(of(res));
    component.openModal('addeditendcust', globalObj.editEndCustomerType, endCust);
    expect(component.modalHeader).toEqual(globalObj.editEndCustomerMsg);
    expect(component.editEndUserMode).toEqual(true);
    expect(component.sysidLoading).toEqual(false);
  });

  it('TEST PRODUCT CHANGE METHOD', () => {
    let service = TestBed.get(AdminService);
    let res = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":false},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":false},{"name":"CT66930","selected":false}]');
    spyOn(service, 'getSysList').and.returnValue(of(res));
    component.endCustomerProductList = {
      "Siemens": "siemens:siemens:podui",
      "Siemens POD": "siemens:siemens:pod"
    };
    component.addEditEndCustForm.patchValue({
      prodName: 'Siemens'
    })
    component.onProdChange();
    expect(component.showSysIdDiv).toEqual(true);
  });

  it('ADD SYSID METHOD | device', () => {
    let service = TestBed.get(AdminService);
    service.unavailableSysids = []
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
    ]
    component.addSysIds();
    expect(component.selectedSysIds.length).toBeGreaterThanOrEqual(1);
    // expect(component.unavailableSysids.length).toBeGreaterThanOrEqual(1);
  });

  it('ADD SYSID METHOD | group', () => {
    component.selectedView = 'group';
    component.selectedGroups = [];
    // component.unavailableSysids = [];
    component.groupDataList = [
      {
        "mfr": "siemens",
        "prod": "siemens",
        "sch": "podui",
        "endcustomer_name": "GroupA",
        "serial_number": [],
        "created_by": "siemensqa@glassbeam.com",
        "updated_on": new Date('2020-08-24T11:56:08Z'),
        "group_name": [],
        "rowIndex": 0,
        "selected": false,
        "disabled": false,
        "product": "SIEMENS-POD"
      },
      {
        "mfr": "siemens",
        "prod": "siemens",
        "sch": "podui",
        "endcustomer_name": "test_f3",
        "serial_number": [
          "1589869711995",
          "1589869583226",
          "CT95758",
          "CT66510"
        ],
        "created_by": "siemensqa@glassbeam.com",
        "updated_on": new Date('2020-08-24T11:56:08Z'),
        "group_name": [
          "test_f2",
          "shubham_g3"
        ],
        "rowIndex": 1,
        "selected": true,
        "disabled": false,
        "product": "SIEMENS-POD"
      }];

      component.selectedGroups = [
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "GroupA",
          "serial_number": [],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": new Date('2020-08-24T11:56:08Z'),
          "group_name": [],
          "rowIndex": 0,
          "selected": true,
          "disabled": false,
          "product": "SIEMENS-POD"
        }]
    component.addSysIds();
    expect(component.selectedGroups.length).toBeGreaterThan(0);
    // expect(component.unavailableSysids.length).toBeGreaterThanOrEqual(1);
  });

  it('REMOVE SYSID METHOD |sysid', () => {
    component.addEditEndCustForm.patchValue({
      SelectedSysIdname: ["CT60503", "CT64103"]
    });
    component.selectedView = 'device';
    component.sysIdList = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":false},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":false},{"name":"CT66930","selected":false}]');
    component.sysIdsToRemove = [];
    // component.unavailableSysids = ["CT60503", "CT64103"];
    component.removeSysIds();
    expect(component.tempAddSysIdList.length).toEqual(0);
  });

  it('REMOVE SYSID METHOD |group', () => {
    component.selectedView = 'group';
    component.groupDataList = [
      {
        "mfr": "siemens",
        "prod": "siemens",
        "sch": "podui",
        "endcustomer_name": "GroupA",
        "serial_number": [],
        "created_by": "siemensqa@glassbeam.com",
        "updated_on": new Date('2020-08-24T11:56:08Z'),
        "group_name": [],
        "rowIndex": 0,
        "selected": true,
        "disabled": false,
        "product": "SIEMENS-POD"
      },
      {
        "mfr": "siemens",
        "prod": "siemens",
        "sch": "podui",
        "endcustomer_name": "test_f3",
        "serial_number": [
          "1589869711995",
          "1589869583226",
          "CT95758",
          "CT66510"
        ],
        "created_by": "siemensqa@glassbeam.com",
        "updated_on": new Date('2020-08-24T11:56:08Z'),
        "group_name": [
          "test_f2",
          "shubham_g3"
        ],
        "rowIndex": 1,
        "selected": false,
        "disabled": false,
        "product": "SIEMENS-POD"
      }]
    component.groupListToRemove = [];
    // component.unavailableSysids = ["CT60503", "CT64103"];
    component.removeSysIds();
    expect(component.tempRemoveGroupList.length).toEqual(0);
  });

  it('REMOVE SYSID METHOD sub function ', () => {
    component.sysIdsToRemove = [{ "name": "CT60503" }, { "name": "CT64103" }];
    // component.unavailableSysids = ["CT60503", "CT64103"];
    component.sysIdsToRemove.map((item) => {
      component.removeItemFromList(component.selectedSysIds, item);
    })
    component.selectedSysIds = [];
    expect(component.selectedSysIds.length).toEqual(0);
  });

  it('OpenConfirmation | Delete Multiple EndCustomer', () => {
    let modalservice = TestBed.get(NgbModal);
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"group_name": [],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"group_name": ["G1"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
    component.openConfirmation(globalObj.deleteMultiple, '');
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.msg.length).toBeGreaterThan(0);
  });

  it('OpenConfirmation | Delete Single EndCustomer', () => {
    let modalservice = TestBed.get(NgbModal);
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"group_name": [],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"group_name": ["G1"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
    let data = JSON.parse('{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"group_name": [],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true}');
    component.openConfirmation(globalObj.deleteSingle, data);
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.msg.length).toBeGreaterThan(1);
  });

  it('OpenConfirmation | Delete multiple EndCustomer | with user association', () => {
    let modalservice = TestBed.get(NgbModal);
    let service = TestBed.get(AdminService);
    service.associatedEndCustomerList = ['12345'];
    component.associatedGroupList = [];
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"group_name": [],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"group_name": ["G1"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
    let data = JSON.parse('{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"group_name": [],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true}');
    component.openConfirmation(globalObj.deleteMultiple, '');
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.msg).toBe(messages.multiAssociationErr);
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.subMsg.length).toBeGreaterThan(0);
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.listToDisplay.length).toBeGreaterThan(0);
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.confirmationMsg).toBe(messages.multiassociationErroConfirmation);    
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.footerMsg).toBe(messages.multiassociationErroFooter);
  });

  it('OpenConfirmation | Delete Single EndCustomer | Message Popup', () => {
    let modalservice = TestBed.get(NgbModal);
    let service = TestBed.get(AdminService);
    service.associatedEndCustomerList = ['12345'];
    component.associatedGroupList = ['12345'];
    component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"group_name": [],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"group_name": ["G1"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":true}]');
    let data = JSON.parse('{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"group_name": [],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":true}');
    component.openConfirmation(globalObj.deleteSingle, data);
    expect(modalservice._modalStack._modalRefs[1]._contentRef.componentRef.instance.msg.length).toBeGreaterThan(1);
  });

  it('addEndCustSubmit | Add End Customer > No Name Field > Form Should Be invalid', () => {
    component.addEndCustSubmit();
    expect(component.addEditEndCustForm.controls['endCustomerName'].status).toEqual('INVALID');
    expect(component.addEditEndCustForm.controls['prodName'].status).toEqual('INVALID');
    // expect(component.addEditEndCustForm.controls['SelectedSysIdname'].status).toEqual('INVALID');
    expect(component.addEditEndCustForm.status).toEqual('INVALID');
    expect(component.submitted).toEqual(true);
  });

  it('addEndCustSubmit | Add End Customer > Name Field > No Product name > Form Should Be invalid', () => {
    component.addEditEndCustForm.patchValue({
      endCustomerName: "NIshanth"
    });
    component.addEndCustSubmit();
    expect(component.addEditEndCustForm.controls['prodName'].status).toEqual('INVALID');
    // expect(component.addEditEndCustForm.controls['SelectedSysIdname'].status).toEqual('INVALID');
    expect(component.addEditEndCustForm.status).toEqual('INVALID');
    expect(component.submitted).toEqual(true);
  });

  it('addEndCustSubmit | Add End Customer > Duplicate Name', () => {
    component.addEditEndCustForm.patchValue({
      endCustomerName: "Nishanth",
      prodName: "Siemens",
      SelectedSysIdname: ["CT123", "CT4567"]
    });
    component.editEndUserMode = false;
    component.endCustomerNameMap = ["Nishanth", "Anish"]
    component.addEndCustSubmit();
    expect(component.submitted).toEqual(true);
  });

  it('addEndCustSubmit | Add End Customer > Duplicate Name', () => {
    component.addEditEndCustForm.patchValue({
      endCustomerName: "Nishanth",
      prodName: "Siemens",
      SelectedSysIdname: ["CT123", "CT4567"]
    });
    component.editEndUserMode = false;
    component.endCustomerNameMap = ["Nishanth", "Anish"]
    component.addEndCustSubmit();
    expect(component.submitted).toEqual(true);
  });

  it('ADD  END CUSTOMER API CALL', () => {
    //let postData =  {"endcustomer_name":"Nishanth","serial_number":"CT65493,CT59054,CT59334","created_by":"siemensqa@glassbeam.com","updated_on":""};
    let service = TestBed.get(AdminService);
    service.loggedInUserDetails = {"user":[{'email':"siemensqa@glassbeam.com"}]}
    let res = "siemensqa@glassbeam.com";
    spyOn(service, 'getLoggedEmail').and.returnValue(of(res));
    component.addEditEndCustForm.patchValue({
      endCustomerName: "John",
      prodName: "Siemens",
      SelectedSysIdname: ["CT123", "CT4567"]
    });
    let api_success = { "Status": "Success", "Msg": "End customer Nishanth added successfully", "Data": "" };
    spyOn(service, 'post').and.returnValue(of(api_success));
    component.editEndUserMode = false;
    component.endCustomerNameMap = ["Nishanth", "Anish"]
    component.addEndCustSubmit();
    expect(service.post).toHaveBeenCalled();
  });

  it('Edit  END CUSTOMER API CALL', () => {
    //let postData =  {"endcustomer_name":"Nishanth","serial_number":"CT65493,CT59054,CT59334","created_by":"siemensqa@glassbeam.com","updated_on":""};
    let service = TestBed.get(AdminService);
    service.loggedInUserDetails = {"user":[{'email':"siemensqa@glassbeam.com"}]}
    let res = "siemensqa@glassbeam.com";
    component.editEndUserMode = true;;
    spyOn(service, 'getLoggedEmail').and.returnValue(of(res));
    component.addEditEndCustForm.patchValue({
      endCustomerName: "John",
      prodName: "Siemens",
      SelectedSysIdname: ["CT123"]
    });
    let api_success = { "endcustomer_name": "Nishanth", "serial_number": "CT59054,CT59334", "created_by": "siemensqa@glassbeam.com", "updated_on": "2019-11-08 11:48:09" };
    spyOn(service, 'post').and.returnValue(of(api_success));
    component.endCustomerNameMap = ["Nishanth", "Anish"]
    component.addEndCustSubmit();
    expect(service.post).toHaveBeenCalled();
  });

  it('Delete  End Customer API', () => {
    let service = TestBed.get(AdminService);
    let param = [
      {
        "mps": "siemens/siemens/podui",
        "endcustomer_name": [
          "test11"
        ]
      },
      {
        "mps": "siemens/siemens/pod",
        "endcustomer_name": [
          "test12"
        ]
      }
    ]
    // let param = { "endcustomer_name": ["Nishanth"], "mps": "siemens:siemens:podui" };
    let api_success = { "Status": "Success", "Msg": "End customer(s) Nishanth deleted successfully", "Data": "" };
    spyOn(service, 'post').and.returnValue(of(api_success));
    component.deleteEndCustomer(param);
    expect(service.post).toHaveBeenCalled();
  });

  it('tooltip', () => {
    let text = "";
    let e = {'target':{'offsetWidth': 390, 'scrollWidth': 400,'title': ''}};
    spyOn(component,'enableTootip');
    component.enableTootip(e, text);
    expect(e.target.title.length).toEqual(0)
   // expect(component.enableTootip).toHaveBeenCalled();
  });
  
  it('callsys', () => {
    component.editEndUserMode = false
    component.addEditEndCustForm.value.prodName = "prodname"
    spyOn(component,'getSysId');
    component.clearSearchText();
    expect(component.getSysId).toHaveBeenCalled();
  });

  it('clearSearchText', () => {
    component.editEndUserMode = false
    component.addEditEndCustForm.value.prodName = "prodname"
    spyOn(component,'getSysId');
    component.callsysid();
    expect(component.getSysId).toHaveBeenCalled();
  });

  it('getSelectedValues | if any selected', () => {
    const list = [{"name":"siemens@glassbeam.com","selected":false},{"name":"nishanth.prabhu@glassbeam.com","selected":true}];
    let res = component.getSelectedValues(list);
    expect(res.length).toBeGreaterThan(0);

  });

  it('getSelectedValues | if any selected', () => {
    const list = [{"name":"siemens@glassbeam.com","selected":false},{"name":"nishanth.prabhu@glassbeam.com","selected":false}];
    let res = component.getSelectedValues(list);
    expect(res.length).toEqual(0);

  });


  it('updateDataFilter | filter user data for multiselect true', () => {
    let columnVal = 'nishanth.prabhu@glassbeam.com';
    let selected = true;
    let multiselect = true;
    let actualData = [{"name":"siemens@glassbeam.com","selected":false},{"name":"nishanth.prabhu@glassbeam.com","selected":true}];
    component.endCustomerListCopy = _.cloneDeep(component.endCustomerList);
    spyOn(component,'setFilterData');
    component.updateDataFilter(columnVal,selected,multiselect,actualData);
    expect(component.setFilterData).toHaveBeenCalled();
  });

  it('updateDataFilter | filter user data for multiselect false', () => {
    let columnVal = 'Last Week';
    let selected = true;
    let multiselect = false;
    let actualData = [{"name":"Last 24 Hrs","value":"24hrs","checked":false},{"name":"Last Week","value":"week","checked":false,"selected":true},{"name":"Last Month","value":"month","checked":false},{"name":"Last 6 Months","value":"6month","checked":false}];
    component.endCustomerListCopy = _.cloneDeep(component.endCustomerList);
    spyOn(component,'setFilterData');
    component.updateDataFilter(columnVal,selected,multiselect,actualData);
    expect(component.setFilterData).toHaveBeenCalled();
  });

  it('setFilterData | Created By email', () => {
    let columnData = component.endCustomerList[3];
    let columnName = 'created_by';
    let columnValList = ['siemensqa@glassbeam.com','nishanth.prabhu@glassbeam.com'];
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });

  it('setFilterData | time based filter', () => {
    let columnData = component.endCustomerList[0];
    let columnName = 'updated_on';
    let columnValList = ['Last 6 Months'];
    spyOn(component, 'isInTimerange').and.returnValue(true);
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });

  it('setFilterData | serial_number', () => {
    let columnData = component.endCustomerList[0];
    let columnName = 'serial_number';
    let columnValList = ['CT64492'];
    // spyOn(component, 'serial_number').and.returnValue(true);
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });

    it('isInTimerange Last 24 Hrs ', () => {
      let timeRange = "Last 24 Hrs";
      let targetDateTime = "2019-11-15T05:49:47Z"
      let result = component.isInTimerange(timeRange, targetDateTime);
      expect(result).toEqual(false);
    });

    it('isInTimerange Last Week ', () => {
      let timeRange = "Last Week";
      let targetDateTime = "2019-11-15T05:49:47Z";
      let result = component.isInTimerange(timeRange, targetDateTime);
      expect(result).toEqual(false);
    });

    xit('isInTimerange Last Month ', () => {
      let timeRange = "Last Month";
      let targetDateTime = "2019-11-15T05:49:47Z"
      let result = component.isInTimerange(timeRange, targetDateTime);
      expect(result).toEqual(true);
    });

    it('isInTimerange Last 6 Month', () => {
      let timeRange = "Last 6 Months";
      let tempDate = new Date();
      tempDate.setDate(tempDate.getDate()-179);
      let targetDateTime = tempDate.toJSON() ;
      let result = component.isInTimerange(timeRange, targetDateTime);
      expect(result).toEqual(true);
    });

    it('resetFilter', () => {
      component.endCustomerFilterData = [{"columnName":"created_by","columnTitle":"Created By","data":[{"name":"siemens@glassbeam.com","selected":true},{"name":"nishanth.prabhu@glassbeam.com","selected":false}],"multiselect":false,"isDateType":false,"showSearch":false,"appliedFilterCount":1},{"columnName":"updated_on","columnTitle":"Modified On","data":[{"name":"Last 24 Hrs","value":"24hrs","checked":false,"selected":false},{"name":"Last Week","value":"week","checked":false,"selected":true},{"name":"Last Month","value":"month","checked":false,"selected":false},{"name":"Last 6 Months","value":"6month","checked":false,"selected":false}],"multiselect":false,"isDateType":true,"showSearch":false,"appliedFilterCount":1}];
      component.resetFilter();
      expect(component.filterCount).toEqual(0);
    });

    it('Onsort direction empty direction', () => {
      let param:SortEvent = {
        column:"created_by",
        direction:""
      };
      component.onSort(param);
      
      expect(component.endCustomerList).toEqual(component.endCustomerList);
    });
    it('Onsort direction asc', () => {
      component.endCustomerList = [{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64492","CT60503","CT65225","CT64352"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-15T05:49:47Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Nis","serial_number":["CT64694","CT64863"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-11T10:34:23Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Nishanth","serial_number":["CT64103","CT95899","CT59711"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-20T10:58:40Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Sam","serial_number":["CT60503","CT64103","CT64694","CT64863"],"created_by":"nishanth.prabhu@glassbeam.com","updated_on":"2019-11-20T11:50:55Z","selected":false}];
      let param:SortEvent = {
        column:"created_by",
        direction:"asc"
      };
      component.onSort(param);
      let res = [{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Sam","serial_number":["CT60503","CT64103","CT64694","CT64863"],"created_by":"nishanth.prabhu@glassbeam.com","updated_on":"2019-11-20T11:50:55Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64492","CT60503","CT65225","CT64352"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-15T05:49:47Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Nis","serial_number":["CT64694","CT64863"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-11T10:34:23Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Nishanth","serial_number":["CT64103","CT95899","CT59711"],"created_by":"siemens@glassbeam.com","updated_on":"2019-11-20T10:58:40Z","selected":false}];
      expect(component.endCustomerList).toEqual(res);
    });

    it('Fetch grouped data', () => {
      component.fetchGroupData();
      expect(Object.keys(component.groupedData).length).toEqual(0);
    })

    it('getEndCustomerListFiltered | for searchText length less than 3', () => {
      component.searchText = 'e';
      let res = component.getEndcustomerListFiltered();
      expect(res.length).toEqual(component.endCustomerList.length);
    });
  
    it('getEndCustomerListFiltered | for searchText length greater than or equal to 3', () => {
      component.searchText = 'Gro';
      component.endCustomerList = [
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "shubham_g3",
          "serial_number": [],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": "2020-08-24T11:56:08Z",
          "group_name": []
        },
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "GroupA",
          "serial_number": ['12345', 'Group111'],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": "2020-08-24T11:56:08Z",
          "group_name": []
        }
      ]
      let res = component.getEndcustomerListFiltered();
      expect(res.length).toBeGreaterThan(0);
    });

    it('getFilterData | searchtext greater than or equal to 3', () => {
      let filter = {
        "columnName": "endcustomer_name",
        "columnTitle": "Group Name",
        "data": [
          {
            "name": "siemensqa@glassbeam.com",
            "selected": false
          },
          {
            "name": "test1@gmail.com",
            "selected": false
          },
          {
            "name": "test2@gmail.com",
            "selected": false
          },
          {
            "name": "test@gmail.com",
            "selected": false
          }
        ],
        "multiselect": true,
        "isDateType": false,
        "showSearch": true,
        "searchText": "tes"
      }
      let res = component.getFilterData(filter);
      expect(res.length).toBeGreaterThan(0);
    });
  
    it('getFilterData | searchtext greater less than 3', () => {
      let filter = {
        "columnName": "endcustomer_name",
        "columnTitle": "Group Name",
        "data": [
          {
            "name": "siemensqa@glassbeam.com",
            "selected": false
          },
          {
            "name": "test1@gmail.com",
            "selected": false
          },
          {
            "name": "test2@gmail.com",
            "selected": false
          },
          {
            "name": "test@gmail.com",
            "selected": false
          }
        ],
        "multiselect": true,
        "isDateType": false,
        "showSearch": true,
        "searchText": "te"
      }
      let res = component.getFilterData(filter);
      expect(res.length).toBe(0);
    });

    it('endCustToggleSelect', () => {
      component.endCustToggleSelect();
      expect(component.endCustomerList[1].selected).toEqual(true);
    });

    it('clearSelection', () => {
      let res = component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
      component.clearSelection();
      expect(component.endCustomerList).toEqual(res);
      expect(component.selectedCount).toEqual(0);
    });

    it('exportCSVFile', () => {
      let service = TestBed.get(AdminService);
      spyOn(service, 'downloadCSVFile').and.returnValue(true);
      component.endCustomerList = [
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "shubham_g3",
          "serial_number": [],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": "2020-08-24T11:56:08Z",
          "group_name": []
        },
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "GroupA",
          "serial_number": ['12345', 'Group111'],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": "2020-08-24T11:56:08Z",
          "group_name": []
        }
      ]
      component.csvData = [
        {
          "endcustomer_name": "shubham1",
          "created_by": "siemensqa@glassbeam.com",
          "group_name": [],
          "rowIndex": 0,
          "disabled": false,
          "product": "SIEMENS-POD",
          "name": "shubham1",
          "modified_on": "2020-08-24T09:41:51Z"
        },
        {
          "endcustomer_name": "shubham2",
          "created_by": "siemensqa@glassbeam.com",
          "group_name": [
            "shubham1"
          ],
          "rowIndex": 1,
          "disabled": false,
          "product": "SIEMENS-POD",
          "name": "shubham2",
          "modified_on": "2020-08-24T09:42:30Z"
        }
      ]
      component.exportCSVFile();
      expect(component.csvData.length).toBeGreaterThan(0);
    });

    it('switchView | device', () => {
      let type = 'device';
      component.switchView(type, '');
      expect(component.selectedView).toBe('device');
    })

    it('switchView | group', () => {
      let type = 'group';
      component.switchView(type, '');
      expect(component.selectedView).toBe('group');
    })

    it('changeSearchView | when header passed', () => {
      let obj = {
        name: 'System Name',
        keyword: 'systemName',
        selected: true
      }
      component.attributeList = [{
        name: 'System Name',
        keyword: 'systemName',
        selected: true
      }, {
        name: 'Hospital Name',
        keyword: 'hospName',
        selected: false
      }, {
        name: 'Company Name',
        keyword: 'compName',
        selected: false
      }, {
        name: 'City',
        keyword: 'city',
        selected: false
      }, {
        name: 'Country',
        keyword: 'country',
        selected: false
      }
      ]
      component.changeSearchView(obj);
      expect(component.selectedSearchAttrList.length).toBeGreaterThan(0);
    })

    it('changeSearchView | when header is not passed', () => {
      let obj = {}
      component.attributeList = [{
        name: 'System Name',
        keyword: 'systemName',
        selected: false
      }, {
        name: 'Hospital Name',
        keyword: 'hospName',
        selected: false
      }, {
        name: 'Company Name',
        keyword: 'compName',
        selected: false
      }, {
        name: 'City',
        keyword: 'city',
        selected: false
      }, {
        name: 'Country',
        keyword: 'country',
        selected: false
      }
      ]
      component.changeSearchView(obj);
      expect(component.selectedSearchAttrList.length).toBe(0);
    })

    it('searchDisbledButtonStateForCancel', () => {
      let obj = {systemtype: '123', country: '', sysid1: '', compname: ''};
      component.addEditEndCustForm.value.syssearchtext = obj;
      component.selectedSearchAttrList = [
        {
          "colName": "country",
          "colLabel": "Country",
          "selected": true
        },
        {
          "colName": "sysid1",
          "colLabel": "Device ID",
          "selected": true
        },
        {
          "colName": "systemtype",
          "colLabel": "System Name",
          "selected": true
        },
        {
          "colName": "compname",
          "colLabel": "Company Name",
          "selected": true
        }
      ]
      let res = component.searchDisbledButtonStateForCancel();
      expect(res).toBeFalsy();
    })

    it('searchDisbledButtonState', () => {
      let obj = {systemtype: '123', country: '', sysid1: '', compname: ''};
      component.addEditEndCustForm.value.syssearchtext = obj;
      component.selectedSearchAttrList = [
        {
          "colName": "country",
          "colLabel": "Country",
          "selected": true
        },
        {
          "colName": "sysid1",
          "colLabel": "Device ID",
          "selected": true
        },
        {
          "colName": "systemtype",
          "colLabel": "System Name",
          "selected": true
        },
        {
          "colName": "compname",
          "colLabel": "Company Name",
          "selected": true
        }
      ]
      let res = component.searchDisbledButtonState();
      expect(res).toBeFalsy();
    })

    it('clearGroupSearchText', () => {
      component.addEditEndCustForm.patchValue({
        groupNameSearch: ''
      })
      component.clearGroupSearchText();
      expect(component.showDivSearch).toBeFalsy();
    })

    it('getGroupListFiltered | searchText greater than 3', () => {
      component.addEditEndCustForm.patchValue({
        groupNameSearch: 'Gro'
      });
      let res = component.getGroupListFiltered();
      expect(res.length).toBeGreaterThan(0);
    })

    it('clearAll', () => {
      let list = [{name: '1', selected: true},{name: '2', selected: true}]
      component.clearAll(list);
      expect(list[0].selected).toBeFalsy();
    }) 

    it('selectRowsBetweenIndexes', () => {
      let indexes = [0,1];
      let list = [{name: '1', selected: false},{name: '2', selected: false}];
      component.selectRowsBetweenIndexes(indexes, list);
      expect(list[0].selected).toBeTruthy();
    })

    it('toggleRow', () => {
      let row = {name: '1', selected: false, rowIndex: 0};
      component.toggleRow(row);
      expect(component.lastSelectedRow.rowIndex).toEqual(row.rowIndex);
    })

    it('getSysId', () => {
      let prodName = 'siemens/siemens/podui';
      let selectedsysIds = [];
      let service = TestBed.get(AdminService);
      let api_success = {
        "Status": "Success",
        "Msg": "List of Systems for siemens, siemens, podui and siemens",
        "Data": [{"city": "Gothenburg",
        "country": "US",
        "hospname": "Gothenburg Memorial Hospital",
        "sysid1": "1589804529518",
        "systemtype": "P68B",
        "compname": "CT59031"
        },{"city": "Estherville",
        "country": "US",
        "hospname": "Avera Holy Family Hospital",
        "sysid1": "1589866887144",
        "systemtype": "SOMATOM Perspective",
        "compname": "CT59352"
        }]
      }
      spyOn(service, 'getSysList').and.returnValue(of(api_success));
      component.getSysId(prodName, selectedsysIds);
      expect(service.getSysList).toHaveBeenCalled();
    })

    it('getSysId | sysList', () => {
      let prodName = 'siemens/siemens/podui';
      component.sysIdAttr = 'sysid1';
      let selectedSysIds = JSON.parse('[{"sysid1":"CT60503","selected":false},{"sysid1":"CT64103","selected":false}]');
      component.getSysId(prodName, selectedSysIds);
      expect(component.selectedSysIds.length).toBeGreaterThan(0);
    })

    it('loadNextSet | sysid', () => {
      let prodName = 'siemens/siemens/podui';
      let selectedsysIds = [];
      component.loadNextSet();
      let service = TestBed.get(AdminService);
      let api_success = {
        "Status": "Success",
        "Msg": "List of Systems for siemens, siemens, podui and siemens",
        "Data": [{"city": "Gothenburg",
        "country": "US",
        "hospname": "Gothenburg Memorial Hospital",
        "sysid1": "1589804529518",
        "systemtype": "P68B",
        "compname": "CT59031"
        },{"city": "Estherville",
        "country": "US",
        "hospname": "Avera Holy Family Hospital",
        "sysid1": "1589866887144",
        "systemtype": "SOMATOM Perspective",
        "compname": "CT59352"
        }]
      }
      spyOn(service, 'getSysList').and.returnValue(of(api_success));
      component.getSysId(prodName, selectedsysIds);
      // expect(component.getSysId(prodName, selectedsysIds)).toHaveBeenCalled();
      expect(service.getSysList).toHaveBeenCalled();
    })

    it('loadNextSet | group', () => {
      component.selectedView = 'group'
      component.addEditEndCustForm.patchValue({
        groupNameSearch: ''
      });
      component.loadNextSet();
      component.getGroupListFiltered();
      expect(component.groupDataList.length).toBeGreaterThan(0);
    })

    it('loadPrevSet | sysid', () => {
      let prodName = 'siemens/siemens/podui';
      let selectedsysIds = [];
      component.pagination.currentPage = 2;
      component.loadPrevSet();
      let service = TestBed.get(AdminService);
      let api_success = {
        "Status": "Success",
        "Msg": "List of Systems for siemens, siemens, podui and siemens",
        "Data": [{"city": "Gothenburg",
        "country": "US",
        "hospname": "Gothenburg Memorial Hospital",
        "sysid1": "1589804529518",
        "systemtype": "P68B",
        "compname": "CT59031"
        },{"city": "Estherville",
        "country": "US",
        "hospname": "Avera Holy Family Hospital",
        "sysid1": "1589866887144",
        "systemtype": "SOMATOM Perspective",
        "compname": "CT59352"
        }]
      }
      spyOn(service, 'getSysList').and.returnValue(of(api_success));
      component.getSysId(prodName, selectedsysIds);
      // expect(component.getSysId(prodName, selectedsysIds)).toHaveBeenCalled();
      expect(service.getSysList).toHaveBeenCalled();
    })

    it('loadPrevSet | group', () => {
      component.selectedView = 'group';
      component.addEditEndCustForm.patchValue({
        groupNameSearch: ''
      });
      component.paginationGroup.currentPage = 2;
      component.loadPrevSet();
      component.getGroupListFiltered();
      expect(component.groupDataList.length).toBeGreaterThan(0);
    })

    it('getGroupList', () => {
      let prodName = 'siemens/siemens/podui';
      let groupList = '';
      component.getGroupList(prodName, groupList);
      expect(component.groupDataList.length).toBeGreaterThan(0);
    })

    it('getGroupList | groupList', () => {
      let prodName = 'siemens/siemens/podui';
      let groupList = {
        "mfr": "siemens",
        "prod": "siemens",
        "sch": "podui",
        "endcustomer_name": "test_f3",
        "serial_number": [
          "1589869711995",
          "1589869583226",
          "CT95758",
          "CT66510"
        ],
        "created_by": "siemensqa@glassbeam.com",
        "updated_on": new Date('2020-08-24T11:56:08Z'),
        "group_name": [
          "G_4",
          "shubham_g3"
        ],
        "rowIndex": 1,
        "selected": true,
        "disabled": false,
        "product": "SIEMENS-POD"
      };
      component.getGroupList(prodName, groupList);
      expect(component.selectedGroups.length).toBeGreaterThan(0);
    })

    it('getPages', () => {
      let prodName = 'siemens/siemens/podui';
      component.totalSysids = 100;
      component.getPages(prodName);
      expect(component.pages.length).toBeGreaterThan(0);
    })

    it('getGroupPages', () => {
      let prodName = 'siemens/siemens/podui';
      component.getPages(prodName);
      expect(component.groupPages.length).toBeGreaterThan(0);
    })

    it('addRmoveBtnState | device: add', () => {
      component.selectedView = 'device';
      let state = 'add';
      component.sysIdList = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":true},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":true},{"name":"CT66930","selected":false}]');
      component.addRmoveBtnState(state);
      expect(component.tempAddSysIdList.length).toBeGreaterThan(0);
    })

    it('addRmoveBtnState | device: remove', () => {
      component.selectedView = 'device';
      let state = 'remove';
      component.selectedSysIds = JSON.parse('[{"name":"CT60503","selected":false},{"name":"CT64103","selected":false},{"name":"CT64694","selected":false},{"name":"CT64863","selected":false},{"name":"CT64492","selected":false},{"name":"CT65225","selected":false},{"name":"CT64352","selected":false},{"name":"CT95899","selected":false},{"name":"CT59711","selected":false},{"name":"CT64239","selected":false},{"name":"CT65419","selected":false},{"name":"CT64724","selected":true},{"name":"CT60111","selected":false},{"name":"CT60279","selected":false},{"name":"CT64835","selected":true},{"name":"CT66930","selected":false}]');
      component.addRmoveBtnState(state);
      expect(component.tempRemoveSysIdList.length).toBeGreaterThan(0);
    })

    it('addRmoveBtnState | group: add', () => {
      component.selectedView = 'group';
      let state = 'add';
      component.groupDataList = [
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "GroupA",
          "serial_number": [],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": new Date('2020-08-24T11:56:08Z'),
          "group_name": [],
          "rowIndex": 0,
          "selected": true,
          "disabled": false,
          "product": "SIEMENS-POD"
        },
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "test_f3",
          "serial_number": [
            "1589869711995",
            "1589869583226",
            "CT95758",
            "CT66510"
          ],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": new Date('2020-08-24T11:56:08Z'),
          "group_name": [
            "test_f2",
            "shubham_g3"
          ],
          "rowIndex": 1,
          "selected": false,
          "disabled": false,
          "product": "SIEMENS-POD"
        }]
      component.addRmoveBtnState(state);
      expect(component.tempAddGroupList.length).toBeGreaterThan(0);
    })

    it('addRmoveBtnState | group: remove', () => {
      component.selectedView = 'group';
      let state = 'remove';
      component.selectedGroups = [
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "GroupA",
          "serial_number": [],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": new Date('2020-08-24T11:56:08Z'),
          "group_name": [],
          "rowIndex": 0,
          "selected": true,
          "disabled": false,
          "product": "SIEMENS-POD"
        },
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "test_f3",
          "serial_number": [
            "1589869711995",
            "1589869583226",
            "CT95758",
            "CT66510"
          ],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": new Date('2020-08-24T11:56:08Z'),
          "group_name": [
            "test_f2",
            "shubham_g3"
          ],
          "rowIndex": 1,
          "selected": false,
          "disabled": false,
          "product": "SIEMENS-POD"
        }]
      component.addRmoveBtnState(state);
      expect(component.tempRemoveGroupList.length).toBeGreaterThan(0);
    })

    it('getColListData', () => {
      let prodName = 'siemens/siemens/podui';
      let selectedsysIds = [];
      let service = TestBed.get(AdminService);
      let api_success = {
        "Status": "Success",
        "Msg": "List of Systems for siemens, siemens, podui and siemens",
        "Data": [{"city": "Gothenburg",
        "country": "US",
        "hospname": "Gothenburg Memorial Hospital",
        "sysid1": "1589804529518",
        "systemtype": "P68B",
        "compname": "CT59031"
        },{"city": "Estherville",
        "country": "US",
        "hospname": "Avera Holy Family Hospital",
        "sysid1": "1589866887144",
        "systemtype": "SOMATOM Perspective",
        "compname": "CT59352"
        }]
      }
      spyOn(service, 'getSysIdColList').and.returnValue(of(api_success));
      component.getColListData(prodName, '', '');
      expect(service.getSysIdColList).toHaveBeenCalled();
    })

    it('closeEndCustomerModal', () => {
      let modalservice = TestBed.get(NgbModal);
      let service = TestBed.get(AdminService);
      component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
      service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
      component.openModal('addeditendcust', globalObj.addEndCustomerType, '' as any);
      component.addEditEndCustForm.markAsTouched();
      component.addEditEndCustForm.markAsDirty();
      component.closeEndCustomerModal();
      expect(modalservice._modalStack._modalRefs[1]._contentRef.componentRef.instance.msg).toEqual(messages.changeAlert);
    });

    it('closeEndCustomerModal | change in sysid count are equal', () => {
      let modalservice = TestBed.get(NgbModal);
      let service = TestBed.get(AdminService);
      component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
      service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
      component.openModal('addeditendcust', globalObj.editEndCustomerType, '' as any);
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
      ]
      component.editVals.sysIds = ["CT54644", "760806SCOC"]
      component.closeEndCustomerModal();
      expect(modalservice._modalStack._modalRefs[1]._contentRef.componentRef.instance.msg).toEqual(messages.changeAlert);
    });

    it('closeEndCustomerModal | change in sysid count are not equal', () => {
      let modalservice = TestBed.get(NgbModal);
      let service = TestBed.get(AdminService);
      component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
      service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
      component.openModal('addeditendcust', globalObj.editEndCustomerType, '' as any);
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
      ]
      component.editVals.sysIds = ["CT54644", "760806SCOC", "abc"]
      component.closeEndCustomerModal();
      expect(modalservice._modalStack._modalRefs[1]._contentRef.componentRef.instance.msg).toEqual(messages.changeAlert);
    });

    it('closeEndCustomerModal | change in group count are equal', () => {
      let modalservice = TestBed.get(NgbModal);
      let service = TestBed.get(AdminService);
      component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
      service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
      component.openModal('addeditendcust', globalObj.editEndCustomerType, '' as any);
      component.selectedGroups = [
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "GroupA",
          "serial_number": [],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": new Date('2020-08-24T11:56:08Z'),
          "group_name": [],
          "rowIndex": 0,
          "selected": true,
          "disabled": false,
          "product": "SIEMENS-POD"
        }]
      component.editVals.groups = ["GroupA"]
      component.closeEndCustomerModal();
      expect(modalservice._modalStack._modalRefs[1]).toEqual(undefined);
    });

    it('closeEndCustomerModal | change in group count are not equal', () => {
      let modalservice = TestBed.get(NgbModal);
      let service = TestBed.get(AdminService);
      component.endCustomerList = JSON.parse('[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"12345","serial_number":["CT64724","CT60111","CT60279","CT66930","CT64835"],"created_by":"nishanth@glassbeam.com","updated_on":"2019-09-19T11:55:44Z","selected":false},{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"Group A","serial_number":["CT64863","CT64103","CT64694","CT65419"],"created_by":"saleem@glassbeam.com","updated_on":"2018-09-19T12:04:15Z","selected":false}]');
      service.adminRole = {"name":"siemens_siemens_podui_admin","realm_uidomain":{"qaui":"qaui.glassbeam.com","autostage":"autostage.glassbeam.com"},"mps_uidomain":{"siemens:siemens:podui":"qaui.glassbeam.com","siemens:siemens:pod":"qaui.glassbeam.com","siemens:siemens:prod":"qaui.glassbeam.com"},"two_auth_support":[],"featureData":[{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Creator,Dashboard Admin,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,wb_creator,dashboard_admin,admin","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"SIEMENS-POD","selected":false},{"features":"Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin,Rule Creator","featureKey":"dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,admin,rule_creator","featuresDis":["Admin","Dashboards","Explorer","File Upload","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","pod"],"name":"Siemens prod60","selected":false},{"features":"Dashboards,Health Check,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Admin","featureKey":"dashboards,healthcheck,file_upload,rules_and_alerts,explorer,logvault,workbench,admin","featuresDis":["Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rules & Alerts","Workbench"],"mps":["siemens","siemens","prod"],"name":"Siemens prodv10","selected":false}],"featuresAssigned":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"prodAssigned":["SIEMENS-POD","Siemens prod60","Siemens prodv10"],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}
      component.openModal('addeditendcust', globalObj.editEndCustomerType, '' as any);
      component.selectedGroups = [
        {
          "mfr": "siemens",
          "prod": "siemens",
          "sch": "podui",
          "endcustomer_name": "GroupA",
          "serial_number": [],
          "created_by": "siemensqa@glassbeam.com",
          "updated_on": new Date('2020-08-24T11:56:08Z'),
          "group_name": [],
          "rowIndex": 0,
          "selected": true,
          "disabled": false,
          "product": "SIEMENS-POD"
        }]
      component.editVals.groups = ["GroupA", "760806SCOC", "abc"]
      component.closeEndCustomerModal();
      expect(modalservice._modalStack._modalRefs[1]._contentRef.componentRef.instance.msg).toEqual(messages.changeAlert);
    });

    it('addEndCustSubmit | rulessubscription', () => {
      component.editEndUserMode = true;
      component.addEditEndCustForm.patchValue({
        sendNotification: true
      });
      let service = TestBed.get(AdminService);
      component.addEditEndCustForm.patchValue({
        endCustomerName: "John",
        prodName: "Siemens",
        SelectedSysIdname: ["CT123", "CT4567"]
      });
      let api_success = { "Status": "Success", "Msg": "End customer Nishanth added successfully", "Data": "" };
      spyOn(service, 'post').and.returnValue(of(api_success));
      component.addEndCustSubmit();
      expect(service.post).toHaveBeenCalled();
    });

    // it('rowClick', () => {
    //   var event = { preventDefault: jasmine.createSpy(), srcElement: jasmine.createSpy() };
    //   let row = {name: '1', selected: false, rowIndex: 0};
    //   let list = [{name: '1', selected: false, rowIndex: 0},{name: '2', selected: false, rowIndex: 1}];
    //   component.rowClick(event, row, list);
    //   expect(component.clearAll(list)).toHaveBeenCalled();
    // })
}); 
