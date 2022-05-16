angular.module('internalAdminApp.services', [])
.factory('internalAdminService', ['$http','$cookieStore', '$cookies', 'MessageService', 'GlobalService','$window',
function($http, $cookieStore, $cookies, MessageService, GlobalService,$window) {
		var umsDomain = getCookie('umsDomain');	if(umsDomain){
		var tArray = umsDomain.split('/');
		var version = tArray.pop();
		var slaves = {};
		slaves[tArray.join("/")]= "/"+version+"/xproxy";
		xdomain.slaves(slaves);
	};
	var infoserverInternalDomain = GlobalService.getVal('infoserverInternalDomain');
	var pagesId = [];
	return {
    windowFailed : function(msg, title) {
	    	MessageService.setError(msg, title);
	    },
	    windowSuccess : function(msg, title) {
	    	MessageService.setSuccess(msg, title);
	    },
	    windowWarning : function(msg, title) {
	    	MessageService.setWarning(msg, title);
	    },
	    getRealmDetails : function() {
			return $http.get(umsDomain + '/admin/realm/list',{ });
	    },
	    getManDetails : function() {
			return $http.get(umsDomain + '/admin/mfr/listall',{ });
	    },	    
	    getMpsDetails : function(mfr) {
			return $http.get(umsDomain + '/admin/mfr/realm/list/'+mfr,{ });
	    },
	    getDefFearture : function(mfr) {
			return $http.get(umsDomain + '/admin/mfr/defaultfeature/list/'+mfr,{ });
	    },
	    getUiFearture : function(mfr) {
			return $http.get(umsDomain + '/admin/mfr/uiconfig/list/'+mfr,{ });
	    },
	    addRealm : function(params) {
	    	return $http.post(umsDomain + "/admin/realm/add", params);
	    },
	    editRealm : function(params) {
	    	return $http.post(umsDomain + "/admin/realm/edit", params);
	    },
	    deleteRealm : function(realm) {
	    	return $http.post(umsDomain + "/admin/realm/delete/"+realm);
	    },
	    deleteMan : function(man) {
	    	return $http.post(umsDomain + "/admin/mfr/delete/"+man);
	    },
	    addManStep1 : function(params) {
	    	return $http.post(umsDomain + "/admin/mfr/addmfr/"+params.mfr, params);
	    },
	    addMpsStep2 : function(params) {
	    	return $http.post(umsDomain + "/admin/mfr/realm/add/"+params.mfr, params);
	    },
	    addDefaultFeatStep3 : function(params) {
	    	return $http.post(umsDomain + "/admin/mfr/defaultfeature/add/"+params.mfr, params);
	    },
	    addUiFeatStep4 : function(params) {
	    	return $http.post(umsDomain + "/admin/mfr/uiconfig/add/"+params.mfr, params);
	    },
	    getRoleList : function(params) {
				return $http.get(umsDomain + '/admin/usermanagement/role/list/' + params.mfr, {});
	    },
	    getUserList : function(params) {
				return $http.get(umsDomain + '/customer/user/listnonsso/' + params, {
					});
	    },
	    addNewRole: function (params) {
			return $http.post(umsDomain + "/admin/usermanagement/role/add/"+params.mfr, params);
		},
		addNewUser: function (params) {
			return $http.post(umsDomain + "/admin/customer/user/add/" + params.mfr , params);
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
				var mps = getCookie('mps').split(":");
				return $http.get(umsDomain + '/admin/role/user/details/'+mps[0]+'/'+mps[1]+'/'+mps[2],{ });
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
