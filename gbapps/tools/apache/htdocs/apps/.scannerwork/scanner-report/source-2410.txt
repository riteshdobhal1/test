angular.module('gbLogStatusApp.services', [])
.factory('LogStatusService', ['$http','$cookieStore', '$cookies', 'MessageService', 'GlobalService','$window',
function($http, $cookieStore, $cookies, MessageService, GlobalService,$window) {

	var infoserverDomain = getCookie('infoserverDomain');	if(infoserverDomain){
		var tArray = infoserverDomain.split('/');
		var version = tArray.pop();
		var slaves = {};
		slaves[tArray.join("/")]= "/"+version+"/xproxy";
		xdomain.slaves(slaves);
	};

	var umsDomain = getCookie('umsDomain');   if(umsDomain){
                var tArray = umsDomain.split('/');
                var version = tArray.pop();
                var slaves = {};
                slaves[tArray.join("/")]= "/"+version+"/xproxy";
                xdomain.slaves(slaves);
        };

	var infoserverInternalDomain = GlobalService.getVal('infoserverInternalDomain');
	var pagesId = [];//'gbAdminForm', 'gbSelectDomainForm', 'sendEmail', 'gbFirstTimeForm', 'gbForgotForm'];

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
		standard_user_tracking: function (application, module, activity, details, solrQuery) {
			var usertrackingDetailsLimit = GlobalService.getVal('usertracking_details_limit');
			var url;
			var result = {};
			var params = {};
			var mps = $cookies.mps.split("/");
			if($cookies.prevApplication && $cookies.prevApplication != application) {
				params['switched_feature'] = $cookies.prevApplication;
			}
			url = umsDomain + '/user_tracking/' + mps[0] + '/' + mps[1] + '/' + mps[2] + '/' + application + '/' + module + '/' + activity;
			$cookies.prevApplication = application;
			return $http.post(url, {
				"details": details,
				"solr_query": !!solrQuery ? solrQuery : ""
			}, {params: params});
		},
			getLogList : function(st,et) {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split("/");
					return $http.get(infoserverDomain + '/bundles/uploaded/status/' + mps[0]+'/'+mps[1]+'/'+mps[2]+'/'+st+'/'+et, {cache:false});
					//return $http.get(infoserverDomain + '/bundles/uploaded/status/vce/vce/pod/2017-05-10T10:00:00Z/2017-08-10T12:00:00Z', {cache:false});
				}
	    },
      logoutInfoserver: function () {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split("/");
	        			return $http.get(umsDomain + '/aa/logout_admin?mps='+ mps[0] + ':' + mps[1] + ':' + mps[2]);
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
					var mps = getCookie('mps').split("/");
					url = umsDomain + '/user_tracking/' + mps[0] + '/' + mps[1] + '/' + mps[2] + '/' + application + '/' + module + '/' + activity;
					return $http.post(url, {
					"details": details,
					"solr_query": ""
					}, {params: params});
				}
				},
      getLoginFields : function() {
				if(getCookie('mps') == undefined){
					$window.location.href = localStorage.getItem("logOutUrl");
				}else {
					var mps = getCookie('mps').split("/");
					return $http.get(umsDomain + '/admin/role/user/details/'+mps[0]+'/'+mps[1]+'/'+mps[2],{ });

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
