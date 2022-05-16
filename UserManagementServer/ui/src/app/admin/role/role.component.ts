import { Component, OnInit, QueryList, ViewChildren, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import {Router} from "@angular/router";
import { SortableDirective, SortEvent, SortDirection } from '../../shared/directives/sortable.directive';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {ROLEITEM, FEATURE, FEATUREDATA, ROLEGRP, FORMFEATUREDATA} from './model';
import {ConfirmationPopupComponent} from '../../shared/confirmation-popup/confirmation-popup.component';
import { MessagePopupComponent } from '../../shared/message-popup/message-popup.component';
import {ToastService} from '../../shared/toast-notification/toast-service.service';
import * as api from '../../shared/resource';
import { DataResponse } from './../../services/data-response';
import {delRoleMsg, addRoleNameError, deleteProdMsg, workbenchLicenseMsg, healthcheckWarningMsg, multiDelRoleError, workbenchLicensesExceededText, noDataFound, noRolesFound, roleEdited, prodAdded, roleAdded, noEndCustomerFound, addRoleDashboardLicenseError, changeAlert, selectExplorerDataDurationMsg} from '../../shared/message';
import {page, pageSize, toastTypes, pageValue, smsize, toastDelay} from '../../shared/global';
import { User} from './../../admin/user/model';
import { UserTrackingService } from '../../services/admin/user-tracking.service';
import * as _ from 'lodash';
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
import {roleFeatures, tfa, roleNameRegex, selectallflag, fieldLength, defaultSort, addRoleFormLabel, roleListTableLabel, featureKeys, roleCategory, adminRoleName, addRoleModalHeader, editRoleModalHeader, addProdModalHeader, roleType, delType, roleFormMode, tableauUsertype, roleFilterArray, ReportTitle, viewerPermission, TableauSiteRoleFeaturesMap, explorerDataRestrictionOptions, roleNameHelpText} from './global';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { isDefined } from '@angular/compiler/src/util';
import {onscreen} from '../../shared/onscreen';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  roleList: Array<ROLEITEM>;
  roleNameRegex = roleNameRegex;
  adminRole: ROLEITEM;
  roleLicensingErorrMsg: string = "";
  availableFeatureData: Array<FORMFEATUREDATA> = [];
  persistantSorting: SortEvent = defaultSort as SortEvent;
  selectedFormFeatureData: Array<FORMFEATUREDATA> = [];
  featGrp: Array<ROLEGRP>;
  isSelectAll : boolean;
  noRolesFound = noRolesFound;
  noDataFound = noDataFound;
  loading: boolean;
  addRoleMps:['','',''];
  filterEnabledCount: number;
  noEndCustomerFound = noEndCustomerFound;
  modalHeader: string;
  selectedCount: number = 0;
  editRoleMode: boolean;
  searchText: string = '';
  selectallflag = selectallflag;
  searchNameText: string = '';
  allSelectedFlag: boolean = false;
  csvData: Array<object>;
  addProdMode: boolean;
  filterEnabled: boolean = false;
  smsize = smsize;
  defaultPageSize = pageSize;
  TwoAuth: boolean;
  showFilter: boolean;
  tfaChanged: boolean = false;
  roleNameFilterSearch: string = '';
  roleFilterArray = roleFilterArray;
  selectedFormFeatureDataName: string;
  pageValue = pageValue;
  editRoleFeatureOld: Array<string>;
  expandFeatureAll: boolean = true;
  licenseError: boolean = false;
  formProdFeature: Array<FEATURE>;
  healthcheckWarningMsg = healthcheckWarningMsg;
  workbenchLicensesExceededText = workbenchLicensesExceededText;
  workbenchLicenseMsg = workbenchLicenseMsg;
  submitted = false;
  page = page;
  delType = delType;
  roleFormMode = roleFormMode;
  roleListTableLabel = roleListTableLabel;
  addRoleFormLabel = addRoleFormLabel;
  pageSize= pageSize;
  defaultFeat: string;
  addEditRoleForm:FormGroup;
  explorerDateRangeForm: FormGroup;
  addProdRoleItem:ROLEITEM;
  editRoleItem:ROLEITEM;
  roleTypeLabel = roleType;
  PaginationReset: boolean = false;
  disableForm: boolean;
  iscreatorenabled: boolean;
  addRoleNameError = addRoleNameError;
  iscreatorcust: boolean = false;
  isviewercust: boolean = false;
  fieldLength = fieldLength;
  addRolePrefix: string;
  tfa = tfa;
  defaultSort=defaultSort;
  isTableauConfigured:boolean = false;
  exploreDataRestrictionOptions = explorerDataRestrictionOptions;
  oldExplorerDateRange = {};
  roleNameHelpText = roleNameHelpText;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  mps = [undefined,undefined,undefined];
  
  constructor(public onscreenConst:onscreen, private adminService: AdminService, private UserTrackingService: UserTrackingService,  private modalService: NgbModal, private formBuilder:FormBuilder, private toast:ToastService, private router: Router) {
    try {
      this.mps = this.adminService.getMPS().split(/:|\//);
    }catch (e){}
 }
  
  
  ngOnInit() {
    this.showFilter = false;
    this.iscreatorenabled = false;
    this.disableForm =false;
    this.defaultFeat = this.adminService.getCookie('default_feature');
    this.featGrp = roleCategory;
    //Get Role Api Response From Service
    this.getRoleList(false);
    this.getCreatorEnabled();
    this.checkIfTableauIsConfiguredForUser();
  }
  isOnscreenenabled() {
    return this.onscreenConst.onscreen;
  }
  helperClick(event:any){
    event.stopPropagation();
  }
  checkIfTableauIsConfiguredForUser(){
    this.adminService.checkIfTableauConfigured().subscribe((data) => {
      this.isTableauConfigured = data;
    })
  }
  getRoleList(reload: boolean) {
    if(this.adminService.userList===undefined){
      this.router.navigate(['/users']);
      return;
    }
    this.selectedCount = 0;
    this.loading = true;
    if(reload || this.adminService.roleList === undefined){
      this.adminService.getRoleList().subscribe((data:any)=>{
        this.loading = false;
        this.iscreatorcust = this.adminService.iscreatorcust;
        this.isviewercust = this.adminService.isviewercust;
        this.roleList = data.Data;
        this.adminRole = this.adminService.adminRole;
        this.populateFilterData();
        this.populateFormFeatureData();
        this.TwoAuth = this.adminService.TwoAuth;
        this.RoleFormReset();
        this.onSort(this.persistantSorting);
        this.resetFilter();
      });
    }else {
      this.loading = false;
      this.roleList = this.adminService.roleList.map((item:ROLEITEM) =>{
        item.selected = false;
        return item;
      });
      this.adminRole = this.adminService.adminRole;
      this.isviewercust = this.adminService.isviewercust;
      this.addRolePrefix = this.adminRole.name.split('_').splice(0,3).join('_');
      this.populateFilterData();
      this.populateFormFeatureData();
      this.TwoAuth = this.adminService.TwoAuth;
      this.RoleFormReset();
      this.onSort(this.persistantSorting);
      this.resetFilter();
    }
  }
  //Populate the feature data for ADD/EDIT/ADD PROD modal
  populateFormFeatureData(){
    this.availableFeatureData = this.adminRole.featureData.map((item:FEATUREDATA) =>{
      let tempObj = {} as FORMFEATUREDATA;
      tempObj.name = item.name;
      tempObj.features = item.features;
      tempObj.mps = item.mps;
      tempObj.selected = false;
      tempObj.expand = true;
      tempObj.featureKey = item.featureKey;
      tempObj.mpsstring = item.mps.join("/");
      let features = tempObj.features.split(",");
      tempObj.isExplorerEnabled = item.isExplorerEnabled;
      tempObj.explorerDateRange = item.explorerDateRange;
      tempObj.featureDisplay = _.cloneDeep(roleFeatures.filter((item:FEATURE) => item.value != featureKeys.admin));
      for(let j=0;j<tempObj.featureDisplay.length;j++){
        if(tempObj.featureKey.indexOf(tempObj.featureDisplay[j].value) === -1){
          tempObj.featureDisplay[j].disabled = true;
        }else {
          tempObj.featureDisplay[j].disabled = false;
        }
      }
      return tempObj;
    });
  }
  clearSelectedProduct(){
    for(let i=0;i<this.availableFeatureData.length;i++){
      this.availableFeatureData[i].selected = false;
    }
    this.onProdChange(null);
  }
  //Feature Panel Expand Function ALL
  featureExpandToggle(){
    this.expandFeatureAll = !this.expandFeatureAll;
    for(let i=0;i<this.selectedFormFeatureData.length;i++){
      this.selectedFormFeatureData[i].expand = this.expandFeatureAll;
    }
  }
  //Single Feature Expand
  expandFeatureSingle(ind: number){
    for(let i=0;i<this.selectedFormFeatureData.length;i++){
      if(i===ind){
        this.selectedFormFeatureData[i].expand = !this.selectedFormFeatureData[i].expand;
      }else {
        this.selectedFormFeatureData[i].expand = true;
      }
    }
  }
  getFilterRoleData() {
    return this.roleFilterArray[3].data.filter(item => {
      if(this.roleNameFilterSearch.length >= fieldLength.min && this.roleNameFilterSearch !== ''){
        return (item.name.indexOf(this.roleNameFilterSearch) !== -1 || item.selected);
      }else {
        return item.selected;
      }
    })
  }
  getFeatureSelected(feat:FORMFEATUREDATA) {
    return feat.featureDisplay.filter((item:FEATURE) => {return item.checked;}).length;
  }
  populateFilterData() {
    //Populate Product Name Filter Data
    this.roleFilterArray[1].data = [];
    for(let i=0;i<this.adminRole.featureData.length;i++){
      let tempObj = {name: '', selected: false, value: ''};
      tempObj = {name: '', selected: false, value: ''};
      tempObj.name = this.adminRole.featureData[i].name;
      this.roleFilterArray[1].data.push(tempObj);
    }
    //Populate Role Name Filter Data
    this.roleFilterArray[3].data = this.roleList.map((item:ROLEITEM) => {
      let tempNameObj = {name: '', selected: false, value: ''};
      tempNameObj.name = item.DisName;
      return tempNameObj;
    });
    //Populate Explorer Data Restriction Filter Data
    this.roleFilterArray[4].data = this.exploreDataRestrictionOptions.map((item) => {
      let tempNameObj = {name: '', selected: false, value:''};
      tempNameObj.name = item.name;
      tempNameObj.value = item.value;
      return tempNameObj;
    });
    //Populate Feature Filter Data
    let tempArray = [];
    for(let i=0;i<this.adminRole.featureData.length;i++){
      tempArray = tempArray.concat(this.adminRole.featureData[i].featuresDis);
    }
    tempArray = _.uniqBy(tempArray, (e) => {
      return e;
    })
    this.roleFilterArray[2].data = [];
    for(let i=0;i<roleFeatures.length;i++){
      let tempObj = {name: '', selected: false, value: ''};
      tempObj = {name: '', selected: false, value: ''};
      if(tempArray.indexOf(roleFeatures[i].name) !== -1){
        tempObj.name = roleFeatures[i].name;
        this.roleFilterArray[2].data.push(tempObj);
      }
    }
  }
  resetFilter() {
    for(let i=0;i<this.roleFilterArray.length;i++){
      for(let j=0;j<this.roleFilterArray[i].data.length;j++){
        this.roleFilterArray[i].data[j].selected = false;
      }
      this.roleFilterArray[i].enabled = false;
      this.roleFilterArray[i].enabledCount = 0;
    }
    this.roleNameFilterSearch = '';
    this.filterEnabled = false;
    this.filterEnabledCount = 0;
    this.PaginationReset = true;
  }
  getCreatorEnabled() {
    this.loading = true;
    this.adminService.get(api.realminfo+ this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe((data: DataResponse) => {
      if((data.Data[0].vertica_port !== '' && data.Data[0].vertica_port !== 'NA') && (data.Data[0].vertica_pwd !== '' && data.Data[0].vertica_pwd !== 'NA') && (data.Data[0].vertica_server !== '' && data.Data[0].vertica_server !== 'NA') && (data.Data[0].vertica_user !== '' && data.Data[0].vertica_user !== '')) {
        this.iscreatorenabled = true;
      }
      this.loading = false;
    });
  }
  //Create CSV data and send it to admin service for download
  exportCSVFile(){
    var data = _.cloneDeep(this.roleList);
    for(let i=0;i<data.length;i++){
      delete(data[i].colapsed);
      delete(data[i].featuresAssigned);
      delete(data[i].mps_isdomain);
      delete(data[i].mps_uidomain);
      delete(data[i].prodAssigned);
      delete(data[i].selected);
      data[i].name = data[i].DisName;
      delete(data[i].DisName);
      delete(data[i].realm_uidomain);
      data[i]["Role Type"] = data[i].roleType;
      delete(data[i].roleType);
      data[i]["Product & Features"] = '';
      for (let j = 0; j < data[i].featureData.length; j++) {
        data[i]["Product & Features"] = data[i]["Product & Features"] + data[i].featureData[j].name + " : " + data[i].featureData[j].features + "\n";
      }
      delete(data[i].featureData);
    }
    this.csvData = data;
    this.adminService.downloadCSVFile(data, ReportTitle);
  }
  updateFilter(data: any, ind: number){
    if(data.columnName === roleFilterArray[0].columnName){
      for(let i=0; i<this.roleFilterArray[0].data.length; i++){
        if(i !== ind){
          this.roleFilterArray[0].data[i].selected = false;
        }
      }
    }
    for(let i=0;i<this.roleFilterArray.length;i++){
      for(let j=0;j<this.roleFilterArray[i].data.length;j++){
        if(this.roleFilterArray[i].data[j].selected){
          this.roleFilterArray[i].enabled = true;
          break;
        }else{
          this.roleFilterArray[i].enabled = false;
        }
      }
      this.roleFilterArray[i].enabledCount = this.roleFilterArray[i].data.filter(item => {return item.selected;}).length;
    }
    this.filterEnabledCount = this.roleFilterArray.filter(item => {return item.enabled;}).length;
    if(this.filterEnabledCount==0){
      this.filterEnabled = false;
      this.PaginationReset = false;
    }else {
      this.filterEnabled = true;
      this.PaginationReset = true;
    }
    if(this.getRoleListFiltered().length+this.defaultPageSize<=this.pageSize){
      this.pageSize = this.pageValue[0];
    }
  }

  get f() { return this.addEditRoleForm.controls; }
  get e() { return this.explorerDateRangeForm.controls; }
  allRoleSelected() {
    let flag = false;
    let count = 0;
    for(let i = 0; i<this.getCollectionLength();i++){
      if(this.getRoleListFiltered()[i+((this.page-1)*this.pageSize)].selected || this.getRoleListFiltered()[i+((this.page-1)*this.pageSize)].name === this.adminRole.name){
        count++;
      }
    }
    if(count === this.getCollectionLength()){
      flag = true;
    }
    if(count === 1 && this.getRoleListFiltered()[0].name === this.adminRole.name){
      flag=false;
    }
    this.isSelectAll = flag;
    return flag;
  }
  roleToggleSelect() {
    this.selectedCount = 0;
    this.isSelectAll = !this.isSelectAll;
    for(let i = 0; i<this.getCollectionLength();i++){
      if(this.getRoleListFiltered()[i+((this.page-1)*this.pageSize)].name != this.adminRole.name){
        this.getRoleListFiltered()[i+((this.page-1)*this.pageSize)].selected = this.isSelectAll;
        if(this.getRoleListFiltered()[i+((this.page-1)*this.pageSize)].selected){
          this.selectedCount++;
        }
      }
    }
    this.updateSelectAllValue();
  }
  getRoleListLength(){
    return this.getRoleListFiltered().filter((item:ROLEITEM) => {return item.name !== this.adminRole.name}).length;
  }
  selectAcrossPages() {
    //Select all roles regardless of pagination
    this.selectedCount = 0;
    this.allSelectedFlag = true;
    for(let i=0; i<this.getRoleListFiltered().length;i++){
      if(this.getRoleListFiltered()[i].name != this.adminRole.name){
        this.getRoleListFiltered()[i].selected = true;
        if(this.getRoleListFiltered()[i].selected){
          this.selectedCount++;
        }
      }
    }
  }
  clearSelection() {
    //Unselect all roles regardless of pagination
    this.selectedCount = 0;
    for(let i=0; i<this.roleList.length;i++){
      if(this.roleList[i].name != this.adminRole.name){
        this.roleList[i].selected = false;
      }
    }
  }
  getLicensingInfo() {
    let retdata = {
      msg:"",
      flag:false
    }
    if(this.selectedFormFeatureData.length==0 && !this.addProdMode){
      return retdata;
    }else {
      let selectedFeatures:Array<string> = [];
      if(this.editRoleMode){
        this.editRoleItem.featureData.map(item => {
          if(item.name !== this.selectedFormFeatureData[0].name) {
            selectedFeatures = selectedFeatures.concat(item.featuresDis);
          }
        })    
      }
      if(this.addProdMode){
        selectedFeatures = this.addProdRoleItem.featuresAssigned;
      }
      this.selectedFormFeatureData.map(item => {
        let tempArray = item.featureDisplay.map(item1 => {
          if(item1.checked) {
            return item1.name;
          }else{
            return ""
          }
        });
        selectedFeatures = selectedFeatures.concat(tempArray);
        selectedFeatures = _.uniq(selectedFeatures);
      });
      if(selectedFeatures.indexOf(roleFeatures[1].name) != -1 && selectedFeatures.indexOf(roleFeatures[3].name) == -1 && selectedFeatures.indexOf(roleFeatures[4].name) == -1 && this.isviewercust){
        retdata.flag = true;
        retdata.msg = addRoleDashboardLicenseError.dashboards;
      }else if(selectedFeatures.indexOf(roleFeatures[1].name) != -1 && selectedFeatures.indexOf(roleFeatures[3].name) != -1 && selectedFeatures.indexOf(roleFeatures[4].name) == -1){
        retdata.flag = true;
        retdata.msg = addRoleDashboardLicenseError.workbench;
      }else if(selectedFeatures.indexOf(roleFeatures[1].name) != -1 && selectedFeatures.indexOf(roleFeatures[3].name) != -1 && selectedFeatures.indexOf(roleFeatures[4].name) != -1){
        retdata.flag = true;
        retdata.msg = addRoleDashboardLicenseError.creator;
      }
      return retdata;
    }
  }
  //Returns List of roles based on filter and search input
  getRoleListFiltered() {
    //If Filters are not applied and search is empty return the unfiltered list
    if(this.searchText.length < this.fieldLength.min && !this.filterEnabled){
      if(this.PaginationReset){
        this.page = 1;
        this.PaginationReset = false;
      }
      return this.roleList;
    }else {
      //If Filters are applied
      let tempRoleList = this.roleList;
      for(let i=0;i<this.roleFilterArray.length;i++){
        //Type Filter
        if(this.roleFilterArray[i].columnName === roleFilterArray[0].columnName && this.roleFilterArray[i].enabled){
          tempRoleList = tempRoleList.filter((item: ROLEITEM) => {
            for(let j=0;j<this.roleFilterArray[i].data.length;j++){
              if(this.roleFilterArray[i].data[j].selected){
                //Include the item if Role type matches the selected Type filter [Internal/External]
                return item.roleType === this.roleFilterArray[i].data[j].name;
              }
            }
          })
        }
        //Product Name Filter
        if(this.roleFilterArray[i].columnName === roleFilterArray[1].columnName && this.roleFilterArray[i].enabled){
          tempRoleList = tempRoleList.filter((item:ROLEITEM) => {
            let compareArray = []; //This will store the selected product names
            for(let j=0; j<this.roleFilterArray[i].data.length;j++){
              if(this.roleFilterArray[i].data[j].selected){
                compareArray.push(this.roleFilterArray[i].data[j].name)
              }
            }
            //Return true if all the items in comparearray are present in list of product assigned to the role.
            return compareArray.every(v => item.prodAssigned.includes(v));
          })
        }
        //Feature Filter
        if(this.roleFilterArray[i].columnName === roleFilterArray[2].columnName && this.roleFilterArray[i].enabled){
          tempRoleList = tempRoleList.filter((item:ROLEITEM) => {
            let compareArray = []; //This will store the selected features in the filter list
            for(let j=0; j<this.roleFilterArray[i].data.length;j++){
              if(this.roleFilterArray[i].data[j].selected){
                compareArray.push(this.roleFilterArray[i].data[j].name)
              }
            }
            //Returns true if all the features are assigned to the role in any product
            return compareArray.every(v => item.featuresAssigned.includes(v));
          })
        }
        //Explorer Data Restriction Filter
        if(this.roleFilterArray[i].columnName === roleFilterArray[4].columnName && this.roleFilterArray[i].enabled){
          tempRoleList = tempRoleList.filter((item:ROLEITEM) => {
            let compareArray = []; //This will store the selected product names
            for(let j=0; j<this.roleFilterArray[i].data.length;j++){
              if(this.roleFilterArray[i].data[j].selected){
                if(this.roleFilterArray[i].data[j].value !== 'all'){
                  compareArray.push(parseInt(this.roleFilterArray[i].data[j].value))
                }else{
                  compareArray.push(this.roleFilterArray[i].data[j].value)
                }
              }
            }
            var vals = [];
            item.featureData.map((featureItem) => {
              if(featureItem.featuresDis.indexOf('Explorer') > -1){
                if(featureItem.explorerDateRange === undefined){
                  featureItem.explorerDateRange = 'all';
                }
                vals.push(featureItem.explorerDateRange);
              }
            })
            return compareArray.every(v => vals.includes(v));
          })
        }
        if(this.roleFilterArray[i].columnName === roleFilterArray[3].columnName && this.roleFilterArray[i].enabled){
          tempRoleList = tempRoleList.filter((item:ROLEITEM) => {
            let compareArray = [];
            for(let j = 0; j<this.roleFilterArray[i].data.length;j++){
              if(this.roleFilterArray[i].data[j].selected){
                compareArray.push(this.roleFilterArray[i].data[j].name);
              }
            }
            return (compareArray.indexOf(item.DisName) !== -1);
          })
        }
      }
      if(this.searchText.length >= this.fieldLength.min){
        tempRoleList = tempRoleList.filter((item:ROLEITEM) => {
          let flag=false;
          for(let i=0;i<item.featureData.length;i++){
            if(item.featureData[i].name.toLowerCase().indexOf(this.searchText.toLowerCase()) === 0 || item.DisName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || item.featureData[i].features.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || item.roleType.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1){
              flag = true;
            }
          }
          return flag;
        })
      }
      if(this.PaginationReset){
        this.page = 1;
        this.PaginationReset = false;
      }
      if(tempRoleList.length+this.defaultPageSize<=this.pageSize){
        this.pageSize = this.pageValue[0];
      }
      return tempRoleList;
    }
  }
  rolePageChanged() {
    this.allRoleSelected();
  }
  getSelectedCount() {
    let count = 0
    for (let i = 0; i < this.roleList.length; i++) {
      if (this.roleList[i].selected) {
        count++;
      }
    }
    return count;
  }
  updateSelectAllValue() {
    this.selectedCount = this.getSelectedCount();
    this.allSelectedFlag = this.getSelectedCount() == this.roleList.length ? true : false;
  }
  //This function creates and reset modal form
  RoleFormReset() {
    this.featGrp[0].alert = "";
    this.addEditRoleForm = this.formBuilder.group({
      roleName: ['', [Validators.required, Validators.maxLength(this.fieldLength.max), Validators.minLength(this.fieldLength.min)]],
      prodName: ['', Validators.required],
      roleType: false
    });
    this.selectedFormFeatureData = [];
    this.expandFeatureAll = true;
    this.populateFormFeatureData();
    this.submitted = false;
    this.addEditRoleForm.clearValidators();
    this.licenseError = false;
    this.disableForm = false;
    this.tfaChanged = false;
    this.tfa.fields = this.tfa.fields.map(item =>{
      if(item.label === tfa.default && this.TwoAuth){
        item.checked = true;
      }else {
        item.checked = false;
      }
      return item;
    })
  }
  //Select Healthcheck feature only on external role
  isExternalRole() {
    if(!this.addProdMode){
      this.addEditRoleForm.controls["roleType"].setValue(!this.addEditRoleForm.value.roleType);
    }
    if(this.addEditRoleForm.value.roleType){
      for(let i=0;i<this.availableFeatureData.length;i++){
        if(this.availableFeatureData[i].featureKey.indexOf(roleFeatures[10].value) === -1){
          this.availableFeatureData[i].disabled = true;
        }else {
          this.availableFeatureData[i].disabled = false;
        }
      }
    }else{
      for(let i=0;i<this.availableFeatureData.length;i++){
        this.availableFeatureData[i].disabled = false;
      }
    }
    this.onProdChange({});
  }
  enableTootip(e, text){
    if(e.target.offsetWidth < e.target.scrollWidth){
      e.target.title = text;
    }
  }
  getUsersEdited(role) {
    return this.adminService.userList.filter(item => {
      if(role){
        return item.roleName === role.DisName;
      }else {
        return item.roleName === this.addEditRoleForm.controls['roleName'].value;
      }
    });
  }
  getUsersAssociated(role) {
    return this.adminService.userList.filter(item => {
      return item.role === role;
    });
  }
  //Same function for Add Role, Edit Role, Add Product
  addRoleSubmit() {
    this.submitted = true;
    let licenseFeature = "Unlicensed";
    let tempProdString = "";
    let feature = [];
    for(let i=0;i<this.selectedFormFeatureData.length;i++){
      tempProdString = tempProdString+this.selectedFormFeatureData[i].name;
    }
    this.addEditRoleForm.controls['prodName'].setValue(tempProdString);
    //Check if workbench permission is added or removed from the role.
    if(this.editRoleMode){
      let oldUserLic = "";
      let tempArrayLic = [];
      for(let i=0; i<this.editRoleItem.featureData.length;i++){
        tempArrayLic = tempArrayLic.concat(this.editRoleItem.featureData[i].featureKey.split(","));
      }
      tempArrayLic = _.uniq(tempArrayLic);
      if(this.isviewercust && tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) === -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        oldUserLic = tableauUsertype.viewer;
      }
      if(!this.isviewercust && tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) === -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        oldUserLic = tableauUsertype.explorer;
      }
      if(tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) !== -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        oldUserLic = tableauUsertype.workbench;
      }
      if(tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) !== -1 && tempArrayLic.indexOf(featureKeys.creator) !== -1) {
        oldUserLic = tableauUsertype.wb_creator;
      }
      let newUserLic = "";
      tempArrayLic = [];
      for(let i=0; i<this.editRoleItem.featureData.length;i++){
        if(this.editRoleItem.featureData[i].name === this.selectedFormFeatureData[0].name){
          for(let j=0;j<this.selectedFormFeatureData[0].featureDisplay.length;j++){
            if(this.selectedFormFeatureData[0].featureDisplay[j].checked){
              tempArrayLic.push(this.selectedFormFeatureData[0].featureDisplay[j].value);
            }
          }
        }else {
          tempArrayLic = tempArrayLic.concat(this.editRoleItem.featureData[i].featureKey.split(","));
        }
      }
      tempArrayLic = _.uniq(tempArrayLic);
      if(this.isviewercust && tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) === -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        newUserLic = tableauUsertype.viewer;
      }
      if(!this.isviewercust && tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) === -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        newUserLic = tableauUsertype.explorer;
      }
      if(tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) !== -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        newUserLic = tableauUsertype.workbench;
      }
      if(tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) !== -1 && tempArrayLic.indexOf(featureKeys.creator) !== -1) {
        newUserLic = tableauUsertype.wb_creator;
      }
      let usersEdited = this.getUsersEdited('');
      if(newUserLic === tableauUsertype.wb_creator && oldUserLic !== tableauUsertype.wb_creator && usersEdited.length > (this.adminService.licensesData.maxCreatorLicenses-this.adminService.licensesData.creatorLicensesUsed)){
        this.licenseError = true;
        this.roleLicensingErorrMsg = this.workbenchLicensesExceededText.creator;
        return;
      }
      if(newUserLic === tableauUsertype.workbench && oldUserLic !== tableauUsertype.workbench && usersEdited.length > (this.adminService.licensesData.maxWBLicenses-this.adminService.licensesData.workbenchLicensedUsed)){
        this.licenseError = true;
        this.roleLicensingErorrMsg = this.workbenchLicensesExceededText.workbench;
        return;
      }
      if(newUserLic === tableauUsertype.viewer && oldUserLic !== tableauUsertype.viewer && usersEdited.length > (this.adminService.licensesData.maxViewerLicenses-this.adminService.licensesData.viewerLicensesUser)){
        this.licenseError = true;
        if(this.adminService.licensesData.maxViewerLicenses == 0){
          this.roleLicensingErorrMsg = this.workbenchLicensesExceededText.viewerZero;
        }else {
          this.roleLicensingErorrMsg = this.workbenchLicensesExceededText.viewer;
        }
        return;
      }
      feature = this.selectedFormFeatureData[0].featureDisplay.filter((item:FEATURE) =>{return item.checked}).map((item:FEATURE) => {return item.value});
      if(feature.indexOf(featureKeys.dashboards) !== -1 && feature.indexOf(featureKeys.workbench) === -1 && feature.indexOf(featureKeys.creator) === -1) {
        if(this.isviewercust) {
          licenseFeature = viewerPermission;
        }else {
          licenseFeature = featureKeys.explorer;
        }
      }else if(feature.indexOf(featureKeys.dashboards) !== -1 && feature.indexOf(featureKeys.workbench) !== -1 && feature.indexOf(featureKeys.creator) === -1){
        licenseFeature = featureKeys.workbench;
      }else if(feature.indexOf(featureKeys.dashboards) !== -1 && feature.indexOf(featureKeys.workbench) !== -1 && feature.indexOf(featureKeys.creator) !== -1) {
        licenseFeature = featureKeys.creator;
      }
    }
    if(this.addProdMode){
      let oldUserLic = "";
      let tempArrayLic = [];
      for(let i=0; i<this.addProdRoleItem.featureData.length;i++){
        tempArrayLic = tempArrayLic.concat(this.addProdRoleItem.featureData[i].featureKey);
      }
      tempArrayLic = _.uniq(tempArrayLic);
      if(this.isviewercust && tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) === -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        oldUserLic = tableauUsertype.viewer;
      }
      if(!this.isviewercust && tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) === -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        oldUserLic = tableauUsertype.explorer;
      }
      if(tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) !== -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        oldUserLic = tableauUsertype.workbench;
      }
      if(tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) !== -1 && tempArrayLic.indexOf(featureKeys.creator) !== -1) {
        oldUserLic = tableauUsertype.wb_creator;
      }
      let newUserLic = "";
      tempArrayLic = [];
      for(let i=0;i<this.selectedFormFeatureData.length;i++){
        for(let j=0;j<this.selectedFormFeatureData[i].featureDisplay.length;j++){
          if(this.selectedFormFeatureData[i].featureDisplay[j].checked){
            tempArrayLic.push(this.selectedFormFeatureData[i].featureDisplay[j].value);
          }
        }
      }
      tempArrayLic = _.uniq(tempArrayLic);
      if(this.isviewercust && tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) === -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        newUserLic = tableauUsertype.viewer;
      }
      if(!this.isviewercust && tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) === -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        newUserLic = tableauUsertype.explorer;
      }
      if(tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) !== -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        newUserLic = tableauUsertype.workbench;
      }
      if(tempArrayLic.indexOf(featureKeys.dashboards) !== -1 && tempArrayLic.indexOf(featureKeys.workbench) !== -1 && tempArrayLic.indexOf(featureKeys.creator) === -1) {
        newUserLic = tableauUsertype.wb_creator;
      }
      let usersEdited = this.getUsersEdited('');
      if(newUserLic === tableauUsertype.wb_creator && (oldUserLic == "" || oldUserLic === tableauUsertype.workbench || oldUserLic === tableauUsertype.explorer || oldUserLic === tableauUsertype.viewer) && usersEdited.length > (this.adminService.licensesData.maxCreatorLicenses-this.adminService.licensesData.creatorLicensesUsed)){
        this.licenseError = true;
        this.roleLicensingErorrMsg = this.workbenchLicensesExceededText.creator;
        return;
      }
      if(newUserLic === tableauUsertype.workbench && (oldUserLic == "" || oldUserLic === tableauUsertype.explorer || oldUserLic === tableauUsertype.viewer) && usersEdited.length > (this.adminService.licensesData.maxWBLicenses-this.adminService.licensesData.workbenchLicensedUsed)){
        this.licenseError = true;
        this.roleLicensingErorrMsg = this.workbenchLicensesExceededText.workbench;
        return;
      }
      if(newUserLic === tableauUsertype.viewer && this.isviewercust && (oldUserLic == "") && usersEdited.length > (this.adminService.licensesData.maxViewerLicenses-this.adminService.licensesData.viewerLicensesUser)){
        this.licenseError = true;
        this.roleLicensingErorrMsg = this.workbenchLicensesExceededText.viewer;
        return;
      }
    }
    //Check if role already exists while adding a role. Set error for form if it already exists. Skip it for Edit Role, Add Product
    if(this.adminService.getRoleListArray().map(item => {return item.disName.toLowerCase()}).indexOf(this.addEditRoleForm.value.roleName.toLowerCase()) != -1 && !this.addProdMode &&  !this.editRoleMode){
      this.addEditRoleForm.controls['roleName'].setErrors({'duplicate':true});
    }
    if (!this.addEditRoleForm.value.roleName.toLowerCase().replace(/\s/g, '').length) {
      this.addEditRoleForm.patchValue({
        roleName: ""
      });
      this.addEditRoleForm.controls['roleName'].setErrors({'required':true});
    }
    if (this.addEditRoleForm.invalid) {
        document.getElementById('addEditRoleForm').scrollIntoView();
        return;
    }
    this.loading = true;
    this.modalService.dismissAll();
    if(this.addProdMode){
      let tempAvailableFeature = _.cloneDeep(this.availableFeatureData);
      for(let i=0; i<tempAvailableFeature.length;i++){
        for(let j=0;j<this.addProdRoleItem.featureData.length;j++){
          if(this.addProdRoleItem.featureData[j].name === tempAvailableFeature[i].name){
            for(let k=0;k<tempAvailableFeature[i].featureDisplay.length;k++){
              if(this.addProdRoleItem.featureData[j].featureKey.indexOf(tempAvailableFeature[i].featureDisplay[k].value) !== -1){
                tempAvailableFeature[i].featureDisplay[k].checked = true;
                let featurekeys = tempAvailableFeature[i].features.split(",");
                if(featurekeys.indexOf('Explorer') > -1){
                  tempAvailableFeature[i].isExplorerEnabled = true;
                }
                tempAvailableFeature[i].explorerDateRange = this.addProdRoleItem.featureData[j].explorerDateRange;
              }
            }
            this.selectedFormFeatureData.push(tempAvailableFeature[i]);
          }
        }
      }
    }
    if(this.editRoleMode){
      let tempAvailableFeature = _.cloneDeep(this.availableFeatureData);
      for(let i=0; i<this.availableFeatureData.length;i++){
        for(let j=0;j<this.editRoleItem.featureData.length;j++){
          if(this.editRoleItem.featureData[j].name === this.availableFeatureData[i].name && this.addEditRoleForm.controls['prodName'].value !== this.availableFeatureData[i].name){
            for(let k=0;k<tempAvailableFeature[i].featureDisplay.length;k++){
              if(this.editRoleItem.featureData[j].featureKey.indexOf(tempAvailableFeature[i].featureDisplay[k].value) !== -1){
                tempAvailableFeature[i].featureDisplay[k].checked = true;
                let featurekeys = tempAvailableFeature[i].features.split(",");
                if(featurekeys.indexOf('Explorer') > -1){
                  tempAvailableFeature[i].isExplorerEnabled = true;
                }
                tempAvailableFeature[i].explorerDateRange = this.editRoleItem.featureData[j].explorerDateRange;
              }
            }
            this.selectedFormFeatureData.push(tempAvailableFeature[i]);
          }
        }
      }
    }
    let tempPramProdArray = [];
    for(let i=0;i<this.selectedFormFeatureData.length;i++){
      let tempProdObj = <any>{};
      tempProdObj.product = this.selectedFormFeatureData[i].mps.join('/');
      tempProdObj.features = this.selectedFormFeatureData[i].featureDisplay.filter((item:FEATURE) =>{return item.checked;}).map((item:FEATURE) => {return item.value}).join(',');
      if(tempProdObj.features.indexOf("dashboards") !== -1 && this.isviewercust) {
        let tempFeatArray = tempProdObj.features.split(",");
        tempFeatArray.push(viewerPermission);
        tempProdObj.features = tempFeatArray.join(); 
      }
      tempProdObj.productName = this.selectedFormFeatureData[i].name;
      if(this.selectedFormFeatureData[i].isExplorerEnabled){
        if(this.selectedFormFeatureData[i].explorerDateRange !== 'all'){
          tempProdObj.explorer_date_range = parseInt(this.selectedFormFeatureData[i].explorerDateRange);
        }
      }
      tempPramProdArray.push(tempProdObj);
    }
    let two_auth_support = [];
    for(let i=0; i<this.tfa.fields.length;i++){
      if(this.tfa.fields[i].checked){
        two_auth_support.push(this.tfa.fields[i].value);
      }
    }
    var param = {
      "roleName":((this.addProdMode) ? this.addProdRoleItem.name  : (this.editRoleMode? this.editRoleItem.name: this.addRolePrefix+"_"+this.addEditRoleForm.value.roleName.toLowerCase())),
      "is_super":false,
      "productFeatures":tempPramProdArray,
      "twoAuth": this.TwoAuth,
      "two_auth_support": two_auth_support,
    }
    this.adminService.post(param, api.addRole+this.adminService.getMfr()).subscribe((response: DataResponse) => {
      let outerMsg = "";
      if(this.editRoleMode) {
      outerMsg = roleEdited.replace("{{roleName}}", this.addEditRoleForm.value.roleName.toLowerCase());
      this.UserTrackingService.userTracking("Admin Panel : Role", "Edit Role", param.roleName+" Edited : ");
      }else if(this.addProdMode) {
        let tempProdNames = this.availableFeatureData.filter((item:FORMFEATUREDATA) => { return item.selected}).map((item:FORMFEATUREDATA) => {return item.name});
	      outerMsg = prodAdded.replace("{{prodName}}", tempProdNames.join(",")).replace("{{roleName}}", this.addEditRoleForm.value.roleName.toLowerCase());
	      this.UserTrackingService.userTracking("Admin Panel : Role", "Add Product", JSON.stringify(param.productFeatures)+" Added to Role : "+param.roleName );
      }else {
        outerMsg = roleAdded.replace("{{roleName}}", this.addEditRoleForm.value.roleName.toLowerCase());
        this.UserTrackingService.userTracking("Admin Panel : Role", "Add Role", param.roleName+" Added");
      }
      //If workbench is added or removed change the role of user in tableau
      if(licenseFeature !== '') {
        let arrayUser = [];
        let userEdited = this.getUsersEdited('');
        for(let i=0; i<tempPramProdArray.length;i++){
          let roleType = this.setTableauUserRoleType(tempPramProdArray[i].features.split(","));
          for(let j=0; j<userEdited.length;j++){
            let tempUser = {
              roleType: "",
              userName: "",
              mps: ""
            }
            tempUser.mps = tempPramProdArray[i].product;
            tempUser.roleType = roleType !== undefined ? roleType : "Unlicensed";
            tempUser.userName = userEdited[j].email;
            arrayUser.push(tempUser);
          }
        }
        if(this.isTableauConfigured){
          this.adminService.post(arrayUser, api.tableauUserRoleUpdate+ this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe((response: DataResponse) => {
          })
        }
        //Show Role Edited message
        this.toast.show(outerMsg, { classname: toastTypes.green, delay: toastDelay });
        this.RoleFormReset();
        //Refresh Data
        this.getRoleList(true);
      }else {
        //Show Role Edited message
        this.toast.show(outerMsg, { classname: toastTypes.green, delay: toastDelay });
        this.RoleFormReset();
        //Refresh Data
        this.getRoleList(true);
      }
    });
  }
  setTableauUserRoleType(features) {
    let tableauUsers = TableauSiteRoleFeaturesMap;
    if(this.isviewercust){
      tableauUsers = tableauUsers.filter(item => {
        return item.site_role !== "Explorer";
      })
    }
    for (let i = 0; i < tableauUsers.length; i++) {
      if (tableauUsers[i].features.length === _.intersection(features, tableauUsers[i].features).length) {
        return tableauUsers[i].site_role;
      }
    }
  }
  checkFeatureDependancy(feature:FEATURE, prod:FORMFEATUREDATA) {
    switch (feature.category){
      case featureKeys.dashboards :{
        if(!prod.featureDisplay.find(item => item.value === featureKeys.dashboards).checked){
          this.featGrp[0].alert = "";
          prod.featureDisplay.find(item => item.value === featureKeys.dashboard_admin).checked = false;
          prod.featureDisplay.find(item => item.value === featureKeys.workbench).checked = false;
          prod.featureDisplay.find(item => item.value === featureKeys.creator).checked = false;
        }else {
          this.featGrp[0].alert = addRoleDashboardLicenseError.dashboards;
        }
      }
      case featureKeys.dashboard_admin :{
        if(!prod.featureDisplay.find(item => item.value === featureKeys.dashboard_admin).checked){
          prod.featureDisplay.find(item => item.value === featureKeys.workbench).checked = false;
          prod.featureDisplay.find(item => item.value === featureKeys.creator).checked = false;
        }
      }
      case featureKeys.workbench :{
        if(!prod.featureDisplay.find(item => item.value === featureKeys.workbench).checked){
          prod.featureDisplay.find(item => item.value === featureKeys.creator).checked = false;
        }else {
          this.featGrp[0].alert = addRoleDashboardLicenseError.workbench;
        }
      }
      case featureKeys.creator :{
        if(prod.featureDisplay.find(item => item.value === featureKeys.creator).checked){
          this.featGrp[0].alert = addRoleDashboardLicenseError.creator;
        }
      }
      case featureKeys.rules_and_alerts :{
        if(!prod.featureDisplay.find(item => item.value === featureKeys.rules_and_alerts).checked){
          prod.featureDisplay.find(item => item.value === featureKeys.rule_creator).checked = false;
        }
      }
    }
  }
  //Custom Disable State For Forms
  getDisabledFeatureState(feature:FEATURE, prod:FORMFEATUREDATA) {
    switch (feature.category){
      case featureKeys.dashboards :{
        if(feature.value === featureKeys.dashboard_admin){
          if(prod.featureDisplay.find(item => item.value === featureKeys.dashboards).checked){
            if(feature.disabled){
              return true;
            }else {
              return false;
            }
          }else {
            return true;
          }
        }
        if(feature.value === featureKeys.workbench){
          if(prod.featureDisplay.find(item => item.value === featureKeys.dashboard_admin).checked){
            if(feature.disabled){
              return true;
            }else {
              return false;
            }
          }else {
            return true;
          }
        }
        if(feature.value === featureKeys.creator){
          if(prod.featureDisplay.find(item => item.value === featureKeys.workbench).checked){
            if(feature.disabled){
              return true;
            }else {
              if(this.iscreatorenabled){
                return false;
              }else {
                return true;
              }
            }
          }else {
            return true;
          }
        }
      }
      case featureKeys.rules_and_alerts: {
        if(feature.value === featureKeys.rule_creator){
          if(prod.featureDisplay.find(item => item.value === featureKeys.rules_and_alerts).checked){
            if(feature.disabled){
              return true;
            }else {
              return false;
            }
          }else {
            return true;
          }
        }
      }
      default: {
        if(feature.disabled){
          return true;
        }else {
          return false;
        }
      }
    }
  }
  //On Change of product dropdown
  onProdChange(prod) {
    this.submitted =false;
    if(prod && !this.editRoleMode && this.addEditRoleForm.controls.roleType.value){
      this.availableFeatureData.map((item) => {
        if(item.name !== prod.name){
          item.selected = false;
        }
      })
    }
    let tempArray = this.availableFeatureData.filter((item:FORMFEATUREDATA) => {
      item.expand = true;
      if(this.addEditRoleForm.value.roleType){
        if(item.featureKey.indexOf(roleFeatures[10].value) === -1){
          item.selected = false;
        }
      }
      return item.selected;
    });
    this.selectedFormFeatureData = _.cloneDeep(tempArray);
    for(let i=0;i<this.selectedFormFeatureData.length;i++){
      if(this.addEditRoleForm.value.roleType){
        this.defaultFeat = roleFeatures[10].value;
        for(let j=0;j<this.selectedFormFeatureData[i].featureDisplay.length;j++){
          if(this.selectedFormFeatureData[i].featureDisplay[j].value === this.defaultFeat){
            this.selectedFormFeatureData[i].featureDisplay[j].checked = true;
            this.selectedFormFeatureData[i].isExplorerEnabled = this.selectedFormFeatureData[i].featureDisplay[j].value === 'explorer' ? true : false;
            this.selectedFormFeatureData[i].explorerDateRange = "all";
          }else{
            this.selectedFormFeatureData[i].featureDisplay[j].checked = false;
            this.selectedFormFeatureData[i].featureDisplay[j].disabled = true;
          }
        }
      }else{
        this.defaultFeat = this.adminService.getCookie('default_feature');
        for(let j=0;j<this.selectedFormFeatureData[i].featureDisplay.length;j++){
          if(this.selectedFormFeatureData[i].featureDisplay[j].value === this.defaultFeat){
            this.selectedFormFeatureData[i].featureDisplay[j].checked = true;
            this.selectedFormFeatureData[i].isExplorerEnabled = this.selectedFormFeatureData[i].featureDisplay[j].value === 'explorer' ? true : false;
            this.selectedFormFeatureData[i].explorerDateRange = "all";
          }else{
            this.selectedFormFeatureData[i].featureDisplay[j].checked = false;
          }
        }
      }
    }
    if(this.selectedFormFeatureData.length>0){
      this.selectedFormFeatureData[0].expand = false;
    }
  }

  //Get Filtered Feature
  getFeatureFiltered(prod: FORMFEATUREDATA, grp: string) {
    return prod.featureDisplay.filter((item:FEATURE) =>{
      return item.category === grp;
    })
  }
  //Open Same Modal for Add Role, Edit Role, Add Product. Make the fields disabled depending on the type
  openModal(content: any, type: string, role:any, prod:any) {
    if(type===roleFormMode.add){ //For Adding a role
      this.modalHeader = addRoleModalHeader;
      this.editRoleMode = false;
      this.addProdMode = false;
    }else if(type===roleFormMode.addProd){ //For Adding a product
      this.modalHeader = addProdModalHeader;
      this.editRoleMode = false;
      this.addProdMode = true;
      this.addEditRoleForm = this.formBuilder.group({
        roleName: [this.addProdRoleItem.DisName, Validators.required],
        prodName: ['', Validators.required],
        roleType: this.addProdRoleItem.roleType===roleType.External
      });
      if(this.addProdRoleItem.roleType===roleType.External){
        this.defaultFeat = featureKeys.healthcheck;
      }
      for(let i=0;i<this.tfa.fields.length;i++){
        if(this.addProdRoleItem.two_auth_support.indexOf(this.tfa.fields[i].value) !== -1){
          this.tfa.fields[i].checked = true;
        }
      }
      this.isExternalRole();
    }else { //For editing a role/product
      let explorer_date_range = '';
      this.editRoleItem = role;
      this.editRoleMode = true;
      this.addProdMode = false;
      this.modalHeader = editRoleModalHeader+role.DisName;
      let mps = prod.mps.join("/");
      this.oldExplorerDateRange = role.explorer_date_range;
      if(role.explorer_date_range[mps]){
        explorer_date_range = role.explorer_date_range[mps].toString();
      }
      if(explorer_date_range === ""){
        explorer_date_range = "all";
      }
      this.addEditRoleForm = this.formBuilder.group({
        roleName: [role.DisName, Validators.required],
        prodName: [prod.name, Validators.required],
        roleType: role.roleType===roleType.External
      });
      for(let i=0;i<this.availableFeatureData.length;i++){
        if(this.availableFeatureData[i].name === prod.name){
          this.availableFeatureData[i].selected = true;
        }
      }
      this.onProdChange(null);
      for(let i=0; i<this.selectedFormFeatureData[0].featureDisplay.length;i++) {
        if(prod.featureKey.indexOf(this.selectedFormFeatureData[0].featureDisplay[i].value) !== -1) {
          this.selectedFormFeatureData[0].featureDisplay[i].checked = true;
          if(prod.featuresDis.indexOf('Explorer') > -1){
            this.selectedFormFeatureData[0].isExplorerEnabled = true;
            this.selectedFormFeatureData[0].explorerDateRange = explorer_date_range;
          }
        }
      }
      this.editRoleFeatureOld = prod.featureKey.split(',');
      for(let i=0;i<this.tfa.fields.length;i++){
        if(this.editRoleItem.two_auth_support.indexOf(this.tfa.fields[i].value) !== -1){
          this.tfa.fields[i].checked = true;
        }
      }
    }
    this.modalService.open(content, {scrollable:true, backdrop:'static', size: 'lg', keyboard:false}).result.then((result) => {
    }, (reason) => {
    });
  }
  getAddRoleBtnStatus() {
    let flag = false;
    if(this.disableForm){
      flag = true;
    }
    if(this.editRoleMode){
      let newFeature: Array<string> = [];
      this.selectedFormFeatureData[0].featureDisplay.map(item => {
        if(item.checked){
          newFeature.push(item.value);
        }
      })
      if(_.isEqual(_.sortBy(newFeature), _.sortBy(this.editRoleFeatureOld)) && !this.tfaChanged){
        flag = true;
      }
      if(this.oldExplorerDateRange[this.selectedFormFeatureData[0].mpsstring] !== parseInt(this.selectedFormFeatureData[0].explorerDateRange)){
        flag = false;
      }
    }else {
      if(this.selectedFormFeatureData.length == 0){
        flag = true;
      }
    }
    return flag;
  }
  closeRoleModal() {
    let tempForm = _.cloneDeep(this.addEditRoleForm);
    let tempFeature = _.cloneDeep(this.selectedFormFeatureData)
    if(!this.editRoleMode && (this.addEditRoleForm.dirty || this.selectedFormFeatureData.length !== 0)){
      const warningModal = this.modalService.open(ConfirmationPopupComponent, { backdrop: 'static', windowClass:"cancelRoleConfirmation" });
      warningModal.componentInstance.msg = changeAlert;
      warningModal.result.then((result) => {
        if (result === 'yesclick') {
          this.submitted = false;
          this.RoleFormReset()
          this.modalService.dismissAll();
        }else {
          this.addEditRoleForm = tempForm;
          this.selectedFormFeatureData = tempFeature;
        }
      });
    }else if(this.editRoleMode){
      let newFeature: Array<string> = [];
      this.selectedFormFeatureData[0].featureDisplay.map(item => {
        if(item.checked){
          newFeature.push(item.value);
        }
      })
      if(!_.isEqual(_.sortBy(newFeature), _.sortBy(this.editRoleFeatureOld))){
        const warningModal = this.modalService.open(ConfirmationPopupComponent, { backdrop: 'static' });
        warningModal.componentInstance.msg = changeAlert;
        warningModal.result.then((result) => {
          if (result === 'yesclick') {
            this.submitted = false;
            this.RoleFormReset()
            this.modalService.dismissAll();
          }else {
            this.addEditRoleForm = tempForm;
            this.selectedFormFeatureData = tempFeature;
          }
        });
      }else {
        this.submitted = false;
        this.RoleFormReset()
        this.modalService.dismissAll()
      }
    }else {
      this.submitted = false;
      this.RoleFormReset()
      this.modalService.dismissAll()
    }
  }
  //Open confirmation page for any action. "yesclick" on clicking yes.
  openConfirmation(type: string, data: any, prod: any) {
    const delModal = this.modalService.open(ConfirmationPopupComponent, {backdrop:'static'});
    if(type===delType.prod){
      if(this.adminService.userList.filter(item => (item.mps_def === prod.mps.join("/") && item.roleName===data.DisName)).length >0){
        const delErrorModal = this.modalService.open(MessagePopupComponent, {backdrop:'static'});
        delErrorModal.componentInstance.msg = "<strong>"+data.DisName+"-"+prod.name+"</strong> "+delRoleMsg.prodDelError+" <strong>"+data.DisName+"-"+prod.name+".</strong>";
        delErrorModal.result.then((result) => {
          if(result==="okclick"){
            this.modalService.dismissAll();
          }
        }); 
        return;
      }else if(data.prodAssigned.length==1) {
        const delErrorModal = this.modalService.open(MessagePopupComponent, {backdrop:'static'});
        delErrorModal.componentInstance.msg = delRoleMsg.prodSingleDelError.replace("{{prodName}}", prod.name).replace("{{roleName}}", data.DisName);
        delErrorModal.result.then((result) => {
          if(result==="okclick"){
            this.modalService.dismissAll();
          }
        }); 
        return;
      }else{
        delModal.componentInstance.msg = delRoleMsg.prodDel+" <strong>"+data.DisName+"-"+prod.name+"</strong>?";
      }
    }
    if(type === delType.role){
      let count =0;
      let delRoleList = [];
      for(let i = 0; i< this.roleList.length;i++){
        if(this.roleList[i].selected){
          count++;
          delRoleList.push(this.roleList[i].name);
        }
      }
      if(count<=1){
        if(this.adminService.userList.filter(item => (delRoleList.indexOf(item.role) >= 0)).length >0) {
          this.modalService.dismissAll();
          const delErrorModal = this.modalService.open(MessagePopupComponent, {backdrop:'static'});
          delErrorModal.componentInstance.msg = delRoleMsg.singleRoleError;
          delErrorModal.result.then((result) => {
            if(result==="okclick"){
              this.modalService.dismissAll();
            }
          });
          return;
        }
        delModal.componentInstance.msg = delRoleMsg.single;
        delRoleList[0]=((data==='') ? delRoleList[0] : data.name);
      }else {
        let associatedUserRoleList = this.adminService.userList.filter(item => (delRoleList.indexOf(item.role) >= 0)).map(item =>{
          return item.role;
        });
        let donDelRole = [];
        delRoleList = delRoleList.filter(item => {
          if(associatedUserRoleList.indexOf(item) == -1) {
            return true;
          }else {
            donDelRole.push(item);
            return false;
          }
        })
        let delRoleMsgNames = delRoleList.map((item: string) => {
          let tempObj = item.split("_");
          tempObj.splice(0, 3);
          return tempObj.join('_');
        })
        if(donDelRole.length===0){
          delModal.componentInstance.msg = delRoleMsg.multiple;
        }else {
          if(delRoleMsgNames.length === 0) {
            this.modalService.dismissAll();
            const delErrorModal = this.modalService.open(MessagePopupComponent, {backdrop:'static'});
            delErrorModal.componentInstance.msg = delRoleMsg.multipleRoleErrorNoDelete;
            delErrorModal.result.then((result) => {
              if(result==="okclick"){
                this.modalService.dismissAll();
              }
            });
            return;
          }else {
            delModal.componentInstance.msg = delRoleMsg.multipleRoleError;
            delModal.componentInstance.listToDisplay = delRoleMsgNames;
          }
        }
      }
      delModal.result.then((result) => {
        if(result==="yesclick"){
          this.adminService.post({}, api.deleteRole+encodeURIComponent(delRoleList.join(','))+"/"+this.adminService.getMfr()).subscribe((response: DataResponse) => {
            this.UserTrackingService.userTracking("Admin Panel : Role", "Delete Role", JSON.stringify(delRoleList)+": Roles Deleted")
            if(type===delType.prod){
              this.toast.show(delRoleMsg.delProdsuccess, { classname: toastTypes.green, id: "prodDeleMsg", delay: toastDelay});  
            }else{
              this.toast.show(delRoleMsg.delsuccess, { classname: toastTypes.green, id: "roleDelMsg", delay: toastDelay});
            }
            this.modalService.dismissAll();
            this.getRoleList(true);
          });
        }
      });   
    }
    if(type ===delType.prod){
      delModal.result.then((result) => {
        if(result==="yesclick"){
          this.adminService.post({}, api.deleteProd+encodeURIComponent(data.name)+"/"+prod.mps[0]+"/"+prod.mps[1]+"/"+prod.mps[2]).subscribe((response: DataResponse) => {
            if(prod.featureKey.indexOf(featureKeys.dashboards) != -1){
              let editedUsers = this.getUsersAssociated(data.name);
              let tempUserArray = [];
              for(let i=0;i<editedUsers.length;i++){
                let tempObjUser = {
                  users: [],
                  mps: ""
                }
                tempObjUser.users = [editedUsers[i].email];
                tempObjUser.mps = prod.mps.join("/");
                tempUserArray.push(tempObjUser);
              }
              let arrayUser = [];
              let userEdited = this.getUsersEdited(data);
              for(let j=0; j<userEdited.length;j++){
                let tempUser = {
                  roleType: "",
                  userName: "",
                  mps: ""
                }
                tempUser.mps = prod.mps.join('/');
                tempUser.roleType = 'Unlicensed';
                tempUser.userName = userEdited[j].email;
                arrayUser.push(tempUser);
              }
              if(this.isTableauConfigured){
                this.adminService.post(arrayUser, api.tableauUserRoleUpdate+ this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe((response: DataResponse) => {
                  this.adminService.post(tempUserArray, api.deleteTableauUser + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2]).subscribe(() => {
                  });
                })
              }
              this.toast.show(delRoleMsg.delProdsuccess.replace("{{prodName}}", prod.name).replace("{{roleName}}", data.DisName), { classname: toastTypes.green, delay: toastDelay});
              this.modalService.dismissAll();
              this.getRoleList(true);
            }else {
              this.toast.show(delRoleMsg.delProdsuccess.replace("{{prodName}}", prod.name).replace("{{roleName}}", data.DisName), { classname: toastTypes.green, delay: toastDelay});
              this.modalService.dismissAll();
              this.getRoleList(true);
            }
          });
        }
      }); 
    }
  }
  disableProd(prod:FEATUREDATA) {
    let flag = false;
    for(let i=0;i<this.addProdRoleItem.featureData.length;i++){
      if(this.addProdRoleItem.featureData[i].name === prod.name){
        flag=true;
      }
    }
    return flag;
  }

  //This will return the length of data on the page for current pagination
  getCollectionLength() {
    let collectionLength = this.getRoleListFiltered().slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    return collectionLength.length;
  }

  //Get disabled state of bottom buttons
  getActionButtonDisable(typ: string) {
    if(typ === delType.role){
      let flag = true;
      for(let i = 0; i<this.getCollectionLength();i++){
        if(this.getRoleListFiltered()[i+((this.page-1)*this.pageSize)].selected){
          flag = false;
        }
      }
      return flag;
    }
    if(typ===this.selectallflag){
      let flag = false;
      if(this.getRoleListFiltered().length===1 && this.getRoleListFiltered()[0].name===this.adminRole.name){
        flag = true;
      }
      return flag;
    }
    if(typ===roleFormMode.addProd){
      let count = 0;
      for(let i = 0; i<this.getCollectionLength();i++){
        if(this.getRoleListFiltered()[i+((this.page-1)*this.pageSize)].selected){
          count++;
          this.addProdRoleItem = this.getRoleListFiltered()[i+((this.page-1)*this.pageSize)];
        }
      }
      if(count === 1 && this.addProdRoleItem.featureData.length != this.adminRole.featureData.length ){
        let remainingProd = [];
        remainingProd = this.adminRole.featureData.filter((item:FEATUREDATA) => {
          for(let i=0; i<this.addProdRoleItem.featureData.length;i++){
            if(this.addProdRoleItem.featureData[i].name === item.name){
              return false;
            }
          }
          return true;
        });
        if(this.addProdRoleItem.roleType==roleType.External){
          return true;
          // for(let i=0;i<remainingProd.length;i++){
          //   if(remainingProd[i].featureKey.indexOf(featureKeys.healthcheck) === -1) {
          //     remainingProd.splice(i,1);
          //     i--;
          //   }  
          // }  
        }
        // if(remainingProd.length == 0){
        //   return true
        // }else {
        //   return false;
        // }
      }else {
        return true;
      }
    }
  }
  //Sorting of data using directive
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    if(this.headers){
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
    }
    this.persistantSorting.column = column;
    this.persistantSorting.direction = direction;
    if (direction === '') {
      this.roleList = this.adminService.roleList;
    } else {
      this.roleList = [...this.adminService.roleList].sort((a, b) => {
        const res = compare(a[column].toLowerCase(), b[column].toLowerCase());
        return direction === 'asc' ? res : -res;
      });
    }
  }

  enableExplorerDropdown(feature:FEATURE, prod:FORMFEATUREDATA) {
    if(feature.value === 'explorer'){
      prod.isExplorerEnabled = feature.checked ? true: false;
      prod.explorerDateRange = 'all'
    }
  }
  
}

