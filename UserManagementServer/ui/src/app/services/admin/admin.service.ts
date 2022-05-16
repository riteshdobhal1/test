//import { APIRESARRAYDATA } from './admin.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ROLEITEM, ROLEFEATURE, ROLELISTAPIDATA } from '../../admin/role/model';
import { DataService } from './../data.service';
import * as userGlobals from '../../admin/user/global';
import { User, LicensesData, RoleProdList } from './../../admin/user/model';
import * as api from '../../shared/resource';
import { roleFeatures, featureKeys, roleType, adminRoleName, defaultMps, viewerPermission } from './../../admin/role/global';
import { ENDCUSTOMER, SYSIDLIST } from './../../admin/endcustomer/model';
import * as _ from 'lodash';
import * as moment from 'moment';
import { UserTrackingService } from './user-tracking.service';


//Interface for API response with array data. Common for all APIs. Reusable
export interface APIRESARRAYDATA {
  Status: string;
  Msg: string;
  Data: [];
}

export interface APIRESARRAYDATAPAGE {
  Status: string;
  Msg: string;
  Data: [];
  Count: string;
}

export interface APIRESOBJDATA {
  Status: string;
  Msg: string;
  Data: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService extends DataService {

  roleList: Array<ROLEITEM>;
  TwoAuth: boolean;
  adminRole: ROLEITEM;
  roleFeatures: Array<ROLEFEATURE>;
  // User list service declarations
  userList: Array<User>;
  licensesData: LicensesData;
  loggedInUser: User;
  loggedInUserDetails: any = null;
  roleListData: Array<RoleProdList>;
  endCustomerListForUser = [];
  endCustomerList: Array<ENDCUSTOMER>;
  productList: any;
  groupedDataEndCustomer: any;
  sysIdList: Array<any>;
  iscreatorcust: boolean = false;
  isviewercust: boolean = false;
  endCustomerNameMap: Array<string> = [];
  mps = [undefined, undefined, undefined];
  associatedEndCustomerList:Array<string> = [];
  totalsysid:number = 0;
  sso: boolean;
  sysIdColListArr = [];
  constructor(http: HttpClient, private userTrackingService: UserTrackingService) {
    super(http);
    try {
      this.mps = this.getMPS().split(/:|\//);
    } catch (e) { }

  }


  /* ****Role Page Service featureDataMethods**** */
  //Returns formated Role list from API. Including manupulations and mapping
  getRoleList() {
    this.roleFeatures = roleFeatures;
    return this.http.get<ROLELISTAPIDATA>(this.serverUrl+api.listRole+this.getMfr()).pipe(map(data => {
      this.userTrackingService.updateAccessTime();
      this.TwoAuth = data.TwoAuth;
      let roleData = data.Data as Array<ROLEITEM>;
      for (let i = 0; i < roleData.length; i++) {
        roleData[i].featureData = [];
        roleData[i].featuresAssigned = [];
        roleData[i].prodAssigned = [];
        roleData[i].selected = false;
        roleData[i].colapsed = true;
        for (const [key, value] of Object.entries(roleData[i].domains)) {
          let tempFeatureData = {
            features: '',
            featureKey: '',
            featuresDis: [],
            mps: [],
            name: '',
            selected: false,
            isCreator: false,
            isViewer: false,
            mpsstring: '',
            isExplorerEnabled: false,
            explorerDateRange: ''
          };
          let tempfeatures = roleData[i].features[roleData[i].domains[key]].replace(/ /g, '');
          if(tempfeatures.indexOf(viewerPermission) != -1){
            tempFeatureData.isViewer = true;
            let temparr1 = tempfeatures.split(",");
            temparr1 = temparr1.filter(item => {
              return item != viewerPermission;
            });
            tempfeatures = temparr1.join(",");
            this.isviewercust = true;
          }
          if(tempfeatures.indexOf(this.roleFeatures[4].value) != -1){
            tempFeatureData.isCreator = true;
            this.iscreatorcust = true;
          }
          tempFeatureData.featureKey = tempfeatures;
          tempfeatures = tempfeatures.split(",");
          for (let i = 0; i < tempfeatures.length; i++) {
            for (let j = 0; j < this.roleFeatures.length; j++) {
              if (this.roleFeatures[j].value == tempfeatures[i]) {
                tempfeatures[i] = this.roleFeatures[j].name;
              }
            }
          }
          tempFeatureData.features = tempfeatures.join(',');
          tempFeatureData.featuresDis = tempFeatureData.features.split(',').sort();
          roleData[i].featuresAssigned = roleData[i].featuresAssigned.concat(tempFeatureData.featuresDis);
          tempFeatureData.mps = roleData[i].domains[key].split(/:|\//);
          tempFeatureData.name = key;
          tempFeatureData.mpsstring = tempFeatureData.mps.join("/");
          if(tempFeatureData.featuresDis.indexOf('Explorer') > -1){
            // tempFeatureData.isExplorerEnabled = true;
            tempFeatureData.explorerDateRange = roleData[i].explorer_date_range[tempFeatureData.mpsstring];
          }
          roleData[i].prodAssigned.push(key);
          if (tempFeatureData.mps[0] != defaultMps) {
            roleData[i].featureData.push(tempFeatureData as any);
          }
        }
        let disNameObj = roleData[i].name.split("_");
        if (disNameObj[0] != this.getMfr()) {
          roleData.splice(i, 1);
          i--;
          continue;
        } else {
          disNameObj.splice(0, 3);
          let tempRoleDisName = disNameObj.join("_");
          roleData[i].DisName = tempRoleDisName;
        }
        roleData[i].roleType = roleType.Internal;
        if (roleData[i].featureData[0].featureKey) {
          var featureList = roleData[i].featureData[0].featureKey.replace(/\s/g, '').split(",");
          if (featureList.length == 1 && featureList.indexOf(featureKeys.healthcheck) > -1) {
            roleData[i].roleType = roleType.External;
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
        if (roleData[i].featuresAssigned.indexOf(roleFeatures[0].name) !== -1) {
          this.adminRole = roleData[i]; //Assign Admin Role.
        }
      }
      data.Data = roleData as [];
      // Assign Role list to local list variable 
      this.roleList = roleData;
      return data;
    })
      , catchError(this.handleError));
  }
  //Download CSV File accepts 2 parameters data and type of csvfiledata
  downloadCSVFile(data, ReportTitle) {
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
  }
  //Get Role Name List
  getRoleListArray() {
    let tempArray = [];
    for (let i = 0; i < this.roleList.length; i++) {
      const obj: RoleProdList = {
        name: this.roleList[i].name,
        disName: this.roleList[i].DisName,
        featureData: this.roleList[i].featureData,
        roleType: this.roleList[i].roleType
      }
      tempArray.push(obj);
    }
    this.roleListData = tempArray;
    return tempArray;
  }
  /* ****Role Page Service Methods Ends**** */

  //private endCustomerObservable : Observable<any[]> ; 

  /* ****User Page Service Methods Begin**** */

  fetchLoggedInUserDetails() {
    let url = `${this.serverUrl}${api.userdetails}${this.mps[0]}/${this.mps[1]}/${this.mps[2]}`;
    return this.http
      .get<APIRESOBJDATA>(this.serverUrl + api.userdetails + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2])
      .pipe(map(data => {
        this.licensesData = {} as LicensesData;
        this.licensesData.maxUsers = data.Data.max_users;
        this.licensesData.maxWBLicenses = data.Data.max_licensed_users;
        this.licensesData.maxCreatorLicenses = data.Data.max_creator_licenses;
        this.licensesData.maxViewerLicenses = data.Data.max_viewer_licenses; //Hardcoaded till data is recieved
        this.userTrackingService.updateAccessTime();
        return data.Data;
      }), catchError(this.handleError));
  }

  setColListData(data){
    this.sysIdColListArr = data;
  }

  getUserList() {
    const userList = this.isSSOUser() ? api.listUserSso : api.listUser;
    return this.http.get<APIRESARRAYDATA>(this.serverUrl + userList + this.getMfr()).pipe(map(data => {
      let userData = data.Data as Array<User>;
      this.licensesData.totalUsers = 0;
      this.licensesData.workbenchLicensedUsed = 0;
      this.licensesData.creatorLicensesUsed = 0;
      this.licensesData.viewerLicensesUser = 0;
      this.licensesData.adminUsers = 0;
      const roleList = this.getRoleListArray();
      const roles = roleList.map((item) => {
        return item.name;
      });
      userData = userData.filter(item => {
        return roles.indexOf(item.role) !== -1;
      });
      this.associatedEndCustomerList = [];
      userData.map(item => {
        if(item.end_customer != 'NA' && item.end_customer != ""){
          this.associatedEndCustomerList.push(item.end_customer.toLowerCase());
        }
        this.associatedEndCustomerList = _.uniq(this.associatedEndCustomerList);
        for (let i = 0; i < roleList.length; i++) {
          if (roleList[i].name === item.role) {
            const role = roleList[i];
            let fetureArray = []
            for (let x = 0; x < role.featureData.length; x++) {
              fetureArray = fetureArray.concat(role.featureData[x].featuresDis);
            }
            fetureArray = _.uniq(fetureArray);
            if (fetureArray.indexOf('Dashboards') > -1 &&
            fetureArray.indexOf('Workbench') === -1 &&
            fetureArray.indexOf('Creator') === -1 && this.licensesData.maxViewerLicenses !== 0 && this.isviewercust && (item.user_state === "ACTIVE" || item.user_state === "INVITED")) {
              this.licensesData.viewerLicensesUser++;
            }
            if (fetureArray.indexOf('Dashboards') > -1 &&
            fetureArray.indexOf('Workbench') > -1 &&
            fetureArray.indexOf('Creator') === -1 && this.licensesData.maxWBLicenses !== 0 && (item.user_state === "ACTIVE" || item.user_state === "INVITED")) {
              this.licensesData.workbenchLicensedUsed++;
            }
            if (fetureArray.indexOf('Creator') > -1 &&
            fetureArray.indexOf('Workbench') > -1 &&
            fetureArray.indexOf('Dashboards') > -1 && this.licensesData.maxCreatorLicenses !== 0 && this.iscreatorcust && (item.user_state === "ACTIVE" || item.user_state === "INVITED")) {
              this.licensesData.creatorLicensesUsed++;
            }
            if (fetureArray.indexOf('Admin') > -1) {
              this.licensesData.adminUsers++;
            }
          }
        }
        const roleName = item.role.split('_');
        roleName.splice(0, 3);
        item.roleName = roleName.join('_');
        item.adminUser = (this.loggedInUserDetails.user[0].email === item.email) ? true : false;
        if(item.user_state === "ACTIVE" || item.user_state === "INVITED"){
          this.licensesData.totalUsers++;
        }
        item.selected = false;
      });
      this.userList = userData;
      this.userTrackingService.updateAccessTime();
      return userData;
    }), catchError(this.handleError));
  }

  setLoggedInUserDetails(data) {
    this.loggedInUserDetails = data;
  }

  isExternalUser(){
    if(this.loggedInUserDetails){
      return this.loggedInUserDetails.user[0].is_external;
    }
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  getLoggedInUserDetails() {
    return this.loggedInUserDetails;
  }


  getLicensesData() {
    return this.licensesData;
  }

  getRoleProductList() {
    const roleProdMap = [];
    this.roleList.map((item) => {
      const obj = { name: '', productList: [] };
      obj.name = item.DisName;
      obj.productList = item.featureData.map((featureData) => {
        return featureData.name;
      });
      roleProdMap.push(obj);
    });
    return roleProdMap;
  }

  getEndCustomerListForUser(prod) {
    this.endCustomerListForUser = [];
    const details = this.groupedDataEndCustomer[prod];
    if (details) {
      this.endCustomerListForUser = details.map((item: any) => {
        return item.endcustomer_name;
      });
    }
    return this.endCustomerListForUser;
  }

  /* ****User Page Service Methods Ends**** */

  /*----------------- START End Customer List code-----------------------*/
  //Get end customer list method
  getendCustomerList() {
    let params = new HttpParams();
    params = params.append('fnCallSrcOpt', 'ADMIN_CONSOLE');
    return this.http.get<APIRESARRAYDATA>(this.serverUrl + api.listEndCustomer + this.getMfr() , {params: params})
      .pipe(map(data => {

        let endCustomerData = data.Data as Array<ENDCUSTOMER>;

        if (endCustomerData.length > 0) {
          this.endCustomerNameMap = [];
          for (let i = 0; i < endCustomerData.length; i++) {
            endCustomerData[i].rowIndex = i;
            endCustomerData[i].selected = false;
            endCustomerData[i].disabled = false;
            this.endCustomerNameMap.push(endCustomerData[i].endcustomer_name.toLowerCase());
          }
          this.endCustomerList = endCustomerData;
          this.groupedDataEndCustomer = _.groupBy(this.endCustomerList, (d) => {
            return d.mfr + "/" + d.prod + "/" + d.sch;
          });
        }
        else {
          this.endCustomerNameMap = [];
          this.groupedDataEndCustomer = [];
        }
        this.userTrackingService.updateAccessTime();
        return data;

      }), catchError(this.handleError));
  }

  //Get product list from user login api
  getProductListApi() {
    return this.http
      .get<APIRESOBJDATA>(this.serverUrl + api.userdetails + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2])
      .pipe(map(data => {
        this.userTrackingService.updateAccessTime();
        return data.Data;
      }), catchError(this.handleError));

  }

  //method to get email of logged in user
  getLoggedEmail() {
    if(this.loggedInUserDetails){
      return this.loggedInUserDetails.user[0].email;
    }
  }

  //method to check if the user is an sso user
  isSSOUser() {
    if(this.loggedInUserDetails){
      return this.loggedInUserDetails.user[0].sso;
    }
  }

  //get groupdata method
  getGroupedData() {
    return this.groupedDataEndCustomer;
  }
  

  //get  list of sys id and set grouped data and set unavailable sysIds
  getSysList(prodName, startindex, endindex, searchtext) {
    let keys = Object.keys(searchtext);
    var postData = <any> {"search":{}};
    keys.map((key) => {
      if(searchtext[key].length){
        postData.search[key] = searchtext[key];
      }
    })
    let self = this;
    let prod_mps = prodName.split(/:|\//);
    let url = this.serverUrl + api.sysIdList + prod_mps[0] + '/' + prod_mps[1] + '/' + prod_mps[2] + '/' + prod_mps[0] + '/' + startindex + '/' + endindex;
    return this.http.post(url, postData).pipe(map((data: any) => {
      this.sysIdList = [] as any;
      //set unavaliable sysids
      let mpsGroupedArray = this.groupedDataEndCustomer[prodName] || [];
      let sysIdArr = [];
      if (mpsGroupedArray.length) {
        mpsGroupedArray.map((item: any) => {
          sysIdArr.push(item.serial_number);
        });
      } 
      this.totalsysid = parseInt(data.Count)

      data.Data.map((item: any) => {
        let obj = <any> {};
        let index = item.sysId as any;
        this.sysIdColListArr.map((sysIdItem: any) => {
          obj[sysIdItem.colName] = item[sysIdItem.colName];
        })
        obj.rowIndex = index;
        obj.selected = false;
        // let obj = { sysId: String, selected: false, rowIndex: index , systemName: String, hospName: String, compName: String, city: String, country: String};
        self.sysIdList.push(obj);
      });
     this.userTrackingService.updateAccessTime();
      //used loadash here
      //Orderby is not native to angular anymore hence used loadash to sort/orderby
      return _.sortBy(this.sysIdList, o => o.selected);
    }), catchError(this.handleError));
  }

  //method to get name map array of endcustomer
  getEndCustomerNameMap() {
    return this.endCustomerNameMap || [];
  }

  getFilterObj(list: any, filterList: any) {
    list.forEach((item: any) => {
      for (let key in item) {
        filterList.forEach((item1) => {
          if (item1.columnName === key && item[key] !== '') {
            var obj = { name: '', selected: false };
            if (Array.isArray(item[key])) {
              var temparr = [];
              for (let i = 0; i < item[key].length; i++) {
                var tempobj: any = {};
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
                } else {
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
        })
      }
    })
    return filterList;
  }

  getSysIdColList(prod){
    let mps = prod.split(/:|\//);
    return this.http.get<APIRESARRAYDATA>(this.serverUrl + api.sysIdColList + mps[0] + '/' + mps[1] + '/' + mps[2]).pipe(map(data => {
      return data.Data;
    }), catchError(this.handleError));
  }

  checkIfTableauConfigured() {
    return this.http
      .get<APIRESOBJDATA>(this.serverUrl + api.checkIfTableauConfigured + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2])
      .pipe(map(data => {
        return data.Data;
      }), catchError(this.handleError));
  }

/*----------------- END  End Customer List code-----------------------*/
}
