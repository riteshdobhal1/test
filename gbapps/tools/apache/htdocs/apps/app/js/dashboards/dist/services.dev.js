"use strict";

angular.module('gbApp.services.dashboards', []).factory('Dashboards', ['$http', 'GlobalService', 'metaDataService', function ($http, GlobalService, metaDataService) {
  var dashboards = [];
  return {
    setDashboard: function setDashboard(list, book) {
      dashboards = list;

      if (book && book.length) {
        dashboards = dashboards.concat(book);
      }
    },
    updateDashboards: function updateDashboards(list) {
      dashboards = list;
    },
    getDashboards: function getDashboards() {
      return dashboards;
    },
    getRoles: function getRoles() {
      var umsDomain = GlobalService.getVal('umsDomain');
      return $http.get(umsDomain + '/admin/role/names/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
        cache: false
      });
    },
    setSummaryDash: function setSummaryDash(d_id, r_id) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var url = infoserverDomain + '/dashboards/set/summary/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + d_id + '/' + r_id;
      return $http.post(url);
    },
    getRolesHealthChk: function getRolesHealthChk() {
      var umsDomain = GlobalService.getVal('umsDomain');
      return $http.get(umsDomain + '/admin/role/healthcheck/names/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
        cache: false
      });
    },
    allDetails: function allDetails() {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var user = metaDataService.getUser().email.toLowerCase();
      return $http.get(infoserverDomain + '/dashboards/all/details/merged/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/NA/' + user + '/NA?tableau=false', {
        cache: false
      });
    },
    showUsers: function showUsers() {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      return $http.get(infoserverDomain + '/dashboards/users/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
        cache: false
      });
    },
    getTableauAdmin: function getTableauAdmin() {
      var umsDomain = GlobalService.getVal('umsDomain');
      return $http.get(umsDomain + '/user/tableauadmin/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
        cache: false
      });
    },
    getLogiAdmin: function getLogiAdmin() {
      var umsDomain = GlobalService.getVal('umsDomain');
      return $http.get(umsDomain + '/user/dashboardadmin/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
        cache: false
      });
    },
    getSchedulingData: function getSchedulingData(d_id, r_id) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      return $http.get(infoserverDomain + '/dashboards/details/scheduling/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + d_id + '/' + r_id, {
        cache: false
      });
    },
    updateSceduling: function updateSceduling(param) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var url = infoserverDomain + '/dashboards/add/scheduling/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + param.d_id + '/' + param.r_id;
      return $http.post(url, param);
    },
    changeVisibility: function changeVisibility(param) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var url = infoserverDomain + '/dashboards/update/visbility/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
      return $http.post(url, param);
    },
    updateOwner: function updateOwner(param) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var url = infoserverDomain + '/dashboards/update/owner/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
      return $http.post(url, param);
    },
    getEndCustomers: function getEndCustomers(user) {
      var umsDomain = GlobalService.getVal('umsDomain');

      if (user) {
        return $http.get(umsDomain + '/healthcheck/ec/details/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '?fnCallSrcOpt=ADMIN_CONSOLE', {
          cache: true
        });
      } else {
        return $http.get(umsDomain + '/healthcheck/ec/details/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '?fnCallSrcOpt=ADMIN_CONSOLE', {
          cache: true
        });
      }
    },
    addRolesToDashboards: function addRolesToDashboards(param) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var url = infoserverDomain + '/dashboards/add/role/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
      return $http.post(url, param);
    },
    addTagsToDashboards: function addTagsToDashboards(param) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var url = infoserverDomain + '/dashboards/add/tag/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');
      return $http.post(url, param);
    },
    removeRole: function removeRole(dId, role) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      return $http.post(infoserverDomain + '/dashboards/remove/role/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + dId + '/' + role);
    },
    removeTag: function removeTag(dId, tag) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      return $http.post(infoserverDomain + '/dashboards/remove/tag/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + dId + '/' + tag);
    },
    getSecurityToken: function getSecurityToken() {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      return $http.get(infoserverDomain + '/dashboards/trusted/ticket/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
        cache: false
      });
    },
    //Get predefined tag list
    getPredefinedTagList: function getPredefinedTagList() {
      //var url = 'stat/tagList.json';
      var user = metaDataService.getUser().email.toLowerCase();
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var url = infoserverDomain + '/rules/tags/rules/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + user;
      return $http.get(url);
    },
    //subscribe tag
    subscribeUnsubscribeTag: function subscribeUnsubscribeTag(payload, type) {
      var infoserverDomain = GlobalService.getVal('infoserverDomain');
      var url = infoserverDomain + '/tags/subscription/bulk_tags_subscription/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + type;
      return $http.post(url, payload);
    },
    //fetch notification list
    getNotificationList: function getNotificationList(st, et, ft) {
      //var url = 'stat/tagList.json';
      var user = metaDataService.getUser().email.toLowerCase();
      var umsDomain = GlobalService.getVal('umsDomain');
      var delete_filter = "&deleted=false";

      if (ft == null) {
        var url = umsDomain + '/notification/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + user + "/" + st + "/" + et + "?" + delete_filter;
      } else {
        var url = umsDomain + '/notification/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + user + "/" + st + "/" + et + "?read=" + ft + delete_filter;
      }

      return $http.get(url);
    },
    //markReadNotification 
    markReadNotification: function markReadNotification(payload, type) {
      var user = metaDataService.getUser().email.toLowerCase();
      var umsDomain = GlobalService.getVal('umsDomain');
      var url = umsDomain + '/notification/bulk_update/read/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + user + '/' + type;
      return $http.post(url, payload);
    },
    //Delete Notification 
    deleteNotification: function deleteNotification(payload, type) {
      var user = metaDataService.getUser().email.toLowerCase();
      var umsDomain = GlobalService.getVal('umsDomain');
      var url = umsDomain + '/notification/bulk_update/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + user + '/' + type;
      return $http.post(url, payload);
    },
    getMenuList: function getMenuList() {
      var user = metaDataService.getUser().email.toLowerCase();
      var url = umsDomain + 'cs/menu/tree/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + "?user=" + user;
      return $http.get(url);
    }
  };
}]);