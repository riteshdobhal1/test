//This Consists of configurations and constants for role list

//Role feature data
const roleFeatures =  [
    {'name' : 'Admin', 'value':'admin', 'checked':false, 'disabled':false, 'category':'dashboards'},
    {'name' : 'Dashboards', 'value':'dashboards', 'checked':false, 'disabled':false, 'category':'dashboards'},
    {'name' : 'Dashboard Admin', 'value':'dashboard_admin', 'checked':false, 'disabled':true, 'category':'dashboards'},
    {'name' : 'Workbench', 'value':'workbench', 'checked':false, 'disabled':true, 'category':'dashboards'},
    {'name' : 'Creator', 'value':'wb_creator', 'checked':false, 'disabled':true, 'category':'dashboards'},
    {'name' : 'Rules & Alerts', 'value':'rules_and_alerts', 'checked':false, 'disabled':false, 'category':'rules_and_alerts'},
    {'name' : 'Rule Creator', 'value':'rule_creator', 'checked':false, 'disabled':true, 'category':'rules_and_alerts'},
    {'name' : 'Explorer', 'value':'explorer', 'checked':false, 'disabled':false, 'category': 'others'},
    {'name' : 'Logvault', 'value':'logvault', 'checked':false, 'disabled':false, 'category': 'others'},
    {'name' : 'File Upload', 'value':'file_upload', 'checked':false, 'disabled':false, 'category': 'others'},
    {'name' : 'Health Check', 'value':'healthcheck', 'checked':false, 'disabled':false, 'category': 'others'}
];
//Type of tableau users
const tableauUsertype = {
    Unlicensed:"Unlicensed",
    explorer:"Unlicensed",
    viewer:"Viewer",
    workbench:"SiteAdministratorExplorer",
    wb_creator:"SiteAdministratorCreator"
}
//Licensing Information
const TableauSiteRoleFeaturesMap = [{
    site_role: 'SiteAdministratorCreator',
    features: ['dashboards', 'dashboard_admin', 'workbench', 'wb_creator']
  },
  {
    site_role: 'SiteAdministratorExplorer',
    features: ['dashboards', 'dashboard_admin', 'workbench']
  },
  {
    site_role: 'Viewer',
    features: ['dashboards', 'viewer']
  }
];
//Role category
const roleCategory = [
    {"name":"Dashboards", "value":"dashboards", "alert": ""},
    {"name":"Rules & Alerts", "value":"rules_and_alerts", "alert":""},
    {"name":"Other Apps", "value":"others", "alert":""}
];

//Two Factor Auth Messages And Configs
const tfa = {
    header: "Two Factor Authentication",
    fields: [
        {
            label: "Email",
            checked: false,
            value: "email"
        },
        {
            label: "Phone",
            checked: false,
            value: "phone"
        },
    ],
    default: "Email"
}
//Admin Role Name
const adminRoleName = "admin";
//select All Flag
const selectallflag = "selectall";
//Add Role Modal Header
const addRoleModalHeader = "Add Role";

//Edit Role Modal Header
const editRoleModalHeader = "Edit Role : "
//Add Product Modal Header
const addProdModalHeader = "Add Product";
//Default mps added to admin role
const defaultMps = "default"; 
//Role Types
const roleType = {
    Internal:"Internal",
    External:"External"
};
//Viewer Permission Name
const viewerPermission = "viewer";
//Role Filter Array
const roleFilterArray = [{
    columnName : 'roleType',
    columnTitle : "Role Type",
    data : [{
        name:'Internal',
        selected:false,
        value: ''
    },{
        name:'External',
        selected:false,
        value: ''
    }],
    enabled: false,
    enabledCount: 0
  },{
    columnName : 'prodName',
    columnTitle : "Product Name",
    data : [],
    enabled: false,
    enabledCount: 0
  },{
    columnName : 'feature',
    columnTitle : "Features",
    data : [],
    enabled: false,
    enabledCount: 0
  },{
    columnName : 'name',
    columnTitle : "Name",
    data: [{
        name:'',
        selected:false,
        value: ''
    }],
    enabled: false,
    enabledCount: 0
  },{
    columnName: 'explorerDataRestriction',
    columnTitle: 'Explorer Data Restriction',
    data : [],
    enabled: false,
    enabledCount: 0
  }]
//Default Sorting
const defaultSort = {
    column: "DisName",
    direction: "asc"
}
//Types to be passed while showing delete confirmation
const delType = {
    role:"delRole",
    prod:"delProd"
};
//Role mode add or edit
const roleFormMode = {
    add:"addRole",
    edit:"editRole",
    addProd:"addProd"
}
//Role List Table Labels
const roleListTableLabel = {
    roleName: {
        name: "Role Name",
        type: "string"
    },
    roleType: {
        name: "Role Type",
        type: "string"
    },
    prodName: {
        name: "Product Display Name",
        type: "string"
    },
    featureLab: {
        name: "Features",
        type: "Array"
    },
    actionLab: {
        name: "Actions",
        type: ''
    }
}
//Add Role Form Label
const addRoleFormLabel = {
    prod: "Product(s)",
    prodName: "Product Display Name",
    roleType: "Role Type "
}
//Role Name Regex
const roleNameRegex = /^[0-9a-zA-Z\_\.\)\(\-]+$/g;
//This is the keys for each feature which will be entered in database. change it if its changed
const featureKeys = {
    admin:"admin",
    dashboards:"dashboards",
    dashboard_admin:"dashboard_admin",
    workbench:"workbench",
    creator:"wb_creator",
    rules_and_alerts:"rules_and_alerts",
    rule_creator:"rule_creator",
    explorer:"explorer",
    logvault:"logvault",
    file_upload:"file_upload",
    healthcheck:"healthcheck"
};
const fieldLength = {
    min:3,
    max:64
}
const ReportTitle = "Role Details";

const explorerDataRestrictionOptions = [
    {
        name: 'No Restriction',
        value: 'all'
    },
    {
        name: '7 days',
        value: '7'
    },
    {
        name: '14 days',
        value: '14'
    },
    {
        name: '30 days',
        value: '30'
    }
]

const roleNameHelpText = "Allowed characters: a-z, A-Z, 0-9, underscore(_), period(.), hyphen(-), brackets(())"

export {roleFeatures, viewerPermission, tfa, roleNameRegex, selectallflag, fieldLength, defaultSort, addRoleFormLabel, roleListTableLabel, defaultMps, roleCategory, adminRoleName, addRoleModalHeader, editRoleModalHeader, addProdModalHeader, roleType, featureKeys, delType, roleFormMode, tableauUsertype, roleFilterArray, ReportTitle, TableauSiteRoleFeaturesMap, explorerDataRestrictionOptions, roleNameHelpText};
