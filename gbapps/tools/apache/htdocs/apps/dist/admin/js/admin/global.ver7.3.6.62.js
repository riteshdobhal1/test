angular.module('gbAdminApp.globalservices', [])
.factory('GlobalService', ['$http', '$location',
	function($http, $location) {
		var info = {};
		info.umsDomain = getCookie('umsDomain');
		info.httpProtocol = "http";
		var globalObj = {};
		globalObj.debug = 1;
                globalObj.umsNewApiVer = "v2";
		globalObj.umsDomain = getCookie('umsDomain');
		globalObj.mainTitle = "Glassbeam - Product Intelligence on Demand";
		globalObj.timeoutDelay = 15000;//10 seconds
        globalObj.oldStackMessage = "We are in the process of migrating all glassbeam users to our new login portal. Your account is yet to be moved. Please use the following <link> to login";
        globalObj.ibmNewStackMessage = "We have migrated your Glassbeam application to on premise (IBM's Data Centre). Please use the following <link> to access Glassbeam";
        globalObj.oldLoginMessage = "Click <here> to go to the Old login Portal";
        globalObj.timeoutMessage = "Session timed out. Please login again";
        globalObj.sendingLink = "Mailing link to your email id";
        globalObj.settingPassword = "Setting your password...";
        globalObj.settingPasswordSuccess = 'User registered successfuly.';
        globalObj.passwordUpdatedSuccess = 'Password updated successfully';
        globalObj.resetPassHeader = "Reset Password for ";
        globalObj.resetPassHelp = "This will be new password for this user.";
        globalObj.updatePassword = "Password is successfully reset for user with email ";
        globalObj.updatePasswordMsgHeader = "Password Reset Done";
        globalObj.updatePasswordMsg = " password is set successfully";
        globalObj.passwordMatchError = "Password didn't match";
        globalObj.passwordSpaceError = "Password not valid";
				globalObj.page = 1;
				globalObj.count = 10;
				globalObj.pageCount = [5,10,15,20];
				globalObj.phoneNumberNotValid = "Phone number is not valid";
				globalObj.genericUser = "generic";
				globalObj.sessionExpired = "Session Expired. Please login again";
				globalObj.workbenchFeatureError = "Workbench feature cannot be assigned to this role as number of users associated to this role are more than licences remaining."
				globalObj.creatorFeatureError = "Creator feature cannot be assigned to this role as number of users associated to this role are more than licences remaining."
				globalObj.rnaFeatureMsg = "Rules & Alert feature is already enabled for some other user associated to some role. Please assign different role or deselect Rules & Alert from this role";
				globalObj.rnafeatureAddMsg = "Rules & Alert feature cannot be assigned to this role as it is already enabled for some user under different role";
				globalObj.rnafeatureAddMsg2 = "Rules & Alert feature cannot be enabled to this role as it is already enabled for a role having user associated to it";
				globalObj.UserStateNotValid = "State cannot have numbers";
				globalObj.UserCountryNotValid = "Country cannot have numbers";
				globalObj.charLimitError = "Field cannot have more than 50 characters";
				globalObj.logOutUrl = getCookie('logouturl');
				if(globalObj.logOutUrl != undefined) {
					localStorage.setItem("logOutUrl", globalObj.logOutUrl);
				}
				globalObj.realmHelp = "Select  Environment";
				globalObj.wbUsernameHelp = "<b>Power User</b> : Will have workbench access <br> <b>Generic User</b> : No workbench Access";
				globalObj.deletedMsg = "Selected users are successfully deleted.";
				globalObj.deletedSingleMsg = "Selected user is successfully deleted.";
				globalObj.deletedMsgHeader = "Delete User";
				globalObj.addUserMsg = "User added successfully.";
				globalObj.sessionTimedOutHeader = "Session Timed Out";
				globalObj.usersRemainingTitle = "Users Remaining";
				globalObj.remainingLicenseTitle = "Workbench Licenses Used";
				globalObj.usersAddedTitle = "Added Users";
				globalObj.totalLicenseTitle = "Workbench Users Licenses";
				globalObj.totalUsersTitle = "Users Licenses";
				globalObj.maxUserReached = "Maximum limit for Users is reached";
				globalObj.noRemainingLiceses = "All licences for Workbench access used, please assign different role to user without Workbench access.";
				globalObj.noCreatorLiceses = "All licences for Creator access used, please assign different role to user without Creator access.";

				globalObj.sessionTimedOutMsg = "Session Timed Out ! Please login again.";
				globalObj.roleDeletedMsg = "Selected Role Deleted.";
				globalObj.roleDeletedMsgMultiple = "Selected Roles Deleted.";
				globalObj.editUserMsg = "User updated successfully.";
				globalObj.editUserMsgHeader = "Edit User";
				globalObj.noUserMsg = "No Users Available.";
				globalObj.addUserMsgHeader = "Add User";
				globalObj.addRoleMsgHeader = "Add Role";
				globalObj.editRoleModalHeader = "Edit Role Product Permissions";
				globalObj.AddNewUserModalHeader = "Add New User";
				globalObj.updateRoleMsgHeader = "Edit Role";
                globalObj.deleteConfirmMsg = "Are you sure you want to delete?"
				globalObj.updateRoleMsg = "Role updated successfully.";
				globalObj.addUserDuplicateEmail = "This Email Id is already associated to other user";
				globalObj.addRoleErrorMsg = "This role name is already added.";
				globalObj.errorDeletedMsg = "Role cannot be deleted. Please deselect the admin role.";
				globalObj.AddProdErrorMsg = " Product is already added.";
				globalObj.AddProdErrorMsg2 = " MPS is already associated to other Product.";
				globalObj.associatedRoleDeleError = "cannot be deleted as it is already associated to one or more users. Please disassociate the role and try again.";
				globalObj.nofeatureselected = "No features selected. Please assign at least one feature to role.";
				globalObj.prodAddedMsg = "Product added successfully.";
				globalObj.defaultFeatureErrorMsg = "Default feature cannot be deselected.";
				globalObj.addProdcutMsgHeader = "Add Product";
				globalObj.themeSupport = false;
				globalObj.adminRoleDeleteMsgHeader = "Error Deleting Role.";
				globalObj.sessionTimeOutHeader = "ERROR";
				globalObj.sessionTimeOutMessage = "Session timed out. Please login again";
				globalObj.adminRoleEditHeader = "Edit Role Error";
				globalObj.adminRoleEditMsg = "Error! Admin Role Cannot be edited.";
				globalObj.roleNameNotValid = "Role name can not have characters other than numbers, alphabets , -, _ ,.";
				globalObj.noFeatureWarningMsg = "Healthcheck is not enabled for this product. Please contact";
				// NOTE: The property "value" in globalObj.roleFeatures should match with globalObj.enableDisableFeatures
				globalObj.roleFeatures = [
					{'name' : 'Dashboards', 'value':'dashboards', 'checked':false, 'disabled':false, 'category':'dashboards'},
					{'name' : 'Dashboard Admin', 'value':'dashboard_admin', 'checked':false, 'disabled':true, 'category':'dashboards'},
					{'name' : 'Workbench *', 'value':'workbench', 'checked':false, 'disabled':true, 'category':'dashboards'},
					{'name' : 'Creator', 'value':'wb_creator', 'checked':false, 'disabled':true, 'category':'dashboards'},
					{'name' : 'Rules & Alerts', 'value':'rules_and_alerts', 'checked':false, 'disabled':false, 'category':'rules_and_alerts'},
					{'name' : 'Rule Creator', 'value':'rule_creator', 'checked':false, 'disabled':true, 'category':'rules_and_alerts'},
					{'name' : 'Explorer', 'value':'explorer', 'checked':false, 'disabled':false, 'category': 'others'},
					{'name' : 'Logvault', 'value':'logvault', 'checked':false, 'disabled':false, 'category': 'others'},
					{'name' : 'File Upload', 'value':'file_upload', 'checked':false, 'disabled':false, 'category': 'others'},
					{'name' : 'Health Check', 'value':'healthcheck', 'checked':false, 'disabled':false, 'category': 'others'}
					//{'name' : 'Apps', 'value':'apps', 'checked':false, 'disabled':false},
				]

				// This config is used to enable and disable feature in controller.js in functions(defaultFeature(), )
				globalObj.enableDisableFeatures = {
					'rules_and_alerts': {
						enableFeatures: ['rule_creator'],
						disableFeatures: ['rule_creator']
					},
					'dashboards': {
						enableFeatures: ['dashboard_admin'],
						disableFeatures: ['dashboard_admin', 'workbench', 'wb_creator']
					},
					'dashboard_admin': {
						enableFeatures: ['workbench'],
						disableFeatures: ['workbench']
					},
					'workbench': {
						enableFeatures: ['wb_creator'],
						disableFeatures: ['wb_creator']
					}
				}
				globalObj.defaultDisabledRoleFeatures = ['rule_creator', 'dashboard_admin', 'workbench'];
				globalObj.userwb_user_name = [{
					  id: "",
					  label: 'Select User Type'
					}, {
				  id: 1,
				  label: 'Power User'
				}, {
				  id: 2,
				  label: 'Generic'
				}];
				globalObj.AddRoleRealm = ["qaui"];
				globalObj.AddUserRealm = "qaui";
				globalObj.roleRealm = [{
				  id: 1,
				  label: 'prod'
				}, {
				  id: 2,
				  label: 'poc'
				}];
				globalObj.defaultRealm_Def = [{
					  id: "",
					  label: 'Select Default Environment'
					}, {
				  id: 1,
				  label: 'prod'
				}, {
				  id: 2,
				  label: 'poc'
				}];
				// Add User Mandetory Fields
				globalObj.addUserMandetoryFields = ["first_name","email"];
				globalObj.addRoleMandetoryFields = ["addRoleName","addRoleDomain"];
				globalObj.adminRoleList = [{
		        field : "DisName",
		        title : "Role Name",
		        enabled : true
		    }, {
		        field : "roleType",
		        title : "Role Type",
		        enabled : true
		    }, {
		        field : "domainMPS",
		        title : "Product Display Name - Features",
		        enabled : true
		    }];
				// Admin Page User List Visible columns
		    globalObj.adminUserList = [{
		        field : "name",
		        title : "Name",
		        enabled : true
		    }, {
		        field : "org",
		        title : "Organization",
		        enabled : false
		    }, {
		        field : "email",
		        title : "Email",
		        enabled : true
		    }, {
		        field : "role",
		        title : "Role",
		        enabled : true
		    }, {
		        field : "end_customer",
		        title : "End Customer",
		        enabled : true
		    }, {
		        field : "mps_def",
		        title : "MPS Def",
		        enabled : false
		    }, {
		        field : "realm_def",
		        title : "Realm Def",
		        enabled : false
		    }, {
		        field : "url_def",
		        title : "URL Def",
		        enabled : false
		    }, {
		        field : "sso",
		        title : "SSO",
		        enabled : false
		    }, {
		        field : "wb_user_name",
		        title : "WB User Name",
		        enabled : false
		    }, {
		        field : "created_on",
		        title : "Created On",
		        enabled : true
		    }, {
		        field : "modified_on",
		        title : "Modified On",
		        enabled : true
		    }, {
		        field : "last_login",
		        title : "Last Login",
		        enabled : true
		    }, {
		        field : "report_usage",
		        title : "Report Usage",
		        enabled : false
		    },{
		        field : "active",
		        title : "Status",
		        enabled : true
		    },{
		        field : "show_info",
		        title : "Show Help",
		        enabled : false
		    },{
				field : "is_external",
				title : "User Type",
				enabled : true
			}, {
		        field : "dashboard_admin",
		        title : "Dashboard Admin",
		        enabled : false
		    }];
		globalObj.errorMsgs = {
            '101' : 'Infoserver is down',
            '102' : 'H2 is down',
            '103' : 'LCP is down',
            '104' : 'Tableau server is down',
            '105' : 'Logi server is down',
            '106' : 'GBStudio server is down'
		};
		globalObj.emailNotValid = "Not a valid email";
		var infoserverDomain = getCookie('infoserverDomain');
		globalObj.infoserverDomain = decodeURIComponent(infoserverDomain);
		globalObj.timeListFilter = [{
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
			name : "Last 6 Month",
			value: "6month",
			checked: false
		}];
		globalObj.userFilterGroupedData = [{
			columnName : 'email',
			columnTitle : "Email",
			data : [],
			multiselect: true,
			isDateType: false,
			showSearch: true
		},{
			columnName : 'role',
			columnTitle : "Role",
			data : [],
			multiselect: true,
			isDateType: false,
			showSearch: false
		},{
			columnName : 'end_customer',
			columnTitle : "End Customer",
			data : [],
			multiselect: true,
			isDateType: false,
			showSearch: false
		},{
			columnName : 'created_on',
			columnTitle : "Created On",
			data : [],
			multiselect: false,
			isDateType: true,
			showSearch: false
		},{
			columnName : 'modified_on',
			columnTitle : "Modified On",
			data : [],
			multiselect: false,
			isDateType: true,
			showSearch: false
		},{
			columnName : 'last_login',
			columnTitle : "Last Login",
			data : [],
			multiselect: false,
			isDateType: true,
			showSearch: false
		},{
			columnName : 'status',
			columnTitle : "Status",
			data : [{name: 'Active', selected:  false}, 
			  {name: 'Inactive', selected: false}],
			multiselect: false,
			isDateType: false,
			showSearch: false
		},{
			columnName : 'user_type',
			columnTitle : "User Type",
			data : [{name: 'Internal', selected: false},
			  {name: 'External', selected: false}],
			multiselect: false,
			isDateType: false,
			showSearch: false
		}];

		globalObj.endCustomerFilterGroupedData = [{
			columnName : 'endcustomer_name',
			columnTitle : "End Customer Name",
			isDateType: false,
			multiselect : true,
			data : [],
			showSearch: true
		},{
			columnName : 'serial_number',
			columnTitle : "Device ID",
			isDateType : false,
			multiselect : true,
			data : [],
			showSearch: true
		},{
			columnName : 'created_by',
			columnTitle : "Created By",
			isDateType : false,
			multiselect : true,
			data : [],
			showSearch: false
		},{
			columnName : 'updated_on',
			columnTitle : "Updated On",
			isDateType : true,
			multiselect : false,
			data : [],
			showSearch: false
		}];
		globalObj.gbUserOrgType = 1000;
		//Generic WB Username
		globalObj.genericWbusername = "generic";
		globalObj.tableauSiteRoleFeaturesMap = [
			{
				site_role: 'SiteAdministratorCreator',
				features: ['Dashboards', 'DashboardAdmin', 'Workbench', 'Creator']
			},
			{
				site_role: 'SiteAdministratorExplorer',
				features: ['Dashboards', 'DashboardAdmin', 'Workbench']
			},
			{
				site_role: 'Explorer',
				features: ['Dashboards', 'DashboardAdmin']
			}
		];
		return {
		    setGlobals : function(adminEmail) {
                globalObj.infoserverDown =  "Error-" + Object.keys(globalObj.errorMsgs)[0] +".Please contact <a href='mailto:" + adminEmail + "'>" + adminEmail + "</a>";
                globalObj.AUTHFAILED = "Authentication server not available. Please contact <a href='mailto:" + adminEmail + "'>" + adminEmail + "</a>";
		    },
			getUmsDomain : function() {
				if(!info.umsDomain) {
					info.umsDomain = getCookie('umsDomain');
				}
				return info.umsDomain;
			},
			gethttpProtocol : function() {
				return info.httpProtocol;
			},
			setUmsDomain : function(domainName) {
				info.umsDomain = domainName;
			},
			showLoading : function(msg){
				if(msg){
					document.getElementById('gb-loader-msg').innerHTML = msg;
				}
		        var loader = document.getElementById('gb-first-time-loader');
		        loader.className = "gb-first-time-loader gb-show";
			},
			hideLoading : function(){
		        var loader = document.getElementById('gb-first-time-loader');
		        loader.className = "gb-first-time-loader gb-hide";
			},
			setSessionCookies : function(token) {

	            //get domain name from url
	            var domain = $location.host().split(/\.(.+)?/)[1];
				//Retrive infoserver domain
				//if(info.infoserverDomain) {
					/*var infoD = info.infoserverDomain.split(":");
					var infoserverName = infoD[1];*/
					document.cookie = token+";domain="+domain+";path=/";
				//}
			},
			getVal : function(key) {
                return globalObj[key];
			},
			setVal : function(key, value) {
				globalObj[key] = value;
			},
			logError : function(errMsg){
				if(globalObj.debug)
				{
					console.error(errMsg);
				}
			}
		}
	}
])
