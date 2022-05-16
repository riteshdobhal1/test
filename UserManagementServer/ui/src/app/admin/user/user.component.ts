import { LicensesData, User, RoleProdList, TableauUser } from './model';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AdminService } from './../../services/admin/admin.service';
import { SortableDirective, SortEvent } from '../../shared/directives/sortable.directive';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as userGlobals from './global';
import { ConfirmationPopupComponent } from '../../shared/confirmation-popup/confirmation-popup.component';
import * as _ from 'lodash';
import * as api from '../../shared/resource';
import { DataResponse } from './../../services/data-response';
import { ToastService } from '../../shared/toast-notification/toast-service.service';
import * as messages from '../../shared/message';
import * as global from '../../shared/global';
import {roleFeatures} from '../role/global'
import * as moment from 'moment';
import { UserTrackingService } from 'src/app/services/admin/user-tracking.service';
import {onscreen} from '../../shared/onscreen';
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
export const boolcompare = (v1, v2) => (v1 === v2) ? 0 : v1 ? -1 : 1;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: Array<User>;
  userListCopy: Array<User>;
  changeWarningOn: boolean = false;
  loggedInUser: any = {};
  licensesData = {} as LicensesData;
  page = userGlobals.page;
  licensingWarning: string = "";
  pageSize = global.pageSize;
  smsize = global.smsize;
  defaultPageSize = global.pageSize;
  pageValue = global.pageValue;
  submitted = false;
  userForm: FormGroup;
  changePasswordForm: FormGroup;
  bulkEditFlag: boolean = false;
  bulkEditForm: FormGroup;
  roleList: Array<RoleProdList>;
  roles: Array<RoleProdList>;
  prodList = [];
  endCustomerList = [];
  collectionSize = 0;
  user = {} as User;
  errorMessage = '';
  isSelectAll: boolean;
  isEditMode: boolean;
  loading: boolean;
  resetPassError: string;
  wbUserName: string;
  oldUserRole: string;
  oldUserRoleProd: string;
  enableUserSubmit: boolean;
  templateVariables: any;
  userFilterData = [];
  showFilter: boolean = false;
  filterCount = 0;
  noUsersFound = messages.noUsersFound;
  userFormHelper = messages.userFormHelper;
  mps = [undefined, undefined, undefined];
  searchText: string = '';
  quickFilterButtons = userGlobals.quickFilter;
  bulkSelectedUsers: Array<User>;
  bulkEditEnableOptions = userGlobals.bulkEditEnableOptions;
  csvData: Array<object>;
  currentUser: User;
  defaultSort = userGlobals.defaultSort;
  regexObj = userGlobals.regex;
  selectedCount: number = 0;
  minCharacters = global.minCharacters;
  maxCharacters = global.maxCharacters;
  PaginationReset: boolean = false;
  isSSOEnabled: boolean = false;
  iscreatorcust: boolean = false;
  isviewercust: boolean = false;
  bulkEditRoleCount: any = {
    wbUsers : 0,
    nonWbUsers: 0
  };
  bulkEditUserType = 'internal';
  disableUserNotificationCheckbox: boolean = true;
  isTableauConfigured:boolean = false;
  userHelpText = userGlobals.userHelpText;

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private userTrackingService: UserTrackingService,
    public onscreenConst:onscreen
  ) {

    try {
      this.mps = this.adminService.getMPS().split(/:|\//);
    } catch (e) { }

    this.templateVariables = userGlobals.templateVariables;
  }

  ngOnInit() {
    this.resetUserForm();
    this.resetChangePasswordForm();
    this.resetBulkEditForm();
    this.getLoggedInUserData();
    this.checkIfTableauIsConfiguredForUser();
  }

  get f() {
    return this.userForm.controls;
  }

  get p() {
    return this.changePasswordForm.controls;
  }

  get b() {
    return this.bulkEditForm.controls;
  }

  checkIfTableauIsConfiguredForUser(){
    this.adminService.checkIfTableauConfigured().subscribe((data) => {
      this.isTableauConfigured = data;
    })
  }

  getLoggedInUserData() {
    this.loading = true;
    this.adminService.fetchLoggedInUserDetails().subscribe((data) => {
      this.adminService.setLoggedInUserDetails(data);
      this.adminService.getRoleList().subscribe(() => {
        this.iscreatorcust = this.adminService.iscreatorcust;
        this.isviewercust = this.adminService.isviewercust;
        this.adminService.getendCustomerList().subscribe(() => {
          this.getUserList();
        });
      });
      this.isSSOEnabled = this.adminService.isSSOUser();
    });
  }

  getUserList() {
    this.licensesData.totalUsers = 0;
    this.roleList = this.adminService.getRoleListArray();
    let cloneUserFilterData = _.cloneDeep(userGlobals.userFilterArray);
    this.adminService.getUserList().subscribe((data) => {
      this.users = data;
      this.userListCopy = _.cloneDeep(data);
      this.collectionSize = this.users.length;
      this.licensesData = this.adminService.getLicensesData();
      this.loading = false;
      this.resetFilter();
      this.userFilterData = this.adminService.getFilterObj(this.users, cloneUserFilterData);
      this.onSort(this.defaultSort as SortEvent);
      this.updateSelectAllValue();
    });
  }
  helperClick(event:any){
    event.stopPropagation();
  }
  isOnscreenenabled() {
    return this.onscreenConst.onscreen;
  }
  getUserListFiltered() {
    let tempUserList = this.users;
    this.searchText = this.searchText.toLowerCase();
    if (this.searchText.length === 0) {
      if (this.PaginationReset) {
        this.page = 1;
        this.PaginationReset = false;
      }
      return this.users;
    }
    if (this.searchText.length >= 3) {
      tempUserList = tempUserList.filter((item: User) => {
        return item.first_name.toLowerCase().includes(this.searchText) || item.last_name.toLowerCase().includes(this.searchText) ||
            item.end_customer.toLowerCase().includes(this.searchText) || item.roleName.toLowerCase().includes(this.searchText) || item.email.toLowerCase().includes(this.searchText) || item.user_state.toLowerCase().includes(this.searchText) || (!item.is_external && userGlobals.internalCheckKeyword.toLowerCase().includes(this.searchText)) || (item.is_external && userGlobals.externalCheckKeyword.toLowerCase().includes(this.searchText));
      })
    }
    if (this.PaginationReset) {
      this.page = 1;
      this.PaginationReset = false;
    }
    if(tempUserList.length+this.defaultPageSize<=this.pageSize){
      this.pageSize = this.pageValue[0];
    }
    return tempUserList;
  }

  getFilterData(filter) {
    let tmpFilterList = _.cloneDeep(filter.data);
    if (filter.searchText.length < 3) {
      return [];
    }
    if (filter.searchText.length >= 3) {
      tmpFilterList = filter.data.filter((item) => {
        return item.name.toLowerCase().includes(filter.searchText);
      })
    }
    return tmpFilterList;
  }

  onSort({ column, direction }: SortEvent) {
    var res;
    // resetting other headers
    if (this.headers) {
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
    }
    if (direction === '') {
      this.users = this.users;
    } else {
      this.users = this.users.sort((a, b) => {
        if(column === 'is_external'){
          res = boolcompare(a[column], b[column])
        } else {
          res = a[column].localeCompare(b[column], undefined /* Ignore language */, { sensitivity: 'base' })
        }
        // const res = column === 'is_external' ? boolcompare(a[column], b[column]) : compare(a[column].toLowerCase(), b[column].toLowerCase());
        this.defaultSort.column = column;
        return direction === 'asc' ? res : -res;
      });
    }
  }

  // Modal related code

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openModal(modalType, content, type, user) {
    switch (modalType) {
      case 'user':
        this.resetUserForm();
        this.isEditMode = false;
        if (type === 'edit') {
          this.isEditMode = true;
          this.editUser(content, user);
        }
        break;
      case 'password':
        this.resetChangePasswordForm();
        this.setCurrentUser(user);
        break;
      case 'bulkEdit':
        this.bulkEditFlag = true;
        this.resetBulkEditForm();
        this.setBulkEditRoles();
        this.setBulkEditValidators();
        this.setBulkEditWBRoleCount();
        break;
    }
    this.modalService.open(content, { size: global.largeModal, backdrop:'static', keyboard: false });
  }
  closeUserModal(){
    if(this.userForm.dirty){
      let tempForm = _.cloneDeep(this.userForm);
      const warningModal = this.modalService.open(ConfirmationPopupComponent, { backdrop: 'static', windowClass:"cancelUserConfirmation" });
      warningModal.componentInstance.msg = messages.changeAlert;
      warningModal.result.then((result) => {
        if (result === 'yesclick') {
          this.licensingWarning = "";
          this.modalService.dismissAll();
        }else {
          this.userForm = tempForm;
        }
      });
    }else {
      this.licensingWarning = "";
      this.modalService.dismissAll()
    }
  }
  setBulkEditWBRoleCount() {
    this.bulkEditRoleCount ={
      wbUsers : 0,
      nonWbUsers: 0
    };
    this.bulkSelectedUsers.map(function (item) {
      let features = this.getFeaturesForRole(item.role, item.mps_def);
      if (features && (features.featuresDis.indexOf(userGlobals.wbUserCheckKeyword)) > -1) {
        this.bulkEditRoleCount.wbUsers++;
      } else {
        this.bulkEditRoleCount.nonWbUsers++;
      }
    },this);
  }

  editUser(content, userData) {
    let countryCode, phone;
    this.oldUserRole = userData.role;
    this.oldUserRoleProd = userData.mps_def;
    // this.patchUserFormValuesForFilteringRoles();
    this.user = userData;

    for (let key in this.user) { 
    if (this.user.hasOwnProperty(key)) { 
        if(this.user[key] === "NA"){
 	this.user[key] = "";	
	}
     } 
    } 
    /* Object.entries(this.user).forEach(item => {
        if(this.user.item == "NA"){
         this.user.item = "";
        }
    }) */
    let phoneNumber = this.user.phone.includes('-') ? this.user.phone.split("-") : this.user.phone;
    if (Array.isArray(phoneNumber)) {
      countryCode = phoneNumber[0].replace(/\+/g, "");
      phone = phoneNumber[1];
    }
    this.userForm.patchValue({
      firstName: this.user.first_name,
      lastName: this.user.last_name,
      email: this.user.email,
      phone: Array.isArray(phoneNumber) ? phone : phoneNumber,
      department: this.user.department,
      state: this.user.state,
      city: this.user.city,
      countryCode: Array.isArray(phoneNumber) ? countryCode : '',
      country: this.user.country,
      role: '',
      default_prod: '',
      is_external: this.user.is_external,
      end_customer: this.user.end_customer,
      report_usage: true
    });
    this.filterRoles();
    this.setPhoneNumberValidator();
    this.getProductsForRole(this.userForm, userData);
    this.getEndCustomerList(this.user.end_customer);
  }

  setTableauUserInfo(data) {
    if(data.role){
      let roleData = this.roleList.filter((role) => {
        return data.role === role.name || data === role.name;
      });
      let roleProd = roleData[0].featureData;
      return roleProd;
    }else {
      let roleData = this.roleList.filter((role) => {
        return data === role.name;
      });
      let roleProd = roleData[0].featureData;
      return roleProd;
    }
  }

  setTableauUserRoleType(role) {
    let roleItem: any = role;
    let tableauUsers = userGlobals.TableauSiteRoleFeaturesMap;
    if(this.isviewercust){
      tableauUsers = tableauUsers.filter(item => {
        return item.site_role !== "Explorer";
      })
    }
    for (let i = 0; i < tableauUsers.length; i++) {
      if (tableauUsers[i].features.length === _.intersection(roleItem.featuresDis, tableauUsers[i].features).length) {
        if(!this.isviewercust && (roleItem.featuresDis.indexOf("Workbench") > -1 || roleItem.featuresDis.indexOf("Creator") > -1)){
          return tableauUsers[i].site_role;
        }
        else if(this.isviewercust){
          return tableauUsers[i].site_role;
        }
        else{
          return "Unlicensed"
        }
      }
    }
  }

  patchUserFormValuesForFilteringRoles() {
    this.userForm.patchValue({
      role: '',
      default_prod: '',
      end_customer: ''
    });
  }

  filterRoles() {
    this.patchUserFormValuesForFilteringRoles();
    this.roles = this.roleList.filter((item) => {
      if (item.roleType === userGlobals.internalCheckKeyword) {
        return item;
      }
    });
    if (this.userForm.value.is_external) {
      this.roles = this.roleList.filter((item) => {
        if (item.roleType === userGlobals.externalCheckKeyword) {
          return item;
        }
      });
    }
  }

  getProductsForRole(form, data) {
    this.licensingWarning = "";
    let passRole = "";
    this.userForm.patchValue({
      default_prod: ''
    });
    if (data) {
      passRole = data.role;
      this.userForm.patchValue({
        role: data.role,
        default_prod: data.mps_def,
        end_customer: data.end_customer
      });
    }else {
      passRole = form.value.role;
    }
    this.roleList.filter((item) => {
      if (item.name === form.value.role) {
        this.prodList = item.featureData;
      }
    });
    this.prodList.map((prod) => {
      prod.mps_def = prod.mps.join('/');
    });
    if(passRole === ''){
      this.bulkEditForm.patchValue({
        product: ''
      })  
    }else {
      this.bulkEditForm.patchValue({
        product: this.prodList[0].mps_def
      })
    }
    if(!data){
      this.getEndCustomerListForBulkEdit();
      this.userForm.patchValue({
        default_prod: this.prodList[0].mps_def
      });
    }
    if(this.bulkEditForm.value.role === ''){
      this.bulkEditForm.patchValue({
        sendNotification: false
      })
    }
    if(passRole){
      this.getMaxLicense(passRole);
    }
  }

  getMaxLicense(passRole) {
    let roleFeature = this.roleList.filter(item => {
      return item.name === passRole;
    })[0].featureData;
    let selectedFeatures:Array<string> = [];
    roleFeature.map((item:any) => {
      let tempArray = item.featureKey.split(",");
      selectedFeatures = selectedFeatures.concat(tempArray);
      selectedFeatures = _.uniq(selectedFeatures);
    });
    if(selectedFeatures.indexOf(roleFeatures[1].value) != -1 && selectedFeatures.indexOf(roleFeatures[3].value) == -1 && selectedFeatures.indexOf(roleFeatures[4].value) == -1 && this.isviewercust){
      if(this.bulkEditFlag){
        this.licensingWarning = messages.bulkeditUserLicensingError.dashboards;  
      }else {
        this.licensingWarning = messages.addUserLicensingError.dashboards;
      }
    }else if(selectedFeatures.indexOf(roleFeatures[1].value) != -1 && selectedFeatures.indexOf(roleFeatures[3].value) != -1 && selectedFeatures.indexOf(roleFeatures[4].value) == -1){
      if(this.bulkEditFlag){
        this.licensingWarning = messages.bulkeditUserLicensingError.workbench;  
      }else {
        this.licensingWarning = messages.addUserLicensingError.workbench;
      }
    }else if(selectedFeatures.indexOf(roleFeatures[1].value) != -1 && selectedFeatures.indexOf(roleFeatures[3].value) != -1 && selectedFeatures.indexOf(roleFeatures[4].value) != -1){
      if(this.bulkEditFlag){
        this.licensingWarning = messages.bulkeditUserLicensingError.creator;  
      }else {
        this.licensingWarning = messages.addUserLicensingError.creator;
      }
    }
  }

  resetUserForm() {
    this.licensingWarning = "";
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(this.minCharacters), Validators.maxLength(this.maxCharacters), Validators.pattern(this.regexObj.firstname)]],
      lastName: ['', [Validators.minLength(this.minCharacters), Validators.maxLength(this.maxCharacters), Validators.pattern(this.regexObj.lastname)]],
      email: ['', [Validators.required, Validators.pattern(this.regexObj.email)]],
      phone: ['', [Validators.minLength(this.minCharacters), Validators.maxLength(20), Validators.pattern(this.regexObj.phone)]],
      department: ['', [Validators.minLength(this.minCharacters), Validators.maxLength(this.maxCharacters), Validators.pattern(this.regexObj.generic)]],
      state: ['', [Validators.minLength(this.minCharacters), Validators.maxLength(this.maxCharacters), Validators.pattern(this.regexObj.generic)]],
      city: ['', [Validators.minLength(this.minCharacters), Validators.maxLength(this.maxCharacters), Validators.pattern(this.regexObj.generic)]],
      country: ['', [Validators.minLength(this.minCharacters), Validators.maxLength(this.maxCharacters), Validators.pattern(this.regexObj.generic)]],
      role: ['', Validators.required],
      default_prod: ['', Validators.required],
      is_external: false,
      report_usage: true,
      sendNotification: false,
      end_customer: [''],
      countryCode: ['', [Validators.minLength(this.minCharacters), Validators.maxLength(6), Validators.pattern(this.regexObj.phone)]]
    });
    this.userForm.clearValidators();
    this.submitted = false;
    this.errorMessage = '';
    this.endCustomerList = [];
    this.disableUserNotificationCheckbox = true;
  }

  resetChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.changePasswordForm.clearValidators();
    this.submitted = false;
    this.resetPassError = '';
  }

  resetBulkEditForm() {
    this.bulkEditForm = this.formBuilder.group({
      role: [''],
      product: [''],
      password: [''],
      confirmPassword: [''],
      active: [''],
      end_customer: [''],
      sendNotification: false
    });
    this.bulkEditForm.clearValidators();
    this.submitted = false;
    this.resetPassError = '';
    this.errorMessage = '';
    this.licensingWarning = '';
  }

  getFeaturesForRole(role, product) {
    for (let i = 0; i < this.roleList.length; i++) {
      if (this.roleList[i].name === role) {
        for (let j = 0; j < this.roleList[i].featureData.length; j++) {
          let feature: any = this.roleList[i].featureData[j];
          feature.mps_def = feature.mps_def ? feature.mps_def : feature.mps.join('/');
          if (product === feature.mps_def) {
            return feature;
          }
        }
      }
    }
  }
  saveUser() {
    this.submitted = true;
    this.errorMessage = '';
    let creatorLicensesUsed = this.licensesData.maxCreatorLicenses <= this.licensesData.creatorLicensesUsed ? true : false;
    this.users.forEach((item) => {
      if (this.userForm.value.email.toLowerCase() === item.email && !this.isEditMode) {
        this.userForm.controls['email'].setErrors({ 'duplicate': true });
        return;
      }
    });
    this.roleList.map((item: any) => {
      if (item.name === this.userForm.value.role) {
        let feature = [];
        for (let i = 0; i < item.featureData.length; i++) {
          feature = feature.concat(item.featureData[i].features.split(","));
        }
        this.wbUserName = feature.indexOf(userGlobals.wbUserCheckKeyword) > -1 || this.isviewercust ? this.userForm.value.email : 'Generic';
        let viewerLicensesUsed = this.licensesData.maxViewerLicenses <= this.licensesData.viewerLicensesUser ? true : false;
        if (feature.indexOf(userGlobals.wbViewerCheckKeyword) > -1 && feature.indexOf(userGlobals.wbUserCheckKeyword) === -1 && viewerLicensesUsed && this.isviewercust) {
          if(this.isEditMode){
            if(this.licensesData.maxViewerLicenses == 0){
              this.errorMessage = messages.userLicenseExceedTextEdit.viewerZero.replace(/%adminemail/g, this.adminService.getCookie("adminEmail"));
            }else {
              this.errorMessage = messages.userLicenseExceedTextEdit.viewer.replace(/%adminemail/g, this.adminService.getCookie("adminEmail"));  
            }
          }else {
            this.errorMessage = messages.userLicenseExceedText.viewer.replace(/%adminemail/g, this.adminService.getCookie("adminEmail"));
          }
          this.submitted = false;
          return;
        }
        let wbLicensesUsed = this.licensesData.maxWBLicenses <= this.licensesData.workbenchLicensedUsed ? true : false;
        if (feature.indexOf(userGlobals.wbUserCheckKeyword) > -1 && feature.indexOf(userGlobals.creatorCheckKeyword) == -1 && wbLicensesUsed) {
          if(this.isEditMode){
            this.errorMessage = messages.userLicenseExceedTextEdit.workbench.replace(/%adminemail/g, this.adminService.getCookie("adminEmail"));  
          }else {
            this.errorMessage = messages.userLicenseExceedText.workbench.replace(/%adminemail/g, this.adminService.getCookie("adminEmail"));
          }
          this.submitted = false;
          return;
        }
        if (feature.indexOf(userGlobals.creatorCheckKeyword) > -1 && creatorLicensesUsed) {
          if(this.isEditMode){
            this.errorMessage = messages.userLicenseExceedTextEdit.creator.replace(/%adminemail/g, this.adminService.getCookie("adminEmail"));  
          }else {
            this.errorMessage = messages.userLicenseExceedText.creator.replace(/%adminemail/g, this.adminService.getCookie("adminEmail"));
          }
          this.submitted = false;
          return;
        }
      }
    });
    if (!this.isEditMode && this.licensesData.totalUsers >= this.licensesData.maxUsers) {
      this.errorMessage = this.templateVariables.validationMessages.maxUsersExceeded;
      this.submitted = false;
      return;
    }
    if (this.isEditMode) {
      let oldUserRoleFeatures = this.getFeaturesForRole(this.oldUserRole, this.oldUserRoleProd);
      let newUserRoleFeatures = this.getFeaturesForRole(this.userForm.value.role, this.userForm.value.default_prod);
      if (oldUserRoleFeatures.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) === -1 && newUserRoleFeatures.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 && newUserRoleFeatures.featuresDis.indexOf(userGlobals.creatorCheckKeyword) == -1 && this.errorMessage == '') {
        let wbLicensesUsed = this.licensesData.maxWBLicenses === this.licensesData.workbenchLicensedUsed ? true : false;
        if (wbLicensesUsed) {
          this.errorMessage = messages.userLicenseExceedText.workbench;
          this.submitted = false;
          return;
        }
      }
      if ((this.oldUserRole === this.userForm.value.role && creatorLicensesUsed)) {
        this.errorMessage = '';
        this.submitted = true;
      }
    }
    if (this.userForm.invalid) {
      return;
    }
    if (this.submitted) {
      let apiUrl = this.isEditMode ? api.editUser : api.addUser;
      let countryCode = this.userForm.value.countryCode.trim().length ? '+' + this.userForm.value.countryCode : '';
      let phone = this.userForm.value.phone.trim().length ? '-' + this.userForm.value.phone : ''
      let phoneNumber = countryCode + phone;
      let postData = {
        first_name: this.userForm.value.firstName.trim(),
        last_name: this.userForm.value.lastName.trim(),
        department: this.userForm.value.department.trim(),
        state: this.userForm.value.state.trim(),
        city: this.userForm.value.city.trim(),
        country: this.userForm.value.country.trim(),
        sso: this.isSSOEnabled,
        wb_user_name: this.wbUserName,
        report_usage: true,
        email: this.userForm.value.email,
        phone: phoneNumber,
        org: this.adminService.getMfr(),
        role: this.userForm.value.role,
        realm_def: '',
        url_def: 'apps/dist/index.html',
        mps_def: this.userForm.value.default_prod,
        is_prospect: false,
        dashboard_admin: false,
        is_external: this.userForm.value.is_external,
        end_customer: this.userForm.value.end_customer === 'All' ? '' : this.userForm.value.end_customer,
        active: true
      };
      this.adminService.post(postData, apiUrl + this.adminService.getMfr()).subscribe((response: DataResponse) => {
        if (this.isEditMode) {
          if(response.Status && this.userForm.value.sendNotification){
            let rulesSubscriptionPostData: any = {};
            rulesSubscriptionPostData.user_group_info = [
              {
                user: postData.email,
                old_group: this.user.end_customer,
                new_group: this.userForm.value.end_customer === 'All' ? '' : this.userForm.value.end_customer
              }
            ];
            rulesSubscriptionPostData.mps = postData.mps_def;
            rulesSubscriptionPostData.send_notification = this.userForm.value.sendNotification;
            this.adminService.post(rulesSubscriptionPostData, api.rulesSubscriptionFilter + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe((response: DataResponse) => {
            });
          }
          this.userTrackingService.userTracking("Admin Panel : User", "Edit User", JSON.stringify(postData) + " Edited : ");
          if (this.oldUserRole !== this.userForm.value.role) {
            let users = [];
            let userPostData = {
              userRole: {}
            };
            let role = this.setTableauUserInfo(this.adminService.adminRole.name) as Array<any>;
            for(let i=0; i<role.length;i++){
              let userData = {} as TableauUser;
              userData.roleType = 'Unlicensed';
              userData.userName = this.userForm.value.email;  
              userData.mps = role[i].mps.join("/");
              users.push(userData);
            }
            let roleNew = this.setTableauUserInfo(this.userForm.value);
            for(let i=0; i<roleNew.length;i++){
              let obj: any = roleNew[i];
              if (obj.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 || this.isviewercust) {
                let roleType = this.setTableauUserRoleType(roleNew[i]);
                if (roleType) {
                  let userData = {} as TableauUser;
                  userData.userName = this.userForm.value.email;
                  userData.roleType = roleType;
                  userData.mps = obj.mps_def;
                  for(let k=0; k<users.length;k++){
                    if(users[k].mps == userData.mps) {
                      users[k].roleType = userData.roleType
                    }
                  }
                };
              }
            }
            if(this,this.isTableauConfigured){
              this.adminService.post(users, api.addTableauUser + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe(() => {
              });
            }
            this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
            this.modalService.dismissAll();
            this.resetUserForm();
            this.getUserList();
          } else {
            this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
            this.modalService.dismissAll();
            this.resetUserForm();
            this.getUserList();
          }
        } else {
          this.userTrackingService.userTracking("Admin Panel : User", "Add User", JSON.stringify(postData) + " Added : ");
          let role = this.setTableauUserInfo(this.userForm.value);
          let userPostData = [];
          let usersTemp = [];
          for(let i=0; i<role.length;i++){
            let obj: any = role[i];
            if (obj.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 || this.isviewercust) {
              let roleType = this.setTableauUserRoleType(role[i]);
              if (roleType) {
                let userData = {} as TableauUser;
                userData.userName = this.userForm.value.email;
                userData.roleType = roleType;
                userData.mps = obj.mps_def;
                usersTemp.push(userData);
              };
              userPostData = usersTemp;
            }
          }
          if(this.isTableauConfigured){
            this.adminService.post(userPostData, api.addTableauUser + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe(() => {            
            });
          }
          this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
          this.modalService.dismissAll();
          this.resetUserForm();
          this.getUserList();
        }
      });
    }
  }

  disableUser(row) {
    let featureList = this.setTableauUserInfo(row);
    let userPostData = {
      userRole: {}
    };
    let users = [];
    this.adminService.post('', api.disableUser + row.email + '/' + this.adminService.getMfr()).subscribe((response: DataResponse) => {
      this.userTrackingService.userTracking("Admin Panel : User", "Disable User", row.email + " Disabled : ");
      let feature: any = featureList[0];
      if (feature.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 || this.iscreatorcust || this.isviewercust) {
        let role = this.setTableauUserInfo(row) as Array<any>;
        for(let i=0; i<role.length;i++){
          let userData = {} as TableauUser;
          userData.roleType = 'Unlicensed';
          userData.userName = row.email;  
          userData.mps = role[i].mpsstring;
          users.push(userData);
        }
        if(this.isTableauConfigured){
          this.adminService.post(users, api.addTableauUser + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe(() => {
          });
        }
      }
      this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
      this.getUserList();
    });
  }

  enableUser(row) {
    let featureList = this.setTableauUserInfo(row);
    let users = [];
    this.enableUserSubmit = true;
    let wbLicensesUsed = this.licensesData.maxWBLicenses === this.licensesData.workbenchLicensedUsed ? true : false;
    let creatorLicensesUsed = this.licensesData.maxCreatorLicenses === this.licensesData.creatorLicensesUsed ? true : false;
    let obj: any = featureList[0];
    if (obj.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 && wbLicensesUsed ||
      obj.featuresDis.indexOf(userGlobals.creatorCheckKeyword) > -1 && creatorLicensesUsed) {
      let message = wbLicensesUsed ? messages.workbenchLicensesExceededText : messages.creatorLicensesExceededText
      this.toast.show(messages.userLicenseExceedText.workbench, { classname: global.toastTypes.red, delay: global.toastDelay });
      this.enableUserSubmit = false;
    }
    if (this.enableUserSubmit) {
      this.adminService.post('', api.enableUser + row.email + '/' + this.adminService.getMfr()).subscribe((response: DataResponse) => {
        this.userTrackingService.userTracking("Admin Panel : User", "Enable User", row.email + " Enabled : ");
        let role = this.setTableauUserInfo(row);
        for(let i=0; i<role.length; i++){
          let objN: any = role[i];
          if (objN.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 || this.isviewercust || this.iscreatorcust) {
            let roleType = this.setTableauUserRoleType(role[i]);
            if (roleType) {
              let userData = {} as TableauUser;
              userData.userName = row.email;
              userData.roleType = roleType;
              userData.mps = objN.mpsstring;
              users.push(userData);
            }
          }
        }
        if(this.isTableauConfigured){
          this.adminService.post(users, api.addTableauUser + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe(() => {
          });
        }
        this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
        this.getUserList();
      });
    }
  }

  openConfirmation(type, data) {
    let selectedUsers = [];
    const delModal = this.modalService.open(ConfirmationPopupComponent, { backdrop: 'static' });
    let usersToDel = [];
    let tableauUsersList = [];
    delModal.componentInstance.msg = type === 'single' ? messages.deleteUserSingle + `<strong>${data.email}</strong>?` : messages.deleteUserMsgMultiple;
    delModal.result.then((result) => {
      if (result === 'yesclick') {
        if(type === 'multiple'){
          usersToDel = this.users.filter((item) => {
            return !item.adminUser && item.selected;
          });
        }else{
          usersToDel = [data];
        }
        usersToDel.map((item) => {
          this.roleList.map((roleItem) => {
            if (roleItem.name === item.role) {
              for (let i = 0; i < roleItem.featureData.length; i++) {
                let feature: any = roleItem.featureData[i];
                if ((feature.mps.join('/') === item.mps_def && feature.features.split(',').indexOf(userGlobals.wbUserCheckKeyword) > -1) ||
                ((feature.mps.join('/') === item.mps_def && feature.features.split(',').indexOf(userGlobals.wbViewerCheckKeyword) > -1))) {
                  tableauUsersList.push(item);
                }
              }
            }
          });
          selectedUsers.push(item.email);
        });
        let postData = {
          usrEmails: selectedUsers
        }
        if (tableauUsersList.length > 0) {
          let userPostData = []
          for(let i=0; i<tableauUsersList.length; i++){
            let role = this.setTableauUserInfo(tableauUsersList[i]) as Array<any>;
            for(let j=0; j<role.length;j++){
              let tempObj = {
                users : [],
                mps : ""
              }
              tempObj.users = [tableauUsersList[i].email];
              tempObj.mps = role[j].mps.join("/");
              userPostData.push(tempObj);
            }
          }
          if(this.isTableauConfigured){
            this.adminService.post(userPostData, api.deleteTableauUser + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe(() => {
            });
          }
        }
        this.adminService.post(postData, api.deleteUser + this.adminService.getMfr()).subscribe((response: DataResponse) => {
          this.userTrackingService.userTracking("Admin Panel : User", "Delete User", JSON.stringify(postData) + " Deleted : ");
          this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
          this.modalService.dismissAll();
          this.getUserList();
        });
      }
    });
  }

  openEnableDisableUserConfirmation(user) {
    const delModal = this.modalService.open(ConfirmationPopupComponent, { backdrop: 'static' });
    delModal.componentInstance.msg = user.user_state === 'ACTIVE' ? messages.disableUserMsg + user.email + '?' : messages.enableUserMsg + user.email + '?';
    delModal.result.then((result) => {
      if (result === 'yesclick') {
        if (user.user_state === 'ACTIVE') {
          this.disableUser(user);
        } else {
          this.enableUser(user);
        }
      }
    });
  }

  allUsersSelected() {
    for (let i = 0; i < this.getCollectionLength(); i++) {
      if (!this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].selected && !this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].adminUser) {
        this.updateSelectAllValue();
        this.isSelectAll = false;
        return false;
      }
    }
    if (this.getUserListFiltered().length === 1 && this.getUserListFiltered()[0].adminUser) {
      this.updateSelectAllValue();
      this.isSelectAll = false;
      return false;
    }
    this.updateSelectAllValue();
    this.isSelectAll = true;
    return true;
  }

  getUserListLength() {
    return this.getUserListFiltered().filter((item: User) => { return !item.adminUser }).length;
  }

  userToggleSelect() {
    this.selectedCount = 0;
    this.isSelectAll = !this.isSelectAll;
    for (let i = 0; i < this.getCollectionLength(); i++) {
      if (!this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].adminUser) {
        this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].selected = this.isSelectAll;
        if (this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
          this.selectedCount++;
        }
      }
    }
    this.updateSelectAllValue();
  }

  userPageChanged() {
    this.allUsersSelected();
  }

  getActionButtonDisable(typ) {
    if (typ === 'del') {
      let flag = true;
      for (let i = 0; i < this.getCollectionLength(); i++) {
        if (this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
          flag = false;
        }
      }
      return flag;
    }
    if (typ === 'selectAll') {
      let flag = false;
      if (this.getUserListFiltered().length === 1 && !this.getUserListFiltered()[0].adminUser) {
        flag = true;
      }
      return flag;
    }
  }

  //This will return the length of data on the page for current pagination
  getCollectionLength() {
    let collectionLength = this.getUserListFiltered().slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    return collectionLength.length;
  }

  selectAcrossPages() {
    //Select all roles regardless of pagination
    for (let i = 0; i < this.getUserListFiltered().length; i++) {
      if (!this.getUserListFiltered()[i].adminUser) {
        this.getUserListFiltered()[i].selected = true;
        if (this.getUserListFiltered()[i].selected) {
          this.selectedCount++;
        }
      }
    }
    this.updateSelectAllValue();
  }

  clearSelection() {
    //Unselect all roles regardless of pagination
    this.selectedCount = 0;
    this.isSelectAll = false;
    for (let i = 0; i < this.users.length; i++) {
      this.users[i].selected = false;
    }
  }

  getSelectedCount() {
    let count = 0
    for (let i = 0; i < this.getUserListFiltered().length; i++) {
      if (this.getUserListFiltered()[i].selected) {
        count++;
      }
    }
    return count;
  }

  updateSelectAllValue() {
    this.selectedCount = this.getSelectedCount();
  }

  openChangePasswordModal(content) {
    this.resetChangePasswordForm();
    this.modalService.open(content);
  }

  savePassword() {
    this.resetPassError = '';
    this.submitted = true;
    const regex = this.regexObj.password;
    let isPasswordValid = regex.test(this.changePasswordForm.value.password);
    if (!isPasswordValid) {
      this.resetPassError = messages.passwordNotValid;
      return;
    }
    if (this.changePasswordForm.value.password !== this.changePasswordForm.value.confirmPassword) {
      this.resetPassError = messages.passwordMatchError;
      return;
    }
    let postData = {
      email: this.currentUser.email,
      password: this.changePasswordForm.value.password
    }
    this.adminService.post(postData, api.resetPassword + this.adminService.getMfr()).subscribe((response: DataResponse) => {
      this.userTrackingService.userTracking("Admin Panel : User", "Reset Password", JSON.stringify(postData) + " Changed : ");
      this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
      this.modalService.dismissAll();
    });
  }
  
  getEndCustomerList(data) {
    let tempFeatures = [];
    let tempFeaturesKey = [];
    this.endCustomerList = [];
    let allRoles = [];
    this.endCustomerList.unshift('All');
    this.userForm.patchValue({
      end_customer: this.endCustomerList[0]
    });
    for(let i=0; i<this.roleList.length;i++){
      if(this.roleList[i].name === this.userForm.value.role){
        for(let j=0;j<this.roleList[i].featureData.length;j++){
          let obj = <any>{};
          obj = this.roleList[i].featureData[j];
          if(obj.mps_def === this.userForm.value.default_prod){
            tempFeatures = tempFeatures.concat(this.roleList[i].featureData[j]["featuresDis"]);
            let featuresKeyArr = this.roleList[i].featureData[j]["featureKey"].split(",");
            tempFeaturesKey = tempFeaturesKey.concat(featuresKeyArr)
          }
          allRoles = _.uniq(allRoles.concat(this.roleList[i].featureData[j]["featuresDis"]))
        }
        tempFeatures = _.uniq(tempFeatures);
        tempFeaturesKey = _.uniq(tempFeaturesKey);
        // if(tempFeatures.indexOf(userGlobals.wbViewerCheckKeyword) !== -1 && this.isviewercust){
        //   this.licensingWarning = messages.addUserLicensingError.dashboards;
        // }
        // if (tempFeatures.indexOf(userGlobals.wbUserCheckKeyword) !== -1) {
        //   this.licensingWarning = messages.addUserLicensingError.workbench;
        // }
        // if (tempFeatures.indexOf(userGlobals.creatorCheckKeyword) !== -1) {
        //   this.licensingWarning = messages.addUserLicensingError.creator;
        // }
        if((tempFeaturesKey.indexOf(userGlobals.rulesandalertsKeyword) > -1) || (tempFeaturesKey.indexOf(userGlobals.healthCheckKeyword) > -1)){
          this.endCustomerList = [];
          this.endCustomerList = this.adminService.getEndCustomerListForUser(this.userForm.value.default_prod);
          this.endCustomerList.unshift('All');
          this.userForm.patchValue({
            end_customer: data ? data : this.endCustomerList[0]
          });
        }
      }
    }
    if (this.userForm.value.is_external) {
      this.endCustomerList = [];
      this.endCustomerList = this.adminService.getEndCustomerListForUser(this.userForm.value.default_prod);
      this.userForm.patchValue({
        end_customer: data ? data : this.endCustomerList[0]
      });
    }
    this.disableUserNotificationCheckbox = (this.isEditMode && this.user.mps_def !== this.userForm.controls.default_prod.value) ? null : true;
    if(allRoles.indexOf(userGlobals.creatorCheckKeyword) > -1){
      this.licensingWarning = messages.addUserLicensingError.creator;
      return
    }
    if(allRoles.indexOf(userGlobals.wbUserCheckKeyword) > -1){
      this.licensingWarning = messages.addUserLicensingError.workbench;
      return
    }
    if(allRoles.indexOf(userGlobals.wbViewerCheckKeyword) > -1 && this.isviewercust){
      this.licensingWarning = messages.addUserLicensingError.dashboards;
      return
    }
  }

  getEndCustomerListForBulkEdit() {
    let tempFeatures = [];
    let tempFeaturesKey = [];
    this.endCustomerList = [];
    this.endCustomerList.unshift('All');
    this.bulkEditForm.patchValue({
      end_customer: this.endCustomerList[0]
    });
    for(let i=0; i<this.roleList.length;i++){
      if(this.roleList[i].name === this.bulkEditForm.value.role){
        for(let j=0;j<this.roleList[i].featureData.length;j++){
          let obj = <any>{};
          obj = this.roleList[i].featureData[j];
          if(obj.mps_def === this.bulkEditForm.value.product){
            tempFeatures = tempFeatures.concat(this.roleList[i].featureData[j]["featuresDis"]);
            tempFeaturesKey = this.roleList[i].featureData[j]["featureKey"].split(",");
          }
        }
        tempFeatures = _.uniq(tempFeatures);
        tempFeaturesKey = _.uniq(tempFeaturesKey);
        if((tempFeaturesKey.indexOf(userGlobals.rulesandalertsKeyword) > -1) || (tempFeaturesKey.indexOf(userGlobals.healthCheckKeyword) > -1)){
          this.endCustomerList = this.adminService.getEndCustomerListForUser(this.bulkEditForm.value.product);
          this.endCustomerList.unshift('All');
          this.bulkEditForm.patchValue({
            end_customer: this.endCustomerList[0]
          });
        }
      }
    }
    if(this.bulkEditUserType === 'external' && this.endCustomerList.length){
      this.endCustomerList = [];
      this.endCustomerList = this.adminService.getEndCustomerListForUser(this.bulkEditForm.value.product);
      this.bulkEditForm.patchValue({
        end_customer: this.endCustomerList[0]
      });
    }
  }

  getSelectedValues(list) {
    var tmp = [];
    if (Array.isArray(list)) {
      list.map((item) => {
        if (item.selected) {
          tmp.push(item.name);
        }
      });
      return tmp;
    }
    return [];
  }

  updateDataFilter(columnValue, selected, multiselect, actualData, columnName) {
    let filterList = [];
    //for single select
    if (!multiselect && selected) {
      if (Array.isArray(actualData)) {
        actualData.map((item) => {
          if (columnValue === item.name) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
      }
    }
    this.userFilterData.map((item) => {
      if (this.getSelectedValues(item.data).length) {
        filterList.push({
          'columnName': item.columnName,
          'columnValue': this.getSelectedValues(item.data)
        });
        item['appliedFilterCount'] = this.getSelectedValues(item.data).length;
      } else {
        item['appliedFilterCount'] = 0;
      }
      this.filterCount = filterList.length;
      var filteredData = this.applyFilter(this.userListCopy, filterList);
      this.users = filteredData;
    });
    if(this.getUserListFiltered().length+this.defaultPageSize<=this.pageSize){
      this.pageSize = this.pageValue[0];
    }
    if (columnName === "user_type") {
      this.quickFilterButtons.map(function (item) {
        if (item.columnValue === columnValue) {
          item.selected = selected;
        } else {
          item.selected = false;
        }
      });
      if (!selected) {
        this.quickFilterButtons.map(function (item) {
          if (item.title == 'All') {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
      }
    }
    this.PaginationReset = true;
  }

  applyFilter(list, filterList) {
    return list.filter((item) => {
      for (var i = 0; i < filterList.length; i++) {
        // var innerFound = false;
        var columnName = filterList[i]['columnName'];
        var columnValueList = filterList[i]['columnValue'];
        var innerFound = this.setFilterData(item, columnName, columnValueList);
        if (!innerFound) {
          return false;
        }
      }
      return true;
    }, this);
  }

  isInTimerange(timeRange, targetDateTime) {
    var ts = new Date().getTime();
    var oneDay = 24 * 60 * 60 * 1000;
    var st, et;
    switch (timeRange) {
      case 'Last 24 Hrs':
        var tsYesterday = ts - oneDay;
        st = new Date(tsYesterday);
        et = new Date();
        break;
      case 'Last Week':
        var lastweek = ts - (7 * oneDay);
        st = new Date(lastweek);
        et = new Date();
        break;
      case 'Last Month':
        var lastmonth = ts - (30 * oneDay);
        st = new Date(lastmonth);
        et = new Date();
        break;
      case 'Last 6 Months':
        var last6month = ts - (6 * 30 * oneDay);
        st = new Date(last6month);
        et = new Date();
        break;
    }

    var currentDataTimeStr = targetDateTime;
    currentDataTimeStr = moment(currentDataTimeStr, "YYYY-MM-DD HH:mm:ss").toDate();
    var range = moment(currentDataTimeStr).isBetween(st, et);
    if (range) {
      return true;
    }
    return false;
  }

  setFilterData(columnData, columnName, columnValueList) {
    let innerFound = false;
    switch (columnName) {
      case 'end_customer':
        for (var j = 0; j < columnValueList.length; j++) {
          if (columnValueList[j] == 'NA' && columnData[columnName] == '' || columnData[columnName] == columnValueList[j]) {
            return innerFound = true;
          }
        }
        break;
      case 'created_on':
      case 'modified_on':
      case 'last_login':
      case 'updated_on':
        if (columnValueList && columnValueList[0]) {
          var targetDateTime = columnValueList[0];
          if (this.isInTimerange(targetDateTime, columnData[columnName])) {
            return innerFound = true;
          }
        }
        break;
      case 'status':
        for (var j = 0; j < columnValueList.length; j++) {
          if (columnData.user_state == 'ACTIVE' && columnValueList[j] == 'Active' || columnData.user_state == 'INACTIVE' && columnValueList[j] == 'Inactive' || columnData.user_state == 'INVITED' && columnValueList[j] == 'Invited') {
            return innerFound = true;
          }
        }
        break;
      case 'user_type':
        for (var j = 0; j < columnValueList.length; j++) {
          if (columnData.is_external && columnValueList[j] == 'External' ||
            !columnData.is_external && columnValueList[j] == 'Internal') {
            return innerFound = true;
          }
        }
        break;
      default:
        for (var j = 0; j < columnValueList.length; j++) {
          if (columnData[columnName] == columnValueList[j]) {
            return innerFound = true;
          }
        }
        break;
    }
  }

  resetFilter() {
    this.userFilterData.map((item) => {
      item['appliedFilterCount'] = 0;
      item['expand'] = false;
      item.enabled = false;
      item['searchText'] = '';
      if (Array.isArray(item.data)) {
        item.data.map((item) => {
          item.selected = false;
        })
      } else {
        for (var key in item.data) {
          item.data[key]['selected'] = false;
        }
      }
    });
    this.quickFilterButtons.map((item) => {
      item.selected = (item.title === 'All') ? true : false;
    });
    this.users = this.userListCopy;
    this.users.map((user) => {
      user.name = user.first_name + ' ' + user.last_name;
      user.selected = false;
    })
    this.filterCount = 0;
    this.PaginationReset = true;
  };

  applyQuickFilter(btn) {
    if (btn.selected) return;
    let multiselect, actualData;
    btn.selected = !btn.selected;
    multiselect = false;
    actualData = [{
      "name": "Internal",
      "selected": true
    },
    {
      "name": "External",
      "selected": false
    }
    ];
    this.quickFilterButtons.map((item) => {
      if (btn.title != item.title) {
        item.selected = false;
      }
    });
    let filter: any;
    var selectedFilterItem = null;
    this.userFilterData.map((item) => {
      if (item.columnName === btn.columnName) {
        filter = item;
        selectedFilterItem = item;
        for (var key in item.data) {
          if (item.data[key]['name'] === btn.columnValue) {
            item.data[key]['selected'] = true;
          } else {
            item.data[key]['selected'] = false;
          }
        }
      }
    });
    this.clearSelection();
    if(btn.columnValue != "*"){
      filter.enabled = true;
    }else {
      filter.enabled = false;
    }
    this.updateDataFilter(btn.columnValue, btn.selected, multiselect, actualData, 'user_type');
  };

  //check if the icon should be shown or not
  enableBulkEdit() {
    let flag = false;
    if (this.users) {
      let selectedUsers = this.users.filter((item) => {
        return item.selected && item.user_state !== 'INVITED';
      });
      this.bulkSelectedUsers = selectedUsers;
      this.userFilterData.forEach((filterItem) => {
        if (filterItem.columnName === 'user_type' && filterItem['appliedFilterCount'] > 0 && selectedUsers.length > 1) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    }
  }

  setBulkEditTitle() {
    let text = this.templateVariables.validationMessages.bulkEditDefaultText;
    this.quickFilterButtons.map((item) => {
      if (item.selected && item.columnValue !== '*') {
        text = this.templateVariables.validationMessages.bulkEditText;
      }
    });
    this.userFilterData.forEach((filterItem) => {
      if (filterItem.columnName === 'user_type' && filterItem['appliedFilterCount'] > 0 && this.bulkSelectedUsers.length > 1) {
        text = 'Edit ' + this.bulkSelectedUsers.length + ' users';
      }
    });
    return text;
  }

  setBulkEditRoles() {
    let quickFilterApplied = this.quickFilterButtons.filter((item) => {
      return item.selected;
    });
    if (quickFilterApplied[0].columnValue === 'Internal') {
      this.bulkEditUserType = 'internal';
      this.roles = this.roleList.filter((item) => {
        if (item.roleType === userGlobals.internalCheckKeyword) {
          return item;
        }
      });
    } else {
      this.bulkEditUserType = 'external';
      this.roles = this.roleList.filter((item) => {
        if (item.roleType === userGlobals.externalCheckKeyword) {
          return item;
        }
      });
    }
  }

  setBulkEditValidators() {
    const productControl = this.bulkEditForm.get('product');
    const passwordControl = this.bulkEditForm.get('password');
    const confirmPasswordControl = this.bulkEditForm.get('confirmPassword');
    const endCustomerControl = this.bulkEditForm.get('end_customer');

    this.bulkEditForm.get('role').valueChanges.subscribe(role => {
      if (role) {
        productControl.setValidators([Validators.required]);
      }
      productControl.updateValueAndValidity();
    });

    this.bulkEditForm.get('password').valueChanges.subscribe(password => {
      if (password) {
        confirmPasswordControl.setValidators([Validators.required]);
      }
      confirmPasswordControl.updateValueAndValidity();
    });
    if(this.bulkEditUserType === 'external'){
      this.bulkEditForm.get('product').valueChanges.subscribe(prod => {
        if (prod) {
          endCustomerControl.setValidators([Validators.required]);
        }
        endCustomerControl.updateValueAndValidity();
      });
    }
    // this.bulkEditForm.get('confirmPassword').valueChanges.subscribe(password => {
    //   if (password) {
    //     passwordControl.setValidators([Validators.required]);
    //   }
    //   passwordControl.updateValueAndValidity();
    // });
  }

  saveBulkEdit() {
    this.submitted = true;
    let userPostData = {
      userRole: {}
    };
    let users = [];
    this.resetPassError = '';
    if (this.bulkEditForm.value.password.length) {
      const regex = this.regexObj.password;
      let isPasswordValid = regex.test(this.bulkEditForm.value.password);
      if (!isPasswordValid) {
        this.resetPassError = messages.passwordNotValid;
        return;
      }
      if (this.bulkEditForm.value.password !== this.bulkEditForm.value.confirmPassword) {
        this.resetPassError = messages.passwordMatchError;
        return;
      }
    }
    if (this.bulkEditForm.value.confirmPassword.length) {
      const regex = this.regexObj.password;
      let isPasswordValid = regex.test(this.bulkEditForm.value.confirmPassword);
      if (!isPasswordValid) {
        this.resetPassError = messages.passwordNotValid;
        return;
      }
      if (this.bulkEditForm.value.password !== this.bulkEditForm.value.confirmPassword) {
        this.resetPassError = messages.passwordMatchError;
        return;
      }
    }
    if (this.bulkEditForm.invalid) {
      return;
    }
    this.roleList.map((item) => {
      if (item.name === this.bulkEditForm.value.role) {
        item.featureData.map((featureItem: any) => {
          if (featureItem.mps.join('/') === this.bulkEditForm.value.product &&
            featureItem.features.indexOf(userGlobals.wbUserCheckKeyword) > -1) {
            let role = this.setTableauUserInfo(this.bulkEditForm.value);
            let roleType = this.setTableauUserRoleType(role);
            this.bulkSelectedUsers.map((item) => {
              if (roleType) {
                let userData = {} as TableauUser;
                userData.userName = item.email;
                userData.roleType = roleType;
                users.push(userData);
              };
            });
            userPostData.userRole = users;
          }
        })
      }
      let remainingViewerLicenses = this.licensesData.maxViewerLicenses - this.licensesData.viewerLicensesUser;
      let features = this.getFeaturesForRole(this.bulkEditForm.value.role, this.bulkEditForm.value.product);
      if(features){
        if ((remainingViewerLicenses < this.bulkSelectedUsers.length) && (features.featuresDis.indexOf(userGlobals.wbViewerCheckKeyword) > -1 && features.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) === -1 && features.featuresDis.indexOf(userGlobals.creatorCheckKeyword) === -1 && this.isviewercust)) {
          this.errorMessage = messages.userLicenseExceedTextBulk.viewer.replace(/%adminemail/g, this.adminService.getCookie("adminEmail"));
          this.submitted = false;
          return;
        }
        let remainingWbLicenses = this.licensesData.maxWBLicenses - this.licensesData.workbenchLicensedUsed;
        if((remainingWbLicenses < this.bulkSelectedUsers.length) && features.featuresDis.indexOf('Workbench') > -1 && features.featuresDis.indexOf(userGlobals.creatorCheckKeyword) === -1){
          this.errorMessage = messages.userLicenseExceedTextBulk.workbench;
          this.submitted = false;
          return;
        }
        let remainingCreatorLicenses = this.licensesData.maxCreatorLicenses - this.licensesData.creatorLicensesUsed;
        if (this.bulkSelectedUsers.length > remainingCreatorLicenses && features.featuresDis.indexOf(userGlobals.creatorCheckKeyword) > -1) {
          this.errorMessage = messages.userLicenseExceedTextBulk.creator;
          this.submitted = false;
          return;
        }
      }
    });
    if(this.bulkEditForm.value.role.length) {
      let roleNew = this.setTableauUserInfo(this.bulkEditForm.value);
      if(roleNew){
        for(let i=0; i<roleNew.length;i++){
          let obj: any = roleNew[i];
          let roleType = this.setTableauUserRoleType(roleNew[i]);
          if (roleType) {
            for(let k=0; k<this.bulkSelectedUsers.length; k++){
              let userData = {} as TableauUser;
              userData.userName = this.bulkSelectedUsers[k].email;
              userData.roleType = roleType;
              userData.mps = obj.mps_def;
              users.push(userData);
            }
          }else {
            for(let k=0; k<this.bulkSelectedUsers.length; k++){
              let userData = {} as TableauUser;
              userData.userName = this.bulkSelectedUsers[k].email;
              userData.roleType = "Unlicensed";
              userData.mps = obj.mps_def;
              users.push(userData);
            }
          }
        }
      }
    }
    if (this.submitted) {
      let postData = {
        usrEmails: [],
        role: '',
        mps_def: '',
        user_state: '',
        password: '',
        cpassword: '',
        end_customer: ''
      };
      postData.usrEmails = this.bulkSelectedUsers.map((item) => {
        return item.email;
      })
      postData.role = this.bulkEditForm.value.role;
      postData.mps_def = this.bulkEditForm.value.product;
      postData.end_customer = this.bulkEditForm.value.end_customer === 'All' ? '' : this.bulkEditForm.value.end_customer;
      postData.user_state = this.bulkEditForm.value.active;
      postData.password = this.bulkEditForm.value.password;
      postData.cpassword = this.bulkEditForm.value.confirmPassword;
      this.adminService.post(postData, api.bulkEditUsers + this.adminService.getMfr()).subscribe((response: DataResponse) => {
        if(response.Status && this.bulkEditForm.value.sendNotification){
          let rulesSubscriptionPostData: any = {};
          rulesSubscriptionPostData.user_group_info = [];
          this.bulkSelectedUsers.map((item) => {
            let obj :any = {};
            obj.user = item.email;
            obj.old_group = item.end_customer;
            obj.new_group = this.bulkEditForm.value.end_customer === 'All' ? '' : this.bulkEditForm.value.end_customer;
            rulesSubscriptionPostData.user_group_info.push(obj);
          })
          rulesSubscriptionPostData.mps = postData.mps_def;
          rulesSubscriptionPostData.send_notification = this.bulkEditForm.value.sendNotification;
          this.adminService.post(rulesSubscriptionPostData, api.rulesSubscriptionFilter + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe((response: DataResponse) => {
          });
        }
        this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
        this.modalService.dismissAll();
        if (users.length > 0) {
          if(this.isTableauConfigured){
            this.adminService.post(users, api.addTableauUser + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe(() => {
            });
          }
        }
        this.getUserList();
      });
    }
  }

  exportCSVFile() {
    let data = _.cloneDeep(this.users);
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let obj = <any>{};
      obj.name = data[i].first_name + ' ' + data[i].last_name;
      obj.email = data[i].email;
      obj.role = data[i].roleName;
      obj.system_group = data[i].end_customer;
      obj.created_on = data[i].created_on;
      obj.modified_on = data[i].modified_on;
      obj.last_login = data[i].last_login;
      obj.status = data[i].user_state;
      obj.user_type = data[i].is_external ? "External" : "Internal";
      arr.push(obj);
    }
    this.csvData = arr;
    this.adminService.downloadCSVFile(this.csvData, userGlobals.reportTitle);
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  setEndCustomerValidator() {
    const endCustomerControl = this.userForm.get('end_customer');
    if (this.userForm.value.is_external) {
      endCustomerControl.setValidators([Validators.required]);
      endCustomerControl.updateValueAndValidity();
    }
  }

  enableTootip(e, text, type) {
    if (e.target.offsetWidth < e.target.scrollWidth) {
      e.target.title = text;
      if (type === 'name') {
        e.target.title = text.first_name + ' ' + text.last_name;
      }
      if (type === 'date') {
        e.target.title = moment(text).format('ddd MMM DD YYYY hh:mm:ss');
      }
    }
  }

  setPhoneNumberValidator() {
    const phoneNumberControl = this.userForm.get('phone');
    const countryCodeControl = this.userForm.get('countryCode');
    phoneNumberControl.setValidators([Validators.minLength(this.minCharacters), Validators.maxLength(20), Validators.pattern(this.regexObj.phone)]);
    phoneNumberControl.updateValueAndValidity();
    countryCodeControl.setValidators([Validators.minLength(this.minCharacters), Validators.maxLength(6), Validators.pattern(this.regexObj.phone)]);
    countryCodeControl.updateValueAndValidity();
    if (this.userForm.value.countryCode.length > 0) {
      phoneNumberControl.setValidators([Validators.required, Validators.minLength(this.minCharacters), Validators.maxLength(20), Validators.pattern(this.regexObj.phone)]);
      phoneNumberControl.updateValueAndValidity();
    }
    if (this.userForm.value.phone.length > 0) {
      countryCodeControl.setValidators([Validators.minLength(this.minCharacters), Validators.maxLength(6), Validators.required, Validators.pattern(this.regexObj.phone)]);
      countryCodeControl.updateValueAndValidity();
    }
  }

  checkGroupChanges(){
    if(this.user.end_customer === '' && this.userForm.controls.end_customer.value === 'All'){
      this.disableUserNotificationCheckbox = true;
      this.userForm.patchValue({
        sendNotification: false
      })
      return;
    }
    this.disableUserNotificationCheckbox = (this.user.end_customer !== this.userForm.controls.end_customer.value) ? null : true;
    if(this.disableUserNotificationCheckbox){
      this.userForm.patchValue({
        sendNotification: false
      })
    }
  }

}
