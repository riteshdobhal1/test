angular.module('gbLoginApp.services', [])
.factory('LoginService', ['$http', 'GlobalService',  'UserService', 'MessageService', '$cookieStore', '$cookies',
function($http, GlobalService, UserService, MessageService, $cookieStore, $cookies) {

	var umsDomain = GlobalService.getVal('umsDomain');
	var infoserverInternalDomain = GlobalService.getVal('infoserverInternalDomain');
	var user = UserService.getUser();	
	var pagesId = [];//'gbLoginForm', 'gbSelectDomainForm', 'sendEmail', 'gbFirstTimeForm', 'gbForgotForm'];	
	
	return {
		redirectPageToUI : function(url) {
			/*
			** check use.selectedDomain and redirect page 
			** accordingly
			*/
			var milliseconds = (new Date).getTime();
				window.open((GlobalService.gethttpProtocol() + "://"+ url + "?" + milliseconds), "_self");

		},
	    /*
	    ** API: Authenticate user and get domain asscociated with user
	    ** 
	    */
	    login : function(param) {	
	    	UserService.setUser(param);
	    	if(!umsDomain) {
	    		umsDomain = GlobalService.getVal('umsDomain');
	    	}
			return $http.post(umsDomain + '/aa/uilogin', {
                'username' : user.name,
                'email' : user.email,
				'password' : user.password,
				'captcha' : param.captcha,
				'mobile' : param.mobile
            });
	    },
	    firstTimeChangePassword : function(param)  {	
	    	UserService.setUser(param);
	    	if(!umsDomain) {
	    		umsDomain = GlobalService.getVal('umsDomain');
	    	}
            return $http.post(umsDomain +'/user/create/passwd', {                
                'email' : user.email,
                'password' : user.password
            });
	    },
	    sendEmail :  function(param) {
	    	UserService.setUser(param);
	    	if(!umsDomain) {
	    		umsDomain = GlobalService.getVal('umsDomain');
	    	}
            return $http.post(umsDomain +'/user/forgot/passwd/'+param.email);
	    },
	    changePassword : function(param, token) {
	    	UserService.setUser(param);	    	
	    	if(!umsDomain) {
	    		umsDomain = GlobalService.getVal('umsDomain');
	    	}
            return $http.post(umsDomain + '/user/create/passwd', {  
            	'email' : param.email,
                'token_id' : token,
                'passwd' : param.password
            });
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
	    getLogos :  function() {
	    	if(!infoserverInternalDomain) {
	    		infoserverInternalDomain = GlobalService.getVal('infoserverInternalDomain');
	    	}
	    	var domainMps = GlobalService.getVal("domainMps");
            return $http.get(infoserverInternalDomain +'/logo/'+domainMps);
		},
		verifyOTP : function(param){
			//used for resend otp
			if(!umsDomain) {
	    		umsDomain = GlobalService.getVal('umsDomain');
	    	}
			return $http.post(umsDomain + '/aa/verifyOTP', param);
		},
		resendOTP : function(param){
			//used for resend otp
			if(!umsDomain) {
	    		umsDomain = GlobalService.getVal('umsDomain');
	    	}
			return $http.post(umsDomain + '/aa/resendOTP', param);
		}
		
	}
}])
.factory('UserService', ['$http',
	function($http) {
		var user = {}   ;
		user.email = '';
		user.password = '';
		user.firstname = '';
		user.lastname = '';
		user.name = '';
		user.domains = [];
		user.selecteddomain = '';
		user.sessionToken = null;

		return{
			setToken : function(token) {
				user.sessionToken = token;
			},
			getToken : function() {
				return user.sessionToken;
			},
			getUser :  function() {
				return user;
			},
			setUser : function(newUser) {
				
				if(newUser.email){
					user.email = newUser.email;
				}
				if(newUser.name){
					user.name = newUser.name;
				}
				if(newUser.password){
					user.password = newUser.password;
				}
				if(newUser.domains){
					user.domains = newUser.domains;
				}
				if(newUser.firstname){
					user.firstname = newUser.firstname;
				}
				if(newUser.lastname){
					user.lastname = newUser.lastname;
				}
			},
			getName : function() {
				return user.name;
			},
			setName : function(firstname, lastname) {
				user.firstname = firstname;
				user.lastname = lastname;
				user.name = firstname + ' ' + lastname;
			},
			getEmail :  function() {
				return user.email;
			},
			setEmail : function(email) {
				user.email = email;
			},

			getDomains:  function() {
				return user.domains;
			},
			setDomains : function(domainList) {
				user.domains = domainList;
			},

			getSelectedDomain:  function() {
				return user.selecteddomain;
			},
			setSelectedDomain : function(domain) {
				user.selecteddomain = domain;
			}
		}
	}
])
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
.factory('UtilityService', [ 
	function() {
        return{
            validateEmail : function(email) {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
        }
	}
])
.factory('GlobalMessages', [
	function(){
		var msg = {};
		msg.INVALIDEMAIL = "Please enter valid value for email id.";
		msg.EMPTYEMAIL = "Please enter value for email.";
		msg.EMPTYPASSWORD = "Please enter value for password.";
		msg.MINLENPASSWORD = "Password should be minimum six characters long.";
		msg.MAILSEND_SUCCESS_TITLE = "We’ve sent you a link to change your password";
		msg.MAILSEND_SUCCESS_MSG = "We’ve sent you an email that will allow you to reset your password.";
		msg.MAILSEND_FAILURE_MSG = "We couldn't find a Glassbeam account associated with ";
		msg.PASSWORDMISSMATCH = "Password not matching!";
		msg.PAGE_TITLE = "Glassbeam : ";
		msg.ONE_TIME_MSG = "Please set your password(one-time setup) before you start using the Glassbeam.";
		msg.INVALIDPASS = "Invalid Password! Follow the password nstructions"
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
