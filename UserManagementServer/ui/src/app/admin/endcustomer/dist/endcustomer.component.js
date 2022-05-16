"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.EndcustomerComponent = exports.compare = void 0;
var core_1 = require("@angular/core");
var sortable_directive_1 = require("../../shared/directives/sortable.directive");
var global_1 = require("../endcustomer/global");
var forms_1 = require("@angular/forms");
var confirmation_popup_component_1 = require("../../shared/confirmation-popup/confirmation-popup.component");
var global_2 = require("../../shared/global");
var message_popup_component_1 = require("../../shared/message-popup/message-popup.component");
var api = require("../../shared/resource");
var moment = require("moment");
var messages = require("../../shared/message");
var _ = require("lodash");
exports.compare = function (v1, v2) { return v1 < v2 ? -1 : v1 > v2 ? 1 : 0; };
var EndcustomerComponent = /** @class */ (function () {
    function EndcustomerComponent(adminService, modalService, formBuilder, toast, cd, UserTrackingService, router) {
        this.adminService = adminService;
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.toast = toast;
        this.cd = cd;
        this.UserTrackingService = UserTrackingService;
        this.router = router;
        //variables  needs to be moved to global
        this.endCustomerList = [];
        this.page = global_2.page;
        this.pageSize = global_2.pageSize;
        this.collectionSize = 0;
        this.size = 0;
        this.submitted = false;
        this.showSysIdDiv = false;
        this.groupedData = {};
        this.smsize = global_2.smsize;
        this.selectedSysIds = [];
        this.sysIdList = [];
        this.editEndUserMode = false;
        this.sysIdsToRemove = [];
        this.sysidLoading = false;
        this.endCustomerNameMap = [];
        this.largeModalOptions = global_1.globalObj.modalOptions;
        this.confirmModalOptions = global_1.globalObj.confirmModalOptions;
        this.globalObj = global_1.globalObj;
        this.pageValue = global_2.pageValue;
        this.showFilter = false;
        this.endCustomerFilterData = [];
        this.endCustomerFilterArray = global_1.endCustomerFilterArray;
        this.searchText = '';
        this.filterEnabled = false;
        this.filterCount = 0;
        this.noEndCustomerFound = messages.noEndCustomerFound;
        this.selectedCount = 0;
        this.showSelectNotification = false;
        this.allSelectedFlag = false;
        this.mps = [undefined, undefined, undefined];
        this.initialEmpty = false;
        this.sysPageSize = 200;
        this.pagination = {
            pageSiz: this.sysPageSize,
            startIndex: 0,
            endIndex: this.sysPageSize - 1,
            noOfPages: 0,
            currentPage: 1
        };
        //syssearchtext:string = '';
        this.paginationText = '';
        this.totalSysids = 0;
        this.showSearchBox = false;
        this.shouldCallLoadPages = true;
        this.fieldLength = global_1.fieldLength;
        this.addEndcustomerNameError = global_1.addEndcustomerNameError;
        this.defaultSort = global_1.defaultSort;
        this.tempAddSysIdList = [];
        this.tempRemoveSysIdList = [];
        this.selectedView = 'device';
        this.groupDataList = [];
        this.selectedGroups = [];
        this.tempAddGroupList = [];
        this.tempRemoveGroupList = [];
        this.attributeList = [];
        this.showDivSearch = false;
        this.lastSelectedRow = {
            rowIndex: 0
        };
        this.groupListToRemove = [];
        this.productTooltip = "Choose A Product";
        this.searchsysIdAttributes = global_1.searchIdAttributes;
        this.searchgroupAttributes = global_1.groupSearchAttributes;
        this.sysIdAttributeList = global_1.sysIdAttributes;
        this.groupAttributeList = global_1.groupAttributes;
        this.noDataFound = global_1.noDataFound;
        this.endCustomerListTableLabel = global_1.endCustomerListTableLabel;
        this.groupSysIdMap = {};
        //sysid searchtext clear
        this.clearSearchText = function () {
            this.showDivSearch = false;
            this.sysidLoading = true;
            this.clearsysSearchText();
            this.resetPagination();
            this.shouldCallLoadPages = true;
            this.attributeList.map(function (item) {
                item.selected = false;
            });
            var prodname = this.editEndUserMode ? this.addEditEndCustForm.controls.prodName.value : this.addEditEndCustForm.value.prodName;
            if (this.selectedSysIds.length) {
                var selectedSysIds = this.selectedSysIds.map(function (item) {
                    return item.sysId;
                });
            }
            this.getSysId(prodname, selectedSysIds);
        };
        try {
            this.mps = this.adminService.getMPS().split(/:|\//);
        }
        catch (e) { }
    }
    //call when the component loads everytime and after every crud action
    EndcustomerComponent.prototype.ngOnInit = function () {
        this.showFilter = false;
        this.getCustList();
        this.fetchNameMap();
        this.resetFormData();
    };
    //fetch end customer listendCustomerListCopy
    EndcustomerComponent.prototype.getCustList = function () {
        var _this = this;
        if (this.adminService.userList === undefined) {
            this.router.navigate(['/users']);
            return;
        }
        this.loading = true;
        this.endCustomerProductList = this.processProductList();
        this.adminService.getendCustomerList().subscribe(function (data) {
            _this.groupedData = _this.adminService.groupedDataEndCustomer || [];
            _this.endCustomerList = data.Data;
            if (data.Data.length === 0) {
                _this.initialEmpty = true;
                _this.loading = false;
            }
            else {
                _this.initialEmpty = false;
                _this.endCustomerList = data.Data;
                _this.endCustomerList.map(function (endCust, index) {
                    // NOTE: Mock data - remove this when API is ready
                    if (endCust.group_name) {
                        endCust.group_name = endCust.group_name.length ? endCust.group_name : [];
                    }
                    _this.groupSysIdMap[endCust.endcustomer_name] = endCust.serial_number;
                    var product = endCust.mfr + "/" + endCust.prod + "/" + endCust.sch;
                    endCust.product = _this.getKeyByValue(_this.endCustomerProductList, product);
                });
                _this.endCustomerListCopy = _.cloneDeep(_this.endCustomerList);
                _this.collectionSize = _this.endCustomerList.length;
                _this.size = 0;
                _this.onSort(global_1.defaultSort);
                _this.resetFilter();
                _this.populateFilterData();
                _this.loading = false;
            }
        });
    };
    EndcustomerComponent.prototype.getKeyByValue = function (object, value) {
        return Object.keys(object).find(function (key) { return object[key] === value; });
    };
    EndcustomerComponent.prototype.processProductList = function () {
        var tempobj = {};
        this.adminService.adminRole.featureData.map(function (item) {
            tempobj[item.name] = item.mps.toString().replace(/,/g, '/');
        });
        return tempobj;
    };
    EndcustomerComponent.prototype.fetchGroupData = function () {
        this.groupedData = this.adminService.groupedDataEndCustomer || [];
    };
    EndcustomerComponent.prototype.fetchNameMap = function () {
        this.endCustomerNameMap = this.adminService.getEndCustomerNameMap();
    };
    //filter logic
    EndcustomerComponent.prototype.populateFilterData = function () {
        this.endCustomerFilterData = [];
        for (var i = 0; i < global_1.endCustomerFilterArray.length; i++) {
            global_1.endCustomerFilterArray[i].data = [];
        }
        this.endCustomerFilterData = this.adminService.getFilterObj(this.endCustomerList, global_1.endCustomerFilterArray);
    };
    EndcustomerComponent.prototype.enableTootip = function (e, text) {
        if (e.target.offsetWidth < e.target.scrollWidth) {
            e.target.title = text;
        }
    };
    EndcustomerComponent.prototype.getEndcustomerListFiltered = function () {
        var _this = this;
        var tempEndCustomerList = this.endCustomerList;
        //this.searchText = this.searchText.toLowerCase();
        if (this.searchText.length === 0) {
            return this.endCustomerList;
        }
        if (this.searchText.length >= 3) {
            tempEndCustomerList = tempEndCustomerList.filter(function (item, i) {
                return item.endcustomer_name.toLowerCase().includes(_this.searchText.toLowerCase()) ||
                    item.created_by.toLowerCase().includes(_this.searchText.toLowerCase()) ||
                    _this.matchSerialNum(item.serial_number, _this.searchText.toLowerCase());
            });
        }
        return tempEndCustomerList;
    };
    EndcustomerComponent.prototype.matchSerialNum = function (strArray, str) {
        for (var j = 0; j < strArray.length; j++) {
            if (strArray[j].toLowerCase().includes(str.toLowerCase())) {
                return true;
            }
        }
        return false;
    };
    EndcustomerComponent.prototype.getFilterData = function (filter) {
        var tmpFilterList = _.cloneDeep(filter.data);
        if (filter.searchText.length < 3) {
            return [];
        }
        if (filter.searchText.length >= 3) {
            tmpFilterList = filter.data.filter(function (item) {
                return item.name.toLowerCase().includes(filter.searchText.toLowerCase());
            });
        }
        return tmpFilterList;
    };
    //select all check
    EndcustomerComponent.prototype.allEndCustSelected = function () {
        for (var i = 0; i < this.getCollectionLength(); i++) {
            if (!this.getEndcustomerListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
                this.updateSelectAllValue();
                this.isSelectAll = false;
                return false;
            }
        }
        this.updateSelectAllValue();
        this.isSelectAll = true;
        this.getActionButtonDisable(global_1.globalObj.delMultipleButton);
        return true;
    };
    //togglecheckbox selection
    EndcustomerComponent.prototype.endCustToggleSelect = function () {
        this.selectedCount = 0;
        this.isSelectAll = !this.isSelectAll;
        for (var i = 0; i < this.getCollectionLength(); i++) {
            this.getEndcustomerListFiltered()[i + ((this.page - 1) * this.pageSize)].selected = this.isSelectAll;
            if (this.getEndcustomerListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
                this.selectedCount++;
            }
        }
        this.updateSelectAllValue();
    };
    EndcustomerComponent.prototype.selectAcrossPages = function () {
        //Select all roles regardless of pagination
        this.allSelectedFlag = true;
        for (var i = 0; i < this.getEndcustomerListFiltered().length; i++) {
            this.getEndcustomerListFiltered()[i].selected = true;
        }
        this.updateSelectAllValue();
    };
    EndcustomerComponent.prototype.clearSelection = function () {
        //Unselect all roles regardless of pagination
        this.selectedCount = 0;
        this.isSelectAll = false;
        for (var i = 0; i < this.endCustomerList.length; i++) {
            this.endCustomerList[i].selected = false;
        }
    };
    EndcustomerComponent.prototype.getSelectedCount = function () {
        var count = 0;
        for (var i = 0; i < this.getEndcustomerListFiltered().length; i++) {
            if (this.getEndcustomerListFiltered()[i].selected) {
                count++;
            }
        }
        return count;
    };
    EndcustomerComponent.prototype.updateSelectAllValue = function () {
        this.selectedCount = this.getSelectedCount();
        this.allSelectedFlag = this.getSelectedCount() == this.getEndcustomerListFiltered().length ? true : false;
    };
    //check and disable button based on condition
    EndcustomerComponent.prototype.getActionButtonDisable = function (typ) {
        var self = this;
        if (typ === global_1.globalObj[typ]) {
            var flag = true;
            for (var i = 0; i < this.getCollectionLength(); i++) {
                if (this.getEndcustomerListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
                    flag = false;
                }
            }
            return flag;
        }
    };
    //This will return the length of data on the page for current pagination
    EndcustomerComponent.prototype.getCollectionLength = function () {
        var collectionLength = this.getEndcustomerListFiltered().slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
        return collectionLength.length;
    };
    //open modal based on type
    //The modal open's add or edit  screen based on the input 
    EndcustomerComponent.prototype.openModal = function (content, type, endCust) {
        this.resetPagination();
        this.selectedView = 'device';
        this.editEndUserMode = false;
        var self = this;
        this.attributeList.map(function (attr) {
            attr.selected = false;
        });
        //Add End Customer code
        if (type === global_1.globalObj.addEndCustomerType) {
            this.endCustomerProductList = this.processProductList();
            self.showSysIdDiv = false;
            this.shouldCallLoadPages = true;
            this.modalHeader = global_1.globalObj.addEndCustomerMsg;
            this.resetData();
            this.selectedSearchAttrList = [];
            this.showDivSearch = false;
            this.addEditEndCustForm = this.formBuilder.group({
                endCustomerName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(this.fieldLength.max), forms_1.Validators.minLength(this.fieldLength.min)]],
                prodName: ['', forms_1.Validators.required],
                // availableSelectedSysIdname: [[]],
                // SelectedSysIdname: [[], Validators.required],
                syssearchtext: this.formBuilder.group({
                    sysId: '',
                    systemName: '',
                    hospName: '',
                    compName: '',
                    city: '',
                    country: ''
                }),
                groupNameSearch: '',
                groupSysIdSearch: ''
            });
        }
        //Edit End Customer code
        else if (type === global_1.globalObj.editEndCustomerType) {
            this.endCustomerProductList = this.processProductList();
            this.sysidLoading = true;
            this.editEndUserMode = true;
            this.shouldCallLoadPages = true;
            var endCustomerProdName = endCust.mfr + "/" + endCust.prod + "/" + endCust.sch;
            this.getSysId(endCustomerProdName, endCust.serial_number);
            this.getGroupList(endCustomerProdName, endCust);
            this.modalHeader = global_1.globalObj.editEndCustomerMsg;
            this.addEditEndCustForm.patchValue({
                endCustomerName: endCust.endcustomer_name,
                prodName: endCustomerProdName,
                syssearchtext: this.formBuilder.group({
                    sysId: '',
                    systemName: '',
                    hospName: '',
                    compName: '',
                    city: '',
                    country: ''
                }),
                groupNameSearch: '',
                groupSysIdSearch: ''
            });
            this.addEditEndCustForm.controls['endCustomerName'].disable();
            this.addEditEndCustForm.controls['prodName'].disable();
            self.showSysIdDiv = true;
            this.sysidLoading = false;
        }
        this.modalService.open(content, this.largeModalOptions).result.then(function (result) {
        }, function (reason) {
        });
    };
    EndcustomerComponent.prototype.getSysId = function (prodname, selectedSysIds) {
        var _this = this;
        this.adminService.getSysList(prodname, this.pagination.startIndex, this.pagination.endIndex, this.addEditEndCustForm.value.syssearchtext).subscribe(function (data) {
            _this.totalSysids = _this.adminService.totalsysid;
            _this.dataSet = _this.totalSysids;
            _this.selectedSysIds = [];
            if (selectedSysIds.length) {
                data.map(function (obj, index) {
                    obj.disabled = selectedSysIds.indexOf(obj.sysId) > -1 ? true : false;
                    if (selectedSysIds.indexOf(obj.sysId) > -1) {
                        var selectedObj = {};
                        selectedObj.sysId = obj.sysId;
                        selectedObj.disabled = false;
                        selectedObj.rowIndex = index;
                        selectedObj.systemName = obj.systemName;
                        selectedObj.hospName = obj.hospName;
                        selectedObj.compName = obj.compName;
                        selectedObj.city = obj.city;
                        selectedObj.country = obj.country;
                        selectedObj.selected = false;
                        _this.selectedSysIds.push(selectedObj);
                    }
                });
            }
            _this.sysIdList = _.sortBy(data, function (o) { return o.disabled; });
            _this.sysIdList.map(function (sysId, index) {
                sysId.rowIndex = index;
            });
            if (_this.shouldCallLoadPages) {
                _this.getPages(prodname);
                _this.shouldCallLoadPages = false;
            }
            // this.showSearchBox = this.sysIdList.length > 0  ? true : false;
            var endIndex = _this.totalSysids <= _this.pagination.endIndex ? _this.totalSysids : _this.pagination.endIndex + 1;
            _this.paginationText = 'Showing ' + (_this.pagination.startIndex + 1) + ' to ' + endIndex + ' of ' + _this.totalSysids;
            _this.sysidLoading = false;
        });
    };
    EndcustomerComponent.prototype.callsysid = function () {
        this.sysidLoading = true;
        this.shouldCallLoadPages = true;
        this.pagination.startIndex = 0;
        this.pagination.endIndex = 200;
        var prodname = this.editEndUserMode ? this.addEditEndCustForm.controls.prodName.value : this.addEditEndCustForm.value.prodName;
        this.getSysId(prodname, '');
    };
    //when product is changed/chosen call the SYSiD LIST API
    EndcustomerComponent.prototype.onProdChange = function () {
        var _this = this;
        this.sysidLoading = true;
        this.showSysIdDiv = true;
        //getsysid
        this.getSysId(this.addEditEndCustForm.value.prodName, '');
        this.getGroupList(this.addEditEndCustForm.value.prodName, '');
        this.setSearchAttributeList();
        this.productTooltip = Object.keys(this.endCustomerProductList).find(function (key) { return _this.endCustomerProductList[key] === _this.addEditEndCustForm.value.prodName; });
    };
    EndcustomerComponent.prototype.getGroupList = function (prod, groupList) {
        var _this = this;
        this.groupDataList = this.groupedData[prod] ? this.groupedData[prod] : [];
        this.selectedGroups = [];
        if (groupList) {
            this.groupDataList.map(function (obj, index) {
                obj.disabled = groupList.group_name.indexOf(obj.endcustomer_name) > -1 || obj.endcustomer_name === groupList.endcustomer_name ? true : false;
                obj.rowIndex = index;
                if (groupList.group_name.indexOf(obj.endcustomer_name) > -1) {
                    var groupObj = {};
                    groupObj.endcustomer_name = obj.endcustomer_name;
                    groupObj.checked = false;
                    groupObj.selected = false;
                    groupObj.serial_number = obj.serial_number;
                    _this.selectedGroups.push(groupObj);
                }
            });
        }
        else {
            this.groupDataList.map(function (groupItem, index) {
                groupItem.rowIndex = index;
                groupItem.disabled = false;
                if (groupList && groupItem.endcustomer_name === groupList.group_name.endcustomer_name) {
                    groupItem.disabled = true;
                }
            });
        }
        this.groupDataList = _.sortBy(this.groupDataList, function (o) { return o.disabled; });
    };
    //Add SysId Method
    EndcustomerComponent.prototype.addSysIds = function () {
        var _this = this;
        if (this.selectedView === 'device') {
            this.selectedSysIds = this.selectedSysIds.concat(this.tempAddSysIdList);
            this.sysIdList = _.sortBy(this.sysIdList, function (o) { return o.selected; });
            this.sysIdList.map(function (sysIdItem, index) {
                sysIdItem.rowIndex = index;
                _this.selectedSysIds.map(function (item, selectedSysidIndex) {
                    if (sysIdItem.sysId === item.sysId) {
                        item.rowIndex = selectedSysidIndex;
                        sysIdItem.selected = false;
                        sysIdItem.disabled = true;
                    }
                });
            });
            this.selectedSysIds = _.cloneDeep(this.selectedSysIds);
            this.tempAddSysIdList = [];
        }
        else {
            this.selectedGroups = this.selectedGroups.concat(this.tempAddGroupList);
            this.groupDataList = _.sortBy(this.groupDataList, function (o) { return o.selected; });
            this.groupDataList.map(function (groupItem, index) {
                groupItem.rowIndex = index;
                _this.selectedGroups.map(function (item, selectedGroupIndex) {
                    if (groupItem.endcustomer_name === item.endcustomer_name) {
                        item.rowIndex = selectedGroupIndex;
                        groupItem.selected = false;
                        groupItem.disabled = true;
                    }
                });
            });
            this.selectedGroups = _.cloneDeep(this.selectedGroups);
            this.tempAddGroupList = [];
        }
    };
    EndcustomerComponent.prototype.resetScrollTop = function (el) {
        setTimeout(function () {
            var selector = document.getElementById(el);
            selector.scrollTop = 0;
        });
    };
    //Remove SysId Method
    EndcustomerComponent.prototype.removeSysIds = function () {
        var _this = this;
        if (this.selectedView === 'device') {
            this.sysIdsToRemove = [];
            this.sysIdsToRemove = this.sysIdsToRemove.concat(this.tempRemoveSysIdList);
            this.sysIdsToRemove.forEach(function (item) {
                _this.sysIdList.forEach(function (sys, index) {
                    sys.rowIndex = index;
                    if (sys.sysId === item.sysId) {
                        sys.selected = false;
                        sys.disabled = false;
                    }
                });
            }, this);
            this.sysIdsToRemove.map(function (item) {
                _this.removeItemFromList(_this.selectedSysIds, item);
            });
            this.tempRemoveSysIdList = [];
        }
        else {
            this.groupListToRemove = [];
            this.groupListToRemove = this.groupListToRemove.concat(this.tempRemoveGroupList);
            this.groupListToRemove.forEach(function (item) {
                _this.groupDataList.forEach(function (group, index) {
                    group.rowIndex = index;
                    if (group.endcustomer_name === item.endcustomer_name) {
                        group.selected = false;
                        group.disabled = false;
                    }
                });
            }, this);
            this.groupListToRemove.map(function (item) {
                _this.removeItemFromList(_this.selectedGroups, item);
            });
            this.tempRemoveGroupList = [];
        }
    };
    EndcustomerComponent.prototype.removeItemFromList = function (list, itemToRemove) {
        var _this = this;
        list.forEach(function (item, index) {
            if (_this.selectedView === 'device') {
                if (item.sysId === itemToRemove.sysId) {
                    list.splice(index, 1);
                }
            }
            else {
                if (item.endcustomer_name === itemToRemove.endcustomer_name) {
                    list.splice(index, 1);
                }
            }
        }, this);
        list.map(function (listItem, index) {
            listItem.rowIndex = index;
        });
        if (this.selectedView === 'device') {
            this.selectedSysIds = list;
        }
        else {
            this.selectedGroups = list;
        }
    };
    //state of add remove button
    EndcustomerComponent.prototype.addRmoveBtnState = function (state) {
        if (this.selectedView === 'device') {
            if (state === 'add') {
                this.tempAddSysIdList = this.sysIdList.filter(function (item) {
                    return item.selected;
                });
            }
            else {
                this.tempRemoveSysIdList = this.selectedSysIds.filter(function (item) {
                    return item.selected;
                });
            }
        }
        else {
            if (state === 'add') {
                this.tempAddGroupList = this.groupDataList.filter(function (item) {
                    return item.selected;
                });
            }
            else {
                this.tempRemoveGroupList = this.selectedGroups.filter(function (item) {
                    return item.selected;
                });
            }
        }
    };
    EndcustomerComponent.prototype.clearsysSearchText = function () {
        this.addEditEndCustForm.patchValue({
            syssearchtext: {
                sysId: '',
                systemName: '',
                compName: '',
                city: '',
                country: '',
                hospName: ''
            }
        });
    };
    EndcustomerComponent.prototype.getPageStart = function (pageSiz, pageNo) {
        return pageSiz * pageNo;
    };
    ;
    EndcustomerComponent.prototype.getPageLabel = function (total, pageSiz, pageNo) {
        var start = Math.max(this.getPageStart(pageSiz, pageNo), 0);
        var end = Math.min(this.getPageStart(pageSiz, pageNo + 1), total);
        var obj = {};
        obj.startIndex = start;
        obj.endIndex = (end === this.totalSysids) ? this.totalSysids : end - 1;
        return obj;
    };
    EndcustomerComponent.prototype.loadNextSet = function () {
        this.sysidLoading = true;
        this.pagination.currentPage = this.pagination.currentPage + 1;
        var page = this.pages[this.pagination.currentPage - 1];
        this.pagination.startIndex = page.startIndex;
        this.pagination.endIndex = page.endIndex;
        var prodname = this.editEndUserMode ? this.addEditEndCustForm.controls.prodName.value : this.addEditEndCustForm.value.prodName;
        this.getSysId(prodname, '');
    };
    EndcustomerComponent.prototype.loadPrevSet = function () {
        this.sysidLoading = true;
        this.pagination.currentPage = this.pagination.currentPage - 1;
        var page = this.pages[this.pagination.currentPage - 1];
        this.pagination.startIndex = page.startIndex;
        this.pagination.endIndex = page.endIndex;
        var prodname = this.editEndUserMode ? this.addEditEndCustForm.controls.prodName.value : this.addEditEndCustForm.value.prodName;
        this.getSysId(prodname, '');
    };
    EndcustomerComponent.prototype.getPages = function (prodName) {
        this.resetPagination();
        var dataSet = this.selectedView === 'device' ? this.totalSysids : this.groupDataList.length;
        this.pagination.noOfPages = Math.ceil(dataSet / this.pagination.pageSiz);
        this.pages = Array.from({ length: this.pagination.noOfPages }, function (_, i) {
            return this.getPageLabel(dataSet, this.pagination.pageSiz, i);
        }, this);
    };
    EndcustomerComponent.prototype.resetPagination = function () {
        this.pagination = {
            pageSiz: 200,
            startIndex: 0,
            endIndex: this.pagination.pageSiz - 1,
            noOfPages: 0,
            currentPage: 1
        };
    };
    //delete End Customer method
    EndcustomerComponent.prototype.openConfirmation = function (type, data) {
        var _this = this;
        var delModal = this.modalService.open(confirmation_popup_component_1.ConfirmationPopupComponent, this.confirmModalOptions);
        //single delete
        if (type === global_1.globalObj.deleteSingle) {
            //case2-End customer delete – with user association
            if (this.adminService.associatedEndCustomerList.indexOf(data.endcustomer_name.toLowerCase()) >= 0) {
                this.modalService.dismissAll();
                var delErrorModal = this.modalService.open(message_popup_component_1.MessagePopupComponent, { backdrop: 'static' });
                delErrorModal.componentInstance.msg = "<strong>" + data.endcustomer_name + "</strong> " + messages.endWithAssoc + " <strong>" + data.endcustomer_name + "</strong>" + '.';
                delErrorModal.result.then(function (result) {
                    if (result === "okclick") {
                        _this.modalService.dismissAll();
                    }
                });
                return;
            }
            //case1- End customer delete – No user association
            else {
                delModal.componentInstance.msg = messages.endNoAssoc + ' ' + "<strong>" + data.endcustomer_name + "</strong>" + ' ?';
            }
        }
        //Multiple delete
        if (type === global_1.globalObj.deleteMultiple) {
            var associatedArr = [];
            var usersToDel = [];
            var count = 0;
            for (var i = 0; i < this.endCustomerList.length; i++) {
                if (this.endCustomerList[i].selected) {
                    if (this.adminService.associatedEndCustomerList.indexOf(this.endCustomerList[i].endcustomer_name.toLowerCase()) >= 0) {
                        associatedArr.push(this.endCustomerList[i].endcustomer_name);
                    }
                    else {
                        usersToDel.push(this.endCustomerList[i].endcustomer_name);
                    }
                }
            }
            //case1-Single end customer delete – No user association
            if (usersToDel.length == 1 && !associatedArr.length) {
                delModal.componentInstance.msg = messages.noassociation;
            }
            //case2-Single end customer delete – with user association
            if (!usersToDel.length && associatedArr.length == 1) {
                var delErrorModal = this.modalService.open(message_popup_component_1.MessagePopupComponent, { backdrop: 'static' });
                delErrorModal.componentInstance.msg = messages.associationErroSingle;
                delErrorModal.result.then(function (result) {
                    if (result === "okclick") {
                        _this.modalService.dismissAll();
                    }
                });
                return;
            }
            //case3-Multiple end customers delete – One or more end customers having user association
            if (usersToDel.length >= 1 && associatedArr.length >= 1) {
                delModal.componentInstance.msg = messages.multiAssociationErr;
                delModal.componentInstance.listToDisplay = usersToDel;
            }
            //case4-Multiple end customers delete – No end  customer having user association
            if (usersToDel.length > 1 && !associatedArr.length) {
                delModal.componentInstance.msg = messages.nomultiassoc;
            }
            //case5-Multiple end customers delete – All end customers having user association
            else if (!usersToDel.length && associatedArr.length > 1) {
                var delErrorModal = this.modalService.open(message_popup_component_1.MessagePopupComponent, { backdrop: 'static' });
                delErrorModal.componentInstance.msg = messages.alluserAssociation;
                delErrorModal.result.then(function (result) {
                    if (result === "okclick") {
                        _this.modalService.dismissAll();
                    }
                });
                return;
            }
        }
        //yesclick
        delModal.result.then(function (result) {
            var postData = {};
            if (result === global_1.globalObj.yesClick) {
                if (type === global_1.globalObj.deleteMultiple) {
                    var endcustomer_name_1 = [];
                    _this.endCustomerList.map(function (obj) {
                        if (obj.selected) {
                            endcustomer_name_1.push(obj.endcustomer_name);
                        }
                    });
                    postData.endcustomer_name = endcustomer_name_1;
                    postData.mps = _this.adminService.getMPS();
                }
                else if (type === global_1.globalObj.deleteSingle) {
                    postData.endcustomer_name = [data.endcustomer_name];
                    postData.mps = _this.adminService.getMPS();
                }
                _this.loading = true;
                _this.deleteEndCustomer(postData);
            }
            else {
                _this.modalService.dismissAll();
                return;
            }
        });
    };
    //Add-Edit  End customer
    EndcustomerComponent.prototype.addEndCustSubmit = function () {
        var _this = this;
        if (!this.editEndUserMode && this.selectedSysIds.length > 0) {
            this.addEditEndCustForm.patchValue({
                SelectedSysIdname: _.map(this.selectedSysIds, 'name').toString()
            });
        }
        if (this.editEndUserMode && this.selectedSysIds.length > 0) {
            this.addEditEndCustForm.patchValue({
                SelectedSysIdname: _.map(this.selectedSysIds, 'name').toString()
            });
        }
        if (this.addEditEndCustForm.controls['endCustomerName'].value.trim().replace(/\s+/g, " ").replace(/\s/g, '').length == 0) {
            this.addEditEndCustForm.controls['endCustomerName'].setErrors({ 'pattern': true });
        }
        this.submitted = true;
        if (this.addEditEndCustForm.invalid) {
            return;
        }
        //Duplicate name error
        if (!this.editEndUserMode) {
            if (this.adminService.getEndCustomerNameMap().indexOf(this.addEditEndCustForm.controls.endCustomerName.value.toLowerCase()) !== -1) {
                this.addEditEndCustForm.controls['endCustomerName'].setErrors({ 'duplicate': true });
                return;
            }
        }
        this.loading = true;
        this.modalService.dismissAll();
        var postData = {};
        var mps = this.addEditEndCustForm.value.prodName ? this.addEditEndCustForm.value.prodName : this.addEditEndCustForm.getRawValue().prodName;
        mps = mps.split('/');
        postData.created_by = this.adminService.getLoggedEmail();
        postData.endcustomer_name = this.addEditEndCustForm.controls.endCustomerName.value.trim().replace(/\s+/g, " ");
        postData.serial_number = _.map(this.selectedSysIds, 'sysId').toString();
        postData.group_name = _.map(this.selectedGroups, 'endcustomer_name').toString();
        postData.updated_on = '';
        //Call edit api
        if (this.editEndUserMode) {
            this.adminService.post(postData, api.editEndCustomer + mps[0] + '/' + mps[1] + '/' + mps[2]).subscribe(function (response) {
                _this.toast.show(response.Msg, { classname: global_1.globalObj.successClass, delay: global_1.globalObj.delay });
                _this.UserTrackingService.userTracking("Admin Panel : End Customer", "Edit End Customer", postData.endcustomer_name + " Edited : ");
                _this.shouldCallLoadPages = true;
                _this.resetPagination();
                _this.ngOnInit();
            });
        }
        //call add api
        else {
            this.adminService.post(postData, api.addEndCustomer + mps[0] + '/' + mps[1] + '/' + mps[2]).subscribe(function (response) {
                _this.toast.show(response.Msg, { classname: global_1.globalObj.successClass, delay: global_1.globalObj.delay });
                _this.UserTrackingService.userTracking("Admin Panel : End Customer", "Add End Customer", postData.endcustomer_name + " Added : ");
                _this.shouldCallLoadPages = true;
                _this.resetPagination();
                _this.ngOnInit();
            });
        }
    };
    //Delete  End Customer
    EndcustomerComponent.prototype.deleteEndCustomer = function (params) {
        var _this = this;
        var associatedarr = [];
        params.endcustomer_name.map(function (item) {
            if (_this.adminService.associatedEndCustomerList.includes(params.endcustomer_name[0])) {
                associatedarr.push(item);
            }
        });
        this.adminService.post(params, api.deleteEndCustomer + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe(function (response) {
            _this.toast.show(messages.endcustomerdeletesuccess, { classname: global_1.globalObj.successClass, delay: global_1.globalObj.delay });
            _this.UserTrackingService.userTracking("Admin Panel : End Customer", "Delete End Customer", JSON.stringify(params) + ": Endcustomer/s Deleted");
            _this.loading = false;
            _this.ngOnInit();
        });
    };
    //method to reset the form data
    EndcustomerComponent.prototype.resetFormData = function () {
        this.selectedSysIds = [];
        this.submitted = false;
        this.addEditEndCustForm = this.formBuilder.group({
            endCustomerName: ['', forms_1.Validators.required],
            prodName: ['', forms_1.Validators.required],
            // availableSelectedSysIdname: [[]],
            // SelectedSysIdname: [[], Validators.required],
            syssearchtext: this.formBuilder.group({
                sysId: '',
                systemName: '',
                hospName: '',
                compName: '',
                city: '',
                country: ''
            }),
            groupNameSearch: '',
            groupSysIdSearch: ''
        });
        this.isSelectAll = false;
        this.productTooltip = "Choose A Product";
    };
    EndcustomerComponent.prototype.getSelectedValues = function (list) {
        //.log(list);
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
    EndcustomerComponent.prototype.updateDataFilter = function (columnValue, selected, multiselect, actualData) {
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
        this.endCustomerFilterData.map(function (item) {
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
            var filteredData = _this.applyFilter(_this.endCustomerListCopy, filterList);
            _this.endCustomerList = filteredData;
        });
    };
    EndcustomerComponent.prototype.applyFilter = function (list, filterList) {
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
    EndcustomerComponent.prototype.isInTimerange = function (timeRange, targetDateTime) {
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
    EndcustomerComponent.prototype.setFilterData = function (columnData, columnName, columnValueList) {
        var innerFound = false;
        switch (columnName) {
            case 'updated_on':
                if (columnValueList && columnValueList[0]) {
                    var targetDateTime = columnValueList[0];
                    if (this.isInTimerange(targetDateTime, columnData[columnName])) {
                        return innerFound = true;
                    }
                }
                break;
            case 'serial_number':
                for (var j = 0; j < columnValueList.length; j++) {
                    if (columnData.serial_number && columnData.serial_number.indexOf(columnValueList[j]) > -1) {
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
    EndcustomerComponent.prototype.resetFilter = function () {
        this.endCustomerFilterData.map(function (item) {
            item['appliedFilterCount'] = 0;
            item['expand'] = false;
            item['enabled'] = false;
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
        this.endCustomerList = this.endCustomerListCopy;
        this.filterCount = 0;
    };
    ;
    //export csv
    EndcustomerComponent.prototype.exportCSVFile = function () {
        this.loading = true;
        var data = _.cloneDeep(this.endCustomerList);
        for (var i = 0; i < data.length; i++) {
            data[i].name = data[i].endcustomer_name;
            data[i].modified_on = data[i].updated_on;
            delete data[i].mfr;
            delete data[i].prod;
            delete data[i].sch;
            delete data[i].serial_number;
            delete data[i].updated_on;
            delete data[i].selected;
        }
        this.csvData = data;
        this.adminService.downloadCSVFile(data, global_1.globalObj.reportTitle);
        this.loading = false;
    };
    // Swtich view device or group
    EndcustomerComponent.prototype.switchView = function (view, type) {
        var dataSet = view === 'device' ? this.totalSysids : this.groupDataList.length;
        var endIndex = dataSet <= this.pagination.endIndex ? dataSet : this.pagination.endIndex + 1;
        this.dataSet = dataSet;
        this.paginationText = 'Showing ' + (this.pagination.startIndex + 1) + ' to ' + endIndex + ' of ' + dataSet;
        this.showDivSearch = false;
        this.selectedView = view;
        this.resetAttributeList();
        this.setSearchAttributeList();
    };
    EndcustomerComponent.prototype.changeSearchView = function (header) {
        this.selectedSearchAttrList = [];
        var res = this.attributeList.filter(function (item) {
            return item.selected;
        });
        this.selectedSearchAttrList = res;
        this.showDivSearch = res.length === 0 ? false : true;
        var obj = {};
        if (this.showDivSearch) {
            obj['sysId'] = '';
            obj[header.keyword] = '';
            this.addEditEndCustForm.patchValue({
                syssearchtext: obj
            });
        }
    };
    EndcustomerComponent.prototype.rowClick = function (event, currentElm, list) {
        if (event.ctrlKey) {
            this.toggleRow(currentElm);
        }
        if (event.button === 0) {
            if (!event.ctrlKey && !event.shiftKey) {
                this.clearAll(list);
                this.toggleRow(currentElm);
            }
            if (event.shiftKey) {
                this.selectRowsBetweenIndexes([this.lastSelectedRow.rowIndex, currentElm.rowIndex], list);
            }
        }
    };
    EndcustomerComponent.prototype.toggleRow = function (row) {
        row.selected = !row.selected;
        this.lastSelectedRow = row;
    };
    EndcustomerComponent.prototype.selectRowsBetweenIndexes = function (indexes, list) {
        indexes.sort(function (a, b) {
            return a - b;
        });
        for (var i = indexes[0]; i <= indexes[1]; i++) {
            list[i].selected = true;
        }
    };
    EndcustomerComponent.prototype.clearAll = function (list) {
        list.map(function (sysId) {
            sysId.selected = false;
        });
    };
    EndcustomerComponent.prototype.resetData = function () {
        this.tempRemoveGroupList = [];
        this.tempAddSysIdList = [];
        this.selectedView = 'device';
        this.selectedSysIds = [];
        this.selectedGroups = [];
    };
    EndcustomerComponent.prototype.resetAttributeList = function () {
        this.selectedSearchAttrList = [];
        this.attributeList.map(function (attr) {
            attr.selected = false;
        });
    };
    EndcustomerComponent.prototype.setSearchAttributeList = function () {
        this.attributeList = this.selectedView === 'device' ? this.searchsysIdAttributes : this.searchgroupAttributes;
    };
    EndcustomerComponent.prototype.getGroupListFiltered = function () {
        var _this = this;
        var tempGroupDataList = this.groupDataList;
        //this.searchText = this.searchText.toLowerCase();
        if (this.addEditEndCustForm.value.groupNameSearch.length === 0) {
            return this.groupDataList;
        }
        if (this.addEditEndCustForm.value.groupNameSearch.length >= 3) {
            tempGroupDataList = tempGroupDataList.filter(function (item, i) {
                return item.endcustomer_name.toLowerCase().includes(_this.addEditEndCustForm.value.groupNameSearch.toLowerCase()) ||
                    item.created_by.toLowerCase().includes(_this.addEditEndCustForm.value.groupNameSearch.toLowerCase()) ||
                    _this.matchSerialNum(item.serial_number, _this.addEditEndCustForm.value.groupNameSearch.toLowerCase());
            });
        }
        return tempGroupDataList;
    };
    EndcustomerComponent.prototype.clearGroupSearchText = function () {
        this.showDivSearch = false;
        this.resetPagination();
        this.shouldCallLoadPages = true;
        this.attributeList.map(function (item) {
            item.selected = false;
        });
        this.addEditEndCustForm.patchValue({
            groupNameSearch: '',
            groupSysIdSearch: ''
        });
        this.getGroupListFiltered();
    };
    Object.defineProperty(EndcustomerComponent.prototype, "f", {
        /*-------- External Library methods START ------------
        ---Add all your 3rd party/External Library methods here -----*/
        //Form control methos
        get: function () { return this.addEditEndCustForm.controls; },
        enumerable: false,
        configurable: true
    });
    //sort function from sortable directive
    EndcustomerComponent.prototype.onSort = function (_a) {
        var column = _a.column, direction = _a.direction;
        // resetting other headers
        this.headers.forEach(function (header) {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });
        if (direction === '') {
            this.endCustomerList = this.endCustomerList;
        }
        else {
            this.endCustomerList = __spreadArrays(this.endCustomerList).sort(function (a, b) {
                var res = exports.compare(a[column], b[column]);
                return direction === 'asc' ? res : -res;
            });
        }
    };
    __decorate([
        core_1.ViewChildren(sortable_directive_1.SortableDirective)
    ], EndcustomerComponent.prototype, "headers");
    EndcustomerComponent = __decorate([
        core_1.Component({
            selector: 'app-endcustomer',
            templateUrl: './endcustomer.component.html',
            styleUrls: ['./endcustomer.component.scss']
        })
    ], EndcustomerComponent);
    return EndcustomerComponent;
}());
exports.EndcustomerComponent = EndcustomerComponent;
