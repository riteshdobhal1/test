angular.module('gbLoginApp.globalservices', [])
.factory('GlobalService', ['$http', '$location',
	function($http, $location) {
		var info = {};
		info.umsDomain = getCookie('umsDomain');
		
		info.httpProtocol = "https";
		var globalObj = {};
		globalObj.debug = 1;
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
		globalObj.errorMsgs = {
            '101' : 'Infoserver is down',
            '102' : 'H2 is down',
            '103' : 'LCP is down',
            '104' : 'Tableau server is down',
            '105' : 'Logi server is down',
            '106' : 'GBStudio server is down'
		};
		globalObj.minPassLen = 6;
		
		//captcha
		globalObj.QaTestingCaptcha = false;
		globalObj.QaCaptchaKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
		globalObj.DevCaptchaKey = '6LdkUZgUAAAAAEkHQAmoTX0nDq5v4BVKJHVt6fjq';
		globalObj.CaptchaFeature = true;
		globalObj.MaxLoginAttemptForCaptcha = 2;

		//two factor auth

		globalObj.resendOtpTime = 30;
		globalObj.resendAttemptLimit = 5;


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
