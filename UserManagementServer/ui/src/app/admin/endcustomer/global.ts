const globalObj = {
  delmsg: 'Do you want to delete',
  duplicateName: 'End Customer Name already Exists',
  addEndCustomerMsg: 'Add Group',
  editEndCustomerMsg: 'Edit End Customer',
  addEndCustomerType: 'addEndCust',
  editEndCustomerType: 'editEndCust',
  yesClick: 'yesclick',
  deleteMultiple: 'delMultiple',
  deleteSingle: 'delSingle',
  dangerClass: 'bg-danger text-light',
  successClass: 'bg-success text-light',
  addSys: 'addsys',
  removeSys: 'remsys',
  delMultipleButton: 'delMultipleButton',
  delay: 7000,
  user: 'User ?',
  users: 'Users ?',
  modalOptions: { backdrop: 'static', size: 'xl', scrollable: true },
  confirmModalOptions: { backdrop: 'static' },
  requiredName: 'Name is required',
  requiredProdname: 'Product is Required',
  availableDeviceId: 'Available Devices',
  availableGroups: 'Available Groups',
  selectedSysId: 'Selected Devices',
  selectedGroups: 'Selected Groups',
  requiredSysId: "Device IDs must be moved from 'Available Device IDs' to 'Selected Device IDs",
  nameRequired: "Name is required",
  chooseProduct: "Choose A Product",
  startIndex: 0,
  endIndex: 199,
  reportTitle: "End Customer Details"
}

const endCustomerFilterArray = [
  {
    columnName: 'endcustomer_name',
    columnTitle: "Group Name",
    data: [],
    multiselect: true,
    isDateType: false,
    showSearch: true,
    searchText: '',
    enabled: false
  },
  {
    columnName: 'serial_number',
    columnTitle: "Device Id",
    data: [],
    multiselect: true,
    isDateType: false,
    showSearch: true,
    searchText: '',
    enabled: false
  },
  {
    columnName: 'created_by',
    columnTitle: "Created By",
    data: [],
    multiselect: true,
    isDateType: false,
    showSearch: false
  }, {
    columnName: 'updated_on',
    columnTitle: "Modified On",
    data: [],
    multiselect: false,
    isDateType: true,
    showSearch: false,
    enabled: false
  }, {
    columnName: 'product',
    columnTitle: "Product",
    data: [],
    multiselect: true,
    isDateType: false,
    showSearch: false,
    searchText: '',
    enabled: false
  }]

const timeListFilter = [{
  name: "Last 24 Hrs",
  value: "24hrs",
  checked: false
}, {
  name: "Last Week",
  value: "week",
  checked: false
}, {
  name: "Last Month",
  value: "month",
  checked: false
}, {
  name: "Last 6 Month",
  value: "6month",
  checked: false
}];

//EndCustomer Name Check Regex
const EndCustomerNameRegex = "(.*?)";

const fieldLength = {
  min: 3,
  max: 64
}
const addEndcustomerNameError = {
  'duplicate': 'Group name already exists',
  'invalid': 'Group name is not valid',
  'required': 'Group name is required',
  'minLength': 'Group name cannot be less than 3 characters in length',
  'maxLength': 'Group name cannot be more than 64 characters in length'
}

const defaultSort = {
  column: "endcustomer_name",
  direction: "asc"
}

const sysIdAttributes = [{
    name: 'Device ID',
    keyword: 'device',
    selected: false
  }, {
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

const searchIdAttributes = [{
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

const groupSearchAttributes = [{
  name: 'Device ID',
  keyword: 'sysId',
  selected: false
}]

const groupAttributes = [{
  name: 'Group',
  keyword: 'group',
  selected: false
}, {
  name: 'Device ID',
  keyword: 'device',
  selected: false
}]

//Role List Table Labels
const endCustomerListTableLabel = {
  endCustName: {
      name: "Group Name",
      type: "string"
  },
  serialNum: {
      name: "Device ID/ Group",
      type: "Array"
  },
  createdBy: {
      name: "Created By",
      type: "string"
  },
  modifiedOn: {
      name: "Modified On",
      type: "Array"
  },
  actionLab: {
      name: "Actions",
      type: ''
  },
  product: {
    name: "Product",
    type: "string"
  }
}

const noDataFound = "No data found"

const mockSelectedSysIdData = [{
    "sysId": "1589869806395",
    "systemName": "Definition",
    "hospName": "Bethesda Memorial Hospital",
    "compName": "CT60363",
    "city": "Boynton Beach",
    "country": "US"
  },
  {
    "sysId": "1589870568185",
    "systemName": "Definition",
    "hospName": "Bethesda Memorial Hospital",
    "compName": "CT60363",
    "city": "Boynton Beach",
    "country": "US"
  },
  {
    "sysId": "CT73099",
    "systemName": "Definition Flash",
    "hospName": "WBH",
    "compName": "ROIPCT3",
    "city": "Royal Oak",
    "country": "US"
  },
  {
    "sysId": "CT95782",
    "systemName": "Definition AS - Option slice configuration 64",
    "hospName": "Putnam Hospital",
    "compName": "CTAWP95782",
    "city": "Carmel",
    "country": "US"
  }]

const groupNameHelpText = ['Allowed characters: a-z, A-Z, 0-9, underscore(_), period(.), hyphen(-), space( )', 'All/all is a reserved Group name']

export {globalObj, endCustomerFilterArray, timeListFilter, EndCustomerNameRegex, fieldLength, addEndcustomerNameError, defaultSort, noDataFound, endCustomerListTableLabel, sysIdAttributes, groupAttributes, searchIdAttributes, groupSearchAttributes, mockSelectedSysIdData, groupNameHelpText }
