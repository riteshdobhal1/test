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
