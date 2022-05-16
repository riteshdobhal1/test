
// const TableauSiteRoleFeaturesMap = [{
//     site_role: 'SiteAdministratorCreator',
//     features: ['Dashboards', 'Dashboard Admin', 'Workbench', 'Creator']
//   },
//   {
//     site_role: 'SiteAdministratorExplorer',
//     features: ['Dashboards', 'Dashboard Admin', 'Workbench']
//   },
//   {
//     site_role: 'Explorer',
//     features: ['Dashboards', 'Dashboard Admin']
//   },
//   {
//     site_role: 'Viewer',
//     features: ['Dashboards']
//   }
// ];

const TableauSiteRoleFeaturesMap = [{
    site_role: 'SiteAdministratorCreator',
    features: ['Dashboards', 'Dashboard Admin', 'Workbench', 'Creator']
  },
  {
    site_role: 'SiteAdministratorExplorer',
    features: ['Dashboards', 'Dashboard Admin', 'Workbench']
  },
  {
    site_role: 'Viewer',
    features: ['Dashboards']
  }
];

const page = 1;
const pageSize = 10;
const wbViewerCheckKeyword = 'Dashboards';
const wbUserCheckKeyword = 'Workbench';
const creatorCheckKeyword = 'Creator';
const internalCheckKeyword = 'Internal';
const externalCheckKeyword = 'External';
const activeCheckKeyword = 'Active';
const inactiveCheckKyword = 'Inactive';
const invitedCheckKyword = 'INVITED';
const healthCheckKeyword = 'healthcheck';
const rulesandalertsKeyword = 'rules_and_alerts';
const templateVariables = {
  viewerLicensesText: 'Dashboard Viewer',
  userLicensesText: 'Users',
  explorerLicenseText: 'Workbench Explorer',
  creatorLicensesText: 'Workbench Creator',
  adminUsersText: 'Admin Users',
  tableHeaders: [
    {name: 'Name', sortValue: 'name', type: 'string'},
    {name: 'Email', sortValue: 'email', type: 'string'},
    {name: 'Role', sortValue: 'roleName', type: 'string'},
    {name: 'System Group', sortValue: 'end_customer', type: 'string'},
    {name: 'Created On', sortValue: 'created_on', type:'date'},
    {name: 'Modified On', sortValue: 'modified_on', type:'date'},
    {name: 'Last Login', sortValue: 'last_login', type:'date'},
    {name: 'Status', sortValue: 'user_state', type: 'string'},
    {name: 'User Type', sortValue: 'is_external', type: 'string'},
    {name: 'Actions', sortValue: '', type:''}
  ],
  validationMessages: {
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    countryCodeRequired: 'Country Code is required',
    phoneRequired: 'Phone Number is required',
    emailExists: 'User with the email already exists',
    invalidEmail: 'Email must be a valid email address',
    roleRequired: 'Select a Role',
    productRequired: 'Select a Product',
    endCustomerRequired: 'Select a System Group',
    passwordRequired: 'Password is required',
    confirmPasswordRequired: 'Confirm Password is required',
    passwordInstruction: 'Password instructions',
    passwordMinCharacterLimit: 'Passwords should have minimum of 6 characters.',
    passwordMaxCharacterLimit: 'Passwords can have maximum of 40 characters.',
    passwordInstructionText: 'Choose a password that is easy for you to remember but would be hard for another to guess.',
    passwordInstructionText1: 'Passwords must include combination of the four following types of characters.',
    passwordInstructionSubText: 'uppercase letters (A through Z).',
    passwordInstructionSubText1: 'lower case letters (a through z).',
    passwordInstructionSubText2: 'Numbers (0 through 9).',
    passwordInstructionSubText3: 'Special characters and punctuation symbols (Example: _, -. +, =,!, @, %, *, &, ;, ”, :, .,  /).',
    noDataFound: 'No data found',
    minMaxLength: 'This entry cannot be more than 64 characters in length.',
    minMaxLengthForPhone: 'This entry cannot be more than 20 characters in length.',
    minMaxLengthForCountryCode: 'This entry cannot be more than 6 characters in length.',
    notValid: 'Not a valid entry',
    bulkEditDefaultText: 'Apply Internal/External Filter',
    bulkEditText: 'Select 2 or more users to edit in bulk',
    maxUsersExceeded: 'This user profile cannot be added as you have exhausted all the available user licenses'
  }
};

const timeListFilter = [{
  name : "Last 24 Hrs",
  value: "24hrs",
  checked: false
},{
  name : "Last Week",
  value: "week",
  checked: false
},{
  name : "Last Month",
  value: "month",
  checked: false
},{
  name : "Last 6 Months",
  value: "6month",
  checked: false
}];

const userFilterArray = [{
  columnName : 'name',
  columnTitle : "Name",
  data : [],
  multiselect: true,
  isDateType: false,
  showSearch: true,
  searchText: '',
  enabled: false
},{
  columnName : 'email',
  columnTitle : "Email",
  data : [],
  multiselect: true,
  isDateType: false,
  showSearch: true,
  searchText: '',
  enabled: false
},{
  columnName : 'roleName',
  columnTitle : "Role",
  data : [],
  multiselect: true,
  isDateType: false,
  showSearch: false,
  searchText: '',
  enabled: false
},{
  columnName : 'end_customer',
  columnTitle : "System Group",
  data : [],
  multiselect: true,
  isDateType: false,
  showSearch: false,
  enabled: false
},{
  columnName : 'created_on',
  columnTitle : "Created On",
  data : [],
  multiselect: false,
  isDateType: true,
  showSearch: false,
  enabled: false
},{
  columnName : 'modified_on',
  columnTitle : "Modified On",
  data : [],
  multiselect: false,
  isDateType: true,
  showSearch: false,
  enabled: false
},{
  columnName : 'last_login',
  columnTitle : "Last Login",
  data : [],
  multiselect: false,
  isDateType: true,
  showSearch: false,
  enabled: false
},{
  columnName : 'status',
  columnTitle : "Status",
  data : [{name: 'Active', value: 'active', selected:  false}, 
    {name: 'Inactive', value: 'inactive', selected: false},
    {name: 'Invited', value: 'invited', selected:  false}],
  multiselect: false,
  isDateType: false,
  showSearch: false,
  enabled: false
},{
  columnName : 'user_type',
  columnTitle : "User Type",
  data : [{name: 'Internal', value:'internal', selected: false},
    {name: 'External', value:'external', selected: false}],
  multiselect: false,
  isDateType: false,
  showSearch: false,
  enabled: false
}]

const quickFilter = [{
  title : 'All',
  columnValue : "*",
  columnName : 'user_type',
  selected : true
},{
  title : 'Internal',
  columnValue : 'Internal',
  columnName : 'user_type',
  selected : false
},{
  title : 'External',
  columnValue : 'External',
  columnName : 'user_type',
  selected : false
}];

const bulkEditEnableOptions = [
  {
    title: 'Active',
    value: 'ACTIVE'
  },
  {
    title: 'Inactive',
    value: 'INACTIVE'
  }
]

const reportTitle = "User Details";

const defaultSort = {
  column: "name",
  direction: "asc"
}

const regex = {
  password : /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{6,}$/,
  email: '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
  firstname: '^\\s*[a-zA-Z0-9_\'\.-]+\\s*$',
  lastname: '^\\s*[a-zA-Z0-9_\'\.-]*\\s*$',
  phone: '^\\s*[0-9]*\\s*$',
  generic: /^\s*[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};~`':"\\|,.<>\/? ]*\s*$/
}

const userHelpText = {
  name: "Allowed characters: a-z, A-Z, 0-9, single quotes('), period(.), hyphen(-)",
  phone: "Allowed characters: 0-9"
}

export {TableauSiteRoleFeaturesMap, page, pageSize, regex, wbUserCheckKeyword, creatorCheckKeyword, internalCheckKeyword, externalCheckKeyword, 
  templateVariables, userFilterArray, timeListFilter, activeCheckKeyword, inactiveCheckKyword, quickFilter, bulkEditEnableOptions, reportTitle,invitedCheckKyword,
  defaultSort, wbViewerCheckKeyword, healthCheckKeyword, rulesandalertsKeyword, userHelpText};
