angular.module('gbCampaignApp.services', [])
.factory('SigninService', ['$http', '$cookieStore', '$cookies', 'GlobalService',
function($http, $cookieStore, $cookies, GlobalService) {
	return {
		readFields : function() {
			return $http.get('/campaign/fields.json');
		},
	    register : function(param) {
            return $http.post(GlobalService.getValue('UMSDOMAIN') + '/campaign/user/add', param);
	    },
	    mailVerification : function(email) {
            return $http.get(GlobalService.getValue('UMSDOMAIN') + '/campaign/user/regenerate/verification'+ '/' + email);
	    }	
	}
}])
.factory('UtilityService', [ '$window',
	function($window) {
        return{
            validateEmail : function(email) {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
	         //Get values from url
	        getQueryVariable : function(variable) {
	          var query = $window.location.search.substring(1);
	          var vars = query.split("&");
	          for (var i=0;i<vars.length;i++) {
	            var pair = vars[i].split("=");
	            if (decodeURIComponent(pair[0]) == decodeURIComponent(variable)) {
	              return decodeURIComponent(pair[1]);
	            } 
	          }      
	        }
        }
	}
])
.factory('GlobalMessages', [
	function(){
		var msg = {};
		msg.INVALIDEMAIL = "Please enter valid email.";
		msg.MINLENPASSWORD = "Password should be minimum four character long.";
		msg.MAILSEND_SUCCESS_MSG = "We’ve sent you an email that will allow you to verify your account.";
		msg.PASSWORDMISSMATCH = "Password not matching!";
		msg.PAGE_TITLE = "Glassbeam : Campaign";
		return{
			getValue :  function(key) {
				return msg[key];
			}
		}
	}
])
