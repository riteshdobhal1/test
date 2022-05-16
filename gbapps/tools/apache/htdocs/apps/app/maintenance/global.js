angular.module('gbMaintenanceApp.globalservices', [])
.factory('GlobalService', ['$http','Globalservice',
	function($http, Globalservice) {
		var supportEmail = Globalservice.getVal('supportEmail');
		var info = {};
		var msg = {};
		msg.PAGE_TITLE = "Glassbeam | Maintenance";
		msg.EMAIL_ID = "mailto:" + supportEmail;
		msg.COMPANY = "Glassbeam";
		msg.MESSAGE = "Sorry for the inconvenience, but we are in the middle of a maintenance activity on your Glassbeam application. We will be back online by";
		msg.downtime = "4:00 PM(PST) Today";
		return {
			getInfoserverDomain : function() {
				return info.infoserverDomain;
			},
			setInfoserverDomain : function(domainName) {
				info.infoserverDomain = domainName;
			},
			getVal : function(key) {
				return msg[key];
			}
		}
	}
])
