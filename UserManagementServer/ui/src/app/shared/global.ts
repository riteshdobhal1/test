const applicationProtocol = window.location.protocol; // window.location.protocol; 'https:'
const umsDomain = window.location.host; //'searchdev.glassbeam.com'; 'dev.glassbeam.com' //'umsqa.glassbeam.com' //
const devPort = '' //'9191';
const devRoute = 'login';
const apiVersion = 'v1/';
const newapiVersion = 'v1/';
const loginUrl = 'loginqa.glassbeam.com/login/login.html';
const sessionTimeout = 'User Session timeout';
const supportEmail = 'support@glassbeam.com';

//Default Dealay Of Toast Notification
const toastDelay = 9000; // for success
const toastDelayError = 300000; // forfailure
const allowedEmailddau = [];
const domainCass = [];
const ddauUms = 'https://oldumsqa.glassbeam.com/';
//Pagination data
const page = 1;
const pageSize = 10;
const pageValue = [10, 20, 30, 40, 50];

//Helper Enabled Flags
const pageTourFlag = false;
const onscreenFlag = true;

//Classes for toast types
const toastTypes = {
    blue: "bg-primary text-light",
    gray: "bg-secondary text-white",
    green: "bg-success text-white",
    red: "bg-danger text-white",
    blueinfo: "bg-info text-white",
    light: "bg-light text-dark",
    dark: "bg-dark text-white",
    white: "bg-white text-dark"
}
const largeModal = 'lg';
const smsize = 'sm';

// Validations check
const minCharacters = 1;
const maxCharacters = 64;

const passwordMinLength = 6;
const passwordMaxLength = 40;

const sysIdAttr = 'sysid1';
const instructions = {
    passwordInstruction: 'Password instructions',
    passwordMinCharacterLimit: 'Passwords should have minimum of 6 characters.',
    passwordMaxCharacterLimit: 'Passwords can have maximum of 40 characters.',
    passwordInstructionText: 'Choose a password that is easy for you to remember but would be hard for another to guess.',
    passwordInstructionText1: 'Passwords must include combination of the four following types of characters.',
    passwordInstructionSubText: 'uppercase letters (A through Z).',
    passwordInstructionSubText1: 'lower case letters (a through z).',
    passwordInstructionSubText2: 'Numbers (0 through 9).',
    passwordInstructionSubText3: 'Special characters and punctuation symbols (Example: _, -. +, =,!, @, %, *, &, ;, ”, :, .,  /).'
}

const redirectLink = "https://www.glassbeam.com/"

export {applicationProtocol, umsDomain, apiVersion, toastDelay,newapiVersion, page, pageSize, toastTypes, largeModal, pageValue, smsize, loginUrl,devPort, devRoute,sessionTimeout,supportEmail,toastDelayError,minCharacters, maxCharacters, passwordMinLength, passwordMaxLength,domainCass, ddauUms, sysIdAttr,allowedEmailddau, pageTourFlag, onscreenFlag, instructions, redirectLink};
