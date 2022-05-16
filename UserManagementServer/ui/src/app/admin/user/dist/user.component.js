"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserComponent = exports.boolcompare = exports.compare = void 0;
var core_1 = require("@angular/core");
var sortable_directive_1 = require("../../shared/directives/sortable.directive");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var forms_1 = require("@angular/forms");
var userGlobals = require("./global");
var confirmation_popup_component_1 = require("../../shared/confirmation-popup/confirmation-popup.component");
var _ = require("lodash");
var api = require("../../shared/resource");
var messages = require("../../shared/message");
var global = require("../../shared/global");
var global_1 = require("../role/global");
var moment = require("moment");
exports.compare = function (v1, v2) { return v1 < v2 ? -1 : v1 > v2 ? 1 : 0; };
exports.boolcompare = function (v1, v2) { return (v1 === v2) ? 0 : v1 ? -1 : 1; };
var UserComponent = /** @class */ (function () {
    function UserComponent(adminService, modalService, formBuilder, toast, userTrackingService) {
        this.adminService = adminService;
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.toast = toast;
        this.userTrackingService = userTrackingService;
        this.changeWarningOn = false;
        this.loggedInUser = {};
        this.licensesData = {};
        this.page = userGlobals.page;
        this.licensingWarning = "";
        this.pageSize = global.pageSize;
        this.smsize = global.smsize;
        this.pageValue = global.pageValue;
        this.submitted = false;
        this.bulkEditFlag = false;
        this.prodList = [];
        this.endCustomerList = [];
        this.collectionSize = 0;
        this.user = {};
        this.errorMessage = '';
        this.userFilterData = [];
        this.showFilter = false;
        this.filterCount = 0;
        this.noUsersFound = messages.noUsersFound;
        this.userFormHelper = messages.userFormHelper;
        this.mps = [undefined, undefined, undefined];
        this.searchText = '';
        this.quickFilterButtons = userGlobals.quickFilter;
        this.bulkEditEnableOptions = userGlobals.bulkEditEnableOptions;
        this.defaultSort = userGlobals.defaultSort;
        this.regexObj = userGlobals.regex;
        this.selectedCount = 0;
        this.minCharacters = global.minCharacters;
        this.maxCharacters = global.maxCharacters;
        this.PaginationReset = false;
        this.isSSOEnabled = false;
        this.iscreatorcust = false;
        this.isviewercust = false;
        this.bulkEditRoleCount = {
            wbUsers: 0,
            nonWbUsers: 0
        };
        this.bulkEditUserType = 'internal';
        try {
            this.mps = this.adminService.getMPS().split(/:|\//);
        }
        catch (e) { }
        this.templateVariables = userGlobals.templateVariables;
    }
    UserComponent.prototype.ngOnInit = function () {
        this.resetUserForm();
        this.resetChangePasswordForm();
        this.resetBulkEditForm();
        this.getLoggedInUserData();
    };
    Object.defineProperty(UserComponent.prototype, "f", {
        get: function () {
            return this.userForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserComponent.prototype, "p", {
        get: function () {
            return this.changePasswordForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserComponent.prototype, "b", {
        get: function () {
            return this.bulkEditForm.controls;
        },
        enumerable: false,
        configurable: true
    });
    UserComponent.prototype.getLoggedInUserData = function () {
        var _this = this;
        this.loading = true;
        this.adminService.fetchLoggedInUserDetails().subscribe(function (data) {
            _this.adminService.setLoggedInUserDetails(data);
            _this.adminService.getRoleList().subscribe(function () {
                _this.iscreatorcust = _this.adminService.iscreatorcust;
                _this.isviewercust = _this.adminService.isviewercust;
                _this.adminService.getendCustomerList().subscribe(function () {
                    _this.getUserList();
                });
            });
            _this.isSSOEnabled = _this.adminService.isSSOUser();
        });
    };
    UserComponent.prototype.getUserList = function () {
        var _this = this;
        this.licensesData.totalUsers = 0;
        this.roleList = this.adminService.getRoleListArray();
        var cloneUserFilterData = _.cloneDeep(userGlobals.userFilterArray);
        this.adminService.getUserList().subscribe(function (data) {
            _this.users = data;
            _this.userListCopy = _.cloneDeep(data);
            _this.collectionSize = _this.users.length;
            _this.licensesData = _this.adminService.getLicensesData();
            _this.loading = false;
            _this.resetFilter();
            _this.userFilterData = _this.adminService.getFilterObj(_this.users, cloneUserFilterData);
            _this.onSort(_this.defaultSort);
            _this.updateSelectAllValue();
        });
    };
    UserComponent.prototype.getUserListFiltered = function () {
        var _this = this;
        var tempUserList = this.users;
        this.searchText = this.searchText.toLowerCase();
        if (this.searchText.length === 0) {
            if (this.PaginationReset) {
                this.page = 1;
                this.PaginationReset = false;
            }
            return this.users;
        }
        if (this.searchText.length >= 3) {
            tempUserList = tempUserList.filter(function (item) {
                return item.first_name.toLowerCase().includes(_this.searchText) || item.last_name.toLowerCase().includes(_this.searchText) ||
                    item.end_customer.toLowerCase().includes(_this.searchText) || item.roleName.toLowerCase().includes(_this.searchText) || item.email.toLowerCase().includes(_this.searchText) || item.user_state.toLowerCase().includes(_this.searchText) || (!item.is_external && userGlobals.internalCheckKeyword.toLowerCase().includes(_this.searchText)) || (item.is_external && userGlobals.externalCheckKeyword.toLowerCase().includes(_this.searchText));
            });
        }
        if (this.PaginationReset) {
            this.page = 1;
            this.PaginationReset = false;
        }
        return tempUserList;
    };
    UserComponent.prototype.getFilterData = function (filter) {
        var tmpFilterList = _.cloneDeep(filter.data);
        if (filter.searchText.length < 3) {
            return [];
        }
        if (filter.searchText.length >= 3) {
            tmpFilterList = filter.data.filter(function (item) {
                return item.name.toLowerCase().includes(filter.searchText);
            });
        }
        return tmpFilterList;
    };
    UserComponent.prototype.onSort = function (_a) {
        var _this = this;
        var column = _a.column, direction = _a.direction;
        // resetting other headers
        if (this.headers) {
            this.headers.forEach(function (header) {
                if (header.sortable !== column) {
                    header.direction = '';
                }
            });
        }
        if (direction === '') {
            this.users = this.users;
        }
        else {
            this.users = this.users.sort(function (a, b) {
                var res = column === 'is_external' ? exports.boolcompare(a[column], b[column]) : exports.compare(a[column], b[column]);
                _this.defaultSort.column = column;
                return direction === 'asc' ? res : -res;
            });
        }
    };
    // Modal related code
    UserComponent.prototype.getDismissReason = function (reason) {
        if (reason === ng_bootstrap_1.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === ng_bootstrap_1.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return "with: " + reason;
        }
    };
    UserComponent.prototype.openModal = function (modalType, content, type, user) {
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
        this.modalService.open(content, { size: global.largeModal, backdrop: 'static', keyboard: false });
    };
    UserComponent.prototype.closeUserModal = function () {
        var _this = this;
        if (this.userForm.dirty) {
            var tempForm_1 = _.cloneDeep(this.userForm);
            var warningModal = this.modalService.open(confirmation_popup_component_1.ConfirmationPopupComponent, { backdrop: 'static', windowClass: "cancelUserConfirmation" });
            warningModal.componentInstance.msg = messages.changeAlert;
            warningModal.result.then(function (result) {
                if (result === 'yesclick') {
                    _this.licensingWarning = "";
                    _this.modalService.dismissAll();
                }
                else {
                    _this.userForm = tempForm_1;
                }
            });
        }
        else {
            this.licensingWarning = "";
            this.modalService.dismissAll();
        }
    };
    UserComponent.prototype.setBulkEditWBRoleCount = function () {
        this.bulkEditRoleCount = {
            wbUsers: 0,
            nonWbUsers: 0
        };
        this.bulkSelectedUsers.map(function (item) {
            var features = this.getFeaturesForRole(item.role, item.mps_def);
            if (features.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1) {
                this.bulkEditRoleCount.wbUsers++;
            }
            else {
                this.bulkEditRoleCount.nonWbUsers++;
            }
        }, this);
    };
    UserComponent.prototype.editUser = function (content, userData) {
        var countryCode, phone;
        this.oldUserRole = userData.role;
        // this.patchUserFormValuesForFilteringRoles();
        this.user = userData;
        for (var key in this.user) {
            if (this.user.hasOwnProperty(key)) {
                if (this.user[key] === "NA") {
                    this.user[key] = "";
                }
            }
        }
        /* Object.entries(this.user).forEach(item => {
            if(this.user.item == "NA"){
             this.user.item = "";
            }
        }) */
        var phoneNumber = this.user.phone.includes('-') ? this.user.phone.split("-") : this.user.phone;
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
            end_customer: this.user.end_customer
        });
        this.filterRoles();
        this.setPhoneNumberValidator();
        this.getProductsForRole(this.userForm, userData);
        this.getEndCustomerList();
    };
    UserComponent.prototype.setTableauUserInfo = function (data) {
        var roleData = this.roleList.filter(function (role) {
            return data.role === role.name || data === role.name;
        });
        var roleProd = roleData[0].featureData;
        return roleProd;
    };
    UserComponent.prototype.setTableauUserRoleType = function (role) {
        var roleItem = role;
        console.log(roleItem.featuresDis);
        var tableauUsers = userGlobals.TableauSiteRoleFeaturesMap;
        if (this.isviewercust) {
            tableauUsers = tableauUsers.filter(function (item) {
                return item.site_role !== "Explorer";
            });
        }
        for (var i = 0; i < tableauUsers.length; i++) {
            if (tableauUsers[i].features.length === _.intersection(roleItem.featuresDis, tableauUsers[i].features).length) {
                return tableauUsers[i].site_role;
            }
        }
    };
    UserComponent.prototype.patchUserFormValuesForFilteringRoles = function () {
        this.userForm.patchValue({
            role: '',
            default_prod: '',
            end_customer: ''
        });
    };
    UserComponent.prototype.filterRoles = function () {
        this.patchUserFormValuesForFilteringRoles();
        this.roles = this.roleList.filter(function (item) {
            if (item.roleType === userGlobals.internalCheckKeyword) {
                return item;
            }
        });
        if (this.userForm.value.is_external) {
            this.roles = this.roleList.filter(function (item) {
                if (item.roleType === userGlobals.externalCheckKeyword) {
                    return item;
                }
            });
        }
    };
    UserComponent.prototype.getProductsForRole = function (form, data) {
        var _this = this;
        this.licensingWarning = "";
        var passRole = "";
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
        }
        else {
            passRole = form.value.role;
        }
        this.roleList.filter(function (item) {
            if (item.name === form.value.role) {
                _this.prodList = item.featureData;
            }
        });
        this.prodList.map(function (prod) {
            prod.mps_def = prod.mps.join('/');
        });
        if (passRole === '') {
            this.bulkEditForm.patchValue({
                product: ''
            });
        }
        else {
            this.bulkEditForm.patchValue({
                product: this.prodList[0].mps_def
            });
        }
        if (!data) {
            this.getEndCustomerListForBulkEdit();
            this.userForm.patchValue({
                default_prod: this.prodList[0].mps_def
            });
        }
        this.getMaxLicense(passRole);
    };
    UserComponent.prototype.getMaxLicense = function (passRole) {
        var roleFeature = this.roleList.filter(function (item) {
            return item.name === passRole;
        })[0].featureData;
        var selectedFeatures = [];
        roleFeature.map(function (item) {
            var tempArray = item.featureKey.split(",");
            selectedFeatures = selectedFeatures.concat(tempArray);
            selectedFeatures = _.uniq(selectedFeatures);
        });
        if (selectedFeatures.indexOf(global_1.roleFeatures[1].value) != -1 && selectedFeatures.indexOf(global_1.roleFeatures[3].value) == -1 && selectedFeatures.indexOf(global_1.roleFeatures[4].value) == -1) {
            if (this.bulkEditFlag) {
                this.licensingWarning = messages.bulkeditUserLicensingError.dashboards;
            }
            else {
                this.licensingWarning = messages.addUserLicensingError.dashboards;
            }
        }
        else if (selectedFeatures.indexOf(global_1.roleFeatures[1].value) != -1 && selectedFeatures.indexOf(global_1.roleFeatures[3].value) != -1 && selectedFeatures.indexOf(global_1.roleFeatures[4].value) == -1) {
            if (this.bulkEditFlag) {
                this.licensingWarning = messages.bulkeditUserLicensingError.workbench;
            }
            else {
                this.licensingWarning = messages.addUserLicensingError.workbench;
            }
        }
        else if (selectedFeatures.indexOf(global_1.roleFeatures[1].value) != -1 && selectedFeatures.indexOf(global_1.roleFeatures[3].value) != -1 && selectedFeatures.indexOf(global_1.roleFeatures[4].value) != -1) {
            if (this.bulkEditFlag) {
                this.licensingWarning = messages.bulkeditUserLicensingError.creator;
            }
            else {
                this.licensingWarning = messages.addUserLicensingError.creator;
            }
        }
    };
    UserComponent.prototype.resetUserForm = function () {
        this.licensingWarning = "";
        this.userForm = this.formBuilder.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(this.maxCharacters), forms_1.Validators.pattern(this.regexObj.firstname)]],
            lastName: ['', [forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(this.maxCharacters), forms_1.Validators.pattern(this.regexObj.lastname)]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.regexObj.email)]],
            phone: ['', [forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(20), forms_1.Validators.pattern(this.regexObj.phone)]],
            department: ['', [forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(this.maxCharacters), forms_1.Validators.pattern(this.regexObj.generic)]],
            state: ['', [forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(this.maxCharacters), forms_1.Validators.pattern(this.regexObj.generic)]],
            city: ['', [forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(this.maxCharacters), forms_1.Validators.pattern(this.regexObj.generic)]],
            country: ['', [forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(this.maxCharacters), forms_1.Validators.pattern(this.regexObj.generic)]],
            role: ['', forms_1.Validators.required],
            default_prod: ['', forms_1.Validators.required],
            is_external: false,
            end_customer: [''],
            countryCode: ['', [forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(6), forms_1.Validators.pattern(this.regexObj.phone)]]
        });
        this.userForm.clearValidators();
        this.submitted = false;
        this.errorMessage = '';
    };
    UserComponent.prototype.resetChangePasswordForm = function () {
        this.changePasswordForm = this.formBuilder.group({
            password: ['', forms_1.Validators.required],
            confirmPassword: ['', forms_1.Validators.required]
        });
        this.changePasswordForm.clearValidators();
        this.submitted = false;
        this.resetPassError = '';
    };
    UserComponent.prototype.resetBulkEditForm = function () {
        this.bulkEditForm = this.formBuilder.group({
            role: [''],
            product: [''],
            password: [''],
            confirmPassword: [''],
            active: [''],
            end_customer: ['']
        });
        this.bulkEditForm.clearValidators();
        this.submitted = false;
        this.resetPassError = '';
        this.errorMessage = '';
    };
    UserComponent.prototype.getFeaturesForRole = function (role, product) {
        for (var i = 0; i < this.roleList.length; i++) {
            if (this.roleList[i].name === role) {
                for (var j = 0; j < this.roleList[i].featureData.length; j++) {
                    var feature = this.roleList[i].featureData[j];
                    feature.mps_def = feature.mps_def ? feature.mps_def : feature.mps.join('/');
                    if (product === feature.mps_def) {
                        return feature;
                    }
                }
            }
        }
    };
    UserComponent.prototype.saveUser = function () {
        var _this = this;
        this.submitted = true;
        this.errorMessage = '';
        var creatorLicensesUsed = this.licensesData.maxCreatorLicenses === this.licensesData.creatorLicensesUsed ? true : false;
        this.users.forEach(function (item) {
            if (_this.userForm.value.email.toLowerCase() === item.email && !_this.isEditMode) {
                _this.userForm.controls['email'].setErrors({ 'duplicate': true });
                return;
            }
        });
        this.roleList.map(function (item) {
            if (item.name === _this.userForm.value.role) {
                for (var i = 0; i < item.featureData.length; i++) {
                    var feature = item.featureData[i];
                    feature.mps_def = feature.mps_def ? feature.mps_def : feature.mps.join('/');
                    if (_this.userForm.value.default_prod === feature.mps_def) {
                        _this.wbUserName = feature.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 || _this.isviewercust ? _this.userForm.value.email : 'Generic';
                        if (!_this.isEditMode) {
                            var viewerLicensesUsed = _this.licensesData.maxViewerLicenses === _this.licensesData.viewerLicensesUser ? true : false;
                            if (feature.featuresDis.indexOf(userGlobals.wbViewerCheckKeyword) > -1 && feature.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) === -1 && viewerLicensesUsed && feature.isViewer) {
                                _this.errorMessage = messages.viewerLicensesExceededText.replace(/%adminemail/g, _this.adminService.getCookie("adminEmail"));
                                _this.submitted = false;
                                return;
                            }
                        }
                        if (!_this.isEditMode) {
                            var wbLicensesUsed = _this.licensesData.maxWBLicenses === _this.licensesData.workbenchLicensedUsed ? true : false;
                            if (feature.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 && wbLicensesUsed) {
                                _this.errorMessage = messages.workbenchLicensesExceededText;
                                _this.submitted = false;
                                return;
                            }
                        }
                        if (feature.featuresDis.indexOf(userGlobals.creatorCheckKeyword) > -1 && creatorLicensesUsed) {
                            _this.errorMessage = messages.creatorLicensesExceededText;
                            _this.submitted = false;
                            return;
                        }
                    }
                }
            }
        });
        if (!this.isEditMode && this.licensesData.totalUsers >= this.licensesData.maxUsers) {
            this.errorMessage = this.templateVariables.validationMessages.maxUsersExceeded;
            this.submitted = false;
            return;
        }
        if (this.isEditMode) {
            var oldUserRoleFeatures = this.getFeaturesForRole(this.oldUserRole, this.userForm.value.default_prod);
            var newUserRoleFeatures = this.getFeaturesForRole(this.userForm.value.role, this.userForm.value.default_prod);
            if (oldUserRoleFeatures.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) === -1 && newUserRoleFeatures.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1) {
                var wbLicensesUsed = this.licensesData.maxWBLicenses === this.licensesData.workbenchLicensedUsed ? true : false;
                if (wbLicensesUsed) {
                    this.errorMessage = messages.workbenchLicensesExceededText;
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
            var apiUrl = this.isEditMode ? api.editUser : api.addUser;
            var countryCode = this.userForm.value.countryCode.trim().length ? '+' + this.userForm.value.countryCode : '';
            var phone = this.userForm.value.phone.trim().length ? '-' + this.userForm.value.phone : '';
            var phoneNumber = countryCode + phone;
            var postData_1 = {
                first_name: this.userForm.value.firstName.trim(),
                last_name: this.userForm.value.lastName.trim(),
                department: this.userForm.value.department.trim(),
                state: this.userForm.value.state.trim(),
                city: this.userForm.value.city.trim(),
                country: this.userForm.value.country.trim(),
                sso: this.isSSOEnabled,
                wb_user_name: this.wbUserName,
                report_usage: false,
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
                end_customer: this.userForm.value.end_customer,
                active: true
            };
            this.adminService.post(postData_1, apiUrl + this.adminService.getMfr()).subscribe(function (response) {
                if (_this.isEditMode) {
                    _this.userTrackingService.userTracking("Admin Panel : User", "Edit User", JSON.stringify(postData_1) + " Edited : ");
                }
                else {
                    _this.userTrackingService.userTracking("Admin Panel : User", "Add User", JSON.stringify(postData_1) + " Added : ");
                }
                var role = _this.setTableauUserInfo(_this.userForm.value);
                var userPostData = [];
                var usersTemp = [];
                for (var i = 0; i < role.length; i++) {
                    var obj = role[i];
                    if (obj.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 || _this.isviewercust) {
                        var roleType = _this.setTableauUserRoleType(role[i]);
                        if (roleType) {
                            var userData = {};
                            userData.userName = _this.userForm.value.email;
                            userData.roleType = roleType;
                            userData.mps = obj.mps_def;
                            usersTemp.push(userData);
                        }
                        ;
                        userPostData = usersTemp;
                    }
                }
                _this.adminService.post(userPostData, api.addTableauUser + _this.mps[0] + '/' + _this.mps[1] + '/' + _this.mps[2]).subscribe(function () {
                });
                if (_this.oldUserRole !== _this.userForm.value.role) {
                    var users = [];
                    var userPostData_1 = {
                        userRole: {}
                    };
                    var features = _this.getFeaturesForRole(_this.oldUserRole, _this.userForm.value.default_prod);
                    if (features && features.featuresDis.indexOf('Workbench') > -1) {
                        var role_1 = _this.setTableauUserInfo(_this.userForm.value);
                        for (var i = 0; i < role_1.length; i++) {
                            var userData = {};
                            userData.roleType = 'Unlicensed';
                            userData.userName = _this.userForm.value.email;
                            userData.mps = role_1[i].mps_def;
                            users.push(userData);
                        }
                        _this.adminService.post(users, api.addTableauUser + _this.mps[0] + '/' + _this.mps[1] + '/' + _this.mps[2]).subscribe(function () {
                        });
                    }
                }
                _this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
                _this.modalService.dismissAll();
                _this.resetUserForm();
                _this.getUserList();
            });
        }
    };
    UserComponent.prototype.disableUser = function (row) {
        var _this = this;
        var featureList = this.setTableauUserInfo(row);
        var userPostData = {
            userRole: {}
        };
        var users = [];
        this.adminService.post('', api.disableUser + row.email + '/' + this.adminService.getMfr()).subscribe(function (response) {
            _this.userTrackingService.userTracking("Admin Panel : User", "Disable User", row.email + " Disabled : ");
            var feature = featureList[0];
            if (feature.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1) {
                var role = _this.setTableauUserInfo(row);
                for (var i = 0; i < role.length; i++) {
                    var userData = {};
                    userData.roleType = 'Unlicensed';
                    userData.userName = row.email;
                    userData.mps = role[i].mps_def;
                    users.push(userData);
                }
                _this.adminService.post(users, api.addTableauUser + _this.mps[0] + '/' + _this.mps[1] + '/' + _this.mps[2]).subscribe(function () {
                });
            }
            _this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
            _this.getUserList();
        });
    };
    UserComponent.prototype.enableUser = function (row) {
        var _this = this;
        var featureList = this.setTableauUserInfo(row);
        var users = [];
        this.enableUserSubmit = true;
        var wbLicensesUsed = this.licensesData.maxWBLicenses === this.licensesData.workbenchLicensedUsed ? true : false;
        var creatorLicensesUsed = this.licensesData.maxCreatorLicenses === this.licensesData.creatorLicensesUsed ? true : false;
        var obj = featureList[0];
        if (obj.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 && wbLicensesUsed ||
            obj.featuresDis.indexOf(userGlobals.creatorCheckKeyword) > -1 && creatorLicensesUsed) {
            var message = wbLicensesUsed ? messages.workbenchLicensesExceededText : messages.creatorLicensesExceededText;
            this.toast.show(messages.workbenchLicensesExceededText, { classname: global.toastTypes.red, delay: global.toastDelay });
            this.enableUserSubmit = false;
        }
        if (this.enableUserSubmit) {
            this.adminService.post('', api.enableUser + row.email + '/' + this.adminService.getMfr()).subscribe(function (response) {
                _this.userTrackingService.userTracking("Admin Panel : User", "Enable User", row.email + " Enabled : ");
                var role = _this.setTableauUserInfo(row);
                for (var i = 0; i < role.length; i++) {
                    var objN = role[i];
                    if (objN.featuresDis.indexOf(userGlobals.wbUserCheckKeyword) > -1 || _this.isviewercust) {
                        var roleType = _this.setTableauUserRoleType(role[i]);
                        if (roleType) {
                            var userData = {};
                            userData.userName = row.email;
                            userData.roleType = roleType;
                            userData.mps = objN.mps_def;
                            users.push(userData);
                        }
                    }
                }
                _this.adminService.post(users, api.addTableauUser + _this.mps[0] + '/' + _this.mps[1] + '/' + _this.mps[2]).subscribe(function () {
                });
                _this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
                _this.getUserList();
            });
        }
    };
    UserComponent.prototype.openConfirmation = function (type, data) {
        var _this = this;
        var selectedUsers = [];
        var delModal = this.modalService.open(confirmation_popup_component_1.ConfirmationPopupComponent, { backdrop: 'static' });
        var usersToDel = [];
        var tableauUsersList = [];
        delModal.componentInstance.msg = messages.deleteUserMsg;
        delModal.result.then(function (result) {
            if (result === 'yesclick') {
                usersToDel = _this.users.filter(function (item) {
                    return !item.adminUser && item.selected;
                });
                usersToDel.map(function (item) {
                    _this.roleList.map(function (roleItem) {
                        if (roleItem.name === item.role) {
                            for (var i = 0; i < roleItem.featureData.length; i++) {
                                var feature = roleItem.featureData[i];
                                if (feature.mps.join('/') === item.mps_def && feature.features.split(',').indexOf(userGlobals.wbUserCheckKeyword) > -1) {
                                    tableauUsersList.push(item);
                                }
                            }
                        }
                    });
                    selectedUsers.push(item.email);
                });
                var postData_2 = {
                    usrEmails: selectedUsers
                };
                if (tableauUsersList.length > 0) {
                    var userPostData = [];
                    for (var i = 0; i < tableauUsersList.length; i++) {
                        var role = _this.setTableauUserInfo(tableauUsersList[i]);
                        for (var j = 0; j < role.length; j++) {
                            var tempObj = {
                                users: "",
                                mps: ""
                            };
                            tempObj.users = tableauUsersList[i].email;
                            tempObj.mps = role[j].mps_def;
                            userPostData.push(tempObj);
                        }
                    }
                    _this.adminService.post(userPostData, api.deleteTableauUser + _this.mps[0] + '/' + _this.mps[1] + '/' + _this.mps[2]).subscribe(function () {
                    });
                }
                _this.adminService.post(postData_2, api.deleteUser + _this.adminService.getMfr()).subscribe(function (response) {
                    _this.userTrackingService.userTracking("Admin Panel : User", "Delete User", JSON.stringify(postData_2) + " Deleted : ");
                    _this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
                    _this.modalService.dismissAll();
                    _this.getUserList();
                });
            }
        });
    };
    UserComponent.prototype.openEnableDisableUserConfirmation = function (user) {
        var _this = this;
        var delModal = this.modalService.open(confirmation_popup_component_1.ConfirmationPopupComponent, { backdrop: 'static' });
        delModal.componentInstance.msg = user.user_state === 'ACTIVE' ? messages.disableUserMsg + user.email + '?' : messages.enableUserMsg + user.email + '?';
        delModal.result.then(function (result) {
            if (result === 'yesclick') {
                if (user.user_state === 'ACTIVE') {
                    _this.disableUser(user);
                }
                else {
                    _this.enableUser(user);
                }
            }
        });
    };
    UserComponent.prototype.allUsersSelected = function () {
        for (var i = 0; i < this.getCollectionLength(); i++) {
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
    };
    UserComponent.prototype.getUserListLength = function () {
        return this.getUserListFiltered().filter(function (item) { return !item.adminUser; }).length;
    };
    UserComponent.prototype.userToggleSelect = function () {
        this.selectedCount = 0;
        this.isSelectAll = !this.isSelectAll;
        for (var i = 0; i < this.getCollectionLength(); i++) {
            if (!this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].adminUser) {
                this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].selected = this.isSelectAll;
                if (this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
                    this.selectedCount++;
                }
            }
        }
        this.updateSelectAllValue();
    };
    UserComponent.prototype.userPageChanged = function () {
        this.allUsersSelected();
    };
    UserComponent.prototype.getActionButtonDisable = function (typ) {
        if (typ === 'del') {
            var flag = true;
            for (var i = 0; i < this.getCollectionLength(); i++) {
                if (this.getUserListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
                    flag = false;
                }
            }
            return flag;
        }
        if (typ === 'selectAll') {
            var flag = false;
            if (this.getUserListFiltered().length === 1 && !this.getUserListFiltered()[0].adminUser) {
                flag = true;
            }
            return flag;
        }
    };
    //This will return the length of data on the page for current pagination
    UserComponent.prototype.getCollectionLength = function () {
        var collectionLength = this.getUserListFiltered().slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
        return collectionLength.length;
    };
    UserComponent.prototype.selectAcrossPages = function () {
        //Select all roles regardless of pagination
        for (var i = 0; i < this.getUserListFiltered().length; i++) {
            if (!this.getUserListFiltered()[i].adminUser) {
                this.getUserListFiltered()[i].selected = true;
                if (this.getUserListFiltered()[i].selected) {
                    this.selectedCount++;
                }
            }
        }
        this.updateSelectAllValue();
    };
    UserComponent.prototype.clearSelection = function () {
        //Unselect all roles regardless of pagination
        this.selectedCount = 0;
        this.isSelectAll = false;
        for (var i = 0; i < this.users.length; i++) {
            this.users[i].selected = false;
        }
    };
    UserComponent.prototype.getSelectedCount = function () {
        var count = 0;
        for (var i = 0; i < this.getUserListFiltered().length; i++) {
            if (this.getUserListFiltered()[i].selected) {
                count++;
            }
        }
        return count;
    };
    UserComponent.prototype.updateSelectAllValue = function () {
        this.selectedCount = this.getSelectedCount();
    };
    UserComponent.prototype.openChangePasswordModal = function (content) {
        this.resetChangePasswordForm();
        this.modalService.open(content);
    };
    UserComponent.prototype.savePassword = function () {
        var _this = this;
        this.resetPassError = '';
        this.submitted = true;
        var regex = this.regexObj.password;
        var isPasswordValid = regex.test(this.changePasswordForm.value.password);
        if (!isPasswordValid) {
            this.resetPassError = messages.passwordNotValid;
            return;
        }
        if (this.changePasswordForm.value.password !== this.changePasswordForm.value.confirmPassword) {
            this.resetPassError = messages.passwordMatchError;
            return;
        }
        var postData = {
            email: this.currentUser.email,
            password: this.changePasswordForm.value.password
        };
        this.adminService.post(postData, api.resetPassword + this.adminService.getMfr()).subscribe(function (response) {
            _this.userTrackingService.userTracking("Admin Panel : User", "Reset Password", JSON.stringify(postData) + " Changed : ");
            _this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
            _this.modalService.dismissAll();
        });
    };
    UserComponent.prototype.getEndCustomerList = function () {
        for (var i = 0; i < this.prodList.length; i++) {
            if (this.prodList[i].mps_def === this.userForm.value.default_prod) {
                if (this.prodList[i].featuresDis.indexOf(userGlobals.wbViewerCheckKeyword) !== -1 && this.prodList[i].isViewer) {
                    this.licensingWarning = messages.addUserLicensingError.dashboards;
                }
                if (this.prodList[i].featuresDis.indexOf(userGlobals.wbUserCheckKeyword) !== -1) {
                    this.licensingWarning = messages.addUserLicensingError.workbench;
                }
                if (this.prodList[i].featuresDis.indexOf(userGlobals.creatorCheckKeyword) !== -1 && this.prodList[i].isCreator) {
                    this.licensingWarning = messages.addUserLicensingError.creator;
                }
            }
        }
        this.endCustomerList = [];
        if (this.userForm.value.is_external) {
            this.endCustomerList = this.adminService.getEndCustomerListForUser(this.userForm.value.default_prod);
            if (this.userForm.value.end_customer === '') {
                this.userForm.patchValue({
                    end_customer: this.endCustomerList[0]
                });
            }
        }
    };
    UserComponent.prototype.getEndCustomerListForBulkEdit = function () {
        this.endCustomerList = this.adminService.getEndCustomerListForUser(this.bulkEditForm.value.product);
        this.bulkEditForm.patchValue({
            end_customer: ''
        });
    };
    UserComponent.prototype.getSelectedValues = function (list) {
        var tmp = [];
        if (Array.isArray(list)) {
            list.map(function (item) {
                if (item.selected) {
                    tmp.push(item.name);
                }
            });
            return tmp;
        }
        return [];
    };
    UserComponent.prototype.updateDataFilter = function (columnValue, selected, multiselect, actualData, columnName) {
        var _this = this;
        var filterList = [];
        //for single select
        if (!multiselect && selected) {
            if (Array.isArray(actualData)) {
                actualData.map(function (item) {
                    if (columnValue === item.name) {
                        item.selected = true;
                    }
                    else {
                        item.selected = false;
                    }
                });
            }
        }
        this.userFilterData.map(function (item) {
            if (_this.getSelectedValues(item.data).length) {
                filterList.push({
                    'columnName': item.columnName,
                    'columnValue': _this.getSelectedValues(item.data)
                });
                item['appliedFilterCount'] = _this.getSelectedValues(item.data).length;
            }
            else {
                item['appliedFilterCount'] = 0;
            }
            _this.filterCount = filterList.length;
            var filteredData = _this.applyFilter(_this.userListCopy, filterList);
            _this.users = filteredData;
        });
        if (columnName === "user_type") {
            this.quickFilterButtons.map(function (item) {
                if (item.columnValue === columnValue) {
                    item.selected = selected;
                }
                else {
                    item.selected = false;
                }
            });
            if (!selected) {
                this.quickFilterButtons.map(function (item) {
                    if (item.title == 'All') {
                        item.selected = true;
                    }
                    else {
                        item.selected = false;
                    }
                });
            }
        }
    };
    UserComponent.prototype.applyFilter = function (list, filterList) {
        var _this = this;
        return list.filter(function (item) {
            for (var i = 0; i < filterList.length; i++) {
                // var innerFound = false;
                var columnName = filterList[i]['columnName'];
                var columnValueList = filterList[i]['columnValue'];
                var innerFound = _this.setFilterData(item, columnName, columnValueList);
                if (!innerFound) {
                    return false;
                }
            }
            return true;
        }, this);
    };
    UserComponent.prototype.isInTimerange = function (timeRange, targetDateTime) {
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
    };
    UserComponent.prototype.setFilterData = function (columnData, columnName, columnValueList) {
        var innerFound = false;
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
    };
    UserComponent.prototype.resetFilter = function () {
        this.userFilterData.map(function (item) {
            item['appliedFilterCount'] = 0;
            item['expand'] = false;
            item.enabled = false;
            item['searchText'] = '';
            if (Array.isArray(item.data)) {
                item.data.map(function (item) {
                    item.selected = false;
                });
            }
            else {
                for (var key in item.data) {
                    item.data[key]['selected'] = false;
                }
            }
        });
        this.quickFilterButtons.map(function (item) {
            item.selected = (item.title === 'All') ? true : false;
        });
        this.users = this.userListCopy;
        this.users.map(function (user) {
            user.name = user.first_name + ' ' + user.last_name;
            user.selected = false;
        });
        this.filterCount = 0;
        this.PaginationReset = true;
    };
    ;
    UserComponent.prototype.applyQuickFilter = function (btn) {
        if (btn.selected)
            return;
        var multiselect, actualData;
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
        this.quickFilterButtons.map(function (item) {
            if (btn.title != item.title) {
                item.selected = false;
            }
        });
        var filter;
        var selectedFilterItem = null;
        this.userFilterData.map(function (item) {
            if (item.columnName === btn.columnName) {
                filter = item;
                selectedFilterItem = item;
                for (var key in item.data) {
                    if (item.data[key]['name'] === btn.columnValue) {
                        item.data[key]['selected'] = true;
                    }
                    else {
                        item.data[key]['selected'] = false;
                    }
                }
            }
        });
        this.clearSelection();
        if (btn.columnValue != "*") {
            filter.enabled = true;
        }
        else {
            filter.enabled = false;
        }
        this.updateDataFilter(btn.columnValue, btn.selected, multiselect, actualData, 'user_type');
    };
    ;
    //check if the icon should be shown or not
    UserComponent.prototype.enableBulkEdit = function () {
        var flag = false;
        if (this.users) {
            var selectedUsers_1 = this.users.filter(function (item) {
                return item.selected && item.user_state !== 'INVITED';
            });
            this.bulkSelectedUsers = selectedUsers_1;
            this.userFilterData.forEach(function (filterItem) {
                if (filterItem.columnName === 'user_type' && filterItem['appliedFilterCount'] > 0 && selectedUsers_1.length > 1) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            });
            return flag;
        }
    };
    UserComponent.prototype.setBulkEditTitle = function () {
        var _this = this;
        var text = this.templateVariables.validationMessages.bulkEditDefaultText;
        this.quickFilterButtons.map(function (item) {
            if (item.selected && item.columnValue !== '*') {
                text = _this.templateVariables.validationMessages.bulkEditText;
            }
        });
        this.userFilterData.forEach(function (filterItem) {
            if (filterItem.columnName === 'user_type' && filterItem['appliedFilterCount'] > 0 && _this.bulkSelectedUsers.length > 1) {
                text = 'Edit ' + _this.bulkSelectedUsers.length + ' users';
            }
        });
        return text;
    };
    UserComponent.prototype.setBulkEditRoles = function () {
        var quickFilterApplied = this.quickFilterButtons.filter(function (item) {
            return item.selected;
        });
        if (quickFilterApplied[0].columnValue === 'Internal') {
            this.bulkEditUserType = 'internal';
            this.roles = this.roleList.filter(function (item) {
                if (item.roleType === userGlobals.internalCheckKeyword) {
                    return item;
                }
            });
        }
        else {
            this.bulkEditUserType = 'external';
            this.roles = this.roleList.filter(function (item) {
                if (item.roleType === userGlobals.externalCheckKeyword) {
                    return item;
                }
            });
        }
    };
    UserComponent.prototype.setBulkEditValidators = function () {
        var productControl = this.bulkEditForm.get('product');
        var passwordControl = this.bulkEditForm.get('password');
        var confirmPasswordControl = this.bulkEditForm.get('confirmPassword');
        var endCustomerControl = this.bulkEditForm.get('end_customer');
        this.bulkEditForm.get('role').valueChanges.subscribe(function (role) {
            if (role) {
                productControl.setValidators([forms_1.Validators.required]);
            }
            productControl.updateValueAndValidity();
        });
        this.bulkEditForm.get('password').valueChanges.subscribe(function (password) {
            if (password) {
                confirmPasswordControl.setValidators([forms_1.Validators.required]);
            }
            confirmPasswordControl.updateValueAndValidity();
        });
        if (this.bulkEditUserType === 'external') {
            this.bulkEditForm.get('product').valueChanges.subscribe(function (prod) {
                if (prod) {
                    endCustomerControl.setValidators([forms_1.Validators.required]);
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
    };
    UserComponent.prototype.saveBulkEdit = function () {
        var _this = this;
        this.submitted = true;
        var userPostData = {
            userRole: {}
        };
        var users = [];
        this.resetPassError = '';
        if (this.bulkEditForm.invalid) {
            return;
        }
        if (this.bulkEditForm.value.password.length) {
            var regex = this.regexObj.password;
            var isPasswordValid = regex.test(this.bulkEditForm.value.password);
            if (!isPasswordValid) {
                this.resetPassError = messages.passwordNotValid;
                return;
            }
            if (this.bulkEditForm.value.password !== this.bulkEditForm.value.confirmPassword) {
                this.resetPassError = messages.passwordMatchError;
                return;
            }
        }
        this.roleList.map(function (item) {
            if (item.name === _this.bulkEditForm.value.role) {
                item.featureData.map(function (featureItem) {
                    if (featureItem.mps.join('/') === _this.bulkEditForm.value.product &&
                        featureItem.features.indexOf(userGlobals.wbUserCheckKeyword) > -1) {
                        var role = _this.setTableauUserInfo(_this.bulkEditForm.value);
                        var roleType_1 = _this.setTableauUserRoleType(role);
                        _this.bulkSelectedUsers.map(function (item) {
                            if (roleType_1) {
                                var userData = {};
                                userData.userName = item.email;
                                userData.roleType = roleType_1;
                                users.push(userData);
                            }
                            ;
                        });
                        userPostData.userRole = users;
                    }
                });
            }
            var remainingWbLicenses = _this.licensesData.maxWBLicenses - _this.licensesData.workbenchLicensedUsed;
            var features = _this.getFeaturesForRole(_this.bulkEditForm.value.role, _this.bulkEditForm.value.product);
            if ((remainingWbLicenses < _this.bulkEditRoleCount.nonWbUsers) && features.featuresDis.indexOf('Workbench') > -1) {
                _this.errorMessage = messages.workbenchLicensesExceededText;
                _this.submitted = false;
                return;
            }
            var remainingCreatorLicenses = _this.licensesData.maxCreatorLicenses - _this.licensesData.creatorLicensesUsed;
            if (item.name === _this.bulkEditForm.value.role) {
                for (var i = 0; i < item.featureData.length; i++) {
                    var feature = item.featureData[i];
                    feature.mps_def = feature.mps_def ? feature.mps_def : feature.mps.join('/');
                    if (_this.bulkEditForm.value.product === feature.mps_def) {
                        if (_this.bulkSelectedUsers.length > remainingCreatorLicenses && feature.featuresDis.indexOf(userGlobals.creatorCheckKeyword) > -1) {
                            _this.errorMessage = messages.creatorLicensesExceededText;
                            _this.submitted = false;
                            return;
                        }
                    }
                }
            }
        });
        this.bulkSelectedUsers.map(function (item) {
            if (item.role !== _this.bulkEditForm.value.role) {
                var features = _this.getFeaturesForRole(item.role, item.mps_def);
                if (features.featuresDis.indexOf('Workbench') > -1) {
                    var userData = {};
                    userData.userName = item.email;
                    userData.roleType = 'Unlicensed';
                    users.push(userData);
                }
                userPostData.userRole = users;
            }
        });
        if (this.submitted) {
            var postData = {
                usrEmails: [],
                role: '',
                mps_def: '',
                user_state: '',
                password: '',
                cpassword: '',
                end_customer: ''
            };
            postData.usrEmails = this.bulkSelectedUsers.map(function (item) {
                return item.email;
            });
            postData.role = this.bulkEditForm.value.role;
            postData.mps_def = this.bulkEditForm.value.product;
            postData.end_customer = this.bulkEditUserType === 'external' ? this.bulkEditForm.value.end_customer : '';
            postData.user_state = this.bulkEditForm.value.active;
            postData.password = this.bulkEditForm.value.password;
            postData.cpassword = this.bulkEditForm.value.confirmPassword;
            this.adminService.post(postData, api.bulkEditUsers + this.adminService.getMfr()).subscribe(function (response) {
                _this.toast.show(response.Msg, { classname: global.toastTypes.green, delay: global.toastDelay });
                _this.modalService.dismissAll();
                if (users.length > 0) {
                    _this.adminService.post(userPostData, api.addTableauUser + _this.mps[0] + '/' + _this.mps[1] + '/' + _this.mps[2]).subscribe(function () {
                    });
                }
                _this.getUserList();
            });
        }
    };
    UserComponent.prototype.exportCSVFile = function () {
        var data = _.cloneDeep(this.users);
        for (var i = 0; i < data.length; i++) {
            data[i].name = data[i].first_name + data[i].last_name;
            delete data[i].first_name;
            delete data[i].last_name;
            delete data[i].selected;
            delete data[i].role;
            delete data[i].wb_user_name;
            delete data[i].report_usage;
            delete data[i].dashboard_admin;
            delete data[i].adminUser;
            delete data[i].realm_def;
            delete data[i].mps_def;
            delete data[i].token_id;
            delete data[i].org;
            delete data[i].city;
            delete data[i].state;
            delete data[i].country;
            delete data[i].department;
            delete data[i].phone;
            data[i].status = data[i].user_state;
            data[i].userType = data[i].is_external ? "External" : "Internal";
            delete data[i].is_external;
            delete data[i].user_state;
            //delete data[i].active;
        }
        this.csvData = data;
        this.adminService.downloadCSVFile(data, userGlobals.reportTitle);
    };
    UserComponent.prototype.setCurrentUser = function (user) {
        this.currentUser = user;
    };
    UserComponent.prototype.setEndCustomerValidator = function () {
        var endCustomerControl = this.userForm.get('end_customer');
        if (this.userForm.value.is_external) {
            endCustomerControl.setValidators([forms_1.Validators.required]);
            endCustomerControl.updateValueAndValidity();
        }
    };
    UserComponent.prototype.enableTootip = function (e, text, type) {
        if (e.target.offsetWidth < e.target.scrollWidth) {
            e.target.title = text;
            if (type === 'name') {
                e.target.title = text.first_name + ' ' + text.last_name;
            }
            if (type === 'date') {
                e.target.title = moment(text).format('ddd MMM DD YYYY hh:mm:ss');
            }
        }
    };
    UserComponent.prototype.setPhoneNumberValidator = function () {
        var phoneNumberControl = this.userForm.get('phone');
        var countryCodeControl = this.userForm.get('countryCode');
        phoneNumberControl.setValidators([forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(20), forms_1.Validators.pattern(this.regexObj.phone)]);
        phoneNumberControl.updateValueAndValidity();
        countryCodeControl.setValidators([forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(6), forms_1.Validators.pattern(this.regexObj.phone)]);
        countryCodeControl.updateValueAndValidity();
        if (this.userForm.value.countryCode.length > 0) {
            phoneNumberControl.setValidators([forms_1.Validators.required, forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(20), forms_1.Validators.pattern(this.regexObj.phone)]);
            phoneNumberControl.updateValueAndValidity();
        }
        if (this.userForm.value.phone.length > 0) {
            countryCodeControl.setValidators([forms_1.Validators.minLength(this.minCharacters), forms_1.Validators.maxLength(6), forms_1.Validators.required, forms_1.Validators.pattern(this.regexObj.phone)]);
            countryCodeControl.updateValueAndValidity();
        }
    };
    __decorate([
        core_1.ViewChildren(sortable_directive_1.SortableDirective)
    ], UserComponent.prototype, "headers");
    UserComponent = __decorate([
        core_1.Component({
            selector: 'app-user',
            templateUrl: './user.component.html',
            styleUrls: ['./user.component.scss']
        })
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
