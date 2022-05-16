angular.module('gbCampaignApp.services', [])
.factory('CommonService', ['$http', '$cookieStore', '$cookies', 'GlobalService',
function($http, $cookieStore, $cookies, GlobalService) {

	var umsDomain = GlobalService.getValue('UMSDOMAIN');

	
	return {
	    getQueryVariable : function(variable)
		{
	       var query = window.location.search.substring(1);
	       var vars = query.split("&");
	       for (var i=0;i<vars.length;i++) {
	               var pair = vars[i].split("=");
	               if(pair[0] == variable){return pair[1];}
	       }
	       return(false);
		}
	}
}])