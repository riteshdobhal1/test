import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { UserComponent } from './user.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopupComponent } from '../../shared/confirmation-popup/confirmation-popup.component';
import { AdminService } from 'src/app/services/admin/admin.service';
import { LicensesData, User, RoleProdList, TableauUser } from './model';
import { Observable, of, Observer } from 'rxjs';
import * as _ from 'lodash';
import * as userGlobals from './global';
import * as messages from '../../shared/message';
import { SortableDirective, SortEvent } from '../../shared/directives/sortable.directive';
import {onscreen} from '../../shared/onscreen';


describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userData = {
    "email": "test2@gmail.com",
    "first_name": "test2",
    "last_name": " ",
    "name": "",
    "status": "",
    "userType": "",
    "wb_user_name": "test2@gmail.com",
    "report_usage": false,
    "org": "siemens",
    "role": "siemens_siemens_podui_test_wb_role",
    "realm_def": "dev.glassbeam.com",
    "end_customer": "",
    "mps_def": "siemens/siemens/podui",
    "dashboard_admin": false,
    "user_state": 'ACTIVE',
    "token_id": "$2a$10$grSOsNJjSdy3yAE8x74AJe1UZMCMH4igODyMnWgxVJ56kiOWlsneO",
    "phone": "+91-9731827443",
    "city": "",
    "state": "",
    "country": "",
    "department": "",
    "created_on": "2019-10-31T10:53:25Z",
    "modified_on": "2019-10-31T10:55:48Z",
    "last_login": null,
    "is_external": false,
    "roleName": "test_wb_role",
    "adminUser": false,
    "selected": false,
    "countryCode": 0
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, NgbModule, RouterTestingModule],
      providers: [NgbModal, onscreen],
      declarations: [UserComponent, LoaderComponent, ConfirmationPopupComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmationPopupComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    document.cookie = "mps='siemens/siemens/podui'";
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.roleList = [{
			"name": "siemens_siemens_podui_test_wb_role",
			"disName": "test_wb_role",
			"featureData": [{
				"features": "Dashboards,Dashboard Admin,Workbench,Logvault,Viewer",
				"featureKey": "dashboards,dashboard_admin,workbench,logvault,viewer",
				"featuresDis": [
					"Dashboard Admin",
					"Dashboards",
					"Logvault",
					"Workbench",
					"Viewer"
				],
				"mps": [
					"siemens",
					"siemens",
					"podui"
				],
				"name": "Siemens",
        "selected": false,
        "mps_def": "siemens/siemens/podui"
			}],
			"roleType": "Internal"
		}, {
			"name": "siemens_siemens_podui_admin",
			"disName": "admin",
			"featureData": [{
					"features": "Admin,Dashboards,File Upload,Rules & Alerts, explorer,Logvault,Workbench,Rule Creator,Health Check,Dashboard Admin,Creator,Viewer",
					"featureKey": "admin,dashboards,file_upload,rules_and_alerts, explorer,logvault,workbench,rule_creator,healthcheck,dashboard_admin,wb_creator,viewer",
					"featuresDis": [
						"Explorer",
						"Admin",
						"Creator",
						"Dashboard Admin",
						"Dashboards",
						"File Upload",
						"Health Check",
						"Logvault",
						"Rule Creator",
						"Rules & Alerts",
						"Workbench",
						"Viewer"
					],
					"mps": [
						"siemens",
						"siemens",
						"podui"
					],
					"name": "Siemens",
          "selected": false,
          "mps_def": "siemens/siemens/podui"
				},
				{
					"features": "Admin,Explorer,Logvault",
					"featureKey": "admin,explorer,logvault",
					"featuresDis": [
						"Admin",
						"Explorer",
						"Logvault"
					],
					"mps": [
						"siemens",
						"siemens",
						"pod"
					],
					"name": "Siemens Pod",
          "selected": false,
          "mps_def": "siemens/siemens/pod"
				}, {
					"features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Admin,Health Check,Viewer",
					"featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,admin,healthcheck,viewer",
					"featuresDis": [
						"Admin",
						"Dashboards",
						"Explorer",
						"File Upload",
						"Health Check",
						"Logvault",
						"Rules & Alerts",
						"Viewer"
					],
					"mps": [
						"siemens",
						"siemens",
						"pod60"
					],
					"name": "Siemens Prod 60",
          "selected": false,
          "mps_def": "siemens/siemens/pod60"
				}
			],
			"roleType": "Internal"
		},
		{
			"name": "siemens_siemens_podui_test_db_role",
			"disName": "test_db_role",
			"featureData": [{
				"features": "Dashboards,Dashboard Admin,Logvault,Explorer",
				"featureKey": "dashboards,dashboard_admin,logvault,explorer",
				"featuresDis": [
					"Dashboard Admin",
					"Dashboards",
					"Logvault",
					"Viewer"
				],
				"mps": [
					"siemens",
					"siemens",
					"podui"
				],
				"name": "Siemens",
        "selected": false,
        "mps_def": "siemens/siemens/podui"
			}],
			"roleType": "Internal"
    },
    {
			"name": "siemens_siemens_podui_test_wb_role",
			"disName": "test_db_role",
			"featureData": [{
				"features": "Dashboards,Dashboard Admin,Logvault,Explorer,Workbench",
				"featureKey": "dashboards,dashboard_admin,logvault,explorer,workbench",
				"featuresDis": [
					"Dashboard Admin",
					"Dashboards",
					"Logvault",
          "Viewer",
          "Workbench"
				],
				"mps": [
					"siemens",
					"siemens",
					"podui"
				],
				"name": "Siemens",
        "selected": false,
        "mps_def": "siemens/siemens/podui"
			}],
			"roleType": "Internal"
    },
    {
			"name": "siemens_siemens_podui_test_creator_role",
			"disName": "test_db_role",
			"featureData": [{
				"features": "Dashboards,Dashboard Admin,Logvault,Explorer,Creator",
				"featureKey": "dashboards,dashboard_admin,logvault,explorer,creator",
				"featuresDis": [
					"Dashboard Admin",
					"Dashboards",
					"Logvault",
          "Viewer",
          "Creator"
				],
				"mps": [
					"siemens",
					"siemens",
					"podui"
				],
				"name": "Siemens",
        "selected": false,
        "mps_def": "siemens/siemens/podui"
			}],
			"roleType": "Internal"
		}
	]
    let service = TestBed.get(AdminService);
    service.roleList = component.roleList;
    component.users = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": false,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": false,
      "countryCode": 0
    }];

    component.userFilterData = [
      {
        "columnName": "email",
        "columnTitle": "Email",
        "data": [
          {
            "name": "extuser@gmail.com",
            "selected": true
          },
          {
            "name": "siemensqa@glassbeam.com",
            "selected": false
          }
        ],
        "multiselect": true,
        "isDateType": false,
        "showSearch": false,
        "enabled": false
      },
      {
        "columnName": "roleName",
        "columnTitle": "Role",
        "data": [
          {
            "name": "external_test_role",
            "selected": false
          },
          {
            "name": "admin",
            "selected": false
          }
        ],
        "multiselect": true,
        "isDateType": false,
        "showSearch": false,
        "enabled": false
      },
      {
        "columnName": "end_customer",
        "columnTitle": "System Group",
        "data": [
          {
            "name": "Group A",
            "selected": false
          },
          {
            "name": "NA",
            "selected": false
          }
        ],
        "multiselect": true,
        "isDateType": false,
        "showSearch": false,
        "enabled": false
      },
      {
        "columnName": "created_on",
        "columnTitle": "Created On",
        "data": [
          {
            "name": "Last 24 Hrs",
            "value": "24hrs",
            "checked": false
          },
          {
            "name": "Last Week",
            "value": "week",
            "checked": false
          },
          {
            "name": "Last Month",
            "value": "month",
            "checked": false
          },
          {
            "name": "Last 6 Month",
            "value": "6month",
            "checked": false
          }
        ],
        "multiselect": false,
        "isDateType": true,
        "showSearch": false,
        "enabled": false
      },
      {
        "columnName": "modified_on",
        "columnTitle": "Modified On",
        "data": [
          {
            "name": "Last 24 Hrs",
            "value": "24hrs",
            "checked": false
          },
          {
            "name": "Last Week",
            "value": "week",
            "checked": false
          },
          {
            "name": "Last Month",
            "value": "month",
            "checked": false
          },
          {
            "name": "Last 6 Month",
            "value": "6month",
            "checked": false
          }
        ],
        "multiselect": false,
        "isDateType": true,
        "showSearch": false,
        "enabled": false
      },
      {
        "columnName": "last_login",
        "columnTitle": "Last Login",
        "data": [
          {
            "name": "Last 24 Hrs",
            "value": "24hrs",
            "checked": false
          },
          {
            "name": "Last Week",
            "value": "week",
            "checked": false
          },
          {
            "name": "Last Month",
            "value": "month",
            "checked": false
          },
          {
            "name": "Last 6 Month",
            "value": "6month",
            "checked": false
          }
        ],
        "multiselect": false,
        "isDateType": true,
        "showSearch": false,
        "enabled": false
      },
      {
        "columnName": "status",
        "columnTitle": "Status",
        "data": [
          {
            "name": "ACTIVE",
            "selected": false
          },
          {
            "name": "INACTIVE",
            "selected": false
          },
          {
            "name": "INVITED",
            "selected": false
          }
        ],
        "multiselect": false,
        "isDateType": false,
        "showSearch": false,
        "enabled": false
      },
      {
        "columnName": "user_type",
        "columnTitle": "User Type",
        "data": [
          {
            "name": "Internal",
            "selected": false
          },
          {
            "name": "External",
            "selected": false
          }
        ],
        "multiselect": false,
        "isDateType": false,
        "showSearch": false,
        "enabled": false
      }
    ]

    component.currentUser = {
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": false,
      "countryCode": 0
    }
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and ngoninit', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'resetUserForm').and.returnValue();
    spyOn(component, 'resetChangePasswordForm').and.returnValue();
    spyOn(component, 'resetBulkEditForm').and.returnValue();
    spyOn(component, 'getLoggedInUserData').and.returnValue();
    component.ngOnInit();
    expect(component.resetUserForm).toHaveBeenCalled();
    expect(component.resetChangePasswordForm).toHaveBeenCalled();
    expect(component.getLoggedInUserData).toHaveBeenCalled();
    expect(component.resetBulkEditForm).toHaveBeenCalled();
  });

  it('should getLoggedInUserData', () => {
    let service = TestBed.get(AdminService);
    let retValue = '{"Status":"Success","Msg":"List all information for a user","Data":{"user":[{"email":"siemensqa@glassbeam.com","first_name":"Admin","end_customer":"NA","org":"siemens","role":"siemens_siemens_podui_admin","last_name":"User","def_passwd":false,"department":"NA","sso":false,"wb_user_name":"NA","report_usage":false,"created_on":"Mon Nov 04 10:04:46 IST 2019","user_state": "ACTIVE","city":"NA","state":"NA","country":"NA","is_external":false,"mps_def":"siemens/siemens/podui","org_type":10,"show_info":false,"events_export_limit":0,"dashboard_admin":false}],"role_details":{"name":"siemens_siemens_podui_admin","is_super":false,"domains":{"Siemens":"siemens/siemens/podui","Siemens Pod":"siemens/siemens/pod","Siemens Prod 60":"siemens/siemens/pod60"},"features":{"siemens/siemens/pod":"admin,explorer,logvault","siemens/siemens/pod60":"dashboards,file_upload,rules_and_alerts,explorer,logvault,admin,healthcheck","siemens/siemens/podui":"admin,dashboards,file_upload,rules_and_alerts, explorer,logvault,workbench,rule_creator,healthcheck,dashboard_admin,wb_creator"},"realm_isdomain":{"prod":"http://dev.glassbeam.com:9000/v1"},"realm_uidomain":{"prod":"dev.glassbeam.com"},"mps_uidomain":{"siemens/siemens/podui":"dev.glassbeam.com"},"mps_isdomain":{"siemens/siemens/podui":"http://dev.glassbeam.com:9000/v1"},"realm_appsversion":{"siemens/siemens/podui":null},"realm":["prod"],"studio_proj_limit":0},"max_users":0,"max_licensed_users":0,"max_creator_licenses":0}}';
    spyOn(service, 'fetchLoggedInUserDetails').and.returnValue(of(JSON.parse(retValue)));
    component.getLoggedInUserData();
    spyOn(service, 'setLoggedInUserDetails').and.returnValue(of(JSON.parse(retValue)));
    let roleResponse = '{"Status":"Success","Msg":"list of all Users","Data":[{"name":"siemens_siemens_podui_admin","realm_uidomain":{"prod":"dev.glassbeam.com"},"mps_uidomain":{"siemens/siemens/podui":"dev.glassbeam.com","siemens/siemens/pod60":"dev.glassbeam.com"},"featureData":[{"features":"Admin,Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Workbench,Rule Creator,Health Check,Dashboard Admin,Creator","featureKey":"admin,dashboards,file_upload,rules_and_alerts,explorer,logvault,workbench,rule_creator,healthcheck,dashboard_admin,wb_creator","featuresDis":["Admin","Creator","Dashboard Admin","Dashboards","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts","Workbench"],"mps":["siemens","siemens","podui"],"name":"Siemens","selected":false},{"features":"Admin,File Upload,Rules & Alerts,Explorer,Logvault,Rule Creator,Health Check","featureKey":"admin,file_upload,rules_and_alerts,explorer,logvault,rule_creator,healthcheck","featuresDis":["Admin","Explorer","File Upload","Health Check","Logvault","Rule Creator","Rules & Alerts"],"mps":["siemens","siemens","pod60"],"name":"Siemens_pod","selected":false}],"selected":false,"colapsed":true,"DisName":"admin","roleType":"Internal"}]}'
    spyOn(service, 'getRoleList').and.returnValue(of(JSON.parse(roleResponse)));
    let endCustomerResponse = '{"Status":"Success","Msg":"Count of all ecs for siemens","Data":[{"mfr":"siemens","prod":"siemens","sch":"podui","endcustomer_name":"group A","serial_number":["CT60503","CT64103"],"created_by":"siemensqa@glassbeam.com","updated_on":"2019-10-30T06:27:13Z"}]}';
    spyOn(service, 'getendCustomerList').and.returnValue(of(JSON.parse(endCustomerResponse)));
    spyOn(component, 'getUserList').and.returnValue();
    component.getUserList();
    expect(component.getUserList).toHaveBeenCalled();
  });

  it('should getUserList', () => {
    let service = TestBed.get(AdminService);
    let filterData = userGlobals.userFilterArray;
    spyOn(service, 'getRoleListArray').and.returnValue(of(component.roleList));
    expect(component.roleList).toEqual(component.roleList);
    spyOn(service, 'getUserList').and.returnValue(of(component.users));
    component.getUserList();
    expect(component.users.length).toBeGreaterThan(0);
    expect(component.userFilterData.length).toBeGreaterThan(0);
    component.collectionSize = component.users.length;
    expect(component.collectionSize).toBeGreaterThan(0);
  });

  // it('open Modal', () => {
  //   spyOn(component , 'resetUserForm');
  //   component.openModal('','', '', '');
  //   expect(component.resetUserForm).toHaveBeenCalled();
  //   expect(component.isEditMode).toEqual(false);
  //   spyOn(component, 'editUser');
  //   component.openModal('','', 'edit', userData);
  //   expect(component.isEditMode).toBe(true);
  //   expect(component.editUser).toHaveBeenCalled();
  // });

  it('open modal | user', () => {
    spyOn(component, 'resetUserForm');
    component.openModal('user', '', '', '');
    expect(component.resetUserForm).toHaveBeenCalled();
    expect(component.isEditMode).toBe(false);
  });

  it('open modal | edit user', () => {
    spyOn(component, 'editUser');
    component.openModal('user', '', 'edit', '');
    expect(component.isEditMode).toBe(true);
    expect(component.editUser).toHaveBeenCalled();
  });

  it('open modal | password', () => {
    spyOn(component, 'resetChangePasswordForm');
    component.openModal('password', '', '', '');
    expect(component.resetChangePasswordForm).toHaveBeenCalled();
  });

  it('open modal | bulkEdit', () => {
    spyOn(component, 'resetBulkEditForm');
    spyOn(component, 'setBulkEditValidators');
    spyOn(component, 'setBulkEditRoles');
    spyOn(component, 'setBulkEditWBRoleCount');
    component.openModal('bulkEdit', '', '', '');
    expect(component.resetBulkEditForm).toHaveBeenCalled();
    expect(component.setBulkEditValidators).toHaveBeenCalled();
    expect(component.setBulkEditRoles).toHaveBeenCalled();
    expect(component.setBulkEditWBRoleCount).toHaveBeenCalled();
  });

  it('editUser', () => {
    spyOn(component, 'filterRoles');
    spyOn(component, 'getProductsForRole');
    spyOn(component, 'getEndCustomerList');
    component.editUser('', userData);
    expect(component.user).toEqual(userData);
    expect(component.userForm.controls['firstName'].value).toEqual(userData.first_name);
    expect(component.userForm.controls['lastName'].value).toEqual(userData.last_name);
    expect(component.userForm.controls['email'].value).toEqual(userData.email);
    expect(component.userForm.controls['phone'].value).toEqual('9731827443');
    expect(component.userForm.controls['department'].value).toEqual(userData.department);
    expect(component.userForm.controls['state'].value).toEqual(userData.state);
    expect(component.userForm.controls['city'].value).toEqual(userData.city);
    expect(component.userForm.controls['country'].value).toEqual(userData.country);
    expect(component.userForm.controls['role'].value).toEqual('');
    expect(component.userForm.controls['default_prod'].value).toEqual('');
    expect(component.userForm.controls['is_external'].value).toEqual(userData.is_external);
    expect(component.userForm.controls['end_customer'].value).toEqual('');
    expect(component.filterRoles).toHaveBeenCalled();
    expect(component.getProductsForRole).toHaveBeenCalled();
    expect(component.getEndCustomerList).toHaveBeenCalled();
  });

  it('setTableauUserInfo', () => {
    let res = component.setTableauUserInfo(userData);
    expect(res.length).toBe(1);
  });

  it('setTableauUserRoleType', () => {
    let roleProd = {
      "features": "Dashboards,Dashboard Admin,Workbench,Logvault",
      "featureKey": "dashboards,dashboard_admin,workbench,logvault",
      "featuresDis": [
        "Dashboard Admin",
        "Dashboards",
        "Logvault",
        "Workbench"
      ],
      "mps": [
        "siemens",
        "siemens",
        "podui"
      ],
      "name": "Siemens",
      "selected": false
    };
    let res = component.setTableauUserRoleType(roleProd);
    expect(res).toEqual('SiteAdministratorExplorer');
  });

  it('patchUserFormValuesForFilteringRoles', () => {
    component.patchUserFormValuesForFilteringRoles();
    expect(component.userForm.controls['role'].value).toEqual('');
    expect(component.userForm.controls['default_prod'].value).toEqual('');
    expect(component.userForm.controls['end_customer'].value).toEqual('');
  });

  it('filterRoles Internal', () => {
    component.filterRoles();
    expect(component.roleList.length).toBeGreaterThan(0);
  });

  it('filterRoles External', () => {
    component.roleList = [
      {
        "name": "siemens_siemens_podui_test_wb_role",
        "disName": "test_wb_role",
        "featureData": [
          {
            "features": "Healthcheck",
            "featureKey": "healthcheck",
            "featuresDis": ["Healthcheck"],
            "mps": [
              "siemens",
              "siemens",
              "podui"
            ],
            "name": "Siemens",
            "selected": false
          }
        ],
        "roleType": "External"
      }
    ]
    component.userForm.patchValue({
      is_external: true
    });
    component.filterRoles();
    expect(component.roleList.length).toBe(1);
  });

  it('getProductsForRole', () => {
    component.userForm.patchValue({
      role: 'siemens_siemens_podui_test_wb_role'
    });
    component.getProductsForRole(component.userForm,userData);
    expect(component.prodList.length).toBeGreaterThan(0);
  });

  it('saveUser | Save User > No mandatory fields set > Form Should Be invalid', () => {
    component.saveUser();
    expect(component.userForm.controls['firstName'].status).toEqual('INVALID');
    expect(component.userForm.controls['email'].status).toEqual('INVALID');
    expect(component.userForm.controls['role'].status).toEqual('INVALID');
    expect(component.userForm.controls['default_prod'].status).toEqual('INVALID');
    expect(component.userForm.status).toEqual('INVALID');
  });

  it('saveUser | Save User > One or more mandatory fields set > Form Should Be invalid', () => {
    component.userForm.patchValue({
      firstName: 'Sneha'
    })
    component.saveUser();
    expect(component.userForm.controls['firstName'].status).toEqual('VALID');
    expect(component.userForm.controls['email'].status).toEqual('INVALID');
    expect(component.userForm.controls['role'].status).toEqual('INVALID');
    expect(component.userForm.controls['default_prod'].status).toEqual('INVALID');
    expect(component.userForm.status).toEqual('INVALID');
  });

  it('saveUser | Save User > All mandatory fields set > Form Should Be valid', () => {
    let service = TestBed.get(AdminService);
    let res = JSON.parse('{"Status":"Success","Msg":"User added Successfully","Data":""}');
    spyOn(service, 'post').and.returnValue(of(res));
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 3;
    component.licensesData.maxCreatorLicenses = 3;
    component.licensesData.workbenchLicensedUsed = 2;
    component.licensesData.creatorLicensesUsed = 1;
    component.userForm.patchValue({
      firstName: 'Sneha',
      email: 'test@gmail.com',
      role: 'siemens_siemens_podui_admin',
      default_prod: 'siemens/siemens/podui'
    })
    expect(component.userForm.controls['firstName'].status).toEqual('VALID');
    expect(component.userForm.controls['email'].status).toEqual('VALID');
    expect(component.userForm.controls['role'].status).toEqual('VALID');
    expect(component.userForm.controls['default_prod'].status).toEqual('VALID');
    expect(component.userForm.status).toEqual('VALID');
    component.saveUser();
    expect(service.post).toHaveBeenCalled();
  });
  //Need To Fix
  // it('saveUser | Save User > All mandatory fields set > Form is valid but wb licenses are used', () => {
  //   component.licensesData.maxUsers = 5;
  //   component.licensesData.maxWBLicenses = 3;
  //   component.licensesData.maxCreatorLicenses = 3;
  //   component.licensesData.maxViewerLicenses = 3;
  //   component.licensesData.workbenchLicensedUsed = 3;
  //   component.licensesData.creatorLicensesUsed = 1;
  //   component.userForm.patchValue({
  //     firstName: 'Sneha',
  //     email: 'test@gmail.com',
  //     role: 'siemens_siemens_podui_admin',
  //     default_prod: 'siemens/siemens/podui'
  //   });
  //   component.saveUser();
  //   expect(component.errorMessage).toEqual(messages.userLicenseExceedText.workbench);
  //   expect(component.submitted).toBeFalsy();
  // });

  it('saveUser | Save User > All mandatory fields set > Form is valid but creator licenses are used', () => {
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 3;
    component.licensesData.maxCreatorLicenses = 1;
    component.licensesData.workbenchLicensedUsed = 2;
    component.licensesData.creatorLicensesUsed = 1;
    let creatorLicensesUsed = true;
    component.userForm.patchValue({
      firstName: 'Sneha',
      email: 'test@gmail.com',
      role: 'siemens_siemens_podui_admin',
      default_prod: 'siemens/siemens/podui'
    });
    component.saveUser();
    expect(component.errorMessage).toEqual(messages.userLicenseExceedText.creator);
    expect(component.submitted).toBeFalsy();
  });

  it('disableUser', () => {
    let service = TestBed.get(AdminService);
    let res = JSON.parse('{"Status":"Success","Msg":"User Disabled Successfully","Data":""}');
    spyOn(service, 'post').and.returnValue(of(res));
    component.disableUser(userData);
    expect(service.post).toHaveBeenCalled();
  });

  it('enableUser', () => {
    let service = TestBed.get(AdminService);
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 3;
    component.licensesData.maxCreatorLicenses = 3;
    component.licensesData.workbenchLicensedUsed = 2;
    component.licensesData.creatorLicensesUsed = 1;
    component.licensesData.viewerLicensesUser = 3;
    let res = JSON.parse('{"Status":"Success","Msg":"User Enabled Successfully","Data":""}');
    spyOn(service, 'post').and.returnValue(of(res));
    component.enableUser(userData);
    expect(service.post).toHaveBeenCalled();

  });

  it('OpenConfirmation', () => {
    let modalservice = TestBed.get(NgbModal);
    component.openConfirmation('', '');
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.msg).toEqual(messages.deleteUserMsgMultiple);
  });

  it('openEnableDisableUserConfirmation | active', () => {
    let userData = {
      "email": "test2@gmail.com",
      "first_name": "test2",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "test2@gmail.com",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_test_wb_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$grSOsNJjSdy3yAE8x74AJe1UZMCMH4igODyMnWgxVJ56kiOWlsneO",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-31T10:53:25Z",
      "modified_on": "2019-10-31T10:55:48Z",
      "last_login": null,
      "is_external": false,
      "roleName": "test_wb_role",
      "adminUser": false,
      "selected": false
    };
    let modalservice = TestBed.get(NgbModal);
    component.openEnableDisableUserConfirmation(userData);
    let messageRes = messages.disableUserMsg + userData.email + '?';
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.msg).toEqual(messageRes);
  });

  it('openEnableDisableUserConfirmation | inactive', () => {
    let userData = {
      "email": "test2@gmail.com",
      "first_name": "test2",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "test2@gmail.com",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_test_wb_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$grSOsNJjSdy3yAE8x74AJe1UZMCMH4igODyMnWgxVJ56kiOWlsneO",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-31T10:53:25Z",
      "modified_on": "2019-10-31T10:55:48Z",
      "last_login": null,
      "is_external": false,
      "roleName": "test_wb_role",
      "adminUser": false,
      "selected": false
    };
    let modalservice = TestBed.get(NgbModal);
    component.openEnableDisableUserConfirmation(userData);
    let messageRes = messages.enableUserMsg + userData.email + '?';
    expect(modalservice._modalStack._modalRefs[0]._contentRef.componentRef.instance.msg).toEqual(messageRes);
  });

  it('allUserSelected more than one user in user list', () => {
    component.allUsersSelected();
    expect(component.isSelectAll).toEqual(false);
  });

  it('allUserSelected more than one users in user list and selected', () => {
    component.users = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.allUsersSelected();
    expect(component.isSelectAll).toEqual(true);
  });

  it('userToggleSelect', () => {
    component.userToggleSelect();
    expect(component.users[1].selected).toEqual(true);
  });

  it('userPageChanged', () => {
    spyOn(component, 'allUsersSelected');
    component.allUsersSelected();
    expect(component.allUsersSelected).toHaveBeenCalled();
  });

  it('getActionButtonDisable | Delete Button To Be Disabled', () => {
    let res = component.getActionButtonDisable('del');
    expect(res).toBeTruthy();
  });

  it('getActionButtonDisable | Delete Button To Be Disabled', () => {
    component.users = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": false,
      "countryCode": 0
    }];
    let res = component.getActionButtonDisable('del');
    expect(res).toBeFalsy();
  });

  it('openChangePasswordModal', () => {
    spyOn(component, 'resetChangePasswordForm');
    component.openChangePasswordModal('');
    component.openModal('', '', '', '');
    expect(component.resetChangePasswordForm).toHaveBeenCalled();
  });

  it('savePassword | passwords match', () => {
    let service = TestBed.get(AdminService);
    let res = JSON.parse('{"Status":"Success","Msg":"User Enabled Successfully","Data":""}');
    spyOn(service, 'post').and.returnValue(of(res));
    component.changePasswordForm.patchValue({
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#'
    })
    expect(component.resetPassError).toEqual('');
    component.savePassword();
    expect(service.post).toHaveBeenCalled();
  });

  it('savePassword | passwords do not match', () => {
    component.changePasswordForm.patchValue({
      password: 'Test123!@#a',
      confirmPassword: 'Test123!@#'
    })
    component.savePassword();
    expect(component.resetPassError).toEqual(messages.passwordMatchError);
  });

  it('savePassword | passwords regex error', () => {
    component.changePasswordForm.patchValue({
      password: 'test123',
      confirmPassword: 'test123'
    })
    component.savePassword();
    expect(component.resetPassError).toEqual(messages.passwordNotValid);
  });

  it('getEndCustomerList', () => {
    let service = TestBed.get(AdminService);
    component.userForm.patchValue({
      is_external: true,
      default_prod: 'siemens/siemens/podui'
    })
    spyOn(service, 'getEndCustomerListForUser').and.returnValue([]);
    component.getEndCustomerList('');
    expect(component.getEndCustomerList.length).toBe(1);
  });

  it('getSelectedValues | if any selected', () => {
    const list = [
      {
        "name": "ext1@gma",
        "selected": true
      },
      {
        "name": "siemensqa@glassbeam.com",
        "selected": false
      },
      {
        "name": "test1@gmail.com",
        "selected": false
      }
    ]
    let res = component.getSelectedValues(list);
    expect(res.length).toBeGreaterThan(0);

  });

  it('getSelectedValues | if none selected', () => {
    const list = [
      {
        "name": "extuser@gmail.com",
        "selected": false
      },
      {
        "name": "siemensqa@glassbeam.com",
        "selected": false
      }
    ]
    let res = component.getSelectedValues(list);
    expect(res.length).toEqual(0);
  });

  it('updateDataFilter | filter user data for multiselect true', () => {
    let columnVal = 'extuser@gmail.com';
    let selected = true;
    let multiselect = true;
    let actualData = [
      {
        "name": "extuser@gmail.com",
        "selected": true
      },
      {
        "name": "siemensqa@glassbeam.com",
        "selected": false
      }
    ];
    let columnName = 'email';
    component.userListCopy = _.cloneDeep(component.users);
    spyOn(component, 'setFilterData');
    component.updateDataFilter(columnVal, selected, multiselect, actualData, columnName);
    expect(component.setFilterData).toHaveBeenCalled();
    // expect(component.users.length).toBeGreaterThan(0);
  });

  it('updateDataFilter | filter user data for multiselect false', () => {
    let columnVal = 'External';
    let selected = true;
    let multiselect = false;
    let actualData = [
      {
        "name": "Internal",
        "selected": false
      },
      {
        "name": "External",
        "selected": true
      }
    ];
    let columnName = 'user_type';
    component.userListCopy = _.cloneDeep(component.users);
    spyOn(component, 'setFilterData');
    component.updateDataFilter(columnVal, selected, multiselect, actualData, columnName);
    // expect(component.users.length).toBeGreaterThan(0);
    expect(component.setFilterData).toHaveBeenCalled();
  });

  it('updateDataFilter | quick filter', () => {
    let columnVal = 'External';
    let selected = false;
    let multiselect = false;
    let actualData = [
      {
        "name": "Internal",
        "selected": false
      },
      {
        "name": "External",
        "selected": false
      }
    ];
    let columnName = 'user_type';
    component.userListCopy = _.cloneDeep(component.users);
    component.updateDataFilter(columnVal, selected, multiselect, actualData, columnName);
    expect(component.users.length).toBeGreaterThan(0);
  });

  it('setFilterData | endCustomer', () => {
    let columnData = component.users[0];
    let columnName = 'end_customer';
    let columnValList = ['group A'];
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });
  //No Code block in component file so commenting
  // it('setFilterData | time based filter', () => {
  //   let columnData = component.users[0];
  //   let columnName = 'created_on';
  //   let columnValList = ['Last 6 Months'];
  //   let res = component.setFilterData(columnData, columnName, columnValList);
  //   expect(res).toBe(true);
  // });

  it('setFilterData | status active', () => {
    let columnData = component.users[0];
    let columnName = 'status';
    let columnValList = ['Active'];
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });

  it('setFilterData | status inactive', () => {
    let columnData = component.users[1];
    let columnName = 'status';
    let columnValList = ['Inactive'];
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });

  it('setFilterData | user type external', () => {
    let columnData = component.users[0];
    let columnName = 'user_type';
    let columnValList = ['External'];
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });

  it('setFilterData | user type internal', () => {
    let columnData = component.users[1];
    let columnName = 'user_type';
    let columnValList = ['Internal'];
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });

  it('setFilterData | default case', () => {
    let columnData = component.users[0];
    let columnName = 'email';
    let columnValList = ['extuser@gmail.com'];
    let res = component.setFilterData(columnData, columnName, columnValList);
    expect(res).toBe(true);
  });

  it('Onsort direction desc', () => {
    let param: SortEvent = {
      column: "email",
      direction: "desc"
    };
    component.onSort(param);
    let res = [{
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": false,
      "countryCode": 0
    }, {
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": false,
      "countryCode": 0
    }
    ];
    expect(component.users).toEqual(res);
  });

  it('Onsort direction empty direction', () => {
    let param: SortEvent = {
      column: "email",
      direction: ""
    };
    component.onSort(param);

    expect(component.users).toEqual(component.users);
  });

  it('isInTimerange Last 24 Hrs ', () => {
    let timeRange = "Last 24 Hrs";
    let targetDateTime = "2019-11-15T05:49:47Z"
    let result = component.isInTimerange(timeRange, targetDateTime);
    expect(result).toEqual(false);
  });

  xit('isInTimerange Last Week ', () => {
    let timeRange = "Last Week";
    let targetDateTime = "2019-11-15T05:49:47Z";
    let result = component.isInTimerange(timeRange, targetDateTime);
    expect(result).toEqual(true);
  });

  it('isInTimerange Last Month ', () => {
    let timeRange = "Last Month";
    let targetDateTime = "2019-11-15T05:49:47Z"
    let result = component.isInTimerange(timeRange, targetDateTime);
    expect(result).toEqual(false);
  });

  it('isInTimerange Last 6 Month', () => {
    let timeRange = "Last 6 Months";
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate()-179);
    let targetDateTime = tempDate.toJSON();
    let result = component.isInTimerange(timeRange, targetDateTime);
    expect(result).toEqual(true);
  });

  it('resetFilter', () => {
    component.quickFilterButtons = userGlobals.quickFilter;
    component.userListCopy = _.cloneDeep(component.users);
    component.resetFilter();
    expect(component.filterCount).toEqual(0);
  });

  it('getUserListFiltered | for searchText length less than 3', () => {
    component.searchText = 'e';
    let res = component.getUserListFiltered();
    expect(res.length).toEqual(component.users.length);
  });

  it('getUserListFiltered | for searchText length greater than or equal to 3', () => {
    component.searchText = 'ext';
    let res = component.getUserListFiltered();
    expect(res.length).toBeGreaterThan(0);
  });

  it('getFilterData | searchtext greater than or equal to 3', () => {
    let filter = {
      "columnName": "email",
      "columnTitle": "Email",
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
      "columnName": "email",
      "columnTitle": "Email",
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

  it('resetBulkEditForm', () => {
    component.resetBulkEditForm();
    expect(component.submitted).toBe(false);
  });

  it('applyQuickFilter', () => {
    spyOn(component, 'updateDataFilter')
    var btnData = {
      "title": "Internal",
      "columnValue": "Internal",
      "columnName": "user_type",
      "selected": false
    }
    component.applyQuickFilter(btnData);
    expect(component.updateDataFilter).toHaveBeenCalled();
  });

  it('enable bulk edit', () => {
    component.users = [{
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": true,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }, {
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    let res = component.enableBulkEdit();
    expect(res).toBe(false);
  });

  it('setBulkEditRoles Internal', () => {
    component.quickFilterButtons = [{
      title: 'All',
      columnValue: "*",
      columnName: 'user_type',
      selected: false
    }, {
      title: 'Internal',
      columnValue: 'Internal',
      columnName: 'user_type',
      selected: true
    }, {
      title: 'External',
      columnValue: 'External',
      columnName: 'user_type',
      selected: false
    }];
    component.setBulkEditRoles();
    expect(component.roles.length).toBeGreaterThan(0);
  });

  it('setBulkEditRoles External', () => {
    component.quickFilterButtons = [{
      title: 'All',
      columnValue: "*",
      columnName: 'user_type',
      selected: false
    }, {
      title: 'Internal',
      columnValue: 'Internal',
      columnName: 'user_type',
      selected: false
    }, {
      title: 'External',
      columnValue: 'External',
      columnName: 'user_type',
      selected: true
    }];
    component.roleList = [
      {
        "name": "siemens_siemens_podui_test_wb_role",
        "disName": "test_wb_role",
        "featureData": [
          {
            "features": "Healthcheck",
            "featureKey": "healthcheck",
            "featuresDis": ["Healthcheck"],
            "mps": [
              "siemens",
              "siemens",
              "podui"
            ],
            "name": "Siemens",
            "selected": false
          }
        ],
        "roleType": "External"
      }
    ]
    component.setBulkEditRoles();
    expect(component.roleList.length).toBe(1);
  });

  it('setBulkEditValidators | role', () => {
    component.setBulkEditValidators();
    component.bulkEditForm.patchValue({
      role: 'siemens_siemens_podui_test_wb_role'
    });
    expect(component.bulkEditForm.get('product').valid).toBe(false);
  });

  it('setBulkEditValidators | password', () => {
    component.setBulkEditValidators();
    component.bulkEditForm.patchValue({
      password: 'blah'
    });
    expect(component.bulkEditForm.get('confirmPassword').valid).toBe(false);
  });

  it('setBulkEditValidators | endcustomer', () => {
    component.bulkEditUserType = 'external';
    component.setBulkEditValidators();
    component.bulkEditForm.patchValue({
      end_customer: 'blah',
      product: 'siemens:siemens:podui'
    });
    expect(component.bulkEditForm.get('end_customer').valid).toBe(true);
  });

  it('saveBulkEdit | when password is invalid', () => {
    component.bulkSelectedUsers = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.bulkEditForm.patchValue({
      password: 'test'
    });
    component.saveBulkEdit();
    expect(component.resetPassError).toEqual('Password not valid.');
  });

  it('saveBulkEdit | when confirm password is invalid', () => {
    component.bulkSelectedUsers = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.bulkEditForm.patchValue({
      confirmPassword: 'test'
    });
    component.saveBulkEdit();
    expect(component.resetPassError).toEqual('Password not valid.');
  });

  it('saveBulkEdit | when fields are valid', () => {
    let service = TestBed.get(AdminService);
    component.roleList = [
      {
        "name": "siemens_siemens_podui_external_test_role",
        "disName": "external_test_role",
        "featureData": [
          {
            "features": "Dashboards,Dashboard Admin,Workbench,Logvault",
            "featureKey": "dashboards,dashboard_admin,workbench,logvault",
            "featuresDis": [
              "Dashboard Admin",
              "Dashboards",
              "Logvault",
              "Workbench"
            ],
            "mps": [
              "siemens",
              "siemens",
              "podui"
            ],
            "name": "Siemens",
            "selected": false,
            "mps_def": "siemens/siemens/podui"
          }
        ],
        "roleType": "Internal"
      }, {
        "name": "siemens_siemens_podui_admin",
        "disName": "admin",
        "featureData": [
          {
            "features": "Admin,Dashboards,File Upload,Rules & Alerts, explorer,Logvault,Workbench,Rule Creator,Health Check,Dashboard Admin,Creator",
            "featureKey": "admin,dashboards,file_upload,rules_and_alerts, explorer,logvault,workbench,rule_creator,healthcheck,dashboard_admin,wb_creator",
            "featuresDis": [
              " explorer",
              "Admin",
              "Creator",
              "Dashboard Admin",
              "Dashboards",
              "File Upload",
              "Health Check",
              "Logvault",
              "Rule Creator",
              "Rules & Alerts",
              "Workbench"
            ],
            "mps": [
              "siemens",
              "siemens",
              "podui"
            ],
            "name": "Siemens",
            "selected": false,
            "mps_def": "siemens/siemens/podui"
          },
          {
            "features": "Admin,Explorer,Logvault",
            "featureKey": "admin,explorer,logvault",
            "featuresDis": [
              "Admin",
              "Explorer",
              "Logvault"
            ],
            "mps": [
              "siemens",
              "siemens",
              "pod"
            ],
            "name": "Siemens Pod",
            "selected": false,
            "mps_def": "siemens/siemens/podui"
          }, {
            "features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Admin,Health Check",
            "featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,admin,healthcheck",
            "featuresDis": [
              "Admin",
              "Dashboards",
              "Explorer",
              "File Upload",
              "Health Check",
              "Logvault",
              "Rules & Alerts"
            ],
            "mps": [
              "siemens",
              "siemens",
              "pod60"
            ],
            "name": "Siemens Prod 60",
            "selected": false,
            "mps_def": "siemens/siemens/podui"
          }
        ],
        "roleType": "Internal",
      }
    ];
    component.bulkSelectedUsers = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.bulkEditForm.patchValue({
      role: 'siemens_siemens_podui_admin',
      product: 'siemens/siemens/podui'
    });
    let res = JSON.parse('{"Status":"Success","Msg":"User(s) updated Successfully","Data":""}');
    spyOn(service, 'post').and.returnValue(of(res));
    component.saveBulkEdit();
    expect(service.post).toHaveBeenCalled();
  });
  //WIP
  it('saveBulkEdit | when password is not matching', () => {
    component.bulkSelectedUsers = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.bulkEditForm.patchValue({
      password: 'test@123S',
      confirmPassword: 'test@123s'
    });
    component.saveBulkEdit();
    expect(component.resetPassError).toEqual('Password did not match.');
  });
  //WIP
  xit('saveBulkEdit | when maximum wb licenses has exceeded', () => {
    component.roleList = [
      {
        "name": "siemens_siemens_podui_external_test_role",
        "disName": "external_test_role",
        "featureData": [
          {
            "features": "Dashboards,Dashboard Admin,Workbench,Logvault",
            "featureKey": "dashboards,dashboard_admin,workbench,logvault",
            "featuresDis": [
              "Dashboard Admin",
              "Dashboards",
              "Logvault",
              "Workbench"
            ],
            "mps": [
              "siemens",
              "siemens",
              "podui"
            ],
            "name": "Siemens",
            "selected": false
          }
        ],
        "roleType": "Internal"
      }, {
        "name": "siemens_siemens_podui_admin",
        "disName": "admin",
        "featureData": [
          {
            "features": "Admin,Dashboards,File Upload,Rules & Alerts, explorer,Logvault,Workbench,Rule Creator,Health Check,Dashboard Admin,Creator",
            "featureKey": "admin,dashboards,file_upload,rules_and_alerts, explorer,logvault,workbench,rule_creator,healthcheck,dashboard_admin,wb_creator",
            "featuresDis": [
              " explorer",
              "Admin",
              "Creator",
              "Dashboard Admin",
              "Dashboards",
              "File Upload",
              "Health Check",
              "Logvault",
              "Rule Creator",
              "Rules & Alerts",
              "Workbench"
            ],
            "mps": [
              "siemens",
              "siemens",
              "podui"
            ],
            "name": "Siemens",
            "selected": false
          },
          {
            "features": "Admin,Explorer,Logvault",
            "featureKey": "admin,explorer,logvault",
            "featuresDis": [
              "Admin",
              "Explorer",
              "Logvault"
            ],
            "mps": [
              "siemens",
              "siemens",
              "pod"
            ],
            "name": "Siemens Pod",
            "selected": false
          }, {
            "features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Admin,Health Check",
            "featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,admin,healthcheck",
            "featuresDis": [
              "Admin",
              "Dashboards",
              "Explorer",
              "File Upload",
              "Health Check",
              "Logvault",
              "Rules & Alerts"
            ],
            "mps": [
              "siemens",
              "siemens",
              "pod60"
            ],
            "name": "Siemens Prod 60",
            "selected": false
          }
        ],
        "roleType": "Internal",
      }
    ];
    component.bulkSelectedUsers = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 3;
    component.licensesData.maxCreatorLicenses = 3;
    component.licensesData.workbenchLicensedUsed = 3;
    component.licensesData.creatorLicensesUsed = 1;
    component.bulkEditForm.patchValue({
      role: 'siemens_siemens_podui_test_wb_role',
      product: 'siemens/siemens/podui'
    });
    component.saveBulkEdit();
    expect(component.submitted).toBeTruthy();
  });

  it('saveBulkEdit | when maximum creator licenses has exceeded', () => {
    component.roleList = [
      {
        "name": "siemens_siemens_podui_external_test_role",
        "disName": "external_test_role",
        "featureData": [
          {
            "features": "Dashboards,Dashboard Admin,Workbench,Logvault",
            "featureKey": "dashboards,dashboard_admin,workbench,logvault",
            "featuresDis": [
              "Dashboard Admin",
              "Dashboards",
              "Logvault",
              "Workbench"
            ],
            "mps": [
              "siemens",
              "siemens",
              "podui"
            ],
            "name": "Siemens",
            "selected": false
          }
        ],
        "roleType": "Internal"
      }, {
        "name": "siemens_siemens_podui_admin",
        "disName": "admin",
        "featureData": [
          {
            "features": "Admin,Dashboards,File Upload,Rules & Alerts, explorer,Logvault,Workbench,Rule Creator,Health Check,Dashboard Admin,Creator",
            "featureKey": "admin,dashboards,file_upload,rules_and_alerts, explorer,logvault,workbench,rule_creator,healthcheck,dashboard_admin,wb_creator",
            "featuresDis": [
              " explorer",
              "Admin",
              "Creator",
              "Dashboard Admin",
              "Dashboards",
              "File Upload",
              "Health Check",
              "Logvault",
              "Rule Creator",
              "Rules & Alerts",
              "Workbench"
            ],
            "mps": [
              "siemens",
              "siemens",
              "podui"
            ],
            "name": "Siemens",
            "selected": false
          },
          {
            "features": "Admin,Explorer,Logvault",
            "featureKey": "admin,explorer,logvault",
            "featuresDis": [
              "Admin",
              "Explorer",
              "Logvault"
            ],
            "mps": [
              "siemens",
              "siemens",
              "pod"
            ],
            "name": "Siemens Pod",
            "selected": false
          }, {
            "features": "Dashboards,File Upload,Rules & Alerts,Explorer,Logvault,Admin,Health Check",
            "featureKey": "dashboards,file_upload,rules_and_alerts,explorer,logvault,admin,healthcheck",
            "featuresDis": [
              "Admin",
              "Dashboards",
              "Explorer",
              "File Upload",
              "Health Check",
              "Logvault",
              "Rules & Alerts"
            ],
            "mps": [
              "siemens",
              "siemens",
              "pod60"
            ],
            "name": "Siemens Prod 60",
            "selected": false
          }
        ],
        "roleType": "Internal",
      }
    ];
    component.bulkSelectedUsers = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 3;
    component.licensesData.maxCreatorLicenses = 1;
    component.licensesData.workbenchLicensedUsed = 2;
    component.licensesData.creatorLicensesUsed = 1;
    component.bulkEditForm.patchValue({
      role: 'siemens_siemens_podui_admin',
      product: 'siemens/siemens/podui'
    });
    component.saveBulkEdit();
    expect(component.submitted).toBeFalsy();
  });


  it('exportCSVFile', () => {
    let service = TestBed.get(AdminService);
    spyOn(service, 'downloadCSVFile').and.returnValue(true);
    let res = [
      {
        "name": "external_user  ",
        "email": "extuser@gmail.com",
        "role": "external_test_role",
        "system_group": "group A",
        "created_on": "2019-10-30T07:37:01Z",
        "modified_on": "2019-10-30T07:45:46Z",
        "last_login": null,
        "status": "ACTIVE",
        "user_type": "External"
      },
      {
        "name": "jk  ",
        "email": "jk@gmail.com",
        "role": "admin",
        "system_group": "NA",
        "created_on": "2019-10-29T10:08:16Z",
        "modified_on": "2019-10-30T08:00:57Z",
        "last_login": null,
        "status": "INACTIVE",
        "user_type": "Internal"
      }
    ]
    component.exportCSVFile();
    expect(component.csvData).toEqual(res);
  });

  it('selectAcrossPages', () => {
    let res = component.users = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.selectAcrossPages();
    expect(component.users).toEqual(res);
    expect(component.selectedCount).toEqual(2);
  });

  it('clearSelection', () => {
    let res = component.users = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": false,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": false,
      "countryCode": 0
    }];
    component.clearSelection();
    expect(component.users).toEqual(res);
    expect(component.selectedCount).toEqual(0);
  });

  it('checkGroupChanges | when disabled', () => {
    component.user.end_customer = '';
    component.userForm.patchValue({
      end_customer: 'All'
    });
    component.checkGroupChanges();
    expect(component.disableUserNotificationCheckbox).toBeTruthy();
    expect(component.userForm.value.sendNotification).toBeFalsy();
  })

  it('checkGroupChanges | when enabled', () => {
    component.user.end_customer = 'abc';
    component.userForm.patchValue({
      end_customer: 'All'
    });
    component.checkGroupChanges();
    expect(component.disableUserNotificationCheckbox).toBeNull();
    expect(component.userForm.value.sendNotification).toBeFalsy();
  })

  it('setBulkEditWBRoleCount', () => {
    component.bulkSelectedUsers = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    component.setBulkEditWBRoleCount();
    expect(component.bulkEditRoleCount.nonWbUsers).toBeGreaterThan(0);
  })

  it('getMaxLicense | bulk edit creator license', () => {
    component.bulkEditFlag = true;
    let role = 'siemens_siemens_podui_admin';
    component.getMaxLicense(role);
    expect(component.licensingWarning).toBe(messages.bulkeditUserLicensingError.creator);
  })

  it('getMaxLicense | user edit creator license', () => {
    component.bulkEditFlag = false;
    let role = 'siemens_siemens_podui_admin';
    component.getMaxLicense(role);
    expect(component.licensingWarning).toBe(messages.addUserLicensingError.creator);
  })

  // it('getMaxLicense | bulk edit workbench license', () => {
  //   component.bulkEditFlag = true;
  //   let role = 'siemens_siemens_podui_test_db_role';
  //   component.getMaxLicense(role);
  //   expect(component.licensingWarning).toBe(messages.bulkeditUserLicensingError.dashboards);
  // })

  it('closeUserModal', () => {
    let modalservice = TestBed.get(NgbModal);
    let service = TestBed.get(AdminService);
    component.openModal('user', 'content', 'add', '' as any);
    component.userForm.markAsTouched();
    component.userForm.markAsDirty();
    component.closeUserModal();
    expect(modalservice._modalStack._modalRefs[1]._contentRef.componentRef.instance.msg).toEqual(messages.changeAlert);
  });

  it('saveUser | Save User > All mandatory fields set > Form is valid but creator licenses are used', () => {
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 2;
    component.licensesData.maxCreatorLicenses = 3;
    component.licensesData.maxViewerLicenses = 0;
    component.licensesData.viewerLicensesUser = 4;
    component.isviewercust = true;
    component.oldUserRole = 'siemens_siemens_podui_test_db_role';
    component.oldUserRoleProd = 'siemens/siemens/podui';
    component.userForm.patchValue({
      firstName: 'Sneha',
      email: 'test@gmail.com',
      role: 'siemens_siemens_podui_test_db_role',
      default_prod: 'siemens/siemens/podui'
    });
    component.isEditMode = true;
    component.saveUser();
    expect(component.submitted).toBeFalsy();
  });

  it('saveUser | Save User > All mandatory fields set > Form is valid but creator licenses are used', () => {
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 2;
    component.licensesData.maxCreatorLicenses = 3;
    component.licensesData.maxViewerLicenses = 1;
    component.licensesData.viewerLicensesUser = 4;
    component.isviewercust = true;
    component.userForm.patchValue({
      firstName: 'Sneha',
      email: 'test@gmail.com',
      role: 'siemens_siemens_podui_test_db_role',
      default_prod: 'siemens/siemens/podui'
    });
    component.isEditMode = true;
    component.oldUserRole = 'siemens_siemens_podui_test_db_role';
    component.oldUserRoleProd = 'siemens/siemens/podui';
    component.saveUser();
    expect(component.submitted).toBeFalsy();
  });

  it('saveUser | Save User > All mandatory fields set > Form is valid but workbench licenses are used | edit mode', () => {
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 2;
    component.licensesData.maxCreatorLicenses = 3;
    component.licensesData.maxViewerLicenses = 0;
    component.licensesData.viewerLicensesUser = 4;
    component.licensesData.workbenchLicensedUsed = 2;
    // component.isviewercust = true;
    component.oldUserRole = 'siemens_siemens_podui_test_wb_role';
    component.oldUserRoleProd = 'siemens/siemens/podui';
    component.userForm.patchValue({
      firstName: 'Sneha',
      email: 'test@gmail.com',
      role: 'siemens_siemens_podui_test_wb_role',
      default_prod: 'siemens/siemens/podui'
    });
    component.isEditMode = true;
    component.saveUser();
    expect(component.submitted).toBeFalsy();
  });

  it('saveUser | Save User > All mandatory fields set > Form is valid but workbench licenses are used | add mode', () => {
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 2;
    component.licensesData.maxCreatorLicenses = 3;
    component.licensesData.maxViewerLicenses = 0;
    component.licensesData.viewerLicensesUser = 4;
    component.licensesData.workbenchLicensedUsed = 2;
    // component.isviewercust = true;
    component.userForm.patchValue({
      firstName: 'Sneha',
      email: 'test@gmail.com',
      role: 'siemens_siemens_podui_test_wb_role',
      default_prod: 'siemens/siemens/podui'
    });
    component.isEditMode = false;
    component.saveUser();
    expect(component.submitted).toBeFalsy();
  });

  it('saveUser | Save User > All mandatory fields set > Form is valid but creator licenses are used | edit mode', () => {
    component.licensesData.maxUsers = 5;
    component.licensesData.maxWBLicenses = 2;
    component.licensesData.maxCreatorLicenses = 3;
    component.licensesData.maxViewerLicenses = 0;
    component.licensesData.viewerLicensesUser = 4;
    component.licensesData.workbenchLicensedUsed = 2;
    component.licensesData.creatorLicensesUsed = 3;
    // component.isviewercust = true;
    component.oldUserRole = 'siemens_siemens_podui_test_creator_role';
    component.oldUserRoleProd = 'siemens/siemens/podui';
    component.userForm.patchValue({
      firstName: 'Sneha',
      email: 'test@gmail.com',
      role: 'siemens_siemens_podui_test_creator_role',
      default_prod: 'siemens/siemens/podui'
    });
    component.isEditMode = true;
    component.saveUser();
    expect(component.submitted).toBeTruthy();
  });

  it('saveUser | Save User > max users limit reached', () => {
    component.licensesData.totalUsers = 10;
    component.licensesData.maxUsers = 10;
    // component.isviewercust = true;
    // component.oldUserRole = 'siemens_siemens_podui_test_creator_role';
    // component.oldUserRoleProd = 'siemens/siemens/podui';
    // component.userForm.patchValue({
    //   firstName: 'Sneha',
    //   email: 'test@gmail.com',
    //   role: 'siemens_siemens_podui_test_creator_role',
    //   default_prod: 'siemens/siemens/podui'
    // });
    component.isEditMode = false;
    component.saveUser();
    expect(component.submitted).toBeFalsy();
  });

  it('saveUser | Save User > max wb users limit reached', () => {
    // component.isviewercust = true;
    // component.oldUserRole = 'siemens_siemens_podui_test_creator_role';
    // component.oldUserRoleProd = 'siemens/siemens/podui';
    component.userForm.patchValue({
      firstName: 'Sneha',
      email: 'test@gmail.com',
      role: 'siemens_siemens_podui_test_wb_role',
      default_prod: 'siemens/siemens/podui'
    });
    component.isEditMode = true;
    component.oldUserRole = 'siemens_siemens_podui_test_creator_role';
    component.oldUserRoleProd = 'siemens/siemens/podui';
    component.licensesData.maxWBLicenses = 10;
    component.licensesData.workbenchLicensedUsed = 10;
    component.errorMessage = '';
    component.saveUser();
    expect(component.submitted).toBeFalsy();
  });

  it('getEndCustomerList | dashboard licenses', () => {
    component.userForm.patchValue({
      role: 'siemens_siemens_podui_test_db_role',
      default_prod: 'siemens/siemens/podui'
    })
    component.isviewercust = true;
    component.getEndCustomerList('');
    expect(component.licensingWarning).toBe(messages.addUserLicensingError.dashboards);
  })

  it('getEndCustomerList | workbench licenses', () => {
    component.userForm.patchValue({
      role: 'siemens_siemens_podui_test_wb_role',
      default_prod: 'siemens/siemens/podui'
    })
    component.getEndCustomerList('');
    expect(component.licensingWarning).toBe(messages.addUserLicensingError.workbench);
  })

  it('getEndCustomerList | creator licenses', () => {
    component.userForm.patchValue({
      role: 'siemens_siemens_podui_test_creator_role',
      default_prod: 'siemens/siemens/podui'
    })
    component.getEndCustomerList('');
    expect(component.licensingWarning).toBe(messages.addUserLicensingError.creator);
  })

  it('getEndCustomerList | creator licenses', () => {
    component.userForm.patchValue({
      role: 'siemens_siemens_podui_admin',
      default_prod: 'siemens/siemens/podui'
    })
    let service = TestBed.get(AdminService);
    let groupedDataEndCustomer = ['Group A'];
    spyOn(service, 'getEndCustomerListForUser').and.returnValue(groupedDataEndCustomer);
    component.getEndCustomerList('');
    expect(component.userForm.value.end_customer).toBe('All');
  })

  it('getEndCustomerList for bulk edit', () => {
    let service = TestBed.get(AdminService);
    component.bulkEditForm.patchValue({
      default_prod: 'siemens/siemens/podui'
    })
    component.bulkEditUserType = 'external';
    spyOn(service, 'getEndCustomerListForUser').and.returnValue([]);
    component.getEndCustomerListForBulkEdit();
    expect(component.getEndCustomerList.length).toBe(1);
  });

  it('getEndCustomerListForBulkEdit', () => {
    component.bulkEditForm.patchValue({
      role: 'siemens_siemens_podui_admin',
      default_prod: 'siemens/siemens/podui'
    });
    let service = TestBed.get(AdminService);
    let groupedDataEndCustomer = ['Group A'];
    spyOn(service, 'getEndCustomerListForUser').and.returnValue(groupedDataEndCustomer);
    component.getEndCustomerListForBulkEdit();
    expect(component.bulkEditForm.value.end_customer).toBe('All');
  })

  it('save bulk edit | rulessubscription', () => {
    component.bulkEditForm.patchValue({
      sendNotification: true
    });
    component.bulkSelectedUsers = [{
      "email": "extuser@gmail.com",
      "first_name": "external_user",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_external_test_role",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "group A",
      "mps_def": "siemens/siemens/podui",
      "dashboard_admin": false,
      "user_state": 'ACTIVE',
      "token_id": "$2a$10$QBgQ0kPeA1eZep6zH5WwautLPwPOF1Y.BeLZSSbDGCZIpZL2RQdoe",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-30T07:37:01Z",
      "modified_on": "2019-10-30T07:45:46Z",
      "last_login": null,
      "is_external": true,
      "roleName": "external_test_role",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    },
    {
      "email": "jk@gmail.com",
      "first_name": "jk",
      "last_name": " ",
      "name": "",
      "status": "",
      "userType": "",
      "wb_user_name": "Generic",
      "report_usage": false,
      "org": "siemens",
      "role": "siemens_siemens_podui_admin",
      "realm_def": "dev.glassbeam.com",
      "end_customer": "NA",
      "mps_def": "siemens/siemens/pod",
      "dashboard_admin": false,
      "user_state": 'INACTIVE',
      "token_id": "$2a$10$peY3RmPM47BaHRkqacN7Ne5WUjeEQQabz/66ORSlbo28/LUJoeQxm",
      "phone": "",
      "city": "",
      "state": "",
      "country": "",
      "department": "",
      "created_on": "2019-10-29T10:08:16Z",
      "modified_on": "2019-10-30T08:00:57Z",
      "last_login": null,
      "is_external": false,
      "roleName": "admin",
      "adminUser": false,
      "selected": true,
      "countryCode": 0
    }];
    let service = TestBed.get(AdminService);
    // component.addEditEndCustForm.patchValue({
    //   endCustomerName: "John",
    //   prodName: "Siemens",
    //   SelectedSysIdname: ["CT123", "CT4567"]
    // });
    let api_success = { "Status": "Success", "Msg": "End customer Nishanth added successfully", "Data": "" };
    spyOn(service, 'post').and.returnValue(of(api_success));
    component.saveBulkEdit();
    expect(service.post).toHaveBeenCalled();
  });

});

