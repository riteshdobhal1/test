angular.module('gbApp.services.dashboards', []).factory('Dashboards', ['$http', 'GlobalService', 'metaDataService',
    function ($http, GlobalService, metaDataService) {
        var dashboards = [];
        return {
            setDashboard: function(list, book){
                dashboards = list;
                if(book && book.length){
                    dashboards = dashboards.concat(book);
                }
            },
            updateDashboards: function(list){
                dashboards = list;
            },
            getDashboards : function(){
                return dashboards;
            },
            getRoles: function () {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.get(umsDomain + '/admin/role/names/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
                    cache: false
                });
            },
            setSummaryDash: function (d_id, r_id) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/dashboards/set/summary/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + d_id + '/' + r_id;
                return $http.post(url);
            },
            getRolesHealthChk: function () {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.get(umsDomain + '/admin/role/healthcheck/names/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
                    cache: false
                });
            },
            allDetails: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var user = metaDataService.getUser().email.toLowerCase();
                return $http.get(infoserverDomain + '/dashboards/all/details/merged/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/NA/' + user + '/NA?tableau=false', {
                    cache: false
                });
            },
            showUsers: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/dashboards/users/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
                    cache: false
                });
            },
            getTableauAdmin: function () {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.get(umsDomain + '/user/tableauadmin/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
                    cache: false
                });
            },
            getLogiAdmin: function () {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.get(umsDomain + '/user/dashboardadmin/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
                    cache: false
                });
            },
            getSchedulingData: function (d_id,r_id) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/dashboards/details/scheduling/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + d_id + '/' + r_id, {
                    cache: false
                });
            },
            updateSceduling: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/dashboards/add/scheduling/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + param.d_id + '/' + param.r_id;
                return $http.post(url, param);
            },
            changeVisibility: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/dashboards/update/visbility/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
                return $http.post(url, param);
            },
            updateOwner: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/dashboards/update/owner/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
                return $http.post(url, param);
            },
            getEndCustomers: function (user) {
                var umsDomain = GlobalService.getVal('umsDomain');
                if(user){
                    return $http.get(umsDomain + '/healthcheck/ec/details/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '?fnCallSrcOpt=ADMIN_CONSOLE', {
                        cache: true
                    });
                }else{
                    return $http.get(umsDomain + '/healthcheck/ec/details/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '?fnCallSrcOpt=ADMIN_CONSOLE', {
                        cache: true
                    });
                }
            },
            addRolesToDashboards: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/dashboards/add/role/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');                
                return $http.post(url, param);
            },
            addTagsToDashboards: function (param) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/dashboards/add/tag/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');                
                return $http.post(url, param);
            },
            removeRole : function(dId, role) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.post(infoserverDomain + '/dashboards/remove/role/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' +dId + '/' +role);
            },
            removeTag : function(dId, tag) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.post(infoserverDomain + '/dashboards/remove/tag/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' +dId + '/' +tag);
            },
	
            getSecurityToken: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/dashboards/trusted/ticket/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
                    cache: false
                });
            },

            //Get predefined tag list
            getPredefinedTagList: function () {
                //var url = 'stat/tagList.json';
                var user = metaDataService.getUser().email.toLowerCase();
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/rules/tags/rules/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + user;
                return $http.get(url);

            },

            //subscribe tag
            subscribeUnsubscribeTag: function(payload, type){
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                var url = infoserverDomain + '/tags/subscription/bulk_tags_subscription/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + type;
                return $http.post(url,payload);
            },

            //fetch notification list
            getNotificationList: function (st, et, ft) {
                //var url = 'stat/tagList.json';
                var user = metaDataService.getUser().email.toLowerCase();
                var umsDomain = GlobalService.getVal('umsDomain');
                var delete_filter = "&deleted=false";
                if(ft == null){
                    var url = umsDomain + '/notification/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + user  + "/" + st + "/"  + et + "?" + delete_filter;
                }else{
                    var url = umsDomain + '/notification/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + user  + "/" + st + "/"  + et + "?read=" + ft + delete_filter;
                }
                
                return $http.get(url);

            },

            
            //markReadNotification 
            markReadNotification: function(payload,type){
                var user = metaDataService.getUser().email.toLowerCase();
                var umsDomain = GlobalService.getVal('umsDomain');
                var url = umsDomain + '/notification/bulk_update/read/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + user +'/' + type;
                return $http.post(url,payload);
            },

             //Delete Notification 
             deleteNotification: function(payload,type){
                var user = metaDataService.getUser().email.toLowerCase();
                var umsDomain = GlobalService.getVal('umsDomain');
                var url = umsDomain + '/notification/bulk_update/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema')+ '/' + user +'/' + type;
                return $http.post(url,payload);
            },

            getMenuList: function(){
                var user = metaDataService.getUser().email.toLowerCase();
                var umsDomain = GlobalService.getVal('umsDomain');
                var url = umsDomain + '/cs/mps/menu/tree/' +  GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "?user=" + user;
                return $http.get(url);
            }
        };
    }]);
