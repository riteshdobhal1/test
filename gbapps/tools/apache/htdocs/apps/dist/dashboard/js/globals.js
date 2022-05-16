
angular.module('gbApp.globals', []);

angular.module('gbApp.globals').service('GlobalService', ['$location', '$rootScope', '$interval','GlobalService',
function ($location, $rootScope, $interval, GlobalService) {
    var globalObj = {};
    globalObj.logiReportsDomain = GlobalService.getVal('logiReportsDomain')
    globalObj.infoserverTimeout = 120000;
    globalObj.dashboardSecurity = false;
    globalObj.mainTitle = "Glassbeam - Product Intelligence on Demand";
    globalObj.redirect_login_url = $location.protocol() + "://" + $location.host() + '/login/index.html';
    globalObj.passwd_maxlimit = 30;
    globalObj.dashboards = 'index.html';
    globalObj.usertracking_details_limit = 5;
    globalObj.features = {};
    this.setGlobals = function (adminEmail) {
    }
    this.getVal = function (keyword) {
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

    this.setVal = function (keyword, val) {
        globalObj[keyword] = val;
    };
    this.setSessionCookies = function (token) {
        //get domain name from url
        var domain = GlobalService.getVal('primaryDomain');
        //Retrive infoserver domain
        //if(info.infoserverDomain) {
        /*var infoD = info.infoserverDomain.split(":");
         var infoserverName = infoD[1];*/
        document.cookie = token + ";domain=" + domain + ";path=/";
        //}
    };
}]);
window.reportBaseUrl = 'https://' + globalObj.logiReportsDomain + '/**';
