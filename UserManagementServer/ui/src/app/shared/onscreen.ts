//This class implements onscreen help for admin panel.
//Declare help text as that of line no 9. where filterNutton is id of the element and write the help text for the corresponding element.
import { Injectable } from '@angular/core';

@Injectable()
export class onscreen {
    onscreen: boolean = false;
    //Role Page Helpers
    roleFilter: string = "Click here to expand the filter and search based on the following parameters: <br/> <ul><li>Role Name</li><li>Role Type</li><li>Product Name</li><li>Features</li><li>Explorer Data Restriction</li></ul>Select/Unselect the values of these parameters to search the roles list.";
    //editRole: string = "Click here to edit role-product permissions.";
    deleteRole: string = "<h5 style='text-align:center'>Role Actions</h5><b>Edit Role:</b>  Click here to edit role-product permissions.<br/><b>Delete:</b> Click here to delete the role-product combination. <br/><b>Note:</b><br/><ul><li>You cannot delete admin role.</li><li>Roles that have users associated with them will not be deleted.</li></ul>";
    roleListDownload: string = "Click here to download the list of roles in csv (Comma Separated Value) format.<br/>Filters that are applied on the screen are not applicable to the list that is downloaded.";
    roleListglobalSearch: string = "Enter search criteria to search by the following parameters:<br/><ul><li>Role Name</li><li>Role Type</li><li>Product Display Name</li><li>Features (Example:  Dashboards, LogVault etc...)</li></ul>A minimum of 3 characters must be entered to begin the search.";
    roleListPageSize: string = "Click here to select the maximum number of records to be displayed per page - from the available options.  By default 10 is the page size.";
    roleListPagination: string = "Click on each page number to navigate to the specific page.<br/>Click on next (>>) to move to the next page from the current page.<br/>Click on previous (<<) to move to the previous page from the current page.";
    roleListDelete: string = "Click here to delete one or more selected roles.<br/>The selected roles are deleted after confirmation.<br/><b>Note:</b><ul><li>You cannot delete admin role.</li><li>Roles that have users associated with them will not be deleted.</li></ul>";
    roleListAddProd: string = "Click here to add a product to the selected role.<br/>If the selected role is already associated to all the products configured for your organization, you cannot add product to the role.";
    roleLostAddRole: string = "Click here to add a new role.";

    //User List Page Helpers
    userLicensesHelp: string = "Total No. of users created / No. of user licenses that the organization has bought for glassbeam application.<br/><b>Note:</b>  A user whose status is INACTIVE or INVITED also consumes a user license."
    viewerLicensesHelp: string = "Total No. of users with 'Dashboard Viewer' license / No. of 'Dashboard Viewer' licenses that your organization has purchased";
    explorerLicensesHelp: string = "Total No. of users with 'Workbench Explorer' license / No. of 'Workbench Explorer' licenses that your organization has purchased";
    creatorLicensesHelp: string = "Total No. of users with 'Workbench Creator' license / No. of 'Workbench Creator' licenses that your organization has purchased";
    userFilter: string = "Click here to expand the filter and search based on the following parameters:<br/><ul><li>Name</li><li>Email</li><li>Role</li><li>System Group</li><li>Created On</li><li>Modified On</li><li>Last Login</li><li>End Customer</li><li>Status</li><li>User Type</li></ul>Select/Unselect the values of these parameters to filter the user list.";
    userQuickFilterHelp: string = "By default 'All' filter is selected and both 'Internal' and 'External' type of users will be listed.<br/>Click on 'Internal' to view only internal users.<br/>Click on 'External' to view only external users.";
    userBulkEditHelp: string = "Click here to edit more than one user.<br/>This option is enabled only if<ul><li>'Internal' or 'External' filters are applied</li><li>More than one user is selected from the list</li>";
    userGlobalSearchHelp: string = "Enter search criteria to search by the following parameters:<br/><ul><li>Name</li><li>Email</li><li>Role</li><li>System Group</li><li>Status</li><li>User Type</li></ul>A minimum of 3 characters must be entered to begin the search.";
    userDownloadPop: string = "Click here to download the list of users in csv (Comma Separated Value) format.<br/>Filters that are applied on the screen are not applicable to the list that is downloaded.";
    //userEditUserHelper: string = "Click here to edit all user information except <b>Email.</b>";
    userActionHelper: string = "<h5 style='text-align:center'>User Actions</h5><b>Edit User:</b>  Click here to edit corresponding user information except Email.<br/><b>Inactivate/Activate User:</b> Click here to toggle the user status between ACTIVE and INACTIVE. This option is disabled for users in the INVITED status.  Admin user cannot be inactivated.<br/><b>Change password:</b> Admin users can reset any user’s password using this option.<br/><b>Delete User:</b>  Click here to delete corresponding user after confirmation.";
    userChangePasswordHelper: string = "Admin users can reset any user’s password using this option.";
    userDeleteHelper: string = "Click here to delete one or more selected users.<br/>The selected users are deleted after confirmation.";
    userAddUserHelper: string = "Click here to add a new user.";
    userAddUserCodeHelp: string = "Country Code and Phone are mandatory only if one of them has information.";
    addUserDefProd: string = "The default product is the landing product for the user upon login.  However the user is still associated to all the products of the selected role.";
    addUserEndCust: string = "Upon associating a System Group, the user will be able to look up data for only those devices that are associated to the System Group.<br/>If 'All' option is selected, the user must be able to look up data for all the devices of all the products that are associatted with the selected role.<br/><b>Note:</b> 'All' option exists only for internal users.";
    bulkUserDefProdCust: string = "The default product is the landing product for the users upon login.  However the users are still associated to all the products of the selected role.";
    bulkUserEndCust: string = "Upon associating a System Group, the users will be able to look up data for only those devices that are associated to the System Group.<br/>If 'All' option is selected, the user must be able to look up data for all the devices of all the products that are associatted with the selected role.<br/><b>Note:</b> 'All' option exists only for internal users.";

    //End Customer Page Helper
    endCustFilter: string = "Click here to expand the filter and search based on the following parameters:<br/><ul><li>Group Name</li><li>Device ID</li><li>Created By</li><li>Modified On</li><li>Product</li></ul>Select/Unselect the values of these parameters to search the System Group list.";
    endCustGlobalSearch: string = "Enter search criteria to search by the following parameters:<br/><ul><li>Group Name</li><li>Device ID</li><li>Created By</li><li>Product</li></ul>A minimum of 3 characters must be entered to begin the search.";
    endCustDownloadPop: string = "Click here to download the list of system groups in csv (Comma Separated Value) format.<br/>Filters that are applied on the screen are not applicable to the list that is downloaded.";
    endCustEditEcHelper: string = "Click here to edit System Group.";
    endCustDelEcHelper: string = "<h5 style='text-align:center'>System Group Actions</h5><b>Edit System Group:</b>  Click here to edit System Group.<br/><b>Delete:</b> Click here to delete the System Group.<br/><b>Note:</b> System Groups that are contained in other System Groups or that have users associated with them will not be deleted.";
    endCustDelHelper: string = "Click here to delete one or more selected System Groups.<br/>The selected System Groups are deleted after confirmation.<br/><b>Note:</b>System Groups that are contained in other System Groups or that have users associated with them will not be deleted.";
    endCustAddEcHelper: string = "Click here to add a new System Group.";
    endCustAddEndCustProdHelper: string = "Select a product from the list of configured products for your organization.";
    endCustAddEndCustSearchHelper: string = "Click here to select from the available list of search parameters.  The search parameters can be configured for your organization.<br/>Enter the search values for the selected parameters.<br/>Click on the search button to list all the available devices for a product - based on the search criteria."
    SysIdGroupTabsHelper: string = "Switch between SysId and Group tabs to view the list of available Device Ids and Groups.";
    addEndCustAddSysID: string = "Click here to move Device Ids or Groups from 'Available Devices' to 'Selected Devices'.";
    addEndCustRemoveSysID: string = "Click here to move Device Ids or Groups from 'Selected Devices' to 'Available Devices'.";
    addEndCustSeleDev: string = "List of all the Device Ids and/or System Groups that will be associated to this System Group upon click of 'Save' button.";
}