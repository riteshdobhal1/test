angular.module('gbAdminApp.services', [])
.factory('AdminService', ['$http','$cookieStore', '$cookies', 'MessageService', 'GlobalService','$window',
function($http, $cookieStore, $cookies, MessageService, GlobalService,$window) {

	var umsDomain = getCookie('umsDomain');	
	var infoserverDomain = GlobalService.getVal('infoserverDomain');
	var umsNewApiVersion = GlobalService.getVal('umsNewApiVer');
	var features, loggedInUser, siteId, realmInfo;

	if(umsDomain){
		var tArray = umsDomain.split('/');
		var version = tArray.pop();
		var slaves = {};
		slaves[tArray.join("/")]= "/"+version+"/xproxy";
	}
	if(infoserverDomain) {
		var tArray = infoserverDomain.split('/');
		var version = tArray.pop();
		slaves[tArray.join("/")] = "/"+version+"/xproxy";
	}
	xdomain.slaves(slaves);
	// var infoserverInternalDomain = GlobalService.getVal('infoserverInternalDomain');
	var pagesId = [];//'gbAdminForm', 'gbSelectDomainForm', 'sendEmail', 'gbFirstTimeForm', 'gbForgotForm'];
	return {
		standard_user_tracking: function (application, module, activity, details, solrQuery) {
			var usertrackingDetailsLimit = GlobalService.getVal('usertracking_details_limit');
			var url;
			var result = {};
			var params = {};
			var mps = getCookie('mps').split(":");
			params['switched_feature'] = "Admin Console";
			url = umsDomain + '/user_tracking/' + mps[0] + '/' + mps[1] + '/' + mps[2] + '/' + application + '/' + module + '/' + activity;
			$cookies.prevApplication = application;
			return $http.post(url, {
				"details": details,
				"solr_query": !!solrQuery ? solrQuery : ""
			}, {params: params});
		},
    	windowFailed : function(msg, title) {
	    	MessageService.setError(msg, title);
	    },
	    windowSuccess : function(msg, title) {
	    	MessageService.setSuccess(msg, title);
	    },
	    windowWarning : function(msg, title) {
	    	MessageService.setWarning(msg, title);
	    },
			getUserList : function() {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.get(umsDomain + '/customer/user/listnonsso/' + mps[0], {
					});
				}
	    },
			getRoleList : function() {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.get(umsDomain + '/admin/usermanagement/role/list/' + mps[0], {
					});
				}
	    },
			addNewUser: function (params) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/admin/customer/user/add/" + mps[0] , params);
				}
			},
            editUser: function (params) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/customer/user/modify/"+mps[0], params);
				}
			},
			addNewRole: function (params) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/admin/usermanagement/role/add/"+mps[0], params);
				}
			},
			editRole: function (params) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/admin/usermanagement/role/modify/"+mps[0], params);
				}
			},
			resetPass: function (params) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/user/reset/passwd/"+mps[0], params);
				}
			},
			deleteUser: function (params) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/customer/user/remove/" +params+"/"+mps[0]);
				}
			},
			disableUser: function (params) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/customer/user/disable/" +params+"/"+mps[0]);
				}
			},
			enableUser: function (params) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/customer/user/enable/" +params+"/"+mps[0]);
				}
			},
			deleteRole: function (params) {
					 if(getCookie('mps') == undefined){
                                        $window.location.href = localStorage.getItem("logOutUrl");
                                }else {
                                        var mps = getCookie('mps').split(":");
					return $http.post(umsDomain + "/admin/usermanagement/role/delete/" +params + "/" + mps[0]);
				}
			},
			logoutInfoserver: function () {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
	        			return $http.get(umsDomain + '/aa/logout_admin?mps='+ mps[0] + ':' + mps[1] + ':' + mps[2]);
				}
    	},

			getLoginFields : function() {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split(":");
					return $http.get(umsDomain + '/admin/role/user/details/'+mps[0]+'/'+mps[1]+'/'+mps[2],{ });

				}
		},
		
		updateAccessTime: function () {

			var application = "application";
			var module = "admin";
			var activity = "document_click";
			var details = JSON.stringify({details:"admin"});	
			if(getCookie('mps') == undefined){
                                $window.location.href = localStorage.getItem("logOutUrl");
                        }else {
                		var url;
                		var params = {};
				var mps = getCookie('mps').split(":");

                		url = umsDomain + '/user_tracking/' + mps[0] + '/' + mps[1] + '/' + mps[2] + '/' + application + '/' + module + '/' + activity;
                		return $http.post(url, {
                    		"details": details,
                    		"solr_query": ""
                		}, {params: params});

			}
        },

		getSysIdList: function(product, startIndex, endIndex, searchText){
			var infoserverDomain = GlobalService.getVal('infoserverDomain');
			var url = '';
			var mps = product.split(":");
			url = infoserverDomain + '/analytics/system/ec/list/'+mps[0]+'/'+mps[1]+'/'+mps[2]+'/'+mps[0]+'/'+ startIndex+ '/'+endIndex;
			if(searchText){
				url = infoserverDomain + '/analytics/system/ec/list/'+mps[0]+'/'+mps[1]+'/'+mps[2]+'/'+mps[0]+'/'+ startIndex+ '/'+endIndex + '?pattern=' + searchText;
			}
			return $http.get(url,{ });
		},

		getEndCustomersList: function(){
			var mps = getCookie('mps').split(":");
			return $http.get(umsDomain + '/healthcheck/ec/details/' + mps[0]);
		},

		addEndCustomer: function(product,params){
			var mps = product.split(":");
			return $http.post(umsDomain + '/healthcheck/ec/add/' +mps[0]+'/'+ mps[1]+'/'+mps[2], params);
		},

		updateEndCustomer: function(product,params){
			var mps = product.split(":");
			return $http.post(umsDomain + '/healthcheck/ec/update/' +mps[0]+'/'+ mps[1]+'/'+mps[2], params);
		},

		deleteEndCustomer: function(endCustomers){
			var params = {};
			var mps = getCookie('mps').split(":");
      var umsNewApiVersionUrl = umsDomain.slice(0,umsDomain.length-2) + umsNewApiVersion; 
			params.endcustomer_name = endCustomers;
			params.mps = mps[0] + ":" + mps[1] + ":" + mps[2];
			return $http.post(umsNewApiVersionUrl + '/healthcheck/ec/delete/' +mps[0]+'/'+ mps[1]+'/'+mps[2], params);
		},

		getSysIdCount: function(product){
			var infoserverDomain = GlobalService.getVal('infoserverDomain');
			var mps = product.split(":");
			return $http.get(infoserverDomain + '/analytics/system/ec/count/'+mps[0]+'/'+mps[1]+'/'+mps[2]+'/'+mps[0],{ });
		},

		deleteProduct: function (roleName, mps) {
			var umsNewApiVersionUrl = umsDomain.slice(0,umsDomain.length-2) + umsNewApiVersion; 
			if(getCookie('mps') == undefined){
				$window.location.href = localStorage.getItem("logOutUrl");
			}else {
				// var mps = getCookie('mps').split(":");
				return $http.post(umsDomain + '/admin/usermanagement/role/product/delete/' +roleName+'/'+mps[0]+'/'+ mps[1]+'/'+mps[2]);
			}
		},

		setLoggedInUser: function(user){
			loggedInUser = user;
		},

		getLoggedInUser: function(){
			return loggedInUser;
		},

		setLoggedInUserFeatures: function(permissions){
			features = permissions;
		},

		getLoggedInUserFeatures: function(){
			return features;
		},

		isPowerUser: function(){
			if(features){
				var ispoweruser = features.indexOf('workbench') > -1 ? true : false;
			}
			return ispoweruser;
		},

		getTableauUser : function() {
			var userInfo = this.getLoggedInUser();
			var genericWbusername = GlobalService.getVal('genericWbusername');
			if(features && features.indexOf('workbench') > -1){
				if(userInfo.org_type == GlobalService.getVal("gbUserOrgType")){
						return "glassbeam";
				}else {
						return userInfo['email'];
				}
			}else {
				return genericWbusername;
			}
		},

		getUserName: function () {
			var userInfo = this.getLoggedInUser();
			if ((!userInfo.first_name && !userInfo.last_name) || (userInfo.first_name == 'NA' && userInfo.last_name == 'NA')) {
					return userInfo.email;
			}
			return (userInfo.first_name != 'NA' ? (userInfo.first_name + " ") : '') + (userInfo.last_name != 'NA' ? userInfo.last_name : '');
		},

		getTableauSiteId : function() {
			var infoserverDomain = GlobalService.getVal('infoserverDomain');
			var mps = getCookie('mps').split(":");
			var params = {};
			if(this.isPowerUser()) {
					params['power'] = this.isPowerUser();
					params['full_name'] = this.getUserName();
			}
			return $http.get(infoserverDomain + '/tableau/siteuser/info/' + mps[0] + '/' + mps[1] + '/' + mps[2] + '/' + this.getTableauUser(), {params: params});
		},

		setSiteId: function(id){
			siteId = id;
		},

		getSiteId: function(){
			return siteId;
		},

		getRealmDetails: function(){
			var mps = getCookie('mps').split(":");
			return $http.get(umsDomain + '/realm/' + mps[0] + '/' + mps[1] + '/' + mps[2]);
		},

		setRealmData: function(data){
			realmInfo = data;
		},

		getRealmData: function(){
			return realmInfo;
		},

		enableSiteAdminCreatorRole: function(){
			var enable = false;
			var realmData = this.getRealmData();
			if(
				(realmData.vertica_port !== null && realmData.vertica_port !== "" && realmData.vertica_port !== "NA") && 
				(realmData.vertica_pwd !== null && realmData.vertica_pwd !== "" && realmData.vertica_pwd !== "NA") && 
				(realmData.vertica_server !== null && realmData.vertica_server !== "" && realmData.vertica_server !== "NA") && 
				(realmData.vertica_user !== null && realmData.vertica_user !== "" && realmData.vertica_user !== "NA")){
				enable = true;
			}	
			return enable;		
		},

		addNewTableauUser: function(data){
			if(getCookie('mps') == undefined){
				$window.location.href = localStorage.getItem("logOutUrl");
			}else {
				var mps = getCookie('mps').split(":");
				return $http.post(umsDomain + '/admin/tableau/tableauAddUpdateUsers/' +mps[0]+'/'+ mps[1]+'/'+mps[2], data);
			}
		},

		updateTableauRoleUsers: function(data){
			if(getCookie('mps') == undefined){
				$window.location.href = localStorage.getItem("logOutUrl");
			}else {
				var mps = getCookie('mps').split(":");
				return $http.post(umsDomain + '/admin/tableau/tableauUpdateRole/' +mps[0]+'/'+ mps[1]+'/'+mps[2], data);
			}
		},

		deleteTableauRoleUsers: function(data){
			if(getCookie('mps') == undefined){
				$window.location.href = localStorage.getItem("logOutUrl");
			}else {
				var mps = getCookie('mps').split(":");
				return $http.post(umsDomain + '/admin/tableau/tableauDeleteUsers/' +mps[0]+'/'+ mps[1]+'/'+mps[2], data);
			}
		}
  };
}])
.factory('MessageService', ['$http',
	function($http) {
		var messages = [];
		return {
			setError : function(msg, title) {
				 $('#gb-message-alert').modal();
				 $("#gb-message-title").text(title?title:"LOGIN");
				 $("#gb-message-text").html('<div class="alert alert-danger">'+msg+'</div>');
			},
			setSuccess : function(msg, title) {
				 $('#gb-message-alert').modal();
				 $("#gb-message-title").text(title?title:"LOGIN");
				 $("#gb-message-text").html('<div class="alert alert-success">'+msg+'</div>');
			},
			setWarning : function(msg, title) {
				 $('#gb-message-alert').modal();
				 $("#gb-message-title").text(title?title:"LOGIN");
				 $("#gb-message-text").html('<div class="alert alert-warning">'+msg+'</div>');
			},
			getMessage : function(msg) {
				return messages;
			}
		}
	}
])
.factory('GlobalMessages', [
	function(){
		var msg = {};
		msg.INVALIDEMAIL = "Please enter valid email.";
		msg.EMPTYEMAIL = "Please enter value for email.";
		msg.EMPTYPASSWORD = "Please enter value for password.";
		msg.MINLENPASSWORD = "Password should be minimum four character long.";
		msg.MAILSEND_SUCCESS_TITLE = "We’ve sent you a link to change your password";
		msg.MAILSEND_SUCCESS_MSG = "We’ve sent you an email that will allow you to reset your password.";
		msg.MAILSEND_FAILURE_MSG = "We couldn't find a Glassbeam account associated with ";
		msg.PASSWORDMISSMATCH = "Password not matching!";
		msg.PAGE_TITLE = "Glassbeam : Administrator";
		msg.ONE_TIME_MSG = "Please set your password(one-time setup) before you start using the Glassbeam.";
		return{
			getValue :  function(key) {
				return msg[key];
			}
		}
	}
])
.factory('APILoader', [
	function() {
		return{
	        show : function(){
	        },
	        hide : function() {

	        }
		}
	}
])

// Controller to handle the change of page
angular.module('gbAdminApp.controllers', ['ngDraggable', 'angular.filter'])
  .controller('MainCtrl', ['$scope', '$location', 'AdminService', 'GlobalMessages', 'GlobalService', 'MessageService',
    function ($scope, $location, AdminService, GlobalMessages, GlobalService, MessageService) {
      angular.element(window.document)[0].title = GlobalMessages.getValue('PAGE_TITLE');
      $scope.logo = "";
      $scope.logo_url = "";
      $scope.logo_url = '/apps/app/login/images/logo.png';
      $scope.logo = '/apps/app/login/images/logo.png';
    }
  ])
  .controller('ManageUserCtrl', ['$scope', '$location', 'AdminService', 'GlobalMessages', 'GlobalService', 'MessageService', 'ngTableParams', '$filter', '$window', '$document', '$timeout',
    function ($scope, $location, AdminService, GlobalMessages, GlobalService, MessageService, ngTableParams, $filter, $window, $document, $timeout) {

      angular.element(window.document)[0].title = GlobalMessages.getValue('PAGE_TITLE');
      $scope.logo = "";
      $scope.currentDomain = $location.host().split(/\.(.+)?/)[1];
      $scope.logo_url = "";
      $scope.data_loading = false;
      $scope.logo_url = '/apps/app/login/images/logo.png';
      $scope.logo = '/apps/app/login/images/logo.png';
      $scope.selected = {};
      $scope.userEditSelected = false;
      $scope.singleRoleSelected = false;
      $scope.selectAll = false;
      $scope.data = {};
      $scope.resetPassErrorFlag = false;
      $scope.sessionTimeOutHeader = GlobalService.getVal('sessionTimeOutHeader');
      $scope.themeSupport = GlobalService.getVal('themeSupport')
      $scope.sessionTimeOutMessage = GlobalService.getVal('sessionTimeOutMessage');
      $scope.sessionExpired = GlobalService.getVal('sessionExpired');
      $scope.resetPassHeader = GlobalService.getVal('resetPassHeader');
      $scope.selectedRemove = false;
      $scope.slectedCount = 0;
      $scope.roleSelected = false;
      $scope.selectAllAll = false;
      $scope.isGbStudioEnabled = false;
      $scope.addRoleWarning = true;
      $scope.editRoleWarning = true;
      $scope.addProdWarning = true;
      $scope.rnaFeatureAssigned = false;
      $scope.updatePassword = GlobalService.getVal("updatePassword");
      $scope.resetPassHelp = GlobalService.getVal("resetPassHelp");
      $scope.phoneNumberNotValid = GlobalService.getVal("phoneNumberNotValid");
      $scope.rnaFeatureMsg = GlobalService.getVal("rnaFeatureMsg");
      $scope.roleNameNotValid = GlobalService.getVal("roleNameNotValid");
      $scope.maxUserReached = GlobalService.getVal("maxUserReached");
      $scope.UserStateNotValid = GlobalService.getVal("UserStateNotValid");
      $scope.UserCountryNotValid = GlobalService.getVal("UserCountryNotValid");
      $scope.charLimitError = GlobalService.getVal("charLimitError");
      $scope.emailNotValid = GlobalService.getVal('emailNotValid');
      $scope.usersAddedTitle = GlobalService.getVal('usersAddedTitle');
      $scope.remainingLicenseTitle = GlobalService.getVal('remainingLicenseTitle');
      $scope.totalLicenseTitle = GlobalService.getVal('totalLicenseTitle');
      $scope.totalUsersTitle = GlobalService.getVal('totalUsersTitle');
      $scope.noRemainingLiceses = GlobalService.getVal('noRemainingLiceses');
      $scope.updatePasswordMsgHeader = GlobalService.getVal('updatePasswordMsgHeader');
      $scope.associatedRoleList = [];
      $scope.associatedEndCustomerList = [];
      $scope.associatedRoleProductList = {};
      $scope.addRoleProdDisplayOptions = [];
      $scope.ProdaddRoleProdDisplayOptions = [];
      $scope.allUsersEmailList = [];
      $scope.allRoleNameList = [];
      $scope.newUserDepartment = "";
      $scope.newUserPhone = "";
      $scope.newUserlast_name = "";
      $scope.newUserState = "";
      $scope.newUserCity = "";
      $scope.newUserCountry = "";
      $scope.editUserPhone = "";
      $scope.editUserDepartment = "";
      $scope.editUserState = "";
      $scope.editUserCity = "";
      $scope.editUserCountry = "";
      $scope.deletedSingleMsg = GlobalService.getVal('deletedSingleMsg');
      $scope.deletedMsg = GlobalService.getVal('deletedMsg');
      $scope.editRoleModalHeader = GlobalService.getVal('editRoleModalHeader');
      $scope.AddNewUserModalHeader = GlobalService.getVal('AddNewUserModalHeader');
      $scope.prodAddedMsg = GlobalService.getVal('prodAddedMsg');
      $scope.deleteConfirmMsg = GlobalService.getVal('deleteConfirmMsg');
      $scope.addProdcutMsgHeader = GlobalService.getVal('addProdcutMsgHeader');
      $scope.addRoleMsgHeader = GlobalService.getVal('addRoleMsgHeader');
      $scope.newUserreport_usage = true;
      $scope.deletedMsgHeader = GlobalService.getVal('deletedMsgHeader');
      $scope.addUserMsg = GlobalService.getVal('addUserMsg');
      $scope.addUserMsgHeader = GlobalService.getVal('addUserMsgHeader');
      $scope.addRoleError = true;
      $scope.roleDeletedMsg = GlobalService.getVal('roleDeletedMsg');
      $scope.roleDeletedMsgMultiple = GlobalService.getVal('roleDeletedMsgMultiple');
      $scope.addRoleErrorMsg = GlobalService.getVal('addRoleErrorMsg');
      $scope.sessionTimedOutMsg = GlobalService.getVal('sessionTimedOutMsg');
      $scope.sessionTimedOutHeader = GlobalService.getVal('sessionTimedOutHeader');
      $scope.editUserMsg = GlobalService.getVal('editUserMsg');
      $scope.addUserDuplicateEmail = GlobalService.getVal('addUserDuplicateEmail');
      $scope.editUserMsgHeader = GlobalService.getVal('editUserMsgHeader');
      $scope.errorDeletedMsg = GlobalService.getVal('adminRoleDeleteMsgHeader');
      $scope.adminRoleDeleteMsgHeader = GlobalService.getVal('errorDeletedMsg');
      $scope.associatedRoleDeleError = GlobalService.getVal('associatedRoleDeleError');
      $scope.updateRoleMsgHeader = GlobalService.getVal('updateRoleMsgHeader');
      $scope.updateRoleMsg = GlobalService.getVal('updateRoleMsg');
      $scope.updatePasswordMsg = GlobalService.getVal('updatePasswordMsg');
      $scope.MsgModelHeader = "";
      $scope.MsgModelMessage = "";
      $scope.unSelectAllRole = false;
      $scope.selectAllRole = false;
      $scope.unSelectAll = true;
      $scope.predicate = 'id';
      $scope.deletedUserKey;
      $scope.addUserError = true;
      $scope.addProdError = true;
      $scope.editRoleError = true;
      $scope.totalUsers = 0;
      $scope.powerUsers = 0;
      $scope.noUsers = false;
      $scope.realmHelp = GlobalService.getVal('realmHelp');
      $scope.noUserMsg = GlobalService.getVal('noUserMsg');
      $scope.wbUsernameHelp = GlobalService.getVal('wbUsernameHelp');
      $scope.editUserError = true;
      $scope.loggedInUsername = "";
      $scope.loggedInUserrole = "";
      $scope.loggedInUserroleDisplay = "";
      $scope.newUsermps_defOptions = [];
      $scope.newUserRoleOptions = [];
      $scope.addRoleMfrOptions = [];
      $scope.addRoleProdOptions = [];
      $scope.addRoleSchOptions = [];
      $scope.ispoweruser = false;
      $scope.newUserwb_user_nameOptions = GlobalService.getVal('userwb_user_name');
      $scope.defaultFeatureCheck = getCookie('default_feature');
      $scope.newUserwb_user_name = $scope.newUserwb_user_nameOptions[0];
      $scope.addRoleRealmOptions = GlobalService.getVal('roleRealm');
      $scope.UserColumns = $filter('filter')(GlobalService.getVal('adminUserList'), {
        enabled: true
      });
      $scope.totalUserColumns = $scope.UserColumns.length + 1;
      $scope.roleColumns = $filter('filter')(GlobalService.getVal('adminRoleList'), {
        enabled: true
      });
      $scope.roleList = [];
      $scope.roleMfr = [];
      $scope.roleProd = [];
      $scope.roleSch = [];
      $scope.columnRole = 'name';
      $scope.columnUser = 'name';
      $scope.reverse = false;
      // internal/external user flag
      $scope.newUser_isExternalUser = false;
      $scope.isExternalRole = {val: false};
      $scope.showRoleToggle = false;
      $scope.newUserdashboard_admin = {val: false};
      $scope.editUserdashboard_admin = {val: false};

      //BO: End Customer scope variables

      $scope.endCustomerList = [];
      $scope.sysIdList = [];
      $scope.selectedSysIds = [];
      $scope.unavailableSysids = [];
      $scope.sysIds = {
        toAddList: [],
        toRemoveList: []
      };
      $scope.endCustomerProdName = $scope.newUsermps_defOptions[0];
      $scope.endCustomerProductList = [];
      $scope.addNewEndCustomer = {
        endCustomerName: '',
        prodName: {}
      }
      $scope.editEndCustomer = {};
      $scope.showSysIDList = false;
      $scope.totalSysids = 0;
      var pageSize = 200;

      $scope.pagination = {
        pageSize: pageSize,
        startIndex: 0,
        endIndex: pageSize - 1,
        noOfPages: 0,
        currentPage: 1
      }

      $scope.searchText = {
        val: '',
        tableSearch: '',
        rolelistSearch: ''
      }
      $scope.showErrorMsg = false;
      $scope.shouldCallLoadPages = true;
      $scope.paginationText = '';
      $scope.showSearchBox = false;
      $scope.newUserEndCustomer = {val : ''};
      $scope.editUserEndCustomer = {val: ''};
      $scope.selectedEndCustomerToRemove = false;
      $scope.endCustomersToDelete = [];

      //EO: End Customer scope variables

      // BO: Filter variables
      $scope.showFilterPanel = {
        user: false,
        endCustomer: false
      }
      
      $scope.filterObj = {
        userList: {},
        endCustomerList: {}
      }
      // EO: Filter variables
      $scope.loggedInUser = {};
      $scope.noFeatureWarning = true;

      // All the watch expressions go here
      $scope.$watch('slectedRoleCount', function (newValue, oldValue) {
        if ($scope.slectedRoleCount == 1) {
          for (i = 0; i < $scope.roleList.length; i++) {
            if ($scope.roleList[i].selected) {
              if ($scope.roleList[i].domains.length != $scope.addRoleProdDisplayOptions.length - 1) {
                $scope.singleRoleSelected = true;
                break;
              }
            }
          }
        } else {
          $scope.singleRoleSelected = false;
        }
      });

      $scope.$watch('selectAll', function (newValue, oldValue) {
        if (newValue == true) {
          $scope.selectAllAll = true;
        } else {
          $scope.selectAllAll = false;
        }
      });

      $scope.$watch('selectAllRole', function (newValue, oldValue) {
        if (newValue == true) {
          $scope.selectAllRoleAll = true;
        } else {
          $scope.selectAllRoleAll = false;
        }
      });

      $scope.$watch("searchKeyword", function () {
        resetUserSelectVal();
        if ($scope.users) {
          $scope.tableParams.$params.page = GlobalService.getVal('page');
          $scope.tableParams.reload();
        }
      });

      $scope.$watch("searchText.tableSearch", function () {
        resetEndCustomerSelectVal();
        if ($scope.endCustomerList.length > 0) {
          $scope.endCustomerParams.$params.page = GlobalService.getVal('page');
          $scope.endCustomerParams.reload();
        }
      });

      $scope.$watch("searchText.val", function (oldValue,newValue) {
        if(oldValue !== newValue){
          $scope.shouldCallLoadPages = true;
          $scope.pagination.startIndex = 0;
          $scope.pagination.endIndex = 199;
        }
      });

      $scope.$watch("searchText.rolelistSearch", function () {
        resetRoleSelectVal();
        if ($scope.roleList.length > 0) {
          $scope.tableRoleParams.$params.page = GlobalService.getVal('page');
          $scope.tableRoleParams.reload();
        }
      });

      $scope.$watch("selectAllEndCustomers.val", function(newValue, oldValue) {
        if (newValue == true) {
          $scope.selectAllEndCustomersAll = true;
        } else {
          $scope.selectAllEndCustomersAll = false;
        }
      })
    
      // EO: All watch expressions

      var htmconst_url = "../../config/constants/admin_constants.json";
      $.get(htmconst_url, function (response, status) {
          $scope.htmconstdata = response;
      });

      $scope.init = function () {
        $scope.getLoginDetails();
        $scope.getRoles();
        $scope.getEndCustomerDetails();
      };
      $document.bind('click', function () {
        if (getCookie('mps') == undefined) {
          $scope.sessionTimeOutMessage = $scope.sessionExpired;
          $("#sessionModal").modal({ backdrop: 'static', keyboard: false });
        } 
        // Commented Reason : User tracking is happening on each document click which is not desirable as it makes a API call.
        // else {
        //   AdminService.updateAccessTime().then(function (response) {
        //   }, function (error) {
        //     $("#sessionModal").modal({ backdrop: 'static', keyboard: false });
        //   });
        // }
      });
      $scope.defaultFeature = function (row, list, prodName) {
        var featuresToEnable = [];
        var featuresToDisable = [], obj = {};
        if (row.value == $scope.defaultFeatureCheck) {
          $scope.addRoleWarningMsg = GlobalService.getVal('defaultFeatureErrorMsg');
          $scope.addRoleWarning = false;
          $scope.editRoleWarningMsg = GlobalService.getVal('defaultFeatureErrorMsg');
          $scope.editRoleWarning = false;
          $scope.AddProdWarningMsg = GlobalService.getVal('defaultFeatureErrorMsg');
          $scope.addProdWarning = false;
          row.checked = true;
        }
        else {
          $scope.addRoleWarning = true;
          $scope.editRoleWarning = true;
          $scope.addProdWarning = true;
        }
        obj = setFeaturesToEnableDisable(row.value);
        if (row.value == 'rules_and_alerts') {
          featuresToEnable = obj.enableFeatures;
          featuresToDisable = obj.disableFeatures;
        }
        if(row.value === 'dashboards'){
          featuresToEnable = obj.enableFeatures;
          featuresToDisable = obj.disableFeatures;
        }
        if(row.value === 'dashboard_admin'){
          featuresToEnable = obj.enableFeatures;
          featuresToDisable = obj.disableFeatures;
        }
        if(row.value === 'workbench' && AdminService.enableSiteAdminCreatorRole()){
          featuresToEnable = obj.enableFeatures;
          featuresToDisable = obj.disableFeatures;
        }
        enablePermissions(row, list, featuresToEnable, featuresToDisable, prodName);
      };

      var enablePermissions = function(feature, featureList, featuresToEnable, featuresToDisable, prodName){
        var prodFeatures = prodName.feature;
        if(featuresToEnable || featuresToDisable){
          if(feature.checked){
            featureList.map(function(item){
              if(prodFeatures.indexOf(item.value) !== -1 && featuresToEnable.indexOf(item.value) > -1){
                item.disabled = false;
              }
            })
          }else{
            featureList.map(function(item){
              if(featuresToDisable.indexOf(item.value) > -1){
                item.disabled = true;
                item.checked = false;
              }
            })
          }
        }
      }

      $scope.userTracking = function (module, activity, details) {
        AdminService.standard_user_tracking("adminconsole", module, activity, details);
      };
      $scope.CSVDownload = function (typ) {
        if (typ == "user") {
          var data = angular.copy($scope.users);
          $scope.userTracking("CSV Download", "User Csv", "CSV Download");
          for (i = 0; i < data.length; i++) {

            delete data[i].deleted;
            delete data[i].selected;
            delete data[i].adminUserItem;
            delete data[i].$$hashKey;
            delete data[i].role;
            delete data[i].token_id;
            delete data[i].realm_def;
            delete data[i].url_def;
            delete data[i].mps_def;
            data[i].role = data[i].DisRuleName;
            delete data[i].DisRuleName;
            /*Fix for export issue not showing column changing data arr */
            data[i].status = data[i].active ? "Active" : "Inactive";
            delete data[i].activeClass;
            delete data[i].active;
          }
          var ReportTitle = "User Details"
        } else {
          var data = angular.copy($scope.roleList);
          $scope.userTracking("CSV Download", "Role Csv", "CSV Download");
          for (i = 0; i < data.length; i++) {
            delete data[i].$$hashKey;
            delete data[i].selected;
            delete data[i].mps;
            delete data[i].mps_uidomain;
            delete data[i].realm_uidomain;
            delete data[i].name;
            data[i].name = data[i].DisName;
            delete data[i].DisName;
            data[i].product = "";
            for (j = 0; j < data[i].domains.length; j++) {
              data[i].product = data[i].product + data[i].domains[j].name + " : " + data[i].domains[j].features + "\n";
            }
            delete data[i].domains;
          }
          var ReportTitle = "Role Details"
        }
        var arrData = typeof data != 'object' ? JSON.parse(data) : data;
        var CSV = '';
        CSV += ReportTitle + '\r\n\n';
        var row = "";
        for (var index in arrData[0]) {
          row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
        for (var i = 0; i < arrData.length; i++) {
          var row = "";
          for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
          }
          row.slice(0, row.length - 1);
          CSV += row + '\r\n';
        }
        if (CSV == '') {
          alert("Invalid data");
          return;
        }
        var fileName = "MyReport_";
        fileName += ReportTitle.replace(/ /g, "_");
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        var link = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      $scope.sortColumn = function (col, tableType) {
        if (tableType == "roleTable") {
          $scope.columnRole = col;
        } else {
          $scope.columnUser = col;
        }
        if ($scope.reverse) {
          $scope.reverse = false;
          $scope.reverseclass = 'arrow-up';
        } else {
          $scope.reverse = true;
          $scope.reverseclass = 'arrow-down';
        }
        var tempPage;
        if (tableType == "roleTable") {
          $scope.roleList = $filter('orderBy')($scope.roleList, $scope.columnRole, $scope.reverse);
          $scope.tableRoleParams = new ngTableParams({
            page: GlobalService.getVal('page'),
            count: GlobalService.getVal('count'),
            reload: $scope.tableRoleParams
          }, {
              total: $scope.roleList.length,
              getData: function ($defer, rparams) {
                $scope.rdata = $scope.roleList.slice((rparams.page() - 1) * rparams.count(), rparams.page() * rparams.count());
                $defer.resolve($scope.rdata);
              }
            });
        } else {
          tempPage = $scope.tableParams.$params.page;
          var tempValList = [];
          var colUser = $scope.columnUser;
          for (i = 0; i < $scope.users.length; i++) {
            tempValList.push($scope.users[i][colUser]);
          }
          tempValList = $scope.unique(tempValList);
          if (tempValList.length != 1) {
            $scope.users = $filter('orderBy')($scope.users, $scope.columnUser, $scope.reverse);
            $scope.tableParams = new ngTableParams({
              page: tempPage,
              count: GlobalService.getVal('count'),
              reload: $scope.tableParams
            }, {
              counts: [],
              getData: function ($defer, params) {
                var searchedData = $scope.searchData();
                params.total(searchedData.length);
                if (params.settings().$scope == null) {
                  params.settings().$scope = $scope;
                }
                $scope.data = [];
                $scope.data = searchedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                $defer.resolve($scope.data);
              }
            });
          }
        }
      };
      $scope.sortClass = function (col, tableType) {
        if (tableType == "roleTable") {
          if ($scope.columnRole == col) {
            if ($scope.reverse) {
              return 'arrow-down';
            } else {
              return 'arrow-up';
            }
          }
          else {
            return '';
          }
        } else {
          if ($scope.columnUser == col) {
            if ($scope.reverse) {
              return 'arrow-down';
            } else {
              return 'arrow-up';
            }
          } else {
            return '';
          }
        }
      }
      $scope.AddUserErrorMsg = "";
      $scope.editUserErrorMsg = "";
      $scope.requiredCheck = function (type, data) {
        $scope.roleFeatures = angular.copy(GlobalService.getVal('roleFeatures'));
        var featuresToEnable, featuresToDisable, defaultFeatureObj;
        var manufacturer = getCookie('mps').substring(0, getCookie('mps').indexOf(':'));
        // $scope.roleFeatures = angular.copy($scope.copyOfRoleFeatures);
        $scope.defaultFeatureCheck = getCookie('default_feature');
        $scope.noFeatureWarning = true;
        $scope.addRoleWarning = true;
        $scope.editUserError = true;
        $scope.isExternalRole.val = false;  
        if (type == "newUserRole") {
          $scope.newUserEndCustomer.val = '';
          $scope.showEndCustomerList = false;
          if ($scope.newUserRole == undefined || $scope.newUserRole == "") {
            $scope.newUserRole = $scope.newUserRoleOptions[0];
            $scope.roleSelected = false;
          } else {
            $scope.newUsermps_defOptions = [];
            var tempObj = {};
            var i = 1
            var temp = { id: "", label: "Select Default Product" };
            $scope.newUsermps_defOptions[0] = temp;
            for (key in data.productList) {
              tempObj = {};
              tempObj.id = data.productList[key];
              tempObj.label = key;
              $scope.newUsermps_defOptions[i] = tempObj;
              i++;
            }
            $scope.newUsermps_def = $scope.newUsermps_defOptions[0];
            $scope.roleSelected = true;
          }
        }
        if ($scope.newUsermps_def == undefined && type == "newUserMps") {
          $scope.newUsermps_def = $scope.newUsermps_defOptions[0];
        }
        if ($scope.newUserwb_user_name == undefined && type == "newUserwb_user_name") {
          $scope.newUserwb_user_name = $scope.newUserwb_user_nameOptions[0];
        }
        if ($scope.newUserrealm_def == undefined && type == "newUserRealm") {
          $scope.newUserrealm_def = $scope.newUserrealm_defOptions[0];
        }
        if ($scope.addProdRoleProd == undefined && type == "rProdPlus") {
          $scope.addProdRoleProd = $scope.ProdaddRoleProdDisplayOptions[0];
          $('#addProdfeaturesPermission').hide();
        } else if (type == "rProdPlus" && $scope.addProdRoleProd != undefined) {
          var featuresStr = data.replace(/\s+/g, '');
          tempArray = featuresStr.split(",");
          for (i = 0; i < $scope.addProdroleFeatures.length; i++) {
            if(tempArray.indexOf($scope.addProdroleFeatures[i].value) == -1){
              $scope.addProdroleFeatures[i].disabled = true;
            }
            $('#addProdfeaturesPermission').show();
          }
        }
        if ($scope.addRoleProdDisplay == undefined && type == "rProd") {
          $scope.addRoleProdDisplay = $scope.addRoleProdDisplayOptions[0];
          $('#featuresPermission').hide();
          $scope.showRoleToggle = false;
        } else if (type == "rProd" && $scope.addRoleProdDisplay != undefined) {
          var featuresStr = data.replace(/\s+/g, '');
          tempArray = featuresStr.split(",");
          for (i = 0; i < $scope.roleFeatures.length; i++) {
            $scope.roleFeatures[i].checked = false;
            if($scope.roleFeatures[i].value == $scope.defaultFeatureCheck){
              $scope.roleFeatures[i].checked = true;
              defaultFeatureObj = $scope.roleFeatures[i];
            }
            if(tempArray.indexOf($scope.roleFeatures[i].value) == -1){
              $scope.roleFeatures[i].disabled = true;
            }
            $('#featuresPermission').show();
            $scope.showRoleToggle = true;
          }
          var obj = setFeaturesToEnableDisable(defaultFeatureObj.value);
          if (defaultFeatureObj.value == 'rules_and_alerts') {
            featuresToEnable = obj.enableFeatures;
            featuresToDisable = obj.disableFeatures;
          }
          if(defaultFeatureObj.value === 'dashboards'){
            featuresToEnable = obj.enableFeatures;
            featuresToDisable = obj.disableFeatures;
          }
          if(defaultFeatureObj.value === 'dashboard_admin'){
            featuresToEnable = obj.enableFeatures;
            featuresToDisable = obj.disableFeatures;
          }
          enablePermissions(defaultFeatureObj, $scope.roleFeatures, featuresToEnable, featuresToDisable, $scope.addRoleProdDisplay);
        }
        if (type == "editUserRole") {
          $scope.editUserEndCustomer.val = '';
          $scope.showEndCustomerList = false;
          if ($scope.editUserRole == undefined) {
            $scope.editUserRole = $scope.newUserRoleOptions[0];
            $scope.roleSelected = false;
          } else {
            $scope.newUsermps_defOptions = [];
            var tempObj = {};
            var i = 1;
            var temp = { id: "", label: "Select Default Product" };
            $scope.newUsermps_defOptions[0] = temp;
            for (key in data.productList) {
              tempObj = {};
              tempObj.label = key;
              tempObj.id = data.productList[key];
              $scope.newUsermps_defOptions[i] = tempObj;
              i++;
            }
            $scope.editUsermps_def = $scope.newUsermps_defOptions[0];
            $scope.roleSelected = true;
          }
        }
        if ($scope.editUsermps_def == undefined && type == "editUserMps") {
          $scope.editUsermps_def = $scope.newUsermps_defOptions[0];
        }
        if ($scope.editUserrealm_def == undefined && type == "editUserRealm") {
          $scope.editUserrealm_def = $scope.editUserrealm_defOptions[0];
        }
        if ($scope.editUserwb_user_name == undefined && type == "editUserwb_user_name") {
          $scope.editUserwb_user_name = $scope.newUserwb_user_nameOptions[0];
        }
      };
      $scope.getLoginDetails = function (param) {
        AdminService.getLoginFields().then(function (response) {
          var manufacturer = getCookie('mps').substring(0, getCookie('mps').indexOf(':'));
          var data = response.data.Data;
      
          var i = 1;
          var temp = { id: "", label: "Select Default Product" };
          $scope.newUsermps_defOptions[0] = temp;
          AdminService.setLoggedInUser(data.user[0]);
          $scope.loggedInUserEmail = data.user[0].email;
          temp = {};
          if (response.data.Data.user[0].first_name == "") {
            $scope.loggedInUsername = response.data.Data.user[0].email;
          } else {
            $scope.loggedInUsername = response.data.Data.user[0].first_name + " " + response.data.Data.user[0].last_name;
          }
          for (var key in response.data.Data.role_details.domains) {
            if (response.data.Data.role_details.domains[key].substring(0, response.data.Data.role_details.domains[key].indexOf(':')) == manufacturer) {
              temp = {};
              temp.label = key;
              temp.id = response.data.Data.role_details.domains[key];
              tempRoleMps = response.data.Data.role_details.domains[key].split(":");
              $scope.roleMfr.push(tempRoleMps[0]);
              $scope.roleProd.push(tempRoleMps[1]);
              $scope.roleSch.push(tempRoleMps[2]);
              $scope.newUsermps_defOptions[i] = temp;
              i++;
            }
          }
          // Set product list for end customer creation
          $scope.endCustomerProductList = $scope.newUsermps_defOptions;
          $scope.addNewEndCustomer.prodName = $scope.endCustomerProductList[0];

          $scope.roleMfr = $scope.unique($scope.roleMfr);
          for (j = 0; j < $scope.roleMfr.length; j++) {
            temp = {};
            temp.id = j;
            temp.label = $scope.roleMfr[j];
            $scope.addRoleMfrOptions[j] = temp;
          }
          $scope.addRoleMfr = $scope.addRoleMfrOptions[0];
          $scope.roleProd = $scope.unique($scope.roleProd);
          for (j = 0; j < $scope.roleProd.length; j++) {
            temp = {};
            temp.id = j;
            temp.label = $scope.roleProd[j];
            $scope.addRoleProdOptions[j] = temp;
          }
          $scope.addRoleProd = $scope.addRoleProdOptions[0];
          $scope.roleSch = $scope.unique($scope.roleSch);
          var tempRoleDisName = "";
          var disNameObj = [];
          for (j = 0; j < $scope.roleSch.length; j++) {
            temp = {};
            temp.id = j;
            temp.label = $scope.roleSch[j];
            $scope.addRoleSchOptions[j] = temp;
          }
          $scope.addRoleSch = $scope.addRoleSchOptions[0];
          $scope.newUsermps_def = $scope.newUsermps_defOptions[0];
          $scope.realmDefUser = data.role_details.realm_uidomain;
          $scope.loggedInUserrole = data.user[0].role;
          disNameObj = data.user[0].role.split("_");
          disNameObj.splice(0, 3);
          $scope.loggedInUserroleDisplay = disNameObj.join("_");
        }, function (error) {
          $scope.MsgModelHeader = $scope.sessionTimedOutHeader;
          $scope.MsgModelMessage = $scope.sessionTimedOutMsg;
          $window.location.href = localStorage.getItem("logOutUrl");
        });
      };
      //$scope.getLoginDetails();
      $scope.matchFeatures = function (features) {
        var tempfeatures = features;
        tempfeatures = tempfeatures.split(",");
        for (i = 0; i < tempfeatures.length; i++) {
          switch (tempfeatures[i]) {
            case "dashboards":
              tempfeatures[i] = "Dashboards";
              break;
            case "explorer":
              tempfeatures[i] = "Explorer";
              break;
            case "rules_and_alerts":
              tempfeatures[i] = "Rules & Alerts";
              break;
            case "rule_creator":
              tempfeatures[i] = "Rule Creator";
              break;
            case "workbench":
              tempfeatures[i] = "Workbench";
              break;
            case "logvault":
              tempfeatures[i] = "Logvault";
              break;
            case "file_upload":
              tempfeatures[i] = "File Upload";
              break;
            case "healthcheck":
              tempfeatures[i] = "Health Check";
              break;
            case "apps":
              tempfeatures[i] = "Apps";
              break;
            case "admin":
              tempfeatures[i] = "Admin";
              break;
            case "gbstudio_apps":
              tempfeatures[i] = "GB Studio";
              break;
            case "dashboard_admin":
              tempfeatures[i] = "Dashboard Admin";
              break;
            case "wb_creator":
              tempfeatures[i] = "Creator";
              break;
          }
        }
        return tempfeatures.join(',');
      };
      $scope.RevertFeaturesText = function (features) {
        var tempfeatures = features;
        tempfeatures = tempfeatures.split(",");
        for (i = 0; i < tempfeatures.length; i++) {
          switch (tempfeatures[i]) {
            case "Dashboards":
              tempfeatures[i] = "dashboards";
              break;
            case "Explorer":
              tempfeatures[i] = "explorer";
              break;
            case "Rules & Alerts":
              tempfeatures[i] = "rules_and_alerts";
              break;
            case "Rule Creator":
              tempfeatures[i] = "rule_creator";
              break;
            case "Workbench":
              tempfeatures[i] = "workbench";
              break;
            case "Logvault":
              tempfeatures[i] = "logvault";
              break;
            case "File Upload":
              tempfeatures[i] = "file_upload";
              break;
            case "Health Check":
              tempfeatures[i] = "healthcheck";
              break;
            case "Apps":
              tempfeatures[i] = "apps";
              break;
            case "GB Studio":
              tempfeatures[i] = "gbstudio_apps";
              break;
            case "Dashboard Admin":
              tempfeatures[i] = "dashboard_admin";
              break;
            case "Creator":
              tempfeatures[i] = "wb_creator";
              break;
          }
        }
        return tempfeatures.join(',');
      };

      $scope.getRoles = function () {
        $scope.data_loading = true;
        $scope.slectedRoleCount = 0;
        $scope.rnaFeatureAssigned = false;
        $scope.searchText.rolelistSearch = "";
        $scope.roleList = [];
        if (getCookie('mps') == undefined) {
          $window.location.href = localStorage.getItem("logOutUrl");
        } else {
          $scope.singleRoleSelected = false;
          AdminService.getRoleList().then(function (response) {
            $scope.allRoleNameList = [];
            var manufacturer = getCookie('mps').substring(0, getCookie('mps').indexOf(':'));
            var rdata = response.data.Data;
            var tempRoleDisName = "";
            var disNameObj = [];
            $scope.addRoleProdDisplayOptions = [];
            tempObj = {};
            tempObj = { id: "", label: 'Select Product' };
            $scope.addRoleProdDisplayOptions.push(tempObj);
            var tempRoleDisName = "";
            var disNameObj = [];

            for (i = 0; i < rdata.length; i++) {
              disNameObj = rdata[i].name.split("_");
              if (disNameObj[0] != manufacturer) {
                rdata.splice(i, 1);
                i--;
              } else {
                disNameObj.splice(0, 3);
                tempRoleDisName = disNameObj.join("_");
                rdata[i].DisName = tempRoleDisName;
              }
            }
            var tempAdminArr = [];
            var tempadminrolename = "";
            // To check whether to enable edit/delete option for role
            for (i = 0; i < rdata.length; i++) {
              for (var key in rdata[i].domains) {
                var featureList = rdata[i].features[rdata[i].domains[key]].split(",");
                tempAdminArr = featureList.filter(function(item){
                  return item == 'admin';
                });
                if (tempAdminArr.length) {
                  tempadminrolename = rdata[i].name;
                }
              }
            }
            $scope.adminRoleName = tempadminrolename;
            setRoleFeatures(rdata);
            makeRoleList(rdata);
            setRoleTableData();
            setLoggedInUserRoleFeatures(rdata);
            $scope.newUserRole = $scope.newUserRoleOptions[0];
            $scope.addRoleProdDisplay = $scope.addRoleProdDisplayOptions[0];
            $scope.copynewUserRoleOptions = angular.copy($scope.newUserRoleOptions);
            $scope.resetAddNewUserPopup();
            setRoleType();
            setRoleItemType();
            for (i = 0; i < $scope.roleList.length; i++) {
              $scope.allRoleNameList.push($scope.roleList[i].DisName);
            }
            $timeout(function () { 
              $scope.getUser() 
            }, 2000);
            $scope.selectedRemoveRole = false;
          });
        }
      };

      $scope.enabledRowColumn = function (param) {
        for (i = 0; i < $scope.roleColumns.length; i++) {
          if ($scope.roleColumns[i].field == param) {
            return false;
          }
        }
        return true;
      };

      var setRoleTableData = function(){
        $scope.tableRoleParams = new ngTableParams({
          page: GlobalService.getVal('page'),
          count: GlobalService.getVal('count'),
          reload: $scope.tableRoleParams,
          sorting: { DisName: "asc" }
        }, {
            total: $scope.roleList.length,
            getData: function ($defer, rparams) {
              if (rparams.settings().$scope == null) {
                rparams.settings().$scope = $scope;
              }
              var searchedData = $scope.searchRoleListData();
              var orderedData = rparams.sorting() ? $filter('orderBy')(searchedData, rparams.orderBy()) : searchedData;
              $scope.rdata = orderedData.slice((rparams.page() - 1) * rparams.count(), rparams.page() * rparams.count());
              rparams.total(orderedData.length);
              $defer.resolve($scope.rdata);
            }
          });
      }

      var setRoleType = function(){
        $scope.roleList.map(function(item, index){
          item.roleType = 'Internal';
          if(item.domains[0].features){
            var featureList = item.domains[0].features.replace(/\s/g, '').split(",");
            if (featureList.length == 1 && featureList.indexOf('HealthCheck') > -1) {
              item.roleType = 'External';
            }
          }
        });
      }
      
      var setRoleItemType = function(){
        $scope.copynewUserRoleOptions.map(function(item, index){
          item.roleType = 'Internal';
          if(item.features && item.features.length){
            if (item.features && item.features.length === 1 && item.features[0].toLowerCase().indexOf('health') > -1) {
              item.roleType = 'External';
            }
          } else{
            item.roleType = '';
          }
        });
      }

      var setRoleFeatures = function(data){
        data.map(function(item){
          if(item.name === $scope.adminRoleName){
            Object.keys(item.domains).map(function(key){
              tempObj = {};
              gbStudioFeature = {};
              tempObj.label = key;
              tempObj.id = item.domains[key];
              tempObj.feature = item.features[tempObj.id];
              if (tempObj.label != "-") {
                $scope.addRoleProdDisplayOptions.push(tempObj);
                tempArray = GlobalService.getVal('roleFeatures');
                $scope.roleFeatures = angular.copy(tempArray);
                $scope.editroleFeatures = angular.copy(tempArray);
                $scope.addProdroleFeatures = angular.copy(tempArray);
              }else{
                delete item.domains[key];
                tempArray = GlobalService.getVal('roleFeatures');
                var isGBstudioFeature = tempArray.filter(function(item){
                  return item.value === 'gbstudio_apps';
                });
                if(isGBstudioFeature.length){
                  gbStudioFeature.category = "Other Apps";
                  gbStudioFeature.name = "GB Studio";
                  gbStudioFeature.value = "gbstudio_apps";
                  gbStudioFeature.checked = false;
                  gbStudioFeature.disabled = false;
                  tempArray.push(gbStudioFeature);
                }
                $scope.roleFeatures = angular.copy(tempArray);
                $scope.editroleFeatures = angular.copy(tempArray);
                $scope.addProdroleFeatures = angular.copy(tempArray);
              }
            })
          }
        })
        $scope.copyOfRoleFeatures = GlobalService.getVal('roleFeatures');
      }

      var makeRoleList = function(data){
        $scope.newUserRoleOptions = [];
        $scope.roleList = [];
        var tempObj = { id: "", label: 'Select Role', value: "" };
        $scope.newUserRoleOptions[0] = tempObj;
        var manufacturer = getCookie('mps').substring(0, getCookie('mps').indexOf(':'));
        data.map(function(item,index){
          var roleListObj = {};
          // Role list object : used in role list page
          roleListObj.domains = [];
          roleListObj.mps = [];
          roleListObj.name = item.name;
          roleListObj.DisName = item.DisName;
          roleListObj.mps_uidomain = item.mps_uidomain;
          roleListObj.realm_uidomain = item.realm_uidomain;
          roleListObj.selected = false;

          // Role Object: used in user list page to select roles
          var roleObj = {};
          roleObj.features = [];
          roleObj.productList = {};
          roleObj.label = item.DisName;

          if(Object.keys(item.domains).length){
            Object.keys(item.domains).map(function(key){

              // Make domain object which goes in role list
              domainObj = {};
              domainObj.name = key;
              domainObj.mps = item.domains[key].split(":");
              domainObj.selected = false;
              item.features[item.domains[key]] = item.features[item.domains[key]].split(' ').join('');
              domainObj.features = $scope.matchFeatures(item.features[item.domains[key]]);
              domainObj.features = domainObj.features.replace(/,/g, ", ");
              roleListObj.domains.push(domainObj);

              // Make role object
              roleObj.value = item.name;
              roleObj.productList = item.domains;
              roleObj.features = domainObj.features.split(",");

              Object.keys(roleObj.productList).map(function(key){
                if(roleObj.productList[key] === "default:default:default"){
                  delete roleObj.productList[key];
                }
              });

            })
          }
          roleObj.id = index;
          $scope.roleList.push(roleListObj);
          $scope.newUserRoleOptions.push(roleObj);
        })
      }

      var setRoleProductMap = function(data, users){
        $scope.associatedRoleProductList = {};
        $scope.associatedRoleUserList = {};
        data.map(function(item){
          $scope.associatedRoleProductList[item] = [];
          $scope.associatedRoleUserList[item] = [];
        });
        users.map(function(user){
          if(data.indexOf(user.role) > -1){
            if($scope.associatedRoleProductList[user.role].indexOf(user.mps_def) == -1){
              $scope.associatedRoleProductList[user.role].push(user.mps_def);
            }
            if($scope.associatedRoleUserList[user.role].indexOf(user.email) == -1){
              $scope.associatedRoleUserList[user.role].push(user.email);
            }
          }
        })
      }

      var setWBLicenseCount = function(user){
        $scope.roleList.map(function(role){
          if(user.role === role.name){
            var domains = role.domains;
            domains.map(function(domain){
              if(user.mps_def === domain.mps.join(":")){
                var featureList = domain.features.replace(/\s/g, '').split(",");
                if(featureList.indexOf('Workbench') > -1 && user.active){
                  $scope.powerUsers++;
                }
                if(featureList.indexOf('Creator') > -1 && user.active){
                  $scope.creatorLicensesCount++;
                }
              }
            })
          }
        })
      }

      var setLoggedInUserRoleFeatures = function(roles){
        var roleFeatures = [];
        var loggedInUser = AdminService.getLoggedInUser();
        roles.map(function (role) { 
          if(role.name === loggedInUser.role){
            roleFeatures = role.features[loggedInUser.mps_def];
            roleFeatures = roleFeatures.replace(/\s/g, '').split(",");
            AdminService.setLoggedInUserFeatures(roleFeatures);
          }
        });
        AdminService.getTableauSiteId().then(function(response){
          AdminService.setSiteId(response.data.Data.site_id);
          AdminService.getRealmDetails().then(function(response){
            AdminService.setRealmData(response.data.Data);
          })
        });
      }

      //$scope.getRoles();
      $scope.getUser = function () {
        $scope.powerUsers = 0;
        $scope.totalUsers = 0;
        $scope.creatorLicensesCount = 0;
        var manufacturer = getCookie('mps').substring(0, getCookie('mps').indexOf(':'));
        $scope.data_loading = true;
        $scope.rnaFeatureAssigned = false;
        $scope.associatedRoleList = [];
        $scope.associatedEndCustomerList = [];
        var modified_time;
        var created_time;
        var last_login_time;
        $scope.userFilterGroupedData = angular.copy(GlobalService.getVal('userFilterGroupedData'));
        AdminService.getLoginFields().then(function (responseLogin) {
          var ndata = responseLogin.data.Data;
          $scope.selectedRemove = false;
          $scope.totalLicense = ndata.max_licensed_users;
          $scope.MaxUsers = ndata.max_users;
          $scope.totalCreatorLicensesCount = ndata.max_creator_licenses;
          var loggedInUserEmail = ndata.user[0].email;
          AdminService.getUserList().then(function (response) {
            $scope.users = response.data.Data;
            // Below is the hack to be removed later, will be handled from backend
            for (i = 0; i < $scope.users.length; i++) {
              modified_time = moment(new Date($scope.users[i].modified_on)).local().format('YYYY-MM-DD HH:mm:ss');
              $scope.users[i].modified_on = modified_time;
              created_time = moment(new Date($scope.users[i].created_on)).local().format('YYYY-MM-DD HH:mm:ss');
              $scope.users[i].created_on = created_time;
              last_login_time = moment(new Date($scope.users[i].last_login)).local().format('YYYY-MM-DD HH:mm:ss');
              $scope.users[i].last_login = last_login_time;
              if (modified_time <= created_time) {
                $scope.users[i].modified_on = "-";
              }
              if (last_login_time <= created_time) {
                $scope.users[i].last_login = "-";
              }

            }

            $scope.allUsersEmailList = [];
            for (i = 0; i < $scope.users.length; i++) {
              $scope.allUsersEmailList.push($scope.users[i].email);
            }
            var disNameObj = [];
            var tempRoleDisName = "";
            $scope.usersRemaining = ndata.max_users - $scope.totalUsers;
            var roleListTemp = [];
            for (i = 0; i < $scope.roleList.length; i++) {
              roleListTemp.push($scope.roleList[i].name);
            }
            for (i = 0; i < $scope.users.length; i++) {
              if (roleListTemp.indexOf($scope.users[i].role) == -1) {
                $scope.users.splice(i, 1);
                i--;
              }
            }
            for (i = 0; i < $scope.users.length; i++) {
              $scope.associatedRoleList.push($scope.users[i].role);
              if($scope.users[i].end_customer && $scope.users[i].end_customer.length && $scope.users[i].end_customer !== 'NA'){
                $scope.associatedEndCustomerList.push($scope.users[i].end_customer);
              }
              $scope.associatedEndCustomerList = $scope.unique($scope.associatedEndCustomerList);
              if ($scope.users[i].active == true) {
                $scope.users[i].activeClass = "isactive";
              } else {
                $scope.users[i].activeClass = "notactive";
              }
              // if ($scope.users[i].email == $scope.users[i].wb_user_name) {
              //   if ($scope.users[i].active) {
              //     $scope.powerUsers++;
              //   }
              // }
              setWBLicenseCount($scope.users[i]);
              disNameObj = $scope.users[i].role.split("_");
              if (disNameObj[0] != manufacturer) {
                $scope.users.splice(i, 1);
                i--;
              } else {
                disNameObj.splice(0, 3);
                tempRoleDisName = disNameObj.join("_");
                $scope.users[i].DisRuleName = tempRoleDisName;
                $scope.users[i].selected = false;
                $scope.users[i].name = $scope.users[i].first_name + " " + $scope.users[i].last_name;
                $scope.users[i].deleted = "notDeleted";
                if (loggedInUserEmail == $scope.users[i].email) {
                  $scope.users[i].adminUserItem = true;
                }
              }
            }
            for (i = 0; i < $scope.users.length; i++) {
              if ($scope.users[i].active) {
                $scope.totalUsers++;
              }
            }
            if ($scope.users.length == 0) {
              $scope.noUsers = true;
            } else {
              $scope.noUsers = false;
            }
            $scope.remainingLicense = $scope.powerUsers;
            var tempMps = getCookie('mps').split(':');
            $scope.associatedRoleList = $scope.unique($scope.associatedRoleList);
            // Set role-product map list
            setRoleProductMap($scope.associatedRoleList, $scope.users);
            $scope.noOfColumns = $scope.UserColumns.length - 4;
            if ($scope.roleList.length != 0) {
              for (i = 0; i < $scope.users.length; i++) {
                for (j = 0; j < $scope.roleList.length; j++)
                  if ($scope.users[i].role == $scope.roleList[j].name) {
                    for (k = 0; k < $scope.roleList[j].domains.length; k++) {
                      if ($scope.users[i].mps_def == $scope.roleList[j].domains[k].mps.join(":")) {
                        if ($scope.roleList[j].domains[k].features.indexOf("Rules & Alerts") != -1) {
                          $scope.rnaFeatureAssigned = true;
                        }
                      }
                    }
                  }
              }
            }
            if ($scope.roleList.length != 0 && $scope.users) {
              for (i = 0; i < $scope.users.length; i++) {
                for (j = 0; j < $scope.roleList.length; j++)
                  if ($scope.users[i].role == $scope.roleList[j].name) {
                    for (k = 0; k < $scope.roleList[j].domains.length; k++) {
                      if ($scope.users[i].mps_def == $scope.roleList[j].domains[k].mps.join(":")) {
                        if ($scope.roleList[j].domains[k].features.indexOf("Rules & Alerts") != -1) {
                          $scope.rnaFeatureAssigned = true;
                        }
                      }
                    }
                  }
              }
            }
            if ($scope.roleFeatures != undefined) {
              for (i = 0; i < $scope.roleFeatures.length; i++) {
                if ($scope.roleFeatures[i].value == $scope.defaultFeatureCheck) {
                  $scope.roleFeatures[i].checked = true;
                }
              }
            }
            var currentCount = 0;
            if ($scope.tableParams) {
              currentCount = $scope.tableParams.count(); /*if user selects a block store it*/
            }
            var sortOrder = $scope.columnUser;
            $scope.tableParams = new ngTableParams({
              page: GlobalService.getVal('page'),
              count: GlobalService.getVal('count'),
              reload: $scope.tableParams,
              sorting: { first_name: "asc" }
            }, {
                counts: [],
                getData: function ($defer, params) {
                  var searchedData = $scope.searchData();
                  params.total(searchedData.length);
                  if (params.settings().$scope == null) {
                    params.settings().$scope = $scope;
                  }
                  $scope.data = [];
                  var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;
                  $scope.data = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                  $defer.resolve($scope.data);
                  orderedData.forEach(function(item){
                    for(key in item){
                      $scope.userFilterGroupedData.forEach(function(item1){
                        if(item1.isDateType){
                          item1.data = angular.copy(GlobalService.getVal('timeListFilter'));
                        }else{
                          if(item1.columnName === key && item[key] !== ''){
                            var obj = {};
                            if(key === 'role'){
                              obj.disName = item.DisRuleName;
                            }
                            obj.name = item[key];
                            obj.selected = false;
                            item1.data.push(obj);
                            item1.data = _.uniqBy(item1.data, 'name');
                          }
                        }
                      })
                    }
                  })
                }
              });
            if ($scope.users.length != 0) {
              setTimeout(function () { $scope.tableParams.reload(); }, 300);
              if (currentCount) {
                $scope.tableParams.count(currentCount); /*if user has selected a pager block the reload to that block */
              }
            }
            $scope.searchKeyword = "";
            $scope.enabledColumn = function (param) {
              for (i = 0; i < $scope.UserColumns.length; i++) {
                if ($scope.UserColumns[i].field == param) {
                  return false;
                }
              }
              return true;
            };
            $scope.selectedRemoveRole = false;
            $scope.data_loading = false;
          });
        }, function (error) {
          $scope.MsgModelHeader = $scope.sessionTimedOutHeader;
          $scope.MsgModelMessage = $scope.sessionTimedOutMsg;
          $window.location.href = localStorage.getItem("logOutUrl");
        });
        $scope.userFilterGroupedData.map(function(item){
          item['appliedFilterCount'] = 0;
          // item['expand'] = false;
          item['searchText'] = '';
          if(Array.isArray(item.data)){
            item.data.map(function(item){
                item.selected = false;
            })
          }else{
            for (var key in item.data) {
                item.data[key]['selected'] = false;
            }
          }
        });
        $scope.filterObj.userList = [];
      };
      //$scope.getUser();
      $scope.editRow = function (row) {
        // $scope.setRoleList();
        $scope.resetAddNewUserPopup();
        $scope.newUserRoleOptions = getFilteredRoles('Internal');
        $('#editUserModal .modal-header h4').html("Edit User | " + row.email);
        $('#editUserModal .modal-header h4').attr('title', row.email);
        $scope.oldEditRole = row.role;
        $scope.editUserfirst_name = row.first_name;
        $scope.editUserlast_name = row.last_name;
        $scope.editUserEmail = row.email;
        $scope.editUserPhone = row.phone;
        $scope.editUserDepartment = row.department;
        $scope.editUserState = row.state;
        $scope.editUserCity = row.city;
        $scope.editUserCountry = row.country;
        if (row.email == row.wb_user_name) {
          $scope.editUserwb_user_name = $scope.newUserwb_user_nameOptions[1];
        } else {
          $scope.editUserwb_user_name = $scope.newUserwb_user_nameOptions[2];
        }
        $scope.editUser_isExternalUser = row.is_external;
        if ($scope.editUser_isExternalUser) {
          $scope.newUserRoleOptions = getFilteredRoles('External');
          // $scope.newUserRoleOptions = [];
          // getFilteredRoles(function (res) {
          //   $scope.newUserRoleOptions = res;
          // });
          $scope.loadEndCustomerList(row.mps_def);
          $scope.editUserEndCustomer.val = row.end_customer !== 'NA' ? row.end_customer : '';
        }
        $scope.newUsermps_defOptions = [];
        var tempObj = {};
        var temp = { id: "", label: "Select Default Product" };
        $scope.newUsermps_defOptions[0] = temp;
        for (i = 1; i < $scope.newUserRoleOptions.length; i++) {
          if (row.role == $scope.newUserRoleOptions[i].value.toLowerCase()) {
            $scope.editUserRole = $scope.newUserRoleOptions[i];
            for (key in $scope.editUserRole.productList) {
              tempObj = {};
              tempObj.id = $scope.editUserRole.productList[key];
              tempObj.label = key;
              $scope.newUsermps_defOptions.push(tempObj);
            }
          }
        }
        for (i = 0; i < $scope.newUsermps_defOptions.length; i++) {
          if ($scope.newUsermps_defOptions[i].id == "default:default:default") {
            $scope.newUsermps_defOptions.splice(i, 1);
            break;
          }
        }
        for (i = 0; i < $scope.newUsermps_defOptions.length; i++) {
          if (row.mps_def == $scope.newUsermps_defOptions[i].id) {
            $scope.editUsermps_def = $scope.newUsermps_defOptions[i];
          }
        }
        $scope.editUserreport_usage = row.report_usage;
        $scope.editUserdashboard_admin.val = row.dashboard_admin;
        if (row.adminUserItem) {
          angular.element(document.querySelector('#edituserrole')).attr('disabled', '');
        } else {
          angular.element(document.querySelector('#edituserrole')).removeAttr('disabled');
        }
        $scope.roleSelected = true;
      };

      var getProdFeatureList = function(data){
        $scope.roleList.map(function(role){
          if(data.role === role.name || data.name === role.name){
            var domains = role.domains;

            domains.map(function(domain){
              if(data.mps_def === domain.mps.join(":") || data.mfr + ":" + data.prod + ":" + data.sch === domain.mps.join(":")){
                featureList = domain.features.replace(/\s/g, '').split(",");
              }
            })
          }
        })
        return featureList;
      }

      //Disable User
      $scope.disableUser = function (row) {
        var userRoleFeatures = getProdFeatureList(row);
        $scope.data_loading = true;
        AdminService.disableUser(row.email).then(function (response) {
          $scope.userTracking("User", "Disable User", JSON.stringify(row.email));
          if(userRoleFeatures.indexOf('Creator') > -1) {
            var postData = {};
            var users = [];
            var userData = {};
            userData.userName = row.email;
            userData.roleType = 'Unlicensed';
            users.push(userData);
            postData.userRole = users;
            AdminService.addNewTableauUser(postData).then(function(response){
              
            }, function(error){
              
            });
          }
          $scope.data_loading = false;
          $scope.init();
        }, function (error) {
        });
      };

      
      //Enable User
      $scope.enableUser = function (row) {
        var userRoleFeatures = getProdFeatureList(row);
        $scope.data_loading = true;
        var licensesExceeded = checkIfLicenseExceeded(row);
        if(licensesExceeded){
          $scope.MsgModelHeader = 'Enable user';
          var feature = userRoleFeatures.indexOf('Creator') > -1 ? 'creator' : 'workbench';
          $scope.MsgModelMessage = "This user's role has access to " + feature +".  But, all the available licences are being used up for now. Hence, you cannot enable this user.";
          $scope.data_loading = false;
          $("#msgModal").modal("show");
        }else{
          AdminService.enableUser(row.email).then(function (response) {
            $scope.userTracking("User", "Enable User", JSON.stringify(row.email));
            if(userRoleFeatures.indexOf('Creator') > -1) {
              var postData = {}, users = [];
              var features =  setTableauUserInfo(row, 'user');
              var roleType = setTableauUserRoleType(features);
              if(roleType){
                var postData = {};
                var users = [];
                postData.userName = row.email;
                postData.roleType = roleType;
                users.push(postData);
              }
              AdminService.addNewTableauUser(postData).then(function(response){
                
              }, function(error){
                
              });
            }
            $scope.data_loading = false;
            $scope.init();
          }, function (error) {
          });
        }  
      };

      var checkIfLicenseExceeded = function(data){
        var exceededLicense = false;
        $scope.roleList.map(function(role){
          if(data.role === role.name){
            var domains = role.domains;
            domains.map(function(domain){
              if(data.mps_def === domain.mps.join(":")){
                var featureList = domain.features.replace(/\s/g, '').split(",");
                if(featureList.indexOf('Workbench') > -1 && ($scope.remainingLicense == $scope.totalLicense) ||
                featureList.indexOf('Creator') > -1 && ($scope.creatorLicensesCount == $scope.totalCreatorLicensesCount)){
                  exceededLicense = true;
                }
              }
            })
          }
        })
        return exceededLicense;
      }

      $scope.resetPass = function (row) {
        $scope.resetPassUser = row.email;
        $scope.resetPassPass = "";
        $scope.resetPassPass2 = "";
      };
      $scope.resetPassSubmit = function () {
        var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
        var isPasswordValid = regex.test($scope.resetPassPass);
        if(!isPasswordValid){
          $scope.resetPassError = GlobalService.getVal("passwordSpaceError")
          $scope.resetPassErrorFlag = true;
          return;
        }
        if ($scope.resetPassPass != $scope.resetPassPass2) {
          $scope.resetPassError = GlobalService.getVal("passwordMatchError")
          $scope.resetPassErrorFlag = true;
          return;
        }
        if ($scope.resetPassPass == undefined) {
          $scope.resetPassError = GlobalService.getVal("passwordSpaceError")
          $scope.resetPassErrorFlag = true;
          return;
        }
        if (!$scope.resetPassPass.replace(/\s/g, '').length) {
          $scope.resetPassError = GlobalService.getVal("passwordSpaceError")
          $scope.resetPassErrorFlag = true;
          return;
        }
        var udata = {
          "email": $scope.resetPassUser,
          "password": $scope.resetPassPass
        };
        $('#ResetPasswordModal').modal("hide");
        AdminService.resetPass(udata).then(function (response) {
          $scope.userTracking("User", "Reset Password", JSON.stringify(udata));
          $scope.MsgModelHeader = $scope.updatePasswordMsgHeader;
          $scope.MsgModelMessage = udata.email + $scope.updatePasswordMsg;
          $("#msgModal").modal("show");
        }, function (error) {
          $scope.data_loading = false;
        });
      };
      $scope.editRoleRow = function (rowdata, rowdomain) {
        $scope.defaultFeatureCheck = getCookie('default_feature');
        // var features = rowdomain.features.replace(/\s+/g, '').split(',');
        $scope.editRoleName = rowdata.name;
        $scope.editRoleDisName = rowdata.DisName;
        $scope.editRoleDomain = rowdomain.name;
        $scope.workbenchFeatureAssigned = false;
        $scope.addAdminFeature = false;
        $scope.creatorLicenseAssigned = false;
        var tempArray = {};
        for (i = 0; i < $scope.addRoleProdDisplayOptions.length; i++) {
          if (rowdomain.name == $scope.addRoleProdDisplayOptions[i].label) {
            $scope.editRoleProdDisplay = $scope.addRoleProdDisplayOptions[i];
          }
        }
        var tempFeatures = rowdomain.features;
        tempFeatures = tempFeatures.replace(/, /g, ",");
        tempFeatures = $scope.RevertFeaturesText(tempFeatures);
        tempFeatures = tempFeatures.replace(/ /g, "");
        tempFeatures = tempFeatures.split(",");
        if (tempFeatures.indexOf("workbench") != -1 || tempFeatures.indexOf("Workbench") != -1) {
          $scope.workbenchFeatureAssigned = true;
        } else {
          $scope.workbenchFeatureAssigned = false;
        }
        $scope.creatorLicenseAssigned = tempFeatures.indexOf('wb_creator') > -1 ? true : false;
        if (tempFeatures.indexOf("admin") != -1 || tempFeatures.indexOf("Admin") != -1) {
          $scope.addAdminFeature = true;
          $scope.MsgErrorModelHeader = GlobalService.getVal('adminRoleEditHeader');
          $scope.MsgErrorModelMessage = GlobalService.getVal('adminRoleEditMsg');
          $('#msgErrorModal').modal('show');
        } else {
          $scope.addAdminFeature = false;
          $('#editRoleModal').modal('show');
        }
        var featuresStr = $scope.editRoleProdDisplay.feature.replace(/\s+/g, '');
        var features = featuresStr.split(",");
        for (i = 0; i < $scope.editroleFeatures.length; i++) {
          if(features.indexOf($scope.editroleFeatures[i].value) == -1){
            $scope.editroleFeatures[i].disabled = true; 
          }
          for (j = 0; j < tempFeatures.length; j++) {
            if ($scope.editroleFeatures[i].value.toLowerCase() == tempFeatures[j]) {
              $scope.editroleFeatures[i].checked = true;
            }
          }
        }
        for (i = 0; i < $scope.addRoleProdDisplayOptions.length; i++) {
          if (rowdomain.name == $scope.addRoleProdDisplayOptions[i].label) {
            tempArray = $scope.addRoleProdDisplayOptions[i].feature.split(",")
          }
        }

        if (tempFeatures.indexOf("rules_and_alerts") != -1) {
          enableEditRoleFeatures($scope.editroleFeatures, ['rule_creator'], features);
        } else {
          disableEditRoleFeatures($scope.editroleFeatures, ['rule_creator'], features);
        }

        if (tempFeatures.indexOf("dashboards") != -1) {
          enableEditRoleFeatures($scope.editroleFeatures, ['dashboard_admin'], features);
        } else {
          disableEditRoleFeatures($scope.editroleFeatures, ['dashboard_admin'], features);
        }
        
        if (tempFeatures.indexOf("dashboard_admin") != -1) {
          enableEditRoleFeatures($scope.editroleFeatures, ['workbench'], features);
        } else {
          disableEditRoleFeatures($scope.editroleFeatures, ['workbench'], features);
        }

        if (tempFeatures.indexOf("workbench") != -1) {
          enableEditRoleFeatures($scope.editroleFeatures, ['wb_creator'], features);
        } else {
          disableEditRoleFeatures($scope.editroleFeatures, ['wb_creator'], features);
        }
      
        if (tempFeatures.length === 1 && tempFeatures[0].toLowerCase().indexOf('health') > -1) {
          angular.forEach($scope.editroleFeatures, function (item) {
            item.checked = false;
            item.disabled = true;
            if (item.value === 'healthcheck') {
              item.checked = true;
              item.disabled = false;
              $scope.defaultFeatureCheck = 'healthcheck';
            }
          })
        }
      };

      var enableEditRoleFeatures = function(featureList,featuresToEnable, prodFeatures){
        featureList.map(function(item){
          if(prodFeatures.indexOf(item.value) !== -1 && featuresToEnable.indexOf(item.value) > -1){
            item.disabled = false;
          }
        })
      }

      var disableEditRoleFeatures = function(featureList,featuresToDisable, prodFeatures){
        featureList.map(function(item){
          if(featuresToDisable.indexOf(item.value) > -1){
            item.disabled = true;
          }
        })
      }

      $scope.isRequired = function (fieldName) {
        var requiredList = GlobalService.getVal('addUserMandetoryFields');
        for (i = 0; i < requiredList.length; i++) {
          if (requiredList[i] == fieldName) {
            return true;
          }
        }
        return false;
      };
      $scope.isRequiredRole = function (fieldName) {
        var requiredList = GlobalService.getVal('addRoleMandetoryFields');
        for (i = 0; i < requiredList.length; i++) {
          if (requiredList[i] == fieldName) {
            return true;
          }
        }
        return false;
      };
      $scope.editUser = function () {
        $scope.data_loading = true;
        $scope.editUserError = true;
        $scope.editUserErrorMsg = "Error!";
        angular.element(document.querySelector('.errorInput')).removeClass("errorInput");
        if (!(/^[0-9\)\(+-]+$/g.test($scope.editUserPhone)) && $scope.editUserPhone.length > 0) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.phoneNumberNotValid;
          angular.element(document.querySelector('#editUserPhone')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if (!(/^[a-zA-Z]*$/g.test($scope.editUserState))) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.UserStateNotValid;
          angular.element(document.querySelector('#editUserState')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if (!(/^[a-zA-Z]*$/g.test($scope.editUserCountry))) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.UserCountryNotValid;
          angular.element(document.querySelector('#editUserCountry')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if ($scope.editUserfirst_name.length > 50) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#editUserfirst_name')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if ($scope.editUserlast_name.length > 50) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#editUserlast_name')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if ($scope.editUserPhone.length > 50) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#editUserPhone')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if ($scope.editUserDepartment.length > 50) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#editUserDepartment')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if ($scope.editUserState.length > 50) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#editUserState')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if ($scope.editUserCity.length > 50) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#editUserCity')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if ($scope.editUserCountry.length > 50) {
          $scope.data_loading = false;
          $scope.editUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#editUserCountry')).addClass("errorInput");
          $scope.editUserError = false;
          return;
        }
        if (getCookie('mps') == undefined) {
          $window.location.href = localStorage.getItem("logOutUrl");
        } else {
          var tempWbUser = "";
          var isrnafeature = false;
          for (i = 0; i < $scope.roleList.length; i++) {
            for (j = 0; j < $scope.roleList[i].domains.length; j++) {
              if ($scope.editUserRole.value == $scope.roleList[i].name) {
                if ($scope.roleList[i].domains[j].mps.join(":") == $scope.editUsermps_def.id) {
                  if ($scope.roleList[i].domains[j].features.search("Workbench") != -1 || $scope.roleList[i].domains[j].features.search("workbench") != -1) {
                    tempWbUser = $scope.editUserEmail;
                  } else {
                    tempWbUser = GlobalService.getVal('genericUser');
                  }
                  if ($scope.roleList[i].domains[j].features.search("Creator") != -1 || $scope.roleList[i].domains[j].features.search("wb_creator") != -1) {
                    tempWbUser = $scope.editUserEmail;
                  } else {
                    tempWbUser = GlobalService.getVal('genericUser');
                  }
                }
              }
            }
          }
          if (($scope.remainingLicense == $scope.totalLicense) && (tempWbUser == $scope.editUserEmail)) {
            $scope.data_loading = false;
            $scope.editUserErrorMsg = $scope.noRemainingLiceses;
            $scope.editUserError = false;
            return;
          }
          if ($scope.oldEditRole != $scope.editUserRole.value) {
            for (i = 0; i < $scope.roleList.length; i++) {
              if ($scope.editUserRole.value == $scope.roleList[i].name) {
                for (j = 0; j < $scope.roleList[i].domains.length; j++) {
                  if ($scope.editUsermps_def.id == $scope.roleList[i].domains[j].mps.join(":")) {
                    if ($scope.roleList[i].domains[j].features.indexOf("Rules & Alerts") != -1) {
                      isrnafeature = true;
                    }
                    else {
                      isrnafeature = false;
                    }
                  }
                }
              }
            }
            for (i = 0; i < $scope.roleList.length; i++) {
              for (j = 0; j < $scope.roleList[i].domains.length; j++) {
                if ($scope.oldEditRole == $scope.roleList[i].name) {
                  if ($scope.roleList[i].domains[0].features.search("Workbench") != -1 || $scope.roleList[i].domains[0].features.search("workbench") != -1) {
                    $scope.remainingLicense--;
                  }
                  if ($scope.roleList[i].domains[0].features.search("Creator") != -1) {
                    $scope.creatorLicensesCount--;
                  }
                }
              }
            }
          }
          var udata = {
            "first_name": $scope.editUserfirst_name,
            "last_name": $scope.editUserlast_name,
            "department": $scope.editUserDepartment,
            "state": $scope.editUserState,
            "city": $scope.editUserCity,
            "country": $scope.editUserCountry,
            "sso": false,
            "wb_user_name": tempWbUser,
            "report_usage": $scope.editUserreport_usage ? true : false,
            "email": $scope.editUserEmail,
            "phone": $scope.editUserPhone,
            "org": getCookie('mps').substring(0, getCookie('mps').indexOf(':')),
            "role": $scope.editUserRole.value,
            "realm_def": "",
            "url_def": getCookie('adminAddUserDefUrl'),
            "mps_def": $scope.editUsermps_def.id,
            "is_prospect": false,
            "dashboard_admin": $scope.editUserdashboard_admin.val,
            "is_external": $scope.editUser_isExternalUser,
            "end_customer": $scope.editUser_isExternalUser ? $scope.editUserEndCustomer.val : '',
            "active": true
          };
          var userRoleFeatures = getProdFeatureList(udata);
          if(userRoleFeatures.indexOf('Creator') > -1 && ($scope.creatorLicensesCount == $scope.totalCreatorLicensesCount)){
            $scope.data_loading = false;
            $scope.editUserErrorMsg = GlobalService.getVal('noCreatorLiceses');
            $scope.editUserError = false;
            return;
          }
          $('#editUserModal').modal("hide");
          AdminService.editUser(udata).then(function (response) {
            $scope.userTracking("User", "Edit User", JSON.stringify(udata));
            
            if(userRoleFeatures.indexOf('Workbench') > -1){
              var features =  setTableauUserInfo(udata, 'user');
              var roleType = setTableauUserRoleType(features);
              var postData = {};
              if(roleType){
                var userData = {};
                var users = [];
                userData.userName = udata.email;
                userData.roleType = roleType;
                users.push(userData);
              }
              postData.userRole = users;
              AdminService.addNewTableauUser(postData).then(function(response){
                
              }, function(error){
                
              });
            }
            $scope.data_loading = false;
            $scope.MsgModelHeader = $scope.editUserMsgHeader;
            $scope.MsgModelMessage = response.data.Msg;
            $scope.roleSelected = false;
            $("#msgModal").modal("show");
            //$scope.tableParams.reload();
          }, function (error) {
            $scope.data_loading = false;
            $scope.editUserErrorMsg = error.data.Msg;
            $scope.editUserError = false;
          });
        }
      };
      $scope.addNewUser = function () {
        // $scope.newUserRoleOptions = angular.copy($scope.copynewUserRoleOptions);
        $scope.data_loading = true;
        $scope.addUserError = true;
        $scope.AddUserErrorMsg = "Error!";
        var emailValidation = (/^[\w.!#$%&'*+=?^_`(){|}~-]{1,64}@[a-zA-Z0-9-]+(?:\.[a-zA-Z-]{2,4})*$/.test($scope.newUserEmail));
        angular.element(document.querySelector('.errorInput')).removeClass("errorInput");
        if ($scope.totalUsers == $scope.MaxUsers) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.maxUserReached;
          $scope.addUserError = false;
          return;
        }
        if (!emailValidation) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.emailNotValid;
          angular.element(document.querySelector('#newUserEmail')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if (!(/^[0-9\)\(+-]+$/g.test($scope.newUserPhone)) && $scope.newUserPhone.length > 0) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.phoneNumberNotValid;
          angular.element(document.querySelector('#newUserPhone')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if (!(/^[a-zA-Z]*$/g.test($scope.newUserState))) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.UserStateNotValid;
          angular.element(document.querySelector('#newUserState')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if (!(/^[a-zA-Z]*$/g.test($scope.newUserCountry))) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.UserCountryNotValid;
          angular.element(document.querySelector('#newUserCountry')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if ($scope.newUserfirst_name.length > 50) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#newUserfirst_name')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if ($scope.newUserlast_name.length > 50) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#newUserlast_name')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if ($scope.newUserEmail === undefined || $scope.newUserEmail.length === 0) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = 'Error! Please enter Email ID';
          angular.element(document.querySelector('#newUserEmail')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if ($scope.newUserPhone.length > 50) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#newUserPhone')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if ($scope.newUserDepartment.length > 50) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#newUserDepartment')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if ($scope.newUserState.length > 50) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#newUserState')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if ($scope.newUserCity.length > 50) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#newUserCity')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if ($scope.newUserCountry.length > 50) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.charLimitError;
          angular.element(document.querySelector('#newUserCountry')).addClass("errorInput");
          $scope.addUserError = false;
          return;
        }
        if (getCookie('mps') == undefined) {
          $window.location.href = localStorage.getItem("logOutUrl");
        } else if ($scope.allUsersEmailList.indexOf($scope.newUserEmail) != -1) {
          $scope.data_loading = false;
          $scope.AddUserErrorMsg = $scope.addUserDuplicateEmail;
          $scope.addUserError = false;
        } else {
          var tempWbUser = "";
          var isrnafeature = false;
          for (i = 0; i < $scope.roleList.length; i++) {
            for (j = 0; j < $scope.roleList[i].domains.length; j++) {
              if ($scope.newUserRole.value == $scope.roleList[i].name) {
                if ($scope.roleList[i].domains[j].mps.join(":") == $scope.newUsermps_def.id) {
                  if ($scope.roleList[i].domains[j].features.search("Workbench") != -1) {
                    tempWbUser = $scope.newUserEmail;
                  } else {
                    tempWbUser = GlobalService.getVal('genericUser');
                  }
                  var featureList = $scope.roleList[i].domains[j].features.replace(/\s+/g, '').split(",");
                  if (featureList.indexOf('Creator') != -1) {
                    tempWbUser = $scope.newUserEmail;
                  } else {
                    tempWbUser = GlobalService.getVal('genericUser');
                  }
                }
              }
            }
          }
          for (i = 0; i < $scope.roleList.length; i++) {
            if ($scope.newUserRole.value == $scope.roleList[i].name) {
              for (j = 0; j < $scope.roleList[i].domains.length; j++) {
                if ($scope.newUsermps_def.id == $scope.roleList[i].domains[j].mps.join(":")) {
                  if ($scope.roleList[i].domains[j].features.indexOf("Rules & Alerts") != -1) {
                    isrnafeature = true;
                  }
                  else {
                    isrnafeature = false;
                  }
                }
              }
            }
          }
          if ($scope.remainingLicense == $scope.totalLicense && tempWbUser == $scope.newUserEmail) {
            $scope.data_loading = false;
            $scope.AddUserErrorMsg = $scope.noRemainingLiceses;
            $scope.addUserError = false;
            return;
          }
          if ($scope.totalCreatorLicensesCount == $scope.creatorLicensesCount && tempWbUser == $scope.newUserEmail) {
            $scope.data_loading = false;
            $scope.AddUserErrorMsg = GlobalService.getVal('noCreatorLiceses');
            $scope.addUserError = false;
            return;
          }
          var udata = {
            "first_name": $scope.newUserfirst_name,
            "last_name": $scope.newUserlast_name == "" ? " " : $scope.newUserlast_name,
            "department": $scope.newUserDepartment,
            "state": $scope.newUserState,
            "city": $scope.newUserCity,
            "country": $scope.newUserCountry,
            "sso": false,
            "wb_user_name": tempWbUser,
            "report_usage": $scope.newUserreport_usage ? true : false,
            "email": $scope.newUserEmail,
            "phone": $scope.newUserPhone,
            "org": getCookie('mps').substring(0, getCookie('mps').indexOf(':')),
            "role": $scope.newUserRole.value,
            "realm_def": "",
            "url_def": getCookie('adminAddUserDefUrl'),
            "mps_def": $scope.newUsermps_def.id,
            "is_prospect": false,
            "dashboard_admin": $scope.newUserdashboard_admin.val,
            "is_external": $scope.newUser_isExternalUser,
            "end_customer": $scope.newUser_isExternalUser ? $scope.newUserEndCustomer.val : '',
            "active": true
          };
          var userRoleFeatures = getProdFeatureList(udata);
          AdminService.addNewUser(udata).then(function (response) {
            $scope.userTracking("User", "Add New User", JSON.stringify(udata));
            if(userRoleFeatures.indexOf('Workbench') > -1){
              var features =  setTableauUserInfo(udata, 'user');
              var roleType = setTableauUserRoleType(features);
              var postData = {};
              if(roleType){
                var userData = {};
                var users = [];
                userData.userName = udata.email;
                userData.roleType = roleType;
                users.push(userData);
              }
              postData.userRole = users;
              AdminService.addNewTableauUser(postData).then(function(response){
                
              }, function(error){
                
              });
            }
            $('#addNewUserModal').modal("hide");
            $scope.MsgModelHeader = $scope.addUserMsgHeader;
            $scope.MsgModelMessage = response.data.Msg;
            $scope.data_loading = false;
            $("#msgModal").modal("show");
            $scope.addUserError = true;
          }, function (error) {
            $scope.data_loading = false;
            $scope.AddUserErrorMsg = error.data.Msg.toLowerCase();
            $scope.addUserError = false;
          });
        }
      };

      $scope.selectAllUser = function () {
        $scope.selectAll = !$scope.selectAll;
        if (!$scope.selectAll) {
          for (i = 0; i < $scope.data.length; i++) {
            $scope.data[i].selected = false;
            $scope.selectedRemove = false;
          }
        } else {
          for (i = 0; i < $scope.data.length; i++) {
            $scope.data[i].selected = true;
            $scope.selectedRemove = true;
          }
        }
      };
      $scope.editRole = function () {
        $scope.data_loading = true;
        var tempDomains = [];
        var tempObj = {};
        for (i = 0; i < $scope.rdata.length; i++) {
          if ($scope.rdata[i].name == $scope.editRoleName) {
            for (j = 0; j < $scope.rdata[i].domains.length; j++) {
              if ($scope.rdata[i].domains[j] != $scope.editRoleDomain) {
                tempDomains.push($scope.rdata[i].domains[j].mps.join(':'));
              }
            }
          }
        }
        tempDomains = $scope.unique(tempDomains);
        if (getCookie('mps') == undefined) {
          $window.location.href = localStorage.getItem("logOutUrl");
        } else {
          var featuresData = $filter('filter')($scope.editroleFeatures, { checked: true });
          var tempFeatures = [];
          var tempRealm = [];
          var userCountRole = 0;
          var tempUserWorkbenchList = [];
          var rnaalreadyassigned = false;
          for (i = 0; i < $scope.users.length; i++) {
            if ($scope.editRoleName == $scope.users[i].role) {
              userCountRole++;
            }
          }
          for (i = 0; i < featuresData.length; i++) {
            tempFeatures.push(featuresData[i].value);
          }
          if (!$scope.workbenchFeatureAssigned) {
            if (tempFeatures.indexOf("workbench") != -1 || tempFeatures.indexOf("Workbench") != -1) {
              for (i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].role == $scope.editRoleName && $scope.editRoleProdDisplay.id == $scope.users[i].mps_def) {
                  tempUserWorkbenchList.push($scope.users[i]);
                }
              }
            }
          } else {
            for (i = 0; i < $scope.users.length; i++) {
              if ($scope.users[i].role == $scope.editRoleName && $scope.editRoleProdDisplay.id == $scope.users[i].mps_def) {
                tempUserWorkbenchList.push($scope.users[i]);
              }
            }
          }
          if (tempUserWorkbenchList.length > ($scope.totalLicense - $scope.remainingLicense) && !$scope.workbenchFeatureAssigned) {
            $scope.editRoleErrorMsg = GlobalService.getVal('workbenchFeatureError');
            $scope.editRoleError = false;
            $scope.data_loading = false;
            return;
          }
          if (tempFeatures.length == 0) {
            $scope.editRoleErrorMsg = GlobalService.getVal('nofeatureselected');
            $scope.editRoleError = false;
            $scope.data_loading = false;
            return;
          }
          if($scope.creatorLicenseAssigned && tempFeatures.indexOf('wb_creator') == -1){
            $scope.creatorLicensesCount--;
          }
          if(tempFeatures.indexOf('wb_creator') > -1 && ($scope.totalCreatorLicensesCount === $scope.creatorLicensesCount) && $scope.associatedRoleUserList[$scope.editRoleName].length){
            $scope.editRoleErrorMsg = GlobalService.getVal('creatorFeatureError');
            $scope.editRoleError = false;
            $scope.data_loading = false;
            return;
          }
          var tempMps = getCookie('mps').split(':');
          var editRoleMPS = $scope.editRoleProdDisplay.id.split(":");
          if ($scope.addAdminFeature) {
            tempFeatures.push("admin");
          }
          var udata = {
            "name": $scope.editRoleName,
            "is_super": false,
            "domain": $scope.editRoleProdDisplay.label,
            "mfr": editRoleMPS[0],
            "prod": editRoleMPS[1],
            "sch": editRoleMPS[2],
            "features": tempFeatures,
            "realm": tempRealm
          };
          var tempUdata = {};
          AdminService.editRole(udata).then(function (response) {
            $scope.userTracking("Role", "Edit Role", JSON.stringify(udata));
            var userRoleFeatures = getProdFeatureList(udata);
            $('#editRoleModal').modal("hide");
            if(userRoleFeatures.indexOf('Workbench') > -1){
              var features =  setTableauUserInfo(udata, 'role');
              var roleType = setTableauUserRoleType(features);
              if(roleType){
                var postData = {};
                postData.userName = $scope.associatedRoleUserList[$scope.editRoleName];
                postData.roleType = roleType;
              }
              AdminService.updateTableauRoleUsers(postData).then(function(response){
                
              }, function(error){
                
              });
            }
            $scope.selectedRemoveRole = false;
            $scope.singleRoleSelected = false;
            $scope.MsgModelHeader = $scope.updateRoleMsgHeader;
            $scope.MsgModelMessage = response.data.Msg;
            $("#msgModal").modal("show");
            $scope.addUserError = true;
          }, function (error) {
            $scope.data_loading = false;
          });
          var genericUser = GlobalService.getVal('genericUser');
          for (i = 0; i < tempUserWorkbenchList.length; i++) {
            $scope.data_loading = true;
            tempUdata = {
              "first_name": tempUserWorkbenchList[i].first_name,
              "last_name": tempUserWorkbenchList[i].last_name,
              "department": tempUserWorkbenchList[i].department,
              "state": tempUserWorkbenchList[i].state,
              "city": tempUserWorkbenchList[i].city,
              "country": tempUserWorkbenchList[i].country,
              "sso": false,
              "wb_user_name": (tempFeatures.indexOf("workbench") != -1 || tempFeatures.indexOf("Workbench") != -1) ? tempUserWorkbenchList[i].email : genericUser,
              "report_usage": tempUserWorkbenchList[i].report_usage,
              "email": tempUserWorkbenchList[i].email,
              "phone": tempUserWorkbenchList[i].phone,
              "org": tempUserWorkbenchList[i].org,
              "role": tempUserWorkbenchList[i].role,
              "realm_def": "",
              "url_def": tempUserWorkbenchList[i].url_def,
              "mps_def": tempUserWorkbenchList[i].mps_def,
              "is_prospect": false,
              "dashboard_admin": tempUserWorkbenchList[i].dashboard_admin,
              "is_external": false,
              "active": true
            };
            AdminService.editUser(tempUdata).then(function (response) {
              //$scope.data_loading = false;
              $scope.roleSelected = false;
              $scope.data_loading = false;
              //$scope.tableParams.reload();
            }, function (error) {
              $scope.data_loading = false;
              $scope.editUserErrorMsg = error.data.Msg;
              $scope.editUserError = false;
            });
          }
        }
      };
      
      $scope.addProduct = function (role) {
        $scope.defaultFeatureCheck = getCookie('default_feature');
        $('#addProdfeaturesPermission').hide();
        var rowdata = role;
        if(!role){
          for (i = 0; i < $scope.roleList.length; i++) {
            if ($scope.roleList[i].selected) {
              rowdata = $scope.roleList[i];
            }
          }
        }
        $scope.addProdRoleDisName = rowdata.DisName;
        $scope.addProdRoleName = rowdata.name;
        var temp = [];
        for (i = 0; i < $scope.addRoleProdDisplayOptions.length; i++) {
          temp.push($scope.addRoleProdDisplayOptions[i]);
        }
        $scope.ProdaddRoleProdDisplayOptions = temp;
        for (i = 0; i < rowdata.domains.length; i++) {
          for (j = 0; j < $scope.ProdaddRoleProdDisplayOptions.length; j++) {
            if (rowdata.domains[i].name == $scope.ProdaddRoleProdDisplayOptions[j].label) {
              var features = rowdata.domains[i].features.split(",");
              $scope.ProdaddRoleProdDisplayOptions.splice(j, 1);
            }
          }
        }
        if ($scope.ProdaddRoleProdDisplayOptions.length == 2) {
          $scope.addProdRoleProd = $scope.ProdaddRoleProdDisplayOptions[0];
          tempArray = $scope.ProdaddRoleProdDisplayOptions[1].feature.split(",");
        } else {
          $scope.addProdRoleProd = $scope.ProdaddRoleProdDisplayOptions[0];
        }
        for (i = 0; i < $scope.addProdroleFeatures.length; i++) {
          if (features && features.length === 1 && features[0].toLowerCase().indexOf('health') > -1) {
            $scope.addProdroleFeatures[i].checked = false;
            $scope.addProdroleFeatures[i].disabled = true;
            if ($scope.addProdroleFeatures[i].value === 'healthcheck') {
              $scope.addProdroleFeatures[i].checked = true;
              $scope.addProdroleFeatures[i].disabled = false;
              $scope.defaultFeatureCheck = 'healthcheck';
            }
          }else {
            if ($scope.addProdroleFeatures[i].value == $scope.defaultFeatureCheck) {
              $scope.addProdroleFeatures[i].checked = true;
            } else {
              $scope.addProdroleFeatures[i].checked = false;
            }
          }
        }
      };
      $scope.addProductSubmit = function () {
        $scope.data_loading = true;
        var tempProdList = [];
        var tempDomains = [];
        for (i = 0; i < $scope.rdata.length; i++) {
          if ($scope.rdata[i].selected) {
            for (j = 0; j < $scope.rdata[i].domains.length; j++) {
              tempDomains.push($scope.rdata[i].domains[j].mps.join(':'));
              tempProdList.push($scope.rdata[i].domains[j].name);
            }
          }
        }
        tempDomains = $scope.unique(tempDomains);
        if (getCookie('mps') == undefined) {
          $window.location.href = localStorage.getItem("logOutUrl");
        } else {
          var featuresData = $filter('filter')($scope.addProdroleFeatures, { checked: true });
          var tempFeatures = [];
          var tempRealm = [];
          for (i = 0; i < featuresData.length; i++) {
            tempFeatures.push(featuresData[i].value);
          }
          if (tempFeatures.length == 0) {
            $scope.AddProdErrorMsg = GlobalService.getVal('nofeatureselected');
            $scope.addProdError = false;
            $scope.data_loading = false;
            return;
          }
          var tempMps = $scope.addProdRoleProd.id.split(':');
          var udata = {
            "name": $scope.addProdRoleName,
            "is_super": false,
            "domain": $scope.addProdRoleProd.label,
            "mfr": tempMps[0],
            "prod": tempMps[1],
            "sch": tempMps[2],
            "features": tempFeatures,
            "realm": tempRealm
          };
          $('#addProductModal').modal("hide");
          AdminService.addNewRole(udata).then(function (response) {
            $scope.userTracking("Role", "Add Product", JSON.stringify(udata));
            $scope.selectedRemoveRole = false;
            $scope.MsgModelHeader = $scope.addProdcutMsgHeader;
            $scope.MsgModelMessage = $scope.prodAddedMsg;
            $("#msgModal").modal("show");
          }, function (error) {
            $scope.data_loading = false;
          });
        }
      };
      $scope.addRole = function () {
        $scope.data_loading = true;
        $scope.noFeatureWarning = true;
        if (!(/^[0-9a-zA-Z\_\.\)\(\-]+$/g.test($scope.addRoleName))) {
          $scope.data_loading = false;
          $scope.addRoleErrorMsg = $scope.roleNameNotValid;
          angular.element(document.querySelector('#addRoleName')).addClass("errorInput");
          $scope.addRoleError = false;
          return;
        }


        if (getCookie('mps') == undefined) {
          $window.location.href = localStorage.getItem("logOutUrl");
        } else if ($scope.allRoleNameList.indexOf($scope.addRoleName.toLowerCase()) != -1) {
          $scope.data_loading = false;
          $scope.addRoleError = false;
        } else {
          var featuresData = $filter('filter')($scope.roleFeatures, { checked: true });
          var tempFeatures = [];
          var tempRealm = [];
          for (i = 0; i < featuresData.length; i++) {
            tempFeatures.push(featuresData[i].value);
          }
          if (tempFeatures.length == 0) {
            $scope.addRoleErrorMsg = GlobalService.getVal('nofeatureselected');
            $scope.addRoleError = false;
            $scope.data_loading = false;
            return;
          }
          var tempMPS = $scope.addRoleProdDisplay.id.split(':');
          var udata = {
            "name": $scope.addRoleName,
            "is_super": false,
            "domain": $scope.addRoleProdDisplay.label,
            "mfr": tempMPS[0],
            "prod": tempMPS[1],
            "sch": tempMPS[2],
            "features": tempFeatures,
            "realm": tempRealm
          };
          $('#addRoleModal').modal("hide");
          AdminService.addNewRole(udata).then(function (response) {
            $scope.userTracking("Role", "Add New Role", JSON.stringify(udata));
            $scope.singleRoleSelected = false;
            $scope.MsgModelHeader = $scope.addRoleMsgHeader;
            $scope.MsgModelMessage = response.data.Msg;
            $("#msgModal").modal("show");
            $scope.addUserError = true;
          }, function (error) {
            $scope.data_loading = false;
          });
        }
      };
      $scope.deleteUser = function () {
        $scope.data_loading = true;
        var tempCount = 0;
        for (i = 0; i < $scope.data.length; i++) {
          if ($scope.data[i].selected) {
            tempCount++;
          }
        }
        var selectedEmails = [];
        var selectedRoles = [];
        for (i = 0; i < $scope.data.length; i++) {
          if ($scope.data[i].selected) {
            var tempEmail = $scope.data[i].email;
            selectedEmails.push($scope.data[i].email);
            AdminService.deleteUser($scope.data[i].email).then(function (response) {
              $scope.userTracking("User", "Delete User", tempEmail);
              $scope.selectAll = false;
              tempCount--;
              var msg = response.data.Msg;
              tempEmail = msg.substr(5, msg.indexOf("removed") - 6);
              for (l = 0; l < $scope.data.length; l++) {
                if ($scope.data[l].email == tempEmail) {
                  $scope.data[l].selected = false;
                  //$scope.users.splice(l,1);
                  $scope.selectedRemove = false;
                  $scope.selectAll = false;
                  $scope.userEditSelected = false;
                  $scope.MsgModelHeader = $scope.deletedMsgHeader;
                  $scope.MsgModelMessage = 'User(s) ' + selectedEmails.join(',') + ' deleted successfully'
                  $scope.data_loading = false;
                  $("#msgModal").modal("show");
                }
              }
            }, function (error) {
            });
          }
        }
        var postData = {};
        postData.users = selectedEmails;
        AdminService.deleteTableauRoleUsers(postData).then(function(response){
                
        }, function(error){
          
        });
      };
      
      $scope.deleteRole = function(){
        $scope.data_loading = true;
        var modalMsg = '';
        var tempRoleName = [];
        var displayNames = [];
        var rolesList = '';
        for (i = 0; i < $scope.rdata.length; i++) {
          if ($scope.rdata[i].selected) {
            tempRoleName.push($scope.rdata[i].name);
          }
        }
        var elemExists = compareArrays($scope.associatedRoleList,tempRoleName);
        tempRoleName = tempRoleName.filter(function(val) {
          return elemExists.indexOf(val) == -1;
        });
        $scope.roleList.map(function(item){
          if(elemExists.indexOf(item.name) > -1 && item.DisName.toLowerCase() !== 'admin'){
            displayNames.push(item.DisName);
          }
        })
        var adminRoleDeleteText = tempRoleName.indexOf($scope.loggedInUserrole) > -1 ? $scope.loggedInUserroleDisplay + " " + $scope.adminRoleDeleteMsgHeader : '';
        var existingRoleText = tempRoleName.length > 0 ? displayNames.sort().join(",") + ' cannot be deleted as they are already associated to some users.' : '';
        rolesList = tempRoleName.join(",");
        if(!rolesList.length){
          $("#deleteRoleConfModal").modal("hide");
          $scope.MsgModelHeader = 'Delete Role';
          $scope.MsgModelMessage = 'All roles are associated to users. Cannot delete.';
          $scope.data_loading = false;
          $("#msgModal").modal("show");
          return;
        }
        AdminService.deleteRole(rolesList).then(function (response) {
          if(adminRoleDeleteText){
            modalMsg = adminRoleDeleteText;
          }else if(elemExists.length > 0 && tempRoleName.length > 0){
            modalMsg = existingRoleText + '\n' + response.data.Msg;
          }else{
            modalMsg = response.data.Msg;
          }
          $("#deleteRoleConfModal").modal("hide");
          $scope.userTracking("Role", "Delete Role", JSON.stringify(rolesList));
          $scope.MsgModelHeader = 'Delete Role';
          $scope.MsgModelMessage = modalMsg;
          $scope.selectedRemoveRole = false;
          $scope.selectAllRole = false;
          $scope.singleRoleSelected = false;
          $scope.data_loading = false;
          $("#msgModal").modal("show");
        }, function (error) {
        }); 
        if ($scope.roleList.length != 0) {
          $scope.tableRoleParams.reload();
        } 
      }

      $scope.toggleSelectAll = function (param) {
        $scope.slectedCount = 0;var searchedData;
        if (param == 'all') {
          $scope.selectAll = !$scope.selectAll;
          $scope.selectAllAll = !$scope.selectAllAll;
          if($scope.filterObj.userList.length){
            searchedData = $scope.searchUseronFilteredData($scope.data);
          }else{
            searchedData = $scope.searchData();
          }
          $scope.data = searchedData;
          for(i = 0; i < $scope.data.length; i++){
            $scope.data[i].selected = false;
            $scope.selectedRemove = false;
            if($scope.selectAll && !searchedData[i].adminUserItem){
              $scope.data[i].selected = true;
              $scope.selectedRemove = true;
            }
          }
        } else {
          param.selected = !param.selected;
          for (i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].selected) {
              $scope.selectedRemove = true;
              break;
            } else {
              $scope.selectedRemove = false;
            }
          }
          $scope.selectAll = false;
        }
        for (i = 0; i < $scope.data.length; i++) {
          if ($scope.data[i].selected) {
            $scope.slectedCount++;
          }
        }
        if ($scope.slectedCount == $scope.data.length) {
          $scope.selectAll = true;
        }
        if ($scope.slectedCount == 1) {
          $scope.userEditSelected = true;
        } else {
          $scope.userEditSelected = false;
        }
      };
      $scope.toggleSelectAllRole = function (param) {
        $scope.slectedRoleCount = 0;
        if (param == 'all') {
          $scope.selectAllRole = !$scope.selectAllRole;
          $scope.selectAllRoleAll = !$scope.selectAllRoleAll;
          $scope.rdata = $scope.searchRoleListData();
          if (!$scope.selectAllRole) {
            for (i = 0; i < $scope.rdata.length; i++) {
              $scope.roleList[i].selected = false;
              $scope.selectedRemoveRole = false;
            }
            $scope.tableRoleParams.reload();
          } else {
            for (i = 0; i < $scope.rdata.length; i++) {
              $scope.rdata[i].selected = true;
              $scope.selectedRemoveRole = true;
            }
            $scope.tableRoleParams.reload();
          }
        } else {
          param.selected = !param.selected;
          for (i = 0; i < $scope.rdata.length; i++) {
            if ($scope.rdata[i].selected) {
              $scope.selectedRemoveRole = true;
              break;
            } else {
              $scope.selectedRemoveRole = false;
            }
          }
          $scope.selectAllRole = false;
          $scope.tableRoleParams.reload();
        }
        for (i = 0; i < $scope.rdata.length; i++) {
          if ($scope.rdata[i].selected) {
            $scope.slectedRoleCount++;
          }
        }
        if ($scope.slectedRoleCount == $scope.rdata.length) {
          $scope.selectAllRole = true;
        }
      };
      
      $scope.searchData = function () {
        if ($scope.searchKeyword)
          return $filter('filter')($scope.users, $scope.customFilter, $scope.searchKeyword);
        return $scope.users;
      };

      $scope.searchUseronFilteredData = function (data) {
        if ($scope.searchKeyword)
          return $filter('filter')(data, $scope.customFilter, $scope.searchKeyword);
        return data;
      };

      $scope.adminFeatureCheck = function () {
        $scope.showRoleToggle = false;
        $scope.isExternalRole.val = false;
        $('#featuresPermission').hide();
        $scope.defaultFeatureCheck = getCookie('default_feature');
        for (i = 0; i < $scope.roleFeatures.length; i++) {
          if ($scope.roleFeatures[i].value == $scope.defaultFeatureCheck) {
            $scope.roleFeatures[i].checked = true;
          } else {
            $scope.roleFeatures[i].checked = false;
          }
        }
      };
      $scope.changeTheme = function () {
        if (!$scope.darkModeOff) {
          document.getElementById('theme_css').href = '/apps/app/admin/css/admin/style.css';
        } else {
          document.getElementById('theme_css').href = '/apps/app/admin/css/admin/styleInverted.css';
        }
      };
      $scope.customFilter = function (item) {
        var val = $scope.searchKeyword.toLowerCase();
        var externalValText = 'external';
        var internalValText = 'internal';
        if((externalValText.indexOf(val) > -1 && item.is_external) || internalValText.indexOf(val) > -1 && !item.is_external){
          return item;
        }else{
          return item.name.toLowerCase().indexOf(val || '') !== -1 || item.email.toLowerCase().indexOf(val || '') !== -1 || item.DisRuleName.toLowerCase().indexOf(val || '') !== -1 || item.report_usage.toString().toLowerCase().toString().indexOf(val || '') !== -1 || item.last_login.toLowerCase().toString().indexOf(val || '') !== -1 || item.active.toString().toLowerCase().toString().replace("false", "inactive").replace("true", "active").indexOf(val || '') !== -1 || item.dashboard_admin.toString().indexOf(val || '') !== -1 || item.created_on.toLowerCase().indexOf(val.toLowerCase() || '') !== -1 || item.modified_on.toLowerCase().indexOf(val.toLowerCase() || '') !== -1 || item.end_customer.toLowerCase().indexOf(val || '') !== -1;
        }
      };

      $scope.logoutUser = function () {

        AdminService.logoutInfoserver().then(function (response) {
          var logouturl = $window.location.href = getCookie('logouturl');
          var theCookies = document.cookie.split(';');
          var cookiesList = [],
            cookiesNameValue,
            cookiesName;

          for (var i = 1; i <= theCookies.length; i++) {

            cookiesNameValue = theCookies[i - 1];
            cookiesName = cookiesNameValue.split("=")[0];
            cookiesName = cookiesName.trim();
            cookiesList.push(cookiesName);
          }
          for (var i = 0; i < cookiesList.length; i++) {
            cookiesName = cookiesList[i];
            document.cookie = cookiesName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + $scope.currentDomain + ";path=/";

          }
          $window.location.href = logouturl;

        });

      };

      var setTableauUserInfo = function(data, type){
        var features;
        if(type === 'user'){
          var roleData = $scope.roleList.filter(function(role){
            return data.role === role.name;
          });
          var roleProd = roleData[0].domains.filter(function(item){
            return data.mps_def === item.mps.join(":");
          })
          features = roleProd[0].features;
        }else {
          features = data.features.toString();
          features = $scope.matchFeatures(features);
        }
        features = features.replace(/\s+/g, '').split(",");
        return features;
      }

      var setTableauUserRoleType = function(features){
        var arr2 = GlobalService.getVal('tableauSiteRoleFeaturesMap');
        for(var i=0; i < arr2.length ; i++){
          if(arr2[i].features.length === _.intersection(features, arr2[i].features).length){
            return arr2[i].site_role;
          }
        }
      }

      // Reset Modal Fields When Hidden/Submited
      $('.modal').on('hidden.bs.modal', function () {
        if (!($(this).attr("id") == "msgModal") && !($(this).attr("id") == "ResetPasswordModal") && !($(this).attr("id") == "msgErrorModal") && !($(this).attr("id") == "deleteUserConfModal") && !($(this).attr("id") == "deleteRoleConfModal") && !($(this).attr("id") == "editUserModal") && !($(this).attr("id") == "editUserModal") && !($(this).attr("id") == "addNewUserModal") && !($(this).attr("id") == "editRoleModal") && !($(this).attr("id") == "addProductModal") && !($(this).attr("id") == "addRoleModal") && !($(this).attr("id") == "deleteProductConfModal")) {
          $(this).find('form')[0].reset();
          $scope.addRoleError = true;
        }
        if ($(this).attr("id") == "editRoleModal") {
          $scope.editRoleProdDisplay = $scope.addRoleProdDisplayOptions[0];
          for (i = 0; i < $scope.editroleFeatures.length; i++) {
            $scope.editroleFeatures[i].checked = false;
          }
          $scope.editRoleError = true;
        }
        if ($(this).attr("id") == "addProductModal") {
          for (i = 0; i < $scope.addProdroleFeatures.length; i++) {
            if ($scope.addProdroleFeatures[i].value == $scope.defaultFeatureCheck) {
              $scope.addProdroleFeatures[i].checked = true;
            } else {
              $scope.addProdroleFeatures[i].checked = false;
            }
          }
          $scope.addProdRoleProd = $scope.ProdaddRoleProdDisplayOptions[0];
        }
        if ($(this).attr("id") == "addRoleModal") {
          $scope.addRoleProdDisplay = $scope.addRoleProdDisplayOptions[0];
          $scope.addRoleName = "";
          for (i = 0; i < $scope.roleFeatures.length; i++) {
            if ($scope.roleFeatures[i].value == $scope.defaultFeatureCheck) {
              $scope.roleFeatures[i].checked = true;
            } else {
              $scope.roleFeatures[i].checked = false;
            }
          }
          $scope.addRoleError = true;
        }
        if ($(this).attr("id") == "addNewUserModal") {
          $(this).find('form')[0].reset();
          $scope.newUserlast_name = "";
          $scope.newUserRole = $scope.newUserRoleOptions[0];
          $scope.roleSelected = false;
          $scope.addUserError = true;
          $scope.newUserreport_usage = true;
        }
        if ($(this).attr("id") == "editUserModal") {
          $scope.roleSelected = false;
        }
        $scope.addRoleError = true;
        $scope.editRoleError = true;
        $scope.addProdError = true;
        $scope.addRoleWarning = true;
        $scope.editRoleWarning = true;
        $scope.addProdWarning = true;
        $scope.editUserError = true;
        $scope.resetPassErrorFlag = false;
        angular.element(document.querySelector('.errorInput')).removeClass("errorInput");
      });
      //Move Pager To proper Location
      angular.element(document).ready(function () {
        $("#userTablePager").parent().parent().appendTo("#userListPagerLocation");
        $("#roleTablePager").parent().parent().appendTo("#roleListPagerLocation");
      });
      $scope.unique = function (list) {
        var uList = [];
        for (var i = 0; i < list.length; i++) {
          if (uList.indexOf(list[i]) < 0) {
            uList.push(list[i])
          }
        }
        return uList;
      }

      $scope.setRoleList = function () {
        $scope.newUserRoleOptions = getFilteredRoles('Internal');
      }

      var getFilteredRoles = function (type) {
        var arr = [], filteredArr = [];
        var tempObj = { id: "", label: 'Select Role', value: "" };
        arr[0] = tempObj;
        if(type === 'External'){
          filteredArr = $scope.copynewUserRoleOptions.filter(function(item){
            return item.roleType === 'External';
          });
        }else{
          filteredArr = $scope.copynewUserRoleOptions.filter(function(item){
            return item.roleType === 'Internal';
          });
        }
        arr = arr.concat(filteredArr);
        return arr;
      }

      $scope.filterRoles = function(type){
        var roleType = 'Internal';
        $scope.roleSelected = false;
        $scope.showEndCustomerList = false;
        if ($scope.newUser_isExternalUser || $scope.editUser_isExternalUser) {
          roleType = 'External';
        }
        $scope.newUserRoleOptions = getFilteredRoles(roleType);
        if (type === 'edit') {
          $scope.editUserRole = $scope.newUserRoleOptions[0];
          $scope.editUserEndCustomer.val = '';
        } else {
          $scope.newUserRole = $scope.newUserRoleOptions[0];
          $scope.newUserEndCustomer.val = '';
        }
      }

      $scope.filterFeatures = function (val, prodName) {
        var defaultFeatureObj, featuresToEnable, featuresToDisable;
        $scope.addRoleWarning = true;
        $scope.roleFeatures = angular.copy($scope.copyOfRoleFeatures);
        $scope.noFeatureWarning = true;
        $scope.addRoleError = true;
        var featureStr = prodName.feature.replace(/\s+/g, '')
        var featureList = featureStr.split(',');
        if (val) {
          angular.forEach($scope.roleFeatures, function (item) {
            item.checked = false;
            item.disabled = true;
            if (featureList.indexOf(item.value) !== -1 && item.value === 'healthcheck') {
              item.checked = true;
              item.disabled = false;
              $scope.defaultFeatureCheck = 'healthcheck';
            }
            if(featureList.indexOf(item.value) == -1 && item.value === 'healthcheck'){
              $scope.noFeatureWarning = false;
              $scope.noFeatureWarningMsg = GlobalService.getVal('noFeatureWarningMsg');
            }
          })
        } else {
          $scope.defaultFeatureCheck = getCookie('default_feature');
          angular.forEach($scope.roleFeatures, function (item) {
            item.checked = false;
            if(featureList.indexOf(item.value) == -1){
              item.disabled = true;
            }
            if($scope.defaultFeatureCheck === item.value){
              item.checked = true;
              defaultFeatureObj = item;
            }
          })
          var obj = setFeaturesToEnableDisable(defaultFeatureObj.value);
          if (defaultFeatureObj.value == 'rules_and_alerts') {
            featuresToEnable = obj.enableFeatures;
            featuresToDisable = obj.disableFeatures;
          }
          if(defaultFeatureObj.value === 'dashboards'){
            featuresToEnable = obj.enableFeatures;
            featuresToDisable = obj.disableFeatures;
          }
          if(defaultFeatureObj.value === 'dashboard_admin'){
            featuresToEnable = obj.enableFeatures;
            featuresToDisable = obj.disableFeatures;
          }
          enablePermissions(defaultFeatureObj, $scope.roleFeatures, featuresToEnable, featuresToDisable, $scope.addRoleProdDisplay);
        }
      }

      var getEndCustomers = function (prodName) {
        $scope.endCustomerMPSList = [];
        var groupedData = _.groupBy($scope.endCustomerList, function (d) {
          return d.mfr + ":" + d.prod + ":" + d.sch;
        });
        var details = groupedData[prodName.id] || groupedData[prodName];
        if(details){
          $scope.endCustomerMPSList = details.map(function (item) {
            return item.endcustomer_name;
          });
        }
      }

      $scope.loadEndCustomerList = function (prodName) {
        $scope.showEndCustomerList = true;
        getEndCustomers(prodName);
      }

      // BO: End Customer controller

      $scope.addSysIds = function(){
        $scope.sysIdList.forEach(function(item, index) {
          if ($scope.sysIds.toAddList.indexOf(item.name) > -1) {
            var obj= {};
            obj.name = item.name;
            item.selected = true;
            $scope.selectedSysIds.push(obj);
            $scope.unavailableSysids.push(item.name);
          }
        });
        resetMultiSelectValues();
        if($('.add-sysid-list').val() == null){
          $scope.sysIds.toAddList = [];
        }
      }

      $scope.removeSysIds = function(){
        var sysIdsToRemove = [];
        $scope.sysIds.toRemoveList.map(function(item){
          var obj = {};
          obj.name = item;
          sysIdsToRemove.push(obj);
        })
        angular.forEach(sysIdsToRemove, function(item, index){
            angular.forEach($scope.sysIdList, function(sysId, index1){
              if(sysId.name === item.name){
                sysId.selected = false;
              }
            })
        });
        sysIdsToRemove.map(function(item){
          removeItemFromList($scope.selectedSysIds, item);
        });
        resetMultiSelectValues();
        if($('.add-sysid-list').val() == null){
          $scope.sysIds.toRemoveList = [];
        }
      }

      var resetMultiSelectValues = function(){
        $(".sysid-list option:selected").prop("selected", false);
      }

      var removeItemFromList = function (list, itemToRemove) {
        list.forEach(function (item, index) {
          if (item.name === itemToRemove.name) {
            list.splice(index, 1);
            var sysIdIndex = $scope.unavailableSysids.indexOf(itemToRemove.name);
            $scope.unavailableSysids.splice(sysIdIndex,1);
          }
        });
      }

      $scope.toggleAll = function (list, modelVal) {
        var toggleStatus = !modelVal;
        angular.forEach(list, function (item) {
          if (!item.selected) {
            item.checked = toggleStatus;
          }
        });
      }

      var getPages = function (prodName) {
        resetPagination();
        $scope.pagination.noOfPages = Math.ceil($scope.totalSysids / $scope.pagination.pageSize);
        $scope.pages = Array.from({ length: $scope.pagination.noOfPages }, function (_, i) {
          return getPageLabel($scope.totalSysids, $scope.pagination.pageSize, i);
        });
      }

      $scope.getSysIDList = function (prodName) {
        $scope.sysIdList = [];
        $scope.isLoading = true;
        $scope.showSysIDList = true;
        AdminService.getSysIdList(prodName.id, $scope.pagination.startIndex, $scope.pagination.endIndex, $scope.searchText.val).then(function (response) {
          var data = response.data.Data;
          $scope.totalSysids = parseInt(data.pop());
          if($scope.shouldCallLoadPages){
            getPages(prodName);
            $scope.shouldCallLoadPages = false;
          }
          data.map(function (item) {
            var obj = {};
            obj.name = item;
            obj.selected = $scope.unavailableSysids.indexOf(item) > -1 ? true : false;
            $scope.sysIdList.push(obj);
          });
          $scope.showSearchBox = $scope.sysIdList.length > 0 || $scope.searchText.val.length > 0 ? true : false;
          $scope.isLoading = false;
          var endIndex = $scope.totalSysids <= $scope.pagination.endIndex ? $scope.totalSysids : $scope.pagination.endIndex + 1;
          $scope.paginationText = 'Showing ' + ($scope.pagination.startIndex + 1) + ' to ' + endIndex + ' of ' + $scope.totalSysids;
        }, function () {
          $scope.isLoading = false;
          $scope.showErrorMsg = true;
          $scope.showSearchBox = false;
        });
      }

      function getPageStart(pageSize, pageNo) {
        return pageSize * pageNo;
      };

      function getPageLabel(total, pageSize, pageNo) {
        var start = Math.max(getPageStart(pageSize, pageNo), 0);
        var end = Math.min(getPageStart(pageSize, pageNo + 1), total);
        var obj = {};
        obj.startIndex = start;
        obj.endIndex = (end === $scope.totalSysids) ? $scope.totalSysids : end - 1;
        return obj;
      }

      $scope.loadNextSet = function (prodName) {
        $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
        var page = $scope.pages[$scope.pagination.currentPage - 1];
        $scope.pagination.startIndex = page.startIndex;
        $scope.pagination.endIndex = page.endIndex;
        $scope.getSysIDList(prodName);
      }

      $scope.loadPrevSet = function (prodName) {
        $scope.pagination.currentPage = $scope.pagination.currentPage - 1;
        var page = $scope.pages[$scope.pagination.currentPage - 1];
        $scope.pagination.startIndex = page.startIndex;
        $scope.pagination.endIndex = page.endIndex;
        $scope.getSysIDList(prodName);
      }

      $scope.getEndCustomerDetails = function () {
        $scope.selectAllEndCustomers = {val :false};
        $scope.selectedEndCustomerToRemove = false;
        $scope.filterObj.endCustomerList = [];
        $scope.endCustomerFilterGroupedData = angular.copy(GlobalService.getVal('endCustomerFilterGroupedData'));
        AdminService.getEndCustomersList().then(function (response) {
          var data = response.data.Data;
          $scope.endCustomerList = data;
          $scope.endCustomerList.map(function(item){
            item.updated_on = moment(new Date(item.updated_on)).local().format('YYYY-MM-DD HH:mm:ss');
            item.selected = false;
          });
          $scope.endCustomerNameMap = data.map(function(item){
            return item.endcustomer_name;
          });
          $scope.endCustomerParams = new ngTableParams({
            page: GlobalService.getVal('page'),
            count: GlobalService.getVal('count'),
            reload: $scope.endCustomerParams,
            sorting: { endcustomer_name: "asc" }
          }, {
              // total: $scope.endCustomerList.length,
              counts: [],
              getData: function ($defer, params) {
                var searchedData = $scope.searchEndCustomerData();
                params.total($scope.endCustomerList.length);
                if (params.settings().$scope == null) {
                  params.settings().$scope = $scope;
                }
                if(searchedData){
                  var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;
                  $scope.endCustomerData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }
                // $scope.data = searchedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                $defer.resolve($scope.endCustomerData);
                params.total(orderedData.length);
                $scope.copyOfEndCustomerList = angular.copy($scope.endCustomerList);
                orderedData.forEach(function(item){
                  for(key in item){
                    $scope.endCustomerFilterGroupedData.map(function(item1){
                      if(item1.showSearch){
                        item1.searchText = '';
                      }
                      if(item1.isDateType){
                        item1.data = angular.copy(GlobalService.getVal('timeListFilter'));
                      }else{
                        if(item1.columnName === key && item[key] !== ''){
                          if(key === 'serial_number'){
                            var serialArrItem = item[key];
                            serialArrItem.forEach(function(item){
                              var serialObj = {};
                              serialObj.name = item;
                              serialObj.selected = false;
                              item1.data.push(serialObj);
                            })
                          }else{
                            var obj = {}; 
                            obj.name = item[key];
                            obj.selected = false;
                            item1.data.push(obj);
                          }
                          item1.data = _.uniqBy(item1.data, 'name');
                        }
                      }
                    })
                  }
                })
              }
          });
          $timeout(function(){
            if($scope.endCustomerList.length > 0){
              $scope.endCustomerParams.reload();
            }
          })
          $scope.groupedData = _.groupBy(data, function (d) {
            return d.mfr + ":" + d.prod + ":" + d.sch;
          });
        })
      }

      $scope.setUnavailableSysidList = function (prodName) {
        var mpsGroupedArray = $scope.groupedData[prodName.id];
        var sysIdArr = [];
        if (mpsGroupedArray) {
          mpsGroupedArray.map(function (item) {
            sysIdArr.push(item.serial_number);
          });
          $scope.unavailableSysids = _.uniq(_.flatten(sysIdArr));
        }else{
          $scope.unavailableSysids = [];
        }
      }

      $scope.openModalPopup = function (selector) {
        $(selector).modal("show");
      }

      $scope.addEndCustomer = function () {
        $scope.showEndCustomerExistsError = false;
        $scope.selectAllEndCustomers.val = false;
        $scope.selectedEndCustomerToRemove = false;
        var postData = {};
        var sysIds = [];
        $scope.selectedSysIds.map(function (item) {
          sysIds.push(item.name);
        })
        postData.endcustomer_name = $scope.addNewEndCustomer.endCustomerName;
        postData.serial_number = sysIds.toString();
        postData.created_by = $scope.loggedInUserEmail;
        postData.updated_on = '';
        if($scope.endCustomerNameMap.indexOf($scope.addNewEndCustomer.endCustomerName) !== -1){
          $scope.showEndCustomerExistsError = true;
          return;
        } else {
          AdminService.addEndCustomer($scope.addNewEndCustomer.prodName.id, postData).then(function (response) {
              $scope.userTracking("User", "Add New End Customer", JSON.stringify(postData));
              $('#addEndCustomerModal').modal("hide");
              $scope.MsgModelHeader = 'End Customer';
              $scope.MsgModelMessage = response.data.Msg;
              $scope.data_loading = false;
              $("#msgModal").modal("show");
          }, function (error) {
              $scope.data_loading = false;
          });
        }
      }

      $scope.editEndCustomerModal = function (endCustomerDetails) {
        $scope.selectedSysIds = [];
        $scope.editEndCustomer.endCustomerName = endCustomerDetails.endcustomer_name;
        var endCustomerProdName = endCustomerDetails.mfr + ":" + endCustomerDetails.prod + ":" + endCustomerDetails.sch;
        angular.forEach($scope.endCustomerProductList, function (item) {
          if (endCustomerProdName === item.id) {
            $scope.editEndCustomer.prodName = item;
          }
        });
        $scope.editEndCustomer.created_by = endCustomerDetails.created_by;
        $scope.editEndCustomer.updated_on = endCustomerDetails.updated_on;
        $scope.shouldCallLoadPages = true;
        $scope.searchText.val = "";
        resetPagination();
        $scope.getSysIDList($scope.editEndCustomer.prodName);
        $scope.setUnavailableSysidList($scope.editEndCustomer.prodName);
        if (endCustomerDetails.serial_number.length > 0) {
          angular.forEach(endCustomerDetails.serial_number, function (serialNo) {
            var obj = {};
            obj.name = serialNo;
            obj.checked = false;
            obj.selected = true;
            $scope.selectedSysIds.push(obj);
          });
        }
        $('#editEndCustomerModal').modal("show");
      }

      $scope.updateEndCustomerDetails = function () {
        var postData = {};
        var sysIds = [];
        $scope.selectedSysIds.map(function (item) {
          sysIds.push(item.name);
        })
        postData.endcustomer_name = $scope.editEndCustomer.endCustomerName;
        postData.serial_number = sysIds.toString();
        postData.created_by = $scope.editEndCustomer.created_by;
        postData.updated_on = $scope.editEndCustomer.updated_on;
        AdminService.updateEndCustomer($scope.editEndCustomer.prodName.id, postData).then(function (response) {
          $scope.userTracking("User", "Update End Customer", JSON.stringify(postData));
          $('#editEndCustomerModal').modal("hide");
          $scope.MsgModelHeader = 'Edit End Customer';
          $scope.MsgModelMessage = response.data.Msg;
          $("#msgModal").modal("show");
        }, function () {

        });
      }

      var compareArrays = function(arr1, arr2){
        var exists = arr1.filter(function (elem) {
          return arr2.indexOf(elem) > -1;
        });
        return exists;
      }

      $scope.deleteEndCustomer = function () {
        var elemExists = compareArrays($scope.associatedEndCustomerList,$scope.endCustomersToDelete);
        $scope.endCustomersToDelete = $scope.endCustomersToDelete.filter(function(val) {
          return elemExists.indexOf(val) == -1;
        });
        var existingEndCustomerText = $scope.endCustomersToDelete.length > 0 ? elemExists.sort().join(",") + ' cannot be deleted as they are already associated to some users.' : '';
        $scope.MsgModelMessage = elemExists.length > 0 && $scope.endCustomersToDelete.length > 0 ? existingEndCustomerText + '\n' + 'response.data.Msg' : 'response.data.Msg';
        AdminService.deleteEndCustomer($scope.endCustomersToDelete).then(function (response) {
          $scope.userTracking("User", "Delete End Customer", JSON.stringify($scope.endCustomersToDelete));
          $('#deleteEndCustomerConfModal').modal("hide");
          $scope.MsgModelHeader = 'Delete End Customer';
          $scope.MsgModelMessage = elemExists.length > 0 && $scope.endCustomersToDelete.length > 0 ? existingEndCustomerText + '\n' + response.data.Msg : response.data.Msg;
          $("#msgModal").modal("show");
          $scope.selectedEndCustomerToRemove = false;
          $scope.endCustomersToDelete = [];
        })
      }

      $scope.resetPopup = function () {
        resetObj();
        $scope.sysIdList = [];
        $scope.showSysIDList = false;
        $scope.isLoading = false;
        $scope.selectedSysIds = [];
        resetMultiSelectValues();
        resetPagination();
        $scope.shouldCallLoadPages = true;
        $scope.showEndCustomerExistsError = false;
        $scope.showSearchBox= false;
        $scope.searchText.val = '';
        $scope.searchText.tableSearch = '';
      }

      var resetObj = function () {
        $scope.addNewEndCustomer = {
          endCustomerName: '',
          prodName: $scope.endCustomerProductList[0]
        }
      }

      var resetPagination = function(){
        $scope.pagination = {
          pageSize: 200,
          startIndex: 0,
          endIndex: pageSize - 1,
          noOfPages: 0,
          currentPage: 1
        }
      }

      $scope.setEndCustomerToDelete = function (endCustomer) {
        $scope.endCustomersToDelete = [];
        $scope.endCustomerData.map(function(item){
          if(item.selected){
            $scope.endCustomersToDelete.push(item.endcustomer_name);
          }
        })
      }

      $scope.customEndCustomerFilter = function (item) {
        var val = $scope.searchText.tableSearch.toLowerCase();
        return item.endcustomer_name.toLowerCase().indexOf(val || '') !== -1 || item.serial_number.toString().toLowerCase().indexOf(val || '') !== -1
        || item.created_by.toLowerCase().indexOf(val || '') !== -1;
      };

      $scope.customRoleListFilter = function (item) {
        var val = $scope.searchText.rolelistSearch.toLowerCase();
        if((item.DisName.toLowerCase().indexOf(val || '') !== -1) || (item.roleType.toLowerCase().indexOf(val || '') !== -1)){
          return true;
        }
        var found = false;
        var domainArr = [];
        angular.forEach(item.domains, function (domain) {
          var feature = domain.features.trim().toLowerCase();          
          if (domain.name.toLowerCase().indexOf(val || '') !== -1 || feature.contains(val)) {
            found = true;
          }
        });
        return found;
      };

      var featureListFilter = function(role, searchText){
        role.domains.map(function(domain){
          return domain.name.toLowerCase().indexOf(searchText || '') !== -1;
          // var data = domain.features.trim().toLowerCase();
          // if(data.contains(searchText || '')){
          //   tempArr.push(role);
          // };
        });
      }

      $scope.searchEndCustomerData = function () {
        if ($scope.searchText.tableSearch)
          return $filter('filter')($scope.endCustomerList, $scope.customEndCustomerFilter, $scope.searchText.tableSearch);
        return $scope.endCustomerList;
      };

      $scope.searchEndCustomeronFilteredData = function (data) {
        if ($scope.searchText.tableSearch)
          return $filter('filter')(data, $scope.customEndCustomerFilter, $scope.searchText.tableSearch);
        return data;
      };

      $scope.searchRoleListData = function () {
        if ($scope.searchText.rolelistSearch)
            return $filter('filter')($scope.roleList, $scope.customRoleListFilter, $scope.searchText.rolelistSearch);
        return $scope.roleList;
      };

      $scope.clearSearchText = function(prodName){
        $scope.searchText.val = '';
        $scope.getSysIDList(prodName);
      }
      
      $scope.finishLoading = function(){
        $timeout(function(){
          if($("#endCustomerTablePager").parent().parent()){
            $("#endCustomerTablePager").parent().parent().appendTo("#endCustomerListPagerLocation");
          }
        });
      }
      // EO: End Customer controller

      $scope.resetAddNewUserPopup = function(){
        $scope.showEndCustomerList = false;
        $scope.newUser_isExternalUser = false;
        $scope.editUser_isExternalUser = false;
        $scope.newUserEndCustomer.val = "";
      }

      $scope.resetScrollTop = function(selector){
        $timeout(function(){
          $('#'+selector)[0].scrollTop = 0;
        })
      }

      $scope.toggleEndCustomerSelectAll = function (param) {
        // $scope.slectedCount = 0;
        var searchedData;
        if (param == 'all') {
          $scope.selectAllEndCustomers.val = !$scope.selectAllEndCustomers.val;
          $scope.selectAllEndCustomersAll = !$scope.selectAllEndCustomersAll;
          if($scope.filterObj.endCustomerList.length){
            searchedData = $scope.searchEndCustomeronFilteredData($scope.endCustomerData);
          }else{
            searchedData = $scope.searchEndCustomerData();
          }
          $scope.endCustomerData = searchedData;
          for (i = 0; i < $scope.endCustomerData.length; i++) {
            $scope.endCustomerData[i].selected = false;
            $scope.selectedEndCustomerToRemove = false;
            if($scope.selectAllEndCustomersAll){
              $scope.endCustomerData[i].selected = true;
              $scope.selectedEndCustomerToRemove = true;
            }
          }
        } else {
          param.selected = !param.selected;
          for (i = 0; i < $scope.endCustomerData.length; i++) {
            if ($scope.endCustomerData[i].selected) {
              $scope.selectedEndCustomerToRemove = true;
              break;
            } else {
              $scope.selectedEndCustomerToRemove = false;
            }
          }
          $scope.selectAllEndCustomers.val = false;
        }
        
      };

      var setFeaturesToEnableDisable = function(feature){
        var temp = GlobalService.getVal('enableDisableFeatures');
        return temp[feature];
      }

      $scope.updateDataFilter = function(type, actualColumn, columnValue, selected, multiselect, actualData, filterColumn) {
        var filterList = [];
        var getSelectedValues = function(list){
          var tmp = [], tmpKeys;
          if(Array.isArray(list)){
              list.map(function(item){
                  if(item.selected){
                    tmp.push(item.name);
                  }
              });
              return tmp;
          }
          return [];
        }
        //for single select
        if(!multiselect && selected){
          if(Array.isArray(actualData)){
            actualData.map(function(item){
              if(columnValue === item.name){
                  item.selected = true;
              }else{
                  item.selected = false;
              }
            });
          }
        }
        //make 
        if(type === 'userList'){
          resetUserSelectVal();
          $scope.userFilterGroupedData.map(function(item){
            if(getSelectedValues(item.data).length){
                filterList.push({
                    'columnName' : item.columnName,
                    'columnValue' : getSelectedValues(item.data)
                });
                item['appliedFilterCount'] = getSelectedValues(item.data).length;
                item['appliedFilterFirstItem'] = getSelectedValues(item.data)[0];
            }else{
                item['appliedFilterCount'] = 0;
                item['appliedFilterFirstItem'] = "";
            }
          });
          $scope.filterObj.userList = filterList; 
          var filteredData = applyFilter($scope.users, filterList);
          setTableData(type,filteredData);
        } else{
          resetEndCustomerSelectVal();
          $scope.endCustomerFilterGroupedData.map(function(item){
            if(getSelectedValues(item.data).length){
                filterList.push({
                    'columnName' : item.columnName,
                    'columnValue' : getSelectedValues(item.data)
                });
                item['appliedFilterCount'] = getSelectedValues(item.data).length;
                item['appliedFilterFirstItem'] = getSelectedValues(item.data)[0];
            }else{
                item['appliedFilterCount'] = 0;
                item['appliedFilterFirstItem'] = "";
            }
          });
          $scope.filterObj.endCustomerList = filterList; 
          var filteredData = applyFilter($scope.copyOfEndCustomerList, filterList);
          setTableData(type,filteredData);
        }

        // if(!filterList.length){
        //   $scope.clearLocalFilter();
        //   return;
        // }
      };

      var applyFilter = function (list,filterList) {
        return list.filter(function (item) {
          for (var i = 0; i < filterList.length; i++) {
              // var innerFound = false;
              var columnName = filterList[i]['columnName'];
              var columnValueList = filterList[i]['columnValue'];
              var innerFound = setFilterData(item, columnName, columnValueList);
              if(!innerFound){
                return false;
              }
            }
            return true;
        });
      }

      var isInTimerange = function (timeRange, targetDateTime) {
        var ts = new Date().getTime();
        var oneDay = 24 * 60 * 60 * 1000;
        var st,et;
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
          case 'Last 6 Month':
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

      var setFilterData = function(columnData, columnName,columnValueList){
        innerFound = false;
        switch(columnName){
          case 'end_customer':
            for (var j = 0; j < columnValueList.length; j++) {
              if (columnValueList[j] == 'NA' && columnData[columnName] == '' || columnData[columnName] == columnValueList[j]) {
                return innerFound = true;
              }
            }
            break;
          case 'created_on':
          case 'modified_on':
          case 'last_login':
          case 'updated_on':
            if(columnValueList && columnValueList[0]){
              var targetDateTime = columnValueList[0];
              if(isInTimerange(targetDateTime,columnData[columnName])){
                return innerFound = true;
              }
            }
            break;
          case 'status':
            for (var j = 0; j < columnValueList.length; j++) {
              if (columnData.active && columnValueList[j] == 'Active' ||
                !columnData.active && columnValueList[j] == 'Inactive') {
                return innerFound = true;
              }
            }
            break;
          case 'user_type':
            for (var j = 0; j < columnValueList.length; j++) {
              if (columnData.is_external && columnValueList[j] == 'External' ||
                !columnData.is_external && columnValueList[j] == 'Internal') {
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

      var setTableData = function(type,filteredData){
        if(type == 'userList'){
          if(!filteredData.length){
            $scope.tableParams.$params.page = GlobalService.getVal('page');
            $scope.tableParams.reload();
          }
          $scope.tableParams = new ngTableParams({
            count: GlobalService.getVal('count'),
            reload: $scope.tableParams,
            sorting: { first_name: "asc" }
          }, {
            counts: [],
            total: filteredData.length,
            getData: function ($defer, params) {
              if (params.settings().$scope == null) {
                params.settings().$scope = $scope;
              }
              var data = $scope.searchUseronFilteredData(filteredData);
              var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
              $scope.data = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
              params.total(orderedData.length);
              $defer.resolve($scope.data);
              if(orderedData.length === GlobalService.getVal('count')){
                $scope.tableParams.$params.page = GlobalService.getVal('page');
              }
            }
          });
          $timeout(function(){
            $scope.tableParams.reload();
          })
        }else{
          if(!filteredData.length){
            $scope.endCustomerParams.$params.page = GlobalService.getVal('page');
            $scope.endCustomerParams.reload();
          }
          $scope.endCustomerParams = new ngTableParams({
            count: GlobalService.getVal('count'),
            reload: $scope.endCustomerParams,
            sorting: { endcustomer_name: "asc" }
          }, {
            counts: [],
            total: filteredData.length,
            getData: function ($defer, params) {
              if (params.settings().$scope == null) {
                params.settings().$scope = $scope;
              }
              var data = $scope.searchEndCustomeronFilteredData(filteredData);
              var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
              $scope.endCustomerData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
              params.total(orderedData.length);
              $defer.resolve($scope.endCustomerData);
              if(orderedData.length === GlobalService.getVal('count')){
                $scope.endCustomerParams.$params.page = GlobalService.getVal('page');
              }
            }
          });
          $timeout(function(){
            $scope.endCustomerParams.reload();
          })
        }
      }

      var resetEndCustomerSelectVal = function(){
        $scope.selectAllEndCustomersAll = false;
        $scope.selectAllEndCustomers.val = false;
        $scope.selectedEndCustomerToRemove = false;
        if($scope.endCustomerData){
          $scope.endCustomerData.map(function(item){
            item.selected = false;
          });
        }
      } 

      var resetUserSelectVal = function(){
        $scope.selectAllAll = false;
        $scope.selectAll = false;
        $scope.selectedRemove = false;
        if($scope.data.length){
          $scope.data.map(function(item){
            item.selected = false;
          });
        }
      }

      var resetRoleSelectVal = function(){
        $scope.selectAllRoleAll = false;
        $scope.selectAllRole = false;
        $scope.selectedRemoveRole = false;
        if($scope.roleList.length){
          $scope.roleList.map(function(item){
            item.selected = false;
          });
        }
      }
      
      $scope.clearLocalFilter = function (type) {
        var filterObj,groupedData,list;
        if(type === 'userList'){
          filterObj = $scope.filterObj.userList;
          groupedData = $scope.userFilterGroupedData;
          list = $scope.users;
          $scope.filterObj.userList = [];
          resetUserSelectVal()
        }else{
          filterObj = $scope.filterObj.endCustomerList;
          groupedData = $scope.endCustomerFilterGroupedData;
          list = $scope.copyOfEndCustomerList;
          $scope.filterObj.endCustomerList = [];
          resetEndCustomerSelectVal();
        }
        groupedData.map(function(item){
          item['appliedFilterCount'] = 0;
          item['expand'] = false;
          item['searchText'] = '';
          if(Array.isArray(item.data)){
            item.data.map(function(item){
              item.selected = false;
            })
          }else{
            for (var key in item.data) {
                item.data[key]['selected'] = false;
            }
          }
        });
        setTableData(type, list);
      };

      $scope.setProductToDelete = function(role, domain){
        $scope.selectedProductToDelete = '';
        $scope.productMPS = [];
        $("#deleteProductConfModal").modal("show");
        $scope.selectedProductToDelete = role;
        $scope.productMPS = domain;
      }

      $scope.deleteProduct = function(){
        var productList = $scope.associatedRoleProductList[$scope.selectedProductToDelete.name]
        if(productList && productList.indexOf($scope.productMPS.mps.join(":")) > -1 || ($scope.selectedProductToDelete.domains.length == 1)){
          $("#deleteProductConfModal").modal("hide");
          $scope.MsgModelHeader = 'Cannot Delete Product';
          $scope.MsgModelMessage = (productList && productList.indexOf($scope.productMPS.mps.join(":")) > -1) ?
            'Selected Product cannot be deleted as it is already associated to one or more users! Please disassociate the user and try again.' : 
            'You cannot delete this product as this is the only product associated with the role ' + $scope.selectedProductToDelete.DisName + '.';
          $scope.data_loading = false;
          $("#msgModal").modal("show");
          return;
        } 
        AdminService.deleteProduct($scope.selectedProductToDelete.name, $scope.productMPS.mps).then(function (response) {
          $scope.userTracking("Role", "Delete Product", JSON.stringify($scope.selectedProductToDelete));
          $('#deleteProductConfModal').modal("hide");
          $scope.MsgModelHeader = 'Delete Product';
          $scope.MsgModelMessage =  response.data.Msg ? response.data.Msg : 'Product deleted.';
          $("#msgModal").modal("show");
        })
      }

      $scope.resetRoleFeatures = function(){
        var arr = GlobalService.getVal('roleFeatures');
        $scope.roleFeatures = angular.copy(arr);
        $scope.editroleFeatures = angular.copy(arr);
        $scope.addProdroleFeatures = angular.copy(arr);
        $scope.noFeatureWarning = true;
      }

      $scope.resetFilterExpanded = function(type){
        if(type === 'user'){
          $scope.userFilterGroupedData.map(function(item){
            item.expand = false;
          });
        }else{
          $scope.endCustomerFilterGroupedData.map(function(item){
            item.expand = false;
          });
        }
      }
    }
  ])
  .controller('MessageCtrl', ['$scope',
    function ($scope) {

    }
  ])

angular.module('gbAdminApp.filters', [])
    .filter('cut', [
        function () {
            return function (value, wordwise, max, tail) {
                if (!value) return '';
                max = parseInt(max, 10);
                if (!max) return value;
                if (value.length <= max) return value;
                value = value.substr(0, max);
                if (wordwise) {
                    var lastspace = value.lastIndexOf(' ');
                    if (lastspace != -1) {
                        value = value.substr(0, lastspace);
                    }
                }
                return value + (tail || '…');
            };
    }])
    .filter('arrayToString', function() {
        return function(inputArray) {
          var string = inputArray.toString();
          return string;
        };
    });
      
angular.module("gbAdminApp.directives", [])

.directive('multiCheckboxContainer', function(){
    return { 
        controller: function () {
          var ctrl = this;
          var checkboxes = [];
          var checkboxModels = [];
          var previousClickedCheckbox = null;
          
          ctrl.addCheckbox = addCheckbox;
          ctrl.onCheckboxClick = onCheckboxClick;
          
          function addCheckbox(checkbox, checkboxModelCtrl) {
            checkboxes.push(checkbox);
            checkboxModels.push(checkboxModelCtrl);
          }
          
          function onCheckboxClick(checkbox, shiftKey) {
            var start, end, i, checking;
            if (shiftKey && previousClickedCheckbox) {
              checking = checkbox.prop('checked')
              start = checkboxes.indexOf(previousClickedCheckbox);
              end = checkboxes.indexOf(checkbox);
              if (start > end) {
                start = start + end;
                end = start - end;
                start = start - end;
              }
              for (i = start; i <= end; i++) {
                checkboxes[i].prop('checked', checking);
                checkboxModels[i].$setViewValue(checking);
              }
            }
            previousClickedCheckbox = checkbox;
          }
        }
    }
  })
.directive('multiCheckbox', function () {
    return {
        restrict: 'A',
        require: ['^^multiCheckboxContainer', 'ngModel'],
        link: function (scope, element, attrs, controllers) {
        var containerCtrl = controllers[0];
        var ngModelCtrl = controllers[1];
        containerCtrl.addCheckbox(element, ngModelCtrl);
        
        element.on('click', function (ev) {
            containerCtrl.onCheckboxClick(element, ev.shiftKey);
        });
        }
    };
})
.directive('ngEnter', function () {
  return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
          if (event.which === 13) {
              scope.$apply(function () {
                  scope.$eval(attrs.ngEnter);
              });
              event.preventDefault();
          }
      });
  };
})