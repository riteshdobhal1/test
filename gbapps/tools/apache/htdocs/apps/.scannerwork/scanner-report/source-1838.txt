'use strict';

/* Globals */

angular.module('gbApp.globalsMsg', []);

angular.module('gbApp.globalsMsg').service('GlobalServiceError', ['$location', '$rootScope','$interval','GlobalService',
function($location, $rootScope, $interval, GlobalService) {
    var globalObj = {};
    var me = this;
   globalObj.primaryDomain = GlobalService.getVal('primaryDomain');
    this.setGlobals = function(adminEmail) {
        //Error page
        globalObj.errorPageTitle = "Glassbeam | Error";
        globalObj.errorPageMsgHeader = "Glassbeam Authentication Error";
        globalObj.mailToGlassbeamSupport = "mailto:" + adminEmail + "?subject=";
        globalObj.errorContactMsg = "Please contact your system administrator or ";
        globalObj.errorGlassbeamSupport = "Glassbeam Support";
        globalObj.errorPageUnauthorized = "### is not authorized to use Glassbeam application";
        globalObj.errorPageNoDataFound = "No data available for ###";
        globalObj.errorPageStatusNoData = "User unable to login, no data available";
        globalObj.glassbeamHomeUrl = "http://www." +  globalObj.primaryDomain;

        globalObj.defaultDashboard = 'summary';
        globalObj.dashboardAuthentication = "Dashboard authentication failed. Please contact <a href='mailto:" + adminEmail + "'>" + adminEmail + "</a>";
        globalObj.errorDashboardAuthentication = "Dashboard authentication failed";
    };

    this.getVal = function(keyword) {
        var keyword = arguments[0];
        var msg = globalObj[keyword];
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                msg = msg.replace(/###/, arguments[i]);
            }
            return msg;
        } else {
            return msg;
        }
    };

    this.setVal = function(keyword, val) {
        globalObj[keyword] = val;
    };

    this.logError = function(errorMsg){
        if(globalObj.debug)
        {
            console.error(errorMsg);
        }
    };


}]);
