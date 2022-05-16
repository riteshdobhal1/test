"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminService = void 0;
//import { APIRESARRAYDATA } from './admin.service';
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var data_service_1 = require("./../data.service");
var userGlobals = require("../../admin/user/global");
var api = require("../../shared/resource");
var global_1 = require("./../../admin/role/global");
var _ = require("lodash");
var moment = require("moment");
var AdminService = /** @class */ (function (_super) {
    __extends(AdminService, _super);
    function AdminService(http, userTrackingService) {
        var _this = _super.call(this, http) || this;
        _this.userTrackingService = userTrackingService;
        _this.loggedInUserDetails = null;
        _this.endCustomerListForUser = [];
        _this.iscreatorcust = false;
        _this.isviewercust = false;
        _this.endCustomerNameMap = [];
        _this.mps = [undefined, undefined, undefined];
        _this.associatedEndCustomerList = [];
        _this.totalsysid = 0;
        _this.sysIdColListArr = [];
        _this.mpseData = null;
        try {
            _this.mps = _this.getMPS().split(/:|\//);
        }
        catch (e) { }
        return _this;
    }
    /* ****Role Page Service featureDataMethods**** */
    //Returns formated Role list from API. Including manupulations and mapping
    AdminService.prototype.getRoleList = function () {
        var _this = this;
        this.roleFeatures = global_1.roleFeatures;
        return this.http.get(this.serverUrl + api.listRole + this.getMfr()).pipe(operators_1.map(function (data) {
            _this.userTrackingService.updateAccessTime();
            _this.TwoAuth = data.TwoAuth;
            var roleData = data.Data;
            for (var i = 0; i < roleData.length; i++) {
                roleData[i].featureData = [];
                roleData[i].featuresAssigned = [];
                roleData[i].prodAssigned = [];
                roleData[i].selected = false;
                roleData[i].colapsed = true;
                for (var _i = 0, _a = Object.entries(roleData[i].domains); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    var tempFeatureData = {
                        features: '',
                        featureKey: '',
                        featuresDis: [],
                        mps: [],
                        name: '',
                        selected: false,
                        isCreator: false,
                        isViewer: false
                    };
                    var tempfeatures = roleData[i].features[roleData[i].domains[key]].replace(/ /g, '');
                    if (tempfeatures.indexOf(global_1.viewerPermission) != -1) {
                        tempFeatureData.isViewer = true;
                        var temparr1 = tempfeatures.split(",");
                        temparr1 = temparr1.filter(function (item) {
                            return item != global_1.viewerPermission;
                        });
                        tempfeatures = temparr1.join(",");
                        _this.isviewercust = true;
                    }
                    if (tempfeatures.indexOf(_this.roleFeatures[4].value) != -1) {
                        tempFeatureData.isCreator = true;
                        _this.iscreatorcust = true;
                    }
                    tempFeatureData.featureKey = tempfeatures;
                    tempfeatures = tempfeatures.split(",");
                    for (var i_1 = 0; i_1 < tempfeatures.length; i_1++) {
                        for (var j = 0; j < _this.roleFeatures.length; j++) {
                            if (_this.roleFeatures[j].value == tempfeatures[i_1]) {
                                tempfeatures[i_1] = _this.roleFeatures[j].name;
                            }
                        }
                    }
                    tempFeatureData.features = tempfeatures.join(',');
                    tempFeatureData.featuresDis = tempFeatureData.features.split(',').sort();
                    roleData[i].featuresAssigned = roleData[i].featuresAssigned.concat(tempFeatureData.featuresDis);
                    tempFeatureData.mps = roleData[i].domains[key].split(/:|\//);
                    tempFeatureData.name = key;
                    roleData[i].prodAssigned.push(key);
                    if (tempFeatureData.mps[0] != global_1.defaultMps) {
                        roleData[i].featureData.push(tempFeatureData);
                    }
                }
                var disNameObj = roleData[i].name.split("_");
                if (disNameObj[0] != _this.getMfr()) {
                    roleData.splice(i, 1);
                    i--;
                    continue;
                }
                else {
                    disNameObj.splice(0, 3);
                    var tempRoleDisName = disNameObj.join("_");
                    roleData[i].DisName = tempRoleDisName;
                }
                roleData[i].roleType = global_1.roleType.Internal;
                if (roleData[i].featureData[0].featureKey) {
                    var featureList = roleData[i].featureData[0].featureKey.replace(/\s/g, '').split(",");
                    if (featureList.length == 1 && featureList.indexOf(global_1.featureKeys.healthcheck) > -1) {
                        roleData[i].roleType = global_1.roleType.External;
                    }
                }
                roleData[i].featuresAssigned = _.uniq(roleData[i].featuresAssigned);
                delete roleData[i].features;
                delete roleData[i].mps_isdomain;
                delete roleData[i].realm;
                delete roleData[i].realm_appsversion;
                delete roleData[i].realm_isdomain;
                delete roleData[i].domains;
                delete roleData[i].studio_proj_limit;
                delete roleData[i].is_super;
                if (roleData[i].featuresAssigned.indexOf(global_1.roleFeatures[0].name) !== -1) {
                    _this.adminRole = roleData[i]; //Assign Admin Role.
                }
            }
            data.Data = roleData;
            // Assign Role list to local list variable 
            _this.roleList = roleData;
            return data;
        }), operators_1.catchError(this.handleError));
    };
    //Download CSV File accepts 2 parameters data and type of csvfiledata
    AdminService.prototype.downloadCSVFile = function (data, ReportTitle) {
        var arrData = typeof data != 'object' ? JSON.parse(data) : data;
        var CSV = '';
        CSV += ReportTitle + '\r\n\n';
        var row = "";
        for (var index in arrData[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }
        var fileName = "MyReport_";
        fileName += ReportTitle.replace(/ /g, "_");
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        var link = document.createElement("a");
        link.href = uri;
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    //Get Role Name List
    AdminService.prototype.getRoleListArray = function () {
        var tempArray = [];
        for (var i = 0; i < this.roleList.length; i++) {
            var obj = {
                name: this.roleList[i].name,
                disName: this.roleList[i].DisName,
                featureData: this.roleList[i].featureData,
                roleType: this.roleList[i].roleType
            };
            tempArray.push(obj);
        }
        this.roleListData = tempArray;
        return tempArray;
    };
    /* ****Role Page Service Methods Ends**** */
    //private endCustomerObservable : Observable<any[]> ; 
    /* ****User Page Service Methods Begin**** */
    AdminService.prototype.fetchLoggedInUserDetails = function () {
        var _this = this;
        var url = "" + this.serverUrl + api.userdetails + this.mps[0] + "/" + this.mps[1] + "/" + this.mps[2];
        return this.http
            .get(this.serverUrl + api.userdetails + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2])
            .pipe(operators_1.map(function (data) {
            _this.licensesData = {};
            _this.licensesData.maxUsers = data.Data.max_users;
            _this.licensesData.maxWBLicenses = data.Data.max_licensed_users;
            _this.licensesData.maxCreatorLicenses = data.Data.max_creator_licenses;
            _this.licensesData.maxViewerLicenses = data.Data.max_viewer_licenses; //Hardcoaded till data is recieved
            _this.userTrackingService.updateAccessTime();
            return data.Data;
        }), operators_1.catchError(this.handleError));
    };
    AdminService.prototype.setColListData = function (data) {
        this.sysIdColListArr = data;
    };
    AdminService.prototype.getUserList = function () {
        var _this = this;
        var userList = this.isSSOUser() ? api.listUserSso : api.listUser;
        return this.http.get(this.serverUrl + userList + this.getMfr()).pipe(operators_1.map(function (data) {
            var userData = data.Data;
            _this.licensesData.totalUsers = 0;
            _this.licensesData.workbenchLicensedUsed = 0;
            _this.licensesData.creatorLicensesUsed = 0;
            _this.licensesData.viewerLicensesUser = 0;
            _this.licensesData.adminUsers = 0;
            var roleList = _this.getRoleListArray();
            var roles = roleList.map(function (item) {
                return item.name;
            });
            userData = userData.filter(function (item) {
                return roles.indexOf(item.role) !== -1;
            });
            _this.associatedEndCustomerList = [];
            userData.map(function (item) {
                if (item.end_customer != 'NA' && item.end_customer != "") {
                    _this.associatedEndCustomerList.push(item.end_customer.toLowerCase());
                }
                _this.associatedEndCustomerList = _.uniq(_this.associatedEndCustomerList);
                for (var i = 0; i < roleList.length; i++) {
                    if (roleList[i].name === item.role) {
                        var role = roleList[i];
                        var fetureArray = [];
                        for (var x = 0; x < role.featureData.length; x++) {
                            fetureArray = fetureArray.concat(role.featureData[x].featuresDis);
                        }
                        fetureArray = _.uniq(fetureArray);
                        if (fetureArray.indexOf('Dashboards') > -1 &&
                            fetureArray.indexOf('Workbench') === -1 &&
                            fetureArray.indexOf('Creator') === -1 && _this.licensesData.maxViewerLicenses !== 0 && _this.isviewercust) {
                            _this.licensesData.viewerLicensesUser++;
                        }
                        if (fetureArray.indexOf('Dashboards') > -1 &&
                            fetureArray.indexOf('Workbench') > -1 &&
                            fetureArray.indexOf('Creator') === -1 && _this.licensesData.maxWBLicenses !== 0) {
                            _this.licensesData.workbenchLicensedUsed++;
                        }
                        if (fetureArray.indexOf('Creator') > -1 &&
                            fetureArray.indexOf('Workbench') > -1 &&
                            fetureArray.indexOf('Dashboards') > -1 && _this.licensesData.maxCreatorLicenses !== 0 && _this.iscreatorcust) {
                            _this.licensesData.creatorLicensesUsed++;
                        }
                        if (fetureArray.indexOf('Admin') > -1) {
                            _this.licensesData.adminUsers++;
                        }
                    }
                }
                var roleName = item.role.split('_');
                roleName.splice(0, 3);
                item.roleName = roleName.join('_');
                item.adminUser = (_this.loggedInUserDetails.user[0].email === item.email) ? true : false;
                _this.licensesData.totalUsers++;
                item.selected = false;
            });
            _this.userList = userData;
            _this.userTrackingService.updateAccessTime();
            return userData;
        }), operators_1.catchError(this.handleError));
    };
    AdminService.prototype.setLoggedInUserDetails = function (data) {
        this.loggedInUserDetails = data;
    };
    AdminService.prototype.isExternalUser = function () {
        if (this.loggedInUserDetails) {
            return this.loggedInUserDetails.user[0].is_external;
        }
    };
    // tslint:disable-next-line: adjacent-overload-signatures
    AdminService.prototype.getLoggedInUserDetails = function () {
        return this.loggedInUserDetails;
    };
    AdminService.prototype.getLicensesData = function () {
        return this.licensesData;
    };
    AdminService.prototype.getRoleProductList = function () {
        var roleProdMap = [];
        this.roleList.map(function (item) {
            var obj = { name: '', productList: [] };
            obj.name = item.DisName;
            obj.productList = item.featureData.map(function (featureData) {
                return featureData.name;
            });
            roleProdMap.push(obj);
        });
        return roleProdMap;
    };
    AdminService.prototype.getEndCustomerListForUser = function (prod) {
        this.endCustomerListForUser = [];
        var details = this.groupedDataEndCustomer[prod];
        if (details) {
            this.endCustomerListForUser = details.map(function (item) {
                return item.endcustomer_name;
            });
        }
        return this.endCustomerListForUser;
    };
    /* ****User Page Service Methods Ends**** */
    /*----------------- START End Customer List code-----------------------*/
    //Get end customer list method
    AdminService.prototype.getendCustomerList = function () {
        var _this = this;
        var params = new http_1.HttpParams();
        params = params.append('fnCallSrcOpt', 'ADMIN_CONSOLE');
        return this.http.get(this.serverUrl + api.listEndCustomer + this.getMfr(), { params: params })
            .pipe(operators_1.map(function (data) {
            var endCustomerData = data.Data;
            if (endCustomerData.length > 0) {
                _this.endCustomerNameMap = [];
                for (var i = 0; i < endCustomerData.length; i++) {
                    endCustomerData[i].rowIndex = i;
                    endCustomerData[i].selected = false;
                    endCustomerData[i].disabled = false;
                    _this.endCustomerNameMap.push(endCustomerData[i].endcustomer_name.toLowerCase());
                }
                _this.endCustomerList = endCustomerData;
                _this.groupedDataEndCustomer = _.groupBy(_this.endCustomerList, function (d) {
                    return d.mfr + "/" + d.prod + "/" + d.sch;
                });
            }
            else {
                _this.endCustomerNameMap = [];
                _this.groupedDataEndCustomer = [];
            }
            _this.userTrackingService.updateAccessTime();
            return data;
        }), operators_1.catchError(this.handleError));
    };
    //Get product list from user login api
    AdminService.prototype.getProductListApi = function () {
        var _this = this;
        return this.http
            .get(this.serverUrl + api.userdetails + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2])
            .pipe(operators_1.map(function (data) {
            _this.userTrackingService.updateAccessTime();
            return data.Data;
        }), operators_1.catchError(this.handleError));
    };
    //method to get email of logged in user
    AdminService.prototype.getLoggedEmail = function () {
        if (this.loggedInUserDetails) {
            return this.loggedInUserDetails.user[0].email;
        }
    };
    //method to check if the user is an sso user
    AdminService.prototype.isSSOUser = function () {
        if (this.loggedInUserDetails) {
            return this.loggedInUserDetails.user[0].sso;
        }
    };
    //get groupdata method
    AdminService.prototype.getGroupedData = function () {
        return this.groupedDataEndCustomer;
    };
    //get  list of sys id and set grouped data and set unavailable sysIds
    AdminService.prototype.getSysList = function (prodName, startindex, endindex, searchtext) {
        var _this = this;
        var keys = Object.keys(searchtext);
        var postData = { "search": {} };
        keys.map(function (key) {
            if (searchtext[key].length) {
                postData.search[key] = searchtext[key];
            }
        });
        var self = this;
        var prod_mps = prodName.split(/:|\//);
        var url = this.serverUrl + api.sysIdList + prod_mps[0] + '/' + prod_mps[1] + '/' + prod_mps[2] + '/' + prod_mps[0] + '/' + startindex + '/' + endindex;
        return this.http.post(url, postData).pipe(operators_1.map(function (data) {
            _this.sysIdList = [];
            //set unavaliable sysids
            var mpsGroupedArray = _this.groupedDataEndCustomer[prodName] || [];
            var sysIdArr = [];
            if (mpsGroupedArray.length) {
                mpsGroupedArray.map(function (item) {
                    sysIdArr.push(item.serial_number);
                });
            }
            _this.totalsysid = parseInt(data.Count);
            data.Data.map(function (item) {
                var obj = {};
                var index = item.sysId;
                _this.sysIdColListArr.map(function (sysIdItem) {
                    obj[sysIdItem.colName] = item[sysIdItem.colName];
                });
                obj.rowIndex = index;
                obj.selected = false;
                // let obj = { sysId: String, selected: false, rowIndex: index , systemName: String, hospName: String, compName: String, city: String, country: String};
                self.sysIdList.push(obj);
            });
            _this.userTrackingService.updateAccessTime();
            //used loadash here
            //Orderby is not native to angular anymore hence used loadash to sort/orderby
            return _.sortBy(_this.sysIdList, function (o) { return o.selected; });
        }), operators_1.catchError(this.handleError));
    };
    //method to get name map array of endcustomer
    AdminService.prototype.getEndCustomerNameMap = function () {
        return this.endCustomerNameMap || [];
    };
    AdminService.prototype.getFilterObj = function (list, filterList) {
        list.forEach(function (item) {
            var _loop_1 = function (key) {
                filterList.forEach(function (item1) {
                    if (item1.columnName === key && item[key] !== '') {
                        var obj = { name: '', selected: false };
                        if (Array.isArray(item[key])) {
                            var temparr = [];
                            for (var i = 0; i < item[key].length; i++) {
                                var tempobj = {};
                                tempobj.name = item[key][i];
                                tempobj.selected = false;
                                temparr.push(tempobj);
                            }
                            item1.data = item1.data.concat(temparr);
                        }
                        else {
                            if (item[key] !== null) {
                                if (item1.isDateType) {
                                    obj.name = moment(item[key]).format('YYYY-MM-DD HH:mm:ss');
                                    obj.selected = false;
                                    item1.data = _.cloneDeep(userGlobals.timeListFilter);
                                }
                                else {
                                    obj.name = item[key];
                                    obj.selected = false;
                                    if (obj.name !== 'NA') {
                                        item1.data.push(obj);
                                    }
                                }
                            }
                        }
                        item1.data = _.uniqBy(item1.data, 'name');
                    }
                });
            };
            for (var key in item) {
                _loop_1(key);
            }
        });
        return filterList;
    };
    AdminService.prototype.getSysIdColList = function (prod) {
        var mps = prod.split(/:|\//);
        return this.http.get(this.serverUrl + api.sysIdColList + mps[0] + '/' + mps[1] + '/' + mps[2]).pipe(operators_1.map(function (data) {
            return data.Data;
        }), operators_1.catchError(this.handleError));
    };
    AdminService.prototype.setMPSEDetails = function (data) {
        this.mpseData = data;
    };
    AdminService.prototype.getMPSEDetails = function () {
        return this.mpseData;
    };
    AdminService.prototype.getInternalLogo = function () {
        if (this.mpseData) {
            return this.mpseData.logo_internal;
        }
    };
    AdminService.prototype.getMPSEconfigDetails = function () {
        return this.http.get(this.serverUrl + api.mpseDetails + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2] + '/' + this.getMfr()).pipe(operators_1.map(function (data) {
            return data.Data;
        }), operators_1.catchError(this.handleError));
    };
    AdminService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AdminService);
    return AdminService;
}(data_service_1.DataService));
exports.AdminService = AdminService;
