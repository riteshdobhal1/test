import {fieldLength as roleFieldLenth} from '../admin/role/global';
const userLogin = 'Invalid Credentials';
const emailError = 'Email is not valid';
const passError = 'Password is not valid';
const forgotPasswordSuccess = 'We have e-mailed your password reset link to the specified address.';
const passwordError = 'Password is empty/not vaid';
const rePasswordError = 'Password is empty/not valid';
const createPasswordSuccess = 'Password created successfully';
const passwordMatch = 'Passwords did not match';
const delRoleMsg = {
    single: 'Are you sure you want to delete the selected role?',
    prodDel: 'Are you sure you want to delete',
    delsuccess: 'Selected role(s) deleted successfully',
    delProdsuccess:'Product {{prodName}} deleted successfully from the role {{roleName}}.',
    prodDelError: 'cannot be deleted as one or more users are associated with this role-product.   You must dissociate the user(s) in order to delete',
    prodSingleDelError: 'You cannot delete the product {{prodName}} as this is the only product associated with the role {{roleName}}.',
    multiple: 'Are you sure you want to delete the selected role(s)?',
    singleRoleError: 'The selected role cannot be deleted as one or more users are associated with this role.   You must dissociate the user(s) – from the selected role - in order to delete.',
    multipleRoleError: 'One or more selected roles cannot be deleted as one or more users are associated with them.  You must dissociate the user(s) from the selected role(s) - in order to delete. <br/>Are you sure you want to delete the following selected role(s) that are not associated with any user(s)?',
    multipleRoleErrorNoDelete: 'None of the selected roles can be deleted as one or more users are associated with them.  You must dissociate the user(s) from the selected role(s) – in order to delete.'
}
const deleteProdMsg = "Do you want to delete product? :";
const workbenchLicenseMsg = "A separate workbench license is required";
const healthcheckWarningMsg = "Heathcheck is not enabled in this product.";
const workbenchLicensesExceededText = {
    viewer: 'There are users associated with this role.  By adding Dashboard feature to this role, all users associated to the role will consume Dashboard Viewer licenses.  But, all Dashboard Viewer licenses have already been consumed by the existing users.  Hence you cannot add Dashboard feature to this role. ',
    viewerZero: "Your organization does not have any viewer licenses. Please contact glassbeam support for further assistance.",
    workbench: 'There are users associated with this role.  By adding Workbench feature to this role, all users associated to the role will consume Workbench Explorer licenses.  But, all Workbench Explorer licenses have already been consumed by the existing users.   Hence you cannot add Workbench feature to this role.',
    creator: 'There are users associated with this role.  By adding Creator feature to this role, all users associated to the role will consume Workbench Creator licenses.  But, all Workbench Creator licenses have already been consumed by the existing users.   Hence you cannot add Creator feature to this role.'
}
const userLicenseExceedText = {
    viewer: "This user profile cannot be added as you have exhausted all the available Dashboard Viewer licenses",
    workbench: "This user profile cannot be added as you have exhausted all the available Workbench Explorer licenses",
    creator: "This user profile cannot be added as you have exhausted all the available Workbench Creator licenses"
}
const userLicenseExceedTextEdit = {
    viewer: "You cannot change role for this user profile as you have exhausted all the available Dashboard Viewer licenses",
    viewerZero: "Your organization does not have any viewer licenses. Please contact glassbeam support for further assistance.",
    workbench: "You cannot change role for this user profile as you have exhausted all the available Workbench Explorer licenses",
    creator: "You cannot change role for this user profile as you have exhausted all the available Workbench Creator licenses"
}
const userLicenseExceedTextBulk = {
    viewer: "You cannot change role for these user profiles as you have exhausted all the available Dashboard Viewer licenses",
    workbench: "You cannot change role for these user profiles as you have exhausted all the available Workbench Explorer licenses",
    creator: "You cannot change role for these user profiles as you have exhausted all the available Workbench Creator licenses"
}
const viewerLicensesExceededText = "Your organization has exhausted all <b>Dashboard Viewer</b> licenses. You can free up used licenses by disassociating inactive users from the role OR contact <a href='mailto:%adminemail'>%adminemail</a> to purchase additional licenses.";
const creatorLicensesExceededText = 'All licences for Creator access used, please assign different role to user without Creator access.';
const passwordNotValid = 'Password not valid.';
const passwordMatchError = 'Password did not match.';
const deleteUserMsgMultiple = 'Are you sure you want to delete the selected user(s)?';
const deleteUserSingle = "Are you sure you want to delete ";
const changeAlert = 'Are you sure you want to discard changes made on this page?';
const deleteProdErrorMsg = 'Error! This role product is already assigned to one or more users. Please delete the associated users and try again.';
const multiDelRoleError = " roles won't be deleted as they are associated to 1 or more users.";
const unexpectedError = 'An unexpected error occured,';
const noRolesFound = "No Roles Found! Please narrow your search/filter";
const noUsersFound = "No Users Found! Please narrow your search/filter";
const noEndCustomerFound = "No Groups Found! Please narrow your search/filter";
const noDataFound = "No Data Found"
const roleEdited = "Role {{roleName}} updated successfully";
const prodAdded = "Product {{prodName}} added successfully to the role {{roleName}}.";
const roleAdded = "Role {{roleName}} added successfully.";
const enableUserMsg = "Do you want to activate user ";
const disableUserMsg = "Do you want to inactivate user ";
const selectExplorerDataDurationMsg = "Please select a duration to restrict explorer data";
const addRoleNameError = {
    'duplicate':'Role name already exists',
    'invalid': 'Role name is not valid',
    'blank': 'Role name is required',
    'minLength': 'Role name cannot be less than ' +roleFieldLenth.min+ ' characters in length',
    'maxLength': 'Role name cannot be more than 64 characters in length'
}
const addRoleDashboardLicenseError = {
    'dashboards': "Any user associated with this role will consume a Dashboard Viewer license.",
    'workbench': "Any user associated with this role will consume a Workbench Explorer license.",
    'creator': "Any user associated with this role will consume a Workbench Creator license."
}
const addUserLicensingError = {
    'dashboards': "This user will consume a Dashboard Viewer license",
    'workbench': "This user will consume a Workbench Explorer license",
    'creator': "This user will consume a Workbench Creator license",
}
const bulkeditUserLicensingError = {
    'dashboards': "The selected users will consume Dashboard Viewer licenses",
    'workbench': "The selected users will consume Workbench Explorer licenses",
    'creator': "The selected users will consume Workbench Creator licenses",
}


const errorCodeMsg = {
    '0': 'Server may be down.',
    '100':'You may be offline, Please check/enable your internet connection',
    '404':'Page Not Found.',
    '500':'Internal Server Error.',
    '403':'You are not authorized.',
    '400':'Bad Input.',
    '200':'Password created successfully'

};
//Helper Messages For User Form
const userFormHelper = {
    fname: "Enter First Name of User",
    lname: "Enter Last Name of User",
    email: "An invitation mail will be sent to this email.",
    code: "Enter country code",
    phone: "Enter Phone No",
    dept: "Enter user department",
    state: "User residence state",
    city: "User city",
    country: "User country",
    role: "assign a role",
    defProd: "This will be the default product where user lands"
}
//single delete msg

//case1
const endNoAssoc = 'Are you sure you want to delete'
//case2
const endWithAssoc = 'cannot be deleted due to one or both of the following reasons:';

//Multidelete
//case1
const noassociation = 'Are you sure you want to delete the selected group?'
//case2
const associationErroSingle = 'The selected group cannot be deleted due to one or both of the following reasons:';
const associationErroSingleList = ['one or more users are associated with this group', 'the selected group is contained in other group(s)'];
const associationErroSingleFooter = 'You must dissociate the users AND/OR the containing group(s) - from the selected group - in order to delete'
// const associationErroSingle = 'The selected end customer cannot be deleted as one or more users are associated with this end customer.   You must delete the associated user(s) in order to delete the selected end customer.';
// const groupassociationErroSingle = 'The selected group cannot be deleted as one or more groups are associated with this group.   You must delete the associated group(s) in order to delete the selected group.';

//case3
const multiAssociationErr = 'One or more selected groups cannot be deleted due to one or both of the following reasons:';
const multiassociationErroList = ['one or more users are associated with them', 'one or more selected group(s) is contained in other group(s)'];
const multiassociationErroFooter = 'You must dissociate the user(s) AND/OR the containing group(s) – from the selected group(s) - in order to delete.'
const multiassociationErroConfirmation = 'Are you sure you want to delete the following selected group(s) that are not associated with user(s) and group(s)?'


//case4
const nomultiassoc = ' Are you sure you want to delete the selected groups?';


const alluserAssociation = 'None of the selected groups can be deleted due to one or both of the following reasons:'
const allassociationErroList = ['one or more users are associated with them', 'the selected groups are contained in other group(s)'];
const allassociationFooter = 'You must dissociate the user(s) AND/OR the containing group(s) – from the selected groups - in order to delete.'


const endcustomerdeletesuccess = 'Selected Group(s) deleted successfully'

//Default Error Message
const defErrorMessage = "System Error, Please contact support";
export {userLogin, addRoleNameError, userLicenseExceedText, userFormHelper, multiDelRoleError, delRoleMsg, deleteProdMsg, workbenchLicenseMsg, healthcheckWarningMsg, workbenchLicensesExceededText, creatorLicensesExceededText, passwordNotValid, passwordMatchError, deleteUserMsgMultiple, unexpectedError, noRolesFound
, noUsersFound, noEndCustomerFound, errorCodeMsg,changeAlert, viewerLicensesExceededText, roleAdded, prodAdded, roleEdited, enableUserMsg, disableUserMsg, multiAssociationErr, noassociation, associationErroSingle,alluserAssociation, endcustomerdeletesuccess, endNoAssoc, endWithAssoc, nomultiassoc,noDataFound,emailError,passError,forgotPasswordSuccess,passwordError,rePasswordError,createPasswordSuccess,passwordMatch, addRoleDashboardLicenseError, addUserLicensingError, bulkeditUserLicensingError, defErrorMessage, associationErroSingleList, associationErroSingleFooter,
multiassociationErroList, multiassociationErroFooter, multiassociationErroConfirmation, allassociationErroList, allassociationFooter, userLicenseExceedTextEdit, userLicenseExceedTextBulk, deleteUserSingle, selectExplorerDataDurationMsg};
