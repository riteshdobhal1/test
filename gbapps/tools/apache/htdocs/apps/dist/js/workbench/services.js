
angular.module('gbApp.services.workbench', ['xml', 'ngCookies']).factory('WorkbenchService', ['$http', 'x2js', '$q', '$cookies', '$cookieStore', 'UtilService', 'ErrorService', 'GlobalService', 'metaDataService',  'ModalService', '$filter', '$document',  
function($http, x2js, $q, $cookies, $cookieStore, UtilService, ErrorService, GlobalService, metaDataService, ModalService, $filter, $document) {
	var tableauDomain, siteId, userId, workbooks = {
		'books' : [],
		'loading' : true
	}, trustedKey, sessionTimedOut, schedulesList, subscriptionsList, userList;

	return {
		init : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var params = {};
            if(this.isPowerUser()) {
                params['power'] = true;
                params['full_name'] = metaDataService.getUserName();
            }
		    return $http.get(infoserverDomain + '/tableau/siteuser/info/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getTableauUser(), {params: params});
        },
        resetError: function(){
            workbooks["error"] = false;
        },
        getRealmInfo: function(){
            var umsDomain = getCookie('umsDomain');
		    return $http.get(umsDomain + '/realm/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
        },
		getUsers : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/users/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId());
		},
		getSchedules: function() {
		    var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/schedules/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
		},
		getSubscriptions : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/subscriptions/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId());
        },
        getWorkbenchApiRoot : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return infoserverDomain + '/tableau/view/preview/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId();
            
        },
		removeDatasource : function(data) {
		    var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.post(infoserverDomain + '/tableau/datasource/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getUserId() + '/' + this.getTableauUser() + '/' + data);
        },
        createSubscription : function(data) {
		    var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.post(infoserverDomain + '/tableau/subscription/create/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId(), data);
		},
		updateSubscription : function(subscriptionId, data) {
		    var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.post(infoserverDomain + '/tableau/subscription/update/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + subscriptionId, data);
		},
		deleteSubscription: function(subscriptionId) {
		    var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/subscription/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + subscriptionId);
        },
        getTrustedAuthKey : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/trusted/ticket/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getTableauUser());
        },
        checkIfTableauIsConfigured : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/configured/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
        },
		getDataSources : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/datasources/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId());
        },
        getDatasourceConnection : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/connections/list/datasource/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' +param);
        },
        updateEmbedAuth : function(datasourceid, connectionid) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/connections/update/datasource/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + datasourceid + '/' + connectionid);
		},
		getAllWorkbenchLocal : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/datasources/all/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
		},
		addTagsToDatasources : function(param) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
	        var url = infoserverDomain + '/tableau/datasource/tag/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema');                
	        return $http.post(url, param);
		},
		removeTagsFromDatasources : function(dsId, tag) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
	        return $http.get(infoserverDomain + '/tableau/datasource/tag/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') +'/'+dsId+'/'+tag);
		},
		getWorkbooks : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/workbooks/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId());
        },
        getConnectionid : function(workbookId) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/connections/list/workbook/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + workbookId);
        },
        getViews : function(workbookId) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/workbook/views/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + workbookId);
        },
        updateWorkbook : function(data) {
            var params = {};
            if(data.hasOwnProperty('newOwnerId')) {
                params['new_owner_id'] = data['newOwnerId'];
            }
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.put(infoserverDomain + '/tableau/workbook/update/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + data.bookId + '/' + (data.showTabs ? true : false), {}, {params: params});
        },
        deleteWorkbook : function(book) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/workbook/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + book.id);
        },
        addTagsToWorkbook : function(bookId, tagsList) {
            var params = {
                tag: tagsList
            };
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.put(infoserverDomain + '/tableau/workbooks/tags/add/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + bookId, {}, {params: params});
        },
        deleteTagFromWorkbook : function(bookId, tag) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/workbook/tag/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getTableauUser() + '/' + this.getUserId() + '/' + bookId + '/' + tag);
        },
        getAllTablueUsers : function() {
            var workbenchService = this;
            workbenchService.getUsers().then(function(response) {
                var jsonResponse = x2js.xml_str2json(response.data);
                if(jsonResponse['tsResponse'].hasOwnProperty('error')) {
                    workbooks['loading'] = false;
                    workbooks['error'] = true;
                    workbooks['userUnauthorized'] = true;
                } else {
                    if (jsonResponse['tsResponse']['users'] === "") {
                        userList = [];
                        workbooks['loading'] = false;
                    } else {
                        var wbs = jsonResponse['tsResponse']['users']['user'];
                        if (Array.isArray(wbs)) {
                            userList = wbs
                        } 
                    }
                }
            }, function(response) {
                workbooks['loading'] = false;
                workbooks['error'] = true;
                console.error(response);
                workbenchService.handleSessionTimeout(response);
            });
        },
        fetchWorkbooks : function() {
            var workbenchService = this;
            workbenchService.getAllTablueUsers();
            workbenchService.getWorkbooks().then(function(response) {
                var jsonResponse = x2js.xml_str2json(response.data);
                if(jsonResponse['tsResponse'].hasOwnProperty('error')) {
                    workbooks['loading'] = false;
                    workbooks['error'] = true;
                    workbooks['userUnauthorized'] = true;
                } else {
                    if (jsonResponse['tsResponse']['workbooks'] === "") {
                        workbooks['books'] = [];
                        workbooks['loading'] = false;
                    } else {
                        var wbs = jsonResponse['tsResponse']['workbooks']['workbook'];
                        var deferred = $q.defer();
                        if (Array.isArray(wbs)) {
                            workbooks['books'] = workbenchService.tranformWorkbooks(wbs, deferred);
                        } else if (!!wbs) {
                            workbooks['books'] = workbenchService.tranformWorkbooks([wbs], deferred);
                        }
                        deferred.promise.then(function(response) {
                            workbooks['loading'] = false;
                        }, function(response) {
                            workbooks['loading'] = false;
                        });
                    }
                }
            }, function(response) {
                workbooks['loading'] = false;
                workbooks['error'] = true;
                console.error(response);
                workbenchService.handleSessionTimeout(response);
            });
        },
		updateWorkbooks : function() {
            var workbenchService = this;
            if(!!workbooks.userUnauthorized) {
                return;
            }
            workbooks['loading'] = true;
            if(!!workbenchService.getSiteId() && !!workbenchService.getUserId()) {
                workbenchService.fetchWorkbooks();
            } else {
                workbenchService.init().then(function(response) {
                    workbenchService.setSiteId(response.data.Data.site_id);
                    workbenchService.setUserId(response.data.Data.user_id);
                    workbenchService.setTableauDomain(response.data.Data.tableau_domain);
                    workbenchService.fetchWorkbooks();
                    workbenchService.loadTableauScripts(response.data.Data.tableau_domain, response.data.Data.tableau_version);
                    workbenchService.getSubscriptionDetails();
                }, function(response) {
                    workbooks['loading'] = false;
                    workbooks['error'] = true;
                    console.error(response);
                    workbenchService.handleSessionTimeout(response);
                });
            }
        },
        loadTableauScripts : function(domain, version) {
        	var jsSubVersion;
        	var versionSplit = version.split(".");
        	
    		if(GlobalService.getVal('tableauVizVersions').hasOwnProperty(versionSplit[0])) {
    			jsSubVersion = GlobalService.getVal('tableauVizVersions')[versionSplit[0]] + "." + (!!versionSplit[1] ? versionSplit[1] : "0");
    		} else {
    			return;
    		}
        	
        	var head = document.getElementsByTagName("head")[0];
        	
        	var script = document.createElement('script');
            script.setAttribute('src', domain + '/javascripts/api/tableau-2.min.js');
            script.setAttribute('type', 'text/javascript');
            head.appendChild(script);
            
            var script = document.createElement('script');
            script.setAttribute('src', domain + '/javascripts/api/tableau-' + jsSubVersion + '.min.js');
            script.setAttribute('type', 'text/javascript');
            head.appendChild(script);
        	
        	var script = document.createElement('link');
            script.setAttribute('href', '/apps/app/css/tableau_' + versionSplit[0] + '.css');
            script.setAttribute('type', 'text/css');
            script.setAttribute('rel', 'stylesheet');
            head.appendChild(script);
            
        },
        getSubscriptionDetails : function() {
            var workbenchService = this;
            workbenchService.getSchedules().then(function(response) {
                var list = [];
                var jsonResponse = x2js.xml_str2json(response.data);
                if(!jsonResponse['tsResponse'].hasOwnProperty('error')) {
                    var schedules = jsonResponse['tsResponse']['schedules']['schedule'];
                    if(!Array.isArray(schedules)) {
                        list.push(schedules);
                    } else {
                        list = schedules;
                    }
                    schedulesList = $filter('filter')(list, {'_type': 'Subscription'}) || [];
                }
                
            }, function(response) {
                
            });
            
            workbenchService.getSubscriptions().then(function(response) {
                var list = [];
                var jsonResponse = x2js.xml_str2json(response.data);
                if(!jsonResponse['tsResponse'].hasOwnProperty('error')) {
                    var subscriptions = x2js.xml_str2json(response.data)['tsResponse']['subscriptions']['subscription'];
                    if(!Array.isArray(subscriptions)) {
                        list.push(subscriptions);
                    } else {
                        list = subscriptions;
                    }
                    subscriptionsList = $filter('filter')(list, {'user': {'_id': workbenchService.getUserId()}}) || [];
                }
            }, function(response){
                
            });
        },
        getSchedulesList : function() {
            return schedulesList;
        },
        setSchedulesList : function(data) {
            schedulesList = data;
        },
        getSubscriptionsList : function() {
            return subscriptionsList;
        },
        setSubscriptionsList : function(data) {
            subscriptionsList = data;
        },
		getTrustedKey : function() {
            return trustedKey;
        },
        setTrustedKey : function(val) {
            trustedKey = val;
        },
		getTableauDomain : function() {
			return tableauDomain;
		},
		setTableauDomain : function(domain) {
			tableauDomain = domain;
		},
		getSiteId : function() {
			return siteId;
		},
		setSiteId : function(id) {
			siteId = id;
		},
		getUserId : function() {
			return userId;
		},
		setUserId : function(id) {
			userId = id;
		},
		getWorkbooksLocal : function() {
			return workbooks;
		},
        getAllUsersDeatils : function() {
            return userList;
        },
		setWorkbooksLocal : function(books) {
			workbooks = books;
		},
		getSiteName : function() {
		    return GlobalService.getVal('manufacturer') + GlobalService.getVal('product') + GlobalService.getVal('schema');
		},
		getTableauUser : function() {
            var userInfo = metaDataService.getUser();
            var featureInfo = metaDataService.getFeatures();
            var genericWbusername = GlobalService.getVal('genericWbusername');
            if(featureInfo.workbench){
                if(userInfo.org_type == GlobalService.getVal("gbUserOrgType")){
                    return "glassbeam";
                }else {
                    return userInfo['email'];
                }
            }else if(featureInfo.dashboards && featureInfo.viewer) {
                return userInfo['email'];
            }else {
                return genericWbusername;
            }
		    
		},
		isPowerUser : function() {
		    var featureInfo = metaDataService.getFeatures();
            return featureInfo.workbench;
		},
		addViews : function(wbs, wb, defer) {
            var workbenchService = this;
            workbenchService.getViews(wb['id']).then(function(response) {
                views = x2js.xml_str2json(response.data)['tsResponse']['views']['view'];
                wb['views'] = [];
                if (Array.isArray(views)) {
                    for (j in views) {
                        view = {};
                        view['id'] = views[j]['_id'];
                        view['name'] = views[j]['_name'];
                        view['url'] = '/t/' + workbenchService.getSiteName() + '/views/' + views[j]['_contentUrl'].replace('/sheets', '');
                        view['owner'] = wb['owner']['_id'];
                        wb['views'].push(view);
                    }
                } else {
                    view = {};
                    view['id'] = views['_id'];
                    view['name'] = views['_name'];
                    view['url'] = '/t/' + workbenchService.getSiteName() + '/views/' + views['_contentUrl'].replace('/sheets', '');
                    view['owner'] = wb['owner']['_id'];
                    wb['views'].push(view);
                }
                workbenchService.getConnectionid(wb['id']).then(function(responsed) {
                    data = x2js.xml_str2json(responsed.data)['tsResponse']['connections']['connection']['datasource'];
                    wb['datasource'] = [];
                    if (Array.isArray(data)) {
                        for (j in datasource) {
                            datasource = {};
                            datasource['id'] = data[j]['_id'];
                            datasource['name'] = data[j]['_name'];
                            wb['datasource'].push(datasource);
                        }
                    } else {
                        if(data != undefined){
                            datasource = {};
                            datasource['id'] = data['_id'];
                            datasource['name'] = data['_name'];
                            wb['datasource'].push(datasource);
                        }
                    }
                    defer.resolve(responsed);
                });
                wbs.push(wb);
                defer.resolve(response);
            }, function(response) {
                defer.reject(response);
                workbenchService.handleSessionTimeout(response);
            });
        },
		tranformWorkbooks : function(workbooks, defer1) {
            var i, j, k, wbs = [], wb, views = [], view;
            var workbenchService = this;
            workbenchService.viewsLoaded = 0;
            workbenchService.totalworkbooks = workbooks.length;
            for (i in workbooks) {
                wb = {};
                wb['name'] = workbooks[i]['_name'];
                wb['id'] = workbooks[i]['_id'];
                wb['tabs'] = workbooks[i]['_showTabs'] == 'true';
                wb['owner'] = workbooks[i]['owner']['_id'];
                wb['modified_ts'] = workbooks[i]['_updatedAt'];
                wb['created_ts'] = workbooks[i]['_createdAt'];

                wb['tags'] = [];
                if (workbooks[i]['tags']) {
                    if (Array.isArray(workbooks[i]['tags']['tag'])) {
                        for (k in workbooks[i]['tags']['tag']) {
                            wb['tags'].push(workbooks[i]['tags']['tag'][k]['_label']);
                        }
                    } else {
                        wb['tags'].push(workbooks[i]['tags']['tag']['_label']);
                    }
                }
                var defer = $q.defer();
                this.addViews(wbs, wb, defer);
                defer.promise.then(function(response) {
                    workbenchService.viewsLoaded++;
                    if(workbenchService.viewsLoaded == workbenchService.totalworkbooks) {
                        defer1.resolve(response);
                    }
                }, function(response) {
                    workbenchService.viewsLoaded++;
                    if(workbenchService.viewsLoaded == workbenchService.totalworkbooks) {
                        defer1.resolve(response);
                    }
                });
            }
            return wbs;
        },
        addTableauEventListeners: function(viz, app, UserTrackingService) {
        	var workbenchService = this;
        	viz.addEventListener("marksSelection", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("customviewload", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("customviewremove", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("customviewsave", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("customviewsetdefault", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("filterchange", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("parametervaluechange", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("storypointswitch", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("tabswitch", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
        },
        updateTableauSession: function(app, module, activity, details, UserTrackingService) {
        	UserTrackingService.standard_user_tracking(app, module, activity, JSON.stringify(details)).then(function() {}, function() {});
        },
        handleSessionTimeout: function(response) {
            if (!sessionTimedOut && response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                sessionTimedOut = true;
                ModalService.sessionTimeout();
            }
        }
	};
}])
.factory('GBDashboardService',['$http', 'x2js', '$q', '$filter', '$location', 'metaDataService', 'GlobalService', 'ModalService', 'Dashboards', 'UtilService',
function($http, x2js, $q, $filter, $location, metaDataService, GlobalService, ModalService, Dashboards, UtilService){
    var  siteId = "", userId = "", tableauDomain = "", wbUserList = [], wbDashboards = [], logiDashboards = [], 
    allDashboards = [], logiDashboardsOwnersList= [], summaryDashboards = [], groupedData = [], trustedKey = "",sitedetailsobj;
    return{
        securityToken : "",
        adminUsersTableau : [],
        pagination : null,
        dataSourcesList : [],
        scheduleFreq : {
            "enabled":false, 
            "name":"hourly",
            "scheduler_timeZone" : new Date().toTimeString().split("GMT")[1].substring(0,5),
            "hrintvSele" : "1",
            "weekDaySele" : "1",
            "monthDay" : "Sunday",
            "YearDay" : "Sunday",
            "YearMonth" : "Jan",
            "scheduler_recipients" : "",
            "SelectedDays" : [],
            "weekDay" : GlobalService.getVal('weekDay'),
            "hrintv" :GlobalService.getVal('hrintv'),
            "error" : false,
            "scheduler_time" : {
                "hr" : "HH",
                "min" : "MM"
            }
        },
		getWBUser : function() {
		    var userInfo = metaDataService.getUser();
            var featureInfo = metaDataService.getFeatures();
            var genericWbusername = GlobalService.getVal('genericWbusername');
            if(featureInfo.workbench){
                if(userInfo.org_type == GlobalService.getVal("gbUserOrgType")){
                    return "glassbeam";
                }else {
                    return userInfo['email'];
                }
            }else if(featureInfo.dashboards && featureInfo.viewer) {
                return userInfo['email'];
            }else {
                return genericWbusername;
            }
        },
        getSiteId : function(){
            return siteId;
        },
        getUserId : function(){
            return userId;
        },
		getSiteName : function() {
		    return GlobalService.getVal('manufacturer') + GlobalService.getVal('product') + GlobalService.getVal('schema');
		},
        getTableauDomain : function(){
            return tableauDomain;
        },
        getTableauUsers : function(){
            return wbUserList;
        },
        getWbDashboards : function(){
            return wbDashboards;
        },
        getLogiOwners :  function () {
            return logiDashboardsOwnersList;
        },
        getDataSources : function(){
            return this.dataSourcesList;
        },
        chkAdminFeature : function(){
            if(metaDataService.getFeatures().admin){
                return true;
            }else {
                return false;
            }
        },
        // check whether the user is workbench user for demo/poc customer
        ifWbDemoUser : function () {
            var userOrg = metaDataService.getUserOrgType();
            var wbOrg = GlobalService.getVal('wbUserOrgType');
            var demo_realms = GlobalService.getVal('gb_demo_apps_realms');
            for(var i=0; i < demo_realms.length ;i++){
                if(GlobalService.getVal('role_details').mps_uidomain[demo_realms[i]] == $location.host()){
                    if(userOrg == wbOrg) {
                return true;
                }
                }
            }
            return false;
        },
        isPowerUser : function() {
            var featureInfo = metaDataService.getFeatures();
            return featureInfo.workbench;
        },
        ifGlassbeamUser : function () {
            var userOrg = metaDataService.getUserOrgType();
            var gbOrg = GlobalService.getVal('gbUserOrgType');
            if(userOrg == gbOrg) {
                return true;
            }else {
                return false;
            }
        },
        showDashBoard : function(book,type){
            var me = this;
            if(me.chkAdminFeature()){
                switch(type) {
                    case 'dashLevel':
                        return true;
                    case 'tags':
                        return true;
                    case 'changeOwner':
                        return true;
                }
            }else if(book.gDOwner != metaDataService.getUserEmail()) {
                if(me.ifGlassbeamUser()){
                    if(me.chkAdminFeature()){
                        switch(type) {
                            case 'dashLevel':
                                return true;
                            case 'tags':
                                return true;
                            case 'changeOwner':
                                return true;
                        }
                    }else {
                        switch(type) {
                            case 'dashLevel':
                                if(book.visibility){
                                    return true;
                                }else {
                                    return false;   
                                }
                            case 'tags':
                                return false;
                            case 'changeOwner':
                                return false;
                        }
                    }
                }else if(me.ifWbDemoUser()){
                    switch(type) {
                        case 'dashLevel':
                            return true;
                        case 'tags':
                            return true;
                        case 'changeOwner':
                            return true;
                    }
                }else{
                    switch(type) {
                        case 'dashLevel':
                            var userInfo = metaDataService.getUser();
                            if(book.role_access){
                                if(book.visibility && book.role_access.indexOf(userInfo['role'])!=-1){
                                    return true;
                                }else {
                                    return false;
                                }
                            }else {
                                return false;
                            }
                        case 'tags':
                            return false;
                        case 'changeOwner':
                            return false;
                    }
                }
            }else if(book.gDOwner == metaDataService.getUserEmail()){
                switch(type) {
                    case 'dashLevel':
                        var userInfo = metaDataService.getUser();
                        if(book.role_access && book.role_access.indexOf(userInfo['role'])!=-1){
                            return true;
                        }else {
                            return false;
                        }
                    case 'tags':
                        return true;
                    case 'changeOwner':
                        return true;
                }
            }
        },
        changePage : function (filterInfo, sortInfo) {
            var me = this;
            var filterredData = angular.copy(allDashboards);
            //filter data
            if(filterInfo && filterInfo.length){
                filterredData = me.applyFilter(filterredData, filterInfo);
            }
            if(!filterredData.length) return [];
            //group data by column
            groupedData = me.groupbyColumn(filterredData);
            //sort data
            if(sortInfo){
                me.pagination.sortByColumn(sortInfo);
            }
            me.pagination.process();
            return me.pagination.currentRecordsSet;
        },
        changePageSize : function(filterInfo, sortInfo, pageSize){
            var me = this;
            var filterredData = angular.copy(allDashboards);
            //filter data
            if(filterInfo && filterInfo.length){
                filterredData = me.applyFilter(filterredData, filterInfo);
            }
            if(!filterredData.length) return [];
            //group data by column
            groupedData = me.groupbyColumn(filterredData);
            //sort data
            if(sortInfo){
                me.pagination.sortByColumn(sortInfo);
            }
            if(pageSize>filterredData.length){
                me.pagination.pageSize = filterredData.length;
                me.pagination.endIndex = filterredData.length;    
            }else {
                me.pagination.pageSize = pageSize;
                me.pagination.endIndex = pageSize;
            }
            var msg = true;
            me.pagination.process(msg);
            return me.pagination.currentRecordsSet;
        },
        getAllDashboardsWithoutFilter : function () {
            return allDashboards;
        },
        getAllDashboards : function (filterInfo, sortInfo, searchDashboardsNameDescTags, reloadPagination, pageSize) {
            var me = this;
            var filterredData = angular.copy(allDashboards);
            //group data by column
            groupedData = me.groupbyColumn(filterredData);
            // filter dasboards if it matched it's name, desc or tag name
            if(searchDashboardsNameDescTags && searchDashboardsNameDescTags.length > 2){
                filterredData = me.filterDashboardsNameTags(filterredData, searchDashboardsNameDescTags);
            }
            //filter data
            if(filterInfo && filterInfo.length){
                if(filterInfo[0].columnName == "type_to_display"){
                    for(i=0;i<groupedData[0].data.length;i++){
                        if(filterInfo[0].columnValue == groupedData[0].data[i].name){
                            groupedData[0].data[i].selected = true;
                        }
                    }
                    filterredData = me.applyFilter(filterredData, filterInfo);
                }else {
                    filterredData = me.applyFilter(filterredData, filterInfo);
                    groupedData = me.groupbyColumn(filterredData);
                }
            }
            if(!filterredData.length) return [];
            //get data according to paginationh
            if(reloadPagination) {
                me.pagination = UtilService.localPagination();
                me.pagination.pageSize = pageSize;
                me.pagination.init(angular.copy(filterredData));
                me.pagination.sortByColumn = me.sortDataFromPaginationService;
            }
            //sort data
            if(sortInfo){
                //
                me.pagination.sortByColumn(sortInfo);
            }else{
                sortInfo = {title: "Last modified", sorted: false, columnName: "modified_ts"};
                me.pagination.sortByColumn(sortInfo);
            }
            me.pagination.process();
            return me.pagination.currentRecordsSet;
        },
        filterDashboardsNameTags : function (filterredData, filterStr) {
            var results = filterredData.filter(function(item){
                if((item.dname.toUpperCase()).indexOf(filterStr.toUpperCase() ) != -1){
                    return true;
                }else {
                    for(i=0;i<item.reports.length;i++){
                        if((item.reports[i].rname.toUpperCase()).indexOf(filterStr.toUpperCase()) != -1){
                            return true;
                        }
                    }
                } 
                if(item.tag && item.tag.length){
                    for(var i=0;i<item.tag.length;i++){
                        if((item.tag[i].toUpperCase()).indexOf(filterStr.toUpperCase()) != -1) return true;
                    }
                }
                return false;
            });
            if(filterStr.length != 0 && filterStr != ""){
                for(j=0;j<results.length;j++){
                    for(i=0;i<results[j].reports.length;i++){
                        if((results[j].reports[i].rname.toUpperCase()).indexOf(filterStr.toUpperCase()) != -1){
                            results[j].expand = true;
                            results[j].reports[i].hilighted = true;
                        }
                    }
                }
            }
            return results;
        },
        getGroupedData : function () {
            return groupedData;
        },
        setGroupedData : function (data) {
            var me = this;
            me.groupedData = data;
        },
        getLogiDashboards : function () {
            return logiDashboards;
        },
        getSummaryDashboard : function () {
            return summaryDashboards;
        },
        getAllTableauAdminUser : function(){
            return this.adminUsersTableau;
        },
        getWorkbenchApiRoot : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return infoserverDomain + '/tableau/view/preview/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId();//+"?"+new Date().getTime();
        },



        setTableauUsers : function(list){
            wbUserList = list;
        },
        setWbDashboards : function(list){
            wbDashboards = list;
        },
        setLogiOwners :  function (params) {
            logiDashboardsOwnersList = params;
        },
        setSiteId : function(id){
            siteId = id;
        },
        setUserId : function(id){
            userId = id;
        },
        setTableauDomain : function(domain){
            tableauDomain = domain;
        },
        setAllDashboards : function (data) {
            allDashboards = data;
        },
        setLogiDashboards : function (data) {
            logiDashboards = data;
        },
        setSummaryDashboard : function (list) {
            summaryDashboards = list;
        },
		isPowerUser : function() {
		    var featureInfo = metaDataService.getFeatures();
            return featureInfo.workbench;
        },
        deleteWorkbook : function(book) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/workbook/delete/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId() + '/' + book.d_id);
        },
        getTrustedAuthKey : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/trusted/ticket/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getWBUser());
        },
		getTrustedKey : function() {
            return trustedKey;
        },
        setTrustedKey : function(val) {
            trustedKey = val;
        },
        getLogiAdminUsers : function(){
            var me = this;
            return $q(function(resolve, reject){
                Dashboards.getLogiAdmin().then(function (responseLogi) {
                    var dashOwnerListLogi = responseLogi.data.Data;
                    me.setLogiOwners(dashOwnerListLogi);
                    resolve();
                }, function(){
                    reject();
                });
            });
        },
        callSiteuserInfoAPI : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            var params = {};
            if(this.isPowerUser()) {
                params['power'] = true;
                params['full_name'] = metaDataService.getUserName();
            }
		    return $http.get(infoserverDomain + '/tableau/siteuser/info/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getWBUser(), {params: params});
        },
        getAllTablueUsers: function () {
            var me = this;
            return $q(function (resolve, reject) {
                me.getUsersAPI().then(function (response) {
                    var jsonResponse = x2js.xml_str2json(response.data), wbUserList = [];
                    if (jsonResponse['tsResponse'].hasOwnProperty('error')) {
                        reject();
                    } else {
                        if (jsonResponse['tsResponse']['users'] === "") {
                            wbUserList = [];
                        } else {
                            var wbs = jsonResponse['tsResponse']['users']['user'];
                            if (Array.isArray(wbs)) {
                                wbUserList = wbs
                            }
                        }
                        me.setTableauUsers(wbUserList);
                        resolve(wbUserList);
                    }
                }, function (response) {
                    me.handleSessionTimeout(response);
                    reject();
                });
            });
        },
		getUsersAPI : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/users/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId());
        },
        getAllTableauDashboards: function () {
            var me = this;
            return $q(function (resolve, reject) {
                me.fetchTableauDashboadsAPI().then(function (response) {
                    var jsonResponse = x2js.xml_str2json(response.data);
                    var wbDashboards = [];
                    if (jsonResponse['tsResponse'].hasOwnProperty('error')) {
                        reject();
                    } else {
                        if (jsonResponse['tsResponse']['workbooks'] === "") {
                            wbDashboards = [];
                        } else {
                            var wbs = jsonResponse['tsResponse']['workbooks']['workbook'];
                            if (Array.isArray(wbs)) {
                                wbDashboards = me.transformWbToLogiFormate(wbs);
                            } else if (!!wbs) {
                                wbDashboards = me.transformWbToLogiFormate([wbs]);
                            }
                        }
                        me.setWbDashboards(wbDashboards);
                        resolve(wbDashboards);
                    }
                }, function (response) {
                    reject();
                    me.handleSessionTimeout(response);
                });
            });
        },
		fetchTableauDashboadsAPI : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/dashboards/all/details/merged/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId());
        },
        transformWbToLogiFormate : function (workbooks) {
            var allDashboards = [], me = this;
            var tableauUser = me.getTableauUsers();
            for (i in workbooks) {
                wb = {};
                wb['id'] = workbooks[i]['_id'];
                wb['name'] = workbooks[i]['_name'];
                wb['tabs'] = workbooks[i]['_showTabs'] == 'true';
                //wb['owner'] = workbooks[i]['owner']['_id'];
                wb['modified_ts'] = workbooks[i]['_updatedAt'];
                wb['created_ts'] = workbooks[i]['_createdAt'];
                wb['modified_ts_to_display'] = moment(workbooks[i]['_updatedAt']).format("YYYY-MM-DD HH:MM:SS");
                wb['created_ts_to_display'] = moment(workbooks[i]['_createdAt']).format("YYYY-MM-DD HH:MM:SS");
                for(j=0;j<tableauUser.length;j++){
                    if(tableauUser[j]._id == workbooks[i]['owner']._id){
                        wb['gDOwner'] = tableauUser[j]._name;        
                    }
                }
                wb['owner'] = workbooks[i]['owner'];

                wb['d_id'] = workbooks[i]['_id'];
                wb['dname'] = workbooks[i]['_name'];
                wb['d_type'] = "Tableau";
                wb['type_to_display'] = GlobalService.getVal('userCreatedDashboards');
                wb['ownerList'] = me.adminUsersTableau;
                wb['tag'] = [];
                wb['visibility'] = true;
                if (workbooks[i]['tags']) {
                    if (Array.isArray(workbooks[i]['tags']['tag'])) {
                        for (k in workbooks[i]['tags']['tag']) {
                            wb['tag'].push(workbooks[i]['tags']['tag'][k]['_label']);
                        }
                    } else {
                        wb['tag'].push(workbooks[i]['tags']['tag']['_label']);
                    }
                }
                allDashboards.push(wb);
            }
            return allDashboards;
        },
        getEachTableauDashboardDetailts : function (wbs) {
            var me = this;
            var viewList = wbs.map(me.getTableauDashboardView.bind(me));
            var dataSourceList = wbs.map(me.getTableauDashboardDataSources.bind(me));
            var scheduledInfo = me.getTableauDashboardAllScheduledInfo();
            dataSourceList.forEach(function(item, i) {
                viewList.push(item);
            });
            viewList.push(scheduledInfo);
            return $q.all[viewList];
        },
        getTableauDashboardView : function (dboard) {
            var me = this;
            var id = dboard['id'];
            return $q(function(resolve, reject){
                me.getEachTableauDashboardDetailsViewAPI(id).then(function(response) {
                    var jsonResponse = x2js.xml_str2json(response.data);
                    if (jsonResponse['tsResponse'].hasOwnProperty('error')) {
                        reject();
                    }
                    me.updateTableauDashboardWithViews(id, jsonResponse);
                    resolve();
                });
            });
        },
        getTableauDashboardDataSources : function (dboard) {
            var me = this;
            var id = dboard['id'];
            return $q(function(resolve, reject){
                me.getEachTableauDashboarDataSourceAPI(id).then(function(response) {
                    var jsonResponse = x2js.xml_str2json(response.data);
                    if (jsonResponse['tsResponse'].hasOwnProperty('error')) {
                        reject();
                    }
                    me.updateTableauDashboardWithDataSources(id, jsonResponse);
                    resolve();
                });
            });
        },
        getEachTableauDashboardDetailsViewAPI : function(workbookId) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/workbook/views/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId() + '/' + workbookId);
        },
        getEachTableauDashboarDataSourceAPI : function(workbookId) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            return $http.get(infoserverDomain + '/tableau/connections/list/workbook/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId() + '/' + workbookId);
        },
        getWbDashboardsById : function (id) {
            for(var i=0;i< wbDashboards.length;i++){
                var item = wbDashboards[i];
                if(item.id == id) return item;
            }
            return null;
            // return wbDashboards.filter(function(item){
            //     if(item.id == id) return item;
            // });
        },
        updateTableauDashboardWithViews : function (id, details) {
            var me = this;
            var views = details['tsResponse']['views']['view'];
            var wb = me.getWbDashboardsById(id);
            if(!wb) return;
            wb['reports'] = [];
            var view = {};

            if (Array.isArray(views)) {
                for (j in views) {
                    view = {};
                    view['id'] = views[j]['_id'];
                    view['name'] = views[j]['_name'];
                    view['url'] = '/t/' + me.getSiteName() + '/views/' + views[j]['_contentUrl'].replace('/sheets', '');
                    view['owner'] = wb['owner']['_id'];

                    view['r_id'] = views[j]['_id'];
                    view['rname'] = views[j]['_name'];
                    view['r_link'] = '/t/' + me.getSiteName() + '/views/' + views[j]['_contentUrl'].replace('/sheets', '');
                    view['scheduler_enabled'] = false;
                    view['scheduler_freq'] = "";
                    view['scheduler_period'] = "";
                    view['scheduler_time'] ="";
                    view['supported_export_format'] = "";

                    wb['reports'].push(view);
                }
            } else {
                view = {};
                view['id'] = views['_id'];
                view['name'] = views['_name'];
                view['url'] = '/t/' + me.getSiteName() + '/views/' + views['_contentUrl'].replace('/sheets', '');
                view['owner'] = wb['owner']['_id'];


                view['r_id'] = views['_id'];
                view['rname'] = views['_name'];
                view['r_link'] = '/t/' + me.getSiteName() + '/views/' + views['_contentUrl'].replace('/sheets', '');
                wb['reports'].push(view);
                view['scheduler_enabled'] = false;
                view['scheduler_freq'] = "";
                view['scheduler_period'] = "";
                view['scheduler_time'] ="";
                view['supported_export_format'] = "";
            }
        },
        updateTableauDashboardWithDataSources : function (id, details) {
            var me = this;
            var wb = me.getWbDashboardsById(id);
            if(!wb) return;
            var datasource= {};
            var data = details['tsResponse']['connections']['connection'];

            wb['datasource'] = [];
            if (Array.isArray(data)) {
                for (j in data) {
                    datasource = {};
                    datasource['id'] = data[j]['_id'];
                    datasource['name'] = data[j]['_name'];
                    wb['datasource'].push(datasource);
                }
            } else {
                if(data != undefined){
                    datasource = {};
                    datasource['id'] = data.datasource['_id'];
                    datasource['name'] = data.datasource['_name'];
                    wb['datasource'].push(datasource);
                }
            }
        },

        getTableauDashboardAllScheduledInfo : function () {
            var me = this;
            return $q(function(resolve, reject){
                me.getSchedules().then(function(response) {
                    var jsonResponse = x2js.xml_str2json(response.data);
                    if (jsonResponse['tsResponse'].hasOwnProperty('error')) {
                        reject();
                    }
                    me.updateTableauDashboardWithScheduledInfo(jsonResponse);
                    resolve();
                });
            });
        },
        updateTableauDashboardWithScheduledInfo : function (jsonResponse) {
            var me = this, schedulesList = [], list = [];
            var allWbDashboards = me.getWbDashboards();
            if(!allWbDashboards || !allWbDashboards.length) return;
            var dlength = allWbDashboards.length;

            var schedules = jsonResponse['tsResponse']['schedules']['schedule'];
            if(!Array.isArray(schedules)) {
                list.push(schedules);
            } else {
                list = schedules;
            }
            schedulesList = $filter('filter')(list, {'_type': 'Subscription'}) || [];
          
            for (var i = 0; i < schedulesList.length; i++) {
                var scheduledItem = schedulesList[i];
                for (var j = 0; j < dlength; j++) {
                    var reports = allWbDashboards[j]['reports'];
                    if (reports) {
                        var viewsLen = reports.length;
                        for (var k = 0; k < viewsLen; k++) {
                            if (reports[k]['id'] === scheduledItem['_id']) {
                                reports[k]["scheduler_enabled"] = scheduledItem['_state'] == "Active" ? true : false;
                                reports[k]["scheduler_freq"] = scheduledItem['_frequency'];
                                reports[k]["scheduler_period"] = scheduledItem['_priority'];
                                reports[k]["scheduler_time"] = scheduledItem['_nextRunAt'];
                                //reports[k]["supported_export_format"]: ""
                            }
                        }
                    }
                }
            }
            
        },
		getSchedules: function() {
		    var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/schedules/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'));
		},

        getAllLogiDashboards : function () {
            var me = this;
            return $q(function (resolve, reject) {
                Dashboards.allDetails().then(function(response) {
                    var allDashboards = $filter('internalDashboards')(response.data.Data);
                    var allTableauDashboardsFromLogi = $filter('filter')(response.data.Data, { 'typ': 'Tableau' }, false) || [];
                    //All logi dashboard
                    var allLogiDashboards = $filter('filter')(response.data.Data, { 'typ': 'Internal' }, false) || [];
                    for(i=0;i<response.data.Data.length;i++){
                        for(j=0;j<response.data.Data[i].reports.length;j++){
                            if(response.data.Data[i].reports[j].d_type=="Summary"){
                                var summaryDashboard = [];
                                summaryDashboard.push(angular.copy(response.data.Data[i]));            
                            }
                        }
                    }
                    var allTableauDashboards = me.getWbDashboards();
                    for(i=0;i<summaryDashboard[0].reports.length;i++){
                        if(summaryDashboard[0].reports[i].d_type != "Summary"){
                            summaryDashboard[0].reports.splice(i,1);
                            i--;
                        }
                    }
                    for(i=0;i<allTableauDashboards.length;i++){
                        allTableauDashboards[i].typ = "Tableau";
                        if(allTableauDashboards[i].id == summaryDashboard[0].d_id){                        
                       
                            for(j=0;j<allTableauDashboards[i].reports.length;j++){
                                if(allTableauDashboards[i].reports[j].id == summaryDashboard[0].reports[0].r_id){
                                    allTableauDashboards[i].reports[j].d_type = "Summary";
                                }else{
                                    allTableauDashboards[i].reports[j].d_type = "Tableau";
                                }
                            }
                        
                        }
                    }

                    //update owner info
                    allDashboards.map(function(item){
                        //update vailable owner list, where user can change to other admin
                        item['ownerList'] = me.getLogiOwners();
                        //update dashboard owner info
                        if (item.dashboardSecurityInfo.owner) {
                            item['gDOwner'] = item.dashboardSecurityInfo.owner;
                        }else {
                            item['gDOwner'] = item.created_by;
                        }
                        //update visiblity
                        item['visibility'] = item.dashboardSecurityInfo.is_public;

                        //check if there are other admin available or not
                        if( me.getLogiOwners() &&  me.getLogiOwners().length &&  me.getLogiOwners().length == 1 &&  me.getLogiOwners()[0] === item['gDOwner']){
                            item['showChangeOwnerDD'] = false;
                        }else{
                            item['showChangeOwnerDD'] = true;
                        }
                    });
                    for(var j=0;j<allTableauDashboards.length;j++){
                        var tDash = allTableauDashboards[j];
                        if( me.getAllTableauAdminUser() &&  me.getAllTableauAdminUser().length &&  me.getAllTableauAdminUser().length == 1 &&  me.getAllTableauAdminUser()[0] === tD['gDOwner']){
                            tDash['showChangeOwnerDD'] = false;
                        }else{
                            tDash['showChangeOwnerDD'] = true;
                        }
                    }
                    //update pscheduleing info from Logi and tag info
                    for(var i=0;i<allTableauDashboardsFromLogi.length;i++){
                        var tDfromLogi = allTableauDashboardsFromLogi[i];
                        for(var j=0;j<allTableauDashboards.length;j++){
                            var tD = allTableauDashboards[j];

                            if(tDfromLogi['d_id'] === tD['d_id']){
                                tD['tag'] = tDfromLogi['tag'];
                                var reportsFromLogi = tDfromLogi['reports'];
                                var reportsTD = tD['reports'];

                                for(var k=0;k<reportsFromLogi.length;k++){
                                    
                                    for(var l=0;l<reportsTD.length;l++){
                                        var reportsItemFromLogi = reportsFromLogi[k];
                                        var reportsItemTD = reportsTD[l];
                                        if(reportsItemFromLogi['r_id'] === reportsItemTD['r_id']){
                                            reportsItemTD['scheduler_enabled'] = reportsItemFromLogi['scheduler_enabled'];
                                            reportsItemTD['scheduler_freq'] = reportsItemFromLogi['scheduler_freq'];
                                            reportsItemTD['scheduler_period'] =reportsItemFromLogi['scheduler_period'];
                                            reportsItemTD['scheduler_time']  = reportsItemFromLogi['scheduler_time'];
                                            reportsItemTD['supported_export_format'] = reportsItemFromLogi['supported_export_format'];
                                        }
                                    }
                                }
                                //set visiblity
                                if(tDfromLogi['dashboardSecurityInfo'] && tDfromLogi['dashboardSecurityInfo']['is_public'] != undefined){
                                    tD['visibility'] = tDfromLogi['dashboardSecurityInfo']['is_public'] ;
                                }
                                //update role_access
                                if(tDfromLogi['role_access'] && tDfromLogi['role_access'].length){
                                    tD['role_access'] = tDfromLogi['role_access'];
                                }
                                //update owner info
                                if(tDfromLogi['dashboardSecurityInfo'] && tDfromLogi['dashboardSecurityInfo']['owner'] != undefined){
                                    tD['owner']['name'] = tDfromLogi['dashboardSecurityInfo']['owner'] ;
                                    tD['owner']['_id'] = "";
                                    tD['gDOwner'] = tDfromLogi['dashboardSecurityInfo']['owner'] ;
                                }
                            }
                            //update owner info 
                            var allWbUsers = me.getTableauUsers();
                            allWbUsers.map(function(item){
                                if(item['_id'] === tD['owner']['_id']){
                                    tD['owner']['name'] = item["_name"];
                                    tD['gDOwner'] = item["_name"];
                                }
                            });
                        }
                    }

                    //update summary dashboard url with security
                    var dashboardSecurity = GlobalService.getVal('dashboardSecurity');
                    //check if summary dashboard had role associaed with current user
                    summaryDashboard = summaryDashboard.filter(function(summaryD){
                        if(me.showDashBoard(summaryD, 'dashLevel')){
                            return true;
                        }
                    });
                    if (dashboardSecurity && me.securityToken === "") {
                        summaryDashboard[0].reports[0].r_link = $location.protocol() + "://" + $location.host() + GlobalService.getVal('dashboardErrorPage');
                    } else if (dashboardSecurity && me.securityToken !== "") {
                        summaryDashboard[0].reports[0].r_link = summaryDashboard[0].reports[0].r_link + "&rdSecureKey=" + me.securityToken;
                    }
                    if(summaryDashboard){
                        me.setSummaryDashboard(summaryDashboard);
                    }

                    //merge logi dashboards and table dashboards
                    me.mergeDashboards(allTableauDashboards, allDashboards, []);

                    resolve();
                });

            });
        },
        mergeDashboards : function (tableauDashboards, logiDashboards, summaryDashboard) {
            if(summaryDashboard && summaryDashboard.length){
                logiDashboards.push(summaryDashboard[0]);
            }
            var me=this, all = angular.copy(tableauDashboards);
            me.setLogiDashboards(logiDashboards);
            logiDashboards.map(function(item){
                item['type_to_display'] = GlobalService.getVal('internalDashboards');
                item['created_ts_to_display'] = moment(item['created_ts']).format("YYYY-MM-DD HH:MM:SS");
                item['modified_ts_to_display'] = moment(item['modified_ts']).format("YYYY-MM-DD HH:MM:SS");
                if(me.isNewDashboard(tableauDashboards, item['d_id'])){
                    all.push(item);
                }
            });
            //update role access and other info
            all.map(function(tD){
                var tempRoleAccess = [];
                var tempRoleAccessObj = {};
                if(tD['role_access'] && tD['role_access'].length){
                    for(m=0;m<tD.role_access.length;m++){
                        tempRoleAccessObj = {};
                        tempRoleAccessObj.realName = tD.role_access[m];
                        tempRoleAccessObj.selected = false;
                        if(tD.role_access[m].split('_').length>3){
                            tempRoleAccessObj.name = tD.role_access[m].split('_').splice(3,3).join('_');
                        }else {
                            tempRoleAccessObj.name = tD.role_access[m];
                        }
                        tempRoleAccess.push(tempRoleAccessObj);
                    }
                    tD.role_access_dis = tempRoleAccess;
                }else {
                    tD['role_access_dis'] = [];
                }
                
                //update scheduler info
                if(tD.reports && tD.reports.length){
                    tD.reports.map(function(eachReport){
                        if(eachReport.scheduler_period){
                            if(eachReport.scheduler_period == 'hourly'){
                                eachReport.schDisplay = "Hourly";
                            }
                            if(eachReport.scheduler_period == 'daily'){
                                eachReport.schDisplay = "Daily at "+ eachReport.scheduler_time;
                            }
                            if(eachReport.scheduler_period == 'weekly'){
                                eachReport.schDisplay = "Weekly on "+ eachReport.scheduler_freq.substring(5)+" at "+ eachReport.scheduler_time;
                            }
                            if(eachReport.scheduler_period == 'monthly'){
                                me.scheduleFreq.weekDay = GlobalService.getVal("weekDay")
                                for(k=0;k< me.scheduleFreq.weekDay.length;k++){
                                    if(me.scheduleFreq.weekDay[k].key == eachReport.scheduler_freq.split(":")[1].substring(4)){
                                        disDay = me.scheduleFreq.weekDay[k].value;
                                    }
                                }
                                eachReport.schDisplay = "Monthly on "+disDay+" "+eachReport.scheduler_freq.split(":")[0].substring(5).charAt(0).toUpperCase()+eachReport.scheduler_freq.split(":")[0].substring(5).slice(1)+" at "+eachReport.scheduler_time;
                            }
                            if(eachReport.scheduler_period == 'yearly'){
                                for(k=0;k<me.scheduleFreq.weekDay.length;k++){
                                    if(me.scheduleFreq.weekDay[k].key == eachReport.scheduler_freq.split(":")[2].substring(4)){
                                        disDay = me.scheduleFreq.weekDay[k].value;
                                    }
                                }
                                eachReport.schDisplay = "Yearly every "+disDay+" "+eachReport.scheduler_freq.split(":")[1].substring(5).charAt(0).toUpperCase()+eachReport.scheduler_freq.split(":")[1].substring(5).slice(1)+" of "+eachReport.scheduler_freq.split(":")[0].substring(6)+" month at "+eachReport.scheduler_time;
                            }
                        }
                    })
                }

                //update permissions
                if(me.showDashBoard(tD, 'dashLevel')){
                    tD['permissionShowDashboard'] = true;
                }else{
                    tD['permissionShowDashboard'] = false;
                }

                if(me.showDashBoard(tD, 'tags')){
                    tD['permissionTags'] = true;
                }else{
                    tD['permissiontags'] = false;
                }

                if(me.showDashBoard(tD, 'changeOwner')){
                    tD['permissionOwnerChange'] = true;
                }else{
                    tD['permissionwnerChange'] = false;
                }
                //creat thumbnail img src
                var workbookId = "";
                var sheetId = "";
                var gbepoc = new Date().getTime();
                if(tD['d_type'] == "Tableau"){
                    var workbenchApiRootDir = me.getWorkbenchApiRoot();
                    workbookId = tD["id"];
                    var list = tD["reports"];
                    if(list && list[0]){
                        sheetId  = list[0]["r_id"];
                    }
                    tD['thumbnailImgSrc'] = workbenchApiRootDir + '/' + workbookId + '/' + (sheetId?(sheetId+"?gbepoc="+gbepoc):"?gbepoc="+gbepoc);
                    list.map(function(item){
                        sheetId  = item["r_id"];
                        item.thumbnailImgSrc = workbenchApiRootDir + '/' + workbookId + '/' + (sheetId?(sheetId+"?gbepoc="+gbepoc):"?gbepoc="+gbepoc);
                    });
                }else{
                    workbookId = tD["d_id"];
                    var list = tD["reports"];
                    list.map(function(item){
                        item.thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path')+'/'+workbookId+'.png';
                    });
                    tD['thumbnailImgSrc'] = GlobalService.getVal('dashboard_img_logi_path')+'/'+workbookId+'.png';
                }
            });
            all = all.filter(function(item){
                if(item.permissionShowDashboard) return true;
            });
            //update all dashboads
            me.setAllDashboards(all);
        },
        setpermissionsandroles : function (dashboards, alldashFlag) {
            var me=this, all = angular.copy(dashboards);
            //update role access and other info
            all.map(function(tD){
                var tempRoleAccess = [];
                var tempRoleAccessObj = {};
                if(tD['role_access'] && tD['role_access'].length){
                    for(m=0;m<tD.role_access.length;m++){
                        tempRoleAccessObj = {};
                        tempRoleAccessObj.realName = tD.role_access[m];
                        tempRoleAccessObj.selected = false;
                        if(tD.role_access[m].split('_').length>3){
                            tempRoleAccessObj.name = tD.role_access[m].split('_').splice(3,3).join('_');
                        }else {
                            tempRoleAccessObj.name = tD.role_access[m];
                        }
                        tempRoleAccess.push(tempRoleAccessObj);
                    }
                    tD.role_access_dis = tempRoleAccess;
                }else {
                    tD['role_access_dis'] = [];
                }
                
                //update scheduler info
                if(tD.reports && tD.reports.length){
                    tD.reports.map(function(eachReport){
                        if(eachReport.scheduler_period){
                            if(eachReport.scheduler_period == 'hourly'){
                                eachReport.schDisplay = "Hourly";
                            }
                            if(eachReport.scheduler_period == 'daily'){
                                eachReport.schDisplay = "Daily at "+ eachReport.scheduler_time;
                            }
                            if(eachReport.scheduler_period == 'weekly'){
                                eachReport.schDisplay = "Weekly on "+ eachReport.scheduler_freq.substring(5)+" at "+ eachReport.scheduler_time;
                            }
                            if(eachReport.scheduler_period == 'monthly'){
                                me.scheduleFreq.weekDay = GlobalService.getVal("weekDay")
                                for(k=0;k< me.scheduleFreq.weekDay.length;k++){
                                    if(me.scheduleFreq.weekDay[k].key == eachReport.scheduler_freq.split(":")[1].substring(4)){
                                        disDay = me.scheduleFreq.weekDay[k].value;
                                    }
                                }
                                eachReport.schDisplay = "Monthly on "+disDay+" "+eachReport.scheduler_freq.split(":")[0].substring(5).charAt(0).toUpperCase()+eachReport.scheduler_freq.split(":")[0].substring(5).slice(1)+" at "+eachReport.scheduler_time;
                            }
                            if(eachReport.scheduler_period == 'yearly'){
                                for(k=0;k<me.scheduleFreq.weekDay.length;k++){
                                    if(me.scheduleFreq.weekDay[k].key == eachReport.scheduler_freq.split(":")[2].substring(4)){
                                        disDay = me.scheduleFreq.weekDay[k].value;
                                    }
                                }
                                eachReport.schDisplay = "Yearly every "+disDay+" "+eachReport.scheduler_freq.split(":")[1].substring(5).charAt(0).toUpperCase()+eachReport.scheduler_freq.split(":")[1].substring(5).slice(1)+" of "+eachReport.scheduler_freq.split(":")[0].substring(6)+" month at "+eachReport.scheduler_time;
                            }
                        }
                    })
                }

                //update permissions
                if(me.showDashBoard(tD, 'dashLevel')){
                    tD['permissionShowDashboard'] = true;
                }else{
                    tD['permissionShowDashboard'] = false;
                }

                if(me.showDashBoard(tD, 'tags')){
                    tD['permissionTags'] = true;
                }else{
                    tD['permissionTags'] = false;
                }

                if(me.showDashBoard(tD, 'changeOwner')){
                    tD['permissionOwnerChange'] = true;
                }else{
                    tD['permissionOwnerChange'] = false;
                }
                //creat thumbnail img src
                var workbookId = "";
                var sheetId = "";
                var gbepoc = new Date().getTime();
                if(tD['d_type'] == "Tableau"){
                    // var workbenchApiRootDir = me.getWorkbenchApiRoot();
                    // workbookId = tD["id"];
                    // var list = tD["reports"];
                    // if(list && list[0]){
                    //     sheetId  = list[0]["r_id"];
                    // }
                    // tD['thumbnailImgSrc'] = workbenchApiRootDir + '/' + workbookId + '/' + (sheetId?(sheetId+"?gbepoc="+gbepoc):"?gbepoc="+gbepoc);
                    // list.map(function(item){
                    //     sheetId  = item["r_id"];
                    //     item.thumbnailImgSrc = workbenchApiRootDir + '/' + workbookId + '/' + (sheetId?(sheetId+"?gbepoc="+gbepoc):"?gbepoc="+gbepoc);
                    // });
                }else{
                    // workbookId = tD["d_id"];
                    // var list = tD["reports"];
                    // list.map(function(item){
                    //     item.thumbnailImgSrc = GlobalService.getVal('dashboard_img_logi_path')+'/'+workbookId+'.png';
                    // });
                    // tD['thumbnailImgSrc'] = GlobalService.getVal('dashboard_img_logi_path')+'/'+workbookId+'.png';
                }
            });
            all = all.filter(function(item){
                if(item.permissionShowDashboard) return true;
            });
            //dashCtrl.dashboards = all;
            if(alldashFlag){
                me.setAllDashboards(all);
            }
            return all;
        },
        //called during merging of tableau and logi dashboards
        isNewDashboard : function (tableauDashboards, id) {
            var list = tableauDashboards.filter(function(item){
                if(item.d_id == id) return true;
            });
            return list?(list.length?false:true): true;
        },
        getDashboardSecurityToken : function () {
            var me = this;
            return $q(function (resolve, reject) {
                Dashboards.getSecurityToken().then(function (response) {
                    me.securityToken = response.data.Data;
                    resolve();
                });
            });
        },
        getTableauAdminUser : function(){
            var me = this;
            return $q(function(resolve, reject){
                Dashboards.getTableauAdmin().then(function (responseTab) {
                    me.adminUsersTableau = responseTab.data.Data;
                    resolve();
                });
            });
        },
        //this will get called when we need fresh list of dashboard from server
        // when we chagne owner or tags
        getDashboardsWithFilter : function (filterInfo, sortInfo) {

            var me = this;
            var filterredData = angular.copy(allDashboards);
            //filter data
            if(filterInfo && filterInfo.length){
                filterredData = me.applyFilter(filterredData, filterInfo);
            }
            if(!filterredData.length) return [];
            //group data by column
            groupedData = me.groupbyColumn(filterredData);
          
            //sort data
            if(sortInfo){
                //
                me.pagination.sortByColumn(sortInfo);
            }
            me.pagination.process();
            return me.pagination.currentRecordsSet;
        },
        groupbyColumn : function (dbData) {
            var columnFiltersName = [{
                columnName : 'type_to_display',
                columnTitle : "Type",
                customSelect : false,
                multiselect : false,
                data : []
            },{
                columnName : 'modified_ts',
                columnTitle : "Last Modified",
                customSelect : true,
                multiselect : false,
                data : GlobalService.getVal("lastModifiedArray")
            },{
                columnName : 'gDOwner',
                columnTitle : "Owner",
                customSelect : false,
                multiselect : true,
                data : []
            },{
                columnName : 'datasource',
                columnTitle : "Data Sources",
                customSelect : false,
                multiselect : true,
                data : []
            },{
                columnName : 'tag',
                columnTitle : "Tags",
                customSelect : false,
                multiselect : true,
                data : []
            }];
            var addItemToListWithCount = function (list, item) {
                var found = false;
                if(list.length == 0){
                    list.push(item);
                }else{
                    //increase count if it has match or add as a new item
                    //check if it is new
                    for(var i=0;i<list.length;i++){
                        if(list[i]['name'] == item.name){
                            list[i]['count'] += 1;
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        list.push(item)
                    }
                }
            };
            var tmp = {};
            dbData.map(function(game) {
                if (game['type_to_display']) {
                    tmp = {
                        name: game['type_to_display'],
                        count: 1,
                        selected : false
                    }
                    addItemToListWithCount(columnFiltersName[0].data, tmp);
                }
                if (game['gDOwner']) {
                    tmp = {
                        name: game['gDOwner'],
                        count: 1,
                        selected : false
                    }
                    addItemToListWithCount(columnFiltersName[2].data, tmp);
                }
                if (game['datasource'].length > 0) {
                    tmp = {
                        name: game['datasource'][0]['name'],
                        count: 1,
                        selected : false
                    }
                    addItemToListWithCount(columnFiltersName[3].data, tmp);
                }
                if (game['tag']) {
                    var tagList = game['tag'];
                    for(var i=0;i<tagList.length;i++){
                        tmp = {
                            name: tagList[i],
                            count: 1,
                            selected : false
                        }
                        addItemToListWithCount(columnFiltersName[4].data, tmp);
                    }
                }
            });
            return columnFiltersName;
        },
        applyFilter : function (list,filterList) {
            var isInTimerange = function (timeRange, targetDateTime) {
                var ts = new Date().getTime();
                var oneDay = 24 * 60 * 60 * 1000;
                var st,et;
                switch (timeRange) {
                    case 'Last 24 Hrs':
                        var tsYesterday = ts - oneDay;
                        st = new Date(tsYesterday);
                        et = new Date();
                        break;
                    case 'Last Week':
                        var lastweek = ts - (7 * oneDay);
                        st = new Date(lastweek);
                        et = new Date();
                        break;
                    case 'Last Month':
                        var lastmonth = ts - (30 * oneDay);
                        st = new Date(lastmonth);
                        et = new Date();
                        break;
                    case 'Last 6 Month':
                        var last6month = ts - (6 * 30 * oneDay);
                        st = new Date(last6month);
                        et = new Date();
                        break;
                }

                var currentDataTimeStr = new Date(targetDateTime);
                var range = moment(currentDataTimeStr).isBetween(st, et);
                if (range) {
                    return true;
                }
                return false;
            }
            return list.filter(function (item) {
                for (var i = 0; i < filterList.length; i++) {
                    var innerFound = false;
                    var columnName = filterList[i]['columnName'];
                    var columnValueList = filterList[i]['columnValue'];
                    //check if time filter is there then do time comparision
                    if( columnName === 'modified_ts'){
                        if(columnValueList && columnValueList[0]){
                            var targetDateTime = columnValueList[0];
                            if(isInTimerange(targetDateTime,item[columnName])){
                                innerFound = true;
                            }
                        }
                    }else if( columnName === 'datasource'){
                        for (var j = 0; j < columnValueList.length; j++) {
                            if (item[columnName] && item[columnName][0] && item[columnName][0]['name'] == columnValueList[j]) {
                                innerFound = true;
                            }
                        }
                    }else if( columnName === 'tag'){
                        for (var j = 0; j < columnValueList.length; j++) {
                            if (item[columnName] && item[columnName].length && (item[columnName].indexOf(columnValueList[j]) != -1)) {
                                innerFound = true;
                            }
                        }
                    }else{
                        for (var j = 0; j < columnValueList.length; j++) {
                            if (item[columnName] == columnValueList[j]) {
                                innerFound = true;
                            }
                        }
                    }
                    if(!innerFound){
                        return false;
                    }
                }
                return true;
            });
        },
		getDataSourcesAPI : function() {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/tableau/datasources/list/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId());
		},
        getTableauDataSources: function(){
            var me = this;
            return $q(function(resolve, reject){
                me.getDataSourcesAPI().then(function (response) {
                    var jsonResponse = x2js.xml_str2json(response.data);
                        if(!jsonResponse['tsResponse'] || !jsonResponse['tsResponse']['datasources']) return;
                        var data = jsonResponse['tsResponse']['datasources']['datasource'];
                        if (Array.isArray(data)) {
                            me.dataSourcesList = data;
                        } else {
                            me.dataSourcesList = [];
                        }
                    resolve();
                });
            });
        },
        //step -1
        getTableauInitialInfo : function () {
            var me = this;
            return $q(function(resolve, reject){
                me.callSiteuserInfoAPI().then(function(response) {
                    var data = response.data.Data;
                    me.setTableauInitialInfo(data,resolve);
                },function(error){
                    reject();
                })
            });
        },//setp -2 setup basic values
        setTableauInitialInfo : function (params, resolve) {
            var me = this;
            me.setSiteId(params.site_id);
            me.setUserId(params.user_id);
            me.setTableauDomain(params.tableau_domain);
            me.loadTableauScripts(params.tableau_domain, params.tableau_version);
            resolve();
        },// only once it will get called, while page loads first time
        getAllDashboardsAndInitializeTableauServices : function (pageSize) {
            var me = this;
            return $q(function (resolve, reject) {
            me.getTableauInitialInfo()
                .then(me.getAllTablueUsers.bind(me))
                .then(me.getTableauAdminUser.bind(me))
                .then(me.getTableauDataSources.bind(me))
                .then(me.getAllTableauDashboards.bind(me))
                .then(me.getEachTableauDashboardDetailts.bind(me))
                .then(me.getLogiAdminUsers.bind(me))
                .then(me.getDashboardSecurityToken.bind(me))
                .then(me.getAllLogiDashboards.bind(me))
                .then(function(){resolve(me.getAllDashboards(null, null, null, true, pageSize));}.bind(me))
                .catch(function(err){console.log("ERROR -> Outer promise"); reject();});
            });
        },
        
        getDashboardDatasourcesList: function() {
            var me = this;
		    var infoserverDomain = GlobalService.getVal('infoserverDomain');
		    return $http.get(infoserverDomain + '/dashboards/connections/list/workbook/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + me.getSiteId() + '/' + me.getWBUser() + '/' + me.getUserId());
		},

        getAllDashboardsnew : function () {
            var me = this;
            return $q(function (resolve, reject) {
            me.getTableauInitialInfo()
                .then(me.getAllTableauDashboards.bind(me))
                .catch(function(err){console.log("ERROR -> Outer promise"); reject();});
            });
        },
        //reload  fresh copy of dashboard


        getSummaryDashObject : function(isTableau) {
            var infoserverDomain = GlobalService.getVal('infoserverDomain');
            if(isTableau){
                return $http.get(infoserverDomain + '/dashboards/summary/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId() +'?tableau=true');
            }else {
                return $http.get(infoserverDomain + '/dashboards/summary/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/NA/' + this.getWBUser() + '/NA?tableau=false');
            }
        },
        newgetAllDashboards : function(isTableau) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                if(isTableau){
                    return $http.get(infoserverDomain + '/dashboards/all/details/merged/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + this.getSiteId() + '/' + this.getWBUser() + '/' + this.getUserId() +'?tableau=true');
                }else {
                    return $http.get(infoserverDomain + '/dashboards/all/details/merged/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/NA/' + this.getWBUser() + '/NA?tableau=false');
                }
        },
        reloadDashboard : function (filterObj, sortBy, queryStr, reloadPagination, pageSize) {
            var me = this;
            return $q(function (resolve, reject) {
            me.getTableauInitialInfo()
                .then(me.getAllTablueUsers.bind(me))
                .then(me.getTableauAdminUser.bind(me))
                .then(me.getAllTableauDashboards.bind(me))
                .then(me.getEachTableauDashboardDetailts.bind(me))
                .then(me.getLogiAdminUsers.bind(me))
                .then(me.getAllLogiDashboards.bind(me))
                .then(function(){resolve(me.getAllDashboards(filterObj, sortBy, queryStr, reloadPagination, pageSize));}.bind(me))
                .catch(function(err){console.log("ERROR -> Outer promise");  reject();});
            });
        },


        addTableauEventListeners: function(viz, app, UserTrackingService) {
        	var workbenchService = this;
        	viz.addEventListener("marksSelection", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("customviewload", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("customviewremove", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("customviewsave", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("customviewsetdefault", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("filterchange", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("parametervaluechange", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("storypointswitch", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
			viz.addEventListener("tabswitch", function () {
			   workbenchService.updateTableauSession(app, app, "Tableau Internal Tracking", {details: 'tableau'}, UserTrackingService);
			});
        },
        updateTableauSession: function(app, module, activity, details, UserTrackingService) {
        	UserTrackingService.standard_user_tracking(app, module, activity, JSON.stringify(details)).then(function() {}, function() {});
        },

        sortDataFromPaginationService: function (sortInfo) {
            this.data.sort(function (a, b) {
                var nameA = a[sortInfo['columnName']].toUpperCase(); // ignore upper and lowercase
                var nameB = b[sortInfo['columnName']].toUpperCase(); // ignore upper and lowercase
                if (sortInfo['sorted']) {
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                } else {
                    if (nameA > nameB) {
                        return -1;
                    }
                    if (nameA < nameB) {
                        return 1;
                    }
                }
                // names must be equal
                return 0;
            });
        },
        loadTableauScripts : function(domain, version) {
        	var jsSubVersion;
        	var versionSplit = version.split(".");
        	
    		if(GlobalService.getVal('tableauVizVersions').hasOwnProperty(versionSplit[0])) {
    			jsSubVersion = GlobalService.getVal('tableauVizVersions')[versionSplit[0]] + "." + (!!versionSplit[1] ? versionSplit[1] : "0");
    		} else {
    			return;
    		}
        	
        	var head = document.getElementsByTagName("head")[0];
        	
        	var script = document.createElement('script');
            script.setAttribute('src', domain + '/javascripts/api/tableau-2.min.js');
            script.setAttribute('type', 'text/javascript');
            head.appendChild(script);
            
            var script = document.createElement('script');
            script.setAttribute('src', domain + '/javascripts/api/tableau-' + jsSubVersion + '.min.js');
            script.setAttribute('type', 'text/javascript');
            head.appendChild(script);
        	
        	var script = document.createElement('link');
            script.setAttribute('href', '/apps/app/css/tableau_' + versionSplit[0] + '.css');
            script.setAttribute('type', 'text/css');
            script.setAttribute('rel', 'stylesheet');
            head.appendChild(script);
            
        },

        handleSessionTimeout: function(response) {
            if (response.data && response.data.hasOwnProperty('Msg') && response.data.Msg.match(/timeout/)) {
                ModalService.sessionTimeout();
            }
        },
        
        getSiteDetails : function() {
            return this.sitedetailsobj;
        },
        setSiteDetails : function(obj) {
            this.sitedetailsobj = obj;
        },

    }
}]);
