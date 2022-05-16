"use strict";
exports.__esModule = true;
exports.allowedEmailddau = exports.sysIdAttr = exports.ddauUms = exports.domainCass = exports.passwordMaxLength = exports.passwordMinLength = exports.maxCharacters = exports.minCharacters = exports.toastDelayError = exports.supportEmail = exports.sessionTimeout = exports.devRoute = exports.devPort = exports.loginUrl = exports.smsize = exports.pageValue = exports.largeModal = exports.toastTypes = exports.pageSize = exports.page = exports.newapiVersion = exports.toastDelay = exports.apiVersion = exports.umsDomain = exports.applicationProtocol = void 0;
var applicationProtocol = 'https:'; // window.location.protocol; 'https:'
exports.applicationProtocol = applicationProtocol;
var umsDomain = 'searchdevums.glassbeam.com'; //'searchdev.glassbeam.com'; 'dev.glassbeam.com' //'umsqa.glassbeam.com' //
exports.umsDomain = umsDomain;
var devPort = ''; //'9191';
exports.devPort = devPort;
var devRoute = 'login';
exports.devRoute = devRoute;
var apiVersion = 'v1/';
exports.apiVersion = apiVersion;
var newapiVersion = 'v1/';
exports.newapiVersion = newapiVersion;
var loginUrl = 'loginqa.glassbeam.com/login/login.html';
exports.loginUrl = loginUrl;
var sessionTimeout = 'User Session timeout';
exports.sessionTimeout = sessionTimeout;
var supportEmail = 'support@glassbeam.com';
exports.supportEmail = supportEmail;
//Default Dealay Of Toast Notification
var toastDelay = 9000; // for success
exports.toastDelay = toastDelay;
var toastDelayError = 300000; // forfailure
exports.toastDelayError = toastDelayError;
var allowedEmailddau = ['ddau@glassbeam.com'];
exports.allowedEmailddau = allowedEmailddau;
var domainCass = ['qsuper.qld.gov.au', 'global.ntt', 'dimensiondata.com', 'woolworths.com.au'];
exports.domainCass = domainCass;
var ddauUms = 'https://oldumsqa.glassbeam.com/';
exports.ddauUms = ddauUms;
//Pagination data
var page = 1;
exports.page = page;
var pageSize = 10;
exports.pageSize = pageSize;
var pageValue = [10, 20, 30, 40, 50];
exports.pageValue = pageValue;
//Classes for toast types
var toastTypes = {
    blue: "bg-primary text-light",
    gray: "bg-secondary text-white",
    green: "bg-success text-white",
    red: "bg-danger text-white",
    blueinfo: "bg-info text-white",
    light: "bg-light text-dark",
    dark: "bg-dark text-white",
    white: "bg-white text-dark"
};
exports.toastTypes = toastTypes;
var largeModal = 'lg';
exports.largeModal = largeModal;
var smsize = 'sm';
exports.smsize = smsize;
// Validations check
var minCharacters = 1;
exports.minCharacters = minCharacters;
var maxCharacters = 64;
exports.maxCharacters = maxCharacters;
var passwordMinLength = 6;
exports.passwordMinLength = passwordMinLength;
var passwordMaxLength = 40;
exports.passwordMaxLength = passwordMaxLength;
var sysIdAttr = 'sysid1';
exports.sysIdAttr = sysIdAttr;
