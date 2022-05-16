angular.module('gbApp.services', [])

angular.module('gbApp.services').factory('AppService', ['$http', '$window', '$localStorage', 'GlobalService', '$cookies', 'metaDataService', '$location',
    function ($http, $window, $localStorage, GlobalService, $cookies, metaDataService, $location) {
        return {
            logOutUrl: function (msg) {
                var gbUrl = (getCookie("loginurl") ? getCookie("loginurl") : GlobalService.getVal('session_redirect_url')).replace(/\?.*/, '');
                if(msg.toLocaleLowerCase().indexOf('session timeout') != -1){
                    $window.location.href = gbUrl +  "?timeout=true";
                    return;
                }
                $window.location.href = gbUrl;
            },
            logoutInfoserver: function (application) {
                var umsDomain = GlobalService.getVal('umsDomain');
                delete $cookies.prevApplication;
                return $http.get(umsDomain + '/aa/logout?mps=' + GlobalService.getVal('manufacturer') + ':' + GlobalService.getVal('product') + ':' + GlobalService.getVal('schema') + '&feature=' + application);
            },
            setInfoServerUp: function (bool) {
                info_srv_up = bool;
            },
            setAuthorized: function (bool) {
                authorized = bool;
            },
            logoutSessionTimeout: function () {
                localStorage.clear();
                this.logoutInfoserver()
                    .then(this.logOutUrl, this.logOutUrl);
            },
            getUserDomain: function (role) {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.get(umsDomain + '/admin/role/domains/' + (!!this.isGbStudioApp() ? GlobalService.getVal('gbstudio_manufacturer') : GlobalService.getVal('manufacturer')) + '/' + role);
            },
            getMPS: function (gbstudio) {
                var mps = getCookie("mps");

                //for SSO case
                if (!mps || mps == 'null' || mps == 'Null') {
                    mps = this.getMPSfromQueryParam();
                } else {
                    mps = mps.replace(/:/g, '/');
                }
                return mps;
            },
            getMPSfromQueryParam: function () {
                //check if url have mps as parameter; for SSO case
                var regex = new RegExp("(?:[?&]+mps=)([^&]*)?", "i");
                var match = regex.exec($window.location.href);
                var mps = match === null ? match : match[1];
                mps = unescape(mps);
                mps = mps.replace(/:/g, '/');
                //get domain name from url
                // var domain = $location.host().split(/\.(.+)?/)[1];
                // document.cookie = "mps="+mps.replace(/\//g, ":")+";domain="+domain+";path=/";  
                return mps;
            },
        };
    }]);
angular.module('gbApp.services').factory('PasswordService', ['$http', 'GlobalService',
    function ($http, GlobalService) {
        return {
            parseDate: function (datestr) {
                return new Date(datestr.replace(/-/g, "/").replace('T', ' ').substring(0, 19));
            },
            change: function (new_passwd, email) {
                var umsDomain = GlobalService.getVal('umsDomain');
                return $http.post(umsDomain + "/user/change/passwd/" + GlobalService.getVal('manufacturer'), {
                    email: email,
                    token_id: "",
                    passwd: new_passwd
                });
            }
        };
    }]);

angular.module('gbApp.services').factory('UserTrackingService', ['$http', 'GlobalService', '$q', '$cookies', '$timeout', 'AppService', 'metaDataService',
    function ($http, GlobalService, $q, $cookies, $timeout, AppService, metaDataService) {
        var setConfig = false;
        var config = null;
        return {
            standard_user_tracking: function (application, module, activity, details, solrQuery) {
                var umsDomain = GlobalService.getVal('umsDomain');
                var usertrackingDetailsLimit = GlobalService.getVal('usertracking_details_limit');
                var url;
                var result = {};

                //if(activity == "Log View" || activity == "Table View" || activity == "Diff")
                //{			
                try {
                    var detailsJsonObj = JSON.parse(details);
                    if (Object.keys(detailsJsonObj).length > usertrackingDetailsLimit) {

                        for (var index = 0; index < usertrackingDetailsLimit; index++) {
                            var key = Object.keys(detailsJsonObj)[index];
                            result[key] = detailsJsonObj[key]
                        }
                        details = JSON.stringify(result);
                    }
                } catch (err) { }

                //} 
                var params = {};
                if ($cookies.prevApplication && $cookies.prevApplication != application) {
                    params['switched_feature'] = $cookies.prevApplication;
                }
                url = umsDomain + '/user_tracking/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + application + '/' + module + '/' + activity;
                $cookies.prevApplication = application;
                return $http.post(url, {
                    "details": details,
                    "solr_query": !!solrQuery ? solrQuery : ""
                }, { params: params });
            },
            custom_user_tracking: function (d_id, r_id) {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                return $http.get(infoserverDomain + '/user_tracking/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema') + '/' + d_id + '/' + r_id);
            },
            getAllConfig: function () {
                var infoserverDomain = GlobalService.getVal('infoserverDomain');
                if (!setConfig) {
                    setConfig = true;
                    config = $http.get(infoserverDomain + '/uimeta/config/' + GlobalService.getVal('manufacturer') + '/' + GlobalService.getVal('product') + '/' + GlobalService.getVal('schema'), {
                        cache: true
                    });
                }
                return config;
            }
        };
    }]);
angular.module('gbApp.services').factory('metaDataService', ['$cookies', 'GlobalService', '$location',
    function ($cookies, GlobalService, $location) {
        var domain = {};
        var feature = {};
        var user = {};
        var config = {};
        var gbconfig = {};
        var currentPage = "", dashboardtype = "", raACurrentPage = "";
        function gbTrim(str) {
            return str.replace(/^\s+|\s+$/g, '');
        }
        return {
            setCurrentPage: function (page) {
                currentPage = page;
            },
            getCurrentPage: function (page) {
                return currentPage;
            },
            setDashboardType: function (type) {
                dashboardtype = type;
            },
            getDashboardType: function () {
                return dashboardtype;
            },
            setDomain: function (domainInfo) {
                domain = domainInfo;
                GlobalService.setVal('ssoLogoutUrl', domain["sso_logout_url"]);
            },
            setFeature: function (featuresInfo) {
                feature = featuresInfo;
            },
            setUser: function (userInfo) {
                user = userInfo;
                GlobalService.setVal('userSso', user.sso);
            },
            getDomain: function () {
                return domain;
            },
            getDefaultFeature: function () {
                return !!user.is_external ? domain["def_feature_external"] : domain["def_feature_internal"];
            },
            getUser: function () {
                return user;
            },
            //DOMAIN INFO -GETTER
            getManufacturer: function () {
                return domain.mfr;
            },
            getProduct: function () {
                return domain.prod;
            },
            getSchema: function () {
                return domain.sch;
            },
            getSsoIdpId: function () {
                return domain["sso_idp_id"];
            },
            getSsoLoginUrl: function () {
                return domain["sso_login_url"];
            },
            getSsoLogoutUrl: function () {
                return domain["sso_logout_url"];
            },
            getSsoParams: function () {
                return domain["sso_params"];
            },
            getSsoParamsSfdc: function () {
                return domain["sso_params_sfdc"];
            },
            getSsoRoles: function () {
                return domain["sso_roles"];
            },
            getEndCustomer: function () {
                return domain["ec"];
            },
            getFeedbackApiKey: function () {
                return domain["feedback_api_key"];
            },
            getFeedbackBtn: function () {
                return domain["feedback_button"];
            },
            getLogo: function () {
                return domain["logo"];
            },
            getlogourl: function () {
                return domain["logo_url"];
            },
            //FEATURES INFO -GETTER
            getFeatures: function () {
                var mps = null;
                if (!!GlobalService.getVal('showStudio') && GlobalService.getVal('role_details').mps_uidomain[GlobalService.getVal('gb_studio_apps_realm')] == $location.host()) {
                    mps = this.getStudioMPS().replace(/\//g, ":");
                } else {
                    mps = GlobalService.getVal('manufacturer') + ':' + GlobalService.getVal('product') + ':' + GlobalService.getVal('schema');
                }

                if (feature) {
                    var tabList = [];
                    /*for(var key in feature["features"]) {
                        tabList = feature["features"][key];
                        break;
                    }*/
                    for (var key in feature) {

                        if (key == mps) {
                            tabList = feature[key];
                            break;
                        }
                    }
                    if (tabList && tabList.split) {
                        tabList = tabList.split(',');
                        //trim white sapaces
                        for (var i = 0; i < tabList.length; i++) {
                            tabList[i] = gbTrim(tabList[i]);
                        }
                    } else {
                        return {};
                    }
                    var jsonObj = {};
                    for (var i = 0; i < tabList.length; i++) {
                        jsonObj[tabList[i]] = true;
                    }
                    return jsonObj;
                }
            },
            //GET USER INFO
            getUserEmail: function () {
                return user.email;
            },
            getUserType: function () {
                return user.is_external;
            },
            getUserFirstName: function () {
                return user.first_name;
            },
            getUserLastName: function () {
                return user.last_name;
            },
            getDashAdmin: function () {
                return user.dashboard_admin;
            },
            getUserName: function () {
                if ((!user.first_name && !user.last_name) || (user.first_name == 'NA' && user.last_name == 'NA')) {
                    return user.email;
                }
                return (user.first_name != 'NA' ? (user.first_name + " ") : '') + (user.last_name != 'NA' ? user.last_name : '');
            },
            getUserRole: function () {
                return user.role;
            },
            getUserOrgType: function () {
                return user.org_type;
            },
            getSsoUser: function () {
                return user.sso;
            },
            //UI Config
            setUiConfig: function (uiconfig) {
                config = uiconfig;
            },
            getUiConfig: function (uiconfig) {
                return config;
            },
            //GB Config
            setGbConfig: function (config) {
                gbconfig = config;
            },
            getGbConfig: function (uiconfig) {
                return gbconfig;
            },
            getStringToDate: function (str) {
                return moment(str, 'YYYY-MM-DD HH:mm:ss').toDate();
            },
            getTodayDate: function () {
                return moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate();
            }
        };
    }]);