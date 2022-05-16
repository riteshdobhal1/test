import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { AdminService } from './../../services/admin/admin.service'
import { SortableDirective, SortEvent } from '../../shared/directives/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { globalObj, endCustomerFilterArray, timeListFilter, EndCustomerNameRegex, fieldLength, addEndcustomerNameError, defaultSort, noDataFound, endCustomerListTableLabel, sysIdAttributes, groupAttributes, searchIdAttributes, groupSearchAttributes, mockSelectedSysIdData, groupNameHelpText} from '../endcustomer/global'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ConfirmationPopupComponent } from '../../shared/confirmation-popup/confirmation-popup.component';
import { DataResponse } from './../../services/data-response';
import { SYSIDLIST, ENDCUSTOMER } from './model'
import { ToastService } from '../../shared/toast-notification/toast-service.service';
import { page, pageSize, pageValue, smsize, toastTypes, toastDelay, sysIdAttr} from '../../shared/global';
import { MessagePopupComponent } from '../../shared/message-popup/message-popup.component';
import { UserTrackingService } from '../../services/admin/user-tracking.service';
import { Router } from "@angular/router";
import * as api from '../../shared/resource';
import * as moment from 'moment';
import * as messages from '../../shared/message';
import * as _ from 'lodash';
import {onscreen} from '../../shared/onscreen';
import { first } from 'rxjs/operators';



export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
@Component({
  selector: 'app-endcustomer',
  templateUrl: './endcustomer.component.html',
  styleUrls: ['./endcustomer.component.scss'],
})

export class EndcustomerComponent implements OnInit {

  //variables  needs to be moved to global
  endCustomerList: Array<any> = [];
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  page = page;
  pageSize = pageSize;
  sysIdAttr = sysIdAttr;
  closeResult: string;
  collectionSize = 0;
  size = 0;
  loading: boolean
  endCustomerProductList: object;
  isSelectAll: boolean;
  modalHeader: String;
  addEditEndCustForm: FormGroup;
  disableForm: Boolean;
  submitted = false;
  showSysIdDiv = false;
  groupedData: Object = {};
  smsize = smsize;
  defaultPageSize = pageSize;
  selectedSysIds: Array<object> = [];
  sysIdList: Array<object> = [];
  editEndUserMode: boolean = false;
  sysIdsToRemove: Array<any> = [];
  sysidLoading: boolean = false;
  endCustomerNameMap: Array<string> = [];
  largeModalOptions: object = globalObj.modalOptions;
  confirmModalOptions: object = globalObj.confirmModalOptions;
  globalObj = globalObj;
  pageValue = pageValue;
  showFilter: boolean = false;
  endCustomerFilterData = [];
  endCustomerFilterArray = endCustomerFilterArray
  searchText: string = '';
  filterEnabled: boolean = false;
  filterEnabledCount: number;
  filterCount = 0;
  endCustomerListCopy: any;
  noEndCustomerFound = messages.noEndCustomerFound;
  selectedCount: number = 0;
  showSelectNotification: boolean = false;
  allSelectedFlag: boolean = false;
  mps = [undefined, undefined, undefined];
  csvData: Array<object>;
  initialEmpty: boolean = false;
  sysPageSize: number = 200;
  groupPageSize: number = 50;
  pagination = {
    pageSiz: this.sysPageSize,
    startIndex: 0,
    endIndex: this.sysPageSize - 1,
    noOfPages: 0,
    currentPage: 1,
    paginationText: ''
  }
  paginationGroup = {
    pageSiz: this.groupPageSize,
    startIndex: 0,
    endIndex: this.groupPageSize - 1,
    noOfPages: 0,
    currentPage: 1,
    paginationText: ''
  }
  //syssearchtext:string = '';
  totalSysids = 0;
  showSearchBox: boolean = false;
  pages: any;
  groupPages: any;
  shouldCallLoadPages: boolean = true;
  fieldLength = fieldLength;
  addEndcustomerNameError = addEndcustomerNameError;
  defaultSort = defaultSort;
  tempAddSysIdList: Array<object> = [];
  tempRemoveSysIdList: Array<object> = [];
  selectedView = 'device';
  groupDataList: Array<ENDCUSTOMER> = [];
  selectedGroups: Array<ENDCUSTOMER> = [];
  tempAddGroupList: Array<ENDCUSTOMER> = [];
  tempRemoveGroupList: Array<ENDCUSTOMER> = [];
  attributeList: Array<any> = [];
  showDivSearch: boolean = false;
  selectedSearchAttrList: Array<object>;
  lastSelectedRow = {
    rowIndex: 0
  };
  groupListToRemove: Array<any> = [];
  productTooltip: string = "Choose A Product";
  searchsysIdAttributes = searchIdAttributes;
  searchgroupAttributes = groupSearchAttributes;
  sysIdAttributeList = [];
  groupAttributeList = groupAttributes;
  noDataFound = noDataFound;
  endCustomerListTableLabel = endCustomerListTableLabel;
  groupSysIdMap: object = {};
  dataSet: number;
  inSearchView: boolean = false;
  associatedGroupList = [];
  headerText = '';
  groupSubgroupMap: object = {};
  editVals = {
    sysIds: [],
    groups: []
  };
  PaginationReset: boolean = false;
  groupNameHelpText = groupNameHelpText;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private cd: ChangeDetectorRef,
    private UserTrackingService: UserTrackingService,
    private router: Router,
    public onscreenConst:onscreen
  ) {
    try {
      this.mps = this.adminService.getMPS().split(/:|\//);
    } catch (e) { }
  }

  //call when the component loads everytime and after every crud action
  ngOnInit() {
    this.showFilter = false;
    this.getCustList();
    this.fetchNameMap();
    this.resetFormData();
  }

  isOnscreenenabled() {
    return this.onscreenConst.onscreen;
  }
  helperClick(event:any){
    event.stopPropagation();
  }
  //fetch end customer listendCustomerListCopy
  getCustList() {
    this.associatedGroupList = [];
    if(this.adminService.userList===undefined){
      this.router.navigate(['/users']);
      return;
    }
    this.loading = true;
    this.endCustomerProductList = this.processProductList();
    this.adminService.getendCustomerList().subscribe((data) => {
      this.groupedData = this.adminService.groupedDataEndCustomer || [];
      this.endCustomerList = data.Data;

      if (data.Data.length === 0) {
        this.initialEmpty = true;
        this.loading = false;
      }
      else {
        this.initialEmpty = false;
        this.endCustomerList.map((endCust, index) => {
          // NOTE: Mock data - remove this when API is ready
          if(endCust.group_name){
            endCust.group_name = endCust.group_name.length ? endCust.group_name : [];
            endCust.group_name.map((group) => {
              this.associatedGroupList.push(group.toLowerCase());
              this.associatedGroupList = _.uniq(this.associatedGroupList);
            })
          }
          this.groupSubgroupMap[endCust.endcustomer_name] = endCust.group_name;
          this.groupSysIdMap[endCust.endcustomer_name] = endCust.serial_number;
          var product = `${endCust.mfr}/${endCust.prod}/${endCust.sch}`;
          endCust.product = this.getKeyByValue(this.endCustomerProductList, product);
        });
        this.collectionSize = this.endCustomerList.length;
        this.size = 0;
        this.onSort(defaultSort as SortEvent);
        this.endCustomerListCopy = _.cloneDeep(this.endCustomerList);
        this.resetFilter();
        this.populateFilterData();
        this.loading = false;
        this.selectedCount = 0;
      }
    });
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  processProductList() {
    var tempobj = {}
    this.adminService.adminRole.featureData.map((item) => {
      tempobj[item.name] = item.mps.toString().replace(/,/g, '/')
    });
    return tempobj;
  }

  fetchGroupData() {
    this.groupedData = this.adminService.groupedDataEndCustomer || [];
  }

  fetchNameMap() {
    this.endCustomerNameMap = this.adminService.getEndCustomerNameMap();
  }

  //filter logic
  populateFilterData() {
    this.endCustomerFilterData = [];
    for (let i = 0; i < endCustomerFilterArray.length; i++) {
      endCustomerFilterArray[i].data = [];
    }
    this.endCustomerFilterData = this.adminService.getFilterObj(this.endCustomerList, endCustomerFilterArray);
  }
  enableTootip(e, text) {
    if (e.target.offsetWidth < e.target.scrollWidth) {
      e.target.title = text;
    }
  }

  getEndcustomerListFiltered() {
    let tempEndCustomerList = this.endCustomerList;
    //this.searchText = this.searchText.toLowerCase();
    if (this.searchText.length === 0) {
      if (this.PaginationReset) {
        this.page = 1;
        this.PaginationReset = false;
      }
      return this.endCustomerList;
    }
    if (this.searchText.length >= 3) {
      tempEndCustomerList = tempEndCustomerList.filter((item, i) => {
        return item.endcustomer_name.toLowerCase().includes(this.searchText.toLowerCase() ||
          item.created_by.toLowerCase().includes(this.searchText.toLowerCase()) ||
          this.matchSerialNum(item.serial_number, this.searchText.toLowerCase()) ||
          this.matchGroupName(item.group_name, this.searchText.toLowerCase()))
      })
    }
    if (this.PaginationReset) {
      this.page = 1;
      this.PaginationReset = false;
    }
    if(tempEndCustomerList.length+this.defaultPageSize<=this.pageSize){
      this.pageSize = this.pageValue[0];
    }
    return tempEndCustomerList;
  }

  matchSerialNum(strArray, str) {
    for (var j = 0; j < strArray.length; j++) {
      if (strArray[j].toLowerCase().includes(str.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  matchGroupName(groupArray, str) {
    for (var j = 0; j < groupArray.length; j++) {
      if (groupArray[j].toLowerCase().includes(str.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  getFilterData(filter) {
    let tmpFilterList = _.cloneDeep(filter.data);
    if (filter.searchText.length < 3) {
      return [];
    }
    if (filter.searchText.length >= 3) {
      tmpFilterList = filter.data.filter((item) => {
        return item.name.toLowerCase().includes(filter.searchText.toLowerCase());
      })
    }
    return tmpFilterList;
  }


  //select all check
  allEndCustSelected() {
    for (let i = 0; i < this.getCollectionLength(); i++) {
      if (!this.getEndcustomerListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
        this.updateSelectAllValue();
        this.isSelectAll = false;
        return false;
      }
    }
    this.updateSelectAllValue();
    this.isSelectAll = true;
    this.getActionButtonDisable(globalObj.delMultipleButton);
    return true;
  }

  //togglecheckbox selection
  endCustToggleSelect() {
    this.selectedCount = 0;
    this.isSelectAll = !this.isSelectAll;
    for (let i = 0; i < this.getCollectionLength(); i++) {
      this.getEndcustomerListFiltered()[i + ((this.page - 1) * this.pageSize)].selected = this.isSelectAll;
      if (this.getEndcustomerListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
        this.selectedCount++;
      }
    }
    this.updateSelectAllValue();
  }

  selectAcrossPages() {
    //Select all roles regardless of pagination
    this.allSelectedFlag = true
    for (let i = 0; i < this.getEndcustomerListFiltered().length; i++) {
      this.getEndcustomerListFiltered()[i].selected = true;
    }
    this.updateSelectAllValue();
  }
  clearSelection() {
    //Unselect all roles regardless of pagination
    this.selectedCount = 0;
    this.isSelectAll = false;
    for (let i = 0; i < this.endCustomerList.length; i++) {
      this.endCustomerList[i].selected = false;
    }
  }

  getSelectedCount() {
    let count = 0
    for (let i = 0; i < this.getEndcustomerListFiltered().length; i++) {
      if (this.getEndcustomerListFiltered()[i].selected) {
        count++;
      }
    }
    return count;
  }

  updateSelectAllValue() {
    this.selectedCount = this.getSelectedCount();
    this.allSelectedFlag = this.getSelectedCount() == this.getEndcustomerListFiltered().length ? true : false;
  }

  //check and disable button based on condition
  getActionButtonDisable(typ: string) {
    let self = this
    if (typ === globalObj[typ]) {
      let flag = true;
      for (let i = 0; i < this.getCollectionLength(); i++) {
        if (this.getEndcustomerListFiltered()[i + ((this.page - 1) * this.pageSize)].selected) {
          flag = false;
        }
      }
      return flag;
    }
  }


  //This will return the length of data on the page for current pagination
  getCollectionLength() {
    let collectionLength = this.getEndcustomerListFiltered().slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    return collectionLength.length;
  }

  populateDefaultSearchList(){
    this.selectedSearchAttrList = [];
    let obj: any = {};
    this.sysIdAttributeList.map((item) => {
      if(item.colName === this.sysIdAttr){
        this.headerText = item.colLabel;
        obj.selected = true;
        obj.colName = item.colName;
        obj.colLabel = item.colLabel;
      }
    });
    this.selectedSearchAttrList.push(obj);
    this.attributeList.map((item) => {
      if(item.colName === this.sysIdAttr){
        item.selected = true;
      }
    })
  }

  //open modal based on type
  //The modal open's add or edit  screen based on the input 
  openModal(content, type, endCust: any) {
    this.editVals.sysIds = [];
    this.editVals.groups = [];
    this.resetPagination();
    this.resetPaginationGroup();
    this.resetTempAddRemoveButtons();
    this.inSearchView = false;
    this.selectedView = 'device';
    this.editEndUserMode = false;
    let self = this;
    //Add End Customer code
    if (type === globalObj.addEndCustomerType) {
      this.endCustomerProductList = this.processProductList();
      self.showSysIdDiv = false;
      this.shouldCallLoadPages = true;
      this.modalHeader = globalObj.addEndCustomerMsg;
      this.resetData();
      this.showDivSearch = false;
      this.addEditEndCustForm = this.formBuilder.group({
        endCustomerName: ['', [Validators.required, Validators.maxLength(this.fieldLength.max), Validators.minLength(this.fieldLength.min)]],
        prodName: ['', Validators.required],
        // availableSelectedSysIdname: [[]],
        // SelectedSysIdname: [[], Validators.required],
        syssearchtext: this.formBuilder.group({}),
        groupNameSearch: '',
        groupSysIdSearch: '',
        sendNotification: false
      });
    }

    //Edit End Customer code
    else if (type === globalObj.editEndCustomerType) {
      this.endCustomerProductList = this.processProductList();
      this.editEndUserMode = true;
      this.shouldCallLoadPages = true;
      let endCustomerProdName = endCust.mfr + "/" + endCust.prod + "/" + endCust.sch;
      // let tempsysIdAttributes = [];
      let postData = [{
        mfr : endCust.mfr,
        prod: endCust.prod,
        sch: endCust.sch,
        sysid_col_name: "sysid1",
        sysids: endCust.serial_number
      }]
      // Integrate API
      this.selectedSysIds = [];
      this.adminService.post(postData, api.availableSysInfo + endCust.mfr + '/' + endCust.prod + '/' + endCust.sch).subscribe((response: any) => {
        this.selectedSysIds = response.Data;
        this.selectedSysIds.map((item: any, index)=> {
          item.rowIndex = index;
        })
      });
      this.addEditEndCustForm = this.formBuilder.group({
        endCustomerName: [endCust.endcustomer_name, [Validators.required, Validators.maxLength(this.fieldLength.max), Validators.minLength(this.fieldLength.min)]],
        prodName: [endCustomerProdName, Validators.required],
        // availableSelectedSysIdname: [[]],
        // SelectedSysIdname: [[], Validators.required],
        syssearchtext: this.formBuilder.group({}),
        groupNameSearch: '',
        groupSysIdSearch: '',
        sendNotification: false
      });
      this.getColListData(endCustomerProdName, this.addEditEndCustForm.value, () => {
        this.getSysId(endCustomerProdName, endCust.serial_number);
        this.getGroupList(endCustomerProdName, endCust);
        this.editVals.sysIds = endCust.serial_number;
        this.editVals.groups = endCust.group_name;
      });
      this.modalHeader = globalObj.editEndCustomerMsg;
      let obj = {};
      this.sysIdAttributeList.map((item) => {
        obj[item.colName] = '';
      })
      this.addEditEndCustForm.controls['endCustomerName'].disable();
      this.addEditEndCustForm.controls['prodName'].disable();
      self.showSysIdDiv = true;
    }
    this.modalService.open(content, this.largeModalOptions).result.then((result) => {
    }, (reason) => {
    });
  }

  getSysId(prodname, selectedSysIds) {
    this.sysIdList = [];
    this.pagination.paginationText = '';
    this.sysidLoading = true;
    this.adminService.getSysList(prodname, this.pagination.startIndex, this.pagination.endIndex, this.addEditEndCustForm.value.syssearchtext).subscribe((data) => {
      this.totalSysids = this.adminService.totalsysid;
      this.dataSet = this.totalSysids;
      if (selectedSysIds && selectedSysIds.length) {
        data.map((obj, index) => {
          obj.disabled = selectedSysIds.indexOf(obj[this.sysIdAttr]) > -1 ? true : false;
          if(selectedSysIds.indexOf(obj[this.sysIdAttr]) > -1){
            let selectedObj = <any>{};
            this.sysIdAttributeList.map((item: any) => {
              selectedObj[item.colName] = obj[item.colName];
            })
            selectedObj.disabled = false;
            selectedObj.rowIndex = index;
            selectedObj.selected = false;
            this.selectedSysIds.push(selectedObj);
            this.selectedSysIds = _.uniqBy(this.selectedSysIds, this.sysIdAttr);
          }
        });
      }
      this.sysIdList = _.sortBy(data, o => o.disabled);
      this.sysIdList.map((sysId: any, index) => {
        sysId.rowIndex = index;
        sysId.selected = false;
      });
      if (this.shouldCallLoadPages) {
        this.getPages(prodname);
        this.shouldCallLoadPages = false;
      }
      // this.showSearchBox = this.sysIdList.length > 0  ? true : false;
      var endIndex = this.totalSysids <= this.pagination.endIndex ? this.totalSysids : this.pagination.endIndex + 1;
      this.pagination.paginationText = 'Showing ' + (this.pagination.startIndex + 1) + ' to ' + endIndex + ' of ' + this.totalSysids;
      this.sysidLoading = false;
    });
  }

  callsysid() {
    this.shouldCallLoadPages = true;
    this.inSearchView = true;
    this.pagination.startIndex = 0;
    this.pagination.endIndex = 200;
    let prodname = this.editEndUserMode ? this.addEditEndCustForm.controls.prodName.value : this.addEditEndCustForm.value.prodName;
    let selectedSysIds = this.selectedSysIds.map((item: any)=>{
      return item[this.sysIdAttr];
    })
    this.getSysId(prodname, selectedSysIds);
  }

  //when product is changed/chosen call the SYSiD LIST API
  onProdChange() {
    this.showSysIdDiv = true;
    this.selectedSysIds = [];
    this.selectedGroups = [];
    this.selectedView = 'device';
    this.headerText = '';
    //getsysid
    this.getColListData(this.addEditEndCustForm.value.prodName , this.addEditEndCustForm.value, () => {
      this.getSysId(this.addEditEndCustForm.value.prodName, '');
      this.getGroupList(this.addEditEndCustForm.value.prodName, '');
    });
    this.productTooltip = Object.keys(this.endCustomerProductList).find(key => this.endCustomerProductList[key] === this.addEditEndCustForm.value.prodName);
  }

  getColListData(prod, formData, callback){
    this.sysIdAttributeList = [];
    this.adminService.getSysIdColList(prod).subscribe((data: any) => {
      this.sysIdAttributeList = data.cols;
      this.populateDefaultSearchList();
      this.sysIdAttributeList.map((item) => {
        item.selected = false;
      })
      this.adminService.setColListData(this.sysIdAttributeList);
      callback();
      this.setGroupFormData(formData);
      this.setSearchAttributeList();
    })
  }

  setGroupFormData(formData){
    let obj = {};
    this.sysIdAttributeList.map((item) => {
      obj[item.colName] = '';
    })
    this.addEditEndCustForm = this.formBuilder.group({
      endCustomerName: [formData.endCustomerName, [Validators.required, Validators.maxLength(this.fieldLength.max), Validators.minLength(this.fieldLength.min)]],
      prodName: [formData.prodName, Validators.required],
      // availableSelectedSysIdname: [[]],
      // SelectedSysIdname: [[], Validators.required],
      syssearchtext: this.formBuilder.group(obj),
      groupNameSearch: '',
      groupSysIdSearch: '',
      sendNotification: false
    });
  }

  getGroupList(prod, groupList) {
    this.groupDataList = this.groupedData[prod] ? this.groupedData[prod] : [];
    this.selectedGroups = [];
    if (groupList) {
      let val = this.checkIfPresentInParentGroup(groupList.endcustomer_name);
      this.groupDataList.map((obj: any, index) => {
        obj.disabled = groupList.group_name.indexOf(obj.endcustomer_name) > -1 || obj.endcustomer_name === groupList.endcustomer_name ? true : false || val.indexOf(obj.endcustomer_name) > -1;
        obj.rowIndex = index;
        if(groupList.group_name.indexOf(obj.endcustomer_name) > -1){
          let groupObj: any = {};
          groupObj.endcustomer_name = obj.endcustomer_name;
          groupObj.checked = false;
          groupObj.selected = false;
          groupObj.serial_number = obj.serial_number;
          groupObj.group_name = obj.group_name;
          this.selectedGroups.push(groupObj);
        }  
      });
    } else {
      this.groupDataList.map((groupItem: any, index) => {
        groupItem.rowIndex = index;
        groupItem.disabled = false;
        groupItem.selected = false;
        if(groupList && groupItem.endcustomer_name === groupList.group_name.endcustomer_name){
          groupItem.disabled = true;
        }
      });
    }
    this.groupDataList = _.sortBy(this.groupDataList, (o: any) => {o.disabled});
    this.getGroupPages('');
  }

  checkIfPresentInParentGroup(groupName){
    const keys = Object.keys(this.groupSubgroupMap);
    let arr = [];
    keys.forEach((key, index) => {
      if(this.groupSubgroupMap[key].indexOf(groupName) > -1) {
        arr.push(key);
      }
    }, this);
    return arr;
  }

  //Add SysId Method
  addSysIds() {
    if (this.selectedView === 'device') {
      this.selectedSysIds = this.selectedSysIds.concat(this.tempAddSysIdList);
      this.sysIdList = _.sortBy(this.sysIdList, (o: any) => o.selected);
      this.sysIdList.map((sysIdItem: any, index) => {
        sysIdItem.rowIndex = index;
        this.selectedSysIds.map((item:any, selectedSysidIndex) => {
          if (sysIdItem[this.sysIdAttr] === item[this.sysIdAttr]) {
            item.rowIndex = selectedSysidIndex;
            sysIdItem.selected = false;
            sysIdItem.disabled = true;
          }
        })
      });
      this.selectedSysIds = _.cloneDeep(this.selectedSysIds);
      this.tempAddSysIdList = [];
    } else {
      this.selectedGroups = this.selectedGroups.concat(this.tempAddGroupList);
      this.groupDataList = _.sortBy(this.groupDataList, o => o.selected);
      this.groupDataList.map((groupItem: any, index) => {
        groupItem.rowIndex = index;
        this.selectedGroups.map((item: any, selectedGroupIndex) => {
          if (groupItem.endcustomer_name === item.endcustomer_name) {
            item.rowIndex = selectedGroupIndex;
            groupItem.selected = false;
            groupItem.disabled = true;
          }
        })
      });
      this.selectedGroups = _.cloneDeep(this.selectedGroups);
      this.tempAddGroupList = [];
    }
  }
  resetScrollTop(el){
    setTimeout(function(){
      const selector = document.getElementById(el);
      selector.scrollTop = 0;
    })
     
  }

  //Remove SysId Method
  removeSysIds() {
    if (this.selectedView === 'device') {
      this.sysIdsToRemove = [];
      this.sysIdsToRemove = this.sysIdsToRemove.concat(this.tempRemoveSysIdList);
      this.sysIdsToRemove.forEach((item) => {
        this.sysIdList.forEach((sys: any, index) => {
          sys.rowIndex = index;
          if (sys[this.sysIdAttr] === item[this.sysIdAttr]) {
            sys.selected = false;
            sys.disabled = false;
          }
        })
      }, this);
      this.sysIdsToRemove.map((item) => {
        this.removeItemFromList(this.selectedSysIds, item);
      });
      this.tempRemoveSysIdList = [];
    } else {
      this.groupListToRemove = [];
      this.groupListToRemove = this.groupListToRemove.concat(this.tempRemoveGroupList);
      this.groupListToRemove.forEach((item) => {
        this.groupDataList.forEach((group: any, index) => {
          group.rowIndex = index;
          if (group.endcustomer_name === item.endcustomer_name) {
            group.selected = false;
            group.disabled = false;
          }
        })
      }, this);
      this.groupListToRemove.map((item) => {
        this.removeItemFromList(this.selectedGroups, item);
      });
      this.tempRemoveGroupList = [];
    }
  }

  removeItemFromList(list, itemToRemove) {
    list.forEach((item, index) => {
      if (this.selectedView === 'device') {
        if (item[this.sysIdAttr] === itemToRemove[this.sysIdAttr]) {
          list.splice(index, 1);
        }
      } else {
        if (item.endcustomer_name === itemToRemove.endcustomer_name) {
          list.splice(index, 1);
        }
      }
    }, this);
    list.map((listItem, index) => {
      listItem.rowIndex = index;
    });
    if (this.selectedView === 'device') {
      this.selectedSysIds = list;
    } else {
      this.selectedGroups = list;
    }
  }

  //state of add remove button
  addRmoveBtnState(state) {
    if (this.selectedView === 'device') {
      if (state === 'add') {
        this.tempAddSysIdList = this.sysIdList.filter((item: any) => {
          return item.selected;
        });
      } else {
        this.tempRemoveSysIdList = this.selectedSysIds.filter((item: any) => {
          return item.selected;
        });
      }
    } else {
      if (state === 'add') {
        this.tempAddGroupList = this.groupDataList.filter((item) => {
          return item.selected;
        });
      } else {
        this.tempRemoveGroupList = this.selectedGroups.filter((item) => {
          return item.selected;
        });
      }
    }
  }

  clearsysSearchText (){
    let obj = {};
    this.sysIdAttributeList.map((item) => {
      obj[item.colName] = '';
    })
    this.addEditEndCustForm.patchValue({
      syssearchtext: obj
    });
  }
  //sysid searchtext clear

  clearSearchText = function () {
    this.showDivSearch = false;
    this.inSearchView = false;
    this.clearsysSearchText();
    this.resetPagination();
    this.resetPaginationGroup();
    this.shouldCallLoadPages = true;
    this.attributeList.map((item) => {
      item.selected = false;
    });
    // this.populateDefaultSearchList();
    this.selectedSearchAttrList.map((item) => {
      item.selected = true;
    })
    let prodname = this.editEndUserMode ? this.addEditEndCustForm.controls.prodName.value : this.addEditEndCustForm.value.prodName;
    if(this.selectedSysIds.length){
      var selectedSysIds = this.selectedSysIds.map((item)=> {
        return item[this.sysIdAttr];
      })
    }
    this.getSysId(prodname, selectedSysIds);
  }

  getPageStart(pageSiz, pageNo) {
    return pageSiz * pageNo;
  };

  getPageLabel(total, pageSiz, pageNo) {
    var start = Math.max(this.getPageStart(pageSiz, pageNo), 0);
    var end = Math.min(this.getPageStart(pageSiz, pageNo + 1), total);
    let obj: any = {};
    obj.startIndex = start;
    obj.endIndex = (end === this.totalSysids) ? this.totalSysids : end - 1;
    return obj;
  }

  loadNextSet() {
    this.resetTempAddRemoveButtons();
    if(this.selectedView === 'device'){
      this.pagination.currentPage = this.pagination.currentPage + 1;
      var page = this.pages[this.pagination.currentPage - 1];
      this.pagination.startIndex = page.startIndex;
      this.pagination.endIndex = page.endIndex;
      let prodname = this.editEndUserMode ? this.addEditEndCustForm.controls.prodName.value : this.addEditEndCustForm.value.prodName;
      let selectedSysIds = this.selectedSysIds.map((item: any) =>{
        return item[this.sysIdAttr]
      })
      this.getSysId(prodname, selectedSysIds);
    } else {
      this.paginationGroup.currentPage = this.paginationGroup.currentPage + 1;
      var page = this.groupPages[this.paginationGroup.currentPage - 1];
      this.paginationGroup.startIndex = page.startIndex;
      this.paginationGroup.endIndex = page.endIndex;
      this.getGroupListFiltered();
    }
  }

  loadPrevSet() {
    this.resetTempAddRemoveButtons();
    if(this.selectedView === 'device'){
      this.pagination.currentPage = this.pagination.currentPage - 1;
      var page = this.pages[this.pagination.currentPage - 1];
      this.pagination.startIndex = page.startIndex;
      this.pagination.endIndex = page.endIndex;
      let prodname = this.editEndUserMode ? this.addEditEndCustForm.controls.prodName.value : this.addEditEndCustForm.value.prodName;
      let selectedSysIds = this.selectedSysIds.map((item: any) =>{
        return item[this.sysIdAttr]
      })
      this.getSysId(prodname, selectedSysIds);
    }else{
      this.paginationGroup.currentPage = this.paginationGroup.currentPage - 1;
      var page = this.groupPages[this.paginationGroup.currentPage - 1];
      this.paginationGroup.startIndex = page.startIndex;
      this.paginationGroup.endIndex = page.endIndex;
      this.getGroupListFiltered();
    }
  }

  getPages(prodName) {
    this.resetPagination();
    this.pagination.noOfPages = Math.ceil(this.totalSysids / this.pagination.pageSiz);
    this.pages = Array.from({ length: this.pagination.noOfPages }, function (_, i) {
      return this.getPageLabel(this.totalSysids, this.pagination.pageSiz, i);
    }, this);
  }
  resetPagination() {
    this.pagination = {
      pageSiz: this.pagination.pageSiz,
      startIndex: 0,
      endIndex: this.pagination.pageSiz - 1,
      noOfPages: 0,
      currentPage: 1,
      paginationText: ''
    }
  }

  resetPaginationGroup() {
    this.paginationGroup = {
      pageSiz: this.paginationGroup.pageSiz,
      startIndex: 0,
      endIndex: this.paginationGroup.pageSiz - 1,
      noOfPages: 0,
      currentPage: 1,
      paginationText: ''
    }
  }

  getGroupPages(prodName) {
    this.resetPaginationGroup();
    this.paginationGroup.noOfPages = Math.ceil(this.groupDataList.length / this.paginationGroup.pageSiz);
    this.groupPages = Array.from({ length: this.paginationGroup.noOfPages }, function (_, i) {
      return this.getPageLabel(this.groupDataList.length, this.paginationGroup.pageSiz, i);
    }, this);
  }
  
  //delete End Customer method
  openConfirmation(type, data) {
    const delModal = this.modalService.open(ConfirmationPopupComponent, this.confirmModalOptions);
    delModal.result.then((result) => {
      let postData = [];
      let selectedGroups = [];
      if (result === globalObj.yesClick) {
        if (type === globalObj.deleteMultiple) {
          this.endCustomerList.map(function(item) {
            if(item.selected){
              selectedGroups.push({
                endcustomer_name: item.endcustomer_name,
                mps: `${item.mfr}/${item.prod}/${item.sch}`
              })
            }
          });
          let selectedGroupsBymps = _.groupBy(selectedGroups, (group) => {
            return group.mps;
          })
          for(let key in selectedGroupsBymps){
            postData.push({
              mps: key,
              endcustomer_name: selectedGroupsBymps[key].map((item) =>{
                return item.endcustomer_name;
              })
            })
          }
        }
        else if (type === globalObj.deleteSingle) {
          let postDataObj = <any>{};
          postDataObj.endcustomer_name = [data.endcustomer_name];
          postDataObj.mps = `${data.mfr}/${data.prod}/${data.sch}`;
          postData.push(postDataObj);
        }
        this.loading = true;
        this.deleteEndCustomer(postData);
      }
      else {
        this.modalService.dismissAll();
        return;
      }
    });
    //single delete
    if (type === globalObj.deleteSingle) {
      //case2-End customer delete – with user association
      if ((this.adminService.associatedEndCustomerList.indexOf(data.endcustomer_name.toLowerCase()) >= 0) || (this.associatedGroupList.indexOf(data.endcustomer_name.toLowerCase()) > -1)) {
        this.modalService.dismissAll();
        const delErrorModal = this.modalService.open(MessagePopupComponent, { backdrop: 'static' });
        delErrorModal.componentInstance.msg = "<strong>" + data.endcustomer_name + "</strong> " + messages.endWithAssoc + '';
        delErrorModal.componentInstance.listToDisplay = [`one or more users are associated with ${data.endcustomer_name}` , `${data.endcustomer_name} is contained in other group(s)`];
        delErrorModal.componentInstance.footerMsg = `You must dissociate the user(s) AND/OR the containing group(s) - in order to delete ${data.endcustomer_name}.`
        delErrorModal.result.then((result) => {
          if (result === "okclick") {
            this.modalService.dismissAll();
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
    if (type === globalObj.deleteMultiple) {
      let associatedArr = [];
      let usersToDel = [];
      this.endCustomerList.map((item) => {
        if(item.selected){
          if((this.adminService.associatedEndCustomerList.indexOf(item.endcustomer_name.toLowerCase()) > -1) || (this.associatedGroupList.indexOf(item.endcustomer_name.toLowerCase()) > -1)){
            associatedArr.push(item.endcustomer_name);
          }else{
            usersToDel.push(item.endcustomer_name)
          }
        }
      })
      //case1-Single end customer delete – No user association
      if (usersToDel.length == 1 && !associatedArr.length) {
        delModal.componentInstance.msg = messages.noassociation;
      }

      //case2-Single end customer delete – with user association
      if (!usersToDel.length && associatedArr.length == 1) {
        const delErrorModal = this.modalService.open(MessagePopupComponent, { backdrop: 'static' });
        delErrorModal.componentInstance.msg = messages.associationErroSingle;
        delErrorModal.componentInstance.listToDisplay = messages.associationErroSingleList;
        delErrorModal.componentInstance.footerMsg = messages.associationErroSingleFooter;
        delErrorModal.result.then((result) => {
          if (result === "okclick") {
            this.modalService.dismissAll();
          }
        });
        return;
      }
      //case3-Multiple end customers delete – One or more end customers having user association
      if (usersToDel.length >= 1 && associatedArr.length >= 1) {
        delModal.componentInstance.msg = messages.multiAssociationErr;
        delModal.componentInstance.subMsg = messages.multiassociationErroList;
        delModal.componentInstance.listToDisplay = usersToDel;
        delModal.componentInstance.footerMsg = messages.multiassociationErroFooter;
        delModal.componentInstance.confirmationMsg = messages.multiassociationErroConfirmation;
      }
      //case4-Multiple end customers delete – No end  customer having user association
      if (usersToDel.length > 1 && !associatedArr.length) {
        delModal.componentInstance.msg = messages.nomultiassoc;
      }
      //case5-Multiple end customers delete – All end customers having user association
      else if (!usersToDel.length && associatedArr.length > 1) {
        const delErrorModal = this.modalService.open(MessagePopupComponent, { backdrop: 'static' });
        delErrorModal.componentInstance.msg = messages.alluserAssociation;
        delErrorModal.componentInstance.listToDisplay = messages.allassociationErroList;
        delErrorModal.componentInstance.footerMsg = messages.allassociationFooter;
        delErrorModal.result.then((result) => {
          if (result === "okclick") {
            this.modalService.dismissAll();
          }
        });
        return;
      }
    }    
  }

  //Add-Edit  End customer
  addEndCustSubmit() {
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

    // if (this.addEditEndCustForm.controls['endCustomerName'].value.trim().replace(/\s+/g, " ").replace(/\s/g, '').length == 0) {
    //   this.addEditEndCustForm.controls['endCustomerName'].setErrors({ 'pattern': true });
    // }
    this.submitted = true;
    if (this.addEditEndCustForm.invalid) {
      return;
    }

    //Duplicate name error
    if (!this.editEndUserMode) {
      if (this.adminService.getEndCustomerNameMap().indexOf(this.addEditEndCustForm.controls.endCustomerName.value.trim().replace(/\s+/g, " ").toLowerCase()) !== -1) {
        this.addEditEndCustForm.controls['endCustomerName'].setErrors({ 'duplicate': true });
        return;
      }
      let endcustomername = this.addEditEndCustForm.controls.endCustomerName.value.trim().replace(/\s+/g, " ");
      if (!endcustomername.length) {
        this.addEditEndCustForm.controls['endCustomerName'].setErrors({ 'pattern': true });
        return;
      }
      if (endcustomername.toLowerCase() === 'all') {
        this.addEditEndCustForm.controls['endCustomerName'].setErrors({ 'duplicate': true });
        return;
      }
    }
    this.loading = true;
    this.modalService.dismissAll();
    let postData: any = {};
    let mps = this.addEditEndCustForm.value.prodName ? this.addEditEndCustForm.value.prodName : this.addEditEndCustForm.getRawValue().prodName;
    mps = mps.split('/');
    postData.created_by = this.adminService.getLoggedEmail();
    postData.endcustomer_name = this.addEditEndCustForm.controls.endCustomerName.value.trim().replace(/\s+/g, " ");
    postData.serial_number = _.map(this.selectedSysIds, this.sysIdAttr).toString();
    postData.group_name = _.map(this.selectedGroups, 'endcustomer_name').toString();
    postData.updated_on = '';
    //Call edit api
    if (this.editEndUserMode) {
      this.adminService.post(postData, api.editEndCustomer + mps[0] + '/' + mps[1] + '/' + mps[2]).subscribe((response: DataResponse) => {
        if(response.Status && this.addEditEndCustForm.value.sendNotification){
          let rulesSubscriptionPostData: any = {};
          rulesSubscriptionPostData.mps = mps.join("/");
          rulesSubscriptionPostData.group = postData.endcustomer_name;
          rulesSubscriptionPostData.send_notification = this.addEditEndCustForm.value.sendNotification;
          this.adminService.post(rulesSubscriptionPostData, api.rulesSubscriptionFilter + mps[0] + '/' + mps[1] + '/' + mps[2]).subscribe((response: DataResponse) => {
          });
        }
        this.toast.show(response.Msg, { classname: globalObj.successClass, delay: globalObj.delay });
        this.UserTrackingService.userTracking("Admin Panel : End Customer", "Edit End Customer", postData.endcustomer_name + " Edited : ");
        this.shouldCallLoadPages = true;
        this.resetPagination();
        this.resetPaginationGroup();
        this.ngOnInit();
      });
    }
    //call add api
    else {
      this.adminService.post(postData, api.addEndCustomer + mps[0] + '/' + mps[1] + '/' + mps[2]).subscribe((response: DataResponse) => {
        this.toast.show(response.Msg, { classname: globalObj.successClass, delay: globalObj.delay });
        this.UserTrackingService.userTracking("Admin Panel : End Customer", "Add End Customer", postData.endcustomer_name + " Added : ");
        this.shouldCallLoadPages = true;
        this.resetPagination();
        this.resetPaginationGroup();
        this.ngOnInit();
      });
    }


  }

  //Delete  End Customer
  deleteEndCustomer(params) {
    let associatedarr = [];
    params.map((paramItem) => {
      paramItem.endcustomer_name.map((endcust, index) => {
        if (this.adminService.associatedEndCustomerList.indexOf(endcust.toLowerCase()) > - 1 || this.associatedGroupList.indexOf(endcust.toLowerCase()) > - 1) {
          paramItem.endcustomer_name.splice(index,1);
        }
      })
    })
    this.adminService.post(params, api.deleteEndCustomer + this.mps[0]).subscribe((response: DataResponse) => {
      this.toast.show(messages.endcustomerdeletesuccess, { classname: globalObj.successClass, delay: globalObj.delay });
      this.UserTrackingService.userTracking("Admin Panel : End Customer", "Delete End Customer", JSON.stringify(params) + ": Endcustomer/s Deleted")
      this.loading = false;
      this.ngOnInit();
    });
  }

  //method to reset the form data
  resetFormData() {
    this.selectedSysIds = [];
    this.submitted = false;
    let obj = {};
    this.sysIdAttributeList.map((item: any) => {
      obj[item.colName] = ''
    })
    this.addEditEndCustForm = this.formBuilder.group({
      endCustomerName: ['', [Validators.required, Validators.maxLength(this.fieldLength.max), Validators.minLength(this.fieldLength.min)]],
      prodName: ['', Validators.required],
      // availableSelectedSysIdname: [[]],
      // SelectedSysIdname: [[], Validators.required],
      syssearchtext: this.formBuilder.group(obj),
      groupNameSearch: '',
      groupSysIdSearch: '',
      sendNotification: false
    });
    this.isSelectAll = false;
    this.productTooltip = "Choose A Product";
  }

  getSelectedValues(list) {
    //.log(list);
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

  updateDataFilter(columnValue, selected, multiselect, actualData) {
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
    this.endCustomerFilterData.map((item) => {
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
      var filteredData = this.applyFilter(this.endCustomerListCopy, filterList);
      this.endCustomerList = filteredData;
    });
    if(this.getEndcustomerListFiltered().length+this.defaultPageSize<=this.pageSize){
      this.pageSize = this.pageValue[0];
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
  }

  resetFilter() {
    this.endCustomerFilterData.map((item) => {
      item['appliedFilterCount'] = 0;
      item['expand'] = false;
      item['enabled'] = false;
      item['searchText'] = '';
      if (Array.isArray(item.data)) {
        item.data.map((item) => {
          item.selected = false;
        })
      } else {
        for (var key in item.data) {
          item.data[key]['selected'] =  false;
        }
      }
    });
    this.endCustomerList = this.endCustomerListCopy;
    this.filterCount = 0;
    this.PaginationReset = true;
  };

  //export csv
  exportCSVFile() {
    this.loading = true;
    let data = _.cloneDeep(this.endCustomerList);
    let arr = []
    for (let i = 0; i < data.length; i++) {
      let obj = <any>{};
      obj.group_name = data[i].endcustomer_name;
      let sysid = data[i].serial_number.length ? data[i].serial_number.join(",") : '';
      let groupName = data[i].group_name.length ? ',' + data[i].group_name.join(","): ''
      obj.sysId_group_name = sysid + groupName;
      obj.created_by = data[i].created_by;
      obj.product = data[i].product;
      obj.modified_on = data[i].updated_on;
      arr.push(obj);
    }
    this.csvData = arr;
    this.adminService.downloadCSVFile(this.csvData, globalObj.reportTitle);
    this.loading = false;
  }

  // Swtich view device or group
  switchView(view, type) {
    let dataSet = view === 'device' ? this.totalSysids : this.groupDataList.length;
    // let endIndex = dataSet <= this.pagination.endIndex ? dataSet : this.pagination.endIndex + 1;
    this.dataSet = dataSet;
    this.showDivSearch = false;
    this.selectedView = view;
    this.resetAttributeList();
    this.setSearchAttributeList();
    this.resetTempAddRemoveButtons();
    if(view === 'device'){
      this.resetSysIdListSelected();
    }else {
      this.resetGroupListSelected();
    }
  }

  resetSysIdListSelected(){
    this.sysIdList.map((item: any)=>{
      item.selected = false;
    });
    this.selectedSysIds.map((item: any)=>{
      item.selected = false;
    })
  }

  resetGroupListSelected(){
    this.groupDataList.map((item: any)=> {
      item.selected = false;
    })
    this.selectedGroups.map((item: any)=>{
      item.selected = false;
    })
  }

  changeSearchView(header) {
    this.selectedSearchAttrList = [];
    let res = this.attributeList.filter((item) => {
      return item.selected;
    });
    this.selectedSearchAttrList = res;
    setTimeout(() => {
      if(!this.selectedSearchAttrList.length){
        this.populateDefaultSearchList();
      }
    })
    this.showDivSearch = res.length === 0 ? false : true;
    let obj = <any>{};
    if(this.showDivSearch){
      // obj[this.sysIdAttr] = '';
      obj[header.colName] = '';
      this.addEditEndCustForm.patchValue({
        syssearchtext: obj
      });
    }
  }

  rowClick(event, currentElm, list) {
    if (event.ctrlKey) {
      this.toggleRow(currentElm);
    }

    if (event.button === 0) {
      if (!event.ctrlKey && !event.shiftKey) {
        this.clearAll(list);
        this.toggleRow(currentElm);
      }
      if (event.shiftKey) {
        this.selectRowsBetweenIndexes([this.lastSelectedRow.rowIndex, currentElm.rowIndex], list)
      }
    }
  }

  toggleRow(row) {
    row.selected = !row.selected;
    this.lastSelectedRow = row;
  }


  selectRowsBetweenIndexes(indexes, list) {
    indexes.sort(function (a, b) {
      return a - b;
    });

    for (let i = indexes[0]; i <= indexes[1]; i++) {
      list[i].selected = true;
    }
  }

  clearAll(list) {
    list.map((sysId) => {
      sysId.selected = false;
    })
  }

  resetData() {
    this.tempRemoveGroupList = [];
    this.tempAddSysIdList = [];
    this.selectedView = 'device';
    this.selectedSysIds = [];
    this.selectedGroups = [];
  }

  resetAttributeList() {
    this.populateDefaultSearchList();
    this.attributeList.map((attr) => {
      attr.selected = false;
    })
  }

  setSearchAttributeList() {
    this.attributeList = this.selectedView === 'device' ? this.sysIdAttributeList : this.searchgroupAttributes;
    this.attributeList.map((attr) => {
      attr.selected = false;
      if(attr.colName === this.sysIdAttr){
        attr.selected = true;
      }
    });
  }

  getGroupListFiltered() {
    var endIndex = this.groupDataList.length <= this.paginationGroup.endIndex ? this.groupDataList.length : this.paginationGroup.endIndex + 1;
    this.paginationGroup.paginationText = 'Showing ' + (this.paginationGroup.startIndex + 1) + ' to ' + endIndex + ' of ' + this.groupDataList.length;
    let tempGroupDataList = this.groupDataList;
    if (this.addEditEndCustForm.value.groupNameSearch.length === 0) {
      if(this.groupPages.length){
        return this.groupDataList.slice(this.groupPages[this.paginationGroup.currentPage - 1].startIndex, this.groupPages[this.paginationGroup.currentPage - 1].endIndex + 1);
      }
    }
    if (this.addEditEndCustForm.value.groupNameSearch.length >= 3) {
      tempGroupDataList = tempGroupDataList.filter((item, i) => {
        return item.endcustomer_name.toLowerCase().includes(this.addEditEndCustForm.value.groupNameSearch.toLowerCase()) ||
          item.created_by.toLowerCase().includes(this.addEditEndCustForm.value.groupNameSearch.toLowerCase()) ||
          this.matchSerialNum(item.serial_number, this.addEditEndCustForm.value.groupNameSearch.toLowerCase())
      })
      var searchendIndex = this.groupDataList.length <= this.paginationGroup.endIndex ? tempGroupDataList.length : this.paginationGroup.endIndex + 1;
      this.paginationGroup.paginationText = 'Showing ' + (this.paginationGroup.startIndex + 1) + ' to ' + searchendIndex + ' of ' + tempGroupDataList.length;
    }
    
    return tempGroupDataList;
  }

  clearGroupSearchText(){
    this.showDivSearch = false;
    this.resetPaginationGroup();
    this.shouldCallLoadPages = true;
    this.attributeList.map((item) => {
      item.selected = false;
    })
    this.addEditEndCustForm.patchValue({
      groupNameSearch: '',
      groupSysIdSearch: ''
    })
    this.getGroupListFiltered();
  }

  searchDisbledButtonState(){
    var flag = true;
    this.selectedSearchAttrList.map((item: any) => {
      if(this.addEditEndCustForm.value.syssearchtext[item.colName].length){
        flag = false;
      }
    })
    return flag;
  }

  searchDisbledButtonStateForCancel(){
    var flag = true;
    this.selectedSearchAttrList.map((item: any) => {
      if(this.addEditEndCustForm.value.syssearchtext[item.colName].length || this.inSearchView){
        flag = false;
      }
    })
    return flag;
  }

  resetTempAddRemoveButtons(){
    this.tempAddSysIdList = [];
    this.tempAddGroupList = [];
    this.tempRemoveSysIdList = [];
    this.tempRemoveGroupList = [];
  }

  closeEndCustomerModal(){
    let condition;
    let sysIdchanged = true;
    let groupchanged = true;
    if(!this.editEndUserMode){
      condition = (this.addEditEndCustForm.dirty || this.selectedSysIds.length || this.selectedGroups.length || this.addEditEndCustForm.value.endCustomerName.length);
    }
    else{
      // This block of code checks if the length of sysIds in edit group is same as current selected sysId and if the sysIds are the same.
      // If they are same, then the flag returned is false and we dont show the discard changes popup.
      // If they are different, and the user clicks on cancel we show the discard changes popup.
      if(this.selectedSysIds.length === this.editVals.sysIds.length){
        this.selectedSysIds.map((item) => {
          if(this.editVals.sysIds.indexOf(item[this.sysIdAttr]) == -1){
            sysIdchanged = false;
          }
          return sysIdchanged;
        })
      }else{
        // If the length of current selected sysIds and length of edit group sysIds are different then by default we return false.
        // And we show the discard changes popup on click of cancel.
        sysIdchanged = false;
      }
      // This block of code checks if the length of groups in edit group is same as current selected groups and if the group names are the same.
      // If they are same, then the flag returned is false and we dont show the discard changes popup.
      // If they are different, and the user clicks on cancel we show the discard changes popup.
      if(this.selectedGroups.length === this.editVals.groups.length){
        this.selectedGroups.map((group) => {
          if(this.editVals.groups.indexOf(group.endcustomer_name) == -1){
            groupchanged = false;
          }
          return groupchanged;
        })
      }else{
        // If the length of current selected groups and length of edit group group names are different then by default we return false.
        // And we show the discard changes popup on click of cancel.
        groupchanged = false;
      }
      condition = (this.addEditEndCustForm.dirty || !sysIdchanged || !groupchanged);
    }
    if(condition){
      let tempForm = _.cloneDeep(this.addEditEndCustForm);
      const warningModal = this.modalService.open(ConfirmationPopupComponent, { backdrop: 'static', windowClass:"cancelEndCustomerConfirmation" });
      warningModal.componentInstance.msg = messages.changeAlert;
      warningModal.result.then((result) => {
        if (result === 'yesclick') {
          this.modalService.dismissAll();
        }else {
          this.addEditEndCustForm = tempForm;
        }
      });
    }else {
      this.modalService.dismissAll()
    }
  }

  /*-------- External Library methods START ------------
  ---Add all your 3rd party/External Library methods here -----*/

  //Form control methos
  get f() { return this.addEditEndCustForm.controls; }

  //sort function from sortable directive
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '') {
      this.endCustomerList = this.endCustomerList;
    } else {
      this.endCustomerList = [...this.endCustomerList].sort((a, b) => {
        const res = a[column].localeCompare(b[column], undefined /* Ignore language */, { sensitivity: 'base' }) 
        // const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  /*-------- External Library methods END -------------*/


}
